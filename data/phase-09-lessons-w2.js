// Phase 9 (Backtracking) — Week 2 lessons (local days 8–14). Day 1 (Phase 1) wale format me.
(function () {
  const P = window.PHASE_CONTENT['backtracking'];
  P.lessons = P.lessons || {};
  const Q = P.questions;
  const NAME = n => { for (const p of window.ROADMAP) for (const q of p.qs) if (q[0] === n) return q[1]; return ''; };
  const sol = (n, i) => 'class Solution {\n' + Q[n].approaches[i].code.split('\n').map(l => (l ? '    ' + l : l)).join('\n') + '\n}';
  const rq = (n, one, ex, pattern, steps, code, hook) => [
    { h: `LC ${n} — ${NAME(n)}` }, { p: one }, { pre: ex }, { p: `<b>Pattern:</b> ${pattern}` },
    { olist: steps }, { code }, { tip: `Memory hook: <b>${hook}</b>` },
  ];
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
  const rubric = { table: { head: ['Rubric', '1–5', 'Note'], rows: [['Clarify', '', ''], ['Brute', '', ''], ['Optimal', '', ''], ['Code', '', ''], ['Test', '', ''], ['Communication', '', '']] } };

  Object.assign(P.lessons, {
    // ======================= DAY 8 =======================
    8: learn({
      title: 'Duplicates Handling — Subsets II (sort + skip)',
      goal: 'Input me duplicates ho toh duplicate answers kaise rokein: <b>sort + same level skip</b> (<code>i &gt; start &amp;&amp; nums[i] == nums[i−1]</code>). Problem: <b>LC 90 Subsets II</b>.',
      main: 90,
      revTitle: 'Trees + Arrays + LC 39',
      rev: [].concat(
        rq(236, 'Binary tree me do nodes p, q ka lowest common ancestor.', 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1 → 3', 'Recursion — dono taraf se jo mila wo upar bhejo',
          ['null / p / q mila → wahi return.', 'left = LCA(left), right = LCA(right).', 'Dono non-null → root; warna jo non-null.'],
          `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode l = lowestCommonAncestor(root.left, p, q);
    TreeNode r = lowestCommonAncestor(root.right, p, q);
    if (l != null && r != null) return root;
    return l != null ? l : r;
}`, 'Dono taraf mila → main hi LCA.'),
        rq(39, 'Combination Sum (pichla hafta).', '[2,3,6,7], 7 → [[2,2,3],[7]]', 'Sort + remain + break, recurse(i)',
          ['Sort.', 'remain == 0 → copy.', 'c[i] > remain → break; add; recurse(i); remove.'],
          `void bt(int[] c, int start, int remain, List<Integer> path, List<List<Integer>> res) {
    if (remain == 0) { res.add(new ArrayList<>(path)); return; }
    for (int i = start; i < c.length; i++) {
        if (c[i] > remain) break;
        path.add(c[i]);
        bt(c, i, remain - c[i], path, res);
        path.remove(path.size() - 1);
    }
}`, 'Bada mila → break; reuse → i.'),
        rq(1, 'Do indices jinka sum target.', 'nums = [2,7,11,15], target = 9 → [0,1]', 'HashMap value → index',
          ['need = target − x.', 'map me need hai → answer.', 'Warna put(x, i).'],
          `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (map.containsKey(need)) return new int[]{map.get(need), i};
        map.put(nums[i], i);
    }
    return new int[]{-1, -1};
}`, 'Pehle check, fir put.'),
      ),
      c1: 'Concept: duplicate answers kahan se aate hain?',
      concept: [
        { p: 'LC 78 ka code [1,2,2] pe chalao (bina change): 8 subsets aate hain, jisme <b>[2]</b> aur <b>[1,2]</b> do-do baar.' },
        { pre: `nums = [1,2,2]  (index: 0  1  2)
LC 78 tree:
                     []
          /          |           \\
       [1]          [2]ᵢ₁        [2]ᵢ₂   ← same value, same level → same subtree!
      /    \\          |
  [1,2]ᵢ₁ [1,2]ᵢ₂   [2,2]
     |
  [1,2,2]` },
        { p: '<b>Fix:</b> Sort karo (same values paas). Ek level (ek for-loop) me same value <b>sirf pehli baar</b> uthao:' },
        { code: `if (i > start && nums[i] == nums[i - 1]) continue;` },
        { table: { head: ['Condition', 'Matlab'], rows: [
          ['<code>i &gt; start</code>', 'Ye is level ka pehla choice nahi hai'],
          ['<code>nums[i] == nums[i−1]</code>', 'Pichla sibling bhi same value tha → same subtree pehle ban chuka'],
          ['<code>i == start</code> (no skip)', 'Gehrai me (next level) same value allowed → [1,2,2] banta hai'],
        ] } },
        { tip: '<code>i &gt; 0</code> likh diya toh deeper level pe bhi skip ho jaayega → [1,2,2] aur [2,2] kho jaayenge. Hamesha <code>i &gt; start</code>.' },
      ],
      t3: 'Brute (all + HashSet) → Optimal (sort + skip)',
      think: [
        { p: '<b>Brute:</b> Sort karo (warna [2,1] aur [1,2] alag Lists), saare 2ⁿ subsets banao (bitmask), <code>HashSet&lt;List&lt;Integer&gt;&gt;</code> duplicates hata dega. List ka <code>equals/hashCode</code> content pe hai — isliye set kaam karta hai.' },
        { p: '<b>Optimal:</b> Duplicate banne hi mat do. LC 78 backtracking + ek line skip. HashSet ka hashing cost aur memory bachti hai.' },
        { olist: ['Sort.', 'Har node pe copy save.', 'Loop i = start..: skip if i &gt; start &amp;&amp; same as prev.', 'add → recurse(i + 1) → remove.'] },
      ],
      d4: 'nums = [1, 2, 2]',
      dry: [
        { table: { head: ['Frame', 'i', 'Check', 'Action', 'res'], rows: [
          ['bt(0) []', '—', '—', 'record []', '[[]]'],
          ['bt(0)', '0', 'i == start', 'choose 1 → bt(1)', ''],
          ['bt(1) [1]', '—', '—', 'record [1]', '+[1]'],
          ['bt(1)', '1', 'i == start', 'choose 2 → bt(2)', ''],
          ['bt(2) [1,2]', '—', '—', 'record [1,2]', '+[1,2]'],
          ['bt(2)', '2', 'i == start (2 == 2) → allowed', 'choose 2 → bt(3): record [1,2,2]', '+[1,2,2]'],
          ['bt(1)', '2', 'i=2 &gt; start=1, nums[2]==nums[1] → <b>skip</b>', '—', ''],
          ['bt(0)', '1', 'i == ... 1 &gt; 0 but nums[1]=2 ≠ nums[0]=1', 'choose 2 → bt(2): record [2]', '+[2]'],
          ['bt(2) [2]', '2', 'i == start', 'choose 2 → record [2,2]', '+[2,2]'],
          ['bt(0)', '2', 'i=2 &gt; 0, nums[2]==nums[1] → <b>skip</b>', '—', ''],
        ] } },
        { p: 'Final: <code>[[],[1],[1,2],[1,2,2],[2],[2,2]]</code> — 6 unique (8 me se 2 duplicate roke).' },
      ],
      code: [
        { p: '<b>Optimal — sort + skip</b>' },
        { code: sol(90, 1) },
        { lines: [
          ['Arrays.sort(nums);', 'Same values adjacent — skip check isi pe tika hai.'],
          ['res.add(new ArrayList<>(path));', 'Har node ek subset.'],
          ['if (i > start && nums[i] == nums[i - 1]) continue;', 'Same level pe same value dobara → skip.'],
          ['backtrack(nums, i + 1, path, res);', 'Har element ek baar.'],
        ] },
        { p: '<b>Brute — bitmask + HashSet</b>' },
        { code: sol(90, 0) },
      ],
      v6: 'skip kab hota hai',
      look: [
        '<b>nums (sorted)</b> me laal = skip hua index (same level duplicate).',
        'CALL STACK me <code>start</code> dekho — skip sirf <code>i &gt; start</code> pe.',
        'Brute tab: set me "pehle se hai" wale steps — kitna kaam faltu hua.',
      ],
      viz: [[90, 0, 0], [90, 0, 1]],
      edge: [
        ['<code>[0]</code>', '<code>[[],[0]]</code>', 'Koi duplicate nahi'],
        ['<code>[2,2,2]</code>', '<code>[[],[2],[2,2],[2,2,2]]</code>', 'Sab same → sirf size se fark'],
        ['<code>[4,4,4,1,4]</code>', '10 subsets', 'Sort → [1,4,4,4,4]: (1 ho/na ho) × (0..4 fours) = 2 × 5'],
        ['Unsorted <code>[2,1,2]</code>', 'sort zaroori', 'Bina sort ke skip galat'],
      ],
      cx: [
        ['Brute bitmask + Set', 'O(n · 2ⁿ)', 'O(n · 2ⁿ) set', 'Sab banao, set se hatao'],
        ['Sort + skip', 'O(n · 2ⁿ)', 'O(n) stack', 'Duplicate banne hi nahi do'],
      ],
      cxNote: 'Worst case (sab distinct) dono same. Duplicates zyada → optimal bahut kam nodes banata hai.',
      qa: [
        ['Sort kyun zaroori?', 'Same values adjacent honi chahiye — tabhi nums[i] == nums[i−1] check kaam karta hai.'],
        ['i &gt; 0 vs i &gt; start?', 'i &gt; start: sirf same level pe skip. i &gt; 0 deeper level ko bhi rok deta hai → [1,2,2] miss.'],
        ['HashSet&lt;List&gt; kaise duplicates pehchanta?', 'List.equals/hashCode elements ke content pe based hai.'],
        ['[2,2,2] ke kitne subsets?', '4.'],
        ['Skip ke baad continue ya break?', 'continue — aage alag value aa sakti hai.'],
        ['LC 78 se kitna code badla?', 'Sort + ek skip line.'],
        ['Brute me sort kyun?', '[2,1] aur [1,2] ko same list banane ke liye.'],
        ['Time complexity?', 'O(n · 2ⁿ).'],
      ],
      say: [
        ['Approach explain karo (Subsets II)', 'It is Subsets with duplicates. I sort so equal values are adjacent and run the standard backtracking where every node is a subset. In the loop I skip index i when i is greater than start and nums[i] equals nums[i−1], because choosing the same value again at the same level would build an identical subtree. The first occurrence at each level is still allowed, so deeper levels can take repeated values like [1,2,2]. O(n·2^n) time and O(n) recursion depth, no HashSet.'],
        ['Follow-up: "Why not i > 0?"', 'That would also block taking the second 2 right after the first one at a deeper level, so [1,2,2] and [2,2] would disappear. The skip must only apply among siblings in the same loop, which is exactly what i greater than start means.'],
        ['1-minute: Avoiding duplicate results', 'Sort the input, then in each recursion level skip a value equal to the previous sibling. That prevents duplicates at the source and is cheaper than deduplicating with a set afterwards.'],
      ],
      sohvi: [
        'LC 78 code [1,2,2] pe paper pe chalao — duplicates khud dekho.',
        'Tree me same-level duplicates ko cross karo.',
        'Skip line add karke optimal likho.',
        'Visualizer me laal skip steps gino.',
      ],
      sohel: [
        '<b>Task A:</b> Optimal 8 min, brute 8 min.',
        '<b>Task B:</b> Interviewer: "i &gt; 0 kyun nahi?" — counter example do.',
        '<b>Task C:</b> [4,4,4,1,4] ka count bina code chalaye nikaalo (formula).',
      ],
      hw: ['LC 90 Accepted (dono).', 'Kal: LC 40 Combination Sum II — LC 39 se kya alag hai, padh ke aao.'],
      test: [
        ['Skip condition?', '<code>i &gt; start &amp;&amp; nums[i] == nums[i - 1]</code>'],
        ['[1,2,2] ka answer count?', '6'],
        ['Sort na kiya toh?', 'Duplicates adjacent nahi → skip fail.'],
        ['Brute ka data structure?', 'HashSet&lt;List&lt;Integer&gt;&gt;'],
        ['continue ya break?', 'continue'],
      ],
      checks: ['Duplicates kahan se aate hain (tree) samjha', 'Skip condition aur i &gt; start ka reason bol sakta/sakti hu', 'Optimal Accepted', 'Brute Accepted', 'Visualizer me skip dekha', 'Self-test sahi'],
      memory: 'Sort, phir same level pe same value sirf ek baar: i > start && a[i] == a[i−1] → continue.',
    }),

    // ======================= DAY 9 =======================
    9: learn({
      title: 'Combination Sum II — ek baar use + duplicates',
      goal: '<b>LC 40</b>: LC 39 + duplicates + har element ek baar. Do line ka fark: <code>recurse(i + 1)</code> aur duplicate skip.',
      main: 40,
      revTitle: 'Trees + Two Pointers + LC 90',
      rev: [].concat(
        rq(98, 'Binary tree valid BST hai?', '[5,1,4,null,null,3,6] → false (4 root 5 ke right me but 4 &lt; 5)', 'Recursion with (low, high) range',
          ['Har node ka allowed range (lo, hi).', 'Left ko (lo, val), right ko (val, hi).', 'long use karo (Integer.MIN/MAX edge).'],
          `public boolean isValidBST(TreeNode root) { return ok(root, Long.MIN_VALUE, Long.MAX_VALUE); }
private boolean ok(TreeNode n, long lo, long hi) {
    if (n == null) return true;
    if (n.val <= lo || n.val >= hi) return false;
    return ok(n.left, lo, n.val) && ok(n.right, n.val, hi);
}`, 'Range neeche bhejo.'),
        rq(90, 'Subsets II (kal ka).', '[1,2,2] → [[],[1],[1,2],[1,2,2],[2],[2,2]]', 'Sort + same level skip',
          ['Sort.', 'Record har node.', 'i &gt; start &amp;&amp; same → continue.'],
          `for (int i = start; i < nums.length; i++) {
    if (i > start && nums[i] == nums[i - 1]) continue;
    path.add(nums[i]);
    backtrack(nums, i + 1, path, res);
    path.remove(path.size() - 1);
}`, 'Same level, same value → ek hi baar.'),
        rq(15, 'Saare unique triplets jinka sum 0.', '[-1,0,1,2,-1,-4] → [[-1,-1,2],[-1,0,1]]', 'Sort + fix one + two pointers + duplicate skip',
          ['Sort.', 'i fix; i &gt; 0 &amp;&amp; same as prev → skip.', 'l, r two pointers; match pe dono ke duplicates skip.'],
          `Arrays.sort(nums);
for (int i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    int l = i + 1, r = nums.length - 1;
    while (l < r) {
        int s = nums[i] + nums[l] + nums[r];
        if (s == 0) {
            res.add(Arrays.asList(nums[i], nums[l], nums[r]));
            while (l < r && nums[l] == nums[l + 1]) l++;
            l++; r--;
        } else if (s < 0) l++; else r--;
    }
}`, 'Wahi "sort + same skip" idea — 3Sum me bhi!'),
      ),
      c1: 'Concept: LC 39 vs LC 40 — do line ka fark',
      concept: [
        { table: { head: ['', 'LC 39', 'LC 40'], rows: [
          ['Input duplicates?', 'Nahi (distinct)', 'Haan'],
          ['Element reuse?', 'Unlimited', 'Har index ek baar'],
          ['Recurse', '<code>bt(i, …)</code>', '<code>bt(i + 1, …)</code>'],
          ['Duplicate skip', 'Nahi chahiye', '<code>if (i &gt; start &amp;&amp; c[i] == c[i−1]) continue;</code>'],
          ['Sort + break', 'Haan', 'Haan'],
        ] } },
        { pre: `sorted [1,1,2,5,6,7,10], target 8 — level 0:
 i=0 (1) → explore   [1, ...]
 i=1 (1) → SKIP      (same value, same level: [1(b), ...] = [1(a), ...] dobara)
 i=2 (2) → explore   [2, ...]
Level 1 (path [1(a)]): i=1 (1) → i == start → ALLOWED → [1,1,6] ban sakta` },
        { tip: 'Order: pehle duplicate skip (continue), phir break check. Dono ka order ulta karo toh bhi sahi chalega, par skip pehle likhna readable hai.' },
      ],
      t3: 'Brute (pick / skip + Set) → Optimal',
      think: [
        { p: '<b>Brute:</b> sort, har index pe pick (i+1) / skip (i+1), remain == 0 → HashSet me copy. Sahi hai lekin n = 100 pe 2¹⁰⁰ tree → TLE (remain &lt; 0 cut kuch madad karta hai par kaafi nahi).' },
        { p: '<b>Optimal:</b> for-loop + sorted break + same-level skip. Har unique combination exactly ek baar banta hai.' },
        { olist: ['Sort.', 'remain == 0 → copy.', 'Loop: dup skip → break if too big → add → bt(i + 1, remain − c[i]) → remove.'] },
      ],
      d4: 'candidates = [10,1,2,7,6,1,5], target = 8 → sorted [1,1,2,5,6,7,10]',
      dry: [
        { table: { head: ['Path', 'remain', 'Next choices (start..)', 'Result'], rows: [
          ['[1]', '7', '1, 2, 5, 6, 7', '—'],
          ['[1,1]', '6', '2 → [1,1,2] r4 (5 &gt; 4 break); 5 → r1 (6 &gt; 1 break); 6 → r0', '<b>[1,1,6]</b>; 7 &gt; 6 break'],
          ['[1,2]', '5', '5 → r0', '<b>[1,2,5]</b>; 6 &gt; 5 break'],
          ['[1,5]', '2', '6 &gt; 2 break', '—'],
          ['[1,6]', '1', '7 &gt; 1 break', '—'],
          ['[1,7]', '0', '—', '<b>[1,7]</b>'],
          ['[1] level-0 i=1', '—', 'same 1 → <b>skip</b>', '—'],
          ['[2]', '6', '5 → r1 break; 6 → r0', '<b>[2,6]</b>; 7 &gt; 6 break'],
          ['[5]', '3', '6 &gt; 3 break', '—'],
          ['[6]', '2', '7 &gt; 2 break', '—'],
          ['[7]', '1', '10 &gt; 1 break', '—'],
          ['level 0 i=6 (10)', '—', '10 &gt; 8 → break', '—'],
        ] } },
        { p: 'Answer: <code>[[1,1,6],[1,2,5],[1,7],[2,6]]</code> (ye trace Java + visualizer se verify kiya).' },
      ],
      code: [
        { p: '<b>Optimal</b>' },
        { code: sol(40, 1) },
        { lines: [
          ['Arrays.sort(candidates);', 'Duplicate skip + break dono ke liye.'],
          ['if (i > start && c[i] == c[i - 1]) continue;', 'Same level duplicate → skip.'],
          ['if (c[i] > remain) break;', 'Prune.'],
          ['backtrack(c, i + 1, remain - c[i], path, res);', 'i + 1 — har element ek baar.'],
        ] },
        { p: '<b>Brute — pick / skip + HashSet</b>' },
        { code: sol(40, 0) },
      ],
      v6: 'skip + break dono',
      look: [
        'Level 0 pe doosra <code>1</code> laal (skip) hota hai.',
        'Break pe aage ke saare elements laal.',
        '<code>remain</code> aur CALL STACK ka <code>start</code> saath me dekho.',
        'Brute tab me same input — set "duplicate ignore" steps dekho.',
      ],
      viz: [[40, 0, 0], [40, 1, 0]],
      edge: [
        ['<code>[2,5,2,1,2]</code>, 5', '<code>[[1,2,2],[5]]</code>', 'Teen 2, par [1,2,2] ek baar'],
        ['<code>[3]</code>, 2', '<code>[]</code>', '3 &gt; 2 break'],
        ['20 × 1, target 5', '<code>[[1,1,1,1,1]]</code>', 'Brute set yahan explode; optimal chhota'],
        ['target sab se chhota', '<code>[]</code>', 'Pehla element hi break'],
      ],
      cx: [
        ['Brute pick/skip + Set', 'O(n · 2ⁿ)', 'O(n · ans) set', 'Duplicates baad me hatao'],
        ['Sort + skip + break', 'O(n · 2ⁿ) worst', 'O(n) stack', 'Duplicates banne hi nahi'],
      ],
      cxNote: 'target ≤ 30 aur candidates ≥ 1 → depth ≤ 30. Break + skip ki wajah se practical tree chhota.',
      qa: [
        ['LC 39 vs 40 recurse arg?', '39: i (reuse), 40: i + 1.'],
        ['LC 40 me duplicate skip kyun?', 'Input me same values hain → same level pe same subtree.'],
        ['[1,1,6] kaise allowed?', 'Level 1 pe doosra 1 i == start hai → skip nahi.'],
        ['Brute kyun TLE?', 'n = 100 → 2¹⁰⁰ paths.'],
        ['Skip aur break me pehle kaun?', 'Dono order chalte; skip pehle readable.'],
        ['Sort ke bina break?', 'Galat — aage chhote elements chhoot jaayenge.'],
        ['Depth max?', 'target / min ≤ 30.'],
        ['3Sum se connection?', 'Same idea: sort + adjacent duplicate skip.'],
      ],
      say: [
        ['Approach explain karo (Combination Sum II)', 'Each element may be used once and the input has duplicates, so I sort and backtrack with the remaining target. In the loop I first skip c[i] if i is greater than start and it equals c[i−1], which prevents duplicate combinations; then I break if c[i] exceeds the remainder since everything after is larger. I choose c[i], recurse with i + 1 because it cannot be reused, and remove it afterwards. Recording happens when the remainder is zero.'],
        ['Compare LC 39 and LC 40', 'In 39, candidates are distinct and reusable, so I recurse with i and need no duplicate check. In 40, candidates may repeat and are single-use, so I recurse with i + 1 and skip equal siblings. Both sort and use the break pruning.'],
        ['1-minute: Why not a HashSet?', 'Generating every combination and deduplicating with a set works, but the set only removes duplicates after we already paid to build them, and with 100 elements the search explodes. Skipping equal siblings stops duplicates from being explored at all.'],
      ],
      sohvi: [
        'LC 39 vs 40 table khud banao.',
        'Example 2 ([2,5,2,1,2], 5) ka tree banao.',
        'Optimal code likho.',
        'Visualizer: skip aur break steps dekho.',
      ],
      sohel: [
        '<b>Task A:</b> LC 40 optimal 10 min.',
        '<b>Task B:</b> LC 39 aur 40 ek ke baad ek likho — sirf 2 line badlo.',
        '<b>Task C:</b> 3Sum ke duplicate skip se connection 30 sec me bolo.',
      ],
      hw: ['LC 40 Accepted.', 'Kal: pick/not-pick vs for-loop — dono styles me 40 aur 90.'],
      test: [
        ['LC 40 recurse?', '<code>backtrack(c, i + 1, remain - c[i], path, res)</code>'],
        ['Example 1 answer?', '[[1,1,6],[1,2,5],[1,7],[2,6]]'],
        ['Skip condition?', 'i &gt; start &amp;&amp; c[i] == c[i−1]'],
        ['Break condition?', 'c[i] &gt; remain'],
        ['LC 39 aur 40 me common?', 'Sort + remain + break.'],
      ],
      checks: ['LC 39 vs 40 ka fark bol sakta/sakti hu', 'Example 1 ka dry-run kiya', 'Optimal Accepted', 'Brute samjha', 'Visualizer dekha', 'Self-test sahi'],
      memory: 'LC 40 = LC 39 + i+1 + same-level skip.',
    }),

    // ======================= DAY 10 =======================
    10: learn({
      title: 'Pick / Not-pick vs For-loop — brute approaches of 40 & 90',
      goal: 'Do recursion styles ka fark: <b>binary pick/not-pick</b> vs <b>n-ary for-loop</b>. LC 40 aur LC 90 ke brute (HashSet) approaches samajhna aur kab kaunsa style.',
      main: 40,
      revTitle: 'Arrays + BST + LC 40',
      rev: [].concat(
        rq(26, 'Sorted array se duplicates in-place hatao, unique count return.', '[0,0,1,1,1,2,2] → 3, nums = [0,1,2,…]', 'Read / write pointers',
          ['k = 1.', 'nums[i] != nums[k−1] → nums[k++] = nums[i].', 'Return k.'],
          `public int removeDuplicates(int[] nums) {
    int k = 1;
    for (int i = 1; i < nums.length; i++)
        if (nums[i] != nums[k - 1]) nums[k++] = nums[i];
    return k;
}`, 'Sorted → duplicate pichle ke barabar.'),
        rq(40, 'Combination Sum II (kal ka).', '[10,1,2,7,6,1,5], 8 → [[1,1,6],[1,2,5],[1,7],[2,6]]', 'Sort + skip + break + i+1',
          ['Sort.', 'Skip same level dup.', 'Break on too big.', 'Recurse i + 1.'],
          `for (int i = start; i < c.length; i++) {
    if (i > start && c[i] == c[i - 1]) continue;
    if (c[i] > remain) break;
    path.add(c[i]);
    backtrack(c, i + 1, remain - c[i], path, res);
    path.remove(path.size() - 1);
}`, '39 + i+1 + skip.'),
        rq(230, 'BST me kth smallest.', '[3,1,4,null,2], k = 1 → 1', 'Inorder = sorted',
          ['Inorder (left, node, right).', 'Counter ghatao.', 'k == 0 → answer.'],
          `int k, ans;
public int kthSmallest(TreeNode root, int k) { this.k = k; in(root); return ans; }
private void in(TreeNode n) {
    if (n == null || k == 0) return;
    in(n.left);
    if (--k == 0) { ans = n.val; return; }
    in(n.right);
}`, 'BST inorder sorted — kth visit.'),
      ),
      c1: 'Concept: Binary tree (lo/chhodo) vs N-ary tree (agla kaun)',
      concept: [
        { pre: `Pick / not-pick ([1,2]):           For-loop ([1,2]):
          i=0                              []
       ✓/    \\✗                          /    \\
      [1]     []      i=1               [1]   [2]
     ✓/ \\✗  ✓/ \\✗                       |
  [1,2] [1] [2] []    leaves = answers  [1,2]       every node = answer` },
        { table: { head: ['', 'Pick / not-pick', 'For-loop'], rows: [
          ['Tree shape', 'Binary, depth n', 'N-ary, depth ≤ n'],
          ['Answer', 'Leaf (i == n) ya condition', 'Har node / condition'],
          ['Duplicate skip', 'Mushkil (skip branch me aage same values bhi skip karne padte)', 'Ek line: i &gt; start'],
          ['Sorted break', 'Nahi (sirf remain &lt; 0 check)', 'Haan'],
          ['Aage use', 'DP / memoization (Phase 11)', 'Backtracking problems'],
        ] } },
        { p: 'Isliye duplicates wale problems (40, 90) ke brute me <b>HashSet</b> chahiye — pick/not-pick khud duplicates nahi rokta.' },
      ],
      t3: 'Dono styles side by side',
      think: [
        { p: '<b>LC 40 brute:</b> sort → pick(i+1, remain − c[i]) / skip(i+1, remain). remain == 0 → set.add. remain &lt; 0 / i == n → return.' },
        { p: '<b>LC 90 brute:</b> sort → har mask ka subset → set.add.' },
        { p: 'Dono me sort kyun? <code>[1(a),7]</code> aur <code>[1(b),7]</code> same List dikhein, aur [2,1] / [1,2] same order me bane — tabhi HashSet unhe same maanta hai.' },
        { tip: 'Interview me brute pehle bolo ("generate + dedupe with a set"), fir optimize ("skip equal siblings"). Ye Brute → Optimal ka saaf jump hai.' },
      ],
      d4: 'LC 40 brute: [2,5,2,1,2], target 5 (sorted [1,2,2,2,5])',
      dry: [
        { table: { head: ['Path reached remain 0', 'set.add', 'Set size'], rows: [
          ['[1,2,2] (indices 0,1,2)', 'naya', '1'],
          ['[1,2,2] (indices 0,1,3)', 'duplicate → ignore', '1'],
          ['[1,2,2] (indices 0,2,3)', 'duplicate → ignore', '1'],
          ['[5]', 'naya', '2'],
        ] } },
        { p: 'Brute ne [1,2,2] <b>teen baar</b> banaya; optimal sirf ek baar. Answer: <code>[[1,2,2],[5]]</code>.' },
        { p: '<b>LC 90 brute</b> [1,2,2]: masks 010 → [2] aur 100 → [2] same; 011 → [1,2] aur 101 → [1,2] same → 8 me se 6 unique.' },
      ],
      code: [
        { p: '<b>LC 40 brute</b>' },
        { code: sol(40, 0) },
        { lines: [
          ['Set<List<Integer>> set = new HashSet<>();', 'Duplicate combinations yahan auto-remove.'],
          ['if (i == c.length || remain < 0) return;', 'Dead end.'],
          ['dfs(c, i + 1, remain - c[i], path, set);', 'Pick (ek baar).'],
          ['dfs(c, i + 1, remain, path, set);', 'Skip.'],
          ['return new ArrayList<>(set);', 'Set → List.'],
        ] },
        { p: '<b>LC 90 brute</b>' },
        { code: sol(90, 0) },
      ],
      v6: 'brute variants (Set)',
      look: [
        'LC 40 <b>Brute</b> tab: CALL STACK binary tree jaisa gehra jaata hai (dfs(i, remain)).',
        '"set me pehle se hai, ignore" wale steps — wasted work.',
        'LC 90 brute: same subset kab dobara aata hai.',
      ],
      viz: [[40, 1, 1], [90, 0, 1]],
      edge: [
        ['LC 40, 20 × 1, target 5', '[[1,1,1,1,1]]', 'Brute: C(20,5) = 15504 baar same list banegi'],
        ['LC 90 [2,2,2]', '4 subsets', '8 masks me se 4 duplicate'],
        ['Brute bina sort', 'galat', '[2,1] aur [1,2] alag lists'],
      ],
      cx: [
        ['LC 40 brute', 'O(n · 2ⁿ)', 'O(set)', 'Binary tree + set'],
        ['LC 40 optimal', 'O(n · 2ⁿ) worst', 'O(n)', 'Skip + break'],
        ['LC 90 brute', 'O(n · 2ⁿ)', 'O(n · 2ⁿ)', 'Masks + set'],
        ['LC 90 optimal', 'O(n · 2ⁿ)', 'O(n)', 'Skip'],
      ],
      cxNote: 'Big-O same dikhta hai, par duplicates heavy input pe brute bahut zyada nodes + hashing karta hai.',
      qa: [
        ['Pick/not-pick me answer kahan?', 'Base case / condition pe (leaf).'],
        ['For-loop style ka fayda?', 'Easy duplicate skip aur sorted break.'],
        ['Brute me HashSet kyun chahiye?', 'Pick/not-pick same combination alag indices se bana sakta hai.'],
        ['HashSet&lt;List&gt; me sort kyun?', 'Same content same order me ho tabhi equals true.'],
        ['20 ones, target 5: brute kitni baar [1,1,1,1,1]?', 'C(20,5) = 15504.'],
        ['Pick/not-pick kahan kaam aayega?', 'DP (Phase 11) — memoization (i, remain) pe.'],
        ['LC 90 brute masks?', '2ⁿ.'],
        ['Brute → optimal ka ek line summary?', 'Generate + dedupe → skip equal siblings.'],
      ],
      say: [
        ['Pick/not-pick vs for-loop', 'Pick/not-pick makes a binary decision for each index and records at the leaves, which maps naturally to memoization later. The for-loop style asks which element comes next from start onward, every node can be an answer, and it makes duplicate skipping and sorted breaking a one-line change. I use the for-loop style for subsets and combinations.'],
        ['Brute force for duplicates', 'The simplest correct approach is to sort, generate every candidate with pick or skip, and add each valid one to a HashSet of lists. Sorting makes equal combinations identical lists. It works but wastes time building duplicates, which motivates skipping equal siblings.'],
        ['1-minute: Brute to optimal story', 'I first propose generate-and-dedupe with a set to have a correct baseline, mention that it repeats work when values repeat, and then show that skipping an element equal to its previous sibling at the same level prevents duplicates at the source with the same worst-case bound and much less work in practice.'],
      ],
      sohvi: ['Dono trees ([1,2]) paper pe.', 'LC 90 brute (bitmask + set) likho.', 'Visualizer me brute vs optimal steps compare.'],
      sohel: ['<b>Task A:</b> LC 40 aur 90 — brute + optimal, 25 min.', '<b>Task B:</b> Pick/not-pick version me duplicate skip kaise karoge? (skip branch me same values jump.) Socho aur bolo.', '<b>Task C:</b> Brute → Optimal story 60 sec.'],
      hw: ['LC 40 brute + LC 90 brute Accepted (90 brute pass hota hai; 40 brute TLE ho sakta).', 'Kal: LC 131 Palindrome Partitioning padho.'],
      test: [
        ['Binary vs n-ary tree — kaunsa style?', 'Pick/not-pick = binary, for-loop = n-ary.'],
        ['Brute dedupe tool?', 'HashSet&lt;List&lt;Integer&gt;&gt;'],
        ['Brute me sort kyun?', 'Same lists same order.'],
        ['Optimal dedupe tool?', 'i &gt; start skip.'],
        ['Pick/not-pick DP ke liye kyun achha?', 'State (i, remain) clear hai → memoize.'],
      ],
      checks: ['Dono recursion styles ke trees bana sakta/sakti hu', 'LC 40 brute samjha', 'LC 90 brute Accepted', 'Brute vs optimal ka trade-off bol sakta/sakti hu', 'Visualizer variants dekhe', 'Self-test sahi'],
      memory: 'Binary (lo/chhodo) → set chahiye; for-loop → skip ek line.',
    }),

    // ======================= DAY 11 =======================
    11: learn({
      title: 'Palindrome Partitioning — string ko cut karna',
      goal: '<b>LC 131</b>: "kahan cut karein" ko choice maan ke backtracking. Prefix palindrome check (two pointers) se pruning.',
      main: 131,
      revTitle: 'Two Pointers + Trees + LC 90',
      rev: [].concat(
        rq(125, 'Sirf alphanumeric, case ignore karke palindrome?', '"A man, a plan, a canal: Panama" → true', 'Two pointers',
          ['l = 0, r = n − 1.', 'Non-alphanumeric skip.', 'Lowercase compare; mismatch → false.'],
          `public boolean isPalindrome(String s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
        while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
        if (Character.toLowerCase(s.charAt(l++)) != Character.toLowerCase(s.charAt(r--))) return false;
    }
    return true;
}`, 'Dono kinaron se andar; aaj isPal isi ka chhota roop.'),
        rq(90, 'Subsets II.', '[1,2,2] → 6 unique', 'Sort + skip',
          ['Sort.', 'Record har node.', 'Same level dup skip.'],
          `res.add(new ArrayList<>(path));
for (int i = start; i < nums.length; i++) {
    if (i > start && nums[i] == nums[i - 1]) continue;
    path.add(nums[i]); backtrack(nums, i + 1, path, res); path.remove(path.size() - 1);
}`, 'i > start.'),
        rq(102, 'Tree ko level by level list me.', '[3,9,20,null,null,15,7] → [[3],[9,20],[15,7]]', 'BFS queue + level size',
          ['Queue me root.', 'size = q.size() — ek level.', 'size baar poll, children add.'],
          `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new LinkedList<>();
    q.add(root);
    while (!q.isEmpty()) {
        List<Integer> lvl = new ArrayList<>();
        for (int k = q.size(); k > 0; k--) {
            TreeNode n = q.poll(); lvl.add(n.val);
            if (n.left != null) q.add(n.left);
            if (n.right != null) q.add(n.right);
        }
        res.add(lvl);
    }
    return res;
}`, 'Size freeze = ek level.'),
      ),
      c1: 'Concept: Partition = cuts ki choice',
      concept: [
        { p: 'Length n ki string me n − 1 gaps hain. Har gap pe cut ho ya na ho → 2ⁿ⁻¹ partitions. Hume sirf woh jinme <b>har piece palindrome</b>.' },
        { pre: `s = "aab", start se har end try:
                  start=0
       "a"✓ /     "aa"✓ |     "aab"✗
     start=1        start=2
   "a"✓/  "ab"✗      "b"✓
  start=2           start=3 → [aa, b] ✓
   "b"✓
  start=3 → [a, a, b] ✓` },
        { table: { head: ['Template part', 'Is problem me'], rows: [
          ['State', '<code>start</code> = abhi kahan se piece shuru'],
          ['Choices', '<code>end = start..n−1</code> → piece <code>s[start..end]</code>'],
          ['Prune', 'Piece palindrome nahi → <code>continue</code>'],
          ['Base', '<code>start == n</code> → poori string cut → copy'],
        ] } },
        { tip: '<code>s.substring(start, end + 1)</code> — Java me end <b>exclusive</b> hai, isliye +1.' },
      ],
      t3: 'Saare cuts → palindrome prune',
      think: [
        { p: '<b>Brute:</b> 2ⁿ⁻¹ cut patterns banao, har ek me saare pieces check karo. O(n · 2ⁿ) bhi, lekin har pattern alag se verify.' },
        { p: '<b>Backtracking:</b> pieces left-to-right banao aur <b>turant</b> check karo — galat prefix pe poora subtree kat jaata hai. "ab" palindrome nahi → "ab…" se shuru hone wale saare partitions skip.' },
        { olist: ['start == n → copy.', 'end = start..n−1: isPal(start, end)?', 'Haan → add substring → recurse(end + 1) → remove.'] },
      ],
      d4: 's = "aab"',
      dry: [
        { table: { head: ['Frame (start)', 'end', 'piece', 'isPal', 'Action', 'path'], rows: [
          ['0', '0', '"a"', '✓', 'choose → bt(1)', '[a]'],
          ['1', '1', '"a"', '✓', 'choose → bt(2)', '[a,a]'],
          ['2', '2', '"b"', '✓', 'choose → bt(3): <b>record</b>', '[a,a,b]'],
          ['1', '2', '"ab"', '✗ (a ≠ b)', 'continue', '[a]'],
          ['0', '1', '"aa"', '✓', 'choose → bt(2)', '[aa]'],
          ['2', '2', '"b"', '✓', 'choose → bt(3): <b>record</b>', '[aa,b]'],
          ['0', '2', '"aab"', '✗', 'continue', '[]'],
        ] } },
        { p: 'Answer: <code>[["a","a","b"],["aa","b"]]</code>. isPal 6 baar call hua.' },
      ],
      code: [
        { code: sol(131, 0) },
        { lines: [
          ['if (start == s.length())', 'Saari string pieces me bant gayi → ek valid partition.'],
          ['for (int end = start; end < s.length(); end++)', 'Har possible piece s[start..end].'],
          ['if (!isPal(s, start, end)) continue;', 'Prune — invalid piece pe cut nahi.'],
          ['path.add(s.substring(start, end + 1));', 'Choose (end inclusive ke liye +1).'],
          ['backtrack(s, end + 1, path, res);', 'Explore baaki string.'],
          ['s.charAt(l++) != s.charAt(r--)', 'Two pointers andar ki taraf.'],
        ] },
      ],
      v6: 'start / end pointers + isPal frames',
      look: [
        '<b>s</b> me done = already cut, neela = current piece, laal = palindrome nahi.',
        'CALL STACK me <code>isPal(l, r)</code> frame bhi upar aata hai — function call bhi stack pe!',
        '<b>path</b> me strings, <b>res</b> me poore partitions.',
        'Apna input try karo: <code>aaa</code> (4 partitions), <code>efe</code> (2).',
      ],
      viz: [[131, 0, 0]],
      edge: [
        ['<code>"a"</code>', '<code>[["a"]]</code>', 'Ek char palindrome'],
        ['<code>"aaa"</code>', '4 partitions', 'Har cut valid: 2² = 4'],
        ['<code>"efe"</code>', '<code>[[e,f,e],[efe]]</code>', '"ef", "fe" invalid'],
        ['<code>"abc"</code>', '<code>[[a,b,c]]</code>', 'Sirf single chars'],
      ],
      cx: [
        ['All cuts + verify', 'O(n · 2ⁿ)', 'O(n)', '2ⁿ⁻¹ patterns, har ek verify'],
        ['Backtracking + isPal', 'O(n · 2ⁿ)', 'O(n) stack', 'Prefix prune; check O(n)'],
      ],
      cxNote: 'Worst case "aaaa…" — sab partitions valid (2ⁿ⁻¹), har ek O(n) copy. n ≤ 16 → ~5 lakh ops, fine.',
      qa: [
        ['State kya hai?', 'start index.'],
        ['Base case?', 'start == s.length().'],
        ['substring ka end?', 'Exclusive → end + 1.'],
        ['Max partitions?', '2ⁿ⁻¹.'],
        ['isPal complexity?', 'O(length).'],
        ['"ab" fail hone ka fayda?', '"ab…" wale saare branches prune.'],
        ['Recursion depth?', '≤ n.'],
        ['Kal ka optimization?', 'DP table pal[i][j] → O(1) check.'],
      ],
      say: [
        ['Approach explain karo (Palindrome Partitioning)', 'I treat each step as choosing where the next cut goes. From index start I try every end; if s[start..end] is a palindrome I add it to the path and recurse from end + 1, then remove it. Non-palindromic prefixes are pruned immediately. When start equals the length, the path is a complete partition and I copy it. There are at most 2^(n−1) partitions, each copied in O(n), so O(n·2^n) time and O(n) depth.'],
        ['Follow-up: "Count only?"', 'If only the number of partitions or the minimum number of cuts is needed, I would not enumerate; dynamic programming over prefixes with a palindrome table solves it in O(n^2).'],
        ['1-minute: Partition modelling', 'Partitioning is backtracking where the choice is the end of the next piece; valid pieces are explored, invalid ones are pruned, and reaching the end of the string means one full answer.'],
      ],
      sohvi: ['"aab" ka tree banao.', 'isPal two pointers se khud likho.', 'Poora code likho.', 'Visualizer me "aaa" chalao — 4 answers.'],
      sohel: ['<b>Task A:</b> 12 min me Accepted.', '<b>Task B:</b> "aaaa" ke partitions count bina code — 8.', '<b>Task C:</b> Follow-up "min cuts" ka approach bolo (DP).'],
      hw: ['LC 131 Accepted.', 'Kal: DP palindrome table — pal[i][j] ka formula socho.'],
      test: [
        ['"aab" answer?', '[[a,a,b],[aa,b]]'],
        ['Choice kya hai?', 'end index (piece ka end).'],
        ['Prune kab?', 'Piece palindrome nahi.'],
        ['"aaa" count?', '4'],
        ['substring(start, end + 1) kyun?', 'end exclusive.'],
      ],
      checks: ['Partition ko "cut choice" ki tarah model kiya', '"aab" tree banaya', 'Code Accepted', 'Visualizer me isPal frames dekhe', 'Edge cases try kiye', 'Self-test sahi'],
      memory: 'start se har end: palindrome → add → recurse(end+1) → remove; start == n → answer.',
    }),

    // ======================= DAY 12 =======================
    12: learn({
      title: 'Palindrome Partitioning — DP table optimization + catch-up',
      goal: '<b>LC 131</b> ka doosra approach: <b>pal[i][j] DP table</b> se O(1) palindrome check. Catch-up: <b>LC 39</b> bina dekhe.',
      main: 131,
      revTitle: 'Trees + Arrays + LC 131',
      rev: [].concat(
        rq(131, 'Palindrome Partitioning (kal ka).', '"aab" → [[a,a,b],[aa,b]]', 'Backtracking cuts',
          ['start == n → copy.', 'end loop, isPal prune.', 'add → recurse(end + 1) → remove.'],
          `for (int end = start; end < s.length(); end++) {
    if (!isPal(s, start, end)) continue;
    path.add(s.substring(start, end + 1));
    backtrack(s, end + 1, path, res);
    path.remove(path.size() - 1);
}`, 'Cut, check, recurse.'),
        rq(199, 'Tree ka right side view (har level ka last node).', '[1,2,3,null,5,null,4] → [1,3,4]', 'BFS last of level / DFS right-first',
          ['DFS(node, depth): right pehle.', 'depth == res.size() → pehla node is depth ka → add.'],
          `public List<Integer> rightSideView(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    dfs(root, 0, res);
    return res;
}
private void dfs(TreeNode n, int d, List<Integer> res) {
    if (n == null) return;
    if (d == res.size()) res.add(n.val);
    dfs(n.right, d + 1, res);
    dfs(n.left, d + 1, res);
}`, 'Right pehle; har depth ka pehla = dikhne wala.'),
        rq(53, 'Maximum subarray sum.', '[-2,1,-3,4,-1,2,1,-5,4] → 6', 'Kadane',
          ['cur = max(x, cur + x).', 'best = max(best, cur).'],
          `public int maxSubArray(int[] nums) {
    int cur = 0, best = Integer.MIN_VALUE;
    for (int x : nums) { cur = Math.max(x, cur + x); best = Math.max(best, cur); }
    return best;
}`, 'Extend ya restart.'),
      ),
      c1: 'Concept: pal[i][j] DP',
      concept: [
        { p: '<code>s[i..j]</code> palindrome tab hai jab <b>dono kinare same</b> aur <b>andar ka hissa</b> palindrome (ya length ≤ 2):' },
        { code: `pal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || pal[i + 1][j - 1]);` },
        { p: '<code>pal[i+1][j−1]</code> pehle ready hona chahiye → <b>i neeche se upar</b> (n−1 → 0), j = i → n−1.' },
        { pre: `"aab" table (T = palindrome):
        j=0 a  j=1 a  j=2 b
i=0      T      T      F     ("a", "aa", "aab")
i=1             T      F     ("a", "ab")
i=2                    T     ("b")` },
        { tip: 'Backtracking me ek hi (start, end) pair baar-baar check hota hai (alag branches se). Table banake O(n²) ek baar, fir har check O(1).' },
      ],
      t3: 'isPal har baar → DP table',
      think: [
        { p: '<b>Approach 1:</b> isPal O(n) har check. Same pairs repeat: "aaaa" me (2,3) kai branches me check hota hai.' },
        { p: '<b>Approach 2:</b> pehle table, fir same backtracking — sirf condition <code>!pal[start][end]</code>.' },
        { p: 'Big-O same (O(n · 2ⁿ) — output dominate karta hai), par constant chhota. Extra O(n²) memory.' },
        { p: '<b>Catch-up LC 39:</b> Part 12 me 10 min ka timer.' },
      ],
      d4: '"aab" table fill order',
      dry: [
        { table: { head: ['Step', '(i, j)', 's[i], s[j]', 'Rule', 'pal'], rows: [
          ['1', '(2,2)', 'b, b', 'same, len 1', 'T'],
          ['2', '(1,1)', 'a, a', 'same, len 1', 'T'],
          ['3', '(1,2)', 'a, b', 'different', 'F'],
          ['4', '(0,0)', 'a, a', 'same, len 1', 'T'],
          ['5', '(0,1)', 'a, a', 'same, len 2', 'T'],
          ['6', '(0,2)', 'a, b', 'different', 'F'],
        ] } },
        { p: 'Backtracking checks: pal[0][0] T, pal[1][1] T, pal[2][2] T, pal[1][2] F, pal[0][1] T, pal[2][2] T, pal[0][2] F → same 2 answers.' },
      ],
      code: [
        { code: sol(131, 1) },
        { lines: [
          ['boolean[][] pal = new boolean[n][n];', 'pal[i][j] = s[i..j] palindrome?'],
          ['for (int i = n - 1; i >= 0; i--)', 'Neeche se — pal[i+1][…] pehle ready.'],
          ['j - i < 2 || pal[i + 1][j - 1]', 'Length 1–2 → sirf kinare; warna andar bhi.'],
          ['if (!pal[start][end]) continue;', 'O(1) prune.'],
        ] },
      ],
      v6: 'DP table + recursion',
      look: [
        '<b>DP table</b> tab: pehle table cell-by-cell bharta hai (hara T, laal F).',
        'Fir recursion me har check table ke ek cell pe highlight.',
        'Default tab (isPal) se steps compare karo.',
      ],
      viz: [[131, 0, 1]],
      edge: [
        ['<code>"a"</code>', '[["a"]]', 'Table 1×1'],
        ['<code>"aaaa"</code>', '8 partitions', 'Pura table T (upper half)'],
        ['<code>"abba"</code>', '[[a,b,b,a],[a,bb,a],[abba]]', 'Andar "bb" se "abba" T'],
      ],
      cx: [
        ['isPal har baar', 'O(n · 2ⁿ)', 'O(n)', 'Check O(n)'],
        ['DP table', 'O(n² + n · 2ⁿ)', 'O(n²)', 'Check O(1)'],
      ],
      cxNote: 'n ≤ 16 → table 256 cells. Trade: thodi memory, repeat checks khatam.',
      qa: [
        ['pal formula?', 's[i] == s[j] &amp;&amp; (j − i &lt; 2 || pal[i+1][j−1])'],
        ['i ulta loop kyun?', 'pal[i+1][j−1] pehle compute hona chahiye.'],
        ['Table ka space?', 'O(n²).'],
        ['Big-O badla?', 'Nahi — output dominate; constant improve.'],
        ['j − i &lt; 2 ka matlab?', 'Length 1 ya 2 — sirf kinare compare.'],
        ['"abba" ke partitions?', '3.'],
        ['Kab DP alone?', 'Count / min cuts poochhe toh.'],
        ['Backtracking me kya badla?', 'Sirf condition: !pal[start][end].'],
      ],
      say: [
        ['DP + backtracking', 'Every branch asks whether some substring is a palindrome, and the same pairs repeat across branches. I precompute an n by n table where pal[i][j] is true if the ends match and the inside is a palindrome, filling i from the end so the inner value is ready. The backtracking stays the same but each check is O(1). The O(n·2^n) bound is still dominated by the output.'],
        ['Follow-up: memory trade-off', 'The table costs O(n^2) memory, which is tiny for n up to 16. On a very long string I would only do this if repeated checks dominated; otherwise the two-pointer check is fine.'],
        ['1-minute: When to combine DP with backtracking', 'When the search repeatedly asks the same sub-question, precompute those answers with DP; when the problem only needs a count or an optimum, use DP alone instead of enumerating.'],
      ],
      sohvi: ['"aab" table khud bharo.', '"abba" table bharo.', 'DP version optional; isPal version bina dekhe likho.', 'LC 39 dobara (catch-up).'],
      sohel: ['<b>Task A:</b> LC 131 DP version 12 min.', '<b>Task B:</b> LC 39 catch-up — 10 min timer, bina dekhe.', '<b>Task C:</b> "min cuts" DP ka state bolo: cuts[i] = min over j (pal[j][i]) of cuts[j−1] + 1.'],
      hw: ['LC 131 DP version Accepted.', 'LC 39 dobara Accepted.', 'Kal Saturday: 90, 40, 131, 46 revision.'],
      test: [
        ['pal[0][1] for "aab"?', 'T'],
        ['Fill order?', 'i = n−1 → 0, j = i → n−1.'],
        ['DP version space?', 'O(n²).'],
        ['LC 39 recurse arg?', 'i'],
        ['"aaaa" partitions?', '8'],
      ],
      checks: ['pal[i][j] formula samjha', 'Table fill order bol sakta/sakti hu', 'DP version Accepted (Sohel must)', 'LC 39 catch-up Accepted', 'Visualizer DP tab dekha', 'Self-test sahi'],
      memory: 'pal[i][j] = kinare same && andar pal; i neeche se.',
    }),

    // ======================= DAY 13 (SAT) =======================
    13: {
      title: 'Revision — Week 2 (Duplicates + Partitioning)',
      goal: 'Week 2 ke 3 questions + LC 46 — <b>bina dekhe</b>, timer ke saath. Sohel: System Design session.',
      main: null,
      parts: [
        { title: 'Part 0 — Aaj ka revision plan', blocks: [
          { table: { head: ['Question', 'Timer', 'Rule'], rows: [
            ['LC 90 Subsets II', '15 min', 'Skip condition pehle bolo'],
            ['LC 40 Combination Sum II', '20 min', '39 se 2 line ka fark'],
            ['LC 131 Palindrome Partitioning', '20 min', 'Tree "aab" pehle'],
            ['LC 46 Permutations', '10 min', 'Swap version (Sohel), used[] (Sohvi)'],
          ] } },
          { list: ['Notes band.', 'Har question ke baad viz se match.', 'Mistakes log update.'] },
        ] },
        { title: 'Part 1 — LC 90 Subsets II', blocks: [
          { problem: 90 }, { p: '<b>Pattern:</b> Sort + same level skip.' }, { pre: '[1,2,2] → [], [1], [1,2], [1,2,2], [2], [2,2]' },
          { code: sol(90, 1) }, { tip: 'Memory hook: <b>i > start && same → continue.</b>' }, { viz: 90, ex: 0 },
        ] },
        { title: 'Part 2 — LC 40 Combination Sum II', blocks: [
          { problem: 40 }, { p: '<b>Pattern:</b> Sort + skip + break + i+1.' }, { pre: '[2,5,2,1,2], 5 → [[1,2,2],[5]]' },
          { code: sol(40, 1) }, { tip: 'Memory hook: <b>39 + i+1 + skip.</b>' }, { viz: 40, ex: 1 },
        ] },
        { title: 'Part 3 — LC 131 Palindrome Partitioning', blocks: [
          { problem: 131 }, { p: '<b>Pattern:</b> Cut choice + palindrome prune.' }, { pre: '"aab" → [[a,a,b],[aa,b]]' },
          { code: sol(131, 0) }, { tip: 'Memory hook: <b>Cut, check, recurse(end+1).</b>' }, { viz: 131, ex: 0 },
        ] },
        { title: 'Part 4 — LC 46 Permutations', blocks: [
          { problem: 46 }, { p: '<b>Pattern:</b> Swap in-place.' }, { pre: '[1,2,3] → 6' },
          { code: sol(46, 2) }, { tip: 'Memory hook: <b>swap → recurse(start+1) → swap.</b>' }, { viz: 46, ex: 0, variant: 1 },
        ] },
        { title: 'Part 5 — Interview mix', blocks: [{ qa: [
          ['i &gt; start vs i &gt; 0?', 'i &gt; start sirf same level; i &gt; 0 deeper bhi rokta → answers miss.'],
          ['LC 40 me break aur skip dono kyun?', 'Skip duplicates ke liye, break pruning ke liye.'],
          ['LC 131 base case?', 'start == n.'],
          ['Copy kyun?', 'Shared path.'],
          ['pal table fill order?', 'i ulta.'],
          ['Swap version me used[] kyun nahi?', 'Suffix hi unused hai.'],
        ] }] },
        { title: 'Part 6 — Aise bolo (1-minute answers)', blocks: [{ say: [
          ['Copying the path', 'The path list is shared and keeps changing; adding it directly stores a reference, so I add a new ArrayList of it to snapshot the current state.'],
          ['Duplicates in one line', 'Sort, then skip an element equal to its previous sibling at the same recursion level.'],
        ] }] },
        { title: 'Part 7 — Sohvi session', blocks: [{ olist: ['LC 90 bina dekhe.', 'LC 46 used[] bina dekhe.', 'LC 40 aur 131 ke trees + idea.'] }] },
        { title: 'Part 8 — Sohel session (SDE-2 + System Design)', blocks: [
          { olist: ['<b>Task A:</b> Charon 60 min me.', '<b>Task B:</b> Har ek ka follow-up ek line me.', '<b>Task C:</b> Mistakes log se top 2 fix.'] },
          { p: '<b>System Design session (1/week) — 45 min:</b> "Design a rate limiter" — token bucket vs sliding window log/counter, kahan rakhoge (API gateway), distributed counter (Redis INCR + TTL), race conditions, per-user vs per-IP keys.' },
        ] },
        { title: 'Part 9 — Homework', blocks: [{ list: ['Kal mock: Sohvi → LC 46, Tum → LC 40.'] }] },
        { title: 'Part 10 — Final self-test', blocks: [{ qa: [
          ['[2,2,2] subsets II count?', '4'],
          ['LC 40 example 2?', '[[1,2,2],[5]]'],
          ['"aaa" partitions?', '4'],
          ['[1,2,3] swap order last two?', '[3,2,1], [3,1,2]'],
          ['Sort kis-kis me?', '90, 40, 39.'],
        ] }] },
      ],
      checks: ['LC 90 bina dekhe', 'LC 40 bina dekhe', 'LC 131 bina dekhe', 'LC 46 bina dekhe', 'Interview mix', 'System Design session (Sohel)'],
      memory: 'Duplicates → sort + i > start skip. Partition → cut + check.',
    },

    // ======================= DAY 14 (SUN) =======================
    14: {
      title: 'Mock Interview + Contest',
      goal: 'Mock: Tum → Sohvi (<b>LC 46</b>), Sohvi → Tum (<b>LC 40</b>). Fir Weekly Contest discussion.',
      main: null,
      parts: [
        { title: 'Part 0 — Mock format (30 + 30 + 30 min)', blocks: [
          { table: { head: ['Slot', 'Kaun', 'Kya'], rows: [['30 min', 'Tum → Sohvi', 'LC 46'], ['30 min', 'Sohvi → Tum', 'LC 40'], ['30 min', 'Dono', 'Contest discussion']] } },
          { list: ['Hints ladder se hi madad.', 'Candidate pehle clarify kare.'] },
        ] },
        { title: 'Part 1 — Mock Q1 (Tum → Sohvi): LC 46', blocks: [
          { problem: 46 },
          { p: '<b>Kya poochna hai:</b> "Kitne permutations?", "Duplicate values hote toh?", "used[] kyun?"' },
          { olist: ['Hint 1: Pehli position ke kitne options?', 'Hint 2: Kaise pata chalega kaunsa element le chuke?', 'Hint 3: Wapas aate waqt kya undo?'] },
          rubric,
        ] },
        { title: 'Part 2 — Mock Q2 (Sohvi → Tum): LC 40', blocks: [
          { problem: 40 },
          { p: '<b>Kya poochna hai:</b> "Duplicates kaise rokoge?", "Set kyun nahi?", "i &gt; 0 kyun nahi?", "Complexity?"' },
          { olist: ['Hint 1: Sort karke kya dikhta hai?', 'Hint 2: Same level pe same value?', 'Hint 3: Reuse allowed hai?'] },
          rubric,
        ] },
        { title: 'Part 3 — Interview communication checklist', blocks: [{ list: ['Order matter? Reuse? Duplicates? — teen clarifying sawaal.', 'Tree ke 2 level bolo.', 'Code ke baad edge case (empty result, single element).', 'Complexity + space (output alag).'] }] },
        { title: 'Part 4 — LeetCode Weekly Contest plan + discussion', blocks: [
          { list: ['Sunday 8:00 AM IST.', 'Contest me backtracking dikha? Note karo.', 'Unsolved ka editorial.'] },
          { table: { head: ['Problem', 'Pattern socha', 'Kahan atke', 'Fix'], rows: [['Q1', '', '', ''], ['Q2', '', '', ''], ['Q3', '', '', '']] } },
        ] },
        { title: 'Part 5 — Interview mix', blocks: [{ qa: [
          ['Permutations n = 4?', '24'],
          ['LC 40 skip?', 'i &gt; start &amp;&amp; c[i] == c[i−1]'],
          ['Stuck ho toh?', 'Chhota tree banao.'],
          ['Swap vs used?', 'Swap kam memory, input modify.'],
          ['LC 40 recurse?', 'i + 1'],
        ] }] },
        { title: 'Part 6 — Aise bolo', blocks: [{ say: [
          ['When stuck in backtracking', 'I draw two levels of the recursion tree for a tiny input and ask whether order matters, whether elements are reusable and whether duplicates exist; those answers decide the loop start, the recursion index and the skip rule.'],
          ['Wrap-up answer', 'I summarise the approach, state time and space with the output separate, and mention one optimization such as pruning or in-place marking.'],
        ] }] },
        { title: 'Part 7 — Sohvi session', blocks: [{ olist: ['Mock feedback note.', 'LC 46 swap version try.'] }] },
        { title: 'Part 8 — Sohel session', blocks: [{ olist: ['Rubric me sabse kam score wala area 1 cheez improve.', 'Contest Q3 upsolve.'] }] },
        { title: 'Part 9 — Homework', blocks: [{ list: ['Kal: LC 79 Word Search padho — grid me DFS.'] }] },
        { title: 'Part 10 — Final self-test', blocks: [{ qa: [
          ['LC 46 base?', 'size == n / start == n.'],
          ['LC 40 example 1 answers count?', '4'],
          ['3 clarifying sawaal?', 'Order, reuse, duplicates.'],
          ['Contest kab?', 'Sunday 8:00 AM IST.'],
          ['Output space count karte ho?', 'Alag se bolte hain.'],
        ] }] },
      ],
      checks: ['Mock Q1 + rubric', 'Mock Q2 + rubric', 'Contest diya', 'Discussion template', 'Self-test sahi'],
      memory: 'Clarify: order? reuse? duplicates? — phir tree.',
    },
  });
})();
