import Header from '../sections/Header';
import Footer from '../sections/Footer';
import AdSlot from '../sections/AdSlot';
import UrlShortener from '../sections/UrlShortener';
import QrCodeGenerator from '../sections/QrCodeGenerator';
import PasswordGenerator from '../sections/PasswordGenerator';
import CaseConverter from '../sections/CaseConverter';
import { Zap, Shield, Smartphone, Check, ArrowRight } from 'lucide-react';

export default function Home() {
  const scrollToTools = () => {
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPremium = () => {
    document.getElementById('premium')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* 1. Hero Section */}
      <section className="pt-32 pb-16 px-6 text-center" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)' }}>
        <div className="max-w-[680px] mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[var(--color-charcoal)] leading-[1.1] tracking-tight">
            All the tools you need. In one place.
          </h1>
          <p className="mt-4 text-lg text-[var(--color-slate)] leading-relaxed">
            Shorten links. Generate QR codes. Create secure passwords. Convert text. Free, fast, and forever.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button onClick={scrollToTools} className="btn-primary">
              Start Using Tools
            </button>
            <button onClick={scrollToPremium} className="btn-secondary">
              Go Premium
            </button>
          </div>

          {/* Ad Slot 1 */}
          <AdSlot
            id="ad-slot-1"
            className="mt-10 max-w-[728px] mx-auto"
            style={{ minHeight: 90 }}
          />
        </div>
      </section>

      {/* 2. Tools Grid */}
      <section id="tools" className="py-20 px-6" style={{ backgroundColor: 'var(--color-off-white)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-charcoal)]">
              Free Online Tools
            </h2>
            <p className="mt-3 text-[var(--color-slate)]">
              Simple, powerful, and completely free. No signup required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UrlShortener />
            <QrCodeGenerator />
            <PasswordGenerator />
            <CaseConverter />
          </div>
        </div>
      </section>

      {/* 3. Premium Banner */}
      <section
        id="premium"
        className="py-16 px-6"
        style={{ background: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)' }}
      >
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Go Premium
            </h2>
            <p className="mt-3 text-white/80 max-w-md">
              Remove ads, unlock bulk processing, get analytics, and priority support.
            </p>
            <ul className="mt-4 space-y-2">
              {[
                'No advertisements',
                'Bulk URL shortening',
                'QR code analytics',
                'Priority support',
                'Custom branded links',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-white/90 text-sm">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center md:text-right flex-shrink-0">
            <p className="text-5xl font-bold text-white">$9<span className="text-2xl font-normal">/month</span></p>
            <p className="mt-1 text-white/60 text-sm">Cancel anytime.</p>
            <button className="mt-5 inline-flex items-center gap-2 px-8 py-3 bg-white text-[var(--color-brand-blue)] font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-charcoal)] text-center mb-12">
            Why ToolBox Pro?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-[var(--color-brand-blue)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-charcoal)] mb-2">
                Blazing Fast
              </h3>
              <p className="text-sm text-[var(--color-slate)] leading-relaxed">
                All tools run in your browser. No servers, no waiting, no limits.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-[var(--color-brand-blue)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-charcoal)] mb-2">
                100% Private
              </h3>
              <p className="text-sm text-[var(--color-slate)] leading-relaxed">
                Your data never leaves your device. We don't store, track, or sell anything.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Smartphone className="w-7 h-7 text-[var(--color-brand-blue)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-charcoal)] mb-2">
                Works Everywhere
              </h3>
              <p className="text-sm text-[var(--color-slate)] leading-relaxed">
                Fully responsive. Use on desktop, tablet, or mobile — anywhere, anytime.
              </p>
            </div>
          </div>

          {/* Ad Slot 3 */}
          <AdSlot
            id="ad-slot-3"
            className="mt-12 max-w-[728px] mx-auto"
            style={{ minHeight: 90 }}
          />
        </div>
      </section>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}