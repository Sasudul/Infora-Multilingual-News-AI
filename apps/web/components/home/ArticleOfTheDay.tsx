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
  en: { title: 'Article Of The Day', readBlogs: 'Read Our Blogs' },
  si: { title: 'දවසේ විශේෂ පුවත්', readBlogs: 'අපගේ ලිපි කියවන්න' },
  ta: { title: 'இன்றைய சிறந்த கட்டுரைகள்', readBlogs: 'எங்கள் கட்டுரைகளைப் படிக்கவும்' }
};

const FALLBACK_ARTICLES = [
  { id: 'aotd-1', category: 'News', titleEn: 'Top Breaking Stories from Central Bank', titleSi: 'මහ බැංකුවෙන් විශේෂ නිවේදනයක්', titleTa: 'மத்திய வங்கியிலிருந்து சிறப்பு அறிவிப்பு', summaryEn: 'Central Bank decides to keep rates steady amid concerns.', summarySi: 'පොලී අනුපාත නොවෙනස්ව තබා ගැනීමට මහ බැංකුව තීරණය කරයි.', summaryTa: 'பொருளாதார நெருக்கடிக்கு மத்தியில் வட்டி விகிதங்களை மாற்றாமல் வைக்க மத்திய வங்கி முடிவு.', source: 'Daily Mirror', sourceUrl: 'https://dailymirror.lk', publishedAt: 'Today', imageUrl: 'https://images.unsplash.com/photo-1541888009226-9d044fa90ee0?w=600&h=400&fit=crop', url: '#', district: 'Colombo' },
  { id: 'aotd-2', category: 'Politics', titleEn: 'Parliament Debates New Tax Regulations', titleSi: 'නව බදු රෙගුලාසි පිළිබඳ පාර්ලිමේන්තු විවාද', titleTa: 'புதிய வரி விதிமுறைகள் குறித்து நாடாளுமன்ற விவாதம்', summaryEn: 'The Parliament of Sri Lanka held an extensive debate today regarding the proposed new tax reforms aimed at widening the tax net.', summarySi: 'නව බදු ප්‍රතිසංස්කරණ පිළිබඳව ශ්‍රී ලංකා පාර්ලිමේන්තුවේ දී අද පුළුල් විවාදයක් පැවැත්විණි.', summaryTa: 'புதிய வரி சீர்திருத்தங்கள் குறித்து இலங்கை நாடாளுமன்றத்தில் இன்று விரிவான விவாதம் நடைபெற்றது.', source: 'Daily Mirror', sourceUrl: 'https://dailymirror.lk', publishedAt: 'Today', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&h=400&fit=crop', url: '#', district: 'Colombo' },
  { id: 'aotd-3', category: 'Technology', titleEn: 'Sri Lanka IT Sector Hits Export Milestone', titleSi: 'තාක්ෂණික අපනයන ඉහළට', titleTa: 'தொழில்நுட்ப ஏற்றுமதி அதிகரிப்பு', summaryEn: 'The Information Technology sector in Sri Lanka achieved a significant milestone, becoming one of the fastest-growing export industries.', summarySi: 'ශ්‍රී ලංකාවේ තොරතුරු තාක්ෂණ අංශය වේගයෙන්ම වර්ධනය වන අපනයන කර්මාන්තයක් බවට පත්ව ඇත.', summaryTa: 'இலங்கையின் தகவல் தொழில்நுட்பத் துறை வேகமாக வளர்ந்து வரும் ஏற்றுமதித் தொழில்களில் ஒன்றாக மாறியுள்ளது.', source: 'Daily Mirror', sourceUrl: 'https://dailymirror.lk', publishedAt: 'Today', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop', url: '#', district: 'Colombo' },
  { id: 'aotd-4', category: 'Economy', titleEn: 'Inflation Drops Further In Next Quarter', titleSi: 'ලබන කාර්තුවේදී උද්ධමනය තවත් අඩු වේ', titleTa: 'அடுத்த காலாண்டில் பணவீக்கம் மேலும் குறையும்', summaryEn: 'Economic analysts project that the inflation rate will continue to decline steadily over the next quarter.', summarySi: 'ලබන කාර්තුව වන විට උද්ධමන අනුපාතය තවත් අඩු වනු ඇති බවට ආර්ථික විශ්ලේෂකයෝ පුරෝකථනය කරති.', summaryTa: 'அடுத்த காலாண்டில் பணவீக்கம் மேலும் குறையும் என பொருளாதார நிபுணர்கள் கணிக்கின்றனர்.', source: 'Daily Mirror', sourceUrl: 'https://dailymirror.lk', publishedAt: 'Today', imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop', url: '#', district: 'Colombo' },
];

export function ArticleOfTheDay() {
  const { lang } = useI18n();
  const [articles, setArticles] = useState<any[]>(FALLBACK_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticleType | null>(null);

  useEffect(() => {
    newsApi.getLatest(10)
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.slice(3, 7).map((item: any) => {
            const cat = item.category?.toLowerCase() || 'local';
            let fallbackImage = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop'; // Modern Newspapers
            if (cat.includes('economy')) fallbackImage = 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop';
            if (cat.includes('technology')) fallbackImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop';
            if (cat.includes('sports')) fallbackImage = 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop';
            if (cat.includes('politics')) fallbackImage = 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&h=400&fit=crop';

            return {
              id: item.id || Math.random().toString(),
              category: item.category || 'local',
              title: lang === 'si' ? (item.titleSi || item.titleEn) : lang === 'ta' ? (item.titleTa || item.titleEn) : item.titleEn,
              summary: lang === 'si' ? (item.summarySi || item.summaryEn) : lang === 'ta' ? (item.summaryTa || item.summaryEn) : item.summaryEn,
              source: item.source || 'Infora News',
              sourceUrl: item.sourceUrl || '#',
              imageUrl: getValidImage(item.imageUrl, fallbackImage),
              url: item.url || '#',
              publishedAt: formatNewsDate(item.publishedAt),
              district: item.district || 'Colombo',
            };
          });
          
          while (mapped.length < 4) {
            const fb = FALLBACK_ARTICLES[mapped.length];
            mapped.push({
              ...fb,
              title: lang === 'si' ? fb.titleSi : lang === 'ta' ? fb.titleTa : fb.titleEn,
              summary: lang === 'si' ? fb.summarySi : lang === 'ta' ? fb.summaryTa : fb.summaryEn,
            });
          }
          
          setArticles(mapped.slice(0, 4));
        }
      })
      .catch((err) => console.error("AOTD fetch error", err));
  }, [lang]);

  const txt = textMap[lang] || textMap.en;

  return (
    <section className="py-24">
      <div className="section-container">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <h2 className="font-display text-4xl font-bold tracking-wide text-white mb-6 sm:mb-0">
            {txt.title}
          </h2>
          <button className="px-6 py-2.5 rounded-md font-semibold text-xs text-[#0A0D14] bg-gradient-to-r from-blue-100 to-blue-300 hover:from-white hover:to-blue-200 transition-colors">
            {txt.readBlogs}
          </button>
        </div>

        {/* 4 dark cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, idx) => (
            <motion.div
              onClick={() => setSelectedArticle(article)}
              key={article.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#10141F] rounded-2xl overflow-hidden shadow-lg border border-white/5 hover:border-white/10 transition-colors group cursor-pointer block"
            >
              <div className="h-48 overflow-hidden m-4 rounded-xl relative">
                {/* Image takes up top padding inside card */}
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity" />
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              <div className="px-6 pb-6 pt-2">
                <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider mb-2 block">
                  {article.category}
                </span>
                <h3 className="text-sm font-semibold text-white/90 leading-relaxed font-display line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* News details modal */}
      {selectedArticle && (
        <NewsModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </section>
  );
}
