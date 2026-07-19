import type { Metadata, Viewport } from 'next';
import { Outfit, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import './App.css';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'] 
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'] 
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'] 
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0F',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://kwiktoolbox.com'),
  title: 'KwikToolbox — 25 Free Online Tools for Developers & Designers',
  description: '25 free browser tools: URL shortener, QR code generator, password generator, JSON formatter, regex tester, markdown preview, and more. Instant, private, no signup required.',
  keywords: 'free online tools, URL shortener, QR code generator, password generator, JSON formatter, regex tester, markdown preview, base64 encoder, UUID generator, hash generator, CSS gradient generator, color converter, pomodoro timer, IP lookup, word counter',
  authors: [{ name: 'KwikToolbox' }],
  robots: 'index, follow',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'KwikToolbox — 25 Free Online Tools',
    description: 'URL shortener, QR codes, passwords, JSON formatter, regex tester, markdown preview & 19 more tools. All free. No signup. Private.',
    siteName: 'KwikToolbox',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@kwiktoolbox',
    title: 'KwikToolbox — 25 Free Online Tools',
    description: 'URL shortener, QR codes, passwords, JSON formatter, regex tester & more. Private, instant, free.',
  },
};

// JSON-LD Structured Data for the website
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  'name': 'KwikToolbox',
  'url': 'https://kwiktoolbox.com',
  'description': '25 free browser tools: URL shortener, QR code generator, password generator, JSON formatter, and more. Instant, private, no signup.',
  'applicationCategory': 'UtilitiesApplication',
  'operatingSystem': 'Web',
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD',
  },
  'author': {
    '@type': 'Organization',
    'name': 'KwikToolbox',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
