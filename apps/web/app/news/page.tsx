'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Landmark,
  TrendingUp,
  Cpu,
  Trophy,
  Globe2,
  MapPin,
  Clock,
  ExternalLink,
  Search,
  BadgeCheck,
  Newspaper,
} from 'lucide-react';
import { NEWS_CATEGORIES, DEMO_NEWS, NEWS_SOURCES } from '@/lib/constants';
import { useI18n } from '@/i18n';

const iconMap: Record<string, any> = {
  Globe, Landmark, TrendingUp, Cpu, Trophy, Globe2, MapPin,
};

export default function NewsPage() {
  const { lang, t } = useI18n();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = DEMO_NEWS.filter((n) => {
    const matchesCategory = activeCategory === 'all' || n.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (cat: typeof NEWS_CATEGORIES[number]) => {
    if (lang === 'si') return cat.labelSi;
    if (lang === 'ta') return cat.labelTa;
    return cat.label;
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-surface-900">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-2 block">
            {t.news.sectionLabel}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            {t.news.title} <span className="gradient-text">{t.news.titleHighlight}</span>
          </h1>
          <p className="text-white/40 max-w-xl text-lg">
            {t.news.subtitle}
          </p>
        </motion.div>

        {/* Verified Sources Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass p-4 mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <BadgeCheck size={16} className="text-accent-green" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              {t.news.verifiedSource}s
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {NEWS_SOURCES.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-all group"
              >
                <span>{source.logo}</span>
                <span className="font-medium">{source.name}</span>
                <span className="text-white/20">•</span>
                <span className="text-[10px] text-white/25">{source.type}</span>
                <ExternalLink size={10} className="text-white/15 group-hover:text-white/40 transition-colors" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Search + Categories */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.news.searchPlaceholder}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-brand-500/40 transition-all"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {NEWS_CATEGORIES.map((cat) => {
              const Icon = iconMap[cat.icon] || Globe;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
                      : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/60 hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon size={14} />
                  {getCategoryLabel(cat)}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.map((article, idx) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="card-interactive overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-800 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-lg text-[10px] font-semibold text-white/80 uppercase tracking-wider">
                  {getCategoryLabel(NEWS_CATEGORIES.find(c => c.id === article.category) || NEWS_CATEGORIES[0])}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-base font-semibold text-white mb-2 leading-snug line-clamp-2 group-hover:text-brand-300 transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-white/35 leading-relaxed mb-4 line-clamp-2">
                  {article.summary}
                </p>

                {/* Source attribution — prominent */}
                <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <Newspaper size={12} className="text-brand-400" />
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-brand-300 hover:text-brand-200 transition-colors flex items-center gap-1"
                  >
                    {article.source}
                    <ExternalLink size={9} />
                  </a>
                  {article.sourceVerified && (
                    <BadgeCheck size={13} className="text-accent-green ml-auto" />
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-white/25">
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {article.publishedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {article.district}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-white/30 text-lg">{t.news.noArticles}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
