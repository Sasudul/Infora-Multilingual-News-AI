'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n, type LangCode } from '@/i18n';
import { useAuth } from '@/lib/auth';
import { LogOut, User } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useI18n();
  const { user, dbUser, loading, signOut } = useAuth();

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

          {!loading && user ? (
            <div className="flex items-center gap-4 ml-2">
              <Link href="/profile" className="flex items-center gap-2 pr-4 border-r border-white/10 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 overflow-hidden flex items-center justify-center">
                  {dbUser?.profileImageUrl || user?.photoURL ? (
                    <img src={dbUser?.profileImageUrl || user?.photoURL || ''} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={14} className="text-brand-300" />
                  )}
                </div>
                <span className="text-sm font-medium text-white/90">
                  {dbUser?.name || user.displayName || user.email?.split('@')[0]}
                </span>
              </Link>
              <button
                onClick={signOut}
                className="text-white/50 hover:text-rose-400 transition-colors"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : !loading && !user ? (
            <>
              <Link
                href="/login"
                className="px-6 py-2 rounded-full text-sm font-medium text-brand-200 bg-brand-400/10 border border-brand-400/20 hover:bg-brand-400/20 transition-all"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/5 transition-all text-white/90"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="w-24 h-8 animate-pulse bg-white/5 rounded-full" />
          )}
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
                {!loading && user ? (
                  <>
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-2 py-2 mb-2 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30 overflow-hidden">
                        {dbUser?.profileImageUrl || user?.photoURL ? (
                          <img src={dbUser?.profileImageUrl || user?.photoURL || ''} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User size={18} className="text-brand-300" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{dbUser?.name || user.displayName || 'User'}</span>
                        <span className="text-xs text-white/40">{user.email}</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => { signOut(); setIsOpen(false); }}
                      className="w-full text-center py-2.5 rounded-lg flex items-center justify-center gap-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </>
                ) : !loading && !user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2.5 rounded-lg bg-brand-400/10 text-brand-200 border border-brand-400/20"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2.5 rounded-lg border border-white/20 text-white/90"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
