import { useState } from 'react';
import { Dices } from 'lucide-react';

export default function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [decimal, setDecimal] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  const generate = () => {
    const lo = Math.min(min, max), hi = Math.max(min, max);
    const arr: number[] = [];
    for (let i = 0; i < count; i++) {
      const val = Math.random() * (hi - lo) + lo;
      arr.push(decimal ? Math.round(val * 10000) / 10000 : Math.floor(val));
    }
    setResults(arr);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="qt-label">Minimum</label>
          <input type="number" value={min} onChange={e => setMin(Number(e.target.value))} className="qt-input text-center font-mono" />
        </div>
        <div>
          <label className="qt-label">Maximum</label>
          <input type="number" value={max} onChange={e => setMax(Number(e.target.value))} className="qt-input text-center font-mono" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="qt-label">Count: <span style={{ color: 'var(--qt-brand)' }} className="font-bold">{count}</span></label>
          <input type="range" min={1} max={20} value={count} onChange={e => setCount(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer mt-5">
          <input type="checkbox" checked={decimal} onChange={e => setDecimal(e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
          <span className="text-sm" style={{ color: 'var(--qt-text-secondary)' }}>Allow Decimals</span>
        </label>
      </div>
      <button onClick={generate} className="qt-btn w-full"><Dices className="w-4 h-4" />Generate Random Numbers</button>
      {results.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {results.map((r, i) => (
            <div key={i} className="qt-card !p-3 text-center min-w-[80px]">
              <span className="text-xl font-bold font-mono" style={{ color: 'var(--qt-brand)' }}>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}