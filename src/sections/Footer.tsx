import { Wrench } from 'lucide-react';

export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--color-charcoal)] text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-5 h-5 text-[var(--color-brand-blue)]" />
              <span className="text-lg font-bold text-white">ToolBox Pro</span>
            </div>
            <p className="text-sm text-[#A0AEC0]">
              Free online tools for everyone.
            </p>
          </div>
          <div className="flex flex-wrap gap-12">
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Tools</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollTo('url-shortener')}
                    className="text-sm text-[#A0AEC0] hover:text-white transition-colors"
                  >
                    URL Shortener
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo('qr-code')}
                    className="text-sm text-[#A0AEC0] hover:text-white transition-colors"
                  >
                    QR Code Generator
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo('password-generator')}
                    className="text-sm text-[#A0AEC0] hover:text-white transition-colors"
                  >
                    Password Generator
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo('case-converter')}
                    className="text-sm text-[#A0AEC0] hover:text-white transition-colors"
                  >
                    Case Converter
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-[#A0AEC0] hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-[#A0AEC0] hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-[#A0AEC0] hover:text-white transition-colors">
                    Twitter / X
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-[#A0AEC0] hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          className="mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid #4A5568' }}
        >
          <p className="text-[13px] text-[#A0AEC0]">
            &copy; 2025 ToolBox Pro. All rights reserved.
          </p>
          <p className="text-[13px] text-[#A0AEC0]">
            Made with care for the internet.
          </p>
        </div>
      </div>
    </footer>
  );
}
