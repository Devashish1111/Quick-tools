import { useState, useCallback, useEffect } from 'react';
import { Lock, Copy, Check, RefreshCw } from 'lucide-react';

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (includeLower) charset += CHAR_SETS.lowercase;
    if (includeUpper) charset += CHAR_SETS.uppercase;
    if (includeNumbers) charset += CHAR_SETS.numbers;
    if (includeSymbols) charset += CHAR_SETS.symbols;

    if (charset === '') {
      charset = CHAR_SETS.lowercase;
    }

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  // Generate on mount and when options change
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div id="password-generator" className="tool-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <Lock className="w-5 h-5 text-[var(--color-brand-blue)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-charcoal)]">
          Password Generator
        </h3>
      </div>
      <p className="text-sm text-[var(--color-slate)] mb-5">
        Create strong, secure passwords with custom length and options.
      </p>

      <div className="space-y-4">
        {/* Length Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[var(--color-charcoal)]">
              Length
            </label>
            <span className="px-2.5 py-0.5 bg-[var(--color-charcoal)] text-white text-xs font-mono rounded-full">
              {length}
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-[var(--color-light-gray)] rounded-full appearance-none cursor-pointer accent-[var(--color-brand-blue)]"
          />
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Uppercase (A-Z)', checked: includeUpper, onChange: setIncludeUpper },
            { label: 'Lowercase (a-z)', checked: includeLower, onChange: setIncludeLower },
            { label: 'Numbers (0-9)', checked: includeNumbers, onChange: setIncludeNumbers },
            { label: 'Symbols (!@#$)', checked: includeSymbols, onChange: setIncludeSymbols },
          ].map((option) => (
            <label
              key={option.label}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={option.checked}
                onChange={(e) => option.onChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[var(--color-brand-blue)] focus:ring-[var(--color-brand-blue)]"
              />
              <span className="text-sm text-[var(--color-slate)]">{option.label}</span>
            </label>
          ))}
        </div>

        {/* Password Output */}
        <div
          className="relative flex items-center gap-2 p-4 rounded-lg"
          style={{ backgroundColor: 'var(--color-charcoal)' }}
        >
          <code className="flex-1 text-white font-mono text-sm break-all">
            {password}
          </code>
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded hover:bg-white/10 transition-colors flex-shrink-0"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[var(--color-success)]" />
            ) : (
              <Copy className="w-4 h-4 text-white/60" />
            )}
          </button>
          {copied && (
            <span className="absolute -top-7 right-0 text-xs text-[var(--color-success)] bg-white px-2 py-0.5 rounded shadow">
              Copied!
            </span>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="btn-primary w-full !py-3"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate New Password
        </button>
      </div>
    </div>
  );
}