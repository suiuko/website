// ——— Primitives ———

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Tiny markdown renderer — enough for note bodies (headings, p, code, lists, blockquote, hr, inline code)
function renderMarkdown(src) {
  const lines = src.split('\n');
  const out = [];
  let inCode = false, codeBuf = [], codeLang = '';
  let inList = false, listBuf = [];
  let inQuote = false, quoteBuf = [];
  const flushList = () => { if (inList) { out.push({ type: 'ul', items: listBuf }); listBuf = []; inList = false; } };
  const flushQuote = () => { if (inQuote) { out.push({ type: 'quote', content: quoteBuf.join(' ') }); quoteBuf = []; inQuote = false; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      if (inCode) { out.push({ type: 'code', lang: codeLang, content: codeBuf.join('\n') }); codeBuf = []; inCode = false; }
      else { codeLang = line.slice(3).trim(); inCode = true; flushList(); flushQuote(); }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }
    if (line.startsWith('# ')) { flushList(); flushQuote(); out.push({ type: 'h1', content: line.slice(2) }); continue; }
    if (line.startsWith('## ')) { flushList(); flushQuote(); out.push({ type: 'h2', content: line.slice(3) }); continue; }
    if (line.startsWith('### ')) { flushList(); flushQuote(); out.push({ type: 'h3', content: line.slice(4) }); continue; }
    if (line.startsWith('> ')) { flushList(); inQuote = true; quoteBuf.push(line.slice(2)); continue; }
    if (line.match(/^[-*] /)) { flushQuote(); inList = true; listBuf.push(line.slice(2)); continue; }
    if (line.trim() === '---') { flushList(); flushQuote(); out.push({ type: 'hr' }); continue; }
    if (line.trim() === '') { flushList(); flushQuote(); out.push({ type: 'br' }); continue; }
    flushList(); flushQuote();
    out.push({ type: 'p', content: line });
  }
  flushList(); flushQuote();
  if (inCode) out.push({ type: 'code', lang: codeLang, content: codeBuf.join('\n') });
  return out;
}

function inline(s) {
  // inline code `x`, bold **x**, italic *x*
  const parts = [];
  let rest = s;
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/;
  while (rest) {
    const m = rest.match(re);
    if (!m) { parts.push(rest); break; }
    if (m.index > 0) parts.push(rest.slice(0, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) parts.push(<strong key={parts.length}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith('`')) parts.push(<code key={parts.length}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith('[')) {
      const tm = tok.match(/\[([^\]]+)\]\(([^)]+)\)/);
      parts.push(<a key={parts.length} href={tm[2]} target="_blank" rel="noreferrer">{tm[1]}</a>);
    } else parts.push(<em key={parts.length}>{tok.slice(1, -1)}</em>);
    rest = rest.slice(m.index + tok.length);
  }
  return parts;
}

function Markdown({ src, onHeadings }) {
  const blocks = useMemo(() => renderMarkdown(src), [src]);
  useEffect(() => {
    if (!onHeadings) return;
    const hs = blocks
      .map((b, i) => b.type === 'h1' || b.type === 'h2' || b.type === 'h3' ? { ...b, i, id: slug(b.content) } : null)
      .filter(Boolean);
    onHeadings(hs);
  }, [blocks]);
  return (
    <div className="note-body">
      {blocks.map((b, i) => {
        if (b.type === 'h1') return <h1 key={i} id={slug(b.content)}>{inline(b.content)}</h1>;
        if (b.type === 'h2') return <h2 key={i} id={slug(b.content)}>{inline(b.content)}</h2>;
        if (b.type === 'h3') return <h3 key={i} id={slug(b.content)}>{inline(b.content)}</h3>;
        if (b.type === 'p') return <p key={i}>{inline(b.content)}</p>;
        if (b.type === 'code') return <pre key={i}><code>{b.content}</code></pre>;
        if (b.type === 'quote') return <blockquote key={i}>{inline(b.content)}</blockquote>;
        if (b.type === 'ul') return <ul key={i}>{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ul>;
        if (b.type === 'hr') return <hr key={i} />;
        if (b.type === 'br') return null;
        return null;
      })}
    </div>
  );
}

function slug(s) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '').slice(0, 50);
}

function TOC({ headings, activeId }) {
  if (!headings || headings.length === 0) return null;
  return (
    <aside className="toc">
      <h4>·  on this page</h4>
      <ul>
        {headings.filter(h => h.type !== 'h1').map((h, i) => (
          <li key={i} className={h.type === 'h3' ? 'lvl-3' : 'lvl-2'}>
            <a href={'#' + h.id} className={h.id === activeId ? 'active' : ''}>{h.content}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// Placeholder — subtle diagonal-stripe swatch for "where an image would be"
function Placeholder({ label, ratio = '4/3', seed = 1 }) {
  const hues = [50, 60, 40, 70, 80, 45, 55];
  const h = hues[seed % hues.length];
  return (
    <div
      className="ph"
      style={{
        aspectRatio: ratio,
        background: `linear-gradient(${60 + seed * 20}deg, oklch(0.38 0.05 ${h}), oklch(0.28 0.03 ${h - 10}))`,
        position: 'relative', overflow: 'hidden',
        border: '1px solid var(--rule)',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 10px, oklch(0 0 0 / 0.15) 10px 11px)'
      }} />
      <div style={{
        position: 'absolute', bottom: 10, left: 10,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em',
        color: 'oklch(0.9 0.02 85 / 0.75)', textTransform: 'uppercase',
        background: 'oklch(0 0 0 / 0.35)', padding: '4px 8px',
        border: '1px solid oklch(0.8 0.02 85 / 0.25)',
      }}>{label}</div>
    </div>
  );
}

Object.assign(window, { Markdown, TOC, slug, Placeholder, renderMarkdown, inline });
