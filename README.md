# Clinical-Knowledge-Retrieval-System-Non-diagnostic-
LLM+VD system to capture the semantic meaning behind complex medical queries | Project for CSE3232 | Team of 2
# Clinical Knowledge Retrieval System (Non-diagnostic)

**A document-grounded medical knowledge base designed for precision-first information retrieval.**

---

> [!CAUTION]
> **Disclaimer:** This system does not provide medical advice. It is a technical tool designed to retrieve and synthesize information from user-uploaded research papers and clinical guidelines. All outputs should be verified against the original source citations provided.
> [!CAUTION]
> **Disclaimer:** This readme file is ai-generated however proof-read to ensure no missing or made-up details .

---

## 📖 Overview

Medical professionals and students often struggle to extract precise information from massive volumes of research papers and clinical guidelines. Traditional keyword-based searches frequently fail to capture the **semantic meaning** behind complex medical queries, leading to inefficiency and the potential for misinformation.

This project implements a **RAG (Retrieval-Augmented Generation)** architecture that enables users to query medical literature using natural language while ensuring responses are strictly based on verified, uploaded sources.

## 🏗️ Clean Architecture

The system follows a modular pipeline to ensure data integrity and traceability:

1.  **User Query:** Natural language input (e.g., "What are the contraindications for drug X in pediatric patients?").
2.  **Embedding Model (OpenAI):** Converts the query into a high-dimensional vector.
3.  **Vector Search (Pinecone):** Identifies the **Top-K Relevant Chunks** from the document database.
4.  **LLM (Context-restricted Prompt):** Processes only the retrieved chunks to formulate a response.
5.  **Verified Output:** Provides the answer accompanied by precise **Source Citations** and **Similarity Scores**.

---

## ✨ Key Features

### 1. Confidence Scores & Hallucination Guardrails
To ensure safety, the system displays a **Similarity Score** for every retrieval. 
* **Threshold Check:** If the Pinecone score is below a predefined threshold, the system returns: *“Insufficient information found in uploaded documents to answer this query accurately.”* ### 2. Semantic vs. Keyword Comparison
The dashboard allows users to compare results against a standard TF-IDF keyword search. This demonstrates why vector-based retrieval is superior for capturing medical nuances that keywords often miss.

### 3. Source Highlighting
The system doesn't just answer; it points you to the evidence. It highlights the exact paragraph from the uploaded PDF used to generate the response, making verification effortless for researchers.

---

## 🛠️ Tech Stack

| Component | Tool |
| :--- | :--- |
| **LLM** | OpenAI API (GPT-4o) |
| **Embeddings** | OpenAI text-embedding-3-small |
| **Vector DB** | Pinecone |
| **Orchestration** | LangChain |
| **Backend** | Python + FastAPI |
| **Frontend** | Streamlit |
| **Storage** | Local PDF Uploads |

---

## 🚀 Getting Started

### Prerequisites
* Python 3.9+
* OpenAI API Key
* Pinecone API Key

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Risheeshh/Clinical-Knowledge-Retrieval-System-Non-diagnostic-.git
   cd clinical-retrieval-system-non-diagnostic-
