import { useState } from 'react';
import { Search, MapPin, Globe, Wifi, Server, Copy, Check, Loader2 } from 'lucide-react';

interface IpData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  org: string;
  postal: string;
  currency: string;
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl group transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(200,255,0,0.08)' }}>
        <Icon className="w-4 h-4" style={{ color: 'var(--qt-accent)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--qt-text-tertiary)' }}>{label}</p>
        <p className="text-sm font-medium break-all" style={{ color: 'var(--qt-text)' }}>{value}</p>
      </div>
      <button
        onClick={copy}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all duration-200 flex-shrink-0"
        style={{ color: copied ? 'var(--qt-success)' : 'var(--qt-text-tertiary)' }}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

export default function IpInfoLookup() {
  const [ip, setIp] = useState('');
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async (target?: string) => {
    const query = (target ?? ip).trim();
    setLoading(true);
    setError('');
    setData(null);
    try {
      const url = query
        ? `https://ipapi.co/${encodeURIComponent(query)}/json/`
        : 'https://ipapi.co/json/';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Request failed');
      const json = await res.json();
      if (json.error) throw new Error(json.reason || 'IP lookup failed');
      setData(json);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const myIp = () => { setIp(''); lookup(''); };

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="qt-card space-y-4">
        <div>
          <label className="qt-label">IP Address</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--qt-text-tertiary)' }} />
              <input
                type="text"
                value={ip}
                onChange={e => setIp(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && lookup()}
                className="qt-input pl-10"
                placeholder="e.g. 8.8.8.8 (leave blank for your IP)"
              />
            </div>
            <button
              onClick={() => lookup()}
              disabled={loading}
              className="qt-btn flex-shrink-0 flex items-center gap-2 px-5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Lookup
            </button>
          </div>
        </div>
        <button
          onClick={myIp}
          className="qt-btn-secondary qt-btn-sm flex items-center gap-1.5 w-full justify-center"
        >
          <Globe className="w-3.5 h-3.5" />
          Lookup My IP Address
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,77,106,0.1)', color: 'var(--qt-error)', border: '1px solid rgba(255,77,106,0.2)' }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="qt-card flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <div className="qt-spinner mx-auto" />
            <p className="text-sm" style={{ color: 'var(--qt-text-tertiary)' }}>Looking up IP info...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="space-y-3 animate-fade-up">
          {/* Hero IP */}
          <div
            className="qt-card text-center p-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(200,255,0,0.08) 0%, rgba(0,0,0,0) 60%)' }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(200,255,0,0.1) 0%, transparent 60%)' }} />
            <div className="relative z-10">
              <div className="qt-badge inline-flex mb-3">
                <Globe className="w-3 h-3" />
                {data.country_code}
              </div>
              <p className="text-4xl font-black font-display mb-1" style={{ color: 'var(--qt-accent)' }}>
                {data.ip}
              </p>
              <p className="text-sm" style={{ color: 'var(--qt-text-secondary)' }}>
                {data.city}, {data.region}, {data.country_name}
              </p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoRow icon={MapPin}  label="Location"    value={`${data.city}, ${data.region}`} />
            <InfoRow icon={Globe}   label="Country"     value={`${data.country_name} (${data.country_code})`} />
            <InfoRow icon={Wifi}    label="ISP / Org"   value={data.org || 'N/A'} />
            <InfoRow icon={Server}  label="Timezone"    value={data.timezone} />
            <InfoRow icon={MapPin}  label="Coordinates" value={`${data.latitude}, ${data.longitude}`} />
            <InfoRow icon={Globe}   label="Postal Code" value={data.postal || 'N/A'} />
          </div>

          {/* Map link */}
          <a
            href={`https://maps.google.com/?q=${data.latitude},${data.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="qt-btn-secondary w-full flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            View on Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
