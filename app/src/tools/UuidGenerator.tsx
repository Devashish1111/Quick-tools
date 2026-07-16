import { useState, useCallback } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = useCallback(() => {
    const arr: string[] = [];
    for (let i = 0; i < count; i++) {
      try { arr.push(crypto.randomUUID()); }
      catch { arr.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); })); }
    }
    setUuids(arr);
  }, [count]);

  const copy = async (uuid: string, idx: number) => {
    try { await navigator.clipboard.writeText(uuid); } catch {
      const t = document.createElement('textarea'); t.value = uuid; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedIndex(idx); setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = async () => {
    const all = uuids.join('\n');
    try { await navigator.clipboard.writeText(all); } catch {
      const t = document.createElement('textarea'); t.value = all; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="qt-label">Quantity: <span style={{ color: 'var(--qt-brand)' }} className="font-bold">{count}</span></label>
          <input type="range" min={1} max={20} value={count} onChange={e => setCount(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <div className="flex gap-2">
          <button onClick={generate} className="qt-btn"><RefreshCw className="w-4 h-4" />Generate</button>
          {uuids.length > 0 && <button onClick={copyAll} className="qt-btn-secondary"><Copy className="w-4 h-4" />Copy All</button>}
        </div>
      </div>
      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div key={`${uuid}-${i}`} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--qt-bg-secondary)' }}>
              <code className="text-sm font-mono flex-1 truncate" style={{ color: 'var(--qt-text)' }}>{uuid}</code>
              <button onClick={() => copy(uuid, i)} className="p-1.5 rounded hover:bg-white transition-colors">{copiedIndex === i ? <Check className="w-4 h-4" style={{ color: 'var(--qt-success)' }} /> : <Copy className="w-4 h-4" style={{ color: 'var(--qt-text-secondary)' }} />}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}