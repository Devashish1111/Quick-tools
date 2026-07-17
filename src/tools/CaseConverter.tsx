'use client';
import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

type CaseType = 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab';

const CASES: { id: CaseType; label: string }[] = [
  { id: 'upper', label: 'UPPERCASE' }, { id: 'lower', label: 'lowercase' }, { id: 'title', label: 'Title Case' },
  { id: 'camel', label: 'camelCase' }, { id: 'snake', label: 'snake_case' }, { id: 'kebab', label: 'kebab-case' },
];

function convert(text: string, c: CaseType): string {
  switch (c) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return text.toLowerCase().replace(/\b\w/g, ch => ch.toUpperCase());
    case 'camel': return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, ch) => ch.toUpperCase()).replace(/^./, ch => ch.toLowerCase());
    case 'snake': return text.trim().replace(/\s+/g, '_').toLowerCase();
    case 'kebab': return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    default: return text;
  }
}

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [active, setActive] = useState<CaseType>('upper');
  const [copied, setCopied] = useState(false);

  const handleInput = useCallback((text: string, c: CaseType = active) => {
    setInput(text);
    setOutput(text.trim() ? convert(text, c) : '');
  }, [active]);

  const handleCase = useCallback((c: CaseType) => { setActive(c); if (input.trim()) setOutput(convert(input, c)); }, [input]);

  const copy = async () => {
    if (!output) return;
    try { await navigator.clipboard.writeText(output); } catch {
      const t = document.createElement('textarea'); t.value = output; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 animate-fade-in">
      <div>
        <label className="qt-label">Input Text</label>
        <textarea placeholder="Paste your text here..." value={input} onChange={e => handleInput(e.target.value)} className="qt-textarea" />
      </div>
      <div className="flex flex-wrap gap-2">
        {CASES.map(c => (
          <button key={c.id} onClick={() => handleCase(c.id)} className={`qt-btn-sm px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${active === c.id ? 'text-white border-transparent' : 'bg-white'}`} style={active === c.id ? { background: 'var(--qt-brand)' } : { color: 'var(--qt-text-secondary)', borderColor: 'var(--qt-border)' }}>{c.label}</button>
        ))}
      </div>
      <div className="relative">
        <label className="qt-label">Result</label>
        <textarea value={output} readOnly placeholder="Converted text will appear here..." className="qt-textarea !bg-slate-50" />
        {output && <button onClick={copy} className="absolute top-8 right-3 p-1.5 rounded bg-white shadow-sm border" style={{ borderColor: 'var(--qt-border)' }}>{copied ? <Check className="w-3.5 h-3.5" style={{ color: 'var(--qt-success)' }} /> : <Copy className="w-3.5 h-3.5" style={{ color: 'var(--qt-text-secondary)' }} />}</button>}
      </div>
    </div>
  );
}
