'use client';
import { useState, useEffect, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import MD5 from 'crypto-js/md5';
import SHA1 from 'crypto-js/sha1';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';

const ALGOS = [
  { id: 'md5', name: 'MD5', fn: (t: string) => MD5(t).toString() },
  { id: 'sha1', name: 'SHA-1', fn: (t: string) => SHA1(t).toString() },
  { id: 'sha256', name: 'SHA-256', fn: (t: string) => SHA256(t).toString() },
  { id: 'sha512', name: 'SHA-512', fn: (t: string) => SHA512(t).toString() },
];

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState('');

  const compute = useCallback((text: string) => {
    if (!text) { setHashes({}); return; }
    const res: Record<string, string> = {};
    ALGOS.forEach(a => { res[a.id] = a.fn(text); });
    setHashes(res);
  }, []);

  useEffect(() => { compute(input); }, [input, compute]);

  const copy = async (text: string, id: string) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedId(id); setTimeout(() => setCopiedId(''), 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <div>
        <label className="qt-label">Enter Text to Hash</label>
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Type anything to generate hashes..." className="qt-textarea" />
      </div>
      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {ALGOS.map(algo => (
            <div key={algo.id} className="qt-card !p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--qt-brand)' }}>{algo.name}</span>
                <button onClick={() => copy(hashes[algo.id], algo.id)} className="p-1 rounded hover:bg-slate-100 transition-colors">{copiedId === algo.id ? <Check className="w-3.5 h-3.5" style={{ color: 'var(--qt-success)' }} /> : <Copy className="w-3.5 h-3.5" style={{ color: 'var(--qt-text-secondary)' }} />}</button>
              </div>
              <code className="text-xs font-mono break-all" style={{ color: 'var(--qt-text-secondary)' }}>{hashes[algo.id]}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
