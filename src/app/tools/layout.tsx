'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Zap, Github, LogOut, User as UserIcon } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { tools } from '@/tools/toolsConfig';
import Link from 'next/link';
import { useUser } from '@/lib/supabase/useUser';
import { createClient } from '@/lib/supabase/client';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isPro, loading } = useUser();

  // Extract toolId from pathname (e.g. /tools/url-shortener)
  const toolId = pathname?.split('/').pop() || tools[0].id;
  const activeTool = tools.find(t => t.id === toolId) || tools[0];
  const activeToolId = activeTool.id;

  const handleSelectTool = (id: string) => {
    router.push(`/tools/${id}`);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  const Icon = activeTool.icon;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--qt-bg)' }}>
      <Sidebar
        activeTool={activeToolId}
        onSelectTool={handleSelectTool}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
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

          {/* Desktop logo */}
          <Link href="/" className="hidden lg:flex items-center gap-2.5 mr-4 group" style={{ textDecoration: 'none' }}>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'var(--qt-accent)' }}
            >
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-bold font-display" style={{ color: 'var(--qt-text)' }}>
              KwikToolbox
            </span>
          </Link>

          {/* Divider */}
          <div className="hidden lg:block w-px h-5" style={{ background: 'rgba(255,255,255,0.1)' }} />

          {/* Active tool info */}
          <div className="flex items-center gap-3 flex-1 min-w-0 ml-1">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(200,255,0,0.12)', border: '1px solid rgba(200,255,0,0.2)' }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: 'var(--qt-accent)' }} />
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
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="qt-btn-ghost qt-btn-sm hidden sm:inline-flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="text-xs">GitHub</span>
            </a>
            <div className="w-px h-4 hidden sm:block" style={{ background: 'rgba(255,255,255,0.1)' }} />
            
            {loading ? (
              <div className="w-20 h-8 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
            ) : user ? (
              <div className="flex items-center gap-2">
                {isPro && (
                  <div className="qt-badge hidden md:inline-flex items-center gap-1.5" style={{ background: 'rgba(200,255,0,0.1)', color: 'var(--qt-accent)', border: '1px solid rgba(200,255,0,0.2)' }}>
                    <Zap className="w-3 h-3" />
                    PRO
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--qt-text-secondary)' }}
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="qt-btn qt-btn-sm text-xs px-4 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* Ad Banner for non-pro users */}
        {!loading && !isPro && (
          <div className="w-full text-center py-2" style={{ background: 'rgba(255, 77, 106, 0.05)', borderBottom: '1px solid rgba(255, 77, 106, 0.1)' }}>
            <p className="text-xs" style={{ color: 'var(--qt-text-secondary)' }}>
              Support us and remove ads by <Link href="/#pricing" className="underline font-bold" style={{ color: 'var(--qt-accent)' }}>Upgrading to PRO</Link>
            </p>
          </div>
        )}

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
                  <Icon className="w-5 h-5" style={{ color: 'var(--qt-accent)' }} />
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

            {/* Tool component injected here via children */}
            <div className="animate-fade-up-delay-1">
              {children}
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-8 text-center animate-fade-up-delay-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'var(--qt-accent)' }}>
                  <Zap className="w-3 h-3 text-black" />
                </div>
                <span className="text-xs font-semibold font-display" style={{ color: 'var(--qt-text-secondary)' }}>KwikToolbox</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--qt-text-muted)' }}>
                Free online tools. No signup. No tracking. 100% private.
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--qt-text-muted)' }}>
                © 2025 KwikToolbox. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
