import { useState, Suspense, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Menu, Zap, Github } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { tools } from './tools/toolsConfig';

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
import MarkdownPreview from './tools/MarkdownPreview';
import CssGradientGenerator from './tools/CssGradientGenerator';
import RegexTester from './tools/RegexTester';
import IpInfoLookup from './tools/IpInfoLookup';
import PomodoroTimer from './tools/PomodoroTimer';

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
  'markdown-preview': MarkdownPreview,
  'css-gradient': CssGradientGenerator,
  'regex-tester': RegexTester,
  'ip-info': IpInfoLookup,
  'pomodoro': PomodoroTimer,
};

export default function App() {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTool = tools.find(t => t.id === toolId) || tools[0];
  const activeToolId = activeTool.id;

  // Dynamic SEO for active tool
  useEffect(() => {
    document.title = `${activeTool.name} — QuickToolbox Free Online Tool`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', activeTool.description);
    }
  }, [activeTool]);

  // Redirect if URL has invalid tool ID
  useEffect(() => {
    if (toolId !== activeToolId) {
      navigate(`/tools/${activeToolId}`, { replace: true });
    }
  }, [toolId, activeToolId, navigate]);

  const handleSelectTool = (id: string) => {
    navigate(`/tools/${id}`);
    setSidebarOpen(false);
  };

  const ActiveComponent = directComponents[activeToolId];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--qt-bg)' }}>
      <Sidebar
        activeTool={activeToolId}
        onSelectTool={handleSelectTool}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ marginLeft: '0', transition: 'margin 0.3s ease' }}>
        {/* Top bar */}
        <header
          className="flex items-center gap-3 px-5 h-16 flex-shrink-0"
          style={{
            background: 'rgba(10,10,15,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl transition-all duration-200"
            style={{ color: 'var(--qt-text-secondary)' }}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop logo (hidden on mobile — sidebar has it) */}
          <a href="/" className="hidden lg:flex items-center gap-2.5 mr-4 group" style={{ textDecoration: 'none' }}>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'var(--qt-accent)' }}
            >
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-bold font-display" style={{ color: 'var(--qt-text)' }}>
              QuickToolbox
            </span>
          </a>

          {/* Divider */}
          <div className="hidden lg:block w-px h-5" style={{ background: 'rgba(255,255,255,0.1)' }} />

          {/* Active tool info */}
          <div className="flex items-center gap-3 flex-1 min-w-0 ml-1">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(200,255,0,0.12)', border: '1px solid rgba(200,255,0,0.2)' }}
            >
              <activeTool.icon className="w-3.5 h-3.5" style={{ color: 'var(--qt-accent)' }} />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold truncate font-display" style={{ color: 'var(--qt-text)' }}>
                {activeTool.name}
              </h1>
              <p className="text-xs truncate hidden sm:block" style={{ color: 'var(--qt-text-tertiary)' }}>
                {activeTool.description}
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="qt-btn-ghost qt-btn-sm hidden sm:inline-flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="text-xs">GitHub</span>
            </a>
            <div
              className="qt-badge hidden md:inline-flex"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              25 Tools
            </div>
          </div>
        </header>

        {/* Tool content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-5 py-8 lg:px-8">

            {/* Tool header */}
            <div className="mb-8 animate-fade-up">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(200,255,0,0.1)', border: '1px solid rgba(200,255,0,0.2)' }}
                >
                  <activeTool.icon className="w-5 h-5" style={{ color: 'var(--qt-accent)' }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display" style={{ color: 'var(--qt-text)' }}>
                    {activeTool.name}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--qt-text-secondary)' }}>
                    {activeTool.description}
                  </p>
                </div>
              </div>
              <div className="qt-divider" />
            </div>

            {/* Tool component */}
            <div className="animate-fade-up-delay-1">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-24">
                    <div className="qt-spinner" />
                  </div>
                }
              >
                {ActiveComponent && <ActiveComponent />}
              </Suspense>
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-8 text-center animate-fade-up-delay-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'var(--qt-accent)' }}>
                  <Zap className="w-3 h-3 text-black" />
                </div>
                <span className="text-xs font-semibold font-display" style={{ color: 'var(--qt-text-secondary)' }}>QuickToolbox</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--qt-text-muted)' }}>
                Free online tools. No signup. No tracking. 100% private.
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--qt-text-muted)' }}>
                © 2025 QuickToolbox. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}