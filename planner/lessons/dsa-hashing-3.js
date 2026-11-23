// Planner lessons — Hashing part 3 (h4 Subarray Sum Equals K)
// Format: dsa-arrays-two-pointers.js jaisa. Viz steps: lesson-kit.js tracer (har line = ek step, VARIABLES me saare locals).
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  // =====================================================================
  // h4 — Subarray Sum Equals K (LC 560)
  // =====================================================================
  const H4 = [
    `public int subarraySum(int[] nums, int k) {
    int count = 0;
    for (int start = 0; start < nums.length; start++) {
        int sum = 0;
        for (int end = start; end < nums.length; end++) {
            sum += nums[end];
            if (sum == k) count++;
        }
    }
    return count;
}`,
    `public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> prefixCount = new HashMap<>(); // prefixSum -> kitni baar
    prefixCount.put(0, 1);
    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;
        count += prefixCount.getOrDefault(sum - k, 0);
        prefixCount.put(sum, prefixCount.getOrDefault(sum, 0) + 1);
    }
    return count;
}`,
  ];
  const h4Inputs = [{ key: 'nums', label: 'nums', def: '1, -1, 0' }, { key: 'k', label: 'k', def: '0', num: true }];

  L.h4 = {
    kind: 'dsa', title: 'Subarray Sum Equals K', topic: 'Hashing', diff: 'M', lc: 560,
    url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    pattern: 'Prefix sum + HashMap (count of seen prefix sums)',
    oneLine: 'Running prefix sum rakho; har index pe pucho "sum − k wala prefix pehle kitni baar aaya?" — utne subarrays yahan khatam hote hain. Shuru me map.put(0, 1).',
    goal: 'Kitne <b>continuous subarrays</b> ka sum exactly <code>k</code> hai — gino. Asli seekh: <b>subarray sum = do prefix sums ka difference</b>. Toh "kya aisa prefix pehle aaya?" — wahi Two Sum (a1) wala sawaal, bas ab values ki jagah <b>prefix sums</b> map me, aur index ki jagah <b>count</b> (h1–h3 ka frequency map).',
    problem: {
      statement: 'Given an array of integers <code>nums</code> and an integer <code>k</code>, return <i>the total number of subarrays whose sum equals to</i> <code>k</code>.<br><br>A subarray is a contiguous <b>non-empty</b> sequence of elements within an array.',
      examples: [
        { input: 'nums = [1,1,1], k = 2', output: '2', explain: 'Subarrays [1,1] (index 0..1) aur [1,1] (index 1..2) — dono ka sum 2.', viz: { nums: '1, 1, 1', k: '2' } },
        { input: 'nums = [1,2,3], k = 3', output: '2', explain: '[1,2] aur [3] — dono ka sum 3.', viz: { nums: '1, 2, 3', k: '3' } },
        { input: 'nums = [1,-1,0], k = 0', output: '3', explain: 'Apna example (LeetCode ka nahi): [1,-1], [1,-1,0] aur [0]. Negative + zero ke saath sliding window fail hota hai — HashMap me prefix 0 ka count 1 → 2 → 3 badhta dikhega.', viz: { nums: '1, -1, 0', k: '0' } },
      ],
      constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
    },
    approaches: [
      { level: 'Brute', idea: 'Har start ke liye end ko aage badhate jao aur running sum rakho (inner sum loop dobara nahi). sum == k → count++. Har subarray ek baar check.', time: 'O(n²)', space: 'O(1)', code: H4[0] },
      { level: 'Optimal', idea: 'Running prefix sum + HashMap&lt;prefixSum, count&gt;. sum(i+1..j) = prefix[j] − prefix[i] = k ⇒ prefix[i] = sum − k. Har index pe map se <code>sum − k</code> ka count jodo, phir apna <code>sum</code> map me daalo. <code>put(0, 1)</code> = khaali prefix.', time: 'O(n)', space: 'O(n)', code: H4[1] },
    ],
    viz: {
      title: 'Subarray Sum Equals K — prefix sum + HashMap',
      inputs: h4Inputs,
      run({ nums, k }) {
        const map = new Map(), n = nums.length;
        let sum, count, x, idx;
        const V = () => {
          const v = { nums: K.iA(nums), k, prefixCount: K.mapStr(map) };
          if (sum !== undefined) { v.sum = sum; v.count = count; }
          if (x !== undefined) v.x = x;
          return v;
        };
        const { st, steps } = K.tracer(H4[1], o => ({ views: [K.A('nums', nums, o.hl, o.ptr), K.M('HashMap prefixCount (prefixSum → kitni baar)', map, o.mh)], vars: V() }));
        st('public int subarraySum', `Method call: nums = ${K.iA(nums)}, k = ${k}`);
        st('Map<Integer, Integer> prefixCount', 'Khaali HashMap — key = ab tak dekha prefix sum, value = wo kitni baar aaya.');
        map.set(0, 1);
        st('prefixCount.put(0, 1)', 'put(0, 1) — "kuch bhi nahi liya" wala khaali prefix (sum 0) ek baar. Isi se index 0 se shuru hone wale subarrays gine jaate hain.', { mh: 0 });
        sum = 0; count = 0;
        st('int sum = 0, count = 0', 'sum = 0 (running prefix sum), count = 0 (answer)');
        for (idx = 0; idx < n; idx++) {
          x = nums[idx];
          const P = { hl: K.rng(0, idx - 1, 'done', { [idx]: 'cur' }), ptr: [{ i: idx, label: 'x' }] };
          st('for (int x : nums)', `x = nums[${idx}] = ${x}`, P);
          const prev = sum;
          sum += x;
          st('sum += x', `sum = ${prev} + ${x} = ${sum} → nums[0..${idx}] ka prefix sum`, P);
          const need = sum - k, c = map.get(need) || 0;
          count += c;
          st('count += prefixCount.getOrDefault', c
            ? `need = sum − k = ${sum} − (${k}) = ${need} → map me ${c} baar → ${c} subarray(s) index ${idx} pe khatam jinka sum ${k} → count = ${count}`
            : `need = sum − k = ${sum} − (${k}) = ${need} → map me nahi → +0, count = ${count}`, Object.assign({ mh: need }, P));
          map.set(sum, (map.get(sum) || 0) + 1);
          st('prefixCount.put(sum', `put(${sum}, ${map.get(sum)}) — prefix ${sum} ab ${map.get(sum)} baar dekha`, Object.assign({ mh: sum }, P));
        }
        x = undefined;
        st('for (int x : nums)', 'Saare elements ho gaye → loop khatam', { hl: K.rng(0, n - 1, 'done') });
        st('return count', `return count = ${count}`, { ret: String(count) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Har start, running sum',
          run({ nums, k }) {
            const n = nums.length;
            let count, start, sum, end;
            const V = () => {
              const v = { nums: K.iA(nums), k };
              if (count !== undefined) v.count = count;
              if (start !== undefined) v.start = start;
              if (sum !== undefined) v.sum = sum;
              if (end !== undefined) v.end = end;
              return v;
            };
            const { st, steps } = K.tracer(H4[0], o => ({ views: [K.A('nums', nums, o.hl, o.ptr)], vars: V() }));
            const W = (cls) => ({ hl: K.rng(start, end, cls || 'win'), ptr: [{ i: start, label: 'start' }, { i: end, label: 'end' }] });
            st('public int subarraySum', `Method call: nums = ${K.iA(nums)}, k = ${k}`);
            count = 0;
            st('int count = 0', 'count = 0');
            for (start = 0; ; start++) {
              if (!(start < n)) { st('for (int start', `start = ${start}: ${start} < ${n} ✗ → saare start ho gaye`); break; }
              sum = undefined; end = undefined;
              st('for (int start', `start = ${start}: ${start} < ${n} ✓ — yahan se shuru hone wale saare subarrays`, { hl: { [start]: 'cur' }, ptr: [{ i: start, label: 'start' }] });
              sum = 0;
              st('int sum = 0', 'sum = 0 — naye start ke liye running sum reset', { hl: { [start]: 'cur' }, ptr: [{ i: start, label: 'start' }] });
              for (end = start; ; end++) {
                if (!(end < n)) { st('for (int end', `end = ${end}: ${end} < ${n} ✗ → is start ke subarrays khatam`, { hl: { [start]: 'cur' }, ptr: [{ i: start, label: 'start' }] }); break; }
                st('for (int end', `end = ${end}: ${end} < ${n} ✓ — subarray nums[${start}..${end}]`, W());
                const prev = sum;
                sum += nums[end];
                st('sum += nums[end]', `sum = ${prev} + ${nums[end]} = ${sum} (pichla sum reuse — inner loop dobara nahi)`, W());
                if (sum === k) { count++; st('if (sum == k) count++', `${sum} == ${k} ✓ → count++ → ${count}`, W('found')); }
                else st('if (sum == k) count++', `${sum} ≠ ${k}`, W());
              }
            }
            start = undefined; sum = undefined; end = undefined;
            st('return count', `return count = ${count}`, { ret: String(count) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Prefix sum: subarray sum = do prefix ka difference', blocks: [
        { p: '<b>Prefix sum</b> <code>P[j]</code> = nums[0] + … + nums[j]. Koi bhi subarray <code>nums[i+1..j]</code> ka sum = <code>P[j] − P[i]</code>. Toh "sum = k wala subarray j pe khatam hota hai?" ⇔ "pehle koi prefix <code>P[i] = P[j] − k</code> aaya tha?"' },
        { pre: `nums:    [ 1,  2,  3]          k = 3
prefix:  0 | 1 | 3 | 6          (shuru ka 0 = khaali prefix)
j = 1: sum = 3, need = 3 − 3 = 0  → 0 ek baar dekha → [1,2]
j = 2: sum = 6, need = 6 − 3 = 3  → 3 ek baar dekha → [3]` },
        { p: 'Ye bilkul <b>Two Sum (a1)</b> jaisa hai: wahan <code>need = target − x</code> values me dhoondha, yahan <code>need = sum − k</code> <b>prefix sums</b> me. Fark: ek hi prefix value kai baar aa sakti hai (negatives / zeros ki wajah se), aur har baar ek alag subarray deti hai — isliye map me index nahi, <b>count</b> rakhte hain (h1–h3 wala frequency map).' },
        { tip: '<b>Sliding window kyun nahi?</b> Window tab chalta hai jab window badhane se sum <b>sirf badhe</b> (sab positive). Yahan negatives hain: <code>[1, −1, 0]</code>, k = 0 me window chhota/bada karne ka koi sahi rule nahi — sum upar-neeche hota rehta hai. Prefix sum + HashMap ko sign se farak nahi padta.' },
      ] },
      { title: '📄 Problem — LC 560 Subarray Sum Equals K', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — har start, running sum' },
        { p: 'Sabse seedha: har (start, end) subarray ka sum nikaalo — teen loops = O(n³). Chhota sudhaar: start fix karo, end aage badhate hue <code>sum += nums[end]</code> — inner sum loop khatam. Ye classic brute hai: <b>O(n²)</b> time, O(1) space. n = 2×10⁴ pe ~2×10⁸ — TLE ka risk.' },
        { h: 'Better?' },
        { p: 'Yahan genuine Better nahi hai. Prefix-sum array bana ke har (i, j) pair check karna bhi O(n²) hi hai — wo brute ka hi doosra roop hai. Aur sliding window (O(n)) negatives ki wajah se galat answer deta hai. Isliye Brute ke baad seedha Optimal.' },
        { h: '2. Optimal — prefix sum + HashMap&lt;sum, count&gt;' },
        { p: 'Brute ka inner loop asal me puchta hai: "kitne i ke liye <code>P[j] − P[i] = k</code>?" Ye sawaal = "<code>P[j] − k</code> wala prefix pehle kitni baar aaya?" — HashMap O(1) me batata hai. Ek pass: <code>sum += x</code> → <code>count += map.getOrDefault(sum − k, 0)</code> → <code>map.put(sum, +1)</code>. <b>O(n)</b> time, O(n) space.' },
        { tip: '<b>map.put(0, 1) kyun?</b> Agar <code>nums[0..j]</code> poora hi sum k hai, toh need = sum − k = 0, aur "kuch nahi liya" wala prefix 0 hai. Ye entry nahi daali toh index 0 se shuru hone wale saare subarrays chhoot jayenge — [1,2,3], k = 3 pe answer 1 aayega, 2 nahi.' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [1, -1, 0], k = 0 (Optimal)', blocks: [
        { table: { head: ['x', 'sum', 'need = sum − k', 'map (pehle)', 'getOrDefault(need)', 'count', 'map (baad)'], rows: [
          ['start', '0', '—', '—', '—', '0', '{0→1}'],
          ['1', '1', '1', '{0→1}', '0', '0', '{0→1, 1→1}'],
          ['−1', '0', '0', '{0→1, 1→1}', '<b>1</b>', '1', '{0→2, 1→1}'],
          ['0', '0', '0', '{0→2, 1→1}', '<b>2</b>', '<b>3</b>', '{0→3, 1→1}'],
        ] } },
        { p: 'Return <b>3</b>. Last step me 2 kyun? Prefix 0 do baar aaya tha (khaali prefix aur index 1 ke baad) → do subarrays index 2 pe khatam: <code>[1,−1,0]</code> aur <code>[0]</code>.' },
        { p: '<b>Example 1:</b> nums = [1, 1, 1], k = 2' },
        { table: { head: ['x', 'sum', 'need', 'map (pehle)', '+count', 'count'], rows: [
          ['1', '1', '−1', '{0→1}', '0', '0'],
          ['1', '2', '0', '{0→1, 1→1}', '1', '1'],
          ['1', '3', '1', '{0→1, 1→1, 2→1}', '1', '<b>2</b>'],
        ] } },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: H4[1] },
        { lines: [
          ['Map<Integer, Integer> prefixCount = new HashMap<>();', 'Key = prefix sum, value = wo prefix kitni baar aaya. Count isliye kyunki same prefix kai baar aa sakta hai aur har baar alag subarray.'],
          ['prefixCount.put(0, 1);', 'Khaali prefix — index 0 se shuru hone wale subarrays ke liye. Sabse zyada bhoola jaane wala line.'],
          ['int sum = 0, count = 0;', 'sum = running prefix, count = answer.'],
          ['for (int x : nums)', 'Ek hi pass.'],
          ['sum += x;', 'Ab sum = P[j] (nums[0..j] ka sum).'],
          ['count += prefixCount.getOrDefault(sum - k, 0);', 'Jitni baar prefix (sum − k) aaya, utne subarrays j pe khatam hote hain jinka sum k hai.'],
          ['prefixCount.put(sum, prefixCount.getOrDefault(sum, 0) + 1);', 'Apna prefix check ke BAAD daalo — warna k = 0 pe khaali subarray gin loge.'],
          ['return count;', 'Total subarrays.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute → Optimal</b>. Map panel me dekho prefix 0 ka count kaise badhta hai. Apna input try karo: <code>3, 4, 7, 2, -3, 1, 4, 2</code> k = <code>7</code> (answer 4).' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Ek element <code>[1]</code>, k = 0 → 0 (subarray non-empty hona chahiye; put check ke baad hai isliye khaali gina nahi gaya).',
          'Zeros: <code>[0,0,0]</code>, k = 0 → 6 (har subarray). Count wala map isi ke liye.',
          'Negatives: <code>[1,−1,0]</code>, k = 0 → 3 — sliding window yahan fail.',
          'k negative bhi ho sakta hai: <code>[−1,−1,1]</code>, k = −1 → 3. Formula same.',
          'Overflow: |sum| ≤ 2×10⁴ × 1000 = 2×10⁷ → <code>int</code> kaafi hai.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>map.put(0, 1)</code> bhool jaana → shuru se start hone wale subarrays miss.',
          'put pehle, check baad me → k = 0 pe har index pe khaali subarray gin jaata hai.',
          '<code>sum − k</code> ki jagah <code>k − sum</code> dhoondhna.',
          'Map me count ki jagah index / boolean rakhna → duplicate prefixes ka count galat.',
          'Sliding window lagana — sirf non-negative arrays pe sahi hai.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (running sum)', 'O(n²)', 'O(1)', 'n(n+1)/2 subarrays, har ek O(1) me'],
          ['Optimal (prefix + HashMap)', 'O(n)', 'O(n)', 'ek pass, har get/put O(1) avg; map me n + 1 tak prefixes'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why does a sliding window not work here?', 'The array can contain negatives and zeros, so growing the window does not always increase the sum. There is no valid rule for when to shrink, so the window misses or double-counts subarrays.'],
          ['Why do you put (0, 1) in the map first?', 'It represents the empty prefix. When the whole prefix nums[0..j] sums to k, we need a prefix equal to 0, and that entry lets us count it.'],
          ['Why store a count and not just a boolean or index?', 'The same prefix sum can appear several times, and each occurrence gives a different subarray ending at j, so we add how many times it appeared.'],
          ['Why update the map after the lookup?', 'So the current prefix is not paired with itself, which would count an empty subarray when k is 0.'],
          ['What is the time and space complexity?', 'O(n) time with one pass and average O(1) map operations, and O(n) space for up to n + 1 distinct prefix sums.'],
          ['How would you return the subarrays instead of the count?', 'Store a list of indices per prefix sum; for each j, every stored index i gives the subarray i + 1..j. Output size can be O(n²) in the worst case.'],
          ['If all numbers were positive, what would you do?', 'Use a sliding window with two pointers: O(n) time and O(1) space, because the sum is monotonic as the window grows.'],
          ['Which related problems use the same idea?', 'Continuous Subarray Sum (prefix mod k), Subarray Sums Divisible by K, Contiguous Array (0 as −1, count equal), and Path Sum III on trees.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'The brute force fixes a start and extends the end with a running sum, which is O(n squared). The sum of a subarray i + 1 to j is prefix[j] minus prefix[i], so for each j I need to know how many earlier prefixes equal prefix[j] minus k. I keep a HashMap from prefix sum to how many times it has appeared, seeded with zero mapped to one for the empty prefix. For each element I update the running sum, add the count of sum minus k, then record the current sum. That is O(n) time and O(n) space, and it works with negative numbers, where a sliding window fails.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [3, 4, 7, 2, −3, 1, 4, 2], k = 7 — answer?', '<b>4</b>: [3,4], [7], [7,2,−3,1], [1,4,2].'],
          ['<code>put(0, 1)</code> hata do toh [1, 2, 3], k = 3 ka answer?', '<b>1</b> — sirf [3] milega, [1,2] (index 0 se shuru) chhoot jayega.'],
          ['[0, 0, 0], k = 0 — map ka last state aur answer?', 'Map <code>{0→4}</code>, answer <b>6</b> (1 + 2 + 3).'],
          ['Sliding window [1, −1, 0], k = 0 pe kyun fail hota hai — ek line me?', 'Negative aane pe sum ghat jaata hai, toh "sum bada hai → left badhao" wala rule galat ho jaata hai.'],
        ] },
        { olist: ['Optimal code 5 min me bina dekhe likho (put(0, 1) yaad se).', 'Dry run table [1, −1, 0], k = 0 khud banao.', 'Two Sum se connection 30 sec me English me bolo.'] },
      ] },
    ],
    checks: [
      'Bata sakta hoon subarray sum = P[j] − P[i] aur need = sum − k kyun',
      '<b>put(0, 1)</b> aur "check pehle, put baad me" — dono ka reason pakka',
      'Sliding window negatives pe kyun fail hota hai, example ke saath bol sakta hoon',
      'Optimal code 5 min me bina dekhe likh sakta hoon',
    ],
    memory: 'sum += x; count += map[sum − k]; map[sum]++. Shuru me map[0] = 1.',
    tests: [
      { run: 'System.out.print(o.subarraySum(new int[]{1,1,1}, 2));', out: '2' },
      { run: 'System.out.print(o.subarraySum(new int[]{1,2,3}, 3));', out: '2' },
      { run: 'System.out.print(o.subarraySum(new int[]{1,-1,0}, 0));', out: '3' },
      { run: 'System.out.print(o.subarraySum(new int[]{3,4,7,2,-3,1,4,2}, 7));', out: '4' },
      { run: 'System.out.print(o.subarraySum(new int[]{0,0,0}, 0));', out: '6' },
      { run: 'System.out.print(o.subarraySum(new int[]{1}, 0));', out: '0' },
      { run: 'System.out.print(o.subarraySum(new int[]{-1,-1,1}, -1));', out: '3' },
    ],
  };
})();
