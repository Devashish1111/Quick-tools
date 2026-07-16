import { useState } from 'react';

export default function PercentageCalculator() {
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const [v3, setV3] = useState('');
  const [v4, setV4] = useState('');
  const [v5, setV5] = useState('');
  const [v6, setV6] = useState('');

  const r1 = v1 && v2 ? ((Number(v1) / 100) * Number(v2)).toLocaleString(undefined, { maximumFractionDigits: 4 }) : '';
  const r2 = v3 && v4 ? ((Number(v3) / Number(v4)) * 100).toLocaleString(undefined, { maximumFractionDigits: 4 }) + '%' : '';
  const r3 = v5 && v6 ? (((Number(v6) - Number(v5)) / Number(v5)) * 100).toLocaleString(undefined, { maximumFractionDigits: 4 }) + '%' : '';

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <div className="qt-card space-y-4">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--qt-text)' }}>What is <span className="inline-block w-16"><input type="number" value={v1} onChange={e => setV1(e.target.value)} placeholder="X" className="qt-input text-center py-1.5" /></span>% of <span className="inline-block w-20"><input type="number" value={v2} onChange={e => setV2(e.target.value)} placeholder="Y" className="qt-input text-center py-1.5" /></span>?</h3>
        {r1 && <div className="qt-output text-center text-lg font-bold" style={{ color: 'var(--qt-brand)' }}>{r1}</div>}
      </div>

      <div className="qt-card space-y-4">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--qt-text)' }}><span className="inline-block w-16"><input type="number" value={v3} onChange={e => setV3(e.target.value)} placeholder="X" className="qt-input text-center py-1.5" /></span> is what % of <span className="inline-block w-20"><input type="number" value={v4} onChange={e => setV4(e.target.value)} placeholder="Y" className="qt-input text-center py-1.5" /></span>?</h3>
        {r2 && <div className="qt-output text-center text-lg font-bold" style={{ color: 'var(--qt-brand)' }}>{r2}</div>}
      </div>

      <div className="qt-card space-y-4">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--qt-text)' }}>What is the % change from <span className="inline-block w-16"><input type="number" value={v5} onChange={e => setV5(e.target.value)} placeholder="X" className="qt-input text-center py-1.5" /></span> to <span className="inline-block w-20"><input type="number" value={v6} onChange={e => setV6(e.target.value)} placeholder="Y" className="qt-input text-center py-1.5" /></span>?</h3>
        {r3 && <div className="qt-output text-center text-lg font-bold" style={{ color: Number(r3) >= 0 ? 'var(--qt-success)' : 'var(--qt-error)' }}>{Number(r3) >= 0 ? '+' : ''}{r3}</div>}
      </div>
    </div>
  );
}