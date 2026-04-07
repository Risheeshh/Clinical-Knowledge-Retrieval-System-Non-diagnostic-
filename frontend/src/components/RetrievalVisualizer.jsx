import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, BookOpen, Quote } from 'lucide-react';

export default function RetrievalVisualizer({ isThinking, activeSources }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full h-full glass-panel rounded-3xl overflow-hidden flex flex-col bg-white/40">
      {/* Header */}
      <div className="p-5 border-b border-white/60 bg-white/50 backdrop-blur-md shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-slate-700">Live Context</h3>
        </div>
        {isThinking && (
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium shrink-0 animate-pulse">
            <Search className="w-3 h-3 animate-spin-slow" />
            Scanning
          </div>
        )}
      </div>

      {/* Content Space */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-200">
        <AnimatePresence mode="popLayout">
          {isThinking && (
            <motion.div 
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-10"
            >
               <div className="w-16 h-16 mx-auto bg-white/60 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-white/50">
                 <Search className="w-8 h-8 text-slate-400" />
               </div>
               <p className="text-sm font-medium text-slate-500">Extracting semantic matches...</p>
            </motion.div>
          )}

          {!isThinking && activeSources.length === 0 && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 opacity-60"
            >
               <div className="w-16 h-16 mx-auto bg-slate-100/50 rounded-2xl flex items-center justify-center mb-4">
                 <BookOpen className="w-8 h-8 text-slate-300" />
               </div>
               <p className="text-sm text-slate-400">Context viewer is ready.</p>
            </motion.div>
          )}

          {!isThinking && activeSources.length > 0 && (
            <motion.div 
              key="results"
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {activeSources.map((src, idx) => (
                <motion.div 
                  key={idx}
                  variants={item}
                  className="bg-white/80 p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent/40 group-hover:bg-accent transition-colors" />
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                      Page {src.page}
                    </span>
                    <span className="text-xs text-slate-400 truncate">
                      {src.source}
                    </span>
                  </div>
                  
                  <div className="relative text-sm text-slate-600 leading-relaxed font-serif pl-2 border-l-2 border-slate-200/50 italic">
                    <Quote className="w-8 h-8 absolute -top-2 -left-2 text-slate-100 -z-10" />
                    {src.text}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
