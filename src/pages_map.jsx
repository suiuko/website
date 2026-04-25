// ——— Map: airline-route + fog-of-war ———
// Abstract stylized continent shapes (not cartographic — "airport departure board" feel)

const { useState: useStateM, useEffect: useEffectM } = React;

// Airport-style city nodes, plotted in an equirectangular-ish abstract canvas (1000x500)
// Coordinates are visual positions, not real lon/lat math
const CITIES = [
  { code: 'NRT', city: 'Tokyo',     country: 'JP', x: 882, y: 195, visited: true, albumId: 'tokyo-2026-04' },
  { code: 'XIY', city: 'Xi\'an',    country: 'CN', x: 805, y: 210, visited: true, albumId: 'xian-2026-03' },
  { code: 'PVG', city: 'Shanghai',  country: 'CN', x: 835, y: 218, visited: true },
  { code: 'ICN', city: 'Seoul',     country: 'KR', x: 855, y: 200, visited: true },
  { code: 'BKK', city: 'Bangkok',   country: 'TH', x: 790, y: 275, visited: true },
  { code: 'SIN', city: 'Singapore', country: 'SG', x: 810, y: 305, visited: true },
  { code: 'LIS', city: 'Lisbon',    country: 'PT', x: 440, y: 200, visited: true, albumId: 'lisbon-2025-10' },
  { code: 'KEF', city: 'Reykjavik', country: 'IS', x: 475, y: 118, visited: true, albumId: 'reykjavik-2025-08' },
  { code: 'LHR', city: 'London',    country: 'GB', x: 500, y: 170, visited: true, albumId: 'cambridge-home' },
  { code: 'CDG', city: 'Paris',     country: 'FR', x: 515, y: 180, visited: true },
  { code: 'FRA', city: 'Frankfurt', country: 'DE', x: 540, y: 172, visited: true },
  { code: 'FCO', city: 'Rome',      country: 'IT', x: 550, y: 210, visited: true },
  { code: 'BCN', city: 'Barcelona', country: 'ES', x: 505, y: 210, visited: true },
  { code: 'AMS', city: 'Amsterdam', country: 'NL', x: 530, y: 165, visited: true },
  { code: 'JFK', city: 'New York',  country: 'US', x: 250, y: 210, visited: true },
  { code: 'SFO', city: 'S.F.',      country: 'US', x: 100, y: 215, visited: true },
  // unvisited (still drawn dim)
  { code: 'SYD', city: 'Sydney',    country: 'AU', x: 900, y: 400, visited: false },
  { code: 'GRU', city: 'São Paulo', country: 'BR', x: 320, y: 370, visited: false },
  { code: 'CPT', city: 'Cape Town', country: 'ZA', x: 555, y: 400, visited: false },
  { code: 'DXB', city: 'Dubai',     country: 'AE', x: 635, y: 245, visited: false },
];

// Routes actually flown (connects visited cities)
const ROUTES = [
  ['LHR', 'NRT'], ['LHR', 'XIY'], ['LHR', 'LIS'], ['LHR', 'KEF'],
  ['LHR', 'CDG'], ['LHR', 'FRA'], ['LHR', 'FCO'], ['LHR', 'BCN'], ['LHR', 'AMS'],
  ['LHR', 'JFK'], ['JFK', 'SFO'], ['NRT', 'ICN'], ['NRT', 'BKK'], ['BKK', 'SIN'],
  ['PVG', 'NRT'], ['PVG', 'XIY'],
];

function greatArcPath(c1, c2) {
  // simple quadratic curve bulging up to suggest an arc
  const mx = (c1.x + c2.x) / 2;
  const my = (c1.y + c2.y) / 2 - Math.min(60, Math.abs(c2.x - c1.x) * 0.18);
  return `M${c1.x},${c1.y} Q${mx},${my} ${c2.x},${c2.y}`;
}

// Abstract continent silhouettes (hand-authored paths, stylized — not cartographic)
const CONTINENTS = [
  // North America
  'M80,100 Q130,80 200,95 Q260,110 280,160 Q300,220 260,260 Q220,280 180,270 Q120,260 90,220 Q60,180 70,140 Q75,115 80,100 Z',
  // South America
  'M260,300 Q300,290 330,340 Q340,400 310,440 Q290,470 270,450 Q250,400 255,350 Q258,320 260,300 Z',
  // Europe
  'M460,140 Q520,130 570,150 Q580,190 560,220 Q520,235 480,225 Q450,210 455,175 Q457,155 460,140 Z',
  // Africa
  'M490,230 Q550,230 580,280 Q600,340 570,400 Q540,420 510,400 Q480,360 485,310 Q488,270 490,230 Z',
  // Asia
  'M580,110 Q700,95 820,115 Q880,140 900,190 Q910,240 870,270 Q780,295 700,280 Q620,260 580,220 Q560,170 580,110 Z',
  // Southeast Asia / Indonesia
  'M790,295 Q840,290 860,320 Q850,350 810,340 Q780,330 790,295 Z',
  // Australia
  'M850,370 Q920,370 945,405 Q945,435 910,445 Q860,445 840,420 Q835,390 850,370 Z',
  // Greenland
  'M380,90 Q420,85 445,110 Q450,140 420,150 Q390,145 375,120 Q372,100 380,90 Z',
];

// Country silhouettes that should be FILLED when visited (we approximate a country as a point-cloud of its cities)
// For the fog-of-war effect we pulse a glow around visited nodes.

function MapPage({ goto }) {
  const [hovered, setHovered] = useStateM(null);
  const [selected, setSelected] = useStateM(null);
  const [view, setView] = useStateM('hybrid'); // 'hybrid' | 'routes' | 'fog'

  const byCode = Object.fromEntries(CITIES.map(c => [c.code, c]));
  const visitedCountries = new Set(window.COUNTRIES_VISITED);
  const stats = {
    countries: visitedCountries.size,
    cities: CITIES.filter(c => c.visited).length,
    routes: ROUTES.length,
    distance: Math.round(ROUTES.length * 5800),
  };

  const selectedCity = selected ? byCode[selected] : null;
  const relatedAlbum = selectedCity && selectedCity.albumId
    ? window.ALBUMS.find(a => a.id === selectedCity.albumId) : null;

  return (
    <div>
      <p className="page-sub">/map · {stats.countries} countries unlocked · {stats.cities} cities</p>
      <h1 className="page-title">the <em>route map</em></h1>
      <p style={{ color: 'var(--ink-2)', maxWidth: 620, fontFamily: "'EB Garamond', 'Noto Serif SC', serif", fontSize: 17, marginTop: 8 }}>
        Everywhere I've been. Dots lit where I've set foot, arcs traced where I've flown — the rest still under fog.
      </p>

      {/* stats strip — airport departure-board feel */}
      <div className="flight-stats">
        <div><div className="n">{stats.countries}</div><div className="l">countries</div></div>
        <div><div className="n">{stats.cities}</div><div className="l">cities</div></div>
        <div><div className="n">{stats.routes}</div><div className="l">routes</div></div>
        <div><div className="n">{stats.distance.toLocaleString()}<span style={{ fontSize: '0.4em' }}> km</span></div><div className="l">approx. flown</div></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignSelf: 'center' }}>
          <button className={'chip ' + (view === 'hybrid' ? 'active' : '')} onClick={() => setView('hybrid')}>hybrid</button>
          <button className={'chip ' + (view === 'routes' ? 'active' : '')} onClick={() => setView('routes')}>routes only</button>
          <button className={'chip ' + (view === 'fog' ? 'active' : '')} onClick={() => setView('fog')}>fog of war</button>
        </div>
      </div>

      <div className="map-wrap">
        <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" className="world-svg">
          <defs>
            <radialGradient id="fogGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.35" />
              <stop offset="60%" stopColor="var(--amber)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--amber)" stopOpacity="0" />
            </radialGradient>
            <pattern id="dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="var(--rule)" opacity="0.5" />
            </pattern>
            <pattern id="gridlines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0 L0 0 0 40" fill="none" stroke="var(--rule-2)" strokeWidth="0.3" opacity="0.5" />
            </pattern>
          </defs>

          {/* grid background */}
          <rect width="1000" height="500" fill="url(#gridlines)" />

          {/* continents - dotted when fog is high, filled when visited */}
          <g className="continents">
            {CONTINENTS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill={view === 'routes' ? 'transparent' : 'url(#dots)'}
                stroke="var(--rule)"
                strokeWidth="0.5"
                opacity="0.85"
              />
            ))}
          </g>

          {/* fog-of-war glows around visited cities */}
          {view !== 'routes' && CITIES.filter(c => c.visited).map(c => (
            <circle key={'g' + c.code} cx={c.x} cy={c.y} r="55" fill="url(#fogGlow)" />
          ))}

          {/* routes */}
          {view !== 'fog' && ROUTES.map(([a, b], i) => {
            const c1 = byCode[a], c2 = byCode[b];
            if (!c1 || !c2) return null;
            const isHovered = hovered && (hovered === a || hovered === b);
            return (
              <path
                key={i}
                d={greatArcPath(c1, c2)}
                fill="none"
                stroke="var(--amber)"
                strokeWidth={isHovered ? 1.5 : 0.7}
                strokeOpacity={isHovered ? 1 : 0.55}
                strokeDasharray="3 3"
                className="route-arc"
              />
            );
          })}

          {/* city nodes */}
          {CITIES.map(c => {
            const isSel = selected === c.code;
            const isHov = hovered === c.code;
            return (
              <g
                key={c.code}
                className={'city ' + (c.visited ? 'visited' : 'unvisited') + (isSel ? ' selected' : '')}
                onMouseEnter={() => setHovered(c.code)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(selected === c.code ? null : c.code)}
                style={{ cursor: 'pointer' }}
              >
                {c.visited && (
                  <>
                    <circle cx={c.x} cy={c.y} r={isSel ? 10 : 6} fill="var(--amber)" opacity="0.25" />
                    <circle cx={c.x} cy={c.y} r="3" fill="var(--amber)" stroke="var(--bg)" strokeWidth="1" />
                  </>
                )}
                {!c.visited && (
                  <circle cx={c.x} cy={c.y} r="2.5" fill="none" stroke="var(--ink-3)" strokeWidth="0.8" strokeDasharray="1 1.5" />
                )}
                {(isHov || isSel || c.visited) && (
                  <text
                    x={c.x + 7}
                    y={c.y - 6}
                    fontSize={isSel ? 11 : 9}
                    fontFamily="'JetBrains Mono', monospace"
                    fill={c.visited ? 'var(--ink)' : 'var(--ink-3)'}
                    letterSpacing="0.12em"
                    fontWeight={isSel ? 600 : 400}
                  >
                    {c.code}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* selected city panel */}
      {selectedCity && (
        <div className="city-panel">
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--amber)', letterSpacing: '0.2em', marginBottom: 4 }}>
              {selectedCity.code} · {selectedCity.visited ? 'VISITED' : 'WISHLIST'}
            </div>
            <h3 className="serif" style={{ fontSize: 38, margin: 0, lineHeight: 1 }}>{selectedCity.city}</h3>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {selectedCity.country}
            </div>
            {relatedAlbum ? (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontFamily: "'EB Garamond', 'Noto Serif SC', serif", fontSize: 16, fontStyle: 'italic', color: 'var(--ink-2)', lineHeight: 1.55, margin: '0 0 14px' }}>
                  "{relatedAlbum.story}"
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                  {relatedAlbum.frames.slice(0, 4).map((f, i) => (
                    <div key={i} style={{ width: 74, height: 74, border: '1px solid var(--rule)' }}>
                      <Placeholder label="" ratio="1/1" seed={relatedAlbum.coverSeed * 10 + i} />
                    </div>
                  ))}
                </div>
                <button className="chip active" onClick={() => goto('photos', relatedAlbum.id)}>open album →</button>
              </div>
            ) : (
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: 'var(--ink-3)', fontStyle: 'italic', marginTop: 18 }}>
                {selectedCity.visited ? 'album coming soon.' : 'still on the list.'}
              </p>
            )}
          </div>
          <button className="icon-btn" style={{ alignSelf: 'start' }} onClick={() => setSelected(null)}>close ×</button>
        </div>
      )}

      <p style={{ color: 'var(--ink-3)', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginTop: 14 }}>
        tip · click a dot to open the city card · map is stylized, not cartographic
      </p>
    </div>
  );
}

window.MapPage = MapPage;
