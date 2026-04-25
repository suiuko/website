// ——— Notes list + detail ———

const { useState: useStateN, useMemo: useMemoN, useEffect: useEffectN } = React;

function NotesIndex({ goto, selectedTag, setSelectedTag, query, setQuery }) {
  const allTags = useMemoN(() => {
    const m = new Map();
    window.NOTES.forEach(n => n.tags.forEach(t => m.set(t, (m.get(t) || 0) + 1)));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  const filtered = useMemoN(() => {
    const q = query.trim().toLowerCase();
    return window.NOTES.filter(n => {
      if (selectedTag && !n.tags.includes(selectedTag)) return false;
      if (q) {
        const hay = (n.title + ' ' + n.excerpt + ' ' + n.tags.join(' ') + ' ' + (n.body || '')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [selectedTag, query]);

  return (
    <div>
      <p className="page-sub">/notes · {filtered.length} of {window.NOTES.length}</p>
      <h1 className="page-title">thinking <em>out loud</em></h1>

      <div className="notes-head">
        <div>
          <div className="tag-row">
            <button className={'chip ' + (!selectedTag ? 'active' : '')} onClick={() => setSelectedTag(null)}>all</button>
            {allTags.map(([t, n]) => (
              <button key={t} className={'chip ' + (selectedTag === t ? 'active' : '')} onClick={() => setSelectedTag(selectedTag === t ? null : t)}>
                <span className="hash">#</span>{t}<span style={{ opacity: 0.5, marginLeft: 4 }}>{n}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="search-wrap">
          <input className="input" placeholder="grep…" value={query} onChange={e => setQuery(e.target.value)} />
          <span className="kbd">/</span>
        </div>
      </div>

      <div className="masonry" style={{ marginTop: 8 }}>
        {filtered.map(n => <NoteCard key={n.id} note={n} onOpen={() => goto('notes', n.id)} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
          grep: no matches. try another tag.
        </div>
      )}
    </div>
  );
}

function NoteCard({ note, onOpen }) {
  if (note.kind === 'quote') {
    return (
      <div className="note-card quote" onClick={onOpen}>
        <div className="date">{note.date}</div>
        <div style={{ marginTop: 10 }}>"{note.excerpt}"</div>
        <span className="who">{note.who}</span>
      </div>
    );
  }
  if (note.kind === 'code') {
    return (
      <div className="note-card code" onClick={onOpen}>
        <div className="date">{note.date}</div>
        <div className="title">{note.title}</div>
        <pre>
          {note.code.map((t, i) => <span key={i} className={'tok-' + t.t}>{t.v}</span>)}
        </pre>
        <div className="excerpt" style={{ marginTop: 10, fontFamily: "'EB Garamond', serif", fontSize: 14 }}>{note.excerpt}</div>
        <div className="tags">{note.tags.map(t => <span key={t}>{t}</span>)}</div>
      </div>
    );
  }
  return (
    <div className={'note-card ' + (note.kind === 'accent' ? 'accent' : '')} onClick={onOpen}>
      <div className="date">{note.date}</div>
      <div className="title">{note.title}</div>
      <div className="excerpt">{note.excerpt}</div>
      <div className="tags">{note.tags.map(t => <span key={t}>{t}</span>)}</div>
    </div>
  );
}

function NoteDetail({ id, goto }) {
  const note = window.NOTES.find(n => n.id === id);
  const [headings, setHeadings] = useStateN([]);
  const [activeId, setActiveId] = useStateN(null);

  useEffectN(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  useEffectN(() => {
    if (headings.length === 0) return;
    const onScroll = () => {
      let cur = headings[0]?.id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top < 120) cur = h.id;
      }
      setActiveId(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  if (!note) return <div>not found. <a href="#" onClick={(e) => { e.preventDefault(); goto('notes'); }}>← back</a></div>;

  return (
    <div>
      <p className="page-sub">
        <a href="#" onClick={(e) => { e.preventDefault(); goto('notes'); }}>← /notes</a>
        &nbsp;&nbsp;·&nbsp;&nbsp;{note.date}&nbsp;&nbsp;·&nbsp;&nbsp;{Math.max(1, Math.round((note.body || '').length / 400))} min read
      </p>

      <div className="note-detail">
        <div>
          <Markdown src={note.body} onHeadings={setHeadings} />
          <hr style={{ borderTop: '1px dashed var(--rule)', marginTop: 50 }} />
          <div style={{ fontSize: 12, color: 'var(--ink-3)', display: 'flex', gap: 18, marginTop: 20, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
            <span>filed under: {note.tags.map(t => '#' + t).join(' ')}</span>
            <span style={{ marginLeft: 'auto' }}>share: <a href="#">copy link</a></span>
          </div>
        </div>
        <TOC headings={headings} activeId={activeId} />
      </div>
    </div>
  );
}

Object.assign(window, { NotesIndex, NoteDetail, NoteCard });
