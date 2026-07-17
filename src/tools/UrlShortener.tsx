'use client';
import { useState, useCallback } from 'react';
import { Link2, Loader2, Copy, Check, ExternalLink } from 'lucide-react';

export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const isValidUrl = (str: string) => {
    try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:'; }
    catch { return false; }
  };

  const shortenUrl = useCallback(async () => {
    setError(''); setShortUrl('');
    if (!url.trim()) { setError('Please enter a URL'); return; }
    let target = url.trim();
    if (!target.startsWith('http')) target = 'https://' + target;
    if (!isValidUrl(target)) { setError('Please enter a valid URL'); return; }
    
    setLoading(true);
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to shorten URL');
      } else {
        setShortUrl(data.shortUrl);
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  const copy = async () => {
    if (!shortUrl) return;
    try { await navigator.clipboard.writeText(shortUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch { const t = document.createElement('textarea'); t.value = shortUrl; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); setCopied(true); setTimeout(() => setCopied(false), 1500); }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <div>
        <label className="qt-label">Enter a Long URL</label>
        <div className="flex gap-2">
          <input type="text" placeholder="https://example.com/very/long/url/that/needs/shortening" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && shortenUrl()} className="qt-input flex-1" />
          <button onClick={shortenUrl} disabled={loading} className="qt-btn flex-shrink-0">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}</button>
        </div>
        {error && <p className="text-sm mt-2" style={{ color: 'var(--qt-error)' }}>{error}</p>}
      </div>
      {shortUrl && (
        <div className="qt-card" style={{ background: 'rgba(34,211,165,0.06)', borderColor: 'rgba(34,211,165,0.25)' }}>
          <p className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--qt-success)' }}>Shortened URL</p>
          <div className="flex items-center gap-3">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="flex-1 font-mono text-sm truncate" style={{ color: 'var(--qt-accent)' }}>{shortUrl}</a>
            <button onClick={copy} className="qt-btn qt-btn-sm">{copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Copied' : 'Copy'}</button>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="qt-btn-secondary qt-btn-sm"><ExternalLink className="w-3.5 h-3.5" /></a>
          </div>
        </div>
      )}
    </div>
  );
}
