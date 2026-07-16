import { useState, useCallback, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

const CHARS = { uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lowercase: 'abcdefghijklmnopqrstuvwxyz', numbers: '0123456789', symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?' };

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let cs = ''; if (lower) cs += CHARS.lowercase; if (upper) cs += CHARS.uppercase; if (numbers) cs += CHARS.numbers; if (symbols) cs += CHARS.symbols;
    if (!cs) cs = CHARS.lowercase;
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr, n => cs[n % cs.length]).join(''));
  }, [length, upper, lower, numbers, symbols]);

  useEffect(() => { generate(); }, [generate]);

  const copy = async () => {
    if (!password) return;
    try { await navigator.clipboard.writeText(password); } catch {
      const t = document.createElement('textarea'); t.value = password; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  const strength = () => {
    let s = 0; if (upper) s++; if (lower) s++; if (numbers) s++; if (symbols) s++;
    if (length >= 20 && s >= 3) return { label: 'Very Strong', color: '#059669', width: '100%' };
    if (length >= 12 && s >= 3) return { label: 'Strong', color: '#10B981', width: '80%' };
    if (length >= 10 && s >= 2) return { label: 'Medium', color: '#F59E0B', width: '60%' };
    return { label: 'Weak', color: '#EF4444', width: '40%' };
  };

  const st = strength();

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <div className="qt-card text-center">
        <code className="text-lg font-mono break-all">{password}</code>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button onClick={copy} className="qt-btn qt-btn-sm">{copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Copied' : 'Copy'}</button>
          <button onClick={generate} className="qt-btn-secondary qt-btn-sm"><RefreshCw className="w-3.5 h-3.5" />New</button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="qt-label !mb-0">Length: <span className="font-bold ml-1" style={{ color: 'var(--qt-brand)' }}>{length}</span></label>
        </div>
        <input type="range" min={6} max={64} value={length} onChange={e => setLength(Number(e.target.value))} className="w-full accent-blue-600" />
        <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: '#E2E8F0' }}>
          <div className="h-full transition-all duration-300" style={{ width: st.width, background: st.color }} />
        </div>
        <p className="text-xs mt-1 font-medium" style={{ color: st.color }}>{st.label}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[{ label: 'Uppercase (A-Z)', checked: upper, onChange: setUpper }, { label: 'Lowercase (a-z)', checked: lower, onChange: setLower }, { label: 'Numbers (0-9)', checked: numbers, onChange: setNumbers }, { label: 'Symbols (!@#)', checked: symbols, onChange: setSymbols }].map(opt => (
          <label key={opt.label} className="flex items-center gap-2.5 p-3 rounded-lg cursor-pointer transition-colors" style={{ background: 'var(--qt-bg-secondary)' }}>
            <input type="checkbox" checked={opt.checked} onChange={e => opt.onChange(e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
            <span className="text-sm" style={{ color: 'var(--qt-text)' }}>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}