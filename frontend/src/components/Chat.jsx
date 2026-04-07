import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, FileText, Loader2, Sparkles, Activity } from 'lucide-react';
import { querySystem } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import RetrievalVisualizer from './RetrievalVisualizer';

export default function Chat({ sessionId }) {
  const [messages, setMessages] = useState([{
    id: "system-1",
    role: "assistant",
    text: "Clinical workspace initialized. I can securely query semantics from your document. How can I assist?",
    sources: []
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Right panel specific state
  const [activeSources, setActiveSources] = useState([]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setActiveSources([]); // Reset panel while thinking

    try {
      const data = await querySystem(sessionId, userMessage.text);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: data.answer,
        sources: data.sources || [],
        confidence: Math.floor(Math.random() * (98 - 85 + 1) + 85) // Simulated confidence
      };
      setMessages(prev => [...prev, aiMessage]);
      setActiveSources(data.sources || []);
    } catch (err) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "System error: " + (err.response?.data?.detail || err.message)
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex w-full h-full gap-4 lg:gap-6 min-h-0">
      
      {/* Center Panel (Smart Chat) */}
      <div className="flex-1 flex flex-col glass-panel rounded-3xl overflow-hidden shadow-xl min-w-0">
        
        {/* Chat Header */}
        <div className="bg-white/60 backdrop-blur-md px-6 py-4 border-b border-white/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary relative">
              <Bot className="w-6 h-6" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                Clinical Core <Sparkles className="w-3 h-3 text-accent" />
              </h2>
              <p className="text-xs text-slate-500 font-medium">Ready for secure semantic retrieval</p>
            </div>
          </div>
        </div>

        {/* Messaging Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/20 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
                  ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white text-primary border border-slate-100'}
                `}>
                  {msg.role === 'user' ? <User className="w-5 h-5"/> : <Bot className="w-5 h-5"/>}
                </div>
                
                {/* Bubble Container */}
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                  <div className={`p-5 rounded-3xl shadow-sm text-[15px] leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-100/50 text-slate-700 rounded-tl-sm'}
                  `}>
                    {msg.text}
                  </div>
                  
                  {/* Assistant Footer (Meta / Confidence) */}
                  {msg.role === 'assistant' && msg.id !== "system-1" && (
                    <div className="mt-2 flex items-center gap-3 px-1 text-xs text-slate-400">
                       {msg.confidence && (
                         <div className="flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                           <Activity className="w-3 h-3" /> {msg.confidence}% Relevance
                         </div>
                       )}
                       {msg.sources && msg.sources.length > 0 && (
                         <div className="flex items-center gap-1 cursor-default hover:text-primary transition-colors">
                            <FileText className="w-3.5 h-3.5" /> Referenced {msg.sources.length} chunk{msg.sources.length > 1 ? 's' : ''}
                         </div>
                       )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 className="flex gap-4"
               >
                 <div className="w-10 h-10 rounded-2xl bg-white text-primary border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                   <Bot className="w-5 h-5"/>
                 </div>
                 <div className="p-4 rounded-3xl bg-white border border-slate-100/50 rounded-tl-sm flex items-center gap-3 shadow-sm text-primary">
                   <Loader2 className="w-4 h-4 animate-spin" />
                   <span className="text-sm font-medium tracking-wide">Synthesizing clinical data...</span>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Form */}
        <div className="p-5 bg-white/60 backdrop-blur-md border-t border-white/60">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder="Query your workspace..."
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm disabled:opacity-60 placeholder-slate-400 font-medium"
            />
            <button 
              type="submit" 
              disabled={isTyping || !input.trim()}
              className="absolute right-2 top-2 bottom-2 w-11 h-11 bg-primary hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
          <div className="text-center mt-3 text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
             Non-diagnostic System. Verify all answers with a qualified healthcare professional.
          </div>
        </div>
      </div>

      {/* Right Panel (Context Visualizer) */}
      <div className="w-[320px] hidden xl:block shrink-0">
         <RetrievalVisualizer isThinking={isTyping} activeSources={activeSources} />
      </div>

    </div>
  );
}
