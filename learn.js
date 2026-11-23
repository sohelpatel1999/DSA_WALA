// Learning engine (2026-11-08): 🔁 Smart Revision (spaced repetition) · ✍️ Try-first mode · 📊 Weak Pattern Report.
// PURE functions (store + date in, result out) — tools/test-game.js inhe Node me test karta hai.
// localStorage wrappers neeche. game.js aur app.js isko use karte hain. game.js se PEHLE load hota hai.
(function (root) {
  // ---------------- dates (UTC math — DST safe) ----------------
  const pad = x => String(x).padStart(2, '0');
  const fromDate = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const toUTC = s => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  const addDays = (s, n) => { const t = new Date(toUTC(s) + n * 86400000); return t.getUTCFullYear() + '-' + pad(t.getUTCMonth() + 1) + '-' + pad(t.getUTCDate()); };
  const diffDays = (a, b) => Math.round((toUTC(a) - toUTC(b)) / 86400000);
  const today = () => (root.__TODAY ? root.__TODAY : fromDate(new Date()));   // tests __TODAY set karte hain

  // ---------------- 1) SRS ----------------
  const INTERVALS = [3, 7, 15, 30];
  const DAILY_MAX = 5;
  const XP_CARD = 10;
  // card: { kind: 'q'|'quiz', ref, due, step, lapses, last, hist: ['forgot'|'ok'|'easy'] }
  function addCard(store, id, kind, ref, day, delay) {
    if (store[id]) return false;
    store[id] = { kind, ref, due: addDays(day, delay), step: 0, lapses: 0, last: null, hist: [] };
    return true;
  }
  const addQuestion = (store, lc, day) => addCard(store, 'q:' + lc, 'q', { lc: Number(lc) }, day, INTERVALS[0]);
  const addWrongQuiz = (store, gday, qi, day) => addCard(store, 'quiz:' + gday + ':' + qi, 'quiz', { day: Number(gday), qi: Number(qi) }, day, 1);
  // grade: 'forgot' → kal phir (step 0) · 'ok' → same step ka gap · 'easy' → agla bada gap
  function grade(card, g, day) {
    if (g === 'forgot') { card.step = 0; card.lapses++; card.due = addDays(day, 1); }
    else if (g === 'ok') { card.due = addDays(day, INTERVALS[card.step]); }
    else { card.step = Math.min(card.step + 1, INTERVALS.length - 1); card.due = addDays(day, INTERVALS[card.step]); }
    card.last = day;
    card.hist.push(g);
    return card;
  }
  // aaj ke cards: due ≤ aaj, purane pehle, quiz cards pehle; din ka cap DAILY_MAX (aaj jitne kar liye utne kam)
  function dueToday(store, day, doneToday) {
    const left = Math.max(0, DAILY_MAX - (doneToday || 0));
    return Object.entries(store)
      .filter(([, c]) => c.due <= day && c.last !== day)
      .sort((a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : (a[1].kind === 'quiz' ? -1 : 1)))
      .slice(0, left)
      .map(([id, c]) => Object.assign({ id }, c));
  }
  const reviewXP = log => Object.values(log || {}).reduce((s, n) => s + Math.min(n, DAILY_MAX) * XP_CARD, 0);

  // ---------------- 2) Try-first mode ----------------
  const TIMER_MIN = { Easy: 15, Medium: 25, Hard: 40 };
  // rec: { hints: 0|1|2, solution: bool, self: bool, secs } — sirf pehli baar ka record XP deta hai
  function tryXP(rec) {
    if (!rec || !rec.done) return 0;
    if (rec.solution) return 0;
    if (rec.self && rec.hints === 0) return 40;
    if (rec.self && rec.hints === 1) return 20;
    return 0;
  }
  function finishTry(store, lc, rec) {
    if (store[lc] && store[lc].done) return store[lc];          // pehla record hi rakho (idempotent)
    store[lc] = Object.assign({ hints: 0, solution: false, self: false, secs: 0 }, rec, { done: true });
    return store[lc];
  }

  // ---------------- 3) Weak Pattern Report ----------------
  // "Prefix Sum (Range Query)" → "Prefix Sum", "Slow / Fast Pointers — x" → "Slow / Fast Pointers"
  const patternKey = p => String(p || '').split(/\s+[(—–-]\s*|\s*\(/)[0].trim() || 'Other';
  const W = { quiz: 0.4, tryq: 0.3, rev: 0.2, speed: 0.1 };
  const MIN_SIGNALS = 3;
  // input: { lcPattern: {lc: pattern}, dayPattern: {gday: pattern}, quizlog: {gday: {qi: bool}}, tries: {lc: rec},
  //          srs: store, speedlog: {pattern: [ok, total]} }
  function report(input) {
    const P = {};
    const get = k => (P[k] = P[k] || { pattern: k, quiz: [0, 0], tryq: [0, 0], rev: [0, 0], speed: [0, 0], lcs: new Set(), last: null });
    const touch = (k, d) => { if (d && (!get(k).last || d > get(k).last)) get(k).last = d; };
    Object.entries(input.quizlog || {}).forEach(([d, items]) => {
      const pat = input.dayPattern && input.dayPattern[d]; if (!pat) return;
      const e = get(patternKey(pat));
      Object.values(items).forEach(ok => { e.quiz[1]++; if (ok) e.quiz[0]++; });
    });
    Object.entries(input.tries || {}).forEach(([lc, r]) => {
      const pat = input.lcPattern && input.lcPattern[lc]; if (!pat || !r.done) return;
      const e = get(patternKey(pat)); e.tryq[1]++; if (r.self && !r.solution) e.tryq[0] += r.hints === 0 ? 1 : 0.5; e.lcs.add(Number(lc));
    });
    Object.values(input.srs || {}).forEach(c => {
      const pat = c.kind === 'q' ? input.lcPattern && input.lcPattern[c.ref.lc] : input.dayPattern && input.dayPattern[c.ref.day];
      if (!pat) return;
      const e = get(patternKey(pat));
      if (c.kind === 'q') e.lcs.add(c.ref.lc);
      c.hist.forEach(g => { e.rev[1]++; if (g === 'easy') e.rev[0]++; else if (g === 'ok') e.rev[0] += 0.5; });
      touch(patternKey(pat), c.last);
    });
    Object.entries(input.speedlog || {}).forEach(([pat, [ok, tot]]) => { const e = get(patternKey(pat)); e.speed[0] += ok; e.speed[1] += tot; });
    return Object.values(P).map(e => {
      let sw = 0, sum = 0;
      Object.keys(W).forEach(k => { if (e[k][1] > 0) { sw += W[k]; sum += W[k] * (e[k][0] / e[k][1]); } });
      const signals = e.quiz[1] + e.tryq[1] + e.rev[1] + e.speed[1];
      const score = sw > 0 && signals >= MIN_SIGNALS ? Math.round((sum / sw) * 100) : null;
      return { pattern: e.pattern, score, signals, band: score === null ? 'na' : score >= 75 ? 'good' : score >= 50 ? 'mid' : 'weak', questions: [...e.lcs], last: e.last,
        parts: { quiz: e.quiz, tryq: e.tryq, rev: e.rev, speed: e.speed } };
    }).sort((a, b) => (a.score === null) - (b.score === null) || (a.score || 0) - (b.score || 0));
  }

  // ---------------- localStorage wrappers ----------------
  const K = { srs: 'dsa-srs-v1', srslog: 'dsa-srslog-v1', tries: 'dsa-try-v1', quizlog: 'dsa-quizlog-v1', speedlog: 'dsa-speedlog-v1', tryOff: 'dsa-trymode-off' };
  const ls = (k, d) => { try { const v = root.localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const put = (k, v) => { try { root.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } };
  const S = {
    onDone(lc) { const s = ls(K.srs, {}); if (addQuestion(s, lc, today())) put(K.srs, s); },
    onQuizAnswer(gday, qi, ok, firstAttempt) {
      if (!firstAttempt) return;
      const q = ls(K.quizlog, {}); q[gday] = q[gday] || {}; if (q[gday][qi] === undefined) { q[gday][qi] = !!ok; put(K.quizlog, q); }
      if (!ok) { const s = ls(K.srs, {}); if (addWrongQuiz(s, gday, qi, today())) put(K.srs, s); }
    },
    onSpeed(pattern, ok) { const l = ls(K.speedlog, {}); const k = patternKey(pattern); l[k] = l[k] || [0, 0]; l[k][1]++; if (ok) l[k][0]++; put(K.speedlog, l); },
    due() { const t = today(); return dueToday(ls(K.srs, {}), t, (ls(K.srslog, {}))[t] || 0); },
    gradeCard(id, g) {
      const s = ls(K.srs, {}), t = today(); if (!s[id]) return null;
      grade(s[id], g, t); put(K.srs, s);
      const log = ls(K.srslog, {}); log[t] = (log[t] || 0) + 1; put(K.srslog, log);
      return s[id];
    },
    reviewedToday() { return (ls(K.srslog, {}))[today()] || 0; },
    totalCards() { return Object.keys(ls(K.srs, {})).length; },
    reviewXP() { return reviewXP(ls(K.srslog, {})); },
    tryRec(lc) { return (ls(K.tries, {}))[lc] || null; },
    finishTry(lc, rec) { const s = ls(K.tries, {}); const r = finishTry(s, lc, rec); put(K.tries, s); return r; },
    tryXPTotal() { return Object.values(ls(K.tries, {})).reduce((a, r) => a + tryXP(r), 0); },
    tryOff() { return ls(K.tryOff, false); },
    setTryOff(v) { put(K.tryOff, !!v); },
    report(maps) { return report(Object.assign({ quizlog: ls(K.quizlog, {}), tries: ls(K.tries, {}), srs: ls(K.srs, {}), speedlog: ls(K.speedlog, {}) }, maps)); },
  };

  root.LEARN = Object.assign(S, {
    today, addDays, diffDays, INTERVALS, DAILY_MAX, XP_CARD, TIMER_MIN, MIN_SIGNALS,
    pure: { addCard, addQuestion, addWrongQuiz, grade, dueToday, reviewXP, tryXP, finishTry, patternKey, report },
  });
})(typeof window !== 'undefined' ? window : globalThis);
