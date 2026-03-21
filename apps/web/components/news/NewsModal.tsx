import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, MapPin, Newspaper, Volume2, VolumeX } from 'lucide-react';

export interface NewsArticleType {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  district: string;
  url: string; // the actual link to the full news
}

export function NewsModal({ article, onClose }: { article: NewsArticleType | null; onClose: () => void }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!article) return null;

  const toggleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = `${article.title}. ${article.summary}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      const isSinhala = /[\u0D80-\u0DFF]/.test(article.title);
      const isTamil = /[\u0B80-\u0BFF]/.test(article.title);
      utterance.lang = isSinhala ? 'si-LK' : isTamil ? 'ta-IN' : 'en-US';
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="absolute inset-0 bg-black/80 backdrop-blur-sm"
           onClick={onClose}
        />
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           className="relative w-full max-w-2xl bg-[#0A0D14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
        >
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button 
              onClick={toggleSpeech} 
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isSpeaking ? 'bg-brand-500 text-white' : 'bg-black/50 hover:bg-black/80 text-white/70 hover:text-white'}`}
              title={isSpeaking ? "Stop reading" : "Read aloud"}
            >
              {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-white/70 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="relative h-64 sm:h-80 shrink-0">
             <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/20 to-transparent" />
             <span className="absolute top-4 left-4 px-3 py-1 bg-brand-500/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded-lg">
                {article.category}
             </span>
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto">
             <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug mb-4">
               {article.title}
             </h2>

             <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 mb-6">
               <div className="flex items-center gap-1.5 font-medium text-brand-300">
                  <Newspaper size={14} />
                  {article.source}
               </div>
               <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {article.publishedAt}
               </div>
               <div className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {article.district}
               </div>
             </div>

             <div className="text-white/70 text-sm leading-relaxed mb-8">
                <p>{article.summary}</p>
             </div>

             <div className="flex justify-end pt-6 border-t border-white/10">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-xl font-bold text-xs text-[#0A0D14] bg-gradient-to-r from-blue-100 to-blue-300 hover:from-white hover:to-blue-200 transition-colors flex items-center gap-2">
                   Read Full Article <ExternalLink size={16} />
                </a>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
