import numpy as np
import faiss
from google import genai
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os
load_dotenv()

# -------- CONFIGURATION --------

try:
    from google import genai
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    MODEL_NAME = "gemini-2.5-flash-lite"
    google_genai_available = True
except Exception as e:
    print(f"Failed to initialize google-genai: {e}")
    client = None
    google_genai_available = False
# -------- LOCAL EMBEDDING MODEL --------
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# -------- PDF INGESTION --------
def load_pdf(file_path):
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            content = page.extract_text()
            if content:
                text += content
        return text
    except FileNotFoundError:
        print(f"Error: '{file_path}' not found in this folder.")
        return None

# -------- PREPARE DATA --------
print("🤖 Loading Medical Patient Guide...")
document_text = load_pdf("doc.pdf")

if document_text:
    # Split text into manageable 1000-character chunks
    chunks = [document_text[i:i+1000] for i in range(0, len(document_text), 1000)]
    
    print(f"📄 Indexed {len(chunks)} chunks. Creating Vector Database...")
    
    # Create embeddings and store in FAISS index
    embeddings = np.array(embed_model.encode(chunks)).astype("float32")
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    
    print("✅ System Ready! You can now ask medical questions based on the guide.")
    print("------------------------------------------------------------------")

    # -------- CHAT LOOP --------
    while True:
        question = input("\nPatient Query: ")
        
        if question.lower() in ['exit', 'quit', 'bye']:
            print("Doctor Bot: Take care and stay healthy! Goodbye.")
            break

        # 1. Search for relevant context in the PDF
        q_embed = np.array(embed_model.encode([question])).astype("float32")
        distances, indices = index.search(q_embed, 3) # Get top 3 chunks
        
        context = "\n".join([chunks[i] for i in indices[0] if i < len(chunks)])

        # 2. Construct the Prompt
        prompt = f"""
        PERSONA: You are a friendly, encouraging, and professional Medical Assistant. 
        Your goal is to help a patient understand the 'Heart Failure Patient Guide'.

        RULES:
        1. Answer ONLY using the context provided below.
        2. If the answer is not in the context, say: "I'm sorry, I couldn't find that specific information in the guide. Please check with your healthcare team for more details."
        3. ALWAYS include this disclaimer at the end: "Disclaimer: This is for informational purposes only. Consult a doctor for medical emergencies."
        4. If the user mentions 'Red Zone' symptoms (like chest pain or severe shortness of breath), emphasize that they should call 911 immediately.

        CONTEXT:
        {context}

        PATIENT QUESTION: 
        {question}
        """

        # 3. Generate the AI Response
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )
            print(f"\nDoctor Bot: {response.text}")
        except Exception as e:
            print(f"⚠️ Error: {e}")
else:
    print("Failed to initialize. Please ensure 'doc.pdf' exists.")