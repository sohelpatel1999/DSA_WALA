// Phase 11 (Dynamic Programming) — Week 1 lessons (local days 1–7). Day-1 format.
(function () {
  const P = window.PHASE_CONTENT['dp'];
  P.lessons = P.lessons || {};
  // Question ka approach code → LeetCode jaisa "class Solution { ... }"
  const sol = (n, k) => 'class Solution {\n' + P.questions[n].approaches[k].code.split('\n').map(l => (l ? '    ' + l : l)).join('\n') + '\n}';

  Object.assign(P.lessons, {
    // =====================================================================
    1: {
      title: 'DP Intro — Recursion → Memo → Tabulation (Climbing Stairs)',
      goal: 'DP kya hai, <b>overlapping subproblems</b> kaise dikhte hain, aur ek hi problem (LC 70) ko <b>4 tarike</b> se solve karna: plain recursion → memoization → tabulation → 2 variables.',
      main: 70,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 53, LC 78',
          blocks: [
            { p: 'Naya phase, lekin DP ki jadein pichle phases me hain: Kadane (Phase 1) asal me chhota DP hai, aur Subsets (Phase 9) ka recursion tree hi DP ka starting point hai.' },
            { h: '1) LC 53 Maximum Subarray (Phase 1)' },
            { p: '<b>Problem:</b> sabse bade sum wala continuous subarray ka sum.' },
            { pre: '[-2,1,-3,4,-1,2,1,-5,4] → 6   ([4,-1,2,1])' },
            { p: '<b>Pattern:</b> Kadane = 1D DP. <code>cur</code> = "index i pe KHATAM hone wala best sum".' },
            { olist: ['Har x pe: purana extend karu (cur + x) ya naya start (x)?', 'cur = max(x, cur + x).', 'best = max(best, cur).'] },
            { code: `public int maxSubArray(int[] nums) {
    int cur = 0, best = Integer.MIN_VALUE;
    for (int x : nums) {
        cur = Math.max(x, cur + x);
        best = Math.max(best, cur);
    }
    return best;
}` },
            { tip: 'Memory hook: <b>Kadane = DP with 1 variable.</b> State "i pe khatam" — yahi idea Week 2 me LIS (LC 300) me dobara aayega.' },
            { h: '2) LC 78 Subsets (Phase 9)' },
            { p: '<b>Problem:</b> array ke saare subsets (power set).' },
            { pre: '[1,2,3] → [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' },
            { p: '<b>Pattern:</b> Take / skip recursion — har element pe 2 branch → 2^n leaves.' },
            { olist: ['dfs(i): i == n → current list ko result me copy.', 'nums[i] lo → dfs(i+1) → wapas hatao.', 'nums[i] chhodo → dfs(i+1).'] },
            { code: `private void dfs(int[] nums, int i, List<Integer> cur, List<List<Integer>> res) {
    if (i == nums.length) { res.add(new ArrayList<>(cur)); return; }
    cur.add(nums[i]);
    dfs(nums, i + 1, cur, res);       // lo
    cur.remove(cur.size() - 1);
    dfs(nums, i + 1, cur, res);       // chhodo
}` },
            { tip: 'Memory hook: <b>Saare answers chahiye → backtracking. Sirf count/best chahiye + calls repeat → DP.</b>' },
          ],
        },
        {
          title: 'Part 1 — Concept: DP = recursion + yaaddasht',
          blocks: [
            { p: '<b>Dynamic Programming</b> tab lagta hai jab: (1) bada answer chhote answers se banta hai (<b>optimal substructure</b>) aur (2) same chhota sawaal baar-baar aata hai (<b>overlapping subproblems</b>).' },
            { p: 'Har DP ke <b>3 sawaal</b> — code se pehle likho:' },
            { table: { head: ['Sawaal', 'LC 70 me jawab'], rows: [
              ['<b>State</b> — dp[i] ka matlab?', 'dp[i] = step i tak pahunchne ke tarike'],
              ['<b>Transition</b> — dp[i] kaise bane?', 'Aakhri jump 1 tha (i−1 se) ya 2 (i−2 se) → dp[i] = dp[i−1] + dp[i−2]'],
              ['<b>Base case</b> — sabse chhota?', 'dp[0] = 1 (kuch mat karo), dp[1] = 1'],
            ] } },
            { p: '<b>Recursion tree</b> (n = 5) — dekho kitna repeat hai:' },
            { pre: `                    ways(5)
               /              \\
          ways(4)            ways(3)   ← dobara!
          /     \\            /     \\
     ways(3)   ways(2)   ways(2)  ways(1)
     /    \\     /   \\     /   \\
 ways(2) w(1) w(1) w(0) w(1) w(0)
  /  \\
w(1) w(0)

ways(3): 2 baar · ways(2): 3 baar · total 15 calls → O(2^n)` },
            { p: '<b>4-step safar</b> (poore phase me har question pe yahi):' },
            { table: { head: ['Step', 'Kya karte hain', 'LC 70 Time / Space'], rows: [
              ['1. Recursion', 'Seedha recurrence', 'O(2^n) / O(n) stack'],
              ['2. Memoization (top-down)', 'Recursion + memo[] me save', 'O(n) / O(n)'],
              ['3. Tabulation (bottom-up)', 'Loop: chhote se bada, dp[] table', 'O(n) / O(n)'],
              ['4. Space-opt', 'Sirf last 2 values → 2 variables', 'O(n) / O(1)'],
            ] } },
            { tip: 'DP ka asli trick: <b>"Same arguments ke saath function dobara call hua?"</b> → store karo.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 70 Climbing Stairs', blocks: [{ problem: 70 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute (recursion):</b> Top pe khade ho, peeche dekho — aakhri jump ya toh 1 ka tha (step n−1 se) ya 2 ka (step n−2 se). Dono raaste alag hain, toh <code>ways(n) = ways(n−1) + ways(n−2)</code>. Base: <code>ways(0) = ways(1) = 1</code>. Lekin tree me same calls repeat → <b>O(2^n)</b>. n = 45 pe ~10⁹ calls → TLE.' },
            { p: '<b>Better (memoization):</b> Same recursion, bas <code>memo[n]</code> me answer likh do. Doosri baar same n aaya → seedha return. Har n sirf ek baar → <b>O(n)</b>.' },
            { p: '<b>Optimal (tabulation):</b> Recursion ulta karo — dp[0], dp[1] pata hain, loop se dp[2], dp[3]… bharo. Koi stack nahi.' },
            { p: '<b>Optimal (space):</b> dp[i] sirf dp[i−1] aur dp[i−2] padhta hai → poora array kyun? <code>prev1, prev2</code> se O(1).' },
            { olist: [
              'State likho: dp[i] = step i tak ke tarike.',
              'Transition: last move socho → dp[i−1] + dp[i−2].',
              'Base: dp[0] = 1, dp[1] = 1.',
              'Order: i = 2 → n (dono dependencies pehle ban chuki).',
              'Answer: dp[n].',
            ] },
            { tip: 'Ye Fibonacci hi hai: 1, 1, 2, 3, 5, 8, 13… Interviewer "Fibonacci se relation?" pooche toh yahi bolo.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: n = 5',
          blocks: [
            { p: '<b>Tabulation</b> — table cell by cell:' },
            { table: { head: ['i', 'dp[i−1]', 'dp[i−2]', 'dp[i]', 'dp array'], rows: [
              ['init', '—', '—', 'dp[0]=1, dp[1]=1', '[1, 1, 0, 0, 0, 0]'],
              ['2', '1', '1', '<b>2</b>', '[1, 1, 2, 0, 0, 0]'],
              ['3', '2', '1', '<b>3</b>', '[1, 1, 2, 3, 0, 0]'],
              ['4', '3', '2', '<b>5</b>', '[1, 1, 2, 3, 5, 0]'],
              ['5', '5', '3', '<b>8</b>', '[1, 1, 2, 3, 5, 8]'],
            ] } },
            { p: 'Answer <code>dp[5] = 8</code> ✓' },
            { p: '<b>Memoization</b> — call order (memo me kab kya likha):' },
            { pre: `ways(5) → ways(4) → ways(3) → ways(2) → ways(1)=1, ways(0)=1 → memo[2]=2
                              ways(3) → ways(1)=1          → memo[3]=3
                   ways(4) → ways(2) = memo hit 2         → memo[4]=5
        ways(5) → ways(3) = memo hit 3                    → memo[5]=8` },
            { p: '<b>Space-opt</b> (prev2, prev1):' },
            { table: { head: ['i', 'cur = prev1 + prev2', 'prev2', 'prev1'], rows: [
              ['start', '—', '1', '1'],
              ['2', '1 + 1 = 2', '1', '2'],
              ['3', '2 + 1 = 3', '2', '3'],
              ['4', '3 + 2 = 5', '3', '5'],
              ['5', '5 + 3 = 8', '5', '<b>8</b>'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — recursion</b>' },
            { code: sol(70, 0) },
            { p: '<b>Better — memoization</b>' },
            { code: sol(70, 1) },
            { p: '<b>Optimal — tabulation</b>' },
            { code: sol(70, 2) },
            { p: '<b>Optimal — space O(1)</b>' },
            { code: sol(70, 3) },
            { lines: [
              ['if (n <= 1) return 1;', 'Base case: step 0 ya 1 tak sirf 1 tarika. Iske bina recursion kabhi nahi rukega.'],
              ['int[] memo = new int[n + 1];', 'Index 0..n. 0 = "abhi compute nahi hua" (asli answer kabhi 0 nahi hota, isliye safe).'],
              ['if (memo[n] != 0) return memo[n];', 'Memo hit — poori recursion branch skip.'],
              ['dp[0] = 1; dp[1] = 1;', 'Table ke base cases — loop inhi se shuru hota hai.'],
              ['for (int i = 2; i <= n; i++)', '<= n kyunki answer dp[n] chahiye.'],
              ['dp[i] = dp[i - 1] + dp[i - 2];', 'Transition: last jump 1 ya 2.'],
              ['int cur = prev1 + prev2;', 'dp[i] bina array ke.'],
              ['prev2 = prev1; prev1 = cur;', 'Window aage khiskao — ORDER zaroori (pehle prev2, phir prev1).'],
            ] },
            { tip: 'Ulta order <code>prev1 = cur; prev2 = prev1;</code> likha toh prev2 bhi cur ban jaayega — classic bug.' },
          ],
        },
        {
          title: 'Part 6 — Visualize: table cell-by-cell',
          blocks: [
            { list: [
              '<b>Tabulation:</b> <span class="lg win">win</span> = jo 2 cells padhe, <span class="lg new">new</span> = jo cell abhi likha.',
              '<b>Memoization</b> tab me CALL STACK dekho — recursion kitna gehra jaata hai, aur "memo hit" pe branch kaise katti hai.',
              '<b>Space O(1)</b> tab me sirf 2 values yaad rehti hain.',
              'Apna n daalo (jaise 10) aur dekho table Fibonacci se bhar raha hai.',
            ] },
            { viz: 70, ex: 2 },
            { viz: 70, ex: 2, variant: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>n = 1</code>', '1', 'Loop chalta hi nahi, dp[1] = 1'],
              ['<code>n = 2</code>', '2', '(1+1), (2)'],
              ['<code>n = 45</code>', '1836311903', 'int me fit (max ~2.1×10⁹) — brute TLE, DP instant'],
              ['<code>n = 0</code>', '(constraint me nahi)', 'Hamare code me dp[0] = 1 → 1; brute bhi 1'],
            ] } },
            { p: 'n = 46 hota toh overflow → <code>long</code>. Constraint padhna zaroori hai.' },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space', 'Note'], rows: [
              ['Recursion', 'O(2^n)', 'O(n) stack', 'Har call 2 call — tree'],
              ['Memoization', 'O(n)', 'O(n) memo + O(n) stack', 'Har state ek baar'],
              ['Tabulation', 'O(n)', 'O(n)', 'Koi recursion nahi'],
              ['Space-opt', 'O(n)', 'O(1)', 'Sirf 2 variables'],
            ] } },
            { p: 'DP complexity formula: <b>(states) × (kaam per state)</b> = n × O(1) = O(n).' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { p: 'Pehle khud jawab socho, phir click karke check karo.' },
            { qa: [
              ['DP lagane ke liye problem me kaunsi 2 properties chahiye?', 'Optimal substructure (bada answer chhote se bane) + overlapping subproblems (same chhota sawaal repeat ho).'],
              ['Plain recursion O(2^n) kyun hai?', 'Har call 2 calls karti hai aur same n baar-baar compute hota hai — tree ki height n.'],
              ['Memo array me 0 ko "not computed" kyun maan sakte hain?', 'Kyunki LC 70 me koi asli answer 0 nahi hota (min 1). Jahan 0 valid ho wahan -1 se fill karo.'],
              ['Memoization vs tabulation — ek fark batao.', 'Memo top-down recursion hai (stack use), tabulation bottom-up loop (koi stack nahi, space-opt aasaan).'],
              ['dp[0] = 1 kyun, 0 kyun nahi?', 'Ground pe khade rehne ka ek tarika — "kuch mat karo". Isse dp[2] = dp[1] + dp[0] = 2 sahi aata hai.'],
              ['Fibonacci se kya relation hai?', 'dp[i] = dp[i−1] + dp[i−2] — wahi recurrence, bas base alag. Answer = Fib(n+1).'],
              ['Agar 1, 2 ya 3 steps allowed hon?', 'dp[i] = dp[i−1] + dp[i−2] + dp[i−3]; space-opt me 3 variables.'],
              ['Space-opt me update order galat kiya toh?', 'prev1 = cur pehle kiya toh prev2 = prev1 bhi cur ban jaayega — agle step galat. Pehle prev2 = prev1, phir prev1 = cur.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo (Recursion → Memo → Tab → Space)', 'To reach step n, the last move was either a single step from n minus one or a double step from n minus two, so the number of ways is ways(n−1) plus ways(n−2), with one way for steps zero and one. Plain recursion recomputes the same values and is exponential. Memoizing each n makes it linear. I prefer the bottom-up version: fill dp from index two to n, then return dp[n]. Since each value only needs the previous two, I replace the array with two variables, giving O(n) time and O(1) space.'],
              ['Follow-up: "Steps ka set diya ho, jaise {1, 3, 5}?"', 'Then the transition becomes the sum of dp[i − s] over every allowed step s with s ≤ i. Time becomes O(n × number of steps) and I keep the full array, or a window as large as the biggest step.'],
              ['Follow-up: "n bahut bada ho, 10^18?"', 'Then linear time is too slow. The recurrence is linear, so I can raise the 2 by 2 matrix [[1,1],[1,0]] to the nth power with fast exponentiation, which takes O(log n), usually with answers modulo some prime.'],
              ['1-minute: DP kya hai?', 'Dynamic programming solves a problem by combining answers to smaller subproblems and storing each answer so it is computed only once. It applies when the problem has optimal substructure and overlapping subproblems. Plain recursion then wastes exponential time; memoizing or filling a table bottom-up makes it polynomial. Climbing Stairs drops from O(2^n) to O(n) this way.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Paper pe n = 5 ka recursion tree banao aur repeated calls ko gola karo (circle).',
              'Brute recursion code <b>bina notes</b> likho, n = 3 pe haath se chalao.',
              'Tabulation code likho aur LeetCode pe submit karo (Accepted).',
              'Part 4 jaisa dp table n = 6 ke liye khud bharo (answer 13).',
              'Visualizer me Tabulation aur Memoization dono tabs chalao — farak 2 line me likho.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Charon approaches memory se, 12 minute me. Space-opt submit.',
              '<b>Task B:</b> Steps set {1, 3, 5} wala generalized version likho aur n = 6 pe chalao.',
              '<b>Task C:</b> "DP kya hai + LC 70" 90 second me bolo (Part 10).',
              '<b>Task D:</b> Matrix exponentiation idea 3 line me explain karo (sirf idea).',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 70 — memo aur tabulation dono submit.',
              'Fundamentals tab: "State · Transition · Base case" table padho.',
              'Kal LC 746 Min Cost Climbing Stairs — problem pehle padh lo aur state socho.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['n = 6 ka answer?', '13 (1,1,2,3,5,8,13).'],
              ['LC 70 ka state, transition, base?', 'dp[i] = step i tak tarike; dp[i] = dp[i−1] + dp[i−2]; dp[0] = dp[1] = 1.'],
              ['Memoization ki 2 extra lines kaunsi?', 'Shuru me "memo me hai toh return", end me "memo[n] = ... ; return memo[n]".'],
              ['Tabulation ka time/space? Space-opt ka?', 'O(n)/O(n); space-opt O(n)/O(1).'],
              ['Backtracking vs DP ek line me?', 'Saare solutions list karne → backtracking; sirf count/best + repeat → DP.'],
            ] },
          ],
        },
      ],
      checks: [
        'DP ki 2 properties apne shabdon me bata sakta/sakti hu',
        'n = 5 ka recursion tree banaya aur repeated calls pehchaane',
        'Recursion, memo, tabulation code bina dekhe likha',
        'Space-opt (2 variables) Accepted (Sohel: must · Sohvi: optional)',
        'Visualizer me tabulation aur memo dono dekhe',
        '8 chhote interview sawaalon ke jawab diye',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Last jump 1 ya 2 → dp[i] = dp[i−1] + dp[i−2]. Recursion → memo → table → 2 variables.',
    },

    // =====================================================================
    2: {
      title: '1D DP (min) — Min Cost Climbing Stairs',
      goal: 'Counting DP (LC 70) se <b>minimum DP</b> tak: state me "cost" aata hai, transition me <code>+</code> ki jagah <code>min</code>. Top = index n (array ke bahar) samajhna.',
      main: 746,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 70, LC 704, LC 206',
          blocks: [
            { h: '1) LC 70 Climbing Stairs (kal)' },
            { p: '<b>Problem:</b> 1 ya 2 step, n tak kitne tarike.' },
            { pre: 'n = 5 → 8   (dp = 1,1,2,3,5,8)' },
            { p: '<b>Pattern:</b> Fibonacci 1D DP.' },
            { olist: ['dp[i] = step i tak tarike.', 'dp[i] = dp[i−1] + dp[i−2].', 'Space-opt: prev2, prev1.'] },
            { code: `int prev2 = 1, prev1 = 1;
for (int i = 2; i <= n; i++) {
    int cur = prev1 + prev2;
    prev2 = prev1;
    prev1 = cur;
}
return prev1;` },
            { tip: 'Memory hook: <b>Aaj bhi wahi skeleton — sirf "+" ki jagah "min" aur cost add.</b>' },
            { h: '2) LC 704 Binary Search (Phase 6)' },
            { p: '<b>Problem:</b> sorted array me target ka index, warna −1.' },
            { pre: '[-1,0,3,5,9,12], target 9 → 4' },
            { p: '<b>Pattern:</b> Search space aadha karo.' },
            { olist: ['lo = 0, hi = n−1.', 'mid = lo + (hi−lo)/2.', 'Chhota → lo = mid+1, bada → hi = mid−1.'] },
            { code: `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}` },
            { tip: 'Memory hook: <b>lo &lt;= hi, mid overflow-safe.</b> Week 2 me LIS O(n log n) isi pe chalega.' },
            { h: '3) LC 206 Reverse Linked List (Phase 4)' },
            { p: '<b>Problem:</b> singly linked list ulti karo.' },
            { pre: '1 → 2 → 3 → null  ⇒  3 → 2 → 1 → null' },
            { p: '<b>Pattern:</b> 3 pointers prev / cur / next — "rolling variables" jaise DP space-opt.' },
            { olist: ['next = cur.next save.', 'cur.next = prev (ulta).', 'prev = cur, cur = next.'] },
            { code: `public ListNode reverseList(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}` },
            { tip: 'Memory hook: <b>Save → reverse → move.</b> Update order galat = bug (DP space-opt jaisa hi).' },
          ],
        },
        {
          title: 'Part 1 — Concept: Counting DP vs Min/Max DP',
          blocks: [
            { table: { head: ['', 'LC 70 (count)', 'LC 746 (min)'], rows: [
              ['State', 'dp[i] = step i tak tarike', 'dp[i] = step i tak min cost'],
              ['Combine', '<code>+</code> (dono raaste gino)', '<code>min</code> (sasta raasta chuno)'],
              ['Transition', 'dp[i−1] + dp[i−2]', 'min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2])'],
              ['Base', 'dp[0] = dp[1] = 1', 'dp[0] = dp[1] = 0 (free start)'],
              ['Answer', 'dp[n]', 'dp[n] (top = index n)'],
            ] } },
            { pre: `cost:   [10] [15] [20]   (top)
index:    0    1    2      3 = n
                         ↑ yahan pahunchna hai — array ke bahar!` },
            { tip: '<b>Count</b> me raaste jodte hain, <b>min/max</b> me raaste me se best chunte hain. Baaki skeleton same.' },
            { p: 'Cost kab lagta hai? Step i se <b>nikalte waqt</b> cost[i] dete ho. Isliye i−1 se aaye toh cost[i−1] diya tha.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 746 Min Cost Climbing Stairs', blocks: [{ problem: 746 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute (recursion):</b> <code>reach(i)</code> = step i pe khade hone ka min cost. Step i pe ya toh i−1 se aaye (cost[i−1] diya) ya i−2 se (cost[i−2]). Base: i ≤ 1 → 0. O(2^n).' },
            { p: '<b>Better (memo):</b> <code>memo[i]</code>, lekin <b>-1 se fill</b> — kyunki 0 ek valid cost hai (dp[0] = 0, ya cost me zeros).' },
            { p: '<b>Optimal (tabulation):</b> dp[0] = dp[1] = 0, loop i = 2..n.' },
            { p: '<b>Optimal (space):</b> prev2, prev1 — LC 70 jaisa.' },
            { olist: ['State: dp[i] = step i tak min cost.', 'Transition: min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2]).', 'Base: dp[0] = dp[1] = 0.', 'Answer: dp[n] (top), dp[n−1] nahi!'] },
            { tip: 'Galti: answer <code>dp[n−1]</code> return karna. Top array ke <b>bahar</b> hai.' },
          ],
        },
        {
          title: 'Part 4 — Dry run',
          blocks: [
            { p: '<b>Example 1:</b> cost = [10, 15, 20]' },
            { table: { head: ['i', 'dp[i−1] + cost[i−1]', 'dp[i−2] + cost[i−2]', 'dp[i]'], rows: [
              ['0, 1', '—', '—', '0, 0'],
              ['2', '0 + 15 = 15', '0 + 10 = 10', '<b>10</b>'],
              ['3 (top)', '10 + 20 = 30', '0 + 15 = 15', '<b>15</b>'],
            ] } },
            { p: '<b>Example 2:</b> cost = [1,100,1,1,1,100,1,1,100,1] → dp (index 0..10):' },
            { pre: 'dp = [0, 0, 1, 2, 2, 3, 3, 4, 4, 5, 6]   → dp[10] = 6' },
            { table: { head: ['i', 'calc', 'dp[i]'], rows: [
              ['2', 'min(0+100, 0+1)', '1'],
              ['3', 'min(1+1, 0+100)', '2'],
              ['4', 'min(2+1, 1+1)', '2'],
              ['5', 'min(2+1, 2+1)', '3'],
              ['6', 'min(3+100, 2+1)', '3'],
              ['7', 'min(3+1, 3+100)', '4'],
              ['8', 'min(4+1, 3+1)', '4'],
              ['9', 'min(4+100, 4+1)', '5'],
              ['10', 'min(5+1, 4+100)', '<b>6</b>'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' }, { code: sol(746, 0) },
            { p: '<b>Better — memo</b>' }, { code: sol(746, 1) },
            { p: '<b>Optimal — tabulation</b>' }, { code: sol(746, 2) },
            { p: '<b>Optimal — space O(1)</b>' }, { code: sol(746, 3) },
            { lines: [
              ['return reach(cost, cost.length);', 'Top = index n — wahi pahunchna hai.'],
              ['if (i <= 1) return 0;', 'Step 0 ya 1 se free start.'],
              ['Arrays.fill(memo, -1);', '0 valid answer hai, isliye "not computed" = -1.'],
              ['int[] dp = new int[n + 1];', 'Index n (top) bhi chahiye → size n+1.'],
              ['dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);', 'Do raaste, sasta chuno. Cost us step ka jahan se nikle.'],
              ['return dp[n];', 'Top ka min cost.'],
              ['for (int i = 2; i <= cost.length; i++)', 'Space-opt: same loop, array nahi.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['Upar <b>cost</b> row, neeche <b>dp</b> table — last column "top".', 'Har step pe 2 dp cells <span class="lg win">padhe</span> + 2 cost cells; naya cell <span class="lg new">likha</span>.', 'Example 2 chalao — 100 wale steps kaise skip hote hain.'] },
            { viz: 746, ex: 0 },
            { viz: 746, ex: 1, variant: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[0,0]</code>', '0', 'Sab free'],
              ['<code>[5,3]</code>', '3', 'Index 1 se start, 3 pay karke 2 step = top'],
              ['<code>[1,2]</code>', '1', 'Index 0 se, 1 pay karke 2 step'],
              ['<code>[0,1,2,2]</code>', '2', '0 → 2 (2 pay) → top'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Recursion', 'O(2^n)', 'O(n) stack'],
              ['Memo', 'O(n)', 'O(n)'],
              ['Tabulation', 'O(n)', 'O(n)'],
              ['Space-opt', 'O(n)', 'O(1)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Top kaunsa index hai?', 'Index n — array ke bahar. Isliye dp size n+1.'],
              ['dp[0] aur dp[1] dono 0 kyun?', 'Problem kehti hai index 0 ya 1 se start kar sakte ho — wahan khade hone ka cost 0.'],
              ['Memo -1 se kyun, 0 se kyun nahi?', '0 ek valid answer hai; 0 ko "not computed" maana toh baar-baar recompute hoga.'],
              ['Answer dp[n−1] kyun nahi?', 'dp[n−1] = last step pe khade hona; top tak pahunchne ke liye cost[n−1] bhi dena padega.'],
              ['LC 70 se kya badla?', '+ ki jagah min, aur transition me cost add.'],
              ['Alternate state: dp[i] = step i se top tak ka cost?', 'Haan: dp[i] = cost[i] + min(dp[i+1], dp[i+2]), answer min(dp[0], dp[1]). Right se left fill.'],
              ['Space O(1) kaise?', 'dp[i] sirf dp[i−1], dp[i−2] pe depend → 2 variables.'],
              ['Greedy (har baar sasta next step) kaam karega?', 'Nahi — abhi ka sasta aage mehenga raasta de sakta hai. DP saare options compare karta hai.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'Let dp[i] be the minimum cost to stand on step i, where the top is index n, just past the array. I may start on step zero or one for free, so both are zero. To arrive at step i I either came from i minus one, paying cost[i−1], or from i minus two, paying cost[i−2], so dp[i] is the minimum of those two. I fill the table from left to right and return dp[n]. Since only the last two values are read, two variables give O(n) time and O(1) space.'],
              ['Follow-up: "Agar 3 step tak jump ho sake?"', 'The transition gets a third option, dp[i−3] plus cost[i−3], and I keep three rolling variables. The complexity stays linear.'],
              ['Follow-up: "Raasta bhi print karo"', 'I keep the full dp array and, from the top, walk backwards: at each index I check which of the two predecessors produced the minimum and move there, collecting indices. That reconstruction needs the O(n) table, so I cannot use the two-variable version.'],
              ['1-minute: DP state kaise define karte ho?', 'I write one sentence describing what dp[i] means before any code, like the minimum cost to stand on step i. The state must hold everything needed for future decisions and nothing more, because extra variables multiply the number of states. Then I check that the final answer is some state, like dp[n], and that each state can be built from smaller ones.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'cost = [10,15,20] ki seedhi draw karo, "top" alag box me.',
              'Tabulation code bina dekhe likho, submit karo.',
              'Example 2 ka dp table (Part 4) khud bharo.',
              'Visualizer me Example 2 chalao.',
              'LC 70 aur LC 746 ka fark 3 line me likho.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Memo + space-opt 10 minute me, submit.',
              '<b>Task B:</b> Ulti state (step i se top tak) wala version likho, dono same answer do.',
              '<b>Task C:</b> Path reconstruction likho (indices list).',
              '<b>Task D:</b> Part 10 approach 60 sec me bolo.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 746 tabulation + space-opt submit.', 'LC 70 bina dekhe dobara (5 min).', 'Kal LC 198 House Robber — "adjacent nahi" ka matlab socho.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['cost = [10,15,20] → dp array?', '[0, 0, 10, 15] → 15.'],
              ['Transition likho.', 'dp[i] = min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2]).'],
              ['dp ka size kya?', 'n + 1 (top = index n).'],
              ['Memo me -1 kyun?', '0 valid answer hai.'],
              ['Count DP vs min DP me kya badalta hai?', 'Combine operator: + → min (ya max).'],
            ] },
          ],
        },
      ],
      checks: [
        'Top = index n samjha, dp size n+1 kyun',
        'Transition (min of 2 raaste) bina dekhe likha',
        'Tabulation code Accepted',
        'Example 2 ka dp table khud bhara',
        'Space-opt version likha (Sohel: must)',
        'Visualizer dono examples dekhe',
        'Self-test ke 5 sawaal sahi',
      ],
      memory: 'Min cost DP: dp[i] = min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2]); top = dp[n].',
    },

    // =====================================================================
    3: {
      title: 'Take / Skip DP — House Robber',
      goal: 'Har element pe <b>2 choice</b> (lo ya chhodo) wala DP. "Adjacent nahi le sakte" rule ko transition me kaise daalte hain — <code>max(dp[i−1], dp[i−2] + x)</code>.',
      main: 198,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 746, LC 739, LC 102',
          blocks: [
            { h: '1) LC 746 Min Cost Climbing Stairs (kal)' },
            { p: '<b>Problem:</b> 1/2 step, top (index n) tak min cost.' },
            { pre: '[10,15,20] → 15' },
            { p: '<b>Pattern:</b> Fibonacci-style min DP.' },
            { olist: ['dp[i] = step i tak min cost.', 'min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2]).', 'Answer dp[n].'] },
            { code: `int prev2 = 0, prev1 = 0;
for (int i = 2; i <= cost.length; i++) {
    int cur = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]);
    prev2 = prev1;
    prev1 = cur;
}
return prev1;` },
            { tip: 'Memory hook: <b>Top array ke bahar.</b>' },
            { h: '2) LC 739 Daily Temperatures (Phase 5)' },
            { p: '<b>Problem:</b> har din ke liye kitne din baad garmi badhegi.' },
            { pre: '[73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]' },
            { p: '<b>Pattern:</b> Monotonic decreasing stack of indices.' },
            { olist: ['Stack me "abhi tak jawab nahi mila" wale indices.', 'Garam din aaya → chhote wale pop, ans[j] = i − j.', 'Push i.'] },
            { code: `public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] ans = new int[n];
    Deque<Integer> st = new ArrayDeque<>(); // indices, temps decreasing
    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && temperatures[st.peek()] < temperatures[i]) {
            int j = st.pop();
            ans[j] = i - j;
        }
        st.push(i);
    }
    return ans;
}` },
            { tip: 'Memory hook: <b>Next greater → stack me intezaar karne wale.</b>' },
            { h: '3) LC 102 Binary Tree Level Order Traversal (Phase 7)' },
            { p: '<b>Problem:</b> tree ke nodes level by level.' },
            { pre: '[3,9,20,null,null,15,7] → [[3],[9,20],[15,7]]' },
            { p: '<b>Pattern:</b> BFS + size loop.' },
            { olist: ['Queue me root.', 'size = q.size() — utne poll = ek level.', 'Children offer.'] },
            { code: `Queue<TreeNode> q = new ArrayDeque<>();
q.offer(root);
while (!q.isEmpty()) {
    int size = q.size();
    List<Integer> level = new ArrayList<>();
    for (int k = 0; k < size; k++) {
        TreeNode node = q.poll();
        level.add(node.val);
        if (node.left != null) q.offer(node.left);
        if (node.right != null) q.offer(node.right);
    }
    res.add(level);
}` },
            { tip: 'Memory hook: <b>size freeze karo = level boundary.</b>' },
          ],
        },
        {
          title: 'Part 1 — Concept: Take / Skip decision',
          blocks: [
            { p: 'Har ghar pe sirf 2 faisle:' },
            { table: { head: ['Choice', 'Matlab', 'Total'], rows: [
              ['<b>Skip</b>', 'Ye ghar chhoda → pichle ghar tak ka best', '<code>dp[i−1]</code>'],
              ['<b>Take</b>', 'Ye ghar loota → pichla ghar nahi le sakte', '<code>dp[i−2] + nums[i−1]</code>'],
            ] } },
            { pre: `nums:   2   7   9   3   1
        ↑       ↑       ↑     take, skip, take, skip, take → 12
dp[i] = pehle i ghar se best (i = 0..n)` },
            { p: '<b>Galat greedy:</b> "even index vs odd index ka sum" — <code>[2,1,1,2]</code> pe even = 3, odd = 3, lekin asli answer 4 (ghar 0 + ghar 3). Do ghar chhod bhi sakte ho!' },
            { tip: 'Take/skip ka DP Phase 9 ke Subsets (lo / chhodo) jaisa hai — bas list banane ki jagah <b>best value</b> store karte hain.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 198 House Robber', blocks: [{ problem: 198 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute:</b> <code>best(i)</code> = ghar 0..i se max. <code>max(best(i−1), best(i−2) + nums[i])</code>, base i &lt; 0 → 0. Exponential.' },
            { p: '<b>Better (memo):</b> memo[i], -1 se fill (0 valid hai jab saare ghar khaali).' },
            { p: '<b>Optimal (tabulation):</b> size n+1: dp[0] = 0 (koi ghar nahi), dp[1] = nums[0]. dp[i] = max(dp[i−1], dp[i−2] + nums[i−1]).' },
            { p: '<b>Optimal (space):</b> for-each x: cur = max(prev1, prev2 + x).' },
            { olist: ['State: dp[i] = pehle i ghar se max.', 'Transition: max(skip, take).', 'Base: dp[0] = 0, dp[1] = nums[0].', 'Answer dp[n].'] },
          ],
        },
        {
          title: 'Part 4 — Dry run: nums = [2, 7, 9, 3, 1]',
          blocks: [
            { table: { head: ['i', 'ghar (nums[i−1])', 'skip = dp[i−1]', 'take = dp[i−2] + nums[i−1]', 'dp[i]'], rows: [
              ['0', '—', '—', '—', '0'],
              ['1', '2', '—', '—', '2'],
              ['2', '7', '2', '0 + 7 = 7', '<b>7</b> (take)'],
              ['3', '9', '7', '2 + 9 = 11', '<b>11</b> (take)'],
              ['4', '3', '11', '7 + 3 = 10', '<b>11</b> (skip)'],
              ['5', '1', '11', '11 + 1 = 12', '<b>12</b> (take)'],
            ] } },
            { p: 'dp = <code>[0, 2, 7, 11, 11, 12]</code> → 12 ✓. Example 1 <code>[1,2,3,1]</code> → dp = [0, 1, 2, 4, 4] → 4.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' }, { code: sol(198, 0) },
            { p: '<b>Better — memo</b>' }, { code: sol(198, 1) },
            { p: '<b>Optimal — tabulation</b>' }, { code: sol(198, 2) },
            { p: '<b>Optimal — space O(1)</b>' }, { code: sol(198, 3) },
            { lines: [
              ['if (i < 0) return 0;', 'Koi ghar nahi bacha → 0.'],
              ['int skip = best(nums, i - 1, memo);', 'Ghar i chhoda.'],
              ['int take = best(nums, i - 2, memo) + nums[i];', 'Ghar i loota → i−1 skip karna padega.'],
              ['dp[1] = nums[0];', 'Ek ghar → use loot lo. (n ≥ 1 guarantee hai.)'],
              ['int take = dp[i - 2] + nums[i - 1];', 'dp index i = "pehle i ghar", isliye ghar ka index i−1.'],
              ['int cur = Math.max(prev1, prev2 + x);', 'Space-opt: same max(skip, take).'],
            ] },
            { tip: 'Index confusion se bacho: dp[i] = "pehle i ghar" → ghar ki value <code>nums[i − 1]</code>.' },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['Upar ghar (nums), neeche dp table.', 'Har i pe pehle <b>skip</b> (dp[i−1]) phir <b>take</b> (dp[i−2] + ghar) dikhega.', 'Example 3 <code>[2,1,1,2]</code> chalao — 2 ghar lagatar skip hote dekho.'] },
            { viz: 198, ex: 1 },
            { viz: 198, ex: 2, variant: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[5]</code>', '5', 'Ek ghar'],
              ['<code>[0]</code>', '0', 'Khaali ghar'],
              ['<code>[1,2]</code>', '2', 'Bada wala'],
              ['<code>[2,1,1,2]</code>', '4', 'Alternate greedy fail'],
              ['<code>[400,0,0,400]</code>', '800', 'Do ghar skip'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Recursion', 'O(2^n)', 'O(n)'],
              ['Memo', 'O(n)', 'O(n)'],
              ['Tabulation', 'O(n)', 'O(n)'],
              ['Space-opt', 'O(n)', 'O(1)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Transition kya hai?', 'dp[i] = max(dp[i−1], dp[i−2] + nums[i−1]).'],
              ['"Alternate houses ka max" kyun galat?', '[2,1,1,2] — 2 ghar lagatar chhodna better ho sakta hai (answer 4).'],
              ['dp[1] = nums[0] kyun?', 'Pehle 1 ghar se best = wahi ghar loot lo (paisa ≥ 0).'],
              ['Memo -1 se kyun?', 'Saare ghar 0 ho toh 0 valid answer.'],
              ['Space-opt me prev2 aur prev1 kya hain?', 'prev2 = dp[i−2], prev1 = dp[i−1].'],
              ['Ghar circle me hon toh? (follow-up)', 'Pehla aur aakhri dono nahi le sakte → do baar chalao: [0..n−2] aur [1..n−1], max lo.'],
              ['Kaunse ghar loote — kaise pata?', 'Full dp rakho, end se backtrack: dp[i] == dp[i−1] toh ghar i−1 skip, warna liya aur i−2 pe jao.'],
              ['Negative paise hote toh?', 'Constraint me nahi; hota toh skip option already handle karta (take chhota padega).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'For each house I have two choices. If I skip it, my best is the best from the houses before it. If I rob it, I cannot rob the previous house, so I add its money to the best from two houses back. That gives dp[i] = max(dp[i−1], dp[i−2] + nums[i−1]), where dp[i] covers the first i houses, with dp[0] = 0 and dp[1] = nums[0]. Taking every other house is a wrong greedy, as [2,1,1,2] shows. It is O(n) time, and with two rolling variables O(1) space.'],
              ['Follow-up: "Houses circle me hain"', 'The first and last houses become adjacent, so they cannot both be robbed. I run the same linear algorithm twice, once excluding the last house and once excluding the first, and return the larger result. Still O(n) time and O(1) space.'],
              ['Follow-up: "Kaunse ghar loote, list do"', 'I keep the full dp array, then walk backwards from i = n. If dp[i] equals dp[i−1] the house was skipped and I move to i−1; otherwise house i−1 was robbed and I jump to i−2. This needs O(n) space for the table.'],
              ['1-minute: Take or skip idea', 'Many DP problems reduce to a decision at each element: take it, subject to some rule, or skip it. The state remembers the best result so far, and the transition takes the better of the two choices. In House Robber taking forces me to skip the neighbour, so I read dp two steps back. The same pattern appears in subsequence problems such as LIS.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: ['5 ghar draw karo, take/skip tree n = 3 tak banao.', 'Tabulation code bina dekhe likho + submit.', '[2,1,1,2] ka dp table khud bharo (answer 4).', 'Visualizer me Example 2 aur 3 chalao.', '"Skip" aur "Take" apni bhasha me samjhao.'] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: ['<b>Task A:</b> Space-opt 5 minute me, submit.', '<b>Task B:</b> Circular version (2 runs) likho aur [2,3,2] → 3 check karo.', '<b>Task C:</b> Robbed houses ki list return karne wala version.', '<b>Task D:</b> Part 10 approach 60 sec.'] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 198 memo + space-opt submit.', 'LC 70 aur LC 746 space-opt bina dekhe (10 min).', 'Kal LC 322 Coin Change — greedy kyun fail hota hai, socho: coins [1,3,4], amount 6.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[2,7,9,3,1] ka dp?', '[0, 2, 7, 11, 11, 12] → 12.'],
              ['take ka formula (tabulation)?', 'dp[i−2] + nums[i−1].'],
              ['[2,1,1,2] → ?', '4.'],
              ['Space-opt loop ki ek line?', 'cur = Math.max(prev1, prev2 + x).'],
              ['Time/space best?', 'O(n) / O(1).'],
            ] },
          ],
        },
      ],
      checks: [
        'Take/skip ka matlab samjha',
        'Transition max(dp[i−1], dp[i−2] + nums[i−1]) bina dekhe',
        'Tabulation Accepted',
        '[2,1,1,2] pe greedy kyun fail — explain kar sakta/sakti hu',
        'Space-opt likha (Sohel: must)',
        'Visualizer me 2 examples dekhe',
        'Self-test 5/5',
      ],
      memory: 'Har ghar: chhodo (dp[i−1]) ya looto (dp[i−2] + x) — max lo.',
    },

    // =====================================================================
    4: {
      title: 'Unbounded Knapsack — Coin Change (min coins)',
      goal: 'Pehla <b>knapsack</b> DP: state "amount" pe, har coin <b>unlimited</b>. Greedy kyun fail hota hai, "infinity" kaise rakhte hain, aur impossible case (−1).',
      main: 322,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 198, LC 39, LC 215',
          blocks: [
            { h: '1) LC 198 House Robber (kal)' },
            { p: '<b>Problem:</b> adjacent ghar nahi, max paisa.' },
            { pre: '[2,7,9,3,1] → 12' },
            { p: '<b>Pattern:</b> Take / skip DP.' },
            { olist: ['skip = dp[i−1].', 'take = dp[i−2] + x.', 'max.'] },
            { code: `int prev2 = 0, prev1 = 0;
for (int x : nums) {
    int cur = Math.max(prev1, prev2 + x);
    prev2 = prev1;
    prev1 = cur;
}
return prev1;` },
            { tip: 'Memory hook: <b>Chhodo ya looto.</b>' },
            { h: '2) LC 39 Combination Sum (Phase 9)' },
            { p: '<b>Problem:</b> candidates (unlimited use) se target banane ke <b>saare</b> combinations.' },
            { pre: 'candidates = [2,3,6,7], target = 7 → [[2,2,3],[7]]' },
            { p: '<b>Pattern:</b> Backtracking, same index pe dobara (i, i+1 nahi).' },
            { olist: ['rem == 0 → copy add.', 'i = start se loop, c[i] > rem skip.', 'add → dfs(i, rem − c[i]) → remove.'] },
            { code: `private void dfs(int[] c, int start, int rem, List<Integer> cur, List<List<Integer>> res) {
    if (rem == 0) { res.add(new ArrayList<>(cur)); return; }
    for (int i = start; i < c.length; i++) {
        if (c[i] > rem) continue;
        cur.add(c[i]);
        dfs(c, i, rem - c[i], cur, res);   // i (i+1 nahi) → same number dobara
        cur.remove(cur.size() - 1);
    }
}` },
            { tip: 'Memory hook: <b>LC 39 = saare combos LIST (backtracking). LC 322 = sirf MIN count (DP).</b> Aaj yahi switch.' },
            { h: '3) LC 215 Kth Largest Element (Phase 8)' },
            { p: '<b>Problem:</b> array ka k-th sabse bada element.' },
            { pre: '[3,2,1,5,6,4], k = 2 → 5' },
            { p: '<b>Pattern:</b> Min-heap size k.' },
            { olist: ['Har x offer.', 'size > k → poll (sabse chhota nikla).', 'peek = answer.'] },
            { code: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> pq = new PriorityQueue<>(); // min-heap of size k
    for (int x : nums) {
        pq.offer(x);
        if (pq.size() > k) pq.poll();
    }
    return pq.peek();
}` },
            { tip: 'Memory hook: <b>k bade chahiye → min-heap size k.</b>' },
          ],
        },
        {
          title: 'Part 1 — Concept: Knapsack aur "infinity"',
          blocks: [
            { p: '<b>Knapsack family:</b> items (coins) hain, ek capacity (amount) hai. <b>0/1 knapsack</b> me har item ek baar; <b>unbounded</b> me unlimited. Coin Change = unbounded.' },
            { p: '<b>Greedy fail:</b> coins [1, 3, 4], amount 6.' },
            { table: { head: ['Tarika', 'Coins', 'Count'], rows: [
              ['Greedy (bada pehle)', '4 + 1 + 1', '3'],
              ['Best (DP)', '3 + 3', '<b>2</b>'],
            ] } },
            { p: '<b>State:</b> dp[a] = amount a ke liye min coins. <b>Transition:</b> aakhri coin c tha → dp[a] = min over c (dp[a − c] + 1).' },
            { pre: `amount 11, coins [1,2,5]
dp[11] = 1 + min( dp[10] (last coin 1),
                  dp[9]  (last coin 2),
                  dp[6]  (last coin 5) )` },
            { p: '<b>Infinity:</b> <code>Integer.MAX_VALUE + 1</code> = negative (overflow)! Isliye <code>amount + 1</code> use karo — itne coins kabhi lag hi nahi sakte (min coin 1 hai).' },
            { tip: 'End me <code>dp[amount] &gt; amount</code> → kabhi update nahi hua → <b>−1</b>.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 322 Coin Change', blocks: [{ problem: 322 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute:</b> <code>minCoins(rem)</code> = har coin try → 1 + minCoins(rem − c). rem &lt; 0 → impossible (MAX_VALUE), MAX_VALUE ko +1 se pehle check karo. Branching = coins, depth = amount → exponential.' },
            { p: '<b>Better (memo):</b> answer sirf rem pe depend → memo[rem]. -2 = not computed, -1 = impossible.' },
            { p: '<b>Optimal (tabulation):</b> dp[0] = 0, baaki amount+1. a = 1..amount, har coin c ≤ a se min. Answer dp[amount] (ya −1).' },
            { olist: ['State: dp[a] = min coins for a.', 'Base: dp[0] = 0.', 'Transition: dp[a] = min(dp[a], dp[a − c] + 1).', 'Order: a chhote se bade (dp[a − c] pehle ban chuka).', 'Impossible: dp[amount] > amount → −1.'] },
          ],
        },
        {
          title: 'Part 4 — Dry run: coins = [1, 2, 5], amount = 11',
          blocks: [
            { table: { head: ['a', 'c=1: dp[a−1]+1', 'c=2: dp[a−2]+1', 'c=5: dp[a−5]+1', 'dp[a]'], rows: [
              ['0', '—', '—', '—', '0'],
              ['1', '1', '—', '—', '1'],
              ['2', '2', '1', '—', '1'],
              ['3', '2', '2', '—', '2'],
              ['4', '3', '2', '—', '2'],
              ['5', '3', '3', '1', '1'],
              ['6', '2', '3', '2', '2'],
              ['7', '3', '2', '2', '2'],
              ['8', '3', '3', '3', '3'],
              ['9', '4', '3', '3', '3'],
              ['10', '4', '4', '2', '2'],
              ['11', '3', '4', '3', '<b>3</b>'],
            ] } },
            { pre: 'dp = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]  → 3  (5 + 5 + 1)' },
            { p: '<b>Example 2:</b> coins [2], amount 3 → dp = [0, ∞, 1, ∞] → dp[3] = 4 &gt; 3 → <b>−1</b>.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' }, { code: sol(322, 0) },
            { p: '<b>Better — memo</b>' }, { code: sol(322, 1) },
            { p: '<b>Optimal — tabulation</b>' }, { code: sol(322, 2) },
            { lines: [
              ['if (sub != Integer.MAX_VALUE) best = Math.min(best, sub + 1);', 'MAX_VALUE + 1 overflow se bachne ke liye pehle check.'],
              ['Arrays.fill(memo, -2);', '-2 = abhi nahi pata, -1 = impossible (dono alag rakhne hain).'],
              ['if (c > rem) continue;', 'Coin bada hai → rem − c negative.'],
              ['Arrays.fill(dp, amount + 1);', 'Safe infinity — +1 karne pe bhi overflow nahi.'],
              ['dp[0] = 0;', 'Amount 0 ke liye 0 coins.'],
              ['if (c <= a)', 'a − c negative index se bachao. Coin 2³¹−1 jaisa bada ho toh bhi safe.'],
              ['dp[a] = Math.min(dp[a], dp[a - c] + 1);', 'Aakhri coin c liya.'],
              ['return dp[amount] > amount ? -1 : dp[amount];', 'Infinity bacha → impossible.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['dp row me ∞ se shuru — har amount pe har coin ke liye ek step.', '<span class="lg win">win</span> = dp[a − c] jo padha, <span class="lg new">new</span> = dp[a].', 'Example 2 me ∞ end tak bacha → −1.'] },
            { viz: 322, ex: 0 },
            { viz: 322, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['coins [1], amount 0', '0', 'Loop chalta hi nahi'],
              ['coins [2], amount 3', '−1', 'Odd amount'],
              ['coins [1,3,4], amount 6', '2', 'Greedy 3 deta'],
              ['coins [2147483647], amount 2', '−1', 'c ≤ a check — overflow nahi'],
              ['coins [186,419,83,408], 6249', '20', 'Bada test — brute TLE'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Recursion', 'O(k^amount)', 'O(amount) stack'],
              ['Memo', 'O(amount × k)', 'O(amount)'],
              ['Tabulation', 'O(amount × k)', 'O(amount)'],
            ] } },
            { p: 'k = coins ki ginti. States = amount + 1, har state pe k kaam.' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Greedy ka counter-example?', 'coins [1,3,4], amount 6: greedy 4+1+1 = 3, best 3+3 = 2.'],
              ['Infinity ke liye MAX_VALUE kyun nahi?', 'dp[a − c] + 1 me overflow → negative → galat min.'],
              ['amount + 1 hi kyun?', 'Max possible coins = amount (sab 1 ke coin). amount + 1 kabhi asli answer nahi.'],
              ['Ye unbounded knapsack kyun hai?', 'Har coin kitni bhi baar use ho sakta hai.'],
              ['Loop order (amount bahar ya coin bahar) yahan matter karta hai?', 'Min ke liye nahi — dono sahi. Count (LC 518) me karta hai.'],
              ['Memo me -1 aur -2 dono kyun?', '-1 = impossible (computed), -2 = abhi compute nahi hua.'],
              ['Kaunse coins use hue — kaise nikaaloge?', 'choice[a] = kaunsa coin best diya; amount se peeche chalo a −= choice[a].'],
              ['BFS se bhi ho sakta hai?', 'Haan — amount se 0 tak shortest path (har coin = edge). Level = coins count.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'This is an unbounded knapsack. dp[a] is the fewest coins to make amount a. dp[0] is zero and every other entry starts at amount plus one, which acts as infinity without overflow risk. For each amount from one upward I try every coin not larger than it and take dp[a − c] + 1 if it improves dp[a]. If dp[amount] is still above amount, it cannot be formed and I return −1. Time is O(amount × coins) and space O(amount).'],
              ['Follow-up: "Greedy kyun nahi?"', 'Greedy commits to the largest coin and never reconsiders. With coins one, three and four and amount six it uses three coins, four plus one plus one, while three plus three uses two. Greedy only works for special coin systems like typical currency.'],
              ['Follow-up: "Coins bhi return karo"', 'I store for each amount which coin achieved the minimum. After filling the table, I start at the target amount and repeatedly subtract the stored coin until I reach zero, collecting coins along the way. Same time complexity and one extra array.'],
              ['1-minute: DP vs Backtracking', 'Backtracking explores every path explicitly, which is necessary when I must list all solutions, like all combinations in Combination Sum. DP applies when I only need a number, such as the minimum coins, and the subproblems overlap, so I store each answer once and the work becomes states times work per state.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: ['[1,3,4], 6 ka greedy vs best paper pe dikhao.', 'Tabulation code likho + submit.', 'Part 4 table amount 0..6 tak khud bharo.', 'Visualizer Example 1 aur 2.', 'LC 39 aur LC 322 ka fark 2 line me.'] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: ['<b>Task A:</b> Memo + tabulation 15 minute me.', '<b>Task B:</b> Coins reconstruct karne wala version.', '<b>Task C:</b> BFS version sketch karo (queue of amounts).', '<b>Task D:</b> Part 10 approach 60 sec.'] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 322 tabulation submit.', 'LC 198 dobara bina dekhe.', 'Kal Framework day — LC 70, 746, 198, 322 ke state/transition/base ek table me likh ke laao.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[1,2,5], 11 → dp[11]?', '3.'],
              ['Infinity value?', 'amount + 1.'],
              ['Impossible check?', 'dp[amount] > amount → −1.'],
              ['Transition?', 'dp[a] = min(dp[a], dp[a − c] + 1) for c ≤ a.'],
              ['Time?', 'O(amount × coins).'],
            ] },
          ],
        },
      ],
      checks: [
        'Greedy counter-example bata sakta/sakti hu',
        'amount + 1 infinity ka reason samjha',
        'Tabulation Accepted',
        'dp table 0..11 khud bhara',
        'Memo version (Sohel: must)',
        'Visualizer dono examples',
        'Self-test 5/5',
      ],
      memory: 'dp[a] = min(dp[a − c] + 1); ∞ = amount + 1; bacha toh −1.',
    },

    // =====================================================================
    5: {
      title: 'DP Framework Day — 4-step conversion + space-opt',
      goal: 'Koi naya problem nahi. Is hafte ke questions pe <b>DP framework</b> pakka karna: state → transition → base → order → answer, aur recursion → memo → tabulation → space-opt ko <b>mechanical conversion</b> ki tarah karna (LC 198, LC 746 pe).',
      main: 198,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 322, LC 46, LC 994',
          blocks: [
            { h: '1) LC 322 Coin Change (kal)' },
            { p: '<b>Problem:</b> min coins, unlimited use, warna −1.' },
            { pre: '[1,2,5], 11 → 3' },
            { p: '<b>Pattern:</b> Unbounded knapsack (min).' },
            { olist: ['fill amount+1, dp[0] = 0.', 'Har a, har c ≤ a: min(dp[a − c] + 1).', 'dp[amount] > amount → −1.'] },
            { code: `int[] dp = new int[amount + 1];
Arrays.fill(dp, amount + 1);
dp[0] = 0;
for (int a = 1; a <= amount; a++)
    for (int c : coins)
        if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
return dp[amount] > amount ? -1 : dp[amount];` },
            { tip: 'Memory hook: <b>∞ = amount + 1.</b>' },
            { h: '2) LC 46 Permutations (Phase 9)' },
            { p: '<b>Problem:</b> distinct numbers ke saare permutations.' },
            { pre: '[1,2,3] → 6 permutations' },
            { p: '<b>Pattern:</b> Backtracking + used[].' },
            { olist: ['cur.size() == n → copy.', 'Har unused i: mark, add, dfs, remove, unmark.'] },
            { code: `private void dfs(int[] nums, boolean[] used, List<Integer> cur, List<List<Integer>> res) {
    if (cur.size() == nums.length) { res.add(new ArrayList<>(cur)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true; cur.add(nums[i]);
        dfs(nums, used, cur, res);
        cur.remove(cur.size() - 1); used[i] = false;
    }
}` },
            { tip: 'Memory hook: <b>Permutation me states repeat nahi hote (har path alag) → DP se fayda nahi. Overlap hi DP ki shart.</b>' },
            { h: '3) LC 994 Rotting Oranges (Phase 10)' },
            { p: '<b>Problem:</b> saare oranges rot hone ka min time, ya −1.' },
            { pre: '[[2,1,1],[1,1,0],[0,1,1]] → 4' },
            { p: '<b>Pattern:</b> Multi-source BFS, level = minute.' },
            { olist: ['Saare 2 queue me, fresh gino.', 'Har level: neighbors rot, fresh−−.', 'fresh == 0 ? minutes : −1.'] },
            { code: `while (!q.isEmpty() && fresh > 0) {
    for (int k = q.size(); k > 0; k--) {
        int[] cell = q.poll();
        for (int[] d : dirs) {
            int r = cell[0] + d[0], c = cell[1] + d[1];
            if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] != 1) continue;
            grid[r][c] = 2;
            fresh--;
            q.offer(new int[]{r, c});
        }
    }
    minutes++;
}
return fresh == 0 ? minutes : -1;` },
            { tip: 'Memory hook: <b>BFS level = ek minute.</b> (Coin Change ka BFS view bhi yahi hai.)' },
          ],
        },
        {
          title: 'Part 1 — Concept: DP framework (5 sawaal) + 4-step conversion',
          blocks: [
            { table: { head: ['Step', 'Sawaal', 'LC 198', 'LC 746'], rows: [
              ['1. State', 'dp[i] ka matlab?', 'pehle i ghar se max', 'step i tak min cost'],
              ['2. Transition', 'Last choice kya thi?', 'max(dp[i−1], dp[i−2] + nums[i−1])', 'min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2])'],
              ['3. Base', 'Sabse chhota?', 'dp[0] = 0, dp[1] = nums[0]', 'dp[0] = dp[1] = 0'],
              ['4. Order', 'Kaun pehle bane?', 'i: 2 → n', 'i: 2 → n'],
              ['5. Answer', 'Kahan se padhe?', 'dp[n]', 'dp[n]'],
            ] } },
            { p: '<b>Recursion → Memo (3 lines add):</b>' },
            { code: `// 1) memo array banao + "not computed" value se fill
int[] memo = new int[n];  Arrays.fill(memo, -1);
// 2) function ke shuru me (base case ke baad):
if (memo[i] != -1) return memo[i];
// 3) return se pehle save:
memo[i] = answer;  return memo[i];` },
            { p: '<b>Memo → Tabulation:</b> <code>f(i)</code> → <code>dp[i]</code>, base case → initial cells, recursion ka "chhota argument" → loop ka pehla index.' },
            { p: '<b>Tabulation → Space-opt:</b> loop body me dekho kaunse dp cells padhe. Sirf <code>dp[i−1], dp[i−2]</code> → 2 variables.' },
            { pre: `Recursion:   f(i) = max(f(i-1), f(i-2) + x)
Memo:        same + memo[i]
Tabulation:  dp[i] = max(dp[i-1], dp[i-2] + x)   (loop)
Space-opt:   cur = max(prev1, prev2 + x); prev2 = prev1; prev1 = cur;` },
            { tip: 'Interview me ye 4 steps <b>bolte hue</b> karo — interviewer ko process dikhta hai.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 198 House Robber (doosri baar, conversion focus)',
          blocks: [{ problem: 198 }, { p: 'Aur LC 746 bhi — dono pe 4-step conversion karna hai.' }, { problem: 746 }],
        },
        {
          title: 'Part 3 — Thinking: same problem, 4 approaches side by side',
          blocks: [
            { table: { head: ['Approach', 'LC 198 core line', 'Time', 'Space'], rows: [
              ['Recursion', '<code>max(best(i−1), best(i−2) + nums[i])</code>', 'O(2^n)', 'O(n)'],
              ['Memo', '+ <code>if (memo[i] != -1) return memo[i];</code>', 'O(n)', 'O(n) + stack'],
              ['Tabulation', '<code>dp[i] = max(dp[i−1], dp[i−2] + nums[i−1])</code>', 'O(n)', 'O(n)'],
              ['Space-opt', '<code>cur = max(prev1, prev2 + x)</code>', 'O(n)', 'O(1)'],
            ] } },
            { p: '<b>Index shift dhyan:</b> recursion me <code>best(i)</code> = ghar 0..i (index i inclusive). Tabulation me <code>dp[i]</code> = pehle i ghar (size n+1). Dono sahi, bas consistent raho.' },
            { tip: 'Memo kab better? Jab saare states zaroori na hon (sparse). Tabulation kab? Jab space-opt chahiye ya stack deep ho (n = 10⁵).' },
          ],
        },
        {
          title: 'Part 4 — Dry run: memo call order vs tabulation order (LC 198, [2,7,9,3,1])',
          blocks: [
            { pre: `Memo (top-down) — best(4) se shuru:
best(4) → best(3) → best(2) → best(1) → best(0) → best(-1)=0, best(-2)=0 → memo[0]=2
                                        best(-1)=0                         → memo[1]=7
                              best(0)=memo 2                              → memo[2]=11
                    best(1)=memo 7                                        → memo[3]=11
          best(2)=memo 11                                                 → memo[4]=12
memo = [2, 7, 11, 11, 12]` },
            { pre: `Tabulation (bottom-up) — dp[0] se:
dp = [0, 2, 7, 11, 11, 12]     (memo[i] == dp[i+1] — sirf index shift)` },
            { table: { head: ['x', 'cur = max(prev1, prev2 + x)', 'prev2', 'prev1'], rows: [
              ['start', '—', '0', '0'],
              ['2', 'max(0, 0+2) = 2', '0', '2'],
              ['7', 'max(2, 0+7) = 7', '2', '7'],
              ['9', 'max(7, 2+9) = 11', '7', '11'],
              ['3', 'max(11, 7+3) = 11', '11', '11'],
              ['1', 'max(11, 11+1) = 12', '11', '<b>12</b>'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>LC 198 — memo</b>' }, { code: sol(198, 1) },
            { p: '<b>LC 198 — space-opt</b>' }, { code: sol(198, 3) },
            { p: '<b>LC 746 — memo</b>' }, { code: sol(746, 1) },
            { p: '<b>LC 746 — space-opt</b>' }, { code: sol(746, 3) },
            { lines: [
              ['Arrays.fill(memo, -1);', 'Conversion step 1: "not computed" marker.'],
              ['if (memo[i] != -1) return memo[i];', 'Conversion step 2: lookup — base case ke BAAD.'],
              ['memo[i] = Math.max(skip, take);', 'Conversion step 3: save.'],
              ['int prev2 = 0, prev1 = 0;', 'Tabulation ke base cases variables me.'],
              ['prev2 = prev1; prev1 = cur;', 'Window slide — order fixed.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize: tabulation vs space-opt',
          blocks: [
            { list: ['LC 198 Space O(1) tab: dp row sirf "jo values ban chuki" dikhata hai, code sirf last 2 rakhta hai.', 'LC 746 Tabulation vs Space tab — same numbers, alag storage.'] },
            { viz: 198, ex: 1, variant: 1 },
            { viz: 746, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases (conversion bugs)',
          blocks: [
            { table: { head: ['Bug', 'Kya hota hai', 'Fix'], rows: [
              ['Memo lookup base case se pehle', 'memo[-1] → ArrayIndexOutOfBounds', 'Pehle base, phir lookup'],
              ['Memo 0 se fill (LC 746)', 'Har 0-cost state recompute → slow', '-1 se fill'],
              ['dp size n (n+1 nahi)', 'dp[n] out of bounds', 'n + 1'],
              ['prev1 pehle update', 'prev2 = cur → galat', 'prev2 = prev1 pehle'],
              ['n = 1 pe dp[1] = nums[0] ke baad loop', 'Loop nahi chalta — sahi', '—'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['', 'Memo', 'Tabulation', 'Space-opt'], rows: [
              ['Time', 'O(n)', 'O(n)', 'O(n)'],
              ['Space', 'O(n) + O(n) stack', 'O(n)', 'O(1)'],
              ['Stack overflow risk', 'Haan (n ~ 10⁴–10⁵)', 'Nahi', 'Nahi'],
              ['Solution reconstruct', 'Haan', 'Haan', 'Nahi (table gaya)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['DP ke 5 framework sawaal?', 'State, transition, base, order, answer.'],
              ['Recursion → memo me kitni lines badalti hain?', '3: memo array, lookup, save.'],
              ['Memo → tabulation kaise?', 'Base cases → initial cells; recursion ka chhota argument → loop ka shuru; f(x) → dp[x].'],
              ['Space-opt kab possible?', 'Jab dp[i] sirf fixed number of pichli values padhe.'],
              ['Space-opt ka nuksaan?', 'Poora table nahi → solution (kaunse ghar) reconstruct nahi kar sakte.'],
              ['Memo ka stack depth LC 198 me?', 'O(n) — n = 10⁵ pe StackOverflowError possible.'],
              ['Top-down kab better?', 'Jab saare states zaroori na hon — sirf reachable compute hote hain.'],
              ['LC 322 me space-opt kyun nahi?', 'dp[a] koi bhi dp[a − c] padh sakta hai (c bada ho sakta hai) → poora array chahiye.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Memo vs tabulation (1-minute)', 'Memoization is top-down: I write the natural recursion and cache results, so only states actually needed are computed and the code mirrors the recurrence. Its costs are recursion overhead and stack depth. Tabulation is bottom-up: I fill a table in dependency order with loops, which avoids the stack and makes space optimization easy because I can see which previous cells are read. In interviews I derive the memo first, then convert to tabulation for the final answer.'],
              ['4-step conversion explain karo', 'First I write the brute-force recursion from the state and transition. Second, I add a memo array keyed by the state, return early if it is filled, and store before returning. Third, I invert it into a loop, starting from the base cases and filling states in an order where every dependency is ready. Fourth, I look at which cells each step reads; if it is only the last one or two, I replace the array with variables.'],
              ['Follow-up: "Space-opt ke baad answer reconstruct karo"', 'With rolling variables the table is gone, so I cannot backtrack the choices. If reconstruction is required I keep the full O(n) table, or store a small choice array alongside, and walk back from the answer state.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: ['LC 70, 746, 198, 322 ka State/Transition/Base table notebook me banao.', 'LC 198 recursion → memo conversion khud karo (3 lines).', 'LC 746 memo submit karo.', 'Visualizer me LC 198 space tab chalao.', 'Memo vs tabulation 2 fark yaad karo.'] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: ['<b>Task A:</b> LC 70, 746, 198 — charon approaches 25 minute me (speed drill).', '<b>Task B:</b> LC 322 memo bina dekhe, submit.', '<b>Task C:</b> Memo vs tabulation 1-minute recording, sun ke improve karo.', '<b>Task D:</b> LC 198 circular follow-up likho.'] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 198 aur LC 746 ka memo version submit.', 'Kal Saturday revision: LC 70, 198, 322 + LC 39 timer ke saath.', 'Fundamentals tab: Memo vs Tabulation table padho.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Memo ki 3 conversion lines?', 'memo fill, lookup after base, save before return.'],
              ['LC 198 memo[] vs tabulation dp[] ka relation?', 'memo[i] = dp[i + 1] (index shift).'],
              ['Space-opt kab nahi?', 'Jab dp[i] door ke cells padhe (LC 322) ya reconstruction chahiye.'],
              ['Memo ka risk?', 'Deep recursion → StackOverflowError.'],
              ['Framework ke 5 sawaal?', 'State, transition, base, order, answer.'],
            ] },
          ],
        },
      ],
      checks: [
        '4 questions ka State/Transition/Base table banaya',
        'Recursion → memo conversion khud kiya (LC 198)',
        'LC 746 memo Accepted',
        'Memo vs tabulation 3 fark bata sakta/sakti hu',
        'Space-opt kab possible — explain kar sakta/sakti hu',
        'Visualizer me tabulation vs space dekha',
        'Self-test 5/5',
      ],
      memory: 'State → Transition → Base → Order → Answer. Recursion → memo (3 lines) → loop → variables.',
    },

    // =====================================================================
    6: {
      title: 'Revision — Week 1 (1D DP + Coin Change)',
      goal: 'Bina dekhe re-solve: <b>LC 70, 198, 322</b> + Phase 9 ka <b>LC 39</b> (backtracking vs DP ka fark pakka). Timer ke saath.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan',
          blocks: [
            { table: { head: ['Question', 'Sohvi timer', 'Sohel timer', 'Rule'], rows: [
              ['LC 70 Climbing Stairs', '10 min', '5 min', 'Tabulation + space-opt'],
              ['LC 198 House Robber', '15 min', '8 min', 'Memo + space-opt'],
              ['LC 322 Coin Change', '25 min', '12 min', 'Tabulation, −1 case'],
              ['LC 39 Combination Sum', '25 min', '12 min', 'Backtracking — DP se compare'],
            ] } },
            { list: ['Pehle State ek line me <b>bolo</b>, phir code.', 'Notes band. Atak gaye toh 5 min ke baad hint (Last Minute tab).', 'Har solve ke baad visualizer se 1 example verify.'] },
          ],
        },
        {
          title: 'Part 1 — LC 70 Climbing Stairs',
          blocks: [
            { p: '<b>Recap:</b> 1 ya 2 step, top tak kitne tarike. <b>Pattern:</b> Fibonacci DP.' },
            { pre: 'n = 5 → dp = [1, 1, 2, 3, 5, 8] → 8' },
            { code: P.questions[70].approaches[3].code },
            { tip: 'Memory hook: <b>Last jump 1 ya 2 → jodo.</b>' },
            { viz: 70, ex: 2 },
          ],
        },
        {
          title: 'Part 2 — LC 198 House Robber',
          blocks: [
            { p: '<b>Recap:</b> adjacent nahi, max paisa. <b>Pattern:</b> Take / skip.' },
            { pre: '[2,7,9,3,1] → dp = [0, 2, 7, 11, 11, 12] → 12' },
            { code: P.questions[198].approaches[3].code },
            { tip: 'Memory hook: <b>Chhodo (dp[i−1]) ya looto (dp[i−2] + x).</b>' },
            { viz: 198, ex: 2 },
          ],
        },
        {
          title: 'Part 3 — LC 322 Coin Change',
          blocks: [
            { p: '<b>Recap:</b> min coins (unlimited), warna −1. <b>Pattern:</b> Unbounded knapsack (min).' },
            { pre: '[1,2,5], 11 → 3   ·   [2], 3 → −1' },
            { code: P.questions[322].approaches[2].code },
            { tip: 'Memory hook: <b>∞ = amount + 1, bacha toh −1.</b>' },
            { viz: 322, ex: 0 },
          ],
        },
        {
          title: 'Part 4 — LC 39 Combination Sum (Phase 9) — DP ka cousin',
          blocks: [
            { p: '<b>Recap:</b> candidates unlimited, target ke <b>saare</b> combinations list karo. <b>Pattern:</b> Backtracking (same index dobara).' },
            { pre: '[2,3,6,7], 7 → [[2,2,3],[7]]' },
            { code: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> res = new ArrayList<>();
    dfs(candidates, 0, target, new ArrayList<>(), res);
    return res;
}

private void dfs(int[] c, int start, int rem, List<Integer> cur, List<List<Integer>> res) {
    if (rem == 0) { res.add(new ArrayList<>(cur)); return; }
    for (int i = start; i < c.length; i++) {
        if (c[i] > rem) continue;
        cur.add(c[i]);
        dfs(c, i, rem - c[i], cur, res);
        cur.remove(cur.size() - 1);
    }
}` },
            { table: { head: ['', 'LC 39', 'LC 322'], rows: [
              ['Chahiye', 'Saare combinations (list)', 'Sirf min count'],
              ['Technique', 'Backtracking', 'DP'],
              ['Time', 'Exponential (output hi bada)', 'O(amount × coins)'],
            ] } },
            { tip: 'Memory hook: <b>List chahiye → backtrack. Number chahiye → DP.</b>' },
          ],
        },
        {
          title: 'Part 5 — Interview mix',
          blocks: [
            { qa: [
              ['DP ki 2 properties?', 'Optimal substructure + overlapping subproblems.'],
              ['LC 70 me dp[0] = 1 kyun?', 'Ground pe rehne ka 1 tarika; dp[2] = 2 sahi aata hai.'],
              ['LC 198 greedy counter-example?', '[2,1,1,2] → 4.'],
              ['LC 322 me MAX_VALUE kyun nahi?', '+1 pe overflow.'],
              ['LC 39 ko DP se kar sakte?', 'Count (kitne combos) DP se ho jaata — LC 518 jaisa. Lekin list chahiye toh backtracking.'],
              ['Memo me -1 kab, 0 kab?', '0 valid answer ho sakta hai → -1. Warna 0 bhi chalega.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — 1-minute answers: aise bolo',
          blocks: [
            { say: [
              ['DP vs backtracking', 'Backtracking explores every path explicitly, which is needed when I must list all solutions, like all combinations in Combination Sum, and its cost is exponential. DP applies when I only need a number, such as the count or the minimum coins, and subproblems overlap. Then I store each subproblem once, so the work becomes states times work per state.'],
              ['Coin Change in 60 seconds', 'dp[a] is the fewest coins for amount a. dp[0] is zero and the rest start at amount plus one as infinity. For each amount I try every coin not larger than it and relax dp[a] with dp[a − c] + 1. If dp[amount] stays above amount I return −1. O(amount × coins) time, O(amount) space.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: ['LC 70 aur LC 198 bina dekhe, timer ke saath.', 'LC 322 ka dp table amount 0..6, coins [1,3,4] ke liye banao (answer 2).', 'LC 39 ka recursion tree target 7 ke liye half banao.', 'Jo atka, woh notebook me "mistake log" me likho.'] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice) + System Design',
          blocks: [
            { olist: ['<b>Task A:</b> Charon questions 40 minute me total, submit.', '<b>Task B:</b> LC 322 BFS version likho.', '<b>Task C:</b> LC 39 ko count karne wala DP version banao (target 7 → 2).', '<b>System Design session (1/week):</b> "Design a rate limiter" — token bucket vs sliding window, Redis counters, distributed consistency. 45 min, diagram + trade-offs.'] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: ['Mistake log update.', 'Kal Sunday mock: Sohvi ko LC 746 dena, Sohel ko LC 322.', 'Contest: Sunday 8:00 AM IST.'] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['n = 7 → LC 70?', '21.'],
              ['[1,2,3,1] → LC 198?', '4.'],
              ['[1,3,4], 6 → LC 322?', '2.'],
              ['LC 39 me dfs(c, i, …) — i kyun, i+1 kyun nahi?', 'Same number dobara use ho sakta hai.'],
              ['LC 322 ka time?', 'O(amount × coins).'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 70 timer me solve',
        'LC 198 timer me solve',
        'LC 322 timer me solve (−1 case sahi)',
        'LC 39 re-solve aur DP se fark bataya',
        'Mistake log update kiya',
        'Sohel: System Design session kiya',
      ],
      memory: 'List chahiye → backtracking; number chahiye + repeat → DP.',
    },

    // =====================================================================
    7: {
      title: 'Mock Interview + Contest',
      goal: 'Real interview jaisa: <b>Tum → Sohvi</b> (LC 746), <b>Sohvi → Tum</b> (LC 322). Phir LeetCode Weekly Contest discussion.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Mock format (30 + 30 + 30 min)',
          blocks: [
            { table: { head: ['Slot', 'Kya', 'Kaun'], rows: [
              ['30 min', 'Mock 1: LC 746', 'Tum interviewer, Sohvi candidate'],
              ['30 min', 'Mock 2: LC 322', 'Sohvi interviewer, Tum candidate'],
              ['30 min', 'Weekly Contest discussion', 'Dono'],
            ] } },
            { list: ['Candidate notes/visualizer nahi dekhega.', 'Interviewer sirf hints ladder se help karega.', 'End me rubric se score (1–4).'] },
          ],
        },
        {
          title: 'Part 1 — Mock Q1 (Tum → Sohvi): LC 746 Min Cost Climbing Stairs',
          blocks: [
            { problem: 746 },
            { p: '<b>Kya poochna hai:</b> top kaunsa index? state kya hai? brute ki complexity? space kam karo.' },
            { olist: ['Hint 1: "Top pe aakhri step kahan se aaya hoga?"', 'Hint 2: "dp[i] = step i tak pahunchne ka min cost — socho."', 'Hint 3: "dp[0] aur dp[1] kitne honge?"', 'Hint 4: "Sirf 2 pichli values chahiye?"'] },
            { table: { head: ['Rubric', 'Kya dekhna', 'Score'], rows: [
              ['Clarify', 'Top = index n, start 0/1 free poocha?', '1–4'],
              ['Brute', 'Recursion + O(2^n) bataya?', '1–4'],
              ['Optimal', 'dp transition + O(n)', '1–4'],
              ['Code', 'Clean, bina bug', '1–4'],
              ['Test', 'Example 1 ka dry run', '1–4'],
              ['Communication', 'Bolte hue socha?', '1–4'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Mock Q2 (Sohvi → Tum): LC 322 Coin Change',
          blocks: [
            { problem: 322 },
            { p: '<b>Kya poochna hai:</b> greedy kyun nahi? infinity kya? −1 kab? coins bhi return karo (follow-up).' },
            { olist: ['Hint 1: "Bada coin pehle — [1,3,4], 6 pe try karo."', 'Hint 2: "Aakhri coin c tha toh baaki amount?"', 'Hint 3: "Impossible ko kaise represent karoge?"'] },
            { table: { head: ['Rubric', 'Kya dekhna', 'Score'], rows: [
              ['Clarify', 'amount = 0? coins unlimited?', '1–4'],
              ['Brute', 'Recursion, exponential', '1–4'],
              ['Optimal', 'dp[a] = min(dp[a − c] + 1), ∞ = amount + 1', '1–4'],
              ['Code', '10 min me, overflow-safe', '1–4'],
              ['Test', '[2], 3 → −1 dikhaya', '1–4'],
              ['Communication', 'Greedy counter-example khud diya', '1–4'],
            ] } },
          ],
        },
        {
          title: 'Part 3 — Interview communication checklist (DP)',
          blocks: [
            { olist: ['Brute recursion bolo aur repeated subproblem point karo.', 'State ek sentence me.', 'Transition + base case.', 'Fill order + answer cell.', 'Complexity = states × kaam.', 'Code → dry run (table bolte hue bharo).', 'Space-opt offer karo.'] },
          ],
        },
        {
          title: 'Part 4 — LeetCode Weekly Contest plan + discussion template',
          blocks: [
            { list: ['Sunday 8:00 AM IST — dono participate.', 'Q1, Q2 pe focus (Sohvi: Q1, Sohel: Q1–Q3).', 'Koi DP-type question dikhe toh state likh ke try karo.'] },
            { table: { head: ['Discussion', 'Note'], rows: [
              ['Kaunse solve hue / time', ''],
              ['Kaunsa pattern tha', ''],
              ['Kahan atke', ''],
              ['Editorial se kya naya seekha', ''],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Interview mix',
          blocks: [
            { qa: [
              ['DP solution explain karne ka script?', 'Brute → repeat → state → transition/base → order → complexity → code → dry run → space-opt.'],
              ['LC 746 me top?', 'Index n.'],
              ['LC 322 greedy fail example?', '[1,3,4], 6.'],
              ['Count vs min DP me kya badalta?', '+ vs min.'],
              ['Memo ka stack risk kab?', 'Bada n (10⁴+).'],
            ] },
          ],
        },
        {
          title: 'Part 6 — 1-minute answers: aise bolo',
          blocks: [
            { say: [
              ['DP solution clearly explain karna', 'I follow a fixed script. First I state the brute-force recursion and point out the repeated subproblems. Then I define the state in one sentence, give the transition and base case, and say the fill order. I mention complexity as number of states times work per state, code the tabulation, dry-run a small example by filling the table aloud, and finally offer the space optimization.'],
              ['Mock feedback dena', 'I start with what went well, then give one or two specific improvements with an example from the session, such as clarifying constraints earlier or testing the impossible case. I end with a concrete practice task so the feedback turns into action.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: ['Mock 1 candidate bano (LC 746).', 'Mock 2 me interviewer bano — rubric bharo.', 'Contest Q1 try karo.', 'Feedback notebook me likho.'] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: ['<b>Task A:</b> Mock 2 me 25 min ke andar code + test.', '<b>Task B:</b> Follow-up "coins return karo" live code.', '<b>Task C:</b> Contest Q1–Q3, upsolve jo reh gaya.', '<b>Task D:</b> Sohvi ko 2 specific feedback points.'] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: ['Contest ka ek unsolved question upsolve.', 'Kal LC 518 Coin Change II — LC 322 se kya fark hai socho (min vs count).'] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Week 1 ke 4 DP questions aur unke patterns?', '70 Fibonacci, 746 min Fibonacci, 198 take/skip, 322 unbounded knapsack min.'],
              ['LC 746 transition?', 'min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2]).'],
              ['LC 322 impossible check?', 'dp[amount] > amount.'],
              ['Mock rubric ke 6 points?', 'Clarify, Brute, Optimal, Code, Test, Communication.'],
              ['Contest kab?', 'Sunday 8:00 AM IST.'],
            ] },
          ],
        },
      ],
      checks: [
        'Mock 1 (LC 746) complete — rubric bhara',
        'Mock 2 (LC 322) complete — rubric bhara',
        'Weekly Contest diya',
        'Contest discussion template bhara',
        'Ek question upsolve kiya',
      ],
      memory: 'Script: brute → repeat → state → transition → base → order → code → dry run → space-opt.',
    },
  });
})();
