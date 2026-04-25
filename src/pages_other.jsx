// ——— Projects, Log, Map, About pages ———

const { useState: useStateO } = React;

function Projects({ goto }) {
  return (
    <div>
      <p className="page-sub">/projects · selected work</p>
      <h1 className="page-title">things <em>made</em></h1>
      <p style={{ color: 'var(--ink-2)', maxWidth: 600, fontFamily: "'EB Garamond', 'Noto Serif SC', serif", fontSize: 17, marginTop: 8 }}>
        Papers, side projects, rabbit holes. Some live on GitHub, some just in a notebook somewhere.
      </p>

      <div className="proj-list-v2" style={{ marginTop: 24 }}>
        {window.PROJECTS.map((p, i) => (
          <div key={i} className="proj-row-v2">
            <div className="idx">{p.idx}</div>
            <div>
              <div className="name-line">
                <span className="name">{p.name}</span>
                <span className={'status-pill s-' + p.status}>{p.status}</span>
              </div>
              <div className="desc">{p.desc}</div>
              <div className="meta-line">
                {p.collab && <span>· with {p.collab.join(', ')}</span>}
                {p.citations != null && <span>· cited {p.citations}</span>}
                {p.year && <span>· {p.year}</span>}
              </div>
              <div className="tags-line">
                {p.tags.map(t => <span key={t} className="tg">#{t}</span>)}
                {p.pdf && <a className="link-chip" href={p.pdf}>↓ pdf</a>}
                {p.github && <a className="link-chip" href={'https://' + p.github}>↗ code</a>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ color: 'var(--ink-3)', fontSize: 12, marginTop: 32, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
        — end of list · more in ~/archive (will be sorted one day)
      </p>
    </div>
  );
}

  // Remove old Log/MapPage; keep About here
function Log() { return null; }

function About() {
  const a = window.ABOUT;
  return (
    <div>
      <p className="page-sub">/about · hi</p>
      <h1 className="page-title"><em>hello,</em> I'm Gaojing</h1>

      <div className="about-grid">
        <div className="about-prose">
          <p>
            我是 <strong>Gaojing Zhang (张高靖)</strong>，在 Cambridge 读 ML 方向的 PhD。主要关心怎么让模型在
            <em> 信号稀缺 </em>的情况下学得更好——diffusion、RL、self-supervised 的交叉地带。
          </p>
          <p>
            生活里是另一个人：用胶片拍一些没用的瞬间、手冲咖啡、写一点自己的小工具。
            这个网站是我的第二个大脑——研究笔记、日常随想、阅读记录，都往这里堆。
          </p>
          <p style={{ color: 'var(--ink-3)', fontSize: 14, fontStyle: 'italic' }}>
            (site is hand-rolled, no trackers, ~12kb gzipped. deployed on a $5 droplet.)
          </p>
          <p>
            如果你看到的东西让你想起什么——
            <a href={'mailto:' + a.email}>写信给我</a>。我回信很慢但一定会回。
          </p>
        </div>
        <div>
          <div className="card">
            <h4 style={{ margin: '0 0 12px', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>~$ whoami</h4>
            <dl className="kv-list">
              <dt>name</dt>     <dd>{a.name} · <span className="cn-sans">{a.cn}</span></dd>
              <dt>role</dt>     <dd>{a.role}</dd>
              <dt>where</dt>    <dd>{a.where}</dd>
              <dt>tz</dt>       <dd>{a.tz}</dd>
              <dt>email</dt>    <dd><a href={'mailto:' + a.email}>{a.email}</a></dd>
              <dt>github</dt>   <dd><a href="#">{a.github}</a></dd>
              <dt>scholar</dt>  <dd><a href="#">{a.scholar}</a></dd>
              <dt>rss</dt>      <dd><a href="#">{a.rss}</a></dd>
              <dt>pgp</dt>      <dd><code style={{ fontSize: 12 }}>{a.pgp}</code></dd>
              <dt>status</dt>   <dd style={{ color: 'var(--amber)' }}>{a.status}</dd>
            </dl>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h4 style={{ margin: '0 0 10px', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>— colophon</h4>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
              Type: <strong>EB Garamond</strong> & <strong>JetBrains Mono</strong>.<br/>
              Handwriting: <span className="hand" style={{ fontSize: 18 }}>Caveat</span>.<br/>
              Colors: warm-dark, hand-picked in OKLCH.<br/>
              Stack: just HTML + React + CSS. No build.<br/>
              Host: a tiny Linux box somewhere in Frankfurt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Projects, About });
