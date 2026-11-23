// Phase 8 (Heap) — Week 2 lessons (local days 8–14). Day 1 (Phase 1) wale format me.
(function () {
  const P = window.PHASE_CONTENT['heap'];
  P.lessons = P.lessons || {};
  const Q = P.questions;

  const sol = (n, i) => {
    const c = Q[n].approaches[i].code;
    return /^class /.test(c) ? c : 'class Solution {\n' + c.split('\n').map(l => (l ? '    ' + l : l)).join('\n') + '\n}';
  };
  const rq = (n, name, one, ex, pattern, steps, code, hook) => [
    { h: `LC ${n} — ${name}` },
    { p: one },
    { pre: ex },
    { p: `<b>Pattern:</b> ${pattern}` },
    { olist: steps },
    { code },
    { tip: `Memory hook: <b>${hook}</b>` },
  ];

  Object.assign(P.lessons, {
    // ======================= DAY 8 =======================
    8: {
      title: 'Top K Frequent: HashMap + Heap',
      goal: 'Phase 1 ka <b>frequency map</b> + aaj ka <b>size-k heap</b> = <b>LC 347 Top K Frequent Elements</b>. Saath me <code>PriorityQueue&lt;int[]&gt;</code> ke comparators bina galti likhna.',
      main: 347,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rq(215, 'Kth Largest (Quickselect)', 'Array ka kth largest, avg O(n).', '[3,2,1,5,6,4], k=2 → target 4 → pivots 1, 6, 5 → 5', '3-way partition + ek side',
              ['target = n − k.', 'Partition < | == | >.', 'target jis block me — wahin jao / return pivot.'],
              `while (i <= gt) {
    if (nums[i] < pivot) swap(nums, lt++, i++);
    else if (nums[i] > pivot) swap(nums, i, gt--);
    else i++;
}`, 'Ek side chhodo → n + n/2 + … = O(n).'),
            ...rq(169, 'Majority Element', '> n/2 baar aane wala element.', '[2,2,1,1,1,2,2] → 2', 'Frequency map / Boyer-Moore',
              ['HashMap: count++ , > n/2 → return.', 'Ya Boyer-Moore: count 0 → naya candidate.'],
              `Map<Integer, Integer> freq = new HashMap<>();
for (int x : nums) {
    int c = freq.getOrDefault(x, 0) + 1;
    if (c > nums.length / 2) return x;
    freq.put(x, c);
}
return -1;`, 'getOrDefault(x, 0) + 1 — aaj bhi yahi pehli line hai.'),
          ],
        },
        {
          title: 'Part 1 — Concept: PriorityQueue of arrays + comparators',
          blocks: [
            { p: '<code>int[]</code> ka koi natural order nahi — PriorityQueue ko <b>comparator</b> dena hi padega, warna <code>ClassCastException</code>.' },
            { table: { head: ['Chahiye', 'Comparator', 'Heap'], rows: [
              ['a[1] chhota top', '<code>(a, b) -&gt; Integer.compare(a[1], b[1])</code>', 'min by a[1]'],
              ['a[1] bada top', '<code>(a, b) -&gt; Integer.compare(b[1], a[1])</code>', 'max by a[1]'],
              ['a[0], tie → a[1]', '<code>Comparator.&lt;int[]&gt;comparingInt(a -&gt; a[0]).thenComparingInt(a -&gt; a[1])</code>', 'lexicographic'],
              ['Map.Entry value se', '<code>(a, b) -&gt; a.getValue() - b.getValue()</code>', 'min by value'],
            ] } },
            { tip: 'Yaad rakhne ka tarika: comparator <b>(a, b)</b> negative de → <b>a pehle (upar)</b>. a − b → chhota upar (min). b − a → bada upar (max).' },
            { p: '<b>Top K frequent = do kadam:</b> (1) frequency map O(n), (2) unique numbers pe "top k by count" → size-k <b>min-heap by count</b> (Day 2 wala pattern, bas key = count).' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 347 Top K Frequent Elements', blocks: [{ problem: 347 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better',
          blocks: [
            { p: '<b>Brute:</b> map banao, keys ki list ko count ke descending sort karo, pehli k. O(n log n) (u unique keys ka sort, u ≤ n).' },
            { p: '<b>Better:</b> Poora sort nahi — sirf top k. Min-heap of size k on <code>{num, count}</code>:' },
            { olist: [
              'freq map.',
              'Har entry: offer <code>{key, count}</code>; size &gt; k → poll (sabse kam count bahar).',
              'Heap me bache k = answer. ans ko peeche se bharo (poll sabse kam count pehle deta hai).',
            ] },
            { p: 'Kal: frequency ≤ n hai → <b>bucket sort O(n)</b>.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: [1,1,1,2,2,3], k = 2',
          blocks: [
            { p: 'freq = <code>{1=3, 2=2, 3=1}</code> (HashMap iteration order yahi).' },
            { table: { head: ['Entry', 'offer ke baad pq', 'size > 2?', 'pq'], rows: [
              ['1=3', '[{1,3}]', 'no', '[{1,3}]'],
              ['2=2', '[{2,2}, {1,3}] (2 < 3 → upar)', 'no', '[{2,2}, {1,3}]'],
              ['3=1', '[{3,1}, {1,3}, {2,2}]', 'poll {3,1}', '[{2,2}, {1,3}]'],
            ] } },
            { table: { head: ['i', 'poll()', 'ans'], rows: [['1', '{2,2}', '[0, 2]'], ['0', '{1,3}', '[1, 2]']] } },
            { p: 'Output <code>[1, 2]</code> ✓' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — sort keys by frequency</b>' },
            { code: sol(347, 0) },
            { p: '<b>Better — min-heap of size k</b>' },
            { code: sol(347, 1) },
            { lines: [
              ['freq.put(x, freq.getOrDefault(x, 0) + 1);', 'Phase 1 frequency pattern.'],
              ['new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]))', 'int[] = {num, count}; count se min-heap.'],
              ['for (Map.Entry<Integer, Integer> e : freq.entrySet())', 'Har unique number ek baar.'],
              ['pq.offer(new int[]{e.getKey(), e.getValue()});', 'Naya pair heap me.'],
              ['if (pq.size() > k) pq.poll();', 'Sabse kam frequent bahar.'],
              ['for (int i = k - 1; i >= 0; i--) ans[i] = pq.poll()[0];', 'Kam count pehle nikalta hai → peeche se bharo (order matter nahi, par neat).'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['<b>freq</b> map + heap (node = num:count).', 'Heap ka order count se hai, number se nahi.', 'Example 3 (negative keys) bhi chalao.'] },
            { viz: 347, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Note'], rows: [
              ['[1], k=1', '[1]', ''],
              ['[4,4,-1,4,-1,7], k=2', '[4,-1]', 'Negative keys normal'],
              ['k = unique count', 'Saare keys', 'Heap kabhi poll nahi karta'],
              ['[1,2,1,2,1,2,3,1,3,2], k=2', '[1,2] / [2,1]', 'Tie counts (1 aur 2 dono 4) — order heap pe depend, dono valid'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [['Sort keys', 'O(n log n)', 'O(n)'], ['Heap size k', 'O(n log k)', 'O(n) (map)'], ['Bucket (kal)', 'O(n)', 'O(n)']] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['PriorityQueue<int[]> bina comparator?', 'Pehle offer pe ClassCastException (int[] Comparable nahi).'],
              ['Min-heap by count kyun (top k frequent ke liye)?', 'Top k me sabse kam frequent ko bahar karna hai — wahi top pe chahiye.'],
              ['Integer.compare vs a − b?', 'Overflow-safe. Counts ke liye a − b bhi chalega, par habit safe wali.'],
              ['Heap me keys ya pairs?', 'Pairs {num, count} ya keys + comparator using map.get — pair faster (no map lookup).'],
              ['Time?', 'O(n + u log k), u = unique.'],
              ['Answer order?', 'Koi bhi order allowed.'],
              ['Map.Entry ko heap me daal sakte?', 'Haan: PriorityQueue<Map.Entry<Integer,Integer>> with getValue comparator.'],
              ['HashMap iteration order guaranteed?', 'Nahi — hash buckets pe depend; LinkedHashMap insertion order deta hai.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'First I count frequencies with a HashMap in O(n). Then I need the k keys with the highest counts. Sorting all unique keys would be O(n log n), but I only need the top k, so I keep a min-heap of {number, count} pairs ordered by count, with size at most k. When it exceeds k I poll the least frequent. After processing every key, the heap holds the k most frequent, which I pop into the answer. That is O(n log k) time and O(n) space for the map.'],
              ['Follow-up: "Comparator kaise likhoge?"', 'Arrays have no natural ordering, so I pass a lambda such as (a, b) -> Integer.compare(a[1], b[1]), which orders by count ascending and makes a min-heap. I prefer Integer.compare over subtraction to avoid overflow with large or negative values.'],
              ['1-minute: Comparator for PriorityQueue of arrays', 'I pass a comparator to the constructor, for example (a, b) -> Integer.compare(a[1], b[1]) to order by the second element ascending. For a max-heap I swap the arguments. For multiple keys, Comparator.comparingInt with thenComparingInt keeps it readable.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [{ olist: ['Frequency map banake print karo.', 'Brute (sort keys) submit.', 'Part 4 heap table paper pe.', 'Comparator ka rule yaad karo: negative → a upar.'] }],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [{ olist: ['<b>Task A:</b> Heap version 7 min.', '<b>Task B:</b> Map.Entry wala version bhi likho.', '<b>Task C:</b> Comparator 1-minute answer record.', '<b>Extra (optional):</b> 2 SQL questions.'] }],
        },
        { title: 'Part 13 — Homework', blocks: [{ list: ['LC 347 heap submit.', 'Kal: bucket sort idea — "frequency max kitni ho sakti hai?" socho.'] }] },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Max-heap by a[1] comparator?', '(a, b) -> Integer.compare(b[1], a[1])'],
              ['347 heap time?', 'O(n log k)'],
              ['[1,1,1,2,2,3], k=2 me kaun poll hua?', '{3,1}'],
              ['ans peeche se kyun?', 'Poll kam count pehle deta hai.'],
              ['Heap me kya store?', '{num, count}'],
            ] },
          ],
        },
      ],
      checks: ['Frequency map + size-k heap combine kiya', 'Comparator rule yaad', 'LC 347 heap Accepted', 'Dry run table banayi', 'Visualizer dekha', '8 sawaal + self-test'],
      memory: 'Top K frequent = freq map + min-heap(count) size k. Comparator: negative → a upar.',
    },

    // ======================= DAY 9 =======================
    9: {
      title: 'Bucket Sort — LC 347 ka O(n) approach',
      goal: 'Jab ranking key ka range chhota ho (frequency ≤ n) → <b>bucket sort</b> O(n). LC 347 bucket version, aur heap vs bucket trade-off. PUSH: LC 215 bina dekhe.',
      main: 347,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rq(347, 'Top K Frequent (heap, kal)', 'k sabse frequent.', '[1,1,1,2,2,3], k=2 → {1=3,2=2,3=1} → heap poll {3,1} → [1,2]', 'Freq map + min-heap size k',
              ['freq map.', 'offer {key, count}; size > k → poll.', 'ans peeche se.'],
              `PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
    pq.offer(new int[]{e.getKey(), e.getValue()});
    if (pq.size() > k) pq.poll();
}`, 'Kam count top pe → bahar.'),
            ...rq(41, 'First Missing Positive', 'Sabse chhota missing positive, O(1) space.', '[3,4,-1,1] → [1,-1,3,4] → 2', 'Index as hash (bounded range 1..n)',
              ['Answer 1..n+1 me.', 'x ko index x−1 pe swap.', 'Pehla galat index + 1.'],
              `for (int i = 0; i < n; i++)
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
        int j = nums[i] - 1;
        int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
    }`, 'Range bounded hai → index hi bucket. Aaj frequency bounded hai → frequency hi index.'),
          ],
        },
        {
          title: 'Part 1 — Concept: Bounded key → bucket',
          blocks: [
            { p: 'Comparison sort ki lower bound O(n log n) hai. Lekin agar key ek <b>chhote range</b> me hai, toh key ko seedha <b>array index</b> bana do — comparison ki zaroorat nahi (counting/bucket sort).' },
            { pre: `nums = [1,1,1,2,2,3]   (n = 6)
freq: 1→3, 2→2, 3→1
bucket index (frequency):  0    1     2     3    4  5  6
bucket:                    ·   [3]   [2]   [1]   ·  ·  ·
Upar se (6 → 1) chalo: f=3 → 1, f=2 → 2 → k=2 pura → [1, 2]` },
            { p: 'Frequency kabhi n se zyada nahi ho sakti → bucket array size <code>n + 1</code>. Ek index pe kai numbers ho sakte hain (same frequency) → <code>List&lt;Integer&gt;[]</code>.' },
            { table: { head: ['', 'Heap', 'Bucket'], rows: [['Time', 'O(n log k)', 'O(n)'], ['Extra space', 'O(k) heap + map', 'O(n) buckets + map'], ['Stream pe?', 'Haan', 'Mushkil (counts badalte)'], ['Kab', 'k chhota, general key', 'Key bounded (freq)']] } },
            { tip: '<code>new List[n + 1]</code> generic array creation warning deta hai ("unchecked") — compile ho jaata hai, interview me bolo "unchecked cast, safe here".' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 347 (Bucket sort)', blocks: [{ problem: 347 }] },
        {
          title: 'Part 3 — Thinking: Heap → Bucket',
          blocks: [
            { p: 'Interviewer: "O(n log n) se better" — heap O(n log k) technically better hai, par k ≈ n pe same. Kya aur better? Frequency ka range dekho: 1..n. Bounded → bucket.' },
            { olist: ['freq map.', 'bucket[f].add(key).', 'f = n se 1 tak; har bucket ke numbers ans me jab tak idx &lt; k.'] },
            { p: '<b>PUSH — LC 215:</b> wahi "top k" family. Heap + quickselect dono bina dekhe likho (Part 5 me reference).' },
          ],
        },
        {
          title: 'Part 4 — Dry run: [1,1,1,2,2,3], k = 2',
          blocks: [
            { table: { head: ['Step', 'key', 'f', 'bucket'], rows: [
              ['1', '1', '3', 'bucket[3] = [1]'],
              ['2', '2', '2', 'bucket[2] = [2]'],
              ['3', '3', '1', 'bucket[1] = [3]'],
            ] } },
            { table: { head: ['f', 'bucket[f]', 'Action', 'ans'], rows: [
              ['6, 5, 4', 'null', 'continue', '[0, 0]'],
              ['3', '[1]', 'ans[0] = 1', '[1, 0]'],
              ['2', '[2]', 'ans[1] = 2 → idx == k', '[1, 2]'],
            ] } },
            { p: 'Loop condition <code>idx &lt; k</code> false → return <b>[1, 2]</b> ✓' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { code: sol(347, 2) },
            { lines: [
              ['List<Integer>[] bucket = new List[nums.length + 1];', 'Index = frequency (0..n). Unchecked generic array, safe.'],
              ['for (int key : freq.keySet())', 'Har unique number.'],
              ['if (bucket[f] == null) bucket[f] = new ArrayList<>();', 'Lazy create — khaali buckets null rehte.'],
              ['for (int f = nums.length; f >= 1 && idx < k; f--)', 'Sabse zyada frequency se neeche; k mile toh ruk jao.'],
              ['if (idx == k) break;', 'Ek bucket me zyada numbers ho sakte hain — beech me ruko.'],
            ] },
            { p: '<b>PUSH — LC 215</b> heap + quickselect:' },
            { code: sol(215, 1) },
            { code: sol(215, 2) },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['<b>Bucket sort</b> variant: bucket array index = frequency.', 'Neeche ans bharta hai jab f upar se neeche aata hai.', 'Heap tab me wapas jaake same input compare karo.'] },
            { viz: 347, ex: 0, variant: 1 },
            { p: 'PUSH: LC 215 heap version Example 2:' },
            { viz: 215, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Kya hota hai'], rows: [
              ['[1], k=1', 'bucket[1] = [1] → [1]'],
              ['Sab numbers ki frequency same', 'Ek bucket me sab — idx == k pe break'],
              ['bucket[0]', 'Kabhi use nahi (freq ≥ 1), loop f ≥ 1 tak'],
              ['Negative numbers', 'Key negative ho sakti, index frequency hai → no issue'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [['Sort', 'O(n log n)', 'O(n)'], ['Heap', 'O(n log k)', 'O(n)'], ['Bucket', 'O(n)', 'O(n)']] } },
            { p: 'Bucket loop: f loop n tak + har key ek baar → O(n).' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Bucket size n + 1 kyun?', 'Frequency 1..n ho sakti hai; index n chahiye.'],
              ['O(n) kaise?', 'Map O(n), bucket fill O(u), scan O(n).'],
              ['Comparison sort lower bound?', 'Ω(n log n) — bucket comparison nahi karta, isliye beat karta hai.'],
              ['Heap kab better?', 'Stream / memory kam (k chhota).'],
              ['Generic array warning?', 'new List[n] raw type → unchecked; safe kyunki sirf Integer lists daal rahe.'],
              ['Quickselect se top k frequent?', 'Unique keys pe count se quickselect — avg O(n) bhi possible.'],
              ['215 me bucket?', 'Values −10⁴..10⁴ bounded → counting array of 20001 → O(n + range).'],
              ['Loop me idx < k check kyun?', 'Jaldi exit; bina iske bhi sahi par extra kaam.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo (Bucket)', 'After counting frequencies, I notice every frequency is between 1 and n. So instead of sorting, I create an array of n + 1 lists where bucket[f] holds the numbers that appear exactly f times. Then I scan from f = n down to 1, appending numbers until I have k. Building the map, filling buckets and scanning are each O(n), so the whole solution is O(n) time and O(n) space.'],
              ['Follow-up: "Heap ya bucket — kaunsa choose karoge?"', 'For a fixed array, bucket sort is O(n) and simple. If data arrives as a stream or memory must stay proportional to k, a size-k heap is better. In an interview I would present the heap first and then the bucket optimization.'],
              ['1-minute: Beating O(n log n) for top-k', 'When the ranking key has a small bounded range, like frequencies from 1 to n, I can bucket by key in an array and scan from the top, giving O(n). Otherwise a size-k heap at O(n log k) or quickselect at average O(n) are the usual choices.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [{ olist: ['Paper pe bucket array banao (Part 1 jaisa) apne input [5,5,6,6,6,7], k=1 ke liye → [6].', 'Bucket code ko visualizer ke saath padho.', 'LC 215 heap version bina dekhe (PUSH).'] }],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [{ olist: ['<b>Task A:</b> Bucket 8 min.', '<b>Task B:</b> LC 215 heap + quickselect bina dekhe, 15 min.', '<b>Task C:</b> 215 ka counting-array (range −10⁴..10⁴) version socho aur bolo.', '<b>Extra (optional):</b> 2 SQL questions.'] }],
        },
        { title: 'Part 13 — Homework', blocks: [{ list: ['LC 347 bucket submit.', 'Kal: LC 973 K Closest — distance² socho.'] }] },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Bucket index kya represent karta hai?', 'Frequency.'],
              ['Bucket time?', 'O(n)'],
              ['[5,5,6,6,6,7], k=1 → ?', '[6]'],
              ['Bucket array size?', 'n + 1'],
              ['Stream pe kaunsa?', 'Heap.'],
            ] },
          ],
        },
      ],
      checks: ['Bucket idea (bounded key → index) samjha', 'LC 347 bucket Accepted', 'Heap vs bucket trade-off bol sakta/sakti hu', 'LC 215 re-solve (PUSH)', 'Visualizer bucket variant dekha', '8 sawaal + self-test'],
      memory: 'Frequency ≤ n → bucket[f]; upar se neeche k utha lo → O(n).',
    },

    // ======================= DAY 10 =======================
    10: {
      title: 'K Closest Points: Max-heap of size k',
      goal: '<b>K smallest → MAX-heap of size k</b> (703/215 ka ulta). <b>LC 973 K Closest Points to Origin</b> — distance² comparator on <code>int[]</code>.',
      main: 973,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rq(347, 'Top K Frequent (bucket, kal)', 'k sabse frequent, O(n).', '[1,1,1,2,2,3] → bucket[3]=[1], bucket[2]=[2] → [1,2]', 'Bucket by frequency',
              ['freq map.', 'bucket[f].add(key).', 'f = n → 1, k tak.'],
              `for (int f = nums.length; f >= 1 && idx < k; f--) {
    if (bucket[f] == null) continue;
    for (int x : bucket[f]) {
        if (idx == k) break;
        ans[idx++] = x;
    }
}`, 'Bounded key → index.'),
            ...rq(199, 'Binary Tree Right Side View', 'Har level ka sabse right node.', '[1,2,3,null,5,null,4] → [1,3,4]', 'BFS level, last node',
              ['Level order (queue).', 'Har level ka last element add.'],
              `Queue<TreeNode> q = new ArrayDeque<>();
if (root != null) q.offer(root);
while (!q.isEmpty()) {
    int size = q.size();
    for (int i = 0; i < size; i++) {
        TreeNode n = q.poll();
        if (i == size - 1) res.add(n.val);
        if (n.left != null) q.offer(n.left);
        if (n.right != null) q.offer(n.right);
    }
}`, 'Level size loop; i == size − 1 = right view.'),
          ],
        },
        {
          title: 'Part 1 — Concept: K smallest → MAX-heap',
          blocks: [
            { p: 'K closest = k <b>smallest</b> distances. Top-k-smallest set me "sabse bura" = sabse <b>bada</b> distance. Naya better point aaye toh wahi bahar jaayega → use top pe rakho → <b>MAX-heap</b> by distance, size k.' },
            { table: { head: ['Problem', 'Rakhna hai', 'Bahar kaun', 'Heap'], rows: [
              ['Kth largest (703, 215)', 'k bade', 'sabse chhota', 'MIN'],
              ['K closest (973)', 'k chhote distance', 'sabse door', 'MAX'],
            ] } },
            { p: '<b>Distance²:</b> √(x² + y²) ka order = x² + y² ka order (sqrt increasing function hai). Double/precision avoid. Max value 2 × 10⁸ &lt; int max (2.1 × 10⁹) → int safe.' },
            { code: `PriorityQueue<int[]> pq = new PriorityQueue<>(
    (a, b) -> Integer.compare(dist(b), dist(a)));   // b pehle → MAX by dist` },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 973 K Closest Points to Origin', blocks: [{ problem: 973 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute:</b> distance² se sort, pehle k. O(n log n).' },
            { p: '<b>Better:</b> max-heap size k. O(n log k), O(k) space, stream-friendly.' },
            { p: '<b>Optimal (avg):</b> quickselect on distance — Day 12 me.' },
            { olist: ['Har point offer.', 'size &gt; k → poll (sabse door).', 'Bache k → ans; closest pehle chahiye toh peeche se bharo.'] },
          ],
        },
        {
          title: 'Part 4 — Dry run: [[3,3],[5,-1],[-2,4]], k = 2',
          blocks: [
            { table: { head: ['p', 'dist²', 'pq ke baad (array)', 'size > 2?', 'pq'], rows: [
              ['[3,3]', '18', '[[3,3]]', 'no', '[[3,3]]'],
              ['[5,-1]', '26', '[[5,-1], [3,3]] (26 bada → upar)', 'no', '[[5,-1], [3,3]]'],
              ['[-2,4]', '20', '[[5,-1], [3,3], [-2,4]]', 'poll [5,-1]', '[[-2,4], [3,3]]'],
            ] } },
            { table: { head: ['i', 'poll()', 'ans'], rows: [['1', '[-2,4] (d=20)', '[null, [-2,4]]'], ['0', '[3,3] (d=18)', '[[3,3], [-2,4]]']] } },
            { p: 'Output <code>[[3,3],[-2,4]]</code> ✓' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — sort</b>' },
            { code: sol(973, 0) },
            { p: '<b>Better — max-heap of size k</b>' },
            { code: sol(973, 1) },
            { lines: [
              ['(a, b) -> Integer.compare(dist(b), dist(a))', 'Arguments ulte → bada distance top pe (max-heap).'],
              ['pq.offer(p);', 'Point ka reference heap me (copy nahi).'],
              ['if (pq.size() > k) pq.poll();', 'Sabse door wala bahar.'],
              ['int[][] ans = new int[k][];', 'Jagged array — rows baad me assign.'],
              ['for (int i = k - 1; i >= 0; i--) ans[i] = pq.poll();', 'Max-heap door wala pehle deta → peeche se → closest pehle.'],
              ['return p[0] * p[0] + p[1] * p[1];', 'sqrt nahi; max 2×10⁸ int me safe.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['Tree node = distance², array = point + d.', 'Root hamesha sabse bada d (max-heap).', 'Example 1 (k = 1) bhi chalao.'] },
            { viz: 973, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Note'], rows: [
              ['k = n', 'Saare points (heap poll nahi karta)'],
              ['[0,0] point', 'd = 0 → hamesha andar'],
              ['(10⁴, 10⁴)', 'd = 2×10⁸ → int safe; bade coords → long'],
              ['Same distance points', 'Problem unique answer guarantee karta hai'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [{ table: { head: ['Approach', 'Time', 'Space'], rows: [['Sort', 'O(n log n)', 'O(log n)'], ['Max-heap k', 'O(n log k)', 'O(k)'], ['Quickselect', 'O(n) avg', 'O(1)']] } }],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Max-heap kyun, k closest ke liye?', 'Top-k-closest me sabse door ko evict karna hai — woh top pe chahiye.'],
              ['sqrt kyun nahi?', 'Order same rehta; double precision + slow.'],
              ['Overflow?', '2×10⁸ max — int safe. Range badi ho toh long.'],
              ['Comparator max-heap ka?', 'Integer.compare(dist(b), dist(a)).'],
              ['Time?', 'O(n log k).'],
              ['Stream of points?', 'Heap perfect — O(k) memory.'],
              ['Ans order?', 'Koi bhi; humne closest pehle.'],
              ['Distance cache karna?', 'Heap me {dist, idx} store kar sakte — comparator me baar baar calc nahi.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'Distance from the origin only needs x² + y², since the square root preserves order. Sorting by that is O(n log n). Better, I keep a max-heap of size k keyed by squared distance: the root is the farthest of my current k candidates, so whenever the heap exceeds k I poll it. After all points, the heap contains the k closest. That is O(n log k) time and O(k) space, and it works on a stream.'],
              ['Follow-up: "Faster?"', 'For a fixed array I can use quickselect on squared distance to place the kth closest at index k − 1 in average O(n), after which the first k points are the answer. It modifies the input and has an O(n²) worst case.'],
              ['1-minute: Max-heap for k smallest', 'To keep the k smallest items, I need fast access to the worst of them, the largest, because that is the one to evict. A max-heap of size k puts it at the root. Each new item is offered and if the size exceeds k I poll the root — O(n log k) time, O(k) space. It mirrors kth largest with a min-heap.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [{ olist: ['Teen points ka distance² haath se nikaalo.', 'Brute (sort) submit.', 'Part 4 table paper pe.', 'Table: kth largest → MIN, k closest → MAX — yaad karo.'] }],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [{ olist: ['<b>Task A:</b> Heap version 6 min.', '<b>Task B:</b> {dist, index} heap version (no recompute).', '<b>Task C:</b> Quickselect ka plan likho (kal code).', '<b>Extra (optional):</b> 2 SQL questions.'] }],
        },
        { title: 'Part 13 — Homework', blocks: [{ list: ['LC 973 heap submit.', 'Kal: LC 295 Median — "median = beech wala" → do halves socho.'] }] },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[[1,3],[-2,2]], k=1?', '[[-2,2]]'],
              ['K closest → kaunsa heap?', 'Max-heap size k.'],
              ['Distance formula code me?', 'x*x + y*y'],
              ['Time?', 'O(n log k)'],
              ['ans peeche se kyun?', 'Max-heap door wala pehle deta.'],
            ] },
          ],
        },
      ],
      checks: ['K smallest → max-heap logic samjha', 'Distance² kyun — bata sakta/sakti hu', 'LC 973 Accepted', 'Dry run khud', 'Visualizer dekha', '8 sawaal + self-test'],
      memory: 'K closest → MAX-heap(dist²) size k; door wala top pe, bahar.',
    },

    // ======================= DAY 11 =======================
    11: {
      title: 'Two Heaps: Median from Data Stream',
      goal: '<b>Two heaps</b> pattern — chhota half max-heap me, bada half min-heap me. <b>LC 295 Find Median from Data Stream</b> (design, Hard).',
      main: 295,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rq(973, 'K Closest Points (kal)', 'Origin ke k sabse paas.', '[[3,3],[5,-1],[-2,4]], k=2 → d 18,26,20 → 26 bahar → [[3,3],[-2,4]]', 'Max-heap size k',
              ['Comparator dist(b) vs dist(a).', 'offer; size > k → poll.', 'ans peeche se.'],
              `PriorityQueue<int[]> pq = new PriorityQueue<>(
    (a, b) -> Integer.compare(dist(b), dist(a)));
for (int[] p : points) {
    pq.offer(p);
    if (pq.size() > k) pq.poll();
}`, 'K closest → MAX-heap.'),
            ...rq(876, 'Middle of the Linked List', 'List ka middle node (do ho toh second).', '1→2→3→4→5 → 3 · 1→…→6 → 4', 'Slow / fast pointers',
              ['slow 1 step, fast 2 step.', 'fast end pe → slow middle.'],
              `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
return slow;`, 'Middle ek baar = slow/fast. Middle baar baar (stream) = two heaps (aaj).'),
          ],
        },
        {
          title: 'Part 1 — Concept: Two heaps',
          blocks: [
            { p: 'Median = sorted order ka beech. Hum numbers ko do half me baantte hain:' },
            { pre: `sorted:  1  3 | 5  15
         low   | high
low  = MAX-heap (chhote numbers) → top = 3  (chhote half ka sabse bada)
high = MIN-heap (bade numbers)   → top = 5  (bade half ka sabse chhota)
median = (3 + 5) / 2.0 = 4.0` },
            { p: '<b>Invariants:</b> (1) low ka har element ≤ high ka har element. (2) <code>low.size() == high.size()</code> ya <code>low.size() == high.size() + 1</code>.' },
            { olist: [
              '<code>low.offer(num)</code> — pehle chhote half me.',
              '<code>high.offer(low.poll())</code> — low ka sabse bada high me → invariant 1 pakka (num galat side me tha toh bhi theek).',
              'Agar high bada ho gaya → <code>low.offer(high.poll())</code> → invariant 2.',
            ] },
            { p: '<b>Median:</b> odd → <code>low.peek()</code>; even → <code>(low.peek() + high.peek()) / 2.0</code>.' },
            { tip: '"/ 2.0" — 2 se divide kiya toh integer division (3/2 = 1). Hamesha 2.0.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 295 Find Median from Data Stream', blocks: [{ problem: 295 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute:</b> list me add O(1), findMedian pe sort O(n log n). Agar findMedian bahut baar → slow.' },
            { p: '<b>Better:</b> sorted list rakho — binary search + insert O(n), median O(1).' },
            { p: '<b>Optimal:</b> median ke liye sirf <b>beech ke 1–2 numbers</b> chahiye: chhote half ka max aur bade half ka min. Dono heaps ke tops! add O(log n), median O(1).' },
            { table: { head: ['', 'addNum', 'findMedian'], rows: [['Brute', 'O(1)', 'O(n log n)'], ['Better', 'O(n)', 'O(1)'], ['Two heaps', 'O(log n)', 'O(1)']] } },
          ],
        },
        {
          title: 'Part 4 — Dry run',
          blocks: [
            { p: '<b>Example 1:</b> add 1, add 2, median, add 3, median' },
            { table: { head: ['Op', 'low.offer', 'low → high', 'balance', 'low', 'high', 'Output'], rows: [
              ['add(1)', '[1]', '1 → high', 'high 1 > low 0 → 1 wapas', '[1]', '[]', 'null'],
              ['add(2)', '[2, 1]', '2 → high', 'equal', '[1]', '[2]', 'null'],
              ['median', '', '', 'sizes equal', '[1]', '[2]', '(1+2)/2.0 = <b>1.5</b>'],
              ['add(3)', '[3, 1]', '3 → high [2, 3]', 'high 2 > 1 → 2 wapas', '[2, 1]', '[3]', 'null'],
              ['median', '', '', 'low bada', '[2, 1]', '[3]', '<b>2.0</b>'],
            ] } },
            { p: '<b>Example 2:</b> add 5 → low [5]; add 15 → low [5], high [15] → median 10.0; add 1 → low [5, 1], high [15]; add 3 → low [3, 1], high [5, 15] → median (3+5)/2.0 = <b>4.0</b> ✓' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute</b>' },
            { code: sol(295, 0) },
            { p: '<b>Better — sorted insert</b>' },
            { code: sol(295, 1) },
            { p: '<b>Optimal — two heaps</b>' },
            { code: sol(295, 2) },
            { lines: [
              ['low = new PriorityQueue<>(Collections.reverseOrder())', 'Max-heap: chhota half; top = chhote half ka max.'],
              ['high = new PriorityQueue<>()', 'Min-heap: bada half; top = bade half ka min.'],
              ['low.offer(num);', 'Pehle low me.'],
              ['high.offer(low.poll());', 'low ka max high me — order invariant safe (num bada tha toh sahi side pahunch gaya).'],
              ['if (high.size() > low.size())', 'Size invariant: low ≥ high.'],
              ['low.offer(high.poll());', 'high ka min wapas low me.'],
              ['if (low.size() > high.size()) return low.peek();', 'Odd count → median low ka top.'],
              ['return (low.peek() + high.peek()) / 2.0;', 'Even → average. 2.0 = double division.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['Do trees: low (max-heap) aur high (min-heap).', 'Har addNum me number low → high → (shayad) wapas low.', 'findMedian pe dono tops highlight.'] },
            { viz: 295, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Note'], rows: [
              ['Ek hi number', 'low me; median = woh'],
              ['Duplicates', 'Normal; ≤ invariant'],
              ['Negatives (−10⁵)', 'Sum −2×10⁵ int safe; huge values → long sum'],
              ['Even count', '/ 2.0 (integer division trap)'],
              ['Sorted stream 1,2,3…', 'Har baar rebalance chalta hai, phir bhi O(log n)'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'addNum', 'findMedian', 'Space'], rows: [['Brute', 'O(1)', 'O(n log n)', 'O(n)'], ['Better', 'O(n)', 'O(1)', 'O(n)'], ['Two heaps', 'O(log n)', 'O(1)', 'O(n)']] } },
            { p: 'addNum me max 3 offer/poll ops (har ek O(log n)).' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['low kaunsa heap?', 'Max-heap (chhote numbers).'],
              ['Size invariant?', 'low == high ya low == high + 1.'],
              ['Num ko seedha low me rakh ke kyun nahi chhodte?', 'Bada num low me reh jaata → order invariant tootta. low → high pass se fix.'],
              ['Odd median?', 'low.peek().'],
              ['/ 2 vs / 2.0?', '/ 2 integer division → galat.'],
              ['Follow-up: saare numbers [0,100]?', 'Count array of 101 + total; median = walk counts → O(100) per query, O(1) add.'],
              ['99% [0,100] me?', 'Count array + do extra sorted lists/heaps for <0 and >100 outliers.'],
              ['Sliding window median?', 'Two heaps + lazy deletion (ya TreeMap) — remove support chahiye.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'The median depends only on the middle one or two values. I split the numbers into a max-heap holding the smaller half and a min-heap holding the larger half, with every element in the first at most every element in the second, and the max-heap equal in size or one larger. To add, I push into the max-heap, move its top to the min-heap to keep the order, and if the min-heap becomes larger I move its top back. The median is the max-heap top for an odd count or the average of both tops. Add is O(log n), median is O(1).'],
              ['Follow-up: "All numbers in [0, 100]?"', 'Then I keep a count array of size 101 and a total. Adding is O(1), and finding the median walks at most 101 buckets to locate the middle positions, which is constant time. If 99 percent are in range, I add separate structures for the few outliers below 0 and above 100, since the median will almost always fall inside the counted range.'],
              ['1-minute: Two heaps technique', 'I maintain a max-heap of the smaller half and a min-heap of the larger half, balanced so the max-heap has the same size or one more. Adding pushes to the max-heap, moves its top to the min-heap, and moves one back if needed. The median is the max-heap root or the average of both roots. O(log n) add, O(1) median.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [{ olist: ['Paper pe sorted line banao aur beech me ek deewar — left low, right high.', 'Example 2 ka table khud banao.', 'Brute submit (sort in findMedian).', 'Visualizer dono examples.'] }],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [{ olist: ['<b>Task A:</b> Two heaps 8 min, bug-free.', '<b>Task B:</b> [0,100] follow-up code (count array).', '<b>Task C:</b> Part 10 answer record (Hard question — clarity!).', '<b>Extra (optional):</b> 2 SQL questions.'] }],
        },
        { title: 'Part 13 — Homework', blocks: [{ list: ['LC 295 submit.', 'Kal catch-up: 973 quickselect + 295 follow-ups.'] }] },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['add 5, 15, 1, 3 ke baad low aur high?', 'low [3, 1], high [5, 15].'],
              ['Uska median?', '4.0'],
              ['addNum ke 3 steps?', 'low.offer(num); high.offer(low.poll()); high bada → low.offer(high.poll()).'],
              ['findMedian time?', 'O(1)'],
              ['Integer division trap?', '/ 2.0 use karo.'],
            ] },
          ],
        },
      ],
      checks: ['Two heaps ke 2 invariants yaad', 'addNum ke 3 steps bina dekhe', 'LC 295 Accepted', 'Dry run (Example 2) khud', 'Visualizer dono examples', '8 sawaal + self-test', '[0,100] follow-up samjha'],
      memory: 'low = max-heap (chhote), high = min-heap (bade). low → high → balance. Median = low top ya tops/2.0.',
    },

    // ======================= DAY 12 =======================
    12: {
      title: 'Catch-up — LC 973 Quickselect + LC 295 Follow-ups',
      goal: 'Koi naya problem nahi — <b>LC 973 ka quickselect (Lomuto)</b> approach, heap vs quickselect decision, aur <b>LC 295</b> bina dekhe + follow-ups.',
      main: 973,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rq(295, 'Find Median (kal)', 'Stream ka median.', 'add 1,2 → 1.5; add 3 → 2.0', 'Two heaps',
              ['low.offer(num).', 'high.offer(low.poll()).', 'high bada → wapas.'],
              `low.offer(num);
high.offer(low.poll());
if (high.size() > low.size()) low.offer(high.poll());`, 'low → high → balance.'),
            ...rq(215, 'Kth Largest (quickselect)', 'Avg O(n).', 'target = n − k', '3-way partition',
              ['pivot beech wala.', '< | == | >.', 'target side.'],
              `if (target < lt) hi = lt - 1;
else if (target > gt) lo = gt + 1;
else return pivot;`, 'Aaj wahi idea 973 pe (Lomuto).'),
            ...rq(875, 'Koko Eating Bananas', 'Min speed k jisse h ghante me sab kha le.', 'piles [3,6,7,11], h=8 → 4', 'Binary search on answer',
              ['lo = 1, hi = max pile.', 'hours(mid) ≤ h → hi = mid, warna lo = mid + 1.', 'hours = Σ ceil(p / k).'],
              `int lo = 1, hi = 0;
for (int p : piles) hi = Math.max(hi, p);
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    long hrs = 0;
    for (int p : piles) hrs += (p + mid - 1) / mid;
    if (hrs <= h) hi = mid; else lo = mid + 1;
}
return lo;`, 'Answer space pe binary search; quickselect = index space pe partition.'),
          ],
        },
        {
          title: 'Part 1 — Concept: Lomuto partition vs 3-way',
          blocks: [
            { pre: `Lomuto (pivot ko end pe rakh ke):
store = lo
for i in lo..hi-1: agar dist(i) < pivot → swap(store, i), store++
swap(store, hi)   → pivot apni final jagah = store
[lo..store-1] < pivot  |  store = pivot  |  [store+1..hi] >= pivot` },
            { p: '973 me points ka order matter nahi — sirf pehle k chahiye. Partition ke baad <code>p == k − 1</code> → pehle k points ready.' },
            { table: { head: ['', 'Max-heap k', 'Quickselect'], rows: [
              ['Time', 'O(n log k) guaranteed', 'O(n) avg, O(n²) worst'],
              ['Space', 'O(k)', 'O(1)'],
              ['Input modify', 'Nahi', 'Haan'],
              ['Stream', 'Haan', 'Nahi'],
              ['Interview default', 'Pehle ye', 'Follow-up'],
            ] } },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 973 (Quickselect)', blocks: [{ problem: 973 }] },
        {
          title: 'Part 3 — Thinking',
          blocks: [
            { olist: [
              'lo = 0, hi = n − 1.',
              'p = partition(lo, hi) (middle pivot end pe swap karke Lomuto).',
              'p == k − 1 → break; p &lt; k − 1 → lo = p + 1; warna hi = p − 1.',
              'Return <code>Arrays.copyOfRange(points, 0, k)</code>.',
            ] },
            { p: '<b>PUSH — LC 295:</b> bina dekhe likho, fir follow-ups (Part 9).' },
          ],
        },
        {
          title: 'Part 4 — Dry run: [[3,3],[5,-1],[-2,4]], k = 2',
          blocks: [
            { table: { head: ['Round', 'lo..hi', 'Pivot (mid → end)', 'Scan', 'Result', 'Decision'], rows: [
              ['1', '0..2', '[5,-1] d=26 → swap idx 1,2', '18 < 26 ✓, 20 < 26 ✓', 'store = 2 → p = 2', 'p 2 > k−1 1 → hi = 1'],
              ['2', '0..1', '[3,3] d=18 → swap idx 0,1', '20 < 18 ✗', 'p = 0 → [[3,3],[-2,4]]', 'p 0 < 1 → lo = 1'],
              ['—', 'lo == hi', '', '', '', 'loop khatam'],
            ] } },
            { p: 'Return pehle 2: <code>[[3,3],[-2,4]]</code> ✓ (Java run se verify).' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { code: sol(973, 2) },
            { lines: [
              ['int p = partition(points, lo, hi);', 'Pivot ki final index.'],
              ['if (p == k - 1) break;', 'Index 0..k−1 me exactly k closest.'],
              ['swap(pts, lo + (hi - lo) / 2, hi);', 'Middle pivot ko end pe (sorted input pe bhi acha).'],
              ['if (dist(pts[i]) < pivot) swap(pts, store++, i);', 'Chhote distance left me.'],
              ['swap(pts, store, hi);', 'Pivot apni jagah.'],
              ['return Arrays.copyOfRange(points, 0, k);', 'Pehle k rows.'],
            ] },
            { p: '<b>PUSH — LC 295</b> reference:' },
            { code: sol(295, 2) },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['973 heap visualizer Example 1 — quickselect se compare: heap me order heap ka, quickselect me array ka.', 'LC 295 Example 2 — 4 numbers ke saath rebalancing.'] },
            { viz: 973, ex: 0 },
            { viz: 295, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Note'], rows: [
              ['k = n', 'Loop me p jaldi n−1 pe… ya lo == hi; poora array'],
              ['n = 1', 'while skip → [[x, y]]'],
              ['Bahut same distances', 'Lomuto O(n²) ho sakta → 3-way/random pivot'],
              ['295: findMedian bahut zyada', 'O(1) — fine'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [{ table: { head: ['Problem / Approach', 'Time', 'Space'], rows: [['973 heap', 'O(n log k)', 'O(k)'], ['973 quickselect', 'O(n) avg', 'O(1)'], ['295 two heaps', 'add O(log n), median O(1)', 'O(n)']] } }],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Lomuto me pivot end pe kyun?', 'Scan ke dauraan pivot hile nahi; end me ek swap se final jagah.'],
              ['973 quickselect worst case?', 'O(n²) — bad pivots.'],
              ['Heap ya quickselect — default?', 'Heap (safe, short); quickselect follow-up.'],
              ['295: remove(num) bhi chahiye toh?', 'Lazy deletion map ya TreeMap multiset.'],
              ['295: median ki jagah 25th percentile?', 'Heaps ka size ratio 1:3 rakho.'],
              ['295 thread-safe?', 'addNum/findMedian synchronized (dono heaps ek saath consistent).'],
              ['Quickselect 973 me order guaranteed?', 'Nahi — any order allowed.'],
              ['copyOfRange new array?', 'Haan, k rows ka naya array (references same).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['973 Quickselect explain karo', 'I partition the points by squared distance using a middle pivot moved to the end, Lomuto style, which places the pivot at its final index p. If p equals k − 1, the first k points are the closest; if p is smaller I continue on the right part, otherwise on the left. On average each step halves the range, so it is O(n) time and O(1) extra space, with an O(n²) worst case.'],
              ['Heap vs quickselect', 'Quickselect is average O(n) and O(1) space, but it needs all data, mutates input and has a quadratic worst case. A size-k max-heap is O(n log k), O(k) space, guaranteed, non-mutating and stream-friendly. I implement the heap first and offer quickselect as an optimization.'],
              ['295 percentile follow-up', 'For an arbitrary percentile p, I keep the same two heaps but balance them so the lower heap holds p percent of the elements; its top is then the p-th percentile, still O(log n) per add.'],
            ] },
          ],
        },
        { title: 'Part 11 — Sohvi session', blocks: [{ olist: ['973 heap dobara bina dekhe.', '295 ke dono examples paper pe.', 'Quickselect sirf visual samajh (code optional).'] }] },
        { title: 'Part 12 — Sohel session (SDE-2 practice)', blocks: [{ olist: ['<b>Task A:</b> 973 quickselect 12 min.', '<b>Task B:</b> 295 bina dekhe 7 min.', '<b>Task C:</b> 295 [0,100] count-array code.', '<b>Extra (optional):</b> 2 SQL questions.'] }] },
        { title: 'Part 13 — Homework', blocks: [{ list: ['973 quickselect submit.', 'Kal Saturday revision: 347, 973, 295, 1046.'] }] },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Quickselect 973 stop condition?', 'p == k − 1.'],
              ['Lomuto return?', 'store (pivot ki final index).'],
              ['Heap 973 time?', 'O(n log k).'],
              ['295 low ka type?', 'Max-heap.'],
              ['Default interview choice 973?', 'Heap, fir quickselect mention.'],
            ] },
          ],
        },
      ],
      checks: ['973 quickselect likha + Accepted', 'Heap vs quickselect table yaad', '295 bina dekhe (PUSH)', '295 follow-ups bol sakta/sakti hu', 'Visualizers dekhe', '8 sawaal + self-test'],
      memory: 'Lomuto: pivot end pe, chhote left, p == k−1 → done. Heap safe default, quickselect follow-up.',
    },

    // ======================= DAY 13 (Sat revision) =======================
    13: {
      title: 'Revision — Week 2 (Top K + Two Heaps)',
      goal: 'LC 347, 973, 295 + Week 1 ka LC 1046 — bina dekhe, timer ke saath. Sohel: System Design session.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan',
          blocks: [
            { table: { head: ['Question', 'Sohvi', 'Sohel'], rows: [
              ['LC 347 Top K Frequent', '20 min (heap)', '10 min (heap + bucket)'],
              ['LC 973 K Closest', '20 min', '8 min (+ quickselect)'],
              ['LC 295 Median', '25 min (brute ok)', '8 min'],
              ['LC 1046 Last Stone', '10 min', '4 min'],
            ] } },
            { list: ['Pehle pattern + complexity bolo.', 'Atke → sirf memory hook.', 'Dry run visualizer se match.'] },
          ],
        },
        {
          title: 'Part 1 — LC 347 Top K Frequent',
          blocks: [
            { pre: '[1,1,1,2,2,3], k=2 → freq {1=3,2=2,3=1} → heap/bucket → [1,2]' },
            { p: '<b>Pattern:</b> freq map + min-heap(count) size k · ya bucket[f].' },
            { code: sol(347, 1) },
            { tip: 'Memory hook: <b>kam count top pe → bahar; ya freq ≤ n → bucket.</b>' },
            { viz: 347, ex: 2 },
          ],
        },
        {
          title: 'Part 2 — LC 973 K Closest Points',
          blocks: [
            { pre: 'd = 18, 26, 20 (k=2) → max-heap evicts 26 → [[3,3],[-2,4]]' },
            { p: '<b>Pattern:</b> max-heap(dist²) size k.' },
            { code: sol(973, 1) },
            { tip: 'Memory hook: <b>k closest → MAX-heap; dist(b) vs dist(a).</b>' },
          ],
        },
        {
          title: 'Part 3 — LC 295 Find Median',
          blocks: [
            { pre: 'add 5,15,1,3 → low [3,1] | high [5,15] → (3+5)/2.0 = 4.0' },
            { p: '<b>Pattern:</b> two heaps.' },
            { code: sol(295, 2) },
            { tip: 'Memory hook: <b>low → high → balance; / 2.0.</b>' },
          ],
        },
        {
          title: 'Part 4 — LC 1046 Last Stone Weight',
          blocks: [
            { pre: '[2,7,4,1,8,1] → 1' },
            { code: sol(1046, 1) },
            { tip: 'Memory hook: <b>poll, poll, offer(farak).</b>' },
          ],
        },
        {
          title: 'Part 5 — Interview mix',
          blocks: [
            { qa: [
              ['Kth largest vs k closest — heap type?', 'Min-heap vs max-heap (size k dono).'],
              ['347 O(n) kaise?', 'Bucket by frequency.'],
              ['295 invariants?', 'low ≤ high elements; low.size() = high.size() ya +1.'],
              ['PriorityQueue remove(obj)?', 'O(n).'],
              ['PriorityQueue iterate sorted?', 'Nahi, poll karo.'],
              ['Comparator overflow fix?', 'Integer.compare.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — 1-minute answers',
          blocks: [
            { say: [
              ['PriorityQueue internals', 'PriorityQueue is a binary heap in a resizable array, min-heap by natural order or by a comparator. offer appends and sifts up, poll moves the last element to the root and sifts down, both O(log n); peek is O(1). remove of an arbitrary object and contains are O(n). Iteration order is the internal array order, not sorted. It disallows null and is not thread-safe; PriorityBlockingQueue is the concurrent version.'],
              ['Two heaps', 'A max-heap of the smaller half and a min-heap of the larger half, balanced so the max-heap has equal size or one more. The median is the max-heap root or the average of both roots: O(log n) add and O(1) median.'],
            ] },
          ],
        },
        { title: 'Part 7 — Sohvi session', blocks: [{ olist: ['347 heap + 973 heap bina dekhe.', '295 brute + optimal ka idea paper pe.', '1046 4 min me.'] }] },
        {
          title: 'Part 8 — Sohel session (+ System Design)',
          blocks: [
            { olist: [
              'Saare 4 timer me; 347 bucket + 973 quickselect bhi.',
              '<b>System Design session (1/week):</b> "Design a job scheduler / delayed task queue" — priority queue by run-time, persistence (DB + index on next_run_at), workers polling, leader election / sharding, retries. 45 min.',
              'SQL optional.',
            ] },
          ],
        },
        { title: 'Part 9 — Homework', blocks: [{ list: ['Kal mock: Tum → Sohvi LC 1046, Sohvi → Tum LC 295.', 'Last Minute tab poora padho (phase test).', 'Contest Sunday 8:00 AM IST.'] }] },
        {
          title: 'Part 10 — Final self-test',
          blocks: [
            { qa: [
              ['347 heap comparator?', '(a, b) -> Integer.compare(a[1], b[1])'],
              ['973 heap comparator?', '(a, b) -> Integer.compare(dist(b), dist(a))'],
              ['295 add 1,2 → median?', '1.5'],
              ['1046 [3,3]?', '0'],
              ['Bucket size 347?', 'n + 1'],
            ] },
          ],
        },
      ],
      checks: ['4 me se 3 timer ke andar', 'Comparators bina galti', 'Interview mix 6/6', '1-minute answers', 'Sohel: System Design done', 'Galtiyon ki list update'],
      memory: 'Week 2: freq + heap/bucket, k closest max-heap, two heaps median.',
    },

    // ======================= DAY 14 (Sun mock) =======================
    14: {
      title: 'Mock Interview + Contest + Phase Test',
      goal: '<b>Tum → Sohvi: LC 1046</b>, <b>Sohvi → Tum: LC 295</b>. Contest discussion + Phase 8 test (Last Minute one-liners).',
      main: null,
      parts: [
        {
          title: 'Part 0 — Mock format',
          blocks: [
            { table: { head: ['Slot', 'Kya', 'Time'], rows: [['1', 'Tum → Sohvi: LC 1046', '30 min'], ['2', 'Sohvi → Tum: LC 295', '30 min'], ['3', 'Contest discussion + phase test', '30 min']] } },
          ],
        },
        {
          title: 'Part 1 — Mock Q1 (Tum → Sohvi): LC 1046',
          blocks: [
            { problem: 1046 },
            { p: '<b>Poocho:</b> "Har round kya chahiye?" · "Sort ka cost?" · "Kaunsa data structure?" · "PriorityQueue ke bina?"' },
            { olist: ['Hint 1: Har round ke do sabse bade.', 'Hint 2: Baar baar max → ?', 'Hint 3: Max-heap = reverseOrder.', 'Hint 4: y != x → offer(y − x).'] },
            { table: { head: ['Area', 'Kya dekhna', 'Score /5'], rows: [['Clarify', 'Empty result → 0?', ''], ['Brute', 'Sort per round', ''], ['Optimal', 'Max-heap', ''], ['Code', 'Empty check before peek', ''], ['Test', '[3,3], [1]', ''], ['Communication', '', '']] } },
            { viz: 1046, ex: 0 },
          ],
        },
        {
          title: 'Part 2 — Mock Q2 (Sohvi → Tum): LC 295',
          blocks: [
            { problem: 295 },
            { p: '<b>Sohvi puche:</b> "Brute?" · "findMedian kitni baar?" · "Invariants?" · "[0,100] follow-up?" · "Thread-safe?"' },
            { olist: ['Hint 1: Median ke liye sirf beech ke 2.', 'Hint 2: Do halves.', 'Hint 3: Chhota half → max-heap.', 'Hint 4: low → high → balance.'] },
            { table: { head: ['Area', 'Kya dekhna', 'Score /5'], rows: [['Clarify', 'Call ratio, value range', ''], ['Brute', 'Sort / sorted insert', ''], ['Optimal', 'Two heaps + invariants', ''], ['Code', '/ 2.0, balance', ''], ['Test', 'Example 2', ''], ['Communication', 'Follow-ups', '']] } },
            { viz: 295, ex: 1 },
          ],
        },
        {
          title: 'Part 3 — Interview communication checklist',
          blocks: [{ list: ['Design question: operations + frequency pehle.', 'Invariants zor se bolo (Hard questions me yahi score karta hai).', 'Brute → optimal ka reason.', 'Code ke baad sequence dry run.', 'Follow-ups ke liye 1–2 line answers ready.'] }],
        },
        {
          title: 'Part 4 — LeetCode Weekly Contest + Phase test',
          blocks: [
            { table: { head: ['Q', 'Pattern', 'Time', 'Galti', 'Seekh'], rows: [['Q1', '', '', '', ''], ['Q2', '', '', '', ''], ['Q3', '', '', '', '']] } },
            { p: '<b>Phase test:</b> Last Minute tab ke saare "Signal → Pattern" bina dekhe bolo; 6 questions ki one-line approach 3 min me.' },
          ],
        },
        {
          title: 'Part 5 — Interview Q&A',
          blocks: [
            { qa: [
              ['Top K ke 4 options?', 'Sort, size-k heap, quickselect, bucket/counting.'],
              ['Heap peek/offer/poll?', 'O(1) / O(log n) / O(log n).'],
              ['Heapify?', 'O(n).'],
              ['295 add/median?', 'O(log n) / O(1).'],
              ['Max-heap Java?', 'Collections.reverseOrder().'],
              ['Kth largest heap?', 'Min-heap size k.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Aise bolo',
          blocks: [
            { say: [
              ['Top K trade-offs', 'Full sort is O(n log n) and simplest. A size-k heap is O(n log k) time, O(k) space, and works on streams. Quickselect is average O(n) with O(1) space but mutates input and has an O(n²) worst case. Bucket or counting sort is O(n) when the key range is small, like frequencies. I usually present the heap, then mention quickselect or buckets depending on constraints.'],
              ['Phase summary', 'Heaps give O(1) access to the best element and O(log n) updates. The key patterns are: a min-heap of size k for kth largest and top k, a max-heap of size k for k smallest or closest, a max-heap simulation for repeatedly taking the largest, and two heaps for a running median.'],
            ] },
          ],
        },
        { title: 'Part 7 — Sohvi session', blocks: [{ list: ['Rubric ke weak points note.', '1046 + 703 phir se agar mock me atki.', 'Phase 8 ki apni 1-page notes.'] }] },
        { title: 'Part 8 — Sohel session', blocks: [{ list: ['295 + follow-ups 10 min me.', 'Contest Q3 upsolve.', 'SQL optional.'] }] },
        { title: 'Part 9 — Homework', blocks: [{ list: ['Next phase: Backtracking — LC 78 Subsets padh lo.', 'Heap ke 6 questions ki one-liners ek card pe likho.'] }] },
        {
          title: 'Part 10 — Self-test',
          blocks: [
            { qa: [
              ['1046 complexity?', 'O(n log n)'],
              ['295 invariants?', 'Order + size (low = high ya +1).'],
              ['973 heap?', 'Max-heap size k.'],
              ['347 O(n)?', 'Bucket.'],
              ['215 avg O(n)?', 'Quickselect.'],
            ] },
          ],
        },
      ],
      checks: ['Mock 1 + rubric', 'Mock 2 + rubric', 'Contest diya + discussion', 'Phase test: saare signals bole', 'Feedback likha'],
      memory: 'Phase 8: min-heap k (largest), max-heap k (closest), max-heap sim, two heaps median.',
    },
  });
})();
