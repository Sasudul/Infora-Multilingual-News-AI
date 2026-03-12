'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Marketplace', href: '/news' },
    { label: 'Info', href: '/services' },
    { label: 'Company', href: '/about' },
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

        {/* Buttons */}
        <div className="hidden md:flex items-center gap-4">
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
