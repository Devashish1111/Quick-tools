import { useState, useMemo } from 'react';

const CATEGORIES: Record<string, { name: string; units: Record<string, { name: string; toBase: number }> }> = {
  length: { name: 'Length', units: { m: { name: 'Meters', toBase: 1 }, km: { name: 'Kilometers', toBase: 1000 }, cm: { name: 'Centimeters', toBase: 0.01 }, mm: { name: 'Millimeters', toBase: 0.001 }, mi: { name: 'Miles', toBase: 1609.344 }, yd: { name: 'Yards', toBase: 0.9144 }, ft: { name: 'Feet', toBase: 0.3048 }, in: { name: 'Inches', toBase: 0.0254 } } },
  weight: { name: 'Weight', units: { kg: { name: 'Kilograms', toBase: 1 }, g: { name: 'Grams', toBase: 0.001 }, mg: { name: 'Milligrams', toBase: 0.000001 }, lb: { name: 'Pounds', toBase: 0.453592 }, oz: { name: 'Ounces', toBase: 0.0283495 } } },
  temp: { name: 'Temperature', units: { c: { name: 'Celsius', toBase: 1 }, f: { name: 'Fahrenheit', toBase: 1 }, k: { name: 'Kelvin', toBase: 1 } } },
  data: { name: 'Data Storage', units: { b: { name: 'Bytes', toBase: 1 }, kb: { name: 'KB', toBase: 1024 }, mb: { name: 'MB', toBase: 1048576 }, gb: { name: 'GB', toBase: 1073741824 }, tb: { name: 'TB', toBase: 1099511627776 } } },
};

function convertTemp(val: number, from: string, to: string): number {
  let celsius = val;
  if (from === 'f') celsius = (val - 32) * 5 / 9;
  else if (from === 'k') celsius = val - 273.15;
  if (to === 'c') return celsius;
  if (to === 'f') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export default function UnitConverter() {
  const [cat, setCat] = useState('length');
  const [val, setVal] = useState('1');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');

  const units = CATEGORIES[cat].units;
  const unitKeys = Object.keys(units);

  const result = useMemo(() => {
    const v = Number(val); if (isNaN(v) || !val) return '';
    if (cat === 'temp') return convertTemp(v, from, to).toLocaleString(undefined, { maximumFractionDigits: 6 });
    const base = v * units[from].toBase;
    return (base / units[to].toBase).toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [val, from, to, cat, units]);

  return (
    <div className="max-w-xl mx-auto space-y-4 animate-fade-in">
      <div className="flex flex-wrap gap-2">
        {Object.keys(CATEGORIES).map(c => (
          <button key={c} onClick={() => { setCat(c); const keys = Object.keys(CATEGORIES[c].units); setFrom(keys[0]); setTo(keys[1] || keys[0]); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${cat === c ? 'text-white' : 'bg-white border'}`} style={cat === c ? { background: 'var(--qt-brand)' } : { borderColor: 'var(--qt-border)', color: 'var(--qt-text-secondary)' }}>{CATEGORIES[c].name}</button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <label className="qt-label">From</label>
          <input type="number" value={val} onChange={e => setVal(e.target.value)} className="qt-input" />
          <select value={from} onChange={e => setFrom(e.target.value)} className="qt-input mt-2 text-sm">
            {unitKeys.map(k => <option key={k} value={k}>{units[k].name}</option>)}
          </select>
        </div>
        <div className="pb-10 text-lg font-bold" style={{ color: 'var(--qt-brand)' }}>=</div>
        <div>
          <label className="qt-label">To</label>
          <div className="qt-input flex items-center font-mono text-sm min-h-[46px]">{result || '—'}</div>
          <select value={to} onChange={e => setTo(e.target.value)} className="qt-input mt-2 text-sm">
            {unitKeys.map(k => <option key={k} value={k}>{units[k].name}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}