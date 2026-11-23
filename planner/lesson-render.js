// Planner lessons ke shared renderers — planner/learn.html (single + Day page) aur dsa-visual ka "Switch Prep" section dono use karte hain.
// Needs: window.VIZ (../visualizers.js), window.PLAN_KIT (lesson-kit.js), window.PLAN_MANIFEST (lessons/manifest.js).
// Block types (parts[].blocks): p, h, pre, tip, list, olist, code, table, lines, qa, say + planner wale: problem, compare, viz
(function () {
  window.PLAN_LESSONS = window.PLAN_LESSONS || {};
  window.PHASE_CONTENT = window.PHASE_CONTENT || {};
  // visualizer engine question ka code / examples PHASE_CONTENT se padhta hai — planner ka apna namespace (dsa-visual ke phases ROADMAP id se hi padhte hain)
  const PC = (window.PHASE_CONTENT.planner = window.PHASE_CONTENT.planner || { questions: {} });
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const DIFF = { T: 'Quick', E: 'Easy', M: 'Medium', H: 'Hard' };
  const KIND = { concept: 'Study', hld: 'HLD', lld: 'LLD', task: 'Task' };
  const vkey = id => 'p-' + id;
  const man = () => window.PLAN_MANIFEST || { files: {}, items: {} };

  // ---- planner progress (read-only, sirf learn page pe dikhate hain) ----
  function plannerState(id) {
    try { const d = JSON.parse(localStorage.getItem('switch-prep-v1') || '{}'); return (d.items && d.items[id]) || {}; } catch (e) { return {}; }
  }
  const fmtDate = s => { if (!s) return ''; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); };

  // ---- loader: file:// pe fetch nahi chalta — script tag. base = lessons folder ka path ('lessons/' ya 'planner/lessons/') ----
  const loaded = {};
  function loadFile(base, file) {
    const src = base + file;
    if (loaded[src]) return loaded[src];
    return (loaded[src] = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = res; s.onerror = () => { delete loaded[src]; rej(new Error(src + ' load nahi hua')); };
      document.body.appendChild(s);
    }));
  }
  // ids ke lesson files load karo (jinke lesson bane hain), phir register
  async function loadIds(base, ids) {
    const files = [...new Set(ids.map(id => man().files[id]).filter(Boolean))];
    await Promise.all(files.map(f => loadFile(base, f)));
    ids.forEach(id => register(id, window.PLAN_LESSONS[id]));
  }
  function register(id, L) {
    if (!L || L._reg) return;
    L._reg = true;
    if (L.approaches) PC.questions[vkey(id)] = { problem: L.problem, approaches: L.approaches };
    if (L.viz && window.VIZ) window.VIZ.defs[vkey(id)] = L.viz;
  }

  // ---- blocks ----
  function codeBlock(code) {
    return `<div class="code"><button class="copy" data-copy>Copy</button><pre><code class="language-java">${esc(code)}</code></pre></div>`;
  }
  const rank = l => (/^Brute/.test(l) ? 0 : /^Better/.test(l) ? 1 : /^Optimal/.test(l) ? 2 : 3);
  function compareHtml(id, L) {
    const lv = L.approaches || [];
    if (!lv.length) return '';
    const order = lv.map((a, i) => i).sort((x, y) => rank(lv[x].level) - rank(lv[y].level) || x - y);
    const opt = order.find(i => /^Optimal/.test(lv[i].level));
    const best = opt !== undefined ? opt : order[order.length - 1];
    const L2 = lv.map(a => a.level);
    const noBetter = L2.some(l => /^Brute/.test(l)) && L2.some(l => /^Optimal/.test(l)) && !L2.some(l => /^Better/.test(l));
    const key = 'cmp-' + id;
    return `<table class="tbl cmp"><thead><tr><th>Level</th><th>Idea</th><th>Time</th><th>Space</th></tr></thead><tbody>
        ${order.map(i => `<tr><td class="nowrap"><span class="lvl-pill lvl-${esc(lv[i].level)}">${esc(lv[i].level)}</span></td><td>${lv[i].idea}</td><td class="nowrap"><span class="cx">${esc(lv[i].time)}</span></td><td class="nowrap"><span class="cx">${esc(lv[i].space)}</span></td></tr>`).join('')}
      </tbody></table>
      ${noBetter ? '<p class="muted small nb-note">ℹ️ Is problem me alag <b>Better</b> approach nahi hai — Brute ke baad seedha Optimal.</p>' : ''}
      <div class="ap-tabs" data-q="${key}">${order.map(i => `<button class="ap-tab lvl-${esc(lv[i].level)} ${i === best ? 'on' : ''}" data-ap="${i}">${esc(lv[i].level)}</button>`).join('')}</div>
      ${order.map(i => `<div class="ap-body" data-q="${key}" data-ap="${i}" ${i === best ? '' : 'hidden'}>${codeBlock(lv[i].code)}</div>`).join('')}`;
  }
  function problemHtml(id, L) {
    const pr = L.problem;
    if (!pr) return '';
    return `<div class="prob">
      <p class="row wrap">${L.url ? `<a href="${esc(L.url)}" target="_blank" rel="noopener">Problem site pe kholo ↗</a>` : ''}${L.diff ? `<span class="badge diff-${esc(DIFF[L.diff])}">${esc(DIFF[L.diff])}</span>` : ''}</p>
      <h4>Problem</h4>
      <p>${pr.statement}</p>
      ${pr.examples.map((e, i) => `<div class="ex">
        <div class="ex-h"><b>Example ${i + 1}:</b>${L.viz && e.viz ? `<a class="small" href="javascript:void 0" data-vizex="${i}" data-vizfor="${esc(id)}">▶ Visualize this example</a>` : ''}</div>
        <pre class="ex-pre"><b>Input:</b> ${esc(e.input)}
<b>Output:</b> ${esc(e.output)}${e.explain ? `
<b>Explanation:</b> ${esc(e.explain)}` : ''}</pre>
      </div>`).join('')}
      ${pr.constraints && pr.constraints.length ? `<h4>Constraints</h4><ul class="cons">${pr.constraints.map(x => `<li><code>${esc(x)}</code></li>`).join('')}</ul>` : ''}
    </div>`;
  }
  function block(id, L, b) {
    if (b.rawHtml) return b.rawHtml;
    if (b.p) return `<p>${b.p}</p>`;
    if (b.h) return `<h4 class="lh">${b.h}</h4>`;
    if (b.pre) return `<pre class="ex-pre diagram">${esc(b.pre)}</pre>`;
    if (b.tip) return `<p class="tip">${b.tip}</p>`;
    if (b.list) return `<ul>${b.list.map(x => `<li>${x}</li>`).join('')}</ul>`;
    if (b.olist) return `<ol>${b.olist.map(x => `<li>${x}</li>`).join('')}</ol>`;
    if (b.code) return codeBlock(b.code);
    if (b.table) {
      return `<table class="tbl"><thead><tr>${b.table.head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${b.table.rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    }
    if (b.lines) {
      return `<table class="tbl lines"><thead><tr><th>Line</th><th>Purpose</th></tr></thead>
        <tbody>${b.lines.map(([l, w]) => `<tr><td><code>${esc(l)}</code></td><td>${w}</td></tr>`).join('')}</tbody></table>`;
    }
    if (b.qa) return `<ol class="qa">${b.qa.map(([q, a]) => `<li><details><summary>${q}</summary><div class="qa-a">${a}</div></details></li>`).join('')}</ol>`;
    if (b.say) return b.say.map(([t, a]) => `<div class="say"><b>🎤 ${esc(t)}</b><p>${esc(a)}</p></div>`).join('');
    if (b.problem) return problemHtml(id, L);
    if (b.compare) return compareHtml(id, L);
    if (b.viz !== undefined) return L.viz ? `<div class="card viz-mount" data-vizid="${esc(id)}" data-viz="${vkey(id)}" data-ex="${Number(b.viz) || 0}" data-variant="${b.variant || 0}"></div>` : '';
    return '';
  }

  function noteCard(id, L) {
    const e = plannerState(id);
    const status = e.s === 'd' ? `<span class="lr-done">✔ Planner me Done${e.done ? ' · ' + fmtDate(e.done) : ''}</span>${e.due ? ` · agla revision <b>${fmtDate(e.due)}</b>` : ''}` :
      e.s === 's' ? 'Planner me: <b>Studying</b>' : 'Planner me abhi <b>Pending</b>';
    return `<div class="card mynote" data-noteid="${esc(id)}"><h3>📝 Tumhara note <span class="muted small">(planner se — wahi edit karo)</span></h3>
      ${e.note ? `<pre>${esc(e.note)}</pre>` : '<p class="muted">Abhi koi note nahi. Padhne ke baad planner card me 1-line insight likho.</p>'}
      ${L && L.noteFeedback && e.note ? `<p class="tip"><b>Note pe feedback:</b> ${L.noteFeedback}</p>` : ''}
      <p class="muted small">${status}</p></div>`;
  }
  function tags(id, L) {
    const meta = man().items[id] || {};
    const t = [L.topic || meta.topic, L.diff ? DIFF[L.diff] : KIND[meta.kind]].filter(Boolean);
    return `<div class="lr-meta">${t.map(x => `<span class="badge">${esc(x)}</span>`).join('')}${L.pattern ? `<span class="muted small">Pattern: <b>${esc(L.pattern)}</b></span>` : ''}</div>`;
  }
  // ek lesson ki body: goal + (note) + part-nav + parts + self-check. opts: { prefix, note, nav, selfCheck }
  function lessonBody(id, L, opts) {
    opts = Object.assign({ prefix: '', note: true, nav: true, selfCheck: true }, opts);
    const P = opts.prefix ? opts.prefix + '-' : '';
    const parts = L.parts || [];
    return `<div class="card goal"><p><b>🎯 Goal:</b> ${L.goal}</p>${L.oneLine ? `<p>💡 ${esc(L.oneLine)}</p>` : ''}
        <div class="lr-links-row">${L.url ? `<a href="${esc(L.url)}" target="_blank" rel="noopener">Problem ↗</a>` : ''}${L.video ? `<a href="${esc(L.video)}" target="_blank" rel="noopener">Video ↗</a>` : ''}</div></div>
      ${opts.note ? noteCard(id, L) : ''}
      ${opts.nav ? `<nav class="part-nav">${parts.map((pt, i) => `<button data-goto="${P}part-${i}" title="${esc(pt.title)}">${esc(pt.title.split(' — ')[0])}</button>`).join('')}${opts.selfCheck ? `<button data-goto="${P}part-done">✅ Self-check</button>` : ''}</nav>` : ''}
      ${parts.map((pt, i) => `<details class="card part" id="${P}part-${i}" open>
        <summary><h3>${esc(pt.title)}</h3></summary>
        <div class="part-body">${pt.blocks.map(b => block(id, L, b)).join('')}</div>
      </details>`).join('')}
      ${opts.selfCheck ? `<div class="card part" id="${P}part-done">
        <h3>✅ Self-check</h3>
        <ul class="checks">${(L.checks || []).map(t => `<li>${t}</li>`).join('')}</ul>
        ${L.memory ? `<div class="memory"><b>🧠 Memory line:</b> ${esc(L.memory)}</div>` : ''}
      </div>` : ''}`;
  }

  // ---- mount: visualizers + highlight ----
  function mount(root) {
    root.querySelectorAll('.viz-mount').forEach(el => {
      window.VIZ.mount(el, el.dataset.viz, el.dataset.ex, el.dataset.variant);
      // engine header me "LC p-a1" aata hai — planner ke ids LC number nahi, isliye label saaf karo
      const fix = () => { const m = el.querySelector('.viz-head .muted'); if (m && /^LC p-/.test(m.textContent)) m.textContent = m.textContent.replace(/^LC p-\w+ · /, ''); };
      fix(); new MutationObserver(fix).observe(el, { childList: true });
    });
    if (window.hljs) root.querySelectorAll('pre code').forEach(b => window.hljs.highlightElement(b));
  }
  // "▶ Visualize this example" — usi lesson ka visualizer, us example pe
  function onVizEx(e) {
    const vx = e.target.closest('[data-vizex]');
    if (!vx) return false;
    const el = document.querySelector(`.viz-mount[data-vizid="${vx.dataset.vizfor}"]`);
    if (el) { window.VIZ.mount(el, el.dataset.viz, vx.dataset.vizex, 0); const d = el.closest('details.part'); if (d) d.open = true; el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    return true;
  }

  window.PLAN_RENDER = { esc, DIFF, KIND, man, plannerState, fmtDate, loadFile, loadIds, register, codeBlock, compareHtml, problemHtml, block, noteCard, tags, lessonBody, mount, onVizEx };
})();
