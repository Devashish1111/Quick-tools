import { useState, useMemo } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpace, sentences, paragraphs, readingTime };
  }, [text]);

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: 'Words', value: stats.words }, { label: 'Characters', value: stats.chars },
          { label: 'No Spaces', value: stats.charsNoSpace }, { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs }, { label: 'Read Time', value: `${stats.readingTime} min` },
        ].map(s => (
          <div key={s.label} className="qt-stat">
            <div className="qt-stat-value">{s.value}</div>
            <div className="qt-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div>
        <label className="qt-label">Paste Your Text</label>
        <textarea placeholder="Start typing or paste your text here to see real-time statistics..." value={text} onChange={e => setText(e.target.value)} className="qt-textarea" style={{ minHeight: 300 }} />
      </div>
    </div>
  );
}