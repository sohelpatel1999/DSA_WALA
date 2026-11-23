window.PHASE_CONTENT = window.PHASE_CONTENT || {};

window.PHASE_CONTENT['graphs'] = {
  intro: 'Graph = nodes + unke beech connections (edges). Trees, grids, rooms-keys, course prerequisites — sab graph hain. Is phase me 2 hathiyaar seekhenge: BFS (queue, level by level) aur DFS (recursion, gehrai me), fir unse topological sort aur multi-source BFS.',

  // ---------------- FUNDAMENTALS ----------------
  fundamentals: [
    {
      h: 'Graph kya hai?',
      body: `<p>Graph <b>G = (V, E)</b>: <b>V</b> = vertices / nodes (cheezein), <b>E</b> = edges (unke beech rishta). Tree bhi ek graph hai — bas usme <b>cycle nahi</b> hota aur har node ka ek hi parent hota hai.</p>
<pre class="ex-pre diagram">Undirected (dosti — dono taraf)       Directed (follow / prerequisite — ek taraf)

    0 ─── 1                               0 ──→ 1
    │     │                               │     │
    │     │                               ↓     ↓
    3 ─── 2      4 (akela)                2 ──→ 3

 components = 2 ({0,1,2,3} aur {4})    0 → 1 → 3, 0 → 2 → 3   (koi cycle nahi = DAG)</pre>
<table class="tbl"><thead><tr><th>Shabd</th><th>Matlab</th></tr></thead><tbody>
<tr><td><b>Directed / Undirected</b></td><td>Edge ek taraf (a → b) ya dono taraf (a — b)</td></tr>
<tr><td><b>Neighbors</b></td><td>Jin nodes tak ek edge se pahunch sakte ho</td></tr>
<tr><td><b>Indegree / Outdegree</b></td><td>Kitne edges node me aate hain / node se jaate hain (directed)</td></tr>
<tr><td><b>Path / Cycle</b></td><td>Edges ka sequence / aisa path jo wapas start pe aaye</td></tr>
<tr><td><b>Connected component</b></td><td>Nodes ka group jisme sab ek-doosre tak pahunch sakte hain (LC 200 me "island")</td></tr>
<tr><td><b>DAG</b></td><td>Directed Acyclic Graph — directed, bina cycle. Sirf DAG ka topological order hota hai.</td></tr>
</tbody></table>`,
    },
    {
      h: 'Graph ko memory me kaise rakhein? (Representations)',
      body: `<p>Same graph ke 3 roop. Edges: <code>0→1, 0→2, 1→3, 2→3</code> (V = 4, E = 4).</p>
<pre class="ex-pre diagram">1) Edge list (LeetCode aksar yahi deta hai — prerequisites)
   [[0,1], [0,2], [1,3], [2,3]]

2) Adjacency matrix  (V × V, mat[a][b] = 1 agar edge hai)
        0  1  2  3
     0 [0, 1, 1, 0]
     1 [0, 0, 0, 1]
     2 [0, 0, 0, 1]
     3 [0, 0, 0, 0]

3) Adjacency list  (har node ke saath uske neighbors ki list)  ← interview default
   adj[0] → [1, 2]
   adj[1] → [3]
   adj[2] → [3]
   adj[3] → []</pre>
<table class="tbl"><thead><tr><th></th><th>Adjacency list</th><th>Adjacency matrix</th></tr></thead><tbody>
<tr><td>Space</td><td><b>O(V + E)</b></td><td>O(V²)</td></tr>
<tr><td>Neighbors loop</td><td>O(degree)</td><td>O(V)</td></tr>
<tr><td>"a–b edge hai?"</td><td>O(degree)</td><td><b>O(1)</b></td></tr>
<tr><td>Kab</td><td>Sparse graph (zyada tar interview problems)</td><td>Dense graph, V chhota (≤ 1000)</td></tr>
</tbody></table>
<p class="tip">Grid (LC 733, 200, 994, 417) me adjacency list banani hi nahi padti — cell (r, c) ke neighbors formula se nikalte hain. Isko <b>implicit graph</b> kehte hain. LC 841 me <code>rooms</code> already adjacency list hai.</p>`,
      code: `// Edge list -> adjacency list (directed: a -> b)
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
for (int[] e : edges) {
    adj.get(e[0]).add(e[1]);
    // undirected ho toh: adj.get(e[1]).add(e[0]);
}
for (int v : adj.get(u)) { /* u ke har neighbor v */ }`,
    },
    {
      h: 'Grid as Graph — cell = node, 4 directions = edges',
      body: `<p>m × n grid me har cell <code>(r, c)</code> ek node hai. Uske (max) 4 neighbors: upar, neeche, left, right. Bahar wale cells ko <b>bounds check</b> se rokna zaroori hai.</p>
<pre class="ex-pre diagram">           (r-1, c)
              ↑
 (r, c-1) ← (r, c) → (r, c+1)
              ↓
           (r+1, c)

dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}}     // neeche, upar, right, left
valid agar: 0 &lt;= nr &lt; m  aur  0 &lt;= nc &lt; n</pre>
<p>Node count V = m·n, edges ≈ 4·m·n → BFS/DFS = <b>O(m·n)</b>.</p>`,
      code: `int m = grid.length, n = grid[0].length;
int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
for (int[] d : dirs) {
    int nr = r + d[0], nc = c + d[1];
    if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue; // grid ke bahar
    // (nr, nc) valid neighbor
}`,
    },
    {
      h: 'Visited — sabse zaroori cheez',
      body: `<p>Tree me cycle nahi hota, graph me hota hai. <b>Visited</b> ke bina BFS/DFS ek hi node ko baar-baar ghumega → infinite loop / TLE.</p>
<table class="tbl"><thead><tr><th>Tarika</th><th>Code</th><th>Kab</th></tr></thead><tbody>
<tr><td>boolean array</td><td><code>boolean[] seen = new boolean[n];</code></td><td>Nodes 0..n−1 (LC 841)</td></tr>
<tr><td>2D boolean</td><td><code>boolean[][] seen = new boolean[m][n];</code></td><td>Grid, input change nahi karna (LC 417)</td></tr>
<tr><td>In-place mark</td><td><code>grid[r][c] = '0';</code> / naya color</td><td>Input modify allowed (LC 200, 733, 994)</td></tr>
<tr><td>3-state array</td><td><code>int[] state</code> 0 / 1 / 2</td><td>Directed cycle detection (LC 207, 210)</td></tr>
</tbody></table>
<p class="tip"><b>BFS rule:</b> node ko <b>queue me daalte waqt</b> visited mark karo, nikalte waqt nahi. Warna ek hi node queue me kai baar ghus jaata hai.</p>`,
    },
    {
      h: 'BFS vs DFS — templates',
      body: `<table class="tbl"><thead><tr><th></th><th>BFS</th><th>DFS</th></tr></thead><tbody>
<tr><td>Data structure</td><td>Queue (<code>ArrayDeque</code>)</td><td>Recursion (call stack) ya explicit Stack</td></tr>
<tr><td>Order</td><td>Level by level (paas wale pehle)</td><td>Ek raasta end tak, fir backtrack</td></tr>
<tr><td>Shortest path (unweighted)</td><td><b>Haan</b> — levels = distance</td><td>Nahi</td></tr>
<tr><td>Minutes / steps / levels</td><td><b>Haan</b> (LC 994)</td><td>Mushkil</td></tr>
<tr><td>Code length</td><td>Thoda lamba</td><td>Chhota (recursion)</td></tr>
<tr><td>Risk</td><td>Memory = widest level</td><td>Deep recursion → StackOverflow (bade grid)</td></tr>
<tr><td>Time / Space</td><td>O(V + E) / O(V)</td><td>O(V + E) / O(V)</td></tr>
</tbody></table>`,
      code: `// ---- BFS template ----
Deque<Integer> q = new ArrayDeque<>();
boolean[] seen = new boolean[n];
q.offer(src);
seen[src] = true;                 // daalte waqt mark
while (!q.isEmpty()) {
    int u = q.poll();
    for (int v : adj.get(u)) {
        if (!seen[v]) {
            seen[v] = true;
            q.offer(v);
        }
    }
}

// ---- BFS level by level (minutes / distance) ----
int level = 0;
while (!q.isEmpty()) {
    int size = q.size();          // is level me kitne
    for (int i = 0; i < size; i++) {
        int u = q.poll();
        // neighbors offer karo
    }
    level++;
}

// ---- DFS template (recursive) ----
void dfs(int u, boolean[] seen) {
    seen[u] = true;
    for (int v : adj.get(u)) {
        if (!seen[v]) dfs(v, seen);
    }
}`,
    },
    {
      h: 'Topological Sort — Kahn (BFS) aur DFS (3-color)',
      body: `<p><b>Topological order</b> = directed graph ke nodes ki aisi line jisme har edge <code>a → b</code> ke liye <b>a pehle</b> aaye. Course schedule: prerequisite pehle, course baad me. Cycle ho toh order possible hi nahi.</p>
<pre class="ex-pre diagram">prerequisites = [[1,0],[2,0],[3,1],[3,2]]   ([a, b] = "a lene se pehle b")
edge b → a :   0 → 1,  0 → 2,  1 → 3,  2 → 3

Kahn:  indegree = [0, 1, 1, 2]
  queue [0]        → take 0, indegree[1]=0, indegree[2]=0 → queue [1, 2]
  take 1           → indegree[3] = 1
  take 2           → indegree[3] = 0 → queue [3]
  take 3           → order = [0, 1, 2, 3]   (4 == numCourses → no cycle)

DFS 3-color:  0 = unvisited (white), 1 = visiting / stack me (gray), 2 = done (black)
  gray node dobara mila  →  back edge  →  CYCLE</pre>
<table class="tbl"><thead><tr><th></th><th>Kahn (BFS)</th><th>DFS 3-color</th></tr></thead><tbody>
<tr><td>Idea</td><td>Indegree 0 wale pehle; lete jao, indegree ghatao</td><td>Gray (stack wala) node dobara mile = cycle</td></tr>
<tr><td>Cycle kaise pata</td><td><code>taken &lt; n</code></td><td><code>state[v] == 1</code></td></tr>
<tr><td>Order</td><td>Poll order seedha</td><td>Postorder (reverse, ya prerequisite graph pe seedha)</td></tr>
<tr><td>Recursion</td><td>Nahi (safe)</td><td>Haan</td></tr>
</tbody></table>`,
    },
    {
      h: 'Java Cheat Sheet (Graphs)',
      code: `// Adjacency list
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
adj.get(a).add(b);

// Queue (BFS) — ArrayDeque, LinkedList se fast
Deque<Integer> q = new ArrayDeque<>();
q.offer(x);  q.poll();  q.peek();  q.isEmpty();  q.size();
Deque<int[]> cells = new ArrayDeque<>();   // grid: {r, c}
cells.offer(new int[]{r, c});

// Stack (iterative DFS)
Deque<Integer> st = new ArrayDeque<>();
st.push(x);  st.pop();

// Visited
boolean[] seen = new boolean[n];
boolean[][] vis = new boolean[m][n];
int[] state = new int[n];       // 0 / 1 / 2

// Grid directions
int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

// Answer as List<List<Integer>>
res.add(Arrays.asList(r, c));
return new int[0];              // empty int[]`,
    },
    {
      h: 'Yaad rakhne wali baatein',
      body: `<ul>
<li>Graph problem pehchano: "connected", "reach", "islands", "spread", "prerequisite", "dependency", "grid me 4 directions".</li>
<li>Pehla sawaal: <b>directed ya undirected?</b> Dusra: <b>input kis form me hai</b> (edge list / adj list / grid)?</li>
<li><b>Visited bina graph traversal = bug.</b> BFS me push karte waqt mark.</li>
<li>Shortest steps / minutes / levels → <b>BFS</b>. Sirf reach / count / fill → BFS ya DFS dono.</li>
<li>Kai jagah se ek saath shuru (saare rotten oranges, saare ocean borders) → <b>multi-source BFS</b>: sab sources pehle queue me.</li>
<li>Complexity hamesha <b>O(V + E)</b>; grid me <b>O(m·n)</b>.</li>
<li>Directed cycle ke liye sirf boolean visited kaafi nahi — <b>visiting (on-stack)</b> state chahiye.</li>
</ul>`,
    },
  ],

  // ---------------- OPERATIONS ----------------
  operations: [
    { op: 'Build adjacency list', time: 'O(V + E)', note: 'Edge list se; har node ki khaali list pehle', code: 'List<List<Integer>> adj = new ArrayList<>();\nfor (int i = 0; i < n; i++) adj.add(new ArrayList<>());\nfor (int[] e : edges) adj.get(e[0]).add(e[1]);' },
    { op: 'Neighbors of u', time: 'O(deg(u))', note: 'Adjacency list ka fayda', code: 'for (int v : adj.get(u)) { /* v */ }' },
    { op: 'Grid neighbors', time: 'O(1)', note: '4 directions + bounds check', code: 'for (int[] d : dirs) {\n    int nr = r + d[0], nc = c + d[1];\n    if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;\n}' },
    { op: 'BFS traversal', time: 'O(V + E)', note: 'Queue; push pe visited', code: 'q.offer(s); seen[s] = true;\nwhile (!q.isEmpty()) {\n    int u = q.poll();\n    for (int v : adj.get(u))\n        if (!seen[v]) { seen[v] = true; q.offer(v); }\n}' },
    { op: 'DFS traversal', time: 'O(V + E)', note: 'Recursion; depth = O(V) stack', code: 'void dfs(int u) {\n    seen[u] = true;\n    for (int v : adj.get(u)) if (!seen[v]) dfs(v);\n}' },
    { op: 'Count components', time: 'O(V + E)', note: 'Har unvisited node se naya DFS = naya component', code: 'int count = 0;\nfor (int i = 0; i < n; i++)\n    if (!seen[i]) { count++; dfs(i); }' },
    { op: 'Indegree array', time: 'O(V + E)', note: 'Kahn ke liye', code: 'int[] indeg = new int[n];\nfor (int[] e : edges) indeg[e[1]]++;' },
    { op: 'Topological sort (Kahn)', time: 'O(V + E)', note: 'indegree 0 queue; taken < n → cycle', code: 'for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);\nwhile (!q.isEmpty()) {\n    int u = q.poll(); order[k++] = u;\n    for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);\n}' },
    { op: 'Directed cycle (DFS)', time: 'O(V + E)', note: '3 states: 0 / 1 visiting / 2 done', code: 'state[u] = 1;\nfor (int v : adj.get(u)) {\n    if (state[v] == 1) return true;\n    if (state[v] == 0 && hasCycle(v)) return true;\n}\nstate[u] = 2; return false;' },
  ],

  // ---------------- PATTERNS ----------------
  patterns: [
    {
      name: 'Grid Flood Fill (DFS / BFS)',
      signal: '"Connected same color / land", "fill", "islands count", 4-directional grid',
      idea: 'Cell = node. Start cell se DFS/BFS karo, har valid same-type neighbor ko mark karo. Count chahiye toh har unvisited land se nayi DFS = +1.',
      code: `void dfs(char[][] g, int r, int c) {
    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length) return;
    if (g[r][c] != '1') return;
    g[r][c] = '0';                 // visited mark
    dfs(g, r + 1, c); dfs(g, r - 1, c);
    dfs(g, r, c + 1); dfs(g, r, c - 1);
}`,
      qs: [733, 200],
    },
    {
      name: 'Reachability (Graph Traversal from a source)',
      signal: '"Kya saare nodes tak pahunch sakte hain?", keys / links / friends',
      idea: 'Source se BFS/DFS + visited. End me check: visited count == n.',
      code: `boolean[] seen = new boolean[n];
dfs(0, seen);
for (boolean s : seen) if (!s) return false;
return true;`,
      qs: [841],
    },
    {
      name: 'Multi-source BFS',
      signal: '"Ek saath failta hai", "minimum minutes", "sab sources se distance", "ocean / border se"',
      idea: 'Saare sources ek saath queue me daal do (level 0). Fir normal level-wise BFS — har level = 1 minute.',
      code: `for (r..) for (c..) if (grid[r][c] == 2) q.offer(new int[]{r, c});
int minutes = 0;
while (!q.isEmpty() && fresh > 0) {
    int size = q.size();
    for (int i = 0; i < size; i++) { /* poll + spread */ }
    minutes++;
}`,
      qs: [994, 417],
    },
    {
      name: 'Reverse Thinking (boundary se andar)',
      signal: '"Kaun se cells X tak pahunch sakte hain" — har cell se check = O((mn)²)',
      idea: 'Ulta socho: X (ocean / border) se shuru karke ulti condition (h[next] ≥ h[cur]) pe andar jao. Do baar (Pacific, Atlantic), fir intersection.',
      code: `void dfs(int[][] h, int r, int c, boolean[][] ocean, int prev) {
    if (out of bounds || ocean[r][c] || h[r][c] < prev) return;
    ocean[r][c] = true;
    // 4 directions, prev = h[r][c]
}`,
      qs: [417],
    },
    {
      name: 'Topological Sort (Kahn — indegree BFS)',
      signal: '"Prerequisites", "dependencies", "order of tasks", "kya sab finish ho sakte hain"',
      idea: 'Indegree 0 wale nodes queue me. Poll → order me daalo → neighbors ka indegree −1 → 0 hua toh queue. taken &lt; n ⇒ cycle.',
      code: `for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
while (!q.isEmpty()) {
    int u = q.poll(); order[k++] = u;
    for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);
}
return k == n ? order : new int[0];`,
      qs: [207, 210],
    },
    {
      name: 'Directed Cycle Detection (DFS 3-color)',
      signal: '"Cycle hai kya" directed graph me; deadlock / circular dependency',
      idea: '0 = white, 1 = gray (abhi recursion stack me), 2 = black (poora ho gaya). Gray node dobara mila = back edge = cycle.',
      code: `boolean hasCycle(int u) {
    state[u] = 1;
    for (int v : adj.get(u)) {
        if (state[v] == 1) return true;
        if (state[v] == 0 && hasCycle(v)) return true;
    }
    state[u] = 2;
    return false;
}`,
      qs: [207, 210],
    },
  ],

  // ---------------- QUESTIONS ----------------
  questions: {
    733: {
      oneLine: 'Start cell se DFS/BFS: jo 4-directional neighbor start color ka hai use naya color do. start == color ho toh kuch mat karo.',
      pattern: 'Grid Flood Fill (DFS / BFS)',
      approaches: [
        {
          level: 'DFS (Recursive)', idea: 'dfs(r, c): bahar ya alag color → return; warna color badlo aur 4 directions me dfs. Recolor hi visited ka kaam karta hai — isliye start == color pe pehle hi ruk jao (warna infinite recursion).',
          time: 'O(m·n)', space: 'O(m·n) recursion stack (worst case)',
          code: `public int[][] floodFill(int[][] image, int sr, int sc, int color) {
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
}`,
        },
        {
          level: 'BFS (Queue)', idea: 'Start cell queue me, turant recolor. Poll karo, 4 neighbors me se jo start color ke hain unhe recolor karke queue me daalo. Recursion nahi → bade grid pe StackOverflow ka darr nahi.',
          time: 'O(m·n)', space: 'O(m·n) queue',
          code: `public int[][] floodFill(int[][] image, int sr, int sc, int color) {
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
}`,
        },
      ],
      dryRun: 'image = [[1,1,1],[1,1,0],[1,0,1]], (1,1) → 2: start = 1. DFS (1,1)→(2,1)✗0→(0,1)→(0,0)→(1,0)→(2,0) … (0,2). (2,2) wala 1 connected nahi → [[2,2,2],[2,2,0],[2,0,1]]',
      interview: 'I treat the image as a graph where each pixel connects to its four neighbours. Starting from (sr, sc), I run a DFS that recolors every connected pixel with the original color; the recoloring itself acts as the visited marker. If the original color already equals the new color I return immediately, otherwise the recursion would loop forever. O(m·n) time and O(m·n) space in the worst case; a BFS with a queue avoids deep recursion.',
      problem: {
        statement: 'Ek <b>m × n</b> image (2D integer grid) di hai, jahan <code>image[i][j]</code> pixel ka color hai. Saath me <b>sr, sc</b> (start pixel) aur naya <b>color</b> diya hai. Start pixel se <b>flood fill</b> karo: start pixel aur uske saath <b>4 directions (upar/neeche/left/right)</b> me jude hue saare pixels jinka color start pixel ke <b>original color</b> jaisa hai — un sabko naya color do. Modified image return karo.',
        examples: [
          { input: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2', output: '[[2,2,2],[2,2,0],[2,0,1]]', explain: 'Start (1,1) ka color 1 hai. Usse jude saare 1 → 2. Neeche-right wala (2,2) ka 1 diagonal se juda hai, 4-direction se nahi → wahi rehta hai.', viz: { image: '[[1,1,1],[1,1,0],[1,0,1]]', sr: '1', sc: '1', color: '2' } },
          { input: 'image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0', output: '[[0,0,0],[0,0,0]]', explain: 'Start ka color pehle se 0 hai = naya color. Kuch change nahi.', viz: { image: '[[0,0,0],[0,0,0]]', sr: '0', sc: '0', color: '0' } },
          { input: 'image = [[0,0,0],[0,1,0]], sr = 0, sc = 0, color = 3', output: '[[3,3,3],[3,1,3]]', explain: 'Saare 0 ek-doosre se jude hain (1 ke chaaron taraf ghoom ke) → sab 3. Beech ka 1 alag color hai.', viz: { image: '[[0,0,0],[0,1,0]]', sr: '0', sc: '0', color: '3' } },
        ],
        constraints: ['m == image.length, n == image[i].length', '1 ≤ m, n ≤ 50', '0 ≤ image[i][j], color < 2¹⁶', '0 ≤ sr < m, 0 ≤ sc < n'],
      },
    },

    841: {
      oneLine: 'rooms = adjacency list (room → keys). Room 0 se DFS/BFS + visited; end me sab visited? → true.',
      pattern: 'Reachability (Graph Traversal)',
      approaches: [
        {
          level: 'DFS (Recursive)', idea: 'Room 0 se dfs: room visited mark karo, uski har key (jo room abhi nahi dekha) pe dfs. End me seen[] me koi false hai toh false.',
          time: 'O(N + K) — N rooms, K total keys', space: 'O(N) seen + recursion',
          code: `public boolean canVisitAllRooms(List<List<Integer>> rooms) {
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
}`,
        },
        {
          level: 'BFS (Queue)', idea: 'Queue me room 0. Poll karo, uski keys se naye rooms kholo (push karte waqt seen mark + visited++). End me visited == n.',
          time: 'O(N + K)', space: 'O(N)',
          code: `public boolean canVisitAllRooms(List<List<Integer>> rooms) {
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
}`,
        },
      ],
      dryRun: 'rooms = [[1],[2],[3],[]] → 0 khula, key 1 → room 1, key 2 → room 2, key 3 → room 3. visited = 4 = n → true',
      interview: 'The rooms list is already an adjacency list: room i has edges to the rooms its keys open. The question is whether every node is reachable from node 0, so I run a BFS or DFS from room 0 with a visited array and check at the end that all rooms were visited. Each room and each key is processed once, giving O(N + K) time and O(N) space.',
      problem: {
        statement: '<b>n</b> rooms hain (0 se n−1), room 0 ke alawa sab <b>locked</b> hain. <code>rooms[i]</code> = room i ke andar rakhi keys ki list; har key kisi room ka number hai. Room me ghusoge toh uski saari keys mil jaayengi. Room 0 se shuru karke kya tum <b>saare rooms</b> visit kar sakte ho? <code>true</code>/<code>false</code> return karo.',
        examples: [
          { input: 'rooms = [[1],[2],[3],[]]', output: 'true', explain: 'Room 0 → key 1 → room 1 → key 2 → room 2 → key 3 → room 3. Saare rooms visit ho gaye.', viz: { rooms: '[[1],[2],[3],[]]' } },
          { input: 'rooms = [[1,3],[3,0,1],[2],[0]]', output: 'false', explain: 'Room 2 ki key sirf room 2 ke andar hai — wahan kabhi nahi ghus sakte.', viz: { rooms: '[[1,3],[3,0,1],[2],[0]]' } },
        ],
        constraints: ['n == rooms.length', '2 ≤ n ≤ 1000', '0 ≤ rooms[i].length ≤ 1000', '1 ≤ sum(rooms[i].length) ≤ 3000', '0 ≤ rooms[i][j] < n', 'rooms[i] ki values unique'],
      },
    },

    200: {
      oneLine: 'Grid scan karo; har naya "1" mile → count++ aur DFS/BFS se poora island "0" (sink) kar do.',
      pattern: 'Grid Flood Fill — Connected Components',
      approaches: [
        {
          level: 'DFS (Recursive, sink)', idea: 'Har cell check: "1" hai toh naya island → count++, fir dfs se us island ke saare jude "1" ko "0" bana do taaki dobara count na ho. Islands = connected components.',
          time: 'O(m·n)', space: 'O(m·n) recursion (worst: poora grid land)',
          code: `public int numIslands(char[][] grid) {
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
}`,
        },
        {
          level: 'BFS (Queue)', idea: 'Same scan. Naya "1" mila → count++, us cell ko queue me daal ke BFS: har poll pe 4 neighbors me jo "1" hain unhe "0" karke queue me. Recursion nahi.',
          time: 'O(m·n)', space: 'O(min(m, n)) queue (BFS frontier)',
          code: `public int numIslands(char[][] grid) {
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
}`,
        },
      ],
      dryRun: 'Example 2: (0,0) "1" → count 1, sink {(0,0),(0,1),(1,0),(1,1)}. (2,2) → count 2. (3,3) → count 3, sink (3,4). Answer 3',
      interview: 'Each island is a connected component of land cells in a grid graph. I scan every cell; when I find unvisited land I increment the count and flood the whole island with DFS or BFS, sinking it to "0" so it is never counted again. Every cell is visited a constant number of times, so it is O(m·n) time; space is the recursion depth or queue size, O(m·n) worst case. If modifying the input is not allowed, I use a separate visited matrix.',
      problem: {
        statement: 'Ek <b>m × n</b> grid hai jisme <code>\'1\'</code> = land aur <code>\'0\'</code> = paani (char values). <b>Island</b> = land cells ka group jo <b>horizontally ya vertically</b> (4 directions) jude hon; grid ke chaaron taraf paani maan lo. Islands ki <b>ginti</b> return karo.',
        examples: [
          { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1', explain: 'Saare 9 land cells ek-doosre se 4-direction me jude hain → 1 island.', viz: { grid: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]' } },
          { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3', explain: 'Upar-left 2×2 block, beech ka (2,2), aur neeche-right (3,3)-(3,4). Diagonal judna count nahi hota → 3 islands.', viz: { grid: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]' } },
        ],
        constraints: ['m == grid.length, n == grid[i].length', '1 ≤ m, n ≤ 300', 'grid[i][j] = \'0\' ya \'1\''],
      },
    },

    994: {
      oneLine: 'Multi-source BFS: saare rotten (2) ek saath queue me; har level = 1 minute; end me fresh bacha → −1.',
      pattern: 'Multi-source BFS (level by level)',
      approaches: [
        {
          level: 'Brute (minute-by-minute simulation)', idea: 'Har minute poora grid scan karo: jo fresh orange kisi rotten ke bagal me hai use "toRot" list me daalo (seedha 2 mat karo, warna usi minute me aage fail jaayega). List khaali → ruk jao. End me koi 1 bacha → −1.',
          time: 'O((m·n)²) — har minute O(m·n), minutes ≤ m·n', space: 'O(m·n)',
          code: `public int orangesRotting(int[][] grid) {
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
}`,
        },
        {
          level: 'Optimal (Multi-source BFS)', idea: 'Shuru me saare rotten cells queue me aur fresh ginti. BFS level by level: ek level (q.size()) ke saare rotten apne fresh neighbors ko rot karte hain (fresh−−, queue me). Har level ke baad minutes++. Har cell ek hi baar queue me.',
          time: 'O(m·n)', space: 'O(m·n) queue',
          code: `public int orangesRotting(int[][] grid) {
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
}`,
        },
      ],
      dryRun: '[[2,1,1],[1,1,0],[0,1,1]] → fresh 6. min1: (1,0),(0,1) · min2: (1,1),(0,2) · min3: (2,1) · min4: (2,2) → fresh 0 → 4',
      interview: 'Rot spreads from all rotten oranges at the same time, one step per minute, which is exactly a multi-source BFS. I push every rotten orange into the queue first and count the fresh ones. Then I process the queue level by level: each level is one minute, and every fresh neighbour becomes rotten and joins the next level. When the queue empties, if any fresh orange is left I return −1, otherwise the number of levels. O(m·n) time and space.',
      problem: {
        statement: '<b>m × n</b> grid me har cell: <code>0</code> = khaali, <code>1</code> = fresh orange, <code>2</code> = rotten orange. Har minute, rotten orange ke <b>4-directional</b> bagal wala har fresh orange rotten ho jaata hai. <b>Minimum minutes</b> batao jab tak koi fresh orange na bache. Agar kabhi saare rot nahi ho sakte toh <code>−1</code>.',
        examples: [
          { input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4', explain: 'Minute 1: (0,1),(1,0) · Minute 2: (0,2),(1,1) · Minute 3: (2,1) · Minute 4: (2,2). Total 4.', viz: { grid: '[[2,1,1],[1,1,0],[0,1,1]]' } },
          { input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]', output: '-1', explain: 'Neeche-left (2,0) wala orange chaaron taraf se khaali/boundary se ghira hai — kabhi rot nahi hoga.', viz: { grid: '[[2,1,1],[0,1,1],[1,0,1]]' } },
          { input: 'grid = [[0,2]]', output: '0', explain: 'Shuru me hi koi fresh orange nahi → 0 minute.', viz: { grid: '[[0,2]]' } },
        ],
        constraints: ['m == grid.length, n == grid[i].length', '1 ≤ m, n ≤ 10', 'grid[i][j] ∈ {0, 1, 2}'],
      },
    },

    207: {
      oneLine: 'Prerequisites = directed graph. Cycle hai → false. Kahn (indegree BFS: taken == n?) ya DFS 3-color (gray dobara mila = cycle).',
      pattern: 'Topological Sort / Directed Cycle Detection',
      approaches: [
        {
          level: 'DFS (3-color cycle detection)', idea: 'Edge b → a (b pehle). state: 0 = unvisited, 1 = visiting (abhi recursion stack me), 2 = done. DFS me agar kisi neighbor ka state 1 mila → back edge → cycle → false. Done nodes dobara explore nahi hote.',
          time: 'O(V + E)', space: 'O(V + E) adj + O(V) recursion',
          code: `public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) adj.get(p[1]).add(p[0]);
    int[] state = new int[numCourses]; // 0 = unvisited, 1 = visiting, 2 = done
    for (int i = 0; i < numCourses; i++) {
        if (state[i] == 0 && hasCycle(adj, i, state)) return false;
    }
    return true;
}

private boolean hasCycle(List<List<Integer>> adj, int u, int[] state) {
    state[u] = 1;
    for (int v : adj.get(u)) {
        if (state[v] == 1) return true;
        if (state[v] == 0 && hasCycle(adj, v, state)) return true;
    }
    state[u] = 2;
    return false;
}`,
        },
        {
          level: 'Kahn (BFS, indegree)', idea: 'indegree[a] = a ke kitne prerequisites baaki. indegree 0 wale courses queue me. Poll → taken++ → uske dependent courses ka indegree −1, 0 hua toh queue. Cycle wale courses ka indegree kabhi 0 nahi hota → taken < numCourses.',
          time: 'O(V + E)', space: 'O(V + E)',
          code: `public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    int[] indegree = new int[numCourses];
    for (int[] p : prerequisites) {
        adj.get(p[1]).add(p[0]);
        indegree[p[0]]++;
    }
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++) {
        if (indegree[i] == 0) q.offer(i);
    }
    int taken = 0;
    while (!q.isEmpty()) {
        int u = q.poll();
        taken++;
        for (int v : adj.get(u)) {
            if (--indegree[v] == 0) q.offer(v);
        }
    }
    return taken == numCourses;
}`,
        },
      ],
      dryRun: '2, [[1,0],[0,1]] → edges 0→1, 1→0, indegree [1,1] → queue khaali → taken 0 ≠ 2 → false',
      interview: 'Courses are nodes and each prerequisite pair [a, b] is a directed edge b → a. All courses can be finished exactly when this graph has no cycle. I use Kahn\'s algorithm: compute indegrees, start with every course that has none, and repeatedly take a course and decrement its dependents. If the number of courses taken equals numCourses there is no cycle. Alternatively, a DFS with three states detects a back edge to a node still on the recursion stack. Both are O(V + E).',
      problem: {
        statement: 'Tumhe <b>numCourses</b> courses lene hain (0 se numCourses−1). <code>prerequisites[i] = [a, b]</code> ka matlab: course <b>a</b> lene se pehle course <b>b</b> karna zaroori hai. Kya tum <b>saare courses finish</b> kar sakte ho? <code>true</code>/<code>false</code>.',
        examples: [
          { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true', explain: 'Pehle 0, fir 1. Ho jaayega.', viz: { numCourses: '2', prerequisites: '[[1,0]]' } },
          { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false', explain: '1 ke liye 0 chahiye aur 0 ke liye 1 — cycle. Koi bhi pehle nahi ho sakta.', viz: { numCourses: '2', prerequisites: '[[1,0],[0,1]]' } },
          { input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', output: 'true', explain: '0 → (1, 2) → 3. Koi cycle nahi, order 0, 1, 2, 3.', viz: { numCourses: '4', prerequisites: '[[1,0],[2,0],[3,1],[3,2]]' } },
        ],
        constraints: ['1 ≤ numCourses ≤ 2000', '0 ≤ prerequisites.length ≤ 5000', 'prerequisites[i].length == 2', '0 ≤ a, b < numCourses', 'Saare pairs unique'],
      },
    },

    210: {
      oneLine: 'LC 207 + order bhi chahiye: Kahn me poll order hi answer; cycle (k < n) → empty array.',
      pattern: 'Topological Sort (Kahn / DFS postorder)',
      approaches: [
        {
          level: 'DFS (prerequisites pehle, postorder)', idea: 'Ulta graph banao: course → uske prerequisites. dfs(u): pehle saare prerequisites (dfs), fir u ko order me likho (postorder). 3-color: visiting node dobara mila → cycle → empty. Is direction me postorder khud hi valid order hai — reverse nahi karna padta.',
          time: 'O(V + E)', space: 'O(V + E)',
          code: `private int idx;

public int[] findOrder(int numCourses, int[][] prerequisites) {
    List<List<Integer>> pre = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) pre.add(new ArrayList<>());
    for (int[] p : prerequisites) pre.get(p[0]).add(p[1]);
    int[] state = new int[numCourses];
    int[] order = new int[numCourses];
    idx = 0;
    for (int i = 0; i < numCourses; i++) {
        if (state[i] == 0 && !dfs(pre, i, state, order)) return new int[0];
    }
    return order;
}

private boolean dfs(List<List<Integer>> pre, int u, int[] state, int[] order) {
    state[u] = 1;
    for (int v : pre.get(u)) {
        if (state[v] == 1) return false;
        if (state[v] == 0 && !dfs(pre, v, state, order)) return false;
    }
    state[u] = 2;
    order[idx++] = u;
    return true;
}`,
        },
        {
          level: 'Kahn (BFS, indegree)', idea: 'LC 207 ka Kahn, bas poll karte waqt course ko order[k++] me likho. End me k == numCourses toh order, warna cycle → new int[0].',
          time: 'O(V + E)', space: 'O(V + E)',
          code: `public int[] findOrder(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    int[] indegree = new int[numCourses];
    for (int[] p : prerequisites) {
        adj.get(p[1]).add(p[0]);
        indegree[p[0]]++;
    }
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++) {
        if (indegree[i] == 0) q.offer(i);
    }
    int[] order = new int[numCourses];
    int k = 0;
    while (!q.isEmpty()) {
        int u = q.poll();
        order[k++] = u;
        for (int v : adj.get(u)) {
            if (--indegree[v] == 0) q.offer(v);
        }
    }
    return k == numCourses ? order : new int[0];
}`,
        },
      ],
      dryRun: '4, [[1,0],[2,0],[3,1],[3,2]] → indegree [0,1,1,2], q [0] → order 0 → q [1,2] → 1 (indeg[3]=1) → 2 (indeg[3]=0, q [3]) → 3 → [0,1,2,3]',
      interview: 'This is topological sorting. I build the graph with an edge from each prerequisite to the course that needs it and compute indegrees. Kahn\'s algorithm starts with all zero-indegree courses; each time I poll a course I append it to the order and decrement its dependents, enqueuing any that reach zero. If I placed all numCourses courses, that order is valid; otherwise a cycle exists and I return an empty array. O(V + E) time and space. A DFS postorder on the prerequisite graph gives an equally valid order.',
      problem: {
        statement: 'LC 207 jaisa: <b>numCourses</b> courses, <code>prerequisites[i] = [a, b]</code> = "a se pehle b". Is baar saare courses lene ka <b>ek valid order</b> return karo. Kai valid orders ho sakte hain — koi bhi chalega. Agar saare courses finish karna impossible hai (cycle) toh <b>empty array</b> return karo.',
        examples: [
          { input: 'numCourses = 2, prerequisites = [[1,0]]', output: '[0,1]', explain: '1 ke liye pehle 0 chahiye → [0, 1].', viz: { numCourses: '2', prerequisites: '[[1,0]]' } },
          { input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', output: '[0,1,2,3]', explain: '0 sabse pehle, fir 1 aur 2 (kisi bhi order me), 3 sabse last. [0,2,1,3] bhi valid hai.', viz: { numCourses: '4', prerequisites: '[[1,0],[2,0],[3,1],[3,2]]' } },
          { input: 'numCourses = 1, prerequisites = []', output: '[0]', explain: 'Ek hi course, koi prerequisite nahi.', viz: { numCourses: '1', prerequisites: '[]' } },
          { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: '[]', explain: 'Cycle 0 ⇄ 1 → koi order possible nahi → empty array.', viz: { numCourses: '2', prerequisites: '[[1,0],[0,1]]' } },
        ],
        constraints: ['1 ≤ numCourses ≤ 2000', '0 ≤ prerequisites.length ≤ numCourses × (numCourses − 1)', 'prerequisites[i].length == 2', '0 ≤ a, b < numCourses, a ≠ b', 'Saare pairs distinct'],
      },
    },

    417: {
      oneLine: 'Ulta socho: Pacific border se aur Atlantic border se "upar chadhte hue" (h[next] ≥ h[cur]) DFS/BFS; dono me reachable = answer.',
      pattern: 'Reverse Multi-source DFS / BFS from borders',
      approaches: [
        {
          level: 'Brute (har cell se DFS)', idea: 'Har cell se naya DFS (naya visited) jo sirf neeche/barabar height pe jaata hai. Raste me top/left border chhua → Pacific, bottom/right chhua → Atlantic. Dono true → answer. Har cell ka DFS O(m·n) → total O((m·n)²).',
          time: 'O((m·n)²)', space: 'O(m·n) per DFS',
          code: `public List<List<Integer>> pacificAtlantic(int[][] heights) {
    int m = heights.length, n = heights[0].length;
    List<List<Integer>> res = new ArrayList<>();
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            boolean[] reach = new boolean[2]; // [0] = Pacific, [1] = Atlantic
            dfs(heights, r, c, new boolean[m][n], reach);
            if (reach[0] && reach[1]) res.add(Arrays.asList(r, c));
        }
    }
    return res;
}

private void dfs(int[][] h, int r, int c, boolean[][] seen, boolean[] reach) {
    int m = h.length, n = h[0].length;
    seen[r][c] = true;
    if (r == 0 || c == 0) reach[0] = true;
    if (r == m - 1 || c == n - 1) reach[1] = true;
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    for (int[] d : dirs) {
        int nr = r + d[0], nc = c + d[1];
        if (nr < 0 || nr >= m || nc < 0 || nc >= n || seen[nr][nc]) continue;
        if (h[nr][nc] <= h[r][c]) dfs(h, nr, nc, seen, reach);
    }
}`,
        },
        {
          level: 'Optimal (Reverse DFS from oceans)', idea: 'Paani ulta chadhao: Pacific border (row 0, col 0) ke har cell se DFS jo sirf barabar/oonchi height pe jaata hai (h[r][c] ≥ prev) → pac[][]. Waise hi Atlantic border (last row, last col) se → atl[][]. Har cell har ocean ke liye ek hi baar mark hota hai. pac && atl wale cells answer.',
          time: 'O(m·n)', space: 'O(m·n)',
          code: `public List<List<Integer>> pacificAtlantic(int[][] heights) {
    int m = heights.length, n = heights[0].length;
    boolean[][] pac = new boolean[m][n], atl = new boolean[m][n];
    for (int r = 0; r < m; r++) {
        dfs(heights, r, 0, pac, Integer.MIN_VALUE);
        dfs(heights, r, n - 1, atl, Integer.MIN_VALUE);
    }
    for (int c = 0; c < n; c++) {
        dfs(heights, 0, c, pac, Integer.MIN_VALUE);
        dfs(heights, m - 1, c, atl, Integer.MIN_VALUE);
    }
    List<List<Integer>> res = new ArrayList<>();
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (pac[r][c] && atl[r][c]) res.add(Arrays.asList(r, c));
        }
    }
    return res;
}

private void dfs(int[][] h, int r, int c, boolean[][] ocean, int prev) {
    if (r < 0 || r >= h.length || c < 0 || c >= h[0].length) return;
    if (ocean[r][c] || h[r][c] < prev) return;
    ocean[r][c] = true;
    dfs(h, r + 1, c, ocean, h[r][c]);
    dfs(h, r - 1, c, ocean, h[r][c]);
    dfs(h, r, c + 1, ocean, h[r][c]);
    dfs(h, r, c - 1, ocean, h[r][c]);
}`,
        },
        {
          level: 'Optimal (Reverse multi-source BFS)', idea: 'Same reverse idea, recursion ke bina: Pacific ke saare border cells ek queue me (multi-source), Atlantic ke doosri me. BFS me neighbor tabhi lo jab height ≥ current. Bade grid pe StackOverflow ka darr nahi.',
          time: 'O(m·n)', space: 'O(m·n)',
          code: `public List<List<Integer>> pacificAtlantic(int[][] heights) {
    int m = heights.length, n = heights[0].length;
    boolean[][] pac = new boolean[m][n], atl = new boolean[m][n];
    Deque<int[]> pq = new ArrayDeque<>(), aq = new ArrayDeque<>();
    for (int r = 0; r < m; r++) {
        mark(pq, pac, r, 0);
        mark(aq, atl, r, n - 1);
    }
    for (int c = 0; c < n; c++) {
        mark(pq, pac, 0, c);
        mark(aq, atl, m - 1, c);
    }
    bfs(heights, pq, pac);
    bfs(heights, aq, atl);
    List<List<Integer>> res = new ArrayList<>();
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (pac[r][c] && atl[r][c]) res.add(Arrays.asList(r, c));
        }
    }
    return res;
}

private void mark(Deque<int[]> q, boolean[][] ocean, int r, int c) {
    if (ocean[r][c]) return;
    ocean[r][c] = true;
    q.offer(new int[]{r, c});
}

private void bfs(int[][] h, Deque<int[]> q, boolean[][] ocean) {
    int m = h.length, n = h[0].length;
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (!q.isEmpty()) {
        int[] cur = q.poll();
        for (int[] d : dirs) {
            int r = cur[0] + d[0], c = cur[1] + d[1];
            if (r < 0 || r >= m || c < 0 || c >= n || ocean[r][c]) continue;
            if (h[r][c] < h[cur[0]][cur[1]]) continue;
            ocean[r][c] = true;
            q.offer(new int[]{r, c});
        }
    }
}`,
        },
      ],
      dryRun: 'heights = [[2,1],[1,2]] → pac: row 0 + col 0 = (0,0),(0,1),(1,0); (1,1)=2 ≥ 1 → pac. atl: row 1 + col 1 = (1,0),(1,1),(0,1); (0,0)=2 ≥ 1 → atl. Sab 4 cells',
      interview: 'Checking every cell separately costs O((m·n)²). Instead I reverse the flow: water reaching an ocean from a cell means I can climb from that ocean\'s border to the cell through non-decreasing heights. I run a DFS or multi-source BFS from all Pacific border cells and another from all Atlantic border cells, each moving only to neighbours of equal or greater height, marking two boolean grids. Cells marked in both are the answer. Each cell is visited at most twice, so O(m·n) time and space.',
      problem: {
        statement: '<b>m × n</b> island ka <code>heights</code> grid hai. <b>Pacific</b> ocean island ke <b>top aur left</b> edge ko chhoota hai, <b>Atlantic</b> ocean <b>bottom aur right</b> edge ko. Baarish ka paani ek cell se 4-directional neighbor me tabhi bahta hai jab neighbor ki height <b>≤</b> current height ho; edge wale cells se paani seedha ocean me jaata hai. Un saare cells <code>[r, c]</code> ki list return karo jahan se paani <b>dono</b> oceans tak pahunch sake.',
        examples: [
          { input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]', explain: 'Jaise (2,2)=5: upar (1,2)=3 → (0,2) Pacific; right (2,3)=3 → (2,4)=1 Atlantic. Dono → answer me.', viz: { heights: '[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]' } },
          { input: 'heights = [[1]]', output: '[[0,0]]', explain: 'Akela cell chaaron edges pe hai → dono oceans.', viz: { heights: '[[1]]' } },
          { input: 'heights = [[2,1],[1,2]]', output: '[[0,0],[0,1],[1,0],[1,1]]', explain: '(0,1) aur (1,0) dono oceans ke border pe hain; (0,0)=2 aur (1,1)=2 unme beh sakte hain → saare 4.', viz: { heights: '[[2,1],[1,2]]' } },
        ],
        constraints: ['m == heights.length, n == heights[r].length', '1 ≤ m, n ≤ 200', '0 ≤ heights[r][c] ≤ 10⁵'],
      },
    },
  },

  // ---------------- DAYS ----------------
  days: [
    {
      day: 1, week: 1, dow: 'Mon', type: 'learn', title: 'Graph Basics + Grid as Graph (Flood Fill DFS)',
      theory: ['Graph = nodes + edges', 'Grid cell = node, 4 directions = edges', 'DFS recursion + bounds check', 'start == color edge case'],
      qs: [733],
      interview: {
        q: 'What is a graph, and how is a grid a graph?',
        a: 'A graph is a set of nodes connected by edges, which can be directed or undirected. A grid is an implicit graph: every cell is a node and it has edges to its up, down, left and right neighbours, so I never build an adjacency list — I compute neighbours with a directions array and a bounds check. Any traversal on it, DFS or BFS, visits each cell a constant number of times, so it runs in O(m·n). The key extra piece compared to trees is a visited marker, because graphs can have cycles.',
      },
    },
    {
      day: 2, week: 1, dow: 'Tue', type: 'learn', title: 'Adjacency List + BFS/DFS on a Graph',
      theory: ['Edge list vs adjacency list vs matrix', 'List<List<Integer>> adj', 'boolean[] seen', 'Reachability from a source'],
      qs: [841],
      interview: {
        q: 'Adjacency list vs adjacency matrix — which do you use and why?',
        a: 'An adjacency list stores, for every node, the list of its neighbours, so it takes O(V + E) space and iterating neighbours costs only the node\'s degree. An adjacency matrix is a V by V table: O(V squared) space, but checking whether a specific edge exists is O(1). Most interview graphs are sparse, so I default to List<List<Integer>> in Java. I would pick a matrix only for small dense graphs or when I need constant-time edge lookups.',
      },
    },
    {
      day: 3, week: 1, dow: 'Wed', type: 'learn', title: 'Connected Components in a Grid (Islands, DFS)',
      theory: ['Component = island', 'Scan + DFS sink', 'In-place mark vs visited[][]', 'Recursion depth'],
      qs: [200],
      interview: {
        q: 'How do you count connected components?',
        a: 'I loop over every node; whenever I find one that is not yet visited, that is a new component, so I increment the counter and run a DFS or BFS from it that marks everything reachable. Nodes already marked are skipped, so each node and edge is processed once and the total cost is O(V + E). In a grid like Number of Islands the nodes are land cells and I can mark them by sinking them in place, or use a separate visited matrix if the input must stay unchanged.',
      },
    },
    {
      day: 4, week: 1, dow: 'Thu', type: 'learn', title: 'BFS vs DFS (Islands + Flood Fill with a Queue)',
      theory: ['Queue = level by level', 'Mark when you push', 'StackOverflow risk of DFS', 'Kab BFS, kab DFS'],
      qs: [200, 733],
      interview: {
        q: 'When do you choose BFS over DFS?',
        a: 'Both visit every reachable node in O(V + E). I choose BFS when the problem talks about the shortest path in an unweighted graph, minimum steps, or levels, because BFS explores nodes in order of distance. I choose DFS when I just need reachability, counting, or path exploration and the code is simpler with recursion. On very large grids I prefer BFS or an iterative stack, because recursive DFS can overflow the call stack. In BFS I always mark nodes visited when I push them, not when I pop them.',
      },
    },
    {
      day: 5, week: 1, dow: 'Fri', type: 'learn', title: 'Multi-source BFS (Rotting Oranges)',
      theory: ['Saare sources ek saath queue me', 'q.size() = ek level = 1 minute', 'fresh counter', '−1 kab'],
      qs: [994],
      interview: {
        q: 'What is multi-source BFS?',
        a: 'Multi-source BFS starts the search from many nodes at once by putting all of them in the queue before the loop, as if they were all at distance zero. Then a normal level-by-level BFS gives, for every node, the distance to its nearest source. It is perfect for things that spread simultaneously, like rotting oranges, fire or the distance to the nearest exit. The cost is still O(V + E), the same as one BFS, instead of running a separate BFS from each source.',
      },
    },
    {
      day: 6, week: 1, dow: 'Sat', type: 'revision', title: 'Revision — Week 19 (Grid + Graph traversal)',
      theory: ['Re-solve bina dekhe (min 3)', 'DFS aur BFS dono likho', 'Timer: Easy 15 min, Medium 25 min', 'System Design session (Sohel)'],
      qs: [733, 841, 200, 994],
      interview: {
        q: 'Walk me through how you test a grid BFS or DFS solution.',
        a: 'I first dry-run the given example and track the queue or recursion and the visited cells. Then I test edge cases: a 1 by 1 grid, a grid with no target cells, a grid that is entirely land or entirely fresh oranges, a target cell on the border to check bounds, and a case where the answer is impossible, like an isolated fresh orange. I also confirm I never revisit a cell, which would show up as an infinite loop or a wrong count.',
      },
    },
    {
      day: 7, week: 1, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest',
      theory: ['30 min: Tum interviews Sohvi (LC 841 bina dekhe)', '30 min: Sohvi interviews Tum (LC 994 bina dekhe)', '30 min: Weekly contest discussion', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [841, 994],
      interview: {
        q: 'How do you recognise that a problem is a graph problem?',
        a: 'I look for entities and relationships between them: cells connected to neighbours, rooms linked by keys, courses depending on other courses, people who are friends. Phrases like connected, reachable, spread, islands, dependencies or order of tasks are strong signals. Once I see it, I decide whether the edges are directed, pick a representation — often the grid itself or an adjacency list — and then choose BFS for shortest or level problems, DFS for reachability and components, and topological sort for dependencies.',
      },
    },
    {
      day: 8, week: 2, dow: 'Mon', type: 'learn', title: 'Directed Graph + Topological Sort (Kahn)',
      theory: ['[a, b] → edge b → a', 'Indegree', 'Kahn: indegree 0 queue', 'taken < n ⇒ cycle'],
      qs: [207],
      interview: {
        q: 'Explain Kahn\'s algorithm.',
        a: 'Kahn\'s algorithm produces a topological order of a directed graph. I compute the indegree of every node and put all nodes with indegree zero in a queue — they have no remaining dependencies. Then I repeatedly poll a node, add it to the order, and decrement the indegree of each of its neighbours, enqueuing any that drop to zero. If the order ends up containing every node, the graph is a DAG; if some nodes are never enqueued, they are part of a cycle. It runs in O(V + E).',
      },
    },
    {
      day: 9, week: 2, dow: 'Tue', type: 'learn', title: 'Cycle Detection with DFS (3-color)',
      theory: ['white / gray / black = 0 / 1 / 2', 'Gray dobara = back edge = cycle', 'Undirected vs directed cycle', 'Kahn vs DFS'],
      qs: [207],
      interview: {
        q: 'How do you detect a cycle in a directed graph with DFS?',
        a: 'I keep three states per node: unvisited, visiting — meaning it is on the current recursion stack — and done. When DFS enters a node I mark it visiting; if I ever reach a neighbour that is still visiting, I have found a back edge, which means a cycle. When all neighbours are finished I mark the node done, and done nodes are never explored again, so the total cost is O(V + E). A plain boolean visited array is not enough, because reaching an already finished node through another path is not a cycle.',
      },
    },
    {
      day: 10, week: 2, dow: 'Wed', type: 'learn', title: 'Topological Order (Course Schedule II)',
      theory: ['Kahn poll order = answer', 'Cycle → new int[0]', 'DFS postorder on prerequisite graph', 'Many valid orders'],
      qs: [210, 207],
      interview: {
        q: 'What is a topological sort and where is it used?',
        a: 'A topological sort is a linear ordering of the nodes of a directed acyclic graph in which every edge goes from an earlier node to a later one, so every task comes after its dependencies. It exists only when there is no cycle, and there can be many valid orders. I compute it with Kahn\'s indegree BFS or with DFS postorder, both O(V + E). Real uses include course scheduling, build systems and package managers resolving dependencies, task schedulers and spreadsheet formula evaluation.',
      },
    },
    {
      day: 11, week: 2, dow: 'Thu', type: 'learn', title: 'Reverse Thinking from Borders (Pacific Atlantic)',
      theory: ['Har cell se DFS = O((mn)²)', 'Ocean se ulta chadho (≥)', 'Do visited grids', 'Intersection = answer'],
      qs: [417],
      interview: {
        q: 'What does "reverse the search" mean in graph problems?',
        a: 'When the question asks which nodes can reach some target set, running a search from every node is expensive — for a grid that is O((m·n) squared). Reversing the search means starting from the targets and walking the edges backwards, with the inverted condition, to find everything that can reach them in a single pass. In Pacific Atlantic I start from each ocean\'s border and only climb to equal or higher cells, then intersect the two reachable sets, bringing it down to O(m·n).',
      },
    },
    {
      day: 12, week: 2, dow: 'Fri', type: 'learn', title: 'Multi-source BFS Again + Graph Catch-up',
      theory: ['417 reverse BFS (queue)', 'Border = multi-source', 'DFS vs BFS same answer', 'Pattern recognition drill'],
      qs: [417, 200],
      interview: {
        q: 'Recursive DFS or iterative BFS for grid problems in production code?',
        a: 'Recursive DFS is shorter and fine for small inputs, but its depth can reach the number of cells — 40,000 for a 200 by 200 grid, and far more for real images — which risks a StackOverflowError on the default JVM stack. Iterative BFS or an explicit stack keeps the frontier on the heap and has predictable memory. So in interviews I often write DFS for clarity and mention the trade-off, and in production I would choose the iterative version.',
      },
    },
    {
      day: 13, week: 2, dow: 'Sat', type: 'revision', title: 'Revision — Week 20 (Topo Sort + Multi-source)',
      theory: ['Kahn + DFS 3-color dono', 'Multi-source BFS template', 'Reverse thinking', 'System Design session (Sohel)'],
      qs: [207, 210, 994, 417],
      interview: {
        q: 'Compare Kahn\'s algorithm and DFS for topological sorting.',
        a: 'Both run in O(V + E). Kahn\'s algorithm is iterative: it uses indegrees and a queue, produces the order directly, and detects a cycle when fewer than V nodes are output. It is easy to explain and has no recursion depth issues. DFS uses three-colour states, detects a cycle as a back edge to a node still on the stack, and produces the order from postorder, reversed when edges point from prerequisite to course. I default to Kahn in interviews and mention DFS as the alternative.',
      },
    },
    {
      day: 14, week: 2, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest (Graphs final)',
      theory: ['30 min: Tum interviews Sohvi (LC 733 bina dekhe)', '30 min: Sohvi interviews Tum (LC 210 bina dekhe)', '30 min: Weekly contest discussion', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [733, 210],
      interview: {
        q: 'What is the time complexity of BFS and DFS, and why?',
        a: 'Both are O(V + E) with an adjacency list. Every vertex is marked visited once, so it is enqueued or entered once, which is the V part. Each vertex\'s adjacency list is scanned once when that vertex is processed, and the lengths of all lists add up to E for directed graphs or 2E for undirected ones, which is the E part. The space is O(V) for the visited array plus the queue or recursion stack. On a grid V is m·n and E is at most 4·m·n, so it is O(m·n).',
      },
    },
  ],

  // ---------------- LAST MINUTE ----------------
  lastMinute: {
    triggers: [
      ['Grid me connected same-type cells / fill', 'Flood fill DFS/BFS (LC 733)'],
      ['Count islands / groups / components', 'Scan + DFS sink, count++ har nayi DFS pe (LC 200)'],
      ['Kya source se saare nodes reach ho sakte hain', 'BFS/DFS + visited, end me count == n (LC 841)'],
      ['Ek saath failna, minimum minutes / steps', 'Multi-source BFS level by level (LC 994)'],
      ['Shortest path, unweighted', 'BFS (levels = distance)'],
      ['Prerequisites / dependencies — possible?', 'Cycle detection: Kahn ya DFS 3-color (LC 207)'],
      ['Dependencies ka order chahiye', 'Topological sort — Kahn poll order (LC 210)'],
      ['"Kaun se cells X tak pahunchte hain"', 'Reverse: X (border) se ulti condition pe DFS/BFS (LC 417)'],
    ],
    edge: [
      '1 × 1 grid / single node',
      'Flood fill: start color == new color (infinite recursion!)',
      'Rotting: koi fresh nahi → 0; isolated fresh → −1; koi rotten nahi par fresh hai → −1',
      'Courses: prerequisites khaali → sab possible, order 0..n−1',
      'Self-loop / 2-node cycle [[1,0],[0,1]]',
      'Disconnected graph — har node se loop (sirf node 0 se nahi)',
      'Bade grid pe recursion depth (StackOverflow) → BFS',
    ],
    mistakes: [
      'Visited bhool jaana → infinite loop',
      'BFS me pop pe visited mark karna → ek cell queue me kai baar',
      'Bounds check recursion ke baad karna → ArrayIndexOutOfBounds',
      'LC 200 me char compare: grid[r][c] == 1 (galat) vs == \'1\'',
      '[a, b] ka direction ulta lena (edge b → a hai)',
      'Directed cycle ke liye sirf boolean visited (galat "cycle" milega)',
      'LC 994 me minutes++ last level ke baad bhi → answer +1 (loop me fresh > 0 check)',
      'LC 417 me condition ulti (reverse me h[next] ≥ h[cur])',
    ],
  },
};
