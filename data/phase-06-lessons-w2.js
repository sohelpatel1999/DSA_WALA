// Phase 6 (Binary Search) — Week 2 lessons (local days 8..14). Format = Phase 1 Day 1 lesson.
(function () {
  const P = window.PHASE_CONTENT['binary-search'];
  P.lessons = P.lessons || {};

  const rev = (title, line, ex, pattern, steps, code, hook) => [
    { h: title },
    { p: line },
    { pre: ex },
    { p: '<b>Pattern:</b> ' + pattern },
    { olist: steps },
    { code },
    { tip: '<b>Memory hook:</b> ' + hook },
  ];
  const SQL = '<b>Extra (SDE-2): 2 SQL questions</b> — LeetCode Database section se (aaj: 1 window function + 1 subquery), 20 min timer.';
  const SD = '<b>System Design session (1/week):</b> 45 min — requirements → APIs → data model → high-level diagram → bottlenecks.';

  const ANSWER_TEMPLATE = `int lo = minPossible, hi = maxPossible;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (feasible(mid)) hi = mid;   // chalta hai → aur chhota try
    else lo = mid + 1;             // nahi chalta → bada chahiye
}
return lo;`;

  Object.assign(P.lessons, {
    // =====================================================================
    8: {
      title: 'Binary Search on Answer — Koko',
      goal: '"<b>Minimum X such that ...</b>" wale problems pehchanna, <b>answer range</b> [lo, hi] decide karna, <b>feasibility check</b> likhna, aur LC 875 ko O(n log max) me solve karna.',
      main: 875,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rev('LC 33 — Search in Rotated Sorted Array (Week 1)',
              'Rotated sorted array me target ka index.',
              '[4,5,6,7,0,1,2], t=0\nmid 7: left [4..7] sorted, 0 nahi → lo=4\nmid 1: left [0..1] sorted, 0 hai → hi=4 → mid 0 ✓ 4',
              'Rotated array — sorted half check',
              ['mid == target → return.', 'nums[lo] ≤ nums[mid] → left sorted, range check.', 'Warna right sorted, range check.'],
              `if (nums[lo] <= nums[mid]) {
    if (target >= nums[lo] && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
} else {
    if (target > nums[mid] && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
}`,
              'Sorted half pe bharosa karo.'),
            ...rev('LC 3 — Longest Substring Without Repeating Characters',
              'Bina repeat wala sabse lamba substring.',
              '"abcabcbb" → "abc" → 3',
              'Variable sliding window + last-seen map',
              ['r aage, char ka last index dekho.', 'Repeat window ke andar → l = last + 1.', 'best = max(best, r − l + 1).'],
              `int[] last = new int[128]; Arrays.fill(last, -1);
int l = 0, best = 0;
for (int r = 0; r < s.length(); r++) {
    l = Math.max(l, last[s.charAt(r)] + 1);
    last[s.charAt(r)] = r;
    best = Math.max(best, r - l + 1);
}`,
              'Repeat dikha → left wall uske aage kudao.'),
            ...rev('LC 84 — Largest Rectangle in Histogram',
              'Histogram me sabse bada rectangle.',
              '[2,1,5,6,2,3] → 5,6 ka rectangle height 5 × width 2 = 10',
              'Monotonic increasing stack',
              ['Stack me badhte heights ke index.', 'Chhota bar aaya → pop, popped bar ki height × width.', 'End me sentinel 0.'],
              `Deque<Integer> st = new ArrayDeque<>(); int best = 0;
for (int i = 0; i <= h.length; i++) {
    int cur = i == h.length ? 0 : h[i];
    while (!st.isEmpty() && cur < h[st.peek()]) {
        int ht = h[st.pop()], left = st.isEmpty() ? -1 : st.peek();
        best = Math.max(best, ht * (i - left - 1));
    }
    st.push(i);
}`,
              'Chhota bar = pichle bade bars ka hisaab.'),
          ],
        },
        {
          title: 'Part 1 — Concept: Binary Search on Answer',
          blocks: [
            { p: 'Kuch problems array me index nahi, <b>ek value</b> maangte hain: minimum speed, minimum capacity, minimum largest sum. Agar:' },
            { olist: [
              'Answer ek <b>range</b> me hai (lo = sabse chhota possible, hi = sabse bada zaroori).',
              'Kisi guess ko <b>jaldi check</b> kar sakte ho (usually greedy O(n)).',
              'Check <b>monotonic</b> hai: X chalta hai → X+1 bhi chalega.',
            ] },
            { p: '...toh answer range pe <b>lower bound</b> (pehla feasible) binary search karo.' },
            { pre: 'Koko: piles = [3,6,7,11], h = 8\nspeed k :  1   2   3   4   5   6  ...  11\nhours   : 27  15  10   8   8   6  ...   4\nok(≤8)? :  F   F   F   T   T   T  ...   T\n                       ^ pehla T = 4 = answer' },
            { code: ANSWER_TEMPLATE },
            { table: { head: ['Question', 'Answer = ?', 'lo', 'hi', 'feasible(mid)'], rows: [
              ['LC 875 Koko', 'speed k', '1', 'max(piles)', 'Σ ceil(p/k) ≤ h'],
              ['LC 1011 Ship', 'capacity', 'max(w)', 'sum(w)', 'greedy days ≤ D'],
              ['LC 410 Split', 'largest sum', 'max(nums)', 'sum(nums)', 'greedy parts ≤ k'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 875 Koko Eating Bananas',
          blocks: [{ problem: 875 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute:</b> k = 1, 2, 3 … har k pe hours gino; pehla k jisme hours ≤ h. Worst case k = max(piles) = 10⁹ → TLE.' },
            { p: '<b>Observation:</b> k badhao toh hours kabhi badhte nahi (monotonic). Aur k &gt; max(piles) ka koi fayda nahi (har pile already 1 ghante me).' },
            { olist: [
              'lo = 1, hi = max(piles).',
              'canFinish(k): hours = Σ ceil(p / k). ceil = <code>(p − 1) / k + 1</code> (overflow-safe).',
              'canFinish(mid) → hi = mid (shayad aur chhota chale).',
              'Warna lo = mid + 1.',
              'lo == hi → minimum speed.',
            ] },
            { tip: 'hours ko <b>long</b> me rakho: 10⁴ piles × 10⁹ ghante (k = 1 pe) = 10¹³ — int overflow.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: piles = [3, 6, 7, 11], h = 8',
          blocks: [
            { table: { head: ['lo', 'hi', 'mid (k)', 'ceil per pile', 'hours', '≤ 8?', 'Update'], rows: [
              ['1', '11', '6', '1, 1, 2, 2', '6', 'Yes', 'hi = 6'],
              ['1', '6', '3', '1, 2, 3, 4', '10', 'No', 'lo = 4'],
              ['4', '6', '5', '1, 2, 2, 3', '8', 'Yes', 'hi = 5'],
              ['4', '5', '4', '1, 2, 2, 3', '8', 'Yes', 'hi = 4'],
              ['4', '4', '—', '—', '—', '—', '<b>return 4</b>'],
            ] } },
            { p: '<b>Example 3</b> ([30,11,23,4,20], h = 6): mid 15 → 8h ✗ lo=16; mid 23 → 6h ✓ hi=23; mid 19 → 8h ✗ lo=20; mid 21 → 7h ✗ lo=22; mid 22 → 7h ✗ lo=23 → <b>23</b>.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' },
            { code: `class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int k = 1;
        while (true) {
            long hours = 0;
            for (int p : piles) hours += (p - 1) / k + 1;
            if (hours <= h) return k;
            k++;
        }
    }
}` },
            { p: '<b>Optimal</b>' },
            { code: `class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int lo = 1, hi = 0;
        for (int p : piles) hi = Math.max(hi, p);
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (canFinish(piles, h, mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    private boolean canFinish(int[] piles, int h, int k) {
        long hours = 0;
        for (int p : piles) {
            hours += (p - 1) / k + 1;
        }
        return hours <= h;
    }
}` },
            { lines: [
              ['int lo = 1, hi = 0;', 'Speed 0 nahi ho sakti → lo = 1.'],
              ['hi = Math.max(hi, p);', 'hi = max pile: isse tez speed se hours aur kam nahi hote.'],
              ['if (canFinish(piles, h, mid)) hi = mid;', 'mid chalta hai → mid candidate, left me aur chhota dhundo.'],
              ['else lo = mid + 1;', 'mid slow hai → mid aur kam sab reject.'],
              ['hours += (p - 1) / k + 1;', 'ceil(p / k) bina double ke, bina overflow ke.'],
              ['return hours <= h;', 'Guards aane se pehle khatam?'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize: code line-by-line chalao',
          blocks: [
            { list: [
              'Upar <b>speed k candidate values</b> array — grey = phenka hua range.',
              'canFinish ke andar CALL STACK me 2 frames dikhte hain (canFinish upar, minEatingSpeed neeche).',
              'Har pile pe ceil ghante add hote dekho; text box me running hours.',
              'Example 2 (h = n) chalao — har mid fail hota hai, answer = max pile.',
            ] },
            { viz: 875, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[1], h=1</code>', '1', 'lo == hi == 1'],
              ['<code>[30,11,23,4,20], h=5</code>', '30', 'h == n → max pile'],
              ['<code>[1000000000], h=2</code>', '500000000', 'Bada pile — hours long'],
              ['<code>[312884470], h=968709470</code>', '1', 'h &gt; pile → speed 1 kaafi'],
              ['<code>[10⁹, 10⁹], h=10⁹</code>', '2', '(p + k − 1) / k likha toh overflow risk'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute (k = 1, 2, …)', 'O(n · max)', 'O(1)'],
              ['Binary search on k', 'O(n log max)', 'O(1)'],
            ] } },
            { p: 'max = 10⁹ → log ≈ 30 → ~30 × 10⁴ = 3·10⁵ operations.' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['"Binary search on answer" ka signal?', '"Minimum/maximum X such that…" + X ko check karna easy + monotonic.'],
              ['hi = max(piles) kyun, sum kyun nahi?', 'k ≥ max pe hours = n (minimum possible). Usse aage koi fayda nahi.'],
              ['lo = 1 kyun?', 'Speed 0 se kuch nahi khaa sakti; minimum valid integer 1.'],
              ['Monotonic kyun hai?', 'k badha → har pile ka ceil(p/k) ghata ya same → total hours non-increasing.'],
              ['ceil(p/k) without double?', '<code>(p − 1) / k + 1</code> (p ≥ 1).'],
              ['hours long kyun?', 'k = 1 pe Σ p = 10⁴ × 10⁹ = 10¹³.'],
              ['hi = mid kyun, mid − 1 kyun nahi?', 'mid feasible hai, woh khud answer ho sakta hai.'],
              ['Complexity?', 'O(n log max(piles)), O(1) space.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'Trying every speed from 1 upward is too slow because the largest pile can be 10^9. The key observation is monotonicity: if Koko can finish at speed k, she can finish at any faster speed. So I binary search over speeds between 1 and the largest pile. For a candidate speed I sum the ceiling of pile divided by speed, using a long and the formula (p − 1) / k + 1 to avoid overflow. If the total fits within h, I try a smaller speed by setting hi = mid; otherwise lo = mid + 1. This is O(n log max) time and O(1) space.'],
              ['Follow-up: "Agar maximum speed ho toh (minimize ki jagah maximize)?"', 'The template mirrors: I look for the last value where the condition holds. I can either keep an answer variable and move lo = mid + 1 when feasible, or use an upper middle with lo = mid. The key is still that the condition flips exactly once across the range.'],
              ['1-minute: Binary search on answer recipe', 'First, define what the answer is and its range: the smallest and largest possible values. Second, write a feasibility check for a guess, usually a greedy linear pass. Third, confirm it is monotonic. Then run a lower-bound binary search over the range. The total cost is the check cost times log of the range.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'piles = [3,6,7,11], h = 8 — speed 1 se 11 tak hours ki table paper pe banao (Part 1 jaisi). Pehla T circle karo.',
              'canFinish function akela likho aur speed 4 pe test karo.',
              'Brute code submit (chhote inputs pe chalega, bade pe TLE — dekh lo).',
              'Optimal dekh ke samjho, phir bina dekhe likhne ki koshish.',
              'Visualizer me Example 1 aur 3.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 875 memory se 12 min. Submit.',
              '<b>Task B:</b> Edge input <code>[1000000000, 1000000000], h = 1000000000</code> pe <code>(p + k − 1) / k</code> wala version kyun risky hai — explain karo.',
              '<b>Task C:</b> Recipe (Part 10 last answer) 60 sec me bolo.',
              '<b>Task D:</b> LC 33 + LC 153 re-solve 15 min me.',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 875 Accepted.',
              'Kal (Day 9): LC 1011 — capacity pe binary search. Socho: lo aur hi kya honge?',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Koko ka search space?', 'Speed [1, max(piles)].'],
              ['canFinish ka formula?', 'Σ ((p − 1) / k + 1) ≤ h.'],
              ['Feasible pe update?', 'hi = mid.'],
              ['piles [4, 4], h = 4 → answer?', '2 (2 + 2 = 4 ghante).'],
              ['Complexity?', 'O(n log max).'],
            ] },
          ],
        },
      ],
      checks: [
        'Binary search on answer ke 3 conditions bata sakta/sakti hu',
        'Koko ka lo / hi kyun — samjha',
        'canFinish overflow-safe likha',
        'LC 875 Accepted',
        'Dry run table match kiya',
        'Visualizer me CALL STACK (2 frames) dekha',
        '8 interview sawaal',
        'Self-test 5/5',
      ],
      memory: 'Minimum X such that... → X ki range pe lower bound. Feasible → hi = mid, warna lo = mid + 1.',
    },

    // =====================================================================
    9: {
      title: 'Binary Search on Answer — Ship Within D Days',
      goal: 'Same template, naya problem: capacity ki range <b>[max(w), sum(w)]</b>, aur <b>greedy din count</b> as feasibility check. LC 1011 solve karna aur greedy kyun sahi hai — samjhana.',
      main: 1011,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rev('LC 875 — Koko Eating Bananas (kal)',
              'Minimum speed k jisse h ghante me sab bananas.',
              '[3,6,7,11], h=8 → [1,11]: k6 ✓ k3 ✗ k5 ✓ k4 ✓ → 4',
              'Binary search on answer',
              ['lo = 1, hi = max.', 'canFinish = Σ ceil(p/k) ≤ h.', 'Feasible → hi = mid, warna lo = mid + 1.'],
              `while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (canFinish(piles, h, mid)) hi = mid;
    else lo = mid + 1;
}
return lo;`,
              'Guess karo, check karo, aadha phenko.'),
            ...rev('LC 876 — Middle of the Linked List',
              'Middle node (do ho toh doosra).',
              '1→2→3→4→5→6: slow 4 pe → [4,5,6]',
              'Fast & slow',
              ['slow +1, fast +2.', 'fast null / fast.next null → stop.'],
              `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
return slow;`,
              'Do guna speed → aadhi doori.'),
            ...rev('LC 15 — 3Sum',
              'Saare unique triplets jinka sum 0.',
              '[-1,0,1,2,-1,-4] → sort [-4,-1,-1,0,1,2] → [[-1,-1,2],[-1,0,1]]',
              'Sort + two pointers',
              ['Sort.', 'Har i (duplicate skip) ke liye l = i+1, r = n−1.', 'Sum chhota → l++, bada → r−−, match → add + duplicates skip.'],
              `Arrays.sort(nums);
for (int i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    int l = i + 1, r = n - 1;
    while (l < r) { /* two sum on sorted */ }
}`,
              'Ek fix karo, baaki do ko two pointers pe chhodo.'),
          ],
        },
        {
          title: 'Part 1 — Concept: range aur greedy check',
          blocks: [
            { p: '<b>Capacity ki range:</b>' },
            { list: [
              '<b>lo = max(weights)</b> — sabse bhaari package bhi ek din me jaana chahiye; capacity usse kam toh impossible.',
              '<b>hi = sum(weights)</b> — ek hi din me sab chala jaaye. Usse zyada capacity bekaar.',
            ] },
            { p: '<b>Greedy check daysNeeded(cap):</b> packages order me load karo; agar agla package capacity cross kare toh naya din.' },
            { pre: 'weights = [1,2,3,4,5,6,7,8,9,10], cap = 15\nDay 1: 1+2+3+4+5 = 15\nDay 2: 6+7       = 13   (+8 = 21 > 15)\nDay 3: 8\nDay 4: 9\nDay 5: 10          → 5 din ✓ (days = 5)\n\ncap = 14 → [1..4] [5,6] [7] [8] [9] [10] → 6 din ✗' },
            { tip: '<b>Greedy kyun sahi?</b> Order fix hai. Har din jitna ho sake utna load karna kabhi nuksaan nahi karta — baaki packages ke liye kam ya barabar kaam bachta hai. Toh greedy count = us capacity ka minimum days.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 1011 Capacity To Ship Packages Within D Days',
          blocks: [{ problem: 1011 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute:</b> cap = max(w) se 1-1 badhao, har cap pe greedy days gino. O(n · (sum − max)) — sum 2.5·10⁷ tak → TLE.' },
            { p: '<b>Optimal:</b> capacity badhao toh days kabhi badhte nahi → monotonic → binary search.' },
            { olist: [
              'Ek loop me lo = max, hi = sum.',
              'mid = capacity guess; daysNeeded(mid) greedy O(n).',
              '≤ days → hi = mid, warna lo = mid + 1.',
              'Return lo.',
            ] },
            { p: 'Koko se fark sirf <b>range</b> aur <b>check function</b> ka hai — template same.' },
          ],
        },
        {
          title: 'Part 4 — Dry run',
          blocks: [
            { p: '<b>weights = [1..10], days = 5</b> → expected 15' },
            { table: { head: ['lo', 'hi', 'mid', 'Greedy groups', 'days', '≤ 5?', 'Update'], rows: [
              ['10', '55', '32', '[1..7] [8,9,10]', '2', 'Yes', 'hi = 32'],
              ['10', '32', '21', '[1..6] [7,8] [9,10]', '3', 'Yes', 'hi = 21'],
              ['10', '21', '15', '[1..5] [6,7] [8] [9] [10]', '5', 'Yes', 'hi = 15'],
              ['10', '15', '12', '[1..4] [5,6] [7] [8] [9] [10]', '6', 'No', 'lo = 13'],
              ['13', '15', '14', '[1..4] [5,6] [7] [8] [9] [10]', '6', 'No', 'lo = 15'],
              ['15', '15', '—', '', '', '', '<b>return 15</b>'],
            ] } },
            { p: '<b>[3,2,2,4,1,4], days = 3</b>: [4,16] → mid 10 (2d ✓) hi=10; mid 7 (3d ✓) hi=7; mid 5 (4d ✗) lo=6; mid 6 (3d ✓) hi=6 → <b>6</b>.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' },
            { code: `class Solution {
    public int shipWithinDays(int[] weights, int days) {
        int cap = 0;
        for (int w : weights) cap = Math.max(cap, w);
        while (true) {
            int need = 1, load = 0;
            for (int w : weights) {
                if (load + w > cap) { need++; load = 0; }
                load += w;
            }
            if (need <= days) return cap;
            cap++;
        }
    }
}` },
            { p: '<b>Optimal</b>' },
            { code: `class Solution {
    public int shipWithinDays(int[] weights, int days) {
        int lo = 0, hi = 0;
        for (int w : weights) {
            lo = Math.max(lo, w);
            hi += w;
        }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (daysNeeded(weights, mid) <= days) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    private int daysNeeded(int[] weights, int cap) {
        int need = 1, load = 0;
        for (int w : weights) {
            if (load + w > cap) {
                need++;
                load = 0;
            }
            load += w;
        }
        return need;
    }
}` },
            { lines: [
              ['lo = Math.max(lo, w);', 'lo = max weight (isse kam capacity impossible).'],
              ['hi += w;', 'hi = total (ek din me sab). Max 5·10⁴ × 500 = 2.5·10⁷ → int safe.'],
              ['if (daysNeeded(weights, mid) <= days) hi = mid;', 'Itne din kaafi → mid candidate.'],
              ['int need = 1, load = 0;', 'Pehla din shuru.'],
              ['if (load + w > cap)', 'Aaj aur nahi aayega → naya din.'],
              ['load += w;', 'Package current din me (cap ≥ max w, toh hamesha fit).'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize: code line-by-line chalao',
          blocks: [
            { list: [
              'Upar <b>capacity candidates</b> [max, sum] — grey = phenka.',
              'weights array me <b>done</b> = pichle din, <b>win</b> = aaj ka din, <b>skip</b> = jo fit nahi hua (naya din).',
              'Text box me groups dikhte hain: <code>[3,2,2] [4,1,4]</code>.',
            ] },
            { viz: 1011, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[10], 1</code>', '10', 'lo == hi'],
              ['<code>[1,2,3], 1</code>', '6', 'days = 1 → sum'],
              ['<code>[1,2,3], 3</code>', '3', 'days = n → max'],
              ['<code>[1,2,3,1,1], 4</code>', '3', 'Answer = lo (max) khud'],
            ] } },
            { p: 'Galti: lo = 1 rakha toh daysNeeded me package kabhi fit nahi hoga (load = 0 + w &gt; cap) aur count galat aayega.' },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute', 'O(n · (sum − max))', 'O(1)'],
              ['Binary search', 'O(n log(sum))', 'O(1)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['lo = max(weights) kyun?', 'Har package kisi din jaana hai; capacity &lt; max weight → woh package kabhi nahi jaayega.'],
              ['hi = sum kyun?', 'Sum capacity se 1 din me sab chala jaata hai — minimum days already.'],
              ['Greedy check sahi kyun?', 'Order fix; jitna jaldi load, baaki ke liye utna kam — greedy minimum days deta hai.'],
              ['Monotonic kyun?', 'Capacity badhi → greedy groups bade ya same → days kam ya same.'],
              ['need = 1 se start kyun?', 'Pehla din toh hoga hi (n ≥ 1).'],
              ['Packages reorder kar sakte toh?', 'Problem badal jaata hai (bin packing, NP-hard) — binary search + greedy kaam nahi karega.'],
              ['Koko se kya same?', 'Template same; sirf range aur check function alag.'],
              ['Complexity?', 'O(n log(sum)), O(1).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'The capacity must be at least the heaviest package, otherwise it can never ship, and the total weight is always enough for one day. A larger capacity never needs more days, so I binary search capacities in that range. For each guess I simulate greedily: load packages in order and start a new day whenever the next package would exceed the capacity. If the number of days fits, I try smaller; otherwise larger. It runs in O(n log(sum)) time and O(1) extra space.'],
              ['Follow-up: "Greedy optimal kyun hai?"', 'Because the order is fixed, the only choice is where each day ends. If an optimal schedule ends a day earlier than greedy would, I can move the next package into that day without exceeding the capacity, and every later day only gets lighter. Repeating this exchange turns any valid schedule into the greedy one without increasing the number of days.'],
              ['1-minute: Koko vs Ship', 'Both are binary search on the answer with the same lower-bound loop. The differences are the range and the check. For Koko the range is 1 to the largest pile and the check sums ceilings. For shipping, the range is the largest weight to the total weight and the check is a greedy partition counting days.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              '<code>[3,2,2,4,1,4]</code> ko cap 5, 6, 7 pe haath se groups me baanto — kitne din?',
              'daysNeeded function akela likho aur test karo.',
              'Optimal dekh ke likho, submit.',
              'Visualizer me Example 2 dekho aur groups match karo.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 1011 memory se 12 min.',
              '<b>Task B:</b> Greedy proof (exchange argument) 90 sec me bolo.',
              '<b>Task C:</b> LC 875 + LC 1011 back-to-back: dono me sirf kya badla — list banao.',
              '<b>Task D:</b> Follow-up socho: "days ki jagah har din ki max capacity di ho aur minimum days pucha ho" — binary search chahiye? (Nahi, seedha greedy.)',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 1011 Accepted.',
              'Kal (Day 10): LC 410 Split Array (Hard) — dhyan se padho, ye LC 1011 ka hi bhai hai.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Range?', '[max(weights), sum(weights)].'],
              ['[5,5,5], days 2 → answer?', '10.'],
              ['Naya din kab?', 'load + w &gt; cap.'],
              ['Feasible pe?', 'hi = mid.'],
              ['Complexity?', 'O(n log sum).'],
            ] },
          ],
        },
      ],
      checks: [
        'lo = max, hi = sum ka reason bata sakta/sakti hu',
        'daysNeeded greedy bina dekhe likha',
        'Greedy kyun sahi — explain kar sakta/sakti hu',
        'LC 1011 Accepted',
        'Dry run [1..10] match kiya',
        'Visualizer me groups dekhe',
        '8 interview sawaal',
        'Self-test 5/5',
      ],
      memory: 'Ship: range [max, sum], greedy din gino, ≤ days → hi = mid.',
    },

    // =====================================================================
    10: {
      title: 'Split Array Largest Sum (Hard)',
      goal: '"<b>Minimize the maximum</b>" ko binary search on answer me convert karna. LC 410 (MUST) — LC 1011 jaisa check; LC 1011 (PUSH) re-solve aur dono ka mapping.',
      main: 410,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rev('LC 1011 — Ship Within D Days (kal)',
              'Minimum capacity jisse D din me sab ship.',
              '[3,2,2,4,1,4], D=3 → [4,16]: 10 ✓ 7 ✓ 5 ✗ 6 ✓ → 6',
              'Binary search on answer + greedy',
              ['lo = max, hi = sum.', 'Greedy days.', '≤ D → hi = mid.'],
              `int need = 1, load = 0;
for (int w : weights) {
    if (load + w > cap) { need++; load = 0; }
    load += w;
}
return need;`,
              'Bhar do jab tak fit ho, phir naya din.'),
            ...rev('LC 560 — Subarray Sum Equals K',
              'Kitne subarrays ka sum k.',
              '[1,1,1], k=2 → prefix 1,2,3 → 2 subarrays',
              'Prefix sum + HashMap',
              ['map.put(0, 1).', 'sum += x; cnt += map[sum − k].', 'map[sum]++.'],
              `Map<Integer, Integer> m = new HashMap<>(); m.put(0, 1);
int sum = 0, cnt = 0;
for (int x : nums) { sum += x; cnt += m.getOrDefault(sum - k, 0); m.merge(sum, 1, Integer::sum); }`,
              'Pehle dekha prefix = sum − k → beech ka hissa = k.'),
          ],
        },
        {
          title: 'Part 1 — Concept: Minimize the maximum',
          blocks: [
            { p: '"k parts me todo, sabse bade part ka sum minimum karo" — split points choose karna mushkil hai. <b>Ulta socho:</b> "Agar largest sum ≤ cap ho, toh kya k parts kaafi hain?"' },
            { pre: 'nums = [7,2,5,10,8], k = 2\ncap   : 10 … 15  16  17  18  19 … 32\nparts :  4 …  3   3   3   2   2 …  1\nok≤2? :  F …  F   F   F   T   T …  T\n                          ^ pehla T = 18' },
            { table: { head: ['LC 1011', 'LC 410'], rows: [
              ['weights', 'nums'],
              ['days', 'k'],
              ['capacity', 'largest subarray sum'],
              ['daysNeeded ≤ days', 'parts ≤ k'],
            ] } },
            { tip: 'Exactly k parts chahiye, lekin greedy ne kam parts banaye toh? Koi bhi part tod do (k ≤ n) — largest sum badhega nahi. Isliye "≤ k" check sahi hai.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 410 Split Array Largest Sum',
          blocks: [{ problem: 410 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute:</b> cap = max se sum tak 1-1 try, greedy parts. O(n · sum) — sum 10⁹ → TLE.' },
            { p: '<b>Better (DP):</b> dp[i][j] = pehle i elements, j parts → min largest sum. O(k · n²) = 5·10⁷ — chal jaata hai, lekin heavy. (Day 12 me detail.)' },
            { p: '<b>Optimal:</b> cap pe binary search:' },
            { olist: [
              'lo = max(nums) (k = n case), hi = sum (k = 1 case).',
              'canSplit(cap): greedy parts, return parts ≤ k.',
              'True → hi = mid, warna lo = mid + 1.',
            ] },
          ],
        },
        {
          title: 'Part 4 — Dry run',
          blocks: [
            { p: '<b>[7,2,5,10,8], k = 2</b> → expected 18' },
            { table: { head: ['lo', 'hi', 'mid', 'Greedy parts', 'count', '≤ 2?', 'Update'], rows: [
              ['10', '32', '21', '[7,2,5] [10,8]', '2', 'Yes', 'hi = 21'],
              ['10', '21', '15', '[7,2,5] [10] [8]', '3', 'No', 'lo = 16'],
              ['16', '21', '18', '[7,2,5] [10,8]', '2', 'Yes', 'hi = 18'],
              ['16', '18', '17', '[7,2,5] [10] [8]', '3', 'No', 'lo = 18'],
              ['18', '18', '—', '', '', '', '<b>return 18</b>'],
            ] } },
            { p: '<b>[1,2,3,4,5], k = 2</b>: [5,15] → 10 ✓ hi=10; 7 ✗ lo=8; 9 ✓ hi=9; 8 ✗ lo=9 → <b>9</b>.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { code: `class Solution {
    public int splitArray(int[] nums, int k) {
        int lo = 0, hi = 0;
        for (int x : nums) {
            lo = Math.max(lo, x);
            hi += x;
        }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (canSplit(nums, k, mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    private boolean canSplit(int[] nums, int k, int cap) {
        int parts = 1, sum = 0;
        for (int x : nums) {
            if (sum + x > cap) {
                parts++;
                sum = 0;
            }
            sum += x;
        }
        return parts <= k;
    }
}` },
            { lines: [
              ['lo = Math.max(lo, x);', 'Har element kisi part me hai → largest ≥ max.'],
              ['hi += x;', 'k = 1 pe poora array. Max 1000 × 10⁶ = 10⁹ → int me fit.'],
              ['if (canSplit(nums, k, mid)) hi = mid;', 'cap chal gaya → shayad chhota bhi.'],
              ['if (sum + x > cap)', 'Current part me nahi aayega → naya part.'],
              ['return parts <= k;', 'Kam parts bhi theek (tod ke k bana sakte).'],
            ] },
            { p: '<b>Brute (linear cap scan)</b> — samajhne ke liye:' },
            { code: `for (int cap = lo; cap <= hi; cap++) {
    if (canSplit(nums, k, cap)) return cap;   // pehla feasible
}` },
          ],
        },
        {
          title: 'Part 6 — Visualize: code line-by-line chalao',
          blocks: [
            { list: [
              'LC 410: cap candidates [max, sum] aur greedy parts colour me.',
              'Upar <b>DP</b> tab — Better approach ka table (kal ke baad Day 12 me detail).',
              'LC 1011 (PUSH) ka visualizer bhi neeche — dono ka flow side-by-side compare karo.',
            ] },
            { viz: 410, ex: 0 },
            { viz: 1011, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[1,4,4], k=3</code>', '4', 'k = n → max'],
              ['<code>[0], k=1</code>', '0', 'Zero allowed'],
              ['<code>[0,0,0], k=2</code>', '0', 'lo = hi = 0'],
              ['<code>[10⁶,10⁶], k=1</code>', '2000000', 'k = 1 → sum'],
              ['<code>[2,3,1,2,4,3], k=5</code>', '4', 'Mostly singles'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute', 'O(n · (sum − max))', 'O(1)'],
              ['DP', 'O(k · n²)', 'O(n · k)'],
              ['Binary search', 'O(n log(sum))', 'O(1)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['"Minimize the maximum" ka signal?', 'Binary search on answer (max value ko guess karo).'],
              ['Range?', '[max(nums), sum(nums)].'],
              ['parts ≤ k kyun, == k kyun nahi?', 'Kam parts ko tod ke k bana sakte bina largest badhaye.'],
              ['Greedy kyun sahi?', 'Har part ko max tak bharna parts minimize karta hai (LC 1011 jaisa exchange argument).'],
              ['nums[i] = 0 se koi problem?', 'Nahi — lo = 0 bhi ho sakta hai, check chalta hai.'],
              ['sum overflow?', '10⁹ ≤ 2³¹ − 1 — int safe; bade constraints me long.'],
              ['DP vs BS?', 'DP O(k·n²) general; BS O(n log sum) faster, monotonic + greedy pe depend.'],
              ['LC 1011 se mapping?', 'weights ↔ nums, days ↔ k, capacity ↔ largest sum.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'Choosing split points directly is hard, so I flip the question: given a cap on the largest subarray sum, can I split the array into at most k parts? The cap lies between the maximum element and the total sum. The check is greedy: keep adding numbers to the current part until the next one would exceed the cap, then start a new part. A bigger cap never needs more parts, so the check is monotonic, and I binary search for the smallest feasible cap. O(n log(sum)) time, O(1) space.'],
              ['Follow-up: "At most k vs exactly k"', 'If the greedy uses fewer than k parts, I can always split some part further, because k is at most n, and splitting never increases any sum. So feasibility with at most k parts implies feasibility with exactly k, and the check parts <= k is correct.'],
              ['1-minute: Pattern recognition', 'Whenever a problem says minimize the maximum or maximize the minimum, and checking a candidate value is easy, I think of binary search on the answer. Ship within D days, Koko eating bananas and split array largest sum are the same skeleton with different checks.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              '[7,2,5,10,8], k = 2 ke saare 4 possible splits haath se likho, har ek ka largest sum. Minimum = 18?',
              'LC 1011 ka mapping table (Part 1) notebook me.',
              'canSplit akela likho; cap 15 aur 18 pe test.',
              'Visualizer me Example 1.',
              'LC 1011 (PUSH) re-solve try.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 410 memory se 15 min (Hard ka target).',
              '<b>Task B:</b> LC 1011 re-solve 8 min.',
              '<b>Task C:</b> "at most k vs exactly k" ka argument bolo.',
              '<b>Task D:</b> DP recurrence paper pe likho (kal ke Day 12 ki tayyari).',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 410 Accepted (Sohvi: optional, samajhna zaroori).',
              'LC 1011 re-solve.',
              'Kal (Day 11): LC 33 ka doosra approach (pivot + binary search) + LC 704 recursive.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[1,2,3,4,5], k = 2 → ?', '9.'],
              ['Range?', '[max, sum].'],
              ['canSplit return?', 'parts ≤ k.'],
              ['Complexity?', 'O(n log sum).'],
              ['Kaunsa purana question same skeleton?', 'LC 1011 (aur LC 875).'],
            ] },
          ],
        },
      ],
      checks: [
        '"Minimize the maximum" → BS on answer pehchan sakta/sakti hu',
        'LC 1011 ↔ LC 410 mapping bata sakta/sakti hu',
        'canSplit bina dekhe likha',
        'LC 410 Accepted',
        'Dry run match kiya',
        'At most k vs exactly k samjha',
        '8 interview sawaal',
        'Self-test 5/5',
      ],
      memory: 'Minimize max → max ko guess karo. Range [max, sum], greedy parts ≤ k → hi = mid.',
    },

    // =====================================================================
    11: {
      title: 'Doosra approach: Pivot + Binary Search',
      goal: 'LC 33 ko <b>do simple templates</b> se solve karna: pehle LC 153 wala pivot, phir LC 704 wala normal search. Saath me LC 704 <b>recursive</b> ko call stack ke saath revisit.',
      main: 33,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rev('LC 410 — Split Array Largest Sum (kal)',
              'k parts, largest sum minimize.',
              '[7,2,5,10,8], k=2 → [10,32]: 21 ✓ 15 ✗ 18 ✓ 17 ✗ → 18',
              'Binary search on answer',
              ['lo = max, hi = sum.', 'Greedy parts ≤ k?', 'Lower bound.'],
              `while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (canSplit(nums, k, mid)) hi = mid;
    else lo = mid + 1;
}`,
              'Max ko guess karo, parts gino.'),
            ...rev('LC 141 — Linked List Cycle',
              'List me cycle hai?',
              '3→2→0→-4→(2) : slow/fast milte hain → true',
              'Floyd fast & slow',
              ['slow 1, fast 2.', 'Mil gaye → cycle.', 'fast null → no cycle.'],
              `ListNode s = head, f = head;
while (f != null && f.next != null) {
    s = s.next; f = f.next.next;
    if (s == f) return true;
}
return false;`,
              'Gol track pe tez runner peeche se pakad leta hai.'),
            ...rev('LC 232 — Implement Queue using Stacks',
              'Do stacks se FIFO queue.',
              'push 1, push 2 → in=[1,2]; peek → out=[2,1] top 1',
              'Two stacks (amortized O(1))',
              ['push → in stack.', 'pop/peek → out khaali ho toh in ko out me ulat do.', 'Har element max 2 baar move.'],
              `void push(int x) { in.push(x); }
int pop() { peek(); return out.pop(); }
int peek() { if (out.isEmpty()) while (!in.isEmpty()) out.push(in.pop()); return out.peek(); }`,
              'Ulti stack + ulti stack = seedhi line.'),
          ],
        },
        {
          title: 'Part 1 — Concept: problem ko chhote known problems me todna',
          blocks: [
            { p: 'Interview me ek strong move: "Ye do known problems ka combination hai." Rotated array = <b>do sorted arrays</b> jo pivot pe jude hain.' },
            { pre: '[4, 5, 6, 7, 0, 1, 2]\n            ^ pivot = 4 (min ka index, LC 153 se)\npart A = [0..3] = [4,5,6,7]   sorted\npart B = [4..6] = [0,1,2]     sorted\n\ntarget ∈ [nums[pivot], nums[n−1]] → part B me LC 704\nwarna                              → part A me LC 704' },
            { table: { head: ['Step', 'Template', 'Kahan se'], rows: [
              ['1. Pivot', 'Boundary (lo &lt; hi, hi = mid)', 'LC 153'],
              ['2. Part choose', 'Ek if', 'nums[pivot] ≤ t ≤ nums[n−1]?'],
              ['3. Search', 'Exact (lo &lt;= hi)', 'LC 704'],
            ] } },
            { p: '<b>Recursive LC 704 revisit:</b> har call <code>bs(lo, hi)</code> ek frame; base case <code>lo &gt; hi</code>. Depth log n.' },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 33 (doosra approach)',
          blocks: [{ problem: 33 }],
        },
        {
          title: 'Part 3 — Thinking: One pass vs Pivot + BS',
          blocks: [
            { olist: [
              'Pivot loop: nums[mid] &gt; nums[hi] → lo = mid + 1, warna hi = mid. pivot = lo.',
              'Agar pivot = 0 (not rotated) → part A khaali (hi = −1), part B = poora array — sahi.',
              'target ≥ nums[pivot] aur ≤ nums[n−1] → [pivot, n−1], warna [0, pivot−1].',
              'Normal binary search.',
            ] },
            { table: { head: ['', 'One pass', 'Pivot + BS'], rows: [
              ['Passes', '1', '2'],
              ['Har step logic', '2-level if (thoda tricky)', 'Simple'],
              ['Time', 'O(log n)', 'O(log n)'],
              ['Bug risk', '&lt;= / &lt; boundaries', 'Kam'],
            ] } },
          ],
        },
        {
          title: 'Part 4 — Dry run: [4,5,6,7,0,1,2]',
          blocks: [
            { p: '<b>target = 0</b>' },
            { table: { head: ['Phase', 'lo', 'hi', 'mid', 'Compare', 'Update'], rows: [
              ['Pivot', '0', '6', '3', '7 &gt; 2', 'lo = 4'],
              ['Pivot', '4', '6', '5', '1 ≤ 2', 'hi = 5'],
              ['Pivot', '4', '5', '4', '0 ≤ 1', 'hi = 4 → pivot = 4'],
              ['Choose', '', '', '', '0 ∈ [0, 2]', 'lo = 4, hi = 6'],
              ['Search', '4', '6', '5', '1 &gt; 0', 'hi = 4'],
              ['Search', '4', '4', '4', '0 == 0', '<b>return 4</b>'],
            ] } },
            { p: '<b>target = 3</b>: pivot = 4; 3 ∈ [0, 2]? No → [0, 3]: mid 1 (5 &gt; 3) hi=0; mid 0 (4 &gt; 3) hi=−1 → <b>−1</b>.' },
            { p: '<b>LC 704 recursive</b> ([-1,0,3,5,9,12], 2): bs(0,5) → mid 2 (3 &gt; 2) → bs(0,1) → mid 0 (−1 &lt; 2) → bs(1,1) → mid 1 (0 &lt; 2) → bs(2,1) → lo &gt; hi → −1. Max 4 frames.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { code: `class Solution {
    public int search(int[] nums, int target) {
        int n = nums.length, lo = 0, hi = n - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) lo = mid + 1;
            else hi = mid;
        }
        int pivot = lo;
        if (target >= nums[pivot] && target <= nums[n - 1]) {
            lo = pivot; hi = n - 1;
        } else {
            lo = 0; hi = pivot - 1;
        }
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}` },
            { lines: [
              ['while (lo < hi) { … hi = mid; }', 'LC 153 ka loop — minimum ka index.'],
              ['int pivot = lo;', 'Part B ka start.'],
              ['target >= nums[pivot] && target <= nums[n - 1]', 'Part B (chhote values) ki range.'],
              ['lo = 0; hi = pivot - 1;', 'Part A (bade values). pivot = 0 pe khaali range → seedha −1.'],
              ['while (lo <= hi)', 'LC 704 exact search.'],
            ] },
            { p: '<b>LC 704 recursive</b>' },
            { code: `class Solution {
    public int search(int[] nums, int target) {
        return bs(nums, target, 0, nums.length - 1);
    }

    private int bs(int[] nums, int target, int lo, int hi) {
        if (lo > hi) return -1;
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) return bs(nums, target, mid + 1, hi);
        return bs(nums, target, lo, mid - 1);
    }
}` },
          ],
        },
        {
          title: 'Part 6 — Visualize: code line-by-line chalao',
          blocks: [
            { list: [
              'LC 33 <b>Pivot + BS</b> tab: pehle pivot phase, phir text box me "pivot = 4", phir normal search.',
              'LC 704 <b>Recursive</b> tab: CALL STACK me frames badhte aur return pe ghat-te dekho.',
            ] },
            { viz: 33, ex: 0, variant: 1 },
            { viz: 704, ex: 1, variant: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[1,2,3,4,5], 4</code>', '3', 'pivot = 0 → part B = poora array'],
              ['<code>[1,2,3,4,5], 0</code>', '-1', 'Part A khaali (hi = −1)'],
              ['<code>[3,1], 3</code>', '0', 'pivot = 1, 3 part A me'],
              ['<code>[1], 0</code>', '-1', 'pivot = 0, range [0,0] me nahi'],
              ['<code>[4,5,6,7,0,1,2], 2</code>', '6', 'Last element'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['LC 33 Pivot + BS', 'O(log n) + O(log n)', 'O(1)'],
              ['LC 33 One pass', 'O(log n)', 'O(1)'],
              ['LC 704 Recursive', 'O(log n)', 'O(log n) stack'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Pivot kya hai?', 'Minimum element ka index = rotation count.'],
              ['Pivot loop kaunsa template?', 'Boundary: lo &lt; hi, hi = mid.'],
              ['Part B kaunsa?', '[pivot, n−1] — chhoti values.'],
              ['Not rotated pe kya hota hai?', 'pivot = 0; part A [0, −1] khaali.'],
              ['Do binary search → complexity?', '2 log n = O(log n).'],
              ['Recursive ki depth?', '~log₂ n frames.'],
              ['Recursive me "return" har call pe kyun?', 'Result upar tak pass karna hai; return bhoole toh −1/garbage.'],
              ['Interview me kaunsa approach batao?', 'Jo clean likh sako; dono mention karo.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo (pivot)', 'I split the problem into two problems I already know. First I find the pivot, the index of the minimum, by comparing nums[mid] with nums[hi] and shrinking toward the drop. The array is then two sorted runs: from 0 to pivot minus one, and from pivot to the end. If the target lies between nums[pivot] and the last element, I search the second run, otherwise the first, using a standard binary search. Both phases are O(log n), and space is O(1).'],
              ['Follow-up: "Recursive binary search ka space?"', 'Each call adds a stack frame and the range halves each time, so the depth is about log2 of n, giving O(log n) space. Since Java does not eliminate tail calls, the iterative version is preferable when memory matters, though log n is tiny in practice.'],
              ['1-minute: Decomposition in interviews', 'When a problem looks new, I try to express it as known building blocks. A rotated array search becomes find the pivot plus a normal binary search. Saying this out loud shows structured thinking, and each piece is a template I can write without bugs.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              '[4,5,6,7,0,1,2] pe pivot mark karo; part A aur B alag colour me.',
              'LC 153 loop likho (pivot), phir LC 704 loop — dono jod do.',
              'Submit LC 33 (pivot approach).',
              'LC 704 recursive ka call tree draw karo (target 2).',
              'Visualizer ke dono tabs dekho.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 33 dono approaches 15 min me.',
              '<b>Task B:</b> LC 704 recursive + iterative 5 min.',
              '<b>Task C:</b> Decomposition answer (Part 10) bolke record.',
              '<b>Task D:</b> LC 875 + LC 410 re-solve (timer 25 min).',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 33 pivot approach Accepted.',
              'Kal (Day 12): LC 410 ka DP approach + Koko re-solve.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[5,6,7,1,2,3] ka pivot?', '3.'],
              ['Target 6 kis part me?', 'Part A [0..2] (6 ∉ [1,3]).'],
              ['Part choose condition?', 'nums[pivot] ≤ t ≤ nums[n−1].'],
              ['Recursive base case?', 'lo &gt; hi → −1.'],
              ['Dono approaches ki complexity?', 'O(log n) time, O(1) space.'],
            ] },
          ],
        },
      ],
      checks: [
        'Pivot + BS approach bina dekhe likha',
        'Not rotated case ka behaviour samjha',
        'One pass vs pivot trade-off bata sakta/sakti hu',
        'LC 704 recursive call stack draw kiya',
        'Visualizer ke dono variant tabs dekhe',
        '8 interview sawaal',
        'Self-test 5/5',
      ],
      memory: 'Rotated search = pivot (LC 153) + part choose + normal search (LC 704).',
    },

    // =====================================================================
    12: {
      title: 'Catch-up: DP vs Binary Search (Split Array)',
      goal: 'LC 410 ka <b>DP approach</b> samajhna (dp[i][j]), BS on answer se compare karna, aur LC 875 (PUSH) timer ke saath re-solve. Koi naya problem nahi.',
      main: 410,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rev('LC 42 — Trapping Rain Water',
              'Bars ke beech kitna paani.',
              '[0,1,0,2,1,0,1,3,2,1,2,1] → 6',
              'Two pointers (leftMax / rightMax)',
              ['Chhoti side ka max hi water level decide karta hai.', 'h[l] &lt; h[r] → left process, warna right.', 'water += max − h.'],
              `int l = 0, r = h.length - 1, lm = 0, rm = 0, w = 0;
while (l < r) {
    if (h[l] < h[r]) { lm = Math.max(lm, h[l]); w += lm - h[l]; l++; }
    else { rm = Math.max(rm, h[r]); w += rm - h[r]; r--; }
}`,
              'Paani chhoti deewar tak hi rukta hai.'),
            ...rev('LC 643 — Maximum Average Subarray I',
              'Length k subarray ka max average.',
              '[1,12,-5,-6,50,3], k=4 → [12,-5,-6,50] sum 51 → 12.75',
              'Fixed sliding window',
              ['Pehle k ka sum.', 'Slide: + nums[i] − nums[i−k].', 'Max track.'],
              `int sum = 0;
for (int i = 0; i < k; i++) sum += nums[i];
int best = sum;
for (int i = k; i < nums.length; i++) { sum += nums[i] - nums[i - k]; best = Math.max(best, sum); }
return (double) best / k;`,
              'Ek aaya, ek gaya.'),
            ...rev('LC 1011 — Ship Within D Days (Day 9)',
              'Min capacity, D din.',
              '[1..10], D=5 → 15',
              'BS on answer + greedy',
              ['[max, sum].', 'Greedy days.', '≤ D → hi = mid.'],
              `if (daysNeeded(weights, mid) <= days) hi = mid;
else lo = mid + 1;`,
              'Ship = Split = Koko skeleton.'),
          ],
        },
        {
          title: 'Part 1 — Concept: DP formulation',
          blocks: [
            { p: '<b>State:</b> <code>dp[i][j]</code> = pehle <b>i</b> elements ko <b>j</b> parts me todne pe minimum possible largest sum.' },
            { p: '<b>Transition:</b> last part = nums[p..i−1]. Baaki pehle p elements j−1 parts me:' },
            { pre: 'dp[i][j] = min over p in [j−1, i−1] of  max( dp[p][j−1],  sum(p..i−1) )\nsum(p..i−1) = pre[i] − pre[p]\nBase: dp[0][0] = 0, baaki ∞\nAnswer: dp[n][k]' },
            { table: { head: ['', 'DP', 'Binary search on answer'], rows: [
              ['Time', 'O(k · n²)', 'O(n log sum)'],
              ['Space', 'O(n · k)', 'O(1)'],
              ['Kab kaam karta hai', 'Hamesha (general)', 'Monotonic + greedy check valid'],
              ['Actual partition', 'Parent track se mil jaata hai', 'Final cap pe greedy dobara chalao'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Aaj ka problem: LC 410 (DP approach)',
          blocks: [{ problem: 410 }],
        },
        {
          title: 'Part 3 — Thinking: Brute → Better (DP) → Optimal (BS)',
          blocks: [
            { olist: [
              '<b>Brute recursion:</b> har jagah "yahan todu ya nahi" → exponential.',
              '<b>Memo / DP:</b> state (i, j) repeat hote hain → table. O(k·n²).',
              '<b>BS on answer:</b> largest sum guess + greedy check → O(n log sum).',
            ] },
            { p: '<b>Koko (LC 875, PUSH):</b> aaj timer ke saath re-solve — 12 min target. Same skeleton yaad karo.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: DP table for [7,2,5,10,8], k = 2',
          blocks: [
            { p: 'pre = [0, 7, 9, 14, 24, 32]' },
            { table: { head: ['i', 'j = 1', 'j = 2', 'Best split (j = 2)'], rows: [
              ['0', '∞ (dp[0][0] = 0)', '∞', '—'],
              ['1', '7', '∞', '—'],
              ['2', '9', '7', '[7] | [2]'],
              ['3', '14', '7', '[7] | [2,5]'],
              ['4', '24', '14', '[7,2,5] | [10]'],
              ['5', '32', '<b>18</b>', '[7,2,5] | [10,8]'],
            ] } },
            { p: 'dp[5][2]: p = 3 → max(dp[3][1] = 14, 10 + 8 = 18) = 18; p = 4 → max(dp[4][1] = 24, 8) = 24; p = 2 → max(9, 23) = 23; p = 1 → max(7, 25) = 25 → min = <b>18</b> ✓ (BS answer se match).' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { code: `class Solution {
    public int splitArray(int[] nums, int k) {
        int n = nums.length;
        long[] pre = new long[n + 1];
        for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + nums[i];
        long[][] dp = new long[n + 1][k + 1];
        for (long[] row : dp) Arrays.fill(row, Long.MAX_VALUE);
        dp[0][0] = 0;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= Math.min(i, k); j++) {
                for (int p = j - 1; p < i; p++) {
                    if (dp[p][j - 1] == Long.MAX_VALUE) continue;
                    long cand = Math.max(dp[p][j - 1], pre[i] - pre[p]);
                    dp[i][j] = Math.min(dp[i][j], cand);
                }
            }
        }
        return (int) dp[n][k];
    }
}` },
            { lines: [
              ['pre[i + 1] = pre[i] + nums[i];', 'Range sum O(1) ke liye prefix.'],
              ['Arrays.fill(row, Long.MAX_VALUE);', '∞ = abhi tak impossible.'],
              ['dp[0][0] = 0;', '0 elements, 0 parts — valid, cost 0.'],
              ['j <= Math.min(i, k)', 'i elements se zyada parts nahi (non-empty).'],
              ['p = j - 1', 'Pehle p elements me j−1 non-empty parts ke liye p ≥ j−1.'],
              ['Math.max(dp[p][j - 1], pre[i] - pre[p])', 'Is split ka largest = purana largest vs last part.'],
              ['Math.min(dp[i][j], cand)', 'Saare split points me best.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize: code line-by-line chalao',
          blocks: [
            { list: [
              'LC 410 <b>DP</b> tab: table cell-by-cell bharta hai; <b>new</b> = abhi bhara, <b>win</b> = jis dp[p][j−1] se aaya.',
              'Phir <b>Binary Search</b> tab se same answer verify karo.',
              'Neeche LC 875 (PUSH) visualizer — re-solve ke baad dry run match.',
            ] },
            { viz: 410, ex: 0, variant: 1 },
            { viz: 875, ex: 2 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'DP', 'BS', 'Note'], rows: [
              ['<code>[1,4,4], k=3</code>', '4', '4', 'j = i diagonal'],
              ['<code>[0,0,0], k=2</code>', '0', '0', 'Zeros'],
              ['<code>[10⁶,10⁶], k=1</code>', '2000000', '2000000', 'k = 1 column'],
            ] } },
            { p: 'Humne 3000 random inputs pe Brute, DP aur BS teeno ko compare kiya — sab same.' },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space', 'n = 1000, k = 50'], rows: [
              ['DP', 'O(k · n²)', 'O(n · k)', '~5·10⁷'],
              ['BS on answer', 'O(n log sum)', 'O(1)', '~3·10⁴'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['dp[i][j] ka matlab?', 'Pehle i elements, j parts → min largest sum.'],
              ['Transition?', 'min over p of max(dp[p][j−1], pre[i] − pre[p]).'],
              ['Base case?', 'dp[0][0] = 0, baaki ∞.'],
              ['Long kyun?', 'Sum + MAX_VALUE sentinel safe rahe.'],
              ['DP kab prefer?', 'Greedy check invalid ho, ya count/actual partition chahiye.'],
              ['BS kab prefer?', 'Monotonic feasibility + fast greedy check.'],
              ['Space optimize DP?', 'j ke liye sirf pichla column → O(n).'],
              ['Koko ka hi?', 'max(piles).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['DP approach explain karo', 'Let dp[i][j] be the minimum possible largest sum when the first i elements are split into j parts. For the last part I try every starting point p, so dp[i][j] is the minimum over p of the maximum of dp[p][j − 1] and the sum of elements p to i − 1, which I get from prefix sums. The base case is dp[0][0] = 0. That is O(k·n²) time and O(n·k) space, which passes for n = 1000 and k = 50, but binary search on the answer is much faster at O(n log sum).'],
              ['Follow-up: "Actual split chahiye toh?"', 'With binary search, once I have the optimal cap I run the greedy pass one more time and record where each part ends; if it produces fewer than k parts I split some parts further. With DP, I store the best p for each state and backtrack from dp[n][k].'],
              ['1-minute: DP vs binary search on answer', 'Binary search on the answer is faster and simpler when feasibility is monotonic and checkable greedily. DP is the more general tool for when greedy fails or I need counts or the exact structure. In an interview I mention both and implement the faster one.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'DP table (Part 4) khud paper pe bharo — sirf j = 1 column (prefix sums hi hain).',
              'j = 2 column ka ek cell (dp[3][2]) haath se nikaalo.',
              'LC 875 re-solve (Koko) — bina dekhe.',
              'Visualizer ke DP tab me table bharte dekho.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 410 DP memory se 15 min, submit.',
              '<b>Task B:</b> LC 875 12 min timer.',
              '<b>Task C:</b> DP space optimization (1D) socho aur likho.',
              '<b>Task D:</b> "DP vs BS" 60 sec bolo.',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 410 DP Accepted (Sohel), LC 875 re-solve (dono).',
              'Kal Saturday revision: LC 704, 875, 1011, 410.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['dp[2][2] for [7,2,5,10,8]?', '7 ([7] | [2]).'],
              ['DP complexity?', 'O(k · n²).'],
              ['BS complexity?', 'O(n log sum).'],
              ['Answer cell?', 'dp[n][k].'],
              ['Koko ka check?', 'Σ ceil(p/k) ≤ h.'],
            ] },
          ],
        },
      ],
      checks: [
        'dp[i][j] state aur transition bata sakta/sakti hu',
        'DP table [7,2,5,10,8] ka bhara',
        'DP vs BS trade-off bol sakta/sakti hu',
        'LC 410 DP (Sohel) Accepted',
        'LC 875 timer me re-solve',
        'Visualizer DP tab dekha',
        'Self-test 5/5',
      ],
      memory: 'DP = har split point try (k·n²). BS = max guess + greedy (n log sum). Monotonic hai toh BS.',
    },

    // =====================================================================
    13: {
      title: 'Revision — Week 2 (Search on Answer)',
      goal: 'LC 704, 875, 1011, 410 <b>bina dekhe, timer ke saath</b>. feasible() 5 min me likhna, range ka reason bolna. Saath me System Design session.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules) + warm-up',
          blocks: [
            { table: { head: ['Slot', 'Kya', 'Timer'], rows: [
              ['1', 'LC 704 (iterative + recursive)', '8 min'],
              ['2', 'LC 875', '15 min'],
              ['3', 'LC 1011', '15 min'],
              ['4', 'LC 410', '20 min'],
              ['5', 'Mistakes review', '15 min'],
            ] } },
            { list: ['Pehle range + check bolo, phir code.', 'Har code ke baad ek edge case.', 'Atak gaye → Last Minute tab.'] },
            ...rev('Warm-up: LC 424 — Longest Repeating Character Replacement',
              'k replacements ke baad same-char ka sabse lamba substring.',
              '"AABABBA", k=1 → 4',
              'Sliding window + maxFreq',
              ['window − maxFreq ≤ k valid.', 'Invalid → l++.', 'best = window size.'],
              `int[] f = new int[26]; int l = 0, mx = 0, best = 0;
for (int r = 0; r < s.length(); r++) {
    mx = Math.max(mx, ++f[s.charAt(r) - 'A']);
    while (r - l + 1 - mx > k) f[s.charAt(l++) - 'A']--;
    best = Math.max(best, r - l + 1);
}`,
              'Baaki chars = replacements.'),
            ...rev('Warm-up: LC 69 — Sqrt(x)',
              'floor(√x).',
              'x = 8 → 2',
              'BS on answer (floor)',
              ['0..x.', 'mid² ≤ x → ans, right.', 'Long.'],
              `if ((long) mid * mid <= x) { ans = mid; lo = mid + 1; } else hi = mid - 1;`,
              'Aakhri T.'),
          ],
        },
        {
          title: 'Part 1 — Revision Q1: LC 704 Binary Search',
          blocks: [
            { problem: 704 },
            { p: '<b>Pattern:</b> Template A.' },
            { pre: '[-1,0,3,5,9,12], 2 → mid 2 (3) hi=1; mid 0 (−1) lo=1; mid 1 (0) lo=2 → −1' },
            { code: `while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
}
return -1;` },
            { tip: '<b>Memory hook:</b> Exact = lo &lt;= hi.' },
          ],
        },
        {
          title: 'Part 2 — Revision Q2: LC 875 Koko',
          blocks: [
            { problem: 875 },
            { p: '<b>Pattern:</b> BS on answer, range [1, max].' },
            { pre: '[3,6,7,11], h=8 → 6 ✓ 3 ✗ 5 ✓ 4 ✓ → 4' },
            { code: `hours += (p - 1) / k + 1;   // long hours
return hours <= h;` },
            { tip: '<b>Memory hook:</b> Tez khao toh kam ghante.' },
            { viz: 875, ex: 0 },
          ],
        },
        {
          title: 'Part 3 — Revision Q3: LC 1011 Ship',
          blocks: [
            { problem: 1011 },
            { p: '<b>Pattern:</b> BS on answer, [max, sum], greedy days.' },
            { pre: '[1..10], D=5 → 32 ✓ 21 ✓ 15 ✓ 12 ✗ 14 ✗ → 15' },
            { code: `if (load + w > cap) { need++; load = 0; }
load += w;` },
            { tip: '<b>Memory hook:</b> Bhar do, phir naya din.' },
          ],
        },
        {
          title: 'Part 4 — Revision Q4: LC 410 Split Array',
          blocks: [
            { problem: 410 },
            { p: '<b>Pattern:</b> Minimize max → BS on answer (same as 1011).' },
            { pre: '[7,2,5,10,8], k=2 → 21 ✓ 15 ✗ 18 ✓ 17 ✗ → 18' },
            { code: `return parts <= k;   // greedy parts with cap` },
            { tip: '<b>Memory hook:</b> Max ko guess karo.' },
            { viz: 410, ex: 0 },
          ],
        },
        {
          title: 'Part 5 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['Teen BS-on-answer questions ka range?', 'Koko [1, max], Ship [max, sum], Split [max, sum].'],
              ['Feasible pe update?', 'hi = mid.'],
              ['Koko me overflow kahan?', 'hours (long) aur ceil formula.'],
              ['Ship/Split me lo = 1 kyun galat?', 'Package/element fit hi nahi hoga; lo = max.'],
              ['LC 410 DP complexity?', 'O(k·n²).'],
              ['Recursive LC 704 space?', 'O(log n).'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Bade answers: aise bolo',
          blocks: [
            { say: [
              ['1-minute: Binary search on answer', 'When the question asks for the minimum value that satisfies a condition, and a larger value always satisfies it too, I binary search over the possible values. I pick the smallest and largest possible answers as the range, write a greedy check that runs in linear time, and use the lower-bound loop: if the check passes, hi = mid, otherwise lo = mid + 1. The answer is lo, and the cost is O(n log range).'],
              ['1-minute: Phase summary', 'Binary search has three shapes in this phase: exact search in a sorted array, boundary search like lower bound or minimum in a rotated array, and search on the answer space. All three come from one idea: a monotonic condition lets me discard half of the candidates per step.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: [
              'LC 704 iterative + recursive bina dekhe.',
              'LC 875 15 min — range aur check pehle bolo.',
              'LC 1011 try (20 min).',
              'Visualizer me Koko example dobara.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice + System Design)',
          blocks: [
            { olist: [
              '<b>Task A:</b> 4 questions back-to-back, 55 min target.',
              '<b>Task B:</b> LC 410 DP bhi (15 min).',
              '<b>Task C:</b> Sohvi tumse "greedy kyun sahi" pooche — 90 sec answer.',
              SD + ' Aaj: <b>Rate Limiter</b> (token bucket vs sliding window, Redis, distributed counters).',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: [
              'Timer me jo nahi hua — kal subah.',
              'Last Minute tab ki saari triggers zubaani.',
              'Kal mock: Sohel → Sohvi (LC 69), Sohvi → Sohel (LC 1011).',
            ] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[1,1,1,1], h=4 (Koko)?', '1 (h == n aur har pile 1).'],
              ['[1,2,3,4,5], D=2 (Ship)?', '9.'],
              ['[2,2,2], k=3 (Split)?', '2.'],
              ['[1,3,5], 4 (LC 704)?', '-1.'],
              ['BS on answer complexity?', 'O(n log range).'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 704 timer me',
        'LC 875 timer me',
        'LC 1011 timer me',
        'LC 410 timer me',
        'Teeno ka range + check zubaani',
        'System Design session (Sohel)',
        'Self-test 5/5',
      ],
      memory: 'Week 2: guess the answer, greedy check, lower bound. Koko [1,max], Ship/Split [max,sum].',
    },

    // =====================================================================
    14: {
      title: 'Mock Interview + Contest + Phase Test',
      goal: 'Mock: <b>Tum → Sohvi (LC 69)</b>, <b>Sohvi → Tum (LC 1011)</b>. Weekly Contest discussion. Phase test: Last Minute tab ki saari one-liners bolo.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Mock format (30 + 30 + 30 min) + warm-up',
          blocks: [
            { table: { head: ['Time', 'Kya', 'Kaun'], rows: [
              ['30 min', 'Mock Q1: LC 69', 'Sohel interviewer, Sohvi candidate'],
              ['30 min', 'Mock Q2: LC 1011', 'Sohvi interviewer, Sohel candidate'],
              ['30 min', 'Contest discussion + phase test', 'Dono'],
            ] } },
            ...rev('Warm-up: LC 225 — Implement Stack using Queues',
              'Queue se LIFO stack.',
              'push 1, push 2 → queue [2,1] (rotate) → top 2',
              'Single queue rotation',
              ['push x → add, phir size−1 baar front ko back me.', 'pop/top = front.'],
              `void push(int x) { q.add(x); for (int i = 1; i < q.size(); i++) q.add(q.poll()); }
int pop() { return q.poll(); }`,
              'Naya aaya, sabko peeche bhejo.'),
            ...rev('Warm-up: LC 19 — Remove Nth Node From End',
              'End se n-th node hatao.',
              '1→2→3→4→5, n=2 → 1→2→3→5',
              'Two pointers gap n',
              ['Dummy node.', 'fast ko n+1 aage.', 'Dono saath; slow.next = slow.next.next.'],
              `ListNode d = new ListNode(0, head), s = d, f = d;
for (int i = 0; i <= n; i++) f = f.next;
while (f != null) { s = s.next; f = f.next; }
s.next = s.next.next;
return d.next;`,
              'Gap rakho, saath chalo.'),
          ],
        },
        {
          title: 'Part 1 — Mock Q1 (Tum → Sohvi): LC 69 Sqrt(x)',
          blocks: [
            { problem: 69 },
            { list: ['"Brute kya hoga, complexity?"', '"Binary search kis cheez pe?"', '"x = 2³¹ − 1 pe kya toot sakta hai?"', 'Follow-up: "Decimal precision ke saath?"'] },
            { olist: ['Answer kis range me ho sakta hai?', 'mid² ≤ x ka T/F pattern banao.', 'mid × mid int me fit hoga?'] },
            { table: { head: ['Rubric', '1', '3', '5'], rows: [
              ['Clarify', '—', 'x ≥ 0 confirm', 'x = 0, 1, max poocha'],
              ['Brute', '—', 'Linear', 'Linear + O(√x)'],
              ['Optimal', 'Hint se bhi nahi', 'Hint ke baad', 'Khud range pe BS'],
              ['Code', 'Overflow bug', 'Minor', 'Long cast + ans'],
              ['Test', '—', 'x = 8', '0, 1, 8, max'],
              ['Communication', '—', 'Thoda', 'Clear'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Mock Q2 (Sohvi → Tum): LC 1011 Ship Within D Days',
          blocks: [
            { problem: 1011 },
            { list: ['"Capacity ki range kya hai aur kyun?"', '"Greedy kyun optimal hai?"', '"Packages reorder ho sakte toh?"', '"Complexity?"'] },
            { olist: ['Capacity guess karo toh din kaise gino?', 'Capacity badhao toh din?', 'Minimum aur maximum possible capacity?'] },
            { table: { head: ['Rubric', '1', '3', '5'], rows: [
              ['Clarify', '—', 'Order fixed confirm', 'D ≤ n, weights range'],
              ['Brute', '—', 'Linear cap', 'Linear + TLE reason'],
              ['Optimal', 'Hint se', 'Range ke hint se', 'Khud BS on answer'],
              ['Code', 'lo = 1 bug', 'Minor', 'Clean'],
              ['Test', '—', 'Example 1', 'D = 1, D = n'],
              ['Communication', '—', 'Thoda', 'Greedy proof bola'],
            ] } },
          ],
        },
        {
          title: 'Part 3 — Interview communication checklist',
          blocks: [
            { olist: [
              'Restate + example.',
              'Clarify constraints (overflow ke liye size zaroori!).',
              'Brute + complexity.',
              'Optimal: range + check + monotonic — teeno bolo.',
              'Code with narration.',
              'Dry run + edge cases.',
              'Complexity + follow-up.',
            ] },
          ],
        },
        {
          title: 'Part 4 — LeetCode Weekly Contest plan + discussion template + Phase test',
          blocks: [
            { list: [
              'Contest: Sunday 8:00 AM IST. Is hafte dhyan: koi "minimum X such that" question ho toh binary search on answer try karo.',
              'Phase test: Last Minute tab ke saare triggers → pattern zubaani (Sohvi 7/7, Sohel 7/7 + mistakes list).',
            ] },
            { table: { head: ['Discussion template', 'Likho'], rows: [
              ['Pattern', 'Kaunsa'],
              ['Mera approach', 'Kya socha, time'],
              ['Galti', 'WA/TLE kyun'],
              ['Best solution', '2 lines'],
              ['Revise', 'Note'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Mock follow-up sawaal',
          blocks: [
            { qa: [
              ['LC 69 me hi = x/2 kab galat?', 'x = 1 pe.'],
              ['LC 1011 reorder allowed ho toh?', 'Bin packing — NP-hard, BS + greedy invalid.'],
              ['Phase 6 ke 3 shapes?', 'Exact, boundary, answer space.'],
              ['Infinite loop ka reason?', 'hi = mid + lo &lt;= hi.'],
              ['Overflow-safe mid?', 'lo + (hi − lo) / 2.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Aise bolo',
          blocks: [
            { say: [
              ['Mock candidate (LC 1011) opening', 'Let me restate: packages must ship in the given order, each day the total cannot exceed the capacity, and I need the smallest capacity that finishes within the given days. The capacity must be at least the heaviest package and at most the total weight. Trying each capacity is too slow, but a larger capacity never needs more days, so I will binary search the capacity with a greedy day count as the check.'],
              ['Phase wrap-up', 'In this phase I learned that binary search is about monotonic conditions, not just sorted arrays. I can now handle exact search, lower bounds, rotated arrays and binary search on the answer, and I have a consistent template that avoids off-by-one and overflow bugs.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: [
              'Candidate (LC 69): checklist follow karo, long cast mat bhoolna.',
              'Interviewer (LC 1011): script + hint ladder.',
              'Phase test: triggers zubaani.',
              'Contest Q1–Q2.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              'Candidate (LC 1011): 20 min me poora + greedy proof.',
              'Interviewer (LC 69): hint ladder.',
              'Phase test: triggers + mistakes list.',
              'Contest Q1–Q3 + discussion template.',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: [
              'Phase 6 ke saare 8 questions ki one-liners ek page pe.',
              'Mock ki galti wala question kal subah.',
              'Next phase: Trees — roadmap me questions dekh lo.',
            ] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['LC 35 one-liner?', 'Lower bound: pehla ≥ target.'],
              ['LC 153 one-liner?', 'mid &gt; hi → lo = mid + 1, else hi = mid.'],
              ['LC 33 one-liner?', 'Sorted half + range check.'],
              ['LC 875 range?', '[1, max(piles)].'],
              ['LC 410 check?', 'Greedy parts ≤ k.'],
            ] },
          ],
        },
      ],
      checks: [
        'Mock Q1 (LC 69) + rubric',
        'Mock Q2 (LC 1011) + rubric',
        'Contest diya + discussion',
        'Phase test: saare triggers zubaani',
        'Self-test 5/5',
      ],
      memory: 'Phase 6: monotonic condition → aadha phenko. Exact (A), boundary (B), answer space (guess + check).',
    },
  });
})();
