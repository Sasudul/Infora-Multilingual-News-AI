'use client';

import { useI18n } from '@/i18n';
import { newsApi } from '@/lib/api';
import { AnimatePresence, motion } from 'framer-motion';
import { MicOff, Volume2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useReporter } from './ReporterProvider';

// Re-export hook for convenience
export { useReporter } from './ReporterProvider';

const AVATAR_CLOSED = '/avatar/reporter-closed-mouth.png';
const AVATAR_OPEN = '/avatar/reporter-open-mouth.png';

export function NewsReporterAvatar() {
  const { lang } = useI18n();
  const { speakText, stopSpeaking, isSpeaking, mouthOpenness } = useReporter();
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentScript, setCurrentScript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isBlinking, setIsBlinking] = useState(false);

  // Blink effect
  useEffect(() => {
    if (isSpeaking) return;
    const id = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 2500 + Math.random() * 3000);
    return () => clearInterval(id);
  }, [isSpeaking]);

  const handlePlayNews = async () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const articles = await newsApi.getLatest(3);
      let script: string;
      if (!articles || articles.length === 0) {
        script = lang === 'si'
          ? 'සුභ දවසක්! මේ මොහොතේ නවතම පුවත් නොමැත.'
          : lang === 'ta'
          ? 'நல்ல நாள்! தற்போது புதிய செய்திகள் இல்லை.'
          : 'Good day! No new articles at the moment.';
      } else {
        const headlines = articles.slice(0, 3).map((a: any) => {
          const title = lang === 'si' ? (a.titleSi || a.titleEn) : lang === 'ta' ? (a.titleTa || a.titleEn) : a.titleEn;
          const summary = lang === 'si' ? (a.summarySi || a.summaryEn) : lang === 'ta' ? (a.summaryTa || a.summaryEn) : a.summaryEn;
          return `${title}. ${summary || ''}`;
        });
        const greetings: Record<string, string> = {
          en: "Good day! I'm your Infora News Reporter. Here are today's top stories. ",
          si: 'සුභ දවසක්! මම ඔබගේ ඉන්ෆෝරා පුවත් වාර්තාකාරිණිය. අද ප්‍රධාන පුවත් මෙන්න. ',
          ta: 'நல்ல நாள்! நான் உங்கள் இன்ஃபோரா செய்தி நிருபர். இன்றைய முக்கிய செய்திகள் இதோ. ',
        };
        script = (greetings[lang] || greetings.en) + headlines.join(' Next up: ');
      }
      setCurrentScript(script);
      setIsLoading(false);
      speakText(script);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to generate news broadcast');
    }
  };

  const texts = {
    en: { playNews: 'Play News', stopNews: 'Stop', loading: 'Preparing...', reporter: 'AI Reporter', live: 'LIVE' },
    si: { playNews: 'පුවත් ඇසීම', stopNews: 'නවතන්න', loading: 'සූදානම්...', reporter: 'AI වාර්තාකාරිණි', live: 'සජීවී' },
    ta: { playNews: 'செய்திகளைக் கேளுங்கள்', stopNews: 'நிறுத்து', loading: 'தயாராகிறது...', reporter: 'AI நிருபர்', live: 'நேரலை' },
  };
  const t = texts[lang as keyof typeof texts] || texts.en;

  return (
    <div className="fixed bottom-6 left-6 z-[200] flex flex-col items-center gap-3">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-[#0F1420]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl w-[280px] mb-2"
          >
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-3 right-3 p-1 text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-white/80 text-sm font-semibold tracking-wide">{t.reporter}</span>
              {isSpeaking && (
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full border border-red-500/30 uppercase tracking-wider"
                >
                  ● {t.live}
                </motion.span>
              )}
            </div>

            {currentScript && (
              <div className="bg-white/[0.03] rounded-xl p-3 mb-3 border border-white/5 max-h-32 overflow-y-auto">
                <p className="text-[11px] text-white/50 leading-relaxed">
                  {currentScript.substring(0, 200)}
                  {currentScript.length > 200 ? '...' : ''}
                </p>
              </div>
            )}

            <button
              onClick={handlePlayNews}
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                isSpeaking
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                  : isLoading
                  ? 'bg-white/5 text-white/30 cursor-wait'
                  : 'bg-gradient-to-r from-[#7DBDEC]/20 to-[#5A9FD4]/20 text-[#7DBDEC] border border-[#7DBDEC]/30 hover:border-[#7DBDEC]/50 hover:shadow-[0_0_20px_rgba(125,189,236,0.15)]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-[#7DBDEC] rounded-full animate-spin" />
                  {t.loading}
                </>
              ) : isSpeaking ? (
                <>
                  <MicOff size={16} />
                  {t.stopNews}
                </>
              ) : (
                <>
                  <Volume2 size={16} />
                  {t.playNews}
                </>
              )}
            </button>

            {error && <p className="text-[10px] text-rose-400 mt-2 text-center">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Circle */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        {isSpeaking && (
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0px rgba(125,189,236,0.2)',
                '0 0 25px rgba(125,189,236,0.6)',
                '0 0 0px rgba(125,189,236,0.2)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
          />
        )}

        {isSpeaking && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 z-10">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-4 h-4 rounded-full bg-red-500 border-2 border-[#0A0D14] flex items-center justify-center"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </motion.div>
          </motion.div>
        )}

        <div
          className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${
            isSpeaking
              ? 'border-[#7DBDEC]/80 shadow-[0_0_20px_rgba(125,189,236,0.4)]'
              : 'border-white/20 group-hover:border-[#7DBDEC]/50 shadow-lg'
          }`}
        >
          <motion.div
            animate={isSpeaking ? {} : { scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full relative"
            style={{
              opacity: isBlinking && !isSpeaking ? 0.7 : 1,
              transition: 'opacity 0.1s ease',
            }}
          >
            <img
              src={AVATAR_CLOSED}
              alt="AI Reporter"
              className="w-full h-full object-cover absolute inset-0"
              style={{ opacity: 1 - mouthOpenness, transition: 'opacity 0.04s ease' }}
            />
            <img
              src={AVATAR_OPEN}
              alt="AI Reporter Speaking"
              className="w-full h-full object-cover absolute inset-0"
              style={{ opacity: mouthOpenness, transition: 'opacity 0.04s ease' }}
            />
          </motion.div>
        </div>

        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full pl-3 pointer-events-none hidden sm:block"
          >
            <div className="bg-[#0F1420]/90 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5 whitespace-nowrap">
              <span className="text-[11px] text-white/60 font-medium">{t.reporter}</span>
            </div>
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}
