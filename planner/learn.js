// Switch Prep Planner — Learn page.
//   learn.html                → saare lessons ki list
//   learn.html#<itemId>       → ek lesson (jaise #a1, #c1)
//   learn.html#day/<date>/<dayNo>/<ids>/<revIds>  → poore din ka EK page (planner ka "📖 Day N ka poora lesson" button banata hai).
//     ids / revIds planner ke us din ke schedule se aate hain — din chhoota toh planner items aage shift karta hai, link bhi wahi naye items deta hai.
// Rendering: lesson-render.js (PLAN_RENDER). Progress yahan kuch nahi likhta — sirf planner ki localStorage se note padhta hai.
(function () {
  const R = window.PLAN_RENDER, esc = R.esc, PT = window.PLAN_TYPING;
  const $ = s => document.querySelector(s);
  const BASE = 'lessons/';

  // ---- theme (dsa-visual wali key hi — dono jagah same look) ----
  try { const t = localStorage.getItem('dsa-theme'); if (t) document.documentElement.dataset.theme = t; } catch (e) { /* ignore */ }
  $('#themeBtn').addEventListener('click', () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('dsa-theme', root.dataset.theme); } catch (e) { /* ignore */ }
  });

  const title = id => (R.man().items[id] || {}).title || id;
  const kindLabel = id => { const m = R.man().items[id] || {}; return m.track === 'dsa' ? 'DSA · ' + (R.DIFF[m.diff] || '') : R.KIND[m.kind] || 'Study'; };
  const doneMark = id => (R.plannerState(id).s === 'd' ? '✔ ' : '');

  // ---- single lesson ----
  function renderLesson(id, L) {
    return `<div class="lesson">
      <a href="learn.html" class="small">← Saare lessons</a>
      ${R.tags(id, L)}
      <h1>${esc(L.title)}</h1>
      ${R.lessonBody(id, PT.withTyping(id, L), { prefix: '', note: true })}
      <p class="lr-foot"><a class="btn" href="switch-prep-planner.html#today">📋 Planner pe wapas</a></p>
    </div>`;
  }

  // ---- Day page: us din ke saare items ek page pe ----
  function renderDay(date, n, ids, revs) {
    const fmt = R.fmtDate(date);
    const wd = (() => { const [y, m, d] = date.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-IN', { weekday: 'long' }); })();
    const items = ids.map((id, i) => ({ id, i, L: window.PLAN_LESSONS[id] }));
    const revL = revs.map(id => ({ id, L: window.PLAN_LESSONS[id] }));
    const nav = (revs.length ? '<button data-goto="day-rev">🔁 Revision</button>' : '') +
      items.map(({ id, i }) => `<button data-goto="item-${esc(id)}">${i + 1} · ${esc(title(id))}</button>`).join('') + '<button data-goto="day-done">✅ Day check</button>';
    const revHtml = revs.length ? `<details class="card part day-rev" id="day-rev" open><summary><h3>🔁 Part 0 — Revision (aaj due)</h3></summary><div class="part-body">
        <p class="muted small">Har ek ke liye 2 min: approach yaad karo, ⌨️ typing se pakka karo, phir planner me Hard / OK / Easy rate karo.</p>
        ${revL.map(({ id, L }) => {
          const e = R.plannerState(id);
          return `<div class="rev-item"><h4 class="lh">${esc(title(id))} <a class="small" href="learn.html#${esc(id)}">📖 lesson</a>${L && L.viz ? ` <a class="small" href="learn.html#${esc(id)}/viz">▶ Visualize</a>` : ''}</h4>
            ${L && L.oneLine ? `<p>💡 ${esc(L.oneLine)}</p>` : ''}${L && L.memory ? `<p class="tip"><b>🧠</b> ${esc(L.memory)}</p>` : ''}
            ${e.note ? `<p class="small muted" style="margin:6px 0 2px">📝 Tumhara note:</p><pre class="rev-note">${esc(e.note)}</pre>` : ''}${L ? PT.revHtml(id, L) : ''}</div>`;
        }).join('')}
      </div></details>` : '';
    const itemHtml = items.map(({ id, i, L }) => {
      const head = `<summary><h2>${i + 1}. ${doneMark(id)}${esc(title(id))} <span class="badge">${esc(kindLabel(id))}</span></h2></summary>`;
      if (!L) {
        return `<details class="day-item" id="item-${esc(id)}" open>${head}<div class="card notice">Is item ka lesson abhi nahi bana — agle batch me aayega. Abhi planner card ke links use karo. <a href="switch-prep-planner.html#today">Planner</a></div></details>`;
      }
      return `<details class="day-item" id="item-${esc(id)}" open>${head}
        <div class="day-item-body">${R.tags(id, L)}<p class="small"><a href="learn.html#${esc(id)}">Sirf ye lesson alag page pe →</a></p>
        ${R.lessonBody(id, PT.withTyping(id, L), { prefix: id, note: true, selfCheck: false })}</div></details>`;
    }).join('');
    const checks = items.filter(x => x.L).map(({ id, i, L }) => `<h4 class="lh">${i + 1}. ${esc(title(id))}</h4><ul class="checks">${(L.checks || []).map(t => `<li>${t}</li>`).join('')}</ul>${L.memory ? `<div class="memory"><b>🧠</b> ${esc(L.memory)}</div>` : ''}`).join('');
    return `<div class="lesson day-page">
      <a href="learn.html" class="small">← Saare lessons</a>
      <div class="muted" style="margin-top:8px">${esc(wd)} · ${esc(fmt)}</div>
      <h1>Day ${esc(n)} — ${items.length} item${items.length === 1 ? '' : 's'}${revs.length ? ` + ${revs.length} revision` : ''}</h1>
      <div class="card goal"><p><b>🎯 Aaj ka plan</b> <span class="muted small">(planner ke schedule se — kuch chhoota toh planner use agle din shift kar deta hai)</span></p>
        <ol class="day-list">${items.map(({ id, L }) => `<li>${doneMark(id)}<a href="javascript:void 0" data-goto="item-${esc(id)}">${esc(title(id))}</a> <span class="muted small">${esc(kindLabel(id))}${L ? '' : ' · lesson baaki'}</span></li>`).join('')}</ol>
        ${items.length ? '' : '<p class="muted">Is din koi naya item nahi — revision / buffer day.</p>'}</div>
      <nav class="part-nav day-nav">${nav}</nav>
      ${revHtml}${itemHtml}
      <div class="card part" id="day-done"><h3>✅ Day ${esc(n)} — Self-check</h3>
        <p class="muted small">Sab aata hai? Planner me har item <b>Done</b> karo — revision apne aap schedule hoga. Jo nahi hua wo kal shift ho jayega.</p>
        ${checks || '<p class="muted">—</p>'}
        <p class="lr-foot"><a class="btn" href="switch-prep-planner.html#today">📋 Planner pe wapas</a></p></div>
    </div>`;
  }

  function renderIndex() {
    const M = R.man(), ids = Object.keys(M.files);
    const groups = {};
    ids.forEach(id => { const m = M.items[id] || {}; const g = (m.track === 'th' ? 'Java, Spring & design · ' : 'DSA · ') + (m.topic || 'Other'); (groups[g] = groups[g] || []).push(id); });
    return `<div class="lesson lr-index"><h1>Switch Prep — Lessons</h1>
      <p class="muted">Planner me har din ke upar <b>📖 Day N ka poora lesson</b> aur har card pe <b>📖 Learn</b>. Abhi <b>${ids.length}</b> lessons ready hain — baaki batch me aa rahe hain.</p>
      ${Object.keys(groups).map(g => `<h2>${esc(g)}</h2><ul>${groups[g].map(id => { const m = M.items[id] || {}; return `<li><a href="#${esc(id)}">${doneMark(id)}${esc(m.title || id)}</a> <span class="muted">${esc(id)}${m.diff ? ' · ' + R.DIFF[m.diff] : ''}</span></li>`; }).join('')}</ul>`).join('')}
    </div>`;
  }

  async function route() {
    const h = decodeURIComponent(location.hash.replace(/^#/, ''));
    const main = $('#main');
    try {
      if (!h) { document.title = 'Switch Prep · Lessons'; main.innerHTML = renderIndex(); window.scrollTo(0, 0); return; }
      if (h.startsWith('day/')) {
        const [, date, n, idStr, revStr] = h.split('/');
        const ids = (idStr || '').split(',').filter(Boolean), revs = (revStr || '').split(',').filter(Boolean);
        await R.loadIds(BASE, ids.concat(revs));
        document.title = `Day ${n} · Learn`;
        main.innerHTML = renderDay(date, n, ids, revs);
        R.mount(main); if (window.TYPING) window.TYPING.mount(main); window.scrollTo(0, 0); return;
      }
      // #<id> ya #<id>/viz (seedha visualizer pe — revision cards ka "▶ Visualize")
      const [id, jump] = h.split('/');
      const file = R.man().files[id];
      if (!file) { main.innerHTML = `<div class="card notice"><b>${esc(title(id))}</b> ka lesson abhi nahi bana — agle batch me aayega. <a href="learn.html">← Saare lessons</a></div>`; return; }
      await R.loadIds(BASE, [id]);
      const L = window.PLAN_LESSONS[id];
      if (!L) { main.innerHTML = `<div class="card notice">${esc(id)} ka data ${esc(file)} me nahi mila.</div>`; return; }
      document.title = L.title + ' · Learn';
      main.innerHTML = renderLesson(id, L);
      R.mount(main); if (window.TYPING) window.TYPING.mount(main);
      const vz = jump === 'viz' && main.querySelector('.viz-mount');
      if (vz) { const d = vz.closest('details'); if (d) d.open = true; vz.scrollIntoView({ block: 'start' }); } else window.scrollTo(0, 0);
    } catch (e) { main.innerHTML = `<div class="card notice">${esc(e.message)}</div>`; }
  }

  // ---- events ----
  document.addEventListener('click', e => {
    if (R.onVizEx(e)) return;
    const ap = e.target.closest('.ap-tab');
    if (ap) {
      const q = ap.parentElement.dataset.q, i = ap.dataset.ap;
      ap.parentElement.querySelectorAll('.ap-tab').forEach(b => b.classList.toggle('on', b === ap));
      document.querySelectorAll(`.ap-body[data-q="${q}"]`).forEach(b => { b.hidden = b.dataset.ap !== i; });
      return;
    }
    const cp = e.target.closest('[data-copy]');
    if (cp) {
      const txt = cp.parentElement.querySelector('code').textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(
        () => { cp.textContent = 'Copied!'; setTimeout(() => { cp.textContent = 'Copy'; }, 1200); },
        () => { cp.textContent = 'Select karke copy karo'; });
      return;
    }
    const g = e.target.closest('[data-goto]');
    if (g) {
      const el = document.getElementById(g.dataset.goto);
      if (el) { if (el.tagName === 'DETAILS') el.open = true; const d = el.parentElement && el.parentElement.closest('details'); if (d) d.open = true; el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    }
  });
  window.addEventListener('hashchange', route);
  // planner kisi aur tab me note badle → sirf note cards update (scroll / visualizer reset na ho)
  window.addEventListener('storage', ev => {
    if (ev.key !== 'switch-prep-v1') return;
    document.querySelectorAll('.mynote[data-noteid]').forEach(card => { const id = card.dataset.noteid; card.outerHTML = R.noteCard(id, window.PLAN_LESSONS[id]); });
  });
  route();
})();
