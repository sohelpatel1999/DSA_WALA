// Phase 3 — Sliding Window: course Week 4 (Day 22–28), Sohel ka diya hua syllabus (2026-11-08). Day 1 wale format me.
// Block types: p, h, list, olist, code, pre, table, problem, viz, lines, qa, say, tip
(function () {
  const P = window.PHASE_CONTENT['sliding-window'];
  P.lessons = P.lessons || {};
  const ap = (n, i) => P.questions[n].approaches[i].code;
  const sol = (n, i) => 'class Solution {\n' + ap(n, i).split('\n').map(l => '    ' + l).join('\n') + '\n}';
  const session = (theory, viz, coding, lc) => ({ table: { head: ['Time', 'Slot', 'Aaj kya'], rows: [
    ['9:00–9:35', 'Theory', theory],
    ['9:35–9:55', 'Visualization + dry run', viz],
    ['9:55–10:10', 'Coding practice (saath me)', coding],
    ['10:10–10:30', 'LeetCode (Sohvi / Tum)', lc],
  ] } });
  const rev = o => [
    { h: o.h }, { p: o.p }, { pre: o.ex },
    { p: '<b>Pattern:</b> ' + o.pat }, { olist: o.steps }, { code: o.code },
    { tip: '<b>Memory hook:</b> ' + o.hook },
  ];
  const FIXED = `// Fixed window template (size k)
int state = 0;
for (int i = 0; i < k; i++) add(nums[i]);        // pehli window
int best = state;
for (int i = k; i < n; i++) {
    add(nums[i]);          // naya andar (right)
    remove(nums[i - k]);   // purana bahar (left)
    best = better(best, state);
}`;
  const VAR = `// Variable window template
int left = 0;
for (int right = 0; right < n; right++) {
    add(s[right]);                      // EXPAND
    while (window invalid) {            // SHRINK
        remove(s[left]);
        left++;
    }
    best = Math.max(best, right - left + 1);   // LONGEST: valid hone ke baad
}
// SHORTEST: while (window valid) { best = min(...); remove(s[left]); left++; }`;

  Object.assign(P.lessons, {
    // =====================================================================
    // DAY 22 — Intro: Fixed Window
    1: {
      title: 'Introduction to Sliding Window — Fixed Window (LC 643)',
      goal: 'Week 4 = <b>Sliding Window = Two Pointers ka advanced version</b>. Week 3 me pointers move kiye, ab <b>window maintain</b> karenge. <b>Sohvi:</b> intuition + fixed window. <b>Tum:</b> fixed + variable master, HashMap + window. Aaj: window kya hai, nested loop slow kyun, <b>left hatao, right jodo</b>. <b>Dono:</b> LC 643.',
      main: 643,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision (Week 3) + Aaj ka session',
          blocks: [
            session('Window kya hai, kyun slide, O(n·k) → O(n)', '[2,5,1,8,2,9], k = 3 pe window', 'Window sum + max window sum', 'Sohvi + Tum: LC 643'),
            ...rev({
              h: 'LC 283 — Move Zeroes (Week 3)', p: 'Zeros end me, order same.', ex: '[0,1,0,3,12] → [1,3,12,0,0]',
              pat: 'Same Direction (Read / Write) — dono pointer aage, yahi soch window me aayegi',
              steps: ['k = 0 (write).', 'nums[i] ≠ 0 → swap(k, i), k++.'], code: 'int k = 0;\nfor (int i = 0; i < nums.length; i++)\n    if (nums[i] != 0) { int t = nums[k]; nums[k] = nums[i]; nums[i] = t; k++; }',
              hook: 'Fast padhta hai, slow likhta hai — window me bhi left/right dono sirf aage.',
            }),
          ],
        },
        {
          title: 'Part 1 — Window kya hai?',
          blocks: [
            { p: '<b>Window</b> = ek <b>continuous</b> subarray ya substring. Beech se tod nahi sakte.' },
            { pre: `Array: [2, 5, 1, 8, 2, 9],  window size = 3

[2,5,1]      sum 8
  [5,1,8]    sum 14
    [1,8,2]  sum 11
      [8,2,9] sum 19   ← max` },
          ],
        },
        {
          title: 'Part 2 — Sliding kyun? (nested loop slow kyun)',
          blocks: [
            { p: 'Brute: har window ka sum <b>shuru se</b> → har window k kaam → <b>O(n·k)</b>. Par do padosi windows me k − 1 elements same hain!' },
            { pre: `[2,5,1] → [5,1,8]
 −2 (bahar gaya)   +8 (andar aaya)
naya sum = 8 − 2 + 8 = 14` },
            { p: 'Har slide = <b>ek minus + ek plus</b> = O(1) → total <b>O(n)</b>.' },
            { pre: `2 5 1 8 2 9
[L---R]          slide →        2 5 1 8 2 9
                                  [L---R]` },
          ],
        },
        {
          title: 'Part 3 — Pehchaan (recognition clues)',
          blocks: [
            { list: ['"size k ka subarray" / fixed size k', '"maximum sum of size k"', '"average of k elements"', '"exactly k elements"'] },
            { table: { head: ['', 'Traversal', 'Prefix Sum', 'Fixed Window'], rows: [
              ['Kya karta', 'Har element ek baar', 'Kisi bhi range ka sum O(1)', 'Same size ki saari windows'],
              ['Extra space', 'O(1)', 'O(n)', 'O(1)'],
              ['Kab', 'Simple scan', 'Bahut saari random range queries', 'Har size-k window ka answer'],
            ] } },
          ],
        },
        {
          title: 'Part 4 — Dry Run saath me: [2,5,1,8,2,9], k = 3',
          blocks: [{ table: { head: ['i', 'Andar (+)', 'Bahar (−)', 'Window', 'sum', 'best'], rows: [
            ['0..2', '2, 5, 1', '—', '[2,5,1]', '8', '8'], ['3', '8', '2', '[5,1,8]', '14', '14'], ['4', '2', '5', '[1,8,2]', '11', '14'], ['5', '9', '1', '[8,2,9]', '19', '<b>19</b>'],
          ] } }],
        },
        { title: 'Part 5 — Aaj ka problem: LC 643 Maximum Average Subarray I', blocks: [{ problem: 643 }] },
        {
          title: 'Part 6 — Brute → Optimal',
          blocks: [
            { p: '<b>Brute — har window dobara jodo, O(n·k)</b>' }, { code: sol(643, 0) },
            { p: '<b>Optimal — fixed sliding window, O(n)</b>' }, { code: sol(643, 1) },
            { lines: [
              ['for (int i = 0; i < k; i++) sum += nums[i];', 'Pehli window ek baar.'],
              ['sum += nums[i] - nums[i - k];', 'Naya andar, purana (i − k) bahar.'],
              ['best = Math.max(best, sum);', 'Sum ka max — average ka max bhi wahi (k same).'],
              ['return (double) best / k;', 'Divide sirf end me, double me.'],
            ] },
            { p: 'Better nahi hai — prefix sum O(n) space leta, window O(1) me hi ho jaata.' },
          ],
        },
        { title: 'Part 7 — Visualize', blocks: [{ viz: 643, ex: 0 }] },
        {
          title: 'Part 8 — Edge cases',
          blocks: [{ table: { head: ['Case', 'Answer', 'Kyun'], rows: [['k = n', 'Poore array ka avg', 'Ek hi window'], ['[5], k = 1', '5.0', 'Ek element'], ['Saare negative', 'Sabse kam negative avg', 'best = pehli window se shuru, 0 se nahi']] } }],
        },
        { title: 'Part 9 — Complexity', blocks: [{ table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n·k)', 'O(1)'], ['Sliding window', 'O(n)', 'O(1)']] } }] },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['Window kya hai?', 'Continuous subarray/substring.'],
            ['Subtraction + addition kyun kaam karta?', 'Padosi windows me k − 1 common; sirf ek bahar, ek andar.'],
            ['O(n) kyun?', 'Har element ek baar andar, ek baar bahar.'],
            ['best = 0 se shuru kyun nahi?', 'Negative sums pe galat; pehli window se shuru.'],
            ['Average ka max = sum ka max?', 'Haan, k fixed hai.'],
            ['int overflow?', 'Constraints me 10⁵ × 10⁴ fit; bade me long.'],
            ['Prefix sum se kar sakte?', 'Haan, par O(n) space.'],
            ['Pattern?', 'Fixed Window.'],
          ] }],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [{ say: [
            ['Maximum Average Subarray', 'Recomputing every window of size k costs O(n·k). Instead I compute the first window sum once, then slide: add the incoming element and subtract the one that leaves. Since k is fixed, the maximum sum gives the maximum average, so I divide once at the end. O(n) time, O(1) space.'],
          ] }],
        },
        { title: 'Part 12 — Sohvi session', blocks: [{ olist: ['Part 4 ki table khud bharo.', '<b>LC 643</b> submit — focus: window movement + sum update.', 'Visualizer me Brute aur Optimal tab compare karo.'] }] },
        { title: 'Part 13 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['<b>LC 643</b> — 5 min.', 'Zubaani: "subtraction + addition kyun kaam karta" aur "O(n) kyun".', 'Sohvi ko dry run karwao.'] }] },
        { title: 'Part 14 — Homework', blocks: [{ list: ['<b>Dono:</b> Traversal vs Prefix Sum vs Fixed Window — farak likho (Part 3 table apne shabdon me).', 'Kal (Day 23): Fixed window mastery — Tum: LC 1456.'] }] },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [{ qa: [
            ['[1,12,−5,−6,50,3], k = 4?', '12.75 (sum 51).'],
            ['Slide formula?', 'sum += nums[i] − nums[i − k].'],
            ['Brute time?', 'O(n·k).'],
            ['[2,5,1,8,2,9], k = 3 max sum?', '19.'],
            ['Pattern?', 'Fixed Window.'],
          ] }],
        },
      ],
      checks: ['Window = continuous', 'Slide: left hatao, right jodo', 'O(n·k) vs O(n)', 'Dry run table', 'LC 643 Accepted (dono)', 'Traversal / Prefix / Window farak', 'Self-test 5/5'],
      memory: 'Ek andar, ek bahar — window wahi size, kaam O(1).',
    },

    // =====================================================================
    // DAY 23 — Fixed Window Mastery
    2: {
      title: 'Fixed Window Mastery — Max Vowels (LC 1456)',
      goal: 'Fixed window me sum ki jagah <b>count</b> slide karo: aane wala vowel +1, jaane wala vowel −1. <b>Sohvi:</b> LC 643 bina notes. <b>Tum:</b> LC 1456.',
      main: 1456,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('Window rules, count in window', '"abciiidef", k = 3 — left/right/vowelCount', 'Fixed window template', 'Sohvi: 643 dobara · Tum: LC 1456'),
            ...rev({
              h: 'LC 643 — Max Average Subarray (kal ka)', p: 'Size k ka max average.', ex: '[1,12,−5,−6,50,3], k = 4 → 12.75',
              pat: 'Fixed Window', steps: ['Pehli window sum.', 'sum += nums[i] − nums[i − k].', 'best / k.'], code: ap(643, 1), hook: 'Ek andar, ek bahar.',
            }),
          ],
        },
        {
          title: 'Part 1 — Window rules',
          blocks: [
            { pre: `Naya element jodo  →  window badi hui (k + 1)
Purana hatao       →  size wapas k
Answer update` },
            { code: FIXED },
            { list: ['Clues: <b>exactly k</b>, window size fixed, maximum average, <b>count in window</b>.'] },
          ],
        },
        {
          title: 'Part 2 — Dry Run: "abciiidef", k = 3',
          blocks: [{ table: { head: ['right', 'Andar', 'Bahar', 'Window', 'vowelCount', 'best'], rows: [
            ['0..2', 'a, b, c', '—', 'abc', '1', '1'], ['3', 'i (+1)', 'a (−1)', 'bci', '1', '1'], ['4', 'i (+1)', 'b', 'cii', '2', '2'],
            ['5', 'i (+1)', 'c', 'iii', '3', '<b>3</b>'], ['6', 'd', 'i (−1)', 'iid', '2', '3'], ['7', 'e (+1)', 'i (−1)', 'ide', '2', '3'], ['8', 'f', 'i (−1)', 'def', '1', '3'],
          ] } }],
        },
        { title: 'Part 3 — Aaj ka problem: LC 1456', blocks: [{ problem: 1456 }] },
        {
          title: 'Part 4 — Brute → Optimal',
          blocks: [
            { p: '<b>Brute — har window gino, O(n·k)</b>' }, { code: sol(1456, 0) },
            { p: '<b>Optimal — fixed window + count, O(n)</b>' }, { code: sol(1456, 1) },
            { lines: [
              ['if (isVowel(s.charAt(i))) count++;', 'Aane wala vowel.'],
              ['if (isVowel(s.charAt(i - k))) count--;', 'Jaane wala vowel.'],
              ['best = Math.max(best, count);', 'Max update.'],
            ] },
            { tip: 'Early exit (Tum ke liye): best == k ho jaaye toh return — usse zyada ho hi nahi sakta.' },
          ],
        },
        { title: 'Part 5 — Visualize: left/right/vowelCount', blocks: [{ viz: 1456, ex: 0 }] },
        {
          title: 'Part 6 — Edge cases',
          blocks: [{ table: { head: ['Case', 'Answer', 'Kyun'], rows: [['"aeiou", k = 2', '2', 'Har window full'], ['"rhythms", k = 4', '0', 'Koi vowel nahi'], ['k = n', 'Total vowels', 'Ek window']] } }],
        },
        { title: 'Part 7 — Complexity', blocks: [{ table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n·k)', 'O(1)'], ['Fixed window', 'O(n)', 'O(1)']] } }] },
        {
          title: 'Part 8 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['Fixed window kyun?', 'Length k fixed di hai.'],
            ['Count kaise badalta?', 'Aane wala vowel +1, jaane wala vowel −1.'],
            ['Pehli window alag kyun?', 'Tab koi bahar nahi jaata.'],
            ['isVowel tez kaise?', 'Switch / boolean[26] lookup.'],
            ['Early exit?', 'best == k → return k.'],
            ['Space?', 'O(1).'],
            ['643 se farak?', 'Sum ki jagah count — template same.'],
            ['Pattern?', 'Fixed Window.'],
          ] }],
        },
        {
          title: 'Part 9 — Bade interview answers: aise bolo',
          blocks: [{ say: [
            ['Maximum Number of Vowels', 'The window length k is fixed, so I count vowels in the first k characters, then slide one step at a time: if the entering character is a vowel I add one, and if the leaving character is a vowel I subtract one. I keep the maximum count. Each character is processed twice at most, so O(n) time and O(1) space.'],
          ] }],
        },
        { title: 'Part 10 — Sohvi session', blocks: [{ olist: ['<b>LC 643 dobara</b> — bina notes.', 'Part 2 ki table khud bharo.', 'Template (Part 1) yaad karo.'] }] },
        { title: 'Part 11 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['<b>LC 1456</b> — 10 min.', '"Fixed window kyun" aur "count kaise badalta" zubaani.', 'Early exit add karo.'] }] },
        { title: 'Part 12 — Homework', blocks: [{ list: ['<b>Dono:</b> Fixed Sliding Window ka template likho (bina dekhe).', 'Kal (Day 24): Variable window — Tum: LC 3.'] }] },
        {
          title: 'Part 13 — Final self-test (bina notes)',
          blocks: [{ qa: [
            ['"leetcode", k = 3?', '2 ("lee", "eet", "ode").'],
            ['"abciiidef", k = 3?', '3.'],
            ['Jaane wala index?', 'i − k.'],
            ['Time?', 'O(n).'],
            ['Pattern?', 'Fixed Window.'],
          ] }],
        },
      ],
      checks: ['Window rules (add, remove, size same)', '"abciiidef" table', 'Sohvi: 643 bina notes', 'Tum: LC 1456 Accepted', 'Fixed template likha', 'Self-test 5/5'],
      memory: 'Aane wala vowel +1, jaane wala vowel −1.',
    },

    // =====================================================================
    // DAY 24 — Variable Window
    3: {
      title: 'Variable Sliding Window — Longest Substring Without Repeating (LC 3)',
      goal: 'Window ka size <b>badalta</b> hai: right se <b>expand</b>, condition toote toh left se <b>shrink</b>. "abcabcbb" pe HashSet track. <b>Sohvi:</b> observe — duplicate shrink kyun karwata hai. <b>Tum:</b> LC 3.',
      main: 3,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('Expand / shrink rules', '"abcabcbb" — left, right, HashSet', 'LC 3 teen tareeke', 'Sohvi: observe · Tum: LC 3'),
            ...rev({
              h: 'LC 1456 — Max Vowels (kal ka)', p: 'Size k me max vowels.', ex: '"abciiidef", 3 → 3',
              pat: 'Fixed Window', steps: ['Pehli window gino.', 'Aane wala +1, jaane wala −1.', 'max.'], code: ap(1456, 1), hook: 'Aane wala vowel +1, jaane wala −1.',
            }),
          ],
        },
        {
          title: 'Part 1 — Fixed vs Variable',
          blocks: [
            { table: { head: ['', 'Fixed', 'Variable'], rows: [['Size', 'Hamesha k', 'Badalta hai'], ['Left kab hilta', 'Har step', 'Sirf jab condition toote'], ['Clues', 'exactly k', 'longest, shortest, at most, at least, without repeating']] } },
            { pre: `EXPAND:  right++   → window badi
SHRINK:  condition toot gayi → left++ → window chhoti (tab tak jab tak theek na ho)` },
          ],
        },
        {
          title: 'Part 2 — Dry Run: "abcabcbb" (HashSet)',
          blocks: [{ table: { head: ['right', 'char', 'Duplicate?', 'Shrink', 'Window', 'Set', 'best'], rows: [
            ['0', 'a', 'Nahi', '—', 'a', '{a}', '1'], ['1', 'b', 'Nahi', '—', 'ab', '{a,b}', '2'], ['2', 'c', 'Nahi', '—', 'abc', '{a,b,c}', '<b>3</b>'],
            ['3', 'a', 'Haan', 'a hatao, left = 1', 'bca', '{b,c,a}', '3'], ['4', 'b', 'Haan', 'b hatao, left = 2', 'cab', '{c,a,b}', '3'],
            ['5', 'c', 'Haan', 'c hatao, left = 3', 'abc', '{a,b,c}', '3'], ['6', 'b', 'Haan', 'a, b hatao, left = 5', 'cb', '{c,b}', '3'], ['7', 'b', 'Haan', 'c, b hatao, left = 7', 'b', '{b}', '3'],
          ] } }],
        },
        { title: 'Part 3 — Aaj ka problem: LC 3', blocks: [{ problem: 3 }] },
        {
          title: 'Part 4 — Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute — har start se, O(n²)</b>' }, { code: sol(3, 0) },
            { p: '<b>Better — HashSet expand–shrink, O(n) (har char max 2 baar)</b>' }, { code: sol(3, 1) },
            { p: '<b>Optimal — HashMap last index, left seedha jump</b>' }, { code: sol(3, 2) },
            { lines: [
              ['while (window.contains(c)) { window.remove(s.charAt(left)); left++; }', 'Duplicate nikalne tak shrink (Better).'],
              ['if (last.containsKey(c) && last.get(c) >= left)', 'Purana c window ke andar hai? (Optimal)'],
              ['left = last.get(c) + 1;', 'Ek jump me shrink.'],
              ['best = Math.max(best, right - left + 1);', 'Valid window ki length.'],
            ] },
          ],
        },
        { title: 'Part 5 — Visualize', blocks: [{ viz: 3, ex: 0 }] },
        {
          title: 'Part 6 — Edge cases',
          blocks: [{ table: { head: ['Case', 'Answer', 'Kyun'], rows: [['""', '0', 'Loop nahi chalta'], ['"bbbbb"', '1', 'Har baar shrink'], ['"abba"', '2', '<code>last.get(c) >= left</code> check zaroori — warna left peeche jaata']] } }],
        },
        { title: 'Part 7 — Complexity', blocks: [{ table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n²)', 'O(charset)'], ['HashSet window', 'O(n) (2n steps)', 'O(charset)'], ['HashMap jump', 'O(n)', 'O(charset)']] } }] },
        {
          title: 'Part 8 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['HashSet kyun?', 'O(1) me "window me hai?" check.'],
            ['Characters remove kyun?', 'Left ke bahar gaye chars window ka hissa nahi.'],
            ['Window peeche kyun nahi jaati?', 'Duplicate wale starts se valid lambi window ban hi nahi sakti.'],
            ['"abba" me galti kahan?', 'last[a] = 0 < left = 2 — ignore karna hai.'],
            ['Better O(n) kaise jab inner while hai?', 'left total n hi badhta — amortized.'],
            ['Space?', 'O(min(n, charset)).'],
            ['int[128] use kar sakte?', 'Haan, ASCII ho toh.'],
            ['Pattern?', 'Variable Window (Longest) + HashMap.'],
          ] }],
        },
        {
          title: 'Part 9 — Bade interview answers: aise bolo',
          blocks: [{ say: [
            ['Longest Substring Without Repeating', 'I keep a window with no repeated characters. I expand with the right pointer; if the new character already exists inside the window, I move the left pointer just past its previous position, which I store in a HashMap from character to last index. I only jump left forward, never backward. After each step the window is valid, so I update the best length. O(n) time, O(charset) space.'],
          ] }],
        },
        { title: 'Part 10 — Sohvi session (observe)', blocks: [{ olist: ['Visualizer me HashSet tab chalao.', 'Samjho: duplicate aaya → shrink kyun zaroori.', 'Part 2 ki table copy karke bharo.'] }] },
        { title: 'Part 11 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['<b>LC 3</b> — 15 min (HashMap version).', 'Teen sawaal zubaani: HashSet kyun, remove kyun, window peeche kyun nahi.', '"abba" pe dry run.'] }] },
        { title: 'Part 12 — Homework', blocks: [{ list: ['<b>Dono:</b> Expand–Shrink logic shabdon me likho (5 lines).', 'Kal (Day 25): Expand–Shrink template — Tum: LC 209.'] }] },
        {
          title: 'Part 13 — Final self-test (bina notes)',
          blocks: [{ qa: [
            ['"pwwkew"?', '3 ("wke").'],
            ['"abba"?', '2.'],
            ['"bbbbb"?', '1.'],
            ['Shrink kab?', 'Naya char window me pehle se ho.'],
            ['Pattern?', 'Variable Window (Longest).'],
          ] }],
        },
      ],
      checks: ['Fixed vs variable table', 'Expand / shrink rules', '"abcabcbb" table', 'Sohvi: observe', 'Tum: LC 3 Accepted', '3 "kyun" zubaani', 'Self-test 5/5'],
      memory: 'Duplicate aaya → left aage, kabhi peeche nahi.',
    },

    // =====================================================================
    // DAY 25 — Expand–Shrink Pattern
    4: {
      title: 'Expand–Shrink Pattern — Minimum Size Subarray Sum (LC 209)',
      goal: 'General template: <b>Expand → condition check → invalid/valid pe shrink → repeat</b>. Shortest wale me answer <b>valid hote hi</b> update. <b>Sohvi:</b> dry run (no coding). <b>Tum:</b> LC 209.',
      main: 209,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('General variable template', '2 3 1 2 4 3, target 7 — left/right/sum', 'Template likho', 'Sohvi: dry run · Tum: LC 209'),
            ...rev({
              h: 'LC 3 — Longest Without Repeating (kal ka)', p: 'Bina repeat sabse lambi substring.', ex: '"abcabcbb" → 3',
              pat: 'Variable Window (Longest) + HashMap', steps: ['right expand.', 'c window me → left = last[c] + 1.', 'best = max.'], code: ap(3, 2), hook: 'Duplicate aaya → left aage.',
            }),
          ],
        },
        {
          title: 'Part 1 — General template',
          blocks: [
            { code: VAR },
            { table: { head: ['Sawaal', 'Shrink kab', 'Answer kab'], rows: [['Longest (LC 3, 424)', 'Jab tak <b>invalid</b>', 'Shrink ke <b>baad</b> (valid)'], ['Shortest (LC 209, 76)', 'Jab tak <b>valid</b>', 'Shrink se <b>pehle</b> (har valid pe)']] } },
            { list: ['Clues: minimum length, sum ≥ target, smallest window, at least.'] },
          ],
        },
        {
          title: 'Part 2 — Dry Run: [2,3,1,2,4,3], target 7',
          blocks: [{ table: { head: ['right', '+', 'sum', 'Valid?', 'Shrink', 'best'], rows: [
            ['0', '2', '2', 'Nahi', '—', '∞'], ['1', '3', '5', 'Nahi', '—', '∞'], ['2', '1', '6', 'Nahi', '—', '∞'],
            ['3', '2', '8', 'Haan', 'len 4 → best 4; −2 → 6', '4'], ['4', '4', '10', 'Haan', 'len 4; −3 → 7; len 3 → best 3; −1 → 6', '3'],
            ['5', '3', '9', 'Haan', 'len 3; −2 → 7; len 2 → best <b>2</b>; −4 → 3', '<b>2</b>'],
          ] } }],
        },
        { title: 'Part 3 — Aaj ka problem: LC 209', blocks: [{ problem: 209 }] },
        {
          title: 'Part 4 — Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute — har start se, O(n²)</b>' }, { code: sol(209, 0) },
            { p: '<b>Better — prefix sum + binary search, O(n log n)</b>' }, { code: sol(209, 1) },
            { p: '<b>Optimal — expand–shrink, O(n)</b>' }, { code: sol(209, 2) },
            { lines: [
              ['sum += nums[right];', 'Expand.'],
              ['while (sum >= target)', 'Valid hai tab tak chhota karo.'],
              ['best = Math.min(best, right - left + 1);', 'Shrink se pehle record.'],
              ['sum -= nums[left]; left++;', 'Shrink.'],
              ['return best == Integer.MAX_VALUE ? 0 : best;', 'Kabhi valid nahi hua → 0.'],
            ] },
          ],
        },
        { title: 'Part 5 — Visualize', blocks: [{ viz: 209, ex: 0 }] },
        {
          title: 'Part 6 — Edge cases',
          blocks: [{ table: { head: ['Case', 'Answer', 'Kyun'], rows: [['target 11, [1,1,1,1,1,1,1,1]', '0', 'Total bhi kam'], ['target 4, [1,4,4]', '1', 'Ek element hi kaafi'], ['Negative numbers', 'Ye trick nahi chalti', 'Shrink se sum badh bhi sakta — positive zaroori']] } }],
        },
        { title: 'Part 7 — Complexity', blocks: [{ table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n²)', 'O(1)'], ['Prefix + binary search', 'O(n log n)', 'O(n)'], ['Expand–shrink', 'O(n)', 'O(1)']] } }] },
        {
          title: 'Part 8 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['Shrinking kyun kaam karta?', 'Positive numbers — left hatane se sum sirf ghatta; valid rahe toh chhota answer.'],
            ['Answer valid hone ke baad hi kyun?', 'Invalid window answer nahi; har valid pe shortest check.'],
            ['while ya if?', 'while — ek right pe kai baar shrink ho sakta.'],
            ['O(n) kaise?', 'left aur right dono max n.'],
            ['Negative ho toh?', 'Ye trick nahi — prefix sum + monotonic deque lagta (aage ke weeks me).'],
            ['Better kab?', 'Follow-up "O(n log n) bhi batao".'],
            ['MAX_VALUE kyun?', 'Pehla valid answer min me aa jaaye.'],
            ['Pattern?', 'Variable Window (Shortest).'],
          ] }],
        },
        {
          title: 'Part 9 — Bade interview answers: aise bolo',
          blocks: [{ say: [
            ['Minimum Size Subarray Sum', 'All numbers are positive, so extending the window only increases the sum and shrinking only decreases it. I expand with the right pointer, and while the sum is at least the target I record the current length and shrink from the left. Each pointer moves at most n times, so it runs in O(n) time with O(1) space. If no window ever reaches the target I return 0.'],
          ] }],
        },
        { title: 'Part 10 — Sohvi session (dry run, no coding)', blocks: [{ olist: ['Part 2 ki table khud bharo.', 'Har row me bolo: expand ya shrink?', 'Visualizer me match karo.'] }] },
        { title: 'Part 11 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['<b>LC 209</b> — 10 min.', '"Shrinking kyun kaam karta" + "answer valid ke baad hi kyun" zubaani.', 'Better (binary search) bhi likho.'] }] },
        { title: 'Part 12 — Homework', blocks: [{ list: ['<b>Dono:</b> Fixed Window vs Variable Window — table banao.', 'Kal (Day 26): Replacement pattern — Tum: LC 424.'] }] },
        {
          title: 'Part 13 — Final self-test (bina notes)',
          blocks: [{ qa: [
            ['[2,3,1,2,4,3], 7?', '2 ([4,3]).'],
            ['[1,4,4], 4?', '1.'],
            ['Shortest me shrink kab?', 'Jab tak valid.'],
            ['Longest me shrink kab?', 'Jab tak invalid.'],
            ['Pattern?', 'Variable Window (Shortest).'],
          ] }],
        },
      ],
      checks: ['General template bina dekhe', 'Longest vs shortest shrink rule', 'Dry run table', 'Sohvi: dry run', 'Tum: LC 209 Accepted', 'Fixed vs Variable table', 'Self-test 5/5'],
      memory: 'Shortest: valid rahe tab tak chhota karo, har baar record.',
    },

    // =====================================================================
    // DAY 26 — Replacement Pattern
    5: {
      title: 'Replacement Pattern — Longest Repeating Character Replacement (LC 424)',
      goal: 'Frequency-based window: <b>window valid jab (len − maxFreq) ≤ k</b>. count[26] + maxFreq. <b>Sohvi:</b> frequency logic observe. <b>Tum:</b> LC 424.',
      main: 424,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('Frequency window, validity condition', '"AABABBA", k = 1 — map, maxFreq, size', 'LC 424 brute + optimal', 'Sohvi: observe · Tum: LC 424'),
            ...rev({
              h: 'LC 209 — Minimum Size Subarray Sum (kal ka)', p: 'Sum ≥ target wali sabse chhoti window.', ex: '[2,3,1,2,4,3], 7 → 2',
              pat: 'Variable Window (Shortest)', steps: ['sum += right.', 'while sum ≥ target: best = min, left hatao.'], code: ap(209, 2), hook: 'Valid rahe tab tak chhota karo.',
            }),
          ],
        },
        {
          title: 'Part 1 — Validity condition',
          blocks: [
            { pre: `Window ko ek hi letter banana hai, max k replacements.
Sabse sasta: jo letter sabse zyada hai (maxFreq) usse rakho, baaki badlo.
badalne padenge = window length − maxFreq

valid  ⟺  (right − left + 1) − maxFreq ≤ k` },
            { list: ['Clues: replace, longest repeating, at most k changes, character frequency.'] },
          ],
        },
        {
          title: 'Part 2 — Dry Run: "AABABBA", k = 1',
          blocks: [{ table: { head: ['right', 'char', 'count', 'maxFreq', 'len − maxFreq', 'Shrink?', 'Window', 'best'], rows: [
            ['0', 'A', 'A1', '1', '0', '—', 'A', '1'], ['1', 'A', 'A2', '2', '0', '—', 'AA', '2'], ['2', 'B', 'A2 B1', '2', '1', '—', 'AAB', '3'],
            ['3', 'A', 'A3 B1', '3', '1', '—', 'AABA', '<b>4</b>'], ['4', 'B', 'A3 B2', '3', '2 > 1', 'A hatao → left 1', 'ABAB', '4'],
            ['5', 'B', 'A2 B3', '3', '2 > 1', 'A hatao → left 2', 'BABB', '4'], ['6', 'A', 'A2 B3', '3', '2 > 1', 'B hatao → left 3', 'ABBA', '4'],
          ] } }],
        },
        { title: 'Part 3 — Aaj ka problem: LC 424', blocks: [{ problem: 424 }] },
        {
          title: 'Part 4 — Brute → Optimal',
          blocks: [
            { p: '<b>Brute — har start se, O(n²)</b>' }, { code: sol(424, 0) },
            { p: '<b>Optimal — window + count[26] + maxFreq, O(n)</b>' }, { code: sol(424, 1) },
            { lines: [
              ['count[c]++; maxFreq = Math.max(maxFreq, count[c]);', 'Expand + frequency update.'],
              ['while (right - left + 1 - maxFreq > k)', 'Invalid → shrink.'],
              ['count[s.charAt(left) - \'A\']--; left++;', 'Left char bahar.'],
              ['best = Math.max(best, right - left + 1);', 'Valid window ki length.'],
            ] },
            { tip: 'Tum ke liye: shrink pe maxFreq ghatate nahi — purana (bada) maxFreq rakhne se answer galat nahi hota, kyunki best sirf tab badhta hai jab sach me bada maxFreq mile.' },
            { p: 'Better nahi hai — beech ka koi asli tareeka nahi.' },
          ],
        },
        { title: 'Part 5 — Visualize: frequency map + maxFreq', blocks: [{ viz: 424, ex: 0 }] },
        {
          title: 'Part 5b — Bonus (Tum): LC 1004 Max Consecutive Ones III — same validity soch',
          blocks: [
            { p: '424 me "badalne padenge = len − maxFreq". Yahan sirf 0 → 1 badalna hai, toh <b>badalne padenge = window me zeros</b>. Valid jab zeros ≤ k.' },
            { problem: 1004 },
            { p: '<b>Brute — har start se, O(n²)</b>' }, { code: sol(1004, 0) },
            { p: '<b>Optimal — window me zeros ≤ k, O(n)</b>' }, { code: sol(1004, 1) },
            { viz: 1004, ex: 0 },
          ],
        },
        {
          title: 'Part 6 — Edge cases',
          blocks: [{ table: { head: ['Case', 'Answer', 'Kyun'], rows: [['"ABAB", k = 2', '4', 'Do badlo, poora'], ['k = 0', 'Sabse lamba same-letter run', 'Koi replacement nahi'], ['k ≥ n', 'n', 'Sab badal sakte']] } }],
        },
        { title: 'Part 7 — Complexity', blocks: [{ table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n²)', 'O(26)'], ['Window + maxFreq', 'O(n)', 'O(26)']] } }] },
        {
          title: 'Part 8 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['maxFreq kyun?', 'Sabse zyada wala rakho, baaki = replacements.'],
            ['Window kab shrink?', 'len − maxFreq > k.'],
            ['Shrink pe maxFreq update kyun nahi?', 'Stale maxFreq se answer nahi badhta — safe, O(26) bachta.'],
            ['count[26] kyun?', 'Sirf uppercase letters.'],
            ['while ya if?', 'if bhi chalta (window ek se zyada nahi ghatti); while samajhne me saaf.'],
            ['Time?', 'O(n).'],
            ['LC 1004 se link?', 'Zeros ≤ k — same validity soch.'],
            ['Pattern?', 'Frequency Window (Replacement).'],
          ] }],
        },
        {
          title: 'Part 9 — Bade interview answers: aise bolo',
          blocks: [{ say: [
            ['Longest Repeating Character Replacement', 'To make a window all one letter with the fewest changes, I keep the most frequent letter and replace the rest, so a window is valid when its length minus the max frequency is at most k. I expand with the right pointer, updating letter counts and the max frequency, and shrink from the left while the window is invalid. I track the longest valid window. O(n) time, O(26) space.'],
          ] }],
        },
        { title: 'Part 10 — Sohvi session (observe)', blocks: [{ olist: ['Frequency logic samjho: "sabse zyada wala rakho".', 'Visualizer me map aur maxFreq dekho.', 'Part 2 ki table follow karo.'] }] },
        { title: 'Part 11 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['<b>LC 424</b> — 20 min.', 'Bonus: <b>LC 1004</b> — 10 min (424 ka aasaan bhai).', '"maxFreq kyun matter karta" + "window kyun shrink" zubaani.', 'Stale maxFreq wali baat explain karo.'] }] },
        { title: 'Part 12 — Homework', blocks: [{ list: ['<b>Dono:</b> Window validity condition apne shabdon me likho.', 'Kal (Day 27): Minimum Window — Tum: LC 76.'] }] },
        {
          title: 'Part 13 — Final self-test (bina notes)',
          blocks: [{ qa: [
            ['"ABAB", k = 2?', '4.'],
            ['"AABABBA", k = 1?', '4.'],
            ['Validity?', '(len − maxFreq) ≤ k.'],
            ['Space?', 'O(26).'],
            ['Pattern?', 'Frequency Window.'],
          ] }],
        },
      ],
      checks: ['Validity condition', 'maxFreq ka role', '"AABABBA" table', 'Sohvi: frequency observe', 'Tum: LC 424 Accepted', 'Self-test 5/5'],
      memory: 'Sabse zyada wala rakho, baaki badlo — badlne ≤ k.',
    },

    // =====================================================================
    // DAY 27 (Sat) — Minimum Window
    6: {
      title: 'Minimum Window Pattern — Minimum Window Substring (LC 76)',
      goal: 'Sabse mushkil sliding window: validity <b>character frequency</b> pe. <b>Expand → window complete → shrink → answer update</b>. <b>Sohvi:</b> observe — shrink kyun zaroori. <b>Tum:</b> LC 76 (Hard).',
      main: 76,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('needMap, windowMap, matched', '"ADOBECODEBANC", t = "ABC"', 'LC 76 teen tareeke', 'Sohvi: observe · Tum: LC 76'),
            ...rev({
              h: 'LC 424 — Character Replacement (kal ka)', p: 'k badlav, sabse lamba same-letter.', ex: '"AABABBA", 1 → 4',
              pat: 'Frequency Window (Replacement)', steps: ['count++ , maxFreq.', 'len − maxFreq > k → shrink.', 'best = max.'], code: ap(424, 1), hook: 'Sabse zyada wala rakho.',
            }),
          ],
        },
        {
          title: 'Part 1 — Kya track karna hai',
          blocks: [
            { table: { head: ['Cheez', 'Matlab'], rows: [
              ['needMap', 't ke har char ki zaroorat (A:1, B:1, C:1)'], ['windowMap', 'Window me abhi kitne'],
              ['matched / formed', 'Kitne alag chars ki zaroorat poori'], ['missing (optimal)', 'Kitne chars abhi chahiye (t.length se shuru)'],
            ] } },
            { pre: `EXPAND  → right++, char jodo
COMPLETE? (missing == 0)
SHRINK  → answer update, left++ (jab tak complete rahe)
phir EXPAND` },
            { list: ['Clues: minimum window, contains all characters, smallest substring.'] },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 76', blocks: [{ problem: 76 }] },
        {
          title: 'Part 3 — Dry Run: "ADOBECODEBANC", t = "ABC"',
          blocks: [{ table: { head: ['Step', 'Window', 'Complete?', 'Action', 'best'], rows: [
            ['right 0..5', 'ADOBEC', 'Haan (missing 0)', 'record 6; A hatao → incomplete', '"ADOBEC"'],
            ['right 6..10', 'DOBECODEBA', 'Haan (naya A aaya)', 'shrink: D, O, B, E hatao (B extra tha) → "CODEBA" (6) — chhota nahi; C hatao → incomplete', '"ADOBEC" (6)'],
            ['right 11..12', '… BANC', 'Haan', 'shrink → "BANC" (4)', '<b>"BANC"</b>'],
          ] } }, { p: 'Visualizer me har step dekho — need[] ke + aur − values pe dhyan do.' }],
        },
        {
          title: 'Part 4 — Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute — har start se + covers(), O(n² · 128)</b>' }, { code: sol(76, 0) },
            { p: '<b>Better — need/window HashMap + formed, O(|s| + |t|)</b>' }, { code: sol(76, 1) },
            { p: '<b>Optimal — ek need[128] array + missing counter</b>' }, { code: sol(76, 2) },
            { lines: [
              ['if (need[c] > 0) missing--;', 'Zaroori char aaya.'],
              ['need[c]--;', 'Negative = extra copy.'],
              ['while (missing == 0)', 'Window complete → shrink.'],
              ['need[d]++; if (need[d] > 0) missing++;', 'Zaroori char gaya → incomplete.'],
            ] },
          ],
        },
        { title: 'Part 5 — Visualize', blocks: [{ viz: 76, ex: 0 }] },
        {
          title: 'Part 6 — Edge cases',
          blocks: [{ table: { head: ['Case', 'Answer', 'Kyun'], rows: [['s = "a", t = "a"', '"a"', 'Poora'], ['s = "a", t = "aa"', '""', 'Do a chahiye'], ['t me duplicates', 'Count se handle', 'need[c] = 2']] } }],
        },
        { title: 'Part 7 — Complexity', blocks: [{ table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n² · 128)', 'O(128)'], ['HashMap + formed', 'O(|s| + |t|)', 'O(charset)'], ['need[128] + missing', 'O(|s| + |t|)', 'O(128)']] } }] },
        {
          title: 'Part 8 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['Frequency map kyun?', 't me duplicates — sirf "hai/nahi" kaafi nahi.'],
            ['Valid window kab?', 'missing == 0 / formed == required.'],
            ['Shrink kyun zaroori?', 'Sabse chhoti chahiye — valid rahe tab tak kaato.'],
            ['need negative ka matlab?', 'Window me extra copy.'],
            ['Answer kab update?', 'Har valid window pe, shrink se pehle.'],
            ['bestStart kyun store?', 'End me substring nikaalna hai.'],
            ['LC 209 se farak?', 'Validity sum ki jagah frequency.'],
            ['Pattern?', 'Minimum Window (Frequency).'],
          ] }],
        },
        {
          title: 'Part 9 — Bade interview answers: aise bolo',
          blocks: [{ say: [
            ['Minimum Window Substring', 'I count how many of each character t needs and keep a missing counter equal to the length of t. I expand the right pointer; whenever an incoming character is still needed, missing goes down. When missing hits zero the window covers t, so I record it if it is the smallest so far and shrink from the left, restoring counts; if a removed character becomes needed again, missing goes up and I resume expanding. Each pointer moves at most |s| times, so O(|s| + |t|).'],
          ] }],
        },
        { title: 'Part 10 — Sohvi session (observe, no coding)', blocks: [{ olist: ['Visualizer chalao, har shrink pe bolo "kyun".', 'Samjho: shrink na karein toh chhoti window nahi milegi.', 'Part 1 ki table yaad karo.'] }] },
        { title: 'Part 11 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['<b>LC 76</b> — 30 min (Hard).', 'Frequency map, valid window, shrinking — teeno zubaani.', 'Better (HashMap) aur Optimal (array) dono likho.'] }] },
        { title: 'Part 12 — Homework', blocks: [{ list: ['<b>Dono:</b> LC 3, 209, 424, 76 — template me kya badalta hai? (state, validity, shrink kab, answer kab).', 'Kal (Day 28): Revision + Mock.'] }] },
        {
          title: 'Part 13 — Final self-test (bina notes)',
          blocks: [{ qa: [
            ['"ADOBECODEBANC", "ABC"?', '"BANC".'],
            ['"a", "aa"?', '"".'],
            ['missing shuru me?', 't.length().'],
            ['Time?', 'O(|s| + |t|).'],
            ['Pattern?', 'Minimum Window.'],
          ] }],
        },
      ],
      checks: ['needMap / windowMap / matched', 'Expand → complete → shrink → update', 'Sohvi: observe', 'Tum: LC 76 Accepted', '4 templates compare kiye', 'Self-test 5/5'],
      memory: 'Poora karo, phir kaato — chhota karte-karte record karo.',
    },

    // =====================================================================
    // DAY 28 (Sun) — Revision + Mock
    7: {
      title: 'Sliding Window Revision + Mock',
      goal: 'Title se pattern pehchano (fixed / variable / HashMap / frequency / expand–shrink). <b>Sohvi:</b> 643, 1456 bina notes. <b>Tum:</b> 3, 209, 424, 76 — 12-step interview order. Pattern Sheet + Week 4 Boss.',
      parts: [
        {
          title: 'Part 0 — Aaj ka session',
          blocks: [{ table: { head: ['Time', 'Slot', 'Aaj kya'], rows: [
            ['9:00–9:20', 'Pattern recognition', '6 titles → pattern'], ['9:20–9:50', 'Sohvi', '643, 1456 bina notes'], ['9:50–10:50', 'Tum', '3, 209, 424, 76 — 12 steps'], ['10:50', 'Boss', 'Week 4 Boss Battle'],
          ] } }],
        },
        {
          title: 'Part 1 — Pattern recognition: title se pehchano',
          blocks: [{ table: { head: ['Title', 'Window', 'Extra', 'Kyun'], rows: [
            ['Maximum Average Subarray', 'Fixed', '—', 'Size k diya'], ['Maximum Vowels', 'Fixed', 'count', 'Length k diya'],
            ['Longest Substring Without Repeating', 'Variable (longest)', 'HashSet / HashMap', '"without repeating"'], ['Minimum Size Subarray Sum', 'Variable (shortest)', 'sum', '"minimum", "≥ target"'],
            ['Longest Repeating Character Replacement', 'Variable (longest)', 'Frequency map', '"replace", "at most k"'], ['Minimum Window Substring', 'Variable (shortest)', 'Frequency map', '"contains all"'],
          ] } }],
        },
        {
          title: 'Part 2 — Week 4 Sliding Window Pattern Sheet (deliverable)',
          blocks: [{ table: { head: ['Pattern', 'Clues', 'Window', 'Core rule', 'Time', 'Space', 'Example'], rows: [
            ['Fixed Window', 'Exactly k, fixed size', 'Fixed', 'Add right, remove left', 'O(n)', 'O(1)', '643, 1456'],
            ['Variable Window', 'Longest/Shortest, at most/at least', 'Variable', 'Expand until invalid, shrink until valid', 'O(n)', 'O(n)', '3, 209'],
            ['Frequency Window', 'Character replacement', 'Variable', 'Track max frequency', 'O(n)', 'O(26)', '424'],
            ['Minimum Window', 'Contains all required chars', 'Variable', 'Expand to satisfy, shrink to minimise', 'O(n)', 'O(m)', '76'],
          ] } }],
        },
        {
          title: 'Part 3 — Sohvi: re-solve (bina notes)',
          blocks: [
            ...rev({ h: 'LC 643 — Max Average Subarray', p: 'Size k ka max average.', ex: '[1,12,−5,−6,50,3], 4 → 12.75', pat: 'Fixed Window', steps: ['Pehli window.', 'Ek andar, ek bahar.', 'best / k.'], code: ap(643, 1), hook: 'Ek andar, ek bahar.' }),
            ...rev({ h: 'LC 1456 — Max Vowels', p: 'Size k me max vowels.', ex: '"abciiidef", 3 → 3', pat: 'Fixed Window', steps: ['Pehli window gino.', '+1 / −1.', 'max.'], code: ap(1456, 1), hook: 'Aane wala +1, jaane wala −1.' }),
            { p: 'Har ek ke liye bolo: window size, pointer movement, time, space.' },
          ],
        },
        {
          title: 'Part 4 — Tum: 12-step interview order (3, 209, 424, 76)',
          blocks: [
            { olist: ['Problem clarify karo.', 'Sliding window pattern pehchano.', 'Brute force.', 'Brute slow kyun.', 'Window ki intuition.', 'Validity condition.', 'Expand rule.', 'Shrink rule.', 'Time complexity.', 'Space complexity.', 'Ek example pe dry run.', 'Bina dekhe code.'] },
            { table: { head: ['LC', 'State', 'Validity', 'Shrink kab', 'Answer kab'], rows: [
              ['3', 'HashMap last index', 'Koi repeat nahi', 'Repeat aaye (jump)', 'Har step'],
              ['209', 'sum', 'sum ≥ target', 'Jab tak valid', 'Shrink se pehle (min)'],
              ['424', 'count[26], maxFreq', 'len − maxFreq ≤ k', 'Jab tak invalid', 'Shrink ke baad (max)'],
              ['76', 'need[128], missing', 'missing == 0', 'Jab tak valid', 'Shrink se pehle (min)'],
            ] } },
            { code: ap(3, 2) }, { code: ap(209, 2) }, { code: ap(424, 1) }, { code: ap(76, 2) },
          ],
        },
        {
          title: 'Part 5 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['Fixed vs variable kaise pehchano?', 'k diya = fixed; longest/shortest + condition = variable.'],
            ['Longest me answer kab?', 'Shrink ke baad (valid).'],
            ['Shortest me answer kab?', 'Shrink se pehle, har valid pe.'],
            ['Sliding window O(n) kyun?', 'left, right dono max n.'],
            ['209 negative numbers pe?', 'Nahi chalta.'],
            ['424 validity?', 'len − maxFreq ≤ k.'],
            ['76 me missing?', 'Abhi kitne chars chahiye.'],
            ['Two pointers se farak?', 'Window ka state (sum/map) maintain karte.'],
          ] }],
        },
        {
          title: 'Part 6 — Mock ke bade answers: aise bolo',
          blocks: [{ say: [
            ['When do you use a sliding window?', 'When the problem asks about contiguous subarrays or substrings and the answer for one window can be updated from the previous one in O(1). A fixed length means a fixed window; a longest or shortest range under a condition means a variable window that expands on the right and shrinks on the left.'],
          ] }],
        },
        { title: 'Part 7 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['3, 209, 424, 76 — 12 steps, bina hint (15 / 10 / 20 / 30 min).', 'Sohvi ka 643, 1456 mock lo.', 'Pattern Sheet Sohvi ko samjhao.'] }] },
        { title: 'Part 8 — Boss Battle', blocks: [{ p: 'Home → <b>⚔️ Week 4 Boss</b> — is week ke saare quiz sawaal. 80%+ = week clear!' }] },
      ],
      checks: ['Pattern recognition table bina dekhe', 'Pattern Sheet bana li', 'Sohvi: 643, 1456 bina notes', 'Tum: 3, 209, 424, 76 — 12 steps', 'Week 4 Boss clear'],
      memory: 'Fixed: ek andar ek bahar. Variable: expand, phir shrink — longest baad me record, shortest pehle.',
    },
  });
})();
