import { useState } from 'react';
import { Upload as UploadIcon, CheckCircle, Loader2 } from 'lucide-react';
import { uploadPdf } from '../api';
import { motion } from 'framer-motion';

export default function Upload({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setError("Please upload a PDF file.");
      return;
    }
    
    setError(null);
    setIsUploading(true);
    
    try {
      const data = await uploadPdf(file);
      onUploadSuccess(data.session_id);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto mt-20"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-light text-slate-800 tracking-tight mb-4">
          Clinical <span className="font-semibold text-primary">Knowledge Retrieval</span>
        </h1>
        <p className="text-slate-500 text-lg">Secure, non-diagnostic document analysis.</p>
      </div>
      
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6">
          {isUploading ? <Loader2 className="w-10 h-10 animate-spin" /> : <UploadIcon className="w-10 h-10" />}
        </div>
        
        <h3 className="text-xl font-medium text-slate-800 mb-2">
          {isUploading ? "Processing Document..." : "Upload your Clinical PDF"}
        </h3>
        <p className="text-slate-500 mb-8 max-w-md">
          {isUploading 
            ? "Extracting context and generating embeddings. This may take a moment."
            : "Drag & drop your file here, or click to browse. Strict non-diagnostic safety rules apply."}
        </p>
        
        {error && <div className="text-red-500 mb-4 text-sm font-medium">{error}</div>}
        
        <div className="relative">
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange} 
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
          />
          <button 
            disabled={isUploading}
            className="bg-primary hover:bg-blue-600 transition-colors text-white px-8 py-3 rounded-full font-medium shadow-md shadow-blue-200 disabled:opacity-70 flex items-center gap-2"
          >
            Select Document
          </button>
        </div>
      </div>
    </motion.div>
  );
}
