'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/i18n';

const textMap: any = {
  en: { title: 'Our Reliable Sources', subtitle: 'InFora connects you to the most verified sources of information. Stay updated with unbiased news from all major Sri Lankan publishers.', viewSources: 'View Sources', viewDetails: 'View Details' },
  si: { title: 'අපගේ විශ්වාසදායක මූලාශ්‍ර', subtitle: 'InFora ඔබව වඩාත් තහවුරු කළ තොරතුරු මූලාශ්‍ර වෙත සම්බන්ධ කරයි. ශ්‍රී ලංකාවේ ප්‍රධාන මාධ්‍ය ආයතනවලින් අපක්ෂපාතී පුවත් ලබා ගන්න.', viewSources: 'මූලාශ්‍ර බලන්න', viewDetails: 'විස්තර බලන්න' },
  ta: { title: 'நம்பகமான ஆதாரங்கள்', subtitle: 'InFora சரிபார்க்கப்பட்ட தகவல் ஆதாரங்களுடன் உங்களை இணைக்கிறது. இலங்கை வெளியீட்டாளர்களிடமிருந்து செய்திகளைப் பெறுங்கள்.', viewSources: 'ஆதாரங்களைக் காண்க', viewDetails: 'விவரங்களைக் காண்க' }
};

const sources = [
  { id: 1, name: 'Ada Derana', img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop', url: 'https://www.adaderana.lk' },
  { id: 2, name: 'Colombo Gazette', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&h=150&fit=crop', url: 'https://colombogazette.com' },
  { id: 3, name: 'The Island', img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&h=150&fit=crop', url: 'https://island.lk' },
  { id: 4, name: 'NewsWire', img: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=150&h=150&fit=crop', url: 'https://www.newswire.lk' },
];

export function ReliableSources() {
  const { lang } = useI18n();
  const txt = textMap[lang] || textMap.en;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient opacity-50 pointer-events-none" />
      
      <div className="section-container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-4xl font-bold tracking-wide text-white mb-6">
            {txt.title}
          </h2>
          <p className="text-white/50 text-sm mb-8">
            {txt.subtitle}
          </p>
          <button className="px-8 py-3 rounded-md font-semibold text-sm text-[#0A0D14] bg-gradient-to-r from-blue-100 to-blue-300 hover:from-white hover:to-blue-200 transition-all">
            {txt.viewSources}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sources.map((source, idx) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#10141F] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center pt-8 pb-6 shadow-xl hover:bg-[#131A2A] transition-all group"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-transparent opacity-20" />
                <img src={source.img} alt={source.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-display font-medium text-white mb-8 tracking-wide">
                {source.name}
              </h3>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="w-full">
                <button className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#0A0D14] bg-gradient-to-r from-blue-100 to-blue-300 transition-all active:scale-95 group-hover:shadow-[0_0_15px_rgba(125,189,236,0.3)]">
                  {txt.viewDetails}
                </button>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
