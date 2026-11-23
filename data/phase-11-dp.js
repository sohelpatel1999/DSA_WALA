window.PHASE_CONTENT = window.PHASE_CONTENT || {};

window.PHASE_CONTENT['dp'] = {
  intro: 'Dynamic Programming = "recursion + yaaddasht". Jab ek hi chhota sawaal baar-baar solve ho raha ho, ek baar solve karo, answer table me likh lo, aur dobara padh lo. Har DP problem ka safar same hai: Recursion → Memoization → Tabulation → Space optimization.',

  // ---------------- FUNDAMENTALS ----------------
  fundamentals: [
    {
      h: 'DP kya hai? (2 conditions)',
      body: `<p><b>Dynamic Programming</b> ek technique hai jisme bade problem ko chhote <b>subproblems</b> me todte hain, har subproblem ka answer <b>ek hi baar</b> nikaalte hain aur use <b>store</b> kar lete hain.</p>
<p>DP tabhi lagta hai jab problem me ye <b>dono</b> cheezein hon:</p>
<table class="tbl"><thead><tr><th>Condition</th><th>Matlab</th><th>Example</th></tr></thead><tbody>
<tr><td><b>Optimal substructure</b></td><td>Bade problem ka answer chhote problems ke answers se ban jaata hai</td><td><code>ways(n) = ways(n−1) + ways(n−2)</code></td></tr>
<tr><td><b>Overlapping subproblems</b></td><td>Same chhota problem baar-baar aata hai</td><td><code>ways(3)</code> recursion tree me kai baar</td></tr>
</tbody></table>
<p class="tip">Sirf optimal substructure ho, overlap na ho (jaise merge sort) → woh <b>Divide &amp; Conquer</b> hai, DP nahi. Overlap hi DP ko fast banata hai.</p>
<p><b>Backtracking (Phase 9) vs DP:</b> backtracking saare raaste <b>list</b> karta hai (subsets, combinations). DP sirf raaston ki <b>ginti / best value</b> chahiye toh store karke fast ho jaata hai — e.g. LC 39 me saare combinations chahiye (backtracking), LC 518 me sirf count (DP).</p>`,
    },
    {
      h: 'State · Transition · Base case (DP ke 3 sawaal)',
      body: `<p>Har DP problem me pehle ye 3 cheezein <b>likh ke</b> tay karo — code baad me:</p>
<ol>
<li><b>State</b> — <code>dp[i]</code> ka matlab ek line me. "dp[i] = step i tak pahunchne ke tarike". Jitne variables badalte hain utne dimensions (1D / 2D).</li>
<li><b>Transition</b> — <code>dp[i]</code> pichle states se kaise banta hai. "Last step kya tha?" ya "is element ko lu ya chhodu?" socho.</li>
<li><b>Base case</b> — sabse chhota state jiska answer seedha pata hai (<code>dp[0]</code>, empty string, amount 0).</li>
</ol>
<table class="tbl"><thead><tr><th>LC</th><th>State</th><th>Transition</th><th>Base</th></tr></thead><tbody>
<tr><td>70</td><td>dp[i] = step i tak ke tarike</td><td>dp[i−1] + dp[i−2]</td><td>dp[0] = dp[1] = 1</td></tr>
<tr><td>746</td><td>dp[i] = step i tak min cost</td><td>min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2])</td><td>dp[0] = dp[1] = 0</td></tr>
<tr><td>198</td><td>dp[i] = pehle i ghar se max paisa</td><td>max(dp[i−1], dp[i−2] + nums[i−1])</td><td>dp[0] = 0, dp[1] = nums[0]</td></tr>
<tr><td>322</td><td>dp[a] = amount a ke min coins</td><td>min over coins (dp[a−c] + 1)</td><td>dp[0] = 0, baaki ∞</td></tr>
<tr><td>518</td><td>dp[a] = amount a ke tarike</td><td>dp[a] += dp[a−c] (coin bahar loop)</td><td>dp[0] = 1</td></tr>
<tr><td>300</td><td>dp[i] = i pe khatam LIS</td><td>max(dp[j] + 1) jahan nums[j] &lt; nums[i]</td><td>dp[i] = 1</td></tr>
<tr><td>1143</td><td>dp[i][j] = prefixes ka LCS</td><td>match → diag + 1, warna max(upar, left)</td><td>row 0 / col 0 = 0</td></tr>
<tr><td>139</td><td>dp[i] = pehle i chars toot sakte?</td><td>koi j: dp[j] &amp;&amp; s[j..i) dict me</td><td>dp[0] = true</td></tr>
</tbody></table>`,
    },
    {
      h: 'Recursion tree — overlapping subproblems dekho',
      body: `<p>LC 70 Climbing Stairs, n = 5. Plain recursion <code>ways(n) = ways(n−1) + ways(n−2)</code> ka tree:</p>
<pre class="ex-pre diagram">                         ways(5)
                /                      \\
           ways(4)                     ways(3)
          /       \\                   /       \\
     ways(3)      ways(2)        ways(2)    ways(1)
     /     \\      /     \\       /     \\
 ways(2) ways(1) ways(1) ways(0) ways(1) ways(0)
  /   \\
ways(1) ways(0)

ways(3) → 2 baar     ways(2) → 3 baar     ways(1) → 5 baar
Total calls = 15  (n = 40 pe ~33 crore calls!)  → O(2^n)</pre>
<p><b>Memoization</b> ke baad: <code>ways(3)</code> pehli baar compute hua, <code>memo[3] = 3</code> likh diya. Doosri baar seedha memo se → tree ki poori branch kat gayi. Har state <b>ek baar</b> → O(n).</p>
<pre class="ex-pre diagram">ways(5) → ways(4) → ways(3) → ways(2) → ways(1) ✓, ways(0) ✓
                                 ↑ memo[2]=2
                     ways(1) ✓   memo[3]=3
           ways(2) = memo hit ✓  memo[4]=5
ways(3) = memo hit ✓             memo[5]=8   → sirf ~n calls</pre>`,
    },
    {
      h: 'Memoization (Top-down) vs Tabulation (Bottom-up)',
      body: `<table class="tbl"><thead><tr><th></th><th>Memoization (top-down)</th><th>Tabulation (bottom-up)</th></tr></thead><tbody>
<tr><td>Kaise</td><td>Recursion as-it-is + <code>memo[]</code> me answer save</td><td>Loop se chhote states pehle bharo, <code>dp[]</code> table</td></tr>
<tr><td>Order</td><td>Recursion khud order decide karta hai</td><td>Tumhe fill order sochna padta hai (dependencies pehle)</td></tr>
<tr><td>Kaun se states</td><td>Sirf jo zaroori hain (lazy)</td><td>Saare states</td></tr>
<tr><td>Stack</td><td>Recursion stack O(depth) — bade n pe StackOverflowError</td><td>Koi recursion nahi</td></tr>
<tr><td>Space optimize</td><td>Mushkil</td><td>Aasaan — sirf last 1–2 rows/values rakho</td></tr>
<tr><td>Kab use</td><td>Recurrence socha, jaldi likhna hai</td><td>Interview ka final answer, space-opt chahiye</td></tr>
</tbody></table>
<p><b>4-step recipe (har course question pe yahi):</b></p>
<ol>
<li><b>Brute recursion</b> — state + transition + base case se seedha recursive function.</li>
<li><b>Memo</b> — <code>memo[state]</code> array, function ke shuru me "already hai? return", end me "save karke return".</li>
<li><b>Tabulation</b> — recursion ko ulta karo: base case se loop chalao, <code>f(x)</code> ki jagah <code>dp[x]</code>.</li>
<li><b>Space-opt</b> — dekho <code>dp[i]</code> kin pichli values pe depend hai. Sirf 2 values → 2 variables. Sirf pichli row → 1D array.</li>
</ol>`,
    },
    {
      h: 'Java Cheat Sheet (DP)',
      code: `// 1D table
int[] dp = new int[n + 1];          // default 0
Arrays.fill(dp, amount + 1);        // "infinity" (MAX_VALUE + 1 overflow se bachne ke liye)
boolean[] ok = new boolean[n + 1];  // default false

// 2D table
int[][] dp2 = new int[m + 1][n + 1];
for (int[] row : dp2) Arrays.fill(row, -1);   // memo: -1 = abhi compute nahi hua

// Memo with null = "not computed"
Boolean[] memo = new Boolean[n];    // null / true / false
Integer[] memo2 = new Integer[n];

// Memo template
private int f(int i, int[] memo) {
    if (i <= 1) return 1;                 // base case
    if (memo[i] != -1) return memo[i];    // already solved
    memo[i] = f(i - 1, memo) + f(i - 2, memo);  // transition
    return memo[i];
}

// Space-opt rolling variables
int prev2 = 1, prev1 = 1;
for (int i = 2; i <= n; i++) {
    int cur = prev1 + prev2;
    prev2 = prev1;
    prev1 = cur;
}

// Strings
char c = s.charAt(i);
String part = s.substring(j, i);   // [j, i)  — i exclusive
Set<String> dict = new HashSet<>(wordDict);`,
    },
    {
      h: 'Yaad rakhne wali baatein',
      body: `<ul>
<li><b>dp[i] ka matlab pehle likho</b> — 80% DP bugs galat/unclear state se aate hain.</li>
<li>Size <code>n + 1</code> rakho jab "pehle i elements" wali state ho — <code>dp[0]</code> = empty case.</li>
<li><b>"Infinity" ke liye <code>Integer.MAX_VALUE</code> mat use karo</b> agar usme +1 karna hai → overflow negative. <code>amount + 1</code> jaisa safe bada number lo.</li>
<li>Memo default value dhyan se: agar 0 valid answer ho sakta hai toh <code>-1</code> se fill karo (ya <code>Integer[]</code> / <code>Boolean[]</code> null).</li>
<li><b>Unbounded knapsack</b> (coin dobara le sakte): amount loop <b>left → right</b>. 0/1 knapsack (ek baar) me right → left.</li>
<li><b>Combinations vs permutations</b> (LC 518): coin loop bahar → combinations (order matter nahi). Amount loop bahar → permutations (1+2 aur 2+1 alag).</li>
<li>Subsequence ≠ subarray: subsequence me order same, continuous zaroori nahi (LIS, LCS).</li>
<li>Complexity = <b>(states ki ginti) × (har state ka kaam)</b>. LC 322: amount × coins. LC 1143: m × n × O(1).</li>
</ul>`,
    },
  ],

  // ---------------- OPERATIONS ----------------
  operations: [
    { op: 'State define karo', time: '—', note: 'dp[i] ka English/Hinglish meaning ek line me (code se pehle)', code: '// dp[i] = step i tak pahunchne ke tarike\nint[] dp = new int[n + 1];' },
    { op: 'Base case set karo', time: 'O(1)', note: 'Sabse chhota state — loop isi se start hoga', code: 'dp[0] = 1;\ndp[1] = 1;' },
    { op: 'Table fill (1D)', time: 'O(n × kaam)', note: 'Chhote index se bade — dependencies pehle ban jaayein', code: 'for (int i = 2; i <= n; i++) {\n    dp[i] = dp[i - 1] + dp[i - 2];\n}' },
    { op: 'Table fill (2D)', time: 'O(m × n)', note: 'Row by row; dp[i][j] upar, left, diagonal se banta hai', code: 'for (int i = 1; i <= m; i++)\n    for (int j = 1; j <= n; j++)\n        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);' },
    { op: 'Memo lookup', time: 'O(1)', note: 'Recursion ke shuru me — already solved? toh dobara mat karo', code: 'if (memo[i] != -1) return memo[i];' },
    { op: 'Memo save', time: 'O(1)', note: 'Answer return karne se pehle store', code: 'memo[i] = f(i - 1) + f(i - 2);\nreturn memo[i];' },
    { op: '"Infinity" init', time: 'O(n)', note: 'Min wale DP me — impossible states ko bada number do', code: 'Arrays.fill(dp, amount + 1);\ndp[0] = 0;' },
    { op: 'Rolling variables', time: 'O(1) space', note: 'dp[i] sirf pichle 2 pe depend → array ki jagah 2 variables', code: 'int cur = prev1 + prev2;\nprev2 = prev1;\nprev1 = cur;' },
    { op: 'Two-row 2D → 1D', time: 'O(n) space', note: 'dp[i][*] sirf dp[i−1][*] pe depend → prev[] + cur[]', code: 'int[] prev = new int[n + 1], cur = new int[n + 1];\n// row fill...\nint[] t = prev; prev = cur; cur = t;' },
    { op: 'Answer padho', time: 'O(1)', note: 'Kabhi dp[n], kabhi max(dp[]) (LIS), kabhi impossible check', code: 'return dp[amount] > amount ? -1 : dp[amount];' },
  ],

  // ---------------- PATTERNS ----------------
  patterns: [
    {
      name: 'Fibonacci-style 1D DP',
      signal: '"Kitne tarike", "min cost to reach", step 1 ya 2 jump, answer pichle 1–2 states se',
      idea: 'dp[i] = f(dp[i−1], dp[i−2]). Last step kya tha socho. Space-opt: 2 variables.',
      code: `int prev2 = 1, prev1 = 1;
for (int i = 2; i <= n; i++) {
    int cur = prev1 + prev2;   // 746: min(...), 198: max(...)
    prev2 = prev1;
    prev1 = cur;
}
return prev1;`,
      qs: [70, 746],
    },
    {
      name: 'Take / Skip (pick or not pick)',
      signal: '"Adjacent nahi le sakte", "element lu ya chhodu", subsequence choose karna',
      idea: 'Har element pe 2 choice: lo (aur uska rule follow karo) ya chhodo. dp = max/min/sum of dono.',
      code: `// House Robber
int skip = dp[i - 1];
int take = dp[i - 2] + nums[i - 1];
dp[i] = Math.max(skip, take);`,
      qs: [198, 300],
    },
    {
      name: 'Unbounded Knapsack (coins)',
      signal: '"Coins infinite", "amount banao", min coins / number of ways',
      idea: 'dp[a] amount pe. Min coins: dp[a] = min(dp[a−c] + 1). Ways: dp[a] += dp[a−c] with coin loop BAHAR (combinations). Amount loop left → right kyunki same coin dobara le sakte hain.',
      code: `// min coins (322)
Arrays.fill(dp, amount + 1); dp[0] = 0;
for (int a = 1; a <= amount; a++)
    for (int c : coins)
        if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);

// ways / combinations (518)
dp[0] = 1;
for (int c : coins)
    for (int a = c; a <= amount; a++)
        dp[a] += dp[a - c];`,
      qs: [322, 518],
    },
    {
      name: 'LIS — "ending at i" DP',
      signal: '"Longest increasing subsequence", chain jahan pichla element chhota ho',
      idea: 'dp[i] = i pe khatam hone wali LIS. Har j < i check karo — O(n²). Follow-up: tails[] + binary search → O(n log n).',
      code: `for (int i = 0; i < n; i++) {
    dp[i] = 1;
    for (int j = 0; j < i; j++)
        if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
}`,
      qs: [300],
    },
    {
      name: '2D String DP (LCS grid)',
      signal: 'Do strings, "common subsequence", edit / match characters',
      idea: 'dp[i][j] = text1 ke pehle i aur text2 ke pehle j chars. Match → diagonal + 1. Mismatch → max(upar, left). Row 0 / col 0 = empty string = 0.',
      code: `if (a.charAt(i - 1) == b.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;
else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);`,
      qs: [1143],
    },
    {
      name: 'String Partition DP (prefix breakable?)',
      signal: '"String ko words me tod sakte?", dictionary, segmentation',
      idea: 'dp[i] = pehle i chars valid tootte hain? dp[i] = true agar koi j ho jahan dp[j] true aur s[j..i) dictionary me. Backtracking (LC 131 jaisa) exponential hai, DP O(n²).',
      code: `dp[0] = true;
for (int i = 1; i <= n; i++)
    for (int j = 0; j < i; j++)
        if (dp[j] && dict.contains(s.substring(j, i))) { dp[i] = true; break; }`,
      qs: [139],
    },
  ],

  // ---------------- QUESTIONS ----------------
  questions: {
    70: {
      oneLine: 'dp[i] = dp[i−1] + dp[i−2] (last step 1 tha ya 2) — Fibonacci; space-opt me 2 variables.',
      pattern: 'Fibonacci-style 1D DP',
      approaches: [
        {
          level: 'Brute', idea: 'Recursion: step n pe aakhri jump 1 ka tha ya 2 ka → ways(n) = ways(n−1) + ways(n−2). Same subproblems baar-baar → exponential.',
          time: 'O(2^n)', space: 'O(n) stack',
          code: `public int climbStairs(int n) {
    if (n <= 1) return 1;
    return climbStairs(n - 1) + climbStairs(n - 2);
}`,
        },
        {
          level: 'Better', idea: 'Memoization (top-down): same recursion, lekin memo[n] me answer save. Har n sirf ek baar compute.',
          time: 'O(n)', space: 'O(n) memo + O(n) stack',
          code: `public int climbStairs(int n) {
    int[] memo = new int[n + 1];
    return ways(n, memo);
}

private int ways(int n, int[] memo) {
    if (n <= 1) return 1;
    if (memo[n] != 0) return memo[n];
    memo[n] = ways(n - 1, memo) + ways(n - 2, memo);
    return memo[n];
}`,
        },
        {
          level: 'Optimal', idea: 'Tabulation (bottom-up): dp[0] = dp[1] = 1 se shuru karke loop me dp[i] = dp[i−1] + dp[i−2]. Koi recursion nahi.',
          time: 'O(n)', space: 'O(n)',
          code: `public int climbStairs(int n) {
    int[] dp = new int[n + 1]; // dp[i] = step i tak pahunchne ke tarike
    dp[0] = 1;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,
        },
        {
          level: 'Optimal', idea: 'Space optimization: dp[i] sirf pichle 2 values pe depend → array ki jagah prev1, prev2.',
          time: 'O(n)', space: 'O(1)',
          code: `public int climbStairs(int n) {
    int prev2 = 1, prev1 = 1; // dp[i-2], dp[i-1]
    for (int i = 2; i <= n; i++) {
        int cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
        },
      ],
      dryRun: 'n = 5 → dp = [1, 1, 2, 3, 5, 8] → answer 8',
      interview: 'To reach step n, the last move was either one step from n−1 or two steps from n−2, so ways(n) = ways(n−1) + ways(n−2) with ways(0) = ways(1) = 1. Plain recursion is O(2^n) because subproblems repeat; memoization or a bottom-up table makes it O(n), and since each value depends only on the previous two, two variables give O(1) space.',
      problem: {
        statement: 'Tum ek seedhi (staircase) ke neeche khade ho jisme <b>n</b> steps hain. Ek baar me <b>1 ya 2</b> step chadh sakte ho. Top tak pahunchne ke kitne <b>alag tarike</b> hain? Count return karo.',
        examples: [
          { input: 'n = 2', output: '2', explain: '2 tarike: (1 + 1) aur (2).', viz: { n: '2' } },
          { input: 'n = 3', output: '3', explain: '3 tarike: (1+1+1), (1+2), (2+1).', viz: { n: '3' } },
          { input: 'n = 5', output: '8', explain: 'dp = 1, 1, 2, 3, 5, 8 → ways(5) = ways(4) + ways(3) = 5 + 3 = 8.', viz: { n: '5' } },
        ],
        constraints: ['1 ≤ n ≤ 45'],
      },
    },

    746: {
      oneLine: 'dp[i] = step i tak min cost = min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2]); top = index n.',
      pattern: 'Fibonacci-style 1D DP (min)',
      approaches: [
        {
          level: 'Brute', idea: 'Recursion: step i (top = n) pe ya toh i−1 se aaye (cost[i−1] diya) ya i−2 se (cost[i−2] diya). Step 0 ya 1 se free start.',
          time: 'O(2^n)', space: 'O(n) stack',
          code: `public int minCostClimbingStairs(int[] cost) {
    return reach(cost, cost.length);
}

private int reach(int[] cost, int i) {
    if (i <= 1) return 0;
    return Math.min(reach(cost, i - 1) + cost[i - 1], reach(cost, i - 2) + cost[i - 2]);
}`,
        },
        {
          level: 'Better', idea: 'Memoization: memo[i] = reach(i). -1 se fill kyunki 0 valid answer hai.',
          time: 'O(n)', space: 'O(n)',
          code: `public int minCostClimbingStairs(int[] cost) {
    int[] memo = new int[cost.length + 1];
    Arrays.fill(memo, -1);
    return reach(cost, cost.length, memo);
}

private int reach(int[] cost, int i, int[] memo) {
    if (i <= 1) return 0;
    if (memo[i] != -1) return memo[i];
    memo[i] = Math.min(reach(cost, i - 1, memo) + cost[i - 1],
                       reach(cost, i - 2, memo) + cost[i - 2]);
    return memo[i];
}`,
        },
        {
          level: 'Optimal', idea: 'Tabulation: dp[0] = dp[1] = 0 (free start), i = 2..n tak min of do raaste. Answer dp[n] (top).',
          time: 'O(n)', space: 'O(n)',
          code: `public int minCostClimbingStairs(int[] cost) {
    int n = cost.length;
    int[] dp = new int[n + 1]; // dp[i] = step i tak pahunchne ka min cost
    dp[0] = 0;
    dp[1] = 0;
    for (int i = 2; i <= n; i++) {
        dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
    }
    return dp[n];
}`,
        },
        {
          level: 'Optimal', idea: 'Space optimization: sirf pichle 2 dp values chahiye → prev1, prev2.',
          time: 'O(n)', space: 'O(1)',
          code: `public int minCostClimbingStairs(int[] cost) {
    int prev2 = 0, prev1 = 0; // dp[i-2], dp[i-1]
    for (int i = 2; i <= cost.length; i++) {
        int cur = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
        },
      ],
      dryRun: 'cost = [10,15,20] → dp[0]=0, dp[1]=0, dp[2]=min(0+15, 0+10)=10, dp[3]=min(10+20, 0+15)=15 → 15',
      interview: 'Let dp[i] be the minimum cost to stand on step i, where the top is index n. I can start on step 0 or 1 for free, so dp[0] = dp[1] = 0, and to arrive at i I either paid cost[i−1] from i−1 or cost[i−2] from i−2: dp[i] = min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2]). That is O(n) time, and keeping only the last two values gives O(1) space.',
      problem: {
        statement: 'Array <b>cost</b> diya hai jahan <code>cost[i]</code> = step i pe khade hone (aur aage badhne) ki keemat. Pay karke tum <b>1 ya 2</b> step aage ja sakte ho. Shuru <b>index 0 ya 1</b> se kar sakte ho (free). <b>Top</b> (array ke bahar, index n) tak pahunchne ka <b>minimum cost</b> return karo.',
        examples: [
          { input: 'cost = [10,15,20]', output: '15', explain: 'Index 1 se start, 15 pay karke 2 step → top. Total 15.', viz: { cost: '10, 15, 20' } },
          { input: 'cost = [1,100,1,1,1,100,1,1,100,1]', output: '6', explain: 'Index 0 se start, saare 1 wale steps pe chalo (0→2→4→6→7→9→top), 100 wale skip. Total 6.', viz: { cost: '1, 100, 1, 1, 1, 100, 1, 1, 100, 1' } },
        ],
        constraints: ['2 ≤ cost.length ≤ 1000', '0 ≤ cost[i] ≤ 999'],
      },
    },

    198: {
      oneLine: 'dp[i] = max(dp[i−1] (ghar chhoda), dp[i−2] + nums[i−1] (ghar loota)) — take/skip.',
      pattern: 'Take / Skip 1D DP',
      approaches: [
        {
          level: 'Brute', idea: 'Recursion: ghar i pe do choice — skip (best(i−1)) ya loot (best(i−2) + nums[i]). Exponential.',
          time: 'O(2^n)', space: 'O(n) stack',
          code: `public int rob(int[] nums) {
    return best(nums, nums.length - 1);
}

private int best(int[] nums, int i) {
    if (i < 0) return 0;
    return Math.max(best(nums, i - 1), best(nums, i - 2) + nums[i]);
}`,
        },
        {
          level: 'Better', idea: 'Memoization: memo[i] = ghar 0..i se max. -1 = abhi compute nahi hua.',
          time: 'O(n)', space: 'O(n)',
          code: `public int rob(int[] nums) {
    int[] memo = new int[nums.length];
    Arrays.fill(memo, -1);
    return best(nums, nums.length - 1, memo);
}

private int best(int[] nums, int i, int[] memo) {
    if (i < 0) return 0;
    if (memo[i] != -1) return memo[i];
    int skip = best(nums, i - 1, memo);
    int take = best(nums, i - 2, memo) + nums[i];
    memo[i] = Math.max(skip, take);
    return memo[i];
}`,
        },
        {
          level: 'Optimal', idea: 'Tabulation: dp[i] = pehle i ghar se max. dp[0] = 0 (koi ghar nahi), dp[1] = nums[0].',
          time: 'O(n)', space: 'O(n)',
          code: `public int rob(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n + 1]; // dp[i] = pehle i ghar se max paisa
    dp[0] = 0;
    dp[1] = nums[0];
    for (int i = 2; i <= n; i++) {
        int skip = dp[i - 1];
        int take = dp[i - 2] + nums[i - 1];
        dp[i] = Math.max(skip, take);
    }
    return dp[n];
}`,
        },
        {
          level: 'Optimal', idea: 'Space optimization: prev1 = dp[i−1], prev2 = dp[i−2]. Har ghar x pe cur = max(prev1, prev2 + x).',
          time: 'O(n)', space: 'O(1)',
          code: `public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0; // dp[i-2], dp[i-1]
    for (int x : nums) {
        int cur = Math.max(prev1, prev2 + x);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
        },
      ],
      dryRun: '[2,7,9,3,1] → dp = [0, 2, 7, 11, 11, 12] → 12 (2 + 9 + 1)',
      interview: 'For each house I either skip it, keeping the best from the previous houses, or rob it, adding its money to the best from two houses back. So dp[i] = max(dp[i−1], dp[i−2] + nums[i−1]) with dp[0] = 0 and dp[1] = nums[0]. It is O(n) time, and because only the last two values matter I can use two variables for O(1) space.',
      problem: {
        statement: 'Ek line me ghar hain, <code>nums[i]</code> = ghar i me paisa. <b>Do adjacent (paas-paas wale) ghar</b> ek raat me loote toh alarm baj jaayega. Bina alarm bajaye <b>maximum kitna paisa</b> loot sakte ho?',
        examples: [
          { input: 'nums = [1,2,3,1]', output: '4', explain: 'Ghar 0 (1) aur ghar 2 (3) looto → 1 + 3 = 4.', viz: { nums: '1, 2, 3, 1' } },
          { input: 'nums = [2,7,9,3,1]', output: '12', explain: 'Ghar 0, 2, 4 → 2 + 9 + 1 = 12.', viz: { nums: '2, 7, 9, 3, 1' } },
          { input: 'nums = [2,1,1,2]', output: '4', explain: 'Ghar 0 aur 3 → 2 + 2 = 4 (sirf alternate lena zaroori nahi!).', viz: { nums: '2, 1, 1, 2' } },
        ],
        constraints: ['1 ≤ nums.length ≤ 100', '0 ≤ nums[i] ≤ 400'],
      },
    },

    322: {
      oneLine: 'Unbounded knapsack (min): dp[a] = min(dp[a−c] + 1) har coin c ≤ a; ∞ = amount+1; ∞ bacha toh −1.',
      pattern: 'Unbounded Knapsack (min coins)',
      approaches: [
        {
          level: 'Brute', idea: 'Recursion: amount rem ke liye har coin try karo, minCoins(rem − c) + 1 ka minimum. rem < 0 = impossible (MAX_VALUE).',
          time: 'O(coins^amount)', space: 'O(amount) stack',
          code: `public int coinChange(int[] coins, int amount) {
    int res = minCoins(coins, amount);
    return res == Integer.MAX_VALUE ? -1 : res;
}

private int minCoins(int[] coins, int rem) {
    if (rem == 0) return 0;
    if (rem < 0) return Integer.MAX_VALUE;
    int best = Integer.MAX_VALUE;
    for (int c : coins) {
        int sub = minCoins(coins, rem - c);
        if (sub != Integer.MAX_VALUE) best = Math.min(best, sub + 1);
    }
    return best;
}`,
        },
        {
          level: 'Better', idea: 'Memoization: memo[rem] me answer (-1 = impossible). -2 = abhi compute nahi hua.',
          time: 'O(amount × coins)', space: 'O(amount)',
          code: `public int coinChange(int[] coins, int amount) {
    int[] memo = new int[amount + 1];
    Arrays.fill(memo, -2); // -2 = abhi compute nahi hua
    return minCoins(coins, amount, memo);
}

private int minCoins(int[] coins, int rem, int[] memo) {
    if (rem == 0) return 0;
    if (memo[rem] != -2) return memo[rem];
    int best = Integer.MAX_VALUE;
    for (int c : coins) {
        if (c > rem) continue;
        int sub = minCoins(coins, rem - c, memo);
        if (sub != -1) best = Math.min(best, sub + 1);
    }
    memo[rem] = (best == Integer.MAX_VALUE) ? -1 : best;
    return memo[rem];
}`,
        },
        {
          level: 'Optimal', idea: 'Tabulation: dp[0] = 0, baaki "infinity" (amount + 1). Har amount a = 1..amount pe har coin se dp[a] = min(dp[a], dp[a−c] + 1). Greedy (bada coin pehle) galat ho sakta hai — DP sab try karta hai.',
          time: 'O(amount × coins)', space: 'O(amount)',
          code: `public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1]; // dp[a] = amount a ke liye min coins
    Arrays.fill(dp, amount + 1);    // amount + 1 = "infinity" (possible nahi)
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        for (int c : coins) {
            if (c <= a) {
                dp[a] = Math.min(dp[a], dp[a - c] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
        },
      ],
      dryRun: 'coins [1,2,5], amount 11 → dp = [0,1,1,2,2,1,2,2,3,3,2,3] → 3 (5+5+1)',
      interview: 'This is an unbounded knapsack. dp[a] is the fewest coins to make amount a, with dp[0] = 0 and everything else initialised to amount + 1 as infinity. For each amount I try every coin: dp[a] = min(dp[a], dp[a − c] + 1). If dp[amount] is still above amount it is impossible and I return −1. Greedy fails for coins like [1,3,4] and amount 6, which is why DP is needed. Time O(amount × coins), space O(amount).',
      problem: {
        statement: 'Alag-alag value ke <b>coins</b> diye hain (har coin <b>unlimited</b> baar use kar sakte ho) aur ek <b>amount</b>. Amount banane ke liye <b>kam se kam kitne coins</b> chahiye? Agar amount ban hi nahi sakta toh <code>-1</code> return karo.',
        examples: [
          { input: 'coins = [1,2,5], amount = 11', output: '3', explain: '11 = 5 + 5 + 1 → 3 coins.', viz: { coins: '1, 2, 5', amount: '11' } },
          { input: 'coins = [2], amount = 3', output: '-1', explain: 'Sirf 2 wale coin se odd amount 3 nahi banta.', viz: { coins: '2', amount: '3' } },
          { input: 'coins = [1], amount = 0', output: '0', explain: 'Amount 0 ke liye koi coin nahi chahiye.', viz: { coins: '1', amount: '0' } },
        ],
        constraints: ['1 ≤ coins.length ≤ 12', '1 ≤ coins[i] ≤ 2³¹ − 1', '0 ≤ amount ≤ 10⁴'],
      },
    },

    300: {
      oneLine: 'dp[i] = i pe khatam LIS = 1 + max dp[j] (j < i, nums[j] < nums[i]); answer max(dp). Follow-up: tails + binary search O(n log n).',
      pattern: 'LIS ("ending at i") + Binary Search',
      approaches: [
        {
          level: 'Brute', idea: 'Recursion (take / skip): index i aur pichla liya hua index prev. nums[i] > nums[prev] ho toh le sakte ho. Har element 2 choice → O(2^n).',
          time: 'O(2^n)', space: 'O(n) stack',
          code: `public int lengthOfLIS(int[] nums) {
    return lis(nums, 0, -1);
}

private int lis(int[] nums, int i, int prev) {
    if (i == nums.length) return 0;
    int skip = lis(nums, i + 1, prev);
    int take = 0;
    if (prev == -1 || nums[i] > nums[prev]) take = 1 + lis(nums, i + 1, i);
    return Math.max(skip, take);
}`,
        },
        {
          level: 'Better', idea: 'Memoization: state (i, prev) → memo[i][prev + 1] (prev = −1 ko index 0 pe shift).',
          time: 'O(n²)', space: 'O(n²)',
          code: `public int lengthOfLIS(int[] nums) {
    int n = nums.length;
    int[][] memo = new int[n][n + 1];
    for (int[] row : memo) Arrays.fill(row, -1);
    return lis(nums, 0, -1, memo);
}

private int lis(int[] nums, int i, int prev, int[][] memo) {
    if (i == nums.length) return 0;
    if (memo[i][prev + 1] != -1) return memo[i][prev + 1];
    int skip = lis(nums, i + 1, prev, memo);
    int take = 0;
    if (prev == -1 || nums[i] > nums[prev]) take = 1 + lis(nums, i + 1, i, memo);
    memo[i][prev + 1] = Math.max(skip, take);
    return memo[i][prev + 1];
}`,
        },
        {
          level: 'Better', idea: 'Tabulation O(n²): dp[i] = index i pe KHATAM hone wali LIS. Har j < i jahan nums[j] < nums[i] → dp[i] = max(dp[i], dp[j] + 1). Answer = max of saare dp[i] (dp[n−1] nahi!).',
          time: 'O(n²)', space: 'O(n)',
          code: `public int lengthOfLIS(int[] nums) {
    int n = nums.length, best = 1;
    int[] dp = new int[n]; // dp[i] = index i pe khatam hone wali LIS ki length
    for (int i = 0; i < n; i++) {
        dp[i] = 1;
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        best = Math.max(best, dp[i]);
    }
    return best;
}`,
        },
        {
          level: 'Optimal', idea: 'Patience sorting: tails[k] = length k+1 wale increasing subsequence ka sabse chhota possible last element. Har x ke liye lower bound (pehla tails ≥ x) dhundo aur replace karo; end me mila toh size++. tails sorted rehta hai → binary search.',
          time: 'O(n log n)', space: 'O(n)',
          code: `public int lengthOfLIS(int[] nums) {
    int[] tails = new int[nums.length]; // tails[k] = length k+1 wali IS ka sabse chhota last element
    int size = 0;
    for (int x : nums) {
        int lo = 0, hi = size;
        while (lo < hi) {               // lower bound: pehla tails[mid] >= x
            int mid = (lo + hi) / 2;
            if (tails[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        tails[lo] = x;
        if (lo == size) size++;
    }
    return size;
}`,
        },
      ],
      dryRun: '[10,9,2,5,3,7,101,18] → dp = [1,1,1,2,2,3,4,4] → 4 (2,3,7,101). tails: [2,3,7,18]',
      interview: 'Let dp[i] be the length of the longest increasing subsequence ending at index i. Each dp[i] starts at 1 and extends any earlier dp[j] with nums[j] < nums[i], and the answer is the maximum dp value — O(n²). The follow-up is O(n log n): I keep tails, where tails[k] is the smallest possible tail of an increasing subsequence of length k+1. tails stays sorted, so for each number I binary-search the first tail ≥ x and replace it, growing the size when x is larger than all tails.',
      problem: {
        statement: 'Integer array <b>nums</b> diya hai. Sabse lambi <b>strictly increasing subsequence</b> ki <b>length</b> return karo. (Subsequence = kuch elements hata do, baaki ka order same — continuous hona zaroori nahi.)',
        examples: [
          { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explain: 'Ek LIS hai [2,3,7,101] (ya [2,5,7,18]) → length 4.', viz: { nums: '10, 9, 2, 5, 3, 7, 101, 18' } },
          { input: 'nums = [0,1,0,3,2,3]', output: '4', explain: '[0,1,2,3] → length 4.', viz: { nums: '0, 1, 0, 3, 2, 3' } },
          { input: 'nums = [7,7,7,7,7,7,7]', output: '1', explain: 'Strictly increasing chahiye — barabar values nahi chalengi → 1.', viz: { nums: '7, 7, 7, 7, 7, 7, 7' } },
        ],
        constraints: ['1 ≤ nums.length ≤ 2500', '−10⁴ ≤ nums[i] ≤ 10⁴', 'Follow-up: O(n log n) me karo'],
      },
    },

    1143: {
      oneLine: '2D grid: chars match → dp[i−1][j−1] + 1, warna max(dp[i−1][j], dp[i][j−1]); answer dp[m][n].',
      pattern: '2D String DP (LCS)',
      approaches: [
        {
          level: 'Brute', idea: 'Recursion (i, j): chars match → dono aage + 1. Mismatch → ek string me aage badho, dono try karke max. O(2^(m+n)).',
          time: 'O(2^(m+n))', space: 'O(m + n) stack',
          code: `public int longestCommonSubsequence(String text1, String text2) {
    return lcs(text1, text2, 0, 0);
}

private int lcs(String a, String b, int i, int j) {
    if (i == a.length() || j == b.length()) return 0;
    if (a.charAt(i) == b.charAt(j)) return 1 + lcs(a, b, i + 1, j + 1);
    return Math.max(lcs(a, b, i + 1, j), lcs(a, b, i, j + 1));
}`,
        },
        {
          level: 'Better', idea: 'Memoization: sirf m × n alag states (i, j) → memo[i][j], -1 se fill.',
          time: 'O(m × n)', space: 'O(m × n)',
          code: `public int longestCommonSubsequence(String text1, String text2) {
    int[][] memo = new int[text1.length()][text2.length()];
    for (int[] row : memo) Arrays.fill(row, -1);
    return lcs(text1, text2, 0, 0, memo);
}

private int lcs(String a, String b, int i, int j, int[][] memo) {
    if (i == a.length() || j == b.length()) return 0;
    if (memo[i][j] != -1) return memo[i][j];
    if (a.charAt(i) == b.charAt(j)) memo[i][j] = 1 + lcs(a, b, i + 1, j + 1, memo);
    else memo[i][j] = Math.max(lcs(a, b, i + 1, j, memo), lcs(a, b, i, j + 1, memo));
    return memo[i][j];
}`,
        },
        {
          level: 'Optimal', idea: 'Tabulation: dp[i][j] = text1 ke pehle i aur text2 ke pehle j chars ka LCS. Row 0 / col 0 = empty = 0. Match → diagonal + 1, warna max(upar, left).',
          time: 'O(m × n)', space: 'O(m × n)',
          code: `public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1]; // dp[i][j] = pehle i aur pehle j chars ka LCS
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}`,
        },
        {
          level: 'Optimal', idea: 'Space optimization: row i sirf row i−1 pe depend → prev[] aur cur[] do 1D arrays, har row ke baad swap.',
          time: 'O(m × n)', space: 'O(n)',
          code: `public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[] prev = new int[n + 1], cur = new int[n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) cur[j] = prev[j - 1] + 1;
            else cur[j] = Math.max(prev[j], cur[j - 1]);
        }
        int[] tmp = prev; prev = cur; cur = tmp;
    }
    return prev[n];
}`,
        },
      ],
      dryRun: '"abcde" vs "ace" → last row [0,1,2,3] → dp[5][3] = 3 ("ace")',
      interview: 'I define dp[i][j] as the LCS length of the first i characters of text1 and the first j of text2, with row and column zero as empty strings. If the current characters match, dp[i][j] = dp[i−1][j−1] + 1; otherwise I drop one character from either string and take max(dp[i−1][j], dp[i][j−1]). That is O(m·n) time and space, and since each row only needs the previous row, two 1D arrays bring space down to O(n).',
      problem: {
        statement: 'Do strings <b>text1</b> aur <b>text2</b> di hain. Unki <b>longest common subsequence</b> ki length return karo (koi common nahi toh 0). Subsequence = kuch characters hata ke, baaki ka order same rakh ke bani string. Jaise "ace" string "abcde" ki subsequence hai.',
        examples: [
          { input: 'text1 = "abcde", text2 = "ace"', output: '3', explain: 'LCS "ace" hai → length 3.', viz: { text1: 'abcde', text2: 'ace' } },
          { input: 'text1 = "abc", text2 = "abc"', output: '3', explain: 'Dono same → poori string "abc" common.', viz: { text1: 'abc', text2: 'abc' } },
          { input: 'text1 = "abc", text2 = "def"', output: '0', explain: 'Koi common character nahi.', viz: { text1: 'abc', text2: 'def' } },
        ],
        constraints: ['1 ≤ text1.length, text2.length ≤ 1000', 'Sirf lowercase English letters'],
      },
    },

    518: {
      oneLine: 'Unbounded knapsack (count): dp[0] = 1; coin loop BAHAR, amount loop andar: dp[a] += dp[a−c] → combinations.',
      pattern: 'Unbounded Knapsack (number of ways)',
      approaches: [
        {
          level: 'Brute', idea: 'Recursion (i, rem): coin i lo (same i pe raho, dobara le sakte) ya coin i chhodo (i + 1). Is order se har combination ek hi baar gina jaata hai.',
          time: 'O(2^(amount))', space: 'O(amount) stack',
          code: `public int change(int amount, int[] coins) {
    return ways(coins, 0, amount);
}

private int ways(int[] coins, int i, int rem) {
    if (rem == 0) return 1;
    if (i == coins.length || rem < 0) return 0;
    return ways(coins, i, rem - coins[i]) + ways(coins, i + 1, rem);
}`,
        },
        {
          level: 'Better', idea: 'Memoization: states (i, rem) → memo[i][rem], -1 se fill.',
          time: 'O(n × amount)', space: 'O(n × amount)',
          code: `public int change(int amount, int[] coins) {
    int[][] memo = new int[coins.length][amount + 1];
    for (int[] row : memo) Arrays.fill(row, -1);
    return ways(coins, 0, amount, memo);
}

private int ways(int[] coins, int i, int rem, int[][] memo) {
    if (rem == 0) return 1;
    if (i == coins.length || rem < 0) return 0;
    if (memo[i][rem] != -1) return memo[i][rem];
    memo[i][rem] = ways(coins, i, rem - coins[i], memo) + ways(coins, i + 1, rem, memo);
    return memo[i][rem];
}`,
        },
        {
          level: 'Optimal', idea: '2D tabulation: dp[i][a] = pehle i coins se amount a ke tarike = dp[i−1][a] (coin nahi liya) + dp[i][a − coin] (liya, same row → dobara bhi le sakte).',
          time: 'O(n × amount)', space: 'O(n × amount)',
          code: `public int change(int amount, int[] coins) {
    int n = coins.length;
    int[][] dp = new int[n + 1][amount + 1]; // dp[i][a] = pehle i coins se amount a ke tarike
    for (int i = 0; i <= n; i++) dp[i][0] = 1;
    for (int i = 1; i <= n; i++) {
        for (int a = 1; a <= amount; a++) {
            dp[i][a] = dp[i - 1][a];                                       // coin i-1 nahi liya
            if (coins[i - 1] <= a) dp[i][a] += dp[i][a - coins[i - 1]];   // liya (dobara bhi)
        }
    }
    return dp[n][amount];
}`,
        },
        {
          level: 'Optimal', idea: '1D: 2D ki har row sirf upar wali row + apni left value use karti hai → ek hi array me overwrite. Coin loop bahar = combinations (1+2 aur 2+1 ek hi gine).',
          time: 'O(n × amount)', space: 'O(amount)',
          code: `public int change(int amount, int[] coins) {
    int[] dp = new int[amount + 1]; // dp[a] = amount a banane ke tarike
    dp[0] = 1;                      // amount 0: kuch mat lo = 1 tarika
    for (int c : coins) {           // coin bahar → combinations (order matter nahi)
        for (int a = c; a <= amount; a++) {
            dp[a] += dp[a - c];
        }
    }
    return dp[amount];
}`,
        },
      ],
      dryRun: 'amount 5, [1,2,5] → coin 1: [1,1,1,1,1,1], coin 2: [1,1,2,2,3,3], coin 5: [1,1,2,2,3,4] → 4',
      interview: 'This is an unbounded knapsack counting combinations. dp[a] is the number of ways to make amount a, with dp[0] = 1. I loop over coins in the outer loop and amounts upward in the inner loop, adding dp[a − c]. Putting coins outside means each combination is counted once in a fixed coin order; swapping the loops would count permutations like 1+2 and 2+1 separately. Ascending amounts allow reusing the same coin. O(n × amount) time and O(amount) space.',
      problem: {
        statement: 'Alag value ke <b>coins</b> (har ek <b>unlimited</b>) aur ek <b>amount</b> diya hai. Amount banane ke kitne <b>alag combinations</b> hain? (Order matter nahi karta: 1+2 aur 2+1 ek hi combination.) Ban hi na sake toh 0. Answer 32-bit int me fit hota hai.',
        examples: [
          { input: 'amount = 5, coins = [1,2,5]', output: '4', explain: '5 = 5, 2+2+1, 2+1+1+1, 1+1+1+1+1 → 4 tarike.', viz: { amount: '5', coins: '1, 2, 5' } },
          { input: 'amount = 3, coins = [2]', output: '0', explain: 'Sirf 2 se 3 nahi banta.', viz: { amount: '3', coins: '2' } },
          { input: 'amount = 10, coins = [10]', output: '1', explain: 'Ek hi tarika: 10.', viz: { amount: '10', coins: '10' } },
        ],
        constraints: ['1 ≤ coins.length ≤ 300', '1 ≤ coins[i] ≤ 5000', 'Saare coins distinct', '0 ≤ amount ≤ 5000'],
      },
    },

    139: {
      oneLine: 'dp[i] = pehle i chars toot sakte? dp[0] = true; dp[i] = koi j jahan dp[j] && dict me s[j..i).',
      pattern: 'String Partition DP',
      approaches: [
        {
          level: 'Brute', idea: 'Recursion: start se har possible prefix word try karo; word dict me ho aur baaki string bhi toote → true. Same suffix baar-baar → exponential.',
          time: 'O(2^n)', space: 'O(n) stack',
          code: `public boolean wordBreak(String s, List<String> wordDict) {
    return canBreak(s, 0, new HashSet<>(wordDict));
}

private boolean canBreak(String s, int start, Set<String> dict) {
    if (start == s.length()) return true;
    for (int end = start + 1; end <= s.length(); end++) {
        if (dict.contains(s.substring(start, end)) && canBreak(s, end, dict)) return true;
    }
    return false;
}`,
        },
        {
          level: 'Better', idea: 'Memoization: answer sirf start index pe depend → Boolean[] memo (null = abhi nahi pata).',
          time: 'O(n³)', space: 'O(n)',
          code: `public boolean wordBreak(String s, List<String> wordDict) {
    return canBreak(s, 0, new HashSet<>(wordDict), new Boolean[s.length()]);
}

private boolean canBreak(String s, int start, Set<String> dict, Boolean[] memo) {
    if (start == s.length()) return true;
    if (memo[start] != null) return memo[start];
    for (int end = start + 1; end <= s.length(); end++) {
        if (dict.contains(s.substring(start, end)) && canBreak(s, end, dict, memo)) {
            return memo[start] = true;
        }
    }
    return memo[start] = false;
}`,
        },
        {
          level: 'Optimal', idea: 'Tabulation: dp[i] = s ke pehle i chars (s[0..i)) dict words me toot sakte hain? dp[0] = true. Har i ke liye koi cut j: dp[j] true aur s[j..i) dict me → dp[i] = true.',
          time: 'O(n³) (n² pairs × substring)', space: 'O(n)',
          code: `public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<>(wordDict);
    int n = s.length();
    boolean[] dp = new boolean[n + 1]; // dp[i] = s ke pehle i chars toot sakte hain?
    dp[0] = true;                       // empty string
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && dict.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
}`,
        },
      ],
      dryRun: '"leetcode", [leet, code] → dp[0]=T, dp[4]=T ("leet"), dp[8]=T (dp[4] && "code") → true',
      interview: 'Let dp[i] mean the first i characters can be segmented into dictionary words, with dp[0] true for the empty prefix. For each i I try every cut j: if dp[j] is true and s.substring(j, i) is in a HashSet of words, dp[i] is true and I break. The answer is dp[n]. There are O(n²) pairs and substring hashing costs O(n), so O(n³) worst case, which can be cut by only trying cuts up to the longest word length.',
      problem: {
        statement: 'String <b>s</b> aur words ki list <b>wordDict</b> di hai. Kya <b>s</b> ko space se tod ke aise words me baant sakte hain jo saare dictionary me hon? Ek word <b>kai baar</b> use ho sakta hai. <code>true</code> / <code>false</code> return karo.',
        examples: [
          { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true', explain: '"leetcode" = "leet" + "code".', viz: { s: 'leetcode', wordDict: '["leet","code"]' } },
          { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: 'true', explain: '"apple" + "pen" + "apple" — "apple" do baar use hua.', viz: { s: 'applepenapple', wordDict: '["apple","pen"]' } },
          { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: 'false', explain: '"cats"+"and" ke baad "og" bachta hai, "cat"+"sand" ke baad bhi "og" — koi poora split nahi.', viz: { s: 'catsandog', wordDict: '["cats","dog","sand","and","cat"]' } },
        ],
        constraints: ['1 ≤ s.length ≤ 300', '1 ≤ wordDict.length ≤ 1000', '1 ≤ wordDict[i].length ≤ 20', 's aur words sirf lowercase letters', 'wordDict ke saare words unique'],
      },
    },
  },

  // ---------------- DAILY PLAN (14 din = Weeks 21–22, sirf course ke 8 questions) ----------------
  days: [
    {
      day: 1, week: 1, dow: 'Mon', type: 'learn', title: 'DP Intro — Recursion → Memo → Tabulation',
      theory: ['Overlapping subproblems + optimal substructure', 'Recursion tree me repeat dekho', 'Memoization (top-down)', 'Tabulation (bottom-up)', 'Space-opt: 2 variables'],
      qs: [70],
      interview: {
        q: 'What is dynamic programming and when do you use it?',
        a: 'Dynamic programming solves a problem by combining answers to smaller subproblems and storing each answer so it is computed only once. It applies when the problem has optimal substructure, meaning the big answer is built from smaller answers, and overlapping subproblems, meaning the same smaller problems repeat. Plain recursion then wastes exponential time; memoizing or filling a table bottom-up makes it polynomial. Climbing Stairs drops from O(2^n) to O(n) this way.',
      },
    },
    {
      day: 2, week: 1, dow: 'Tue', type: 'learn', title: '1D DP (min) — Min Cost Climbing Stairs',
      theory: ['State: dp[i] = step i tak min cost', 'Top = index n (array ke bahar)', 'Free start: dp[0] = dp[1] = 0', 'Memo me -1 kyun (0 valid)'],
      qs: [746],
      interview: {
        q: 'How do you define a DP state?',
        a: 'I write one sentence describing what dp[i] means before writing any code, for example, the minimum cost to stand on step i. The state must capture everything needed to make future decisions, and nothing more, because every extra variable multiplies the number of states. Then I check that the answer can be read from some state, like dp[n], and that each state can be computed from smaller ones. A clear state usually makes the transition and base case obvious.',
      },
    },
    {
      day: 3, week: 1, dow: 'Wed', type: 'learn', title: 'Take / Skip DP — House Robber',
      theory: ['Har element pe 2 choice: lo ya chhodo', 'dp[i] = max(dp[i−1], dp[i−2] + nums[i−1])', 'Alternate lena hamesha best nahi', 'Size n+1 table, dp[0] = 0'],
      qs: [198],
      interview: {
        q: 'Explain the take-or-skip idea in House Robber.',
        a: 'At every house I have two choices. If I skip it, the best total is whatever I could get from the houses before it, dp[i−1]. If I rob it, I cannot rob the previous house, so I add its money to dp[i−2]. The best is the maximum of the two, dp[i] = max(dp[i−1], dp[i−2] + nums[i−1]). Simply taking every other house fails on inputs like [2,1,1,2], which is why we need DP. It runs in O(n) time and O(1) space with two variables.',
      },
    },
    {
      day: 4, week: 1, dow: 'Thu', type: 'learn', title: 'Unbounded Knapsack — Coin Change (min)',
      theory: ['dp[a] = amount a ke min coins', 'Infinity = amount + 1 (overflow se bacho)', 'Greedy kyun fail: [1,3,4], 6', 'Har coin unlimited → amount left → right'],
      qs: [322],
      interview: {
        q: 'Why does greedy fail for Coin Change, and how does DP fix it?',
        a: 'Greedy always takes the largest coin first. With coins [1,3,4] and amount 6 it picks 4+1+1, three coins, while 3+3 needs only two. Greedy commits early and never revisits. DP instead computes the best answer for every smaller amount: dp[a] = min over coins of dp[a − c] + 1, starting from dp[0] = 0, with amount + 1 as infinity. Every choice is effectively tried, so it is always optimal, in O(amount × coins) time.',
      },
    },
    {
      day: 5, week: 1, dow: 'Fri', type: 'learn', title: 'DP Framework Day — 4-step conversion + space-opt',
      theory: ['State → Transition → Base → Order → Answer', 'Recursion → memo mechanical conversion', 'Memo → tabulation (loop ulta)', 'Kab 2 variables, kab 1D array', 'Same questions, doosra approach'],
      qs: [198, 746],
      interview: {
        q: 'Memoization vs tabulation — which do you prefer and why?',
        a: 'Memoization is top-down: I write the natural recursion and cache results, so only the states actually needed are computed and the code mirrors the recurrence. Its downsides are recursion overhead and stack depth, which can overflow for large inputs. Tabulation is bottom-up: I fill a table in dependency order with loops, which avoids the stack and makes space optimization easy, because I can see exactly which previous values are needed. In interviews I usually derive the memo first, then convert to tabulation for the final answer.',
      },
    },
    {
      day: 6, week: 1, dow: 'Sat', type: 'revision', title: 'Revision — Week 1 (1D DP + Coin Change)',
      theory: ['Bina dekhe re-solve: 70, 198, 322', 'LC 39 (Phase 9) vs LC 322: list karna vs count/min', 'Har question me state ek line me bolo', 'Timer: Easy 15 min, Medium 25 min'],
      qs: [70, 198, 322, 39],
      interview: {
        q: 'How is DP different from backtracking?',
        a: 'Backtracking explores every path explicitly, which is necessary when I must list all solutions, like all combinations in Combination Sum, and its cost is exponential. DP applies when I only need a number, such as the count of ways or the minimum coins, and the subproblems overlap. Then I store each subproblem answer once, so the work becomes the number of states times the work per state. Many problems start as a backtracking recursion and become DP once I memoize the repeated states.',
      },
    },
    {
      day: 7, week: 1, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest',
      theory: ['30 min: Tum interviews Sohvi (LC 746 bina dekhe)', '30 min: Sohvi interviews Tum (LC 322 bina dekhe)', '30 min: Weekly contest discussion', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [746, 322],
      interview: {
        q: 'How do you explain a DP solution clearly in an interview?',
        a: 'I follow a fixed script. First I state the brute-force recursion and point out the repeated subproblems. Then I define the state in one sentence, give the transition and the base case, and say the fill order. I mention the complexity as number of states times work per state. Then I code the tabulation, dry-run a small example by filling the table aloud, and finally offer the space optimization. This structure shows the interviewer I understand why the solution works, not just that I memorized it.',
      },
    },
    {
      day: 8, week: 2, dow: 'Mon', type: 'learn', title: 'Knapsack (count) — Coin Change II',
      theory: ['dp[0] = 1 (kuch mat lo)', 'Coin loop bahar → combinations', 'Amount loop bahar → permutations (galat)', '2D dp[i][a] → 1D', '322 vs 518: min vs count'],
      qs: [518],
      interview: {
        q: 'In Coin Change II, why does the loop order matter?',
        a: 'With coins in the outer loop, by the time I process a coin, dp only contains ways built from earlier coins, so every combination is built in a fixed coin order and counted exactly once. If amounts are in the outer loop, each amount tries every coin as the last coin, so 1+2 and 2+1 are counted as different sequences, which gives permutations. The inner amount loop goes upward so the same coin can be reused, which is what makes it an unbounded knapsack.',
      },
    },
    {
      day: 9, week: 2, dow: 'Tue', type: 'learn', title: 'LIS — "ending at i" DP',
      theory: ['dp[i] = i pe KHATAM hone wali LIS', 'Answer = max(dp), dp[n−1] nahi', 'Strictly increasing: <, ≤ nahi', 'O(n²) double loop', 'Follow-up preview: O(n log n)'],
      qs: [300],
      interview: {
        q: 'Why is the LIS state "ending at index i"?',
        a: 'To extend a subsequence I need to know its last element, because the next element must be larger. If dp[i] is the longest increasing subsequence that ends exactly at index i, the transition is clean: look at every earlier j with nums[j] < nums[i] and take dp[j] + 1. A state like "best within the first i elements" loses the information about the last element. The trade-off is that the answer is the maximum over all dp[i], not just the last cell.',
      },
    },
    {
      day: 10, week: 2, dow: 'Wed', type: 'learn', title: '2D DP — Longest Common Subsequence',
      theory: ['dp[i][j] = pehle i aur pehle j chars', 'Row 0 / Col 0 = empty = 0', 'Match → diagonal + 1', 'Mismatch → max(upar, left)', 'Space-opt: 2 rows'],
      qs: [1143],
      interview: {
        q: 'How do you approach a two-string DP problem?',
        a: 'I let dp[i][j] describe the answer for the first i characters of one string and the first j of the other, with an extra row and column for empty prefixes so base cases are just zeros. Then I look at the last characters: if they match, I extend the diagonal answer; if not, I drop the last character from one string or the other and take the better result. The table is filled row by row in O(m·n), and since each row needs only the previous one, space drops to O(n).',
      },
    },
    {
      day: 11, week: 2, dow: 'Thu', type: 'learn', title: 'String Partition DP — Word Break',
      theory: ['dp[i] = pehle i chars toot sakte?', 'dp[0] = true (empty)', 'substring(j, i) — i exclusive', 'HashSet dict, break on true', 'LC 131 backtracking vs DP'],
      qs: [139],
      interview: {
        q: 'How would you optimize Word Break further?',
        a: 'The basic DP tries every split point j for every end i and checks the substring in a HashSet, which is O(n³) in the worst case because substring creation costs O(n). Since dictionary words have a bounded length, I can only try j from i − maxLen to i − 1, which makes it O(n · L²). Another option is a trie of the dictionary, walking forward from each true position so I never build substrings. I would also mention that BFS over start indices is an equivalent view.',
      },
    },
    {
      day: 12, week: 2, dow: 'Fri', type: 'learn', title: 'Catch-up — LIS O(n log n) + LCS space-opt',
      theory: ['tails[] hamesha sorted', 'Lower bound binary search (Phase 6)', 'tails asli LIS nahi hai!', 'LCS: prev[] / cur[] swap', 'Memo vs tab — doosra approach likho'],
      qs: [300, 1143],
      interview: {
        q: 'Explain the O(n log n) LIS algorithm.',
        a: 'I maintain an array tails where tails[k] is the smallest possible last element of an increasing subsequence of length k + 1. This array is always sorted. For each number x I binary-search the first tail that is greater than or equal to x and replace it with x, because a smaller tail is never worse for future extensions. If x is larger than every tail, it extends the longest subsequence and the size grows. The final size is the LIS length, though tails itself is not necessarily a real subsequence.',
      },
    },
    {
      day: 13, week: 2, dow: 'Sat', type: 'revision', title: 'Revision — Week 2 (Knapsack, LIS, LCS, Word Break)',
      theory: ['Bina dekhe re-solve: 518, 1143, 139', 'LC 131 (Phase 9) vs LC 139: saare splits vs possible?', 'Har question: state + transition zubaani', 'Last Minute tab ke triggers'],
      qs: [518, 1143, 139, 131],
      interview: {
        q: 'How do you recognize that a problem needs DP?',
        a: 'I look for three signals. The question asks for a count, a minimum or maximum, or a yes-or-no feasibility rather than listing all solutions. The problem can be described by making a choice at each step, like take or skip, which step, or which coin. And when I sketch the brute-force recursion, the same arguments repeat. If all three are there I define a state, write the recurrence, memoize it, and then convert it to a bottom-up table.',
      },
    },
    {
      day: 14, week: 2, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest + Phase Test',
      theory: ['30 min: Tum interviews Sohvi (LC 198 bina dekhe)', '30 min: Sohvi interviews Tum (LC 139 bina dekhe)', '30 min: Contest discussion', 'Phase test: Last Minute tab ke saare one-liners bolo'],
      qs: [198, 139],
      interview: {
        q: 'How do you reduce the space of a DP solution?',
        a: 'I look at which earlier states each cell actually reads. If dp[i] depends only on the previous one or two values, as in Climbing Stairs or House Robber, I replace the array with two variables for O(1) space. If a 2D row depends only on the previous row, as in LCS, I keep two 1D arrays and swap them. Sometimes a single array works if I choose the loop direction carefully, as in the unbounded knapsack. The trade-off is that I lose the full table needed to reconstruct the actual solution.',
      },
    },
  ],

  // ---------------- LAST MINUTE ----------------
  lastMinute: {
    triggers: [
      ['"Kitne tarike" + 1 ya 2 step', 'Fibonacci DP: dp[i] = dp[i−1] + dp[i−2] (LC 70)'],
      ['Min cost to reach top', 'dp[i] = min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2]) (LC 746)'],
      ['Adjacent nahi le sakte', 'Take / skip: max(dp[i−1], dp[i−2] + x) (LC 198)'],
      ['Coins unlimited, min coins', 'Unbounded knapsack min, ∞ = amount+1 (LC 322)'],
      ['Coins unlimited, number of combinations', 'dp[0]=1, coin loop bahar (LC 518)'],
      ['Longest increasing subsequence', 'dp[i] ending at i O(n²) / tails + binary search O(n log n) (LC 300)'],
      ['Do strings, common subsequence', '2D grid, match → diag+1, warna max(upar, left) (LC 1143)'],
      ['String ko dictionary words me todna', 'dp[i] prefix breakable, dp[0] = true (LC 139)'],
      ['Count / min / max / possible? + repeated recursion', 'DP (memo → tabulation)'],
      ['Saare solutions list karne hain', 'Backtracking (DP nahi)'],
    ],
    edge: [
      'n = 1 (LC 70 → 1, LC 198 → nums[0])',
      'amount = 0 → LC 322: 0, LC 518: 1',
      'Impossible amount → −1 (322) / 0 (518)',
      'Saare equal elements (LIS → 1)',
      'Koi common char nahi (LCS → 0)',
      'Word Break: word kai baar use ho sakta hai',
      'Bada coin value (2³¹−1) → c ≤ a check pehle, a − c negative mat hone do',
    ],
    mistakes: [
      'Integer.MAX_VALUE + 1 → overflow negative (amount + 1 use karo)',
      'Memo ko 0 se "not computed" maanna jab 0 valid answer ho (−1 / null use karo)',
      'LC 518 me loops ulte → permutations gin liye',
      'LIS me answer dp[n−1] return karna (max(dp) chahiye)',
      'LIS me ≤ use karna (strictly increasing chahiye)',
      'substring(j, i) me i inclusive samajhna',
      'dp size n rakhna jab dp[n] chahiye → ArrayIndexOutOfBounds',
      'House Robber me "alternate houses" greedy',
    ],
  },
};
