'use client';

import { useI18n } from '@/i18n';
import { motion } from 'framer-motion';

const textMap: any = {
  en: { title: 'Our Reliable Sources', subtitle: 'InFora connects you to the most verified sources of information. Stay updated with unbiased news from all major Sri Lankan publishers.', viewSources: 'View Sources', viewDetails: 'View Details' },
  si: { title: 'අපගේ විශ්වාසදායක මූලාශ්‍ර', subtitle: 'InFora ඔබව වඩාත් තහවුරු කළ තොරතුරු මූලාශ්‍ර වෙත සම්බන්ධ කරයි. ශ්‍රී ලංකාවේ ප්‍රධාන මාධ්‍ය ආයතනවලින් අපක්ෂපාතී පුවත් ලබා ගන්න.', viewSources: 'මූලාශ්‍ර බලන්න', viewDetails: 'විස්තර බලන්න' },
  ta: { title: 'நம்பகமான ஆதாரங்கள்', subtitle: 'InFora சரிபார்க்கப்பட்ட தகவல் ஆதாரங்களுடன் உங்களை இணைக்கிறது. இலங்கை வெளியீட்டாளர்களிடமிருந்து செய்திகளைப் பெறுங்கள்.', viewSources: 'ஆதாரங்களைக் காண்க', viewDetails: 'விவரங்களைக் காண்க' }
};

const sources = [
  { id: 1, name: 'Ada Derana', img: 'https://tse2.mm.bing.net/th/id/OIF.914WzCRqgwY0SbjVbvB8Sw?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3?w=150&h=150&fit=crop', url: 'https://www.adaderana.lk' },
  { id: 2, name: 'Colombo Gazette', img: 'https://tse4.mm.bing.net/th/id/OIP.EIwRDsBIe-oRnVVkJ7qfZwHaEK?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3w=150&h=150&fit=crop', url: 'https://colombogazette.com' },
  { id: 3, name: 'The Island', img: 'https://tse4.mm.bing.net/th/id/OIP.3osVVFwzlq7y2j-PcfaWOAAAAA?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3?w=150&h=150&fit=crop', url: 'https://island.lk' },
  { id: 4, name: 'NewsWire', img: 'https://www.newswire.lk/wp-content/uploads/2021/02/new-logo-cropped-1.png', url: 'https://www.newswire.lk' },
  { id: 5, name: 'Daily Mirror', img: 'https://www.liblogo.com/img-logo/da8753d340-daily-mirror-logo-daily-mirror-amp-sunday-mirror-apps-on-google-play.png?w=150&h=150&fit=crop', url: 'https://www.dailymirror.lk' },
  { id: 6, name: 'Hiru News', img: 'https://th.bing.com/th/id/R.f1fd2896cf6798d9592c5a64ec10ee89?rik=XOqZPWRZ%2bJY3Sg&pid=ImgRaw&r=0', url: 'https://www.hirunews.lk' },
  { id: 7, name: 'Daily News', img: 'https://images.rawpixel.com/image_png_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcyNi0xMzAtcC5wbmc.png', url: 'https://www.dailynews.lk' },
  { id: 8, name: 'News First', img: 'https://1.bp.blogspot.com/-ndV7sIbUq2E/YLzsxWn953I/AAAAAAABkhs/XiuT533KIsAr5UKrLaUo1AeqhJtQZABcACLcBGAsYHQ/s709/News-First-Sri-Lanka.jpg', url: 'https://www.newsfirst.lk' },
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
