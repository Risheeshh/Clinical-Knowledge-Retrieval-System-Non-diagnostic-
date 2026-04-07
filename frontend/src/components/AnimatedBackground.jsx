import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50">
      {/* Soft gradient mesh */}
      <div className="absolute inset-0 opacity-40">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/20 blur-[150px]"
        />
        <motion.div 
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[20%] w-[70%] h-[50%] rounded-full bg-blue-300/15 blur-[100px]"
        />
      </div>
      
      {/* Dot overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
    </div>
  );
}
