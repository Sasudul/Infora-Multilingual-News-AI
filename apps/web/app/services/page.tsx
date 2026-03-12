'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  CreditCard,
  Car,
  FileText,
  Building2,
  Truck,
  ChevronRight,
  Clock,
  DollarSign,
  FileCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BadgeCheck,
} from 'lucide-react';
import { GOV_SERVICES } from '@/lib/constants';
import { useI18n } from '@/i18n';

const iconMap: Record<string, any> = {
  BookOpen, CreditCard, Car, FileText, Building2, Truck,
};

export default function ServicesPage() {
  const { lang, t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const service = GOV_SERVICES.find((s) => s.id === selected);

  const getTitle = (svc: typeof GOV_SERVICES[number]) =>
    lang === 'si' ? svc.titleSi : lang === 'ta' ? svc.titleTa : svc.title;

  const getDesc = (svc: typeof GOV_SERVICES[number]) =>
    lang === 'si' ? svc.descSi : lang === 'ta' ? svc.descTa : svc.description;

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
            {t.services.sectionLabel}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            {t.services.title} <span className="gradient-text">{t.services.titleHighlight}</span>
          </h1>
          <p className="text-white/40 max-w-xl text-lg">{t.services.subtitle}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {GOV_SERVICES.map((svc, idx) => {
                const Icon = iconMap[svc.icon] || FileText;
                return (
                  <motion.button
                    key={svc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    onClick={() => setSelected(svc.id)}
                    className="card-interactive p-6 text-left group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-white mb-1">
                      {getTitle(svc)}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed mb-4">
                      {getDesc(svc)}
                    </p>

                    {/* Official source label */}
                    <div className="flex items-center gap-2 mb-3 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                      <BadgeCheck size={12} className="text-accent-green flex-shrink-0" />
                      <span className="text-[10px] text-white/30 truncate">{t.common.source}: {svc.officialSource}</span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-white/25">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {svc.processingTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={11} />
                        {svc.fee}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.services.viewGuide} <ChevronRight size={14} />
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : service ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl"
            >
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
              >
                <ArrowLeft size={16} />
                {t.services.backToAll}
              </button>

              {/* Service header */}
              <div className="glass p-6 sm:p-8 mb-6">
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    {(() => { const Icon = iconMap[service.icon] || FileText; return <Icon size={26} className="text-white" />; })()}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-2xl font-bold text-white mb-1">
                      {getTitle(service)}
                    </h2>
                    <p className="text-sm text-white/50 mb-3">{getDesc(service)}</p>
                    {/* Official source link */}
                    <a
                      href={service.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-green/10 border border-accent-green/20 text-xs text-accent-green hover:bg-accent-green/15 transition-all"
                    >
                      <BadgeCheck size={13} />
                      {service.officialSource}
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] text-xs text-white/50">
                    <Clock size={13} className="text-accent-cyan" />
                    <span className="text-white/25">{t.services.processingTime}:</span>
                    {service.processingTime}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] text-xs text-white/50">
                    <DollarSign size={13} className="text-accent-amber" />
                    <span className="text-white/25">{t.services.fee}:</span>
                    {service.fee}
                  </div>
                </div>
              </div>

              {/* Required documents */}
              <div className="glass p-6 sm:p-8 mb-6">
                <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileCheck size={18} className="text-accent-amber" />
                  {t.services.requiredDocs}
                </h3>
                <div className="space-y-2.5">
                  {service.documents.map((doc, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 text-sm text-white/60"
                    >
                      <CheckCircle2 size={15} className="text-accent-green flex-shrink-0 mt-0.5" />
                      {doc}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="glass p-6 sm:p-8 mb-6">
                <h3 className="font-display text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <AlertCircle size={18} className="text-brand-400" />
                  {t.services.stepByStep}
                </h3>
                <div className="space-y-5">
                  {service.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">
                        {i + 1}
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed pt-1">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="glass p-4 border-accent-amber/20">
                <p className="text-xs text-white/30 leading-relaxed">
                  ⚠️ <span className="text-white/50 font-medium">{t.common.disclaimer.split(':')[0]}:</span>{' '}
                  {t.common.disclaimer.split(':').slice(1).join(':')}
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
