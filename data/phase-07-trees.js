window.PHASE_CONTENT = window.PHASE_CONTENT || {};

window.PHASE_CONTENT['trees'] = {
  intro: 'Tree = recursion ka ghar. Har tree problem ek hi sawaal hai: "root pe kya karu, aur left/right subtree se kya chahiye?" Pehle structure aur traversals samjho, fir DFS (recursion), BFS (queue) aur BST ki property.',

  // ---------------- FUNDAMENTALS ----------------
  fundamentals: [
    {
      h: 'Binary Tree kya hai?',
      body: `<p>Tree ek <b>hierarchical</b> data structure hai: upar ek <b>root</b>, har node ke neeche <b>children</b>. <b>Binary tree</b> me har node ke <b>max 2 children</b> hote hain — <code>left</code> aur <code>right</code>.</p>
<p>Array/LinkedList <b>linear</b> hain (ek line). Tree <b>branching</b> hai — isliye ek node se do raaste, aur problems naturally <b>recursive</b> ban jaati hain: har subtree khud ek chhota tree hai.</p>
<table class="tbl"><thead><tr><th>Term</th><th>Matlab</th><th>Example tree me</th></tr></thead><tbody>
<tr><td>Root</td><td>Sabse upar wala node (parent nahi)</td><td>1</td></tr>
<tr><td>Leaf</td><td>Jiske koi children nahi</td><td>4, 5, 6</td></tr>
<tr><td>Depth (node ki)</td><td>Root se us node tak kitne edges</td><td>depth(5) = 2</td></tr>
<tr><td>Height / Max depth (tree ki)</td><td>Root se sabse door leaf tak nodes (LeetCode 104 nodes ginta hai)</td><td>3</td></tr>
<tr><td>Subtree</td><td>Koi node + uske saare descendants</td><td>2 ka subtree = {2, 4, 5}</td></tr>
<tr><td>Level</td><td>Same depth wale saare nodes</td><td>level 1 = {2, 3}</td></tr>
</tbody></table>`,
    },
    {
      h: 'TreeNode — memory me kaise rehta hai',
      body: `<p>LeetCode ka <code>TreeNode</code> = ek object jisme value aur do references. Har node heap me alag object hai; <code>left</code>/<code>right</code> me doosre object ka address (ya <code>null</code>).</p>
<pre class="ex-pre diagram">class TreeNode { int val; TreeNode left; TreeNode right; }

               root
                │
            ┌───▼───┐
            │ val 1 │
            │ L   R │
            └─┬───┬─┘
       ┌──────┘   └──────┐
   ┌───▼───┐         ┌───▼───┐
   │ val 2 │         │ val 3 │
   │ L   R │         │ L   R─┼──┐
   └─┬───┬─┘         └─┬─────┘  │
     ▼   ▼            null  ┌───▼───┐
     4   5                  │ val 6 │
                            └───────┘

LeetCode input (level order, null = khaali jagah): [1,2,3,4,5,null,6]</pre>
<p><b>Level-order array</b> padhna seekho: pehla element root, fir har node ke liye (left, right) pair — <code>null</code> matlab us jagah koi child nahi. Visualizer me input isi format me dete hain.</p>`,
    },
    {
      h: 'Traversal orders (yaad karne ka tarika)',
      body: `<p>"Pre / In / Post" batata hai <b>root ko kab visit</b> karte hain — left se pehle, beech me, ya baad me. Left hamesha right se pehle.</p>
<pre class="ex-pre diagram">        1
       / \\
      2   3
     / \\   \\
    4   5   6</pre>
<table class="tbl"><thead><tr><th>Order</th><th>Rule</th><th>Output</th><th>Kab use</th></tr></thead><tbody>
<tr><td><b>Preorder</b></td><td>Root → Left → Right</td><td>1 2 4 5 3 6</td><td>Copy/serialize tree, upar se info neeche bhejna (top-down)</td></tr>
<tr><td><b>Inorder</b></td><td>Left → Root → Right</td><td>4 2 5 1 3 6</td><td><b>BST me sorted order</b> (LC 230, LC 98)</td></tr>
<tr><td><b>Postorder</b></td><td>Left → Right → Root</td><td>4 5 2 6 3 1</td><td>Children ka answer pehle chahiye (height, diameter, LCA — bottom-up)</td></tr>
<tr><td><b>Level order</b></td><td>Level by level, left → right (BFS)</td><td>[1] [2,3] [4,5,6]</td><td>Levels, right view, shortest depth (LC 102, LC 199)</td></tr>
</tbody></table>
<p class="tip">Pre/In/Post = <b>DFS</b> (recursion ya stack). Level order = <b>BFS</b> (queue). Dono O(n) — har node ek baar.</p>`,
      code: `void preorder(TreeNode node) {
    if (node == null) return;
    visit(node);              // Root
    preorder(node.left);      // Left
    preorder(node.right);     // Right
}
void inorder(TreeNode node) {
    if (node == null) return;
    inorder(node.left);
    visit(node);              // beech me
    inorder(node.right);
}
void postorder(TreeNode node) {
    if (node == null) return;
    postorder(node.left);
    postorder(node.right);
    visit(node);              // last me
}`,
    },
    {
      h: 'Recursion on trees — 3 sawaal ka template',
      body: `<p>Har tree recursion me khud se 3 sawaal pucho:</p>
<ol>
<li><b>Base case:</b> <code>node == null</code> pe kya return karu? (depth → 0, same tree → true, LCA → null)</li>
<li><b>Subproblem:</b> left aur right subtree se kya chahiye? (unki height, unka boolean, unka found node)</li>
<li><b>Combine:</b> dono answers + current node se apna answer kaise banau?</li>
</ol>
<p><b>Top-down</b> = upar se info neeche bhejo (parameters: depth, low/high range). <b>Bottom-up</b> = neeche se answer upar lao (return values: height).</p>
<p><b>Call stack:</b> recursion ki depth = tree ki height h. Balanced tree → O(log n) stack, skewed (linked-list jaisa) tree → O(n) stack. Isliye space complexity me <b>O(h)</b> likhte hain.</p>
<pre class="ex-pre diagram">maxDepth(1)              ← CALL STACK (upar = abhi chal raha)
  └ maxDepth(2)
      └ maxDepth(4)
          └ maxDepth(null) → 0   base case
      4 → 1 + max(0,0) = 1  ↩
  2 → 1 + max(1,1) = 2      ↩
1 → 1 + max(2,2) = 3        ↩</pre>`,
    },
    {
      h: 'BST (Binary Search Tree) property',
      body: `<p><b>BST:</b> har node ke liye — <b>poore left subtree</b> ki saari values &lt; node.val &lt; <b>poore right subtree</b> ki saari values. Sirf direct child se compare karna kaafi nahi!</p>
<pre class="ex-pre diagram">        5               5
       / \\             / \\
      3   8           4   6
     / \\   \\             / \\
    2   4   9           3   7     ← 3 &lt; 5 par right subtree me hai → NOT a BST
   valid BST            (6 ka left child 3 &lt; 6 sahi lagta hai, par 5 se bhi bada hona chahiye)</pre>
<ul>
<li><b>Inorder traversal of BST = sorted increasing</b> → kth smallest = inorder ka kth element.</li>
<li>Search/insert BST me: chhota → left, bada → right. Time <b>O(h)</b> (balanced → O(log n), skewed → O(n)).</li>
<li>Validate karne ke liye har node ko ek <b>range (low, high)</b> do — parent se milta hai.</li>
</ul>`,
    },
    {
      h: 'Java Cheat Sheet (Trees)',
      code: `// LeetCode ka TreeNode (khud define nahi karna)
// public class TreeNode { int val; TreeNode left, right; ... }

// BFS ke liye Queue
Queue<TreeNode> q = new LinkedList<>();   // LinkedList null allow karta hai
q.offer(root);  TreeNode x = q.poll();  q.isEmpty();  q.size();

// Iterative DFS ke liye Stack
Deque<TreeNode> st = new ArrayDeque<>(); // ArrayDeque null ALLOW NAHI karta
st.push(node);  st.pop();  st.peek();

// Result lists
List<List<Integer>> res = new ArrayList<>();
List<Integer> level = new ArrayList<>();
res.add(level);  res.get(depth).add(val);

// BST range check me overflow se bachne ke liye long
long low = Long.MIN_VALUE, high = Long.MAX_VALUE;

// Reference compare: node == p  (value nahi, same object)
Map<TreeNode, TreeNode> parent = new HashMap<>();`,
    },
    {
      h: 'Yaad rakhne wali baatein',
      body: `<ul>
<li>n nodes ke tree me <b>n − 1 edges</b>. Har traversal O(n).</li>
<li>Space: recursion = <b>O(h)</b>; BFS queue = <b>O(w)</b> (sabse chaudi level, worst ~n/2).</li>
<li>BFS me <code>int size = q.size()</code> loop se <b>pehle</b> lo — warna naye children bhi isi level me gin jaayenge.</li>
<li><code>node.left == null</code> check karke hi <code>node.left.val</code> padho — NullPointerException sabse common bug.</li>
<li>"Diameter" edges ginta hai, "max depth" nodes ginta hai — definition pehle clarify karo.</li>
<li>LCA me <code>root == p</code> = <b>reference</b> compare (same node object).</li>
</ul>`,
    },
  ],

  // ---------------- OPERATIONS ----------------
  operations: [
    { op: 'Preorder / Inorder / Postorder', time: 'O(n)', note: 'Har node ek baar; stack O(h)', code: 'void dfs(TreeNode n) {\n    if (n == null) return;\n    // pre: yahan\n    dfs(n.left);\n    // in: yahan\n    dfs(n.right);\n    // post: yahan\n}' },
    { op: 'Level order (BFS)', time: 'O(n)', note: 'Queue; size = level ka size', code: 'Queue<TreeNode> q = new LinkedList<>();\nq.offer(root);\nwhile (!q.isEmpty()) {\n    int size = q.size();\n    for (int i = 0; i < size; i++) {\n        TreeNode x = q.poll();\n        if (x.left != null) q.offer(x.left);\n        if (x.right != null) q.offer(x.right);\n    }\n}' },
    { op: 'Height / Max depth', time: 'O(n)', note: 'Postorder: 1 + max(left, right)', code: 'int height(TreeNode n) {\n    if (n == null) return 0;\n    return 1 + Math.max(height(n.left), height(n.right));\n}' },
    { op: 'Count nodes', time: 'O(n)', note: '1 + left + right', code: 'int count(TreeNode n) {\n    if (n == null) return 0;\n    return 1 + count(n.left) + count(n.right);\n}' },
    { op: 'Search in BST', time: 'O(h)', note: 'Chhota → left, bada → right', code: 'while (root != null && root.val != target)\n    root = target < root.val ? root.left : root.right;\nreturn root;' },
    { op: 'Insert in BST', time: 'O(h)', note: 'Sahi null jagah dhundo', code: 'TreeNode insert(TreeNode n, int v) {\n    if (n == null) return new TreeNode(v);\n    if (v < n.val) n.left = insert(n.left, v);\n    else n.right = insert(n.right, v);\n    return n;\n}' },
    { op: 'Min / Max in BST', time: 'O(h)', note: 'Sabse left = min, sabse right = max', code: 'while (root.left != null) root = root.left;\nreturn root.val;' },
    { op: 'Iterative inorder', time: 'O(n)', note: 'Left me jao, pop, right pe jao', code: 'Deque<TreeNode> st = new ArrayDeque<>();\nTreeNode cur = root;\nwhile (cur != null || !st.isEmpty()) {\n    while (cur != null) { st.push(cur); cur = cur.left; }\n    cur = st.pop();\n    // visit cur\n    cur = cur.right;\n}' },
  ],

  // ---------------- PATTERNS ----------------
  patterns: [
    {
      name: 'Bottom-up DFS (return info upward)',
      signal: '"Height", "depth", "diameter", "balanced", "LCA" — node ka answer children ke answer pe depend',
      idea: 'Postorder: pehle left aur right ka answer lo, fir combine. Global answer (jaise diameter) ek field me update karo, aur parent ko height return karo.',
      code: `int dfs(TreeNode node) {
    if (node == null) return 0;          // base
    int l = dfs(node.left);              // left ka answer
    int r = dfs(node.right);             // right ka answer
    best = Math.max(best, l + r);        // global update (optional)
    return 1 + Math.max(l, r);           // parent ko height
}`,
      qs: [104, 543, 236],
    },
    {
      name: 'Two-tree / Mirror recursion',
      signal: '"Same tree", "symmetric", "mirror", do trees ek saath compare',
      idea: 'Recursion me do nodes saath chalao. Dono null → true, ek null → false, value alag → false, warna children pairs recurse. Mirror me pairs cross hote hain (a.left, b.right).',
      code: `boolean same(TreeNode a, TreeNode b) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    if (a.val != b.val) return false;
    return same(a.left, b.left) && same(a.right, b.right);
}`,
      qs: [100, 101, 226],
    },
    {
      name: 'BFS level by level',
      signal: '"Level order", "har level", "right side view", "minimum depth", "zigzag"',
      idea: 'Queue me root. Har round me size = q.size() → itne nodes poll karo = ek poora level. Unke children queue me = agla level.',
      code: `Queue<TreeNode> q = new LinkedList<>();
q.offer(root);
while (!q.isEmpty()) {
    int size = q.size();             // ek level
    for (int i = 0; i < size; i++) {
        TreeNode x = q.poll();
        // i == size - 1 → level ka last (right view)
        if (x.left != null) q.offer(x.left);
        if (x.right != null) q.offer(x.right);
    }
}`,
      qs: [102, 199, 104],
    },
    {
      name: 'Top-down DFS (pass info downward)',
      signal: '"Depth pe depend", "range/bounds", "path from root" — parent se info chahiye',
      idea: 'Parameters me info neeche bhejo: depth (level-wise answers ke liye), ya (low, high) range (BST validate).',
      code: `void dfs(TreeNode node, int depth, List<Integer> res) {
    if (node == null) return;
    if (depth == res.size()) res.add(node.val); // is depth ka pehla node
    dfs(node.right, depth + 1, res);
    dfs(node.left, depth + 1, res);
}`,
      qs: [199, 102, 98],
    },
    {
      name: 'BST Inorder = Sorted',
      signal: '"BST" + "kth smallest", "validate", "sorted order", "closest value"',
      idea: 'BST ka inorder strictly increasing hota hai. Iterative inorder (stack) se k-th pe ruk jao, ya prev se compare karo.',
      code: `Deque<TreeNode> st = new ArrayDeque<>();
TreeNode cur = root;
while (cur != null || !st.isEmpty()) {
    while (cur != null) { st.push(cur); cur = cur.left; }
    cur = st.pop();
    // yahan cur.val sorted order me aata hai
    cur = cur.right;
}`,
      qs: [230, 98],
    },
  ],

  // ---------------- QUESTIONS ----------------
  questions: {
    104: {
      oneLine: 'Depth = 1 + max(left depth, right depth); null → 0. BFS me levels gino.',
      pattern: 'Bottom-up DFS / BFS level count',
      approaches: [
        {
          level: 'Recursive', idea: 'Postorder DFS: left aur right ki depth lo, bada wala + 1 (current node). Base case null → 0.',
          time: 'O(n)', space: 'O(h) recursion stack',
          code: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    int left = maxDepth(root.left);
    int right = maxDepth(root.right);
    return 1 + Math.max(left, right);
}`,
        },
        {
          level: 'BFS', idea: 'Level order: har level poora khatam hone pe depth++. Jitne levels utni depth.',
          time: 'O(n)', space: 'O(w) queue (sabse chaudi level)',
          code: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    int depth = 0;
    while (!q.isEmpty()) {
        int size = q.size();
        depth++;
        for (int i = 0; i < size; i++) {
            TreeNode node = q.poll();
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
    }
    return depth;
}`,
        },
        {
          level: 'Iterative', idea: 'Recursion ko khud ke stack se: (node, depth) pairs push karo (preorder). Har pop pe best = max(best, depth).',
          time: 'O(n)', space: 'O(h) stack',
          code: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    Deque<TreeNode> nodes = new ArrayDeque<>();
    Deque<Integer> depths = new ArrayDeque<>();
    nodes.push(root);
    depths.push(1);
    int best = 0;
    while (!nodes.isEmpty()) {
        TreeNode node = nodes.pop();
        int d = depths.pop();
        best = Math.max(best, d);
        if (node.right != null) { nodes.push(node.right); depths.push(d + 1); }
        if (node.left != null) { nodes.push(node.left); depths.push(d + 1); }
    }
    return best;
}`,
        },
      ],
      dryRun: '[3,9,20,null,null,15,7] → depth(9)=1, depth(15)=1, depth(7)=1, depth(20)=1+max(1,1)=2, depth(3)=1+max(1,2)=3',
      interview: 'The depth of a tree is one plus the larger depth of its two subtrees, with an empty tree having depth zero. A postorder recursion computes this in O(n) time and O(h) stack space. Iteratively, a BFS that counts levels gives the same answer and avoids deep recursion on skewed trees.',
      problem: {
        statement: 'Binary tree ka <b>root</b> diya hai. Uski <b>maximum depth</b> return karo — yaani root se sabse door wale leaf tak ke raaste me <b>kitne nodes</b> hain.',
        examples: [
          { input: 'root = [3,9,20,null,null,15,7]', output: '3', explain: 'Sabse lamba raasta 3 → 20 → 15 (ya 3 → 20 → 7) = 3 nodes.', viz: { root: '[3,9,20,null,null,15,7]' } },
          { input: 'root = [1,null,2]', output: '2', explain: '1 ka sirf right child 2 hai → raasta 1 → 2 = 2 nodes.', viz: { root: '[1,null,2]' } },
          { input: 'root = []', output: '0', explain: 'Khaali tree ki depth 0.', viz: { root: '[]' } },
        ],
        constraints: ['Nodes ki sankhya [0, 10⁴] range me', '−100 ≤ Node.val ≤ 100'],
      },
    },
    100: {
      oneLine: 'Dono null → true; ek null ya value alag → false; warna left-left && right-right.',
      pattern: 'Two-tree recursion',
      approaches: [
        {
          level: 'Brute', idea: 'Dono trees ko preorder me (null ko "#" likh ke) string banao aur compare karo. Null markers zaroori — warna alag shape same string de sakti hai.',
          time: 'O(n + m)', space: 'O(n + m) strings',
          code: `public boolean isSameTree(TreeNode p, TreeNode q) {
    StringBuilder a = new StringBuilder(), b = new StringBuilder();
    serialize(p, a);
    serialize(q, b);
    return a.toString().equals(b.toString());
}

private void serialize(TreeNode node, StringBuilder sb) {
    if (node == null) { sb.append("#,"); return; }
    sb.append(node.val).append(',');
    serialize(node.left, sb);
    serialize(node.right, sb);
}`,
        },
        {
          level: 'Recursive', idea: 'Do pointers saath chalao. Pehla mismatch milte hi false — short-circuit (&&) baaki tree skip kar deta hai.',
          time: 'O(min(n, m))', space: 'O(h)',
          code: `public boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null) return false;
    if (p.val != q.val) return false;
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
        },
        {
          level: 'Iterative', idea: 'Queue me (p, q) pairs. Har pair check karo, fir (left, left) aur (right, right) pairs daalo. LinkedList null allow karta hai.',
          time: 'O(min(n, m))', space: 'O(w)',
          code: `public boolean isSameTree(TreeNode p, TreeNode q) {
    Queue<TreeNode[]> queue = new LinkedList<>();
    queue.offer(new TreeNode[]{p, q});
    while (!queue.isEmpty()) {
        TreeNode[] pair = queue.poll();
        TreeNode a = pair[0], b = pair[1];
        if (a == null && b == null) continue;
        if (a == null || b == null || a.val != b.val) return false;
        queue.offer(new TreeNode[]{a.left, b.left});
        queue.offer(new TreeNode[]{a.right, b.right});
    }
    return true;
}`,
        },
      ],
      dryRun: 'p=[1,2], q=[1,null,2] → (1,1) same → (2,null): ek null → false',
      interview: 'Two trees are the same if both roots are null, or both exist with equal values and their left subtrees and right subtrees are respectively the same. I recurse on both trees in lockstep and short-circuit on the first mismatch, which is O(n) time and O(h) stack. An iterative version uses a queue of node pairs.',
      problem: {
        statement: 'Do binary trees ke roots <b>p</b> aur <b>q</b> diye hain. Check karo dono <b>bilkul same</b> hain ya nahi — same <b>shape</b> (structure) aur har jagah same <b>value</b>.',
        examples: [
          { input: 'p = [1,2,3], q = [1,2,3]', output: 'true', explain: 'Shape aur values dono match.', viz: { p: '[1,2,3]', q: '[1,2,3]' } },
          { input: 'p = [1,2], q = [1,null,2]', output: 'false', explain: 'p me 2 left child hai, q me right child — shape alag.', viz: { p: '[1,2]', q: '[1,null,2]' } },
          { input: 'p = [1,2,1], q = [1,1,2]', output: 'false', explain: 'Shape same, par left child ki value 2 vs 1.', viz: { p: '[1,2,1]', q: '[1,1,2]' } },
        ],
        constraints: ['Dono trees me nodes [0, 100] range me', '−10⁴ ≤ Node.val ≤ 10⁴'],
      },
    },
    226: {
      oneLine: 'Har node pe left aur right swap — recursion (postorder/preorder) ya BFS.',
      pattern: 'DFS / BFS (har node pe ek kaam)',
      approaches: [
        {
          level: 'Recursive', idea: 'Pehle dono subtrees invert karo, fir current node ke left/right swap. null → null.',
          time: 'O(n)', space: 'O(h)',
          code: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode left = invertTree(root.left);
    TreeNode right = invertTree(root.right);
    root.left = right;
    root.right = left;
    return root;
}`,
        },
        {
          level: 'Iterative', idea: 'BFS: har node poll karo, uske children swap karo, fir children queue me. Order matter nahi karta — har node ek baar swap hona chahiye.',
          time: 'O(n)', space: 'O(w)',
          code: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        TreeNode node = q.poll();
        TreeNode tmp = node.left;
        node.left = node.right;
        node.right = tmp;
        if (node.left != null) q.offer(node.left);
        if (node.right != null) q.offer(node.right);
    }
    return root;
}`,
        },
      ],
      dryRun: '[4,2,7,1,3,6,9] → invert(2) → [2,3,1], invert(7) → [7,9,6], swap at 4 → [4,7,2,9,6,3,1]',
      interview: 'Inverting a tree means swapping the left and right child of every node. Recursively, I invert both subtrees and then swap them at the current node, which visits each node once: O(n) time and O(h) stack. The same works iteratively with a BFS queue, swapping children as each node is polled.',
      problem: {
        statement: 'Binary tree ka <b>root</b> diya hai. Tree ko <b>invert</b> (mirror image) karo — har node ke left aur right children aapas me badal do — aur root return karo.',
        examples: [
          { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explain: 'Har level ulta ho gaya: 2↔7, aur unke children bhi 1↔3, 6↔9 → mirror.', viz: { root: '[4,2,7,1,3,6,9]' } },
          { input: 'root = [2,1,3]', output: '[2,3,1]', explain: 'Root ke children 1 aur 3 swap.', viz: { root: '[2,1,3]' } },
          { input: 'root = []', output: '[]', explain: 'Khaali tree → khaali.', viz: { root: '[]' } },
        ],
        constraints: ['Nodes [0, 100] range me', '−100 ≤ Node.val ≤ 100'],
      },
    },
    101: {
      oneLine: 'isMirror(root.left, root.right): values same aur (a.left, b.right) + (a.right, b.left) mirror.',
      pattern: 'Mirror recursion (two pointers on tree)',
      approaches: [
        {
          level: 'Recursive', idea: 'Tree symmetric = left subtree right subtree ka mirror. Mirror check me pairs cross hote hain: bahar wale (a.left, b.right) aur andar wale (a.right, b.left).',
          time: 'O(n)', space: 'O(h)',
          code: `public boolean isSymmetric(TreeNode root) {
    if (root == null) return true;
    return isMirror(root.left, root.right);
}

private boolean isMirror(TreeNode a, TreeNode b) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    if (a.val != b.val) return false;
    return isMirror(a.left, b.right) && isMirror(a.right, b.left);
}`,
        },
        {
          level: 'Iterative', idea: 'Queue me nodes do-do karke (pair) daalo. Har baar 2 poll karo, compare, fir 4 children cross order me daalo. LinkedList null allow karta hai, ArrayDeque nahi.',
          time: 'O(n)', space: 'O(w)',
          code: `public boolean isSymmetric(TreeNode root) {
    if (root == null) return true;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root.left);
    q.offer(root.right);
    while (!q.isEmpty()) {
        TreeNode a = q.poll(), b = q.poll();
        if (a == null && b == null) continue;
        if (a == null || b == null || a.val != b.val) return false;
        q.offer(a.left);
        q.offer(b.right);
        q.offer(a.right);
        q.offer(b.left);
    }
    return true;
}`,
        },
      ],
      dryRun: '[1,2,2,3,4,4,3] → mirror(2,2) ✓ → mirror(3,3) ✓ (outer) → mirror(4,4) ✓ (inner) → true',
      interview: 'A tree is symmetric if its left subtree is a mirror of its right subtree. Two nodes mirror each other when their values match, the outer pair a.left and b.right mirror, and the inner pair a.right and b.left mirror. That recursion is O(n) time and O(h) space; iteratively I push nodes in mirrored pairs onto a queue.',
      problem: {
        statement: 'Binary tree ka <b>root</b> diya hai. Check karo tree apne center ke around <b>symmetric</b> (mirror image) hai ya nahi — beech me sheesha rakho toh left aadha right aadhe jaisa dikhe.',
        examples: [
          { input: 'root = [1,2,2,3,4,4,3]', output: 'true', explain: 'Left side 2 → (3, 4), right side 2 → (4, 3) — ulta order, yaani mirror.', viz: { root: '[1,2,2,3,4,4,3]' } },
          { input: 'root = [1,2,2,null,3,null,3]', output: 'false', explain: 'Dono 2 ke right child 3 hain — mirror me ek left aur ek right hona chahiye tha.', viz: { root: '[1,2,2,null,3,null,3]' } },
        ],
        constraints: ['Nodes [1, 1000] range me', '−100 ≤ Node.val ≤ 100', 'Follow-up: recursive aur iterative dono se karo'],
      },
    },
    102: {
      oneLine: 'BFS queue: size = q.size() → itne nodes = ek level list; children queue me.',
      pattern: 'BFS level by level',
      approaches: [
        {
          level: 'DFS', idea: 'Recursion me depth saath bhejo. depth == res.size() → naya level list banao; node.val ko res.get(depth) me daalo. Preorder (left pehle) se har level left → right bharta hai.',
          time: 'O(n)', space: 'O(h) stack + output',
          code: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    dfs(root, 0, res);
    return res;
}

private void dfs(TreeNode node, int depth, List<List<Integer>> res) {
    if (node == null) return;
    if (depth == res.size()) res.add(new ArrayList<>());
    res.get(depth).add(node.val);
    dfs(node.left, depth + 1, res);
    dfs(node.right, depth + 1, res);
}`,
        },
        {
          level: 'BFS', idea: 'Queue me root. Har round: size = q.size() (abhi queue me sirf current level hai), itne nodes poll karke ek list banao, unke children enqueue.',
          time: 'O(n)', space: 'O(w) queue',
          code: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new LinkedList<>();
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
        },
      ],
      dryRun: '[3,9,20,null,null,15,7] → q=[3] size 1 → [3]; q=[9,20] size 2 → [9,20]; q=[15,7] → [15,7]',
      interview: 'I use BFS with a queue. At the start of each round the queue holds exactly one level, so I record its size, poll that many nodes into a list, and enqueue their children for the next level. Every node is enqueued and dequeued once, so it is O(n) time and O(w) space for the widest level. A DFS that passes the depth also works.',
      problem: {
        statement: 'Binary tree ka <b>root</b> diya hai. Uska <b>level order traversal</b> return karo — har level ki values left se right ek list me, aur saari levels upar se neeche.',
        examples: [
          { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]', explain: 'Level 0: 3 · Level 1: 9, 20 · Level 2: 15, 7', viz: { root: '[3,9,20,null,null,15,7]' } },
          { input: 'root = [1]', output: '[[1]]', explain: 'Sirf ek level.', viz: { root: '[1]' } },
          { input: 'root = []', output: '[]', explain: 'Khaali tree → khaali list.', viz: { root: '[]' } },
        ],
        constraints: ['Nodes [0, 2000] range me', '−1000 ≤ Node.val ≤ 1000'],
      },
    },
    199: {
      oneLine: 'BFS me har level ka last node (i == size − 1); ya DFS right-first me har depth ka pehla node.',
      pattern: 'BFS level by level / Top-down DFS (depth)',
      approaches: [
        {
          level: 'BFS', idea: 'Level order chalao; har level me jo node sabse last poll hota hai (i == size − 1) wahi right se dikhta hai.',
          time: 'O(n)', space: 'O(w)',
          code: `public List<Integer> rightSideView(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = q.poll();
            if (i == size - 1) res.add(node.val);
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
    }
    return res;
}`,
        },
        {
          level: 'DFS', idea: 'Right child pehle visit karo, depth saath bhejo. Kisi depth pe pehli baar pahunche (depth == res.size()) → wahi rightmost node hai.',
          time: 'O(n)', space: 'O(h)',
          code: `public List<Integer> rightSideView(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    dfs(root, 0, res);
    return res;
}

private void dfs(TreeNode node, int depth, List<Integer> res) {
    if (node == null) return;
    if (depth == res.size()) res.add(node.val);
    dfs(node.right, depth + 1, res);
    dfs(node.left, depth + 1, res);
}`,
        },
      ],
      dryRun: '[1,2,3,null,5,null,4] → levels [1] [2,3] [5,4] → last of each = [1,3,4]',
      interview: 'The right side view is the last node of every level. With BFS I process the tree level by level and add the node at index size − 1 of each level. Alternatively, a DFS that visits the right child first adds a node whenever it reaches a depth for the first time. Both are O(n) time; BFS uses O(w) space and DFS uses O(h).',
      problem: {
        statement: 'Binary tree ka <b>root</b> diya hai. Socho tum tree ke <b>right side</b> khade ho — upar se neeche, har level pe jo node <b>dikhta</b> hai (sabse right wala) uski values return karo.',
        examples: [
          { input: 'root = [1,2,3,null,5,null,4]', output: '[1,3,4]', explain: 'Level 0: 1 · Level 1: 2, 3 → 3 dikhta hai · Level 2: 5, 4 → 4 dikhta hai.', viz: { root: '[1,2,3,null,5,null,4]' } },
          { input: 'root = [1,2,3,4,null,null,null,5]', output: '[1,3,4,5]', explain: 'Level 2 aur 3 pe sirf left side ke nodes (4, 5) hain — right se wahi dikhte hain.', viz: { root: '[1,2,3,4,null,null,null,5]' } },
          { input: 'root = [1,null,3]', output: '[1,3]', explain: 'Seedha right chain.', viz: { root: '[1,null,3]' } },
          { input: 'root = []', output: '[]', explain: 'Khaali tree.', viz: { root: '[]' } },
        ],
        constraints: ['Nodes [0, 100] range me', '−100 ≤ Node.val ≤ 100'],
      },
    },
    543: {
      oneLine: 'Har node pe left height + right height = us node se guzarne wala longest path; ek DFS me height return + best update.',
      pattern: 'Bottom-up DFS (height return, global best)',
      approaches: [
        {
          level: 'Brute', idea: 'Har node ke liye height(left) + height(right) alag se nikalo (har baar poora subtree), aur max lo. Height baar-baar recompute hoti hai.',
          time: 'O(n²) worst (skewed), O(n log n) balanced', space: 'O(h)',
          code: `public int diameterOfBinaryTree(TreeNode root) {
    if (root == null) return 0;
    int through = height(root.left) + height(root.right);
    int leftBest = diameterOfBinaryTree(root.left);
    int rightBest = diameterOfBinaryTree(root.right);
    return Math.max(through, Math.max(leftBest, rightBest));
}

private int height(TreeNode node) {
    if (node == null) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
}`,
        },
        {
          level: 'Optimal', idea: 'Ek hi postorder DFS: height function left aur right height laata hai, wahin best = max(best, left + right) update kar do, aur parent ko 1 + max return karo.',
          time: 'O(n)', space: 'O(h)',
          code: `private int best = 0;

public int diameterOfBinaryTree(TreeNode root) {
    best = 0;
    height(root);
    return best;
}

private int height(TreeNode node) {
    if (node == null) return 0;
    int left = height(node.left);
    int right = height(node.right);
    best = Math.max(best, left + right);
    return 1 + Math.max(left, right);
}`,
        },
      ],
      dryRun: '[1,2,3,4,5] → h(4)=1, h(5)=1, at 2: best=1+1=2, h(2)=2; h(3)=1; at 1: best=max(2, 2+1)=3 → 3',
      interview: 'The longest path through a node uses the height of its left subtree plus the height of its right subtree, measured in edges. Recomputing heights for every node is O(n²) on a skewed tree, so instead I do one postorder DFS that returns height to the parent and updates a global best with left + right at every node. That is O(n) time and O(h) space.',
      problem: {
        statement: 'Binary tree ka <b>root</b> diya hai. Uska <b>diameter</b> return karo — kisi bhi do nodes ke beech ka <b>sabse lamba raasta</b>, <b>edges</b> me gin ke. Ye raasta root se guzre, zaroori nahi.',
        examples: [
          { input: 'root = [1,2,3,4,5]', output: '3', explain: 'Raasta 4 → 2 → 1 → 3 (ya 5 → 2 → 1 → 3) = 3 edges.', viz: { root: '[1,2,3,4,5]' } },
          { input: 'root = [1,2]', output: '1', explain: 'Sirf ek edge 1 — 2.', viz: { root: '[1,2]' } },
          { input: 'root = [1,2,null,3,4,5,null,null,6]', output: '4', explain: 'Longest path 5 → 3 → 2 → 4 → 6 root (1) se nahi guzarta.', viz: { root: '[1,2,null,3,4,5,null,null,6]' } },
        ],
        constraints: ['Nodes [1, 10⁴] range me', '−100 ≤ Node.val ≤ 100'],
      },
    },
    236: {
      oneLine: 'root null/p/q → root; left & right dono non-null → root LCA; warna jo non-null woh upar bhejo.',
      pattern: 'Bottom-up DFS (found signal upar bhejo)',
      approaches: [
        {
          level: 'Brute', idea: 'Root se p tak aur root se q tak ka path (list) nikalo (backtracking). Dono paths ka last common node = LCA.',
          time: 'O(n)', space: 'O(n) paths + O(h) stack',
          code: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    List<TreeNode> pathP = new ArrayList<>(), pathQ = new ArrayList<>();
    findPath(root, p, pathP);
    findPath(root, q, pathQ);
    TreeNode lca = null;
    for (int i = 0; i < pathP.size() && i < pathQ.size(); i++) {
        if (pathP.get(i) != pathQ.get(i)) break;
        lca = pathP.get(i);
    }
    return lca;
}

private boolean findPath(TreeNode node, TreeNode target, List<TreeNode> path) {
    if (node == null) return false;
    path.add(node);
    if (node == target) return true;
    if (findPath(node.left, target, path) || findPath(node.right, target, path)) return true;
    path.remove(path.size() - 1);
    return false;
}`,
        },
        {
          level: 'Better', idea: 'Iterative: stack se traverse karke har node ka parent HashMap me rakho (jab tak p aur q dono na mil jaayein). p ke saare ancestors set me, fir q se upar chalo — pehla common = LCA.',
          time: 'O(n)', space: 'O(n)',
          code: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    Map<TreeNode, TreeNode> parent = new HashMap<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    parent.put(root, null);
    stack.push(root);
    while (!parent.containsKey(p) || !parent.containsKey(q)) {
        TreeNode node = stack.pop();
        if (node.left != null) { parent.put(node.left, node); stack.push(node.left); }
        if (node.right != null) { parent.put(node.right, node); stack.push(node.right); }
    }
    Set<TreeNode> ancestors = new HashSet<>();
    while (p != null) { ancestors.add(p); p = parent.get(p); }
    while (!ancestors.contains(q)) q = parent.get(q);
    return q;
}`,
        },
        {
          level: 'Optimal', idea: 'Ek DFS: har subtree batata hai "maine p ya q (ya LCA) dekha?". Agar left aur right dono se kuch mila → current node split point = LCA. Ek hi side se mila → wahi upar bhejo.',
          time: 'O(n)', space: 'O(h)',
          code: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root;
    return left != null ? left : right;
}`,
        },
      ],
      dryRun: '[3,5,1,6,2,0,8,null,null,7,4], p=5, q=1 → left(3) returns 5 (root==p), right(3) returns 1 → dono non-null → 3',
      interview: 'I do one postorder DFS where each call returns p or q if it finds one in its subtree, or null. If a node gets non-null results from both children, p and q are on different sides, so that node is the lowest common ancestor. If only one side is non-null I pass it up, and if the node itself is p or q I return it immediately, which also covers the case where one is an ancestor of the other. O(n) time, O(h) space.',
      problem: {
        statement: 'Binary tree ka <b>root</b> aur do nodes <b>p</b>, <b>q</b> diye hain. Unka <b>Lowest Common Ancestor (LCA)</b> return karo — sabse neeche wala node jiske subtree me p aur q dono hon. (Ek node khud ka bhi descendant maana jaata hai.)',
        examples: [
          { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', output: '3', explain: '5 left me, 1 right me — dono 3 pe milte hain.', viz: { root: '[3,5,1,6,2,0,8,null,null,7,4]', p: '5', q: '1' } },
          { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', output: '5', explain: '4, node 5 ke subtree me hai, aur node khud ka descendant hota hai → LCA = 5.', viz: { root: '[3,5,1,6,2,0,8,null,null,7,4]', p: '5', q: '4' } },
          { input: 'root = [1,2], p = 1, q = 2', output: '1', explain: 'p khud q ka ancestor hai.', viz: { root: '[1,2]', p: '1', q: '2' } },
        ],
        constraints: ['Nodes [2, 10⁵] range me', '−10⁹ ≤ Node.val ≤ 10⁹', 'Saari values unique', 'p ≠ q, aur dono tree me exist karte hain'],
      },
    },
    230: {
      oneLine: 'BST ka inorder = sorted. Iterative inorder (stack) me k-th pop = answer.',
      pattern: 'BST Inorder = Sorted',
      approaches: [
        {
          level: 'Brute', idea: 'Poora inorder ek list me daalo (BST hai toh sorted aayega), fir list.get(k − 1).',
          time: 'O(n)', space: 'O(n) list',
          code: `public int kthSmallest(TreeNode root, int k) {
    List<Integer> vals = new ArrayList<>();
    inorder(root, vals);
    return vals.get(k - 1);
}

private void inorder(TreeNode node, List<Integer> vals) {
    if (node == null) return;
    inorder(node.left, vals);
    vals.add(node.val);
    inorder(node.right, vals);
}`,
        },
        {
          level: 'Optimal', idea: 'Iterative inorder: left me jaate hue stack me push, pop = agla chhota element. k-- karte jao; k == 0 pe ruk jao — poora tree nahi ghoomna padta.',
          time: 'O(h + k)', space: 'O(h)',
          code: `public int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode cur = root;
    while (cur != null || !stack.isEmpty()) {
        while (cur != null) {
            stack.push(cur);
            cur = cur.left;
        }
        cur = stack.pop();
        k--;
        if (k == 0) return cur.val;
        cur = cur.right;
    }
    return -1;
}`,
        },
      ],
      dryRun: '[5,3,6,2,4,null,null,1], k=3 → push 5,3,2,1 → pop 1 (k=2), pop 2 (k=1), pop 3 (k=0) → 3',
      interview: 'An inorder traversal of a BST visits values in sorted order, so the k-th visited node is the answer. I do it iteratively with a stack: push left children, pop the next smallest, decrement k, and stop as soon as k reaches zero, giving O(h + k) time and O(h) space. If the tree is modified often, I would augment each node with its subtree size to answer in O(h).',
      problem: {
        statement: 'Ek <b>BST</b> ka root aur integer <b>k</b> diya hai. Tree ki saari values me se <b>k-th sabse chhoti</b> value return karo (k 1 se start hota hai).',
        examples: [
          { input: 'root = [3,1,4,null,2], k = 1', output: '1', explain: 'Sorted values: 1, 2, 3, 4 → pehli = 1.', viz: { root: '[3,1,4,null,2]', k: '1' } },
          { input: 'root = [5,3,6,2,4,null,null,1], k = 3', output: '3', explain: 'Sorted: 1, 2, 3, 4, 5, 6 → teesri = 3.', viz: { root: '[5,3,6,2,4,null,null,1]', k: '3' } },
        ],
        constraints: ['Nodes n, 1 ≤ k ≤ n ≤ 10⁴', '0 ≤ Node.val ≤ 10⁴', 'Follow-up: BST baar-baar modify (insert/delete) ho aur kth smallest baar-baar chahiye toh?'],
      },
    },
    98: {
      oneLine: 'Har node ko (low, high) range do: left → (low, node.val), right → (node.val, high). long bounds.',
      pattern: 'Top-down DFS (range) / BST Inorder',
      approaches: [
        {
          level: 'Brute', idea: 'Inorder list banao; BST hai toh strictly increasing honi chahiye. Ek bhi vals[i] ≤ vals[i−1] → false.',
          time: 'O(n)', space: 'O(n)',
          code: `public boolean isValidBST(TreeNode root) {
    List<Integer> vals = new ArrayList<>();
    inorder(root, vals);
    for (int i = 1; i < vals.size(); i++) {
        if (vals.get(i) <= vals.get(i - 1)) return false;
    }
    return true;
}

private void inorder(TreeNode node, List<Integer> vals) {
    if (node == null) return;
    inorder(node.left, vals);
    vals.add(node.val);
    inorder(node.right, vals);
}`,
        },
        {
          level: 'Optimal', idea: 'Top-down: har node ek allowed range (low, high) me hona chahiye. Left jaao toh high = node.val, right jaao toh low = node.val. Long use karo taaki Integer.MIN/MAX values bhi sahi chalein.',
          time: 'O(n)', space: 'O(h)',
          code: `public boolean isValidBST(TreeNode root) {
    return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean valid(TreeNode node, long low, long high) {
    if (node == null) return true;
    if (node.val <= low || node.val >= high) return false;
    return valid(node.left, low, node.val) && valid(node.right, node.val, high);
}`,
        },
        {
          level: 'Iterative', idea: 'Iterative inorder + prev: har pop pe check cur.val > prev. List nahi chahiye, pehli galti pe ruk jao.',
          time: 'O(n)', space: 'O(h)',
          code: `public boolean isValidBST(TreeNode root) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode cur = root;
    Integer prev = null;
    while (cur != null || !stack.isEmpty()) {
        while (cur != null) {
            stack.push(cur);
            cur = cur.left;
        }
        cur = stack.pop();
        if (prev != null && cur.val <= prev) return false;
        prev = cur.val;
        cur = cur.right;
    }
    return true;
}`,
        },
      ],
      dryRun: '[5,4,6,null,null,3,7] → 5 in (−∞,∞) ✓, 4 in (−∞,5) ✓, 6 in (5,∞) ✓, 3 in (5,6) ✗ → false',
      interview: 'Checking each node only against its children is not enough, because every node must respect bounds set by all its ancestors. I pass an allowed range down the recursion: going left the upper bound becomes the node value, going right the lower bound does. I use long bounds so Integer.MIN_VALUE and MAX_VALUE nodes work. O(n) time, O(h) space. Equivalently, an inorder traversal must be strictly increasing.',
      problem: {
        statement: 'Binary tree ka <b>root</b> diya hai. Check karo ye <b>valid BST</b> hai ya nahi: har node ke <b>poore left subtree</b> ki values node se <b>strictly chhoti</b>, <b>poore right subtree</b> ki <b>strictly badi</b>, aur dono subtrees khud bhi BST.',
        examples: [
          { input: 'root = [2,1,3]', output: 'true', explain: '1 < 2 < 3.', viz: { root: '[2,1,3]' } },
          { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explain: 'Root 5 ka right child 4 hai, jo 5 se chhota hai.', viz: { root: '[5,1,4,null,null,3,6]' } },
          { input: 'root = [5,4,6,null,null,3,7]', output: 'false', explain: 'Trap: 3 apne parent 6 se chhota (theek) par root 5 ke right subtree me hai — 5 se bada hona chahiye tha.', viz: { root: '[5,4,6,null,null,3,7]' } },
        ],
        constraints: ['Nodes [1, 10⁴] range me', '−2³¹ ≤ Node.val ≤ 2³¹ − 1'],
      },
    },
  },

  // ---------------- DAYS (3 weeks = 21 days) ----------------
  days: [
    {
      day: 1, week: 1, dow: 'Mon', type: 'learn', title: 'Tree Basics + Recursion (Max Depth)',
      theory: ['TreeNode structure, root/leaf/height', 'Level-order array padhna', 'Recursion ke 3 sawaal: base / subproblem / combine', 'Call stack = O(h)'],
      qs: [104],
      interview: {
        q: 'How do you approach recursion on a binary tree?',
        a: 'I ask three questions. First, the base case: what should a null node return? Second, what do I need from the left and right subtrees? Third, how do I combine those answers with the current node? For maximum depth that is zero for null, the depths of both children, and one plus the larger. The recursion visits every node once, so it is O(n) time, and the call stack grows to the height of the tree, which is O(log n) when balanced and O(n) when skewed.',
      },
    },
    {
      day: 2, week: 1, dow: 'Tue', type: 'learn', title: 'Two Trees Together (Same Tree)',
      theory: ['Do pointers ek saath recursion', 'Base cases ka order: dono null → ek null → value', 'Short-circuit &&', 'Serialize karke compare (null markers)'],
      qs: [100],
      interview: {
        q: 'Why do you need null markers when serializing a tree?',
        a: 'Without null markers, different shapes can produce the same sequence. For example, a root 1 with a left child 2 and a root 1 with a right child 2 both have the preorder 1, 2. Recording a placeholder for every missing child makes the serialization unique for each shape, so comparing two strings is equivalent to comparing the trees. That is also exactly how LeetCode encodes trees in its level-order input.',
      },
    },
    {
      day: 3, week: 1, dow: 'Wed', type: 'learn', title: 'Modify a Tree (Invert)',
      theory: ['Har node pe ek kaam (swap)', 'Postorder vs preorder swap — dono chalega', 'Recursion vs BFS', 'Return root (reference same)'],
      qs: [226],
      interview: {
        q: 'Does the order of traversal matter when inverting a tree?',
        a: 'No. Inverting only requires that every node has its two children swapped exactly once. Preorder swaps first and then recurses, postorder recurses first and then swaps, and BFS swaps as each node is polled — all produce the same mirrored tree. What matters is not swapping a node twice. I usually write the postorder version because it reads naturally: invert both subtrees, then attach them on opposite sides.',
      },
    },
    {
      day: 4, week: 1, dow: 'Thu', type: 'learn', title: 'Mirror Recursion (Symmetric Tree)',
      theory: ['Symmetric = left, right ka mirror', 'Outer pair (a.left, b.right), inner pair (a.right, b.left)', 'Same Tree se fark', 'Iterative: queue me pairs (LinkedList null allow)'],
      qs: [101, 100],
      interview: {
        q: 'How is Symmetric Tree related to Same Tree?',
        a: 'Both compare two trees in lockstep with the same base cases: both null is a match, one null is a mismatch, and values must be equal. The only difference is which children we pair. Same Tree pairs left with left and right with right. Symmetric Tree checks whether the left subtree mirrors the right one, so it pairs the outer children, a.left with b.right, and the inner children, a.right with b.left. Equivalently, a tree is symmetric if its left subtree is the same as the inverted right subtree.',
      },
    },
    {
      day: 5, week: 1, dow: 'Fri', type: 'learn', title: 'Traversals: Pre / In / Post + Iterative DFS',
      theory: ['Pre / In / Post — root kab visit', 'Recursion → explicit stack', 'Stack me right pehle push (taaki left pehle nikle)', 'BFS se depth: levels gino'],
      qs: [104, 226],
      interview: {
        q: 'When would you convert a recursive tree solution to an iterative one?',
        a: 'Recursion uses the call stack, whose depth equals the tree height. On a skewed tree with tens of thousands of nodes that can overflow the stack in Java. An iterative version with an explicit stack or a queue keeps the same O(n) time but stores the state on the heap, which is safer. I also convert when the interviewer asks for it, or when I need to stop early cleanly, like returning the k-th node of an inorder traversal.',
      },
    },
    {
      day: 6, week: 1, dow: 'Sat', type: 'revision', title: 'Revision — Week 1 (Sohvi ke 4 tree questions)',
      theory: ['Bina dekhe re-solve: 104, 100, 226, 101', 'Har ek recursive + ek iterative', 'Timer: Easy 15 min', 'System Design session'],
      qs: [104, 100, 226, 101],
      interview: {
        q: 'What is the time and space complexity of tree traversals?',
        a: 'Every traversal — preorder, inorder, postorder or level order — visits each node once, so time is O(n). Space depends on the method. Recursive DFS or an explicit stack holds at most one root-to-leaf path, which is O(h): O(log n) for a balanced tree and O(n) for a skewed one. BFS holds one level in the queue, O(w), and the last level of a complete tree has about n/2 nodes, so it can be O(n).',
      },
    },
    {
      day: 7, week: 1, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest',
      theory: ['30 min: Tum interviews Sohvi (LC 226 bina dekhe)', '30 min: Sohvi interviews Tum (LC 101 recursive + iterative)', '30 min: Weekly contest discussion', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [226, 101],
      interview: {
        q: 'How do you explain a recursive solution clearly in an interview?',
        a: 'I state the contract of the function first: what it takes and what it returns for any subtree. Then I give the base case, and then the recursive step assuming the calls on children already work — the leap of faith. I draw a small tree and trace two or three levels of calls, showing values coming back up. Finally I mention complexity: O(n) time because each node is visited once, and O(h) space for the call stack.',
      },
    },
    {
      day: 8, week: 2, dow: 'Mon', type: 'learn', title: 'BFS: Level Order Traversal',
      theory: ['Queue = FIFO, level by level', 'size = q.size() loop se pehle', 'List<List<Integer>> banana', 'DFS + depth se bhi level order'],
      qs: [102],
      interview: {
        q: 'Why do you capture the queue size before processing a level?',
        a: 'At the start of each round the queue contains exactly the nodes of the current level. While I process them I enqueue their children, so the queue size keeps changing. Saving size before the loop tells me how many nodes belong to this level, so I poll exactly that many and the children wait for the next round. If I used q.size() in the loop condition, the new children would be mixed into the current level.',
      },
    },
    {
      day: 9, week: 2, dow: 'Tue', type: 'learn', title: 'BFS Variant: Right Side View',
      theory: ['Level ka last node = i == size − 1', 'DFS right-first + depth', 'depth == res.size() → pehli baar is depth pe', 'Left view = mirror idea'],
      qs: [199],
      interview: {
        q: 'Compare BFS and DFS for the right side view problem.',
        a: 'With BFS I process each level and take the last node polled, which is naturally the rightmost one. It is easy to reason about and uses O(w) memory for the widest level. With DFS I visit the right child before the left and record a node the first time I reach a new depth, because that first node is the rightmost at that depth. DFS uses O(h) memory, which is better for wide, shallow trees, while BFS is better for very deep, narrow trees.',
      },
    },
    {
      day: 10, week: 2, dow: 'Wed', type: 'learn', title: 'Bottom-up DFS: Diameter',
      theory: ['Height return karo, answer global me', 'Diameter = edges, depth = nodes', 'Path root se guzre zaroori nahi', 'Brute O(n²) → Optimal O(n)'],
      qs: [543],
      interview: {
        q: 'How do you compute two things in one tree traversal?',
        a: 'When the answer depends on information from children but differs from what the parent needs, I return one value and track the other separately. In diameter, the parent needs the height, while the global answer needs left height plus right height. So my DFS returns height and updates a field or a one-element array with the best path at every node. This turns an O(n²) approach of recomputing heights into a single O(n) postorder pass.',
      },
    },
    {
      day: 11, week: 2, dow: 'Thu', type: 'learn', title: 'Lowest Common Ancestor',
      theory: ['Return "found" signal upar', 'Dono side non-null → split point', 'root == p → turant return (ancestor case)', 'Brute: do paths compare'],
      qs: [236],
      interview: {
        q: 'Why does returning early when root equals p still give the right LCA?',
        a: 'If the current node is p, then either q is somewhere below p, in which case p itself is the lowest common ancestor, or q is in a different branch, in which case some ancestor will receive p from one side and q from the other and return itself. In both cases there is no need to search below p. The problem guarantees both nodes exist, which is what makes this shortcut safe.',
      },
    },
    {
      day: 12, week: 2, dow: 'Fri', type: 'learn', title: 'DFS with Depth (102 & 199 recursive)',
      theory: ['Top-down: depth parameter', 'depth == res.size() → naya level', '102 DFS: res.get(depth).add', '199 DFS: right pehle'],
      qs: [102, 199],
      interview: {
        q: 'Can you do a level order traversal with DFS?',
        a: 'Yes. I pass the depth as a parameter. When the depth equals the size of the result list, I am visiting that level for the first time, so I add a new empty list. Then I append the node value to the list at that depth and recurse into the left child before the right child with depth plus one. Because the left is always visited first, each level list fills from left to right. It is O(n) time and O(h) stack space instead of a queue.',
      },
    },
    {
      day: 13, week: 2, dow: 'Sat', type: 'revision', title: 'Revision — Week 2 (BFS + Bottom-up DFS)',
      theory: ['Bina dekhe re-solve: 102, 199, 543, 236', 'BFS template 3 minute me', 'Timer: Medium 25 min', 'System Design session'],
      qs: [102, 199, 543, 236],
      interview: {
        q: 'When do you choose BFS over DFS on a tree?',
        a: 'I choose BFS when the problem is about levels or distance from the root: level order, right side view, minimum depth, or the first node at a given depth, because BFS reaches nodes in order of depth and can stop early. I choose DFS when the answer is built from subtrees, like height, diameter, LCA or path sums, because recursion naturally returns information upward. Memory also matters: BFS uses O(width) and DFS uses O(height).',
      },
    },
    {
      day: 14, week: 2, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest',
      theory: ['30 min: Tum interviews Sohvi (LC 102 BFS bina dekhe)', '30 min: Sohvi interviews Tum (LC 236 brute → optimal)', '30 min: Contest discussion', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [102, 236],
      interview: {
        q: 'How do you test tree code during an interview?',
        a: 'I test the empty tree, a single node, and both skewed shapes — all left and all right — because they break null checks and recursion assumptions. Then I use a small complete tree to trace the normal case, and for BST problems I add a tree that looks valid locally but violates an ancestor bound. I walk through the code saying which call returns what, and I check that every child access is guarded by a null check.',
      },
    },
    {
      day: 15, week: 3, dow: 'Mon', type: 'learn', title: 'BST Property + Kth Smallest',
      theory: ['BST: left subtree < node < right subtree', 'Inorder of BST = sorted', 'Search/insert O(h)', 'Inorder list → get(k − 1)'],
      qs: [230],
      interview: {
        q: 'What is a binary search tree and why is it useful?',
        a: 'A binary search tree is a binary tree where every value in a node’s left subtree is smaller than the node and every value in its right subtree is larger. That ordering lets search, insert and delete discard one subtree at each step, so they take O(h) time — O(log n) when the tree is balanced, but O(n) if it degenerates into a chain. An inorder traversal returns the values in sorted order. Java’s TreeMap and TreeSet use a self-balancing red-black tree to guarantee O(log n).',
      },
    },
    {
      day: 16, week: 3, dow: 'Tue', type: 'learn', title: 'Validate BST (Range Bounds)',
      theory: ['Sirf parent se compare = galat', '(low, high) range neeche bhejo', 'long bounds — overflow/edge values', 'Inorder strictly increasing'],
      qs: [98],
      interview: {
        q: 'What is the most common mistake when validating a BST?',
        a: 'The most common mistake is comparing each node only with its direct children. A node deep in the right subtree can be larger than its parent but smaller than the root, which breaks the BST property even though every local check passes. The fix is to pass down the allowed range from all ancestors. A second mistake is using int bounds like Integer.MIN_VALUE, which fails when a node actually holds that value, so I use long bounds or nullable references.',
      },
    },
    {
      day: 17, week: 3, dow: 'Wed', type: 'learn', title: 'Iterative Inorder (Stack) — 230 & 98',
      theory: ['Left me jao + push', 'Pop = agla sorted value', 'cur = cur.right', 'Early stop: k-th ya pehli galti'],
      qs: [230, 98],
      interview: {
        q: 'Explain iterative inorder traversal.',
        a: 'I keep a stack and a current pointer. While current is not null I push it and move left, so the stack holds the path of nodes whose left side I am exploring. When I cannot go further left, I pop: that node is the next one in inorder. I visit it and then move to its right child and repeat. Each node is pushed and popped once, so it is O(n) time and O(h) space, and it lets me stop early, which is ideal for k-th smallest or for validating a BST.',
      },
    },
    {
      day: 18, week: 3, dow: 'Thu', type: 'learn', title: 'Bottom-up DFS Deep Dive: Height → Diameter',
      theory: ['Brute O(n²) kyun', 'Ek DFS me 2 cheezein', 'Height function = LC 104', 'Skewed tree pe complexity'],
      qs: [543, 104],
      interview: {
        q: 'Why is the brute-force diameter O(n²) and how do you fix it?',
        a: 'The brute force calls a height function at every node, and each height call walks the entire subtree. On a skewed tree the subtree sizes are n, n − 1, n − 2 and so on, which sums to O(n²). The fix is to notice that the height of every subtree is already computed while recursing, so I compute it once in a postorder traversal, update the best diameter with left plus right at each node, and return the height to the parent. That reduces it to O(n).',
      },
    },
    {
      day: 19, week: 3, dow: 'Fri', type: 'learn', title: 'Catch-up: LCA Brute vs Optimal + Same Tree Iterative',
      theory: ['Root-to-node path (backtracking)', 'Parent map + ancestor set', 'Optimal ek DFS', '100 iterative queue of pairs'],
      qs: [236, 100],
      interview: {
        q: 'How would you find the LCA if nodes had parent pointers?',
        a: 'With parent pointers, the problem becomes finding the intersection of two linked lists. I can walk up from p and store every ancestor in a set, then walk up from q until I hit a node in the set. To use O(1) space, I compute both depths, move the deeper node up by the difference, and then move both up together until they meet. Both approaches are O(h) time.',
      },
    },
    {
      day: 20, week: 3, dow: 'Sat', type: 'revision', title: 'Revision — Week 3 (BST + mixed)',
      theory: ['Bina dekhe re-solve: 98, 230, 543, 199', 'Inorder iterative 2 minute me', 'Last Minute tab: Signal → Pattern', 'System Design session'],
      qs: [98, 230, 543, 199],
      interview: {
        q: 'How would you find the k-th smallest element if the BST is modified frequently?',
        a: 'Repeated inorder traversals cost O(h + k) each time. Instead I would augment every node with the size of its subtree and keep it updated on insert and delete. Then, at each node, if the left subtree has exactly k − 1 nodes the current node is the answer; if it has at least k, I go left; otherwise I go right with k reduced by left size plus one. Each query becomes O(h), and with a balanced BST that is O(log n).',
      },
    },
    {
      day: 21, week: 3, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest + Phase Test',
      theory: ['30 min: Tum interviews Sohvi (LC 101 bina dekhe)', '30 min: Sohvi interviews Tum (LC 98 — trap test case ke saath)', '30 min: Contest discussion', 'Phase test: Last Minute tab ki saari one-liners bolo'],
      qs: [101, 98],
      interview: {
        q: 'Summarize the main tree patterns you know.',
        a: 'I group tree problems into four patterns. Bottom-up DFS returns information from children, like height, diameter or the LCA. Top-down DFS passes information down as parameters, like the depth or the allowed range when validating a BST. BFS with a queue processes the tree level by level for level order or right side view. And for BSTs, inorder traversal gives sorted order, which solves k-th smallest and validation. Two-tree recursion, used in Same Tree and Symmetric Tree, is a variation of DFS on pairs of nodes.',
      },
    },
  ],

  // ---------------- LAST MINUTE ----------------
  lastMinute: {
    triggers: [
      ['Height / max depth', 'Bottom-up DFS: 1 + max(l, r)'],
      ['Do trees compare / mirror', 'Two-tree recursion (pairs)'],
      ['Har node pe kuch badlo (invert)', 'Koi bhi traversal, har node ek baar'],
      ['Level wise / har level', 'BFS + size = q.size()'],
      ['Right / left side view', 'BFS last of level ya DFS right-first + depth'],
      ['Longest path between any two nodes', 'Height return + global best (l + r)'],
      ['Common ancestor', 'Bottom-up: dono side non-null → root'],
      ['BST + sorted / kth', 'Inorder (iterative stack, early stop)'],
      ['BST valid?', '(low, high) range with long'],
      ['Deep / skewed tree, stack overflow risk', 'Iterative (stack / queue)'],
    ],
    edge: [
      'Empty tree (root == null)',
      'Single node',
      'Skewed tree (sab left / sab right) → height = n',
      'Duplicate values (BST me strictly < / >)',
      'Node value = Integer.MIN_VALUE / MAX_VALUE (LC 98 → long)',
      'LCA: p khud q ka ancestor',
    ],
    mistakes: [
      'BFS me q.size() loop condition me likhna (size pehle save karo)',
      'node.left.val bina null check',
      'BST validate sirf parent-child compare se',
      'Diameter me nodes gin lena (edges chahiye)',
      'ArrayDeque me null offer karna → NullPointerException (LinkedList use karo)',
      'Global field (best/count) ko har call pe reset na karna (LeetCode same object reuse karta hai)',
      'LCA me node.val == p.val compare (reference compare: root == p)',
    ],
  },
};
