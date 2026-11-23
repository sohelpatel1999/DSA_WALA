// Planner lessons — Arrays & Two Pointers (a1 Two Sum, a2 Remove Duplicates, a3 Segregate 0s/1s, a4 Sort Colors)
// Format: planner/learn.js ke upar comment dekho. Viz steps: lesson-kit.js tracer (har line = ek step, VARIABLES me saare locals).
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  // =====================================================================
  // a1 — Two Sum (LC 1)
  // =====================================================================
  const A1 = [
    `public int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) return new int[]{i, j};
        }
    }
    return new int[]{-1, -1};
}`,
    `public int[] twoSum(int[] nums, int target) {
    int n = nums.length;
    int[][] arr = new int[n][2]; // {value, originalIndex}
    for (int i = 0; i < n; i++) arr[i] = new int[]{nums[i], i};
    Arrays.sort(arr, (a, b) -> Integer.compare(a[0], b[0]));
    int l = 0, r = n - 1;
    while (l < r) {
        int sum = arr[l][0] + arr[r][0];
        if (sum == target) return new int[]{arr[l][1], arr[r][1]};
        if (sum < target) l++;
        else r--;
    }
    return new int[]{-1, -1};
}`,
    `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>(); // value -> index
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (map.containsKey(need)) return new int[]{map.get(need), i};
        map.put(nums[i], i);
    }
    return new int[]{-1, -1};
}`,
  ];
  const twoSumInputs = [{ key: 'nums', label: 'nums', def: '2, 7, 11, 15' }, { key: 'target', label: 'target', def: '9', num: true }];

  L.a1 = {
    kind: 'dsa', title: 'Two Sum', topic: 'Arrays & Two Pointers', diff: 'E', lc: 1,
    url: 'https://leetcode.com/problems/two-sum/',
    pattern: 'Hashing (complement lookup)',
    oneLine: 'HashMap (value → index): har x pe pucho "target − x pehle dekha kya?"',
    goal: 'Do numbers dhoondo jinka sum = <code>target</code> aur unke <b>index</b> return karo. Asli seekh: <b>"kya ye value pehle dekhi hai?"</b> — ye sawaal HashMap O(1) me answer karta hai, isliye O(n²) → O(n).',
    noteFeedback: 'Tumhara note bilkul sahi hai: <code>need = target − nums[i]</code>, map me <code>(nums[i], i)</code>, phir <code>containsKey → get → put</code>. Bas order pakka yaad rakho: <b>pehle containsKey check, phir put</b> — warna same element do baar use ho jayega.',
    problem: {
      statement: 'Given an array of integers <code>nums</code> and an integer <code>target</code>, return <i>indices of the two numbers such that they add up to <code>target</code></i>. You may assume that each input would have <b>exactly one solution</b>, and you may not use the same element twice. You can return the answer in any order.',
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explain: 'Because nums[0] + nums[1] == 9, we return [0, 1].', viz: { nums: '2, 7, 11, 15', target: '9' } },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explain: 'nums[1] + nums[2] = 2 + 4 = 6.', viz: { nums: '3, 2, 4', target: '6' } },
        { input: 'nums = [3,3], target = 6', output: '[0,1]', explain: 'Same value do baar hai, par alag index — allowed.', viz: { nums: '3, 3', target: '6' } },
        { input: 'nums = [1,2,4,9], target = 6', output: '[1,2]', explain: 'Apna example (LeetCode ka nahi): Better approach me l++ aur r-- dono chalte dikhenge.', viz: { nums: '1, 2, 4, 9', target: '6' } },
      ],
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    },
    approaches: [
      { level: 'Brute', idea: 'Har pair (i, j > i) try karo.', time: 'O(n²)', space: 'O(1)', code: A1[0] },
      { level: 'Better', idea: '{value, originalIndex} pairs sort karo, phir two pointers l, r. Sort se index na khoye isliye pair me index saath rakha.', time: 'O(n log n)', space: 'O(n)', code: A1[1] },
      { level: 'Optimal', idea: 'One-pass HashMap. Har element pe pehle complement check, phir khud ko map me daalo.', time: 'O(n)', space: 'O(n)', code: A1[2] },
    ],
    viz: {
      title: 'Two Sum — HashMap (one pass)',
      inputs: twoSumInputs,
      run({ nums, target }) {
        const map = new Map();
        let i, need;
        const V = () => Object.assign({ nums: K.iA(nums), target, map: K.mapStr(map) }, i !== undefined ? { i } : {}, need !== undefined ? { need } : {});
        const { st, steps } = K.tracer(A1[2], o => ({ views: [K.A('nums', nums, o.hl, o.ptr), K.M('HashMap map (value → index)', map, o.mh)], vars: V() }));
        st('public int[] twoSum', `Method call: nums = ${K.iA(nums)}, target = ${target}`);
        st('Map<Integer, Integer> map', 'Khaali HashMap — key = dekhi hui value, value = uska index.');
        for (i = 0; ; i++) {
          if (!(i < nums.length)) { st('for (int i', `i = ${i}: ${i} < ${nums.length} ✗ → loop khatam`); break; }
          const P = { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] };
          need = undefined;
          st('for (int i', `i = ${i}: ${i} < ${nums.length} ✓`, P);
          need = target - nums[i];
          st('int need', `need = target − nums[${i}] = ${target} − ${nums[i]} = ${need}`, P);
          if (map.has(need)) {
            const j = map.get(need);
            st('if (map.containsKey', `map.containsKey(${need}) → true! Jodidaar index ${j} pe tha → return [${j}, ${i}]`, { hl: { [j]: 'found', [i]: 'found' }, ptr: [{ i: j, label: 'map.get(need)' }, { i, label: 'i' }], mh: need, ret: `[${j}, ${i}]` });
            return steps;
          }
          st('if (map.containsKey', `map.containsKey(${need}) → false — jodidaar abhi tak nahi dekha`, P);
          map.set(nums[i], i);
          st('map.put', `map.put(${nums[i]}, ${i}) — ab ${nums[i]} "dekha hua" hai`, Object.assign({ mh: nums[i] }, P));
        }
        i = undefined; need = undefined;
        st('return new int[]{-1, -1}', 'Koi pair nahi mila → return [-1, -1]', { ret: '[-1, -1]' });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Har pair',
          run({ nums, target }) {
            let i, j;
            const V = () => Object.assign({ nums: K.iA(nums), target }, i !== undefined ? { i } : {}, j !== undefined ? { j } : {});
            const { st, steps } = K.tracer(A1[0], o => ({ views: [K.A('nums', nums, o.hl, o.ptr)], vars: V() }));
            st('public int[] twoSum', `Method call: nums = ${K.iA(nums)}, target = ${target}`);
            for (i = 0; ; i++) {
              if (!(i < nums.length)) { st('for (int i', `i = ${i}: ✗ → outer loop khatam`); break; }
              j = undefined;
              st('for (int i', `i = ${i}: ${i} < ${nums.length} ✓`, { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] });
              for (j = i + 1; ; j++) {
                const P = { hl: { [i]: 'cur', [j]: 'win' }, ptr: [{ i, label: 'i' }, { i: j, label: 'j' }] };
                if (!(j < nums.length)) { st('for (int j', `j = ${j}: ${j} < ${nums.length} ✗ → inner loop khatam`, { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] }); break; }
                st('for (int j', `j = ${j}: ${j} < ${nums.length} ✓`, P);
                const s = nums[i] + nums[j];
                if (s === target) { st('if (nums[i] + nums[j]', `${nums[i]} + ${nums[j]} = ${s} == ${target} ✓ → return [${i}, ${j}]`, { hl: { [i]: 'found', [j]: 'found' }, ptr: P.ptr, ret: `[${i}, ${j}]` }); return steps; }
                st('if (nums[i] + nums[j]', `${nums[i]} + ${nums[j]} = ${s} ≠ ${target}`, P);
              }
            }
            i = undefined; j = undefined;
            st('return new int[]{-1, -1}', 'Koi pair nahi → return [-1, -1]', { ret: '[-1, -1]' });
            return steps;
          },
        },
        {
          ap: 1, label: 'Sort + two pointers',
          run({ nums, target }) {
            const n = nums.length;
            let arr = null, i, l, r, sum;
            const V = () => {
              const v = { nums: K.iA(nums), target, n };
              if (arr) v.arr = 'int[' + n + '][2] ' + arr.map(p => (p ? '{' + p[0] + ',' + p[1] + '}' : '{0,0}')).join(' ');
              if (i !== undefined) v.i = i;
              if (l !== undefined) { v.l = l; v.r = r; }
              if (sum !== undefined) v.sum = sum;
              return v;
            };
            const views = o => {
              const out = [K.A('nums (original)', nums, o.nh)];
              if (arr) {
                out.push(K.A('arr[k][0] — value', arr.map(p => (p ? p[0] : '')), o.hl, o.ptr));
                out.push(K.A('arr[k][1] — originalIndex', arr.map(p => (p ? p[1] : '')), o.hl));
              }
              return out;
            };
            const { st, steps } = K.tracer(A1[1], o => ({ views: views(o), vars: V() }));
            st('public int[] twoSum', `Method call: nums = ${K.iA(nums)}, target = ${target}`);
            st('int n = nums.length', `n = ${n}`);
            arr = Array(n).fill(null);
            st('int[][] arr', `arr = new int[${n}][2] — har row me {value, originalIndex}`);
            for (i = 0; ; i++) {
              if (!(i < n)) { st('for (int i', `i = ${i}: ✗ → saare pairs ban gaye`); break; }
              st('for (int i', `i = ${i}: ${i} < ${n} ✓`, { nh: { [i]: 'cur' } });
              arr[i] = [nums[i], i];
              st('arr[i] = new int[]', `arr[${i}] = {${nums[i]}, ${i}}`, { nh: { [i]: 'cur' }, hl: { [i]: 'new' } });
            }
            i = undefined;
            arr.sort((a, b) => a[0] - b[0]);
            st('Arrays.sort(arr', 'Value ke hisaab se sort — originalIndex pair ke saath chalta hai, khoya nahi.');
            l = 0; r = n - 1;
            const P = () => ({ hl: { [l]: 'cur', [r]: 'cur' }, ptr: [{ i: l, label: 'l' }, { i: r, label: 'r' }] });
            st('int l = 0, r', `l = 0, r = ${r}`, P());
            while (true) {
              if (!(l < r)) { st('while (l < r)', `l (${l}) < r (${r}) ✗ → loop khatam`); break; }
              sum = undefined;
              st('while (l < r)', `l (${l}) < r (${r}) ✓`, P());
              sum = arr[l][0] + arr[r][0];
              st('int sum', `sum = ${arr[l][0]} + ${arr[r][0]} = ${sum}`, P());
              if (sum === target) { st('if (sum == target)', `${sum} == ${target} ✓ → original index return: [${arr[l][1]}, ${arr[r][1]}]`, { hl: { [l]: 'found', [r]: 'found' }, ptr: P().ptr, ret: `[${arr[l][1]}, ${arr[r][1]}]` }); return steps; }
              st('if (sum == target)', `${sum} ≠ ${target}`, P());
              if (sum < target) { st('if (sum < target) l++', `${sum} < ${target} → sum badhana hai → l++ (bada number lo)`, P()); l++; }
              else { st('if (sum < target) l++', `${sum} > ${target} → chhota karna hai`, P()); st('else r--', 'r-- (chhota number lo)', P()); r--; }
            }
            sum = undefined;
            st('return new int[]{-1, -1}', 'Koi pair nahi → return [-1, -1]', { ret: '[-1, -1]' });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Hashing: "ye pehle dekha hai kya?"', blocks: [
        { p: 'Array me koi value dhoondhna = poora scan = <b>O(n)</b>. HashMap me <code>containsKey</code> / <code>get</code> = average <b>O(1)</b>. Isliye jab bhi problem me sawaal ho <i>"kya aisa koi element pehle aaya tha jo …"</i> — HashMap socho.' },
        { table: { head: ['Method', 'Kaam', 'Time (avg)'], rows: [
          ['<code>map.put(k, v)</code>', 'key k ke saath value v rakho (pehle se ho toh overwrite)', 'O(1)'],
          ['<code>map.containsKey(k)</code>', 'k map me hai ya nahi', 'O(1)'],
          ['<code>map.get(k)</code>', 'k ki value (nahi hai toh <code>null</code>)', 'O(1)'],
          ['<code>map.getOrDefault(k, d)</code>', 'value, warna default d', 'O(1)'],
        ] } },
        { tip: '<b>Complement trick:</b> x + y = target ⇒ y = target − x. Har x ke liye ek hi specific y chahiye — "kuch bhi" nahi. Specific value dhoondhna = HashMap ka kaam.' },
      ] },
      { title: '📄 Problem — LC 1 Two Sum', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — har pair' },
        { p: 'Do loops: i aur j > i, check <code>nums[i] + nums[j] == target</code>. Pairs = n(n−1)/2 → <b>O(n²)</b> time, O(1) space. n = 10⁴ pe ~5 crore checks — chal jayega, par interviewer turant puchega "better?"' },
        { h: '2. Better — sort + two pointers' },
        { p: 'Sorted array me l = 0, r = n−1: sum chhota → l++ (bada number), sum bada → r-- (chhota number). Dikkat: sort karte hi <b>index badal jaate hain</b>, aur answer index maangta hai. Isliye <code>{value, originalIndex}</code> pairs sort karo. <b>O(n log n)</b> time, O(n) space.' },
        { h: '3. Optimal — HashMap, ek pass' },
        { p: 'Brute ka inner loop asal me sirf ek sawaal puchta hai: <i>"kya <code>target − nums[i]</code> array me hai?"</i> Ye sawaal HashMap O(1) me answer karta hai. Toh ek hi loop: complement check karo, nahi mila toh current value map me daalo. <b>O(n)</b> time, O(n) space.' },
        { tip: '<b>Pehle check, phir put.</b> Ulta karoge toh nums = [3, …], target = 6 pe i = 0 par hi 3 apna khud ka jodidaar ban jayega → [0, 0] galat.' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [2, 7, 11, 15], target = 9 (Optimal)', blocks: [
        { table: { head: ['i', 'nums[i]', 'need', 'map (pehle)', 'containsKey(need)?', 'Action'], rows: [
          ['0', '2', '7', '{ }', 'No', 'put(2, 0)'],
          ['1', '7', '2', '{2→0}', '<b>Yes</b>', 'return <b>[0, 1]</b>'],
        ] } },
        { p: '<b>Example 2:</b> nums = [3, 2, 4], target = 6' },
        { table: { head: ['i', 'nums[i]', 'need', 'map (pehle)', 'containsKey(need)?', 'Action'], rows: [
          ['0', '3', '3', '{ }', 'No', 'put(3, 0)'],
          ['1', '2', '4', '{3→0}', 'No', 'put(2, 1)'],
          ['2', '4', '2', '{3→0, 2→1}', '<b>Yes</b>', 'return <b>[1, 2]</b>'],
        ] } },
        { tip: 'i = 0 pe need = 3 tha aur nums[0] bhi 3 hai — par map khaali tha kyunki put check ke <b>baad</b> hota hai. Isliye [0, 0] nahi aaya.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: A1[2] },
        { lines: [
          ['Map<Integer, Integer> map = new HashMap<>();', 'Key = jo value dekh chuke, Value = uska index. Index isliye kyunki answer index maangta hai — isliye HashSet nahi.'],
          ['for (int i = 0; i < nums.length; i++)', 'Sirf ek pass.'],
          ['int need = target - nums[i];', 'Complement — is element ka jodidaar.'],
          ['if (map.containsKey(need)) return new int[]{map.get(need), i};', 'Jodidaar pehle aa chuka → uska index map se + current i. map wala index hamesha chhota hoga.'],
          ['map.put(nums[i], i);', 'Check ke BAAD daalo, taaki element khud ka jodidaar na bane.'],
          ['return new int[]{-1, -1};', 'Problem guarantee deta hai ki answer hai — ye sirf compiler ke liye fallback.'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 0 },
        { tip: 'Upar tabs: <b>Brute → Better → Optimal</b>. Example buttons se LeetCode ke examples, ✎ Input se apna (jaise <code>1, 5, 3, 7</code> target <code>8</code>).' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Duplicate values: <code>[3,3]</code>, target 6 → <code>[0,1]</code>. Pehle check, phir put — isliye sahi chalta hai.',
          'Negative numbers: <code>[-3,4,3,90]</code>, target 0 → <code>[0,2]</code>. HashMap ko sign se farak nahi padta.',
          'Answer bilkul end me: <code>[1,2,3,4]</code>, target 7 → <code>[2,3]</code>; poora loop chalega.',
          'Overflow: values ±10⁹ tak → <code>target − nums[i]</code> max ±2×10⁹, jo <code>int</code> range (±2.147×10⁹) me hai.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'put pehle, check baad me → same element do baar.',
          'Index ki jagah values return kar dena.',
          'Original array sort kar dena → index kho gaye (Better me pairs isi liye).',
          'HashSet le lena → index kahan se laoge?',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute', 'O(n²)', 'O(1)', 'n(n−1)/2 pairs'],
          ['Better', 'O(n log n)', 'O(n)', 'sort dominate karta hai; pairs array O(n)'],
          ['Optimal', 'O(n)', 'O(n)', 'ek pass, har lookup O(1) avg; map me n tak entries'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why a HashMap and not a HashSet?', 'We must return indices, so we store value → index. A set only tells us the value exists.'],
          ['Why check before putting the current element?', 'So an element cannot pair with itself, e.g. nums = [3, …], target = 6 would wrongly return [0, 0].'],
          ['What if the array is already sorted?', 'Use two pointers from both ends: O(n) time, O(1) space (that is LC 167, Two Sum II).'],
          ['What is the worst case of a HashMap lookup?', 'O(n) with heavy collisions; since Java 8 large buckets become trees, so O(log n). Average is O(1).'],
          ['Can you solve it in O(1) extra space?', 'Only by sorting, which costs O(n log n) and loses the original indices unless we store them. So it is a time vs. space trade-off.'],
          ['How would you return all pairs instead of one?', 'Keep scanning instead of returning; for duplicates keep a count per value, or sort and skip equal neighbours.'],
          ['What if numbers arrive as a stream?', 'Same idea: keep a map of seen values; for each new value check whether target − value is in the map.'],
          ['How does this extend to 3Sum?', 'Sort, fix one element, then run the two-pointer Two Sum on the rest: O(n²) overall.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Brute force checks every pair, which is O(n squared). For each number I only need its complement, target minus the number, so I keep a HashMap from value to index of the numbers I have already seen. For each element I first check whether its complement is in the map; if it is, I return both indices, otherwise I add the current number. That is one pass: O(n) time and O(n) space.'],
          ['Aise bolo — trade-off', 'If memory were tight and indices were not needed, I would sort and use two pointers for O(n log n) time and O(1) extra space. Because this problem needs the original indices, the HashMap is the cleanest solution.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [1, 5, 3, 7], target = 8 — HashMap approach kya return karega?', '<b>[1, 2]</b>. i = 2 pe need = 5, jo index 1 pe map me hai. (1 + 7 bhi 8 hai, par 5 + 3 pehle milta hai.)'],
          ['put pehle aur check baad me karo toh nums = [3, 4], target = 6 ka kya hoga?', 'i = 0: put(3, 0), need = 3 → map me mil gaya → <b>[0, 0]</b>. Same element do baar — galat.'],
          ['Better approach me sort ke baad <code>nums</code> ki jagah <code>arr</code> kyun banaya?', 'Sort se index badal jaate. <code>arr[k] = {value, originalIndex}</code> me original index value ke saath chalta hai.'],
        ] },
        { olist: ['Optimal code 5 min me bina dekhe likho.', 'Brute → Better → Optimal ka 30 sec English explanation zor se bolo.'] },
      ] },
    ],
    checks: [
      'Brute, Better, Optimal — teeno ka idea aur complexity bol sakta hoon',
      'Samjha sakta hoon kyun <b>pehle check, phir put</b>',
      'HashMap code 5 min me bina dekhe likh sakta hoon',
      '30 sec ka English interview answer bol sakta hoon',
    ],
    memory: 'Jodidaar dhoondo: need = target − x. Map me hai → jawab; nahi → x ko map me daalo.',
    tests: [
      { run: 'int[] r = o.twoSum(new int[]{2,7,11,15}, 9); Arrays.sort(r); System.out.print(Arrays.toString(r));', out: '[0, 1]' },
      { run: 'int[] r = o.twoSum(new int[]{3,2,4}, 6); Arrays.sort(r); System.out.print(Arrays.toString(r));', out: '[1, 2]' },
      { run: 'int[] r = o.twoSum(new int[]{3,3}, 6); Arrays.sort(r); System.out.print(Arrays.toString(r));', out: '[0, 1]' },
      { run: 'int[] r = o.twoSum(new int[]{-3,4,3,90}, 0); Arrays.sort(r); System.out.print(Arrays.toString(r));', out: '[0, 2]' },
      { run: 'int[] r = o.twoSum(new int[]{1,2,4,9}, 6); Arrays.sort(r); System.out.print(Arrays.toString(r));', out: '[1, 2]' },
    ],
  };

  // =====================================================================
  // a2 — Remove Duplicates from Sorted Array (LC 26)
  // =====================================================================
  const A2 = [
    `public int removeDuplicates(int[] nums) {
    Set<Integer> set = new LinkedHashSet<>(); // order bachata hai
    for (int x : nums) set.add(x);
    int k = 0;
    for (int x : set) nums[k++] = x;
    return k;
}`,
    `public int removeDuplicates(int[] nums) {
    int i = 0; // last unique ka index
    for (int j = 1; j < nums.length; j++) {
        if (nums[j] != nums[i]) {
            i++;
            nums[i] = nums[j];
        }
    }
    return i + 1;
}`,
  ];
  const kRet = (a, k) => k + ', nums = ' + K.iA(a.slice(0, k).concat(Array(a.length - k).fill(null)));

  L.a2 = {
    kind: 'dsa', title: 'Remove Duplicates from Sorted Array', topic: 'Arrays & Two Pointers', diff: 'E', lc: 26,
    url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
    pattern: 'Two pointers (read / write)',
    oneLine: 'Sorted ⇒ duplicates paas-paas. i = last unique, j = scanner; naya mile toh i++ aur likho. Answer i + 1.',
    goal: 'Sorted array me se duplicates <b>in-place</b> hatao aur unique count <code>k</code> return karo. Asli seekh: <b>slow (write) + fast (read) pointer</b> — extra array ke bina array ko "compact" karna.',
    noteFeedback: 'Bilkul sahi: i last unique pe, j aage scan karta hai; alag value mile toh <code>i++</code> karke <code>nums[i] = nums[j]</code>; <b>return i + 1</b> kyunki i index hai, count nahi. Brute me ek dhyaan: <code>HashSet</code> order nahi bachata — <code>LinkedHashSet</code> (ya <code>TreeSet</code>) lo.',
    problem: {
      statement: 'Given an integer array <code>nums</code> sorted in <b>non-decreasing order</b>, remove the duplicates <b>in-place</b> such that each unique element appears only once. The relative order of the elements should be kept the same. Then return <i>the number of unique elements</i> in <code>nums</code>.<br><br>Consider the number of unique elements of <code>nums</code> to be <code>k</code>. Change the array <code>nums</code> such that the first <code>k</code> elements contain the unique elements in the order they were present initially. The remaining elements of <code>nums</code> are not important, as well as the size of <code>nums</code>. Return <code>k</code>.',
      examples: [
        { input: 'nums = [1,1,2]', output: '2, nums = [1,2,_]', explain: 'Your function should return k = 2, with the first two elements of nums being 1 and 2. It does not matter what you leave beyond the returned k (hence they are underscores).', viz: { nums: '1, 1, 2' } },
        { input: 'nums = [0,0,1,1,1,2,2,3,3,4]', output: '5, nums = [0,1,2,3,4,_,_,_,_,_]', explain: 'Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4.', viz: { nums: '0, 0, 1, 1, 1, 2, 2, 3, 3, 4' } },
      ],
      constraints: ['1 <= nums.length <= 3 * 10^4', '-100 <= nums[i] <= 100', 'nums is sorted in non-decreasing order.'],
    },
    approaches: [
      { level: 'Brute', idea: 'Sab values <code>LinkedHashSet</code> me daalo (unique + order same), phir set ko array ke shuru me wapas copy karo.', time: 'O(n)', space: 'O(n)', code: A2[0] },
      { level: 'Optimal', idea: 'Sorted hai toh duplicate hamesha last unique ke barabar hoga. i = last unique (write), j = scanner (read). Extra space zero.', time: 'O(n)', space: 'O(1)', code: A2[1] },
    ],
    viz: {
      title: 'Remove Duplicates — two pointers (i write, j read)',
      inputs: [{ key: 'nums', label: 'nums (sorted)', def: '0, 0, 1, 1, 1, 2, 2, 3, 3, 4' }],
      run({ nums }) {
        const a = nums.slice();
        let i, j;
        const V = () => Object.assign({ nums: K.iA(a) }, i !== undefined ? { i } : {}, j !== undefined ? { j } : {});
        const { st, steps } = K.tracer(A2[1], o => ({ views: [K.A('nums', a, o.hl, o.ptr)], vars: V() }));
        st('public int removeDuplicates', `Method call: nums = ${K.iA(a)}`);
        i = 0;
        st('int i = 0', 'i = 0 — pehla element hamesha unique hai, wahi "last unique".', { hl: { 0: 'done' }, ptr: [{ i: 0, label: 'i' }] });
        for (j = 1; ; j++) {
          const P = () => ({ hl: K.rng(0, i, 'done', { [j]: 'cur' }), ptr: [{ i, label: 'i' }, { i: j, label: 'j' }] });
          if (!(j < a.length)) { st('for (int j', `j = ${j}: ${j} < ${a.length} ✗ → scan khatam`, { hl: K.rng(0, i, 'done'), ptr: [{ i, label: 'i' }] }); break; }
          st('for (int j', `j = ${j}: ${j} < ${a.length} ✓`, P());
          if (a[j] !== a[i]) {
            st('if (nums[j] != nums[i])', `nums[${j}] (${a[j]}) != nums[${i}] (${a[i]}) → naya unique!`, P());
            i++;
            st('i++;', `i++ → ${i} (agla khaali slot)`, P());
            a[i] = a[j];
            st('nums[i] = nums[j]', `nums[${i}] = ${a[j]}`, { hl: K.rng(0, i - 1, 'done', { [i]: 'new', [j]: 'cur' }), ptr: [{ i, label: 'i' }, { i: j, label: 'j' }] });
          } else {
            st('if (nums[j] != nums[i])', `nums[${j}] (${a[j]}) == nums[${i}] → duplicate, skip`, { hl: K.rng(0, i, 'done', { [j]: 'skip' }), ptr: [{ i, label: 'i' }, { i: j, label: 'j' }] });
          }
        }
        j = undefined;
        st('return i + 1', `return i + 1 = ${i + 1} — pehle ${i + 1} elements unique`, { hl: K.rng(0, i, 'found'), ret: kRet(a, i + 1) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'LinkedHashSet',
          run({ nums }) {
            const a = nums.slice(), set = new Set();
            let x, k;
            const V = () => Object.assign({ nums: K.iA(a), set: K.setStr(set, 'LinkedHashSet') }, x !== undefined ? { x } : {}, k !== undefined ? { k } : {});
            const { st, steps } = K.tracer(A2[0], o => ({ views: [K.A('nums', a, o.hl, o.ptr), K.S('LinkedHashSet set', set, o.sh)], vars: V() }));
            st('public int removeDuplicates', `Method call: nums = ${K.iA(a)}`);
            st('Set<Integer> set', 'Khaali LinkedHashSet — duplicate nahi rakhta, insertion order yaad rakhta hai.');
            a.forEach((v, idx) => {
              x = v;
              const had = set.has(v);
              set.add(v);
              st('for (int x : nums) set.add', had ? `x = ${v} → set me pehle se hai, add kuch nahi karta` : `x = ${v} → set.add(${v})`, { hl: { [idx]: had ? 'skip' : 'cur' }, sh: v });
            });
            x = undefined;
            k = 0;
            st('int k = 0', 'k = 0 — set wapas array ke shuru me likhenge');
            for (const v of set) {
              x = v;
              a[k] = v;
              st('for (int x : set) nums[k++]', `nums[${k}] = ${v}, k → ${k + 1}`, { hl: K.rng(0, k - 1, 'done', { [k]: 'new' }), ptr: [{ i: k, label: 'k' }], sh: v });
              k++;
            }
            x = undefined;
            st('return k', `return k = ${k}`, { hl: K.rng(0, k - 1, 'found'), ret: kRet(a, k) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Two pointers: read (j) / write (i)', blocks: [
        { p: '<b>Read/Write pointers:</b> ek pointer (j) har element <b>padhta</b> hai, doosra (i) batata hai <b>agla rakhne layak element kahan likhna hai</b>. Isse array <b>in-place</b> compact ho jaata hai — naya array nahi chahiye.' },
        { pre: `nums:  [0, 0, 1, 1, 1, 2, 2]
         i  j                 i = last unique (write side)
        |--| = unique hissa    j = scanner (read side)` },
        { tip: '<b>Sorted ka fayda:</b> duplicates hamesha <b>paas-paas</b> hote hain. Isliye "pehle dekha kya?" ke liye set nahi chahiye — sirf last unique (<code>nums[i]</code>) se compare karo.' },
      ] },
      { title: '📄 Problem — LC 26 Remove Duplicates from Sorted Array', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — set ki madad' },
        { p: 'Unique chahiye → Set. Order bhi same chahiye → <code>LinkedHashSet</code> (HashSet order bigaad deta hai). Sab daalo, phir set ko array ke shuru me copy karo, size return. <b>O(n)</b> time, <b>O(n)</b> extra space — par problem <b>in-place</b> chahta hai.' },
        { h: 'Better?' },
        { p: 'Yahan alag Better approach nahi hai — Brute ke baad seedha Optimal. (TreeSet bhi Brute hi hai, bas O(n log n).)' },
        { h: '2. Optimal — read/write pointers' },
        { p: 'Set kis kaam aa raha tha? "Ye value pehle aayi?" check ke liye. Par sorted array me agar value pehle aayi hai toh wo <b>abhi abhi</b> aayi hogi — yaani last unique <code>nums[i]</code> ke barabar. Toh: <code>nums[j] != nums[i]</code> → naya unique → <code>i++</code>, <code>nums[i] = nums[j]</code>. End me unique count = <code>i + 1</code>. <b>O(n)</b>, <b>O(1)</b>.' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [0, 0, 1, 1, 1, 2, 2] (Optimal)', blocks: [
        { table: { head: ['j', 'nums[j]', 'nums[i]', 'Alag?', 'Action', 'i', 'Unique hissa'], rows: [
          ['start', '—', '0', '—', 'i = 0', '0', '[0]'],
          ['1', '0', '0', 'No', 'skip', '0', '[0]'],
          ['2', '1', '0', '<b>Yes</b>', 'i++, nums[1] = 1', '1', '[0, 1]'],
          ['3', '1', '1', 'No', 'skip', '1', '[0, 1]'],
          ['4', '1', '1', 'No', 'skip', '1', '[0, 1]'],
          ['5', '2', '1', '<b>Yes</b>', 'i++, nums[2] = 2', '2', '[0, 1, 2]'],
          ['6', '2', '2', 'No', 'skip', '2', '[0, 1, 2]'],
        ] } },
        { p: 'Loop khatam → <b>return i + 1 = 3</b>. Array: <code>[0, 1, 2, 1, 1, 2, 2]</code> — pehle 3 hi matter karte hain.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: A2[1] },
        { lines: [
          ['int i = 0;', 'Index 0 hamesha unique — wahi abhi "last unique" hai.'],
          ['for (int j = 1; j < nums.length; j++)', 'j = 1 se scan, kyunki index 0 already rakha hua hai.'],
          ['if (nums[j] != nums[i])', 'Sorted hai → naya unique wahi jo last unique se alag ho.'],
          ['i++;', 'Unique hissa ek badhao — agla slot.'],
          ['nums[i] = nums[j];', 'Naya unique wahan likho (overwrite safe hai, wo value already gin li).'],
          ['return i + 1;', 'i index hai (0-based), count = i + 1.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs me <b>Brute (LinkedHashSet)</b> aur <b>Optimal</b>. Apna input try karo: <code>1, 1, 1, 1</code> (answer 1) ya <code>-1, 0, 0, 0, 3, 3</code> (answer 3).' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Ek hi element <code>[7]</code> → loop chalega hi nahi → return 1.',
          'Sab same <code>[2,2,2]</code> → return 1.',
          'Sab unique <code>[1,2,3]</code> → har step pe khud ko hi overwrite, return 3.',
          'Negatives <code>[-1,0,0,0,3,3]</code> → 3. (Constraint me length ≥ 1, isliye empty check nahi chahiye.)',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>return i</code> likh dena (i + 1 chahiye).',
          'Brute me <code>HashSet</code> — order bigad jaata hai, LeetCode fail.',
          '<code>nums[j] != nums[j − 1]</code> se compare karna bhi chalta hai, par <code>nums[i]</code> se compare zyada saaf hai aur "at most 2 duplicates" (LC 80) me extend hota hai.',
          'Naya array bana dena — problem in-place maangta hai.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (LinkedHashSet)', 'O(n)', 'O(n)', 'har add O(1) avg, set me n tak values'],
          ['Optimal (two pointers)', 'O(n)', 'O(1)', 'ek pass, sirf do int'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why do you return i + 1?', 'i is the index of the last unique element, so the count of uniques is i + 1.'],
          ['Why does comparing with nums[i] work?', 'The array is sorted, so any duplicate of a value appears right after it, i.e. it equals the last unique we wrote.'],
          ['What if the array were not sorted?', 'Comparing neighbours no longer works. I would use a LinkedHashSet to keep order, O(n) space, or sort first if order does not matter.'],
          ['How would you allow each value at most twice (LC 80)?', 'Keep a write pointer k and copy nums[j] when k < 2 or nums[j] != nums[k − 2].'],
          ['Is the relative order preserved?', 'Yes, we only move elements left in the same order they appear.'],
          ['What happens to elements after index k?', 'They are leftovers and do not matter; the judge only checks the first k.'],
          ['Why is in-place important here?', 'It shows O(1) extra space — the main point of the problem; the set solution uses O(n).'],
          ['Time and space complexity?', 'O(n) time with one pass and O(1) extra space.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'A simple approach puts all values into a LinkedHashSet and copies them back, but that uses O(n) extra space. Since the array is sorted, duplicates are adjacent, so I use two pointers: i marks the last unique element and j scans the array. Whenever nums[j] differs from nums[i], I move i forward and copy nums[j] there. At the end the first i + 1 elements are unique, so I return i + 1. That is O(n) time and O(1) space.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [1, 1, 2, 3, 3] — return value aur pehle k elements?', '<b>k = 3</b>, nums ke pehle 3 = <b>[1, 2, 3]</b>.'],
          ['Brute me HashSet le liya toh <code>[3, 3, 10, 20]</code> pe kya galat ho sakta hai?', 'HashSet order guarantee nahi karta — output <code>[20, 3, 10]</code> jaisa aa sakta hai. Order chahiye, isliye LinkedHashSet.'],
          ['LC 80 (har value max 2 baar) me condition kya hogi?', '<code>k < 2 || nums[j] != nums[k − 2]</code> → tab copy karo.'],
        ] },
        { olist: ['Optimal code 3 min me bina dekhe likho.', 'Dry run table khud banao: <code>[0,0,1,1,1,2,2,3,3,4]</code> → 5.'] },
      ] },
    ],
    checks: [
      'Read/write pointer ka matlab apne words me bol sakta hoon',
      'Bata sakta hoon kyun sorted hone se set ki zaroorat khatam hoti hai',
      'Return <b>i + 1</b> kyun — pakka samjha',
      'Code 3 min me bina dekhe likh sakta hoon',
    ],
    memory: 'i = last unique, j = scanner; alag mile toh i++ aur likho; answer i + 1.',
    tests: [
      { run: 'int[] a = {1,1,2}; int k = o.removeDuplicates(a); System.out.print(k + " " + Arrays.toString(Arrays.copyOf(a, k)));', out: '2 [1, 2]' },
      { run: 'int[] a = {0,0,1,1,1,2,2,3,3,4}; int k = o.removeDuplicates(a); System.out.print(k + " " + Arrays.toString(Arrays.copyOf(a, k)));', out: '5 [0, 1, 2, 3, 4]' },
      { run: 'int[] a = {7}; int k = o.removeDuplicates(a); System.out.print(k + " " + Arrays.toString(Arrays.copyOf(a, k)));', out: '1 [7]' },
      { run: 'int[] a = {-1,0,0,0,3,3}; int k = o.removeDuplicates(a); System.out.print(k + " " + Arrays.toString(Arrays.copyOf(a, k)));', out: '3 [-1, 0, 3]' },
    ],
  };

  // =====================================================================
  // a3 — Segregate 0s and 1s (GfG)
  // =====================================================================
  const A3 = [
    `public void segregate0and1(int[] arr) {
    Arrays.sort(arr);
}`,
    `public void segregate0and1(int[] arr) {
    int zeros = 0;
    for (int x : arr) if (x == 0) zeros++;
    for (int i = 0; i < arr.length; i++) {
        arr[i] = (i < zeros) ? 0 : 1;
    }
}`,
    `public void segregate0and1(int[] arr) {
    int start = 0, end = arr.length - 1;
    while (start < end) {
        while (start < end && arr[start] == 0) start++;
        while (start < end && arr[end] == 1) end--;
        if (start < end) {
            int temp = arr[start];
            arr[start] = arr[end];
            arr[end] = temp;
            start++;
            end--;
        }
    }
}`,
  ];
  const sortBrute = (code, name, label) => ({
    ap: 0, label,
    run(inp) {
      const a = inp[name].slice(), before = K.iA(a);
      const { st, steps } = K.tracer(code, o => ({ views: [K.A(name, a, o.hl)], vars: { [name]: K.iA(a) } }));
      st('public void', `Method call: ${name} = ${before}`);
      st('Arrays.sort', `Arrays.sort(${name}) — library sort (int[] pe dual-pivot quicksort), O(n log n)`);
      a.sort((x, y) => x - y);
      st('Arrays.sort', `Sort ho gaya: ${K.iA(a)}`, { hl: K.rng(0, a.length - 1, 'found'), ret: K.iA(a) });
      return steps;
    },
  });

  L.a3 = {
    kind: 'dsa', title: 'Segregate 0s and 1s', topic: 'Arrays & Two Pointers', diff: 'E',
    url: 'https://www.geeksforgeeks.org/segregate-0s-and-1s-in-an-array-by-traversing-array-once/',
    pattern: 'Two pointers (opposite ends) / partition',
    oneLine: 'start left se 1 dhoondhe, end right se 0 dhoondhe; dono mil gaye toh swap. Ek pass.',
    goal: 'Sirf 0 aur 1 wale array me saare 0 left, saare 1 right — <b>in-place</b>. Asli seekh: <b>opposite-end two pointers</b> se partition. Yahi QuickSort ka partition step hai aur kal Sort Colors (Dutch flag) ki neev.',
    noteFeedback: 'Tumhara two-pointer bilkul sahi hai. Ek naming point: counting wale ko tumne brute likha — interview me <b>Arrays.sort = Brute</b>, <b>counting (2 pass) = Better</b>, <b>two pointers (1 pass) = Optimal</b> bolo. Counting tabhi chalta hai jab sirf 0/1 numbers ho; records (jaise 0/1 key wale objects) ho toh swap wala hi chalega.',
    problem: {
      statement: 'Given an array <code>arr</code> consisting of only <code>0</code>s and <code>1</code>s in random order, modify the array <b>in-place</b> so that all <code>0</code>s are on the left side and all <code>1</code>s are on the right side. Try to do it by traversing the array <b>only once</b>.',
      examples: [
        { input: 'arr = [0, 0, 1, 1, 0]', output: '[0, 0, 0, 1, 1]', explain: 'After segregation, all 0s are on the left and all 1s are on the right.', viz: { arr: '0, 0, 1, 1, 0' } },
        { input: 'arr = [1, 1, 1, 1]', output: '[1, 1, 1, 1]', explain: 'There are no 0s, so the array stays the same.', viz: { arr: '1, 1, 1, 1' } },
        { input: 'arr = [1, 0, 1, 0, 1, 0]', output: '[0, 0, 0, 1, 1, 1]', explain: 'Apna example: do swaps lagte hain — dry run isi ka hai.', viz: { arr: '1, 0, 1, 0, 1, 0' } },
      ],
      constraints: ['1 <= arr.length <= 10^6', '0 <= arr[i] <= 1'],
    },
    approaches: [
      { level: 'Brute', idea: '<code>Arrays.sort(arr)</code> — 0 pehle, 1 baad me. Kaam karta hai par 0/1 wali jaankari use nahi ki.', time: 'O(n log n)', space: 'O(log n)', code: A3[0] },
      { level: 'Better', idea: 'Pehle pass me 0 gino (zeros), doosre pass me pehle zeros jagah 0, baaki 1 likho. Do pass, values overwrite.', time: 'O(n)', space: 'O(1)', code: A3[1] },
      { level: 'Optimal', idea: 'start left se pehla 1 dhoondhe, end right se pehla 0; dono galat jagah pe hain → swap. Ek pass, swap-based (records ke saath bhi chalta hai).', time: 'O(n)', space: 'O(1)', code: A3[2] },
    ],
    viz: {
      title: 'Segregate 0s and 1s — start / end two pointers',
      inputs: [{ key: 'arr', label: 'arr (sirf 0 / 1)', def: '1, 0, 1, 0, 1, 0' }],
      check: ({ arr }) => (arr.every(v => v === 0 || v === 1) ? '' : 'arr me sirf 0 aur 1 hone chahiye.'),
      run({ arr }) {
        const a = arr.slice(), n = a.length;
        let start, end, temp;
        const V = () => Object.assign({ arr: K.iA(a) }, start !== undefined ? { start, end } : {}, temp !== undefined ? { temp } : {});
        const H = extra => Object.assign(K.rng(0, start - 1, 'done', K.rng(end + 1, n - 1, 'done')), extra || {});
        const PT = () => [{ i: start, label: 'start' }, { i: end, label: 'end' }];
        const { st, steps } = K.tracer(A3[2], o => ({ views: [K.A('arr', a, o.hl, o.ptr)], vars: V() }));
        st('public void segregate0and1', `Method call: arr = ${K.iA(a)}`);
        start = 0; end = n - 1;
        st('int start = 0, end', `start = 0, end = ${end}`, { ptr: PT() });
        while (true) {
          if (!(start < end)) { st('while (start < end) {', `start (${start}) < end (${end}) ✗ → kaam khatam`, { hl: K.rng(0, n - 1, 'found'), ret: K.iA(a) }); break; }
          st('while (start < end) {', `start (${start}) < end (${end}) ✓`, { hl: H(), ptr: PT() });
          while (true) {
            const go = start < end && a[start] === 0;
            st('while (start < end && arr[start] == 0)', go ? `arr[${start}] = 0 → sahi jagah, start++` : start < end ? `arr[${start}] = 1 → ruko, ye 1 galat jagah pe hai` : `start == end → ruko`, { hl: H({ [start]: 'cur' }), ptr: PT() });
            if (!go) break;
            start++;
          }
          while (true) {
            const go = start < end && a[end] === 1;
            st('while (start < end && arr[end] == 1)', go ? `arr[${end}] = 1 → sahi jagah, end--` : start < end ? `arr[${end}] = 0 → ruko, ye 0 galat jagah pe hai` : `start == end → ruko`, { hl: H({ [end]: 'cur' }), ptr: PT() });
            if (!go) break;
            end--;
          }
          if (start < end) {
            st('if (start < end) {', `start (${start}) < end (${end}) ✓ → dono galat jagah pe → swap`, { hl: H({ [start]: 'cur', [end]: 'cur' }), ptr: PT() });
            temp = a[start];
            st('int temp = arr[start]', `temp = arr[${start}] = ${temp}`, { hl: H({ [start]: 'cur', [end]: 'cur' }), ptr: PT() });
            a[start] = a[end];
            st('arr[start] = arr[end]', `arr[${start}] = arr[${end}] = ${a[start]}`, { hl: H({ [start]: 'new', [end]: 'cur' }), ptr: PT() });
            a[end] = temp;
            st('arr[end] = temp', `arr[${end}] = temp = ${temp} → swap done`, { hl: H({ [start]: 'new', [end]: 'new' }), ptr: PT() });
            start++;
            st(['start++;', 2], `start++ → ${start}`, { hl: H(), ptr: PT() });
            end--;
            temp = undefined;
            st(['end--;', 2], `end-- → ${end}`, { hl: H(), ptr: PT() });
          } else {
            st('if (start < end) {', `start (${start}) < end (${end}) ✗ → swap ki zaroorat nahi`, { hl: H(), ptr: PT() });
          }
        }
        return steps;
      },
      variants: [
        sortBrute(A3[0], 'arr', 'Arrays.sort'),
        {
          ap: 1, label: 'Counting (2 pass)',
          run({ arr }) {
            const a = arr.slice(), n = a.length;
            let zeros, x, i;
            const V = () => Object.assign({ arr: K.iA(a) }, zeros !== undefined ? { zeros } : {}, x !== undefined ? { x } : {}, i !== undefined ? { i } : {});
            const { st, steps } = K.tracer(A3[1], o => ({ views: [K.A('arr', a, o.hl, o.ptr)], vars: V() }));
            st('public void segregate0and1', `Method call: arr = ${K.iA(a)}`);
            zeros = 0;
            st('int zeros = 0', 'Pass 1: 0 ginenge');
            a.forEach((v, idx) => {
              x = v;
              if (v === 0) zeros++;
              st('for (int x : arr) if (x == 0) zeros++', v === 0 ? `x = 0 → zeros++ → ${zeros}` : `x = 1 → skip`, { hl: { [idx]: 'cur' } });
            });
            x = undefined;
            for (i = 0; ; i++) {
              if (!(i < n)) { st('for (int i = 0', `i = ${i}: ✗ → Pass 2 khatam`, { hl: K.rng(0, n - 1, 'found'), ret: K.iA(a) }); break; }
              st('for (int i = 0', `i = ${i}: ${i} < ${n} ✓`, { hl: K.rng(0, i - 1, 'done', { [i]: 'cur' }), ptr: [{ i, label: 'i' }] });
              a[i] = i < zeros ? 0 : 1;
              st('arr[i] = (i < zeros)', `${i} < ${zeros}? ${i < zeros ? 'haan → 0' : 'nahi → 1'} — arr[${i}] = ${a[i]}`, { hl: K.rng(0, i - 1, 'done', { [i]: 'new' }), ptr: [{ i, label: 'i' }] });
            }
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Two pointers from opposite ends (partition)', blocks: [
        { p: 'Do pointer: <b>start</b> left se, <b>end</b> right se. Rule: start ke <b>left</b> me sab sahi (0), end ke <b>right</b> me sab sahi (1). Beech ka hissa abhi "unknown" hai. Har kadam unknown hissa chhota karta hai.' },
        { pre: `[ 0 0 0 | ? ? ? ? | 1 1 ]
          start      end
  0..start-1 = 0     end+1..n-1 = 1` },
        { p: 'start ko jab 1 mile aur end ko jab 0 mile — dono <b>galat side</b> pe hain. Ek swap = dono sahi. Isliye ek hi pass kaafi hai.' },
        { tip: 'Yahi <b>partition</b> idea QuickSort me hai (pivot se chhote left, bade right) aur kal <b>Sort Colors</b> me 3 hisson me.' },
      ] },
      { title: '📄 Problem — Segregate 0s and 1s (GfG)', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — sort' },
        { p: '0 &lt; 1, toh sort karte hi 0 left, 1 right. <code>Arrays.sort</code> → <b>O(n log n)</b>. Kaam karta hai, par humne ye fayda nahi uthaya ki sirf <b>do hi values</b> hain.' },
        { h: '2. Better — gin ke likho (counting)' },
        { p: 'Sirf 0 aur 1 hain → pehle pass me 0 gino (<code>zeros</code>), doosre pass me index &lt; zeros pe 0, baaki pe 1. <b>O(n)</b>, O(1). Dikkat: <b>do pass</b>, aur values overwrite hoti hain — agar har element ke saath koi data ho (jaise employee record jiska key 0/1) toh data kho jayega.' },
        { h: '3. Optimal — opposite-end two pointers' },
        { p: 'Ek hi pass me: start left se tab tak badhe jab tak 0 mile; end right se tab tak ghate jab tak 1 mile. Ab <code>arr[start] = 1</code> aur <code>arr[end] = 0</code> — swap, phir dono aage. <b>O(n)</b>, O(1), sirf swaps (records safe).' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — arr = [1, 0, 1, 0, 1, 0] (Optimal)', blocks: [
        { table: { head: ['Round', 'start ruka (arr[start])', 'end ruka (arr[end])', 'Action', 'Array baad me', 'start, end'], rows: [
          ['start', '—', '—', 'start = 0, end = 5', '[1,0,1,0,1,0]', '0, 5'],
          ['1', '0 (=1)', '5 (=0)', 'swap(0, 5)', '[0,0,1,0,1,1]', '1, 4'],
          ['2', '1→2: arr[1]=0 skip, ruka 2 (=1)', '4→3: arr[4]=1 skip, ruka 3 (=0)', 'swap(2, 3)', '[0,0,0,1,1,1]', '3, 2'],
          ['3', '—', '—', 'start (3) &lt; end (2) ✗ → stop', '<b>[0,0,0,1,1,1]</b>', ''],
        ] } },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: A3[2] },
        { lines: [
          ['int start = 0, end = arr.length - 1;', 'Dono ends se shuru.'],
          ['while (start < end)', 'Jab tak beech me unknown hissa bacha hai.'],
          ['while (start < end && arr[start] == 0) start++;', 'Left ke sahi 0 chhod do — pehla galat (1) dhoondho. <code>start &lt; end</code> pehle, taaki bahar na nikle.'],
          ['while (start < end && arr[end] == 1) end--;', 'Right ke sahi 1 chhod do — pehla galat (0) dhoondho.'],
          ['if (start < end)', 'Dono mile aur abhi cross nahi hue → swap ka matlab banta hai.'],
          ['int temp = arr[start]; … arr[end] = temp;', 'Teen line ka swap.'],
          ['start++; end--;', 'Dono positions ab sahi — aage badho.'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 2 },
        { tip: 'Tabs: <b>Brute (sort) → Better (counting) → Optimal</b>. Green = sahi jagah settle ho chuka. Apna input: <code>0, 0, 0</code> ya <code>1, 0</code>.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Sab 0 <code>[0,0,0]</code>: start end tak chala jayega, swap nahi.',
          'Sab 1 <code>[1,1,1,1]</code>: end start tak aa jayega, swap nahi.',
          'Ek element <code>[1]</code>: start = end = 0 → loop chalega hi nahi.',
          'Already sorted <code>[0,0,1,1]</code>: koi swap nahi.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Inner while me <code>start &lt; end</code> bhool jana → sab 0 wale array me index bahar (ArrayIndexOutOfBounds).',
          'Swap ke baad start++ / end-- bhool jana → infinite loop nahi, par faltu checks.',
          'Counting ko "Optimal" bolna — interviewer "single pass" ya "objects ke saath" puchega.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Passes'], rows: [
          ['Brute (sort)', 'O(n log n)', 'O(log n) (sort ka stack)', '—'],
          ['Better (counting)', 'O(n)', 'O(1)', '2'],
          ['Optimal (two pointers)', 'O(n)', 'O(1)', '1 (har element max ek baar dekha)'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why is counting not enough if it is already O(n)?', 'It needs two passes and it overwrites values. If each element carries extra data (an object with a 0/1 key), counting loses that data; swapping keeps it.'],
          ['Why check start < end inside the inner loops?', 'Without it, an array of all 0s moves start past the end and causes an index-out-of-bounds error.'],
          ['Is this algorithm stable?', 'No. Swapping can change the relative order of equal keys. If stability matters, use a counting or extra-array approach.'],
          ['How is this related to QuickSort?', 'It is the partition step: elements smaller than the pivot go left and larger ones go right, using two pointers.'],
          ['How many swaps happen in the worst case?', 'At most n/2, because each swap fixes two elements.'],
          ['How would you extend it to 0s, 1s and 2s?', 'Use the Dutch National Flag algorithm with three pointers low, mid and high (LC 75 Sort Colors).'],
          ['What about moving all negatives before positives?', 'Same partition: the left pointer looks for a positive, the right pointer looks for a negative, then swap.'],
          ['Time and space complexity?', 'O(n) time with a single pass and O(1) extra space.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Sorting works in O(n log n), and counting zeros works in O(n) but needs two passes and overwrites the values. I use two pointers from both ends: start moves right while it sees 0s, end moves left while it sees 1s. When both stop, start is on a 1 and end is on a 0, so I swap them and move both. Each element is visited at most once, so it is O(n) time, O(1) space, in a single pass.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['arr = [0, 1, 1, 0, 1] — kitne swaps lagenge?', '<b>1 swap</b>: start index 1 pe ruka (1), end index 3 pe ruka (0) → swap → [0, 0, 1, 1, 1].'],
          ['Inner while me <code>start &lt; end</code> hata do toh [0, 0, 0] pe kya hoga?', 'start 0 → 1 → 2 → 3 jaayega aur <code>arr[3]</code> padhne pe <b>ArrayIndexOutOfBoundsException</b>.'],
          ['Negatives left, positives right — kaunsi condition badlegi?', 'start ke liye <code>arr[start] &lt; 0</code> pe aage badho, end ke liye <code>arr[end] &gt;= 0</code> pe peeche.'],
        ] },
        { olist: ['Optimal code 4 min me bina dekhe likho.', 'Kal ke Sort Colors se pehle socho: teesri value (2) aaye toh kitne pointers chahiye?'] },
      ] },
    ],
    checks: [
      'Sort → Counting → Two pointers ka farak (passes + records) bol sakta hoon',
      'Inner while me <code>start &lt; end</code> kyun zaroori hai — samjha',
      'Dry run [1,0,1,0,1,0] khud kar sakta hoon (2 swaps)',
      'Code 4 min me bina dekhe likh sakta hoon',
    ],
    memory: 'Left 1 dhoondhe, right 0 dhoondhe, mile toh swap — ek pass me partition.',
    tests: [
      { run: 'int[] a = {0,0,1,1,0}; o.segregate0and1(a); System.out.print(Arrays.toString(a));', out: '[0, 0, 0, 1, 1]' },
      { run: 'int[] a = {1,1,1,1}; o.segregate0and1(a); System.out.print(Arrays.toString(a));', out: '[1, 1, 1, 1]' },
      { run: 'int[] a = {1,0,1,0,1,0}; o.segregate0and1(a); System.out.print(Arrays.toString(a));', out: '[0, 0, 0, 1, 1, 1]' },
      { run: 'int[] a = {0,0,0}; o.segregate0and1(a); System.out.print(Arrays.toString(a));', out: '[0, 0, 0]' },
      { run: 'int[] a = {1}; o.segregate0and1(a); System.out.print(Arrays.toString(a));', out: '[1]' },
    ],
  };

  // =====================================================================
  // a4 — Sort Colors (LC 75) — Dutch National Flag
  // =====================================================================
  const A4 = [
    `public void sortColors(int[] nums) {
    Arrays.sort(nums);
}`,
    `public void sortColors(int[] nums) {
    int c0 = 0, c1 = 0, c2 = 0;
    for (int x : nums) {
        if (x == 0) c0++;
        else if (x == 1) c1++;
        else c2++;
    }
    int k = 0;
    while (c0 > 0) { nums[k++] = 0; c0--; }
    while (c1 > 0) { nums[k++] = 1; c1--; }
    while (c2 > 0) { nums[k++] = 2; c2--; }
}`,
    `public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            int t = nums[low];
            nums[low] = nums[mid];
            nums[mid] = t;
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            int t = nums[mid];
            nums[mid] = nums[high];
            nums[high] = t;
            high--;
        }
    }
}`,
  ];

  L.a4 = {
    kind: 'dsa', title: 'Sort Colors', topic: 'Arrays & Two Pointers', diff: 'M', lc: 75,
    url: 'https://leetcode.com/problems/sort-colors/',
    pattern: 'Dutch National Flag (3 pointers)',
    oneLine: 'low, mid, high: 0 → swap(low, mid), low++ mid++ · 1 → mid++ · 2 → swap(mid, high), sirf high--.',
    goal: '0, 1, 2 wale array ko <b>ek pass</b> me, <b>in-place</b>, bina library sort ke sort karo. Asli seekh: <b>Dutch National Flag</b> — kal ke 2-hisse wale partition ko 3 hisson me badhana.',
    noteFeedback: 'Dutch flag ka rule tumne sahi likha: 0 → swap(low, mid), <code>low++ mid++</code>; 1 → <code>mid++</code>; 2 → swap(mid, high), <b>sirf</b> <code>high--</code>. Bas <b>kyun</b> bhi yaad rakho: high se aaya element abhi check nahi hua, isliye 2 wale swap ke baad mid aage nahi badhta. (Counting ko yahan bhi <b>Better</b> bolo, Brute = sort.)',
    problem: {
      statement: 'Given an array <code>nums</code> with <code>n</code> objects colored red, white, or blue, sort them <b>in-place</b> so that objects of the same color are adjacent, with the colors in the order red, white, and blue.<br><br>We will use the integers <code>0</code>, <code>1</code>, and <code>2</code> to represent the color red, white, and blue, respectively.<br><br>You must solve this problem without using the library\'s sort function.<br><br><b>Follow up:</b> Could you come up with a one-pass algorithm using only constant extra space?',
      examples: [
        { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]', explain: 'All 0s first, then 1s, then 2s.', viz: { nums: '2, 0, 2, 1, 1, 0' } },
        { input: 'nums = [2,0,1]', output: '[0,1,2]', explain: 'Each color appears once.', viz: { nums: '2, 0, 1' } },
      ],
      constraints: ['n == nums.length', '1 <= n <= 300', 'nums[i] is either 0, 1, or 2.'],
    },
    approaches: [
      { level: 'Brute', idea: '<code>Arrays.sort(nums)</code>. Problem ise mana karta hai — sirf baseline ke liye.', time: 'O(n log n)', space: 'O(log n)', code: A4[0] },
      { level: 'Better', idea: 'Pass 1: c0, c1, c2 gino. Pass 2: c0 baar 0, c1 baar 1, c2 baar 2 likho.', time: 'O(n)', space: 'O(1)', code: A4[1] },
      { level: 'Optimal', idea: 'Dutch National Flag: low = agla 0 ki jagah, mid = scanner, high = agla 2 ki jagah. Ek pass, sirf swaps.', time: 'O(n)', space: 'O(1)', code: A4[2] },
    ],
    viz: {
      title: 'Sort Colors — Dutch National Flag (low, mid, high)',
      inputs: [{ key: 'nums', label: 'nums (sirf 0 / 1 / 2)', def: '2, 0, 2, 1, 1, 0' }],
      check: ({ nums }) => (nums.every(v => v === 0 || v === 1 || v === 2) ? '' : 'nums me sirf 0, 1, 2 hone chahiye.'),
      run({ nums }) {
        const a = nums.slice(), n = a.length;
        let low, mid, high, t;
        const V = () => Object.assign({ nums: K.iA(a) }, low !== undefined ? { low, mid, high } : {}, t !== undefined ? { t } : {});
        const H = extra => Object.assign(K.rng(0, low - 1, 'done', K.rng(low, mid - 1, 'win', K.rng(high + 1, n - 1, 'found'))), extra || {});
        const PT = () => [{ i: low, label: 'low' }, { i: mid, label: 'mid' }, { i: high, label: 'high' }];
        const { st, steps } = K.tracer(A4[2], o => ({ views: [K.A('nums', a, o.hl, o.ptr)], vars: V() }));
        st('public void sortColors', `Method call: nums = ${K.iA(a)}`);
        low = 0; mid = 0; high = n - 1;
        st('int low = 0, mid = 0, high', `low = 0, mid = 0, high = ${high} — poora array abhi "unknown"`, { ptr: PT() });
        while (true) {
          if (!(mid <= high)) { st('while (mid <= high)', `mid (${mid}) <= high (${high}) ✗ → unknown hissa khatam`, { hl: K.rng(0, n - 1, 'found'), ret: K.iA(a) }); break; }
          st('while (mid <= high)', `mid (${mid}) <= high (${high}) ✓`, { hl: H({ [mid]: 'cur' }), ptr: PT() });
          if (a[mid] === 0) {
            st('if (nums[mid] == 0)', `nums[${mid}] = 0 → low wale hisse me bhejo`, { hl: H({ [mid]: 'cur' }), ptr: PT() });
            t = a[low];
            st('int t = nums[low]', `t = nums[${low}] = ${t}`, { hl: H({ [low]: 'cur', [mid]: 'cur' }), ptr: PT() });
            a[low] = a[mid];
            st('nums[low] = nums[mid]', `nums[${low}] = ${a[low]}`, { hl: H({ [low]: 'new', [mid]: 'cur' }), ptr: PT() });
            a[mid] = t;
            st('nums[mid] = t', `nums[${mid}] = ${t} → swap(low, mid) done`, { hl: H({ [low]: 'new', [mid]: 'new' }), ptr: PT() });
            low++;
            st('low++', `low++ → ${low}`, { hl: H(), ptr: PT() });
            mid++;
            t = undefined;
            st(['mid++;', 1], `mid++ → ${mid} (low se aaya element 1 hi tha — checked)`, { hl: H(), ptr: PT() });
          } else {
            st('if (nums[mid] == 0)', `nums[${mid}] = ${a[mid]} ≠ 0`, { hl: H({ [mid]: 'cur' }), ptr: PT() });
            if (a[mid] === 1) {
              st('else if (nums[mid] == 1)', `nums[${mid}] = 1 → sahi jagah (beech)`, { hl: H({ [mid]: 'cur' }), ptr: PT() });
              mid++;
              st(['mid++;', 2], `mid++ → ${mid}`, { hl: H(), ptr: PT() });
            } else {
              st('else if (nums[mid] == 1)', `nums[${mid}] = 2 → high wale hisse me bhejo`, { hl: H({ [mid]: 'cur' }), ptr: PT() });
              t = a[mid];
              st('int t = nums[mid]', `t = nums[${mid}] = ${t}`, { hl: H({ [mid]: 'cur', [high]: 'cur' }), ptr: PT() });
              a[mid] = a[high];
              st('nums[mid] = nums[high]', `nums[${mid}] = nums[${high}] = ${a[mid]}`, { hl: H({ [mid]: 'new', [high]: 'cur' }), ptr: PT() });
              a[high] = t;
              st('nums[high] = t', `nums[${high}] = ${t} → swap(mid, high) done`, { hl: H({ [mid]: 'new', [high]: 'new' }), ptr: PT() });
              high--;
              t = undefined;
              st('high--', `high-- → ${high}. mid NAHI badha — nums[${mid}] = ${a[mid]} abhi check karna baaki hai`, { hl: H({ [mid]: 'cur' }), ptr: PT() });
            }
          }
        }
        return steps;
      },
      variants: [
        sortBrute(A4[0], 'nums', 'Arrays.sort'),
        {
          ap: 1, label: 'Counting (2 pass)',
          run({ nums }) {
            const a = nums.slice();
            let c0, c1, c2, x, k;
            const V = () => Object.assign({ nums: K.iA(a) }, c0 !== undefined ? { c0, c1, c2 } : {}, x !== undefined ? { x } : {}, k !== undefined ? { k } : {});
            const { st, steps } = K.tracer(A4[1], o => ({ views: [K.A('nums', a, o.hl, o.ptr)], vars: V() }));
            st('public void sortColors', `Method call: nums = ${K.iA(a)}`);
            c0 = 0; c1 = 0; c2 = 0;
            st('int c0 = 0', 'Pass 1: teeno colors gino');
            a.forEach((v, idx) => {
              x = v;
              const P = { hl: { [idx]: 'cur' } };
              st('for (int x : nums)', `x = nums[${idx}] = ${v}`, P);
              if (v === 0) { c0++; st('if (x == 0) c0++', `x == 0 ✓ → c0 = ${c0}`, P); return; }
              st('if (x == 0) c0++', `x == 0 ✗`, P);
              if (v === 1) { c1++; st('else if (x == 1) c1++', `x == 1 ✓ → c1 = ${c1}`, P); return; }
              st('else if (x == 1) c1++', `x == 1 ✗`, P);
              c2++;
              st('else c2++', `toh x = 2 → c2 = ${c2}`, P);
            });
            x = undefined;
            st('for (int x : nums)', `Pass 1 khatam: c0 = ${c0}, c1 = ${c1}, c2 = ${c2}`);
            k = 0;
            st('int k = 0', 'Pass 2: k = agli likhne ki jagah');
            [[0, 'c0'], [1, 'c1'], [2, 'c2']].forEach(([val, name]) => {
              const get = () => (val === 0 ? c0 : val === 1 ? c1 : c2);
              const dec = () => { if (val === 0) c0--; else if (val === 1) c1--; else c2--; };
              const snip = 'while (' + name + ' > 0)';
              while (true) {
                if (!(get() > 0)) {
                  const last = val === 2;
                  st(snip, `${name} = ${get()} → ${name} > 0 ✗`, last ? { hl: K.rng(0, a.length - 1, 'found'), ret: K.iA(a) } : { hl: K.rng(0, k - 1, 'done') });
                  break;
                }
                st(snip, `${name} = ${get()} > 0 ✓`, { hl: K.rng(0, k - 1, 'done'), ptr: [{ i: k, label: 'k' }] });
                a[k] = val; k++; dec();
                st(snip, `nums[${k - 1}] = ${val}, k → ${k}, ${name} → ${get()}`, { hl: K.rng(0, k - 2, 'done', { [k - 1]: 'new' }), ptr: [{ i: k, label: 'k' }] });
              }
            });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Dutch National Flag: 4 hisse, 3 pointers', blocks: [
        { p: 'Kal (Segregate 0s/1s) me 2 hisse the. Ab 3 values hain, toh array ko <b>4 hisson</b> me socho:' },
        { pre: `[ 0 0 | 1 1 1 | ? ? ? ? | 2 2 ]
        low     mid      high
 0..low-1    = 0  (pakka)
 low..mid-1  = 1  (pakka)
 mid..high   = ? (abhi check nahi kiya)
 high+1..n-1 = 2  (pakka)` },
        { p: 'mid unknown ka pehla element dekhta hai:' },
        { list: [
          '<b>0</b> → 0 wale hisse ke end pe bhejo: swap(low, mid), <code>low++</code>, <code>mid++</code>. (low pe hamesha 1 hota hai, ya low == mid — dono case me mid pe jo aaya wo checked hai.)',
          '<b>1</b> → pehle se sahi jagah: sirf <code>mid++</code>.',
          '<b>2</b> → 2 wale hisse ke shuru me bhejo: swap(mid, high), sirf <code>high--</code>. <b>mid++ nahi</b> — high se aaya element unknown tha, use abhi check karna hai.',
        ] },
        { tip: 'Loop <code>mid &lt;= high</code> tak — jab unknown hissa khaali ho gaya, array sorted.' },
      ] },
      { title: '📄 Problem — LC 75 Sort Colors', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — sort' },
        { p: '<code>Arrays.sort</code>, <b>O(n log n)</b>. Problem saaf mana karta hai, par interview me baseline ke taur pe bolna theek hai.' },
        { h: '2. Better — counting (tumhara "brute")' },
        { p: 'Sirf 3 values → c0, c1, c2 gino, phir array overwrite karo. <b>O(n)</b>, O(1). Par <b>do pass</b> — follow-up "one pass" maangta hai.' },
        { h: '3. Optimal — Dutch National Flag' },
        { p: 'Segregate 0s/1s wala idea, par 3 hisse: low (0 ki agli jagah), mid (scanner), high (2 ki agli jagah). Har step pe unknown hissa ek chhota hota hai → ek pass, <b>O(n)</b>, O(1).' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [2, 0, 2, 1, 1, 0] (Optimal)', blocks: [
        { table: { head: ['Step', 'low', 'mid', 'high', 'nums[mid]', 'Action', 'Array baad me'], rows: [
          ['start', '0', '0', '5', '—', '—', '[2,0,2,1,1,0]'],
          ['1', '0', '0', '5', '2', 'swap(0,5), high--', '[0,0,2,1,1,2]'],
          ['2', '0', '0', '4', '0', 'swap(0,0), low++ mid++', '[0,0,2,1,1,2]'],
          ['3', '1', '1', '4', '0', 'swap(1,1), low++ mid++', '[0,0,2,1,1,2]'],
          ['4', '2', '2', '4', '2', 'swap(2,4), high--', '[0,0,1,1,2,2]'],
          ['5', '2', '2', '3', '1', 'mid++', '[0,0,1,1,2,2]'],
          ['6', '2', '3', '3', '1', 'mid++', '[0,0,1,1,2,2]'],
          ['end', '2', '4', '3', '—', 'mid (4) &gt; high (3) → stop', '<b>[0,0,1,1,2,2]</b>'],
        ] } },
        { tip: 'Step 1 ke baad mid = 0 hi raha — high se 0 aaya tha, jo step 2 me check hua. Agar mid++ kar dete toh wo 0 galat jagah reh jaata.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: A4[2] },
        { lines: [
          ['int low = 0, mid = 0, high = nums.length - 1;', 'Shuru me koi hissa pakka nahi — sab unknown (mid..high).'],
          ['while (mid <= high)', 'Unknown hissa bacha hai tab tak.'],
          ['if (nums[mid] == 0) { swap(low, mid); low++; mid++; }', '0 ko 0-hisse ke end pe bhejo. low pe 1 tha (ya low == mid), wo mid pe aaya — checked, isliye mid++ safe.'],
          ['else if (nums[mid] == 1) mid++;', '1 already beech wale hisse me hai.'],
          ['else { swap(mid, high); high--; }', '2 ko end pe bhejo. Jo high se aaya wo unknown hai → mid wahi raho.'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 0 },
        { tip: 'Colors: 0-hissa (done), 1-hissa (window), 2-hissa (green). Tabs me <b>Brute → Better → Optimal</b>. Apna input: <code>2, 2, 0, 0</code> — dekho mid kitni baar ruka.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Ek element <code>[1]</code>: ek check, mid++ → done.',
          'Sab 2 <code>[2,2,2]</code>: har step high-- , mid 0 hi rehta → 3 swaps (khud se bhi), sahi.',
          'Already sorted <code>[0,1,2]</code>: koi asli swap nahi.',
          'Reverse <code>[2,1,0]</code>: swap(0,2) → [0,1,2], phir low++ mid++ … sahi.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '2 wale swap ke baad <b>mid++</b> kar dena → [2,0] jaise inputs galat.',
          'Loop condition <code>mid &lt; high</code> → aakhri element check nahi hota ([1,0] fail).',
          '0 wale case me sirf low++ karna aur mid nahi → mid low se peeche reh sakta hai.',
          'Counting ko "one-pass" bolna — wo do pass hai.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Passes'], rows: [
          ['Brute (sort)', 'O(n log n)', 'O(log n)', '—'],
          ['Better (counting)', 'O(n)', 'O(1)', '2'],
          ['Optimal (Dutch flag)', 'O(n)', 'O(1)', '1 — har step pe mid++ ya high--, max n steps'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why don\'t you increment mid after swapping with high?', 'The value that came from high has not been examined yet, so mid must look at it in the next iteration.'],
          ['Why is it safe to increment mid after swapping with low?', 'Everything between low and mid − 1 is 1 (or low equals mid), so the value that comes to mid is already known.'],
          ['Why is the loop condition mid <= high and not mid < high?', 'The element at index high is still unknown when mid equals high; with < we would skip it.'],
          ['Why is this O(n)?', 'Every iteration either increments mid or decrements high, so the unknown region shrinks by one each time — at most n iterations.'],
          ['Is the algorithm stable?', 'No, swaps can reorder equal elements. That does not matter for plain integers.'],
          ['How would you sort k colors?', 'Counting sort in O(n + k), or repeat partitioning; Dutch flag is specific to three groups.'],
          ['Where else does three-way partitioning help?', 'In QuickSort with many duplicate keys: elements smaller than, equal to and greater than the pivot.'],
          ['Why not just use counting, it is also O(n)?', 'It needs two passes and rewrites values; the follow-up asks for one pass, and swapping keeps attached data intact.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Sorting is O(n log n) and counting is O(n) but needs two passes. For one pass I use the Dutch National Flag algorithm with three pointers: low is where the next 0 goes, high is where the next 2 goes, and mid scans the unknown part. If nums[mid] is 0, I swap it with low and move both forward; if it is 1, I just move mid; if it is 2, I swap it with high and only move high back, because the swapped value is still unchecked. It runs in O(n) time with O(1) extra space.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [2, 0, 1] — Dutch flag me kitne iterations?', '3: mid=0 (2) swap(0,2) → [1,0,2], high=1 · mid=0 (1) mid++ · mid=1 (0) swap(0,1) → [0,1,2], low=1 mid=2 · mid (2) &gt; high (1) stop.'],
          ['Galti se 2 wale case me mid++ bhi kar diya — <code>[1, 2, 0]</code> ka output kya aayega?', 'mid=0 (1) → mid++ · mid=1 (2) → swap(1,2) → [1,0,2], high=1, aur galat mid++ → mid=2 · mid (2) &gt; high (1) → stop → <b>[1, 0, 2] ✗</b>. High se aaya 0 kabhi check hi nahi hua.'],
          ['0 aur 2 ke beech 1 hamesha kyun sahi aa jaata hai?', 'Kyunki 0 left aur 2 right bhej diye — jo bacha wo sirf 1 ho sakta hai, aur wo low..high ke beech hi rehta hai.'],
        ] },
        { olist: ['Optimal code 5 min me bina dekhe likho.', 'Dry run table khud banao [2, 0, 2, 1, 1, 0] ke liye — 6 steps.'] },
      ] },
    ],
    checks: [
      '4 hisse (0 | 1 | unknown | 2) aur low/mid/high ka matlab bol sakta hoon',
      '2 ke swap ke baad mid kyun nahi badhta — example ke saath samjha sakta hoon',
      'Loop <code>mid &lt;= high</code> kyun — samjha',
      'Code 5 min me bina dekhe likh sakta hoon',
    ],
    memory: '0 → low se swap, dono aage; 1 → mid aage; 2 → high se swap, sirf high peeche.',
    tests: [
      { run: 'int[] a = {2,0,2,1,1,0}; o.sortColors(a); System.out.print(Arrays.toString(a));', out: '[0, 0, 1, 1, 2, 2]' },
      { run: 'int[] a = {2,0,1}; o.sortColors(a); System.out.print(Arrays.toString(a));', out: '[0, 1, 2]' },
      { run: 'int[] a = {1,2,0}; o.sortColors(a); System.out.print(Arrays.toString(a));', out: '[0, 1, 2]' },
      { run: 'int[] a = {2,2,2}; o.sortColors(a); System.out.print(Arrays.toString(a));', out: '[2, 2, 2]' },
      { run: 'int[] a = {1}; o.sortColors(a); System.out.print(Arrays.toString(a));', out: '[1]' },
    ],
  };
})();
