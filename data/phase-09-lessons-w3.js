// Phase 9 (Backtracking) — Week 3 lessons (local days 15–21). Day 1 (Phase 1) wale format me.
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
  const B = 'board =\n  A B C E\n  S F C S\n  A D E E';

  Object.assign(P.lessons, {
    // ======================= DAY 15 =======================
    15: learn({
      title: 'Grid DFS Backtracking — Word Search (visited[][])',
      goal: '<b>LC 79</b>: grid me har cell se DFS, <b>mark → 4 directions → unmark</b>. Grid backtracking aur normal DFS ka fark.',
      main: 79,
      revTitle: 'Heap + LC 46 + LC 131',
      rev: [].concat(
        rq(46, 'Permutations.', '[1,2,3] → 6', 'Backtracking used[]',
          ['size == n → copy.', '0 se loop, used skip.', 'mark/add → recurse → remove/unmark.'],
          `for (int i = 0; i < nums.length; i++) {
    if (used[i]) continue;
    used[i] = true; path.add(nums[i]);
    backtrack(nums, used, path, res);
    path.remove(path.size() - 1); used[i] = false;
}`, 'used = visited; aaj grid me bhi visited mark/unmark.'),
        rq(131, 'Palindrome Partitioning.', '"aab" → [[a,a,b],[aa,b]]', 'Cut choice + prune',
          ['start == n → copy.', 'Palindrome prefix → recurse(end + 1).'],
          `for (int end = start; end < s.length(); end++) {
    if (!isPal(s, start, end)) continue;
    path.add(s.substring(start, end + 1));
    backtrack(s, end + 1, path, res);
    path.remove(path.size() - 1);
}`, 'Cut, check, recurse.'),
        rq(973, 'Origin ke k sabse paas points.', 'points = [[1,3],[-2,2]], k = 1 → [[-2,2]]', 'Max-heap of size k (distance²)',
          ['dist = x² + y² (sqrt nahi).', 'Max-heap, size > k → poll (sabse door).', 'Bache k = answer.'],
          `public int[][] kClosest(int[][] points, int k) {
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> (b[0] * b[0] + b[1] * b[1]) - (a[0] * a[0] + a[1] * a[1]));
    for (int[] p : points) { pq.offer(p); if (pq.size() > k) pq.poll(); }
    int[][] ans = new int[k][];
    for (int i = 0; i < k; i++) ans[i] = pq.poll();
    return ans;
}`, 'k ka max-heap; sabse door bahar.'),
      ),
      c1: 'Concept: Grid DFS + backtracking',
      concept: [
        { p: 'Grid me har cell ke 4 neighbours: <code>(r+1,c) (r−1,c) (r,c+1) (r,c−1)</code>. DFS function me <b>pehle invalid cases</b>, fir kaam:' },
        { olist: [
          '<code>k == word.length()</code> → poora word mila → true (bounds se <b>pehle</b> — last letter ke baad neighbour bahar bhi ho sakta).',
          'Bounds ke bahar → false.',
          'Visited ya letter mismatch → false.',
          'Mark visited → 4 directions me <code>k + 1</code> → unmark → result.',
        ] },
        { table: { head: ['', 'Normal DFS (flood fill / islands)', 'Backtracking DFS (Word Search)'], rows: [
          ['Visited', 'Permanent', 'Wapas aate waqt <b>unmark</b>'],
          ['Kyun', 'Sirf reachability', 'Cell doosre path me phir chahiye ho sakta'],
          ['Complexity', 'O(m·n)', 'O(m·n · 3^L)'],
        ] } },
        { pre: `${B}
word = "ABCCED"
(0,0)A → (0,1)B → (0,2)C → (1,2)C → (2,2)E → (2,1)D  ✓` },
      ],
      t3: 'Har start cell × DFS',
      think: [
        { p: '<b>Brute soch:</b> word ka har letter kisi cell se match karo, saare raaste try karo — yahi DFS hai. Start: koi bhi cell (m·n), har step pe max 4 (asal me 3, kyunki jahan se aaye woh visited) options.' },
        { p: '<b>Short-circuit:</b> <code>dfs(down) || dfs(up) || …</code> — ek true mila toh baaki directions call hi nahi hoti.' },
        { p: '<b>Unmark kyun?</b> "ABCB" me galat raaste me use hua cell agle start cell ke raaste me chahiye ho sakta — unmark na kiya toh false negatives.' },
        { tip: 'Order of checks matter karta hai: <b>k == L pehle</b>. Warna 1×1 board, word "A" pe: (0,0) match → neighbours sab bahar → false aa jaata!' },
      ],
      d4: 'word = "ABCCED" aur "ABCB"',
      dry: [
        { p: '<b>"ABCCED"</b> — start (0,0):' },
        { table: { head: ['Frame dfs(k, r, c)', 'Check', 'Action'], rows: [
          ['(0, 0,0)', "A == 'A'", 'mark; neeche (1,0)'],
          ['(1, 1,0)', "S ≠ 'B'", 'false'],
          ['(1, −1,0)', 'bahar', 'false'],
          ['(1, 0,1)', "B == 'B'", 'mark; neeche (1,1) F ✗, upar bahar, right (0,2)'],
          ['(2, 0,2)', "C == 'C'", 'mark; neeche (1,2)'],
          ['(3, 1,2)', "C == 'C'", 'mark; neeche (2,2)'],
          ['(4, 2,2)', "E == 'E'", 'mark; neeche bahar, upar visited, right (2,3) E ≠ D, left (2,1)'],
          ['(5, 2,1)', "D == 'D'", 'mark; neeche call dfs(6, 3,1)'],
          ['(6, 3,1)', 'k == 6 == L', '<b>true</b> → upar tak true'],
        ] } },
        { p: '<b>"ABCB"</b>: (0,0)A → (0,1)B → (0,2)C → k=3 \'B\' chahiye: neeche (1,2) C, upar bahar, right (0,3) E, left (0,1) <b>visited</b> → false. Wapas sab unmark. Doosra A (2,0): neighbours S, D, bahar → false. Answer <b>false</b>.' },
      ],
      code: [
        { code: sol(79, 0) },
        { lines: [
          ['boolean[][] visited = new boolean[m][n];', 'Is path me kaun se cells use hue.'],
          ['if (dfs(board, word, 0, r, c, visited)) return true;', 'Har cell ko start try karo.'],
          ['if (k == word.length()) return true;', 'Poora word match — bounds se pehle.'],
          ['if (r < 0 || c < 0 || r >= …)', 'Grid ke bahar.'],
          ['if (visited[r][c] || board[r][c] != word.charAt(k))', 'Reuse nahi / letter galat → prune.'],
          ['visited[r][c] = true;', 'Choose.'],
          ['dfs(...) || dfs(...) || …', 'Explore 4 directions, short-circuit.'],
          ['visited[r][c] = false;', 'Unchoose — doosre paths ke liye free.'],
        ] },
      ],
      v6: 'grid pe path banna aur mitna',
      look: [
        '<b>board</b> grid: neela = current path (visited), peela = abhi wala cell, laal = mismatch.',
        '<b>word</b> row: kitne letters match ho chuke (k).',
        'CALL STACK me <code>dfs(k, r, c)</code> frames — depth = k + 2 tak.',
        'Example 3 ("ABCB") — B (0,1) visited hai isliye fail.',
      ],
      viz: [[79, 0, 0], [79, 2, 0]],
      edge: [
        ['1×1 <code>[["a"]]</code>, "a"', 'true', 'k == L check pehle'],
        ['<code>[["a","b"]]</code>, "ba"', 'true', 'Start (0,1) se left'],
        ['<code>[["a","a"]]</code>, "aaa"', 'false', 'Cell reuse nahi'],
        ['word &gt; m·n letters', 'false', 'Itne cells hi nahi'],
        ['<code>[["a","b"],["c","d"]]</code>, "abdc"', 'true', 'a→b→d→c (U-turn)'],
      ],
      cx: [['visited[][] DFS', 'O(m·n · 3^L)', 'O(m·n) + O(L) stack', 'Har start, har step ≤ 3 naye options']],
      cxNote: 'Pehle step pe 4 directions, baad me 3 (aaya hua cell visited). m·n ≤ 36, L ≤ 15 → worst bada, par mismatch prune bahut jaldi kaatta hai.',
      qa: [
        ['k == L check pehle kyun?', 'Last letter ke baad agla call bahar bhi ho sakta — warna true miss.'],
        ['Unmark kyun?', 'Cell doosre start / path me chahiye ho sakta.'],
        ['Normal DFS se fark?', 'Visited permanent nahi.'],
        ['3^L kyun, 4^L kyun nahi?', 'Jis cell se aaye woh visited — max 3 naye options.'],
        ['Short-circuit ka fayda?', 'True milte hi baaki directions skip.'],
        ['Stack depth?', 'O(L).'],
        ['Visited matrix space?', 'O(m·n).'],
        ['Kal ka improvement?', "In-place '#' + frequency prune."],
      ],
      say: [
        ['Approach explain karo (Word Search)', 'I try every cell as a starting point and run a DFS that tries to match word[k] at (r, c). It returns true when k reaches the word length, and false when out of bounds, on an already visited cell, or on a letter mismatch. Otherwise I mark the cell, recurse into the four neighbours with k + 1 using short-circuit OR, and unmark the cell before returning so other paths can use it. Time O(m·n·3^L), recursion depth O(L).'],
        ['Follow-up: "DFS vs backtracking here"', 'In flood fill, visited marks stay forever because only reachability matters. Here a cell used by a failed path may be needed by another path, so I must unmark on the way back — that undo is what makes it backtracking.'],
        ['1-minute: Grid backtracking template', 'Check success, check bounds, check validity, mark, explore neighbours, unmark, return. Keeping those in that order avoids the classic bugs.'],
      ],
      sohvi: ['Board paper pe banao, "ABCCED" ka path draw karo.', '"ABCB" kyun false — explain.', 'Code likho (checks ka order yaad).', 'Visualizer Examples 1 aur 3.'],
      sohel: ['<b>Task A:</b> 12 min Accepted.', '<b>Task B:</b> Edge "a"/"a" pe k == L pehle na ho toh kya hota — dry run.', '<b>Task C:</b> Flood fill vs Word Search 30 sec.'],
      hw: ['LC 79 Accepted.', "Kal: in-place '#' marking + frequency pruning."],
      test: [
        ['"SEE" path?', '(1,3) → (2,3) → (2,2)'],
        ['Checks ka order?', 'k == L, bounds, visited/mismatch.'],
        ['Unmark line?', 'visited[r][c] = false;'],
        ['Complexity?', 'O(m·n · 3^L)'],
        ['"ABCB" false kyun?', 'B (0,1) dobara use nahi ho sakta.'],
      ],
      checks: ['Grid DFS template ke checks order me bol sakta/sakti hu', '"ABCCED" path dry-run kiya', 'Code Accepted', 'Visualizer me mark/unmark dekha', 'DFS vs backtracking fark bol sakta/sakti hu', 'Self-test sahi'],
      memory: 'Success → bounds → valid → mark → 4 dirs → unmark.',
    }),

    // ======================= DAY 16 =======================
    16: learn({
      title: "Word Search — in-place marking + pruning",
      goal: "<b>LC 79</b> optimal: visited[][] ki jagah <code>board[r][c] = '#'</code>, <b>frequency check</b> se DFS se pehle prune, aur return se pehle restore.",
      main: 79,
      revTitle: 'Sliding Window + Heap + LC 79',
      rev: [].concat(
        rq(79, 'Word Search (kal ka).', B + '\n"ABCCED" → true', 'Grid DFS backtracking',
          ['Har cell start.', 'k == L / bounds / visited-mismatch.', 'Mark → 4 dirs → unmark.'],
          `visited[r][c] = true;
boolean found = dfs(board, word, k + 1, r + 1, c, visited)
        || dfs(board, word, k + 1, r - 1, c, visited)
        || dfs(board, word, k + 1, r, c + 1, visited)
        || dfs(board, word, k + 1, r, c - 1, visited);
visited[r][c] = false;`, 'Mark, explore, unmark.'),
        rq(3, 'Bina repeat characters ka longest substring.', '"abcabcbb" → 3 ("abc")', 'Sliding window + last index',
          ['last[c] = c ka last index.', 'Repeat mila → l = max(l, last + 1).', 'best = max(best, r − l + 1).'],
          `public int lengthOfLongestSubstring(String s) {
    int[] last = new int[128];
    Arrays.fill(last, -1);
    int l = 0, best = 0;
    for (int r = 0; r < s.length(); r++) {
        char c = s.charAt(r);
        l = Math.max(l, last[c] + 1);
        last[c] = r;
        best = Math.max(best, r - l + 1);
    }
    return best;
}`, 'int[128] char count — aaj freq prune me bhi yahi.'),
        rq(295, 'Stream ka median.', 'add 1, add 2 → 1.5; add 3 → 2', 'Two heaps (max-heap low, min-heap high)',
          ['low (max) me daalo, top high me bhejo.', 'high bada ho gaya → wapas low me.', 'Median = low.peek ya average.'],
          `PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder()), hi = new PriorityQueue<>();
public void addNum(int x) {
    lo.offer(x); hi.offer(lo.poll());
    if (hi.size() > lo.size()) lo.offer(hi.poll());
}
public double findMedian() {
    return lo.size() > hi.size() ? lo.peek() : (lo.peek() + hi.peek()) / 2.0;
}`, 'Do heaps, low ≥ high size.'),
      ),
      c1: "Concept: In-place marking + pruning ideas",
      concept: [
        { table: { head: ['Trick', 'Kaise', 'Fayda'], rows: [
          ["In-place '#'", "<code>saved = board[r][c]; board[r][c] = '#'</code> … <code>board[r][c] = saved</code>", "O(m·n) visited matrix bach gaya; '#' kisi letter se match nahi karta → visited check free"],
          ['Frequency prune', 'Board ke letters count; word ke letters ghatao; koi &lt; 0 → false', 'Impossible word pe DFS hi nahi'],
          ['Restore before return', 'True mile toh bhi restore karke return', 'Board input waisa hi rahe (caller ke liye)'],
          ['Reverse word (bonus idea)', 'Agar word[0] board me word[L−1] se zyada baar aata hai → reverse word search karo', 'Kam start cells match'],
        ] } },
        { pre: `"ABCB" freq check:
board count: A2 B1 C2 E3 S2 F1 D1
word: A → A1, B → B0, C → C1, B → B −1 < 0 → return false (0 DFS calls!)` },
      ],
      t3: 'visited[][] → in-place # + prune',
      think: [
        { p: "<b>Approach 1</b> (kal): alag visited matrix." },
        { p: "<b>Approach 2:</b> cell ko hi '#' bana do. Mismatch check (<code>board[r][c] != word.charAt(k)</code>) '#' ko automatically reject karta hai — alag visited check nahi." },
        { p: '<b>Prune:</b> DFS se pehle O(m·n + L) count check. Worst case me DFS exponential — ye check bahut sasta hai.' },
        { tip: "Restore bhoolna = board kharab, agle start cells ke liye galat '#'. Return true se pehle bhi restore karo." },
      ],
      d4: '"SEE" with in-place marking',
      dry: [
        { table: { head: ['Step', 'Frame', 'Board change', 'Note'], rows: [
          ['1', 'freq', '—', 'S2 E3 — need S1 E2 ✓'],
          ['2', 'starts (0,0)…(1,0)', '—', "(1,0) S match → '#', neighbours A, A, F → fail, restore 'S'"],
          ['3', 'start (1,3)', "(1,3) = '#'", 'S match'],
          ['4', 'dfs(1, 2,3)', "(2,3) = '#'", 'E match'],
          ['5', 'dfs(2, 3,3)', '—', 'bahar → false'],
          ['6', 'dfs(2, 1,3)', '—', "'#' ≠ E → false (visited!)"],
          ['7', 'dfs(2, 2,4)', '—', 'bahar'],
          ['8', 'dfs(2, 2,2)', "(2,2) = '#'", 'E match → neeche dfs(3, …) → k == L true'],
          ['9', 'unwind', "restore (2,2), (2,3), (1,3)", 'true'],
        ] } },
      ],
      code: [
        { code: sol(79, 1) },
        { lines: [
          ['int[] freq = new int[128];', 'ASCII letter counts.'],
          ['if (--freq[ch] < 0) return false;', 'Word ko board se zyada letters chahiye → impossible.'],
          ['if (board[r][c] != word.charAt(k)) return false;', "Mismatch + '#' (visited) dono yahin."],
          ["board[r][c] = '#';", 'Choose / mark.'],
          ['for (int[] d : dirs)', '4 directions loop.'],
          ['board[r][c] = saved; return true;', 'Restore phir return.'],
          ['board[r][c] = saved; (end)', 'Unchoose.'],
        ] },
      ],
      v6: "'#' marking + freq prune",
      look: [
        "Variant <b>In-place '#'</b>: grid me path wale cells '#' ban jaate hain aur wapas letter.",
        '<b>freq</b> map: Example 3 ("ABCB") pe B −1 → turant false, DFS zero.',
        'Steps compare karo: default (visited) vs in-place — ABCB pe bahut kam.',
      ],
      viz: [[79, 1, 1], [79, 2, 1]],
      edge: [
        ['"ABCB"', 'false', 'Freq prune (B sirf 1)'],
        ['<code>[["a"]]</code>, "a"', 'true', "Mark '#', k == L"],
        ['<code>[["C","A","A"],["A","A","A"],["B","C","D"]]</code>, "AAB"', 'true', '(1,0)A → … → (2,0)B'],
        ['Upper + lower case', 'case-sensitive', "'a' ≠ 'A'"],
      ],
      cx: [
        ['visited[][]', 'O(m·n · 3^L)', 'O(m·n + L)', 'Alag matrix'],
        ["In-place '#' + freq", 'O(m·n · 3^L) worst', 'O(L) stack', 'Matrix nahi + early prune'],
      ],
      cxNote: 'Worst-case same, practical speed bahut better. Bahut saare words same board pe → Trie (aage ka topic).',
      qa: [
        ["'#' kyun?", 'Kisi letter se match nahi → visited check free.'],
        ['Restore kab?', 'Har return se pehle (true aur false dono).'],
        ['Freq check cost?', 'O(m·n + L).'],
        ['Freq check kab fayda?', 'Word ke letters board me kam hon.'],
        ['Space ab?', 'O(L) stack.'],
        ['Input modify karna theek?', 'Restore karte hain toh end me same; interviewer se poochh lo.'],
        ['Reverse trick?', 'word[0] zyada common ho toh reversed word dhundho — kam starts.'],
        ['Many words?', 'Trie + ek DFS.'],
      ],
      say: [
        ['Optimizations explain karo', 'Before any search I compare letter counts: if the board lacks enough of some letter, I return false. Inside the DFS I mark the cell in place with a sentinel, which the mismatch check rejects automatically, so I need no visited matrix. I restore the cell before every return, including the success path, so the board ends unchanged.'],
        ['Follow-up: many words', 'For many words on one board, I would insert them into a trie and run one DFS per cell that walks the trie, collecting words as nodes end — that shares prefixes across words.'],
        ['1-minute: Speeding up Word Search', 'Prune with letter frequencies, optionally search the reversed word when it has a rarer first letter, mark in place, and fail fast on bounds and mismatches.'],
      ],
      sohvi: ['"ABCB" freq check paper pe.', "In-place version samjho; visited version achhe se likho.", 'Visualizer dono variants.'],
      sohel: ["<b>Task A:</b> In-place version 12 min.", '<b>Task B:</b> Reverse-word trick add karo (word[0] vs word[L−1] count).', '<b>Task C:</b> Trie follow-up 60 sec me design bolo.'],
      hw: ['LC 79 in-place Accepted.', 'Kal: complexity revision + LC 46 & 78 re-solve.'],
      test: [
        ['"ABCB" freq pe kya?', 'B −1 → false.'],
        ["'#' + mismatch check?", 'Same line handle.'],
        ['Restore bhoole toh?', "Board me '#' bacha → galat false."],
        ['Space?', 'O(L)'],
        ['Many words ka DS?', 'Trie'],
      ],
      checks: ["In-place marking samjha", 'Freq prune samjha', 'Optimal Accepted', 'Visualizer variant dekha', 'Follow-ups bol sakta/sakti hu', 'Self-test sahi'],
      memory: "Count pehle; '#' mark; har return se pehle restore.",
    }),

    // ======================= DAY 17 =======================
    17: learn({
      title: 'Complexity of Backtracking + Template mastery (46 & 78 re-solve)',
      goal: 'Recursion tree se <b>complexity nikaalna</b> (nodes × work). <b>LC 46</b> aur <b>LC 78</b> memory se, timer ke saath.',
      main: 46,
      revTitle: 'Binary Search + LC 40 + LC 90',
      rev: [].concat(
        rq(40, 'Combination Sum II.', '[2,5,2,1,2], 5 → [[1,2,2],[5]]', 'Sort + skip + break + i+1',
          ['Sort.', 'Skip same level dup.', 'Break too big.', 'Recurse i + 1.'],
          `if (i > start && c[i] == c[i - 1]) continue;
if (c[i] > remain) break;
path.add(c[i]);
backtrack(c, i + 1, remain - c[i], path, res);
path.remove(path.size() - 1);`, '39 + i+1 + skip.'),
        rq(90, 'Subsets II.', '[1,2,2] → 6', 'Sort + skip',
          ['Sort.', 'Record.', 'Skip.'],
          `res.add(new ArrayList<>(path));
for (int i = start; i < nums.length; i++) {
    if (i > start && nums[i] == nums[i - 1]) continue;
    path.add(nums[i]); backtrack(nums, i + 1, path, res); path.remove(path.size() - 1);
}`, 'i > start.'),
        rq(33, 'Rotated sorted array me target.', '[4,5,6,7,0,1,2], 0 → 4', 'Binary search — ek half hamesha sorted',
          ['mid nikaalo.', 'Left half sorted (nums[lo] ≤ nums[mid])? target range me → hi = mid − 1 else lo.', 'Warna right half sorted — same logic.'],
          `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (target >= nums[lo] && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
        } else {
            if (target > nums[mid] && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
        }
    }
    return -1;
}`, 'Sorted half pehchano, range check.'),
      ),
      c1: 'Concept: Complexity = nodes × work per node',
      concept: [
        { table: { head: ['Problem', 'Branching', 'Depth', 'Nodes / answers', 'Work per answer', 'Time'], rows: [
          ['LC 78 Subsets', '≤ n', 'n', '2ⁿ nodes', 'O(n) copy', 'O(n · 2ⁿ)'],
          ['LC 90 Subsets II', '≤ n', 'n', '≤ 2ⁿ', 'O(n)', 'O(n · 2ⁿ)'],
          ['LC 46 Permutations', 'n, n−1, …', 'n', 'n! leaves', 'O(n)', 'O(n · n!)'],
          ['LC 39 Combination Sum', '≤ n', 'T/min', '≤ n^(T/min)', 'O(T/min)', 'exponential'],
          ['LC 40 Combination Sum II', '≤ n', '≤ n', '≤ 2ⁿ', 'O(n)', 'O(n · 2ⁿ)'],
          ['LC 131 Partitioning', '≤ n', 'n', '≤ 2ⁿ⁻¹', 'O(n)', 'O(n · 2ⁿ)'],
          ['LC 79 Word Search', '4 then 3', 'L', 'm·n · 3^L', 'O(1)', 'O(m·n · 3^L)'],
        ] } },
        { p: '<b>Space:</b> recursion depth + path (output alag). Sabme O(n) / O(L) / O(T/min).' },
        { pre: `Permutations n = 3 — nodes per level:
level 0: 1
level 1: 3
level 2: 3·2 = 6
level 3: 3·2·1 = 6   (leaves)
total = 16 ≈ e · n!  → O(n · n!) with copy` },
        { tip: 'Constraints se reverse socho: n ≤ 6 (perm), n ≤ 10 (subsets), n ≤ 16 (partition) — exponential design ka signal.' },
      ],
      t3: 'Template recap: kaunsa loop, kaunsa base',
      think: [
        { table: { head: ['Decision', 'Subsets', 'Permutations'], rows: [
          ['Loop start', 'start', '0 (used) / start (swap)'],
          ['Recurse', 'i + 1', 'same level + 1'],
          ['Record', 'Har node', 'size == n'],
        ] } },
        { p: 'Aaj ka main kaam: <b>LC 46</b> (used[] + swap) aur <b>LC 78</b> (backtracking + iterative + bitmask) — 25 min me paanchon.' },
      ],
      d4: 'call count verify karo',
      dry: [
        { table: { head: ['Input', 'Calls (backtrack)', 'Answers', 'Formula'], rows: [
          ['LC 78 [1,2,3]', '8', '8', '2³ (har node answer)'],
          ['LC 78 [1,2,3,4]', '16', '16', '2⁴'],
          ['LC 46 [1,2,3] used[]', '16', '6', '1 + 3 + 6 + 6'],
          ['LC 46 [1,2,3,4] used[]', '65', '24', '1 + 4 + 12 + 24 + 24'],
        ] } },
        { p: 'Visualizer me CALL STACK frames gin ke ye numbers check karo.' },
      ],
      code: [
        { p: '<b>LC 46 — used[]</b>' }, { code: sol(46, 1) },
        { p: '<b>LC 46 — swap</b>' }, { code: sol(46, 2) },
        { p: '<b>LC 78 — backtracking</b>' }, { code: sol(78, 2) },
        { lines: [
          ['for (int i = 0; …) / if (used[i]) continue;', 'Permutations: order matters.'],
          ['for (int i = start; …)', 'Subsets / swap: aage hi.'],
          ['res.add(new ArrayList<>(path));', 'Subsets: har node; Perm: sirf leaf.'],
          ['swap(nums, start, i); … swap(nums, start, i);', 'Swap = choose + unchoose.'],
        ] },
      ],
      v6: 'teeno recursion trees',
      look: ['LC 46 used[] aur swap — frames ka count.', 'LC 78 backtracking — 8 nodes = 8 frames.'],
      viz: [[46, 0, 0], [46, 0, 1], [78, 0, 0]],
      edge: [
        ['LC 46 n = 1', '[[1]]', '2 calls'],
        ['LC 78 n = 1', '[[],[x]]', '2 calls'],
        ['LC 46 n = 6', '720', 'Constraint max'],
        ['LC 78 n = 10', '1024', 'Constraint max'],
      ],
      cx: [
        ['LC 46 (any)', 'O(n · n!)', 'O(n)', 'n! leaves'],
        ['LC 78 (any)', 'O(n · 2ⁿ)', 'O(n)', '2ⁿ nodes'],
      ],
      cxNote: 'Output size = lower bound. Interview line: "the output itself has this size, so this is optimal".',
      qa: [
        ['Backtracking complexity formula?', 'Nodes × work per node.'],
        ['LC 46 n=3 total calls?', '16.'],
        ['LC 78 n=4 calls?', '16.'],
        ['Space kya count karte?', 'Depth + path; output alag.'],
        ['Word Search 3^L kyun?', 'Aaya hua cell visited.'],
        ['LC 39 depth?', 'target / min.'],
        ['n ≤ 20 kya signal?', 'Exponential / bitmask OK.'],
        ['Iterative vs recursive subsets?', 'Same time; iterative no stack.'],
      ],
      say: [
        ['Complexity of a backtracking solution', 'I count nodes in the recursion tree and multiply by the work per node. For subsets that is 2^n nodes with O(n) copying; for permutations n! leaves with O(n) copying; for Word Search m·n starts with branching three over L steps. Space is the recursion depth plus the path, and I mention the output separately.'],
        ['Iterative or recursive?', 'Both are O(n·2^n) for subsets. Recursion extends naturally to constraints like duplicates or pruning, so it is my default; iterative or bitmask versions avoid stack depth concerns and let me index subsets directly.'],
        ['1-minute: Why exponential is acceptable', 'When the problem asks for all solutions, the output itself is exponential, so no algorithm can do better; small constraints like n ≤ 10 confirm the interviewer expects it.'],
      ],
      sohvi: ['LC 46 used[] + LC 78 backtracking bina dekhe (20 min).', 'Call count table khud verify (viz se).', 'Complexity table ki 3 rows yaad karo.'],
      sohel: ['<b>Task A:</b> 5 versions (46 ×2, 78 ×3) — 25 min.', '<b>Task B:</b> Complexity table poora zubaani.', '<b>Task C:</b> n = 4 permutation calls formula se nikaalo (65).'],
      hw: ['Sab versions Accepted.', 'Kal: LC 39 + 40 timer ke saath.'],
      test: [
        ['Permutation complexity?', 'O(n · n!)'],
        ['Subsets complexity?', 'O(n · 2ⁿ)'],
        ['Word Search?', 'O(m·n · 3^L)'],
        ['LC 46 n=3 calls?', '16'],
        ['Output space?', 'Alag count.'],
      ],
      checks: ['Complexity table bol sakta/sakti hu', 'LC 46 dono versions memory se', 'LC 78 versions memory se', 'Call counts viz se verify kiye', 'Self-test sahi'],
      memory: 'Complexity = nodes × kaam per node; output hi lower bound.',
    }),

    // ======================= DAY 18 =======================
    18: learn({
      title: 'Combination family re-solve: LC 39 + LC 40 (timer)',
      goal: '<b>LC 39</b> aur <b>LC 40</b> bina dekhe 20 min me. <b>break vs continue</b> ka logic pakka.',
      main: 39,
      revTitle: 'Binary Search + LC 131 + LC 79',
      rev: [].concat(
        rq(131, 'Palindrome Partitioning — DP table.', '"aab" pal: [0][1] T, [1][2] F', 'DP + backtracking',
          ['i neeche se, j = i..n−1.', 'pal[i][j] = kinare same && (len ≤ 2 || andar pal).', 'Backtracking me pal[start][end].'],
          `for (int i = n - 1; i >= 0; i--)
    for (int j = i; j < n; j++)
        pal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || pal[i + 1][j - 1]);`, 'Kinare + andar.'),
        rq(79, 'Word Search.', B + '\n"SEE" → true', "Grid DFS + '#'",
          ['Freq prune.', "Mark '#', 4 dirs, restore."],
          `char saved = board[r][c];
board[r][c] = '#';
for (int[] d : dirs)
    if (dfs(board, word, k + 1, r + d[0], c + d[1])) { board[r][c] = saved; return true; }
board[r][c] = saved;
return false;`, 'Mark, explore, restore.'),
        rq(875, 'Koko min speed jisse h ghante me saare kele.', 'piles = [3,6,7,11], h = 8 → 4', 'Binary search on answer',
          ['lo = 1, hi = max pile.', 'hours(mid) = Σ ceil(p / mid).', 'hours ≤ h → hi = mid, else lo = mid + 1.'],
          `public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = 0;
    for (int p : piles) hi = Math.max(hi, p);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        long hrs = 0;
        for (int p : piles) hrs += (p + mid - 1) / mid;
        if (hrs <= h) hi = mid; else lo = mid + 1;
    }
    return lo;
}`, 'Answer pe binary search.'),
      ),
      c1: 'Concept: break vs continue',
      concept: [
        { table: { head: ['Check', 'Statement', 'Kyun'], rows: [
          ['<code>c[i] &gt; remain</code>', '<b>break</b>', 'Sorted → aage sab ≥ c[i] → koi fit nahi'],
          ['<code>i &gt; start &amp;&amp; c[i] == c[i−1]</code>', '<b>continue</b>', 'Agla value alag ho sakta, kaam aa sakta'],
          ['<code>!isPal(start, end)</code> (LC 131)', '<b>continue</b>', 'Lamba piece palindrome ho sakta'],
        ] } },
        { pre: `LC 39 [2,3,5], target 8:
[2] r6 → [2,2] r4 → [2,2,2] r2 → [2,2,2,2] r0 ✓
                     [2,2,3] r1 → 3 > 1 break
         [2,3] r3 → [2,3,3] r0 ✓ ; next 5 > 3 → break
         [2,5] r1 → 5 > 1 → break
[3] r5 → [3,3] r2 → 3 > 2 break ;  [3,5] r0 ✓
[5] r3 → 5 > 3 break` },
      ],
      t3: 'Ek template, do settings',
      think: [
        { p: 'Ek hi code skeleton likho, phir 2 switch: <b>reuse</b> (i vs i+1) aur <b>duplicates</b> (skip line).' },
        { olist: ['Sort.', 'remain == 0 → copy.', '[LC 40 only] skip duplicate.', 'break if too big.', 'add → recurse(i or i+1) → remove.'] },
      ],
      d4: 'LC 39: [2,3,5], 8',
      dry: [
        { table: { head: ['Path', 'remain', 'Result'], rows: [
          ['[2,2,2,2]', '0', '✓'],
          ['[2,2,2] → try 3', '−', '3 &gt; 2 break'],
          ['[2,2,3]', '1', '3 &gt; 1 break'],
          ['[2,3,3]', '0', '✓'],
          ['[2,3] → try 5', '−', '5 &gt; 3 break'],
          ['[2,5]', '1', '5 &gt; 1 break'],
          ['[3,3]', '2', '3 &gt; 2 break'],
          ['[3,5]', '0', '✓'],
          ['[5]', '3', '5 &gt; 3 break'],
        ] } },
        { p: 'Answer: <code>[[2,2,2,2],[2,3,3],[3,5]]</code>.' },
      ],
      code: [
        { p: '<b>LC 39</b>' }, { code: sol(39, 1) },
        { p: '<b>LC 40</b>' }, { code: sol(40, 1) },
        { lines: [
          ['backtrack(c, i, …) vs backtrack(c, i + 1, …)', 'Reuse vs single use.'],
          ['if (i > start && c[i] == c[i - 1]) continue;', 'Sirf LC 40.'],
          ['if (c[i] > remain) break;', 'Dono me.'],
        ] },
      ],
      v6: 'LC 39 ex 2 aur LC 40 ex 1',
      look: ['LC 39 Example 2 — teeno answers kab bante.', 'LC 40 Example 1 — skip + break dono.'],
      viz: [[39, 1, 0], [40, 0, 0]],
      edge: [
        ['LC 39 [2], 1', '[]', 'break'],
        ['LC 40 [3], 2', '[]', 'break'],
        ['LC 39 [8,7,4,3], 11', '[[3,4,4],[3,8],[4,7]]', 'Sort zaroori'],
      ],
      cx: [
        ['LC 39', 'O(n^(T/min))', 'O(T/min)', 'Reuse'],
        ['LC 40', 'O(n · 2ⁿ)', 'O(n)', 'Single use + skip'],
      ],
      cxNote: 'Dono me sort O(n log n) negligible.',
      qa: [
        ['Too big pe continue likha toh?', 'Sahi answer, par faltu iterations.'],
        ['Duplicate pe break likha toh?', 'Galat — aage valid alag values chhoot jaayengi.'],
        ['LC 39 [8,7,4,3], 11?', '[[3,4,4],[3,8],[4,7]]'],
        ['Sort na kiya, break rakha?', 'Galat answers (chhote elements skip).'],
        ['LC 40 reuse?', 'Nahi, i + 1.'],
        ['Depth LC 39 [2..], 40?', '20.'],
        ['LC 39 me duplicate skip chahiye?', 'Nahi — distinct.'],
        ['Template switches?', 'Reuse (i/i+1), duplicate skip.'],
      ],
      say: [
        ['Break versus continue', 'Because the candidates are sorted, once c[i] exceeds the remainder every later candidate does too, so I break. The duplicate check uses continue because the next, different value may still fit. Without sorting I could only skip that one element.'],
        ['One template, two problems', 'I write the same sorted backtracking with a remainder; for reuse I recurse with i, for single use with i + 1 plus a skip for equal siblings.'],
        ['1-minute: Combination Sum', 'Sort, backtrack with remain, break when a candidate is too large, recurse with the same index for reuse, record when remain hits zero.'],
      ],
      sohvi: ['LC 39 bina dekhe (15 min).', 'break vs continue table yaad.', 'LC 40 try (optional).'],
      sohel: ['<b>Task A:</b> LC 39 + 40 — 20 min total.', '<b>Task B:</b> Ek generic function likho jisme <code>boolean reuse</code> flag ho.', '<b>Task C:</b> Break vs continue 30 sec.'],
      hw: ['Dono Accepted.', 'Kal: LC 131 + LC 90 re-solve.'],
      test: [
        ['Too big → ?', 'break'],
        ['Duplicate → ?', 'continue'],
        ['LC 39 ex 2?', '[[2,2,2,2],[2,3,3],[3,5]]'],
        ['LC 40 recurse?', 'i + 1'],
        ['Sort kyun?', 'break + skip.'],
      ],
      checks: ['LC 39 bina dekhe Accepted', 'LC 40 bina dekhe Accepted', 'break vs continue bol sakta/sakti hu', 'Viz se trace match kiya', 'Self-test sahi'],
      memory: 'Bada → break; same → continue; reuse → i, single → i+1.',
    }),

    // ======================= DAY 19 =======================
    19: learn({
      title: 'Phase catch-up: LC 131 + LC 90 re-solve',
      goal: '<b>LC 131</b> aur <b>LC 90</b> bina dekhe. Backtracking pattern ko <b>30 sec me pehchanna</b>.',
      main: 131,
      revTitle: 'Arrays + LC 39 + LC 46',
      rev: [].concat(
        rq(39, 'Combination Sum.', '[2,3,6,7], 7 → [[2,2,3],[7]]', 'Sort + remain + break, recurse(i)',
          ['Sort.', 'remain 0 → copy.', 'break; add; recurse(i); remove.'],
          `for (int i = start; i < c.length; i++) {
    if (c[i] > remain) break;
    path.add(c[i]);
    backtrack(c, i, remain - c[i], path, res);
    path.remove(path.size() - 1);
}`, 'Reuse → i.'),
        rq(46, 'Permutations swap.', '[1,2,3] → 6', 'Swap in-place',
          ['start == n → copy.', 'swap → recurse → swap.'],
          `for (int i = start; i < nums.length; i++) {
    swap(nums, start, i);
    backtrack(nums, start + 1, res);
    swap(nums, start, i);
}`, 'Start pe kaun?'),
        rq(560, 'Subarrays jinka sum k.', '[1,1,1], k = 2 → 2', 'Prefix sum + HashMap',
          ['freq.put(0, 1).', 'sum += x; count += freq[sum − k].', 'freq[sum]++.'],
          `public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> f = new HashMap<>();
    f.put(0, 1);
    int sum = 0, cnt = 0;
    for (int x : nums) {
        sum += x;
        cnt += f.getOrDefault(sum - k, 0);
        f.put(sum, f.getOrDefault(sum, 0) + 1);
    }
    return cnt;
}`, 'put(0,1) mat bhoolna.'),
      ),
      c1: 'Concept: Pattern recognition — 30 sec me pehchano',
      concept: [
        { table: { head: ['Problem bolta hai…', 'Pattern', 'Course Q'], rows: [
          ['"all subsets"', 'start loop, har node record', 'LC 78'],
          ['"all subsets", duplicates', '+ sort + i &gt; start skip', 'LC 90'],
          ['"all orderings"', 'used[] / swap, leaf record', 'LC 46'],
          ['"sum to target", reuse', 'sort + remain + break, recurse(i)', 'LC 39'],
          ['"sum to target", once + dups', '+ skip, recurse(i+1)', 'LC 40'],
          ['"partition string"', 'cut choice + valid prefix', 'LC 131'],
          ['"word in grid"', 'DFS + mark/unmark', 'LC 79'],
        ] } },
        { tip: 'Teen sawaal: Order matter? Reuse? Duplicates? → loop start, recurse index, skip line decide.' },
      ],
      t3: 'Re-solve plan',
      think: [
        { olist: ['LC 131: tree "aab" 1 min, code 10 min.', 'LC 90: skip line + reason, code 8 min.', 'Dono visualizer se verify.'] },
      ],
      d4: '"efe" (LC 131) + [2,2,2] (LC 90)',
      dry: [
        { table: { head: ['start', 'piece', 'pal?', 'Result'], rows: [
          ['0', '"e"', '✓', '→ start 1'],
          ['1', '"f"', '✓', '→ start 2: "e" ✓ → <b>[e,f,e]</b>'],
          ['1', '"fe"', '✗', 'continue'],
          ['0', '"ef"', '✗', 'continue'],
          ['0', '"efe"', '✓', '<b>[efe]</b>'],
        ] } },
        { p: 'LC 90 [2,2,2]: [] → [2] → [2,2] → [2,2,2]; har level pe baaki 2 skip → <code>[[],[2],[2,2],[2,2,2]]</code>.' },
      ],
      code: [
        { p: '<b>LC 131</b>' }, { code: sol(131, 0) },
        { p: '<b>LC 90</b>' }, { code: sol(90, 1) },
        { lines: [
          ['if (!isPal(s, start, end)) continue;', 'LC 131 prune.'],
          ['if (i > start && nums[i] == nums[i - 1]) continue;', 'LC 90 dup skip.'],
          ['backtrack(s, end + 1, path, res);', 'Cut ke baad.'],
          ['backtrack(nums, i + 1, path, res);', 'Subset aage.'],
        ] },
      ],
      v6: 'dono re-solve verify',
      look: ['LC 131 apna input "efe" daalo.', 'LC 90 apna input "2, 2, 2" daalo.'],
      viz: [[131, 0, 0], [90, 0, 0]],
      edge: [
        ['"abc"', '[[a,b,c]]', 'Sirf singles'],
        ['"aaa"', '4', 'Sab valid'],
        ['[2,2,2]', '4 subsets', 'Sab same'],
        ['[0]', '[[],[0]]', 'Single'],
      ],
      cx: [['LC 131', 'O(n · 2ⁿ)', 'O(n)', 'Cuts'], ['LC 90', 'O(n · 2ⁿ)', 'O(n)', 'Skip']],
      cxNote: 'Dono 2ⁿ family — n ≤ 16 aur n ≤ 10 constraints isi wajah se.',
      qa: [
        ['Backtracking ka signal?', '"Return all …" + chhote constraints.'],
        ['Count poochhe toh?', 'Shayad DP.'],
        ['LC 131 piece ka code?', 's.substring(start, end + 1)'],
        ['LC 90 [2,2,2] count?', '4'],
        ['"efe" count?', '2'],
        ['Teen clarifying sawaal?', 'Order, reuse, duplicates.'],
        ['LC 131 me sort?', 'Nahi — string order fixed.'],
        ['LC 90 i &gt; 0 ka bug?', '[2,2] jaise answers miss.'],
      ],
      say: [
        ['Recognising backtracking', 'The problem asks for all solutions, constraints are small, and a solution can be built step by step with checks on partial solutions. If it only asks for a count or an optimum with overlapping subproblems, I consider DP.'],
        ['LC 90 in 30 seconds', 'Sort, backtrack where every node is a subset, and skip equal siblings with i greater than start.'],
        ['LC 131 in 30 seconds', 'From start try every end; if the piece is a palindrome, add it and recurse from end + 1; at the end of the string record the partition.'],
      ],
      sohvi: ['LC 90 bina dekhe.', 'LC 131 bina dekhe (ya tree + idea).', 'Pattern table zubaani.'],
      sohel: ['<b>Task A:</b> Dono 20 min me.', '<b>Task B:</b> Pattern table 60 sec me bolo.', '<b>Task C:</b> "min cuts" DP ka idea (Phase 11 preview).'],
      hw: ['Dono Accepted.', 'Kal Saturday: 79, 131, 40, 236 revision.'],
      test: [
        ['"efe" answer?', '[[e,f,e],[efe]]'],
        ['LC 90 skip?', 'i &gt; start &amp;&amp; nums[i] == nums[i−1]'],
        ['Grid word pattern?', 'DFS + mark/unmark'],
        ['Order matters?', 'Permutations'],
        ['Reuse?', 'recurse(i)'],
      ],
      checks: ['LC 131 bina dekhe', 'LC 90 bina dekhe', 'Pattern table zubaani', 'Viz verify', 'Self-test sahi'],
      memory: 'Order? Reuse? Duplicates? — teen sawaal, poora template.',
    }),

    // ======================= DAY 20 (SAT) =======================
    20: {
      title: 'Revision — Week 3 (Grid DFS + poora phase)',
      goal: 'LC 79, 131, 40 + Phase 7 ka LC 236 — <b>bina dekhe</b>. Sohel: System Design session.',
      main: null,
      parts: [
        { title: 'Part 0 — Aaj ka revision plan', blocks: [
          { table: { head: ['Question', 'Timer', 'Rule'], rows: [
            ['LC 79 Word Search', '20 min', 'Checks ka order'],
            ['LC 131 Palindrome Partitioning', '15 min', 'Tree pehle'],
            ['LC 40 Combination Sum II', '15 min', 'Skip + break'],
            ['LC 236 LCA', '10 min', 'Recursion warm-up'],
          ] } },
          { list: ['Notes band.', 'Last Minute tab ke triggers zubaani.', 'Har question ka recursion tree 1 min me.'] },
        ] },
        { title: 'Part 1 — LC 79 Word Search', blocks: [
          { problem: 79 }, { p: '<b>Pattern:</b> Grid DFS + mark/unmark.' }, { pre: B + '\n"ABCB" → false' },
          { code: sol(79, 0) }, { tip: 'Memory hook: <b>Success → bounds → valid → mark → 4 dirs → unmark.</b>' }, { viz: 79, ex: 2 },
        ] },
        { title: 'Part 2 — LC 131 Palindrome Partitioning', blocks: [
          { problem: 131 }, { p: '<b>Pattern:</b> Cut choice.' }, { pre: '"aab" → [[a,a,b],[aa,b]]' },
          { code: sol(131, 0) }, { tip: 'Memory hook: <b>Cut, check, recurse(end+1).</b>' }, { viz: 131, ex: 0 },
        ] },
        { title: 'Part 3 — LC 40 Combination Sum II', blocks: [
          { problem: 40 }, { p: '<b>Pattern:</b> Sort + skip + break.' }, { pre: '[10,1,2,7,6,1,5], 8 → [[1,1,6],[1,2,5],[1,7],[2,6]]' },
          { code: sol(40, 1) }, { tip: 'Memory hook: <b>39 + i+1 + skip.</b>' }, { viz: 40, ex: 0 },
        ] },
        { title: 'Part 4 — LC 236 LCA (Phase 7)', blocks: [
          { pre: 'p = 5, q = 1 → 3;  p = 5, q = 4 → 5' },
          { code: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode l = lowestCommonAncestor(root.left, p, q);
    TreeNode r = lowestCommonAncestor(root.right, p, q);
    if (l != null && r != null) return root;
    return l != null ? l : r;
}` },
          { tip: 'Memory hook: <b>Dono taraf mila → main LCA.</b>' },
        ] },
        { title: 'Part 5 — Interview mix', blocks: [{ qa: [
          ['DFS vs backtracking?', 'Backtracking me undo (unmark) hota hai.'],
          ['Word Search space?', 'O(L) stack (+ visited O(m·n)).'],
          ['LC 131 max partitions?', '2ⁿ⁻¹'],
          ['LC 40 sort kyun?', 'Skip + break.'],
          ['LCA base case?', 'null / p / q → root.'],
          ['k == L check pehle kyun?', 'Last letter ke baad call bahar ho sakta.'],
        ] }] },
        { title: 'Part 6 — Aise bolo (1-minute answers)', blocks: [{ say: [
          ['DFS vs backtracking', 'Backtracking is DFS over partial solutions with an explicit undo step; plain DFS keeps visited marks forever.'],
          ['Word Search in a minute', 'Start from every cell, DFS matching word[k], fail on bounds, visited or mismatch, mark, explore four directions, unmark. O(m·n·3^L).'],
        ] }] },
        { title: 'Part 7 — Sohvi session', blocks: [{ olist: ['LC 79 bina dekhe.', 'LC 236 code.', 'LC 131 tree + code.'] }] },
        { title: 'Part 8 — Sohel session (SDE-2 + System Design)', blocks: [
          { olist: ['<b>Task A:</b> Chaaron 55 min.', '<b>Task B:</b> Har question ka follow-up.', '<b>Task C:</b> Phase ke 7 questions ka one-liner list.'] },
          { p: '<b>System Design session (1/week) — 45 min:</b> "Design a notification system" — channels (push, email, SMS), queue (Kafka) + workers, retries with backoff, idempotency keys, user preferences, rate limiting per user.' },
        ] },
        { title: 'Part 9 — Homework', blocks: [{ list: ['Kal mock + phase test: Sohvi → LC 78, Tum → LC 79.'] }] },
        { title: 'Part 10 — Final self-test', blocks: [{ qa: [
          ['"ABCCED" path?', 'A(0,0) B(0,1) C(0,2) C(1,2) E(2,2) D(2,1)'],
          ['"aaa" partitions?', '4'],
          ['LC 40 ex 2?', '[[1,2,2],[5]]'],
          ['LCA p=5, q=4?', '5'],
          ['Word Search complexity?', 'O(m·n · 3^L)'],
        ] }] },
      ],
      checks: ['LC 79 bina dekhe', 'LC 131 bina dekhe', 'LC 40 bina dekhe', 'LC 236 likha', 'Interview mix', 'System Design session (Sohel)'],
      memory: 'Grid: mark → explore → unmark. Phase: order? reuse? duplicates?',
    },

    // ======================= DAY 21 (SUN) =======================
    21: {
      title: 'Mock Interview + Contest + Phase Test',
      goal: 'Mock: Tum → Sohvi (<b>LC 78</b>), Sohvi → Tum (<b>LC 79</b>). Phase test: Last Minute tab ki saari one-liners.',
      main: null,
      parts: [
        { title: 'Part 0 — Mock format (30 + 30 + 30 min)', blocks: [
          { table: { head: ['Slot', 'Kaun', 'Kya'], rows: [['30 min', 'Tum → Sohvi', 'LC 78'], ['30 min', 'Sohvi → Tum', 'LC 79'], ['30 min', 'Dono', 'Contest discussion + phase test']] } },
        ] },
        { title: 'Part 1 — Mock Q1 (Tum → Sohvi): LC 78', blocks: [
          { problem: 78 },
          { p: '<b>Kya poochna hai:</b> "Teen tarike?", "Complexity optimal kyun?", "Duplicates hote toh?" (LC 90 link)' },
          { olist: ['Hint 1: Har element in/out.', 'Hint 2: Har node ek subset.', 'Hint 3: Iterative: har x se double.'] },
          rubric,
        ] },
        { title: 'Part 2 — Mock Q2 (Sohvi → Tum): LC 79', blocks: [
          { problem: 79 },
          { p: '<b>Kya poochna hai:</b> "Same cell dobara kyun nahi?", "Unmark kyun?", "Speed up kaise?", "Many words?"' },
          { olist: ['Hint 1: Har cell start.', 'Hint 2: Visited kaise track?', 'Hint 3: Wapas aate waqt?'] },
          rubric,
        ] },
        { title: 'Part 3 — Interview communication checklist', blocks: [{ list: ['Clarify: grid size, case-sensitive, word length.', 'Brute → optimal story.', 'Edge: 1×1, word longer than cells.', 'Complexity with 3^L reason.'] }] },
        { title: 'Part 4 — LeetCode Weekly Contest plan + Phase test', blocks: [
          { list: ['Sunday 8:00 AM IST contest.', 'Phase test: Last Minute tab ke 8 triggers bina dekhe bolo.', '7 questions ka one-liner ek-ek line me.'] },
          { table: { head: ['Problem', 'Pattern socha', 'Kahan atke', 'Fix'], rows: [['Q1', '', '', ''], ['Q2', '', '', ''], ['Q3', '', '', '']] } },
        ] },
        { title: 'Part 5 — Interview mix (phase test)', blocks: [{ qa: [
          ['LC 46 one-liner?', '0 se loop, used skip, size == n copy (ya swap).'],
          ['LC 78?', 'Har node record, recurse(i+1).'],
          ['LC 39?', 'Sort, remain, break, recurse(i).'],
          ['LC 40?', '+ skip, recurse(i+1).'],
          ['LC 90?', 'Sort + i &gt; start skip.'],
          ['LC 131?', 'Cut + palindrome prune.'],
          ['LC 79?', 'DFS mark/unmark.'],
        ] }] },
        { title: 'Part 6 — Aise bolo', blocks: [{ say: [
          ['Recursion in production', 'Java has no tail-call optimization, so very deep recursion can overflow the stack; backtracking depth here is small, but for deep inputs I would use an explicit stack.'],
          ['Phase summary', 'Backtracking is choose, explore, unchoose over a recursion tree, with pruning and sort-based duplicate skipping; complexity is nodes times work, usually the output size.'],
        ] }] },
        { title: 'Part 7 — Sohvi session', blocks: [{ olist: ['Phase ke 7 problems ka list + pattern.', 'LC 78 aur 46 final bina dekhe.'] }] },
        { title: 'Part 8 — Sohel session', blocks: [{ olist: ['Saare 7 problems 2 ghante me (weekend).', 'Rubric weak area pe plan.'] }] },
        { title: 'Part 9 — Homework', blocks: [{ list: ['Agla phase: Graphs (BFS / DFS) — LC 79 ka grid DFS wahan bahut kaam aayega.'] }] },
        { title: 'Part 10 — Final self-test', blocks: [{ qa: [
          ['Copy kyun?', 'Shared path.'],
          ['i &gt; start kyun?', 'Same level only.'],
          ['Reuse?', 'recurse(i).'],
          ['Grid undo?', 'Unmark.'],
          ['Complexity rule?', 'Nodes × work.'],
        ] }] },
      ],
      checks: ['Mock Q1 + rubric', 'Mock Q2 + rubric', 'Contest diya', 'Phase test one-liners bole', 'Self-test sahi'],
      memory: 'Backtracking = choose → explore → unchoose + prune.',
    },
  });
})();
