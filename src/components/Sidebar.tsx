'use client';
import { useState, useMemo } from 'react';
import { Search, Zap, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { categories, tools } from '../tools/toolsConfig';

import { User } from '@supabase/supabase-js';

interface SidebarProps {
  activeTool: string;
  onSelectTool: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export default function Sidebar({ activeTool, onSelectTool, isOpen, onClose, user }: SidebarProps) {
  const [search, setSearch] = useState('');

  const filteredTools = useMemo(() => {
    if (!search.trim()) return tools;
    const q = search.toLowerCase();
    return tools.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }, [search]);

  const grouped = useMemo(() => {
    const g: Record<string, typeof tools> = {};
    categories.forEach(c => { g[c.id] = []; });
    filteredTools.forEach(t => { if (!g[t.category]) g[t.category] = []; g[t.category].push(t); });
    return g;
  }, [filteredTools]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          width: '260px',
          background: 'var(--qt-sidebar)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* -- Logo -- */}
        <div
          className="flex items-center justify-between px-5 h-16 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <a href="/" className="flex items-center gap-2.5 flex-1 min-w-0 group" style={{ textDecoration: 'none' }}>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'var(--qt-accent)' }}
            >
              <Zap className="w-4 h-4 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-bold font-display block" style={{ color: 'var(--qt-text)' }}>
                KwikToolbox
              </span>
              <span className="text-[10px] font-medium" style={{ color: 'var(--qt-text-tertiary)' }}>
                25 Free Online Tools
              </span>
            </div>
          </a>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg transition-colors ml-2"
            style={{ color: 'var(--qt-text-tertiary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* -- Search -- */}
        <div className="px-3 pt-4 pb-2 flex-shrink-0">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
              style={{ color: 'var(--qt-text-tertiary)' }}
            />
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--qt-text)',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(200,255,0,0.4)';
                e.target.style.background = 'rgba(255,255,255,0.07)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                e.target.style.background = 'rgba(255,255,255,0.05)';
              }}
            />
          </div>
        </div>

        {/* -- Tool list -- */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-2">
          {search && filteredTools.length === 0 && (
            <div className="text-center py-8">
              <p className="text-xs" style={{ color: 'var(--qt-text-muted)' }}>No tools found</p>
            </div>
          )}

          {categories.map(cat => {
            const catTools = grouped[cat.id];
            if (!catTools?.length) return null;
            const CatIcon = cat.icon;

            return (
              <div key={cat.id} className="mb-4">
                {/* Category header */}
                <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
                  <CatIcon className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--qt-accent)', opacity: 0.7 }} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: 'var(--qt-text-tertiary)' }}
                  >
                    {cat.name}
                  </span>
                </div>

                {/* Tools */}
                <div className="space-y-0.5">
                  {catTools.map(tool => {
                    const isActive = activeTool === tool.id;
                    const ToolIcon = tool.icon;

                    return (
                      <button
                        key={tool.id}
                        onClick={() => { onSelectTool(tool.id); onClose(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 group text-left"
                        style={
                          isActive
                            ? {
                                background: 'rgba(200,255,0,0.1)',
                                color: 'var(--qt-accent)',
                                border: '1px solid rgba(200,255,0,0.2)',
                              }
                            : {
                                color: 'var(--qt-text-secondary)',
                                border: '1px solid transparent',
                              }
                        }
                        onMouseEnter={e => {
                          if (!isActive) {
                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                            (e.currentTarget as HTMLButtonElement).style.color = 'var(--qt-text)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                            (e.currentTarget as HTMLButtonElement).style.color = 'var(--qt-text-secondary)';
                          }
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                          style={
                            isActive
                              ? { background: 'rgba(200,255,0,0.15)' }
                              : { background: 'rgba(255,255,255,0.05)' }
                          }
                        >
                          <ToolIcon className="w-3 h-3" />
                        </div>
                        <span className="truncate font-medium">{tool.name}</span>
                        {isActive && (
                          <div
                            className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: 'var(--qt-accent)' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* -- Premium CTA -- */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="rounded-2xl p-4 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(200,255,0,0.15) 0%, rgba(200,255,0,0.05) 100%)',
              border: '1px solid rgba(200,255,0,0.2)',
            }}
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(200,255,0,0.3) 0%, transparent 70%)',
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--qt-accent)' }} />
                <p className="text-xs font-bold" style={{ color: 'var(--qt-accent)' }}>Go Premium</p>
              </div>
              <p className="text-[10px] mb-3 leading-relaxed" style={{ color: 'var(--qt-text-secondary)' }}>
                Remove ads, unlock bulk tools & analytics
              </p>
              <a
                href="/premium"
                className="w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200"
                style={{ background: 'var(--qt-accent)', color: '#000', textDecoration: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--qt-accent-hover)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--qt-accent)'; }}
              >
                Upgrade Now
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer so content shifts on desktop */}
      <div className="hidden lg:block flex-shrink-0" style={{ width: '260px' }} />
    </>
  );
}
