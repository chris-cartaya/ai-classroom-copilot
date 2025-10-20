# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# 🤖 AI Classroom Copilot

> 📘 *An intelligent RAG-based AI assistant designed to help students and instructors query course materials with citation-backed responses.*

This is the repository for the **Retrieval-Augmented Generation (RAG) AI Classroom Copilot** being developed for a Computer Security course.

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

