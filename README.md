# 🤖 AI Classroom Copilot

> 📘 *An intelligent RAG-based AI assistant designed to help students and instructors query course materials with citation-backed responses.*

This is the repository for the **Retrieval-Augmented Generation (RAG) AI Classroom Copilot** being developed for a **Computer Security** course.

The system's goal is to serve as an intelligent assistant, answering student queries using the professor's course materials as its primary knowledge source, thereby enhancing study and review efficiency.

---

## 🛠️ Project Status & Team Structure

The team is currently in the **Setup and Architecture** phase.

---

## 🚀 Key Documentation & Workflow

### Documentation
* **Software Requirements Specification (SRS):** [View SRS Documentation](/docs/SRS.md)
* **Contribution Guidelines:** Read the [CONTRIBUTING.md](CONTRIBUTING.md) file **first** for Git commit and branch standards.

### Contribution Workflow
To maintain a clean and reliable codebase, all contributions **must** be made via the Pull Request (PR) process:

1. Clone the repository using the official project URL.
2. Create a **feature branch** for all new work.
3. Commit using the **Conventional Commits** standard.
4. Submit a **Pull Request** and obtain **1 approval** before merging into `main`.

---

## 🧰 Development Environment Setup

> 🐍 **Requires Python 3.12 or higher**  
> 💡 **Requires pip 24.0+** for proper dependency resolution.  
> Run this first to ensure you're up to date:
> ```bash
> python -m pip install --upgrade pip
> ```

### 1️⃣ Create and activate a virtual environment
```bash
# Windows (Git Bash or PowerShell)
python -m venv venv
source venv/Scripts/activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```
### 2️⃣ Install dependencies
```bash
pip install -r requirements.txt
```
### 3️⃣ Launch the FastAPI server
```bash
python -m uvicorn main:app --reload
```

Once running, open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)  
to explore the interactive Swagger API documentation.

### 4️⃣ (Optional) Developer Notes
* It’s recommended to **use a separate venv per Python version** (e.g., `venv312`) for clarity.
* `pip` is not listed as a dependency in `requirements.txt`, but **pip ≥ 24.0** is recommended.
* If any dependency issues occur, ensure both your **Python** and **pip** are up to date.

---

## 🧠 Tech Stack (Active)

| Layer | Technology |
|:------|:------------|
| **Frontend** | React with JavaScript |
| **Backend** | Python (FastAPI) |
| **LLM Layer** | Ollama (local models) |
| **Retrieval Framework** | LangChain |
| **Vector Database** | Chroma |

---

## 📅 Project Timeline (Summary)

| Milestone | Date |
|:-----------|:------|
| **Prototype Presentation** | Monday, October 27, 2025 |
| **Final Presentation** | November 24 or December 1, 2025 *(TBD)* |

*(Deadlines subject to instructor confirmation)*

---

## 💡 Acknowledgements

Developed as part of **CEN 3031 – Software Engineering Fundamentals** at  
**Florida Gulf Coast University**, instructed by **Dr. Chengyi Qu**.

---