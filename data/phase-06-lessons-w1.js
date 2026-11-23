// Phase 6 (Binary Search) — Week 1 lessons (local days 1..7). Format = Phase 1 Day 1 lesson.
(function () {
  const P = window.PHASE_CONTENT['binary-search'];
  P.lessons = P.lessons || {};

  // Part 0 ka ek revision question: problem, example, pattern, thinking steps, short code, memory hook
  const rev = (title, line, ex, pattern, steps, code, hook) => [
    { h: title },
    { p: line },
    { pre: ex },
    { p: '<b>Pattern:</b> ' + pattern },
    { olist: steps },
    { code },
    { tip: '<b>Memory hook:</b> ' + hook },
  ];
  const SQL = '<b>Extra (SDE-2): 2 SQL questions</b> — LeetCode Database section se (aaj: 1 JOIN + 1 GROUP BY / HAVING), 20 min timer.';
  const SD = '<b>System Design session (1/week):</b> 45 min — ek design (aaj neeche diya hai) whiteboard pe: requirements → APIs → data model → high-level diagram → bottlenecks.';

  Object.assign(P.lessons, {
    // =====================================================================
    1: {
      title: 'Binary Search Basics (lo / mid / hi)',
      goal: 'Samajhna ki <b>sorted array me aadha phenkna</b> kyun O(log n) deta hai, <b>overflow-safe mid</b> likhna, aur LC 704 ko <b>iterative + recursive</b> dono tarike se solve karna.',
      main: 704,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision (Phase 2 + Phase 5)',
          blocks: [
            { p: 'Naya phase shuru karne se pehle 2 purane questions — dono me "sorted" ya "order" ka fayda uthaya tha. Aaj wahi idea aur aage le jaayenge.' },
            ...rev('LC 167 — Two Sum II (sorted array)',
              'Sorted array me do numbers dhundo jinka sum target ho, 1-indexed answer.',
              'numbers = [2, 7, 11, 15], target = 9\nl=0 (2), r=3 (15): 17 > 9 → r--\nl=0 (2), r=1 (7):  9 == 9 → [1, 2]',
              'Two Pointers (opposite direction)',
              ['Sorted hai → chhota sum chahiye toh r--, bada chahiye toh l++.', 'Har step ek element permanently discard hota hai.', 'O(n) time, O(1) space.'],
              `int l = 0, r = numbers.length - 1;
while (l < r) {
    int sum = numbers[l] + numbers[r];
    if (sum == target) return new int[]{l + 1, r + 1};
    if (sum < target) l++;
    else r--;
}
return new int[]{-1, -1};`,
              'Sorted = har comparison kuch discard karta hai. Two pointers 1 element phenkta hai, binary search <b>aadha</b>.'),
            ...rev('LC 155 — Min Stack',
              'push / pop / top / getMin sab O(1).',
              'push(-2) push(0) push(-3)\nstack    : [-2, 0, -3]\nminStack : [-2, -2, -3]  → getMin = -3\npop()    → getMin = -2',
              'Stack + auxiliary min stack',
              ['Har push pe current min bhi saath me store karo.', 'Pop pe dono stacks se nikalo.', 'getMin = min stack ka top.'],
              `Deque<int[]> st = new ArrayDeque<>();      // {value, minSoFar}
void push(int v) { st.push(new int[]{v, st.isEmpty() ? v : Math.min(v, st.peek()[1])}); }
int getMin() { return st.peek()[1]; }`,
              'Har plate ke saath "ab tak ka sabse chhota" chipka do.'),
          ],
        },
        {
          title: 'Part 1 — Concept: Search space aadha karna',
          blocks: [
            { p: '<b>Linear search</b> har element dekhta hai → O(n). Agar array <b>sorted</b> hai toh beech wale element se compare karke <b>aadha array ek hi baar me</b> phenk sakte hain.' },
            { pre: 'nums = [-1, 0, 3, 5, 9, 12], target = 9\n\n  lo               mid                  hi\n  [-1    0    3]   →  3 < 9  →  left half kaam ka nahi\n   xx   xx   xx  [5    9    12]\n                  lo  mid   hi   →  9 == 9  ✓ return 4\n\nn = 16 → 8 → 4 → 2 → 1   (log₂16 = 4 steps)' },
            { table: { head: ['n', 'Linear (worst)', 'Binary (worst)'], rows: [
              ['10', '10', '4'],
              ['1,000', '1,000', '10'],
              ['10⁶', '10⁶', '20'],
              ['10⁹', '10⁹', '30'],
            ] } },
            { p: '<b>Teen variables:</b> <code>lo</code> = search space ka left end, <code>hi</code> = right end, <code>mid</code> = beech. Template A (exact match) me range <b>closed</b> hai: <code>[lo, hi]</code> dono include.' },
            { code: `int mid = lo + (hi - lo) / 2;   // SAFE
int mid = (lo + hi) / 2;        // lo + hi > 2^31 - 1 ho toh overflow!` },
            { tip: 'Overflow interview me zaroor poochte hain. Java ka <code>Arrays.binarySearch</code> khud <code>(lo + hi) &gt;&gt;&gt; 1</code> use karta hai.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 704 Binary Search',
          blocks: [{ problem: 704 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute (linear):</b> har index check — O(n). Sorted hone ka koi fayda nahi uthaya. Constraint "O(log n)" bol raha hai ki ye reject hoga.' },
            { p: '<b>Optimal (binary search):</b> mid pe teen cases:' },
            { olist: [
              '<code>nums[mid] == target</code> → mil gaya, return mid.',
              '<code>nums[mid] &lt; target</code> → mid aur uske left ke saare elements chhote hain (sorted!) → <code>lo = mid + 1</code>.',
              '<code>nums[mid] &gt; target</code> → mid aur right ke saare bade → <code>hi = mid − 1</code>.',
              'Loop <code>lo &lt;= hi</code> tak — lo == hi pe bhi ek element bacha hai, use check karna hai.',
              'lo &gt; hi → search space khaali → −1.',
            ] },
            { p: '<b>Recursive:</b> same logic, lekin range function ke parameters me. Har call ek frame → O(log n) stack space.' },
            { tip: '<b>mid + 1 / mid − 1 kyun?</b> mid already check ho chuka — use dobara range me rakhne ki zaroorat nahi. Isi se range har baar strictly chhoti hoti hai.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: nums = [-1, 0, 3, 5, 9, 12]',
          blocks: [
            { p: '<b>target = 9</b> (Example 1):' },
            { table: { head: ['Step', 'lo', 'hi', 'mid', 'nums[mid]', 'Decision'], rows: [
              ['1', '0', '5', '2', '3', '3 &lt; 9 → lo = 3'],
              ['2', '3', '5', '4', '9', '9 == 9 → <b>return 4</b>'],
            ] } },
            { p: '<b>target = 2</b> (Example 2 — nahi milega):' },
            { table: { head: ['Step', 'lo', 'hi', 'mid', 'nums[mid]', 'Decision'], rows: [
              ['1', '0', '5', '2', '3', '3 &gt; 2 → hi = 1'],
              ['2', '0', '1', '0', '-1', '-1 &lt; 2 → lo = 1'],
              ['3', '1', '1', '1', '0', '0 &lt; 2 → lo = 2'],
              ['4', '2', '1', '—', '—', 'lo &gt; hi → <b>return -1</b>'],
            ] } },
            { p: 'Dhyan do step 3: lo == hi == 1 tha, phir bhi check kiya — isliye <code>&lt;=</code>.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — linear</b>' },
            { code: `class Solution {
    public int search(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) return i;
        }
        return -1;
    }
}` },
            { p: '<b>Optimal — iterative binary search</b>' },
            { code: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}` },
            { lines: [
              ['int lo = 0, hi = nums.length - 1;', 'Closed range [lo, hi] = poora array.'],
              ['while (lo <= hi)', 'Jab tak range me kam se kam 1 element hai.'],
              ['int mid = lo + (hi - lo) / 2;', 'Beech ka index, overflow-safe.'],
              ['if (nums[mid] == target) return mid;', 'Mil gaya — turant return.'],
              ['if (nums[mid] < target) lo = mid + 1;', 'mid chhota → left half (mid sahit) phenko.'],
              ['else hi = mid - 1;', 'mid bada → right half (mid sahit) phenko.'],
              ['return -1;', 'Range khaali ho gayi → target nahi hai.'],
            ] },
            { p: '<b>Recursive</b>' },
            { code: `class Solution {
    public int search(int[] nums, int target) {
        return bs(nums, target, 0, nums.length - 1);
    }

    private int bs(int[] nums, int target, int lo, int hi) {
        if (lo > hi) return -1;
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) return bs(nums, target, mid + 1, hi);
        return bs(nums, target, lo, mid - 1);
    }
}` },
            { tip: 'Recursive version <b>tail recursive</b> hai, lekin Java tail-call optimize nahi karta — har call stack frame leti hai (O(log n), toh safe).' },
          ],
        },
        {
          title: 'Part 6 — Visualize: code line-by-line chalao',
          blocks: [
            { list: [
              '<b>Grey (skip)</b> cells = phenka hua half — dobara kabhi nahi dekhenge.',
              '<b>lo / mid / hi</b> pointers neeche dikhte hain — har step pe range kaise sikudti hai dekho.',
              'Example 2 me lo, hi ko cross karta hai — wahi "nahi mila" ka moment hai.',
              'Upar <b>Recursive</b> tab dabao — CALL STACK me har <code>bs(lo, hi)</code> frame dikhega.',
            ] },
            { viz: 704, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[5], 5</code>', '<code>0</code>', 'Single element, lo == hi == mid == 0'],
              ['<code>[5], -5</code>', '<code>-1</code>', 'Ek check ke baad hi = -1 → loop khatam'],
              ['<code>[1,3], 3</code>', '<code>1</code>', 'mid = 0 (lower mid), phir lo = 1'],
              ['<code>[1,3], 2</code>', '<code>-1</code>', 'Do elements ke beech ka missing value'],
              ['<code>[-9999,0,9999], 9999</code>', '<code>2</code>', 'Last element'],
            ] } },
            { p: 'Galti jo log karte hain: <code>while (lo &lt; hi)</code> likh dena — tab <code>[5], 5</code> pe loop chalega hi nahi aur −1 aa jaayega.' },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Extra space', 'Main idea'], rows: [
              ['Brute', 'O(n)', 'O(1)', 'Har element check'],
              ['Iterative BS', 'O(log n)', 'O(1)', 'Har step range aadhi'],
              ['Recursive BS', 'O(log n)', 'O(log n)', 'Har level ek stack frame'],
            ] } },
            { p: 'log n kyun? k steps ke baad n / 2ᵏ elements bachte hain. n / 2ᵏ = 1 → k = log₂ n.' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { p: 'Pehle khud jawab socho, phir click karke check karo.' },
            { qa: [
              ['Binary search ki basic shart kya hai?', 'Search space <b>sorted / monotonic</b> hona chahiye — mid dekh ke pata chale ki answer kis side hai.'],
              ['<code>(lo + hi) / 2</code> me problem kya hai?', 'lo + hi int range (2³¹ − 1) cross kar sakta hai → negative mid. <code>lo + (hi − lo) / 2</code> safe hai.'],
              ['Loop <code>lo &lt;= hi</code> kyun, <code>lo &lt; hi</code> kyun nahi?', 'Closed range me lo == hi pe bhi ek element bacha hai jo check karna hai. &lt; likha toh woh miss.'],
              ['<code>lo = mid</code> kyun nahi likhte yahan?', 'mid already check ho chuka; lo = mid se range chhoti nahi hogi (2 elements pe) → infinite loop.'],
              ['10⁹ elements me maximum kitne comparisons?', 'Lagbhag 30 (2³⁰ ≈ 10⁹).'],
              ['Recursive ki space O(log n) kyun?', 'Har recursive call ek stack frame, depth = log n.'],
              ['Array me duplicates ho toh ye code kaunsa index dega?', 'Koi bhi matching index — first/last ki guarantee nahi. First chahiye toh lower bound (kal ka topic).'],
              ['Java me built-in kya hai?', '<code>Arrays.binarySearch(arr, key)</code> — mila toh index, warna <code>-(insertionPoint) − 1</code>.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo (Brute → Optimal)', 'A linear scan works in O(n), but it ignores the fact that the array is sorted. With binary search I keep a closed range lo to hi. I look at the middle element: if it equals the target I return its index; if it is smaller, the target can only be on the right, so I move lo to mid + 1; if it is larger, I move hi to mid − 1. Each step halves the range, so it is O(log n) time and O(1) space. I compute mid as lo + (hi − lo) / 2 to avoid integer overflow.'],
              ['Follow-up: "Recursive vs iterative?"', 'Both are O(log n) time. The recursive version passes lo and hi as parameters and uses O(log n) stack space, because Java does not optimize tail calls. The iterative version uses O(1) space and has no risk of stack overflow, so I prefer it in production, but the recursive one is a nice way to show the divide and conquer structure.'],
              ['Follow-up: "Agar array me duplicates ho aur first occurrence chahiye?"', 'Then I do not stop at the first match. When nums[mid] is greater than or equal to the target, I keep mid as a candidate and continue searching left. This is the lower bound pattern, and it still runs in O(log n).'],
              ['1-minute: Binary search kyun O(log n)', 'Every comparison removes half of the remaining candidates. After k comparisons there are n divided by two to the power k elements left, and the search ends when only one is left, so k is log base two of n. For a million elements that is about twenty comparisons, compared to a million for a linear scan.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Paper pe <code>[-1, 0, 3, 5, 9, 12]</code> likho, index neeche. target 9 aur 2 ke liye lo / mid / hi har step pe likho (Part 4 jaisa table).',
              'Brute code bina notes ke likho aur submit karo.',
              'Iterative binary search <b>bina dekhe</b> likho — 7 lines hi hain. Submit karo.',
              'Visualizer me dono examples chalao; har step pe "kaunsa half phenka aur kyun" bolo.',
              'Concept: "lo &lt;= hi kyun" apne shabdon me Sohel ko samjhao.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Iterative + recursive dono memory se, 8 minute me. Submit.',
              '<b>Task B:</b> Overflow example banao (lo, hi values) jahan <code>(lo + hi) / 2</code> fail ho — interviewer ko dikhane layak.',
              '<b>Task C:</b> Part 10 ka approach answer 90 sec me bolke record karo.',
              '<b>Task D:</b> Follow-up socho: array bahut bada hai aur size pata nahi (sirf <code>get(i)</code> API) — hi kaise choose karoge? (Hint: 1, 2, 4, 8 … doubling.)',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { p: '<b>Dono:</b>' },
            { list: [
              'LC 704 iterative se Accepted (Sohel: recursive bhi).',
              'Fundamentals tab ka "lo &lt;= hi vs lo &lt; hi" table padho.',
              'Kal (Day 2): Lower bound — LC 35 problem pehle se padh lo aur socho "nahi mila toh kahan insert?"',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[2, 4, 6, 8, 10]</code>, target 8 — pehla mid kya hoga?', 'mid = 0 + (4 − 0) / 2 = 2 → nums[2] = 6 &lt; 8 → lo = 3.'],
              ['Loop condition aur updates likho (Template A).', '<code>while (lo &lt;= hi)</code>, <code>lo = mid + 1</code>, <code>hi = mid − 1</code>.'],
              ['Target nahi mila — loop ke baad lo aur hi ka relation?', 'lo = hi + 1 (lo ne hi ko cross kiya).'],
              ['Iterative vs recursive space?', 'O(1) vs O(log n).'],
              ['Overflow-safe mid ke do tarike?', '<code>lo + (hi − lo) / 2</code> aur <code>(lo + hi) &gt;&gt;&gt; 1</code>.'],
            ] },
          ],
        },
      ],
      checks: [
        'Binary search O(log n) kyun hai — apne shabdon me samjha sakta/sakti hu',
        'Overflow-safe mid likhna aur kyun — pata hai',
        'Iterative code bina dekhe likha aur Accepted hua',
        'Example 1 aur 2 ka dry-run table khud banaya',
        'Recursive version likha / samjha (Sohel: must · Sohvi: optional)',
        'Visualizer me dono examples + Recursive tab dekha',
        '8 chhote interview sawaalon ke jawab bina dekhe diye',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Sorted → mid dekho, aadha phenko. Closed range: lo <= hi, mid + 1 / mid − 1. mid = lo + (hi − lo) / 2.',
    },

    // =====================================================================
    2: {
      title: 'Lower Bound — Search Insert Position',
      goal: '<b>Lower bound</b> (pehla index jahan <code>nums[i] &gt;= target</code>) samajhna, <b>Template B</b> (<code>lo &lt; hi</code>, <code>hi = mid</code>) likhna, aur LC 35 solve karna. Saath me LC 704 ko isi template se dobara socho.',
      main: 35,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            { p: 'Kal ka binary search + Phase 1/2 ke "sorted array" wale questions.' },
            ...rev('LC 704 — Binary Search (kal)',
              'Sorted unique array me target ka index, warna −1.',
              '[-1, 0, 3, 5, 9, 12], t = 9\nlo=0 hi=5 mid=2 (3 < 9) → lo=3\nlo=3 hi=5 mid=4 (9)     → return 4',
              'Classic Binary Search (Template A)',
              ['Closed range [lo, hi], loop lo &lt;= hi.', 'mid == target → return.', 'Chhota → lo = mid + 1, bada → hi = mid − 1.'],
              `int lo = 0, hi = nums.length - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;`,
              'Mila toh ruk jao, nahi mila toh aadha phenko.'),
            ...rev('LC 283 — Move Zeroes',
              'Saare 0 end me bhejo, baaki ka order same, in-place.',
              '[0, 1, 0, 3, 12]\nk=0: 1 → nums[0], 3 → nums[1], 12 → nums[2]\nphir k..end = 0 → [1, 3, 12, 0, 0]',
              'Two pointers (same direction: read i, write k)',
              ['i har element padhta hai.', 'Non-zero mila → nums[k++] = nums[i].', 'End me k se aage sab 0.'],
              `int k = 0;
for (int x : nums) if (x != 0) nums[k++] = x;
while (k < nums.length) nums[k++] = 0;`,
              'Read pointer daudta hai, write pointer sirf kaam ki cheez pe aage badhta hai.'),
          ],
        },
        {
          title: 'Part 1 — Concept: F F F T T T aur pehla T',
          blocks: [
            { p: 'Har index pe ek condition socho: <code>nums[i] &gt;= target</code>. Sorted array me ye <b>pehle false, phir true</b> hogi — kabhi wapas false nahi.' },
            { pre: 'nums   = [1, 3, 5, 6]     target = 2\ncond   = [F, T, T, T]\n             ^ pehla T = index 1  →  2 ko yahan insert karo\n\ntarget = 7 → cond = [F, F, F, F] → koi T nahi → answer = n = 4 (end)' },
            { p: 'Isi "pehla T" ko <b>lower bound</b> kehte hain. Template B:' },
            { table: { head: ['', 'Template A (kal)', 'Template B (aaj)'], rows: [
              ['hi ka start', '<code>n − 1</code>', '<code>n</code> (end bhi valid answer)'],
              ['Loop', '<code>lo &lt;= hi</code>', '<code>lo &lt; hi</code>'],
              ['mid T (>= target)', '<code>hi = mid − 1</code>', '<code>hi = mid</code> (mid khud answer ho sakta hai)'],
              ['mid F (< target)', '<code>lo = mid + 1</code>', '<code>lo = mid + 1</code>'],
              ['Answer', 'loop ke andar return', 'loop ke baad <code>lo</code> (== hi)'],
            ] } },
            { tip: '<b>hi = mid</b> ke saath <b>lo &lt; hi</b> zaroori — lo == hi pe mid == lo == hi, aur hi = mid kuch nahi badlega → infinite loop.' },
            { p: '<b>Upper bound</b> (pehla &gt; target) = sirf condition <code>nums[mid] &lt;= target</code> → lo = mid + 1. Count of target = upper − lower.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 35 Search Insert Position',
          blocks: [{ problem: 35 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute:</b> left se chalo, pehla element jo <code>&gt;= target</code> ho — wahi index. Koi nahi → n. O(n).' },
            { p: '<b>Optimal:</b> Brute exactly "pehla T" dhoondh raha hai — binary search se O(log n) me:' },
            { olist: [
              'Range [0, n) — hi = n kyunki "end me insert" bhi possible answer hai.',
              'mid F (<code>nums[mid] &lt; target</code>) → mid aur uske left sab F → <code>lo = mid + 1</code>.',
              'mid T → answer mid ya uske left me → <code>hi = mid</code> (mid ko phenk nahi sakte).',
              'lo == hi → woh pehla T hai → return lo.',
            ] },
            { p: '<b>Template A se bhi ho sakta hai:</b> LC 704 wala code, aur loop ke baad <code>return lo</code> (−1 ki jagah). Kyunki loop khatam hone pe lo hamesha pehle bade element pe hota hai. Interview me dono bata sakte ho.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: nums = [1, 3, 5, 6]',
          blocks: [
            { p: '<b>target = 5</b> → expected 2' },
            { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'nums[mid] < 5?', 'Update'], rows: [
              ['0', '4', '2', '5', 'No (T)', 'hi = 2'],
              ['0', '2', '1', '3', 'Yes (F)', 'lo = 2'],
              ['2', '2', '—', '—', 'lo == hi', '<b>return 2</b>'],
            ] } },
            { p: '<b>target = 2</b> → expected 1' },
            { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'nums[mid] < 2?', 'Update'], rows: [
              ['0', '4', '2', '5', 'No', 'hi = 2'],
              ['0', '2', '1', '3', 'No', 'hi = 1'],
              ['0', '1', '0', '1', 'Yes', 'lo = 1'],
              ['1', '1', '—', '—', 'lo == hi', '<b>return 1</b>'],
            ] } },
            { p: '<b>target = 7</b> → expected 4' },
            { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'nums[mid] < 7?', 'Update'], rows: [
              ['0', '4', '2', '5', 'Yes', 'lo = 3'],
              ['3', '4', '3', '6', 'Yes', 'lo = 4'],
              ['4', '4', '—', '—', 'lo == hi', '<b>return 4</b>'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' },
            { code: `class Solution {
    public int searchInsert(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] >= target) return i;
        }
        return nums.length;
    }
}` },
            { p: '<b>Optimal — lower bound</b>' },
            { code: `class Solution {
    public int searchInsert(int[] nums, int target) {
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}` },
            { lines: [
              ['int lo = 0, hi = nums.length;', 'Answer 0..n me kahin bhi ho sakta hai (n = end).'],
              ['while (lo < hi)', 'Jab tak ek se zyada candidate bache hain.'],
              ['int mid = lo + (hi - lo) / 2;', 'Lower mid — mid hamesha &lt; hi, isliye nums[mid] safe hai (index n kabhi access nahi hota).'],
              ['if (nums[mid] < target) lo = mid + 1;', 'mid F → mid answer nahi ho sakta, right jao.'],
              ['else hi = mid;', 'mid T → mid candidate hai, rakh lo; left me aur pehla T dhundo.'],
              ['return lo;', 'lo == hi == pehla T (ya n).'],
            ] },
            { tip: 'Library way: <code>int i = Arrays.binarySearch(nums, target); return i &gt;= 0 ? i : -i - 1;</code> — interview me pehle khud likho, phir ye mention karo.' },
          ],
        },
        {
          title: 'Part 6 — Visualize: code line-by-line chalao',
          blocks: [
            { list: [
              'Array ke end me ek <b>khaali slot (index n)</b> hai — "end me insert" wala answer.',
              'Neeche <b>condition row</b> F/T dikhati hai — dekho lo/hi kaise pehle T pe milte hain.',
              '<code>hi = mid</code> step pe mid grey <b>nahi</b> hota — woh abhi bhi candidate hai.',
              'Example 3 (target 7) chalao — lo seedha n tak jaata hai.',
            ] },
            { viz: 35, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[1,3,5,6], 0</code>', '<code>0</code>', 'Sabse chhota → start me'],
              ['<code>[1,3,5,6], 7</code>', '<code>4</code>', 'Sabse bada → n'],
              ['<code>[1], 1</code>', '<code>0</code>', 'Exact match single'],
              ['<code>[1], 2</code>', '<code>1</code>', 'Single, end me'],
              ['<code>[1], 0</code>', '<code>0</code>', 'Single, start me'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Extra space', 'Main idea'], rows: [
              ['Brute', 'O(n)', 'O(1)', 'Pehla >= target linear'],
              ['Lower bound', 'O(log n)', 'O(1)', 'F F T T me pehla T'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Lower bound ki definition?', 'Pehla index jahan <code>nums[i] &gt;= target</code>. Koi nahi toh n.'],
              ['hi = n kyun, n − 1 kyun nahi?', 'Kyunki answer n bhi ho sakta hai (target sabse bada). hi = n − 1 rakha toh woh case miss.'],
              ['nums[n] access hoga kabhi? (ArrayIndexOutOfBounds)', 'Nahi — loop lo &lt; hi me mid hamesha &lt; hi ≤ n, toh mid ≤ n − 1.'],
              ['hi = mid ke saath lo &lt;= hi likha toh?', 'lo == hi == mid pe hi = mid kuch nahi badlta → infinite loop.'],
              ['Upper bound kaise?', 'Condition <code>nums[mid] &lt;= target</code> → lo = mid + 1, else hi = mid. Pehla &gt; target milta hai.'],
              ['Sorted array me target kitni baar hai — kaise nikaaloge?', 'upperBound − lowerBound, dono O(log n).'],
              ['<code>Arrays.binarySearch</code> nahi mila toh kya deta hai?', '<code>-(insertionPoint) − 1</code>. Insert position = <code>-ret − 1</code>.'],
              ['Template A (lo &lt;= hi) se ye kaise karoge?', 'LC 704 ka code, loop ke baad <code>return lo</code> — lo pehle bade element pe hota hai.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'The insert position is the first index whose value is at least the target, which is the lower bound. If I imagine a boolean array of nums[i] >= target, it looks like false, false, true, true, and I need the first true. I search the half-open range from 0 to n: if nums[mid] is less than the target, mid is false and the answer is to the right, so lo = mid + 1; otherwise mid could be the answer, so hi = mid. When lo equals hi, that is the answer. It is O(log n) time and O(1) space.'],
              ['Follow-up: "Duplicates ho toh first aur last occurrence?"', 'The first occurrence is the lower bound of the target, and the last occurrence is the upper bound minus one, where the upper bound is the first index with a value strictly greater than the target. Both are the same template with one comparison changed, so the whole thing is still O(log n).'],
              ['1-minute: Template A vs Template B', 'Template A uses a closed range and while lo <= hi, and it returns as soon as it finds an exact match. Template B uses while lo < hi with hi = mid, never stops early, and always converges on a boundary. I use A when I need an exact element and B when I need the first or last position where a condition becomes true.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              '<code>[1, 3, 5, 6]</code> ke neeche target = 2 ke liye F/T row likho. Pehla T circle karo.',
              'Brute code likho aur submit karo.',
              'Optimal code dekh ke ek baar likho, phir bina dekhe dobara. Submit.',
              'Target = 7 ka dry-run table khud banao (Part 4 jaisa).',
              'Visualizer me teeno examples chalao.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 35 lower bound + LC 704 dono memory se, 8 min.',
              '<b>Task B:</b> Upper bound function khud likho aur <code>[1,2,2,2,3]</code> pe 2 ka count = 3 nikaalo (paper pe dry run).',
              '<b>Task C:</b> LC 35 ko Template A se bhi likho (loop ke baad return lo) — dono submit.',
              '<b>Task D:</b> Part 10 ka "Template A vs B" 60 sec me bolo.',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 35 Accepted (dono: optimal).',
              'LC 704 ek baar aur bina dekhe (5 min timer).',
              'Kal (Day 3): LC 69 Sqrt(x) — array nahi hai! Socho: binary search kis cheez pe karoge?',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[2, 4, 6, 8]</code>, target 5 → answer?', '2 (pehla &gt;= 5 = 6 at index 2).'],
              ['Lower bound ke 3 important lines?', '<code>hi = n</code>, <code>while (lo &lt; hi)</code>, <code>else hi = mid</code>.'],
              ['Loop ke baad lo aur hi?', 'Barabar — dono answer.'],
              ['Infinite loop kab aata hai?', 'hi = mid + loop lo &lt;= hi, ya lo = mid + upper mid.'],
              ['Count of target in sorted array?', 'upperBound − lowerBound.'],
            ] },
          ],
        },
      ],
      checks: [
        'F F F T T T picture se lower bound samjha sakta/sakti hu',
        'Template A vs B ka fark (loop, updates, return) bata sakta/sakti hu',
        'LC 35 optimal bina dekhe likha aur Accepted',
        'Teeno examples ka dry run match kiya',
        'Visualizer me insert slot (index n) wala case dekha',
        'Upper bound / count of target socha (Sohel: must)',
        '8 interview sawaal bina dekhe',
        'Self-test 5/5',
      ],
      memory: 'Lower bound = pehla T. hi = n, lo < hi, F → lo = mid + 1, T → hi = mid, return lo.',
    },

    // =====================================================================
    3: {
      title: 'Search Space = Answer Range (Sqrt)',
      goal: 'Samajhna ki binary search ko <b>array ki zaroorat nahi</b> — sirf ek ordered range aur monotonic condition chahiye. LC 69 me answer range <b>0..x</b> pe search, <b>long</b> se overflow bachana.',
      main: 69,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rev('LC 35 — Search Insert Position (kal)',
              'Sorted array me target ka index, nahi toh insert position.',
              '[1, 3, 5, 6], t = 2\ncond = F T T T → pehla T = 1',
              'Lower Bound (Template B)',
              ['hi = n.', 'nums[mid] &lt; target → lo = mid + 1.', 'Warna hi = mid. Return lo.'],
              `int lo = 0, hi = nums.length;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
}
return lo;`,
              'Pehla T dhundo; T mila toh rakh lo (hi = mid).'),
            ...rev('LC 209 — Minimum Size Subarray Sum',
              'Positive array me sabse chhota subarray jiska sum >= target.',
              'target = 7, nums = [2,3,1,2,4,3]\nwindow [4,3] sum 7 → length 2',
              'Variable Sliding Window',
              ['r badhao, sum += nums[r].', 'Jab tak sum >= target: answer update, sum −= nums[l++].', 'Positive numbers → shrink karne se sum ghatta hai (monotonic).'],
              `int l = 0, sum = 0, best = Integer.MAX_VALUE;
for (int r = 0; r < nums.length; r++) {
    sum += nums[r];
    while (sum >= target) { best = Math.min(best, r - l + 1); sum -= nums[l++]; }
}
return best == Integer.MAX_VALUE ? 0 : best;`,
              'Expand jab tak valid nahi, shrink jab tak valid hai.'),
          ],
        },
        {
          title: 'Part 1 — Concept: answer ki range pe binary search',
          blocks: [
            { p: 'Binary search ko asli me chahiye: <b>(1) ek ordered range</b> of candidates, <b>(2) ek condition</b> jo range me <b>T T T F F F</b> (ya ulta) pattern banaye.' },
            { pre: 'x = 8, candidates = 0 1 2 3 4 5 6 7 8\nmid*mid <= 8 ?     T T T F F F F F F\n                        ^ aakhri T = 2 = floor(√8)\n\nArray nahi hai — range khud hi "virtual sorted array" hai.' },
            { p: 'Yahan humein <b>aakhri T</b> chahiye (floor). Iske liye ek clean tarika — <b>ans variable</b>:' },
            { code: `int lo = 0, hi = x, ans = 0;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (ok(mid)) { ans = mid; lo = mid + 1; }   // T: candidate save, aur bada try
    else hi = mid - 1;                          // F: chhota chahiye
}
return ans;` },
            { tip: '<b>Overflow:</b> x ≤ 2³¹ − 1, toh mid ~ 10⁹ ho sakta hai aur mid × mid ~ 10¹⁸ — int me overflow. <code>(long) mid * mid</code> likho (cast pehle, multiply baad me).' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 69 Sqrt(x)',
          blocks: [{ problem: 69 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute:</b> i = 0, 1, 2 … tab tak badhao jab tak (i+1)² ≤ x. Answer i. O(√x) — x = 2³¹ − 1 pe ~46,000 steps (chal jaayega, lekin interviewer log x maangega).' },
            { p: '<b>Optimal:</b> squares <b>monotonic</b> badhte hain → range [0, x] pe binary search.' },
            { olist: [
              'lo = 0, hi = x, ans = 0.',
              'mid² ≤ x → mid valid hai, shayad bada bhi ho → ans = mid, lo = mid + 1.',
              'mid² &gt; x → mid bahut bada → hi = mid − 1.',
              'Loop khatam → ans = aakhri valid mid.',
            ] },
            { p: '<b>Chhota optimization:</b> x ≥ 2 ke liye √x ≤ x / 2, toh hi = x / 2 bhi chalega. Zaroori nahi — log factor me fark negligible.' },
          ],
        },
        {
          title: 'Part 4 — Dry run',
          blocks: [
            { p: '<b>x = 8</b> → expected 2' },
            { table: { head: ['lo', 'hi', 'mid', 'mid²', 'mid² ≤ 8?', 'Update', 'ans'], rows: [
              ['0', '8', '4', '16', 'No', 'hi = 3', '0'],
              ['0', '3', '1', '1', 'Yes', 'lo = 2', '1'],
              ['2', '3', '2', '4', 'Yes', 'lo = 3', '2'],
              ['3', '3', '3', '9', 'No', 'hi = 2', '2'],
              ['3', '2', '—', '—', 'lo &gt; hi', 'stop', '<b>2</b>'],
            ] } },
            { p: '<b>x = 4</b> → expected 2' },
            { table: { head: ['lo', 'hi', 'mid', 'mid²', 'mid² ≤ 4?', 'Update', 'ans'], rows: [
              ['0', '4', '2', '4', 'Yes', 'lo = 3', '2'],
              ['3', '4', '3', '9', 'No', 'hi = 2', '2'],
              ['3', '2', '—', '—', 'stop', '', '<b>2</b>'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — O(√x)</b>' },
            { code: `class Solution {
    public int mySqrt(int x) {
        long i = 0;
        while ((i + 1) * (i + 1) <= x) {
            i++;
        }
        return (int) i;
    }
}` },
            { p: '<b>Optimal — binary search on answer</b>' },
            { code: `class Solution {
    public int mySqrt(int x) {
        int lo = 0, hi = x, ans = 0;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if ((long) mid * mid <= x) {
                ans = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return ans;
    }
}` },
            { lines: [
              ['int lo = 0, hi = x, ans = 0;', 'Answer 0..x me hai. ans = ab tak ka best valid.'],
              ['int mid = lo + (hi - lo) / 2;', 'lo + hi = 2·10⁹+ ho sakta hai → safe formula zaroori.'],
              ['(long) mid * mid <= x', 'Cast pehle → multiplication long me. <code>(long)(mid * mid)</code> galat hai (overflow pehle ho chuka).'],
              ['ans = mid; lo = mid + 1;', 'Valid → save, aur bada try karo.'],
              ['hi = mid - 1;', 'Invalid → chhota chahiye.'],
              ['return ans;', 'Aakhri valid mid = floor(√x).'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize: code line-by-line chalao',
          blocks: [
            { list: [
              'Array me <b>nums nahi, candidates 0..x</b> hain — yahi "search space" hai.',
              'Har mid pe check text me <code>mid² ≤ x</code> dekho.',
              '<code>ans</code> VARIABLES me tab hi badalta hai jab check true ho.',
              'Apna input daalo: x = 0, 1, 15, 16.',
            ] },
            { viz: 69, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['x', 'Output', 'Kyun'], rows: [
              ['0', '0', 'lo = hi = 0, 0² ≤ 0'],
              ['1', '1', '1² = 1'],
              ['2, 3', '1', '2² = 4 &gt; 3'],
              ['15 / 16', '3 / 4', 'Perfect square boundary'],
              ['2147395599', '46339', '46340² = 2147395600 &gt; x'],
              ['2147483647', '46340', 'Max int — long cast ke bina overflow'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute', 'O(√x)', 'O(1)'],
              ['Binary search', 'O(log x)', 'O(1)'],
            ] } },
            { p: 'x = 2³¹ − 1 → binary search ~31 iterations.' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Yahan sorted array kahan hai?', 'Koi nahi — candidates 0..x khud ek sorted range hain, aur mid² ≤ x monotonic hai.'],
              ['ans variable kyun rakha?', 'Humein aakhri T chahiye; jab bhi T mile save karo, loop ke end pe last saved = answer.'],
              ['<code>(long)(mid * mid)</code> aur <code>(long) mid * mid</code> me fark?', 'Pehle me int multiplication pehle hota hai (overflow), phir cast. Doosre me mid pehle long banta hai.'],
              ['mid² ki jagah <code>mid &lt;= x / mid</code> likh sakte ho?', 'Haan (mid &gt; 0 ke liye) — division se overflow nahi hota. mid = 0 ka dhyan rakhna.'],
              ['hi = x ki jagah x / 2?', 'x ≥ 2 ke liye chalega; x = 1 pe hi = 0 → answer 0 galat. Isliye simple hi = x rakho.'],
              ['Template B (lo &lt; hi) se kaise?', 'Pehla F dhundo (mid² &gt; x) aur usse 1 kam return karo; ya upper mid use karo. ans variable zyada simple.'],
              ['Newton method suna hai?', 'Haan — r = (r + x / r) / 2 tez converge karta hai. Lekin interview me binary search expected hai.'],
              ['Time complexity?', 'O(log x) — x pe, n pe nahi.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'The answer is the largest integer whose square does not exceed x. Squares grow monotonically, so over the range 0 to x the condition mid squared <= x is true for a prefix and false afterwards. I binary search that range: when the condition holds I save mid as the answer and move right, otherwise I move left. I cast to long before multiplying because mid can be around 46 thousand or more and its square would overflow an int. It runs in O(log x) time and O(1) space.'],
              ['Follow-up: "Binary search on answer ka matlab?"', 'It means the search space is the set of possible answers instead of array indices. As long as I can check a candidate quickly and the check is monotonic across the range, I can binary search for the boundary. Square root is the simplest example; next we will use the same idea for minimum speed and minimum capacity problems.'],
              ['1-minute: Overflow bugs in binary search', 'There are two common ones. First, computing mid as lo + hi over two can overflow when both are large, so I use lo + (hi − lo) / 2. Second, the check itself can overflow, like mid times mid or a running sum, so I compute it in long. I always look at the constraints to see how large values can get.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Number line 0..8 draw karo, har number ke neeche T/F (mid² ≤ 8). Aakhri T circle karo.',
              'Brute code likho, submit (long ka dhyan).',
              'Optimal code dekh ke samjho, phir bina dekhe likho. Submit.',
              'x = 8 ka dry-run table banao, visualizer se match karo.',
              'Sohel ko samjhao: "yahan array kyun nahi chahiye?"',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 69 optimal memory se, 6 min. Phir <code>mid &lt;= x / mid</code> wala version bhi.',
              '<b>Task B:</b> Edge cases table (Part 7) ke saare inputs pe mentally run karo — especially 2147483647.',
              '<b>Task C:</b> LC 35 + LC 704 timer ke saath (dono 5 min me).',
              '<b>Task D:</b> Follow-up: "Precision ke saath sqrt (double, 6 decimal)" — binary search ko doubles pe kaise chalaoge? (100 iterations ya hi − lo &lt; 1e-7.)',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 69 Accepted.',
              'Fundamentals tab ka "Binary Search on Answer template" padho — next week ka base.',
              'Kal (Day 4): LC 153 — rotated array. Socho: rotated array sorted nahi hai, phir bhi binary search kaise?',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['x = 15 → answer?', '3 (4² = 16 &gt; 15).'],
              ['Search space kya hai?', 'Integers 0..x.'],
              ['Overflow kahan ho sakta hai?', 'mid × mid aur (lo + hi). Long cast + safe mid.'],
              ['T pe kya update?', 'ans = mid, lo = mid + 1.'],
              ['Time complexity?', 'O(log x).'],
            ] },
          ],
        },
      ],
      checks: [
        'Samjha ki binary search ko array nahi, monotonic condition chahiye',
        'ans variable wala template likh sakta/sakti hu',
        'Long cast kyun aur kahan — pata hai',
        'LC 69 bina dekhe Accepted',
        'x = 8 dry run khud banaya',
        'Visualizer me candidate range dekhi',
        '8 interview sawaal',
        'Self-test 5/5',
      ],
      memory: 'Array nahi toh answer ki range. T pe ans = mid aur aage, F pe peeche. (long) mid * mid.',
    },

    // =====================================================================
    4: {
      title: 'Rotated Array — Find Minimum',
      goal: 'Rotated sorted array ka structure samajhna (ek <b>drop point</b>), aur <code>nums[mid]</code> vs <code>nums[hi]</code> compare karke LC 153 me minimum O(log n) me nikalna.',
      main: 153,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rev('LC 69 — Sqrt(x) (kal)',
              'floor(√x) bina built-in.',
              'x = 8 → mid 4 (16 > 8) hi=3; mid 1 ✓ ans=1; mid 2 ✓ ans=2; mid 3 ✗ → 2',
              'Binary search on answer (floor + ans variable)',
              ['Range 0..x.', '(long) mid * mid ≤ x → ans = mid, lo = mid + 1.', 'Warna hi = mid − 1.'],
              `int lo = 0, hi = x, ans = 0;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if ((long) mid * mid <= x) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
}
return ans;`,
              'Aakhri T chahiye → T pe save karke aage.'),
            ...rev('LC 206 — Reverse Linked List',
              'Singly linked list ko reverse karo.',
              '1 → 2 → 3 → null\nprev=null cur=1 → 1.next=null, prev=1, cur=2 …\nresult: 3 → 2 → 1 → null',
              'Linked list pointer reversal (prev / cur / next)',
              ['next = cur.next save karo.', 'cur.next = prev (link ulta).', 'prev = cur, cur = next.'],
              `ListNode prev = null, cur = head;
while (cur != null) {
    ListNode next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
}
return prev;`,
              'Save next, palat do, aage badho.'),
            ...rev('LC 20 — Valid Parentheses',
              '()[]{} ka string valid hai?',
              '"([)]" → push ( push [ ; ) aaya, top [ → mismatch → false',
              'Stack',
              ['Opening → push.', 'Closing → top matching hona chahiye, pop.', 'End me stack khaali.'],
              `Deque<Character> st = new ArrayDeque<>();
for (char c : s.toCharArray()) {
    if (c == '(') st.push(')'); else if (c == '[') st.push(']'); else if (c == '{') st.push('}');
    else if (st.isEmpty() || st.pop() != c) return false;
}
return st.isEmpty();`,
              'Opening pe uska closing push karo — match easy.'),
          ],
        },
        {
          title: 'Part 1 — Concept: rotated sorted array ka structure',
          blocks: [
            { p: 'Sorted <code>[0,1,2,4,5,6,7]</code> ko 4 baar rotate kiya → <code>[4,5,6,7,0,1,2]</code>. Ye do sorted pieces hain, beech me ek <b>drop</b> (7 → 0). Minimum = drop ke turant baad.' },
            { pre: 'value\n  7 |          *\n  6 |       *\n  5 |    *\n  4 | *\n  2 |                         *\n  1 |                      *\n  0 |                   *   ← minimum (drop ke baad)\n      0  1  2  3    4  5  6   index\n      [left part]   [right part]  — right part ke saare &lt; left part ke saare' },
            { p: '<b>Key observation:</b> <code>nums[hi]</code> hamesha right part me hai (ya array rotate hi nahi hua). Toh:' },
            { table: { head: ['Condition', 'Matlab', 'Update'], rows: [
              ['<code>nums[mid] &gt; nums[hi]</code>', 'mid left (bade) part me hai → drop mid ke right me', '<code>lo = mid + 1</code>'],
              ['<code>nums[mid] &lt;= nums[hi]</code>', 'mid..hi sorted → min mid ya uske left me', '<code>hi = mid</code>'],
            ] } },
            { tip: 'Ye bhi F F F T T T pattern hai! Condition <code>nums[i] &lt;= nums[n−1]</code>: left part F, right part T. Minimum = pehla T = lower bound template.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 153 Find Minimum in Rotated Sorted Array',
          blocks: [{ problem: 153 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute:</b> poora scan, min nikaalo — O(n). Problem O(log n) maangta hai.' },
            { p: '<b>Better idea (galat raasta):</b> drop dhundo jahan <code>nums[i] &gt; nums[i+1]</code> — ye bhi linear hai.' },
            { p: '<b>Optimal:</b> mid ko <b>hi</b> se compare karo (Part 1 table). Template B: <code>while (lo &lt; hi)</code>, <code>hi = mid</code> (mid khud min ho sakta hai).' },
            { olist: [
              'lo = 0, hi = n − 1.',
              'nums[mid] &gt; nums[hi] → lo = mid + 1 (mid min nahi ho sakta, uske right me koi chhota hai).',
              'Warna hi = mid.',
              'lo == hi → nums[lo] = min.',
            ] },
            { p: '<b>nums[lo] se compare kyun nahi?</b> <code>nums[lo] &lt; nums[mid]</code> do situations me sach hai: array rotate nahi hua (min = lo) ya drop mid ke right me (min right me). Ambiguous! nums[hi] wala comparison hamesha clear hai.' },
          ],
        },
        {
          title: 'Part 4 — Dry run',
          blocks: [
            { p: '<b>[4, 5, 6, 7, 0, 1, 2]</b> → expected 0' },
            { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'nums[hi]', 'Decision'], rows: [
              ['0', '6', '3', '7', '2', '7 &gt; 2 → lo = 4'],
              ['4', '6', '5', '1', '2', '1 ≤ 2 → hi = 5'],
              ['4', '5', '4', '0', '1', '0 ≤ 1 → hi = 4'],
              ['4', '4', '—', '—', '—', '<b>return nums[4] = 0</b>'],
            ] } },
            { p: '<b>[3, 4, 5, 1, 2]</b> → expected 1' },
            { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'nums[hi]', 'Decision'], rows: [
              ['0', '4', '2', '5', '2', '5 &gt; 2 → lo = 3'],
              ['3', '4', '3', '1', '2', '1 ≤ 2 → hi = 3'],
              ['3', '3', '—', '—', '—', '<b>return 1</b>'],
            ] } },
            { p: '<b>[11, 13, 15, 17]</b> (rotate nahi hua) → mid=1 (13 ≤ 17) hi=1; mid=0 (11 ≤ 13) hi=0 → <b>11</b>.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' },
            { code: `class Solution {
    public int findMin(int[] nums) {
        int min = nums[0];
        for (int x : nums) {
            min = Math.min(min, x);
        }
        return min;
    }
}` },
            { p: '<b>Optimal</b>' },
            { code: `class Solution {
    public int findMin(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) lo = mid + 1;
            else hi = mid;
        }
        return nums[lo];
    }
}` },
            { lines: [
              ['int lo = 0, hi = nums.length - 1;', 'Min pakka array ke andar → closed range.'],
              ['while (lo < hi)', 'hi = mid use kar rahe → lo &lt; hi zaroori.'],
              ['if (nums[mid] > nums[hi]) lo = mid + 1;', 'mid bade part me → drop right me → mid phenko.'],
              ['else hi = mid;', 'mid..hi sorted → min mid ya left me; mid rakhna hai.'],
              ['return nums[lo];', 'lo == hi = minimum ka index (yahi pivot bhi hai).'],
            ] },
            { tip: 'Ye loop <b>pivot index</b> bhi deta hai — Day 11 me LC 33 ke doosre approach me reuse karenge.' },
          ],
        },
        {
          title: 'Part 6 — Visualize: code line-by-line chalao',
          blocks: [
            { list: [
              'nums[hi] ko alag colour (new) me dekho — har mid usi se compare hota hai.',
              'lo = mid + 1 pe left part grey ho jaata hai; hi = mid pe mid range me rehta hai.',
              'Example 3 (not rotated) chalao — hi seedha 0 pe aata hai.',
            ] },
            { viz: 153, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[1]</code>', '1', 'Loop chalega hi nahi'],
              ['<code>[2,1]</code>', '1', 'mid=0: 2 &gt; 1 → lo = 1'],
              ['<code>[1,2]</code>', '1', 'mid=0: 1 ≤ 2 → hi = 0'],
              ['<code>[11,13,15,17]</code>', '11', 'Not rotated (n baar rotate)'],
              ['<code>[5,1,2,3,4]</code>', '1', 'Drop index 1 pe'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute', 'O(n)', 'O(1)'],
              ['Binary search (mid vs hi)', 'O(log n)', 'O(1)'],
            ] } },
            { p: 'Note: duplicates allowed hote toh (<code>nums[mid] == nums[hi]</code> pe hi−−) worst case O(n) ho jaata — is question me unique hain.' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Rotated array me binary search kyun possible hai?', 'Condition "nums[i] ≤ nums[n−1]" left part me F aur right part me T hai — monotonic.'],
              ['nums[hi] se compare kyun, nums[lo] se kyun nahi?', 'nums[lo] &lt; nums[mid] ambiguous hai (not rotated vs drop right me). nums[hi] hamesha clear batata hai.'],
              ['hi = mid − 1 kyun nahi?', 'mid khud minimum ho sakta hai (jaise nums[mid] = 0).'],
              ['Loop lo &lt;= hi kyun nahi?', 'hi = mid ke saath lo == hi pe infinite loop.'],
              ['Array rotate na hua ho toh?', 'Har baar nums[mid] ≤ nums[hi] → hi sikudta hai → index 0.'],
              ['Final lo kya represent karta hai?', 'Minimum ka index = rotation count = pivot.'],
              ['nums[mid] == nums[hi] kab hoga?', 'Sirf mid == hi pe (unique values) — lo &lt; hi me mid &lt; hi, toh kabhi nahi.'],
              ['Kitni baar rotate hua — kaise nikaaloge?', 'Wahi lo (min ka index).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'A rotated sorted array is two sorted runs, and the minimum is the first element of the second run. I compare nums[mid] with nums[hi]. If nums[mid] is greater, mid is in the first, larger run, so the minimum is strictly to the right and I set lo = mid + 1. Otherwise mid to hi is sorted, so the minimum is at mid or to its left, and I set hi = mid. When lo meets hi, that index holds the minimum. This is O(log n) time and O(1) space.'],
              ['Follow-up: "Duplicates allowed ho toh?"', 'With duplicates, nums[mid] can equal nums[hi], and then I cannot tell which side the drop is on. The safe move is hi minus one, because even if nums[hi] is the minimum, nums[mid] has the same value. This keeps correctness but the worst case becomes O(n), for example when all elements are equal.'],
              ['1-minute: Kaunsa template aur kyun', 'I use the boundary template with while lo < hi and hi = mid, because the minimum could be at mid itself and I must not discard it. Since mid is the lower middle, lo = mid + 1 always makes progress, and the range shrinks every iteration.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              '<code>[4,5,6,7,0,1,2]</code> ka graph draw karo (Part 1 jaisa) — drop mark karo.',
              'Har index ke neeche T/F likho: nums[i] ≤ nums[6]? Pehla T = min.',
              'Brute submit, phir optimal bina dekhe likhne ki koshish.',
              'Dry run table [3,4,5,1,2] ke liye banao.',
              'Visualizer me teeno examples.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 153 memory se 5 min.',
              '<b>Task B:</b> Interviewer ko "nums[lo] se compare kyun nahi" ka counter-example do: <code>[1,2,3,4,5]</code> vs <code>[3,4,5,1,2]</code>.',
              '<b>Task C:</b> Duplicates wala follow-up (hi−−) code likho aur <code>[2,2,2,0,1]</code> pe dry run.',
              '<b>Task D:</b> LC 69 + LC 35 re-solve (timer 10 min dono).',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 153 Accepted.',
              'Kal (Day 5): LC 33 — rotated array me <b>target</b> search. Socho: mid ke kaunse side sorted hai, ye kaise pata karoge?',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[6,7,1,2,3,4,5]</code> → pehla step?', 'mid = 3 (2), nums[hi] = 5, 2 ≤ 5 → hi = 3.'],
              ['Comparison kisse?', 'nums[mid] vs nums[hi].'],
              ['Template?', 'lo &lt; hi, lo = mid + 1 / hi = mid.'],
              ['Return?', 'nums[lo].'],
              ['Not rotated array ka answer?', 'nums[0].'],
            ] },
          ],
        },
      ],
      checks: [
        'Rotated array ko do sorted runs + drop ke roop me draw kar sakta/sakti hu',
        'nums[mid] vs nums[hi] table yaad hai',
        'nums[lo] se compare kyun ambiguous — samjha sakta/sakti hu',
        'LC 153 optimal Accepted',
        'Dry run [4,5,6,7,0,1,2] match kiya',
        'Visualizer me teeno examples dekhe',
        '8 interview sawaal',
        'Self-test 5/5',
      ],
      memory: 'Min in rotated: mid > hi → lo = mid + 1, warna hi = mid. Return nums[lo].',
    },

    // =====================================================================
    5: {
      title: 'Rotated Array — Search Target',
      goal: 'Rotated array me <b>target</b> O(log n) me dhundna: har step pe pehchano <b>kaunsa half sorted</b> hai, aur target uski range me hai ya nahi. LC 33 (MUST) + LC 153 (PUSH: re-solve).',
      main: 33,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rev('LC 153 — Find Minimum in Rotated Sorted Array (kal)',
              'Rotated sorted array ka minimum.',
              '[4,5,6,7,0,1,2]\nmid=3 (7 > 2) lo=4; mid=5 (1 ≤ 2) hi=5; mid=4 (0 ≤ 1) hi=4 → 0',
              'Rotated array + boundary template',
              ['mid vs hi compare.', 'Bada → lo = mid + 1.', 'Warna hi = mid.'],
              `int lo = 0, hi = nums.length - 1;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
}
return nums[lo];`,
              'Hi se pucho: "tum bade ho ya main?"'),
            ...rev('LC 11 — Container With Most Water',
              'Do lines choose karo jinke beech sabse zyada paani.',
              '[1,8,6,2,5,4,8,3,7]\nl=0 (1), r=8 (7): area 8 → chhoti line (l) aage\n… best = 49 (index 1 aur 8)',
              'Two Pointers (opposite)',
              ['area = min(h[l], h[r]) × (r − l).', 'Chhoti line ko aage badhao — badi ko hilane se area badh nahi sakta.', 'O(n).'],
              `int l = 0, r = h.length - 1, best = 0;
while (l < r) {
    best = Math.max(best, Math.min(h[l], h[r]) * (r - l));
    if (h[l] < h[r]) l++; else r--;
}
return best;`,
              'Chhota dewaar hi bottleneck hai — usi ko badlo.'),
          ],
        },
        {
          title: 'Part 1 — Concept: ek half hamesha sorted',
          blocks: [
            { p: 'Rotated array me kisi bhi mid ke liye, <b>[lo..mid]</b> ya <b>[mid..hi]</b> me se kam se kam ek <b>poora sorted</b> hota hai (drop sirf ek jagah hai).' },
            { pre: '[4, 5, 6, 7, 0, 1, 2]   mid = 3 (7)\n [4  5  6  7]           nums[lo]=4 <= nums[mid]=7  → LEFT sorted\n              [0  1  2]  (drop yahan hai)\n\n[6, 7, 0, 1, 2, 4, 5]   mid = 3 (1)\n [6  7  0  1]            nums[lo]=6 > nums[mid]=1   → LEFT sorted NAHI\n          [1  2  4  5]   → RIGHT sorted' },
            { p: 'Sorted half me range check easy hai: <code>nums[lo] ≤ target &lt; nums[mid]</code>. Agar target wahan hai → us half me jao, warna doosre half me.' },
            { table: { head: ['Sorted half', 'Target range check', 'Haan', 'Nahi'], rows: [
              ['Left (<code>nums[lo] &lt;= nums[mid]</code>)', '<code>nums[lo] &lt;= t &lt; nums[mid]</code>', 'hi = mid − 1', 'lo = mid + 1'],
              ['Right (else)', '<code>nums[mid] &lt; t &lt;= nums[hi]</code>', 'lo = mid + 1', 'hi = mid − 1'],
            ] } },
            { tip: '<code>nums[lo] &lt;= nums[mid]</code> me <b>&lt;=</b> zaroori hai: lo == mid (2 elements bache) pe left half = single element, jo sorted hai.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 33 Search in Rotated Sorted Array',
          blocks: [{ problem: 33 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute:</b> linear scan O(n).' },
            { p: '<b>Better (2 binary searches):</b> LC 153 se pivot (min index) nikaalo. Ab do sorted parts: [0..pivot−1] aur [pivot..n−1]. Target kis part ki range me hai woh dekho, aur usme LC 704. O(log n). (Day 11 me detail.)' },
            { p: '<b>Optimal (1 pass):</b> Template A (exact match) + sorted half check:' },
            { olist: [
              'mid == target → return.',
              'nums[lo] ≤ nums[mid] → left sorted. Target [nums[lo], nums[mid]) me → hi = mid − 1, warna lo = mid + 1.',
              'Warna right sorted. Target (nums[mid], nums[hi]] me → lo = mid + 1, warna hi = mid − 1.',
              'lo &gt; hi → −1.',
            ] },
          ],
        },
        {
          title: 'Part 4 — Dry run: [4, 5, 6, 7, 0, 1, 2]',
          blocks: [
            { p: '<b>target = 0</b> → expected 4' },
            { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'Sorted half', 'Target in?', 'Update'], rows: [
              ['0', '6', '3', '7', 'Left [4..7]', '0 ∈ [4,7)? No', 'lo = 4'],
              ['4', '6', '5', '1', 'Left [0..1] (nums[4]=0 ≤ 1)', '0 ∈ [0,1)? Yes', 'hi = 4'],
              ['4', '4', '4', '0', '—', 'match', '<b>return 4</b>'],
            ] } },
            { p: '<b>target = 3</b> → expected −1' },
            { table: { head: ['lo', 'hi', 'mid', 'nums[mid]', 'Sorted half', 'Target in?', 'Update'], rows: [
              ['0', '6', '3', '7', 'Left [4..7]', 'No', 'lo = 4'],
              ['4', '6', '5', '1', 'Left [0..1]', 'No', 'lo = 6'],
              ['6', '6', '6', '2', 'Left [2]', 'No', 'lo = 7'],
              ['7', '6', '—', '—', '—', 'lo &gt; hi', '<b>return -1</b>'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Optimal — one pass</b>' },
            { code: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {
                if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {
                if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
}` },
            { lines: [
              ['while (lo <= hi)', 'Exact match → Template A.'],
              ['if (nums[mid] == target) return mid;', 'Pehle match check — baaki conditions me mid exclude kar sakte hain.'],
              ['if (nums[lo] <= nums[mid])', 'Left half sorted? (<= taaki lo == mid case sahi ho.)'],
              ['target >= nums[lo] && target < nums[mid]', 'Target left sorted range me → left jao.'],
              ['else lo = mid + 1;', 'Left sorted hai lekin target wahan nahi → right.'],
              ['target > nums[mid] && target <= nums[hi]', 'Right sorted range me → right jao.'],
              ['else hi = mid - 1;', 'Warna left.'],
            ] },
            { p: '<b>LC 153 (PUSH) re-solve:</b> bina dekhe likho — LC 33 ke Better approach ka pehla loop yahi hai.' },
          ],
        },
        {
          title: 'Part 6 — Visualize: code line-by-line chalao',
          blocks: [
            { list: [
              'Sorted half <b>done (green)</b> colour me highlight hota hai — wahi range check hoti hai.',
              'Example 1 me pehle step pe left [4..7] sorted, 0 usme nahi → right.',
              'Upar <b>Pivot + BS</b> tab dabao — Better approach: pehle pivot, phir normal search.',
            ] },
            { viz: 33, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[1], 0</code>', '-1', 'Single, mismatch'],
              ['<code>[1], 1</code>', '0', 'Single match'],
              ['<code>[3,1], 1</code>', '1', 'lo == mid → left [3] sorted (<= zaroori!)'],
              ['<code>[5,1,3], 5</code>', '0', 'Right sorted [1,3], 5 wahan nahi → left'],
              ['<code>[1,2,3,4,5], 4</code>', '3', 'Not rotated — normal BS jaisa'],
              ['<code>[4,5,6,7,0,1,2], 4</code>', '0', 'target == nums[lo] boundary (>=)'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute', 'O(n)', 'O(1)'],
              ['Pivot + BS', 'O(log n)', 'O(1)'],
              ['One pass', 'O(log n)', 'O(1)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Kaise pata kaunsa half sorted?', '<code>nums[lo] &lt;= nums[mid]</code> → left sorted, warna right.'],
              ['Dono half sorted kab?', 'Jab [lo..hi] me drop hi nahi (rotated part se bahar) — tab left check pehle chalega, sahi hai.'],
              ['<code>&lt;=</code> ki jagah <code>&lt;</code> likha toh kaunsa case fail?', '<code>[3,1], target 1</code>: lo = mid = 0, 3 &lt; 3 false → right sorted maana → 1 &gt; 3? No → hi = −1 → galat −1.'],
              ['Target range me <code>&lt; nums[mid]</code> strict kyun?', 'nums[mid] == target already check ho chuka.'],
              ['Duplicates allowed ho toh?', 'nums[lo] == nums[mid] == nums[hi] pe decide nahi kar sakte → lo++, hi−− → worst O(n).'],
              ['Pivot approach ka fayda?', 'Do simple templates reuse — debugging easy. One pass me comparisons kam.'],
              ['Template A kyun, B kyun nahi?', 'Exact element chahiye, boundary nahi.'],
              ['Complexity?', 'O(log n) time, O(1) space.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'In a rotated sorted array, one of the two halves around mid is always sorted. First I check if nums[mid] is the target. Then, if nums[lo] <= nums[mid], the left half is sorted: if the target is between nums[lo] and nums[mid], I search left, otherwise right. If the left half is not sorted, the right half is, and I check whether the target is between nums[mid] and nums[hi]. Each step discards half, so it is O(log n) time and O(1) space.'],
              ['Follow-up: "Alternative approach?"', 'I can first find the pivot, which is the index of the minimum, using the same comparison as Find Minimum in Rotated Sorted Array. Then the array is two sorted parts; I check which part can contain the target by comparing it with the last element, and run a standard binary search there. It is also O(log n), just with two passes.'],
              ['1-minute: Edge case jo log miss karte hain', 'The most common bug is using strict less-than in nums[lo] <= nums[mid]. When only two elements remain, lo equals mid, and the left half is a single element, which is sorted. With strict comparison the code wrongly treats the right half as sorted and can skip the target, for example searching for 1 in [3, 1].'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              '<code>[4,5,6,7,0,1,2]</code> pe mid = 3 lo — dono halves draw karo, sorted wala colour karo.',
              'Part 1 ka 2×2 table apni notebook me copy karo.',
              'Brute submit. Optimal code dekh ke samjho, line-by-line bolo.',
              'Target = 0 dry run table khud banao.',
              'LC 153 (kal ka) bina dekhe dobara likho.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 33 one-pass memory se 10 min. Submit.',
              '<b>Task B:</b> LC 33 pivot + BS approach bhi likho (LC 153 loop reuse). Submit.',
              '<b>Task C:</b> <code>[3,1]</code> wala bug khud reproduce karo (&lt; likh ke) — samjho kyun fail.',
              '<b>Task D:</b> Duplicates follow-up bolke explain karo (worst O(n) kyun).',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 33 Accepted (Sohvi: one pass, Sohel: dono approaches).',
              'LC 153 re-solve.',
              'Kal Saturday revision: LC 35, 69, 153, 33 bina dekhe — timer ke saath.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[6,7,0,1,2,4,5]</code>, target 7 — pehla step?', 'mid = 3 (1). nums[lo] = 6 &gt; 1 → right sorted [1..5]. 7 ∈ (1,5]? No → hi = 2.'],
              ['Left sorted ka condition?', '<code>nums[lo] &lt;= nums[mid]</code>.'],
              ['Left sorted + target in range → ?', 'hi = mid − 1.'],
              ['Loop condition?', '<code>lo &lt;= hi</code>.'],
              ['Do approaches ke naam?', 'One-pass sorted-half check, aur pivot + binary search.'],
            ] },
          ],
        },
      ],
      checks: [
        '"Ek half hamesha sorted" picture bana sakta/sakti hu',
        '2×2 decision table yaad hai',
        'LC 33 one-pass Accepted',
        'Target 0 aur 3 dry run match kiye',
        '<= wala edge case ([3,1]) samjha',
        'LC 153 re-solve kiya',
        '8 interview sawaal',
        'Self-test 5/5',
      ],
      memory: 'Rotated search: sorted half pehchano (nums[lo] <= nums[mid]), target uski range me → wahan, warna doosri taraf.',
    },

    // =====================================================================
    6: {
      title: 'Revision — Week 1 (Binary Search)',
      goal: 'Week 1 ke 4 questions (LC 35, 69, 153, 33) <b>bina dekhe, timer ke saath</b> re-solve. Template A vs B zubaani. Saath me System Design session.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules) + warm-up',
          blocks: [
            { table: { head: ['Slot', 'Kya', 'Timer'], rows: [
              ['1', 'LC 35 — bina dekhe', 'Easy: 10 min'],
              ['2', 'LC 69 — bina dekhe', 'Easy: 10 min'],
              ['3', 'LC 153 — bina dekhe', 'Medium: 15 min'],
              ['4', 'LC 33 — bina dekhe', 'Medium: 25 min'],
              ['5', 'Galtiyan note + visualizer se verify', '15 min'],
            ] } },
            { list: [
              'Rule 1: pehle approach <b>bolo</b> (Brute → Optimal), phir code.',
              'Rule 2: code ke baad 1-element, 2-element aur "target missing" pe dry run.',
              'Rule 3: atak gaye toh sirf Last Minute tab dekho, solution nahi.',
            ] },
            ...rev('Warm-up: LC 704 — Binary Search',
              'Sorted array me target ka index.',
              '[-1,0,3,5,9,12], 9 → mid 2 (3) → lo 3 → mid 4 (9) ✓',
              'Template A',
              ['lo &lt;= hi.', 'mid ± 1.', 'Nahi mila → −1.'],
              `while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
}`,
              'Exact = A, boundary = B.'),
            ...rev('Warm-up: LC 739 — Daily Temperatures',
              'Har din ke liye kitne din baad garam din aayega.',
              '[73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]',
              'Monotonic decreasing stack (indices)',
              ['Stack me un-resolved din ke index.', 'Aaj ka temp bada → pop karke answer = i − idx.', 'Push aaj ka index.'],
              `Deque<Integer> st = new ArrayDeque<>();
for (int i = 0; i < t.length; i++) {
    while (!st.isEmpty() && t[i] > t[st.peek()]) { int j = st.pop(); ans[j] = i - j; }
    st.push(i);
}`,
              'Stack = intezaar karne walon ki line.'),
          ],
        },
        {
          title: 'Part 1 — Revision Q1: LC 35 Search Insert Position',
          blocks: [
            { problem: 35 },
            { p: '<b>Pattern:</b> Lower bound (Template B).' },
            { pre: '[1,3,5,6], t = 2 → cond F T T T → 1\n[1,3,5,6], t = 7 → cond F F F F → 4 (= n)' },
            { code: `int lo = 0, hi = nums.length;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
}
return lo;` },
            { tip: '<b>Memory hook:</b> hi = n, kyunki end bhi seat hai.' },
          ],
        },
        {
          title: 'Part 2 — Revision Q2: LC 69 Sqrt(x)',
          blocks: [
            { problem: 69 },
            { p: '<b>Pattern:</b> Binary search on answer (floor, ans variable).' },
            { pre: 'x = 8: candidates 0..8, mid² ≤ 8 → T T T F F … → aakhri T = 2' },
            { code: `int lo = 0, hi = x, ans = 0;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if ((long) mid * mid <= x) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
}
return ans;` },
            { tip: '<b>Memory hook:</b> (long) pehle, multiply baad me.' },
          ],
        },
        {
          title: 'Part 3 — Revision Q3: LC 153 Find Minimum in Rotated Sorted Array',
          blocks: [
            { problem: 153 },
            { p: '<b>Pattern:</b> Rotated array, boundary template, mid vs hi.' },
            { pre: '[4,5,6,7,0,1,2]: mid 7 > 2 → lo=4; mid 1 ≤ 2 → hi=5; mid 0 ≤ 1 → hi=4 → 0' },
            { code: `while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
}
return nums[lo];` },
            { tip: '<b>Memory hook:</b> Hi se compare, hi = mid.' },
            { viz: 153, ex: 0 },
          ],
        },
        {
          title: 'Part 4 — Revision Q4: LC 33 Search in Rotated Sorted Array',
          blocks: [
            { problem: 33 },
            { p: '<b>Pattern:</b> Rotated array, sorted-half check (Template A).' },
            { pre: '[4,5,6,7,0,1,2], t=0: mid 7, left [4..7] sorted, 0 nahi → lo=4;\nmid 1, left [0..1] sorted, 0 hai → hi=4; mid 0 ✓ → 4' },
            { code: `if (nums[lo] <= nums[mid]) {
    if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
    else lo = mid + 1;
} else {
    if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
    else hi = mid - 1;
}` },
            { tip: '<b>Memory hook:</b> Sorted half pe bharosa karo, wahi range batata hai.' },
          ],
        },
        {
          title: 'Part 5 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['Template A aur B ke loop + updates?', 'A: <code>lo &lt;= hi</code>, mid ± 1. B: <code>lo &lt; hi</code>, lo = mid + 1 / hi = mid.'],
              ['LC 35 me hi = n kyun?', 'Insert position n bhi ho sakta hai.'],
              ['LC 69 me overflow kahan?', 'mid × mid — long cast.'],
              ['LC 153 me nums[hi] kyun?', 'nums[lo] comparison ambiguous hai (not rotated case).'],
              ['LC 33 me <= kyun?', 'lo == mid pe single-element left half sorted hai.'],
              ['Infinite loop ka sabse common reason?', 'hi = mid ke saath lo &lt;= hi.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Bade answers: aise bolo',
          blocks: [
            { say: [
              ['1-minute: Binary search templates', 'I keep two templates. For an exact match I use a closed range with while lo <= hi, and I move to mid plus one or mid minus one, returning inside the loop. For a boundary — first position where a condition becomes true — I use while lo < hi, set hi = mid when the condition holds and lo = mid + 1 otherwise, and return lo after the loop. Choosing the template first removes most off-by-one bugs.'],
              ['1-minute: Rotated array questions', 'A rotated sorted array is two sorted runs. To find the minimum I compare mid with hi and use the boundary template. To find a target I use the exact-match template and, at each step, pick the half that is sorted and check whether the target falls in its range. Both are O(log n) with O(1) space.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: [
              'LC 35 aur LC 69 bina dekhe (timer 10 min each). Submit.',
              'LC 153 try karo (15 min). Atke toh Part 3 ka pre dekho, code nahi.',
              'Template A vs B table apni notebook se bina dekhe dobara banao.',
              'Visualizer me LC 153 ka example chalao aur har step bolo.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice + System Design)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Charon questions back-to-back, total 45 min target. Har ek ke baad complexity bolo.',
              '<b>Task B:</b> LC 33 dono approaches (one pass + pivot) 15 min me.',
              '<b>Task C:</b> Mock-style: Sohvi tumhe LC 153 ka "nums[lo] kyun nahi" follow-up pooche.',
              SD + ' Aaj: <b>URL Shortener</b> (ID generation, base62, read-heavy caching, DB choice).',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: [
              'Jo question timer me nahi hua, kal subah dobara.',
              'Last Minute tab ki mistakes list padho.',
              'Kal mock: Sohel → Sohvi (LC 35), Sohvi → Sohel (LC 153).',
            ] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[2,4,6]</code>, target 5 → LC 35 answer?', '2.'],
              ['x = 26 → LC 69?', '5.'],
              ['<code>[2,3,4,5,1]</code> → LC 153?', '1.'],
              ['<code>[5,6,1,2,3,4]</code>, target 6 → LC 33?', '1.'],
              ['Kaunse 2 questions boundary template use karte hain?', 'LC 35 aur LC 153.'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 35 timer me bina dekhe',
        'LC 69 timer me bina dekhe',
        'LC 153 timer me bina dekhe',
        'LC 33 timer me bina dekhe',
        'Template A vs B zubaani bol sakta/sakti hu',
        'System Design session (Sohel) kiya',
        'Self-test 5/5',
      ],
      memory: 'Week 1: exact = A (lo <= hi), boundary = B (lo < hi, hi = mid). Rotated: mid vs hi (min), sorted half (search).',
    },

    // =====================================================================
    7: {
      title: 'Mock Interview + Contest',
      goal: 'Real interview jaisa mock: <b>Tum → Sohvi (LC 35)</b>, <b>Sohvi → Tum (LC 153)</b>. Phir LeetCode Weekly Contest (Sunday 8:00 AM IST) ka discussion.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Mock format (30 + 30 + 30 min) + warm-up',
          blocks: [
            { table: { head: ['Time', 'Kya', 'Kaun'], rows: [
              ['30 min', 'Mock Q1: LC 35', 'Sohel interviewer, Sohvi candidate'],
              ['30 min', 'Mock Q2: LC 153', 'Sohvi interviewer, Sohel candidate'],
              ['30 min', 'Weekly Contest discussion', 'Dono'],
            ] } },
            { p: 'Rules: candidate camera on, notes band. Interviewer sirf hint ladder se help kare. Last 5 min feedback rubric se.' },
            ...rev('Warm-up: LC 1 — Two Sum',
              'Do indices jinka sum target.',
              '[2,7,11,15], 9 → i=0 need 7 (nahi) put 2; i=1 need 2 mila → [0,1]',
              'HashMap (value → index)',
              ['need = target − x.', 'Map me hai → answer.', 'Warna put(x, i).'],
              `Map<Integer, Integer> m = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    if (m.containsKey(target - nums[i])) return new int[]{m.get(target - nums[i]), i};
    m.put(nums[i], i);
}`,
              'Pehle check, phir put.'),
            ...rev('Warm-up: LC 876 — Middle of the Linked List',
              'Linked list ka middle (do middle ho toh doosra).',
              '1→2→3→4→5: slow 1,2,3 fast 1,3,5 → 3',
              'Fast & slow pointers',
              ['slow 1 step, fast 2 step.', 'fast end pe → slow middle pe.'],
              `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
return slow;`,
              'Kachhua aur khargosh — khargosh end pe, kachhua beech me.'),
          ],
        },
        {
          title: 'Part 1 — Mock Q1 (Tum → Sohvi): LC 35 Search Insert Position',
          blocks: [
            { problem: 35 },
            { p: '<b>Kya poochna hai (interviewer script):</b>' },
            { list: [
              '"Array sorted hai — iska fayda kaise uthaogi?"',
              '"Agar target nahi mila toh answer kya represent karta hai?"',
              '"hi = n kyun rakha?" / "Loop kab rukega?"',
              'Follow-up: "Duplicates ho toh first occurrence?"',
            ] },
            { p: '<b>Hints ladder</b> (ek-ek karke, 3–4 min gap):' },
            { olist: [
              'Linear solution kya hoga? Usme tum "pehla element jo &gt;= target" dhoondh rahi ho na?',
              'F F T T picture banao (nums[i] &gt;= target).',
              'mid T hai toh kya mid answer ho sakta hai? Toh hi = ?',
            ] },
            { table: { head: ['Rubric', '1 (weak)', '3 (ok)', '5 (strong)'], rows: [
              ['Clarify', 'Kuch nahi poocha', 'Sorted/distinct confirm', 'Empty, duplicates, end case poocha'],
              ['Brute', 'Nahi bataya', 'Linear bataya', 'Linear + complexity'],
              ['Optimal', 'Hint se bhi nahi', 'Hint ke baad', 'Khud lower bound socha'],
              ['Code', 'Bugs', 'Minor off-by-one', 'Clean, hi = n'],
              ['Test', 'Nahi kiya', 'Ek example', 'Start / middle / end teeno'],
              ['Communication', 'Chup', 'Thoda', 'Har step bola'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Mock Q2 (Sohvi → Tum): LC 153 Find Minimum in Rotated Sorted Array',
          blocks: [
            { problem: 153 },
            { p: '<b>Kya poochna hai:</b>' },
            { list: [
              '"O(log n) kyun possible hai jab array sorted nahi?"',
              '"nums[lo] se compare kyun nahi kiya?"',
              '"hi = mid − 1 kyun nahi?"',
              'Follow-up: "Duplicates ho toh? Complexity?"',
            ] },
            { p: '<b>Hints ladder:</b>' },
            { olist: [
              'Array ka graph draw karo — minimum kahan hai?',
              'nums[mid] ko nums[hi] se compare karo — kya batata hai?',
              'mid khud minimum ho sakta hai?',
            ] },
            { table: { head: ['Rubric', '1 (weak)', '3 (ok)', '5 (strong)'], rows: [
              ['Clarify', 'Kuch nahi', 'Unique confirm', 'Rotation count, n = 1, duplicates'],
              ['Brute', '—', 'Linear min', 'Linear + kyun reject'],
              ['Optimal', 'Hint se', 'mid vs hi with hint', 'Khud + nums[lo] ambiguity explain'],
              ['Code', 'Bugs', 'Minor', 'Clean template B'],
              ['Test', '—', 'Ek example', 'Rotated, not rotated, 2 elements'],
              ['Communication', '—', 'Thoda', 'Clear invariant bola'],
            ] } },
          ],
        },
        {
          title: 'Part 3 — Interview communication checklist',
          blocks: [
            { olist: [
              'Problem apne shabdon me repeat karo + 1 example.',
              'Clarifying questions: input size, sorted?, duplicates?, empty?',
              'Brute + complexity bolo (30 sec).',
              'Optimal idea + <b>invariant</b> bolo (lo/hi kya represent karte hain).',
              'Code karte waqt short narration.',
              'Dry run: 1 normal + 1 edge case.',
              'Time/space complexity + follow-ups.',
            ] },
          ],
        },
        {
          title: 'Part 4 — LeetCode Weekly Contest plan + discussion template',
          blocks: [
            { list: [
              '<b>Contest:</b> Sunday 8:00 AM IST, 90 min, 4 questions. Target: Sohvi Q1–Q2, Sohel Q1–Q3.',
              'Pehle 5 min saare questions padho; easiest pehle.',
              'Wrong Answer pe 10 min se zyada mat atko — next question.',
            ] },
            { table: { head: ['Discussion template', 'Har question ke liye likho'], rows: [
              ['Pattern', 'Kaunsa pattern laga (binary search? two pointers?)'],
              ['Mera approach', 'Kya socha, kitna time laga'],
              ['Galti', 'WA/TLE kyun aaya'],
              ['Best solution', 'Editorial / top solution ka idea 2 line me'],
              ['Revise', 'Kya note me daalna hai'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Mock follow-up sawaal',
          blocks: [
            { qa: [
              ['LC 35 me lower bound ki definition?', 'Pehla index jahan nums[i] &gt;= target.'],
              ['LC 35 ko <code>Arrays.binarySearch</code> se?', 'i &gt;= 0 ? i : −i − 1.'],
              ['LC 153 me loop ke baad lo kya hai?', 'Min ka index (rotation count).'],
              ['LC 153 duplicates ke saath worst case?', 'O(n) (hi−− wala fix).'],
              ['Interview me pehle kya bolna chahiye — code ya approach?', 'Approach + complexity, interviewer ka nod, phir code.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Aise bolo',
          blocks: [
            { say: [
              ['Mock ke start me (candidate)', 'Let me restate the problem to make sure I understand it. I am given a sorted array of distinct integers and a target, and I need the index of the target or the position where it would be inserted. Can the array be empty, and should I assume ascending order? A simple scan works in O(n), but since the array is sorted I think binary search can do it in O(log n).'],
              ['Jab atak jao', 'I am not sure yet how to handle this case, so let me try a small example. If I take three elements and walk through what my current condition does, I can see where it breaks. That should tell me whether I need to keep mid in the range or exclude it.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: [
              'Candidate (LC 35): Part 3 checklist follow karo — pehle bolna, phir code.',
              'Interviewer (LC 153): Part 2 ki script se poocho, hint ladder se hi help karo.',
              'Rubric me Sohel ko score do aur ek improvement point likho.',
              'Contest: Q1 zaroor attempt.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              'Candidate (LC 153): 20 min me clarify → brute → optimal → code → test. Follow-ups bina hichkichahat.',
              'Interviewer (LC 35): Sohvi ko seedha answer mat do, hint ladder use karo.',
              'Contest: Q1–Q3 target; discussion template bharo.',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: [
              'Mock me jo galti hui, woh question kal subah 1 baar.',
              'Contest ka ek unsolved question editorial padh ke samjho.',
              'Kal (Day 8): Binary search on answer — LC 875 Koko. Problem padh ke socho: "speed" pe binary search kaise?',
            ] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Mock me pehle 2 minute me kya karna chahiye?', 'Problem restate + clarifying questions + example.'],
              ['Rubric ke 6 points?', 'Clarify, Brute, Optimal, Code, Test, Communication.'],
              ['LC 153 ka one-line?', 'mid &gt; hi → lo = mid + 1, warna hi = mid; return nums[lo].'],
              ['LC 35 ka one-line?', 'Lower bound: hi = n, lo &lt; hi, return lo.'],
              ['Contest me atak gaye toh?', '10 min rule — next question pe jao.'],
            ] },
          ],
        },
      ],
      checks: [
        'Mock Q1 (LC 35) poora hua + rubric bhara',
        'Mock Q2 (LC 153) poora hua + rubric bhara',
        'Communication checklist follow kiya',
        'Weekly contest diya',
        'Contest discussion template bhara',
        'Self-test 5/5',
      ],
      memory: 'Mock: bolo → brute → optimal + invariant → code → test → complexity.',
    },
  });
})();
