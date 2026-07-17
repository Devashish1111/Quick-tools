'use client';
import { useState, useMemo } from 'react';
import { Copy, Check, Eye, Code2 } from 'lucide-react';

function parseMarkdown(md: string): string {
  let html = md
    // Headings
    .replace(/^#{6}\s(.+)$/gm, '<h6 class="md-h6">$1</h6>')
    .replace(/^#{5}\s(.+)$/gm, '<h5 class="md-h5">$1</h5>')
    .replace(/^#{4}\s(.+)$/gm, '<h4 class="md-h4">$1</h4>')
    .replace(/^#{3}\s(.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^#{2}\s(.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^#{1}\s(.+)$/gm, '<h1 class="md-h1">$1</h1>')
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
    // Code blocks
    .replace(/```[\s\S]*?```/g, (m) => {
      const code = m.replace(/```[^\n]*\n?/, '').replace(/```$/, '');
      return `<pre class="md-pre"><code>${code}</code></pre>`;
    })
    // Blockquote
    .replace(/^>\s(.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="md-hr" />')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="md-link">$1</a>')
    // Images
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="md-img" />')
    // Unordered list
    .replace(/^\s*[-*+]\s(.+)$/gm, '<li class="md-li">$1</li>')
    // Ordered list
    .replace(/^\s*\d+\.\s(.+)$/gm, '<li class="md-li-ol">$1</li>')
    // Paragraphs (lines separated by blank lines)
    .replace(/\n\n(.+?)(?=\n\n|$)/gs, (_, p) => {
      if (p.trim().startsWith('<')) return '\n\n' + p;
      return `\n\n<p class="md-p">${p.trim()}</p>`;
    })
    // Line breaks
    .replace(/\n/g, '<br />');

  // Wrap consecutive <li> items
  html = html.replace(/((<li class="md-li">.*?<\/li><br \/>)+)/g, (m) => {
    const items = m.replace(/<br \/>/g, '');
    return `<ul class="md-ul">${items}</ul>`;
  });

  return html;
}

const SAMPLE = `# Markdown Preview

**Bold text** and *italic text* and ***both***.

## Features
- Live preview
- Syntax support
- Copy HTML output

## Code Example
\`\`\`
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> This is a blockquote. Great for callouts.

[Visit QuickToolbox](https://quicktoolbox.app)

---

Enjoy writing in **Markdown**!
`;

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'split' | 'preview' | 'source'>('split');

  const html = useMemo(() => parseMarkdown(markdown), [markdown]);

  const copyHtml = () => {
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="qt-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['split', 'preview', 'source'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200"
              style={
                view === v
                  ? { background: 'var(--qt-accent)', color: '#000' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'var(--qt-text-secondary)' }
              }
            >
              {v}
            </button>
          ))}
        </div>
        <button onClick={copyHtml} className="qt-btn qt-btn-sm flex items-center gap-1.5">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy HTML'}
        </button>
      </div>

      {/* Editor / Preview */}
      <div className={`gap-4 ${view === 'split' ? 'grid grid-cols-1 md:grid-cols-2' : 'block'}`}>
        {/* Editor */}
        {(view === 'split' || view === 'source') && (
          <div className="qt-card p-0 overflow-hidden">
            <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Code2 className="w-3.5 h-3.5" style={{ color: 'var(--qt-accent)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--qt-text-tertiary)' }}>Markdown</span>
            </div>
            <textarea
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
              className="w-full p-4 text-sm font-mono-code bg-transparent resize-none outline-none"
              style={{
                color: 'var(--qt-text)',
                minHeight: '420px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
                lineHeight: '1.7',
              }}
              placeholder="Start writing Markdown..."
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview */}
        {(view === 'split' || view === 'preview') && (
          <div className="qt-card p-0 overflow-hidden">
            <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Eye className="w-3.5 h-3.5" style={{ color: 'var(--qt-accent)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--qt-text-tertiary)' }}>Preview</span>
            </div>
            <div
              className="p-6 overflow-y-auto markdown-preview"
              style={{ minHeight: '420px', color: 'var(--qt-text)', lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: html || '<p style="color:var(--qt-text-muted)">Nothing to preview yet...</p>' }}
            />
          </div>
        )}
      </div>

      {/* Markdown CSS */}
      <style>{`
        .markdown-preview .md-h1 { font-size: 2rem; font-weight: 800; margin: 1.2em 0 0.6em; color: var(--qt-text); font-family: 'Outfit', sans-serif; }
        .markdown-preview .md-h2 { font-size: 1.5rem; font-weight: 700; margin: 1em 0 0.5em; color: var(--qt-text); font-family: 'Outfit', sans-serif; }
        .markdown-preview .md-h3 { font-size: 1.2rem; font-weight: 600; margin: 0.8em 0 0.4em; color: var(--qt-text); }
        .markdown-preview .md-h4, .markdown-preview .md-h5, .markdown-preview .md-h6 { font-size: 1rem; font-weight: 600; margin: 0.7em 0 0.3em; color: var(--qt-text-secondary); }
        .markdown-preview .md-p { margin: 0.6em 0; }
        .markdown-preview .md-inline-code { background: rgba(200,255,0,0.1); color: var(--qt-accent); padding: 0.1em 0.5em; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.85em; border: 1px solid rgba(200,255,0,0.2); }
        .markdown-preview .md-pre { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1em 1.2em; margin: 0.8em 0; overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-size: 0.85em; color: var(--qt-text); }
        .markdown-preview .md-blockquote { border-left: 3px solid var(--qt-accent); margin: 0.8em 0; padding: 0.5em 1em; background: rgba(200,255,0,0.05); border-radius: 0 8px 8px 0; color: var(--qt-text-secondary); }
        .markdown-preview .md-hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.2em 0; }
        .markdown-preview .md-link { color: var(--qt-accent); text-decoration: underline; text-underline-offset: 3px; }
        .markdown-preview .md-img { max-width: 100%; border-radius: 8px; margin: 0.5em 0; }
        .markdown-preview .md-ul { list-style: none; margin: 0.5em 0 0.5em 1em; padding: 0; }
        .markdown-preview .md-li { padding: 0.15em 0 0.15em 1.2em; position: relative; }
        .markdown-preview .md-li::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 6px; height: 6px; background: var(--qt-accent); border-radius: 50%; }
        .markdown-preview strong { font-weight: 700; color: var(--qt-text); }
        .markdown-preview em { font-style: italic; color: var(--qt-text-secondary); }
        .markdown-preview del { text-decoration: line-through; color: var(--qt-text-muted); }
      `}</style>
    </div>
  );
}
