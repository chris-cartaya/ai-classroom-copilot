import sys
import os
import threading
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, Form, Response, status
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from langchain_chroma import Chroma
from langchain_community.embeddings import OllamaEmbeddings
from server.generation import RetrievalAugmentedGeneration
from server.ingest import ingest_pptx_to_chroma, pptx_to_documents
from server.profile import get_profile, update_profile
import logging
import sqlite3
from datetime import datetime
from typing import List, Dict, Any, Literal, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Define constants
DB_PATH = os.path.join(os.path.dirname(__file__), "app.db")
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
CHROMA_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

# --- File Watcher and Bulk Ingestion ---

class PPTXHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith('.pptx'):
            logger.info(f"New PPTX file detected: {event.src_path}")
            self.ingest_file(event.src_path)

    def ingest_file(self, file_path):
        filename = os.path.basename(file_path)
        try:
            week_title = filename.split('-')[0].strip()
        except IndexError:
            week_title = "Unassigned"
        
        logger.info(f"Auto-ingesting '{filename}' with week title '{week_title}'...")
        try:
            ingest_pptx_to_chroma(
                file_path=file_path,
                week_title=week_title,
                persist_directory=CHROMA_DIR
            )
            logger.info(f"Successfully auto-ingested '{filename}'.")

            # Also update the SQLite database
            conn = _get_db_conn()
            cur = conn.cursor()
            
            # Check if the material already exists to avoid duplicates
            cur.execute("SELECT id FROM materials WHERE filename = ?", (filename,))
            if cur.fetchone() is None:
                try:
                    size_bytes = os.path.getsize(file_path)
                    cur.execute(
                        "INSERT INTO materials (filename, week_title, uploaded_at, size_bytes) VALUES (?, ?, ?, ?)",
                        (filename, week_title, datetime.utcnow().isoformat(), size_bytes),
                    )
                    conn.commit()
                    logger.info(f"'{filename}' also added to SQLite materials table.")
                except Exception as e:
                    logger.error(f"Failed to add '{filename}' to SQLite: {e}")
                    conn.rollback()
            else:
                logger.info(f"'{filename}' already exists in SQLite materials table.")

            conn.close()
        except Exception as e:
            logger.error(f"Failed to auto-ingest '{filename}': {e}")

def start_watcher():
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    os.makedirs(CHROMA_DIR, exist_ok=True)
    event_handler = PPTXHandler()
    observer = Observer()
    observer.schedule(event_handler, UPLOADS_DIR, recursive=False)
    observer.start()
    logger.info(f"Started watching directory '{UPLOADS_DIR}' for new .pptx files.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

def ingest_existing_powerpoints():
    """Scans for existing PowerPoints and ingests them."""
    directories_to_scan = ["./PPdata", "./server/uploads"]
    logger.info(f"Performing one-time scan of {directories_to_scan} for existing PowerPoints...")
    
    for directory in directories_to_scan:
        if not os.path.exists(directory):
            logger.warning(f"Directory not found for initial scan: {directory}. Skipping.")
            continue
        
        for filename in os.listdir(directory):
            if filename.endswith(".pptx"):
                file_path = os.path.join(directory, filename)
                logger.info(f"Found existing file: {file_path}")
                PPTXHandler().ingest_file(file_path)

@app.on_event("startup")
async def startup_event():
    # Use threading to run background tasks
    watcher_thread = threading.Thread(target=start_watcher, daemon=True)
    ingest_thread = threading.Thread(target=ingest_existing_powerpoints, daemon=True)
    
    watcher_thread.start()
    ingest_thread.start()

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class QuestionRequest(BaseModel):
    question: str

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

# --- RAG System Initialization ---
rag_system = RetrievalAugmentedGeneration(persist_directory=CHROMA_DIR)

# --- Database Initialization ---
def _get_db_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def _init_db():
    conn = _get_db_conn()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS faqs (
            question TEXT PRIMARY KEY,
            answer TEXT NOT NULL,
            ask_count INTEGER NOT NULL DEFAULT 1,
            last_asked TEXT NOT NULL
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS materials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            week_title TEXT NOT NULL,
            uploaded_at TEXT NOT NULL,
            size_bytes INTEGER NOT NULL
        );
    """)
    conn.commit()
    conn.close()

_init_db()

# --- API Endpoints ---
def upsert_faq(question: str, answer: str):
    conn = _get_db_conn()
    cur = conn.cursor()
    now = datetime.utcnow().isoformat()
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
    logger.info(f"Received question: {request.question}")
    try:
        result = rag_system.ask_question(request.question)
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
    conn = _get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, filename, week_title, uploaded_at, size_bytes FROM materials ORDER BY uploaded_at ASC, id ASC")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()

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
    original_name = file.filename
    if not original_name.endswith(".pptx"):
        return {"error": "Only .pptx files are supported at this time."}

    save_path = os.path.join(UPLOADS_DIR, original_name)
    try:
        content = await file.read()
        size_bytes = len(content)

        if size_bytes > 25 * 1024 * 1024:
            logger.warning(f"Upload failed for '{original_name}': size is over the 25MB limit.")
            return {"error": "File exceeds 25MB limit."}

        with open(save_path, "wb") as f:
            f.write(content)

        num_docs = ingest_pptx_to_chroma(save_path, week_title=week_title, persist_directory=CHROMA_DIR)

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

@app.get("/files")
async def list_files():
    """
    Lists all files in the UPLOADS_DIR directory.
    """
    if not os.path.exists(UPLOADS_DIR) or not os.path.isdir(UPLOADS_DIR):
        logger.warning(f"Uploads directory '{UPLOADS_DIR}' not found.")
        return {"error": "Files directory not found on server."}

    try:
        files = [f for f in os.listdir(UPLOADS_DIR) if os.path.isfile(os.path.join(UPLOADS_DIR, f))]
        return {"files": files}
    except Exception as e:
        logger.error(f"Failed to list files in '{UPLOADS_DIR}': {e}")
        return {"error": f"Failed to list files: {str(e)}"}

@app.get("/materials/{material_id}/view")
async def view_material_content(material_id: int):
    conn = _get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT filename, week_title FROM materials WHERE id = ?", (material_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        return {"error": "Material not found."}

    file_path = os.path.join(UPLOADS_DIR, row["filename"])
    if not os.path.exists(file_path):
        return {"error": "File not found on server."}

    try:
        documents = pptx_to_documents(file_path, week_title=row["week_title"])
        extracted_content = [{"slide": doc.metadata.get("slide", -1), "content": doc.page_content} for doc in documents]
        return {"filename": row["filename"], "week_title": row["week_title"], "content": extracted_content}
    except Exception as e:
        logger.error(f"Failed to extract content from {row['filename']}: {e}")
        return {"error": f"Failed to extract content: {str(e)}"}

@app.get("/profile", response_model=Profile)
async def get_current_profile():
    return get_profile()

@app.put("/profile", response_model=Profile)
async def update_current_profile(profile_update: ProfileUpdateRequest):
    update_data = profile_update.dict(exclude_unset=True)
    return update_profile(update_data)

@app.delete("/materials/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_material(material_id: int):
    conn = _get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT filename FROM materials WHERE id = ?", (material_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    filename = row["filename"]
    
    try:
        embedding_function = OllamaEmbeddings(model="nomic-embed-text", base_url="http://localhost:11434")
        vector_store = Chroma(persist_directory=CHROMA_DIR, embedding_function=embedding_function)
        docs_to_delete = vector_store.get(where={"source": filename})
        if docs_to_delete and docs_to_delete.get('ids'):
            vector_store.delete(ids=docs_to_delete['ids'])
    except Exception as e:
        logger.error(f"Error deleting from ChromaDB for source {filename}: {e}")

    file_path = os.path.join(UPLOADS_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    cur.execute("DELETE FROM materials WHERE id = ?", (material_id,))
    conn.commit()
    conn.close()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.get("/")
def read_root():
    return {"message": "AI Classroom Copilot backend is running"}

from fastapi.staticfiles import StaticFiles

...

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

if __name__ == "__main__":
    import uvicorn
    # This allows the app to be run directly for development
    # The command `python -m uvicorn server.main:app --reload` is preferred
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)