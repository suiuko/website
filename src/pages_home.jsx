// ——— Home page ———

const { useState: useStateH, useEffect: useEffectH } = React;

function Home({ goto }) {
  const recent = window.NOTES.slice(0, 3);
  const [typed, setTyped] = useStateH('');
  const full = 'cat ~/about.md';
  useEffectH(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <div className="hero">
        <div className="hero-img">
          <Placeholder label="cover photo · replace in /public/cover.jpg" ratio="4/3" seed={3} />
        </div>
        <div className="hero-meta">
          <div>
            <p className="page-sub">~$ {typed}<span className="cursor" /></p>
            <h1 className="page-title" style={{ marginTop: 12 }}>
              Gaojing <em>Zhang</em>
              <span style={{ display: 'block', fontSize: '0.35em', fontFamily: "'Noto Serif SC', serif", color: 'var(--ink-3)', marginTop: 6, letterSpacing: '0.08em' }}>张高靖</span>
            </h1>
            <p className="hero-bio" style={{ marginTop: 18 }}>
              PhD student thinking about <em>learning from limited signal</em> — diffusion, RL, and the places they meet.
              <br/><br/>
              在 Cambridge 读博，业余写 notes、冲咖啡、用胶片相机拍一些没有用但我很喜欢的东西。
            </p>
          </div>
          <div className="stat-grid">
            <div className="stat"><div className="n">{window.NOTES.length}</div><div className="l">notes</div></div>
            <div className="stat"><div className="n">{window.PHOTOS.length}</div><div className="l">photos</div></div>
            <div className="stat"><div className="n">{window.PROJECTS.length}</div><div className="l">projects</div></div>
            <div className="stat"><div className="n">{window.TRIPS.length}</div><div className="l">places</div></div>
          </div>
        </div>
      </div>

      <div className="divider-ascii">— · — · — · — · — · — · — · — · — · — · — · — · — · — · — · — · —</div>

      <section className="section" style={{ marginTop: 32 }}>
        <div className="section-head">
          <h2>recent notes</h2>
          <span className="meta">updated {recent[0].date} · <a href="#" onClick={(e) => { e.preventDefault(); goto('notes'); }}>all →</a></span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {recent.map(n => (
            <div key={n.id} className="note-card" onClick={() => goto('notes', n.id)}>
              <div className="date">{n.date}</div>
              <div className="title">{n.title}</div>
              <div className="excerpt">{n.excerpt.slice(0, 120)}{n.excerpt.length > 120 ? '…' : ''}</div>
              <div className="tags">{n.tags.slice(0, 3).map(t => <span key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>latest frames</h2>
          <span className="meta"><a href="#" onClick={(e) => { e.preventDefault(); goto('photos'); }}>darkroom →</a></span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {window.PHOTOS.slice(0, 4).map((p, i) => (
            <div key={p.id} className="polaroid" style={{ position: 'relative', width: 'auto', transform: `rotate(${(i % 2 ? 1 : -1) * (1 + i * 0.5)}deg)` }}>
              <div className="photo">
                <Placeholder label={p.label} ratio="1/1" seed={p.id * 3} />
              </div>
              <div className="caption">{p.caption}</div>
              <div className="date">{p.date} · {p.loc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>now</h2>
          <span className="meta">/now page · inspired by nownownow.com</span>
        </div>
        <div className="card" style={{ fontFamily: "'EB Garamond', 'Noto Serif SC', serif", fontSize: 19, lineHeight: 1.65 }}>
          <p style={{ margin: 0 }}>
            <span style={{ color: 'var(--amber)' }}>·</span> 在写 NeurIPS submission (deadline 5月) <br/>
            <span style={{ color: 'var(--amber)' }}>·</span> 在读 <em>Gödel, Escher, Bach</em>（第三次）<br/>
            <span style={{ color: 'var(--amber)' }}>·</span> 在重学 Rust；写了一个 tiny toy renderer<br/>
            <span style={{ color: 'var(--amber)' }}>·</span> 刚从东京回来，下次想去 Porto
          </p>
          <p style={{ margin: '16px 0 0', fontSize: 12, color: 'var(--ink-3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
            last updated {window.ABOUT.tz} · 2026-04-18
          </p>
        </div>
      </section>
    </div>
  );
}

window.Home = Home;
