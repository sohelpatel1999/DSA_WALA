// Phase 2 — Two Pointers: course Week 3 (Day 15–21), Sohel ka diya hua syllabus (2026-11-08). Day 1 wale format me.
// Block types: p, h, list, olist, code, pre, table, problem, viz, lines, qa, say, tip
(function () {
  const P = window.PHASE_CONTENT['two-pointers'];
  P.lessons = P.lessons || {};
  const ap = (n, i) => P.questions[n].approaches[i].code;
  const sol = (n, i) => 'class Solution {\n' + ap(n, i).split('\n').map(l => '    ' + l).join('\n') + '\n}';
  const session = (theory, viz, coding, lc) => ({ table: { head: ['Time', 'Slot', 'Aaj kya'], rows: [
    ['9:00–9:30', 'Theory', theory],
    ['9:30–9:50', 'Visualization + dry run', viz],
    ['9:50–10:10', 'Coding practice (saath me)', coding],
    ['10:10–10:30', 'LeetCode (Sohvi / Tum)', lc],
  ] } });
  const rev = o => [
    { h: o.h }, { p: o.p }, { pre: o.ex },
    { p: '<b>Pattern:</b> ' + o.pat }, { olist: o.steps }, { code: o.code },
    { tip: '<b>Memory hook:</b> ' + o.hook },
  ];
  const LC26 = `public int removeDuplicates(int[] nums) {
    int k = 1;                                   // write pointer
    for (int i = 1; i < nums.length; i++) {     // read pointer
        if (nums[i] != nums[k - 1]) nums[k++] = nums[i];
    }
    return k;
}`;

  Object.assign(P.lessons, {
    // =====================================================================
    // DAY 15 — Intro + Opposite Direction
    1: {
      title: 'Two Pointers Intro — Opposite Direction (Reverse + Palindrome)',
      goal: 'Week 3 ka goal — <b>Sohvi:</b> two pointers ko pehchaanna aur simple (opposite/same) questions khud karna. <b>Tum:</b> har pattern ka proof + Medium/Hard (11, 15, 42) interview level pe. Aaj: <b>l = 0, r = n − 1, dono andar aate hain</b>. <b>Sohvi:</b> LC 344. <b>Tum:</b> LC 125.',
      main: 344,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision (Week 1–2) + Aaj ka session',
          blocks: [
            session('Two pointers kya hai, opposite direction', '"racecar" pe l/r chalao', 'Reverse + palindrome check', 'Sohvi: LC 344 · Tum: LC 125'),
            ...rev({
              h: 'LC 26 — Remove Duplicates (Week 1)', p: 'Sorted array me duplicates in-place hatao, k return karo.',
              ex: '[0,0,1,1,1,2,2] → k = 3, [0,1,2,…]', pat: 'Same direction (read i, write k) — Day 17 me pura aayega',
              steps: ['k = 1 (pehla element hamesha unique).', 'nums[i] != nums[k − 1] → nums[k++] = nums[i].', 'return k.'],
              code: LC26, hook: '<b>i padhta hai, k likhta hai.</b>',
            }),
          ],
        },
        {
          title: 'Part 1 — Two Pointers kya hai? (Sohvi ke liye simple)',
          blocks: [
            { p: 'Array/string me <b>do index</b> rakhte hain aur ek rule se unhe chalate hain — har pair check karne (O(n²)) ki jagah. Har pointer sirf ek direction me jaata hai, wapas nahi aata → total ≤ n moves → <b>O(n)</b>.' },
            { table: { head: ['Type', 'Shuru', 'Chalna', 'Kahan'], rows: [
              ['Opposite direction', 'l = 0, r = n − 1', 'Dono andar (l++, r--)', 'Reverse, palindrome, sorted pair'],
              ['Same direction', 'slow = 0, fast = 0', 'Dono aage, alag speed', 'Duplicates hatao, zeroes move'],
            ] } },
            { tip: 'Pehchaan: <b>sorted array / string ke dono end / in-place, O(1) space</b> → two pointers socho.' },
          ],
        },
        {
          title: 'Part 2 — Opposite direction ka template',
          blocks: [
            { code: `int l = 0, r = n - 1;
while (l < r) {
    // l aur r ko compare / swap karo
    l++;
    r--;
}` },
            { p: '<code>l &lt; r</code> kyun, <code>l &lt;= r</code> kyun nahi? Jab l == r, dono ek hi element pe hain — beech ka element khud se compare/swap karne ka koi matlab nahi.' },
          ],
        },
        {
          title: 'Part 3 — Dry run: "racecar" palindrome hai?',
          blocks: [
            { table: { head: ['Step', 'l', 'r', 's[l]', 's[r]', 'Same?'], rows: [
              ['1', '0', '6', 'r', 'r', '✓'], ['2', '1', '5', 'a', 'a', '✓'], ['3', '2', '4', 'c', 'c', '✓'], ['4', '3', '3', '—', '—', 'l == r → ruko → <b>palindrome</b>'],
            ] } },
          ],
        },
        { title: 'Part 4 — Aaj ka problem (Sohvi): LC 344 Reverse String', blocks: [{ problem: 344 }] },
        {
          title: 'Part 5 — LC 344: Brute → Optimal',
          blocks: [
            { p: '<b>Brute — copy array (O(n) extra)</b>' }, { code: sol(344, 0) },
            { p: '<b>Recursive — same idea, stack O(n)</b>' }, { code: sol(344, 1) },
            { p: '<b>Optimal — opposite pointers, in-place</b>' }, { code: sol(344, 2) },
            { lines: [
              ['int l = 0, r = s.length - 1;', 'Dono end se shuru.'],
              ['while (l < r)', 'Milne tak.'],
              ['char tmp = s[l]; s[l] = s[r]; s[r] = tmp;', 'Swap — tmp ke bina value kho jaati.'],
              ['l++; r--;', 'Dono andar.'],
            ] },
            { p: 'Better nahi hai — copy (O(n) space) ke baad seedha in-place O(1) hi best hai.' },
          ],
        },
        { title: 'Part 6 — Visualize: "hello" ulta hote dekho', blocks: [{ viz: 344, ex: 0 }] },
        { title: 'Part 7 — Aaj ka problem (Tum): LC 125 Valid Palindrome', blocks: [{ problem: 125 }] },
        {
          title: 'Part 8 — LC 125: Brute → Optimal',
          blocks: [
            { p: '<b>Brute — clean string bana ke reverse se compare (O(n) space)</b>' }, { code: sol(125, 0) },
            { p: '<b>Optimal — pointers, faltu characters skip</b>' }, { code: sol(125, 1) },
            { lines: [
              ['while (l < r && !Character.isLetterOrDigit(...)) l++;', 'Space/comma skip. <code>l &lt; r</code> guard zaroori — warna bahar nikal jaoge.'],
              ['Character.toLowerCase(...) != ...', '"A" aur "a" same.'],
            ] },
            { viz: 125, ex: 0 },
          ],
        },
        {
          title: 'Part 9 — Edge cases',
          blocks: [{ table: { head: ['Case', 'Answer', 'Kyun'], rows: [
            ['344: ek char "a"', '"a"', 'l == r → loop chalta hi nahi'],
            ['125: " " (sirf space)', 'true', 'Saaf string khaali = palindrome'],
            ['125: "0P"', 'false', 'Digit bhi count hota hai'],
          ] } }],
        },
        {
          title: 'Part 10 — Complexity',
          blocks: [{ table: { head: ['Approach', 'Time', 'Space'], rows: [
            ['344 copy', 'O(n)', 'O(n)'], ['344 recursive', 'O(n)', 'O(n) stack'], ['344 two pointers', 'O(n)', 'O(1)'],
            ['125 clean + reverse', 'O(n)', 'O(n)'], ['125 two pointers', 'O(n)', 'O(1)'],
          ] } }],
        },
        {
          title: 'Part 11 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['Two pointers O(n) kyun?', 'Har pointer ek hi direction, total ≤ n moves.'],
            ['<code>l &lt; r</code> ya <code>l &lt;= r</code>?', 'l &lt; r — beech wala khud se compare nahi karna.'],
            ['Java String reverse in-place?', 'Nahi — String immutable; char[] chahiye.'],
            ['125 me inner while me <code>l &lt; r</code> kyun?', '"!!!" jaise input me l bahar na nikle.'],
            ['Recursive kyun bura?', 'O(n) stack — bade input pe StackOverflow.'],
            ['Case kaise ignore?', 'Character.toLowerCase dono pe.'],
            ['Brute 125 ka space?', 'O(n) (StringBuilder).'],
            ['Pattern?', 'Opposite Direction two pointers.'],
          ] }],
        },
        {
          title: 'Part 12 — Bade interview answers: aise bolo',
          blocks: [{ say: [
            ['Reverse String', 'I put one pointer at each end, swap the two characters, and move both pointers inward until they meet. Each character is touched once, so it is O(n) time and O(1) extra space, done in place.'],
            ['Valid Palindrome', 'Instead of building a cleaned copy, I use two pointers from both ends. Each pointer skips characters that are not letters or digits, then I compare the two characters ignoring case. Any mismatch returns false; if the pointers meet, it is a palindrome. O(n) time, O(1) space.'],
          ] }],
        },
        { title: 'Part 13 — Sohvi session', blocks: [{ olist: ['"racecar" ki table khud bharo.', '<b>LC 344</b> two pointers se submit.', 'Template (Part 2) bina dekhe likho.'] }] },
        { title: 'Part 14 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['<b>LC 125</b> — 10 min me, edge cases ke saath.', 'Brute vs optimal space difference zubaani.', 'Sohvi ka 344 review karo.'] }] },
        {
          title: 'Part 15 — Homework',
          blocks: [{ list: ['<b>Dono:</b> "madam" aur "hello" pe l/r ki table bharo (palindrome? haan/nahi).', 'Kal (Day 16): sorted pair sum — Tum: LC 167.'] }],
        },
        {
          title: 'Part 16 — Final self-test (bina notes)',
          blocks: [{ qa: [
            ['"madam" palindrome?', 'Haan — m/m, a/a, phir l == r.'],
            ['"hello" palindrome?', 'Nahi — h ≠ o pehle hi step pe.'],
            ['"ab" reverse kitne swaps?', '1.'],
            ['"race a car" (LC 125)?', 'false.'],
            ['Opposite template ki loop condition?', 'while (l &lt; r).'],
          ] }],
        },
      ],
      checks: ['Two pointers O(n) kyun — zubaani', 'Opposite template bina dekhe', '"racecar", "madam", "hello" dry run', 'Sohvi: LC 344 Accepted', 'Tum: LC 125 Accepted', '8 interview sawaal', 'Self-test 5/5'],
      memory: 'Dono end se aao, swap/compare karo, milne pe ruko.',
    },

    // =====================================================================
    // DAY 16 — Opposite Direction: sorted pair
    2: {
      title: 'Opposite Direction — Sorted Pair Sum (LC 167)',
      goal: 'Sorted array me pair sum: <b>sum chhota → l++, sum bada → r--</b>. Ye move safe kyun hai (elimination). HashMap vs Two Pointers. <b>Sohvi:</b> LC 344 dobara (bina dekhe). <b>Tum:</b> LC 167.',
      main: 167,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('Sorted pair + elimination proof', '[2,7,11,15], target 9 pe l/r', 'LC 167 teen tareeke', 'Sohvi: LC 344 dobara · Tum: LC 167'),
            ...rev({
              h: 'LC 125 — Valid Palindrome (kal ka)', p: 'Sirf letters/digits, case ignore.', ex: '"A man, a plan, a canal: Panama" → true',
              pat: 'Opposite Direction', steps: ['l, r dono end.', 'Faltu skip (l &lt; r guard).', 'lowercase compare, mismatch → false.'],
              code: ap(125, 1), hook: 'Skip, compare, andar aao.',
            }),
          ],
        },
        {
          title: 'Part 1 — Rule: sorted array me pair',
          blocks: [
            { pre: `sum = a[l] + a[r]
sum == target → mil gaya
sum <  target → l++   (bada number chahiye, left hi badha sakta hai)
sum >  target → r--   (chhota number chahiye)` },
            { p: '<b>Proof (Tum):</b> agar sum &lt; target, toh a[l] ko kisi bhi bache hue right element ke saath jodo — sab a[r] se chhote ya barabar → sum aur chhota. Matlab a[l] kisi answer me nahi → usse hata do. Same ulta r ke liye.' },
          ],
        },
        {
          title: 'Part 2 — HashMap vs Two Pointers',
          blocks: [{ table: { head: ['', 'HashMap (LC 1)', 'Two Pointers (LC 167)'], rows: [
            ['Input', 'Unsorted', 'Sorted'], ['Time', 'O(n)', 'O(n)'], ['Space', 'O(n)', '<b>O(1)</b>'],
            ['Return', 'Original indices', '1-indexed indices'], ['Kab', 'Array sorted nahi / indices chahiye', 'Sorted mila hai'],
          ] } }],
        },
        { title: 'Part 3 — Aaj ka problem: LC 167 Two Sum II', blocks: [{ problem: 167 }] },
        {
          title: 'Part 4 — Dry Run: [2,7,11,15], target 9 aur [2,3,4], target 6',
          blocks: [
            { table: { head: ['l', 'r', 'sum', 'Action'], rows: [['0', '3', '2 + 15 = 17', '&gt; 9 → r--'], ['0', '2', '2 + 11 = 13', '&gt; 9 → r--'], ['0', '1', '2 + 7 = 9', '<b>return [1, 2]</b>']] } },
            { table: { head: ['l', 'r', 'sum', 'Action'], rows: [['0', '2', '2 + 4 = 6', '<b>return [1, 3]</b>']] } },
          ],
        },
        {
          title: 'Part 5 — Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute — har pair O(n²)</b>' }, { code: sol(167, 0) },
            { p: '<b>Better — har i ke liye binary search O(n log n)</b>' }, { code: sol(167, 1) },
            { p: '<b>Optimal — two pointers O(n), O(1)</b>' }, { code: sol(167, 2) },
            { lines: [
              ['int sum = numbers[l] + numbers[r];', 'Dono ends ka sum.'],
              ['if (sum == target) return new int[]{l + 1, r + 1};', '1-indexed — +1 bhoolna mat.'],
              ['if (sum < target) l++; else r--;', 'Elimination rule.'],
            ] },
          ],
        },
        { title: 'Part 6 — Visualize', blocks: [{ viz: 167, ex: 0 }] },
        {
          title: 'Part 7 — Edge cases',
          blocks: [{ table: { head: ['Case', 'Answer', 'Kyun'], rows: [
            ['[-1,0], target -1', '[1,2]', 'Negatives bhi chalte hain'], ['Duplicates [1,1,3], 2', '[1,2]', 'l ≠ r index, value same ok'], ['Answer ends pe', 'Pehle step me', 'l=0, r=n−1'],
          ] } }],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [{ table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n²)', 'O(1)'], ['Binary search', 'O(n log n)', 'O(1)'], ['Two pointers', 'O(n)', 'O(1)']] } }],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['sum &lt; target pe l++ kyun?', 'a[l] ke saath har bacha pair aur chhota — usse hatao.'],
            ['Unsorted me ye chalega?', 'Nahi — sorted order pe hi elimination valid.'],
            ['HashMap kyun nahi?', 'Chalega, par O(n) space; sorted me O(1) possible.'],
            ['1-indexed kyun +1?', 'Problem ki demand.'],
            ['Binary search wala O(?)', 'O(n log n).'],
            ['l == r pe kya?', 'Same element do baar nahi — loop band.'],
            ['Multiple answers?', 'Problem exactly ek guarantee karti hai.'],
            ['Pattern?', 'Opposite Direction (sorted pair).'],
          ] }],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [{ say: [
            ['Two Sum II', 'Because the array is sorted, I start with pointers at both ends. If the sum is less than the target, I move the left pointer right to get a bigger sum; if it is greater, I move the right pointer left. Each move discards one element that cannot be in any valid pair. O(n) time, O(1) space.'],
          ] }],
        },
        { title: 'Part 11 — Sohvi session', blocks: [{ olist: ['<b>LC 344 dobara</b> — bina dekhe, 10 min.', 'Part 4 ki pehli table khud bharo.', 'Rule (Part 1) apne shabdon me.'] }] },
        { title: 'Part 12 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['<b>LC 167</b> — 10 min.', 'Elimination proof 3 lines me bolo.', 'HashMap vs two pointers table zubaani.'] }] },
        { title: 'Part 13 — Homework', blocks: [{ list: ['<b>Dono:</b> [1,3,4,5,7,10], target 9 ki dry run table.', 'Kal (Day 17): same direction — Sohvi: LC 283, Tum: LC 26 dobara.'] }] },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [{ qa: [
            ['[1,3,4,5,7,10], 9?', '[3,4] (4 + 5) — dry: 1+10&gt;9 r--, 1+7&lt;9 l++, 3+7&gt;9 r--, 3+5&lt;9 l++, 4+5 = 9 → [3,4].'],
            ['sum &gt; target?', 'r--.'],
            ['Space?', 'O(1).'],
            ['Better approach?', 'Binary search, O(n log n).'],
            ['Return indices?', '1-indexed.'],
          ] }],
        },
      ],
      checks: ['sum rule + elimination proof', 'HashMap vs two pointers table', 'Dry run 2 examples', 'Sohvi: LC 344 bina dekhe', 'Tum: LC 167 Accepted', '8 interview sawaal', 'Self-test 5/5'],
      memory: 'Chhota → left badhao, bada → right ghatao.',
    },

    // =====================================================================
    // DAY 17 — Same Direction
    3: {
      title: 'Same Direction — Read / Write Pointers (LC 283)',
      goal: 'Dono pointers aage: <b>fast (read) sab padhta hai, slow (write) sirf rakhne wale likhta hai</b>. Dry run: <code>1 1 2 2 3</code> aur <code>0 1 0 3 12</code>. <b>Sohvi:</b> LC 283. <b>Tum:</b> LC 26 dobara.',
      main: 283,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('Same direction: slow/fast', '1 1 2 2 3 aur 0 1 0 3 12', 'LC 283 teen tareeke', 'Sohvi: LC 283 · Tum: LC 26 dobara'),
            ...rev({
              h: 'LC 167 — Two Sum II (kal ka)', p: 'Sorted array, pair sum = target.', ex: '[2,7,11,15], 9 → [1,2]',
              pat: 'Opposite Direction', steps: ['l = 0, r = n − 1.', 'sum &lt; target → l++, &gt; → r--.', 'Equal → [l+1, r+1].'],
              code: ap(167, 2), hook: 'Chhota → left badhao, bada → right ghatao.',
            }),
          ],
        },
        {
          title: 'Part 1 — Template',
          blocks: [
            { code: `int slow = 0;
for (int fast = 0; fast < n; fast++) {
    if (rakhna hai(nums[fast])) {
        nums[slow] = nums[fast];   // ya swap
        slow++;
    }
}` },
            { p: 'slow ke <b>pehle</b> wala hissa = final answer (saaf). slow se fast tak = kachra. fast ke baad = abhi nahi padha.' },
          ],
        },
        {
          title: 'Part 2 — Dry run: 1 1 2 2 3 (LC 26)',
          blocks: [
            { table: { head: ['i', 'nums[i]', 'nums[k−1]', 'Alag?', 'Action', 'k'], rows: [
              ['1', '1', '1', 'Nahi', '—', '1'], ['2', '2', '1', 'Haan', 'nums[1] = 2', '2'], ['3', '2', '2', 'Nahi', '—', '2'], ['4', '3', '2', 'Haan', 'nums[2] = 3', '<b>3</b>'],
            ] } },
            { code: LC26 },
          ],
        },
        { title: 'Part 3 — Aaj ka problem: LC 283 Move Zeroes', blocks: [{ problem: 283 }] },
        {
          title: 'Part 4 — Dry run: 0 1 0 3 12 (swap version)',
          blocks: [{ table: { head: ['i', 'nums[i]', '≠ 0?', 'swap(k, i)', 'Array', 'k'], rows: [
            ['0', '0', 'Nahi', '—', '[0,1,0,3,12]', '0'], ['1', '1', 'Haan', 'swap(0,1)', '[1,0,0,3,12]', '1'], ['2', '0', 'Nahi', '—', '[1,0,0,3,12]', '1'],
            ['3', '3', 'Haan', 'swap(1,3)', '[1,3,0,0,12]', '2'], ['4', '12', 'Haan', 'swap(2,4)', '<b>[1,3,12,0,0]</b>', '3'],
          ] } }],
        },
        {
          title: 'Part 5 — Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute — temp array (O(n) space)</b>' }, { code: sol(283, 0) },
            { p: '<b>Better — non-zero aage likho, phir end me 0 bharo (do pass)</b>' }, { code: sol(283, 1) },
            { p: '<b>Optimal — swap, ek pass</b>' }, { code: sol(283, 2) },
            { lines: [
              ['int k = 0;', 'Agla non-zero yahan aayega.'],
              ['if (nums[i] != 0) { swap(k, i); k++; }', 'Non-zero aage, zero peeche khisakta hai — order same.'],
            ] },
          ],
        },
        { title: 'Part 6 — Visualize', blocks: [{ viz: 283, ex: 0 }] },
        {
          title: 'Part 7 — Edge cases',
          blocks: [{ table: { head: ['Case', 'Answer', 'Kyun'], rows: [['[0]', '[0]', 'Kuch nahi badla'], ['[1,2,3]', 'Same', 'Har swap(i, i) — khud se'], ['[0,0,1]', '[1,0,0]', 'k = 0 tak ruka rehta hai']] } }],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [{ table: { head: ['Approach', 'Time', 'Space'], rows: [['Temp array', 'O(n)', 'O(n)'], ['Write + fill', 'O(n)', 'O(1)'], ['Swap', 'O(n)', 'O(1), kam writes']] } }],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['slow aur fast ka kaam?', 'fast padhta hai, slow likhta hai.'],
            ['Order kaise bachta hai?', 'Non-zero usi order me slow pe likhe jaate hain.'],
            ['Better vs Optimal?', 'Dono O(n)/O(1); swap ek pass me, writes kam.'],
            ['LC 26 me k = 1 kyun?', 'Pehla element hamesha unique.'],
            ['LC 26 me compare kis se?', 'nums[k − 1] (pichla likha hua).'],
            ['Opposite se farak?', 'Yahan dono left se right; filter karte hain.'],
            ['Kitne writes minimum?', 'Non-zero count (swap version).'],
            ['Pattern?', 'Same Direction (Read / Write).'],
          ] }],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [{ say: [
            ['Move Zeroes', 'I keep a write pointer k for where the next non-zero should go and scan with a read pointer i. Whenever nums[i] is non-zero I swap it into position k and advance k. Non-zeros keep their relative order and zeros drift to the end. One pass, O(n) time, O(1) space.'],
          ] }],
        },
        { title: 'Part 11 — Sohvi session', blocks: [{ olist: ['Part 4 ki table khud bharo.', '<b>LC 283</b> submit (pehle Better, phir swap).', '"slow likhta, fast padhta" apne shabdon me.'] }] },
        { title: 'Part 12 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['<b>LC 26 dobara</b> — bina dekhe, 5 min.', 'Same direction template se "value val hatao" wala variant zubaani socho.', 'Sohvi ka 283 review.'] }] },
        { title: 'Part 13 — Homework', blocks: [{ list: ['<b>Dono:</b> [4,0,5,0,0,6] pe 283 ki table.', 'Kal (Day 18): Container — Tum: LC 11.'] }] },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [{ qa: [
            ['[4,0,5,0,0,6] → ?', '[4,5,6,0,0,0].'],
            ['[1,1,2] LC 26 k?', '2.'],
            ['Swap version me k ka meaning?', 'Next non-zero ki jagah.'],
            ['Brute space?', 'O(n).'],
            ['Pattern?', 'Same Direction (Read / Write).'],
          ] }],
        },
      ],
      checks: ['Same direction template', '1 1 2 2 3 aur 0 1 0 3 12 dry run', 'Sohvi: LC 283 Accepted', 'Tum: LC 26 bina dekhe', '8 interview sawaal', 'Self-test 5/5'],
      memory: 'Fast padhta hai, slow likhta hai.',
    },

    // =====================================================================
    // DAY 18 — Container
    4: {
      title: 'Container Pattern — Container With Most Water (LC 11)',
      goal: 'Area = <b>min(h[l], h[r]) × (r − l)</b>. Hamesha <b>chhoti wall move</b> karo — kyun? (proof). <b>Sohvi:</b> observe + dry run. <b>Tum:</b> LC 11 + proof homework.',
      main: 11,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('Area formula + greedy proof', '[1,8,6,2,5,4,8,3,7] pe l/r', 'LC 11 brute + optimal', 'Sohvi: observe · Tum: LC 11'),
            ...rev({
              h: 'LC 283 — Move Zeroes (kal ka)', p: 'Zeros end me, order same.', ex: '[0,1,0,3,12] → [1,3,12,0,0]',
              pat: 'Same Direction (Read / Write)', steps: ['k = 0.', 'nums[i] ≠ 0 → swap(k, i), k++.'],
              code: ap(283, 2), hook: 'Fast padhta hai, slow likhta hai.',
            }),
          ],
        },
        {
          title: 'Part 1 — Formula',
          blocks: [
            { pre: `paani ki height = chhoti wall = min(h[l], h[r])
chaudai          = r − l
area             = min(h[l], h[r]) × (r − l)` },
            { tip: 'Paani chhoti wall ke upar se beh jaata hai — isliye <b>min</b>.' },
          ],
        },
        {
          title: 'Part 2 — Proof: chhoti wall hi kyun move? (Tum)',
          blocks: [
            { p: 'Maan lo h[l] &lt; h[r]. Agar <b>r</b> ko andar laayein: width −1, aur height ≤ h[l] (chhoti wall wahi) → area <b>kabhi nahi badhega</b>. Toh h[l] ke saath ke saare narrower containers bekaar — l ko hata do. Sirf chhoti wall hatane se hi lambi wall milne ka chance hai.' },
          ],
        },
        { title: 'Part 3 — Aaj ka problem: LC 11', blocks: [{ problem: 11 }] },
        {
          title: 'Part 4 — Dry Run: [1,8,6,2,5,4,8,3,7]',
          blocks: [{ table: { head: ['l', 'r', 'h[l]', 'h[r]', 'Area', 'best', 'Move'], rows: [
            ['0', '8', '1', '7', '1 × 8 = 8', '8', 'l++'], ['1', '8', '8', '7', '7 × 7 = 49', '<b>49</b>', 'r--'], ['1', '7', '8', '3', '3 × 6 = 18', '49', 'r--'],
            ['1', '6', '8', '8', '8 × 5 = 40', '49', 'r-- (barabar)'], ['1', '5', '8', '4', '16', '49', 'r--'], ['…', '…', '', '', '', '49', 'l == r tak'],
          ] } }],
        },
        {
          title: 'Part 5 — Brute → Optimal',
          blocks: [
            { p: '<b>Brute — har pair O(n²)</b>' }, { code: sol(11, 0) },
            { p: '<b>Optimal — two pointers O(n)</b>' }, { code: sol(11, 1) },
            { lines: [
              ['int h = Math.min(height[l], height[r]);', 'Chhoti wall.'],
              ['best = Math.max(best, h * (r - l));', 'Area update.'],
              ['if (height[l] < height[r]) l++; else r--;', 'Chhoti wall hatao.'],
            ] },
            { p: 'Better nahi hai — beech ka koi asli tareeka nahi (sort karne se positions bigad jaati hain).' },
          ],
        },
        { title: 'Part 6 — Visualize', blocks: [{ viz: 11, ex: 0 }] },
        {
          title: 'Part 7 — Edge cases',
          blocks: [{ table: { head: ['Case', 'Answer', 'Kyun'], rows: [['[1,1]', '1', 'Sirf ek pair'], ['Barabar walls', 'Koi bhi move', 'Dono ek jaisi — dono ke saath area aur nahi badhega'], ['Badha-badha [1,2,3,4,5]', '6', '2×3 ya 3×2']] } }],
        },
        { title: 'Part 8 — Complexity', blocks: [{ table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n²)', 'O(1)'], ['Two pointers', 'O(n)', 'O(1)']] } }] },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['Area formula?', 'min(h[l], h[r]) × (r − l).'],
            ['Badi wall move karo toh?', 'Width ghati, height same cap → area nahi badhega.'],
            ['Barabar pe?', 'Koi bhi — dono pe answer badh nahi sakta.'],
            ['Sort kar sakte?', 'Nahi — positions (width) bigad jaayengi.'],
            ['Rain water se farak?', 'Yahan sirf 2 walls ka ek container; 42 me har index ka paani.'],
            ['Shuru l, r kahan?', 'Ends pe — max width.'],
            ['Time?', 'O(n).'],
            ['Pattern?', 'Container (shrink shorter wall).'],
          ] }],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [{ say: [
            ['Container With Most Water', 'I start with the widest container, pointers at both ends. The area is the shorter wall times the width. Then I move the pointer at the shorter wall inward, because moving the taller one can only shrink the width while the height stays capped by the same shorter wall. I track the best area until the pointers meet. O(n) time, O(1) space.'],
          ] }],
        },
        { title: 'Part 11 — Sohvi session (observe)', blocks: [{ olist: ['Visualizer me Example 1 chalao, har step pe area bolo.', 'Part 4 ki table khud bharo.', 'Formula yaad karo.'] }] },
        { title: 'Part 12 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['<b>LC 11</b> — 15 min.', 'Proof (Part 2) 3 lines me likho.', 'Brute O(n²) se optimal tak interview ki tarah bolo.'] }] },
        { title: 'Part 13 — Homework', blocks: [{ list: ['<b>Tum:</b> Proof likho — "chhoti wall move karna safe kyun hai" (5 lines).', '<b>Sohvi:</b> [2,3,4,5,18,17,6] dry run.', 'Kal (Day 19): 3Sum — Tum: LC 15.'] }] },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [{ qa: [
            ['[1,8,6,2,5,4,8,3,7] answer?', '49.'],
            ['[2,3,4,5,18,17,6]?', '17 (17 × 1) — 18 aur 17 adjacent; dry run se check karo.'],
            ['h[l] = 3, h[r] = 5 → kaun move?', 'l.'],
            ['Brute time?', 'O(n²).'],
            ['Pattern?', 'Container.'],
          ] }],
        },
      ],
      checks: ['Area formula', 'Chhoti wall proof zubaani', 'Dry run table', 'Sohvi: observe + table', 'Tum: LC 11 Accepted', 'Proof homework', 'Self-test 5/5'],
      memory: 'Chhoti wall paani rokti hai — wahi hatao.',
    },

    // =====================================================================
    // DAY 19 — 3Sum
    5: {
      title: '3Sum — Sort + Fix + Two Pointers (LC 15)',
      goal: 'Teen numbers ka sum 0: <b>sort karo → ek (i) fix → baaki pe LC 167 wale two pointers</b>. Duplicates skip karna. <b>Sohvi:</b> observe. <b>Tum:</b> LC 15.',
      main: 15,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('Sort + fix + two pointers, duplicate skip', '[-1,0,1,2,-1,-4] sorted pe', 'LC 15 teen tareeke', 'Sohvi: observe · Tum: LC 15'),
            ...rev({
              h: 'LC 11 — Container (kal ka)', p: 'Max paani do walls ke beech.', ex: '[1,8,6,2,5,4,8,3,7] → 49',
              pat: 'Container (Shrink Shorter Wall)', steps: ['l, r ends.', 'area = min × width.', 'Chhoti wall hatao.'],
              code: ap(11, 1), hook: 'Chhoti wall paani rokti hai — wahi hatao.',
            }),
          ],
        },
        {
          title: 'Part 1 — Idea: 3Sum = har i ke liye 2Sum',
          blocks: [
            { pre: `nums[i] + nums[l] + nums[r] = 0
⇒ nums[l] + nums[r] = −nums[i]     ← ye LC 167 hai (sorted pair)` },
            { list: ['Sort → two pointers + duplicates paas-paas.', 'i fix, l = i + 1, r = n − 1.', 'nums[i] &gt; 0 → break (aage sab positive).'] },
          ],
        },
        {
          title: 'Part 2 — Duplicate skip (sabse important)',
          blocks: [
            { table: { head: ['Kahan', 'Code', 'Kyun'], rows: [
              ['i pe', 'if (i &gt; 0 &amp;&amp; nums[i] == nums[i − 1]) continue;', 'Same first number → same triplets'],
              ['Triplet ke baad l', 'while (l &lt; r &amp;&amp; nums[l] == nums[l − 1]) l++;', 'Same second number'],
              ['Triplet ke baad r', 'while (l &lt; r &amp;&amp; nums[r] == nums[r + 1]) r--;', 'Same third number'],
            ] } },
          ],
        },
        { title: 'Part 3 — Aaj ka problem: LC 15', blocks: [{ problem: 15 }] },
        {
          title: 'Part 4 — Dry Run: sorted [-4,-1,-1,0,1,2]',
          blocks: [{ table: { head: ['i (val)', 'l', 'r', 'sum', 'Action'], rows: [
            ['0 (−4)', '1', '5', '−4−1+2 = −3', 'l++ … sum hamesha &lt; 0 → koi nahi'],
            ['1 (−1)', '2', '5', '−1−1+2 = 0', '<b>[−1,−1,2]</b>, l++, r--'],
            ['1 (−1)', '3', '4', '−1+0+1 = 0', '<b>[−1,0,1]</b>'],
            ['2 (−1)', '—', '—', '—', 'duplicate → skip'],
            ['3 (0)', '4', '5', '0+1+2 = 3', 'r-- → l == r'],
          ] } }],
        },
        {
          title: 'Part 5 — Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute — teen loops + Set, O(n³)</b>' }, { code: sol(15, 0) },
            { p: '<b>Better — har i ke liye HashSet, O(n²) time, O(n) space</b>' }, { code: sol(15, 1) },
            { p: '<b>Optimal — sort + two pointers, O(n²), O(1) extra</b>' }, { code: sol(15, 2) },
            { lines: [
              ['Arrays.sort(nums);', 'Sort — two pointers aur duplicate skip ke liye.'],
              ['if (i > 0 && nums[i] == nums[i - 1]) continue;', 'Same first number skip.'],
              ['if (nums[i] > 0) break;', 'Aage sab positive.'],
              ['if (sum < 0) l++; else if (sum > 0) r--;', 'LC 167 wala rule.'],
              ['l++; r--; while (...) l++; while (...) r--;', 'Triplet ke baad dono pointers duplicates ke paar.'],
            ] },
          ],
        },
        { title: 'Part 6 — Visualize', blocks: [{ viz: 15, ex: 0 }] },
        {
          title: 'Part 7 — Edge cases',
          blocks: [{ table: { head: ['Case', 'Answer', 'Kyun'], rows: [['[0,0,0]', '[[0,0,0]]', 'Ek hi baar'], ['[0,0,0,0]', '[[0,0,0]]', 'Duplicate skip'], ['[0,1,1]', '[]', 'Sum 0 nahi']] } }],
        },
        { title: 'Part 8 — Complexity', blocks: [{ table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n³)', 'O(k) set'], ['HashSet per i', 'O(n²)', 'O(n)'], ['Sort + two pointers', 'O(n²)', 'O(1) extra']] } }] },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['Sort kyun?', 'Two pointers + duplicate skip dono ke liye.'],
            ['i ka duplicate skip?', 'nums[i] == nums[i − 1] → continue.'],
            ['nums[i] &gt; 0 pe break kyun?', 'Aage sab ≥ nums[i] &gt; 0 → sum &gt; 0.'],
            ['O(n²) se better ho sakta?', 'Nahi general me — O(n²) hi expected.'],
            ['Triplet ke baad dono pointer kyun?', 'Ek hi move karo toh same/duplicate triplet.'],
            ['Better me Collections.sort(t) kyun?', 'Same triplet alag order me na aaye.'],
            ['4Sum?', 'Do loops fix + two pointers, O(n³).'],
            ['Pattern?', 'Sort + Fix + Two Pointers.'],
          ] }],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [{ say: [
            ['3Sum', 'I sort the array, then fix each element as the first number and look for a pair in the rest that sums to its negative, using two pointers like Two Sum II. I skip a fixed value equal to the previous one, and after finding a triplet I move both pointers past equal values, so each triplet appears once. If the fixed value is positive I stop early. O(n²) time, O(1) extra space besides the output.'],
          ] }],
        },
        { title: 'Part 11 — Sohvi session (observe)', blocks: [{ olist: ['Visualizer me Example 1 chalao.', '"3Sum = har i ke liye 2Sum" samjho.', 'Part 4 ki table copy karke khud fill karo.'] }] },
        { title: 'Part 12 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['<b>LC 15</b> — 25 min (Medium).', 'Teeno duplicate-skip lines bina dekhe.', 'Brute → Better → Optimal interview order me bolo.'] }] },
        { title: 'Part 13 — Homework', blocks: [{ list: ['<b>Tum:</b> [-2,0,0,2,2] dry run (answer [[−2,0,2]]).', '<b>Sohvi:</b> Part 1 ka idea 3 lines me.', 'Kal (Day 20): Trapping Rain Water — Tum: LC 42.'] }] },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [{ qa: [
            ['[-2,0,0,2,2]?', '[[−2,0,2]].'],
            ['Pehla step?', 'Sort.'],
            ['sum &lt; 0?', 'l++.'],
            ['Time?', 'O(n²).'],
            ['Pattern?', 'Sort + Fix + Two Pointers.'],
          ] }],
        },
      ],
      checks: ['3Sum = har i ke liye 2Sum', 'Teeno duplicate skip', 'Dry run table', 'Sohvi: observe', 'Tum: LC 15 Accepted', '8 interview sawaal', 'Self-test 5/5'],
      memory: 'Sort, ek fix, baaki do pointers — duplicate skip mat bhoolo.',
    },

    // =====================================================================
    // DAY 20 (Sat) — Trapping Rain Water
    6: {
      title: 'Water Trapping — Trapping Rain Water (LC 42)',
      goal: 'Har index pe paani = <b>min(leftMax, rightMax) − h[i]</b>. Teen tareeke: brute O(n²) → prefix/suffix O(n) space → two pointers O(1). <b>Tum:</b> LC 42 (Hard).',
      main: 42,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            session('Water formula, 3 approaches', 'Left/Right/LeftMax/RightMax/Water table', 'LC 42 teeno', 'Tum: LC 42 · Sohvi: formula + table'),
            ...rev({
              h: 'LC 15 — 3Sum (kal ka)', p: 'Unique triplets, sum 0.', ex: '[-1,0,1,2,-1,-4] → [[-1,-1,2],[-1,0,1]]',
              pat: 'Sort + Fix + Two Pointers', steps: ['Sort.', 'i fix, duplicate skip.', 'l/r — 167 jaisa, triplet ke baad dono skip.'],
              code: ap(15, 2), hook: 'Sort, ek fix, baaki do pointers.',
            }),
          ],
        },
        {
          title: 'Part 1 — Formula',
          blocks: [
            { pre: `index i pe paani = min(leftMax[i], rightMax[i]) − height[i]
leftMax[i]  = 0..i me sabse badi wall
rightMax[i] = i..n−1 me sabse badi wall` },
            { tip: 'Paani dono taraf ki <b>chhoti</b> badi-wall tak bharta hai.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 42', blocks: [{ problem: 42 }] },
        {
          title: 'Part 3 — Brute: har index pe dono taraf scan (O(n²))',
          blocks: [{ code: sol(42, 0) }, { viz: 42, ex: 0 }],
        },
        {
          title: 'Part 4 — Better: prefix max + suffix max arrays (O(n), O(n))',
          blocks: [
            { code: sol(42, 1) },
            { p: 'height = <code>[4,2,0,3,2,5]</code>' },
            { table: { head: ['i', 'h', 'leftMax', 'rightMax', 'water'], rows: [
              ['0', '4', '4', '5', '0'], ['1', '2', '4', '5', '2'], ['2', '0', '4', '5', '4'], ['3', '3', '4', '5', '1'], ['4', '2', '4', '5', '2'], ['5', '5', '5', '5', '0'],
            ] } },
            { p: 'Total = <b>9</b>.' },
          ],
        },
        {
          title: 'Part 5 — Optimal: two pointers (O(1) space)',
          blocks: [
            { p: '<b>Key:</b> agar h[l] &lt; h[r], toh right pe kam se kam h[r] wali wall pakki hai → l ka paani sirf <b>leftMax</b> pe depend. Toh left process karo. Ulta ho toh right.' },
            { code: sol(42, 2) },
            { lines: [
              ['if (height[l] < height[r])', 'Left chhota → right pe badi wall pakki.'],
              ['leftMax = Math.max(leftMax, height[l]);', 'Running max update.'],
              ['water += leftMax - height[l];', 'Is index ka paani (khud include, isliye ≥ 0).'],
              ['else { rightMax ...; r--; }', 'Mirror right side.'],
            ] },
            { table: { head: ['Left', 'Right', 'LeftMax', 'RightMax', 'Water Added'], rows: [
              ['0 (4)', '5 (5)', '4', '0', '0 → l++'], ['1 (2)', '5', '4', '0', '2'], ['2 (0)', '5', '4', '0', '4'], ['3 (3)', '5', '4', '0', '1'], ['4 (2)', '5', '4', '0', '2 → total <b>9</b>'],
            ] } },
            { viz: 42, ex: 0 },
          ],
        },
        {
          title: 'Part 6 — Edge cases',
          blocks: [{ table: { head: ['Case', 'Answer', 'Kyun'], rows: [['[1,2,3]', '0', 'Badhta — right wall nahi rukti'], ['[3,0,3]', '3', 'Ek gaddha'], ['n &lt; 3', '0', 'Gaddha ban hi nahi sakta']] } }],
        },
        { title: 'Part 7 — Complexity', blocks: [{ table: { head: ['Approach', 'Time', 'Space'], rows: [['Brute', 'O(n²)', 'O(1)'], ['Prefix / suffix', 'O(n)', 'O(n)'], ['Two pointers', 'O(n)', 'O(1)']] } }] },
        {
          title: 'Part 8 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['Formula?', 'min(leftMax, rightMax) − h[i].'],
            ['h[l] &lt; h[r] pe left kyun?', 'Right pe badi wall pakki → leftMax hi limit.'],
            ['Brute kyun slow?', 'Har index pe dono taraf dobara scan.'],
            ['Better ka space kahan?', 'Do arrays.'],
            ['Container se farak?', 'Container = do walls; ye har index ka paani.'],
            ['Negative paani?', 'Nahi — leftMax ≥ h[i] hamesha (khud include).'],
            ['Stack approach?', 'Haan, monotonic stack bhi O(n) — Week ke baad.'],
            ['Pattern?', 'Water Trapping (two pointers).'],
          ] }],
        },
        {
          title: 'Part 9 — Bade interview answers: aise bolo',
          blocks: [{ say: [
            ['Trapping Rain Water', 'Water above index i is the smaller of the tallest walls on its left and right, minus its height. The brute force recomputes both maxima per index in O(n²). Precomputing prefix and suffix max arrays gives O(n) time and space. To get O(1) space I use two pointers: if the left height is smaller, the right side has a wall at least that tall, so the left water depends only on leftMax; I add it and move left, otherwise I do the mirror on the right.'],
          ] }],
        },
        { title: 'Part 10 — Sohvi session', blocks: [{ olist: ['Formula (Part 1) yaad karo.', 'Part 4 ki table khud bharo.', 'Brute viz chalao.'] }] },
        { title: 'Part 11 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['<b>LC 42</b> — 30 min (Hard), teeno approaches.', 'Part 5 ki table khud bharo.', '"h[l] &lt; h[r] pe left kyun" proof zubaani.'] }] },
        { title: 'Part 12 — Homework', blocks: [{ list: ['<b>Dono:</b> [0,1,0,2,1,0,1,3,2,1,2,1] ka answer (6) table se nikalo.', 'Kal (Day 21): Revision + Mock.'] }] },
        {
          title: 'Part 13 — Final self-test (bina notes)',
          blocks: [{ qa: [
            ['[4,2,0,3,2,5]?', '9.'],
            ['[0,1,0,2,1,0,1,3,2,1,2,1]?', '6.'],
            ['O(1) space ka trick?', 'Two pointers + running maxima.'],
            ['Better space?', 'O(n).'],
            ['Pattern?', 'Water Trapping.'],
          ] }],
        },
      ],
      checks: ['Water formula', 'Teeno approaches + complexity', 'Left/Right/LeftMax/RightMax/Water table', 'Tum: LC 42 Accepted', 'Proof: chhoti side kyun', 'Self-test 5/5'],
      memory: 'Paani = chhoti badi-wall − apni height.',
    },

    // =====================================================================
    // DAY 21 (Sun) — Revision + Mock
    7: {
      title: 'Revision + Mock — Pattern ID + Interview Order',
      goal: 'Title padh ke <b>pattern pehchano</b>. <b>Sohvi:</b> 125, 344, 283 bina dekhe. <b>Tum:</b> 15, 11, 42 — 10-step interview order me. Week 3 Pattern Sheet + Boss Battle.',
      parts: [
        {
          title: 'Part 0 — Aaj ka session',
          blocks: [{ table: { head: ['Time', 'Slot', 'Aaj kya'], rows: [
            ['9:00–9:20', 'Pattern ID', 'Title → pattern (neeche)'], ['9:20–9:50', 'Sohvi re-solve', '125, 344, 283 bina dekhe'],
            ['9:50–10:30', 'Tum mock', '15, 11, 42 — 10 steps'], ['10:30', 'Boss', 'Week 3 Boss Battle'],
          ] } }],
        },
        {
          title: 'Part 1 — Pattern ID: title padho, pattern bolo',
          blocks: [{ table: { head: ['Title / clue', 'Pattern'], rows: [
            ['"palindrome", "reverse"', 'Opposite Direction'], ['"sorted array, pair sum"', 'Opposite Direction (sorted pair)'],
            ['"in-place remove / move", order same', 'Same Direction (Read / Write)'], ['"max area between lines"', 'Container (shrink shorter wall)'],
            ['"triplets sum 0", unique', 'Sort + Fix + Two Pointers'], ['"water trapped between bars"', 'Water Trapping'],
          ] } }],
        },
        {
          title: 'Part 2 — Week 3 Pattern Sheet (deliverable)',
          blocks: [{ table: { head: ['Pattern', 'Template / Rule', 'Questions'], rows: [
            ['Opposite', 'l = 0, r = n−1, while (l &lt; r)', '344, 125, 167'], ['Same', 'slow likhta, fast padhta', '283, 26'],
            ['Container', 'area = min × width, chhoti wall move', '11'], ['Sort + Fix + 2ptr', 'sort, i fix, l/r, duplicate skip', '15'],
            ['Water Trapping', 'min(LMax, RMax) − h; chhoti side process', '42'],
          ] } }],
        },
        {
          title: 'Part 3 — Sohvi: 3 re-solve (bina dekhe)',
          blocks: [
            ...rev({ h: 'LC 125 — Valid Palindrome', p: 'Letters/digits, case ignore.', ex: '"race a car" → false', pat: 'Opposite Direction', steps: ['Skip faltu.', 'lowercase compare.', 'andar aao.'], code: ap(125, 1), hook: 'Skip, compare, andar aao.' }),
            ...rev({ h: 'LC 344 — Reverse String', p: 'In-place reverse.', ex: '"hello" → "olleh"', pat: 'Opposite Direction', steps: ['l, r ends.', 'swap.', 'l++, r--.'], code: ap(344, 2), hook: 'Dono end se aao, swap karo.' }),
            ...rev({ h: 'LC 283 — Move Zeroes', p: 'Zeros end me.', ex: '[0,1,0,3,12] → [1,3,12,0,0]', pat: 'Same Direction (Read / Write)', steps: ['k = 0.', '≠ 0 → swap(k, i), k++.'], code: ap(283, 2), hook: 'Fast padhta, slow likhta.' }),
          ],
        },
        {
          title: 'Part 4 — Tum: 10-step interview order (15, 11, 42)',
          blocks: [
            { olist: ['Problem apne shabdon me dohrao.', 'Examples + edge cases poochho.', 'Brute bolo + complexity.', 'Bottleneck pehchano.', 'Pattern ka naam lo.', 'Optimal idea + proof.', 'Code likho (bolte hue).', 'Dry run ek example.', 'Edge cases chalao.', 'Final time/space.'] },
            ...rev({ h: 'LC 15 — 3Sum', p: 'Unique triplets sum 0.', ex: '[-1,0,1,2,-1,-4] → [[-1,-1,2],[-1,0,1]]', pat: 'Sort + Fix + Two Pointers', steps: ['Sort.', 'i fix + skip.', 'l/r + skip.'], code: ap(15, 2), hook: 'Har i ke liye 2Sum.' }),
            ...rev({ h: 'LC 11 — Container', p: 'Max area.', ex: '[1,8,6,2,5,4,8,3,7] → 49', pat: 'Container (Shrink Shorter Wall)', steps: ['ends.', 'area.', 'chhoti hatao.'], code: ap(11, 1), hook: 'Chhoti wall paani rokti hai.' }),
            ...rev({ h: 'LC 42 — Trapping Rain Water', p: 'Total paani.', ex: '[4,2,0,3,2,5] → 9', pat: 'Water Trapping (Two Pointers)', steps: ['l, r, leftMax, rightMax.', 'chhoti side process.', 'max − h add.'], code: ap(42, 2), hook: 'Chhoti badi-wall − apni height.' }),
          ],
        },
        {
          title: 'Part 5 — Mock ke sawaal (ek dusre se poochho)',
          blocks: [{ say: [
            ['When does two pointers apply?', 'When the input is sorted or has two natural ends, and comparing the current pair tells me which candidates can be safely discarded. It also applies to in-place filtering with a read and a write pointer. It usually brings O(n²) down to O(n) with O(1) space.'],
            ['How do you prove a greedy two-pointer move?', 'I show the element I drop cannot be part of any better answer with the remaining candidates, for example the shorter wall caps every narrower container it could form. Then scanning until the pointers meet covers every answer that matters.'],
          ] }],
        },
        {
          title: 'Part 6 — Week 3 Interview Deep Dive: 8 chhote sawaal',
          blocks: [{ qa: [
            ['5 patterns ke naam?', 'Opposite, Same, Container, Sort + Fix + 2ptr, Water Trapping.'],
            ['Two pointers ki shart?', 'Sorted / do natural ends / in-place filter + move ka proof.'],
            ['LC 167 vs LC 1?', 'Sorted → two pointers O(1) space; unsorted → HashMap.'],
            ['LC 11 me kaun move?', 'Chhoti wall.'],
            ['LC 15 duplicate skip kahan-kahan?', 'i pe, aur triplet ke baad l aur r pe.'],
            ['LC 42 O(1) space ka trick?', 'Chhoti side process, running max.'],
            ['LC 283 order kaise same?', 'Write pointer pe usi order me non-zero.'],
            ['Opposite loop condition?', 'while (l &lt; r).'],
          ] }],
        },
        { title: 'Part 7 — Sohel (Tum) session (SDE-2)', blocks: [{ olist: ['15, 11, 42 — har ek 10-step order me, timer ke saath (25 / 15 / 30 min).', 'Sohvi ka mock lo: 125, 344, 283.', 'Pattern Sheet khud likh ke Sohvi ko samjhao.'] }] },
        { title: 'Part 8 — Boss Battle', blocks: [{ p: 'Home → <b>⚔️ Week 3 Boss</b> — is week ke saare quiz sawaal. 80%+ = week clear!' }] },
      ],
      checks: ['Pattern ID table bina dekhe', 'Pattern Sheet bana li', 'Sohvi: 125, 344, 283 bina dekhe', 'Tum: 15, 11, 42 — 10 steps me', 'Week 3 Boss clear'],
      memory: 'Opposite, Same, Container, Sort+Fix, Water — paanch pattern, ek soch: pointer tabhi hilao jab proof ho.',
    },
  });
})();
