// Phase 12 (Revision + Mocks) — Week 2 lessons (local days 8–14 = global days 162–168).
// Sirf Phases 1–11 ke course questions re-solve. Koi naya problem nahi.
(function () {
  const P = window.PHASE_CONTENT['revision'];
  P.lessons = P.lessons || {};

  function recap(title, q) {
    const blocks = [
      { p: q.problem },
      { pre: q.example },
      { p: '<b>Pattern:</b> ' + q.pattern + ' · <b>Timer:</b> ' + q.timer },
      { h: 'Thinking steps (bolke)' },
      { olist: q.steps },
      { h: 'Key code' },
      { code: q.code },
    ];
    if (q.edge) blocks.push({ table: { head: ['Edge case', 'Kya hona chahiye'], rows: q.edge } });
    blocks.push({ tip: 'Memory hook: <b>' + q.hook + '</b>' });
    return { title: title, blocks: blocks };
  }

  function mockQ(title, q) {
    return { title: title, blocks: [
      { p: q.problem },
      { pre: q.example },
      { h: 'Interviewer kya poochega (clarify + follow-ups)' },
      { list: q.ask },
      { h: 'Hints ladder (sirf 3–4 min atakne pe, ek-ek karke)' },
      { olist: q.hints },
      { h: 'Rubric (har row 0–2 marks)' },
      { table: { head: ['Area', 'Kya dekhna hai', 'Marks (0–2)'], rows: q.rubric } },
      { h: 'Reference code (mock ke BAAD hi kholo)' },
      { code: q.code },
      { tip: 'Memory hook: <b>' + q.hook + '</b>' },
    ] };
  }

  const PLAN_TABLE = { table: { head: ['Time', 'Kya', 'Rule'], rows: [
    ['5 min', 'Problem padho + clarify', 'Input, output, constraints, edge cases bolke'],
    ['5 min', 'Brute → Optimal bolo', 'Complexity ke saath — abhi code nahi'],
    ['15–25 min', 'Code (bina dekhe)', 'Easy 15 · Medium 25 · Hard 40'],
    ['5 min', 'Dry run + edge cases', 'Example + 1 edge case haath se'],
    ['Baaki', 'Stretch target', 'Sohvi: 2 Easy + 1 Medium · Tum: 3 Medium + 1 Hard (course list se)'],
  ] } };

  Object.assign(P.lessons, {
    // ======================= DAY 8 =======================
    8: {
      title: 'Re-solve — Trees (DFS)',
      goal: 'Tree recursion ka revision: LC 104 (max depth — seedha recursion) aur LC 543 (diameter — height return, global best update). Focus: <b>function kya return karta hai vs answer kahan update hota hai</b>.',
      main: 104,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules)',
          blocks: [
            PLAN_TABLE,
            { list: [
              'Week 1 mistake log 2 min padho.',
              'Har tree recursion se pehle 3 lines bolo: base case kya, function kya return karta hai, current node pe kya combine.',
              'Course target (time ho toh): Sohvi → 2 Easy + 1 Medium, Tum → 3 Medium + 1 Hard.',
            ] },
            { tip: 'Memory hook: <b>Recursion pe bharosa: bachche sahi answer laayenge, tum sirf jodo.</b>' },
          ],
        },
        recap('Part 1 — Re-solve (MUST): LC 104 Maximum Depth of Binary Tree', {
          problem: 'Binary tree ka root diya hai. Root se sabse door leaf tak kitne nodes hain (max depth) batao.',
          example: 'root = [3,9,20,null,null,15,7]\n\n      3\n     / \\\n    9   20\n       /  \\\n      15   7\n\ndepth = 3',
          pattern: 'Tree DFS (post-order)',
          timer: 'Easy · 15 min',
          steps: [
            'Base: null → 0.',
            'Left depth aur right depth recursion se lo.',
            'Answer = 1 + max(left, right).',
            'BFS alternative: levels gino. Dono O(n).',
          ],
          code: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
          edge: [
            ['<code>[]</code>', '0'],
            ['Sirf root', '1'],
            ['Skewed (linked list jaisa)', 'n — recursion depth n (stack space O(n))'],
          ],
          hook: 'Khaali = 0, warna 1 + bade bachche ki depth.',
        }),
        recap('Part 2 — Re-solve (PUSH): LC 543 Diameter of Binary Tree', {
          problem: 'Tree me kisi bhi do nodes ke beech sabse lambe path ki length (edges me) batao. Path root se guzarna zaroori nahi.',
          example: 'root = [1,2,3,4,5]\n\n        1\n       / \\\n      2   3\n     / \\\n    4   5\n\npath 4 → 2 → 1 → 3 (ya 5 → 2 → 1 → 3) = 3 edges',
          pattern: 'Tree DFS — height return + global best',
          timer: 'Medium · 25 min',
          steps: [
            'Brute: har node pe left height + right height alag se nikaalo → O(n²).',
            'Ek hi DFS: function <b>height</b> return kare.',
            'Har node pe <code>best = max(best, l + r)</code> — path is node se mud sakta hai.',
            'Return <code>1 + max(l, r)</code> (parent ko sirf ek side milti hai). O(n).',
          ],
          code: `private int best = 0;

public int diameterOfBinaryTree(TreeNode root) {
    height(root);
    return best;
}

private int height(TreeNode node) {
    if (node == null) return 0;
    int l = height(node.left), r = height(node.right);
    best = Math.max(best, l + r);
    return 1 + Math.max(l, r);
}`,
          edge: [
            ['Sirf root', '0'],
            ['Longest path root se nahi guzarta', 'Global best isi ke liye — har node pe update'],
            ['<code>[1,2]</code>', '1'],
          ],
          hook: 'Upar height bhejo, beech me l + r se diameter pakdo.',
        }),
        {
          title: 'Part 3 — Pattern family: Tree DFS',
          blocks: [
            { table: { head: ['Question', 'Return kya', 'Combine'], rows: [
              ['LC 104 Max Depth', 'depth', '1 + max(l, r)'],
              ['LC 100 Same Tree', 'boolean', 'val same &amp;&amp; same(l) &amp;&amp; same(r)'],
              ['LC 226 Invert', 'node', 'left, right swap karke recurse'],
              ['LC 101 Symmetric', 'boolean', 'mirror(a.left, b.right) &amp;&amp; mirror(a.right, b.left)'],
              ['LC 543 Diameter', 'height', 'best = max(best, l + r)'],
              ['LC 236 LCA', 'node / null', 'dono side non-null → current node'],
            ] } },
            { tip: '"Return value" aur "answer" alag ho sakte hain (diameter). Ye pehchaanna hi SDE-2 level signal hai.' },
          ],
        },
        {
          title: 'Part 4 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['Recursive DFS ka space?', 'O(h) — balanced me O(log n), skewed me O(n).'],
              ['LC 104 iterative kaise?', 'BFS queue + level count, ya stack me (node, depth) pairs.'],
              ['LC 543 me diameter edges me hai ya nodes me?', 'Edges me — isliye l + r (nodes count hota toh l + r + 1).'],
              ['Global variable ke bina LC 543?', 'int[] best = {0} helper ko pass karo, ya helper se pair return karo.'],
              ['Depth vs height?', 'Depth = root se node tak; height = node se neeche sabse door leaf tak.'],
              ['Very deep tree pe recursion risk?', 'StackOverflowError — iterative (explicit stack) version lo.'],
            ] },
          ],
        },
        {
          title: 'Part 5 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 104 — approach', 'The depth of a tree is one plus the larger depth of its two subtrees, and an empty tree has depth zero. I implement that directly with recursion. Every node is visited once, so time is O(n), and the recursion stack is O(h), the height of the tree. A BFS that counts levels works equally well.'],
              ['LC 543 — approach', 'The longest path through any node is the height of its left subtree plus the height of its right subtree. I write one DFS that returns height, and at each node I update a global best with left plus right. The function returns one plus the larger side to its parent, because a path going up can only use one branch. This is O(n) time and O(h) space instead of O(n²).'],
              ['Follow-up: "Return the path, not just the length?"', 'I would also return, from each call, the deepest leaf path on the taller side, and when updating best at a node I would record the node and both side paths. Then I stitch left path reversed, the node, and the right path together.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Sohvi session',
          blocks: [
            { olist: [
              'LC 104 bina dekhe likho. Example tree draw karke har node pe return value likho.',
              'LC 543: <code>[1,2,3,4,5]</code> pe har node ka (l, r, best) paper pe likho.',
              'Bolo: "height return karta hai, diameter best me hai" — kyun.',
              '<b>Course target (time ho toh):</b> 2 Easy + 1 Medium → LC 100, LC 101 (Easy) + LC 78 (Medium).',
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 543 memory se 10 min, phir global variable ke bina version.',
              '<b>Task B:</b> LC 236 LCA bina dekhe — 3 cases bolke (dono left, dono right, split).',
              '<b>Task C:</b> LC 104 iterative BFS version 8 min me.',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 236, LC 199, LC 230 + LC 295 (Hard).',
              'SDE-2 switch prep (parallel): 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Homework',
          blocks: [
            { list: [
              'LC 104 + LC 543 dobara submit.',
              'Tree DFS family table (Part 3) zubaani.',
              'Kal (Day 9): Trees BFS + BST — LC 102 aur LC 98.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[3,9,20,null,null,15,7]</code> ki depth?', '3'],
              ['<code>[1,2,3,4,5]</code> ka diameter?', '3'],
              ['LC 543 me helper kya return karta hai?', 'Height (1 + max(l, r)).'],
              ['Recursion ka space kis pe depend karta hai?', 'Tree ki height h pe — O(h).'],
              ['LCA me dono side se non-null aaye toh?', 'Current node hi LCA hai.'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 104 bina dekhe Accepted',
        'LC 543 likha (Sohel: must · Sohvi: paper pe l, r, best table)',
        'Return value vs global answer ka fark samjha sakta/sakti hu',
        'Recursion ka O(h) space explain kar sakta/sakti hu',
        'Tree DFS family table zubaani',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Tree DFS: base null, bachchon se lo, jodo, upar bhejo. Diameter = l + r, return = 1 + max.',
    },

    // ======================= DAY 9 =======================
    9: {
      title: 'Re-solve — Trees (BFS + BST)',
      goal: 'LC 102 (level order — queue + level size) aur LC 98 (validate BST — range (lo, hi) pass karna). Focus: <b>BFS ka level snapshot</b> aur <b>BST me sirf parent se compare karna kyun galat hai</b>.',
      main: 102,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules)',
          blocks: [
            PLAN_TABLE,
            { list: [
              'BFS = queue. Level chahiye toh loop shuru hone pe <code>size</code> snapshot lo.',
              'Course target (time ho toh): Sohvi → 2 Easy + 1 Medium, Tum → 3 Medium + 1 Hard.',
            ] },
            { tip: 'Memory hook: <b>BFS = line me khade log, ek level ek baar me.</b>' },
          ],
        },
        recap('Part 1 — Re-solve (MUST): LC 102 Binary Tree Level Order Traversal', {
          problem: 'Binary tree ke nodes ki values level by level (left se right) list of lists me return karo.',
          example: 'root = [3,9,20,null,null,15,7]\n\nqueue: [3]        → level [3]\nqueue: [9, 20]    → level [9, 20]\nqueue: [15, 7]    → level [15, 7]\n\nans = [[3], [9, 20], [15, 7]]',
          pattern: 'Tree BFS (queue + level size)',
          timer: 'Medium · 25 min',
          steps: [
            'Root null → khaali list.',
            'Queue me root daalo.',
            'Har round: <code>size = q.size()</code>, utne nodes poll karo, unke bachche offer karo.',
            'Har round ki list result me add. O(n) time, O(width) space.',
          ],
          code: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = q.poll();
            level.add(node.val);
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
        res.add(level);
    }
    return res;
}`,
          edge: [
            ['<code>[]</code>', '<code>[]</code>'],
            ['Sirf root', '<code>[[root]]</code>'],
            ['<code>size</code> loop me <code>q.size()</code> likha', 'Galat — queue badhti rehti hai, levels mix'],
          ],
          hook: 'Size pehle pakdo, utne nikalo, bachche peeche lagao.',
        }),
        recap('Part 2 — Re-solve (PUSH): LC 98 Validate Binary Search Tree', {
          problem: 'Batao ki binary tree valid BST hai: har node ke left subtree ki saari values usse chhoti aur right subtree ki saari badi (strictly).',
          example: 'root = [2,1,3]             → true\nroot = [5,1,4,null,null,3,6] → false (4 < 5 right side me)\n\nTrap: [5,4,6,null,null,3,7] → false\n3 apne parent 6 se chhota hai (theek), par 5 ke right subtree me hai → galat',
          pattern: 'Tree DFS with range (lo, hi)',
          timer: 'Medium · 25 min',
          steps: [
            'Galat idea: sirf parent se compare — door ke ancestor ka rule toot sakta hai.',
            'Har node ka allowed range (lo, hi) neeche pass karo.',
            'Left me jao → hi = node.val; right me → lo = node.val.',
            '<code>long</code> bounds — node.val Integer.MIN/MAX ho sakta hai. Alternative: inorder strictly increasing.',
          ],
          code: `public boolean isValidBST(TreeNode root) {
    return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean valid(TreeNode node, long lo, long hi) {
    if (node == null) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return valid(node.left, lo, node.val) && valid(node.right, node.val, hi);
}`,
          edge: [
            ['<code>[2147483647]</code>', 'true — isliye int ki jagah long bounds'],
            ['Duplicate value <code>[2,2,2]</code>', 'false — strictly less/greater'],
            ['Sirf root', 'true'],
          ],
          hook: 'Har node ko uski range ke saath bhejo — parent se nahi, poore raaste se.',
        }),
        {
          title: 'Part 3 — Pattern family: BFS + BST',
          blocks: [
            { table: { head: ['Question', 'Tool', 'Key idea'], rows: [
              ['LC 102 Level Order', 'BFS queue', 'size snapshot per level'],
              ['LC 199 Right Side View', 'BFS queue', 'har level ka last node'],
              ['LC 230 Kth Smallest in BST', 'Inorder (stack)', 'inorder = sorted, kth pop'],
              ['LC 98 Validate BST', 'DFS + range', '(lo, hi) long bounds'],
              ['LC 104 Max Depth (BFS)', 'BFS queue', 'levels count'],
            ] } },
            { tip: 'BST + "sorted / kth / validate" → inorder socho. Level / "view" → BFS socho.' },
          ],
        },
        {
          title: 'Part 4 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['BFS ka space O(width) kyun?', 'Queue me ek time pe max ek-do levels ke nodes — complete tree me last level ~n/2.'],
              ['LC 199 DFS se kaise?', 'Root → right → left order me DFS; jis depth pe pehli baar pahuche, woh node answer.'],
              ['LC 98 inorder approach?', 'Inorder traversal me prev value track karo; current ≤ prev → false.'],
              ['LC 98 me <code>Long.MIN_VALUE</code> ki jagah null bounds?', '<code>Integer lo, hi</code> null = no bound — long ke bina bhi chalta hai.'],
              ['LC 230 ka time?', 'O(h + k) iterative inorder — k elements pe ruk jao.'],
              ['Zigzag level order kaise?', 'LC 102 same, bas har doosre level ki list reverse (ya addFirst).'],
            ] },
          ],
        },
        {
          title: 'Part 5 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 102 — approach', 'I do a breadth-first search with a queue. At the start of each round I record the queue size, which is exactly the number of nodes on the current level. I poll that many nodes, add their values to a level list, and offer their children. After the round I append the level to the result. Each node is enqueued once, so it is O(n) time and O(width) space.'],
              ['LC 98 — approach', 'Comparing a node only with its parent is not enough, because every node must respect all its ancestors. So I pass down a valid range: the root can be anything, going left tightens the upper bound to the node’s value, and going right tightens the lower bound. If a node falls outside its range the tree is invalid. I use long bounds so values at the int limits work. O(n) time, O(h) space.'],
              ['Follow-up: "BFS vs DFS — which here and why?"', 'Level order is naturally BFS because the output is grouped by levels. Validating a BST is naturally DFS because each node needs constraints from its ancestors, which recursion passes down for free. Both are linear; the choice is about which one makes the logic simplest.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Sohvi session',
          blocks: [
            { olist: [
              'LC 102 bina dekhe likho. Example pe har round ke baad queue ka state paper pe likho.',
              'LC 98: <code>[5,4,6,null,null,3,7]</code> draw karo aur bolo kyun invalid hai.',
              'BST ka inorder sorted hota hai — <code>[2,1,3]</code> pe check karo.',
              '<b>Course target (time ho toh):</b> 2 Easy + 1 Medium → LC 226, LC 104 (Easy) + LC 841 (Medium).',
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 98 dono versions (range + inorder) 15 min me.',
              '<b>Task B:</b> LC 199 BFS aur DFS dono versions.',
              '<b>Task C:</b> LC 230 iterative inorder (stack) bina dekhe + follow-up "BST frequently modified ho toh?" (subtree size augment).',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 199, LC 230, LC 236 + LC 84 (Hard).',
              'SDE-2 switch prep (parallel): 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Homework',
          blocks: [
            { list: [
              'LC 102 + LC 98 dobara submit.',
              'Kal (Day 10): Heap — LC 1046 aur LC 347.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[1,2,3,4,null,null,5]</code> ka level order?', '<code>[[1],[2,3],[4,5]]</code>'],
              ['<code>[5,1,4,null,null,3,6]</code> valid BST?', 'Nahi.'],
              ['LC 98 me long kyun?', 'Node value Integer.MAX/MIN ho toh int bounds se galat false aata.'],
              ['Level ka size kab lete hain?', 'Har round ke shuru me, loop se pehle.'],
              ['BST ka inorder kaisa hota hai?', 'Strictly increasing (sorted).'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 102 bina dekhe Accepted',
        'LC 98 range version likha (Sohel: inorder bhi)',
        'Sirf parent compare kyun galat — example se dikha sakta/sakti hu',
        'BFS vs DFS kab, bol sakta/sakti hu',
        'BFS + BST family table zubaani',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'BFS: size pehle pakdo. BST: har node ko (lo, hi) range ke saath bhejo.',
    },

    // ======================= DAY 10 =======================
    10: {
      title: 'Re-solve — Heap / Top K',
      goal: 'LC 1046 (max heap simulation) aur LC 347 (frequency map + size-k min heap). Focus: <b>min heap vs max heap kab</b>, aur <b>O(n log k)</b> kyun sort se better hai.',
      main: 1046,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules)',
          blocks: [
            PLAN_TABLE,
            { list: [
              'Java: <code>new PriorityQueue&lt;&gt;()</code> = min heap. Max heap = <code>Collections.reverseOrder()</code>.',
              'Course target (time ho toh): Sohvi → 2 Easy + 1 Medium, Tum → 3 Medium + 1 Hard.',
            ] },
            { tip: 'Memory hook: <b>Top K largest = chhota heap (size k) jo sabse chhote ko bahar phenke.</b>' },
          ],
        },
        recap('Part 1 — Re-solve (MUST): LC 1046 Last Stone Weight', {
          problem: 'Stones ke weights diye hain. Har baar do sabse bhaari stones takrao: barabar ho toh dono khatam, warna fark wala stone wapas. Akhri bacha stone ka weight (ya 0).',
          example: 'stones = [2,7,4,1,8,1]\n8 vs 7 → 1   → [2,4,1,1,1]\n4 vs 2 → 2   → [2,1,1,1]\n2 vs 1 → 1   → [1,1,1]\n1 vs 1 → 0   → [1]\nanswer = 1',
          pattern: 'Max heap simulation',
          timer: 'Easy · 15 min',
          steps: [
            'Brute: har round sort → O(n² log n).',
            'Max heap me sab daalo.',
            'Do poll (y ≥ x), fark ho toh wapas offer.',
            'Heap khaali → 0, warna peek. O(n log n).',
          ],
          code: `public int lastStoneWeight(int[] stones) {
    PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
    for (int s : stones) pq.offer(s);
    while (pq.size() > 1) {
        int y = pq.poll(), x = pq.poll();
        if (y != x) pq.offer(y - x);
    }
    return pq.isEmpty() ? 0 : pq.peek();
}`,
          edge: [
            ['<code>[1]</code>', '1'],
            ['<code>[2, 2]</code>', '0 — heap khaali'],
            ['Sab same', 'Even count → 0, odd → wahi value'],
          ],
          hook: 'Do sabse bhaari nikalo, fark wapas daalo.',
        }),
        recap('Part 2 — Re-solve (PUSH): LC 347 Top K Frequent Elements', {
          problem: 'Array aur k diya hai. Sabse zyada baar aane wale k elements return karo (koi bhi order).',
          example: 'nums = [1,1,1,2,2,3], k = 2\nfreq = {1=3, 2=2, 3=1}\nmin-heap (size 2) by freq: [1, 2] → 3 aaya toh sabse kam freq (3) bahar\nanswer = [1, 2]',
          pattern: 'HashMap frequency + size-k min heap',
          timer: 'Medium · 25 min',
          steps: [
            'Frequency map banao.',
            'Brute: entries ko freq se sort → O(n log n).',
            'Min heap (freq ke hisaab se), size k se zyada ho toh poll → O(n log k).',
            'Best: bucket sort (index = freq) → O(n).',
          ],
          code: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
    PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> Integer.compare(freq.get(a), freq.get(b)));
    for (int key : freq.keySet()) {
        pq.offer(key);
        if (pq.size() > k) pq.poll();
    }
    int[] ans = new int[k];
    for (int i = k - 1; i >= 0; i--) ans[i] = pq.poll();
    return ans;
}`,
          edge: [
            ['<code>[1], k = 1</code>', '<code>[1]</code>'],
            ['k = distinct count', 'Saare distinct elements'],
            ['Negative numbers', 'Map me koi fark nahi'],
          ],
          hook: 'Gino, phir size-k chhota heap — kam freq wala bahar.',
        }),
        {
          title: 'Part 3 — Pattern family: Heap',
          blocks: [
            { table: { head: ['Question', 'Heap type', 'Size', 'Key idea'], rows: [
              ['LC 703 Kth Largest in Stream', 'Min heap', 'k', 'top = kth largest'],
              ['LC 1046 Last Stone Weight', 'Max heap', 'n', 'simulation'],
              ['LC 215 Kth Largest in Array', 'Min heap', 'k', 'O(n log k); quickselect O(n) avg'],
              ['LC 347 Top K Frequent', 'Min heap (by freq)', 'k', 'map + heap / bucket'],
              ['LC 973 K Closest Points', 'Max heap (by dist)', 'k', 'door wala bahar'],
              ['LC 295 Median from Stream', 'Max + Min heap', 'n/2 each', 'balance sizes'],
            ] } },
            { tip: 'Ulta yaad rakho: <b>k largest → min heap</b>, <b>k smallest/closest → max heap</b>. Heap ka top woh hai jise sabse pehle phenkna hai.' },
          ],
        },
        {
          title: 'Part 4 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['PriorityQueue offer / poll / peek ki complexity?', 'O(log n) / O(log n) / O(1).'],
              ['Array se heap banana (heapify) kitna?', 'O(n) — <code>new PriorityQueue&lt;&gt;(list)</code>.'],
              ['Comparator me <code>a − b</code> kyun risky?', 'Bade/negative values pe overflow. <code>Integer.compare(a, b)</code> lo.'],
              ['LC 347 bucket sort kaise?', '<code>List[] bucket = new List[n + 1]</code>, bucket[freq] me element; end se k collect. O(n).'],
              ['LC 215 quickselect ka worst case?', 'O(n²) — random pivot se average O(n).'],
              ['LC 295 me add aur median ki complexity?', 'add O(log n), findMedian O(1).'],
            ] },
          ],
        },
        {
          title: 'Part 5 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 1046 — approach', 'I need the two heaviest stones repeatedly, which is exactly what a max-heap provides. I push all stones, then while at least two remain I poll the two largest and, if they differ, push back the difference. Each round is O(log n) and there are at most n rounds, so O(n log n) time and O(n) space.'],
              ['LC 347 — approach', 'First I count frequencies with a HashMap in O(n). Then I keep a min-heap of size k ordered by frequency: I push each distinct number and pop whenever the heap exceeds k, so the least frequent is discarded. At the end the heap holds the k most frequent. That is O(n log k). If needed, bucket sort by frequency brings it to O(n).'],
              ['Follow-up: "Data is a stream and k is fixed?"', 'Then I keep the frequency map updated per element and maintain the size-k heap of candidates. For an exact answer with updates, a heap with lazy deletion or a TreeMap keyed by frequency works; for huge streams I would mention approximate counting like Count-Min Sketch.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Sohvi session',
          blocks: [
            { olist: [
              'LC 1046 bina dekhe likho. Example ka har round paper pe likho (Part 1 jaisa).',
              'LC 347: frequency map haath se banao, phir sort karke top 2 nikaalo (brute) — heap optional.',
              'Min heap vs max heap ka ek-line rule apne shabdon me bolo.',
              '<b>Course target (time ho toh):</b> 2 Easy + 1 Medium → LC 703, LC 217 (Easy) + LC 198 (Medium).',
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 347 heap + bucket dono versions, 20 min.',
              '<b>Task B:</b> LC 295 MedianFinder class bina dekhe (balance rule: left size ≥ right size, diff ≤ 1).',
              '<b>Task C:</b> LC 215 quickselect ka partition bolke explain.',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 215, LC 973, LC 347 + LC 295 (Hard).',
              'SDE-2 switch prep (parallel): 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Homework',
          blocks: [
            { list: [
              'LC 1046 + LC 347 dobara submit.',
              'Kal (Day 11): Graphs — LC 200 aur LC 207.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[2,7,4,1,8,1]</code> last stone?', '1'],
              ['Top k largest ke liye kaunsa heap?', 'Size-k min heap.'],
              ['LC 347 heap approach ka time?', 'O(n log k).'],
              ['Java me max heap kaise?', '<code>new PriorityQueue&lt;&gt;(Collections.reverseOrder())</code>'],
              ['Median of stream ka structure?', 'Left max-heap + right min-heap, sizes balanced.'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 1046 bina dekhe Accepted',
        'LC 347 likha (Sohel: heap + bucket · Sohvi: map + sort)',
        'Min vs max heap rule bol sakta/sakti hu',
        'O(n log k) vs O(n log n) explain kar sakta/sakti hu',
        'Heap family table zubaani',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Top k largest = size-k min heap. Sabse bhaari chahiye baar baar = max heap.',
    },

    // ======================= DAY 11 =======================
    11: {
      title: 'Re-solve — Graphs',
      goal: 'LC 200 (grid DFS — island sink karna) aur LC 207 (topological sort — Kahn ka algorithm se cycle detection). Focus: <b>visited kab mark</b> aur <b>directed graph me cycle</b>.',
      main: 200,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules)',
          blocks: [
            PLAN_TABLE,
            { list: [
              'Graph problem me pehle bolo: nodes kya hain, edges kya hain, directed ya undirected.',
              'Course target (time ho toh): Sohvi → 2 Easy + 1 Medium, Tum → 3 Medium + 1 Hard.',
            ] },
            { tip: 'Memory hook: <b>Graph = nodes + edges. Visited ke bina graph = infinite loop.</b>' },
          ],
        },
        recap('Part 1 — Re-solve (MUST): LC 200 Number of Islands', {
          problem: '<code>\'1\'</code> (land) aur <code>\'0\'</code> (water) ka grid diya hai. 4-directionally jude land cells ek island hain. Islands gino.',
          example: 'grid =\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1\n\nislands = 3 (top-left block, beech wala 1, bottom-right pair)',
          pattern: 'Grid DFS (flood fill / sink)',
          timer: 'Medium · 25 min',
          steps: [
            'Har cell scan karo. <code>\'1\'</code> mila → count++ aur poora island DFS se <code>\'0\'</code> kar do (sink).',
            'DFS: bounds bahar ya water → return. Warna mark, 4 directions recurse.',
            'Same grid me mark = visited array ki zaroorat nahi (input modify allowed ho toh).',
            'O(m·n) time, O(m·n) worst recursion.',
          ],
          code: `public int numIslands(char[][] grid) {
    int count = 0;
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == '1') {
                count++;
                sink(grid, r, c);
            }
        }
    }
    return count;
}

private void sink(char[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;
    g[r][c] = '0';
    sink(g, r + 1, c);
    sink(g, r - 1, c);
    sink(g, r, c + 1);
    sink(g, r, c - 1);
}`,
          edge: [
            ['Sab water', '0'],
            ['Sab land', '1'],
            ['Diagonal cells', 'Alag islands — sirf 4 directions'],
          ],
          hook: 'Zameen mili → gino, aur poora island dubo do.',
        }),
        recap('Part 2 — Re-solve (PUSH): LC 207 Course Schedule', {
          problem: '<code>numCourses</code> courses aur prerequisites <code>[a, b]</code> (a ke liye pehle b) diye hain. Kya saare courses finish ho sakte hain? (= directed graph me cycle nahi)',
          example: 'numCourses = 2, prerequisites = [[1,0]]        → true  (0 → 1)\nnumCourses = 2, prerequisites = [[1,0],[0,1]]  → false (0 ⇄ 1 cycle)\n\nKahn: indegree 0 wale queue me → poll → neighbours ka indegree−−\nprocessed == numCourses ? true : false',
          pattern: 'Topological sort (Kahn BFS)',
          timer: 'Medium · 25 min',
          steps: [
            'Graph banao: edge b → a, indegree[a]++.',
            'Indegree 0 wale sab queue me.',
            'Poll → done++ → har neighbour ka indegree ghatao, 0 ho toh queue me.',
            '<code>done == numCourses</code> → no cycle. O(V + E).',
          ],
          code: `public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    int[] indeg = new int[numCourses];
    for (int[] p : prerequisites) {
        adj.get(p[1]).add(p[0]);
        indeg[p[0]]++;
    }
    Queue<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.offer(i);
    int done = 0;
    while (!q.isEmpty()) {
        int u = q.poll();
        done++;
        for (int v : adj.get(u)) {
            if (--indeg[v] == 0) q.offer(v);
        }
    }
    return done == numCourses;
}`,
          edge: [
            ['Koi prerequisite nahi', 'true'],
            ['Self-loop <code>[[0,0]]</code>', 'false'],
            ['Disconnected courses', 'Kahn sab components handle karta hai'],
          ],
          hook: 'Jinki koi dependency nahi, woh pehle. Koi bacha → cycle.',
        }),
        {
          title: 'Part 3 — Pattern family: Graphs',
          blocks: [
            { table: { head: ['Question', 'Graph', 'Tool', 'Key idea'], rows: [
              ['LC 733 Flood Fill', 'Grid', 'DFS', 'same color cells recolor (new == old pe return)'],
              ['LC 841 Keys and Rooms', 'Adjacency list', 'DFS/BFS', 'visited count == n'],
              ['LC 200 Number of Islands', 'Grid', 'DFS sink', 'har naya \'1\' = naya island'],
              ['LC 994 Rotting Oranges', 'Grid', 'Multi-source BFS', 'saare rotten ek saath queue me, minutes = levels'],
              ['LC 207 Course Schedule', 'Directed', 'Kahn / DFS colors', 'processed &lt; n → cycle'],
              ['LC 210 Course Schedule II', 'Directed', 'Kahn', 'poll order = answer'],
              ['LC 417 Pacific Atlantic', 'Grid', 'Reverse DFS from borders', 'dono oceans se reachable cells'],
            ] } },
            { tip: 'BFS shortest steps deta hai (unweighted). "Minimum minutes / steps" → BFS. "Count / reach" → DFS ya BFS dono.' },
          ],
        },
        {
          title: 'Part 4 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['LC 200 BFS se kaise?', 'Queue me cell daalo aur <b>daalte waqt</b> hi mark karo, warna same cell kai baar queue me.'],
              ['Input modify allowed na ho toh?', '<code>boolean[][] visited</code> rakho.'],
              ['LC 207 DFS cycle detection?', 'State: 0 = unvisited, 1 = visiting, 2 = done. Visiting node dobara mila → cycle.'],
              ['Topological order unique hota hai?', 'Nahi, jab ek time pe queue me multiple nodes ho.'],
              ['LC 994 me fresh orange bach gaya toh?', '−1 return.'],
              ['Union-Find se islands?', 'Har land cell node, neighbours union; components = islands. O(m·n·α).'],
            ] },
          ],
        },
        {
          title: 'Part 5 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 200 — approach', 'I scan every cell. When I find land that has not been visited, that is a new island, so I increment the count and run a DFS that marks the whole connected region as water, so it is never counted again. Each cell is visited a constant number of times, giving O(m·n) time; the recursion can be O(m·n) deep in the worst case, so for huge grids I would use an iterative BFS.'],
              ['LC 207 — approach', 'Courses are nodes and each prerequisite is a directed edge. All courses can be finished exactly when this graph has no cycle. I use Kahn’s algorithm: compute indegrees, start with all courses that have no prerequisites, and repeatedly take one, decrementing its neighbours’ indegrees. If I process every course, there is no cycle; otherwise the leftovers form a cycle. O(V + E) time and space.'],
              ['Follow-up: "Return an actual order (LC 210)?"', 'The same Kahn’s loop already produces one: I append each polled node to the result. If the result has fewer than numCourses nodes, there is a cycle and I return an empty array.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Sohvi session',
          blocks: [
            { olist: [
              'LC 200 bina dekhe likho. Example grid paper pe draw karke islands ko alag colors se ghero.',
              'LC 207: <code>[[1,0],[0,1]]</code> ka graph draw karo aur bolo kyun impossible hai.',
              'LC 733 Flood Fill re-solve — LC 200 ka DFS hi hai.',
              '<b>Course target (time ho toh):</b> 2 Easy + 1 Medium → LC 733, LC 1046 (Easy) + LC 841 (Medium).',
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 207 Kahn + DFS colors dono, 20 min.',
              '<b>Task B:</b> LC 994 multi-source BFS bina dekhe 15 min.',
              '<b>Task C:</b> LC 417 reverse-thinking (oceans se andar) 1 minute me explain.',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 994, LC 210, LC 417 + LC 41 (Hard, mixed revision).',
              'SDE-2 switch prep (parallel): 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Homework',
          blocks: [
            { list: [
              'LC 200 + LC 207 dobara submit.',
              'Kal (Day 12): Backtracking — LC 78 aur LC 39.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Example grid me kitne islands?', '3'],
              ['<code>numCourses = 2, [[1,0],[0,1]]</code> → ?', 'false'],
              ['Kahn me cycle kaise pata chalta hai?', 'Processed count &lt; numCourses.'],
              ['BFS me visited kab mark?', 'Queue me daalte waqt.'],
              ['"Minimum minutes" grid me kaunsa traversal?', 'Multi-source BFS (LC 994).'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 200 bina dekhe Accepted',
        'LC 207 Kahn likha (Sohel: DFS colors bhi)',
        'Directed cycle detection explain kar sakta/sakti hu',
        'Visited kab mark karna, bata sakta/sakti hu',
        'Graph family table zubaani',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Islands: mila → gino → dubo do. Course schedule: indegree 0 se shuru, koi bacha → cycle.',
    },

    // ======================= DAY 12 =======================
    12: {
      title: 'Re-solve — Backtracking',
      goal: 'LC 78 (subsets — har element pe start index) aur LC 39 (combination sum — reuse allowed, prune). Focus: <b>choose → explore → unchoose</b>, aur <b>i + 1 vs i</b> ka fark.',
      main: 78,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules)',
          blocks: [
            PLAN_TABLE,
            { list: [
              'Code se pehle recursion tree ke pehle 2 levels paper pe draw karo.',
              'Course target (time ho toh): Sohvi → 2 Easy + 1 Medium, Tum → 3 Medium + 1 Hard.',
            ] },
            { tip: 'Memory hook: <b>Daalo, aage jao, wapas nikalo.</b>' },
          ],
        },
        recap('Part 1 — Re-solve (MUST): LC 78 Subsets', {
          problem: 'Unique integers ka array diya hai. Uske saare possible subsets (power set) return karo, koi duplicate subset nahi.',
          example: 'nums = [1, 2, 3]\n\nbt(0, [])\n├─ [1] → [1,2] → [1,2,3]\n│      → [1,3]\n├─ [2] → [2,3]\n└─ [3]\n\nans = [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]  (2³ = 8)',
          pattern: 'Backtracking (start index)',
          timer: 'Medium · 25 min',
          steps: [
            'Har call pe current list ka <b>copy</b> result me daalo.',
            'i = start se n − 1 tak: nums[i] add, <code>bt(i + 1)</code>, remove.',
            'start index se same subset alag order me nahi banta.',
            'O(n · 2ⁿ) time (2ⁿ subsets, copy O(n)).',
          ],
          code: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), res);
    return res;
}

private void backtrack(int[] nums, int start, List<Integer> cur, List<List<Integer>> res) {
    res.add(new ArrayList<>(cur));
    for (int i = start; i < nums.length; i++) {
        cur.add(nums[i]);
        backtrack(nums, i + 1, cur, res);
        cur.remove(cur.size() - 1);
    }
}`,
          edge: [
            ['<code>[0]</code>', '<code>[[],[0]]</code>'],
            ['<code>res.add(cur)</code> (copy nahi)', 'Sab entries same list → end me sab khaali'],
            ['Duplicates in input', 'LC 90: sort + <code>if (i &gt; start &amp;&amp; nums[i] == nums[i-1]) continue;</code>'],
          ],
          hook: 'Har node ek subset. Copy daalo, aage i + 1 se.',
        }),
        recap('Part 2 — Re-solve (PUSH): LC 39 Combination Sum', {
          problem: 'Distinct candidates aur target diya hai. Saare unique combinations do jinka sum target ho — ek number kitni bhi baar use ho sakta hai.',
          example: 'candidates = [2, 3, 6, 7], target = 7\n\n[2,2,3] → 7 ✓\n[7]     → 7 ✓\n[2,2,2,2] → 8 ✗ (prune)\n\nans = [[2,2,3],[7]]',
          pattern: 'Backtracking (reuse allowed + prune)',
          timer: 'Medium · 25 min',
          steps: [
            'remain = 0 → copy result me.',
            'i = start se: candidate &gt; remain → skip (prune).',
            'add, <code>dfs(i, remain − c[i])</code> — <b>i</b> (same element dobara allowed), remove.',
            'start index se [2,3,2] jaisa duplicate order nahi banta.',
          ],
          code: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> res = new ArrayList<>();
    dfs(candidates, 0, target, new ArrayList<>(), res);
    return res;
}

private void dfs(int[] c, int start, int remain, List<Integer> cur, List<List<Integer>> res) {
    if (remain == 0) {
        res.add(new ArrayList<>(cur));
        return;
    }
    for (int i = start; i < c.length; i++) {
        if (c[i] > remain) continue;
        cur.add(c[i]);
        dfs(c, i, remain - c[i], cur, res);
        cur.remove(cur.size() - 1);
    }
}`,
          edge: [
            ['<code>[2], target 1</code>', '<code>[]</code>'],
            ['Sorted input', '<code>continue</code> ki jagah <code>break</code> — aage sab bade'],
            ['LC 40 (har number ek baar, duplicates)', 'sort + i + 1 + same-level skip'],
          ],
          hook: 'Reuse allowed → i pe hi ruko; ek baar → i + 1.',
        }),
        {
          title: 'Part 3 — Pattern family: Backtracking',
          blocks: [
            { table: { head: ['Question', 'Next call', 'Duplicate control', 'Base / record'], rows: [
              ['LC 78 Subsets', 'i + 1', 'start index', 'har call pe record'],
              ['LC 90 Subsets II', 'i + 1', 'sort + same-level skip', 'har call pe record'],
              ['LC 46 Permutations', 'used[] / swap', 'used[] boolean', 'size == n'],
              ['LC 39 Combination Sum', 'i (reuse)', 'start index', 'remain == 0'],
              ['LC 40 Combination Sum II', 'i + 1', 'sort + same-level skip', 'remain == 0'],
              ['LC 131 Palindrome Partitioning', 'end + 1', '—', 'start == n'],
              ['LC 79 Word Search', '4 directions', 'cell mark / unmark', 'idx == word.length'],
            ] } },
            { tip: 'Subsets/combinations = start index. Permutations = used[] (order matter karta hai).' },
          ],
        },
        {
          title: 'Part 4 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['Subsets ki count n elements pe?', '2ⁿ.'],
              ['Permutations ki count?', 'n! — time O(n · n!).'],
              ['Backtracking me "unchoose" na kiya toh?', 'cur me purane elements reh jaate hain — galat combinations.'],
              ['LC 78 iterative (bit / cascading) kaise?', 'Result = [[]]; har num ke liye existing subsets copy karke num add karo.'],
              ['LC 39 ka worst-case time kis pe depend karta hai?', 'Recursion tree ki depth ~ target / min(candidate) — exponential.'],
              ['Pruning ka fayda?', 'Bekaar branches jaldi kat jaati hain; sorted input pe <code>break</code> aur bhi tez.'],
            ] },
          ],
        },
        {
          title: 'Part 5 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 78 — approach', 'Every node of the recursion tree is a valid subset, so at each call I add a copy of the current list to the result. Then for each index from start onward, I add that element, recurse with the next index, and remove it again. Using a start index means each subset is produced exactly once, in one order. There are 2ⁿ subsets and copying each costs up to n, so O(n · 2ⁿ) time.'],
              ['LC 39 — approach', 'I backtrack with the remaining target. If it reaches zero I record a copy of the current combination. Otherwise I try each candidate from the start index; I skip any candidate larger than the remainder, add it, and recurse with the same index because reuse is allowed, then remove it. The start index prevents permutations of the same combination. Sorting first lets me break early instead of skipping.'],
              ['Follow-up: "Only count the combinations, not list them?"', 'Then I do not need backtracking at all — it becomes the unbounded knapsack count, the Coin Change II DP: dp[0] = 1 and for each coin, dp[a] += dp[a − coin]. That is O(n · target) instead of exponential.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Sohvi session',
          blocks: [
            { olist: [
              'LC 78 bina dekhe likho. <code>[1,2,3]</code> ka recursion tree paper pe poora draw karo.',
              'LC 39: <code>[2,3,6,7], 7</code> ka tree sirf 2 levels tak draw karo, prune wali branch cross karo.',
              'LC 46 Permutations re-solve (used[] wala).',
              '<b>Course target (time ho toh):</b> 2 Easy + 1 Medium → LC 70, LC 746 (Easy) + LC 46 (Medium).',
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 39 + LC 40 back-to-back, fark bolte hue — 25 min.',
              '<b>Task B:</b> LC 79 Word Search bina dekhe, cell mark/unmark ke saath.',
              '<b>Task C:</b> LC 131 palindrome partitioning ka skeleton + complexity bolo.',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 40, LC 90, LC 79 + LC 76 (Hard, mixed revision).',
              'SDE-2 switch prep (parallel): 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Homework',
          blocks: [
            { list: [
              'LC 78 + LC 39 dobara submit.',
              'Kal (Day 13, Saturday): DP revision — LC 70, 198, 322, 139. Week 2 mistake log ready rakho.',
              'Sohel: Saturday ka System Design topic choose karo.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[1,2,3]</code> ke kitne subsets?', '8'],
              ['LC 39 me recursion <code>i</code> se kyun, <code>i + 1</code> se kyun nahi?', 'Same number dobara use allowed hai.'],
              ['<code>res.add(new ArrayList&lt;&gt;(cur))</code> me copy kyun?', 'cur baad me badlega; copy ke bina sab entries same object.'],
              ['Duplicates wale input me same-level skip ki condition?', '<code>i &gt; start &amp;&amp; nums[i] == nums[i − 1]</code> (sorted).'],
              ['Permutations me start index kyun nahi?', 'Order matter karta hai — har position pe saare unused elements try karne hain (used[]).'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 78 bina dekhe Accepted',
        'LC 39 likha (Sohel: must · Sohvi: tree draw)',
        'i vs i + 1 ka fark bol sakta/sakti hu',
        'Copy kyun zaroori, explain kar sakta/sakti hu',
        'Backtracking family table zubaani',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Daalo, aage jao, nikalo. Reuse → i, ek baar → i + 1, result me hamesha copy.',
    },

    // ======================= DAY 13 (SAT) =======================
    13: {
      title: 'Revision — Dynamic Programming (Week 2 wrap-up)',
      goal: 'Saturday revision: DP ke 4 questions — LC 70 (Fibonacci-style), LC 198 (take / skip), LC 322 (unbounded min), LC 139 (string DP). Har ek me <b>state → transition → base → order</b> bolna. Saath me Week 2 mistake log aur System Design session.',
      main: 70,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules)',
          blocks: [
            { table: { head: ['Slot', 'Kya', 'Kaun'], rows: [
              ['10 min', 'Week 2 mistake log + Week 1 ke bache weak spots', 'Dono'],
              ['15 min', 'LC 70 (Easy)', 'Dono'],
              ['20 min', 'LC 198 (Medium)', 'Dono'],
              ['25 min', 'LC 322 (Medium)', 'Dono (Sohvi: dp table haath se)'],
              ['25 min', 'LC 139 (Medium)', 'Sohel must · Sohvi optional'],
              ['Alag se', 'System Design session (1/week)', 'Sohel'],
            ] } },
            { list: [
              'Har DP pe pehle 4 lines likho: <b>state</b> (dp[i] = …), <b>transition</b>, <b>base</b>, <b>answer kahan</b>.',
              'Course target (time ho toh): Sohvi → 2 Easy + 1 Medium, Tum → 3 Medium + 1 Hard.',
            ] },
            { tip: 'Memory hook: <b>DP = recursion + yaaddasht. Pehle state ka matlab shabdon me.</b>' },
          ],
        },
        recap('Part 1 — LC 70 Climbing Stairs', {
          problem: 'n seedhiyan hain, ek baar me 1 ya 2 step. Top tak pahunchne ke kitne distinct tarike?',
          example: 'n = 2 → 2  (1+1, 2)\nn = 3 → 3  (1+1+1, 1+2, 2+1)\nn = 5 → 8\n\nways(n) = ways(n−1) + ways(n−2)',
          pattern: '1D DP (Fibonacci)',
          timer: 'Easy · 15 min',
          steps: [
            'State: ways(i) = i tak pahunchne ke tarike.',
            'Transition: last step 1 tha ya 2 → ways(i−1) + ways(i−2).',
            'Base: ways(0) = 1, ways(1) = 1.',
            'Sirf last 2 chahiye → 2 variables, O(1) space.',
          ],
          code: `public int climbStairs(int n) {
    int a = 1, b = 1;
    for (int i = 2; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}`,
          hook: 'Aakhri kadam 1 tha ya 2 — dono jodo.',
        }),
        recap('Part 2 — LC 198 House Robber', {
          problem: 'Ghar line me hain, har ghar me paisa. Do adjacent ghar ek saath nahi loot sakte. Maximum kitna loot sakte ho?',
          example: 'nums = [2, 7, 9, 3, 1]\nprev2 prev1 → cur\n0     0     → 2\n0     2     → 7\n2     7     → 11 (2 + 9)\n7     11    → 11\n11    11    → 12 (11 + 1)\nanswer = 12',
          pattern: '1D DP (take / skip)',
          timer: 'Medium · 20 min',
          steps: [
            'State: dp[i] = pehle i gharon se max.',
            'Transition: skip → dp[i−1], take → dp[i−2] + nums[i].',
            'Base: 0 ghar → 0.',
            '2 variables (prev2, prev1). O(n) / O(1).',
          ],
          code: `public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int x : nums) {
        int cur = Math.max(prev1, prev2 + x);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
          hook: 'Lootu ya chhodu: max(pichla, pichle-se-pichla + ye).',
        }),
        recap('Part 3 — LC 322 Coin Change', {
          problem: 'Coins ke denominations aur amount diya hai (har coin unlimited). Minimum kitne coins se amount banega? Na bane toh −1.',
          example: 'coins = [1, 2, 5], amount = 11 → 3 (5 + 5 + 1)\ncoins = [2], amount = 3 → -1\ncoins = [1], amount = 0 → 0\n\ndp[a] = min over coins c ≤ a of dp[a − c] + 1',
          pattern: 'Unbounded knapsack (min)',
          timer: 'Medium · 25 min',
          steps: [
            'Greedy galat ho sakta hai (e.g. [1,3,4], 6 → greedy 4+1+1 = 3, best 3+3 = 2).',
            'State: dp[a] = amount a ke liye min coins.',
            'Base dp[0] = 0, baaki "infinity" (amount + 1).',
            'Answer dp[amount] &gt; amount → −1. O(amount · coins).',
          ],
          code: `public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        for (int c : coins) {
            if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
          hook: 'Har amount: koi ek coin aakhri tha — sabse sasta chuno.',
        }),
        recap('Part 4 — LC 139 Word Break', {
          problem: 'String s aur words ki dictionary di hai. Kya s ko dictionary ke words (repeat allowed) me tod sakte hain?',
          example: 's = "leetcode", dict = ["leet","code"]        → true\ns = "applepenapple", dict = ["apple","pen"] → true\ns = "catsandog", dict = ["cats","dog","sand","and","cat"] → false\n\ndp[i] = true agar kisi j < i ke liye dp[j] && s[j..i) dict me',
          pattern: '1D DP on string prefix',
          timer: 'Medium · 25 min',
          steps: [
            'Brute recursion: har prefix try → exponential (same suffix baar baar).',
            'State: dp[i] = s ke pehle i chars tod sakte hain?',
            'Base dp[0] = true (khaali string).',
            'dp[i] = koi j jahan dp[j] true aur <code>s.substring(j, i)</code> dict me. O(n² · L).',
          ],
          code: `public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<>(wordDict);
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true;
    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && dict.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[s.length()];
}`,
          hook: 'Kahin tak tootta hai + baaki word dict me → yahan tak bhi tootta hai.',
        }),
        {
          title: 'Part 5 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['Memoization vs tabulation?', 'Memo = top-down recursion + cache (sirf zaroori states). Tab = bottom-up loop (no recursion stack).'],
              ['LC 322 me <code>Integer.MAX_VALUE</code> se fill kyun nahi?', '<code>dp[a − c] + 1</code> overflow ho jaata. amount + 1 safe "infinity" hai.'],
              ['LC 518 (Coin Change II) me loop order kyun matter karta hai?', 'Coins bahar, amount andar → combinations (order ignore). Ulta kiya toh permutations count hongi.'],
              ['LC 300 LIS ka O(n log n)?', 'tails array + binary search (lower bound) — patience sorting.'],
              ['LC 1143 LCS ka state?', 'dp[i][j] = text1[0..i) aur text2[0..j) ka LCS. Match → diagonal + 1, warna max(up, left).'],
              ['DP ka signal?', 'Count / min / max / possible? + choices + overlapping subproblems.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 322 — approach', 'Greedy fails for some coin systems, so I use DP. dp[a] is the minimum coins to make amount a. dp[0] is zero and everything else starts at amount plus one as infinity. For each amount I try every coin as the last coin and take the minimum of dp[a − coin] plus one. If dp[amount] is still above amount it is unreachable and I return −1. O(amount × coins) time, O(amount) space.'],
              ['LC 198 — approach', 'At each house I either skip it, keeping the best up to the previous house, or rob it, adding its money to the best up to two houses back. So best(i) = max(best(i−1), best(i−2) + nums[i]). Since only the last two values matter, I keep two variables, giving O(n) time and O(1) space.'],
              ['LC 139 — approach', 'dp[i] says whether the first i characters can be segmented. The empty prefix is true. For each i I look for a split point j where dp[j] is true and the substring from j to i is in the dictionary, stored in a HashSet. dp[n] is the answer. This avoids recomputing the same suffix many times, giving roughly O(n²) substring checks.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: [
              'LC 70 aur LC 198 bina dekhe Accepted.',
              'LC 322: <code>[1,2,5], 11</code> ka dp table (0..11) haath se bharo.',
              'Har DP ke 4 lines (state, transition, base, answer) notebook me likho.',
              '<b>Course target (time ho toh):</b> 2 Easy + 1 Medium → LC 746, LC 704 (Easy) + LC 53 (Medium).',
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice) + System Design session',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 322 + LC 139 memory se, 30 min total.',
              '<b>Task B:</b> LC 518 aur LC 322 ka loop-order fark likh ke dikhao.',
              '<b>Task C:</b> LC 300 O(n log n) version bina dekhe.',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 300, LC 1143, LC 518 + LC 410 (Hard).',
              '<b>System Design session (1/week):</b> mock-style 45 min — requirements → high-level design → data model → bottlenecks → trade-offs. Kal final mock hai, toh apni "design framework" ek page pe likh lo.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: [
              'Aaj ke 4 me jo bina dekhe nahi nikla, kal subah dobara.',
              'Kal (Day 14, Sunday): Final Mock — Tum interviews Sohvi (LC 226), Sohvi interviews Tum (LC 1143). Solutions mat dekhna.',
              'Apna total LeetCode count aur pattern-wise weak list ready rakho (course review ke liye).',
            ] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['n = 5 stairs → ?', '8'],
              ['<code>[2,7,9,3,1]</code> rob → ?', '12'],
              ['<code>coins = [2], amount = 3</code> → ?', '−1'],
              ['Word Break ka dp[0] kya aur kyun?', 'true — khaali prefix hamesha tootta hai.'],
              ['DP ke 4 steps?', 'State, transition, base case, order / answer.'],
            ] },
          ],
        },
      ],
      checks: [
        'Min 3 DP questions bina dekhe Accepted',
        'Har question ka state shabdon me bol sakta/sakti hu',
        'LC 322 dp table haath se bhara',
        'Memo vs tabulation fark bol sakta/sakti hu',
        'Week 2 mistake log revise kiya',
        'Sohel: System Design session kiya',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'DP: state shabdon me → aakhri choice kya thi → chhote states se jodo → base case.',
    },

    // ======================= DAY 14 (SUN) =======================
    14: {
      title: 'Final Mock + Course Completion Review',
      goal: 'Course ka aakhri din (Day 168). Final full mock: Tum interviews Sohvi on <b>LC 226 Invert Binary Tree</b>, Sohvi interviews Tum on <b>LC 1143 Longest Common Subsequence</b>. Phir Weekly Contest discussion aur <b>poore course ka review</b> — targets kahan tak pahunche, aage kya.',
      main: 226,
      parts: [
        {
          title: 'Part 0 — Mock format (30 + 30 + 30 min)',
          blocks: [
            { table: { head: ['Slot', 'Interviewer', 'Candidate', 'Question'], rows: [
              ['0–30 min', 'Tum (Sohel)', 'Sohvi', 'LC 226 (Easy) + follow-ups'],
              ['30–60 min', 'Sohvi', 'Tum (Sohel)', 'LC 1143 (Medium, 2D DP)'],
              ['60–90 min', 'Dono', 'Dono', 'Contest discussion + Course completion review'],
            ] } },
            { list: [
              'Real interview jaisa: camera on, notes band, 25 min ke baad interviewer "wrap up" bole.',
              'Mock #1 (Day 7) ka rubric saath rakho — compare karo kitna improve hua.',
            ] },
            { tip: 'Memory hook: <b>Aakhri mock = progress ka sabse honest mirror.</b>' },
          ],
        },
        mockQ('Part 1 — Mock Q1 (Tum → Sohvi): LC 226 Invert Binary Tree', {
          problem: 'Binary tree ka root diya hai. Har node ke left aur right bachche swap karke poora tree mirror karo aur root return karo.',
          example: 'root = [4,2,7,1,3,6,9]\n\n      4              4\n    /   \\          /   \\\n   2     7   →    7     2\n  / \\   / \\      / \\   / \\\n 1   3 6   9    9   6 3   1\n\noutput = [4,7,2,9,6,3,1]',
          ask: [
            'Clarify: khaali tree? (null return)',
            'Recursive ya iterative? Dono ka space kya? (O(h) recursion · O(width) BFS)',
            'Follow-up 1: BFS queue se kaise karogi?',
            'Follow-up 2: Invert ke baad original tree chahiye ho toh? (naya tree banao, in-place nahi)',
            'Follow-up 3: Symmetric Tree (LC 101) se kya rishta hai?',
          ],
          hints: [
            'Ek node pe kya karna hai? Bas uske do bachche swap.',
            'Baaki tree? Wahi kaam left aur right subtree pe — recursion.',
            'Base case: null → null.',
            'Swap karte waqt ek temp variable chahiye.',
          ],
          rubric: [
            ['Clarify', 'Empty tree pucha', ''],
            ['Brute', 'Seedha recursion idea bola (yahan brute = optimal)', ''],
            ['Optimal', 'Recursive + iterative dono ka idea', ''],
            ['Code', 'Temp se swap, base case sahi', ''],
            ['Test', 'Example + single node + null', ''],
            ['Communication', 'O(n) time, O(h) space khud bola', ''],
          ],
          code: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode t = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(t);
    return root;
}`,
          hook: 'Har node pe left-right swap, baaki recursion karega.',
        }),
        mockQ('Part 2 — Mock Q2 (Sohvi → Tum): LC 1143 Longest Common Subsequence', {
          problem: 'Do strings di hain. Unki longest common subsequence (order same, continuous zaroori nahi) ki length batao.',
          example: 'text1 = "abcde", text2 = "ace" → 3 ("ace")\ntext1 = "abc",   text2 = "abc" → 3\ntext1 = "abc",   text2 = "def" → 0\n\n      ""  a  c  e\n  ""   0  0  0  0\n  a    0  1  1  1\n  b    0  1  1  1\n  c    0  1  2  2\n  d    0  1  2  2\n  e    0  1  2  3',
          ask: [
            'Clarify: subsequence vs substring fark? Lengths kitni? (≤ 1000 → O(m·n) theek)',
            'Brute bolo: saare subsequences → O(2ᵐ).',
            'Follow-up 1: State aur transition shabdon me.',
            'Follow-up 2: Space O(min(m, n)) kaise? (2 rows / 1 row + diagonal variable)',
            'Follow-up 3: Actual LCS string kaise nikaaloge? (table se backtrack)',
          ],
          hints: [
            'Dono strings ke aakhri characters dekho — same hain ya alag?',
            'Same → dono hata ke baaki ka LCS + 1.',
            'Alag → ek-ek hata ke dekho, max lo.',
            'dp[i][j] = pehle i aur pehle j chars ka LCS; size (m + 1) × (n + 1).',
          ],
          rubric: [
            ['Clarify', 'Subsequence definition + constraints confirm', ''],
            ['Brute', 'Exponential recursion + overlapping subproblems pehchane', ''],
            ['Optimal', 'dp[i][j] state + transition clear', ''],
            ['Code', 'i − 1 / j − 1 indexing sahi, (m+1)×(n+1)', ''],
            ['Test', 'Example table ka ek hissa bharke dikhaya + empty match case', ''],
            ['Communication', 'Space optimisation follow-up confidently', ''],
          ],
          code: `public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`,
          hook: 'Aakhri char same → diagonal + 1, warna upar/baaye ka max.',
        }),
        {
          title: 'Part 3 — Interview communication checklist (final)',
          blocks: [
            { table: { head: ['Check', 'Mock #1 (Day 7)', 'Final mock (aaj)'], rows: [
              ['Restate + clarify kiya', '', ''],
              ['Brute + complexity bola', '', ''],
              ['Optimal ka "kyun" bola', '', ''],
              ['Code likhte hue bola (no long silence)', '', ''],
              ['Khud se dry run + edge case', '', ''],
              ['Complexity bina pooche', '', ''],
              ['Hint ko apne shabdon me repeat kiya', '', ''],
            ] } },
            { tip: 'Dono columns me ✓ / ✗ bharo. Jo ab bhi ✗ hai, woh next 2 weeks ka focus.' },
          ],
        },
        {
          title: 'Part 4 — LeetCode Weekly Contest plan + discussion template',
          blocks: [
            { list: [
              'Sunday 8:00 AM IST. Sohvi: Q1 + Q2 target (exposure). Tum: Q1–Q3 under 60 min (speed), Q4 attempt.',
              'Course khatam hone ke baad bhi har Sunday contest jaari rakhna hai.',
            ] },
            { table: { head: ['Question', 'Pattern', 'Time', 'Course ka similar question', 'Aaj kya seekha'], rows: [
              ['Q1', '', '', '', ''],
              ['Q2', '', '', '', ''],
              ['Q3', '', '', '', ''],
              ['Q4', '', '', '', ''],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Course Completion Review (24 weeks)',
          blocks: [
            { p: '24 weeks, 12 phases, 168 din. Ab honestly dekho ki goals kahan tak pahunche:' },
            { table: { head: ['', 'Sohvi — target', 'Tum (Sohel) — target', 'Actual (bharo)'], rows: [
              ['LeetCode count', '150–180 LC', '250–300 quality LC', ''],
              ['Coverage', 'Strong fundamentals, har pattern ka Easy khud se', 'Blind 75 + NeetCode 150 mostly covered', ''],
              ['Level', 'Placement ready', 'SDE-2 interview ready', ''],
              ['Contest', 'Exposure — regular participation', 'Speed — Q1–Q3 consistently', ''],
              ['Extra', '—', '1 System Design / week, 2 SQL / day', ''],
            ] } },
            { h: 'Pattern-wise self rating (1–5)' },
            { table: { head: ['Phase', 'Pattern', 'Sohvi', 'Tum'], rows: [
              ['1–3', 'Arrays, Hashing, Two Pointers, Sliding Window', '', ''],
              ['4–5', 'Linked List, Stack / Queue', '', ''],
              ['6', 'Binary Search', '', ''],
              ['7–8', 'Trees, Heap', '', ''],
              ['9–10', 'Backtracking, Graphs', '', ''],
              ['11', 'Dynamic Programming', '', ''],
            ] } },
            { list: [
              '3 se kam rating wale pattern → agle 2 weeks roz us phase ka 1 course question re-solve.',
              'Sohvi: placement drives me apply karna shuru — har test ke baad pattern log.',
              'Sohel: applications + referrals shuru; har real interview ke baad mistake log update.',
              'Weekly mock + Sunday contest course ke baad bhi jaari.',
            ] },
            { tip: 'Important Rule yaad rakho: <b>Same journey hai, lekin same speed nahi.</b> Sohvi ki progress apne pace pe judge karo, Sohel ke pace pe nahi.' },
          ],
        },
        {
          title: 'Part 6 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['LC 226 iterative kaise?', 'Queue me root; har poll pe left-right swap, non-null bachche offer.'],
              ['LC 1143 space optimise kaise?', 'Sirf previous row chahiye → 2 rows (ya 1 row + prev diagonal variable): O(min(m, n)).'],
              ['Subsequence vs substring DP fark?', 'Substring (longest common substring) me mismatch pe 0, aur answer poori table ka max.'],
              ['LCS se actual string kaise?', 'dp[m][n] se peeche: match → char lo aur diagonal; warna bade neighbour ki taraf.'],
              ['Interview me 5 min bache aur code incomplete?', 'Bacha logic pseudo-code me bolo, complexity batao, aur test cases batao — partial credit milta hai.'],
              ['Ek line me apni DSA prep summarise karo (English)?', '"I covered twelve core patterns through around a hundred curated problems, re-solved them under time limits, and practised weekly mock interviews and contests."'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 226 — approach', 'Inverting a tree means swapping the left and right child of every node. Recursively, I return null for an empty tree; otherwise I swap the children, inverting each subtree on the way. Every node is visited once, so O(n) time, and the recursion uses O(h) stack space. An iterative BFS that swaps children as it dequeues nodes works the same way.'],
              ['LC 1143 — approach', 'Brute force over all subsequences is exponential, but the subproblems overlap, so I use DP. dp[i][j] is the LCS length of the first i characters of text1 and the first j of text2. If the last characters match, it is dp[i−1][j−1] plus one; otherwise it is the max of dropping one character from either string. The table is (m+1) by (n+1) with a zero border, giving O(m·n) time; since each row depends only on the previous one, space can be reduced to O(min(m, n)).'],
              ['"Tell me about how you prepared for this interview"', 'Over six months I followed a structured plan: twelve phases covering arrays and hashing through graphs and dynamic programming, solving a curated list of problems per pattern from brute force to optimal. Every week I revised old problems without notes, did a mock interview and the LeetCode weekly contest. I also kept a mistake log, which is why I now clarify constraints, state complexity and test edge cases by default.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohvi session',
          blocks: [
            { olist: [
              'LC 226 mock ke baad recursive + iterative dono bina hint.',
              'LC 1143 ka table <code>"abcde"</code> vs <code>"ace"</code> haath se bharo (Part 2 jaisa).',
              'Course Review table me apna actual LC count aur pattern ratings bharo.',
              'Agle 2 weeks ka plan: kamzor 2 patterns + roz course target (2 Easy + 1 Medium).',
            ] },
          ],
        },
        {
          title: 'Part 9 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Mock rubric me jo bhi row 2 se kam, us skill pe 3 din ka plan.',
              '<b>Task B:</b> LC 1143 space-optimised version 10 min me + LCS string reconstruction.',
              '<b>Task C:</b> "Tell me about your preparation" + 2 project stories English me record karo.',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 300, LC 518, LC 236 + LC 295 (Hard).',
              'Blind 75 + NeetCode 150 checklist me course ke questions tick karo — bache hue list karo.',
            ] },
          ],
        },
        {
          title: 'Part 10 — Homework (course ke baad)',
          blocks: [
            { list: [
              'Last Minute tab ki saari triggers zubaani — interview se ek din pehle yahi padhna hai.',
              'Har week: 1 mock (roles badal ke) + Sunday contest — jaari rakhna.',
              'Mistake log ko "Interview day cheat sheet" (1 page) me convert karo.',
              'Sohvi: 150–180 LC tak pahunchne ka weekly count plan. Sohel: 250–300 LC + System Design + SQL routine.',
            ] },
          ],
        },
        {
          title: 'Part 11 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>"abcde"</code> vs <code>"ace"</code> LCS?', '3'],
              ['<code>[2,1,3]</code> invert ke baad?', '<code>[2,3,1]</code>'],
              ['LCS ka transition?', 'Match → dp[i−1][j−1] + 1, warna max(dp[i−1][j], dp[i][j−1]).'],
              ['Interview ke 8 communication steps?', 'Restate, clarify, example, brute, optimal, code, test, complexity.'],
              ['Course ke final targets?', 'Sohvi 150–180 LC, placement ready · Tum 250–300 LC, Blind 75 + NeetCode 150 mostly covered, SDE-2 ready.'],
            ] },
          ],
        },
      ],
      checks: [
        'Final mock as candidate diya (notes band)',
        'Final mock as interviewer rubric bhara + feedback diya',
        'LC 226 / LC 1143 mock ke baad bina dekhe Accepted',
        'Mock #1 vs final mock compare kiya',
        'Course Completion Review table bhari (LC count + pattern ratings)',
        'Weekly Contest me participate kiya',
        'Agle 2 weeks ka plan likha',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Course khatam, practice nahi: weekly mock + Sunday contest + mistake log. Same journey, apni speed.',
    },
  });
})();
