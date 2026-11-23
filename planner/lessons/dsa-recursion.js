// Planner lessons — Recursion (Day 6): r1 Print 1..N, r2 Print N..1, r3 Factorial, r4 Length of String, r5 Palindrome Number, r6 Fibonacci
// Format: dsa-arrays-two-pointers.js jaisa. Recursive tabs K.callStack() use karte hain → CALL STACK panel + 🌳 call tree.
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  // Recursion tracer: har step pe frames (top-first) + top frame ke vars.
  // call(snip) = caller frame ki line yaad rakho (CALL STACK me "Solution.java : line" dikhe).
  const recT = (code, views) => {
    const cs = K.callStack(), find = K.finder(code);
    const t = K.tracer(code, o => {
      const fr = cs.frames();
      return { views: views(o), vars: fr.length ? fr[0].vars : { stack: 'khaali' }, frames: fr };
    });
    return { cs, st: t.st, steps: t.steps, call: snip => { if (cs.top()) cs.top().line = find(snip); } };
  };
  const consoleView = out => K.X('Console (System.out)', out.trim() ? out : '(abhi kuch print nahi hua)');
  const CAP = n => `java.io.ByteArrayOutputStream b = new java.io.ByteArrayOutputStream(); java.io.PrintStream old = System.out; System.setOut(new java.io.PrintStream(b)); o.printNos(${n}); System.setOut(old); System.out.print(b.toString().trim());`;
  const nInput = def => [{ key: 'n', label: 'n', def, num: true }];
  const nCheck = (lo, hi) => ({ n }) => (Number.isInteger(n) && n >= lo && n <= hi ? '' : `n ${lo}..${hi} ke beech rakho (visualizer chhota rakhna hai).`);

  // =====================================================================
  // r1 — Print 1 to N using recursion
  // =====================================================================
  const R1 = [
    `public void printNos(int n) {
    for (int i = 1; i <= n; i++) {
        System.out.print(i + " ");
    }
}`,
    `public void printNos(int n) {
    if (n == 0) return;          // base case
    printNos(n - 1);             // chhota kaam: 1..n-1
    System.out.print(n + " ");   // apna kaam: n
}`,
  ];

  L.r1 = {
    kind: 'dsa', title: 'Print 1 to N using recursion', topic: 'Recursion', diff: 'T',
    url: null,
    pattern: 'Recursion basics (head recursion — kaam call ke BAAD)',
    oneLine: 'printNos(n) = printNos(n−1) + print n. Base: n == 0 → kuch mat karo.',
    goal: 'Bina loop ke 1 se N tak print karo. Asli seekh: <b>recursion ki 3 cheezein</b> — base case, chhota subproblem, aur "call pe trust karo" — plus <b>call stack</b> me frames kaise bante aur hat-te hain.',
    problem: {
      statement: 'Given a positive integer <code>n</code>, print the numbers from <code>1</code> to <code>n</code> in increasing order, separated by a single space, <b>using recursion</b> (no loops). Implement <code>public void printNos(int n)</code>.',
      examples: [
        { input: 'n = 5', output: '1 2 3 4 5', explain: 'Numbers 1 to 5 increasing order me, space se alag.', viz: { n: '5' } },
        { input: 'n = 3', output: '1 2 3', explain: 'Chhota example — call stack me 4 frames (3, 2, 1, 0) banenge.', viz: { n: '3' } },
        { input: 'n = 1', output: '1', explain: 'Sirf ek number. printNos(1) → printNos(0) (base) → print 1.', viz: { n: '1' } },
      ],
      constraints: ['1 <= n <= 1000', 'Use recursion; no for / while loops.', 'Output: numbers separated by single spaces (trailing space allowed).'],
    },
    approaches: [
      { level: 'Brute', idea: 'Seedha <code>for</code> loop 1 se n. <b>Problem recursion maangti hai, ye sirf comparison baseline hai</b> — taaki dikhe recursion kya replace kar rahi hai.', time: 'O(n)', space: 'O(1)', code: R1[0] },
      { level: 'Optimal', idea: 'Recursive (required pattern): pehle <code>printNos(n − 1)</code> se 1..n−1 print karwao, phir khud <code>n</code> print karo. Base case <code>n == 0</code>. Har call ek stack frame → O(n) stack space.', time: 'O(n)', space: 'O(n) call stack', code: R1[1] },
    ],
    viz: {
      title: 'Print 1 to N — recursion (call stack)',
      inputs: nInput('5'),
      check: nCheck(1, 8),
      run({ n }) {
        let out = '';
        const R = recT(R1[1], () => [consoleView(out)]);
        const { st } = R;
        const rec = n => {
          R.cs.push('printNos', n, () => ({ n }));
          st('public void printNos', `Call printNos(${n}) → naya frame stack pe (depth ${R.cs.depth()}), is frame ka apna n = ${n}`);
          if (n === 0) {
            st('if (n == 0) return;', 'n == 0 ✓ → BASE CASE: kuch print nahi, frame yahin khatam, wapas caller pe');
            R.cs.pop();
            return;
          }
          st('if (n == 0) return;', `n = ${n} ≠ 0 → base case nahi, aage`);
          st('printNos(n - 1);', `printNos(${n - 1}) call — "1..${n - 1} tum print karo", trust karo. Ye frame (n = ${n}) yahin ruk ke wait karega`);
          R.call('printNos(n - 1);');
          rec(n - 1);
          st('printNos(n - 1);', `printNos(${n - 1}) wapas aaya → console: "${out.trim() || '(khaali)'}". Ab is frame ka bacha kaam`);
          out += n + ' ';
          const last = R.cs.depth() === 1;
          st('System.out.print', `print ${n} → console: "${out.trim()}"${last ? ' — sabse pehla frame bhi khatam, stack khaali' : ` — printNos(${n}) khatam, frame pop`}`, last ? { ret: out.trim() } : undefined);
          R.cs.pop();
        };
        rec(n);
        return R.steps;
      },
      variants: [
        {
          ap: 0, label: 'for loop (baseline)',
          run({ n }) {
            let out = '', i;
            const { st, steps } = K.tracer(R1[0], () => ({ views: [consoleView(out)], vars: Object.assign({ n }, i !== undefined ? { i } : {}) }));
            st('public void printNos', `Method call: n = ${n} — ek hi frame, koi recursion nahi`);
            for (i = 1; ; i++) {
              if (!(i <= n)) { st('for (int i', `i = ${i}: ${i} <= ${n} ✗ → loop khatam`, { ret: out.trim() }); break; }
              st('for (int i', `i = ${i}: ${i} <= ${n} ✓`);
              out += i + ' ';
              st('System.out.print', `print ${i} → console: "${out.trim()}"`);
            }
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Recursion zero se', blocks: [
        { p: '<b>Recursion</b> = method jo <b>khud ko call</b> karta hai, par har baar <b>chhote input</b> ke saath. Socho ek line me log khade hain aur tumhe pata karna hai tum kaunse number pe ho: tum aage wale se puchte ho "tum kaunse ho?" — wo apne aage wale se puchta hai … sabse aage wala bolta hai "main 1" (yahi <b>base case</b>), aur jawab peeche ki taraf +1 hote hote tum tak aata hai.' },
        { h: 'Har recursive function ki 3 cheezein' },
        { table: { head: ['Cheez', 'Matlab', 'printNos(n) me'], rows: [
          ['<b>Base case</b>', 'Sabse chhota input jiska jawab seedha pata hai — yahan recursion rukti hai', '<code>n == 0</code> → kuch print nahi'],
          ['<b>Chhota subproblem</b>', 'Same problem, par chhote input pe', '<code>printNos(n − 1)</code> → 1..n−1'],
          ['<b>Apna kaam</b>', 'Chhote jawab ko use karke bada jawab banana', '<code>print n</code>'],
        ] } },
        { tip: '<b>Trust the call (leap of faith):</b> <code>printNos(n − 1)</code> likhte waqt andar mat ghuso. Bas maan lo ki ye 1..n−1 sahi print kar dega. Tumhara kaam sirf: "agar 1..n−1 print ho gaya, toh n ke liye mujhe kya karna hai?" → n print karo. Base case sahi + ye step sahi = poora sahi (yahi mathematical induction hai).' },
        { h: 'Call stack — frames' },
        { p: 'Java har method call ke liye <b>stack</b> pe ek <b>frame</b> banata hai: us call ke parameters, locals, aur "wapas kahan aana hai". <code>printNos(3)</code> chalate hi frames aise bante hain — har frame ka <b>apna alag n</b> hota hai:' },
        { pre: `push printNos(3)        stack: [3]
  push printNos(2)      stack: [3, 2]
    push printNos(1)    stack: [3, 2, 1]
      push printNos(0)  stack: [3, 2, 1, 0]   ← base case, return
    print 1, pop        stack: [3, 2]
  print 2, pop          stack: [3]
print 3, pop            stack: []          Output: 1 2 3` },
        { p: 'Upar jaate waqt (calls) kuch print nahi hua; print <b>wapas aate waqt</b> hua. Isliye order 1, 2, 3 aaya. Visualizer me right side <b>CALL STACK</b> panel aur 🌳 call tree me yahi dikhega.' },
        { h: 'Stack overflow' },
        { p: 'Stack ki memory limited hai (default thread stack ~512 KB–1 MB → roughly kuch hazaar se ~10–20 hazaar frames, frame size pe depend). Agar base case bhool gaye ya input chhota hi nahi hua (<code>printNos(n)</code> ko <code>printNos(n)</code> se call kiya), frames bante hi jaayenge → <b><code>StackOverflowError</code></b>. Isliye har recursion me pehle socho: <b>base case kya hai, aur har call base ki taraf badh rahi hai ya nahi?</b>' },
      ] },
      { title: '📄 Problem — Print 1 to N using recursion', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — for loop (sirf comparison)' },
        { p: '<code>for (i = 1..n) print i</code>. O(n) time, O(1) space. Problem recursion maangti hai, isliye ye submission nahi — bas baseline, taaki dikhe ki recursion loop ka kaam kaise karti hai.' },
        { h: 'Better?' },
        { p: 'Alag Better nahi hai — dono me n prints hi hain, isse kam ho hi nahi sakta.' },
        { h: '2. Optimal — recursion (required pattern)' },
        { p: 'Problem ko chhota karo: "1..n print karna" = "1..n−1 print karna" + "n print karna". Pehla hissa wahi problem hai chhote n pe → <code>printNos(n − 1)</code>. Base case: n == 0 pe kuch nahi. Print call ke <b>baad</b> hai, isliye pehle saare chhote numbers aate hain.' },
        { tip: 'Yahan <b>"Optimal" ka matlab = jo recursive pattern problem maangti hai</b>, ye loop se fast nahi hai. Time dono O(n); recursion upar se <b>O(n) stack space</b> leti hai. Interview me ye honestly bolo.' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — printNos(3) (Optimal)', blocks: [
        { table: { head: ['Step', 'Kya hua', 'Stack (bottom → top)', 'Console'], rows: [
          ['1', 'printNos(3): 3 ≠ 0 → call printNos(2)', '[3]', ''],
          ['2', 'printNos(2): 2 ≠ 0 → call printNos(1)', '[3, 2]', ''],
          ['3', 'printNos(1): 1 ≠ 0 → call printNos(0)', '[3, 2, 1]', ''],
          ['4', 'printNos(0): <b>base case</b> → return', '[3, 2, 1, 0] → [3, 2, 1]', ''],
          ['5', 'printNos(1) resume → print 1 → pop', '[3, 2]', '1'],
          ['6', 'printNos(2) resume → print 2 → pop', '[3]', '1 2'],
          ['7', 'printNos(3) resume → print 3 → pop', '[ ]', '<b>1 2 3</b>'],
        ] } },
        { tip: 'Max stack depth = n + 1 (n se 0 tak). n = 1000 pe 1001 frames — safe. n = 10⁶ pe StackOverflowError ka risk.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: R1[1] },
        { lines: [
          ['public void printNos(int n)', 'Har call ka apna n — alag frame me.'],
          ['if (n == 0) return;', 'Base case: 0 tak kuch print nahi karna. Iske bina infinite recursion → StackOverflowError.'],
          ['printNos(n - 1);', 'Chhota subproblem: 1..n−1 print karwao. Trust karo ki ye sahi karega.'],
          ['System.out.print(n + " ");', 'Apna kaam — call ke BAAD, isliye n sabse last me (1..n−1 ke baad) aata hai.'],
        ] },
      ] },
      { title: '▶ Visualizer — loop vs recursion line by line', blocks: [
        { viz: 1 },
        { tip: 'Optimal tab me right side <b>CALL STACK</b> dekho: har call pe frame upar judta hai, return pe hat-ta hai. 🌳 call tree me ek seedhi chain dikhegi (3 → 2 → 1 → 0). ✎ Input se n = 6 try karo.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'n = 1 → printNos(0) base, phir "1".',
          'n = 0 (constraint ke bahar) → kuch print nahi; code fir bhi safe hai.',
          'Negative n → <code>n == 0</code> kabhi nahi aayega → StackOverflowError. Safe banana ho toh base <code>n &lt;= 0</code> likho.',
          'Bahut bada n (10⁵–10⁶) → stack overflow ka risk; tab loop hi sahi hai.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Base case bhoolna → infinite recursion.',
          '<code>printNos(n)</code> ko <code>printNos(n)</code> se hi call karna (chhota nahi kiya) → infinite.',
          'Print call se pehle likh dena → output N..1 aa jayega (yahi agla problem r2 hai).',
          '<code>printNos(n--)</code> likhna — post-decrement purana n hi pass karta hai → infinite. <code>n - 1</code> likho.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (loop)', 'O(n)', 'O(1)', 'n prints, ek frame'],
          ['Optimal (recursion)', 'O(n)', 'O(n)', 'n + 1 calls; har call ek stack frame, sab ek saath stack pe (depth n + 1)'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['What are the parts of a recursive function?', 'A base case that stops the recursion, a recursive call on a smaller input, and the work that combines or uses that result.'],
          ['What is the base case here and why is it needed?', 'n == 0, where nothing is printed. Without it the calls never stop and we get a StackOverflowError.'],
          ['Why does this print 1 to n and not n to 1?', 'The print happens after the recursive call returns, so all smaller numbers are printed first, while the stack unwinds.'],
          ['What is the space complexity?', 'O(n) because n + 1 frames are on the call stack at the deepest point; the loop version is O(1).'],
          ['What is a stack frame?', 'Memory for one method call: its parameters, local variables and return address. It is pushed on call and popped on return.'],
          ['When would this cause a StackOverflowError?', 'For very large n, roughly tens of thousands of frames depending on stack size, or if the input never reaches the base case.'],
          ['When is iteration preferable to recursion?', 'When the problem is a simple linear loop like this one: iteration uses O(1) space and has no overflow risk. Recursion shines for trees, divide and conquer and backtracking.'],
          ['Does Java optimise tail calls?', 'No, the JVM does not do tail-call elimination, so even tail-recursive code uses one frame per call.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'I break the problem into a smaller version of itself: printing 1 to n is printing 1 to n minus 1, then printing n. The base case is n equal to zero, where I print nothing. Because the print comes after the recursive call, the smaller numbers are printed first as the stack unwinds. It runs in O(n) time and uses O(n) stack space; an iterative loop would use O(1) space, so in production I would use the loop, but this shows the recursion pattern.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['printNos(4) me maximum kitne frames ek saath stack pe honge?', '<b>5</b> — printNos(4), (3), (2), (1), (0).'],
          ['Base case <code>if (n == 0) return;</code> hata do toh printNos(3) ka kya hoga?', 'n = 0, −1, −2 … calls chalte rahenge → <b>StackOverflowError</b>.'],
          ['Print line ko <code>printNos(n − 1)</code> se pehle le aao — printNos(3) ka output?', '<b>3 2 1</b> — yahi r2 hai (print call se pehle = upar jaate waqt print).'],
        ] },
        { olist: ['Recursive code 2 min me bina dekhe likho.', 'printNos(3) ka stack diagram kaagaz pe banao (push / pop).'] },
      ] },
    ],
    checks: [
      'Base case, chhota subproblem, apna kaam — teeno bata sakta hoon',
      '"Trust the call" ka matlab samjha sakta hoon',
      'printNos(3) ka call stack (push / pop) bana sakta hoon',
      'StackOverflowError kab aata hai aur recursion ka O(n) space kyun — bol sakta hoon',
    ],
    memory: 'Base pe ruko, chhota karke khud ko bulao, wapas aake apna kaam (print n).',
    tests: [
      { run: CAP(5), out: '1 2 3 4 5' },
      { run: CAP(3), out: '1 2 3' },
      { run: CAP(1), out: '1' },
      { run: CAP(10), out: '1 2 3 4 5 6 7 8 9 10' },
    ],
  };

  // =====================================================================
  // r2 — Print N to 1 using recursion
  // =====================================================================
  const R2 = [
    `public void printNos(int n) {
    for (int i = n; i >= 1; i--) {
        System.out.print(i + " ");
    }
}`,
    `public void printNos(int n) {
    if (n == 0) return;          // base case
    System.out.print(n + " ");   // apna kaam PEHLE
    printNos(n - 1);             // phir chhota kaam: n-1..1
}`,
  ];

  L.r2 = {
    kind: 'dsa', title: 'Print N to 1 using recursion', topic: 'Recursion', diff: 'T',
    url: null,
    pattern: 'Tail recursion (kaam call se PEHLE)',
    oneLine: 'Print n PEHLE, phir printNos(n−1). Head vs tail: print ki position hi order decide karti hai.',
    goal: 'N se 1 tak print karo, recursion se. Asli seekh: <b>print call se pehle (tail position) vs baad me (head position)</b> — same code, ek line upar-neeche, aur order ulta.',
    problem: {
      statement: 'Given a positive integer <code>n</code>, print the numbers from <code>n</code> down to <code>1</code>, separated by a single space, <b>using recursion</b> (no loops). Implement <code>public void printNos(int n)</code>.',
      examples: [
        { input: 'n = 5', output: '5 4 3 2 1', explain: 'n se 1 tak decreasing order.', viz: { n: '5' } },
        { input: 'n = 3', output: '3 2 1', explain: 'Chhota example — har frame pehle print karta hai, phir call.', viz: { n: '3' } },
        { input: 'n = 1', output: '1', explain: 'print 1, phir printNos(0) base case.', viz: { n: '1' } },
      ],
      constraints: ['1 <= n <= 1000', 'Use recursion; no for / while loops.', 'Output: numbers separated by single spaces (trailing space allowed).'],
    },
    approaches: [
      { level: 'Brute', idea: 'Ulta <code>for</code> loop n se 1. <b>Problem recursion maangti hai, ye sirf comparison baseline hai.</b>', time: 'O(n)', space: 'O(1)', code: R2[0] },
      { level: 'Optimal', idea: 'Recursive (required pattern): pehle <code>n</code> print, phir <code>printNos(n − 1)</code>. Recursive call method ka <b>last kaam</b> hai = tail recursion. Java fir bhi har call ka frame rakhta hai → O(n) stack.', time: 'O(n)', space: 'O(n) call stack', code: R2[1] },
    ],
    viz: {
      title: 'Print N to 1 — tail recursion (call stack)',
      inputs: nInput('5'),
      check: nCheck(1, 8),
      run({ n }) {
        let out = '';
        const R = recT(R2[1], () => [consoleView(out)]);
        const { st } = R;
        const rec = n => {
          R.cs.push('printNos', n, () => ({ n }));
          st('public void printNos', `Call printNos(${n}) → naya frame (depth ${R.cs.depth()})`);
          if (n === 0) {
            st('if (n == 0) return;', 'n == 0 ✓ → BASE CASE: frame khatam, wapas caller pe');
            R.cs.pop();
            return;
          }
          st('if (n == 0) return;', `n = ${n} ≠ 0 → aage`);
          out += n + ' ';
          st('System.out.print', `print ${n} PEHLE (call se pehle, upar jaate waqt) → console: "${out.trim()}"`);
          st('printNos(n - 1);', `ab printNos(${n - 1}) call — baaki ${n - 1 > 0 ? n - 1 + '..1' : 'kuch nahi'} wo print karega`);
          R.call('printNos(n - 1);');
          rec(n - 1);
          const last = R.cs.depth() === 1;
          st('printNos(n - 1);', `printNos(${n - 1}) wapas aaya — call ke baad is frame me koi kaam bacha hi nahi${last ? ' → sab khatam' : ' → seedha pop'}`, last ? { ret: out.trim() } : undefined);
          R.cs.pop();
        };
        rec(n);
        return R.steps;
      },
      variants: [
        {
          ap: 0, label: 'ulta for loop (baseline)',
          run({ n }) {
            let out = '', i;
            const { st, steps } = K.tracer(R2[0], () => ({ views: [consoleView(out)], vars: Object.assign({ n }, i !== undefined ? { i } : {}) }));
            st('public void printNos', `Method call: n = ${n}`);
            for (i = n; ; i--) {
              if (!(i >= 1)) { st('for (int i', `i = ${i}: ${i} >= 1 ✗ → loop khatam`, { ret: out.trim() }); break; }
              st('for (int i', `i = ${i}: ${i} >= 1 ✓`);
              out += i + ' ';
              st('System.out.print', `print ${i} → console: "${out.trim()}"`);
            }
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Head vs tail: print kab hota hai?', blocks: [
        { p: 'r1 me dekha: recursion me do phases hote hain — <b>upar jaana</b> (calls, stack badhta hai) aur <b>wapas aana</b> (returns, stack ghat-ta hai). Jo kaam call se <b>pehle</b> likha hai wo upar jaate waqt hota hai; jo call ke <b>baad</b> likha hai wo wapas aate waqt.' },
        { table: { head: ['', 'Head position (r1)', 'Tail position (r2)'], rows: [
          ['Code', '<code>printNos(n − 1);<br>print(n);</code>', '<code>print(n);<br>printNos(n − 1);</code>'],
          ['Print kab', 'wapas aate waqt (unwinding)', 'upar jaate waqt (calls ke saath)'],
          ['printNos(3) output', '1 2 3', '3 2 1'],
          ['Call ke baad kaam bacha?', 'Haan — print', 'Nahi — call hi last kaam (tail call)'],
        ] } },
        { pre: `printNos(3): print 3 → call printNos(2)
  printNos(2): print 2 → call printNos(1)
    printNos(1): print 1 → call printNos(0)
      printNos(0): base, return
    (1) return — kuch bacha nahi
  (2) return — kuch bacha nahi
(3) return                         Output: 3 2 1` },
        { tip: '<b>Tail recursion</b> = recursive call method ka bilkul last kaam. Kuch languages (Scala, Kotlin <code>tailrec</code>, Scheme) isse loop me badal deti hain (O(1) stack). <b>Java nahi karta</b> — JVM har call ka frame rakhta hai, isliye yahan bhi O(n) stack.' },
      ] },
      { title: '📄 Problem — Print N to 1 using recursion', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — ulta for loop (sirf comparison)' },
        { p: '<code>for (i = n; i >= 1; i--) print i</code>. O(n) time, O(1) space. Problem recursion maangti hai — ye baseline hai.' },
        { h: 'Better?' },
        { p: 'Koi alag Better nahi — n prints se kam possible nahi.' },
        { h: '2. Optimal — recursion (required pattern)' },
        { p: '"n..1 print karna" = "n print karna" + "n−1..1 print karna". Toh pehle print, phir <code>printNos(n − 1)</code>. r1 se sirf ek farak: print line call se <b>upar</b>.' },
        { tip: '"Optimal" = problem jo recursion pattern maangti hai, faster nahi. Dono O(n) time; recursion O(n) stack extra leti hai.' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — printNos(3) (Optimal)', blocks: [
        { table: { head: ['Step', 'Kya hua', 'Stack (bottom → top)', 'Console'], rows: [
          ['1', 'printNos(3): print 3, call printNos(2)', '[3]', '3'],
          ['2', 'printNos(2): print 2, call printNos(1)', '[3, 2]', '3 2'],
          ['3', 'printNos(1): print 1, call printNos(0)', '[3, 2, 1]', '3 2 1'],
          ['4', 'printNos(0): <b>base</b> → return', '[3, 2, 1, 0] → [3, 2, 1]', '3 2 1'],
          ['5–7', '1, 2, 3 ke frames pop — kuch print nahi', '[ ]', '<b>3 2 1</b>'],
        ] } },
        { p: 'Output stack ke <b>badhte waqt</b> hi poora ban gaya; unwinding me sirf pop hue.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: R2[1] },
        { lines: [
          ['if (n == 0) return;', 'Base case — 0 pe ruk jao.'],
          ['System.out.print(n + " ");', 'Apna kaam PEHLE: is frame ka n abhi print → bada number pehle.'],
          ['printNos(n - 1);', 'Baaki n−1..1 chhote call pe chhodo. Ye last statement hai → tail call.'],
        ] },
      ] },
      { title: '▶ Visualizer — loop vs recursion line by line', blocks: [
        { viz: 1 },
        { tip: 'Console dekho: r1 me print stack <b>khaali hote waqt</b> hota tha, yahan stack <b>bharte waqt</b>. Dono tabs ka console output same — "5 4 3 2 1".' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'n = 1 → "1", phir printNos(0) base.',
          'Negative n → base kabhi nahi → StackOverflowError (safe: <code>n &lt;= 0</code>).',
          'Bada n → har frame stack pe — tail call hone ke bawajood Java me overflow ho sakta hai.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Print aur call ka order ulta → 1..N aa jayega (r1).',
          '"Tail recursion hai toh O(1) space" bolna — Java me galat.',
          'Base case me print kar dena (<code>if (n == 0) print 0</code>) → extra 0.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (loop)', 'O(n)', 'O(1)', 'n prints, ek frame'],
          ['Optimal (recursion)', 'O(n)', 'O(n)', 'n + 1 frames; JVM tail call optimise nahi karta'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['How does this differ from printing 1 to n recursively?', 'Only the position of the print: here it comes before the recursive call, so numbers print while the stack grows; in 1 to n it comes after the call.'],
          ['What is tail recursion?', 'A recursion where the recursive call is the last action of the method, with nothing left to do after it returns.'],
          ['Is this method tail recursive?', 'Yes, printNos(n − 1) is the last statement.'],
          ['Does Java optimise tail recursion?', 'No. The JVM has no tail-call elimination, so it still uses O(n) stack frames.'],
          ['How can you convert tail recursion to a loop?', 'Replace the call with updating the parameter and jumping back to the top: while (n > 0) { print n; n--; }.'],
          ['What is the space complexity?', 'O(n) for the call stack, versus O(1) for the loop.'],
          ['When is iteration preferable here?', 'Always in production for a linear task like this: same O(n) time, O(1) space and no StackOverflowError for large n.'],
          ['What happens with a negative n?', 'The base case n == 0 is never reached, so it recurses until StackOverflowError. Using n <= 0 as the base case fixes it.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Printing n down to 1 is printing n, then printing n minus 1 down to 1. So I print first and then make the recursive call, with n equal to zero as the base case. Because the print comes before the call, the numbers appear while the stack is growing. It is tail recursive, but Java does not eliminate tail calls, so it still uses O(n) stack space; an iterative loop would be O(1) space and is what I would use in real code.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['<code>print(n); printNos(n − 1); print(n);</code> — printNos(2) ka output?', '<b>2 1 1 2</b> — upar jaate waqt 2 1, wapas aate waqt 1 2.'],
          ['Kya r2 ka code tail recursive hai? r1 ka?', 'r2 <b>haan</b> (call last kaam). r1 <b>nahi</b> (call ke baad print bacha).'],
          ['Tail recursion ko loop me kaise likhoge?', '<code>while (n &gt; 0) { print(n); n--; }</code>'],
        ] },
        { olist: ['r1 aur r2 dono 1 min me bina dekhe likho — sirf ek line ki position badalti hai.', 'Self-test 1 ka trace kaagaz pe banao.'] },
      ] },
    ],
    checks: [
      'Print call se pehle vs baad — output kaise badalta hai, bata sakta hoon',
      'Tail recursion ki definition aur Java me TCO nahi hota — pata hai',
      'printNos(3) ka stack + console dry run kar sakta hoon',
      'Code 1 min me bina dekhe likh sakta hoon',
    ],
    memory: 'Pehle print = upar jaate waqt (N..1). Baad me print = wapas aate waqt (1..N).',
    tests: [
      { run: CAP(5), out: '5 4 3 2 1' },
      { run: CAP(3), out: '3 2 1' },
      { run: CAP(1), out: '1' },
      { run: CAP(10), out: '10 9 8 7 6 5 4 3 2 1' },
    ],
  };

  // =====================================================================
  // r3 — Factorial using recursion
  // =====================================================================
  const R3 = [
    `public long factorial(int n) {
    long result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}`,
    `public long factorial(int n) {
    if (n <= 1) return 1;               // base: 0! = 1! = 1
    return n * factorial(n - 1);        // n! = n * (n-1)!
}`,
  ];

  L.r3 = {
    kind: 'dsa', title: 'Factorial using recursion', topic: 'Recursion', diff: 'T',
    url: null,
    pattern: 'Recursion with return value (answer neeche se upar aata hai)',
    oneLine: 'n! = n × (n−1)!. Base: n ≤ 1 → 1. Har frame chhote ka answer leke apna multiply karke lautata hai.',
    goal: 'n! nikaalo recursion se. Asli seekh: <b>return value wapas upar kaise flow hoti hai</b> — har frame apna <code>n</code> yaad rakh ke wait karta hai, neeche se answer aata hai, multiply karke upar bhejta hai.',
    problem: {
      statement: 'Given a non-negative integer <code>n</code>, return <code>n!</code> (n factorial) = <code>1 × 2 × … × n</code>, computed <b>using recursion</b>. By definition <code>0! = 1</code>. Implement <code>public long factorial(int n)</code>.',
      examples: [
        { input: 'n = 5', output: '120', explain: '5! = 5 × 4 × 3 × 2 × 1 = 120.', viz: { n: '5' } },
        { input: 'n = 0', output: '1', explain: '0! = 1 by definition — seedha base case.', viz: { n: '0' } },
        { input: 'n = 3', output: '6', explain: '3! = 3 × 2 × 1 = 6. Chhota example: 3 frames.', viz: { n: '3' } },
      ],
      constraints: ['0 <= n <= 20', '20! = 2432902008176640000 fits in a long; 21! overflows.'],
    },
    approaches: [
      { level: 'Brute', idea: 'Loop: <code>result = 1</code>, phir 2..n multiply. <b>Problem recursion maangti hai, ye sirf comparison baseline hai.</b>', time: 'O(n)', space: 'O(1)', code: R3[0] },
      { level: 'Optimal', idea: 'Recursive (required pattern): <code>n! = n × factorial(n − 1)</code>, base <code>n ≤ 1 → 1</code>. Multiply <b>wapas aate waqt</b> hota hai, isliye frame n yaad rakhta hai → O(n) stack.', time: 'O(n)', space: 'O(n) call stack', code: R3[1] },
    ],
    viz: {
      title: 'Factorial — return value upar flow',
      inputs: nInput('5'),
      check: nCheck(0, 10),
      run({ n }) {
        const R = recT(R3[1], () => []);
        const { st } = R;
        const rec = n => {
          let sub;
          R.cs.push('factorial', n, () => Object.assign({ n }, sub !== undefined ? { 'factorial(n - 1)': sub } : {}));
          st('public long factorial', `Call factorial(${n}) → naya frame (depth ${R.cs.depth()})`);
          if (n <= 1) {
            const last = R.cs.depth() === 1;
            st('if (n <= 1) return 1;', `n = ${n} ≤ 1 ✓ → BASE CASE: return 1`, last ? { ret: '1' } : undefined);
            R.cs.pop();
            return 1;
          }
          st('if (n <= 1) return 1;', `n = ${n} > 1 → base nahi`);
          st('return n * factorial(n - 1);', `${n} * factorial(${n - 1}) — pehle factorial(${n - 1}) ka answer chahiye → call. Ye frame n = ${n} yaad rakh ke wait karega`);
          R.call('return n * factorial(n - 1);');
          sub = rec(n - 1);
          const res = n * sub, last = R.cs.depth() === 1;
          st('return n * factorial(n - 1);', `factorial(${n - 1}) ne ${sub} lautaya → return ${n} * ${sub} = ${res}${last ? ' — final answer' : ' — upar bhejo'}`, last ? { ret: String(res) } : undefined);
          R.cs.pop();
          return res;
        };
        rec(n);
        return R.steps;
      },
      variants: [
        {
          ap: 0, label: 'loop (baseline)',
          run({ n }) {
            let result, i;
            const { st, steps } = K.tracer(R3[0], () => ({ views: [], vars: Object.assign({ n }, result !== undefined ? { result } : {}, i !== undefined ? { i } : {}) }));
            st('public long factorial', `Method call: n = ${n}`);
            result = 1;
            st('long result = 1', 'result = 1 (khaali product)');
            for (i = 2; ; i++) {
              if (!(i <= n)) { st('for (int i', `i = ${i}: ${i} <= ${n} ✗ → loop khatam`); break; }
              st('for (int i', `i = ${i}: ${i} <= ${n} ✓`);
              result *= i;
              st('result *= i', `result = ${result / i} * ${i} = ${result}`);
            }
            st('return result', `return result = ${result}`, { ret: String(result) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Return value neeche se upar', blocks: [
        { p: 'r1 / r2 me method <code>void</code> tha — sirf print. Ab method <b>value lautata hai</b>. Recursion ka asli power yahi hai: chhota call apna <b>answer</b> lautata hai, aur bada call usse apna answer banata hai.' },
        { pre: `factorial(4)                          = 4 * factorial(3)   ← 4 wait
  factorial(3)                        = 3 * factorial(2)   ← 3 wait
    factorial(2)                      = 2 * factorial(1)   ← 2 wait
      factorial(1) = 1   (base)
    factorial(2) gets 1  → returns 2 * 1 = 2
  factorial(3) gets 2    → returns 3 * 2 = 6
factorial(4) gets 6      → returns 4 * 6 = 24` },
        { p: 'Har frame me <code>n</code> safe rehta hai (apna alag copy) jab tak neeche wala answer na de. <code>return n * factorial(n − 1)</code> me Java pehle <code>factorial(n − 1)</code> evaluate karta hai (call), phir multiply — isliye ye <b>tail call nahi</b> hai: call ke baad multiply bacha hai.' },
        { tip: '<b>Recipe:</b> "agar mujhe (n−1)! mil jaaye toh n! kaise banaun?" → n × (n−1)!. Bas yahi ek step + base case likho. Visualizer ke VARIABLES me <code>factorial(n - 1)</code> value aate hi dikhegi, aur 🌳 call tree me har node ke saath uska return.' },
      ] },
      { title: '📄 Problem — Factorial using recursion', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — loop (sirf comparison)' },
        { p: '<code>result = 1; for i = 2..n: result *= i</code>. O(n) time, O(1) space. Recursion maangi hai, toh ye baseline hai.' },
        { h: 'Better?' },
        { p: 'Koi alag Better nahi — n multiplications chahiye hi.' },
        { h: '2. Optimal — recursion (required pattern)' },
        { p: 'Definition hi recursive hai: <code>n! = n × (n−1)!</code>, <code>0! = 1! = 1</code>. Base <code>n ≤ 1</code> rakha taaki 0 aur 1 dono cover ho jaayein.' },
        { tip: '"Optimal" yahan = required recursive pattern, faster nahi. Time dono O(n); recursion O(n) stack leti hai. <code>long</code> isliye kyunki 13! hi <code>int</code> se bahar chala jaata hai.' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — factorial(5) (Optimal)', blocks: [
        { table: { head: ['Phase', 'Frame', 'Kya hua', 'Return'], rows: [
          ['calls ↓', 'factorial(5)', '5 > 1 → call factorial(4), 5 wait', ''],
          ['calls ↓', 'factorial(4)', 'call factorial(3), 4 wait', ''],
          ['calls ↓', 'factorial(3)', 'call factorial(2), 3 wait', ''],
          ['calls ↓', 'factorial(2)', 'call factorial(1), 2 wait', ''],
          ['base', 'factorial(1)', '1 ≤ 1', '<b>1</b>'],
          ['returns ↑', 'factorial(2)', '2 × 1', '2'],
          ['returns ↑', 'factorial(3)', '3 × 2', '6'],
          ['returns ↑', 'factorial(4)', '4 × 6', '24'],
          ['returns ↑', 'factorial(5)', '5 × 24', '<b>120</b>'],
        ] } },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: R3[1] },
        { lines: [
          ['public long factorial(int n)', '<code>long</code> return — 20! tak fit.'],
          ['if (n <= 1) return 1;', 'Base case: 0! aur 1! dono 1. <code>n == 1</code> likhte toh factorial(0) infinite chala jaata.'],
          ['return n * factorial(n - 1);', 'Pehle chhota call, uska answer aaye tab multiply. Answer upar caller ko jaata hai.'],
        ] },
      ] },
      { title: '▶ Visualizer — loop vs recursion line by line', blocks: [
        { viz: 0 },
        { tip: 'Optimal tab: neeche jaate waqt har frame "wait" karta hai, base ke baad har step pe ek frame pop hota hai aur VARIABLES me <code>factorial(n - 1)</code> bhar jaata hai. Example "n = 0" seedha base case dikhata hai.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'n = 0 → 1 (base case <code>n ≤ 1</code> se).',
          'n = 20 → 2432902008176640000 (long max ~9.22×10¹⁸ ke andar).',
          'n = 21 → long overflow (galat negative/garbage). Bada chahiye toh <code>BigInteger</code>.',
          'Negative n → factorial defined nahi; <code>n ≤ 1</code> base pe 1 lautega — production me exception throw karna better.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Base <code>n == 1</code> → factorial(0) pe 0, −1, … infinite → StackOverflowError.',
          '<code>int</code> return → 13! se overflow.',
          'Base case me <code>return 0</code> → poora product 0.',
          '<code>return factorial(n - 1) * n</code> bhi sahi hai — order farak nahi, par call pehle hi hoga.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (loop)', 'O(n)', 'O(1)', 'n − 1 multiplications'],
          ['Optimal (recursion)', 'O(n)', 'O(n)', 'n calls, har call O(1) kaam; depth n tak frames stack pe'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['What is the recurrence?', 'n! = n × (n − 1)!, with 0! = 1! = 1 as the base case.'],
          ['Why is the base case n <= 1 and not n == 1?', 'So that factorial(0) also terminates and returns 1; with n == 1, an input of 0 would recurse forever.'],
          ['Why return long instead of int?', '13! already exceeds the int range; long holds values up to 20!. Beyond that, use BigInteger.'],
          ['Is this tail recursive?', 'No, the multiplication happens after the recursive call returns. A tail-recursive version passes an accumulator: fact(n, acc) returns fact(n − 1, acc × n).'],
          ['What are the time and space complexities?', 'O(n) time and O(n) stack space; the loop is O(n) time and O(1) space.'],
          ['When is iteration preferable here?', 'In real code, always: same time, constant space and no stack overflow risk. Recursion is good here mainly to show how return values flow back up.'],
          ['How do the frames keep their own n?', 'Each call gets its own stack frame with its own copy of the parameter, so the waiting frames are not affected by deeper calls.'],
          ['How would you handle negative input?', 'Validate and throw an IllegalArgumentException, since factorial is not defined for negatives.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Factorial has a natural recursive definition: n factorial is n times n minus 1 factorial, and zero and one factorial are both one. So the base case is n less than or equal to one, returning one, and otherwise I return n times factorial of n minus 1. Each frame waits for the smaller result and multiplies on the way back up. It is O(n) time and O(n) stack space; the iterative loop gives O(1) space, and I return long because 13 factorial overflows int.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['factorial(4) me kitne calls honge aur max stack depth?', '<b>4 calls</b> (4, 3, 2, 1) aur depth 4. (Base n ≤ 1 hai, isliye factorial(0) call nahi hota.)'],
          ['Base case <code>if (n == 0) return 0;</code> likh diya — factorial(3)?', '<b>0</b> — 3 × 2 × 1 × 0. Base value galat toh poora answer galat.'],
          ['Accumulator wala tail-recursive version likho.', '<code>long fact(int n, long acc) { if (n &lt;= 1) return acc; return fact(n - 1, acc * n); }</code> — call: fact(n, 1).'],
        ] },
        { olist: ['Recursive factorial 1 min me bina dekhe likho.', 'factorial(5) ka returns ↑ wala hissa zor se bolo: 1, 2, 6, 24, 120.'] },
      ] },
    ],
    checks: [
      'Return value neeche se upar kaise aati hai — factorial(4) pe bata sakta hoon',
      'Base case n ≤ 1 kyun (n == 1 kyun nahi) — samjha',
      'Ye tail recursive kyun nahi hai — bol sakta hoon',
      'long / overflow aur O(n) stack space ki baat interview me kar sakta hoon',
    ],
    memory: 'n! = n × (n−1)!; base n ≤ 1 → 1. Neeche jao, wapas aate waqt multiply.',
    tests: [
      { run: 'System.out.print(o.factorial(5));', out: '120' },
      { run: 'System.out.print(o.factorial(0));', out: '1' },
      { run: 'System.out.print(o.factorial(1));', out: '1' },
      { run: 'System.out.print(o.factorial(10));', out: '3628800' },
      { run: 'System.out.print(o.factorial(20));', out: '2432902008176640000' },
    ],
  };

  // =====================================================================
  // r4 — Length of a String using recursion (GfG)
  // =====================================================================
  const R4 = [
    `public int length(String s) {
    int count = 0;
    for (char c : s.toCharArray()) {
        count++;
    }
    return count;
}`,
    `public int length(String s) {
    if (s.isEmpty()) return 0;                 // "" ki length 0
    return 1 + length(s.substring(1));         // pehla char + baaki ki length
}`,
  ];
  const strView = (label, s, hl) => (s.length ? K.A(label, s.split(''), hl || {}) : K.X(label, '"" (khaali string)'));

  L.r4 = {
    kind: 'dsa', title: 'Length of a String using recursion', topic: 'Recursion', diff: 'T',
    url: 'https://www.geeksforgeeks.org/program-for-length-of-a-string-using-recursion/',
    pattern: 'Recursion on strings (pehla char + baaki string)',
    oneLine: 'length(s) = 1 + length(s.substring(1)). Base: "" → 0. (substring har baar copy banata hai!)',
    goal: 'String ki length recursion se nikaalo. Asli seekh: <b>string pe recursion</b> — "pehla character + baaki string" — aur <b>substring vs index parameter</b> ka cost difference.',
    problem: {
      statement: 'Given a string <code>str</code>, calculate the <b>length</b> of the string <b>using recursion</b>. Implement <code>public int length(String s)</code>.',
      examples: [
        { input: 'str = "abcd"', output: '4', explain: 'The string has 4 characters.', viz: { s: 'abcd' } },
        { input: 'str = "GEEKSFORGEEKS"', output: '13', explain: 'The string has 13 characters.', viz: { s: 'GEEKSFORGEEKS' } },
        { input: 'str = "abc"', output: '3', explain: 'Apna chhota example — 4 frames: "abc", "bc", "c", "".', viz: { s: 'abc' } },
      ],
      constraints: ['0 <= str.length <= 1000', 'Do not use the built-in length() for the answer — compute it recursively.'],
    },
    approaches: [
      { level: 'Brute', idea: 'Loop se har character gino. <b>Problem recursion maangti hai, ye sirf comparison baseline hai.</b> (Real code me <code>s.length()</code> O(1) hai.)', time: 'O(n)', space: 'O(n) (toCharArray copy)', code: R4[0] },
      { level: 'Optimal', idea: 'Recursive (required pattern, GfG wala): khaali string → 0, warna <code>1 + length(s.substring(1))</code>. Dhyaan: har <code>substring(1)</code> nayi string copy banata hai (Java 7u6+), isliye time O(n²) hai — ye loop se <b>slow</b> hai.', time: 'O(n²) (substring copies)', space: 'O(n) stack + O(n²) total allocation', code: R4[1] },
    ],
    viz: {
      title: 'Length of String — substring recursion',
      inputs: [{ key: 's', label: 's', def: 'abc', type: 'str' }],
      check: ({ s }) => (s.length <= 15 ? '' : 's max 15 characters rakho (visualizer chhota rakhna hai).'),
      run({ s }) {
        const R = recT(R4[1], () => {
          const t = R.cs.top();
          return t ? [strView(`s (is frame ki apni copy: "${t.s}")`, t.s, { 0: 'cur' })] : [];
        });
        const { st } = R;
        const rec = s => {
          let sub;
          R.cs.push('length', '"' + s + '"', () => Object.assign({ s: '"' + s + '"' }, sub !== undefined ? { 'length(rest)': sub } : {}));
          R.cs.top().s = s;
          st('public int length', `Call length("${s}") → naya frame (depth ${R.cs.depth()})`);
          if (s.length === 0) {
            const last = R.cs.depth() === 1;
            st('if (s.isEmpty()) return 0;', 's = "" khaali ✓ → BASE CASE: return 0', last ? { ret: '0' } : undefined);
            R.cs.pop();
            return 0;
          }
          st('if (s.isEmpty()) return 0;', `s = "${s}" khaali nahi → aage`);
          const rest = s.slice(1);
          st('return 1 + length(s.substring(1));', `pehla char '${s[0]}' = 1, baaki "${rest}" ki length chhote call se → s.substring(1) = "${rest}" (nayi copy, ${rest.length} chars)`);
          R.call('return 1 + length(s.substring(1));');
          sub = rec(rest);
          const res = 1 + sub, last = R.cs.depth() === 1;
          st('return 1 + length(s.substring(1));', `length("${rest}") ne ${sub} lautaya → return 1 + ${sub} = ${res}`, last ? { ret: String(res) } : undefined);
          R.cs.pop();
          return res;
        };
        rec(s);
        return R.steps;
      },
      variants: [
        {
          ap: 0, label: 'loop (baseline)',
          run({ s }) {
            let count, c, idx;
            const { st, steps } = K.tracer(R4[0], () => ({ views: [strView('s', s, idx !== undefined ? K.rng(0, idx - 1, 'done', { [idx]: 'cur' }) : {})], vars: Object.assign({ s: '"' + s + '"' }, count !== undefined ? { count } : {}, c !== undefined ? { c: "'" + c + "'" } : {}) }));
            st('public int length', `Method call: s = "${s}"`);
            count = 0;
            st('int count = 0', 'count = 0');
            for (idx = 0; idx < s.length; idx++) {
              c = s[idx];
              st('for (char c', `c = '${c}' (index ${idx})`);
              count++;
              st('count++', `count++ → ${count}`);
            }
            c = undefined;
            st('for (char c', 'saare characters ho gaye → loop khatam');
            idx = undefined;
            st('return count', `return count = ${count}`, { ret: String(count) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — String pe recursion: substring vs index', blocks: [
        { p: 'String pe recursion ka standard soch: <b>"pehla character + baaki string"</b>. Baaki string wahi problem hai, bas 1 char chhota. Base case: <b>khaali string</b> <code>""</code>.' },
        { pre: `length("abc") = 1 + length("bc")
               = 1 + (1 + length("c"))
               = 1 + (1 + (1 + length("")))
               = 1 + 1 + 1 + 0 = 3` },
        { h: 'Baaki string kaise pass karein — 2 tareeke' },
        { table: { head: ['', 'substring wala', 'index parameter wala'], rows: [
          ['Call', '<code>f(s.substring(1))</code>', '<code>f(s, i + 1)</code> (helper me)'],
          ['Har call ka cost', '<b>O(n)</b> — <code>substring</code> nayi char array copy karta hai (Java 7u6 se)', '<b>O(1)</b> — sirf int badha'],
          ['Total time (n chars)', 'n + (n−1) + … = <b>O(n²)</b>', '<b>O(n)</b>'],
          ['Extra memory', 'O(n) stack + O(n²) total garbage', 'O(n) stack'],
          ['Base case', '<code>s.isEmpty()</code>', '<code>i == s.length()</code>'],
        ] } },
        { tip: '<b>Index wala hamesha better</b> jab string ki length use karna allowed ho — jaise reverse string, palindrome check, count of a char. Par <b>is problem me</b> answer hi length hai: index wale ka base case <code>i == s.length()</code> length() use kar leta — circular ho jaata. Isliye yahan GfG ka substring wala hi required pattern hai. Aage ke string-recursion problems me <code>(s, index)</code> helper hi likhna.' },
      ] },
      { title: '📄 Problem — GfG Length of a String using recursion', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — loop (sirf comparison)' },
        { p: 'Har char pe <code>count++</code>. O(n) time. Real Java me <code>s.length()</code> hi O(1) hai (String apni length store karti hai) — ye loop sirf dikhane ke liye ki recursion kya replace karti hai.' },
        { h: 'Better?' },
        { p: 'Koi alag Better nahi (index-parameter version length() pe depend karta hai, isliye yahan valid approach nahi — Concept dekho).' },
        { h: '2. Optimal — recursion (required pattern)' },
        { p: '"abc" ki length = 1 (a ke liye) + "bc" ki length. Base: <code>""</code> → 0. Code 2 lines.' },
        { tip: 'Honest baat: yahan <b>"Optimal" = problem ka maanga hua recursive pattern</b>, fast nahi. substring copy ki wajah se ye <b>O(n²)</b> hai, loop O(n). Interview me ye cost khud bolna plus point hai.' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — length("abc") (Optimal)', blocks: [
        { table: { head: ['Phase', 'Frame', 'substring(1)', 'Return'], rows: [
          ['calls ↓', 'length("abc")', '"bc" (copy, 2 chars)', ''],
          ['calls ↓', 'length("bc")', '"c" (copy, 1 char)', ''],
          ['calls ↓', 'length("c")', '"" (khaali)', ''],
          ['base', 'length("")', '—', '<b>0</b>'],
          ['returns ↑', 'length("c")', '', '1 + 0 = 1'],
          ['returns ↑', 'length("bc")', '', '1 + 1 = 2'],
          ['returns ↑', 'length("abc")', '', '1 + 2 = <b>3</b>'],
        ] } },
        { p: 'Copy hue chars: 2 + 1 + 0 = 3. n chars pe ~n²/2 — "GEEKSFORGEEKS" (13) pe 78 char copies.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: R4[1] },
        { lines: [
          ['if (s.isEmpty()) return 0;', 'Base case: khaali string ki length 0. (<code>s.equals("")</code> bhi chalega.)'],
          ['return 1 + length(s.substring(1));', 'Pehle char ka 1 + baaki string (index 1 se end) ki length. substring(1) = nayi O(n) copy.'],
        ] },
      ] },
      { title: '▶ Visualizer — loop vs recursion line by line', blocks: [
        { viz: 2 },
        { tip: 'Optimal tab me har frame ka <b>apna s</b> dekho — "abc", "bc", "c", "" — har ek alag string object. 🌳 call tree me return 0 → 1 → 2 → 3 upar chadhta dikhega.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          '<code>""</code> → 0, seedha base case.',
          'Ek char <code>"a"</code> → 1 + length("") = 1.',
          'Spaces bhi characters hain: <code>"a b"</code> → 3.',
          '<code>null</code> → <code>s.isEmpty()</code> pe NullPointerException; zaroorat ho toh pehle null check.',
          'Bahut lambi string (10⁴+) → O(n²) copies + stack overflow risk.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Base case me <code>s.length() == 0</code> — kaam karta hai, par length() use karna problem ka matlab hi khatam.',
          '<code>s.substring(0)</code> likhna → same string, kabhi chhota nahi → infinite.',
          '"substring O(1) hai" bolna — Java 7u6 ke baad ye copy banata hai.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (loop)', 'O(n)', 'O(n)', 'toCharArray ek copy; (charAt loop se O(1) extra)'],
          ['Optimal (substring recursion)', 'O(n²)', 'O(n) stack + O(n²) allocation', 'n calls; har substring(1) O(n) copy'],
          ['(Reference) index recursion', 'O(n)', 'O(n) stack', 'har call O(1) — jab length() allowed ho'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['What is the recurrence?', 'length(s) = 1 + length(s without its first character), with length("") = 0.'],
          ['What is the time complexity of the substring version?', 'O(n²), because each substring(1) copies the remaining characters since Java 7u6.'],
          ['How would you avoid the substring cost?', 'Pass the string and an index to a helper and recurse with index + 1; each call is O(1), so O(n) total.'],
          ['Why not use the index version here?', 'Its base case needs i == s.length(), which uses the very length we are asked to compute; for other string problems the index version is preferred.'],
          ['What is the space complexity?', 'O(n) call stack depth, plus the substring copies which add up to O(n²) allocated memory over the run.'],
          ['When is iteration preferable?', 'Practically always here: s.length() is O(1) and a loop is O(n) with O(1) extra space and no stack overflow risk.'],
          ['What is the base case and why that one?', 'The empty string, because it is the smallest input and its length is known to be zero.'],
          ['What happens for a null string?', 's.isEmpty() throws a NullPointerException, so I would check for null first and decide whether to return 0 or throw.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'I think of a string as its first character plus the rest. The length is one plus the length of the rest, and the base case is the empty string with length zero. In Java, substring creates a new copy each time, so this version is O(n squared) time with O(n) stack depth. For string recursion in general I prefer passing an index to a helper, which makes each call O(1), and in real code I would simply call s.length(), which is constant time.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['length("hello") me kitne calls aur max depth?', '<b>6 calls</b> — "hello", "ello", "llo", "lo", "o", "" — depth 6.'],
          ['substring version me total kitne chars copy honge "hello" pe?', '4 + 3 + 2 + 1 + 0 = <b>10</b> → n(n−1)/2 → O(n²).'],
          ['Index version likho (maan lo length() allowed hai).', '<code>int count(String s, int i) { if (i == s.length()) return 0; return 1 + count(s, i + 1); }</code>'],
        ] },
        { olist: ['Substring version 1 min me likho.', 'Index-helper pattern bhi likho — kal-parso ke string recursion problems me yahi chahiye.'] },
      ] },
    ],
    checks: [
      '"Pehla char + baaki string" pattern samjha',
      'substring(1) O(n) copy hai → O(n²) — bata sakta hoon',
      'Index-parameter helper kab aur kyun better hai — bol sakta hoon',
      'Code bina dekhe likh sakta hoon',
    ],
    memory: 'length(s) = 1 + length(rest); "" → 0. substring = copy (O(n)), index = O(1).',
    tests: [
      { run: 'System.out.print(o.length("abcd"));', out: '4' },
      { run: 'System.out.print(o.length("GEEKSFORGEEKS"));', out: '13' },
      { run: 'System.out.print(o.length(""));', out: '0' },
      { run: 'System.out.print(o.length("a"));', out: '1' },
      { run: 'System.out.print(o.length("a b c"));', out: '5' },
    ],
  };

  // =====================================================================
  // r5 — Check if a Number is Palindrome (GfG)
  // =====================================================================
  const R5 = [
    `public boolean isPalindrome(int n) {
    String s = String.valueOf(n);
    String rev = new StringBuilder(s).reverse().toString();
    return s.equals(rev);
}`,
    `public boolean isPalindrome(int n) {
    return reverse(n, 0) == n;
}

private long reverse(int n, long rev) {
    if (n == 0) return rev;                      // saare digits ho gaye
    return reverse(n / 10, rev * 10 + n % 10);   // last digit rev me
}`,
  ];

  L.r5 = {
    kind: 'dsa', title: 'Check if a Number is Palindrome', topic: 'Recursion', diff: 'T',
    url: 'https://www.geeksforgeeks.org/check-if-a-number-is-palindrome/',
    pattern: 'Recursion with accumulator (helper(n, rev))',
    oneLine: 'reverse(n, rev): n == 0 → rev; warna reverse(n/10, rev*10 + n%10). Phir rev == n?',
    goal: 'Number palindrome hai ya nahi (ulta padho toh same). Asli seekh: <b>accumulator wali recursion</b> — answer parameter me saath lekar chalo, base case pe ready mil jaata hai. Plus digit tricks <code>n % 10</code>, <code>n / 10</code>.',
    problem: {
      statement: 'Given an integer <code>n</code>, check whether it is a <b>palindrome</b> or not. A number is a palindrome if it reads the same from forward and backward. Return <code>true</code> if it is a palindrome, else <code>false</code>. Implement <code>public boolean isPalindrome(int n)</code> using recursion.',
      examples: [
        { input: 'n = 12321', output: 'true', explain: 'Reverse of 12321 is 12321, which is the same.', viz: { n: '12321' } },
        { input: 'n = 1234', output: 'false', explain: 'Reverse of 1234 is 4321, which is different.', viz: { n: '1234' } },
        { input: 'n = 121', output: 'true', explain: 'Apna chhota example — 3 digits, 4 reverse frames.', viz: { n: '121' } },
      ],
      constraints: ['0 <= n <= 2^31 - 1', 'Use recursion to reverse the digits.'],
    },
    approaches: [
      { level: 'Brute', idea: 'Number ko String banao, <code>StringBuilder.reverse()</code> se ulta karo, compare. <b>Problem recursion se digits reverse karwana chahti hai — ye sirf comparison baseline hai</b>, aur O(d) extra string memory leta hai.', time: 'O(d)', space: 'O(d) (strings)', code: R5[0] },
      { level: 'Optimal', idea: 'Recursive (required pattern): helper <code>reverse(n, rev)</code> — har call last digit <code>n % 10</code> ko <code>rev</code> me jodta hai aur <code>n / 10</code> pe recurse. Base n == 0 pe <code>rev</code> = poora reversed number. <code>long</code> rev se overflow safe. d = digits.', time: 'O(d)', space: 'O(d) call stack', code: R5[1] },
    ],
    viz: {
      title: 'Palindrome Number — reverse(n, rev) accumulator',
      inputs: nInput('121'),
      check: ({ n }) => (Number.isInteger(n) && n >= 0 && n <= 2147483647 ? '' : 'n 0..2147483647 rakho.'),
      run({ n }) {
        const R = recT(R5[1], () => {
          const t = R.cs.top();
          return t && t.method === 'reverse' ? [K.X('n (bache digits)', t.n), K.X('rev (ab tak ulta bana)', t.rev)] : [K.X('n', n)];
        });
        const { st } = R;
        R.cs.push('isPalindrome', n, () => ({ n }));
        st('public boolean isPalindrome', `Method call: n = ${n}`);
        st('return reverse(n, 0) == n;', `reverse(${n}, 0) call — rev 0 se shuru (accumulator)`);
        R.call('return reverse(n, 0) == n;');
        const rec = (m, rev) => {
          R.cs.push('reverse', m + ', ' + rev, () => ({ n: m, rev }));
          Object.assign(R.cs.top(), { n: m, rev });
          st('private long reverse', `Call reverse(${m}, ${rev}) → naya frame (depth ${R.cs.depth()})`);
          if (m === 0) {
            st('if (n == 0) return rev;', `n == 0 ✓ → BASE CASE: saare digits ho gaye → return rev = ${rev}`);
            R.cs.pop();
            return rev;
          }
          st('if (n == 0) return rev;', `n = ${m} ≠ 0 → digits baaki`);
          const d = m % 10, nr = rev * 10 + d, nm = Math.floor(m / 10);
          st('return reverse(n / 10', `last digit n % 10 = ${d}; rev*10 + ${d} = ${nr}; n / 10 = ${nm} → call reverse(${nm}, ${nr})`);
          R.call('return reverse(n / 10');
          const got = rec(nm, nr);
          st('return reverse(n / 10', `return ${got} — answer bina badle upar pass (call ke baad koi kaam nahi = tail call)`);
          R.cs.pop();
          return got;
        };
        const r = rec(n, 0);
        st('return reverse(n, 0) == n;', `reverse = ${r}; ${r} == ${n}? → return ${r === n}`, { ret: String(r === n) });
        return R.steps;
      },
      variants: [
        {
          ap: 0, label: 'String reverse (baseline)',
          run({ n }) {
            let s, rev;
            const { st, steps } = K.tracer(R5[0], () => ({ views: [K.X('s', s === undefined ? '—' : '"' + s + '"'), K.X('rev', rev === undefined ? '—' : '"' + rev + '"')], vars: Object.assign({ n }, s !== undefined ? { s: '"' + s + '"' } : {}, rev !== undefined ? { rev: '"' + rev + '"' } : {}) }));
            st('public boolean isPalindrome', `Method call: n = ${n}`);
            s = String(n);
            st('String s = String.valueOf', `s = "${s}" (${s.length} chars ki nayi string)`);
            rev = s.split('').reverse().join('');
            st('String rev', `rev = "${rev}" (ek aur copy)`);
            st('return s.equals(rev)', `"${s}".equals("${rev}") → ${s === rev}`, { ret: String(s === rev) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Accumulator / helper recursion', blocks: [
        { p: 'r3 me answer <b>wapas aate waqt</b> banta tha (n × chhota answer). Doosra style: answer <b>parameter me saath lekar chalo</b> — isko <b>accumulator</b> kehte hain. Har call accumulator ko thoda update karke aage deta hai; base case pe accumulator hi final answer hai, jo bina badle upar lautta hai.' },
        { h: 'Digit tricks' },
        { table: { head: ['Expression', 'Matlab', '1234 pe'], rows: [
          ['<code>n % 10</code>', 'last digit', '4'],
          ['<code>n / 10</code>', 'last digit hatao', '123'],
          ['<code>rev * 10 + d</code>', 'd ko rev ke end me jodo', 'rev = 43 → 434'],
        ] } },
        { pre: `reverse(121, 0)
  → reverse(12, 0*10 + 1 = 1)
    → reverse(1, 1*10 + 2 = 12)
      → reverse(0, 12*10 + 1 = 121)   base: return 121
    121 ← 121 ← 121                   (bina badle upar)
isPalindrome: 121 == 121 → true` },
        { tip: '<b>Helper kyun?</b> Public signature <code>isPalindrome(int n)</code> fixed hai, par recursion ko extra state (<code>rev</code>) chahiye. Toh private helper banao jisme extra parameter ho — ye pattern bahut aage aayega (tree, backtracking me <code>helper(node, path)</code>). <b>long rev</b> isliye: 1999999999 ka reverse 9999999991 int me fit nahi hota.' },
      ] },
      { title: '📄 Problem — GfG Check if a Number is Palindrome', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — String bana ke reverse (sirf comparison)' },
        { p: '<code>String.valueOf(n)</code>, <code>new StringBuilder(s).reverse()</code>, <code>equals</code>. O(d) time, O(d) extra string memory. Simple, par problem recursion se digit reversal chahti hai.' },
        { h: 'Better?' },
        { p: 'Alag Better nahi. (Loop se reverse karna bhi same O(d) idea hai — recursion wahi loop ka kaam karti hai.)' },
        { h: '2. Optimal — recursive digit reversal with accumulator (required pattern)' },
        { p: '<code>reverse(n, rev)</code>: n khatam (0) → rev lautao. Warna last digit <code>n % 10</code> ko <code>rev</code> ke peeche jodo, <code>n / 10</code> pe recurse. Phir compare <code>reverse(n, 0) == n</code>. Recursive call last kaam hai → tail recursion (Java fir bhi O(d) stack leta hai).' },
        { tip: 'Yahan <b>"Optimal" = required recursive pattern</b>, faster nahi. Dono O(d) time; String wala O(d) heap, recursion O(d) stack. Pure O(1) space chahiye toh iterative digit reversal (while loop) — interview me ye bolo.' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — n = 12321 (Optimal)', blocks: [
        { table: { head: ['Call', 'n % 10', 'naya rev', 'n / 10'], rows: [
          ['reverse(12321, 0)', '1', '1', '1232'],
          ['reverse(1232, 1)', '2', '12', '123'],
          ['reverse(123, 12)', '3', '123', '12'],
          ['reverse(12, 123)', '2', '1232', '1'],
          ['reverse(1, 1232)', '1', '12321', '0'],
          ['reverse(0, 12321)', '—', '<b>base → return 12321</b>', '—'],
        ] } },
        { p: '12321 saare frames se bina badle upar → <code>12321 == 12321</code> → <b>true</b>. n = 1234 pe reverse = 4321 ≠ 1234 → <b>false</b>.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: R5[1] },
        { lines: [
          ['return reverse(n, 0) == n;', 'Accumulator 0 se shuru; reversed number original ke barabar → palindrome. long vs int compare me int long me widen ho jaata hai.'],
          ['private long reverse(int n, long rev)', 'Helper: n = bache digits, rev = ab tak ka ulta number. long → overflow safe.'],
          ['if (n == 0) return rev;', 'Base: koi digit nahi bacha → rev hi poora reversed number.'],
          ['return reverse(n / 10, rev * 10 + n % 10);', 'Last digit rev me jodo, n se hatao, recurse. Tail call — return value seedha upar.'],
        ] },
      ] },
      { title: '▶ Visualizer — String vs recursion line by line', blocks: [
        { viz: 2 },
        { tip: 'Optimal tab me CALL STACK dekho: <code>reverse(n, rev)</code> ke args har frame pe badalte hain — n chhota, rev bada. Base ke baad return value <b>bina badle</b> har frame se nikalti hai (accumulator style). ✎ Input se 1221 ya 10 try karo.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'n = 0 → reverse(0, 0) = 0 → <b>true</b>.',
          'Single digit (7) → true.',
          'Trailing zero (10, 120) → reverse 1, 21 → <b>false</b> (sahi, kyunki leading zero nahi hota).',
          '1999999999 → reverse 9999999991 int overflow — isliye <code>long rev</code>.',
          'Negative (constraint ke bahar) → "-121" ulta "121-" → palindrome nahi; recursion version me <code>if (n &lt; 0) return false;</code> add karo.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>int rev</code> → bade numbers pe overflow, galat answer.',
          'Original n ko hi chhota karte jaana aur end me usi se compare karna (loop version me copy rakhna padta hai) — helper me ye problem nahi, kyunki isPalindrome ka n badalta hi nahi.',
          'Base case me <code>return 0</code> → accumulator ka answer kho gaya.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (String reverse)', 'O(d)', 'O(d)', 'd = digits ≈ log₁₀ n; do strings'],
          ['Optimal (recursive reverse)', 'O(d)', 'O(d) stack', 'd + 1 calls, har ek O(1)'],
          ['(Reference) iterative reverse', 'O(d)', 'O(1)', 'while loop — production choice'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['How do you reverse a number recursively?', 'Use a helper reverse(n, rev): if n is 0 return rev, else return reverse(n / 10, rev * 10 + n % 10).'],
          ['What is an accumulator?', 'A parameter that carries the partial answer down the recursion, so the base case already holds the final result.'],
          ['Why use long for rev?', 'The reverse of a valid int can overflow int, for example 1999999999 reversed is 9999999991.'],
          ['What is the time and space complexity?', 'O(d) time and O(d) stack space, where d is the number of digits, about log10 of n.'],
          ['How do you handle negative numbers?', 'Return false immediately, since the minus sign cannot appear at the end.'],
          ['Is there an O(1) space solution?', 'Yes, reverse iteratively with a while loop, or reverse only half the digits and compare, which also avoids overflow.'],
          ['When is iteration preferable to recursion here?', 'In real code: it is the same O(d) time with O(1) space. Digit counts are small, so recursion is safe, but the loop is simpler.'],
          ['Why is a helper method needed?', 'The public signature takes only n, but the recursion needs extra state, the reversed value, so a private helper carries it.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'A number is a palindrome if it equals its reverse. I reverse it recursively with a helper that takes the remaining number and an accumulator: each call moves the last digit, n mod 10, onto the end of the accumulator and recurses on n divided by 10. When n becomes zero, the accumulator is the full reverse, and I compare it with the original. I use a long accumulator to avoid overflow. It is O(d) time and O(d) stack space; an iterative version gives O(1) space.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['reverse(450, 0) kya lautayega?', '<b>54</b> — digits 0, 5, 4 → rev = 0 → 5 → 54. Isliye 450 palindrome nahi.'],
          ['n = 1221 ke liye reverse ke kitne calls honge?', '<b>5</b> — reverse(1221,0), (122,1), (12,12), (1,122), (0,1221).'],
          ['Accumulator style aur r3 (factorial) style me farak?', 'Factorial: kaam <b>wapas aate waqt</b> (n × result). Accumulator: kaam <b>jaate waqt</b>, base pe answer ready, upar bina badle aata hai.'],
        ] },
        { olist: ['isPalindrome + reverse helper 3 min me bina dekhe likho.', 'Iterative version bhi likho (while loop) — interview follow-up.'] },
      ] },
    ],
    checks: [
      'n % 10 aur n / 10 se digits kaise nikalte hain — pata hai',
      'Accumulator (helper(n, rev)) pattern samjha — base pe answer ready',
      'long rev kyun (overflow) — bata sakta hoon',
      'Code bina dekhe likh sakta hoon',
    ],
    memory: 'reverse(n, rev): 0 → rev; warna reverse(n/10, rev*10 + n%10). Palindrome = reverse == n.',
    tests: [
      { run: 'System.out.print(o.isPalindrome(12321));', out: 'true' },
      { run: 'System.out.print(o.isPalindrome(1234));', out: 'false' },
      { run: 'System.out.print(o.isPalindrome(0));', out: 'true' },
      { run: 'System.out.print(o.isPalindrome(10));', out: 'false' },
      { run: 'System.out.print(o.isPalindrome(2147447412));', out: 'true' },
      { run: 'System.out.print(o.isPalindrome(1999999999));', out: 'false' },
    ],
  };

  // =====================================================================
  // r6 — Fibonacci Number (LC 509)
  // =====================================================================
  const R6 = [
    `public int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}`,
    `public int fib(int n) {
    int[] memo = new int[n + 1];
    Arrays.fill(memo, -1);
    return solve(n, memo);
}

private int solve(int n, int[] memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];        // pehle se nikala hua
    memo[n] = solve(n - 1, memo) + solve(n - 2, memo);
    return memo[n];
}`,
    `public int fib(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;   // F(i-2), F(i-1)
    for (int i = 2; i <= n; i++) {
        int cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
  ];

  L.r6 = {
    kind: 'dsa', title: 'Fibonacci Number', topic: 'Recursion', diff: 'E', lc: 509,
    url: 'https://leetcode.com/problems/fibonacci-number/',
    pattern: 'Tree recursion → memoization → bottom-up (DP ka darwaza)',
    oneLine: 'F(n) = F(n−1) + F(n−2). Plain recursion O(2ⁿ) (same calls baar baar); memo O(n); do variables O(n) time O(1) space.',
    goal: 'F(n) nikaalo. Asli seekh: <b>tree recursion</b> — ek call do calls banati hai, tree <b>exponential</b> phail jaata hai kyunki same subproblems baar baar solve hote hain. Memo se har subproblem ek baar, phir do variables se O(1) space. Yahi <b>DP ki neev</b> hai (kal Climbing Stairs).',
    problem: {
      statement: 'The <b>Fibonacci numbers</b>, commonly denoted <code>F(n)</code> form a sequence, called the <b>Fibonacci sequence</b>, such that each number is the sum of the two preceding ones, starting from <code>0</code> and <code>1</code>. That is,<br><code>F(0) = 0, F(1) = 1</code><br><code>F(n) = F(n - 1) + F(n - 2)</code>, for <code>n &gt; 1</code>.<br><br>Given <code>n</code>, calculate <code>F(n)</code>.',
      examples: [
        { input: 'n = 2', output: '1', explain: 'F(2) = F(1) + F(0) = 1 + 0 = 1.', viz: { n: '2' } },
        { input: 'n = 3', output: '2', explain: 'F(3) = F(2) + F(1) = 1 + 1 = 2.', viz: { n: '3' } },
        { input: 'n = 4', output: '3', explain: 'F(4) = F(3) + F(2) = 2 + 1 = 3.', viz: { n: '4' } },
        { input: 'n = 5', output: '5', explain: 'Apna example: plain recursion me 15 calls — fib(2) teen baar, fib(3) do baar. Memo tab me repeat calls gayab.', viz: { n: '5' } },
      ],
      constraints: ['0 <= n <= 30'],
    },
    approaches: [
      { level: 'Brute', idea: 'Definition seedha code: <code>fib(n − 1) + fib(n − 2)</code>, base n ≤ 1. Har call 2 calls → tree; same subproblems baar baar → exponential.', time: 'O(2ⁿ) (tight ~O(1.618ⁿ))', space: 'O(n) call stack (depth)', code: R6[0] },
      { level: 'Better', idea: 'Memoization (top-down DP): <code>memo[n]</code> me answer save; dobara aaye toh seedha lautao. Har n sirf ek baar compute → n + 1 distinct calls.', time: 'O(n)', space: 'O(n) (memo + stack)', code: R6[1] },
      { level: 'Optimal', idea: 'Bottom-up, sirf last do values chahiye: <code>prev2 = F(i−2)</code>, <code>prev1 = F(i−1)</code>; loop 2..n. Na recursion, na array.', time: 'O(n)', space: 'O(1)', code: R6[2] },
    ],
    viz: {
      title: 'Fibonacci — do variables (bottom-up)',
      inputs: nInput('5'),
      check: nCheck(0, 6),
      run({ n }) {
        let prev2, prev1, i, cur;
        const V = () => Object.assign({ n }, prev2 !== undefined ? { prev2, prev1 } : {}, i !== undefined ? { i } : {}, cur !== undefined ? { cur } : {});
        const { st, steps } = K.tracer(R6[2], () => ({ views: prev2 !== undefined ? [K.A('[F(i−2), F(i−1)]', [prev2, prev1], { 1: 'cur' })] : [], vars: V() }));
        st('public int fib', `Method call: n = ${n}`);
        if (n <= 1) { st('if (n <= 1) return n;', `n = ${n} ≤ 1 → return n = ${n}`, { ret: String(n) }); return steps; }
        st('if (n <= 1) return n;', `n = ${n} > 1 → loop chahiye`);
        prev2 = 0; prev1 = 1;
        st('int prev2 = 0, prev1 = 1', 'prev2 = F(0) = 0, prev1 = F(1) = 1');
        for (i = 2; ; i++) {
          if (!(i <= n)) { cur = undefined; st('for (int i', `i = ${i}: ${i} <= ${n} ✗ → loop khatam, prev1 = F(${n})`); break; }
          cur = undefined;
          st('for (int i', `i = ${i}: ${i} <= ${n} ✓`);
          cur = prev1 + prev2;
          st('int cur = prev1 + prev2', `cur = F(${i}) = ${prev1} + ${prev2} = ${cur}`);
          prev2 = prev1;
          st('prev2 = prev1;', `prev2 = ${prev2} (ab F(${i - 1}))`);
          prev1 = cur;
          st('prev1 = cur;', `prev1 = ${prev1} (ab F(${i}))`);
        }
        i = undefined;
        st('return prev1', `return prev1 = ${prev1}`, { ret: String(prev1) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Plain recursion (tree)',
          run({ n }) {
            let calls = 0;
            const R = recT(R6[0], () => [K.X('Total calls ab tak', calls)]);
            const { st } = R;
            const rec = n => {
              let a, b;
              calls++;
              R.cs.push('fib', n, () => Object.assign({ n }, a !== undefined ? { 'fib(n - 1)': a } : {}, b !== undefined ? { 'fib(n - 2)': b } : {}));
              st('public int fib', `Call fib(${n}) → frame (depth ${R.cs.depth()}), call #${calls}`);
              if (n <= 1) {
                const last = R.cs.depth() === 1;
                st('if (n <= 1) return n;', `n = ${n} ≤ 1 → BASE: return n = ${n}`, last ? { ret: String(n) } : undefined);
                R.cs.pop();
                return n;
              }
              st('if (n <= 1) return n;', `n = ${n} > 1 → do calls banenge`);
              st('return fib(n - 1) + fib(n - 2);', `pehle fib(${n - 1}) call (left branch)`);
              R.call('return fib(n - 1) + fib(n - 2);');
              a = rec(n - 1);
              st('return fib(n - 1) + fib(n - 2);', `fib(${n - 1}) = ${a} aaya; ab fib(${n - 2}) call (right branch)${n - 2 >= 2 ? ' — ye pehle bhi compute ho chuka, phir se!' : ''}`);
              R.call('return fib(n - 1) + fib(n - 2);');
              b = rec(n - 2);
              const res = a + b, last = R.cs.depth() === 1;
              st('return fib(n - 1) + fib(n - 2);', `return ${a} + ${b} = ${res}${last ? ` — total ${calls} calls` : ''}`, last ? { ret: String(res) } : undefined);
              R.cs.pop();
              return res;
            };
            rec(n);
            return R.steps;
          },
        },
        {
          ap: 1, label: 'Memoization',
          run({ n }) {
            let memo = null;
            const R = recT(R6[1], o => (memo ? [K.A('memo (−1 = abhi nahi nikala)', memo, o.mh)] : []));
            const { st } = R;
            R.cs.push('fib', n, () => Object.assign({ n }, memo ? { memo: K.iA(memo) } : {}));
            st('public int fib', `Method call: n = ${n}`);
            memo = Array(n + 1).fill(0);
            st('int[] memo', `memo = new int[${n + 1}] (index 0..${n})`);
            memo.fill(-1);
            st('Arrays.fill(memo, -1)', 'Sab −1 = "abhi compute nahi hua"');
            st('return solve(n, memo)', `solve(${n}, memo) call`);
            R.call('return solve(n, memo)');
            const rec = n => {
              let a, b;
              R.cs.push('solve', n + ', memo', () => Object.assign({ n }, a !== undefined ? { 'solve(n - 1)': a } : {}, b !== undefined ? { 'solve(n - 2)': b } : {}, { memo: K.iA(memo) }));
              st('private int solve', `Call solve(${n}) → frame (depth ${R.cs.depth()})`, { mh: { [n]: 'cur' } });
              if (n <= 1) { st('if (n <= 1) return n;', `n = ${n} ≤ 1 → BASE: return n = ${n}`); R.cs.pop(); return n; }
              st('if (n <= 1) return n;', `n = ${n} > 1`, { mh: { [n]: 'cur' } });
              if (memo[n] !== -1) {
                st('if (memo[n] != -1)', `memo[${n}] = ${memo[n]} ≠ −1 → MEMO HIT! dobara compute nahi, return ${memo[n]}`, { mh: { [n]: 'found' } });
                R.cs.pop();
                return memo[n];
              }
              st('if (memo[n] != -1)', `memo[${n}] = −1 → pehli baar, compute karna padega`, { mh: { [n]: 'cur' } });
              st('memo[n] = solve(n - 1, memo)', `pehle solve(${n - 1}) call`, { mh: { [n]: 'cur' } });
              R.call('memo[n] = solve(n - 1, memo)');
              a = rec(n - 1);
              st('memo[n] = solve(n - 1, memo)', `solve(${n - 1}) = ${a}; ab solve(${n - 2}) call${n - 2 >= 2 ? ' — memo me already hai' : ''}`, { mh: { [n]: 'cur' } });
              R.call('memo[n] = solve(n - 1, memo)');
              b = rec(n - 2);
              memo[n] = a + b;
              st('memo[n] = solve(n - 1, memo)', `memo[${n}] = ${a} + ${b} = ${memo[n]} — save kar liya`, { mh: { [n]: 'new' } });
              st(['return memo[n];', 2], `return memo[${n}] = ${memo[n]}`, { mh: { [n]: 'done' } });
              R.cs.pop();
              return memo[n];
            };
            const r = rec(n);
            st('return solve(n, memo)', `solve(${n}) ne ${r} lautaya → return ${r}`, { ret: String(r) });
            return R.steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Tree recursion aur explosion', blocks: [
        { p: 'Ab tak (r1–r5) har call <b>ek</b> hi call banati thi → seedhi chain, n calls. Fibonacci me har call <b>do</b> calls banati hai → <b>tree</b>. Isko <b>tree recursion</b> kehte hain.' },
        { pre: `                    fib(5)
              /              \\
          fib(4)             fib(3)
         /      \\           /      \\
     fib(3)    fib(2)    fib(2)   fib(1)
     /    \\    /   \\     /   \\
 fib(2) fib(1) f(1) f(0) f(1) f(0)
  /  \\
f(1) f(0)                    15 calls for n = 5` },
        { p: '<b>Kyun phat-ta hai?</b> fib(3) do baar, fib(2) teen baar compute ho raha hai — same kaam baar baar (<b>overlapping subproblems</b>). Calls ~ 2ⁿ (tight: ~1.618ⁿ). n = 30 → ~27 lakh calls; n = 50 → ~4×10¹⁰ — minutes/hours.' },
        { table: { head: ['', 'Plain recursion', 'Memo (top-down)', 'Bottom-up 2 vars'], rows: [
          ['Idea', 'definition seedha', 'answer cache karo', 'chhote se bada banao'],
          ['Time', 'O(2ⁿ)', 'O(n)', 'O(n)'],
          ['Space', 'O(n) stack', 'O(n) memo + O(n) stack', 'O(1)'],
        ] } },
        { tip: '<b>Stack depth vs total calls</b> alag cheezein hain: plain recursion me total calls 2ⁿ hain par ek waqt pe stack pe max n frames (ek path). Isliye space O(n), time O(2ⁿ). 🌳 call tree visualizer me Brute tab ka tree aur Better tab ka chhota tree compare karo.' },
      ] },
      { title: '📄 Problem — LC 509 Fibonacci Number', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — plain recursion' },
        { p: 'Definition hi code hai: base <code>n ≤ 1 → n</code>, warna <code>fib(n−1) + fib(n−2)</code>. Sahi hai, par same subproblems baar baar → <b>O(2ⁿ)</b>. n ≤ 30 pe LeetCode pass ho jaata hai (~27 lakh calls), par interviewer turant poochega "isko fast karo".' },
        { h: '2. Better — memoization' },
        { p: 'Problem: fib(3) do baar compute. Fix: pehli baar nikalo toh <code>memo[3]</code> me rakh lo, agli baar seedha wahi lautao. Ab har n sirf ek baar compute → <b>O(n)</b> time, O(n) memo + O(n) stack. Recursion structure same, bas ek cache — isko <b>top-down DP</b> kehte hain.' },
        { h: '3. Optimal — bottom-up, do variables' },
        { p: 'Memo me F(i) nikaalne ke liye sirf F(i−1) aur F(i−2) chahiye. Toh chhote se shuru karo (F(0), F(1)) aur aage badho, sirf last do values rakho. <b>O(n)</b> time, <b>O(1)</b> space, koi recursion nahi → stack overflow ka sawaal hi nahi.' },
        { tip: 'Pattern yaad rakho: <b>recursion → memo → tabulation → space optimise</b>. Ye 4 steps har DP problem pe lagte hain (kal Climbing Stairs = yahi Fibonacci).' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — fib(5)', blocks: [
        { p: '<b>Brute — kaunsa call kitni baar?</b>' },
        { table: { head: ['Call', 'Kitni baar'], rows: [['fib(5)', '1'], ['fib(4)', '1'], ['fib(3)', '2'], ['fib(2)', '3'], ['fib(1)', '5'], ['fib(0)', '3'], ['<b>Total</b>', '<b>15</b>']] } },
        { p: '<b>Optimal — do variables:</b>' },
        { table: { head: ['i', 'cur = prev1 + prev2', 'prev2', 'prev1'], rows: [
          ['start', '—', '0', '1'],
          ['2', '1 + 0 = 1', '1', '1'],
          ['3', '1 + 1 = 2', '1', '2'],
          ['4', '2 + 1 = 3', '2', '3'],
          ['5', '3 + 2 = 5', '3', '<b>5</b>'],
        ] } },
        { p: 'Loop khatam → return prev1 = <b>5</b>. Memo version me solve calls sirf 9 (5, 4, 3, 2, 1, 0, 1, 2-hit, 3-hit) — 15 se kam, aur n badhne pe 2n − 1 hi rehte hain.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: R6[2] },
        { lines: [
          ['if (n <= 1) return n;', 'F(0) = 0, F(1) = 1 — loop ki zaroorat nahi.'],
          ['int prev2 = 0, prev1 = 1;', 'prev2 = F(i−2), prev1 = F(i−1); shuru me F(0), F(1).'],
          ['for (int i = 2; i <= n; i++)', 'F(2) se F(n) tak ek ek karke banao.'],
          ['int cur = prev1 + prev2;', 'F(i) = F(i−1) + F(i−2).'],
          ['prev2 = prev1;', 'Window aage: purana F(i−1) ab F(i−2) ban gaya. (Order important — pehle prev2, phir prev1.)'],
          ['prev1 = cur;', 'Naya F(i) ab F(i−1) ki jagah.'],
          ['return prev1;', 'Loop ke baad prev1 = F(n).'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 3 },
        { tip: 'Tabs: <b>Brute</b> me 🌳 call tree dekho — fib(5) ke 15 nodes, fib(2) teen jagah. <b>Better</b> me memo array bharta dikhega aur "MEMO HIT" pe subtree gayab. <b>Optimal</b> me sirf do numbers aage khisakte hain.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'n = 0 → 0, n = 1 → 1 (base case; Optimal me loop chalta hi nahi).',
          'n = 30 → 832040; int me fit. F(47) int overflow karta hai → bade n pe long / BigInteger.',
          'Memo me <code>new int[n + 1]</code> — n = 0 pe bhi size 1, safe.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Base case sirf <code>n == 1</code> → fib(0) pe fib(−1), fib(−2)… → StackOverflowError.',
          'Memo ko 0 se initialise karke "0 = not computed" maanna — F(0) = 0 hai, confusion; −1 sentinel saaf hai.',
          'Optimal me <code>prev1 = cur</code> pehle aur <code>prev2 = prev1</code> baad me → prev2 galat ho jaata hai.',
          'Plain recursion ka space O(2ⁿ) bolna — space depth = O(n) hai, time O(2ⁿ).',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (plain recursion)', 'O(2ⁿ)', 'O(n)', 'har call 2 calls; ~φⁿ total; stack depth n'],
          ['Better (memo)', 'O(n)', 'O(n)', 'har n ek baar compute; memo array + depth n stack'],
          ['Optimal (2 variables)', 'O(n)', 'O(1)', 'ek loop, do ints'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why is plain recursion exponential?', 'Each call makes two calls and the same subproblems are recomputed many times, so the call tree grows about 1.618 to the n.'],
          ['What is the space complexity of plain recursion?', 'O(n): only one root-to-leaf path is on the stack at a time, even though total calls are exponential.'],
          ['What is memoization?', 'Caching the result of each subproblem the first time it is computed and returning it directly on later calls; it turns this into O(n).'],
          ['What is the difference between top-down and bottom-up DP?', 'Top-down is recursion plus a cache, solving only needed subproblems; bottom-up fills answers from the smallest up with a loop, with no recursion overhead.'],
          ['How do you get O(1) space?', 'Each value depends only on the previous two, so keep two variables and slide them forward.'],
          ['When does the result overflow int?', 'F(47) exceeds the int range, so for larger n use long or BigInteger. LeetCode limits n to 30.'],
          ['Can it be faster than O(n)?', 'Yes, matrix exponentiation or fast doubling gives O(log n), using F(2k) and F(2k + 1) formulas.'],
          ['When is recursion preferable to iteration here?', 'Plain recursion only for explaining the recurrence; memoized recursion when the subproblem order is awkward to write bottom-up. For Fibonacci the iterative version is best.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'The direct recursion follows the definition but recomputes the same subproblems, so it is exponential, about 1.6 to the n. Adding memoization stores each F of i once, giving O(n) time and O(n) space. Since each value only needs the previous two, I can go bottom-up with two variables, starting from zero and one, which is O(n) time and O(1) space with no recursion. If n were huge I would mention O(log n) matrix exponentiation.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['Plain recursion me fib(6) ke total kitne calls?', '<b>25</b>. (calls(n) = calls(n−1) + calls(n−2) + 1: 1, 1, 3, 5, 9, 15, 25.)'],
          ['Memo version me fib(5) ke liye solve kitni baar <b>compute</b> (memo me save) karta hai?', '<b>4 baar</b> — n = 5, 4, 3, 2. n = 0, 1 base hain, aur repeat calls memo hit.'],
          ['Optimal me prev update ka order ulta kar diya (<code>prev1 = cur; prev2 = prev1;</code>) — fib(4)?', 'i=2: cur=1, prev1=1, prev2=1 · i=3: cur=2, prev1=2, prev2=2 · i=4: cur=4 → <b>4 ✗</b> (sahi 3).'],
        ] },
        { olist: ['Teeno versions 5 min me bina dekhe likho.', 'fib(5) ka call tree kaagaz pe banao aur repeat calls gol karo.'] },
      ] },
    ],
    checks: [
      'Tree recursion kyun exponential hai (overlapping subproblems) — bata sakta hoon',
      'Stack depth O(n) vs total calls O(2ⁿ) ka farak samjha',
      'Memo aur 2-variable version bina dekhe likh sakta hoon',
      '30 sec me recursion → memo → bottom-up English me bol sakta hoon',
    ],
    memory: 'Plain = tree, 2ⁿ. Memo = har n ek baar, O(n). Do variables = O(n) time, O(1) space.',
    tests: [
      { run: 'System.out.print(o.fib(0));', out: '0' },
      { run: 'System.out.print(o.fib(1));', out: '1' },
      { run: 'System.out.print(o.fib(2));', out: '1' },
      { run: 'System.out.print(o.fib(3));', out: '2' },
      { run: 'System.out.print(o.fib(4));', out: '3' },
      { run: 'System.out.print(o.fib(10));', out: '55' },
      { run: 'System.out.print(o.fib(30));', out: '832040' },
    ],
  };
})();
