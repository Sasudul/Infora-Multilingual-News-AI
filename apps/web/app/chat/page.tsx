'use client';

import { useI18n, type LangCode } from '@/i18n';
import { CHAT_SUGGESTIONS, CHAT_SUGGESTIONS_SI, CHAT_SUGGESTIONS_TA, GOV_SERVICES, LANGUAGES } from '@/lib/constants';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bot,
  Building2,
  CloudSun,
  CreditCard,
  ExternalLink,
  Landmark,
  Mic,
  MicOff,
  Newspaper,
  Send,
  Sparkles,
  User,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const iconMap: Record<string, any> = {
  Newspaper, BookOpen, CreditCard, CloudSun, Landmark, Building2,
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  cards?: ResponseCard[];
}

interface ResponseCard {
  title: string;
  description: string;
  type: 'news' | 'service' | 'info';
  source?: string;
  sourceUrl?: string;
  verified?: boolean;
}

function getDemo(query: string, lang: LangCode): { text: string; cards: ResponseCard[] } {
  const q = query.toLowerCase();

  if (q.includes('news') || q.includes('latest') || q.includes('පුවත්') || q.includes('நவதம') || q.includes('செய்தி')) {
    const texts: Record<LangCode, string> = {
      en: 'Here are the latest news articles from verified Sri Lankan sources:',
      si: 'සත්‍යාපිත ශ්‍රී ලාංකික මූලාශ්‍ර වලින් නවතම පුවත් ලිපි මෙන්න:',
      ta: 'சரிபார்க்கப்பட்ட இலங்கை ஆதாரங்களிலிருந்து சமீபத்திய செய்திக் கட்டுரைகள்:',
    };
    return {
      text: texts[lang],
      cards: [
        { title: 'Central Bank Holds Interest Rates Steady', description: 'CBSL maintains SDFR and SLFR citing stable inflation.', type: 'news', source: 'Daily News', sourceUrl: 'https://www.dailynews.lk', verified: true },
        { title: 'IT/BPO Exports Hit $1.7B Milestone', description: 'Sri Lanka\'s IT sector becomes 5th largest forex earner.', type: 'news', source: 'Ada Derana', sourceUrl: 'https://www.adaderana.lk', verified: true },
        { title: 'Cricket Squad Announced for Test Series', description: '18-member squad with mix of experienced players and new talent.', type: 'news', source: 'NewsFirst', sourceUrl: 'https://www.newsfirst.lk', verified: true },
      ],
    };
  }

  if (q.includes('passport') || q.includes('ගමන් බලපත්') || q.includes('கடவுச்சீட்டு')) {
    const svc = GOV_SERVICES.find(s => s.id === 'passport')!;
    const texts: Record<LangCode, string> = {
      en: `Here's a guide to the Passport Application process (Source: ${svc.officialSource}):`,
      si: `ගමන් බලපත්‍ර අයදුම් ක්‍රියාවලිය පිළිබඳ මාර්ගෝපදේශනය (මූලාශ්‍රය: ${svc.officialSource}):`,
      ta: `கடவுச்சீட்டு விண்ணப்ப செயல்முறை வழிகாட்டி (ஆதாரம்: ${svc.officialSource}):`,
    };
    return {
      text: texts[lang],
      cards: [
        { title: 'Step 1: Obtain Application Form', description: `Get form K35A (new) or K35B (renewal) from Divisional Secretariat or ${svc.officialUrl}`, type: 'service', source: svc.officialSource, sourceUrl: svc.officialUrl, verified: true },
        { title: 'Step 2: Fill & Attach Documents', description: 'NIC (original + copy), Birth Certificate, 3.5×4.5cm photos (blue bg). JP/Attorney certification required.', type: 'service', source: svc.officialSource, sourceUrl: svc.officialUrl, verified: true },
        { title: 'Step 3: Submit & Pay', description: `Submit at Head Office (Battaramulla) or Regional Office. Fee: ${svc.fee}. Processing: ${svc.processingTime}.`, type: 'service', source: svc.officialSource, sourceUrl: svc.officialUrl, verified: true },
      ],
    };
  }

  if (q.includes('nic') || q.includes('identity') || q.includes('හැඳුනුම්') || q.includes('அடையாள')) {
    const svc = GOV_SERVICES.find(s => s.id === 'nic')!;
    const texts: Record<LangCode, string> = {
      en: `Here's how to register for a National Identity Card (Source: ${svc.officialSource}):`,
      si: `ජාතික හැඳුනුම්පත සඳහා ලියාපදිංචි වන ආකාරය (මූලාශ්‍රය: ${svc.officialSource}):`,
      ta: `தேசிய அடையாள அட்டைக்கு பதிவு செய்வது எப்படி (ஆதாரம்: ${svc.officialSource}):`,
    };
    return {
      text: texts[lang],
      cards: [
        { title: 'Required Documents', description: 'Birth Certificate (original), GN certification letter, 3 passport photos, parent\'s NIC copies.', type: 'service', source: svc.officialSource, sourceUrl: svc.officialUrl, verified: true },
        { title: 'Where to Apply', description: 'Divisional Secretariat office in your area of residence.', type: 'service', source: svc.officialSource, sourceUrl: svc.officialUrl, verified: true },
        { title: 'Processing & Fee', description: `Processing: ${svc.processingTime}. Fee: ${svc.fee}. Track status at drp.gov.lk.`, type: 'info', source: svc.officialSource, sourceUrl: svc.officialUrl, verified: true },
      ],
    };
  }

  const fallback: Record<LangCode, string> = {
    en: 'I can help you with Sri Lankan news, government services, and general information. Try asking about passports, NIC registration, latest news, or any government service!',
    si: 'මට ශ්‍රී ලංකාවේ පුවත්, රජයේ සේවා සහ සාමාන්‍ය තොරතුරු සම්බන්ධයෙන් ඔබට උදව් කළ හැකිය. ගමන් බලපත්‍ර, ජාතික හැඳුනුම්පත, නවතම පුවත් ගැන විමසන්න!',
    ta: 'இலங்கை செய்திகள், அரசாங்க சேவைகள் மற்றும் பொதுவான தகவல்களில் நான் உங்களுக்கு உதவ முடியும். கடவுச்சீட்டு, NIC, சமீபத்திய செய்திகளைப் பற்றி கேளுங்கள்!',
  };

  return {
    text: fallback[lang],
    cards: [
      { title: lang === 'si' ? 'පුවත් බලන්න' : lang === 'ta' ? 'செய்திகளைப் பார்க்கவும்' : 'Browse News', description: lang === 'si' ? 'ශ්‍රී ලාංකික මූලාශ්‍ර වලින් නවතම ප්‍රධාන පුවත්.' : lang === 'ta' ? 'இலங்கை ஆதாரங்களிலிருந்து சமீபத்திய செய்தித் தலைப்புகள்.' : 'Get the latest headlines from verified Sri Lankan sources.', type: 'info' },
      { title: lang === 'si' ? 'රජයේ සේවා' : lang === 'ta' ? 'அரசாங்க சேவைகள்' : 'Government Services', description: lang === 'si' ? 'ගමන් බලපත්‍ර, ජාතික හැඳුනුම්පත, රියදුරු බලපත්‍ර සහ තවත් දේ සඳහා පියවරෙන් පියවර මාර්ගෝපදේශ.' : lang === 'ta' ? 'கடவுச்சீட்டு, NIC, ஓட்டுநர் உரிமம் மற்றும் பலவற்றிற்கான படிப்படியான வழிகாட்டிகள்.' : 'Step-by-step guides for passports, NIC, driving license & more.', type: 'info' },
    ],
  };
}

export default function ChatPage() {
  const { lang, setLang, t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const suggestions = lang === 'si' ? CHAT_SUGGESTIONS_SI : lang === 'ta' ? CHAT_SUGGESTIONS_TA : CHAT_SUGGESTIONS;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1200));
    const demo = getDemo(text, lang);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: demo.text,
      timestamp: new Date(),
      cards: demo.cards,
    };
    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // ─── Voice Input (Web Speech API) ───
  const langMap: Record<LangCode, string> = { en: 'en-US', si: 'si-LK', ta: 'ta-LK' };

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langMap[lang] || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="min-h-screen pt-20 flex flex-col bg-surface-900">
      {/* Header bar */}
      <div className="border-b border-white/[0.06] bg-surface-900/80 backdrop-blur-xl">
        <div className="section-container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">{t.chat.title}</h1>
              <p className="text-[10px] text-accent-green">● {t.common.online}</p>
            </div>
          </div>
          {/* Language selector */}
          <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code as LangCode)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  lang === l.code
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {l.flag} {l.nativeName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="section-container py-8 max-w-3xl">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
            
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                {t.chat.welcomeTitle} <span className="gradient-text">Infora</span>
              </h2>
              <p className="text-white/40 mb-10 max-w-md mx-auto">
                {t.chat.welcomeSubtitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {suggestions.map((s) => {
                  const Icon = iconMap[s.icon] || Sparkles;
                  return (
                    <button
                      key={s.text}
                      onClick={() => sendMessage(s.text)}
                      className="card-interactive flex items-center gap-3 px-4 py-3 text-left text-sm"
                    >
                      <Icon size={16} className="text-brand-400 flex-shrink-0" />
                      <span className="text-white/70">{s.text}</span>
                      <ArrowRight size={14} className="text-white/20 ml-auto flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={14} className="text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-brand-500 text-white rounded-br-md'
                            : 'glass text-white/80 rounded-bl-md'
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.cards && msg.cards.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.cards.map((card, ci) => (
                            <motion.div
                              key={ci}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: ci * 0.1 }}
                              className="card-interactive p-4"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                  card.type === 'news' ? 'bg-accent-cyan' : card.type === 'service' ? 'bg-accent-amber' : 'bg-accent-green'
                                }`} />
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-white mb-1">{card.title}</h4>
                                  <p className="text-xs text-white/40">{card.description}</p>
                                  {/* Prominent source */}
                                  {card.source && (
                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.05]">
                                      <span className="text-[10px] text-white/30">{t.common.source}:</span>
                                      {card.sourceUrl ? (
                                        <a
                                          href={card.sourceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[11px] text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 transition-colors"
                                        >
                                          {card.source}
                                          <ExternalLink size={9} />
                                        </a>
                                      ) : (
                                        <span className="text-[11px] text-brand-400 font-medium">{card.source}</span>
                                      )}
                                      {card.verified && (
                                        <BadgeCheck size={12} className="text-accent-green" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center flex-shrink-0 mt-1">
                        <User size={14} className="text-white/60" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 items-start"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-white/[0.06] bg-surface-900/80 backdrop-blur-xl">
        <div className="section-container max-w-3xl py-4">
          <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chat.placeholder}
                className="w-full px-5 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-brand-500/40 focus:bg-white/[0.07] transition-all"
              />
            </div>
            {/* Voice input button */}
            <button
              type="button"
              onClick={toggleVoice}
              className={`relative !px-4 !py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-[0.97] ${
                isListening
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                  : 'bg-white/[0.06] border border-white/[0.1] text-white/50 hover:text-white/80 hover:bg-white/[0.1]'
              }`}
              title="Voice input"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              {isListening && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn-primary !px-4 !py-3.5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
