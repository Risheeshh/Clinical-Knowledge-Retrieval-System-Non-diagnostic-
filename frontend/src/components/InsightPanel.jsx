import { motion } from 'framer-motion';
import { FileText, Cpu, CheckCircle2, Tags } from 'lucide-react';

export default function InsightPanel({ sessionData }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full h-full glass-panel rounded-3xl p-6 flex flex-col pt-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
      
      <motion.div variants={item} className="mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-1">
          Knowledge Base
        </h2>
        <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Active Session</p>
      </motion.div>

      {/* Floating Document Card */}
      <motion.div 
        variants={item}
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white/60 backdrop-blur-md border border-white/40 p-4 rounded-2xl shadow-sm mb-6 cursor-default transition-all"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 text-primary rounded-xl shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-700 truncate text-sm">
              {sessionData.fileName}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600">Processed</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insights Section */}
      <motion.div variants={item} className="flex-1 flex flex-col mb-4">
        <div className="flex items-center gap-2 mb-4 text-slate-700">
          <Cpu className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Extracted Topics</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {sessionData.topics.map((topic, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="px-3 py-1.5 bg-white/50 border border-slate-100 text-xs font-medium text-slate-600 rounded-full flex items-center gap-1.5 shadow-sm hover:shadow hover:bg-white transition-all cursor-default"
            >
              <Tags className="w-3 h-3 text-accent" />
              {topic}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer Info */}
      <motion.div variants={item} className="mt-auto pt-4 border-t border-slate-200/50">
        <div className="text-[10px] text-slate-400 font-medium leading-relaxed">
          Retrieval-Augmented Generation mode active. All responses strictly adhere to non-diagnostic safety guidelines.
        </div>
      </motion.div>
    </motion.div>
  );
}
