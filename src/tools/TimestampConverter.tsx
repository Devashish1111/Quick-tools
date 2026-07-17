'use client';
import { useState } from 'react';
import { Copy, Check, Clock, Calendar } from 'lucide-react';

export default function TimestampConverter() {
  const [unix, setUnix] = useState(String(Math.floor(Date.now() / 1000)));
  const [iso, setIso] = useState(new Date().toISOString());
  const [local, setLocal] = useState(new Date().toLocaleString());
  const [copiedField, setCopiedField] = useState('');

  const updateFromUnix = (val: string) => {
    setUnix(val);
    if (!val || isNaN(Number(val))) return;
    const d = new Date(Number(val) * 1000);
    setIso(d.toISOString()); setLocal(d.toLocaleString());
  };

  const updateFromISO = (val: string) => {
    setIso(val);
    const d = new Date(val); if (isNaN(d.getTime())) return;
    setUnix(String(Math.floor(d.getTime() / 1000))); setLocal(d.toLocaleString());
  };

  const now = () => {
    const ts = Math.floor(Date.now() / 1000);
    setUnix(String(ts));
    const d = new Date(); setIso(d.toISOString()); setLocal(d.toLocaleString());
  };

  const copy = async (text: string, field: string) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedField(field); setTimeout(() => setCopiedField(''), 1500);
  };

  const CopyBtn = ({ text, field }: { text: string; field: string }) => (
    <button onClick={() => copy(text, field)} className="p-1.5 rounded hover:bg-slate-200 transition-colors">{copiedField === field ? <Check className="w-3.5 h-3.5" style={{ color: 'var(--qt-success)' }} /> : <Copy className="w-3.5 h-3.5" style={{ color: 'var(--qt-text-secondary)' }} />}</button>
  );

  return (
    <div className="max-w-xl mx-auto space-y-4 animate-fade-in">
      <button onClick={now} className="qt-btn"><Clock className="w-4 h-4" />Set to Now</button>

      <div className="qt-card">
        <label className="qt-label flex items-center gap-2"><Clock className="w-3.5 h-3.5" />Unix Timestamp (seconds)</label>
        <div className="flex gap-2">
          <input type="text" value={unix} onChange={e => updateFromUnix(e.target.value)} className="qt-input font-mono flex-1" />
          <CopyBtn text={unix} field="unix" />
        </div>
      </div>

      <div className="qt-card">
        <label className="qt-label flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />ISO 8601 Format</label>
        <div className="flex gap-2">
          <input type="text" value={iso} onChange={e => updateFromISO(e.target.value)} className="qt-input font-mono flex-1 text-xs" />
          <CopyBtn text={iso} field="iso" />
        </div>
      </div>

      <div className="qt-card">
        <label className="qt-label flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />Local Date & Time</label>
        <div className="flex gap-2">
          <input type="text" value={local} readOnly className="qt-input flex-1 text-xs" style={{ background: 'var(--qt-bg-secondary)' }} />
          <CopyBtn text={local} field="local" />
        </div>
      </div>
    </div>
  );
}
