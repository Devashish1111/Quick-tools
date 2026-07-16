import { useState, useCallback } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

const WORDS = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];

function generateParagraphs(count: number, wordsPerSentence: number = 12, sentencesPerParagraph: number = 6): string {
  const paragraphs: string[] = [];
  for (let p = 0; p < count; p++) {
    const sentences: string[] = [];
    for (let s = 0; s < sentencesPerParagraph; s++) {
      const words: string[] = [];
      for (let w = 0; w < wordsPerSentence; w++) {
        const idx = Math.floor(Math.random() * WORDS.length);
        words.push(w === 0 ? WORDS[idx].charAt(0).toUpperCase() + WORDS[idx].slice(1) : WORDS[idx]);
      }
      sentences.push(words.join(' ') + '.');
    }
    paragraphs.push(sentences.join(' '));
  }
  return paragraphs.join('\n\n');
}

export default function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => { setOutput(generateParagraphs(paragraphs)); }, [paragraphs]);

  const copy = async () => {
    if (!output) return;
    try { await navigator.clipboard.writeText(output); } catch {
      const t = document.createElement('textarea'); t.value = output; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div>
        <label className="qt-label">Number of Paragraphs: <span style={{ color: 'var(--qt-brand)' }} className="font-bold">{paragraphs}</span></label>
        <input type="range" min={1} max={10} value={paragraphs} onChange={e => setParagraphs(Number(e.target.value))} className="w-full accent-blue-600" />
        <div className="flex gap-2 mt-3">
          <button onClick={generate} className="qt-btn"><RefreshCw className="w-4 h-4" />Generate</button>
          {output && <button onClick={copy} className="qt-btn-secondary">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied' : 'Copy'}</button>}
        </div>
      </div>
      {output && (
        <div className="qt-card">
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--qt-text-secondary)' }}>{output}</p>
        </div>
      )}
    </div>
  );
}