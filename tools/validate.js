#!/usr/bin/env node
// Content checker. Usage:
//   node tools/validate.js                 → saare phases
//   node tools/validate.js two-pointers    → sirf ek phase
//   node tools/validate.js linked-list --java   → saath me har approach ka Java compile (javac chahiye)
// Exit code 0 = sab theek.
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2), only = args.find(a => !a.startsWith('--')), doJava = args.includes('--java');

// ---- load everything like the browser does (stub window/document) ----
global.window = global; global.document = { body: { contains: () => true } };
const order = f => [/roadmap/, /phase-\d+-[^-]+(-[a-z]+)*\.js$/, /problems/, /lessons|days/].findIndex(r => r.test(f));
require(path.join(ROOT, 'roadmap.js'));
const dataFiles = fs.readdirSync(path.join(ROOT, 'data')).filter(f => f.endsWith('.js')).sort();
const main = dataFiles.filter(f => !/lessons|days|problems/.test(f)), rest = dataFiles.filter(f => /problems/.test(f)), les = dataFiles.filter(f => /lessons|days/.test(f));
[...main, ...rest, ...les].forEach(f => require(path.join(ROOT, 'data', f)));
require(path.join(ROOT, 'visualizers.js'));
if (fs.existsSync(path.join(ROOT, 'viz'))) fs.readdirSync(path.join(ROOT, 'viz')).filter(f => f.endsWith('.js')).sort().forEach(f => require(path.join(ROOT, 'viz', f)));
void order;

const R = window.ROADMAP, C = window.PHASE_CONTENT || {}, V = window.VIZ.defs;
const COURSE = new Map(); R.forEach(p => p.qs.forEach(q => COURSE.set(q[0], p)));
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weekRange = p => { const m = p.weeks.match(/\d+/g).map(Number); return [m[0], m[m.length - 1]]; };
const norm = s => String(s).replace(/["'\s]/g, '').toLowerCase();

let errors = 0, warns = 0;
// User ke apne content wale phases — yahan debugger / quiz / Brute-Optimal checks ERROR hain; baaki me WARNING.
// Naya week/phase user ke content se bane toh uska id yahan jodo.
const STRICT = ['arrays', 'two-pointers', 'sliding-window', 'linked-list'];
// Partial strict: phase ke sirf kuch local weeks user ke content se bane hain (baaki purana content).
// Un weeks ke days → strict lesson checks + quiz zaroori; un days me aaye questions → strict viz checks.
const STRICT_WEEKS = { 'stack-queue': [1, 2] };   // Week 7 + Week 8 = poora phase
const strictDay = (id, d) => STRICT.includes(id) || !!(STRICT_WEEKS[id] && d && STRICT_WEEKS[id].includes(d.week));
const strictQ = (id, n) => STRICT.includes(id) || !!(STRICT_WEEKS[id] && ((C[id] || {}).days || []).some(d => strictDay(id, d) && (d.qs || []).includes(Number(n))));
const MIN_COVERAGE = 80;   // % executable lines (non-STRICT phases)
const MIN_COVERAGE_STRICT = 100;   // user ke content wale phases: har asli line step honi chahiye
const err = (p, m) => { errors++; console.log(`  ✗ [${p}] ${m}`); };
const warn = (p, m) => { warns++; console.log(`  ! [${p}] ${m}`); };

function textOf(o) { return JSON.stringify(o); }

function checkPhase(p) {
  const id = p.id, c = C[id];
  console.log(`\n== Phase ${p.phase} · ${p.title} (${id})`);
  if (!c) return err(id, 'PHASE_CONTENT missing');
  const [w0, w1] = weekRange(p), nDays = (w1 - w0 + 1) * 7;
  const isRev = !p.qs.length;

  // ---- phase-level sections ----
  ['intro'].forEach(k => { if (!c[k]) err(id, `${k} missing`); });
  if (!isRev) {
    if (!Array.isArray(c.fundamentals) || c.fundamentals.length < 3) err(id, 'fundamentals: kam se kam 3 sections');
    if (!Array.isArray(c.operations) || c.operations.length < 4) err(id, 'operations: kam se kam 4');
    if (!Array.isArray(c.patterns) || c.patterns.length < 2) err(id, 'patterns: kam se kam 2');
    (c.patterns || []).forEach(pt => (pt.qs || []).forEach(n => { if (!COURSE.has(n)) err(id, `pattern "${pt.name}" me non-course LC ${n}`); }));
  }
  const L = c.lastMinute;
  if (!L || !L.triggers || !L.edge || !L.mistakes) err(id, 'lastMinute {triggers, edge, mistakes} missing');

  // ---- questions ----
  p.qs.forEach(([n]) => {
    const q = c.questions && c.questions[n], tag = `${id} LC ${n}`;
    if (!q) return err(tag, 'question content missing');
    ['oneLine', 'pattern', 'dryRun', 'interview'].forEach(k => { if (!q[k]) err(tag, `${k} missing`); });
    if (!Array.isArray(q.approaches) || q.approaches.length < 2) err(tag, 'approaches: kam se kam 2 (Brute + Optimal)');
    (q.approaches || []).forEach((a, i) => ['level', 'idea', 'time', 'space', 'code'].forEach(k => { if (!a[k]) err(tag, `approach ${i} ${k} missing`); }));
    (q.approaches || []).forEach((a, i) => { if (/`|\$\{/.test(a.code || '')) err(tag, `approach ${i} code me backtick/\${ hai`); });
    const pr = q.problem;
    if (!pr) err(tag, 'problem {statement, examples, constraints} missing');
    else {
      if (!pr.statement) err(tag, 'problem.statement missing');
      if (!Array.isArray(pr.examples) || pr.examples.length < 2) err(tag, 'problem.examples: kam se kam 2');
      if (!Array.isArray(pr.constraints) || !pr.constraints.length) err(tag, 'problem.constraints missing');
      (pr.examples || []).forEach((e, i) => ['input', 'output', 'explain', 'viz'].forEach(k => { if (e[k] === undefined) err(tag, `example ${i + 1} ${k} missing`); }));
    }
    // ---- visualizer ----
    const def = V[n];
    if (!def) return err(tag, 'VIZ.defs missing');
    const variants = [def].concat(def.variants || []);
    const strict = strictQ(id, n), flag = strict ? err : warn;
    // Try-mode hints: Hint 1 = pattern, Hint 2 = oneLine — dono achhe hone chahiye
    if (!q.pattern || String(q.pattern).trim().length < 3) flag(tag, 'pattern missing (try-mode Hint 1 + report isi se)');
    if (!q.oneLine || String(q.oneLine).trim().length < 20) flag(tag, 'oneLine chhota / missing (try-mode Hint 2, ≥ 20 chars)');
    if (q.pattern && q.oneLine && String(q.oneLine).trim().toLowerCase() === String(q.pattern).trim().toLowerCase()) flag(tag, 'oneLine = pattern — Hint 2 me idea chahiye, naam nahi');
    {
      const lv = (q.approaches || []).map(a => a.level);
      if (!lv.some(l => /^Brute/i.test(l)) || !lv.some(l => /^Optimal/i.test(l))) flag(tag, 'Brute aur Optimal approach dono chahiye (Better optional) — mile: ' + lv.join(', '));
      const tabbed = new Set(variants.map(v => (v.ap !== undefined ? v.ap : def.ap !== undefined ? def.ap : q.approaches.length - 1)));
      q.approaches.forEach((a, i) => { if (!tabbed.has(i)) flag(tag, 'approach ' + i + ' (' + a.level + ') ka visualizer tab nahi (viz/phase-XXx.js me variant jodo)'); });
    }
    variants.forEach((vd0, vi) => {
      const vd = Object.assign({}, def, vd0), vtag = `${tag} viz${variants.length > 1 ? ' variant ' + vi : ''}`;
      const ap = q.approaches[vd.ap === undefined ? q.approaches.length - 1 : vd.ap];
      if (!ap) return err(vtag, `ap index ${vd.ap} galat`);
      const codeLines = (vd.code || ap.code).split('\n'), lines = codeLines.length;
      const hitLines = new Set();
      (pr ? pr.examples : []).forEach((e, ei) => {
        const inp = {};
        try {
          (vd.inputs || def.inputs).forEach(x => {
            const raw = e.viz[x.key] !== undefined ? e.viz[x.key] : x.def, t = x.type || (x.num ? 'num' : 'arr');
            inp[x.key] = t === 'num' ? Number(raw) : t === 'str' ? String(raw) : t === 'json' ? JSON.parse(raw) : window.VIZ.util.parseArr(raw);
          });
        } catch (ex) { return err(vtag, `example ${ei + 1} viz input parse fail: ${ex.message}`); }
        let steps;
        try { steps = vd.run(inp); } catch (ex) { return err(vtag, `example ${ei + 1} run() threw: ${ex.message}`); }
        if (!steps || !steps.length) return err(vtag, `example ${ei + 1}: 0 steps`);
        const bad = steps.filter(s => !(s.line >= 1 && s.line <= lines));
        if (bad.length) err(vtag, `example ${ei + 1}: ${bad.length} steps ka line 1..${lines} ke bahar`);
        const last = steps[steps.length - 1], want = e.ret !== undefined ? e.ret : e.output;
        if (last.ret === undefined) err(vtag, `example ${ei + 1}: last step pe ret nahi`);
        else if (norm(last.ret) !== norm(want)) err(vtag, `example ${ei + 1}: viz ret "${last.ret}" ≠ expected "${want}" (example.ret se override kar sakte ho)`);
        steps.forEach((s, si) => { if (s.views) s.views.forEach(vw => { try { window.VIZ.util.viewHtml(vw); } catch (ex) { err(vtag, `step ${si} view render fail: ${ex.message}`); } }); });
        steps.forEach(s => hitLines.add(s.line));
        // Galat line: step ka line khaali / sirf brace / comment nahi ho sakta
        const junk = steps.filter((s, si) => !(si === steps.length - 1 && /^\s*}\s*$/.test(codeLines[s.line - 1] || '')) && s.line >= 1 && s.line <= lines && /^(\s*|\s*[{}]+;?\s*|\s*\/\/.*)$/.test(codeLines[s.line - 1]));
        if (junk.length) flag(vtag, `example ${ei + 1}: ${junk.length} steps khaali / brace / comment line pe (snippet galat line pakad raha hai?)`);
        // Variables khaali nahi: views wale steps me vars ya frames hone chahiye
        const noVars = steps.filter(s => s.views && !(s.frames && s.frames.length) && !(s.vars && Object.keys(s.vars).length));
        if (noVars.length > Math.max(1, steps.length * 0.1)) flag(vtag, `example ${ei + 1}: ${noVars.length}/${steps.length} steps me VARIABLES khaali`);
      });
      // Debugger coverage: executable lines (signature / braces / comments / class / field chhod ke) me se kitni chali
      const exec = codeLines.map((l, i) => i + 1).filter(n => {
        const t = codeLines[n - 1].trim();
        return t && !/^[{}]+;?$/.test(t) && !/^\/\//.test(t) && !/^(public|private|protected)?\s*(static\s+)?class\b/.test(t) &&
          !/^}?\s*else\s*\{?$/.test(t) && !/^(private|public|protected)\s+(final\s+)?[\w<>\[\], ]+\s+\w+\s*(=.*)?;$/.test(t) && !/^(public|private|protected|static|\w)[\w<>\[\], ]*\(.*\)\s*\{$/.test(t) || /^(for|while|if)\b/.test(t);
      });
      // fallback 'return' (jaise return -1 / return null) jo examples me nahi chalta — agar koi aur return chala hai toh ignore
      const retHit = exec.some(n => hitLines.has(n) && /\breturn\b/.test(codeLines[n - 1]));
      const misses = exec.filter(n => !hitLines.has(n) && !(retHit && /^\s*return\b/.test(codeLines[n - 1]))), cov = exec.length ? Math.round(100 * (exec.length - misses.length) / exec.length) : 100;
      const minCov = strict ? MIN_COVERAGE_STRICT : MIN_COVERAGE;
      if (cov < minCov) flag(vtag, `debugger coverage ${cov}% (< ${minCov}%) — ye lines kabhi step nahi hui: ${misses.map(n => n + ':' + codeLines[n - 1].trim().slice(0, 30)).join(' | ')}`);
    });
  });

  // ---- days ----
  const days = c.days || [];
  if (days.length !== nDays) err(id, `days: ${nDays} chahiye (weeks ${w0}–${w1}), mile ${days.length}`);
  const learned = new Set();
  days.forEach((d, i) => {
    const tag = `${id} day ${d.day}`;
    if (d.day !== i + 1) err(tag, `day number sequence galat (expected ${i + 1})`);
    if (d.week !== Math.floor(i / 7) + 1) err(tag, `week galat (local week ${Math.floor(i / 7) + 1})`);
    if (d.dow !== DOW[i % 7]) err(tag, `dow ${d.dow} ≠ ${DOW[i % 7]}`);
    const sat = i % 7 === 5, sun = i % 7 === 6;
    const want = sat && d.type !== 'learn' ? 'revision' : sun ? 'mock' : null; // Sat pe learn bhi chalta hai (user ka design)
    if (want && d.type !== want) err(tag, `type ${d.type} — ${DOW[i % 7]} = ${want}`);
    if (!want && !['learn', 'revision'].includes(d.type)) err(tag, `weekday type learn/revision hona chahiye`);
    const qs = d.qs || [];
    if (sat && d.type !== 'learn' && (qs.length < 3 || qs.length > 6)) err(tag, `Saturday revision 3–6 questions (mile ${qs.length})`);
    if (sun && (qs.length < 2 || qs.length > 7)) err(tag, `Sunday mock 2–7 questions (mile ${qs.length})`);
    const concept = !qs.length && (c.lessons || {})[d.day] && c.lessons[d.day].main === null; // concept day: no LeetCode
    if ((!sat || d.type === 'learn') && !sun && !concept && (qs.length < 1 || qs.length > 2)) err(tag, `weekday 1–2 questions (mile ${qs.length})`);
    qs.forEach(n => {
      if (!COURSE.has(n)) err(tag, `LC ${n} course me nahi hai`);
      else if (COURSE.get(n).phase > p.phase) err(tag, `LC ${n} aage ke phase (${COURSE.get(n).phase}) ka hai`);
    });
    if (d.type === 'learn') qs.forEach(n => learned.add(n));
    if (d.extra && d.extra.length) err(tag, 'extra practice list nahi chahiye (sirf course ke Qs, daily max 2)');
    if (!d.title || !Array.isArray(d.theory) || !d.interview || !d.interview.q || !d.interview.a) err(tag, 'title/theory/interview{q,a} missing');
  });
  p.qs.forEach(([n]) => { if (!learned.has(n)) err(id, `LC ${n} kisi learn day me nahi aaya`); });

  // ---- lessons (Day 1 format) ----
  const LS = c.lessons || {};
  days.forEach(d => {
    const tag = `${id} lesson ${d.day}`, l = LS[d.day];
    if (!l) return err(tag, 'lesson missing');
    ['title', 'goal', 'memory'].forEach(k => { if (!l[k]) err(tag, `${k} missing`); });
    if (l.main !== null && l.main !== undefined && !COURSE.has(l.main)) err(tag, `main LC ${l.main} course me nahi`);
    const minParts = d.type === 'learn' ? 14 : 8;
    if (!Array.isArray(l.parts) || l.parts.length < minParts) err(tag, `parts: kam se kam ${minParts} (mile ${(l.parts || []).length})`);
    if (!Array.isArray(l.checks) || l.checks.length < 5) err(tag, 'checks (self-check): kam se kam 5');
    const blocks = (l.parts || []).flatMap(pt => pt.blocks || []);
    const has = k => blocks.some(b => b[k] !== undefined);
    const qaCount = blocks.filter(b => b.qa).reduce((s, b) => s + b.qa.length, 0);
    if (!(l.parts || [])[0] || !/Part 0/.test(l.parts[0].title)) err(tag, 'pehla part "Part 0 — …" (revision/warm-up) hona chahiye');
    if (d.type === 'learn' && strictDay(id, d)) {
      const tl = l.main || (d.qs && d.qs[0]);
      if (tl && !blocks.some(b => b.problem === tl)) err(tag, `try box ke liye main question LC ${tl} ka {problem} block chahiye`);
    }
    if (d.type === 'learn') {
      ['problem', 'code', 'table', 'lines', 'say', 'qa'].filter(k => k !== 'problem' || l.main !== null).forEach(k => { if (!has(k)) err(tag, `learn day me "${k}" block chahiye`); });
      if (!has('viz')) err(tag, 'learn day me {viz} block chahiye');
      if (qaCount < 13) err(tag, `qa: 8 interview + 5 self-test = 13+ chahiye (mile ${qaCount})`);
    } else {
      if (!has('qa') || qaCount < 5) err(tag, `qa: kam se kam 5 (mile ${qaCount})`);
      if (!has('say')) err(tag, '"say" (aise bolo) block chahiye');
    }
    ['Sohvi', 'Sohel'].forEach(w => { if (!(l.parts || []).some(pt => pt.title.includes(w))) err(tag, `"${w} session" part missing`); });
    blocks.filter(b => b.viz).forEach(b => { if (!V[b.viz]) err(tag, `viz LC ${b.viz} ka def nahi`); });
    // ---- ⌨️ Typing block: code question ke approach se; notes har line ke liye (drift na ho) ----
    blocks.filter(b => b.typing).forEach(b => {
      const t = b.typing, q = Object.values(C).map(c => c.questions && c.questions[t.q]).find(Boolean);
      if (!q) return err(tag, `typing: LC ${t.q} ka question nahi mila`);
      if (!(t.items || []).length) err(tag, 'typing: items khaali');
      (t.items || []).forEach((it, k) => {
        if (!it.label) err(tag, `typing item ${k + 1}: label missing`);
        if (it.lines) { if (!it.lines.length || it.lines.some(r => !Array.isArray(r) || !String(r[0] || '').trim())) err(tag, `typing "${it.label}": lines [[code, note], …] chahiye`); return; }
        const a = q.approaches[it.ap];
        if (!a) return err(tag, `typing "${it.label}": approach ${it.ap} nahi`);
        const n = a.code.split('\n').length;
        if ((it.notes || []).length !== n) err(tag, `typing "${it.label}": notes ${(it.notes || []).length} ≠ code lines ${n} (comment galat line pe dikhega)`);
      });
    });
    // ---- Daily Quiz: 5 MCQ, 4 options, valid ans, explanation (user ke content wale phases me zaroori) ----
    const quizRequired = strictDay(id, d);
    if (!l.quiz) { if (quizRequired) err(tag, 'quiz missing (5 MCQ + explanation chahiye)'); }
    else {
      if (!Array.isArray(l.quiz) || l.quiz.length !== 5) err(tag, `quiz: 5 sawaal chahiye (mile ${(l.quiz || []).length})`);
      (l.quiz || []).forEach((qq, qi) => {
        if (!qq.q || !Array.isArray(qq.opts) || qq.opts.length !== 4) err(tag, `quiz ${qi + 1}: q + 4 opts chahiye`);
        if (!(Number.isInteger(qq.ans) && qq.ans >= 0 && qq.ans < 4)) err(tag, `quiz ${qi + 1}: ans 0–3 hona chahiye`);
        if (!qq.why) err(tag, `quiz ${qi + 1}: why (explanation) missing`);
        if (qq.opts && new Set(qq.opts).size !== qq.opts.length) err(tag, `quiz ${qi + 1}: options duplicate`);
      });
    }
    blocks.filter(b => b.problem).forEach(b => { if (!COURSE.has(b.problem)) err(tag, `problem LC ${b.problem} course me nahi`); });
    const txt = textOf(l);
    (txt.match(/LC\s?(\d{1,4})/g) || []).map(s => Number(s.replace(/\D/g, ''))).forEach(n => { if (!COURSE.has(n)) err(tag, `text me LC ${n} — course me nahi`); });
  });
}

R.filter(p => !only || p.id === only).forEach(checkPhase);

// ---- Report patterns: same pattern ki alag spelling nahi honi chahiye ----
{
  const key = p => String(p || '').split(/\s+[(—–-]\s*|\s*\(/)[0].trim();
  const loose = k => k.toLowerCase().replace(/[^a-z0-9+]/g, '');
  const seen = {};
  R.forEach(p => { const c = C[p.id]; if (!c || !c.questions) return; Object.entries(c.questions).forEach(([n, q]) => { const k = key(q.pattern); if (!k) return; const L = loose(k); (seen[L] = seen[L] || new Map()).set(k, (seen[L].get(k) || []).concat(p.id + ' LC ' + n)); }); });
  Object.values(seen).forEach(m => { if (m.size > 1) { const msg = 'pattern ki alag spelling (report me alag ginenge): ' + [...m].map(([k, w]) => '"' + k + '" (' + w.slice(0, 3).join(', ') + ')').join(' vs '); const strictHit = [...m.values()].flat().some(w => { const [pid, , qn] = w.split(' '); return strictQ(pid, qn); }); strictHit ? err('patterns', msg) : warn('patterns', msg); } });
}

// ---- ⌨️ API warm-up (data/warmup-api.js → Fundamentals tab) ----
const WU = window.WARMUP || {};
Object.entries(WU).forEach(([pid, items]) => {
  const p = R.find(x => x.id === pid), c = C[pid], common = pid === '_common';
  if (!p && !common) return err('warmup', `"${pid}" roadmap me phase nahi`);
  items.forEach((it, i) => {
    const w = `warmup ${pid} #${i + 1} "${it.label}"`;
    if (!it.label || !Array.isArray(it.lines) || !it.lines.length) return err(w, 'label + lines chahiye');
    if (!['api', 'template'].includes(it.kind)) err(w, `kind 'api' ya 'template' chahiye`);
    if (!common && c && c.days && !c.days.some(d => Number(d.day) === Number(it.day))) err(w, `day ${it.day} is phase me nahi`);
    it.lines.forEach(([code, note], j) => {
      if (typeof code !== 'string' || !code.trim()) err(w, `line ${j + 1} khaali`);
      if (/\/\//.test(code)) err(w, `line ${j + 1}: code me // comment — note column me likho`);
      if (typeof note !== 'string') err(w, `line ${j + 1}: note string chahiye ('' chalega)`);
    });
    const code = it.lines.filter(l => !/^[\s{}]*$/.test(l[0]) && !/^\s*}\s*else/.test(l[0]));
    if (it.lines.filter(l => l[1]).length < code.length / 2) warn(w, 'aadhi se kam lines pe note');
  });
});
R.filter(p => C[p.id] && p.id !== 'revision').forEach(p => { if (!WU[p.id]) warn('warmup', `${p.id}: Fundamentals me API warm-up nahi`); });

// ---- Java compile ----
if (doJava) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dsa-java-'));
  const helpers = `import java.util.*;
class ListNode { int val; ListNode next; ListNode() {} ListNode(int val) { this.val = val; } ListNode(int val, ListNode next) { this.val = val; this.next = next; } }
class TreeNode { int val; TreeNode left, right; TreeNode() {} TreeNode(int val) { this.val = val; } TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; } }
`;
  let compiled = 0;
  R.filter(p => !only || p.id === only).forEach(p => {
    const c = C[p.id]; if (!c || !c.questions) return;
    Object.entries(c.questions).forEach(([n, q]) => (q.approaches || []).forEach((a, i) => {
      const dir = path.join(tmp, `Q${n}_${i}`); fs.mkdirSync(dir);
      const isClass = /^\s*(public\s+)?class\s+\w+/m.test(a.code);
      fs.writeFileSync(path.join(dir, 'Helpers.java'), helpers);
      fs.writeFileSync(path.join(dir, 'Sol.java'), 'import java.util.*;\n' + (isClass ? a.code.replace(/public\s+class/g, 'class') : `class Sol {\n${a.code}\n}\n`));
      const r = cp.spawnSync('javac', ['-d', dir, path.join(dir, 'Helpers.java'), path.join(dir, 'Sol.java')], { encoding: 'utf8' });
      if (r.status !== 0) err(`${p.id} LC ${n}`, `approach ${i} (${a.level}) javac fail:\n${(r.stderr || r.error || '').toString().split('\n').slice(0, 6).join('\n')}`);
      else compiled++;
    }));
  });
  console.log(`\njavac: ${compiled} approaches compiled`);
  // warm-up: body items → static method + run (exception nahi aani chahiye); members items → sirf compile
  let wuOk = 0;
  Object.entries(WU).filter(([pid]) => !only || pid === only).forEach(([pid, items]) => items.forEach((it, i) => {
    const dir = path.join(tmp, `W_${pid}_${i}`); fs.mkdirSync(dir);
    const body = it.lines.map(l => '    ' + l[0]).join('\n');
    const src = 'import java.util.*;\n' + (it.members
      ? `class W {\n${body}\n  public static void main(String[] a) {}\n}\n`
      : `class W {\n  public static void main(String[] args) {\n${body}\n  }\n}\n`);
    fs.writeFileSync(path.join(dir, 'Helpers.java'), helpers);
    fs.writeFileSync(path.join(dir, 'W.java'), src);
    const w = `warmup ${pid} "${it.label}"`;
    const r = cp.spawnSync('javac', ['-Xlint:none', '-d', dir, path.join(dir, 'Helpers.java'), path.join(dir, 'W.java')], { encoding: 'utf8' });
    if (r.status !== 0) return err(w, `javac fail:\n${(r.stderr || r.error || '').toString().split('\n').slice(0, 6).join('\n')}`);
    const run = cp.spawnSync('java', ['-cp', dir, 'W'], { encoding: 'utf8', timeout: 10000 });
    if (run.status !== 0) return err(w, `run fail:\n${(run.stderr || run.error || '').toString().split('\n').slice(0, 4).join('\n')}`);
    wuOk++;
  }));
  console.log(`warm-up: ${wuOk} items compiled + run`);
}

console.log(`\n${errors ? '✗' : '✓'} ${errors} errors, ${warns} warnings`);
process.exit(errors ? 1 : 0);
