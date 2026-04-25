// ——— App shell ———

const { useState: useStateA, useEffect: useEffectA } = React;

function useHashRoute() {
  const parse = () => {
    const h = (window.location.hash || '#/').replace(/^#\/?/, '');
    const parts = h.split('/').filter(Boolean);
    return { page: parts[0] || 'home', arg: parts.slice(1).join('/') || null };
  };
  const [route, setRoute] = useStateA(parse);
  useEffectA(() => {
    const on = () => setRoute(parse());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const goto = (page, arg) => {
    window.location.hash = '#/' + page + (arg ? '/' + arg : '');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  return [route, goto];
}

const NAV_ITEMS = [
  { k: 'home',     label: 'home' },
  { k: 'notes',    label: 'notes' },
  { k: 'photos',   label: 'darkroom' },
  { k: 'projects', label: 'projects' },
  { k: 'daily',    label: 'daily' },
  { k: 'map',      label: 'map' },
  { k: 'about',    label: 'about' },
];

function App() {
  const [route, goto] = useHashRoute();
  const [selectedTag, setSelectedTag] = useStateA(null);
  const [query, setQuery] = useStateA('');
  const [tweakValues, setTweakValues] = useStateA(window.TWEAK_DEFAULTS);
  const [tweaksVisible, setTweaksVisible] = useStateA(false);
  const [visits, setVisits] = useStateA(() => {
    const v = +(localStorage.getItem('visits') || 0) + 1;
    localStorage.setItem('visits', v);
    return v;
  });

  // Edit-mode protocol for host toolbar
  useEffectA(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setTweaksVisible(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffectA(() => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: tweakValues }, '*');
  }, [tweakValues]);

  // Keyboard shortcut: `/` to focus search on notes
  useEffectA(() => {
    const on = (e) => {
      if (e.key === '/' && route.page === 'notes' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        const inp = document.querySelector('.search-wrap input');
        if (inp) inp.focus();
      }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [route]);

  let page = null;
  const curLabel = {
    home:     '~/',
    notes:    '~/notes/',
    photos:   '~/darkroom/',
    projects: '~/projects/',
    daily:    '~/daily/',
    map:      '~/map/',
    about:    '~/about.md',
  }[route.page] || '~/';

  if (route.page === 'home') page = <Home goto={goto} />;
  else if (route.page === 'notes' && route.arg) page = <NoteDetail id={route.arg} goto={goto} />;
  else if (route.page === 'notes') page = <NotesIndex goto={goto} selectedTag={selectedTag} setSelectedTag={setSelectedTag} query={query} setQuery={setQuery} />;
  else if (route.page === 'photos' && route.arg && route.arg.includes('/')) page = <AlbumDetail albumId={route.arg} goto={goto} />;
  else if (route.page === 'photos' && route.arg) page = <MonthDetail monthId={route.arg} goto={goto} />;
  else if (route.page === 'photos') page = <DarkroomIndex goto={goto} />;
  else if (route.page === 'projects') page = <Projects goto={goto} />;
  else if (route.page === 'daily') page = <Daily />;
  else if (route.page === 'map') page = <MapPage goto={goto} />;
  else if (route.page === 'about') page = <About />;
  else page = <Home goto={goto} />;

  return (
    <div className="app" data-screen-label={'01 ' + route.page}>
      <header className="topbar">
        <div className="traffic"><span/><span/><span/></div>
        <div className="prompt">
          <span className="user">gaojing</span>
          <span className="at">@</span>
          <span className="host">gaojing.sh</span>
          <span className="path">:{curLabel}</span>
          <span className="caret">$</span>
          <span className="cmd" style={{ marginLeft: 2 }}>ls</span>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map((n, i) => (
            <React.Fragment key={n.k}>
              {i > 0 && <span className="slash">/</span>}
              <a
                href={'#/' + n.k}
                className={route.page === n.k ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); goto(n.k); }}
              >{n.label}</a>
            </React.Fragment>
          ))}
        </nav>
        <div className="topbar-right">
          <button className="icon-btn" onClick={() => setTweakValues({ ...tweakValues, theme: tweakValues.theme === 'dark' ? 'light' : 'dark' })} title="toggle theme">
            {tweakValues.theme === 'dark' ? '☾' : '☀'}
          </button>
          <button className="icon-btn" onClick={() => setTweaksVisible(v => !v)}>tweaks</button>
        </div>
      </header>

      <main style={{ marginTop: 32 }}>
        {page}
      </main>

      <footer className="footer">
        <div>
          ©  2026 Gaojing Zhang · hand-rolled · <a href="#">rss</a> · <a href="#">source</a>
        </div>
        <div className="stats">
          <span><span className="pulse">●</span> online</span>
          <span>visits: {visits.toLocaleString()}</span>
          <span>build: {new Date().toISOString().slice(0, 10)} · commit a7f2c01</span>
        </div>
      </footer>

      <Tweaks values={tweakValues} setValues={setTweakValues} visible={tweaksVisible} onClose={() => setTweaksVisible(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
