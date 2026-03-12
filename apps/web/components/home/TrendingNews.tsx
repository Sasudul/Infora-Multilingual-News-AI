'use client';

import { motion } from 'framer-motion';

const articles = [
  {
    id: 1,
    title: 'First Century By Nissanka',
    author: 'Ada Derana',
    authorImg: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Heavy Rain in Sri Lanka',
    author: 'Hiru News',
    authorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Train Crash in Gampaha',
    author: 'Daily Mirror',
    authorImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&h=400&fit=crop',
  },
];

export function TrendingNews() {
  return (
    <section className="py-16">
      <div className="section-container">
        <h2 className="text-center font-display text-3xl font-bold tracking-wide text-white mb-12">
          Trending News
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
                src={article.image}
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
                    alt={article.author}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-xs text-slate-600 font-medium">{article.author}</span>
                </div>
                <button className="w-full py-2.5 rounded-xl font-bold text-xs text-[#0A0D14] bg-gradient-to-r from-blue-100 to-blue-300 hover:from-white hover:to-blue-200 transition-colors">
                  View More
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
    </section>
  );
}
