# 🤖 AI Classroom Copilot

> 📘 *An intelligent RAG-based AI assistant designed to help students and instructors query course materials with citation-backed responses.*

This is the repository for the **Retrieval-Augmented Generation (RAG) AI Classroom Copilot** being developed for a Computer Security course.

The system's goal is to serve as an intelligent assistant, answering student queries using the professor's course materials as its primary knowledge source, thereby enhancing study and review efficiency.

---

## 🛠️ Project Status & Team Structure

The team is currently in the **Setup and Architecture** phase.


---

## 🚀 Getting Started

To run the application locally, you will need to run both the backend server and the frontend client in two separate terminals.

### 1. Backend Setup (Terminal 1)

The backend is a Python server powered by FastAPI.

1.  **Navigate to Project Root**:
    ```bash
    cd /path/to/ai-classroom-copilot
    ```

2.  **Setup Python Environment**:
    ```powershell
    # On Windows, ensure you have Python and pip installed
    # Create and activate a virtual environment
    python -m venv .venv
    .\.venv\Scripts\activate
    
    # Install backend dependencies
    pip install -r server/requirements.txt
    ```

3.  **Start the Backend Server**:
    *   **Important**: Before running the server, you need to set your `PYTHONPATH` environment variable to the project's root directory. This helps Python locate modules correctly.
    ```powershell
    # In PowerShell (run this in each new terminal session for the backend)
    $env:PYTHONPATH = (Get-Location).Path
    ```
    *   Then, start the server:
    ```powershell
    python -m uvicorn server.main:app --reload
    ```
    Keep this terminal open.

### 2. Frontend Setup (Terminal 2)

The frontend is a React application.

1.  **Navigate to Client Directory**: Open a new terminal and navigate into the `client` folder.
    ```bash
    cd /path/to/ai-classroom-copilot/client
    npm install
    npm start
    ```
    This will open the application in your browser, typically at `http://localhost:3000`.

---

## 📚 Key Documentation & Workflow

### Documentation
* **Software Requirements Specification (SRS):** [View SRS Documentation](/docs/SRS.md)
* **Contribution Guidelines:** Read the [CONTRIBUTING.md](CONTRIBUTING.md) file **first** for Git commit and branch standards.

### Contribution Workflow

To maintain a clean and reliable codebase, all contributions **must** be made via the Pull Request (PR) process:

1.  Clone the repository using the official new URL.
2.  Create a **feature branch** for all work.
3.  Submit a **Pull Request** and ensure it follows the **Conventional Commits** standard.
4.  All PRs require **1 approval** before merging into the main branch.


---

### 📅 Project Timeline (Summary)

- **Prototype Presentation:** Monday, October 27, 2025  
- **Final Presentation:** November 24 or December 1, 2025 *(TBD)* 

*(Deadlines subject to instructor confirmation)*

---

### 🧠 Tech Stack (Planned)

| Layer | Technology |
|:------|:------------|
| **Frontend** | React (+ Material UI optional) |
| **Backend** | Python (FastAPI or Flask) |
| **LLM Layer** | Ollama (local models) |
| **Retrieval Framework** | LangChain |
| **Vector Database** | Chroma / FAISS |
| **Metadata Store** | PostgreSQL / SQLite (optional) |

---

### 💡 Acknowledgements

Developed as part of **CEN 3031 – Software Engineering Fundamentals** at  
**Florida Gulf Coast University**, instructed by **Dr. Chengyi Qu**.

---

