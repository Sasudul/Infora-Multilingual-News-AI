'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n';

const textMap: any = {
  en: {
    desc: 'Infora is an AI platform making information accessible. We bridge language barriers to bring verified Sri Lankan news and government services to every citizen in their native language—Sinhala, Tamil, or English.',
    marketplace: 'Marketplace',
    marketplaceLinks: ['News Feed', 'Sources', 'Government Services', 'Translate'],
    info: 'Info',
    infoLinks: ['Activity', 'Verification Stats', 'Rankings'],
    company: 'Company',
    companyLinks: ['About', 'Support', 'Partners', 'Contact Us'],
    rights: 'Copyright InFora AI. All Rights Reserved.'
  },
  si: {
    desc: 'Infora යනු තොරතුරු පහසුවෙන් ලබාදෙන AI වේදිකාවකි. භාෂා බාධක ජයගනිමින්, තහවුරු කළ ශ්‍රී ලාංකික පුවත් සහ රාජ්‍ය සේවා සිංහල, දෙමළ හෝ ඉංග්‍රීසි භාෂාවෙන් සෑම පුරවැසියෙකුටම ලබා දීමට අපි කටයුතු කරන්නෙමු.',
    marketplace: 'වෙළඳපොළ',
    marketplaceLinks: ['පුවත් එකතුව', 'මූලාශ්‍ර', 'රාජ්‍ය සේවා', 'පරිවර්තනය'],
    info: 'තොරතුරු',
    infoLinks: ['ක්‍රියාකාරකම්', 'තහවුරු කිරීමේ දත්ත', 'ශ්‍රේණිගත කිරීම්'],
    company: 'ආයතනය',
    companyLinks: ['අප ගැන', 'සහාය', 'හවුල්කරුවන්', 'අප අමතන්න'],
    rights: 'ප්‍රකාශන හිමිකම InFora AI. සියලු හිමිකම් ඇවිරිණි.'
  },
  ta: {
    desc: 'Infora என்பது தகவல்களை அணுகக்கூடியதாக மாற்றும் ஒரு AI தளமாகும். சரிபார்க்கப்பட்ட இலங்கை செய்திகள் மற்றும் அரசு சேவைகளை ஒவ்வொரு குடிமகனுக்கும் அவர்களின் சொந்த மொழியான சிங்களம், தமிழ் அல்லது ஆங்கிலத்தில் கொண்டு செல்ல மொழித் தடைகளை நாங்கள் பாலமாக்குகிறோம்.',
    marketplace: 'சந்தை',
    marketplaceLinks: ['செய்தி ஓடை', 'ஆதாரங்கள்', 'அரசு சேவைகள்', 'மொழிபெயர்ப்பு'],
    info: 'தகவல்',
    infoLinks: ['செயல்பாடு', 'சரிபார்ப்பு புள்ளிவிவரங்கள்', 'தரவரிசைகள்'],
    company: 'நிறுவனம்',
    companyLinks: ['பற்றி', 'ஆதரவு', 'பங்குதாரர்கள்', 'எங்களை தொடர்பு கொள்ள'],
    rights: 'பதிப்புரிமை InFora AI. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'
  }
};

export function Footer() {
  const { lang } = useI18n();
  const txt = textMap[lang] || textMap.en;

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
              {txt.desc}
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
            <h4 className="font-display font-semibold text-white/90 mb-6 tracking-wide">{txt.marketplace}</h4>
            <ul className="space-y-4">
              {txt.marketplaceLinks.map((link: string) => (
                <li key={link}>
                  <Link href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white/90 mb-6 tracking-wide">{txt.info}</h4>
            <ul className="space-y-4">
              {txt.infoLinks.map((link: string) => (
                <li key={link}>
                  <Link href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white/90 mb-6 tracking-wide">{txt.company}</h4>
            <ul className="space-y-4">
              {txt.companyLinks.map((link: string) => (
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
          © {new Date().getFullYear()} {txt.rights}
        </p>
      </div>
    </footer>
  );
}
