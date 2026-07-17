import { blogPosts } from '@/data/blogs';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return {};
  
  return {
    title: `${post.title} — QuickToolbox Blog`,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-[100dvh]" style={{ background: 'var(--qt-bg)' }}>
      {/* Editorial Header */}
      <header className="relative pt-32 pb-16 px-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium mb-12 hover:opacity-75 transition-opacity" style={{ color: 'var(--qt-text-secondary)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded" style={{ background: 'rgba(200,255,0,0.08)', color: 'var(--qt-accent)' }}>
              {post.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight tracking-tight mb-8" style={{ color: 'var(--qt-text)' }}>
            {post.title}
          </h1>
          
          <p className="text-xl leading-relaxed mb-8" style={{ color: 'var(--qt-text-secondary)' }}>
            {post.excerpt}
          </p>

          <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--qt-text-muted)' }}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <main className="px-6 py-20">
        <article className="max-w-3xl mx-auto prose prose-invert prose-lg" 
          style={{ 
            '--tw-prose-body': 'var(--qt-text-secondary)',
            '--tw-prose-headings': 'var(--qt-text)',
            '--tw-prose-links': 'var(--qt-accent)',
            '--tw-prose-bold': 'var(--qt-text)',
          } as React.CSSProperties}
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </main>

      {/* Footer CTA */}
      <footer className="py-20 px-6 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#111119' }}>
        <h3 className="text-2xl font-display font-bold mb-4" style={{ color: 'var(--qt-text)' }}>Need a reliable tool?</h3>
        <p className="mb-8" style={{ color: 'var(--qt-text-secondary)' }}>Explore 25 free, privacy-first tools running entirely in your browser.</p>
        <Link href="/app" className="qt-btn px-10 py-4">Explore Tools</Link>
      </footer>
    </div>
  );
}
