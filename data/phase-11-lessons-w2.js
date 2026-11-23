// Phase 11 (Dynamic Programming) — Week 2 lessons (local days 8–14). Day-1 format.
(function () {
  const P = window.PHASE_CONTENT['dp'];
  P.lessons = P.lessons || {};
  // Question ka approach code → LeetCode jaisa "class Solution { ... }"
  const sol = (n, k) => 'class Solution {\n' + P.questions[n].approaches[k].code.split('\n').map(l => (l ? '    ' + l : l)).join('\n') + '\n}';

  Object.assign(P.lessons, {
    // =====================================================================
    8: {
      title: 'Knapsack (count) — Coin Change II',
      goal: 'LC 322 (min coins) se LC 518 (<b>kitne combinations</b>) tak. <code>dp[0] = 1</code> ka matlab, aur sabse important: <b>loop order</b> — coin bahar = combinations, amount bahar = permutations. 2D table se 1D tak.',
      main: 518,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 322, LC 20, LC 141',
          blocks: [
            { h: '1) LC 322 Coin Change (Week 21)' },
            { p: '<b>Problem:</b> min coins (unlimited), warna −1.' },
            { pre: '[1,2,5], 11 → 3' },
            { p: '<b>Pattern:</b> Unbounded knapsack (min).' },
            { olist: ['∞ = amount + 1, dp[0] = 0.', 'Har a, har c ≤ a: min(dp[a − c] + 1).', 'dp[amount] > amount → −1.'] },
            { code: `Arrays.fill(dp, amount + 1);
dp[0] = 0;
for (int a = 1; a <= amount; a++)
    for (int c : coins)
        if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
return dp[amount] > amount ? -1 : dp[amount];` },
            { tip: 'Memory hook: <b>Min → ∞ se shuru. Count → 0 se shuru, dp[0] = 1.</b>' },
            { h: '2) LC 20 Valid Parentheses (Phase 5)' },
            { p: '<b>Problem:</b> brackets sahi order me band hue?' },
            { pre: '"()[]{}" → true   ·   "(]" → false' },
            { p: '<b>Pattern:</b> Stack — opening pe expected closing push.' },
            { olist: ['Opening → uska closing push.', 'Closing → stack empty ya pop != ch → false.', 'End me stack empty?'] },
            { code: `public boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char ch : s.toCharArray()) {
        if (ch == '(') st.push(')');
        else if (ch == '{') st.push('}');
        else if (ch == '[') st.push(']');
        else if (st.isEmpty() || st.pop() != ch) return false;
    }
    return st.isEmpty();
}` },
            { tip: 'Memory hook: <b>Expected closing push karo.</b>' },
            { h: '3) LC 141 Linked List Cycle (Phase 4)' },
            { p: '<b>Problem:</b> list me cycle hai?' },
            { pre: '3 → 2 → 0 → −4 → (back to 2) → true' },
            { p: '<b>Pattern:</b> Floyd slow / fast.' },
            { olist: ['slow 1 step, fast 2 step.', 'Mile → cycle.', 'fast null → no cycle.'] },
            { code: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}` },
            { tip: 'Memory hook: <b>Tortoise &amp; hare — circle me milenge.</b>' },
          ],
        },
        {
          title: 'Part 1 — Concept: Combinations vs Permutations (loop order)',
          blocks: [
            { p: 'amount 3, coins [1, 2]. Combinations: {1+1+1}, {1+2} = <b>2</b>. Permutations: 1+1+1, 1+2, 2+1 = <b>3</b>. LC 518 <b>combinations</b> maangta hai.' },
            { table: { head: ['Loop order', 'Kya ginta hai', 'amount 3, [1,2]'], rows: [
              ['<b>Coin bahar</b>, amount andar', 'Combinations — coins ek fixed order me hi aate hain', '2 ✓'],
              ['Amount bahar, coin andar', 'Permutations — har amount pe har coin "aakhri" ho sakta hai', '3 ✗'],
            ] } },
            { pre: `Coin bahar:
  coin 1 pass: dp = [1, 1, 1, 1]    (sirf 1s se)
  coin 2 pass: dp = [1, 1, 2, 2]    (1s, phir 2s) → dp[3] = 2  ✓

Amount bahar:
  dp[1] = dp[0]           = 1
  dp[2] = dp[1] + dp[0]   = 2
  dp[3] = dp[2] + dp[1]   = 3   ← "1+2" aur "2+1" dono gin liye ✗` },
            { p: '<b>dp[0] = 1 kyun?</b> Amount 0 banane ka ek tarika: koi coin mat lo. Isi se dp[c] = 1 (sirf coin c) aata hai.' },
            { p: '<b>2D view:</b> dp[i][a] = pehle i coins se amount a. <code>dp[i][a] = dp[i−1][a] (coin nahi liya) + dp[i][a − coin] (liya, same row → dobara bhi)</code>. 1D me row overwrite karte hain — left se right, taaki dp[a − c] already "is coin wala" ho (unbounded).' },
            { tip: '0/1 knapsack (ek baar) me inner loop <b>right → left</b> chalta. Unbounded me <b>left → right</b>.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 518 Coin Change II', blocks: [{ problem: 518 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute:</b> <code>ways(i, rem)</code>: coin i lo (i pe hi raho) + coin i chhodo (i + 1). Coins ka order fixed → har combination ek baar. Exponential.' },
            { p: '<b>Better (memo):</b> states (i, rem) → memo[i][rem], -1 fill (0 valid count).' },
            { p: '<b>Optimal (2D):</b> dp[i][a] table, row = coins allowed.' },
            { p: '<b>Optimal (1D):</b> dp[a], coin loop bahar, amount c → amount.' },
            { olist: ['State: dp[a] = amount a ke combinations.', 'Base: dp[0] = 1.', 'Transition: dp[a] += dp[a − c].', 'Order: coin bahar (combinations), a ascending (unbounded).', 'Answer: dp[amount].'] },
            { tip: 'LC 322 vs 518: <b>min + ∞ + dp[0]=0</b> vs <b>sum + 0 + dp[0]=1</b>.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: amount = 5, coins = [1, 2, 5]',
          blocks: [
            { p: '<b>1D</b> — har coin pass ke baad dp:' },
            { table: { head: ['Pass', 'a=0', 'a=1', 'a=2', 'a=3', 'a=4', 'a=5'], rows: [
              ['init', '1', '0', '0', '0', '0', '0'],
              ['coin 1', '1', '1', '1', '1', '1', '1'],
              ['coin 2', '1', '1', '<b>2</b>', '<b>2</b>', '<b>3</b>', '<b>3</b>'],
              ['coin 5', '1', '1', '2', '2', '3', '<b>4</b>'],
            ] } },
            { p: 'coin 2 pass: dp[2] = 1 + dp[0] = 2, dp[3] = 1 + dp[1] = 2, dp[4] = 1 + dp[2] = 3, dp[5] = 1 + dp[3] = 3. coin 5: dp[5] = 3 + dp[0] = 4 ✓' },
            { p: '<b>2D table</b> dp[i][a] bilkul upar wali rows hai — row i = "coin i pass ke baad".' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' }, { code: sol(518, 0) },
            { p: '<b>Better — memo</b>' }, { code: sol(518, 1) },
            { p: '<b>Optimal — 2D</b>' }, { code: sol(518, 2) },
            { p: '<b>Optimal — 1D</b>' }, { code: sol(518, 3) },
            { lines: [
              ['if (rem == 0) return 1;', 'Ek valid combination mil gaya.'],
              ['return ways(coins, i, rem - coins[i]) + ways(coins, i + 1, rem);', 'Lo (i same) + chhodo (i + 1) — order fixed, duplicates nahi.'],
              ['for (int i = 0; i <= n; i++) dp[i][0] = 1;', 'Har row me amount 0 = 1 tarika.'],
              ['dp[i][a] = dp[i - 1][a];', 'Coin nahi liya → upar wali row.'],
              ['dp[i][a] += dp[i][a - coins[i - 1]];', 'Liya → SAME row (dobara le sakte).'],
              ['dp[0] = 1;', '1D base.'],
              ['for (int c : coins)', 'Coin BAHAR → combinations.'],
              ['for (int a = c; a <= amount; a++)', 'c se start (chhote amounts pe coin fit nahi), ascending = unbounded.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['1D: har coin pass me poori row update hoti hai — <span class="lg win">dp[a − c]</span> padha, <span class="lg new">dp[a]</span> likha.', '2D tab: row i = coin i allowed; upar (nahi liya) + left same row (liya).', 'Example 2 me sab 0 reh jaata hai.'] },
            { viz: 518, ex: 0 },
            { viz: 518, ex: 0, variant: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['amount 0, [7]', '1', 'dp[0] = 1 — empty combination'],
              ['amount 3, [2]', '0', 'Odd'],
              ['amount 10, [10]', '1', 'Ek coin'],
              ['amount 4, [1,2,3]', '4', '1111, 112, 22, 13'],
              ['amount 100, [1,2,5]', '541', 'Bada — brute slow'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Recursion', 'Exponential', 'O(amount) stack'],
              ['Memo', 'O(n × amount)', 'O(n × amount)'],
              ['2D', 'O(n × amount)', 'O(n × amount)'],
              ['1D', 'O(n × amount)', 'O(amount)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['dp[0] = 1 kyun?', 'Amount 0 = koi coin mat lo = 1 tarika; isi se baaki counts bante hain.'],
              ['Loops ulte kiye toh?', 'Permutations gin loge (1+2 aur 2+1 alag).'],
              ['Inner loop a = c se kyun?', 'a < c pe coin fit nahi hota, dp[a − c] negative index.'],
              ['Ascending a kyun?', 'Same coin dobara use ho — unbounded. Descending = har coin ek baar (0/1).'],
              ['LC 322 se 3 fark?', 'sum vs min, dp[0]=1 vs 0, baaki 0 vs ∞.'],
              ['2D me "liya" wala same row kyun?', 'Coin lene ke baad bhi wahi coin allowed hai.'],
              ['Memo -1 se kyun?', '0 ways valid answer hai.'],
              ['Overflow?', 'Problem guarantee: answer int me fit. Intermediate values bhi isi order me safe rehti hain.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'This is an unbounded knapsack that counts combinations. dp[a] is the number of ways to make amount a, and dp[0] is one, the empty choice. I loop over coins outside and amounts from the coin value upward inside, adding dp[a − c] to dp[a]. Coins outside means each combination is built in a fixed coin order, so it is counted once; ascending amounts let a coin be reused. O(n × amount) time and O(amount) space.'],
              ['Follow-up: "Loop swap karoge toh?"', 'With amounts outside, every amount considers every coin as the last coin, so sequences like one plus two and two plus one are counted separately. That counts permutations, which is a different problem.'],
              ['Follow-up: "Har coin sirf ek baar"', 'That becomes a 0/1 knapsack. I keep the coin loop outside but run the amount loop downward, from amount to c, so dp[a − c] still refers to the state before this coin was considered and each coin is used at most once.'],
              ['1-minute: Loop order kyun matter karta hai', 'With coins in the outer loop, by the time I process a coin, dp only holds ways built from earlier coins, so each combination appears in one fixed order and is counted exactly once. With amounts outside, each amount tries every coin as the last one, which counts orderings as different.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: ['amount 3, [1,2] ke combinations aur permutations dono haath se likho.', '1D code bina dekhe likho + submit.', 'Part 4 table khud bharo.', 'Visualizer 1D aur 2D dono.', 'LC 322 vs 518 table notebook me.'] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: ['<b>Task A:</b> Memo + 1D 12 minute me.', '<b>Task B:</b> Loops swap karke amount 3, [1,2] pe chalao — 3 aata hai, explain.', '<b>Task C:</b> 0/1 version (descending) likho.', '<b>Task D:</b> Part 10 1-minute.'] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 518 1D submit.', 'LC 322 dobara (5 min).', 'Kal LC 300 LIS — "subsequence" ka matlab revise karo.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['amount 5, [1,2,5] → ?', '4.'],
              ['Coin bahar = ?', 'Combinations.'],
              ['dp[0] = ?', '1.'],
              ['Inner loop direction?', 'Ascending (c → amount) — unbounded.'],
              ['Space?', 'O(amount).'],
            ] },
          ],
        },
      ],
      checks: [
        'Combinations vs permutations ka fark samjha',
        'dp[0] = 1 explain kar sakta/sakti hu',
        '1D code Accepted',
        'Part 4 table khud bhara',
        '2D version samjha (Sohel: likha)',
        'Visualizer 1D + 2D dekhe',
        'Self-test 5/5',
      ],
      memory: 'Coin bahar, amount andar (ascending): dp[a] += dp[a − c]; dp[0] = 1.',
    },

    // =====================================================================
    9: {
      title: 'LIS — "ending at i" DP',
      goal: '<b>Subsequence DP</b>: state "index i pe khatam" kyun chahiye, O(n²) double loop, aur answer <code>max(dp)</code> (dp[n−1] nahi).',
      main: 300,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 518, LC 875, LC 128',
          blocks: [
            { h: '1) LC 518 Coin Change II (kal)' },
            { p: '<b>Problem:</b> amount ke combinations.' },
            { pre: 'amount 5, [1,2,5] → 4' },
            { p: '<b>Pattern:</b> Unbounded knapsack (count).' },
            { olist: ['dp[0] = 1.', 'Coin bahar.', 'a = c..amount: dp[a] += dp[a − c].'] },
            { code: `int[] dp = new int[amount + 1];
dp[0] = 1;
for (int c : coins)
    for (int a = c; a <= amount; a++)
        dp[a] += dp[a - c];
return dp[amount];` },
            { tip: 'Memory hook: <b>Coin bahar = combinations.</b>' },
            { h: '2) LC 875 Koko Eating Bananas (Phase 6)' },
            { p: '<b>Problem:</b> min speed k jisse h ghante me saare kele.' },
            { pre: 'piles [3,6,7,11], h = 8 → 4' },
            { p: '<b>Pattern:</b> Binary search on answer.' },
            { olist: ['lo = 1, hi = max pile.', 'hours(k) = Σ ceil(p / k).', 'hours ≤ h → hi = k, warna lo = k + 1.'] },
            { code: `public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = 0;
    for (int p : piles) hi = Math.max(hi, p);
    while (lo < hi) {
        int k = lo + (hi - lo) / 2;
        long hours = 0;
        for (int p : piles) hours += (p + k - 1) / k;
        if (hours <= h) hi = k;
        else lo = k + 1;
    }
    return lo;
}` },
            { tip: 'Memory hook: <b>lo &lt; hi + hi = mid → lower bound.</b> Yahi template LIS ke O(n log n) me lagega (Day 12).' },
            { h: '3) LC 128 Longest Consecutive Sequence (Phase 1)' },
            { p: '<b>Problem:</b> sabse lambi consecutive values ki sequence (order kuch bhi).' },
            { pre: '[100,4,200,1,3,2] → 4 (1,2,3,4)' },
            { p: '<b>Pattern:</b> HashSet, sirf start se count.' },
            { olist: ['Sab set me.', 'x − 1 set me nahi → x start.', 'x+1, x+2… gino.'] },
            { code: `Set<Integer> set = new HashSet<>();
for (int x : nums) set.add(x);
int best = 0;
for (int x : set) {
    if (!set.contains(x - 1)) {
        int len = 1;
        while (set.contains(x + len)) len++;
        best = Math.max(best, len);
    }
}
return best;` },
            { tip: 'Memory hook: <b>Consecutive VALUES (order free) ≠ Increasing SUBSEQUENCE (order fixed).</b> Aaj ka fark yahi.' },
          ],
        },
        {
          title: 'Part 1 — Concept: Subsequence DP aur "ending at i" state',
          blocks: [
            { p: '<b>Subsequence</b> = kuch elements hatao, order same. <code>[2,3,7,101]</code> is a subsequence of <code>[10,9,2,5,3,7,101,18]</code>.' },
            { p: 'Kisi subsequence ko <b>extend</b> karne ke liye uska <b>last element</b> pata hona chahiye (next usse bada ho). Isliye state:' },
            { pre: `dp[i] = sabse lambi increasing subsequence jo EXACTLY index i pe khatam ho

dp[i] = 1 + max( dp[j] )  for all j < i with nums[j] < nums[i]
        (koi aisa j nahi → dp[i] = 1)

answer = max(dp[0..n-1])` },
            { table: { head: ['State idea', 'Problem'], rows: [
              ['"Pehle i elements me best"', 'Last element nahi pata → extend nahi kar sakte ✗'],
              ['"i pe khatam" (aaj)', 'Last = nums[i] pata ✓, lekin answer = max(dp)'],
            ] } },
            { tip: 'Kadane (LC 53) me bhi "i pe khatam" state thi — wahan sirf j = i−1 dekhna tha, yahan saare j < i.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 300 Longest Increasing Subsequence', blocks: [{ problem: 300 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute:</b> take/skip recursion with <code>prev</code> index: nums[i] > nums[prev] ho toh le sakte. O(2^n).' },
            { p: '<b>Better (memo):</b> state (i, prev) → memo[i][prev + 1] (prev = −1 shift). O(n²) time + space.' },
            { p: '<b>Better (tabulation O(n²)):</b> dp[i] "ending at i", double loop. Space O(n). Interview me pehle yahi likho.' },
            { p: '<b>Optimal (O(n log n)):</b> tails + binary search — Day 12 me detail.' },
            { olist: ['dp[i] = 1 se start.', 'Har j < i: nums[j] < nums[i] → dp[i] = max(dp[i], dp[j] + 1).', 'best = max(best, dp[i]).', 'return best.'] },
            { tip: 'Strictly increasing → <code>&lt;</code>, <code>&lt;=</code> nahi. [7,7,7] → 1.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: [10, 9, 2, 5, 3, 7, 101, 18]',
          blocks: [
            { table: { head: ['i', 'nums[i]', 'j jo chhote hain (dp[j])', 'dp[i]', 'best'], rows: [
              ['0', '10', '—', '1', '1'],
              ['1', '9', '—', '1', '1'],
              ['2', '2', '—', '1', '1'],
              ['3', '5', 'j=2 (1)', '2', '2'],
              ['4', '3', 'j=2 (1)', '2', '2'],
              ['5', '7', 'j=2 (1), j=3 (2), j=4 (2)', '3', '3'],
              ['6', '101', 'j=0..5 (max 3)', '4', '4'],
              ['7', '18', 'j=0..5 (max 3)', '4', '<b>4</b>'],
            ] } },
            { pre: 'dp = [1, 1, 1, 2, 2, 3, 4, 4]  → max = 4' },
            { p: 'Example 2 <code>[0,1,0,3,2,3]</code> → dp = [1, 2, 1, 3, 3, 4] → 4.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' }, { code: sol(300, 0) },
            { p: '<b>Better — memo</b>' }, { code: sol(300, 1) },
            { p: '<b>Better — tabulation O(n²)</b>' }, { code: sol(300, 2) },
            { lines: [
              ['private int lis(int[] nums, int i, int prev)', 'prev = last liya hua index (−1 = abhi kuch nahi).'],
              ['if (prev == -1 || nums[i] > nums[prev])', 'Lene ki shart: strictly bada.'],
              ['memo[i][prev + 1]', 'prev = −1 ko column 0 pe shift.'],
              ['int n = nums.length, best = 1;', 'n ≥ 1, toh LIS kam se kam 1.'],
              ['dp[i] = 1;', 'Akela nums[i].'],
              ['if (nums[j] < nums[i])', 'j wali sequence ke baad nums[i] lag sakta hai.'],
              ['dp[i] = Math.max(dp[i], dp[j] + 1);', 'Best extend.'],
              ['best = Math.max(best, dp[i]);', 'Answer kisi bhi i pe khatam ho sakta hai.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['Table me 2 rows: <b>nums</b> aur <b>dp</b>.', 'Har (i, j) pe: <span class="lg win">j</span> chhota → extend, <span class="lg skip">skip</span> → nahi.', 'End me jitne dp cells = best woh <span class="lg found">found</span>.'] },
            { viz: 300, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[5]</code>', '1', 'Ek element'],
              ['<code>[7,7,7,7]</code>', '1', 'Strictly'],
              ['<code>[5,4,3,2,1]</code>', '1', 'Decreasing'],
              ['<code>[1,2,3,4,5]</code>', '5', 'Poora array'],
              ['<code>[4,10,4,3,8,9]</code>', '3', '4, 8, 9 — answer dp[n−1] pe nahi bhi ho sakta'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Recursion', 'O(2^n)', 'O(n)'],
              ['Memo (i, prev)', 'O(n²)', 'O(n²)'],
              ['Tabulation', 'O(n²)', 'O(n)'],
              ['tails + BS', 'O(n log n)', 'O(n)'],
            ] } },
            { p: 'n = 2500 → n² = 6.25 × 10⁶, chal jaata hai. n = 10⁵ hota toh O(n log n) zaroori.' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['State "ending at i" kyun?', 'Extend karne ke liye last element chahiye.'],
              ['Answer dp[n−1] kyun nahi?', 'LIS kisi bhi index pe khatam ho sakti hai — max(dp).'],
              ['< ya <=?', '< (strictly increasing).'],
              ['Memo state kya hai?', '(i, prev) → n × (n+1).'],
              ['Asli LIS print kaise?', 'parent[i] = jis j se best mila; max wale i se peeche chalo.'],
              ['Count of LIS kaise (idea)?', 'cnt[i] saath rakho: dp[j]+1 > dp[i] → cnt[i] = cnt[j]; barabar → cnt[i] += cnt[j].'],
              ['Subarray vs subsequence?', 'Subarray continuous; subsequence sirf order same.'],
              ['O(n²) se better?', 'tails + binary search O(n log n).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'Let dp[i] be the length of the longest increasing subsequence that ends exactly at index i. Every dp[i] starts at one, and for each earlier j with a smaller value I can append nums[i] to that subsequence, so dp[i] = max(dp[i], dp[j] + 1). The answer is the maximum over all dp values, because the best subsequence can end anywhere. That is O(n²) time and O(n) space, and I can mention an O(n log n) improvement with binary search.'],
              ['Follow-up: "Actual subsequence return karo"', 'Alongside dp I store a parent index for each i, the j that gave the best extension. After the loops I start from an index with the maximum dp and follow parents backwards, then reverse the collected values.'],
              ['1-minute: "ending at i" state kyun', 'To extend a subsequence I need its last element, because the next one must be larger. If dp[i] is the longest increasing subsequence ending at index i, the transition is clean: look at every earlier smaller element and extend it. The trade-off is that the answer is the maximum over all dp, not the last cell.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: ['[10,9,2,5,3,7,101,18] me 2 alag LIS haath se dhundo.', 'Tabulation code bina dekhe + submit.', 'Example 2 ka dp table khud bharo.', 'Visualizer Example 1.', 'Subarray vs subsequence vs subset — 1-1 example.'] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: ['<b>Task A:</b> Memo + tabulation 15 min.', '<b>Task B:</b> parent[] se actual LIS print karo.', '<b>Task C:</b> tails approach pehle se padh ke try karo (Day 12 preview).', '<b>Task D:</b> Part 10 approach 60 sec.'] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 300 tabulation submit.', 'LC 518 dobara (5 min).', 'Kal LC 1143 LCS — pehli 2D DP. Do strings ka grid paper pe banao.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[0,1,0,3,2,3] → ?', '4.'],
              ['dp[i] ka matlab?', 'i pe khatam LIS.'],
              ['Answer kahan se?', 'max(dp).'],
              ['Transition?', 'dp[i] = max(dp[i], dp[j] + 1) for j < i, nums[j] < nums[i].'],
              ['Time?', 'O(n²).'],
            ] },
          ],
        },
      ],
      checks: [
        '"Ending at i" state ka reason samjha',
        'Tabulation Accepted',
        'Example 1 aur 2 ka dp table khud bhara',
        'max(dp) vs dp[n−1] fark bataya',
        'Memo (i, prev) version (Sohel: must)',
        'Visualizer dekha',
        'Self-test 5/5',
      ],
      memory: 'dp[i] = 1 + max dp[j] (j < i, chhota); answer max(dp).',
    },

    // =====================================================================
    10: {
      title: '2D DP — Longest Common Subsequence',
      goal: 'Pehli <b>2D DP</b>: do strings ka grid. Row 0 / col 0 = empty string. <b>Match → diagonal + 1</b>, <b>mismatch → max(upar, left)</b>. Phir 2 rows me space-opt.',
      main: 1143,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 300, LC 3, LC 207',
          blocks: [
            { h: '1) LC 300 LIS (kal)' },
            { p: '<b>Problem:</b> longest strictly increasing subsequence.' },
            { pre: '[10,9,2,5,3,7,101,18] → 4' },
            { p: '<b>Pattern:</b> "ending at i" DP.' },
            { olist: ['dp[i] = 1.', 'j < i, chhota → dp[j] + 1.', 'max(dp).'] },
            { code: `for (int i = 0; i < n; i++) {
    dp[i] = 1;
    for (int j = 0; j < i; j++)
        if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    best = Math.max(best, dp[i]);
}` },
            { tip: 'Memory hook: <b>Answer max(dp).</b>' },
            { h: '2) LC 3 Longest Substring Without Repeating Characters (Phase 3)' },
            { p: '<b>Problem:</b> bina repeat wala sabse lamba <b>substring</b> (continuous).' },
            { pre: '"abcabcbb" → 3 ("abc")' },
            { p: '<b>Pattern:</b> Variable sliding window + last index map.' },
            { olist: ['right badhao.', 'ch window me pehle tha → left = last[ch] + 1.', 'best = right − left + 1.'] },
            { code: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> last = new HashMap<>();
    int best = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char ch = s.charAt(right);
        if (last.containsKey(ch) && last.get(ch) >= left) left = last.get(ch) + 1;
        last.put(ch, right);
        best = Math.max(best, right - left + 1);
    }
    return best;
}` },
            { tip: 'Memory hook: <b>Substring (continuous) → window. Subsequence (gaps ok) → DP.</b>' },
            { h: '3) LC 207 Course Schedule (Phase 10)' },
            { p: '<b>Problem:</b> prerequisites me cycle hai? (sab courses ho sakte?)' },
            { pre: 'n = 2, [[1,0]] → true   ·   [[1,0],[0,1]] → false' },
            { p: '<b>Pattern:</b> Kahn topological sort (indegree BFS).' },
            { olist: ['indegree gino.', 'indegree 0 queue me.', 'Pop → neighbors indegree−−; done == n?'] },
            { code: `Queue<Integer> q = new ArrayDeque<>();
for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.offer(i);
int done = 0;
while (!q.isEmpty()) {
    int u = q.poll();
    done++;
    for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);
}
return done == numCourses;` },
            { tip: 'Memory hook: <b>DP table ka fill order bhi ek topo order hai — dependencies pehle.</b>' },
          ],
        },
        {
          title: 'Part 1 — Concept: 2D DP grid',
          blocks: [
            { p: 'Do strings → do index → <b>2D state</b>. <code>dp[i][j]</code> = text1 ke <b>pehle i</b> aur text2 ke <b>pehle j</b> characters ka LCS. Extra row/col 0 = empty string → sab 0 (base case free me).' },
            { pre: `            ""  a   c   e        (text2, j →)
        ""   0   0   0   0
        a    0   ↖+1
        b    0
        c    0        ↖+1          match → diagonal + 1
        d    0                     mismatch → max(↑, ←)
        e    0            ↖+1
(text1, i ↓)` },
            { table: { head: ['Case', 'Matlab', 'Formula'], rows: [
              ['text1[i−1] == text2[j−1]', 'Dono last chars LCS me jaayenge', 'dp[i−1][j−1] + 1'],
              ['Mismatch', 'Ek ka last char hatao — dono try', 'max(dp[i−1][j], dp[i][j−1])'],
            ] } },
            { p: '<b>Fill order:</b> row by row, left → right — upar, left, diagonal teeno pehle ban chuke.' },
            { tip: 'Index shift: dp me i, string me <code>i − 1</code>. Ye "+1 size" trick base case ko free bana deti hai.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 1143 Longest Common Subsequence', blocks: [{ problem: 1143 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute:</b> lcs(i, j) from start: match → 1 + lcs(i+1, j+1); warna max(lcs(i+1, j), lcs(i, j+1)). O(2^(m+n)).' },
            { p: '<b>Better (memo):</b> sirf m × n alag (i, j) → memo[i][j].' },
            { p: '<b>Optimal (tabulation):</b> (m+1) × (n+1) grid, prefix form.' },
            { p: '<b>Optimal (space):</b> row i sirf row i−1 padhti hai → prev[] + cur[].' },
            { olist: ['State: dp[i][j] = prefixes ka LCS.', 'Base: row 0, col 0 = 0.', 'Transition: match diag+1, warna max(upar, left).', 'Order: i 1..m, j 1..n.', 'Answer: dp[m][n].'] },
          ],
        },
        {
          title: 'Part 4 — Dry run: text1 = "abcde", text2 = "ace"',
          blocks: [
            { table: { head: ['', '""', 'a', 'c', 'e'], rows: [
              ['""', '0', '0', '0', '0'],
              ['a', '0', '<b>1</b> ↖', '1', '1'],
              ['b', '0', '1', '1', '1'],
              ['c', '0', '1', '<b>2</b> ↖', '2'],
              ['d', '0', '1', '2', '2'],
              ['e', '0', '1', '2', '<b>3</b> ↖'],
            ] } },
            { p: 'Bold = match cells (diagonal + 1). Baaki = max(upar, left). <code>dp[5][3] = 3</code> ✓' },
            { p: '<b>Space-opt:</b> har row ke baad <code>prev</code> = woh row. Last prev = [0, 1, 2, 3] → prev[3] = 3.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' }, { code: sol(1143, 0) },
            { p: '<b>Better — memo</b>' }, { code: sol(1143, 1) },
            { p: '<b>Optimal — 2D tabulation</b>' }, { code: sol(1143, 2) },
            { p: '<b>Optimal — 2 rows</b>' }, { code: sol(1143, 3) },
            { lines: [
              ['if (i == a.length() || j == b.length()) return 0;', 'Koi string khatam → common kuch nahi.'],
              ['int[][] dp = new int[m + 1][n + 1];', 'Extra row/col = empty prefix = 0 (default).'],
              ['if (text1.charAt(i - 1) == text2.charAt(j - 1))', 'dp index i ↔ char index i − 1.'],
              ['dp[i][j] = dp[i - 1][j - 1] + 1;', 'Match: dono chars LCS me.'],
              ['dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);', 'Mismatch: ek char drop.'],
              ['else cur[j] = Math.max(prev[j], cur[j - 1]);', 'Space-opt: upar = prev[j], left = cur[j − 1].'],
              ['int[] tmp = prev; prev = cur; cur = tmp;', 'Swap — naya array banane ki zaroorat nahi; cur[0] hamesha 0 rehta.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['Rows = text1 chars, cols = text2 chars.', 'Match pe sirf <span class="lg win">diagonal</span>, mismatch pe <span class="lg win">upar + left</span> highlight.', 'Space O(n) tab: sirf 2 rows (prev, cur).'] },
            { viz: 1143, ex: 0 },
            { viz: 1143, ex: 0, variant: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['"abc", "def"', '0', 'Koi common nahi'],
              ['"abc", "abc"', '3', 'Same'],
              ['"a", "a"', '1', 'Single'],
              ['"ezupkr", "ubmrapg"', '2', '"ur"'],
              ['Length 1000 × 1000', '—', '10⁶ cells — O(mn) theek, brute impossible'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Recursion', 'O(2^(m+n))', 'O(m + n)'],
              ['Memo', 'O(mn)', 'O(mn)'],
              ['2D', 'O(mn)', 'O(mn)'],
              ['2 rows', 'O(mn)', 'O(n) (chhoti string ko columns banao → O(min))'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['dp size m+1 × n+1 kyun?', 'Empty prefix ka row/col → base case 0, index checks nahi.'],
              ['Match pe max(...) bhi lena chahiye?', 'Zaroorat nahi — match pe diagonal + 1 hamesha ≥ baaki (proof: LCS property).'],
              ['Mismatch pe dono drop (diagonal) kyun nahi?', 'max(upar, left) me already shamil hai (diagonal ≤ dono).'],
              ['Actual LCS string kaise?', 'dp[m][n] se peeche: match → char lo, diagonal; warna bade (upar/left) ki taraf.'],
              ['Space-opt me cur[j−1] kya hai?', 'Same row ka left cell (abhi likha).'],
              ['Ek array (1D) me kar sakte?', 'Haan, diagonal ko ek temp variable me bacha ke.'],
              ['Edit Distance se relation?', 'Same grid; transition me insert/delete/replace ka min.'],
              ['Substring (continuous) common chahiye toh?', 'Mismatch pe 0 (reset), answer max cell — alag problem.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'I define dp[i][j] as the LCS length of the first i characters of text1 and the first j of text2, with row and column zero standing for empty strings, so they are zero. If the current characters match, both belong to the LCS and dp[i][j] = dp[i−1][j−1] + 1. Otherwise I drop the last character of one string or the other and take max(dp[i−1][j], dp[i][j−1]). Filling row by row gives O(m·n) time; since each row needs only the previous one, two arrays bring space to O(n).'],
              ['Follow-up: "LCS string bhi do"', 'With the full table I backtrack from dp[m][n]: if the characters match I take that character and move diagonally, otherwise I move toward the larger of the top and left neighbours. Reversing the collected characters gives one LCS. This needs the full O(m·n) table.'],
              ['1-minute: two-string DP approach', 'I let dp[i][j] describe the answer for the first i characters of one string and the first j of the other, with an extra row and column for empty prefixes. Then I look at the last characters: on a match I extend the diagonal answer, otherwise I drop one character from either string and take the better result. The table is O(m·n) and usually reducible to two rows.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: ['"abcde" × "ace" ka grid paper pe khud bharo.', '2D code bina dekhe + submit.', 'Visualizer Example 1 se apna grid match karo.', 'Match / mismatch rule apne shabdon me.', '"abc" × "def" ka grid (sab 0) dekh ke samjho kyun.'] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: ['<b>Task A:</b> Memo + 2D + 2-rows, 20 min.', '<b>Task B:</b> LCS string reconstruct.', '<b>Task C:</b> Single array + diagonal temp version.', '<b>Task D:</b> Part 10 approach 60 sec.'] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 1143 2D + space-opt submit.', 'LC 300 dobara (5 min).', 'Kal LC 139 Word Break — substring(j, i) ka [j, i) matlab revise.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['"abcde","ace" → ?', '3.'],
              ['Match formula?', 'dp[i−1][j−1] + 1.'],
              ['Mismatch formula?', 'max(dp[i−1][j], dp[i][j−1]).'],
              ['Base case?', 'Row 0 / col 0 = 0.'],
              ['Space-opt?', 'prev[] + cur[], O(n).'],
            ] },
          ],
        },
      ],
      checks: [
        '2D state dp[i][j] samjha',
        'Grid "abcde" × "ace" khud bhara',
        '2D tabulation Accepted',
        'Match / mismatch rule bata sakta/sakti hu',
        '2-rows space-opt (Sohel: must)',
        'Visualizer 2D + space dekha',
        'Self-test 5/5',
      ],
      memory: 'Match → ↖ + 1, mismatch → max(↑, ←). Row/col 0 = 0.',
    },

    // =====================================================================
    11: {
      title: 'String Partition DP — Word Break',
      goal: 'String ko dictionary words me todna: <code>dp[i]</code> = pehle i chars toot sakte? <code>dp[0] = true</code>. Backtracking (Phase 9 ka LC 131 jaisa) se DP kaise bachata hai.',
      main: 139,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 1143, LC 131, LC 79',
          blocks: [
            { h: '1) LC 1143 LCS (kal)' },
            { p: '<b>Problem:</b> do strings ka longest common subsequence.' },
            { pre: '"abcde", "ace" → 3' },
            { p: '<b>Pattern:</b> 2D grid DP.' },
            { olist: ['(m+1) × (n+1), row/col 0 = 0.', 'Match → diag + 1.', 'Warna max(upar, left).'] },
            { code: `for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        dp[i][j] = text1.charAt(i - 1) == text2.charAt(j - 1)
                 ? dp[i - 1][j - 1] + 1
                 : Math.max(dp[i - 1][j], dp[i][j - 1]);` },
            { tip: 'Memory hook: <b>↖ + 1 ya max(↑, ←).</b>' },
            { h: '2) LC 131 Palindrome Partitioning (Phase 9)' },
            { p: '<b>Problem:</b> string ke <b>saare</b> partitions jahan har piece palindrome ho.' },
            { pre: '"aab" → [["a","a","b"],["aa","b"]]' },
            { p: '<b>Pattern:</b> Backtracking over cut positions.' },
            { olist: ['start == n → copy.', 'end = start+1..n: s[start..end) palindrome?', 'add → dfs(end) → remove.'] },
            { code: `private void dfs(String s, int start, List<String> cur, List<List<String>> res) {
    if (start == s.length()) { res.add(new ArrayList<>(cur)); return; }
    for (int end = start + 1; end <= s.length(); end++) {
        if (!isPal(s, start, end - 1)) continue;
        cur.add(s.substring(start, end));
        dfs(s, end, cur, res);
        cur.remove(cur.size() - 1);
    }
}` },
            { tip: 'Memory hook: <b>Aaj ka LC 139 = same "cut kahan lagau" loop — lekin sirf true/false chahiye → DP.</b>' },
            { h: '3) LC 79 Word Search (Phase 9)' },
            { p: '<b>Problem:</b> grid me word adjacent cells se banta hai?' },
            { pre: 'board ABCE/SFCS/ADEE, "ABCCED" → true' },
            { p: '<b>Pattern:</b> DFS + backtrack (visited mark).' },
            { olist: ['Har cell se dfs(k = 0).', 'Mismatch/out → false.', 'Mark #, 4 dirs, unmark.'] },
            { code: `private boolean dfs(char[][] b, String w, int r, int c, int k) {
    if (k == w.length()) return true;
    if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != w.charAt(k)) return false;
    char tmp = b[r][c];
    b[r][c] = '#';
    boolean found = dfs(b, w, r + 1, c, k + 1) || dfs(b, w, r - 1, c, k + 1)
                 || dfs(b, w, r, c + 1, k + 1) || dfs(b, w, r, c - 1, k + 1);
    b[r][c] = tmp;
    return found;
}` },
            { tip: 'Memory hook: <b>Mark → explore → unmark.</b> (Yahan path state visited pe depend → memo nahi lagta.)' },
          ],
        },
        {
          title: 'Part 1 — Concept: Prefix breakable DP',
          blocks: [
            { pre: `s = "leetcode", dict = {leet, code}
     l e e t c o d e
i:  0 1 2 3 4 5 6 7 8
dp: T F F F T F F F T
            ↑ "leet"     ↑ dp[4] && "code"

dp[i] = true  agar koi j < i ho jahan  dp[j] == true  AND  s.substring(j, i) dict me` },
            { table: { head: ['', 'Backtracking', 'DP'], rows: [
              ['Sawaal', 'Saare splits list (LC 131)', 'Split possible? (LC 139)'],
              ['Repeat', 'Same suffix baar-baar', 'Har prefix ek baar'],
              ['Time', 'Exponential', 'O(n²) checks (× substring)'],
            ] } },
            { p: '<b>Repeat kahan?</b> "aaaaaaa", dict {aaa, aaaa}: suffix "aaa" ko kai alag raaston se pahuchte hain → recursion dobara check karti hai. Memo / dp ise ek baar karta hai.' },
            { tip: '<code>s.substring(j, i)</code> = index j se i−1 tak (i exclusive). Isliye dp[i] "pehle i chars".' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 139 Word Break', blocks: [{ problem: 139 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute:</b> canBreak(start): har end try, prefix dict me + canBreak(end) → true. O(2^n) worst.' },
            { p: '<b>Better (memo):</b> answer sirf start pe depend → <code>Boolean[] memo</code> (null = unknown). <code>return memo[start] = true;</code> — assign + return ek saath.' },
            { p: '<b>Optimal (tabulation):</b> dp[0] = true; i = 1..n, j = 0..i−1; dp[j] && dict.contains(s.substring(j, i)) → true, break.' },
            { olist: ['dict = HashSet (O(1) lookup).', 'State: dp[i] = prefix of length i breakable.', 'Base: dp[0] = true.', 'Transition: koi j valid.', 'Answer: dp[n].'] },
            { tip: 'Optimization: j sirf <code>i − maxWordLen</code> tak peeche dekho → O(n × L²).' },
          ],
        },
        {
          title: 'Part 4 — Dry run',
          blocks: [
            { p: '<b>Example 1</b> "leetcode":' },
            { table: { head: ['i', 'prefix', 'valid j (dp[j] && word)', 'dp[i]'], rows: [
              ['0', '""', 'base', 'T'],
              ['1–3', 'l, le, lee', 'j = 0: "l","le","lee" dict me nahi', 'F'],
              ['4', 'leet', 'j = 0: "leet" ✓', '<b>T</b>'],
              ['5–7', 'leetc…', 'j = 0 / 4: "c","co","cod" nahi', 'F'],
              ['8', 'leetcode', 'j = 4: dp[4] && "code" ✓', '<b>T</b>'],
            ] } },
            { p: '<b>Example 3</b> "catsandog", dict {cats, dog, sand, and, cat}:' },
            { pre: `     c a t s a n d o g
i:  0 1 2 3 4 5 6 7 8 9
dp: T F F T T F F T F F
dp[3] "cat", dp[4] "cats", dp[7] "cat"+"sand" / "cats"+"and"
dp[9]: j=7 → "og" nahi; baaki j pe dp false → F` },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' }, { code: sol(139, 0) },
            { p: '<b>Better — memo</b>' }, { code: sol(139, 1) },
            { p: '<b>Optimal — tabulation</b>' }, { code: sol(139, 2) },
            { lines: [
              ['new HashSet<>(wordDict)', 'List.contains O(L) hota — set O(1) average.'],
              ['if (start == s.length()) return true;', 'Poori string toot gayi.'],
              ['new Boolean[s.length()]', 'null = unknown, true/false = computed.'],
              ['return memo[start] = true;', 'Save + return ek line me.'],
              ['dp[0] = true;', 'Empty prefix valid — chain yahin se shuru.'],
              ['if (dp[j] && dict.contains(s.substring(j, i)))', 'Pehle sasta check (dp[j]) — false pe substring banta hi nahi (short-circuit).'],
              ['break;', 'Ek valid cut kaafi.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['<b>text</b> view me <code>[ ]</code> = abhi check ho raha word s[j..i).', 'dp row T/F; <span class="lg skip">skip</span> = dp[j] false wala cut.', 'Memoization tab: CALL STACK me start index dekho, memo hit pe branch katti hai.', 'Example 3 (catsandog) chalao — false kaise aata hai.'] },
            { viz: 139, ex: 0 },
            { viz: 139, ex: 2, variant: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['"a", ["a"]', 'true', 'Single word'],
              ['"a", ["b"]', 'false', 'Nahi mila'],
              ['"applepenapple", ["apple","pen"]', 'true', 'Word repeat allowed'],
              ['"aaaaaaa", ["aaaa","aaa"]', 'true', '3 + 4'],
              ['"cars", ["car","ca","rs"]', 'true', '"car"+"s" fail, "ca"+"rs" ✓ — greedy fail'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Recursion', 'O(2^n)', 'O(n)'],
              ['Memo', 'O(n³)', 'O(n)'],
              ['Tabulation', 'O(n³) (n² pairs × substring O(n))', 'O(n) + dict'],
              ['+ maxLen bound', 'O(n × L²)', 'O(n)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['dp[0] = true kyun?', 'Empty prefix trivially valid; pehla word dp[0] se hi judta hai.'],
              ['substring(j, i) me i include?', 'Nahi — [j, i).'],
              ['List ki jagah HashSet kyun?', 'contains O(1) avg vs O(k).'],
              ['Greedy (sabse lamba/chhota word pehle) kyun fail?', '"cars", [car, ca, rs] — "car" lene pe "s" bachta.'],
              ['Memo Boolean[] kyun, boolean[] kyun nahi?', 'Teen states chahiye: unknown / true / false.'],
              ['Time ko kaise kam karo?', 'j ko i − maxLen tak hi; ya Trie.'],
              ['Saare sentences chahiye (follow-up)?', 'Backtracking + memo of lists — output exponential ho sakta.'],
              ['BFS view?', 'Nodes = indices, edge j → i agar s[j..i) word; 0 se n reachable?'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'Let dp[i] mean the first i characters can be segmented into dictionary words, with dp[0] true for the empty prefix. For each end i I try every cut j before it: if dp[j] is true and the substring from j to i is in a HashSet of words, dp[i] becomes true and I break. The answer is dp[n]. There are O(n²) pairs and substring hashing is O(n), so O(n³) worst case, which I can reduce by only trying cuts within the longest word length.'],
              ['Follow-up: "Optimize karo"', 'Since dictionary words are at most L characters, j only needs to range from i − L to i − 1, giving O(n · L²). Another option is a trie of the dictionary: from every true position I walk forward through the trie and mark every position where a word ends, so I never build substrings.'],
              ['1-minute: Backtracking vs DP yahan', 'Palindrome Partitioning needs every partition, so it must be backtracking. Word Break only asks whether one exists, and the answer for a suffix does not depend on how I reached it, so each start index is solved once. That turns an exponential search into a polynomial DP.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: ['"leetcode" ka dp row paper pe bharo.', 'Tabulation code bina dekhe + submit.', '"catsandog" ka dp row khud bharo.', 'Visualizer Example 1 + 3.', 'substring(j, i) ke 3 examples likho.'] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: ['<b>Task A:</b> Memo + tabulation 15 min.', '<b>Task B:</b> maxLen optimization add karo.', '<b>Task C:</b> BFS version sketch.', '<b>Task D:</b> Part 10 approach 60 sec.'] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 139 tabulation submit.', 'LC 1143 dobara (8 min).', 'Kal catch-up: LIS O(n log n) + LCS space-opt.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['"leetcode" dp me kaunse T?', '0, 4, 8.'],
              ['Transition?', 'dp[i] = OR over j of (dp[j] && dict has s[j..i)).'],
              ['Base?', 'dp[0] = true.'],
              ['Memo type?', 'Boolean[] (null = unknown).'],
              ['Time?', 'O(n³) worst (O(n·L²) with bound).'],
            ] },
          ],
        },
      ],
      checks: [
        'dp[i] prefix breakable state samjha',
        '"leetcode" aur "catsandog" dp row khud bhari',
        'Tabulation Accepted',
        'Greedy fail example ("cars") bata sakta/sakti hu',
        'Memo Boolean[] version (Sohel: must)',
        'Visualizer tabulation + memo dekhe',
        'Self-test 5/5',
      ],
      memory: 'dp[0] = T; dp[i] = koi j: dp[j] && s[j..i) dict me.',
    },

    // =====================================================================
    12: {
      title: 'Catch-up — LIS O(n log n) + LCS space-opt',
      goal: 'Naya problem nahi — do purane questions ka <b>doosra approach</b>: LC 300 ko <b>tails + binary search</b> se O(n log n), aur LC 1143 ko <b>2 rows</b> me. Memo vs tab dono likhna.',
      main: 300,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision: LC 139, LC 33, LC 236',
          blocks: [
            { h: '1) LC 139 Word Break (kal)' },
            { p: '<b>Problem:</b> string dict words me toot sakti?' },
            { pre: '"leetcode", [leet, code] → true' },
            { p: '<b>Pattern:</b> Prefix breakable DP.' },
            { olist: ['dp[0] = true.', 'dp[j] && word(j, i) → dp[i] = true.', 'dp[n].'] },
            { code: `dp[0] = true;
for (int i = 1; i <= n; i++)
    for (int j = 0; j < i; j++)
        if (dp[j] && dict.contains(s.substring(j, i))) { dp[i] = true; break; }
return dp[n];` },
            { tip: 'Memory hook: <b>Cut lagao: left part dp se, right part dict se.</b>' },
            { h: '2) LC 33 Search in Rotated Sorted Array (Phase 6)' },
            { p: '<b>Problem:</b> rotated sorted array me target.' },
            { pre: '[4,5,6,7,0,1,2], 0 → 4' },
            { p: '<b>Pattern:</b> Binary search — ek half hamesha sorted.' },
            { olist: ['mid nikalo.', 'Left sorted? target range me → hi, warna lo.', 'Warna right sorted wala same.'] },
            { code: `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}` },
            { tip: 'Memory hook: <b>Sorted half pehchano.</b> Aaj tails[] pe bhi binary search.' },
            { h: '3) LC 236 Lowest Common Ancestor (Phase 7)' },
            { p: '<b>Problem:</b> binary tree me p, q ka LCA.' },
            { pre: '[3,5,1,6,2,0,8,null,null,7,4], p=5, q=1 → 3' },
            { p: '<b>Pattern:</b> Post-order DFS.' },
            { olist: ['null/p/q → return root.', 'left, right recursively.', 'Dono non-null → root; warna jo mila.'] },
            { code: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root;
    return left != null ? left : right;
}` },
            { tip: 'Memory hook: <b>Dono taraf mila → main hi LCA.</b>' },
          ],
        },
        {
          title: 'Part 1 — Concept: tails[] (patience sorting) + rolling rows',
          blocks: [
            { p: '<b>tails[k]</b> = length k+1 ke saare increasing subsequences me <b>sabse chhota last element</b>. Chhota tail future ke liye better (zyada numbers usse bade honge).' },
            { list: ['tails hamesha <b>sorted</b> (strictly increasing) rehta hai → binary search.', 'x aaya: pehla tails[k] ≥ x dhundo (lower bound).', 'k == size → end me add (LIS lambi hui). Warna tails[k] = x (replace, tail chhota hua).', '<b>tails asli LIS nahi hai</b> — sirf length sahi.'] },
            { pre: `nums = [10, 9, 2, 5, 3, 7, 101, 18]
x=10  → [10]
x=9   → [9]            (10 replace)
x=2   → [2]
x=5   → [2, 5]         (append)
x=3   → [2, 3]         (5 replace)
x=7   → [2, 3, 7]
x=101 → [2, 3, 7, 101]
x=18  → [2, 3, 7, 18]  → size 4` },
            { p: '<b>LCS rolling rows:</b> dp[i][*] sirf dp[i−1][*] padhta → <code>prev</code>, <code>cur</code>; har row ke baad swap. Space O(m·n) → O(n).' },
            { tip: 'Lower bound template (Phase 6): <code>lo = 0, hi = size; while (lo &lt; hi) { mid; tails[mid] &lt; x ? lo = mid + 1 : hi = mid; }</code>' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 300 (O(n log n)) + LC 1143 (space)',
          blocks: [{ problem: 300 }, { problem: 1143 }],
        },
        {
          title: 'Part 3 — Thinking: O(n²) → O(n log n), O(mn) → O(n)',
          blocks: [
            { p: '<b>LIS O(n²) ka repeated kaam:</b> har i pe saare j scan. Hume sirf ye chahiye: "length L ka sabse chhota tail kya hai?" — woh tails[] me ready hai.' },
            { p: '<b>Kyun sahi hai (intuition):</b> agar do subsequences same length ki hain, chhote tail wali hamesha better ya barabar — usse koi bhi extension possible hai jo bade tail wali se hai. Replace karne se koi information nahi khoti jo length ke liye zaroori ho.' },
            { p: '<b>LCS space:</b> sirf upar row aur current row ke left cells padhte hain → 2 rows kaafi.' },
            { table: { head: ['Question', 'Pehla approach', 'Aaj', 'Gain'], rows: [
              ['LC 300', 'dp O(n²)', 'tails + BS O(n log n)', 'n = 10⁵ pe zaroori'],
              ['LC 1143', '2D O(mn) space', '2 rows O(n)', '10⁶ → 10³ ints'],
            ] } },
          ],
        },
        {
          title: 'Part 4 — Dry run',
          blocks: [
            { p: '<b>LIS tails</b> — [10, 9, 2, 5, 3, 7, 101, 18]:' },
            { table: { head: ['x', 'lower bound lo', 'action', 'tails', 'size'], rows: [
              ['10', '0', 'append', '[10]', '1'],
              ['9', '0', 'replace 10', '[9]', '1'],
              ['2', '0', 'replace 9', '[2]', '1'],
              ['5', '1', 'append', '[2, 5]', '2'],
              ['3', '1', 'replace 5', '[2, 3]', '2'],
              ['7', '2', 'append', '[2, 3, 7]', '3'],
              ['101', '3', 'append', '[2, 3, 7, 101]', '4'],
              ['18', '3', 'replace 101', '[2, 3, 7, 18]', '<b>4</b>'],
            ] } },
            { p: '<b>LCS 2 rows</b> — "abcde" × "ace" (har row ke baad prev):' },
            { table: { head: ['row i (char)', 'prev after swap'], rows: [
              ['1 (a)', '[0, 1, 1, 1]'],
              ['2 (b)', '[0, 1, 1, 1]'],
              ['3 (c)', '[0, 1, 2, 2]'],
              ['4 (d)', '[0, 1, 2, 2]'],
              ['5 (e)', '[0, 1, 2, <b>3</b>]'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>LC 300 — tails + binary search</b>' }, { code: sol(300, 3) },
            { p: '<b>LC 1143 — 2 rows</b>' }, { code: sol(1143, 3) },
            { p: '<b>LC 1143 — memo (top-down, comparison ke liye)</b>' }, { code: sol(1143, 1) },
            { lines: [
              ['int lo = 0, hi = size;', 'Search sirf valid part tails[0..size−1] me; hi = size → append position bhi possible.'],
              ['if (tails[mid] < x) lo = mid + 1;', 'Strictly chhota → x iske baad aa sakta.'],
              ['else hi = mid;', 'tails[mid] ≥ x → candidate, aur left dekho.'],
              ['tails[lo] = x;', 'Replace ya append.'],
              ['if (lo == size) size++;', 'Sabse bada → LIS lambi.'],
              ['int[] tmp = prev; prev = cur; cur = tmp;', 'Rows swap, O(1).'],
              ['return prev[n];', 'Swap ke baad last row prev me hai.'],
            ] },
            { tip: '<code>tails[mid] &lt; x</code> (strict) → duplicates replace hote hain, isliye [7,7,7] → 1. <code>&lt;=</code> likha toh non-decreasing LIS ban jaayega.' },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['LIS Binary Search tab: lo / mid / hi pointers tails pe chalte dekho.', 'Replace pe purana tail chhota number ban jaata hai.', 'LCS Space tab: sirf 2 rows, swap ke baad prev = naya row.'] },
            { viz: 300, ex: 0, variant: 1 },
            { viz: 1143, ex: 0, variant: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['LIS [7,7,7,7]', '1', 'Strict < se replace'],
              ['LIS [-2,-1]', '2', 'Negatives theek'],
              ['LIS [4,10,4,3,8,9]', '3', 'tails = [3, 8, 9] — asli subsequence [4,8,9]'],
              ['LCS "a" × "b"', '0', 'prev[n] = 0'],
              ['LCS text2 lamba', '—', 'Chhoti string ko columns banao → O(min(m, n))'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['LIS dp', 'O(n²)', 'O(n)'],
              ['LIS tails', 'O(n log n)', 'O(n)'],
              ['LCS 2D', 'O(mn)', 'O(mn)'],
              ['LCS 2 rows', 'O(mn)', 'O(n)'],
              ['LCS memo', 'O(mn)', 'O(mn) + stack O(m + n)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['tails[k] ka matlab?', 'Length k+1 wali IS ka sabse chhota possible last element.'],
              ['tails sorted kyun rehta hai?', 'Lambi sequence ka tail chhoti ke tail se bada hi hoga; replace order nahi todta.'],
              ['tails asli LIS hai?', 'Nahi — sirf length sahi ([4,10,4,3,8,9] → tails [3,8,9]).'],
              ['Lower bound kyun, upper kyun nahi?', 'Strictly increasing: barabar value replace honi chahiye.'],
              ['Asli LIS O(n log n) me?', 'Har tails position ka index + parent[] rakho.'],
              ['LCS 2 rows me swap ke baad cur me purana data — problem?', 'Nahi — cur[j] likhne se pehle padha nahi jaata; cur[0] = 0 hamesha.'],
              ['LCS memo vs tab?', 'Memo sirf reachable states, lekin stack + O(mn) memory; tab space-opt ho sakta.'],
              ['Java me ready binary search?', 'Arrays.binarySearch(tails, 0, size, x) — negative aaye toh −(insertion point) − 1.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['LIS O(n log n) explain karo', 'I maintain an array tails where tails[k] is the smallest possible last element of an increasing subsequence of length k + 1. This array is always sorted. For each number I binary-search the first tail greater than or equal to it and replace that tail, because a smaller tail is never worse for future extensions. If the number is larger than every tail, it extends the longest subsequence and the size grows. The final size is the LIS length, though tails itself is not necessarily a real subsequence.'],
              ['LCS space-opt explain karo', 'Each cell of the LCS table reads the cell above, the cell to the left and the diagonal, all of which live in the current or previous row. So I keep two arrays, previous and current, fill the current row, then swap the references. Time stays O(m·n) and space drops to O(n), or O(min of m and n) if I put the shorter string on the columns.'],
              ['1-minute: DP space kaise kam karte ho', 'I look at which earlier states each cell actually reads. If it is only the previous one or two values I use variables; if a 2D row only needs the previous row I keep two arrays and swap; sometimes one array works with the right loop direction, as in the unbounded knapsack. The trade-off is losing the full table needed to reconstruct the solution.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: ['Part 1 wala tails trace paper pe khud karo.', 'LIS O(n²) dobara bina dekhe (yahi Sohvi ka main).', 'LCS 2D dobara + submit.', 'Visualizer LIS binary search tab dekho (code yaad zaroori nahi).', 'Agar time ho: tails version submit.'] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: ['<b>Task A:</b> LIS tails 8 min me, submit.', '<b>Task B:</b> Arrays.binarySearch version likho.', '<b>Task C:</b> LCS single array + diagonal temp version.', '<b>Task D:</b> LIS O(n log n) 1-minute bolo.'] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['LC 300 tails + LC 1143 2-rows submit.', 'Kal Saturday revision: LC 518, 1143, 139 + LC 131.', 'Last Minute tab ke triggers padho.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[0,1,0,3,2,3] ka final tails?', '[0, 1, 2, 3] → 4.'],
              ['tails me search kya hai?', 'Lower bound: pehla ≥ x.'],
              ['LIS O(n log n) ka space?', 'O(n).'],
              ['LCS 2 rows ka return?', 'prev[n] (swap ke baad).'],
              ['tails asli LIS kyun nahi?', 'Replace se order mix — sirf length guarantee.'],
            ] },
          ],
        },
      ],
      checks: [
        'tails[] ka matlab bata sakta/sakti hu',
        'tails trace [10,9,2,5,3,7,101,18] khud kiya',
        'LIS tails Accepted (Sohel: must · Sohvi: optional)',
        'LCS 2-rows Accepted',
        'Visualizer dono variants dekhe',
        'Self-test 5/5',
      ],
      memory: 'tails: pehla ≥ x replace, warna append. LCS: prev + cur, swap.',
    },

    // =====================================================================
    13: {
      title: 'Revision — Week 2 (Knapsack, LCS, Word Break)',
      goal: 'Bina dekhe re-solve: <b>LC 518, 1143, 139</b> + Phase 9 ka <b>LC 131</b> (partition: backtracking vs DP). Timer ke saath.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan',
          blocks: [
            { table: { head: ['Question', 'Sohvi timer', 'Sohel timer', 'Rule'], rows: [
              ['LC 518 Coin Change II', '20 min', '8 min', '1D, loop order explain'],
              ['LC 1143 LCS', '25 min', '10 min', '2D + grid bolo'],
              ['LC 139 Word Break', '25 min', '10 min', 'Tabulation'],
              ['LC 131 Palindrome Partitioning', '30 min', '15 min', 'Backtracking — LC 139 se compare'],
            ] } },
            { list: ['State pehle bolo.', 'Notes band; 5 min atke toh Last Minute tab.', 'Visualizer se ek example verify.'] },
          ],
        },
        {
          title: 'Part 1 — LC 518 Coin Change II',
          blocks: [
            { p: '<b>Recap:</b> combinations count. <b>Pattern:</b> Unbounded knapsack (count).' },
            { pre: 'amount 5, [1,2,5] → passes: [1,1,1,1,1,1] → [1,1,2,2,3,3] → [1,1,2,2,3,4] → 4' },
            { code: P.questions[518].approaches[3].code },
            { tip: 'Memory hook: <b>Coin bahar = combinations, dp[0] = 1.</b>' },
            { viz: 518, ex: 0 },
          ],
        },
        {
          title: 'Part 2 — LC 1143 Longest Common Subsequence',
          blocks: [
            { p: '<b>Recap:</b> do strings ka LCS. <b>Pattern:</b> 2D grid.' },
            { pre: '"abcde" × "ace" → last row [0,1,2,3] → 3' },
            { code: P.questions[1143].approaches[2].code },
            { tip: 'Memory hook: <b>↖ + 1 ya max(↑, ←).</b>' },
            { viz: 1143, ex: 0 },
          ],
        },
        {
          title: 'Part 3 — LC 139 Word Break',
          blocks: [
            { p: '<b>Recap:</b> dict words me tootegi? <b>Pattern:</b> Prefix breakable DP.' },
            { pre: '"catsandog" → dp = T F F T T F F T F F → false' },
            { code: P.questions[139].approaches[2].code },
            { tip: 'Memory hook: <b>dp[0] = T; dp[j] && word(j, i).</b>' },
            { viz: 139, ex: 2 },
          ],
        },
        {
          title: 'Part 4 — LC 131 Palindrome Partitioning (Phase 9) — LC 139 ka cousin',
          blocks: [
            { p: '<b>Recap:</b> saare partitions jahan har piece palindrome. <b>Pattern:</b> Backtracking over cuts.' },
            { pre: '"aab" → [["a","a","b"],["aa","b"]]' },
            { code: `public List<List<String>> partition(String s) {
    List<List<String>> res = new ArrayList<>();
    dfs(s, 0, new ArrayList<>(), res);
    return res;
}

private void dfs(String s, int start, List<String> cur, List<List<String>> res) {
    if (start == s.length()) { res.add(new ArrayList<>(cur)); return; }
    for (int end = start + 1; end <= s.length(); end++) {
        if (!isPal(s, start, end - 1)) continue;
        cur.add(s.substring(start, end));
        dfs(s, end, cur, res);
        cur.remove(cur.size() - 1);
    }
}

private boolean isPal(String s, int l, int r) {
    while (l < r) if (s.charAt(l++) != s.charAt(r--)) return false;
    return true;
}` },
            { table: { head: ['', 'LC 131', 'LC 139'], rows: [
              ['Chahiye', 'Saare partitions', 'Ek possible?'],
              ['Technique', 'Backtracking', 'DP'],
              ['Loop', 'end = start+1..n', 'j = 0..i−1 (same cut idea)'],
            ] } },
            { tip: 'Memory hook: <b>Same "cut kahan" loop — list chahiye toh backtrack, haan/na chahiye toh DP.</b>' },
          ],
        },
        {
          title: 'Part 5 — Interview mix',
          blocks: [
            { qa: [
              ['LC 518 me loops ulte kiye toh?', 'Permutations.'],
              ['LC 1143 ka base case?', 'Row 0 / col 0 = 0.'],
              ['LC 139 me dp[0]?', 'true.'],
              ['LC 131 ko DP se speed up?', 'isPal[i][j] table precompute (O(n²)), lekin output khud exponential.'],
              ['DP problem pehchanne ke 3 signals?', 'Count/min/max/possible, har step pe choice, recursion me repeat.'],
              ['0/1 vs unbounded knapsack loop direction?', '0/1: right → left; unbounded: left → right.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — 1-minute answers: aise bolo',
          blocks: [
            { say: [
              ['DP kaise pehchante ho', 'I look for three signals. The question asks for a count, a minimum or maximum, or a yes-or-no feasibility rather than listing all solutions. The problem can be described as a choice at each step, like take or skip, which coin, or where to cut. And when I sketch the brute-force recursion, the same arguments repeat. Then I define a state, write the recurrence, memoize it and convert it to a table.'],
              ['Word Break vs Palindrome Partitioning', 'Both try every cut position. Palindrome Partitioning must return every partition, so backtracking is required and the output can be exponential. Word Break only asks whether one segmentation exists, and the answer for a suffix does not depend on the path, so each index is solved once with DP.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: ['LC 518 aur LC 139 bina dekhe, timer.', 'LC 1143 grid "abc" × "abc" khud bharo.', 'LC 131 ka recursion tree "aab" ke liye banao.', 'Mistake log update.'] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice) + System Design',
          blocks: [
            { olist: ['<b>Task A:</b> Charon questions 45 min me total.', '<b>Task B:</b> LC 139 ko Trie se optimize karo (sketch).', '<b>Task C:</b> LC 131 me isPal DP table add karo.', '<b>System Design session (1/week):</b> "Design an autocomplete / typeahead service" — Trie + top-k per prefix, caching, sharding by prefix, update pipeline. 45 min, diagram + trade-offs.'] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: ['Mistake log se 2 sabse common galtiyan likho.', 'Kal mock: Sohvi ko LC 198, Sohel ko LC 139.', 'Contest: Sunday 8:00 AM IST.'] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['amount 4, [1,2,3] → LC 518?', '4.'],
              ['"abc" × "def" → LC 1143?', '0.'],
              ['"applepenapple" → LC 139?', 'true.'],
              ['"aab" → LC 131 kitne partitions?', '2.'],
              ['LC 1143 space-opt?', '2 rows, O(n).'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 518 timer me solve',
        'LC 1143 timer me solve',
        'LC 139 timer me solve',
        'LC 131 re-solve + LC 139 se fark bataya',
        'Mistake log update',
        'Sohel: System Design session kiya',
      ],
      memory: 'Same cut loop: list → backtracking (131), possible? → DP (139).',
    },

    // =====================================================================
    14: {
      title: 'Mock Interview + Contest + Phase Test',
      goal: 'Phase ka final mock: <b>Tum → Sohvi</b> (LC 198), <b>Sohvi → Tum</b> (LC 139). Phir contest + Phase test (Last Minute tab ke saare one-liners).',
      main: null,
      parts: [
        {
          title: 'Part 0 — Mock format (30 + 30 + 30 min)',
          blocks: [
            { table: { head: ['Slot', 'Kya', 'Kaun'], rows: [
              ['30 min', 'Mock 1: LC 198 House Robber', 'Tum interviewer, Sohvi candidate'],
              ['30 min', 'Mock 2: LC 139 Word Break', 'Sohvi interviewer, Tum candidate'],
              ['30 min', 'Contest discussion + Phase test', 'Dono'],
            ] } },
            { list: ['Notes / visualizer band.', 'Hints ladder se hi help.', 'Rubric score 1–4.'] },
          ],
        },
        {
          title: 'Part 1 — Mock Q1 (Tum → Sohvi): LC 198 House Robber',
          blocks: [
            { problem: 198 },
            { p: '<b>Kya poochna hai:</b> brute kya? greedy (alternate) kyun galat? state? space O(1)?' },
            { olist: ['Hint 1: "Har ghar pe kitne options hain?"', 'Hint 2: "Ghar loota toh pichle ka kya?"', 'Hint 3: "[2,1,1,2] pe alternate try karo."', 'Hint 4: "Kitni pichli values chahiye?"'] },
            { table: { head: ['Rubric', 'Kya dekhna', 'Score'], rows: [
              ['Clarify', 'Empty/1 ghar, negatives poocha?', '1–4'],
              ['Brute', 'Take/skip recursion', '1–4'],
              ['Optimal', 'max(dp[i−1], dp[i−2] + x)', '1–4'],
              ['Code', 'Clean, index shift sahi', '1–4'],
              ['Test', '[2,7,9,3,1] dry run', '1–4'],
              ['Communication', 'Bolte hue', '1–4'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Mock Q2 (Sohvi → Tum): LC 139 Word Break',
          blocks: [
            { problem: 139 },
            { p: '<b>Kya poochna hai:</b> brute complexity? memo state? dp[0]? optimize karo (maxLen / Trie)?' },
            { olist: ['Hint 1: "Pehla word kahan khatam ho sakta hai?"', 'Hint 2: "Baaki string ka answer kis pe depend?"', 'Hint 3: "dp[i] = pehle i chars…"'] },
            { table: { head: ['Rubric', 'Kya dekhna', 'Score'], rows: [
              ['Clarify', 'Word reuse? empty string?', '1–4'],
              ['Brute', 'Recursion + exponential example', '1–4'],
              ['Optimal', 'dp[i], HashSet, break', '1–4'],
              ['Code', '10 min, substring sahi', '1–4'],
              ['Test', '"catsandog" → false', '1–4'],
              ['Communication', 'maxLen optimization khud bataya', '1–4'],
            ] } },
          ],
        },
        {
          title: 'Part 3 — Interview communication checklist (DP)',
          blocks: [
            { olist: ['Clarify constraints (n size → complexity target).', 'Brute recursion + repeat dikhaao.', 'State ek sentence.', 'Transition + base.', 'Order + answer cell.', 'Code + dry run table.', 'Space-opt + follow-ups (reconstruct, variants).'] },
          ],
        },
        {
          title: 'Part 4 — LeetCode Weekly Contest plan + Phase test',
          blocks: [
            { list: ['Sunday 8:00 AM IST contest.', 'Phase test: Last Minute tab ke 10 triggers zubaani — 1 min me state + transition bolo har ek ka.', 'Phase 11 ke 8 questions ke one-liners bolo (Questions tab).'] },
            { table: { head: ['Discussion', 'Note'], rows: [
              ['Solve / time', ''],
              ['DP question tha? State kya thi?', ''],
              ['Kahan atke', ''],
              ['Upsolve plan', ''],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Interview mix (Phase test)',
          blocks: [
            { qa: [
              ['LC 70 transition?', 'dp[i] = dp[i−1] + dp[i−2].'],
              ['LC 746 answer cell?', 'dp[n] (top).'],
              ['LC 322 infinity?', 'amount + 1.'],
              ['LC 518 loop order?', 'Coin bahar.'],
              ['LC 300 O(n log n) idea?', 'tails + lower bound.'],
              ['LC 1143 mismatch?', 'max(upar, left).'],
              ['LC 139 base?', 'dp[0] = true.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — 1-minute answers: aise bolo',
          blocks: [
            { say: [
              ['DP space reduce karna', 'I look at which earlier states each cell reads. If dp[i] depends only on the previous one or two values, as in Climbing Stairs or House Robber, I use two variables. If a 2D row depends only on the previous row, as in LCS, I keep two arrays and swap. Sometimes one array works with the right loop direction, as in the unbounded knapsack. The trade-off is losing the table needed to reconstruct the solution.'],
              ['Phase summary: DP me kya seekha', 'Every DP problem in this phase followed the same path: define the state in one sentence, write the transition from the last choice, set the base case, pick a fill order, and read the answer. I start with brute recursion, memoize the repeats, convert to a bottom-up table and then cut space. The patterns were Fibonacci-style, take or skip, unbounded knapsack, longest increasing subsequence, two-string grids and string partition.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: ['Mock 1 candidate (LC 198).', 'Mock 2 interviewer — rubric bharo.', 'Phase test me Sohvi list (70, 746, 198) ke one-liners.', 'Contest Q1.'] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: ['<b>Task A:</b> Mock 2 me 20 min ke andar code + test + optimization.', '<b>Task B:</b> Phase ke 8 questions ka optimal code 60 min me (speed test).', '<b>Task C:</b> Contest Q1–Q3 + upsolve.', '<b>Task D:</b> Sohvi ko 2 feedback points.'] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: ['Mistake log ke top 3 DP galtiyan Last Minute tab se match karo.', 'Phase 12 (Revision + Mocks) shuru — mixed questions ke liye ready.', 'Ek contest question upsolve.'] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Phase 11 ke 8 questions aur pattern?', '70/746 Fibonacci, 198 take/skip, 322/518 unbounded knapsack, 300 LIS, 1143 2D LCS, 139 string partition.'],
              ['Memo vs tab ek line?', 'Top-down recursion + cache vs bottom-up loop table.'],
              ['DP ke 3 signals?', 'Count/min/max/possible, choices, repeated recursion.'],
              ['Infinity overflow bug?', 'MAX_VALUE + 1 → negative.'],
              ['LIS answer kahan?', 'max(dp), ya tails size.'],
            ] },
          ],
        },
      ],
      checks: [
        'Mock 1 (LC 198) complete — rubric bhara',
        'Mock 2 (LC 139) complete — rubric bhara',
        'Phase test: 10 triggers zubaani',
        'Weekly Contest diya + discussion',
        'Ek question upsolve',
      ],
      memory: 'State → transition → base → order → answer; recursion → memo → table → space.',
    },
  });
})();
