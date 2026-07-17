import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  Zap, Shield, Smartphone, ArrowRight, Github,
  Menu, X, CheckCircle, ArrowUpRight, ChevronRight
} from 'lucide-react';
import { blogPosts } from '../data/blogs';
import { tools as allTools } from '../tools/toolsConfig';

/* ═══════════════════════════════════════════════════════
   MAGNETIC CUSTOM CURSOR
═══════════════════════════════════════════════════════ */
function CustomCursor() {
  // Reset SEO to home page values on mount
  useEffect(() => {
    document.title = "QuickToolbox — 25 Free Online Tools for Developers & Designers";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', "25 free browser tools: URL shortener, QR code generator, password generator, JSON formatter, regex tester, markdown preview, and more. Instant, private, no signup required.");
    }
  }, []);

  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse   = useRef({ x: -200, y: -200 });
  const ring    = useRef({ x: -200, y: -200 });
  const visible = useRef(false);
  const hovering = useRef(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return;

    document.body.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) {
        ring.current  = { x: e.clientX, y: e.clientY };
        visible.current = true;
      }
      if (dotRef.current) {
        dotRef.current.style.opacity = '1';
        dotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      }
    };

    const onEnter = () => {
      hovering.current = true;
      if (ringRef.current) ringRef.current.style.transform += ' scale(2)';
    };
    const onLeave = () => { hovering.current = false; };

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.1);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.1);
      if (ringRef.current) {
        const s = hovering.current ? 2 : 1;
        ringRef.current.style.opacity    = '1';
        ringRef.current.style.transform  = `translate(${ring.current.x}px,${ring.current.y}px) scale(${s})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button, [data-hover]')
      .forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave); });

    return () => {
      document.body.style.cursor = '';
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: -4, left: -4,
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--qt-accent)',
          zIndex: 99999, pointerEvents: 'none', opacity: 0,
          transition: 'none',
          mixBlendMode: 'difference',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: -20, left: -20,
          width: 40, height: 40, borderRadius: '50%',
          border: '1px solid rgba(200,255,0,0.5)',
          zIndex: 99998, pointerEvents: 'none', opacity: 0,
          transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s, border-color 0.3s',
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════════════════
   COUNTER
═══════════════════════════════════════════════════════ */
function CounterNum({ target, suffix = '' }: { target: number | string; suffix?: string }) {
  const [val, setVal] = useState<string | number>(typeof target === 'number' ? 0 : target);
  const ref     = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (typeof target !== 'number') return;
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const dur = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const e = 1 - Math.pow(2, -10 * p);
          setVal(Math.floor(e * (target as number)));
          if (p < 1) requestAnimationFrame(tick); else setVal(target as number);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════
   PARALLAX
═══════════════════════════════════════════════════════ */
function useParallax(speed = 0.3) {
  const [y, setY] = useState(0);
  useEffect(() => {
    let t = false;
    const fn = () => { if (!t) { requestAnimationFrame(() => { setY(window.scrollY * speed); t = false; }); t = true; } };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [speed]);
  return y;
}

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const featuredTools = allTools.slice(0, 3);

/* ═══════════════════════════════════════════════════════
   MARQUEE STRIP
═══════════════════════════════════════════════════════ */
function Marquee({ reverse = false }: { reverse?: boolean }) {
  const items = [...allTools, ...allTools];
  return (
    <div className="overflow-hidden"
      style={{ maskImage: 'linear-gradient(90deg,transparent,black 6%,black 94%,transparent)' }}>
      <div className={`marquee-track ${reverse ? 'right' : 'left'}`}>
        {items.map((t, i) => {
          const Icon = t.icon;
          return (
            <div key={i} className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
              style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--qt-accent)' }} />
              <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--qt-text-secondary)' }}>{t.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BLOG CARD — epic.net list style
═══════════════════════════════════════════════════════ */
function BlogCard({ post, index }: { post: typeof blogPosts[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={`/blog/${post.slug}`}
      data-reveal
      data-delay={String(index % 3)}
      className="group block py-7 no-underline transition-all duration-300"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        textDecoration: 'none',
        borderTop: index === 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded"
              style={{ background: 'rgba(200,255,0,0.08)', color: 'var(--qt-accent)' }}
            >
              {post.category}
            </span>
            <span className="text-xs" style={{ color: 'var(--qt-text-muted)' }}>{post.date}</span>
            <span className="text-xs" style={{ color: 'var(--qt-text-muted)' }}>·</span>
            <span className="text-xs" style={{ color: 'var(--qt-text-muted)' }}>{post.readTime}</span>
          </div>
          <h3
            className="font-display font-bold leading-tight transition-colors duration-300 mb-2"
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              color: hovered ? 'var(--qt-accent)' : 'var(--qt-text)',
              letterSpacing: '-0.02em',
            }}
          >
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--qt-text-secondary)' }}>
            {post.excerpt}
          </p>
        </div>
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-400"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            background: hovered ? 'var(--qt-accent)' : 'transparent',
            transform: hovered ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <ArrowRight className="w-4 h-4" style={{ color: hovered ? '#000' : 'var(--qt-text-muted)' }} />
        </div>
      </div>
    </a>
  );
}

/* ═══════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════ */
export default function Home() {
  const [navScrolled, setNavScrolled]     = useState(false);
  const [mobileMenuOpen, setMobile]       = useState(false);
  const parallax = useParallax(0.22);

  useScrollReveal();

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobile(false);
  };

  /* ─── RENDER ─── */
  return (
    <>
      <CustomCursor />

      <div className="min-h-screen" style={{ background: '#09090E' }}>

        {/* ──────────────────────────────────────
            NAV
        ────────────────────────────────────── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
          style={{
            background: navScrolled ? 'rgba(9,9,14,0.95)' : 'transparent',
            backdropFilter: navScrolled ? 'blur(24px)' : 'none',
            WebkitBackdropFilter: navScrolled ? 'blur(24px)' : 'none',
            borderBottom: navScrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 group" style={{ textDecoration: 'none' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--qt-accent)' }}>
                <Zap className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="text-sm font-bold font-display tracking-tight" style={{ color: 'var(--qt-text)' }}>QuickToolbox</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {['tools', 'features', 'blog', 'premium'].map(id => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="text-xs font-semibold uppercase tracking-widest transition-colors duration-200 cursor-pointer capitalize bg-transparent border-0"
                  style={{ color: 'var(--qt-text-tertiary)', letterSpacing: '0.1em' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--qt-text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--qt-text-tertiary)')}
                >
                  {id}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="qt-btn-ghost qt-btn-sm flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" />
              </a>
              <a href="/app" className="qt-btn qt-btn-sm px-5">Launch App <ArrowRight className="w-3.5 h-3.5" /></a>
            </div>

            <button className="md:hidden p-2 rounded-lg" style={{ color: 'var(--qt-text-secondary)' }}
              onClick={() => setMobile(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t px-6 py-5 space-y-2"
              style={{ background: 'rgba(9,9,14,0.98)', borderColor: 'rgba(255,255,255,0.05)' }}>
              {['tools', 'features', 'blog', 'premium'].map(id => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="w-full text-left py-3 text-sm font-medium capitalize"
                  style={{ color: 'var(--qt-text-secondary)' }}>
                  {id}
                </button>
              ))}
              <a href="/app" className="qt-btn w-full flex items-center justify-center gap-2 mt-3">
                Launch App <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </nav>

        {/* ──────────────────────────────────────
            HERO — editorial, no bloat
        ────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col pt-32 pb-24 px-6 md:px-12 overflow-hidden"
          style={{ background: '#09090E' }}>

          {/* SVG grain texture */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)" style={{ opacity: 0.12 }} />
          </svg>

          {/* Ghost background number with parallax */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            style={{ transform: `translateY(${parallax}px)` }}>
            <span className="font-display font-black" style={{
              fontSize: 'clamp(240px, 45vw, 600px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(200,255,0,0.04)',
              letterSpacing: '-0.06em',
              lineHeight: 1,
              userSelect: 'none',
            }}>
              25
            </span>
          </div>

          {/* Subtle glow orb */}
          <div className="absolute pointer-events-none" style={{
            width: '50vw', height: '50vw',
            top: '10%', left: '50%', transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(200,255,0,0.04) 0%, transparent 60%)',
          }} />

          <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="animate-fade-in mb-8" style={{ animationDelay: '0.1s' }}>
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--qt-accent)', letterSpacing: '0.15em' }}>
                Free · Private · Instant
              </span>
            </div>

            {/* Headline */}
            <div className="mb-8">
              <div className="text-reveal-wrap is-visible" style={{ transitionDelay: '0.2s' }}>
                <h1 className="text-reveal-inner font-display font-black leading-[0.88] tracking-tight block"
                  style={{ fontSize: 'clamp(4rem, 11vw, 10rem)', color: 'var(--qt-text)', letterSpacing: '-0.05em', transitionDelay: '0.25s' }}>
                  Every Tool
                </h1>
              </div>
              <div className="text-reveal-wrap is-visible" style={{ transitionDelay: '0.35s' }}>
                <h1 className="text-reveal-inner font-display font-black leading-[0.88] tracking-tight block"
                  style={{ fontSize: 'clamp(4rem, 11vw, 10rem)', color: 'var(--qt-accent)', letterSpacing: '-0.05em', transitionDelay: '0.45s' }}>
                  You'll Ever Need.
                </h1>
              </div>
            </div>

            {/* Divider + desc row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end mt-6">
              <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <div className="h-px mb-6" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <p className="text-base leading-relaxed" style={{ color: 'var(--qt-text-secondary)', maxWidth: '420px' }}>
                  25 tools running directly in your browser. No accounts. No tracking. Nothing stored. Just tools that work.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: '1s' }}>
                <a href="/app" className="qt-btn px-8 py-4">
                  <Zap className="w-4 h-4" /> Launch App
                </a>
                <button onClick={() => scrollTo('tools')}
                  className="qt-btn-secondary px-8 py-4 flex items-center gap-2">
                  Explore Tools <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stat row */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in" style={{ animationDelay: '1.1s' }}>
              {[
                { n: '25', label: 'Tools' },
                { n: '0',  label: 'Sign-ups needed' },
                { n: '100%', label: 'Browser-side' },
                { n: '∞',  label: 'Uses per day' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-black font-display mb-0.5" style={{ color: 'var(--qt-accent)' }}>{s.n}</div>
                  <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--qt-text-muted)', letterSpacing: '0.1em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-12 flex items-center gap-3 animate-fade-in" style={{ animationDelay: '1.4s' }}>
            <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, var(--qt-accent), transparent)' }} />
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--qt-text-muted)', letterSpacing: '0.15em' }}>Scroll</span>
          </div>
        </section>

        {/* ──────────────────────────────────────
            MARQUEE TICKER
        ────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="py-5 space-y-3">
          <Marquee />
          <Marquee reverse />
        </div>

        {/* ──────────────────────────────────────
            TOOLS — featured 3 + full grid
        ────────────────────────────────────── */}
        <section id="tools" className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">

            {/* Section label */}
            <div className="flex items-center justify-between mb-16">
              <div>
                <span data-reveal className="text-xs font-black uppercase tracking-widest block mb-3"
                  style={{ color: 'var(--qt-text-muted)', letterSpacing: '0.15em' }}>
                  Tool Collection
                </span>
                <div className="overflow-hidden">
                  <h2 data-reveal="clip" className="font-display font-black tracking-tight"
                    style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', color: 'var(--qt-text)', letterSpacing: '-0.04em' }}>
                    25 tools.<br />
                    <span style={{ color: 'var(--qt-accent)' }}>One place.</span>
                  </h2>
                </div>
              </div>
              <a href="/app" data-reveal="right"
                className="hidden md:flex items-center gap-2 text-sm font-semibold no-underline transition-all duration-300 group"
                style={{ color: 'var(--qt-text-secondary)', textDecoration: 'none' }}>
                View all
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: 'var(--qt-accent)' }} />
              </a>
            </div>

            {/* Featured 3 — large cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {featuredTools.map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <Link key={i} to={`/tools/${tool.id}`} data-reveal="scale" data-delay={String(i)}
                    className="group block no-underline p-8 rounded-2xl relative overflow-hidden"
                    style={{
                      background: '#111119',
                      border: '1px solid rgba(255,255,255,0.06)',
                      minHeight: '260px',
                      textDecoration: 'none',
                      transition: 'border-color 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(200,255,0,0.2)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-px"
                      style={{ background: 'linear-gradient(90deg,transparent,rgba(200,255,0,0.2),transparent)', opacity: 0 }}
                    />
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                      style={{ background: 'rgba(200,255,0,0.07)', border: '1px solid rgba(200,255,0,0.1)' }}>
                      <Icon className="w-6 h-6" style={{ color: 'var(--qt-accent)' }} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2"
                      style={{ color: 'var(--qt-text-muted)', letterSpacing: '0.15em' }}>{tool.category}</p>
                    <h3 className="text-xl font-bold font-display mb-3" style={{ color: 'var(--qt-text)', letterSpacing: '-0.02em' }}>
                      {tool.name}
                    </h3>
                    <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <ArrowUpRight className="w-3.5 h-3.5" style={{ color: 'var(--qt-text-muted)' }} />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Rest of tools — compact grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {allTools.slice(3).map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <Link key={i} to={`/tools/${tool.id}`} data-reveal="scale" data-delay={String(i % 5)}
                    className="group flex items-center gap-2.5 p-4 rounded-xl no-underline transition-all duration-300"
                    style={{
                      background: '#111119',
                      border: '1px solid rgba(255,255,255,0.05)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(200,255,0,0.2)';
                      e.currentTarget.style.background = 'rgba(200,255,0,0.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.background = '#111119';
                    }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--qt-accent)', opacity: 0.7 }} />
                    <span className="text-xs font-medium leading-snug" style={{ color: 'var(--qt-text-secondary)' }}>{tool.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-12 text-center" data-reveal>
              <a href="/app" className="qt-btn px-12 py-4 inline-flex gap-2">
                <Zap className="w-5 h-5" />Open Toolbox
              </a>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────
            STATS BAND — counter
        ────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { value: 25,  suffix: '',    label: 'Free Tools' },
              { value: 0,   suffix: '',    label: 'Required Sign-ups' },
              { value: 100, suffix: '%',   label: 'Browser-side Processing' },
              { value: '∞', suffix: '',    label: 'Daily Uses' },
            ].map((s, i) => (
              <div key={s.label} data-reveal data-delay={String(i)} className="text-center">
                <div className="font-display font-black leading-none mb-3"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--qt-accent)' }}>
                  <CounterNum target={s.value} suffix={s.suffix} />
                </div>
                <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--qt-text-muted)', letterSpacing: '0.1em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ──────────────────────────────────────
            FEATURES — epic.net editorial style
        ────────────────────────────────────── */}
        <section id="features" className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">

            <div className="mb-20">
              <span data-reveal className="text-xs font-black uppercase tracking-widest block mb-3"
                style={{ color: 'var(--qt-text-muted)', letterSpacing: '0.15em' }}>
                Why QuickToolbox
              </span>
              <div className="overflow-hidden">
                <h2 data-reveal="clip" className="font-display font-black tracking-tight"
                  style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)', color: 'var(--qt-text)', letterSpacing: '-0.04em' }}>
                  Built different.
                </h2>
              </div>
            </div>

            {[
              {
                num: '01', tag: 'Performance',
                title: 'Instant. Every single time.',
                desc: 'Every tool executes natively in your browser using Web APIs. No servers, no round trips, no delays. Results are immediate.',
                icon: Zap, color: 'var(--qt-accent)',
                facts: ['Zero server roundtrips', 'Native Web APIs only', 'Works fully offline'],
              },
              {
                num: '02', tag: 'Privacy',
                title: 'Your data stays on your device.',
                desc: "We don't log, track, or transmit anything you type. Close the tab and it's completely gone. No cookies, no accounts, no fingerprinting.",
                icon: Shield, color: 'var(--qt-success)',
                facts: ['No data collection', 'No analytics on your input', 'No third-party trackers'],
              },
              {
                num: '03', tag: 'Design',
                title: 'One toolbox. Every device.',
                desc: 'Fully responsive from 320px to 4K ultrawide. Built mobile-first. Consistent, sharp, and accessible everywhere.',
                icon: Smartphone, color: 'var(--qt-info)',
                facts: ['Mobile-first responsive', 'Touch optimised', 'Keyboard accessible'],
              },
            ].map((f, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={f.num}>
                  {/* Horizontal rule (epic.net style) */}
                  <div className="line-draw is-visible mb-0" data-reveal />

                  <div className={`py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center`}>
                    {/* Number + Tag */}
                    <div className={`md:col-span-2 ${!isEven ? 'md:order-last' : ''}`}
                      data-reveal={isEven ? 'left' : 'right'}>
                      <span className="font-display font-black" style={{ fontSize: '5rem', color: 'rgba(255,255,255,0.04)', lineHeight: 1, letterSpacing: '-0.05em' }}>{f.num}</span>
                      <p className="text-[10px] font-black uppercase tracking-widest mt-2" style={{ color: f.color, letterSpacing: '0.15em' }}>{f.tag}</p>
                    </div>

                    {/* Title + desc */}
                    <div className={`md:col-span-5 ${!isEven ? 'md:order-first' : ''}`}>
                      <div className="overflow-hidden mb-4">
                        <h3 data-reveal="clip" data-delay="1" className="font-display font-black leading-tight"
                          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: 'var(--qt-text)', letterSpacing: '-0.03em' }}>
                          {f.title}
                        </h3>
                      </div>
                      <p data-reveal data-delay="2" className="text-base leading-relaxed"
                        style={{ color: 'var(--qt-text-secondary)' }}>
                        {f.desc}
                      </p>
                    </div>

                    {/* Facts */}
                    <div className="md:col-span-5">
                      <ul className="space-y-4">
                        {f.facts.map((fact, j) => (
                          <li key={fact} data-reveal={isEven ? 'right' : 'left'} data-delay={String(j + 2)}
                            className="flex items-center gap-3 text-sm"
                            style={{ color: 'var(--qt-text-secondary)' }}>
                            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: f.color }} />
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Final rule */}
            <div className="line-draw is-visible" data-reveal />
          </div>
        </section>

        {/* ──────────────────────────────────────
            BLOG / JOURNAL — epic.net list style
        ────────────────────────────────────── */}
        <section id="blog" className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">

            <div className="flex items-end justify-between mb-16">
              <div>
                <span data-reveal className="text-xs font-black uppercase tracking-widest block mb-3"
                  style={{ color: 'var(--qt-text-muted)', letterSpacing: '0.15em' }}>
                  Journal
                </span>
                <div className="overflow-hidden">
                  <h2 data-reveal="clip" className="font-display font-black tracking-tight"
                    style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)', color: 'var(--qt-text)', letterSpacing: '-0.04em' }}>
                    Guides &amp; tips.
                  </h2>
                </div>
              </div>
              <a href="/blog" data-reveal="right"
                className="hidden md:flex items-center gap-2 text-sm font-semibold no-underline group"
                style={{ color: 'var(--qt-text-secondary)', textDecoration: 'none' }}>
                All articles
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: 'var(--qt-accent)' }} />
              </a>
            </div>

            {/* Blog list — epic.net bordered list style */}
            <div>
              {blogPosts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>

            {/* Structured data for SEO */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: blogPosts.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://quicktoolbox.app/blog/${p.slug}`,
                name: p.title,
              })),
            }) }} />
          </div>
        </section>

        {/* ──────────────────────────────────────
            PREMIUM — dropbox block style
        ────────────────────────────────────── */}
        <section id="premium" className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-3xl overflow-hidden relative"
              style={{ background: 'var(--qt-accent)' }}>

              {/* Grain on the lime card */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply" style={{ opacity: 0.15 }}>
                <filter id="grain2">
                  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#grain2)" />
              </svg>

              {/* Big ghost text */}
              <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none pr-12">
                <span className="font-display font-black" style={{
                  fontSize: 'clamp(120px,20vw,250px)',
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(0,0,0,0.08)',
                  letterSpacing: '-0.06em',
                  lineHeight: 1,
                }}>Pro</span>
              </div>

              <div className="relative z-10 p-12 md:p-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest block mb-4"
                      style={{ color: 'rgba(0,0,0,0.5)', letterSpacing: '0.15em' }}>Premium Plan</span>
                    <div className="overflow-hidden mb-6">
                      <h2 data-reveal="clip" className="font-display font-black leading-tight tracking-tight"
                        style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', color: '#000', letterSpacing: '-0.04em' }}>
                        Go further.
                      </h2>
                    </div>
                    <p data-reveal data-delay="1" className="text-base leading-relaxed mb-10"
                      style={{ color: 'rgba(0,0,0,0.6)' }}>
                      Remove all ads, unlock bulk processing, analytics, custom short links, and REST API access. Cancel anytime.
                    </p>
                    <div data-reveal data-delay="2">
                      <a href="/premium"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm"
                        style={{ background: '#000', color: 'var(--qt-accent)', textDecoration: 'none' }}>
                        Upgrade to Premium <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div data-reveal="right" data-delay="2">
                    <div className="rounded-2xl p-8" style={{ background: 'rgba(0,0,0,0.08)' }}>
                      <div className="mb-6">
                        <span className="font-display font-black" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: '#000', letterSpacing: '-0.04em' }}>$9</span>
                        <span className="text-sm font-medium ml-2" style={{ color: 'rgba(0,0,0,0.5)' }}>/month</span>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'No advertisements — ever',
                          'Bulk URL shortening & QR codes',
                          'QR scan analytics dashboard',
                          'Custom branded short links',
                          'REST API access',
                          'Priority support (< 2h)',
                        ].map(feat => (
                          <li key={feat} className="flex items-center gap-2.5 text-sm font-medium" style={{ color: 'rgba(0,0,0,0.7)' }}>
                            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#000' }} />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────
            FOOTER — editorial
        ────────────────────────────────────── */}
        <footer className="px-6 md:px-12 pb-16" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="max-w-7xl mx-auto pt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div data-reveal="left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--qt-accent)' }}>
                  <Zap className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="font-display font-bold text-sm" style={{ color: 'var(--qt-text)' }}>QuickToolbox</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--qt-text-muted)', maxWidth: '260px' }}>
                Free online tools for developers, designers, and writers. Private, instant, forever free.
              </p>
            </div>

            {/* Nav links */}
            <div data-reveal className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--qt-text-muted)', letterSpacing: '0.15em' }}>Tools</p>
                {['URL Shortener', 'QR Generator', 'Password Gen', 'JSON Formatter'].map(t => (
                  <a key={t} href="/app" className="block text-xs py-1.5 transition-colors no-underline"
                    style={{ color: 'var(--qt-text-tertiary)', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--qt-text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--qt-text-tertiary)')}>
                    {t}
                  </a>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--qt-text-muted)', letterSpacing: '0.15em' }}>Company</p>
                {['Privacy', 'Terms', 'Blog', 'GitHub'].map(l => (
                  <a key={l} href="#" className="block text-xs py-1.5 transition-colors no-underline"
                    style={{ color: 'var(--qt-text-tertiary)', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--qt-text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--qt-text-tertiary)')}>
                    {l}
                  </a>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div data-reveal="right" className="flex flex-col justify-between">
              <div />
              <div>
                <p className="text-xs mb-4" style={{ color: 'var(--qt-text-muted)' }}>Ready to start?</p>
                <a href="/app" className="qt-btn inline-flex gap-2">
                  Launch App <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-16 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs" style={{ color: 'var(--qt-text-muted)' }}>© 2025 QuickToolbox. All rights reserved.</p>
            <p className="text-xs" style={{ color: 'var(--qt-text-muted)' }}>Made with precision. Runs in your browser.</p>
          </div>
        </footer>

        {/* JSON-LD: WebSite schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'QuickToolbox',
          url: 'https://quicktoolbox.app',
          description: '25 free online tools — URL shortener, QR code generator, password generator, JSON formatter, and more. All private, browser-side, no signup.',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://quicktoolbox.app/app?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }) }} />

      </div>
    </>
  );
}