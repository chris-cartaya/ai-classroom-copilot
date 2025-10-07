# 🤝 Contribution Guidelines

Welcome to the Computer Security RAG AI Copilot project! To keep our Git history clean, professional, and easy to review, we follow the **Conventional Commits** standard.

## 1. Commit Message Standard: Conventional Commits

The commit message structure **MUST** adhere to the following format: `type: Subject (imperative mood)`

**Crucial Rules for Clarity and Structure:**
1.  **Type Prefix:** Every commit must start with a valid `type:` (e.g., `feat`, `fix`, `docs`). See table below.
2.  **Subject Length:** The subject line **MUST NOT exceed 50 characters** (including the type prefix). This forces a clear, concise summary.
3.  **Capitalization:** The subject **MUST** start with a **capital letter** (the part after the colon).
4.  **Imperative Mood:** Use the command form (e.g., "**Add** feature," not "Added feature").
5.  **No Punctuation:** The subject **MUST NOT** end with a period (`.`).

### The Standard Commit Types

Use the table below to decide which prefix best describes your change.

| Type | When to Use It | Example |
| :--- | :--- | :--- |
| **`feat`** | Introduces a **new feature** or enhancement (user-facing). | `feat: Implement basic RAG retrieval logic` |
| **`fix`** | Patches a **bug** or resolves an issue. | `fix: Resolve infinite loop when user input is empty` |
| **`docs`** | Changes only to **documentation** (like the SRS, README, or this file). | `docs: Finalize system overview in SRS` |
| **`refactor`** | Restructures code, but **does not change functionality**. | `refactor: Simplify vector storage initialization function` |
| **`test`** | Adds or corrects tests. | `test: Add unit tests for retrieval scoring` |
| **`chore`** | Routine maintenance, setup, config changes, dependency bumps. | `chore: Add placeholder file for configuration` |

### Using the Commit Body (For Detail)

If your change is too complex to explain in 50 characters, you must use the **commit body** (the detail section below the subject line).

* **Format:** Leave a single blank line after the subject.
* **Content:** Explain the **why** and **what** (the motivation, context, and high-level decisions). Do not explain the *how* (the code itself shows the *how*).
* **Wrap at 72 Characters:** The lines in the commit body should not exceed 72 characters for optimal readability in Git logs and terminals.

---

## 2. Development Workflow

To enforce code quality and the "one approval" rule:

1.  **Work on a Feature Branch:** Always create a new branch (e.g., `feature/login-ui`, `fix/db-connection`). **Do not commit directly to `main`.**
2.  **Open a Pull Request (PR):** Submit your work via a Pull Request when it is ready for review.
3.  **Required Approval:** Every PR **MUST** receive **1 approval** from the Project Leader or another designated team member before it can be merged into the `main` branch.
4.  **Stay Updated:** If you push new commits to your PR after receiving an approval, the approval is automatically dismissed. You will need a new review and approval on the final code.
