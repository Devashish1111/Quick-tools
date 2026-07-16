import { useState, useCallback } from 'react';
import { Link2, Loader2, Copy, Check } from 'lucide-react';

export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const isValidUrl = (str: string) => {
    try {
      const u = new URL(str);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const shortenUrl = useCallback(async () => {
    setError('');
    setShortUrl('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    if (!isValidUrl(targetUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);

    try {
      // Try is.gd first
      const response = await fetch(
        `https://is.gd/create.php?format=simple&url=${encodeURIComponent(targetUrl)}`
      );
      const text = await response.text();

      if (text.startsWith('http')) {
        setShortUrl(text.trim());
      } else {
        // Fallback to tinyurl
        const fallback = await fetch(
          `https://tinyurl.com/api-create.php?url=${encodeURIComponent(targetUrl)}`
        );
        const fallbackText = await fallback.text();
        if (fallbackText.startsWith('http')) {
          setShortUrl(fallbackText.trim());
        } else {
          setError('Failed to shorten URL. Please try again.');
        }
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = shortUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div id="url-shortener" className="tool-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <Link2 className="w-5 h-5 text-[var(--color-brand-blue)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-charcoal)]">
          URL Shortener
        </h3>
      </div>
      <p className="text-sm text-[var(--color-slate)] mb-5">
        Paste a long URL and get a clean, shareable short link instantly.
      </p>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Paste your long URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && shortenUrl()}
          className="tool-input"
        />

        <button
          onClick={shortenUrl}
          disabled={loading}
          className="btn-primary w-full !py-3 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin-slow" />
          ) : (
            'Shorten URL'
          )}
        </button>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {shortUrl && (
          <div className="mt-4 p-4 rounded-lg bg-[var(--color-off-white)] border border-[var(--color-light-gray)]">
            <p className="text-xs text-[var(--color-slate)] mb-1">Your shortened URL:</p>
            <div className="flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 font-mono text-sm text-[var(--color-brand-blue)] break-all hover:underline"
              >
                {shortUrl}
              </a>
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-md hover:bg-white transition-colors flex-shrink-0"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[var(--color-success)]" />
                ) : (
                  <Copy className="w-4 h-4 text-[var(--color-slate)]" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-[var(--color-success)] mt-1">Copied!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}