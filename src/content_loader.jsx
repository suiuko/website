// ——— Content loader: reads Markdown files with front-matter ———
//
// HOW IT WORKS (deployment):
//   1. Write your content as .md files inside /content/{notes,albums,projects}/
//   2. Each file starts with YAML-ish front-matter between --- markers:
//        ---
//        title: My note
//        date: 2026-04-18
//        tags: [ml, thinking]
//        ---
//        body markdown here...
//   3. A small manifest lists which files exist: /content/manifest.json
//        { "notes": ["diffusion-intuition.md", ...], "albums": [...], "projects": [...] }
//   4. This loader fetches manifest → fetches each file → parses → merges into window.NOTES / ALBUMS / PROJECTS.
//
// If /content/manifest.json is not present (local dev), the site uses the built-in example data from data.jsx.

const { useState: useStateC, useEffect: useEffectC } = React;

function parseFrontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  m[1].split('\n').forEach(line => {
    const mm = line.match(/^([\w-]+):\s*(.*)$/);
    if (!mm) return;
    let [, k, v] = mm;
    v = v.trim();
    if (v.startsWith('[') && v.endsWith(']')) {
      v = v.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else if (v === 'true' || v === 'false') {
      v = v === 'true';
    } else if (/^\d+$/.test(v)) {
      v = +v;
    } else {
      v = v.replace(/^["']|["']$/g, '');
    }
    meta[k] = v;
  });
  return { meta, body: m[2] };
}

async function tryLoadContent() {
  try {
    const res = await fetch('/content/manifest.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('no manifest');
    const manifest = await res.json();
    const out = { notes: [], albums: [], projects: [] };

    for (const f of (manifest.notes || [])) {
      const md = await (await fetch('/content/notes/' + f)).text();
      const { meta, body } = parseFrontMatter(md);
      out.notes.push({
        id: f.replace(/\.md$/, ''),
        title: meta.title || f,
        date: meta.date || '',
        tags: meta.tags || [],
        excerpt: meta.excerpt || body.slice(0, 160),
        mood: meta.mood, loc: meta.loc, public: meta.public !== false,
        kind: meta.kind || 'default',
        body,
      });
    }

    for (const f of (manifest.albums || [])) {
      const md = await (await fetch('/content/albums/' + f)).text();
      const { meta, body } = parseFrontMatter(md);
      // albums are nested — front-matter has month + cities array
      out.albums.push({ id: f.replace(/\.md$/, ''), ...meta, story: body });
    }

    for (const f of (manifest.projects || [])) {
      const md = await (await fetch('/content/projects/' + f)).text();
      const { meta, body } = parseFrontMatter(md);
      out.projects.push({ ...meta, body });
    }

    if (out.notes.length)    window.NOTES    = out.notes;
    if (out.albums.length)   window.MONTHS   = out.albums;
    if (out.projects.length) window.PROJECTS = out.projects;
    return true;
  } catch (e) {
    console.info('[content] using built-in example data (no manifest.json found)');
    return false;
  }
}

Object.assign(window, { tryLoadContent, parseFrontMatter });
