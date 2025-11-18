# 🤖 AI Classroom Copilot

> 📘 _An intelligent RAG-based AI assistant for querying course materials with citation-backed responses._

## 🚀 Quick Start

### Prerequisites

- Python 3.12
- Node.js 18+
- Ollama installed ([ollama.ai](https://ollama.ai))

### Backend Setup

```bash
cd server
python -m venv .venv --prompt .venv
source .venv/Scripts/activate  # On Windows
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup (New Terminal)

```bash
cd client
npm install
npm start  # Opens http://localhost:3000
```

## 📁 Project Structure

```
ai-classroom-copilot/
├── server/                 # Backend (FastAPI)
├── client/                 # Frontend (React)
├── docs/                   # SRS documentation
├── PPdata/                 # Processed slide data
├── outputs/                # Generated files
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── .gitignore
```

## 🌟 Features

- **RAG Q&A**: Answer questions with citations from course slides
- **Local LLM**: Ollama integration with Llama 3.8B + NomIc embeddings
- **File Upload**: Instructor-only document upload
- **Chroma Vector DB**: Persistent document embeddings
- **Responsive UI**: React frontend with theme support

## 🛠 Tech Stack

| Component         | Technology            |
| :---------------- | :-------------------- |
| **Backend**       | FastAPI + Python 3.12 |
| **Frontend**      | React 18              |
| **LLM**           | Ollama (Llama 3.8B)   |
| **Embeddings**    | Ollama (Nomic)        |
| **Vector DB**     | ChromaDB              |
| **Retrieval**     | LangChain             |
| **File Handling** | PyTorch PPTX          |

## 🧪 Test It

1. Role switch to "👨‍🎓 Student"
2. Go to "💬 Classroom Copilot"
3. Ask: "What is machine learning?"
4. See cited response from CEN3031/CEN3078 slides

## 📚 Docs

- **SRS**: [docs/SRS.md](docs/SRS.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)

## 👥 Team

Developed for CEN 3031 - Software Engineering Fundamentals  
Florida Gulf Coast University  
Instructed by Dr. Chengyi Qu
