# Switch Prep Planner — lesson spec

Lessons for the planner's items live in `planner/lessons/*.js`. Each file is an IIFE that sets `window.PLAN_LESSONS[<itemId>] = {...}`. Item ids, titles, topics, difficulty and the theory interview questions come from the planner itself (`switch-prep-planner.html`, arrays `DSA` and `TH`). Read the finished examples before writing anything:

- DSA template: `lessons/dsa-arrays-two-pointers.js` (a1–a4). Recursion with call stack (`K.callStack()` frames): see `lessons/dsa-greedy.js` (g1 Better = divide & conquer) and `lesson-kit.js` → `callStack()`. A plain helper method without frames: `lessons/dsa-sliding-window.js` (a6 Better).
- Theory template: `lessons/th-java.js` (c1) and `lessons/th-java-core.js` (c2–c4).
- Helpers: `lesson-kit.js` (tracer, views, callStack). Rendering: `lesson-render.js` (block types).

The learner: an SDE-2 switch candidate (Java). Explanations in **Hinglish** (Roman-script Hindi + English, casual). Interview answers (`qa` answers in the Interview part and `say` blocks) in clear **English**, 30–60 s spoken.

## DSA lesson (`kind: 'dsa'`)

Fields: `kind, title, topic, diff, lc?, url, pattern, oneLine, goal, problem {statement, examples[{input, output, explain, viz:{...}, ret?}], constraints}, approaches[{level, idea, time, space, code}], viz, parts, checks (4), memory, tests`.

- `title`, `topic`, `diff` must match the planner item exactly.
- **Approaches** in order Brute → Better → Optimal. **Better only if genuinely different** (different idea or complexity); never invent one. If there is no Better, keep Brute + Optimal and say so in the Thinking part (the UI adds a "no Better" note).
- Real problem statement, examples and constraints (LeetCode/GfG). Add an "Apna example" when needed so every code line executes in the visualizer. Keep examples small (600-step cap per run).
- Code: the problem's real signature as a single method (helpers allowed), no class wrapper, readable names.
- **Parts** (same titles/order as a1): 🧩 Concept · 📄 Problem (`{problem:1}`) · 🤔 Thinking — Brute → Better → Optimal · ⚖️ code (`{compare:1}`) · 🔍 Dry run (table) · 💻 Java code — har line ka purpose (`code` + `lines`) · ▶ Visualizer (`{viz: exampleIndex}` + tip) · 🧪 Edge cases + ❌ Common mistakes · ⏱ Complexity (table) · 🎤 Interview — 8 short questions (`qa` × 8 + `say`) · ✍️ Self-test (`qa` with answers).
- Connect to earlier lessons where natural ("kal ka X", "Day N ka Y").
- `tests`: Java statements run against every approach: `{ run: '... System.out.print(...);', out: 'expected' }` (variable `o` is `new Sol()`; `java.util.*` imported). Normalise order-insensitive answers (sort) so all approaches print the same thing. To check printed output of a `void` method, capture it: `java.io.ByteArrayOutputStream b = new java.io.ByteArrayOutputStream(); java.io.PrintStream old = System.out; System.setOut(new java.io.PrintStream(b)); o.printNos(5); System.setOut(old); System.out.print(b.toString().trim());`.

### Visualizer (line-by-line debugger)
- `viz` (base) traces the **Optimal** approach (last in `approaches`); `variants: [{ap, label, run}]` add one tab per other approach. Every approach needs a tab.
- Every executed line is a step: method entry (signature line), each loop check including the final failing one, each statement, each return. `K.tracer(code, render)` → `st(snippet, note, o)`; snippets must match the intended line uniquely (`['text', k]` = k-th occurrence).
- 100% of executable lines hit across examples (brace-only / `else {` lines excluded; they must never get a step).
- Every step: non-empty `vars` (include parameters) — or `frames` from `K.callStack()` for recursion, whose top frame carries the vars — and a short Hinglish `note` with actual values.
- Only the last step has `ret`; it must equal the example `output` (or `ret` override) ignoring whitespace. `void` print problems: `ret` = the printed text.
- Views: `K.A` (array), `K.M` (map), `K.S` (set), `K.X` (text), `K.LL(label, nodes[{id,val,next}], hl{id:cls}, ptr[{id,label}])` (linked list — keep stable node ids, show pointers like head/prev/curr/slow/fast), `K.ST(label, items, hl)` (stack, last = top), `K.Q(label, items, hl)` (queue). `K.llStr(nodes, headId)` → `1 -> 2 -> null`. Highlight classes: `cur win done found new skip`.
- Linked-list problems: code uses LeetCode's `ListNode` (`val`, `next`). Java tests can use helpers from `tools/Helpers.java`: `LL.of(1,2,3)`, `LL.str(head)` → `"1 -> 2 -> 3 -> null"`, `LL.cycle(new int[]{3,2,0,-4}, 1)`, `LL.node(head, i)`. Visualizer `ret` for a returned list: use the same `1 -> 2 -> null` text and put it in the example's `ret` override (the LeetCode `output` stays `[1,2]`).
- Recursion: keep a `K.callStack()`; `push(method, argsText, () => locals)` on entry, `pop()` on return, and return `frames: cs.frames()` from `render`. The engine then shows the CALL STACK panel and the 🌳 call tree.

## Theory lesson (`kind: 'th'`)

Fields: `kind, title, topic, goal, oneLine, parts, checks (4), memory, snippets`.
- Concept parts (one per sub-topic): Hinglish explanation, comparison `table` where useful, a `code` block, and a `pre` block with the exact output.
- '🎤 Interview — planner ke N questions (English answers)': start with a `tip` that generic project examples should be replaced with the learner's real project; then a `qa` with **every planner question, text copied exactly, in order**; then a `say` (45 s).
- '❌ Common traps' (list) and '✍️ Self-test — output predict karo' (qa, 4–5 items).
- Every `code` block is a complete program with `public class Main { public static void main(String[] args) {...} }` (helper classes above, non-public). `import java.util.*;` is prepended; add other imports yourself. Output must be deterministic (no HashMap order, timing, identity hashes, thread interleaving — use `join()`, counts, sorted/Tree/Linked collections). Add one `snippets` entry `{ code, out }` per code block.
- No company names or personal details.

## Checks (must pass)
From `dsa-visual/`: `node planner/tools/build.js` → `node planner/tools/validate-lessons.js --java` (0 errors for your ids) → `node --check` your files. Then `node planner/tools/test-schedule.js` (lesson coverage for upcoming days).
Git Bash collapses `\\` inside shell strings — write files with the Write tool, not heredocs. Inside JS template literals holding Java, a Java `"\n"` must be written `\\n`.
