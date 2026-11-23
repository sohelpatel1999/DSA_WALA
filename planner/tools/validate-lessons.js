// Planner lessons checker:  node planner/tools/validate-lessons.js [--java]
// DSA lesson: problem + Brute/(Better)/Optimal + har approach ka visualizer tab (line-by-line debugger, 100% line coverage,
//   VARIABLES khaali nahi, brace line pe step nahi, final ret == example output) + 8 interview Qs + tests.
// Theory lesson: planner ke har interview question ka answer + parts + checks.
// --java: har approach javac + tests chala ke output match.
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const { LESSON_DIR, plannerItems, loadLessons, manifestText } = require('./_load');

const doJava = process.argv.includes('--java');
let errors = 0, warnings = 0;
const err = (tag, msg) => { errors++; console.log(`✗ [${tag}] ${msg}`); };
const warn = (tag, msg) => { warnings++; console.log(`! [${tag}] ${msg}`); };
const norm = s => String(s).replace(/\s+/g, '');

const items = plannerItems();
const byId = Object.fromEntries(items.map(i => [i.id, i]));
const { lessons, fileOf, dupes } = loadLessons();
dupes.forEach(d => err('ids', 'duplicate lesson id: ' + d));

// manifest up to date?
const want = manifestText(items, fileOf);
const mpath = path.join(LESSON_DIR, 'manifest.js');
if (!fs.existsSync(mpath) || fs.readFileSync(mpath, 'utf8') !== want) err('manifest', 'lessons/manifest.js purana hai — `node planner/tools/build.js` chalao');

const allBlocks = L => (L.parts || []).flatMap(p => p.blocks || []);
const LEVEL = /^(Brute|Better|Optimal)$/;
const execLines = codeLines => codeLines.map((l, i) => i + 1).filter(n => {
  const t = codeLines[n - 1].trim();
  return t && !/^[{}]+;?$/.test(t) && !/^\/\//.test(t) && !/^(public|private|protected)?\s*(static\s+)?class\b/.test(t) &&
    !/^}?\s*else\s*\{?$/.test(t) && !/^(private|public|protected)\s+(final\s+)?[\w<>\[\], ]+\s+\w+\s*(=.*)?;$/.test(t) && !/^(public|private|protected|static|\w)[\w<>\[\], ]*\(.*\)\s*\{$/.test(t) || /^(for|while|if)\b/.test(t);
});

function parseInputs(def, raw) {
  const inp = {};
  def.inputs.forEach(x => {
    const v = raw[x.key] !== undefined ? raw[x.key] : x.def, t = x.type || (x.num ? 'num' : 'arr');
    inp[x.key] = t === 'num' ? Number(v) : t === 'str' ? String(v) : t === 'json' ? JSON.parse(v) : window.VIZ.util.parseArr(v);
  });
  return inp;
}

function checkViz(id, L) {
  const base = L.viz, lv = L.approaches;
  if (!base) return err(id, 'viz nahi hai — har DSA lesson me visualizer chahiye');
  if (!base.inputs || !base.run) return err(id, 'viz.inputs / viz.run missing');
  const all = [base].concat(base.variants || []);
  const apOf = d => (d.ap !== undefined ? d.ap : lv.length - 1);
  const covered = new Set(all.map(apOf));
  lv.forEach((a, i) => { if (!covered.has(i)) err(id, `visualizer tab missing: approach ${i} (${a.level})`); });
  const exs = (L.problem.examples || []).filter(e => e.viz);
  if (!exs.length) err(id, 'kisi example me viz input nahi');
  all.forEach(variant => {
    const d = Object.assign({}, base, variant), ap = apOf(variant), tag = `${id} viz ${lv[ap] ? lv[ap].level : '?'}`;
    if (!lv[ap]) return err(tag, `ap ${ap} approaches me nahi`);
    const codeLines = lv[ap].code.split('\n'), n = codeLines.length, hit = new Set();
    exs.forEach((e, ei) => {
      let inp, steps;
      try { inp = parseInputs(d, e.viz); } catch (ex) { return err(tag, `example ${ei + 1} input parse fail: ${ex.message}`); }
      if (d.check) { const m = d.check(inp); if (m) return err(tag, `example ${ei + 1} check fail: ${m}`); }
      try { steps = d.run(JSON.parse(JSON.stringify(inp))); } catch (ex) { return err(tag, `example ${ei + 1} run() threw: ${ex.message}`); }
      if (!steps || !steps.length) return err(tag, `example ${ei + 1}: 0 steps`);
      if (steps.length >= window.PLAN_KIT.MAX) warn(tag, `example ${ei + 1}: ${steps.length} steps (cap) — chhota example lo`);
      const bad = steps.filter(s => !(s.line >= 1 && s.line <= n));
      if (bad.length) err(tag, `example ${ei + 1}: ${bad.length} steps ka line 1..${n} ke bahar`);
      const last = steps[steps.length - 1], expect = e.ret !== undefined ? e.ret : e.output;
      if (last.ret === undefined) err(tag, `example ${ei + 1}: last step pe ret nahi`);
      else if (norm(last.ret) !== norm(expect)) err(tag, `example ${ei + 1}: viz ret "${last.ret}" ≠ expected "${expect}"`);
      steps.slice(0, -1).forEach((s, si) => { if (s.ret !== undefined) err(tag, `example ${ei + 1}: step ${si} pe ret hai par wo last step nahi`); });
      steps.forEach((s, si) => (s.views || []).forEach(vw => { try { window.VIZ.util.viewHtml(vw); } catch (ex) { err(tag, `step ${si} view render fail: ${ex.message}`); } }));
      if (steps.some(s => !s.views)) err(tag, `example ${ei + 1}: kuch steps me views nahi`);
      steps.forEach(s => hit.add(s.line));
      const junk = steps.filter(s => s.line >= 1 && s.line <= n && /^(\s*|\s*[{}]+;?\s*|\s*\/\/.*|\s*}?\s*else\s*\{?\s*)$/.test(codeLines[s.line - 1]));
      if (junk.length) err(tag, `example ${ei + 1}: ${junk.length} steps khaali / brace / else / comment line pe`);
      const noVars = steps.filter(s => !(s.vars && Object.keys(s.vars).length) && !(s.frames && s.frames.length && s.frames[0].vars && Object.keys(s.frames[0].vars).length));
      if (noVars.length) err(tag, `example ${ei + 1}: ${noVars.length}/${steps.length} steps me VARIABLES khaali`);
      const noNote = steps.filter(s => !s.note);
      if (noNote.length) err(tag, `example ${ei + 1}: ${noNote.length} steps me note nahi`);
    });
    const exec = execLines(codeLines);
    const retHit = exec.some(k => hit.has(k) && /\breturn\b/.test(codeLines[k - 1]));
    const miss = exec.filter(k => !hit.has(k) && !(retHit && /^\s*return\b/.test(codeLines[k - 1])));
    if (miss.length) err(tag, `debugger coverage ${Math.round(100 * (exec.length - miss.length) / exec.length)}% (100% chahiye) — ye lines kabhi step nahi hui: ${miss.map(k => k + ':' + codeLines[k - 1].trim().slice(0, 32)).join(' | ')}`);
  });
}

function checkDsa(id, L, item) {
  const pr = L.problem;
  if (!pr || !pr.statement || !(pr.examples || []).length) err(id, 'problem.statement / examples missing');
  else {
    pr.examples.forEach((e, i) => { if (!e.input || e.output === undefined) err(id, `example ${i + 1}: input / output missing`); });
    if (!Array.isArray(pr.constraints)) err(id, 'problem.constraints array chahiye');
  }
  const lv = L.approaches || [];
  if (lv.length < 2) err(id, 'kam se kam Brute + Optimal chahiye');
  lv.forEach((a, i) => {
    if (!LEVEL.test(a.level)) err(id, `approach ${i}: level "${a.level}" — Brute / Better / Optimal hi`);
    ['idea', 'time', 'space', 'code'].forEach(k => { if (!a[k]) err(id, `approach ${i} (${a.level}): ${k} missing`); });
  });
  const levels = lv.map(a => a.level);
  if (!levels.includes('Brute') || !levels.includes('Optimal')) err(id, 'Brute aur Optimal dono chahiye');
  if (new Set(levels).size !== levels.length) err(id, 'ek level do baar');
  const codes = lv.map(a => norm(a.code));
  if (new Set(codes).size !== codes.length) err(id, 'do approaches ka code same hai (fake Better?)');
  const B = allBlocks(L);
  if (!B.some(b => b.problem)) err(id, 'parts me { problem } block nahi');
  if (!B.some(b => b.compare)) err(id, 'parts me { compare } block nahi');
  if (!B.some(b => b.viz !== undefined)) err(id, 'parts me { viz } block nahi');
  const qa = B.filter(b => b.qa).map(b => b.qa.length);
  if (!qa.some(n => n >= 8)) err(id, 'interview part me 8 questions (qa) chahiye');
  if (!B.some(b => b.say)) err(id, '"aise bolo" (say) block nahi');
  if (!(L.tests || []).length) err(id, 'tests nahi (Java check ke liye)');
  if (item && item.diff && L.diff !== item.diff) warn(id, `diff "${L.diff}" ≠ planner "${item.diff}"`);
  checkViz(id, L);
}

function checkTheory(id, L, item) {
  const B = allBlocks(L);
  const qa = B.filter(b => b.qa).reduce((a, b) => a + b.qa.length, 0);
  const need = (item && item.qs ? item.qs.length : 0);
  if (qa < need) err(id, `planner ke ${need} interview questions hain, lesson me sirf ${qa} answers (qa)`);
  const codeN = B.filter(b => b.code).length;
  if (codeN && (L.snippets || []).length < codeN) err(id, `${codeN} code blocks par sirf ${(L.snippets || []).length} snippets — har code example ka output check chahiye`);
}

Object.entries(lessons).forEach(([id, L]) => {
  const item = byId[id];
  if (!item) return err(id, 'ye id planner me nahi hai');
  ['title', 'goal', 'memory'].forEach(k => { if (!L[k]) err(id, k + ' missing'); });
  if (!(L.parts || []).length) err(id, 'parts khaali');
  (L.parts || []).forEach((p, i) => { if (!p.title || !(p.blocks || []).length) err(id, `part ${i}: title / blocks missing`); });
  if ((L.checks || []).length < 3) err(id, 'self-check (checks) kam se kam 3');
  if (item.track === 'dsa') { if (L.kind !== 'dsa') err(id, 'kind "dsa" chahiye'); checkDsa(id, L, item); }
  else { if (L.kind !== 'th') err(id, 'kind "th" chahiye'); checkTheory(id, L, item); }
});

// ---- Java: compile + tests ----
if (doJava) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'plan-java-'));
  let ran = 0;
  Object.entries(lessons).forEach(([id, L]) => {
    if (L.kind !== 'dsa') return;
    (L.approaches || []).forEach((a, i) => {
      const tag = `${id} java ${a.level}`, dir = path.join(tmp, `${id}_${i}`);
      fs.mkdirSync(dir);
      const isClass = /^\s*(public\s+)?class\s+\w+/m.test(a.code);
      fs.writeFileSync(path.join(dir, 'Sol.java'), 'import java.util.*;\n' + (isClass ? a.code.replace(/public\s+class/g, 'class') : `class Sol {\n${a.code}\n}\n`));
      const tests = L.tests || [];
      fs.writeFileSync(path.join(dir, 'Main.java'), 'import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n' +
        tests.map(t => `    { Sol o = new Sol(); ${t.run} System.out.print("\\n@@\\n"); }`).join('\n') + '\n  }\n}\n');
      const c = cp.spawnSync('javac', ['-d', dir, path.join(__dirname, 'Helpers.java'), path.join(dir, 'Sol.java'), path.join(dir, 'Main.java')], { encoding: 'utf8' });
      if (c.status !== 0) return err(tag, 'javac fail:\n' + (c.stderr || c.error || '').toString().split('\n').slice(0, 6).join('\n'));
      const r = cp.spawnSync('java', ['-cp', dir, 'Main'], { encoding: 'utf8', timeout: 20000 });
      if (r.status !== 0) return err(tag, 'run fail:\n' + (r.stderr || r.error || '').toString().split('\n').slice(0, 6).join('\n'));
      const outs = r.stdout.split('\n@@\n');
      tests.forEach((t, k) => { if ((outs[k] || '').trim() !== t.out) err(tag, `test ${k + 1}: got "${(outs[k] || '').trim()}" ≠ "${t.out}"`); });
      ran++;
    });
  });
  // theory: snippets (poori Main class) compile + run, output match
  let sn = 0;
  const NL = String.fromCharCode(10);
  Object.entries(lessons).forEach(([id, L]) => (L.snippets || []).forEach((s, k) => {
    const tag = id + ' snippet ' + (k + 1), dir = path.join(tmp, id + '_s' + k);
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'Main.java'), 'import java.util.*;' + NL + s.code);
    const short = x => (x || '').toString().split(NL).slice(0, 6).join(NL);
    const c = cp.spawnSync('javac', ['-d', dir, path.join(dir, 'Main.java')], { encoding: 'utf8' });
    if (c.status !== 0) return err(tag, 'javac fail:' + NL + short(c.stderr || c.error));
    const r = cp.spawnSync('java', ['-cp', dir, 'Main'], { encoding: 'utf8', timeout: 20000 });
    if (r.status !== 0) return err(tag, 'run fail:' + NL + short(r.stderr));
    const got = r.stdout.split('\r').join('').trim();
    if (got !== s.out.trim()) err(tag, 'output "' + got.split(NL).join(' | ') + '" ≠ "' + s.out.split(NL).join(' | ') + '"');
    sn++;
  }));
  console.log('java: ' + ran + ' approaches compiled + tested · ' + sn + ' theory snippets run');
}

const nD = Object.values(lessons).filter(L => L.kind === 'dsa').length, nT = Object.keys(lessons).length - nD;
console.log(`\n${Object.keys(lessons).length} lessons (${nD} DSA, ${nT} theory) · ${errors} errors · ${warnings} warnings`);
process.exit(errors ? 1 : 0);
