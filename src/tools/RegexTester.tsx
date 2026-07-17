'use client';
import { useState, useMemo } from 'react';
import { Copy, Check, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Match {
  text: string;
  index: number;
  length: number;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b');
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [testString, setTestString] = useState(
    'Reach us at hello@quicktoolbox.app or support@example.com for help.\nOr visit our docs at docs@example.org'
  );
  const [copied, setCopied] = useState(false);

  const { matches, error, highlightedHtml } = useMemo(() => {
    if (!pattern) {
      return { matches: [], error: null, highlightedHtml: escapeHtml(testString) };
    }
    try {
      const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('');
      // Validate the pattern first
      new RegExp(pattern, flagStr);
      const allMatches: Match[] = [];
      let m: RegExpExecArray | null;
      const rx = new RegExp(pattern, flagStr.includes('g') ? flagStr : flagStr + 'g');
      while ((m = rx.exec(testString)) !== null) {
        allMatches.push({ text: m[0], index: m.index, length: m[0].length });
        if (!flagStr.includes('g')) break;
      }

      // Build highlighted HTML
      let html = '';
      let last = 0;
      for (const match of allMatches) {
        html += escapeHtml(testString.slice(last, match.index));
        html += `<mark class="regex-match">${escapeHtml(match.text)}</mark>`;
        last = match.index + match.length;
      }
      html += escapeHtml(testString.slice(last));
      html = html.replace(/\n/g, '<br/>');

      return { matches: allMatches, error: null, highlightedHtml: html };
    } catch (e: any) {
      return { matches: [], error: e.message as string, highlightedHtml: escapeHtml(testString).replace(/\n/g, '<br/>') };
    }
  }, [pattern, flags, testString]);

  function escapeHtml(str: string) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  const flagList = [
    { key: 'g', label: 'Global', desc: 'Find all matches' },
    { key: 'i', label: 'Ignore Case', desc: 'Case-insensitive' },
    { key: 'm', label: 'Multiline', desc: '^$ match line boundaries' },
  ] as const;

  const copyPattern = () => {
    navigator.clipboard.writeText(`/${pattern}/${Object.entries(flags).filter(([,v])=>v).map(([k])=>k).join('')}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      {/* Pattern input */}
      <div className="qt-card space-y-4">
        <div>
          <label className="qt-label">Regular Expression</label>
          <div className="flex items-center gap-0">
            <span
              className="px-3 py-3 rounded-l-xl text-sm font-mono-code flex-shrink-0"
              style={{ background: 'rgba(200,255,0,0.08)', color: 'var(--qt-accent)', border: '1px solid rgba(200,255,0,0.2)', borderRight: 'none' }}
            >
              /
            </span>
            <input
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              className="flex-1 px-4 py-3 text-sm font-mono-code outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRight: 'none',
                borderLeft: 'none',
                color: 'var(--qt-text)',
                fontFamily: "'JetBrains Mono', monospace",
              }}
              placeholder="Enter regex pattern..."
              spellCheck={false}
            />
            <span
              className="px-3 py-3 rounded-r-xl text-sm font-mono-code flex-shrink-0"
              style={{ background: 'rgba(200,255,0,0.08)', color: 'var(--qt-accent)', border: '1px solid rgba(200,255,0,0.2)', borderLeft: 'none' }}
            >
              /{Object.entries(flags).filter(([,v])=>v).map(([k])=>k).join('')}
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(255,77,106,0.1)', color: 'var(--qt-error)', border: '1px solid rgba(255,77,106,0.2)' }}>
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Flags */}
        <div>
          <label className="qt-label">Flags</label>
          <div className="flex flex-wrap gap-2">
            {flagList.map(f => (
              <button
                key={f.key}
                onClick={() => setFlags(prev => ({ ...prev, [f.key]: !prev[f.key] }))}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                style={
                  flags[f.key]
                    ? { background: 'rgba(200,255,0,0.12)', color: 'var(--qt-accent)', border: '1px solid rgba(200,255,0,0.25)' }
                    : { background: 'rgba(255,255,255,0.04)', color: 'var(--qt-text-secondary)', border: '1px solid rgba(255,255,255,0.07)' }
                }
              >
                <span className="font-mono-code font-bold">{f.key}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Test string */}
      <div className="qt-card space-y-3">
        <label className="qt-label">Test String</label>
        <textarea
          value={testString}
          onChange={e => setTestString(e.target.value)}
          className="qt-textarea"
          style={{ minHeight: '120px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}
          placeholder="Enter test string..."
          spellCheck={false}
        />
      </div>

      {/* Results */}
      <div className="qt-card space-y-4">
        {/* Match status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!error && matches.length > 0 ? (
              <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--qt-success)' }} />
            ) : !error ? (
              <AlertCircle className="w-4 h-4" style={{ color: 'var(--qt-text-muted)' }} />
            ) : null}
            <span className="text-sm font-semibold" style={{ color: matches.length > 0 ? 'var(--qt-success)' : 'var(--qt-text-secondary)' }}>
              {error ? 'Invalid Pattern' : matches.length === 0 ? 'No matches found' : `${matches.length} match${matches.length !== 1 ? 'es' : ''} found`}
            </span>
          </div>
          <button onClick={copyPattern} className="qt-btn-ghost qt-btn-sm flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            Copy Regex
          </button>
        </div>

        {/* Highlighted output */}
        <div>
          <label className="qt-label">Highlighted Output</label>
          <div
            className="p-4 rounded-xl text-sm leading-relaxed font-mono-code"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'var(--qt-text)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
              minHeight: '80px',
            }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml || '<span style="color:var(--qt-text-muted)">Start typing to see highlights...</span>' }}
          />
        </div>

        {/* Match list */}
        {matches.length > 0 && (
          <div>
            <label className="qt-label">Match Details</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {matches.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-[10px]"
                    style={{ background: 'rgba(200,255,0,0.15)', color: 'var(--qt-accent)' }}
                  >
                    {i + 1}
                  </span>
                  <code style={{ color: 'var(--qt-accent)', fontFamily: "'JetBrains Mono', monospace" }}>{m.text}</code>
                  <span style={{ color: 'var(--qt-text-muted)', marginLeft: 'auto' }}>index {m.index}, len {m.length}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .regex-match {
          background: rgba(200,255,0,0.25);
          color: #000;
          border-radius: 3px;
          padding: 0 2px;
          outline: 1px solid rgba(200,255,0,0.5);
        }
      `}</style>
    </div>
  );
}
