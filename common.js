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

  // Item ranks from item-catalog.js, best first; unranked sorts last.
  const RANKS = ['S', 'A', 'B', 'C'];
  const rankOrder = r => r ? RANKS.indexOf(r) : RANKS.length;

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

  // ---------- multi-select dropdown ----------
  // Wires up a <details class="ms" data-label="…"> dropdown of checkboxes (styles in common.css).
  //   getPicked() / setPicked(values): the ticked values, as strings; empty means no filter
  //   onChange(): called after the user changes the selection
  // Returns { fill(options) } to (re)build the list from [value, label] pairs; ticked values no longer
  // offered are dropped.
  let closeHandlersAdded = false;
  function multiSelect(el, { getPicked, setPicked, onChange }) {
    const menu = el.querySelector('.ms-menu');
    el.addEventListener('toggle', () => { if (el.open) document.querySelectorAll('.ms[open]').forEach(o => { if (o !== el) o.open = false; }); });
    menu.addEventListener('change', () => { setPicked([...menu.querySelectorAll('input:checked')].map(i => i.value)); onChange(); });
    menu.addEventListener('click', e => {
      // Keep clicks inside the menu from reaching the outside-click handler: All/Clear redraw the menu,
      // which detaches the clicked button and would otherwise close the dropdown.
      e.stopPropagation();
      const action = e.target.dataset.ms;
      if (!action) return;
      setPicked(action === 'all' ? [...menu.querySelectorAll('input')].map(i => i.value) : []);
      onChange();
    });
    if (!closeHandlersAdded) { // Close an open dropdown on a click elsewhere or Escape.
      closeHandlersAdded = true;
      document.addEventListener('click', e => document.querySelectorAll('.ms[open]').forEach(o => { if (!o.contains(e.target)) o.open = false; }));
      document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.ms[open]').forEach(o => { o.open = false; }); });
    }
    return {
      fill(options) {
        const picked = getPicked().filter(v => options.some(([o]) => String(o) === v));
        setPicked(picked);
        const set = new Set(picked);
        menu.innerHTML = '<div class="ms-actions"><button type="button" data-ms="all">All</button><button type="button" data-ms="none">Clear</button></div>' +
          options.map(([v, label]) => `<label><input type="checkbox" value="${esc(v)}" ${set.has(String(v)) ? 'checked' : ''}> ${esc(label)}</label>`).join('');
        const names = options.filter(([v]) => set.has(String(v))).map(([, label]) => label);
        const summary = !names.length || names.length === options.length ? 'All' : names.length === 1 ? esc(names[0]) : `${names.length} selected`;
        el.querySelector('summary').innerHTML = `${esc(el.dataset.label)}: <b>${summary}</b>`;
      }
    };
  }

  return { $, esc, plural, fmtDate, normName, byName, categoryTier, byCategory, RANKS, rankOrder, store, hideHomeLinkInFrame, onJsonDrop, multiSelect };
})();
