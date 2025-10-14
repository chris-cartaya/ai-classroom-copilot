# Software Requirements Specification
## For AI Classroom Co-Pilot (RAG System)

Version 0.1  
Prepared by **Chris Cartaya** and Team  
Florida Gulf Coast University  
CEN 3031 - Software Engineering Fundamentals Project  
Instructor: Dr. Chengyi Qu  
Date Created: October 13, 2025  

---

## Table of Contents
* [1 Introduction](#1-introduction)
  * [1.1 Document Purpose](#11-document-purpose)
  * [1.2 Product Scope](#12-product-scope)
  * [1.3 Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
  * [1.4 References](#14-references)
  * [1.5 Document Overview](#15-document-overview)
* [2 Product Overview](#2-product-overview)
  * [2.1 Product Perspective](#21-product-perspective)
  * [2.2 Product Functions](#22-product-functions)
  * [2.3 Product Constraints](#23-product-constraints)
  * [2.4 User Characteristics](#24-user-characteristics)
  * [2.5 Assumptions and Dependencies](#25-assumptions-and-dependencies)
* [3 Requirements](#3-requirements)
  * [3.1 External Interfaces](#31-external-interfaces)
  * [3.2 Functional Requirements](#32-functional-requirements)
  * [3.3 Non-Functional Requirements](#33-non-functional-requirements-quality-attributes)
  * [3.4 System Constraints](#34-system-constraints)
* [4 Verification](#4-verification)
  * [4.1 Verification Objectives](#41-verification-objectives)
  * [4.2 Verification Methods](#42-verification-methods)
  * [4.3 Verification Deliverables](#43-verification-deliverables)
  * [4.4 Acceptance Criteria](#44-acceptance-criteria)
* [5 Appendices](#5-appendices)
  * [5.1 Revision History](#51-revision-history)
  * [5.2 Use-Case Diagram](#52-use-case-diagram-placeholder)
  * [5.3 User Stories](#53-user-stories-placeholder)
  * [5.4 UML Diagrams](#54-uml-diagrams-future-work)
  * [5.5 Requirements Traceability Matrix](#55-requirements-traceability-matrix-rtm-future-placeholder)
  * [5.6 References and Acknowledgements](#56-references-and-acknowledgements)

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

### 3.2 Functional Requirements
This section specifies the key functional capabilities of the *AI Classroom Co-Pilot* system.  
Requirements are grouped according to their priority using the MoSCoW method and labeled hierarchically for traceability.  
Each requirement uses “shall” for mandatory behavior and “should” for desirable behavior.

#### 3.2.1 Core Functionalities (Must-Have)

| ID | Requirement Description | Priority |
|:----|:-------------------------|:----------|
| **FR-1** | The system **shall** allow users (students or instructors) to enter a question into the web interface. | Must |
| **FR-1.1** | The system **shall** process the question and retrieve semantically relevant text chunks from the vector database. | Must |
| **FR-1.2** | The system **shall** send the retrieved content to the local LLM (via Ollama) for contextual response generation. | Must |
| **FR-1.3** | The system **shall** display the AI-generated answer along with **at least two citations** referencing the original course materials (e.g., *Module 3, Slide 5*). | Must |
| **FR-2** | The system **shall** allow instructors to upload supported file types (PPTX, PDF, DOCX) containing course content. | Must |
| **FR-2.1** | Upon upload, the system **shall** automatically extract text, divide it into manageable chunks, and create vector embeddings with metadata (module / slide / page numbers). | Must |
| **FR-3** | The system **shall** store all embeddings and metadata in the vector database (initially Chroma). | Must |
| **FR-4** | The system **shall** provide a simple web interface for students and instructors to interact with the AI assistant. | Must |
| **FR-5** | The system **shall** handle errors gracefully (e.g., invalid file types, empty questions, or missing data) and return informative messages. | Must |
| **FR-6** | The system **shall** operate locally using only open-source components and without dependence on paid APIs. | Must |

#### 3.2.2 Secondary Functionalities (Should-Have)

| ID | Requirement Description | Priority |
|:----|:-------------------------|:----------|
| **FR-7** | When no relevant course material is found, the system **should** perform an **online search** for credible external information related to the question. | Should |
| **FR-7.1** | Responses generated from online sources **should** include at least two citations referencing trustworthy websites or scholarly articles. | Should |
| **FR-8** | The system **should** allow students to request **draft feedback** on short written responses or explanations. | Should |
| **FR-9** | The system **should** enable professors to view question logs or frequently asked topics to improve course materials. | Should |
| **FR-10** | The system **should** allow future integration with a user authentication mechanism for secure access control. | Should |

#### 3.2.3 MoSCoW Summary Table

| Priority | Description |
|:----------|:-------------|
| **Must-Have** | Essential functions required for the MVP and prototype demonstrations. These include question answering, file upload, local vector retrieval, and citation display. |
| **Should-Have** | Valuable additions that enhance system utility or meet professor-defined goals but are not required for initial deployment (e.g., online search, feedback, analytics). |
| **Could-Have** | Features under consideration for future releases (e.g., chat history persistence, personalized dashboards). Not part of SRS v0.1. |
| **Won’t-Have** | Features explicitly excluded from the current scope (e.g., mobile app, advanced multi-user analytics). |

*All functional requirements might later be linked to corresponding design elements and test cases in a Requirements Traceability Matrix (to be added in the Appendix).*

### 3.3 Non-Functional Requirements (Quality Attributes)
This section defines the quality and behavioral characteristics that the *AI Classroom Co-Pilot* system must exhibit.  
Each non-functional requirement (NFR) describes constraints or properties related to performance, reliability, security, usability, and explainability.

#### 3.3.1 Performance
- **NFR-1:** The system **shall** achieve a **p95 response time of ≤ 3 seconds** for user queries under standard operating conditions.  
  *(Note: p95 means 95% of all queries should return in 3 seconds or less.)*  
- **NFR-2:** File uploads and document processing **shall** complete within **30 seconds** for files up to 10 MB.  
- **NFR-3:** The vector database **shall** efficiently retrieve relevant chunks from thousands of stored embeddings.  
- **NFR-4:** The system **should** scale to handle multiple users when deployed in a hosted environment.

#### 3.3.2 Security and Privacy
- **NFR-5:** The system **shall** restrict file upload access to instructors only.  
- **NFR-6:** The system **shall** anonymize any stored or logged student data.  
- **NFR-7:** All logs **shall** mask sensitive text inputs or personal identifiers.  
- **NFR-8:** Uploaded files **shall** remain stored locally for the MVP/prototype and be securely deleted upon user removal.  
- **NFR-9:** Any future online deployment **should** include user authentication and HTTPS encryption.

#### 3.3.3 Reliability and Availability
- **NFR-10:** The system **shall** handle unexpected errors (e.g., failed uploads, API timeouts) without crashing.  
- **NFR-11:** The backend **shall** log errors for debugging and recovery purposes.  
- **NFR-12:** The system **shall** maintain at least **99% demo uptime** during presentations or live testing.  
- **NFR-13:** The system **should** support automated restart or recovery for hosted deployments.

#### 3.3.4 Usability and Accessibility
- **NFR-14:** A **first-time user should succeed within 5 minutes** of initial interaction (e.g., asking a question and receiving an answer).  
- **NFR-15:** The interface **shall** be intuitive and accessible to both students and instructors with minimal training.  
- **NFR-16:** The interface **shall** maintain text readability, consistent color contrast, and responsive design.  
- **NFR-17:** The application **should** be compatible with screen readers and keyboard navigation.  
- **NFR-18:** The system **should** allow optional customization of font size and theme (light/dark mode).

#### 3.3.5 Explainability
- **NFR-19:** The system **shall** ensure that **100% of generated answers include at least two citations** referencing the original content (course material or credible online sources).  
- **NFR-20:** The system **should** display citations clearly in each answer’s output area for user verification.  


### 3.4 System Constraints
This section outlines limitations and constraints that may affect the system’s design, development, or operation.

#### 3.4.1 Technology Stack
- The system will be developed using the following core technologies:
  - **Frontend:** React (JavaScript or TypeScript, TBD)  
  - **Backend:** Python with **FastAPI** (or Flask if chosen later)  
  - **AI Integration:** **Ollama** for local LLM inference  
  - **Retrieval Framework:** **LangChain** for chaining model logic and document retrieval  
  - **Vector Database:** **Chroma** (subject to final ADR confirmation)  
  - **Standard Database (optional):** SQLite or PostgreSQL for metadata/user info  

- All components shall remain **open-source** and locally deployable for the MVP and prototype phases.  
- Internet access may be required for optional online search functionality.

#### 3.4.2 Deadline
- **Prototype Presentation:** Monday, **October 27, 2025**  
- **Final Presentation:** Monday, **November 24** or **December 1, 2025** (exact date TBD)  
- **Personal MVP Goal (Chris Cartaya):** Develop a working single-feature local prototype (question-answering with citations) **before the prototype deadline**, to serve as a foundation for the team’s implementation.  
- Development milestones and updates will be tracked via GitHub commits and issues.

#### 3.4.3 Cost
- There are **no financial costs** anticipated for the MVP or prototype phase, as all selected tools are open-source.  
- Future versions **may** incur costs related to:
  - Hosting (e.g., Render, Vercel, or Supabase).  
  - Paid API usage for external LLMs (e.g., OpenAI, Anthropic).  
  - Data storage and bandwidth if deployed online.  
- Cost analysis and budgeting will be considered only if cloud migration becomes a team objective.

---

## 4. Verification
This section describes how the *AI Classroom Co-Pilot* system will be evaluated to ensure that it fulfills the functional and non-functional requirements defined in Section 3.  
Verification activities will occur throughout development — during implementation, integration, and final prototype testing.

### 4.1 Verification Objectives
The primary objectives of verification are to:
- Confirm that each functional requirement (FR) is implemented correctly and produces expected behavior.  
- Validate that each non-functional requirement (NFR) meets measurable criteria (e.g., response time, uptime, usability).  
- Ensure that the delivered prototype operates reliably during classroom demonstrations and aligns with professor-defined performance targets.

### 4.2 Verification Methods
| Method | Description | Applied To |
|:--------|:-------------|:-------------|
| **Unit Testing** | Individual backend functions (e.g., text chunking, embedding creation, retrieval, LLM response generation) will be tested in isolation using automated unit tests. | Core logic in FastAPI backend |
| **Integration Testing** | Tests will verify that interconnected components — frontend ↔ backend ↔ vector DB ↔ LLM — work together as expected. | End-to-end data flow |
| **System Testing** | Full application tests conducted on local hardware to validate functionality from user input to AI output, including error handling. | Entire MVP/Prototype |
| **User Acceptance Testing (UAT)** | Informal testing by team members simulating students and instructors to ensure usability and first-time user success ≤ 5 minutes. | Usability & accessibility |
| **Performance Testing** | Measure query latency to confirm **p95 ≤ 3 seconds** and check processing time for file uploads ≤ 30 seconds. | Performance & scalability |
| **Reliability Testing** | Run multiple query cycles during demo rehearsals to verify **≥ 99% uptime** and proper error recovery. | Reliability |
| **Manual Review** | Professor or reviewers validate citation accuracy and alignment with uploaded materials. | Explainability & correctness |

### 4.3 Verification Deliverables
- **Test Plan (to be developed later):** Will outline detailed test cases, expected results, and acceptance criteria.  
- **Verification Log:** Record of all tests executed and their outcomes during prototype evaluation.  
- **Traceability Updates:** Future versions may include a simplified Requirements Traceability Matrix (RTM) linking FRs/NFRs to specific test cases.

### 4.4 Acceptance Criteria
The prototype will be considered verified if it meets the following conditions:
1. The system answers user questions with ≥ 2 citations for 100% of responses.  
2. 95% of user queries complete within 3 seconds.  
3. First-time users can successfully ask and receive an answer within 5 minutes.  
4. Demo session uptime ≥ 99%.  
5. No critical errors or crashes during live presentation.

---

## 5. Appendices
This section contains supporting information and placeholders for diagrams, user stories, and future revisions.  
These materials provide visual context and traceability for requirements defined in earlier sections.

### 5.1 Revision History
| Version | Date | Author(s) | Description |
|:---------|:------|:-----------|:-------------|
| **0.1** | *TBD* | Chris Cartaya & Team | Initial SRS draft including Introduction, Product Overview, Requirements, and Verification. |
| **0.2** | *Future* | — | Add UML diagrams, user stories, and updated requirements. |
| **0.3** | *Future* | — | Finalize SRS v1.0 after prototype presentation and feedback. |

---

### 5.2 Use-Case Diagram *(Placeholder)*
A UML **Use-Case Diagram** will be created to illustrate interactions between:
- **Actors:** *Student*, *Professor/Instructor*, and *System (AI Classroom Co-Pilot)*  
- **Use Cases:** *Ask Question*, *Upload Course Material*, *Get Answer with Citations*, *Request Feedback*  

*This diagram will visually depict user roles and system functionality once finalized.*

---

### 5.3 User Stories *(Placeholder)*
| ID | As a (user) … | I want to … | So that I can … |
|:----|:----------------|:--------------|:----------------|
| **US-1** | Student | Ask a question about course slides | Get an AI-generated answer with citations |
| **US-2** | Professor | Upload PowerPoint slides | Make the material searchable by the AI |
| **US-3** | Student | Receive clear sources in answers | Verify accuracy and credibility |
| **US-4** | Professor | View common student questions | Improve or clarify future lectures |

Additional user stories may be added as development progresses.

---

### 5.4 UML Diagrams *(Future Work)*
This section may include the following UML or architecture diagrams as the design matures:
- **System Architecture Diagram:** Overview of frontend, backend, database, and LLM interactions.  
- **Activity Diagram:** Workflow from question submission to AI response.  
- **Sequence Diagram:** Interaction sequence between frontend, backend, vector DB, and LLM.  
- **Class Diagram (optional):** Illustrating main system components and relationships.

*(Diagrams may be stored in `/docs/diagrams/` and linked here when ready.)*

---

### 5.5 Requirements Traceability Matrix (RTM) *(Future Placeholder)*
A lightweight RTM may be added in a later revision to link:
- **Functional Requirements (FR)** → **Design Modules** → **Test Cases**

Example format:
| Requirement ID | Implemented In | Tested By | Status |
|:----------------|:---------------|:-----------|:--------|
| FR-1 | `/ask` API endpoint | `test_ask_api.py` | Planned |
| FR-2 | `/upload` route | `test_upload_file.py` | Planned |

---

### 5.6 References and Acknowledgements
- FGCU Software Engineering Course Materials – Instructor Dr. Chengyi Qu  
- IEEE 830 / 29148 SRS Guidelines  
- Project repository: [https://github.com/Chris-Cartaya/ai-classroom-copilot](https://github.com/Chris-Cartaya/ai-classroom-copilot)

---

*End of Software Requirements Specification v0.1*


