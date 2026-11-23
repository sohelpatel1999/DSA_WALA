#!/usr/bin/env node
// Validator ka "mutation test": project ki temp copy me jaan-boojh ke ek-ek galti daalo → validator ko pakadni chahiye.
// Usage: node tools/test-validator.js   (exit 0 = validator har galti pakadta hai + asli project clean hai)
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;

function copyTree(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const a = path.join(src, e.name), b = path.join(dst, e.name);
    if (e.isDirectory()) copyTree(a, b); else fs.copyFileSync(a, b);
  }
}
const run = dir => { const r = cp.spawnSync(process.execPath, [path.join(dir, 'tools', 'validate.js')], { encoding: 'utf8' }); return (r.stdout || '') + (r.stderr || ''); };

// 1) asli project: STRICT phases me 0 errors
{
  const out = run(ROOT), m = out.match(/(\d+) errors/);
  if (m && m[1] === '0') pass++; else { fail++; console.log('  ✗ asli project me errors hain:\n' + out.split('\n').filter(l => /✗/.test(l)).slice(0, 10).join('\n')); }
}

// 2) mutations — har ek ek alag copy me
const MUT = [
  { name: 'oneLine chhota (try Hint 2)', file: 'data/phase-01-arrays.js', from: "oneLine: 'Running sum: nums[i] += nums[i−1] — prefix sum ki pehli seedhi.'", to: "oneLine: 'short'", expect: 'oneLine chhota' },
  { name: 'pattern ki alag spelling (report)', file: 'data/phase-01-arrays.js', from: "pattern: 'Prefix Sum',", to: "pattern: 'Prefix sum',", expect: 'pattern ki alag spelling' },
  { name: 'quiz ka galat ans index', file: 'data/phase-01-lessons-zquiz.js', from: "['2003', '2012', '2016', '2004'], 1,", to: "['2003', '2012', '2016', '2004'], 7,", expect: 'ans 0–3' },
  { name: 'quiz ki explanation missing', file: 'data/phase-01-lessons-zquiz.js', from: "'2000 + 3 × 4 = 2012. Ek calculation — isliye access O(1).'", to: "''", expect: 'why (explanation) missing' },
  { name: 'debugger galat line (line skip)', file: 'viz/phase-01x.js', from: "T.st('int c = freq.getOrDefault(x, 0) + 1'", to: "T.st('freq.put(x, c)'", expect: 'debugger coverage' },
  { name: 'Brute tab missing', file: 'viz/phase-01x.js', from: '  // ================= LC 1295 — Brute (String) =================\n  add(1295,', to: '  // ================= LC 1295 — Brute (String) =================\n  (() => {})(1295,', expect: 'visualizer tab nahi' },
  { name: 'try box ke liye problem block missing', file: 'data/phase-04-lessons-w1.js', from: "{ title: 'Part 4 — Aaj ka problem: LC 206 Reverse Linked List', blocks: [{ problem: 206 }] },", to: '', expect: 'try box ke liye' },
  { name: 'Optimal approach missing', file: 'data/phase-01-arrays.js', from: "level: 'Optimal', idea: 'Pichla sum already pata hai", to: "level: 'Fast', idea: 'Pichla sum already pata hai", expect: 'Brute aur Optimal approach dono chahiye' },
  // STRICT_WEEKS (partial strict phase — stack-queue Week 7): quiz + 100% debugger coverage yahan bhi ERROR
  { name: 'stack-queue week-1 quiz missing', file: 'data/phase-05-lessons-zquiz.js', from: "    3: [\n      ['enqueue 10, 20, 30, dequeue, peek", to: "    93: [\n      ['enqueue 10, 20, 30, dequeue, peek", expect: 'quiz missing' },
  { name: 'stack-queue week-1 debugger line skip', file: 'viz/phase-05x.js', from: "size--; T.st('size--', 'size = ' + size + ' (arr['", to: "size--; T.st('return size == 0', 'size = ' + size + ' (arr['", expect: 'debugger coverage' },
];
const base =fs.mkdtempSync(path.join(os.tmpdir(), 'dsa-mut-'));
for (const m of MUT) {
  const dir = path.join(base, m.name.replace(/\W+/g, '_'));
  copyTree(ROOT, dir);
  const f = path.join(dir, m.file), s = fs.readFileSync(f, 'utf8');
  if (!s.includes(m.from)) { fail++; console.log('  ✗ [' + m.name + '] mutation ka text file me nahi mila (test update karo)'); continue; }
  fs.writeFileSync(f, s.replace(m.from, m.to));
  const out = run(dir);
  if (out.includes(m.expect) && /✗ [1-9]\d* errors/.test(out)) pass++;
  else { fail++; console.log('  ✗ [' + m.name + '] validator ne nahi pakda (expected: "' + m.expect + '")'); }
}
fs.rmSync(base, { recursive: true, force: true });
console.log(`\n${fail ? '✗' : '✓'} validator mutation tests: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
