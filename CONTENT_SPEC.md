# DSA Visual — Content Spec (har phase isi pattern me)

Ye app Sohel (SDE-2 switch, 3+ yrs) aur Sohvi (MCA, beginner) ke liye hai. Language: **Java**.
Explanations **Hinglish (Roman script)**, interview answers ("aise bolo", 1-minute, `interview` fields) **English** me.
Source of truth: `../DSA_COURSE.md` + `roadmap.js` (phases, weeks, LeetCode list).
**Reference implementation (copy this style exactly):** `data/phase-01-arrays.js`, `data/phase-01-problems.js`,
`data/phase-01-days.js` (Day 1 lesson = user-approved template), `visualizers.js` (Phase 1 viz defs + engine).

## Hard rules
1. **Sirf course ke questions.** Sirf `roadmap.js` me jo LeetCode numbers hain. Koi bonus/extra problem nahi —
   text me bhi "LC <n>" sirf course wale. (User ne extra questions pe naraazgi jatayi thi.)
2. **Daily plan:** Mon–Fri: 1 topic/din, dono same questions — `qs[0]` = MUST, `qs[1]` (optional) = PUSH → 1–2 Qs.
   Sat = `revision` (3–4 re-solve Qs, current + pichle phases). Sun = `mock` (2 Qs: Tum interviews Sohvi on qs[0],
   Sohvi interviews Tum on qs[1]) + LeetCode Weekly Contest (Sunday 8:00 AM IST) discussion.
   Phase ke saare questions kam se kam ek `learn` day me aane chahiye. Agar din zyada aur questions kam:
   concept day, same question ka doosra approach (iterative vs recursive, brute vs optimal), ya catch-up/re-solve —
   **naya problem kabhi nahi**. Mock/revision me aage ke phase ka question nahi.
3. Java code: exact LeetCode signature. Method-only code (jaise Phase 1) ya design problems ke liye poori class
   (`class MinStack { ... }`). `ListNode`/`TreeNode` LeetCode wale (khud define mat karo). Standard `java.util` only.
   Code strings me **backtick ya `${` nahi** (JS template literal me rehte hain). 4-space indent.
4. Har cheez test: `node tools/validate.js <phase-id> --java` → **0 errors**. Saath me har approach ko apne scratch dir
   me LeetCode examples + edge cases pe `javac`/`java` se chalao (validator sirf compile check karta hai).
5. **Sirf apni phase ki files** banao/edit karo (neeche list). `app.js`, `visualizers.js`, `styles.css`,
   `index.html`, `roadmap.js`, doosre phases ko mat chhuo. Engine me koi view kam pade toh report me likho.
6. **Har question: Brute → Better → Optimal (user ka rule, 2026-11-08).** User jo bhi naya content/week dega,
   uske har question me teeno level hone chahiye — `approaches` me (Java code test karke), lesson ke comparison
   part me (app.js apne aap banata hai), aur **visualizer me har approach ka alag tab** (`viz/phase-XXx.js`,
   pattern `viz/phase-01x.js`: `add(n, [...])`, final `ret` base viz se). Tab order apne aap Brute → Better → Optimal.
   **Better optional hai:** jis problem me asli Better approach nahi hota, wahan zabardasti mat banao —
   sirf Brute + Optimal rakho (app "Better: alag approach nahi" note khud dikhata hai).
7. **Har din ka Daily Quiz (game, 2026-11-08).** Har day lesson me `quiz` = **5 MCQ**: `{ q, opts: [4], ans: 0–3, why }`
   — us din ke topic pe (concept, dry-run output, complexity, edge case, "galti kahan hai"), Hinglish, `why` = sahi/galat
   ke baad dikhne wali 1–2 line explanation. File: `data/phase-XX-lessons-zquiz.js` (lessons ke baad load hoti hai;
   pattern `data/phase-01-lessons-zquiz.js`). App options khud shuffle karta hai. Sunday ka Boss Battle isi week ke
   quiz pool se banta hai. Validator `QUIZ_REQUIRED` me naya phase id jodo.
8. **Debugger asli debugger jaisa chale (2026-11-08).** Har visualizer tab (Brute / Better / Optimal) line-by-line:
   method entry → har statement → har loop/if check → return; har step pe VARIABLES me saare locals (arrays, maps,
   pointers, counters). Snippet se line dhoondhte waqt dhyaan: same text pehle kisi `for (...)` me ho toh
   `ln('…', 2)` ya `;` wala unique snippet lo. **Validator (`tools/validate.js`) ye sab check karta hai** —
   `STRICT` list (user ke content wale phases) me ERROR, baaki me WARNING:
   - har question me Brute + Optimal (Better optional), aur **har approach ka visualizer tab**;
   - debugger coverage ≥ `MIN_COVERAGE` (80%) executable lines (signature / braces / comments / fields / kabhi na chalne
     wala fallback `return` nahi gine jaate);
   - koi step khaali / brace / comment line pe nahi (void method ka aakhri `}` allowed);
   - views wale steps me VARIABLES khaali nahi.
   Naya phase user ke content se bane → uska id `STRICT` me jodo. Pattern: `viz/phase-01x.js` (`tracer()` helper).
   STRICT phases me coverage **100%** chahiye (har asli line, har `if` check — chahe condition false ho — ek step).
9. **Revision + Try mode + Report (2026-11-08)** — `learn.js`. Naya content inke liye:
   - Har question ka `pattern` = **Hint 1** aur report ka group; same pattern hamesha **same spelling** (jaise "Prefix Sum",
     "Kadane's Algorithm") — validator alag spelling pakadta hai.
   - Har question ka `oneLine` = **Hint 2** (≥ 20 chars, idea — sirf naam nahi).
   - Har learn day me main question ka `{ problem: n }` block. (Try mode abhi BAND hai — `app.js` `TRY_ENABLED = false`, user ko pasand nahi aaya; box + lock code rakha hai.)
   - (Try mode on ho toh:) "🧠 Pehle khud try karo" box problem ke baad lagta hai, aur
     neeche ke solution parts (code / lines / viz / Thinking / Dry run / ⚖️) apne aap lock hote hain.
   - Quiz sawaal us din ke main question ke pattern me gine jaate hain (report).
10. **Testing — har naye week ke baad teeno chalao, sab green chahiye:**
   - `node tools/validate.js --java` → 0 errors (STRICT phases)
   - `node tools/test-game.js` → revision schedule, try XP, report formula, game XP (54+ tests)
   - `node tools/test-validator.js` → validator har galti pakadta hai (mutation tests)

## Files per phase  (XX = 2-digit phase number, ID = roadmap id)
| File | Kya |
|---|---|
| `data/phase-XX-ID.js` | `window.PHASE_CONTENT['ID'] = { intro, fundamentals, operations, patterns, questions, days, lastMinute }` (problems isi file me `questions[n].problem`) |
| `data/phase-XX-lessons-w1.js`, `-w2.js`, `-w3.js` | Har phase-week ke 7 lessons. Pattern: `(function(){ const P = window.PHASE_CONTENT['ID']; P.lessons = P.lessons || {}; Object.assign(P.lessons, { 1: {...}, 2: {...} }); })();` |
| `viz/phase-XX.js` | Har phase question ka visualizer: `VIZ.defs[n] = {...}` |

Lesson keys = **phase ke andar local day** (1..7×weeks). App global day khud nikaalta hai (Week from roadmap).

## Phase content schema (copy `phase-01-arrays.js`)
- `intro`: 1–2 line string.
- `fundamentals`: `[{ h, body (HTML), code? }]` ≥3 — data structure kya hai, memory/structure diagram (`<pre>` ASCII ok), Java API cheat sheet (e.g. `Deque<Integer> st = new ArrayDeque<>()`), yaad rakhne wali baatein.
- `operations`: `[{ op, time, note, code }]` ≥4 (Java snippets).
- `patterns`: `[{ name, signal, idea, code, qs:[course LC] }]` ≥2.
- `questions[n]`: `{ oneLine, pattern, approaches:[{level:'Brute'|'Better'|'Optimal'| e.g. 'Recursive', idea, time, space, code}], dryRun, interview, problem }`
  - `problem`: `{ statement (HTML, apne shabdon me — LeetCode text copy nahi), examples:[{input, output, explain, viz:{<inputKey>: '<string>'}, ret?}] ≥2, constraints:[…] }`
  - `examples[].viz` = visualizer input fields ke string values. `ret` = agar viz ka final `ret` output string se alag format me ho (e.g. LC 26).
- `days`: 7 × weeks objects: `{ day, week (local), dow: 'Mon'..'Sun', type: 'learn'|'revision'|'mock', title, theory:[chips], qs:[…], interview:{q, a (English 1-min)} }`. `extra` field mat dena.
- `lastMinute`: `{ triggers:[[signal, pattern]], edge:[…], mistakes:[…] }`.

## Lesson schema (copy `data/phase-01-days.js` Day 1 EXACTLY in style & depth)
`{ title, goal (HTML), main: <LC n | null>, parts:[{ title, blocks:[…] }], checks:[≥6 self-check lines], memory: '<one line>' }`

Block types: `{p}` `{h}` `{list}` `{olist}` `{code}` `{pre}` (ASCII diagram, dry-run states) `{table:{head, rows}}` (cells HTML)
`{problem: n}` `{viz: n, ex: 0, variant: 0}` `{lines: [[code, purpose]]}` `{qa: [[q, a]]}` (answer hidden till click)
`{say: [[title, englishAnswer]]}` `{tip}`.

### Learn day — parts (in this order, titles "Part N — …")
0. **Part 0 — Cumulative Revision**: 2–3 pichle course questions (Day 1 of whole course me warm-up). Har ek:
   problem 1 line, example (`pre`), pattern, thinking steps (`olist`), short code (`code`), **Memory hook** (`tip`). (User ke Day 31 sample jaisa.)
1. **Part 1 — Concept / Pichle din ka revision** (data structure/pattern ka concept, tables, `pre` diagrams)
2. **Part 2 — Aaj ka problem: LC n …** → `{problem: n}`
3. **Part 3 — Thinking: Brute → Better → Optimal** (kyun kaam karta hai)
4. **Part 4 — Dry run** — step-by-step `table`(s) / `pre` states (values code chala ke verify karo)
5. **Part 5 — Complete Java code + har line ka purpose** → `code` blocks + `lines`
6. **Part 6 — Visualize** → list "kya dekhna hai" + `{viz: n, ex: 0}` (MUST aur PUSH dono ke liye alag `{viz}` blocks allowed — page pe sab chalte hain)
7. **Part 7 — Edge cases** (`table`)
8. **Part 8 — Complexity** (`table` + note)
9. **Part 9 — Interview Deep Dive: 8 chhote sawaal** → `qa` (exactly 8)
10. **Part 10 — Bade interview answers: aise bolo** → `say` (≥3: approach explain, follow-ups, 1-minute answer)
11. **Part 11 — Sohvi session** (beginner tasks: drawing, brute, dry run, concept; code memorize zaroori nahi)
12. **Part 12 — Sohel session (SDE-2 practice)** (Task A/B/C… memory se code, follow-ups, timer).
    Weeks 1–12 me har din add karo: "Extra (SDE-2): 2 SQL questions". Saturday ko: "System Design session (1/week)".
13. **Part 13 — Homework**
14. **Part 14 — Final self-test (bina notes)** → `qa` (5)
`checks` = completion criteria (self-check), `memory` = aaj ki memory line.

### Revision day (Sat) — parts ≥8
Part 0 — Aaj ka revision plan (timer, rules) · Part 1..k — har revision question: problem recap, pattern, example `pre`,
key code, memory hook, `{viz}` agar hai · Interview mix `qa` (≥5) · `say` (1-minute answers) · Sohvi session · Sohel session
(+ System Design session) · Homework · Final self-test `qa`.

### Mock day (Sun) — parts ≥8
Part 0 — Mock format (30 + 30 + 30 min) · Part 1 — Mock Q1 (Tum → Sohvi): problem, kya poochna hai, hints ladder,
rubric table (Clarify / Brute / Optimal / Code / Test / Communication) · Part 2 — Mock Q2 (Sohvi → Tum) same ·
Part 3 — Interview communication checklist · Part 4 — LeetCode Weekly Contest plan + discussion template ·
`qa` (≥5) · `say` · Sohvi session · Sohel session · Homework · self-test.

## Visualizer (`viz/phase-XX.js`)
```js
(function () {
  const { recorder, range, esc } = VIZ.util;
  VIZ.defs[206] = {
    title: 'Reverse Linked List (Iterative)', label: 'Iterative',
    ap: 1,                                   // questions[206].approaches index jiska code dikhega
    inputs: [{ key: 'head', label: 'head (list values)', def: '1, 2, 3, 4' }],   // type: arr (default) | num | str | json
    run({ head }) { /* return steps */ },
    variants: [{ label: 'Recursive', title: 'Reverse Linked List (Recursive)', ap: 2, run({ head }) { … } }],
  };
})();
```
**Step** = `{ line, note, views:[…], vars:{name: 'value string'}, frames?:[…], ret? }`
- `line`: us approach ke code ki 1-based line jo abhi chal rahi hai (validator check karta hai). Har important line pe step.
- `note`: Hinglish, kya hua.
- `vars`: VS Code debugger jaisa — exact Java variable names → value strings: `"2"`, `"ListNode(val=3)"`, `"null"`,
  `"int[4] [1, 2, 3, 4]"`, `"HashMap size=2 {a=1, b=2}"`, `"ArrayDeque [1, 3]"`, `"true"`.
- `frames` (recursion ke liye, top first): `[{ method: 'reverseList', args: 'head=2', line: 7, vars:{…} }, …]` —
  CALL STACK me saare frames dikhte hain, VARIABLES me top frame ke vars. Recursion wale questions me zaroor use karo.
- `ret`: last step pe return value (string). Example `output` (ya `ret`) se match hona chahiye — validator check karta hai.
- `views` types:
  - `{type:'array', label, vals:[…], hl:{i: cls}, ptr:[{i, label}]}`
  - `{type:'list', label, nodes:[{id, val, next:id|null}], hl:{id: cls}, ptr:[{id, label}], free:[{label, val}]}` (nodes screen order me; arrow → / ← / ⇄ khud banta hai)
  - `{type:'stack', label, items:[bottom…top], hl:{i: cls}}` · `{type:'queue', label, items:[front…back], hl}`
  - `{type:'grid', label, cells:[[…]], hl:{"r,c": cls}}` · `{type:'table', label, rows:[[…]], rowLabels, colLabels, hl:{"r,c": cls}}` (DP)
  - `{type:'tree', label, nodes:[LeetCode level-order with null], hl:{index: cls, 'e<index>': cls}, ptr:[{id:index, label}]}`
  - `{type:'graph', label, nodes:[{id, label}], edges:[[a,b]], directed, hl:{id: cls}, ehl:{"a-b": cls}}`
  - `{type:'map', label, entries:{k: v}, hl: key}` · `{type:'set', label, items:[…], hl: item}` · `{type:'text', label, value}`
  - `cls`: `cur` (abhi), `win` (window/range/visited), `found` (answer), `done`, `new` (abhi likha), `skip`.
- Inputs: linked list → number list `'1, 2, 3'`; tree/grid/2D → `type:'json'` (`'[3,9,20,null,null,15,7]'`, `'[["1","0"],["0","1"]]'`);
  string → `type:'str'`; integer → `type:'num'`.
- Har phase question ka def **zaroori**; har example (`problem.examples[].viz`) pe chalna chahiye.
- `recorder(base)` helper: `const { steps, s } = recorder(() => ({ views: … }))` → `s(line, note, extra)`. Ya khud array me push karo. Max ~600 steps.

## Self-check before reporting
```
node --check data/phase-XX-*.js viz/phase-XX.js
node tools/validate.js ID --java      # must print "✓ 0 errors"
```
