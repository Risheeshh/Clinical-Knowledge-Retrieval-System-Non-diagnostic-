import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, FileText, Loader2 } from 'lucide-react';
import { querySystem } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat({ sessionId }) {
  const [messages, setMessages] = useState([{
    id: "system-1",
    role: "assistant",
    text: "Your document is processed and ready. How can I help you?",
    sources: []
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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

    try {
      const data = await querySystem(sessionId, userMessage.text);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: data.answer,
        sources: data.sources || []
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "Sorry, I encountered an error. " + (err.response?.data?.detail || err.message)
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden mt-10">
      {/* Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Clinical Assistant</h2>
            <p className="text-xs text-primary/80 font-medium">Non-diagnostic mode</p>
          </div>
        </div>
        <div className="text-xs bg-accent/20 text-accent px-3 py-1 rounded-full font-medium">Session: {sessionId.substring(0,8)}</div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5"/> : <Bot className="w-5 h-5"/>}
              </div>
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.sources.map((src, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200">
                        <FileText className="w-3 h-3" /> Page {src.page}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                 <Bot className="w-5 h-5"/>
               </div>
               <div className="p-4 rounded-2xl bg-white border border-slate-100 rounded-tl-sm flex items-center gap-2">
                 <Loader2 className="w-4 h-4 animate-spin text-primary" />
                 <span className="text-slate-400 text-sm">Thinking...</span>
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder="Ask a non-diagnostic question..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim()}
            className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-primary hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
