// Planner lessons — Binary Search part 2 (b3 First and Last Position, b4 Search in Rotated Sorted Array, b5 Koko Eating Bananas)
// Format: planner/LESSON_SPEC.md. Viz steps: lesson-kit.js tracer (har line = ek step).
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  // lo..hi range highlight (baaki 'skip'), extra classes upar se
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

  // =====================================================================
  // b3 — Find First and Last Position of Element in Sorted Array (LC 34)
  // =====================================================================
  const B3 = [
    `public int[] searchRange(int[] nums, int target) {
    int first = -1, last = -1;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) {
            if (first == -1) first = i;
            last = i;
        }
    }
    return new int[]{first, last};
}`,
    `public int[] searchRange(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1, idx = -1;
    while (lo <= hi) {                 // step 1: koi bhi ek occurrence
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) {
            idx = mid;
            break;
        }
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    if (idx == -1) return new int[]{-1, -1};
    int first = idx, last = idx;       // step 2: dono taraf phailao
    while (first > 0 && nums[first - 1] == target) first--;
    while (last < nums.length - 1 && nums[last + 1] == target) last++;
    return new int[]{first, last};
}`,
    `public int[] searchRange(int[] nums, int target) {
    int first = findBound(nums, target, true);
    if (first == -1) return new int[]{-1, -1};
    int last = findBound(nums, target, false);
    return new int[]{first, last};
}

private int findBound(int[] nums, int target, boolean isFirst) {
    int lo = 0, hi = nums.length - 1, ans = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) {
            ans = mid;
            if (isFirst) hi = mid - 1; // aur LEFT me pehla dhoondo
            else lo = mid + 1;         // aur RIGHT me aakhri dhoondo
        } else if (nums[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return ans;
}`,
  ];
  const nonDecCheck = ({ nums }) => (nums.every((v, k) => k === 0 || nums[k - 1] <= v) ? '' : 'nums non-decreasing (sorted) hona chahiye.');
  const rangeStr = (a, b) => `[${a}, ${b}]`;

  L.b3 = {
    kind: 'dsa', title: 'First and Last Position in Sorted Array', topic: 'Binary Search', diff: 'M', lc: 34,
    url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
    pattern: 'Binary search — first occurrence + last occurrence (do baar BS)',
    oneLine: 'Do binary search: pehli me target milne pe ans = mid aur LEFT jao (hi = mid − 1) → first; doosri me ans = mid aur RIGHT jao (lo = mid + 1) → last.',
    goal: 'Sorted array (duplicates ke saath) me target ka <b>pehla aur aakhri index</b> nikaalo, warna [−1, −1] — <b>O(log n)</b> me. Asli seekh: b2 (Lower Bound, Day 8) wala trick — <b>"mil gaya toh ruko mat, answer note karke ek taraf dhoondte raho"</b> — ab dono directions me.',
    problem: {
      statement: 'Given an array of integers <code>nums</code> sorted in non-decreasing order, find the starting and ending position of a given <code>target</code> value.<br><br>If <code>target</code> is not found in the array, return <code>[-1, -1]</code>.<br><br>You must write an algorithm with <code>O(log n)</code> runtime complexity.',
      examples: [
        { input: 'nums = [5,7,7,8,8,10], target = 8', output: '[3,4]', explain: '8 index 3 aur 4 pe hai → first = 3, last = 4.', viz: { nums: '5, 7, 7, 8, 8, 10', target: '8' } },
        { input: 'nums = [5,7,7,8,8,10], target = 6', output: '[-1,-1]', explain: '6 array me nahi hai.', viz: { nums: '5, 7, 7, 8, 8, 10', target: '6' } },
        { input: 'nums = [], target = 0', output: '[-1,-1]', explain: 'Khaali array — loop ek baar bhi nahi chalta.', viz: { nums: '', target: '0' } },
        { input: 'Apna example: nums = [2,2,2,2,2,2,2], target = 2', output: '[0,6]', explain: 'Sab target hi hain. Better approach yahan phail-phail ke O(n) ho jaata hai, Optimal phir bhi ~log n steps me.', viz: { nums: '2, 2, 2, 2, 2, 2, 2', target: '2' } },
      ],
      constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9', 'nums is a non-decreasing array.', '-10^9 <= target <= 10^9'],
    },
    approaches: [
      { level: 'Brute', idea: 'Left se right scan: pehli baar target mile toh <code>first = i</code>, har baar mile toh <code>last = i</code>. Sorted hone ka fayda nahi.', time: 'O(n)', space: 'O(1)', code: B3[0] },
      { level: 'Better', idea: 'Normal binary search se <b>koi bhi ek</b> occurrence dhoondo (idx), phir wahan se left aur right linearly phailao jab tak target mile. Average fast, par jitni copies (k) utna kaam.', time: 'O(log n + k), worst O(n)', space: 'O(1)', code: B3[1] },
      { level: 'Optimal', idea: 'Do alag binary search (helper <code>findBound</code>): target mile toh <code>ans = mid</code>, phir <code>isFirst</code> → left (hi = mid − 1), warna right (lo = mid + 1). Pehli call first deti hai, doosri last.', time: 'O(log n)', space: 'O(1)', code: B3[2] },
    ],
    viz: {
      title: 'First & Last — do binary search (findBound)',
      inputs: [{ key: 'nums', label: 'nums (sorted, duplicates ok)', def: '5, 7, 7, 8, 8, 10' }, { key: 'target', label: 'target', def: '8', num: true }],
      check: nonDecCheck,
      run({ nums, target }) {
        const n = nums.length;
        let first, last, isFirst, lo, hi, mid, ans, inH = false;
        const V = () => {
          const v = { nums: K.iA(nums), target };
          if (first !== undefined) v.first = first;
          if (last !== undefined) v.last = last;
          if (inH) {
            v.isFirst = isFirst;
            if (lo !== undefined) Object.assign(v, { lo, hi, ans });
            if (mid !== undefined) v.mid = mid;
          }
          return v;
        };
        const resText = () => (first === undefined ? '-' : first === -1 ? '[-1, -1]' : `first = ${first}, last = ${last === undefined ? '?' : last}`);
        const { st, steps } = K.tracer(B3[2], o => ({ views: [K.A('nums', nums, o.hl, o.ptr), K.X(inH ? `findBound(isFirst = ${isFirst}) — ans ab tak` : 'result', inH ? (ans === undefined ? '-' : ans) : resText())], vars: V() }));
        const outHl = () => {
          const h = {};
          if (first !== undefined && first >= 0) h[first] = 'found';
          if (last !== undefined && last >= 0) h[last] = 'found';
          return { hl: h };
        };
        const P = extra => {
          const h = rangeHl(n, lo, hi, extra);
          if (ans !== undefined && ans >= 0 && !(extra && extra[ans])) h[ans] = 'done';
          const p = bsPtr(n, lo, hi, mid);
          if (ans !== undefined && ans >= 0) p.push({ i: ans, label: 'ans' });
          return { hl: h, ptr: p };
        };
        const bound = flag => {
          inH = true; isFirst = flag; lo = hi = mid = ans = undefined;
          st('private int findBound', `findBound(nums, ${target}, isFirst = ${flag}) — ${flag ? 'PEHLA' : 'AAKHRI'} ${target} dhoondo`, { hl: {} });
          lo = 0; hi = n - 1; ans = -1;
          st('int lo = 0, hi = nums.length - 1, ans = -1', `lo = 0, hi = ${hi}, ans = -1 (abhi kuch nahi mila)`, P());
          while (true) {
            if (!(lo <= hi)) { mid = undefined; st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✗ → search khatam, ans = ${ans}`, P()); break; }
            mid = undefined;
            st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✓`, P());
            mid = lo + Math.floor((hi - lo) / 2);
            st('int mid = lo + (hi - lo) / 2', `mid = ${lo} + (${hi} − ${lo}) / 2 = ${mid} → nums[${mid}] = ${nums[mid]}`, P({ [mid]: 'cur' }));
            if (nums[mid] === target) {
              st('if (nums[mid] == target)', `nums[${mid}] = ${nums[mid]} == ${target} ✓ — ek occurrence mila, par ruko mat`, P({ [mid]: 'found' }));
              ans = mid;
              st('ans = mid;', `ans = ${mid} — candidate note kiya`, P({ [mid]: 'new' }));
              if (flag) {
                hi = mid - 1;
                st('if (isFirst) hi = mid - 1', `isFirst = true → left me isse pehla ${target} ho sakta hai → hi = ${hi}`, P());
              } else {
                st('if (isFirst) hi = mid - 1', `isFirst = false → left nahi, right jayenge`, P({ [mid]: 'cur' }));
                lo = mid + 1;
                st('else lo = mid + 1', `right me isse baad ${target} ho sakta hai → lo = ${lo}`, P());
              }
            } else {
              st('if (nums[mid] == target)', `nums[${mid}] = ${nums[mid]} ≠ ${target}`, P({ [mid]: 'cur' }));
              if (nums[mid] < target) {
                st('} else if (nums[mid] < target)', `${nums[mid]} < ${target} ✓ → target right me`, P({ [mid]: 'cur' }));
                lo = mid + 1;
                st(['lo = mid + 1;', 2], `lo = ${lo}`, P());
              } else {
                st('} else if (nums[mid] < target)', `${nums[mid]} > ${target} → target left me`, P({ [mid]: 'cur' }));
                hi = mid - 1;
                st(['hi = mid - 1;', 2], `hi = ${hi}`, P());
              }
            }
          }
          const r = ans;
          st('return ans', `findBound(isFirst = ${flag}) → return ${r}`, P());
          inH = false; lo = hi = mid = ans = undefined;
          return r;
        };
        st('public int[] searchRange', `Method call: nums = ${K.iA(nums)}, target = ${target}`);
        st('int first = findBound', `findBound(nums, ${target}, true) call — pehla index`);
        const f = bound(true);
        first = f;
        st('int first = findBound', `first = ${first}`, outHl());
        if (first === -1) {
          st('if (first == -1)', `first == -1 ✓ → target hai hi nahi → return [-1, -1]`, { ret: '[-1, -1]' });
          return steps;
        }
        st('if (first == -1)', `first = ${first} ≠ -1 → target hai, ab aakhri dhoondo`, outHl());
        st('int last = findBound', `findBound(nums, ${target}, false) call — aakhri index`, outHl());
        const l = bound(false);
        last = l;
        st('int last = findBound', `last = ${last}`, outHl());
        st('return new int[]{first, last}', `return ${rangeStr(first, last)}`, Object.assign(outHl(), { ret: rangeStr(first, last) }));
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Linear scan',
          run({ nums, target }) {
            const n = nums.length;
            let first, last, i;
            const V = () => Object.assign({ nums: K.iA(nums), target }, first !== undefined ? { first, last } : {}, i !== undefined ? { i } : {});
            const H = cur => {
              const h = K.rng(0, (i === undefined ? n : i) - 1, 'skip');
              if (first >= 0) for (let k = first; k <= last; k++) h[k] = 'found';
              if (cur !== undefined) h[cur] = h[cur] === 'found' ? 'found' : 'cur';
              return h;
            };
            const { st, steps } = K.tracer(B3[0], o => ({ views: [K.A('nums', nums, o.hl, o.ptr), K.X('first / last', first === undefined ? '-' : `${first} / ${last}`)], vars: V() }));
            st('public int[] searchRange', `Method call: nums = ${K.iA(nums)}, target = ${target}`);
            first = -1; last = -1;
            st('int first = -1, last = -1', 'first = -1, last = -1 — abhi kuch nahi mila');
            for (i = 0; ; i++) {
              if (!(i < n)) { st('for (int i', `i = ${i}: ${i} < ${n} ✗ → poora array dekh liya`, { hl: H() }); break; }
              st('for (int i', `i = ${i}: ${i} < ${n} ✓`, { hl: H(i), ptr: [{ i, label: 'i' }] });
              if (nums[i] === target) {
                st('if (nums[i] == target)', `nums[${i}] = ${nums[i]} == ${target} ✓`, { hl: H(i), ptr: [{ i, label: 'i' }] });
                if (first === -1) { first = i; st('if (first == -1) first = i', `first abhi -1 tha → first = ${i} (pehli baar mila)`, { hl: H(i), ptr: [{ i, label: 'i' }] }); }
                else st('if (first == -1) first = i', `first = ${first} pehle se set hai → change nahi`, { hl: H(i), ptr: [{ i, label: 'i' }] });
                last = i;
                st('last = i;', `last = ${i} — har match pe aage badhta hai`, { hl: H(i), ptr: [{ i, label: 'i' }] });
              } else {
                st('if (nums[i] == target)', `nums[${i}] = ${nums[i]} ≠ ${target}`, { hl: H(i), ptr: [{ i, label: 'i' }] });
              }
            }
            i = undefined;
            st('return new int[]{first, last}', `return ${rangeStr(first, last)} (${n} elements dekhe)`, { hl: H(), ret: rangeStr(first, last) });
            return steps;
          },
        },
        {
          ap: 1, label: 'BS + expand',
          run({ nums, target }) {
            const n = nums.length;
            let lo, hi, mid, idx, first, last;
            const V = () => {
              const v = { nums: K.iA(nums), target };
              if (lo !== undefined) Object.assign(v, { lo, hi, idx });
              if (mid !== undefined) v.mid = mid;
              if (first !== undefined) Object.assign(v, { first, last });
              return v;
            };
            const { st, steps } = K.tracer(B3[1], o => ({ views: [K.A('nums', nums, o.hl, o.ptr), K.X('phase', first === undefined ? 'step 1: binary search — koi bhi ek ' + target : `step 2: phailao — [${first} .. ${last}] (${last - first + 1} copies)`)], vars: V() }));
            const P = extra => ({ hl: rangeHl(n, lo, hi, extra), ptr: bsPtr(n, lo, hi, mid) });
            const E = cur => {
              const h = {};
              for (let k = first; k <= last; k++) h[k] = 'found';
              if (cur !== undefined && cur >= 0 && cur < n) h[cur] = 'cur';
              return { hl: h, ptr: [{ i: first, label: 'first' }, { i: last, label: 'last' }] };
            };
            st('public int[] searchRange', `Method call: nums = ${K.iA(nums)}, target = ${target}`);
            lo = 0; hi = n - 1; idx = -1;
            st('int lo = 0, hi = nums.length - 1, idx = -1', `lo = 0, hi = ${hi}, idx = -1`, P());
            while (true) {
              if (!(lo <= hi)) { mid = undefined; st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✗ → koi occurrence nahi mila`, { hl: rangeHl(n, lo, hi), ptr: bsPtr(n, lo, hi) }); break; }
              mid = undefined;
              st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✓`, P());
              mid = lo + Math.floor((hi - lo) / 2);
              st('int mid = lo + (hi - lo) / 2', `mid = ${mid} → nums[${mid}] = ${nums[mid]}`, P({ [mid]: 'cur' }));
              if (nums[mid] === target) {
                st('if (nums[mid] == target)', `nums[${mid}] = ${nums[mid]} == ${target} ✓ — ek occurrence mil gaya`, P({ [mid]: 'found' }));
                idx = mid;
                st('idx = mid', `idx = ${mid}`, P({ [mid]: 'found' }));
                st('break;', 'break — ab binary search ka kaam khatam', P({ [mid]: 'found' }));
                break;
              }
              st('if (nums[mid] == target)', `nums[${mid}] = ${nums[mid]} ≠ ${target}`, P({ [mid]: 'cur' }));
              if (nums[mid] < target) {
                lo = mid + 1;
                st('if (nums[mid] < target)', `${nums[mid]} < ${target} → lo = ${lo}`, P());
              } else {
                st('if (nums[mid] < target)', `${nums[mid]} > ${target} → left half`, P({ [mid]: 'cur' }));
                hi = mid - 1;
                st('else hi = mid - 1', `hi = ${hi}`, P());
              }
            }
            if (idx === -1) {
              st('if (idx == -1)', `idx == -1 ✓ → target nahi → return [-1, -1]`, { ret: '[-1, -1]' });
              return steps;
            }
            st('if (idx == -1)', `idx = ${idx} ≠ -1 → phailana shuru`, { hl: { [idx]: 'found' } });
            first = idx; last = idx;
            st('int first = idx, last = idx', `first = last = ${idx}`, E());
            while (true) {
              if (first > 0 && nums[first - 1] === target) {
                st('while (first > 0', `nums[${first - 1}] = ${nums[first - 1]} == ${target} ✓ → first-- → ${first - 1}`, E(first - 1));
                first--;
              } else {
                st('while (first > 0', first > 0 ? `nums[${first - 1}] = ${nums[first - 1]} ≠ ${target} ✗ → first = ${first} pakka` : `first = 0 — aur left nahi ja sakte ✗`, E());
                break;
              }
            }
            while (true) {
              if (last < n - 1 && nums[last + 1] === target) {
                st('while (last < nums.length - 1', `nums[${last + 1}] = ${nums[last + 1]} == ${target} ✓ → last++ → ${last + 1}`, E(last + 1));
                last++;
              } else {
                st('while (last < nums.length - 1', last < n - 1 ? `nums[${last + 1}] = ${nums[last + 1]} ≠ ${target} ✗ → last = ${last} pakka` : `last = ${n - 1} — array khatam ✗`, E());
                break;
              }
            }
            st('return new int[]{first, last}', `return ${rangeStr(first, last)}`, Object.assign(E(), { ret: rangeStr(first, last) }));
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — First occurrence aur last occurrence', blocks: [
        { p: 'Duplicates wale sorted array me target ki saari copies <b>ek saath (contiguous)</b> hoti hain: <code>[5, 7, 7, <b>8, 8</b>, 10]</code>. Toh answer bas do boundaries hai — copies ka block kahan shuru, kahan khatam.' },
        { pre: `nums:              5   7   7   8   8   10
index:             0   1   2   3   4   5
nums[i] >= 8 ?     F   F   F   T   T   T    <- first = pehla T  = 3
nums[i] >  8 ?     F   F   F   F   F   T    <- (pehla T) − 1    = 4 = last` },
        { p: 'b2 (Lower Bound, Day 8) me seekha tha: <b>mil jaane pe ruko mat</b> — <code>ans = mid</code> note karo aur left me dhoondte raho. Aaj wahi trick do baar: <b>first</b> ke liye mil ke LEFT jao, <b>last</b> ke liye mil ke RIGHT jao.' },
        { table: { head: ['', 'b1 Binary Search', 'first (isFirst = true)', 'last (isFirst = false)'], rows: [
          ['nums[mid] == target', 'return mid', 'ans = mid, hi = mid − 1', 'ans = mid, lo = mid + 1'],
          ['nums[mid] &lt; target', 'lo = mid + 1', 'lo = mid + 1', 'lo = mid + 1'],
          ['nums[mid] &gt; target', 'hi = mid − 1', 'hi = mid − 1', 'hi = mid − 1'],
        ] } },
        { tip: '<b>Doosra tareeka (b2 se seedha):</b> first = lowerBound(target), last = lowerBound(target + 1) − 1. Agar first == n ya nums[first] != target → [−1, −1]. Same O(log n). (target = 10⁹ ho toh target + 1 int me fit hai, par Integer.MAX_VALUE pe dhyaan — isliye isFirst wala version safe hai.)' },
      ] },
      { title: '📄 Problem — LC 34 Find First and Last Position of Element in Sorted Array', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — linear scan' },
        { p: 'Poora array chalo: pehla match → <code>first</code>, har match → <code>last</code>. <b>O(n)</b> time, O(1) space. Problem O(log n) maangta hai.' },
        { h: '2. Better — binary search + phailao' },
        { p: 'b1 wala binary search se <b>koi bhi ek</b> 8 dhoondo (O(log n)), phir wahan se left-left aur right-right chalo jab tak 8 mile. Agar target ki copies kam hain toh bahut fast. Par <code>[2,2,2,…,2]</code> (10⁵ copies) pe phailana hi O(n) → <b>O(log n + k)</b>, worst <b>O(n)</b>. Ye genuinely alag idea aur alag complexity hai — isliye Better.' },
        { h: '3. Optimal — do baar binary search' },
        { p: 'Phailane wala linear kaam bhi binary search se karo. Ek helper <code>findBound(nums, target, isFirst)</code>: match pe <code>ans = mid</code>; <code>isFirst</code> → <code>hi = mid − 1</code> (left me aur pehla ho sakta hai), warna <code>lo = mid + 1</code> (right me aur baad wala). Do calls → 2 × O(log n) = <b>O(log n)</b>, O(1). Copies kitni bhi hon, farak nahi.' },
        { tip: 'Pehli call −1 de toh doosri call ki zaroorat hi nahi — target hai hi nahi. Isliye <code>if (first == -1) return [-1, -1]</code> beech me.' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [5, 7, 7, 8, 8, 10], target = 8 (Optimal)', blocks: [
        { p: '<b>findBound(isFirst = true)</b>' },
        { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'Compare', 'Action', 'ans'], rows: [
          ['0', '5', '2', '7', '7 &lt; 8', 'lo = 3', '-1'],
          ['3', '5', '4', '8', '<b>== 8</b>', 'ans = 4, hi = 3 (left)', '4'],
          ['3', '3', '3', '8', '<b>== 8</b>', 'ans = 3, hi = 2 (left)', '3'],
          ['3', '2', '—', '—', 'lo &gt; hi', 'return', '<b>3</b>'],
        ] } },
        { p: '<b>findBound(isFirst = false)</b>' },
        { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'Compare', 'Action', 'ans'], rows: [
          ['0', '5', '2', '7', '7 &lt; 8', 'lo = 3', '-1'],
          ['3', '5', '4', '8', '<b>== 8</b>', 'ans = 4, lo = 5 (right)', '4'],
          ['5', '5', '5', '10', '10 &gt; 8', 'hi = 4', '4'],
          ['5', '4', '—', '—', 'lo &gt; hi', 'return', '<b>4</b>'],
        ] } },
        { p: 'Result: <b>[3, 4]</b>. target = 6 pe pehli call hi −1 deti hai → seedha [−1, −1].' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: B3[2] },
        { lines: [
          ['int first = findBound(nums, target, true);', 'Pehla index jahan target hai (ya −1).'],
          ['if (first == -1) return new int[]{-1, -1};', 'Target hai hi nahi — doosri search bekaar.'],
          ['int last = findBound(nums, target, false);', 'Aakhri index — ab pakka milega.'],
          ['return new int[]{first, last};', 'Dono boundaries.'],
          ['int lo = 0, hi = nums.length - 1, ans = -1;', 'Closed range [lo, hi]; ans = ab tak ka best match.'],
          ['while (lo <= hi)', 'Range khaali hone tak — b1 jaisa.'],
          ['int mid = lo + (hi - lo) / 2;', 'Overflow-safe mid.'],
          ['if (nums[mid] == target) {', 'Match — par ye pehla/aakhri hai ya nahi, pata nahi.'],
          ['ans = mid;', 'Candidate save.'],
          ['if (isFirst) hi = mid - 1;', 'First chahiye → left half me aur dhoondo.'],
          ['else lo = mid + 1;', 'Last chahiye → right half me aur dhoondo.'],
          ['} else if (nums[mid] < target) {', 'mid chhota → target right me.'],
          ['lo = mid + 1;', 'Left half phenko.'],
          ['hi = mid - 1;', 'mid bada → right half phenko.'],
          ['return ans;', 'Sabse left (ya right) match, ya −1.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute, Better aur Optimal line by line', blocks: [
        { viz: 3 },
        { tip: 'Apna example <code>[2,2,2,2,2,2,2]</code> teeno tabs me chalao: Better ka "phailao" phase 6 baar chalta hai (O(n) jaisa), Optimal har findBound me sirf 3 mid dekhta hai. Optimal tab me <b>ans</b> pointer dekho — first ke liye left khisakta hai, last ke liye right.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Khaali array <code>[]</code> → hi = −1, loop chalta hi nahi → [−1, −1].',
          'Ek element: <code>[1]</code>, 1 → [0, 0]; <code>[1]</code>, 0 → [−1, −1].',
          'Saare elements target: <code>[2,2,2]</code>, 2 → [0, 2].',
          'Target sirf pehle / aakhri index pe: <code>[1,2,3]</code>, 1 → [0, 0]; 3 → [2, 2].',
          'Target range ke bahar (sabse chhota se chhota ya bade se bada) → [−1, −1].',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Match pe turant <code>return mid</code> → koi bhi ek occurrence milta hai, pehla/aakhri nahi.',
          'Match pe dono searches me <code>hi = mid − 1</code> → last bhi first ban jaata hai.',
          '<code>ans</code> ko 0 se start karna → target na ho toh 0 aa jaata hai, −1 nahi.',
          'Better ko "O(log n)" bolna — duplicates zyada hon toh O(n) hai.',
          'lowerBound(target + 1) wale tareeke me check bhoolna ki <code>nums[first] == target</code> hai bhi ya nahi.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (linear)', 'O(n)', 'O(1)', 'poora array scan'],
          ['Better (BS + expand)', 'O(log n + k), worst O(n)', 'O(1)', 'k = target ki copies; sab same ho toh k = n'],
          ['Optimal (2 × BS)', 'O(log n)', 'O(1)', 'do binary search, har ek O(log n)'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why not stop when nums[mid] == target?', 'That gives some occurrence, not necessarily the first or last. We record mid and keep searching left for the first or right for the last.'],
          ['What is the complexity of binary search plus linear expansion?', 'O(log n + k) where k is the number of copies; in the worst case, when all elements are the target, it becomes O(n).'],
          ['Why are two binary searches still O(log n)?', 'Each is O(log n); two of them is 2·log n, and constants are dropped.'],
          ['How does this relate to lower bound?', 'The first position is lowerBound(target). The last is lowerBound(target + 1) − 1, or upperBound(target) − 1.'],
          ['Why check first == −1 before the second search?', 'If the first search finds nothing, the target is absent, so the second search is unnecessary.'],
          ['What does the loop invariant look like for the first occurrence?', 'ans always holds the leftmost match seen so far, and any earlier match must lie in [lo, hi].'],
          ['How would you count occurrences of the target?', 'last − first + 1 when found, otherwise 0 — still O(log n).'],
          ['What about an empty array?', 'hi starts at −1, the loop never runs, ans stays −1, and we return [−1, −1].'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Because the array is sorted, all copies of the target are contiguous, so I need two boundaries. I write one binary search helper with a flag. When nums at mid equals the target, I record mid as the answer and keep searching: to the left for the first occurrence, to the right for the last. Otherwise it behaves like normal binary search. I call it once for first; if that returns minus one I return minus one, minus one, else I call it again for last. Two binary searches, so O(log n) time and O(1) space.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [1, 2, 2, 2, 3], target = 2 — first aur last?', '<b>[1, 3]</b>.'],
          ['Isi array pe lowerBound(2) aur lowerBound(3)?', 'lowerBound(2) = 1, lowerBound(3) = 4 → last = 4 − 1 = <b>3</b>.'],
          ['Better approach <code>[7,7,7,7,7,7,7,7]</code>, target 7 pe kitne "phailao" steps?', 'BS pehla mid = 3 pe hi milta hai; phir first 3 → 0 (3 steps), last 3 → 7 (4 steps) → ~<b>7</b> = O(n).'],
        ] },
        { olist: ['findBound helper 3 min me bina dekhe likho (isFirst flag ke saath).', 'lowerBound(target) aur lowerBound(target + 1) wala version bhi likh ke dekho.'] },
      ] },
    ],
    checks: [
      'Match pe ruk kyun nahi sakte, aur first/last ke liye kis taraf jaate hain — bol sakta hoon',
      'Better (BS + expand) ka worst case O(n) kyun hai — example ke saath samjha sakta hoon',
      'findBound helper 3 min me bina dekhe likh sakta hoon',
      '30 sec ka English interview answer bol sakta hoon',
    ],
    memory: 'Match → ans = mid; first → hi = mid − 1, last → lo = mid + 1. Do BS = O(log n). first == −1 → [−1, −1].',
    tests: [
      { run: 'System.out.print(Arrays.toString(o.searchRange(new int[]{5,7,7,8,8,10}, 8)));', out: '[3, 4]' },
      { run: 'System.out.print(Arrays.toString(o.searchRange(new int[]{5,7,7,8,8,10}, 6)));', out: '[-1, -1]' },
      { run: 'System.out.print(Arrays.toString(o.searchRange(new int[]{}, 0)));', out: '[-1, -1]' },
      { run: 'System.out.print(Arrays.toString(o.searchRange(new int[]{2,2,2,2,2,2,2}, 2)));', out: '[0, 6]' },
      { run: 'System.out.print(Arrays.toString(o.searchRange(new int[]{1}, 1)));', out: '[0, 0]' },
      { run: 'System.out.print(Arrays.toString(o.searchRange(new int[]{1,2,3}, 3)));', out: '[2, 2]' },
      { run: 'System.out.print(Arrays.toString(o.searchRange(new int[]{1,2,2,2,3}, 2)));', out: '[1, 3]' },
      { run: 'System.out.print(Arrays.toString(o.searchRange(new int[]{1,2,3}, 4)));', out: '[-1, -1]' },
    ],
  };

  // =====================================================================
  // b4 — Search in Rotated Sorted Array (LC 33)
  // =====================================================================
  const B4 = [
    `public int search(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) return i;
    }
    return -1;
}`,
    `public int search(int[] nums, int target) {
    int n = nums.length;
    int lo = 0, hi = n - 1;
    while (lo < hi) {                  // pass 1: minimum (pivot) ka index
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
    }
    int pivot = lo;
    if (target <= nums[n - 1]) {       // right hissa [pivot .. n-1]
        lo = pivot;
        hi = n - 1;
    } else {
        lo = 0;
        hi = pivot - 1;
    }
    while (lo <= hi) {                 // pass 2: normal binary search
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {           // left half [lo..mid] sorted
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; // right half sorted
            else hi = mid - 1;
        }
    }
    return -1;
}`,
  ];
  const rotCheck = ({ nums }) => {
    const n = nums.length;
    if (!n) return 'nums khaali nahi ho sakta (1 <= n).';
    if (new Set(nums).size !== n) return 'nums ki values distinct honi chahiye.';
    let d = 0;
    for (let k = 0; k < n; k++) if (nums[k] > nums[(k + 1) % n]) d++;
    return n === 1 || d === 1 ? '' : 'nums ek sorted array ka rotation hona chahiye (jaise 4, 5, 6, 7, 0, 1, 2).';
  };

  L.b4 = {
    kind: 'dsa', title: 'Search in Rotated Sorted Array', topic: 'Binary Search', diff: 'M', lc: 33,
    url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    pattern: 'Modified binary search — har step pe ek half sorted hota hai',
    oneLine: 'mid pe todo toh ek half hamesha sorted hai. nums[lo] <= nums[mid] → left sorted: target uske range me → left jao, warna right. Nahi toh right sorted: target uske range me → right, warna left.',
    goal: 'Rotated sorted array (distinct values) me target ka index <b>O(log n)</b> me. Asli seekh: poora array sorted nahi, par <b>mid ke ek taraf ka half hamesha sorted hota hai</b> — usi half ke range se decide karo kaunsa half phenkna hai.',
    problem: {
      statement: 'There is an integer array <code>nums</code> sorted in ascending order (with <b>distinct</b> values).<br><br>Prior to being passed to your function, <code>nums</code> is <b>possibly left rotated</b> at an unknown index <code>k</code> (<code>1 &lt;= k &lt; nums.length</code>) such that the resulting array is <code>[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]</code> (0-indexed). For example, <code>[0,1,2,4,5,6,7]</code> might be left rotated by 3 indices and become <code>[4,5,6,7,0,1,2]</code>.<br><br>Given the array <code>nums</code> <b>after</b> the possible rotation and an integer <code>target</code>, return the index of <code>target</code> if it is in <code>nums</code>, or <code>-1</code> if it is not in <code>nums</code>.<br><br>You must write an algorithm with <code>O(log n)</code> runtime complexity.',
      examples: [
        { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4', explain: '0 index 4 pe hai.', viz: { nums: '4, 5, 6, 7, 0, 1, 2', target: '0' } },
        { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1', explain: '3 array me nahi.', viz: { nums: '4, 5, 6, 7, 0, 1, 2', target: '3' } },
        { input: 'nums = [1], target = 0', output: '-1', explain: 'Ek hi element, wo bhi target nahi.', viz: { nums: '1', target: '0' } },
        { input: 'Apna example: nums = [9,1,2,3,4,5,6], target = 2', output: '2', explain: 'Pivot bilkul shuru me (index 1). Optimal me do baar "right half sorted" wala branch chalta hai — ek baar left jaata hai, ek baar right.', viz: { nums: '9, 1, 2, 3, 4, 5, 6', target: '2' } },
      ],
      constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values of nums are unique.', 'nums is an ascending array that is possibly rotated.', '-10^4 <= target <= 10^4'],
    },
    approaches: [
      { level: 'Brute', idea: 'Har element check karo — rotation se koi farak nahi padta.', time: 'O(n)', space: 'O(1)', code: B4[0] },
      { level: 'Better', idea: 'Do pass: (1) binary search se <b>pivot</b> (minimum ka index) dhoondo — <code>nums[mid] &gt; nums[hi]</code> → min right me. (2) Pivot array ko do sorted hisson me todta hai; target kis hisse me hai (<code>target &lt;= nums[n−1]</code> → right hissa) dekh ke us hisse me b1 wala normal binary search.', time: 'O(log n) (2 pass)', space: 'O(1)', code: B4[1] },
      { level: 'Optimal', idea: 'Ek hi pass: har mid pe dekho kaunsa half sorted hai (<code>nums[lo] &lt;= nums[mid]</code> → left). Target us sorted half ke range me hai → wahi jao, warna doosra half.', time: 'O(log n) (1 pass)', space: 'O(1)', code: B4[2] },
    ],
    viz: {
      title: 'Rotated Search — kaunsa half sorted?',
      inputs: [{ key: 'nums', label: 'nums (rotated sorted, distinct)', def: '4, 5, 6, 7, 0, 1, 2', }, { key: 'target', label: 'target', def: '0', num: true }],
      check: rotCheck,
      run({ nums, target }) {
        const n = nums.length;
        let lo, hi, mid, half = '-';
        const V = () => Object.assign({ nums: K.iA(nums), target }, lo !== undefined ? { lo, hi } : {}, mid !== undefined ? { mid } : {});
        const { st, steps } = K.tracer(B4[2], o => ({ views: [K.A('nums', nums, o.hl, o.ptr), K.X('sorted half', half)], vars: V() }));
        const P = extra => ({ hl: rangeHl(n, lo, hi, extra), ptr: bsPtr(n, lo, hi, mid) });
        const sortedHl = (a, b) => { const o = { [mid]: 'cur' }; for (let k = a; k <= b; k++) if (k !== mid) o[k] = 'done'; return o; };
        st('public int search', `Method call: nums = ${K.iA(nums)}, target = ${target}`);
        lo = 0; hi = n - 1;
        st('int lo = 0, hi = nums.length - 1', `lo = 0, hi = ${hi}`, P());
        while (true) {
          if (!(lo <= hi)) { mid = undefined; half = '-'; st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✗ → range khaali`, { hl: rangeHl(n, lo, hi), ptr: bsPtr(n, lo, hi) }); break; }
          mid = undefined; half = '-';
          st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✓`, P());
          mid = lo + Math.floor((hi - lo) / 2);
          st('int mid = lo + (hi - lo) / 2', `mid = ${mid} → nums[${mid}] = ${nums[mid]}`, P({ [mid]: 'cur' }));
          if (nums[mid] === target) { st('if (nums[mid] == target) return mid', `nums[${mid}] = ${nums[mid]} == ${target} ✓ → return ${mid}`, Object.assign(P({ [mid]: 'found' }), { ret: mid })); return steps; }
          st('if (nums[mid] == target) return mid', `nums[${mid}] = ${nums[mid]} ≠ ${target}`, P({ [mid]: 'cur' }));
          if (nums[lo] <= nums[mid]) {
            half = `LEFT [${lo}..${mid}] = ${nums[lo]}..${nums[mid]} sorted`;
            st('if (nums[lo] <= nums[mid])', `nums[lo] = ${nums[lo]} <= nums[mid] = ${nums[mid]} ✓ → left half [${lo}..${mid}] sorted hai`, P(sortedHl(lo, mid)));
            if (nums[lo] <= target && target < nums[mid]) {
              hi = mid - 1;
              st('if (nums[lo] <= target', `${nums[lo]} <= ${target} < ${nums[mid]} ✓ → target sorted left half me → hi = ${hi}`, P());
            } else {
              st('if (nums[lo] <= target', `${target} range [${nums[lo]}, ${nums[mid]}) me nahi ✗ → left half bekaar`, P(sortedHl(lo, mid)));
              lo = mid + 1;
              st('else lo = mid + 1', `lo = ${lo} — right half me dhoondo`, P());
            }
          } else {
            half = `RIGHT [${mid}..${hi}] = ${nums[mid]}..${nums[hi]} sorted`;
            st('if (nums[lo] <= nums[mid])', `nums[lo] = ${nums[lo]} > nums[mid] = ${nums[mid]} → left me rotation hai, toh right half [${mid}..${hi}] sorted`, P(sortedHl(mid, hi)));
            if (nums[mid] < target && target <= nums[hi]) {
              lo = mid + 1;
              st('if (nums[mid] < target &&', `${nums[mid]} < ${target} <= ${nums[hi]} ✓ → target sorted right half me → lo = ${lo}`, P());
            } else {
              st('if (nums[mid] < target &&', `${target} range (${nums[mid]}, ${nums[hi]}] me nahi ✗ → right half bekaar`, P(sortedHl(mid, hi)));
              hi = mid - 1;
              st('else hi = mid - 1', `hi = ${hi} — left half me dhoondo`, P());
            }
          }
        }
        st('return -1', `target ${target} nahi mila → return -1`, { hl: rangeHl(n, lo, hi), ret: -1 });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Linear scan',
          run({ nums, target }) {
            let i;
            const V = () => Object.assign({ nums: K.iA(nums), target }, i !== undefined ? { i } : {});
            const { st, steps } = K.tracer(B4[0], o => ({ views: [K.A('nums', nums, o.hl, o.ptr)], vars: V() }));
            st('public int search', `Method call: nums = ${K.iA(nums)}, target = ${target}`);
            for (i = 0; ; i++) {
              if (!(i < nums.length)) { st('for (int i', `i = ${i}: ${i} < ${nums.length} ✗ → poora array dekh liya`, { hl: K.rng(0, nums.length - 1, 'skip') }); break; }
              st('for (int i', `i = ${i}: ${i} < ${nums.length} ✓`, { hl: K.rng(0, i - 1, 'skip', { [i]: 'cur' }), ptr: [{ i, label: 'i' }] });
              if (nums[i] === target) { st('if (nums[i] == target)', `nums[${i}] = ${nums[i]} == ${target} ✓ → return ${i}`, { hl: K.rng(0, i - 1, 'skip', { [i]: 'found' }), ptr: [{ i, label: 'i' }], ret: i }); return steps; }
              st('if (nums[i] == target)', `nums[${i}] = ${nums[i]} ≠ ${target}`, { hl: K.rng(0, i - 1, 'skip', { [i]: 'cur' }), ptr: [{ i, label: 'i' }] });
            }
            st('return -1', `Nahi mila → return -1 (${nums.length} comparisons)`, { ret: -1 });
            return steps;
          },
        },
        {
          ap: 1, label: 'Pivot + BS (2 pass)',
          run({ nums, target }) {
            const n = nums.length;
            let lo, hi, mid, pivot;
            const V = () => Object.assign({ nums: K.iA(nums), target, n }, lo !== undefined ? { lo, hi } : {}, mid !== undefined ? { mid } : {}, pivot !== undefined ? { pivot } : {});
            const { st, steps } = K.tracer(B4[1], o => ({ views: [K.A('nums', nums, o.hl, o.ptr), K.X('phase', pivot === undefined ? 'pass 1: pivot (minimum) dhoondo' : `pass 2: hissa [${Math.max(lo, 0)}..${hi}] me binary search (pivot = ${pivot})`)], vars: V() }));
            const P = extra => {
              const h = rangeHl(n, lo, hi, extra);
              const p = bsPtr(n, lo, hi, mid);
              if (pivot !== undefined) p.push({ i: pivot, label: 'pivot' });
              return { hl: h, ptr: p };
            };
            st('public int search', `Method call: nums = ${K.iA(nums)}, target = ${target}`);
            st('int n = nums.length', `n = ${n}`);
            lo = 0; hi = n - 1;
            st('int lo = 0, hi = n - 1', `lo = 0, hi = ${hi} — pass 1 shuru`, P());
            while (true) {
              if (!(lo < hi)) { mid = undefined; st('while (lo < hi)', `lo (${lo}) < hi (${hi}) ✗ → lo == hi = minimum ka index`, P({ [lo]: 'found' })); break; }
              mid = undefined;
              st('while (lo < hi)', `lo (${lo}) < hi (${hi}) ✓`, P());
              mid = lo + Math.floor((hi - lo) / 2);
              st(['int mid = lo + (hi - lo) / 2', 1], `mid = ${mid} → nums[${mid}] = ${nums[mid]}, nums[hi] = ${nums[hi]}`, P({ [mid]: 'cur' }));
              if (nums[mid] > nums[hi]) {
                lo = mid + 1;
                st('if (nums[mid] > nums[hi])', `${nums[mid]} > ${nums[hi]} → beech me "girawat" right me hai → minimum right me → lo = ${lo}`, P());
              } else {
                st('if (nums[mid] > nums[hi])', `${nums[mid]} <= ${nums[hi]} → [mid..hi] sorted, minimum mid ya uske left`, P({ [mid]: 'cur' }));
                hi = mid;
                st('else hi = mid;', `hi = mid = ${hi} (mid khud minimum ho sakta hai, isliye −1 nahi)`, P());
              }
            }
            mid = undefined;
            pivot = lo;
            st('int pivot = lo', `pivot = ${pivot} (nums[${pivot}] = ${nums[pivot]} sabse chhota) → hisse: [0..${pivot - 1}] aur [${pivot}..${n - 1}]`, P({ [pivot]: 'found' }));
            if (target <= nums[n - 1]) {
              st('if (target <= nums[n - 1])', `${target} <= nums[${n - 1}] = ${nums[n - 1]} ✓ → target (agar hai) right hisse me`, P());
              lo = pivot;
              st('lo = pivot;', `lo = ${lo}`, P());
              hi = n - 1;
              st(['hi = n - 1;', 2], `hi = ${hi}`, P());
            } else {
              st('if (target <= nums[n - 1])', `${target} > nums[${n - 1}] = ${nums[n - 1]} → right hisse ke sab chhote → left hissa`, P());
              lo = 0;
              st('lo = 0;', `lo = 0`, P());
              hi = pivot - 1;
              st('hi = pivot - 1;', `hi = ${hi}`, P());
            }
            while (true) {
              if (!(lo <= hi)) { mid = undefined; st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✗ → range khaali`, P()); break; }
              mid = undefined;
              st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✓`, P());
              mid = lo + Math.floor((hi - lo) / 2);
              st(['int mid = lo + (hi - lo) / 2', 2], `mid = ${mid} → nums[${mid}] = ${nums[mid]}`, P({ [mid]: 'cur' }));
              if (nums[mid] === target) { st('if (nums[mid] == target) return mid', `nums[${mid}] = ${nums[mid]} == ${target} ✓ → return ${mid}`, Object.assign(P({ [mid]: 'found' }), { ret: mid })); return steps; }
              st('if (nums[mid] == target) return mid', `nums[${mid}] = ${nums[mid]} ≠ ${target}`, P({ [mid]: 'cur' }));
              if (nums[mid] < target) {
                lo = mid + 1;
                st('else if (nums[mid] < target)', `${nums[mid]} < ${target} → lo = ${lo}`, P());
              } else {
                st('else if (nums[mid] < target)', `${nums[mid]} > ${target} → left`, P({ [mid]: 'cur' }));
                hi = mid - 1;
                st('else hi = mid - 1', `hi = ${hi}`, P());
              }
            }
            st('return -1', `target ${target} nahi mila → return -1`, { ret: -1 });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Rotated array: ek half hamesha sorted', blocks: [
        { p: 'Sorted array <code>[0,1,2,4,5,6,7]</code> ko 3 se rotate kiya → <code>[4,5,6,7,0,1,2]</code>. Ab poora array sorted nahi, isliye b1 (Binary Search) seedha nahi chalega. Par isme do sorted hisse hain, aur ek "girawat" (7 → 0) — wahi <b>pivot</b> (minimum).' },
        { pre: `index:    0   1   2   3   4   5   6
nums:     4   5   6   7   0   1   2
          \\_____________/   \\_______/
           sorted hissa 1    sorted hissa 2   (pivot = 4, nums[4] = 0 minimum)

lo = 0, hi = 6, mid = 3:  nums[lo] = 4 <= nums[mid] = 7  → [0..3] SORTED
lo = 4, hi = 6, mid = 5:  nums[lo] = 0 <= nums[mid] = 1  → [4..5] SORTED` },
        { p: '<b>Key observation:</b> kisi bhi [lo, hi] me mid pe todo, toh girawat ya toh left half me hogi ya right me — dono me nahi. Jis half me girawat nahi, wo <b>sorted</b> hai. Sorted half ka range <code>[first, last]</code> pata hai → seedha bata sakte ho target usme hai ya nahi.' },
        { table: { head: ['Condition', 'Sorted half', 'Target usme hai?', 'Action'], rows: [
          ['<code>nums[lo] &lt;= nums[mid]</code>', 'left [lo..mid]', '<code>nums[lo] &lt;= target &lt; nums[mid]</code>', 'haan → hi = mid − 1, nahi → lo = mid + 1'],
          ['warna', 'right [mid..hi]', '<code>nums[mid] &lt; target &lt;= nums[hi]</code>', 'haan → lo = mid + 1, nahi → hi = mid − 1'],
        ] } },
        { tip: '<code>nums[lo] &lt;= nums[mid]</code> me <b>&lt;=</b> kyun? Jab lo == mid (2 elements bache), left half = sirf ek element = sorted. <code>&lt;</code> likhoge toh galat half chunoge. b1 ka template (lo &lt;= hi, ±1) bilkul wahi rehta hai — sirf "kaunsa half phenko" ka decision badla.' },
      ] },
      { title: '📄 Problem — LC 33 Search in Rotated Sorted Array', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — linear scan' },
        { p: 'Har element check karo. <b>O(n)</b>, O(1). Rotation ka koi fark nahi — par O(log n) chahiye.' },
        { h: '2. Better — pehle pivot, phir normal binary search (2 pass)' },
        { p: '<b>Pass 1:</b> minimum ka index (pivot) binary search se: <code>nums[mid] &gt; nums[hi]</code> → girawat mid aur hi ke beech → <code>lo = mid + 1</code>; warna [mid..hi] sorted, min mid ya left me → <code>hi = mid</code>. <code>lo &lt; hi</code> loop, end me lo = pivot.' },
        { p: '<b>Pass 2:</b> ab do sorted hisse: [0..pivot−1] (sab bade) aur [pivot..n−1] (sab chhote, last = nums[n−1]). <code>target &lt;= nums[n−1]</code> → right hisse me, warna left me. Us hisse me b1 wala binary search. Total <b>O(log n)</b>, O(1) — idea simple (do jaane-pehchaane tukde), par do pass.' },
        { h: '3. Optimal — ek pass, modified binary search' },
        { p: 'Pivot alag se dhoondhne ki zaroorat hi nahi. Har mid pe seedha decide karo kaunsa half sorted hai (<code>nums[lo] &lt;= nums[mid]</code>), aur target us sorted half ke range me hai ya nahi. Ek hi loop → <b>O(log n)</b>, O(1), ek pass.' },
        { tip: 'Interview me pehle Optimal likho, par Better bhi bolo — "find the minimum" (LC 153) khud ek alag sawaal hai, aur pass 1 wahi hai.' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [4, 5, 6, 7, 0, 1, 2] (Optimal)', blocks: [
        { p: '<b>target = 0</b>' },
        { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'Sorted half', 'Target usme?', 'Action'], rows: [
          ['0', '6', '3', '7', 'left [4..7]', '4 &lt;= 0? No', 'lo = 4'],
          ['4', '6', '5', '1', 'left [0..1]', '0 &lt;= 0 &lt; 1 ✓', 'hi = 4'],
          ['4', '4', '4', '<b>0</b>', '—', '—', 'return <b>4</b>'],
        ] } },
        { p: '<b>Apna example: [9, 1, 2, 3, 4, 5, 6], target = 2</b>' },
        { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'Sorted half', 'Target usme?', 'Action'], rows: [
          ['0', '6', '3', '3', 'right [3..6] (9 &gt; 3)', '3 &lt; 2? No', 'hi = 2'],
          ['0', '2', '1', '1', 'right [1..2] (9 &gt; 1)', '1 &lt; 2 &lt;= 2 ✓', 'lo = 2'],
          ['2', '2', '2', '<b>2</b>', '—', '—', 'return <b>2</b>'],
        ] } },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: B4[2] },
        { lines: [
          ['int lo = 0, hi = nums.length - 1;', 'b1 jaisa closed range.'],
          ['while (lo <= hi)', 'Range khaali hone tak.'],
          ['int mid = lo + (hi - lo) / 2;', 'Overflow-safe mid.'],
          ['if (nums[mid] == target) return mid;', 'Seedha mil gaya.'],
          ['if (nums[lo] <= nums[mid]) {', 'Left half [lo..mid] me girawat nahi → sorted.'],
          ['if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;', 'Target sorted left ke range me → right phenko.'],
          ['else lo = mid + 1;', 'Target left range me nahi → left phenko.'],
          ['if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;', 'Right half sorted; target uske range me → left phenko.'],
          ['else hi = mid - 1;', 'Target right range me nahi → right phenko.'],
          ['return -1;', 'Nahi mila.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute, Better aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Optimal tab me <b>done</b> (green) cells = us step ka sorted half. Better tab me pehle pass 1 pivot pe rukta hai, phir pass 2 sirf ek hisse me chalta hai. Apna example (4th) zaroor chalao — right-sorted branch wahi dikhata hai. ✎ Input: non-rotated <code>1, 2, 3, 4, 5</code> target <code>4</code> — har baar left half sorted.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Rotation nahi hua: <code>[1,2,3,4,5]</code> → har step left sorted, normal BS jaisa. Better me pivot = 0.',
          'Ek element: <code>[1]</code> → target 1 → 0, warna −1.',
          'Do elements: <code>[3,1]</code>, target 1 → lo = mid = 0, <code>nums[lo] &lt;= nums[mid]</code> (3 &lt;= 3) → left sorted, 1 range me nahi → lo = 1 → mil gaya.',
          'Target exactly pivot (minimum) ya pivot se pehla element (maximum).',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>nums[lo] &lt; nums[mid]</code> (bina =) → lo == mid pe galat half sorted maan lete ho.',
          'Range check me boundaries ulti: left me <code>target &lt; nums[mid]</code> (strict, kyunki mid check ho chuka) aur <code>nums[lo] &lt;= target</code> (inclusive).',
          'Sirf <code>nums[mid]</code> vs <code>target</code> compare karke half chunna — rotated array me ye galat hai.',
          'Better pass 1 me <code>hi = mid − 1</code> likhna → minimum khud mid pe ho toh miss.',
          'Duplicates wala version (LC 81) alag hai — <code>nums[lo] == nums[mid]</code> pe decide nahi ho pata.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (linear)', 'O(n)', 'O(1)', 'har element'],
          ['Better (pivot + BS)', 'O(log n)', 'O(1)', 'do binary search (2 × log n)'],
          ['Optimal (1-pass modified BS)', 'O(log n)', 'O(1)', 'ek binary search, har step aadha range'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['What is the key observation?', 'When we split at mid, at least one half is always sorted, because the rotation point can only lie in one half.'],
          ['How do you know which half is sorted?', 'If nums[lo] <= nums[mid], the left half is sorted; otherwise the right half is sorted.'],
          ['Why <= and not < in nums[lo] <= nums[mid]?', 'When lo == mid the left half is a single element, which is sorted. Using < would wrongly pick the right half.'],
          ['How do you decide where the target is?', 'Check if the target lies within the sorted half\'s range; if yes go there, otherwise go to the other half.'],
          ['Describe the two-pass approach.', 'First binary search for the minimum index (pivot) using nums[mid] > nums[hi]; then do a normal binary search in the half that can contain the target.'],
          ['Why hi = mid and not mid − 1 when finding the pivot?', 'If nums[mid] <= nums[hi], mid itself could be the minimum, so we cannot discard it.'],
          ['What changes if duplicates are allowed?', 'When nums[lo] == nums[mid] == nums[hi], we cannot tell which half is sorted, so we shrink lo++ / hi--; worst case becomes O(n).'],
          ['What if the array is not rotated?', 'The algorithm still works: the left half is always sorted and it behaves like normal binary search.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'The array is sorted but rotated, so the whole array is not sorted, but whenever I split at mid, one half is always sorted. I use normal binary search with lo and hi. If nums at mid is the target I return it. If nums at lo is at most nums at mid, the left half is sorted, so I check whether the target lies between nums at lo and nums at mid; if yes I go left, otherwise right. Otherwise the right half is sorted and I do the mirror check. One pass, O(log n) time and O(1) space.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [4, 5, 6, 7, 0, 1, 2], target = 5 — mid sequence?', 'mid = 3 (7, left sorted, 4 &lt;= 5 &lt; 7 → hi = 2) → mid = 1 (5) → return <b>1</b>.'],
          ['Isi array ka pivot Better pass 1 me?', 'mid 3: 7 &gt; 2 → lo = 4; mid 5: 1 &lt;= 2 → hi = 5; mid 4: 0 &lt;= 1 → hi = 4 → pivot = <b>4</b>.'],
          ['<code>[3, 1]</code>, target 1 — <code>&lt;</code> (bina =) likha toh?', 'lo = mid = 0: 3 &lt; 3 false → "right sorted" maana: 3 &lt; 1? nahi → hi = −1 → <b>−1</b> galat (sahi 1).'],
        ] },
        { olist: ['Optimal code 4 min me bina dekhe likho.', 'Find Minimum in Rotated Sorted Array (pass 1) alag se likh ke dekho.'] },
      ] },
    ],
    checks: [
      '"Ek half hamesha sorted" kyun — samjha sakta hoon',
      'nums[lo] <= nums[mid] me = kyun zaroori, example ke saath bata sakta hoon',
      'Optimal 1-pass code 4 min me bina dekhe likh sakta hoon; pivot wala Better bhi bol sakta hoon',
      '30 sec ka English interview answer bol sakta hoon',
    ],
    memory: 'Ek half sorted: nums[lo] <= nums[mid] → left sorted (lo <= t < mid → left, warna right); else right sorted (mid < t <= hi → right, warna left).',
    tests: [
      { run: 'System.out.print(o.search(new int[]{4,5,6,7,0,1,2}, 0));', out: '4' },
      { run: 'System.out.print(o.search(new int[]{4,5,6,7,0,1,2}, 3));', out: '-1' },
      { run: 'System.out.print(o.search(new int[]{1}, 0));', out: '-1' },
      { run: 'System.out.print(o.search(new int[]{9,1,2,3,4,5,6}, 2));', out: '2' },
      { run: 'System.out.print(o.search(new int[]{3,1}, 1));', out: '1' },
      { run: 'System.out.print(o.search(new int[]{1,2,3,4,5}, 4));', out: '3' },
      { run: 'System.out.print(o.search(new int[]{4,5,6,7,0,1,2}, 4));', out: '0' },
      { run: 'System.out.print(o.search(new int[]{5,1,3}, 5));', out: '0' },
    ],
  };

  // =====================================================================
  // b5 — Koko Eating Bananas (LC 875)
  // =====================================================================
  const B5 = [
    `public int minEatingSpeed(int[] piles, int h) {
    int maxPile = 0;
    for (int p : piles) maxPile = Math.max(maxPile, p);
    for (int k = 1; k <= maxPile; k++) {        // har speed try karo
        long hours = 0;
        for (int p : piles) hours += (p + k - 1) / k;   // ceil(p / k)
        if (hours <= h) return k;
    }
    return maxPile;
}`,
    `public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = 0;
    for (int p : piles) hi = Math.max(hi, p);
    int ans = hi;                    // max speed pe toh hamesha ho jayega
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (hoursNeeded(piles, mid) <= h) {
            ans = mid;               // mid chal gaya — aur slow try karo
            hi = mid - 1;
        } else {
            lo = mid + 1;            // bahut slow — tez karo
        }
    }
    return ans;
}

private long hoursNeeded(int[] piles, int k) {
    long hours = 0;
    for (int p : piles) hours += (p + k - 1) / k;   // ceil(p / k)
    return hours;
}`,
  ];
  const ceilDiv = (p, k) => Math.floor((p + k - 1) / k);
  const kokoCheck = ({ piles, h }) => {
    if (!piles.length) return 'piles khaali nahi ho sakta.';
    if (piles.some(p => p < 1 || p !== Math.floor(p))) return 'har pile >= 1 (integer) hona chahiye.';
    if (!(h >= piles.length)) return `h >= piles.length (${piles.length}) hona chahiye, warna har pile ke liye 1 ghanta bhi nahi.`;
    return '';
  };

  L.b5 = {
    kind: 'dsa', title: 'Koko Eating Bananas', topic: 'Binary Search', diff: 'M', lc: 875,
    url: 'https://leetcode.com/problems/koko-eating-bananas/',
    pattern: 'Binary search on answer (monotonic predicate: speed k chal gaya → k + 1 bhi chalega)',
    oneLine: 'Speed k ki range [1, max(piles)]. hours(k) = Σ ceil(p / k) — k badhao toh hours ghatte hain (monotonic). Binary search: hours(mid) <= h → ans = mid, slow try karo (hi = mid − 1); warna lo = mid + 1.',
    goal: 'Sabse kam speed <code>k</code> jisse saare kele <code>h</code> ghante me khatam ho jaayen. Asli seekh: <b>binary search on answer</b> — array me nahi, <b>answer ki range</b> me binary search, jab "ye answer chalega?" wala check monotonic ho (F F F T T T). b2 ka "pehla T" yahan answer-space me.',
    problem: {
      statement: 'Koko loves to eat bananas. There are <code>n</code> piles of bananas, the <code>i<sup>th</sup></code> pile has <code>piles[i]</code> bananas. The guards have gone and will come back in <code>h</code> hours.<br><br>Koko can decide her bananas-per-hour eating speed of <code>k</code>. Each hour, she chooses some pile of bananas and eats <code>k</code> bananas from that pile. If the pile has less than <code>k</code> bananas, she eats all of them instead and will not eat any more bananas during this hour.<br><br>Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return.<br><br>Return <i>the minimum integer</i> <code>k</code> <i>such that she can eat all the bananas within</i> <code>h</code> <i>hours</i>.',
      examples: [
        { input: 'piles = [3,6,7,11], h = 8', output: '4', explain: 'k = 4: ceil(3/4) + ceil(6/4) + ceil(7/4) + ceil(11/4) = 1 + 2 + 2 + 3 = 8 ≤ 8 ✓. k = 3: 1 + 2 + 3 + 4 = 10 &gt; 8 ✗.', viz: { piles: '3, 6, 7, 11', h: '8' } },
        { input: 'piles = [30,11,23,4,20], h = 5', output: '30', explain: '5 piles, 5 ghante → har pile ek ghante me → k = max = 30.', viz: { piles: '30, 11, 23, 4, 20', h: '5' } },
        { input: 'piles = [30,11,23,4,20], h = 6', output: '23', explain: 'k = 23: 2 + 1 + 1 + 1 + 1 = 6 ✓; k = 22: 2 + 1 + 2 + 1 + 1 = 7 ✗.', viz: { piles: '30, 11, 23, 4, 20', h: '6' } },
      ],
      constraints: ['1 <= piles.length <= 10^4', 'piles.length <= h <= 10^9', '1 <= piles[i] <= 10^9'],
    },
    approaches: [
      { level: 'Brute', idea: 'k = 1, 2, 3, … max(piles) ek-ek karke try karo; har k pe total hours gino. Pehla k jiske hours ≤ h wahi answer (chhote se shuru kiya, toh pehla = minimum).', time: 'O(max · n)', space: 'O(1)', code: B5[0] },
      { level: 'Optimal', idea: 'Binary search on answer: k ki range [1, max]. <code>hoursNeeded(k) &lt;= h</code> monotonic hai (k badha → hours ghate). mid chal gaya → <code>ans = mid</code>, aur chhota try (<code>hi = mid − 1</code>); nahi chala → <code>lo = mid + 1</code>.', time: 'O(n log max)', space: 'O(1)', code: B5[1] },
    ],
    viz: {
      title: 'Koko — binary search on answer (speed k)',
      inputs: [{ key: 'piles', label: 'piles', def: '3, 6, 7, 11' }, { key: 'h', label: 'h (ghante)', def: '8', num: true }],
      check: kokoCheck,
      run({ piles, h }) {
        const n = piles.length;
        let lo, hi, mid, ans, k, hours, j, inH = false, last = '';
        const V = () => {
          const v = { piles: K.iA(piles), h };
          if (lo !== undefined) Object.assign(v, { lo, hi });
          if (ans !== undefined) v.ans = ans;
          if (mid !== undefined) v.mid = mid;
          if (inH) { v.k = k; if (hours !== undefined) v.hours = hours; }
          return v;
        };
        const parts = [];
        const view = o => [
          K.A('piles', piles, o.hl || {}, o.ptr || []),
          K.X('speed range [lo .. hi]', lo === undefined ? '-' : lo <= hi ? `[${lo} .. ${hi}]` : `khaali (lo = ${lo} > hi = ${hi})`),
          K.X(inH ? `hoursNeeded(k = ${k})` : 'last check', inH ? (parts.length ? parts.join(' + ') + ` = ${hours}` : '0') : last || '-'),
        ];
        const { st, steps } = K.tracer(B5[1], o => ({ views: view(o), vars: V() }));
        st('public int minEatingSpeed', `Method call: piles = ${K.iA(piles)}, h = ${h}`);
        lo = 1; hi = 0;
        st('int lo = 1, hi = 0', 'lo = 1 (kam se kam 1 kela/ghanta), hi = 0 (abhi max nikaalna hai)');
        for (j = 0; j < n; j++) {
          hi = Math.max(hi, piles[j]);
          st('hi = Math.max(hi, p)', `p = ${piles[j]} → hi = ${hi}`, { hl: { [j]: 'cur' } });
        }
        st('hi = Math.max(hi, p)', `sab piles dekh liye → hi = max = ${hi}`);
        ans = hi;
        st('int ans = hi', `ans = ${hi} — max speed pe har pile 1 ghante me, n = ${n} <= h = ${h}, toh ye pakka chalega`);
        while (true) {
          if (!(lo <= hi)) { mid = undefined; st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✗ → search khatam, ans = ${ans}`); break; }
          mid = undefined;
          st('while (lo <= hi)', `lo (${lo}) <= hi (${hi}) ✓ — ${hi - lo + 1} speeds bachi`);
          mid = lo + Math.floor((hi - lo) / 2);
          st('int mid = lo + (hi - lo) / 2', `mid = ${lo} + (${hi} − ${lo}) / 2 = ${mid} — kya speed ${mid} chalegi?`);
          st('if (hoursNeeded(piles, mid) <= h)', `hoursNeeded(piles, ${mid}) call`);
          inH = true; k = mid; hours = undefined; parts.length = 0;
          st('private long hoursNeeded', `hoursNeeded: piles = ${K.iA(piles)}, k = ${k}`);
          hours = 0;
          st('long hours = 0', 'hours = 0 (long — bade inputs pe sum int se bahar ja sakta hai)');
          for (j = 0; j < n; j++) {
            const c = ceilDiv(piles[j], k);
            hours += c; parts.push(c);
            st('hours += (p + k - 1) / k', `p = ${piles[j]}: (${piles[j]} + ${k} − 1) / ${k} = ${c} ghante → hours = ${hours}`, { hl: { [j]: 'cur' } });
          }
          st('hours += (p + k - 1) / k', `sab piles ho gaye → hours = ${hours}`);
          st('return hours', `return ${hours}`);
          inH = false;
          const hv = hours;
          last = `k = ${mid} → ${hv} ghante ${hv <= h ? '<=' : '>'} h = ${h}`;
          if (hv <= h) {
            st('if (hoursNeeded(piles, mid) <= h)', `${hv} <= ${h} ✓ → speed ${mid} chal gayi`);
            ans = mid;
            st('ans = mid;', `ans = ${mid} — ab isse slow bhi chalegi kya?`);
            hi = mid - 1;
            st('hi = mid - 1', `hi = ${hi} — left (slow) half me dhoondo`);
          } else {
            st('if (hoursNeeded(piles, mid) <= h)', `${hv} > ${h} ✗ → speed ${mid} bahut slow; isse slow sab bhi fail`);
            lo = mid + 1;
            st('lo = mid + 1', `lo = ${lo} — tez speeds me dhoondo`);
          }
        }
        st('return ans', `return ans = ${ans} (sabse kam speed jo ${h} ghante me khatam kare)`, { ret: ans });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Har speed try',
          check: inp => {
            const m = kokoCheck(inp);
            if (m) return m;
            const mx = Math.max(...inp.piles);
            return mx * (inp.piles.length + 4) > 560 ? `Brute tab me har speed 1..max try hoti hai — steps 600 se kam rakhne ke liye max(piles) × (n + 4) <= 560 rakho (abhi ${mx * (inp.piles.length + 4)}).` : '';
          },
          run({ piles, h }) {
            const n = piles.length;
            let maxPile, k, hours, j;
            const parts = [];
            const V = () => {
              const v = { piles: K.iA(piles), h };
              if (maxPile !== undefined) v.maxPile = maxPile;
              if (k !== undefined) v.k = k;
              if (hours !== undefined) v.hours = hours;
              return v;
            };
            const { st, steps } = K.tracer(B5[0], o => ({ views: [K.A('piles', piles, o.hl || {}, []), K.X(k === undefined ? 'hours' : `k = ${k} pe hours`, hours === undefined ? '-' : (parts.length ? parts.join(' + ') : '0') + ` = ${hours}`)], vars: V() }));
            st('public int minEatingSpeed', `Method call: piles = ${K.iA(piles)}, h = ${h}`);
            maxPile = 0;
            st('int maxPile = 0', 'maxPile = 0');
            for (j = 0; j < n; j++) {
              maxPile = Math.max(maxPile, piles[j]);
              st('maxPile = Math.max', `p = ${piles[j]} → maxPile = ${maxPile}`, { hl: { [j]: 'cur' } });
            }
            st('maxPile = Math.max', `maxPile = ${maxPile} — speeds 1..${maxPile} try karenge`);
            for (k = 1; ; k++) {
              if (!(k <= maxPile)) { hours = undefined; st('for (int k = 1', `k = ${k}: ${k} <= ${maxPile} ✗`); break; }
              hours = undefined; parts.length = 0;
              st('for (int k = 1', `k = ${k}: ${k} <= ${maxPile} ✓ — speed ${k} try karo`);
              hours = 0;
              st('long hours = 0', 'hours = 0');
              for (j = 0; j < n; j++) {
                const c = ceilDiv(piles[j], k);
                hours += c; parts.push(c);
                st('hours += (p + k - 1) / k', `p = ${piles[j]}: ceil(${piles[j]} / ${k}) = ${c} → hours = ${hours}`, { hl: { [j]: 'cur' } });
              }
              st('hours += (p + k - 1) / k', `k = ${k} pe total hours = ${hours}`);
              if (hours <= h) { st('if (hours <= h) return k', `${hours} <= ${h} ✓ → pehli chalne wali speed → return ${k}`, { ret: k }); return steps; }
              st('if (hours <= h) return k', `${hours} > ${h} ✗ → speed ${k} bahut slow`);
            }
            st('return maxPile', `return ${maxPile}`, { ret: maxPile });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Binary search on answer', blocks: [
        { p: 'Ab tak (b1–b4) binary search <b>array ke index</b> pe tha. Yahan array sorted bhi nahi! Par sawaal ka <b>answer</b> (speed k) ek range me hai: <code>[1, max(piles)]</code>. Aur ek check hai: <i>"speed k pe h ghante me khatam hoga?"</i>' },
        { pre: `piles = [3, 6, 7, 11], h = 8

k          :  1   2   3   4   5   6   7   8   9  10  11
hours(k)   : 27  15  10   8   8   6   5   5   5   4   4
hours <= 8 ?  F   F   F   T   T   T   T   T   T   T   T    <- F...F T...T  (monotonic!)
                          ^
                     answer = pehla T = 4` },
        { p: 'Tez khaogi toh ghante kam ya barabar lagenge — kabhi zyada nahi. Isliye check <b>monotonic</b> hai: ek baar T hua toh aage sab T. Aur "pehla T" dhoondhna = b2 (Lower Bound) wala binary search, bas array ki jagah <b>answer-space</b> me. Isi ko <b>binary search on answer</b> kehte hain.' },
        { table: { head: ['Pattern ke parts', 'Koko me'], rows: [
          ['Answer ki range [lo, hi]', '[1, max(piles)] — max speed pe har pile 1 ghanta, n ≤ h toh pakka chalega'],
          ['Monotonic check <code>ok(x)</code>', '<code>hoursNeeded(k) &lt;= h</code>'],
          ['Minimum chahiye', 'ok(mid) → ans = mid, hi = mid − 1; warna lo = mid + 1'],
        ] } },
        { tip: '<b>Ceil bina double ke:</b> <code>ceil(p / k) = (p + k − 1) / k</code> (integer division). p = 7, k = 4 → (7 + 3) / 4 = 2 ✓; p = 8, k = 4 → 11 / 4 = 2 ✓. <code>Math.ceil((double) p / k)</code> bhi chalega, par double slow aur precision risky. Aur <b>hours ko <code>long</code></b> rakho: k = 1 pe 10⁴ piles × 10⁹ = 10¹³ — int (2.1 × 10⁹) overflow!' },
      ] },
      { title: '📄 Problem — LC 875 Koko Eating Bananas', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — har speed try karo' },
        { p: 'k = 1 se shuru, har k pe <code>Σ ceil(p / k)</code> gino; pehla k jiske hours ≤ h — wahi minimum. k max(piles) tak jaata hai → <b>O(max · n)</b>. max = 10⁹, n = 10⁴ → 10¹³ operations — TLE pakka.' },
        { h: 'Better?' },
        { p: 'Yahan genuinely alag Better approach nahi hai — Brute ke baad seedha Optimal. (k = max se neeche ki taraf try karna ya sum/h se shuru karna — sab wahi linear search hai, complexity same.)' },
        { h: '2. Optimal — binary search on answer' },
        { p: 'Brute me hum F F F T T T line pe <b>linearly</b> pehla T dhoondh rahe the. Monotonic line pe pehla T binary search se milta hai: range [1, max], mid pe <code>hoursNeeded(mid)</code> (O(n)). ≤ h → mid chal gaya, ans = mid, aur slow try (hi = mid − 1). &gt; h → mid aur usse slow sab fail (lo = mid + 1). log₂(10⁹) ≈ 30 checks × O(n) → <b>O(n log max)</b>, O(1).' },
        { tip: 'Pattern pehchaano: <b>"minimum X such that condition"</b> ya "maximum X such that" + condition monotonic → binary search on answer. Aage Painter\'s Partition, Aggressive Cows, Capacity to Ship Packages — sab isi template pe.' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — piles = [3, 6, 7, 11], h = 8 (Optimal)', blocks: [
        { table: { head: ['lo', 'hi', 'mid', 'hoursNeeded(mid)', '≤ 8?', 'Action', 'ans'], rows: [
          ['1', '11', '—', '—', '—', 'start (hi = max)', '11'],
          ['1', '11', '6', '1 + 1 + 2 + 2 = 6', '<b>Yes</b>', 'ans = 6, hi = 5', '6'],
          ['1', '5', '3', '1 + 2 + 3 + 4 = 10', 'No', 'lo = 4', '6'],
          ['4', '5', '4', '1 + 2 + 2 + 3 = 8', '<b>Yes</b>', 'ans = 4, hi = 3', '4'],
          ['4', '3', '—', '—', '—', 'lo &gt; hi → return', '<b>4</b>'],
        ] } },
        { p: 'Sirf 3 checks (Brute me 4 checks — chhota input hai; piles = [30, 11, 23, 4, 20], h = 5 pe Brute 30 checks, Optimal 5).' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: B5[1] },
        { lines: [
          ['int lo = 1, hi = 0;', 'Speed kam se kam 1; hi abhi max nikaalne ke liye 0.'],
          ['for (int p : piles) hi = Math.max(hi, p);', 'hi = max(piles) — isse tez speed ka koi fayda nahi.'],
          ['int ans = hi;', 'Max speed pe n ghante lagte hain, aur n ≤ h — toh ye default pakka valid.'],
          ['while (lo <= hi)', 'Speed range khaali hone tak.'],
          ['int mid = lo + (hi - lo) / 2;', 'Beech wali speed, overflow-safe.'],
          ['if (hoursNeeded(piles, mid) <= h) {', 'Monotonic check: speed mid chalegi?'],
          ['ans = mid;', 'Chal gayi — candidate save.'],
          ['hi = mid - 1;', 'Minimum chahiye → aur slow try karo.'],
          ['lo = mid + 1;', 'Nahi chali → isse slow bhi nahi chalegi → tez karo.'],
          ['return ans;', 'Sabse kam valid speed.'],
          ['long hours = 0;', 'long — k chhota ho toh sum 10¹³ tak ja sakta hai.'],
          ['for (int p : piles) hours += (p + k - 1) / k;', 'Har pile ke ceil(p / k) ghante, integer math se.'],
          ['return hours;', 'Total ghante.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 1 },
        { tip: 'Example 2 dono tabs me chalao: Brute k = 1, 2, … 30 tak har speed ke liye poora hours ginta hai; Optimal sirf 5 mids check karta hai. "hoursNeeded" box me har pile ka ceil dikhta hai. (Brute tab me bade piles pe step limit ke liye check hai — max chhota rakho.)' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'h == n (piles.length) → har pile ek ghante me → answer = max(piles).',
          'h bahut bada (jaise 10⁹) → answer 1 ho sakta hai: <code>[312884470]</code>, h = 968709470 → 1.',
          'Ek pile: <code>[10]</code>, h = 3 → ceil(10 / k) ≤ 3 → k = 4.',
          'Bade piles + chhota k: <code>[805306368, 805306368, 805306368]</code>, h = 10⁹ → k = 1 pe sum 2.4 × 10⁹ (int overflow!) → long zaroori; answer 3.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>int hours</code> → k chhota ho toh overflow, negative ho ke galti se "≤ h" true.',
          '<code>p / k</code> (floor) likhna — bacha hua kela bhi ek poora ghanta leta hai, ceil chahiye.',
          'lo = 0 se start → <code>(p + 0 − 1) / 0</code> → divide by zero.',
          'hi = sum(piles) ya 10⁹ lena galat nahi, par max(piles) kaafi hai (usse tez ka koi fayda nahi).',
          'Condition ulti: <code>hours &lt; h</code> (strict) → exactly h ghante wala valid answer miss.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (har speed)', 'O(max · n)', 'O(1)', 'max speeds × har speed pe n piles'],
          ['Optimal (BS on answer)', 'O(n log max)', 'O(1)', '~log₂(max) ≈ 30 checks, har check O(n)'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why can you binary search when the array is not sorted?', 'We are not searching the array; we search the answer range [1, max(piles)]. The predicate "can finish within h hours at speed k" is monotonic in k.'],
          ['Why is the predicate monotonic?', 'Eating faster never takes more hours, so if speed k works, every speed greater than k also works.'],
          ['Why is the upper bound max(piles)?', 'At that speed every pile takes exactly one hour, so the total is n hours, and h >= n is guaranteed. Going faster gives no benefit.'],
          ['How do you compute ceil(p / k) without floating point?', '(p + k − 1) / k using integer division.'],
          ['Why use long for the hours?', 'With k = 1 the sum can reach 10^4 × 10^9 = 10^13, which overflows int.'],
          ['What is the time complexity?', 'O(n log max): about 30 iterations of binary search for max = 10^9, each costing O(n) to compute the hours.'],
          ['How do you get the minimum valid speed?', 'When mid works, store it as the answer and continue searching left with hi = mid − 1; otherwise move lo = mid + 1.'],
          ['Name other problems with this pattern.', 'Capacity to Ship Packages Within D Days, Split Array Largest Sum, Painter\'s Partition, Aggressive Cows, Minimum Days to Make Bouquets.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'The answer, the speed k, lies between 1 and the largest pile, and the check "can Koko finish in h hours at speed k" is monotonic: if k works, any faster speed works too. So I binary search on the answer. For each mid I compute the total hours as the sum of ceil of pile over mid, using (p + k − 1) / k and a long accumulator. If it fits within h, I record mid and try slower speeds; otherwise I go faster. That is O(n log max) time and O(1) space.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['piles = [3, 6, 7, 11], h = 6 — answer?', 'k = 6: 1 + 1 + 2 + 2 = 6 ✓, k = 5: 1 + 2 + 2 + 3 = 8 ✗ → <b>6</b>.'],
          ['(p + k − 1) / k — p = 10, k = 3?', '(10 + 2) / 3 = <b>4</b> (= ceil(3.33)).'],
          ['max(piles) = 10⁹ pe Optimal kitne checks karega?', '~<b>30</b> (log₂ 10⁹ ≈ 29.9).'],
        ] },
        { olist: ['"Binary search on answer" ke 3 parts (range, monotonic check, min/max update) bina dekhe likho.', 'Koko ka Optimal code 4 min me likho — hoursNeeded helper long ke saath.'] },
      ] },
    ],
    checks: [
      'Binary search on answer kya hai, aur check monotonic kyun hai — bol sakta hoon',
      'Range [1, max(piles)] kyun, aur ceil = (p + k − 1) / k samjha sakta hoon',
      'long hours kyun zaroori — example ke saath bata sakta hoon; code 4 min me likh sakta hoon',
      '30 sec ka English interview answer bol sakta hoon',
    ],
    memory: 'BS on answer: k ∈ [1, max]; hours(k) = Σ (p + k − 1)/k (long). hours ≤ h → ans = mid, hi = mid − 1; warna lo = mid + 1.',
    tests: [
      { run: 'System.out.print(o.minEatingSpeed(new int[]{3,6,7,11}, 8));', out: '4' },
      { run: 'System.out.print(o.minEatingSpeed(new int[]{30,11,23,4,20}, 5));', out: '30' },
      { run: 'System.out.print(o.minEatingSpeed(new int[]{30,11,23,4,20}, 6));', out: '23' },
      { run: 'System.out.print(o.minEatingSpeed(new int[]{312884470}, 968709470));', out: '1' },
      { run: 'System.out.print(o.minEatingSpeed(new int[]{805306368,805306368,805306368}, 1000000000));', out: '3' },
      { run: 'System.out.print(o.minEatingSpeed(new int[]{10}, 3));', out: '4' },
      { run: 'System.out.print(o.minEatingSpeed(new int[]{3,6,7,11}, 6));', out: '6' },
    ],
  };
})();
