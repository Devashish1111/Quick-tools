import { useState } from 'react';
import { ArrowDownUp, Copy, Check } from 'lucide-react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const process = (text: string, m: 'encode' | 'decode' = mode) => {
    setInput(text);
    if (!text.trim()) { setOutput(''); return; }
    try {
      if (m === 'encode') setOutput(btoa(unescape(encodeURIComponent(text))));
      else setOutput(decodeURIComponent(escape(atob(text))));
    } catch { setOutput('Invalid Base64 input'); }
  };

  const switchMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    if (output && output !== 'Invalid Base64 input') { setInput(output); setOutput(input); }
  };

  const copy = async () => {
    if (!output) return;
    try { await navigator.clipboard.writeText(output); } catch {
      const t = document.createElement('textarea'); t.value = output; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => { setMode('encode'); process(input, 'encode'); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'encode' ? 'text-white' : 'bg-white border'}`} style={mode === 'encode' ? { background: 'var(--qt-brand)' } : { borderColor: 'var(--qt-border)', color: 'var(--qt-text-secondary)' }}>Encode</button>
        <button onClick={() => { setMode('decode'); process(input, 'decode'); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'decode' ? 'text-white' : 'bg-white border'}`} style={mode === 'decode' ? { background: 'var(--qt-brand)' } : { borderColor: 'var(--qt-border)', color: 'var(--qt-text-secondary)' }}>Decode</button>
        <button onClick={switchMode} className="qt-btn-secondary qt-btn-sm ml-auto"><ArrowDownUp className="w-4 h-4" />Swap</button>
      </div>
      <div>
        <label className="qt-label">{mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}</label>
        <textarea value={input} onChange={e => process(e.target.value)} placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string...'} className="qt-textarea" />
      </div>
      {output && (
        <div>
          <label className="qt-label">Result</label>
          <div className="flex gap-2">
            <div className="qt-output flex-1 break-all">{output}</div>
            <button onClick={copy} className="qt-btn qt-btn-sm self-start">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
          </div>
        </div>
      )}
    </div>
  );
}