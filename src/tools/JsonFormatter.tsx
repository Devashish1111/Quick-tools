import { useState } from 'react';
import { Copy, Check, Wand2, Minimize2 } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const format = () => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }
    try { setOutput(JSON.stringify(JSON.parse(input), null, 2)); }
    catch (e) { setError('Invalid JSON: ' + (e as Error).message); setOutput(''); }
  };

  const minify = () => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }
    try { setOutput(JSON.stringify(JSON.parse(input))); }
    catch (e) { setError('Invalid JSON: ' + (e as Error).message); setOutput(''); }
  };

  const copy = async () => {
    if (!output) return;
    try { await navigator.clipboard.writeText(output); } catch {
      const t = document.createElement('textarea'); t.value = output; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
      <div className="flex gap-2">
        <button onClick={format} className="qt-btn"><Wand2 className="w-4 h-4" />Beautify</button>
        <button onClick={minify} className="qt-btn-secondary"><Minimize2 className="w-4 h-4" />Minify</button>
        {output && <button onClick={copy} className="qt-btn-secondary ml-auto">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied' : 'Copy'}</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="qt-label">Raw JSON</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder='{"key": "value", "array": [1,2,3]}' className="qt-textarea font-mono text-xs" style={{ minHeight: 400 }} />
        </div>
        <div>
          <label className="qt-label">Formatted JSON</label>
          <textarea value={output} readOnly placeholder="Formatted JSON will appear here..." className="qt-textarea font-mono text-xs !bg-slate-50" style={{ minHeight: 400 }} />
        </div>
      </div>
      {error && <p className="text-sm px-4 py-2 rounded-lg bg-red-50" style={{ color: 'var(--qt-error)' }}>{error}</p>}
    </div>
  );
}