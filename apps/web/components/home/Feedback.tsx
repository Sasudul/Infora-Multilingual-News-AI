'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/i18n';

const textMap: any = {
  en: { title: 'Send Your Feedback To Improve And Support InFora AI', desc: 'Infora makes AI accessible and transparent. Help us continuously improve our multilingual engine to accurately guide Sri Lankan citizens with the best verified information.', placeholder: 'Enter your email here...', btn: 'Subscribe' },
  si: { title: 'InFora AI යෙදුම වැඩිදියුණු කිරීමට ඔබේ අදහස් එවන්න', desc: 'Infora මගින් AI සියලුදෙනාටම සමීප කරයි. ශ්‍රී ලාංකිකයින්ට වඩාත් නිවැරදි තොරතුරු ලබාදීමට අපගේ බහුභාෂා පද්ධතිය දියුණු කිරීමට සහාය වන්න.', placeholder: 'ඔබේ ඊමේල් ලිපිනය මෙහි ඇතුලත් කරන්න...', btn: 'දායක වන්න' },
  ta: { title: 'InFora AI ஐ மேம்படுத்த உங்கள் கருத்துக்களை அனுப்புங்கள்', desc: 'Infora AI ஐ அனைவருக்கும் அணுகக்கூடியதாக மாற்றுகிறது. இலங்கையர்களை துல்லியமாக வழிநடத்த எங்கள் இயந்திரத்தை மேம்படுத்த உதவுங்கள்.', placeholder: 'உங்கள் மின்னஞ்சலை இங்கே உள்ளிடவும்...', btn: 'குழுசேரவும்' }
};

export function Feedback() {
  const { lang } = useI18n();
  const txt = textMap[lang] || textMap.en;

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
              src="/infora.png" 
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
            {txt.title}
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-10">
            {txt.desc}
          </p>
          
          <form 
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center bg-[#131A2A] border border-white/10 rounded-md p-1 pl-4"
          >
            <input 
              type="email" 
              placeholder={txt.placeholder}
              className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder:text-white/30"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-3 rounded text-[#0A0D14] text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-300 hover:from-white hover:to-blue-200 transition-colors"
            >
              {txt.btn}
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}
