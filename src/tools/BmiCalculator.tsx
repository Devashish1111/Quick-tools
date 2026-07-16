import { useState, useMemo } from 'react';

export default function BmiCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const bmi = useMemo(() => {
    const h = Number(height), w = Number(weight);
    if (!h || !w) return null;
    if (unit === 'metric') return w / ((h / 100) ** 2);
    return (w / (h ** 2)) * 703;
  }, [height, weight, unit]);

  const category = (b: number) => {
    if (b < 18.5) return { label: 'Underweight', color: '#3B82F6' };
    if (b < 25) return { label: 'Normal Weight', color: '#10B981' };
    if (b < 30) return { label: 'Overweight', color: '#F59E0B' };
    return { label: 'Obese', color: '#EF4444' };
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <div className="flex gap-2">
        <button onClick={() => setUnit('metric')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${unit === 'metric' ? 'text-white' : 'bg-white border'}`} style={unit === 'metric' ? { background: 'var(--qt-brand)' } : { borderColor: 'var(--qt-border)' }}>Metric (cm / kg)</button>
        <button onClick={() => setUnit('imperial')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${unit === 'imperial' ? 'text-white' : 'bg-white border'}`} style={unit === 'imperial' ? { background: 'var(--qt-brand)' } : { borderColor: 'var(--qt-border)' }}>Imperial (in / lbs)</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="qt-label">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder={unit === 'metric' ? '175' : '69'} className="qt-input" />
        </div>
        <div>
          <label className="qt-label">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder={unit === 'metric' ? '70' : '160'} className="qt-input" />
        </div>
      </div>
      {bmi && (
        <div className="qt-card text-center">
          <p className="text-sm" style={{ color: 'var(--qt-text-secondary)' }}>Your BMI</p>
          <p className="text-4xl font-bold my-2" style={{ color: category(bmi).color }}>{bmi.toFixed(1)}</p>
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ background: category(bmi).color + '18', color: category(bmi).color }}>{category(bmi).label}</span>
        </div>
      )}
    </div>
  );
}