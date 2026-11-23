#!/usr/bin/env node
// ⌨️ Typing practice ke tests: node tools/test-typing.js
// Asli lesson data (index.html order) + typing.js engine — har typing item ko "perfect" aur "galti ke saath" type karke dekhte hain.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (c, name) => { if (c) pass++; else { fail++; console.log('  ✗ ' + name); } };
const eq = (a, b, name) => ok(JSON.stringify(a) === JSON.stringify(b), name + '  (mila ' + JSON.stringify(a) + ', chahiye ' + JSON.stringify(b) + ')');

global.window = global;
global.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
global.document = { addEventListener() {}, querySelectorAll: () => [] };
require(path.join(ROOT, 'roadmap.js'));
[...fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').matchAll(/src="(data\/[^"]+)"/g)].forEach(m => require(path.join(ROOT, m[1])));
require(path.join(ROOT, 'typing.js'));
const T = window.TYPING;

// saare lessons ke typing blocks
const found = [];
Object.entries(window.PHASE_CONTENT).forEach(([pid, c]) => Object.entries(c.lessons || {}).forEach(([day, L]) =>
  (L.parts || []).forEach(pt => (pt.blocks || []).forEach(b => { if (b.typing) found.push({ pid, day, t: b.typing }); }))));

console.log('== Typing blocks mile');
ok(found.length >= 1, 'kam se kam ek typing block (Day 33)');
const d33 = found.find(f => f.pid === 'linked-list' && f.day === '5');
ok(!!d33, 'Day 33 (linked-list local day 5) me typing block');

const typeAll = (E, rows) => { rows.forEach(r => { for (const ch of r.code.slice(/^\s*/.exec(r.code)[0].length)) E.press(ch); E.press('\n'); }); };

found.forEach(({ pid, day, t }) => {
  console.log(`== ${pid} day ${day} · LC ${t.q}`);
  t.items.forEach(it => {
    const rows = T.linesOf(t, it);
    ok(rows.length > 0, `"${it.label}": lines bani`);
    if (it.ap !== undefined) {
      const code = T.questionCode(t.q, it.ap).split('\n').filter(l => l.trim());
      eq(rows.map(r => r.code), code, `"${it.label}": code = approach ${it.ap} ka code (drift nahi)`);
      ok(rows.filter(r => r.note).length >= rows.length / 2, `"${it.label}": aadhi se zyada lines pe comment`);
    }
    // perfect typing
    const E = T.engine(rows);
    typeAll(E, rows);
    ok(E.done, `"${it.label}": poora type → done`);
    eq([E.correct, E.errors], [E.total, 0], `"${it.label}": perfect → correct = total, errors 0`);
    ok(E.press('x').ignored, `"${it.label}": done ke baad key ignore`);
  });
});

console.log('== Revision typing (Part 0 headings ke LC → Optimal code)');
{
  const L33 = window.PHASE_CONTENT['linked-list'].lessons[5];
  const b = T.revisionBlock(L33);
  eq(b && b.items.map(i => i.q), [876, 217, 283], 'Day 33 revision = LC 876, 217, 283 (Part 0 ki headings jaisa)');
  ok(b.items.every(i => /\(Optimal\)$/.test(i.label)), 'har item Optimal code');
  b.items.forEach(it => {
    const rows = T.linesOf(b, it), E = T.engine(rows);
    ok(rows.every(r => !/\/\//.test(r.code)), `LC ${it.q}: code ke andar ka // comment type nahi karwate`);
    typeAll(E, rows);
    ok(E.done && E.errors === 0, `LC ${it.q}: perfect type → done`);
  });
  const mz = T.linesOf(b, b.items[2]);
  ok(mz.some(r => r.code.trim() === 'int k = 0;' && /next non-zero/.test(r.note)), 'inline comment → side note ban gaya');
  let days = 0, empty = 0;
  Object.values(window.PHASE_CONTENT).forEach(c => Object.values(c.lessons || {}).forEach(L => {
    const rb = T.revisionBlock(L); if (!rb) return; days++;
    rb.items.forEach(it => { if (!T.linesOf(rb, it).length) empty++; });
  }));
  ok(days >= 100, `100+ din me revision typing (mile ${days})`);
  eq(empty, 0, 'koi revision item khaali nahi');
  eq(T.revisionBlock({ parts: [{ title: 'Part 1 — x', blocks: [{ h: 'LC 1 — Two Sum' }] }] }), null, 'Part 0 na ho → revision typing nahi');
}

console.log('== Auto rules (roz Optimal + important version · revision day saare · learn day saare)');
{
  const lv = n => window.PHASE_CONTENT['linked-list'].questions[n].approaches.map(a => a.level);
  const pick = (n, mode) => T.pickAps(window.PHASE_CONTENT['linked-list'].questions[n], mode).map(i => lv(n)[i]);
  eq(pick(21, 'daily'), ['Optimal', 'Recursive'], 'LC 21 roz: Optimal + Recursive (important doosra version), Brute nahi');
  eq(pick(21, 'all'), lv(21), 'LC 21 revision day: saare levels');
  const rb = T.revisionBlock(window.PHASE_CONTENT['linked-list'].lessons[5]);
  ok(rb.items.filter(i => i.hint).every(i => /^Brute \(sirf yaad karo/.test(i.hint)), 'Optimal tab pe Brute ka 1-line hint');
  ok(rb.items.every(i => !/\(Brute\)$/.test(i.label)), 'roz ke revision me Brute tab nahi');
  // revision day
  const qd = T.qsBlock([206, 876, 21].map(n => ({ n, name: 'x' })), 'all');
  ok(qd.items.some(i => /\(Brute\)$/.test(i.label)) && qd.items.length >= 6, 'revision day: Brute bhi (saare levels)');
  // learn days
  let learn = 0, manualSkip = 0;
  Object.entries(window.PHASE_CONTENT).forEach(([pid, c]) => (c.days || []).forEach(d => {
    if (d.type !== 'learn') return;
    const L = (c.lessons || {})[d.day]; if (!L) return;
    const n = L.main || (d.qs && d.qs[0]); if (!n) return;
    const b = T.learnBlock(L, n, 'x');
    if (b) { learn++; ok(b.items.length >= 2 && b.items.every(it => T.linesOf(b, it).length), `${pid} day ${d.day}: learn typing items bane`); }
    else if ((L.parts || []).some(p => (p.blocks || []).some(x => x.typing))) manualSkip++;
  }));
  ok(learn >= 50, `50+ learn days pe auto typing (mile ${learn})`);
  eq(manualSkip, 1, 'haath wala typing block (Day 33) → auto learn typing nahi (duplicate nahi)');
}

console.log('== Engine rules');
{
  const rows = [{ code: 'int a;' }, { code: '    a++;' }];
  const E = T.engine(rows);
  eq([E.li, E.ci], [0, 0], 'start pehli line, pehla char');
  ok(!E.press('x').ok && E.ci === 0 && E.errors === 1, 'galat key → error++, cursor wahin');
  'int a;'.split('').forEach(ch => E.press(ch));
  ok(!E.press('a').ok && E.li === 0, 'line end pe Enter ke bina aage nahi');
  ok(E.press('\n').ok, 'Enter sahi');
  eq([E.li, E.ci], [1, 4], 'indent apne aap skip (4 spaces)');
  'a++;'.split('').forEach(ch => E.press(ch));
  E.press('\n');
  ok(E.done, 'aakhri line ke Enter pe done');
  eq(E.total, 6 + 1 + 4 + 1, 'total = type karne layak chars + har line ka Enter');
  ok(T.engine([]).done, 'khaali item → turant done (crash nahi)');
}

console.log('== HTML');
if (d33) {
  const h = T.html(d33.t);
  ok(/class="typing"/.test(h) && (h.match(/data-tyitem=/g) || []).length === d33.t.items.length, 'har item ka tab button');
  ok(!/data-typing='[^']*'[^>]*'/.test(h.replace(/&#39;/g, '')), "comments ke ' se attribute nahi tootta");
}

console.log('== Revision gaps (har learned question revision me aaye)');
{
  // G = global day → {type, qs, L} (index.html / ROADMAP order — app.js gDays jaisa)
  const G = {};
  window.ROADMAP.forEach(p => {
    const c = window.PHASE_CONTENT[p.id]; if (!c || !c.days) return;
    const w0 = Number(p.weeks.match(/\d+/)[0]);
    c.days.forEach(d => { G[(w0 - 1) * 7 + Number(d.day)] = { type: d.type, qs: d.qs || [], L: (c.lessons || {})[d.day] }; });
  });
  eq(T.revGaps(G, 1), [], 'Day 1: revision nahi');
  eq(T.revGaps(G, 2), [26], 'Day 2: LC 26 (kal ka) jud gaya — 1920 Part 0 me pehle se');
  ok(T.revGaps(G, 7).includes(26), 'Day 7 (Week 1 me revision day nahi → mock): LC 26 jud gaya');
  ok(T.revGaps(G, 13).includes(268) && T.revGaps(G, 13).includes(525), 'Day 13 revision: 268, 525 jud gaye');
  eq(T.revGaps(G, 44), [], 'Day 44: LC 20 aaj ka hi question hai → gap nahi');
  ok(T.revisionBlock(G[2].L, 'daily', [{ n: 26, name: 'Remove Duplicates' }]).items.some(i => i.q === 26), 'Day 2 typing me LC 26 Optimal');
  // coverage: har learn day ka har question agle din (learn) ya hafte ke revision/mock me aata hai
  const miss = [];
  Object.keys(G).map(Number).sort((a, b) => a - b).forEach(n => {
    const x = G[n]; if (x.type !== 'learn') return;
    const nx = G[n + 1], ws = Math.floor((n - 1) / 7) * 7;
    const inRev = q => Object.keys(G).map(Number).some(g => g > n && g <= ws + 7 && G[g].type !== 'learn' && (G[g].qs.includes(q) || T.revGaps(G, g).includes(q)));
    const nextDay = q => { const rb = T.revisionBlock(nx.L, 'daily', T.revGaps(G, n + 1).map(k => ({ n: k, name: '' }))); return nx.qs.includes(q) || !!(rb && rb.items.some(i => i.q === q)); };
    x.qs.forEach(q => { if (!(nx && nx.type === 'learn' ? nextDay(q) || inRev(q) : inRev(q))) miss.push(n + ':' + q); });
  });
  eq(miss, [], 'koi learned question revision se nahi chhoota');
}

console.log('== Learn day: har question ki typing, apne Visualize ke baad');
{
  const miss = [];
  window.ROADMAP.forEach(p => {
    const c = window.PHASE_CONTENT[p.id]; if (!c || !c.days) return;
    c.days.forEach(d => {
      const L = (c.lessons || {})[d.day]; if (d.type !== 'learn' || !L) return;
      const out = T.withLearn(L.parts, L, d, q => 'Q' + q, (t, q) => ({ title: 'TY ' + q }));
      const manual = new Set(); L.parts.forEach(pt => (pt.blocks || []).forEach(b => { if (b.typing) manual.add(Number(b.typing.q)); }));
      (d.qs || []).forEach(q => { if (!manual.has(q) && !out.some(x => x.typingQ === q)) miss.push(p.id + ' ' + d.day + ':' + q); });
    });
  });
  eq(miss, [], 'har learn-day question (main + doosre) ki typing');
  const c1 = window.PHASE_CONTENT.arrays, L1 = c1.lessons[1], out1 = T.withLearn(L1.parts, L1, c1.days[0], q => 'Q' + q, (t, q) => ({ title: 'TY ' + q }));
  const i1920 = out1.findIndex(x => x.typingQ === 1920), i26 = out1.findIndex(x => x.typingQ === 26);
  ok(out1[i1920 - 1].blocks.some(b => b.viz === 1920), 'Day 1: LC 1920 typing uske Visualize ke baad (concept viz ke baad nahi)');
  ok(i26 > i1920 && out1[i26 - 1].blocks.some(b => b.viz === 26 || b.problem === 26), 'Day 1: LC 26 typing apne part ke baad');
  const L33 = window.PHASE_CONTENT['linked-list'].lessons[5];
  ok(!T.learnBlock(L33, 21, 'x'), 'Day 33: haath wala typing block → auto nahi (duplicate nahi)');
}

console.log('== API warm-up (Fundamentals)');
{
  require(path.join(ROOT, 'data', 'warmup-api.js'));
  const W = window.WARMUP || {};
  const phases = window.ROADMAP.filter(p => window.PHASE_CONTENT[p.id] && p.id !== 'revision').map(p => p.id);
  eq(phases.filter(id => !W[id]), [], 'har phase (revision chhod ke) ka warm-up');
  ok((W._common || []).some(it => /HashMap/.test(it.label)) && W._common.some(it => /ArrayList/.test(it.label)), 'common Java Collections: ArrayList + HashMap');
  eq(phases.filter(id => !W[id].some(it => it.kind === 'template')), [], 'har phase me kam se kam ek 🧩 template');
  let items = 0, bad = [];
  Object.entries(W).forEach(([pid, list]) => list.forEach(it => {
    items++;
    const t = { q: 0, items: [{ label: it.label, lines: it.lines }] }, rows = T.linesOf(t, t.items[0]), E = T.engine(rows);
    if (rows.length !== it.lines.filter(l => l[0].trim()).length) bad.push(pid + ' ' + it.label + ': lines kam');
    typeAll(E, rows);
    if (!E.done || E.errors) bad.push(pid + ' ' + it.label + ': type nahi hua');
  }));
  ok(items >= 20, `20+ warm-up items (mile ${items})`);
  eq(bad, [], 'har warm-up item perfect type ho jaata hai');
  ok(W['linked-list'].some(it => /Day 33/.test(it.label)), 'Day 33 ka warm-up Linked List Fundamentals me shift');
  const L33 = window.PHASE_CONTENT['linked-list'].lessons[5];
  ok(!JSON.stringify(L33).includes('Warm-up: aaj ke declarations'), 'Day 33 lesson se warm-up hat gaya (duplicate nahi)');
}

console.log('== Level choice (roz ke revision me Optimal ki jagah apna level)');
{
  const store = {};
  const saved = global.localStorage;
  global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
  const def = T.qsBlock([{ n: 1, name: 'Two Sum' }], 'daily');
  ok(/\(Optimal\)$/.test(def.items[0].label) && def.items[0].pick && def.items[0].pick.length >= 2, 'default Optimal + level picker');
  store['dsa-typing-level'] = JSON.stringify({ 1: 'Brute' });
  const b = T.qsBlock([{ n: 1, name: 'Two Sum' }], 'daily');
  ok(/Brute — aapki choice/.test(b.items[0].label), 'choice Brute → Brute type hota hai');
  ok(!b.items[0].hint, 'Brute choice pe Brute hint nahi');
  const rows = T.linesOf(b, b.items[0]), E = T.engine(rows);
  typeAll(E, rows); ok(E.done && E.errors === 0, 'Brute choice type ho jaata hai');
  const all = T.qsBlock([{ n: 1, name: 'Two Sum' }], 'all').items;
  eq(all.map(i => i.ap), all.map((x, i) => i), 'Saturday (all) pe choice ka asar nahi — saare levels');
  ok(all.length >= 2 && all.every(i => !/aapki choice/.test(i.label)), 'Saturday labels normal');
  store['dsa-typing-level'] = JSON.stringify({ 1: 'Galat' });
  ok(/\(Optimal\)$/.test(T.qsBlock([{ n: 1, name: 'Two Sum' }], 'daily').items[0].label), 'na milne wala level → Optimal');
  global.localStorage = saved;
}

console.log(`\n${fail ? '✗' : '✓'} ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
