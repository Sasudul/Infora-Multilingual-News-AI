import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { I18nProvider } from '@/i18n';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Infora — Multilingual AI for Sri Lanka',
  description:
    'Your intelligent assistant for Sri Lankan news retrieval, government service guidance, and multilingual conversations in Sinhala, Tamil, and English.',
  keywords: [
    'Infora',
    'Sri Lanka AI',
    'multilingual chatbot',
    'news retrieval',
    'government services',
    'Sinhala',
    'Tamil',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col">
        <I18nProvider>
          <div className="noise-overlay" />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
