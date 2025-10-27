"""
FastAPI server for AI Classroom Co-Pilot RAG System
Provides API endpoints for file upload and question answering
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import shutil
import logging
from typing import List, Dict, Any
import tempfile
from pathlib import Path

# Import our existing RAG system
from generation import RetrievalAugmentedGeneration
from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Classroom Co-Pilot API",
    description="RAG system for educational document Q&A",
    version="1.0.0"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG system
rag_system = RetrievalAugmentedGeneration()

# Supported file types for upload
SUPPORTED_EXTENSIONS = {'.pdf', '.txt', '.docx', '.doc'}
UPLOAD_DIR = Path("./uploaded_files")
CHROMA_DIR = Path("./chroma_db")

# Create directories if they don't exist
UPLOAD_DIR.mkdir(exist_ok=True)
CHROMA_DIR.mkdir(exist_ok=True)

def get_file_loader(file_path: Path):
    """Get appropriate document loader based on file extension"""
    extension = file_path.suffix.lower()

    if extension == '.pdf':
        return PyPDFLoader(str(file_path))
    elif extension in ['.txt']:
        return TextLoader(str(file_path))
    elif extension in ['.docx', '.doc']:
        return Docx2txtLoader(str(file_path))
    else:
        raise ValueError(f"Unsupported file type: {extension}")

def process_uploaded_file(file_path: Path, filename: str) -> List[Document]:
    """Process uploaded file and return document chunks"""
    try:
        # Load document based on file type
        loader = get_file_loader(file_path)
        documents = loader.load()

        # Split documents into chunks for better retrieval
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )

        chunks = text_splitter.split_documents(documents)

        # Add metadata to chunks
        for i, chunk in enumerate(chunks):
            chunk.metadata.update({
                'source': filename,
                'chunk_index': i,
            })

        logger.info(f"Processed {filename}: {len(chunks)} chunks created")
        return chunks

    except Exception as e:
        logger.error(f"Error processing file {filename}: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "AI Classroom Co-Pilot API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "upload_dir": str(UPLOAD_DIR),
        "chroma_dir": str(CHROMA_DIR)
    }

@app.post("/ask")
async def ask_question(question: str = Form(...)):
    """
    Ask a question to the RAG system
    Returns answer with citations from uploaded documents
    """
    try:
        if not question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty")

        logger.info(f"Received question: {question}")

        # Use RAG system to get answer
        result = rag_system.ask_question(question)

        return {
            "question": result["question"],
            "answer": result["answer"],
            "documents_retrieved": result["documents_retrieved"],
            "status": "success"
        }

    except Exception as e:
        logger.error(f"Error processing question: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Upload files to the RAG system
    Files are processed and added to the vector database
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    uploaded_files = []
    failed_files = []

    try:
        for file in files:
            # Validate file extension
            file_extension = Path(file.filename).suffix.lower()
            if file_extension not in SUPPORTED_EXTENSIONS:
                failed_files.append({
                    "filename": file.filename,
                    "error": f"Unsupported file type: {file_extension}"
                })
                continue

            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
                # Write uploaded file content to temp file
                content = await file.read()
                temp_file.write(content)
                temp_file_path = Path(temp_file.name)

            try:
                # Process the file
                chunks = process_uploaded_file(temp_file_path, file.filename)

                # Add chunks to vector database
                if chunks:
                    # Import here to avoid circular imports
                    from retrieval import SlideRetriever
                    retriever = SlideRetriever()

                    # Add documents to ChromaDB
                    retriever.vector_store.add_documents(chunks)

                    uploaded_files.append({
                        "filename": file.filename,
                        "chunks_created": len(chunks),
                        "status": "success"
                    })
                else:
                    failed_files.append({
                        "filename": file.filename,
                        "error": "No content could be extracted"
                    })

            except Exception as e:
                logger.error(f"Error processing {file.filename}: {e}")
                failed_files.append({
                    "filename": file.filename,
                    "error": str(e)
                })
            finally:
                # Clean up temp file
                if temp_file_path.exists():
                    temp_file_path.unlink()

        return {
            "uploaded_files": uploaded_files,
            "failed_files": failed_files,
            "total_uploaded": len(uploaded_files),
            "total_failed": len(failed_files)
        }

    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.delete("/documents")
async def clear_documents():
    """Clear all documents from the vector database"""
    try:
        from retrieval import SlideRetriever
        retriever = SlideRetriever()

        # Get all document IDs and delete them
        all_docs = retriever.vector_store.get()
        if all_docs and all_docs['ids']:
            retriever.vector_store.delete(all_docs['ids'])

        return {"message": "All documents cleared from database", "status": "success"}

    except Exception as e:
        logger.error(f"Error clearing documents: {e}")
        raise HTTPException(status_code=500, detail=f"Error clearing documents: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
