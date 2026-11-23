window.PHASE_CONTENT = window.PHASE_CONTENT || {};

window.PHASE_CONTENT['binary-search'] = {
  intro: 'Binary Search = har step pe <b>aadha search space phenk do</b>. Sorted array me element dhundhna toh shuruaat hai — asli power hai "<b>answer ki range</b>" pe binary search (Koko, Ship, Split Array). Template yaad karo, invariant samjho, off-by-one khatam.',

  // ---------------- FUNDAMENTALS ----------------
  fundamentals: [
    {
      h: 'Binary Search kya hai? (lo / mid / hi)',
      body: `<p>Sorted (ya <b>monotonic</b>) search space me hum beech wala element (<code>mid</code>) dekhte hain. Agar answer mid ke right me ho sakta hai toh left half <b>phenk do</b>, warna right half. Har step pe space aadha → <b>O(log n)</b>.</p>
<pre class="ex-pre diagram">nums   = [-1, 0, 3, 5, 9, 12]     target = 9
index     0  1  2  3  4   5

Step 1:  lo=0            mid=2          hi=5
         [-1   0   3 ]  [ 5   9  12]
                   ^ nums[mid]=3 &lt; 9  →  left half (0..2) DISCARD, lo = mid+1

Step 2:   xx  xx  xx    lo=3  mid=4  hi=5
                         [ 5   9  12]
                               ^ nums[mid]=9 == target → return 4

n = 10⁶ elements → sirf ~20 comparisons (2²⁰ ≈ 10⁶)</pre>
<p><b>Shart:</b> search space me ek <b>monotonic property</b> honi chahiye — "mid pe condition false hai toh uske left me sab false" (ya ulta). Sorted array isi ka special case hai.</p>`,
    },
    {
      h: 'Overflow-safe mid',
      body: `<p><code>(lo + hi) / 2</code> me agar lo aur hi dono bade hon (jaise 2·10⁹ ke paas), toh <code>lo + hi</code> <b>int overflow</b> karke negative ban jaata hai → galat index / infinite loop. Hamesha:</p>
<pre class="ex-pre diagram">int mid = lo + (hi - lo) / 2;     // SAFE: hi - lo kabhi overflow nahi karta
int mid = (lo + hi) &gt;&gt;&gt; 1;        // SAFE: unsigned shift (Java ka Arrays.binarySearch yahi karta hai)
int mid = (lo + hi) / 2;          // RISKY: lo + hi &gt; 2³¹−1 ho sakta hai

lo = 2,000,000,000  hi = 2,100,000,000
lo + hi = 4.1·10⁹  →  int me -194,967,296  ✗
lo + (hi-lo)/2 = 2,050,000,000  ✓</pre>
<p>Isi tarah <code>mid * mid</code> (LC 69) ya <code>sum</code> (LC 1011/410) ko <b>long</b> me compute karo jab overflow possible ho.</p>`,
    },
    {
      h: 'Loop invariants: lo <= hi vs lo < hi',
      body: `<p><b>Invariant</b> = ek baat jo loop ke har iteration pe sach rehti hai. Binary search ke bugs 90% invariant clear na hone se aate hain.</p>
<table class="tbl"><thead><tr><th></th><th>Template A — exact match</th><th>Template B — boundary (lower bound / min feasible)</th></tr></thead><tbody>
<tr><td>Range</td><td><code>[lo, hi]</code> closed, <code>hi = n − 1</code></td><td><code>[lo, hi)</code> ya "answer hamesha [lo, hi] me", <code>hi = n</code> / max answer</td></tr>
<tr><td>Loop</td><td><code>while (lo &lt;= hi)</code></td><td><code>while (lo &lt; hi)</code></td></tr>
<tr><td>Update</td><td><code>lo = mid + 1</code> / <code>hi = mid − 1</code></td><td><code>lo = mid + 1</code> / <code>hi = mid</code> (mid khud answer ho sakta hai)</td></tr>
<tr><td>Khatam</td><td>lo &gt; hi → nahi mila → −1</td><td>lo == hi → wahi answer</td></tr>
<tr><td>Questions</td><td>LC 704, 33, 69 (ans variable ke saath)</td><td>LC 35, 153, 875, 1011, 410</td></tr>
</tbody></table>
<p class="tip">Rule: <b>hi = mid</b> likha hai toh loop <b>lo &lt; hi</b> hona chahiye, warna lo == hi == mid pe infinite loop. Aur <b>mid lower mid</b> hona chahiye (<code>lo + (hi−lo)/2</code>) taaki <code>lo = mid + 1</code> hamesha aage badhe.</p>`,
    },
    {
      h: 'Lower bound template (pehla index jahan nums[i] >= target)',
      body: `<p>"Pehla element jo target se bada ya barabar ho" = <b>lower bound</b>. Search insert position (LC 35), first occurrence, ceil — sab isi se. Array ko socho: <code>[F F F F T T T]</code> (condition <code>nums[i] &gt;= target</code>) — humein <b>pehla T</b> chahiye.</p>
<pre class="ex-pre diagram">nums = [1, 3, 5, 6], target = 2
cond = [F, T, T, T]   (nums[i] &gt;= 2 ?)
            ^ pehla T = index 1 → answer 1

Agar saare F → answer = n (end me insert)</pre>`,
      code: `int lo = 0, hi = nums.length;          // hi = n: "end me insert" bhi valid answer
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] < target) lo = mid + 1; // mid F hai → answer right me
    else hi = mid;                        // mid T hai → mid ya uske left me
}
return lo;                                // lo == hi == pehla T`,
    },
    {
      h: 'Binary Search on Answer template',
      body: `<p>Jab question bole "<b>minimum X</b> jisse kaam ho jaaye" (min speed, min capacity, min largest sum) aur <b>X badhane se kaam aasaan hota hai</b> (monotonic), toh array pe nahi, <b>answer ki range</b> pe binary search karo.</p>
<pre class="ex-pre diagram">Koko: piles = [3,6,7,11], h = 8
speed k :  1   2   3   4   5   6  ...  11
hours   : 27  15  10   8   8   6  ...   4
ok(&lt;=8)?:  F   F   F   T   T   T  ...   T
                       ^ pehla T = 4 = answer

Steps: 1) range [lo, hi] fix karo   2) feasible(mid) likho (greedy, O(n))
       3) lower-bound style binary search → O(n · log(range))</pre>`,
      code: `int lo = minPossible, hi = maxPossible;   // answer pakka is range me
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (feasible(mid)) hi = mid;          // mid chalta hai → shayad aur chhota bhi chale
    else lo = mid + 1;                    // mid nahi chalta → bada chahiye
}
return lo;                                // minimum feasible value`,
    },
    {
      h: 'Java Cheat Sheet (Binary Search)',
      code: `int[] a = {1, 3, 5, 6};
Arrays.binarySearch(a, 5);      // 2 (mila toh index)
Arrays.binarySearch(a, 2);      // -2 = -(insertionPoint) - 1 → insertion point = 1
// Duplicates ho toh Arrays.binarySearch KOI bhi index de sakta hai (first ki guarantee nahi)

List<Integer> list = new ArrayList<>(List.of(1, 3, 5));
Collections.binarySearch(list, 3);   // 1

TreeSet<Integer> ts = new TreeSet<>(List.of(1, 3, 5));
ts.ceiling(4);   // 5  (>= 4 ka sabse chhota)  — lower bound jaisa
ts.floor(4);     // 3  (<= 4 ka sabse bada)
ts.higher(3);    // 5  (> 3)

int mid = lo + (hi - lo) / 2;        // overflow-safe
long sq = (long) mid * mid;          // square overflow se bachao
int ceil = (p - 1) / k + 1;          // ceil(p / k) for p >= 1, bina overflow
int ceil2 = (p + k - 1) / k;         // same, lekin p + k overflow kar sakta hai`,
    },
    {
      h: 'Yaad rakhne wali baatein',
      body: `<ul>
<li>Binary search ke liye <b>sorted</b> nahi, <b>monotonic</b> chahiye — "yahan F hai toh left me sab F".</li>
<li>Pehle decide karo: <b>exact match</b> (Template A) ya <b>boundary</b> (Template B). Mix mat karo.</li>
<li>Har iteration me range <b>strictly chhoti</b> honi chahiye — warna infinite loop.</li>
<li>Answer-space binary search me <b>lo = sabse chhota possible</b>, <b>hi = sabse bada possible</b> (jaise max(piles), sum(weights)).</li>
<li>Feasibility check usually <b>greedy O(n)</b> hota hai → total O(n log range).</li>
<li>Rotated array me ek half <b>hamesha sorted</b> hota hai — wahi dekh ke decide karo.</li>
<li>Test hamesha: 1 element, 2 elements, target sabse chhota/bada, target missing.</li>
</ul>`,
    },
  ],

  // ---------------- OPERATIONS ----------------
  operations: [
    { op: 'Exact search (sorted)', time: 'O(log n)', note: 'Template A: lo <= hi, mila toh return', code: 'int lo = 0, hi = n - 1;\nwhile (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (a[mid] == t) return mid;\n    if (a[mid] < t) lo = mid + 1; else hi = mid - 1;\n}\nreturn -1;' },
    { op: 'Lower bound (first >= t)', time: 'O(log n)', note: 'Insert position / first occurrence', code: 'int lo = 0, hi = n;\nwhile (lo < hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (a[mid] < t) lo = mid + 1; else hi = mid;\n}\nreturn lo;' },
    { op: 'Upper bound (first > t)', time: 'O(log n)', note: 'Sirf < ko <= karo. Count of t = upper − lower', code: 'int lo = 0, hi = n;\nwhile (lo < hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (a[mid] <= t) lo = mid + 1; else hi = mid;\n}\nreturn lo;' },
    { op: 'Last value with cond true (floor)', time: 'O(log n)', note: 'ans variable rakho (LC 69 style)', code: 'int lo = 0, hi = x, ans = 0;\nwhile (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (ok(mid)) { ans = mid; lo = mid + 1; }\n    else hi = mid - 1;\n}\nreturn ans;' },
    { op: 'Min in rotated sorted', time: 'O(log n)', note: 'nums[mid] vs nums[hi]', code: 'while (lo < hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (a[mid] > a[hi]) lo = mid + 1; else hi = mid;\n}\nreturn a[lo];' },
    { op: 'Search on answer (min feasible)', time: 'O(n log R)', note: 'R = answer range size, feasible() = O(n) greedy', code: 'while (lo < hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (feasible(mid)) hi = mid; else lo = mid + 1;\n}\nreturn lo;' },
    { op: 'Library search', time: 'O(log n)', note: 'Negative return = -(insertion point) - 1', code: 'int i = Arrays.binarySearch(a, t);\nint insertAt = i >= 0 ? i : -i - 1;' },
    { op: 'Ceil division', time: 'O(1)', note: 'Koko hours ke liye, overflow-safe', code: 'int hours = (p - 1) / k + 1;  // p >= 1' },
  ],

  // ---------------- PATTERNS ----------------
  patterns: [
    {
      name: 'Classic Binary Search (exact match)',
      signal: '"Sorted array", "O(log n)", "target ka index"',
      idea: 'Closed range [lo, hi]. mid == target → return. Chhota → lo = mid + 1, bada → hi = mid − 1. lo > hi → −1.',
      code: `int lo = 0, hi = nums.length - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;`,
      qs: [704],
    },
    {
      name: 'Lower Bound / Boundary',
      signal: '"Insert position", "pehla >= x", "floor sqrt", "first / last occurrence"',
      idea: 'Array ko F F F T T T socho. Pehla T (lower bound) ya aakhri F (floor) dhundo. hi = mid ke saath lo < hi.',
      code: `int lo = 0, hi = nums.length;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
}
return lo;`,
      qs: [35, 69],
    },
    {
      name: 'Rotated Sorted Array',
      signal: '"Sorted tha, phir kisi pivot pe rotate", "O(log n)"',
      idea: 'mid ke ek taraf ka half hamesha sorted hota hai. Min ke liye nums[mid] vs nums[hi]. Search ke liye: sorted half me target ki range check karo.',
      code: `if (nums[lo] <= nums[mid]) {          // left half sorted
    if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
    else lo = mid + 1;
} else {                               // right half sorted
    if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
    else hi = mid - 1;
}`,
      qs: [33, 153],
    },
    {
      name: 'Binary Search on Answer',
      signal: '"Minimum speed / capacity / largest sum such that...", "within h hours / D days / k parts"',
      idea: 'Answer ki range [lo, hi] lo. feasible(mid) monotonic hai (mid badha → aasaan). Pehla feasible = answer. O(n log range).',
      code: `int lo = max(arr), hi = sum(arr);
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (feasible(arr, mid)) hi = mid;
    else lo = mid + 1;
}
return lo;`,
      qs: [875, 1011, 410],
    },
  ],

  // ---------------- QUESTIONS ----------------
  questions: {
    704: {
      oneLine: 'Sorted array me target dhundo: lo/hi/mid, har step pe aadha phenko — O(log n).',
      pattern: 'Classic Binary Search',
      approaches: [
        {
          level: 'Brute', idea: 'Linear search — har index check karo. Sorted hone ka fayda nahi uthaya.',
          time: 'O(n)', space: 'O(1)',
          code: `public int search(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) return i;
    }
    return -1;
}`,
        },
        {
          level: 'Optimal', idea: 'Iterative binary search, closed range [lo, hi]. mid chhota → right half, bada → left half.',
          time: 'O(log n)', space: 'O(1)',
          code: `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
        },
        {
          level: 'Recursive', idea: 'Same logic, lekin har call apni range [lo, hi] leti hai. Base case lo > hi → −1.',
          time: 'O(log n)', space: 'O(log n) (call stack)',
          code: `public int search(int[] nums, int target) {
    return bs(nums, target, 0, nums.length - 1);
}

private int bs(int[] nums, int target, int lo, int hi) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) return bs(nums, target, mid + 1, hi);
    return bs(nums, target, lo, mid - 1);
}`,
        },
      ],
      dryRun: '[-1,0,3,5,9,12], t=9 → lo=0 hi=5 mid=2 (3 < 9) → lo=3; mid=4 (9 == 9) → return 4',
      interview: 'Since the array is sorted, I compare the target with the middle element and discard the half that cannot contain it. I keep a closed range [lo, hi], compute mid as lo + (hi − lo) / 2 to avoid overflow, and stop when lo passes hi. That is O(log n) time and O(1) space; the recursive version costs O(log n) stack.',
      problem: {
        statement: 'Ek <b>ascending sorted</b> integer array <b>nums</b> (saare elements distinct) aur ek <b>target</b> diya hai. Agar target array me hai toh uska <b>index</b> return karo, warna <code>-1</code>. Algorithm <b>O(log n)</b> ka hona chahiye.',
        examples: [
          { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explain: '9 index 4 pe hai.', viz: { nums: '-1, 0, 3, 5, 9, 12', target: '9' } },
          { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explain: '2 array me nahi hai — lo, hi ko cross kar jaata hai.', viz: { nums: '-1, 0, 3, 5, 9, 12', target: '2' } },
        ],
        constraints: ['1 ≤ nums.length ≤ 10⁴', '−10⁴ < nums[i], target < 10⁴', 'Saare nums[i] unique', 'nums ascending order me sorted', 'O(log n) chahiye'],
      },
    },

    35: {
      oneLine: 'Lower bound: pehla index jahan nums[i] >= target — wahi insert position.',
      pattern: 'Lower Bound',
      approaches: [
        {
          level: 'Brute', idea: 'Left se chalo, pehla element jo target se bada ya barabar ho uska index. Koi nahi mila → n.',
          time: 'O(n)', space: 'O(1)',
          code: `public int searchInsert(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] >= target) return i;
    }
    return nums.length;
}`,
        },
        {
          level: 'Optimal', idea: 'Lower bound template: range [0, n), nums[mid] < target → lo = mid + 1, warna hi = mid. Loop khatam → lo.',
          time: 'O(log n)', space: 'O(1)',
          code: `public int searchInsert(int[] nums, int target) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
        },
      ],
      dryRun: '[1,3,5,6], t=2 → lo=0 hi=4 mid=2 (5 >= 2) hi=2; mid=1 (3 >= 2) hi=1; mid=0 (1 < 2) lo=1 → return 1',
      interview: 'The insert position is the first index whose value is at least the target — the lower bound. I search the half-open range [0, n): if nums[mid] is smaller than the target the answer is to the right, so lo = mid + 1; otherwise mid itself could be the answer, so hi = mid. When lo meets hi, that is the position. O(log n) time, O(1) space, and it naturally returns n when the target is larger than everything.',
      problem: {
        statement: 'Ek <b>sorted</b> array <b>nums</b> (distinct values) aur <b>target</b> diya hai. Agar target mil jaaye toh uska index return karo. Agar nahi mile, toh woh index return karo jahan target ko <b>insert</b> karne pe array sorted rahe. <b>O(log n)</b> chahiye.',
        examples: [
          { input: 'nums = [1,3,5,6], target = 5', output: '2', explain: '5 index 2 pe already hai.', viz: { nums: '1, 3, 5, 6', target: '5' } },
          { input: 'nums = [1,3,5,6], target = 2', output: '1', explain: '2 ko 1 aur 3 ke beech (index 1) daalna hoga.', viz: { nums: '1, 3, 5, 6', target: '2' } },
          { input: 'nums = [1,3,5,6], target = 7', output: '4', explain: '7 sabse bada → end me, index 4 = n.', viz: { nums: '1, 3, 5, 6', target: '7' } },
        ],
        constraints: ['1 ≤ nums.length ≤ 10⁴', '−10⁴ ≤ nums[i] ≤ 10⁴', 'nums distinct aur ascending sorted', '−10⁴ ≤ target ≤ 10⁴'],
      },
    },

    69: {
      oneLine: 'Answer range 0..x pe binary search: aakhri mid jiska mid*mid <= x (long me multiply).',
      pattern: 'Binary Search on Answer (floor)',
      approaches: [
        {
          level: 'Brute', idea: 'i = 0 se badhate jao jab tak (i+1)² <= x. long use karo taaki square overflow na ho. O(√x).',
          time: 'O(√x)', space: 'O(1)',
          code: `public int mySqrt(int x) {
    long i = 0;
    while ((i + 1) * (i + 1) <= x) {
        i++;
    }
    return (int) i;
}`,
        },
        {
          level: 'Optimal', idea: 'Range [0, x]. mid² <= x → mid candidate hai (ans = mid), aur bada try karo (lo = mid + 1). Warna hi = mid − 1.',
          time: 'O(log x)', space: 'O(1)',
          code: `public int mySqrt(int x) {
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
}`,
        },
      ],
      dryRun: 'x=8 → mid=4 (16 > 8) hi=3; mid=1 (1 <= 8) ans=1 lo=2; mid=2 (4 <= 8) ans=2 lo=3; mid=3 (9 > 8) hi=2 → return 2',
      interview: 'The answer is the largest integer whose square is at most x, and squares grow monotonically, so I binary search over the range 0 to x. If mid squared fits, I record mid as a candidate and move right; otherwise I move left. I multiply as long to avoid overflow when mid is around 46341. O(log x) time, O(1) space.',
      problem: {
        statement: 'Ek non-negative integer <b>x</b> diya hai. <b>√x ko neeche round</b> karke (floor) integer return karo. Built-in <code>Math.sqrt</code> / <code>pow</code> / <code>x ** 0.5</code> use <b>nahi</b> karna.',
        examples: [
          { input: 'x = 4', output: '2', explain: '√4 = 2 exactly.', viz: { x: '4' } },
          { input: 'x = 8', output: '2', explain: '√8 ≈ 2.828 → floor = 2 (3² = 9 > 8).', viz: { x: '8' } },
        ],
        constraints: ['0 ≤ x ≤ 2³¹ − 1', 'Built-in exponent/sqrt function allowed nahi'],
      },
    },

    153: {
      oneLine: 'Rotated sorted me min: nums[mid] > nums[hi] → min right me (lo = mid+1), warna hi = mid.',
      pattern: 'Rotated Sorted Array',
      approaches: [
        {
          level: 'Brute', idea: 'Poora array scan karke minimum. O(n) — rotation ka fayda nahi.',
          time: 'O(n)', space: 'O(1)',
          code: `public int findMin(int[] nums) {
    int min = nums[0];
    for (int x : nums) {
        min = Math.min(min, x);
    }
    return min;
}`,
        },
        {
          level: 'Optimal', idea: 'Compare nums[mid] with nums[hi]. mid bada → "drop" (min) mid ke right me hai. Warna mid se hi tak sorted hai, min mid ya uske left me → hi = mid.',
          time: 'O(log n)', space: 'O(1)',
          code: `public int findMin(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
    }
    return nums[lo];
}`,
        },
      ],
      dryRun: '[4,5,6,7,0,1,2] → mid=3 (7 > 2) lo=4; mid=5 (1 <= 2) hi=5; mid=4 (0 <= 1) hi=4 → nums[4] = 0',
      interview: 'A rotated sorted array has one drop point, and the minimum sits right after it. I compare nums[mid] with nums[hi]: if mid is larger, the drop is to the right, so lo = mid + 1; otherwise mid to hi is sorted and the minimum is at mid or to its left, so hi = mid. The loop runs while lo < hi and ends on the minimum. O(log n) time, O(1) space.',
      problem: {
        statement: 'Ek ascending sorted array (unique values) ko <b>1 se n baar rotate</b> kiya gaya hai — jaise <code>[0,1,2,4,5,6,7]</code> → <code>[4,5,6,7,0,1,2]</code>. Is rotated array ka <b>minimum element</b> return karo, <b>O(log n)</b> me.',
        examples: [
          { input: 'nums = [3,4,5,1,2]', output: '1', explain: 'Original [1,2,3,4,5] ko 3 baar rotate kiya.', viz: { nums: '3, 4, 5, 1, 2' } },
          { input: 'nums = [4,5,6,7,0,1,2]', output: '0', explain: 'Drop 7 → 0 pe hai, min = 0.', viz: { nums: '4, 5, 6, 7, 0, 1, 2' } },
          { input: 'nums = [11,13,15,17]', output: '11', explain: 'n baar rotate = wapas sorted, min = pehla element.', viz: { nums: '11, 13, 15, 17' } },
        ],
        constraints: ['n == nums.length, 1 ≤ n ≤ 5000', '−5000 ≤ nums[i] ≤ 5000', 'Saare integers unique', 'nums sorted tha aur 1..n baar rotate hua', 'O(log n) chahiye'],
      },
    },

    33: {
      oneLine: 'Rotated array me search: mid ke ek taraf sorted half hota hai — target uski range me hai toh wahan jao, warna doosri taraf.',
      pattern: 'Rotated Sorted Array',
      approaches: [
        {
          level: 'Brute', idea: 'Linear scan, index return. O(n) — interviewer O(log n) maangega.',
          time: 'O(n)', space: 'O(1)',
          code: `public int search(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) return i;
    }
    return -1;
}`,
        },
        {
          level: 'Better', idea: 'Do binary search: pehle pivot (min index, LC 153 wala), phir decide karo target kis sorted part me hai, aur usme normal binary search.',
          time: 'O(log n)', space: 'O(1)',
          code: `public int search(int[] nums, int target) {
    int n = nums.length, lo = 0, hi = n - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
    }
    int pivot = lo;
    if (target >= nums[pivot] && target <= nums[n - 1]) {
        lo = pivot; hi = n - 1;
    } else {
        lo = 0; hi = pivot - 1;
    }
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
        },
        {
          level: 'Optimal', idea: 'One pass: nums[lo] <= nums[mid] → left half sorted; target [nums[lo], nums[mid]) me hai toh hi = mid − 1 warna lo = mid + 1. Warna right half sorted, ulta check.',
          time: 'O(log n)', space: 'O(1)',
          code: `public int search(int[] nums, int target) {
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
}`,
        },
      ],
      dryRun: '[4,5,6,7,0,1,2], t=0 → mid=3 (7): left [4..7] sorted, 0 nahi → lo=4; mid=5 (1): [0..1] sorted, 0 in → hi=4; mid=4 → return 4',
      interview: 'In a rotated sorted array, at least one half around mid is always sorted. I check which one: if nums[lo] <= nums[mid], the left half is sorted, and if the target lies in [nums[lo], nums[mid]) I go left, otherwise right. Otherwise the right half is sorted and I do the mirror check. Each step still discards half, so it is O(log n) time and O(1) space. An alternative is to find the pivot first, as in Find Minimum, and then run a normal binary search on the correct part.',
      problem: {
        statement: 'Ek ascending sorted array (distinct values) kisi unknown pivot pe <b>rotate</b> ho sakta hai (jaise <code>[0,1,2,4,5,6,7]</code> → <code>[4,5,6,7,0,1,2]</code>). <b>target</b> ka index return karo, nahi hai toh <code>-1</code>. <b>O(log n)</b> chahiye.',
        examples: [
          { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4', explain: '0 index 4 pe hai (rotation ke baad wale part me).', viz: { nums: '4, 5, 6, 7, 0, 1, 2', target: '0' } },
          { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1', explain: '3 kisi bhi sorted part me nahi.', viz: { nums: '4, 5, 6, 7, 0, 1, 2', target: '3' } },
          { input: 'nums = [1], target = 0', output: '-1', explain: 'Single element, match nahi.', viz: { nums: '1', target: '0' } },
        ],
        constraints: ['1 ≤ nums.length ≤ 5000', '−10⁴ ≤ nums[i] ≤ 10⁴', 'Saare values unique', 'nums ascending sorted tha, shayad rotate hua', '−10⁴ ≤ target ≤ 10⁴'],
      },
    },

    875: {
      oneLine: 'Speed k pe binary search (1..max pile): hours(k) = Σ ceil(p/k) <= h ho toh chhota try karo.',
      pattern: 'Binary Search on Answer',
      approaches: [
        {
          level: 'Brute', idea: 'k = 1, 2, 3, … try karo; pehla k jisme total hours <= h. Worst case max(piles) tak → O(n · max).',
          time: 'O(n · max(piles))', space: 'O(1)',
          code: `public int minEatingSpeed(int[] piles, int h) {
    int k = 1;
    while (true) {
        long hours = 0;
        for (int p : piles) hours += (p - 1) / k + 1;
        if (hours <= h) return k;
        k++;
    }
}`,
        },
        {
          level: 'Optimal', idea: 'Speed badhane se hours kam hote hain (monotonic). Range [1, max(piles)] pe lower-bound: canFinish(mid) → hi = mid, warna lo = mid + 1.',
          time: 'O(n log max)', space: 'O(1)',
          code: `public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = 0;
    for (int p : piles) hi = Math.max(hi, p);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canFinish(piles, h, mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

private boolean canFinish(int[] piles, int h, int k) {
    long hours = 0;
    for (int p : piles) {
        hours += (p - 1) / k + 1;
    }
    return hours <= h;
}`,
        },
      ],
      dryRun: 'piles=[3,6,7,11], h=8 → range [1,11]: mid=6 (6h ✓) hi=6; mid=3 (10h ✗) lo=4; mid=5 (8h ✓) hi=5; mid=4 (8h ✓) hi=4 → 4',
      interview: 'If Koko can finish at speed k, she can finish at any higher speed, so feasibility is monotonic and I binary search the answer between 1 and the largest pile. For each mid I compute total hours as the sum of ceil(pile / mid) in O(n), using a long and an overflow-safe ceiling. If it fits in h, I try smaller; otherwise larger. Total O(n log max) time and O(1) space.',
      problem: {
        statement: 'Koko ke paas <b>n piles</b> of bananas hain (<code>piles[i]</code> bananas). Guards <b>h ghante</b> me wapas aayenge. Har ghante Koko ek pile choose karke usme se <b>k bananas</b> khaati hai (pile me k se kam ho toh poori pile, aur us ghante aur kuch nahi). <b>Minimum integer speed k</b> return karo jisse saare bananas h ghante me khatam ho jaayein.',
        examples: [
          { input: 'piles = [3,6,7,11], h = 8', output: '4', explain: 'k=4: 1+2+2+3 = 8 ghante ✓. k=3: 1+2+3+4 = 10 > 8 ✗.', viz: { piles: '3, 6, 7, 11', h: '8' } },
          { input: 'piles = [30,11,23,4,20], h = 5', output: '30', explain: 'h = n, har pile 1 ghante me → k = max pile = 30.', viz: { piles: '30, 11, 23, 4, 20', h: '5' } },
          { input: 'piles = [30,11,23,4,20], h = 6', output: '23', explain: 'k=23: 2+1+1+1+1 = 6 ✓. k=22: 2+1+2+1+1 = 7 ✗.', viz: { piles: '30, 11, 23, 4, 20', h: '6' } },
        ],
        constraints: ['1 ≤ piles.length ≤ 10⁴', 'piles.length ≤ h ≤ 10⁹', '1 ≤ piles[i] ≤ 10⁹'],
      },
    },

    1011: {
      oneLine: 'Capacity pe binary search [max(w), sum(w)]: greedy se din gino, <= days toh chhota try karo.',
      pattern: 'Binary Search on Answer',
      approaches: [
        {
          level: 'Brute', idea: 'cap = max(weights) se shuru karke 1-1 badhao; har cap pe greedy din gino. Pehla cap jisme din <= days.',
          time: 'O(n · (sum − max))', space: 'O(1)',
          code: `public int shipWithinDays(int[] weights, int days) {
    int cap = 0;
    for (int w : weights) cap = Math.max(cap, w);
    while (true) {
        int need = 1, load = 0;
        for (int w : weights) {
            if (load + w > cap) { need++; load = 0; }
            load += w;
        }
        if (need <= days) return cap;
        cap++;
    }
}`,
        },
        {
          level: 'Optimal', idea: 'lo = max weight (sabse bhaari package jaana hi chahiye), hi = sum (ek din me sab). daysNeeded(mid) greedy; <= days → hi = mid, warna lo = mid + 1.',
          time: 'O(n log(sum))', space: 'O(1)',
          code: `public int shipWithinDays(int[] weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) {
        lo = Math.max(lo, w);
        hi += w;
    }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (daysNeeded(weights, mid) <= days) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

private int daysNeeded(int[] weights, int cap) {
    int need = 1, load = 0;
    for (int w : weights) {
        if (load + w > cap) {
            need++;
            load = 0;
        }
        load += w;
    }
    return need;
}`,
        },
      ],
      dryRun: 'w=[1..10], days=5 → [10,55]: mid=32 (2d ✓) hi=32; mid=21 (3d ✓) hi=21; mid=15 (5d ✓) hi=15; mid=12 (6d ✗) lo=13; mid=14 (6d ✗) lo=15 → 15',
      interview: 'The capacity must be at least the heaviest package and at most the total weight. A larger capacity never needs more days, so I binary search that range. For each mid I greedily load packages in order and start a new day when the next one would overflow, counting days in O(n). If the count fits, I try smaller; otherwise larger. O(n log(sum)) time, O(1) space.',
      problem: {
        statement: 'Conveyor belt pe packages <b>order me</b> hain, <code>weights[i]</code> = i-th package ka weight. Har din ship ko order me packages load karte hain, lekin total weight ship ki <b>capacity</b> se zyada nahi ho sakta. <b>Minimum capacity</b> return karo jisse saare packages <b>days</b> din ke andar ship ho jaayein. (Order badal nahi sakte.)',
        examples: [
          { input: 'weights = [1,2,3,4,5,6,7,8,9,10], days = 5', output: '15', explain: 'cap 15: [1..5] [6,7] [8] [9] [10] = 5 din ✓. cap 14 → 6 din ✗.', viz: { weights: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10', days: '5' } },
          { input: 'weights = [3,2,2,4,1,4], days = 3', output: '6', explain: 'cap 6: [3,2] [2,4] [1,4] = 3 din ✓.', viz: { weights: '3, 2, 2, 4, 1, 4', days: '3' } },
          { input: 'weights = [1,2,3,1,1], days = 4', output: '3', explain: 'cap 3: [1,2] [3] [1,1] = 3 din ✓ (max weight 3 se kam ho hi nahi sakta).', viz: { weights: '1, 2, 3, 1, 1', days: '4' } },
        ],
        constraints: ['1 ≤ days ≤ weights.length ≤ 5 · 10⁴', '1 ≤ weights[i] ≤ 500'],
      },
    },

    410: {
      oneLine: 'Largest sum ki value pe binary search [max, sum]: greedy se parts gino, <= k toh chhota try karo.',
      pattern: 'Binary Search on Answer',
      approaches: [
        {
          level: 'Brute', idea: 'Har possible largest-sum cap = max..sum ek-ek karke try karo, greedy se parts gino. Pehla cap jisme parts <= k.',
          time: 'O(n · (sum − max))', space: 'O(1)',
          code: `public int splitArray(int[] nums, int k) {
    int lo = 0, hi = 0;
    for (int x : nums) { lo = Math.max(lo, x); hi += x; }
    for (int cap = lo; cap <= hi; cap++) {
        int parts = 1, sum = 0;
        for (int x : nums) {
            if (sum + x > cap) { parts++; sum = 0; }
            sum += x;
        }
        if (parts <= k) return cap;
    }
    return hi;
}`,
        },
        {
          level: 'Better', idea: 'DP: dp[i][j] = pehle i elements ko j parts me todne pe minimum largest sum. dp[i][j] = min over p of max(dp[p][j−1], sum(p..i−1)). Prefix sum se range sum O(1).',
          time: 'O(k · n²)', space: 'O(n · k)',
          code: `public int splitArray(int[] nums, int k) {
    int n = nums.length;
    long[] pre = new long[n + 1];
    for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + nums[i];
    long[][] dp = new long[n + 1][k + 1];
    for (long[] row : dp) Arrays.fill(row, Long.MAX_VALUE);
    dp[0][0] = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= Math.min(i, k); j++) {
            for (int p = j - 1; p < i; p++) {
                if (dp[p][j - 1] == Long.MAX_VALUE) continue;
                long cand = Math.max(dp[p][j - 1], pre[i] - pre[p]);
                dp[i][j] = Math.min(dp[i][j], cand);
            }
        }
    }
    return (int) dp[n][k];
}`,
        },
        {
          level: 'Optimal', idea: 'LC 1011 jaisa hi: cap = allowed largest sum. canSplit(cap) greedy (parts <= k?). Range [max, sum] pe lower bound.',
          time: 'O(n log(sum))', space: 'O(1)',
          code: `public int splitArray(int[] nums, int k) {
    int lo = 0, hi = 0;
    for (int x : nums) {
        lo = Math.max(lo, x);
        hi += x;
    }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canSplit(nums, k, mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

private boolean canSplit(int[] nums, int k, int cap) {
    int parts = 1, sum = 0;
    for (int x : nums) {
        if (sum + x > cap) {
            parts++;
            sum = 0;
        }
        sum += x;
    }
    return parts <= k;
}`,
        },
      ],
      dryRun: '[7,2,5,10,8], k=2 → [10,32]: mid=21 (2 parts ✓) hi=21; mid=15 (3 ✗) lo=16; mid=18 (2 ✓) hi=18; mid=17 (3 ✗) lo=18 → 18',
      interview: 'I flip the question: instead of choosing split points, I guess the largest allowed subarray sum and check whether k parts are enough. The guess lies between the max element and the total sum, and a larger guess never needs more parts, so the check is monotonic. The check is greedy: extend the current part until adding the next number would exceed the cap, then start a new part. Binary searching the cap gives O(n log(sum)) time and O(1) space, versus O(k·n²) for the DP.',
      problem: {
        statement: 'Integer array <b>nums</b> aur integer <b>k</b> diya hai. nums ko <b>k non-empty continuous subarrays</b> me todo taaki in subarrays ke sums me se <b>sabse bada sum minimum</b> ho. Woh minimum largest sum return karo.',
        examples: [
          { input: 'nums = [7,2,5,10,8], k = 2', output: '18', explain: 'Best split [7,2,5] | [10,8] → sums 14, 18 → largest 18.', viz: { nums: '7, 2, 5, 10, 8', k: '2' } },
          { input: 'nums = [1,2,3,4,5], k = 2', output: '9', explain: '[1,2,3] | [4,5] → 6, 9 → 9.', viz: { nums: '1, 2, 3, 4, 5', k: '2' } },
          { input: 'nums = [1,4,4], k = 3', output: '4', explain: 'Har element alag part → largest = 4.', viz: { nums: '1, 4, 4', k: '3' } },
        ],
        constraints: ['1 ≤ nums.length ≤ 1000', '0 ≤ nums[i] ≤ 10⁶', '1 ≤ k ≤ min(50, nums.length)'],
      },
    },
  },

  // ---------------- DAYS (Weeks 9–10) ----------------
  days: [
    {
      day: 1, week: 1, dow: 'Mon', type: 'learn', title: 'Binary Search Basics (lo / mid / hi)',
      theory: ['Search space aadha karna → O(log n)', 'lo, hi, mid + overflow-safe mid', 'Template A: while (lo <= hi)', 'Iterative vs recursive'],
      qs: [704],
      interview: {
        q: 'Explain binary search and why it is O(log n).',
        a: 'Binary search works on a sorted or monotonic search space. I look at the middle element and compare it with the target; since everything on one side is known to be too small or too large, I can throw that half away. Each comparison halves the remaining range, so after k steps only n / 2^k elements are left, and it ends after about log2(n) steps — around 20 comparisons for a million elements. I compute mid as lo + (hi − lo) / 2 to avoid integer overflow.',
      },
    },
    {
      day: 2, week: 1, dow: 'Tue', type: 'learn', title: 'Lower Bound — Search Insert Position',
      theory: ['F F F T T T — pehla T dhundo', 'Template B: while (lo < hi), hi = mid', 'hi = n kyun (end me insert)', 'Arrays.binarySearch ka -(ip) - 1'],
      qs: [35, 704],
      interview: {
        q: 'What is a lower bound and how is it different from a normal binary search?',
        a: 'A lower bound is the first index whose value is greater than or equal to the target. A normal binary search stops as soon as it finds an exact match, while a lower bound search never stops early — it keeps shrinking the range until lo equals hi, so it always lands on a boundary. I use the half-open range [0, n): if nums[mid] < target I set lo = mid + 1, otherwise hi = mid. It gives the insert position, the first occurrence among duplicates, and with a small change the upper bound.',
      },
    },
    {
      day: 3, week: 1, dow: 'Wed', type: 'learn', title: 'Search Space = Answer Range (Sqrt)',
      theory: ['Array nahi, answer ki range 0..x', 'Aakhri mid jahan mid² <= x (floor)', 'ans variable wala template', '(long) mid * mid — overflow'],
      qs: [69],
      interview: {
        q: 'How do you binary search when there is no array?',
        a: 'Binary search only needs a monotonic condition over an ordered range, not an actual array. For square root, the candidates are the integers from 0 to x, and the condition mid * mid <= x is true for a prefix of that range and false afterwards. So I binary search the range directly, keep the last value where the condition held, and return it. The same idea — searching over possible answers — powers problems like Koko Eating Bananas and Ship Within D Days.',
      },
    },
    {
      day: 4, week: 1, dow: 'Thu', type: 'learn', title: 'Rotated Array — Find Minimum',
      theory: ['Rotation = ek "drop" point', 'nums[mid] vs nums[hi]', 'hi = mid kyun, hi = mid − 1 kyun nahi', 'Not rotated case'],
      qs: [153],
      interview: {
        q: 'Why do you compare nums[mid] with nums[hi] and not nums[lo] in Find Minimum?',
        a: 'Comparing with nums[hi] gives an unambiguous answer. If nums[mid] > nums[hi], the drop must be between mid and hi, so the minimum is strictly to the right. If nums[mid] < nums[hi], the segment from mid to hi is sorted, so the minimum is mid or to its left. Comparing with nums[lo] is ambiguous: nums[lo] < nums[mid] happens both when the array is not rotated, where the minimum is at lo, and when the drop is to the right of mid. So nums[hi] keeps the logic simple and correct.',
      },
    },
    {
      day: 5, week: 1, dow: 'Fri', type: 'learn', title: 'Rotated Array — Search Target',
      theory: ['Ek half hamesha sorted', 'nums[lo] <= nums[mid] → left sorted', 'Range check: lo <= t < mid', 'One pass vs pivot + binary search'],
      qs: [33, 153],
      interview: {
        q: 'How do you search in a rotated sorted array in O(log n)?',
        a: 'At every step at least one half around mid is sorted. If nums[lo] <= nums[mid], the left half is sorted, so I check whether the target lies between nums[lo] and nums[mid]; if yes I search left, otherwise right. If the left half is not sorted, the right half is, and I do the mirror check with nums[mid] and nums[hi]. Each step discards half the range, so it stays O(log n) with O(1) space.',
      },
    },
    {
      day: 6, week: 1, dow: 'Sat', type: 'revision', title: 'Revision — Week 1 (Binary Search)',
      theory: ['Bina dekhe re-solve: 35, 69, 153, 33', 'Template A vs B zubaani bolo', 'Timer: Easy 15 min, Medium 25 min', 'System Design session (1/week)'],
      qs: [35, 69, 153, 33],
      interview: {
        q: 'How do you avoid off-by-one errors in binary search?',
        a: 'I decide the invariant before writing code. For an exact match I use a closed range with while (lo <= hi), and move to mid + 1 or mid − 1 because mid has already been checked. For a boundary search I use while (lo < hi) and set hi = mid, because mid may itself be the answer; with a lower mid this always shrinks the range. Then I dry-run on one and two elements and on targets smaller and larger than everything. Those four cases catch nearly every off-by-one bug.',
      },
    },
    {
      day: 7, week: 1, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest',
      theory: ['30 min: Tum interviews Sohvi (LC 35 bina dekhe)', '30 min: Sohvi interviews Tum (LC 153 bina dekhe)', '30 min: Weekly contest discussion', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [35, 153],
      interview: {
        q: 'How do you explain your code while writing it in an interview?',
        a: 'I first state the plan in one or two sentences, including the invariant — for binary search, what lo and hi mean. While coding I narrate each block briefly: why the loop condition is lo < hi, why I move hi to mid and not mid − 1. I avoid long silences, but I also do not narrate every keystroke. After coding I walk through a small example aloud, tracking lo, hi and mid, and then mention edge cases and complexity.',
      },
    },
    {
      day: 8, week: 2, dow: 'Mon', type: 'learn', title: 'Binary Search on Answer — Koko',
      theory: ['"Minimum speed such that..." = answer pe BS', 'Monotonic: k badha → hours kam', 'Range [1, max(piles)]', 'Ceil division (p − 1) / k + 1'],
      qs: [875],
      interview: {
        q: 'How do you recognize a "binary search on answer" problem?',
        a: 'The signals are: the problem asks for the minimum or maximum value of something — a speed, capacity, or largest sum — and there is a way to check a guessed value quickly. The key is monotonicity: if a value works, every larger value also works, or vice versa. Then I define the range of possible answers, write a feasibility check that is usually a greedy O(n) pass, and binary search for the first value that passes. Total complexity is O(n log range).',
      },
    },
    {
      day: 9, week: 2, dow: 'Tue', type: 'learn', title: 'Binary Search on Answer — Ship Within D Days',
      theory: ['lo = max(weights), hi = sum(weights)', 'Greedy days count: overflow → naya din', 'Order fix hai → greedy safe', 'Template same as Koko'],
      qs: [1011],
      interview: {
        q: 'Why is the greedy check correct in Ship Within D Days?',
        a: 'Packages must ship in order, so the only decision is where each day ends. Loading as many packages as fit before starting a new day can never hurt: if any valid schedule exists for a capacity, pushing packages earlier keeps every later day lighter or equal. So the greedy count is the minimum number of days for that capacity. Combined with monotonicity — larger capacity never needs more days — binary search over capacity finds the answer.',
      },
    },
    {
      day: 10, week: 2, dow: 'Wed', type: 'learn', title: 'Split Array Largest Sum (Hard)',
      theory: ['Minimize the maximum → answer pe BS', 'LC 1011 jaisa hi check (parts <= k)', 'DP O(k·n²) vs BS O(n log sum)', 'Zero values ka case'],
      qs: [410, 1011],
      interview: {
        q: 'Walk me through Split Array Largest Sum.',
        a: 'I flip the problem: instead of choosing where to split, I guess the largest allowed subarray sum and ask whether k parts are enough. The guess is between the max element and the total sum. Checking a guess is greedy — keep adding numbers to the current part and start a new part when the next number would exceed the guess. A larger guess never needs more parts, so I binary search for the smallest guess that needs at most k parts. That is O(n log(sum)) time and O(1) space, much faster than the O(k·n²) DP.',
      },
    },
    {
      day: 11, week: 2, dow: 'Thu', type: 'learn', title: 'Doosra approach: Pivot + Binary Search',
      theory: ['LC 153 se pivot nikalo', 'Pivot ke baad kaunsa sorted part', 'Do binary search = still O(log n)', 'Recursive binary search (LC 704) revisit'],
      qs: [33, 704],
      interview: {
        q: 'Compare the one-pass and two-pass approaches for searching a rotated array.',
        a: 'The two-pass approach first finds the pivot — the index of the minimum — with the Find Minimum technique, then decides which sorted part can contain the target and runs a standard binary search there. It reuses two simple templates, so it is easy to get right. The one-pass approach checks which half is sorted at each step and decides direction directly. Both are O(log n) time and O(1) space; the one-pass version does fewer comparisons, the two-pass version is easier to debug.',
      },
    },
    {
      day: 12, week: 2, dow: 'Fri', type: 'learn', title: 'Catch-up: DP vs Binary Search (Split Array)',
      theory: ['LC 410 ka DP approach', 'dp[i][j] = first i, j parts', 'Kab DP, kab BS on answer', 'Koko / Ship re-solve timer ke saath'],
      qs: [410, 875],
      interview: {
        q: 'When would you prefer DP over binary search on the answer?',
        a: 'Binary search on the answer needs two things: a monotonic feasibility condition and a fast check, usually a greedy pass. When both exist, it is typically faster and uses O(1) space. DP is more general: it works when the greedy check is not valid, when I need the actual partition or the count of ways, or when the cost function is not monotonic. For Split Array Largest Sum both work, but binary search is O(n log sum) versus O(k·n²) for DP.',
      },
    },
    {
      day: 13, week: 2, dow: 'Sat', type: 'revision', title: 'Revision — Week 2 (Search on Answer)',
      theory: ['Bina dekhe re-solve: 704, 875, 1011, 410', 'feasible() greedy check 5 min me likho', 'Range lo/hi ka reason bolo', 'System Design session (1/week)'],
      qs: [704, 875, 1011, 410],
      interview: {
        q: 'What is the complexity of binary search on the answer, and what dominates it?',
        a: 'It is O(C · log R), where R is the size of the answer range and C is the cost of one feasibility check. For Koko, Ship Within D Days and Split Array, the check is a linear greedy pass, so the total is O(n log R) — with R being the max pile or the total weight. Because the log of even 10^9 is only about 30, the check cost dominates. That is why I keep the check simple and O(n), and use long when sums could overflow.',
      },
    },
    {
      day: 14, week: 2, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest + Phase Test',
      theory: ['30 min: Tum interviews Sohvi (LC 69 bina dekhe)', '30 min: Sohvi interviews Tum (LC 1011 bina dekhe)', '30 min: Contest discussion', 'Phase test: Last Minute tab ki saari one-liners bolo'],
      qs: [69, 1011],
      interview: {
        q: 'Tell me about a time binary search was useful outside of a sorted array.',
        a: 'A common real case is tuning a numeric parameter where the outcome is monotonic — for example, finding the minimum batch size or thread count that keeps a job within its time limit, or the smallest capacity that handles a load test. Instead of trying every value, I treat it as binary search on the answer: pick a range, run the check at the midpoint, and halve the range. Tools like git bisect use the same idea to find the first bad commit in logarithmic steps.',
      },
    },
  ],

  // ---------------- LAST MINUTE ----------------
  lastMinute: {
    triggers: [
      ['Sorted array + O(log n) + exact index', 'Classic binary search (lo <= hi)'],
      ['Insert position / first >= x / first occurrence', 'Lower bound (lo < hi, hi = mid)'],
      ['Integer sqrt / last value with cond true', 'Binary search + ans variable (floor)'],
      ['Rotated sorted, find min', 'nums[mid] > nums[hi] → lo = mid + 1, else hi = mid'],
      ['Rotated sorted, find target', 'Sorted half pehchano, target range check'],
      ['"Minimum speed / capacity such that within h / D"', 'Binary search on answer + greedy check'],
      ['"Minimize the maximum" (split into k parts)', 'Binary search on answer [max, sum]'],
    ],
    edge: [
      'Single element array',
      'Target sabse chhota / sabse bada / missing',
      'Rotated array jo actually rotate nahi hua (n baar)',
      'x = 0, x = 1, x = 2³¹ − 1 (LC 69)',
      'h == piles.length → answer = max pile (LC 875)',
      'k == n (har element alag part) ya days == n',
    ],
    mistakes: [
      '(lo + hi) / 2 → overflow. Use lo + (hi − lo) / 2',
      'hi = mid ke saath while (lo <= hi) → infinite loop',
      'mid * mid int me → overflow (long cast karo)',
      'Koko me (p + k − 1) / k → p + k overflow; (p − 1) / k + 1 use karo',
      'Ship / Split me lo = 0 ya 1 rakhna (lo = max element hona chahiye)',
      'Rotated search me <= / < galat (target == nums[lo] case miss)',
    ],
  },
};
