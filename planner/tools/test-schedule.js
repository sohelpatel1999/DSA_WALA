// Planner ka "dynamic day" logic test: node planner/tools/test-schedule.js
// Asli planner code (switch-prep-planner.html) chalta hai — jo item Done nahi hua (DSA question ya Java topic) wo agle din aage aata hai,
// aur aane wale dino ke har item ka lesson bana hai ya nahi (manifest) — wo bhi check.
const fs = require('fs');
const path = require('path');
const { loadPlanner, daysFrom } = require('./_planner');

let pass = 0, fail = 0;
const ok = (c, name) => { if (c) pass++; else { fail++; console.log('  ✗ ' + name); } };
const eq = (a, b, name) => ok(JSON.stringify(a) === JSON.stringify(b), name + '  (mila ' + JSON.stringify(a) + ', chahiye ' + JSON.stringify(b) + ')');

const P = loadPlanner();
const base = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'switch-prep-progress.json'), 'utf8'));
const clone = o => JSON.parse(JSON.stringify(o));
const done = (st, id, day) => { st.items[id] = Object.assign({}, st.items[id], { s: 'd', done: day, stage: 0, due: P.addDays(day, 1) }); return st; };
const D1 = base.cfg.start, D2 = P.addDays(D1, 1), D3 = P.addDays(D1, 2), D4 = P.addDays(D1, 3);

console.log('== Day 1 → Day 2 (aaj ka progress)');
{
  const d = daysFrom(P, base, D1, 4);
  eq(d[D1], ['c1'], 'Day 1 pe bacha hua sirf c1 (a1–a4 Done)');
  eq(d[D2], ['a5', 'a6', 'c2'], 'Day 2 = a5, a6 + c2');
  const st = done(clone(base), 'c1', D1);
  eq(daysFrom(P, st, D1, 2)[D2], ['a5', 'a6', 'c2'], 'c1 Day 1 pe Done → Day 2 same rehta hai');
}

console.log('== Java topic chhoota → aage shift');
{
  const d = daysFrom(P, base, D2, 3);   // Day 2 khola, c1 abhi bhi pending
  eq(d[D2], ['a5', 'a6', 'c1'], 'c1 Day 2 pe aa gaya (c2 ki jagah)');
  eq(d[D3], ['a7', 'a8', 'h1', 'c2'], 'c2 Day 3 pe');
  eq(d[D4], ['h2', 'h3', 'c3'], 'c3 Day 4 pe');
}

console.log('== DSA question chhoota → aage shift');
{
  // Day 2 pe sirf a5 kiya, a6 + c2 nahi; Day 3 khola
  const st = done(done(clone(base), 'c1', D1), 'a5', D2);
  const d = daysFrom(P, st, D3, 2);
  eq(d[D3][0], 'a6', 'a6 (chhoota hua) Day 3 pe sabse pehle');
  ok(d[D3].includes('c2'), 'c2 (chhoota hua) Day 3 pe');
  ok(!d[D3].includes('a5'), 'a5 Done → dobara nahi aata (revision me aayega)');
  // Day 2 pe kuch bhi nahi kiya → Day 3 (Wed, lamba din) pe pehle Day 2 wale, phir budget bacha toh aage ka
  const st2 = done(clone(base), 'c1', D1);
  const d3 = daysFrom(P, st2, D3, 1)[D3];
  eq(d3.slice(0, 2), ['a5', 'a6'], 'poora Day 2 chhoota → a5, a6 Day 3 pe sabse pehle');
  ok(d3.includes('c2'), 'c2 bhi Day 3 pe (skip nahi hua)');
  // koi item kabhi skip nahi hota: aage ke 10 din me pending order planner ke order jaisa hi
  const seq = Object.values(daysFrom(P, st2, D3, 10)).flat().filter(id => P.BY_ID[id].track === 'dsa');
  const order = P.ALL_ITEMS.filter(i => i.track === 'dsa' && !(st2.items[i.id] && st2.items[i.id].s === 'd') && !i.bonus).map(i => i.id).slice(0, seq.length);
  eq(seq, order, 'aage ke din: DSA items planner ke order me, beech me koi skip nahi');
}

console.log('== Aage ka kaam pehle kar liya → schedule aage khisakta hai');
{
  const st = done(done(done(clone(base), 'c1', D1), 'a5', D1), 'a6', D1);   // Day 1 pe hi a5, a6 bhi kar liye
  const d2 = daysFrom(P, st, D2, 1)[D2];
  eq(d2[0], 'a7', 'Day 2 (Tue, chhota din) pe seedha a7');
  ok(!d2.includes('a5') && !d2.includes('a6'), 'a5, a6 dobara nahi aate');
}

console.log('== Revision: Done item 1 din baad due');
{
  const n = P.nextReview({ stage: 0 }, 'ok', D2);
  eq(n, { stage: 1, due: P.addDays(D2, 3) }, 'OK rating → +3 din');
  eq(base.items.a1.due, D2, 'Day 1 ke questions ka pehla revision Day 2 pe');
}

console.log('== Lessons: Day 2–4 ke har item ka lesson (har scenario me)');
{
  global.window = global;
  require(path.join(__dirname, '..', 'lessons', 'manifest.js'));
  const files = window.PLAN_MANIFEST.files;
  const scenarios = [
    daysFrom(P, base, D1, 4),
    daysFrom(P, done(clone(base), 'c1', D1), D1, 4),
    daysFrom(P, base, D2, 3),
  ];
  const need = [...new Set(scenarios.flatMap(s => [D2, D3, D4].flatMap(d => s[d] || [])))];
  const missing = need.filter(id => !files[id]);
  eq(missing, [], 'Day 2–4 ke saare items ka lesson ready (' + need.join(', ') + ')');

  // Day 5–8: on track (Day 1–4 sab Done) + Day 4 ka kuch chhoota
  const D5 = P.addDays(D1, 4), D8 = P.addDays(D1, 7);
  const onTrack = clone(base);
  ['c1'].forEach(id => done(onTrack, id, D1));
  ['a5', 'a6', 'c2'].forEach(id => done(onTrack, id, D2));
  ['a7', 'a8', 'h1', 'c3'].forEach(id => done(onTrack, id, D3));
  ['h2', 'h3', 'c4'].forEach(id => done(onTrack, id, D4));
  const behind = clone(onTrack); delete behind.items.h3; delete behind.items.c4;
  const dd = [0, 1, 2, 3].map(k => P.addDays(D5, k));
  const need58 = [...new Set([daysFrom(P, onTrack, D5, 4), daysFrom(P, behind, D5, 4)].flatMap(s => dd.flatMap(d => s[d] || [])))];
  eq(need58.filter(id => !files[id]), [], 'Day 5–8 (' + D5 + '…' + D8 + ') ke saare items ka lesson ready (' + need58.join(', ') + ')');

  // Day 9–14: Day 1–8 sab Done + Day 8 ka kuch chhoota
  const D9 = P.addDays(D1, 8);
  const onTrack9 = clone(onTrack);
  ['h4', 'g1', 'g2', 'c5', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'c6', 'c7', 'r7', 'lp1', 'r8', 'b1', 'b2', 'c8'].forEach(id => done(onTrack9, id, D8));
  const behind9 = clone(onTrack9); delete behind9.items.b2; delete behind9.items.c8;
  const dd9 = [0, 1, 2, 3, 4, 5].map(k => P.addDays(D9, k));
  const need914 = [...new Set([daysFrom(P, onTrack9, D9, 6), daysFrom(P, behind9, D9, 6)].flatMap(s => dd9.flatMap(d => s[d] || [])))];
  eq(need914.filter(id => !files[id]), [], 'Day 9–14 ke saare items ka lesson ready (' + need914.join(', ') + ')');
}

console.log(`\n${fail ? '✗' : '✓'} ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
