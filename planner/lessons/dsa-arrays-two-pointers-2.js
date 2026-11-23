// Planner lessons — Arrays & Two Pointers part 2 (a7 3Sum, a8 Container With Most Water)
// Format: planner/learn.js ke upar comment dekho. Viz steps: lesson-kit.js tracer (har line = ek step, VARIABLES me saare locals).
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  // =====================================================================
  // a7 — 3Sum (LC 15)
  // =====================================================================
  const A7 = [
    `public List<List<Integer>> threeSum(int[] nums) {
    Set<List<Integer>> set = new HashSet<>(); // unique triplets
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                if (nums[i] + nums[j] + nums[k] == 0) {
                    List<Integer> triplet = Arrays.asList(nums[i], nums[j], nums[k]);
                    Collections.sort(triplet); // [0,-1,1] aur [-1,0,1] ek hi
                    set.add(triplet);
                }
            }
        }
    }
    return new ArrayList<>(set);
}`,
    `public List<List<Integer>> threeSum(int[] nums) {
    Set<List<Integer>> set = new HashSet<>(); // unique triplets
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        Set<Integer> seen = new HashSet<>(); // i ke baad dekhe hue
        for (int j = i + 1; j < n; j++) {
            int need = -(nums[i] + nums[j]);
            if (seen.contains(need)) {
                List<Integer> triplet = Arrays.asList(nums[i], nums[j], need);
                Collections.sort(triplet);
                set.add(triplet);
            }
            seen.add(nums[j]);
        }
    }
    return new ArrayList<>(set);
}`,
    `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> ans = new ArrayList<>();
    int n = nums.length;
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue; // same first value skip
        int l = i + 1, r = n - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum < 0) {
                l++;
            } else if (sum > 0) {
                r--;
            } else {
                ans.add(Arrays.asList(nums[i], nums[l], nums[r]));
                l++;
                r--;
                while (l < r && nums[l] == nums[l - 1]) l++;
                while (l < r && nums[r] == nums[r + 1]) r--;
            }
        }
    }
    return ans;
}`,
  ];
  const TS = t => '[' + t.join(', ') + ']';
  const lex = (x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
  const LS = list => '[' + list.map(TS).join(', ') + ']';
  const sortedT = arr3 => arr3.slice().sort((x, y) => x - y);
  // Java tests: result ko lexicographic sort karke print (HashSet order random hota hai)
  const T3 = arr => `List<List<Integer>> r = new ArrayList<>(o.threeSum(new int[]{${arr}})); r.sort((x, y) -> { for (int t = 0; t < 3; t++) { int c = Integer.compare(x.get(t), y.get(t)); if (c != 0) return c; } return 0; }); System.out.print(r);`;

  // Brute + Better dono triplet-set use karte hain — set ka order random, isliye viz ret sorted dikhata hai
  function setRet(setMap) { return LS([...setMap.values()].sort(lex)); }

  L.a7 = {
    kind: 'dsa', title: '3Sum', topic: 'Arrays & Two Pointers', diff: 'M', lc: 15,
    url: 'https://leetcode.com/problems/3sum/',
    pattern: 'Sort + fix one + two pointers',
    oneLine: 'Sort karo, ek number fix karo (i), baaki do ke liye sorted Two Sum (l, r) chalao; duplicates skip karo.',
    goal: 'Saare <b>unique</b> triplets dhoondo jinka sum 0 ho. Asli seekh: <b>3Sum = fix one + Two Sum</b>. Day 1 ka Two Sum (a1) yaad karo — wahi sorted two-pointer wala Better approach yahan har i ke liye chalta hai. Plus <b>duplicate skipping</b> — sort ke baad same values paas-paas, toh unhe skip karna aasaan.',
    problem: {
      statement: 'Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.<br><br>Notice that the solution set must not contain duplicate triplets.',
      examples: [
        { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explain: 'nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0. nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0. nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0. The distinct triplets are [-1,0,1] and [-1,-1,2]. Notice that the order of the output and the order of the triplets does not matter.', viz: { nums: '-1, 0, 1, 2, -1, -4' } },
        { input: 'nums = [0,1,1]', output: '[]', explain: 'The only possible triplet does not sum up to 0.', viz: { nums: '0, 1, 1' } },
        { input: 'nums = [0,0,0]', output: '[[0,0,0]]', explain: 'The only possible triplet sums up to 0.', viz: { nums: '0, 0, 0' } },
        { input: 'nums = [-2,0,0,2,2]', output: '[[-2,0,2]]', explain: 'Apna example (LeetCode ka nahi): triplet milne ke baad duplicate-skip wale while loops sach me l aur r ko aage khiskaate dikhenge.', viz: { nums: '-2, 0, 0, 2, 2' } },
      ],
      constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    },
    approaches: [
      { level: 'Brute', idea: 'Teen loops se har (i, j, k) triplet try karo. Sum 0 ho toh triplet sort karke <code>HashSet</code> me daalo — sorted hone se same triplet ek hi baar aata hai.', time: 'O(n³)', space: 'O(k) (unique triplets ka set)', code: A7[0] },
      { level: 'Better', idea: 'i fix karo, baaki array pe Day-1 wala HashSet Two Sum: har j pe pucho "<code>-(nums[i] + nums[j])</code> pehle dekha kya?". Triplets ko sort karke set me daalo (dedupe).', time: 'O(n²)', space: 'O(n) (seen set) + set of triplets', code: A7[1] },
      { level: 'Optimal', idea: 'Array sort karo. i fix karo, l = i+1, r = n−1 se sorted Two Sum: sum &lt; 0 → l++, sum &gt; 0 → r--, sum = 0 → add. Same i value aur same l / r values skip karo — set ki zaroorat hi nahi.', time: 'O(n²)', space: 'O(1) extra (sort ka O(log n) stack, output alag)', code: A7[2] },
    ],
    viz: {
      title: '3Sum — sort + fix i + two pointers',
      inputs: [{ key: 'nums', label: 'nums', def: '-1, 0, 1, 2, -1, -4' }],
      check: ({ nums }) => (nums.length >= 3 && nums.length <= 9 ? '' : 'Visualizer ke liye 3 se 9 elements do.'),
      run({ nums }) {
        const a = nums.slice(), n = a.length, ans = [];
        let hasAns = false, hasN = false, i, l, r, sum;
        const V = () => Object.assign({ nums: K.iA(a) }, hasAns ? { ans: LS(ans) } : {}, hasN ? { n } : {}, i !== undefined ? { i } : {}, l !== undefined ? { l, r } : {}, sum !== undefined ? { sum } : {});
        const views = o => {
          const out = [K.A('nums', a, o.hl, o.ptr)];
          if (hasAns) out.push(K.S('List ans', ans.map(TS), o.sh));
          return out;
        };
        const P = extra => {
          const hl = {}, ptr = [];
          if (i !== undefined && i < n) { hl[i] = 'done'; ptr.push({ i, label: 'i' }); }
          if (l !== undefined) { if (l < n) { hl[l] = 'cur'; ptr.push({ i: l, label: 'l' }); } if (r >= 0) { hl[r] = 'cur'; ptr.push({ i: r, label: 'r' }); } }
          return Object.assign({ hl, ptr }, extra || {});
        };
        const { st, steps } = K.tracer(A7[2], o => ({ views: views(o), vars: V() }));
        st('public List<List<Integer>> threeSum', `Method call: nums = ${K.iA(a)}`);
        a.sort((x, y) => x - y);
        st('Arrays.sort(nums)', `Sort: nums = ${K.iA(a)} — ab duplicates paas-paas, aur two pointers chal sakte hain`);
        hasAns = true;
        st('List<List<Integer>> ans', 'Khaali answer list');
        hasN = true;
        st('int n = nums.length', `n = ${n}`);
        for (i = 0; ; i++) {
          l = undefined; r = undefined; sum = undefined;
          if (!(i < n - 2)) { st('for (int i', `i = ${i}: ${i} < n−2 (${n - 2}) ✗ → loop khatam (2 elements se triplet nahi banta)`); break; }
          st('for (int i', `i = ${i}: ${i} < ${n - 2} ✓ → nums[i] = ${a[i]} fix`, P());
          if (i > 0 && a[i] === a[i - 1]) {
            st('if (i > 0 && nums[i] == nums[i - 1])', `nums[${i}] (${a[i]}) == nums[${i - 1}] (${a[i - 1]}) → same first value, wahi triplets dobara banenge → continue`, P({ hl: { [i]: 'skip' } }));
            continue;
          }
          st('if (i > 0 && nums[i] == nums[i - 1])', i === 0 ? 'i = 0 → pehla element, skip ka sawaal nahi' : `nums[${i}] (${a[i]}) ≠ nums[${i - 1}] (${a[i - 1]}) → naya value, aage badho`, P());
          l = i + 1; r = n - 1;
          st('int l = i + 1, r = n - 1', `l = ${l}, r = ${r} — ab sorted Two Sum: target = −nums[i] = ${-a[i]}`, P());
          while (true) {
            if (!(l < r)) { st('while (l < r)', `l (${l}) < r (${r}) ✗ → is i ke saare pairs dekh liye`, P()); break; }
            sum = undefined;
            st('while (l < r)', `l (${l}) < r (${r}) ✓`, P());
            sum = a[i] + a[l] + a[r];
            st('int sum', `sum = ${a[i]} + ${a[l]} + ${a[r]} = ${sum}`, P());
            if (sum < 0) {
              st('if (sum < 0)', `${sum} < 0 ✓ → sum chhota, bada number chahiye → l++`, P());
              l++;
              st(['l++;', 1], `l → ${l}`, P());
              continue;
            }
            st('if (sum < 0)', `${sum} < 0 ✗`, P());
            if (sum > 0) {
              st('} else if (sum > 0)', `${sum} > 0 ✓ → sum bada, chhota number chahiye → r--`, P());
              r--;
              st(['r--;', 1], `r → ${r}`, P());
              continue;
            }
            st('} else if (sum > 0)', `${sum} > 0 ✗ → sum == 0, triplet mila!`, P({ hl: { [i]: 'found', [l]: 'found', [r]: 'found' } }));
            ans.push([a[i], a[l], a[r]]);
            st('ans.add', `ans.add(${TS([a[i], a[l], a[r]])})`, P({ hl: { [i]: 'found', [l]: 'found', [r]: 'found' }, sh: TS([a[i], a[l], a[r]]) }));
            l++;
            st(['l++;', 2], `l++ → ${l}`, P());
            r--;
            st(['r--;', 2], `r-- → ${r}`, P());
            while (true) {
              const go = l < r && a[l] === a[l - 1];
              st('while (l < r && nums[l] == nums[l - 1])', go ? `nums[${l}] (${a[l]}) == nums[${l - 1}] → same value, l++` : l < r ? `nums[${l}] (${a[l]}) ≠ nums[${l - 1}] (${a[l - 1]}) → ruko` : `l (${l}) < r (${r}) ✗ → ruko`, P(go ? { hl: { [l]: 'skip' } } : {}));
              if (!go) break;
              l++;
            }
            while (true) {
              const go = l < r && a[r] === a[r + 1];
              st('while (l < r && nums[r] == nums[r + 1])', go ? `nums[${r}] (${a[r]}) == nums[${r + 1}] → same value, r--` : l < r ? `nums[${r}] (${a[r]}) ≠ nums[${r + 1}] (${a[r + 1]}) → ruko` : `l (${l}) < r (${r}) ✗ → ruko`, P(go ? { hl: { [r]: 'skip' } } : {}));
              if (!go) break;
              r--;
            }
          }
        }
        i = undefined; l = undefined; sum = undefined;
        st('return ans', `return ${LS(ans)} (${ans.length} unique triplet)`, { hl: {}, ret: LS(ans) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Teen loops + Set',
          run({ nums }) {
            const a = nums.slice(), set = new Map();
            let n, i, j, k, triplet;
            const V = () => Object.assign({ nums: K.iA(a), set: 'HashSet size=' + set.size + ' [' + [...set.keys()].join(', ') + ']' }, n !== undefined ? { n } : {}, i !== undefined ? { i } : {}, j !== undefined ? { j } : {}, k !== undefined ? { k } : {}, triplet ? { triplet: TS(triplet) } : {});
            const P = extra => {
              const hl = {}, ptr = [];
              if (i !== undefined && i < a.length) { hl[i] = 'cur'; ptr.push({ i, label: 'i' }); }
              if (j !== undefined && j < a.length) { hl[j] = 'cur'; ptr.push({ i: j, label: 'j' }); }
              if (k !== undefined && k < a.length) { hl[k] = 'win'; ptr.push({ i: k, label: 'k' }); }
              return Object.assign({ hl, ptr }, extra || {});
            };
            const { st, steps } = K.tracer(A7[0], o => ({ views: [K.A('nums', a, o.hl, o.ptr), K.S('Set<List> set', [...set.keys()], o.sh)], vars: V() }));
            st('public List<List<Integer>> threeSum', `Method call: nums = ${K.iA(a)}`);
            st('Set<List<Integer>> set', 'Khaali HashSet — sorted triplets rakhega, duplicate apne aap hat jayenge');
            n = a.length;
            st('int n = nums.length', `n = ${n}`);
            for (i = 0; ; i++) {
              j = undefined; k = undefined;
              if (!(i < n)) { st('for (int i', `i = ${i}: ✗ → saare triplets dekh liye`); break; }
              st('for (int i', `i = ${i}: ${i} < ${n} ✓`, P());
              for (j = i + 1; ; j++) {
                k = undefined;
                if (!(j < n)) { st('for (int j', `j = ${j}: ✗ → j loop khatam`, P()); break; }
                st('for (int j', `j = ${j}: ${j} < ${n} ✓`, P());
                for (k = j + 1; ; k++) {
                  if (!(k < n)) { st('for (int k', `k = ${k}: ✗ → k loop khatam`, P()); break; }
                  st('for (int k', `k = ${k}: ${k} < ${n} ✓`, P());
                  const s = a[i] + a[j] + a[k];
                  if (s !== 0) { st('if (nums[i] + nums[j] + nums[k] == 0)', `${a[i]} + ${a[j]} + ${a[k]} = ${s} ≠ 0`, P()); continue; }
                  st('if (nums[i] + nums[j] + nums[k] == 0)', `${a[i]} + ${a[j]} + ${a[k]} = 0 ✓ → triplet!`, P({ hl: { [i]: 'found', [j]: 'found', [k]: 'found' } }));
                  triplet = [a[i], a[j], a[k]];
                  st('List<Integer> triplet', `triplet = ${TS(triplet)}`, P({ hl: { [i]: 'found', [j]: 'found', [k]: 'found' } }));
                  triplet = sortedT(triplet);
                  st('Collections.sort(triplet)', `sort → ${TS(triplet)} — ab order se farak nahi padta`, P());
                  const key = TS(triplet), had = set.has(key);
                  set.set(key, triplet);
                  st('set.add(triplet)', had ? `${key} set me pehle se hai → duplicate, kuch nahi badla` : `set.add(${key})`, P({ sh: key }));
                  triplet = undefined;
                }
              }
            }
            i = undefined; j = undefined; k = undefined;
            st('return new ArrayList<>(set)', `return ${setRet(set)} — (HashSet ka order random hota hai; LeetCode koi bhi order accept karta hai, yahan sorted dikhaya)`, { ret: setRet(set) });
            return steps;
          },
        },
        {
          ap: 1, label: 'Fix i + HashSet Two Sum',
          run({ nums }) {
            const a = nums.slice(), set = new Map();
            let n, i, j, need, triplet, seen;
            const V = () => Object.assign({ nums: K.iA(a), set: 'HashSet size=' + set.size + ' [' + [...set.keys()].join(', ') + ']' }, n !== undefined ? { n } : {}, i !== undefined ? { i } : {}, seen ? { seen: K.setStr(seen) } : {}, j !== undefined ? { j } : {}, need !== undefined ? { need } : {}, triplet ? { triplet: TS(triplet) } : {});
            const P = extra => {
              const hl = {}, ptr = [];
              if (i !== undefined && i < a.length) { hl[i] = 'done'; ptr.push({ i, label: 'i' }); }
              if (j !== undefined && j < a.length) { hl[j] = 'cur'; ptr.push({ i: j, label: 'j' }); }
              return Object.assign({ hl, ptr }, extra || {});
            };
            const views = o => {
              const out = [K.A('nums', a, o.hl, o.ptr)];
              if (seen) out.push(K.S('HashSet seen', seen, o.seenH));
              out.push(K.S('Set<List> set', [...set.keys()], o.sh));
              return out;
            };
            const { st, steps } = K.tracer(A7[1], o => ({ views: views(o), vars: V() }));
            st('public List<List<Integer>> threeSum', `Method call: nums = ${K.iA(a)}`);
            st('Set<List<Integer>> set', 'Khaali HashSet of triplets (dedupe ke liye)');
            n = a.length;
            st('int n = nums.length', `n = ${n}`);
            for (i = 0; ; i++) {
              j = undefined; need = undefined; seen = undefined;
              if (!(i < n)) { st('for (int i', `i = ${i}: ✗ → loop khatam`); break; }
              st('for (int i', `i = ${i}: ${i} < ${n} ✓ → nums[i] = ${a[i]} fix, ab baaki pe Two Sum (target = ${-a[i]})`, P());
              seen = new Set();
              st('Set<Integer> seen', 'Naya khaali seen set — sirf is i ke baad wale elements', P());
              for (j = i + 1; ; j++) {
                need = undefined;
                if (!(j < n)) { st('for (int j', `j = ${j}: ✗ → is i ka kaam khatam`, P()); break; }
                st('for (int j', `j = ${j}: ${j} < ${n} ✓`, P());
                need = -(a[i] + a[j]);
                st('int need', `need = −(${a[i]} + ${a[j]}) = ${need}`, P());
                if (seen.has(need)) {
                  st('if (seen.contains(need))', `seen.contains(${need}) → true! teesra number pehle dekha tha`, P({ seenH: need, hl: { [i]: 'found', [j]: 'found' } }));
                  triplet = [a[i], a[j], need];
                  st('List<Integer> triplet', `triplet = ${TS(triplet)}`, P({ seenH: need }));
                  triplet = sortedT(triplet);
                  st('Collections.sort(triplet)', `sort → ${TS(triplet)}`, P());
                  const key = TS(triplet), had = set.has(key);
                  set.set(key, triplet);
                  st('set.add(triplet)', had ? `${key} pehle se set me → duplicate, ignore` : `set.add(${key})`, P({ sh: key }));
                  triplet = undefined;
                } else {
                  st('if (seen.contains(need))', `seen.contains(${need}) → false`, P());
                }
                seen.add(a[j]);
                st('seen.add(nums[j])', `seen.add(${a[j]})`, P({ seenH: a[j] }));
              }
            }
            i = undefined; j = undefined; need = undefined; seen = undefined;
            st('return new ArrayList<>(set)', `return ${setRet(set)} — (HashSet order random; yahan sorted dikhaya)`, { ret: setRet(set) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — 3Sum = fix one + Two Sum', blocks: [
        { p: 'a + b + c = 0 ⇒ b + c = <b>−a</b>. Matlab agar ek number <code>a = nums[i]</code> fix kar diya, toh baaki kaam hai <b>Two Sum with target = −a</b>. Day 1 (a1) me Two Sum ke do tareeke dekhe the: <b>HashSet/HashMap</b> ("pehle dekha kya?") aur <b>sort + two pointers</b>. 3Sum me dono chalte hain — bas har i ke liye ek baar.' },
        { pre: `sorted: [-4, -1, -1, 0, 1, 2]
              i   l           r      sum < 0 → l++   (bada chahiye)
                                     sum > 0 → r--   (chhota chahiye)
                                     sum = 0 → add, l++ r--, duplicates skip` },
        { p: '<b>Sorting ka double fayda:</b> (1) two pointers chal sakte hain, (2) same values paas-paas aa jaati hain, toh duplicate triplets ko bina set ke skip kar sakte ho — bas "pichhle wale ke barabar hai?" check.' },
        { tip: 'Pattern yaad rakho: <b>kSum = sort + (k−2) loops fix + two pointers</b>. 3Sum → O(n²), 4Sum (h6) → O(n³).' },
      ] },
      { title: '📄 Problem — LC 15 3Sum', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — teen loops' },
        { p: 'Har (i &lt; j &lt; k) try karo. Sum 0 ho toh triplet ko <b>sort</b> karke <code>HashSet&lt;List&lt;Integer&gt;&gt;</code> me daalo — <code>[0,-1,1]</code> aur <code>[-1,0,1]</code> sort ke baad same list ban jaate hain, set duplicate rakhta nahi. <b>O(n³)</b>. n = 3000 pe ~4.5 billion — TLE pakka.' },
        { h: '2. Better — fix i + HashSet Two Sum' },
        { p: 'Teesra loop asal me puchta hai: "kya <code>−(nums[i] + nums[j])</code> beech me kahin hai?" — yahi Day 1 ka sawaal hai! Har i ke liye ek naya <code>seen</code> HashSet: j aage badhta hai, <code>need = −(nums[i] + nums[j])</code> seen me hai toh triplet mila, phir <code>seen.add(nums[j])</code>. Dedupe ab bhi sorted-triplet set se. <b>O(n²)</b> time, O(n) extra.' },
        { h: '3. Optimal — sort + two pointers + skip duplicates' },
        { p: 'Pehle <code>Arrays.sort</code>. i fix, <code>l = i+1</code>, <code>r = n−1</code>: sum &lt; 0 → l++, sum &gt; 0 → r--, sum == 0 → add aur dono andar. Duplicates: (a) agar <code>nums[i] == nums[i−1]</code> toh ye i skip (same triplets dobara banenge), (b) triplet milne ke baad l ko same values se aage, r ko same values se peeche khiskao. Set ki zaroorat khatam → <b>O(n²)</b> time, <b>O(1)</b> extra. Better jaisa hi time, par hashing ka overhead aur extra memory nahi, aur output khud hi sorted order me aata hai.' },
        { tip: '<b>Kyun i ke liye <code>nums[i] == nums[i−1]</code>, aur <code>nums[i] == nums[i+1]</code> nahi?</b> i+1 se compare karoge toh <code>[-1,-1,2]</code> jaisa triplet miss ho jayega — pehla −1 skip ho jayega jabki use doosre −1 ke saath pair banana tha.' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [-1, 0, 1, 2, -1, -4] (Optimal)', blocks: [
        { p: 'Sort ke baad: <code>[-4, -1, -1, 0, 1, 2]</code>, n = 6, i &lt; 4.' },
        { table: { head: ['i (nums[i])', 'l, r', 'sum', 'Action', 'ans'], rows: [
          ['0 (−4)', '1, 5', '−4−1+2 = −3', 'l++', '[]'],
          ['', '2, 5', '−3', 'l++', '[]'],
          ['', '3, 5', '−4+0+2 = −2', 'l++', '[]'],
          ['', '4, 5', '−4+1+2 = −1', 'l++ → l = r, stop', '[]'],
          ['1 (−1)', '2, 5', '−1−1+2 = <b>0</b>', 'add, l = 3, r = 4 (skip check: koi dup nahi)', '[[-1,-1,2]]'],
          ['', '3, 4', '−1+0+1 = <b>0</b>', 'add, l = 4, r = 3 → stop', '[[-1,-1,2],[-1,0,1]]'],
          ['2 (−1)', '—', '—', 'nums[2] == nums[1] → <b>continue</b>', 'same'],
          ['3 (0)', '4, 5', '0+1+2 = 3', 'r-- → stop', 'same'],
          ['4', '—', '—', '4 &lt; 4 ✗ → loop khatam', '<b>[[-1,-1,2],[-1,0,1]]</b>'],
        ] } },
        { tip: 'i = 2 skip na karte toh wo bhi <code>[-1,0,1]</code> bana deta — duplicate. Yahi duplicate-skip ka kaam hai.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: A7[2] },
        { lines: [
          ['Arrays.sort(nums);', 'Two pointers ke liye sorted chahiye, aur duplicates paas-paas aa jaate hain.'],
          ['List<List<Integer>> ans = new ArrayList<>();', 'Answer list — set nahi chahiye kyunki duplicates hum khud skip karenge.'],
          ['for (int i = 0; i < n - 2; i++)', 'i ke baad kam se kam 2 elements chahiye (l aur r).'],
          ['if (i > 0 && nums[i] == nums[i - 1]) continue;', 'Same first value dobara fix karoge toh same triplets banenge. <code>i &gt; 0</code> taaki nums[−1] na padhe.'],
          ['int l = i + 1, r = n - 1;', 'Baaki hisse ke dono ends — sorted Two Sum.'],
          ['int sum = nums[i] + nums[l] + nums[r];', 'Teeno ka sum (max 3×10⁵, int me safe).'],
          ['if (sum < 0) l++;', 'Chhota sum → bada number lo → l aage.'],
          ['else if (sum > 0) r--;', 'Bada sum → chhota number lo → r peeche.'],
          ['ans.add(Arrays.asList(...)); l++; r--;', 'Triplet mila. Dono pointers andar, kyunki sirf ek hilane se sum 0 nahi rahega (ya same triplet banega).'],
          ['while (l < r && nums[l] == nums[l - 1]) l++;', 'Same l value skip — warna same triplet dobara.'],
          ['while (l < r && nums[r] == nums[r + 1]) r--;', 'Same r value skip.'],
          ['return ans;', 'Saare unique triplets (sorted order me).'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute (teen loops) → Better (HashSet) → Optimal</b>. Example 4 (<code>-2, 0, 0, 2, 2</code>) me duplicate-skip loops chalte dikhenge. Apna input bhi try karo: <code>-2, 0, 1, 1, 2</code>.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Sab zero <code>[0,0,0,0]</code> → sirf <code>[[0,0,0]]</code>; i = 1, 2 skip ho jaate hain.',
          'Koi answer nahi <code>[0,1,1]</code> → <code>[]</code>.',
          'Saare positive (ya saare negative) → koi triplet nahi. Optimization: sorted me <code>nums[i] &gt; 0</code> ho toh <code>break</code> — aage sab positive.',
          'Bahut saare duplicates <code>[-2,0,0,2,2]</code> → <code>[[-2,0,2]]</code> sirf ek baar.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Duplicate skip bhool jana → <code>[[-1,0,1],[-1,0,1]]</code> jaisa output.',
          'i ke liye <code>nums[i] == nums[i+1]</code> se skip karna → <code>[-1,-1,2]</code> miss.',
          'Triplet milne ke baad sirf l++ karna aur r-- nahi (ya ulta) → faltu iterations / duplicates.',
          'Skip loops me <code>l &lt; r</code> check bhool jana → index bahar.',
          'Brute/Better me triplet sort kiye bina set me daalna → <code>[0,-1,1]</code> aur <code>[-1,0,1]</code> dono aa jayenge.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute', 'O(n³)', 'O(k) set', 'teen nested loops; k = unique triplets'],
          ['Better', 'O(n²)', 'O(n) + set', 'har i ke liye ek pass, HashSet lookup O(1) avg'],
          ['Optimal', 'O(n²)', 'O(1) extra', 'sort O(n log n) + har i pe O(n) two pointers; output ko space me nahi ginte'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['How is 3Sum related to Two Sum?', 'Fix one number a; the remaining problem is Two Sum with target −a. Doing that for every a gives O(n²).'],
          ['Why do we sort the array first?', 'Sorting enables the two-pointer Two Sum and puts equal values next to each other, so duplicates can be skipped without a set.'],
          ['How do you avoid duplicate triplets?', 'Skip i when nums[i] equals nums[i − 1], and after recording a triplet move l and r past equal values.'],
          ['Why compare nums[i] with nums[i − 1] and not nums[i + 1]?', 'Comparing with i + 1 would skip the first copy, so triplets that use two equal values, like [−1, −1, 2], would be missed.'],
          ['Can we do better than O(n²)?', 'Not in general; O(n²) is the accepted bound for 3Sum in interviews. Sorting is only O(n log n), so it does not dominate.'],
          ['What is the space complexity?', 'O(1) extra apart from the output, plus the stack used by the sort (O(log n)).'],
          ['Any early termination?', 'Yes, if nums[i] > 0 after sorting, break, because all remaining numbers are positive and cannot sum to 0.'],
          ['How would you extend this to 4Sum?', 'Sort, fix two indices with two loops (skipping duplicates for both), then run two pointers: O(n³). Use long for the sum to avoid overflow.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Brute force checks every triplet in O(n cubed). Fixing one number turns the rest into Two Sum with target minus that number, which a HashSet solves in O(n), giving O(n squared) but with extra memory and a set for deduplication. The optimal approach sorts the array, fixes i, and runs two pointers l and r on the rest: if the sum is too small I move l right, if too large I move r left, and on zero I record the triplet. I skip equal values for i, l and r to avoid duplicates. That is O(n squared) time and O(1) extra space.'],
          ['Aise bolo — duplicates', 'Because the array is sorted, equal values are adjacent. I skip i when it equals the previous value, and after finding a triplet I move l and r past any equal neighbours, so every triplet is produced exactly once without a hash set.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [-2, 0, 1, 1, 2] — Optimal ka output?', '<b>[[-2, 0, 2], [-2, 1, 1]]</b>. i = 0 (−2): l = 1, r = 4 → 0 ✓; phir l = 2, r = 3 → −2+1+1 = 0 ✓.'],
          ['Triplet milne ke baad duplicate-skip while loops hata do toh <code>[-2, 0, 0, 2, 2]</code> pe kya hoga?', 'l = 2, r = 3 pe phir −2+0+2 = 0 → <b>[-2,0,2] do baar</b> aa jayega.'],
          ['Better approach me har i pe naya <code>seen</code> set kyun?', 'seen me sirf <b>i ke baad</b> aur j se pehle wale elements hone chahiye — warna nums[i] khud ya pichhle i ke elements dobara use ho jayenge.'],
        ] },
        { olist: ['Optimal code 6 min me bina dekhe likho (duplicate skip ke saath).', 'Dry run khud karo: <code>[-1,0,1,2,-1,-4]</code> → sort → table banao.'] },
      ] },
    ],
    checks: [
      '3Sum = fix one + Two Sum — Day 1 se connection bol sakta hoon',
      'Teeno duplicate-skip (i, l, r) kyun aur kaise — samjha',
      'Brute → Better → Optimal ka time/space bol sakta hoon',
      'Optimal code 6 min me bina dekhe likh sakta hoon',
    ],
    memory: 'Sort → i fix → l, r se Two Sum (−nums[i]); same i, same l, same r skip.',
    tests: [
      { run: T3('-1,0,1,2,-1,-4'), out: '[[-1, -1, 2], [-1, 0, 1]]' },
      { run: T3('0,1,1'), out: '[]' },
      { run: T3('0,0,0'), out: '[[0, 0, 0]]' },
      { run: T3('-2,0,0,2,2'), out: '[[-2, 0, 2]]' },
      { run: T3('-2,0,1,1,2'), out: '[[-2, 0, 2], [-2, 1, 1]]' },
      { run: T3('0,0,0,0'), out: '[[0, 0, 0]]' },
    ],
  };

  // =====================================================================
  // a8 — Container With Most Water (LC 11)
  // =====================================================================
  const A8 = [
    `public int maxArea(int[] height) {
    int best = 0;
    for (int i = 0; i < height.length; i++) {
        for (int j = i + 1; j < height.length; j++) {
            int area = Math.min(height[i], height[j]) * (j - i);
            best = Math.max(best, area);
        }
    }
    return best;
}`,
    `public int maxArea(int[] height) {
    int l = 0, r = height.length - 1;
    int best = 0;
    while (l < r) {
        int area = Math.min(height[l], height[r]) * (r - l);
        best = Math.max(best, area);
        if (height[l] < height[r]) {
            l++;
        } else {
            r--;
        }
    }
    return best;
}`,
  ];

  L.a8 = {
    kind: 'dsa', title: 'Container With Most Water', topic: 'Arrays & Two Pointers', diff: 'M', lc: 11,
    url: 'https://leetcode.com/problems/container-with-most-water/',
    pattern: 'Two pointers (opposite ends, greedy)',
    oneLine: 'l = 0, r = n−1. Area = min(h[l], h[r]) × (r − l). Hamesha chhoti deewar wala pointer andar khiskao.',
    goal: 'Do deewaren chuno jinke beech sabse zyada paani aaye. Asli seekh: <b>opposite-end two pointers + greedy proof</b> — Segregate 0s/1s (a3) jaisa hi start/end andar aate hain, par yahan rule hai <b>"chhoti deewar hatao"</b>, aur ye kyun sahi hai wo samajhna hi interview ka asli sawaal hai.',
    problem: {
      statement: 'You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i<sup>th</sup></code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.<br><br>Find two lines that together with the x-axis form a container, such that the container contains the most water.<br><br>Return <i>the maximum amount of water a container can store</i>.<br><br><b>Notice</b> that you may not slant the container.',
      examples: [
        { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explain: 'The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49 (lines at index 1 and 8: min(8, 7) × 7 = 49).', viz: { height: '1, 8, 6, 2, 5, 4, 8, 3, 7' } },
        { input: 'height = [1,1]', output: '1', explain: 'Sirf do lines: min(1, 1) × 1 = 1.', viz: { height: '1, 1' } },
      ],
      constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    },
    approaches: [
      { level: 'Brute', idea: 'Har pair (i, j) ka area nikalo: <code>min(h[i], h[j]) × (j − i)</code>, max rakho.', time: 'O(n²)', space: 'O(1)', code: A8[0] },
      { level: 'Optimal', idea: 'l = 0, r = n−1 (sabse chauda container). Area check karo, phir <b>chhoti deewar</b> wala pointer andar — kyunki chhoti deewar ke saath koi bhi aur chhota container isse bada nahi ho sakta.', time: 'O(n)', space: 'O(1)', code: A8[1] },
    ],
    viz: {
      title: 'Container With Most Water — two pointers, chhoti deewar hatao',
      inputs: [{ key: 'height', label: 'height', def: '1, 8, 6, 2, 5, 4, 8, 3, 7' }],
      check: ({ height }) => (height.length >= 2 && height.length <= 12 ? '' : 'Visualizer ke liye 2 se 12 elements do.'),
      run({ height }) {
        const h = height.slice(), n = h.length;
        let l, r, best, area;
        const V = () => Object.assign({ height: K.iA(h) }, l !== undefined ? { l, r } : {}, best !== undefined ? { best } : {}, area !== undefined ? { area } : {});
        const P = extra => Object.assign({ hl: l !== undefined ? { [l]: 'cur', [r]: 'cur' } : {}, ptr: l !== undefined ? [{ i: l, label: 'l' }, { i: r, label: 'r' }] : [] }, extra || {});
        const { st, steps } = K.tracer(A8[1], o => ({ views: [K.A('height', h, o.hl, o.ptr)], vars: V() }));
        st('public int maxArea', `Method call: height = ${K.iA(h)}`);
        l = 0; r = n - 1;
        st('int l = 0, r', `l = 0, r = ${r} — sabse chauda container se shuru`, P());
        best = 0;
        st('int best = 0', 'best = 0', P());
        while (true) {
          if (!(l < r)) { area = undefined; st('while (l < r)', `l (${l}) < r (${r}) ✗ → pointers mil gaye`, P()); break; }
          area = undefined;
          st('while (l < r)', `l (${l}) < r (${r}) ✓`, P());
          area = Math.min(h[l], h[r]) * (r - l);
          st('int area', `area = min(${h[l]}, ${h[r]}) × (${r} − ${l}) = ${Math.min(h[l], h[r])} × ${r - l} = ${area}`, P({ hl: K.rng(l, r, 'win', { [l]: 'cur', [r]: 'cur' }) }));
          const nb = Math.max(best, area);
          st('best = Math.max', nb > best ? `best = max(${best}, ${area}) = ${nb} ↑ naya best!` : `best = max(${best}, ${area}) = ${nb}`, P(nb > best ? { hl: { [l]: 'found', [r]: 'found' } } : {}));
          best = nb;
          if (h[l] < h[r]) {
            st('if (height[l] < height[r])', `${h[l]} < ${h[r]} ✓ → left chhoti hai, wahi limit kar rahi → l++`, P({ hl: { [l]: 'skip', [r]: 'cur' } }));
            l++;
            st('l++;', `l → ${l}`, P());
          } else {
            st('if (height[l] < height[r])', `${h[l]} < ${h[r]} ✗ → right chhoti (ya barabar) → r--`, P({ hl: { [l]: 'cur', [r]: 'skip' } }));
            r--;
            st('r--;', `r → ${r}`, P());
          }
        }
        area = undefined;
        st('return best', `return ${best}`, { ret: String(best) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Har pair',
          run({ height }) {
            const h = height.slice(), n = h.length;
            let best, i, j, area;
            const V = () => Object.assign({ height: K.iA(h) }, best !== undefined ? { best } : {}, i !== undefined ? { i } : {}, j !== undefined ? { j } : {}, area !== undefined ? { area } : {});
            const P = extra => {
              const hl = {}, ptr = [];
              if (i !== undefined && i < n) { hl[i] = 'cur'; ptr.push({ i, label: 'i' }); }
              if (j !== undefined && j < n) { hl[j] = 'cur'; ptr.push({ i: j, label: 'j' }); }
              return Object.assign({ hl, ptr }, extra || {});
            };
            const { st, steps } = K.tracer(A8[0], o => ({ views: [K.A('height', h, o.hl, o.ptr)], vars: V() }));
            st('public int maxArea', `Method call: height = ${K.iA(h)}`);
            best = 0;
            st('int best = 0', 'best = 0');
            for (i = 0; ; i++) {
              j = undefined; area = undefined;
              if (!(i < n)) { st('for (int i', `i = ${i}: ✗ → saare pairs dekh liye`); break; }
              st('for (int i', `i = ${i}: ${i} < ${n} ✓`, P());
              for (j = i + 1; ; j++) {
                area = undefined;
                if (!(j < n)) { st('for (int j', `j = ${j}: ✗ → inner loop khatam`, P()); break; }
                st('for (int j', `j = ${j}: ${j} < ${n} ✓`, P());
                area = Math.min(h[i], h[j]) * (j - i);
                st('int area', `area = min(${h[i]}, ${h[j]}) × (${j} − ${i}) = ${area}`, P());
                const nb = Math.max(best, area);
                st('best = Math.max', nb > best ? `best = max(${best}, ${area}) = ${nb} ↑` : `best = max(${best}, ${area}) = ${nb}`, P(nb > best ? { hl: { [i]: 'found', [j]: 'found' } } : {}));
                best = nb;
              }
            }
            i = undefined; j = undefined; area = undefined;
            st('return best', `return ${best}`, { ret: String(best) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Opposite-end two pointers + greedy', blocks: [
        { p: 'Paani = <b>chaudai × oonchai</b> = <code>(r − l) × min(h[l], h[r])</code>. Oonchai <b>chhoti deewar</b> decide karti hai (paani usse upar se bah jayega).' },
        { pre: `height: [1, 8, 6, 2, 5, 4, 8, 3, 7]
             l                       r     width 8, min(1,7) = 1 → area 8
   chhoti = h[l] = 1 → l++ (1 wali deewar kisi bhi pair me 8 se zyada nahi de sakti)` },
        { p: 'Segregate 0s/1s (a3) me bhi start/end dono ends se andar aate the. Yahan bhi wahi dhaancha hai — bas har step pe sawaal: <b>kaunsa pointer hilaun?</b> Jawab: <b>chhoti deewar wala</b>.' },
        { tip: '<b>Proof (yaad rakho):</b> maan lo h[l] &lt; h[r]. l ko fix rakh ke r ko andar laane se chaudai ghategi aur oonchai ≤ h[l] hi rahegi → area kabhi badhega nahi. Toh l ke saare baaki pairs bekaar — l ko hata do. Har step ek deewar ko hamesha ke liye "khatam" karta hai → n steps.' },
      ] },
      { title: '📄 Problem — LC 11 Container With Most Water', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — har pair' },
        { p: 'Do loops, har (i, j) ka area, max rakho. Pairs = n(n−1)/2 → <b>O(n²)</b>. n = 10⁵ pe 5 × 10⁹ — TLE.' },
        { h: 'Better?' },
        { p: 'Yahan alag Better approach nahi hai — Brute ke baad seedha Optimal. (Sort karna kaam nahi aata, kyunki index = chaudai hai; sort se positions bigad jaati hain.)' },
        { h: '2. Optimal — dono ends se, chhoti deewar hatao' },
        { p: 'Sabse chauda container (l = 0, r = n−1) se shuru karo. Area check, best update. Ab chaudai to har haal me ghategi, toh area tabhi badh sakta hai jab oonchai badhe — aur oonchai chhoti deewar ki wajah se ruki hai. Isliye <b>chhoti deewar wala pointer andar</b>. Barabar ho toh koi bhi hilao (dono me se koi bhi aage bada area nahi de sakta jab tak dono na badlein). <b>O(n)</b>, O(1).' },
        { tip: 'Badi deewar hilaoge toh kya hoga? Oonchai ab bhi chhoti deewar se bandhi rahegi aur chaudai kam → area pakka kam ya barabar. Isliye wo move bekaar hai.' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — height = [1, 8, 6, 2, 5, 4, 8, 3, 7] (Optimal)', blocks: [
        { table: { head: ['l, r', 'h[l], h[r]', 'area', 'best', 'Move'], rows: [
          ['0, 8', '1, 7', '1 × 8 = 8', '8', '1 &lt; 7 → l++'],
          ['1, 8', '8, 7', '7 × 7 = <b>49</b>', '<b>49</b>', '8 ≥ 7 → r--'],
          ['1, 7', '8, 3', '3 × 6 = 18', '49', 'r--'],
          ['1, 6', '8, 8', '8 × 5 = 40', '49', 'barabar → r--'],
          ['1, 5', '8, 4', '4 × 4 = 16', '49', 'r--'],
          ['1, 4', '8, 5', '5 × 3 = 15', '49', 'r--'],
          ['1, 3', '8, 2', '2 × 2 = 4', '49', 'r--'],
          ['1, 2', '8, 6', '6 × 1 = 6', '49', 'r-- → l = r, stop'],
        ] } },
        { p: 'Sirf <b>8 area checks</b> (Brute me 36). Answer <b>49</b>.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: A8[1] },
        { lines: [
          ['int l = 0, r = height.length - 1;', 'Sabse chauda container — dono ends.'],
          ['int best = 0;', 'Ab tak ka max area.'],
          ['while (l < r)', 'Container ke liye do alag deewaren chahiye.'],
          ['int area = Math.min(height[l], height[r]) * (r - l);', 'Oonchai = chhoti deewar, chaudai = index ka farak. Max 10⁴ × 10⁵ = 10⁹ → int me safe.'],
          ['best = Math.max(best, area);', 'Best update.'],
          ['if (height[l] < height[r]) l++;', 'Left chhoti → left ke saare baaki pairs bekaar → l aage.'],
          ['else r--;', 'Right chhoti ya barabar → r peeche.'],
          ['return best;', 'Har deewar max ek baar hati → O(n).'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute (har pair) → Optimal</b>. Optimal me orange = current container. Apna input: <code>4, 3, 2, 1, 4</code> (answer 16) ya <code>1, 2, 1</code> (answer 2).' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Sirf 2 lines <code>[1,1]</code> → ek hi container, area 1.',
          'Height 0 wali deewar <code>[0,2]</code> → area 0.',
          'Dono ends sabse oonche <code>[4,3,2,1,4]</code> → pehla hi container best: 4 × 4 = 16.',
          'Barabar heights pe koi bhi pointer hilao — answer same aata hai.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Badi deewar wala pointer hilana → sahi answer miss.',
          'Area me <code>max</code> lena <code>min</code> ki jagah — paani chhoti deewar tak hi rukta hai.',
          'Chaudai <code>r − l + 1</code> likhna — sahi hai <code>r − l</code> (x-axis pe distance).',
          'Isse "Trapping Rain Water" (LC 42) samajh lena — wahan har bar ke upar paani ginte hain, yahan sirf do deewaren.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute', 'O(n²)', 'O(1)', 'n(n−1)/2 pairs'],
          ['Optimal', 'O(n)', 'O(1)', 'har step ek pointer andar; total n − 1 steps'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why do we move the pointer at the shorter line?', 'The area is limited by the shorter line. Keeping it and moving the other pointer only reduces the width while the height cannot exceed the shorter line, so no better container uses that shorter line. We can safely discard it.'],
          ['What if both heights are equal?', 'Move either one. Any better container must have both walls taller than this height, so neither current wall can be part of it.'],
          ['Why start from both ends?', 'That gives the maximum width; every move then trades width for a chance at more height.'],
          ['Can sorting help here?', 'No. The index is the x-coordinate, so sorting destroys the widths.'],
          ['Is there overflow risk?', 'Max area is 10^4 × 10^5 = 10^9, which fits in an int.'],
          ['How is this different from Trapping Rain Water?', 'Here we pick only two lines and ignore the lines between them; in Trapping Rain Water we sum the water above every bar.'],
          ['What is the time and space complexity?', 'O(n) time because each step moves one pointer inward, and O(1) extra space.'],
          ['Could you return the indices instead of the area?', 'Yes, store l and r whenever best is updated and return them at the end.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Brute force tries every pair in O(n squared). Instead I start with two pointers at both ends, which is the widest container. I compute the area as the minimum height times the width and update the best. Then I move the pointer at the shorter line inward, because that line limits the height; keeping it while reducing the width can never give a larger area. Each step discards one line, so it is O(n) time and O(1) space.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['height = [4, 3, 2, 1, 4] — answer aur kaunsi deewaren?', '<b>16</b> — index 0 aur 4: min(4, 4) × 4. Pehla hi container best hai.'],
          ['Galti se badi deewar hilao toh [1, 8, 6, 2, 5, 4, 8, 3, 7] pe kya hoga?', 'l = 0 (1) fixed rahega aur r andar aata rahega — har area ≤ 1 × width. 49 wala (1, 8) pair kabhi check hi nahi hoga → <b>galat answer 8</b>.'],
          ['Chaudai <code>r − l</code> kyun, <code>r − l + 1</code> kyun nahi?', 'Deewaren x = l aur x = r pe hain; beech ka distance <b>r − l</b> hai. (+1 tab hota jab elements gin rahe hote.)'],
        ] },
        { olist: ['Optimal code 3 min me bina dekhe likho.', '"Chhoti deewar kyun hilate hain" ka proof 20 sec me English me bolo.'] },
      ] },
    ],
    checks: [
      'Area formula aur "chhoti deewar limit karti hai" samjha',
      'Chhoti deewar hilane ka proof apne words me bol sakta hoon',
      'Segregate 0s/1s wale opposite-end pointers se connection samjha',
      'Code 3 min me bina dekhe likh sakta hoon',
    ],
    memory: 'Dono ends se shuru; area = min × width; chhoti deewar andar.',
    tests: [
      { run: 'System.out.print(o.maxArea(new int[]{1,8,6,2,5,4,8,3,7}));', out: '49' },
      { run: 'System.out.print(o.maxArea(new int[]{1,1}));', out: '1' },
      { run: 'System.out.print(o.maxArea(new int[]{4,3,2,1,4}));', out: '16' },
      { run: 'System.out.print(o.maxArea(new int[]{1,2,1}));', out: '2' },
      { run: 'System.out.print(o.maxArea(new int[]{0,2}));', out: '0' },
    ],
  };
})();
