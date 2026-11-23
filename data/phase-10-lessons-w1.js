// Phase 10 (Graphs) — Week 1 lessons (local days 1–7). Day-1 format.
(function () {
  const P = window.PHASE_CONTENT['graphs'];
  P.lessons = P.lessons || {};
  Object.assign(P.lessons, {
    1: {
      title: 'Graph Basics + Grid as Graph (Flood Fill DFS)',
      goal: 'Graph kya hota hai (nodes, edges, directed/undirected), <b>grid ko graph</b> ki tarah dekhna, aur <b>DFS recursion + visited</b> se LC 733 Flood Fill solve karna.',
      main: 733,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 79, LC 104, LC 102',
          blocks: [
            { p: 'Graphs ke do hathiyaar — DFS aur BFS — tum pehle hi use kar chuke ho: trees me (Phase 7) aur Word Search me (Phase 9). Aaj unhe yaad karke graph pe le jaayenge.' },
            { h: '1) LC 79 Word Search (Phase 9)' },
            { p: '<b>Problem:</b> char grid me word 4-directional adjacent cells se banta hai kya (ek cell ek hi baar)?' },
            { pre: 'board = [[A,B,C,E],[S,F,C,S],[A,D,E,E]], word = "ABCCED" → true\nA(0,0) → B(0,1) → C(0,2) → C(1,2) → E(2,2) → D(2,1)' },
            { p: '<b>Pattern:</b> Grid DFS + backtracking (choose / explore / unchoose).' },
            { olist: [
              'Har cell se start try karo.',
              'dfs(r, c, i): i == word.length → true. Bahar / char match nahi → false.',
              'Cell ko <code>#</code> karo (visited), 4 directions me dfs(i + 1).',
              'Wapas aate waqt original char restore (unchoose).',
            ] },
            { code: `private boolean dfs(char[][] b, String w, int r, int c, int i) {
    if (i == w.length()) return true;
    if (r < 0 || r >= b.length || c < 0 || c >= b[0].length || b[r][c] != w.charAt(i)) return false;
    char t = b[r][c];
    b[r][c] = '#';
    boolean f = dfs(b, w, r + 1, c, i + 1) || dfs(b, w, r - 1, c, i + 1)
             || dfs(b, w, r, c + 1, i + 1) || dfs(b, w, r, c - 1, i + 1);
    b[r][c] = t;
    return f;
}` },
            { tip: 'Memory hook: <b>Word Search = grid DFS + mark # + restore.</b> Aaj Flood Fill me bhi grid DFS hai, bas restore nahi karna (fill permanent hai).' },
            { h: '2) LC 104 Maximum Depth of Binary Tree (Phase 7)' },
            { p: '<b>Problem:</b> root se sabse door leaf tak kitne nodes?' },
            { pre: 'root = [3,9,20,null,null,15,7] → 3' },
            { p: '<b>Pattern:</b> DFS recursion (postorder).' },
            { olist: ['null → 0.', 'Left ki depth, right ki depth nikalo.', '1 + max(left, right).'] },
            { code: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}` },
            { tip: 'Memory hook: <b>Tree DFS = base case + children pe recursion.</b> Graph DFS = same, bas children ki jagah neighbors + visited.' },
            { h: '3) LC 102 Binary Tree Level Order Traversal (Phase 7)' },
            { p: '<b>Problem:</b> tree ke nodes level by level list me.' },
            { pre: 'root = [3,9,20,null,null,15,7] → [[3],[9,20],[15,7]]' },
            { p: '<b>Pattern:</b> BFS + <code>q.size()</code> se level.' },
            { olist: ['Queue me root.', 'size = q.size() → itne nodes is level ke.', 'Poll karo, children offer karo.', 'Level list result me.'] },
            { code: `Deque<TreeNode> q = new ArrayDeque<>();
if (root != null) q.offer(root);
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
}` },
            { tip: 'Memory hook: <b>BFS = queue + size loop.</b> Yahi template LC 994 (Rotting Oranges) me minutes ginega.' },
          ],
        },
        {
          title: 'Part 1 — Concept: Graph kya hai, grid as graph, visited',
          blocks: [
            { p: '<b>Graph</b> = nodes (vertices) + edges (connections). Tree bhi graph hai — lekin tree me <b>cycle nahi</b> hota. Graph me cycle ho sakta hai, isliye <b>visited</b> zaroori hai.' },
            { pre: `Tree (no cycle)          Graph (cycle!)
     1                    0 ─── 1
    / \\                   │     │
   2   3                  3 ─── 2
                     0→1→2→3→0→1→… visited ke bina infinite loop` },
            { table: { head: ['Shabd', 'Matlab', 'Example'], rows: [
              ['Node / Vertex', 'Cheez', 'Grid ka cell, room, course'],
              ['Edge', 'Do nodes ka connection', 'Bagal wale cells, key, prerequisite'],
              ['Undirected', 'Dono taraf', 'Grid neighbors'],
              ['Directed', 'Ek taraf (a → b)', 'Room → key wala room, prerequisite → course'],
              ['Connected component', 'Jude hue nodes ka group', 'Island (LC 200)'],
            ] } },
            { p: '<b>Grid as graph:</b> m × n grid me cell <code>(r, c)</code> = node. Uske 4 neighbors = edges. Adjacency list banana hi nahi padta — <code>dirs</code> array se neighbors nikalte hain.' },
            { pre: `           (r-1, c)
              ↑
 (r, c-1) ← (r, c) → (r, c+1)
              ↓
           (r+1, c)

dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}}
valid: 0 <= nr < m  aur  0 <= nc < n` },
            { p: '<b>DFS on grid ka template</b> (aaj yahi use hoga):' },
            { code: `void dfs(int[][] g, int r, int c) {
    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length) return; // 1. bounds
    if (/* cell valid nahi ya visited */) return;                    // 2. condition
    // 3. mark visited
    dfs(g, r + 1, c);   // 4. chaaron directions
    dfs(g, r - 1, c);
    dfs(g, r, c + 1);
    dfs(g, r, c - 1);
}` },
            { tip: 'Order yaad rakho: <b>Bounds → Condition → Mark → Explore.</b> Bounds pehle, warna <code>g[r][c]</code> pe ArrayIndexOutOfBounds.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 733 Flood Fill',
          blocks: [{ problem: 733 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Paint bucket tool socho</b> (MS Paint): ek pixel pe click → us color ke saare jude pixels naye color me.' },
            { p: '<b>Brute soch:</b> "Har pixel check karo kya woh start se juda hai?" — par "juda hai" check karne ke liye bhi traversal chahiye. Toh seedha start se traversal hi sahi hai.' },
            { p: '<b>DFS approach:</b> start pixel ka original color <code>start</code> yaad rakho. <code>dfs(r, c)</code>:' },
            { olist: [
              'Grid ke bahar → return.',
              '<code>image[r][c] != start</code> → return (alag color, ya already recolor ho chuka).',
              '<code>image[r][c] = color</code> — ye recolor hi <b>visited mark</b> hai.',
              '4 directions me dfs.',
            ] },
            { p: '<b>Sabse bada trap:</b> agar <code>start == color</code>, toh recolor ke baad bhi cell "start" jaisa dikhega → dfs wapas usi cell pe aayega → <b>infinite recursion / StackOverflow</b>. Isliye shuru me hi check: <code>if (start != color) dfs(...)</code>.' },
            { p: '<b>BFS bhi chalega</b> (Day 4 me karenge): queue me start, poll karke neighbors recolor + offer. Time same O(m·n).' },
            { tip: 'Har pixel max ek baar recolor hota hai, aur har recolor pe 4 calls → total O(4·m·n) = O(m·n).' },
          ],
        },
        {
          title: 'Part 4 — Dry run: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2',
          blocks: [
            { p: 'start = image[1][1] = 1. 1 ≠ 2 → dfs(1,1). Directions order: neeche, upar, right, left.' },
            { table: { head: ['Call', 'Check', 'Kya hua', 'Recolor order'], rows: [
              ['dfs(1,1)', 'andar, =1', 'recolor', '#1 (1,1)'],
              ['→ dfs(2,1)', '=0 ≠ start', 'return', ''],
              ['→ dfs(0,1)', 'andar, =1', 'recolor', '#2 (0,1)'],
              ['&nbsp;&nbsp;→ dfs(1,1)', '=2 ≠ start', 'return (already filled)', ''],
              ['&nbsp;&nbsp;→ dfs(−1,1)', 'bahar', 'return', ''],
              ['&nbsp;&nbsp;→ dfs(0,2)', 'andar, =1', 'recolor; uske neighbors (1,2)=0, bahar, bahar, (0,1)=2 → sab return', '#3 (0,2)'],
              ['&nbsp;&nbsp;→ dfs(0,0)', 'andar, =1', 'recolor', '#4 (0,0)'],
              ['&nbsp;&nbsp;&nbsp;&nbsp;→ dfs(1,0)', 'andar, =1', 'recolor', '#5 (1,0)'],
              ['&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ dfs(2,0)', 'andar, =1', 'recolor; neighbors bahar / 2 / 0 / bahar', '#6 (2,0)'],
              ['→ dfs(1,2), dfs(1,0)', '=0 / =2', 'return', ''],
            ] } },
            { pre: `Pehle                 Baad
1 1 1                 2 2 2
1 1 0      →          2 2 0
1 0 1                 2 0 1   ← (2,2) diagonal se juda tha, 4-direction se nahi` },
            { p: 'Answer: <code>[[2,2,2],[2,2,0],[2,0,1]]</code> ✓ (visualizer bhi yahi 6-cell order dikhata hai).' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>DFS (Recursive)</b>' },
            { code: `class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int start = image[sr][sc];
        if (start != color) dfs(image, sr, sc, start, color);
        return image;
    }

    private void dfs(int[][] image, int r, int c, int start, int color) {
        if (r < 0 || r >= image.length || c < 0 || c >= image[0].length) return;
        if (image[r][c] != start) return;
        image[r][c] = color;
        dfs(image, r + 1, c, start, color);
        dfs(image, r - 1, c, start, color);
        dfs(image, r, c + 1, start, color);
        dfs(image, r, c - 1, start, color);
    }
}` },
            { lines: [
              ['int start = image[sr][sc];', 'Original color save karo — recolor ke baad image se nahi milega.'],
              ['if (start != color) dfs(...)', 'Same color pe dfs mat chalao — warna infinite recursion.'],
              ['if (r < 0 || r >= image.length ...) return;', 'Bounds check sabse pehle (index error se bachao).'],
              ['if (image[r][c] != start) return;', 'Alag color ya already filled → ruk jao. Yahi visited check hai.'],
              ['image[r][c] = color;', 'Recolor = visited mark. Ab ye cell dobara nahi khulega.'],
              ['dfs(image, r + 1, c, ...) × 4', 'Neeche, upar, right, left — 4-directional neighbors.'],
              ['return image;', 'In-place modify kiya, wahi array return.'],
            ] },
            { tip: 'Extra visited array nahi chahiye kyunki naya color ≠ start (humne check kar liya). Jab aisa guarantee na ho, <code>boolean[][] seen</code> lo.' },
          ],
        },
        {
          title: 'Part 6 — Visualize: DFS line-by-line',
          blocks: [
            { list: [
              '<b>CALL STACK</b> dekho: har dfs call ek naya frame. Gehrai badhti hai, fir frames pop hote hain (backtrack).',
              'Grid me <b>naya color</b> wala cell abhi recolor hua; skip = alag color / already filled.',
              'Example 2 chalao: start == color → dfs call hi nahi hota.',
              'Upar "BFS" tab bhi dekh lo — kal-parson detail me.',
            ] },
            { viz: 733, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[[0,0,0],[0,0,0]]</code>, (0,0), color 0', 'same', 'start == color → kuch nahi (infinite loop trap)'],
              ['<code>[[5]]</code>, (0,0), 7', '<code>[[7]]</code>', '1×1 grid'],
              ['<code>[[1,2],[2,1]]</code>, (0,0), 9', '<code>[[9,2],[2,1]]</code>', 'Diagonal judna count nahi'],
              ['50×50 sab 0, color 1', 'sab 1', 'Max size — recursion depth ~2500, theek hai'],
              ['Start cell border pe', 'bounds check sambhalta hai', 'r−1 = −1 pe return'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space', 'Note'], rows: [
              ['DFS recursive', 'O(m·n)', 'O(m·n) call stack (worst)', 'Short code'],
              ['BFS queue', 'O(m·n)', 'O(m·n) queue', 'No recursion'],
            ] } },
            { p: 'Har cell ek baar recolor, har recolor pe 4 neighbor checks → O(4·m·n) = O(m·n). Worst case (sab same color, snake shape) recursion depth m·n tak.' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Tree aur graph me sabse bada fark traversal ke liye?', 'Graph me cycle ho sakta hai, isliye visited marker chahiye. Tree me nahi.'],
              ['Grid me node aur edge kya hain?', 'Har cell node hai; 4-directional bagal wale cells se edges.'],
              ['Is problem me visited kahan hai?', 'Recolor hi visited hai — recolored cell ≠ start, toh dobara nahi khulta.'],
              ['<code>start == color</code> pe kya hoga agar check na karo?', 'Recolor ke baad bhi cell start jaisa → dfs wapas aata rahega → StackOverflowError.'],
              ['Bounds check condition se pehle kyun?', 'Warna <code>image[-1][c]</code> access pe ArrayIndexOutOfBoundsException.'],
              ['Diagonal neighbors kyun nahi?', 'Problem 4-directional bolta hai. 8-directional chahiye toh dirs me 4 diagonal add karo.'],
              ['Time complexity?', 'O(m·n) — har cell max ek baar fill.'],
              ['Recursion ki jagah kya use kar sakte ho?', 'BFS with queue, ya explicit stack se iterative DFS.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'I treat the image as a graph where each pixel is a node connected to its four neighbours. I remember the original color of the starting pixel and run a DFS from it. In each call I return if I am out of bounds or the pixel is not the original color; otherwise I recolor it and recurse in four directions. The recoloring itself works as the visited marker. Each pixel is recolored at most once, so the time is O(m·n) and the recursion depth is at most O(m·n).'],
              ['Follow-up: "start color aur new color same ho toh?"', 'Then nothing needs to change, and I must return immediately. If I did not, a recolored pixel would still look like the original color, the DFS would keep revisiting it and the recursion would never end, causing a stack overflow.'],
              ['Follow-up: "Image bahut badi ho toh?"', 'Recursive DFS could overflow the call stack for very large connected regions. I would switch to BFS with an ArrayDeque or an iterative DFS with an explicit stack, which keeps the frontier on the heap. Complexity stays O(m·n).'],
              ['1-minute: Graph kya hai, grid graph kaise?', 'A graph is a set of nodes connected by edges, which can be directed or undirected. A grid is an implicit graph: every cell is a node and it has edges to its up, down, left and right neighbours, so I never build an adjacency list — I compute neighbours with a directions array and a bounds check. Any traversal on it visits each cell a constant number of times, so it runs in O(m·n). The key extra piece compared to trees is a visited marker, because graphs can have cycles.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Paper pe 3×3 grid banao (Example 1), har cell pe (r, c) likho.',
              'Ek cell ke 4 neighbors arrows se dikhao. Corner cell ke kitne valid neighbors hain? (2)',
              'Part 4 jaisa dry-run khud karo — recolor order 1 se 6 tak number likho.',
              'DFS code bina notes ke likho aur LeetCode pe submit karo.',
              'Visualizer me CALL STACK ko dekh ke batao: sabse gehra stack kitne frames ka gaya?',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> DFS + BFS dono memory se, 12 minute me. Submit both.',
              '<b>Task B:</b> 8-directional flood fill ke liye kya badlega — dirs likho.',
              '<b>Task C:</b> Part 10 ka "Approach explain karo" 90 sec me bolo (timer).',
              '<b>Task D:</b> Follow-up socho: same color pe recursion kyun infinite? Interviewer ko 2 line me explain karo.',
              '<b>Task E:</b> Fundamentals tab ka "Graph representations" padho — kal adjacency list hai.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 733 dono approaches se Accepted.',
              'Fundamentals tab: "Graph kya hai" + "Grid as Graph" padho.',
              'Kal (Day 2): adjacency list + LC 841 Keys and Rooms — problem pehle padh lo.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Grid DFS ke 4 steps order me?', 'Bounds → condition (start color?) → mark (recolor) → 4 directions.'],
              ['Example 3 <code>[[0,0,0],[0,1,0]]</code>, (0,0), 3 ka answer?', '<code>[[3,3,3],[3,1,3]]</code>'],
              ['start == color ka trap?', 'Infinite recursion — isliye pehle hi return.'],
              ['Time / space?', 'O(m·n) / O(m·n) recursion stack worst case.'],
              ['dirs array likho.', '<code>{{1,0},{-1,0},{0,1},{0,-1}}</code>'],
            ] },
          ],
        },
      ],
      checks: [
        'Graph, node, edge, directed/undirected apne shabdon me samjha sakta/sakti hu',
        'Grid ko graph ki tarah dekh ke 4 neighbors nikaal sakta/sakti hu',
        'Flood Fill DFS bina dekhe likha aur Accepted',
        'start == color trap explain kar sakta/sakti hu',
        'Example 1 ka dry run (6 cells ka order) khud banaya',
        'Visualizer me CALL STACK dekha',
        '8 chhote sawaal + 5 self-test sahi',
      ],
      memory: 'Grid DFS: Bounds → Condition → Mark → 4 directions. Same color pe dfs mat chalao.',
    },

    2: {
      title: 'Adjacency List + BFS/DFS on a Graph',
      goal: 'Graph ko memory me rakhna (<b>edge list, adjacency matrix, adjacency list</b>), Java me <code>List&lt;List&lt;Integer&gt;&gt;</code>, <b>boolean[] seen</b>, aur LC 841 Keys and Rooms ko BFS + DFS se solve karna.',
      main: 841,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 733, LC 226, LC 1',
          blocks: [
            { h: '1) LC 733 Flood Fill (kal)' },
            { p: '<b>Problem:</b> start pixel se jude same-color pixels ko naya color.' },
            { pre: '[[1,1,1],[1,1,0],[1,0,1]], (1,1), 2 → [[2,2,2],[2,2,0],[2,0,1]]' },
            { p: '<b>Pattern:</b> Grid flood fill DFS.' },
            { olist: ['start = original color; start == color → return.', 'dfs: bounds → != start → recolor → 4 directions.'] },
            { code: `private void dfs(int[][] img, int r, int c, int start, int color) {
    if (r < 0 || r >= img.length || c < 0 || c >= img[0].length) return;
    if (img[r][c] != start) return;
    img[r][c] = color;
    dfs(img, r + 1, c, start, color); dfs(img, r - 1, c, start, color);
    dfs(img, r, c + 1, start, color); dfs(img, r, c - 1, start, color);
}` },
            { tip: 'Memory hook: <b>Paint bucket — recolor hi visited.</b>' },
            { h: '2) LC 226 Invert Binary Tree (Phase 7)' },
            { p: '<b>Problem:</b> har node ke left aur right swap karo.' },
            { pre: '[4,2,7,1,3,6,9] → [4,7,2,9,6,3,1]' },
            { p: '<b>Pattern:</b> DFS recursion.' },
            { olist: ['null → null.', 'Left aur right ko recursively invert karo.', 'Swap karke root return.'] },
            { code: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode left = invertTree(root.left);
    root.left = invertTree(root.right);
    root.right = left;
    return root;
}` },
            { tip: 'Memory hook: <b>Har node pe mirror — DFS sab nodes ek baar.</b>' },
            { h: '3) LC 1 Two Sum (Phase 1)' },
            { p: '<b>Problem:</b> do indices jinka sum target.' },
            { pre: '[2,7,11,15], target 9 → [0,1]' },
            { p: '<b>Pattern:</b> HashMap value → index.' },
            { olist: ['need = target − x.', 'Map me need hai → answer.', 'Warna put(x, i).'] },
            { code: `Map<Integer, Integer> map = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (map.containsKey(need)) return new int[]{map.get(need), i};
    map.put(nums[i], i);
}` },
            { tip: 'Memory hook: <b>Pehle check, fir put.</b> HashMap jaisa hi aaj <code>seen[]</code> "pehle dekha?" ka jawab dega.' },
          ],
        },
        {
          title: 'Part 1 — Concept: Graph representations + adjacency list in Java',
          blocks: [
            { p: 'Same directed graph: <code>0→1, 0→2, 1→3, 2→3</code>. Teen tarike se store kar sakte hain:' },
            { pre: `Edge list:   [[0,1],[0,2],[1,3],[2,3]]

Matrix:          0 1 2 3          Adjacency list:
             0 [ 0 1 1 0 ]          0 → [1, 2]
             1 [ 0 0 0 1 ]          1 → [3]
             2 [ 0 0 0 1 ]          2 → [3]
             3 [ 0 0 0 0 ]          3 → []` },
            { table: { head: ['', 'Adjacency list', 'Matrix', 'Edge list'], rows: [
              ['Space', '<b>O(V + E)</b>', 'O(V²)', 'O(E)'],
              ['u ke neighbors', 'O(deg u)', 'O(V)', 'O(E)'],
              ['a–b edge hai?', 'O(deg a)', '<b>O(1)</b>', 'O(E)'],
              ['Interview me', '<b>Default</b>', 'Dense / chhota V', 'Input format'],
            ] } },
            { p: '<b>Java me adjacency list:</b>' },
            { code: `List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());   // har node ki khaali list
for (int[] e : edges) {
    adj.get(e[0]).add(e[1]);        // directed a -> b
    // adj.get(e[1]).add(e[0]);     // undirected ho toh ye bhi
}
for (int v : adj.get(u)) { /* u ke neighbors */ }` },
            { p: '<b>LC 841 me</b> <code>rooms</code> already <code>List&lt;List&lt;Integer&gt;&gt;</code> hai = adjacency list! <code>rooms.get(i)</code> = room i se kin rooms ki taraf edge (keys).' },
            { pre: `rooms = [[1,3],[3,0,1],[2],[0]]

R0 → R1, R3
R1 → R3, R0, R1
R2 → R2        (khud ki key — bekaar)
R3 → R0
Room 0 se R2 tak koi edge nahi aata → false` },
            { tip: '<b>Visited for nodes 0..n−1:</b> <code>boolean[] seen = new boolean[n];</code> — HashSet se fast aur simple.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 841 Keys and Rooms',
          blocks: [{ problem: 841 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute soch:</b> "Baar-baar saare khule rooms ki keys dekho, jab tak naya room khulna band na ho." Har round O(N + K), rounds N tak → O(N·(N + K)). Kaam karta hai, par same rooms baar-baar padhte ho.' },
            { p: '<b>Optimal:</b> Ye seedha <b>reachability</b> hai — "node 0 se kaun-kaun se nodes reach ho sakte hain?" Ek traversal (BFS/DFS) + visited, har room ek hi baar.' },
            { olist: [
              '<code>seen[0] = true</code>, room 0 se shuru.',
              'Room ki har key: agar woh room <code>seen</code> nahi → mark karo aur explore karo.',
              'End me: saare <code>seen</code> true? (ya visited count == n)',
            ] },
            { table: { head: ['', 'DFS', 'BFS'], rows: [
              ['Kaise', 'dfs(key) recursion', 'queue me key'],
              ['Mark kab', 'dfs ke andar shuru me', '<b>offer karte waqt</b>'],
              ['Answer check', 'seen[] loop', 'visited == n'],
            ] } },
            { tip: 'BFS me <b>push karte waqt mark</b> — warna room 3 do baar queue me (room 0 aur room 1 dono ke paas key 3 hai).' },
          ],
        },
        {
          title: 'Part 4 — Dry run: rooms = [[1,3],[3,0,1],[2],[0]] (BFS)',
          blocks: [
            { table: { head: ['Step', 'room (poll)', 'Keys', 'Naye rooms', 'q after', 'seen', 'visited'], rows: [
              ['init', '—', '—', '0', '[0]', '[T,F,F,F]', '1'],
              ['1', '0', '1, 3', '1, 3', '[1, 3]', '[T,T,F,T]', '3'],
              ['2', '1', '3, 0, 1', '— (sab seen)', '[3]', '[T,T,F,T]', '3'],
              ['3', '3', '0', '—', '[]', '[T,T,F,T]', '3'],
            ] } },
            { p: 'Queue khaali. visited = 3 ≠ n = 4 → <b>false</b>. Room 2 ki key sirf room 2 me thi.' },
            { p: '<b>Example 1</b> <code>[[1],[2],[3],[]]</code>: q [0] → poll 0 → key 1 → poll 1 → key 2 → poll 2 → key 3 → poll 3. visited = 4 = n → <b>true</b>.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>BFS (Queue)</b>' },
            { code: `class Solution {
    public boolean canVisitAllRooms(List<List<Integer>> rooms) {
        int n = rooms.size();
        boolean[] seen = new boolean[n];
        Deque<Integer> q = new ArrayDeque<>();
        q.offer(0);
        seen[0] = true;
        int visited = 1;
        while (!q.isEmpty()) {
            int room = q.poll();
            for (int key : rooms.get(room)) {
                if (!seen[key]) {
                    seen[key] = true;
                    visited++;
                    q.offer(key);
                }
            }
        }
        return visited == n;
    }
}` },
            { lines: [
              ['boolean[] seen = new boolean[n];', 'Kaunse rooms khul chuke — visited array.'],
              ['q.offer(0); seen[0] = true;', 'Room 0 unlocked hai — source.'],
              ['int visited = 1;', 'Khule rooms ki ginti (end me seen loop ki zaroorat nahi).'],
              ['int room = q.poll();', 'Agla khula room jiski keys dekhni hain.'],
              ['for (int key : rooms.get(room))', 'Adjacency list: room ke neighbors = keys.'],
              ['if (!seen[key]) { seen[key] = true; ... q.offer(key); }', 'Naya room → push karte waqt mark.'],
              ['return visited == n;', 'Saare rooms khule?'],
            ] },
            { p: '<b>DFS (Recursive)</b>' },
            { code: `class Solution {
    public boolean canVisitAllRooms(List<List<Integer>> rooms) {
        boolean[] seen = new boolean[rooms.size()];
        dfs(rooms, 0, seen);
        for (boolean s : seen) {
            if (!s) return false;
        }
        return true;
    }

    private void dfs(List<List<Integer>> rooms, int room, boolean[] seen) {
        seen[room] = true;
        for (int key : rooms.get(room)) {
            if (!seen[key]) dfs(rooms, key, seen);
        }
    }
}` },
          ],
        },
        {
          title: 'Part 6 — Visualize: graph + queue + seen',
          blocks: [
            { list: [
              'Graph view me R0..Rn nodes; arrow = "is room me us room ki key".',
              'Queue view: front se poll, back me offer.',
              '<code>seen</code> array me T kab hota hai — <b>offer ke saath</b>.',
              'Example 2 me R2 end me skip (laal) rehta hai.',
              'Upar "DFS" tab: CALL STACK me dfs frames.',
            ] },
            { viz: 841, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[[1],[]]</code>', 'true', 'n = 2, seedha'],
              ['<code>[[],[0]]</code>', 'false', 'Room 0 khaali — kuch nahi khulta'],
              ['<code>[[0,1],[1]]</code>', 'true', 'Self-key (0 me 0) — seen se ignore'],
              ['<code>[[2],[],[1]]</code>', 'true', 'Order matter nahi: 0 → 2 → 1'],
              ['<code>[[1],[0],[]]</code>', 'false', 'Cycle 0 ⇄ 1, room 2 unreachable — visited cycle ko rokta hai'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute (repeat until no change)', 'O(N·(N + K))', 'O(N)'],
              ['BFS', 'O(N + K)', 'O(N) seen + queue'],
              ['DFS', 'O(N + K)', 'O(N) seen + recursion'],
            ] } },
            { p: 'N = rooms (V), K = total keys (E). Har room ek baar poll, har key ek baar padhi → <b>O(V + E)</b> — graph traversal ki standard complexity.' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Is problem me graph kya hai?', 'Rooms = nodes, room i me room j ki key = directed edge i → j.'],
              ['rooms ko adjacency list kyun keh sakte hain?', 'rooms.get(i) seedha room i ke neighbors ki list hai.'],
              ['Adjacency list ki space?', 'O(V + E).'],
              ['Matrix kab better?', 'Dense graph / chhota V, jab O(1) edge check chahiye.'],
              ['BFS me visited kab mark karte ho, kyun?', 'Offer karte waqt — taaki ek node queue me do baar na aaye.'],
              ['Cycle (0 ⇄ 1) se infinite loop kyun nahi hota?', 'seen[] already true hai, toh dobara push nahi hota.'],
              ['Directed ya undirected?', 'Directed — key i → j ka matlab j se i nahi khulta.'],
              ['Time complexity?', 'O(N + K) — har room aur har key ek baar.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'The rooms list is already an adjacency list: room i has directed edges to the rooms its keys open. The question is whether every node is reachable from node 0, so I run a BFS from room 0 with a boolean visited array. I mark a room as visited when I enqueue it and count how many rooms I have opened. At the end I compare that count with n. Each room is dequeued once and each key is read once, so it is O(N + K) time and O(N) space.'],
              ['Follow-up: "DFS se karo"', 'A recursive DFS works the same way: mark the current room, then recurse into every key whose room is not visited yet. After the DFS from room 0, I scan the visited array and return false if any room is unvisited. The complexity is unchanged; the only risk is recursion depth up to N, which is fine for N up to 1000.'],
              ['Follow-up: "Minimum kitne rooms ghus ke sab khulenge?" type twist', 'If the question became the minimum number of steps to reach a room, I would use BFS level by level, because BFS explores nodes in order of distance from the source in an unweighted graph.'],
              ['1-minute: Adjacency list vs matrix', 'An adjacency list stores, for every node, the list of its neighbours, so it takes O(V + E) space and iterating neighbours costs only the node\'s degree. An adjacency matrix is a V by V table: O(V squared) space, but checking whether a specific edge exists is O(1). Most interview graphs are sparse, so I default to List<List<Integer>> in Java. I would pick a matrix only for small dense graphs or when I need constant-time edge lookups.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Example 2 ka graph paper pe banao: circles R0–R3, arrows keys ke.',
              'Edge list <code>[[0,1],[0,2],[1,3],[2,3]]</code> se adjacency list haath se likho.',
              'Part 4 jaisi BFS table khud banao (queue + seen columns).',
              'BFS code bina notes ke likho, submit karo.',
              'Batao: room 2 kyun nahi khula? (Uski key sirf usi ke andar.)',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> BFS + DFS dono memory se, 10 minute.',
              '<b>Task B:</b> Iterative DFS (explicit <code>Deque</code> stack) se bhi likho — kya change hua?',
              '<b>Task C:</b> Edge list → undirected adjacency list ka code 1 minute me likho.',
              '<b>Task D:</b> "Adjacency list vs matrix" 1-minute answer bolke record karo.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 841 BFS + DFS Accepted.',
              'Fundamentals tab: Representations + Java Cheat Sheet.',
              'Kal (Day 3): LC 200 Number of Islands — connected components.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>List&lt;List&lt;Integer&gt;&gt;</code> adjacency list banane ki 2 lines?', '<code>for (i..n) adj.add(new ArrayList&lt;&gt;());</code> aur <code>for (e : edges) adj.get(e[0]).add(e[1]);</code>'],
              ['<code>[[1,3],[3,0,1],[2],[0]]</code> answer?', 'false (room 2 unreachable).'],
              ['BFS mark rule?', 'Push karte waqt visited.'],
              ['Traversal complexity?', 'O(V + E).'],
              ['Undirected edge add kaise?', 'Dono taraf: adj[a].add(b), adj[b].add(a).'],
            ] },
          ],
        },
      ],
      checks: [
        'Edge list, matrix, adjacency list ka fark aur space bata sakta/sakti hu',
        'Java me adjacency list bana sakta/sakti hu',
        'LC 841 BFS bina dekhe Accepted',
        'LC 841 DFS bhi likha',
        'BFS me push pe mark kyun — samjha',
        'Example 2 ka dry run table banaya',
        'Visualizer me graph + queue dekha',
      ],
      memory: 'Reachability = source se BFS/DFS + seen[]; end me sab seen? O(V + E).',
    },
  });
})();
(function () {
  const P = window.PHASE_CONTENT['graphs'];
  P.lessons = P.lessons || {};
  Object.assign(P.lessons, {
    3: {
      title: 'Connected Components in a Grid (Islands, DFS)',
      goal: '<b>Connected components</b> ginna: grid scan + har naye land cell se DFS "sink". LC 200 Number of Islands ko DFS se solve karna, aur in-place mark vs <code>visited[][]</code> samajhna.',
      main: 200,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 841, LC 78, LC 141',
          blocks: [
            { h: '1) LC 841 Keys and Rooms (kal)' },
            { p: '<b>Problem:</b> room 0 se saare rooms khul sakte hain?' },
            { pre: '[[1],[2],[3],[]] → true · [[1,3],[3,0,1],[2],[0]] → false' },
            { p: '<b>Pattern:</b> Reachability — BFS/DFS + seen.' },
            { olist: ['seen[0] = true, q [0].', 'Poll → har key: !seen → mark + offer, visited++.', 'visited == n.'] },
            { code: `while (!q.isEmpty()) {
    int room = q.poll();
    for (int key : rooms.get(room)) {
        if (!seen[key]) { seen[key] = true; visited++; q.offer(key); }
    }
}
return visited == n;` },
            { tip: 'Memory hook: <b>rooms = adjacency list. Source 0 se BFS, end me count.</b>' },
            { h: '2) LC 78 Subsets (Phase 9)' },
            { p: '<b>Problem:</b> distinct nums ke saare subsets.' },
            { pre: '[1,2,3] → [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]' },
            { p: '<b>Pattern:</b> Backtracking (choose / explore / unchoose).' },
            { olist: ['Har call pe current path ko result me add.', 'i = start..n−1: add nums[i], recurse(i + 1), remove.'] },
            { code: `private void bt(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        bt(nums, i + 1, path, res);
        path.remove(path.size() - 1);
    }
}` },
            { tip: 'Memory hook: <b>Backtracking = DFS on a decision tree.</b> Graph DFS bhi wahi recursion hai, bas undo nahi karte (visited permanent).' },
            { h: '3) LC 141 Linked List Cycle (Phase 4)' },
            { p: '<b>Problem:</b> list me cycle hai?' },
            { pre: '3 → 2 → 0 → −4 → (wapas 2) → true' },
            { p: '<b>Pattern:</b> Floyd slow/fast pointers.' },
            { olist: ['slow 1 step, fast 2 step.', 'Mil gaye → cycle. fast null → no cycle.'] },
            { code: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;
}
return false;` },
            { tip: 'Memory hook: <b>Linked list = graph jisme har node ka ek hi next.</b> Cycle ki baat Week 2 me graph pe bhi aayegi (LC 207).' },
          ],
        },
        {
          title: 'Part 1 — Concept: Connected components + DFS sink',
          blocks: [
            { p: '<b>Connected component</b> = nodes ka aisa group jisme har node baaki sab tak pahunch sake, aur group ke bahar kisi se juda na ho. Grid me land ka har component = ek <b>island</b>.' },
            { pre: `1 1 0 0 0        A A . . .
1 1 0 0 0        A A . . .
0 0 1 0 0   →    . . B . .      3 components: A, B, C
0 0 0 1 1        . . . C C` },
            { p: '<b>Components ginne ka universal template:</b>' },
            { code: `int count = 0;
for (har node u) {
    if (u visited nahi) {
        count++;          // naya component mila
        dfs(u);           // uska poora component mark
    }
}` },
            { table: { head: ['Visited ka tarika', 'Kaise', 'Pro / Con'], rows: [
              ['In-place sink', "<code>grid[r][c] = '0'</code>", 'Extra space nahi / input badal jaata hai'],
              ['visited[][]', '<code>boolean[][] seen</code>', 'Input safe / O(m·n) extra'],
              ['Alag mark', "<code>grid[r][c] = '2'</code>", 'Baad me restore kar sakte ho'],
            ] } },
            { tip: '<code>grid</code> <b>char[][]</b> hai — compare <code>\'1\'</code> se, <code>1</code> se nahi (char \'1\' = 49).' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 200 Number of Islands',
          blocks: [{ problem: 200 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Galat soch:</b> "Har \'1\' ek island" — nahi, jude hue 1s ek hi island hain.' },
            { p: '<b>Brute soch:</b> har land cell ke liye check karo kya woh kisi pichle gine island se juda hai — har baar naya traversal → O((m·n)²).' },
            { p: '<b>Optimal:</b> Jab pehla \'1\' mile, ek DFS se <b>poora island ek saath</b> mark (sink) kar do. Ab scan aage badhega toh us island ka koi cell dobara \'1\' nahi dikhega. Har naya \'1\' = naya island.' },
            { olist: [
              'r, c double loop se har cell.',
              "<code>grid[r][c] == '1'</code> → <code>count++</code>, <code>dfs(r, c)</code>.",
              "dfs: bounds → <code>!= '1'</code> return → <code>'0'</code> karo → 4 directions.",
              'return count.',
            ] },
            { tip: 'Ye LC 733 ka hi code hai + bahar ek scan loop. <b>Flood fill × har unvisited start = components.</b>' },
          ],
        },
        {
          title: 'Part 4 — Dry run: Example 2 (answer 3)',
          blocks: [
            { pre: `     c0 c1 c2 c3 c4
r0 [ 1  1  0  0  0 ]
r1 [ 1  1  0  0  0 ]
r2 [ 0  0  1  0  0 ]
r3 [ 0  0  0  1  1 ]` },
            { table: { head: ['Scan cell', "== '1'?", 'count', 'DFS ne sink kiya (order)'], rows: [
              ['(0,0)', 'haan', '1', '(0,0) → (1,0) → (1,1) → (0,1)'],
              ['(0,1)…(2,1)', "nahi (sink ho chuke / '0')", '1', '—'],
              ['(2,2)', 'haan', '2', '(2,2)'],
              ['(2,3)…(3,2)', 'nahi', '2', '—'],
              ['(3,3)', 'haan', '3', '(3,3) → (3,4)'],
              ['(3,4)', "nahi (sunk)", '3', '—'],
            ] } },
            { p: 'dfs(0,0) ke andar: neeche (1,0) ✓ → uska neeche (2,0)=0, upar (0,0) sunk, right (1,1) ✓ → uska upar (0,1) ✓. Directions order neeche, upar, right, left.' },
            { p: 'Answer: <b>3</b> ✓' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { code: `class Solution {
    public int numIslands(char[][] grid) {
        int m = grid.length, n = grid[0].length, count = 0;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }

    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;
        if (grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}` },
            { lines: [
              ['for r, for c', 'Har cell ek baar scan — koi island miss na ho.'],
              ["if (grid[r][c] == '1')", 'Abhi tak unsunk land = naye island ki shuruaat.'],
              ['count++; dfs(grid, r, c);', 'Ginti badhao, fir poora island sink.'],
              ['bounds check', 'Bahar gaye toh return.'],
              ["if (grid[r][c] != '1') return;", "Paani ya already sunk → ruk jao."],
              ["grid[r][c] = '0';", 'Sink = visited. Recursion se pehle karo, warna neighbors wapas aa jaayenge.'],
              ['4 × dfs', 'Saare 4-directional neighbors.'],
            ] },
            { tip: 'Input modify nahi karna? <code>boolean[][] seen</code> lo aur condition <code>grid[r][c] != \'1\' || seen[r][c]</code>.' },
          ],
        },
        {
          title: 'Part 6 — Visualize: scan + DFS sink',
          blocks: [
            { list: [
              '<b>found</b> = naya island ka pehla cell (count++).',
              'Sink kiye cells hare (done) ho jaate hain aur value \'0\'.',
              'CALL STACK me numIslands → dfs → dfs … gehrai dekho.',
              'Example 1 me ek hi DFS 9 cells sink karta hai → count 1.',
            ] },
            { viz: 200, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[["0"]]</code>', '0', 'Sirf paani'],
              ['<code>[["1"]]</code>', '1', '1×1 land'],
              ['<code>101 / 010 / 101</code>', '5', 'Diagonal judna count nahi'],
              ['<code>111 / 101 / 111</code>', '1', 'Ring = ek island (beech me lake)'],
              ['300×300 sab "1"', '1', 'Recursion depth 90,000 — local JVM pe StackOverflow aaya (test kiya); LeetCode pe pass hota hai, par BFS safe hai (Day 4)'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute (har land ke liye fresh check)', 'O((m·n)²)', 'O(m·n)'],
              ['DFS sink', 'O(m·n)', 'O(m·n) recursion worst'],
              ['BFS (kal)', 'O(m·n)', 'O(min(m, n)) queue frontier'],
            ] } },
            { p: 'Scan m·n + har land cell ek baar sink (4 calls) → O(m·n).' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Island graph terms me kya hai?', 'Land cells ka connected component.'],
              ['count++ kab hota hai?', "Jab scan me unsunk '1' mile — har component ka pehla cell."],
              ['Sink kyun karte ho?', 'Visited mark — taaki same island dobara na gine.'],
              ["<code>grid[r][c] == 1</code> likh diya toh?", "Hamesha false (char '1' = 49) → answer 0. '1' likho."],
              ['Mark recursion se pehle kyun?', 'Warna neighbor wapas is cell pe aake infinite recursion.'],
              ['Input modify nahi karna ho toh?', 'boolean[][] visited, O(m·n) extra.'],
              ['Worst-case recursion depth?', 'm·n (poora grid ek snake island).'],
              ['Time?', 'O(m·n).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'Each island is a connected component of land cells in a grid graph. I scan every cell; when I find a land cell that has not been visited, I increment the island count and run a DFS from it that sinks every connected land cell to "0". Because the whole island is sunk at once, later cells of the same island are never counted again. Each cell is processed a constant number of times, so the time is O(m·n), and the recursion depth is O(m·n) in the worst case.'],
              ['Follow-up: "Input change nahi karna"', 'I would keep a separate boolean visited matrix and treat a cell as unvisited land only when it is "1" and not visited. That costs O(m·n) extra space but leaves the grid intact. Alternatively, I could mark with a temporary character and restore the grid at the end.'],
              ['Follow-up: "Grid bahut bada hai"', 'A recursive DFS on a huge all-land grid can exceed the JVM stack — I actually saw a StackOverflowError for a 300 by 300 all-land grid on the default stack. I would switch to BFS with a queue or an explicit stack, or use Union-Find if the grid arrives incrementally.'],
              ['1-minute: Connected components kaise ginte ho', 'I loop over every node; whenever I find one that is not yet visited, that is a new component, so I increment the counter and run a DFS or BFS from it that marks everything reachable. Nodes already marked are skipped, so each node and edge is processed once and the total cost is O(V + E). In a grid like Number of Islands the nodes are land cells and I can mark them by sinking them in place, or use a separate visited matrix if the input must stay unchanged.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Example 2 paper pe banao aur islands ko A, B, C rang do.',
              'Ek naya 4×4 grid khud banao jisme 4 islands hon — ginti karo.',
              'Part 4 ki table khud bharo.',
              'DFS code likho (Flood Fill se copy-modify karo!) aur submit.',
              'Batao: diagonal 1s alag island kyun hain?',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> DFS sink version 8 minute me memory se.',
              '<b>Task B:</b> visited[][] wala version (input unchanged) likho.',
              '<b>Task C:</b> "Largest island ka size" chahiye ho toh dfs kya return karega? (int size) — code sketch karo (koi naya problem submit nahi).',
              '<b>Task D:</b> Follow-ups (bada grid, immutable input) ke answers 60 sec each bolo.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 200 DFS Accepted.',
              'Kal (Day 4): BFS version of LC 200 + LC 733 — queue template revise karo (Part 0 Day 1 ka LC 102 code).',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Components ginne ka template?', 'Har unvisited node pe count++ aur DFS se uska component mark.'],
              ['<code>101/010/101</code> me kitne islands?', '5'],
              ["Char compare kaise?", "<code>grid[r][c] == '1'</code>"],
              ['Time / space?', 'O(m·n) / O(m·n) recursion.'],
              ['Input safe rakhne ka tarika?', 'boolean[][] visited.'],
            ] },
          ],
        },
      ],
      checks: [
        'Connected component ka matlab bata sakta/sakti hu',
        'Scan + DFS sink template likh sakta/sakti hu',
        'LC 200 DFS Accepted',
        'Example 2 dry run khud kiya',
        "char '1' vs int 1 ka bug samjha",
        'visited[][] version bhi pata hai',
        'Visualizer me sinking dekha',
      ],
      memory: "Naya '1' = count++ + poora island sink. Flood fill × har unvisited start = components.",
    },

    4: {
      title: 'BFS vs DFS (Islands + Flood Fill with a Queue)',
      goal: 'Same problems ka <b>doosra approach</b>: BFS with queue. LC 200 aur LC 733 dono BFS se, <b>push pe mark</b> rule, aur kab BFS / kab DFS — interview me trade-off bolna.',
      main: 200,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 200 (DFS), LC 199, LC 3',
          blocks: [
            { h: '1) LC 200 Number of Islands — DFS (kal)' },
            { p: '<b>Problem:</b> grid me islands ginna.' },
            { pre: '11000 / 11000 / 00100 / 00011 → 3' },
            { p: '<b>Pattern:</b> Components — scan + DFS sink.' },
            { olist: ["'1' mila → count++ + dfs.", "dfs: bounds → != '1' → '0' → 4 directions."] },
            { code: `for (int r = 0; r < m; r++)
    for (int c = 0; c < n; c++)
        if (grid[r][c] == '1') { count++; dfs(grid, r, c); }` },
            { tip: 'Memory hook: <b>Naya 1 = naya island, sink kar do.</b>' },
            { h: '2) LC 199 Binary Tree Right Side View (Phase 7)' },
            { p: '<b>Problem:</b> right side se dikhne wale nodes (har level ka last).' },
            { pre: '[1,2,3,null,5,null,4] → [1,3,4]' },
            { p: '<b>Pattern:</b> BFS level by level.' },
            { olist: ['size = q.size().', 'i == size − 1 wala node result me.', 'Children offer.'] },
            { code: `while (!q.isEmpty()) {
    int size = q.size();
    for (int i = 0; i < size; i++) {
        TreeNode node = q.poll();
        if (i == size - 1) res.add(node.val);
        if (node.left != null) q.offer(node.left);
        if (node.right != null) q.offer(node.right);
    }
}` },
            { tip: 'Memory hook: <b>Level ka last = right view.</b> Aaj yahi queue grid pe.' },
            { h: '3) LC 3 Longest Substring Without Repeating Characters (Phase 3)' },
            { p: '<b>Problem:</b> bina repeat wala sabse lamba substring.' },
            { pre: '"abcabcbb" → 3 ("abc")' },
            { p: '<b>Pattern:</b> Variable sliding window + last index map.' },
            { olist: ['r badhao.', 'Char pehle window me tha → l = max(l, last + 1).', 'best = max(best, r − l + 1).'] },
            { code: `Map<Character, Integer> last = new HashMap<>();
int l = 0, best = 0;
for (int r = 0; r < s.length(); r++) {
    char ch = s.charAt(r);
    if (last.containsKey(ch)) l = Math.max(l, last.get(ch) + 1);
    last.put(ch, r);
    best = Math.max(best, r - l + 1);
}` },
            { tip: 'Memory hook: <b>Repeat mila → l ko jump karao, peeche kabhi nahi.</b>' },
          ],
        },
        {
          title: 'Part 1 — Concept: BFS vs DFS, push pe mark',
          blocks: [
            { pre: `Grid me start S se kaun pehle visit hota hai?

BFS (paani ki lehar)        DFS (ek gali end tak)
 2 1 2                       1 2 3
 1 S 1                       S . 4
 2 1 2                       . . 5 …
distance ke order me         ek raasta, fir backtrack` },
            { table: { head: ['', 'BFS', 'DFS'], rows: [
              ['Structure', 'Queue (FIFO)', 'Call stack / Stack (LIFO)'],
              ['Shortest path (unweighted)', '<b>Haan</b>', 'Nahi'],
              ['Levels / minutes', '<b>Natural</b> (q.size())', 'Mushkil'],
              ['Code', 'Thoda lamba', 'Chhota'],
              ['Memory risk', 'Queue = widest frontier', 'Depth = m·n → StackOverflow'],
              ['Time', 'O(V + E)', 'O(V + E)'],
            ] } },
            { p: '<b>Push pe mark kyun?</b> Agar poll pe mark karoge, toh ek cell 2 alag neighbors se 2 baar queue me aa sakta hai:' },
            { pre: `   A B
   C D       A poll → B, C push (mark nahi kiya)
             B poll → D push
             C poll → D push AGAIN  ← duplicate!` },
            { code: `// Grid BFS template
Deque<int[]> q = new ArrayDeque<>();
q.offer(new int[]{sr, sc});
mark(sr, sc);                         // push ke saath mark
while (!q.isEmpty()) {
    int[] cur = q.poll();
    for (int[] d : dirs) {
        int nr = cur[0] + d[0], nc = cur[1] + d[1];
        if (bahar || !valid || marked) continue;
        mark(nr, nc);                 // push ke saath mark
        q.offer(new int[]{nr, nc});
    }
}` },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 200 Number of Islands (BFS) + LC 733 (BFS)',
          blocks: [
            { problem: 200 },
            { p: 'Aur kal ka LC 733 bhi BFS se:' },
            { problem: 733 },
          ],
        },
        {
          title: 'Part 3 — Thinking: DFS → BFS conversion',
          blocks: [
            { p: 'DFS aur BFS dono same cells visit karte hain — sirf <b>order</b> alag. Conversion recipe:' },
            { olist: [
              'Recursive call <code>dfs(nr, nc)</code> ki jagah <code>q.offer({nr, nc})</code>.',
              'Function ke shuru wala "mark" ab <b>offer ke saath</b>.',
              'Bounds + condition check ab neighbor pe, loop ke andar (<code>continue</code>).',
              'Bahar <code>while (!q.isEmpty())</code> loop.',
            ] },
            { table: { head: ['Problem', 'DFS', 'BFS'], rows: [
              ['LC 733', 'recolor in dfs', 'recolor before offer'],
              ['LC 200', "sink '0' in dfs", "sink '0' before offer"],
            ] } },
            { tip: 'BFS frontier grid me ek "diagonal lehar" hai → queue size O(min(m, n)) ke aaspaas, recursion depth O(m·n) se kaafi chhota.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: LC 200 Example 1 (BFS)',
          blocks: [
            { pre: `     c0 c1 c2 c3 c4
r0 [ 1  1  1  1  0 ]
r1 [ 1  1  0  1  0 ]
r2 [ 1  1  0  0  0 ]
r3 [ 0  0  0  0  0 ]` },
            { p: '(0,0) pe count = 1, push + sink. Directions: neeche, upar, right, left.' },
            { table: { head: ['poll', 'Naye push (sink)', 'Queue after'], rows: [
              ['(0,0)', '(1,0), (0,1)', '[(1,0), (0,1)]'],
              ['(1,0)', '(2,0), (1,1)', '[(0,1), (2,0), (1,1)]'],
              ['(0,1)', '(0,2) — (1,1) already sunk', '[(2,0), (1,1), (0,2)]'],
              ['(2,0)', '(2,1)', '[(1,1), (0,2), (2,1)]'],
              ['(1,1)', '—', '[(0,2), (2,1)]'],
              ['(0,2)', '(0,3)', '[(2,1), (0,3)]'],
              ['(2,1)', '—', '[(0,3)]'],
              ['(0,3)', '(1,3)', '[(1,3)]'],
              ['(1,3)', '—', '[]'],
            ] } },
            { p: '9 cells sink, baaki scan me koi \'1\' nahi → <b>1</b> ✓. Note: (1,1) sirf ek baar queue me — push pe mark ka fayda.' },
            { p: '<b>LC 733 BFS, Example 1</b>: q [(1,1)] → poll (1,1): push (0,1), (1,0) → poll (0,1): push (0,2), (0,0) → poll (1,0): push (2,0) → baaki kuch naya nahi. Same 6 cells.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>LC 200 — BFS</b>' },
            { code: `class Solution {
    public int numIslands(char[][] grid) {
        int m = grid.length, n = grid[0].length, count = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] != '1') continue;
                count++;
                Deque<int[]> q = new ArrayDeque<>();
                q.offer(new int[]{r, c});
                grid[r][c] = '0';
                while (!q.isEmpty()) {
                    int[] cur = q.poll();
                    for (int[] d : dirs) {
                        int nr = cur[0] + d[0], nc = cur[1] + d[1];
                        if (nr < 0 || nr >= m || nc < 0 || nc >= n || grid[nr][nc] != '1') continue;
                        grid[nr][nc] = '0';
                        q.offer(new int[]{nr, nc});
                    }
                }
            }
        }
        return count;
    }
}` },
            { lines: [
              ['int[][] dirs = ...', '4 directions ek jagah — loop se neighbors.'],
              ["if (grid[r][c] != '1') continue;", 'Paani / already sunk skip.'],
              ['Deque<int[]> q', 'Cell = {r, c} pair.'],
              ["q.offer(...); grid[r][c] = '0';", 'Source push + turant mark.'],
              ['int[] cur = q.poll();', 'FIFO — paas wale pehle.'],
              ['if (... || grid[nr][nc] != \'1\') continue;', 'Bahar / paani / already queued → skip.'],
              ["grid[nr][nc] = '0'; q.offer(...)", 'Push ke saath mark — duplicate nahi.'],
            ] },
            { p: '<b>LC 733 — BFS</b>' },
            { code: `class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int start = image[sr][sc];
        if (start == color) return image;
        int m = image.length, n = image[0].length;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        Deque<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{sr, sc});
        image[sr][sc] = color;
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int[] d : dirs) {
                int r = cur[0] + d[0], c = cur[1] + d[1];
                if (r < 0 || r >= m || c < 0 || c >= n || image[r][c] != start) continue;
                image[r][c] = color;
                q.offer(new int[]{r, c});
            }
        }
        return image;
    }
}` },
          ],
        },
        {
          title: 'Part 6 — Visualize: queue frontier',
          blocks: [
            { list: [
              'Queue view me front se poll, back me offer — "lehar" ki tarah failta hai.',
              'Har cell sirf ek baar queue me aata hai (new = abhi mark + push).',
              'Neeche LC 733 ka BFS bhi chalao aur DFS order se compare karo.',
            ] },
            { viz: 200, ex: 0, variant: 1 },
            { viz: 733, ex: 0, variant: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'BFS behaviour'], rows: [
              ['300×300 sab land', 'Queue chhota (frontier), no StackOverflow ✓'],
              ['Poll pe mark kiya (bug)', 'Same cell kai baar queue me — slow, galat counts possible'],
              ['1×1 grid', 'Ek push, ek poll'],
              ['LC 733 start == color', 'Pehle hi return'],
              ['Har neighbor ek naya int[] object', 'Memory theek; chaho toh r * n + c ek int me encode karo'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['', 'DFS', 'BFS'], rows: [
              ['LC 200 time', 'O(m·n)', 'O(m·n)'],
              ['LC 200 space', 'O(m·n) recursion', 'O(min(m, n)) queue (typical frontier), O(m·n) worst bound'],
              ['LC 733 time', 'O(m·n)', 'O(m·n)'],
              ['LC 733 space', 'O(m·n)', 'O(m·n)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['BFS kis data structure se?', 'Queue — Java me ArrayDeque (offer/poll).'],
              ['ArrayDeque vs LinkedList?', 'ArrayDeque fast (array-backed, kam objects); null allow nahi.'],
              ['Push pe mark kyun?', 'Taaki ek node do neighbors se do baar queue me na aaye.'],
              ['Shortest path ke liye kaunsa?', 'BFS (unweighted) — distance ke order me visit.'],
              ['DFS ka risk?', 'Deep recursion → StackOverflowError bade inputs pe.'],
              ['Dono ka time?', 'O(V + E); grid me O(m·n).'],
              ['Grid cell queue me kaise rakhte ho?', '<code>new int[]{r, c}</code> ya encode <code>r * n + c</code>.'],
              ['Iterative DFS kaise?', 'Queue ki jagah stack (<code>push/pop</code>) — same code, LIFO.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['LC 200 BFS approach', 'I scan the grid and, for each unvisited land cell, start a BFS: I increment the count, push the cell into an ArrayDeque and mark it as water immediately. While the queue is not empty, I poll a cell and push each land neighbour, marking it at push time so no cell is enqueued twice. This visits every cell once, O(m·n) time, and the queue only holds the current frontier, so there is no risk of stack overflow.'],
              ['Follow-up: "BFS ya DFS — kya choose karoge?"', 'For pure counting or filling, both are correct and O(m·n). I usually write DFS first because it is shorter, but if the grid can be large, or the interviewer asks about production code, I switch to BFS to avoid deep recursion. If the question asks for minimum steps or distance, BFS is required.'],
              ['Follow-up: "Mark on pop kiya toh?"', 'The result can still be correct with extra checks, but a cell may be enqueued multiple times by different neighbours, which wastes time and memory and can break problems that count levels. Marking at push time guarantees each cell enters the queue exactly once.'],
              ['1-minute: When BFS over DFS', 'Both visit every reachable node in O(V + E). I choose BFS when the problem talks about the shortest path in an unweighted graph, minimum steps, or levels, because BFS explores nodes in order of distance. I choose DFS when I just need reachability, counting, or path exploration and the code is simpler with recursion. On very large grids I prefer BFS or an iterative stack, because recursive DFS can overflow the call stack. In BFS I always mark nodes visited when I push them.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Ek 3×3 grid pe start (1,1) se BFS ki "lehar" number karo (distance 0, 1, 2).',
              'Usi grid pe DFS ka order number karo — fark dekho.',
              'Part 4 ki queue table khud bharo.',
              'LC 733 BFS likho (DFS code se convert karke).',
              'Visualizer me queue ka front/back follow karo.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 200 BFS + LC 733 BFS, 15 minute total, submit.',
              '<b>Task B:</b> LC 200 iterative DFS (explicit stack) likho.',
              '<b>Task C:</b> <code>r * n + c</code> encoding wala BFS version — int queue.',
              '<b>Task D:</b> "BFS vs DFS" 1-minute answer — recording sun ke filler words hatao.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 200 aur LC 733 dono ke BFS + DFS Accepted.',
              'Kal (Day 5): LC 994 Rotting Oranges — multi-source BFS. Problem padh ke socho: "minutes" kaise ginoge?',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['DFS → BFS convert ke 4 steps?', 'Call → offer; mark offer ke saath; checks neighbor pe; while queue loop.'],
              ['BFS mark rule?', 'Push pe mark.'],
              ['Shortest path unweighted?', 'BFS.'],
              ['Bade grid pe kya safe?', 'BFS / iterative stack.'],
              ['Queue me grid cell kaise?', 'int[]{r, c} ya r*n + c.'],
            ] },
          ],
        },
      ],
      checks: [
        'BFS aur DFS ka fark table se bata sakta/sakti hu',
        'LC 200 BFS Accepted',
        'LC 733 BFS Accepted',
        'Push pe mark kyun — duplicate example se samjha',
        'Example 1 ki queue table banayi',
        'Visualizer me dono BFS dekhe',
        'BFS vs DFS 1-minute answer bol sakta/sakti hu',
      ],
      memory: 'BFS = queue + push pe mark. Distance/levels → BFS; bada grid → BFS safe.',
    },
  });
})();
(function () {
  const P = window.PHASE_CONTENT['graphs'];
  P.lessons = P.lessons || {};
  Object.assign(P.lessons, {
    5: {
      title: 'Multi-source BFS (Rotting Oranges)',
      goal: '<b>Multi-source BFS</b>: saare sources ek saath queue me, <code>q.size()</code> se level = 1 minute. LC 994 ko brute simulation se optimal BFS tak le jaana, aur −1 / 0 edge cases.',
      main: 994,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 733 (BFS), LC 102, LC 973',
          blocks: [
            { h: '1) LC 733 Flood Fill — BFS (kal)' },
            { p: '<b>Problem:</b> start se jude same-color pixels recolor.' },
            { pre: '[[0,0,0],[0,1,0]], (0,0), 3 → [[3,3,3],[3,1,3]]' },
            { p: '<b>Pattern:</b> Grid BFS, push pe mark.' },
            { olist: ['start == color → return.', 'Push start + recolor.', 'Poll → neighbors == start → recolor + push.'] },
            { code: `q.offer(new int[]{sr, sc});
image[sr][sc] = color;
while (!q.isEmpty()) {
    int[] cur = q.poll();
    for (int[] d : dirs) {
        int r = cur[0] + d[0], c = cur[1] + d[1];
        if (r < 0 || r >= m || c < 0 || c >= n || image[r][c] != start) continue;
        image[r][c] = color;
        q.offer(new int[]{r, c});
    }
}` },
            { tip: 'Memory hook: <b>Recolor + offer saath-saath.</b>' },
            { h: '2) LC 102 Level Order Traversal (Phase 7)' },
            { p: '<b>Problem:</b> tree nodes level-wise.' },
            { pre: '[3,9,20,null,null,15,7] → [[3],[9,20],[15,7]]' },
            { p: '<b>Pattern:</b> BFS + size loop.' },
            { olist: ['size = q.size() loop se pehle.', 'Exactly size nodes poll = ek level.'] },
            { code: `while (!q.isEmpty()) {
    int size = q.size();
    for (int i = 0; i < size; i++) { /* poll + children offer */ }
    // ek level khatam
}` },
            { tip: 'Memory hook: <b>size pehle freeze karo</b> — loop ke andar q badhta rehta hai. Aaj yahi "1 level = 1 minute".' },
            { h: '3) LC 973 K Closest Points to Origin (Phase 8)' },
            { p: '<b>Problem:</b> origin ke sabse paas k points.' },
            { pre: '[[1,3],[-2,2]], k = 1 → [[-2,2]]  (dist² 10 vs 8)' },
            { p: '<b>Pattern:</b> Max-heap of size k (dist² se).' },
            { olist: ['Max-heap by x² + y².', 'Push, size > k → poll (sabse door hatao).', 'Heap me bache k = answer.'] },
            { code: `PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> (b[0]*b[0] + b[1]*b[1]) - (a[0]*a[0] + a[1]*a[1]));
for (int[] p : points) {
    pq.offer(p);
    if (pq.size() > k) pq.poll();
}` },
            { tip: 'Memory hook: <b>k closest → max-heap size k.</b> (BFS me bhi "distance" hi socha jaata hai.)' },
          ],
        },
        {
          title: 'Part 1 — Concept: Multi-source BFS',
          blocks: [
            { p: 'Normal BFS ek source se shuru hota hai. <b>Multi-source BFS</b> me <b>saare sources ek saath</b> queue me daalte hain — jaise sab distance 0 pe hain. Fir level-wise BFS har node ko uske <b>sabse nazdeek source</b> ki distance deta hai.' },
            { pre: `Do aag (F) ek saath failti hai:

minute 0      minute 1      minute 2
F . . F       F x . F       F x x F
. . . .   →   x . . x   →   x x x x
. . . .       . . . .       x . . x

Har level = 1 minute. Alag-alag BFS chalane ki zaroorat nahi.` },
            { code: `// Multi-source BFS template
for (har source s) q.offer(s);        // sab level 0
int level = 0;
while (!q.isEmpty()) {
    int size = q.size();
    for (int i = 0; i < size; i++) {
        int[] cur = q.poll();
        // neighbors jo abhi tak nahi pahunche → mark + offer
    }
    level++;
}` },
            { table: { head: ['Single-source k baar', 'Multi-source ek baar'], rows: [
              ['O(k · (V + E))', '<b>O(V + E)</b>'],
              ['Har source ki alag distance', 'Nearest source ki distance (jo chahiye)'],
            ] } },
            { tip: 'Signal words: <b>"simultaneously", "har minute failta hai", "nearest", "minimum time for all"</b>.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 994 Rotting Oranges',
          blocks: [{ problem: 994 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute (simulation):</b> har minute poora grid scan karo. Jis fresh ke bagal me rotten hai, use <b>toRot list</b> me daalo. Scan ke baad list wale sab ko ek saath 2 karo, minutes++. List khaali → ruko.' },
            { p: 'Seedha 2 kyun nahi? Agar scan ke beech me hi 2 kar diya, toh aage ka fresh usi minute me us naye rotten se rot ho jaayega — ek minute me 2 step → galat (kam) answer.' },
            { p: 'Brute cost: har minute O(m·n), minutes O(m·n) tak → <b>O((m·n)²)</b>. Repeated kaam: har minute purane rotten bhi dobara dekhe ja rahe hain.' },
            { p: '<b>Optimal (multi-source BFS):</b> sirf <b>naye</b> rotten hi agle minute kuch karenge. Toh queue me sirf frontier rakho.' },
            { olist: [
              'Scan: rotten (2) → queue, fresh (1) → <code>fresh++</code>.',
              '<code>while (!q.isEmpty() && fresh &gt; 0)</code>: <code>size = q.size()</code>.',
              'size baar poll; har fresh neighbor → 2, <code>fresh--</code>, offer.',
              'Level ke baad <code>minutes++</code>.',
              'End: <code>fresh == 0 ? minutes : -1</code>.',
            ] },
            { tip: '<code>fresh &gt; 0</code> condition loop me zaroori: last level ke rotten oranges ke paas rot karne ko kuch nahi, warna ek extra minute gin jaayega.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: grid = [[2,1,1],[1,1,0],[0,1,1]]',
          blocks: [
            { p: 'Scan: q = [(0,0)], fresh = 6.' },
            { table: { head: ['Minute (level)', 'Poll', 'Rot hue', 'fresh', 'q after'], rows: [
              ['1', '(0,0)', '(1,0), (0,1)', '4', '[(1,0), (0,1)]'],
              ['2', '(1,0), (0,1)', '(1,1), (0,2)', '2', '[(1,1), (0,2)]'],
              ['3', '(1,1), (0,2)', '(2,1)', '1', '[(2,1)]'],
              ['4', '(2,1)', '(2,2)', '0', '[(2,2)]'],
            ] } },
            { pre: `min 0     min 1     min 2     min 3     min 4
2 1 1     2 2 1     2 2 2     2 2 2     2 2 2
1 1 0     2 1 0     2 2 0     2 2 0     2 2 0
0 1 1     0 1 1     0 1 1     0 2 1     0 2 2` },
            { p: 'fresh = 0 → loop band (queue me (2,2) hai par fresh check rokta hai). Answer <b>4</b> ✓.' },
            { p: '<b>Example 2</b> <code>[[2,1,1],[0,1,1],[1,0,1]]</code>: (2,0) ke upar (1,0)=0 aur right (2,1)=0 → kabhi nahi pahunchta. Queue khaali, fresh = 1 → <b>−1</b>.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { code: `class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length, fresh = 0;
        Deque<int[]> q = new ArrayDeque<>();
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 2) q.offer(new int[]{r, c});
                else if (grid[r][c] == 1) fresh++;
            }
        }
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        int minutes = 0;
        while (!q.isEmpty() && fresh > 0) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                int[] cur = q.poll();
                for (int[] d : dirs) {
                    int r = cur[0] + d[0], c = cur[1] + d[1];
                    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != 1) continue;
                    grid[r][c] = 2;
                    fresh--;
                    q.offer(new int[]{r, c});
                }
            }
            minutes++;
        }
        return fresh == 0 ? minutes : -1;
    }
}` },
            { lines: [
              ['if (grid[r][c] == 2) q.offer(...)', 'Saare rotten = sources, ek saath (multi-source).'],
              ['else if (grid[r][c] == 1) fresh++;', 'Kitne bachane/rot karne hain — end check ke liye.'],
              ['while (!q.isEmpty() && fresh > 0)', 'Fresh khatam → ruk jao (extra minute nahi).'],
              ['int size = q.size();', 'Is minute ke rotten — freeze karo.'],
              ['grid[r][c] != 1 → continue', 'Sirf fresh pe asar; 0 / 2 skip.'],
              ['grid[r][c] = 2; fresh--; q.offer', 'Rot = visited mark, push ke saath.'],
              ['minutes++;', 'Ek level poora = ek minute.'],
              ['return fresh == 0 ? minutes : -1;', 'Koi fresh unreachable → −1.'],
            ] },
            { p: '<b>Brute (simulation) — samajhne ke liye</b>' },
            { code: `class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length, minutes = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (true) {
            List<int[]> toRot = new ArrayList<>();
            for (int r = 0; r < m; r++) {
                for (int c = 0; c < n; c++) {
                    if (grid[r][c] != 1) continue;
                    for (int[] d : dirs) {
                        int nr = r + d[0], nc = c + d[1];
                        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 2) {
                            toRot.add(new int[]{r, c});
                            break;
                        }
                    }
                }
            }
            if (toRot.isEmpty()) break;
            for (int[] p : toRot) grid[p[0]][p[1]] = 2;
            minutes++;
        }
        for (int[] row : grid) {
            for (int x : row) {
                if (x == 1) return -1;
            }
        }
        return minutes;
    }
}` },
          ],
        },
        {
          title: 'Part 6 — Visualize: levels = minutes',
          blocks: [
            { list: [
              'Shuru me queue me <b>saare</b> rotten — multi-source.',
              '<code>size</code> freeze hota hai; utne poll ke baad minutes++.',
              'Example 2 me end me ek cell skip (laal) = fresh bacha → −1.',
              '"Brute simulation" tab: har minute poora scan — kitne zyada steps hain, compare karo.',
            ] },
            { viz: 994, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[[0,2]]</code>', '0', 'Fresh hi nahi → loop chalta hi nahi'],
              ['<code>[[0]]</code>', '0', 'Kuch nahi'],
              ['<code>[[1]]</code>', '−1', 'Fresh hai, rotten koi nahi'],
              ['<code>[[2,2],[1,1]]</code>', '1', 'Do sources ek saath'],
              ['<code>[[2,1,1,1,2]]</code>', '2', 'Dono taraf se beech me milte hain — multi-source ka fayda'],
              ['<code>[[1,1],[1,1]]</code>', '−1', 'Rotten nahi'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute simulation', 'O((m·n)²)', 'O(m·n) toRot'],
              ['Multi-source BFS', 'O(m·n)', 'O(m·n) queue'],
            ] } },
            { p: 'BFS me har cell max ek baar queue me aata hai (rot hote hi 2) → O(m·n).' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Multi-source BFS kya hai?', 'Saare sources ek saath queue me (level 0), fir normal level-wise BFS.'],
              ['Har rotten se alag BFS kyun nahi?', 'O(k·m·n) aur "ek saath failna" model nahi hota; multi-source O(m·n).'],
              ['<code>size = q.size()</code> loop se pehle kyun?', 'Loop me queue badhti hai; size freeze = sirf is minute ke nodes.'],
              ['<code>fresh &gt; 0</code> loop condition kyun?', 'Last level ke baad extra minutes++ rokne ke liye.'],
              ['−1 kab?', 'BFS ke baad bhi fresh > 0 — kuch oranges unreachable.'],
              ['Koi fresh nahi toh?', '0 — loop chalta hi nahi.'],
              ['Brute me seedha 2 kyun nahi kiya?', 'Same minute me chain reaction → galat (kam) minutes.'],
              ['Time?', 'O(m·n).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'Rot spreads from all rotten oranges at the same time, one step per minute, which is exactly a multi-source BFS. I scan the grid once, pushing every rotten orange into the queue and counting fresh ones. Then I process the queue level by level: I freeze the current queue size, poll that many cells, and every fresh neighbour becomes rotten, decrements the fresh count and joins the next level. Each completed level is one minute. When the loop ends, I return the minutes if no fresh orange is left, otherwise −1. O(m·n) time and space.'],
              ['Follow-up: "Simulation se kyun better?"', 'Simulation rescans the whole grid every minute, which is O((m·n)²) in the worst case, because it keeps re-checking oranges that are already rotten. BFS only processes the frontier — the oranges that became rotten in the previous minute — so every cell is handled once.'],
              ['Follow-up: "Har fresh ka rot time chahiye"', 'I would store a time grid, or push {r, c, t} into the queue and set time[r][c] = t + 1 when a neighbour rots. The maximum of those times is the answer, and the BFS order guarantees each time is the earliest possible.'],
              ['1-minute: Multi-source BFS', 'Multi-source BFS starts the search from many nodes at once by putting all of them in the queue before the loop, as if they were all at distance zero. Then a normal level-by-level BFS gives, for every node, the distance to its nearest source. It is perfect for things that spread simultaneously, like rotting oranges, fire or the distance to the nearest exit. The cost is still O(V + E), the same as one BFS.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Example 1 ka grid 5 baar paper pe banao (minute 0–4) aur rotten cells rang do.',
              'Brute simulation ka idea apne shabdon me batao: "har minute scan".',
              'Part 4 ki table khud bharo.',
              'BFS code dekh ke samjho, fir bina dekhe likhne ki koshish (optional).',
              'Edge cases <code>[[0,2]]</code> aur <code>[[1]]</code> ka answer kyun 0 aur −1 — batao.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Multi-source BFS 10 minute me, submit.',
              '<b>Task B:</b> Brute simulation bhi likho (5 min) — fark explain karo.',
              '<b>Task C:</b> Queue me {r, c, time} wala version (size loop ke bina) likho.',
              '<b>Task D:</b> Timer 2 min: "Multi-source BFS" + "−1 kab" bolo.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 994 Accepted.',
              'Kal Saturday revision: LC 733, 841, 200, 994 bina dekhe.',
              'Sohel: System Design topic chun lo (kal session).',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[[2,1,1],[1,1,0],[0,1,1]]</code> answer?', '4'],
              ['<code>[[2,1,1,1,2]]</code> answer?', '2'],
              ['Level = ?', 'Ek minute (size loop).'],
              ['Return line?', '<code>fresh == 0 ? minutes : -1</code>'],
              ['Time / space?', 'O(m·n) / O(m·n).'],
            ] },
          ],
        },
      ],
      checks: [
        'Multi-source BFS ka matlab aur fayda bata sakta/sakti hu',
        'LC 994 BFS bina dekhe Accepted',
        'size freeze + fresh > 0 condition kyun — samjha',
        'Example 1 ki minute table banayi',
        'Brute simulation vs BFS complexity bata sakta/sakti hu',
        'Edge cases 0 / −1 clear',
        'Visualizer me dono tabs dekhe',
      ],
      memory: 'Saare sources ek saath queue me; size freeze = 1 minute; end me fresh bacha → −1.',
    },

    6: {
      title: 'Revision — Week 19 (Grid + Graph traversal)',
      goal: 'Week 19 ke 4 questions (LC 733, 841, 200, 994) <b>bina dekhe</b> re-solve, DFS + BFS dono, aur Sohel ka <b>System Design session</b>.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan + warm-up (LC 238, LC 21)',
          blocks: [
            { table: { head: ['Slot', 'Kya', 'Timer'], rows: [
              ['1', 'LC 733 Flood Fill (DFS)', 'Easy — 15 min'],
              ['2', 'LC 841 Keys and Rooms (BFS)', '20 min'],
              ['3', 'LC 200 Number of Islands (DFS + BFS)', 'Medium — 25 min'],
              ['4', 'LC 994 Rotting Oranges', 'Medium — 25 min'],
            ] } },
            { list: ['Rules: pehle bolo (approach + complexity), fir code, fir dry run.', 'Atak gaye 5 min se zyada → hint ladder (memory hook), solution nahi.', 'Sohvi: kam se kam 3 (733, 841, 200). Tum: chaaron + dono approaches.'] },
            { h: 'Warm-up 1) LC 238 Product of Array Except Self (Phase 1)' },
            { pre: '[1,2,3,4] → [24,12,8,6]' },
            { p: '<b>Pattern:</b> Prefix × suffix product.' },
            { code: `ans[0] = 1;
for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
int suffix = 1;
for (int i = n - 1; i >= 0; i--) { ans[i] *= suffix; suffix *= nums[i]; }` },
            { tip: 'Memory hook: <b>Left product ans me, right product variable me.</b>' },
            { h: 'Warm-up 2) LC 21 Merge Two Sorted Lists (Phase 4)' },
            { pre: '1→2→4 + 1→3→4 → 1→1→2→3→4→4' },
            { p: '<b>Pattern:</b> Dummy node + two pointers.' },
            { code: `ListNode dummy = new ListNode(0), tail = dummy;
while (l1 != null && l2 != null) {
    if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
    else { tail.next = l2; l2 = l2.next; }
    tail = tail.next;
}
tail.next = (l1 != null) ? l1 : l2;
return dummy.next;` },
            { tip: 'Memory hook: <b>Dummy se shuru, chhota jodo, bacha hua chipka do.</b>' },
          ],
        },
        {
          title: 'Part 1 — LC 733 Flood Fill',
          blocks: [
            { p: '<b>Recap:</b> start pixel se 4-directionally jude same-color pixels ko naya color.' },
            { p: '<b>Pattern:</b> Grid flood fill (DFS / BFS).' },
            { pre: '[[1,1,1],[1,1,0],[1,0,1]], (1,1), 2 → [[2,2,2],[2,2,0],[2,0,1]]' },
            { code: `int start = image[sr][sc];
if (start != color) dfs(image, sr, sc, start, color);
// dfs: bounds → != start → recolor → 4 directions` },
            { tip: 'Memory hook: <b>Paint bucket; start == color pe ruk jao.</b>' },
            { viz: 733, ex: 0 },
          ],
        },
        {
          title: 'Part 2 — LC 841 Keys and Rooms',
          blocks: [
            { p: '<b>Recap:</b> room 0 se saare rooms khul sakte hain?' },
            { p: '<b>Pattern:</b> Reachability — rooms = adjacency list.' },
            { pre: '[[1,3],[3,0,1],[2],[0]] → false (room 2)' },
            { code: `q.offer(0); seen[0] = true; int visited = 1;
while (!q.isEmpty()) {
    int room = q.poll();
    for (int key : rooms.get(room))
        if (!seen[key]) { seen[key] = true; visited++; q.offer(key); }
}
return visited == n;` },
            { tip: 'Memory hook: <b>Source se BFS, end me count == n.</b>' },
            { viz: 841, ex: 1 },
          ],
        },
        {
          title: 'Part 3 — LC 200 Number of Islands',
          blocks: [
            { p: '<b>Recap:</b> land cells ke connected groups gino.' },
            { p: '<b>Pattern:</b> Components — scan + sink.' },
            { pre: '11000 / 11000 / 00100 / 00011 → 3' },
            { code: `for (r) for (c)
    if (grid[r][c] == '1') { count++; dfs(grid, r, c); }
// dfs: bounds → != '1' → '0' → 4 directions` },
            { tip: "Memory hook: <b>Naya '1' = count++, poora island sink.</b>" },
            { viz: 200, ex: 1 },
          ],
        },
        {
          title: 'Part 4 — LC 994 Rotting Oranges',
          blocks: [
            { p: '<b>Recap:</b> minimum minutes jab tak sab rot; impossible → −1.' },
            { p: '<b>Pattern:</b> Multi-source BFS, level = minute.' },
            { pre: '[[2,1,1],[1,1,0],[0,1,1]] → 4' },
            { code: `while (!q.isEmpty() && fresh > 0) {
    int size = q.size();
    for (int i = 0; i < size; i++) { /* poll, rot fresh neighbors, fresh--, offer */ }
    minutes++;
}
return fresh == 0 ? minutes : -1;` },
            { tip: 'Memory hook: <b>Saare rotten ek saath; size freeze; fresh bacha → −1.</b>' },
            { viz: 994, ex: 0 },
          ],
        },
        {
          title: 'Part 5 — Interview mix',
          blocks: [
            { qa: [
              ['Graph traversal me visited kyun?', 'Cycles ki wajah se infinite loop / duplicate kaam rokne ke liye.'],
              ['BFS me mark kab?', 'Push ke waqt.'],
              ['Adjacency list ki space?', 'O(V + E).'],
              ['Islands kya hain graph terms me?', 'Connected components.'],
              ['Minimum minutes / steps — kaunsa traversal?', 'BFS (level by level).'],
              ['Flood fill ka infinite recursion trap?', 'start == color.'],
              ['DFS ka production risk?', 'StackOverflow on deep recursion.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — 1-minute answers: aise bolo',
          blocks: [
            { say: [
              ['Testing a grid traversal', 'I first dry-run the given example and track the queue or recursion and the visited cells. Then I test edge cases: a 1 by 1 grid, a grid with no target cells, a grid that is entirely land or entirely fresh oranges, a target cell on the border to check bounds, and a case where the answer is impossible, like an isolated fresh orange. I also confirm I never revisit a cell, which would show up as an infinite loop or a wrong count.'],
              ['Number of Islands in 1 minute', 'Each island is a connected component of land cells. I scan every cell, and when I find unvisited land I increment the count and flood the island with DFS or BFS, sinking it so it is not counted again. O(m·n) time; space is the recursion depth or queue, O(m·n) worst case.'],
              ['Rotting Oranges in 1 minute', 'It is a multi-source BFS: all rotten oranges start in the queue, and each BFS level is one minute. Fresh neighbours rot and join the next level, and I track how many fresh remain. If any are left at the end I return −1, otherwise the number of levels. O(m·n).'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: [
              'LC 733, 841, 200 bina dekhe (DFS chalega). Har ek ke baad visualizer se dry run match karo.',
              'Ek grid aur ek rooms graph khud banao aur dost (Sohel) se answer puchho.',
              'Notebook me 4 memory hooks likho.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice) + System Design session',
          blocks: [
            { olist: [
              '<b>Task A:</b> Chaaron questions, DFS + BFS dono, total 60 min timer.',
              '<b>Task B:</b> Har solution ke baad 30 sec complexity + edge cases bolo.',
              '<b>System Design session (1/week):</b> "Design a Web Crawler" — 45 min. Graph connection: URLs = nodes, links = edges, BFS frontier queue, visited set (URL dedup / Bloom filter), politeness per domain, distributed workers. Requirements → high-level diagram → deep dive (frontier, dedup) → bottlenecks.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: ['Jo question atka, kal mock se pehle ek baar aur.', 'Kal mock: Sohvi ko LC 841, Tum ko LC 994 milega — dobara mat dekhna!'] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['dirs array?', '{{1,0},{-1,0},{0,1},{0,-1}}'],
              ['Components count template?', 'Har unvisited pe count++ + DFS.'],
              ['Multi-source BFS cost?', 'O(V + E) — single BFS jitna.'],
              ['Keys and Rooms me graph directed hai?', 'Haan.'],
              ['994 ka −1 kab?', 'BFS ke baad fresh > 0.'],
            ] },
          ],
        },
      ],
      checks: [
        'Kam se kam 3 questions bina dekhe solve',
        'Har solution ka dry run visualizer se match',
        'DFS aur BFS dono likhe (Sohel)',
        'System Design session (Web Crawler) kiya (Sohel)',
        'Interview mix ke 7 sawaal sahi',
      ],
      memory: 'Grid = graph; visited zaroori; reach/count → DFS/BFS; minutes → BFS levels.',
    },

    7: {
      title: 'Mock Interview + Contest',
      goal: 'Real interview jaisa mock: <b>Tum → Sohvi (LC 841)</b>, <b>Sohvi → Tum (LC 994)</b>, fir LeetCode Weekly Contest discussion.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Mock format + warm-up (LC 206, LC 739)',
          blocks: [
            { table: { head: ['Slot', 'Kya', 'Time'], rows: [
              ['1', 'Tum interviewer, Sohvi candidate — LC 841', '30 min'],
              ['2', 'Sohvi interviewer, Tum candidate — LC 994', '30 min'],
              ['3', 'Weekly Contest discussion (Sunday 8:00 AM IST)', '30 min'],
            ] } },
            { p: 'Camera on, shared editor, bina IDE autocomplete. Candidate sochte hue bole.' },
            { h: 'Warm-up 1) LC 206 Reverse Linked List (Phase 4)' },
            { pre: '1→2→3→4→5 → 5→4→3→2→1' },
            { code: `ListNode prev = null, cur = head;
while (cur != null) {
    ListNode next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
}
return prev;` },
            { tip: 'Memory hook: <b>next bachao, ulta jodo, aage badho.</b>' },
            { h: 'Warm-up 2) LC 739 Daily Temperatures (Phase 5)' },
            { pre: '[73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]' },
            { code: `Deque<Integer> st = new ArrayDeque<>();
for (int i = 0; i < n; i++) {
    while (!st.isEmpty() && t[i] > t[st.peek()]) {
        int j = st.pop();
        ans[j] = i - j;
    }
    st.push(i);
}` },
            { tip: 'Memory hook: <b>Monotonic stack of indices — garam din aaya toh pop karke jawab.</b>' },
          ],
        },
        {
          title: 'Part 1 — Mock Q1 (Tum → Sohvi): LC 841 Keys and Rooms',
          blocks: [
            { problem: 841 },
            { p: '<b>Kya poochna hai:</b> "Graph kya hai yahan? Directed ya undirected? Kaunsa traversal? Visited kahan? Complexity?"' },
            { olist: [
              'Hint 1: "Room aur key ko nodes aur edges ki tarah socho."',
              'Hint 2: "Room 0 se kaun-kaun pahunch sakte hain — kaunsa traversal?"',
              'Hint 3: "Ek room do baar na khule, uske liye kya rakhoge?" (seen[])',
              'Hint 4: "End me kaise pata chalega sab khule?" (count == n)',
            ] },
            { table: { head: ['Rubric', 'Kya dekhna', 'Score /5'], rows: [
              ['Clarify', 'n range, khud ki key, duplicate keys puchha?', ''],
              ['Brute', 'Repeat-until-no-change idea bola?', ''],
              ['Optimal', 'BFS/DFS + seen, O(N + K)', ''],
              ['Code', 'Compile-ready, seen push pe', ''],
              ['Test', 'Example 2 dry run, room 0 khaali case', ''],
              ['Communication', 'Bolte hue socha?', ''],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Mock Q2 (Sohvi → Tum): LC 994 Rotting Oranges',
          blocks: [
            { problem: 994 },
            { p: '<b>Kya poochna hai:</b> "Brute kya hoga? Multi-source kyun? −1 kab? fresh > 0 condition kyun? Har orange ka time chahiye toh?"' },
            { olist: [
              'Hint 1: "Har minute kya hota hai — simulate karo."',
              'Hint 2: "Sab rotten ek saath failte hain — ek queue me sab?"',
              'Hint 3: "Minute kaise ginoge?" (q.size() level)',
              'Hint 4: "Last minute ke baad extra count?" (fresh > 0)',
            ] },
            { table: { head: ['Rubric', 'Kya dekhna', 'Score /5'], rows: [
              ['Clarify', 'Grid size, 0 fresh case, no rotten case', ''],
              ['Brute', 'Simulation O((mn)²)', ''],
              ['Optimal', 'Multi-source BFS O(mn)', ''],
              ['Code', '10 min me clean', ''],
              ['Test', '[[0,2]] → 0, [[1]] → −1', ''],
              ['Communication', 'Trade-offs bole', ''],
            ] } },
          ],
        },
        {
          title: 'Part 3 — Interview communication checklist',
          blocks: [
            { list: [
              'Problem apne shabdon me repeat karo + 1 example.',
              'Clarify: input format (grid / list), directed?, size limits.',
              'Brute + complexity pehle bolo.',
              'Graph model bolo: "nodes = …, edges = …".',
              'Optimal + kyun (BFS levels / reachability).',
              'Code ke baad dry run + 2 edge cases.',
            ] },
          ],
        },
        {
          title: 'Part 4 — LeetCode Weekly Contest plan + discussion',
          blocks: [
            { list: [
              'Sunday 8:00 AM IST contest — dono participate (Sohvi: Q1–Q2, Tum: Q1–Q3).',
              'Discussion template: kaunsa question, kaunsa pattern pehchana, kahan atke, kitna time, editorial se kya naya seekha.',
              'Graph pattern dikha (grid / BFS)? Note karo — is hafte ka topic.',
            ] },
          ],
        },
        {
          title: 'Part 5 — Interview Q&A',
          blocks: [
            { qa: [
              ['Graph problem kaise pehchante ho?', 'Entities + relationships: cells, rooms, courses; words like connected, reach, spread.'],
              ['BFS ki complexity kyun O(V + E)?', 'Har node ek baar, har adjacency list ek baar scan.'],
              ['Visited ke bina kya hota?', 'Cycles pe infinite loop.'],
              ['Multi-source kab?', 'Kai jagah se ek saath failna / nearest source distance.'],
              ['Keys and Rooms DFS ka space?', 'O(N) seen + O(N) recursion.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Aise bolo',
          blocks: [
            { say: [
              ['Recognising graph problems', 'I look for entities and relationships between them: cells connected to neighbours, rooms linked by keys, courses depending on other courses. Phrases like connected, reachable, spread, islands, dependencies or order of tasks are strong signals. Once I see it, I decide whether the edges are directed, pick a representation — often the grid itself or an adjacency list — and choose BFS for shortest or level problems, DFS for reachability and components, and topological sort for dependencies.'],
              ['Keys and Rooms in 1 minute', 'Rooms are nodes and keys are directed edges, and rooms is already an adjacency list. I BFS from room 0 with a visited array, marking rooms as I enqueue them, and check that the number of visited rooms equals n. O(N + K) time, O(N) space.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: ['Mock Q1 me candidate bano — bolte hue solve karo.', 'Mock Q2 me interviewer bano — rubric bharo, hints ladder follow karo.', 'Contest ka Q1 discuss karo.'] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: ['Mock Q2 candidate: 25 min me clarify → code → test.', 'Mock Q1 interviewer: follow-up "DFS se karo" zaroor poochho.', 'Contest Q3 ka editorial padho, pattern note karo.'] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: ['Rubric me jo 3 se kam aaya, us skill pe kal dhyan.', 'Kal (Day 8): directed graph + Kahn — LC 207 Course Schedule padh lo.'] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Mock ke 6 rubric points?', 'Clarify, Brute, Optimal, Code, Test, Communication.'],
              ['LC 994 ke 2 edge cases?', '[[0,2]] → 0, [[1]] → −1.'],
              ['LC 841 graph directed?', 'Haan.'],
              ['Week 19 ke 4 patterns?', 'Flood fill, reachability, components, multi-source BFS.'],
              ['Contest kab?', 'Sunday 8:00 AM IST.'],
            ] },
          ],
        },
      ],
      checks: [
        'Mock Q1 aur Q2 dono kiye (30 + 30 min)',
        'Rubric bhara aur feedback diya',
        'Weekly contest diya aur discuss kiya',
        'Communication checklist follow ki',
        'Q&A ke 5 sawaal sahi',
      ],
      memory: 'Interview me pehle graph model bolo: nodes = ?, edges = ?, fir BFS/DFS.',
    },
  });
})();
