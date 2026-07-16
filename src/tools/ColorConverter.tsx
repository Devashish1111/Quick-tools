import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorConverter() {
  const [hex, setHex] = useState('#2563EB');
  const [copiedField, setCopiedField] = useState('');

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null, [rgb]);
  const isValid = !!rgb;

  const updateFromRgb = (r: number, g: number, b: number) => {
    setHex('#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join(''));
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
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl border-2 shadow-inner" style={{ background: isValid ? hex : '#ccc', borderColor: isValid ? hex : '#ccc' }} />
        <div className="flex-1">
          <label className="qt-label">HEX Color</label>
          <div className="flex gap-2">
            <input type="text" value={hex} onChange={e => setHex(e.target.value)} className="qt-input font-mono flex-1" />
            <CopyBtn text={hex} field="hex" />
          </div>
        </div>
      </div>

      {rgb && (
        <div className="qt-card space-y-3">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--qt-text)' }}>RGB</h3>
          <div className="flex gap-2">
            {(['r', 'g', 'b'] as const).map((ch) => (
              <div key={ch} className="flex-1">
                <label className="text-xs uppercase font-bold" style={{ color: ch === 'r' ? '#EF4444' : ch === 'g' ? '#10B981' : '#3B82F6' }}>{ch.toUpperCase()}</label>
                <input type="number" min={0} max={255} value={rgb[ch]} onChange={e => { const v = Number(e.target.value); updateFromRgb(ch === 'r' ? v : rgb.r, ch === 'g' ? v : rgb.g, ch === 'b' ? v : rgb.b); }} className="qt-input text-center" />
              </div>
            ))}
            <div className="flex items-end"><CopyBtn text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} field="rgb" /></div>
          </div>
        </div>
      )}

      {hsl && (
        <div className="qt-card space-y-3">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--qt-text)' }}>HSL</h3>
          <div className="flex gap-2">
            <div className="flex-1 qt-output text-center">{hsl.h}&deg;</div>
            <div className="flex-1 qt-output text-center">{hsl.s}%</div>
            <div className="flex-1 qt-output text-center">{hsl.l}%</div>
            <div className="flex items-center"><CopyBtn text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} field="hsl" /></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-6 gap-1.5">
        {['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#D946EF', '#F43F5E', '#0F172A', '#64748B', '#94A3B8', '#CBD5E1', '#F1F5F9', '#FFFFFF', '#000000'].map(c => (
          <button key={c} onClick={() => setHex(c)} className="w-full aspect-square rounded-lg border hover:scale-110 transition-transform" style={{ background: c, borderColor: '#E2E8F0' }} />
        ))}
      </div>
    </div>
  );
}