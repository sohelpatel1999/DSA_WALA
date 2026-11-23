window.PHASE_CONTENT = window.PHASE_CONTENT || {};

window.PHASE_CONTENT['backtracking'] = {
  intro: 'Backtracking = "har raasta try karo, galat nikle toh ek kadam peeche aao". Recursion + ek shared path: choose → explore → unchoose. Subsets, permutations, combinations, partition aur grid search — sab ek hi template se.',

  // ---------------- FUNDAMENTALS ----------------
  fundamentals: [
    {
      h: 'Recursion kya hai? (call stack ke saath)',
      body: `<p><b>Recursion</b> = function khud ko chhote input pe call karta hai. Har call ka apna <b>stack frame</b> banta hai (apne local variables ke saath). Do cheezein zaroori:</p>
<ul>
<li><b>Base case</b> — kab rukna hai (warna <code>StackOverflowError</code>).</li>
<li><b>Recursive case</b> — problem ko chhota karke khud ko call karo.</li>
</ul>
<pre class="ex-pre diagram">fact(3) call hua → stack (top upar):

 push:                         pop (return wapas):
 | fact(1) | → base, return 1   | fact(1) | = 1  ↑
 | fact(2) | waiting...         | fact(2) | = 2 × 1 = 2  ↑
 | fact(3) | waiting...         | fact(3) | = 3 × 2 = 6  ↑
 | main    |                    | main    | ← 6</pre>
<p class="tip">Backtracking me depth = path ki length (max n). Isliye recursion stack <b>O(n)</b> hota hai — n ≤ 16 jaise chhote constraints pe kabhi overflow nahi.</p>`,
    },
    {
      h: 'Recursion tree — backtracking ka asli picture',
      body: `<p>Har call = tree ka ek <b>node</b>. Har choice = ek <b>edge</b>. Leaf / valid node = ek answer. Backtracking = is tree ka <b>DFS</b>.</p>
<p><b>Subsets [1,2,3]</b> (for-loop style, start index) — <b>har node</b> ek subset hai:</p>
<pre class="ex-pre diagram">                    []                    start=0
          /          |          \\
        [1]         [2]         [3]       start=1,2,3
       /   \\         |
   [1,2]  [1,3]    [2,3]
     |
  [1,2,3]
→ 8 nodes = 2³ subsets</pre>
<p><b>Permutations [1,2,3]</b> (used[] style) — sirf <b>leaf</b> (path.size() == n) answer hai:</p>
<pre class="ex-pre diagram">                         []
         /               |               \\
       [1]              [2]              [3]
      /   \\            /   \\            /   \\
  [1,2]  [1,3]     [2,1]  [2,3]     [3,1]  [3,2]
    |      |         |      |         |      |
[1,2,3][1,3,2]  [2,1,3][2,3,1]  [3,1,2][3,2,1]
→ 3! = 6 leaves</pre>
<p class="tip">Interview me pehle ye tree <b>bolke/banake</b> dikhao — complexity aur code dono isi se nikalte hain.</p>`,
    },
    {
      h: 'Backtracking template: choose → explore → unchoose',
      body: `<p>Ek hi <b>path</b> list sab calls share karti hain. Choice daalo, aage jao, wapas aake choice hatao — taaki agla sibling saaf path se shuru ho.</p>
<table class="tbl"><thead><tr><th>Step</th><th>Code</th><th>Matlab</th></tr></thead><tbody>
<tr><td>Base / record</td><td><code>res.add(new ArrayList&lt;&gt;(path))</code></td><td>Answer mila → <b>copy</b> save karo</td></tr>
<tr><td>Choose</td><td><code>path.add(x)</code></td><td>Ek option chuno</td></tr>
<tr><td>Explore</td><td><code>backtrack(..., next)</code></td><td>Us choice ke saath aage ka tree</td></tr>
<tr><td>Unchoose</td><td><code>path.remove(path.size() - 1)</code></td><td>Choice wapas — state restore</td></tr>
</tbody></table>
<p class="tip"><b>Copy kyun?</b> <code>res.add(path)</code> karoge toh sab entries ek hi list ko point karengi — end me sab khaali dikhengi. Hamesha <code>new ArrayList&lt;&gt;(path)</code>.</p>`,
      code: `void backtrack(int start, List<Integer> path, List<List<Integer>> res) {
    if (isAnswer(path)) {                 // base case / record
        res.add(new ArrayList<>(path));   // COPY, reference nahi
        return;                           // (subsets me return nahi — har node answer)
    }
    for (int i = start; i < n; i++) {     // har choice
        if (!valid(i)) continue;          // pruning
        path.add(nums[i]);                // 1. choose
        backtrack(i + 1, path, res);      // 2. explore
        path.remove(path.size() - 1);     // 3. unchoose (backtrack)
    }
}`,
    },
    {
      h: 'Pruning — tree ko kaatna',
      body: `<p>Jab pata chal jaaye ki is branch se answer nahi aayega, <b>andar mat jao</b>. Exponential tree me ye hi speed deta hai.</p>
<ul>
<li><b>Sort + break</b> (LC 39, 40): candidates sorted hain aur <code>c[i] &gt; remain</code> → aage ke sab bhi bade → <code>break</code> (continue nahi).</li>
<li><b>Invalid choice skip</b> (LC 131): prefix palindrome nahi → <code>continue</code>.</li>
<li><b>Grid mismatch</b> (LC 79): <code>board[r][c] != word.charAt(k)</code> → turant <code>return false</code>.</li>
<li><b>Frequency check</b> (LC 79 follow-up): board me word ke letters hi kam hain → DFS chalao hi mat.</li>
</ul>
<pre class="ex-pre diagram">Combination Sum, sorted [2,3,6,7], target 7, remain = 1 pe:
   for i: c[i]=2 > 1 → break   (3, 6, 7 try hi nahi kiye)</pre>`,
    },
    {
      h: 'Duplicates: sort karke same level pe skip',
      body: `<p>Input me duplicates (LC 90, 40) → same answer do baar ban sakta hai. Fix: <b>sort</b> karo, aur <b>same level</b> (same for-loop) pe pichla jaisa element dobara mat uthao:</p>
<pre class="ex-pre diagram">if (i &gt; start &amp;&amp; nums[i] == nums[i - 1]) continue;

Subsets II, sorted [1,2,2]:
                  []
        /         |          \\
      [1]        [2]         [2] ✗ skip (i=2 &gt; start=0, same as nums[1])
     /    \\        |
  [1,2]  [1,2]✗  [2,2]
    |
 [1,2,2]
→ [], [1], [1,2], [1,2,2], [2], [2,2]  (6, duplicate nahi)</pre>
<ul>
<li><code>i &gt; start</code> = "is level ka pehla choice nahi hai". Pehla choice hamesha allowed — isliye [1,2,2] (gehrai me dono 2) ban paata hai.</li>
<li>Bina sort ke ye check kaam nahi karta — same values paas-paas honi chahiye.</li>
<li>Brute alternative: sab banao + <code>HashSet&lt;List&lt;Integer&gt;&gt;</code> — kaam karta hai par extra time/space.</li>
</ul>`,
    },
    {
      h: 'Complexity cheat sheet + Java API',
      body: `<table class="tbl"><thead><tr><th>Problem type</th><th>Answers</th><th>Time</th><th>Stack</th></tr></thead><tbody>
<tr><td>Subsets</td><td>2ⁿ</td><td>O(n · 2ⁿ) (copy n)</td><td>O(n)</td></tr>
<tr><td>Permutations</td><td>n!</td><td>O(n · n!)</td><td>O(n)</td></tr>
<tr><td>Combination Sum</td><td>—</td><td>O(n^(T/min)) upper bound</td><td>O(T/min)</td></tr>
<tr><td>Palindrome Partition</td><td>≤ 2ⁿ⁻¹</td><td>O(n · 2ⁿ)</td><td>O(n)</td></tr>
<tr><td>Word Search</td><td>true/false</td><td>O(m·n · 3^L)</td><td>O(L)</td></tr>
</tbody></table>
<p class="tip">Output hi exponential hai → isse fast possible nahi. Interview me ye line bolo: "the output size itself is 2ⁿ, so we cannot do better than O(n·2ⁿ)".</p>`,
      code: `List<List<Integer>> res = new ArrayList<>();
List<Integer> path = new ArrayList<>();
res.add(new ArrayList<>(path));      // copy
path.add(x);                         // choose
path.remove(path.size() - 1);        // unchoose — index wala remove(int)!
// Galti: path.remove(x) jab x Integer ho → object remove karega, index nahi

boolean[] used = new boolean[n];     // permutations
Arrays.sort(nums);                   // duplicates skip se pehle
s.substring(start, end + 1);         // end inclusive ke liye +1
char saved = board[r][c];            // grid: mark
board[r][c] = '#';  /* explore */  board[r][c] = saved;  // restore
int bit = (mask >> i) & 1;           // bitmask subsets`,
    },
  ],

  // ---------------- OPERATIONS ----------------
  operations: [
    { op: 'Choose (path me daalo)', time: 'O(1)*', note: 'ArrayList end me add amortized O(1)', code: 'path.add(nums[i]);' },
    { op: 'Unchoose (last hatao)', time: 'O(1)', note: 'Index wala remove — last element, shift nahi', code: 'path.remove(path.size() - 1);' },
    { op: 'Answer record (copy)', time: 'O(n)', note: 'Path ki copy — reference nahi', code: 'res.add(new ArrayList<>(path));' },
    { op: 'used[] mark / unmark', time: 'O(1)', note: 'Permutations: kaun sa element path me hai', code: 'used[i] = true;\nbacktrack(...);\nused[i] = false;' },
    { op: 'Swap (in-place choose)', time: 'O(1)', note: 'Permutations bina extra path ke', code: 'swap(nums, start, i);\nbacktrack(nums, start + 1, res);\nswap(nums, start, i);' },
    { op: 'Sort + duplicate skip', time: 'O(n log n) ek baar', note: 'Same level pe same value dobara nahi', code: 'Arrays.sort(nums);\n// loop me:\nif (i > start && nums[i] == nums[i - 1]) continue;' },
    { op: 'Prune (sorted break)', time: 'O(1) per check', note: 'Aage ke sab bade → poora loop band', code: 'if (c[i] > remain) break;' },
    { op: 'Palindrome check s[l..r]', time: 'O(r − l)', note: 'Two pointers (Phase 2)', code: 'while (l < r)\n    if (s.charAt(l++) != s.charAt(r--)) return false;\nreturn true;' },
    { op: 'Grid mark visited / restore', time: 'O(1)', note: 'Word Search — same cell do baar nahi', code: "char saved = board[r][c];\nboard[r][c] = '#';\n// 4 directions explore\nboard[r][c] = saved;" },
    { op: 'Bitmask → subset', time: 'O(n) per mask', note: 'mask ka bit i = 1 → nums[i] lo', code: 'for (int i = 0; i < n; i++)\n    if ((mask & (1 << i)) != 0) s.add(nums[i]);' },
  ],

  // ---------------- PATTERNS ----------------
  patterns: [
    {
      name: 'Subsets (start index, har node answer)',
      signal: '"All subsets", "power set", "har combination of any size"',
      idea: 'Har call me pehle path record karo, fir start..n−1 me se ek uthao aur i+1 se aage badho. Peeche ke elements dobara nahi → [1,2] aur [2,1] alag nahi bante.',
      code: `void bt(int start) {
    res.add(new ArrayList<>(path));
    for (int i = start; i < n; i++) {
        path.add(nums[i]);
        bt(i + 1);
        path.remove(path.size() - 1);
    }
}`,
      qs: [78, 90],
    },
    {
      name: 'Permutations (used[] / swap, leaf answer)',
      signal: '"All arrangements", "order matters", "har possible ordering"',
      idea: 'Har level pe koi bhi unused element utha sakte ho (start index nahi). path.size() == n pe record. used[] ya in-place swap.',
      code: `void bt() {
    if (path.size() == n) { res.add(new ArrayList<>(path)); return; }
    for (int i = 0; i < n; i++) {
        if (used[i]) continue;
        used[i] = true; path.add(nums[i]);
        bt();
        path.remove(path.size() - 1); used[i] = false;
    }
}`,
      qs: [46],
    },
    {
      name: 'Combination Sum (remain + prune)',
      signal: '"Combinations that sum to target", "elements reuse allowed / ek baar"',
      idea: 'remain = target − sum. Sorted candidates pe c[i] > remain → break. Reuse allowed → bt(i), ek baar → bt(i + 1).',
      code: `void bt(int start, int remain) {
    if (remain == 0) { res.add(new ArrayList<>(path)); return; }
    for (int i = start; i < c.length; i++) {
        if (c[i] > remain) break;
        path.add(c[i]);
        bt(i, remain - c[i]);      // LC 40: bt(i + 1, ...)
        path.remove(path.size() - 1);
    }
}`,
      qs: [39, 40],
    },
    {
      name: 'Duplicates skip (sort + same level)',
      signal: '"Input me duplicates hain", "answer me duplicate combinations nahi chahiye"',
      idea: 'Sort karo. Loop me i > start && a[i] == a[i−1] → continue. Same level pe same value sirf ek baar branch banati hai.',
      code: `Arrays.sort(nums);
// loop ke andar:
if (i > start && nums[i] == nums[i - 1]) continue;`,
      qs: [90, 40],
    },
    {
      name: 'Partitioning (string ko cut karo)',
      signal: '"Partition the string such that every part is …", "all ways to split"',
      idea: 'start se har end tak prefix s[start..end] try karo; valid (palindrome) ho toh path me daalo, end+1 se recurse. start == n → ek poora partition.',
      code: `void bt(int start) {
    if (start == s.length()) { res.add(new ArrayList<>(path)); return; }
    for (int end = start; end < s.length(); end++) {
        if (!isPal(s, start, end)) continue;
        path.add(s.substring(start, end + 1));
        bt(end + 1);
        path.remove(path.size() - 1);
    }
}`,
      qs: [131],
    },
    {
      name: 'Grid DFS backtracking (mark → explore → unmark)',
      signal: '"Grid me path / word dhundo", "adjacent cells, same cell do baar nahi"',
      idea: 'Har cell se DFS. Cell mark karo (visited / "#"), 4 directions me k+1 dhundo, wapas aake unmark. Bounds + mismatch pe turant false.',
      code: `boolean dfs(int k, int r, int c) {
    if (k == word.length()) return true;
    if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] != word.charAt(k)) return false;
    char t = board[r][c]; board[r][c] = '#';
    boolean ok = dfs(k + 1, r + 1, c) || dfs(k + 1, r - 1, c)
              || dfs(k + 1, r, c + 1) || dfs(k + 1, r, c - 1);
    board[r][c] = t;
    return ok;
}`,
      qs: [79],
    },
  ],

  // ---------------- QUESTIONS ----------------
  questions: {
    46: {
      oneLine: 'Har level pe koi bhi unused element chuno (used[]), path.size() == n pe copy save — ya in-place swap.',
      pattern: 'Backtracking — Permutations',
      approaches: [
        {
          level: 'Iterative (insert)', idea: 'Khaali permutation se shuru. Har naye number x ko har purani permutation ki har position pe insert karo. [1] → [2,1],[1,2] → …',
          time: 'O(n · n!)', space: 'O(n · n!) (output)',
          code: `public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    res.add(new ArrayList<>());
    for (int x : nums) {
        List<List<Integer>> next = new ArrayList<>();
        for (List<Integer> p : res) {
            for (int pos = 0; pos <= p.size(); pos++) {
                List<Integer> np = new ArrayList<>(p);
                np.add(pos, x);          // x ko position pos pe ghusao
                next.add(np);
            }
        }
        res = next;
    }
    return res;
}`,
        },
        {
          level: 'Backtracking (used[])', idea: 'Har level pe 0..n−1 scan karo; jo used nahi hai use choose → explore → unchoose. Leaf (path.size() == n) pe copy save.',
          time: 'O(n · n!)', space: 'O(n) stack + used[] (output alag)',
          code: `public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, new boolean[nums.length], new ArrayList<>(), res);
    return res;
}

private void backtrack(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {
    if (path.size() == nums.length) {
        res.add(new ArrayList<>(path));   // leaf: copy save
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;            // pehle se path me hai
        used[i] = true;                   // choose
        path.add(nums[i]);
        backtrack(nums, used, path, res); // explore
        path.remove(path.size() - 1);     // unchoose
        used[i] = false;
    }
}`,
        },
        {
          level: 'Optimal (swap in-place)', idea: 'Position start pe kaun baithega? start..n−1 me se har element ko swap karke start pe lao, start+1 se recurse, wapas swap. Na path list, na used[].',
          time: 'O(n · n!)', space: 'O(n) stack (output alag)',
          code: `public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, 0, res);
    return res;
}

private void backtrack(int[] nums, int start, List<List<Integer>> res) {
    if (start == nums.length) {
        List<Integer> perm = new ArrayList<>();
        for (int x : nums) perm.add(x);
        res.add(perm);
        return;
    }
    for (int i = start; i < nums.length; i++) {
        swap(nums, start, i);             // choose: nums[i] ko position start pe
        backtrack(nums, start + 1, res);  // explore
        swap(nums, start, i);             // unchoose: wapas
    }
}

private void swap(int[] a, int i, int j) {
    int t = a[i]; a[i] = a[j]; a[j] = t;
}`,
        },
      ],
      dryRun: '[1,2,3] used[]: [] → [1] → [1,2] → [1,2,3] ✓ ← [1,3] → [1,3,2] ✓ ← … → [3,2,1] ✓ (6 leaves). Swap: start=0 swap(0,2) → [3,2,1] … order thoda alag.',
      interview: 'I build permutations with backtracking: at every level any unused element can go next, so I keep a used array, choose an element, recurse, then undo the choice. When the path has n elements I copy it into the result. There are n! permutations and copying each costs O(n), so O(n·n!) time and O(n) extra space for the recursion. An in-place swap version avoids the used array.',
      problem: {
        statement: 'Distinct integers ka array <b>nums</b> diya hai. Iske <b>saare possible permutations</b> (har ordering) return karo — kisi bhi order me.',
        examples: [
          { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', explain: '3 distinct numbers → 3! = 6 orderings. Pehli position ke 3 options, doosri ke 2, teesri ka 1.', viz: { nums: '1, 2, 3' } },
          { input: 'nums = [0,1]', output: '[[0,1],[1,0]]', explain: '2! = 2 orderings.', viz: { nums: '0, 1' } },
          { input: 'nums = [1]', output: '[[1]]', explain: 'Ek element → ek hi permutation.', viz: { nums: '1' } },
        ],
        constraints: ['1 ≤ nums.length ≤ 6', '−10 ≤ nums[i] ≤ 10', 'nums ke saare integers distinct (unique) hain'],
      },
    },

    78: {
      oneLine: 'Har call me path record karo, fir start..n−1 me se ek uthao aur i+1 se recurse — 2ⁿ subsets. Ya iterative / bitmask.',
      pattern: 'Backtracking — Subsets',
      approaches: [
        {
          level: 'Iterative (cascading)', idea: 'res = [[]]. Har naye x ke liye abhi tak ke saare subsets ki copy me x jodo aur add karo. Har element subsets ko double karta hai.',
          time: 'O(n · 2ⁿ)', space: 'O(n · 2ⁿ) (output)',
          code: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    res.add(new ArrayList<>());               // empty subset
    for (int x : nums) {
        int size = res.size();                // sirf purane subsets
        for (int i = 0; i < size; i++) {
            List<Integer> s = new ArrayList<>(res.get(i));
            s.add(x);
            res.add(s);
        }
    }
    return res;
}`,
        },
        {
          level: 'Bitmask', idea: 'n bits ka har number 0..2ⁿ−1 ek subset hai: bit i = 1 → nums[i] lo. n ≤ 10 → max 1024 masks.',
          time: 'O(n · 2ⁿ)', space: 'O(n) extra (output alag)',
          code: `public List<List<Integer>> subsets(int[] nums) {
    int n = nums.length;
    List<List<Integer>> res = new ArrayList<>();
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> s = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) s.add(nums[i]);
        }
        res.add(s);
    }
    return res;
}`,
        },
        {
          level: 'Backtracking', idea: 'Recursion tree ka har node ek subset. Pehle path ki copy save, fir start se aage har element choose → explore(i+1) → unchoose.',
          time: 'O(n · 2ⁿ)', space: 'O(n) stack (output alag)',
          code: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), res);
    return res;
}

private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));       // har node ek subset
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);                // choose
        backtrack(nums, i + 1, path, res); // explore (i+1: peeche nahi)
        path.remove(path.size() - 1);     // unchoose
    }
}`,
        },
      ],
      dryRun: '[1,2,3] backtracking: record [] → [1] → [1,2] → [1,2,3] ← [1,3] ← ← [2] → [2,3] ← ← [3] → 8 subsets. Iterative: [[]] → +1 → +2 → +3 = 1,2,4,8.',
      interview: 'Every element is either in or out, so there are 2^n subsets. With backtracking every node of the recursion tree is a subset: I record a copy of the current path, then for each index from start onward I add it, recurse with i + 1 so I never go backwards, and remove it. That is O(n·2^n) time and O(n) recursion depth. Iteratively I can start from the empty set and, for each number, append it to a copy of every existing subset; bitmasks from 0 to 2^n − 1 also enumerate them.',
      problem: {
        statement: 'Unique integers ka array <b>nums</b> diya hai. Uske <b>saare subsets</b> (power set) return karo. Answer me koi subset duplicate nahi hona chahiye; order kuch bhi chalega.',
        examples: [
          { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]', explain: '3 elements → 2³ = 8 subsets (empty bhi). Visualizer ka ret sorted order me dikhta hai (order matter nahi karta).', viz: { nums: '1, 2, 3' }, ret: '[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]' },
          { input: 'nums = [0]', output: '[[],[0]]', explain: 'Ek element: lo ya mat lo → 2 subsets.', viz: { nums: '0' } },
        ],
        constraints: ['1 ≤ nums.length ≤ 10', '−10 ≤ nums[i] ≤ 10', 'nums ke saare elements unique hain'],
      },
    },

    39: {
      oneLine: 'Sort + remain: c[i] > remain → break; same element reuse allowed → recurse(i, remain − c[i]).',
      pattern: 'Backtracking — Combination Sum (reuse)',
      approaches: [
        {
          level: 'Brute (pick / not-pick)', idea: 'Har index pe do raaste: c[i] lo (index wahi rakho, kyunki reuse allowed) ya c[i] chhodo (i+1). remain 0 → answer, remain < 0 ya i == n → dead end. Pruning kam, tree bada.',
          time: 'O(2^(T/min)) approx', space: 'O(T/min) stack',
          code: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> res = new ArrayList<>();
    dfs(candidates, 0, target, new ArrayList<>(), res);
    return res;
}

private void dfs(int[] c, int i, int remain, List<Integer> path, List<List<Integer>> res) {
    if (remain == 0) {
        res.add(new ArrayList<>(path));
        return;
    }
    if (i == c.length || remain < 0) return;
    path.add(c[i]);                       // pick c[i] (i same: reuse allowed)
    dfs(c, i, remain - c[i], path, res);
    path.remove(path.size() - 1);
    dfs(c, i + 1, remain, path, res);     // skip c[i]
}`,
        },
        {
          level: 'Optimal (sort + for-loop + break)', idea: 'Sort karo. for i = start.. : c[i] > remain → break (aage sab bade). Choose c[i], recurse(i, remain − c[i]) — i isliye ki same number dobara le sakte hain, aur start se peeche nahi jaate isliye [2,3] / [3,2] dono nahi bante.',
          time: 'O(n^(T/min)) upper bound', space: 'O(T/min) stack',
          code: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    Arrays.sort(candidates);
    List<List<Integer>> res = new ArrayList<>();
    backtrack(candidates, 0, target, new ArrayList<>(), res);
    return res;
}

private void backtrack(int[] c, int start, int remain, List<Integer> path, List<List<Integer>> res) {
    if (remain == 0) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int i = start; i < c.length; i++) {
        if (c[i] > remain) break;         // sorted: aage sab bade → prune
        path.add(c[i]);                   // choose
        backtrack(c, i, remain - c[i], path, res); // i (i+1 nahi): reuse allowed
        path.remove(path.size() - 1);     // unchoose
    }
}`,
        },
      ],
      dryRun: '[2,3,6,7], t=7: [2] r5 → [2,2] r3 → [2,2,2] r1 (2>1 break) ← [2,2,3] r0 ✓ ← [2,3] r2 (3>2 break) ← [3] r4 → [3,3] r1 break ← [6] r1 break ← [7] r0 ✓ → [[2,2,3],[7]]',
      interview: 'I sort the candidates and backtrack with the remaining target. At each level I loop from start, and because the array is sorted I break as soon as a candidate exceeds the remainder. Since a number can be reused, I recurse with the same index i, and never going back below start avoids permutations of the same combination. When the remainder hits zero I copy the path. Time is exponential, bounded by roughly n^(target/min), with recursion depth target/min.',
      problem: {
        statement: '<b>Distinct</b> integers ka array <b>candidates</b> aur ek <b>target</b> diya hai. Aise saare <b>unique combinations</b> return karo jinka sum target ho. <b>Ek hi number kitni bhi baar</b> use kar sakte ho. Do combinations alag tab hain jab kisi number ki frequency alag ho. Order kuch bhi.',
        examples: [
          { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]', explain: '2 + 2 + 3 = 7 (2 do baar use hua — allowed), aur 7 = 7.', viz: { candidates: '2, 3, 6, 7', target: '7' } },
          { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]', explain: '2+2+2+2, 2+3+3, 3+5 — sab 8.', viz: { candidates: '2, 3, 5', target: '8' } },
          { input: 'candidates = [2], target = 1', output: '[]', explain: '2 > 1, koi combination nahi.', viz: { candidates: '2', target: '1' } },
        ],
        constraints: ['1 ≤ candidates.length ≤ 30', '2 ≤ candidates[i] ≤ 40', 'candidates ke saare elements distinct', '1 ≤ target ≤ 40', 'Unique combinations 150 se kam (guarantee)'],
      },
    },

    40: {
      oneLine: 'Sort; same level pe duplicate skip (i > start && c[i] == c[i−1]); har element ek baar → recurse(i + 1); c[i] > remain → break.',
      pattern: 'Backtracking — Combination Sum + Duplicates',
      approaches: [
        {
          level: 'Brute (pick / not-pick + Set)', idea: 'Sort karke har element ke liye lo/chhodo (i+1). Duplicate combinations HashSet<List> hata dega (sorted hai isliye [1,7] aur [7,1] nahi, par [1(a),7] aur [1(b),7] same list → set me ek). Tree poora 2ⁿ — n = 100 pe TLE.',
          time: 'O(n · 2ⁿ)', space: 'O(n · answers) set',
          code: `public List<List<Integer>> combinationSum2(int[] candidates, int target) {
    Arrays.sort(candidates);
    Set<List<Integer>> set = new HashSet<>();
    dfs(candidates, 0, target, new ArrayList<>(), set);
    return new ArrayList<>(set);
}

private void dfs(int[] c, int i, int remain, List<Integer> path, Set<List<Integer>> set) {
    if (remain == 0) {
        set.add(new ArrayList<>(path));
        return;
    }
    if (i == c.length || remain < 0) return;
    path.add(c[i]);
    dfs(c, i + 1, remain - c[i], path, set);   // pick (ek hi baar)
    path.remove(path.size() - 1);
    dfs(c, i + 1, remain, path, set);          // skip
}`,
        },
        {
          level: 'Optimal (sort + skip duplicates + break)', idea: 'Sort. Loop me: same level pe pichle jaisa value ho (i > start) toh skip — duplicate branch hi nahi banegi. c[i] > remain → break. Har element ek baar → recurse(i + 1).',
          time: 'O(n · 2ⁿ) worst, pruning se bahut kam', space: 'O(n) stack',
          code: `public List<List<Integer>> combinationSum2(int[] candidates, int target) {
    Arrays.sort(candidates);
    List<List<Integer>> res = new ArrayList<>();
    backtrack(candidates, 0, target, new ArrayList<>(), res);
    return res;
}

private void backtrack(int[] c, int start, int remain, List<Integer> path, List<List<Integer>> res) {
    if (remain == 0) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int i = start; i < c.length; i++) {
        if (i > start && c[i] == c[i - 1]) continue; // same level pe duplicate skip
        if (c[i] > remain) break;                    // sorted → prune
        path.add(c[i]);
        backtrack(c, i + 1, remain - c[i], path, res); // i+1: har element ek baar
        path.remove(path.size() - 1);
    }
}`,
        },
      ],
      dryRun: 'sorted [1,1,2,5,6,7,10], t=8: [1] → [1,1] → [1,1,6] ✓ … [1,2,5] ✓, [1,7] ✓; level 0 pe doosra 1 skip; [2,6] ✓ → [[1,1,6],[1,2,5],[1,7],[2,6]]',
      interview: 'Each candidate can be used once and the input has duplicates, so I sort first. In the backtracking loop I skip a value equal to the previous one at the same level — i greater than start and c[i] equals c[i−1] — which stops duplicate combinations from being generated at all, while still allowing the same value deeper in the path. I recurse with i + 1 because each element is used once, and break when a candidate exceeds the remainder. Worst case is O(n·2^n), but pruning cuts most of the tree.',
      problem: {
        statement: 'Array <b>candidates</b> (duplicates ho sakte hain) aur <b>target</b> diya hai. Saare <b>unique combinations</b> return karo jinka sum target ho. <b>Har index ka number sirf ek baar</b> use ho sakta hai, aur answer me duplicate combination nahi chahiye.',
        examples: [
          { input: 'candidates = [10,1,2,7,6,1,5], target = 8', output: '[[1,1,6],[1,2,5],[1,7],[2,6]]', explain: 'Sort → [1,1,2,5,6,7,10]. Do 1 hain, isliye [1,1,6] valid hai, lekin [1,7] sirf ek baar aana chahiye.', viz: { candidates: '10, 1, 2, 7, 6, 1, 5', target: '8' } },
          { input: 'candidates = [2,5,2,1,2], target = 5', output: '[[1,2,2],[5]]', explain: 'Sort → [1,2,2,2,5]. 1+2+2 = 5 aur 5 = 5. Teen 2 hain par [1,2,2] ek hi baar.', viz: { candidates: '2, 5, 2, 1, 2', target: '5' } },
        ],
        constraints: ['1 ≤ candidates.length ≤ 100', '1 ≤ candidates[i] ≤ 50', '1 ≤ target ≤ 30'],
      },
    },

    90: {
      oneLine: 'Subsets + duplicates: sort, aur loop me i > start && nums[i] == nums[i−1] → continue.',
      pattern: 'Backtracking — Subsets + Duplicates',
      approaches: [
        {
          level: 'Brute (all subsets + HashSet)', idea: 'Sort karo (taaki [2,1] aur [1,2] same list bane), bitmask se saare 2ⁿ subsets banao, HashSet<List> duplicates hata dega.',
          time: 'O(n · 2ⁿ)', space: 'O(n · 2ⁿ) set',
          code: `public List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums);                        // same values paas-paas
    Set<List<Integer>> set = new HashSet<>();
    int n = nums.length;
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> s = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) s.add(nums[i]);
        }
        set.add(s);                           // duplicate list ignore
    }
    return new ArrayList<>(set);
}`,
        },
        {
          level: 'Optimal (sort + skip)', idea: 'LC 78 ka backtracking + ek line: same level pe pichla jaisa value aaye toh skip. Duplicate subset banta hi nahi — set ki zaroorat nahi.',
          time: 'O(n · 2ⁿ)', space: 'O(n) stack (output alag)',
          code: `public List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), res);
    return res;
}

private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        if (i > start && nums[i] == nums[i - 1]) continue; // same level duplicate skip
        path.add(nums[i]);
        backtrack(nums, i + 1, path, res);
        path.remove(path.size() - 1);
    }
}`,
        },
      ],
      dryRun: '[1,2,2]: [] → [1] → [1,2] → [1,2,2] ← ← (i=2 skip) ← [2] → [2,2] ← ← (i=2 skip at level 0) → [[],[1],[1,2],[1,2,2],[2],[2,2]]',
      interview: 'This is Subsets with duplicates. I sort the array so equal values are adjacent, then run the same backtracking where every node is a subset. The only change is in the loop: if i is greater than start and nums[i] equals nums[i−1], I skip it, because choosing the same value again at the same level would build the same subtree. Deeper levels may still pick it, which gives [1,2,2]. Time O(n·2^n), recursion depth O(n), and no HashSet needed.',
      problem: {
        statement: 'Integer array <b>nums</b> diya hai jisme <b>duplicates ho sakte hain</b>. Saare possible subsets return karo, lekin answer me <b>koi subset do baar nahi</b> aana chahiye. Order kuch bhi.',
        examples: [
          { input: 'nums = [1,2,2]', output: '[[],[1],[1,2],[1,2,2],[2],[2,2]]', explain: '2³ = 8 me se [2] aur [1,2] do-do baar bante — unique sirf 6.', viz: { nums: '1, 2, 2' } },
          { input: 'nums = [0]', output: '[[],[0]]', explain: 'Ek element → empty aur [0].', viz: { nums: '0' } },
        ],
        constraints: ['1 ≤ nums.length ≤ 10', '−10 ≤ nums[i] ≤ 10'],
      },
    },

    131: {
      oneLine: 'start se har end tak prefix palindrome ho toh cut karo (path me daalo), end+1 se recurse; start == n → ek partition.',
      pattern: 'Backtracking — Partitioning',
      approaches: [
        {
          level: 'Backtracking (isPal har baar)', idea: 'Har start pe end = start..n−1 try karo. s[start..end] palindrome ho tabhi choose (substring path me), end+1 se explore, wapas remove. Palindrome check two pointers se O(n).',
          time: 'O(n · 2ⁿ)', space: 'O(n) stack (output alag)',
          code: `public List<List<String>> partition(String s) {
    List<List<String>> res = new ArrayList<>();
    backtrack(s, 0, new ArrayList<>(), res);
    return res;
}

private void backtrack(String s, int start, List<String> path, List<List<String>> res) {
    if (start == s.length()) {
        res.add(new ArrayList<>(path));       // poori string cut ho gayi
        return;
    }
    for (int end = start; end < s.length(); end++) {
        if (!isPal(s, start, end)) continue;  // prune: yahan cut nahi
        path.add(s.substring(start, end + 1)); // choose
        backtrack(s, end + 1, path, res);     // explore
        path.remove(path.size() - 1);         // unchoose
    }
}

private boolean isPal(String s, int l, int r) {
    while (l < r) {
        if (s.charAt(l++) != s.charAt(r--)) return false;
    }
    return true;
}`,
        },
        {
          level: 'Optimal (DP palindrome table)', idea: 'pal[i][j] pehle hi O(n²) me bana lo: s[i] == s[j] aur (j − i < 2 ya pal[i+1][j−1]). Fir backtracking me check O(1). Same palindrome baar-baar check nahi hota.',
          time: 'O(n · 2ⁿ) (check O(1))', space: 'O(n²) table',
          code: `public List<List<String>> partition(String s) {
    int n = s.length();
    boolean[][] pal = new boolean[n][n];      // pal[i][j] = s[i..j] palindrome?
    for (int i = n - 1; i >= 0; i--) {
        for (int j = i; j < n; j++) {
            pal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || pal[i + 1][j - 1]);
        }
    }
    List<List<String>> res = new ArrayList<>();
    backtrack(s, 0, pal, new ArrayList<>(), res);
    return res;
}

private void backtrack(String s, int start, boolean[][] pal, List<String> path, List<List<String>> res) {
    if (start == s.length()) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int end = start; end < s.length(); end++) {
        if (!pal[start][end]) continue;       // O(1) check
        path.add(s.substring(start, end + 1));
        backtrack(s, end + 1, pal, path, res);
        path.remove(path.size() - 1);
    }
}`,
        },
      ],
      dryRun: '"aab": start0 "a" ✓ → start1 "a" ✓ → start2 "b" ✓ → [a,a,b] ✓ ← "ab" ✗ ← "aa" ✓ → start2 "b" → [aa,b] ✓ ← "aab" ✗ → [["a","a","b"],["aa","b"]]',
      interview: 'I treat it as choosing where to cut. From index start I try every end; if s[start..end] is a palindrome I add that substring to the path and recurse from end + 1, then remove it. When start reaches the end of the string, the path is a full partition and I copy it. There are up to 2^(n−1) ways to cut and each costs O(n), so O(n·2^n). I can precompute an n×n palindrome table with DP so each check is O(1).',
      problem: {
        statement: 'String <b>s</b> diya hai. Use aise tukdon me baanto ki <b>har tukda palindrome</b> ho. Aise <b>saare possible partitions</b> return karo.',
        examples: [
          { input: 's = "aab"', output: '[["a","a","b"],["aa","b"]]', explain: '"a"|"a"|"b" — teeno palindrome. "aa"|"b" — dono palindrome. "aab" ya "ab" palindrome nahi.', viz: { s: 'aab' } },
          { input: 's = "a"', output: '[["a"]]', explain: 'Ek character hamesha palindrome.', viz: { s: 'a' } },
        ],
        constraints: ['1 ≤ s.length ≤ 16', 's me sirf lowercase English letters'],
      },
    },

    79: {
      oneLine: 'Har cell se DFS: bounds/mismatch → false; cell mark karo, 4 directions me k+1 dhundo, unmark. k == word.length() → true.',
      pattern: 'Backtracking — Grid DFS',
      approaches: [
        {
          level: 'Backtracking (visited[][])', idea: 'Har cell (r, c) ko start maan ke dfs(k = 0). dfs: k == L → true; bahar / visited / letter match nahi → false. visited mark, 4 neighbours me k+1, unmark. || short-circuit: ek mila toh baaki nahi.',
          time: 'O(m·n · 4^L)', space: 'O(m·n) visited + O(L) stack',
          code: `public boolean exist(char[][] board, String word) {
    int m = board.length, n = board[0].length;
    boolean[][] visited = new boolean[m][n];
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (dfs(board, word, 0, r, c, visited)) return true;
        }
    }
    return false;
}

private boolean dfs(char[][] board, String word, int k, int r, int c, boolean[][] visited) {
    if (k == word.length()) return true;        // saare letters mil gaye
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
    if (visited[r][c] || board[r][c] != word.charAt(k)) return false;
    visited[r][c] = true;                       // choose
    boolean found = dfs(board, word, k + 1, r + 1, c, visited)
            || dfs(board, word, k + 1, r - 1, c, visited)
            || dfs(board, word, k + 1, r, c + 1, visited)
            || dfs(board, word, k + 1, r, c - 1, visited);
    visited[r][c] = false;                      // unchoose
    return found;
}`,
        },
        {
          level: 'Optimal (in-place # + frequency prune)', idea: 'visited[][] ki jagah cell ko hi "#" bana do (O(1) extra). Pehle frequency check: board me word ke letters hi kam hain toh seedha false. Return true se pehle bhi restore karo.',
          time: 'O(m·n · 3^L)', space: 'O(L) stack',
          code: `public boolean exist(char[][] board, String word) {
    int m = board.length, n = board[0].length;
    int[] freq = new int[128];
    for (char[] row : board) for (char ch : row) freq[ch]++;
    for (char ch : word.toCharArray()) {
        if (--freq[ch] < 0) return false;       // board me itne letters hi nahi
    }
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (dfs(board, word, 0, r, c)) return true;
        }
    }
    return false;
}

private boolean dfs(char[][] board, String word, int k, int r, int c) {
    if (k == word.length()) return true;
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
    if (board[r][c] != word.charAt(k)) return false;   // '#' bhi yahin fail
    char saved = board[r][c];
    board[r][c] = '#';                          // choose: visited mark
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    for (int[] d : dirs) {
        if (dfs(board, word, k + 1, r + d[0], c + d[1])) {
            board[r][c] = saved;                // return se pehle restore
            return true;
        }
    }
    board[r][c] = saved;                        // unchoose
    return false;
}`,
        },
      ],
      dryRun: 'ABCCED: (0,0)A → (0,1)B → (0,2)C → (1,2)C → (2,2)E → (2,1)D → k=6 true. ABCB: A→B→C→(B already visited) ✗ → … false.',
      interview: 'I try every cell as a starting point and run a DFS that matches word[k] at cell (r, c). The DFS returns false when out of bounds, on a visited cell or on a letter mismatch, and true when k reaches the word length. Before exploring the four neighbours I mark the cell, and I unmark it on the way back so other paths can use it. That is O(m·n·3^L) time since each step has at most three new directions, and O(L) recursion depth. Marking in place with a sentinel saves the visited matrix, and a letter-frequency check prunes impossible words early.',
      problem: {
        statement: '<b>m × n</b> characters ka grid <b>board</b> aur ek string <b>word</b> diya hai. Batao kya word grid me ban sakta hai — letters <b>adjacent cells</b> (upar/neeche/left/right) se line me jud ke bane, aur <b>ek cell ek word me sirf ek baar</b> use ho.',
        examples: [
          { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true', explain: 'A(0,0) → B(0,1) → C(0,2) → C(1,2) → E(2,2) → D(2,1).', viz: { board: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]', word: 'ABCCED' } },
          { input: 'board = (same), word = "SEE"', output: 'true', explain: 'S(1,3) → E(2,3) → E(2,2).', viz: { board: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]', word: 'SEE' } },
          { input: 'board = (same), word = "ABCB"', output: 'false', explain: 'A → B → C ke baad wapas B chahiye, lekin (0,1) wala B already use ho chuka — same cell dobara nahi.', viz: { board: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]', word: 'ABCB' } },
        ],
        constraints: ['m == board.length, n == board[i].length', '1 ≤ m, n ≤ 6', '1 ≤ word.length ≤ 15', 'board aur word me sirf English letters (upper + lower case)', 'Follow-up: search pruning se bade board pe fast karo'],
      },
    },
  },

  // ---------------- DAILY PLAN (21 din = 3 weeks, sirf course ke 7 questions) ----------------
  days: [
    {
      day: 1, week: 1, dow: 'Mon', type: 'learn', title: 'Recursion Basics + Recursion Tree (Subsets)',
      theory: ['Base case + recursive case', 'Call stack: push / pop', 'Recursion tree = har call ek node', 'Include / exclude → 2ⁿ'],
      qs: [78],
      interview: {
        q: 'What is recursion and what happens on the call stack?',
        a: 'Recursion is when a function solves a problem by calling itself on a smaller input until it reaches a base case. Every call pushes a new stack frame holding its own parameters and local variables; when a call returns, its frame is popped and control goes back to the caller exactly where it left off. A missing or unreachable base case keeps pushing frames until Java throws StackOverflowError. For backtracking the depth equals the length of the current path, so the stack is O(n), which is tiny for the small inputs these problems have.',
      },
    },
    {
      day: 2, week: 1, dow: 'Tue', type: 'learn', title: 'Backtracking Template: Choose → Explore → Unchoose (Permutations)',
      theory: ['Shared path list', 'choose / explore / unchoose', 'used[] array', 'new ArrayList<>(path) copy kyun'],
      qs: [46],
      interview: {
        q: 'What is backtracking?',
        a: 'Backtracking is a depth-first search over the tree of partial solutions. At each step I choose one option, explore everything that follows from it recursively, and then undo the choice so the next option starts from a clean state — choose, explore, unchoose. Because all calls share one path and I restore it after each branch, memory stays O(depth). When a partial solution can never lead to an answer I prune that branch. It is the go-to technique when a problem asks for all subsets, permutations, combinations or arrangements.',
      },
    },
    {
      day: 3, week: 1, dow: 'Wed', type: 'learn', title: 'Subsets — 3 tarike: Backtracking, Iterative, Bitmask',
      theory: ['Har node = subset (record pehle)', 'Iterative: har element subsets double', 'Bitmask 0..2ⁿ−1', 'O(n · 2ⁿ) kyun best hai'],
      qs: [78],
      interview: {
        q: 'Why is O(n·2^n) optimal for generating all subsets?',
        a: 'There are exactly 2^n subsets, because each of the n elements is independently in or out, and the average subset has n/2 elements. Any algorithm that outputs all of them must at least write every element of every subset, which is Θ(n·2^n) work. So backtracking, the iterative doubling method and bitmask enumeration are all optimal up to constants. I usually say this explicitly, because it tells the interviewer I know why no further optimization is possible.',
      },
    },
    {
      day: 4, week: 1, dow: 'Thu', type: 'learn', title: 'Permutations — Swap in-place + n! tree',
      theory: ['Position start pe kaun baithe?', 'swap → recurse → swap back', 'Subsets vs Permutations', 'n · n! complexity'],
      qs: [46],
      interview: {
        q: 'What is the difference between subsets, combinations and permutations?',
        a: 'A subset is any selection of elements where order does not matter and the size can be anything, so there are 2^n of them. A combination is a selection of a specific size or with a property such as a target sum, still order-independent — I enforce that with a start index so I never go backwards. A permutation is an ordering where order matters, so every unused element can go in the next position, giving n! results, and I track usage with a used array or swaps. Recognizing which one a problem wants decides the loop bounds in my backtracking.',
      },
    },
    {
      day: 5, week: 1, dow: 'Fri', type: 'learn', title: 'Combination Sum — reuse allowed + pruning',
      theory: ['remain = target − sum', 'Reuse → recurse(i)', 'Sort + break (prune)', 'start index → no duplicate orderings'],
      qs: [39],
      interview: {
        q: 'What is pruning in backtracking and why does it matter?',
        a: 'Pruning means cutting off a branch of the recursion tree as soon as I can prove it cannot lead to a valid answer, instead of exploring it to the leaves. In Combination Sum I sort the candidates, so once a candidate exceeds the remaining target every later one does too and I can break out of the loop. Since backtracking trees grow exponentially, removing a branch near the root removes an exponential number of nodes. The worst-case complexity often stays the same on paper, but in practice pruning is what makes these solutions pass.',
      },
    },
    {
      day: 6, week: 1, dow: 'Sat', type: 'revision', title: 'Revision — Week 1 (Recursion + Subsets + Permutations + Combination Sum)',
      theory: ['Bina dekhe re-solve: 78, 46, 39', 'Phase 7 recursion warm-up: LC 104', 'Recursion tree paper pe banao', 'Timer: Medium 25 min'],
      qs: [78, 46, 39, 104],
      interview: {
        q: 'How do you analyze the time complexity of a backtracking solution?',
        a: 'I look at the recursion tree: the number of nodes times the work done per node. For subsets the tree has 2^n nodes and I copy up to n elements at each, so O(n·2^n). For permutations there are about n! leaves with O(n) copying, so O(n·n!). For something like Combination Sum I bound the branching factor by n and the depth by target divided by the smallest candidate. Space is the recursion depth plus the current path, not counting the output, which I mention separately.',
      },
    },
    {
      day: 7, week: 1, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest',
      theory: ['30 min: Tum interviews Sohvi (LC 78 bina dekhe)', '30 min: Sohvi interviews Tum (LC 39 bina dekhe)', '30 min: Weekly contest discussion', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [78, 39],
      interview: {
        q: 'How do you explain a recursive solution clearly in an interview?',
        a: 'I start with the recursion tree on a tiny example, say three elements, and describe what one node represents — for example the current path and the start index. Then I state the base case, the choices at each node, and what I undo after each choice. Only then do I write code, keeping the helper signature small and naming parameters after what they mean, like start and remain. Finally I dry-run the first few calls aloud, showing how the path grows and shrinks, and finish with the complexity derived from the tree.',
      },
    },
    {
      day: 8, week: 2, dow: 'Mon', type: 'learn', title: 'Duplicates Handling — Subsets II (sort + skip)',
      theory: ['Sort → same values paas-paas', 'i > start && nums[i] == nums[i−1]', 'Same level vs deeper level', 'HashSet brute vs skip'],
      qs: [90],
      interview: {
        q: 'How do you avoid duplicate results in backtracking when the input has duplicates?',
        a: 'I sort the input so equal values sit next to each other. Then inside the loop at each recursion level I skip an element if it equals the previous element and it is not the first choice at that level — the condition i > start and nums[i] == nums[i−1]. Picking the same value twice at one level would build an identical subtree, so skipping it removes duplicates at the source. Deeper levels can still take the repeated value, so results like [1,2,2] are kept. This is cleaner and faster than generating everything and deduplicating with a HashSet.',
      },
    },
    {
      day: 9, week: 2, dow: 'Tue', type: 'learn', title: 'Combination Sum II — ek baar use + duplicates',
      theory: ['recurse(i + 1): har element ek baar', 'Duplicate skip + break dono', 'LC 39 vs LC 40 diff', 'Brute Set kyun TLE'],
      qs: [40],
      interview: {
        q: 'Compare Combination Sum and Combination Sum II.',
        a: 'In Combination Sum the candidates are distinct and each can be reused unlimited times, so after choosing c[i] I recurse with the same index i. In Combination Sum II the input can contain duplicates and each element can be used only once, so I recurse with i + 1 and also sort and skip equal values at the same level to avoid duplicate combinations. Both sort the array and break when a candidate exceeds the remaining target. So the differences are exactly two lines: the recursion index and the duplicate-skip check.',
      },
    },
    {
      day: 10, week: 2, dow: 'Wed', type: 'learn', title: 'Pick / Not-pick vs For-loop — brute approaches of 40 & 90',
      theory: ['Binary tree (lo/chhodo) vs n-ary tree (for-loop)', 'HashSet<List> dedupe', 'Kab kaunsa style', 'Sort zaroori kyun (dono me)'],
      qs: [40, 90],
      interview: {
        q: 'Pick/not-pick recursion versus the for-loop style — when would you use each?',
        a: 'Pick/not-pick makes a binary decision per index: include element i or skip it, then move to i + 1. It maps directly to the 2^n idea and is easy to reason about, and it is the natural shape for many DP problems later. The for-loop style asks which element comes next from start onward, which gives an n-ary tree where every node can be an answer. The for-loop version makes duplicate skipping and sorted breaking very easy, so I prefer it for subsets and combination problems, while pick/not-pick is handy when I may later add memoization.',
      },
    },
    {
      day: 11, week: 2, dow: 'Thu', type: 'learn', title: 'Palindrome Partitioning — string ko cut karna',
      theory: ['Choice = kahan cut karein', 'Prefix palindrome check (two pointers)', 'start == n → partition', 'substring(start, end + 1)'],
      qs: [131],
      interview: {
        q: 'How would you model a partitioning problem with backtracking?',
        a: 'I treat the choice at each step as where to make the next cut. From the current start index I try every end index; if the piece s[start..end] satisfies the condition — here, being a palindrome — I add it to the path and recurse from end + 1. Pieces that fail are pruned immediately. When start reaches the length of the string, the path is a complete partition and I copy it into the result. The recursion depth is at most n and the number of partitions is at most 2^(n−1).',
      },
    },
    {
      day: 12, week: 2, dow: 'Fri', type: 'learn', title: 'Palindrome Partitioning — DP table optimization + catch-up',
      theory: ['pal[i][j] = s[i]==s[j] && pal[i+1][j−1]', 'i neeche se, j upar', 'Check O(1)', 'Catch-up: LC 39 bina dekhe'],
      qs: [131, 39],
      interview: {
        q: 'When do you combine dynamic programming with backtracking?',
        a: 'When the backtracking repeatedly asks the same sub-question, I precompute those answers with DP. In Palindrome Partitioning every branch checks whether some substring s[i..j] is a palindrome, and the same pairs come up again and again. An n×n table where pal[i][j] is true if the ends match and the inside is a palindrome takes O(n²) to build, filling i from the end so pal[i+1][j−1] is ready. The backtracking still enumerates all partitions, but each check becomes O(1). If the question asked only for a count or the minimum cuts, I would drop backtracking and use DP alone.',
      },
    },
    {
      day: 13, week: 2, dow: 'Sat', type: 'revision', title: 'Revision — Week 2 (Duplicates + Partitioning)',
      theory: ['Bina dekhe re-solve: 90, 40, 131, 46', 'Duplicate skip line zubaani', '39 vs 40 ke 2 line ka fark', 'Visualizer me recursion tree match karo'],
      qs: [90, 40, 131, 46],
      interview: {
        q: 'Why do we need to copy the path before adding it to the result?',
        a: 'In backtracking a single path list is shared by every recursive call and keeps changing as I choose and unchoose. If I add the path itself to the result, I am storing a reference to that same object, so later modifications show up in every stored entry, and at the end they would all be empty. Creating new ArrayList of path takes a snapshot at that moment. The copy costs O(length), which is why the n factor appears in complexities like O(n·2^n).',
      },
    },
    {
      day: 14, week: 2, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest',
      theory: ['30 min: Tum interviews Sohvi (LC 46 bina dekhe)', '30 min: Sohvi interviews Tum (LC 40 bina dekhe)', '30 min: Contest discussion', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [46, 40],
      interview: {
        q: 'What do you do if you get stuck during a backtracking question?',
        a: 'I go back to a tiny example and draw the first two levels of the recursion tree by hand. That usually reveals what a node represents, which choices exist at each level, and when to stop. I say this out loud so the interviewer can follow, and ask whether order matters and whether elements can be reused, because those answers decide between a start index, a used array, or recursing with i versus i + 1. Once the tree is clear, the code is the standard choose, explore, unchoose template.',
      },
    },
    {
      day: 15, week: 3, dow: 'Mon', type: 'learn', title: 'Grid DFS Backtracking — Word Search (visited[][])',
      theory: ['Har cell = start', 'Bounds → visited → letter match', 'Mark → 4 directions → unmark', '|| short-circuit'],
      qs: [79],
      interview: {
        q: 'How is Word Search different from a normal grid DFS like flood fill?',
        a: 'In flood fill a visited cell stays visited forever, because we only care whether a cell is reachable. In Word Search a cell may be used by one candidate path and then be needed again by a different path, so after exploring from a cell I must unmark it — that undo step makes it backtracking rather than plain DFS. The DFS also carries the index k into the word and fails immediately on a letter mismatch. That is why its complexity is exponential in the word length, around m·n·3^L, instead of linear in the grid size.',
      },
    },
    {
      day: 16, week: 3, dow: 'Tue', type: 'learn', title: 'Word Search — in-place marking + pruning',
      theory: ["board[r][c] = '#' (O(1) extra)", 'Return se pehle restore', 'Frequency check prune', '3^L kyun (4 nahi)'],
      qs: [79],
      interview: {
        q: 'How would you speed up Word Search on large boards?',
        a: 'First I prune before searching: if the board does not contain enough of each letter in the word, I return false immediately. A related trick is to search the reversed word when its first letter is more common on the board than its last letter, so fewer starting cells match. Inside the DFS I mark cells in place with a sentinel character instead of allocating a visited matrix, and I fail fast on bounds or mismatches before recursing. For many words on the same board, I would build a trie and search all words in one pass.',
      },
    },
    {
      day: 17, week: 3, dow: 'Wed', type: 'learn', title: 'Complexity of Backtracking + Template mastery (46 & 78 re-solve)',
      theory: ['Nodes × work per node', '2ⁿ vs n! vs k^L', 'Space: depth + path (output alag)', '46 & 78 memory se 10 min'],
      qs: [46, 78],
      interview: {
        q: 'Iterative or recursive — which would you choose for generating subsets?',
        a: 'Both have the same O(n·2^n) time. The recursive backtracking version uses O(n) stack and extends naturally to constraints like duplicates, target sums or pruning, which is why I default to it in interviews. The iterative doubling version and the bitmask version avoid recursion entirely, which is nice when stack depth is a concern or when I need to index subsets directly, for example mapping a mask to a subset. Bitmasks only work while n fits in the bits of an int or long, which is fine for n up to about 20.',
      },
    },
    {
      day: 18, week: 3, dow: 'Thu', type: 'learn', title: 'Combination family re-solve: LC 39 + LC 40 (timer)',
      theory: ['Two-line diff: i vs i+1, duplicate skip', 'Break vs continue', 'Sort pehle', '20 min me dono'],
      qs: [39, 40],
      interview: {
        q: 'Why break instead of continue when a candidate exceeds the remaining target?',
        a: 'Because the candidates are sorted in increasing order. If c[i] is already larger than the remaining target, every c[j] with j greater than i is at least as large, so none of them can fit either. A continue would still check each of them one by one and get the same answer, while break ends the loop immediately and prunes all those branches. This only holds after sorting; on an unsorted array I could only skip that single element. In contrast, the duplicate check must use continue, because a later, different value may still work.',
      },
    },
    {
      day: 19, week: 3, dow: 'Fri', type: 'learn', title: 'Phase catch-up: LC 131 + LC 90 re-solve',
      theory: ['Partition vs subset tree', 'Duplicate skip dobara', 'Pattern pehchano 30 sec me', 'Bina dekhe likho + viz se verify'],
      qs: [131, 90],
      interview: {
        q: 'How do you recognize that a problem needs backtracking?',
        a: 'The strongest signal is that the problem asks for all solutions — all subsets, permutations, combinations, partitions or paths — rather than a count or a single optimum. Small constraints are the second signal: n up to about 10 to 20, or a word up to 15 letters on a 6 by 6 board, because exponential time is only feasible there. Third, the solution can be built step by step, with constraints I can check on a partial solution so I can prune. If the problem only asks for a count or the best value and subproblems repeat, I would consider dynamic programming instead.',
      },
    },
    {
      day: 20, week: 3, dow: 'Sat', type: 'revision', title: 'Revision — Week 3 (Grid DFS + poora phase)',
      theory: ['Bina dekhe re-solve: 79, 131, 40, 236', 'Phase 7 recursion: LC 236 LCA', 'Last Minute triggers zubaani', 'Har question ka recursion tree 1 min me'],
      qs: [79, 131, 40, 236],
      interview: {
        q: 'What is the difference between DFS and backtracking?',
        a: 'DFS is a traversal strategy: go as deep as possible along one branch before trying the next. Backtracking is DFS over a space of partial solutions, where the key extra step is undoing a choice after exploring it so the shared state is clean for the next option. In graph DFS like counting islands, visited marks are permanent; in backtracking like Word Search or permutations, marks are removed on the way back. Backtracking also usually prunes branches that cannot lead to a valid answer.',
      },
    },
    {
      day: 21, week: 3, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest + Phase Test',
      theory: ['30 min: Tum interviews Sohvi (LC 78 bina dekhe)', '30 min: Sohvi interviews Tum (LC 79 bina dekhe)', '30 min: Contest discussion', 'Phase test: Last Minute tab ki saari one-liners bolo'],
      qs: [78, 79],
      interview: {
        q: 'Can recursion cause problems in production code, and how do you avoid them?',
        a: 'Yes. Java does not do tail-call optimization, so very deep recursion — say a DFS over a long linked structure or a huge grid — can throw StackOverflowError, and each frame also costs some memory and call overhead. In backtracking problems the depth is bounded by a small n, so it is safe. When depth can be large, I convert the recursion to an explicit stack or a queue, or restructure it iteratively. I also make sure every recursive path reaches a base case and that shared state is restored even on early returns.',
      },
    },
  ],

  // ---------------- LAST MINUTE ----------------
  lastMinute: {
    triggers: [
      ['"All subsets" / power set', 'Backtracking start index, har node record (LC 78)'],
      ['All arrangements / order matters', 'Permutations: used[] ya swap, leaf pe record (LC 46)'],
      ['Sum = target, reuse allowed', 'Sort + remain + break, recurse(i) (LC 39)'],
      ['Sum = target, har element ek baar + duplicates', 'Sort + skip i>start dup + recurse(i+1) (LC 40)'],
      ['Subsets but input me duplicates', 'Sort + i > start && a[i] == a[i−1] → continue (LC 90)'],
      ['Partition string, har part valid', 'start se har end try, valid prefix → recurse(end+1) (LC 131)'],
      ['Grid me word / path, cell reuse nahi', 'DFS + mark / unmark (LC 79)'],
      ['n ≤ 10–20, "return all"', 'Exponential OK → backtracking'],
    ],
    edge: [
      'Ek element (n = 1) → [[1]] / [[],[x]]',
      'Combination Sum: sab candidates > target → []',
      'Duplicates input (LC 40, 90) → sort bhoolna mat',
      'Word Search: word board se lamba / letters kam → false',
      'Word Search: 1×1 board, 1 letter word',
      'Palindrome Partition: sab same letters ("aaa") → 4 partitions',
    ],
    mistakes: [
      'res.add(path) — copy nahi kiya → end me sab khaali lists',
      'Unchoose bhool gaye → path badhta hi gaya',
      'path.remove(x) jab x Integer → object remove; hamesha path.remove(path.size() − 1)',
      'Duplicate skip me i > 0 likh diya (i > start chahiye) → [1,2,2] kho gaya',
      'Sort kiye bina duplicate skip / break lagaya',
      'LC 39 me i+1 ya LC 40 me i — reuse rule ulta',
      'Word Search me unmark (restore) bhoolna, ya return true se pehle restore na karna',
      'substring(start, end) — end exclusive hai, end + 1 chahiye',
    ],
  },
};
