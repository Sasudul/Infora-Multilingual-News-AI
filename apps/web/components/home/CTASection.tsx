'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useI18n } from '@/i18n';

export function CTASection() {
  const { t } = useI18n();

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/[0.04] to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand-500/[0.06] blur-3xl" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="glass glow-border max-w-3xl mx-auto p-10 sm:p-14 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium mb-6">
            <Sparkles size={13} />
            {t.common.freeToUse}
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t.cta.title}{' '}
            <span className="gradient-text">{t.cta.titleHighlight}</span>?
          </h2>

          <p className="text-white/40 max-w-lg mx-auto text-lg mb-8 leading-relaxed">
            {t.cta.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/chat" className="btn-primary flex items-center gap-2 text-base !px-8 !py-4">
              {t.cta.startNow}
              <ArrowRight size={18} />
            </Link>
            <Link href="/services" className="btn-secondary flex items-center gap-2 text-base !px-8 !py-4">
              {t.common.exploreServices}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
