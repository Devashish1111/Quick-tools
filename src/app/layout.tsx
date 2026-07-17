import type { Metadata } from 'next';
import { Outfit, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import './App.css';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'] 
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'] 
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'] 
});

export const metadata: Metadata = {
  title: 'QuickToolbox — 25 Free Online Tools for Developers & Designers',
  description: '25 free browser tools: URL shortener, QR code generator, password generator, JSON formatter, regex tester, markdown preview, and more. Instant, private, no signup required.',
  keywords: 'free online tools, URL shortener, QR code generator, password generator, JSON formatter, regex tester, markdown preview, base64 encoder, UUID generator, hash generator, CSS gradient generator, color converter, pomodoro timer, IP lookup, word counter',
  authors: [{ name: 'QuickToolbox' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://quicktoolbox.app/',
  },
  openGraph: {
    type: 'website',
    url: 'https://quicktoolbox.app/',
    title: 'QuickToolbox — 25 Free Online Tools',
    description: 'URL shortener, QR codes, passwords, JSON formatter, regex tester, markdown preview & 19 more tools. All free. No signup. Private.',
    siteName: 'QuickToolbox',
    images: [{
      url: 'https://quicktoolbox.app/og-image.png',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@quicktoolbox',
    title: 'QuickToolbox — 25 Free Online Tools',
    description: 'URL shortener, QR codes, passwords, JSON formatter, regex tester & more. Private, instant, free.',
    images: ['https://quicktoolbox.app/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
