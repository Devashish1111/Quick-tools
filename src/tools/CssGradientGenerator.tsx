'use client';
import { useState, useCallback } from 'react';
import { Copy, Check, RefreshCw, Plus, Trash2 } from 'lucide-react';

interface GradientStop {
  id: number;
  color: string;
  position: number;
}

type GradientType = 'linear' | 'radial' | 'conic';
type Direction = 'to right' | 'to left' | 'to bottom' | 'to top' | 'to bottom right' | 'to bottom left' | '135deg' | '45deg';

const DIRECTIONS: { label: string; value: Direction }[] = [
  { label: '→ Right',      value: 'to right' },
  { label: '← Left',       value: 'to left' },
  { label: '↓ Bottom',     value: 'to bottom' },
  { label: '↑ Top',        value: 'to top' },
  { label: '↗ Top Right',  value: 'to bottom left' },
  { label: '↘ Bot Right',  value: 'to bottom right' },
  { label: '135° Diagonal',value: '135deg' },
  { label: '45° Diagonal', value: '45deg' },
];

const PRESETS = [
  { name: 'Neon Lime',   stops: [{ id: 1, color: '#C8FF00', position: 0 }, { id: 2, color: '#00FF88', position: 100 }] },
  { name: 'Ocean',       stops: [{ id: 1, color: '#00C6FF', position: 0 }, { id: 2, color: '#0072FF', position: 100 }] },
  { name: 'Sunset',      stops: [{ id: 1, color: '#FF512F', position: 0 }, { id: 2, color: '#F09819', position: 100 }] },
  { name: 'Midnight',    stops: [{ id: 1, color: '#232526', position: 0 }, { id: 2, color: '#414345', position: 100 }] },
  { name: 'Purple Rain', stops: [{ id: 1, color: '#7F00FF', position: 0 }, { id: 2, color: '#E100FF', position: 100 }] },
  { name: 'Candy',       stops: [{ id: 1, color: '#FF6EC7', position: 0 }, { id: 2, color: '#FFD700', position: 100 }] },
];

export default function CssGradientGenerator() {
  const [type, setType] = useState<GradientType>('linear');
  const [direction, setDirection] = useState<Direction>('to right');
  const [stops, setStops] = useState<GradientStop[]>([
    { id: 1, color: '#C8FF00', position: 0 },
    { id: 2, color: '#0A0A0F', position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const buildCss = useCallback(() => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const stopsStr = sorted.map(s => `${s.color} ${s.position}%`).join(', ');
    if (type === 'linear') return `linear-gradient(${direction}, ${stopsStr})`;
    if (type === 'radial') return `radial-gradient(circle, ${stopsStr})`;
    return `conic-gradient(${stopsStr})`;
  }, [stops, type, direction]);

  const css = buildCss();
  const fullCss = `background: ${css};`;

  const updateStop = (id: number, field: keyof GradientStop, value: string | number) => {
    setStops(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addStop = () => {
    const newId = Math.max(...stops.map(s => s.id)) + 1;
    setStops(prev => [...prev, { id: newId, color: '#FFFFFF', position: 50 }]);
  };

  const removeStop = (id: number) => {
    if (stops.length <= 2) return;
    setStops(prev => prev.filter(s => s.id !== id));
  };

  const copy = () => {
    navigator.clipboard.writeText(fullCss).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const randomize = () => {
    const rand = () => '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
    setStops(prev => prev.map(s => ({ ...s, color: rand() })));
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div
        className="w-full rounded-2xl transition-all duration-500"
        style={{ background: css, height: '220px', border: '1px solid rgba(255,255,255,0.08)' }}
      />

      {/* Controls */}
      <div className="qt-card space-y-5">
        {/* Type */}
        <div>
          <label className="qt-label">Gradient Type</label>
          <div className="flex gap-2">
            {(['linear', 'radial', 'conic'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200"
                style={
                  type === t
                    ? { background: 'var(--qt-accent)', color: '#000' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'var(--qt-text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Direction (linear only) */}
        {type === 'linear' && (
          <div>
            <label className="qt-label">Direction</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DIRECTIONS.map(d => (
                <button
                  key={d.value}
                  onClick={() => setDirection(d.value)}
                  className="px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 text-center"
                  style={
                    direction === d.value
                      ? { background: 'rgba(200,255,0,0.15)', color: 'var(--qt-accent)', border: '1px solid rgba(200,255,0,0.3)' }
                      : { background: 'rgba(255,255,255,0.04)', color: 'var(--qt-text-secondary)', border: '1px solid rgba(255,255,255,0.07)' }
                  }
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color stops */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="qt-label mb-0">Color Stops</label>
            <button onClick={addStop} className="qt-btn-ghost qt-btn-sm flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Stop
            </button>
          </div>
          <div className="space-y-3">
            {[...stops].sort((a, b) => a.position - b.position).map(stop => (
              <div key={stop.id} className="flex items-center gap-3">
                <input
                  type="color"
                  value={stop.color}
                  onChange={e => updateStop(stop.id, 'color', e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0.5 flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <span className="text-xs font-mono-code w-20 flex-shrink-0" style={{ color: 'var(--qt-accent)' }}>
                  {stop.color.toUpperCase()}
                </span>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={stop.position}
                    onChange={e => updateStop(stop.id, 'position', Number(e.target.value))}
                    className="qt-range flex-1"
                  />
                  <span className="text-xs w-8 text-right flex-shrink-0" style={{ color: 'var(--qt-text-secondary)' }}>
                    {stop.position}%
                  </span>
                </div>
                <button
                  onClick={() => removeStop(stop.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors"
                  style={{ color: stops.length <= 2 ? 'var(--qt-text-muted)' : 'var(--qt-error)' }}
                  disabled={stops.length <= 2}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="qt-card space-y-3">
        <label className="qt-label">Presets</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => setStops(p.stops.map((s, i) => ({ ...s, id: i + 1 })))}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className="w-full h-12 rounded-xl transition-all duration-200 group-hover:scale-105"
                style={{
                  background: `linear-gradient(to right, ${p.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              />
              <span className="text-xs" style={{ color: 'var(--qt-text-tertiary)' }}>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div className="qt-card space-y-3">
        <label className="qt-label">Generated CSS</label>
        <div className="qt-output p-4 text-sm break-all">{fullCss}</div>
        <div className="flex gap-3">
          <button onClick={copy} className="qt-btn flex-1 flex items-center justify-center gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy CSS'}
          </button>
          <button onClick={randomize} className="qt-btn-secondary flex items-center gap-2 px-4">
            <RefreshCw className="w-4 h-4" />
            Randomize
          </button>
        </div>
      </div>
    </div>
  );
}
