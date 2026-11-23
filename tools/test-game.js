#!/usr/bin/env node
// Learning engine + game XP ke automated tests. Usage: node tools/test-game.js   (exit 0 = sab PASS)
// Fake localStorage + fake date (__TODAY) — browser ki zaroorat nahi.
const path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log('  ✗ ' + name); } };
const eq = (a, b, name) => ok(JSON.stringify(a) === JSON.stringify(b), name + '  (mila ' + JSON.stringify(a) + ', chahiye ' + JSON.stringify(b) + ')');

// ---- fake browser ----
const mem = {};
global.window = global;
global.localStorage = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; }, clear: () => { Object.keys(mem).forEach(k => delete mem[k]); } };
global.document = { addEventListener() {}, getElementById: () => null, querySelectorAll: () => [], body: { contains: () => true, appendChild() {} }, createElement: () => ({ style: {}, appendChild() {}, remove() {}, classList: { add() {}, remove() {} } }) };
global.__TODAY = '2026-11-08';
require(path.join(ROOT, 'learn.js'));
const L = window.LEARN, P = L.pure;

console.log('== Dates');
eq(L.addDays('2026-11-08', 3), '2026-11-11', 'addDays +3');
eq(L.addDays('2026-11-29', 3), '2026-12-02', 'month cross');
eq(L.addDays('2026-12-30', 3), '2027-01-02', 'year cross');
eq(L.diffDays('2026-12-02', '2026-11-29'), 3, 'diffDays');

console.log('== SRS schedule');
{
  const s = {};
  ok(P.addQuestion(s, 53, '2026-11-08'), 'question card bana');
  ok(!P.addQuestion(s, 53, '2026-11-09'), 'duplicate card nahi banta');
  eq(s['q:53'].due, '2026-11-11', 'pehla review +3 din');
  P.grade(s['q:53'], 'easy', '2026-11-11'); eq([s['q:53'].step, s['q:53'].due], [1, '2026-11-18'], 'easy → +7');
  P.grade(s['q:53'], 'easy', '2026-11-18'); eq(s['q:53'].due, '2026-12-03', 'easy → +15');
  P.grade(s['q:53'], 'easy', '2026-12-03'); eq(s['q:53'].due, '2027-01-02', 'easy → +30');
  P.grade(s['q:53'], 'easy', '2027-01-02'); eq([s['q:53'].step, s['q:53'].due], [3, '2027-02-01'], '+30 pe ruk jaata hai');
  P.grade(s['q:53'], 'ok', '2027-02-01'); eq([s['q:53'].step, s['q:53'].due], [3, '2027-03-03'], 'ok → same step');
  P.grade(s['q:53'], 'forgot', '2027-03-03'); eq([s['q:53'].step, s['q:53'].due, s['q:53'].lapses], [0, '2027-03-04', 1], 'forgot → kal, step 0, lapse++');
  eq(s['q:53'].hist, ['easy', 'easy', 'easy', 'easy', 'ok', 'forgot'], 'history record');
  const q = {};
  ok(P.addWrongQuiz(q, 32, 2, '2026-11-08'), 'galat quiz card');
  eq(q['quiz:32:2'].due, '2026-11-09', 'galat quiz → +1 din');
}
console.log('== Due today + daily cap');
{
  const s = {};
  for (let i = 1; i <= 8; i++) P.addCard(s, 'q:' + i, 'q', { lc: i }, '2026-11-01', 3);   // sab 2026-11-04 due
  P.addWrongQuiz(s, 5, 0, '2026-11-07');                                                  // 11-08 due
  P.addQuestion(s, 99, '2026-11-08');                                                     // future
  const d = P.dueToday(s, '2026-11-08', 0);
  eq(d.length, 5, 'max 5 cards/din');
  ok(!d.some(c => c.id === 'q:99'), 'future card nahi aata');
  eq(P.dueToday(s, '2026-11-08', 3).length, 2, '3 kar liye → 2 bache');
  eq(P.dueToday(s, '2026-11-08', 5).length, 0, '5 ke baad 0');
  P.grade(s['q:1'], 'forgot', '2026-11-08');
  ok(!P.dueToday(s, '2026-11-08', 0).some(c => c.id === 'q:1'), 'aaj grade hua card aaj dobara nahi');
  eq(P.reviewXP({ '2026-11-07': 3, '2026-11-08': 9 }), (3 + 5) * 10, 'review XP (cap 5/din)');
}
console.log('== Try mode XP');
{
  eq(P.tryXP({ done: true, self: true, hints: 0 }), 40, 'bina hint 40');
  eq(P.tryXP({ done: true, self: true, hints: 1 }), 20, '1 hint 20');
  eq(P.tryXP({ done: true, self: true, hints: 2 }), 0, '2 hint 0');
  eq(P.tryXP({ done: true, solution: true, hints: 0 }), 0, 'solution dekha 0');
  eq(P.tryXP({ self: true, hints: 0 }), 0, 'done nahi toh 0');
  const st = {};
  P.finishTry(st, 21, { self: true, hints: 0, secs: 300 });
  P.finishTry(st, 21, { solution: true, hints: 2, secs: 9 });
  eq([st[21].self, st[21].hints], [true, 0], 'pehla record hi rehta hai (idempotent)');
}
console.log('== Pattern key');
eq(P.patternKey('Prefix Sum (Range Query)'), 'Prefix Sum', 'bracket hata');
eq(P.patternKey('Slow / Fast Pointers (Floyd Phase 2)'), 'Slow / Fast Pointers', 'slash wala pattern');
eq(P.patternKey('Kadane'), 'Kadane', 'simple');
console.log('== Report');
{
  const r = P.report({
    lcPattern: { 53: 'Kadane', 560: 'Prefix Sum + HashMap', 303: 'Prefix Sum (Range Query)' },
    dayPattern: { 8: 'Kadane', 6: 'Prefix Sum + HashMap' },
    quizlog: { 8: { 0: true, 1: true, 2: true, 3: true, 4: true }, 6: { 0: false, 1: false, 2: true, 3: false, 4: false } },
    tries: { 53: { done: true, self: true, hints: 0 }, 560: { done: true, solution: true, hints: 2 } },
    srs: { 'q:53': { kind: 'q', ref: { lc: 53 }, hist: ['easy'], last: '2026-11-08' }, 'q:303': { kind: 'q', ref: { lc: 303 }, hist: ['forgot'], last: '2026-11-08' } },
    speedlog: { Kadane: [2, 2] },
  });
  const k = r.find(x => x.pattern === 'Kadane'), p = r.find(x => x.pattern === 'Prefix Sum + HashMap'), ps = r.find(x => x.pattern === 'Prefix Sum');
  eq(k.score, 100, 'Kadane 100 (sab sahi)');
  eq(k.band, 'good', 'Kadane good');
  // Prefix+HashMap: quiz 1/5=0.2 (w .4), try 0/1 (w .3), rev none, speed none → (0.08)/0.7 = 11
  eq(p.score, 11, 'Prefix + HashMap 11');
  eq(p.band, 'weak', 'weak band');
  eq(ps.score, null, 'Prefix Sum: data kam (1 signal) → null');
  eq(r[0].pattern, 'Prefix Sum + HashMap', 'sabse kamzor pehle');
  ok(r[r.length - 1].score === null, 'null scores end me');
}
console.log('== Storage wrappers (fake localStorage + date)');
{
  localStorage.clear(); global.__TODAY = '2026-11-08';
  L.onDone(53); L.onDone(53);
  eq(L.totalCards(), 1, 'Done do baar → 1 card');
  eq(L.due().length, 0, 'aaj due nahi (+3)');
  global.__TODAY = '2026-11-11';
  eq(L.due().map(c => c.id), ['q:53'], '3 din baad due');
  L.gradeCard('q:53', 'easy');
  eq(L.due().length, 0, 'grade ke baad aaj nahi');
  eq(L.reviewedToday(), 1, 'reviewedToday 1');
  eq(L.reviewXP(), 10, 'review XP 10');
  L.onQuizAnswer(32, 1, false, true); L.onQuizAnswer(32, 1, true, true); L.onQuizAnswer(32, 2, false, false);
  const ql = JSON.parse(localStorage.getItem('dsa-quizlog-v1'));
  eq(ql[32], { 1: false }, 'quizlog: sirf pehli koshish ka pehla jawab');
  eq(L.totalCards(), 2, 'galat quiz card bana (dobara-khel wala nahi)');
  global.__TODAY = '2026-11-12';
  ok(L.due().some(c => c.id === 'quiz:32:1'), 'galat quiz kal due');
  L.finishTry(21, { self: true, hints: 1 }); L.finishTry(21, { self: true, hints: 0 });
  eq(L.tryXPTotal(), 20, 'try XP idempotent (20)');
  L.onSpeed('Kadane', true); L.onSpeed("Kadane's Algorithm", false);
  eq(JSON.parse(localStorage.getItem('dsa-speedlog-v1')).Kadane, [1, 1], 'speedlog per pattern');
  L.setTryOff(true); ok(L.tryOff(), 'try mode off'); L.setTryOff(false); ok(!L.tryOff(), 'try mode on');
}

console.log('== game.js XP integration');
{
  localStorage.clear(); global.__TODAY = '2026-11-08';
  global.ROADMAP = []; global.PHASE_CONTENT = {};
  require(path.join(ROOT, 'game.js'));
  const G = window.GAME;
  const base = G.totalXP();
  eq(base, 0, 'khaali XP 0');
  L.onDone(1); L.finishTry(1, { self: true, hints: 0 });
  eq(G.totalXP(), 40, 'try XP total me');
  global.__TODAY = '2026-11-11'; L.gradeCard('q:1', 'ok');
  eq(G.totalXP(), 50, 'revision card +10');
}

console.log('== Speed Round v2 (modes, options, clue/example)');
{
  const fs = require('fs');
  localStorage.clear(); global.__TODAY = '2026-11-08';
  global.ROADMAP = undefined; global.PHASE_CONTENT = {};
  require(path.join(ROOT, 'roadmap.js'));
  // index.html wala order (lessons ko pehle phase data chahiye)
  [...fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').matchAll(/src="(data\/[^"]+)"/g)].forEach(m => require(path.join(ROOT, m[1])));
  delete require.cache[require.resolve(path.join(ROOT, 'game.js'))];
  require(path.join(ROOT, 'game.js'));
  const S = window.GAME.speed, C = window.PHASE_CONTENT;
  const phaseOfLc = {}; Object.entries(C).forEach(([id, c]) => Object.keys(c.questions || {}).forEach(n => { phaseOfLc[n] = id; }));
  const patsOf = ids => new Set(ids.flatMap(id => Object.values(C[id].questions).map(q => q.pattern)));

  eq(S.unlocked(3).map(p => p.id), ['arrays', 'two-pointers'], 'week 3 pe sirf arrays + two-pointers unlocked');
  const w3 = S.pool('week', [], 3);
  eq(w3.map(i => i.num).sort((a, b) => a - b), [11, 15, 42, 125, 167, 283, 344], 'week 3 pool = sirf Week 3 ke questions');
  const w4 = S.pool('week', [], 4);
  ok(w4.length >= 6 && w4.every(i => i.phase === 'sliding-window'), 'week 4 pool sirf sliding window');
  const w1 = S.pool('week', [], 1);
  ok(w1.length > 0 && w1.every(i => i.phase === 'arrays'), 'week 1 pool arrays');
  const ph = S.pool('phase', ['two-pointers'], 6);
  ok(ph.length === 7 && ph.every(i => i.phase === 'two-pointers'), 'phase mode = sirf chuna hua phase');
  eq(S.pool('phase', [], 6).length, 0, 'phase mode, kuch nahi chuna → khaali');
  const mix = S.pool('mix', [], 4);
  ok(mix.every(i => ['arrays', 'two-pointers', 'sliding-window'].includes(i.phase)), 'mixed (week 4) me future phase nahi');
  eq(new Set(mix.map(i => i.num)).size, mix.length, 'pool me duplicate LC nahi');

  // options: 300 random rounds — 4 alag, sahi exactly ek, galat sirf padhe hue patterns se, koi "andar wala" pattern nahi
  const allowed4 = patsOf(['arrays', 'two-pointers', 'sliding-window']);
  let bad = 0, sameFirst = 0, n = 0;
  for (let r = 0; r < 300; r++) {
    const it = mix[r % mix.length], { opts } = S.options(it, 4);
    n++;
    if (opts.length !== 4 || new Set(opts).size !== 4 || opts.filter(o => o === it.pattern).length !== 1) bad++;
    if (opts.some(o => !allowed4.has(o))) bad++;
    if (opts.some(o => o !== it.pattern && (o.toLowerCase().includes(it.pattern.toLowerCase()) || it.pattern.toLowerCase().includes(o.toLowerCase())))) bad++;
    const samePats = patsOf([it.phase]);
    if (opts.filter(o => o !== it.pattern && samePats.has(o)).length >= Math.min(3, [...samePats].filter(p => p !== it.pattern).length) - 1) sameFirst++;
  }
  eq(bad, 0, 'options: 4 alag, 1 sahi, sirf padhe hue patterns, no overlap');
  ok(sameFirst / n > 0.9, 'galat options pehle same phase se');

  // har question (saare phases) ke paas clue + example
  let miss = [];
  Object.entries(C).forEach(([id, c]) => Object.entries(c.questions || {}).forEach(([num, q]) => {
    if (!S.clue(q) || S.clue(q).length < 15 || !S.example(q).includes('→')) miss.push(id + ':' + num);
  }));
  eq(miss, [], 'har question ka clue + example bana');
  ok(w3.every(i => /^#\/two-pointers\/day\/\d+$/.test(i.href)), 'review ka lesson link sahi day pe');

  // Start day: "Day 32 se shuru" → mission Day 32; 32 complete → 33; start ke aage sab done → peeche ka bacha hua
  {
    const day = s => (/Aaj ke mission <span class="muted small">— Day (\d+)/.exec(window.GAME.homeCard()) || [])[1];
    eq(day(), '1', 'start set nahi → mission Day 1');
    localStorage.setItem('dsa-start-day', '32');
    eq(day(), '32', 'start = 32 → usi din (aaj ka cached mission bhi badla)');
    localStorage.setItem('dsa-days-v1', JSON.stringify([32]));
    localStorage.removeItem('dsa-mission-v1');
    eq(day(), '33', 'Day 32 complete → agla din 33');
    localStorage.setItem('dsa-start-day', '168');
    localStorage.setItem('dsa-days-v1', JSON.stringify([168]));
    localStorage.removeItem('dsa-mission-v1');
    eq(day(), '1', 'start ke aage sab done → peeche ka pehla incomplete (Day 1)');
    // Day 33 complete (usi date pe) → mission Day 33 hi rehta hai, par links clickable + "Day 34 abhi shuru karo"
    localStorage.setItem('dsa-start-day', '32');
    localStorage.setItem('dsa-days-v1', JSON.stringify([32]));
    localStorage.removeItem('dsa-mission-v1');
    eq(day(), '33', 'mission Day 33');
    ok(!/data-gnext/.test(window.GAME.homeCard()), 'Day 33 complete nahi → agla-din button nahi');
    localStorage.setItem('dsa-days-v1', JSON.stringify([32, 33]));
    const hc = window.GAME.homeCard();
    eq(day(), '33', 'Day 33 complete karte hi aaj ka mission Day 33 hi (date lock)');
    ok(/<li class="ok">[^]*?<a href="#\//.test(hc), 'complete mission ka link bhi clickable (lesson dobara khol sako)');
    ok(/data-gnext>➡️ Day 34 abhi shuru karo/.test(hc), '"Day 34 abhi shuru karo" button');
    ok(window.GAME.advanceMission(), 'advanceMission → true');
    eq(day(), '34', 'button ke baad mission Day 34 (usi date pe)');
    ok(!window.GAME.advanceMission(), 'Day 34 abhi incomplete → dobara advance nahi');
    ['dsa-start-day', 'dsa-days-v1', 'dsa-mission-v1'].forEach(k => localStorage.removeItem(k));
  }

  // XP backward compatible: purana sp format {best, days} chalta hai
  localStorage.setItem('dsa-speed-v1', JSON.stringify({ best: 7, days: { '2026-11-08': 6 } }));
  eq(window.GAME.totalXP(), 6 * 5, 'purana speed data → XP same (6 × 5)');
}

console.log(`\n${fail ? '✗' : '✓'} ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
