'use client';

import { motion } from 'framer-motion';
import {
  Globe,
  Brain,
  Database,
  Newspaper,
  Landmark,
  MessageSquare,
  Shield,
  Zap,
  Users,
  Code2,
  ArrowRight,
  Server,
  Layers,
  Workflow,
} from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/i18n';

const techStack = [
  { category: 'Frontend', items: ['Next.js 14', 'React Native / Expo', 'Framer Motion', 'Tailwind CSS'] },
  { category: 'Backend', items: ['Spring Boot 3.2', 'Java 17', 'Firebase Admin SDK', 'WebSocket (STOMP)'] },
  { category: 'AI / NLP', items: ['Rasa NLP Framework', 'Google Translate API', 'Intent Classification', 'Entity Extraction'] },
  { category: 'Database', items: ['Cloud Firestore', 'Firebase Auth', 'Firebase Storage', 'Real-time Sync'] },
  { category: 'Data Pipeline', items: ['OkHttp / RSS Client', 'Jackson XML Parser', 'News Summarization', 'Scheduled Fetching'] },
  { category: 'DevOps', items: ['Firebase Hosting', 'Cloud Functions', 'Maven CI/CD', 'Docker (planned)'] },
];

const pipelineSteps = [
  { label: 'User Input', desc: 'Question in Sinhala, Tamil, or English', icon: Users, color: 'brand-500' },
  { label: 'Language Detection', desc: 'Auto-detect input language via NLP', icon: Globe, color: 'accent-cyan' },
  { label: 'Intent Classification', desc: 'News query? Service request? General?', icon: Brain, color: 'violet-500' },
  { label: 'Query Processing', desc: 'Search news DB or knowledge base', icon: Database, color: 'accent-amber' },
  { label: 'Response Generation', desc: 'Structured answer with source cards', icon: Zap, color: 'accent-green' },
  { label: 'Translation & Delivery', desc: 'Translate to user language & return', icon: MessageSquare, color: 'rose-500' },
];

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen pt-24 pb-20 bg-surface-900">
      <div className="section-container">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-3 block">
            About the Platform
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5">
            Building <span className="gradient-text">Infora</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed">
            A production-ready, multilingual conversational AI platform enabling Sri Lankan citizens
            to access news, government services, and information — in Sinhala, Tamil, and English.
          </p>
        </motion.div>

        {/* Mission cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-24">
          {[
            { icon: Globe, title: 'Multilingual First', desc: 'Every feature supports Sinhala, Tamil, and English natively — not as an afterthought.', color: 'from-accent-cyan to-blue-400' },
            { icon: Shield, title: 'Verified & Accurate', desc: 'News from verified Sri Lankan outlets. Government data from official sources only.', color: 'from-accent-green to-emerald-400' },
            { icon: Users, title: 'Built for Citizens', desc: 'Designed for everyday citizens navigating government services and staying informed.', color: 'from-brand-500 to-brand-400' },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-5 shadow-lg`}>
                <card.icon size={22} className="text-white" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* AI Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-3 block">
              AI Pipeline
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              How the <span className="gradient-text">AI Works</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              From user question to structured answer — the complete processing flow.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* connectors */}
              <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/40 via-accent-cyan/30 to-accent-green/30 hidden sm:block" />
              <div className="space-y-8">
                {pipelineSteps.map((step, idx) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-5 items-start"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-${step.color}/10 border border-${step.color}/20 flex items-center justify-center`}>
                      <step.icon size={22} className={`text-${step.color}`} />
                    </div>
                    <div className="pt-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-mono text-white/20">0{idx + 1}</span>
                        <h3 className="font-display text-lg font-semibold text-white">{step.label}</h3>
                      </div>
                      <p className="text-sm text-white/40">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Data Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-3 block">
              Data Pipeline
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              News <span className="gradient-text">Data Flow</span>
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="glass p-6 sm:p-8">
              {[
                { step: 'News Sources', detail: 'Ada Derana, Daily Mirror, NewsFirst, Daily News, Sunday Times' },
                { step: 'Web Scraper', detail: 'OkHTTP + Jackson XML for RSS feeds, scheduled job every 15 min' },
                { step: 'Article Cleaning', detail: 'Remove HTML tags, normalize text, extract metadata' },
                { step: 'Summarization', detail: 'AI-based article summarization for quick reading' },
                { step: 'Database Storage', detail: 'Cloud Firestore with category indexing and timestamp sorting' },
              ].map((item, i) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">
                      {i + 1}
                    </div>
                    {i < 4 && <div className="w-px h-8 bg-white/[0.06] my-1" />}
                  </div>
                  <div className="pb-4">
                    <h4 className="text-sm font-semibold text-white mb-0.5">{item.step}</h4>
                    <p className="text-xs text-white/35">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-3 block">
              Technology
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              <span className="gradient-text">Tech Stack</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass p-5"
              >
                <h3 className="text-sm font-semibold text-brand-300 mb-3 flex items-center gap-2">
                  <Code2 size={14} />
                  {group.category}
                </h3>
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="text-xs text-white/40 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Government Services Knowledge Base */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-3 block">
              Knowledge Base
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Government Services <span className="gradient-text">Dataset</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Manually curated, verified data for each government service.
            </p>
          </div>

          <div className="glass p-6 sm:p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Service Name', desc: 'Official name in EN, SI, TA' },
                { label: 'Description', desc: 'What the service does' },
                { label: 'Step-by-Step Process', desc: 'Ordered instructions' },
                { label: 'Required Documents', desc: 'Complete list with specifics' },
                { label: 'Fees', desc: 'Current amounts in LKR' },
                { label: 'Office Locations', desc: 'Where to apply / submit' },
                { label: 'Processing Time', desc: 'Normal and urgent timelines' },
                { label: 'Official Source', desc: 'Government website URL' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-green mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-white/70">{item.label}</div>
                    <div className="text-[10px] text-white/30">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass glow-border max-w-2xl mx-auto p-10 text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to try <span className="gradient-text">Infora</span>?
          </h2>
          <p className="text-white/40 mb-6 text-sm">
            Start chatting now — ask about news, government services, or anything in your language.
          </p>
          <Link href="/chat" className="btn-primary inline-flex items-center gap-2">
            {t.cta.startNow} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
