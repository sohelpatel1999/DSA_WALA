// Phase 9 (Backtracking) — Week 1 lessons (local days 1–7). Day 1 (Phase 1) wale format me.
(function () {
  const P = window.PHASE_CONTENT['backtracking'];
  P.lessons = P.lessons || {};
  const Q = P.questions;
  const NAME = n => { for (const p of window.ROADMAP) for (const q of p.qs) if (q[0] === n) return q[1]; return ''; };

  // Tested approach code ko "class Solution { … }" me wrap karo
  const sol = (n, i) => 'class Solution {\n' + Q[n].approaches[i].code.split('\n').map(l => (l ? '    ' + l : l)).join('\n') + '\n}';
  // Cumulative revision card (Part 0)
  const rq = (n, one, ex, pattern, steps, code, hook) => [
    { h: `LC ${n} — ${NAME(n)}` }, { p: one }, { pre: ex }, { p: `<b>Pattern:</b> ${pattern}` },
    { olist: steps }, { code }, { tip: `Memory hook: <b>${hook}</b>` },
  ];
  // Learn day (Part 0 … Part 14)
  const learn = o => ({
    title: o.title, goal: o.goal, main: o.main,
    parts: [
      { title: `Part 0 — Cumulative Revision (${o.revTitle})`, blocks: [{ p: 'Naya topic se pehle 10 min: pichle questions zubaani + code skeleton. Pehle khud bolo, phir card padho.' }].concat(o.rev) },
      { title: 'Part 1 — ' + o.c1, blocks: o.concept },
      { title: `Part 2 — Aaj ka problem: LC ${o.main} ${NAME(o.main)}`, blocks: [{ problem: o.main }].concat(o.p2 || []) },
      { title: 'Part 3 — Thinking: ' + (o.t3 || 'Brute → Optimal'), blocks: o.think },
      { title: 'Part 4 — Dry run: ' + o.d4, blocks: o.dry },
      { title: 'Part 5 — Complete Java code + har line ka purpose', blocks: o.code },
      { title: 'Part 6 — Visualize: ' + o.v6, blocks: [{ list: o.look }].concat(o.viz.map(v => ({ viz: v[0], ex: v[1] || 0, variant: v[2] || 0 }))) },
      { title: 'Part 7 — Edge cases', blocks: [{ table: { head: ['Input', 'Output', 'Kyun'], rows: o.edge } }].concat(o.edgeNote ? [{ p: o.edgeNote }] : []) },
      { title: 'Part 8 — Complexity', blocks: [{ table: { head: ['Approach', 'Time', 'Extra space', 'Main idea'], rows: o.cx } }, { p: o.cxNote }] },
      { title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal', blocks: [{ p: 'Pehle khud jawab socho, phir click karke check karo.' }, { qa: o.qa }] },
      { title: 'Part 10 — Bade interview answers: aise bolo', blocks: [{ say: o.say }] },
      { title: 'Part 11 — Sohvi session', blocks: [{ olist: o.sohvi }] },
      { title: 'Part 12 — Sohel session (SDE-2 practice)', blocks: [{ olist: o.sohel }] },
      { title: 'Part 13 — Homework', blocks: [{ p: '<b>Dono:</b>' }, { list: o.hw }] },
      { title: 'Part 14 — Final self-test (bina notes)', blocks: [{ qa: o.test }] },
    ],
    checks: o.checks, memory: o.memory,
  });

  const pickCode = `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        pick(nums, 0, new ArrayList<>(), res);
        return res;
    }

    // index i ke liye do raaste: lo ya mat lo
    private void pick(int[] nums, int i, List<Integer> path, List<List<Integer>> res) {
        if (i == nums.length) {              // base case: saare elements ka decision ho gaya
            res.add(new ArrayList<>(path));
            return;
        }
        path.add(nums[i]);                   // include nums[i]
        pick(nums, i + 1, path, res);
        path.remove(path.size() - 1);        // undo
        pick(nums, i + 1, path, res);        // exclude nums[i]
    }
}`;

  Object.assign(P.lessons, {
    // ======================= DAY 1 =======================
    1: learn({
      title: 'Recursion Basics + Recursion Tree (Subsets)',
      goal: 'Recursion ka <b>base case + call stack</b> samajhna, kisi bhi recursion ka <b>tree</b> banana, aur usi tree se <b>LC 78 Subsets</b> ko pick/not-pick aur backtracking dono tarike se solve karna.',
      main: 78,
      revTitle: 'Trees + Linked List + Binary Search',
      rev: [].concat(
        rq(104, 'Binary tree ki maximum depth (root se sabse door leaf tak nodes).', 'root = [3,9,20,null,null,15,7] → 3\n    3\n   / \\\n  9  20\n    /  \\\n   15   7', 'Recursion (DFS) — answer = 1 + max(left, right)',
          ['Base case: null → 0.', 'Left subtree ki depth recursion se lo, right ki bhi.', 'Return 1 + max(L, R).'],
          `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`, 'Null = 0; mera = 1 + bade bachche ka. Aaj ka poora phase isi "khud ko call karo" pe hai.'),
        rq(206, 'Singly linked list ko reverse karo.', '1 → 2 → 3 → null  ⇒  3 → 2 → 1 → null', 'Three pointers (prev, cur, next) / recursion',
          ['prev = null, cur = head.', 'next save karo, cur.next = prev.', 'prev = cur, cur = next; end me prev return.'],
          `public ListNode reverseList(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`, 'Save next → ulta jodo → aage badho.'),
        rq(704, 'Sorted array me target ka index (nahi mila → −1).', 'nums = [-1,0,3,5,9,12], target = 9 → 4', 'Binary Search (lo ≤ hi)',
          ['lo = 0, hi = n − 1.', 'mid = lo + (hi − lo) / 2.', 'Bada → hi = mid − 1, chhota → lo = mid + 1.'],
          `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`, 'Aadha kaato, lo ≤ hi tak.'),
      ),
      c1: 'Concept: Recursion, call stack aur recursion tree',
      concept: [
        { p: '<b>Recursion</b> = function apne aap ko <b>chhote input</b> pe call karta hai. Do cheezein hamesha likho:' },
        { table: { head: ['Hissa', 'Kya', 'Example: sum(n) = 1+…+n'], rows: [
          ['<b>Base case</b>', 'Kab rukna hai (warna StackOverflowError)', '<code>if (n == 0) return 0;</code>'],
          ['<b>Recursive case</b>', 'Chhota problem + apna kaam', '<code>return n + sum(n - 1);</code>'],
        ] } },
        { p: 'Har call ka apna <b>stack frame</b> banta hai. <code>sum(3)</code> ka call stack:' },
        { pre: `push (neeche jaate hue)          pop (wapas aate hue)
| sum(0) | base → 0           sum(0) = 0
| sum(1) | waiting            sum(1) = 1 + 0 = 1
| sum(2) | waiting            sum(2) = 2 + 1 = 3
| sum(3) | waiting            sum(3) = 3 + 3 = 6  → main ko 6
| main   |` },
        { p: '<b>Recursion tree</b> = har call ek node, har choice ek edge. Subsets ke liye har element pe do choice: <b>lo (✓) ya mat lo (✗)</b>:' },
        { pre: `nums = [1,2,3]          i = 0 (1 ka decision)
                         []
              ✓1 /              \\ ✗1
              [1]                []            i = 1
          ✓2 /   \\ ✗2        ✓2 /  \\ ✗2
        [1,2]    [1]        [2]     []         i = 2
       ✓3/ \\✗3  ✓3/ \\✗3   ✓3/ \\✗3  ✓3/ \\✗3
  [1,2,3][1,2][1,3][1] [2,3][2]  [3]  []      i = 3 → base: 8 leaves
Depth = n = 3, leaves = 2³ = 8` },
        { tip: 'Tree ki <b>depth</b> = call stack ki max height = O(n). Tree ke <b>nodes</b> = kitna kaam. Interview me pehle tree, phir code.' },
      ],
      t3: 'Pick / not-pick → Backtracking (for-loop)',
      think: [
        { p: '<b>Soch 1 — har element ka decision (pick / not-pick):</b> index i pe do raaste — <code>nums[i]</code> path me daalo aur i+1 pe jao, ya bina daale i+1 pe jao. i == n → ek subset ready. Upar wala binary tree bilkul yahi hai.' },
        { code: pickCode },
        { p: '<b>Soch 2 — backtracking (for-loop style):</b> "Agla element kaun sa?" Har call me pehle current path ko answer maan lo (har node ek subset), fir <code>start..n−1</code> me se ek uthao aur <code>i + 1</code> se aage. <code>i + 1</code> ki wajah se peeche nahi jaate → [2,1] kabhi nahi banta, sirf [1,2].' },
        { pre: `For-loop tree (har node = ek subset):
                   []            start=0
          /        |       \\
        [1]       [2]      [3]    start=1,2,3
       /   \\       |
    [1,2] [1,3]  [2,3]
      |
   [1,2,3]          → 8 nodes, same 8 subsets` },
        { olist: [
          '<b>Choose:</b> <code>path.add(nums[i])</code>',
          '<b>Explore:</b> <code>backtrack(nums, i + 1, path, res)</code>',
          '<b>Unchoose:</b> <code>path.remove(path.size() - 1)</code> — taaki agla sibling saaf path se shuru ho.',
        ] },
        { tip: 'Dono O(n · 2ⁿ). Pick/not-pick = 2ⁿ leaves (answer sirf leaf pe). For-loop = 2ⁿ nodes (har node answer). Aage duplicates/pruning ke liye for-loop easy hai.' },
      ],
      d4: 'nums = [1, 2, 3] (backtracking)',
      dry: [
        { p: 'Har row = ek step. <b>Frame</b> = call stack ka top (start value). Path shared hai.' },
        { table: { head: ['#', 'Frame (top)', 'Action', 'path', 'res size'], rows: [
          ['1', 'bt(start=0)', 'res.add([])', '[]', '1'],
          ['2', 'bt(0), i=0', 'choose 1 → call bt(1)', '[1]', '1'],
          ['3', 'bt(start=1)', 'res.add([1])', '[1]', '2'],
          ['4', 'bt(1), i=1', 'choose 2 → call bt(2)', '[1,2]', '2'],
          ['5', 'bt(start=2)', 'res.add([1,2])', '[1,2]', '3'],
          ['6', 'bt(2), i=2', 'choose 3 → call bt(3)', '[1,2,3]', '3'],
          ['7', 'bt(start=3)', 'res.add([1,2,3]); loop nahi chala → pop', '[1,2,3]', '4'],
          ['8', 'bt(2)', 'unchoose 3; loop khatam → pop', '[1,2]', '4'],
          ['9', 'bt(1)', 'unchoose 2; i=2: choose 3 → bt(3)', '[1,3]', '4'],
          ['10', 'bt(start=3)', 'res.add([1,3]) → pop', '[1,3]', '5'],
          ['11', 'bt(1)', 'unchoose 3 → pop; bt(0) unchoose 1', '[]', '5'],
          ['12', 'bt(0), i=1', 'choose 2 → bt(2): res.add([2])', '[2]', '6'],
          ['13', 'bt(2), i=2', 'choose 3 → bt(3): res.add([2,3])', '[2,3]', '7'],
          ['14', 'bt(0), i=2', 'unchoose…, choose 3 → bt(3): res.add([3])', '[3]', '8'],
        ] } },
        { p: 'Final res (is order me): <code>[[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]</code> — LeetCode koi bhi order accept karta hai.' },
        { p: 'Max call stack = 4 frames (bt(0) → bt(1) → bt(2) → bt(3)) = n + 1.' },
      ],
      code: [
        { p: '<b>Backtracking (for-loop) — aaj ka main code</b>' },
        { code: sol(78, 2) },
        { lines: [
          ['res.add(new ArrayList<>(path));', 'Har node ek subset — path ki <b>copy</b> save (reference nahi, warna sab baad me khaali).'],
          ['for (int i = start; i < nums.length; i++)', 'Sirf start se aage ke elements — peeche jaaoge toh [2,1] jaisa duplicate order banega.'],
          ['path.add(nums[i]);', 'Choose — nums[i] ko subset me daala.'],
          ['backtrack(nums, i + 1, path, res);', 'Explore — naya frame, start = i + 1.'],
          ['path.remove(path.size() - 1);', 'Unchoose — last element hatao (index wala remove, O(1)).'],
          ['return res;', 'Saare frames khatam hone ke baad 2ⁿ subsets.'],
        ] },
        { tip: 'Base case kahan hai? Jab <code>start == n</code>, loop chalta hi nahi → method khud return. Alag <code>if</code> ki zaroorat nahi.' },
      ],
      v6: 'call stack badhta / ghatta dekho',
      look: [
        '<b>CALL STACK</b> panel: har <code>backtrack</code> call ek naya frame upar push hota hai, return pe pop.',
        '<b>recursion (call chain)</b> text: root se current frame tak ke paths — yahi tree ka current raasta hai.',
        '<b>path</b> array badhta (choose) aur ghatta (unchoose) hai — ek hi list share ho rahi hai.',
        '<b>res</b> stack me har node pe ek naya subset aata hai (hara = abhi add hua).',
      ],
      viz: [[78, 0, 0]],
      edge: [
        ['<code>[0]</code>', '<code>[[],[0]]</code>', 'n = 1 → 2 subsets, empty bhi'],
        ['<code>[5,-3]</code>', '<code>[[],[5],[5,-3],[-3]]</code>', 'Negative values se koi fark nahi — values compare hi nahi hote'],
        ['n = 10', '1024 subsets', '2¹⁰; har ek copy O(n) → ~10⁴ kaam, fast'],
        ['<code>[1,2,3]</code>', '8 subsets', 'Empty subset bhi answer ka hissa hai — bhoolna mat'],
      ],
      cx: [
        ['Pick / not-pick', 'O(n · 2ⁿ)', 'O(n) stack', '2ⁿ leaves, har leaf pe O(n) copy'],
        ['Backtracking (for-loop)', 'O(n · 2ⁿ)', 'O(n) stack', '2ⁿ nodes, har node pe copy'],
      ],
      cxNote: 'Output hi 2ⁿ subsets ka hai (average n/2 size) → O(n · 2ⁿ) se tez possible hi nahi. Output space ko alag bolo.',
      qa: [
        ['Recursion me base case na ho toh?', 'Calls kabhi nahi rukte, stack frames bharte jaate hain → <code>StackOverflowError</code>.'],
        ['n elements ke kitne subsets?', '2ⁿ — har element ke 2 options (in / out).'],
        ['<code>res.add(path)</code> likha toh kya hoga?', 'Sab entries same list ko point karengi; end me path khaali → sab <code>[]</code> dikhega.'],
        ['Recursion depth kitni hai?', 'Max n + 1 frames (start 0..n) → O(n) stack.'],
        ['<code>i + 1</code> ki jagah <code>start + 1</code> likha toh?', 'Galat: [1,3] ke baad 3 se pehle wale bhi aa sakte hain / duplicates banenge. Hamesha chosen index ke aage: i + 1.'],
        ['Pick/not-pick me answer kab record hota hai?', 'Sirf base case (i == n) pe, yaani leaf pe.'],
        ['For-loop style me answer kab record hota hai?', 'Har call ki shuruaat me — har node ek subset hai.'],
        ['<code>path.remove(path.size() - 1)</code> O(1) kyun?', 'ArrayList ka last element hatana — koi shift nahi hota.'],
      ],
      say: [
        ['Approach explain karo (Subsets)', 'Every element is either in a subset or not, so there are 2^n subsets. I use backtracking where every node of the recursion tree is a subset: on entering a call I add a copy of the current path to the result, then for each index from start to the end I add that element, recurse with i + 1 so I never revisit earlier elements, and remove it afterwards. The recursion depth is at most n, so extra space is O(n) apart from the output, and time is O(n·2^n) because of copying each subset.'],
        ['Follow-up: "Pick/not-pick vs for-loop?"', 'Both explore the same 2^n possibilities. Pick/not-pick makes a binary decision per index and records answers at the leaves, which maps neatly to dynamic programming later. The for-loop version treats every node as an answer and makes it easy to add duplicate skipping or pruning, so I prefer it for subset and combination problems.'],
        ['1-minute: Recursion + call stack', 'Recursion solves a problem by calling the same function on a smaller input until a base case. Each call gets its own stack frame with its parameters and locals; frames are pushed on the way down and popped on the way back. Without a reachable base case Java eventually throws StackOverflowError. In backtracking the depth equals the path length, so it is O(n).'],
      ],
      sohvi: [
        '<code>sum(3)</code> ka call stack paper pe banao — push aur pop dono.',
        'Subsets [1,2,3] ka pick/not-pick tree (8 leaves) khud banao.',
        'For-loop wala tree bhi banao — 8 nodes pe subsets likho.',
        'Part 4 jaisa dry-run table khud fill karo (pehle 8 rows).',
        'Visualizer me Example 1 chalao aur CALL STACK ko gino — max kitne frames?',
        'Backtracking code bina dekhe likhne ki koshish karo (copy wali line zaroor).',
      ],
      sohel: [
        '<b>Task A:</b> Dono codes (pick/not-pick + for-loop) memory se, 10 min me. LeetCode pe submit.',
        '<b>Task B:</b> Bina run kiye bolo: [1,2,3,4] pe for-loop version kis order me pehle 6 subsets deta hai.',
        '<b>Task C:</b> Part 10 ka approach answer 90 sec me bol ke record karo.',
        '<b>Task D:</b> Follow-up socho: "sirf size k ke subsets chahiye" — code me kya badlega? (path.size() == k pe record + return.)',
      ],
      hw: [
        'LC 78 backtracking version Accepted.',
        'Fundamentals tab: "Recursion tree" aur "Backtracking template" padho.',
        'Kal: LC 46 Permutations — problem pehle padh lo aur [1,2,3] ke 6 permutations haath se likho.',
      ],
      test: [
        ['[1,2] ke subsets?', '<code>[[], [1], [1,2], [2]]</code>'],
        ['Subsets ka time complexity aur kyun?', 'O(n · 2ⁿ) — 2ⁿ subsets, har copy O(n).'],
        ['Copy kyun zaroori?', 'path shared aur badalti rehti hai; copy us waqt ka snapshot leti hai.'],
        ['Base case ka kaam?', 'Recursion rokna; warna StackOverflowError.'],
        ['For-loop style me recursion call kis argument se?', '<code>backtrack(nums, i + 1, path, res)</code>'],
      ],
      checks: [
        'Base case + recursive case + call stack explain kar sakta/sakti hu',
        'Subsets [1,2,3] ka pick/not-pick tree banaya',
        'For-loop tree banaya aur har node pe subset likha',
        'Backtracking code bina dekhe likha aur Accepted hua',
        'Visualizer me CALL STACK ka push/pop dekha',
        '8 chhote interview sawaalon ke jawab diye',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Har node ek subset: pehle copy save, fir add → recurse(i+1) → remove.',
    }),

    // ======================= DAY 2 =======================
    2: learn({
      title: 'Backtracking Template: Choose → Explore → Unchoose (Permutations)',
      goal: 'Backtracking ka <b>universal template</b> (choose → explore → unchoose) pakka karna, <code>used[]</code> se "kaun pehle se liya" track karna, aur <b>LC 46 Permutations</b> solve karna.',
      main: 46,
      revTitle: 'Trees + Linked List + kal ka LC 78',
      rev: [].concat(
        rq(226, 'Binary tree ko mirror (left ↔ right) karo.', '    4            4\n   / \\    →     / \\\n  2   7        7   2', 'Recursion — swap children, dono subtree invert',
          ['null → null return.', 'left aur right swap karo.', 'Dono bachchon pe recursion.'],
          `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode t = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(t);
    return root;
}`, 'Swap karo, neeche bhi yahi karo.'),
        rq(21, 'Do sorted linked lists ko ek sorted list me merge karo.', '1→2→4 + 1→3→4 → 1→1→2→3→4→4', 'Recursion / dummy node',
          ['Koi list null → doosri return.', 'Chhota head chuno.', 'Uska next = merge(baaki, doosri).'],
          `public ListNode mergeTwoLists(ListNode a, ListNode b) {
    if (a == null) return b;
    if (b == null) return a;
    if (a.val <= b.val) { a.next = mergeTwoLists(a.next, b); return a; }
    b.next = mergeTwoLists(a, b.next);
    return b;
}`, 'Chhota aage, baaki recursion pe chhodo.'),
        rq(78, 'Saare subsets (kal ka).', '[1,2,3] → [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]', 'Backtracking — har node record, recurse(i + 1)',
          ['Call me pehle path copy save.', 'i = start..n−1: add, recurse(i + 1), remove.'],
          `void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(nums, i + 1, path, res);
        path.remove(path.size() - 1);
    }
}`, 'Har node ek subset.'),
      ),
      c1: 'Concept: Template — choose, explore, unchoose',
      concept: [
        { p: 'Backtracking = recursion tree ka DFS jisme <b>ek hi shared path</b> hai. Har edge pe 3 kaam:' },
        { table: { head: ['Step', 'Code', 'Kyun'], rows: [
          ['1. Choose', '<code>used[i] = true; path.add(nums[i]);</code>', 'Ek option liya'],
          ['2. Explore', '<code>backtrack(...)</code>', 'Is choice ke saath aage ka poora subtree'],
          ['3. Unchoose', '<code>path.remove(path.size() - 1); used[i] = false;</code>', 'State wapas — agla sibling saaf shuru ho'],
        ] } },
        { p: '<b>Unchoose bhool gaye toh?</b> [1,2,3] ke baad path [1,2,3] hi rahega, agla branch [1,2,3,3…] jaisa kachra banayega.' },
        { p: '<b>Copy bhool gaye toh?</b> (ye code chala ke dekha hai):' },
        { pre: `List<Integer> p = new ArrayList<>();
p.add(1); res.add(p);        // res = [[1]]
p.add(2); res.add(p);        // res = [[1,2],[1,2]]  ← dono same object!
p.remove(...); p.remove(...);
print(res) → [[], []]        // sab khaali` },
        { p: '<b>Subsets vs Permutations — loop ka fark:</b>' },
        { table: { head: ['', 'Subsets (LC 78)', 'Permutations (LC 46)'], rows: [
          ['Order matter?', 'Nahi', 'Haan'],
          ['Loop', '<code>i = start..n−1</code>', '<code>i = 0..n−1</code> (used skip)'],
          ['Answer kab', 'Har node', 'Sirf leaf (size == n)'],
          ['Count', '2ⁿ', 'n!'],
        ] } },
      ],
      t3: 'Iterative insert → Backtracking (used[])',
      think: [
        { p: '<b>Brute-ish (iterative insert):</b> [] se shuru. Har naye x ko har purani permutation ki har position pe ghusao: [] → [1] → [2,1],[1,2] → (3 ke liye 3 jagah ×2) = 6. Kaam karta hai par har step pe poori nayi lists banti hain.' },
        { p: '<b>Backtracking:</b> Position by position bharo. Har level pe sawaal: "agla number kaun?" — koi bhi jo abhi path me nahi. <code>used[i]</code> se O(1) me pata chalta hai (<code>path.contains</code> O(n) hota).' },
        { pre: `Level 0: 3 choices   →  [1]  [2]  [3]
Level 1: 2 choices   →  [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]
Level 2: 1 choice    →  6 leaves = 3 × 2 × 1 = 3!` },
        { olist: [
          'Base: <code>path.size() == n</code> → copy save, return.',
          'Loop i = 0..n−1: <code>used[i]</code> → continue.',
          'Choose (used + add) → explore → unchoose (remove + unused).',
        ] },
      ],
      d4: 'nums = [1, 2, 3] (used[])',
      dry: [
        { table: { head: ['#', 'Frame (top)', 'i', 'Action', 'path', 'used'], rows: [
          ['1', 'bt([])', '0', 'choose 1', '[1]', 'T F F'],
          ['2', 'bt([1])', '0', 'used → skip', '[1]', 'T F F'],
          ['3', 'bt([1])', '1', 'choose 2', '[1,2]', 'T T F'],
          ['4', 'bt([1,2])', '0,1', 'skip, skip; i=2 choose 3', '[1,2,3]', 'T T T'],
          ['5', 'bt([1,2,3])', '—', 'size 3 == n → res.add #1 → return', '[1,2,3]', 'T T T'],
          ['6', 'bt([1,2])', '2', 'unchoose 3', '[1,2]', 'T T F'],
          ['7', 'bt([1])', '1', 'unchoose 2', '[1]', 'T F F'],
          ['8', 'bt([1])', '2', 'choose 3 → bt([1,3]) → i=1 choose 2 → leaf #2', '[1,3,2]', 'T T T'],
          ['9', 'bt([])', '0', '…sab unchoose → path []', '[]', 'F F F'],
          ['10', 'bt([])', '1', 'choose 2 → [2,1,3] #3, [2,3,1] #4', '…', '…'],
          ['11', 'bt([])', '2', 'choose 3 → [3,1,2] #5, [3,2,1] #6', '…', '…'],
        ] } },
        { p: 'Result: <code>[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]</code>. Max stack = 4 frames (+ permute).' },
      ],
      code: [
        { code: sol(46, 1) },
        { lines: [
          ['new boolean[nums.length]', 'used[] — kaun sa index abhi path me hai. Default sab false.'],
          ['if (path.size() == nums.length)', 'Leaf: n elements ho gaye → ek permutation.'],
          ['res.add(new ArrayList<>(path));', 'Copy save.'],
          ['for (int i = 0; i < nums.length; i++)', '0 se — order matter karta hai, peeche wala bhi aage aa sakta hai.'],
          ['if (used[i]) continue;', 'Same element dobara nahi.'],
          ['used[i] = true; path.add(nums[i]);', 'Choose.'],
          ['backtrack(nums, used, path, res);', 'Explore.'],
          ['path.remove(...); used[i] = false;', 'Unchoose — ulte order me wapas.'],
        ] },
        { p: '<b>Iterative insert (alternative)</b>' },
        { code: sol(46, 0) },
      ],
      v6: 'used[] + path + call stack',
      look: [
        '<b>used[]</b> row: T = path me hai. Choose pe T, unchoose pe F.',
        '<b>nums</b> me hara/done = used; laal (skip) = <code>if (used[i]) continue</code>.',
        '<b>CALL STACK</b> 4 frames tak jaata hai (n + 1) — leaf pe res me naya answer.',
        'Example 2 ([0,1]) chalao — sirf 2 leaves.',
      ],
      viz: [[46, 0, 0]],
      edge: [
        ['<code>[1]</code>', '<code>[[1]]</code>', 'Root hi leaf ke baad: 1 permutation'],
        ['<code>[0,1]</code>', '<code>[[0,1],[1,0]]</code>', '2! = 2'],
        ['<code>[-1,5,0,3]</code>', '24 permutations', '4! — negative values se farq nahi'],
        ['n = 6', '720', 'Max constraint; 720 × 6 copy = chhota kaam'],
      ],
      edgeNote: 'Values distinct guaranteed hain — duplicates hote toh sort + skip lagta (Week 2 ka concept).',
      cx: [
        ['Iterative insert', 'O(n · n!)', 'O(n · n!) (lists)', 'Har x ko har position pe insert'],
        ['Backtracking used[]', 'O(n · n!)', 'O(n) stack + used', 'Position by position, leaf pe copy'],
      ],
      cxNote: 'n! leaves, har leaf pe O(n) copy. Internal nodes bhi ~e·n! hote hain — overall O(n · n!).',
      qa: [
        ['Permutations me loop 0 se kyun, start se kyun nahi?', 'Order matter karta hai — [2,1] bhi chahiye, toh peeche wale index bhi aage aa sakte hain.'],
        ['used[] ki jagah path.contains() chalega?', 'Chalega (values distinct), lekin O(n) per check; used[] O(1).'],
        ['Answer kab add hota hai?', 'Jab path.size() == n (leaf).'],
        ['n = 3 pe kitne leaves aur kitne total calls?', '6 leaves; calls 1 + 3 + 6 + 6 = 16.'],
        ['Unchoose me used[i] = false kyun?', 'Taaki agle branches me nums[i] dobara choose ho sake.'],
        ['Time complexity?', 'O(n · n!).'],
        ['Space (output chhod ke)?', 'O(n) — stack depth + path + used.'],
        ['Template ke 3 steps?', 'Choose → Explore → Unchoose.'],
      ],
      say: [
        ['Approach explain karo (Permutations)', 'I fill the permutation one position at a time with backtracking. At each level any element not yet used can go next, so I loop over all indices, skip those marked in a used array, mark and append the chosen one, recurse, then remove it and unmark it. When the path length equals n I copy it into the result. There are n! permutations and each copy is O(n), so the time is O(n·n!), with O(n) extra space for recursion, the path and the used array.'],
        ['Follow-up: "Backtracking ka general template?"', 'Every backtracking solution has the same shape: a base case that records or rejects the current partial solution, a loop over the available choices, and for each choice three steps — choose it by updating shared state, explore by recursing, and unchoose by restoring the state exactly. Pruning conditions go at the top of the loop to skip choices that cannot lead to an answer.'],
        ['1-minute: What is backtracking?', 'Backtracking is a depth-first search over partial solutions. I extend the solution one choice at a time, recurse, and undo the choice when I come back, so a single shared path is reused. If a partial solution violates a constraint I prune it early. It fits problems that ask for all subsets, permutations, combinations or arrangements.'],
      ],
      sohvi: [
        '[1,2,3] ke 6 permutations ka tree banao (3 → 2 → 1 branches).',
        'Template ke 3 steps apne shabdon me likho.',
        '"Copy bhool gaye" wala example khud chala ke dekho (ya paper pe trace karo).',
        'Visualizer me used[] row ko dhyan se dekho — kab T, kab F.',
        'Backtracking code likho; submit karo.',
      ],
      sohel: [
        '<b>Task A:</b> used[] version 8 min me memory se, Accepted.',
        '<b>Task B:</b> Iterative insert version bhi likho — dono ka output order compare karo.',
        '<b>Task C:</b> Interviewer bole "path.contains use karo" — trade-off batao.',
        '<b>Task D:</b> 1-minute "What is backtracking" bol ke practice (timer 60 sec).',
      ],
      hw: [
        'LC 46 used[] version Accepted.',
        'Visualizer me Example 1 poora step-by-step.',
        'Kal: Subsets ke 2 aur tarike (iterative + bitmask) — <code>1 &lt;&lt; i</code> kya karta hai, padh ke aana.',
      ],
      test: [
        ['[0,1] ke permutations?', '<code>[[0,1],[1,0]]</code>'],
        ['Permutations ka count?', 'n!'],
        ['used[] kyun?', 'Kaun sa element path me hai — O(1) check.'],
        ['Unchoose ka order?', 'Choose ka ulta: pehle path.remove, phir used[i] = false.'],
        ['Subsets vs Permutations loop?', 'Subsets: i = start.., Permutations: i = 0.. with used skip.'],
      ],
      checks: [
        'Choose / explore / unchoose template bina dekhe likh sakta/sakti hu',
        'Copy na karne ka bug samjha',
        '[1,2,3] permutation tree banaya',
        'used[] version Accepted',
        'Visualizer me used[] aur CALL STACK dekha',
        '8 chhote sawaal + 5 self-test sahi',
      ],
      memory: 'Choose → Explore → Unchoose. Permutation: 0 se loop, used skip, size == n pe copy.',
    }),

    // ======================= DAY 3 =======================
    3: learn({
      title: 'Subsets — 3 tarike: Backtracking, Iterative, Bitmask',
      goal: 'Same problem (<b>LC 78</b>) ke do aur approaches: <b>iterative doubling</b> aur <b>bitmask</b>. Bits ki basics (<code>1 &lt;&lt; i</code>, <code>mask &amp; (1 &lt;&lt; i)</code>) aur teeno ka comparison.',
      main: 78,
      revTitle: 'Trees + Heap + kal ka LC 46',
      rev: [].concat(
        rq(101, 'Tree apne center ke around mirror hai?', '    1\n   / \\\n  2   2\n / \\ / \\\n3  4 4  3  → true', 'Recursion on two nodes (mirror check)',
          ['isMirror(a, b): dono null → true; ek null → false.', 'a.val == b.val.', 'a.left vs b.right aur a.right vs b.left.'],
          `public boolean isSymmetric(TreeNode root) {
    return mirror(root.left, root.right);
}
private boolean mirror(TreeNode a, TreeNode b) {
    if (a == null || b == null) return a == b;
    return a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left);
}`, 'Bahar-bahar, andar-andar compare.'),
        rq(46, 'Saare permutations (kal ka).', '[1,2,3] → 6 orderings', 'Backtracking — used[], leaf pe copy',
          ['size == n → copy save.', 'i = 0..n−1, used skip.', 'mark + add → recurse → remove + unmark.'],
          `void bt(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {
    if (path.size() == nums.length) { res.add(new ArrayList<>(path)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true; path.add(nums[i]);
        bt(nums, used, path, res);
        path.remove(path.size() - 1); used[i] = false;
    }
}`, '0 se loop, used skip, leaf pe copy.'),
        rq(347, 'k sabse frequent elements.', 'nums = [1,1,1,2,2,3], k = 2 → [1,2]', 'HashMap count + min-heap size k (ya bucket sort)',
          ['HashMap me frequency.', 'Min-heap (freq se) me daalo, size > k → poll.', 'Heap me bache k = answer.'],
          `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> f = new HashMap<>();
    for (int x : nums) f.put(x, f.getOrDefault(x, 0) + 1);
    PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> f.get(a) - f.get(b));
    for (int x : f.keySet()) { pq.offer(x); if (pq.size() > k) pq.poll(); }
    int[] ans = new int[k];
    for (int i = 0; i < k; i++) ans[i] = pq.poll();
    return ans;
}`, 'Count karo, chhota heap k ka, sabse kam frequency bahar.'),
      ),
      c1: 'Concept: Bits se subset, aur "har element subsets double karta hai"',
      concept: [
        { p: '<b>Bitmask:</b> n bits ka number = ek subset. Bit i = 1 matlab nums[i] liya.' },
        { table: { head: ['mask', 'binary (bit2 bit1 bit0)', 'subset of [1,2,3]'], rows: [
          ['0', '000', '[]'], ['1', '001', '[1]'], ['2', '010', '[2]'], ['3', '011', '[1,2]'],
          ['4', '100', '[3]'], ['5', '101', '[1,3]'], ['6', '110', '[2,3]'], ['7', '111', '[1,2,3]'],
        ] } },
        { code: `1 << i              // sirf bit i on: 1 << 2 = 4 (100)
mask & (1 << i)     // != 0 → bit i on hai
(mask >> i) & 1     // same check, 0 ya 1 deta hai
1 << n              // total masks = 2^n` },
        { p: '<b>Iterative doubling:</b> Har naya element purane saare subsets ki copy me judta hai → count double.' },
        { pre: `start:   [[]]
x = 1:   [[], [1]]
x = 2:   [[], [1], [2], [1,2]]
x = 3:   [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]` },
        { tip: 'Teeno ka output same set hai (order alag). Bitmask aur iterative order LeetCode ke example jaisa hai.' },
      ],
      t3: 'Backtracking → Iterative → Bitmask',
      think: [
        { p: '<b>Backtracking</b> (Day 1) — recursion, O(n) stack.' },
        { p: '<b>Iterative:</b> recursion nahi chahiye? Har x ke liye <code>size = res.size()</code> pehle save karo (warna naye add hue subsets pe bhi loop chalega — infinite!), fir 0..size−1 ki copy + x.' },
        { p: '<b>Bitmask:</b> 0 se 2ⁿ − 1 tak har mask ek subset. Inner loop bits check karta hai. n ≤ 10 → 1024 masks. n &gt; 30 pe int me fit nahi — par itne bade n pe output hi impossible hai.' },
        { tip: '<code>int size = res.size()</code> loop se pehle — ye ek line bhool gaye toh loop kabhi khatam nahi hoga.' },
      ],
      d4: 'nums = [1, 2, 3] — iterative + bitmask',
      dry: [
        { p: '<b>Iterative</b>' },
        { table: { head: ['x', 'size', 'i', 'copy res[i]', 'naya subset', 'res size'], rows: [
          ['1', '1', '0', '[]', '[1]', '2'],
          ['2', '2', '0', '[]', '[2]', '3'],
          ['2', '2', '1', '[1]', '[1,2]', '4'],
          ['3', '4', '0', '[]', '[3]', '5'],
          ['3', '4', '1', '[1]', '[1,3]', '6'],
          ['3', '4', '2', '[2]', '[2,3]', '7'],
          ['3', '4', '3', '[1,2]', '[1,2,3]', '8'],
        ] } },
        { p: '<b>Bitmask</b> (mask 5 = 101):' },
        { table: { head: ['i', '1 << i', 'mask & (1 << i)', 'add?', 's'], rows: [
          ['0', '001', '001 ≠ 0', 'nums[0] = 1', '[1]'],
          ['1', '010', '000', '—', '[1]'],
          ['2', '100', '100 ≠ 0', 'nums[2] = 3', '[1,3]'],
        ] } },
      ],
      code: [
        { p: '<b>Iterative (cascading)</b>' },
        { code: sol(78, 0) },
        { lines: [
          ['res.add(new ArrayList<>());', 'Empty subset se shuru.'],
          ['int size = res.size();', 'Sirf purane subsets pe chalna hai — loop se pehle freeze.'],
          ['new ArrayList<>(res.get(i))', 'Purane subset ki copy (original ko mat chhedo).'],
          ['s.add(x); res.add(s);', 'Copy + x = naya subset.'],
        ] },
        { p: '<b>Bitmask</b>' },
        { code: sol(78, 1) },
        { lines: [
          ['mask < (1 << n)', '0..2ⁿ−1 — har mask ek subset.'],
          ['(mask & (1 << i)) != 0', 'Bit i on → nums[i] lo. Bracket zaroori (precedence!).'],
          ['res.add(s);', 'Har mask pe ek subset.'],
        ] },
      ],
      v6: 'Iterative aur Bitmask variants',
      look: [
        'Upar <b>Iterative</b> tab: res stack me kaunsa purana subset copy ho raha hai (neela) aur naya kaunsa bana (hara).',
        '<b>Bitmask</b> tab: mask row me bits, nums me kaun se elements liye gaye.',
        'Teeno tabs ka final <code>ret</code> same set — order sorted dikhaya hai.',
        'Recursion wale (Backtracking tab) me CALL STACK hai; in dono me sirf ek frame — fark dekho.',
      ],
      viz: [[78, 0, 1], [78, 0, 2]],
      edge: [
        ['<code>[0]</code>', '<code>[[],[0]]</code>', 'mask 0 → [], mask 1 → [0]'],
        ['n = 10', '1024', '1 << 10 = 1024 masks'],
        ['<code>[3,1]</code>', '<code>[[],[3],[1],[3,1]]</code>', 'Inner order input jaisa — LeetCode ok'],
      ],
      edgeNote: 'Precedence trap: <code>mask &amp; 1 &lt;&lt; i != 0</code> galat parse hota hai — hamesha <code>(mask &amp; (1 &lt;&lt; i)) != 0</code>.',
      cx: [
        ['Backtracking', 'O(n · 2ⁿ)', 'O(n) stack', 'Har node record'],
        ['Iterative', 'O(n · 2ⁿ)', 'O(1) extra', 'Har x subsets double'],
        ['Bitmask', 'O(n · 2ⁿ)', 'O(1) extra', '2ⁿ masks × n bits'],
      ],
      cxNote: 'Teeno optimal — output size hi n · 2ⁿ ka hai. Interview me backtracking default; follow-up me baaki do.',
      qa: [
        ['<code>1 &lt;&lt; 3</code> kitna?', '8.'],
        ['mask = 6, nums = [1,2,3] → subset?', '110 → bit1, bit2 → [2,3].'],
        ['Iterative me <code>size</code> pehle kyun save?', 'Loop ke andar res badhta hai; res.size() use kiya toh infinite loop.'],
        ['Bitmask kab nahi chalega?', 'n &gt; 31 (int) / 63 (long) — par tab output hi itna bada hai ki problem infeasible.'],
        ['Kaunsa approach recursion-free hai?', 'Iterative aur bitmask.'],
        ['Teeno ka time?', 'O(n · 2ⁿ).'],
        ['Iterative me res.get(i) copy kyun?', 'Seedha add kiya toh purana subset bhi badal jaayega.'],
        ['Bitmask order LeetCode example jaisa kyun?', 'Mask 0,1,2,3… → [], [1], [2], [1,2], …'],
      ],
      say: [
        ['Three ways to generate subsets', 'With backtracking, every node of the recursion tree is a subset, using O(n) stack. Iteratively, I start with the empty set and for each number append it to a copy of every existing subset, doubling the list. With bitmasks, each integer from 0 to 2^n − 1 encodes a subset where bit i means nums[i] is included. All three are O(n·2^n), which is optimal since that is the output size.'],
        ['Follow-up: "Why freeze size in the iterative version?"', 'Inside the inner loop I add new subsets to the same list. If the loop condition read res.size() each time, it would keep iterating over subsets just created and never terminate. Saving the size first means I only extend the subsets that existed before this element.'],
        ['1-minute: Why is O(n·2^n) optimal?', 'There are exactly 2^n subsets and on average each has n/2 elements, so just writing the output costs Θ(n·2^n). Any correct algorithm must do at least that much work, which is why all three approaches are optimal up to constants.'],
      ],
      sohvi: [
        'Mask 0..7 ki table khud banao (binary + subset).',
        'Iterative ki table (Part 4) bina dekhe fill karo.',
        'Iterative code likho — <code>size</code> wali line pe dhyan.',
        'Visualizer ke Iterative aur Bitmask tabs chalao.',
      ],
      sohel: [
        '<b>Task A:</b> Teeno versions 15 min me, sab Accepted.',
        '<b>Task B:</b> Bitmask ko subsets of size exactly k ke liye modify karo (<code>Integer.bitCount(mask) == k</code>).',
        '<b>Task C:</b> "Why O(n·2ⁿ) optimal" 60 sec me bolo.',
      ],
      hw: [
        'LC 78 iterative + bitmask dono Accepted.',
        'Kal: Permutations ka swap approach — [1,2,3] pe swap(0,2) ke baad array kya hoga, socho.',
      ],
      test: [
        ['mask 5 ([1,2,3])?', '[1,3]'],
        ['Iterative me x = 3 se pehle res size?', '4'],
        ['Bit i check ka expression?', '<code>(mask &amp; (1 &lt;&lt; i)) != 0</code>'],
        ['Kaunsa O(n) stack leta hai?', 'Backtracking.'],
        ['Total masks?', '<code>1 &lt;&lt; n</code> = 2ⁿ'],
      ],
      checks: [
        'Mask → subset convert kar sakta/sakti hu',
        'Iterative version bina dekhe likha',
        'Bitmask version bina dekhe likha',
        'Teeno approaches compare kar sakta/sakti hu',
        'Visualizer ke dono variants dekhe',
        'Self-test sahi',
      ],
      memory: 'Subsets 3 tarike: tree ka har node, har x se double, har mask ek subset.',
    }),

    // ======================= DAY 4 =======================
    4: learn({
      title: 'Permutations — Swap in-place + n! tree',
      goal: '<b>LC 46</b> ka in-place <b>swap</b> approach (na path, na used[]), aur Subsets / Combinations / Permutations ka fark pakka karna.',
      main: 46,
      revTitle: 'Trees + Heap + LC 78',
      rev: [].concat(
        rq(543, 'Tree ka diameter — kisi bhi do nodes ke beech longest path (edges).', '    1\n   / \\\n  2   3\n / \\\n4   5   → 3 (4-2-1-3)', 'DFS height + global max',
          ['height(node) = 1 + max(L, R).', 'Har node pe best = max(best, L + R).', 'Return best.'],
          `int best = 0;
public int diameterOfBinaryTree(TreeNode root) { h(root); return best; }
private int h(TreeNode n) {
    if (n == null) return 0;
    int l = h(n.left), r = h(n.right);
    best = Math.max(best, l + r);
    return 1 + Math.max(l, r);
}`, 'Upar height bhejo, global me L + R.'),
        rq(78, 'Subsets — bitmask (kal ka).', 'mask 0..7 → [], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]', 'Bitmask',
          ['mask = 0..(1 << n) − 1.', 'bit i on → nums[i].'],
          `for (int mask = 0; mask < (1 << n); mask++) {
    List<Integer> s = new ArrayList<>();
    for (int i = 0; i < n; i++)
        if ((mask & (1 << i)) != 0) s.add(nums[i]);
    res.add(s);
}`, 'Har mask ek subset.'),
        rq(215, 'Array ka kth largest.', 'nums = [3,2,1,5,6,4], k = 2 → 5', 'Min-heap of size k',
          ['Min-heap me daalo.', 'Size > k → poll (sabse chhota bahar).', 'peek = kth largest.'],
          `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    for (int x : nums) { pq.offer(x); if (pq.size() > k) pq.poll(); }
    return pq.peek();
}`, 'k ka chhota heap; top = kth bada.'),
      ),
      c1: 'Concept: Subsets vs Combinations vs Permutations',
      concept: [
        { table: { head: ['Type', 'Order matter?', 'Loop', 'Answer kab', 'Count', 'Course Q'], rows: [
          ['Subset', 'Nahi', 'i = start..', 'Har node', '2ⁿ', 'LC 78, 90'],
          ['Combination', 'Nahi', 'i = start.. (+ remain)', 'Condition pe (sum == target)', 'Depends', 'LC 39, 40'],
          ['Permutation', 'Haan', 'i = 0.. used skip / swap', 'Leaf (size == n)', 'n!', 'LC 46'],
        ] } },
        { p: '<b>Swap idea:</b> "Position <code>start</code> pe kaun baithega?" — <code>start..n−1</code> me se koi bhi. Use swap karke <code>start</code> pe lao, baaki array (start+1..) ke permutations recursion se, wapas swap.' },
        { pre: `start=0: [1,2,3]
  swap(0,0) [1,2,3] → start=1 → [1,2,3], [1,3,2]
  swap(0,1) [2,1,3] → start=1 → [2,1,3], [2,3,1]
  swap(0,2) [3,2,1] → start=1 → [3,2,1], [3,1,2]
Prefix 0..start−1 = fix ho chuka; start..n−1 = abhi baaki elements` },
      ],
      t3: 'used[] → Swap in-place',
      think: [
        { p: '<b>used[] version</b>: extra boolean array + path list.' },
        { p: '<b>Swap version</b>: array khud hi path hai. <code>nums[0..start−1]</code> = chosen prefix, <code>nums[start..]</code> = baaki unused elements. Isliye used[] ki zaroorat nahi.' },
        { olist: [
          'Base: <code>start == n</code> → poora array ek permutation → copy.',
          'Loop <code>i = start..n−1</code>: swap(start, i) = choose.',
          'Recurse start + 1 = explore.',
          'swap(start, i) wapas = unchoose (array pehle jaisa).',
        ] },
        { tip: 'Wapas swap bhool gaye toh array garbled ho jaata hai aur kuch permutations miss/duplicate honge.' },
      ],
      d4: 'nums = [1, 2, 3] (swap)',
      dry: [
        { table: { head: ['Frame', 'i', 'swap(start, i)', 'nums', 'Result'], rows: [
          ['start=0', '0', 'swap(0,0)', '[1,2,3]', '—'],
          ['start=1', '1', 'swap(1,1)', '[1,2,3]', 'start=2 → swap(2,2) → start=3: <b>[1,2,3]</b>'],
          ['start=1', '2', 'swap(1,2)', '[1,3,2]', '<b>[1,3,2]</b>; wapas swap → [1,2,3]'],
          ['start=0', '1', 'swap(0,1)', '[2,1,3]', '<b>[2,1,3]</b>, <b>[2,3,1]</b>; wapas → [1,2,3]'],
          ['start=0', '2', 'swap(0,2)', '[3,2,1]', '<b>[3,2,1]</b>, <b>[3,1,2]</b>; wapas → [1,2,3]'],
        ] } },
        { p: 'Output order: [1,2,3], [1,3,2], [2,1,3], [2,3,1], <b>[3,2,1], [3,1,2]</b> — used[] wale se last do ulte. Set same hai, LeetCode accept karta hai.' },
      ],
      code: [
        { code: sol(46, 2) },
        { lines: [
          ['if (start == nums.length)', 'Saari positions fix → poora nums ek permutation.'],
          ['for (int x : nums) perm.add(x);', 'int[] ko List me copy (Arrays.asList int[] pe kaam nahi karta).'],
          ['for (int i = start; i < nums.length; i++)', 'Position start ke candidates: start..n−1 (unused hisse).'],
          ['swap(nums, start, i);', 'Choose — nums[i] ko start pe.'],
          ['backtrack(nums, start + 1, res);', 'Explore — agli position.'],
          ['swap(nums, start, i); (doosra)', 'Unchoose — array restore.'],
        ] },
      ],
      v6: 'in-place swaps',
      look: [
        'Upar <b>Swap in-place</b> tab chuno.',
        '<b>nums</b> me done = fix prefix, <code>start</code> pointer = abhi kaunsi position bhar rahe, <code>i</code> = kaun aa raha hai.',
        'Har swap ke baad wapas swap — array hamesha restore hota hai.',
        'CALL STACK me <code>backtrack(start=…)</code> frames: start 0 → 3.',
      ],
      viz: [[46, 0, 1]],
      edge: [
        ['<code>[1]</code>', '<code>[[1]]</code>', 'start=0: swap(0,0) → start=1 = n'],
        ['<code>[0,1]</code>', '<code>[[0,1],[1,0]]</code>', '2 swaps'],
        ['Duplicates hote (e.g. [1,1,2])', 'Swap version duplicates deta', 'LC 46 me distinct guarantee; warna set/skip lagta'],
      ],
      cx: [
        ['Iterative insert', 'O(n · n!)', 'O(n · n!)', 'Insert at every position'],
        ['used[]', 'O(n · n!)', 'O(n)', 'path + used'],
        ['Swap', 'O(n · n!)', 'O(n) stack', 'Array hi path'],
      ],
      cxNote: 'Swap sabse kam extra memory leta hai, lekin input array modify karta (end me restore ho jaata hai).',
      qa: [
        ['Swap version me used[] kyun nahi chahiye?', 'nums[start..] hamesha unused elements hain — position se hi pata hai.'],
        ['Loop start se kyun (0 se nahi)?', '0..start−1 already fix prefix hai.'],
        ['Base case pe kya copy hota hai?', 'Poora nums array.'],
        ['Doosra swap bhool gaye toh?', 'Array restore nahi hoga → galat/duplicate permutations.'],
        ['Output order used[] jaisa kyun nahi?', 'swap(0,2) se [3,2,1] banta, isliye 3 wali branch me order ulta.'],
        ['Combination aur permutation ka fark?', 'Combination me order matter nahi (start index), permutation me matter (0 se / swap).'],
        ['n = 4 pe kitne leaves?', '24.'],
        ['Swap ki complexity?', 'O(n · n!) time, O(n) stack.'],
      ],
      say: [
        ['Swap approach explain karo', 'I generate permutations in place. The recursive call decides which element sits at position start: for every i from start to n − 1 I swap nums[i] into position start, recurse for start + 1, and swap back. The prefix before start is fixed and the suffix holds exactly the unused elements, so I need neither a used array nor a separate path. When start reaches n the whole array is one permutation, which I copy. Time O(n·n!), extra space O(n) for the recursion.'],
        ['Follow-up: subsets vs combinations vs permutations', 'Subsets and combinations ignore order, so I only move forward with a start index and never revisit earlier elements. Combinations add a condition such as size k or a target sum before recording. Permutations care about order, so any unused element can come next, which I handle with a used array or by swapping.'],
        ['1-minute: n! complexity', 'There are n choices for the first position, n − 1 for the second and so on, giving n! leaves. Copying each costs O(n), so generating all permutations is O(n·n!) — again the output size, so it cannot be improved.'],
      ],
      sohvi: [
        'Swap ka Part 4 table paper pe khud banao.',
        'Subsets / Combinations / Permutations table yaad karo — 3 line me batao.',
        'Visualizer ka Swap tab dekho.',
        'used[] version dobara likho (swap optional).',
      ],
      sohel: [
        '<b>Task A:</b> Swap version 7 min me memory se.',
        '<b>Task B:</b> Dry run: [1,2,3,4] pe start=0, i=3 branch ke pehle 2 permutations bolo.',
        '<b>Task C:</b> Interviewer: "input array modify mat karo" — kaunsa version doge aur kyun?',
      ],
      hw: [
        'LC 46 swap version Accepted.',
        'Kal: LC 39 Combination Sum — [2,3,6,7], 7 ke combinations haath se dhundo.',
      ],
      test: [
        ['Swap me base case?', 'start == n.'],
        ['[1,2,3] pe swap(0,2) ke baad?', '[3,2,1]'],
        ['Permutations count n = 5?', '120'],
        ['Swap version extra space?', 'O(n) stack.'],
        ['Order matter → kaunsa loop?', '0 se (used) ya start se swap.'],
      ],
      checks: [
        'Swap approach ka idea (prefix fixed, suffix unused) samjha',
        'Swap version bina dekhe likha + Accepted',
        'Subsets vs Combinations vs Permutations table bol sakta/sakti hu',
        'Visualizer me swap variant dekha',
        'Self-test sahi',
      ],
      memory: 'Swap: start pe kaun baithe? swap → recurse(start+1) → swap back.',
    }),

    // ======================= DAY 5 =======================
    5: learn({
      title: 'Combination Sum — reuse allowed + pruning',
      goal: '<b>LC 39</b>: target sum wale combinations — <code>remain</code> track karna, <b>reuse</b> ke liye <code>recurse(i)</code>, aur <b>sort + break</b> pruning.',
      main: 39,
      revTitle: 'Trees + Stack + LC 46',
      rev: [].concat(
        rq(100, 'Do trees bilkul same hain?', 'p = [1,2,3], q = [1,2,3] → true', 'Recursion on pairs',
          ['Dono null → true, ek null → false.', 'val match.', 'left-left aur right-right same.'],
          `public boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null || q == null) return p == q;
    return p.val == q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`, 'Null check, value, dono taraf.'),
        rq(46, 'Permutations — swap (kal ka).', '[1,2,3] → swap(0,i) → recurse(1) → swap back', 'Backtracking in-place',
          ['start == n → copy.', 'i = start..: swap, recurse(start + 1), swap back.'],
          `void bt(int[] nums, int start, List<List<Integer>> res) {
    if (start == nums.length) {
        List<Integer> p = new ArrayList<>();
        for (int x : nums) p.add(x);
        res.add(p);
        return;
    }
    for (int i = start; i < nums.length; i++) {
        swap(nums, start, i);
        bt(nums, start + 1, res);
        swap(nums, start, i);
    }
}`, 'Start pe kaun baithe? swap-recurse-swap.'),
        rq(20, 'Brackets valid hain?', '"([)]" → false, "()[]{}" → true', 'Stack',
          ['Opening → push.', 'Closing → stack top matching hona chahiye, pop.', 'End me stack khaali.'],
          `public boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') st.push(')');
        else if (c == '[') st.push(']');
        else if (c == '{') st.push('}');
        else if (st.isEmpty() || st.pop() != c) return false;
    }
    return st.isEmpty();
}`, 'Kholo toh expected band push; band pe match pop.'),
      ),
      c1: 'Concept: remain, reuse aur pruning',
      concept: [
        { p: '<b>remain</b> = target − (path ka sum). Har choose pe <code>remain − c[i]</code>. remain == 0 → answer.' },
        { table: { head: ['Sawaal', 'Jawab → code'], rows: [
          ['Same number dobara le sakte?', 'Haan → <code>backtrack(c, <b>i</b>, …)</code> (i+1 nahi)'],
          ['[2,3] aur [3,2] alag?', 'Nahi → start index, peeche nahi jaate'],
          ['c[i] &gt; remain?', 'Sorted hai → aage sab bade → <code>break</code>'],
        ] } },
        { pre: `Sorted [2,3,6,7], target 7 — recursion tree (r = remain):
                        r7
        2/          3|        6|      7\\
       r5           r4        r1      r0 ✓[7]
   2/  3|  6✗    3/  6✗      6✗(break)
   r3   r2      r1(3>1 break)
 2/ 3\\  3✗
r1   r0✓[2,2,3]
2✗(break)` },
        { tip: '<code>break</code> sirf <b>sorted</b> array pe sahi hai. Bina sort ke sirf us element ko skip kar sakte (continue).' },
      ],
      t3: 'Pick / not-pick → Sorted for-loop + break',
      think: [
        { p: '<b>Brute (pick / not-pick):</b> index i pe: c[i] lo (index wahi — reuse) ya chhodo (i+1). remain &lt; 0 ya i == n → dead end. Sahi hai, par tree me bahut faltu nodes (remain negative tak jaate hain).' },
        { p: '<b>Optimal:</b> sort + for-loop. Har level: <code>i = start..</code>, <code>c[i] &gt; remain → break</code>. Choose c[i], recurse <b>(i, remain − c[i])</b>. Negative remain kabhi banta hi nahi.' },
        { olist: [
          'Sort candidates.',
          'remain == 0 → copy save, return.',
          'Loop: break if c[i] &gt; remain; add; recurse(i); remove.',
        ] },
      ],
      d4: 'candidates = [2,3,6,7], target = 7',
      dry: [
        { table: { head: ['Frame (start, remain)', 'i → c[i]', 'Action', 'path'], rows: [
          ['(0, 7)', '0 → 2', 'choose → (0, 5)', '[2]'],
          ['(0, 5)', '0 → 2', 'choose → (0, 3)', '[2,2]'],
          ['(0, 3)', '0 → 2', 'choose → (0, 1)', '[2,2,2]'],
          ['(0, 1)', '0 → 2', '2 &gt; 1 → <b>break</b>, pop', '[2,2,2] → [2,2]'],
          ['(0, 3)', '1 → 3', 'choose → (1, 0) → <b>res [2,2,3]</b>', '[2,2,3] → [2,2]'],
          ['(0, 3)', '2 → 6', '6 &gt; 3 → break', '[2]'],
          ['(0, 5)', '1 → 3', 'choose → (1, 2): 3 &gt; 2 break', '[2,3] → [2]'],
          ['(0, 5)', '2 → 6', '6 &gt; 5 → break', '[]'],
          ['(0, 7)', '1 → 3', '→ (1, 4): 3 → (1, 1) break; 6 &gt; 4 break', '[3] → []'],
          ['(0, 7)', '2 → 6', '→ (2, 1): 6 &gt; 1 break', '[6] → []'],
          ['(0, 7)', '3 → 7', '→ (3, 0) → <b>res [7]</b>', '[7] → []'],
        ] } },
        { p: 'Answer: <code>[[2,2,3],[7]]</code>.' },
      ],
      code: [
        { p: '<b>Optimal — sort + for-loop + break</b>' },
        { code: sol(39, 1) },
        { lines: [
          ['Arrays.sort(candidates);', 'Break pruning ke liye sorted chahiye.'],
          ['if (remain == 0)', 'Sum exactly target → copy save.'],
          ['if (c[i] > remain) break;', 'Prune — aage sab bade.'],
          ['backtrack(c, i, remain - c[i], path, res);', '<b>i</b> — same number dobara allowed.'],
          ['path.remove(path.size() - 1);', 'Unchoose.'],
        ] },
        { p: '<b>Brute — pick / not-pick</b>' },
        { code: sol(39, 0) },
      ],
      v6: 'remain ghatna + break pruning',
      look: [
        '<b>remain</b> text har choose pe ghatta hai.',
        '<b>c</b> array me laal (skip) = break ke baad wale elements — prune hue.',
        'Brute tab me same input chalao — steps kitne zyada hain, compare karo.',
        'Example 2 ([2,3,5], 8) — 3 answers.',
      ],
      viz: [[39, 0, 0], [39, 1, 1]],
      edge: [
        ['<code>[2]</code>, 1', '<code>[]</code>', '2 &gt; 1 → pehli iteration pe break'],
        ['<code>[2,3,5]</code>, 8', '<code>[[2,2,2,2],[2,3,3],[3,5]]</code>', 'Reuse multiple times'],
        ['<code>[7,3,2]</code>, 18', '7 combinations', 'Unsorted input — sort zaroori'],
        ['target = candidate', '<code>[[c]]</code> + aur', 'remain 0 ek step me'],
      ],
      cx: [
        ['Pick / not-pick', 'O(2^(T/min)) approx', 'O(T/min)', 'Binary tree, kam pruning'],
        ['Sorted loop + break', 'O(n^(T/min)) upper bound', 'O(T/min)', 'Sort + break, negative remain kabhi nahi'],
      ],
      cxNote: 'Depth max = target / min(candidate) (sab chhota number). Branching ≤ n. Asli nodes pruning se bahut kam.',
      qa: [
        ['Reuse ke liye recurse me kya pass?', '<code>i</code> (same index).'],
        ['[3,2] kyun nahi banta?', 'start index — 3 choose karne ke baad 2 (peeche) nahi aata.'],
        ['break vs continue?', 'Sorted → break (aage sab bade). Unsorted → sirf continue possible.'],
        ['Max depth?', 'target / min candidate (e.g. 40/2 = 20).'],
        ['remain &lt; 0 check optimal me kyun nahi?', 'c[i] &gt; remain pe break, toh remain kabhi negative nahi hota.'],
        ['Answer kab record?', 'remain == 0.'],
        ['Sort ka cost?', 'O(n log n) — exponential ke saamne negligible.'],
        ['Brute ka dead end?', 'i == n ya remain &lt; 0.'],
      ],
      say: [
        ['Approach explain karo (Combination Sum)', 'I sort the candidates and backtrack with the remaining target. At each level I loop from start; since the array is sorted, once a candidate exceeds the remainder I break. Because numbers can be reused, after choosing c[i] I recurse with the same index i and remain minus c[i]. Never going back below start prevents the same combination in a different order. When remain is zero I copy the path. The depth is at most target over the smallest candidate.'],
        ['Follow-up: "Pruning ka asar?"', 'Without pruning the pick/not-pick tree explores branches until the remainder goes negative. With the sorted break, a whole range of larger candidates is cut in one step, and because it happens high in the tree it removes exponentially many nodes. In the visualizer the brute version takes noticeably more steps on the same input.'],
        ['1-minute: Pruning', 'Pruning cuts a branch as soon as I can prove it cannot produce an answer. Sorting often enables it: if the current candidate is too large, all later ones are too, so I break. The worst-case bound may not change, but the practical run time drops dramatically.'],
      ],
      sohvi: [
        '[2,3,6,7], 7 ka tree paper pe (Part 1 jaisa).',
        'Dry-run table khud fill karo.',
        'Optimal code likho, <code>i</code> vs <code>i + 1</code> pe dhyan.',
        'Visualizer: optimal aur brute dono chalao, steps gino.',
      ],
      sohel: [
        '<b>Task A:</b> Optimal 10 min me + Accepted.',
        '<b>Task B:</b> Brute (pick/not-pick) bhi likho.',
        '<b>Task C:</b> Follow-up: "combination ka size exactly k ho" — kya add karoge?',
        '<b>Task D:</b> 1-minute pruning answer.',
      ],
      hw: [
        'LC 39 Accepted.',
        'Kal Saturday revision: 78, 46, 39 bina dekhe + LC 104.',
      ],
      test: [
        ['[2,3,5], 8 ke answers?', '[2,2,2,2], [2,3,3], [3,5]'],
        ['Reuse → recurse arg?', 'i'],
        ['break kab sahi?', 'Sorted candidates pe.'],
        ['Base case?', 'remain == 0 → copy.'],
        ['Max depth target 40, min 2?', '20'],
      ],
      checks: [
        'remain aur reuse (i) samjha',
        'Sort + break pruning explain kar sakta/sakti hu',
        'Optimal code bina dekhe + Accepted',
        'Brute vs optimal visualizer me compare kiya',
        'Dry run table banaya',
        'Self-test sahi',
      ],
      memory: 'Sort, remain; c[i] > remain → break; reuse → recurse(i).',
    }),

    // ======================= DAY 6 (SAT) =======================
    6: {
      title: 'Revision — Week 1 (Recursion + Subsets + Permutations + Combination Sum)',
      goal: 'Week 1 ke 3 backtracking questions + Phase 7 ka LC 104 — <b>bina solution dekhe</b> re-solve, timer ke saath. Sohel: System Design session.',
      main: null,
      parts: [
        { title: 'Part 0 — Aaj ka revision plan', blocks: [
          { table: { head: ['Question', 'Timer', 'Rule'], rows: [
            ['LC 78 Subsets', '15 min', 'Pehle tree bolo, fir code'],
            ['LC 46 Permutations', '15 min', 'used[] version; Sohel swap bhi'],
            ['LC 39 Combination Sum', '20 min', 'Sort + break bhoolna nahi'],
            ['LC 104 Max Depth', '5 min', 'Recursion warm-up'],
          ] } },
          { list: ['Notes band. Pehle 2 min recursion tree paper pe.', 'Galti hui toh "Mistakes log" me likho.', 'Har question ke baad visualizer se dry-run match karo.'] },
        ] },
        { title: 'Part 1 — LC 78 Subsets', blocks: [
          { problem: 78 },
          { p: '<b>Pattern:</b> Backtracking — har node ek subset, recurse(i + 1).' },
          { pre: '[1,2,3] → [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]' },
          { code: sol(78, 2) },
          { tip: 'Memory hook: <b>Har node ek subset.</b>' },
          { viz: 78, ex: 0 },
        ] },
        { title: 'Part 2 — LC 46 Permutations', blocks: [
          { problem: 46 },
          { p: '<b>Pattern:</b> Backtracking — 0 se loop, used[] skip, leaf pe copy.' },
          { pre: '[1,2,3] → 3! = 6' },
          { code: sol(46, 1) },
          { tip: 'Memory hook: <b>Order matter → 0 se loop + used.</b>' },
          { viz: 46, ex: 0 },
        ] },
        { title: 'Part 3 — LC 39 Combination Sum', blocks: [
          { problem: 39 },
          { p: '<b>Pattern:</b> Sort + remain + break, recurse(i).' },
          { pre: '[2,3,6,7], 7 → [[2,2,3],[7]]' },
          { code: sol(39, 1) },
          { tip: 'Memory hook: <b>Bada mila → break; reuse → i.</b>' },
          { viz: 39, ex: 1 },
        ] },
        { title: 'Part 4 — LC 104 Maximum Depth (Phase 7)', blocks: [
          { p: 'Recursion ka sabse chhota example — base case null = 0.' },
          { pre: '[3,9,20,null,null,15,7] → 3' },
          { code: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}` },
          { tip: 'Memory hook: <b>Null = 0, mera = 1 + max.</b>' },
        ] },
        { title: 'Part 5 — Interview mix', blocks: [{ qa: [
          ['Subsets aur permutations ke count?', '2ⁿ aur n!.'],
          ['Copy kyun?', 'Shared path badalti rehti hai.'],
          ['LC 39 me i kyun, i+1 kyun nahi?', 'Reuse allowed.'],
          ['Permutations me used[] ka alternative?', 'In-place swap.'],
          ['Recursion depth in LC 78?', 'n + 1 frames → O(n).'],
          ['Break vs continue LC 39?', 'Sorted → break.'],
        ] }] },
        { title: 'Part 6 — Aise bolo (1-minute answers)', blocks: [{ say: [
          ['Backtracking complexity kaise nikaalte ho', 'I count nodes in the recursion tree and multiply by the work per node. Subsets: 2^n nodes with O(n) copies. Permutations: about n! leaves with O(n) copies. Combination Sum: branching at most n and depth target over the smallest candidate. Space is the depth plus the path, output counted separately.'],
          ['Subsets vs permutations in one breath', 'Subsets ignore order, so I move forward with a start index and record every node; permutations care about order, so I loop from zero, skip used elements and record only at full length.'],
        ] }] },
        { title: 'Part 7 — Sohvi session', blocks: [{ olist: ['LC 78 aur 46 bina dekhe likho (20 min each).', 'Dono ke trees paper pe.', 'LC 39 ka sirf tree + idea (code optional).', 'LC 104 code.'] }] },
        { title: 'Part 8 — Sohel session (SDE-2 + System Design)', blocks: [
          { olist: ['<b>Task A:</b> 78, 46 (swap), 39 — teeno 35 min me total.', '<b>Task B:</b> Har ek ka complexity 20 sec me bolo.', '<b>Task C:</b> Weak spot ek line me log karo.'] },
          { p: '<b>System Design session (1/week) — 45 min:</b> "Design a URL shortener" — requirements, API (POST /shorten, GET /{code}), base62 ID generation, DB schema, read-heavy caching (Redis), scaling reads. Last 10 min: trade-offs bolke batao.' },
        ] },
        { title: 'Part 9 — Homework', blocks: [{ list: ['Kal mock: Sohvi → LC 78, Tum → LC 39. Dono taiyaar.', 'Mistakes log padho.'] }] },
        { title: 'Part 10 — Final self-test (bina notes)', blocks: [{ qa: [
          ['[1,2] ke permutations?', '[1,2], [2,1]'],
          ['Subsets template ki pehli line?', 'res.add(new ArrayList&lt;&gt;(path));'],
          ['LC 39 base case?', 'remain == 0'],
          ['n = 4 subsets?', '16'],
          ['Unchoose code?', 'path.remove(path.size() - 1);'],
        ] }] },
      ],
      checks: ['LC 78 bina dekhe Accepted', 'LC 46 bina dekhe Accepted', 'LC 39 bina dekhe Accepted', 'LC 104 likha', 'Interview mix ke jawab diye', 'System Design session (Sohel)'],
      memory: 'Subset: har node. Permutation: leaf + used. Combo: remain + break.',
    },

    // ======================= DAY 7 (SUN) =======================
    7: {
      title: 'Mock Interview + Contest',
      goal: 'Real interview jaisa mock: Tum → Sohvi (<b>LC 78</b>), Sohvi → Tum (<b>LC 39</b>). Fir LeetCode Weekly Contest discussion.',
      main: null,
      parts: [
        { title: 'Part 0 — Mock format (30 + 30 + 30 min)', blocks: [
          { table: { head: ['Slot', 'Kaun', 'Kya'], rows: [
            ['30 min', 'Tum → Sohvi', 'LC 78 Subsets'],
            ['30 min', 'Sohvi → Tum', 'LC 39 Combination Sum'],
            ['30 min', 'Dono', 'Weekly Contest (Sunday 8:00 AM IST) discussion'],
          ] } },
          { list: ['Interviewer solution nahi batata — sirf hints ladder.', 'Candidate bol ke sochta hai.', 'Rubric end me fill.'] },
        ] },
        { title: 'Part 1 — Mock Q1 (Tum → Sohvi): LC 78', blocks: [
          { problem: 78 },
          { p: '<b>Kya poochna hai:</b> "Kitne subsets honge?", "Empty subset count hota hai?", "Tree bana ke dikhao", "Complexity?"' },
          { olist: ['Hint 1: Har element ke kitne options hain?', 'Hint 2: [1,2] ka tree banao.', 'Hint 3: Har call me path ko answer maan lo, fir aage ke elements add karo.', 'Hint 4: Copy kyun?'] },
          { table: { head: ['Rubric', '1–5', 'Note'], rows: [['Clarify', '', ''], ['Brute', '', ''], ['Optimal', '', ''], ['Code', '', ''], ['Test', '', ''], ['Communication', '', '']] } },
        ] },
        { title: 'Part 2 — Mock Q2 (Sohvi → Tum): LC 39', blocks: [
          { problem: 39 },
          { p: '<b>Kya poochna hai:</b> "Reuse kaise handle?", "[2,3] aur [3,2] ek kyun?", "Pruning?", "Depth kitni?"' },
          { olist: ['Hint 1: remain track karo.', 'Hint 2: Sort karke kya fayda?', 'Hint 3: Recurse i ya i+1?'] },
          { table: { head: ['Rubric', '1–5', 'Note'], rows: [['Clarify', '', ''], ['Brute', '', ''], ['Optimal', '', ''], ['Code', '', ''], ['Test', '', ''], ['Communication', '', '']] } },
        ] },
        { title: 'Part 3 — Interview communication checklist', blocks: [{ list: [
          'Constraints padh ke bolo: "n ≤ 10, exponential OK".',
          'Chhote example ka tree pehle.',
          'Base case, choices, undo — teen cheezein naam se bolo.',
          'Code ke baad 1 example dry-run aloud.',
          'Complexity tree se derive karo.',
        ] }] },
        { title: 'Part 4 — LeetCode Weekly Contest plan + discussion', blocks: [
          { list: ['Sunday 8:00 AM IST — dono participate.', 'Q1–Q2 pe focus; Sohel Q3 try.', 'Contest ke baad: jo solve nahi hua uska editorial padho.'] },
          { table: { head: ['Problem', 'Pattern socha', 'Kahan atke', 'Fix'], rows: [['Q1', '', '', ''], ['Q2', '', '', ''], ['Q3', '', '', '']] } },
        ] },
        { title: 'Part 5 — Interview mix', blocks: [{ qa: [
          ['Subsets complexity?', 'O(n · 2ⁿ)'],
          ['Combination Sum me sort kyun?', 'Break pruning ke liye.'],
          ['Permutation leaves?', 'n!'],
          ['Template?', 'Choose → explore → unchoose.'],
          ['Stack depth LC 39?', 'target / min.'],
        ] }] },
        { title: 'Part 6 — Aise bolo', blocks: [{ say: [
          ['Recursive solution clearly explain karna', 'I start with a small recursion tree, say what a node represents, state the base case, the choices and what I undo, then code it and dry-run the first few calls before giving complexity from the tree.'],
          ['Stuck ho gaye toh', 'I go back to a tiny example and draw two levels of the tree aloud, which usually reveals the choices and the stopping condition.'],
        ] }] },
        { title: 'Part 7 — Sohvi session', blocks: [{ olist: ['Mock me jo hint lagi, wo note karo.', 'LC 78 dobara bina hint ke.'] }] },
        { title: 'Part 8 — Sohel session', blocks: [{ olist: ['Mock feedback se 2 improvement points.', 'Contest Q3 ka editorial + apna code.'] }] },
        { title: 'Part 9 — Homework', blocks: [{ list: ['Kal: duplicates — LC 90 Subsets II padh ke aao.', 'Rubric scores save karo.'] }] },
        { title: 'Part 10 — Final self-test', blocks: [{ qa: [
          ['[] subset count hota hai?', 'Haan.'],
          ['LC 39 [2], 1?', '[]'],
          ['Unchoose kyun?', 'Shared state restore.'],
          ['Permutations me answer kab?', 'size == n.'],
          ['Contest kab?', 'Sunday 8:00 AM IST.'],
        ] }] },
      ],
      checks: ['Mock Q1 complete + rubric', 'Mock Q2 complete + rubric', 'Contest diya', 'Contest discussion template bhara', 'Self-test sahi'],
      memory: 'Mock: tree pehle, code baad me, dry-run aloud.',
    },
  });
})();
