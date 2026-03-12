'use client';

import { motion } from 'framer-motion';

export function Feedback() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-container relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left - Robot or Graphic */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center md:justify-end"
        >
          <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] flex items-center justify-center">
            {/* Pulsing rings decoration */}
            <div className="absolute inset-0 border border-white/10 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-4 border border-blue-400/20 rounded-full" />
            
            <img 
              src="/robot.png" 
              alt="InFora Support AI" 
              className="w-full h-full object-contain filter drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Right - Text and Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-xl"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Send Your Feedback To Improve And Support InFora AI
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-10">
            Infora makes AI accessible and transparent. Help us continuously improve our multilingual engine to accurately guide Sri Lankan citizens with the best verified information.
          </p>
          
          <form 
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center bg-[#131A2A] border border-white/10 rounded-md p-1 pl-4"
          >
            <input 
              type="email" 
              placeholder="Enter your email here..."
              className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder:text-white/30"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-3 rounded text-[#0A0D14] text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-300 hover:from-white hover:to-blue-200 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}
