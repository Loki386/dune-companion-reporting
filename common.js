// Helpers shared by drop-rates.html and permits.html.
window.Common = (() => {
  const $ = s => document.querySelector(s);

  // ---------- text ----------
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const fmtDate = ms => new Date(ms).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Item names match without regard to capitals, curly apostrophes or extra spaces.
  const normName = n => String(n).replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
  const byName = (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });

  // Category order: untagged categories (such as Augments) first, then the "T6:" tier down to "T0:", A-Z within each.
  const categoryTier = g => { const m = /^T(\d+):\s*(.*)$/i.exec(g); return m ? { tier: Number(m[1]), rest: m[2] } : { tier: Infinity, rest: g }; };
  const byCategory = (a, b) => { const x = categoryTier(a), y = categoryTier(b); return y.tier - x.tier || byName(x.rest, y.rest); };

  // ---------- storage ----------
  // localStorage that survives blocked or full storage; set() reports whether the value was saved.
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch {} }
  };

  // ---------- page setup ----------
  // Inside the home page the tabs replace the header link to the other page.
  function hideHomeLinkInFrame() {
    if (window.self !== window.top) document.querySelectorAll('.home-link').forEach(a => a.classList.add('hidden'));
  }

  // Accepts .json files dropped anywhere on the page, highlighting it (body.dragging) while a file is over it.
  function onJsonDrop(handler) {
    let depth = 0;
    const done = () => { depth = 0; document.body.classList.remove('dragging'); };
    document.addEventListener('dragenter', e => { e.preventDefault(); depth++; document.body.classList.add('dragging'); });
    document.addEventListener('dragover', e => e.preventDefault());
    document.addEventListener('dragleave', () => { if (--depth <= 0) done(); });
    document.addEventListener('drop', e => {
      e.preventDefault(); done();
      const files = [...(e.dataTransfer?.files || [])].filter(f => /\.json$/i.test(f.name) || f.type.includes('json'));
      if (files.length) handler(files);
    });
  }

  return { $, esc, plural, fmtDate, normName, byName, categoryTier, byCategory, store, hideHomeLinkInFrame, onJsonDrop };
})();
