'use client';
import { useState, useRef, useCallback } from 'react';
import { Upload, Copy, Check, Image, X } from 'lucide-react';

export default function ImageToBase64() {
  const [base64, setBase64] = useState('');
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => { const result = reader.result as string; setBase64(result); setPreview(result); };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const copy = async () => {
    if (!base64) return;
    try { await navigator.clipboard.writeText(base64); } catch {
      const t = document.createElement('textarea'); t.value = base64; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  const clear = () => { setBase64(''); setPreview(''); setFileName(''); };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      {!preview ? (
        <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => inputRef.current?.click()} className="qt-card border-dashed cursor-pointer text-center py-12 hover:border-blue-400 transition-colors" style={{ borderWidth: 2, borderColor: '#CBD5E1' }}>
          <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--qt-brand)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--qt-text)' }}>Click to upload or drag & drop</p>
          <p className="text-xs mt-1" style={{ color: 'var(--qt-text-tertiary)' }}>PNG, JPG, GIF, WebP — Max 5MB</p>
          <input ref={inputRef} type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
        </div>
      ) : (
        <>
          <div className="qt-card !p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--qt-text-secondary)' }}><Image className="w-3.5 h-3.5" />{fileName}</span>
              <button onClick={clear} className="p-1 rounded hover:bg-slate-100"><X className="w-4 h-4" style={{ color: 'var(--qt-text-tertiary)' }} /></button>
            </div>
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
          </div>
          {base64 && (
            <>
              <div className="flex gap-2">
                <button onClick={copy} className="qt-btn">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied' : 'Copy Base64'}</button>
                <div className="qt-output flex-1 flex items-center text-xs truncate">{base64.substring(0, 60)}...</div>
              </div>
              <p className="text-xs" style={{ color: 'var(--qt-text-tertiary)' }}>Size: {(base64.length * 0.75 / 1024).toFixed(1)} KB (Base64)</p>
            </>
          )}
        </>
      )}
    </div>
  );
}
