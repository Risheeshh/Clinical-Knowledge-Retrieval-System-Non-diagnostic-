import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Upload from './Upload';
import Chat from './Chat';
import InsightPanel from './InsightPanel';

export default function Dashboard() {
  const [sessionData, setSessionData] = useState({
    id: null,
    fileName: null,
    topics: []
  });

  const handleUploadSuccess = (data) => {
    setSessionData({
      id: data.session_id,
      fileName: data.file_name || "Document.pdf",
      topics: ["Patient History", "Treatment Plan", "Observations"] // Simulated for now
    });
  };

  return (
    <div className="relative w-full h-screen flex overflow-hidden text-slate-800">
      <AnimatePresence mode="wait">
        {!sessionData.id ? (
          <motion.div 
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex items-center justify-center p-6"
          >
            <Upload onUploadSuccess={handleUploadSuccess} />
          </motion.div>
        ) : (
          <motion.div 
            key="workspace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full h-full flex gap-4 p-4 lg:p-6"
          >
            {/* Left Panel: Insights space */}
            <div className="w-[280px] hidden lg:flex flex-col gap-4 h-full shrink-0">
               <InsightPanel sessionData={sessionData} />
            </div>
            
            {/* Center + Right Panel internally handled by Chat.jsx */}
            <div className="flex-1 flex h-full min-w-0">
               <Chat sessionId={sessionData.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
