// Planner lessons — Sliding Window (a5 Max Consecutive Ones, a6 Max Consecutive Ones III)
// Format: planner/learn.js ke upar comment dekho. Viz steps: lesson-kit.js tracer (har line = ek step, VARIABLES me saare locals).
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;
  const binCheck = key => inp => (inp[key].every(v => v === 0 || v === 1) ? '' : key + ' me sirf 0 aur 1 hone chahiye.');

  // =====================================================================
  // a5 — Max Consecutive Ones (LC 485)
  // =====================================================================
  const A5 = [
    `public int findMaxConsecutiveOnes(int[] nums) {
    int best = 0;
    for (int i = 0; i < nums.length; i++) {
        int count = 0;
        for (int j = i; j < nums.length && nums[j] == 1; j++) {
            count++;
        }
        best = Math.max(best, count);
    }
    return best;
}`,
    `public int findMaxConsecutiveOnes(int[] nums) {
    int count = 0, best = 0;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == 1) {
            count++;
            best = Math.max(best, count);
        } else {
            count = 0;
        }
    }
    return best;
}`,
  ];

  L.a5 = {
    kind: 'dsa', title: 'Max Consecutive Ones', topic: 'Sliding Window', diff: 'E', lc: 485,
    url: 'https://leetcode.com/problems/max-consecutive-ones/',
    pattern: 'Running counter (window ki neev)',
    oneLine: 'count = abhi ka 1s ka run; 1 mile toh count++ aur best update, 0 mile toh count = 0.',
    goal: 'Binary array me <b>lagataar 1s</b> ka sabse lamba run dhoondo. Asli seekh: <b>running counter</b> — ek pass me "abhi ka run" aur "ab tak ka best" saath le ke chalna. Yahi <b>sliding window</b> ki neev hai: kal (a6) isi run ko k zeros tak "stretch" karenge.',
    problem: {
      statement: 'Given a binary array <code>nums</code>, return <i>the maximum number of consecutive</i> <code>1</code><i>\'s in the array</i>.',
      examples: [
        { input: 'nums = [1,1,0,1,1,1]', output: '3', explain: 'The first two digits or the last three digits are consecutive 1s. The maximum number of consecutive 1s is 3.', viz: { nums: '1, 1, 0, 1, 1, 1' } },
        { input: 'nums = [1,0,1,1,0,1]', output: '2', explain: 'Beech wale do 1 (index 2, 3) sabse lamba run hai.', viz: { nums: '1, 0, 1, 1, 0, 1' } },
      ],
      constraints: ['1 <= nums.length <= 10^5', 'nums[i] is either 0 or 1.'],
    },
    approaches: [
      { level: 'Brute', idea: 'Har start index i se aage 1s gino jab tak 0 na aaye; sab runs ka max lo.', time: 'O(n²)', space: 'O(1)', code: A5[0] },
      { level: 'Optimal', idea: 'Ek pass: <code>count</code> = abhi chal raha 1s ka run. 1 → count++ aur best update; 0 → run toot gaya, count = 0.', time: 'O(n)', space: 'O(1)', code: A5[1] },
    ],
    viz: {
      title: 'Max Consecutive Ones — ek pass counter',
      inputs: [{ key: 'nums', label: 'nums (sirf 0 / 1)', def: '1, 1, 0, 1, 1, 1' }],
      check: binCheck('nums'),
      run({ nums }) {
        let count, best, i;
        const V = () => Object.assign({ nums: K.iA(nums) }, count !== undefined ? { count, best } : {}, i !== undefined ? { i } : {});
        const H = extra => Object.assign(i !== undefined ? K.rng(i - count + 1, i, 'win') : {}, extra || {});
        const { st, steps } = K.tracer(A5[1], o => ({ views: [K.A('nums', nums, o.hl, o.ptr)], vars: V() }));
        st('public int findMaxConsecutiveOnes', `Method call: nums = ${K.iA(nums)}`);
        count = 0; best = 0;
        st('int count = 0, best = 0', 'count = 0 (abhi ka run), best = 0 (ab tak ka sabse lamba)');
        for (i = 0; ; i++) {
          if (!(i < nums.length)) { i = undefined; st('for (int i', `i = ${nums.length}: ${nums.length} < ${nums.length} ✗ → loop khatam`); break; }
          const P = () => ({ hl: H({ [i]: 'cur' }), ptr: [{ i, label: 'i' }] });
          st('for (int i', `i = ${i}: ${i} < ${nums.length} ✓`, { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] });
          if (nums[i] === 1) {
            st('if (nums[i] == 1)', `nums[${i}] = 1 → run aage badhega`, { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] });
            count++;
            st('count++', `count++ → ${count} (run: index ${i - count + 1}..${i})`, P());
            const old = best;
            best = Math.max(best, count);
            st('best = Math.max', `best = max(${old}, ${count}) = ${best}`, P());
          } else {
            st('if (nums[i] == 1)', `nums[${i}] = 0 → run toot gaya`, { hl: { [i]: 'skip' }, ptr: [{ i, label: 'i' }] });
            count = 0;
            st('count = 0;', 'count = 0 — naya run agle 1 se shuru hoga', { hl: { [i]: 'skip' }, ptr: [{ i, label: 'i' }] });
          }
        }
        st('return best', `return best = ${best}`, { ret: String(best) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Har start se gino',
          run({ nums }) {
            let best, i, count, j;
            const V = () => Object.assign({ nums: K.iA(nums), best }, i !== undefined ? { i } : {}, count !== undefined ? { count } : {}, j !== undefined ? { j } : {});
            const { st, steps } = K.tracer(A5[0], o => ({ views: [K.A('nums', nums, o.hl, o.ptr)], vars: V() }));
            best = 0;
            st('public int findMaxConsecutiveOnes', `Method call: nums = ${K.iA(nums)}`);
            st('int best = 0', 'best = 0');
            for (i = 0; ; i++) {
              if (!(i < nums.length)) { i = undefined; count = undefined; j = undefined; st('for (int i', `i = ${nums.length}: ✗ → outer loop khatam`); break; }
              count = undefined; j = undefined;
              st('for (int i', `i = ${i}: ${i} < ${nums.length} ✓ — yahan se run ginenge`, { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] });
              count = 0;
              st('int count = 0', 'count = 0', { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] });
              for (j = i; ; j++) {
                const ok = j < nums.length && nums[j] === 1;
                const ptr = [{ i, label: 'i' }].concat(j < nums.length ? [{ i: j, label: 'j' }] : []);
                if (!ok) {
                  st('for (int j', j < nums.length ? `j = ${j}: nums[${j}] = 0 ✗ → run khatam` : `j = ${j}: array khatam ✗`, { hl: K.rng(i, j - 1, 'win', j < nums.length ? { [j]: 'skip' } : {}), ptr });
                  break;
                }
                st('for (int j', `j = ${j}: nums[${j}] = 1 ✓`, { hl: K.rng(i, j - 1, 'win', { [j]: 'cur' }), ptr });
                count++;
                st('count++', `count++ → ${count}`, { hl: K.rng(i, j, 'win'), ptr });
              }
              const old = best;
              best = Math.max(best, count);
              st('best = Math.max', `best = max(${old}, ${count}) = ${best}`, { hl: K.rng(i, i + count - 1, 'win'), ptr: [{ i, label: 'i' }] });
            }
            st('return best', `return best = ${best}`, { ret: String(best) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Running counter (sliding window ki neev)', blocks: [
        { p: '<b>Running counter:</b> array ek baar left → right padho, aur do cheezein saath le ke chalo — <code>count</code> (abhi jo run chal raha hai) aur <code>best</code> (ab tak ka sabse bada). Har element pe faisla: run aage badhe ya toote?' },
        { pre: `nums:  1 1 0 1 1 1
count: 1 2 0 1 2 3
best:  1 2 2 2 2 3   → answer 3` },
        { p: 'Socho ise ek <b>window</b> ki tarah: window = abhi ka 1s ka run. 1 aaya → window right me badhi. 0 aaya → window poori khaali (reset). Kal ki problem (a6) me 0 aane pe window <b>poori reset nahi</b> hogi — sirf left se thodi chhoti hogi. Wahi asli <b>sliding window</b> hai.' },
        { tip: '<b>Pattern pehchano:</b> "longest / maximum <i>consecutive</i> / <i>contiguous</i> …" sunte hi socho — ek pass me current run + best. Nested loop ki zaroorat nahi.' },
      ] },
      { title: '📄 Problem — LC 485 Max Consecutive Ones', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — har start se gino' },
        { p: 'Har index i ko run ka start maano, aage j chalao jab tak 1 mile, count ka max lo. Worst case (sab 1) me n + (n−1) + … = <b>O(n²)</b>. n = 10⁵ pe ~5 × 10⁹ — TLE.' },
        { h: 'Better?' },
        { p: 'Yahan alag Better approach nahi hai — Brute ke baad seedha Optimal. (Brute ka koi "thoda tez" version banana fake Better hoga.)' },
        { h: '2. Optimal — ek pass counter' },
        { p: 'Brute me faltu kaam kahan hai? Run [1,1,1] me i = 0 se 3 gine, phir i = 1 se wahi 2 dobara gine. Ek run ko ek hi baar gino: 1 mile toh <code>count++</code>, 0 mile toh <code>count = 0</code>. Har 1 pe <code>best = max(best, count)</code>. <b>O(n)</b> time, <b>O(1)</b> space.' },
        { tip: '<b>best kab update karo?</b> Har 1 ke baad (jaise yahan) — taaki array 1 pe khatam ho tab bhi last run gina jaaye. Sirf 0 pe update karoge toh <code>[1,1,1]</code> ka answer 0 aa jayega.' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [1, 1, 0, 1, 1, 1] (Optimal)', blocks: [
        { table: { head: ['i', 'nums[i]', 'Action', 'count', 'best'], rows: [
          ['start', '—', 'count = 0, best = 0', '0', '0'],
          ['0', '1', 'count++', '1', '1'],
          ['1', '1', 'count++', '2', '2'],
          ['2', '0', 'count = 0', '0', '2'],
          ['3', '1', 'count++', '1', '2'],
          ['4', '1', 'count++', '2', '2'],
          ['5', '1', 'count++', '3', '<b>3</b>'],
        ] } },
        { p: 'Loop khatam → <b>return best = 3</b>.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: A5[1] },
        { lines: [
          ['int count = 0, best = 0;', 'count = abhi ka run, best = ab tak ka max. Dono 0 se, kyunki ho sakta hai array me ek bhi 1 na ho.'],
          ['for (int i = 0; i < nums.length; i++)', 'Sirf ek pass.'],
          ['if (nums[i] == 1)', 'Run aage badhega ya tootega — yahi ek faisla.'],
          ['count++;', 'Run me ek aur 1 juda.'],
          ['best = Math.max(best, count);', 'Har 1 pe update — array 1 pe khatam ho tab bhi last run count ho jaata hai.'],
          ['count = 0;', '0 ne run tod diya; agla run agle 1 se.'],
          ['return best;', 'Sabse lamba run.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute → Optimal</b> (Better nahi hai). Orange = abhi ka run (window). Apna input: <code>0, 0, 0</code> (answer 0) ya <code>1, 1, 1, 1</code> (answer 4).' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Sab 0 <code>[0,0,0]</code> → 0. best kabhi update nahi hua.',
          'Sab 1 <code>[1,1,1,1]</code> → 4. Run array ke end tak — isliye best har 1 pe update.',
          'Ek element <code>[1]</code> → 1, <code>[0]</code> → 0.',
          'Sabse lamba run shuru me <code>[1,1,1,0,1]</code> → 3. Baad wala chhota run best ko kam nahi karta.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'best sirf 0 milne pe update karna → array 1 pe khatam hua toh last run chhoot gaya (loop ke baad ek extra max chahiye hoga).',
          '0 pe <code>count = 0</code> ki jagah <code>count--</code> likh dena.',
          'best ko 1 se initialize karna → <code>[0]</code> pe galat answer 1.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (har start)', 'O(n²)', 'O(1)', 'har i se run dobara gina; sab 1 pe n(n+1)/2 steps'],
          ['Optimal (counter)', 'O(n)', 'O(1)', 'ek pass, sirf do int'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why do you update best on every 1 instead of on every 0?', 'If the array ends with 1s, there is no 0 after the last run, so it would never be counted. Updating on every 1 avoids a separate check after the loop.'],
          ['What does the brute force waste?', 'It recounts the same run from every start index inside it, so a run of length L costs about L²/2 work instead of L.'],
          ['What is the time and space complexity of the optimal solution?', 'O(n) time with one pass and O(1) extra space.'],
          ['Why initialise best to 0?', 'The array may contain no 1s at all, and then the correct answer is 0.'],
          ['What if you may flip at most one 0?', 'That is LC 487: keep a window with at most one zero, i.e. the sliding window from LC 1004 with k = 1.'],
          ['What if you may flip at most k zeros?', 'That is LC 1004: expand right, count zeros in the window, and shrink from the left while zeros > k. Still O(n).'],
          ['How would you also return where the longest run starts?', 'Whenever best improves, store the start as i − count + 1.'],
          ['What if the data arrives as a stream?', 'The same two variables work, because each element is processed once and never revisited.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'The brute force starts a count from every index, which is O(n squared). Instead I make one pass and keep two variables: count, the length of the current run of 1s, and best, the longest run seen so far. On a 1 I increment count and update best; on a 0 I reset count to zero. That is O(n) time and O(1) space.'],
          ['Aise bolo — follow-up link', 'This running counter is the simplest form of a sliding window. If we were allowed to flip k zeros, I would keep a window with at most k zeros and shrink it from the left instead of resetting it.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [0, 1, 1, 1, 0, 1, 1] — answer aur kis index pe best last baar badla?', '<b>3</b>. best index 3 pe 3 bana; baad me run sirf 2 tak gaya.'],
          ['best sirf 0 milne pe update karo toh [1, 1, 1] pe kya aayega?', '<b>0</b> — koi 0 aaya hi nahi, best kabhi update nahi hua. Isliye har 1 pe update.'],
          ['Brute sab-1 wale array (n = 4) pe count++ kitni baar chalega?', '4 + 3 + 2 + 1 = <b>10</b> baar — yahi O(n²).'],
        ] },
        { olist: ['Optimal code 2 min me bina dekhe likho.', 'Kal ke a6 se pehle socho: agar k zeros flip kar sakte, toh 0 aane pe count = 0 karna kyun galat hoga?'] },
      ] },
    ],
    checks: [
      'Brute O(n²) kyun hai aur Better kyun nahi hai — bol sakta hoon',
      'best har 1 pe update kyun — samjha',
      'Code 2 min me bina dekhe likh sakta hoon',
      '30 sec ka English interview answer bol sakta hoon',
    ],
    memory: '1 → count++ aur best = max; 0 → count = 0. Ek pass.',
    tests: [
      { run: 'System.out.print(o.findMaxConsecutiveOnes(new int[]{1,1,0,1,1,1}));', out: '3' },
      { run: 'System.out.print(o.findMaxConsecutiveOnes(new int[]{1,0,1,1,0,1}));', out: '2' },
      { run: 'System.out.print(o.findMaxConsecutiveOnes(new int[]{0,0,0}));', out: '0' },
      { run: 'System.out.print(o.findMaxConsecutiveOnes(new int[]{1,1,1,1}));', out: '4' },
      { run: 'System.out.print(o.findMaxConsecutiveOnes(new int[]{1}));', out: '1' },
    ],
  };

  // =====================================================================
  // a6 — Max Consecutive Ones III (LC 1004)
  // =====================================================================
  const A6 = [
    `public int longestOnes(int[] nums, int k) {
    int best = 0;
    for (int i = 0; i < nums.length; i++) {
        int zeros = 0;
        for (int j = i; j < nums.length; j++) {
            if (nums[j] == 0) zeros++;
            if (zeros > k) break;
            best = Math.max(best, j - i + 1);
        }
    }
    return best;
}`,
    `public int longestOnes(int[] nums, int k) {
    int n = nums.length;
    int[] prefixZeros = new int[n + 1]; // prefixZeros[i] = nums[0..i-1] me zeros
    for (int i = 0; i < n; i++) {
        prefixZeros[i + 1] = prefixZeros[i] + (nums[i] == 0 ? 1 : 0);
    }
    int low = 0, high = n;
    while (low < high) {
        int mid = (low + high + 1) / 2;
        if (canMake(prefixZeros, mid, k)) low = mid;
        else high = mid - 1;
    }
    return low;
}

private boolean canMake(int[] prefixZeros, int len, int k) {
    for (int start = 0; start + len < prefixZeros.length; start++) {
        if (prefixZeros[start + len] - prefixZeros[start] <= k) return true;
    }
    return false;
}`,
    `public int longestOnes(int[] nums, int k) {
    int left = 0, zeros = 0, best = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] == 0) zeros++;
        while (zeros > k) {
            if (nums[left] == 0) zeros--;
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
  ];
  const a6Inputs = [{ key: 'nums', label: 'nums (sirf 0 / 1)', def: '1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0' }, { key: 'k', label: 'k', def: '2', num: true }];

  L.a6 = {
    kind: 'dsa', title: 'Max Consecutive Ones III', topic: 'Sliding Window', diff: 'M', lc: 1004,
    url: 'https://leetcode.com/problems/max-consecutive-ones-iii/',
    pattern: 'Variable sliding window (longest, at most k)',
    oneLine: '"k zeros flip" = "window me max k zeros". right badhao, zeros > k ho toh left++ jab tak ek zero bahar na nikle.',
    goal: 'Zyada se zyada <code>k</code> zeros flip karke sabse lamba 1s ka run dhoondo. Asli seekh: problem ko <b>"longest window jisme zeros ≤ k"</b> me badalna, aur <b>variable sliding window</b> — right se badhao, condition toote toh left se chhota karo.',
    problem: {
      statement: 'Given a binary array <code>nums</code> and an integer <code>k</code>, return <i>the maximum number of consecutive</i> <code>1</code><i>\'s in the array if you can flip at most</i> <code>k</code> <code>0</code>\'s.',
      examples: [
        { input: 'nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2', output: '6', explain: '[1,1,1,0,0,<u>1</u>,1,1,1,1,<u>1</u>] — flipped numbers (index 5 and 10) are underlined. The longest subarray is index 5..10, length 6.', viz: { nums: '1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0', k: '2' } },
        { input: 'nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3', output: '10', explain: '[0,0,1,1,<u>1</u>,<u>1</u>,1,1,1,<u>1</u>,1,1,0,0,0,1,1,1,1] — index 4, 5, 9 flip. The longest subarray is index 2..11, length 10.', viz: { nums: '0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1', k: '3' } },
      ],
      constraints: ['1 <= nums.length <= 10^5', 'nums[i] is either 0 or 1.', '0 <= k <= nums.length'],
    },
    approaches: [
      { level: 'Brute', idea: 'Har start i se j aage badhao, zeros gino; zeros > k hote hi break. Har valid (i, j) ki length ka max.', time: 'O(n²)', space: 'O(1)', code: A6[0] },
      { level: 'Better', idea: 'Answer length pe binary search. Agar length L wali koi window (≤ k zeros) hai toh L − 1 wali bhi hai (monotonic). Har L ko prefix-zero counts se O(n) me check karo.', time: 'O(n log n)', space: 'O(n)', code: A6[1] },
      { level: 'Optimal', idea: 'Sliding window: right badhao aur zeros gino; zeros > k ho toh left aage karo jab tak ek zero bahar na nikle. Har step pe window length ka max.', time: 'O(n)', space: 'O(1)', code: A6[2] },
    ],
    viz: {
      title: 'Max Consecutive Ones III — sliding window (left, right, zeros)',
      inputs: a6Inputs,
      check: binCheck('nums'),
      run({ nums, k }) {
        let left, zeros, best, right;
        const V = () => Object.assign({ nums: K.iA(nums), k }, left !== undefined ? { left, zeros, best } : {}, right !== undefined ? { right } : {});
        const W = extra => Object.assign(K.rng(left, right, 'win'), extra || {});
        const PT = () => [{ i: left, label: 'left' }].concat(right !== undefined && right < nums.length ? [{ i: right, label: 'right' }] : []);
        const { st, steps } = K.tracer(A6[2], o => ({ views: [K.A('nums', nums, o.hl, o.ptr)], vars: V() }));
        st('public int longestOnes', `Method call: nums = ${K.iA(nums)}, k = ${k}`);
        left = 0; zeros = 0; best = 0;
        st('int left = 0, zeros = 0, best = 0', 'left = 0, zeros = 0 (window me zeros), best = 0');
        for (right = 0; ; right++) {
          if (!(right < nums.length)) { right = undefined; st('for (int right', `right = ${nums.length}: ${nums.length} < ${nums.length} ✗ → loop khatam`); break; }
          st('for (int right', `right = ${right}: ${right} < ${nums.length} ✓ — window [${left}..${right}]`, { hl: W({ [right]: 'cur' }), ptr: PT() });
          if (nums[right] === 0) zeros++;
          st('if (nums[right] == 0) zeros++', nums[right] === 0 ? `nums[${right}] = 0 → zeros++ → ${zeros}` : `nums[${right}] = 1 → zeros same (${zeros})`, { hl: W({ [right]: nums[right] === 0 ? 'new' : 'cur' }), ptr: PT() });
          while (true) {
            if (!(zeros > k)) { st('while (zeros > k)', `zeros (${zeros}) > k (${k}) ✗ → window valid`, { hl: W(), ptr: PT() }); break; }
            st('while (zeros > k)', `zeros (${zeros}) > k (${k}) ✓ → window invalid, left se chhota karo`, { hl: W({ [left]: 'cur' }), ptr: PT() });
            const z = nums[left] === 0;
            if (z) zeros--;
            st('if (nums[left] == 0) zeros--', z ? `nums[${left}] = 0 bahar ja raha → zeros-- → ${zeros}` : `nums[${left}] = 1 bahar ja raha → zeros same (${zeros})`, { hl: W({ [left]: 'skip' }), ptr: PT() });
            left++;
            st('left++', `left++ → ${left}`, { hl: W(), ptr: PT() });
          }
          const old = best;
          best = Math.max(best, right - left + 1);
          st('best = Math.max', `best = max(${old}, ${right} − ${left} + 1 = ${right - left + 1}) = ${best}`, { hl: W(), ptr: PT() });
        }
        st('return best', `return best = ${best}`, { ret: String(best) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Har subarray',
          run({ nums, k }) {
            let best, i, zeros, j;
            const V = () => Object.assign({ nums: K.iA(nums), k, best }, i !== undefined ? { i } : {}, zeros !== undefined ? { zeros } : {}, j !== undefined ? { j } : {});
            const { st, steps } = K.tracer(A6[0], o => ({ views: [K.A('nums', nums, o.hl, o.ptr)], vars: V() }));
            best = 0;
            st('public int longestOnes', `Method call: nums = ${K.iA(nums)}, k = ${k}`);
            st('int best = 0', 'best = 0');
            for (i = 0; ; i++) {
              if (!(i < nums.length)) { i = undefined; zeros = undefined; j = undefined; st('for (int i', `i = ${nums.length}: ✗ → outer loop khatam`); break; }
              zeros = undefined; j = undefined;
              st('for (int i', `i = ${i}: ${i} < ${nums.length} ✓ — start = ${i}`, { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] });
              zeros = 0;
              st('int zeros = 0', 'zeros = 0', { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] });
              for (j = i; ; j++) {
                const ptr = [{ i, label: 'i' }].concat(j < nums.length ? [{ i: j, label: 'j' }] : []);
                if (!(j < nums.length)) { st('for (int j', `j = ${j}: ✗ → array khatam`, { hl: K.rng(i, j - 1, 'win'), ptr }); break; }
                st('for (int j', `j = ${j}: ${j} < ${nums.length} ✓`, { hl: K.rng(i, j - 1, 'win', { [j]: 'cur' }), ptr });
                if (nums[j] === 0) zeros++;
                st('if (nums[j] == 0) zeros++', nums[j] === 0 ? `nums[${j}] = 0 → zeros → ${zeros}` : `nums[${j}] = 1 → zeros = ${zeros}`, { hl: K.rng(i, j, 'win'), ptr });
                if (zeros > k) { st('if (zeros > k) break', `zeros (${zeros}) > k (${k}) → break, is start se aage faida nahi`, { hl: K.rng(i, j - 1, 'win', { [j]: 'skip' }), ptr }); break; }
                st('if (zeros > k) break', `zeros (${zeros}) <= k (${k}) → valid`, { hl: K.rng(i, j, 'win'), ptr });
                const old = best;
                best = Math.max(best, j - i + 1);
                st('best = Math.max', `best = max(${old}, ${j - i + 1}) = ${best}`, { hl: K.rng(i, j, 'win'), ptr });
              }
            }
            st('return best', `return best = ${best}`, { ret: String(best) });
            return steps;
          },
        },
        {
          ap: 1, label: 'Binary search on length',
          run({ nums, k }) {
            const n = nums.length;
            let pz = null, i, low, high, mid, len, start, inCan = false;
            const V = () => {
              if (inCan) return Object.assign({ prefixZeros: K.iA(pz), len, k }, start !== undefined ? { start } : {});
              const v = { nums: K.iA(nums), k, n };
              if (pz) v.prefixZeros = K.iA(pz);
              if (i !== undefined) v.i = i;
              if (low !== undefined) { v.low = low; v.high = high; }
              if (mid !== undefined) v.mid = mid;
              return v;
            };
            const views = o => {
              const out = [K.A('nums', nums, o.nh, o.nptr)];
              if (pz) out.push(K.A('prefixZeros', pz, o.ph, o.pptr));
              if (low !== undefined) out.push(K.X('answer range', `[low = ${low} .. high = ${high}]` + (mid !== undefined ? ` · mid = ${mid}` : '')));
              return out;
            };
            const { st, steps } = K.tracer(A6[1], o => ({ views: views(o), vars: V() }));
            st('public int longestOnes', `Method call: nums = ${K.iA(nums)}, k = ${k}`);
            st('int n = nums.length', `n = ${n}`);
            pz = Array(n + 1).fill(0);
            st('int[] prefixZeros', `prefixZeros = new int[${n + 1}] — sab 0`);
            for (i = 0; ; i++) {
              if (!(i < n)) { i = undefined; st('for (int i', `i = ${n}: ✗ → prefix ban gaya`); break; }
              st('for (int i', `i = ${i}: ${i} < ${n} ✓`, { nh: { [i]: 'cur' }, nptr: [{ i, label: 'i' }] });
              pz[i + 1] = pz[i] + (nums[i] === 0 ? 1 : 0);
              st('prefixZeros[i + 1] =', `prefixZeros[${i + 1}] = ${pz[i]} + ${nums[i] === 0 ? 1 : 0} = ${pz[i + 1]}`, { nh: { [i]: 'cur' }, nptr: [{ i, label: 'i' }], ph: { [i + 1]: 'new' } });
            }
            low = 0; high = n;
            st('int low = 0, high = n', `low = 0, high = ${n} — answer in dono ke beech`);
            while (true) {
              if (!(low < high)) { mid = undefined; st('while (low < high)', `low (${low}) < high (${high}) ✗ → answer mil gaya`); break; }
              mid = undefined;
              st('while (low < high)', `low (${low}) < high (${high}) ✓`);
              mid = Math.floor((low + high + 1) / 2);
              st('int mid = (low + high + 1) / 2', `mid = (${low} + ${high} + 1) / 2 = ${mid} — kya length ${mid} possible hai?`);
              st('if (canMake(', `canMake(prefixZeros, ${mid}, ${k}) call`);
              inCan = true; len = mid; start = undefined;
              st('private boolean canMake', `canMake: len = ${len}, k = ${k}`);
              let ok = false;
              for (start = 0; ; start++) {
                if (!(start + len < pz.length)) { st('for (int start', `start = ${start}: ${start} + ${len} < ${pz.length} ✗ → koi window nahi bachi`); break; }
                const P = { ph: { [start]: 'cur', [start + len]: 'cur' }, nh: K.rng(start, start + len - 1, 'win'), pptr: [{ i: start, label: 'start' }, { i: start + len, label: 'start+len' }] };
                st('for (int start', `start = ${start}: ${start} + ${len} < ${pz.length} ✓ — window nums[${start}..${start + len - 1}]`, P);
                const zc = pz[start + len] - pz[start];
                if (zc <= k) {
                  st('if (prefixZeros[start + len]', `zeros = ${pz[start + len]} − ${pz[start]} = ${zc} <= ${k} ✓ → return true`, Object.assign({}, P, { nh: K.rng(start, start + len - 1, 'found') }));
                  ok = true; break;
                }
                st('if (prefixZeros[start + len]', `zeros = ${pz[start + len]} − ${pz[start]} = ${zc} > ${k} ✗`, P);
              }
              if (!ok) st('return false', `length ${len} ki koi window ≤ ${k} zeros wali nahi → return false`);
              inCan = false; start = undefined;
              if (ok) {
                st('if (canMake(', `canMake → true → length ${mid} possible`);
                low = mid;
                st('if (canMake(', `low = mid = ${low} (isse chhota bhi possible, bada try karo)`);
              } else {
                st('if (canMake(', `canMake → false → length ${mid} possible nahi`);
                high = mid - 1;
                st('else high = mid - 1', `high = mid − 1 = ${high}`);
              }
            }
            st('return low', `return low = ${low}`, { ret: String(low) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Variable sliding window (a5 ka next step)', blocks: [
        { p: '<b>Day 2 ka jod:</b> a5 me 0 aate hi run <b>poora reset</b> hota tha (<code>count = 0</code>). Ab k zeros flip kar sakte hain, toh 0 aane pe reset nahi — window me <b>k tak zeros</b> chal jaate hain. Zyada ho gaye toh window ko <b>left se thoda chhota</b> karo. Yahi <b>variable sliding window</b> hai.' },
        { p: '<b>Reframe (sabse important):</b> "zyada se zyada k zeros flip karke longest 1s" = <b>"longest subarray jisme zeros ≤ k"</b>. Flip asal me karna hi nahi hai — bas window ke zeros gino.' },
        { pre: `nums:  1 1 1 0 0 0 1 1 1 1 0     k = 2
                 [ L . . . . R ]   zeros = 2 ✓ → length 6
right badhao → window badi; zeros > k → left++ jab tak valid na ho` },
        { tip: '<b>Template (longest window, at most k):</b> <code>for right: add(right); while (invalid) remove(left++); best = max(best, right − left + 1)</code>. Ye template aage bahut problems me aayega (longest substring without repeat, fruit into baskets…).' },
      ] },
      { title: '📄 Problem — LC 1004 Max Consecutive Ones III', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — har subarray' },
        { p: 'Har start i, aage j; zeros gino. zeros > k hote hi break (aage aur zeros hi aayenge, kam nahi honge). Har valid (i, j) pe length ka max. <b>O(n²)</b> time, O(1) space. n = 10⁵ pe TLE.' },
        { h: '2. Better — answer length pe binary search' },
        { p: 'Observation: agar length L ki koi window ≤ k zeros wali hai, toh L − 1 ki bhi hai (usi ka ek element hata do). Yaani answer <b>monotonic</b> hai → length pe binary search. Kisi L ko check karna: <code>prefixZeros</code> array se kisi bhi window ke zeros O(1) me — <code>prefixZeros[start + L] − prefixZeros[start]</code>. Ek check O(n), log n checks → <b>O(n log n)</b> time, <b>O(n)</b> space.' },
        { h: '3. Optimal — sliding window' },
        { p: 'Brute me i badalte hi zeros fir se 0 se ginte the. Par jab window [i..j] invalid hui, toh agla start bhi wahi j tak toh pahunchega hi — dobara ginna faltu. Toh <b>left aur right dono sirf aage</b> chalao: right badhao, zeros++ (agar 0); jab tak zeros > k, left wala element nikalo (0 tha toh zeros--) aur left++. Har step pe <code>best = max(best, right − left + 1)</code>. Har index max ek baar andar, ek baar bahar → <b>O(n)</b>, <b>O(1)</b>.' },
        { tip: '<b>while, if nahi:</b> ek baar me left ko kai jagah aage jaana pad sakta hai (jab tak ek zero bahar na nikle) — isliye shrink loop <code>while (zeros > k)</code> hai.' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2 (Optimal)', blocks: [
        { table: { head: ['right', 'nums[right]', 'zeros (add ke baad)', 'Shrink?', 'left', 'Window', 'len', 'best'], rows: [
          ['0', '1', '0', '—', '0', '[0..0]', '1', '1'],
          ['1', '1', '0', '—', '0', '[0..1]', '2', '2'],
          ['2', '1', '0', '—', '0', '[0..2]', '3', '3'],
          ['3', '0', '1', '—', '0', '[0..3]', '4', '4'],
          ['4', '0', '2', '—', '0', '[0..4]', '5', '5'],
          ['5', '0', '3', 'haan: 1,1,1 nikle (zeros same), phir 0 nikla → zeros 2', '4', '[4..5]', '2', '5'],
          ['6', '1', '2', '—', '4', '[4..6]', '3', '5'],
          ['7', '1', '2', '—', '4', '[4..7]', '4', '5'],
          ['8', '1', '2', '—', '4', '[4..8]', '5', '5'],
          ['9', '1', '2', '—', '4', '[4..9]', '6', '6'],
          ['10', '0', '3', 'haan: nums[4] = 0 nikla → zeros 2', '5', '[5..10]', '6', '<b>6</b>'],
        ] } },
        { p: 'Loop khatam → <b>return best = 6</b> (window 5..10, flips index 5 aur 10).' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: A6[2] },
        { lines: [
          ['int left = 0, zeros = 0, best = 0;', 'Window [left..right], window ke zeros ka count, aur ab tak ki best length.'],
          ['for (int right = 0; right < nums.length; right++)', 'right har baar window ko ek se badhata hai.'],
          ['if (nums[right] == 0) zeros++;', 'Naya element 0 hai toh window ke zeros badhe.'],
          ['while (zeros > k)', 'Window invalid (k se zyada flips chahiye) — valid hone tak left se chhota karo.'],
          ['if (nums[left] == 0) zeros--;', 'Bahar jaane wala 0 tha toh zeros ghate.'],
          ['left++;', 'Window left se ek chhoti.'],
          ['best = Math.max(best, right - left + 1);', 'Ab window valid hai — iski length se best update.'],
          ['return best;', 'Sabse lambi valid window = answer.'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute → Better (binary search) → Optimal</b>. Orange = current window. Apna input: <code>0, 0, 0, 1</code> k <code>0</code> (answer 1) ya <code>0, 0, 0</code> k <code>3</code> (answer 3).' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'k = 0 → a5 wali problem hi hai: <code>[1,1,0,1,1,1]</code>, k = 0 → 3.',
          'k ≥ zeros ki ginti → poora array: <code>[0,0,0]</code>, k = 3 → 3.',
          'Sab 0, k = 0 → <code>[0,0]</code> → 0. Har right pe turant shrink, window khaali (left = right + 1), length 0.',
          'Sab 1 → n, shrink kabhi nahi hota.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Shrink ke liye <code>if</code> likhna — kai 1s ke baad zero nikalna pade toh ek step kaafi nahi (while chahiye).',
          'left++ karte waqt check bhoolna ki nikla element 0 tha → zeros galat.',
          'best ko while ke <b>andar</b> update karna — tab window invalid hoti hai.',
          'Asli me array ke 0 ko 1 me badalna (flip karna) — zaroorat hi nahi, sirf gino.',
          'Better me <code>mid = (low + high) / 2</code> lena → <code>low = mid</code> ke saath infinite loop. Upper mid (<code>+ 1</code>) chahiye.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (har subarray)', 'O(n²)', 'O(1)', 'har start se aage scan'],
          ['Better (binary search + prefix)', 'O(n log n)', 'O(n)', 'log n lengths, har check O(n); prefixZeros array n + 1'],
          ['Optimal (sliding window)', 'O(n)', 'O(1)', 'left aur right dono max n baar aage; har index ek baar andar, ek baar bahar'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['How do you reframe the problem?', 'Flipping at most k zeros is the same as finding the longest subarray that contains at most k zeros. We never actually flip anything.'],
          ['Why is the nested while loop still O(n)?', 'left only moves forward and never past n, so across the whole run the inner loop does at most n increments in total. Each index enters and leaves the window once.'],
          ['Why a while instead of an if for shrinking?', 'After adding a zero we may need to drop several 1s before a zero leaves, so one step is not always enough.'],
          ['Where do you update the answer and why?', 'After the shrink loop, because only then is the window guaranteed to contain at most k zeros.'],
          ['Why can binary search on the length work?', 'Validity is monotonic: if a window of length L has at most k zeros, some window of length L − 1 does too. Each check uses prefix zero counts in O(n), so O(n log n) overall.'],
          ['What happens when k = 0?', 'The window may contain no zeros, so it becomes LC 485 Max Consecutive Ones. The same code works.'],
          ['Is there a version where the window never shrinks?', 'Yes: replace the while with an if so the window only slides, never shrinks; its size equals the best answer at the end. It is a neat trick but harder to explain.'],
          ['How would you return the actual subarray?', 'Whenever best improves, store left and right; the answer is nums[left..right] with its zeros flipped.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Flipping at most k zeros is the same as finding the longest window with at most k zeros. I keep a window with two pointers and a zero counter. I expand right, and if the new element is zero I increment the counter. While the counter exceeds k, I move left forward, decrementing the counter when a zero leaves. After that the window is valid, so I update the best length. Both pointers only move forward, so it is O(n) time and O(1) space.'],
          ['Aise bolo — trade-off', 'A brute force over all subarrays is O(n squared). A middle option is binary searching the answer length with prefix sums of zeros, which is O(n log n) with O(n) space. The sliding window beats both because each element is added and removed at most once.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [0, 1, 0, 0, 1, 1, 0], k = 1 — answer?', '<b>3</b>: window [3..5] = [0, 1, 1] (ek 0 flip). [0..1] = 2, [3..5] = 3, [4..6] = 3.'],
          ['Shrink loop me <code>while</code> ki jagah <code>if</code> likho (best update waisa hi) toh kya galat hoga?', 'Window ek step me valid nahi hogi — zeros > k ke saath hi best update ho jayega, answer zyada (galat) aa sakta hai.'],
          ['Better me <code>mid = (low + high + 1) / 2</code> me <code>+ 1</code> kyun?', 'low = mid branch me agar mid = low ho (jaise low = 2, high = 3 → mid 2) toh range kabhi chhoti nahi hogi → infinite loop. Upper mid se range hamesha ghatti hai.'],
        ] },
        { olist: ['Optimal code 4 min me bina dekhe likho.', 'a5 aur a6 ka farak ek line me bolo: reset vs shrink.'] },
      ] },
    ],
    checks: [
      'Problem ko "longest window with at most k zeros" me badal sakta hoon',
      'while (zeros > k) aur best ki jagah — kyun — samjha',
      'Brute → Better (binary search) → Optimal ka farak aur complexity bol sakta hoon',
      'Optimal code 4 min me bina dekhe likh sakta hoon',
    ],
    memory: 'right se badhao, zeros gino; zeros > k → left++ (0 nikla toh zeros--); best = right − left + 1.',
    tests: [
      { run: 'System.out.print(o.longestOnes(new int[]{1,1,1,0,0,0,1,1,1,1,0}, 2));', out: '6' },
      { run: 'System.out.print(o.longestOnes(new int[]{0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1}, 3));', out: '10' },
      { run: 'System.out.print(o.longestOnes(new int[]{1,1,0,1,1,1}, 0));', out: '3' },
      { run: 'System.out.print(o.longestOnes(new int[]{0,0,0}, 3));', out: '3' },
      { run: 'System.out.print(o.longestOnes(new int[]{0,0}, 0));', out: '0' },
      { run: 'System.out.print(o.longestOnes(new int[]{0,1,0,0,1,1,0}, 1));', out: '3' },
    ],
  };
})();
