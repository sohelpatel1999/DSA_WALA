// Game layer (2026-11-08): Daily Quiz · XP / Level / Streak / Daily Missions · Speed Round · Boss Battle.
// Sab localStorage me. XP progress se CALCULATE hota hai (days, done questions, quiz scores…) — undo pe apne aap ghatta hai,
// kabhi double count nahi. app.js se pehle load hota hai; app.js GAME.* call karta hai.
(function () {
  const R = window.ROADMAP || [], C = window.PHASE_CONTENT || {};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ls = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } };
  const pad = x => String(x).padStart(2, '0');
  const dateStr = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const today = () => (window.LEARN ? LEARN.today() : dateStr(new Date()));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ---- storage keys ----
  const K = { days: 'dsa-days-v1', done: 'dsa-done-v1', lesson: 'dsa-lesson-v1', quiz: 'dsa-quiz-v1', speed: 'dsa-speed-v1', boss: 'dsa-boss-v1',
    vizq: 'dsa-vizq-v1', chest: 'dsa-chest-v1', act: 'dsa-activity-v1', xpday: 'dsa-xpday-v1', mission: 'dsa-mission-v1', level: 'dsa-level-v1', mute: 'dsa-mute', start: 'dsa-start-day' };

  // ---- course helpers (app.js jaisa) ----
  const weekRange = p => { const m = p.weeks.match(/\d+/g).map(Number); return [m[0], m[m.length - 1]]; };
  const TOTAL_DAYS = R.length ? Math.max(...R.map(p => weekRange(p)[1])) * 7 : 0;
  const phaseOfWeek = w => R.find(p => { const [a, b] = weekRange(p); return w >= a && w <= b; });
  function dayData(n) {
    const w = Math.ceil(n / 7), p = phaseOfWeek(w), c = p && C[p.id];
    if (!p || !c) return { n, w, p };
    const local = n - (weekRange(p)[0] - 1) * 7;
    return { n, w, p, c, local, d: (c.days || []).find(x => x.day === local), L: c.lessons && c.lessons[local], href: '#/' + p.id + '/day/' + local };
  }
  const qByNum = num => { for (const k in C) if (C[k].questions && C[k].questions[num]) return C[k].questions[num]; return null; };
  const qName = num => { for (const p of R) for (const q of p.qs) if (q[0] === Number(num)) return q[1]; return 'LC ' + num; };

  // ---- pattern maps (report + revision ke liye) ----
  function patternMaps() {
    const lcPattern = {}, dayPattern = {};
    Object.values(C).forEach(c => Object.entries(c.questions || {}).forEach(([lc, q]) => { if (q.pattern) lcPattern[lc] = q.pattern; }));
    R.forEach(p => {
      const c = C[p.id]; if (!c || !c.days) return;
      c.days.forEach(d => {
        const L = c.lessons && c.lessons[d.day], main = (L && L.main) || (d.qs && d.qs[0]);
        if (main && lcPattern[main]) dayPattern[(weekRange(p)[0] - 1) * 7 + d.day] = lcPattern[main];
      });
    });
    return { lcPattern, dayPattern };
  }

  // ---- XP ----
  const XP = { day: 100, done: 30, check: 5, quiz: 20, perfect: 50, speedPt: 5, boss: 200, vizq: 5, vizqMax: 10, chest: 50 };
  function totalXP() {
    const days = ls(K.days, []), done = ls(K.done, []), les = ls(K.lesson, {}), qz = ls(K.quiz, {}), sp = ls(K.speed, {}), boss = ls(K.boss, {}), vq = ls(K.vizq, {}), ch = ls(K.chest, {});
    let x = days.length * XP.day + done.length * XP.done;
    Object.values(les).forEach(a => { x += (a || []).length * XP.check; });
    Object.values(qz).forEach(r => { x += (r.first || 0) * XP.quiz + (r.first === 5 ? XP.perfect : 0); });
    Object.values(sp.days || {}).forEach(b => { x += b * XP.speedPt; });
    x += Object.keys(boss).length * XP.boss;
    Object.values(vq).forEach(c => { x += Math.min(c, XP.vizqMax) * XP.vizq; });
    x += Object.keys(ch).length * XP.chest;
    if (window.LEARN) x += LEARN.reviewXP() + LEARN.tryXPTotal();
    return x;
  }
  // ---- Levels: L ke liye 75·(L−1)·L XP ----
  const NAMES = ['Newbie Coder', 'Array Apprentice', 'Loop Rider', 'Hash Hunter', 'Prefix Pro', 'Pointer Ninja', 'Window Wizard', 'Stack Samurai',
    'Search Sniper', 'Tree Climber', 'Heap Hero', 'Backtrack Boss', 'Graph Ranger', 'DP Master', 'SDE-2 Legend'];
  const need = L => 75 * (L - 1) * L;
  function levelOf(x) {
    let L = 1;
    while (L < NAMES.length && x >= need(L + 1)) L++;
    const lo = need(L), hi = L < NAMES.length ? need(L + 1) : lo;
    return { L, name: NAMES[L - 1], lo, hi, pct: hi > lo ? (x - lo) / (hi - lo) : 1 };
  }
  // ---- Streak (calendar din jinme kuch kiya) ----
  function touch() { const a = ls(K.act, []); const t = today(); if (!a.includes(t)) { a.push(t); put(K.act, a.slice(-400)); } }
  function streak() {
    const a = new Set(ls(K.act, [])), back = (x, n) => (window.LEARN ? LEARN.addDays(x, -n) : dateStr(new Date(new Date(x).getTime() - n * 86400000)));
    let d = today();
    if (!a.has(d)) d = back(d, 1);   // aaj abhi kuch nahi kiya toh kal se gino (streak zinda hai)
    let s = 0;
    while (a.has(d)) { s++; d = back(d, 1); }
    return s;
  }
  function todayXP(x) {
    const m = ls(K.xpday, {}), t = today();
    if (m[t] === undefined) { m[t] = x; const keys = Object.keys(m).sort(); keys.slice(0, Math.max(0, keys.length - 30)).forEach(k => delete m[k]); put(K.xpday, m); }
    return Math.max(0, x - m[t]);
  }
  const GOAL = 200;

  // ---- Sound + confetti + toast ----
  let actx = null;
  const muted = () => ls(K.mute, false);
  function tone(seq) {
    if (muted()) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      let t = actx.currentTime;
      seq.forEach(([f, d]) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + d + 0.02); t += d * 0.85;
      });
    } catch (e) { /* audio nahi */ }
  }
  const SFX = { ok: () => tone([[660, 0.09], [880, 0.12]]), bad: () => tone([[220, 0.18]]), win: () => tone([[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.25]]), hit: () => tone([[330, 0.06], [196, 0.12]]) };
  function confetti(n) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = document.createElement('div');
    box.className = 'confetti';
    const colors = ['#3b5bdb', '#2b8a3e', '#f59f00', '#e64980', '#7048e8', '#15aabf'];
    for (let i = 0; i < (n || 90); i++) {
      const s = document.createElement('i');
      s.style.left = Math.random() * 100 + 'vw';
      s.style.background = colors[i % colors.length];
      s.style.animationDelay = Math.random() * 0.4 + 's';
      s.style.animationDuration = 1.6 + Math.random() * 1.2 + 's';
      s.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3200);
  }
  function toast(html, cls) {
    let wrap = document.getElementById('toasts');
    if (!wrap) { wrap = document.createElement('div'); wrap.id = 'toasts'; document.body.appendChild(wrap); }
    const t = document.createElement('div');
    t.className = 'toast ' + (cls || '');
    t.innerHTML = html;
    wrap.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2600);
    setTimeout(() => t.remove(), 3100);
  }

  // ---- Missions ----
  // Start day (Home pe set hota hai, key 'dsa-start-day'): agla din = start se aage pehla incomplete; aage sab ho gaya toh peeche ka bacha hua
  function startDay() { const s = Number(ls(K.start, 1)) || 1; return Math.min(Math.max(1, Math.floor(s)), TOTAL_DAYS || 1); }
  function nextIncomplete() {
    const d = new Set(ls(K.days, [])), s = startDay();
    for (let n = s; n <= TOTAL_DAYS; n++) if (!d.has(n)) return n;
    for (let n = 1; n < s; n++) if (!d.has(n)) return n;
    return null;
  }
  function missionDay() {
    const m = ls(K.mission, {}), t = today(), s = startDay();
    if (m.date === t && m.day && (m.start || 1) === s) return m.day;   // start badla toh aaj ka mission bhi naye din ka
    const n = nextIncomplete();
    put(K.mission, { date: t, day: n, start: s });
    return n;
  }
  // Aaj ka din complete → usi date pe agla din shuru (missions naye din ke; XP lesson/quiz se milta rahega, chest din me ek hi baar)
  function advanceMission() {
    const n = nextIncomplete(), m = ls(K.mission, {});
    if (!n || n === m.day) return false;
    put(K.mission, { date: today(), day: n, start: startDay() });
    refresh();
    return true;
  }
  function missions() {
    const n = missionDay();
    if (!n) return null;
    const info = dayData(n), days = ls(K.days, []), done = ls(K.done, []), les = ls(K.lesson, {}), qz = ls(K.quiz, {}), sp = ls(K.speed, {}), t = today();
    const spToday = (sp.days || {})[t];
    const list = [{ t: 'Day ' + n + ' lesson padh ke complete karo', ok: days.includes(n), href: info.href }];
    const qs = info.d && info.d.qs || [];
    if (qs.length) list.push({ t: 'LC ' + qs[0] + ' (' + esc(qName(qs[0])) + ') solve karke ✔ Done', ok: done.includes(qs[0]), href: info.p ? '#/' + info.p.id + '/questions/' + qs[0] : '' });
    else list.push({ t: 'Lesson ke self-check me 3+ tick', ok: (les[n] || []).length >= 3, href: info.href });
    if (info.L && info.L.quiz) list.push({ t: 'Day ' + n + ' quiz me 4/5 ya zyada', ok: ((qz[n] || {}).best || 0) >= 4, href: info.href ? info.href : '' , quiz: true });
    else list.push({ t: 'Speed Round me 8+ score', ok: (spToday || 0) >= 8, href: '#/play/speed' });
    const due = window.LEARN ? LEARN.due().length : 0, did = window.LEARN ? LEARN.reviewedToday() : 0;
    if (due + did > 0) list.push({ t: '🔁 Aaj ke revision cards (' + did + '/' + (due + did) + ')', ok: due === 0, href: '#/play/revise' });
    else list.push({ t: 'Aaj ek Speed Round khelo', ok: spToday !== undefined, href: '#/play/speed' });
    const all = list.every(x => x.ok), claimed = !!ls(K.chest, {})[t];
    return { n, info, list, all, claimed };
  }
  function claimChest() {
    const m = missions();
    if (!m || !m.all) return;
    const ch = ls(K.chest, {}), t = today();
    if (ch[t]) return;
    ch[t] = true; put(K.chest, ch);
    touch(); SFX.win(); confetti(120);
    toast('🎁 Chest khula! <b>+' + XP.chest + ' XP</b>', 'gold');
    refresh();
  }

  // ---- Header chip + level-up ----
  let lastXP = null;
  function refresh() {
    const x = totalXP(), lv = levelOf(x), st = streak(), tx = todayXP(x);
    const chip = document.getElementById('gameChip');
    if (chip) chip.innerHTML = '<span class="gc-lv">⭐ L' + lv.L + '</span><span class="gc-name">' + esc(lv.name) + '</span><span class="gc-xp">' + x.toLocaleString('en-IN') + ' XP</span><span class="gc-st ' + (st ? '' : 'cold') + '">🔥' + st + '</span>';
    if (lastXP !== null && x > lastXP) {
      toast('<b>+' + (x - lastXP) + ' XP</b>', 'xp');
      if (chip) { chip.classList.remove('bump'); void chip.offsetWidth; chip.classList.add('bump'); }
    }
    lastXP = x;
    const prevL = ls(K.level, null);
    // sirf NAYA highest level celebrate (undo → redo pe dobara nahi)
    if (prevL !== null && lv.L > prevL) { SFX.win(); confetti(140); toast('🎉 <b>Level Up!</b> L' + lv.L + ' — ' + esc(lv.name), 'gold big'); }
    if (prevL === null || lv.L > prevL) put(K.level, lv.L);
    const card = document.getElementById('gameCard');
    if (card) card.outerHTML = homeCard();
    return { x, lv, st, tx };
  }

  // Din complete ho gaya (aur chest pehle khul chuka ho agar bana tha) → "agla din abhi shuru karo"
  function nextDayBtn(m) {
    if (!m || !ls(K.days, []).includes(m.n) || (m.all && !m.claimed)) return '';
    const n = nextIncomplete();
    if (!n || n === m.n) return '';
    const info = dayData(n);
    return '<div class="g-next"><button class="btn primary" data-gnext>➡️ Day ' + n + ' abhi shuru karo</button><span class="muted small">' + (info.d ? esc(info.d.title) + ' · ' : '') + 'missions naye din ke ho jayenge' + (m.claimed ? ' (aaj ka chest mil chuka — XP lesson / quiz se milta rahega)' : '') + '</span></div>';
  }

  // ---- Home card ----
  function ring(pct) {
    const r = 26, c = 2 * Math.PI * r, p = Math.min(1, pct);
    return '<svg class="g-ring" viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="' + r + '" class="g-ring-bg"/><circle cx="32" cy="32" r="' + r + '" class="g-ring-fg ' + (p >= 1 ? 'full' : '') + '" stroke-dasharray="' + c + '" stroke-dashoffset="' + c * (1 - p) + '" transform="rotate(-90 32 32)"/></svg>';
  }
  function homeCard() {
    const x = totalXP(), lv = levelOf(x), st = streak(), tx = todayXP(x), m = missions(), sp = ls(K.speed, {}), t = today();
    const w = m ? m.info.w : 1, bossOk = bossPool(w).length >= 5, beaten = !!ls(K.boss, {})['w' + w];
    return '<div class="card game-card" id="gameCard">' +
      '<div class="g-top">' +
        '<div class="g-level"><div class="g-lv-badge">L' + lv.L + '</div><div class="g-lv-txt"><b>' + esc(lv.name) + '</b><span class="muted small">' + x.toLocaleString('en-IN') + ' XP' + (lv.hi > lv.lo ? ' · agla level ' + lv.hi.toLocaleString('en-IN') + ' pe' : ' · MAX') + '</span><div class="bar g-bar"><div style="width:' + Math.round(lv.pct * 100) + '%"></div></div></div></div>' +
        '<div class="g-stat"><span class="g-big ' + (st ? 'fire' : 'cold') + '">🔥 ' + st + '</span><span class="muted small">din ki streak</span></div>' +
        '<div class="g-stat">' + ring(tx / GOAL) + '<span class="muted small">Aaj ' + tx + ' / ' + GOAL + ' XP</span></div>' +
        '<button class="icon-btn g-mute" data-gmute title="Sound on/off">' + (muted() ? '🔇' : '🔊') + '</button>' +
      '</div>' +
      (m ? '<div class="g-missions"><h4>🎯 Aaj ke mission <span class="muted small">— Day ' + m.n + (m.info.d ? ' · ' + esc(m.info.d.title) : '') + '</span></h4><ul>' +
        m.list.map(it => '<li class="' + (it.ok ? 'ok' : '') + '"><span class="g-tick">' + (it.ok ? '✅' : '⬜') + '</span>' + (it.href ? '<a href="' + it.href + '"' + (it.ok ? ' title="Ho gaya — dobara kholo"' : '') + '>' + it.t + '</a>' : it.t) + '</li>').join('') + '</ul>' +
        (m.claimed ? '<p class="g-chest done">🎁 Aaj ka chest mil gaya (+' + XP.chest + ' XP). Kal phir!</p>' : m.all ? '<button class="btn primary g-chest-btn" data-gchest>🎁 Chest kholo (+' + XP.chest + ' XP)</button>' : '<p class="muted small g-chest">Saare mission poore → 🎁 chest +' + XP.chest + ' XP</p>') +
        nextDayBtn(m) +
        '</div>' : '<p>🏆 Poora course complete!</p>') +
      learnBlock() +
      '<div class="g-arcade"><a class="btn g-play" href="#/play/speed">⚡ Speed Round <small>best ' + (sp.best || 0) + (sp.days && sp.days[t] !== undefined ? ' · aaj ' + sp.days[t] : '') + '</small></a>' +
        (bossOk ? '<a class="btn g-play boss" href="#/play/boss/' + w + '">🐲 Week ' + w + ' Boss <small>' + (beaten ? '✅ hara diya' : esc(bossName(w))) + '</small></a>' : '') +
      '</div></div>';
  }

  function learnBlock() {
    if (!window.LEARN) return '';
    const due = LEARN.due().length, did = LEARN.reviewedToday(), tot = LEARN.totalCards();
    const rep = LEARN.report(patternMaps()).filter(r => r.score !== null);
    const weak = rep.slice(0, 3);
    return '<div class="g-learn">' +
      '<div class="g-rev"><b>🔁 Revision</b> ' + (due ? '<a class="btn primary small" href="#/play/revise">Aaj ke ' + due + ' card karo</a>' : tot ? '<span class="muted small">' + (did ? '✅ Aaj ke ' + did + ' card ho gaye' : 'Aaj koi card due nahi') + ' · total ' + tot + ' cards</span>' : '<span class="muted small">Question pe ✔ Done lagao — 3 din baad revision card aayega</span>') + '</div>' +
      '<div class="g-weak"><b>📊 Kamzor patterns</b> ' + (weak.length ? weak.map(r => '<span class="wp ' + r.band + '">' + esc(r.pattern) + ' ' + r.score + '</span>').join('') : '<span class="muted small">abhi data kam — quiz, revision, speed round se banega</span>') +
      ' <a class="small" href="#/play/report">Poori report →</a></div></div>';
  }

  // ---- Daily Quiz (lesson ke andar) ----
  function quizBadge(n) {
    const r = ls(K.quiz, {})[n];
    return r ? '<span class="qz-badge ' + (r.best === 5 ? 'perfect' : r.best >= 4 ? 'good' : '') + '" title="Quiz best score">🎯 ' + r.best + '/5</span>' : '';
  }
  function quizPartHtml(n, quiz) {
    if (!quiz || !quiz.length) return '';
    const r = ls(K.quiz, {})[n];
    return '<div class="card part quiz-part" id="part-quiz"><h3>🎯 Day ' + n + ' Quiz <span class="muted small">(' + quiz.length + ' sawaal · har jawab ke baad explanation)</span> ' + quizBadge(n) + '</h3>' +
      '<div class="quiz-box" data-quiz-day="' + n + '">' + (r ? '<p class="muted small">Pichla score: <b>' + r.last + '/5</b> · Best: <b>' + r.best + '/5</b> · ' + r.tries + ' baar khela</p>' : '<p class="muted small">Pehli koshish ke sahi jawab pe <b>+' + XP.quiz + ' XP</b> each, 5/5 pe <b>+' + XP.perfect + ' bonus</b>.</p>') +
      '<button class="btn primary" data-qstart>' + (r ? '🔁 Dobara khelo' : '▶ Quiz shuru karo') + '</button></div></div>';
  }
  function runQuiz(box, items, opts) {
    // opts: { onAnswer(ok, i), onDone(score), title(i) }
    let i = 0, score = 0;
    // har baar options shuffle — sahi jawab hamesha ek hi jagah na rahe
    items = items.map((it, oi) => { const perm = shuffle([0, 1, 2, 3].slice(0, it.opts.length)); return { q: it.q, why: it.why, opts: perm.map(k => it.opts[k]), ans: perm.indexOf(it.ans), idx: it.idx !== undefined ? it.idx : oi, day: it.day }; });
    const show = () => {
      const it = items[i];
      box.innerHTML = '<div class="qz-head"><span>' + (opts.title ? opts.title(i) : 'Sawaal ' + (i + 1) + ' / ' + items.length) + '</span><span class="qz-score">✅ ' + score + '</span></div>' +
        '<p class="qz-q">' + esc(it.q) + '</p><div class="qz-opts">' + it.opts.map((o, k) => '<button class="btn qz-opt" data-k="' + k + '"><b>' + 'ABCD'[k] + '</b> ' + esc(o) + '</button>').join('') + '</div><div class="qz-why"></div>';
      box.querySelectorAll('.qz-opt').forEach(b => b.addEventListener('click', () => {
        if (box.dataset.lock === '1') return;
        box.dataset.lock = '1';
        const k = Number(b.dataset.k), ok = k === it.ans;
        if (ok) score++;
        box.querySelectorAll('.qz-opt').forEach(x => { const kk = Number(x.dataset.k); x.disabled = true; if (kk === it.ans) x.classList.add('right'); else if (kk === k) x.classList.add('wrong'); });
        box.querySelector('.qz-score').textContent = '✅ ' + score;
        ok ? SFX.ok() : SFX.bad();
        const res = opts.onAnswer ? opts.onAnswer(ok, i, it) : null;
        const last = i === items.length - 1 || (res && res.stop);
        box.querySelector('.qz-why').innerHTML = '<div class="qz-exp ' + (ok ? 'ok' : 'bad') + '">' + (ok ? '✅ <b>Sahi!</b> ' : '❌ <b>Galat.</b> Sahi jawab: <b>' + 'ABCD'[it.ans] + ') ' + esc(it.opts[it.ans]) + '</b><br>') + esc(it.why) + '</div>' +
          '<button class="btn primary qz-next">' + (last ? '🏁 Result dekho' : 'Agla ▶') + '</button>';
        box.querySelector('.qz-next').addEventListener('click', () => { box.dataset.lock = '0'; if (last) opts.onDone(score, i + 1); else { i++; show(); } });
        box.querySelector('.qz-next').focus({ preventScroll: true });
      }));
    };
    box.dataset.lock = '0';
    show();
  }
  function mountQuizzes(root) {
    (root || document).querySelectorAll('.quiz-box[data-quiz-day]').forEach(box => {
      const n = Number(box.dataset.quizDay), info = dayData(n), quiz = info.L && info.L.quiz;
      if (!quiz) return;
      const start = () => {
        const first = (ls(K.quiz, {})[n] || {}).first === undefined;
        runQuiz(box, quiz, {
        onAnswer(ok, i, it) { if (window.LEARN) LEARN.onQuizAnswer(n, it.idx, ok, first); return null; },
        onDone(score) {
          const all = ls(K.quiz, {}), r = all[n] || { tries: 0, best: 0 };
          const firstTime = r.first === undefined;
          r.tries++; r.last = score; r.best = Math.max(r.best || 0, score); if (firstTime) r.first = score;
          all[n] = r; put(K.quiz, all); touch();
          if (score === 5) { SFX.win(); confetti(110); } else if (score >= 4) SFX.ok();
          const stars = '⭐'.repeat(score) + '☆'.repeat(5 - score);
          box.innerHTML = '<div class="qz-result"><div class="qz-stars">' + stars + '</div><h3>Day ' + n + ' score: ' + score + ' / 5</h3>' +
            '<p class="muted">' + (score === 5 ? '🔥 Perfect! Pattern pakka ho gaya.' : score >= 4 ? '👏 Bahut badhiya — ek galti dobara padh lo.' : score >= 3 ? '🙂 Theek hai — galat wale explanation dobara padho.' : '📖 Lesson ke Thinking + Dry run parts dobara padho, phir khelo.') + '</p>' +
            '<p class="small">' + (firstTime ? 'XP: <b>+' + (score * XP.quiz + (score === 5 ? XP.perfect : 0)) + '</b> (pehli koshish)' : 'Best: <b>' + r.best + '/5</b> · XP sirf pehli koshish pe milta hai') + '</p>' +
            '<button class="btn" data-qstart>🔁 Dobara khelo</button></div>';
          box.querySelector('[data-qstart]').addEventListener('click', start);
          document.querySelectorAll('.qz-badge-slot-' + n).forEach(s => { s.innerHTML = quizBadge(n); });
          refresh();
        },
      });
      };
      const b = box.querySelector('[data-qstart]');
      if (b) b.addEventListener('click', start);
    });
  }

  // ---- Speed Round (v2, 2026-11-08): modes (week / phase / mixed) · naam + clue + example · options sirf padhe hue patterns se · end me review ----
  const strip = h => String(h || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const cut = (x, n) => (x.length > n ? x.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : x);
  function speedClue(q) {
    if (q.clue) return q.clue;
    // "String s diya hai." jaisa chhota sentence akela bekaar — 70+ chars tak agle sentences jodo
    const t = strip(q.problem && q.problem.statement);
    const parts = t.match(/[^.?!]+[.?!]+(\s|$)|[^.?!]+$/g) || [t];
    let c = '';
    for (const p of parts) { if (c.length >= 70) break; c += p; }
    return cut(c.trim(), 200);
  }
  function speedExample(q) {
    const e = q.problem && q.problem.examples && q.problem.examples[0];
    return e ? cut(strip(e.input), 80) + '  →  ' + cut(strip(e.output), 50) : '';
  }
  function curWeekNow() {
    const days = ls(K.days, []), maxDay = Math.max(0, ...days), nx = nextIncomplete() || TOTAL_DAYS;
    return Math.max(1, Math.ceil(Math.max(maxDay, nx) / 7));
  }
  // jo phases shuru ho chuke (aage ka spoil nahi)
  function unlockedPhases(cw) { return R.filter(p => C[p.id] && C[p.id].questions && Object.keys(C[p.id].questions).length && weekRange(p)[0] <= cw); }
  function lcDay(p, num) {
    const days = (C[p.id] && C[p.id].days) || [];
    const d = days.find(x => x.type === 'learn' && (x.qs || []).includes(num)) || days.find(x => (x.qs || []).includes(num));
    return d ? '#/' + p.id + '/day/' + d.day : '#/' + p.id;
  }
  function speedItem(p, num) {
    const q = C[p.id].questions[num];
    if (!q || !q.pattern) return null;
    const nm = (p.qs.find(x => x[0] === num) || [])[1] || ('LC ' + num);
    return { num, name: nm, pattern: q.pattern, one: q.oneLine || '', clue: speedClue(q), ex: speedExample(q), phase: p.id, phaseName: p.title, href: lcDay(p, num) };
  }
  // mode: 'week' | 'phase' | 'mix'; sel = phase ids (phase mode)
  function speedPool(mode, sel, cw) {
    cw = cw || curWeekNow();
    const ph = unlockedPhases(cw), out = [], seen = new Set();
    const add = (p, num) => { if (seen.has(num)) return; const it = speedItem(p, num); if (it) { seen.add(num); out.push(it); } };
    ph.forEach(p => {
      if (mode === 'phase' && !(sel || []).includes(p.id)) return;
      if (mode === 'week') {
        const st = weekRange(p)[0];
        (C[p.id].days || []).forEach(d => { if (Math.ceil(((st - 1) * 7 + d.day) / 7) === cw) (d.qs || []).forEach(n => { if (C[p.id].questions[n]) add(p, n); }); });
        return;
      }
      p.qs.forEach(([num]) => add(p, num));
    });
    return out;
  }
  // galat options: pehle same phase ke (asli confusion), phir baaki padhe hue — future ka kuch nahi.
  // Ek pattern dusre ke andar ho ("X" vs "X + HashMap") toh skip — warna do sahi lagenge.
  function speedOptions(it, cw) {
    const ph = unlockedPhases(cw || curWeekNow()), fam = {}, same = [], other = [];
    ph.forEach(p => Object.values(C[p.id].questions).forEach(q => { if (q.pattern && !fam[q.pattern]) { fam[q.pattern] = p.title; (p.id === it.phase ? same : other).push(q.pattern); } }));
    const lo = x => x.toLowerCase(), A = lo(it.pattern);
    const okp = x => x !== it.pattern && !lo(x).includes(A) && !A.includes(lo(x));
    const wrong = shuffle(same.filter(okp)).concat(shuffle(other.filter(okp))).slice(0, 3);
    return { opts: shuffle([it.pattern].concat(wrong)), fam };
  }
  const SPEED = { pool: speedPool, options: speedOptions, clue: speedClue, example: speedExample, unlocked: unlockedPhases, curWeek: curWeekNow };
  const MODES = { week: '📅 Is week ka', phase: '🧩 Topic chuno', mix: '🔀 Mixed revision' };

  function renderSpeed() {
    const sp = ls(K.speed, {}), t = today();
    return '<div class="play"><a href="#/home" class="small">← Home</a><h1>⚡ Pattern Speed Round</h1>' +
      '<p class="muted">Question ka naam + kya maanga hai + ek example dekho → sahi <b>pattern</b> chuno. Options sirf padhe hue patterns se. Time khatam hone pe <b>har sawaal ka jawab + explanation</b> neeche milega. Keyboard: <b>1–4</b> answer, <b>Enter</b> agla (practice).</p>' +
      '<p>🏆 All-time best: <b>' + (sp.best || 0) + '</b>' + (sp.days && sp.days[t] !== undefined ? ' · Aaj ka best: <b>' + sp.days[t] + '</b> (×' + XP.speedPt + ' XP)' : '') + '</p>' +
      '<div class="card speed-box" id="speedBox"></div></div>';
  }
  function mountSpeed(root) {
    const box = root.querySelector('#speedBox');
    if (!box) return;
    const cw = curWeekNow(), ph = unlockedPhases(cw);
    const curPhase = (ph.find(p => { const [x, y] = weekRange(p); return cw >= x && cw <= y; }) || ph[ph.length - 1] || {}).id;
    let mode = 'week', sel = curPhase ? [curPhase] : [], practice = false, keyH = null;
    const setKeys = h => { if (keyH) document.removeEventListener('keydown', keyH); keyH = h; if (h) document.addEventListener('keydown', h); };

    const menu = () => {
      setKeys(null);
      const sp = ls(K.speed, {}), by = sp.bestBy || {};
      const n = speedPool(mode, sel, cw).length;
      box.innerHTML = '<div class="sp-modes">' + Object.keys(MODES).map(m => '<button class="btn sp-mode' + (m === mode ? ' on' : '') + '" data-smode="' + m + '">' + MODES[m] +
          '<small>' + (m === 'week' ? 'Week ' + cw : m === 'phase' ? 'jo topic chaho' : 'saare padhe hue') + (by[m] ? ' · best ' + by[m] : '') + '</small></button>').join('') + '</div>' +
        (mode === 'phase' ? '<div class="sp-chips">' + ph.map(p => '<button class="chip' + (sel.includes(p.id) ? ' on' : '') + '" data-sph="' + p.id + '">' + esc(p.title) + '</button>').join('') + '</div>' : '') +
        '<label class="sp-prac"><input type="checkbox" data-sprac ' + (practice ? 'checked' : '') + '> 🧘 Practice mode — bina timer, aaram se (XP nahi)</label>' +
        '<p class="muted small">' + n + ' questions is mode me.</p>' +
        '<button class="btn primary big" data-sstart ' + (n ? '' : 'disabled') + '>▶ Start' + (practice ? ' (practice)' : ' (60 sec)') + '</button>';
      box.querySelectorAll('[data-smode]').forEach(b => b.addEventListener('click', () => { mode = b.dataset.smode; menu(); }));
      box.querySelectorAll('[data-sph]').forEach(b => b.addEventListener('click', () => { const id = b.dataset.sph; sel = sel.includes(id) ? sel.filter(x => x !== id) : sel.concat(id); menu(); }));
      box.querySelector('[data-sprac]').addEventListener('change', e => { practice = e.target.checked; menu(); });
      box.querySelector('[data-sstart]').addEventListener('click', () => play(speedPool(mode, sel, cw), practice, false));
    };

    // items: question list · prac: no timer · retry: "galat wale dobara" (list ek baar, cycle nahi)
    const play = (items, prac, retry) => {
      if (!items.length) { box.innerHTML = '<p>Is mode me abhi questions nahi. 🔀 Mixed try karo.</p>'; return; }
      let order = shuffle(items), k = 0, score = 0, combo = 0, bestCombo = 0, left = 60, over = false, timer = null, cur = null;
      const log = [];
      const finish = () => {
        if (over) return; over = true; if (timer) clearInterval(timer); setKeys(null);
        let head;
        if (!prac && !retry) {
          const sp = ls(K.speed, {}), t = today();
          sp.days = sp.days || {}; sp.bestBy = sp.bestBy || {};
          const newBest = score > (sp.best || 0);
          sp.days[t] = Math.max(sp.days[t] || 0, score); sp.best = Math.max(sp.best || 0, score); sp.bestBy[mode] = Math.max(sp.bestBy[mode] || 0, score);
          const keys = Object.keys(sp.days).sort(); keys.slice(0, Math.max(0, keys.length - 60)).forEach(x => delete sp.days[x]);
          put(K.speed, sp); touch();
          if (newBest && score > 0) { SFX.win(); confetti(90); } else SFX.ok();
          head = '<h2>⏱ Time up!</h2><h3>Score: ' + score + ' / ' + log.length + (bestCombo >= 3 ? ' · 🔥 best combo ' + bestCombo : '') + '</h3>' + (newBest && score > 0 ? '<p>🏆 <b>Naya high score!</b></p>' : '<p class="muted">Best: ' + sp.best + '</p>');
          refresh();
        } else head = '<h2>' + (retry ? '🔁 Galat wale — dobara' : '🧘 Practice') + ' khatam</h2><h3>Sahi: ' + score + ' / ' + log.length + '</h3><p class="muted small">Practice ka XP nahi milta.</p>';
        const wrongs = log.filter(r => !r.ok).map(r => r.it);
        box.innerHTML = '<div class="qz-result">' + head +
          '<div class="sp-endbtns">' + (wrongs.length ? '<button class="btn primary" data-sretry>🔁 Sirf galat wale dobara (' + wrongs.length + ')</button> ' : '') + '<button class="btn" data-smenu>⚡ Naya round</button> <a class="btn" href="#/home">🏠 Home</a></div></div>' +
          (log.length ? '<h3 class="sp-rv-h">📋 Tumhare jawab + explanation</h3><div class="sp-review">' + log.map((r, i) => reviewCard(r, i)).join('') + '</div>' : '<p class="muted">Koi jawab nahi diya.</p>');
        const rb = box.querySelector('[data-sretry]'); if (rb) rb.addEventListener('click', () => play(wrongs, true, true));
        box.querySelector('[data-smenu]').addEventListener('click', menu);
      };
      const reviewCard = (r, i) => '<div class="sp-rv ' + (r.ok ? 'ok' : 'bad') + '"><div class="sp-rv-top"><b>' + (i + 1) + '. ' + (r.ok ? '✅' : '❌') + ' LC ' + r.it.num + ' — ' + esc(r.it.name) + '</b><a class="small" href="' + r.it.href + '">📖 Lesson</a></div>' +
        '<div class="muted small">' + esc(r.it.clue) + '</div>' +
        '<div class="sp-rv-ans">Sahi: <b>' + esc(r.it.pattern) + '</b>' + (r.ok ? '' : ' · Tumne chuna: <s>' + esc(r.picked) + '</s>') + '</div>' +
        (r.it.one ? '<div class="sp-rv-why">💡 ' + esc(r.it.one) + '</div>' : '') + '</div>';
      const ask = () => {
        if (over) return;
        if (k >= order.length) { if (prac) { finish(); return; } order = shuffle(items); k = 0; }
        const it = order[k++];
        const { opts, fam } = speedOptions(it, cw);
        cur = { it, opts };
        const showFam = mode !== 'week' || prac;
        box.innerHTML = '<div class="sp-head">' + (prac ? '<span class="sp-time">🧘 ' + k + ' / ' + order.length + '</span><span class="sp-bar"></span>' :
            '<span class="sp-time">⏱ <b id="spT">' + left + '</b>s</span><div class="bar sp-bar"><div id="spBar" style="width:' + (left / 60) * 100 + '%"></div></div>') +
          '<span class="sp-combo">' + (combo >= 3 ? '🔥×' + combo : '') + '</span><span class="sp-score">✅ ' + score + '</span></div>' +
          '<div class="sp-card"><div class="muted small">LC ' + it.num + ' · ' + esc(it.phaseName) + '</div><div class="sp-name">' + esc(it.name) + '</div>' +
          '<div class="sp-clue">❓ ' + esc(it.clue) + '</div>' + (it.ex ? '<div class="sp-ex"><span class="muted small">Example:</span> <code>' + esc(it.ex) + '</code></div>' : '') + '</div>' +
          '<div class="qz-opts sp-opts">' + opts.map((o, i) => '<button class="btn qz-opt" data-o="' + i + '"><span class="sp-k">' + (i + 1) + '</span> ' + esc(o) +
            (showFam && fam[o] && fam[o] !== it.phaseName ? ' <span class="sp-fam">' + esc(fam[o]) + '</span>' : '') + '</button>').join('') + '</div><div class="sp-fb"></div>';
        box.dataset.lock = '0';
        box.querySelectorAll('.qz-opt').forEach(b => b.addEventListener('click', () => answer(Number(b.dataset.o))));
      };
      const answer = idx => {
        if (box.dataset.lock === '1' || over || !cur) return;
        box.dataset.lock = '1';
        const { it, opts } = cur, ok = opts[idx] === it.pattern;
        log.push({ it, picked: opts[idx], ok });
        if (ok) { score++; combo++; bestCombo = Math.max(bestCombo, combo); } else combo = 0;
        if (window.LEARN) LEARN.onSpeed(it.pattern, ok);
        ok ? SFX.ok() : SFX.bad();
        box.querySelectorAll('.qz-opt').forEach(x => { x.disabled = true; const o = opts[Number(x.dataset.o)]; if (o === it.pattern) x.classList.add('right'); else if (Number(x.dataset.o) === idx) x.classList.add('wrong'); });
        const sc = box.querySelector('.sp-score'); if (sc) sc.textContent = '✅ ' + score;
        const cb = box.querySelector('.sp-combo'); if (cb) cb.textContent = combo >= 3 ? '🔥×' + combo : '';
        box.querySelector('.sp-fb').innerHTML = '<div class="qz-exp ' + (ok ? 'ok' : 'bad') + '">' + (ok ? '✅ ' : '❌ Sahi: <b>' + esc(it.pattern) + '</b> — ') + esc(it.one) + '</div>' +
          (prac ? '<button class="btn primary" data-snext>Agla ▶ <small>(Enter)</small></button> <button class="btn" data-send>Khatam karo</button>' : '');
        if (prac) {
          box.querySelector('[data-snext]').addEventListener('click', () => { cur = null; ask(); });
          box.querySelector('[data-send]').addEventListener('click', finish);
        } else setTimeout(() => { cur = null; ask(); }, ok ? 650 : 1600);
      };
      setKeys(e => {
        if (!document.body.contains(box)) { setKeys(null); return; }
        if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
        if (/^[1-4]$/.test(e.key) && cur && box.dataset.lock !== '1') { answer(Number(e.key) - 1); e.preventDefault(); }
        else if (e.key === 'Enter' && prac && box.querySelector('[data-snext]')) { box.querySelector('[data-snext]').click(); e.preventDefault(); }
      });
      if (!prac) {
        timer = setInterval(() => {
          if (!document.body.contains(box)) { clearInterval(timer); setKeys(null); return; }
          left--;
          const tEl = box.querySelector('#spT'), bEl = box.querySelector('#spBar');
          if (tEl) tEl.textContent = left;
          if (bEl) bEl.style.width = (left / 60) * 100 + '%';
          if (left <= 0) finish();
        }, 1000);
      }
      ask();
    };
    menu();
  }

  // ---- Boss Battle ----
  const BOSSES = { 1: 'Array Golem', 2: 'Pattern Hydra', 3: 'Twin-Pointer Wraith', 4: 'Window Wyvern', 5: 'Pointer Hydra', 6: 'Cycle Serpent', 7: 'Stack Titan', 8: 'Monotonic Ogre',
    9: 'Binary Basilisk', 10: 'Search Sphinx', 11: 'Tree Ent', 12: 'Root Revenant', 13: 'BST Behemoth', 14: 'Heap Hydra', 15: 'Priority Phantom', 16: 'Backtrack Banshee',
    17: 'Subset Spider', 18: 'Permutation Kraken', 19: 'Graph Gorgon', 20: 'Island Leviathan', 21: 'DP Dragon', 22: 'Memo Minotaur', 23: 'Revision Reaper', 24: 'Final Boss: SDE-2 Interviewer' };
  const bossName = w => BOSSES[w] || 'Week ' + w + ' Boss';
  function bossPool(w) {
    const p = phaseOfWeek(w), c = p && C[p.id];
    if (!c || !c.lessons) return [];
    const startLocal = (w - weekRange(p)[0]) * 7 + 1, out = [];
    for (let l = startLocal; l < startLocal + 7; l++) { const L = c.lessons[l]; if (L && L.quiz) L.quiz.forEach(it => out.push(it)); }
    return out;
  }
  function renderBoss(w) {
    w = Number(w) || 1;
    const pool = bossPool(w), beaten = !!ls(K.boss, {})['w' + w];
    return '<div class="play"><a href="#/home" class="small">← Home</a><h1>🐲 Week ' + w + ' Boss: ' + esc(bossName(w)) + '</h1>' +
      (pool.length < 5 ? '<div class="card notice">Is week ka boss abhi ready nahi — is week ke lessons me quiz content nahi hai.</div>' :
        '<p class="muted">Is hafte ke sawaalon se ladai. Sahi jawab = boss ko <b>hit</b>. Galat = aapka ek <b>❤️</b> gaya. Boss ka HP 0 karo, aapke 3 dil khatam hone se pehle. Jeetne pe <b>+' + XP.boss + ' XP</b> (pehli jeet).</p>' +
        (beaten ? '<p>✅ Aap ye boss pehle hara chuke ho — practice ke liye phir lado.</p>' : '') +
        '<div class="card boss-box" id="bossBox" data-w="' + w + '"><div class="boss-art">🐲</div><button class="btn primary big" data-bstart>⚔️ Ladai shuru</button></div>') + '</div>';
  }
  function mountBoss(root) {
    const box = root.querySelector('#bossBox');
    if (!box) return;
    const w = Number(box.dataset.w);
    const start = () => {
      const items = shuffle(bossPool(w));
      const HP = Math.min(6, items.length - 2);
      let hp = HP, hearts = 3;
      box.innerHTML = '<div class="boss-hud"><div class="boss-side"><div class="boss-art" id="bArt">🐲</div><b>' + esc(bossName(w)) + '</b><div class="hp"><div id="bHp" style="width:100%"></div></div><span class="small" id="bHpT">HP ' + hp + '/' + HP + '</span></div>' +
        '<div class="boss-side you"><div class="boss-art">🧑‍💻</div><b>Aap</b><div class="hearts" id="bHearts">❤️❤️❤️</div></div></div><div class="quiz-box" id="bQuiz"></div>';
      const qb = box.querySelector('#bQuiz');
      runQuiz(qb, items, {
        title: i => '⚔️ Round ' + (i + 1),
        onAnswer(ok) {
          if (ok) {
            hp--; SFX.hit();
            const art = box.querySelector('#bArt'); art.classList.remove('hit'); void art.offsetWidth; art.classList.add('hit');
          } else hearts--;
          box.querySelector('#bHp').style.width = Math.max(0, (hp / HP) * 100) + '%';
          box.querySelector('#bHpT').textContent = 'HP ' + Math.max(0, hp) + '/' + HP;
          box.querySelector('#bHearts').textContent = '❤️'.repeat(Math.max(0, hearts)) + '🖤'.repeat(3 - Math.max(0, hearts));
          return { stop: hp <= 0 || hearts <= 0 };
        },
        onDone() {
          const win = hp <= 0;
          if (win) {
            const b = ls(K.boss, {}), first = !b['w' + w];
            b['w' + w] = true; put(K.boss, b); touch(); SFX.win(); confetti(160);
            box.innerHTML = '<div class="qz-result"><div class="boss-art dead">🐲💥</div><h2>🏆 ' + esc(bossName(w)) + ' haar gaya!</h2><p>' + (first ? 'Badge + <b>+' + XP.boss + ' XP</b>' : 'Phir se jeete — practice pakki!') + '</p><button class="btn" data-bstart>🔁 Phir lado</button> <a class="btn primary" href="#/home">🏠 Home</a></div>';
          } else {
            SFX.bad();
            box.innerHTML = '<div class="qz-result"><div class="boss-art">🐲😈</div><h2>Boss jeet gaya…</h2><p class="muted">Galat wale explanation padho, us din ka lesson dekho, phir lado. Boss ka HP bacha: ' + hp + '</p><button class="btn primary" data-bstart>⚔️ Phir lado</button></div>';
          }
          box.querySelector('[data-bstart]').addEventListener('click', start);
          refresh();
        },
      });
    };
    box.querySelector('[data-bstart]').addEventListener('click', start);
  }

  // ---- 🔁 Revise page ----
  function cardHtmlQ(c) {
    const lc = c.ref.lc, q = qByNum(lc) || {};
    return '<div class="rv-card"><span class="muted small">Question card · LC ' + lc + '</span><h3>' + esc(qName(lc)) + '</h3>' +
      '<p>⏱ <b class="rv-t">30</b>s — <b>approach yaad karo</b>: pattern kya? brute kya? optimal kya, kyun?</p>' +
      '<button class="btn primary" data-rv-show>👀 Dikhao</button>' +
      '<div class="rv-ans" hidden><p><b>Pattern:</b> ' + esc(q.pattern || '') + '</p><p>💡 ' + esc(q.oneLine || '') + '</p>' +
      (q.approaches ? '<pre class="ex-pre"><code>' + esc(q.approaches[q.approaches.length - 1].code) + '</code></pre>' : '') +
      '<p class="muted small">Kitna yaad tha?</p><div class="rv-grade"><button class="btn" data-g="forgot">😓 Bhool gaya <small>kal phir</small></button><button class="btn" data-g="ok">🙂 Thoda <small>same gap</small></button><button class="btn" data-g="easy">😎 Aasaan <small>bada gap</small></button></div></div></div>';
  }
  function renderRevise() {
    return '<div class="play"><a href="#/home" class="small">← Home</a><h1>🔁 Aaj ka Revision</h1><p class="muted">Din me max ' + (window.LEARN ? LEARN.DAILY_MAX : 5) + ' cards. Jo bhoola woh jaldi wapas aayega, jo yaad hai woh der se. Har card <b>+10 XP</b>.</p><div class="card rv-box" id="rvBox"></div></div>';
  }
  function mountRevise(root) {
    const box = root.querySelector('#rvBox'); if (!box || !window.LEARN) return;
    let timer = null;
    const next = () => {
      clearInterval(timer);
      const due = LEARN.due();
      if (!due.length) { box.innerHTML = '<div class="qz-result"><h2>🎉 Aaj ke saare cards ho gaye!</h2><p class="muted">Aaj ' + LEARN.reviewedToday() + ' cards kiye. Kal naye aayenge.</p><a class="btn primary" href="#/home">🏠 Home</a></div>'; refresh(); return; }
      const c = due[0];
      const head = '<div class="rv-head muted small">Card ' + (LEARN.reviewedToday() + 1) + ' · aaj bache ' + due.length + '</div>';
      if (c.kind === 'q') {
        box.innerHTML = head + cardHtmlQ(c);
        let left = 30; const t = box.querySelector('.rv-t');
        timer = setInterval(() => { if (!document.body.contains(box)) return clearInterval(timer); left = Math.max(0, left - 1); if (t) t.textContent = left; }, 1000);
        box.querySelector('[data-rv-show]').addEventListener('click', e => { e.target.remove(); clearInterval(timer); box.querySelector('.rv-ans').hidden = false; });
        box.querySelectorAll('[data-g]').forEach(b => b.addEventListener('click', () => { LEARN.gradeCard(c.id, b.dataset.g); touch(); SFX.ok(); refresh(); next(); }));
      } else {
        const info = dayData(c.ref.day), it = info.L && info.L.quiz && info.L.quiz[c.ref.qi];
        if (!it) { LEARN.gradeCard(c.id, 'ok'); return next(); }
        box.innerHTML = head + '<span class="muted small">Quiz card · Day ' + c.ref.day + ' ka galat sawaal</span><div class="quiz-box" id="rvQ"></div>';
        runQuiz(box.querySelector('#rvQ'), [it], { title: () => 'Dobara try', onDone(score) { LEARN.gradeCard(c.id, score ? 'easy' : 'forgot'); touch(); refresh(); next(); } });
      }
    };
    next();
  }

  // ---- 📊 Report page ----
  function renderReport() {
    if (!window.LEARN) return '';
    const rows = LEARN.report(patternMaps());
    const bar = r => r.score === null ? '<span class="muted small">abhi data kam (' + r.signals + ' signal, min ' + LEARN.MIN_SIGNALS + ')</span>' :
      '<div class="rp-bar"><div class="' + r.band + '" style="width:' + r.score + '%"></div></div><b class="rp-n ' + r.band + '">' + r.score + '</b>';
    const part = (l, a) => a[1] ? l + ' ' + (Math.round((a[0] / a[1]) * 100)) + '% (' + a[1] + ')' : '';
    return '<div class="play"><a href="#/home" class="small">← Home</a><h1>📊 Meri Pattern Report</h1>' +
      '<p class="muted">Score = Quiz + Revision me yaad + Speed Round (jitna data ho utne se).  🟢 75+ · 🟡 50–74 · 🔴 50 se kam. Sabse kamzor upar.</p>' +
      (rows.length ? '<div class="card rp">' + rows.map(r => '<div class="rp-row"><div class="rp-name"><b>' + esc(r.pattern) + '</b><span class="muted small">' +
        [part('Quiz', r.parts.quiz), part('Try', r.parts.tryq), part('Revision', r.parts.rev), part('Speed', r.parts.speed)].filter(Boolean).join(' · ') +
        (r.questions.length ? ' · LC ' + r.questions.join(', ') : '') + (r.last ? ' · last ' + r.last : '') + '</span></div><div class="rp-score">' + bar(r) + '</div>' +
        (r.band === 'weak' || r.band === 'mid' ? '<a class="btn small" href="#/play/revise">🔁 Practice</a>' : '') + '</div>').join('') + '</div>'
        : '<div class="card notice">Abhi koi data nahi. Lesson ka quiz khelo, ✔ Done lagao, revision karo — report banti jayegi.</div>') + '</div>';
  }

  // ---- Play routes ----
  function renderPlay(kind, arg) { return kind === 'boss' ? renderBoss(arg) : kind === 'revise' ? renderRevise() : kind === 'report' ? renderReport() : renderSpeed(); }
  function mountPlay(root) { mountSpeed(root); mountBoss(root); mountRevise(root); }

  // ---- Visualizer quiz-mode sahi jawab ----
  function vizCorrect() { const m = ls(K.vizq, {}), t = today(); m[t] = (m[t] || 0) + 1; put(K.vizq, m); touch(); refresh(); }

  // ---- global clicks (mute, chest) ----
  document.addEventListener('click', e => {
    if (e.target.closest('[data-gmute]')) { put(K.mute, !muted()); refresh(); return; }
    if (e.target.closest('[data-gchest]')) claimChest();
    if (e.target.closest('[data-gnext]') && advanceMission() && /^#?\/?(home)?$/.test(location.hash.replace('#', ''))) window.dispatchEvent(new Event('hashchange'));
  });

  window.GAME = { patternMaps, refresh, advanceMission, touch, homeCard, quizPartHtml, quizBadge, mountQuizzes, renderPlay, mountPlay, vizCorrect, bossName, bossPool, totalXP, levelOf, speed: SPEED };
})();
