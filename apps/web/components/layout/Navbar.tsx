'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n, type LangCode } from '@/i18n';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useI18n();

  const links = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.news, href: '/news' },
    { label: t.nav.services, href: '/services' },
    { label: t.nav.chat, href: '/chat' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0D14]/80 backdrop-blur-md border-b border-white/[0.04]">
      <div className="section-container flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display font-bold text-xl tracking-wide">
            InFora <span className="text-white/70 font-medium text-sm ml-1">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm tracking-wide transition-colors ${
                pathname === link.href ? 'text-white font-medium' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Buttons and Language Switcher */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Language Switcher */}
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <Globe className="w-3.5 h-3.5 text-white/50" />
            <button 
              onClick={() => setLang('en')} 
              className={`text-xs font-medium transition-colors ${lang === 'en' ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
            >
              Eng
            </button>
            <span className="text-white/20 text-xs">/</span>
            <button 
              onClick={() => setLang('si')} 
              className={`text-xs font-medium transition-colors ${lang === 'si' ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
            >
              Sin
            </button>
            <span className="text-white/20 text-xs">/</span>
            <button 
              onClick={() => setLang('ta')} 
              className={`text-xs font-medium transition-colors ${lang === 'ta' ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
            >
              Tamil
            </button>
          </div>

          <Link
            href="/login"
            className="px-6 py-2 rounded-full text-sm font-medium text-brand-200 bg-brand-400/10 border border-brand-400/20 hover:bg-brand-400/20 transition-all"
          >
            Log In
          </Link>
          <Link
            href="/chat"
            className="px-6 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/5 transition-all text-white/90"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white/70 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#0A0D14] border-t border-white/5 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-white/70 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Language Switcher */}
              <div className="flex items-center justify-center gap-4 py-3 mt-2 bg-white/5 rounded-lg border border-white/5">
                <button onClick={() => { setLang('en'); setIsOpen(false); }} className={`text-sm font-medium ${lang === 'en' ? 'text-white' : 'text-white/50'}`}>Eng</button>
                <span className="text-white/20">|</span>
                <button onClick={() => { setLang('si'); setIsOpen(false); }} className={`text-sm font-medium ${lang === 'si' ? 'text-white' : 'text-white/50'}`}>Sin</button>
                <span className="text-white/20">|</span>
                <button onClick={() => { setLang('ta'); setIsOpen(false); }} className={`text-sm font-medium ${lang === 'ta' ? 'text-white' : 'text-white/50'}`}>Tamil</button>
              </div>

              <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-white/5">
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 rounded-lg bg-brand-400/10 text-brand-200 border border-brand-400/20"
                >
                  Log In
                </Link>
                <Link
                  href="/chat"
                  className="w-full text-center py-2.5 rounded-lg border border-white/20 text-white/90"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
