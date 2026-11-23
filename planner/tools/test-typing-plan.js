// Planner typing: har DSA approach + har theory Q&A + har "Aise bolo" perfect type ho; revision default Optimal + level choice
// Run (dsa-visual/ se): node planner/tools/test-typing-plan.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { loadLessons } = require('./_load');

const { lessons } = loadLessons();
const store = {};
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
vm.runInThisContext(fs.readFileSync(path.join(__dirname, '..', '..', 'typing.js'), 'utf8'), { filename: 'typing.js' });
vm.runInThisContext(fs.readFileSync(path.join(__dirname, '..', 'typing-plan.js'), 'utf8'), { filename: 'typing-plan.js' });
const T = global.TYPING, PT = global.PLAN_TYPING;

let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) pass++; else { fail++; console.log('✗ ' + msg); } };
function typesPerfect(t, it) {
  const rows = T.linesOf(t, it);
  if (!rows.length) return false;
  const E = T.engine(rows);
  rows.forEach(r => { for (const ch of r.code.slice(/^\s*/.exec(r.code)[0].length)) E.press(ch); E.press('\n'); });
  return E.done && E.errors === 0 && rows.every(r => /^[\x20-\x7e\t]*$/.test(r.code) || !it.prose);
}

let nd = 0, nt = 0, nItems = 0;
for (const [id, L] of Object.entries(lessons)) {
  const learn = PT.block(id, L, 'learn'), rev = PT.block(id, L, 'rev');
  ok(learn && learn.items.length, `${id}: learn typing block`);
  ok(rev && rev.items.length, `${id}: revision typing block`);
  if (!learn || !rev) continue;
  const labels = learn.items.map(i => i.label);
  ok(new Set(labels).size === labels.length, `${id}: learn tab labels unique (best WPM key)`);
  [...learn.items, ...rev.items].forEach(it => { nItems++; ok(typesPerfect(learn, it), `${id}: "${it.label}" perfect type`); });
  if (L.kind === 'dsa') {
    nd++;
    const codeTabs = learn.items.filter(i => !i.prose);
    ok(codeTabs.length === L.approaches.length, `${id}: har approach ka tab (${codeTabs.length}/${L.approaches.length})`);
    ok(codeTabs.map(i => i.label).join() === L.approaches.map(a => a.level).join(), `${id}: order Brute → Optimal`);
    ok(rev.items.filter(i => !i.prose).length === 1 && /Optimal/.test(rev.items[0].label), `${id}: revision default Optimal`);
    ok(!learn.items.some(i => i.prose && /^Q\d/.test(i.label)), `${id}: DSA me interview qa typing nahi`);
    ok(codeTabs.every(i => i.notes.some(Boolean)), `${id}: line notes`);
  } else {
    nt++;
    const ip = L.parts.find(p => /^🎤\s*Interview/.test(p.title));
    const nq = ip ? ip.blocks.reduce((a, b) => a + (b.qa ? b.qa.length : 0), 0) : 0;
    ok(nq > 0 && learn.items.filter(i => /^Q\d/.test(i.label)).length === nq, `${id}: har interview question ka tab (${nq})`);
  }
  const nSay = L.parts.reduce((a, p) => a + p.blocks.reduce((x, b) => x + (b.say ? b.say.length : 0), 0), 0);
  ok(learn.items.filter(i => i.label.startsWith('🎤')).length === nSay, `${id}: har "Aise bolo" ka tab`);
  // part placement
  const W = PT.withTyping(id, L);
  ok(W.parts.length === L.parts.length + 1 && L.parts.every(p => !/⌨️/.test(p.title)), `${id}: typing part add, original same`);
  const ti = W.parts.findIndex(p => /^⌨️/.test(p.title));
  const prev = W.parts[ti - 1] && W.parts[ti - 1].title;
  ok(L.kind === 'dsa' ? /^▶|^💻/.test(prev) : /^🎤\s*Interview/.test(prev), `${id}: typing part sahi jagah (after "${prev}")`);
}

// level choice
const dsaId = Object.keys(lessons).find(id => lessons[id].kind === 'dsa' && lessons[id].approaches.length >= 2);
const L = lessons[dsaId];
ok(/Optimal/.test(PT.dsaRev(dsaId, L, {}).label), 'no pref → Optimal');
const b = PT.dsaRev(dsaId, L, { [dsaId]: 'Brute' });
ok(b.label.includes('Brute — aapki choice') && b.code === L.approaches[0].code && !b.hint, 'Brute pref → Brute code, no hint');
ok(/Optimal/.test(PT.dsaRev(dsaId, L, { [dsaId]: 'Nope' }).label), 'invalid pref → Optimal');
ok(b.alts && b.alts.length === L.approaches.length, 'picker me saare levels');
ok(/Brute/.test(PT.dsaRev(dsaId, L, {}).hint), 'Optimal pe Brute hint');
// prose helper
ok(T.wrapProse('A — b → c “d” it’s').join(' ') === 'A - b -> c "d" it\'s', 'wrapProse ASCII');
ok(T.wrapProse('word '.repeat(40)).every(l => l.length <= 70), 'wrapProse ≤ 70 chars');

console.log(`DSA ${nd} · theory ${nt} · ${nItems} typing items checked`);
console.log(fail ? `✗ ${pass} pass, ${fail} fail` : `✓ ${pass} pass, 0 fail`);
process.exit(fail ? 1 : 0);
