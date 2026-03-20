'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { newsApi } from '@/lib/api';
import { useI18n } from '@/i18n';
import { NewsModal, type NewsArticleType } from '@/components/news/NewsModal';

const formatNewsDate = (dateStr: string) => {
  if (!dateStr) return 'Recent';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recent';
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch(e) { return 'Recent'; }
};

const getValidImage = (url: any, fallback: string) => {
  if (!url || typeof url !== 'string' || url === 'null' || url.trim() === '' || !url.startsWith('http')) return fallback;
  return url;
};

const textMap: any = {
  en: { title: 'Trending News', viewMore: 'View More' },
  si: { title: 'නැගී එන පුවත්', viewMore: 'තවත් බලන්න' },
  ta: { title: 'பிரபலமான செய்திகள்', viewMore: 'மேலும் பார்க்க' }
};

const FALLBACK_ARTICLES = [
  {
    id: 'trending-1',
    titleEn: 'First Century By Nissanka',
    titleSi: 'නිස්සංකගෙන් පළමු ශතකය',
    titleTa: 'நிஸ்ஸங்கவின் முதல் சதம்',
    summaryEn: 'Pathum Nissanka scored his first Test century against the visitors.',
    summarySi: 'පැතුම් නිස්සංක සිය පළමු ටෙස්ට් ශතකය වාර්තා කළේය.',
    summaryTa: 'பதும் நிஸ்ஸங்க தனது முதல் டெஸ்ட் சதத்தை பதிவு செய்தார்.',
    source: 'Ada Derana',
    authorImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=400&fit=crop',
    url: '#',
    category: 'sports',
    publishedAt: 'Today',
    district: 'Colombo',
    sourceUrl: 'https://www.adaderana.lk',
  },
  {
    id: 'trending-2',
    titleEn: 'Heavy Rain in Sri Lanka',
    titleSi: 'ශ්‍රී ලංකාවට තද වැසි',
    titleTa: 'இலங்கையில் பலத்த மழை',
    summaryEn: 'Meteorology department warns of heavy showers across multiple provinces.',
    summarySi: 'පළාත් කිහිපයකට තද වැසි ඇතිවිය හැකි බවට කාලගුණ විද්‍යා දෙපාර්තමේන්තුව අනතුරු අඟවයි.',
    summaryTa: 'பல மாகாணங்களில் பலத்த மழை பெய்யும் என வளிமண்டலவியல் திணைக்களம் எச்சரித்துள்ளது.',
    source: 'Hiru News',
    authorImg: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&h=400&fit=crop',
    url: '#',
    category: 'local',
    publishedAt: 'Today',
    district: 'Islandwide',
    sourceUrl: 'https://www.hirunews.lk',
  },
  {
    id: 'trending-3',
    titleEn: 'Train Crash in Gampaha',
    titleSi: 'ගම්පහ දුම්රිය අනතුරක්',
    titleTa: 'கம்பஹாவில் ரயில் விபத்து',
    summaryEn: 'Train delays are expected after a collision near the Gampaha main station early morning.',
    summarySi: 'ගම්පහ ප්‍රධාන දුම්රිය ස්ථානය අසල අද අලුයම සිදුවූ අනතුරකින් පසු දුම්රිය ප්‍රමාදයක් අපේක්ෂා කෙරේ.',
    summaryTa: 'கம்பஹா பிரதான ரயில் நிலையம் அருகே அதிகாலை இடம்பெற்ற விபத்தின் பின்னர் ரயில் தாமதங்கள் எதிர்பார்க்கப்படுகின்றன.',
    source: 'Daily Mirror',
    authorImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&h=400&fit=crop',
    url: '#',
    category: 'local',
    publishedAt: 'Yesterday',
    district: 'Gampaha',
    sourceUrl: 'https://www.dailymirror.lk',
  },
];

export function TrendingNews() {
  const { lang, t } = useI18n();
  const [articles, setArticles] = useState<any[]>(FALLBACK_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticleType | null>(null);

  useEffect(() => {
    // Fetch 3 random/latest news for trending
    newsApi.getLatest(10)
      .then((data) => {
        if (data && data.length > 0) {
          // Shuffle or take top 3
          const top = data.slice(0, 3).map((item: any) => {
            const cat = item.category?.toLowerCase() || 'local';
            let fallbackImage = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop'; // Modern Newspapers
            if (cat.includes('economy')) fallbackImage = 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop';
            if (cat.includes('technology')) fallbackImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop';
            if (cat.includes('sports')) fallbackImage = 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop';
            if (cat.includes('politics')) fallbackImage = 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&h=400&fit=crop';

            return {
              id: item.id || Math.random().toString(),
              title: lang === 'si' ? (item.titleSi || item.titleEn) : lang === 'ta' ? (item.titleTa || item.titleEn) : item.titleEn,
              summary: lang === 'si' ? (item.summarySi || item.summaryEn) : lang === 'ta' ? (item.summaryTa || item.summaryEn) : item.summaryEn,
              source: item.source || 'Infora News',
              authorImg: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop',
              imageUrl: getValidImage(item.imageUrl, fallbackImage),
              url: item.url || '#',
              category: item.category || 'local',
              publishedAt: formatNewsDate(item.publishedAt),
              district: item.district || 'Colombo',
              sourceUrl: item.sourceUrl || '#',
            };
          });
          
          // Pad with fallbacks if less than 3
          while (top.length < 3) {
            const fb = FALLBACK_ARTICLES[top.length];
            top.push({
              ...fb,
              title: lang === 'si' ? fb.titleSi : lang === 'ta' ? fb.titleTa : fb.titleEn,
              summary: lang === 'si' ? fb.summarySi : lang === 'ta' ? fb.summaryTa : fb.summaryEn,
            });
          }
          
          setArticles(top.slice(0, 3));
        }
      })
      .catch((err) => console.error("Trending fetch error", err));
  }, [lang]);

  const txt = textMap[lang] || textMap.en;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-container relative z-10">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white text-center mb-16">
          {txt.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {articles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative w-full h-[380px] rounded-[32px] overflow-hidden group shadow-2xl shadow-black/50"
            >
              <img
                src={article.imageUrl}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* The white glass overlay box at the bottom */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl">
                <h3 className="text-sm font-bold text-[#0A0D14] mb-3 truncate px-1">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 mb-4 px-1">
                  <img
                    src={article.authorImg}
                    alt={article.source}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-xs text-slate-600 font-medium">{article.source}</span>
                </div>
                <button onClick={() => setSelectedArticle(article)} className="w-full py-2.5 rounded-xl font-bold text-xs text-[#0A0D14] bg-gradient-to-r from-blue-100 to-blue-300 hover:from-white hover:to-blue-200 transition-colors">
                  {txt.viewMore}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 mt-12">
          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-brand-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
        </div>
      </div>
      
      {/* News details modal */}
      {selectedArticle && (
        <NewsModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </section>
  );
}
