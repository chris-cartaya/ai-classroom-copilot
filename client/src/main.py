from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from generation import RetrievalAugmentedGeneration
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows the React frontend to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

# Initialize the RAG system
rag_system = RetrievalAugmentedGeneration()

@app.post("/ask")
async def ask(request: QuestionRequest):
    """
    Receives a question, gets an answer from the RAG system, and returns it.
    """
    logger.info(f"Received question: {request.question}")
    try:
        result = rag_system.ask_question(request.question)
        return result
    except Exception as e:
        logger.error(f"Error processing question: {e}")
        return {"error": "Failed to process the question."}

@app.get("/")
def read_root():
    return {"message": "AI Classroom Copilot backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
