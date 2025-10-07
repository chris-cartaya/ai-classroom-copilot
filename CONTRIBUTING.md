# 🤝 Contribution Guidelines

Welcome to the Computer Security RAG AI Copilot project! To keep our Git history clean, professional, and easy to review, we follow the **Conventional Commits** standard.

## Commit Message Format

Every commit message **MUST** start with a **type** followed by a colon and a space (`type: description`).

### The Standard Commit Types

Use the table below to decide which prefix best describes your change.

| Type | When to Use It | Example for Our Project |
| :--- | :--- | :--- |
| **`feat`** | A new **feature** or enhancement (user-facing). | `feat: add user query processing logic` |
| **`fix`** | A commit that **fixes a bug** (user-facing). | `fix: prevent chat interface from crashing on long response` |
| **`docs`** | Changes only to **documentation** (like the SRS or README). | `docs: update SRS with agreed-upon NFR-200 performance value` |
| **`refactor`** | Restructuring code without changing functionality. | `refactor: simplify vector storage initialization function` |
| **`test`** | Adding or correcting tests. | `test: add unit tests for retrieval scoring` |
| **`chore`** | Routine maintenance, setup, config changes, dependency bumps. | `chore: update Python dependencies in requirements.txt` |

---

## Pull Request (PR) Workflow

1.  **Create a New Branch** for your work (e.g., `feature/login-ui` or `fix/vector-db-bug`).
2.  **Commit** your changes using the Conventional Commit standard above.
3.  **Open a Pull Request** targeting the `main` branch.
4.  **Wait for 1 Approval** from a teammate or the project leader before merging.
