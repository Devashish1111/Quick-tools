import { useState, useCallback } from 'react';
import { Type, Copy, Check } from 'lucide-react';

type CaseType = 'upper' | 'lower' | 'title' | 'camel' | 'snake';

const CASES: { id: CaseType; label: string }[] = [
  { id: 'upper', label: 'UPPERCASE' },
  { id: 'lower', label: 'lowercase' },
  { id: 'title', label: 'Title Case' },
  { id: 'camel', label: 'camelCase' },
  { id: 'snake', label: 'snake_case' },
];

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

function toSnakeCase(str: string): string {
  return str
    .trim()
    .replace(/\s+/g, '_')
    .toLowerCase();
}

function convertCase(text: string, caseType: CaseType): string {
  switch (caseType) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return toTitleCase(text);
    case 'camel':
      return toCamelCase(text);
    case 'snake':
      return toSnakeCase(text);
    default:
      return text;
  }
}

export default function CaseConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeCase, setActiveCase] = useState<CaseType>('upper');
  const [copied, setCopied] = useState(false);

  const handleCaseChange = useCallback(
    (caseType: CaseType) => {
      setActiveCase(caseType);
      if (inputText.trim()) {
        setOutputText(convertCase(inputText, caseType));
      }
    },
    [inputText]
  );

  const handleInputChange = useCallback(
    (text: string) => {
      setInputText(text);
      if (text.trim()) {
        setOutputText(convertCase(text, activeCase));
      } else {
        setOutputText('');
      }
    },
    [activeCase]
  );

  const copyToClipboard = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = outputText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div id="case-converter" className="tool-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <Type className="w-5 h-5 text-[var(--color-brand-blue)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-charcoal)]">
          Case Converter
        </h3>
      </div>
      <p className="text-sm text-[var(--color-slate)] mb-5">
        Transform your text between uppercase, lowercase, title case, and more.
      </p>

      <div className="space-y-3">
        {/* Input */}
        <textarea
          placeholder="Paste your text here..."
          value={inputText}
          onChange={(e) => handleInputChange(e.target.value)}
          className="tool-textarea"
          style={{ height: 100 }}
        />

        {/* Case Buttons */}
        <div className="flex flex-wrap gap-2">
          {CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCaseChange(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all duration-200 ${
                activeCase === c.id
                  ? 'bg-[var(--color-brand-blue)] text-white border-[var(--color-brand-blue)]'
                  : 'bg-[var(--color-off-white)] text-[var(--color-charcoal)] border-[var(--color-light-gray)] hover:border-[var(--color-brand-blue)]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Output */}
        <div className="relative">
          <textarea
            value={outputText}
            readOnly
            placeholder="Converted text will appear here..."
            className="tool-textarea"
            style={{ height: 100 }}
          />
          {outputText && (
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-1.5 rounded bg-white shadow-sm hover:shadow transition-all"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[var(--color-slate)]" />
              )}
            </button>
          )}
        </div>
        {copied && (
          <p className="text-xs text-[var(--color-success)]">Copied!</p>
        )}
      </div>
    </div>
  );
}