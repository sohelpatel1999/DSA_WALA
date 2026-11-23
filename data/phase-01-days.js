// Phase 1 (Arrays) — Day 1 lesson. Week 1 = ARRAYS FOUNDATION (Sohel ka diya hua syllabus, 2026-11-07).
// Block types: p, h, list, olist, code, pre, table, problem, viz, lines, qa, say, tip
(function () {
  const P = window.PHASE_CONTENT['arrays'];
  P.lessons = P.lessons || {};
  const ap = (n, i) => P.questions[n].approaches[i].code;
  const sol = (n, i) => 'class Solution {\n' + ap(n, i).split('\n').map(l => '    ' + l).join('\n') + '\n}';
  const session = (theory, viz, coding, lc) => ({ table: { head: ['Time', 'Slot', 'Aaj kya'], rows: [
    ['9:00–9:30', 'Theory', theory],
    ['9:30–9:50', 'Visualization + dry run', viz],
    ['9:50–10:10', 'Coding practice (saath me)', coding],
    ['10:10–10:30', 'LeetCode (Sohvi / Tum)', lc],
  ] } });

  Object.assign(P.lessons, {
    // =====================================================================
    // DAY 1 — Introduction to Arrays
    1: {
      title: 'Introduction to Arrays — Memory, Index, Complexity',
      goal: 'Array kya hai, memory me kaise rehta hai, index se access <b>O(1)</b> kyun hai aur search/insert/delete <b>O(n)</b> kyun. Traversal se print, max, min, sum, average. <b>Sohvi:</b> LC 1920 (traversal). <b>Tum:</b> LC 1920 + LC 26 (in-place modification).',
      main: 1920,
      parts: [
        {
          title: 'Part 0 — Week 1 Objective + Aaj ka session (Day 1 — revision nahi, seedha basics)',
          blocks: [
            { p: 'Ye week sirf questions khatam karne ke liye nahi hai. Objective: <b>array ke core patterns itne clear ho jaayein ki Week 2 aur aage ke topics naturally build ho sakein.</b>' },
            { table: { head: ['Sohvi — week ke end tak', 'Tum — week ke end tak'], rows: [
              ['Arrays samajhna', 'Array fundamentals refresh'],
              ['Kisi bhi array ko confidently traverse karna', 'Prefix Sum master'],
              ['Indexing pakki', 'HashMap master'],
              ['Easy array questions solve karna', 'Pattern recognition'],
              ['HashMap basics', 'Interview explanation skills'],
              ['Prefix Sum ka intuition', '—'],
            ] } },
            { p: '<b>Week 1 ke 5 modules:</b>' },
            { table: { head: ['Module', 'Topic', 'Din'], rows: [
              ['1', 'Introduction to Arrays', 'Day 1'],
              ['2', 'Time Complexity', 'Day 1'],
              ['3', 'Traversal Pattern', 'Day 2'],
              ['4', 'Hashing Basics', 'Day 3–4'],
              ['5', 'Prefix Sum', 'Day 5–6'],
            ] } },
            { p: '<b>Har pattern ke liye 10 steps:</b> Theory → Visualization → Dry Run → Brute Force → Optimal → Code Template → Pattern Recognition → LeetCode → Homework → Revision.' },
            session('Module 1–2: array, memory, index, complexity', '<code>[5,8,2,9,1]</code> box diagram + print/max/min/sum/average', 'printArray(), findMax(), findMin(), sum(), average()', 'Sohvi: LC 1920 · Tum: LC 1920 + LC 26'),
          ],
        },
        {
          title: 'Part 1 — Theory: Array kya hai? (Module 1)',
          blocks: [
            { p: '<b>Definition:</b> Array = <b>same type</b> ke elements ka collection jo memory me <b>ek ke baad ek (continuous)</b> rakhe hote hain, aur har element ko uske <b>index</b> se pehchaana jaata hai.' },
            { table: { head: ['Concept', 'Matlab'], rows: [
              ['<b>Continuous memory</b>', 'Saare elements ek hi block me, beech me gap nahi'],
              ['<b>Fixed size</b>', '<code>new int[5]</code> — size baad me nahi badalta'],
              ['<b>Index</b>', 'Element ki position'],
              ['<b>Zero-based indexing</b>', 'Pehla element index 0, aakhri index <code>n − 1</code>'],
              ['<b>Access</b>', '<code>arr[i]</code>'],
              ['<b>Update</b>', '<code>arr[i] = 10</code>'],
              ['<b>Traverse</b>', '<code>for (int i = 0; i &lt; n; i++)</code> — har element ek baar'],
            ] } },
            { p: '<b>Arrays kyun exist karte hain?</b> Jab bahut saari same type ki values (marks, prices, ids) rakhni ho aur kisi bhi position pe <b>turant</b> pahunchna ho.' },
            { table: { head: ['Advantages', 'Disadvantages'], rows: [
              ['Index se O(1) access', 'Size fixed — badhana ho toh naya array'],
              ['Cache-friendly (continuous memory, fast loop)', 'Beech me insert/delete O(n) — shifting'],
              ['Kam extra memory (sirf data)', 'Search (unsorted) O(n)'],
            ] } },
            { code: `int[] arr = {5, 8, 2, 9, 1};   // declare + initialize
int n = arr.length;            // 5 (length field hai, method nahi)
int first = arr[0];            // 5  — access
arr[2] = 7;                    // update → [5, 8, 7, 9, 1]
// arr[5] → ArrayIndexOutOfBoundsException (valid: 0..4)` },
          ],
        },
        {
          title: 'Part 2 — Visualization: memory layout',
          blocks: [
            { pre: `Index    0     1     2     3     4
       +-----+-----+-----+-----+-----+
       |  5  |  8  |  2  |  9  |  1  |
       +-----+-----+-----+-----+-----+
Addr   1000  1004  1008  1012  1016      (int = 4 bytes)` },
            { p: '<b>Address formula:</b> <code>address(i) = base + i × size</code>. <code>arr[3]</code> → 1000 + 3 × 4 = <b>1012</b>. Ek hi calculation — isliye access <b>O(1)</b>, chahe array me 5 element ho ya 50 lakh.' },
            { tip: 'Zero-based kyun? Index asal me <b>base se offset</b> hai — pehla element base se 0 door hai.' },
          ],
        },
        {
          title: 'Part 3 — Complexity: har operation kyun? (Module 2)',
          blocks: [
            { table: { head: ['Operation', 'Complexity', 'Kyun'], rows: [
              ['Access <code>arr[i]</code>', 'O(1)', 'Address formula — ek calculation'],
              ['Update <code>arr[i] = x</code>', 'O(1)', 'Wahi address, value overwrite'],
              ['Search (unsorted)', 'O(n)', 'Value kahan hai pata nahi — worst case har element dekhna'],
              ['Insert middle', 'O(n)', 'Baad ke saare elements ek jagah right shift'],
              ['Delete middle', 'O(n)', 'Baad ke saare elements ek jagah left shift'],
              ['Traversal', 'O(n)', 'Har element ek baar'],
            ] } },
            { pre: `Insert 7 at index 1 in [5, 8, 2, 9, 1, _]:
  shift: [5, 8, 2, 9, 1, 1] → [5, 8, 2, 9, 9, 1] → [5, 8, 2, 2, 9, 1] → [5, 8, 8, 2, 9, 1]
  put  : [5, 7, 8, 2, 9, 1]        ← 4 shifts = n − index` },
          ],
        },
        {
          title: 'Part 4 — Dry Run: [5, 8, 2, 9, 1]',
          blocks: [
            { p: '<b>Print + Maximum + Minimum + Sum</b> (ek hi loop ki soch):' },
            { table: { head: ['i', 'arr[i]', 'Print', 'max', 'min', 'sum'], rows: [
              ['start', '—', '—', '5 (arr[0])', '5 (arr[0])', '0'],
              ['0', '5', '5', '5', '5', '5'],
              ['1', '8', '5 8', '<b>8</b>', '5', '13'],
              ['2', '2', '5 8 2', '8', '<b>2</b>', '15'],
              ['3', '9', '5 8 2 9', '<b>9</b>', '2', '24'],
              ['4', '1', '5 8 2 9 1', '9', '<b>1</b>', '25'],
            ] } },
            { p: '<b>Average</b> = sum / n = 25 / 5 = <b>5.0</b>. (Java me <code>(double) sum / n</code> — warna integer division.)' },
          ],
        },
        {
          title: 'Part 5 — Coding Practice: printArray, findMax, findMin, sum, average',
          blocks: [
            { code: `static void printArray(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        System.out.print(arr[i] + " ");
    }
    System.out.println();
}

static int findMax(int[] arr) {
    int max = arr[0];
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

static int findMin(int[] arr) {
    int min = arr[0];
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] < min) min = arr[i];
    }
    return min;
}

static int sum(int[] arr) {
    int total = 0;
    for (int i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    return total;
}

static double average(int[] arr) {
    return (double) sum(arr) / arr.length;
}` },
            { lines: [
              ['for (int i = 0; i < arr.length; i++)', 'Traversal template: index 0 se n − 1 tak, har element ek baar.'],
              ['int max = arr[0];', 'Pehle element se shuru — 0 se nahi (saare negative ho sakte hain).'],
              ['for (int i = 1; ...)', 'arr[0] already le liya, isliye 1 se.'],
              ['if (arr[i] > max) max = arr[i];', 'Bada mila → update.'],
              ['total += arr[i];', 'Running total.'],
              ['return (double) sum(arr) / arr.length;', 'Cast pehle — warna 7 / 2 = 3 (integer division).'],
            ] },
            { tip: 'Maine ye functions <code>[5,8,2,9,1]</code> pe chala ke check kiye: max 9, min 1, sum 25, average 5.0.' },
          ],
        },
        { title: 'Part 6 — Aaj ka problem: LC 1920 Build Array from Permutation', blocks: [{ problem: 1920 }] },
        {
          title: 'Part 7 — Thinking: Brute (extra array) → Optimal (in-place, O(1) space)',
          blocks: [
            { p: '<b>Brute / Sohvi wala:</b> Naya array <code>ans</code> banao, traversal me <code>ans[i] = nums[nums[i]]</code>. Seedha — sirf indexing samajhni hai. O(n) time, O(n) space.' },
            { p: '<b>Tum ke liye follow-up (O(1) space):</b> Same array me naya value likh diya toh purani value kho jaayegi, jo kisi aur index ko chahiye. Trick: har value &lt; n hai, toh ek cell me <b>dono</b> rakh lo: <code>nums[i] = old + n × new</code>. <code>% n</code> se old, <code>/ n</code> se new milta hai.' },
            { pre: `nums = [0,2,1,5,3,4], n = 6
i = 1: old = 2, new = nums[2] % 6 = 1 → nums[1] = 2 + 6×1 = 8   (8 % 6 = 2 old, 8 / 6 = 1 new)
… doosre loop me har cell / 6 → [0,1,2,4,5,3]` },
          ],
        },
        {
          title: 'Part 8 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute (Sohvi) — extra array</b>' },
            { code: sol(1920, 0) },
            { lines: [
              ['int[] ans = new int[n];', 'Result ke liye naya array (same size).'],
              ['for (int i = 0; i < n; i++)', 'Traversal.'],
              ['ans[i] = nums[nums[i]];', 'Pehle nums[i] (ek index), phir us index ki value.'],
              ['return ans;', 'Naya array.'],
            ] },
            { p: '<b>Optimal (Tum) — in-place encoding</b>' },
            { code: sol(1920, 1) },
            { lines: [
              ['nums[i] = nums[i] + n * (nums[nums[i]] % n);', 'Old value rakho, upar se n × new jodo. <code>% n</code> taaki kisi encoded cell se bhi purani value hi mile.'],
              ['nums[i] = nums[i] / n;', 'Doosra loop: sirf new value bachao.'],
            ] },
          ],
        },
        {
          title: 'Part 9 — Visualize: LC 1920 line-by-line',
          blocks: [
            { list: ['Pehle loop me har cell <b>encode</b> hota hai (old + n × new).', 'Doosre loop me <code>/ n</code> se final values.', 'Example 2 bhi chalao.'] },
            { viz: 1920, ex: 0 },
          ],
        },
        {
          title: 'Part 10 — Tum: LC 26 Remove Duplicates (in-place modification)',
          blocks: [
            { problem: 26 },
            { p: '<b>Idea:</b> Sorted array me duplicates saath-saath hote hain. <code>k</code> = agla unique element kahan likhna hai. Naya value (pichle unique se alag) mila → <code>nums[k] = nums[i]; k++</code>.' },
            { code: sol(26, 1) },
            { lines: [
              ['int k = 1;', 'Pehla element hamesha unique — agla likhne ki jagah index 1.'],
              ['if (nums[i] != nums[k - 1])', 'Pichle likhe unique se alag → naya unique.'],
              ['nums[k] = nums[i]; k++;', 'Aage likho (in-place), k badhao.'],
              ['return k;', 'Pehle k elements unique hain; baaki ignore.'],
            ] },
            { viz: 26, ex: 1 },
          ],
        },
        {
          title: 'Part 11 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Kya dhyaan rakhna'], rows: [
              ['Empty array', 'findMax/findMin me <code>arr[0]</code> → exception. Pehle <code>length == 0</code> check (LC constraints me n ≥ 1).'],
              ['Ek element', 'max = min = woh hi; loop 1 se shuru hoke chalta hi nahi.'],
              ['Saare negative', 'max ko 0 se shuru kiya toh galat 0 aayega — arr[0] se shuru karo.'],
              ['Average integer', '(double) cast bhoole toh decimal kat jaayega.'],
              ['Index n', '<code>arr[n]</code> → ArrayIndexOutOfBoundsException (valid 0..n−1).'],
              ['LC 26: saare same', '<code>[2,2,2]</code> → k = 1.'],
            ] } },
          ],
        },
        {
          title: 'Part 12 — Complexity',
          blocks: [
            { table: { head: ['Code', 'Time', 'Space'], rows: [
              ['printArray / findMax / findMin / sum', 'O(n)', 'O(1)'],
              ['average', 'O(n)', 'O(1)'],
              ['LC 1920 brute', 'O(n)', 'O(n)'],
              ['LC 1920 in-place', 'O(n)', 'O(1)'],
              ['LC 26', 'O(n)', 'O(1)'],
            ] } },
          ],
        },
        {
          title: 'Part 13 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Array access O(1) kyun?', 'Continuous memory + same size → address = base + i × size, ek calculation.'],
              ['Search O(n) kyun?', 'Unsorted me value kahan hai pata nahi — worst case saare dekhne padte hain.'],
              ['Beech me insert O(n) kyun?', 'Baad ke saare elements shift karne padte hain.'],
              ['Zero-based indexing kyun?', 'Index = base se offset; pehla element offset 0.'],
              ['<code>arr.length</code> vs <code>arr.length()</code>?', 'Array me <code>length</code> field; String me <code>length()</code> method.'],
              ['findMax ko 0 se shuru kiya toh?', 'Saare negative hon toh galat answer 0.'],
              ['LC 1920 O(1) space me kaise?', 'Ek cell me old + n × new; % n se old, / n se new.'],
              ['LC 26 me k kya represent karta hai?', 'Agle unique ko likhne ki jagah = ab tak unique count.'],
            ] },
          ],
        },
        {
          title: 'Part 14 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Why is array access O(1)?', 'An array stores its elements in one continuous block of memory and every element has the same size. So the address of index i is the base address plus i times the element size. That is a single arithmetic step regardless of the array length, so access and update are O(1). Searching an unsorted array is O(n) because I do not know where the value is, and inserting or deleting in the middle is O(n) because the following elements must shift.'],
              ['LC 1920 approach', 'The direct solution builds a new array where ans[i] = nums[nums[i]], which is O(n) time and O(n) space. To use O(1) extra space, I use the fact that every value is less than n. In a first pass I store both values in each cell as old + n times new, where new is nums[nums[i]] modulo n so I always read the original value. In a second pass I divide every cell by n to keep only the new value.'],
            ] },
          ],
        },
        {
          title: 'Part 15 — Sohvi session',
          blocks: [
            { olist: [
              'Paper pe <code>[5,8,2,9,1]</code> ka box diagram + index likho.',
              'Part 4 ka dry-run table khud bharo.',
              'printArray, findMax, findMin, sum, average khud likho aur chalao.',
              '<b>LC 1920</b> brute (extra array) se solve + submit. <b>Goal: traversal.</b>',
            ] },
          ],
        },
        {
          title: 'Part 16 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: [
              '<b>LC 1920</b> — brute + O(1) space version dono.',
              '<b>LC 26</b> — in-place, O(1) space. <b>Goal: in-place modification.</b>',
              'Complexity table (Part 3) zubaani — har "kyun" ke saath.',
            ] },
          ],
        },
        {
          title: 'Part 17 — Homework',
          blocks: [
            { list: [
              '<b>Sohvi:</b> Ek array ko <b>manually reverse</b> karo (paper pe), array draw karo aur har element ke neeche index likho.',
              '<b>Tum:</b> Ek <b>generic traversal template</b> likho (print / sum / count / find ek hi pattern me) aur O(1) access ko apne shabdon me explain karo.',
              'Kal (Day 2): Traversal Mastery — LC 1480 (+ Tum: LC 1295).',
            ] },
          ],
        },
        {
          title: 'Part 18 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[4,7,1]</code> ka max, min, sum?', '7, 1, 12.'],
              ['<code>int[] a = new int[4]</code> ka last valid index?', '3.'],
              ['<code>arr[3]</code> ka address (base 2000, int)?', '2000 + 3 × 4 = 2012.'],
              ['Delete middle complexity?', 'O(n).'],
              ['<code>[0,1,2]</code> (LC 1920) output?', '<code>[0,1,2]</code> (nums[nums[i]] = nums[i] yahan).'],
            ] },
          ],
        },
      ],
      checks: [
        'Array ki definition + continuous memory + fixed size bata sakta/sakti hu',
        'Address formula se O(1) access explain kiya',
        'Complexity table ke 6 "kyun" zubaani',
        '[5,8,2,9,1] ka dry run khud kiya',
        'printArray / findMax / findMin / sum / average khud likhe',
        'Sohvi: LC 1920 Accepted',
        'Tum: LC 1920 (O(1) space) + LC 26 Accepted',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Array = line me khade log: number (index) pata ho toh seedha pahuncho (O(1)); naam (value) se dhoondhna ho toh sabse poochna padega (O(n)).',
    },
  });
})();
