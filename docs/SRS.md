# Software Requirements Specification
## For AI Classroom Co-Pilot (RAG System)

Version: 0.1  
Prepared by: Chris Cartaya and Team  
Course: CEN 3031 Software Engineering (FGCU)  
Date Created: Monday, October 13, 2025 

Table of Contents
=================
* 1 [Introduction](#1-introduction)
  * 1.1 [Document Purpose](#11-document-purpose)
  * 1.2 [Product Scope](#12-product-scope)
  * 1.3 [Definitions, Acronyms and Abbreviations](#13-definitions-acronyms-and-abbreviations)
  * 1.4 [References](#14-references)
  * 1.5 [Document Overview](#15-document-overview)



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
