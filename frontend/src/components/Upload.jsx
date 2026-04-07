import { useState } from 'react';
import { Upload as UploadIcon, FileText, Database, ShieldCheck, Loader2 } from 'lucide-react';
import { uploadPdf } from '../api';
import { motion } from 'framer-motion';

export default function Upload({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

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
      onUploadSuccess({ ...data, file_name: file.name });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl glass-panel-dark rounded-[2.5rem] p-10 lg:p-16 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[60px]" />

      <motion.div 
         initial={{ y: -20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.2 }}
         className="mb-10 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border border-white/50 shadow-sm">
           <ShieldCheck className="w-4 h-4 text-emerald-500" />
           Non-Diagnostic Engine
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight mb-4 drop-shadow-sm">
          Intelligent Clinical <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Workspace</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-lg mx-auto font-medium">
          Initialize your semantic research lab by securely importing a clinical document.
        </p>
      </motion.div>

      <div 
        className={`w-full max-w-xl mx-auto z-10 transition-all duration-500 rounded-3xl border-2 border-dashed ${isHovered ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-slate-300 bg-white/40'} relative`}
        onDragEnter={() => setIsHovered(true)}
        onDragLeave={() => setIsHovered(false)}
        onDrop={() => setIsHovered(false)}
      >
        <div className="p-12 flex flex-col items-center justify-center">
          
          <div className="relative mb-6">
             <motion.div 
               animate={isUploading ? { rotate: 360 } : isHovered ? { y: -8 } : { y: 0 }} 
               transition={isUploading ? { repeat: Infinity, duration: 2, ease: "linear" } : { type: "spring" }}
               className="w-20 h-20 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center relative z-10"
             >
                {isUploading ? <Loader2 className="w-10 h-10 text-primary" /> : <UploadIcon className={`w-10 h-10 ${isHovered ? 'text-primary' : 'text-slate-400'}`} />}
             </motion.div>
             {!isUploading && (
               <>
                 <motion.div animate={isHovered ? { x: -30, y: 10, opacity: 1, rotate: -15 } : { x: 0, y: 0, opacity: 0, rotate: 0 }} className="absolute inset-0 z-0">
                    <div className="w-12 h-12 bg-white rounded-xl shadow border border-slate-100 flex items-center justify-center"><FileText className="w-5 h-5 text-accent"/></div>
                 </motion.div>
                 <motion.div animate={isHovered ? { x: 30, y: 10, opacity: 1, rotate: 15 } : { x: 0, y: 0, opacity: 0, rotate: 0 }} className="absolute inset-0 z-0">
                    <div className="w-12 h-12 bg-white rounded-xl shadow border border-slate-100 flex items-center justify-center"><Database className="w-5 h-5 text-primary"/></div>
                 </motion.div>
               </>
             )}
          </div>

          <h3 className="text-xl font-bold text-slate-700 mb-2">
            {isUploading ? "Structuring Context Space..." : "Drop Clinical Context"}
          </h3>
          <p className="text-slate-500 mb-8 max-w-sm text-sm font-medium">
            {isUploading 
              ? "Generating embeddings and configuring neural retrieval."
              : "Supports PDF formats. Vectors remain strictly local to your active session."}
          </p>

          <div className="relative group">
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20" 
            />
            <div className="absolute inset-0 bg-primary opacity-20 rounded-xl blur-lg group-hover:opacity-40 transition-opacity"></div>
            <button 
              disabled={isUploading}
              className="relative bg-primary hover:bg-blue-600 transition-colors text-white px-8 py-3.5 rounded-xl font-bold shadow-sm disabled:opacity-70"
            >
              Select Document
            </button>
          </div>
          {error && <motion.div initial={{ opacity: 0}} animate={{ opacity: 1 }} className="mt-6 text-red-500 bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold">{error}</motion.div>}
        </div>
      </div>
    </motion.div>
  );
}
