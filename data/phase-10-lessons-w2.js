// Phase 10 (Graphs) — Week 2 lessons (local days 8–14). Day-1 format.
(function () {
  const P = window.PHASE_CONTENT['graphs'];
  P.lessons = P.lessons || {};
  Object.assign(P.lessons, {
    8: {
      title: 'Directed Graph + Topological Sort (Kahn)',
      goal: '<b>Directed graph</b>, <b>indegree</b>, aur <b>Kahn\'s algorithm</b> (BFS topological sort). LC 207 Course Schedule: cycle hai toh courses finish nahi ho sakte — <code>taken &lt; n</code> se pakdo.',
      main: 207,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 994, LC 142, LC 347',
          blocks: [
            { h: '1) LC 994 Rotting Oranges (Week 19)' },
            { p: '<b>Problem:</b> saare oranges rot hone ka minimum time, ya −1.' },
            { pre: '[[2,1,1],[1,1,0],[0,1,1]] → 4' },
            { p: '<b>Pattern:</b> Multi-source BFS.' },
            { olist: ['Saare 2 queue me, fresh gino.', 'size loop = 1 minute; fresh neighbors rot + offer.', 'fresh == 0 ? minutes : −1.'] },
            { code: `while (!q.isEmpty() && fresh > 0) {
    int size = q.size();
    for (int i = 0; i < size; i++) { /* poll + spread */ }
    minutes++;
}
return fresh == 0 ? minutes : -1;` },
            { tip: 'Memory hook: <b>Queue me "ready" cheezein</b> — aaj Kahn me bhi queue me wahi courses jo "ready" (indegree 0) hain.' },
            { h: '2) LC 142 Linked List Cycle II (Phase 4)' },
            { p: '<b>Problem:</b> cycle ka start node.' },
            { pre: '3 → 2 → 0 → −4 → (2) → node 2' },
            { p: '<b>Pattern:</b> Floyd — meet point ke baad ek pointer head se.' },
            { olist: ['slow/fast milte hain.', 'p = head; p aur slow dono 1-1 step.', 'Jahan milein = cycle start.'] },
            { code: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) {
        ListNode p = head;
        while (p != slow) { p = p.next; slow = slow.next; }
        return p;
    }
}
return null;` },
            { tip: 'Memory hook: <b>Milne ke baad, head se ek aur chalao — dobara milan = entry.</b> Aaj ka topic: general directed graph me cycle.' },
            { h: '3) LC 347 Top K Frequent Elements (Phase 8)' },
            { p: '<b>Problem:</b> k sabse frequent elements.' },
            { pre: '[1,1,1,2,2,3], k = 2 → [1,2]' },
            { p: '<b>Pattern:</b> HashMap freq + min-heap size k.' },
            { olist: ['freq map.', 'Min-heap by freq; size > k → poll.', 'Heap me bache = answer.'] },
            { code: `Map<Integer, Integer> freq = new HashMap<>();
for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> freq.get(a) - freq.get(b));
for (int x : freq.keySet()) {
    pq.offer(x);
    if (pq.size() > k) pq.poll();
}` },
            { tip: 'Memory hook: <b>Top k bade → min-heap size k.</b>' },
          ],
        },
        {
          title: 'Part 1 — Concept: Directed graph, indegree, topological order',
          blocks: [
            { p: '<b>Directed edge</b> <code>b → a</code> = "b pehle, a baad me". <b>Indegree(a)</b> = a me kitne arrows aate hain = a ke kitne prerequisites baaki.' },
            { pre: `prerequisites = [[1,0],[2,0],[3,1],[3,2]]     [a, b] = "a se pehle b"
Edge b → a:

        0
       / \\
      ↓   ↓
      1   2           indegree = [0, 1, 1, 2]
       \\ /
        ↓
        3` },
            { p: '<b>Topological order</b> = aisi line jisme har edge ka tail pehle aaye: <code>[0, 1, 2, 3]</code> ya <code>[0, 2, 1, 3]</code>. Sirf <b>DAG</b> (no cycle) ka hota hai.' },
            { pre: `Cycle:  0 ⇄ 1      indegree = [1, 1]
Koi bhi indegree 0 nahi → koi shuru hi nahi kar sakta → impossible` },
            { p: '<b>Kahn\'s algorithm</b> (BFS):' },
            { olist: [
              'Adjacency list + indegree banao.',
              'Indegree 0 wale sab queue me (ready courses).',
              'Poll u → le liya (taken++). u ke har neighbor v: <code>--indegree[v]</code>; 0 hua toh queue.',
              'End: <code>taken == n</code> → no cycle. Kam → cycle wale kabhi 0 nahi hue.',
            ] },
            { tip: '<b>Direction yaad rakho:</b> <code>[a, b]</code> me edge <b>b → a</b> (prerequisite se course). Ulta kiya toh bhi cycle detection sahi aayega, par LC 210 ka order ulta ho jaayega.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 207 Course Schedule',
          blocks: [{ problem: 207 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Graph model:</b> courses = nodes, <code>[a, b]</code> = edge b → a. Sawaal = "<b>kya graph me cycle hai?</b>" Cycle → false.' },
            { p: '<b>Brute:</b> har course se DFS karke dekho kya wapas usi course pe aate ho (boolean visited har start ke liye naya) → O(V·(V + E)).' },
            { p: '<b>Optimal 1 — Kahn (aaj):</b> "jo ready hai woh lo" — real life jaisa. O(V + E). Recursion nahi.' },
            { p: '<b>Optimal 2 — DFS 3-color (kal):</b> gray node dobara mila = cycle. O(V + E).' },
            { table: { head: ['Step', 'Kyun kaam karta hai'], rows: [
              ['Indegree 0 se shuru', 'Unke koi prerequisites nahi — abhi le sakte ho'],
              ['Lene pe dependents ka indegree −1', 'Ek prerequisite poora hua'],
              ['0 hua toh queue', 'Ab woh bhi ready'],
              ['Cycle ke nodes', 'Ek-doosre ka wait — indegree kabhi 0 nahi → kabhi queue me nahi'],
            ] } },
          ],
        },
        {
          title: 'Part 4 — Dry run: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]',
          blocks: [
            { p: 'Build: adj[0] = [1, 2], adj[1] = [3], adj[2] = [3]. indegree = [0, 1, 1, 2]. Queue = [0].' },
            { table: { head: ['poll u', 'taken', 'Neighbors: --indegree', 'indegree after', 'q after'], rows: [
              ['0', '1', '1 → 0 (offer), 2 → 0 (offer)', '[0, 0, 0, 2]', '[1, 2]'],
              ['1', '2', '3 → 1', '[0, 0, 0, 1]', '[2]'],
              ['2', '3', '3 → 0 (offer)', '[0, 0, 0, 0]', '[3]'],
              ['3', '4', '—', '[0, 0, 0, 0]', '[]'],
            ] } },
            { p: 'taken = 4 == numCourses → <b>true</b> ✓' },
            { p: '<b>Example 2</b> <code>2, [[1,0],[0,1]]</code>: edges 0 → 1, 1 → 0. indegree = [1, 1]. Queue shuru se khaali → taken = 0 ≠ 2 → <b>false</b>.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { code: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
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
    }
}` },
            { lines: [
              ['adj.add(new ArrayList<>()) × n', 'Har course ki khaali list — warna get() pe NPE / IndexOutOfBounds.'],
              ['adj.get(p[1]).add(p[0]);', 'Edge prerequisite (b) → course (a).'],
              ['indegree[p[0]]++;', 'Course a ka ek aur prerequisite.'],
              ['if (indegree[i] == 0) q.offer(i);', 'Ready courses se shuru.'],
              ['taken++;', 'Course le liya.'],
              ['if (--indegree[v] == 0) q.offer(v);', 'Pehle ghatao, fir check — 0 hua toh ab ready.'],
              ['return taken == numCourses;', 'Sab liye → no cycle.'],
            ] },
            { tip: 'Visited array nahi chahiye: node sirf tab queue me jaata hai jab indegree exactly 0 hota hai — ek hi baar.' },
          ],
        },
        {
          title: 'Part 6 — Visualize: indegree + queue',
          blocks: [
            { list: [
              'Graph (directed) arrows prerequisite → course.',
              '<code>indegree</code> array har poll ke baad ghatta hai.',
              'Queue me sirf indegree 0 wale.',
              'Example 2 (cycle) chalao: queue kabhi bharta hi nahi.',
            ] },
            { viz: 207, ex: 2 },
            { viz: 207, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['1, []', 'true', 'Koi prerequisite nahi'],
              ['2, [[1,0],[0,1]]', 'false', '2-node cycle'],
              ['3, [[1,0],[2,1],[0,2]]', 'false', '3-node cycle'],
              ['5, [[1,4],[2,4],[3,1],[3,2]]', 'true', 'Course 0 akela (disconnected) — loop sab nodes se seed karta hai'],
              ['4, [[1,0],[2,1],[3,2],[1,3]]', 'false', 'Cycle 1→2→3→1; course 0 le liya par baaki atke (taken 1)'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute (har node se DFS)', 'O(V·(V + E))', 'O(V + E)'],
              ['Kahn', 'O(V + E)', 'O(V + E) adj + O(V) indegree/queue'],
              ['DFS 3-color (kal)', 'O(V + E)', 'O(V + E)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['[a, b] ka edge direction?', 'b → a (prerequisite se course).'],
              ['Indegree kya batata hai?', 'Kitne prerequisites abhi baaki.'],
              ['Queue me kaun jaata hai?', 'Jinka indegree 0 hai.'],
              ['Cycle kaise pakda?', 'taken < numCourses.'],
              ['Cycle wale nodes queue me kyun nahi aate?', 'Ek-doosre pe depend → indegree kabhi 0 nahi.'],
              ['Visited array kyun nahi chahiye?', 'Indegree exactly 0 pe ek hi baar offer hota hai.'],
              ['Topological order kab exist karta hai?', 'Sirf DAG me.'],
              ['Time?', 'O(V + E).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'Courses are nodes and each pair [a, b] is a directed edge from b to a. All courses can be finished exactly when this graph has no cycle. I use Kahn\'s algorithm: build the adjacency list and indegree array, enqueue every course with indegree zero, then repeatedly poll a course, count it as taken and decrement the indegree of its dependents, enqueuing any that reach zero. Courses on a cycle never reach zero, so if taken equals numCourses there is no cycle. O(V + E) time and space.'],
              ['Follow-up: "Kaunse courses cycle me hain?"', 'After Kahn finishes, every node whose indegree is still greater than zero is either on a cycle or depends on one. To get the exact cycle I would run a DFS with three states and record the path from the node where I hit a gray node.'],
              ['Follow-up: "Edge direction ulta le liya toh?"', 'For cycle detection the answer is the same, because reversing every edge keeps cycles as cycles. But the produced order would be reversed, which matters for Course Schedule II.'],
              ['1-minute: Kahn\'s algorithm', 'Kahn\'s algorithm produces a topological order of a directed graph. I compute the indegree of every node and put all nodes with indegree zero in a queue — they have no remaining dependencies. Then I repeatedly poll a node, add it to the order, and decrement the indegree of each of its neighbours, enqueuing any that drop to zero. If the order contains every node, the graph is a DAG; otherwise some nodes are on a cycle. It runs in O(V + E).'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Apne college ke 4 subjects ka prerequisite graph banao (jaise DSA se pehle Java).',
              'Example 3 ka graph draw karke indegree har node ke paas likho.',
              'Part 4 ki table khud bharo.',
              'Batao: 0 ⇄ 1 me koi shuru kyun nahi kar sakta?',
              'Kahn code padh ke har line apne shabdon me (code yaad karna optional).',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Kahn 10 minute me memory se, submit.',
              '<b>Task B:</b> 5 apne test cases (cycle, disconnected, self-dependency jaisa long chain) bana ke chalao.',
              '<b>Task C:</b> "Kahn\'s algorithm" 1-minute bolo.',
              '<b>Task D:</b> Real-world: build system (Maven/Gradle) me topo sort kahan hai — 3 line likho.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 207 Kahn Accepted.', 'Kal (Day 9): same LC 207, DFS 3-color — recursion + state[] socho.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Kahn ke 4 steps?', 'adj + indegree; indegree 0 queue; poll → taken++, --indegree, 0 → offer; taken == n.'],
              ['4, [[1,0],[2,0],[3,1],[3,2]] ka indegree?', '[0, 1, 1, 2]'],
              ['2, [[1,0],[0,1]] answer?', 'false'],
              ['Edge [a, b] → ?', 'b → a'],
              ['Complexity?', 'O(V + E).'],
            ] },
          ],
        },
      ],
      checks: [
        'Directed edge aur indegree samjha sakta/sakti hu',
        '[a, b] → b → a direction pakka',
        'LC 207 Kahn bina dekhe Accepted',
        'Example 3 ki indegree table banayi',
        'Cycle kyun taken < n deta hai — explain kar sakta/sakti hu',
        'Visualizer me cycle example dekha',
        'Kahn 1-minute answer bola',
      ],
      memory: 'Kahn: ready (indegree 0) lo, dependents ka indegree ghatao; taken < n = cycle.',
    },

    9: {
      title: 'Cycle Detection with DFS (3-color)',
      goal: 'LC 207 ka <b>doosra approach</b>: DFS with <b>3 states</b> (white 0 / gray 1 / black 2). Gray node dobara mila = <b>back edge</b> = cycle. Kahn vs DFS trade-off.',
      main: 207,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 207 (Kahn), LC 236, LC 46',
          blocks: [
            { h: '1) LC 207 Course Schedule — Kahn (kal)' },
            { p: '<b>Problem:</b> saare courses finish ho sakte hain?' },
            { pre: '2, [[1,0],[0,1]] → false · 4, [[1,0],[2,0],[3,1],[3,2]] → true' },
            { p: '<b>Pattern:</b> Topological sort (indegree BFS).' },
            { olist: ['Edge b → a, indegree[a]++.', 'Indegree 0 → queue.', 'Poll → taken++, --indegree.', 'taken == n.'] },
            { code: `while (!q.isEmpty()) {
    int u = q.poll();
    taken++;
    for (int v : adj.get(u)) if (--indegree[v] == 0) q.offer(v);
}
return taken == numCourses;` },
            { tip: 'Memory hook: <b>Ready lo, dependents ghatao.</b>' },
            { h: '2) LC 236 Lowest Common Ancestor of a Binary Tree (Phase 7)' },
            { p: '<b>Problem:</b> p aur q ka sabse neeche common ancestor.' },
            { pre: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1 → 3' },
            { p: '<b>Pattern:</b> Postorder DFS — neeche se info upar.' },
            { olist: ['null / p / q → return root.', 'Left aur right se answer lo.', 'Dono non-null → yahi LCA; warna jo non-null.'] },
            { code: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode l = lowestCommonAncestor(root.left, p, q);
    TreeNode r = lowestCommonAncestor(root.right, p, q);
    if (l != null && r != null) return root;
    return l != null ? l : r;
}` },
            { tip: 'Memory hook: <b>Dono taraf se mila → main hi LCA.</b> Aaj bhi DFS children ka result upar bhejega (cycle mila?).' },
            { h: '3) LC 46 Permutations (Phase 9)' },
            { p: '<b>Problem:</b> distinct nums ke saare permutations.' },
            { pre: '[1,2,3] → 6 permutations' },
            { p: '<b>Pattern:</b> Backtracking + used[].' },
            { olist: ['path full → add copy.', 'Har unused i: used = true, add, recurse, remove, used = false.'] },
            { code: `private void bt(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {
    if (path.size() == nums.length) { res.add(new ArrayList<>(path)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true; path.add(nums[i]);
        bt(nums, used, path, res);
        path.remove(path.size() - 1); used[i] = false;
    }
}` },
            { tip: 'Memory hook: <b>used[] = "abhi current path pe hai"</b> — bilkul gray state jaisa! Fark: graph me gray hatke <b>black</b> banta hai (white nahi), taaki dobara explore na ho.' },
          ],
        },
        {
          title: 'Part 1 — Concept: 3-color DFS, back edge',
          blocks: [
            { table: { head: ['State', 'Color', 'Matlab'], rows: [
              ['0', 'White', 'Abhi tak nahi dekha'],
              ['1', 'Gray', 'Abhi recursion stack pe (iske neighbors explore ho rahe)'],
              ['2', 'Black', 'Poora explore ho gaya, isse koi cycle nahi'],
            ] } },
            { pre: `Cycle (back edge):          No cycle (cross edge):
  0 → 1 → 2                    0 → 1 → 3
  ↑       │                    │       ↑
  └───────┘                    └→ 2 ───┘
dfs(0) gray → 1 gray → 2 gray  dfs(0) → 1 → 3 black ✓
2 → 0: 0 GRAY hai → CYCLE      0 → 2 → 3: 3 BLACK → cycle nahi` },
            { p: '<b>Boolean visited kyun kaafi nahi?</b> Right wale example me 3 do raaston se milta hai. Boolean visited bolega "pehle dekha → cycle" — galat! Black (done) node se dobara milna safe hai. Sirf <b>gray</b> se milna cycle hai.' },
            { tip: '<b>Undirected graph</b> me cycle check alag hai: visited neighbor jo parent nahi hai = cycle. Directed me 3-color chahiye.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 207 Course Schedule (DFS approach)',
          blocks: [{ problem: 207 }],
        },
        {
          title: 'Part 3 — Thinking: Kahn → DFS',
          blocks: [
            { p: 'Kal: "ready lo" (Kahn). Aaj: "<b>gehrai me jao, kya main apne hi peeche wale node pe wapas aaya?</b>"' },
            { olist: [
              'Graph same: edge b → a.',
              'Har white node i se <code>hasCycle(i)</code>.',
              'hasCycle(u): <code>state[u] = 1</code>.',
              'Har neighbor v: gray → <code>return true</code>; white → recurse, true aaya toh true.',
              'Loop khatam → <code>state[u] = 2</code>, return false.',
            ] },
            { table: { head: ['', 'Kahn', 'DFS 3-color'], rows: [
              ['Style', 'BFS, iterative', 'Recursive'],
              ['Cycle signal', 'taken < n', 'gray neighbor'],
              ['Extra', 'indegree[]', 'state[]'],
              ['Risk', '—', 'Deep recursion (V = 2000 theek hai)'],
              ['Order (LC 210)', 'Poll order', 'Postorder'],
            ] } },
          ],
        },
        {
          title: 'Part 4 — Dry run: DFS on two examples',
          blocks: [
            { p: '<b>Example 3:</b> 4, [[1,0],[2,0],[3,1],[3,2]] → adj[0]=[1,2], adj[1]=[3], adj[2]=[3].' },
            { table: { head: ['Call', 'Action', 'state after'], rows: [
              ['hasCycle(0)', 'state[0] = 1', '[1,0,0,0]'],
              ['&nbsp;→ v = 1 white → hasCycle(1)', 'state[1] = 1', '[1,1,0,0]'],
              ['&nbsp;&nbsp;→ v = 3 white → hasCycle(3)', 'no neighbors, state[3] = 2', '[1,1,0,2]'],
              ['&nbsp;hasCycle(1) done', 'state[1] = 2', '[1,2,0,2]'],
              ['&nbsp;→ v = 2 white → hasCycle(2)', 'v = 3 black → skip; state[2] = 2', '[1,2,2,2]'],
              ['hasCycle(0) done', 'state[0] = 2', '[2,2,2,2]'],
            ] } },
            { p: 'i = 1, 2, 3 already black → skip. Koi gray hit nahi → <b>true</b>. Note: 3 ko dobara (2 se) mila par woh black tha — cycle nahi.' },
            { p: '<b>Example 2:</b> 2, [[1,0],[0,1]] → adj[0]=[1], adj[1]=[0]. hasCycle(0): state[0]=1 → v=1 white → hasCycle(1): state[1]=1 → v=0 <b>gray</b> → true → canFinish <b>false</b>.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { code: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
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
    }
}` },
            { lines: [
              ['int[] state = new int[numCourses];', '3 states; default 0 = white.'],
              ['for i: if (state[i] == 0 && hasCycle(...))', 'Disconnected parts bhi check — har white se DFS.'],
              ['state[u] = 1;', 'u ab current path pe (gray).'],
              ['if (state[v] == 1) return true;', 'Path pe wapas aa gaye = back edge = cycle.'],
              ['if (state[v] == 0 && hasCycle(...)) return true;', 'White → explore; andar cycle mila toh upar bhi true.'],
              ['state[u] = 2;', 'u safe — black. Dobara explore nahi hoga (O(V + E) ki guarantee).'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize: state colors + CALL STACK',
          blocks: [
            { list: [
              'state array: 1 (gray) = abhi stack pe, 2 = done.',
              'CALL STACK ke frames = gray nodes (exactly wahi!).',
              'Example 2 me skip edge = back edge.',
              'Example 3 me node 3 do baar dikhta hai — doosri baar black.',
            ] },
            { viz: 207, ex: 2, variant: 1 },
            { viz: 207, ex: 1, variant: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'DFS me kya hota'], rows: [
              ['3, [[1,0],[2,1],[0,2]]', 'false', '0 → 1 → 2 → 0 (gray) ✓'],
              ['3, [[0,1],[0,2],[1,2]]', 'true', 'Node 0 kai raaston (1 se, 2 se) milta hai par black'],
              ['1, []', 'true', 'Ek DFS, koi edge nahi'],
              ['2000 courses lambi chain', 'true', 'Recursion depth 2000 — Java default stack pe theek'],
              ['Boolean visited use kiya (bug)', 'galat false', 'Cross edge ko cycle samjh lega'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['DFS 3-color', 'O(V + E)', 'O(V + E) adj + O(V) state + O(V) recursion'],
              ['Kahn', 'O(V + E)', 'O(V + E)'],
            ] } },
            { p: 'Black nodes dobara explore nahi hote → har node ek baar gray, har edge ek baar dekha.' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['3 states kya hain?', '0 unvisited, 1 visiting (on stack), 2 done.'],
              ['Back edge kya hai?', 'Edge jo current recursion path ke kisi (gray) node pe jaata hai.'],
              ['Boolean visited kyun fail?', 'Black node pe cross edge ko bhi cycle bata dega.'],
              ['State 2 kyun, wapas 0 kyun nahi (backtracking jaisa)?', 'Done node dobara explore → exponential time. 2 = memo.'],
              ['Har i se DFS kyun?', 'Graph disconnected ho sakta hai.'],
              ['Gray nodes aur call stack ka rishta?', 'Gray nodes = exactly current call stack.'],
              ['Undirected cycle kaise?', 'Visited neighbor jo parent nahi = cycle (ya Union-Find).'],
              ['Kahn ya DFS interview me?', 'Kahn default (iterative, order direct); DFS alternative bolo.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo (DFS)', 'I model courses as a directed graph and look for a cycle with a DFS that keeps three states per node: unvisited, visiting and done. When the DFS enters a node it marks it visiting; if it ever reaches a neighbour that is still visiting, that is a back edge to the current path, so there is a cycle and I return false. When all neighbours are finished the node becomes done and is never explored again. I start a DFS from every unvisited node to cover disconnected parts. O(V + E) time and space.'],
              ['Follow-up: "Sirf visited boolean kyun nahi?"', 'Because in a directed graph a node can be reached by two different paths without any cycle, like a diamond. A boolean visited flag would report that second visit as a cycle. The visiting state distinguishes nodes on the current recursion path, which signal a cycle, from finished nodes, which are safe.'],
              ['Follow-up: "Kahn vs DFS?"', 'Both are O(V + E). Kahn is iterative, gives the order directly and avoids recursion depth issues. DFS is compact, finds the actual cycle easily from the recursion path, and produces a topological order from postorder. In an interview I usually present Kahn and mention DFS as the alternative.'],
              ['1-minute: DFS cycle detection', 'I keep three states per node: unvisited, visiting — meaning it is on the current recursion stack — and done. When DFS enters a node I mark it visiting; if I reach a neighbour that is still visiting, I have found a back edge, which means a cycle. When all neighbours are finished I mark the node done, and done nodes are never explored again, so the total cost is O(V + E). A plain boolean visited array is not enough, because reaching an already finished node through another path is not a cycle.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Diamond graph (0→1→3, 0→2→3) aur triangle cycle (0→1→2→0) dono draw karo.',
              'Teen colors (white/gray/black pencil) se DFS khud chalao.',
              'Batao: diamond me 3 do baar milta hai, phir bhi cycle kyun nahi?',
              'Part 4 ki table khud bharo.',
              'Visualizer me CALL STACK aur gray nodes match karo.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> DFS 3-color 8 minute me, submit.',
              '<b>Task B:</b> Cycle mile toh cycle ke nodes return karo (parent[] ya path stack) — sketch.',
              '<b>Task C:</b> Iterative DFS version socho (stack + "exit" marker) — kyun mushkil hai, 2 line.',
              '<b>Task D:</b> "Kahn vs DFS" 1-minute.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 207 dono approaches Accepted.', 'Kal (Day 10): LC 210 Course Schedule II — order bhi return karna hai.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Cycle ka signal?', 'state[v] == 1 (gray neighbor).'],
              ['State 2 kab?', 'Saare neighbors explore hone ke baad.'],
              ['Diamond graph me cycle?', 'Nahi — black node pe milna safe.'],
              ['Gray nodes = ?', 'Current call stack.'],
              ['Time?', 'O(V + E).'],
            ] },
          ],
        },
      ],
      checks: [
        '3 states aur back edge explain kar sakta/sakti hu',
        'Boolean visited kyun fail — diamond example se',
        'LC 207 DFS bina dekhe Accepted',
        'Dono examples ka DFS dry run kiya',
        'Kahn vs DFS trade-off bol sakta/sakti hu',
        'Visualizer me gray = call stack dekha',
        '13 Q&A sahi',
      ],
      memory: 'White → Gray (stack pe) → Black (done). Gray dobara mila = cycle.',
    },
  });
})();
(function () {
  const P = window.PHASE_CONTENT['graphs'];
  P.lessons = P.lessons || {};
  Object.assign(P.lessons, {
    10: {
      title: 'Topological Order (Course Schedule II)',
      goal: '<b>Topological order</b> return karna: Kahn me <b>poll order = answer</b>; DFS me <b>prerequisite graph pe postorder</b>. Cycle → <code>new int[0]</code>. LC 210.',
      main: 210,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 207 (DFS), LC 39, LC 704',
          blocks: [
            { h: '1) LC 207 Course Schedule — DFS 3-color (kal)' },
            { p: '<b>Problem:</b> courses finish ho sakte hain?' },
            { pre: '2, [[1,0],[0,1]] → false' },
            { p: '<b>Pattern:</b> Directed cycle detection.' },
            { olist: ['state[u] = 1.', 'Gray neighbor → cycle.', 'White → recurse.', 'state[u] = 2.'] },
            { code: `private boolean hasCycle(List<List<Integer>> adj, int u, int[] state) {
    state[u] = 1;
    for (int v : adj.get(u)) {
        if (state[v] == 1) return true;
        if (state[v] == 0 && hasCycle(adj, v, state)) return true;
    }
    state[u] = 2;
    return false;
}` },
            { tip: 'Memory hook: <b>Gray dobara = cycle.</b>' },
            { h: '2) LC 39 Combination Sum (Phase 9)' },
            { p: '<b>Problem:</b> candidates (reuse allowed) se target banane ke saare combinations.' },
            { pre: '[2,3,6,7], target 7 → [[2,2,3],[7]]' },
            { p: '<b>Pattern:</b> Backtracking with start index (same i dobara allowed).' },
            { olist: ['target 0 → add copy.', 'i = start..: c[i] > target skip.', 'add, recurse(i, target − c[i]), remove.'] },
            { code: `private void bt(int[] c, int start, int target, List<Integer> path, List<List<Integer>> res) {
    if (target == 0) { res.add(new ArrayList<>(path)); return; }
    for (int i = start; i < c.length; i++) {
        if (c[i] > target) continue;
        path.add(c[i]);
        bt(c, i, target - c[i], path, res);
        path.remove(path.size() - 1);
    }
}` },
            { tip: 'Memory hook: <b>Reuse = recurse(i), no reuse = recurse(i + 1).</b>' },
            { h: '3) LC 704 Binary Search (Phase 6)' },
            { p: '<b>Problem:</b> sorted array me target ka index ya −1.' },
            { pre: '[-1,0,3,5,9,12], 9 → 4' },
            { p: '<b>Pattern:</b> Classic binary search.' },
            { olist: ['l = 0, r = n − 1, while l ≤ r.', 'mid = l + (r − l) / 2.', 'Bada → r = mid − 1; chhota → l = mid + 1.'] },
            { code: `int l = 0, r = nums.length - 1;
while (l <= r) {
    int mid = l + (r - l) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
}
return -1;` },
            { tip: 'Memory hook: <b>l ≤ r, mid overflow-safe.</b>' },
          ],
        },
        {
          title: 'Part 1 — Concept: Topological order nikalna (2 tarike)',
          blocks: [
            { p: 'LC 207 me sirf "possible?" tha. LC 210 me <b>order</b> chahiye. Kahn me yeh muft hai: jis order me poll kiya, wahi valid order.' },
            { pre: `Edges (prereq → course):  0 → 1, 0 → 2, 1 → 3, 2 → 3

Kahn poll order:  0, 1, 2, 3      ✓ (har arrow left se right)
Valid orders:     [0,1,2,3], [0,2,1,3]   — koi bhi chalega` },
            { p: '<b>DFS ke liye trick:</b> graph ko <b>ulta</b> rakho — <code>pre[course]</code> = uske prerequisites. dfs(u): pehle saare prerequisites (recursion), <b>fir</b> u likho (postorder). Toh har course apne prerequisites ke baad hi likha jaata hai — reverse nahi karna padta.' },
            { pre: `pre graph (course → prerequisite):  1 → 0, 2 → 0, 3 → 1, 3 → 2

dfs(0): koi prereq nahi → write 0
dfs(1): 0 done          → write 1
dfs(2): 0 done          → write 2
dfs(3): 1, 2 done       → write 3        order = [0, 1, 2, 3]` },
            { table: { head: ['Graph direction', 'DFS postorder', 'Order'], rows: [
              ['prereq → course (adj)', 'Dependents pehle khatam', '<b>Reverse</b> karna padega'],
              ['course → prereq (pre)', 'Prerequisites pehle khatam', '<b>Seedha</b> valid'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 210 Course Schedule II',
          blocks: [{ problem: 210 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute:</b> har round me ek aisa course dhundo jiske saare prerequisites le liye gaye hain (poori list scan) → O(V · (V + E)). Ye Kahn hi hai, bas bina queue/indegree ke.' },
            { p: '<b>Optimal — Kahn:</b> indegree array "kitne baaki" yaad rakhta hai → dhundna O(1). LC 207 code + <code>order[k++] = u</code>.' },
            { olist: [
              'adj (prereq → course) + indegree.',
              'Indegree 0 → queue.',
              'Poll u → <code>order[k++] = u</code> → dependents ka indegree −1.',
              '<code>k == numCourses ? order : new int[0]</code>.',
            ] },
            { p: '<b>Optimal — DFS:</b> pre graph, 3-color, postorder me <code>order[idx++] = u</code>. Gray mila → <code>new int[0]</code>.' },
            { tip: 'Cycle case me partial order return mat karna — LeetCode <b>empty array</b> maangta hai.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: 4, [[1,0],[2,0],[3,1],[3,2]]',
          blocks: [
            { p: '<b>Kahn:</b> adj[0] = [1, 2], adj[1] = [3], adj[2] = [3]; indegree = [0, 1, 1, 2]; q = [0].' },
            { table: { head: ['poll', 'order', 'k', 'indegree after', 'q after'], rows: [
              ['0', '[0]', '1', '[0, 0, 0, 2]', '[1, 2]'],
              ['1', '[0, 1]', '2', '[0, 0, 0, 1]', '[2]'],
              ['2', '[0, 1, 2]', '3', '[0, 0, 0, 0]', '[3]'],
              ['3', '[0, 1, 2, 3]', '4', '—', '[]'],
            ] } },
            { p: 'k = 4 == 4 → <b>[0, 1, 2, 3]</b> ✓' },
            { p: '<b>DFS (pre graph):</b> pre[1] = [0], pre[2] = [0], pre[3] = [1, 2].' },
            { table: { head: ['i', 'DFS', 'order'], rows: [
              ['0', 'dfs(0): no prereq → black, write', '[0]'],
              ['1', 'dfs(1): v = 0 black → write 1', '[0, 1]'],
              ['2', 'dfs(2): v = 0 black → write 2', '[0, 1, 2]'],
              ['3', 'dfs(3): v = 1, 2 black → write 3', '[0, 1, 2, 3]'],
            ] } },
            { p: '<b>Cycle</b> 2, [[1,0],[0,1]]: Kahn → indegree [1, 1], queue khaali, k = 0 → <b>[]</b>. DFS → dfs(0) → dfs(1) → 0 gray → <b>[]</b>.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Kahn (BFS)</b>' },
            { code: `class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
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
    }
}` },
            { lines: [
              ['int[] order = new int[numCourses];', 'Answer array — size pata hai.'],
              ['order[k++] = u;', 'Poll order = topological order.'],
              ['return k == numCourses ? order : new int[0];', 'Cycle → sab nahi aaye → empty array.'],
            ] },
            { p: '<b>DFS (prerequisite graph, postorder)</b>' },
            { code: `class Solution {
    private int idx;

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
    }
}` },
            { lines: [
              ['pre.get(p[0]).add(p[1]);', 'Course → uska prerequisite (ulta direction).'],
              ['idx = 0;', 'Field reset — same Solution object reuse ho toh bhi safe.'],
              ['return false (gray)', 'Cycle — order possible nahi.'],
              ['order[idx++] = u;', 'Postorder: saare prerequisites pehle hi likhe ja chuke.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize: order array bharte dekho',
          blocks: [
            { list: [
              'Kahn: <code>order</code> array poll ke saath bharta hai.',
              'DFS tab: pre graph ke arrows course → prerequisite; order postorder me.',
              'Cycle example (Example 4) dono me <code>[]</code>.',
            ] },
            { viz: 210, ex: 1 },
            { viz: 210, ex: 1, variant: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output (hamara code)', 'Kyun'], rows: [
              ['1, []', '[0]', 'Ek course'],
              ['3, []', '[0, 1, 2]', 'Koi prerequisite nahi — sab indegree 0'],
              ['2, [[1,0],[0,1]]', '[]', 'Cycle'],
              ['5, [[1,4],[2,4],[3,1],[3,2]]', '[0, 4, 1, 2, 3]', 'Disconnected course 0 bhi aata hai'],
              ['3, [[0,1],[0,2],[1,2]]', '[2, 1, 0]', 'Chain 2 → 1 → 0'],
            ] } },
            { p: 'Multiple valid answers ho sakte hain — LeetCode koi bhi valid order accept karta hai.' },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute (bar-bar ready course dhundo)', 'O(V · (V + E))', 'O(V + E)'],
              ['Kahn', 'O(V + E)', 'O(V + E)'],
              ['DFS postorder', 'O(V + E)', 'O(V + E) + recursion O(V)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Kahn me order kahan se aata hai?', 'Poll order.'],
              ['Cycle pe kya return?', '<code>new int[0]</code> (empty).'],
              ['Ek se zyada valid order?', 'Haan — jab ek saath kai indegree-0 nodes hon.'],
              ['DFS postorder kab reverse karna padta hai?', 'Jab edges prereq → course hon.'],
              ['pre graph pe postorder seedha valid kyun?', 'Course tabhi likha jaata hai jab uske saare prerequisites likhe ja chuke.'],
              ['Lexicographically smallest order chahiye toh?', 'Queue ki jagah min-heap (PriorityQueue) — O((V + E) log V).'],
              ['LC 207 se kya extra hai?', 'Sirf order array + empty on cycle.'],
              ['Time?', 'O(V + E).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'This is topological sorting. I build the graph with an edge from each prerequisite to the course that needs it and compute indegrees. Kahn\'s algorithm starts with all zero-indegree courses; each time I poll a course I append it to the order and decrement its dependents, enqueuing any that reach zero. If I placed all numCourses courses, that order is valid; otherwise a cycle exists and I return an empty array. O(V + E) time and space.'],
              ['Follow-up: "DFS se order kaise?"', 'I store, for each course, its list of prerequisites, and run a three-state DFS. A course is appended to the order only after the DFS has finished all of its prerequisites, so postorder on this graph is already a valid order. If I meet a node that is still visiting, there is a cycle and I return an empty array.'],
              ['Follow-up: "Real world me kahan?"', 'Build tools compile modules after their dependencies, package managers install dependencies first, schedulers like Airflow run DAG tasks in topological order, and spreadsheets recompute cells after the cells they reference. All of them also need cycle detection to report circular dependencies.'],
              ['1-minute: Topological sort', 'A topological sort is a linear ordering of the nodes of a directed acyclic graph in which every edge goes from an earlier node to a later one, so every task comes after its dependencies. It exists only when there is no cycle, and there can be many valid orders. I compute it with Kahn\'s indegree BFS or with DFS postorder, both O(V + E).'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Example 2 ka graph draw karo; do valid orders likho.',
              'Kahn table (Part 4) khud bharo.',
              'LC 207 Kahn code me 3 lines badal ke LC 210 banao.',
              'Batao: cycle me empty array kyun?',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Kahn + DFS dono 15 minute me, submit.',
              '<b>Task B:</b> DFS version adj (prereq → course) direction me likho aur end me reverse karo — dono same validity?',
              '<b>Task C:</b> Lexicographically smallest order: PriorityQueue version sketch.',
              '<b>Task D:</b> "Real world topo sort" answer 60 sec.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 210 dono Accepted.', 'Kal (Day 11): LC 417 Pacific Atlantic — "reverse thinking". Problem padh lo.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['4, [[1,0],[2,0],[3,1],[3,2]] Kahn order?', '[0, 1, 2, 3]'],
              ['Cycle return?', 'new int[0]'],
              ['DFS pre graph edge?', 'course → prerequisite'],
              ['Order kab likhte ho DFS me?', 'Postorder (prerequisites ke baad).'],
              ['Smallest lexicographic order?', 'PriorityQueue instead of queue.'],
            ] },
          ],
        },
      ],
      checks: [
        'Kahn poll order = topo order samjha',
        'LC 210 Kahn Accepted',
        'LC 210 DFS (pre graph) Accepted',
        'Cycle → empty array',
        'Dry run tables banaye',
        'Multiple valid orders samjha',
        'Visualizer me order array dekha',
      ],
      memory: 'Kahn ka poll order hi answer; k < n → []. DFS: prerequisites pehle, fir course.',
    },

    11: {
      title: 'Reverse Thinking from Borders (Pacific Atlantic)',
      goal: '<b>Reverse search</b>: har cell se check karne ki jagah <b>ocean border se ulta chadho</b> (h ≥ prev). Do visited grids, intersection = answer. LC 417 brute O((mn)²) → O(mn).',
      main: 417,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 200, LC 210, LC 42',
          blocks: [
            { h: '1) LC 200 Number of Islands (Week 19)' },
            { p: '<b>Problem:</b> islands gino.' },
            { pre: '11000 / 11000 / 00100 / 00011 → 3' },
            { p: '<b>Pattern:</b> Grid DFS components.' },
            { olist: ["'1' mila → count++, dfs sink.", 'dfs: bounds → condition → mark → 4 directions.'] },
            { code: `private void dfs(char[][] g, int r, int c) {
    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length) return;
    if (g[r][c] != '1') return;
    g[r][c] = '0';
    dfs(g, r + 1, c); dfs(g, r - 1, c); dfs(g, r, c + 1); dfs(g, r, c - 1);
}` },
            { tip: 'Memory hook: <b>Aaj ka dfs bhi yahi hai — bas condition "height ≥ prev".</b>' },
            { h: '2) LC 210 Course Schedule II (kal)' },
            { p: '<b>Problem:</b> courses ka valid order ya [].' },
            { pre: '4, [[1,0],[2,0],[3,1],[3,2]] → [0,1,2,3]' },
            { p: '<b>Pattern:</b> Kahn topo sort.' },
            { olist: ['indegree 0 → queue.', 'poll → order[k++].', 'k == n ? order : [].'] },
            { code: `while (!q.isEmpty()) {
    int u = q.poll();
    order[k++] = u;
    for (int v : adj.get(u)) if (--indegree[v] == 0) q.offer(v);
}
return k == numCourses ? order : new int[0];` },
            { tip: 'Memory hook: <b>Poll order = answer.</b>' },
            { h: '3) LC 42 Trapping Rain Water (Phase 2)' },
            { p: '<b>Problem:</b> bars ke beech kitna paani rukega.' },
            { pre: '[0,1,0,2,1,0,1,3,2,1,2,1] → 6' },
            { p: '<b>Pattern:</b> Two pointers + leftMax/rightMax.' },
            { olist: ['Chhoti side move karo.', 'water += sideMax − h.'] },
            { code: `int l = 0, r = h.length - 1, lmax = 0, rmax = 0, water = 0;
while (l < r) {
    if (h[l] < h[r]) { lmax = Math.max(lmax, h[l]); water += lmax - h[l]; l++; }
    else { rmax = Math.max(rmax, h[r]); water += rmax - h[r]; r--; }
}` },
            { tip: 'Memory hook: <b>Paani chhoti deewar tak.</b> Aaj bhi paani aur heights — par flow ki direction ulti socho.' },
          ],
        },
        {
          title: 'Part 1 — Concept: Reverse search (target se shuru karo)',
          blocks: [
            { p: '<b>Sawaal ka type:</b> "Kaun se nodes target set tak pahunch sakte hain?" Seedha: har node se search → V searches. <b>Ulta:</b> target se edges ulti direction me chalo → ek search.' },
            { pre: `Paani: cell → neighbor jab h[neighbor] <= h[cell]   (neeche/barabar behta hai)
Ulta:  ocean border se andar jao jab h[next] >= h[cur]  (upar chadho)

Pacific ~~~~~~~~~~~~~~~~
   ~   1  2  2  3  5   *
   ~   3  2  3  4  4   *
   ~   2  4  5  3  1   *     ~ = Pacific (top, left)
   ~   6  7  1  4  5   *     * = Atlantic (bottom, right)
   ~   5  1  1  2  4   *
       * * * * * * Atlantic` },
            { table: { head: ['', 'Har cell se DFS (brute)', 'Border se reverse'], rows: [
              ['Searches', 'm·n', '2 (ek per ocean, multi-source)'],
              ['Time', 'O((m·n)²)', '<b>O(m·n)</b>'],
              ['Condition', 'h[next] ≤ h[cur]', 'h[next] ≥ h[cur]'],
            ] } },
            { tip: 'Multi-source idea Day 5 jaisa: <b>saare border cells ek saath</b> sources. DFS me har border cell se call; BFS me sab queue me (Day 12).' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 417 Pacific Atlantic Water Flow',
          blocks: [{ problem: 417 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute:</b> har cell (r, c) se DFS (naya visited) jo sirf neeche/barabar height pe jaaye. Raste me top/left edge → Pacific, bottom/right edge → Atlantic. Dono → answer. Har DFS O(m·n) → <b>O((m·n)²)</b>. 200×200 pe 1.6 × 10⁹ — TLE.' },
            { p: '<b>Repeated kaam:</b> paas-paas ke cells ka DFS lagbhag same raasta dobara chalta hai.' },
            { p: '<b>Optimal (reverse):</b>' },
            { olist: [
              '<code>pac[][]</code>: row 0 ke aur col 0 ke har cell se dfs(prev = MIN) — sirf <code>h ≥ prev</code> pe aage.',
              '<code>atl[][]</code>: last row aur last col se same.',
              'Ek cell ek ocean ke liye ek hi baar mark → O(m·n).',
              'Dono true → result me.',
            ] },
            { tip: 'Border cell ke liye <code>prev = Integer.MIN_VALUE</code> — condition hamesha pass, kyunki border se paani seedha ocean me jaata hai.' },
          ],
        },
        {
          title: 'Part 4 — Dry run',
          blocks: [
            { p: '<b>Chhota example</b> <code>[[2,1],[1,2]]</code>:' },
            { table: { head: ['Call', 'Result'], rows: [
              ['dfs(0,0) pac', 'mark; (1,0)=1 < 2, (0,1)=1 < 2 → reject'],
              ['dfs(0,1) atl', 'mark; (1,1)=2 ≥ 1 → mark atl; (0,0)=2 ≥ 1 → mark atl'],
              ['dfs(1,0) pac', 'mark; (1,1)=2 ≥ 1 → mark pac'],
              ['dfs(1,1) atl', 'already'],
              ['col loop: dfs(1,0) atl, dfs(0,1) pac', 'mark dono'],
            ] } },
            { p: 'pac = sab 4, atl = sab 4 → answer <code>[[0,0],[0,1],[1,0],[1,1]]</code>.' },
            { p: '<b>Example 1</b> ka final (code chala ke verify kiya):' },
            { pre: `pac (Pacific tak)        atl (Atlantic tak)        dono (answer)
P P P P P                . . . . A                . . . . ✓
P P P P P                . . . A A                . . . ✓ ✓
P P P . .                . . A A A                . . ✓ . .
P P . . .                A A A A A                ✓ ✓ . . .
P . . . .                A A A A A                ✓ . . . .

→ [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]` },
            { p: 'Jaise (2,2)=5: pac — (1,2)=3 → (0,2)=2 border se chadh ke pahuncha (2 → 3 → 5). atl — (2,4)=1 → (2,3)=3 → (2,2)=5.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { code: `class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
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
    }
}` },
            { lines: [
              ['boolean[][] pac, atl', 'Do visited grids — har ocean ka alag.'],
              ['dfs(r, 0, pac) / dfs(r, n − 1, atl)', 'Left border = Pacific, right border = Atlantic.'],
              ['dfs(0, c, pac) / dfs(m − 1, c, atl)', 'Top = Pacific, bottom = Atlantic.'],
              ['Integer.MIN_VALUE', 'Border cell hamesha valid.'],
              ['if (ocean[r][c] || h[r][c] < prev) return;', 'Already marked ya neeche jaana (ulta flow me allowed nahi).'],
              ['dfs(..., h[r][c])', 'Agla cell kam se kam itna ooncha hona chahiye.'],
              ['pac && atl → res.add', 'Intersection.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize: do oceans fill hote dekho',
          blocks: [
            { list: [
              'Teen grids: heights, pac (P), atl (A).',
              'Skip = h &lt; prev (yahan se paani us cell me nahi aata).',
              'End me found cells = dono oceans.',
              'CALL STACK me prev value har frame me.',
            ] },
            { viz: 417, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[[1]]</code>', '[[0,0]]', 'Akela cell dono borders pe'],
              ['<code>[[1,2,3]]</code>', 'teeno', '1 row: har cell top (Pacific) aur bottom (Atlantic) dono pe'],
              ['<code>[[1,1],[1,1]]</code>', 'saare 4', 'Barabar height pe paani behta hai (≥)'],
              ['<code>[[3,3,3],[3,1,3],[3,3,3]]</code>', 'beech (1,1) ke alawa sab 8', 'Gaddha — wahan se paani bahar nahi jaata'],
              ['200×200', 'O(m·n) theek', 'Recursion depth 40,000 tak — BFS safer (kal)'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute (har cell se DFS)', 'O((m·n)²)', 'O(m·n)'],
              ['Reverse DFS', 'O(m·n)', 'O(m·n) grids + recursion'],
              ['Reverse BFS (kal)', 'O(m·n)', 'O(m·n)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Pacific kaunse edges?', 'Top row aur left column.'],
              ['Reverse condition?', 'h[next] ≥ h[cur].'],
              ['Brute kyun slow?', 'Har cell se O(m·n) DFS → O((m·n)²).'],
              ['Ek grid kaafi kyun nahi?', 'Dono oceans alag reachability; intersection chahiye.'],
              ['prev = MIN_VALUE kyun?', 'Border cells bina condition ke ocean me.'],
              ['Barabar height pe flow?', 'Haan (≤ in forward, ≥ in reverse).'],
              ['Corner (0, n−1)?', 'Top (Pacific) aur right (Atlantic) dono — hamesha answer.'],
              ['Time?', 'O(m·n) — har cell max 2 baar mark.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'Checking every cell separately costs O((m·n) squared). Instead I reverse the flow: water from a cell reaches an ocean exactly when I can climb from that ocean\'s border to the cell through non-decreasing heights. I run a DFS from every Pacific border cell, top row and left column, moving only to neighbours with height at least the current one, and mark a pac grid; I do the same from the Atlantic border into an atl grid. Cells marked in both are the answer. Each cell is marked at most once per ocean, so O(m·n) time and space.'],
              ['Follow-up: "Recursion depth?"', 'In the worst case a single DFS can go through every cell, which is 40,000 frames for a 200 by 200 grid. That usually fits, but to be safe I can use a multi-source BFS: push all border cells of an ocean into a queue and expand to higher or equal neighbours.'],
              ['Follow-up: "General pattern?"', 'Whenever the question is which nodes can reach some target set, I search backwards from the targets with the inverted edge condition. One search replaces one search per node.'],
              ['1-minute: Reverse search', 'When the question asks which nodes can reach some target set, running a search from every node is expensive — for a grid that is O((m·n) squared). Reversing the search means starting from the targets and walking the edges backwards, with the inverted condition, to find everything that can reach them in a single pass. In Pacific Atlantic I start from each ocean\'s border and only climb to equal or higher cells, then intersect the two reachable sets, bringing it down to O(m·n).'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Example 1 ka grid banao; Pacific edges neele, Atlantic edges laal.',
              'Ek cell (2,2) se paani ke 2 raaste haath se dhundo (ek har ocean tak).',
              'Brute idea apne shabdon me bolo.',
              'Part 4 ka chhota example khud chalao.',
              'Visualizer me P aur A grids dekho.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Reverse DFS 15 min me, submit.',
              '<b>Task B:</b> Brute bhi likho (10 min) aur complexity compare bolo.',
              '<b>Task C:</b> "Reverse search" pattern ke 2 aur use-cases socho (bina naya LC solve kiye) — e.g. border se jude cells.',
              '<b>Task D:</b> 1-minute answer record.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 417 Accepted.', 'Kal (Day 12): LC 417 BFS version + LC 200 catch-up.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Reverse DFS condition?', 'h[r][c] ≥ prev.'],
              ['Pacific seeds?', 'Row 0 + col 0.'],
              ['Atlantic seeds?', 'Row m−1 + col n−1.'],
              ['<code>[[2,1],[1,2]]</code> answer?', 'Saare 4 cells.'],
              ['Time?', 'O(m·n).'],
            ] },
          ],
        },
      ],
      checks: [
        'Reverse search ka idea samjha sakta/sakti hu',
        'Brute O((mn)²) vs optimal O(mn) bata sakta/sakti hu',
        'LC 417 bina dekhe Accepted',
        'Pac/atl grids example 1 pe samjhe',
        'prev = MIN_VALUE kyun — clear',
        'Visualizer me teeno grids dekhe',
        '13 Q&A sahi',
      ],
      memory: 'Ocean se ulta chadho (≥), do grids, intersection. Target se search = ek pass.',
    },
  });
})();
(function () {
  const P = window.PHASE_CONTENT['graphs'];
  P.lessons = P.lessons || {};
  Object.assign(P.lessons, {
    12: {
      title: 'Multi-source BFS Again + Graph Catch-up',
      goal: 'LC 417 ka <b>reverse multi-source BFS</b> version (recursion-free), LC 200 catch-up (DFS ↔ BFS), aur poore phase ka <b>pattern recognition drill</b>.',
      main: 417,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 417 (DFS), LC 295, LC 153',
          blocks: [
            { h: '1) LC 417 Pacific Atlantic — Reverse DFS (kal)' },
            { p: '<b>Problem:</b> cells jahan se paani dono oceans tak.' },
            { pre: '[[2,1],[1,2]] → [[0,0],[0,1],[1,0],[1,1]]' },
            { p: '<b>Pattern:</b> Reverse search from borders.' },
            { olist: ['Pacific borders se dfs (h ≥ prev) → pac.', 'Atlantic borders se → atl.', 'Intersection.'] },
            { code: `private void dfs(int[][] h, int r, int c, boolean[][] ocean, int prev) {
    if (r < 0 || r >= h.length || c < 0 || c >= h[0].length) return;
    if (ocean[r][c] || h[r][c] < prev) return;
    ocean[r][c] = true;
    dfs(h, r + 1, c, ocean, h[r][c]); dfs(h, r - 1, c, ocean, h[r][c]);
    dfs(h, r, c + 1, ocean, h[r][c]); dfs(h, r, c - 1, ocean, h[r][c]);
}` },
            { tip: 'Memory hook: <b>Ocean se ulta chadho.</b>' },
            { h: '2) LC 295 Find Median from Data Stream (Phase 8)' },
            { p: '<b>Problem:</b> stream me har waqt median.' },
            { pre: 'add 1, add 2 → 1.5, add 3 → 2' },
            { p: '<b>Pattern:</b> Two heaps (max-heap lo, min-heap hi).' },
            { olist: ['lo me daalo, lo ka top hi me.', 'hi bada ho gaya → wapas lo me.', 'Median = lo.top ya average.'] },
            { code: `PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());
PriorityQueue<Integer> hi = new PriorityQueue<>();
public void addNum(int x) {
    lo.offer(x);
    hi.offer(lo.poll());
    if (hi.size() > lo.size()) lo.offer(hi.poll());
}
public double findMedian() {
    return lo.size() > hi.size() ? lo.peek() : (lo.peek() + hi.peek()) / 2.0;
}` },
            { tip: 'Memory hook: <b>Chhota aadha max-heap, bada aadha min-heap.</b>' },
            { h: '3) LC 153 Find Minimum in Rotated Sorted Array (Phase 6)' },
            { p: '<b>Problem:</b> rotated sorted array ka minimum.' },
            { pre: '[3,4,5,1,2] → 1' },
            { p: '<b>Pattern:</b> Binary search vs right end.' },
            { olist: ['nums[mid] > nums[r] → min right me (l = mid + 1).', 'Warna r = mid.'] },
            { code: `int l = 0, r = nums.length - 1;
while (l < r) {
    int mid = l + (r - l) / 2;
    if (nums[mid] > nums[r]) l = mid + 1;
    else r = mid;
}
return nums[l];` },
            { tip: 'Memory hook: <b>mid ko right se compare.</b>' },
          ],
        },
        {
          title: 'Part 1 — Concept: DFS → multi-source BFS conversion + phase pattern map',
          blocks: [
            { p: 'Kal ka reverse DFS har border cell se alag call karta tha. BFS me <b>saare border cells ek saath queue me</b> — multi-source (LC 994 jaisa), bas level count nahi chahiye.' },
            { pre: `Pacific queue start:  saare row 0 + col 0 cells
Atlantic queue start: saare row m-1 + col n-1 cells
Expand: neighbor tabhi jab h[nbr] >= h[cur] aur abhi mark nahi` },
            { table: { head: ['Signal', 'Pattern', 'Course Q'], rows: [
              ['Grid me jude same cells fill', 'Flood fill DFS/BFS', 'LC 733'],
              ['Source se sab reach?', 'BFS/DFS + seen', 'LC 841'],
              ['Groups gino', 'Components (scan + sink)', 'LC 200'],
              ['Ek saath failna, minutes', 'Multi-source BFS levels', 'LC 994'],
              ['Prerequisites possible?', 'Cycle detection (Kahn / 3-color)', 'LC 207'],
              ['Order of tasks', 'Topological sort', 'LC 210'],
              ['Kaun target tak pahunche', 'Reverse search from targets', 'LC 417'],
            ] } },
            { tip: 'Corner cells (row 0, col 0) do baar seed ho sakte hain — <code>mark()</code> helper me <code>if (ocean[r][c]) return;</code> duplicate rokta hai.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 417 (BFS approach)',
          blocks: [{ problem: 417 }],
        },
        {
          title: 'Part 3 — Thinking: kyun BFS bhi, aur kab kaunsa',
          blocks: [
            { p: 'Reverse DFS sahi hai, par worst case me ek DFS saare 40,000 cells tak gehra ja sakta hai. BFS frontier heap pe rehta hai → StackOverflow nahi.' },
            { olist: [
              'Do queues (pq, aq), do grids (pac, atl).',
              'Borders: <code>mark(q, ocean, r, c)</code> — already marked nahi toh mark + offer.',
              'bfs(q, ocean): poll; neighbor bahar / marked → skip; <code>h[nbr] &lt; h[cur]</code> → skip; warna mark + offer.',
              'Intersection same.',
            ] },
            { table: { head: ['', 'Reverse DFS', 'Reverse BFS'], rows: [
              ['Code', 'Chhota', 'Thoda lamba (helpers)'],
              ['Stack risk', 'Haan (deep)', 'Nahi'],
              ['Time / Space', 'O(mn) / O(mn)', 'O(mn) / O(mn)'],
              ['Answer', 'Same', 'Same'],
            ] } },
          ],
        },
        {
          title: 'Part 4 — Dry run: heights = [[2,1],[1,2]] (BFS)',
          blocks: [
            { table: { head: ['Step', 'Pacific', 'Atlantic'], rows: [
              ['Seeds (borders)', 'mark (0,0), (1,0), (0,1) → pq = [(0,0),(1,0),(0,1)]', 'mark (0,1), (1,1), (1,0) → aq = [(0,1),(1,1),(1,0)]'],
              ['BFS', 'poll (0,0): nbrs marked. poll (1,0)=1: (1,1)=2 ≥ 1 → mark, offer. poll (0,1), (1,1): kuch naya nahi', 'poll (0,1)=1: (0,0)=2 ≥ 1 → mark. baaki marked'],
              ['Final', 'sab 4 P', 'sab 4 A'],
            ] } },
            { p: 'Answer: <code>[[0,0],[0,1],[1,0],[1,1]]</code> — DFS version jaisa hi ✓.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { code: `class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
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
    }
}` },
            { lines: [
              ['mark(pq, pac, r, 0) ...', 'Saare border cells = sources (multi-source).'],
              ['if (ocean[r][c]) return;', 'Corner do baar seed na ho.'],
              ['bfs(heights, pq, pac);', 'Pacific se chadhao.'],
              ['if (h[r][c] < h[cur[0]][cur[1]]) continue;', 'Ulta flow: sirf barabar/oonchi height.'],
              ['ocean[r][c] = true; q.offer', 'Push pe mark.'],
            ] },
            { p: '<b>Catch-up: LC 200 DFS ↔ BFS</b> — ek baar dono 10 min me likho (Day 3 / Day 4 code).' },
          ],
        },
        {
          title: 'Part 6 — Visualize: do queues',
          blocks: [
            { list: [
              'pq aur aq dono queues border cells se shuru.',
              'Pehle poora Pacific fill, fir Atlantic.',
              'LC 200 catch-up: DFS aur BFS dono tabs chalao, sink order compare karo.',
            ] },
            { viz: 417, ex: 0, variant: 1 },
            { viz: 200, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Note'], rows: [
              ['<code>[[1]]</code>', '[[0,0]]', 'Ek hi seed dono queues me'],
              ['<code>[[1,2,3]]</code>', 'saare 3', 'Ek row = top + bottom border'],
              ['<code>[[10,10,10],[10,1,10],[10,10,10]]</code>', '8 cells (beech nahi)', 'Gaddha'],
              ['Corner seeding', 'duplicate nahi', 'mark() check'],
              ['200×200', 'theek', 'No recursion'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute', 'O((m·n)²)', 'O(m·n)'],
              ['Reverse DFS', 'O(m·n)', 'O(m·n) + recursion'],
              ['Reverse BFS', 'O(m·n)', 'O(m·n) queues + grids'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Multi-source BFS yahan kaise?', 'Ek ocean ke saare border cells ek queue me.'],
              ['Level count chahiye?', 'Nahi — sirf reachability.'],
              ['mark() helper kyun?', 'Duplicate seeds (corners) aur push pe mark ek jagah.'],
              ['BFS ka fayda DFS pe?', 'No StackOverflow.'],
              ['Condition kis pe — cur ya neighbor?', 'h[neighbor] ≥ h[cur].'],
              ['Dono BFS ek queue me kar sakte ho?', 'Nahi asaani se — ocean alag; do runs simple.'],
              ['LC 994 se similarity?', 'Dono multi-source BFS; 994 me levels = minutes.'],
              ['Time?', 'O(m·n).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo (BFS)', 'I use the same reverse idea without recursion. For each ocean I seed a queue with all of its border cells, marking them, which makes it a multi-source BFS. While the queue is not empty I poll a cell and push each unmarked neighbour whose height is at least the current height, marking it at push time. After both BFS runs, the cells marked for both oceans are the answer. O(m·n) time and space, with no stack overflow risk.'],
              ['Production DFS vs BFS', 'Recursive DFS is shorter and fine for small inputs, but its depth can reach the number of cells — 40,000 for a 200 by 200 grid, and far more for real images — which risks a StackOverflowError on the default JVM stack. Iterative BFS or an explicit stack keeps the frontier on the heap and has predictable memory. So in interviews I often write DFS for clarity and mention the trade-off, and in production I would choose the iterative version.'],
              ['Pattern recognition in 1 minute', 'For graph problems I ask three questions. Is it about reaching or grouping nodes — then BFS or DFS with visited, counting components if needed. Is it about minimum steps or simultaneous spread — then BFS, multi-source if there are many starting points. Is it about dependencies — then topological sort with Kahn or DFS cycle detection. And if checking every node is too slow, I search backwards from the targets.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Part 1 ki pattern table bina dekhe dobara likho.',
              'LC 200 DFS dobara (catch-up) bina dekhe.',
              'LC 417 ka idea apne shabdon me (code optional).',
              'Visualizer me do queues follow karo.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 417 BFS 15 min, submit.',
              '<b>Task B:</b> LC 200 DFS + BFS 10 min (catch-up).',
              '<b>Task C:</b> Pattern map: 7 questions ke signals 2 minute me bolo.',
              '<b>Task D:</b> Kal revision ke liye LC 207, 210 bina dekhe ek baar.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 417 BFS Accepted.', 'Kal Saturday revision: LC 207, 210, 994, 417.', 'Sohel: System Design topic ready (kal).'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['417 BFS ke seeds?', 'Har ocean ke saare border cells.'],
              ['Skip condition?', 'Bahar / marked / h[nbr] < h[cur].'],
              ['Prerequisites order → ?', 'Topological sort (LC 210).'],
              ['Simultaneous spread → ?', 'Multi-source BFS (LC 994).'],
              ['DFS ka production risk?', 'StackOverflow.'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 417 BFS Accepted',
        'LC 200 dono approaches catch-up',
        'Pattern map 7 questions ka bol sakta/sakti hu',
        'DFS vs BFS production trade-off',
        'Dry run kiya',
        'Visualizer me do queues dekhe',
        '13 Q&A sahi',
      ],
      memory: 'Border = multi-source; BFS = no recursion; pattern map: reach / spread / dependency / reverse.',
    },

    13: {
      title: 'Revision — Week 20 (Topo Sort + Multi-source)',
      goal: 'Week 20 + multi-source questions (LC 207, 210, 994, 417) <b>bina dekhe</b>, dono approaches, aur Sohel ka <b>System Design session</b>.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan + warm-up (LC 53, LC 560)',
          blocks: [
            { table: { head: ['Slot', 'Kya', 'Timer'], rows: [
              ['1', 'LC 207 Course Schedule (Kahn + DFS)', '25 min'],
              ['2', 'LC 210 Course Schedule II', '25 min'],
              ['3', 'LC 994 Rotting Oranges', '20 min'],
              ['4', 'LC 417 Pacific Atlantic', '25 min'],
            ] } },
            { list: ['Pehle bolo → code → dry run.', 'Sohvi: LC 207 Kahn + LC 994 kam se kam; baaki idea level.', 'Tum: chaaron, dono approaches jahan hain.'] },
            { h: 'Warm-up 1) LC 53 Maximum Subarray (Phase 1)' },
            { pre: '[-2,1,-3,4,-1,2,1,-5,4] → 6' },
            { code: `int cur = 0, best = Integer.MIN_VALUE;
for (int x : nums) {
    cur = Math.max(x, cur + x);
    best = Math.max(best, cur);
}` },
            { tip: 'Memory hook: <b>Extend ya restart.</b>' },
            { h: 'Warm-up 2) LC 560 Subarray Sum Equals K (Phase 1)' },
            { pre: '[1,1,1], k = 2 → 2' },
            { code: `Map<Integer, Integer> freq = new HashMap<>();
freq.put(0, 1);
int sum = 0, count = 0;
for (int x : nums) {
    sum += x;
    count += freq.getOrDefault(sum - k, 0);
    freq.put(sum, freq.getOrDefault(sum, 0) + 1);
}` },
            { tip: 'Memory hook: <b>put(0, 1) mat bhoolna.</b>' },
          ],
        },
        {
          title: 'Part 1 — LC 207 Course Schedule',
          blocks: [
            { p: '<b>Recap:</b> prerequisites graph me cycle hai? → false.' },
            { p: '<b>Pattern:</b> Kahn (taken == n) / DFS 3-color (gray dobara).' },
            { pre: '2, [[1,0],[0,1]] → false · 4, [[1,0],[2,0],[3,1],[3,2]] → true' },
            { code: `for (int[] p : prerequisites) { adj.get(p[1]).add(p[0]); indegree[p[0]]++; }
// indegree 0 → queue; poll → taken++, --indegree[v] == 0 → offer
return taken == numCourses;` },
            { tip: 'Memory hook: <b>[a, b] = b → a. Ready lo; cycle = taken &lt; n.</b>' },
            { viz: 207, ex: 1 },
          ],
        },
        {
          title: 'Part 2 — LC 210 Course Schedule II',
          blocks: [
            { p: '<b>Recap:</b> valid order ya [].' },
            { p: '<b>Pattern:</b> Topological sort.' },
            { pre: '4, [[1,0],[2,0],[3,1],[3,2]] → [0,1,2,3]' },
            { code: `while (!q.isEmpty()) {
    int u = q.poll();
    order[k++] = u;
    for (int v : adj.get(u)) if (--indegree[v] == 0) q.offer(v);
}
return k == numCourses ? order : new int[0];` },
            { tip: 'Memory hook: <b>Poll order = answer; DFS: prerequisites pehle, fir course.</b>' },
            { viz: 210, ex: 1, variant: 1 },
          ],
        },
        {
          title: 'Part 3 — LC 994 Rotting Oranges',
          blocks: [
            { p: '<b>Recap:</b> minimum minutes / −1.' },
            { p: '<b>Pattern:</b> Multi-source BFS levels.' },
            { pre: '[[2,1,1],[0,1,1],[1,0,1]] → -1' },
            { code: `while (!q.isEmpty() && fresh > 0) {
    int size = q.size();
    for (int i = 0; i < size; i++) { /* rot fresh neighbors */ }
    minutes++;
}
return fresh == 0 ? minutes : -1;` },
            { tip: 'Memory hook: <b>Sab rotten ek saath; size = minute.</b>' },
            { viz: 994, ex: 1 },
          ],
        },
        {
          title: 'Part 4 — LC 417 Pacific Atlantic',
          blocks: [
            { p: '<b>Recap:</b> dono oceans tak pahunchne wale cells.' },
            { p: '<b>Pattern:</b> Reverse DFS/BFS from borders.' },
            { pre: '[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\n→ [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]' },
            { code: `// Pacific: row 0 + col 0 se, Atlantic: row m-1 + col n-1 se
// dfs/bfs: h[next] >= h[cur] pe hi aage
if (pac[r][c] && atl[r][c]) res.add(Arrays.asList(r, c));` },
            { tip: 'Memory hook: <b>Ocean se ulta chadho, intersection.</b>' },
            { viz: 417, ex: 2 },
          ],
        },
        {
          title: 'Part 5 — Interview mix',
          blocks: [
            { qa: [
              ['Kahn me cycle signal?', 'taken (ya k) < numCourses.'],
              ['DFS me cycle signal?', 'Gray (visiting) neighbor.'],
              ['Boolean visited directed cycle me kyun fail?', 'Diamond jaise cross edges ko cycle bata deta hai.'],
              ['Multi-source BFS cost?', 'O(V + E).'],
              ['LC 994 me extra minute kaise roka?', 'Loop condition fresh > 0.'],
              ['LC 417 reverse condition?', 'h[next] ≥ h[cur].'],
              ['Topo order unique?', 'Nahi, kai ho sakte hain.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — 1-minute answers: aise bolo',
          blocks: [
            { say: [
              ['Kahn vs DFS for topological sorting', 'Both run in O(V + E). Kahn\'s algorithm is iterative: it uses indegrees and a queue, produces the order directly, and detects a cycle when fewer than V nodes are output. It is easy to explain and has no recursion depth issues. DFS uses three-colour states, detects a cycle as a back edge to a node still on the stack, and produces the order from postorder, reversed when edges point from prerequisite to course. I default to Kahn in interviews and mention DFS as the alternative.'],
              ['Rotting Oranges in 1 minute', 'All rotten oranges start in one queue — a multi-source BFS. Each level is one minute; fresh neighbours rot and join the next level, and I stop when no fresh orange remains. If fresh oranges are left when the queue empties, I return −1. O(m·n).'],
              ['Pacific Atlantic in 1 minute', 'Instead of searching from every cell, I search backwards from each ocean\'s border, climbing only to equal or higher neighbours, and mark two boolean grids. Cells marked in both are the answer. Each cell is visited at most twice, so O(m·n).'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: ['LC 207 Kahn aur LC 994 bina dekhe.', 'LC 210 ka order haath se nikaalo (Example 2).', 'LC 417 ke pac/atl grids paper pe banao.', 'Visualizer se match.'] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice) + System Design session',
          blocks: [
            { olist: [
              '<b>Task A:</b> Chaaron questions, dono approaches, 75 min.',
              '<b>Task B:</b> Har ek ke baad edge cases 30 sec.',
              '<b>System Design session (1/week):</b> "Design a Job / Workflow Scheduler (Airflow-like)" — 45 min. Graph connection: jobs = DAG nodes, dependencies = edges; scheduler topological order (Kahn: indegree 0 = runnable), cycle detection on DAG submit, retries, worker pool + queue, state store (pending/running/done), backfills. Requirements → APIs → components → data model → scaling/failure handling.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: ['Kal mock: Sohvi ko LC 733, Tum ko LC 210 — dobara mat dekhna.', 'Phase 10 ka Last Minute tab padho.'] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[a, b] edge?', 'b → a.'],
              ['Cycle in Kahn?', 'taken < n.'],
              ['3 states?', '0 / 1 visiting / 2 done.'],
              ['994 return?', 'fresh == 0 ? minutes : −1.'],
              ['417 seeds?', 'Ocean borders.'],
            ] },
          ],
        },
      ],
      checks: [
        'Kam se kam 3 questions bina dekhe',
        'LC 207 dono approaches (Sohel)',
        'Dry runs visualizer se match',
        'System Design session (Job Scheduler) kiya (Sohel)',
        'Interview mix sahi',
      ],
      memory: 'Dependency → topo sort (Kahn); spread → multi-source BFS; "kaun pahunche" → reverse search.',
    },

    14: {
      title: 'Mock Interview + Contest (Graphs final)',
      goal: 'Phase 10 ka final mock: <b>Tum → Sohvi (LC 733)</b>, <b>Sohvi → Tum (LC 210)</b>, fir Weekly Contest discussion.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Mock format + warm-up (LC 15, LC 875)',
          blocks: [
            { table: { head: ['Slot', 'Kya', 'Time'], rows: [
              ['1', 'Tum interviewer, Sohvi candidate — LC 733', '30 min'],
              ['2', 'Sohvi interviewer, Tum candidate — LC 210', '30 min'],
              ['3', 'Weekly Contest discussion (Sunday 8:00 AM IST)', '30 min'],
            ] } },
            { h: 'Warm-up 1) LC 15 3Sum (Phase 2)' },
            { pre: '[-1,0,1,2,-1,-4] → [[-1,-1,2],[-1,0,1]]' },
            { code: `Arrays.sort(nums);
for (int i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    int l = i + 1, r = n - 1;
    while (l < r) {
        int s = nums[i] + nums[l] + nums[r];
        if (s == 0) {
            res.add(Arrays.asList(nums[i], nums[l], nums[r]));
            while (l < r && nums[l] == nums[l + 1]) l++;
            while (l < r && nums[r] == nums[r - 1]) r--;
            l++; r--;
        } else if (s < 0) l++;
        else r--;
    }
}` },
            { tip: 'Memory hook: <b>Sort + fix i + two pointers + duplicates skip.</b>' },
            { h: 'Warm-up 2) LC 875 Koko Eating Bananas (Phase 6)' },
            { pre: 'piles = [3,6,7,11], h = 8 → 4' },
            { code: `int lo = 1, hi = 0;
for (int p : piles) hi = Math.max(hi, p);
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    long hours = 0;
    for (int p : piles) hours += (p + mid - 1) / mid;
    if (hours <= h) hi = mid;
    else lo = mid + 1;
}
return lo;` },
            { tip: 'Memory hook: <b>Answer pe binary search — "kya speed k kaafi hai?"</b>' },
          ],
        },
        {
          title: 'Part 1 — Mock Q1 (Tum → Sohvi): LC 733 Flood Fill',
          blocks: [
            { problem: 733 },
            { p: '<b>Kya poochna hai:</b> "Grid graph kaise hai? Visited kahan? start == color pe kya? BFS se bhi karo."' },
            { olist: [
              'Hint 1: "Paint bucket kaise kaam karta hai?"',
              'Hint 2: "Ek pixel ke neighbors kaun hain?"',
              'Hint 3: "Dobara same pixel pe na jao — kaise pata?" (recolor)',
              'Hint 4: "Agar naya color = purana?"',
            ] },
            { table: { head: ['Rubric', 'Kya dekhna', 'Score /5'], rows: [
              ['Clarify', '4 vs 8 directions, start == color', ''],
              ['Brute', 'Traversal idea', ''],
              ['Optimal', 'DFS/BFS O(m·n)', ''],
              ['Code', 'Bounds pehle, mark sahi', ''],
              ['Test', 'Example 2 (same color), 1×1', ''],
              ['Communication', 'Bolte hue', ''],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Mock Q2 (Sohvi → Tum): LC 210 Course Schedule II',
          blocks: [
            { problem: 210 },
            { p: '<b>Kya poochna hai:</b> "Graph model? Edge direction? Cycle kaise pakdoge? Order unique hai? DFS se bhi karo. Lexicographically smallest?"' },
            { olist: [
              'Hint 1: "Kaunsa course sabse pehle le sakte ho?" (koi prerequisite nahi)',
              'Hint 2: "Course lene ke baad baaki pe kya asar?" (indegree −1)',
              'Hint 3: "Cycle me kya hoga?" (kuch courses kabhi ready nahi)',
            ] },
            { table: { head: ['Rubric', 'Kya dekhna', 'Score /5'], rows: [
              ['Clarify', 'Multiple valid orders, cycle → []', ''],
              ['Brute', 'Bar-bar ready course scan', ''],
              ['Optimal', 'Kahn O(V + E)', ''],
              ['Code', '12 min me clean', ''],
              ['Test', 'Cycle, no prerequisites, disconnected', ''],
              ['Communication', 'DFS alternative bola', ''],
            ] } },
          ],
        },
        {
          title: 'Part 3 — Interview communication checklist',
          blocks: [
            { list: [
              'Graph model pehle bolo: "nodes = …, edges = …, directed?".',
              'Input format → representation (grid implicit / adjacency list).',
              'Traversal choice + reason (BFS levels / DFS reach / topo).',
              'Visited strategy bolo (in-place, boolean, 3-state).',
              'Complexity O(V + E) / O(m·n) + recursion risk.',
              'Edge cases: empty, cycle, disconnected, border cells.',
            ] },
          ],
        },
        {
          title: 'Part 4 — LeetCode Weekly Contest plan + discussion',
          blocks: [
            { list: [
              'Sunday 8:00 AM IST — dono participate.',
              'Template: question, pattern, kahan atke, time, editorial se kya seekha.',
              'Graph question aaya toh: pattern map (Day 12) se match karo.',
              'Phase 10 complete — agla phase Dynamic Programming.',
            ] },
          ],
        },
        {
          title: 'Part 5 — Interview Q&A',
          blocks: [
            { qa: [
              ['BFS/DFS complexity kyun O(V + E)?', 'Har vertex ek baar, har adjacency list ek baar.'],
              ['Grid me V aur E?', 'V = m·n, E ≤ 4·m·n.'],
              ['Topological order kab nahi hota?', 'Cycle ho toh.'],
              ['Shortest path unweighted?', 'BFS.'],
              ['Flood fill trap?', 'start == color.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Aise bolo',
          blocks: [
            { say: [
              ['BFS/DFS complexity', 'Both are O(V + E) with an adjacency list. Every vertex is marked visited once, so it is enqueued or entered once, which is the V part. Each vertex\'s adjacency list is scanned once when that vertex is processed, and the lengths of all lists add up to E for directed graphs or 2E for undirected ones, which is the E part. The space is O(V) for the visited array plus the queue or recursion stack. On a grid V is m·n and E is at most 4·m·n, so it is O(m·n).'],
              ['Course Schedule II in 1 minute', 'Courses are nodes and each prerequisite pair gives an edge from prerequisite to course. I run Kahn\'s algorithm: enqueue zero-indegree courses, poll one at a time into the order and decrement its dependents. If all courses were placed I return the order, otherwise there is a cycle and I return an empty array. O(V + E).'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: ['Mock Q1 candidate — LC 733 DFS + start == color case bolo.', 'Mock Q2 interviewer — hints ladder + rubric.', 'Phase 10 ke 7 questions ki ek-line memory list banao.'] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: ['Mock Q2 candidate: 25 min me Kahn + DFS alternative + follow-ups.', 'Mock Q1 interviewer: BFS follow-up zaroor maango.', 'Contest Q3/Q4 editorial padho.'] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: ['Rubric me kamzor points note karo.', 'Phase 11 (Dynamic Programming) ka intro padho.'] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Phase 10 ke 7 questions aur patterns?', '733 flood fill, 841 reachability, 200 components, 994 multi-source BFS, 207 cycle/topo, 210 topo order, 417 reverse search.'],
              ['BFS mark rule?', 'Push pe.'],
              ['Directed cycle?', '3-color DFS ya Kahn.'],
              ['Multi-source?', 'Saare sources pehle queue me.'],
              ['Reverse search kab?', 'Jab "kaun target tak pahunche" aur har node se search mehenga.'],
            ] },
          ],
        },
      ],
      checks: [
        'Mock Q1 aur Q2 dono kiye',
        'Rubric bhara aur feedback diya',
        'Weekly contest diya aur discuss kiya',
        'Phase 10 ke 7 patterns bina dekhe bata sakta/sakti hu',
        'Q&A sahi',
      ],
      memory: 'Graph = nodes + edges + visited. Reach/count → DFS, levels/spread → BFS, dependencies → topo sort.',
    },
  });
})();
