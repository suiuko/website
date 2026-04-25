// ——— Darkroom: 3-level — MONTH → CITY → FRAMES ———

const { useState: useStateP, useEffect: useEffectP } = React;

function scatter(n, seed) {
  const arr = [];
  const cols = 4, gapX = 24, gapY = 40, w = 210, h = 280;
  const rand = (i) => { const s = Math.sin((i + 1) * seed * 12.9898) * 43758.5453; return s - Math.floor(s); };
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols), col = i % cols;
    arr.push({
      left: col * (w + gapX) + (rand(i) - 0.5) * 30,
      top: row * (h + gapY) + (rand(i * 2) - 0.5) * 30,
      rot: (rand(i * 3) - 0.5) * 16,
      z: Math.floor(rand(i * 5) * 10),
    });
  }
  return arr;
}

// L1: months index
function DarkroomIndex({ goto }) {
  const months = window.MONTHS;
  const totalCities = months.reduce((s, m) => s + m.cities.length, 0);
  const totalFrames = months.reduce((s, m) => s + m.cities.reduce((ss, c) => ss + c.frameCount, 0), 0);

  return (
    <div>
      <p className="page-sub">/darkroom · {months.length} months · {totalCities} albums · {totalFrames} frames</p>
      <h1 className="page-title">the <em>darkroom</em></h1>
      <p style={{ color: 'var(--ink-2)', maxWidth: 620, fontFamily: "'EB Garamond', 'Noto Serif SC', serif", fontSize: 17, marginTop: 8 }}>
        Organized by month — each pile is a stretch of weeks, each frame a place.&nbsp;
        <span className="hand" style={{ fontSize: 22, color: 'var(--amber)' }}>click a month →</span>
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 56, marginTop: 40 }}>
        {months.map((m, i) => (
          <div key={m.id} className="month-row" onClick={() => goto('photos', m.id)}>
            <div className="month-meta">
              <div className="month-label">{m.label}</div>
              <div className="month-month-mono">{m.month}</div>
              <div className="month-blurb">{m.blurb}</div>
              <div className="month-stats">
                {m.cities.length} {m.cities.length === 1 ? 'city' : 'cities'}
                &nbsp;·&nbsp;
                {m.cities.reduce((s, c) => s + c.frameCount, 0)} frames
              </div>
              <div className="month-cta hand">open →</div>
            </div>

            <div className="month-stack">
              {m.cities.slice(0, 4).map((c, ci) => (
                <div
                  key={c.id}
                  className="polaroid-mini month-poly"
                  style={{
                    transform: `rotate(${(ci - (m.cities.length - 1) / 2) * 7 + (i % 2 ? 1 : -1)}deg)`,
                    marginLeft: ci === 0 ? 0 : -38,
                    zIndex: 10 - ci,
                  }}
                >
                  <div className="photo"><Placeholder label={c.frames[0]?.meta || c.title} ratio="1/1" seed={c.coverSeed * 7} /></div>
                  <div className="caption">{c.title}</div>
                  <div className="date">{c.when}</div>
                </div>
              ))}
              {m.cities.length > 4 && (
                <div className="month-more">+{m.cities.length - 4}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// L2: month detail — shows all cities in the month as album cards
function MonthDetail({ monthId, goto }) {
  const month = window.MONTHS.find(m => m.id === monthId);
  if (!month) return <div>month not found · <a href="#" onClick={e => { e.preventDefault(); goto('photos'); }}>← back</a></div>;

  return (
    <div>
      <p className="page-sub">
        <a href="#" onClick={e => { e.preventDefault(); goto('photos'); }}>← /darkroom</a>
        &nbsp;·&nbsp; {month.month} &nbsp;·&nbsp; {month.cities.length} {month.cities.length === 1 ? 'city' : 'cities'}
      </p>
      <h1 className="page-title">{month.label}</h1>
      <p style={{ color: 'var(--ink-2)', maxWidth: 620, fontFamily: "'EB Garamond', 'Noto Serif SC', serif", fontSize: 17, marginTop: 8 }}>
        {month.blurb}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 28, marginTop: 32 }}>
        {month.cities.map((c, i) => (
          <div key={c.id} className="album-card" onClick={() => goto('photos', monthId + '/' + c.id)}>
            <div className="album-stack">
              <div className="polaroid-mini p3" style={{ transform: `rotate(${-6 + i}deg)` }}>
                <div className="photo"><Placeholder label={c.frames[2]?.meta || ''} ratio="1/1" seed={c.coverSeed * 3 + 2} /></div>
              </div>
              <div className="polaroid-mini p2" style={{ transform: `rotate(${3 - i * 0.3}deg)` }}>
                <div className="photo"><Placeholder label={c.frames[1]?.meta || ''} ratio="1/1" seed={c.coverSeed * 3 + 1} /></div>
              </div>
              <div className="polaroid-mini p1" style={{ transform: `rotate(${-1 + i * 0.2}deg)` }}>
                <div className="photo"><Placeholder label={c.frames[0]?.meta || ''} ratio="1/1" seed={c.coverSeed * 3} /></div>
                <div className="caption">{c.frames[0]?.cap || ''}</div>
                <div className="date">{c.when}</div>
              </div>
            </div>
            <div className="album-meta">
              <div className="album-title">
                {c.title}
                <span className="album-sub">{c.sub}</span>
              </div>
              <div className="album-stats">
                <span>{c.when}</span>
                <span>·</span>
                <span>{c.frameCount} frames</span>
                <span>·</span>
                <span>{c.countryName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// L3: city detail — the existing album view (photos scattered on board + lightbox)
function AlbumDetail({ albumId, goto }) {
  // albumId is "monthId/cityId" OR a legacy plain cityId
  let monthId = null, cityId = albumId;
  if (albumId && albumId.includes('/')) [monthId, cityId] = albumId.split('/');

  let album, parentMonth;
  if (monthId) {
    parentMonth = window.MONTHS.find(m => m.id === monthId);
    album = parentMonth?.cities.find(c => c.id === cityId);
  } else {
    // legacy: search across all months
    for (const m of window.MONTHS) {
      const c = m.cities.find(c => c.id === cityId);
      if (c) { album = c; parentMonth = m; monthId = m.id; break; }
    }
  }

  const [lightbox, setLightbox] = useStateP(null);
  const [lightboxIdx, setLightboxIdx] = useStateP(0);

  useEffectP(() => {
    const onKey = e => {
      if (e.key === 'Escape') setLightbox(null);
      if (!album) return;
      if (e.key === 'ArrowLeft' && lightbox) { const ni = (lightboxIdx - 1 + album.frames.length) % album.frames.length; setLightboxIdx(ni); setLightbox(album.frames[ni]); }
      if (e.key === 'ArrowRight' && lightbox) { const ni = (lightboxIdx + 1) % album.frames.length; setLightboxIdx(ni); setLightbox(album.frames[ni]); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, lightboxIdx, album]);

  if (!album) return <div>album not found · <a href="#" onClick={e => { e.preventDefault(); goto('photos'); }}>← back</a></div>;

  const positions = scatter(album.frames.length, album.coverSeed);

  return (
    <div>
      <p className="page-sub">
        <a href="#" onClick={e => { e.preventDefault(); goto('photos'); }}>/darkroom</a>
        &nbsp;/&nbsp;
        <a href="#" onClick={e => { e.preventDefault(); goto('photos', monthId); }}>{parentMonth?.label || monthId}</a>
        &nbsp;·&nbsp; {album.countryName} &nbsp;·&nbsp; {album.lat.toFixed(2)}°, {album.lon.toFixed(2)}°
      </p>
      <h1 className="page-title">{album.title} <em style={{ fontFamily: "'Noto Serif SC', 'EB Garamond', serif" }}>·</em> <span style={{ fontFamily: "'Noto Serif SC', 'EB Garamond', serif", color: 'var(--ink-2)' }}>{album.sub}</span></h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 24, alignItems: 'start' }}>
        <p className="hand" style={{ fontSize: 28, lineHeight: 1.4, color: 'var(--ink)', margin: 0 }}>
          "{album.story}"
        </p>
        <div className="card" style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 16px' }}>
            <span style={{ color: 'var(--ink-3)' }}>trip</span><span>{album.title} {album.when}</span>
            <span style={{ color: 'var(--ink-3)' }}>frames</span><span>{album.frames.length} shown / {album.frameCount} on roll</span>
            <span style={{ color: 'var(--ink-3)' }}>gps</span><span>{album.lat.toFixed(4)}, {album.lon.toFixed(4)}</span>
            <span style={{ color: 'var(--ink-3)' }}>cameras</span><span>{[...new Set(album.frames.map(f => f.meta.split(' · ')[0]))].join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="photo-board" style={{ marginTop: 32, minHeight: Math.ceil(album.frames.length / 4) * 320 + 80 }}>
        {album.frames.map((f, i) => (
          <div
            key={i}
            className="polaroid"
            style={{
              left: positions[i].left,
              top: positions[i].top,
              transform: `rotate(${positions[i].rot}deg)`,
              zIndex: positions[i].z,
            }}
            onClick={() => { setLightbox(f); setLightboxIdx(i); }}
          >
            {i % 3 === 0 && <div className="tape" />}
            <div className="photo"><Placeholder label={f.meta} ratio="1/1" seed={album.coverSeed * 10 + i} /></div>
            <div className="caption">{f.cap}</div>
            <div className="date">{album.when}.{f.date.split('.')[1] || '01'}</div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="lightbox-bg" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <div className="polaroid">
              <div className="photo" style={{ aspectRatio: '3/4' }}>
                <Placeholder label={lightbox.meta} ratio="3/4" seed={album.coverSeed * 10 + lightboxIdx} />
              </div>
              <div className="caption">{lightbox.cap}</div>
              <div className="date">{album.when}.{lightbox.date.split('.')[1] || '01'} · {album.title}</div>
            </div>
            <div className="meta-strip">
              <span>{lightbox.meta}</span>
              <span>{lightboxIdx + 1} / {album.frames.length} · esc to close · ← →</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { DarkroomIndex, MonthDetail, AlbumDetail });
