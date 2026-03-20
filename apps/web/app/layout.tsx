import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { I18nProvider } from '@/i18n';
import { AuthProvider } from '@/lib/auth';
import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

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
  title: 'Infora ',
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
        <AuthProvider>
          <I18nProvider>
            <div className="noise-overlay" />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
