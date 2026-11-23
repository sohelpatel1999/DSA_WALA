// dsa-visual ka "Switch Prep" section: planner (alag module) ke questions + theory, har ek ka poora lesson + visualizer.
// Content planner/lessons/*.js se (ek hi source — duplicate nahi). Progress planner me hi rehti hai; yahan sirf padhna / visualize.
//   #/switch-prep        → topic-wise list
//   #/switch-prep/<id>   → poora lesson (problem, Brute/Better/Optimal, visualizer tabs, dry run, interview Q&A …)
(function () {
  const R = window.PLAN_RENDER;
  if (!R) return;
  const esc = R.esc, BASE = 'planner/lessons/';

  function listHtml() {
    const M = R.man(), items = Object.entries(M.items), ready = id => !!M.files[id];
    const groups = {};
    items.forEach(([id, m]) => { const g = (m.track === 'th' ? 'Java, Spring & design · ' : '') + m.topic; (groups[g] = groups[g] || []).push([id, m]); });
    const nReady = items.filter(([id]) => ready(id)).length;
    return `<div class="lesson sp-list">
      <h1>Switch Prep — Planner ke questions</h1>
      <p class="muted">Ye <b>Switch Prep Planner</b> (alag module) ke items hain — yahan har ek ka poora lesson aur visualizer. Done / revision planner me hi mark hota hai.
        <a href="planner/switch-prep-planner.html#today" target="_blank" rel="noopener">📋 Planner kholo ↗</a></p>
      <p><b>${nReady}</b> / ${items.length} lessons ready — baaki planner ke schedule ke order me batch me aa rahe hain.</p>
      ${Object.keys(groups).map(g => `<div class="card"><h3>${esc(g)}</h3><ul class="sp-ul">${groups[g].map(([id, m]) => ready(id)
        ? `<li><a href="#/switch-prep/${esc(id)}"><b>${esc(m.title)}</b></a> ${m.diff ? `<span class="badge diff-${esc(R.DIFF[m.diff])}">${esc(R.DIFF[m.diff])}</span>` : ''}${placeTag(m)}</li>`
        : `<li class="muted">${esc(m.title)} <span class="small">· lesson baaki</span>${placeTag(m)}</li>`).join('')}</ul></div>`).join('')}
      <p class="muted small sp-legend"><span class="plan-tag both">Dono · …</span> dsa-visual course me bhi (us phase me) ·
        <span class="plan-tag">Visualize · …</span> sirf planner ka, par visualizer us phase ke Visualize tab me bhi ·
        <span class="plan-tag only">Sirf yahan</span> dsa-visual ke kisi phase me fit nahi — sirf isi Switch Prep tab me</p>
    </div>`;
  }

  // ye item dsa-visual me kahan milta hai? (sirf DSA items)
  function placeOf(m) {
    if (m.track !== 'dsa') return null;
    const R0 = window.ROADMAP || [];
    const inPhase = m.slug && R0.find(p => p.qs.concat(p.bonus || []).some(q => q[2] === m.slug));
    if (inPhase) return { kind: 'both', phase: inPhase };
    const pid = TOPIC_PHASE[m.topic], p = pid && R0.find(x => x.id === pid);
    return p ? { kind: 'viz', phase: p } : { kind: 'only' };
  }
  function placeTag(m) {
    const pl = placeOf(m);
    if (!pl) return '';
    if (pl.kind === 'only') return ' <span class="plan-tag only" title="dsa-visual ke kisi phase me fit nahi — sirf isi Switch Prep tab me">Sirf yahan</span>';
    const t = esc(pl.phase.title);
    return pl.kind === 'both'
      ? ` <a class="plan-tag both" href="#/${esc(pl.phase.id)}/questions" title="dsa-visual course ke ${t} phase me bhi hai">Dono · ${t}</a>`
      : ` <span class="plan-tag" title="Sirf planner ka — visualizer ${t} ke Visualize tab me bhi">Visualize · ${t}</span>`;
  }

  function lessonHtml(id, L) {
    return `<div class="lesson">
      <a href="#/switch-prep" class="small">← Switch Prep list</a>
      ${R.tags(id, L)}
      <h1>${esc(L.title)}</h1>
      <p class="small"><a href="planner/learn.html#${esc(id)}" target="_blank" rel="noopener">Planner ke Learn page pe (tumhare note ke saath) ↗</a></p>
      ${R.lessonBody(id, window.PLAN_TYPING ? window.PLAN_TYPING.withTyping(id, L) : L, { prefix: '', note: false })}
    </div>`;
  }

  // ---- Visualize tab me planner questions (tag "Planner") ----
  // planner topic → dsa-visual phase (jis phase ke Visualize tab me chip aayega).
  // Jo topic kisi phase me sahi fit nahi (jaise Recursion basics) → yahan nahi; list me "Sirf yahan" tag.
  const TOPIC_PHASE = {
    // Recursion / Sorting / Intervals ka dsa-visual me apna phase nahi → "Sirf yahan"
    'Arrays & Two Pointers': 'arrays', 'Hashing': 'arrays', 'Greedy': 'arrays',
    'Sliding Window': 'sliding-window', 'Linked List': 'linked-list', 'Stack & Queue': 'stack-queue', 'Binary Search': 'binary-search',
    'Trees': 'trees', 'Tries': 'trees', 'Heaps': 'heap', 'Backtracking': 'backtracking', 'Graphs': 'graphs', 'DP': 'dp',
  };
  const roadmapSlugs = () => new Set((window.ROADMAP || []).flatMap(p => p.qs.concat(p.bonus || [])).map(q => q[2]));
  // is phase ke liye planner ke ready DSA items jo dsa-visual me pehle se NAHI hain
  function forPhase(phaseId) {
    const M = R.man(), have = roadmapSlugs();
    return Object.entries(M.items).filter(([id, m]) => m.track === 'dsa' && M.files[id] && TOPIC_PHASE[m.topic] === phaseId && !(m.slug && have.has(m.slug))).map(([id, m]) => ({ id, title: m.title }));
  }
  // dsa-visual ke existing LC question planner me bhi hai? (chip pe "Planner" tag)
  function plannerHas(slug) { return !!slug && Object.values(R.man().items).some(m => m.slug === slug); }
  const vizTag = '<span class="plan-tag" title="Sirf Switch Prep Planner ka question">Planner</span>';
  const bothTag = '<span class="plan-tag both" title="Ye question dsa-visual course aur Switch Prep Planner dono me hai">Dono</span>';
  // planner viz placeholder (lesson file lazy load hoti hai, isliye app.js ka turant wala mount isse skip karta hai)
  const vizPlaceholder = (id, ex) => `<div class="plan-viz-wrap"><div class="card plan-viz-pending" data-vizid="${esc(id)}" data-viz="p-${esc(id)}" data-ex="${esc(ex || 0)}" data-variant="0"><p class="muted">Loading visualizer…</p></div></div>`;
  async function mountPending(root) {
    const els = [...root.querySelectorAll('.plan-viz-pending')];
    if (!els.length) return;
    try {
      await R.loadIds(BASE, els.map(el => el.dataset.vizid));
      els.forEach(el => {
        const L = window.PLAN_LESSONS[el.dataset.vizid];
        if (!L || !L.viz) { el.innerHTML = '<p class="muted">Visualizer nahi mila.</p>'; return; }
        el.classList.replace('plan-viz-pending', 'viz-mount');
        R.mount(el.parentElement);
      });
    } catch (e) { els.forEach(el => { el.innerHTML = `<p class="muted">${esc(e.message)}</p>`; }); }
  }

  window.PLANSEC = {
    forPhase, plannerHas, placeOf, vizTag, bothTag, vizPlaceholder, mountPending,
    count() { const M = R.man(); return Object.keys(M.files).length; },
    render(id) { return id ? '<p class="muted">Loading…</p>' : listHtml(); },
    async mount(main, id) {
      if (!id) return;
      try {
        if (!R.man().files[id]) { main.innerHTML = `<div class="card notice">Is item ka lesson abhi nahi bana. <a href="#/switch-prep">← list</a></div>`; return; }
        await R.loadIds(BASE, [id]);
        if (location.hash.replace(/^#\/?/, '') !== 'switch-prep/' + id) return;   // beech me user aage chala gaya
        main.innerHTML = lessonHtml(id, window.PLAN_LESSONS[id]);
        R.mount(main); if (window.TYPING) window.TYPING.mount(main);
      } catch (e) { main.innerHTML = `<div class="card notice">${esc(e.message)}</div>`; }
    },
    onClick: e => R.onVizEx(e),
  };
})();
