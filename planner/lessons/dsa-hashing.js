// Planner lessons — Hashing (h1 Contains Duplicate)
// Format: planner/learn.js ke upar comment dekho. Viz steps: lesson-kit.js tracer (har line = ek step, VARIABLES me saare locals).
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  // =====================================================================
  // h1 — Contains Duplicate (LC 217)
  // =====================================================================
  const H1 = [
    `public boolean containsDuplicate(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] == nums[j]) return true;
        }
    }
    return false;
}`,
    `public boolean containsDuplicate(int[] nums) {
    Arrays.sort(nums);
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] == nums[i - 1]) return true;
    }
    return false;
}`,
    `public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
        if (seen.contains(x)) return true;
        seen.add(x);
    }
    return false;
}`,
  ];

  L.h1 = {
    kind: 'dsa', title: 'Contains Duplicate', topic: 'Hashing', diff: 'E', lc: 217,
    url: 'https://leetcode.com/problems/contains-duplicate/',
    pattern: 'Hashing (HashSet — "pehle dekha kya?")',
    oneLine: 'HashSet seen: har x pe pucho "x pehle dekha?" — haan → true; nahi → seen.add(x). End tak kuch nahi → false.',
    goal: 'Batao array me koi value <b>do baar</b> aayi ya nahi. Asli seekh: Two Sum (a1) wala hi sawaal — <b>"kya ye value pehle dekhi hai?"</b> — bas yahan index nahi chahiye, isliye HashMap ki jagah <b>HashSet</b>. Hashing topic ka sabse basic building block.',
    problem: {
      statement: 'Given an integer array <code>nums</code>, return <code>true</code> if any value appears <b>at least twice</b> in the array, and return <code>false</code> if every element is distinct.',
      examples: [
        { input: 'nums = [1,2,3,1]', output: 'true', explain: 'The element 1 occurs at the indices 0 and 3.', viz: { nums: '1, 2, 3, 1' } },
        { input: 'nums = [1,2,3,4]', output: 'false', explain: 'All elements are distinct.', viz: { nums: '1, 2, 3, 4' } },
        { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true', explain: '1, 3, 4 aur 2 sab ek se zyada baar aate hain — pehla repeat milte hi true.', viz: { nums: '1, 1, 1, 3, 3, 4, 3, 2, 4, 2' } },
      ],
      constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    },
    approaches: [
      { level: 'Brute', idea: 'Har pair (i, j &gt; i) compare karo — koi barabar mila toh true.', time: 'O(n²)', space: 'O(1)', code: H1[0] },
      { level: 'Better', idea: 'Sort karo — same values paas-paas aa jaati hain. Phir sirf padosiyon ko compare karo.', time: 'O(n log n)', space: 'O(1) extra (sort ka O(log n) stack); input badal jaata hai', code: H1[1] },
      { level: 'Optimal', idea: 'HashSet <code>seen</code>: har x pe <code>contains</code> check, mila toh true, warna <code>add</code>. Ek pass.', time: 'O(n)', space: 'O(n)', code: H1[2] },
    ],
    viz: {
      title: 'Contains Duplicate — HashSet (one pass)',
      inputs: [{ key: 'nums', label: 'nums', def: '1, 2, 3, 1' }],
      run({ nums }) {
        const seen = new Set();
        let x, idx;
        const V = () => Object.assign({ nums: K.iA(nums), seen: K.setStr(seen) }, x !== undefined ? { x } : {});
        const { st, steps } = K.tracer(H1[2], o => ({ views: [K.A('nums', nums, o.hl, o.ptr), K.S('HashSet seen', seen, o.sh)], vars: V() }));
        st('public boolean containsDuplicate', `Method call: nums = ${K.iA(nums)}`);
        st('Set<Integer> seen', 'Khaali HashSet — jo values dekh li, yahan jayengi');
        for (idx = 0; ; idx++) {
          if (idx >= nums.length) { x = undefined; st('for (int x : nums)', 'Saare elements ho gaye → loop khatam'); break; }
          x = nums[idx];
          const P = { hl: K.rng(0, idx - 1, 'done', { [idx]: 'cur' }), ptr: [{ i: idx, label: 'x' }] };
          st('for (int x : nums)', `x = nums[${idx}] = ${x}`, P);
          if (seen.has(x)) {
            st('if (seen.contains(x))', `seen.contains(${x}) → true! ${x} pehle dekha tha → return true`, { hl: Object.assign(K.rng(0, idx - 1, 'done'), { [nums.indexOf(x)]: 'found', [idx]: 'found' }), ptr: P.ptr, sh: x, ret: 'true' });
            return steps;
          }
          st('if (seen.contains(x))', `seen.contains(${x}) → false — pehli baar dikha`, P);
          seen.add(x);
          st('seen.add(x)', `seen.add(${x})`, Object.assign({ sh: x }, P));
        }
        st('return false', 'Koi value repeat nahi hui → return false', { ret: 'false' });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Har pair',
          run({ nums }) {
            let i, j;
            const V = () => Object.assign({ nums: K.iA(nums) }, i !== undefined ? { i } : {}, j !== undefined ? { j } : {});
            const { st, steps } = K.tracer(H1[0], o => ({ views: [K.A('nums', nums, o.hl, o.ptr)], vars: V() }));
            st('public boolean containsDuplicate', `Method call: nums = ${K.iA(nums)}`);
            for (i = 0; ; i++) {
              j = undefined;
              if (!(i < nums.length)) { st('for (int i', `i = ${i}: ✗ → outer loop khatam`); break; }
              st('for (int i', `i = ${i}: ${i} < ${nums.length} ✓`, { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] });
              for (j = i + 1; ; j++) {
                const P = { hl: { [i]: 'cur', [j]: 'win' }, ptr: [{ i, label: 'i' }, { i: j, label: 'j' }] };
                if (!(j < nums.length)) { st('for (int j', `j = ${j}: ✗ → inner loop khatam`, { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] }); break; }
                st('for (int j', `j = ${j}: ${j} < ${nums.length} ✓`, P);
                if (nums[i] === nums[j]) { st('if (nums[i] == nums[j])', `nums[${i}] (${nums[i]}) == nums[${j}] (${nums[j]}) ✓ → return true`, { hl: { [i]: 'found', [j]: 'found' }, ptr: P.ptr, ret: 'true' }); return steps; }
                st('if (nums[i] == nums[j])', `nums[${i}] (${nums[i]}) ≠ nums[${j}] (${nums[j]})`, P);
              }
            }
            i = undefined; j = undefined;
            st('return false', 'Koi pair barabar nahi → return false', { ret: 'false' });
            return steps;
          },
        },
        {
          ap: 1, label: 'Sort + padosi',
          run({ nums }) {
            const a = nums.slice();
            let i;
            const V = () => Object.assign({ nums: K.iA(a) }, i !== undefined ? { i } : {});
            const { st, steps } = K.tracer(H1[1], o => ({ views: [K.A('nums', a, o.hl, o.ptr)], vars: V() }));
            st('public boolean containsDuplicate', `Method call: nums = ${K.iA(a)}`);
            a.sort((p, q) => p - q);
            st('Arrays.sort(nums)', `Sort: nums = ${K.iA(a)} — ab same values paas-paas`);
            for (i = 1; ; i++) {
              if (!(i < a.length)) { st('for (int i = 1', `i = ${i}: ${i} < ${a.length} ✗ → loop khatam`); break; }
              const P = { hl: K.rng(0, i - 2, 'done', { [i - 1]: 'win', [i]: 'cur' }), ptr: [{ i: i - 1, label: 'i-1' }, { i, label: 'i' }] };
              st('for (int i = 1', `i = ${i}: ${i} < ${a.length} ✓`, P);
              if (a[i] === a[i - 1]) { st('if (nums[i] == nums[i - 1])', `nums[${i}] (${a[i]}) == nums[${i - 1}] (${a[i - 1]}) ✓ → padosi barabar → return true`, { hl: { [i - 1]: 'found', [i]: 'found' }, ptr: P.ptr, ret: 'true' }); return steps; }
              st('if (nums[i] == nums[i - 1])', `nums[${i}] (${a[i]}) ≠ nums[${i - 1}] (${a[i - 1]})`, P);
            }
            i = undefined;
            st('return false', 'Koi padosi barabar nahi → sab distinct → return false', { ret: 'false' });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — HashSet: "ye pehle dekha hai kya?"', blocks: [
        { p: 'Two Sum (a1) me HashMap se pucha tha <i>"target − x pehle dekha?"</i>. Yahan sawaal aur seedha hai: <i>"<b>x khud</b> pehle dekha?"</i>. Index nahi chahiye, sirf haan/na — isliye <b>HashSet</b> (sirf keys, value nahi).' },
        { table: { head: ['Method', 'Kaam', 'Time (avg)'], rows: [
          ['<code>set.add(x)</code>', 'x daalo; pehle se ho toh kuch nahi (return <code>false</code>)', 'O(1)'],
          ['<code>set.contains(x)</code>', 'x set me hai ya nahi', 'O(1)'],
          ['<code>set.remove(x)</code>', 'x hatao', 'O(1)'],
          ['<code>set.size()</code>', 'kitni unique values', 'O(1)'],
        ] } },
        { tip: '<b>HashSet vs HashMap:</b> sirf "hai ya nahi" chahiye → Set. Saath me kuch aur (index, count) chahiye → Map. Two Sum me index chahiye tha → Map; yahan nahi → Set.' },
      ] },
      { title: '📄 Problem — LC 217 Contains Duplicate', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — har pair' },
        { p: 'Do loops: i aur j &gt; i, <code>nums[i] == nums[j]</code> mila toh true. <b>O(n²)</b> time, O(1) space. n = 10⁵ pe 5 × 10⁹ checks — TLE.' },
        { h: '2. Better — sort karo, padosi dekho' },
        { p: 'Sort ke baad same values hamesha <b>paas-paas</b>. Toh sirf <code>nums[i] == nums[i−1]</code> check — ek pass. <b>O(n log n)</b> time, O(1) extra (Java ka int sort O(log n) stack). Dikkat: <b>input array badal jaata hai</b> — interviewer puche toh batana.' },
        { h: '3. Optimal — HashSet, ek pass' },
        { p: 'Brute ka inner loop sirf ye puchta hai: <i>"kya nums[i] baaki me kahin aur hai?"</i> — HashSet ye O(1) me bata deta hai. Har x: <code>seen.contains(x)</code> → true return; warna <code>seen.add(x)</code>. <b>O(n)</b> time, <b>O(n)</b> space. Pehla duplicate milte hi ruk jaate hain.' },
        { tip: '<b>Short trick:</b> <code>if (!seen.add(x)) return true;</code> — <code>add</code> khud <code>false</code> deta hai agar x pehle se tha. Ek hi hash lookup. Interview me pehle saaf (contains + add) likho, phir ye bolo.' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [1, 2, 3, 1] (Optimal)', blocks: [
        { table: { head: ['x', 'seen (pehle)', 'contains(x)?', 'Action'], rows: [
          ['1', '{ }', 'No', 'add(1)'],
          ['2', '{1}', 'No', 'add(2)'],
          ['3', '{1, 2}', 'No', 'add(3)'],
          ['1', '{1, 2, 3}', '<b>Yes</b>', 'return <b>true</b>'],
        ] } },
        { p: '<b>Example 2:</b> <code>[1, 2, 3, 4]</code> → har x naya, seen = {1, 2, 3, 4}, loop khatam → <b>false</b>.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: H1[2] },
        { lines: [
          ['Set<Integer> seen = new HashSet<>();', 'Ab tak dekhi values. Sirf haan/na chahiye → Set (Map nahi).'],
          ['for (int x : nums)', 'Ek pass, for-each — index ki zaroorat nahi.'],
          ['if (seen.contains(x)) return true;', 'x pehle aa chuka → duplicate → turant true (aage dekhne ki zaroorat nahi).'],
          ['seen.add(x);', 'Pehli baar dikha → yaad rakho.'],
          ['return false;', 'Poora array dekh liya, koi repeat nahi → sab distinct.'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute (har pair) → Better (sort + padosi) → Optimal (HashSet)</b>. Apna input try karo: <code>5, -1, 7, -1</code> (true) ya <code>9</code> (false).' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Ek element <code>[9]</code> → koi pair hi nahi → false.',
          'Duplicate bilkul shuru me <code>[1,1,...]</code> → x = 1 dusri baar pe hi true (best case O(1)-ish).',
          'Negative numbers / ±10⁹ <code>[-1000000000, 1000000000, -1000000000]</code> → true; HashSet ko range se farak nahi.',
          'Sab distinct, n = 10⁵ → poora pass, set me 10⁵ entries.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Brute me <code>j = 0</code> se shuru karna → i == j pe khud se compare → hamesha true.',
          'Better me sort karke original array ko baad me use karna — wo badal chuka hai.',
          'Counting array (<code>int[] cnt = new int[...]</code>) — values ±10⁹ hain, itna bada array nahi ban sakta. HashSet hi lo.',
          'HashMap le lena jab sirf presence chahiye — chalega, par Set zyada saaf hai.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute', 'O(n²)', 'O(1)', 'n(n−1)/2 pairs'],
          ['Better', 'O(n log n)', 'O(1) extra / O(log n) stack', 'sort dominate karta hai; input modify hota hai'],
          ['Optimal', 'O(n)', 'O(n)', 'ek pass, har contains/add O(1) avg'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why a HashSet and not a HashMap?', 'We only need to know whether a value was seen before; no index or count is needed, so a set is enough.'],
          ['Can you avoid the separate contains call?', 'Yes: set.add returns false if the value is already present, so "if (!seen.add(x)) return true;" does one lookup per element.'],
          ['What if you cannot use extra memory?', 'Sort the array and compare neighbours: O(n log n) time and O(1) extra space, but it modifies the input.'],
          ['What if the input must not be modified and memory is limited?', 'Then it is a trade-off: copy and sort (O(n) space anyway) or use the O(n²) pair check with O(1) space.'],
          ['Why not use a counting array?', 'Values range from −10^9 to 10^9, so a direct-address array would be far too large.'],
          ['What is the worst case for HashSet operations?', 'With many collisions a bucket can degrade, but since Java 8 large buckets become balanced trees, giving O(log n). The average is O(1).'],
          ['How would you check for duplicates within distance k (LC 219)?', 'Keep a sliding window HashSet of the last k elements: add the current value and remove the one that falls out of the window.'],
          ['Time and space complexity of your solution?', 'O(n) time with one pass and O(n) space for the set in the worst case when all values are distinct.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Brute force compares every pair in O(n squared). Sorting puts equal values next to each other, so comparing neighbours gives O(n log n) time with O(1) extra space, but it changes the input. The optimal solution uses a HashSet: for each number I check whether it is already in the set; if yes I return true, otherwise I add it. If the loop finishes, all values are distinct. That is O(n) time and O(n) space.'],
          ['Aise bolo — trade-off', 'If memory is the constraint and modifying the array is allowed, I would sort and compare neighbours; otherwise the HashSet is the fastest and simplest.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [3, 1, 4, 1, 5] — HashSet approach kis x pe true return karega?', 'Doosre <b>1</b> pe (index 3) — tab seen = {3, 1, 4} aur 1 already hai.'],
          ['Better approach <code>[2, 14, 18, 22, 22]</code> pe kitne comparisons karega?', '<b>4</b> — i = 1, 2, 3 pe alag, i = 4 pe 22 == 22 → true.'],
          ['Two Sum me HashMap tha, yahan HashSet kyun?', 'Two Sum ko jodidaar ka <b>index</b> chahiye tha; yahan sirf "dekha ya nahi" — value ke saath kuch store nahi karna.'],
        ] },
        { olist: ['Optimal code 2 min me bina dekhe likho.', 'Brute → Better → Optimal ka 30 sec English explanation zor se bolo.'] },
      ] },
    ],
    checks: [
      'Brute, Better, Optimal — teeno ka idea aur complexity bol sakta hoon',
      'HashSet vs HashMap kab — Two Sum se compare karke samjha',
      'Sort wale approach ka trade-off (input modify) bata sakta hoon',
      'Code 2 min me bina dekhe likh sakta hoon',
    ],
    memory: 'Dekha hai? → true. Nahi → set me daalo. End → false.',
    tests: [
      { run: 'System.out.print(o.containsDuplicate(new int[]{1,2,3,1}));', out: 'true' },
      { run: 'System.out.print(o.containsDuplicate(new int[]{1,2,3,4}));', out: 'false' },
      { run: 'System.out.print(o.containsDuplicate(new int[]{1,1,1,3,3,4,3,2,4,2}));', out: 'true' },
      { run: 'System.out.print(o.containsDuplicate(new int[]{9}));', out: 'false' },
      { run: 'System.out.print(o.containsDuplicate(new int[]{-1000000000,1000000000,-1000000000}));', out: 'true' },
    ],
  };
})();
