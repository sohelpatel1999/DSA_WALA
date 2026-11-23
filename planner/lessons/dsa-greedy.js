// Planner lessons — Greedy (g1 Maximum Subarray (Kadane), g2 Best Time to Buy and Sell Stock)
// Format: dsa-arrays-two-pointers.js jaisa. Viz steps: lesson-kit.js tracer (har line = ek step, VARIABLES me saare locals).
// g1 Better (divide & conquer) recursion ke liye K.callStack() → CALL STACK panel + call tree.
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  const MIN = -2147483648, MAXV = 2147483647;
  const showMin = v => (v === MIN ? 'MIN_VALUE' : v);
  const showMax = v => (v === MAXV ? 'MAX_VALUE' : v);

  // =====================================================================
  // g1 — Maximum Subarray (Kadane) (LC 53)
  // =====================================================================
  const G1 = [
    `public int maxSubArray(int[] nums) {
    int best = Integer.MIN_VALUE;
    for (int i = 0; i < nums.length; i++) {
        int sum = 0;
        for (int j = i; j < nums.length; j++) {
            sum += nums[j];
            best = Math.max(best, sum);
        }
    }
    return best;
}`,
    `public int maxSubArray(int[] nums) {
    return solve(nums, 0, nums.length - 1);
}

private int solve(int[] nums, int lo, int hi) {
    if (lo == hi) return nums[lo];
    int mid = (lo + hi) / 2;
    int leftBest = solve(nums, lo, mid);
    int rightBest = solve(nums, mid + 1, hi);
    int sum = 0, leftMax = Integer.MIN_VALUE;
    for (int i = mid; i >= lo; i--) {
        sum += nums[i];
        leftMax = Math.max(leftMax, sum);
    }
    sum = 0;
    int rightMax = Integer.MIN_VALUE;
    for (int j = mid + 1; j <= hi; j++) {
        sum += nums[j];
        rightMax = Math.max(rightMax, sum);
    }
    return Math.max(Math.max(leftBest, rightBest), leftMax + rightMax);
}`,
    `public int maxSubArray(int[] nums) {
    int best = nums[0];
    int cur = 0; // abhi wale subarray ka sum
    for (int x : nums) {
        cur += x;
        best = Math.max(best, cur);
        if (cur < 0) cur = 0; // negative prefix = bojh, drop
    }
    return best;
}`,
  ];

  L.g1 = {
    kind: 'dsa', title: 'Maximum Subarray (Kadane)', topic: 'Greedy', diff: 'M', lc: 53,
    url: 'https://leetcode.com/problems/maximum-subarray/',
    pattern: 'Kadane (greedy: negative prefix drop karo)',
    oneLine: 'cur += x; best = max(best, cur); cur < 0 ho gaya toh cur = 0 — negative prefix aage kisi ke kaam ka nahi.',
    goal: 'Continuous subarray jiska sum <b>sabse bada</b> ho, uska sum return karo. Asli seekh: <b>greedy decision</b> — har step pe sirf ek sawaal: "ab tak ka chalta sum aage madad karega ya bojh hai?" Negative hai toh <b>drop</b>. Yahi Kadane hai, aur kal ka Stock problem (g2) isi ka cousin hai.',
    problem: {
      statement: 'Given an integer array <code>nums</code>, find the subarray with the largest sum, and return <i>its sum</i>.<br><br>A subarray is a contiguous <b>non-empty</b> sequence of elements within an array.<br><br><b>Follow up:</b> If you have figured out the <code>O(n)</code> solution, try coding another solution using the <b>divide and conquer</b> approach, which is more subtle.',
      examples: [
        { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explain: 'The subarray [4,-1,2,1] has the largest sum 6.', viz: { nums: '-2, 1, -3, 4, -1, 2, 1, -5, 4' } },
        { input: 'nums = [1]', output: '1', explain: 'The subarray [1] has the largest sum 1.', viz: { nums: '1' } },
        { input: 'nums = [5,4,-1,7,8]', output: '23', explain: 'The subarray [5,4,-1,7,8] has the largest sum 23.', viz: { nums: '5, 4, -1, 7, 8' } },
        { input: 'nums = [-3,-1,-2]', output: '-1', explain: 'Apna example: sab negative. Answer 0 nahi, −1 — subarray non-empty hona chahiye. Isliye best = nums[0] se shuru.', viz: { nums: '-3, -1, -2' } },
      ],
      constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    },
    approaches: [
      { level: 'Brute', idea: 'Har start i, end j ko badhate hue running sum; har subarray ka sum best se compare. (Teen loops wala O(n³) bhi brute hai — running sum se ek loop bacha.)', time: 'O(n²)', space: 'O(1)', code: G1[0] },
      { level: 'Better', idea: 'Divide & conquer: array ko mid pe todo. Answer ya toh poora left half me, ya right half me, ya mid ko <b>cross</b> karta hai. Cross wala = mid se left ka best suffix + mid+1 se right ka best prefix (O(n)). T(n) = 2T(n/2) + O(n).', time: 'O(n log n)', space: 'O(log n) (recursion stack)', code: G1[1] },
      { level: 'Optimal', idea: 'Kadane: ek pass, <code>cur</code> = abhi wale subarray ka sum. <code>cur += x</code>, best update, aur <code>cur &lt; 0</code> ho gaya toh 0 — negative prefix ke saath aage badhna hamesha nuksaan.', time: 'O(n)', space: 'O(1)', code: G1[2] },
    ],
    viz: {
      title: 'Maximum Subarray — Kadane (one pass)',
      inputs: [{ key: 'nums', label: 'nums', def: '-2, 1, -3, 4, -1, 2, 1, -5, 4' }],
      run({ nums }) {
        const n = nums.length;
        let best, cur, x, idx, runStart = 0, bL = 0, bR = 0;
        const V = () => Object.assign({ nums: K.iA(nums) }, best !== undefined ? { best } : {}, cur !== undefined ? { cur } : {}, x !== undefined ? { x } : {});
        const views = o => {
          const out = [K.A('nums', nums, o.hl, o.ptr)];
          if (best !== undefined) out.push(K.X('best subarray ab tak', `nums[${bL}..${bR}] = ${K.iA(nums.slice(bL, bR + 1))} → ${best}`));
          return out;
        };
        const { st, steps } = K.tracer(G1[2], o => ({ views: views(o), vars: V() }));
        const P = () => ({ hl: K.rng(runStart, idx, 'win', { [idx]: 'cur' }), ptr: [{ i: idx, label: 'x' }] });
        st('public int maxSubArray', `Method call: nums = ${K.iA(nums)}`);
        best = nums[0];
        st('int best = nums[0]', `best = nums[0] = ${best} — 0 nahi, kyunki sab negative bhi ho sakte hain`, { hl: { 0: 'found' } });
        cur = 0;
        st('int cur = 0', 'cur = 0 — abhi koi subarray chal nahi raha');
        for (idx = 0; idx < n; idx++) {
          x = nums[idx];
          st('for (int x : nums)', `x = nums[${idx}] = ${x}`, P());
          const prev = cur;
          cur += x;
          st('cur += x', `cur = ${prev} + ${x} = ${cur} → subarray nums[${runStart}..${idx}]`, P());
          if (cur > best) { best = cur; bL = runStart; bR = idx; st('best = Math.max', `max(best, ${cur}) → naya best = ${best}!`, { hl: K.rng(runStart, idx, 'found'), ptr: [{ i: idx, label: 'x' }] }); }
          else st('best = Math.max', `max(${best}, ${cur}) = ${best} — best wahi`, P());
          if (cur < 0) {
            st('if (cur < 0) cur = 0', `cur = ${cur} < 0 → ye prefix aage bojh hai → drop, cur = 0 (naya subarray index ${idx + 1} se)`, { hl: K.rng(runStart, idx, 'skip'), ptr: [{ i: idx, label: 'x' }] });
            cur = 0; runStart = idx + 1;
          } else st('if (cur < 0) cur = 0', `cur = ${cur} ≥ 0 → rakh lo, aage wale ko madad karega`, P());
        }
        x = undefined;
        st('for (int x : nums)', 'Saare elements ho gaye → loop khatam', { hl: K.rng(bL, bR, 'found') });
        st('return best', `return best = ${best} (subarray nums[${bL}..${bR}])`, { hl: K.rng(bL, bR, 'found'), ret: String(best) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Har subarray',
          run({ nums }) {
            const n = nums.length;
            let best, i, sum, j;
            const V = () => {
              const v = { nums: K.iA(nums) };
              if (best !== undefined) v.best = showMin(best);
              if (i !== undefined) v.i = i;
              if (sum !== undefined) v.sum = sum;
              if (j !== undefined) v.j = j;
              return v;
            };
            const { st, steps } = K.tracer(G1[0], o => ({ views: [K.A('nums', nums, o.hl, o.ptr)], vars: V() }));
            const W = cls => ({ hl: K.rng(i, j, cls || 'win'), ptr: [{ i, label: 'i' }, { i: j, label: 'j' }] });
            st('public int maxSubArray', `Method call: nums = ${K.iA(nums)}`);
            best = MIN;
            st('int best = Integer.MIN_VALUE', 'best = Integer.MIN_VALUE — koi bhi sum isse bada hoga');
            for (i = 0; ; i++) {
              if (!(i < n)) { st('for (int i', `i = ${i}: ${i} < ${n} ✗ → saare start ho gaye`); break; }
              sum = undefined; j = undefined;
              st('for (int i', `i = ${i}: ${i} < ${n} ✓`, { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] });
              sum = 0;
              st('int sum = 0', 'sum = 0 — naya start', { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] });
              for (j = i; ; j++) {
                if (!(j < n)) { st('for (int j', `j = ${j}: ${j} < ${n} ✗ → is i ke subarrays khatam`, { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] }); break; }
                st('for (int j', `j = ${j}: ${j} < ${n} ✓ — subarray nums[${i}..${j}]`, W());
                const prev = sum;
                sum += nums[j];
                st('sum += nums[j]', `sum = ${prev} + ${nums[j]} = ${sum}`, W());
                const old = best;
                best = Math.max(best, sum);
                st('best = Math.max', best !== old ? `max(${showMin(old)}, ${sum}) = ${best} → naya best!` : `max(${old}, ${sum}) = ${best}`, W(best !== old ? 'found' : 'win'));
              }
            }
            i = undefined; sum = undefined; j = undefined;
            st('return best', `return best = ${best}`, { ret: String(best) });
            return steps;
          },
        },
        {
          ap: 1, label: 'Divide & conquer',
          run({ nums }) {
            const n = nums.length, code = G1[1], find = K.finder(code), cs = K.callStack(), fs = [];
            const loc = F => {
              const v = { lo: F.lo, hi: F.hi };
              ['mid', 'leftBest', 'rightBest', 'sum', 'leftMax', 'rightMax', 'i', 'j'].forEach(key => { if (F[key] !== undefined) v[key] = showMin(F[key]); });
              return v;
            };
            const { st, steps } = K.tracer(code, o => {
              const F = fs[fs.length - 1];
              const base = F ? K.rng(F.lo, F.hi, 'win') : {};
              const ptr = F && F.mid !== undefined ? [{ i: F.mid, label: 'mid' }] : [];
              const frames = cs.frames(o.ln);
              return { views: [K.A('nums', nums, Object.assign(base, o.hl || {}), ptr)], vars: frames[0].vars, frames };
            });
            const S = (snip, note, o) => st(snip, note, Object.assign({ ln: find(snip) }, o || {}));
            const solve = (lo, hi) => {
              const F = { lo, hi };
              fs.push(F);
              cs.push('solve', `nums, lo=${lo}, hi=${hi}`, () => loc(F));
              S('private int solve', `solve(lo = ${lo}, hi = ${hi}) — range ${K.iA(nums.slice(lo, hi + 1))}`);
              const done = res => { fs.pop(); cs.pop(); return res; };
              if (lo === hi) { S('if (lo == hi) return', `lo == hi → ek hi element → return nums[${lo}] = ${nums[lo]}`, { hl: { [lo]: 'found' } }); return done(nums[lo]); }
              S('if (lo == hi) return', `lo (${lo}) ≠ hi (${hi}) → aadha-aadha todo`);
              F.mid = Math.floor((lo + hi) / 2);
              S('int mid', `mid = (${lo} + ${hi}) / 2 = ${F.mid}`);
              S('int leftBest = solve', `Left half: solve(${lo}, ${F.mid}) call`, { hl: K.rng(lo, F.mid, 'cur') });
              F.leftBest = solve(lo, F.mid);
              S('int leftBest = solve', `Wapas aaye: leftBest = ${F.leftBest}`);
              S('int rightBest = solve', `Right half: solve(${F.mid + 1}, ${hi}) call`, { hl: K.rng(F.mid + 1, hi, 'cur') });
              F.rightBest = solve(F.mid + 1, hi);
              S('int rightBest = solve', `Wapas aaye: rightBest = ${F.rightBest}`);
              F.sum = 0; F.leftMax = MIN;
              S('int sum = 0, leftMax', 'Ab crossing subarray: mid se left ki taraf best suffix dhoondho');
              for (F.i = F.mid; ; F.i--) {
                if (!(F.i >= lo)) { S('for (int i = mid', `i = ${F.i} < lo (${lo}) → left scan khatam, leftMax = ${F.leftMax}`); break; }
                S('for (int i = mid', `i = ${F.i} ≥ ${lo} ✓`, { hl: K.rng(F.i, F.mid, 'cur') });
                const p = F.sum;
                F.sum += nums[F.i];
                S('sum += nums[i]', `sum = ${p} + ${nums[F.i]} = ${F.sum} (nums[${F.i}..${F.mid}])`, { hl: K.rng(F.i, F.mid, 'cur') });
                const old = F.leftMax;
                F.leftMax = Math.max(F.leftMax, F.sum);
                S('leftMax = Math.max', `leftMax = max(${showMin(old)}, ${F.sum}) = ${F.leftMax}`, { hl: K.rng(F.i, F.mid, 'cur') });
              }
              F.i = undefined;
              F.sum = 0;
              S('sum = 0;', 'sum = 0 — ab mid+1 se right ki taraf best prefix');
              F.rightMax = MIN;
              S('int rightMax', 'rightMax = MIN_VALUE');
              for (F.j = F.mid + 1; ; F.j++) {
                if (!(F.j <= hi)) { S('for (int j = mid + 1', `j = ${F.j} > hi (${hi}) → right scan khatam, rightMax = ${F.rightMax}`); break; }
                S('for (int j = mid + 1', `j = ${F.j} ≤ ${hi} ✓`, { hl: K.rng(F.mid + 1, F.j, 'cur') });
                const p = F.sum;
                F.sum += nums[F.j];
                S('sum += nums[j]', `sum = ${p} + ${nums[F.j]} = ${F.sum} (nums[${F.mid + 1}..${F.j}])`, { hl: K.rng(F.mid + 1, F.j, 'cur') });
                const old = F.rightMax;
                F.rightMax = Math.max(F.rightMax, F.sum);
                S('rightMax = Math.max', `rightMax = max(${showMin(old)}, ${F.sum}) = ${F.rightMax}`, { hl: K.rng(F.mid + 1, F.j, 'cur') });
              }
              F.j = undefined;
              const cross = F.leftMax + F.rightMax, res = Math.max(F.leftBest, F.rightBest, cross);
              S('return Math.max(Math.max', `max(leftBest ${F.leftBest}, rightBest ${F.rightBest}, cross ${F.leftMax} + ${F.rightMax} = ${cross}) = ${res} → return`);
              return done(res);
            };
            cs.push('maxSubArray', `nums=${K.iA(nums)}`, () => ({ nums: K.iA(nums) }));
            S('public int maxSubArray', `Method call: nums = ${K.iA(nums)}`);
            S('return solve(nums, 0', `solve(nums, 0, ${n - 1}) — poore array pe`);
            const ans = solve(0, n - 1);
            S('return solve(nums, 0', `solve ne ${ans} diya → return ${ans}`, { ret: String(ans) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Greedy: "ab tak ka sum madad hai ya bojh?"', blocks: [
        { p: '<b>Greedy</b> = har step pe local best decision lo, aur proof ho ki wo global best tak le jaata hai. Kadane me decision: index j pe khatam hone wala best subarray ya toh <b>sirf nums[j]</b> hai, ya <b>(j−1 pe khatam best) + nums[j]</b>. Pichla hissa negative hai toh usse jodna hamesha nuksaan → chhod do.' },
        { pre: `nums: [-2,  1, -3,  4, -1,  2,  1, -5,  4]
cur:   -2→0  1  -2→0  4   3   5   6   1   5
best:  -2    1   1    4   4   5   6   6   6     → 6  ([4,-1,2,1])` },
        { p: 'Prefix sum (h4) se connection: subarray sum = P[j] − P[i]. Max chahiye toh har j pe <b>sabse chhota pehle wala prefix</b> ghatao. Kadane ka <code>cur = 0</code> reset wahi kaam karta hai — jab cur negative hua, matlab naya "sabse chhota prefix" mila. (Kal g2 me yahi "min so far" seedha dikhega.)' },
        { tip: '<b>best = nums[0], 0 nahi.</b> Subarray non-empty hona chahiye. [−3, −1, −2] ka answer −1 hai; best = 0 se shuru kiya toh galat 0 aayega.' },
      ] },
      { title: '📄 Problem — LC 53 Maximum Subarray', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — har subarray' },
        { p: 'Har (i, j) ka sum. Teen loops O(n³); start fix karke running sum se <b>O(n²)</b>, O(1) space. n = 10⁵ pe 5×10⁹ — TLE pakka.' },
        { h: '2. Better — divide & conquer' },
        { p: 'Mid pe todo. Best subarray teen me se ek jagah hai: (a) poora left half, (b) poora right half, (c) mid ko cross karta hua. (a), (b) recursion se. (c) ke liye mid se left jaate hue best suffix sum + mid+1 se right jaate hue best prefix sum — ek linear scan. T(n) = 2T(n/2) + O(n) = <b>O(n log n)</b> (merge sort jaisa), O(log n) stack. LeetCode ka follow-up yahi maangta hai.' },
        { h: '3. Optimal — Kadane' },
        { p: 'Brute me har start i ke liye dobara se sum shuru hota hai. Par agar <code>nums[i..j]</code> ka sum negative ho gaya, toh j+1 se aage jo bhi subarray banega, uske aage ye negative hissa lagana use <b>chhota</b> hi karega — toh us start ko chhod ke j+1 se naya start lo. Ek pass, do variables: <b>O(n)</b>, O(1).' },
        { tip: 'Classic likhaawat <code>cur = Math.max(x, cur + x)</code> bhi same hai: cur + x &lt; x ⇔ cur &lt; 0 ⇔ drop. Dono interview me chalte hain.' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4] (Kadane)', blocks: [
        { table: { head: ['x', 'cur += x', 'best', 'cur < 0?', 'cur (baad)'], rows: [
          ['−2', '−2', '−2', 'haan → drop', '0'],
          ['1', '1', '1', 'nahi', '1'],
          ['−3', '−2', '1', 'haan → drop', '0'],
          ['4', '4', '4', 'nahi', '4'],
          ['−1', '3', '4', 'nahi', '3'],
          ['2', '5', '5', 'nahi', '5'],
          ['1', '6', '<b>6</b>', 'nahi', '6'],
          ['−5', '1', '6', 'nahi', '1'],
          ['4', '5', '6', 'nahi', '5'],
        ] } },
        { p: 'Return <b>6</b>. Dhyaan do: −1 aane pe drop nahi kiya kyunki cur = 3 abhi bhi positive tha — aage 2, 1 ke saath 6 bana.' },
        { p: '<b>Divide & conquer</b> (Better) ek level: [−2,1,−3,4,−1,2,1,−5,4], mid = 4. leftBest(0..4) = 4, rightBest(5..8) = 4 (2+1+(−5)+4 = 2, [2,1] = 3, [4] = 4 → 4), cross = best suffix ending at 4 ([4,−1] = 3) + best prefix from 5 ([2,1] = 3) = 6 → max = <b>6</b>.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: G1[2] },
        { lines: [
          ['int best = nums[0];', 'Answer kam se kam ek element ka subarray hai — sab negative ho tab bhi sahi.'],
          ['int cur = 0;', 'Abhi chal rahe subarray ka sum (khaali = 0).'],
          ['for (int x : nums)', 'Ek pass.'],
          ['cur += x;', 'x ko current subarray me jodo — ab cur = x pe khatam best subarray ka sum.'],
          ['best = Math.max(best, cur);', 'Reset se PEHLE update — taaki all-negative me bhi best = sabse bada element aaye.'],
          ['if (cur < 0) cur = 0;', 'Negative prefix aage sirf nuksaan karega → drop, agla element naya start.'],
          ['return best;', 'Sabse bada sum.'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute → Better (divide &amp; conquer, CALL STACK + 🌳 call tree) → Optimal</b>. Kadane tab me grey (skip) hissa = drop hua prefix. Apna input: <code>-1, 3, -2, 5, -7, 4</code> (answer 6).' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Ek element <code>[1]</code> → 1; <code>[−1]</code> → −1.',
          'Sab negative <code>[−3,−1,−2]</code> → −1 (sabse bada element).',
          'Sab positive <code>[5,4,−1,7,8]</code> jaisa → lagbhag poora array; drop kabhi nahi hota.',
          'Overflow: |sum| ≤ 10⁵ × 10⁴ = 10⁹ → <code>int</code> me fit.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>best = 0</code> se shuru → all-negative pe 0 (galat).',
          'Reset pehle, best update baad me → all-negative pe best 0 ban jaata hai.',
          '<code>cur &lt;= 0</code> ya <code>cur &lt; 0</code> — dono sahi, par <code>cur &lt; x</code> jaisa ulta condition mat likho.',
          'D&amp;C me cross ke liye sirf <code>nums[mid] + nums[mid+1]</code> le lena — poora best suffix + best prefix chahiye.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (running sum)', 'O(n²)', 'O(1)', 'n(n+1)/2 subarrays'],
          ['Better (divide & conquer)', 'O(n log n)', 'O(log n)', 'har level pe O(n) cross scan, log n levels; recursion stack'],
          ['Optimal (Kadane)', 'O(n)', 'O(1)', 'ek pass, do variables'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why is it safe to reset the running sum when it goes negative?', 'A negative prefix can only reduce the sum of any subarray that continues from it, so the best subarray starting later never wants it.'],
          ['Why initialise best with nums[0] instead of 0?', 'The subarray must be non-empty. If all numbers are negative, the answer is the largest element, not 0.'],
          ['How do you return the start and end indices too?', 'Track a tentative start that moves to i + 1 on reset, and copy it with the current index whenever best improves.'],
          ['Why is this called greedy (or DP)?', 'At each index we keep only the best sum ending here: max(x, prev + x). That is a one-variable DP, and the reset is the greedy choice.'],
          ['Explain the divide and conquer solution.', 'Split at mid; the answer is the best of the left half, the right half, or a crossing subarray made of the best suffix of the left and best prefix of the right. That is O(n log n).'],
          ['When would divide and conquer be useful?', 'With a segment tree storing sum, best prefix, best suffix and best answer per node, it answers range max-subarray queries with updates in O(log n).'],
          ['How does this extend to a circular array (LC 918)?', 'Answer is max(normal Kadane, total sum − minimum subarray), unless all numbers are negative, then just normal Kadane.'],
          ['Time and space complexity of Kadane?', 'O(n) time, one pass, and O(1) extra space.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'The brute force checks every subarray with a running sum, which is O(n squared). Kadane keeps the sum of the current subarray. For each element I add it to the current sum and update the best answer. If the current sum becomes negative, it can only hurt anything that follows, so I reset it to zero and start fresh from the next element. I initialise best with the first element so an all-negative array is handled. This is O(n) time and O(1) space. A divide and conquer version is O(n log n), splitting at the middle and combining the best crossing sum.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [−1, 3, −2, 5, −7, 4] — answer aur subarray?', '<b>6</b> = [3, −2, 5].'],
          ['Reset ko best update se pehle rakh diya toh [−2, −1] ka answer?', '<b>0</b> — galat (sahi −1). Isliye pehle best, phir reset.'],
          ['[2, −1, 2] me −1 aane pe cur kya hoga — drop hoga?', 'cur = 2 − 1 = 1 ≥ 0 → drop nahi. Phir 1 + 2 = 3 → answer <b>3</b>.'],
          ['D&amp;C ka recurrence aur complexity?', 'T(n) = 2T(n/2) + O(n) → <b>O(n log n)</b>.'],
        ] },
        { olist: ['Kadane 3 min me bina dekhe likho.', 'Dry run table example 1 ka khud banao.', 'D&amp;C ka "teen jagah answer" wala logic 30 sec me bolo.'] },
      ] },
    ],
    checks: [
      'Brute, Better (D&amp;C) aur Kadane — teeno ka idea + complexity bol sakta hoon',
      'Samjha sakta hoon negative prefix drop karna kyun safe hai',
      'best = nums[0] aur "pehle best, phir reset" ka reason pakka',
      'Kadane 3 min me bina dekhe likh sakta hoon',
    ],
    memory: 'cur += x; best = max(best, cur); cur < 0 → cur = 0. best = nums[0] se shuru.',
    tests: [
      { run: 'System.out.print(o.maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4}));', out: '6' },
      { run: 'System.out.print(o.maxSubArray(new int[]{1}));', out: '1' },
      { run: 'System.out.print(o.maxSubArray(new int[]{5,4,-1,7,8}));', out: '23' },
      { run: 'System.out.print(o.maxSubArray(new int[]{-3,-1,-2}));', out: '-1' },
      { run: 'System.out.print(o.maxSubArray(new int[]{-2,-1}));', out: '-1' },
      { run: 'System.out.print(o.maxSubArray(new int[]{-1,3,-2,5,-7,4}));', out: '6' },
    ],
  };

  // =====================================================================
  // g2 — Best Time to Buy and Sell Stock (LC 121)
  // =====================================================================
  const G2 = [
    `public int maxProfit(int[] prices) {
    int maxProfit = 0;
    for (int buy = 0; buy < prices.length; buy++) {
        for (int sell = buy + 1; sell < prices.length; sell++) {
            maxProfit = Math.max(maxProfit, prices[sell] - prices[buy]);
        }
    }
    return maxProfit;
}`,
    `public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE; // ab tak ka sabse sasta din
    int maxProfit = 0;
    for (int price : prices) {
        minPrice = Math.min(minPrice, price);
        maxProfit = Math.max(maxProfit, price - minPrice);
    }
    return maxProfit;
}`,
  ];

  L.g2 = {
    kind: 'dsa', title: 'Best Time to Buy and Sell Stock', topic: 'Greedy', diff: 'E', lc: 121,
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    pattern: 'Greedy (min so far)',
    oneLine: 'Har din socho "aaj becha toh?" — sabse accha buy = ab tak ka sabse sasta din. minPrice track karo, profit = price − minPrice.',
    goal: 'Ek din kharido, <b>baad ke</b> kisi din becho — max profit (nahi ho sakta toh 0). Asli seekh: <b>"min so far"</b> greedy — har din pe sirf ek number yaad rakho (ab tak ka sabse sasta), toh pairs check karne ki zaroorat khatam. Ye Kadane (g1) ka hi roop hai.',
    problem: {
      statement: 'You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.<br><br>You want to maximize your profit by choosing a <b>single day</b> to buy one stock and choosing a <b>different day in the future</b> to sell that stock.<br><br>Return <i>the maximum profit you can achieve from this transaction</i>. If you cannot achieve any profit, return <code>0</code>.',
      examples: [
        { input: 'prices = [7,1,5,3,6,4]', output: '5', explain: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5. Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.', viz: { prices: '7, 1, 5, 3, 6, 4' } },
        { input: 'prices = [7,6,4,3,1]', output: '0', explain: 'In this case, no transactions are done and the max profit = 0.', viz: { prices: '7, 6, 4, 3, 1' } },
        { input: 'prices = [2,4,1]', output: '2', explain: 'Apna example: baad me 1 (naya min) aaya, par uske baad bechne ka din nahi. Purana profit 4 − 2 = 2 hi rehta hai — global min pe kharidna zaroori nahi.', viz: { prices: '2, 4, 1' } },
      ],
      constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    },
    approaches: [
      { level: 'Brute', idea: 'Har (buy, sell > buy) pair ka profit, max rakho.', time: 'O(n²)', space: 'O(1)', code: G2[0] },
      { level: 'Optimal', idea: 'Ek pass: minPrice = ab tak ka sabse sasta din. Har din: pehle minPrice update, phir aaj bechne ka profit <code>price − minPrice</code> se maxProfit update.', time: 'O(n)', space: 'O(1)', code: G2[1] },
    ],
    viz: {
      title: 'Best Time to Buy and Sell Stock — min so far',
      inputs: [{ key: 'prices', label: 'prices', def: '7, 1, 5, 3, 6, 4' }],
      run({ prices }) {
        const n = prices.length;
        let minPrice, maxProfit, price, idx, minIdx = -1, bB = -1, bS = -1;
        const V = () => Object.assign({ prices: K.iA(prices) }, minPrice !== undefined ? { minPrice: showMax(minPrice) } : {}, maxProfit !== undefined ? { maxProfit } : {}, price !== undefined ? { price } : {});
        const views = o => {
          const out = [K.A('prices', prices, o.hl, o.ptr)];
          if (maxProfit !== undefined) out.push(K.X('best deal ab tak', bB < 0 ? 'koi profit wala deal nahi (0)' : `buy day ${bB} (${prices[bB]}) → sell day ${bS} (${prices[bS]}) = ${maxProfit}`));
          return out;
        };
        const { st, steps } = K.tracer(G2[1], o => ({ views: views(o), vars: V() }));
        const P = () => {
          const hl = K.rng(0, idx - 1, 'done', {});
          if (minIdx >= 0) hl[minIdx] = 'win';
          hl[idx] = 'cur';
          const ptr = [{ i: idx, label: 'price' }];
          if (minIdx >= 0 && minIdx !== idx) ptr.push({ i: minIdx, label: 'min' });
          return { hl, ptr };
        };
        st('public int maxProfit', `Method call: prices = ${K.iA(prices)}`);
        minPrice = MAXV;
        st('int minPrice', 'minPrice = Integer.MAX_VALUE — pehla din hi isse sasta hoga');
        maxProfit = 0;
        st('int maxProfit = 0', 'maxProfit = 0 — koi deal na karo toh 0');
        for (idx = 0; idx < n; idx++) {
          price = prices[idx];
          st('for (int price', `Din ${idx}: price = ${price}`, P());
          const oldMin = minPrice;
          if (price < minPrice) { minPrice = price; minIdx = idx; }
          st('minPrice = Math.min', minPrice !== oldMin ? `min(${showMax(oldMin)}, ${price}) = ${minPrice} → naya sabse sasta din (${idx})` : `min(${oldMin}, ${price}) = ${minPrice} — sasta din wahi (${minIdx})`, P());
          const profit = price - minPrice, oldP = maxProfit;
          if (profit > maxProfit) { maxProfit = profit; bB = minIdx; bS = idx; }
          st('maxProfit = Math.max', maxProfit !== oldP
            ? `aaj becha: ${price} − ${minPrice} = ${profit} > ${oldP} → maxProfit = ${maxProfit}!`
            : `aaj becha: ${price} − ${minPrice} = ${profit} → maxProfit wahi ${maxProfit}`, maxProfit !== oldP ? { hl: { [minIdx]: 'found', [idx]: 'found' }, ptr: [{ i: idx, label: 'sell' }, { i: minIdx, label: 'buy' }] } : P());
        }
        price = undefined;
        st('for (int price', 'Saare din ho gaye → loop khatam', { hl: bB >= 0 ? { [bB]: 'found', [bS]: 'found' } : {} });
        st('return maxProfit', `return maxProfit = ${maxProfit}`, { hl: bB >= 0 ? { [bB]: 'found', [bS]: 'found' } : {}, ret: String(maxProfit) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Har (buy, sell) pair',
          run({ prices }) {
            const n = prices.length;
            let maxProfit, buy, sell;
            const V = () => Object.assign({ prices: K.iA(prices) }, maxProfit !== undefined ? { maxProfit } : {}, buy !== undefined ? { buy } : {}, sell !== undefined ? { sell } : {});
            const { st, steps } = K.tracer(G2[0], o => ({ views: [K.A('prices', prices, o.hl, o.ptr)], vars: V() }));
            st('public int maxProfit', `Method call: prices = ${K.iA(prices)}`);
            maxProfit = 0;
            st('int maxProfit = 0', 'maxProfit = 0');
            for (buy = 0; ; buy++) {
              if (!(buy < n)) { st('for (int buy', `buy = ${buy}: ${buy} < ${n} ✗ → saare buy din ho gaye`); break; }
              sell = undefined;
              st('for (int buy', `buy = ${buy}: ${buy} < ${n} ✓ — din ${buy} pe ${prices[buy]} me kharido`, { hl: { [buy]: 'cur' }, ptr: [{ i: buy, label: 'buy' }] });
              for (sell = buy + 1; ; sell++) {
                const PT = [{ i: buy, label: 'buy' }, { i: sell, label: 'sell' }];
                if (!(sell < n)) { st('for (int sell', `sell = ${sell}: ${sell} < ${n} ✗ → is buy ke saare sell din ho gaye`, { hl: { [buy]: 'cur' }, ptr: [{ i: buy, label: 'buy' }] }); break; }
                st('for (int sell', `sell = ${sell}: ${sell} < ${n} ✓`, { hl: { [buy]: 'cur', [sell]: 'win' }, ptr: PT });
                const profit = prices[sell] - prices[buy], old = maxProfit;
                maxProfit = Math.max(maxProfit, profit);
                st('maxProfit = Math.max', maxProfit !== old ? `${prices[sell]} − ${prices[buy]} = ${profit} > ${old} → maxProfit = ${maxProfit}!` : `${prices[sell]} − ${prices[buy]} = ${profit} → maxProfit wahi ${maxProfit}`, { hl: { [buy]: maxProfit !== old ? 'found' : 'cur', [sell]: maxProfit !== old ? 'found' : 'win' }, ptr: PT });
              }
            }
            buy = undefined; sell = undefined;
            st('return maxProfit', `return maxProfit = ${maxProfit}`, { ret: String(maxProfit) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Greedy "min so far": har din ek hi sawaal', blocks: [
        { p: 'Agar aaj (din j) bechna hai, toh best buy = din 0..j me <b>sabse sasta</b> din. Toh har j pe pairs check karne ki jagah sirf ek number yaad rakho: <code>minPrice</code>. Profit(j) = <code>prices[j] − minPrice</code>, aur answer = sab din ka max.' },
        { pre: `prices:    [7, 1, 5, 3, 6, 4]
minPrice:   7  1  1  1  1  1
profit:     0  0  4  2  5  3     → max = 5 (buy 1, sell 6)` },
        { p: '<b>Kadane (g1) se connection:</b> roz ka badlaav <code>d[i] = prices[i] − prices[i−1]</code> lo. Day a pe kharid ke b pe bechna = d[a+1] + … + d[b] — yaani ek subarray ka sum! Max profit = d pe max subarray (0 se kam nahi). [7,1,5,3,6,4] → d = [−6, 4, −2, 3, −2] → best = 4 − 2 + 3 = 5.' },
        { tip: '<b>Order dhyaan:</b> buy pehle, sell baad me. Isliye "min so far" — sirf <b>pichle</b> din ka min. Array ka global min aur global max le lena galat hai ([2, 4, 1] me global min 1 sabse last hai).' },
      ] },
      { title: '📄 Problem — LC 121 Best Time to Buy and Sell Stock', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — har pair' },
        { p: 'Do loops: buy, sell > buy, profit = prices[sell] − prices[buy], max rakho. <b>O(n²)</b>, O(1). n = 10⁵ pe 5×10⁹ — TLE.' },
        { h: 'Better?' },
        { p: 'Yahan genuine Better nahi hai (sort karna order tod deta hai — buy pehle hona chahiye). Brute ke baad seedha Optimal.' },
        { h: '2. Optimal — min so far, ek pass' },
        { p: 'Brute ka inner loop asal me "is sell din ke liye sabse sasta pichla buy kaunsa?" dhoondh raha hai. Wo jawab ek variable me chalte-chalte rakh sakte ho: <code>minPrice = min(minPrice, price)</code>. Phir <code>maxProfit = max(maxProfit, price − minPrice)</code>. <b>O(n)</b>, O(1).' },
        { tip: 'minPrice pehle update karo, phir profit — same din buy-sell = 0 profit, jo safe hai (negative kabhi nahi aata).' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — prices = [7, 1, 5, 3, 6, 4] (Optimal)', blocks: [
        { table: { head: ['Din', 'price', 'minPrice (baad)', 'price − minPrice', 'maxProfit'], rows: [
          ['0', '7', '7', '0', '0'],
          ['1', '1', '1', '0', '0'],
          ['2', '5', '1', '4', '4'],
          ['3', '3', '1', '2', '4'],
          ['4', '6', '1', '5', '<b>5</b>'],
          ['5', '4', '1', '3', '5'],
        ] } },
        { p: 'Return <b>5</b>. <b>Example 2</b> [7, 6, 4, 3, 1]: har din naya min banta hai, profit hamesha 0 → return <b>0</b>.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: G2[1] },
        { lines: [
          ['int minPrice = Integer.MAX_VALUE;', 'Ab tak ka sabse sasta price; MAX_VALUE taaki pehla din hi min ban jaaye.'],
          ['int maxProfit = 0;', 'Koi deal nahi = 0 profit (problem ka rule).'],
          ['for (int price : prices)', 'Har din ek baar.'],
          ['minPrice = Math.min(minPrice, price);', 'Aaj tak ka sabse sasta buy din.'],
          ['maxProfit = Math.max(maxProfit, price - minPrice);', 'Aaj becha toh kitna? Best se compare.'],
          ['return maxProfit;', 'Max profit (0 ya zyada).'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute → Optimal</b>. "min" pointer dekho — wo sirf peeche ke din pe hota hai. Apna input: <code>3, 2, 6, 5, 0, 3</code> (answer 4).' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Ek din <code>[5]</code> → 0 (bechne ka din hi nahi).',
          'Girte daam <code>[7,6,4,3,1]</code> → 0.',
          'Sab same <code>[3,3]</code> → 0.',
          'Global min last me <code>[2,4,1]</code> → 2 (global max − global min = galat).',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>max(prices) − min(prices)</code> — order ignore ho jaata hai.',
          'maxProfit ko <code>Integer.MIN_VALUE</code> se shuru karna → loss wale case me negative answer.',
          'minPrice ko <code>prices[0]</code> se shuru karke loop index 1 se — chalta hai, par empty-safe nahi; MAX_VALUE wala saaf hai.',
          'Multiple transactions (LC 122) ke saath confuse karna — yahan sirf <b>ek</b> buy aur ek sell.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (har pair)', 'O(n²)', 'O(1)', 'n(n−1)/2 pairs'],
          ['Optimal (min so far)', 'O(n)', 'O(1)', 'ek pass, do variables'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why is max minus min of the whole array wrong?', 'The minimum may come after the maximum, and you must buy before you sell, so only the minimum so far is valid.'],
          ['Why update minPrice before computing profit?', 'It makes same-day buy and sell give 0, so profit is never negative, and the order of the two lines stays simple.'],
          ['How is this related to Kadane?', 'Profit from day a to b is the sum of daily differences between them, so the answer is the maximum subarray of the difference array, floored at 0.'],
          ['How would you also return the buy and sell days?', 'Store the index of the current minimum, and when maxProfit improves, record that index as buy and the current day as sell.'],
          ['What if unlimited transactions are allowed (LC 122)?', 'Add every positive daily difference: buy before each rise and sell at its end. O(n).'],
          ['What about at most two transactions (LC 123)?', 'Track four states: first buy, first sell, second buy, second sell, updated per day in O(n), or best profit left of i plus right of i.'],
          ['What if there is a cooldown or transaction fee?', 'Use a small state machine DP with hold / not-hold states per day; the fee is subtracted when selling.'],
          ['Time and space complexity?', 'O(n) time with one pass and O(1) extra space.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'The brute force tries every buy and sell pair, which is O(n squared). For any sell day, the best buy day is the cheapest day before it. So I scan once, keep the minimum price seen so far, and at each day compute the profit of selling today, price minus that minimum, updating the maximum profit. If prices only fall, the profit stays zero. That is O(n) time and O(1) space. It is also Kadane on the daily price differences.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['prices = [3, 2, 6, 5, 0, 3] — answer aur kaunse din?', '<b>4</b>: buy din 1 (2), sell din 2 (6). Baad ka 0 → 3 sirf 3 deta hai.'],
          ['[2, 4, 1] pe max − min karoge toh?', '4 − 1 = 3 — galat, kyunki 1 sabse last hai. Sahi <b>2</b>.'],
          ['[7, 1, 5, 3, 6, 4] ka difference array aur uska max subarray?', 'd = [−6, 4, −2, 3, −2]; max subarray [4, −2, 3] = <b>5</b> — same answer.'],
        ] },
        { olist: ['Optimal code 2 min me bina dekhe likho.', 'Kadane connection 30 sec me English me bolo.'] },
      ] },
    ],
    checks: [
      'Brute aur min-so-far ka idea + complexity bol sakta hoon',
      'Samjha sakta hoon global max − min kyun galat hai',
      'Kadane (g1) se connection difference array ke saath bata sakta hoon',
      'Optimal code 2 min me bina dekhe likh sakta hoon',
    ],
    memory: 'minPrice = min(minPrice, p); maxProfit = max(maxProfit, p − minPrice).',
    tests: [
      { run: 'System.out.print(o.maxProfit(new int[]{7,1,5,3,6,4}));', out: '5' },
      { run: 'System.out.print(o.maxProfit(new int[]{7,6,4,3,1}));', out: '0' },
      { run: 'System.out.print(o.maxProfit(new int[]{2,4,1}));', out: '2' },
      { run: 'System.out.print(o.maxProfit(new int[]{5}));', out: '0' },
      { run: 'System.out.print(o.maxProfit(new int[]{3,2,6,5,0,3}));', out: '4' },
    ],
  };
})();
