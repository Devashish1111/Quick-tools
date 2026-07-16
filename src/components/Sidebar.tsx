import { useState, useMemo } from 'react';
import { Search, Zap, X, Sparkles } from 'lucide-react';
import { categories, tools } from '../tools/toolsConfig';

interface SidebarProps {
  activeTool: string;
  onSelectTool: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTool, onSelectTool, isOpen, onClose }: SidebarProps) {
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
      {isOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />}

      <aside className={`fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: 'var(--qt-sidebar)', borderRight: '1px solid var(--qt-border)' }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 flex-shrink-0" style={{ borderBottom: '1px solid var(--qt-border)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--qt-brand)' }}>
            <Zap className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold" style={{ color: 'var(--qt-text)' }}>QuickToolbox</span>
            <span className="block text-[10px] font-medium -mt-0.5" style={{ color: 'var(--qt-text-tertiary)' }}>20 Free Online Tools</span>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden p-1 rounded"><X className="w-5 h-5" style={{ color: 'var(--qt-text-tertiary)' }} /></button>
        </div>

        {/* Search */}
        <div className="px-4 pt-4 pb-2 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--qt-text-tertiary)' }} />
            <input type="text" placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border transition-all" style={{ borderColor: 'var(--qt-border)', background: 'white', color: 'var(--qt-text)' }} />
          </div>
        </div>

        {/* Tool list */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-2 space-y-1">
          {categories.map(cat => {
            const catTools = grouped[cat.id];
            if (!catTools?.length) return null;
            const CatIcon = cat.icon;
            return (
              <div key={cat.id} className="mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <CatIcon className="w-3.5 h-3.5" style={{ color: 'var(--qt-text-tertiary)' }} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--qt-text-tertiary)' }}>{cat.name}</span>
                </div>
                {catTools.map(tool => {
                  const isActive = activeTool === tool.id;
                  const ToolIcon = tool.icon;
                  return (
                    <button key={tool.id} onClick={() => { onSelectTool(tool.id); onClose(); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'font-medium' : ''}`} style={isActive ? { background: 'var(--qt-sidebar-active)', color: 'var(--qt-brand)', borderLeft: '3px solid var(--qt-sidebar-active-border)' } : { color: 'var(--qt-text-secondary)', borderLeft: '3px solid transparent' }}>
                      <ToolIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate text-left">{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Premium CTA */}
        <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid var(--qt-border)' }}>
          <div className="rounded-xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
            <Sparkles className="w-5 h-5 mx-auto mb-1.5 text-white/80" />
            <p className="text-xs font-medium text-white mb-2">Remove ads & unlock premium features</p>
            <button className="w-full py-2 rounded-lg text-xs font-semibold bg-white/95 hover:bg-white transition-colors" style={{ color: 'var(--qt-brand)' }}>Go Premium</button>
          </div>
        </div>
      </aside>
    </>
  );
}