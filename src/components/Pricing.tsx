'use client';
import { useState } from 'react';
import { Zap, Check, Loader2 } from 'lucide-react';
import { useUser } from '@/lib/supabase/useUser';
import { useRouter } from 'next/navigation';

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const { user, isPro } = useUser();
  const router = useRouter();

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (isPro) return;

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_replace_me' })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error(data.error);
        alert('Checkout failed: ' + data.error);
      }
    } catch (e) {
      console.error(e);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden" style={{ background: 'var(--qt-bg)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-4" style={{ color: 'var(--qt-text)' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg" style={{ color: 'var(--qt-text-secondary)' }}>
            Upgrade to PRO for unlimited usage, advanced analytics, and zero ads.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="text-xl font-bold font-display mb-2" style={{ color: 'var(--qt-text)' }}>Free Starter</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black">$0</span>
              <span className="text-sm font-medium" style={{ color: 'var(--qt-text-secondary)' }}>/ forever</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Access to all 25 basic tools', 'Standard processing speed', 'Community support', 'Ad-supported experience'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'var(--qt-text-secondary)' }}>
                  <Check className="w-4 h-4 text-gray-500" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--qt-text)' }}>
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-3xl relative transform md:-translate-y-4 shadow-2xl" style={{ background: 'var(--qt-bg-card)', border: '1px solid rgba(200,255,0,0.3)' }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase" style={{ background: 'var(--qt-accent)', color: 'black' }}>
              Most Popular
            </div>
            <h3 className="text-xl font-bold font-display mb-2 flex items-center gap-2" style={{ color: 'var(--qt-accent)' }}>
              <Zap className="w-5 h-5" /> Lifetime PRO
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-white">$49</span>
              <span className="text-sm font-medium" style={{ color: 'var(--qt-text-secondary)' }}>/ one-time</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Unlimited bulk tool usage', 'Premium tools & analytics', 'Priority email support', '100% Ad-free experience', 'Early access to new tools'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white">
                  <Check className="w-4 h-4" style={{ color: 'var(--qt-accent)' }} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleCheckout}
              disabled={loading || isPro}
              className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200"
              style={{ background: 'var(--qt-accent)', color: 'black' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isPro ? 'You are PRO' : 'Get Lifetime PRO'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
