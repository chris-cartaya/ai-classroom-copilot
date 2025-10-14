# Software Requirements Specification
## For AI Classroom Co-Pilot (RAG System)

Version: 0.1  
Prepared by: Chris Cartaya and Team  
Course: CEN 3031 Software Engineering (FGCU)  
Date Created: Monday, October 13, 2025 

Table of Contents
=================
Whole ToC will be added at end

---

## 1. Introduction
This section provides an overview of the *AI Classroom Co-Pilot* project and describes the purpose, audience, and organization of this Software Requirements Specification (SRS).

### 1.1 Document Purpose
The purpose of this SRS is to define the requirements for the **AI Classroom Co-Pilot**, an AI-powered classroom assistant designed to help students and instructors interact with course materials more effectively.  
This document serves as the shared point of reference for all group members to understand what the system must accomplish and what features are prioritized.  
It will also guide the creation of GitHub tasks, milestones, and implementation modules.  
The intended audience includes:
- Project developers and contributors (student team members)  
- The course instructor (as project evaluator)  
- Any future collaborators or reviewers who wish to understand the project’s goals

### 1.2 Product Scope
The *AI Classroom Co-Pilot* is a **Retrieval-Augmented Generation (RAG)** system that enables users to ask questions about uploaded course materials (e.g., PowerPoint slides, PDFs, or lecture notes) and receive AI-generated answers with **at least two citations** referencing the original content (such as *Module 3, Slide 12*).  

Two user roles are supported:
- **Professor / Instructor:** Can upload, update, and manage course materials and view analytics.  
- **Student:** Can submit questions and receive contextual answers with citations.

The initial version (MVP → prototype) will operate **locally** using open-source tools such as *Ollama*, *LangChain*, and *Chroma*. *(Subject to change pending Architecture Decision Record review.)*  

Future iterations **should** allow the AI to answer general domain questions by performing an online search when no relevant material is found in the course database. These answers should also include at least two citations from credible online sources.

The system’s objectives are to:
1. Demonstrate a functional local RAG pipeline from document ingestion to answer generation.  
2. Provide clear citations linking AI answers to specific course materials.  
3. Offer a maintainable base for future enhancements, such as analytics dashboards or feedback features.  

### 1.3 Definitions, Acronyms, and Abbreviations
| Term | Definition |
|------|-------------|
| **RAG (Retrieval-Augmented Generation)** | An AI architecture that retrieves relevant text from a knowledge base before generating responses. |
| **LLM (Large Language Model)** | A machine-learning model trained on large text datasets to generate or analyze language. |
| **MVP (Minimum Viable Product)** | The simplest version of a product that demonstrates core functionality. |
| **Prototype** | A functional early version that builds upon the MVP and showcases partial features. |
| **MoSCoW Method** | Prioritization technique dividing requirements into *Must*, *Should*, *Could*, and *Won’t* categories. |

### 1.4 References
- IEEE 830-1998 – Software Requirements Specification Standard  
- IEEE 29148-2018 – Systems and Software Engineering – Life Cycle Processes – Requirements Engineering  
- LangChain Documentation – [https://python.langchain.com/](https://python.langchain.com/)  
- Ollama Documentation – [https://ollama.ai/](https://ollama.ai/)  
- Chroma Documentation – [https://docs.trychroma.com/](https://docs.trychroma.com/)  
- React Documentation – [https://react.dev/](https://react.dev/)  
- (Optional) Material UI for React Components – [https://mui.com/](https://mui.com/)  
- Original SRS Template by jam01 (GitHub) – [https://github.com/jam01/SRS-Template](https://github.com/jam01/SRS-Template)

### 1.5 Document Overview
The remainder of this document is organized as follows:  
- **Section 2 – Product Overview:** Describes the context, users, and assumptions behind the system.  
- **Section 3 – Requirements:** Specifies functional and non-functional requirements, interfaces, constraints, and priorities.  
- **Section 4 – Verification:** Outlines how the team will confirm that the implemented system meets requirements.  
- **Section 5 – Appendices:** Contains supporting materials such as the use-case diagram, user stories, MoSCoW table, and revision history.  

---

## 2. Product Overview
This section describes the context, major functions, users, and environmental assumptions of the *AI Classroom Co-Pilot* system.  
It provides background information to help readers understand how the system fits within its intended academic environment.

### 2.1 Product Perspective
The *AI Classroom Co-Pilot* is a new, self-contained software product developed as part of the FGCU Software Engineering course project.  
It is not replacing an existing system but rather introducing an intelligent learning assistant that integrates with course content.  

The system follows a **client–server architecture**:
- The **frontend** (React-based web interface) allows users to interact with the AI assistant through a question-and-answer interface.  
- The **backend** (Python + FastAPI) handles data ingestion, embedding generation, vector retrieval, and LLM responses.  
- A **vector database** (e.g., Chroma) stores processed document embeddings along with metadata such as module and slide number.  

The system operates locally during early development but may later migrate to a hosted environment using cloud-based LLMs and storage systems.  

A simplified system architecture diagram illustrating these components and/or data flow will be included in the Design Document.

### 2.2 Product Functions
At a high level, the system will provide the following key functions:
1. **Document Upload and Processing:** Professors can upload course files (PPTX, PDF, DOCX). The system automatically extracts text, segments it into chunks, and stores embeddings with metadata.  
2. **Question Answering:** Students and professors can ask natural-language questions about course material and receive AI-generated answers with at least two citations (e.g., *Module 2, Slide 5*).  
3. **Context Retrieval:** Relevant document chunks are retrieved using semantic search within the vector database.  
4. **Response Generation:** The backend LLM uses the retrieved content to generate context-aware answers.  
5. **General Question Handling (Should-Have):** If no relevant course material is found, the system should perform an online search to answer general domain questions (e.g., networking or Linux topics) and provide at least two online citations.  
6. **Instructor Management Tools (Future):** Professors may later access dashboards to track common questions, content coverage, or student engagement.

A high-level use-case or data-flow diagram may be added in a later SRS revision to visually represent these core functions.

### 2.3 Product Constraints
- **Technical Constraints:**
  - The MVP and prototype will run on local machines using open-source components.  
  - The system must operate without dependence on paid APIs.  
  - Performance may vary depending on available CPU/GPU resources.  
- **Design Constraints:**
  - The frontend must remain simple and intuitive for student use.  
  - Backend and database integration should be modular to allow future upgrades.  
- **Ethical and Academic Constraints:**
  - The AI system must avoid generating misleading or unverifiable answers.  
  - All responses must include transparent citations to promote academic integrity.  

### 2.4 User Characteristics
| User Type | Description | Technical Skill Level | Frequency of Use |
|:-----------|:-------------|:----------------------|:-----------------|
| **Professor / Instructor** | Uploads, manages, and validates course content; may view analytics. | Moderate – Comfortable with web dashboards and file management. | Weekly |
| **Student** | Asks questions, studies with AI responses, and reviews cited material. | Basic – Familiar with standard web interfaces. | Daily / as needed |
| **Developer / Contributor** | Maintains codebase, improves features, and reviews system performance. | Advanced – Software Engineering or Computer Science background. | As needed |

### 2.5 Assumptions and Dependencies
- All project members have access to a local development environment supporting Python 3.11+, Node.js, and Git.  
- The system assumes availability of open-source LLMs via **Ollama** and integration through **LangChain**.  
- The selected vector database (initially Chroma) will be used for embedding storage and retrieval.  
- Internet connectivity may be required only for optional online searches.  
- Future deployment or hosting may depend on additional cloud resources (e.g., Supabase, Render, Vercel).  
- The SRS reflects project status as of Version 0.1 and may evolve as new design decisions are recorded in the Architecture Decision Record (ADR).  

---

## 3. Requirements
This section specifies the software product’s requirements, including interfaces, functional behavior, and system constraints.

### 3.1 External Interfaces
The *AI Classroom Co-Pilot* system interfaces with both human users and other software components.  
This section describes those interfaces at a conceptual level.

#### 3.1.1 User Interfaces
The system will be accessed through a **web-based interface** built with **React**.  
The frontend design will prioritize simplicity, responsiveness, and accessibility for both professors and students.

**General Features:**
- A navigation bar or sidebar to switch between user roles (if applicable).  
- A main chat or question area where users can type natural-language questions.  
- A results panel displaying the AI’s response along with at least two citations (e.g., *Module 2, Slide 8*).  
- A file upload interface (for instructors) to add new course materials (PPTX, PDF, DOCX).  
- Status or feedback messages (e.g., “Processing question...”, “Uploading document...”).  

**Accessibility:**
- The interface should use readable fonts, consistent color contrast, and intuitive layout design.  
- The system should remain usable across major browsers (Chrome, Edge, Firefox).  

**Sample Screens to Include Later:**  
Wireframes or early UI mockups may be added to the design documentation once the MVP frontend is created.

#### 3.1.2 Software Interfaces
The backend will use **FastAPI (Python)** to provide RESTful endpoints that handle user requests and communicate with the AI and database components.

**Primary Interfaces:**
| Interface | Description |
|:-----------|:-------------|
| **Frontend ↔ Backend** | Communicates through HTTP requests (JSON). The frontend sends user questions, and the backend returns formatted AI responses. |
| **Backend ↔ Vector Database** | The backend stores and retrieves document embeddings and metadata using a vector database (initially Chroma). |
| **Backend ↔ LLM / Ollama** | The backend sends retrieved content to the local LLM via the Ollama API for contextual answer generation. |
| **Backend ↔ Standard Database (optional)** | May store user data, question history, or system logs for future versions. |
| **Backend ↔ Internet (optional)** | For general-domain questions (should-have feature), the backend may access web search APIs to retrieve external citations. |

**Data Exchange:**
- **Input format:** JSON requests containing question text or file upload metadata.  
- **Output format:** JSON responses containing AI-generated text, citation list, and confidence score (if implemented).  

All interfaces will be designed with modularity in mind to allow future expansion (e.g., switching databases or adding authentication).

---


