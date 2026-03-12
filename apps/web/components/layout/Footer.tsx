'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#0A0D14] pt-20 border-t border-white/5">
      <div className="section-container pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="font-display font-bold text-2xl tracking-wide text-white">
                InFora <span className="text-white/70 font-medium text-lg ml-1">AI</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm mb-8">
              Infora is an AI platform making information accessible. We bridge language barriers to bring verified Sri Lankan news and government services to every citizen in their native language—Sinhala, Tamil, or English.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((network) => (
                <a 
                  key={network}
                  href="#" 
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                  aria-label={network}
                >
                  <span className="text-white/40 text-[10px] uppercase font-bold">{network[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display font-semibold text-white/90 mb-6 tracking-wide">Marketplace</h4>
            <ul className="space-y-4">
              {['News Feed', 'Sources', 'Government Services', 'Translate'].map(link => (
                <li key={link}>
                  <Link href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white/90 mb-6 tracking-wide">Info</h4>
            <ul className="space-y-4">
              {['Activity', 'Verification Stats', 'Rankings'].map(link => (
                <li key={link}>
                  <Link href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white/90 mb-6 tracking-wide">Company</h4>
            <ul className="space-y-4">
              {['About', 'Support', 'Partners', 'Contact Us'].map(link => (
                <li key={link}>
                  <Link href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-white/5 py-8">
        <p className="text-center text-xs text-white/30 tracking-wide">
          © {new Date().getFullYear()} Copyright InFora AI. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
