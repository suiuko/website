// ——— Daily: music / films / cooking / coffee / games ———

const { useState: useStateD } = React;

function Daily() {
  const [tab, setTab] = useStateD('music');
  const TABS = [
    { k: 'music',   label: 'music',   cn: '音乐' },
    { k: 'films',   label: 'films',   cn: '电影' },
    { k: 'cooking', label: 'cooking', cn: '做饭' },
    { k: 'coffee',  label: 'coffee',  cn: '咖啡' },
    { k: 'games',   label: 'games',   cn: '游戏' },
  ];

  return (
    <div>
      <p className="page-sub">/daily · 日常</p>
      <h1 className="page-title">the <em>daily</em> log</h1>
      <p style={{ color: 'var(--ink-2)', maxWidth: 620, fontFamily: "'EB Garamond', 'Noto Serif SC', serif", fontSize: 17, marginTop: 8 }}>
        What went in this year through my eyes, ears, and occasionally the kitchen.
      </p>

      <div className="log-tabs" style={{ marginTop: 24 }}>
        {TABS.map(t => (
          <button key={t.k} className={'log-tab ' + (tab === t.k ? 'active' : '')} onClick={() => setTab(t.k)}>
            / {t.label} <span style={{ color: 'var(--ink-3)', marginLeft: 6, fontSize: 10 }}>{t.cn}</span>
          </button>
        ))}
      </div>

      {tab === 'music'   && <MusicTab />}
      {tab === 'films'   && <FilmsTab />}
      {tab === 'cooking' && <CookingTab />}
      {tab === 'coffee'  && <CoffeeTab />}
      {tab === 'games'   && <GamesTab />}
    </div>
  );
}

function MusicTab() {
  const { playlists, albums } = window.DAILY.music;
  const [active, setActive] = useStateD(playlists[0]);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 32, alignItems: 'start' }}>
        <div>
          <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 22, fontWeight: 500, margin: '0 0 14px' }}>歌单 · playlists</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {playlists.map(pl => (
              <div
                key={pl.id}
                className={'playlist-card ' + (active.id === pl.id ? 'active' : '')}
                onClick={() => setActive(pl)}
              >
                <div className="cover" style={{ background: `linear-gradient(135deg, oklch(0.45 0.1 ${pl.hue}), oklch(0.3 0.08 ${pl.hue + 20}))` }}>
                  <div className="vinyl-rings" />
                  <div className="cover-label">{pl.title}</div>
                </div>
                <div className="pl-meta">
                  <div className="pl-title">{pl.title}</div>
                  <div className="pl-desc">{pl.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 22, fontWeight: 500, margin: '28px 0 14px' }}>on heavy rotation</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {albums.map((al, i) => (
              <div key={i} className="album-mini">
                <div className="cover" style={{ background: `linear-gradient(135deg, oklch(0.45 0.1 ${al.hue}), oklch(0.28 0.08 ${al.hue + 30}))` }}>
                  <div className="vinyl-rings" />
                </div>
                <div className="t">{al.t}</div>
                <div className="a">{al.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'sticky', top: 100 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
            ♪ now playing · 网易云
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 22, fontWeight: 500, marginBottom: 4 }}>{active.title}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 14 }}>{active.desc}</div>
            <iframe
              title={active.title}
              frameBorder="no"
              marginWidth="0"
              marginHeight="0"
              width="100%"
              height="430"
              src={`https://music.163.com/outchain/player?type=0&id=${active.id}&auto=0&height=430`}
              style={{ border: '1px solid var(--rule)', background: 'var(--bg-2)', borderRadius: 2 }}
            />
            <p style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
              iframe via music.163.com/outchain · replace the id with your own playlist id
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilmsTab() {
  const { watched, wishlist } = window.DAILY.films;
  return (
    <div>
      <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 22, fontWeight: 500, margin: '0 0 14px' }}>recently watched</h3>
      <div className="log-grid">
        {watched.map((it, i) => (
          <div key={i} className="log-item films">
            <div className="cover">
              <div>
                <div className="t">{it.t}</div>
                <div className="a">{it.a}</div>
              </div>
            </div>
            <div className="meta">
              <span className="rating">{it.rating}</span>
              <span>{it.when}</span>
            </div>
            {it.note && <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 6, fontFamily: "'EB Garamond', serif", fontStyle: 'italic' }}>"{it.note}"</div>}
          </div>
        ))}
      </div>

      <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 22, fontWeight: 500, margin: '36px 0 14px' }}>wishlist</h3>
      <div style={{ display: 'grid', gap: 1, background: 'var(--rule)', border: '1px solid var(--rule)' }}>
        {wishlist.map((w, i) => (
          <div key={i} style={{ background: 'var(--bg-2)', padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 19 }}>{w.t}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em', marginTop: 2 }}>{w.a}</div>
            </div>
            <span className="chip" style={{ cursor: 'default' }}>○ {w.when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CookingTab() {
  const items = window.DAILY.cooking;
  const cuisines = ['全部', ...new Set(items.map(i => i.cuisine))];
  const [fil, setFil] = useStateD('全部');
  const vis = fil === '全部' ? items : items.filter(i => i.cuisine === fil);
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        <span className="filter-label" style={{ alignSelf: 'center' }}>菜系:</span>
        {cuisines.map(c => (
          <button key={c} className={'chip ' + (fil === c ? 'active' : '')} onClick={() => setFil(c)}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
        {vis.map((d, i) => (
          <div key={i} className="dish-card">
            <div className="dish-photo" style={{ background: `linear-gradient(135deg, oklch(0.48 0.1 ${d.hue}), oklch(0.32 0.08 ${d.hue - 10}))` }}>
              <div className="stripes" />
              <div className="dish-label">DISH · {d.cuisine}</div>
              <div className="dish-diff">
                {Array.from({ length: 5 }, (_, j) => <span key={j} className={j < d.diff ? 'on' : 'off'}>●</span>)}
              </div>
            </div>
            <div style={{ padding: '10px 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div className="serif" style={{ fontSize: 20 }}>{d.name}</div>
                <div style={{ color: 'var(--amber)', fontSize: 11 }}>{d.rating}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4, letterSpacing: '0.06em' }}>
                {d.time} · {d.date}
              </div>
              {d.story && <div style={{ fontSize: 12, color: 'var(--ink-2)', fontStyle: 'italic', fontFamily: "'EB Garamond', serif", marginTop: 8, lineHeight: 1.5 }}>"{d.story}"</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoffeeTab() {
  return (
    <div>
      <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 22, fontWeight: 500, margin: '0 0 14px' }}>the bean journal</h3>
      <div style={{ display: 'grid', gap: 12 }}>
        {window.DAILY.coffee.map((c, i) => (
          <div key={i} className="card" style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px', gap: 20, alignItems: 'center', padding: '16px 20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: `radial-gradient(circle at 30% 30%, oklch(0.55 0.1 40), oklch(0.25 0.06 35))`, border: '1px solid var(--rule)' }} />
            <div>
              <div className="serif" style={{ fontSize: 22 }}>{c.name}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', fontStyle: 'italic', fontFamily: "'EB Garamond', serif", marginTop: 4 }}>"{c.note}"</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em', textAlign: 'right', textTransform: 'uppercase' }}>{c.when}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GamesTab() {
  return (
    <div>
      <div style={{ display: 'grid', gap: 12 }}>
        {window.DAILY.games.map((g, i) => (
          <div key={i} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 20, alignItems: 'center', padding: '16px 20px' }}>
            <div className="serif" style={{ fontSize: 22 }}>{g.name}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: "'JetBrains Mono', monospace" }}>{g.hours}h</div>
            <div style={{ color: 'var(--amber)', fontSize: 12 }}>{g.rating}</div>
            {g.note && <div style={{ gridColumn: '1 / -1', fontSize: 13, color: 'var(--ink-2)', fontStyle: 'italic', fontFamily: "'EB Garamond', serif" }}>"{g.note}"</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Daily });
