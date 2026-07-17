import {
  Link2, QrCode, Lock, Type, FileText, Dices,
  Code, Fingerprint, Clock, Hash, Percent, Calculator,
  Calendar, Weight, Palette, Image, Sparkles, SlidersHorizontal,
  FileJson, Crosshair, ShieldCheck, FileCode, Globe, Timer, Terminal
} from 'lucide-react';
import { lazy } from 'react';

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  component: React.LazyExoticComponent<React.ComponentType>;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: React.ElementType;
}

export const categories: ToolCategory[] = [
  { id: 'web',         name: 'Web Tools',      icon: Link2 },
  { id: 'text',        name: 'Text & Writing',  icon: FileText },
  { id: 'developer',   name: 'Developer',       icon: Code },
  { id: 'security',    name: 'Security',        icon: ShieldCheck },
  { id: 'calculators', name: 'Calculators',     icon: Calculator },
  { id: 'utilities',   name: 'Utilities',       icon: SlidersHorizontal },
];

export const tools: ToolConfig[] = [
  // ── Web Tools ────────────────────────────────────────────
  {
    id: 'url-shortener',
    name: 'URL Shortener',
    description: 'Paste a long URL and get a clean, shareable short link instantly.',
    icon: Link2,
    category: 'web',
    component: lazy(() => import('./UrlShortener')),
  },
  {
    id: 'qr-code',
    name: 'QR Code Generator',
    description: 'Enter any text or URL to generate a scannable QR code with download.',
    icon: QrCode,
    category: 'web',
    component: lazy(() => import('./QrCodeGenerator')),
  },
  {
    id: 'ip-info',
    name: 'IP Info Lookup',
    description: 'Look up geolocation, ISP, and network info for any IP address.',
    icon: Globe,
    category: 'web',
    component: lazy(() => import('./IpInfoLookup')),
  },

  // ── Text & Writing ────────────────────────────────────────
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Transform text between uppercase, lowercase, title case, camelCase, and snake_case.',
    icon: Type,
    category: 'text',
    component: lazy(() => import('./CaseConverter')),
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, paragraphs, and estimate reading time.',
    icon: FileText,
    category: 'text',
    component: lazy(() => import('./WordCounter')),
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your designs and prototypes.',
    icon: Sparkles,
    category: 'text',
    component: lazy(() => import('./LoremIpsum')),
  },
  {
    id: 'text-slug',
    name: 'Text to Slug',
    description: 'Convert any text into a clean, URL-friendly slug format.',
    icon: Hash,
    category: 'text',
    component: lazy(() => import('./TextToSlug')),
  },
  {
    id: 'base64',
    name: 'Base64 Encode/Decode',
    description: 'Encode text to Base64 or decode Base64 back to readable text.',
    icon: Code,
    category: 'text',
    component: lazy(() => import('./Base64Tool')),
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Write Markdown and see a live rendered HTML preview side by side.',
    icon: FileCode,
    category: 'text',
    component: lazy(() => import('./MarkdownPreview')),
  },

  // ── Developer ────────────────────────────────────────────
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Beautify, minify, and validate JSON data with syntax highlighting.',
    icon: FileJson,
    category: 'developer',
    component: lazy(() => import('./JsonFormatter')),
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUID v4 identifiers for your applications.',
    icon: Fingerprint,
    category: 'developer',
    component: lazy(() => import('./UuidGenerator')),
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates.',
    icon: Clock,
    category: 'developer',
    component: lazy(() => import('./TimestampConverter')),
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text.',
    icon: Hash,
    category: 'developer',
    component: lazy(() => import('./HashGenerator')),
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions against strings with real-time match highlighting.',
    icon: Terminal,
    category: 'developer',
    component: lazy(() => import('./RegexTester')),
  },

  // ── Security ────────────────────────────────────────────
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Create strong, secure passwords with custom length and character options.',
    icon: Lock,
    category: 'security',
    component: lazy(() => import('./PasswordGenerator')),
  },

  // ── Calculators ──────────────────────────────────────────
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages, percentage change, and what-percent-of questions.',
    icon: Percent,
    category: 'calculators',
    component: lazy(() => import('./PercentageCalculator')),
  },
  {
    id: 'random-number',
    name: 'Random Number Generator',
    description: 'Generate random integers or floats within your specified range.',
    icon: Dices,
    category: 'calculators',
    component: lazy(() => import('./RandomNumber')),
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate exact age in years, months, and days from a birthdate.',
    icon: Calendar,
    category: 'calculators',
    component: lazy(() => import('./AgeCalculator')),
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate Body Mass Index with health category interpretation.',
    icon: Weight,
    category: 'calculators',
    component: lazy(() => import('./BmiCalculator')),
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between length, weight, temperature, and digital storage units.',
    icon: Crosshair,
    category: 'calculators',
    component: lazy(() => import('./UnitConverter')),
  },

  // ── Utilities ────────────────────────────────────────────
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, and HSL color formats with live preview.',
    icon: Palette,
    category: 'utilities',
    component: lazy(() => import('./ColorConverter')),
  },
  {
    id: 'image-to-base64',
    name: 'Image to Base64',
    description: 'Convert any image file to a Base64 data URL right in your browser.',
    icon: Image,
    category: 'utilities',
    component: lazy(() => import('./ImageToBase64')),
  },
  {
    id: 'css-gradient',
    name: 'CSS Gradient Generator',
    description: 'Build beautiful CSS gradients visually and copy the code instantly.',
    icon: Palette,
    category: 'utilities',
    component: lazy(() => import('./CssGradientGenerator')),
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    description: 'Stay focused with customizable Pomodoro work and break intervals.',
    icon: Timer,
    category: 'utilities',
    component: lazy(() => import('./PomodoroTimer')),
  },
];