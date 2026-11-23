// Planner lessons — DP (r7 Climbing Stairs)
// Format: planner/LESSON_SPEC.md. Recursion tabs K.callStack() use karte hain (CALL STACK panel + 🌳 call tree).
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  // recursion tracer: har step pe frames (top frame = current call ke vars) + top frame ke vars
  function recTracer(code, cs, render) {
    const find = K.finder(code);
    const { st, steps } = K.tracer(code, o => {
      const fr = cs.frames(o.line);
      return Object.assign({ vars: fr.length ? fr[0].vars : {}, frames: fr }, render(o));
    });
    const S = (snip, note, o) => st(snip, note, Object.assign({}, o, { line: find(snip) }));
    return { S, steps };
  }

  // =====================================================================
  // r7 — Climbing Stairs (LC 70)
  // =====================================================================
  const R7 = [
    `public int climbStairs(int n) {
    if (n <= 2) return n;
    return climbStairs(n - 1) + climbStairs(n - 2);
}`,
    `public int climbStairs(int n) {
    int[] memo = new int[n + 1]; // memo[k] = k stairs ke ways (0 = abhi nahi nikala)
    return ways(n, memo);
}

private int ways(int n, int[] memo) {
    if (n <= 2) return n;
    if (memo[n] != 0) return memo[n];
    memo[n] = ways(n - 1, memo) + ways(n - 2, memo);
    return memo[n];
}`,
    `public int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2; // ways(1), ways(2)
    for (int i = 3; i <= n; i++) {
        int cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
  ];
  const nInput = [{ key: 'n', label: 'n (stairs)', def: '5', num: true }];
  const nCheck = ({ n }) => (Number.isInteger(n) && n >= 1 && n <= 6 ? '' : 'Visualizer ke liye n = 1..6 lo (Brute ka call tree bahut bada ho jaata hai).');

  L.r7 = {
    kind: 'dsa', title: 'Climbing Stairs', topic: 'DP', diff: 'E', lc: 70,
    url: 'https://leetcode.com/problems/climbing-stairs/',
    video: 'https://youtu.be/Y0lT9Fck7qI',
    pattern: '1-D DP (Fibonacci recurrence) — recursion → memo → tabulation',
    oneLine: 'Last step ya toh 1 ka tha ya 2 ka ⇒ ways(n) = ways(n−1) + ways(n−2). Kal ka Fibonacci hi hai — bas base ways(1)=1, ways(2)=2.',
    goal: 'n stairs, ek baar me 1 ya 2 step — top tak pahunchne ke kitne <b>distinct tareeke</b>? Asli seekh: <b>DP ka pehla lesson</b> — recursion me <b>same subproblem baar-baar</b> solve ho raha hai (overlapping subproblems) → <b>memo</b> se ek baar solve karo → phir <b>bottom-up</b> se recursion hi hata do, aur sirf 2 variables me kaam chalao.',
    problem: {
      statement: 'You are climbing a staircase. It takes <code>n</code> steps to reach the top.<br><br>Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct ways can you climb to the top?',
      examples: [
        { input: 'n = 2', output: '2', explain: 'There are two ways to climb to the top.<br>1. 1 step + 1 step<br>2. 2 steps', viz: { n: '2' } },
        { input: 'n = 3', output: '3', explain: 'There are three ways to climb to the top.<br>1. 1 step + 1 step + 1 step<br>2. 1 step + 2 steps<br>3. 2 steps + 1 step', viz: { n: '3' } },
        { input: 'n = 5', output: '8', explain: 'Apna example (LeetCode ka nahi): ways = 1, 2, 3, 5, 8. Brute me call tree me <b>climbStairs(3) do baar</b> dikhega, Better me memo hit dikhega, Optimal me loop 3 baar chalega.', viz: { n: '5' } },
      ],
      constraints: ['1 <= n <= 45'],
    },
    approaches: [
      { level: 'Brute', idea: 'Seedha recurrence: last move 1 step ka tha (bache n−1) ya 2 ka (bache n−2). <code>ways(n) = ways(n−1) + ways(n−2)</code>, base n ≤ 2 → n. Same subproblems baar-baar solve hote hain.', time: 'O(2ⁿ)', space: 'O(n) (recursion depth)', code: R7[0] },
      { level: 'Better', idea: 'Top-down DP (memoization): wahi recursion, par har <code>ways(k)</code> ka answer <code>memo[k]</code> me save. Dobara puchha toh seedha memo se — har k sirf ek baar compute.', time: 'O(n)', space: 'O(n) (memo + stack)', code: R7[1] },
      { level: 'Optimal', idea: 'Bottom-up (tabulation) — chhote se bade: ways(1)=1, ways(2)=2, phir ways(i) = ways(i−1) + ways(i−2). Sirf last 2 values chahiye → do variables <code>prev2, prev1</code>.', time: 'O(n)', space: 'O(1)', code: R7[2] },
    ],
    viz: {
      title: 'Climbing Stairs — bottom-up, 2 variables',
      inputs: nInput,
      check: nCheck,
      run({ n }) {
        let prev2, prev1, i, cur;
        const ways = Array(n).fill(null); // ways[k-1] = ways(k) jo ab tak nikla (sirf dikhane ke liye)
        const V = () => Object.assign({ n }, prev2 !== undefined ? { prev2, prev1 } : {}, i !== undefined ? { i } : {}, cur !== undefined ? { cur } : {});
        const { st, steps } = K.tracer(R7[2], o => ({ views: [K.A('ways(1..n) — har stair ke ways (code sirf last 2 rakhta hai)', ways, o.hl, o.ptr)], vars: V() }));
        const P = () => (prev2 !== undefined && i !== undefined && i - 1 <= n ? { hl: { [i - 3]: 'done', [i - 2]: 'done' }, ptr: [{ i: i - 3, label: 'prev2' }, { i: i - 2, label: 'prev1' }] } : {});
        st('public int climbStairs', `Method call: n = ${n}`);
        if (n <= 2) {
          st('if (n <= 2)', `n = ${n} ≤ 2 → seedha answer: ${n} (1 stair → 1 tareeka, 2 stairs → 2 tareeke)`, { hl: { [n - 1]: 'found' }, ret: n });
          return steps;
        }
        st('if (n <= 2)', `n = ${n} > 2 → loop se banana padega`);
        prev2 = 1; prev1 = 2; ways[0] = 1; ways[1] = 2;
        st('int prev2 = 1, prev1 = 2', 'prev2 = ways(1) = 1, prev1 = ways(2) = 2 — base values', { hl: { 0: 'new', 1: 'new' }, ptr: [{ i: 0, label: 'prev2' }, { i: 1, label: 'prev1' }] });
        for (i = 3; ; i++) {
          if (!(i <= n)) { st('for (int i = 3', `i = ${i}: ${i} ≤ ${n} ✗ → loop khatam, prev1 = ways(${n})`, { hl: { [n - 1]: 'found' }, ptr: [{ i: n - 1, label: 'prev1' }] }); break; }
          cur = undefined;
          st('for (int i = 3', `i = ${i}: ${i} ≤ ${n} ✓ — ab ways(${i}) nikalna hai`, P());
          cur = prev1 + prev2; ways[i - 1] = cur;
          st('int cur = prev1 + prev2', `cur = ways(${i - 1}) + ways(${i - 2}) = ${prev1} + ${prev2} = ${cur}`, Object.assign(P(), { hl: { [i - 3]: 'done', [i - 2]: 'done', [i - 1]: 'new' } }));
          prev2 = prev1;
          st('prev2 = prev1', `prev2 = ${prev2} — window ek aage khiska (ab prev2 = ways(${i - 1}))`, { hl: { [i - 2]: 'cur', [i - 1]: 'new' }, ptr: [{ i: i - 2, label: 'prev2' }] });
          prev1 = cur;
          st('prev1 = cur', `prev1 = ${prev1} (= ways(${i}))`, { hl: { [i - 2]: 'cur', [i - 1]: 'cur' }, ptr: [{ i: i - 2, label: 'prev2' }, { i: i - 1, label: 'prev1' }] });
        }
        i = undefined; cur = undefined;
        st('return prev1', `return prev1 = ${prev1}`, { hl: { [n - 1]: 'found' }, ret: prev1 });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Plain recursion',
          run({ n }) {
            const cs = K.callStack();
            let calls = 0;
            const seen = {};
            const { S, steps } = recTracer(R7[0], cs, () => ({ views: [K.X('Total calls ab tak', calls), K.X('Kaunsa n kitni baar call hua', Object.keys(seen).sort((a, b) => b - a).map(k => `n=${k}: ${seen[k]}×`).join(', '))] }));
            const rec = (m, root) => {
              calls++; seen[m] = (seen[m] || 0) + 1;
              const loc = { n: m };
              cs.push('climbStairs', 'n = ' + m, () => Object.assign({}, loc));
              S('public int climbStairs', `climbStairs(${m}) call hua — call #${calls}` + (seen[m] > 1 ? ` (n = ${m} ${seen[m]}ᵗʰ baar! same kaam dobara)` : ''));
              if (m <= 2) {
                S('if (n <= 2)', `n = ${m} ≤ 2 → base case, return ${m}`, root ? { ret: m } : {});
                cs.pop(); return m;
              }
              S('if (n <= 2)', `n = ${m} > 2 → base nahi. Last move 1 ka ya 2 ka — dono gino`);
              S('return climbStairs(n - 1)', `Pehle climbStairs(${m - 1}) — last move 1 step ka tha`);
              const a = rec(m - 1);
              loc['ways(n-1)'] = a;
              S('return climbStairs(n - 1)', `climbStairs(${m - 1}) = ${a} wapas aaya. Ab climbStairs(${m - 2}) — last move 2 step ka`);
              const b = rec(m - 2);
              loc['ways(n-2)'] = b;
              S('return climbStairs(n - 1)', `${a} + ${b} = ${a + b} → return ${a + b}` + (root ? ` (total ${calls} calls)` : ''), root ? { ret: a + b } : {});
              cs.pop(); return a + b;
            };
            rec(n, true);
            return steps;
          },
        },
        {
          ap: 1, label: 'Memo (top-down)',
          run({ n }) {
            const cs = K.callStack();
            let memo = null;
            const { S, steps } = recTracer(R7[1], cs, o => ({ views: memo ? [K.A('memo (index = stairs, 0 = abhi nahi nikala)', memo, o.hl)] : [K.X('memo', 'abhi bana nahi')] }));
            const mainLoc = { n };
            cs.push('climbStairs', 'n = ' + n, () => Object.assign({}, mainLoc, memo ? { memo: K.iA(memo) } : {}));
            S('public int climbStairs', `Method call: n = ${n}`);
            memo = Array(n + 1).fill(0);
            S('int[] memo = new int[n + 1]', `memo = new int[${n + 1}] — sab 0, matlab koi answer abhi save nahi`);
            S('return ways(n, memo)', `ways(${n}, memo) call karte hain`);
            const rec = m => {
              const loc = { n: m };
              cs.push('ways', 'n = ' + m, () => Object.assign({}, loc, { 'memo[n]': m < memo.length ? memo[m] : '-' }));
              S('private int ways', `ways(${m}) call hua`, { hl: { [m]: 'cur' } });
              if (m <= 2) {
                S('if (n <= 2)', `n = ${m} ≤ 2 → base case, return ${m}`, { hl: { [m]: 'cur' } });
                cs.pop(); return m;
              }
              S('if (n <= 2)', `n = ${m} > 2 → base nahi`, { hl: { [m]: 'cur' } });
              if (memo[m] !== 0) {
                S('if (memo[n] != 0)', `memo[${m}] = ${memo[m]} ≠ 0 → MEMO HIT! Dobara calculate nahi, seedha return ${memo[m]}`, { hl: { [m]: 'found' } });
                cs.pop(); return memo[m];
              }
              S('if (memo[n] != 0)', `memo[${m}] = 0 → pehli baar, calculate karna padega`, { hl: { [m]: 'cur' } });
              S('memo[n] = ways', `ways(${m - 1}) call — last move 1 step ka`, { hl: { [m]: 'cur' } });
              const a = rec(m - 1);
              loc['ways(n-1)'] = a;
              S('memo[n] = ways', `ways(${m - 1}) = ${a}. Ab ways(${m - 2}) call — last move 2 step ka`, { hl: { [m]: 'cur' } });
              const b = rec(m - 2);
              loc['ways(n-2)'] = b;
              memo[m] = a + b;
              S('memo[n] = ways', `memo[${m}] = ${a} + ${b} = ${a + b} — save kar liya`, { hl: { [m]: 'new' } });
              S(['return memo[n];', 2], `return memo[${m}] = ${memo[m]}`, { hl: { [m]: 'done' } });
              cs.pop(); return memo[m];
            };
            const r = rec(n);
            S('return ways(n, memo)', `ways(${n}) = ${r} → return ${r}`, { hl: n < memo.length ? { [n]: 'found' } : {}, ret: r });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — DP: overlapping subproblems → memo → tabulation', blocks: [
        { p: '<b>Dynamic Programming (DP)</b> = recursion jisme <b>same chhota sawaal baar-baar</b> aata hai, toh uska jawab <b>ek baar nikal ke yaad rakh lo</b>. Do cheezein chahiye: (1) <b>optimal substructure</b> — bada answer chhote answers se banta hai (yahan <code>ways(n) = ways(n−1) + ways(n−2)</code>), (2) <b>overlapping subproblems</b> — wahi chhote answers baar-baar chahiye.' },
        { p: 'Day 6 ka <b>r6 Fibonacci</b> yaad karo — <code>fib(n) = fib(n−1) + fib(n−2)</code>. Climbing Stairs <b>bilkul wahi recurrence</b> hai, bas base alag: ways(1) = 1, ways(2) = 2. (ways(n) = fib(n+1).) Fibonacci me plain recursion ka call tree exponential tha — aaj usi ko DP se theek karenge.' },
        { pre: `climbStairs(5) ka call tree (plain recursion):
                 5
             /       \\
            4         3      <- 3 yahan bhi...
          /   \\      / \\
         3     2    2   1
        / \\
       2   1                  ...aur yahan bhi! same kaam 2 baar` },
        { table: { head: ['Step', 'Kya karte hain', 'Time', 'Space'], rows: [
          ['1. Recursion', 'Recurrence seedha likho', 'O(2ⁿ)', 'O(n) stack'],
          ['2. Memoization (top-down)', 'Wahi recursion + <code>memo[]</code>: pehle dekho save hai kya', 'O(n)', 'O(n) memo + O(n) stack'],
          ['3. Tabulation (bottom-up)', 'Recursion hatao; chhote se bade loop me table bharo', 'O(n)', 'O(n) table'],
          ['4. Space optimise', 'Agar sirf last k values chahiye → k variables', 'O(n)', 'O(1)'],
        ] } },
        { tip: '<b>DP ki recipe (har DP problem me):</b> state kya hai (yahan: kitne stairs bache) → recurrence (choices: 1 ya 2 step) → base case → order (chhote se bade). Aage ke saare DP lessons isi 4-step recipe pe chalenge.' },
      ] },
      { title: '📄 Problem — LC 70 Climbing Stairs', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: 'Recurrence kaise socha?' },
        { p: 'Top (stair n) pe <b>aakhri kadam</b> socho: ya toh stair n−1 se 1 step aaye, ya stair n−2 se 2 step. Dono alag tareeke hain, overlap nahi → <code>ways(n) = ways(n−1) + ways(n−2)</code>. Base: 1 stair → 1 tareeka, 2 stairs → 2 tareeke (1+1, 2).' },
        { h: '1. Brute — plain recursion' },
        { p: 'Recurrence seedha code me. Har call 2 calls karti hai → call tree ~2ⁿ nodes → <b>O(2ⁿ)</b> time, stack depth n → O(n) space. n = 45 pe ~10⁹+ calls — LeetCode pe <b>TLE</b>. Kyun slow? Call tree me <code>climbStairs(3)</code>, <code>climbStairs(2)</code> baar-baar compute ho rahe hain.' },
        { h: '2. Better — memoization (top-down DP)' },
        { p: 'Same recursion, bas ek <code>memo[]</code> array: pehle check karo <code>memo[n]</code> me answer hai kya; hai toh return, nahi toh calculate karke save. Ab har n sirf <b>ek baar</b> compute → <b>O(n)</b> time, O(n) space (memo + stack). Ye genuinely alag complexity hai — 2ⁿ se n.' },
        { h: '3. Optimal — bottom-up, 2 variables' },
        { p: 'Recursion upar se neeche jaata hai; ulta chalo — ways(1), ways(2) pata hain, phir ways(3), ways(4) … ways(n). Har naye value ke liye sirf <b>pichhle 2</b> chahiye, toh poora table bhi nahi — <code>prev2</code>, <code>prev1</code> do variables. <b>O(n)</b> time, <b>O(1)</b> space, aur recursion stack bhi gaya (stack overflow ka dar nahi).' },
        { tip: 'Interview flow: pehle recurrence bolo (aakhri kadam wala argument), phir "ye exponential hai kyunki subproblems overlap karte hain" → memo → bottom-up → O(1) space. Ye flow har 1-D DP pe repeat hota hai.' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — n = 5 (Optimal)', blocks: [
        { table: { head: ['i', 'cur = prev1 + prev2', 'prev2 (baad me)', 'prev1 (baad me)'], rows: [
          ['start', '—', '1 = ways(1)', '2 = ways(2)'],
          ['3', '2 + 1 = 3', '2', '3'],
          ['4', '3 + 2 = 5', '3', '5'],
          ['5', '5 + 3 = 8', '5', '<b>8</b>'],
        ] } },
        { p: 'i = 6 > 5 → loop khatam → <b>return prev1 = 8</b>.' },
        { p: '<b>Memo (Better) me n = 5:</b> ways(5) → ways(4) → ways(3) → ways(2)=2, ways(1)=1 → memo[3]=3 → ways(2)=2 → memo[4]=5 → <b>ways(3): memo hit = 3</b> → memo[5]=8. Brute me yahi ways(3) poora dobara chalta (9 calls vs memo ke 7).' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: R7[2] },
        { lines: [
          ['if (n <= 2) return n;', 'Base: 1 stair → 1, 2 stairs → 2. Ye check na ho toh n = 1 pe bhi prev1 = 2 return ho jaata — galat.'],
          ['int prev2 = 1, prev1 = 2;', 'prev2 = ways(i−2), prev1 = ways(i−1). Shuru me ways(1), ways(2).'],
          ['for (int i = 3; i <= n; i++)', 'Stair 3 se n tak, chhote se bade (bottom-up).'],
          ['int cur = prev1 + prev2;', 'Recurrence: ways(i) = ways(i−1) + ways(i−2).'],
          ['prev2 = prev1;', 'Window aage khiskao — pehle prev2 update (warna purana prev1 kho jayega).'],
          ['prev1 = cur;', 'Naya ways(i) ab prev1 hai.'],
          ['return prev1;', 'Loop ke baad prev1 = ways(n).'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 2 },
        { tip: 'Tabs: <b>Brute</b> (CALL STACK + 🌳 call tree dekho — n = 5 pe climbStairs(3) do baar), <b>Better</b> (memo array bharta hua aur "MEMO HIT" step), <b>Optimal</b> (prev2 / prev1 ek-ek aage khiskte hue). ✎ Input se n = 1..6 try karo.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          '<code>n = 1</code> → 1 (base case; loop chalta hi nahi).',
          '<code>n = 2</code> → 2 (base case).',
          '<code>n = 45</code> → 1836311903 — <code>int</code> me fit (max ~2.147×10⁹). n = 46+ hota toh <code>long</code> chahiye.',
          'Brute n = 45 pe TLE — interview me plain recursion pe mat ruko.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Base galat: <code>if (n == 0) return 1; if (n &lt; 0) return 0;</code> bhi sahi hai, par mix karke <code>n == 1 → 1</code> aur <code>n == 0 → 0</code> likhna → n = 2 pe 1 aayega (galat).',
          'Memo me "nahi nikala" ke liye 0 use kiya — yahan safe hai kyunki koi answer 0 nahi hota. Jahan 0 valid answer ho, wahan <code>-1</code> se fill karo.',
          'Optimal me update order ulta: <code>prev1 = cur; prev2 = prev1;</code> → dono same ho jaayenge.',
          'Memo array har call me naya banana (helper ke andar <code>new int[]</code>) → memo ka fayda hi gaya.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (recursion)', 'O(2ⁿ)', 'O(n)', 'har call 2 calls → exponential tree; stack depth n'],
          ['Better (memo)', 'O(n)', 'O(n)', 'har ways(k) ek baar; memo array + recursion stack'],
          ['Optimal (bottom-up, 2 vars)', 'O(n)', 'O(1)', 'ek loop; sirf prev2, prev1'],
        ] } },
        { tip: 'Brute ka exact count: calls(n) ≈ 1.6ⁿ (golden ratio), isliye "O(2ⁿ)" upper bound hai — interview me O(2ⁿ) bolna chalta hai.' },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['How did you get the recurrence?', 'Look at the last move: it was either a 1-step from stair n − 1 or a 2-step from stair n − 2. These sets of ways do not overlap, so ways(n) = ways(n − 1) + ways(n − 2).'],
          ['Why is plain recursion slow?', 'Each call branches into two and the same subproblems, like ways(3), are solved many times, so the call tree is exponential, about O(2^n).'],
          ['What makes this a DP problem?', 'Optimal substructure — the answer is built from smaller answers — and overlapping subproblems — the same smaller answers are needed repeatedly.'],
          ['Memoization vs tabulation?', 'Memoization is top-down recursion plus a cache; it only computes states that are reached but uses the call stack. Tabulation is bottom-up with a loop, no recursion and often easier to space-optimise.'],
          ['How do you get O(1) space?', 'ways(i) depends only on the previous two values, so I keep two variables and slide them forward instead of a full array.'],
          ['How is this related to Fibonacci?', 'It is the same recurrence with shifted base cases: ways(n) equals fib(n + 1).'],
          ['What if you could climb 1, 2 or 3 steps?', 'Add one more term: ways(n) = ways(n − 1) + ways(n − 2) + ways(n − 3), keeping three variables. For a general step set, sum over allowed steps.'],
          ['Can it be faster than O(n)?', 'Yes, using matrix exponentiation of the Fibonacci matrix in O(log n), or Binet’s formula, but O(n) is what interviewers expect here.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'To reach stair n, the last move came either from stair n minus one or n minus two, so ways of n equals ways of n minus one plus ways of n minus two, with ways of one equal to one and ways of two equal to two. Plain recursion is exponential because the same subproblems repeat, so I can memoize to get O(n). Even better, I build it bottom-up: since each value needs only the previous two, I keep two variables and loop from three to n. That is O(n) time and O(1) space.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['n = 6 ka answer?', '<b>13</b> (1, 2, 3, 5, 8, 13).'],
          ['Brute me climbStairs(5) kitni calls karta hai (khud ko mila ke)?', '<b>9</b>: calls(5) = 1 + calls(4) + calls(3) = 1 + 5 + 3.'],
          ['Memo version me <code>if (memo[n] != 0)</code> ko <code>if (n &lt;= 2)</code> se pehle rakh do toh kya hoga?', 'Answer same rahega — n ≤ 2 pe memo[n] 0 hi rehta hai, toh check fail hokar base case chalega. Bas ek extra check.'],
          ['1, 2 ya 3 steps allowed ho toh n = 4 ka answer?', '<b>7</b>: t(1)=1, t(2)=2, t(3)=4, t(4)=4+2+1=7.'],
        ] },
        { olist: ['Teeno versions (recursion, memo, 2-variable) 6 min me bina dekhe likho.', 'DP ki 4-step recipe (state → recurrence → base → order) is problem pe zor se bolo.'] },
      ] },
    ],
    checks: [
      '"Aakhri kadam" wala argument se recurrence bol sakta hoon',
      'Overlapping subproblems kya hain — call tree se samjha sakta hoon',
      'Recursion → memo → bottom-up → O(1) space ka safar bina dekhe likh sakta hoon',
      '30 sec ka English interview answer bol sakta hoon',
    ],
    memory: 'Aakhri kadam 1 ya 2 ⇒ ways(n) = ways(n−1) + ways(n−2). Repeat ho raha? Memo. Phir ulta loop, sirf 2 variables.',
    tests: [
      { run: 'System.out.print(o.climbStairs(1));', out: '1' },
      { run: 'System.out.print(o.climbStairs(2));', out: '2' },
      { run: 'System.out.print(o.climbStairs(3));', out: '3' },
      { run: 'System.out.print(o.climbStairs(5));', out: '8' },
      { run: 'System.out.print(o.climbStairs(10));', out: '89' },
      { run: 'System.out.print(o.climbStairs(30));', out: '1346269' },
    ],
  };
})();
