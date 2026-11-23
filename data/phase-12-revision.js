window.PHASE_CONTENT = window.PHASE_CONTENT || {};

// Phase 12 — Revision + Mocks (Weeks 23–24). Koi naya question nahi: sirf Phases 1–11 ke course questions re-solve.
window.PHASE_CONTENT['revision'] = {
  intro: 'Last 2 weeks: koi naya topic nahi. Phases 1–11 ke course questions bina dekhe re-solve, pattern pehchaanna, aur roz mock-style bolke practice. Goal: Sohvi placement ready, Tum SDE-2 DSA round ready.',

  // ---------------- FUNDAMENTALS (Pattern master map) ----------------
  fundamentals: [
    {
      h: 'Revision ka tarika (in 2 weeks ke rules)',
      body: `<ul>
<li><b>Bina solution dekhe</b> re-solve. Pehle 5 min sirf socho + bolo (clarify → brute → optimal), phir code.</li>
<li><b>Timer:</b> Easy 15 min · Medium 25 min · Hard 40 min. Time khatam → hint ladder (Last Minute tab ka trigger) → phir bhi nahi → solution padho, <b>kal dobara</b> bina dekhe.</li>
<li><b>Mistake log:</b> har galti ek line me likho (e.g. "LC 3 — abba case me left peeche gaya"). Saturday ko sirf mistake log padho.</li>
<li><b>Bolke solve:</b> interview me code se zyada communication judge hota hai. Har question ka 1-minute answer English me bolo.</li>
<li><b>Course target (time ho toh):</b> Sohvi → 2 Easy + 1 Medium, Tum → 3 Medium + 1 Hard — sab course list se hi.</li>
</ul>
<p class="tip">Revision = naya padhna nahi, <b>yaad se nikaalna</b>. Jo bina dekhe nahi nikla, wahi asli weak spot hai.</p>`,
    },
    {
      h: 'Pattern master map — Part 1 (Arrays → Stack)',
      body: `<table class="tbl"><thead><tr><th>Pattern</th><th>Signal (question me kya dikhe)</th><th>Course questions</th></tr></thead><tbody>
<tr><td><b>Hashing (HashMap / HashSet)</b></td><td>"pair with sum", "seen before", "duplicate", O(n²) → O(n)</td><td>1, 217, 128</td></tr>
<tr><td><b>Prefix Sum (+ HashMap)</b></td><td>"subarray sum", "range sum", "sum = k" (negatives bhi)</td><td>1480, 238, 560, 525</td></tr>
<tr><td><b>Kadane</b></td><td>"max subarray sum"</td><td>53</td></tr>
<tr><td><b>Index as hash / Voting</b></td><td>values 1..n, O(1) space · majority &gt; n/2</td><td>1920, 41, 169</td></tr>
<tr><td><b>Two Pointers (opposite)</b></td><td>sorted array, pair/triplet, palindrome, "container"</td><td>125, 344, 167, 15, 11, 42</td></tr>
<tr><td><b>Read / Write pointer</b></td><td>"in-place remove / move", order maintain</td><td>26, 283</td></tr>
<tr><td><b>Sliding Window (fixed)</b></td><td>"subarray / substring of size k"</td><td>643, 1456</td></tr>
<tr><td><b>Sliding Window (variable)</b></td><td>"longest / shortest substring with condition", non-negative</td><td>3, 424, 1004, 209, 76</td></tr>
<tr><td><b>Linked List: reverse / dummy</b></td><td>"reverse", "merge", "remove node"</td><td>206, 21, 19, 25</td></tr>
<tr><td><b>Slow / Fast pointers</b></td><td>"middle", "cycle", "nth from end", "reorder"</td><td>876, 141, 142, 143</td></tr>
<tr><td><b>Stack (matching)</b></td><td>brackets, "undo", design with O(1) min</td><td>20, 155, 232, 225</td></tr>
<tr><td><b>Monotonic Stack</b></td><td>"next greater / smaller", "how many days until", histogram</td><td>739, 496, 84</td></tr>
</tbody></table>`,
    },
    {
      h: 'Pattern master map — Part 2 (Binary Search → DP)',
      body: `<table class="tbl"><thead><tr><th>Pattern</th><th>Signal (question me kya dikhe)</th><th>Course questions</th></tr></thead><tbody>
<tr><td><b>Binary Search (classic / lower bound)</b></td><td>sorted array, "insert position", O(log n)</td><td>704, 35, 69</td></tr>
<tr><td><b>Binary Search (rotated)</b></td><td>"rotated sorted", ek half hamesha sorted</td><td>33, 153</td></tr>
<tr><td><b>Binary Search on Answer</b></td><td>"minimum speed / capacity / largest sum such that…", monotonic feasible()</td><td>875, 1011, 410</td></tr>
<tr><td><b>Tree DFS (recursion)</b></td><td>depth, same/mirror, invert, diameter, LCA</td><td>104, 100, 226, 101, 543, 236</td></tr>
<tr><td><b>Tree BFS (level order)</b></td><td>"level by level", "right side view"</td><td>102, 199</td></tr>
<tr><td><b>BST property</b></td><td>"BST", "kth smallest", "validate" → inorder sorted / range</td><td>230, 98</td></tr>
<tr><td><b>Heap / Top K</b></td><td>"kth largest", "top k", "k closest", stream median</td><td>703, 1046, 215, 347, 973, 295</td></tr>
<tr><td><b>Backtracking</b></td><td>"all subsets / permutations / combinations", "partition", grid word</td><td>46, 78, 39, 40, 90, 131, 79</td></tr>
<tr><td><b>Graph DFS / BFS (grid)</b></td><td>"islands", "flood fill", "rotting" (multi-source BFS), "reach both oceans"</td><td>733, 200, 994, 417, 841</td></tr>
<tr><td><b>Topological Sort</b></td><td>"prerequisites", "order of tasks", cycle in directed graph</td><td>207, 210</td></tr>
<tr><td><b>1D DP</b></td><td>"number of ways", "min cost", "max without adjacent"</td><td>70, 746, 198, 300, 139</td></tr>
<tr><td><b>Knapsack / 2D DP</b></td><td>"coins", "min coins / count ways", "two strings"</td><td>322, 518, 1143</td></tr>
</tbody></table>`,
    },
    {
      h: 'Constraints → complexity (pehle constraints padho)',
      body: `<table class="tbl"><thead><tr><th>n (approx)</th><th>Allowed complexity</th><th>Typical pattern</th></tr></thead><tbody>
<tr><td>n ≤ 20</td><td>O(2ⁿ), O(n!)</td><td>Backtracking (subsets, permutations)</td></tr>
<tr><td>n ≤ 10³</td><td>O(n²)</td><td>2D DP (LCS), nested loops</td></tr>
<tr><td>n ≤ 10⁵ – 10⁶</td><td>O(n), O(n log n)</td><td>Hashing, two pointers, sliding window, sort, heap</td></tr>
<tr><td>Value range bahut bada (10⁹)</td><td>O(log range)</td><td>Binary search on answer</td></tr>
</tbody></table>
<p class="tip">~10⁸ simple operations ≈ 1 second. Ye ek line bolne se interviewer ko dikhta hai ki tum optimize kyun kar rahe ho.</p>`,
    },
    {
      h: 'Final targets (course ke end pe)',
      body: `<table class="tbl"><thead><tr><th></th><th>Sohvi</th><th>Tum (Sohel)</th></tr></thead><tbody>
<tr><td>Daily (Phase 12)</td><td>2 Easy + 1 Medium</td><td>3 Medium + 1 Hard</td></tr>
<tr><td>LeetCode count</td><td>150–180 LC</td><td>250–300 LC (quality)</td></tr>
<tr><td>Coverage</td><td>Strong fundamentals, har pattern ka 1 Easy khud se</td><td>Blind 75 + NeetCode 150 mostly covered</td></tr>
<tr><td>Outcome</td><td>Placement ready</td><td>SDE-2 interview ready</td></tr>
<tr><td>Contest goal</td><td>Exposure</td><td>Speed</td></tr>
</tbody></table>
<p class="tip">Important Rule: <b>Sohvi ko apne pace pe mat kheecho.</b> Usko Why → Brute → Dry run chahiye; tumhe Pattern recognition → Optimization → Communication → Speed. Same journey, same speed nahi.</p>`,
    },
  ],

  // ---------------- OPERATIONS (Java collections cheat-sheet) ----------------
  operations: [
    { op: 'HashMap frequency', time: 'O(1) avg', note: 'getOrDefault se count', code: 'Map<Integer, Integer> map = new HashMap<>();\nmap.put(x, map.getOrDefault(x, 0) + 1);' },
    { op: 'HashSet seen', time: 'O(1) avg', note: 'add() false = pehle se tha', code: 'Set<Integer> seen = new HashSet<>();\nif (!seen.add(x)) return true;' },
    { op: 'Stack (ArrayDeque)', time: 'O(1)', note: 'Stack class mat use karo (synchronized, purana)', code: 'Deque<Integer> st = new ArrayDeque<>();\nst.push(x); st.peek(); st.pop(); st.isEmpty();' },
    { op: 'Queue (ArrayDeque)', time: 'O(1)', note: 'BFS ke liye', code: 'Queue<Integer> q = new ArrayDeque<>();\nq.offer(x); q.peek(); q.poll(); q.size();' },
    { op: 'Min heap', time: 'push/pop O(log n), peek O(1)', note: 'Default PriorityQueue = min heap', code: 'PriorityQueue<Integer> pq = new PriorityQueue<>();\npq.offer(x); pq.peek(); pq.poll();' },
    { op: 'Max heap', time: 'O(log n)', note: 'reverseOrder comparator', code: 'PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());' },
    { op: 'Heap with custom order', time: 'O(log n)', note: 'Integer.compare overflow-safe', code: 'PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));' },
    { op: 'Sort array / list', time: 'O(n log n)', note: 'Primitive: Dual-Pivot QuickSort · Object: TimSort (stable)', code: 'Arrays.sort(arr);\nCollections.sort(list);\nArrays.sort(intervals, (a, b) -> a[0] - b[0]);' },
    { op: 'Adjacency list', time: 'O(V + E) build', note: 'Graph problems (207, 210, 841)', code: 'List<List<Integer>> adj = new ArrayList<>();\nfor (int i = 0; i < n; i++) adj.add(new ArrayList<>());\nadj.get(u).add(v);' },
    { op: 'Grid 4 directions', time: 'O(1) per cell', note: 'Islands, flood fill, rotting oranges', code: 'int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};\nfor (int[] d : dirs) { int nr = r + d[0], nc = c + d[1]; }' },
    { op: 'Backtracking copy', time: 'O(k)', note: 'Result me naya list daalo, warna sab same reference', code: 'res.add(new ArrayList<>(cur));\ncur.remove(cur.size() - 1);' },
    { op: 'String building', time: 'O(1) amortized append', note: 'Loop me + mat karo', code: 'StringBuilder sb = new StringBuilder();\nsb.append(c); sb.reverse(); sb.toString();' },
    { op: 'Char frequency array', time: 'O(1) access', note: 'Sirf lowercase ho toh 26 size', code: 'int[] cnt = new int[26];\ncnt[c - \'a\']++;' },
    { op: 'Safe mid / overflow', time: 'O(1)', note: 'Binary search + bade sums', code: 'int mid = lo + (hi - lo) / 2;\nlong sum = (long) a * b;' },
  ],

  // ---------------- PATTERNS (cross-phase master list) ----------------
  patterns: [
    {
      name: 'Hashing — complement / seen',
      signal: '"Pair with sum", "duplicate", "seen before", "consecutive sequence"',
      idea: 'Har element pe pucho: jo chahiye (target − x) pehle aaya kya? HashMap/HashSet O(1) lookup → O(n).',
      code: `Map<Integer, Integer> idx = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (idx.containsKey(need)) return new int[]{idx.get(need), i};
    idx.put(nums[i], i);
}`,
      qs: [1, 217, 128],
    },
    {
      name: 'Prefix Sum (+ HashMap)',
      signal: '"Subarray sum = k", "range sum", "equal 0 and 1", "product except self"',
      idea: 'sum(i..j) = pre[j] − pre[i−1]. Count chahiye toh map me prefix frequency, seed map.put(0, 1).',
      code: `Map<Integer, Integer> cnt = new HashMap<>();
cnt.put(0, 1);
int pre = 0, ans = 0;
for (int x : nums) {
    pre += x;
    ans += cnt.getOrDefault(pre - k, 0);
    cnt.put(pre, cnt.getOrDefault(pre, 0) + 1);
}`,
      qs: [1480, 238, 560, 525],
    },
    {
      name: 'Kadane / Voting / Index-as-hash',
      signal: '"Max subarray sum", "majority > n/2", "values in 1..n, O(1) space"',
      idea: 'Ek pass + chhota state: cur = max(x, cur + x) · candidate/count · value x ko index x−1 pe bhejo.',
      code: `int cur = 0, best = Integer.MIN_VALUE;
for (int x : nums) {
    cur = Math.max(x, cur + x);
    best = Math.max(best, cur);
}`,
      qs: [53, 169, 41, 1920],
    },
    {
      name: 'Two Pointers (opposite ends)',
      signal: 'Sorted array, pair/triplet sum, palindrome, container / water',
      idea: 'l = 0, r = n − 1. Har step pe jo pointer answer improve nahi kar sakta, use aage badhao → O(n).',
      code: `int l = 0, r = n - 1;
while (l < r) {
    int sum = nums[l] + nums[r];
    if (sum == target) return new int[]{l + 1, r + 1};
    if (sum < target) l++;
    else r--;
}`,
      qs: [125, 344, 167, 15, 11, 42],
    },
    {
      name: 'Read / Write pointers (in-place)',
      signal: '"In-place remove / move", "return new length", order same rakhna',
      idea: 'i har element padhta hai, k agli "keep" jagah. Keep condition pe nums[k++] = nums[i].',
      code: `int k = 0;
for (int i = 0; i < nums.length; i++) {
    if (nums[i] != 0) nums[k++] = nums[i];
}`,
      qs: [26, 283],
    },
    {
      name: 'Sliding Window (fixed + variable)',
      signal: '"Size k subarray", "longest / shortest substring with condition", non-negative values',
      idea: 'Right se expand, condition toote toh left se shrink. Har index max 2 baar → O(n).',
      code: `int l = 0, best = 0;
for (int r = 0; r < n; r++) {
    // add s[r] to window
    while (/* window invalid */ false) {
        // remove s[l]
        l++;
    }
    best = Math.max(best, r - l + 1);
}`,
      qs: [643, 1456, 3, 424, 1004, 209, 76],
    },
    {
      name: 'Linked List — reverse + dummy + slow/fast',
      signal: '"Reverse", "merge", "middle", "cycle", "nth from end", "reorder"',
      idea: 'prev/cur/next se reverse. Dummy node head change ke cases bachata hai. Slow 1 step, fast 2 step.',
      code: `ListNode prev = null, cur = head;
while (cur != null) {
    ListNode next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
}
return prev;`,
      qs: [206, 876, 21, 141, 142, 19, 143, 25],
    },
    {
      name: 'Stack + Monotonic Stack',
      signal: 'Brackets matching, "next greater / warmer", histogram, O(1) min',
      idea: 'Stack me indices rakho jinka answer abhi nahi mila. Naya element jo bada ho woh unka answer hai → pop. Har index ek baar push/pop → O(n).',
      code: `Deque<Integer> st = new ArrayDeque<>();
for (int i = 0; i < n; i++) {
    while (!st.isEmpty() && a[i] > a[st.peek()]) {
        int j = st.pop();
        ans[j] = i - j;
    }
    st.push(i);
}`,
      qs: [20, 232, 225, 155, 739, 496, 84],
    },
    {
      name: 'Binary Search (classic, rotated, on answer)',
      signal: 'Sorted / rotated array, "minimum X such that feasible", O(log n)',
      idea: 'Search space aadha karo. On answer: lo..hi = possible answers, feasible(mid) monotonic hai.',
      code: `int lo = 1, hi = maxValue;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (feasible(mid)) hi = mid;
    else lo = mid + 1;
}
return lo;`,
      qs: [704, 35, 69, 33, 153, 875, 1011, 410],
    },
    {
      name: 'Tree DFS / BFS / BST',
      signal: 'Depth, mirror, diameter, LCA (DFS) · level order, right view (BFS) · BST validate / kth',
      idea: 'DFS: child se answer lo, combine karo, upar bhejo. BFS: queue + level size. BST: inorder sorted, ya (lo, hi) range.',
      code: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      qs: [104, 100, 226, 101, 543, 236, 102, 199, 230, 98],
    },
    {
      name: 'Heap / Top K',
      signal: '"Kth largest", "top k frequent", "k closest", stream median',
      idea: 'Size k ka min-heap rakho (top = kth largest). Median: max-heap (left half) + min-heap (right half).',
      code: `PriorityQueue<Integer> pq = new PriorityQueue<>();
for (int x : nums) {
    pq.offer(x);
    if (pq.size() > k) pq.poll();
}
return pq.peek();`,
      qs: [703, 1046, 215, 347, 973, 295],
    },
    {
      name: 'Backtracking (choose → explore → unchoose)',
      signal: '"All subsets / permutations / combinations", "partition", word in grid',
      idea: 'Har level pe ek choice add karo, recurse, phir remove. Duplicates: sort + skip same at same level.',
      code: `void bt(int start, List<Integer> cur) {
    res.add(new ArrayList<>(cur));
    for (int i = start; i < nums.length; i++) {
        cur.add(nums[i]);
        bt(i + 1, cur);
        cur.remove(cur.size() - 1);
    }
}`,
      qs: [46, 78, 39, 40, 90, 131, 79],
    },
    {
      name: 'Graphs — Grid DFS/BFS + Topological Sort',
      signal: 'Islands, flood fill, rotting (multi-source BFS), oceans, rooms/keys, prerequisites',
      idea: 'Visited mark karke DFS/BFS. Directed dependencies → indegree + queue (Kahn); processed < n = cycle.',
      code: `Queue<Integer> q = new ArrayDeque<>();
for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
int done = 0;
while (!q.isEmpty()) {
    int u = q.poll();
    done++;
    for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);
}
return done == n;`,
      qs: [733, 841, 200, 994, 207, 210, 417],
    },
    {
      name: 'Dynamic Programming (1D, knapsack, 2D)',
      signal: '"Number of ways", "min / max cost", "can we make", overlapping subproblems',
      idea: 'State define karo (dp[i] = …), transition likho, base case, order. Pehle recursion + memo, phir table.',
      code: `int[] dp = new int[amount + 1];
Arrays.fill(dp, amount + 1);
dp[0] = 0;
for (int a = 1; a <= amount; a++)
    for (int c : coins)
        if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);`,
      qs: [70, 746, 198, 322, 300, 1143, 518, 139],
    },
  ],

  questions: {},

  // ---------------- DAYS ----------------
  days: [
    {
      day: 1, week: 1, dow: 'Mon', type: 'revision', title: 'Re-solve — Arrays + Hashing',
      theory: ['Complement HashMap (target − x)', 'Prefix × Suffix bina division', 'Timer: Easy 15 · Medium 25', 'Mistake log shuru'],
      qs: [1, 238],
      interview: {
        q: 'How do you decide between hashing and sorting for an array problem?',
        a: 'I look at what the problem needs. If I need original indices or a single pass with average O(1) lookups, a HashMap or HashSet gives O(n) time at the cost of O(n) memory — Two Sum is the classic case. If memory is tight, or the problem needs ordering anyway, I sort first and use two pointers, which is O(n log n) time and O(1) extra space, but I lose the original indices. I state both options and the trade-off, then pick based on the constraints the interviewer gives.',
      },
    },
    {
      day: 2, week: 1, dow: 'Tue', type: 'revision', title: 'Re-solve — Two Pointers',
      theory: ['Opposite ends: l = 0, r = n − 1', 'Chhote wale side ko move karo', 'Skip non-alphanumeric', 'Trapping water: leftMax / rightMax'],
      qs: [125, 42],
      interview: {
        q: 'When does the two-pointer technique work, and why is it correct?',
        a: 'Two pointers work when the input has structure that lets me discard options safely — usually a sorted array, or a property like a palindrome or a container bounded by the shorter side. At each step I can prove that moving one pointer never skips a better answer, so I explore all useful pairs in O(n) instead of O(n²). For trapping rain water, the side with the smaller max is the bottleneck, so its water level is already decided and I can move that pointer. It uses O(1) extra space.',
      },
    },
    {
      day: 3, week: 1, dow: 'Wed', type: 'revision', title: 'Re-solve — Sliding Window',
      theory: ['Fixed window: add right, remove left', 'Variable window: expand → shrink', 'Last-seen map se left jump', 'Har index max 2 baar → O(n)'],
      qs: [643, 3],
      interview: {
        q: 'How do you recognise a sliding window problem, and when does it fail?',
        a: 'The signal is a contiguous subarray or substring with a size or a condition — "size k", "longest without repeats", "smallest with sum at least target". I expand the right end, and when the window becomes invalid I shrink from the left, so every index enters and leaves at most once, giving O(n). It relies on monotonic behaviour: growing the window must only make it "more invalid". With negative numbers that breaks, because shrinking can increase the sum; then I switch to prefix sums with a HashMap.',
      },
    },
    {
      day: 4, week: 1, dow: 'Thu', type: 'revision', title: 'Re-solve — Binary Search',
      theory: ['lo <= hi vs lo < hi', 'Insert position = lo', 'Binary search on answer', 'feasible(mid) monotonic'],
      qs: [35, 875],
      interview: {
        q: 'Explain binary search on the answer.',
        a: 'Sometimes the array is not sorted, but the answer space is. In Koko Eating Bananas the speed ranges from 1 to the largest pile, and if a speed works, every larger speed also works — the feasibility is monotonic. So I binary search over speeds: for each mid I compute the hours needed in O(n); if it fits I try smaller, otherwise larger. Total time is O(n log maxPile). The same template solves ship capacity and split array largest sum.',
      },
    },
    {
      day: 5, week: 1, dow: 'Fri', type: 'revision', title: 'Re-solve — Linked List',
      theory: ['prev / cur / next reverse', 'Slow-fast se middle', 'Split → reverse → merge', 'Null checks pehle'],
      qs: [206, 143],
      interview: {
        q: 'How do slow and fast pointers work, and where do you use them?',
        a: 'I move slow one step and fast two steps at a time. When fast reaches the end, slow is at the middle, because it covered half the distance. If there is a cycle, fast eventually laps slow and they meet, which is Floyd’s algorithm. I use it for the middle of a list, cycle detection and the cycle start, and as the first step of Reorder List, where I split at the middle, reverse the second half and merge both halves alternately — all O(n) time and O(1) space.',
      },
    },
    {
      day: 6, week: 1, dow: 'Sat', type: 'revision', title: 'Revision — Stack + Monotonic Stack (Week 1 wrap-up)',
      theory: ['Brackets: stack me expected closer', 'Monotonic stack me indices', 'Min Stack: (val, min) pair', 'Histogram: sentinel 0 at end', 'System Design session (1/week)'],
      qs: [20, 739, 155, 84],
      interview: {
        q: 'What is a monotonic stack and why is it O(n)?',
        a: 'A monotonic stack keeps elements in increasing or decreasing order. For "next greater" problems I store indices whose answer is still unknown; when a new element is bigger than the top, it is the answer for that index, so I pop and record it. Each index is pushed once and popped at most once, so even with the inner while loop the total work is O(n). The same idea solves Daily Temperatures, Next Greater Element and Largest Rectangle in Histogram, where popping tells me the bar’s left and right boundaries.',
      },
    },
    {
      day: 7, week: 1, dow: 'Sun', type: 'mock', title: 'Full Mock Interview #1 + Contest',
      theory: ['30 min: Tum interviews Sohvi (LC 21 bina dekhe)', '30 min: Sohvi interviews Tum (LC 33 bina dekhe)', '30 min: Contest discussion', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [21, 33],
      interview: {
        q: 'Walk me through how you approach a coding interview from start to finish.',
        a: 'I start by restating the problem and asking clarifying questions about input size, edge cases and expected output. I work through a small example, then describe a brute force with its complexity so we have a baseline. Next I look for the pattern that removes repeated work and explain the optimal approach and its trade-offs before coding. I write clean code while talking through it, then dry-run it on the example and on edge cases like empty input or duplicates, and finally state the time and space complexity.',
      },
    },
    {
      day: 8, week: 2, dow: 'Mon', type: 'revision', title: 'Re-solve — Trees (DFS)',
      theory: ['Base case: null → 0', 'Child se lo, combine, upar bhejo', 'Global best (diameter)', 'Height vs diameter fark'],
      qs: [104, 543],
      interview: {
        q: 'How do you think about recursion on binary trees?',
        a: 'I trust the recursion: I define exactly what the function returns for a subtree, handle the null base case, and assume the calls on the left and right children already give correct answers. Then I combine them at the current node. For max depth, that is one plus the larger child depth. For the diameter, the function returns height, but at every node I also update a global best with left height plus right height, because the longest path may not pass through the root. Each node is visited once, so it is O(n) time and O(h) stack space.',
      },
    },
    {
      day: 9, week: 2, dow: 'Tue', type: 'revision', title: 'Re-solve — Trees (BFS + BST)',
      theory: ['Queue + level size snapshot', 'BST = range (lo, hi) check', 'long bounds (Integer edge)', 'Inorder of BST = sorted'],
      qs: [102, 98],
      interview: {
        q: 'BFS vs DFS on a tree — when do you use which?',
        a: 'BFS uses a queue and visits nodes level by level, so I use it when the answer is organised by levels — level order traversal, right side view, or the minimum depth. DFS uses recursion or a stack and is natural when a node’s answer depends on its children, like height, diameter, or validating a BST with a lower and upper bound passed down. Both are O(n) time; BFS uses O(width) memory and DFS uses O(height), which matters for very skewed or very wide trees.',
      },
    },
    {
      day: 10, week: 2, dow: 'Wed', type: 'revision', title: 'Re-solve — Heap / Top K',
      theory: ['Max heap: reverseOrder()', 'Top K: size-k min heap', 'freq map + heap', 'O(n log k) vs sort O(n log n)'],
      qs: [1046, 347],
      interview: {
        q: 'How does a heap help with top-k problems, and what is the complexity?',
        a: 'A heap gives O(1) access to the minimum or maximum and O(log n) insert and remove. For top k, I keep a min-heap of size k: I push each candidate and pop when the size exceeds k, so the heap always holds the k best seen so far and its top is the kth best. That is O(n log k) time and O(k) space, better than sorting at O(n log n) when k is small. For Top K Frequent I first count frequencies with a HashMap, then run the same heap on the distinct keys.',
      },
    },
    {
      day: 11, week: 2, dow: 'Thu', type: 'revision', title: 'Re-solve — Graphs',
      theory: ['Grid DFS: sink the island', 'Visited mark same grid me', 'Kahn: indegree + queue', 'processed < n → cycle'],
      qs: [200, 207],
      interview: {
        q: 'How do you detect a cycle in a directed graph?',
        a: 'I use either Kahn’s algorithm or DFS with colours. With Kahn’s, I compute the indegree of every node, push all nodes with indegree zero into a queue, and repeatedly pop a node and decrement its neighbours’ indegrees. If I process fewer nodes than exist, the remaining nodes are stuck in a cycle. With DFS, I mark nodes as visiting and visited; reaching a node that is still visiting means a back edge, which is a cycle. Both are O(V + E). Course Schedule is exactly this check.',
      },
    },
    {
      day: 12, week: 2, dow: 'Fri', type: 'revision', title: 'Re-solve — Backtracking',
      theory: ['Choose → explore → unchoose', 'start index = no repeat combos', 'Same i again = reuse allowed', 'new ArrayList<>(cur) copy'],
      qs: [78, 39],
      interview: {
        q: 'Explain backtracking and how you control duplicates and reuse.',
        a: 'Backtracking builds candidates step by step: I choose an option, recurse to explore, and then undo the choice so the next option starts from a clean state. A start index controls ordering, so I never produce the same combination in a different order. Passing i + 1 means each element is used once, as in Subsets; passing i again allows reuse, as in Combination Sum. If the input has duplicates I sort and skip equal values at the same level. Pruning, like stopping when the remaining target is negative, cuts the search tree.',
      },
    },
    {
      day: 13, week: 2, dow: 'Sat', type: 'revision', title: 'Revision — Dynamic Programming (Week 2 wrap-up)',
      theory: ['State → transition → base → order', 'Space optimise: 2 variables', 'Coin change: unbounded min', 'Word break: dp[j] && dict', 'System Design session (1/week)'],
      qs: [70, 198, 322, 139],
      interview: {
        q: 'How do you identify and build a DP solution?',
        a: 'I look for two things: the problem asks for a count, a minimum or maximum, or a yes or no over choices, and the same subproblems repeat. Then I define the state in words, like dp[i] is the best answer for the first i elements, write the transition from smaller states, set the base cases, and choose the fill order. I usually start with recursion plus memoisation, then convert to a bottom-up table and, if each state only depends on the last few, reduce space to a couple of variables.',
      },
    },
    {
      day: 14, week: 2, dow: 'Sun', type: 'mock', title: 'Final Mock + Course Completion Review',
      theory: ['30 min: Tum interviews Sohvi (LC 226 bina dekhe)', '30 min: Sohvi interviews Tum (LC 1143 bina dekhe)', '30 min: Contest discussion + course review', 'Targets: Sohvi 150–180 · Tum 250–300'],
      qs: [226, 1143],
      interview: {
        q: 'What do you do when you get stuck in an interview?',
        a: 'I do not go silent. I restate what I know, go back to a small example and solve it by hand, because the manual steps often reveal the pattern. I check the constraints to see what complexity is expected, and I run through likely patterns — hashing, two pointers, binary search, a heap or DP. If I am still stuck I offer the brute force and code it cleanly, then optimise one bottleneck at a time. I also take hints well: I repeat the hint in my own words and show how it changes the approach.',
      },
    },
  ],

  // ---------------- LAST MINUTE (master triggers) ----------------
  lastMinute: {
    triggers: [
      ['Pair with sum / complement (unsorted)', 'HashMap value → index (LC 1)'],
      ['Duplicate / seen before', 'HashSet'],
      ['Subarray sum = k (negatives bhi)', 'Prefix Sum + HashMap, put(0, 1)'],
      ['Product / sum except self', 'Prefix × Suffix'],
      ['Max subarray sum', 'Kadane'],
      ['Values 1..n, missing number, O(1) space', 'Cyclic sort (index as hash)'],
      ['Sorted array + pair / triplet', 'Two pointers (opposite)'],
      ['In-place remove / move, order same', 'Read / write pointers'],
      ['Water between bars', 'Two pointers + leftMax / rightMax'],
      ['Substring / subarray of size k', 'Fixed sliding window'],
      ['Longest / shortest with condition', 'Variable sliding window'],
      ['Reverse / merge list', 'prev-cur-next · dummy node'],
      ['Middle / cycle / nth from end', 'Slow-fast pointers'],
      ['Brackets / matching', 'Stack'],
      ['Next greater / warmer / histogram', 'Monotonic stack (indices)'],
      ['Sorted + O(log n)', 'Binary search'],
      ['Rotated sorted array', 'Binary search — kaunsa half sorted hai'],
      ['"Minimum X such that it is possible"', 'Binary search on answer'],
      ['Depth / diameter / LCA', 'Tree DFS (post-order)'],
      ['Level by level / right view', 'Tree BFS (queue + size)'],
      ['Validate BST / kth smallest', 'Range (lo, hi) · inorder'],
      ['Kth largest / top k / k closest', 'Size-k heap'],
      ['Median of stream', 'Two heaps'],
      ['All subsets / permutations / combinations', 'Backtracking'],
      ['Islands / flood fill / connected cells', 'Grid DFS / BFS'],
      ['Minimum time, spreading from many sources', 'Multi-source BFS'],
      ['Prerequisites / order / cycle (directed)', 'Topological sort (Kahn)'],
      ['Number of ways / min cost / no adjacent', '1D DP'],
      ['Coins, min count / number of ways', 'Knapsack DP'],
      ['Two strings compare', '2D DP (LCS style)'],
    ],
    edge: [
      'Empty input / 1 element / 2 elements',
      'All same values, all negative values',
      'Duplicates (Two Sum me same index do baar nahi)',
      'Integer overflow → long (sum, product, mid)',
      'k = 0, k = n, target = 0',
      'Linked list: null head, 1 node, even vs odd length',
      'Tree: null root, skewed tree (recursion depth), Integer.MIN/MAX values (BST)',
      'Grid: 1×1, all water, all land',
      'Graph: disconnected nodes, self-loop, no edges',
      'Sliding window: window kabhi valid hi na ho → 0 / "" return',
      'DP: amount = 0 → 0, unreachable → −1',
      'String: spaces, uppercase, non-alphanumeric characters',
    ],
    mistakes: [
      'Clarify kiye bina code shuru kar dena',
      'Brute force bole bina seedha optimal pe kudna (interviewer ko baseline chahiye)',
      'Two Sum me pehle put fir check → element khud se pair',
      'map.put(0, 1) bhoolna (prefix + map)',
      'Negatives ke saath sliding window lagana',
      'mid = (lo + hi) / 2 → overflow; lo + (hi − lo) / 2 likho',
      'lo <= hi aur lo < hi template mix karna → infinite loop',
      'Linked list me next save kiye bina link todna',
      'Integer objects ko == se compare karna → .equals()',
      'Backtracking me res.add(cur) (copy nahi) → sab lists khaali',
      'BFS me visited mark queue me daalte waqt nahi → duplicate visits',
      'Heap comparator a − b se overflow → Integer.compare',
      'DP me dp array ka size n ki jagah n + 1 bhoolna',
      'Dry run aur complexity bole bina "done" bolna',
    ],
  },
};
