export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  keywords: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-generate-qr-code-free-online',
    title: 'How to Generate a QR Code for Free Online (2025 Guide)',
    excerpt:
      'QR codes are everywhere — on menus, business cards, billboards, and product packaging. Learn how to create a scannable QR code for any URL, text, or contact info in seconds, completely free and without signing up.',
    category: 'Tutorial',
    date: 'Jul 15, 2025',
    readTime: '4 min read',
    keywords: ['qr code generator', 'free qr code', 'create qr code online'],
  },
  {
    slug: 'strong-password-generator-guide',
    title: 'How to Create an Uncrackable Password (And Never Forget It)',
    excerpt:
      'Most passwords get cracked in under a second. We break down the anatomy of a truly secure password, what length and character mix actually matters, and how to generate one instantly — with zero risk your data ever leaves your browser.',
    category: 'Security',
    date: 'Jul 10, 2025',
    readTime: '5 min read',
    keywords: ['strong password generator', 'secure password', 'password strength'],
  },
  {
    slug: 'url-shortener-how-it-works',
    title: 'URL Shorteners Explained: How They Work and Why You Need One',
    excerpt:
      'Long URLs break in emails, look terrible in print, and make sharing awkward. This guide explains the technology behind URL shorteners, the difference between free and paid services, and how to shorten a link in one click.',
    category: 'Web Tools',
    date: 'Jul 5, 2025',
    readTime: '4 min read',
    keywords: ['url shortener', 'shorten link free', 'custom short url'],
  },
  {
    slug: 'json-formatter-online-guide',
    title: 'JSON Formatter Online: Beautify, Validate, and Debug JSON Instantly',
    excerpt:
      'Minified JSON is nearly impossible to read. A good JSON formatter expands it into a readable structure, highlights syntax errors, and lets you validate the schema. Here\'s when and why to use one in your development workflow.',
    category: 'Developer',
    date: 'Jun 28, 2025',
    readTime: '3 min read',
    keywords: ['json formatter', 'json validator online', 'format json free'],
  },
  {
    slug: 'markdown-preview-online-complete-guide',
    title: 'Markdown Cheat Sheet: Complete Syntax Reference for 2025',
    excerpt:
      'Markdown is the lingua franca of developer docs, READMEs, and content writing. This complete reference covers every syntax element — headers, bold, code blocks, tables, links — with live examples you can test right in your browser.',
    category: 'Writing',
    date: 'Jun 20, 2025',
    readTime: '7 min read',
    keywords: ['markdown cheat sheet', 'markdown preview online', 'markdown syntax guide'],
  },
  {
    slug: 'regex-tester-online-beginners-guide',
    title: 'Regex for Beginners: Write, Test, and Understand Regular Expressions',
    excerpt:
      'Regular expressions look intimidating — a soup of symbols that somehow matches text patterns. This beginner-friendly guide demystifies regex with practical examples: email validation, phone numbers, URL extraction, and more.',
    category: 'Developer',
    date: 'Jun 12, 2025',
    readTime: '6 min read',
    keywords: ['regex tester online', 'regular expression tutorial', 'regex for beginners'],
  },
];
