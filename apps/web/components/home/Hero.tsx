'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20">
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      
      <div className="section-container relative z-10 grid grid-cols-1 lg:grid-cols-2 lg:gap-8 items-center pt-10">
        
        {/* Left Column - Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left pt-12 lg:pt-0"
        >
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-wide mb-6">
            <span className="text-brand-300">InFora</span> <span className="text-white">AI</span>
          </h1>
          <p className="text-white/60 text-lg sm:text-xl max-w-lg mb-10 leading-relaxed font-light">
            The AI that speaks your language. Verified news,<br className="hidden sm:block" />
            Government services. All in Sinhala or English.
          </p>
          <div className="flex items-center gap-4">
            <Link 
              href="/chat" 
              className="px-8 py-3.5 rounded-md font-semibold text-sm text-[#0A0D14] bg-gradient-to-r from-blue-100 to-blue-300 hover:from-white hover:to-blue-200 transition-all active:scale-95"
            >
              Get Started
            </Link>
            <Link 
              href="/chat" 
              className="px-8 py-3.5 rounded-md font-semibold text-sm text-white/90 border border-white/20 hover:bg-white/5 transition-all active:scale-95"
            >
              Try For Free
            </Link>
          </div>
        </motion.div>

        {/* Right Column - Robot Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-1 lg:order-2 flex justify-center relative"
        >
          {/* Custom rounded shape background */}
          <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px]">
            <div 
              className="absolute inset-0 bg-slate-100 overflow-hidden shadow-2xl"
              style={{
                borderRadius: '80px 80px 80px 80px',
                clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)'
              }}
            >
              <img 
                src="/robot.png" 
                alt="InFora AI Mascot" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
