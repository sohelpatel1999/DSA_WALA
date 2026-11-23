// Phase 1 (Arrays) — Week 1 lessons, Days 2–7 (Day 1 → phase-01-days.js).
// Week 1 = ARRAYS FOUNDATION (Sohel ka diya hua syllabus, 2026-11-07). Day 1 wale format me.
// Block types: p, h, list, olist, code, pre, table, problem, viz, lines, qa, say, tip
(function () {
  const P = window.PHASE_CONTENT['arrays'];
  P.lessons = P.lessons || {};
  const ap = (n, i) => P.questions[n].approaches[i].code;
  const sol = (n, i) => 'class Solution {\n' + ap(n, i).split('\n').map(l => '    ' + l).join('\n') + '\n}';
  const rev = o => [
    { h: o.h },
    { p: o.p },
    { pre: o.ex },
    { p: '<b>Pattern:</b> ' + o.pat },
    { olist: o.steps },
    { code: o.code },
    { tip: '<b>Memory hook:</b> ' + o.hook },
  ];
  const session = (theory, viz, coding, lc) => ({ table: { head: ['Time', 'Slot', 'Aaj kya'], rows: [
    ['9:00–9:30', 'Theory', theory],
    ['9:30–9:50', 'Visualization + dry run', viz],
    ['9:50–10:10', 'Coding practice (saath me)', coding],
    ['10:10–10:30', 'LeetCode (Sohvi / Tum)', lc],
  ] } });

  const FREQ = `static Map<Integer, Integer> buildFrequency(int[] arr) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : arr) {
        freq.put(x, freq.getOrDefault(x, 0) + 1);
    }
    return freq;
}

static void printFrequency(Map<Integer, Integer> freq) {
    for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
        System.out.println(e.getKey() + " -> " + e.getValue());
    }
}

static int mostFrequent(int[] arr) {
    Map<Integer, Integer> freq = buildFrequency(arr);
    int best = arr[0], bestCount = 0;
    for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
        if (e.getValue() > bestCount) {
            best = e.getKey();
            bestCount = e.getValue();
        }
    }
    return best;
}

static List<Integer> uniqueElements(int[] arr) {   // jo sirf ek baar aaye
    Map<Integer, Integer> freq = buildFrequency(arr);
    List<Integer> result = new ArrayList<>();
    for (int x : arr) {
        if (freq.get(x) == 1) result.add(x);
    }
    return result;
}`;

  const PREFIX = `static int[] buildPrefix(int[] arr) {
    int[] prefix = new int[arr.length];
    prefix[0] = arr[0];
    for (int i = 1; i < arr.length; i++) {
        prefix[i] = prefix[i - 1] + arr[i];
    }
    return prefix;
}

static int rangeSum(int[] prefix, int L, int R) {
    if (L == 0) return prefix[R];
    return prefix[R] - prefix[L - 1];
}`;

  Object.assign(P.lessons, {
    // =====================================================================
    // DAY 2 — Traversal Mastery
    2: {
      title: 'Traversal Mastery — Count, Search, Compare, Second Largest',
      goal: '<b>Traversal = har element ko exactly ek baar visit karna.</b> Isi ek loop se count, search, replace, compare, find aur transform. <b>Sohvi:</b> LC 1480. <b>Tum:</b> LC 1480 + LC 1295.',
      main: 1480,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision (Day 1) + Aaj ka session',
          blocks: [
            session('Traversal pattern + 6 applications', '<code>[1,2,3,4,5,6]</code>: even, odd, max, min, second largest', 'countEven(), countOdd(), secondLargest()', 'Sohvi: LC 1480 · Tum: LC 1480 + LC 1295'),
            ...rev({
              h: 'LC 1920 — Build Array from Permutation (kal ka)',
              p: '<code>ans[i] = nums[nums[i]]</code>.',
              ex: 'nums = [0,2,1,5,3,4] → [0,1,2,4,5,3]',
              pat: 'Traversal (+ in-place encoding for O(1) space)',
              steps: ['Naya array ans.', 'Har i: ans[i] = nums[nums[i]].', 'return ans.'],
              code: ap(1920, 0),
              hook: 'Pehle andar wala index, phir bahar wali value.',
            }),
            ...rev({
              h: 'Kal ka: findMax',
              p: 'Array ka sabse bada element.',
              ex: '[5,8,2,9,1] → 9',
              pat: 'Traversal + compare',
              steps: ['max = arr[0].', 'i = 1 se: bada mila → update.', 'return max.'],
              code: `static int findMax(int[] arr) {
    int max = arr[0];
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}`,
              hook: 'arr[0] se shuru, 0 se nahi.',
            }),
          ],
        },
        {
          title: 'Part 1 — Theory: Traversal (Module 3)',
          blocks: [
            { p: '<b>Traversal</b> matlab array ke har element ko <b>exactly ek baar</b> visit karna. Lagbhag har array problem ka pehla kadam yahi hai.' },
            { code: `for (int i = 0; i < n; i++) {
    // arr[i] ke saath kaam
}

for (int x : arr) {          // for-each: jab index nahi chahiye
    // x ke saath kaam
}` },
            { table: { head: ['Kab for-i', 'Kab for-each'], rows: [
              ['Index chahiye (position, pichla element, update)', 'Sirf value padhni hai'],
              ['<code>arr[i] = ...</code> update karna hai', 'Count / sum / search'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Applications: ek loop, 6 kaam',
          blocks: [
            { table: { head: ['Kaam', 'Loop ke andar', 'Example'], rows: [
              ['Count', '<code>if (cond) count++;</code>', 'Kitne even?'],
              ['Search', '<code>if (arr[i] == t) return i;</code>', '9 kahan hai?'],
              ['Replace', '<code>if (arr[i] &lt; 0) arr[i] = 0;</code>', 'Negative ko 0'],
              ['Compare', '<code>if (arr[i] &gt; max) max = arr[i];</code>', 'Max / min'],
              ['Find', '<code>if (cond) { ans = arr[i]; break; }</code>', 'Pehla even'],
              ['Transform', '<code>arr[i] = arr[i] * 2;</code> ya <code>arr[i] += arr[i−1]</code>', 'Double / running sum'],
            ] } },
          ],
        },
        {
          title: 'Part 3 — Dry Run: [1, 2, 3, 4, 5, 6]',
          blocks: [
            { table: { head: ['i', 'arr[i]', 'even', 'odd', 'max', 'min', 'largest', 'second'], rows: [
              ['start', '—', '0', '0', '1', '1', '−∞', '−∞'],
              ['0', '1', '0', '1', '1', '1', '1', '−∞'],
              ['1', '2', '1', '1', '2', '1', '2', '1'],
              ['2', '3', '1', '2', '3', '1', '3', '2'],
              ['3', '4', '2', '2', '4', '1', '4', '3'],
              ['4', '5', '2', '3', '5', '1', '5', '4'],
              ['5', '6', '<b>3</b>', '<b>3</b>', '<b>6</b>', '<b>1</b>', '6', '<b>5</b>'],
            ] } },
            { p: '<b>Second largest:</b> naya element largest se bada → purana largest second ban jaata hai. Sirf second se bada (aur largest ke barabar nahi) → second update.' },
          ],
        },
        {
          title: 'Part 4 — Coding Practice: countEven, countOdd, secondLargest',
          blocks: [
            { code: `static int countEven(int[] arr) {
    int count = 0;
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] % 2 == 0) count++;
    }
    return count;
}

static int countOdd(int[] arr) {
    int count = 0;
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] % 2 != 0) count++;
    }
    return count;
}

static int secondLargest(int[] arr) {
    int largest = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] > largest) {
            second = largest;
            largest = arr[i];
        } else if (arr[i] > second && arr[i] != largest) {
            second = arr[i];
        }
    }
    return second;   // MIN_VALUE = distinct second largest nahi mila
}` },
            { lines: [
              ['if (arr[i] % 2 == 0)', 'Even check. Odd ke liye <code>!= 0</code> — <code>== 1</code> nahi, kyunki Java me −3 % 2 = −1.'],
              ['int largest = Integer.MIN_VALUE, second = ...', 'Sabse chhoti value se shuru — koi bhi element bada hoga.'],
              ['second = largest; largest = arr[i];', 'Naya champion aaya → purana champion second.'],
              ['else if (arr[i] > second && arr[i] != largest)', 'Duplicate largest ko second mat banao ([5,5,4] → 4).'],
            ] },
            { tip: 'Maine chala ke check kiya: [1..6] → even 3, odd 3, second 5; [5,5,4] → 4; [7,7] → MIN_VALUE (distinct second nahi).' },
          ],
        },
        { title: 'Part 5 — Aaj ka problem: LC 1480 Running Sum of 1d Array', blocks: [{ problem: 1480 }] },
        {
          title: 'Part 6 — Thinking: Brute → Optimal (Transform traversal)',
          blocks: [
            { p: '<b>Brute:</b> Har i ke liye 0..i tak dobara sum → O(n²).' },
            { p: '<b>Kya repeat ho raha hai?</b> <code>sum(0..i)</code> = <code>sum(0..i−1)</code> + <code>nums[i]</code>. Pichla total already pata hai!' },
            { p: '<b>Optimal:</b> Ek traversal: <code>nums[i] += nums[i − 1]</code> (in-place). O(n), O(1). Ye <b>prefix sum ki pehli seedhi</b> hai — Day 5 me kaam aayega.' },
            { table: { head: ['i', 'nums[i] (pehle)', 'nums[i−1] (updated)', 'nums[i] (baad)'], rows: [
              ['0', '1', '—', '1'], ['1', '2', '1', '3'], ['2', '3', '3', '6'], ['3', '4', '6', '10'],
            ] } },
          ],
        },
        {
          title: 'Part 7 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' },
            { code: sol(1480, 0) },
            { p: '<b>Optimal — in-place</b>' },
            { code: sol(1480, 1) },
            { lines: [
              ['for (int i = 1; i < nums.length; i++)', 'Index 0 ka running sum woh khud hai — 1 se shuru.'],
              ['nums[i] += nums[i - 1];', 'nums[i − 1] me already 0..i−1 ka total hai.'],
              ['return nums;', 'Same array, ab running sums.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Visualize: LC 1480',
          blocks: [
            { list: ['Har step me <code>nums[i]</code> naya (hara) hota hai, pichle done.', 'Example 3 chala ke Part 6 ki table se milao.'] },
            { viz: 1480, ex: 0 },
          ],
        },
        {
          title: 'Part 9 — Tum: LC 1295 Find Numbers with Even Number of Digits',
          blocks: [
            { problem: 1295 },
            { p: '<b>Pattern:</b> Traversal + count — har number ke digits gino, even ho toh count++.' },
            { p: '<b>Brute:</b> <code>String.valueOf(x).length()</code> — har element pe ek String object. <b>Optimal:</b> 10 se divide karte jao — har division = 1 digit, koi object nahi.' },
            { code: sol(1295, 0) },
            { code: sol(1295, 1) },
            { lines: [
              ['for (int x : nums)', 'Traversal — index nahi chahiye, for-each.'],
              ['while (x > 0) { digits++; x /= 10; }', 'Har baar last digit hatao aur gino. (x ≥ 1 constraint — 0 ka case nahi.)'],
              ['if (digits % 2 == 0) count++;', 'Even digits → count.'],
            ] },
            { pre: `7896 → 789 → 78 → 7 → 0      (4 divisions = 4 digits → even ✓)
345  → 34  → 3  → 0            (3 digits → odd)` },
            { viz: 1295, ex: 0 },
          ],
        },
        {
          title: 'Part 10 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Kya hota hai'], rows: [
              ['LC 1480: ek element', '<code>[5]</code> → <code>[5]</code> (loop chalta hi nahi)'],
              ['LC 1480: negatives', '<code>[3,−1,−2]</code> → <code>[3,2,0]</code> — same formula'],
              ['LC 1295: 100000', '6 digits → even ✓'],
              ['countOdd: negative', '−3 % 2 = −1 → <code>!= 0</code> se hi pakda jaata hai'],
              ['secondLargest: saare same', 'Distinct second nahi → MIN_VALUE (interviewer se poocho kya return karna hai)'],
            ] } },
          ],
        },
        {
          title: 'Part 11 — Complexity',
          blocks: [
            { table: { head: ['Code', 'Time', 'Space'], rows: [
              ['countEven / countOdd / secondLargest', 'O(n)', 'O(1)'],
              ['LC 1480 brute', 'O(n²)', 'O(n)'],
              ['LC 1480 optimal', 'O(n)', 'O(1)'],
              ['LC 1295 (dono)', 'O(n · d), d ≤ 6', 'String O(d) / math O(1)'],
            ] } },
          ],
        },
        {
          title: 'Part 12 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Traversal ki definition?', 'Har element ko exactly ek baar visit karna — O(n).'],
              ['for-each kab nahi chalega?', 'Jab index chahiye ya array update karna ho.'],
              ['Odd check <code>% 2 == 1</code> me kya bug?', 'Negative odd (−3 % 2 = −1) miss ho jaayega.'],
              ['Second largest ek pass me?', 'largest aur second track karo; naya bada aaye toh largest → second.'],
              ['LC 1480 me kya repeat ho raha tha?', 'Pichla sum dobara calculate ho raha tha.'],
              ['Running sum ko kya kehte hain?', 'Prefix sum.'],
              ['LC 1295 me String vs math?', 'Dono O(n·d); math me extra object nahi.'],
              ['Digits gino bina loop ke?', '<code>(int) Math.log10(x) + 1</code> — par loop zyada safe aur clear.'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['LC 1480 approach', 'A brute-force solution recomputes the sum of the first i elements for every index, which is O(n²). But the running sum at i is just the running sum at i − 1 plus nums[i]. So I traverse once and update the array in place with nums[i] += nums[i − 1]. That is O(n) time and O(1) extra space, and it is the basic idea behind prefix sums.'],
              ['LC 1295 approach', 'I traverse the array and count the digits of each number by dividing by ten until it becomes zero; if the count is even I increment the answer. Each number has at most six digits under the constraints, so it is effectively O(n) time and O(1) space. Converting to a string works too, but it allocates an object per element.'],
            ] },
          ],
        },
        {
          title: 'Part 14 — Sohvi session',
          blocks: [
            { olist: ['Part 3 ki table khud bharo (even, odd, max, min, second).', 'countEven, countOdd khud likho; secondLargest padh ke samjho.', '<b>LC 1480</b> optimal submit.'] },
          ],
        },
        {
          title: 'Part 15 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['<b>LC 1480</b> + <b>LC 1295</b> (math version) submit.', 'secondLargest bina dekhe + 3 edge cases.', 'LC 1480 ka "kya repeat ho raha tha" 30 sec me bolo.'] },
          ],
        },
        {
          title: 'Part 16 — Homework',
          blocks: [
            { list: [
              '<b>Dono:</b> Traversal apne shabdon me explain karo (5 lines).',
              '<b>Dono:</b> Dry Run notebook shuru karo — aaj ki Part 3 table usme likho.',
              'Kal (Day 3): Hashing — LC 217 (+ Tum: LC 169).',
            ] },
          ],
        },
        {
          title: 'Part 17 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[2,4,6]</code> running sum?', '<code>[2,6,12]</code>'],
              ['<code>[10,7,10,3]</code> second largest?', '7.'],
              ['<code>[11,22,333,4444]</code> (LC 1295)?', '2 (22 aur 4444).'],
              ['<code>[−3,−2,5]</code> countOdd?', '2.'],
              ['Traversal ka time?', 'O(n).'],
            ] },
          ],
        },
      ],
      checks: [
        'Traversal ki definition + for-i vs for-each',
        '6 applications (count, search, replace, compare, find, transform)',
        '[1..6] dry-run table khud bhari',
        'countEven / countOdd / secondLargest likhe',
        'Sohvi: LC 1480 Accepted',
        'Tum: LC 1480 + LC 1295 Accepted',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Ek loop, har element ek baar — gino, dhoondo, badlo, compare karo. Pichla total yaad rakho toh dobara mat jodo.',
    },

    // =====================================================================
    // DAY 3 — Hashing
    3: {
      title: 'Hashing — Frequency Map, Duplicates, Majority',
      goal: 'Nested loop (O(n²)) ki jagah <b>HashSet / HashMap</b> se O(n). Frequency, unique, duplicate, count, presence. <b>Sohvi:</b> LC 217. <b>Tum:</b> LC 217 + LC 169.',
      main: 217,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('Module 4: bina HashMap vs HashMap; 5 concepts', '<code>[1,2,2,3,1,2]</code> frequency table', 'buildFrequency, printFrequency, mostFrequent, uniqueElements', 'Sohvi: LC 217 · Tum: LC 217 + LC 169'),
            ...rev({
              h: 'LC 1480 — Running Sum (kal ka)',
              p: 'nums[i] = nums[0] + … + nums[i].',
              ex: '[1,2,3,4] → [1,3,6,10]',
              pat: 'Traversal (transform)',
              steps: ['i = 1 se.', 'nums[i] += nums[i − 1].', 'return nums.'],
              code: ap(1480, 1),
              hook: 'Pichla total + aaj ka = naya total.',
            }),
            ...rev({
              h: 'LC 1295 — Even Number of Digits (kal ka)',
              p: 'Even digits wale numbers gino.',
              ex: '[12,345,2,6,7896] → 2',
              pat: 'Traversal + count',
              steps: ['Har x: /10 se digits gino.', 'Even → count++.'],
              code: ap(1295, 1),
              hook: 'Har /10 = ek digit.',
            }),
          ],
        },
        {
          title: 'Part 1 — Theory: bina HashMap kya problem hai?',
          blocks: [
            { p: '<b>Problem:</b> Duplicates dhoondo. <b>Bina HashMap:</b> har element ko baaki sab se compare (nested loop).' },
            { code: `for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (arr[i] == arr[j]) return true;      // O(n²)` },
            { p: '<b>HashMap / HashSet ke saath:</b> jo dekh liya use <b>store</b> karo. Naye element pe sirf poocho "pehle dekha?" — lookup <b>O(1)</b> (average). Poora kaam <b>O(n)</b>.' },
            { pre: `n = 10⁵:   nested loop ≈ 5 × 10⁹ comparisons (TLE)
           HashSet     ≈ 10⁵ operations` },
            { tip: 'Trade-off: O(n) <b>extra memory</b> deke O(n²) → O(n) time.' },
          ],
        },
        {
          title: 'Part 2 — Concepts: Frequency, Unique, Duplicate, Count, Presence',
          blocks: [
            { table: { head: ['Concept', 'Sawaal', 'Tool'], rows: [
              ['Presence', '"x hai ya nahi?"', '<code>HashSet.contains(x)</code>'],
              ['Duplicate', '"koi do baar aaya?"', '<code>!set.add(x)</code>'],
              ['Frequency / Count', '"x kitni baar?"', '<code>map.put(x, map.getOrDefault(x, 0) + 1)</code>'],
              ['Unique', '"kaun sirf ek baar?"', 'freq == 1'],
              ['Key-Value pair', 'Key → value (jaise number → count)', '<code>HashMap&lt;K, V&gt;</code>'],
            ] } },
            { p: '<b>Frequency array</b> (jab values chhote range me hon, jaise 0..100 ya lowercase letters):' },
            { code: `int[] count = new int[101];          // values 0..100
for (int x : arr) count[x]++;         // HashMap se bhi fast, par sirf chhote range ke liye

int[] letters = new int[26];
for (char c : s.toCharArray()) letters[c - 'a']++;` },
          ],
        },
        {
          title: 'Part 3 — Dry Run: [1, 2, 2, 3, 1, 2] frequency',
          blocks: [
            { table: { head: ['Step', 'x', 'Map ke baad'], rows: [
              ['1', '1', '{1: 1}'],
              ['2', '2', '{1: 1, 2: 1}'],
              ['3', '2', '{1: 1, 2: 2}'],
              ['4', '3', '{1: 1, 2: 2, 3: 1}'],
              ['5', '1', '{1: 2, 2: 2, 3: 1}'],
              ['6', '2', '{1: 2, 2: 3, 3: 1}'],
            ] } },
            { table: { head: ['Element', 'Count'], rows: [['1', '2'], ['2', '3'], ['3', '1']] } },
            { p: 'Most frequent = <b>2</b> (3 baar). Unique (sirf ek baar) = <b>[3]</b>. Duplicate hai? <b>Haan</b> (step 3 pe hi pata chal gaya).' },
          ],
        },
        {
          title: 'Part 4 — Coding Practice: Frequency Map',
          blocks: [
            { code: FREQ },
            { lines: [
              ['freq.getOrDefault(x, 0) + 1', 'Pehli baar x aaya → 0 + 1; warna purana count + 1.'],
              ['for (Map.Entry<Integer, Integer> e : freq.entrySet())', 'Map ke har (key, value) pair pe loop.'],
              ['if (e.getValue() > bestCount)', 'Zyada count wala mila → best update.'],
              ['if (freq.get(x) == 1) result.add(x);', 'Original order me unique elements.'],
            ] },
            { tip: 'Maine <code>[1,2,2,3,1,2]</code> pe chalaya: 1 → 2, 2 → 3, 3 → 1; most frequent 2; unique [3].' },
          ],
        },
        { title: 'Part 5 — Aaj ka problem: LC 217 Contains Duplicate', blocks: [{ problem: 217 }] },
        {
          title: 'Part 6 — Thinking: Brute → Better → Optimal',
          blocks: [
            { table: { head: ['Level', 'Idea', 'Time', 'Space'], rows: [
              ['Brute', 'Har pair compare', 'O(n²)', 'O(1)'],
              ['Better', 'Sort karo → duplicates padosi ban jaate hain', 'O(n log n)', 'O(1)*'],
              ['Optimal', 'HashSet — "pehle dekha?"', 'O(n)', 'O(n)'],
            ] } },
          ],
        },
        {
          title: 'Part 7 — Complete Java code + har line ka purpose',
          blocks: [
            { code: sol(217, 2) },
            { lines: [
              ['Set<Integer> seen = new HashSet<>();', 'Ab tak dekhe elements.'],
              ['if (!seen.add(x)) return true;', '<code>add()</code> false deta hai agar x pehle se tha → duplicate.'],
              ['return false;', 'Loop khatam, sab unique.'],
            ] },
            { p: '<b>Better (sort):</b>' },
            { code: sol(217, 1) },
          ],
        },
        {
          title: 'Part 8 — Visualize: LC 217',
          blocks: [
            { list: ['HashSet panel me har element judta dekho.', 'Duplicate milte hi dono positions highlight + return true.'] },
            { viz: 217, ex: 0 },
          ],
        },
        {
          title: 'Part 9 — Tum: LC 169 Majority Element (frequency → voting)',
          blocks: [
            { problem: 169 },
            { p: '<b>Aaj ke frequency map se (Better):</b> count badhate jao; jis element ka count n/2 se upar jaaye wahi answer. O(n) / O(n).' },
            { code: sol(169, 1) },
            { p: '<b>Optimal — Boyer-Moore voting (O(1) space):</b> Majority element baaki sab se zyada hai, toh har "alag" vote ko ek majority vote cancel karta hai — end me majority bachta hai.' },
            { code: sol(169, 2) },
            { lines: [
              ['if (count == 0) cand = x;', 'Koi candidate nahi → naya candidate.'],
              ['count += (x == cand) ? 1 : -1;', 'Same → vote +1, alag → cancel −1.'],
              ['return cand;', 'Majority > n/2 hamesha bachta hai.'],
            ] },
            { viz: 169, ex: 1 },
          ],
        },
        {
          title: 'Part 10 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Answer'], rows: [
              ['LC 217: ek element', 'false'],
              ['LC 217: duplicate end me', 'Pura loop chalega, last step pe true'],
              ['LC 217: negatives / bade numbers', 'HashSet ko farak nahi'],
              ['LC 169: ek element', 'Wahi'],
              ['LC 169: majority shuru me nahi', '[1,2,2] → 2 (voting cand badalta hai)'],
            ] } },
          ],
        },
        {
          title: 'Part 11 — Complexity',
          blocks: [
            { table: { head: ['Code', 'Time', 'Space'], rows: [
              ['buildFrequency', 'O(n)', 'O(k) distinct'],
              ['LC 217 HashSet', 'O(n)', 'O(n)'],
              ['LC 217 sort', 'O(n log n)', 'O(1)*'],
              ['LC 169 HashMap', 'O(n)', 'O(n)'],
              ['LC 169 Boyer-Moore', 'O(n)', 'O(1)'],
            ] } },
          ],
        },
        {
          title: 'Part 12 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['HashSet vs HashMap?', 'Set sirf keys (presence); Map key → value (count, index).'],
              ['HashMap lookup O(1) kyun?', 'hashCode se seedha bucket; average O(1).'],
              ['Worst case?', 'Bahut collisions → Java 8+ me bucket tree → O(log n).'],
              ['<code>getOrDefault</code> kyun?', 'Pehli baar key null hoti — default 0 se NPE nahi.'],
              ['Frequency array kab?', 'Values chhote fixed range me (0..100, a..z).'],
              ['Sort approach ka nuksaan?', 'Original order badal jaata hai; O(n log n).'],
              ['Boyer-Moore kyun kaam karta hai?', 'Majority > n/2 — cancel hone ke baad bhi bachta hai.'],
              ['Majority guaranteed na ho toh?', 'Doosra pass me cand ka count verify karo.'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['LC 217 approach', 'The brute force compares every pair, which is O(n²). Sorting puts duplicates next to each other, giving O(n log n). The optimal approach uses a hash set: I add each element, and if add returns false the element was already there, so I return true. That is O(n) time and O(n) space.'],
              ['LC 169 approach', 'With a frequency map I can count each element and return the one whose count exceeds n / 2, which is O(n) time and O(n) space. To get O(1) space I use Boyer-Moore voting: keep a candidate and a counter, increment for the same value and decrement for a different one, and pick a new candidate when the counter is zero. Since the majority appears more than n / 2 times, it survives all cancellations.'],
            ] },
          ],
        },
        {
          title: 'Part 14 — Sohvi session',
          blocks: [
            { olist: ['Part 3 ki frequency table khud bharo.', 'buildFrequency + printFrequency likho.', '<b>LC 217</b> HashSet se submit.'] },
          ],
        },
        {
          title: 'Part 15 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['<b>LC 217</b> + <b>LC 169</b> (HashMap aur Boyer-Moore dono).', 'mostFrequent + uniqueElements likho.', 'Boyer-Moore ko <code>[2,2,1,1,1,2,2]</code> pe paper pe chalao.'] },
          ],
        },
        {
          title: 'Part 16 — Homework',
          blocks: [
            { list: ['<b>Dono:</b> Frequency code bina dekhe likho.', '<b>Dono:</b> <code>[4,1,4,2,1,4]</code> ka frequency dry run notebook me.', 'Kal (Day 4): HashMap pattern — Two Sum (LC 1).'] },
          ],
        },
        {
          title: 'Part 17 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[4,1,4,2,1,4]</code> frequency?', '4 → 3, 1 → 2, 2 → 1.'],
              ['Usme most frequent aur unique?', '4; [2].'],
              ['<code>[1,2,3]</code> LC 217?', 'false.'],
              ['<code>[3,3,4]</code> LC 169?', '3.'],
              ['Duplicate check ki ek line?', '<code>if (!seen.add(x)) return true;</code>'],
            ] },
          ],
        },
      ],
      checks: [
        'Nested loop O(n²) vs HashSet O(n) samjha',
        '5 concepts (frequency, unique, duplicate, count, presence)',
        '[1,2,2,3,1,2] frequency table khud bhari',
        'Frequency map functions likhe',
        'Sohvi: LC 217 Accepted',
        'Tum: LC 217 + LC 169 (dono approaches) Accepted',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: '"Pehle dekha?" = HashSet. "Kitni baar?" = HashMap getOrDefault + 1.',
    },

    // =====================================================================
    // DAY 4 — HashMap Pattern: Two Sum
    4: {
      title: 'HashMap Pattern — "Seen Before?" (Two Sum)',
      goal: 'Pattern: <b>"jo chahiye woh pehle dekha?"</b> — formula <code>target − nums[i]</code>. Brute O(n²) → HashMap O(n). <b>Lookup insertion se pehle kyun</b>. <b>Sohvi:</b> LC 1. <b>Tum:</b> LC 1 memory se dobara.',
      main: 1,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('"Seen before?" pattern, brute vs optimal', '<code>[2,7,11,15]</code>, target 9 — har iteration ke baad map', 'Two Sum brute + optimal', 'Sohvi: LC 1 · Tum: LC 1 memory se'),
            ...rev({
              h: 'LC 217 — Contains Duplicate (kal ka)',
              p: 'Koi value do baar?',
              ex: '[1,2,3,1] → true',
              pat: 'HashSet',
              steps: ['Har x add karo.', 'add false → true.', 'End → false.'],
              code: ap(217, 2),
              hook: '"Pehle dekha?" — aaj bhi yahi sawaal, bas "x" ki jagah "target − x".',
            }),
            ...rev({
              h: 'LC 169 — Majority Element (kal ka)',
              p: 'n/2 se zyada baar aane wala.',
              ex: '[2,2,1,1,1,2,2] → 2',
              pat: 'Boyer-Moore voting',
              steps: ['count 0 → cand = x.', 'Same +1, alag −1.', 'return cand.'],
              code: ap(169, 2),
              hook: 'Majority cancel hoke bhi bachta hai.',
            }),
          ],
        },
        {
          title: 'Part 1 — Pattern: "Seen Before?"',
          blocks: [
            { pre: `Har element pe sawaal:  "mujhe jo partner chahiye, kya woh pehle aa chuka hai?"

partner (need) = target − nums[i]` },
            { p: 'HashMap me <b>value → index</b> rakhte hain, taaki partner mile toh uska index bhi turant mile.' },
          ],
        },
        {
          title: 'Part 2 — Theory: Brute vs Optimal',
          blocks: [
            { table: { head: ['', 'Brute', 'Optimal'], rows: [
              ['Idea', 'Har pair (i, j) check', 'Har i pe need map me dhoondo'],
              ['Loops', 'Nested', 'Ek'],
              ['Time', 'O(n²)', 'O(n)'],
              ['Space', 'O(1)', 'O(n) (map)'],
            ] } },
          ],
        },
        { title: 'Part 3 — Aaj ka problem: LC 1 Two Sum', blocks: [{ problem: 1 }] },
        {
          title: 'Part 4 — Dry Run: nums = [2,7,11,15], target = 9 (map har iteration ke baad)',
          blocks: [
            { table: { head: ['i', 'nums[i]', 'need = 9 − nums[i]', 'need map me?', 'Action', 'Map ke baad'], rows: [
              ['0', '2', '7', 'Nahi', 'put(2, 0)', '{2: 0}'],
              ['1', '7', '2', '<b>Haan → index 0</b>', 'return [0, 1]', '—'],
            ] } },
            { p: '<b>Example 2:</b> <code>[3,2,4]</code>, target 6' },
            { table: { head: ['i', 'nums[i]', 'need', 'Map me?', 'Map ke baad'], rows: [
              ['0', '3', '3', 'Nahi (map khaali)', '{3: 0}'],
              ['1', '2', '4', 'Nahi', '{3: 0, 2: 1}'],
              ['2', '4', '2', '<b>Haan → 1</b>', 'return [1, 2]'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Lookup insertion se PEHLE kyun?',
          blocks: [
            { p: '<code>[3,2,4]</code>, target 6, i = 0: need = 3. Agar pehle <code>put(3, 0)</code> kiya, phir lookup — toh 3 khud se pair ho jaayega → galat <code>[0, 0]</code>. Same element do baar use nahi kar sakte.' },
            { p: '<code>[3,3]</code>, target 6: i = 0 → map khaali → put(3, 0). i = 1 → need 3 → map me index 0 → <b>[0, 1]</b> ✓. Pehle lookup karne se duplicate values bhi sahi chalti hain.' },
            { tip: 'Rule: <b>pehle poocho, phir apna naam likhwao.</b>' },
          ],
        },
        {
          title: 'Part 6 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — nested loop</b>' },
            { code: sol(1, 0) },
            { p: '<b>Optimal — HashMap</b>' },
            { code: sol(1, 2) },
            { lines: [
              ['Map<Integer, Integer> map = new HashMap<>();', 'value → index.'],
              ['int need = target - nums[i];', 'Partner jo chahiye.'],
              ['if (map.containsKey(need)) return new int[]{map.get(need), i};', 'Partner pehle aa chuka → dono indices.'],
              ['map.put(nums[i], i);', 'Lookup ke <b>baad</b> apna entry.'],
              ['return new int[]{-1, -1};', 'Problem guarantee deta hai answer hai; ye sirf compile ke liye.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Visualize: map ko bharte dekho',
          blocks: [
            { list: ['HashMap panel: value → index.', 'Example 3 (<code>[3,3]</code>) chalao — lookup-before-insert ka asar.'] },
            { viz: 1, ex: 0 },
          ],
        },
        {
          title: 'Part 8 — Better (Tum ke liye): sort + two pointers',
          blocks: [
            { p: 'Indices + values ko sort karke left/right pointers. O(n log n), O(n). Week 3 (Two Pointers) ka preview — interview me "aur koi tareeka?" pe bolna.' },
            { code: sol(1, 1) },
          ],
        },
        {
          title: 'Part 9 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Answer', 'Kyun'], rows: [
              ['<code>[3,3]</code>, 6', '[0,1]', 'Lookup pehle → khud se pair nahi'],
              ['<code>[3,2,4]</code>, 6', '[1,2]', 'Index 0 wala 3 akela'],
              ['Negatives <code>[−1,−2,−3,−4,−5]</code>, −8', '[2,4]', 'Formula same'],
              ['Answer end me', 'Last index pe milega', 'Ek pass poora'],
            ] } },
          ],
        },
        {
          title: 'Part 10 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n²)', 'O(1)'], ['Sort + two pointers', 'O(n log n)', 'O(n)'], ['HashMap', 'O(n)', 'O(n)']] } },
          ],
        },
        {
          title: 'Part 11 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Map me key aur value kya?', 'Key = number, value = index.'],
              ['HashSet kyun nahi?', 'Index return karna hai — Set index nahi rakhta.'],
              ['Lookup pehle kyun?', 'Element khud se pair na ho.'],
              ['Duplicate values (<code>[3,3]</code>)?', 'Pehla put, doosra lookup me milta hai → [0,1].'],
              ['Map me same key dobara put?', 'Purana index overwrite — Two Sum me koi farak nahi.'],
              ['Sorted array ho toh?', 'Two pointers, O(1) space (LC 167, Week 3).'],
              ['Time aur space?', 'O(n) / O(n).'],
              ['Pattern ka naam?', '"Seen before?" / complement lookup.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Two Sum approach', 'Checking every pair is O(n²). Instead, for each element I ask whether the complement, target minus the element, has already appeared. I keep a HashMap from value to index. At each index I look up the complement first; if it is there I return both indices, otherwise I store the current value and index. Looking up before inserting prevents pairing an element with itself. One pass, O(n) time and O(n) space.'],
              ['Why HashMap and not HashSet?', 'The problem asks for indices, not just whether a pair exists. A set can tell me the complement exists, but a map from value to index also tells me where it is, so I can return the answer immediately.'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohvi session',
          blocks: [
            { olist: ['Part 4 ki dono tables khud bharo.', 'Brute likho aur submit.', '<b>LC 1</b> HashMap se submit.', '"Lookup pehle kyun" apne shabdon me.'] },
          ],
        },
        {
          title: 'Part 14 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['<b>LC 1</b> — <b>memory se dobara</b>, 5 min me.', 'Brute + optimal dono zubaani (complexity ke saath).', 'Sort + two pointers wala tareeka bolke batao.'] },
          ],
        },
        {
          title: 'Part 15 — Homework',
          blocks: [
            { list: ['<b>Dono:</b> HashMap logic explain karo (5 lines).', '<b>Dono:</b> Brute aur optimal dono bina dekhe likho.', 'Kal (Day 5): Prefix Sum — Tum: LC 303.'] },
          ],
        },
        {
          title: 'Part 16 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[1,5,3,7]</code>, target 8?', '[1,2] (5 + 3) — dry run: i=1 need 3 nahi; i=2 need 5 → index 1.'],
              ['Formula?', '<code>need = target − nums[i]</code>'],
              ['<code>[2,2]</code>, target 4?', '[0,1].'],
              ['Optimal space?', 'O(n).'],
              ['Pehle put kiya toh <code>[3,2,4]</code>, 6 pe?', '[0,0] — galat.'],
            ] },
          ],
        },
      ],
      checks: [
        '"Seen before?" pattern + need formula',
        'Brute vs optimal table zubaani',
        'Map har iteration ke baad (2 examples) khud likha',
        'Lookup-before-insert ka reason',
        'Sohvi: LC 1 Accepted',
        'Tum: LC 1 memory se + sort/two-pointer idea',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Partner dhoondo (target − x); pehle poocho, phir apna naam likhwao.',
    },

    // =====================================================================
    // DAY 5 — Prefix Sum
    5: {
      title: 'Prefix Sum — Running Sum, Prefix Array, Range Query',
      goal: 'Prefix sum kyun exist karta hai: <b>baar-baar range sum</b> ko O(n) se <b>O(1)</b> banana. Formula <code>prefix[i] = prefix[i−1] + arr[i]</code> aur <code>sum(L..R) = prefix[R] − prefix[L−1]</code>. <b>Sohvi:</b> manual prefix. <b>Tum:</b> LC 303.',
      main: 303,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('Module 5: running sum, prefix array, range formula', '<code>2 4 6 8</code> → <code>2 6 12 20</code>; multiple L..R queries', 'buildPrefix(), rangeSum()', 'Sohvi: manual prefix · Tum: LC 303'),
            ...rev({
              h: 'LC 1 — Two Sum (kal ka)',
              p: 'Do indices jinka sum target.',
              ex: '[2,7,11,15], 9 → [0,1]',
              pat: 'HashMap "seen before?"',
              steps: ['need = target − nums[i].', 'Map me need → return.', 'Warna put(nums[i], i).'],
              code: ap(1, 2),
              hook: 'Pehle poocho, phir likhwao.',
            }),
            ...rev({
              h: 'LC 1480 — Running Sum (Day 2)',
              p: 'Running sum — aaj ka prefix array yahi hai.',
              ex: '[1,2,3,4] → [1,3,6,10]',
              pat: 'Prefix sum (in-place)',
              steps: ['i = 1 se.', 'nums[i] += nums[i − 1].'],
              code: ap(1480, 1),
              hook: 'Running sum = prefix array.',
            }),
          ],
        },
        {
          title: 'Part 1 — Theory: Prefix kyun exist karta hai?',
          blocks: [
            { p: '<b>Problem:</b> Ek fixed array pe <b>bahut saare</b> sawaal: "index L se R tak ka sum kya hai?"' },
            { table: { head: ['Tareeka', 'Har query', 'Q queries'], rows: [
              ['Har baar loop', 'O(n)', 'O(Q · n) — 10⁴ × 10⁴ = 10⁸'],
              ['Prefix ek baar banao', 'O(1)', 'O(n + Q)'],
            ] } },
            { p: '<b>Running sum</b> = ab tak ka total. <b>Prefix array</b> = har index pe running sum store. Ek baar ki mehnat, phir har query free.' },
          ],
        },
        {
          title: 'Part 2 — Formula + Visualization',
          blocks: [
            { pre: `prefix[0] = arr[0]
prefix[i] = prefix[i − 1] + arr[i]

Array :   2    4    6    8
Prefix:   2    6   12   20
          │    │    │    └ 2+4+6+8
          │    │    └ 2+4+6
          │    └ 2+4
          └ 2` },
            { p: '<b>Range formula:</b>' },
            { pre: `sum(L..R) = prefix[R] − prefix[L − 1]        (L > 0)
sum(0..R) = prefix[R]                         (L = 0 — special case)

sum(1..3) = prefix[3] − prefix[0] = 20 − 2 = 18     (4 + 6 + 8 ✓)` },
            { tip: '<b>Kyun kaam karta hai?</b> prefix[R] = 0..R ka sum. Usme se 0..L−1 ka hissa (prefix[L−1]) hata do — bacha L..R.' },
          ],
        },
        {
          title: 'Part 3 — n + 1 trick (LC 303 isi se)',
          blocks: [
            { p: 'L = 0 ka special case hatane ke liye prefix ko <b>1 bada</b> banao aur aage ek 0 rakho:' },
            { pre: `arr     :      2    4    6    8
prefix  :  0   2    6   12   20       (size n + 1, prefix[0] = 0)
index   :  0   1    2    3    4

prefix[i + 1] = prefix[i] + arr[i]
sum(L..R) = prefix[R + 1] − prefix[L]       ← L = 0 pe bhi seedha` },
            { table: { head: ['Query', 'Inclusive formula', 'n + 1 formula'], rows: [
              ['sum(0..2)', 'prefix[2] = 12 (special case)', 'P[3] − P[0] = 12 − 0 = 12'],
              ['sum(1..3)', 'prefix[3] − prefix[0] = 18', 'P[4] − P[1] = 20 − 2 = 18'],
              ['sum(2..2)', 'prefix[2] − prefix[1] = 6', 'P[3] − P[2] = 12 − 6 = 6'],
            ] } },
          ],
        },
        {
          title: 'Part 4 — Dry Run: multiple queries on [2, 4, 6, 8]',
          blocks: [
            { table: { head: ['L', 'R', 'Calculation', 'Answer', 'Check'], rows: [
              ['0', '3', 'prefix[3]', '20', '2+4+6+8'],
              ['1', '2', 'prefix[2] − prefix[0] = 12 − 2', '10', '4+6'],
              ['2', '3', 'prefix[3] − prefix[1] = 20 − 6', '14', '6+8'],
              ['3', '3', 'prefix[3] − prefix[2] = 20 − 12', '8', '8'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Coding Practice: buildPrefix + rangeSum',
          blocks: [
            { code: PREFIX },
            { lines: [
              ['int[] prefix = new int[arr.length];', 'Inclusive prefix (same size).'],
              ['prefix[0] = arr[0];', 'Pehla running sum.'],
              ['prefix[i] = prefix[i - 1] + arr[i];', 'Pichla total + aaj ka.'],
              ['if (L == 0) return prefix[R];', 'prefix[−1] exist nahi karta — special case.'],
              ['return prefix[R] - prefix[L - 1];', '0..R me se 0..L−1 hatao.'],
            ] },
            { tip: 'Maine chala ke check kiya: [2,4,6,8] → [2,6,12,20]; rangeSum(1,3) = 18, (0,2) = 12, (2,2) = 6.' },
          ],
        },
        { title: 'Part 6 — Aaj ka problem (Tum): LC 303 Range Sum Query — Immutable', blocks: [{ problem: 303 }] },
        {
          title: 'Part 7 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute:</b> nums store karo, har <code>sumRange</code> pe left..right loop → O(n) per query. 10⁴ queries pe slow.' },
            { p: '<b>Observation:</b> Array <b>kabhi nahi badalta</b> → ek baar prefix bana lo (constructor me).' },
            { p: '<b>Optimal:</b> Constructor O(n) me prefix (size n + 1). sumRange = <code>prefix[right + 1] − prefix[left]</code> → O(1).' },
          ],
        },
        {
          title: 'Part 8 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' },
            { code: ap(303, 0) },
            { p: '<b>Optimal — prefix (n + 1)</b>' },
            { code: ap(303, 1) },
            { lines: [
              ['private int[] prefix;', 'Object ke andar — har query isi ko use karegi.'],
              ['prefix = new int[nums.length + 1];', 'Ek extra jagah; prefix[0] = 0 default.'],
              ['prefix[i + 1] = prefix[i] + nums[i];', 'prefix[i + 1] = pehle i + 1 elements ka sum.'],
              ['return prefix[right + 1] - prefix[left];', 'O(1) — L = 0 pe bhi koi if nahi.'],
            ] },
          ],
        },
        {
          title: 'Part 9 — Visualize: prefix banta dekho, phir queries',
          blocks: [
            { list: ['Neeche wali row = prefix (size n + 1).', 'Har query me do prefix cells highlight hote hain — unka difference = answer.', 'Example 2 = Day 6 ki dry run.'] },
            { viz: 303, ex: 0 },
          ],
        },
        {
          title: 'Part 10 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Kya hota hai'], rows: [
              ['L = 0', 'Inclusive: special case; n + 1: prefix[0] = 0 se seedha'],
              ['L = R', 'Ek element ka sum'],
              ['Negatives', 'Formula same — <code>[−2,0,3]</code> → prefix [0,−2,−2,1]'],
              ['Bada sum', 'n × 10⁵ = 10⁹ — int me fit; aur bada ho toh <code>long[]</code>'],
              ['Array badalta ho', 'Prefix har update pe O(n) — tab Fenwick / Segment tree (aage)'],
            ] } },
          ],
        },
        {
          title: 'Part 11 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Build', 'Per query', 'Space'], rows: [
              ['Brute', 'O(1)', 'O(n)', 'O(1)'],
              ['Prefix', 'O(n)', 'O(1)', 'O(n)'],
            ] } },
          ],
        },
        {
          title: 'Part 12 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Prefix formula?', '<code>prefix[i] = prefix[i−1] + arr[i]</code>'],
              ['Range sum formula?', '<code>prefix[R] − prefix[L−1]</code> (L &gt; 0)'],
              ['L = 0 pe kya?', 'Inclusive me prefix[R]; n + 1 version me special case nahi.'],
              ['Prefix kab useful?', 'Fixed array + bahut saari range queries.'],
              ['LC 303 me prefix kahan banate hain?', 'Constructor me — ek baar.'],
              ['Query time?', 'O(1).'],
              ['Array update ho toh?', 'Prefix rebuild O(n); Fenwick tree better.'],
              ['Overflow?', 'Bade sums pe long[].'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['LC 303 approach', 'Since the array never changes and sumRange is called many times, I precompute a prefix array of size n + 1 in the constructor, where prefix[i + 1] = prefix[i] + nums[i]. Then the sum from left to right is prefix[right + 1] − prefix[left]. Building is O(n) and each query is O(1), with O(n) extra space. The extra leading zero means I do not need a special case when left is 0.'],
              ['Why does the range formula work?', 'prefix[R] is the sum from index 0 to R. The part I do not want is index 0 to L − 1, which is exactly prefix[L − 1]. Subtracting it leaves the sum from L to R.'],
            ] },
          ],
        },
        {
          title: 'Part 14 — Sohvi session (Manual Prefix)',
          blocks: [
            { olist: ['<code>[3, 1, 4, 1, 5]</code> ka prefix haath se banao.', 'Usse sum(1..3) aur sum(0..4) nikaalo — formula se, phir seedha jod ke check.', 'buildPrefix khud likho.'] },
            { qa: [['[3,1,4,1,5] ka prefix, sum(1..3), sum(0..4)?', 'Prefix [3,4,8,9,14]; sum(1..3) = 9 − 3 = 6; sum(0..4) = 14.']] },
          ],
        },
        {
          title: 'Part 15 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['<b>LC 303</b> brute + prefix submit.', 'Inclusive aur n + 1 dono formulas board pe derive karo.', 'Follow-up socho: array update ho toh?'] },
          ],
        },
        {
          title: 'Part 16 — Homework',
          blocks: [
            { list: ['<b>Dono:</b> 3 prefix examples (apne arrays) — har ek pe 2 range queries.', 'Kal (Day 6): Prefix applications + <code>prefix − k</code> — Tum: LC 560.'] },
          ],
        },
        {
          title: 'Part 17 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[5,1,2]</code> ka prefix?', '[5,6,8]'],
              ['Usme sum(1..2)?', '8 − 5 = 3.'],
              ['n + 1 version me sum(L..R)?', 'prefix[R + 1] − prefix[L]'],
              ['LC 303 query time?', 'O(1).'],
              ['[1,2,3,4,5] me sum(1..3)?', '9.'],
            ] },
          ],
        },
      ],
      checks: [
        'Prefix kyun (O(Q·n) → O(n + Q)) samjha',
        'prefix[i] formula + range formula zubaani',
        'n + 1 trick (L = 0) samjha',
        'Multiple queries ka dry run kiya',
        'buildPrefix + rangeSum likhe',
        'Sohvi: manual prefix (3 examples)',
        'Tum: LC 303 Accepted',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Ek baar jod ke rakh lo; L se R = bada total − pehle ka total.',
    },

    // =====================================================================
    // DAY 6 — Prefix Applications (Saturday — learn day)
    6: {
      title: 'Prefix Applications — Repeated Queries + prefix − k',
      goal: 'Repeated range queries me prefix kyun fast, aur <b>HashMap + Prefix</b> ka idea: <code>prefix − k</code> (sirf intuition, poora proof nahi). <b>Sohvi:</b> running sum revision. <b>Tum:</b> LC 560.',
      main: 560,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('Repeated queries + HashMap + Prefix', '<code>[1,2,3,4,5]</code>: sum 0–2, 1–3, 2–4; LC 560 map table', 'Prefix queries + LC 560 saath me', 'Sohvi: running sum revision · Tum: LC 560'),
            ...rev({
              h: 'LC 303 — Range Sum Query (kal ka)',
              p: 'Bahut saari range sum queries.',
              ex: 'nums = [-2,0,3,-5,2,-1] → sumRange(0,2) = 1',
              pat: 'Prefix (n + 1)',
              steps: ['Constructor: prefix[i + 1] = prefix[i] + nums[i].', 'sumRange = prefix[r + 1] − prefix[l].'],
              code: ap(303, 1),
              hook: 'Bada total − pehle ka total.',
            }),
          ],
        },
        {
          title: 'Part 1 — Theory: Repeated Range Query — prefix faster kyun?',
          blocks: [
            { table: { head: ['n = 10⁵, Q = 10⁵', 'Bina prefix', 'Prefix'], rows: [
              ['Kaam', 'Har query loop: Q × n', 'n (build) + Q (O(1) each)'],
              ['Operations', '≈ 10¹⁰ (TLE)', '≈ 2 × 10⁵'],
            ] } },
            { p: 'Jitni zyada queries, utna bada fayda. <b>Ek baar ki tayyari, baar-baar ka faayda.</b>' },
          ],
        },
        {
          title: 'Part 2 — Dry Run: [1, 2, 3, 4, 5]',
          blocks: [
            { pre: `arr    :  1   2   3   4   5
prefix :  1   3   6  10  15` },
            { table: { head: ['Query', 'Formula', 'Answer', 'Check'], rows: [
              ['Sum 0–2', 'prefix[2]', '6', '1+2+3'],
              ['Sum 1–3', 'prefix[3] − prefix[0] = 10 − 1', '9', '2+3+4'],
              ['Sum 2–4', 'prefix[4] − prefix[1] = 15 − 3', '12', '3+4+5'],
            ] } },
          ],
        },
        {
          title: 'Part 3 — Advanced (sirf intuition): prefix − k',
          blocks: [
            { p: '<b>Naya sawaal:</b> Kitne subarrays ka sum <b>exactly k</b> hai?' },
            { pre: `Subarray (j+1 .. i) ka sum = prefix[i] − prefix[j]

Hum chahte hain:  prefix[i] − prefix[j] = k
              ⇒   prefix[j] = prefix[i] − k

Matlab: "kya pehle kabhi running sum = (abhi ka sum − k) tha?"
         → HashMap me running sums ki ginti rakho.` },
            { p: 'Ye Day 4 (Two Sum) wala hi <b>"seen before?"</b> pattern hai — bas "partner" ab <b>running sum − k</b> hai.' },
            { table: { head: ['Two Sum', 'Subarray Sum = k'], rows: [
              ['need = target − nums[i]', 'need = sum − k'],
              ['Map: value → index', 'Map: prefixSum → kitni baar'],
              ['Mila → answer', 'Mila → count += freq'],
            ] } },
            { tip: '<b>freq.put(0, 1) kyun?</b> Agar subarray index 0 se hi shuru ho (poora prefix = k), toh "pehle ka sum" = 0 (khaali prefix). Ye entry na ho toh woh subarray miss ho jaayega.' },
          ],
        },
        { title: 'Part 4 — Aaj ka problem (Tum): LC 560 Subarray Sum Equals K', blocks: [{ problem: 560 }] },
        {
          title: 'Part 5 — Thinking: Brute → Better → Optimal',
          blocks: [
            { table: { head: ['Level', 'Idea', 'Time', 'Space'], rows: [
              ['Brute', 'Har (i, j), andar sum loop', 'O(n³)', 'O(1)'],
              ['Better', 'Har i se running sum (j badhte hue)', 'O(n²)', 'O(1)'],
              ['Optimal', 'Prefix + HashMap (sum − k)', 'O(n)', 'O(n)'],
            ] } },
            { p: '<b>Sliding window kyun nahi?</b> Negative numbers ho sakte hain — window badhane se sum hamesha nahi badhta, toh shrink/expand ka rule toot jaata hai.' },
          ],
        },
        {
          title: 'Part 6 — Dry Run: nums = [1, 2, 3], k = 3',
          blocks: [
            { table: { head: ['x', 'sum', 'need = sum − 3', 'freq[need]', 'count', 'freq ke baad'], rows: [
              ['start', '0', '—', '—', '0', '{0: 1}'],
              ['1', '1', '−2', '0', '0', '{0: 1, 1: 1}'],
              ['2', '3', '0', '<b>1</b> → [1,2]', '1', '{0: 1, 1: 1, 3: 1}'],
              ['3', '6', '3', '<b>1</b> → [3]', '2', '{0: 1, 1: 1, 3: 1, 6: 1}'],
            ] } },
            { p: 'Answer <b>2</b>: subarrays [1,2] aur [3].' },
          ],
        },
        {
          title: 'Part 7 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Better — O(n²)</b>' },
            { code: sol(560, 1) },
            { p: '<b>Optimal — prefix + HashMap</b>' },
            { code: sol(560, 2) },
            { lines: [
              ['freq.put(0, 1);', 'Khaali prefix — index 0 se shuru hone wale subarrays ke liye.'],
              ['sum += x;', 'Running (prefix) sum.'],
              ['count += freq.getOrDefault(sum - k, 0);', 'Jitni baar (sum − k) pehle aaya, utne subarrays yahan khatam.'],
              ['freq.put(sum, freq.getOrDefault(sum, 0) + 1);', 'Apna sum <b>baad</b> me record — Two Sum jaisa "pehle poocho".'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Visualize: LC 560',
          blocks: [
            { list: ['HashMap panel: prefixSum → count.', 'Har step pe <code>sum − k</code> highlight hota hai.', 'Default example me negative number bhi hai.'] },
            { viz: 560, ex: 1 },
          ],
        },
        {
          title: 'Part 9 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'k', 'Answer', 'Kyun'], rows: [
              ['<code>[1,1,1]</code>', '2', '2', '[1,1] do jagah'],
              ['<code>[1,−1,0]</code>', '0', '3', '[1,−1], [0], [1,−1,0] — negatives'],
              ['<code>[3]</code>', '3', '1', 'freq{0:1} se pakda'],
              ['<code>[0,0]</code>', '0', '3', '[0], [0], [0,0]'],
            ] } },
          ],
        },
        {
          title: 'Part 10 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n³)', 'O(1)'], ['Better', 'O(n²)', 'O(1)'], ['Prefix + HashMap', 'O(n)', 'O(n)']] } },
          ],
        },
        {
          title: 'Part 11 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Subarray sum ko prefix me kaise likhte hain?', 'prefix[i] − prefix[j].'],
              ['Kya dhoondte hain?', 'Pehle ka prefix = sum − k.'],
              ['freq.put(0, 1) kyun?', 'Index 0 se shuru hone wale subarray ke liye.'],
              ['Map me value kya?', 'Woh prefix sum kitni baar aaya (count).'],
              ['Pehle lookup, phir put kyun?', 'Khaali subarray (k = 0 pe) na gine.'],
              ['Sliding window kyun nahi?', 'Negatives — window ka sum monotonic nahi.'],
              ['Two Sum se connection?', 'Dono "seen before?" — partner = target − x / sum − k.'],
              ['Time/space?', 'O(n) / O(n).'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['LC 560 approach', 'The sum of a subarray from j + 1 to i equals prefix[i] − prefix[j]. I want that to be k, so for each position I need to know how many earlier prefix sums equal the current sum minus k. I keep a running sum and a HashMap from prefix sum to how many times it has appeared, starting with 0 mapped to 1 for subarrays that begin at index 0. At each element I add the count of sum − k to the answer, then record the current sum. O(n) time, O(n) space, and it works with negative numbers.'],
              ['Why not sliding window?', 'A sliding window relies on the sum growing when I expand and shrinking when I contract. With negative numbers that is not true, so I cannot decide when to move the left pointer. The prefix-sum and HashMap approach does not depend on the sign of the numbers.'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohvi session (Running Sum Revision)',
          blocks: [
            { olist: ['LC 1480 bina dekhe dobara submit.', 'Part 2 ki 3 queries khud prefix se nikaalo.', '<code>prefix − k</code> ka intuition sirf padho — code zaroori nahi.'] },
          ],
        },
        {
          title: 'Part 14 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['<b>LC 560</b> — O(n²) better, phir O(n) optimal submit.', 'Part 6 ki table <code>[1,−1,0]</code>, k = 0 ke liye khud bharo (answer 3).', 'Two Sum se connection 30 sec me bolo.'] },
          ],
        },
        {
          title: 'Part 15 — Homework',
          blocks: [
            { list: ['<b>Tum:</b> Apne shabdon me explain karo ki <code>prefix − k</code> kyun kaam karta hai (poora derivation).', '<b>Sohvi:</b> 2 arrays ka prefix + 3-3 queries.', 'Kal (Day 7): Revision + interview practice + mini mock.'] },
          ],
        },
        {
          title: 'Part 16 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[1,2,3,4,5] me sum 2–4?', '12.'],
              ['<code>[1,1,1]</code>, k = 2?', '2.'],
              ['Subarray sum formula?', 'prefix[i] − prefix[j].'],
              ['LC 560 me map ki shuruaat?', '{0: 1}.'],
              ['Negatives ke saath kaunsa approach?', 'Prefix + HashMap.'],
            ] },
          ],
        },
      ],
      checks: [
        'Repeated queries me prefix kyun fast — bata sakta/sakti hu',
        '[1,2,3,4,5] ki 3 queries khud nikaali',
        'prefix − k ka intuition (Two Sum se connection)',
        'freq.put(0, 1) ka reason',
        'Sohvi: running sum revision (LC 1480)',
        'Tum: LC 560 Accepted (O(n))',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Subarray = do prefix ka farak. "sum − k pehle dekha?" — utne subarrays yahan khatam.',
    },

    // =====================================================================
    // DAY 7 — Revision Day + Mini Mock (Sunday)
    7: {
      title: 'Revision Day — Quiz, Whiteboard, Interview Practice + Mini Mock',
      goal: 'Bina notes: Array, Traversal, HashMap, Prefix Sum, Complexities. Whiteboard dry run (bina IDE). Har problem pe Brute → Better → Optimal + complexity + "kyun kaam karta hai". Phir chhota mock aur LeetCode Weekly Contest discussion.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka plan',
          blocks: [
            { table: { head: ['Time', 'Kya'], rows: [
              ['9:00–9:20', 'Theory quiz (bina notes)'],
              ['9:20–9:40', 'Whiteboard dry run (bina IDE)'],
              ['9:40–10:00', 'Re-solve: Sohvi 1920, 1480, 217 · Tum 1, 169, 303, 560'],
              ['10:00–10:20', 'Interview practice + mini mock'],
              ['10:20–10:30', 'Contest discussion + Week 1 deliverables check'],
            ] } },
            { tip: 'LeetCode Weekly Contest — Sunday 8:00 AM IST. Raat ke session me uski discussion.' },
          ],
        },
        {
          title: 'Part 1 — Theory Quiz (bina notes)',
          blocks: [
            { qa: [
              ['Array kya hai aur access O(1) kyun?', 'Continuous memory me same-type elements; address = base + i × size.'],
              ['Insert/delete middle O(n) kyun?', 'Baad ke elements shift.'],
              ['Traversal kya hai?', 'Har element exactly ek baar — O(n).'],
              ['HashMap kyun?', 'O(1) average lookup → nested loop O(n²) se O(n).'],
              ['Frequency map ki line?', '<code>freq.put(x, freq.getOrDefault(x, 0) + 1)</code>'],
              ['Prefix formula aur range formula?', 'prefix[i] = prefix[i−1] + arr[i]; sum(L..R) = prefix[R] − prefix[L−1].'],
              ['Two Sum me lookup pehle kyun?', 'Element khud se pair na ho.'],
              ['prefix − k ka matlab?', 'Pehle ka prefix jo current sum − k ke barabar ho → subarray sum k.'],
            ] },
          ],
        },
        {
          title: 'Part 2 — Whiteboard Dry Run (bina IDE) — phir answers milao',
          blocks: [
            { pre: `1) findMax / sum on [4, 9, 2, 7]          → max 9, sum 22
2) Second largest on [3, 8, 8, 5]         → 5
3) Frequency of [5, 1, 5, 5, 1]           → 5:3, 1:2 → most 5
4) Two Sum [1, 4, 6, 9], target 10        → i=2: need 4 → [1, 2]
5) Prefix of [3, 1, 2, 4]; sum(1..3)      → [3, 4, 6, 10]; 10 − 3 = 7
6) LC 560 [2, 1, 1], k = 2                → sums 2,3,4 → need 0,1,2 → count 2 ([2], [1,1])` },
          ],
        },
        {
          title: 'Part 3 — Re-solve list (pichla solution dekhe bina)',
          blocks: [
            { table: { head: ['Kaun', 'Problem', 'Pattern', 'Optimal complexity'], rows: [
              ['Sohvi', 'LC 1920', 'Traversal', 'O(n) / O(n)'],
              ['Sohvi', 'LC 1480', 'Running sum', 'O(n) / O(1)'],
              ['Sohvi', 'LC 217', 'HashSet', 'O(n) / O(n)'],
              ['Tum', 'LC 1', 'HashMap seen-before', 'O(n) / O(n)'],
              ['Tum', 'LC 169', 'Boyer-Moore', 'O(n) / O(1)'],
              ['Tum', 'LC 303', 'Prefix (n + 1)', 'O(n) build, O(1) query'],
              ['Tum', 'LC 560', 'Prefix + HashMap', 'O(n) / O(n)'],
            ] } },
            { code: ap(560, 2) },
          ],
        },
        {
          title: 'Part 4 — Interview Practice: har problem pe 6 cheezein',
          blocks: [
            { olist: ['Brute Force', 'Better Solution', 'Optimal Solution', 'Time Complexity', 'Space Complexity', 'Ye approach kyun kaam karta hai'] },
            { table: { head: ['Problem', 'Brute', 'Better', 'Optimal', 'Kyun kaam karta hai'], rows: [
              ['LC 217', 'Har pair O(n²)', 'Sort O(n log n)', 'HashSet O(n)', 'add() false = pehle dekha'],
              ['LC 1', 'Har pair O(n²)', 'Sort + 2 pointers', 'HashMap O(n)', 'Complement pehle aaya toh map me hai'],
              ['LC 169', 'Har element gino O(n²)', 'HashMap O(n)', 'Voting O(1) space', 'Majority > n/2 cancel hoke bhi bachta'],
              ['LC 303', 'Har query loop', '—', 'Prefix O(1) query', 'Do prefix ka farak = range'],
              ['LC 560', 'O(n³)', 'O(n²)', 'Prefix + map O(n)', 'prefix[i] − prefix[j] = k'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Mini Mock (Tum ↔ Sohvi)',
          blocks: [
            { table: { head: ['Time', 'Interviewer', 'Candidate', 'Question'], rows: [
              ['10 min', 'Tum', 'Sohvi', 'LC 217 Contains Duplicate'],
              ['10 min', 'Sohvi', 'Tum', 'LC 560 Subarray Sum Equals K'],
            ] } },
            { table: { head: ['Rubric', 'Kya dekhna hai', 'Score (1–4)'], rows: [
              ['Clarify', 'Input/output/edge cases poochhe?', ''],
              ['Brute → Optimal', 'Dono bataye, complexity ke saath', ''],
              ['Code', 'Clean, bina bug', ''],
              ['Dry run', 'Chhote example pe chalaya', ''],
              ['Communication', 'Bolke socha', ''],
            ] } },
            { problem: 217 },
            { problem: 560 },
          ],
        },
        {
          title: 'Part 6 — LeetCode Weekly Contest discussion',
          blocks: [
            { list: ['Sunday 8:00 AM IST — dono join karo (90 min). Target: Q1 (+ Tum: Q2).', 'Har solved question ka pattern naam do.', 'Jo nahi hua: editorial padho, kal 20 min upsolve.'] },
            { table: { head: ['Question', 'Pattern', 'Time liya', 'Galti', 'Seekh'], rows: [['Q1', '', '', '', ''], ['Q2', '', '', '', ''], ['Q3', '', '', '', '']] } },
          ],
        },
        {
          title: 'Part 7 — Aise bolo',
          blocks: [
            { say: [
              ['How do you approach a new array problem?', 'First I clarify the input size, value range and edge cases like empty arrays or negatives. Then I state a brute force with its complexity and look for repeated work. If I keep searching for something I have already seen, I use a HashMap or HashSet. If I keep summing the same ranges, I use a prefix sum. Then I dry run the optimal approach on a small example before coding.'],
              ['Mock closing', 'To summarize, this solution runs in O(n) time with O(n) extra space. I tested it on the given examples, on a single element, and on an input with negative numbers. If memory were tight, I would mention the trade-off with the slower but constant-space approach.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohvi session',
          blocks: [
            { olist: ['Theory quiz bina notes.', 'LC 1920, 1480, 217 re-solve (pichla solution dekhe bina).', 'Mini mock me LC 217 bolke solve karo.', 'Contest Q1 try.'] },
          ],
        },
        {
          title: 'Part 9 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['LC 1, 169, 303, 560 re-solve (timer: 10 / 10 / 10 / 20 min).', 'Part 4 ki table bina dekhe zubaani.', 'Mini mock me LC 560 + follow-up "sliding window kyun nahi?"', 'Contest Q1–Q2 attempt.'] },
          ],
        },
        {
          title: 'Part 10 — Week 1 Deliverables',
          blocks: [
            { table: { head: ['Deliverable', 'Kya hona chahiye'], rows: [
              ['Theory notebook', 'Arrays, complexity, traversal, hashing, prefix sum (handwritten ya digital)'],
              ['Pattern notebook', 'Traversal, Frequency Map, Two Sum, Prefix Sum — template + "kab use karein"'],
              ['Code library', 'Java templates: traversal, max/min, frequency map, prefix sum, Two Sum'],
              ['Solved — Sohvi', '1920, 1480, 217, 1 (+ manual prefix exercises)'],
              ['Solved — Tum', '1920, 26, 1480, 1295, 217, 169, 1, 303, 560'],
              ['Revision', 'Har solved problem Week 2 se pehle bina pichla solution dekhe dobara'],
            ] } },
            { tip: 'Week 1 ka objective: array ke core patterns itne clear ho jaayein ki Week 2 aur aage ke topics naturally build ho sakein.' },
          ],
        },
        {
          title: 'Part 11 — Homework + self-test',
          blocks: [
            { list: ['Deliverables me jo adhoora hai, Monday se pehle poora.', 'Mini mock rubric me jo 1–2 aaya, us cheez ko dobara.', 'Next: Week 2.'] },
            { qa: [
              ['"Kitni baar?" ka tool?', 'HashMap frequency.'],
              ['"Range sum baar-baar?" ka tool?', 'Prefix sum.'],
              ['"Partner pehle aaya?" ka tool?', 'HashMap (value → index).'],
              ['Array access complexity?', 'O(1).'],
              ['LC 560 ki 3 key lines?', 'freq.put(0,1); count += freq[sum − k]; freq[sum]++.'],
            ] },
          ],
        },
      ],
      checks: [
        'Theory quiz bina notes',
        'Whiteboard dry runs (6) bina IDE',
        'Sohvi: 1920, 1480, 217 re-solve',
        'Tum: 1, 169, 303, 560 re-solve',
        'Interview practice table (brute/better/optimal/why) zubaani',
        'Mini mock (rubric bhara)',
        'Contest attempt + discussion',
        'Week 1 deliverables check',
      ],
      memory: 'Index se jaao (O(1)), ek baar ghoomo (traversal), yaad rakho (HashMap), jod ke rakho (prefix).',
    },
  });
})();
