import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function toSlug(text: string): string {
  return text.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export default function TextToSlug() {
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (text: string) => { setInput(text); setSlug(toSlug(text)); };

  const copy = async () => {
    if (!slug) return;
    try { await navigator.clipboard.writeText(slug); } catch {
      const t = document.createElement('textarea'); t.value = slug; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <div>
        <label className="qt-label">Enter Text</label>
        <input type="text" placeholder="e.g. Hello World! This is a Title" value={input} onChange={e => handleChange(e.target.value)} className="qt-input" />
      </div>
      {slug && (
        <div>
          <label className="qt-label">Slug Result</label>
          <div className="flex gap-2">
            <div className="qt-output flex-1 flex items-center">{slug}</div>
            <button onClick={copy} className="qt-btn qt-btn-sm">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
          </div>
        </div>
      )}
    </div>
  );
}