import { useState, useEffect } from 'react';
import { Wrench } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
          : 'bg-white'
      }`}
      style={{ borderBottom: '1px solid var(--color-light-gray)' }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[var(--color-brand-blue)]" />
          <span className="text-lg font-bold text-[var(--color-charcoal)]">
            ToolBox Pro
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo('tools')}
            className="text-sm font-medium text-[var(--color-slate)] hover:text-[var(--color-charcoal)] transition-colors"
          >
            Tools
          </button>
          <button
            onClick={() => scrollTo('premium')}
            className="text-sm font-medium text-[var(--color-slate)] hover:text-[var(--color-charcoal)] transition-colors"
          >
            Premium
          </button>
          <button
            onClick={() => scrollTo('features')}
            className="text-sm font-medium text-[var(--color-slate)] hover:text-[var(--color-charcoal)] transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollTo('premium')}
            className="btn-primary !py-2 !px-5"
          >
            Go Premium
          </button>
        </nav>
      </div>
    </header>
  );
}