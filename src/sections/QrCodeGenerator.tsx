import { useState, useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download, Loader2 } from 'lucide-react';
import AdSlot from './AdSlot';

export default function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const generateQR = useCallback(() => {
    if (!text.trim()) return;
    setLoading(true);
    // Small delay for UX feedback
    setTimeout(() => {
      setQrValue(text.trim());
      setLoading(false);
    }, 300);
  }, [text]);

  const downloadQR = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'qrcode-toolboxpro.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return (
    <div id="qr-code" className="tool-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <QrCode className="w-5 h-5 text-[var(--color-brand-blue)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-charcoal)]">
          QR Code Generator
        </h3>
      </div>
      <p className="text-sm text-[var(--color-slate)] mb-5">
        Enter any text or URL to generate a scannable QR code.
      </p>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Enter text or URL..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateQR()}
          className="tool-input"
        />

        <button
          onClick={generateQR}
          disabled={loading || !text.trim()}
          className="btn-primary w-full !py-3 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin-slow" />
          ) : (
            'Generate QR Code'
          )}
        </button>

        {qrValue && (
          <div className="mt-4 flex flex-col items-center">
            <div
              ref={canvasRef}
              className="p-4 bg-white rounded-lg border border-[var(--color-light-gray)]"
            >
              <QRCodeCanvas
                value={qrValue}
                size={180}
                level="H"
                includeMargin={false}
                bgColor="#FFFFFF"
                fgColor="#2D3748"
              />
            </div>
            <button
              onClick={downloadQR}
              className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue-hover)] transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
          </div>
        )}

        <AdSlot
          id="ad-slot-2"
          label="Sponsored"
          className="mt-4"
          style={{ minHeight: 250 }}
        />
      </div>
    </div>
  );
}
