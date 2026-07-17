'use client';
import { useState, useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Loader2 } from 'lucide-react';

export default function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const generateQR = useCallback(() => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => { setQrValue(text.trim()); setLoading(false); }, 300);
  }, [text]);

  const downloadQR = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'quicktoolbox-qr.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <div>
        <label className="qt-label">Enter Text or URL</label>
        <div className="flex gap-2">
          <input type="text" placeholder="https://example.com or any text..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && generateQR()} className="qt-input flex-1" />
          <button onClick={generateQR} disabled={loading || !text.trim()} className="qt-btn flex-shrink-0">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}</button>
        </div>
      </div>
      {qrValue && (
        <div className="flex flex-col items-center gap-4">
          <div ref={canvasRef} className="qt-card p-6">
            <QRCodeCanvas value={qrValue} size={200} level="H" bgColor="#FFFFFF" fgColor="#0F172A" />
          </div>
          <button onClick={downloadQR} className="qt-btn-secondary"><Download className="w-4 h-4" />Download PNG</button>
        </div>
      )}
    </div>
  );
}
