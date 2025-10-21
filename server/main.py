from fastapi import FastAPI
import os
from dotenv import load_dotenv
from ollama import Client
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

class QueryRequest(BaseModel):
    question: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


@app.post("/api/queryllm")
def read_root(request: QueryRequest):
    model = os.getenv("OLLAMA_MODEL")
    client = Client()
    response = client.generate(model=model, prompt=request.question, stream=False)
    return {"answer": response["response"].strip()}
