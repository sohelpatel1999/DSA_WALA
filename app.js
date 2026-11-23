(function () {
  const ROADMAP = window.ROADMAP;
  const CONTENT = window.PHASE_CONTENT || {};
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const WHO = { S: 'Sohvi', T: 'Tum' };

  // ---------- Progress (localStorage) ----------
  const KEY = 'dsa-done-v1';
  let done;
  try { done = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) { done = new Set(); }
  const saveDone = () => { try { localStorage.setItem(KEY, JSON.stringify([...done])); } catch (e) { /* ignore */ } };

  // ---------- Theme ----------
  try { const t = localStorage.getItem('dsa-theme'); if (t) document.documentElement.dataset.theme = t; } catch (e) { /* ignore */ }
  try { if (localStorage.getItem('dsa-nav') === 'closed') document.body.classList.add('nav-collapsed'); } catch (e) { /* ignore */ }
  $('#themeBtn').addEventListener('click', () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('dsa-theme', root.dataset.theme); } catch (e) { /* ignore */ }
  });

  const phaseById = id => ROADMAP.find(p => p.id === id);
  const allQs = p => p.qs.concat(p.bonus || []);
  const qMeta = num => { num = Number(num); for (const p of ROADMAP) for (const q of allQs(p)) if (q[0] === num) return { num: q[0], name: q[1], slug: q[2], who: q[3], diff: q[4], phase: p }; return null; };
  const lcLink = m => `https://leetcode.com/problems/${m.slug}/`;
  const phaseDone = p => allQs(p).filter(q => done.has(q[0])).length;
  const hasViz = num => !!(window.VIZ && window.VIZ.defs[num]);

  function codeBlock(code) {
    return `<div class="code"><button class="copy" data-copy>Copy</button><pre><code class="language-java">${esc(code)}</code></pre></div>`;
  }
  function badge(m) {
    return `<span class="badge who-${m.who}">${WHO[m.who]}</span><span class="badge diff-${m.diff}">${m.diff}</span>`;
  }
  function check(num) {
    return `<label class="done-box" title="Done mark karo"><input type="checkbox" data-done="${num}" ${done.has(num) ? 'checked' : ''}><span>Done</span></label>`;
  }

  // ---------- Sidebar ----------
  function renderNav(active) {
    $('#nav').innerHTML =
      `<a href="#/home" class="${active === 'home' ? 'active' : ''}"><span class="pn">⌂</span>Home</a>` +
      ROADMAP.map(p => {
        const has = !!CONTENT[p.id];
        const tot = allQs(p).length;
        return `<a href="#/${p.id}" class="${active === p.id ? 'active' : ''}">
          <span class="pn">${p.phase}</span><span class="pt">${esc(p.title)}</span>
          ${tot ? `<span class="pc">${phaseDone(p)}/${tot}</span>` : ''}${has ? '' : '<span class="soon" title="Detail content abhi baaki hai">•</span>'}
        </a>`;
      }).join('') +
      // Switch Prep: planner ke questions ka section (yahin) + planner app (alag module, alag progress — naye tab me)
      (window.PLANSEC ? `<a href="#/switch-prep" class="${active === 'switch-prep' ? 'active' : ''}" title="Planner ke questions — lesson + visualizer"><span class="pn">SP</span><span class="pt">Switch Prep Qs</span><span class="pc">${PLANSEC.count()} ready</span></a>` : '') +
      `<a href="planner/switch-prep-planner.html#today" target="_blank" rel="noopener" title="Switch Prep Planner — alag module, alag progress (naye tab me)"><span class="pn">📋</span><span class="pt">Switch Prep Planner ↗</span></a>`;
  }

  // ---------- Day-wise progress (poora course: week × 7 din) ----------
  const DKEY = 'dsa-days-v1';
  let daysDone;
  try { daysDone = new Set(JSON.parse(localStorage.getItem(DKEY) || '[]')); } catch (e) { daysDone = new Set(); }
  const saveDays = () => { try { localStorage.setItem(DKEY, JSON.stringify([...daysDone])); } catch (e) { /* ignore */ } };
  const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekRange = p => { const m = p.weeks.match(/\d+/g).map(Number); return [m[0], m[m.length - 1]]; };
  const TOTAL_DAYS = Math.max(...ROADMAP.map(p => weekRange(p)[1])) * 7;
  const phaseOfWeek = w => ROADMAP.find(p => { const [a, b] = weekRange(p); return w >= a && w <= b; });
  const globalDay = (p, local) => (weekRange(p)[0] - 1) * 7 + Number(local);
  const globalWeek = (p, localWeek) => weekRange(p)[0] + Number(localWeek) - 1;

  function dayInfo(n) {
    const week = Math.ceil(n / 7), p = phaseOfWeek(week), c = p && CONTENT[p.id];
    const local = p ? n - (weekRange(p)[0] - 1) * 7 : n;
    const d = c && c.days && c.days.find(x => x.day === local);
    const href = !p ? '#/home' : c && c.lessons && c.lessons[local] ? `#/${p.id}/day/${local}` : `#/${p.id}/daily`;
    return { n, week, dow: DOW[(n - 1) % 7], p, d, href };
  }
  // Start day: "Day 32 se shuru karna hai" — agla din = start se aage pehla incomplete (game.js bhi yahi key padhta hai)
  const SKEY = 'dsa-start-day';
  const startDay = () => { let s = 1; try { s = Number(JSON.parse(localStorage.getItem(SKEY) || '1')) || 1; } catch (e) { /* ignore */ } return Math.min(Math.max(1, Math.floor(s)), TOTAL_DAYS); };
  const setStartDay = n => { try { if (n > 1) localStorage.setItem(SKEY, JSON.stringify(n)); else localStorage.removeItem(SKEY); } catch (e) { /* ignore */ } };
  const nextDay = () => {
    const s = startDay();
    for (let n = s; n <= TOTAL_DAYS; n++) if (!daysDone.has(n)) return n;
    for (let n = 1; n < s; n++) if (!daysDone.has(n)) return n;
    return null;
  };
  function startDayHtml() {
    const s = startDay(), i = dayInfo(s);
    return `<details class="start-day" ${s > 1 ? 'open' : ''}><summary>⚙ ${s > 1 ? `Start: <b>Day ${s}</b> (Week ${i.week}) — yahin se aage chal raha hai` : 'Kisi aur din se shuru karna hai?'}</summary>
      <div class="row wrap"><label>Day <input type="number" id="startDayIn" min="1" max="${TOTAL_DAYS}" value="${s}" class="short"></label>
        <button class="btn small primary" data-startday-set>Yahan se shuru karo</button>${s > 1 ? '<button class="btn small" data-startday-reset>Day 1 se</button>' : ''}</div>
      <p class="muted small">"Aaj" aur Home ke mission is din se chalenge; ye din complete karte hi agla. Pehle ke din complete nahi maane jaate (XP fake nahi badhta) — chaho toh tracker me click karke tick kar sakte ho.</p></details>`;
  }

  function dayStatsHtml() {
    const cnt = daysDone.size, nx = nextDay();
    let streak = 0;
    if (cnt) for (let n = Math.max(...daysDone); n >= 1 && daysDone.has(n); n--) streak++;
    const i = nx && dayInfo(nx);
    return `<div class="trk-stats">
        <div><b>${cnt}</b><span>/ ${TOTAL_DAYS} din complete</span></div>
        <div><b>${streak}</b><span>din ki streak 🔥</span></div>
        <div><b>${Math.round((cnt / TOTAL_DAYS) * 100)}%</b><span>course done</span></div>
      </div>
      <div class="bar"><div style="width:${(cnt / TOTAL_DAYS) * 100}%"></div></div>
      ${i ? `<p class="today-line">👉 <b>Aaj: Day ${i.n}</b> · Week ${i.week} · ${i.dow} · ${esc(i.p ? i.p.title : '')}${i.d ? ` — ${esc(i.d.title)}` : ''} <a class="btn small primary" href="${i.href}">Kholo</a></p>` : '<p class="today-line ok"><b>🎉 Poora course complete!</b></p>'}
      ${startDayHtml()}`;
  }

  const quizStore = () => { try { return JSON.parse(localStorage.getItem('dsa-quiz-v1') || '{}'); } catch (e) { return {}; } };
  function trackerHtml() {
    const nx = nextDay(), weeks = TOTAL_DAYS / 7;
    let rows = '';
    for (let w = 1; w <= weeks; w++) {
      const p = phaseOfWeek(w);
      let cells = '';
      for (let k = 1; k <= 7; k++) {
        const n = (w - 1) * 7 + k, info = dayInfo(n);
        const qzr = quizStore()[n];
        cells += `<button class="trk-d ${daysDone.has(n) ? 'on' : ''} ${n === nx ? 'today' : ''} ${k >= 6 ? 'wknd' : ''} ${qzr ? (qzr.best === 5 ? 'qz5' : 'qz') : ''}" data-daytoggle="${n}" title="Day ${n} · ${info.dow}${info.d ? ' · ' + esc(info.d.title) : ''} — click: complete / undo">${n}</button>`;
      }
      rows += `<div class="trk-row"><a class="trk-w" href="${p ? `#/${p.id}/daily/week-${w}` : '#/home'}" title="Week ${w} ka Daily Plan kholo">W${w}<small>${esc(p ? p.title : '')}</small></a><div class="trk-days">${cells}</div></div>`;
    }
    return `<div class="trk-head"><span></span><div class="trk-days">${DOW.map(d => `<span>${d}</span>`).join('')}</div></div>${rows}`;
  }

  function weekJumpHtml() {
    const nx = nextDay(), cur = nx ? Math.ceil(nx / 7) : 0;
    let out = '';
    for (let w = 1; w <= TOTAL_DAYS / 7; w++) {
      const p = phaseOfWeek(w), all = [1, 2, 3, 4, 5, 6, 7].every(k => daysDone.has((w - 1) * 7 + k));
      out += `<a class="wj ${w === cur ? 'cur' : ''} ${all ? 'full' : ''}" href="${p ? `#/${p.id}/daily/week-${w}` : '#/home'}" title="Week ${w} · Day ${(w - 1) * 7 + 1}–${w * 7}${p ? ' · ' + esc(p.title) : ''}">W${w}<small>${esc(p ? p.title : '')}</small></a>`;
    }
    return out;
  }

  function dayToggleBtn(n) {
    const on = daysDone.has(n);
    return `<button class="btn day-toggle ${on ? 'on' : ''}" data-daytoggle="${n}">${on ? `✅ Day ${n} complete` : `☐ Day ${n} complete mark karo`}</button>`;
  }

  // click ke baad saari jagah (home grid, daily card, lesson page) bina re-render update
  function refreshDay(n) {
    document.querySelectorAll(`[data-daytoggle="${n}"]`).forEach(el => {
      if (el.classList.contains('trk-d')) el.classList.toggle('on', daysDone.has(n));
      else el.outerHTML = dayToggleBtn(n);
    });
    const nx = nextDay();
    document.querySelectorAll('.trk-d').forEach(el => el.classList.toggle('today', Number(el.dataset.daytoggle) === nx));
    const st = $('#dayStats'); if (st) st.innerHTML = dayStatsHtml();
    const wj = $('#wkJump'); if (wj) wj.innerHTML = weekJumpHtml();
    const ws = document.querySelector(`.ws[data-goto="day-${n}"]`); if (ws) ws.classList.toggle('full', daysDone.has(n));
  }

  function refreshLessonBar() {
    const bar = $('#lessonBar'), c = CONTENT[(location.hash.replace(/^#\/?/, '')).split('/')[0]];
    if (bar && c) bar.innerHTML = lessonProgress(c, bar.dataset.day, Number(bar.dataset.n));
  }

  // ---------- Home ----------
  function renderHome() {
    const all = ROADMAP.flatMap(allQs);
    const sDone = all.filter(q => q[3] === 'S' && done.has(q[0])).length, sTot = all.filter(q => q[3] === 'S').length;
    const tDone = all.filter(q => q[3] === 'T' && done.has(q[0])).length, tTot = all.filter(q => q[3] === 'T').length;
    const bar = (a, b) => `<div class="bar"><div style="width:${b ? (a / b) * 100 : 0}%"></div></div>`;
    return `
      <section class="hero">
        <h1>DSA Visual — Sohel &amp; Sohvi</h1>
        <p class="muted">Same meeting, different difficulty level. Same journey hai, lekin same speed nahi. · Language: <b>Java</b></p>
      </section>
      ${window.GAME ? GAME.homeCard() : ''}
      ${usageGuideHtml()}
      <div class="card tracker">
        <h3>📅 Day-wise Progress</h3>
        <div id="dayStats">${dayStatsHtml()}</div>
        <div class="wk-jump"><span class="muted small">Week pe jao:</span><span id="wkJump" class="wk-jump" style="margin:0">${weekJumpHtml()}</span></div>
        <p class="muted small">Din pe click karo → ✅ complete. Dobara click → undo. Peela border = aaj ka din. <b>W5</b> jaise label pe click → us week ka plan.</p>
        <div class="trk">${trackerHtml()}</div>
      </div>
      <div class="grid2">
        <div class="card"><h3>Sohvi <span class="muted">(Beginner → Placement)</span></h3>${bar(sDone, sTot)}<p class="muted">${sDone}/${sTot} questions · Target 150–180 LC</p></div>
        <div class="card"><h3>Tum <span class="muted">(SDE-2 switch)</span></h3>${bar(tDone, tTot)}<p class="muted">${tDone}/${tTot} questions · Target 250–300 LC</p></div>
      </div>
      <div class="card">
        <h3>Roz ka meet — 9:00 PM to 10:30 PM</h3>
        <div class="timeline">
          <div><b>20 min</b><span>Theory — topic, pattern, complexity</span></div>
          <div><b>30 min</b><span>Solve together — Brute → Better → Optimal</span></div>
          <div><b>40 min</b><span>Individual — dono MUST question, time ho toh PUSH</span></div>
        </div>
        <p class="muted">Mon–Fri: 1 topic, 1–2 questions · Sat: revision (3–4 Qs) · Sun: mock interview + LeetCode contest</p>
      </div>
      <h2>Phases</h2>
      <div class="phase-grid">
        ${ROADMAP.map(p => `
          <a class="card phase-card" href="#/${p.id}">
            <div class="row"><span class="pnum">Phase ${p.phase}</span><span class="muted">${esc(p.weeks)}</span></div>
            <h3>${esc(p.title)}</h3>
            <div class="chips">${p.topics.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
            ${p.qs.length ? bar(phaseDone(p), allQs(p).length) + `<p class="muted small">${phaseDone(p)}/${allQs(p).length} done${CONTENT[p.id] ? ' · <b class="ok">Full content ready</b>' : ''}</p>` : ''}
          </a>`).join('')}
      </div>`;
  }

  // ---------- Phase tabs ----------
  const TABS = [
    ['fundamentals', 'Fundamentals'], ['operations', 'Operations'], ['patterns', 'Patterns'],
    ['visualize', 'Visualize'], ['questions', 'Questions'], ['daily', 'Daily Plan'], ['last', 'Last Minute'],
  ];

  function memoryDemo() {
    const vals = [10, 20, 30, 40, 50];
    return `<div class="mem">
      ${vals.map((v, i) => `<div class="mem-cell"><div class="mem-addr">${1000 + i * 4}</div><div class="vbox">${v}</div><div class="vidx">[${i}]</div></div>`).join('')}
    </div>
    <p class="muted small">int = 4 bytes. arr[3] ka address = 1000 + 3 × 4 = <b>1012</b> → seedha jump, isliye access O(1).</p>`;
  }

  function tabFundamentals(c, p) {
    const wu = p && window.WARMUP && WARMUP[p.id] ? `<p><a class="btn small primary" href="#/${p.id}/fundamentals/warmup">⌨️ Warm-up: API + Templates (typing) ↓</a></p>` : '';
    return `<p class="lead">${esc(c.intro)}</p>${wu}` + c.fundamentals.map(f => `
      <div class="card"><h3>${esc(f.h)}</h3>${f.body || ''}${f.memoryDemo ? memoryDemo() : ''}${f.code ? codeBlock(f.code) : ''}</div>`).join('') + warmupHtml(p);
  }
  // ⌨️ API warm-up (data/warmup-api.js): is phase ke DS ki declarations + methods — jab mann ho tab type karo
  function warmupHtml(p) {
    const W = p && window.WARMUP && WARMUP[p.id];
    if (!W || !W.length || !window.TYPING) return '';
    const tab = it => ({ label: (it.kind === 'template' ? '🧩 ' : '🔧 ') + it.label, lines: it.lines });
    const common = WARMUP._common || [];
    return `<div class="card" id="warmup"><h3>⌨️ Warm-up — ${esc(p.title)}</h3>
      <p class="muted small"><b>🔧 API</b> = syntax (declarations + methods) · <b>🧩 Template</b> = pattern ka generic skeleton — <code>←</code> wali lines har question me badalti hain. Jab mann ho, ya interview se pehle, type karo. ${TY_HELP}</p>
      <h4 class="lh">${esc(p.title)}</h4>${TYPING.html({ q: 0, items: W.map(tab) })}
      ${common.length ? `<h4 class="lh">☕ Java Collections (har phase me kaam aate hain)</h4>${TYPING.html({ q: 0, items: common.map(tab) })}` : ''}</div>`;
  }
  // Lesson me nudge: jis din is phase ka koi warm-up item pehli baar aata hai, aur revision day pe
  function warmupNudge(p, d) {
    const W = window.WARMUP && WARMUP[p.id];
    if (!W) return '';
    const now = W.filter(it => Number(it.day) === Number(d.day));
    if (d.type === 'revision') return `<p class="warmup-nudge">⌨️ Is hafte ka syntax + pattern templates pakke karne hain? <a href="#/${p.id}/fundamentals/warmup">Fundamentals me warm-up karo →</a></p>`;
    if (!now.length) return '';
    return `<p class="warmup-nudge">⌨️ Aaj naya: <b>${now.map(it => esc(it.label)).join(', ')}</b> — <a href="#/${p.id}/fundamentals/warmup">Fundamentals me warm-up karo →</a> (jab mann ho)</p>`;
  }

  function tabOperations(c) {
    return `<div class="card"><table class="tbl ops"><thead><tr><th>Operation</th><th>Time</th><th>Kyun</th><th>Java</th></tr></thead><tbody>
      ${c.operations.map(o => `<tr><td><b>${esc(o.op)}</b></td><td><span class="cx">${esc(o.time)}</span></td><td class="muted">${esc(o.note)}</td><td><pre class="mini"><code class="language-java">${esc(o.code)}</code></pre></td></tr>`).join('')}
    </tbody></table></div>`;
  }

  function tabPatterns(p, c) {
    return c.patterns.map(pt => {
      const v = pt.qs.find(hasViz);
      return `
      <div class="card">
        <div class="row"><h3>${esc(pt.name)}</h3>${v ? `<a class="btn small" href="#/${p.id}/visualize/${v}">▶ Visualize</a>` : ''}</div>
        <p><b>Signal:</b> ${esc(pt.signal)}</p>
        <p><b>Idea:</b> ${esc(pt.idea)}</p>
        ${codeBlock(pt.code)}
        <p class="muted small">Questions: ${pt.qs.map(n => `<a href="#/${p.id}/questions/${n}">LC ${n}</a>`).join(' · ')}</p>
      </div>`;
    }).join('');
  }

  function tabVisualize(p, c, vid, ex) {
    const list = allQs(p).map(q => q[0]).filter(hasViz);
    if (!list.length) {
      // Revision phase: apne questions nahi — daily plan wale questions ke visualizer unke apne phase me
      const used = [...new Set((c.days || []).flatMap(d => d.qs))].filter(hasViz);
      return `<p class="muted">Is phase ke questions pichle phases ke hain — visualizer wahin khulta hai:</p>
        <div class="viz-pick">${used.map(n => { const m = qMeta(n); return `<a class="btn small" href="#/${m.phase.id}/visualize/${n}"><b>${n}</b> ${esc(m.name)}</a>`; }).join('')}</div>`;
    }
    // Switch Prep Planner ke questions (jo is phase me pehle se nahi) — "Planner" tag, viz planner/lessons se lazy load
    const PS = window.PLANSEC, plan = PS ? PS.forPhase(p.id) : [];
    const planCur = plan.find(x => 'p-' + x.id === String(vid));
    const cur = planCur ? null : hasViz(vid) ? Number(vid) : list[0];
    return `<div class="viz-pick">${list.map(n => `<a class="btn small ${n === cur ? 'primary' : ''}" href="#/${p.id}/visualize/${n}"><b>${n}</b> ${esc(qMeta(n).name)}${PS && PS.plannerHas(qMeta(n).slug) ? PS.bothTag : ''}</a>`).join('')}${plan.map(x => `<a class="btn small ${planCur === x ? 'primary' : ''}" href="#/${p.id}/visualize/p-${esc(x.id)}">${PS.vizTag} ${esc(x.title)}</a>`).join('')}</div>
      ${planCur ? `${PS.vizPlaceholder(planCur.id, ex)}<p class="small"><a href="#/switch-prep/${esc(planCur.id)}">Poora lesson (Switch Prep section) →</a></p>` : `<div class="card viz-mount" data-viz="${cur}" data-ex="${esc(ex || 0)}"></div>`}
      <p class="muted small">Tip: apna input daal ke "Run" dabao · ← → arrow keys se step · Code me <b>▶</b> = abhi ye line chal rahi hai. Colors: <span class="lg cur">current</span> <span class="lg win">window/range</span> <span class="lg found">answer</span> <span class="lg new">abhi likha</span> <span class="lg skip">skip</span></p>`;
  }

  // LeetCode jaisa: Problem → Example 1..n (Input / Output / Explanation) → Constraints
  function problemHtml(p, num, pr) {
    if (!pr) return '';
    return `<div class="prob">
      <h4>Problem</h4>
      <p>${pr.statement}</p>
      ${pr.examples.map((e, i) => `<div class="ex">
        <div class="ex-h"><b>Example ${i + 1}:</b>${hasViz(num) ? `<a class="small" href="#/${p.id}/visualize/${num}/${i}">▶ Visualize this example</a>` : ''}</div>
        <pre class="ex-pre"><b>Input:</b> ${esc(e.input)}
<b>Output:</b> ${esc(e.output)}
<b>Explanation:</b> ${esc(e.explain)}</pre>
      </div>`).join('')}
      <h4>Constraints</h4>
      <ul class="cons">${pr.constraints.map(x => `<li><code>${esc(x)}</code></li>`).join('')}</ul>
    </div>`;
  }

  function questionCard(p, c, num, open) {
    const m = qMeta(num), q = c && c.questions[num];
    if (!q) {
      return `<div class="card q"><div class="q-head"><span class="qnum">${num}</span><a href="${lcLink(m)}" target="_blank" rel="noopener">${esc(m.name)} ↗</a>${badge(m)}${check(num)}</div></div>`;
    }
    const lv = q.approaches;
    return `<details class="card q" id="q-${num}" ${open ? 'open' : ''}>
      <summary class="q-head"><span class="qnum">${num}</span><span class="qname">${esc(m.name)}</span>${badge(m)}${check(num)}</summary>
      ${problemHtml(p, num, q.problem)}
      <p class="oneline">💡 ${esc(q.oneLine)}</p>
      <div class="row wrap">
        <span class="muted small">Pattern: <b>${esc(q.pattern)}</b></span>
        <a class="small" href="${lcLink(m)}" target="_blank" rel="noopener">LeetCode pe kholo ↗</a>
        ${hasViz(num) ? `<a class="btn small" href="#/${p.id}/visualize/${num}">▶ Visualize</a>` : ''}
      </div>
      <div class="ap-tabs" data-q="${num}">
        ${lv.map((a, i) => `<button class="ap-tab lvl-${a.level} ${i === lv.length - 1 ? 'on' : ''}" data-ap="${i}">${a.level}</button>`).join('')}
      </div>
      ${lv.map((a, i) => `<div class="ap-body" data-q="${num}" data-ap="${i}" ${i === lv.length - 1 ? '' : 'hidden'}>
        <p>${esc(a.idea)}</p>
        <div class="row"><span class="cx">Time ${esc(a.time)}</span><span class="cx">Space ${esc(a.space)}</span></div>
        ${codeBlock(a.code)}
      </div>`).join('')}
      <div class="flow">${lv.map(a => `<span class="lvl-${a.level}">${a.level}<small>${esc(a.time)}</small></span>`).join('<b>→</b>')}</div>
      ${noBetterNote(lv)}
      <p><b>Dry run:</b> <code class="dry">${esc(q.dryRun)}</code></p>
      <div class="say"><b>🎤 Interview me aise bolo:</b> ${esc(q.interview)}</div>
    </details>`;
  }

  function tabQuestions(p, c, focus) {
    const f = window.__qFilter || 'all';
    const keep = q => f === 'all' || q[3] === f;
    const isFocus = q => String(q[0]) === String(focus);
    const bonus = (p.bonus || []).filter(keep);
    return `<div class="row filt">
        ${[['all', 'Sab'], ['S', 'Sohvi'], ['T', 'Tum']].map(([k, l]) => `<button class="btn ${f === k ? 'primary' : ''}" data-filter="${k}">${l}</button>`).join('')}
        <span class="muted small">Card pe click karo → Brute / Better / Optimal</span>
      </div>
      <h2>Roadmap questions</h2>` + p.qs.filter(keep).map(q => questionCard(p, c, q[0], isFocus(q))).join('') +
      (bonus.length ? `<h2>Bonus practice <span class="muted small">(Daily Plan ke extra questions)</span></h2>` + bonus.map(q => questionCard(p, c, q[0], isFocus(q))).join('') : '');
  }

  // ---------- Day lessons (Day 31 wala format) ----------
  const LKEY = 'dsa-lesson-v1';
  let lessonDone;
  try { lessonDone = JSON.parse(localStorage.getItem(LKEY) || '{}'); } catch (e) { lessonDone = {}; }
  const saveLesson = () => { try { localStorage.setItem(LKEY, JSON.stringify(lessonDone)); } catch (e) { /* ignore */ } };
  const lessonOf = (c, day) => c.lessons && c.lessons[day];
  // n = global day (1..168)
  const lessonComplete = n => {
    const info = dayInfo(n), c = info.p && CONTENT[info.p.id];
    const L = c && lessonOf(c, n - (weekRange(info.p)[0] - 1) * 7), got = lessonDone[n] || [];
    return !!L && L.checks.every((_, i) => got.includes(i));
  };

  function lessonBlock(p, b) {
    if (b.p) return `<p>${b.p}</p>`;
    if (b.h) return `<h4 class="lh">${b.h}</h4>`;
    if (b.pre) return `<pre class="ex-pre diagram">${esc(b.pre)}</pre>`;
    if (b.tip) return `<p class="tip">${b.tip}</p>`;
    if (b.list) return `<ul>${b.list.map(x => `<li>${x}</li>`).join('')}</ul>`;
    if (b.olist) return `<ol>${b.olist.map(x => `<li>${x}</li>`).join('')}</ol>`;
    if (b.code) return codeBlock(b.code);
    if (b.memory) return memoryDemo();
    if (b.table) {
      return `<table class="tbl"><thead><tr>${b.table.head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${b.table.rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    }
    if (b.problem) {
      const m = qMeta(b.problem), qc = CONTENT[m.phase.id], q = qc && qc.questions[b.problem];
      return `<p class="row wrap"><a href="${lcLink(m)}" target="_blank" rel="noopener">LeetCode pe kholo ↗</a>${badge(m)}</p>` + problemHtml(m.phase, b.problem, q && q.problem);
    }
    if (b.viz) return `<div class="card viz-mount" data-viz="${b.viz}" data-ex="${b.ex || 0}" data-variant="${b.variant || 0}"></div>`;
    if (b.lines) {
      return `<table class="tbl lines"><thead><tr><th>Line</th><th>Purpose</th></tr></thead>
        <tbody>${b.lines.map(([l, w]) => `<tr><td><code>${esc(l)}</code></td><td>${w}</td></tr>`).join('')}</tbody></table>`;
    }
    if (b.qa) return `<ol class="qa">${b.qa.map(([q, a]) => `<li><details><summary>${q}</summary><div class="qa-a">${a}</div></details></li>`).join('')}</ol>`;
    if (b.say) return b.say.map(([t, a]) => `<div class="say"><b>🎤 ${esc(t)}</b><p>${esc(a)}</p></div>`).join('');
    if (b.typing) return window.TYPING ? TYPING.html(b.typing) : '';
    return '';
  }

  function lessonProgress(c, day, n) {
    const L = lessonOf(c, day), got = lessonDone[n] || [];
    return `<div class="lesson-bar-row">${dayToggleBtn(n)}
        <span class="small muted">${daysDone.has(n) ? 'Dobara click = undo' : 'Padh liya? Bas ek click.'} · self-check ${got.length}/${L.checks.length}</span>${L.quiz ? `<a class="small" data-goto="part-quiz" href="javascript:void 0">🎯 Quiz</a><span class="qz-badge-slot-${n}">${window.GAME ? GAME.quizBadge(n) : ''}</span>` : ''}</div>
      <div class="bar"><div style="width:${(got.length / L.checks.length) * 100}%"></div></div>`;
  }

  // ---- Brute → Better → Optimal ----
  function noBetterNote(lv) {
    const L = lv.map(a => a.level);
    return L.some(l => /^Brute/.test(l)) && L.some(l => /^Optimal/.test(l)) && !L.some(l => /^Better/.test(l))
      ? '<p class="muted small nb-note">ℹ️ Is problem me alag <b>Better</b> approach nahi hai — Brute ke baad seedha Optimal.</p>' : '';
  }
  function compareHtml(num) {
    const m = qMeta(num), qc = m && CONTENT[m.phase.id], q = qc && qc.questions[num];
    if (!q) return '';
    const lv = q.approaches, key = 'cmp-' + num;
    const rank = l => (/^Brute/.test(l) ? 0 : /^Better/.test(l) ? 1 : /^Optimal/.test(l) ? 2 : 3);
    const order = lv.map((a, i) => i).sort((x, y) => rank(lv[x].level) - rank(lv[y].level) || x - y);
    const best = order.filter(i => /^Optimal/.test(lv[i].level))[0] !== undefined ? order.filter(i => /^Optimal/.test(lv[i].level))[0] : order[order.length - 1];
    return `<h4 class="cmp-h">LC ${num} — ${esc(m.name)}</h4>
      <table class="tbl cmp"><thead><tr><th>Level</th><th>Idea</th><th>Time</th><th>Space</th></tr></thead><tbody>
        ${order.map(i => `<tr><td class="nowrap"><span class="lvl-pill lvl-${esc(lv[i].level.split(' ')[0])}">${esc(lv[i].level)}</span></td><td>${esc(lv[i].idea)}</td><td class="nowrap"><span class="cx">${esc(lv[i].time)}</span></td><td class="nowrap"><span class="cx">${esc(lv[i].space)}</span></td></tr>`).join('')}
      </tbody></table>
      ${noBetterNote(lv)}
      <div class="ap-tabs" data-q="${key}">${order.map(i => `<button class="ap-tab lvl-${lv[i].level} ${i === best ? 'on' : ''}" data-ap="${i}">${esc(lv[i].level)}</button>`).join('')}</div>
      ${order.map(i => `<div class="ap-body" data-q="${key}" data-ap="${i}" ${i === best ? '' : 'hidden'}>${codeBlock(lv[i].code)}</div>`).join('')}
      ${hasViz(num) ? `<p><a class="btn small" href="#/${m.phase.id}/visualize/${num}">▶ Teeno ko visualizer me chalao (Brute | Better | Optimal tabs)</a></p>` : ''}`;
  }
  // learn day ke "Thinking" part ke baad comparison part
  function withCompare(parts, d) {
    if (!d || d.type !== 'learn' || !d.qs || !d.qs.length) return parts;
    const html = d.qs.map(compareHtml).join('<hr class="cmp-sep">');
    if (!html) return parts;
    const part = { title: '⚖️ Brute → Better → Optimal — ' + d.qs.map(n => 'LC ' + n).join(', '), html };
    let at = parts.findIndex(pt => /Thinking/i.test(pt.title));
    if (at < 0) at = parts.findIndex(pt => (pt.blocks || []).some(b => b.problem));
    const out = parts.slice();
    out.splice(at < 0 ? Math.min(2, out.length) : at + 1, 0, part);
    return out;
  }

  // ---- ✍️ Try-first mode: problem ke baad box, solution wale parts lock ----
  // 2026-11-08: user ke kehne pe abhi BAND. Wapas chahiye toh true karo.
  const TRY_ENABLED = false;
  const tryActive = lc => !!(window.LEARN && lc && !LEARN.tryOff() && !(LEARN.tryRec(lc) || {}).done);
  const isSolutionPart = pt => !!pt.html || /Thinking|Dry run|Java code|Visuali|Algorithm/i.test(pt.title) || (pt.blocks || []).some(b => b.code || b.lines || b.viz);
  function tryBoxHtml(lc, practice) {
    const m = qMeta(lc), q = m && CONTENT[m.phase.id] && CONTENT[m.phase.id].questions[lc];
    if (!window.LEARN || !q) return '';
    const rec = LEARN.tryRec(lc), mins = LEARN.TIMER_MIN[m.diff] || 20;
    if (rec && rec.done && !practice) {
      const how = rec.solution ? '🔓 Solution dekh ke samjha' : rec.hints === 0 ? '✅ Khud kiya — bina hint' : '✅ Khud kiya — ' + rec.hints + ' hint ke saath';
      return `<div class="card part try-part done" id="part-try" data-try-done-lc="${lc}"><h3>🧠 Try — LC ${lc} ${esc(m.name)}</h3>
        <p><b>Pehli koshish:</b> ${how} · ${Math.max(1, Math.round((rec.secs || 0) / 60))} min · XP <b>+${[40, 20, 0][rec.solution ? 2 : Math.min(rec.hints, 2)]}</b></p>
        <label class="muted small">Mera approach (edit kar sakte ho — save rehta hai):</label>
        <textarea class="try-note" rows="3" placeholder="Mera approach: pattern kya? brute kya? optimal kya aur kyun?"></textarea>
        <details class="try-hint-box"><summary>💡 Hints dekho</summary><p class="try-h">💡 <b>Hint 1 — Pattern:</b> ${esc(q.pattern)}</p><p class="try-h">💡 <b>Hint 2 — Idea:</b> ${esc(q.oneLine)}</p></details>
        <div class="try-row"><button class="btn" data-try-retry>🔁 Dobara try karo (practice)</button><span class="muted small">Solution phir lock hoga + timer. XP pehli koshish pe mil chuka — ye sirf practice.</span></div>
      </div>`;
    }
    if (LEARN.tryOff()) return `<div class="card part try-part off" id="part-try"><p class="muted small">✍️ Try mode band hai — solution seedha dikh raha hai. <button class="btn small" data-try-on>Try mode on karo</button></p></div>`;
    return `<div class="card part try-part" id="part-try" data-try-lc="${lc}" data-mins="${mins}" ${practice ? 'data-practice="1"' : ''}>
      <h3>🧠 ${practice ? '🔁 Practice round' : 'Pehle khud try karo'} — LC ${lc} ${esc(m.name)}</h3>
      <p class="muted small">Neeche ka solution, code aur visualizer abhi <b>lock</b> hai. Interview me koi solution nahi dikhata — pehle khud socho. Bina hint khud kiya toh <b>+40 XP</b>, 1 hint pe +20.</p>
      <textarea class="try-note" rows="3" placeholder="Mera approach: pattern kya? brute kya? optimal kya aur kyun? (sirf tumhare liye, save rahega)"></textarea>
      <div class="try-row"><span class="try-timer">⏱ <b>${mins}:00</b> <span class="muted small">(${m.diff} · ${mins} min)</span></span>
        <button class="btn" data-try-hint>💡 Hint 1</button>
        <button class="btn primary" data-try-self>✅ Maine khud kar liya</button>
        <button class="btn" data-try-sol>🔓 Solution dikhao</button>
        <button class="btn small th-off" data-try-off title="Sohvi / revision ke liye">Try mode band</button></div>
      <div class="try-hints"></div>
    </div>`;
  }
  function bindNote(box, lc) {
    const note = box.querySelector('.try-note'); if (!note) return;
    try { note.value = (JSON.parse(localStorage.getItem('dsa-trynote-v1') || '{}'))[lc] || ''; } catch (e) { /* ignore */ }
    note.addEventListener('input', () => { try { const o = JSON.parse(localStorage.getItem('dsa-trynote-v1') || '{}'); o[lc] = note.value; localStorage.setItem('dsa-trynote-v1', JSON.stringify(o)); } catch (e) { /* ignore */ } });
  }
  function mountTry(root) {
    const doneBox = root.querySelector('.try-part[data-try-done-lc]');
    if (doneBox && window.LEARN) {
      const dlc = Number(doneBox.dataset.tryDoneLc);
      bindNote(doneBox, dlc);
      doneBox.querySelector('[data-try-retry]').addEventListener('click', () => {
        root.querySelectorAll('.part[data-sol]').forEach(x => x.classList.add('locked'));   // solution phir lock
        doneBox.outerHTML = tryBoxHtml(dlc, true);
        mountTry(root);
        const nb = root.querySelector('#part-try'); if (nb) nb.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
    const box = root.querySelector('.try-part[data-try-lc]'); if (!box || !window.LEARN) return;
    const practice = box.dataset.practice === '1';
    const lc = Number(box.dataset.tryLc), m = qMeta(lc), q = CONTENT[m.phase.id].questions[lc];
    const t0 = Date.now(), mins = Number(box.dataset.mins);
    let hints = 0;
    bindNote(box, lc);
    const tEl = box.querySelector('.try-timer b');
    const tick = setInterval(() => {
      if (!document.body.contains(box)) return clearInterval(tick);
      const left = mins * 60 - Math.floor((Date.now() - t0) / 1000), a = Math.abs(left);
      tEl.textContent = (left < 0 ? '+' : '') + Math.floor(a / 60) + ':' + String(a % 60).padStart(2, '0');
      box.classList.toggle('over', left < 0);
    }, 1000);
    const finish = rec => {
      clearInterval(tick);
      const secs = Math.round((Date.now() - t0) / 1000);
      if (!practice) LEARN.finishTry(lc, Object.assign({ hints, secs }, rec));
      root.querySelectorAll('.part.locked').forEach(x => x.classList.remove('locked'));
      box.outerHTML = tryBoxHtml(lc);
      mountTry(root);
      if (practice) {
        const res = rec.solution ? '🔓 solution dekha' : hints === 0 ? '✅ bina hint khud kiya!' : '✅ ' + hints + ' hint ke saath kiya';
        const nb = root.querySelector('#part-try');
        if (nb) nb.insertAdjacentHTML('beforeend', '<p class="try-practice-res">🔁 Practice result: <b>' + res + '</b> · ' + Math.max(1, Math.round(secs / 60)) + ' min</p>');
      }
      if (window.GAME) { GAME.touch(); GAME.refresh(); }
    };
    box.querySelector('[data-try-hint]').addEventListener('click', e => {
      hints++;
      const h = box.querySelector('.try-hints');
      if (hints === 1) { h.innerHTML += '<p class="try-h">💡 <b>Hint 1 — Pattern:</b> ' + esc(q.pattern) + '</p>'; e.target.textContent = '💡 Hint 2'; }
      else { h.innerHTML += '<p class="try-h">💡 <b>Hint 2 — Idea:</b> ' + esc(q.oneLine) + '</p>'; e.target.remove(); }
    });
    box.querySelector('[data-try-self]').addEventListener('click', () => finish({ self: true }));
    box.querySelector('[data-try-sol]').addEventListener('click', () => finish({ solution: true }));
  }

  // ⌨️ Auto typing (typing.js rules): Part 0 me revision (roz: Optimal + important doosra version; revision day: saare levels)
  const TY_HELP = 'Gray comment har line ka matlab batata hai (type nahi karna). Galat key → laal; indent apne aap; line ke end pe Enter.';
  // 🔁 Revision gaps (TYPING.revGaps): kal / is hafte ke jo questions revision me nahi likhe — apne aap jud jaate hain
  let _gdays = null;
  function gDays() {
    if (_gdays) return _gdays;
    _gdays = {};
    ROADMAP.forEach(p => { const c = CONTENT[p.id]; ((c && c.days) || []).forEach(d => { _gdays[globalDay(p, d.day)] = { type: d.type, qs: d.qs || [], L: lessonOf(c, d.day) }; }); });
    return _gdays;
  }
  const qName = n => (qMeta(n) || {}).name || 'LC ' + n;
  const revGaps = (p, d) => (window.TYPING && TYPING.revGaps ? TYPING.revGaps(gDays(), globalDay(p, d.day)) : []);
  function revGapHtml(p, d) {
    const g = revGaps(p, d);
    if (!g.length) return '';
    const why = d.type === 'learn' ? 'Kal ke ye questions upar ke revision me nahi the' : 'Is hafte ke ye questions upar ki list me nahi the';
    return `<h4 class="lh">🔁 Ye bhi revise karo</h4><p class="muted small">${why} — revision sab questions ka hona chahiye. Optimal yaad karo, phir neeche type karo.</p><ul>${g.map(n => { const m = qMeta(n), q = m && CONTENT[m.phase.id] && CONTENT[m.phase.id].questions[n]; return `<li><a href="#/${m.phase.id}/questions/${n}"><b>LC ${n} — ${esc(m.name)}</b></a>${hasViz(n) ? ` · <a class="small" href="#/${m.phase.id}/visualize/${n}">▶ Visualize</a>` : ''}${q && q.oneLine ? `<div class="muted small">${esc(q.oneLine)}</div>` : ''}</li>`; }).join('')}</ul>`;
  }
  function revTypingHtml(L, d, p) {
    if (!window.TYPING) return '';
    const isRevDay = d && d.type === 'revision' && (d.qs || []).length;
    const extra = p ? revGaps(p, d).map(n => ({ n, name: qName(n) })) : [];
    const t = isRevDay ? TYPING.qsBlock(d.qs.map(n => ({ n, name: qName(n) })).concat(extra), 'all') : TYPING.revisionBlock(L, 'daily', extra);
    if (!t) return '';
    return `<h4 class="lh">⌨️ Typing se revision${isRevDay ? ' — saare levels (revision day)' : ''}</h4><p class="muted small">${isRevDay ? 'Hafte ke questions ke Brute → Optimal sab type karo.' : 'Upar wale questions ka <b>Optimal</b> yaad se type karo (Brute ka idea upar 1 line me — type nahi).'} ${TY_HELP}</p>${TYPING.html(t)}`;
  }
  // Learn day: main question ka Brute → (Better) → Optimal typing part, Visualize part ke baad (lesson me haath ka typing block ho toh nahi)
  // Din ke HAR question (main pehle) ka typing part — us question ke aakhri Visualize part ke baad (na ho toh uske problem/code part ke baad, warna end me)
  function withLearnTyping(parts, L, d) {
    if (!window.TYPING || !d || d.type !== 'learn') return parts;
    return TYPING.withLearn(parts, L, d, qName, (t, n, isMain) => ({ title: `⌨️ Typing practice — LC ${n}: Brute → Optimal`, html: `<p class="muted small">${isMain ? 'Aaj ka code' : `LC ${n} ka code`} haath se type karo — samajh + muscle memory. ${TY_HELP}</p>${TYPING.html(t)}` }));
  }
  function renderLesson(p, c, day) {
    const L = lessonOf(c, day), d = c.days.find(x => String(x.day) === String(day));
    if (!L || !d) return `<div class="card notice">Day ${esc(day)} ka lesson abhi nahi bana. <a href="#/${p.id}/daily">← Daily Plan</a></div>`;
    const n = globalDay(p, d.day), got = lessonDone[n] || [], mm = qMeta(L.main);
    let parts = withLearnTyping(withCompare(L.parts, d), L, d);
    const tryLc = d.type === 'learn' ? (L.main || (d.qs && d.qs[0])) : null;
    const probAt = tryLc ? parts.findIndex(pt => (pt.blocks || []).some(b => b.problem === tryLc)) : -1;
    if (TRY_ENABLED && probAt >= 0 && window.LEARN) {
      const lock = tryActive(tryLc);
      parts = parts.map((pt, i) => (i > probAt && isSolutionPart(pt) ? Object.assign({}, pt, { sol: true, locked: lock }) : pt));
      parts.splice(probAt + 1, 0, { title: '🧠 Pehle khud try karo', tryHtml: tryBoxHtml(tryLc) });
    }
    return `<div class="lesson">
      <a href="#/${p.id}/daily" class="small">← Daily Plan</a>
      <div class="muted" style="margin-top:8px">Phase ${p.phase} · Week ${globalWeek(p, d.week)} · ${esc(d.dow)}</div>
      <h1>Day ${n} — ${esc(L.title)}</h1>
      <div class="card goal"><p><b>🎯 Goal:</b> ${L.goal}</p>
        ${mm ? `<p><b>Aaj ka main problem:</b> <a href="#/${mm.phase.id}/questions/${L.main}">LC ${L.main} — ${esc(mm.name)}</a></p>` : ''}${warmupNudge(p, d)}</div>
      <div class="lesson-bar" id="lessonBar" data-day="${d.day}" data-n="${n}">${lessonProgress(c, day, n)}</div>
      ${d.type === 'mock' && window.GAME && GAME.bossPool(globalWeek(p, d.week)).length >= 5 ? `<a class="btn boss-cta" href="#/play/boss/${globalWeek(p, d.week)}">🐲 Week ${globalWeek(p, d.week)} Boss se lado — ${esc(GAME.bossName(globalWeek(p, d.week)))}</a>` : ''}
      <nav class="part-nav">${parts.map((pt, i) => `<button data-goto="part-${i}" title="${esc(pt.title)}">${esc(pt.title.split(' — ')[0])}</button>`).join('')}${L.quiz ? '<button data-goto="part-quiz">🎯 Quiz</button>' : ''}<button data-goto="part-done">✅ Complete</button></nav>
      ${parts.map((pt, i) => pt.tryHtml !== undefined ? pt.tryHtml : `<details class="card part ${pt.html ? 'cmp-part' : ''} ${pt.locked ? 'locked' : ''}" ${pt.sol ? 'data-sol="1"' : ''} id="part-${i}" open>
        <summary><h3>${esc(pt.title)}</h3></summary>
        <div class="part-body">${pt.html || pt.blocks.map(b => lessonBlock(p, b)).join('')}${i === 0 ? revGapHtml(p, d) + revTypingHtml(L, d, p) : ''}</div>
      </details>`).join('')}
      ${L.quiz && window.GAME ? GAME.quizPartHtml(n, L.quiz) : ''}
      <div class="card part" id="part-done">
        <h3>✅ Day ${n} — Self-check (optional)</h3>
        <p class="muted small">Khud se pucho ye sab aata hai ya nahi. Tick karna zaroori nahi — upar/neeche ka ek button hi kaafi hai.</p>
        <ul class="checks">${L.checks.map((t, i) => `<li><label><input type="checkbox" data-lcheck="${n}:${i}" ${got.includes(i) ? 'checked' : ''}> ${esc(t)}</label></li>`).join('')}</ul>
        <div class="memory"><b>🧠 Aaj ki memory line:</b> ${esc(L.memory)}</div>
        <p style="margin-top:12px">${dayToggleBtn(n)}</p>
      </div>
    </div>`;
  }

  const DAY_TYPE = { learn: ['New topic', 'learn'], revision: ['Revision', 'revision'], mock: ['Mock + Contest', 'mock'] };

  function dayCard(p, c, d) {
    const [tl, tc] = DAY_TYPE[d.type] || DAY_TYPE.learn;
    const qRow = (n, i) => {
      const m = qMeta(n), qc = CONTENT[m.phase.id], q = qc && qc.questions[n], pid = m.phase.id;
      const lvl = d.type === 'learn' ? (i === 0 ? '<span class="tag tag-must">MUST</span>' : '<span class="tag tag-push">PUSH</span>') : '';
      return `<li>${lvl}${check(n)}<a href="#/${pid}/questions/${n}"><b>${n}. ${esc(m.name)}</b></a> <span class="badge diff-${m.diff}">${m.diff}</span>${pid !== p.id ? `<span class="muted small">(Phase ${m.phase.phase})</span>` : ''}${hasViz(n) ? `<a class="small" href="#/${pid}/visualize/${n}">▶ viz</a>` : ''}<div class="muted">${esc(q ? q.oneLine : '')}</div></li>`;
    };
    const extra = (d.extra || []).map(n => `<a class="chip" href="#/${p.id}/questions/${n}">${n}. ${esc(qMeta(n).name)}</a>`).join('');
    return `<div class="card day day-${tc}">
        <div class="row"><h3><span class="dnum">Day ${globalDay(p, d.day)}</span> ${esc(d.dow)} — ${esc(d.title)}</h3>${window.GAME ? GAME.quizBadge(globalDay(p, d.day)) : ''}<span class="tag tag-${tc}">${tl}</span></div>
        <div class="chips">${d.theory.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
        <p class="row wrap">${lessonOf(c, d.day) ? `<a class="btn primary" href="#/${p.id}/day/${d.day}">📖 Day ${globalDay(p, d.day)} lesson kholo</a>` : ''}${dayToggleBtn(globalDay(p, d.day))}</p>
        ${d.type === 'mock' ? '<p class="muted small">Mock questions (bina solution dekhe):</p>' : d.type === 'revision' ? '<p class="muted small">Re-solve karo — min 3, time ho toh 4:</p>' : !d.qs.length ? '<p class="muted small">Aaj koi LeetCode nahi — concept + implementation day. Lesson kholo.</p>' : '<p class="muted small">Dono same question · MUST zaroor · PUSH jab time ho</p>'}
        <ol class="day-qs">${d.qs.map(qRow).join('')}</ol>
        ${extra ? `<details class="extra"><summary class="muted small">Same topic extra practice (optional) — ${d.extra.length}</summary><div class="chips">${extra}</div></details>` : ''}
        ${d.qs.length ? `<div class="row"><span class="muted small">${d.qs.filter(n => done.has(n)).length}/${d.qs.length} done</span></div>` : ''}
        <details class="ivw"><summary>🎤 Aaj ka 1-minute interview answer: <b>${esc(d.interview.q)}</b></summary><p>${esc(d.interview.a)}</p></details>
      </div>`;
  }

  function tabDaily(p, c) {
    const weeks = [...new Set(c.days.map(d => d.week))];
    return `<p class="muted">Mon–Fri: roz 1 topic, dono same questions — 1 MUST + 1 PUSH (min 1, max 2) · Sat: revision (3–4) · Sun: mock interview + LeetCode Weekly Contest. Roz meet 9:00–10:30 PM.</p>
      <div class="week-strip">${c.days.map(d => `<button data-goto="day-${d.day}" class="ws ws-${d.type} ${daysDone.has(globalDay(p, d.day)) ? 'full' : ''}" title="${esc(d.title)}">${globalDay(p, d.day)}<small>${esc(d.dow)}</small></button>`).join('')}</div>` +
      weeks.map(w => `<h2 id="week-${globalWeek(p, w)}" class="week-h">Week ${globalWeek(p, w)} <span class="muted small">· Day ${globalDay(p, (w - 1) * 7 + 1)}–${globalDay(p, w * 7)}</span></h2>` + c.days.filter(d => d.week === w).map(d => `<div id="day-${d.day}">${dayCard(p, c, d)}</div>`).join('')).join('');
  }

  function tabLast(p, c) {
    const L = c.lastMinute;
    return `
      <div class="card"><h3>⚡ Signal → Pattern</h3><table class="tbl"><thead><tr><th>Question me ye dikhe</th><th>Ye lagao</th></tr></thead><tbody>
        ${L.triggers.map(([s, t]) => `<tr><td>${esc(s)}</td><td><b>${esc(t)}</b></td></tr>`).join('')}</tbody></table></div>
      <div class="card"><h3>📝 Saare questions — ek line me</h3><table class="tbl"><tbody>
        ${allQs(p).map(q => { const qq = c.questions[q[0]]; return `<tr><td class="nowrap"><a href="#/${p.id}/questions/${q[0]}">${q[0]}. ${esc(q[1])}</a></td><td>${esc(qq ? qq.oneLine : '')}</td><td class="nowrap"><span class="cx">${esc(qq ? qq.approaches[qq.approaches.length - 1].time : '')}</span></td></tr>`; }).join('')}
      </tbody></table></div>
      <div class="grid2">
        <div class="card"><h3>🧪 Edge cases</h3><ul>${L.edge.map(e => `<li>${esc(e)}</li>`).join('')}</ul></div>
        <div class="card"><h3>❌ Common mistakes</h3><ul>${L.mistakes.map(e => `<li>${esc(e)}</li>`).join('')}</ul></div>
      </div>
      <div class="card"><h3>🎤 1-minute answers (revision)</h3>${c.days.map(d => `<details class="ivw"><summary><span class="muted">Day ${globalDay(p, d.day)} ·</span> <b>${esc(d.interview.q)}</b></summary><p>${esc(d.interview.a)}</p></details>`).join('')}</div>`;
  }

  // ---- Tab guide: har tab ka kaam + kab kholna ----
  const TAB_HELP = {
    fundamentals: ['Topic ki neev — data structure kya hai, memory me kaise rehta hai, Java syntax, yaad rakhne wali baatein.', 'Phase ke pehle din se pehle 10–15 min, ya basic doubt aaye tab.'],
    operations: ['Har operation (access, search, insert, delete…) ki time complexity, "kyun", aur Java code.', 'Interview / mock se pehle complexity revise karni ho.'],
    patterns: ['Is topic ke patterns — signal (kab lagta hai), idea, code template, aur kaunse questions me.', 'Week ke end (Saturday) — "kaunsa question kis pattern ka" pakka karne ke liye.'],
    visualize: ['Saare questions ke visualizer ek jagah — Brute / Better / Optimal tabs, apna input, line-by-line debugger.', 'Kisi bhi question ka dry run dobara dekhna ho.'],
    questions: ['Har question ka poora page — problem, teeno approaches + code, dry run, interview answer, ✔ Done.', 'Question solve karne ke baad ✔ Done lagao (mission + XP), aur revision ke liye.'],
    daily: ['Din-wise lessons — <b>asli roz ki padhai yahi hai</b>. Lesson ke andar theory, visualizer, quiz sab hai.', '<b>Roz</b> — Home ke "Aaj ke mission" se ya yahan se aaj ka lesson kholo.'],
    last: ['Signal → Pattern table, saare questions ek line me, edge cases, common mistakes.', 'Mock / interview se ek din pehle.'],
  };
  const helpOff = () => { try { return localStorage.getItem('dsa-tabhelp-off') === '1'; } catch (e) { return false; } };
  function tabHelpHtml(tab) {
    const h = TAB_HELP[tab];
    if (!h || helpOff()) return '';
    return `<div class="tab-help ${tab === 'daily' ? 'main' : ''}"><span class="th-i">ℹ️</span><div><b>Is tab ka kaam:</b> ${h[0]}<br><b>Kab kholo:</b> ${h[1]}</div><button class="th-x" data-tabhelp-off title="Guide band karo (Home se wapas on)">✕</button></div>`;
  }
  function usageGuideHtml() {
    let open = true;
    try { open = localStorage.getItem('dsa-guide-seen') !== '1'; localStorage.setItem('dsa-guide-seen', '1'); } catch (e) { /* ignore */ }
    const rows = [['fundamentals', 'Fundamentals'], ['operations', 'Operations'], ['patterns', 'Patterns'], ['visualize', 'Visualize'], ['questions', 'Questions'], ['daily', 'Daily Plan ⭐'], ['last', 'Last Minute']];
    return `<details class="card guide-card" ${open ? 'open' : ''}><summary><h3>📖 App kaise use karein</h3></summary>
      <h4>Roz ka routine (9:00–10:30 PM)</h4>
      <ol class="guide-steps">
        <li><b>Home</b> → "🎯 Aaj ke mission" dekho</li>
        <li>Aaj ka <b>lesson</b> kholo (Daily Plan) — theory, ⚖️ Brute → Better → Optimal, dry run, code</li>
        <li>Lesson ka <b>visualizer</b> ⛶ full screen me chalao (Next / → se line-by-line, 🎯 Quiz mode)</li>
        <li><b>LeetCode</b> pe solve karo → question pe <b>✔ Done</b></li>
        <li>Lesson ke end me <b>🎯 Day Quiz</b> (5 sawaal) → <b>Day complete</b> ek click</li>
        <li>Home → <b>⚡ Speed Round</b> → <b>🎁 Chest</b>. Sunday ko <b>🐲 Boss Battle</b></li>
      </ol>
      <h4>Phase ke tabs — kaunsa kab</h4>
      <table class="tbl"><thead><tr><th>Tab</th><th>Kaam</th><th>Kab kholo</th></tr></thead><tbody>
        ${rows.map(([k, l]) => `<tr class="${k === 'daily' ? 'guide-main' : ''}"><td class="nowrap"><b>${l}</b></td><td>${TAB_HELP[k][0]}</td><td>${TAB_HELP[k][1]}</td></tr>`).join('')}
      </tbody></table>
      <p class="muted small">Har tab ke upar bhi ye guide line dikhti hai. ${helpOff() ? '<button class="btn small" data-tabhelp-on>Tab guide wapas on karo</button>' : ''}</p>
    </details>`;
  }

  function renderPhase(p, tab, extra, more) {
    const c = CONTENT[p.id];
    const head = `<section class="phase-head">
      <div class="muted">Phase ${p.phase} · ${esc(p.weeks)}</div>
      <h1>${esc(p.title)}</h1>
      <div class="chips">${p.topics.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
    </section>`;
    if (!c) {
      return head + `<div class="card notice">Is phase ka detail content (fundamentals, Brute/Better/Optimal, visualizer, daily plan) abhi add nahi hua. Jab ye phase shuru ho, Claude ko bolo: <b>"Phase ${p.phase} ${esc(p.title)} ka content bana do"</b>.</div>` +
        (p.qs.length ? p.qs.map(q => questionCard(p, null, q[0])).join('') : '');
    }
    tab = tab || 'fundamentals';
    if (tab === 'day') return renderLesson(p, c, extra);
    const tabs =`<nav class="tabs">${TABS.map(([k, l]) => `<a href="#/${p.id}/${k}" class="${k === tab ? 'on' : ''}">${l}${k === 'daily' ? ' <span class="roz">⭐ Roz</span>' : ''}</a>`).join('')}</nav>` + tabHelpHtml(tab);
    let body = '';
    if (tab === 'fundamentals') body = tabFundamentals(c, p);
    if (tab === 'operations') body = tabOperations(c);
    if (tab === 'patterns') body = tabPatterns(p, c);
    if (tab === 'visualize') body = tabVisualize(p, c, extra, more);
    if (tab === 'questions') body = tabQuestions(p, c, extra);
    if (tab === 'daily') body = tabDaily(p, c);
    if (tab === 'last') body = tabLast(p, c);
    return head + tabs + `<div class="tab-body">${body}</div>`;
  }

  // ---------- Router ----------
  function route() {
    const parts = (location.hash.replace(/^#\/?/, '') || 'home').split('/');
    const [id, tab, extra, more] = parts;
    const main = $('#main');
    const p = phaseById(id);
    if (id === 'play' && window.GAME) { renderNav('home'); main.innerHTML = GAME.renderPlay(tab, extra); GAME.mountPlay(main); window.scrollTo(0, 0); }
    else if (id === 'switch-prep' && window.PLANSEC) { renderNav('switch-prep'); main.innerHTML = PLANSEC.render(tab); PLANSEC.mount(main, tab); window.scrollTo(0, 0); }
    else if (!p) { renderNav('home'); main.innerHTML = renderHome(); }
    else {
      renderNav(p.id);
      main.innerHTML = renderPhase(p, tab, extra, more);
      document.querySelectorAll('.viz-mount').forEach(vm => window.VIZ.mount(vm, vm.dataset.viz, vm.dataset.ex, vm.dataset.variant));
      if (window.PLANSEC) PLANSEC.mountPending(main);
      if (window.TYPING) TYPING.mount(main);
      if (window.GAME) GAME.mountQuizzes(main);
      mountTry(main);
      if ((tab === 'daily' || tab === 'fundamentals') && extra) {
        const el = document.getElementById(extra);
        if (el) el.scrollIntoView({ block: 'start' }); else window.scrollTo(0, 0);
      } else if (tab === 'questions' && extra) {
        const el = document.getElementById('q-' + extra);
        if (el) el.scrollIntoView({ block: 'start' });
      } else window.scrollTo(0, 0);
    }
    if (window.hljs) main.querySelectorAll('pre code').forEach(b => window.hljs.highlightElement(b));
    document.body.classList.remove('nav-open');
  }

  // ---------- Events ----------
  document.addEventListener('click', e => {
    if (window.PLANSEC && PLANSEC.onClick(e)) return;   // Switch Prep: "▶ Visualize this example"
    const sds = e.target.closest('[data-startday-set], [data-startday-reset]');
    if (sds) {
      const inp = $('#startDayIn'), n = sds.hasAttribute('data-startday-reset') ? 1 : Math.floor(Number(inp && inp.value));
      if (!(n >= 1 && n <= TOTAL_DAYS)) { if (inp) inp.focus(); return; }
      setStartDay(n);
      route();
      if (window.GAME) GAME.refresh();
      return;
    }
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
    const dt = e.target.closest('[data-daytoggle]');
    if (dt) {
      const n = Number(dt.dataset.daytoggle);
      const on = !daysDone.has(n);
      on ? daysDone.add(n) : daysDone.delete(n);
      saveDays();
      // ek click = poora din: us din ke lesson ke saare self-check bhi tick / untick
      const info = dayInfo(n), c = info.p && CONTENT[info.p.id];
      const local = info.p ? n - (weekRange(info.p)[0] - 1) * 7 : n, L = c && lessonOf(c, local);
      if (L) {
        lessonDone[n] = on ? L.checks.map((_, i) => i) : [];
        saveLesson();
        document.querySelectorAll(`[data-lcheck^="${n}:"]`).forEach(x => { x.checked = on; });
      }
      refreshDay(n);
      refreshLessonBar();
      if (window.GAME) { if (on) GAME.touch(); GAME.refresh(); }
      return;
    }
    const go = e.target.closest('[data-goto]');
    if (go) {
      const t = document.getElementById(go.dataset.goto);
      if (t) { if (t.tagName === 'DETAILS') t.open = true; t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      return;
    }
    if (e.target.closest('[data-try-off]')) { if (window.LEARN) LEARN.setTryOff(true); route(); return; }
    if (e.target.closest('[data-try-on]')) { if (window.LEARN) LEARN.setTryOff(false); route(); return; }
    if (e.target.closest('[data-tabhelp-off]')) { try { localStorage.setItem('dsa-tabhelp-off', '1'); } catch (err) { /* ignore */ } const h = e.target.closest('.tab-help'); if (h) h.remove(); return; }
    if (e.target.closest('[data-tabhelp-on]')) { try { localStorage.removeItem('dsa-tabhelp-off'); } catch (err) { /* ignore */ } route(); return; }
    const fl = e.target.closest('[data-filter]');
    if (fl) { window.__qFilter = fl.dataset.filter; route(); return; }
    if (e.target.closest('#menuBtn')) {
      if (window.innerWidth <= 820) document.body.classList.toggle('nav-open');
      else {
        const c = document.body.classList.toggle('nav-collapsed');
        try { localStorage.setItem('dsa-nav', c ? 'closed' : 'open'); } catch (err) { /* ignore */ }
      }
    }
  });
  // summary ke andar Done checkbox: card toggle na ho, sirf checkbox badle
  document.addEventListener('click', e => {
    const box = e.target.closest('summary .done-box');
    if (!box) return;
    e.preventDefault();
    const cb = box.querySelector('input');
    cb.checked = !cb.checked;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
  }, true);
  document.addEventListener('change', e => {
    const lc = e.target.closest('[data-lcheck]');
    if (lc) {
      const [ns, i] = lc.dataset.lcheck.split(':'), n = Number(ns);
      const set = new Set(lessonDone[n] || []);
      lc.checked ? set.add(Number(i)) : set.delete(Number(i));
      lessonDone[n] = [...set];
      saveLesson();
      if (lessonComplete(n) && !daysDone.has(n)) { daysDone.add(n); saveDays(); refreshDay(n); }
      refreshLessonBar();
      if (window.GAME) { if (lc.checked) GAME.touch(); GAME.refresh(); }
      return;
    }
    const cb = e.target.closest('[data-done]');
    if (!cb) return;
    const n = Number(cb.dataset.done);
    cb.checked ? done.add(n) : done.delete(n);
    saveDone();
    document.querySelectorAll(`[data-done="${n}"]`).forEach(x => { x.checked = cb.checked; });
    const cur = (location.hash.replace(/^#\/?/, '') || 'home').split('/')[0];
    renderNav(phaseById(cur) || cur === 'switch-prep' ? cur : 'home');
    if (cb.checked && window.LEARN) LEARN.onDone(n);
    if (window.GAME) { if (cb.checked) GAME.touch(); GAME.refresh(); }
  });

  window.addEventListener('hashchange', route);
  route();
  if (window.GAME) GAME.refresh();
})();
