// Phase 5 (Stack + Queue) — Week 8 lessons (local days 8–14 = global days 50–56). Day 1 (phase-01) wala format.
// Week 8 = MONOTONIC STACK (Sohel ka diya hua syllabus: syllabus/week-08.md, 2026-11-23).
// Daily session 9:00–10:30 PM: pattern recall · theory · pattern + visualization · dry run · coding · complexity + Pattern Journal.
(function () {
  const P = window.PHASE_CONTENT['stack-queue'];
  P.lessons = P.lessons || {};
  const ap = (n, i) => P.questions[n].approaches[i].code;
  const rev = o => [
    { h: o.h },
    { p: o.p },
    { pre: o.ex },
    { p: '<b>Pattern:</b> ' + o.pat },
    { olist: o.steps },
    { code: o.code },
    { tip: '<b>Memory hook:</b> ' + o.hook },
  ];
  const session = (rev0, theory, viz, dry, coding, wrap) => ({ table: { head: ['Time', 'Slot', 'Aaj kya'], rows: [
    ['9:00–9:10', 'Previous pattern recall', rev0],
    ['9:10–9:30', 'Theory + modules', theory],
    ['9:30–9:50', 'Pattern + visualization', viz],
    ['9:50–10:10', 'Dry run', dry],
    ['10:10–10:25', 'Coding', coding],
    ['10:25–10:30', 'Complexity + Pattern Journal', wrap],
  ] } });
  const RULE = 'Week 8 rule: ye week mainly <b>Tum</b> ki SDE-2 prep hai (monotonic stack interview me bahut aata hai). <b>Sohvi</b> — pattern recognition aur dry run; Hard problem force nahi. Speed nahi, <b>pattern samajhna</b> goal hai.';
  const SQL = '<b>Extra (SDE-2): 2 SQL questions</b> — LeetCode Database section se 2 questions (JOIN / GROUP BY / window functions), 20 minute timer.';
  const JOURNAL = { table: { head: ['Problem', 'Pattern', 'Recognition clue', 'Mistake', 'Re-solve'], rows: [
    ['LC 206', 'Pointer reversal', 'Reverse links', 'next save karna bhool gaya', '+3 days'],
    ['LC 141', 'Fast &amp; slow', 'Cycle detection', 'Loop condition', '+7 days'],
    ['LC 496', 'Monotonic stack', 'Next greater', 'Galat pop condition', '+3 days'],
    ['LC 739', 'Monotonic stack', 'Waiting days', 'Indices ki jagah values store', '+7 days'],
    ['LC 84', 'Monotonic stack', 'Histogram boundaries', 'Width formula', '+7 days'],
    ['LC 155', 'Auxiliary stack', 'O(1) minimum', 'Duplicate minimum', '+3 days'],
  ] } };
  const JOURNAL_TEMPLATE = `PATTERN JOURNAL — ek entry
---------------------------------------------
Problem          :            LC number :         Date :
Difficulty       :            Pattern   :
Recognition clues:
Brute force      :
Optimal approach :
Why it works     :
Dry run          :
Time / Space     :
Mistakes made    :
What I failed to recognize :
Edge cases       :
Re-solve dates   : +1 day   +3 days   +7 days   +14 days
Solved without notes?  Yes / No`;

  // ---- Syllabus ke templates (compile + run tested) ----
  const J_MONO_PUSH = `// Increasing stack (bottom -> top increasing): push se pehle BADE pop
void pushIncreasing(Deque<Integer> stack, int x) {
    while (!stack.isEmpty() && stack.peek() > x) {
        stack.pop();
    }
    stack.push(x);
}

// Decreasing stack (bottom -> top decreasing): push se pehle CHHOTE pop
void pushDecreasing(Deque<Integer> stack, int x) {
    while (!stack.isEmpty() && stack.peek() < x) {
        stack.pop();
    }
    stack.push(x);
}`;
  const J_NGE_BRUTE = `public int[] nextGreaterBrute(int[] arr) {
    int n = arr.length;
    int[] result = new int[n];
    for (int i = 0; i < n; i++) {
        result[i] = -1;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] > arr[i]) {
                result[i] = arr[j];
                break;
            }
        }
    }
    return result;
}`;
  const J_NGE = `public int[] nextGreater(int[] arr) {
    int n = arr.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>(); // un-resolved indices
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && arr[i] > arr[stack.peek()]) {
            result[stack.pop()] = arr[i];
        }
        stack.push(i);
    }
    return result;
}`;
  const J_PSE = `public int[] previousSmaller(int[] arr) {
    int n = arr.length;
    int[] pse = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // indices, increasing values
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) stack.pop();
        pse[i] = stack.isEmpty() ? -1 : stack.peek();
        stack.push(i);
    }
    return pse;
}`;

  Object.assign(P.lessons, {
    // =====================================================================
    // DAY 50
    8: {
      title: 'Monotonic Stack Introduction — Increasing vs Decreasing',
      goal: 'Normal stack vs <b>monotonic stack</b>, increasing vs decreasing, order kyun maintain karte hain, <b>pop kyun</b>, NGE / PSE kya hai, values vs indices. <b>Sohvi:</b> concept + classification (koi mandatory LC nahi). <b>Tum:</b> <b>LC 496</b> — brute, monotonic approach, dry run, implement (pattern seekhna, speed nahi).',
      main: 496,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision (Week 7) + Aaj ka session',
          blocks: [
            { p: RULE },
            session('Week 7 ke 3 sawaal (neeche)', 'Module 1–4: normal vs monotonic, increasing, decreasing, kyun', 'Pattern table + LC 496 visualizer', 'Decreasing stack 4, 3, 2, 1 → 5', 'Sohvi: 5 examples classify · Tum: LC 496', 'O(n) proof + Pattern Journal'),
            ...rev({
              h: 'LC 155 — Min Stack',
              p: 'push / pop / top / getMin sab O(1).',
              ex: 'push 3, 8, 2, 5 → minStack (top first) 2, 3 → pop, pop → minStack 3 → getMin 3',
              pat: 'Design — Auxiliary Stack',
              steps: ['stack.push(val); val ≤ min top (ya khaali) → minStack.push.', 'pop: removed == minStack.peek() → minStack.pop.', 'getMin = minStack.peek().'],
              code: ap(155, 2),
              hook: '≤ pe push, barabar pe pop.',
            }),
            ...rev({
              h: 'LC 225 — Implement Stack using Queues',
              p: 'Queue se LIFO.',
              ex: '[1, 2] → push 3 → [1, 2, 3] → rotate 2 → [3, 1, 2]',
              pat: 'Design — Queue rotation',
              steps: ['offer(x).', 'size − 1 baar poll → offer.', 'pop = poll, top = peek.'],
              code: ap(225, 2),
              hook: 'Offer karo, size − 1 baar ghumao.',
            }),
            ...rev({
              h: 'LC 622 — Design Circular Queue',
              p: 'Fixed size ring buffer.',
              ex: 'k = 3, front 1, count 2 → enQueue → index (1 + 2) % 3 = 0',
              pat: 'Design — Circular Array (front + count)',
              steps: ['rear = (front + count) % k.', 'deQueue: front = (front + 1) % k.', 'count se empty/full.'],
              code: ap(622, 1),
              hook: 'Shift mat karo — front ko ghumao.',
            }),
          ],
        },
        {
          title: 'Part 1 — Module 1: Normal stack vs Monotonic stack',
          blocks: [
            { pre: `Normal stack: push 5, 2, 8, 1

  TOP → 1
        8
        2
        5          ← koi order nahi

Monotonic stack = aisa stack jo hamesha ek ORDER maintain kare
(bottom → top increasing  YA  decreasing).` },
          ],
        },
        {
          title: 'Part 2 — Module 2 + 3: Increasing vs Decreasing',
          blocks: [
            { table: { head: ['', 'Monotonic INCREASING', 'Monotonic DECREASING'], rows: [
              ['Order (bottom → top)', '1, 2, 4, 7, 9', '10, 8, 6, 4, 2'],
              ['Naya x aane pe pop', 'Jo x se <b>bade</b> hain', 'Jo x se <b>chhote</b> hain'],
              ['Example', '[2, 4, 7] + 5 → 7 pop (7 &gt; 5), 4 &lt; 5 ruko → [2, 4, 5]', '[10, 8, 6, 4] + 5 → 4 pop → [10, 8, 6, 5]'],
              ['Kis kaam ka', 'Previous / next <b>smaller</b> (LC 84)', 'Next / previous <b>greater</b> (LC 496, LC 739)'],
            ] } },
            { code: J_MONO_PUSH },
            { lines: [
              ['while (!stack.isEmpty() && stack.peek() > x)', 'Increasing: jo naye se bada hai woh order todega → pop.'],
              ['stack.pop();', 'Pop hone wale ka "answer" yahi x hota hai (next smaller) — problems me yahin record karte hain.'],
              ['stack.push(x);', 'Ab order safe — x top pe.'],
              ['while (!stack.isEmpty() && stack.peek() < x)', 'Decreasing: chhote pop — x unka next greater.'],
            ] },
          ],
        },
        {
          title: 'Part 3 — Module 4: Kyun? O(n²) → O(n)',
          blocks: [
            { p: '<b>Next greater of [2, 1, 3, 4, 2]</b> — brute: har element ke liye right me scan → nested loops → O(n²).' },
            { p: '<b>Monotonic:</b> har element <b>ek baar push</b>, <b>max ek baar pop</b> → total kaam ≤ 2n → <b>O(n)</b> (while loop andar hone ke bawajood).' },
            { table: { head: ['Problem me ye dikhe', 'Pattern'], rows: [
              ['Next greater / next smaller', 'Monotonic stack'],
              ['Previous greater / previous smaller', 'Monotonic stack'],
              ['Waiting for a warmer day', 'Monotonic stack'],
              ['Histogram area', 'Monotonic stack'],
              ['Blocked by a taller element', 'Monotonic stack'],
              ['Nearest larger / smaller', 'Monotonic stack'],
            ] } },
          ],
        },
        {
          title: 'Part 4 — Module 5: Values vs Indices + Dry run',
          blocks: [
            { table: { head: ['Store', 'Kab'], rows: [
              ['<b>Values</b>', 'Sirf direct comparison kaafi (LC 496 — values distinct, map me value → answer)'],
              ['<b>Indices</b>', 'Distance (LC 739), previous/next position, width (LC 84), duplicates, ya <code>arr[index]</code> chahiye'],
            ] } },
            { tip: 'Rule: <b>array problems me indices safer</b> — index se value bhi mil jaati hai, position bhi.' },
            { pre: `Decreasing stack, input 4, 3, 2, 1 → koi pop nahi:
  push 4 → [4]   push 3 → [4,3]   push 2 → [4,3,2]   push 1 → [4,3,2,1]
  (sab "un-resolved" — kisi ka next greater nahi mila)

Ab 5 aaya:  1 < 5 pop (NGE of 1 = 5) → 2 pop (5) → 3 pop (5) → 4 pop (5) → push 5
  stack = [5]` },
          ],
        },
        { title: 'Part 5 — Aaj ka problem (Tum): LC 496 Next Greater Element I', blocks: [{ problem: 496 }] },
        {
          title: 'Part 6 — Thinking: Brute → Optimal (LC 496)',
          blocks: [
            { p: '<b>Brute:</b> nums1 ke har x ke liye nums2 me x ki position dhundo, phir right me pehla bada scan. O(m · n).' },
            { p: '<b>Observation:</b> Har nums1 query ke liye dobara scan waste hai — nums2 ke <b>sab</b> elements ka next greater ek hi pass me nikal sakta hai (decreasing stack), phir lookup.' },
            { p: '<b>Optimal:</b> stack = un-resolved values. num &gt; top → top ka answer num (map), pop, repeat. push num. End me bache → −1. nums1 → map.get. O(m + n). Values isliye kaafi kyunki <b>distinct</b> hain (distance nahi chahiye).' },
            { p: '<b>Better?</b> Alag Better nahi — brute ke baad seedha stack + HashMap.' },
          ],
        },
        {
          title: 'Part 7 — Dry run + code (LC 496)',
          blocks: [
            { table: { head: ['num', 'Stack before', 'Action', 'map'], rows: [
              ['1', '[]', 'push 1', '{}'],
              ['3', '[1]', '3 &gt; 1 → 1 resolve, push 3', '{1=3}'],
              ['4', '[3]', '4 &gt; 3 → 3 resolve, push 4', '{1=3, 3=4}'],
              ['2', '[4]', '2 &lt; 4 → push 2', ''],
              ['end', '[4, 2]', 'bache → −1', '{1=3, 3=4, 4=−1, 2=−1}'],
            ] } },
            { p: 'nums1 = [4, 1, 2] → <b>[-1, 3, -1]</b>' },
            { code: ap(496, 0) },
            { code: ap(496, 1) },
            { lines: [
              ['Map<Integer, Integer> map = new HashMap<>();', 'value → next greater (nums2 me).'],
              ['Deque<Integer> stack = new ArrayDeque<>();', 'Un-resolved values; top ki taraf decreasing.'],
              ['while (!stack.isEmpty() && num > stack.peek())', 'Current num top se bada → top resolve.'],
              ['map.put(stack.pop(), num);', 'Pop + answer record.'],
              ['stack.push(num);', 'Ab num khud wait karega.'],
              ['map.put(stack.pop(), -1);', 'Bache = right me koi bada nahi.'],
              ['result[i] = map.get(nums1[i]);', 'O(1) lookup.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Visualize',
          blocks: [
            { list: ['<b>Optimal</b>: stack (un-resolved) aur HashMap saath me bharte dekho.', 'Pop hamesha <b>chhote</b> ka hota hai — decreasing stack.', '<b>Brute</b> tab: har x ke liye position dhundo + scan — kitne steps zyada lagte hain.'] },
            { viz: 496, ex: 0 },
          ],
        },
        {
          title: 'Part 9 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['nums1 = [5], nums2 = [5]', '[-1]', 'Akela — right me kuch nahi'],
              ['Decreasing nums2 [3, 2, 1]', 'sab −1', 'Koi pop nahi; sab leftover'],
              ['Increasing nums2 [1, 2, 3, 4]', 'har ek ka agla', 'Har num pichle ko turant resolve'],
              ['x nums2 ka last element', '−1', 'Right me kuch nahi'],
            ] } },
          ],
        },
        {
          title: 'Part 10 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute', 'O(m · n)', 'O(1) extra'],
              ['Stack + HashMap', 'O(m + n) — har nums2 element ek push, max ek pop', 'O(n) map + stack'],
            ] } },
          ],
        },
        {
          title: 'Part 11 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Monotonic stack kya hai?', 'Stack jo bottom → top increasing ya decreasing order maintain kare.'],
              ['Increasing stack me kya pop hota hai?', 'Naye se bade elements.'],
              ['Decreasing stack me?', 'Naye se chhote — next greater problems.'],
              ['Pop kyun karte hain?', 'Pop hone wale ka answer mil gaya (current hi uska next greater/smaller), aur order bana rehta hai.'],
              ['While andar for — phir bhi O(n) kyun?', 'Har element ek push, max ek pop — total pops ≤ n.'],
              ['NGE kya hai?', 'Right side ka pehla strictly greater element.'],
              ['PSE kya hai?', 'Left side ka nearest strictly smaller element.'],
              ['LC 496 me values kyun chal gaye, indices kyun nahi?', 'Values distinct hain aur distance nahi chahiye — value hi map key.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['What is a monotonic stack?', 'It is a stack that keeps its elements in increasing or decreasing order. Before pushing, I pop every element that would break the order, and the element that causes a pop is usually the answer for the popped one, like its next greater or next smaller element. Each element is pushed once and popped at most once, so it is O(n).'],
              ['LC 496 approach', 'Brute force searches each nums1 value in nums2 and scans right, O(m times n). Instead I run a decreasing stack over nums2: when a bigger number arrives, it resolves all smaller values on top, which I store in a map. Leftovers map to minus one, and nums1 answers are lookups. O(m plus n) time, O(n) space.'],
              ['Values or indices?', 'If I only need to compare values and they are distinct, values are enough. If I need a distance, a width, a position or have duplicates, I store indices, because the index gives me both the position and the value.'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohvi session (no mandatory LeetCode)',
          blocks: [
            { olist: [
              'Normal stack vs monotonic stack — apne shabdon me.',
              'Increasing vs decreasing — Part 2 ke dono examples paper pe.',
              '5 examples classify karo: [1,3,5] (increasing), [9,6,2] (decreasing), [4,4,1] (decreasing, non-strict), [2,7,3] (none), [1,2,2,8] (increasing, non-strict).',
              '"Pop kyun?" — ek line me likho.',
              'Kahan indices chahiye — Part 4 table se 2 examples.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 496 statement → brute → monotonic approach bolke (code se pehle).',
              '<b>Task B:</b> Dry run (Part 7) khud — phir visualizer se match.',
              '<b>Task C:</b> Implement + submit. Speed nahi, pattern.',
              '<b>Task D:</b> Pattern Journal me LC 496 ki entry (Day 54 template).',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 15 — Homework',
          blocks: [
            { list: ['<b>Sohvi:</b> 3 increasing aur 3 decreasing stack examples draw karo (har push/pop ke saath).', '<b>Tum:</b> LC 496 + Pattern Journal entry.', 'Kal (Day 51): Next Greater Element — generic template + LC 496 independently.'] },
          ],
        },
        {
          title: 'Part 16 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Increasing stack [2, 4, 7] + 5 → ?', '[2, 4, 5]'],
              ['Decreasing stack [10, 8, 6, 4] + 5 → ?', '[10, 8, 6, 5]'],
              ['Next greater ke liye kaunsa stack?', 'Decreasing.'],
              ['LC 496 [4,1,2] / [1,3,4,2] → ?', '[-1, 3, -1]'],
              ['Monotonic stack O(n) kyun?', 'Har element ek push, max ek pop.'],
            ] },
          ],
        },
      ],
      checks: [
        'Normal vs monotonic stack ka fark bol sakta/sakti hu',
        'Increasing vs decreasing — kab kya pop hota hai',
        'Pop kyun + O(n) kyun (ek push, ek pop)',
        'NGE / PSE definitions yaad',
        'Values vs indices rule samjha',
        'Tum: LC 496 submit + Journal entry',
        '8 interview sawaal bina dekhe',
      ],
      memory: 'Monotonic stack = order todne wale ko pop karo; jisne pop karwaya wahi answer.',
    },

    // =====================================================================
    // DAY 51
    9: {
      title: 'Next Greater Element — Stack of Unresolved + HashMap',
      goal: 'NGE concept, brute, monotonic approach, pop condition, <b>stack = un-resolved elements</b>, generic template, aur <b>LC 496 independently</b> (stack + HashMap).',
      main: 496,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('LC 496 (kal) + LC 155 + LC 20', 'NGE concept, brute, why stack, why pop', 'Generic template + visualizer', '[2,1,3] mini + LC 496 table', 'Sohvi: brute + dry run · Tum: re-solve bina notes', 'O(n + m) + Journal'),
            ...rev({
              h: 'LC 496 — Next Greater Element I',
              p: 'nums1 ke har x ka nums2 me next greater.',
              ex: 'nums2 = [1,3,4,2] → map {1=3, 3=4, 4=−1, 2=−1} → nums1 [4,1,2] → [-1,3,-1]',
              pat: 'Monotonic Stack — Next Greater + HashMap',
              steps: ['num > top → map.put(pop, num).', 'push num.', 'Bache → −1; nums1 → map.get.'],
              code: ap(496, 1),
              hook: 'Jo pop karwaye wahi answer.',
            }),
            ...rev({
              h: 'LC 155 — Min Stack',
              p: 'O(1) getMin.',
              ex: 'push 0, 1, 0 → pop → getMin 0 (≤ ki wajah se)',
              pat: 'Design — Auxiliary Stack',
              steps: ['≤ pe minStack push.', 'removed == min top → minStack pop.', 'getMin = minStack.peek().'],
              code: ap(155, 2),
              hook: 'Duplicates ke liye ≤.',
            }),
            ...rev({
              h: 'LC 20 — Valid Parentheses',
              p: 'Brackets valid?',
              ex: '"([)]" → false · "{[]}" → true',
              pat: 'Stack — Matching / Parentheses',
              steps: ['Opening push.', 'Closing: empty / mismatch → false, match → pop.', 'End: isEmpty.'],
              code: ap(20, 1),
              hook: 'Jo last khula, wahi pehle band.',
            }),
          ],
        },
        {
          title: 'Part 1 — Module 1: Next Greater Element kya hai?',
          blocks: [
            { p: '<b>NGE</b> = right side ka <b>pehla strictly greater</b> element (adjacent zaroori nahi; nahi mila → −1).' },
            { table: { head: ['arr', '4', '1', '2', '5', '3'], rows: [
              ['NGE', '5', '2', '5', '−1', '−1'],
            ] } },
            { p: '4 ka NGE 5 hai (1 aur 2 chhote the, skip). 5 aur 3 ke right me koi bada nahi → −1.' },
          ],
        },
        {
          title: 'Part 2 — Module 2: Brute + Module 3: Stack kyun?',
          blocks: [
            { code: J_NGE_BRUTE },
            { p: 'Brute: O(n²) time, O(1) auxiliary (output O(n)).' },
            { pre: `[2, 1, 3]
2 aaya → abhi answer nahi (un-resolved)        stack [2]
1 aaya → 1 > 2? nahi → 1 bhi un-resolved       stack [2, 1]
3 aaya → 3 > 1 → 1 resolve (3)                 stack [2]
         3 > 2 → 2 resolve (3)                 stack []
         push 3                                stack [3]
end   → 3 un-resolved → −1
answer [3, 3, −1]` },
            { tip: '<b>Stack me kaun hai?</b> Hamesha woh elements jinka next greater <b>abhi tak nahi mila</b>. Naya element unhe "resolve" karta hai.' },
          ],
        },
        {
          title: 'Part 3 — Module 4 + 5: Pop condition + generic template',
          blocks: [
            { p: '<b>Pop condition:</b> <code>arr[i] &gt; arr[stack.peek()]</code> → current element top ko resolve karta hai → pop + answer assign → <b>continue</b> (shayad aur bhi resolve ho).' },
            { code: J_NGE },
            { lines: [
              ['Arrays.fill(result, -1);', 'Default: koi greater nahi.'],
              ['Deque<Integer> stack = new ArrayDeque<>();', 'Un-resolved <b>indices</b> (generic template me indices — duplicates bhi safe).'],
              ['while (!stack.isEmpty() && arr[i] > arr[stack.peek()])', 'Current top se strictly bada?'],
              ['result[stack.pop()] = arr[i];', 'Top resolve — uska NGE = arr[i].'],
              ['stack.push(i);', 'Current khud wait kare.'],
            ] },
          ],
        },
        { title: 'Part 4 — Aaj ka problem: LC 496 Next Greater Element I', blocks: [{ problem: 496 }] },
        {
          title: 'Part 5 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute:</b> nums1 ka x nums2 me dhundo, right me scan — O(m · n).' },
            { p: '<b>Optimal (6A):</b> nums2 process karo → har value ka NGE map me → nums1 lookup. <b>(6B)</b> code: stack + HashMap, leftover → −1.' },
            { p: '<b>Better?</b> Nahi — brute ke baad seedha stack + map.' },
          ],
        },
        {
          title: 'Part 6 — Dry run: nums1 = [4,1,2], nums2 = [1,3,4,2]',
          blocks: [
            { table: { head: ['num', 'while check', 'pop → map', 'push', 'stack after'], rows: [
              ['1', 'stack khaali', '—', '1', '[1]'],
              ['3', '3 &gt; 1 ✓, phir khaali', '1 → 3', '3', '[3]'],
              ['4', '4 &gt; 3 ✓, phir khaali', '3 → 4', '4', '[4]'],
              ['2', '2 &gt; 4 ✗', '—', '2', '[4, 2]'],
              ['leftover', '', '2 → −1, 4 → −1', '', '[]'],
            ] } },
            { p: 'Map: 1→3, 3→4, 4→−1, 2→−1. nums1 [4, 1, 2] → <b>[-1, 3, -1]</b>.' },
          ],
        },
        {
          title: 'Part 7 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' },
            { code: ap(496, 0) },
            { p: '<b>Optimal — stack + HashMap (syllabus 6B, ArrayDeque)</b>' },
            { code: ap(496, 1) },
            { lines: [
              ['for (int num : nums2)', 'Sirf nums2 pe monotonic pass.'],
              ['while (!stack.isEmpty() && num > stack.peek())', 'Strictly greater — tabhi resolve.'],
              ['map.put(stack.pop(), num);', 'Har value max ek baar pop.'],
              ['while (!stack.isEmpty())', 'Bache hue = un-resolved forever.'],
              ['map.put(stack.pop(), -1);', '(Ya getOrDefault(x, −1) se skip kar sakte ho.)'],
              ['result[i] = map.get(nums1[i]);', 'nums1 ⊆ nums2, isliye key hamesha milegi.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Visualize',
          blocks: [
            { list: ['Example 2 (nums2 increasing [1,2,3,4]) — har num pichle ko turant resolve karta hai.', 'Leftover loop me 4 ka −1.', 'Brute tab se compare — steps ginke dekho.'] },
            { viz: 496, ex: 1 },
          ],
        },
        {
          title: 'Part 9 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Result', 'Note'], rows: [
              ['Koi greater nahi', '−1', 'Leftover'],
              ['Pehla hi element greater', 'Turant resolve', '[2, 3] → 2 ka 3'],
              ['Last element', '−1', 'Right me kuch nahi'],
              ['Single element', '[−1]', ''],
              ['Duplicates (generic template)', 'Indices use karo', 'LC 496 me values distinct hain'],
            ] } },
          ],
        },
        {
          title: 'Part 10 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute (generic NGE)', 'O(n²)', 'O(1) aux'],
              ['Monotonic (generic NGE)', 'O(n)', 'O(n)'],
              ['LC 496 brute', 'O(m · n)', 'O(1)'],
              ['LC 496 stack + map', 'O(n + m)', 'O(n)'],
            ] } },
          ],
        },
        {
          title: 'Part 11 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Stack me kaun rehta hai?', 'Un-resolved elements — jinka NGE abhi nahi mila.'],
              ['Pop condition?', 'current &gt; top (strictly).'],
              ['Barabar value pe pop karein?', 'Nahi — NGE strictly greater maangta hai.'],
              ['Stack ka order?', 'Decreasing (bottom → top).'],
              ['Har element kitni baar push/pop?', 'Ek push, max ek pop.'],
              ['HashMap kyun?', 'nums1 ki queries O(1) — nums2 ka answer value se dhundhna.'],
              ['getOrDefault vs leftover loop?', 'Dono sahi; leftover loop syllabus wala explicit version.'],
              ['Right se left bhi kar sakte hain?', 'Haan — stack me future candidates; chhote pop, top = answer.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach (Brute → Optimal)', 'The brute force finds each nums1 value inside nums2 and scans to the right for the first greater value, which is O(m times n). The optimal solution precomputes the next greater element of every nums2 value with a decreasing stack of unresolved values: whenever the current number is greater than the top, it resolves the top, so I pop it into a map. After the pass, the remaining values get minus one. Then each nums1 answer is a map lookup. Time O(m plus n), space O(n).'],
              ['Why is it O(n) with a nested while?', 'Every value of nums2 is pushed exactly once and can be popped at most once, so across the whole loop the while body runs at most n times. Adding the n pushes, the total work is linear.'],
              ['Generic next greater template', 'I fill the result with minus one, keep a stack of indices, and for each i pop while arr[i] is greater than arr at the top, setting result[popped] to arr[i]; then I push i. Indices make it work with duplicates and let me compute distances if needed.'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohvi session',
          blocks: [
            { olist: [
              '5 arrays ka NGE manually (jaise [4,1,2,5,3], [1,2,3], [3,2,1], [2,7,3,8], [5]).',
              'Brute (Part 2) samjho — 2 loops.',
              '"Pop kyun?" — [2, 1, 3] example se bolo.',
              'LC 496 dry run table (Part 6) khud banao.',
              'Un-resolved elements kya hote hain — ek line.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 496 re-solve: brute → stack + HashMap (bina notes, 15 min).',
              '<b>Task B:</b> Un-resolved elements explain karo; har element max ek push/pop kyun.',
              '<b>Task C:</b> Generic NGE template (indices) memory se.',
              '<b>Task D:</b> Complexity bolo + Journal entry update.',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 15 — Homework',
          blocks: [
            { list: ['<b>Sohvi:</b> 5 NGE examples (khud banao, manually solve).', '<b>Tum:</b> LC 496 bina notes + Pattern Journal.', 'Kal (Day 52): LC 739 Daily Temperatures — waiting / distance.'] },
          ],
        },
        {
          title: 'Part 16 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[4, 1, 2, 5, 3] ka NGE?', '[5, 2, 5, −1, −1]'],
              ['Pop condition?', 'arr[i] &gt; arr[stack.peek()]'],
              ['Leftover ka answer?', '−1'],
              ['LC 496 time?', 'O(n + m)'],
              ['Stack order?', 'Decreasing.'],
            ] },
          ],
        },
      ],
      checks: [
        'NGE definition + [4,1,2,5,3] example',
        'Brute nested loop likh sakta/sakti hu',
        '[2,1,3] se "stack kyun / pop kyun" samjha',
        'Generic template (indices) yaad',
        'LC 496 independently submit',
        'Har element ek push / ek pop — O(n) bol sakta/sakti hu',
        '8 interview sawaal bina dekhe',
      ],
      memory: 'Stack me un-resolved; bada aaya → sabko resolve karo, phir khud wait karo.',
    },

    // =====================================================================
    // DAY 52
    10: {
      title: 'Daily Temperatures — Waiting / Distance Pattern',
      goal: '<b>Waiting problems</b> = next greater + <b>distance</b>. Answer index difference hai, isliye <b>stack of indices</b>. Multiple un-resolved days ka dry run, LC 739 optimal, aur amortized O(n).',
      main: 739,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('LC 496 + LC 232 + LC 622', 'Waiting problem, NGE connection, distance', 'Clues + mini [2,1,3] + visualizer', 'Full table [73..73]', 'Sohvi: 5 temps dry run · Tum: brute → optimal', 'Amortized O(n) + Journal'),
            ...rev({
              h: 'LC 496 — Next Greater Element I',
              p: 'Next greater via stack + map.',
              ex: '[2,4] / [1,2,3,4] → map {1=2, 2=3, 3=4, 4=−1} → [3, −1]',
              pat: 'Monotonic Stack — Next Greater + HashMap',
              steps: ['num > top → resolve.', 'push num.', 'leftover −1, lookup.'],
              code: ap(496, 1),
              hook: 'Jo pop karwaye wahi answer.',
            }),
            ...rev({
              h: 'LC 232 — Implement Queue using Stacks',
              p: 'Stacks se FIFO.',
              ex: 'push 1, 2 → peek → transfer → out [2, 1] → 1',
              pat: 'Design — Two Stacks (lazy transfer)',
              steps: ['push → in.', 'out khaali → transfer.', 'pop/peek → out.'],
              code: ap(232, 1),
              hook: 'Transfer tabhi jab out khaali.',
            }),
            ...rev({
              h: 'LC 622 — Design Circular Queue',
              p: 'Ring buffer.',
              ex: 'k = 2: enQueue 5 → Front 5 → deQueue → isEmpty true → Front −1',
              pat: 'Design — Circular Array (front + count)',
              steps: ['enQueue at (front + count) % k.', 'deQueue: front aage.', 'count.'],
              code: ap(622, 1),
              hook: 'count == 0 khaali.',
            }),
          ],
        },
        {
          title: 'Part 1 — Module 1: Waiting problem',
          blocks: [
            { pre: `temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
answer       = [ 1,  1,  4,  2,  1,  1,  0,  0]

Din 2 (75) → agla garam din 6 (76) → 6 − 2 = 4 din wait
Answer = DISTANCE (kitne din), value nahi.` },
            { table: { head: ['Clue', 'Matlab'], rows: [
              ['Future event ka wait', 'Next greater'],
              ['Next larger value', 'Monotonic decreasing stack'],
              ['Next larger tak distance', 'Indices store karo'],
              ['Un-resolved elements', 'Stack me rakho'],
            ] } },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 739 Daily Temperatures', blocks: [{ problem: 739 }] },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute:</b> har i ke liye j &gt; i scan, pehla garam → j − i, warna 0. O(n²).' },
            { p: '<b>Observation:</b> Ye NGE hi hai — bas answer value ki jagah <b>distance</b>. Distance ke liye <b>index</b> chahiye → stack me indices.' },
            { p: '<b>Optimal (left → right, syllabus):</b> stack = un-resolved din (indices). temperatures[i] &gt; top ka temp → previousIndex = pop, result[previousIndex] = i − previousIndex. push i. Bache din → default 0.' },
            { p: '<b>Alternative Optimal (right → left):</b> stack = future candidates; ≤ wale pop; top = answer turant. Dono O(n).' },
            { pre: `Mini: [2, 1, 3]
i=0 push 0          stack [0]
i=1 1 > 2? nahi     stack [0, 1]
i=2 3 > 1 → result[1] = 2 − 1 = 1;  3 > 2 → result[0] = 2 − 0 = 2;  push 2
answer [2, 1, 0]` },
          ],
        },
        {
          title: 'Part 4 — Dry run (syllabus table)',
          blocks: [
            { table: { head: ['i', 'temp', 'Stack before (indices)', 'Action', 'result update'], rows: [
              ['0', '73', '[]', 'push 0', '—'],
              ['1', '74', '[0]', '74 &gt; 73 → resolve 0, push 1', 'result[0] = 1'],
              ['2', '75', '[1]', 'resolve 1, push 2', 'result[1] = 1'],
              ['3', '71', '[2]', '71 &lt; 75 → push 3', '—'],
              ['4', '69', '[2, 3]', 'push 4', '—'],
              ['5', '72', '[2, 3, 4]', 'resolve 4, resolve 3, push 5', 'result[4] = 1, result[3] = 2'],
              ['6', '76', '[2, 5]', 'resolve 5, resolve 2, push 6', 'result[5] = 1, result[2] = 4'],
              ['7', '73', '[6]', 'push 7', '—'],
              ['end', '', '[6, 7]', 'bache → 0', ''],
            ] } },
            { p: 'Final: <b>[1, 1, 4, 2, 1, 1, 0, 0]</b>' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' },
            { code: ap(739, 0) },
            { p: '<b>Optimal (left → right) — syllabus</b>' },
            { code: ap(739, 2) },
            { lines: [
              ['int[] result = new int[n];', 'Default 0 = koi garam din nahi (explicit fill ki zarurat nahi).'],
              ['Deque<Integer> stack = new ArrayDeque<>();', 'Un-resolved din ke <b>indices</b>.'],
              ['while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()])', 'Aaj top wale din se garam?'],
              ['int previousIndex = stack.pop();', 'Woh din resolve.'],
              ['result[previousIndex] = i - previousIndex;', 'Distance = index difference.'],
              ['stack.push(i);', 'Aaj ka din ab wait karega.'],
            ] },
            { p: '<b>Optimal (right → left)</b>' },
            { code: ap(739, 1) },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['i = 5 (72) pe do din (4 aur 3) ek saath resolve — multiple un-resolved.', 'Stack me <b>index : temp</b> dono dikhte hain.', 'Right → left tab: answer turant milta hai.'] },
            { viz: 739, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['Strictly increasing [30, 40, 50, 60]', '[1, 1, 1, 0]', 'Har din agla resolve karta hai'],
              ['Strictly decreasing [90, 80, 70]', '[0, 0, 0]', 'Koi pop nahi'],
              ['Equal [50, 50, 50]', '[0, 0, 0]', 'Strictly warmer chahiye — &gt;, ≥ nahi'],
              ['Single day [70]', '[0]', ''],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity (amortized O(n))',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute', 'O(n²)', 'O(1) extra (output O(n))'],
              ['Monotonic (L → R)', 'O(n) amortized', 'O(n)'],
              ['Monotonic (R → L)', 'O(n) amortized', 'O(n)'],
            ] } },
            { tip: '<b>Amortized:</b> ek i pe kai pops ho sakte hain, lekin poore run me har index max ek baar pop — total ≤ n pops + n pushes.' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Indices kyun?', 'Answer distance hai — index se value bhi aur position bhi.'],
              ['Bache din explicitly fill kyun nahi?', 'int[] default 0 hai — wahi answer.'],
              ['Default 0 kyun?', 'Problem kehta hai garam din nahi toh 0.'],
              ['LC 496 se connection?', 'Same NGE pattern; 496 me value chahiye (map), 739 me distance (indices).'],
              ['Barabar temp pe pop?', 'Nahi — strictly warmer.'],
              ['Stack ka order?', 'Temperatures decreasing (bottom → top).'],
              ['Current din purane ko kyun resolve karta hai?', 'Jo din abhi tak wait kar rahe the unme se jo current se thande hain, unka pehla garam din yahi hai.'],
              ['O(n) kyun?', 'Har index ek push, max ek pop.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach (Brute → Optimal)', 'Brute force scans forward from every day for the first warmer day, which is O(n squared). This is a next greater element problem where the answer is a distance, so I keep a stack of indices of days still waiting. For each day i, while today is warmer than the day on top, I pop that index and set its answer to i minus the index. Then I push i. Remaining days keep the default zero. Each index is pushed and popped at most once, so it is O(n) time and O(n) space.'],
              ['Why amortized O(n)?', 'The while loop can pop several indices in one iteration, but the total number of pops over the entire run cannot exceed the number of pushes, which is n. So the overall work is linear.'],
              ['Connection with Next Greater Element', 'It is the same monotonic decreasing stack. In Next Greater Element I record the greater value in a map; here I record the distance, which is why I store indices instead of values.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session (no mandatory coding)',
          blocks: [
            { olist: ['Statement samjho — "kitne din wait".', 'NGE se connection ek line me.', 'Distance vs value — 75 ka answer 4 kyun, 76 nahi.', '5 temperatures ka dry run: [30, 60, 40, 50, 70] → [1, 3, 1, 1, 0].', 'Optimal code padh ke samjho (likhna zaroori nahi).'] },
          ],
        },
        {
          title: 'Part 12 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Brute → monotonic (indices) bina notes, submit.',
              '<b>Task B:</b> Waiting distance + amortized O(n) explain record karo.',
              '<b>Task C (follow-ups):</b> indices kyun? remaining explicitly fill kyun nahi? default 0 kyun? LC 496 se connection?',
              '<b>Task D:</b> Right → left version bhi likho.',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: ['<b>Sohvi:</b> 3 arrays ke waiting days manually.', '<b>Tum:</b> LC 739 bina notes + Pattern Journal.', 'Kal (Day 53): LC 84 Largest Rectangle — boundaries pehle, code baad me.'] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[73,74,75,71,69,72,76,73] → ?', '[1,1,4,2,1,1,0,0]'],
              ['[2, 1, 3] → ?', '[2, 1, 0]'],
              ['Stack me kya store?', 'Indices.'],
              ['result[previousIndex] = ?', 'i − previousIndex.'],
              ['Time?', 'O(n) amortized.'],
            ] },
          ],
        },
      ],
      checks: [
        'Waiting problem = NGE + distance — samjha',
        'Indices kyun, values kyun nahi',
        'Full dry run table bina dekhe',
        'LC 739 brute + optimal (L → R) submit',
        'Amortized O(n) explain kar sakta/sakti hu',
        'Edge cases (increasing, decreasing, equal, single)',
        '8 interview sawaal bina dekhe',
      ],
      memory: 'Waiting = next greater + distance → indices; result[pop] = i − pop, bache = 0.',
    },

    // =====================================================================
    // DAY 53
    11: {
      title: 'Largest Rectangle in Histogram — PSE + NSE + Width',
      goal: '<b>LC 84 (Hard).</b> Pehle <b>boundaries</b>, phir code: histogram, area, brute, <b>PSE</b>, <b>NSE</b>, width = NSE − PSE − 1, increasing stack of indices, one-pass (sentinel 0, sentinel index <b>push nahi</b>), equal heights. Sohvi: concepts + 3 histograms manually (coding mandatory nahi).',
      main: 84,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('LC 739 + LC 496 + LC 225', 'Histogram, area, brute, PSE, NSE, width', 'PSE/NSE table + one-pass visualizer', '[2,1,5,6,2,3] one-pass', 'Sohvi: 3 histograms · Tum: PSE/NSE arrays + one-pass', 'O(n) + Journal'),
            ...rev({
              h: 'LC 739 — Daily Temperatures',
              p: 'Garam din tak kitne din.',
              ex: '[30, 60, 90] → [1, 1, 0]',
              pat: 'Monotonic Stack — Next Greater',
              steps: ['Stack of un-resolved indices.', 'Garam din → pop, result = i − pop.', 'push i.'],
              code: ap(739, 2),
              hook: 'Distance chahiye → indices.',
            }),
            ...rev({
              h: 'LC 496 — Next Greater Element I',
              p: 'Next greater via map.',
              ex: '[4,1,2] / [1,3,4,2] → [-1,3,-1]',
              pat: 'Monotonic Stack — Next Greater + HashMap',
              steps: ['num > top → map.put(pop, num).', 'push num.', 'leftover −1.'],
              code: ap(496, 1),
              hook: 'Jo pop karwaye wahi answer.',
            }),
            ...rev({
              h: 'LC 225 — Implement Stack using Queues',
              p: 'Queue se stack.',
              ex: 'push 1, 2, 3 → pop → 3',
              pat: 'Design — Queue rotation',
              steps: ['offer.', 'size − 1 rotate.', 'poll / peek.'],
              code: ap(225, 2),
              hook: 'Naya front pe = top.',
            }),
          ],
        },
        {
          title: 'Part 1 — Module 1–2: Histogram, area, brute',
          blocks: [
            { pre: `heights = [2, 1, 5, 6, 2, 3]   (har bar ki width 1)

            6
        5   █
        █   █
        █   █       3
  2     █   █   2   █
  █  1  █   █   █   █
  █  █  █   █   █   █
  0  1  2   3   4   5

Area = Height × Width.   Bars 2..3 pe height 5: 5 × 2 = 10 (answer)` },
            { p: '<b>Brute:</b> har bar ko rectangle ki <b>minimum height</b> maano → left/right tab tak failao jab tak ≥ height → width → area → max. O(n²).' },
          ],
        },
        {
          title: 'Part 2 — Module 3–5: PSE, NSE, width',
          blocks: [
            { p: '<b>PSE</b> = left me nearest <b>strictly smaller</b> (nahi → −1). <b>NSE</b> = right me nearest strictly smaller (nahi → n). Bar in dono ke <b>beech</b> tak fail sakta hai.' },
            { pre: 'Width = NSE − PSE − 1\nheight 5 (index 2): PSE = 1, NSE = 4 → width = 4 − 1 − 1 = 2 → area 10' },
            { table: { head: ['Index', 'Height', 'PSE', 'NSE', 'Width', 'Area'], rows: [
              ['0', '2', '−1', '1', '1', '2'],
              ['1', '1', '−1', '6', '6', '6'],
              ['2', '5', '1', '4', '2', '<b>10</b>'],
              ['3', '6', '2', '4', '1', '6'],
              ['4', '2', '1', '6', '4', '8'],
              ['5', '3', '4', '6', '1', '3'],
            ] } },
            { p: 'Max = <b>10</b>.' },
          ],
        },
        { title: 'Part 3 — Aaj ka problem: LC 84 Largest Rectangle in Histogram', blocks: [{ problem: 84 }] },
        {
          title: 'Part 4 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute (expand each bar):</b> O(n²).' },
            { p: '<b>Better (PSE / NSE arrays):</b> do monotonic passes (increasing stack, pop while ≥) se pse[] aur nse[]; phir har bar ka area. O(n), par 3 passes + 2 arrays.' },
            { p: '<b>Optimal (one pass):</b> increasing stack of indices. Chhota height aaya → top bar ka <b>NSE = i</b>; pop ke baad naya top = <b>PSE</b> (khaali → −1); area turant. i == n pe <b>sentinel height 0</b> sab bache bars pop karwata hai; sentinel index push <b>nahi</b> hota (<code>if (i &lt; n)</code>) — user ka corrected code.' },
            { pre: `Increasing stack ka idea ([2, 1, 5, 6]):
push 0 (h2)
h1 aaya → 2 > 1 → pop 0 (uska right boundary = index 1), push 1
push 2 (h5), push 3 (h6)   ← stack heights 1, 5, 6 increasing
Chhota height = waiting bade bars ka RIGHT boundary resolve karta hai.` },
          ],
        },
        {
          title: 'Part 5 — Dry run: one pass on [2, 1, 5, 6, 2, 3]',
          blocks: [
            { table: { head: ['i', 'currentHeight', 'Pops (height, PSE, width → area)', 'Push', 'Stack after', 'maxArea'], rows: [
              ['0', '2', '—', '0', '[0]', '0'],
              ['1', '1', 'idx0: 2, −1, 1 → 2', '1', '[1]', '2'],
              ['2', '5', '—', '2', '[1, 2]', '2'],
              ['3', '6', '—', '3', '[1, 2, 3]', '2'],
              ['4', '2', 'idx3: 6, 2, 1 → 6 · idx2: 5, 1, 2 → <b>10</b>', '4', '[1, 4]', '10'],
              ['5', '3', '—', '5', '[1, 4, 5]', '10'],
              ['6 (= n)', '0 (sentinel)', 'idx5: 3, 4, 1 → 3 · idx4: 2, 1, 4 → 8 · idx1: 1, −1, 6 → 6', '<b>push nahi</b>', '[]', '10'],
            ] } },
            { p: '<b>Equal heights [2, 2, 2]:</b> <code>&gt;</code> ki wajah se barabar wale pop nahi hote; sentinel pe pop: idx2 (w 1 → 2), idx1 (PSE 0, w 2 → 4), idx0 (PSE −1, w 3 → <b>6</b>). Sahi max milta hai. PSE/NSE arrays me ≥ / &gt; <b>consistently</b> use karo.' },
          ],
        },
        {
          title: 'Part 6 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — expand each bar</b>' },
            { code: ap(84, 0) },
            { p: '<b>Better — separate PSE / NSE arrays</b>' },
            { code: ap(84, 1) },
            { p: '<b>Optimal — one pass (user ka corrected code)</b>' },
            { code: ap(84, 2) },
            { lines: [
              ['for (int i = 0; i <= n; i++)', '<b>≤ n</b> — ek extra round sentinel ke liye.'],
              ['int currentHeight = (i == n) ? 0 : heights[i];', 'Sentinel 0 sabse chhota — bache bars flush.'],
              ['while (!stack.isEmpty() && heights[stack.peek()] > currentHeight)', 'Top bar ka right boundary mil gaya (NSE = i).'],
              ['int heightIndex = stack.pop();', 'Is bar ka area ab final hai.'],
              ['int previousSmaller = stack.isEmpty() ? -1 : stack.peek();', 'Naya top = PSE.'],
              ['int width = i - previousSmaller - 1;', 'PSE aur NSE ke beech ki bars.'],
              ['maxArea = Math.max(maxArea, height * width);', 'Best update.'],
              ['if (i < n) stack.push(i);', 'Sentinel index n push nahi — warna heights[n] out of bounds (pichle draft ki galti).'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Visualize',
          blocks: [
            { list: ['i = 4 pe do pops — dusre pop pe width 2 aur area 10.', 'Sentinel round (i = n) me bache bars flush; push nahi.', '<b>Better</b> tab: pse[] aur nse[] bharte dekho, phir area loop.', '<b>Brute</b> tab: har bar ka left/right expansion.'] },
            { viz: 84, ex: 0 },
          ],
        },
        {
          title: 'Part 8 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Note'], rows: [
              ['[1] (single bar)', '1', ''],
              ['[2, 2, 2] (all equal)', '6', '&gt; vs ≥ — dono sahi agar consistent'],
              ['[1, 2, 3, 4, 5] (increasing)', '9', 'Sab sentinel pe pop'],
              ['[5, 4, 3, 2, 1] (decreasing)', '9', 'Har naya bar pichle ko pop karta hai'],
              ['[0, 0] / [3, 0, 3] (zero heights)', '0 / 3', '0 height bar barrier'],
              ['Empty (LeetCode me nahi)', '0', 'n = 0 → sirf sentinel round'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute (expand)', 'O(n²)', 'O(1)'],
              ['Better (PSE / NSE arrays)', 'O(n) — 3 passes', 'O(n) — 2 arrays + stack'],
              ['Optimal (one pass)', 'O(n) — har index ek push, ek pop', 'O(n) stack'],
            ] } },
          ],
        },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Indices kyun?', 'Width ke liye positions chahiye; height heights[index] se.'],
              ['Width i − previousSmaller − 1 kyun?', 'Bar PSE+1 se i−1 tak fail sakta hai.'],
              ['Sentinel 0 kyun?', 'End me bache bars ka area bhi isi loop me — alag cleanup nahi.'],
              ['Sentinel index push kyun nahi?', 'Woh asli bar nahi; push kiya toh heights[n] access → crash (pichle draft ki galti).'],
              ['Stack increasing kyun?', 'Har bar apne se chhote bar ka wait karta hai (NSE) — chhota aaya toh bade pop.'],
              ['Two arrays (PSE/NSE) approach?', 'Do passes, phir area — O(n), samajhna aasaan, memory zyada.'],
              ['One-pass kyun kaam karta hai?', 'Pop ke waqt NSE = i aur PSE = naya top dono pata hote hain.'],
              ['Duplicates?', '&gt; se pop: barabar wale ruke rehte hain; sabse left wala sahi width paata hai.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach (Brute → Better → Optimal)', 'Every maximal rectangle uses some bar as its shortest bar and stretches to the first strictly smaller bar on each side. Brute force expands left and right from every bar, O(n squared). Better, I compute previous-smaller and next-smaller indices for all bars with two monotonic stack passes, then the area of each bar is height times next minus previous minus one, which is O(n). Optimal does it in one pass with an increasing stack of indices: when a smaller height arrives at i, the popped bar’s next smaller is i and its previous smaller is the new top, so I compute its area right away. A sentinel height of zero at i equals n flushes the stack, and I do not push that sentinel index.'],
              ['Why is the stack increasing?', 'Each bar on the stack is waiting for its first smaller bar on the right. As long as heights keep growing nobody is resolved, so the stack stays increasing; a smaller height resolves all taller bars on top.'],
              ['Edge cases', 'A single bar, all equal heights, strictly increasing heights where everything is popped by the sentinel, strictly decreasing heights where each bar pops the previous one, and zero heights that act as barriers.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohvi session (LC 84 coding mandatory nahi)',
          blocks: [
            { olist: ['Histogram, height, width, area — apne shabdon me.', 'PSE aur NSE — Part 2 table ki 2 rows khud nikaalo.', '3 chhote histograms manually: [2, 4] → 4, [2, 1, 2] → 3, [3, 3] → 6.', 'Visualizer me i = 4 wala step dekho — area 10 kaise aaya.'] },
          ],
        },
        {
          title: 'Part 13 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A (sequence):</b> histogram → brute → PSE → NSE → width → monotonic stack → one-pass → duplicates → complexity.',
              '<b>Task B:</b> Separate PSE/NSE arrays version submit.',
              '<b>Task C:</b> One-pass version submit (sentinel push mat karna).',
              '<b>Task D (follow-ups):</b> indices kyun? width formula? sentinel 0 kyun? stack increasing kyun? two arrays? one-pass kyun?',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 14 — Homework',
          blocks: [
            { list: ['<b>Sohvi:</b> 3 histograms draw karke largest rectangle manually.', '<b>Tum:</b> LC 84 dono versions (PSE/NSE arrays + one-pass) bina notes + Journal.', 'Kal (Day 54): Pattern Recognition — koi naya problem nahi.'] },
          ],
        },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[2, 1, 5, 6, 2, 3] → ?', '10'],
              ['Width formula?', 'NSE − PSE − 1 (one-pass: i − previousSmaller − 1).'],
              ['PSE nahi mila toh?', '−1.'],
              ['Stack type?', 'Increasing (indices).'],
              ['[2, 2, 2] → ?', '6'],
            ] },
          ],
        },
      ],
      checks: [
        'Histogram area + brute samjha',
        'PSE / NSE definitions + table bina dekhe',
        'Width = NSE − PSE − 1 kyun',
        'One-pass dry run [2,1,5,6,2,3] bina dekhe',
        'Tum: PSE/NSE arrays + one-pass dono submit',
        'Sentinel 0 + "sentinel push nahi" samjha',
        '8 interview sawaal bina dekhe',
      ],
      memory: 'Har bar = shortest bar; NSE pe pop, naya top = PSE, width = i − PSE − 1, sentinel 0 push nahi.',
    },

    // =====================================================================
    // DAY 54 (concept day — koi naya problem nahi)
    12: {
      title: 'Pattern Recognition — Stack, Queue, Monotonic Stack (Concept Day)',
      goal: 'Aaj <b>koi naya problem nahi</b> (thoda hi coding). Problem padh ke turant pehchanna: Stack / Queue / Monotonic Stack / HashMap / Two Pointers / Sliding Window / Linked List. <b>20 identification questions</b>, 3 exercises (clue → DS → why → brute → optimal → complexity), aur <b>Pattern Journal</b>.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('LC 84 + LC 739 + LC 155', 'Stack vs Queue clues, normal vs monotonic clues', '20 identification questions', '3 exercises (clue → complexity)', 'Templates likho (NGE, PSE)', 'Pattern Journal 20 entries'),
            ...rev({
              h: 'LC 84 — Largest Rectangle in Histogram',
              p: 'Sabse bada rectangle.',
              ex: '[2, 1, 5, 6, 2, 3] → 10 (height 5, width 2)',
              pat: 'Monotonic Stack — Previous / Next Smaller',
              steps: ['Increasing stack of indices, i = 0..n (sentinel 0).', 'Pop: height, PSE = naya top (ya −1), width = i − PSE − 1.', 'if (i < n) push i.'],
              code: ap(84, 2),
              hook: 'NSE pe pop, naya top = PSE.',
            }),
            ...rev({
              h: 'LC 739 — Daily Temperatures',
              p: 'Waiting days.',
              ex: '[73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]',
              pat: 'Monotonic Stack — Next Greater',
              steps: ['Un-resolved indices.', 'Warmer → result[pop] = i − pop.', 'push i.'],
              code: ap(739, 2),
              hook: 'Distance → indices.',
            }),
            ...rev({
              h: 'LC 155 — Min Stack',
              p: 'O(1) getMin.',
              ex: 'push −2, 0, −3 → getMin −3 → pop → getMin −2',
              pat: 'Design — Auxiliary Stack',
              steps: ['≤ pe minStack push.', 'removed == top → pop.', 'getMin = peek.'],
              code: ap(155, 2),
              hook: 'Saath me minStack.',
            }),
          ],
        },
        {
          title: 'Part 1 — Stack vs Queue clues',
          blocks: [
            { table: { head: ['Clue', 'Data structure'], rows: [
              ['Last inserted first removed', 'Stack'],
              ['First inserted first removed', 'Queue'],
              ['Nested brackets', 'Stack'],
              ['BFS / level order', 'Queue'],
              ['Undo operation', 'Stack'],
              ['Task scheduling (order me)', 'Queue'],
              ['Recursion simulation', 'Stack'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Normal stack vs Monotonic stack clues',
          blocks: [
            { table: { head: ['Clue', 'Pattern'], rows: [
              ['Reverse order', 'Normal stack'],
              ['Matching brackets', 'Normal stack'],
              ['Next greater / next smaller', 'Monotonic stack'],
              ['Previous greater / previous smaller', 'Monotonic stack'],
              ['Nearest larger / smaller', 'Monotonic stack'],
              ['Waiting for a greater value', 'Monotonic stack'],
              ['Histogram', 'Monotonic stack'],
              ['Remove elements by comparison', 'Monotonic stack'],
            ] } },
          ],
        },
        {
          title: 'Part 3 — 20 identification questions',
          blocks: [
            { table: { head: ['#', 'Problem (description)', 'Pattern'], rows: [
              ['1', 'Valid brackets', 'Stack'],
              ['2', 'Undo feature', 'Stack'],
              ['3', 'Reverse a string', 'Stack'],
              ['4', 'Next greater element', 'Monotonic stack'],
              ['5', 'Next smaller element', 'Monotonic stack'],
              ['6', 'Next warmer day', 'Monotonic stack'],
              ['7', 'Histogram largest rectangle', 'Monotonic stack'],
              ['8', 'BFS traversal', 'Queue'],
              ['9', 'FIFO processing', 'Queue'],
              ['10', 'Stack using queue', 'Simulation'],
              ['11', 'Queue using stacks', 'Simulation'],
              ['12', 'Current minimum in a stack', 'Auxiliary stack'],
              ['13', 'Sliding window maximum', 'Monotonic deque'],
              ['14', 'Cycle in a linked list', 'Fast &amp; slow'],
              ['15', 'Middle of a linked list', 'Fast &amp; slow'],
              ['16', 'Merge sorted lists', 'Dummy node'],
              ['17', 'Longest substring without repetition', 'Sliding window'],
              ['18', 'Two Sum', 'HashMap'],
              ['19', 'Range sum queries', 'Prefix sum'],
              ['20', 'Container with most water', 'Two pointers'],
            ] } },
            { p: 'Pehle answer column dhak ke khud bolo — phir neeche self-check kholo.' },
            { qa: [
              ['"Har din ke liye batao kitne din baad bada value aayega" — pattern?', 'Monotonic stack (waiting / distance) — indices.'],
              ['"Har k-size window ka maximum" — pattern?', 'Monotonic deque (sliding window maximum) — brute O(nk), deque O(n).'],
              ['"Browser back button" — DS?', 'Stack.'],
              ['"Printer jobs order me" — DS?', 'Queue.'],
              ['"Array me do numbers jinka sum target" — pattern?', 'HashMap (unsorted) / two pointers (sorted).'],
            ] },
          ],
        },
        {
          title: 'Part 4 — Exercises: clue → DS → why → brute → optimal → complexity',
          blocks: [
            { table: { head: ['Exercise', 'Clue', 'DS', 'Brute', 'Optimal'], rows: [
              ['1. Next larger element on the right', '"next larger", right side', 'Monotonic (decreasing) stack', 'Nested loops O(n²)', 'Stack O(n)'],
              ['2. Max of every window of size k', '"window", "maximum"', 'Monotonic deque', 'Har window scan O(nk)', 'Deque O(n)'],
              ['3. Nested brackets valid?', '"nested", "matching"', 'Stack', '—', 'Stack O(n)'],
            ] } },
            { p: '<b>Exercise 1 — template (next greater, indices):</b>' },
            { code: J_NGE },
            { lines: [
              ['Arrays.fill(result, -1);', 'Default: koi bada nahi.'],
              ['while (!stack.isEmpty() && arr[i] > arr[stack.peek()])', 'Clue "next larger" → decreasing stack, pop on greater.'],
              ['result[stack.pop()] = arr[i];', 'Jisne pop karwaya wahi answer.'],
              ['stack.push(i);', 'Indices — duplicates/distance safe.'],
            ] },
            { p: '<b>Bonus template — previous smaller (LC 84 ka PSE):</b>' },
            { code: J_PSE },
          ],
        },
        {
          title: 'Part 5 — Visualize: template ko asli problem pe chalao',
          blocks: [
            { list: ['LC 496 pe wahi "next greater" template — stack un-resolved values.', 'Compare: LC 739 me same pop condition, answer distance.'] },
            { viz: 496, ex: 0 },
            { viz: 739, ex: 2 },
          ],
        },
        {
          title: 'Part 6 — Pattern Journal (Week 5 se maintain)',
          blocks: [
            JOURNAL,
            { pre: JOURNAL_TEMPLATE },
            { tip: 'Aaj ka kaam: Part 3 ke <b>saare 20</b> ke liye journal row — clue, brute, optimal, complexity, common mistake. Re-solve dates follow karo (+1 / +3 / +7 / +14).' },
          ],
        },
        {
          title: 'Part 7 — Complexity cheat sheet',
          blocks: [
            { table: { head: ['Pattern', 'Typical brute', 'Optimal'], rows: [
              ['Monotonic stack (next/prev greater/smaller)', 'O(n²)', 'O(n) time, O(n) space'],
              ['Monotonic deque (window max)', 'O(nk)', 'O(n)'],
              ['Stack matching', '—', 'O(n) / O(n)'],
              ['Queue (BFS)', '—', 'O(V + E)'],
              ['Auxiliary stack (min)', 'getMin O(n)', 'O(1) per op'],
              ['Simulation (stack via queue)', '—', 'push O(n), pop O(1)'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Monotonic stack kab sochna chahiye?', 'next/previous greater/smaller, nearest larger, waiting, histogram — aur brute nested loop ho.'],
              ['Normal stack kab kaafi?', 'Matching, reverse, undo, recursion simulation.'],
              ['Queue kab?', 'FIFO processing, BFS, scheduling.'],
              ['Increasing ya decreasing stack — kaise decide?', 'Greater dhundh rahe ho → decreasing (bade aane pe chhote pop). Smaller → increasing.'],
              ['Values ya indices?', 'Distance / width / duplicates → indices.'],
              ['Sliding window max me deque kyun, stack kyun nahi?', 'Window ke bahar gaya element front se hatana padta hai — dono ends chahiye.'],
              ['Linked list "middle" ka pattern?', 'Fast &amp; slow.'],
              ['Two Sum sorted array me?', 'Two pointers (LC 167).'],
            ] },
          ],
        },
        {
          title: 'Part 9 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['How do you pick a data structure?', 'I start from the access pattern in the problem statement. If the most recent item is used first, like undo or matching brackets, I use a stack. If items are processed in arrival order, like BFS or scheduling, I use a queue. If each element needs its nearest greater or smaller neighbour, I use a monotonic stack, and for window maximums a monotonic deque.'],
              ['Monotonic stack recognition', 'The signal is a question about the next or previous element that is greater or smaller, a waiting time, or how far a bar can extend. The brute force is a nested scan, and the stack keeps the elements still waiting for their answer in sorted order, which gives O(n).'],
              ['Why keep a pattern journal?', 'It records the clue I missed and the mistake I made, like a wrong pop condition or storing values instead of indices, and schedules re-solves after one, three, seven and fourteen days, so the pattern becomes automatic for unseen variations.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Sohvi session',
          blocks: [
            { olist: ['Saare 20 identify karo (answer column dhak ke).', '10 verbally explain: clue kya tha, pattern kyun.', 'Revise: LC 20, LC 232, LC 225 (ek-ek dry run).'] },
          ],
        },
        {
          title: 'Part 11 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Pattern Journal me saare 20 — clue, brute, optimal, complexity, common mistake.',
              '<b>Task B:</b> NGE aur PSE templates memory se (Part 4).',
              '<b>Task C:</b> 3 exercises bolke (clue → complexity).',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 12 — Homework',
          blocks: [
            { list: ['<b>Dono:</b> Pattern Journal 20 minute.', '<b>Dono:</b> 10 aur problems (kisi bhi list se, sirf statement) classify — bina coding.', 'Kal (Day 55, Saturday): Revision — LC 496, 739, 84, 155 (+ Sohvi 20, 232, 225).'] },
          ],
        },
        {
          title: 'Part 13 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['"Next warmer day"?', 'Monotonic stack.'],
              ['"Level order traversal"?', 'Queue.'],
              ['"Current minimum in stack"?', 'Auxiliary stack.'],
              ['"Merge sorted lists"?', 'Dummy node.'],
              ['"Range sum queries"?', 'Prefix sum.'],
            ] },
          ],
        },
      ],
      checks: [
        'Stack vs Queue clues table bina dekhe',
        'Normal vs monotonic clues samjhe',
        '20 identification questions — 18+ sahi',
        '3 exercises clue → complexity bol sakta/sakti hu',
        'NGE + PSE templates likh sakta/sakti hu',
        'Pattern Journal me 20 entries',
      ],
      memory: 'Recent pehle = stack, order me = queue, nearest bada/chhota = monotonic stack, window max = deque.',
    },

    // =====================================================================
    // DAY 55 (Saturday)
    13: {
      title: 'Stack & Queue Revision — 496, 739, 84, 155 (+ Sohvi 20, 232, 225)',
      goal: '<b>Tum:</b> LC 496, 739, 84, 155 re-solve (bina notes, timer). <b>Sohvi:</b> LC 20 independently, LC 232 + LC 225 simulation dry run. Pattern sheet + revision test (10) + Pattern Journal.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan',
          blocks: [
            { p: RULE },
            session('Pattern sheet (Part 1) zubaani', '496 → 739 → 84 → 155 re-solve', 'Visualizer se check', 'LC 84 paper pe pehle', 'Tum: 4 problems · Sohvi: 20 + 232/225', 'Revision test + Journal'),
            { list: ['Rule 1: pehle paper (stack state har index pe), phir code.', 'Rule 2: LC 84 me koi forced cutoff nahi — 30–40 min.', 'Rule 3: atke toh sirf Memory hook.'] },
          ],
        },
        {
          title: 'Part 1 — Pattern sheet',
          blocks: [
            { table: { head: ['Problem', 'Pattern', 'Stack stores'], rows: [
              ['LC 496', 'Next greater', 'Values + HashMap'],
              ['LC 739', 'Next greater distance', 'Indices'],
              ['LC 84', 'Previous + next smaller', 'Indices'],
              ['Circular next greater (pattern)', 'Next greater, array do baar ghumao', 'Indices'],
              ['Stock span (pattern)', 'Previous greater', 'Prices ya indices'],
              ['LC 155', 'Track minimum', 'Auxiliary stack'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Re-solve: LC 496 (15 min)',
          blocks: [
            { p: 'Brute → monotonic → HashMap → implement → edge cases (no greater, last element, single).' },
            { pre: '[4,1,2] / [1,3,4,2] → map {1=3, 3=4, 4=−1, 2=−1} → [-1,3,-1]' },
            { code: ap(496, 1) },
            { tip: 'Memory hook: jo pop karwaye wahi answer.' },
            { viz: 496, ex: 0 },
          ],
        },
        {
          title: 'Part 3 — Re-solve: LC 739 (20 min)',
          blocks: [
            { p: 'Waiting pattern, indices kyun, current din purane ko kyun resolve karta hai, amortized O(n).' },
            { pre: 'i=5 (72) resolves 4 (1) aur 3 (2) · i=6 (76) resolves 5 (1) aur 2 (4)' },
            { code: ap(739, 2) },
            { tip: 'Memory hook: distance → indices; bache = 0.' },
            { viz: 739, ex: 0 },
          ],
        },
        {
          title: 'Part 4 — Re-solve: LC 84 (paper first, 30–40 min)',
          blocks: [
            { p: 'Pehle paper pe [2, 1, 5, 6, 2, 3]: har bar ka PSE, NSE, width, area. Phir implement.' },
            { table: { head: ['Index', 'Height', 'PSE', 'NSE', 'Width', 'Area'], rows: [
              ['0', '2', '−1', '1', '1', '2'], ['1', '1', '−1', '6', '6', '6'], ['2', '5', '1', '4', '2', '10'],
              ['3', '6', '2', '4', '1', '6'], ['4', '2', '1', '6', '4', '8'], ['5', '3', '4', '6', '1', '3'],
            ] } },
            { code: ap(84, 1) },
            { code: ap(84, 2) },
            { tip: 'Memory hook: NSE pe pop, naya top = PSE, sentinel 0 push nahi.' },
            { viz: 84, ex: 0, variant: 2 },
          ],
        },
        {
          title: 'Part 5 — Re-solve: LC 155 (15 min)',
          blocks: [
            { p: 'Test: push 5, push 3, push 3, push 7, getMin, pop, getMin, pop, getMin.' },
            { table: { head: ['Op', 'stack (top first)', 'minStack (top first)', 'Return'], rows: [
              ['push 5', '5', '5', ''], ['push 3', '3, 5', '3, 5', ''], ['push 3', '3, 3, 5', '3, 3, 5', ''], ['push 7', '7, 3, 3, 5', '3, 3, 5', ''],
              ['getMin', '', '', '3'], ['pop (7)', '3, 3, 5', '3, 3, 5', ''], ['getMin', '', '', '3'], ['pop (3)', '3, 5', '3, 5', ''], ['getMin', '', '', '<b>3</b> (duplicate ki wajah se)'],
            ] } },
            { code: ap(155, 2) },
            { tip: 'Memory hook: ≤ pe push, barabar pe pop.' },
          ],
        },
        {
          title: 'Part 6 — Revision test (10)',
          blocks: [
            { qa: [
              ['Increasing vs decreasing stack?', 'Increasing: naye se bade pop (smaller problems). Decreasing: naye se chhote pop (greater problems).'],
              ['NGE me stack kyun?', 'Un-resolved elements yaad rakhne ke liye; naya element unhe ulte order me resolve karta hai.'],
              ['Daily Temperatures me indices kyun?', 'Answer distance hai.'],
              ['PSE kya hai?', 'Left me nearest strictly smaller.'],
              ['NSE kya hai?', 'Right me nearest strictly smaller.'],
              ['Width i − previousSmaller − 1 kyun?', 'Bar PSE+1 se i−1 tak fail sakta hai.'],
              ['Min Stack O(1) kyun?', 'minStack ka top hamesha current min.'],
              ['Stack using queue possible kyun?', 'Rotation se newest ko front pe la sakte hain.'],
              ['Queue using stacks possible kyun?', 'Do baar ulta = seedha (in/out).'],
              ['Amortized O(n) ka matlab?', 'Poore run ka total kaam O(n) — har element ek push, max ek pop.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi: LC 20 + simulation (232 / 225)',
          blocks: [
            { problem: 20 },
            { pre: `LC 232 (two stacks): push 1, push 2, peek, pop
  in [1, 2] → peek: out khaali → transfer → out [2, 1] (top 1) → 1 → pop → 1

LC 225 (one queue): push 1, push 2, push 3, pop, top
  [1] → [2, 1] → [3, 2, 1] → pop 3 → [2, 1] → top 2` },
          ],
        },
        {
          title: 'Part 8 — Pattern Journal update',
          blocks: [
            JOURNAL,
            { pre: JOURNAL_TEMPLATE },
          ],
        },
        {
          title: 'Part 9 — 1-minute answers: aise bolo',
          blocks: [
            { say: [
              ['Next Greater Element I', 'A decreasing stack of unresolved nums2 values; a bigger number pops smaller ones and becomes their answer in a map; leftovers get minus one; nums1 answers are lookups. O(m plus n).'],
              ['Daily Temperatures', 'Same pattern with indices, because the answer is a distance: when today is warmer than the top day, pop it and store i minus that index. Amortized O(n).'],
              ['Largest Rectangle', 'Increasing stack of indices; when a smaller height arrives, the popped bar’s next smaller is i and its previous smaller is the new top, so its width is i minus previous minus one. A zero sentinel flushes the stack. O(n).'],
              ['Min Stack', 'An auxiliary stack of minimums, pushing on less than or equal and popping when the removed value equals its top. O(1) per operation.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Sohvi session',
          blocks: [
            { olist: ['LC 20 independently (15 min).', 'LC 232 + LC 225 dry run (Part 7) paper pe, phir bolke explain.', '3 stack/queue problems ka pattern bolo (Day 54 list se).'] },
          ],
        },
        {
          title: 'Part 11 — Sohel (Tum) session (SDE-2 practice) + System Design session',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 496 (15) → 739 (20) → 84 (30–40) → 155 (15) bina notes.',
              '<b>Task B:</b> Revision test (Part 6) zubaani.',
              '<b>Task C:</b> Journal me aaj ki galtiyan.',
              '<b>System Design session (1/week):</b> "Stock ticker / price alerts" — har naye price pe previous greater (stock span pattern) streaming me kaise; memory bound kaise rakhoge. 30 min whiteboard.',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 12 — Homework',
          blocks: [
            { list: ['<b>Sohvi:</b> LC 20 re-solve + 3 stack/queue problems explain.', '<b>Tum:</b> 496 / 739 / 84 / 155 bina notes + Journal.', 'Kal (Day 56, Sunday): Mock — Sohvi (theory + LC 20 + simulation), Tum (random 496 / 739 / 84 / 155).'] },
          ],
        },
        {
          title: 'Part 13 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[2, 4] histogram → ?', '4'],
              ['[30, 40, 50, 60] temps → ?', '[1, 1, 1, 0]'],
              ['[2, 4] / [1, 2, 3, 4] (LC 496) → ?', '[3, −1]'],
              ['Min stack: push 0, 1, 0, pop, getMin → ?', '0'],
              ['LC 84 me stack type?', 'Increasing.'],
            ] },
          ],
        },
      ],
      checks: [
        'Pattern sheet bina dekhe',
        'LC 496 re-solve',
        'LC 739 re-solve',
        'LC 84 paper (PSE / NSE table) + code',
        'LC 155 test sequence sahi',
        'Revision test 10/10',
        'Sohvi: LC 20 independently + 232 / 225 dry run',
      ],
      memory: '496 values + map, 739 indices + distance, 84 PSE + NSE + width, 155 auxiliary min.',
    },

    // =====================================================================
    // DAY 56 (Sunday)
    14: {
      title: 'Week 8 Mock Interview — Monotonic Stack Assessment + Contest',
      goal: 'Week 8 assessment. <b>Sohvi — 30–40 min</b> (theory, LC 20, simulation dry run). <b>Tum — 60–75 min</b>, random from LC 496 (E), 739 (M), 84 (H), 155 (M) — <b>8-step framework</b> mandatory. Scorecard /100 + LeetCode Weekly Contest.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Mock format + evaluation',
          blocks: [
            { table: { head: ['Kaun', 'Time', 'Kya'], rows: [
              ['Sohvi (Tum interviewer)', '30–40 min', 'A: theory 10 min · B: LC 20 (15–20 min) · C: simulation (LC 232 + LC 225)'],
              ['Tum (Sohvi interviewer)', '60–75 min', 'Random: LC 496, 739, 84, 155'],
              ['Dono', '30 min', 'Contest discussion (Sunday 8:00 AM IST)'],
            ] } },
            { p: '<b>Evaluation:</b> pattern recognition, brute thinking, optimal, pointer/index tracking, code, complexity, edge cases, communication.' },
          ],
        },
        {
          title: 'Part 1 — Sohvi mock (Mock Q1: LC 20)',
          blocks: [
            { list: ['<b>A (10 min):</b> LIFO? FIFO? stack operations? queue operations? stack vs queue?'] },
            { problem: 20 },
            { olist: ['Hint 1: "Jo bracket last me khula, woh kab band hoga?"', 'Hint 2: "Pending openings kahan rakhogi?"', 'Hint 3: "End me kya check?"'] },
            { pre: `C — Simulation dry run
LC 225 (stack via queue): push 1, push 2, push 3, pop, top   → pop 3, top 2
LC 232 (queue via stacks): enqueue 1, enqueue 2, dequeue, peek → dequeue 1, peek 2` },
            { table: { head: ['Rubric (Sohvi)', 'Kya dekhna hai', 'Score (1–4)'], rows: [
              ['Theory', 'LIFO / FIFO clearly', ''], ['Brute', 'Replace pairs idea', ''], ['Optimal', 'Stack + 3 conditions', ''],
              ['Code', 'LC 20 khud', ''], ['Test', '"([)]", "(((", ")))"', ''], ['Communication', 'Bolke socha', ''],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Tum mock (Mock Q2: LC 84 + random pool)',
          blocks: [
            { p: 'Main (din ka plan): <b>LC 84</b>. Phir random 1–2: LC 496, 739, 155.' },
            { problem: 84 },
            { table: { head: ['Question', 'Edge cases (mandatory)'], rows: [
              ['LC 496 (E)', 'No greater, first greater, last element, single element'],
              ['LC 739 (M)', 'Strictly increasing, strictly decreasing, equal temperatures, single day'],
              ['LC 84 (H)', 'Single bar, all equal, increasing, decreasing, zero heights, empty'],
              ['LC 155 (M)', 'Duplicate minimum, pop minimum, push new minimum, minimum restored'],
            ] } },
          ],
        },
        {
          title: 'Part 3 — Mandatory 8-step framework',
          blocks: [
            { olist: [
              '<b>Understand:</b> input, output, constraints, edge cases.',
              '<b>Brute force:</b> complexity + bottleneck.',
              '<b>Pattern:</b> stack kyun? monotonic kyun? indices kyun? auxiliary kyun?',
              '<b>Optimal:</b> coding se pehle explain.',
              '<b>Dry run:</b> input, stack, current index, pop condition, push condition, output.',
              '<b>Code.</b>',
              '<b>Complexity:</b> nested loops ke bawajood O(n) kyun.',
              '<b>Edge cases</b> (Part 2 table).',
            ] },
          ],
        },
        {
          title: 'Part 4 — Follow-ups (Sohvi poochegi)',
          blocks: [
            { qa: [
              ['496: getOrDefault vs leftover loop?', 'Dono sahi; leftover explicit hai.'],
              ['739: right → left kaise?', 'Stack = future candidates; ≤ pop; top − i.'],
              ['84: sentinel index push kyun nahi?', 'Asli bar nahi; heights[n] out of bounds.'],
              ['84: two arrays vs one pass?', 'Same O(n); one pass kam memory.'],
              ['155: single stack?', 'Pairs ya encoded diff (long).'],
              ['Monotonic stack O(n) proof?', 'Ek push, max ek pop har element.'],
            ] },
          ],
        },
        {
          title: 'Part 5 — Scorecard (/100)',
          blocks: [
            { table: { head: ['Area', 'Max', 'Score'], rows: [
              ['Pattern recognition', '20', ''], ['Brute force', '10', ''], ['Optimal approach', '20', ''], ['Implementation', '20', ''],
              ['Complexity', '10', ''], ['Edge cases', '10', ''], ['Communication', '10', ''], ['<b>Total</b>', '<b>100</b>', ''],
            ] } },
            { table: { head: ['Score', 'Matlab'], rows: [
              ['90+', 'Strong'], ['75–89', 'Weak areas revise'], ['60–74', 'Aur implementation practice'], ['&lt; 60', 'Specific days repeat'],
            ] } },
            { tip: 'Ye sirf internal benchmark hai — company ka hiring score nahi.' },
          ],
        },
        {
          title: 'Part 6 — LeetCode Weekly Contest plan + discussion template',
          blocks: [
            { list: ['Sunday 8:00 AM IST — dono join (90 min). Target: Q1 + Q2.', 'Har solved question ka pattern naam do (Day 54 list).', 'Jo nahi hua: editorial, kal 20 min upsolve.'] },
            { table: { head: ['Question', 'Pattern', 'Time liya', 'Galti', 'Seekh'], rows: [['Q1', '', '', '', ''], ['Q2', '', '', '', ''], ['Q3', '', '', '', '']] } },
          ],
        },
        {
          title: 'Part 7 — Aise bolo',
          blocks: [
            { say: [
              ['Mock opening (LC 84)', 'Let me restate: I get bar heights of width one and need the largest rectangle area. Can heights be zero, and can the array be empty? I will start with a brute force that expands around every bar, then look for the bottleneck.'],
              ['Mock closing', 'The one-pass solution is O(n) time and O(n) space, because each index is pushed and popped once even though there is a nested while loop. I tested a single bar, equal heights, increasing and decreasing heights, and zero heights.'],
              ['Monotonic stack in one minute', 'It keeps elements in sorted order by popping those that would break the order; the element causing a pop is the popped element’s next greater or smaller. Each element is pushed and popped at most once, so it turns O(n squared) scans into O(n).'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohvi session',
          blocks: [
            { olist: ['Mock me bolke socho.', 'Interviewer ban ke Tum se LC 84 + 1 random poocho; Part 3 framework follow karwao.', 'Contest Q1 try (30 min).'] },
          ],
        },
        {
          title: 'Part 9 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: ['<b>Task A:</b> LC 84 + 1–2 random, 8-step framework, 60–75 min.', '<b>Task B:</b> Scorecard khud bharo; 75 se kam area → kal 30 min.', '<b>Task C:</b> Contest Q1–Q3; Q3 upsolve kal.', SQL] },
          ],
        },
        {
          title: 'Part 10 — Outcome after 8 weeks',
          blocks: [
            { table: { head: ['Sohvi', 'Tum'], rows: [
              ['Arrays basics, HashMap / HashSet', 'Arrays + hashing, prefix sum + HashMap'],
              ['Prefix basics, two pointers basics', 'Two pointers (dono directions)'],
              ['Fixed + basic variable window', 'Sliding window fixed + variable'],
              ['Linked list node, traversal, reversal, middle', 'Linked list pointers, fast &amp; slow, dummy node'],
              ['Stack push / pop / matching', 'Stack implementation + problems'],
              ['Queue FIFO + implementation concepts', 'Queue implementation + simulation'],
              ['Beginner pattern recognition', 'Monotonic stack (NGE, NSE, waiting), histogram PSE / NSE + width'],
              ['~25–30 LeetCode attempts — goal: understanding + independent Easy', '~50–60 quality LeetCode problems'],
            ] } },
            { tip: '<b>Real benchmark:</b> pattern pehchano, solution derive karo, sahi implement karo, trade-offs explain karo, aur <b>unseen variations</b> solve karo — sirf count nahi.' },
          ],
        },
        {
          title: 'Part 11 — Homework + self-test',
          blocks: [
            { list: ['Scorecard ke weakest area ko kal 30 min.', 'Pattern Journal ke re-solve dates follow karo.', 'Agla phase: Binary Search (Weeks 9–10).'] },
            { qa: [
              ['8-step framework ka step 3?', 'Pattern — stack / monotonic / indices / auxiliary kyun.'],
              ['LC 739 equal temps → ?', '0 (strictly warmer chahiye).'],
              ['LC 84 [5, 4, 3, 2, 1] → ?', '9'],
              ['LC 496 last element ka answer?', '−1'],
              ['LC 155 min restored kaise?', 'removed == minStack top → minStack.pop.'],
            ] },
          ],
        },
      ],
      checks: [
        'Sohvi: theory + LC 20 + simulation dry run (rubric bhara)',
        'Tum: LC 84 + random, 8-step framework',
        'Har question ke mandatory edge cases bole',
        'Scorecard /100 bhara',
        'Weekly Contest attempt + discussion table',
        '8-week outcome checklist dekhi',
      ],
      memory: 'Understand → brute → pattern → optimal → dry run → code → complexity → edge cases.',
    },
  });
})();
