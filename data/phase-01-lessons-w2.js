// Phase 1 (Arrays) — Week 2 lessons (local days 8–14). Day 1 wale format me.
// Week 2 = ADVANCED ARRAY PATTERNS — Interview Pattern Recognition (Sohel ka diya hua syllabus, 2026-11-07).
// Block types: p, h, list, olist, code, pre, table, problem, viz, lines, qa, say, tip
(function () {
  const P = window.PHASE_CONTENT['arrays'];
  P.lessons = P.lessons || {};
  const ap = (n, i) => P.questions[n].approaches[i].code;
  const sol = (n, i) => 'class Solution {\n' + ap(n, i).split('\n').map(l => '    ' + l).join('\n') + '\n}';
  const rev = o => [
    { h: o.h },
    { p: o.p },
    { pre: o.ex },
    { p: '<b>Pattern:</b> ' + o.pat },
    { olist: o.steps },
    { code: o.code },
    { tip: '<b>Memory hook:</b> ' + o.hook },
  ];
  const session = (theory, dry, coding, lc) => ({ table: { head: ['Time', 'Slot', 'Aaj kya'], rows: [
    ['9:00–9:30', 'Theory', theory],
    ['9:30–9:50', 'Visualization + dry run together', dry],
    ['9:50–10:10', 'Coding', coding],
    ['10:10–10:30', 'Individual (Sohvi / Tum) + homework', lc],
  ] } });
  const FIRST = '<b>Week 2 ka pehla sawaal har question pe:</b> "Ye question <b>kis pattern</b> ka hai?" — Week 1 = Array Fundamentals, Week 2 = Interview Pattern Recognition.';
  const clues = items => ({ table: { head: ['Recognition clue (question me ye dikhe)', 'Matlab'], rows: items } });

  Object.assign(P.lessons, {
    // =====================================================================
    // DAY 8 — Kadane's Algorithm (Module 6)
    8: {
      title: "Kadane's Algorithm — Maximum Subarray",
      goal: 'Maximum <b>contiguous</b> subarray sum ek pass me. Local answer vs global answer, running sum <b>kab reset</b> karna hai, aur Kadane O(n) kyun. <b>Sohvi:</b> brute force, phir Kadane samjho (LC 53). <b>Tum:</b> LC 53 + verbal "kyun".',
      main: 53,
      parts: [
        {
          title: 'Part 0 — Week 2 Objective + Revision (Week 1) + Aaj ka session',
          blocks: [
            { p: FIRST },
            { table: { head: ['Sohvi — Week 2', 'Tum — Week 2'], rows: [
              ['Kadane intuition', 'Interview-level array patterns'],
              ['Prefix revision', 'Pattern recognition speed'],
              ['Missing Number pattern', 'Optimal solution confidently explain'],
              ['Pattern identify karna', 'Reusable templates'],
              ['Easy → Medium transition', '—'],
            ] } },
            { table: { head: ['Module', 'Pattern', 'Din'], rows: [
              ['6', "Kadane's Algorithm", 'Day 8'],
              ['7', 'Prefix Product', 'Day 9'],
              ['8', 'Index Placement', 'Day 10'],
              ['9', 'HashSet Sequence', 'Day 11'],
              ['10', 'Prefix + HashMap', 'Day 12'],
            ] } },
            session('Module 6: brute O(n²) vs Kadane O(n); local vs global; reset', '<code>[-2,1,-3,4,-1,2,1,-5,4]</code> table — har row explain', 'Sohvi: brute · Tum: Kadane', 'Kadane bina dekhe + clues likho'),
            ...rev({
              h: 'LC 1480 — Running Sum (Week 1)',
              p: 'Running sum — aaj Kadane me yahi running sum "reset" ke saath.',
              ex: '[1,2,3,4] → [1,3,6,10]',
              pat: 'Prefix / running sum',
              steps: ['i = 1 se.', 'nums[i] += nums[i − 1].'],
              code: ap(1480, 1),
              hook: 'Pichla total + aaj ka.',
            }),
            ...rev({
              h: 'LC 560 — Subarray Sum Equals K (Week 1)',
              p: 'Sum = k wale subarrays gino.',
              ex: '[1,2,3], k = 3 → 2',
              pat: 'Prefix + HashMap',
              steps: ['freq{0:1}.', 'count += freq[sum − k].', 'freq[sum]++.'],
              code: ap(560, 2),
              hook: 'sum − k pehle dekha?',
            }),
          ],
        },
        {
          title: 'Part 1 — Theory: Problem + Brute O(n²) kyun',
          blocks: [
            { p: '<b>Problem:</b> Array me <b>contiguous</b> (lagaatar) subarray dhoondo jiska sum sabse bada ho.' },
            { p: '<b>Brute:</b> Har start i, har end j — running sum ke saath O(n²). (Andar ek aur loop se sum karo toh O(n³).)' },
            { code: `int max = Integer.MIN_VALUE;
for (int i = 0; i < n; i++) {
    int sum = 0;
    for (int j = i; j < n; j++) {
        sum += nums[j];              // i..j ka sum
        max = Math.max(max, sum);
    }
}` },
            { p: '<b>Kya waste ho raha hai?</b> Har index j pe hum "j pe khatam hone wala sabse achha subarray" dobara-dobara dhoondh rahe hain. Kadane ise <b>ek variable</b> me yaad rakhta hai.' },
          ],
        },
        {
          title: 'Part 2 — Pattern: Local Maximum vs Global Maximum + Reset',
          blocks: [
            { pre: `Current Sum = max(arr[i], Current Sum + arr[i])     ← local: i pe khatam hone wala best
Maximum Sum = max(Maximum Sum, Current Sum)          ← global: ab tak ka best` },
            { table: { head: ['Term', 'Matlab'], rows: [
              ['Running sum', 'Ab tak jodte aa rahe hain'],
              ['Local maximum (current)', 'Index i pe <b>khatam</b> hone wala sabse bada sum'],
              ['Global maximum (best)', 'Kahin bhi khatam hone wala sabse bada sum'],
            ] } },
            { p: '<b>Reset kab?</b> Jab <code>current + arr[i] &lt; arr[i]</code>, yaani pichla running sum <b>negative</b> hai — woh sirf bojh hai. Usse chhod ke arr[i] se naya shuru karo.' },
            clues([
              ['Maximum contiguous subarray', 'Kadane'],
              ['Largest sum', 'Kadane'],
              ['Continuous elements', 'Subarray (contiguous) — subsequence nahi'],
              ['Max profit (stock type variant)', 'Kadane ka intuition: aaj ka best = kal ka best ya naya shuru'],
            ]),
          ],
        },
        { title: 'Part 3 — Aaj ka problem: LC 53 Maximum Subarray', blocks: [{ problem: 53 }] },
        {
          title: 'Part 4 — Visualization + Dry Run Together: [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
          blocks: [
            { table: { head: ['Index', 'Value', 'Current Sum', 'Max Sum', 'Kya hua'], rows: [
              ['0', '−2', '−2', '−2', 'Pehla element'],
              ['1', '1', '1', '1', '<b>Reset</b>: −2 + 1 = −1 &lt; 1 → naya shuru'],
              ['2', '−3', '−2', '1', 'Extend: 1 − 3 = −2 (−3 se behtar)'],
              ['3', '4', '4', '4', '<b>Reset</b>: −2 + 4 = 2 &lt; 4'],
              ['4', '−1', '3', '4', 'Extend'],
              ['5', '2', '5', '5', 'Extend, naya max'],
              ['6', '1', '6', '<b>6</b>', 'Extend, naya max → [4,−1,2,1]'],
              ['7', '−5', '1', '6', 'Extend (1 &gt; −5)'],
              ['8', '4', '5', '6', 'Extend'],
            ] } },
            { p: '<b>Dono har row explain karo:</b> "current = max(value, current + value) — kyunki…" Answer <b>6</b>, subarray <code>[4, −1, 2, 1]</code>.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute (Sohvi pehle ye)</b>' },
            { code: sol(53, 1) },
            { p: '<b>Optimal — Kadane</b>' },
            { code: sol(53, 2) },
            { lines: [
              ['int cur = 0, best = Integer.MIN_VALUE;', 'best MIN_VALUE se — saare negative hon toh bhi sahi (0 se shuru kiya toh galat).'],
              ['cur = Math.max(x, cur + x);', 'Extend karo ya yahan se naya shuru — jo bada ho.'],
              ['best = Math.max(best, cur);', 'Global best update.'],
              ['return best;', 'Kahin bhi khatam hone wala sabse bada sum.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize: Kadane line-by-line',
          blocks: [
            { list: ['Har step pe <code>cur</code> aur <code>best</code> VARIABLES me dekho.', 'Reset wale steps (index 1, 3) pe dhyaan do.', 'Example 3 (<code>[5,4,−1,7,8]</code>) me kabhi reset nahi — poora array = 23.'] },
            { viz: 53, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[1]</code>', '1', 'Ek element'],
              ['<code>[−3,−1,−2]</code>', '−1', 'Saare negative — best ko MIN_VALUE se shuru karna zaroori'],
              ['<code>[5,4,−1,7,8]</code>', '23', 'Negative beech me, par reset nahi — poora lena better'],
              ['<code>[0,0,0]</code>', '0', '—'],
            ] } },
            { tip: 'Maine Java me chalaya: [−3,−1,−2] → −1 ✓.' },
          ],
        },
        {
          title: 'Part 8 — Complexity + Kadane O(n) kyun',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute (triple loop)', 'O(n³)', 'O(1)'], ['Brute (running sum)', 'O(n²)', 'O(1)'], ['Kadane', 'O(n)', 'O(1)']] } },
            { p: '<b>O(n) kyun:</b> Har index pe sirf ek decision (extend ya reset) — j pe khatam hone wala best, j−1 wale best se O(1) me nikal aata hai.' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Current sum kya represent karta hai?', 'Current index pe khatam hone wala sabse bada subarray sum.'],
              ['Max sum kya?', 'Ab tak ka global best.'],
              ['Reset kab?', 'Jab pichla running sum negative ho — current + x &lt; x.'],
              ['best ko 0 se shuru kiya toh?', 'Saare negative pe galat 0.'],
              ['Subarray vs subsequence?', 'Subarray contiguous; subsequence me gap allowed.'],
              ['Subarray ke indices bhi chahiye?', 'Reset pe start = i; best update pe (start, i) save.'],
              ['Kadane kis technique ka simple roop hai?', 'DP — dp[i] = max(x, dp[i−1] + x), sirf pichli value chahiye.'],
              ['Space?', 'O(1).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach', "Brute force tries every start and end, which is O(n²) even with a running sum. Kadane keeps two values while scanning once: the best sum of a subarray ending at the current index, and the best sum overall. At each element I either extend the previous subarray or start fresh, current = max(x, current + x), and then update best. If the previous running sum is negative it only drags the total down, so starting fresh is better. O(n) time, O(1) space."],
              ['Why reset? Why two variables?', 'The running sum answers a local question: what is the best subarray that ends exactly here. The maximum sum answers the global question across all endings. Resetting happens when the local sum so far is negative, because adding a negative prefix to anything makes it smaller.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: ['Brute force maximum subarray (running sum, O(n²)) likho aur chalao.', 'Part 4 ki table khud bharo, har row ka reason bolo.', 'Phir Kadane padho aur <b>LC 53</b> submit.'] },
          ],
        },
        {
          title: 'Part 12 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['<b>LC 53</b> Kadane submit.', 'Verbally: reset kyun? current sum kyun? maximum sum kyun?', 'Bonus soch: subarray ke start/end indices bhi return karo.'] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['<b>Dono:</b> Kadane bina dekhe likho.', '<b>Dono:</b> Time complexity, space complexity aur recognition clues likho (Pattern notebook me).', 'Kal (Day 9): Product Except Self — prefix × suffix.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[2,−1,2]</code> ka answer?', '3 (poora array).'],
              ['<code>[−2,−5]</code>?', '−2.'],
              ['Kadane ki 2 lines?', '<code>cur = max(x, cur + x); best = max(best, cur);</code>'],
              ['Recognition clue?', 'Maximum contiguous sum.'],
              ['Complexity?', 'O(n) / O(1).'],
            ] },
          ],
        },
      ],
      checks: [
        'Brute O(n²) aur Kadane O(n) ka farak',
        'Local vs global maximum samjha',
        'Reset kab — bata sakta/sakti hu',
        'Dry-run table ki har row explain ki',
        'Sohvi: brute + LC 53 Accepted',
        'Tum: LC 53 + 3 "kyun" zubaani',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Pichla sum bojh ho toh chhod do (reset); warna saath le chalo. Sabse achha hamesha yaad rakho.',
    },

    // =====================================================================
    // DAY 9 — Product Except Self (Module 7)
    9: {
      title: 'Product Except Self — Prefix × Suffix Product',
      goal: 'Har element ke liye <b>baaki sab ka product</b> — <b>division ke bina</b>, O(n). Left (prefix) product × Right (suffix) product. <b>Sohvi:</b> sirf paper pe Left/Right arrays. <b>Tum:</b> LC 238.',
      main: 238,
      parts: [
        {
          title: 'Part 0 — Revision (kal ka) + Aaj ka session',
          blocks: [
            { p: FIRST },
            session('Module 7: prefix/suffix product, division kyun nahi', '<code>[1,2,3,4]</code>: Left, Right, Answer teeno arrays', 'Tum: LC 238 (pehle 3 arrays, phir O(1) extra)', 'Sohvi: paper · homework <code>[2,3,4,5]</code>'),
            ...rev({
              h: 'LC 53 — Maximum Subarray (kal ka)',
              p: 'Max contiguous sum.',
              ex: '[-2,1,-3,4,-1,2,1,-5,4] → 6',
              pat: 'Kadane',
              steps: ['cur = max(x, cur + x).', 'best = max(best, cur).'],
              code: ap(53, 2),
              hook: 'Bojh ho toh chhodo.',
            }),
          ],
        },
        {
          title: 'Part 1 — Theory: Problem + constraints',
          blocks: [
            { p: '<b>Problem:</b> <code>answer[i]</code> = nums ke saare elements ka product <b>nums[i] ko chhod ke</b>.' },
            { list: ['<b>Division nahi</b> — total product / nums[i] allowed nahi (aur 0 hone pe toot bhi jaata hai).', '<b>O(n)</b> chahiye.'] },
            { p: '<b>Brute:</b> Har i ke liye baaki sab multiply → O(n²).' },
            { p: '<b>Insight:</b> "i ko chhod ke sab" = <b>i ke left wale sab</b> × <b>i ke right wale sab</b>.' },
          ],
        },
        {
          title: 'Part 2 — Concepts: Left (Prefix) + Right (Suffix) Product',
          blocks: [
            { table: { head: ['Term', 'Matlab', 'Formula'], rows: [
              ['Left / Prefix product', 'i se pehle sab ka product', 'left[0] = 1, left[i] = left[i−1] × nums[i−1]'],
              ['Right / Suffix product', 'i ke baad sab ka product', 'right[n−1] = 1, right[i] = right[i+1] × nums[i+1]'],
              ['Answer', 'Dono ka product', 'ans[i] = left[i] × right[i]'],
            ] } },
            { tip: 'Prefix <b>sum</b> me khaali ka value 0 hota hai; prefix <b>product</b> me khaali ka value <b>1</b> (multiply ka identity).' },
            clues([['Product of all except current', 'Prefix × Suffix'], ['No division allowed', 'Prefix × Suffix'], ['O(n) expected', 'Do pass']]),
          ],
        },
        {
          title: 'Part 3 — Visualization + Dry Run: [1, 2, 3, 4]',
          blocks: [
            { pre: `Array   :   1    2    3    4
Left    :   1    1    2    6        (i se pehle ka product)
Right   :  24   12    4    1        (i ke baad ka product)
Answer  :  24   12    8    6        (Left × Right)` },
            { table: { head: ['i', 'nums[i]', 'Left[i]', 'Right[i]', 'Answer'], rows: [
              ['0', '1', '1 (kuch nahi)', '2×3×4 = 24', '24'],
              ['1', '2', '1', '3×4 = 12', '12'],
              ['2', '3', '1×2 = 2', '4', '8'],
              ['3', '4', '1×2×3 = 6', '1 (kuch nahi)', '6'],
            ] } },
            { p: '<b>Multiplication kyun kaam karta hai:</b> Left[i] × Right[i] me nums[i] ko chhod ke <b>har element exactly ek baar</b> aata hai.' },
          ],
        },
        { title: 'Part 4 — Aaj ka problem (Tum): LC 238 Product of Array Except Self', blocks: [{ problem: 238 }] },
        {
          title: 'Part 5 — Thinking: Brute → Better (3 arrays) → Optimal (O(1) extra)',
          blocks: [
            { table: { head: ['Level', 'Idea', 'Time', 'Extra space'], rows: [
              ['Brute', 'Har i pe baaki sab multiply', 'O(n²)', 'O(1)'],
              ['Better', 'left[], right[], ans[]', 'O(n)', 'O(n)'],
              ['Optimal', 'ans[] me left bharo, right ko ek variable (suffix) me chalao', 'O(n)', 'O(1) (output ke alawa)'],
            ] } },
          ],
        },
        {
          title: 'Part 6 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Better — teen arrays (samajhne ke liye)</b>' },
            { code: sol(238, 1) },
            { p: '<b>Optimal — O(1) extra</b>' },
            { code: sol(238, 2) },
            { lines: [
              ['ans[0] = 1;', 'Index 0 ke left me kuch nahi → 1.'],
              ['ans[i] = ans[i - 1] * nums[i - 1];', 'Pehle pass: ans me left products.'],
              ['int suffix = 1;', 'Right product ek variable me — array nahi.'],
              ['ans[i] *= suffix;', 'Left (ans me) × right (suffix).'],
              ['suffix *= nums[i];', 'Agle (left wale) index ke liye suffix badhao.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Visualize',
          blocks: [
            { list: ['Pehle pass me left products bharte dekho, doosre me suffix multiply hote.', 'Example 2 me 0 hai — dekho division ke bina bhi sahi.'] },
            { viz: 238, ex: 0 },
          ],
        },
        {
          title: 'Part 8 — Edge cases: zeros',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[−1,1,0,−3,3]</code>', '<code>[0,0,9,0,0]</code>', 'Ek zero: sirf us index ka answer non-zero'],
              ['<code>[0,0,2]</code>', '<code>[0,0,0]</code>', 'Do zero: sab 0'],
              ['<code>[2,3]</code>', '<code>[3,2]</code>', 'Do element'],
            ] } },
            { p: '<b>Division kyun nahi:</b> total/nums[i] — nums[i] = 0 pe divide by zero; aur ek zero pe total hi 0 ho jaata hai, toh baaki answers galat.' },
          ],
        },
        {
          title: 'Part 9 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Extra space'], rows: [['Brute', 'O(n²)', 'O(1)'], ['3 arrays', 'O(n)', 'O(n)'], ['Optimal', 'O(n)', 'O(1)*']] } },
            { p: '* Output array space me nahi gina jaata (LeetCode follow-up ke hisaab se).' },
          ],
        },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Prefix kyun?', 'i se pehle ke sab ka product chahiye.'],
              ['Suffix kyun?', 'i ke baad ke sab ka product chahiye.'],
              ['Division kyun nahi?', 'Problem mana karta hai; 0 pe toot jaata hai.'],
              ['left[0] = 1 kyun, 0 kyun nahi?', 'Multiply ka identity 1; 0 se sab 0 ho jaayega.'],
              ['O(1) extra kaise?', 'Left ans me, right ek variable me.'],
              ['Do zero hon toh?', 'Har answer 0.'],
              ['Kaun sa pattern?', 'Prefix product × suffix product.'],
              ['Overflow?', 'Problem guarantee deta hai product int me fit.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach', 'The product of everything except index i equals the product of the elements to its left times the product of the elements to its right. In a first pass from the left I store the left products in the answer array, starting with 1. In a second pass from the right I keep a running suffix product and multiply it into each answer, then update the suffix. That is O(n) time and O(1) extra space besides the output, and it needs no division, so zeros are handled naturally.'],
              ['Why not division?', 'Dividing the total product by nums[i] fails when nums[i] is zero, and if there is one zero the total is zero, which breaks every other answer. The problem also forbids it, so prefix and suffix products are the clean way.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohvi session (No coding)',
          blocks: [
            { olist: ['Sirf paper pe <code>[1,2,3,4]</code> ke <b>Left</b> aur <b>Right</b> arrays bharo.', 'Answer = Left × Right nikaalo.', 'Apne shabdon me batao: multiplication kyun kaam karta hai.'] },
          ],
        },
        {
          title: 'Part 13 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['<b>LC 238</b> — pehle 3 arrays, phir O(1) extra version submit.', 'Coding ke baad explain: prefix kyun? suffix kyun? division kyun nahi?', 'Zero wale 2 edge cases dry run.'] },
          ],
        },
        {
          title: 'Part 14 — Homework',
          blocks: [
            { list: ['<b>Dono:</b> <code>[2,3,4,5]</code> ka dry run — Left, Right, Answer.', 'Kal (Day 10): Missing Number pattern — LC 268 + LC 41.'] },
            { qa: [['[2,3,4,5] ka answer check?', 'Left [1,2,6,24], Right [60,20,5,1], Answer [60,40,30,24].']] },
          ],
        },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[3,1,2]</code> ka answer?', '[2,6,3].'],
              ['Uske Left array?', '[1,3,3].'],
              ['Uske Right array?', '[2,2,1].'],
              ['Prefix product ka starting value?', '1.'],
              ['Optimal extra space?', 'O(1) (output ke alawa).'],
            ] },
          ],
        },
      ],
      checks: [
        'Left × Right ka idea samjha',
        '[1,2,3,4] ke teeno arrays khud bhare',
        'Division kyun nahi — zero ka case',
        'Sohvi: paper pe Left/Right + explanation',
        'Tum: LC 238 (3 arrays + O(1) extra) Accepted',
        '[2,3,4,5] homework dry run',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Mujhe chhod ke sab = mere left wale sab × mere right wale sab.',
    },

    // =====================================================================
    // DAY 10 — Missing Number Pattern (Module 8)
    10: {
      title: 'Missing Number Pattern — XOR / Sum + Index Placement',
      goal: 'Numbers ki <b>apni jagah</b> hoti hai (1 → index 0, 2 → index 1…). <b>Sohvi:</b> LC 268 — XOR (sum formula optional). <b>Tum:</b> LC 41 — cyclic placement, O(n), constant space.',
      main: 268,
      parts: [
        {
          title: 'Part 0 — Revision (kal ka) + Aaj ka session',
          blocks: [
            { p: FIRST },
            session('Module 8: number apni position pe kyun', '<code>[3,4,−1,1]</code> — values ko sahi jagah move karo', 'Sohvi: LC 268 XOR · Tum: LC 41', 'Comparison table (268 vs 41)'),
            ...rev({
              h: 'LC 238 — Product Except Self (kal ka)',
              p: 'Mujhe chhod ke sab ka product.',
              ex: '[1,2,3,4] → [24,12,8,6]',
              pat: 'Prefix × Suffix product',
              steps: ['ans me left products.', 'Right se suffix multiply.'],
              code: ap(238, 2),
              hook: 'Left × Right.',
            }),
          ],
        },
        {
          title: 'Part 1 — Theory: Numbers ki apni jagah',
          blocks: [
            { pre: `1 belongs at index 0
2 belongs at index 1
3 belongs at index 2
…
v belongs at index v − 1        (0..n wali problems me: v at index v)` },
            { p: 'Jab values ek <b>chhote range (0..n ya 1..n)</b> me hon, toh array khud hi ek <b>hash table</b> ban sakta hai — index = value. Extra memory nahi chahiye.' },
            clues([['Numbers 1…n (ya 0…n)', 'Index placement / math'], ['Missing number', 'Sum / XOR / placement'], ['Smallest missing positive', 'Cyclic placement'], ['Rearrange array', 'Index mapping']]),
          ],
        },
        { title: 'Part 2 — Sohvi ka problem: LC 268 Missing Number', blocks: [{ problem: 268 }] },
        {
          title: 'Part 3 — LC 268: Sum formula (optional) aur XOR',
          blocks: [
            { p: '<b>Sum formula:</b> 0..n ka sum = <code>n(n+1)/2</code>. Usme se array ka sum ghatao = missing.' },
            { pre: `[3,0,1], n = 3:  expected = 3×4/2 = 6, actual = 4 → missing = 2` },
            { p: '<b>XOR (main):</b> XOR ke 2 rule: <code>a ^ a = 0</code> aur <code>a ^ 0 = a</code>. 0..n saare indices aur saari values XOR karo — jo number dono jagah hai woh cancel, missing akela bachta hai.' },
            { table: { head: ['Step', 'xor', 'Kya cancel hua'], rows: [
              ['start', '3 (= n)', '—'],
              ['i = 0: ^0 ^3', '3^0^3 = 0', '3 cancel'],
              ['i = 1: ^1 ^0', '0^1^0 = 1', '0 cancel'],
              ['i = 2: ^2 ^1', '1^2^1 = 2', '1 cancel'],
              ['return', '<b>2</b>', '2 ka jodi nahi'],
            ] } },
            { code: sol(268, 2) },
            { lines: [
              ['int xor = n;', 'Loop indices 0..n−1 deta hai — n ko pehle hi daal do.'],
              ['xor ^= i ^ nums[i];', 'Index aur value dono XOR — jode cancel.'],
              ['return xor;', 'Missing number.'],
            ] },
            { code: sol(268, 1) },
            { viz: 268, ex: 0 },
          ],
        },
        {
          title: 'Part 4 — Tum ka problem: LC 41 First Missing Positive',
          blocks: [{ problem: 41 }],
        },
        {
          title: 'Part 5 — Visualization + Dry Run: [3, 4, −1, 1] — values ko sahi jagah bhejo',
          blocks: [
            { table: { head: ['i', 'nums[i]', 'Sahi jagah', 'Action', 'Array ke baad'], rows: [
              ['0', '3', 'index 2', 'swap(0, 2)', '[−1, 4, 3, 1]'],
              ['0', '−1', '— (range ke bahar)', 'aage badho', '[−1, 4, 3, 1]'],
              ['1', '4', 'index 3', 'swap(1, 3)', '[−1, 1, 3, 4]'],
              ['1', '1', 'index 0', 'swap(1, 0)', '[1, −1, 3, 4]'],
              ['1', '−1', '—', 'aage', '[1, −1, 3, 4]'],
              ['2', '3', 'index 2 ✓', 'already sahi', '[1, −1, 3, 4]'],
              ['3', '4', 'index 3 ✓', 'already sahi', '[1, −1, 3, 4]'],
            ] } },
            { p: '<b>Final scan:</b> index 0 = 1 ✓, index 1 = −1 ≠ 2 → <b>answer 2</b>.' },
          ],
        },
        {
          title: 'Part 6 — LC 41: Complete Java code + har line ka purpose',
          blocks: [
            { code: sol(41, 2) },
            { lines: [
              ['while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i])', 'Range 1..n me ho, aur apni jagah pe pehle se wahi value na ho (duplicate pe infinite loop se bachne ke liye).'],
              ['int j = nums[i] - 1;', 'Value v ki sahi jagah v − 1.'],
              ['tmp swap', 'v ko uski jagah bhejo; wahan wala value i pe aa gaya — while dobara check karega.'],
              ['if (nums[i] != i + 1) return i + 1;', 'Pehli galat jagah = pehla missing positive.'],
              ['return n + 1;', '1..n sab maujood.'],
            ] },
            { viz: 41, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Cyclic placement O(n) kyun, constant space kyun',
          blocks: [
            { list: [
              '<b>O(n):</b> while loop andar hai, par <b>har swap ek value ko uski final jagah</b> pahunchata hai. Ek value ek hi baar final jagah jaati hai → poore algorithm me zyada se zyada n swaps.',
              '<b>Constant space:</b> Koi HashSet nahi — array khud hi "seen" table hai.',
              '<b>Answer 1..n+1 hi kyun:</b> n elements me se agar 1..n sab hain toh n + 1; warna 1..n me koi missing.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Edge cases',
          blocks: [
            { table: { head: ['Problem', 'Input', 'Output', 'Kyun'], rows: [
              ['268', '<code>[0]</code>', '1', 'n = 1, range 0..1'],
              ['268', '<code>[1]</code>', '0', '0 missing'],
              ['41', '<code>[1,2,0]</code>', '3', '1, 2 hain → 3'],
              ['41', '<code>[7,8,9,11,12]</code>', '1', 'Sab range ke bahar'],
              ['41', '<code>[1,1]</code>', '2', 'Duplicate — while ka 3rd condition'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Complexity + Comparison',
          blocks: [
            { table: { head: ['Problem', 'Technique', 'Time', 'Space'], rows: [
              ['268', 'Math / XOR', 'O(n)', 'O(1)'],
              ['41', 'Index Placement (cyclic)', 'O(n)', 'O(1)'],
              ['268 (brute)', 'Sort', 'O(n log n)', 'O(1)'],
              ['41 (better)', 'HashSet', 'O(n)', 'O(n)'],
            ] } },
          ],
        },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['XOR ke 2 rules?', 'a ^ a = 0, a ^ 0 = a (order matter nahi karta).'],
              ['268 me xor ko n se kyun shuru?', 'Index loop 0..n−1; n ko bhi range me shamil karna hai.'],
              ['Sum formula ka risk?', 'Bade n pe overflow (yahan n ≤ 10⁴ toh theek); XOR me nahi.'],
              ['41 ka answer kis range me?', '1 se n + 1.'],
              ['41 me while ka 3rd condition kyun?', 'Duplicate value pe infinite swap se bachne ke liye.'],
              ['41 O(n) kyun jabki while andar hai?', 'Total swaps ≤ n.'],
              ['41 constant space kyun?', 'Array hi hash table.'],
              ['268 vs 41 technique?', 'Math/XOR vs index placement.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['LC 268 (XOR)', 'The array holds n distinct numbers from 0 to n, so exactly one is missing. I XOR all indices from 0 to n together with all the values. Every number that is present appears once as an index and once as a value, so it cancels out, because a ^ a = 0. Only the missing number is left. O(n) time, O(1) space, and unlike the sum formula there is no overflow risk.'],
              ['LC 41 (cyclic placement)', 'The answer must be in 1 to n + 1, so I use the array itself as the lookup table, placing value v at index v − 1. I swap each value in range into its correct position, skipping values out of range and duplicates. Each swap fixes one value permanently, so at most n swaps happen: O(n) time with O(1) extra space. Then the first index whose value is not index + 1 gives the answer, or n + 1 if every position is correct.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohvi session',
          blocks: [
            { olist: ['<b>LC 268</b> — XOR solution samjho aur submit.', 'Part 3 ki XOR table khud bharo.', 'Sum formula optional.', 'Part 5 ka movement sirf dekho (LC 41 Tum ka hai).'] },
          ],
        },
        {
          title: 'Part 13 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['<b>LC 41</b> submit.', 'Explain: cyclic placement, O(n) kyun, constant space kyun.', '<code>[1,1]</code> aur <code>[7,8,9]</code> pe dry run.', 'LC 268 XOR bhi 2 min me.'] },
          ],
        },
        {
          title: 'Part 14 — Homework',
          blocks: [
            { table: { head: ['Problem', 'Technique'], rows: [['268', 'Math / XOR'], ['41', 'Index Placement']] } },
            { list: ['<b>Dono:</b> Upar ki comparison table apne Pattern notebook me — har technique ke saath "kab use karna".', 'Kal (Day 11): Longest Consecutive Sequence — HashSet.'] },
          ],
        },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[0,2]</code> LC 268?', '1.'],
              ['<code>[2,1]</code> LC 41?', '3.'],
              ['<code>[1,3]</code> LC 41?', '2.'],
              ['Value v ki jagah (1..n)?', 'Index v − 1.'],
              ['5 ^ 5 ^ 7?', '7.'],
            ] },
          ],
        },
      ],
      checks: [
        'Value → index mapping samjha',
        'XOR ke 2 rules + LC 268 table',
        '[3,4,−1,1] ka movement khud kiya',
        'Sohvi: LC 268 (XOR) Accepted',
        'Tum: LC 41 Accepted + O(n)/O(1) explain',
        '268 vs 41 comparison table',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Har number ka apna ghar (index v − 1). Jo ghar khaali, wahi missing. XOR me jode kat jaate hain.',
    },

    // =====================================================================
    // DAY 11 — Longest Consecutive Sequence (Module 9)
    11: {
      title: 'Longest Consecutive Sequence — HashSet Sequence Pattern',
      goal: 'Brute → Sorting → HashSet; HashSet kyun jeet-ta hai. <b>Sirf sequence ke start</b> se ginna — isliye har element ek baar. <b>Sohvi:</b> sirf "start of sequence" samjho. <b>Tum:</b> LC 128.',
      main: 128,
      parts: [
        {
          title: 'Part 0 — Revision (kal ka) + Aaj ka session',
          blocks: [
            { p: FIRST },
            session('Module 9: brute vs sort vs HashSet', '<code>[100,4,200,1,3,2]</code> HashSet + sequence starts', 'Tum: LC 128', 'O(n) kyun — likhna'),
            ...rev({
              h: 'LC 41 — First Missing Positive (kal ka)',
              p: 'Sabse chhota missing positive.',
              ex: '[3,4,-1,1] → 2',
              pat: 'Index placement',
              steps: ['v ko index v − 1 pe swap.', 'Pehla nums[i] != i + 1 → i + 1.'],
              code: ap(41, 2),
              hook: 'Har number apne ghar.',
            }),
            ...rev({
              h: 'LC 217 — Contains Duplicate (Week 1)',
              p: 'HashSet "pehle dekha?" — aaj HashSet "agla hai?"',
              ex: '[1,2,3,1] → true',
              pat: 'HashSet',
              steps: ['add false → true.'],
              code: ap(217, 2),
              hook: 'HashSet = O(1) presence.',
            }),
          ],
        },
        {
          title: 'Part 1 — Theory: Brute → Sorting → HashSet',
          blocks: [
            { table: { head: ['Approach', 'Idea', 'Time', 'Space'], rows: [
              ['Brute', 'Har x se x+1, x+2… array me linear search', 'O(n³) worst', 'O(1)'],
              ['Sorting', 'Sort, phir lagaatar run gino (duplicates skip)', 'O(n log n)', 'O(1)'],
              ['HashSet', 'Set me daalo; sirf start se gino', 'O(n)', 'O(n)'],
            ] } },
            { p: '<b>HashSet kyun jeet-ta hai:</b> "x + 1 hai?" O(1) me; aur start-only rule se koi number dobara nahi gina jaata.' },
            clues([['Longest consecutive', 'HashSet sequence'], ['Sequence / consecutive numbers', 'HashSet sequence'], ['O(n) expected (sort mana)', 'HashSet']]),
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 128 Longest Consecutive Sequence', blocks: [{ problem: 128 }] },
        {
          title: 'Part 3 — Visualization: HashSet + sequence start',
          blocks: [
            { pre: `Array   : 100   4   200   1   3   2
HashSet : {1, 2, 3, 4, 100, 200}

Kaun start hai? (x − 1 set me NAHI)
  1   → 0 nahi  → START  → 1,2,3,4      → length 4
  2   → 1 hai   → skip (beech ka)
  3   → 2 hai   → skip
  4   → 3 hai   → skip
  100 → 99 nahi → START  → 100          → length 1
  200 → 199 nahi→ START  → 200          → length 1` },
            { p: '<b>Sirf start se kyun?</b> Agar 2 se bhi ginna shuru karte toh 2,3,4 dobara gine jaate — O(n²). Start-only rule se har sequence <b>ek hi baar</b>, apne pehle number se.' },
          ],
        },
        {
          title: 'Part 4 — Dry Run table',
          blocks: [
            { table: { head: ['x (set se)', 'x − 1 set me?', 'Start?', 'Count', 'best'], rows: [
              ['1', 'Nahi (0)', 'Haan', '1→2→3→4 = 4', '4'],
              ['2', 'Haan', 'Nahi', '—', '4'],
              ['3', 'Haan', 'Nahi', '—', '4'],
              ['4', 'Haan', 'Nahi', '—', '4'],
              ['100', 'Nahi', 'Haan', '1', '4'],
              ['200', 'Nahi', 'Haan', '1', '<b>4</b>'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Better — sort</b>' },
            { code: sol(128, 1) },
            { p: '<b>Optimal — HashSet</b>' },
            { code: sol(128, 2) },
            { lines: [
              ['for (int x : nums) set.add(x);', 'O(1) lookup + duplicates apne aap hat gaye.'],
              ['for (int x : set)', 'Set pe loop — duplicate dobara nahi.'],
              ['if (!set.contains(x - 1))', 'x sequence ka start hai.'],
              ['while (set.contains(x + len)) len++;', 'Aage ginte jao.'],
              ['best = Math.max(best, len);', 'Sabse lamba.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['Start wale numbers pe hi while chalta hai — baaki skip.', 'Example 2 (9 length) chalao.'] },
            { viz: 128, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Har element ek baar kyun visit hota hai (O(n))',
          blocks: [
            { list: [
              'Outer loop: har distinct number ek baar → O(n).',
              'Inner while sirf <b>start</b> pe chalta hai, aur us sequence ke numbers ginta hai.',
              'Har number <b>sirf ek sequence</b> ka hissa hai, aur woh sequence sirf ek baar gini jaati hai → inner while ka total kaam bhi O(n).',
              'Total O(n) + O(n) = <b>O(n)</b>.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[]</code>', '0', 'Khaali'],
              ['<code>[1,2,0,1]</code>', '3', 'Duplicate 1 — set ne hata diya (0,1,2)'],
              ['<code>[5]</code>', '1', '—'],
              ['Negatives <code>[−1,0,1]</code>', '3', 'Same logic'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n³)', 'O(1)'], ['Sort', 'O(n log n)', 'O(1)'], ['HashSet', 'O(n)', 'O(n)']] } },
          ],
        },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Start kaise pehchante hain?', 'x − 1 set me nahi.'],
              ['Start check hata diya toh?', 'Har number se ginti → O(n²).'],
              ['Duplicates?', 'Set apne aap hata deta hai.'],
              ['Set pe loop kyun, nums pe kyun nahi?', 'Duplicates pe dobara kaam na ho.'],
              ['Sort approach ka problem?', 'O(n log n); problem O(n) maangta hai.'],
              ['Total O(n) kyun?', 'Har number ek baar outer, ek baar kisi sequence ki ginti me.'],
              ['Space?', 'O(n) set.'],
              ['Pattern naam?', 'HashSet sequence / start of sequence.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach', 'Sorting would give O(n log n). To reach O(n), I put all numbers into a hash set, which also removes duplicates. Then for each number x, I only start counting if x − 1 is not in the set, so x is the beginning of a sequence. From there I extend with x + 1, x + 2 while they exist and update the best length. O(n) time and O(n) space.'],
              ['Why is it O(n) with a nested loop?', 'The inner loop only runs from sequence starts, and each number belongs to exactly one sequence, so across the whole run the inner loop visits each number at most once. Together with the outer loop that is O(n) total.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohvi session (No coding)',
          blocks: [
            { olist: ['Part 3 ka HashSet paper pe banao.', 'Har number pe bolo: start hai ya nahi, aur kyun.', 'Sirf "start of sequence" ka idea pakka karo.'] },
          ],
        },
        {
          title: 'Part 13 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['<b>LC 128</b> submit (HashSet).', 'Explain: har element ek baar kyun visit hota hai.', 'Sort version bhi zubaani compare.'] },
          ],
        },
        {
          title: 'Part 14 — Homework',
          blocks: [
            { list: ['<b>Dono:</b> Likho — complexity O(n) kyun hai (Part 7 apne shabdon me).', 'Kal (Day 12): Prefix + HashMap — LC 525.'] },
          ],
        },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[9,1,4,7,3,2,8,5,6]</code>?', '9 (1..9).'],
              ['<code>[10,5,12,3,55,30,4,11,2]</code>?', '4 (2,3,4,5).'],
              ['<code>[1,3,5]</code>?', '1.'],
              ['Start condition?', '<code>!set.contains(x − 1)</code>'],
              ['Complexity?', 'O(n) / O(n).'],
            ] },
          ],
        },
      ],
      checks: [
        'Brute / sort / HashSet comparison',
        'Start-of-sequence rule samjha',
        'HashSet dry-run table khud bhari',
        'O(n) kyun — likh ke explain',
        'Sohvi: start of sequence (no coding)',
        'Tum: LC 128 Accepted',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Pichla nahi hai? Toh tum shuruaat ho — yahin se gino.',
    },

    // =====================================================================
    // DAY 12 — Prefix + HashMap (Module 10)
    12: {
      title: 'Prefix + HashMap — Equal 0s and 1s (Contiguous Array)',
      goal: 'Equal 0 aur 1 wala sabse lamba subarray. <b>0 → −1</b> karke running sum (balance); <b>same prefix dobara dikha = beech ka hissa balanced</b>. <b>Sohvi:</b> sirf visualize. <b>Tum:</b> LC 525.',
      main: 525,
      parts: [
        {
          title: 'Part 0 — Revision (kal ka) + Aaj ka session',
          blocks: [
            { p: FIRST },
            session('Module 10: 0 → −1, prefix difference, same prefix seen before', '<code>0 1 0</code> → <code>−1 1 −1</code> → prefix <code>−1 0 −1</code>', 'Tum: LC 525', 'Homework: 0 → −1 kyun'),
            ...rev({
              h: 'LC 128 — Longest Consecutive Sequence (kal ka)',
              p: 'Sabse lamba consecutive run.',
              ex: '[100,4,200,1,3,2] → 4',
              pat: 'HashSet sequence',
              steps: ['Set banao.', 'x − 1 nahi → start; aage gino.'],
              code: ap(128, 2),
              hook: 'Pichla nahi → shuruaat.',
            }),
            ...rev({
              h: 'LC 560 — Subarray Sum Equals K (Week 1)',
              p: 'Aaj ka sabse kareebi rishtedaar — prefix + HashMap.',
              ex: '[1,2,3], k = 3 → 2',
              pat: 'Prefix + HashMap (count)',
              steps: ['freq{0:1}.', 'count += freq[sum − k].', 'freq[sum]++.'],
              code: ap(560, 2),
              hook: 'Aaj k = 0 hai — aur ginti ki jagah sabse lamba.',
            }),
          ],
        },
        {
          title: 'Part 1 — Theory: 0 → −1 conversion',
          blocks: [
            { p: '<b>Problem:</b> Binary array me equal 0 aur 1 wala sabse lamba contiguous subarray.' },
            { p: '<b>Trick:</b> Har 0 ko <b>−1</b> maano, 1 ko <b>+1</b>. Ab "0 aur 1 barabar" = "<b>sum 0</b>".' },
            { p: '<b>Prefix difference:</b> Subarray (i+1..j) ka sum = prefix[j] − prefix[i]. Ye 0 hai ⇔ <b>prefix[j] == prefix[i]</b>. Matlab <b>same prefix (balance) dobara dikha = balanced subarray</b>.' },
            clues([['Equal 0s and 1s', 'Prefix + HashMap (balance)'], ['Equal positive and negative', 'Balance'], ['Same count of two kinds', 'Balance'], ['Balance / longest balanced', 'Pehla index store karo']]),
          ],
        },
        {
          title: 'Part 2 — Visualization: 0 1 0',
          blocks: [
            { pre: `Array   :   0    1    0
Convert :  −1    1   −1
Prefix  :  −1    0   −1
Index   :   0    1    2

Prefix −1 index 0 pe aur index 2 pe → beech ka (index 1..2) = [1, 0] balanced, length 2
Prefix 0 index 1 pe, aur "shuruaat" (index −1) pe bhi 0 → (index 0..1) = [0, 1], length 2` },
            { tip: '<b>first.put(0, −1) kyun?</b> Shuru se hi balanced subarray (index 0 se) ke liye — khaali prefix ka balance 0, "index −1" pe.' },
          ],
        },
        { title: 'Part 3 — Aaj ka problem (Tum): LC 525 Contiguous Array', blocks: [{ problem: 525 }] },
        {
          title: 'Part 4 — Dry Run: Prefix, Map, Longest length — [0, 0, 1, 0, 1, 1, 0]',
          blocks: [
            { table: { head: ['i', 'nums[i]', 'balance', 'Map me?', 'Action', 'max'], rows: [
              ['—', '—', '0', '—', 'first = {0: −1}', '0'],
              ['0', '0', '−1', 'Nahi', 'first[−1] = 0', '0'],
              ['1', '0', '−2', 'Nahi', 'first[−2] = 1', '0'],
              ['2', '1', '−1', 'Haan (0)', 'len = 2 − 0 = 2', '2'],
              ['3', '0', '−2', 'Haan (1)', 'len = 3 − 1 = 2', '2'],
              ['4', '1', '−1', 'Haan (0)', 'len = 4 − 0 = 4', '4'],
              ['5', '1', '0', 'Haan (−1)', 'len = 5 − (−1) = 6', '<b>6</b>'],
              ['6', '0', '−1', 'Haan (0)', 'len = 6 − 0 = 6', '6'],
            ] } },
            { p: 'Answer <b>6</b> — index 0..5 = <code>[0,0,1,0,1,1]</code> (3 zero, 3 one).' },
            { tip: '<b>Pehla index hi kyun store?</b> Longest chahiye — jitna purana index, utna lamba subarray. Isliye map me sirf pehli baar daalo, update mat karo.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' },
            { code: sol(525, 0) },
            { p: '<b>Optimal — balance + HashMap (first index)</b>' },
            { code: sol(525, 1) },
            { lines: [
              ['first.put(0, -1);', 'Balance 0 "index −1" pe — shuru se balanced subarray ke liye.'],
              ['bal += nums[i] == 1 ? 1 : -1;', '0 → −1, 1 → +1 (prefix sum).'],
              ['if (first.containsKey(bal)) max = Math.max(max, i - first.get(bal));', 'Same balance pehle dikha → beech ka hissa balanced.'],
              ['else first.put(bal, i);', 'Sirf pehli baar — longest ke liye.'],
            ] },
            { p: '<b>Array version (HashMap ki jagah, balance −n..n ko shift karke):</b>' },
            { code: sol(525, 2) },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['Balance aur map (balance → pehla index) dekho.', 'Default example = Part 4 ki table.'] },
            { viz: 525, ex: 2 },
          ],
        },
        {
          title: 'Part 7 — LC 560 vs LC 525 (same family)',
          blocks: [
            { table: { head: ['', 'LC 560', 'LC 525'], rows: [
              ['Prefix', 'Seedha sum', 'Balance (0 → −1)'],
              ['Dhoondte hain', 'sum − k', 'Same balance (k = 0)'],
              ['Map value', 'Kitni baar (count)', 'Pehla index'],
              ['Answer', 'Kitne subarrays', 'Sabse lamba'],
              ['Map start', '{0: 1}', '{0: −1}'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[0,1]</code>', '2', 'Balance 0 at i=1 → 1 − (−1)'],
              ['<code>[0,0,0]</code>', '0', 'Kabhi balance repeat nahi'],
              ['<code>[0,1,1,1,1,1,0,0,0]</code>', '6', '—'],
              ['<code>[1]</code>', '0', '—'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n²)', 'O(1)'], ['HashMap', 'O(n)', 'O(n)'], ['Array (2n + 1)', 'O(n)', 'O(n)']] } },
          ],
        },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['0 ko −1 kyun?', 'Taaki "0 aur 1 barabar" = "sum 0" ho jaaye.'],
              ['Repeated prefix ka matlab?', 'Beech ke elements ka sum 0 → balanced.'],
              ['Map me kya store?', 'Balance → pehla index.'],
              ['Update kyun nahi karte?', 'Longest chahiye — purana index rakho.'],
              ['first.put(0, −1) kyun?', 'Index 0 se shuru hone wala balanced subarray.'],
              ['LC 560 se farak?', '560 count (freq), 525 longest (first index).'],
              ['Array version kyun?', 'Balance −n..n — offset n se HashMap ki jagah array, thoda fast.'],
              ['Complexity?', 'O(n) / O(n).'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach', 'I treat 0 as −1 and 1 as +1 and keep a running balance. A subarray has equal zeros and ones exactly when its sum is zero, which happens when the balance at its end equals the balance just before its start. So I store the first index at which each balance appears, starting with balance 0 at index −1. At each index, if the balance has been seen, the length is the current index minus that first index, and I keep the maximum. O(n) time, O(n) space.'],
              ['Why store only the first occurrence?', 'I want the longest subarray, and for a fixed end the longest one starts right after the earliest index with the same balance. Overwriting with later indices would only shorten the answer.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohvi session (Only visualize)',
          blocks: [
            { olist: ['<code>0 1 0</code> ka convert + prefix paper pe.', 'Visualizer me Part 4 wala example step-by-step dekho.', 'Bolo: same prefix dobara aaya toh kya matlab.'] },
          ],
        },
        {
          title: 'Part 13 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['<b>LC 525</b> submit.', 'Explain: repeated prefix = balanced subarray kyun.', 'LC 560 vs 525 table zubaani.'] },
          ],
        },
        {
          title: 'Part 14 — Homework',
          blocks: [
            { list: ['<b>Dono:</b> Explanation likho — 0 ko −1 kyun banate hain.', 'Kal (Day 13, Saturday): Mixed pattern recognition + re-solve.'] },
          ],
        },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[1,0,1,1,0]</code> answer?', '4 — <code>[0,1,1,0]</code> (index 1..4). Balance: 1, 0, 1, 2, 1 → balance 1 index 0 aur 4 pe.'],
              ['<code>[0,1,0]</code> ke prefix?', '−1, 0, −1.'],
              ['Map ki shuruaat?', '{0: −1}.'],
              ['Same balance index 2 aur 7 pe — length?', '5.'],
              ['Pattern naam?', 'Prefix + HashMap (balance).'],
            ] },
          ],
        },
      ],
      checks: [
        '0 → −1 trick samjha',
        'Repeated prefix = balanced subarray',
        'Dry-run table (prefix, map, longest) khud bhari',
        'Pehla index hi kyun — bata sakta/sakti hu',
        'Sohvi: visualize kiya',
        'Tum: LC 525 Accepted',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: '0 ko −1 banao; same balance dobara = beech me barabari. Pehli baar yaad rakho, lamba milega.',
    },

    // =====================================================================
    // DAY 13 — Mixed Pattern Recognition (Saturday)
    13: {
      title: 'Mixed Pattern Recognition — Pattern pehchano, phir re-solve',
      goal: 'Pehle <b>coding nahi</b> — sirf problem padh ke pattern pehchano: Prefix? Kadane? HashMap? Traversal? Product? Cyclic Placement? HashSet? Phir re-solve. <b>Sohvi:</b> LC 1, 217, 53. <b>Tum:</b> LC 238, 41, 128 (bolte hue).',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka plan',
          blocks: [
            { p: FIRST },
            { table: { head: ['Time', 'Kya'], rows: [
              ['9:00–9:20', 'Pattern recognition exercise (10 titles, bina khole)'],
              ['9:20–9:30', 'Verify + galtiyan note'],
              ['9:30–10:20', 'Re-solve (Sohvi 3, Tum 3) — bina notes'],
              ['10:20–10:30', 'Pattern notebook update'],
            ] } },
          ],
        },
        {
          title: 'Part 1 — Pattern menu',
          blocks: [
            { table: { head: ['Pattern', 'Recognition clue', 'Core idea'], rows: [
              ['Traversal', 'Count / find / max / transform', 'Ek loop, har element ek baar'],
              ['Prefix', 'Range sum, running sum, subarray sum = k', 'prefix[R] − prefix[L−1]'],
              ['HashMap / HashSet', 'Pehle dekha? kitni baar? partner?', 'O(1) lookup'],
              ['Kadane', 'Maximum contiguous sum', 'Extend ya reset'],
              ['Product', 'Product except self, no division', 'Left × Right'],
              ['Cyclic Placement', 'Numbers 1..n, missing / smallest positive', 'v → index v − 1'],
              ['HashSet Sequence', 'Longest consecutive', 'Sirf start se gino'],
              ['Prefix + HashMap', 'Equal counts / balance', 'Same prefix dobara'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Exercise: 10 titles — bina khole pattern guess karo',
          blocks: [
            { p: 'Har title padho, pattern bolo, phir answer kholo. Galat hua toh notebook me "kyun galat" likho.' },
            { qa: [
              ['1. Running Sum of 1d Array', 'Prefix (running sum).'],
              ['2. Maximum Subarray', 'Kadane.'],
              ['3. Product of Array Except Self', 'Prefix × Suffix product.'],
              ['4. Missing Number', 'Math / XOR (ya index placement).'],
              ['5. First Missing Positive', 'Cyclic placement.'],
              ['6. Longest Consecutive Sequence', 'HashSet sequence.'],
              ['7. Contiguous Array (equal 0 and 1)', 'Prefix + HashMap (balance).'],
              ['8. Subarray Sum Equals K', 'Prefix + HashMap (count).'],
              ['9. Contains Duplicate', 'HashSet.'],
              ['10. Majority Element', 'HashMap frequency / Boyer-Moore.'],
            ] },
          ],
        },
        {
          title: 'Part 3 — Sohvi re-solve: LC 1, 217, 53 (bina notes)',
          blocks: [
            { p: '<b>LC 1 — Two Sum</b> (HashMap seen-before)' },
            { code: ap(1, 2) },
            { p: '<b>LC 217 — Contains Duplicate</b> (HashSet)' },
            { code: ap(217, 2) },
            { p: '<b>LC 53 — Maximum Subarray</b> (Kadane)' },
            { code: ap(53, 2) },
            { tip: 'Pehle khud likho, phir yahan se milao.' },
          ],
        },
        {
          title: 'Part 4 — Tum re-solve: LC 238, 41, 128 (bolte hue)',
          blocks: [
            { p: '<b>LC 238</b> — "Left product ans me, right ek variable me…"' },
            { code: ap(238, 2) },
            { p: '<b>LC 41</b> — "Value v ko index v − 1 pe…"' },
            { code: ap(41, 2) },
            { p: '<b>LC 128</b> — "Sirf start se ginta hu…"' },
            { code: ap(128, 2) },
            { viz: 41, ex: 1 },
          ],
        },
        {
          title: 'Part 5 — Interview mix',
          blocks: [
            { qa: [
              ['"Maximum sum of contiguous subarray" — pattern?', 'Kadane.'],
              ['"No division, O(n)" — pattern?', 'Prefix × suffix product.'],
              ['"Numbers 1..n, smallest missing positive, O(1) space" — pattern?', 'Cyclic placement.'],
              ['"Longest consecutive, O(n)" — pattern?', 'HashSet sequence.'],
              ['"Equal number of 0 and 1" — pattern?', 'Prefix + HashMap (balance).'],
              ['"Count subarrays with sum k" — pattern?', 'Prefix + HashMap (frequency).'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Aise bolo',
          blocks: [
            { say: [
              ['How do you recognise array patterns?', 'I read the question for clues. Maximum contiguous sum means Kadane. Product of everything except the current element with no division means prefix and suffix products. Values in the range 1 to n with something missing means index placement. Longest consecutive run means a hash set started at sequence heads. Equal counts or subarray sums equal to k mean prefix sums with a hash map. Then I check that the pattern gives the expected complexity.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: ['10 titles ka exercise (Part 2) — pehle khud guess.', 'LC 1, 217, 53 re-solve <b>bina notes</b>.', 'Galat guesses notebook me.'] },
          ],
        },
        {
          title: 'Part 8 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['10 titles 5 minute me (har ek 30 sec).', 'LC 238, 41, 128 re-solve — <b>aloud explain</b> karte hue.', 'Har ek ke baad complexity + ek edge case bolo.'] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: ['Pattern notebook me Week 2 ke 5 patterns ka template bharo (Day 14 Deliverables table jaisa).', 'Kal (Day 14): Mock — Sohvi 1480, 217 · Tum 560, 238, 525.'] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Kadane ki line?', '<code>cur = max(x, cur + x)</code>'],
              ['LC 41 me v ki jagah?', 'v − 1.'],
              ['LC 128 start condition?', 'x − 1 set me nahi.'],
              ['LC 525 conversion?', '0 → −1.'],
              ['LC 238 me division?', 'Nahi — left × right.'],
            ] },
          ],
        },
      ],
      checks: [
        '10 titles ka pattern guess (verify kiya)',
        'Sohvi: LC 1, 217, 53 bina notes',
        'Tum: LC 238, 41, 128 aloud',
        'Interview mix ke 6 jawab',
        'Pattern notebook update',
      ],
      memory: 'Pehle pattern ka naam, phir code. Clue padho: max-contiguous, except-self, 1..n, consecutive, balance.',
    },

    // =====================================================================
    // DAY 14 — Mock Interview (Sunday)
    14: {
      title: 'Mock Interview — Week 2 (Sohvi 30 min, Tum 45 min) + Contest',
      goal: '<b>Sohvi:</b> LC 1480, 217 — approach, complexity, "kyun kaam karta hai". <b>Tum:</b> LC 560, 238, 525 — 11-step order me. Phir contest discussion aur Week 2 Deliverables.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Mock format',
          blocks: [
            { table: { head: ['Kaun', 'Time', 'Questions', 'Interviewer'], rows: [
              ['Sohvi', '30 min', 'LC 1480, LC 217', 'Tum'],
              ['Tum', '45 min', 'LC 560, LC 238, LC 525', 'Sohvi'],
              ['Dono', '15 min', 'LeetCode Weekly Contest discussion (Sunday 8:00 AM IST)', '—'],
            ] } },
          ],
        },
        {
          title: 'Part 1 — Sohvi Mock: LC 1480 + LC 217',
          blocks: [
            { problem: 1480 },
            { problem: 217 },
            { list: ['<b>Approach</b> bolo.', '<b>Complexity</b> (time + space).', '<b>Ye kyun kaam karta hai.</b>'] },
            { qa: [
              ['1480: kyun kaam karta hai?', 'nums[i − 1] me already 0..i−1 ka total hai; bas nums[i] jodo.'],
              ['217: kyun kaam karta hai?', 'HashSet add() false → pehle dekha → duplicate.'],
            ] },
          ],
        },
        {
          title: 'Part 2 — Tum Mock: 11-step order (har question)',
          blocks: [
            { olist: ['Clarify the problem.', 'Identify the pattern.', 'Brute force approach.', 'Better approach (if applicable).', 'Optimal approach.', 'Time Complexity.', 'Space Complexity.', 'Edge cases.', 'Walk through one example.', 'Write code.', 'Dry run the code.'] },
            { table: { head: ['Question', 'Pattern', 'Brute', 'Better', 'Optimal', 'Edge case'], rows: [
              ['LC 560', 'Prefix + HashMap (count)', 'O(n³)', 'O(n²) running sum', 'O(n) freq map', 'Negatives, k = 0'],
              ['LC 238', 'Prefix × Suffix', 'O(n²)', 'O(n) 3 arrays', 'O(n), O(1) extra', 'Ek / do zero'],
              ['LC 525', 'Prefix + HashMap (balance)', 'O(n²)', '—', 'O(n) first index', 'Kabhi balance repeat nahi'],
            ] } },
            { problem: 560 },
            { problem: 238 },
            { problem: 525 },
          ],
        },
        {
          title: 'Part 3 — Evaluation rubric',
          blocks: [
            { table: { head: ['Area', 'Kya dekhna hai', 'Score (1–4)'], rows: [
              ['Clarify', 'Input/output/edge cases poochhe', ''],
              ['Pattern', '1 minute me sahi pattern', ''],
              ['Brute → Optimal', 'Saare levels complexity ke saath', ''],
              ['Code', 'Clean, bina bug', ''],
              ['Dry run', 'Code pe example chalaya', ''],
              ['Communication', 'Bolke socha', ''],
            ] } },
          ],
        },
        {
          title: 'Part 4 — Contest discussion',
          blocks: [
            { list: ['Har solved question ka pattern naam do.', 'Jo nahi hua: editorial padho, kal 20 min upsolve.'] },
            { table: { head: ['Question', 'Pattern', 'Time liya', 'Galti', 'Seekh'], rows: [['Q1', '', '', '', ''], ['Q2', '', '', '', ''], ['Q3', '', '', '', '']] } },
          ],
        },
        {
          title: 'Part 5 — Aise bolo',
          blocks: [
            { say: [
              ['Mock opening (LC 525)', 'Let me restate: given a binary array, I return the length of the longest contiguous subarray with an equal number of zeros and ones. Can the array be empty? This looks like a prefix-sum pattern: if I count 0 as −1, a balanced subarray has sum zero. Brute force checks every subarray in O(n²); I can do it in O(n) with a hash map of first occurrences.'],
              ['Mock closing', 'To summarize, it is O(n) time and O(n) space. I dry ran it on [0, 0, 1, 0, 1, 1, 0] and got 6, and I checked an array with no balanced subarray, which returns 0.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Sohvi session',
          blocks: [
            { olist: ['30 min mock — LC 1480, 217.', 'Har question pe teen cheezein: approach, complexity, kyun.', 'Interviewer ban ke Tum se 11-step order follow karwao.'] },
          ],
        },
        {
          title: 'Part 7 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['45 min mock — LC 560, 238, 525, 11-step order me.', 'Rubric me jo 1–2 aaya, kal wahi practice.', 'Contest Q1–Q2 attempt.'] },
          ],
        },
        {
          title: 'Part 8 — Week 2 Deliverables',
          blocks: [
            { p: '<b>📒 Theory Notebook:</b> Kadane, Prefix Product, Cyclic Placement, HashSet Sequence, Prefix + HashMap.' },
            { p: '<b>📘 Pattern Notebook</b> (har pattern ke liye ye template):' },
            { table: { head: ['Pattern', 'Recognition Clues', 'Core Idea', 'Time', 'Space', 'Example LC'], rows: [
              ['Kadane', 'Maximum contiguous sum', 'Local &amp; global max rakho', 'O(n)', 'O(1)', '53'],
              ['Prefix Product', 'Product except self', 'Left × Right products', 'O(n)', 'O(1)*', '238'],
              ['Cyclic Placement', 'Missing number in 1..n', 'Value ko sahi index pe', 'O(n)', 'O(1)', '41'],
              ['HashSet Sequence', 'Consecutive numbers', 'Sirf sequence heads se', 'O(n)', 'O(n)', '128'],
              ['Prefix + HashMap', 'Equal counts / repeated prefix', 'Prefix ka pehla occurrence store', 'O(n)', 'O(n)', '525'],
            ] } },
            { p: '<b>💻 Coding Library</b> — reusable templates: Kadane, Prefix/Suffix Product, Missing Number (Math/XOR), Cyclic Placement, Longest Consecutive Sequence, Prefix Sum + HashMap.' },
          ],
        },
        {
          title: 'Part 9 — Expected Outcome after Week 2',
          blocks: [
            { table: { head: ['Sohvi', 'Tum'], rows: [
              ['Array fundamentals solid', 'Sahi array pattern ek minute me pehchaanna'],
              ['Advanced patterns ka exposure', 'Interview me reasoning explain karna'],
              ['Kaunsa pattern kab lagta hai — pehchaan', 'Major array patterns ka optimal solution bina notes'],
            ] } },
            { tip: 'Ye level Linked Lists aur baaki core DSA topics pe jaane se pehle expected hai.' },
          ],
        },
        {
          title: 'Part 10 — Homework + self-test',
          blocks: [
            { list: ['Deliverables me jo adhoora hai, Week 3 se pehle poora.', 'Rubric ke weak area pe 30 min.', 'Next: Week 3 — Two Pointers.'] },
            { qa: [
              ['LC 560 map start?', '{0: 1}.'],
              ['LC 525 map start?', '{0: −1}.'],
              ['LC 238 me answer = ?', 'left × right.'],
              ['11-step me pattern kab bolte hain?', 'Step 2 — clarify ke turant baad.'],
              ['Week 2 ke 5 patterns?', 'Kadane, prefix product, cyclic placement, HashSet sequence, prefix + HashMap.'],
            ] },
          ],
        },
      ],
      checks: [
        'Sohvi: LC 1480 + 217 mock (approach, complexity, kyun)',
        'Tum: LC 560, 238, 525 — 11-step order',
        'Rubric bhara',
        'Contest discussion',
        'Theory notebook (5 patterns)',
        'Pattern notebook table',
        'Coding library templates',
      ],
      memory: 'Pehla sawaal hamesha: "ye kis pattern ka hai?"',
    },
  });
})();
