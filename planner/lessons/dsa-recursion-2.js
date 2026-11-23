// Planner lessons — Recursion part 2 (r8 Pow(x, n))
// Format: planner/LESSON_SPEC.md. Optimal tab K.callStack() use karta hai (CALL STACK panel + 🌳 call tree).
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  function recTracer(code, cs, render) {
    const find = K.finder(code);
    const { st, steps } = K.tracer(code, o => {
      const fr = cs.frames(o.line);
      return Object.assign({ vars: fr.length ? fr[0].vars : {}, frames: fr }, render(o));
    });
    const S = (snip, note, o) => st(snip, note, Object.assign({}, o, { line: find(snip) }));
    return { S, steps };
  }
  // double ko readable dikhao: 2 → 2.0, 4.410000000000001 → 4.41
  const fd = v => (Number.isInteger(v) ? v.toFixed(1) : String(+v.toPrecision(12)));
  const f5 = v => v.toFixed(5); // LeetCode style output

  // =====================================================================
  // r8 — Pow(x, n) (LC 50)
  // =====================================================================
  const R8 = [
    `public double myPow(double x, int n) {
    long N = n; // n = -2^31 ho toh -n int me overflow karta hai, isliye long
    if (N < 0) {
        x = 1 / x;
        N = -N;
    }
    double result = 1.0;
    for (long i = 0; i < N; i++) {
        result *= x;
    }
    return result;
}`,
    `public double myPow(double x, int n) {
    long N = n; // n = -2^31 ho toh -n int me overflow karta hai, isliye long
    if (N < 0) {
        x = 1 / x;
        N = -N;
    }
    return fastPow(x, N);
}

private double fastPow(double x, long n) {
    if (n == 0) return 1.0;
    double half = fastPow(x, n / 2);
    if (n % 2 == 0) return half * half;
    return half * half * x;
}`,
  ];
  const powInputs = [{ key: 'x', label: 'x (double)', def: '2.0', num: true }, { key: 'n', label: 'n (int)', def: '10', num: true }];
  const powCheck = ({ x, n }) => (!Number.isFinite(x) || !Number.isInteger(n) ? 'x number aur n integer chahiye.' : Math.abs(n) > 40 ? 'Visualizer ke liye |n| ≤ 40 lo (Brute loop |n| baar chalta hai).' : x === 0 && n <= 0 ? 'x = 0 ke saath n > 0 hona chahiye (problem constraint).' : '');

  L.r8 = {
    kind: 'dsa', title: 'Pow(x, n)', topic: 'Recursion', diff: 'M', lc: 50,
    url: 'https://leetcode.com/problems/powx-n/',
    pattern: 'Divide & conquer recursion (fast / binary exponentiation)',
    oneLine: 'xⁿ = (x^(n/2))² — half ek hi baar nikalo aur square karo; n odd ho toh ek extra x. n negative → x = 1/x, aur n ko long me rakho.',
    goal: '<code>x</code> ki power <code>n</code> nikalo, jahan n negative bhi ho sakta hai aur |n| 2³¹ tak. Asli seekh: <b>problem ko aadha karna</b> (divide & conquer) — n multiplications ki jagah sirf <b>log n</b>. Saath me do traps: <b>negative n</b> aur <b>Integer.MIN_VALUE overflow</b>.',
    problem: {
      statement: 'Implement <code>pow(x, n)</code>, which calculates <code>x</code> raised to the power <code>n</code> (i.e., <code>x<sup>n</sup></code>).',
      examples: [
        { input: 'x = 2.00000, n = 10', output: '1024.00000', explain: '2<sup>10</sup> = 1024. Recursion: 10 → 5 → 2 → 1 → 0 (even, odd, even, odd — dono branches dikhenge).', viz: { x: '2.0', n: '10' } },
        { input: 'x = 2.10000, n = 3', output: '9.26100', explain: '2.1<sup>3</sup> = 9.261.', viz: { x: '2.1', n: '3' } },
        { input: 'x = 2.00000, n = -2', output: '0.25000', explain: '2<sup>-2</sup> = 1/2<sup>2</sup> = 1/4 = 0.25', viz: { x: '2.0', n: '-2' } },
      ],
      constraints: ['-100.0 < x < 100.0', '-2^31 <= n <= 2^31 - 1', 'n is an integer.', 'Either x is not zero or n > 0.', '-10^4 <= x^n <= 10^4'],
    },
    approaches: [
      { level: 'Brute', idea: 'Negative n → <code>x = 1/x</code>, <code>N = −n</code> (long me). Phir <code>result</code> ko N baar x se multiply karo.', time: 'O(|n|)', space: 'O(1)', code: R8[0] },
      { level: 'Optimal', idea: 'Fast exponentiation (recursive halving): <code>half = x^(n/2)</code> ek baar nikalo; n even → <code>half·half</code>, odd → <code>half·half·x</code>. Har call n aadha → depth log n.', time: 'O(log |n|)', space: 'O(log |n|) (recursion stack)', code: R8[1] },
    ],
    viz: {
      title: 'Pow(x, n) — fast exponentiation (recursive halving)',
      inputs: powInputs,
      check: powCheck,
      run({ x, n }) {
        const cs = K.callStack();
        const results = [];
        const { S, steps } = recTracer(R8[1], cs, () => ({ views: [K.X('Wapas aaye results (neeche se upar)', results.length ? results.join('  →  ') : 'abhi koi call return nahi hui'), K.X('Recursion depth', cs.depth())] }));
        const main = { x: fd(x), n };
        cs.push('myPow', `x = ${fd(x)}, n = ${n}`, () => Object.assign({}, main));
        S('public double myPow', `Method call: x = ${fd(x)}, n = ${n}`);
        let N = n;
        main.N = N;
        S('long N = n', `N = ${N} (long — taaki -2³¹ ko positive kar sakein)`);
        if (N < 0) {
          S('if (N < 0)', `N = ${N} < 0 → x^(−k) = (1/x)^k`);
          x = 1 / x; main.x = fd(x);
          S('x = 1 / x', `x = 1 / ${fd(1 / x)} = ${fd(x)}`);
          N = -N; main.N = N;
          S('N = -N', `N = ${N} — ab positive`);
        } else {
          S('if (N < 0)', `N = ${N} ≥ 0 → koi badlaav nahi`);
        }
        S('return fastPow(x, N)', `fastPow(${fd(x)}, ${N}) call karte hain`);
        const rec = m => {
          const loc = { x: fd(x), n: m };
          cs.push('fastPow', `x = ${fd(x)}, n = ${m}`, () => Object.assign({}, loc));
          S('private double fastPow', `fastPow(${fd(x)}, ${m}) call hua`);
          if (m === 0) {
            S('if (n == 0)', `n = 0 → x⁰ = 1.0 return (base case)`);
            results.push(`x^0 = 1.0`);
            cs.pop(); return 1;
          }
          S('if (n == 0)', `n = ${m} ≠ 0 → aadhe se kaam chalao`);
          const h = Math.floor(m / 2);
          S('double half = fastPow', `half = fastPow(x, ${m} / 2 = ${h}) — pehle x^${h} nikalo`);
          const half = rec(h);
          loc.half = fd(half);
          S('double half = fastPow', `half = x^${h} = ${fd(half)} wapas aaya`);
          let r;
          if (m % 2 === 0) {
            r = half * half;
            S('if (n % 2 == 0)', `${m} even → half · half = ${fd(half)} · ${fd(half)} = ${fd(r)}`);
          } else {
            S('if (n % 2 == 0)', `${m} odd → ek x extra lagega`);
            r = half * half * x;
            S('return half * half * x', `half · half · x = ${fd(half)} · ${fd(half)} · ${fd(x)} = ${fd(r)}`);
          }
          results.push(`x^${m} = ${fd(r)}`);
          cs.pop(); return r;
        };
        const res = rec(N);
        S('return fastPow(x, N)', `fastPow = ${fd(res)} → return ${f5(res)}`, { ret: f5(res) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Loop |n| baar',
          run({ x, n }) {
            let N, result, i;
            const V = () => Object.assign({ x: fd(x), n }, N !== undefined ? { N } : {}, result !== undefined ? { result: fd(result) } : {}, i !== undefined ? { i } : {});
            const { st, steps } = K.tracer(R8[0], o => ({ views: [K.X('Multiplications ab tak', i === undefined ? 0 : Math.min(i, N)), K.X('result', result === undefined ? '-' : fd(result))], vars: V() }));
            st('public double myPow', `Method call: x = ${fd(x)}, n = ${n}`);
            N = n;
            st('long N = n', `N = ${N} (long me — -2³¹ ko negate karna safe)`);
            if (N < 0) {
              st('if (N < 0)', `N = ${N} < 0 → (1/x)^|n| banayenge`);
              x = 1 / x;
              st('x = 1 / x', `x = ${fd(x)}`);
              N = -N;
              st('N = -N', `N = ${N}`);
            } else {
              st('if (N < 0)', `N = ${N} ≥ 0 → seedha chalo`);
            }
            result = 1;
            st('double result = 1.0', 'result = 1.0 (multiplication ka identity)');
            for (i = 0; ; i++) {
              if (!(i < N)) { st('for (long i = 0', `i = ${i}: ${i} < ${N} ✗ → ${N} multiplications ho gaye`); break; }
              st('for (long i = 0', `i = ${i}: ${i} < ${N} ✓`);
              const before = result;
              result *= x;
              st('result *= x', `result = ${fd(before)} · ${fd(x)} = ${fd(result)}`);
            }
            st('return result', `return ${f5(result)}`, { ret: f5(result) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Divide & conquer: problem ko aadha karo', blocks: [
        { p: 'Ab tak recursion me (Day 6 ka r6 Fibonacci) har call problem ko <b>1 se chhota</b> karti thi (n → n−1). Aaj ka trick: problem ko <b>aadha</b> karo (n → n/2). Aadha karte rahoge toh sirf <b>log₂ n</b> steps me 0 tak pahunch jaoge — 2³¹ ke liye sirf ~31 calls!' },
        { pre: `x^10 = (x^5)^2          10 even
x^5  = (x^2)^2 · x      5 odd  -> ek x extra
x^2  = (x^1)^2          2 even
x^1  = (x^0)^2 · x      1 odd
x^0  = 1                base case

Calls: 10 -> 5 -> 2 -> 1 -> 0   (sirf 5, 10 multiplications nahi)` },
        { table: { head: ['n', 'Formula', 'Kyun'], rows: [
          ['0', '1', 'Base case: x⁰ = 1'],
          ['even', 'half · half', 'xⁿ = x^(n/2) · x^(n/2)'],
          ['odd', 'half · half · x', 'n/2 (integer division) neeche round hota hai, ek x bacha'],
          ['negative', '(1/x)^|n|', 'x^(−k) = 1 / x^k'],
        ] } },
        { tip: '<b>Sabse important:</b> <code>half</code> ko <b>ek baar</b> nikal ke variable me rakho. <code>fastPow(x, n/2) * fastPow(x, n/2)</code> likha toh har call 2 calls karegi → wapas O(n)!' },
      ] },
      { title: '📄 Problem — LC 50 Pow(x, n)', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — n baar multiply' },
        { p: '<code>result = 1</code>, phir |n| baar <code>result *= x</code>. Negative n ke liye pehle <code>x = 1/x</code> aur n ko positive karo. <b>O(|n|)</b> time, O(1) space. |n| = 2³¹ ≈ 2 × 10⁹ multiplications → LeetCode pe <b>TLE</b>.' },
        { p: '<b>Trap — Integer.MIN_VALUE:</b> int range −2³¹ … 2³¹−1 hai. <code>n = −2147483648</code> ka <code>−n</code> = 2147483648 int me fit nahi hota → overflow hoke <b>wapas −2147483648</b>! Isliye pehle <code>long N = n;</code> phir <code>N = −N</code>.' },
        { h: 'Better?' },
        { p: 'Yahan alag Better approach nahi hai — Brute (O(n)) ke baad seedha Optimal (O(log n)). Iterative binary exponentiation bhi O(log n) hi hai, wo Optimal ka doosra roop hai (Interview section me).' },
        { h: '2. Optimal — fast exponentiation (recursive halving)' },
        { p: 'xⁿ = x^(n/2) · x^(n/2) (even), aur odd me ek x extra. Toh <code>half = fastPow(x, n/2)</code> <b>ek baar</b> nikalo aur square karo. Har call n aadha → depth ~log₂|n| ≈ 31 → <b>O(log n)</b> time, <b>O(log n)</b> stack space.' },
        { tip: 'Order: pehle sign handle karo (myPow me), phir positive N ke saath fastPow chalao. Isse fastPow simple rehta hai — use negative ki fikar nahi.' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — x = 2.0, n = 10 (Optimal)', blocks: [
        { table: { head: ['Call', 'n', 'half = fastPow(x, n/2)', 'n even/odd', 'Return'], rows: [
          ['5', '0', '—', '—', '1.0 (base)'],
          ['4', '1', 'fastPow(2, 0) = 1', 'odd', '1 · 1 · 2 = 2'],
          ['3', '2', 'fastPow(2, 1) = 2', 'even', '2 · 2 = 4'],
          ['2', '5', 'fastPow(2, 2) = 4', 'odd', '4 · 4 · 2 = 32'],
          ['1', '10', 'fastPow(2, 5) = 32', 'even', '32 · 32 = <b>1024</b>'],
        ] } },
        { p: 'Table neeche se upar padho — wahi order jisme calls return hoti hain. Sirf 5 calls aur ~6 multiplications, 10 nahi.' },
        { p: '<b>n = −2:</b> myPow me x = 1/2 = 0.5, N = 2 → fastPow(0.5, 2) = (0.5)² = <b>0.25</b>.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: R8[1] },
        { lines: [
          ['long N = n;', 'int → long. n = −2³¹ ka negation int me overflow karta; long me 2³¹ aaram se fit.'],
          ['if (N < 0) {', 'Negative power: x^(−k) = (1/x)^k.'],
          ['x = 1 / x;', 'Base ulta karo. (Constraint: n ≤ 0 pe x ≠ 0, toh divide-by-zero nahi.)'],
          ['N = -N;', 'Ab N positive — long hai toh safe.'],
          ['return fastPow(x, N);', 'Asli kaam helper me, sirf positive N ke saath.'],
          ['if (n == 0) return 1.0;', 'Base case: x⁰ = 1.'],
          ['double half = fastPow(x, n / 2);', 'Aadhe power ka answer — sirf EK recursive call.'],
          ['if (n % 2 == 0) return half * half;', 'Even: x^n = half².'],
          ['return half * half * x;', 'Odd: n/2 neeche round hua tha, ek x extra.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Optimal tab me <b>CALL STACK</b> 10 → 5 → 2 → 1 → 0 tak bharta hai, phir results upar aate hain (🌳 call tree me ek seedhi line — branching nahi!). Brute tab me wahi answer 10 multiplications se. ✎ Input: <code>x = 3</code>, <code>n = 13</code> ya <code>x = 0.5</code>, <code>n = -3</code>.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          '<code>n = 0</code> → 1.0 (koi bhi x, constraint ke hisaab se x = 0 ke saath n = 0 nahi aata).',
          '<code>n = −2147483648</code> (Integer.MIN_VALUE) → <code>long</code> ke bina −n overflow; x = 1.0 pe answer 1.0, x = 2.0 pe ~0.0.',
          '<code>x = −2, n = 3</code> → −8.0 (odd power pe sign bachta hai — formula apne aap handle karta hai).',
          '<code>x = 1.0</code> ya <code>−1.0</code> aur bahut bada n → Brute TLE; Optimal 31 calls.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>return fastPow(x, n/2) * fastPow(x, n/2);</code> — do calls → O(n). Half ek baar variable me.',
          '<code>n = -n</code> int pe hi kar diya → MIN_VALUE pe wapas negative, infinite/galat recursion.',
          'Negative n bhool jaana — bina 1/x ke <code>fastPow(2, −1)</code>: half = fastPow(2, 0) = 1, −1 % 2 ≠ 0 → return 1·1·2 = <b>2</b>, jabki sahi answer 0.5 hai.',
          'Base case <code>n == 1 → x</code> rakha aur n = 0 handle nahi kiya → n = 0 input pe galat.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (loop)', 'O(|n|)', 'O(1)', '|n| multiplications'],
          ['Optimal (recursive halving)', 'O(log |n|)', 'O(log |n|)', 'har call n aadha; stack depth log n'],
          ['(Iterative binary exponentiation)', 'O(log |n|)', 'O(1)', 'Optimal ka loop version — bits of n pe chalta hai'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why is the recursive version O(log n)?', 'Each call halves n and makes only one recursive call, so there are about log2(n) calls, each doing constant work.'],
          ['Why must half be stored in a variable?', 'Calling fastPow(x, n/2) twice doubles the calls at each level, which brings the total back to O(n).'],
          ['How do you handle negative n?', 'Use x^(−n) = (1/x)^n: invert x and make the exponent positive before the main computation.'],
          ['What is the Integer.MIN_VALUE trap?', 'For n = −2^31, −n does not fit in an int and overflows back to −2^31. Converting n to a long before negating avoids it.'],
          ['Can you do it iteratively in O(1) space?', 'Yes, binary exponentiation: while N > 0, if N is odd multiply result by x; then square x and halve N. Same O(log n) time with O(1) space.'],
          ['What about x = 0?', 'The constraints say x is non-zero when n ≤ 0, so 1/x is safe. For n > 0, 0^n is 0 and the code returns that naturally.'],
          ['Are there precision issues with doubles?', 'Yes, repeated multiplication accumulates floating-point error, but fast exponentiation does fewer multiplications so it is usually more accurate than the loop.'],
          ['Where else is fast exponentiation used?', 'Modular exponentiation in hashing and cryptography, and matrix exponentiation, for example computing Fibonacci in O(log n).'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'The brute force multiplies x by itself n times, which is O(n) and too slow for n up to two to the thirty-one. Instead I use fast exponentiation: x to the n equals x to the n over two, squared, with one extra x when n is odd. I compute the half power once recursively and square it, so each call halves n, giving O(log n) time and O(log n) stack space. For negative n, I first convert n to a long to avoid the Integer.MIN_VALUE overflow, then invert x and negate n.'],
          ['Aise bolo — follow-up', 'If stack space matters, I can do the same thing iteratively by reading the bits of n: whenever the current bit is one I multiply the result by x, then square x and shift n right. That keeps O(log n) time with O(1) space.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['fastPow(x, 13) me kaunse n ke saath calls hongi?', '13 → 6 → 3 → 1 → 0 (5 calls).'],
          ['x = 3, n = 5 — dry run se return value?', 'n=0 → 1; n=1 → 1·1·3 = 3; n=2 → 3·3 = 9; n=5 → 9·9·3 = <b>243</b>.'],
          ['<code>int N = -n;</code> likha aur n = −2147483648 aaya — kya hoga?', 'Overflow: −(−2³¹) int me wapas −2³¹ → N negative hi raha → galat answer / recursion base tak sahi nahi pahunchta.'],
          ['Iterative version ka loop body likho.', '<code>if (N % 2 == 1) result *= x; x *= x; N /= 2;</code> — jab tak N &gt; 0.'],
        ] },
        { olist: ['Optimal code (myPow + fastPow) 5 min me bina dekhe likho — long N wali line mat bhoolna.', 'x = 2, n = 10 ka call stack kaagaz pe banao aur results neeche se upar bharo.'] },
      ] },
    ],
    checks: [
      'xⁿ = (x^(n/2))² (odd me · x) samjha sakta hoon',
      'Bata sakta hoon kyun half ko variable me rakhna zaroori hai',
      'Negative n aur Integer.MIN_VALUE trap (long N) handle kar sakta hoon',
      '30 sec ka English interview answer bol sakta hoon',
    ],
    memory: 'Aadha nikalo, square karo; odd ho toh · x. Negative? long N, x = 1/x, N = −N.',
    tests: [
      { run: 'System.out.print(String.format(Locale.US, "%.5f", o.myPow(2.0, 10)));', out: '1024.00000' },
      { run: 'System.out.print(String.format(Locale.US, "%.5f", o.myPow(2.1, 3)));', out: '9.26100' },
      { run: 'System.out.print(String.format(Locale.US, "%.5f", o.myPow(2.0, -2)));', out: '0.25000' },
      { run: 'System.out.print(String.format(Locale.US, "%.5f", o.myPow(-2.0, 3)));', out: '-8.00000' },
      { run: 'System.out.print(String.format(Locale.US, "%.5f", o.myPow(0.5, 0)));', out: '1.00000' },
      { run: 'System.out.print(String.format(Locale.US, "%.5f", o.myPow(3.0, 13)));', out: '1594323.00000' },
      { run: 'System.out.print(String.format(Locale.US, "%.5f", o.myPow(1.0, -2147483648)));', out: '1.00000' },
    ],
  };
})();
