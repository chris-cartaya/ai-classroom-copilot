# 🤖 AI Classroom Copilot

> 📘 _An intelligent RAG-based AI assistant designed to help students and instructors query course materials with citation-backed responses._

This is the repository for the **Retrieval-Augmented Generation (RAG) AI Classroom Copilot** being developed for a **Computer Security** course.

The system's goal is to serve as an intelligent assistant, answering student queries using the professor's course materials as its primary knowledge source, thereby enhancing study and review efficiency.

---

## 🛠️ Project Status & Team Structure

**✅ FULLY FUNCTIONAL SYSTEM** - The AI Classroom Copilot is now operational with working RAG capabilities!

### Current Features

- ✅ **Document Upload**: Support for PDF, DOCX, PPTX, and TXT files
- ✅ **LLM Integration**: Direct chat with phi3:3.8b model via Ollama
- ✅ **RAG System**: Retrieval-augmented generation with ChromaDB
- ✅ **Web Interface**: React-based frontend for easy interaction
- ✅ **API Endpoints**: RESTful API for all operations
- ✅ **Database Management**: View and manage stored documents

---

## 🚀 Key Documentation & Workflow

### Documentation

- **Software Requirements Specification (SRS):** [View SRS Documentation](/docs/SRS.md)
- **Contribution Guidelines:** Read the [CONTRIBUTING.md](CONTRIBUTING.md) file **first** for Git commit and branch standards.

### Contribution Workflow

To maintain a clean and reliable codebase, all contributions **must** be made via the Pull Request (PR) process:

1. Clone the repository using the official project URL.
2. Create a **feature branch** for all new work.
3. Commit using the **Conventional Commits** standard.
4. Submit a **Pull Request** and obtain **1 approval** before merging into `main`.

---

## 🧰 Backend Setup Instructions

> 🐍 **Requires Python 3.12 or higher**  
> 💡 **Requires pip 24.0+** for proper dependency resolution.  
> Run this first to ensure you're up to date:
>
> ```bash
> python -m pip install --upgrade pip
> ```

### 1️⃣ Clone this repo and `cd` into `server` directory

```bash
git clone https://github.com/chris-cartaya/ai-classroom-copilot.git

# server directory is backend folder
cd ai-classroom-copilot/server
```

### 2️⃣ Create and activate a virtual environment (venv)

```bash
# Windows (Git Bash or PowerShell)
python -m venv venv
source venv/Scripts/activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

**Hint**. Command to stop virtual environment: `deactivate`

### 3️⃣ Install dependencies (after you activate venv)

```bash
pip install -r requirements.txt
```

**VS Code Tip**: After activating venv, select the correct Python interpreter in VS Code:

- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- Type "Python: Select Interpreter"
- Choose the venv Python (should show the venv path)

### 4️⃣ Launch the FastAPI server

```bash
python -m uvicorn main:app --reload
```

Once running, open [http://127.0.0.1:8000](http://127.0.0.1:8000) to view the "Root endpoint" (server homepage) or open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
to explore the interactive Swagger API documentation.

### 5️⃣ (Optional) Developer Notes

- It’s recommended to **use a separate venv per Python version** (e.g., `venv312`) for clarity, but `venv` is most common.
- `pip` is not listed as a dependency in `requirements.txt`, but **pip ≥ 24.0** is recommended.
- If any dependency issues occur, ensure both your **Python** and **pip** are up to date.

---

## 🎨 Frontend Setup Instructions

> ⚛️ **Requires Node.js 16+ and npm**

### 1️⃣ Install Dependencies

```bash
cd client
npm install
```

### 2️⃣ Start Development Server

```bash
npm start
```

The React app will open at [http://localhost:3000](http://localhost:3000)

---

## 🔧 Prerequisites

### Ollama Setup (Required)

1. **Install Ollama**: Download from [ollama.ai](https://ollama.ai)
2. **Pull Required Models**:
   ```bash
   ollama pull nomic-embed-text
   ollama pull phi3:3.8b
   ```
3. **Verify Installation**:
   ```bash
   ollama list
   # Should show: nomic-embed-text and phi3:3.8b
   ```

---

## 📡 API Documentation

### Endpoints Overview

| Method | Endpoint     | Description             |
| ------ | ------------ | ----------------------- |
| GET    | `/`          | Health check            |
| GET    | `/health`    | System status           |
| POST   | `/chat`      | Direct LLM conversation |
| POST   | `/ask`       | RAG-powered Q&A         |
| POST   | `/upload`    | Upload documents        |
| GET    | `/documents` | List stored documents   |
| DELETE | `/documents` | Clear all documents     |

### Key Endpoints

#### Chat with LLM

```bash
curl -X POST "http://localhost:8000/chat" \
  -F "question=What is 2 + 2?"
```

#### Upload Documents

```bash
curl -X POST "http://localhost:8000/upload" \
  -F "files=@document.pdf"
```

#### View Database

```bash
curl http://localhost:8000/documents
```

---

## 🚀 Usage Examples

### 1. Basic LLM Chat

1. Start both servers (backend + frontend)
2. Open [http://localhost:3000](http://localhost:3000)
3. Ask: "What is the capital of France?"
4. Get direct LLM response

### 2. Document Q&A (RAG)

1. Upload course materials (PDF/DOCX/PPTX/TXT)
2. Ask questions about the content
3. Receive answers with citations

### 3. Database Management

- View stored documents: `http://localhost:8000/documents`
- Clear database: `DELETE http://localhost:8000/documents`

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  FastAPI Backend │
│   (localhost:3000)  │  (localhost:8000) │
└─────────┬───────┘    └─────────┬───────┘
          │                     │
          └─────────┬───────────┘
                    │
          ┌─────────▼─────────┐
          │                   │
          │   Ollama Models   │
          │ - phi3:3.8b       │
          │ - nomic-embed-text│
          │                   │
          └─────────┬─────────┘
                    │
          ┌─────────▼─────────┐
          │                   │
          │   ChromaDB        │
          │   Vector Store    │
          │                   │
          └───────────────────┘
```

**Data Flow:**

1. User uploads documents → Processed into chunks → Stored in ChromaDB
2. User asks question → Retrieved relevant chunks → Sent to LLM → Response with citations

---

## 🧠 Tech Stack (Active)

| Layer                   | Technology            |
| :---------------------- | :-------------------- |
| **Frontend**            | React with JavaScript |
| **Backend**             | Python (FastAPI)      |
| **LLM Layer**           | Ollama (local models) |
| **Retrieval Framework** | LangChain             |
| **Vector Database**     | Chroma                |

---

## 📅 Project Timeline (Summary)

| Milestone                  | Date                                    |
| :------------------------- | :-------------------------------------- |
| **Prototype Presentation** | Monday, October 27, 2025 ✅             |
| **Final Presentation**     | November 24 or December 1, 2025 _(TBD)_ |

_(Deadlines subject to instructor confirmation)_

---

## 💡 Acknowledgements

Developed as part of **CEN 3031 – Software Engineering Fundamentals** at  
**Florida Gulf Coast University**, instructed by **Dr. Chengyi Qu**.

---
