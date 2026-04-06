# Clinical Knowledge Retrieval System (Non-Diagnostic)

A full-stack RAG web application built with FastAPI, React, and ChromaDB. It ingests clinical PDFs, splits them into semantic chunks, generates embeddings using `SentenceTransformers`, and performs Non-Diagnostic Retrieval-Augmented Generation using a localized wrapper over Google Gemini representations.

## Features
- **PDF Upload:** Session-based uploads creating personalized vector spaces.
- **Strict Guidelines:** The system is explicitly configured to NEVER provide diagnostic or therapeutic advice, defaulting to professional recommendations when prompted.
- **Premium UI:** Animated cleanly via `framer-motion` and styled cleanly in soft blue/white clinical aesthetics.

## Tech Stack
- FastAPI, Langchain Splitters, ChromaDB (Backend)
- React, Vite, Tailwind CSS, Framer Motion (Frontend)

## 🚀 How to Run

### 1. Backend Setup
1. Open a terminal to the `backend/` directory.
2. We recommend creating a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` directory from `.env.example` and place your Gemini API key inside.
5. Start the backend:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be live at `http://localhost:8000`.

### 2. Frontend Setup
1. Open a separate terminal to the `frontend/` directory.
2. Install Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local host link (typically `http://localhost:5173`) in your browser.

> Note: All uploads are isolated per web session so multiple users can query their respective PDFs independently!
