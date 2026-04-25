// ——— Tweaks panel ———

const { useState: useStateT, useEffect: useEffectT } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "amber",
  "density": 1,
  "baseSize": 15,
  "theme": "dark",
  "grain": true
}/*EDITMODE-END*/;

const ACCENTS = {
  amber:  { a: '0.78 0.13 70',  ad: '0.6 0.11 65',  si: '0.62 0.12 45' },
  sage:   { a: '0.78 0.09 145', ad: '0.6 0.08 140', si: '0.6 0.08 150' },
  rust:   { a: '0.68 0.15 40',  ad: '0.55 0.13 35', si: '0.5 0.14 30' },
  plum:   { a: '0.7 0.12 355',  ad: '0.55 0.11 350', si: '0.55 0.13 345' },
  cobalt: { a: '0.72 0.13 245', ad: '0.58 0.11 240', si: '0.55 0.13 250' },
};

function Tweaks({ values, setValues, visible, onClose }) {
  useEffectT(() => {
    const r = document.documentElement.style;
    const a = ACCENTS[values.accent] || ACCENTS.amber;
    r.setProperty('--amber', `oklch(${a.a})`);
    r.setProperty('--amber-dim', `oklch(${a.ad})`);
    r.setProperty('--sienna', `oklch(${a.si})`);
    r.setProperty('--density', values.density);
    r.setProperty('--base-size', values.baseSize + 'px');
    document.body.style.backgroundImage = values.grain
      ? `radial-gradient(ellipse at top, oklch(0.24 0.03 55 / 0.6), transparent 70%), url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.45 0 0 0 0 0.3 0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`
      : 'none';
    document.documentElement.dataset.theme = values.theme;
  }, [values]);

  if (!visible) return null;

  return (
    <div className="tweaks">
      <h4>·  TWEAKS ·  <button className="icon-btn" style={{ float: 'right', padding: '2px 6px', fontSize: 10 }} onClick={onClose}>×</button></h4>

      <div className="row">
        <label>accent</label>
        <div className="swatches">
          {Object.entries(ACCENTS).map(([k, v]) => (
            <div
              key={k}
              className={'sw ' + (values.accent === k ? 'active' : '')}
              style={{ background: `oklch(${v.a})` }}
              title={k}
              onClick={() => setValues({ ...values, accent: k })}
            />
          ))}
        </div>
      </div>

      <div className="row">
        <label>text size</label>
        <input type="range" min="13" max="18" step="1" value={values.baseSize} onChange={e => setValues({ ...values, baseSize: +e.target.value })} />
        <span style={{ color: 'var(--amber)', width: 28, textAlign: 'right' }}>{values.baseSize}</span>
      </div>

      <div className="row">
        <label>theme</label>
        <select value={values.theme} onChange={e => setValues({ ...values, theme: e.target.value })}>
          <option value="dark">dark (warm)</option>
          <option value="light">light (paper)</option>
        </select>
      </div>

      <div className="row">
        <label>paper grain</label>
        <input type="checkbox" checked={values.grain} onChange={e => setValues({ ...values, grain: e.target.checked })} />
      </div>

      <p style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 12, marginBottom: 0, letterSpacing: '0.06em', lineHeight: 1.5 }}>
        toggle the TWEAKS button in the toolbar to show/hide.
      </p>
    </div>
  );
}

Object.assign(window, { Tweaks, TWEAK_DEFAULTS });
