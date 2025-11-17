from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, Form, Response, status
from pydantic import BaseModel, EmailStr
from langchain_chroma import Chroma
from langchain_community.embeddings import OllamaEmbeddings
from .generation import RetrievalAugmentedGeneration
from .ingest import ingest_pptx_to_chroma, pptx_to_documents
from .profile import get_profile, update_profile
import logging
import os
import sqlite3
from datetime import datetime
from typing import List, Dict, Any, Literal, Optional

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


# --- Profile Management Models ---

class NotificationPreferences(BaseModel):
    newMaterial: bool = True
    newReply: bool = True

class ProfilePreferences(BaseModel):
    theme: Literal["light", "dark"] = "dark"
    fontSize: Literal["small", "medium", "large"] = "medium"
    notifications: NotificationPreferences = NotificationPreferences()

class Profile(BaseModel):
    name: str = "Alex Doe"
    email: EmailStr = "alex.doe@example.com"
    role: Literal["student", "instructor"] = "student"
    preferences: ProfilePreferences = ProfilePreferences()

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[Literal["student", "instructor"]] = None
    preferences: Optional[ProfilePreferences] = None

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
        # Read content into memory to check size
        content = await file.read()
        size_bytes = len(content)

        # Enforce a 25 MB file size limit
        if size_bytes > 25 * 1024 * 1024:
            error_msg = "File exceeds 25MB limit."
            logger.warning(
                f"Upload failed for '{original_name}': size ({size_bytes / 1024 / 1024:.2f}MB) is over the limit."
            )
            return {"error": error_msg}

        # Save file to disk
        with open(save_path, "wb") as f:
            f.write(content)

        # Ingest into Chroma with metadata linking to week/module and slide number
        num_docs = ingest_pptx_to_chroma(save_path, week_title=week_title, persist_directory=CHROMA_DIR)

        # Persist material record
        conn = _get_db_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO materials (filename, week_title, uploaded_at, size_bytes) VALUES (?, ?, ?, ?)",
            (original_name, week_title, datetime.utcnow().isoformat(), size_bytes),
        )
        material_id = cur.lastrowid
        conn.commit()
        conn.close()

        return {
            "id": material_id,
            "status": "processed",
            "filename": original_name,
            "week_title": week_title,
            "size_bytes": size_bytes,
            "slides_indexed": num_docs,
        }
    except Exception as e:
        logger.error(f"Failed to process upload {original_name}: {e}")
        return {"error": f"Failed to upload/process file: {str(e)}"}


@app.get("/materials/{material_id}/view")
async def view_material_content(material_id: int):
    """
    Retrieves the extracted text content of a specified material.
    """
    conn = _get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT filename, week_title FROM materials WHERE id = ?", (material_id,))
    row = cur.fetchone()
    conn.close()

    if not row:
        return {"error": "Material not found."}

    filename = row["filename"]
    week_title = row["week_title"]
    file_path = os.path.join(UPLOADS_DIR, filename)

    if not os.path.exists(file_path):
        logger.error(f"File not found for material {material_id}: {file_path}")
        return {"error": "File not found on server."}

    try:
        # Extract documents (slides) from the PPTX file
        documents = pptx_to_documents(file_path, week_title=week_title)
        
        # Convert Document objects to a more JSON-friendly format
        extracted_content = [
            {
                "slide": doc.metadata.get("slide", -1),
                "content": doc.page_content,
            }
            for doc in documents
        ]
        
        return {
            "filename": filename,
            "week_title": week_title,
            "content": extracted_content
        }

    except Exception as e:
        logger.error(f"Failed to extract content from {filename}: {e}")
        return {"error": f"Failed to extract content from file: {str(e)}"}


# --- Profile Management Endpoints ---

@app.get("/profile", response_model=Profile)
async def get_current_profile():
    """Retrieves the current user's profile."""
    return get_profile()

@app.put("/profile", response_model=Profile)
async def update_current_profile(profile_update: ProfileUpdateRequest):
    """Updates the current user's profile."""
    # .dict(exclude_unset=True) is crucial to only pass the fields that were actually set in the request
    update_data = profile_update.dict(exclude_unset=True)
    return update_profile(update_data)


@app.delete("/materials/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_material(material_id: int):
    """
    Deletes a material: the physical file, its vector embeddings, and its database record.
    """
    # 1. Get filename from the database
    conn = _get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT filename FROM materials WHERE id = ?", (material_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        # Even if it doesn't exist, returning 204 is idempotent
        logger.warning(f"Deletion requested for non-existent material ID: {material_id}")
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    filename = row["filename"]
    logger.info(f"Starting deletion for material ID: {material_id}, filename: {filename}")

    # 2. Delete from ChromaDB
    try:
        # Initialize a Chroma client to interact with the collection
        embedding_function = OllamaEmbeddings(model="nomic-embed-text", base_url="http://localhost:11434")
        vector_store = Chroma(
            persist_directory=CHROMA_DIR,
            embedding_function=embedding_function
        )
        
        docs_to_delete = vector_store.get(where={"source": filename})
        if docs_to_delete and docs_to_delete.get('ids'):
            logger.info(f"Found {len(docs_to_delete['ids'])} vector embeddings to delete for source: {filename}")
            vector_store.delete(ids=docs_to_delete['ids'])
            logger.info(f"Successfully deleted embeddings.")
        else:
            logger.warning(f"No embeddings found in ChromaDB for source: {filename}")

    except Exception as e:
        logger.error(f"Error deleting from ChromaDB for source {filename}: {e}")

    # 3. Delete the physical file
    file_path = os.path.join(UPLOADS_DIR, filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            logger.info(f"Successfully deleted physical file: {file_path}")
        except OSError as e:
            logger.error(f"Error deleting file {file_path}: {e}")
    else:
        logger.warning(f"Physical file not found for deletion: {file_path}")

    # 4. Delete the record from the materials table
    try:
        cur.execute("DELETE FROM materials WHERE id = ?", (material_id,))
        conn.commit()
        logger.info(f"Successfully deleted record from 'materials' table for ID: {material_id}")
    except sqlite3.Error as e:
        logger.error(f"Error deleting from materials table for ID {material_id}: {e}")
    finally:
        conn.close()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/")
def read_root():
    return {"message": "AI Classroom Copilot backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
