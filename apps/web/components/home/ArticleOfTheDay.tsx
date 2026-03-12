'use client';

import { motion } from 'framer-motion';

const articles = [
  { id: 1, tag: 'News', title: 'Top Breaking Stories from Central Bank', img: 'https://images.unsplash.com/photo-1541888009226-9d044fa90ee0?w=600&h=400&fit=crop' },
  { id: 2, tag: 'Politics', title: 'Parliament Debates New Tax Regulations', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&h=400&fit=crop' },
  { id: 3, tag: 'Technology', title: 'Sri Lanka IT Sector Hits Export Milestone', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop' },
  { id: 4, tag: 'Economy', title: 'Inflation Drops Further In Next Quarter', img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop' },
];

export function ArticleOfTheDay() {
  return (
    <section className="py-24">
      <div className="section-container">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <h2 className="font-display text-4xl font-bold tracking-wide text-white mb-6 sm:mb-0">
            Article Of The Day
          </h2>
          <button className="px-6 py-2.5 rounded-md font-semibold text-xs text-[#0A0D14] bg-gradient-to-r from-blue-100 to-blue-300 hover:from-white hover:to-blue-200 transition-colors">
            Read Our Blogs
          </button>
        </div>

        {/* 4 dark cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#10141F] rounded-2xl overflow-hidden shadow-lg border border-white/5 hover:border-white/10 transition-colors group cursor-pointer"
            >
              <div className="h-48 overflow-hidden m-4 rounded-xl relative">
                {/* Image takes up top padding inside card */}
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity" />
                <img 
                  src={article.img} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              <div className="px-6 pb-6 pt-2">
                <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider mb-2 block">
                  {article.tag}
                </span>
                <h3 className="text-sm font-semibold text-white/90 leading-relaxed font-display">
                  {article.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
