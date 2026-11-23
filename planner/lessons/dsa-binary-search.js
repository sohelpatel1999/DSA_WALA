// Planner lessons — Binary Search (b1 Binary Search, b2 Lower Bound / Search Insert Position)
// Format: planner/LESSON_SPEC.md. Viz steps: lesson-kit.js tracer (har line = ek step).
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  // lo..hi range highlight (baaki 'skip'), mid 'cur'
  const rangeHl = (n, lo, hi, extra) => {
    const o = {};
    for (let k = 0; k < n; k++) o[k] = k >= lo && k <= hi ? 'win' : 'skip';
    return Object.assign(o, extra || {});
  };
  const bsPtr = (n, lo, hi, mid) => {
    const p = [];
    if (lo >= 0 && lo < n) p.push({ i: lo, label: 'lo' });
    if (hi >= 0 && hi < n) p.push({ i: hi, label: 'hi' });
    if (mid !== undefined) p.push({ i: mid, label: 'mid' });
    return p;
  };
  const sortedCheck = ({ nums }) => (nums.every((v, k) => k === 0 || nums[k - 1] < v) ? '' : 'nums strictly ascending (sorted, distinct) hona chahiye.');

  // =====================================================================
  // b1 — Binary Search (LC 704)
  // =====================================================================
  const B1 = [
    `public int search(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) return i;
    }
    return -1;
}`,
    `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2; // (lo + hi) / 2 overflow kar sakta hai
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
  ];
  const bsInputs = [{ key: 'nums', label: 'nums (sorted)', def: '-1, 0, 3, 5, 9, 12' }, { key: 'target', label: 'target', def: '9', num: true }];

  L.b1 = {
    kind: 'dsa', title: 'Binary Search', topic: 'Binary Search', diff: 'E', lc: 704,
    url: 'https://leetcode.com/problems/binary-search/',
    pattern: 'Binary search (classic, closed interval [lo, hi])',
    oneLine: 'Sorted array: mid dekho — barabar → mil gaya; chhota → right half (lo = mid + 1); bada → left half (hi = mid − 1). Har step me aadha range gaya.',
    goal: 'Sorted array me <code>target</code> ka index dhoondo, warna −1 — <b>O(log n)</b> me. Asli seekh: <b>har comparison pe aadha search space phenk dena</b>, aur bina bug ke likhna: <code>lo &lt;= hi</code>, <code>mid = lo + (hi − lo) / 2</code>, <code>mid ± 1</code>.',
    problem: {
      statement: 'Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, then return its index. Otherwise, return <code>-1</code>.<br><br>You must write an algorithm with <code>O(log n)</code> runtime complexity.',
      examples: [
        { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explain: '9 exists in nums and its index is 4', viz: { nums: '-1, 0, 3, 5, 9, 12', target: '9' } },
        { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explain: '2 does not exist in nums so return -1. (Yahan <code>hi = mid − 1</code> aur <code>lo = mid + 1</code> dono chalenge, phir lo &gt; hi.)', viz: { nums: '-1, 0, 3, 5, 9, 12', target: '2' } },
      ],
      constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All the integers in nums are unique.', 'nums is sorted in ascending order.'],
    },
    approaches: [
      { level: 'Brute', idea: 'Left se right har element check karo; mila toh index, warna −1. Sorted hone ka fayda nahi uthaya.', time: 'O(n)', space: 'O(1)', code: B1[0] },
      { level: 'Optimal', idea: 'Iterative binary search: range [lo, hi]; <code>mid</code> pe compare — barabar → return, <code>nums[mid] &lt; target</code> → left half bekaar (lo = mid + 1), warna right half bekaar (hi = mid − 1).', time: 'O(log n)', space: 'O(1)', code: B1[1] },
    ],
    viz: {
      title: 'Binary Search — lo / mid / hi',
      inputs: bsInputs,
      check: sortedCheck,
      run({ nums, target }) {
        const n = nums.length;
        let lo, hi, mid;
        const V = () => Object.assign({ nums: K.iA(nums), target }, lo !== undefined ? { lo, hi } : {}, mid !== undefined ? { mid } : {});
        const { st, steps } = K.tracer(B1[1], o => ({ views: [K.A('nums', nums, o.hl, o.ptr), K.X('search range', lo === undefined ? '-' : lo <= hi ? `[${lo} .. ${hi}] → ${hi - lo + 1} elements bache` : `khaali (lo = ${lo} > hi = ${hi})`)], vars: V() }));
        const P = extra => ({ hl: rangeHl(n, lo, hi, extra), ptr: bsPtr(n, lo, hi, mid) });
        st('public int search', `Method call: nums = ${K.iA(nums)}, target = ${target}`);
        lo = 0; hi = n - 1;
        st('int lo = 0, hi', `lo = 0, hi = ${hi} — poora array search range`, P());
        while (true) {
          if (!(lo <= hi)) { mid = undefined; st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✗ → range khaali, target nahi mila`, { hl: rangeHl(n, lo, hi), ptr: bsPtr(n, lo, hi) }); break; }
          mid = undefined;
          st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✓ — range me ${hi - lo + 1} elements`, P());
          mid = lo + Math.floor((hi - lo) / 2);
          st('int mid = lo + (hi - lo) / 2', `mid = ${lo} + (${hi} − ${lo}) / 2 = ${mid} → nums[${mid}] = ${nums[mid]}`, P({ [mid]: 'cur' }));
          if (nums[mid] === target) {
            st('if (nums[mid] == target)', `nums[${mid}] = ${nums[mid]} == ${target} ✓ → return ${mid}`, Object.assign(P({ [mid]: 'found' }), { ret: mid }));
            return steps;
          }
          st('if (nums[mid] == target)', `nums[${mid}] = ${nums[mid]} ≠ ${target}`, P({ [mid]: 'cur' }));
          if (nums[mid] < target) {
            const old = lo;
            lo = mid + 1;
            st('else if (nums[mid] < target)', `${nums[mid]} < ${target} → target right me hai; index ${old}..${mid} phenko → lo = ${lo}`, P());
          } else {
            st('else if (nums[mid] < target)', `${nums[mid]} > ${target} → right half bekaar`, P({ [mid]: 'cur' }));
            const old = hi;
            hi = mid - 1;
            st('else hi = mid - 1', `index ${mid}..${old} phenko → hi = ${hi}`, P());
          }
        }
        st('return -1', `target ${target} array me nahi → return -1`, { hl: rangeHl(n, lo, hi), ret: -1 });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Linear scan',
          run({ nums, target }) {
            let i;
            const V = () => Object.assign({ nums: K.iA(nums), target }, i !== undefined ? { i } : {});
            const { st, steps } = K.tracer(B1[0], o => ({ views: [K.A('nums', nums, o.hl, o.ptr), K.X('comparisons', i === undefined ? 0 : Math.min(i + 1, nums.length))], vars: V() }));
            st('public int search', `Method call: nums = ${K.iA(nums)}, target = ${target}`);
            for (i = 0; ; i++) {
              if (!(i < nums.length)) { st('for (int i', `i = ${i}: ${i} < ${nums.length} ✗ → poora array dekh liya`, { hl: K.rng(0, nums.length - 1, 'skip') }); break; }
              st('for (int i', `i = ${i}: ${i} < ${nums.length} ✓`, { hl: K.rng(0, i - 1, 'skip', { [i]: 'cur' }), ptr: [{ i, label: 'i' }] });
              if (nums[i] === target) { st('if (nums[i] == target)', `nums[${i}] = ${nums[i]} == ${target} ✓ → return ${i}`, { hl: K.rng(0, i - 1, 'skip', { [i]: 'found' }), ptr: [{ i, label: 'i' }], ret: i }); return steps; }
              st('if (nums[i] == target)', `nums[${i}] = ${nums[i]} ≠ ${target}`, { hl: K.rng(0, i - 1, 'skip', { [i]: 'cur' }), ptr: [{ i, label: 'i' }] });
            }
            st('return -1', `Nahi mila → return -1 (${nums.length} comparisons lage)`, { ret: -1 });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Binary search: har step me aadha phenko', blocks: [
        { p: 'Dictionary me "mango" dhoondhte waqt page 1 se nahi padhte — beech me kholte ho, "m" se pehle hai ya baad, aur aadha book chhod dete ho. Yahi <b>binary search</b> hai. Shart: data <b>sorted</b> (ya koi monotonic condition) ho, taaki ek comparison se pata chale target kis half me hai.' },
        { p: 'n = 10⁴ → log₂ ≈ 14 comparisons; n = 10⁹ → sirf ~30. Linear scan 10⁹. (a6 Max Consecutive Ones III ke Better approach me "binary search on answer" ki jhalak dekhi thi — aaj basic template pakka karenge, aage ke saare BS problems isi pe.)' },
        { table: { head: ['Template part', 'Kyun'], rows: [
          ['<code>lo = 0, hi = n − 1</code>', 'Closed interval [lo, hi] — dono ends abhi candidates hain'],
          ['<code>while (lo &lt;= hi)</code>', '<code>=</code> zaroori: lo == hi pe bhi ek element check karna baaki hai'],
          ['<code>mid = lo + (hi − lo) / 2</code>', '<code>(lo + hi) / 2</code> me lo + hi int overflow kar sakta hai (dono ~2³⁰ ho toh sum &gt; 2³¹−1)'],
          ['<code>lo = mid + 1</code> / <code>hi = mid − 1</code>', 'mid check ho chuka — use range se bahar karo, warna infinite loop'],
        ] } },
        { tip: '<b>Overflow ka example:</b> lo = 1,500,000,000, hi = 2,000,000,000 → lo + hi = 3.5 × 10⁹ &gt; 2,147,483,647 → negative ho jaata hai! <code>lo + (hi − lo) / 2</code> me pehle difference, jo kabhi overflow nahi karta. (Java me <code>(lo + hi) &gt;&gt;&gt; 1</code> bhi chalta hai.)' },
      ] },
      { title: '📄 Problem — LC 704 Binary Search', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — linear scan' },
        { p: 'Har index check karo. <b>O(n)</b> time, O(1) space. Kaam karta hai, par problem khud <b>O(log n)</b> maangta hai — aur sorted hone ki jaankari waste ki.' },
        { h: 'Better?' },
        { p: 'Yahan alag Better approach nahi hai — Brute ke baad seedha Optimal. <b>Recursive binary search</b> same idea hai (same O(log n) time, ulta O(log n) stack space) — wo Better nahi, bas Optimal ka doosra roop hai.' },
        { h: '2. Optimal — iterative binary search' },
        { p: 'Sorted hai, toh <code>nums[mid]</code> dekh ke pata chalta hai: <code>nums[mid] &lt; target</code> → mid aur uske left wale sab chhote → phenko (<code>lo = mid + 1</code>). <code>nums[mid] &gt; target</code> → mid aur right sab bade → phenko (<code>hi = mid − 1</code>). Har step range aadha → <b>O(log n)</b>, O(1) space.' },
        { tip: 'Loop invariant bolo: "agar target array me hai, toh wo hamesha [lo, hi] ke andar hai." Range khaali (lo &gt; hi) ho gaya → target nahi hai → −1.' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [-1, 0, 3, 5, 9, 12] (Optimal)', blocks: [
        { p: '<b>target = 9</b>' },
        { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'Compare', 'Action'], rows: [
          ['0', '5', '2', '3', '3 &lt; 9', 'lo = 3'],
          ['3', '5', '4', '9', '<b>9 == 9</b>', 'return <b>4</b>'],
        ] } },
        { p: '<b>target = 2</b>' },
        { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'Compare', 'Action'], rows: [
          ['0', '5', '2', '3', '3 &gt; 2', 'hi = 1'],
          ['0', '1', '0', '-1', '-1 &lt; 2', 'lo = 1'],
          ['1', '1', '1', '0', '0 &lt; 2', 'lo = 2'],
          ['2', '1', '—', '—', 'lo &gt; hi', 'return <b>-1</b>'],
        ] } },
        { tip: 'Teesri row: lo == hi == 1 — agar <code>while (lo &lt; hi)</code> likha hota toh ye last element check hi nahi hota. Isliye <code>&lt;=</code>.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: B1[1] },
        { lines: [
          ['int lo = 0, hi = nums.length - 1;', 'Search range = poora array, closed interval [lo, hi].'],
          ['while (lo <= hi)', 'Jab tak range me kam se kam 1 element hai.'],
          ['int mid = lo + (hi - lo) / 2;', 'Beech ka index, overflow-safe.'],
          ['if (nums[mid] == target) return mid;', 'Mil gaya.'],
          ['else if (nums[mid] < target) lo = mid + 1;', 'mid chhota → target right me; mid samet left half phenko.'],
          ['else hi = mid - 1;', 'mid bada → target left me; mid samet right half phenko.'],
          ['return -1;', 'Range khaali — target nahi hai.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 1 },
        { tip: 'Optimal tab me grey (skip) cells = phenka hua half, highlighted = abhi ka [lo, hi]. Brute tab me same input pe comparisons gino. ✎ Input: <code>1, 3, 5, 7, 9, 11, 13, 15</code> target <code>15</code> — Brute 8 comparisons, Optimal 4.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Ek element: <code>[5]</code>, target 5 → 0; target −5 → −1 (lo == hi wala case — <code>&lt;=</code> zaroori).',
          'Target pehla / aakhri element: <code>[1,3,5,7,9,11]</code> target 1 → 0, target 11 → 5.',
          'Target sabse chhote se chhota ya sabse bade se bada → loop range khaali karke −1.',
          'Negatives: binary search ko sign se farak nahi, sirf order se.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>while (lo &lt; hi)</code> with <code>hi = n − 1</code> → last bacha element check nahi hota.',
          '<code>lo = mid</code> / <code>hi = mid</code> (±1 ke bina) → lo, hi atak jaate hain → infinite loop.',
          '<code>mid = (lo + hi) / 2</code> — bade index pe overflow (LeetCode constraints me nahi hoga, par interviewer puchta hai).',
          'Unsorted array pe binary search lagana.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (linear)', 'O(n)', 'O(1)', 'worst case har element dekho'],
          ['Optimal (iterative BS)', 'O(log n)', 'O(1)', 'har step range aadha; sirf lo, hi, mid'],
          ['(Recursive BS)', 'O(log n)', 'O(log n)', 'same idea, par call stack'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why lo + (hi − lo) / 2 instead of (lo + hi) / 2?', 'lo + hi can exceed Integer.MAX_VALUE and overflow to a negative number; hi − lo never overflows, so the result stays in range.'],
          ['Why is the condition lo <= hi and not lo < hi?', 'With a closed interval [lo, hi], when lo == hi there is still one candidate to check. Using < would skip it.'],
          ['Why mid + 1 and mid − 1?', 'mid has already been compared, so we exclude it; otherwise the range may stop shrinking and loop forever.'],
          ['What is the loop invariant?', 'If the target exists, it is always within [lo, hi]. When the range becomes empty, the target is not present.'],
          ['Recursive or iterative?', 'Both are O(log n) time, but recursion uses O(log n) stack space; iterative is O(1) space and is preferred.'],
          ['What if there are duplicates and you need the first occurrence?', 'When nums[mid] == target, record mid and continue searching left with hi = mid − 1 — that is the lower-bound pattern.'],
          ['Can binary search work on unsorted data?', 'Not directly. It needs a monotonic property; for example, binary search on the answer works when a condition flips from false to true once.'],
          ['How many comparisons for n = 10^6?', 'About log2(10^6) ≈ 20 in the worst case.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Since the array is sorted, I use binary search. I keep a closed range lo to hi, compute mid as lo plus hi minus lo over two to avoid overflow, and compare nums at mid with the target. If equal, I return mid. If it is smaller, the target can only be to the right, so lo becomes mid plus one; otherwise hi becomes mid minus one. When lo passes hi, the target is not present and I return minus one. That is O(log n) time and O(1) space.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [1, 3, 5, 7, 9, 11, 13], target = 13 — mid values kis order me?', 'mid = 3 (7), mid = 5 (11), mid = 6 (13) → return <b>6</b>.'],
          ['<code>hi = mid</code> likha (−1 ke bina) — <code>[1, 3]</code>, target 0 pe kya hoga?', 'lo = 0, hi = 1 → mid = 0, 1 &gt; 0 → hi = 0; lo = 0, hi = 0 → mid = 0 → hi = 0 … <b>infinite loop</b>.'],
          ['n = 1024 pe worst case kitne loop iterations?', '<b>11</b> (1024 → 512 → … → 1 → khaali).'],
        ] },
        { olist: ['Template 2 min me bina dekhe likho — lo &lt;= hi, overflow-safe mid, ±1.', 'Dry run table khud banao: target = 2 wala example.'] },
      ] },
    ],
    checks: [
      'Template (lo <= hi, mid formula, ±1) ka har part kyun hai — bol sakta hoon',
      'mid overflow kyun hota hai, example ke saath samjha sakta hoon',
      'Code 2 min me bina dekhe likh sakta hoon',
      '30 sec ka English interview answer bol sakta hoon',
    ],
    memory: 'lo <= hi; mid = lo + (hi − lo)/2; chhota → lo = mid + 1, bada → hi = mid − 1; range khaali → −1.',
    tests: [
      { run: 'System.out.print(o.search(new int[]{-1,0,3,5,9,12}, 9));', out: '4' },
      { run: 'System.out.print(o.search(new int[]{-1,0,3,5,9,12}, 2));', out: '-1' },
      { run: 'System.out.print(o.search(new int[]{5}, 5));', out: '0' },
      { run: 'System.out.print(o.search(new int[]{5}, -5));', out: '-1' },
      { run: 'System.out.print(o.search(new int[]{1,3,5,7,9,11}, 1));', out: '0' },
      { run: 'System.out.print(o.search(new int[]{1,3,5,7,9,11}, 11));', out: '5' },
      { run: 'System.out.print(o.search(new int[]{1,3,5,7,9,11}, 12));', out: '-1' },
    ],
  };

  // =====================================================================
  // b2 — Lower Bound (Search Insert Position, LC 35)
  // =====================================================================
  const B2 = [
    `public int searchInsert(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] >= target) return i;
    }
    return nums.length;
}`,
    `public int searchInsert(int[] nums, int target) {
    int n = nums.length;
    int lo = 0, hi = n - 1;
    int ans = n; // koi bhi nums[i] >= target nahi mila toh end me insert
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] >= target) {
            ans = mid;     // candidate mila, left me aur chhota index dhoondo
            hi = mid - 1;
        } else {
            lo = mid + 1;
        }
    }
    return ans;
}`,
  ];

  L.b2 = {
    kind: 'dsa', title: 'Lower Bound (Search Insert Position)', topic: 'Binary Search', diff: 'E', lc: 35,
    url: 'https://leetcode.com/problems/search-insert-position/',
    pattern: 'Binary search — lower bound (first index with nums[i] >= target)',
    oneLine: 'Lower bound = pehla index jahan nums[i] ≥ target. mid ≥ target → ans = mid, aur left me dhoondo (hi = mid − 1); warna lo = mid + 1. ans shuru me n.',
    goal: 'Sorted array me target ka index, aur nahi hai toh wo index jahan insert karne pe order bana rahe. Asli seekh: ye exactly <b>lower bound</b> hai — "pehla index jahan <code>nums[i] &gt;= target</code>". Kal ke binary search me sirf ek badlaav: mil jaane pe ruko mat, <b>answer note karo aur left me dhoondte raho</b>.',
    problem: {
      statement: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.<br><br>You must write an algorithm with <code>O(log n)</code> runtime complexity.',
      examples: [
        { input: 'nums = [1,3,5,6], target = 5', output: '2', explain: '5 index 2 pe mila — pehla index jahan nums[i] ≥ 5.', viz: { nums: '1, 3, 5, 6', target: '5' } },
        { input: 'nums = [1,3,5,6], target = 2', output: '1', explain: '2 nahi hai; 1 ke baad aur 3 se pehle aayega → index 1 (pehla nums[i] ≥ 2 hai 3, index 1).', viz: { nums: '1, 3, 5, 6', target: '2' } },
        { input: 'nums = [1,3,5,6], target = 7', output: '4', explain: 'Sab chhote hain → end me insert → index 4 = n. (ans = n wala default yahin kaam aata hai.)', viz: { nums: '1, 3, 5, 6', target: '7' } },
      ],
      constraints: ['1 <= nums.length <= 10^4', '-10^4 <= nums[i] <= 10^4', 'nums contains distinct values sorted in ascending order.', '-10^4 <= target <= 10^4'],
    },
    approaches: [
      { level: 'Brute', idea: 'Left se scan: pehla index jahan <code>nums[i] &gt;= target</code> wahi answer. Koi nahi mila → <code>n</code> (end me insert).', time: 'O(n)', space: 'O(1)', code: B2[0] },
      { level: 'Optimal', idea: 'Lower-bound binary search: <code>ans = n</code>; <code>nums[mid] &gt;= target</code> → mid ek candidate, <code>ans = mid</code>, aur chhota candidate left me dhoondo (<code>hi = mid − 1</code>); warna <code>lo = mid + 1</code>.', time: 'O(log n)', space: 'O(1)', code: B2[1] },
    ],
    viz: {
      title: 'Lower Bound — ans + lo / mid / hi',
      inputs: [{ key: 'nums', label: 'nums (sorted)', def: '1, 3, 5, 6' }, { key: 'target', label: 'target', def: '2', num: true }],
      check: sortedCheck,
      run({ nums, target }) {
        const n = nums.length;
        let lo, hi, mid, ans;
        const V = () => Object.assign({ nums: K.iA(nums), target }, ans !== undefined || lo !== undefined ? { n } : {}, lo !== undefined ? { lo, hi } : {}, ans !== undefined ? { ans } : {}, mid !== undefined ? { mid } : {});
        const view = o => [K.A('nums', nums, o.hl, o.ptr), K.X('ans (best candidate ab tak)', ans === undefined ? '-' : ans === n ? `${n} (= n, abhi koi nums[i] ≥ ${target} nahi mila)` : `${ans} (nums[${ans}] = ${nums[ans]} ≥ ${target})`)];
        const { st, steps } = K.tracer(B2[1], o => ({ views: view(o), vars: V() }));
        const P = extra => {
          const h = rangeHl(n, lo, hi, extra);
          if (ans !== undefined && ans < n && !(extra && extra[ans])) h[ans] = 'done';
          const p = bsPtr(n, lo, hi, mid);
          if (ans !== undefined && ans < n) p.push({ i: ans, label: 'ans' });
          return { hl: h, ptr: p };
        };
        st('public int searchInsert', `Method call: nums = ${K.iA(nums)}, target = ${target}`);
        st('int n = nums.length', `n = ${n}`);
        lo = 0; hi = n - 1;
        st('int lo = 0, hi', `lo = 0, hi = ${hi}`, P());
        ans = n;
        st('int ans = n', `ans = ${n} — default: agar sab chhote nikle toh end me insert`, P());
        while (true) {
          if (!(lo <= hi)) { mid = undefined; st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✗ → search khatam, ans = ${ans}`, P()); break; }
          mid = undefined;
          st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✓`, P());
          mid = lo + Math.floor((hi - lo) / 2);
          st('int mid = lo + (hi - lo) / 2', `mid = ${lo} + (${hi} − ${lo}) / 2 = ${mid} → nums[${mid}] = ${nums[mid]}`, P({ [mid]: 'cur' }));
          if (nums[mid] >= target) {
            st('if (nums[mid] >= target)', `nums[${mid}] = ${nums[mid]} ≥ ${target} ✓ → mid ek candidate hai`, P({ [mid]: 'cur' }));
            ans = mid;
            st('ans = mid;', `ans = ${mid} — par shayad left me isse bhi pehla index ≥ ${target} ho`, P({ [mid]: 'new' }));
            hi = mid - 1;
            st('hi = mid - 1', `hi = ${hi} — left half me aur dhoondo`, P());
          } else {
            st('if (nums[mid] >= target)', `nums[${mid}] = ${nums[mid]} < ${target} → mid aur uske left sab chhote, bekaar`, P({ [mid]: 'cur' }));
            lo = mid + 1;
            st('lo = mid + 1', `lo = ${lo}`, P());
          }
        }
        st('return ans', `return ans = ${ans}` + (ans === n ? ' (end me insert)' : ` (nums[${ans}] = ${nums[ans]} pehla ≥ ${target})`), { hl: ans < n ? { [ans]: 'found' } : {}, ptr: ans < n ? [{ i: ans, label: 'ans' }] : [], ret: ans });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Linear scan',
          run({ nums, target }) {
            let i;
            const V = () => Object.assign({ nums: K.iA(nums), target }, i !== undefined ? { i } : {});
            const { st, steps } = K.tracer(B2[0], o => ({ views: [K.A('nums', nums, o.hl, o.ptr)], vars: V() }));
            st('public int searchInsert', `Method call: nums = ${K.iA(nums)}, target = ${target}`);
            for (i = 0; ; i++) {
              if (!(i < nums.length)) { st('for (int i', `i = ${i}: ${i} < ${nums.length} ✗ → koi nums[i] ≥ ${target} nahi`, { hl: K.rng(0, nums.length - 1, 'skip') }); break; }
              st('for (int i', `i = ${i}: ${i} < ${nums.length} ✓`, { hl: K.rng(0, i - 1, 'skip', { [i]: 'cur' }), ptr: [{ i, label: 'i' }] });
              if (nums[i] >= target) { st('if (nums[i] >= target)', `nums[${i}] = ${nums[i]} ≥ ${target} ✓ → pehla aisa index → return ${i}`, { hl: K.rng(0, i - 1, 'skip', { [i]: 'found' }), ptr: [{ i, label: 'i' }], ret: i }); return steps; }
              st('if (nums[i] >= target)', `nums[${i}] = ${nums[i]} < ${target} → aage`, { hl: K.rng(0, i - 1, 'skip', { [i]: 'cur' }), ptr: [{ i, label: 'i' }] });
            }
            st('return nums.length', `return ${nums.length} — end me insert`, { ret: nums.length });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Lower bound: pehla index jahan nums[i] ≥ target', blocks: [
        { p: '<b>Lower bound(target)</b> = sorted array me <b>pehla (sabse chhota) index</b> jahan <code>nums[i] &gt;= target</code>. Koi aisa element nahi → <code>n</code>. Search Insert Position bilkul yahi maangta hai: target hai toh uska index (wahi pehla ≥), nahi hai toh wo jagah jahan wo fit hoga.' },
        { pre: `nums:            1   3   5   6
index:           0   1   2   3
nums[i] >= 2 ?   F   T   T   T     <- F...F T...T  (monotonic!)
                     ^
                lower_bound(2) = 1` },
        { p: 'Condition <code>nums[i] &gt;= target</code> pehle false, phir ek baar true hone ke baad hamesha true — <b>monotonic</b>. Binary search asal me yahi "pehla T" dhoondta hai. Kal ka b1 (Binary Search) "exact match" dhoondta tha; aaj "pehla T".' },
        { table: { head: ['', 'b1 Binary Search', 'b2 Lower Bound'], rows: [
          ['Kya dhoondte', 'nums[i] == target', 'pehla nums[i] ≥ target'],
          ['Mil gaya toh', 'turant return', 'ans = mid, phir left me (hi = mid − 1)'],
          ['Nahi mila toh', '−1', 'ans ka default n'],
        ] } },
        { tip: '<b>Aage kaam aayega:</b> b3 (First and Last Position) isi par banta hai — first = lowerBound(target), last = lowerBound(target + 1) − 1 (ya upper bound). Java me <code>Arrays.binarySearch</code> nahi-milne pe <code>−(insertionPoint) − 1</code> deta hai — wo insertion point bhi yahi lower bound hai.' },
      ] },
      { title: '📄 Problem — LC 35 Search Insert Position', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — linear scan' },
        { p: 'Left se chalo, pehla <code>nums[i] &gt;= target</code> mile toh return i; koi na mile toh n. <b>O(n)</b> time, O(1) space — par problem O(log n) maangta hai.' },
        { h: 'Better?' },
        { p: 'Yahan alag Better approach nahi hai — Brute ke baad seedha Optimal.' },
        { h: '2. Optimal — lower-bound binary search' },
        { p: '<code>nums[mid] &gt;= target</code> → mid answer ho sakta hai, par left me isse pehla bhi ho sakta hai → <code>ans = mid</code> note karo aur <code>hi = mid − 1</code>. <code>nums[mid] &lt; target</code> → mid aur left sab bekaar → <code>lo = mid + 1</code>. Loop khatam → <code>ans</code> = pehla ≥ index (ya default n). <b>O(log n)</b>, O(1).' },
        { tip: 'Ek aur sahi tareeka: <code>ans</code> variable ke bina bhi — loop ke baad <b><code>lo</code> hi answer</b> hota hai. Par <code>ans</code> wala template saaf hai aur b3, floor/ceil jaise problems me same pattern chalta hai.' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [1, 3, 5, 6] (Optimal)', blocks: [
        { p: '<b>target = 2</b>' },
        { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'nums[mid] ≥ 2?', 'Action', 'ans'], rows: [
          ['0', '3', '—', '—', '—', 'start', '4'],
          ['0', '3', '1', '3', '<b>Yes</b>', 'ans = 1, hi = 0', '1'],
          ['0', '0', '0', '1', 'No', 'lo = 1', '1'],
          ['1', '0', '—', '—', '—', 'lo &gt; hi → return', '<b>1</b>'],
        ] } },
        { p: '<b>target = 7</b>: mid = 1 (3 &lt; 7) lo = 2 → mid = 2 (5 &lt; 7) lo = 3 → mid = 3 (6 &lt; 7) lo = 4 → loop khatam, ans kabhi update nahi hua → <b>4</b> (= n).' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: B2[1] },
        { lines: [
          ['int n = nums.length;', 'Size — default answer ke liye bhi.'],
          ['int lo = 0, hi = n - 1;', 'Closed interval [lo, hi], b1 jaisa.'],
          ['int ans = n;', 'Agar koi bhi element ≥ target nahi, toh insert end me (index n).'],
          ['while (lo <= hi)', 'Range khaali hone tak.'],
          ['int mid = lo + (hi - lo) / 2;', 'Overflow-safe mid.'],
          ['if (nums[mid] >= target) {', 'mid valid candidate hai.'],
          ['ans = mid;', 'Ab tak ka sabse left candidate save.'],
          ['hi = mid - 1;', 'Aur left me pehla ≥ dhoondo (lower bound = sabse PEHLA).'],
          ['lo = mid + 1;', 'nums[mid] < target → mid aur left sab bekaar.'],
          ['return ans;', 'Pehla index jahan nums[i] ≥ target, ya n.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 1 },
        { tip: 'Optimal tab me <b>ans</b> pointer dekho — har "≥" pe left khisakta hai. Teeno examples chalao: found (5), beech me insert (2), end me insert (7). ✎ Input: target <code>0</code> → 0 (shuru me insert).' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Target sabse chhote se chhota: <code>[1,3,5,6]</code>, 0 → 0.',
          'Target sabse bade se bada: <code>[1,3,5,6]</code>, 7 → 4 (= n) — <code>ans = n</code> default isliye.',
          'Ek element: <code>[1]</code>, 1 → 0; <code>[1]</code>, 2 → 1.',
          'Target mil gaya: wahi index (distinct values, toh pehla ≥ = khud target).',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>ans = -1</code> ya 0 se start karna → "end me insert" case galat.',
          '<code>nums[mid] == target</code> pe turant return — is problem me chalega (distinct), par lower bound with duplicates me pehla occurrence miss hoga.',
          '<code>&gt;=</code> ki jagah <code>&gt;</code> → ye upper bound ban jaata hai (pehla &gt; target) — found case pe index +1 aa jayega.',
          '<code>hi = mid</code> with <code>lo &lt;= hi</code> → infinite loop.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (linear)', 'O(n)', 'O(1)', 'worst case poora scan'],
          ['Optimal (lower bound BS)', 'O(log n)', 'O(1)', 'har step range aadha'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['What is a lower bound?', 'The first index i in a sorted array where nums[i] >= target, or n if no such element exists.'],
          ['Why is search insert position the same as lower bound?', 'If the target exists, its index is the first element >= target. If not, the first larger element is exactly where it should be inserted to keep order.'],
          ['Why initialise ans to n?', 'If every element is smaller than the target, the condition never becomes true and the target belongs at the end, index n.'],
          ['Why continue searching left after nums[mid] >= target?', 'mid is a valid candidate, but a smaller index could also satisfy the condition; we want the first one.'],
          ['Can you do it without the ans variable?', 'Yes. When the loop ends, lo equals the lower bound, so returning lo works as well.'],
          ['What is the difference between lower and upper bound?', 'Lower bound is the first element >= target; upper bound is the first element > target. Their difference gives the count of target.'],
          ['How would you find the first and last position of a target?', 'First = lowerBound(target); last = upperBound(target) − 1; if first is n or nums[first] != target, return [−1, −1].'],
          ['Does Java provide this?', 'Arrays.binarySearch returns −(insertionPoint) − 1 when the key is missing, but with duplicates it does not guarantee the first occurrence, so writing lower bound yourself is safer.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'This is the lower bound problem: find the first index where nums[i] is greater than or equal to the target. I run binary search with ans initialised to n. If nums at mid is at least the target, mid is a candidate, so I store it and continue searching left with hi equals mid minus one. Otherwise I move lo to mid plus one. When the loop ends, ans holds the first such index, or n if the target is larger than everything. That is O(log n) time and O(1) space.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [1, 3, 5, 6], target = 4 — answer?', '<b>2</b> (pehla ≥ 4 hai 5, index 2).'],
          ['nums = [2, 4, 4, 4, 8], target = 4 — lower bound aur upper bound?', 'Lower bound = <b>1</b>, upper bound (pehla &gt; 4) = <b>4</b>. Count of 4 = 4 − 1 = 3.'],
          ['<code>&gt;=</code> ko <code>&gt;</code> kar diya — [1, 3, 5, 6], target 5 pe kya aayega?', '<b>3</b> (pehla &gt; 5 = 6) — galat, sahi 2 hai.'],
        ] },
        { olist: ['Lower bound template 3 min me bina dekhe likho (ans = n, ≥ → ans = mid, hi = mid − 1).', 'Upper bound khud likho — sirf ek character badlega.'] },
      ] },
    ],
    checks: [
      'Lower bound ki definition aur ye problem usse kaise match karti hai — bol sakta hoon',
      'ans = n default aur "mil gaya fir bhi left me dhoondo" kyun — samjha sakta hoon',
      'Lower bound / upper bound dono 3 min me likh sakta hoon',
      '30 sec ka English interview answer bol sakta hoon',
    ],
    memory: 'Lower bound = pehla ≥. ans = n; ≥ mila → ans = mid, hi = mid − 1; chhota → lo = mid + 1.',
    tests: [
      { run: 'System.out.print(o.searchInsert(new int[]{1,3,5,6}, 5));', out: '2' },
      { run: 'System.out.print(o.searchInsert(new int[]{1,3,5,6}, 2));', out: '1' },
      { run: 'System.out.print(o.searchInsert(new int[]{1,3,5,6}, 7));', out: '4' },
      { run: 'System.out.print(o.searchInsert(new int[]{1,3,5,6}, 0));', out: '0' },
      { run: 'System.out.print(o.searchInsert(new int[]{1}, 1));', out: '0' },
      { run: 'System.out.print(o.searchInsert(new int[]{1}, 2));', out: '1' },
      { run: 'System.out.print(o.searchInsert(new int[]{-5,-2,0,4,9}, 3));', out: '3' },
    ],
  };
})();
