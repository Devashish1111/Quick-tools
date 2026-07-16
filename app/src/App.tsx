import { useState, Suspense, lazy } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { tools } from './tools/toolsConfig';
import AdSlot from './sections/AdSlot';

// Lazy load all tool components for better performance
const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {};
tools.forEach(tool => {
  toolComponents[tool.id] = lazy(() => import(`./tools/${tool.name.replace(/\s+/g, '')}.tsx`).catch(() => import(`./tools/${tool.id.split('-').map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('')}.tsx`)));
});

// Direct imports for reliability
import UrlShortener from './tools/UrlShortener';
import QrCodeGenerator from './tools/QrCodeGenerator';
import PasswordGenerator from './tools/PasswordGenerator';
import CaseConverter from './tools/CaseConverter';
import WordCounter from './tools/WordCounter';
import LoremIpsum from './tools/LoremIpsum';
import TextToSlug from './tools/TextToSlug';
import Base64Tool from './tools/Base64Tool';
import JsonFormatter from './tools/JsonFormatter';
import UuidGenerator from './tools/UuidGenerator';
import TimestampConverter from './tools/TimestampConverter';
import HashGenerator from './tools/HashGenerator';
import PercentageCalculator from './tools/PercentageCalculator';
import RandomNumber from './tools/RandomNumber';
import AgeCalculator from './tools/AgeCalculator';
import BmiCalculator from './tools/BmiCalculator';
import UnitConverter from './tools/UnitConverter';
import ColorConverter from './tools/ColorConverter';
import ImageToBase64 from './tools/ImageToBase64';

const directComponents: Record<string, React.ComponentType> = {
  'url-shortener': UrlShortener,
  'qr-code': QrCodeGenerator,
  'password-generator': PasswordGenerator,
  'case-converter': CaseConverter,
  'word-counter': WordCounter,
  'lorem-ipsum': LoremIpsum,
  'text-slug': TextToSlug,
  'base64': Base64Tool,
  'json-formatter': JsonFormatter,
  'uuid-generator': UuidGenerator,
  'timestamp-converter': TimestampConverter,
  'hash-generator': HashGenerator,
  'percentage-calculator': PercentageCalculator,
  'random-number': RandomNumber,
  'age-calculator': AgeCalculator,
  'bmi-calculator': BmiCalculator,
  'unit-converter': UnitConverter,
  'color-converter': ColorConverter,
  'image-to-base64': ImageToBase64,
};

export default function App() {
  const [activeToolId, setActiveToolId] = useState('url-shortener');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTool = tools.find(t => t.id === activeToolId) || tools[0];
  const ActiveComponent = directComponents[activeToolId];

  return (
    <div className="flex h-screen" style={{ background: 'var(--qt-bg)' }}>
      <Sidebar activeTool={activeToolId} onSelectTool={setActiveToolId} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-5 h-16 flex-shrink-0" style={{ borderBottom: '1px solid var(--qt-border)', background: 'white' }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Menu className="w-5 h-5" style={{ color: 'var(--qt-text-secondary)' }} />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <activeTool.icon className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--qt-brand)' }} />
            <div className="min-w-0">
              <h1 className="text-base font-semibold truncate" style={{ color: 'var(--qt-text)' }}>{activeTool.name}</h1>
              <p className="text-xs truncate hidden sm:block" style={{ color: 'var(--qt-text-secondary)' }}>{activeTool.description}</p>
            </div>
          </div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-lg border hover:bg-slate-50 transition-colors hidden sm:inline-flex" style={{ borderColor: 'var(--qt-border)', color: 'var(--qt-text-secondary)' }}>Star on GitHub</a>
        </header>

        {/* Tool content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-5 py-8">
            {/* Tool header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--qt-text)' }}>{activeTool.name}</h2>
              <p className="text-sm" style={{ color: 'var(--qt-text-secondary)' }}>{activeTool.description}</p>
            </div>

            {/* Ad slot above tool */}
            <AdSlot id="ad-slot-top" className="mb-6" />

            {/* Tool component */}
            <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
              {ActiveComponent && <ActiveComponent />}
            </Suspense>

            {/* Ad slot below tool */}
            <AdSlot id="ad-slot-bottom" className="mt-8" />

            {/* Footer */}
            <footer className="mt-12 pt-6 text-center" style={{ borderTop: '1px solid var(--qt-border)' }}>
              <p className="text-xs" style={{ color: 'var(--qt-text-tertiary)' }}>
                QuickToolbox.app — Free online tools for everyone. No signup. No tracking. 100% private.
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--qt-text-tertiary)' }}>
                &copy; 2025 QuickToolbox. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}