'use client';

import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { TrendingNews } from '@/components/home/TrendingNews';
import { ReliableSources } from '@/components/home/ReliableSources';
import { Feedback } from '@/components/home/Feedback';
import { ArticleOfTheDay } from '@/components/home/ArticleOfTheDay';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0D14]">
      <Hero />
      <Features /> {/* Acts as the Ticker */}
      <TrendingNews />
      <ReliableSources />
      <Feedback />
      <ArticleOfTheDay />
    </div>
  );
}
