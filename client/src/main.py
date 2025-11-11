from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, Form
from pydantic import BaseModel
from generation import RetrievalAugmentedGeneration
from ingest import ingest_pptx_to_chroma
import logging
import os
import sqlite3
from datetime import datetime
from typing import List, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development: allow any origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

# Initialize the RAG system
rag_system = RetrievalAugmentedGeneration()

DB_PATH = os.path.join(os.path.dirname(__file__), "app.db")
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
CHROMA_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(CHROMA_DIR, exist_ok=True)


def _get_db_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def _init_db():
    conn = _get_db_conn()
    cur = conn.cursor()
    # FAQs table stores question normalization by using question as primary key.
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS faqs (
            question TEXT PRIMARY KEY,
            answer TEXT NOT NULL,
            ask_count INTEGER NOT NULL DEFAULT 1,
            last_asked TEXT NOT NULL
        );
        """
    )
    # Materials table is minimal; associates a material with a week title.
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS materials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            week_title TEXT NOT NULL,
            uploaded_at TEXT NOT NULL,
            size_bytes INTEGER NOT NULL
        );
        """
    )
    conn.commit()
    conn.close()


_init_db()


def upsert_faq(question: str, answer: str):
    conn = _get_db_conn()
    cur = conn.cursor()
    now = datetime.utcnow().isoformat()
    # Try update first; if not exists, insert
    cur.execute(
        "UPDATE faqs SET answer = ?, ask_count = ask_count + 1, last_asked = ? WHERE question = ?",
        (answer, now, question.strip()),
    )
    if cur.rowcount == 0:
        cur.execute(
            "INSERT INTO faqs (question, answer, ask_count, last_asked) VALUES (?, ?, ?, ?)",
            (question.strip(), answer, 1, now),
        )
    conn.commit()
    conn.close()


@app.post("/ask")
async def ask(request: QuestionRequest):
    """
    Receives a question, gets an answer from the RAG system, and returns it.
    """
    logger.info(f"Received question: {request.question}")
    try:
        result = rag_system.ask_question(request.question)
        # Record to FAQs store for professors
        try:
            upsert_faq(question=request.question, answer=result.get("answer", ""))
        except Exception as db_err:
            logger.warning(f"Failed to upsert FAQ: {db_err}")
        return result
    except Exception as e:
        logger.error(f"Error processing question: {e}")
        return {"error": "Failed to process the question."}


@app.get("/faqs")
def list_faqs() -> List[Dict[str, Any]]:
    conn = _get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT question, answer, ask_count, last_asked FROM faqs ORDER BY ask_count DESC, last_asked DESC")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows


@app.get("/materials")
def list_materials_grouped() -> List[Dict[str, Any]]:
    """
    Returns uploaded materials grouped by week, in a shape the frontend can consume:
    [
      { "id": "week-1", "title": "Week 1", "materials": [
          { "id": 1, "name": "Lecture.pptx", "size_bytes": 12345, "uploadDate": "2025-11-11", "status": "processed" }
      ]}
    ]
    """
    conn = _get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, filename, week_title, uploaded_at, size_bytes FROM materials ORDER BY uploaded_at ASC, id ASC")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()

    # Group by week_title
    grouped: Dict[str, List[Dict[str, Any]]] = {}
    for r in rows:
        week = r["week_title"]
        grouped.setdefault(week, []).append({
            "id": r["id"],
            "name": r["filename"],
            "size_bytes": r["size_bytes"],
            "uploadDate": (r["uploaded_at"] or "").split("T")[0],
            "status": "processed"
        })

    # Build ordered weeks list; preserve insertion order of keys
    weeks: List[Dict[str, Any]] = []
    for idx, (week_title, mats) in enumerate(grouped.items(), start=1):
        weeks.append({
            "id": f"week-{idx}",
            "title": week_title,
            "materials": mats
        })

    return weeks


@app.post("/upload")
async def upload_material(file: UploadFile = File(...), week_title: str = Form("Unassigned")):
    """
    Upload a PPTX file and ingest it into the Chroma vector store.
    Returns material metadata and number of slides ingested.
    """
    original_name = file.filename
    ext = os.path.splitext(original_name)[1].lower()
    if ext not in [".pptx"]:
        return {"error": "Only .pptx files are supported at this time."}

    save_path = os.path.join(UPLOADS_DIR, original_name)
    try:
        # Save file to disk
        with open(save_path, "wb") as f:
            content = await file.read()
            f.write(content)
        size_bytes = os.path.getsize(save_path)

        # Ingest into Chroma with metadata linking to week/module and slide number
        num_docs = ingest_pptx_to_chroma(save_path, week_title=week_title, persist_directory=CHROMA_DIR)

        # Persist material record
        conn = _get_db_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO materials (filename, week_title, uploaded_at, size_bytes) VALUES (?, ?, ?, ?)",
            (original_name, week_title, datetime.utcnow().isoformat(), size_bytes),
        )
        conn.commit()
        conn.close()

        return {
            "status": "processed",
            "filename": original_name,
            "week_title": week_title,
            "size_bytes": size_bytes,
            "slides_indexed": num_docs,
        }
    except Exception as e:
        logger.error(f"Failed to process upload {original_name}: {e}")
        return {"error": f"Failed to upload/process file: {str(e)}"}


@app.get("/")
def read_root():
    return {"message": "AI Classroom Copilot backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
