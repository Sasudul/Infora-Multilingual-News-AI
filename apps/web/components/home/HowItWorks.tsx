'use client';

import { motion } from 'framer-motion';
import { MessageSquareText, Search, Zap, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/i18n';

export function HowItWorks() {
  const { t } = useI18n();

  const steps = [
    { number: '01', icon: MessageSquareText, title: t.howItWorks.step1Title, description: t.howItWorks.step1Desc, color: 'brand-500' },
    { number: '02', icon: Search, title: t.howItWorks.step2Title, description: t.howItWorks.step2Desc, color: 'accent-cyan' },
    { number: '03', icon: Zap, title: t.howItWorks.step3Title, description: t.howItWorks.step3Desc, color: 'accent-amber' },
    { number: '04', icon: CheckCircle2, title: t.howItWorks.step4Title, description: t.howItWorks.step4Desc, color: 'accent-green' },
  ];

  return (
    <section className="relative py-32 bg-surface-950/50">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-3 block">
            {t.howItWorks.sectionLabel}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t.howItWorks.title}{' '}
            <span className="gradient-text">{t.howItWorks.titleHighlight}</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-lg">{t.howItWorks.subtitle}</p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/30 via-accent-cyan/20 to-accent-green/30 hidden sm:block" />
          <div className="space-y-12">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex gap-6 items-start"
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-${step.color}/10 border border-${step.color}/20 flex items-center justify-center`}>
                    <step.icon size={24} className={`text-${step.color}`} />
                  </div>
                </div>
                <div className="pt-1">
                  <span className="text-xs font-mono text-white/20 mb-1 block">Step {step.number}</span>
                  <h3 className="font-display text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed max-w-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
