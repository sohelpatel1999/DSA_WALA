// Phase 4 (Linked List) — Week 6 lessons (local days 8–14 = global days 36–42). Day 1 (phase-01) wala format.
// Week 6 = ADVANCED LINKED LIST — SDE-2 Interview Focus (Sohel ka diya hua syllabus, 2026-11-07).
(function () {
  const P = window.PHASE_CONTENT['linked-list'];
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
  // Week 6 ka daily structure (9:00–10:30 PM)
  const session = (revision, theory, pattern, dry, coding, cx) => ({ table: { head: ['Time', 'Activity', 'Aaj kya'], rows: [
    ['9:00–9:10', 'Previous day revision', revision],
    ['9:10–9:30', 'Theory + concepts', theory],
    ['9:30–9:50', 'Pattern + visualization', pattern],
    ['9:50–10:10', 'Dry run + pointer tracking', dry],
    ['10:10–10:25', 'Individual coding', coding],
    ['10:25–10:30', 'Complexity + homework', cx],
  ] } });
  const RULE = '<b>Important rule:</b> Har problem me pehle <b>pointer movement</b> samjho, phir code likho. Advanced Linked List me ek galat pointer update poori list kho sakta hai. <b>Sohvi:</b> concepts, visualization, dry runs. <b>Tum:</b> optimal solution, math reasoning, edge cases, bina hints implementation.';
  const objectives = items => ({ list: items });

  Object.assign(P.lessons, {
    // =====================================================================
    // DAY 36
    8: {
      title: 'Cycle Detection — HashSet + Floyd (Fast & Slow)',
      goal: '<b>Pattern 1: Fast &amp; Slow Pointers.</b> Cycle kaise banta hai, traversal infinite kyun hota hai, HashSet approach, aur Floyd ka algorithm — fast aur slow <b>pakka</b> kyun milte hain. <b>LC 141</b>.',
      main: 141,
      parts: [
        {
          title: 'Part 0 — Previous revision (Week 5) + Aaj ka session',
          blocks: [
            { p: RULE },
            session('Week 5: reverse, middle, merge', 'Module 1: cycle kya hai · Module 2: HashSet', 'Module 3: Floyd — slow 1, fast 2', '<code>1→2→3→4→5</code>, 5.next = 3', 'Tum: LC 141 dono approaches · Sohvi: drawing + verbal', 'HashSet O(n) space vs Floyd O(1)'),
            ...rev({
              h: 'LC 876 — Middle of the Linked List',
              p: 'Middle node (even me second).',
              ex: '1→2→3→4→5 → 3     1→2→3→4→5→6 → 4',
              pat: 'Slow / fast',
              steps: ['slow = fast = head.', 'fast != null && fast.next != null tak: slow 1, fast 2.', 'return slow.'],
              code: ap(876, 1),
              hook: 'Aaj bhi yahi do pointers — bas loop ke andar slow == fast check jodna hai.',
            }),
            ...rev({
              h: 'LC 206 — Reverse Linked List',
              p: 'List ulti karo, links badal ke.',
              ex: '1 → 2 → 3 → null   →   3 → 2 → 1 → null',
              pat: 'Three pointers',
              steps: ['prev = null, current = head.', 'Save next, reverse, move prev, move current.', 'return prev.'],
              code: ap(206, 1),
              hook: 'S-R-P-C. Naya head = prev.',
            }),
            ...rev({
              h: 'LC 21 — Merge Two Sorted Lists',
              p: 'Do sorted lists jodo.',
              ex: '[1,2,4] + [1,3,4] → [1,1,2,3,4,4]',
              pat: 'Dummy + tail',
              steps: ['dummy, tail = dummy.', 'Chhota node tail.next pe, us list aage, tail aage.', 'Bachi list attach, return dummy.next.'],
              code: ap(21, 1),
              hook: 'Dummy se shuru, chhota jodo, bacha hua seedha jodo.',
            }),
          ],
        },
        {
          title: 'Part 1 — Learning Objectives',
          blocks: [
            objectives([
              'Linked List me cycle kaise create hota hai?',
              'Normal aur cyclic Linked List me difference.',
              'Infinite traversal kyun hota hai?',
              'HashSet approach kaise kaam karti hai?',
              'Floyd ka Cycle Detection algorithm kaise kaam karta hai?',
              'Fast aur slow eventually collide kyun karte hain?',
              'Dono approaches ki complexity.',
            ]),
          ],
        },
        {
          title: 'Part 2 — Module 1: Understanding Cycle',
          blocks: [
            { pre: `Normal:   1 → 2 → 3 → 4 → NULL

Cyclic:   1 → 2 → 3 → 4
              ↑       ↓
              └───────┘        (node 4 ka next → node 2)` },
            { list: [
              'List me <b>NULL kabhi nahi</b> aayega.',
              'Traversal lagataar chalta rahega: 1, 2, 3, 4, 2, 3, 4, 2, …',
              '<code>while (current != null)</code> kabhi terminate nahi hoga.',
            ] },
            { code: `node4.next = node2;   // bas ek assignment — aur cycle ban gayi` },
            { tip: 'Cycle me koi naya node nahi banta — bas kisi node ka <code>next</code> <b>pichle</b> node pe point karta hai.' },
          ],
        },
        { title: 'Part 3 — Aaj ka problem: LC 141 Linked List Cycle', blocks: [{ problem: 141 }] },
        {
          title: 'Part 4 — Module 2: HashSet Approach (Brute)',
          blocks: [
            { p: '<b>Concept:</b> Har visited node ka <b>reference</b> Set me rakho. Koi node dobara mila = cycle.' },
            { olist: [
              'Head se traversal shuru.',
              'Current node Set me already hai?',
              'Haan → cycle hai.',
              'Nahi → current node add karo.',
              'Next node pe jao.',
              'NULL aaya → cycle nahi.',
            ] },
            { pre: `1 → 2 → 3 → 4
    ↑       ↓
    └───────┘` },
            { table: { head: ['Current Node', 'Set', 'Result'], rows: [
              ['1', '1', 'New node'],
              ['2', '1, 2', 'New node'],
              ['3', '1, 2, 3', 'New node'],
              ['4', '1, 2, 3, 4', 'New node'],
              ['2', '1, 2, 3, 4', '<b>Already visited — cycle</b>'],
            ] } },
            { p: 'Complexity: Time O(n), Space O(n).' },
            { tip: 'Set me <b>node</b> daalo, <code>node.val</code> nahi. List <code>[1,1,1]</code> me values repeat hain par cycle nahi bhi ho sakti.' },
          ],
        },
        {
          title: 'Part 5 — Module 3: Floyd Cycle Detection (Optimal)',
          blocks: [
            { pre: `slow = slow.next;          // 1 step
fast = fast.next.next;     // 2 steps

while (fast != null && fast.next != null)   // loop condition
if (slow == fast)                           // har iteration me check` },
            { p: 'Agar dono <b>same node reference</b> pe hain → cycle hai.' },
            { p: '<b>Collision kyun hota hai?</b>' },
            { list: [
              'Slow 1 step chalta hai, fast 2 step.',
              '<b>Relative speed = 1 step</b> per iteration.',
              'Cycle ke andar fast har iteration me slow ke saath gap <b>1 se kam</b> karta hai.',
              'Gap 1-1 karke ghatta hai → 0 pe zaroor pahunchega → fast kood ke aage nahi nikal sakta.',
            ] },
            { table: { head: ['Approach', 'Time', 'Space'], rows: [['HashSet', 'O(n)', 'O(n)'], ['Floyd', 'O(n)', 'O(1)']] } },
          ],
        },
        {
          title: 'Part 6 — Dry Run: 1 → 2 → 3 → 4 → 5, cycle 5 → 3',
          blocks: [
            { pre: `1 → 2 → 3 → 4 → 5
        ↑       ↓
        └───────┘` },
            { table: { head: ['Iteration', 'Slow', 'Fast', 'slow == fast?'], rows: [
              ['Start', '1', '1', '—'],
              ['1', '2', '3', 'Nahi'],
              ['2', '3', '5', 'Nahi'],
              ['3', '4', '4 (5 → 3 → 4)', '<b>Haan — collision at node 4</b>'],
            ] } },
            { p: 'Iteration 3 me fast 5 se do step: 5.next = 3, 3.next = 4 → fast = 4. Slow bhi 4 → <b>return true</b>.' },
          ],
        },
        {
          title: 'Part 7 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — HashSet</b>' },
            { code: sol(141, 0) },
            { p: '<b>Optimal — Floyd</b>' },
            { code: sol(141, 1) },
            { lines: [
              ['ListNode slow = head, fast = head;', 'Dono head se.'],
              ['while (fast != null && fast.next != null)', 'Fast end pe pahunch gaya → list khatam → cycle nahi. Empty list bhi yahin handle.'],
              ['slow = slow.next;', '1 step.'],
              ['fast = fast.next.next;', '2 step — condition ne guarantee diya fast.next null nahi.'],
              ['if (slow == fast) return true;', '<b>Reference</b> compare (same node object), value nahi. Move ke <b>baad</b> check — start me dono head pe hain.'],
              ['return false;', 'Loop null ki wajah se ruka → cycle nahi.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Visualize: slow aur fast ko milte dekho',
          blocks: [
            { list: ['Example 1: <code>[3,2,0,-4]</code>, tail → index 1.', '"cycle" text batata hai tail ka next kahan hai.', 'Example 2 (<code>[1,2]</code>, pos 0) aur Example 3 (no cycle) bhi chalao.'] },
            { viz: 141, ex: 0 },
          ],
        },
        {
          title: 'Part 9 — Tum ke 7 cases (edge cases)',
          blocks: [
            { table: { head: ['#', 'Case', 'Input', 'Answer', 'Floyd me kya hota hai'], rows: [
              ['1', 'HashSet solution', '<code>[3,2,0,-4]</code>, pos 1', 'true', 'Node 2 dobara mila'],
              ['2', 'Floyd optimal', 'same', 'true', 'Collision at −4'],
              ['3', 'Empty list', '<code>[]</code>', 'false', 'fast == null → loop hi nahi'],
              ['4', 'Single node, no cycle', '<code>[1]</code>, pos −1', 'false', 'fast.next == null → stop'],
              ['5', 'Single node → itself', '<code>[1]</code>, pos 0', 'true', 'slow = 1, fast = 1.next.next = 1 → match'],
              ['6', 'Cycle head se', '<code>[1,2]</code>, pos 0', 'true', 'Iteration 2 me dono 1 pe'],
              ['7', 'Cycle beech se', '<code>[1..5]</code>, pos 2', 'true', 'Collision at 4 (Part 6)'],
            ] } },
            { tip: 'Ye saare cases maine Java me chala ke check kiye hain — dono approaches same answer dete hain.' },
          ],
        },
        {
          title: 'Part 10 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
              ['HashSet', 'O(n)', 'O(n)', 'Har node ek baar Set me'],
              ['Floyd', 'O(n)', 'O(1)', 'Slow cycle me pahunchne ke baad ek chakkar se pehle pakda jaata hai'],
            ] } },
          ],
        },
        {
          title: 'Part 11 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Floyd space me HashSet se behtar kyun?', 'Sirf 2 pointers — O(1). HashSet har node store karta hai — O(n).'],
              ['Kya fast aur slow ek doosre ko miss kar sakte hain?', 'Nahi. Relative speed 1 hai, gap har step 1 ghatta hai — 0 pe pahunchna hi padega.'],
              ['<code>fast.next != null</code> kyun check karte hain?', '<code>fast.next.next</code> karne se pehle fast.next null nahi hona chahiye, warna NullPointerException.'],
              ['Node values compare karte hain ya references?', 'References (<code>slow == fast</code>). Duplicate values galat "cycle" bata dengi.'],
              ['<code>slow == fast</code> check move se pehle kiya toh?', 'Start me dono head pe hain → turant galat true.'],
              ['Fast 3 step chale toh?', 'Kaam kar sakta hai par relative speed 2 — gap odd/even ke hisaab se kood sakta hai; zyada null checks. 2 hi standard.'],
              ['Cycle me normal traversal kyun atakta hai?', 'null kabhi nahi aata.'],
              ['Self-loop <code>[1]</code>, pos 0 me Floyd?', 'Pehli iteration me slow = 1, fast = 1 → true.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach (HashSet → Floyd)', 'A simple solution walks the list and stores every visited node reference in a hash set; if I see a node again there is a cycle, and if I reach null there is not. That is O(n) time and O(n) space. To use constant space I use Floyd: slow moves one step and fast moves two. If fast reaches null, there is no cycle. Otherwise, once both are inside the cycle, fast closes the gap by one node every iteration, so they must meet. O(n) time, O(1) space.'],
              ['Why is the collision guaranteed?', 'Inside the cycle, the relative speed of fast with respect to slow is one node per iteration. So the distance between them shrinks by exactly one each step. Since it decreases one at a time, it cannot skip zero, so fast lands exactly on slow instead of jumping over it.'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohvi session (Learning tasks)',
          blocks: [
            { olist: [
              'Cycle ka concept samjho — <code>node4.next = node2</code> se kya hota hai.',
              'Normal vs cyclic Linked List <b>draw</b> karo.',
              'HashSet approach <b>verbally</b> explain karo (Part 4 table se).',
              'Visualizer me fast aur slow ka movement observe karo.',
              'Collision ka reason apne shabdon me: "tez wala har step 1 node paas aata hai".',
            ] },
            { tip: 'Coding abhi mandatory nahi. Pehle pointer movement clear hona chahiye.' },
          ],
        },
        {
          title: 'Part 14 — Sohel (Tum) session — LC 141 (Easy)',
          blocks: [
            { olist: [
              'HashSet solution implement + submit.',
              'Floyd optimal solution implement + submit.',
              'Part 9 ke saare 7 cases apne test me chalao (empty, single, self-loop, head se, beech se).',
              'Interview sawaal bolo: Floyd vs HashSet space; miss ho sakte hain?; <code>fast.next != null</code> kyun; values ya references?',
            ] },
          ],
        },
        {
          title: 'Part 15 — Homework',
          blocks: [
            { list: [
              '<b>Sohvi:</b> 3 alag cyclic Linked Lists draw karo aur har ek me fast/slow movement dikhao.',
              '<b>Tum:</b> Apne shabdon me likho ki collision kyun guaranteed hai, aur LC 141 bina notes likho.',
              'Kal (Day 37): Cycle <b>kahan se shuru</b> hoti hai — LC 142 + math.',
            ] },
          ],
        },
        {
          title: 'Part 16 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>1→2→3→4→5</code>, 5.next = 3 — collision kahan?', 'Node 4 (3 iterations).'],
              ['HashSet ka space?', 'O(n).'],
              ['Floyd ka loop condition?', '<code>fast != null &amp;&amp; fast.next != null</code>'],
              ['Empty list ka answer?', 'false.'],
              ['Compare kya karte hain?', 'Node references.'],
            ] },
          ],
        },
      ],
      checks: [
        'Normal vs cyclic list draw kar sakta/sakti hu',
        'Infinite traversal kyun hota hai — bata sakta/sakti hu',
        'HashSet table (Part 4) khud bhari',
        'Floyd dry run (collision at 4) khud kiya',
        'Collision guarantee (relative speed 1) explain kiya',
        'Tum: LC 141 dono approaches + 7 cases',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Gol track pe tez wala har step 1 paas aata hai — pakad hi leta hai. References compare karo, values nahi.',
    },

    // =====================================================================
    // DAY 37
    9: {
      title: 'Find Cycle Start — Floyd Phase 2 + Mathematical Reasoning',
      goal: '<b>Pattern 2: Floyd + Math.</b> Collision point aur cycle start ka farak, cycle length, Floyd ka second phase, aur <b>proof</b> ki slow ko head pe reset karke dono 1-1 step chalne se cycle start kyun milta hai. <b>LC 142</b>.',
      main: 142,
      parts: [
        {
          title: 'Part 0 — Previous day revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('LC 141 Floyd (kal ka)', 'Module 1: a, b, c, L · Module 2: math', 'Module 3: two-phase algorithm', '<code>3 → 2 → 0 → -4</code> (pos 1) aur 1..8 example', 'Tum: LC 142 · Sohvi: a, b, c drawing', 'O(n) / O(1); cycle length follow-up'),
            ...rev({
              h: 'LC 141 — Linked List Cycle (kal ka)',
              p: 'Cycle hai ya nahi.',
              ex: '3 → 2 → 0 → -4 → (2)   → true',
              pat: 'Floyd (slow 1, fast 2)',
              steps: ['slow = fast = head.', 'Loop: slow 1, fast 2; slow == fast → true.', 'fast null → false.'],
              code: ap(141, 1),
              hook: 'Relative speed 1 → collision pakka.',
            }),
            ...rev({
              h: 'LC 876 — Middle of the Linked List',
              p: 'Middle node.',
              ex: '1→2→3→4→5 → 3',
              pat: 'Slow / fast',
              steps: ['slow = fast = head.', 'slow 1, fast 2.', 'return slow.'],
              code: ap(876, 1),
              hook: 'Fast ne d chala toh slow ne d/2 — yahi "double distance" idea aaj ke proof ki jaan hai.',
            }),
          ],
        },
        {
          title: 'Part 1 — Learning Objectives',
          blocks: [
            objectives([
              'Collision (meeting point) aur cycle start me difference.',
              'Cycle length kya hoti hai?',
              'Floyd algorithm ka second phase.',
              'Meeting point se cycle start kaise milta hai?',
              'Mathematical proof samajhna.',
            ]),
          ],
        },
        {
          title: 'Part 2 — Module 1: Three Important Points',
          blocks: [
            { pre: `Head
 |
 v
1 → 2 → 3 → 4 → 5
        ↑       ↓
        8 ← 7 ← 6          (cycle start = 3, 8.next = 3)` },
            { table: { head: ['Distance', 'Matlab', 'Is example me'], rows: [
              ['<code>a</code>', 'Head se cycle start tak', '1 → 3 = <b>2</b>'],
              ['<code>b</code>', 'Cycle start se meeting point tak', '3 → 7 = <b>4</b>'],
              ['<code>c</code>', 'Meeting point se wapas cycle start tak', '7 → 8 → 3 = <b>2</b>'],
              ['<code>L</code>', 'Cycle length = b + c', '<b>6</b> (3,4,5,6,7,8)'],
            ] } },
            { p: 'Meeting point = node 7 kaise? Phase 1 chalao: (slow, fast) = (1,1) → (2,3) → (3,5) → (4,7) → (5,3) → (6,5) → (<b>7,7</b>).' },
            { tip: 'Is example me <code>a = c = 2</code> — yahi Floyd ka jaadu hai, jo neeche prove karenge.' },
          ],
        },
        {
          title: 'Part 3 — Module 2: Mathematics Behind Floyd',
          blocks: [
            { pre: `Slow ne travel kiya:   a + b
Fast ne travel kiya:   2(a + b)
Fast ne slow se extra: poore k chakkar (k ≥ 1)

  2(a + b) − (a + b) = kL
              a + b  = kL
                  a  = kL − b
  L = b + c  ⇒    a  = (k − 1)L + c` },
            { p: '<b>Conclusion:</b> Head se cycle start ki doori (<code>a</code>) = meeting point se cycle start ki doori (<code>c</code>) + kuch poore chakkar. Isliye:' },
            { olist: [
              '<b>Slow</b> ko head pe reset karo.',
              '<b>Fast</b> ko meeting point pe hi rakho.',
              'Dono ko <b>1-1 step</b> chalao.',
              'Jahan dono milenge, wahi cycle start hai.',
            ] },
            { p: '1..8 example: slow 1 → 2 → <b>3</b>, fast 7 → 8 → <b>3</b>. Do step (a = c = 2) me dono 3 pe.' },
          ],
        },
        { title: 'Part 4 — Aaj ka problem: LC 142 Linked List Cycle II', blocks: [{ problem: 142 }] },
        {
          title: 'Part 5 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute (HashSet):</b> Traverse karte jao, nodes Set me daalo. <b>Pehla</b> node jo dobara mile wahi cycle start hai (kyunki cycle me ghusne wala pehla node hi sabse pehle repeat hota hai). O(n) / O(n).' },
            { p: '<b>Optimal (Floyd two-phase):</b> Phase 1 = LC 141 (meet). Phase 2 = slow head pe, dono 1-1 step. O(n) / O(1).' },
          ],
        },
        {
          title: 'Part 6 — Module 4: Dry Run — 3 → 2 → 0 → -4 (pos 1)',
          blocks: [
            { pre: `3 → 2 → 0 → -4
    ↑       ↓
    └───────┘          Head = 3, cycle start = 2` },
            { p: '<b>Phase 1 (detect):</b>' },
            { table: { head: ['Iteration', 'Slow', 'Fast', 'Meet?'], rows: [
              ['Start', '3', '3', '—'],
              ['1', '2', '0', 'Nahi'],
              ['2', '0', '2 (−4 → 2)', 'Nahi'],
              ['3', '−4', '−4 (0 → −4)', '<b>Haan — meeting point −4</b>'],
            ] } },
            { p: '<b>Phase 2 (start dhoondo):</b> slow = head (3), fast = −4.' },
            { table: { head: ['Step', 'Slow', 'Fast', 'Equal?'], rows: [
              ['0', '3', '−4', 'Nahi'],
              ['1', '2', '2', '<b>Haan → cycle start = node 2 (index 1)</b>'],
            ] } },
            { p: 'Yahan a = 1 (3 → 2), b = 2 (2 → 0 → −4), c = 1 (−4 → 2), L = 3. a = c ✓.' },
          ],
        },
        {
          title: 'Part 7 — Module 3: Algorithm — Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — HashSet</b>' },
            { code: sol(142, 0) },
            { p: '<b>Optimal — Floyd two-phase</b>' },
            { code: sol(142, 1) },
            { lines: [
              ['ListNode slow = head, fast = head;', 'Phase 1 setup.'],
              ['while (fast != null && fast.next != null)', 'LC 141 jaisa loop.'],
              ['if (slow == fast) break;', 'Meeting point mil gaya → Phase 1 khatam.'],
              ['if (fast == null || fast.next == null) return null;', 'Loop null ki wajah se ruka → cycle nahi.'],
              ['slow = head;', 'Phase 2: slow head pe reset; fast meeting point pe hi.'],
              ['while (slow != fast)', 'Dono a steps baad cycle start pe milenge.'],
              ['slow = slow.next; fast = fast.next;', '<b>Dono 1-1 step</b> — fast ab 2 step nahi chalta.'],
              ['return slow;', 'Cycle start node.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Visualize: Phase 1 + Phase 2',
          blocks: [
            { list: ['Phase 1 me fast 2 step koodta hai; meet pe "break".', 'Phase 2 me label badal jaata hai — slow head se, fast meeting point se, dono 1 step.', 'Example 2 (<code>[1,2]</code>, pos 0) me cycle head se — Phase 2 ka loop chalta hi nahi.'] },
            { viz: 142, ex: 0 },
          ],
        },
        {
          title: 'Part 9 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Input', 'Answer', 'Kyun'], rows: [
              ['No cycle', '<code>[1]</code>, pos −1', 'null', 'fast.next == null → return null'],
              ['Empty', '<code>[]</code>', 'null', 'fast == null'],
              ['Cycle head se', '<code>[1,2]</code>, pos 0', 'node 1', 'a = 0 → meeting point hi head; Phase 2 loop 0 baar'],
              ['Self-loop', '<code>[1]</code>, pos 0', 'node 1', 'Meet at 1 = head'],
              ['Lamba tail, chhota cycle', '<code>[1..8]</code>, pos 2', 'node 3', 'a = (k−1)L + c'],
            ] } },
          ],
        },
        {
          title: 'Part 10 — Complexity + Cycle length follow-up',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [['HashSet', 'O(n)', 'O(n)'], ['Floyd two-phase', 'O(n)', 'O(1)']] } },
            { p: '<b>Cycle length kaise nikalein (collision ke baad)?</b> Fast ko meeting point pe rok do, ek pointer ko aage chalao aur gino jab tak wapas meeting point na aaye.' },
            { code: `// meeting point = slow == fast ke baad
int length = 1;
ListNode p = slow.next;
while (p != slow) {
    p = p.next;
    length++;
}
// 1..8 (pos 2) example → length = 6` },
          ],
        },
        {
          title: 'Part 11 — Interview Deep Dive: 8 chhote sawaal (follow-ups)',
          blocks: [
            { qa: [
              ['Slow ko head pe reset kyun?', 'Math: a = (k−1)L + c. Head se a steps = meeting point se a steps — dono cycle start pe.'],
              ['Fast ko reset kyun nahi?', 'Kar sakte ho (fast head pe, slow meeting pe) — bas jo bhi head pe jaaye, Phase 2 me <b>dono 1 step</b> chalne chahiye. Convention: slow reset.'],
              ['Cycle head se shuru ho toh?', 'a = 0 → meeting point hi head hota hai → Phase 2 loop ek baar bhi nahi chalta → head return.'],
              ['Collision ke baad cycle length?', 'Ek pointer rok ke doosra ek chakkar ghumao, steps gino.'],
              ['Phase 2 me fast 2 step chalaya toh?', 'Galat — math 1-1 step pe based hai.'],
              ['Meeting point = cycle start hamesha?', 'Nahi; sirf jab c ≡ 0 (jaise a = 0).'],
              ['HashSet version me pehla repeat node hi start kyun?', 'Cycle me ghusne ke baad pehla dobara milne wala node entry hi hai.'],
              ['Complexity?', 'O(n) time, O(1) space.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Proof explain karo', 'Let a be the distance from head to the cycle start, b from the start to the meeting point, and c from the meeting point back to the start, so the cycle length is L = b + c. When they meet, slow has walked a + b and fast has walked 2(a + b). The difference must be whole loops, so a + b = kL, which gives a = (k − 1)L + c. So if I reset slow to head and keep fast at the meeting point, and move both one step at a time, after a steps slow is at the start, and fast has walked c steps plus whole loops, which is also the start. They meet exactly there.'],
              ['Algorithm summary', 'Phase one is ordinary Floyd: if fast reaches null I return null. Once slow equals fast, phase two resets slow to head and advances both by one until they are equal, and that node is the cycle start. O(n) time, O(1) space, and the list is not modified.'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohvi session (Learning tasks)',
          blocks: [
            { olist: [
              'Cycle start aur meeting point ka farak — 1..8 diagram pe dono mark karo.',
              '<code>a</code>, <code>b</code>, <code>c</code> distances draw karo.',
              'Second phase visualizer me dekho — "dono 1 step" pe dhyaan.',
              'Day 36 ka LC 141 verbally revise karo.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Sohel (Tum) session — LC 142 (Medium)',
          blocks: [
            { olist: [
              'Floyd ka two-phase algorithm implement + submit.',
              'Mathematical reasoning (Part 3) bina dekhe board pe likho.',
              'Cases: no cycle, cycle head se, self-loop.',
              'Explain karo: reset ke baad dono 1-1 step kyun chalte hain.',
              'Follow-ups: slow reset kyun? fast kyun nahi? head se cycle? cycle length?',
            ] },
          ],
        },
        {
          title: 'Part 15 — Homework',
          blocks: [
            { list: [
              '<b>Sohvi:</b> Ek cyclic list draw karo aur usme head, cycle start aur meeting point identify karo.',
              '<b>Tum:</b> Floyd proof ka mathematical explanation bina notes likho. LC 142 memory se implement karo.',
              'Kal (Day 38): Remove Nth Node From End — gap technique + dummy.',
            ] },
          ],
        },
        {
          title: 'Part 16 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['L kis ke barabar?', 'b + c.'],
              ['Final equation?', 'a = (k − 1)L + c.'],
              ['<code>[3,2,0,-4]</code>, pos 1 — meeting point aur start?', 'Meeting −4, start 2.'],
              ['Phase 2 me speed?', 'Dono 1 step.'],
              ['No cycle me return?', 'null.'],
            ] },
          ],
        },
      ],
      checks: [
        'Meeting point vs cycle start ka farak bata sakta/sakti hu',
        'a, b, c, L draw kiye',
        'a = (k − 1)L + c khud derive kiya',
        '[3,2,0,-4] ka Phase 1 + Phase 2 dry run',
        'Tum: LC 142 Accepted + 4 follow-ups',
        'Cycle length nikaalne ka tareeka',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Milo, phir slow ko ghar (head) bhejo; dono dheere chalo — cycle ke darwaze pe milenge.',
    },

    // =====================================================================
    // DAY 38
    10: {
      title: 'Remove Nth Node From End — Gap Technique + Dummy Node',
      goal: '<b>Pattern 3: Two Pointers + Gap.</b> End se n-th node ka matlab, two-pass vs one-pass, gap technique, dummy node ka purpose aur head deletion. <b>LC 19</b>.',
      main: 19,
      parts: [
        {
          title: 'Part 0 — Previous day revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('LC 142 two-phase (kal ka)', 'Module 1–2: problem + two-pass', 'Module 3: gap technique · Module 4: dummy', '<code>[1..5]</code>, n = 2 aur head delete <code>[1,2,3]</code>, n = 3', 'Tum: two-pass + one-pass · Sohvi: gap diagram', 'O(n) / O(1); invalid n'),
            ...rev({
              h: 'LC 142 — Linked List Cycle II (kal ka)',
              p: 'Cycle start node.',
              ex: '3 → 2 → 0 → -4 → (2)   → node 2',
              pat: 'Floyd two-phase',
              steps: ['Phase 1: slow/fast meet.', 'slow = head; fast meeting point pe.', 'Dono 1 step jab tak equal → return.'],
              code: ap(142, 1),
              hook: 'a = (k−1)L + c.',
            }),
            ...rev({
              h: 'LC 21 — Merge Two Sorted Lists (dummy yaad karo)',
              p: 'Dummy node se head ka special case khatam.',
              ex: '[1,2,4] + [1,3,4] → [1,1,2,3,4,4]',
              pat: 'Dummy + tail',
              steps: ['dummy, tail = dummy.', 'Chhota jodo.', 'return dummy.next.'],
              code: ap(21, 1),
              hook: 'Aaj bhi dummy — is baar delete ke liye.',
            }),
          ],
        },
        {
          title: 'Part 1 — Learning Objectives',
          blocks: [
            objectives(['Nth node from end ka meaning.', 'Two-pass vs one-pass approach.', 'Gap technique.', 'Dummy node ka purpose.', 'Head deletion edge case.', 'Pointer movement safely manage karna.']),
          ],
        },
        {
          title: 'Part 2 — Module 1: Problem Understanding',
          blocks: [
            { pre: `1 → 2 → 3 → 4 → 5,   n = 2   (end se 2nd = node 4)

Output: 1 → 2 → 3 → 5` },
            { p: '<b>Sawaal:</b> End se 2nd node pehchanne ke liye length pehle nikaalna zaroori hai? <b>Nahi</b> — two pointers se ek hi traversal me ho jaata hai.' },
          ],
        },
        { title: 'Part 3 — Aaj ka problem: LC 19 Remove Nth Node From End of List', blocks: [{ problem: 19 }] },
        {
          title: 'Part 4 — Module 2: Two-Pass Approach',
          blocks: [
            { list: ['<b>Pass 1:</b> length nikaalo (L).', '<b>Pass 2:</b> dummy se <code>L − n</code> steps chalo → target ka <b>pichla</b> node.', 'Target delete: <code>prev.next = prev.next.next</code>.'] },
            { p: '<code>[1..5]</code>, n = 2: L = 5, L − n = 3 steps dummy se → node 3 → 3.next = 5.' },
            { code: sol(19, 0) },
            { p: 'Complexity: Time O(n), Space O(1). Samajhna zaroori hai, par optimal one-pass nahi.' },
          ],
        },
        {
          title: 'Part 5 — Module 3: Gap Technique',
          blocks: [
            { olist: [
              'Fast pointer ko slow se aage le jao (fixed gap).',
              'Fast aur slow dono ek-ek step chalao.',
              'Jab fast end pe pahunchta hai, slow target ke <b>previous</b> node pe hota hai.',
              'Slow ka next skip kar do: <code>slow.next = slow.next.next</code>.',
            ] },
            { p: '<b>Kyun kaam karta hai?</b> Fast aur slow ke beech <b>fixed distance</b> rehti hai. Fast end pe → slow end se utni hi peeche → target se ek pehle.' },
            { tip: '<b>n vs n + 1:</b> Hum dono pointers <b>dummy</b> se shuru karte hain aur fast ko <b>n + 1</b> step aage le jaate hain. Tab jab fast <code>null</code> pe pahunchta hai, slow target ke pichle node pe hota hai. (Agar dono head se shuru karo aur fast ko n aage, toh fast <i>last node</i> pe rukna chahiye — same idea, alag stop condition.)' },
          ],
        },
        {
          title: 'Part 6 — Module 4: Dummy Node',
          blocks: [
            { pre: `1 → 2 → 3,  n = 3   → head (1) delete karna hai

Head ka previous node exist hi nahi karta!

dummy → 1 → 2 → 3      ← ab head ka previous = dummy
slow = dummy → dummy.next = 2 → return dummy.next = [2, 3]` },
            { p: 'Dummy se head deletion bhi normal deletion jaisa ho jaata hai — koi special <code>if</code> nahi.' },
          ],
        },
        {
          title: 'Part 7 — Dry Run (pointer tracking)',
          blocks: [
            { p: '<b>Example 1:</b> <code>[1,2,3,4,5]</code>, n = 2 (D = dummy)' },
            { table: { head: ['Step', 'fast', 'slow', 'Kya hua'], rows: [
              ['setup', 'D', 'D', '—'],
              ['for i = 0', '1', 'D', 'fast aage'],
              ['for i = 1', '2', 'D', 'fast aage'],
              ['for i = 2', '3', 'D', 'gap = n + 1 = 3'],
              ['while 1', '4', '1', 'dono aage'],
              ['while 2', '5', '2', 'dono aage'],
              ['while 3', 'null', '3', 'fast null → stop'],
              ['delete', '—', '3', '3.next = 5 → <b>[1,2,3,5]</b>'],
            ] } },
            { p: '<b>Example 2 (head deletion):</b> <code>[1,2,3]</code>, n = 3' },
            { table: { head: ['Step', 'fast', 'slow'], rows: [
              ['setup', 'D', 'D'],
              ['for (4 baar)', 'D→1→2→3→null', 'D'],
              ['while', 'fast already null → loop nahi', 'D'],
              ['delete', '—', 'D.next = 2 → <b>[2,3]</b>'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Module 5: Complete Algorithm + har line ka purpose',
          blocks: [
            { code: sol(19, 1) },
            { lines: [
              ['ListNode dummy = new ListNode(0, head);', 'Head se pehle nakli node — head delete bhi normal.'],
              ['ListNode fast = dummy, slow = dummy;', 'Dono dummy se.'],
              ['for (int i = 0; i <= n; i++)', '<b>n + 1</b> steps — gap n + 1.'],
              ['while (fast != null)', 'Fast null pe → slow target ke pichle node pe.'],
              ['slow.next = slow.next.next;', 'Target bypass.'],
              ['return dummy.next;', 'Naya head (head delete hua ho toh bhi sahi).'],
            ] },
            { p: '<b>Assumption:</b> n valid hai — <code>1 ≤ n ≤ list length</code>. Complexity: O(n) time, O(1) space.' },
          ],
        },
        {
          title: 'Part 9 — Visualize: gap dekho',
          blocks: [
            { list: ['"gap (fast − slow)" text dekho — pehle badhta hai, phir fix rehta hai.', 'Example 2 (<code>[1]</code>, n = 1) — dummy ki wajah se list khaali ho jaati hai, crash nahi.'] },
            { viz: 19, ex: 0 },
          ],
        },
        {
          title: 'Part 10 — Tum ke cases (edge cases)',
          blocks: [
            { table: { head: ['Case', 'Input', 'Output'], rows: [
              ['Normal', '<code>[1,2,3,4,5]</code>, n = 2', '<code>[1,2,3,5]</code>'],
              ['Head deletion (n = length)', '<code>[1,2,3,4,5]</code>, n = 5', '<code>[2,3,4,5]</code>'],
              ['Last node deletion', '<code>[1,2,3,4,5]</code>, n = 1', '<code>[1,2,3,4]</code>'],
              ['Single node', '<code>[1]</code>, n = 1', '<code>[]</code>'],
              ['Two nodes, head', '<code>[1,2]</code>, n = 2', '<code>[2]</code>'],
              ['Invalid n (&gt; length)', '<code>[1,2]</code>, n = 5', 'Code me NPE (for loop me fast null). Interview me: pehle length check ya loop me <code>fast == null</code> pe return head.'],
            ] } },
            { tip: 'Valid cases maine dono approaches (two-pass, one-pass) pe Java me chala ke check kiye.' },
          ],
        },
        {
          title: 'Part 11 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Dummy node kyun?', 'Head delete hone pe bhi ek previous node chahiye; dummy wo deta hai.'],
              ['Fast ko dummy se n + 1 baar kyun?', 'Taaki fast null pe ho tab slow target se <b>ek pehle</b> ho.'],
              ['Bina length jaane solve ho sakta hai?', 'Haan — gap technique, one pass.'],
              ['n invalid ho toh?', 'Constraint guarantee deta hai; warna loop me null check karke original head lautao.'],
              ['Two-pass ka complexity?', 'O(n) time, O(1) space — 2 passes.'],
              ['Delete karne ke liye slow kahan hona chahiye?', 'Target ke pichle node pe.'],
              ['<code>return head</code> kiya toh?', 'Head delete hua ho toh purana (deleted) head milega — galat. dummy.next lautao.'],
              ['Gap kab tak fix rehta hai?', 'Setup ke baad poore while loop me.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach (two-pass → one-pass)', 'The simple way is two passes: count the length L, then walk L − n steps from a dummy node to reach the node before the target and unlink it. To do it in one pass, I keep a fixed gap. Both pointers start at a dummy node before the head; I move fast n + 1 steps, then move both until fast is null. Slow is then right before the target, so I set slow.next = slow.next.next and return dummy.next. O(L) time, O(1) space.'],
              ['Why a dummy node here?', 'If n equals the length, the node to delete is the head, which has no previous node. The dummy gives every node, including the head, a predecessor, so deletion is always slow.next = slow.next.next and I simply return dummy.next.'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohvi session (Learning tasks)',
          blocks: [
            { olist: ['End se n-th node manually identify karo (5 examples).', 'Two-pass solution samjho (L − n).', 'Gap technique ka diagram banao.', 'Dummy node ka purpose apne shabdon me.', 'Head deletion ka example (<code>[1,2,3]</code>, n = 3) dry run.'] },
          ],
        },
        {
          title: 'Part 14 — Sohel (Tum) session — LC 19 (Medium)',
          blocks: [
            { olist: [
              'Two-pass approach implement.',
              'One-pass gap technique + dummy implement + submit.',
              'Cases: head deletion, last node deletion, single-node list, n = length.',
              'Follow-ups: dummy kyun; n + 1 kyun; length ke bina?; invalid n?',
            ] },
          ],
        },
        {
          title: 'Part 15 — Homework',
          blocks: [
            { list: ['<b>Sohvi:</b> 5 examples me n identify karo aur deleted node mark karo.', '<b>Tum:</b> Dummy node ki importance explain karo aur LC 19 bina hints implement karo.', 'Kal (Day 39): Reorder List — middle + reverse + merge.'] },
          ],
        },
        {
          title: 'Part 16 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[1,2,3,4,5]</code>, n = 1?', '<code>[1,2,3,4]</code>'],
              ['<code>[1]</code>, n = 1?', '<code>[]</code>'],
              ['Fast kitne steps aage (dummy se)?', 'n + 1.'],
              ['Delete line?', '<code>slow.next = slow.next.next;</code>'],
              ['Return?', '<code>dummy.next</code>'],
            ] },
          ],
        },
      ],
      checks: [
        'Nth from end ka matlab + 5 examples',
        'Two-pass (L − n) samjha',
        'Gap technique diagram banaya',
        'Head deletion dry run (dummy ke saath)',
        'Tum: LC 19 one-pass Accepted + saare cases',
        'n + 1 aur dummy ke follow-ups bol sakta/sakti hu',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Dummy se shuru, fast ko n+1 aage, saath chalo — fast null pe, slow target se pehle.',
    },

    // =====================================================================
    // DAY 39
    11: {
      title: 'Reorder List — Middle + Reverse + Merge (3 patterns combined)',
      goal: '<b>Pattern 4: Combination.</b> Pehle seekhe teen patterns jodna: <b>Fast &amp; Slow</b> (middle), <b>Reversal</b> (second half), <b>Merge</b> (alternate). Interview me aise combination problems bahut aate hain. <b>LC 143</b>.',
      main: 143,
      parts: [
        {
          title: 'Part 0 — Previous day revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('LC 19 gap + dummy (kal ka)', 'Module 1: output pattern samjho', 'Module 2–5: middle → split → reverse → merge', '<code>1→2→3→4→5</code> aur <code>1→2→3→4</code>', 'Tum: poora LC 143 bina hints · Sohvi: har subpattern alag', 'O(n) / O(1); cycle na bane'),
            ...rev({
              h: 'LC 19 — Remove Nth Node From End (kal ka)',
              p: 'End se n-th node hatao.',
              ex: '[1,2,3,4,5], n = 2 → [1,2,3,5]',
              pat: 'Gap + dummy',
              steps: ['fast = slow = dummy.', 'fast n + 1 aage.', 'Saath chalo; slow.next = slow.next.next.'],
              code: ap(19, 1),
              hook: 'Dummy se shuru, fast n+1 aage.',
            }),
            ...rev({
              h: 'LC 206 — Reverse Linked List (aaj Step 3 me lagega)',
              p: 'List ulti.',
              ex: '4 → 5 → null   →   5 → 4 → null',
              pat: 'Three pointers',
              steps: ['prev = null, current = head.', 'S-R-P-C.', 'return prev.'],
              code: ap(206, 1),
              hook: 'Save → Reverse → Prev → Current.',
            }),
          ],
        },
        {
          title: 'Part 1 — Learning Objectives',
          blocks: [
            { table: { head: ['#', 'Pattern', 'Kaam'], rows: [
              ['1', 'Fast &amp; Slow', 'Middle (first half ka end) dhoondhna'],
              ['2', 'Reversal', 'Second half ulta karna'],
              ['3', 'Merge', 'Alternate nodes jodna'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Module 1: Problem Understanding',
          blocks: [
            { pre: `Input:  1 → 2 → 3 → 4 → 5      Output: 1 → 5 → 2 → 4 → 3
Input:  1 → 2 → 3 → 4          Output: 1 → 4 → 2 → 3` },
            { list: ['First node first hi rehta hai.', 'Last node second aata hai.', 'Second node third.', 'Second-last fourth… (L0, Ln, L1, Ln−1, …)'] },
          ],
        },
        { title: 'Part 3 — Aaj ka problem: LC 143 Reorder List', blocks: [{ problem: 143 }] },
        {
          title: 'Part 4 — Thinking: Brute → Optimal (second half reverse kyun?)',
          blocks: [
            { p: '<b>Brute:</b> Saare nodes ek <code>ArrayList</code> me, phir do pointers (i aage se, j peeche se) se alternate jodo. O(n) time, <b>O(n) space</b>.' },
            { p: '<b>Problem:</b> Singly list me peeche nahi ja sakte. Humein end ke nodes <b>ulte order</b> me chahiye (Ln, Ln−1, …).' },
            { p: '<b>Insight:</b> Second half ko <b>reverse</b> kar do — ab woh Ln, Ln−1, … order me aage chalegi. Phir dono halves ka alternate merge. Sab in-place → <b>O(1) space</b>.' },
          ],
        },
        {
          title: 'Part 5 — Module 2–4: Find Middle → Split → Reverse',
          blocks: [
            { p: '<b>Step 1 — Middle (first half ka end):</b>' },
            { code: `ListNode slow = head, fast = head;
while (fast.next != null && fast.next.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
// slow = first half ka last node` },
            { table: { head: ['List', 'slow (yahan rukta hai)', 'First half', 'Second half'], rows: [
              ['1..5 (odd)', '3', '1 → 2 → 3', '4 → 5'],
              ['1..4 (even)', '2', '1 → 2', '3 → 4'],
            ] } },
            { tip: 'Ye condition (<code>fast.next</code>, <code>fast.next.next</code>) LC 876 se alag hai — even me <b>first middle</b> deti hai, taaki first half ≥ second half rahe.' },
            { p: '<b>Step 2 — Split:</b>' },
            { pre: `ListNode second = slow.next;
slow.next = null;          // ← mat bhoolna!

1 → 2 → 3 → null        4 → 5 → null` },
            { p: '<b>Step 3 — Reverse second half:</b> <code>4 → 5</code> → <code>5 → 4</code>' },
            { pre: `First:  1 → 2 → 3
Second: 5 → 4` },
          ],
        },
        {
          title: 'Part 6 — Module 5: Alternate Merge + dry run',
          blocks: [
            { olist: ['First list ka next save.', 'Second list ka next save.', 'First → second.', 'Second → saved first-next.', 'Dono pointers aage.'] },
            { table: { head: ['Iteration', 'first', 'second', 'firstNext', 'secondNext', 'Links', 'List ab'], rows: [
              ['1', '1', '5', '2', '4', '1 → 5, 5 → 2', '1 → 5 → 2 → 3'],
              ['2', '2', '4', '3', 'null', '2 → 4, 4 → 3', '1 → 5 → 2 → 4 → 3'],
              ['stop', '3', 'null', '—', '—', 'second null', '<b>1 → 5 → 2 → 4 → 3</b>'],
            ] } },
            { p: '<b>Even (1..4):</b> First 1 → 2, Second (reversed) 4 → 3 → merge: 1 → 4 → 2 → 3. Last iteration me 3.next = firstNext = null (split ki wajah se) — <b>cycle nahi banti</b>.' },
          ],
        },
        {
          title: 'Part 7 — Module 6: Complete Algorithm + har line ka purpose',
          blocks: [
            { p: '<b>Brute — ArrayList</b>' },
            { code: sol(143, 0) },
            { p: '<b>Optimal — middle + reverse + merge</b>' },
            { code: sol(143, 1) },
            { lines: [
              ['if (head == null || head.next == null) return;', '0 ya 1 node — kuch karna nahi.'],
              ['while (fast.next != null && fast.next.next != null)', 'slow first half ke end pe ruke.'],
              ['ListNode second = slow.next;', 'Second half ka start.'],
              ['slow.next = null;', 'Split — ye na kiya toh merge ke baad cycle.'],
              ['while (second != null) { ... }', 'Second half reverse (S-R-P-C); prev = naya head.'],
              ['ListNode first = head; second = prev;', 'Merge ke do starting points.'],
              ['ListNode n1 = first.next, n2 = second.next;', 'Dono ke next pehle save.'],
              ['first.next = second; second.next = n1;', 'Weave: first → second → purana first.next.'],
              ['first = n1; second = n2;', 'Aage badho; second khatam → done.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Visualize',
          blocks: [
            { list: ['Teeno phases alag dikhenge: middle, reverse, merge.', 'Example 2 (<code>[1,2,3,4,5]</code>) bhi chalao — odd length.'] },
            { viz: 143, ex: 0 },
          ],
        },
        {
          title: 'Part 9 — Tum ke cases (edge cases)',
          blocks: [
            { table: { head: ['Case', 'Input', 'Output'], rows: [
              ['Odd length', '<code>[1,2,3,4,5]</code>', '<code>[1,5,2,4,3]</code>'],
              ['Even length', '<code>[1,2,3,4]</code>', '<code>[1,4,2,3]</code>'],
              ['Two nodes', '<code>[1,2]</code>', '<code>[1,2]</code> (same)'],
              ['Three nodes', '<code>[1,2,3]</code>', '<code>[1,3,2]</code>'],
              ['Six nodes', '<code>[1..6]</code>', '<code>[1,6,2,5,3,4]</code>'],
              ['Single node', '<code>[1]</code>', '<code>[1]</code>'],
            ] } },
            { tip: '<b>Cycle check:</b> Maine har output ko Java me print karke dekha — list null pe khatam hoti hai (koi cycle nahi). <code>slow.next = null</code> hata ke chalao toh print kabhi khatam nahi hoga.' },
          ],
        },
        {
          title: 'Part 10 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Extra space'], rows: [['ArrayList', 'O(n)', 'O(n)'], ['Middle + Reverse + Merge', 'O(n)', 'O(1)']] } },
            { p: 'Teen passes (n/2 + n/2 + n/2) — sab O(n). Sirf kuch pointers.' },
          ],
        },
        {
          title: 'Part 11 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Second half reverse kyun?', 'End ke nodes ulte order me chahiye aur singly list peeche nahi jaati.'],
              ['Middle ke liye kaunsi condition?', '<code>fast.next != null &amp;&amp; fast.next.next != null</code> — slow first half ke end pe.'],
              ['<code>slow.next = null</code> bhool gaye toh?', 'First half second half se juda rahega → merge ke baad cycle.'],
              ['Merge me pehle kya save?', 'first.next aur second.next dono.'],
              ['Merge loop <code>second != null</code> pe kyun?', 'Second half ≤ first half; jab second khatam, bacha first node already sahi jagah.'],
              ['Values swap karke kar sakte hain?', 'Problem nodes badalne ko kehti hai; values badalna allowed nahi maana jaata.'],
              ['O(1) space kaise?', 'Sab in-place; ArrayList nahi.'],
              ['Teen patterns ka order?', 'Middle → (split) → reverse → merge.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach', 'The output alternates nodes from the front and from the back. A singly linked list cannot walk backwards, so I reverse the back half. First, I find the end of the first half with slow and fast pointers, using fast.next and fast.next.next so the first half is never shorter. Second, I cut the list there and reverse the second half. Third, I merge the two halves alternately, saving both next pointers before relinking. It is O(n) time and O(1) extra space.'],
              ['How do you make sure no cycle is created?', 'The key is cutting the list with slow.next = null before reversing. Then the first half ends in null, the reversed second half ends in null, and during the weave the last node always points to a saved next that is either a real node or null, so the final list terminates.'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohvi session (Learning tasks)',
          blocks: [
            { olist: ['Reorder ka expected output pehchano (5 aur 6 nodes).', 'Middle dhoondo (slow/fast).', 'Second half reverse karo (paper pe).', 'Alternate merge visualizer me observe karo.', 'Teen patterns ka connection explain karo.'] },
          ],
        },
        {
          title: 'Part 14 — Sohel (Tum) session — LC 143 (Medium)',
          blocks: [
            { olist: [
              'Full implementation <b>bina hints</b> + submit.',
              'Cases: odd, even, two-node, three-node.',
              'Verify karo ki accidentally cycle na bane (print loop se).',
              'Explain: second half reverse kyun.',
            ] },
          ],
        },
        {
          title: 'Part 15 — Homework',
          blocks: [
            { list: ['<b>Sohvi:</b> 5-node aur 6-node list ka reorder manually karo.', '<b>Tum:</b> Teen subpatterns alag-alag explain karo, phir complete solution memory se.', 'Kal (Day 40): Reverse Nodes in k-Group — is week ka sabse mushkil.'] },
          ],
        },
        {
          title: 'Part 16 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[1..6]</code> reorder?', '<code>[1,6,2,5,3,4]</code>'],
              ['<code>[1,2,3]</code> reorder?', '<code>[1,3,2]</code>'],
              ['Split ki line?', '<code>slow.next = null;</code>'],
              ['Complexity?', 'O(n) time, O(1) space.'],
              ['Teen patterns?', 'Fast &amp; slow, reversal, merge.'],
            ] },
          ],
        },
      ],
      checks: [
        'Output pattern (L0, Ln, L1, …) pehchan sakta/sakti hu',
        'Middle condition (first half ka end) samjha',
        'Split + reverse paper pe kiya',
        'Merge dry run table khud bhari',
        'Tum: LC 143 bina hints Accepted + 4 cases',
        'No-cycle check kiya',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Beech dhoondo, kaato, peeche wala ulta, phir ek-ek karke bunno.',
    },

    // =====================================================================
    // DAY 40
    12: {
      title: 'Reverse Nodes in k-Group (Hard) — Group Reversal + Pointer Management',
      goal: '<b>Pattern 5: Group Reversal.</b> Fixed-size groups pehchanna, k nodes hain ya nahi check karna, group reverse karna, groups ko jodna aur adhoore group ko waisa hi chhodna. <b>LC 25</b> — is week ka sabse mushkil; ek din me master karne ki expectation mat rakho.',
      main: 25,
      parts: [
        {
          title: 'Part 0 — Previous day revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('LC 143 (kal ka)', 'Module 1–3: problem, group detection, pointers', 'Module 4–5: group reversal + prev = groupNext', '<code>1..6</code>, k = 2 aur <code>1..5</code>, k = 3', 'Tum: LC 25 saare cases · Sohvi: manual k = 2, 3', 'O(n) / O(1)'),
            ...rev({
              h: 'LC 143 — Reorder List (kal ka)',
              p: 'L0, Ln, L1, Ln−1, …',
              ex: '[1,2,3,4,5] → [1,5,2,4,3]',
              pat: 'Middle + reverse + merge',
              steps: ['First half ka end (slow).', 'Split + second half reverse.', 'Alternate merge.'],
              code: ap(143, 1),
              hook: 'Beech dhoondo, kaato, ulta, bunno.',
            }),
            ...rev({
              h: 'LC 206 — Reverse Linked List (aaj har group me yahi)',
              p: 'List ulti.',
              ex: '1 → 2 → null   →   2 → 1 → null',
              pat: 'Three pointers',
              steps: ['prev = null, current = head.', 'S-R-P-C.', 'return prev.'],
              code: ap(206, 1),
              hook: 'Aaj prev null se nahi, groupNext se shuru hoga.',
            }),
          ],
        },
        {
          title: 'Part 1 — Learning Objectives',
          blocks: [
            objectives(['Fixed-size groups identify karna.', 'k nodes available hain ya nahi check karna.', 'Group reverse karna.', 'Previous group ko next group se connect karna.', 'Incomplete group ko unchanged rakhna.', 'Dummy node aur group boundaries manage karna.']),
          ],
        },
        {
          title: 'Part 2 — Module 1: Problem Understanding',
          blocks: [
            { pre: `1 → 2 → 3 → 4 → 5 → 6,  k = 2   →   2 → 1 → 4 → 3 → 6 → 5
1 → 2 → 3 → 4 → 5 → 6,  k = 3   →   3 → 2 → 1 → 6 → 5 → 4
1 → 2 → 3 → 4 → 5,      k = 3   →   3 → 2 → 1 → 4 → 5   (4, 5 adhoora group — waisa hi)` },
            { tip: '<b>Important rule:</b> Last group me k se kam nodes bache → unhe reverse <b>nahi</b> karna.' },
          ],
        },
        { title: 'Part 3 — Aaj ka problem: LC 25 Reverse Nodes in k-Group', blocks: [{ problem: 25 }] },
        {
          title: 'Part 4 — Module 2–3: Group Detection + Important Pointers',
          blocks: [
            { code: `ListNode kth = groupPrev;
for (int i = 0; i < k && kth != null; i++) {
    kth = kth.next;
}
// kth == null → bache nodes adhoora group → STOP` },
            { table: { head: ['Pointer', 'Responsibility'], rows: [
              ['<code>dummy</code>', 'Naya head maintain karna'],
              ['<code>groupPrev</code>', 'Pichle group ka end'],
              ['<code>kth</code>', 'Current group ka last node'],
              ['<code>groupNext</code>', 'Agle group ka pehla node'],
              ['<code>prev</code>', 'Reversal me previous node'],
              ['<code>curr</code>', 'Current node'],
              ['<code>next</code>', 'Next node save karna'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Module 4–5: Group Reversal Logic + Core concept',
          blocks: [
            { pre: `k = 2:   dummy → 1 → 2 → 3 → 4 → 5 → 6

Group 1 (1 → 2) reverse → 2 → 1, connect:
         dummy → 2 → 1 → 3 → 4 → 5 → 6
Group 2 (3 → 4) reverse → 4 → 3:
         dummy → 2 → 1 → 4 → 3 → 5 → 6
Group 3 (5 → 6) reverse → 6 → 5:
         dummy → 2 → 1 → 4 → 3 → 6 → 5` },
            { code: `ListNode prev = groupNext;          // ← null se nahi!
ListNode curr = groupPrev.next;
while (curr != groupNext) {
    ListNode next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
}` },
            { list: [
              '<code>prev</code> ko <code>groupNext</code> se initialize kiya — isse reversed group ka last node (purana first) <b>apne aap</b> agle group se jud jaata hai.',
              'Reversal ke baad <code>groupPrev.next = kth</code> (naya group head).',
              'Pichle group ka end ab purana first node hai → <code>groupPrev = oldGroupStart</code>.',
            ] },
          ],
        },
        {
          title: 'Part 6 — Dry Run 1: 1..6, k = 2 (har iteration)',
          blocks: [
            { table: { head: ['Iter', 'groupPrev', 'kth', 'groupNext', 'Reverse ke baad', 'groupPrev.next = kth', 'groupPrev →'], rows: [
              ['1', 'dummy', '2', '3', '2 → 1 → 3', 'dummy → 2', '1'],
              ['2', '1', '4', '5', '4 → 3 → 5', '1 → 4', '3'],
              ['3', '3', '6', 'null', '6 → 5 → null', '3 → 6', '5'],
              ['4', '5', 'null (1 step me)', '—', '—', 'break', '—'],
            ] } },
            { p: '<b>Iteration 1 ka andar ka reversal</b> (prev = groupNext = 3, curr = 1):' },
            { table: { head: ['Step', 'next', 'curr.next = prev', 'prev', 'curr'], rows: [
              ['1', '2', '1 → 3', '1', '2'],
              ['2', '3', '2 → 1', '2', '3 = groupNext → stop'],
            ] } },
            { p: 'Result: <b>2 → 1 → 4 → 3 → 6 → 5</b>.' },
          ],
        },
        {
          title: 'Part 7 — Dry Run 2: 1..5, k = 3 (adhoora group)',
          blocks: [
            { table: { head: ['Iter', 'groupPrev', 'kth', 'groupNext', 'Kya hua'], rows: [
              ['1', 'dummy', '3', '4', '3 → 2 → 1 → 4; dummy → 3; groupPrev = 1'],
              ['2', '1', '4 → 5 → null (3rd step null)', '—', 'kth == null → break; 4 → 5 waisa hi'],
            ] } },
            { p: 'Result: <b>3 → 2 → 1 → 4 → 5</b>.' },
          ],
        },
        {
          title: 'Part 8 — Module 6: Complete Algorithm + har line ka purpose',
          blocks: [
            { p: '<b>Brute — values list me, har k ka block reverse</b>' },
            { code: sol(25, 0) },
            { p: '<b>Optimal — iterative, O(1) space</b>' },
            { code: sol(25, 1) },
            { lines: [
              ['ListNode dummy = new ListNode(0, head);', 'Pehla group bhi normal — naya head dummy.next.'],
              ['ListNode groupPrev = dummy;', 'Pichle group ka end.'],
              ['for (int i = 0; i < k && kth != null; i++)', 'k steps — kth = group ka last node.'],
              ['if (kth == null) break;', 'Adhoora group → chhod do.'],
              ['ListNode groupNext = kth.next;', 'Agle group ka start save.'],
              ['ListNode prev = groupNext, cur = groupPrev.next;', 'prev groupNext se → reversed tail apne aap juda.'],
              ['while (cur != groupNext)', 'Sirf is group ke andar reverse.'],
              ['ListNode first = groupPrev.next;', 'Purana first = reversal ke baad group ka end.'],
              ['groupPrev.next = kth;', 'Pichla group naye head (kth) se juda.'],
              ['groupPrev = first;', 'Agle round ke liye pichle group ka end.'],
            ] },
            { p: '<b>Recursive (bonus)</b> — O(n/k) stack:' },
            { code: sol(25, 2) },
          ],
        },
        {
          title: 'Part 9 — Visualize: iterative aur recursive',
          blocks: [
            { viz: 25, ex: 0, variant: 0 },
            { viz: 25, ex: 1, variant: 1 },
          ],
        },
        {
          title: 'Part 10 — Tum ke 7 cases',
          blocks: [
            { table: { head: ['#', 'Case', 'Input', 'Output'], rows: [
              ['1', 'k = 2', '<code>[1..6]</code>', '<code>[2,1,4,3,6,5]</code>'],
              ['2', 'k = 3', '<code>[1..6]</code>', '<code>[3,2,1,6,5,4]</code>'],
              ['3', 'Length divisible by k', '<code>[1..6]</code>, k = 3', '<code>[3,2,1,6,5,4]</code>'],
              ['4', 'Not divisible', '<code>[1..5]</code>, k = 2', '<code>[2,1,4,3,5]</code>'],
              ['5', 'k = 1', '<code>[1..5]</code>', 'Same list'],
              ['6', 'k = length', '<code>[1,2,3]</code>, k = 3', '<code>[3,2,1]</code>'],
              ['7', 'Single node', '<code>[1]</code>, k = 1', '<code>[1]</code>'],
            ] } },
            { tip: 'Saare 7 cases maine teeno approaches (brute, iterative, recursive) pe Java me chala ke check kiye — same output.' },
          ],
        },
        {
          title: 'Part 11 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Extra space'], rows: [
              ['Brute (values)', 'O(n)', 'O(n) — aur values badalta hai'],
              ['Iterative', 'O(n)', 'O(1)'],
              ['Recursive', 'O(n)', 'O(n/k) call stack'],
            ] } },
            { p: 'Har node ~2 baar touch hota hai (kth dhoondhte waqt + reverse) → O(n).' },
          ],
        },
        {
          title: 'Part 12 — Interview Deep Dive: 8 chhote sawaal (follow-ups)',
          blocks: [
            { qa: [
              ['Reversal se pehle kth kyun check?', 'Adhoora group reverse nahi karna; pehle reverse karke pata chala toh wapas ulta karna padega.'],
              ['prev ko groupNext se kyun initialize?', 'Reversed group ka last node (purana first) seedha agle group se jud jaata hai — alag connect nahi karna.'],
              ['Pichla group kaise jodte hain?', '<code>groupPrev.next = kth</code>.'],
              ['Last adhoora group unchanged kyun rehta hai?', 'kth null mila → loop break → un nodes ko chhua hi nahi.'],
              ['O(1) extra space me ho sakta hai?', 'Haan — iterative version.'],
              ['groupPrev ko aage kahan le jaate hain?', 'Purane first node pe (ab group ka end).'],
              ['k = 1 pe kya hota hai?', 'Har group 1 node — reverse = same; list waisi hi.'],
              ['Dummy kyun?', 'Pehle group ka naya head bhi groupPrev.next ke through set ho; return dummy.next.'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach', 'I put a dummy node before the head and keep groupPrev, the node just before the current group. In each round I walk k steps from groupPrev to find the k-th node; if I reach null, fewer than k nodes remain, so I stop and leave them as they are. Otherwise I save groupNext and reverse the group using prev, curr and next, but I start prev at groupNext so the reversed group is already linked to the rest. Then I set groupPrev.next to the k-th node, which is the new group head, and move groupPrev to the old first node, which is now the group tail. O(n) time, O(1) extra space.'],
              ['Why check before reversing?', 'If I reversed first and then discovered the group was short, I would have to reverse it back. Counting k nodes first costs at most k extra steps per group, so the total is still O(n), and the incomplete tail is never touched.'],
            ] },
          ],
        },
        {
          title: 'Part 14 — Sohvi session (coding mandatory nahi)',
          blocks: [
            { olist: ['Group size k kya hota hai — 1..6 pe k = 2 aur k = 3 ke groups circle karo.', 'Complete vs incomplete group (1..5, k = 3).', 'Reversal ke baad connection kaise hota hai (Part 5 diagram).', 'Dummy node ka purpose.'] },
          ],
        },
        {
          title: 'Part 15 — Sohel (Tum) session — LC 25 (Hard)',
          blocks: [
            { olist: [
              'Iterative solution implement + submit.',
              'Part 10 ke saare 7 cases chalao.',
              'Follow-ups bolo: kth pehle kyun; prev = groupNext kyun; pichla group kaise juda; adhoora group kyun waisa; O(1) space?',
            ] },
          ],
        },
        {
          title: 'Part 16 — Homework',
          blocks: [
            { list: [
              '<b>Sohvi:</b> k = 2 aur k = 3 ke examples manually reverse karo.',
              '<b>Tum:</b> Kam se kam <b>3 complete dry runs</b> — har iteration me <code>groupPrev</code>, <code>kth</code>, <code>groupNext</code>, <code>prev</code>, <code>curr</code>, <code>next</code> ki position draw karo. (Suggest: 1..6 k=2, 1..5 k=3, 1..7 k=3.)',
              'Kal (Day 41, Saturday): Advanced Linked List revision.',
            ] },
          ],
        },
        {
          title: 'Part 17 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[1..7]</code>, k = 3?', '<code>[3,2,1,6,5,4,7]</code>'],
              ['<code>[1..4]</code>, k = 4?', '<code>[4,3,2,1]</code>'],
              ['Reverse me prev kis se shuru?', 'groupNext.'],
              ['Group jodne ki 2 lines?', '<code>groupPrev.next = kth; groupPrev = first;</code>'],
              ['Extra space (iterative)?', 'O(1).'],
            ] },
          ],
        },
      ],
      checks: [
        'Complete vs incomplete group pehchan sakta/sakti hu',
        '7 pointers ka role (table) bata sakta/sakti hu',
        'prev = groupNext ka reason samjha',
        'Dry run 1 (k = 2) aur Dry run 2 (k = 3) khud kiye',
        'Tum: LC 25 iterative Accepted + 7 cases',
        'Tum: 3 complete dry runs (homework)',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Pehle gino (kth), phir ulta karo (prev = groupNext se), phir jodo (groupPrev.next = kth), aage badho (groupPrev = purana first).',
    },

    // =====================================================================
    // DAY 41 (Saturday)
    13: {
      title: 'Advanced Linked List Revision — Pattern Recognition',
      goal: 'Aaj <b>naye concepts nahi</b>. Pichle 5 din ke patterns recall + implement: LC 141, 142, 19, 143, 25.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan',
          blocks: [
            { p: RULE },
            session('Week 6 ki memory lines', 'Module 1: master pattern table', 'Module 2: pointer recognition test', 'Module 3: 5 mandatory dry runs', 'Module 4: coding revision (timer)', 'Module 5: complexity revision + homework'),
          ],
        },
        {
          title: 'Part 1 — Module 1: Master Pattern Revision',
          blocks: [
            { table: { head: ['Problem', 'Pattern', 'Core Idea'], rows: [
              ['LC 141', 'Fast &amp; Slow', 'Detect collision'],
              ['LC 142', 'Floyd two-phase', 'Find cycle start'],
              ['LC 19', 'Gap Technique + Dummy', 'Nth from end'],
              ['LC 143', 'Middle + Reverse + Merge', 'Reorder'],
              ['LC 25', 'Group Reversal', 'Reverse k nodes'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Module 2: Pointer Recognition Test',
          blocks: [
            { qa: [
              ['Q1: Linked List me loop hai ya nahi?', 'Fast &amp; Slow.'],
              ['Q2: Loop kahan start hota hai?', 'Floyd ke two phases.'],
              ['Q3: End se nth node delete karna hai?', 'Gap technique + Dummy node.'],
              ['Q4: First aur last node alternate arrange karne hain?', 'Middle + Reverse + Merge.'],
              ['Q5: Har k nodes ka group reverse karna hai?', 'Group detection + Group reversal.'],
            ] },
          ],
        },
        {
          title: 'Part 3 — Module 3: 5 Mandatory Dry Runs (answers check karo)',
          blocks: [
            { p: 'Har dry run me likho: input, initial pointers, har iteration, pointer updates, final output. Phir neeche se milao.' },
            { pre: `1) Cycle detection — 1→2→3→4→5, 5.next = 3
   (slow,fast): (1,1) (2,3) (3,5) (4,4) → collision at 4 → true

2) Cycle start — 3→2→0→-4, -4.next = 2
   Phase 1: (2,0) (0,2) (-4,-4) meet at -4
   Phase 2: slow=3, fast=-4 → (2,2) → start = 2

3) Remove head (LC 19) — [1,2,3], n = 3
   fast: D→1→2→3→null (n+1 = 4 steps), slow = D → D.next = 2 → [2,3]

4) Reorder — odd [1..5]: slow=3, second 4→5 → 5→4 → 1,5,2,4,3
             even [1..4]: slow=2, second 3→4 → 4→3 → 1,4,2,3

5) k-group, incomplete last — [1..5], k = 3
   iter 1: gp=D, kth=3, gn=4 → 3→2→1→4, gp=1
   iter 2: kth null → break → [3,2,1,4,5]` },
          ],
        },
        {
          title: 'Part 4 — Quick code recall (bina dekhe likho, phir milao)',
          blocks: [
            { p: '<b>LC 141</b>' },
            { code: ap(141, 1) },
            { p: '<b>LC 142</b>' },
            { code: ap(142, 1) },
            { p: '<b>LC 19</b>' },
            { code: ap(19, 1) },
            { p: '<b>LC 143</b>' },
            { code: ap(143, 1) },
            { p: '<b>LC 25</b>' },
            { code: ap(25, 1) },
          ],
        },
        {
          title: 'Part 5 — Module 4: Coding Revision — time targets',
          blocks: [
            { table: { head: ['Problem', 'Target'], rows: [['LC 141', '10 min'], ['LC 142', '15 min'], ['LC 19', '15 min'], ['LC 143', '20 min'], ['LC 25', '30 min']] } },
            { tip: 'Ye practice targets hain, strict interview cutoffs nahi.' },
          ],
        },
        {
          title: 'Part 6 — Module 5: Complexity Revision',
          blocks: [
            { table: { head: ['Problem', 'Time', 'Space'], rows: [
              ['LC 141 Floyd', 'O(n)', 'O(1)'],
              ['LC 142 Floyd', 'O(n)', 'O(1)'],
              ['LC 19', 'O(n)', 'O(1)'],
              ['LC 143', 'O(n)', 'O(1)'],
              ['LC 25', 'O(n)', 'O(1)'],
            ] } },
          ],
        },
        {
          title: 'Part 7 — Interview mix',
          blocks: [
            { qa: [
              ['Floyd me values compare kiye toh?', 'Duplicate values pe galat true; references compare karo.'],
              ['LC 142 me Phase 2 ki speed?', 'Dono 1 step.'],
              ['LC 19 me dummy nahi toh crash kab?', 'n = length (head delete).'],
              ['LC 143 me cycle kab banti hai?', 'slow.next = null bhoolne pe.'],
              ['LC 25 me prev kis se shuru?', 'groupNext.'],
              ['LC 25 adhoora group?', 'kth null → break, unchanged.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — 1-minute answers: aise bolo',
          blocks: [
            { say: [
              ['Cycle + start', 'Floyd: slow one step, fast two; if fast hits null there is no cycle, otherwise they meet because the gap shrinks by one each step. To find the start I reset slow to head and move both one step; since a = (k − 1)L + c, they meet at the start. O(n) time, O(1) space.'],
              ['Nth from end', 'Dummy before head, fast moves n + 1 steps, then both move until fast is null; slow is right before the target, so I unlink it and return dummy.next. One pass, O(1) space.'],
              ['Reorder + k-group', 'Reorder is middle, cut, reverse the second half, then weave. K-group is: find the k-th node, stop if it is null, reverse the group with prev starting at groupNext, then link groupPrev to the k-th node and move groupPrev to the old first node. Both are O(n) time and O(1) space.'],
            ] },
          ],
        },
        {
          title: 'Part 9 — Sohvi session (Coding revision)',
          blocks: [
            { olist: ['LC 141 concept explain.', 'LC 19 dry run (head deletion wala bhi).', 'LC 143 visualize (visualizer se).', 'Week 5 se LC 206 aur LC 876 revise.', 'Week 5 se LC 21 merge revise.'] },
          ],
        },
        {
          title: 'Part 10 — Sohel (Tum) session — bina notes implement',
          blocks: [
            { olist: ['LC 141 (10 min)', 'LC 142 (15 min)', 'LC 19 (15 min)', 'LC 143 (20 min)', 'LC 25 (30 min)', 'Jis problem me hint laga — usko <b>weak topic</b> mark karo.'] },
          ],
        },
        {
          title: 'Part 11 — Homework',
          blocks: [
            { list: [
              '<b>Sohvi:</b> Linked List ke 5 major patterns ki one-page cheat sheet.',
              '<b>Tum:</b> Har problem ka solution blank editor me implement karo. Hint lage → weak topic.',
              'Kal (Day 42, Sunday): Mock interview — Week 6 assessment.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['5 patterns ke naam?', 'Fast &amp; slow, Floyd two-phase, gap + dummy, middle + reverse + merge, group reversal.'],
              ['<code>[1..7]</code>, k = 3?', '<code>[3,2,1,6,5,4,7]</code>'],
              ['<code>[1,2,3,4,5]</code>, n = 5 (LC 19)?', '<code>[2,3,4,5]</code>'],
              ['<code>[1..6]</code> reorder?', '<code>[1,6,2,5,3,4]</code>'],
              ['Self-loop <code>[1]</code> pe LC 142?', 'Node 1.'],
            ] },
          ],
        },
      ],
      checks: [
        'Master pattern table bina dekhe',
        'Pointer recognition test ke 5 jawab',
        '5 mandatory dry runs kiye',
        'Sohvi: 141 concept, 19 dry run, 143 visualize, Week 5 revise',
        'Tum: 5 problems bina notes (time targets)',
        'Weak topics mark kiye',
        'Cheat sheet / blank editor homework',
      ],
      memory: 'Loop? fast/slow. Loop ka darwaza? slow ghar bhejo. End se n? dummy + gap. Aage-peeche? beech-ulta-bunno. k ke group? gino-ulta-jodo.',
    },

    // =====================================================================
    // DAY 42 (Sunday)
    14: {
      title: 'Linked List Mock Interview — Week 6 Assessment',
      goal: 'Test: kya tum Linked List ke concepts interview me <b>independently solve aur explain</b> kar sakte ho? <b>Sohvi — 30 min</b> conceptual mock, <b>Tum — 45–60 min</b> SDE-2 mock (random order). Phir LeetCode Weekly Contest discussion.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Mock format',
          blocks: [
            { table: { head: ['Kaun', 'Time', 'Kya', 'Interviewer'], rows: [
              ['Sohvi', '30 min', 'Linked List basics → merge (6 × 5 min)', 'Tum'],
              ['Tum', '45–60 min', 'LC 141, 142, 19, 143, 25 — random order', 'Sohvi'],
              ['Dono', '30 min', 'Contest discussion', 'Sunday 8:00 AM IST LeetCode Weekly Contest'],
            ] } },
          ],
        },
        {
          title: 'Part 1 — Module 1: Sohvi Mock (30 minutes)',
          blocks: [
            { table: { head: ['Time', 'Task'], rows: [
              ['5 min', 'Linked List basics'],
              ['5 min', 'Traversal and pointers'],
              ['5 min', 'Reverse Linked List'],
              ['5 min', 'Middle of Linked List'],
              ['5 min', 'Cycle detection'],
              ['5 min', 'Merge two sorted lists'],
            ] } },
            { p: '<b>Questions</b> (Sohvi pehle bole, phir answer kholo):' },
            { qa: [
              ['1. Linked List kya hoti hai?', 'Nodes ki chain — har node me data + next ka reference; head pehla node, last ka next null.'],
              ['2. Array vs Linked List?', 'Array: index O(1), beech me insert O(n). LL: access O(n), known node ke baad insert/delete O(1), extra pointer memory.'],
              ['3. Head aur next kya hai?', 'Head = pehle node ka reference; next = agle node ka reference.'],
              ['4. Reverse kaise karte hain?', 'prev/current/next — save, reverse, prev aage, current aage; return prev.'],
              ['5. Fast and slow pointer kaise kaam karte hain?', 'Slow 1, fast 2 step. Middle: fast end pe → slow beech. Cycle: dono milte hain.'],
              ['6. Dummy node kyun?', 'Head ka special case hatane ke liye; return dummy.next.'],
            ] },
            { tip: 'Sohvi ke liye coding ke saath <b>conceptual explanation</b> bhi evaluate karo.' },
          ],
        },
        {
          title: 'Part 2 — Module 2: Tumhara SDE-2 Mock (45–60 minutes)',
          blocks: [
            { table: { head: ['Question', 'LeetCode', 'Difficulty'], rows: [
              ['Linked List Cycle', '141', 'Easy'],
              ['Linked List Cycle II', '142', 'Medium'],
              ['Remove Nth Node From End', '19', 'Medium'],
              ['Reorder List', '143', 'Medium'],
              ['Reverse Nodes in k-Group', '25', 'Hard'],
            ] } },
            { p: 'Sohvi random order me 2–3 select kare. Har problem me interviewer ko ye 10 cheezein explain karna <b>mandatory</b>:' },
            { olist: ['Problem clarification.', 'Brute-force approach.', 'Optimal pattern.', 'Pointer initialization.', 'Dry run.', 'Edge cases.', 'Time complexity.', 'Space complexity.', 'Code implementation.', 'Solution sahi kyun hai (correctness).'] },
            { problem: 143 },
            { problem: 25 },
          ],
        },
        {
          title: 'Part 3 — Module 3: Interview Follow-up Questions (bina notes)',
          blocks: [
            { qa: [
              ['Linked List access O(n) kyun?', 'Nodes continuous nahi; head se next follow karna padta hai.'],
              ['Floyd collision guarantee kyun?', 'Cycle me relative speed 1 → gap har step 1 ghatta → 0 pe pahunchta hai.'],
              ['Cycle start kaise?', 'Meet ke baad slow = head, dono 1 step; a = (k−1)L + c.'],
              ['Dummy nodes kyun?', 'Head ka special case khatam — insert/delete sab ek jaisa.'],
              ['Gap technique kaise kaam karti hai?', 'Fixed gap n + 1 (dummy se); fast null pe → slow target se pehle.'],
              ['In-place reverse kaise?', 'prev/current/next — O(1) space.'],
              ['Do sorted lists kaise merge?', 'Dummy + tail, chhota jodo, bacha attach — O(n + m).'],
              ['Reorder O(1) extra space me?', 'Middle → split → second half reverse → alternate merge.'],
              ['Har k nodes reverse kaise?', 'kth dhoondo, prev = groupNext se reverse, groupPrev.next = kth, groupPrev = purana first.'],
              ['Bacha group k se chhota ho toh?', 'kth null → break → waisa hi rehta hai.'],
            ] },
          ],
        },
        {
          title: 'Part 4 — Module 4: Performance Evaluation (Scorecard)',
          blocks: [
            { table: { head: ['Evaluation Area', 'Marks', 'Mila'], rows: [
              ['Pattern recognition', '20', ''],
              ['Pointer understanding', '20', ''],
              ['Correct algorithm', '20', ''],
              ['Code implementation', '20', ''],
              ['Complexity + edge cases', '10', ''],
              ['Communication', '10', ''],
              ['<b>Total</b>', '<b>100</b>', ''],
            ] } },
            { table: { head: ['Score', 'Interpretation'], rows: [
              ['90–100', 'Is week ke material pe strong command.'],
              ['75–89', 'Zyaadatar patterns pe interview-ready; weak areas revise karo.'],
              ['60–74', 'Partial understanding; aur independent coding chahiye.'],
              ['60 se kam', 'Weak days repeat karo, phir aage badho.'],
            ] } },
            { tip: 'Ye internal practice benchmarks hain, industry hiring standards nahi.' },
          ],
        },
        {
          title: 'Part 5 — Week 6 Final Learning Checklist',
          blocks: [
            { table: { head: ['#', 'Item', 'Kaun'], rows: [
              ['1', 'Cycle Detection — LC 141', 'Dono'],
              ['2', 'Cycle Start — LC 142', 'Tum coding; Sohvi visualization'],
              ['3', 'Remove Nth Node — LC 19', 'Tum coding; Sohvi dry run'],
              ['4', 'Reorder List — LC 143', 'Tum coding; Sohvi subpatterns'],
              ['5', 'Reverse K Group — LC 25', 'Tum coding; Sohvi visualization'],
              ['6', 'Fast &amp; Slow Pointers', 'Dono'],
              ['7', 'Gap Technique', 'Dono'],
              ['8', 'Dummy Node Pattern', 'Dono'],
              ['9', 'Group Reversal', 'Tum'],
              ['10', 'Mock Interview', 'Dono'],
            ] } },
            { p: 'Neeche "Self-check" me yahi 10 items checkbox ke roop me hain — tick karte jao (0/10 → 10/10).' },
          ],
        },
        {
          title: 'Part 6 — LeetCode Weekly Contest plan + discussion template',
          blocks: [
            { list: ['Sunday 8:00 AM IST — dono join karo (90 min). Target: Q1 + Q2.', 'Contest ke baad: har solved question ka pattern naam do.', 'Jo nahi hua: editorial padho, kal 20 min upsolve.'] },
            { table: { head: ['Question', 'Pattern', 'Time liya', 'Galti', 'Seekh'], rows: [['Q1', '', '', '', ''], ['Q2', '', '', '', ''], ['Q3', '', '', '', '']] } },
          ],
        },
        {
          title: 'Part 7 — Aise bolo',
          blocks: [
            { say: [
              ['Mock opening (LC 25)', 'Let me restate: I reverse the nodes of the list k at a time, and if the last group has fewer than k nodes I leave it as it is. I should change links, not values. Can k be larger than the list length? Then nothing changes. Let me draw one example with k = 2 and one with an incomplete last group.'],
              ['Mock closing', 'To summarize, each node is visited a constant number of times, so it is O(n) time, and I only use a few pointers, so O(1) extra space. I tested k = 1, k equal to the length, a single node, and a length that is not divisible by k. A recursive version is shorter but uses O(n / k) stack space.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohvi session',
          blocks: [
            { olist: ['30 min mock — har sawaal pe bolke socho.', 'Interviewer ban ke Tum se 2–3 random questions poocho; scorecard bharo.', 'Contest Q1 try karo (30 min).'] },
          ],
        },
        {
          title: 'Part 9 — Sohel (Tum) session (SDE-2)',
          blocks: [
            { olist: ['45–60 min mock — har question me 10-point explanation.', 'Scorecard ke hisaab se weak area pehchano.', 'Contest Q1–Q3 attempt; Q3 upsolve kal.'] },
          ],
        },
        {
          title: 'Part 10 — Week 6 ke baad expected outcome + recommendation',
          blocks: [
            { table: { head: ['Sohvi', 'Tum'], rows: [
              ['LL ke basic + intermediate patterns samjhegi', 'LL ke major interview patterns identify kar paoge'],
              ['Fast/slow, reversal, dummy, merge visualize kar payegi', 'Floyd ka mathematical reasoning explain kar paoge'],
              ['Basic problems independently attempt kar payegi', 'Gap technique + dummy confidently implement'],
              ['—', 'Multiple patterns combine karke reorder solve'],
              ['—', 'K-group reversal O(n) time, O(1) space'],
            ] } },
            { tip: '<b>Recommendation:</b> Stack + Queue pe jaane se pehle <b>LC 25 aur LC 143</b> independently solve karo. Ye dono pointer manipulation ki asli strength test karte hain. Hints lage toh Linked List revision repeat karo.' },
          ],
        },
        {
          title: 'Part 11 — Homework + self-test',
          blocks: [
            { list: ['Scorecard me jo area sabse kam — kal 30 min usi pe.', 'LC 25 aur LC 143 blank editor me dobara (bina hints).', 'Next: Week 7 — Stack + Queue.'] },
            { qa: [
              ['Mock me sabse pehla kaam?', 'Clarification — input, output, edge cases.'],
              ['Scorecard me sabse zyada marks kis par?', 'Pattern, pointer understanding, algorithm, code — 20-20.'],
              ['75–89 ka matlab?', 'Mostly interview-ready; weak areas revise.'],
              ['Stack + Queue se pehle kaunse 2 problems?', 'LC 25 aur LC 143.'],
              ['Mock me 10 cheezon me last kya?', 'Solution sahi kyun hai (correctness).'],
            ] },
          ],
        },
      ],
      checks: [
        'Cycle Detection — LC 141 (Dono)',
        'Cycle Start — LC 142 (Tum coding; Sohvi visualization)',
        'Remove Nth Node — LC 19 (Tum coding; Sohvi dry run)',
        'Reorder List — LC 143 (Tum coding; Sohvi subpatterns)',
        'Reverse K Group — LC 25 (Tum coding; Sohvi visualization)',
        'Fast & Slow Pointers (Dono)',
        'Gap Technique (Dono)',
        'Dummy Node Pattern (Dono)',
        'Group Reversal (Tum)',
        'Mock Interview (Dono)',
      ],
      memory: 'Interview me: clarify → brute → pattern → pointers → dry run → edge → complexity → code → correctness.',
    },
  });
})();
