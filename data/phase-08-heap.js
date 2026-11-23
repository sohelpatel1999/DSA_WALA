window.PHASE_CONTENT = window.PHASE_CONTENT || {};

window.PHASE_CONTENT['heap'] = {
  intro: 'Heap = "sabse bada / sabse chhota abhi turant chahiye" wala data structure. Peek O(1), insert/remove O(log n). Top K, Kth largest, median aur "baar baar max nikalo" — sab heap ke kaam hain. Pehle andar ka structure (array + tree), fir Java PriorityQueue, fir patterns.',

  // ---------------- FUNDAMENTALS ----------------
  fundamentals: [
    {
      h: 'Heap kya hai?',
      body: `<p>Heap ek <b>complete binary tree</b> hai (har level bhara hua, last level left se bharta hai) jo <b>heap property</b> follow karta hai:</p>
<ul>
<li><b>Min-heap:</b> har parent ≤ uske children → <b>root = sabse chhota</b>.</li>
<li><b>Max-heap:</b> har parent ≥ uske children → <b>root = sabse bada</b>.</li>
</ul>
<p>Dhyan do: heap <b>sorted nahi</b> hota. Sirf parent-child ka rishta fix hai, siblings ke beech koi order nahi. Isliye sirf top (root) O(1) me milta hai — baaki ke liye poll karte jao.</p>
<pre>Min-heap                     Max-heap
        1                            9
      /   \\                        /   \\
     3     2                      7     8
    / \\   /                      / \\   /
   7   4 5                      3   5 6

array: [1, 3, 2, 7, 4, 5]     array: [9, 7, 8, 3, 5, 6]</pre>
<p class="tip">BST (Phase 7) me left &lt; root &lt; right hota hai — heap me aisa kuch nahi. Heap me sirf "parent upar wala champion hai".</p>`,
    },
    {
      h: 'Heap = Array (index formulas)',
      body: `<p>Complete tree me koi gap nahi hota, isliye heap ko <b>array</b> me level-order (BFS order, Phase 7 LC 102 jaisa) rakh dete hain. Pointers ki zaroorat nahi — index se parent/child nikalte hain:</p>
<table class="tbl"><thead><tr><th>Kya chahiye</th><th>Formula (0-indexed)</th><th>Example i = 1 (value 3)</th></tr></thead><tbody>
<tr><td>Parent</td><td><code>(i − 1) / 2</code></td><td>(1−1)/2 = 0 → 1</td></tr>
<tr><td>Left child</td><td><code>2i + 1</code></td><td>3 → 7</td></tr>
<tr><td>Right child</td><td><code>2i + 2</code></td><td>4 → 4</td></tr>
<tr><td>Last non-leaf</td><td><code>n/2 − 1</code></td><td>n = 6 → index 2</td></tr>
<tr><td>Height</td><td><code>⌊log₂ n⌋</code></td><td>n = 6 → 2</td></tr>
</tbody></table>
<pre>index:   0   1   2   3   4   5
value: [ 1 | 3 | 2 | 7 | 4 | 5 ]
         │   │   └─ children: 5 (idx 5)
         │   └───── children: 7 (idx 3), 4 (idx 4)
         └───────── children: 3 (idx 1), 2 (idx 2)</pre>
<p class="tip">Height sirf log n hai → upar ya neeche ek path chalna = <b>O(log n)</b>. Yahi heap ki speed ka raaz hai.</p>`,
    },
    {
      h: 'Sift Up, Sift Down, Heapify',
      body: `<p><b>Insert (offer) → sift up:</b> naya element array ke end me daalo (tree ka last slot), fir jab tak parent se "better" hai (min-heap me chhota) tab tak parent se swap karo.</p>
<pre>min-heap [1, 3, 2, 7, 4, 5] me offer(0):
[1, 3, 2, 7, 4, 5, 0]   0 index 6 pe, parent idx 2 (2) → 0 &lt; 2 swap
[1, 3, 0, 7, 4, 5, 2]   parent idx 0 (1) → 0 &lt; 1 swap
[0, 3, 1, 7, 4, 5, 2]   root pahunch gaya → stop</pre>
<p><b>Remove top (poll) → sift down:</b> root nikalo, <b>last element ko root pe</b> rakho, fir jab tak kisi child se "worse" hai, <b>better child</b> (min-heap me chhota child) se swap karo.</p>
<pre>[0, 3, 1, 7, 4, 5, 2] poll() → 0 return
[2, 3, 1, 7, 4, 5]      last (2) root pe; children 3, 1 → chhota 1 → swap
[1, 3, 2, 7, 4, 5]      idx 2 ke children: 5 → 2 &lt; 5 → stop</pre>
<p><b>Heapify (build heap) O(n):</b> poore array ko heap banana — last non-leaf (n/2 − 1) se index 0 tak har node pe sift down. Zyada nodes neeche hain aur unka sift down chhota hai, isliye total <b>O(n)</b> (n baar offer = O(n log n)). Java me <code>new PriorityQueue&lt;&gt;(collection)</code> yahi karta hai.</p>`,
    },
    {
      h: 'Java PriorityQueue Cheat Sheet',
      code: `// Min-heap (default: natural order, chhota top pe)
PriorityQueue<Integer> min = new PriorityQueue<>();

// Max-heap (bada top pe)
PriorityQueue<Integer> max = new PriorityQueue<>(Collections.reverseOrder());
PriorityQueue<Integer> max2 = new PriorityQueue<>((a, b) -> Integer.compare(b, a));
// (a, b) -> b - a bhi chalta hai, lekin bade/negative numbers pe overflow ho sakta hai

pq.offer(x);      // insert            O(log n)   (add() bhi same)
pq.peek();        // top dekho         O(1)       (empty → null)
pq.poll();        // top nikalo        O(log n)   (empty → null)
pq.size();  pq.isEmpty();
pq.remove(obj);   // koi bhi element   O(n)  — search linear hai
pq.contains(obj); //                   O(n)

// Arrays compare karna (int[] ka natural order nahi hota → comparator zaroori)
PriorityQueue<int[]> byFreq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
PriorityQueue<int[]> farFirst = new PriorityQueue<>(
    (a, b) -> Integer.compare(b[0] * b[0] + b[1] * b[1], a[0] * a[0] + a[1] * a[1]));
PriorityQueue<int[]> lex = new PriorityQueue<>(
    Comparator.<int[]>comparingInt(a -> a[0]).thenComparingInt(a -> a[1]));

// Map.Entry ko value se
PriorityQueue<Map.Entry<Integer, Integer>> pe =
    new PriorityQueue<>((a, b) -> a.getValue() - b.getValue());

// Heapify O(n) — collection se seedha heap
PriorityQueue<Integer> h = new PriorityQueue<>(list);

// DHYAN: for-each / toString heap ka ANDAR ka array order deta hai, sorted nahi!
System.out.println(pq);                 // [1, 3, 2, 7] jaisa
while (!pq.isEmpty()) pq.poll();        // sorted order chahiye toh poll karo`,
    },
    {
      h: 'Yaad rakhne wali baatein',
      body: `<ul>
<li><b>Kth LARGEST → MIN-heap of size k</b>. Ulta lagta hai, par min-heap ka top = k bade numbers me sabse chhota = kth largest. Size k se bada hua → <code>poll()</code>.</li>
<li><b>Kth SMALLEST / K closest → MAX-heap of size k</b> (top = k chhoton me sabse bada → bahar fekne ka candidate).</li>
<li>Size-k heap: time <b>O(n log k)</b>, space <b>O(k)</b> — n bahut bada aur k chhota ho toh sort (O(n log n)) se better, aur <b>stream</b> pe bhi chalta hai.</li>
<li><code>peek()</code>/<code>poll()</code> empty heap pe <b>null</b> dete hain → <code>int x = pq.poll();</code> pe NullPointerException (unboxing). Pehle size check.</li>
<li>Comparator me <code>a - b</code> overflow kar sakta hai (e.g. <code>Integer.MIN_VALUE</code>) → <code>Integer.compare(a, b)</code> safe hai.</li>
<li>PriorityQueue <b>thread-safe nahi</b> (thread-safe chahiye → <code>PriorityBlockingQueue</code>), aur <b>null allow nahi</b> karta.</li>
<li><b>Two heaps</b>: chhota half max-heap me, bada half min-heap me → beech wale (median) dono tops pe.</li>
</ul>`,
    },
  ],

  // ---------------- OPERATIONS ----------------
  operations: [
    { op: 'Peek (min/max)', time: 'O(1)', note: 'Root = index 0', code: 'int top = pq.peek();   // heap[0]' },
    { op: 'Insert (offer)', time: 'O(log n)', note: 'End me daalo, sift up (height = log n)', code: 'pq.offer(x);\n// heap[size] = x; jab tak parent se better → swap' },
    { op: 'Remove top (poll)', time: 'O(log n)', note: 'Last ko root pe, sift down', code: 'int top = pq.poll();\n// heap[0] = heap[--size]; better child se swap' },
    { op: 'Build heap (heapify)', time: 'O(n)', note: 'n/2−1 se 0 tak sift down', code: 'PriorityQueue<Integer> pq = new PriorityQueue<>(list);' },
    { op: 'n baar offer', time: 'O(n log n)', note: 'Ek-ek karke daalna (heapify se slow)', code: 'for (int x : nums) pq.offer(x);' },
    { op: 'Size-k heap (Top K)', time: 'O(n log k)', note: 'Heap kabhi k+1 se bada nahi hota', code: 'pq.offer(x);\nif (pq.size() > k) pq.poll();' },
    { op: 'Remove any element', time: 'O(n)', note: 'Pehle linear search, fir sift', code: 'pq.remove(obj);' },
    { op: 'Search / contains', time: 'O(n)', note: 'Heap sorted nahi → binary search nahi', code: 'pq.contains(x);' },
    { op: 'Heap sort', time: 'O(n log n)', note: 'Sab daalo, n baar poll (sorted order)', code: 'while (!pq.isEmpty()) out.add(pq.poll());' },
  ],

  // ---------------- PATTERNS ----------------
  patterns: [
    {
      name: 'Top K / Kth Largest → Min-heap of size k',
      signal: '"Kth largest", "top k", "k most frequent", "stream me kth"',
      idea: 'Min-heap me sirf k sabse bade rakho. Size k se upar gaya → sabse chhota poll. Top = kth largest. O(n log k).',
      code: `PriorityQueue<Integer> pq = new PriorityQueue<>(); // min-heap
for (int x : nums) {
    pq.offer(x);
    if (pq.size() > k) pq.poll();
}
return pq.peek(); // kth largest`,
      qs: [703, 215, 347],
    },
    {
      name: 'K Smallest / K Closest → Max-heap of size k',
      signal: '"k closest", "k smallest", "nearest k"',
      idea: 'Max-heap (comparator ulta). Top = abhi tak ke k me sabse bura (door) → naya behtar aaya toh woh bahar.',
      code: `PriorityQueue<int[]> pq = new PriorityQueue<>(
    (a, b) -> Integer.compare(dist(b), dist(a))); // max by distance
for (int[] p : points) {
    pq.offer(p);
    if (pq.size() > k) pq.poll();
}`,
      qs: [973],
    },
    {
      name: 'Repeated Max/Min Extraction (Simulation)',
      signal: '"Har baar sabse bade do uthao", "process largest first"',
      idea: 'Max-heap me sab daalo. Har round poll, poll, result wapas offer. Har round O(log n).',
      code: `PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
for (int s : stones) pq.offer(s);
while (pq.size() > 1) {
    int y = pq.poll(), x = pq.poll();
    if (y != x) pq.offer(y - x);
}`,
      qs: [1046],
    },
    {
      name: 'Two Heaps (Median)',
      signal: '"Median", "stream", "beech wala element", "dono halves balance"',
      idea: 'low = max-heap (chhota half), high = min-heap (bada half). low.size() == high.size() ya +1. Median = low.peek() ya dono tops ka average.',
      code: `low.offer(num);
high.offer(low.poll());          // low ka max high me
if (high.size() > low.size())    // balance
    low.offer(high.poll());
// median: odd → low.peek(), even → (low.peek() + high.peek()) / 2.0`,
      qs: [295],
    },
    {
      name: 'Quickselect (Partition)',
      signal: '"Kth largest / k closest" + "average O(n)" follow-up, poora sort nahi chahiye',
      idea: 'Quick sort ka partition: pivot apni final jagah pahunchta hai. Target index ki side me hi aage jao, doosri side chhod do. Avg O(n), worst O(n²).',
      code: `int target = n - k;               // ascending index
while (lo < hi) {
    // partition [lo..hi] around pivot → [< | == | >]
    if (target < lt) hi = lt - 1;
    else if (target > gt) lo = gt + 1;
    else return pivot;
}`,
      qs: [215, 973],
    },
    {
      name: 'Bucket Sort by Frequency',
      signal: '"Top k frequent" + "O(n log n) se better"',
      idea: 'Frequency max n hi ho sakti hai → bucket[f] = jin numbers ki frequency f hai. High f se neeche chalo, k le lo. O(n).',
      code: `List<Integer>[] bucket = new List[n + 1];
for (int key : freq.keySet()) {
    int f = freq.get(key);
    if (bucket[f] == null) bucket[f] = new ArrayList<>();
    bucket[f].add(key);
}`,
      qs: [347],
    },
  ],

  // ---------------- QUESTIONS ----------------
  questions: {
    703: {
      oneLine: 'Min-heap of size k: offer(val), size > k toh poll(); peek() = kth largest.',
      pattern: 'Top K — Min-heap of size k (Design)',
      approaches: [
        {
          level: 'Brute', idea: 'Saare numbers ek list me. Har add pe list sort karo aur size − k index return karo.',
          time: 'O(n log n) per add', space: 'O(n)',
          code: `class KthLargest {
    private final int k;
    private final List<Integer> list = new ArrayList<>();

    public KthLargest(int k, int[] nums) {
        this.k = k;
        for (int x : nums) list.add(x);
    }

    public int add(int val) {
        list.add(val);
        Collections.sort(list);
        return list.get(list.size() - k);
    }
}`,
        },
        {
          level: 'Better', idea: 'List ko hamesha sorted rakho: binary search se sahi jagah dhundo aur wahan insert karo (shifting O(n)). Sort ki zaroorat nahi.',
          time: 'O(n) per add', space: 'O(n)',
          code: `class KthLargest {
    private final int k;
    private final List<Integer> list = new ArrayList<>(); // ascending sorted

    public KthLargest(int k, int[] nums) {
        this.k = k;
        for (int x : nums) insert(x);
    }

    public int add(int val) {
        insert(val);
        return list.get(list.size() - k);
    }

    private void insert(int x) {
        int i = Collections.binarySearch(list, x);
        if (i < 0) i = -(i + 1);   // insertion point
        list.add(i, x);
    }
}`,
        },
        {
          level: 'Optimal', idea: 'Sirf k sabse bade numbers chahiye. Unhe min-heap me rakho — top = un k me sabse chhota = kth largest. Heap k se bada hua toh chhota wala bahar.',
          time: 'O(log k) per add (constructor O(n log k))', space: 'O(k)',
          code: `class KthLargest {
    private final int k;
    private final PriorityQueue<Integer> pq = new PriorityQueue<>(); // min-heap

    public KthLargest(int k, int[] nums) {
        this.k = k;
        for (int x : nums) add(x);
    }

    public int add(int val) {
        pq.offer(val);
        if (pq.size() > k) pq.poll();   // sabse chhota bahar
        return pq.peek();               // k bade me sabse chhota = kth largest
    }
}`,
        },
      ],
      dryRun: 'k=3, nums=[4,5,8,2] → heap [4,5,8] (2 bahar) · add(3) → 3 bahar → 4 · add(5) → [5,5,8] → 5 · add(10) → [5,8,10] → 5 · add(9) → [8,9,10] → 8 · add(4) → 4 bahar → 8',
      interview: 'I only ever need the k largest values, so I keep them in a min-heap of size k. The root of that heap is the smallest of the top k, which is exactly the kth largest. Each add offers the value and, if the size exceeds k, polls the minimum. That is O(log k) per add and O(k) space, versus re-sorting the whole list each time.',
      problem: {
        statement: 'Ek class <b>KthLargest</b> design karo jo ek <b>stream</b> of numbers me <b>kth largest</b> element batati rahe (sorted order me kth largest, distinct nahi). <code>KthLargest(int k, int[] nums)</code> — k aur shuru ke numbers ke saath object banao. <code>int add(int val)</code> — val stream me daalo aur ab tak ka kth largest return karo.',
        examples: [
          { input: '["KthLargest","add","add","add","add","add"]\n[[3,[4,5,8,2]],[3],[5],[10],[9],[4]]', output: '[null,4,5,5,8,8]', explain: 'k=3. add(3): [2,3,4,5,8] → 3rd largest 4. add(5) → 5. add(10) → [..5,5,8,10] → 5. add(9) → 8. add(4) → 8.', viz: { ops: '["KthLargest","add","add","add","add","add"]', args: '[[3,[4,5,8,2]],[3],[5],[10],[9],[4]]' } },
          { input: '["KthLargest","add","add","add","add"]\n[[4,[7,7,7,7,8,3]],[2],[10],[9],[9]]', output: '[null,7,7,7,8]', explain: 'k=4. Duplicates bhi gine jaate hain: 8,7,7,7 → 7. add(10) → 10,8,7,7 → 7. add(9) → 10,9,8,7 → 7. add(9) → 10,9,9,8 → 8.', viz: { ops: '["KthLargest","add","add","add","add"]', args: '[[4,[7,7,7,7,8,3]],[2],[10],[9],[9]]' } },
        ],
        constraints: ['0 ≤ nums.length ≤ 10⁴', '1 ≤ k ≤ nums.length + 1', '−10⁴ ≤ nums[i], val ≤ 10⁴', 'add() zyada se zyada 10⁴ baar call hoga', 'add() ke time heap me kam se kam k elements honge'],
      },
    },

    1046: {
      oneLine: 'Max-heap: do sabse bhaari poll karo, farak (agar > 0) wapas offer; end me peek ya 0.',
      pattern: 'Max-heap Simulation',
      approaches: [
        {
          level: 'Brute', idea: 'List me sab daalo. Har round list sort karo, last do (sabse bhaari) nikaalo, farak wapas daalo.',
          time: 'O(n² log n)', space: 'O(n)',
          code: `public int lastStoneWeight(int[] stones) {
    List<Integer> list = new ArrayList<>();
    for (int s : stones) list.add(s);
    while (list.size() > 1) {
        Collections.sort(list);
        int y = list.remove(list.size() - 1);   // sabse bhaari
        int x = list.remove(list.size() - 1);   // doosra
        if (y != x) list.add(y - x);
    }
    return list.isEmpty() ? 0 : list.get(0);
}`,
        },
        {
          level: 'Optimal', idea: 'Har round "sabse bade do" chahiye → max-heap. poll() do baar, farak offer. Har round O(log n), max n rounds.',
          time: 'O(n log n)', space: 'O(n)',
          code: `public int lastStoneWeight(int[] stones) {
    PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder()); // max-heap
    for (int s : stones) pq.offer(s);
    while (pq.size() > 1) {
        int y = pq.poll();   // sabse bhaari
        int x = pq.poll();   // doosra sabse bhaari
        if (y != x) pq.offer(y - x);
    }
    return pq.isEmpty() ? 0 : pq.peek();
}`,
        },
        {
          level: 'Own Heap', idea: 'Interview follow-up: "PriorityQueue ke bina karo". Khud ka max-heap int[] pe — push = sift up, pop = last ko root pe rakh ke sift down.',
          time: 'O(n log n)', space: 'O(n)',
          code: `public int lastStoneWeight(int[] stones) {
    int[] heap = new int[stones.length];
    int size = 0;
    for (int s : stones) size = push(heap, size, s);
    while (size > 1) {
        int y = heap[0];
        size = pop(heap, size);
        int x = heap[0];
        size = pop(heap, size);
        if (y != x) size = push(heap, size, y - x);
    }
    return size == 0 ? 0 : heap[0];
}

// sift up: naya element neeche se upar chadhta hai
private int push(int[] h, int size, int val) {
    int i = size;
    h[i] = val;
    while (i > 0 && h[(i - 1) / 2] < h[i]) {
        int p = (i - 1) / 2;
        int t = h[p]; h[p] = h[i]; h[i] = t;
        i = p;
    }
    return size + 1;
}

// sift down: last element root pe, fir bade child se swap
private int pop(int[] h, int size) {
    size--;
    h[0] = h[size];
    int i = 0;
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, big = i;
        if (l < size && h[l] > h[big]) big = l;
        if (r < size && h[r] > h[big]) big = r;
        if (big == i) break;
        int t = h[big]; h[big] = h[i]; h[i] = t;
        i = big;
    }
    return size;
}`,
        },
      ],
      dryRun: '[2,7,4,1,8,1] → 8,7 → 1 · 4,2 → 2 · 2,1 → 1 · 1,1 → 0 (dono gaye) · bacha [1] → 1',
      interview: 'Each round needs the two heaviest stones, so I put all stones in a max-heap. While more than one stone remains I poll twice and, if they differ, offer the difference back. Each round is O(log n) and there are at most n rounds, so O(n log n) time and O(n) space. At the end I return the remaining stone or 0.',
      problem: {
        statement: 'Array <b>stones</b> me har stone ka weight hai. Har turn me <b>do sabse bhaari</b> stones (y ≥ x) uthao aur takrao: agar <code>x == y</code> dono khatam; warna x khatam aur y ka weight <code>y − x</code> ho jaata hai. Jab tak 1 ya 0 stone na bache, ye karte raho. Bache hue stone ka weight return karo (koi nahi bacha toh 0).',
        examples: [
          { input: 'stones = [2,7,4,1,8,1]', output: '1', explain: '8,7 takraaye → 1 bacha: [2,4,1,1,1]. 4,2 → 2: [2,1,1,1]. 2,1 → 1: [1,1,1]. 1,1 → 0: [1]. Answer 1.', viz: { stones: '2, 7, 4, 1, 8, 1' } },
          { input: 'stones = [1]', output: '1', explain: 'Sirf ek stone — koi takkar nahi.', viz: { stones: '1' } },
          { input: 'stones = [3,3]', output: '0', explain: 'Dono barabar → dono khatam → 0.', viz: { stones: '3, 3' } },
        ],
        constraints: ['1 ≤ stones.length ≤ 30', '1 ≤ stones[i] ≤ 1000'],
      },
    },

    215: {
      oneLine: 'Min-heap size k → peek (O(n log k)); ya Quickselect → target index n−k (avg O(n)).',
      pattern: 'Top K (Min-heap) / Quickselect',
      approaches: [
        {
          level: 'Brute', idea: 'Poora array sort karo; ascending me kth largest index n − k pe hoga.',
          time: 'O(n log n)', space: 'O(log n) (sort stack)',
          code: `public int findKthLargest(int[] nums, int k) {
    Arrays.sort(nums);
    return nums[nums.length - k];
}`,
        },
        {
          level: 'Better', idea: 'Min-heap me sirf k sabse bade rakho. Har naye element ke baad size > k toh sabse chhota bahar. Top = kth largest.',
          time: 'O(n log k)', space: 'O(k)',
          code: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> pq = new PriorityQueue<>(); // min-heap
    for (int x : nums) {
        pq.offer(x);
        if (pq.size() > k) pq.poll();   // k se zyada → sabse chhota bahar
    }
    return pq.peek();
}`,
        },
        {
          level: 'Optimal', idea: 'Quickselect: pivot ke around 3-way partition (< | == | >). Target index (n − k) jis part me hai sirf wahi aage dekho. Duplicates bhi safe. Avg O(n), worst O(n²) (random pivot se bachao).',
          time: 'O(n) average, O(n²) worst', space: 'O(1)',
          code: `public int findKthLargest(int[] nums, int k) {
    int target = nums.length - k;   // ascending order me ye index chahiye
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int pivot = nums[lo + (hi - lo) / 2];
        int lt = lo, i = lo, gt = hi;   // [lo..lt-1] < pivot, [lt..gt] == pivot, [gt+1..hi] > pivot
        while (i <= gt) {
            if (nums[i] < pivot) swap(nums, lt++, i++);
            else if (nums[i] > pivot) swap(nums, i, gt--);
            else i++;
        }
        if (target < lt) hi = lt - 1;
        else if (target > gt) lo = gt + 1;
        else return pivot;
    }
    return nums[lo];
}

private void swap(int[] a, int i, int j) {
    int t = a[i]; a[i] = a[j]; a[j] = t;
}`,
        },
      ],
      dryRun: '[3,2,1,5,6,4], k=2 → heap: [3] [2,3]→2 bahar→[3] … end [5,6] → peek 5',
      interview: 'Sorting gives O(n log n). Better, I keep a min-heap of the k largest elements seen so far, polling whenever the size exceeds k; the root is the kth largest, giving O(n log k) time and O(k) space, and it works on streams. For average O(n), I use quickselect: partition around a pivot into less, equal and greater, then continue only in the part containing index n − k. Worst case is O(n²), which a random pivot makes very unlikely.',
      problem: {
        statement: 'Integer array <b>nums</b> aur integer <b>k</b> diya hai. Array ka <b>kth largest</b> element return karo — sorted order me kth largest, <b>kth distinct nahi</b>. Kya poora sort kiye bina kar sakte ho?',
        examples: [
          { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5', explain: 'Sorted desc: 6, 5, 4, 3, 2, 1 → 2nd largest = 5.', viz: { nums: '3, 2, 1, 5, 6, 4', k: '2' } },
          { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4', explain: 'Sorted desc: 6, 5, 5, 4, 3, 3, 2, 2, 1 → 4th = 4 (duplicate 5 dono gine).', viz: { nums: '3, 2, 3, 1, 2, 4, 5, 5, 6', k: '4' } },
        ],
        constraints: ['1 ≤ k ≤ nums.length ≤ 10⁵', '−10⁴ ≤ nums[i] ≤ 10⁴'],
      },
    },

    347: {
      oneLine: 'HashMap frequency → min-heap of size k on {num, count} (O(n log k)); ya bucket[freq] (O(n)).',
      pattern: 'Frequency + Top K (Heap) / Bucket Sort',
      approaches: [
        {
          level: 'Brute', idea: 'HashMap se frequency. Saari unique keys ko frequency ke descending order me sort karo, pehli k le lo.',
          time: 'O(n log n)', space: 'O(n)',
          code: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
    List<Integer> keys = new ArrayList<>(freq.keySet());
    keys.sort((a, b) -> Integer.compare(freq.get(b), freq.get(a)));   // zyada frequency pehle
    int[] ans = new int[k];
    for (int i = 0; i < k; i++) ans[i] = keys.get(i);
    return ans;
}`,
        },
        {
          level: 'Better', idea: 'Frequency map ke baad min-heap (count se) of size k. Size > k → sabse kam frequency wala bahar. Bache k = answer.',
          time: 'O(n log k)', space: 'O(n)',
          code: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
    // min-heap of {num, count}: sabse kam frequency top pe
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
    for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
        pq.offer(new int[]{e.getKey(), e.getValue()});
        if (pq.size() > k) pq.poll();   // sabse kam frequent bahar
    }
    int[] ans = new int[k];
    for (int i = k - 1; i >= 0; i--) ans[i] = pq.poll()[0];
    return ans;
}`,
        },
        {
          level: 'Optimal', idea: 'Frequency 1..n ke beech hi hoti hai → bucket[f] = jin numbers ki frequency f. f = n se neeche chalo aur k numbers utha lo. Koi sort/heap nahi.',
          time: 'O(n)', space: 'O(n)',
          code: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
    List<Integer>[] bucket = new List[nums.length + 1];   // bucket[f] = frequency f wale numbers
    for (int key : freq.keySet()) {
        int f = freq.get(key);
        if (bucket[f] == null) bucket[f] = new ArrayList<>();
        bucket[f].add(key);
    }
    int[] ans = new int[k];
    int idx = 0;
    for (int f = nums.length; f >= 1 && idx < k; f--) {
        if (bucket[f] == null) continue;
        for (int x : bucket[f]) {
            if (idx == k) break;
            ans[idx++] = x;
        }
    }
    return ans;
}`,
        },
      ],
      dryRun: '[1,1,1,2,2,3], k=2 → freq {1=3, 2=2, 3=1} → heap {1:3} {2:2,1:3} {3:1,…} size 3 > 2 → 3:1 bahar → ans [1, 2]',
      interview: 'First I count frequencies with a HashMap in O(n). Then I keep a min-heap of size k ordered by count: each entry is offered and, if the heap grows beyond k, the least frequent is polled. The heap ends up holding the k most frequent, so this is O(n log k). Since a frequency can never exceed n, bucket sort does even better: bucket[f] lists numbers with frequency f, and scanning from n downwards collects the answer in O(n).',
      problem: {
        statement: 'Integer array <b>nums</b> aur integer <b>k</b> diya hai. <b>k sabse zyada frequent</b> elements return karo — kisi bhi order me. Answer unique hai (guarantee).',
        examples: [
          { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]', explain: '1 teen baar, 2 do baar, 3 ek baar → top 2 = 1 aur 2.', viz: { nums: '1, 1, 1, 2, 2, 3', k: '2' } },
          { input: 'nums = [1], k = 1', output: '[1]', explain: 'Ek hi element.', viz: { nums: '1', k: '1' } },
          { input: 'nums = [4,4,-1,4,-1,7], k = 2', output: '[4,-1]', explain: '4 → 3 baar, −1 → 2 baar, 7 → 1 baar → top 2 = 4 aur −1. Negative numbers bhi normal keys hain.', viz: { nums: '4, 4, -1, 4, -1, 7', k: '2' } },
        ],
        constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁴ ≤ nums[i] ≤ 10⁴', 'k range [1, unique elements ki count] me', 'Answer unique hai', 'Follow-up: O(n log n) se better karo'],
      },
    },

    973: {
      oneLine: 'Max-heap (distance²) of size k: offer, size > k toh sabse door wala poll; bache k = answer.',
      pattern: 'K Closest — Max-heap of size k / Quickselect',
      approaches: [
        {
          level: 'Brute', idea: 'Saare points ko distance² (x² + y²) se sort karo, pehle k le lo. sqrt ki zaroorat nahi — order same rehta hai.',
          time: 'O(n log n)', space: 'O(log n) (sort)',
          code: `public int[][] kClosest(int[][] points, int k) {
    Arrays.sort(points, (a, b) -> Integer.compare(a[0] * a[0] + a[1] * a[1], b[0] * b[0] + b[1] * b[1]));
    return Arrays.copyOfRange(points, 0, k);
}`,
        },
        {
          level: 'Better', idea: 'Max-heap (distance se) of size k. Top = k me sabse door. Naya point aaya aur size > k → sabse door wala bahar. End me k closest bache.',
          time: 'O(n log k)', space: 'O(k)',
          code: `public int[][] kClosest(int[][] points, int k) {
    // max-heap by distance: sabse door wala top pe
    PriorityQueue<int[]> pq = new PriorityQueue<>(
        (a, b) -> Integer.compare(dist(b), dist(a)));
    for (int[] p : points) {
        pq.offer(p);
        if (pq.size() > k) pq.poll();   // sabse door wala bahar
    }
    int[][] ans = new int[k][];
    for (int i = k - 1; i >= 0; i--) ans[i] = pq.poll();   // closest pehle aaye
    return ans;
}

private int dist(int[] p) {
    return p[0] * p[0] + p[1] * p[1];
}`,
        },
        {
          level: 'Optimal', idea: 'Quickselect on distance: partition ke baad agar pivot ki final position k − 1 ke aage hai toh left part, warna right part. Pehle k points = answer (order matter nahi).',
          time: 'O(n) average, O(n²) worst', space: 'O(1)',
          code: `public int[][] kClosest(int[][] points, int k) {
    int lo = 0, hi = points.length - 1;
    while (lo < hi) {
        int p = partition(points, lo, hi);
        if (p == k - 1) break;
        if (p < k - 1) lo = p + 1;
        else hi = p - 1;
    }
    return Arrays.copyOfRange(points, 0, k);
}

// Lomuto: middle pivot ko end pe le jao, chhote distance wale left me
private int partition(int[][] pts, int lo, int hi) {
    swap(pts, lo + (hi - lo) / 2, hi);
    int pivot = dist(pts[hi]), store = lo;
    for (int i = lo; i < hi; i++) {
        if (dist(pts[i]) < pivot) swap(pts, store++, i);
    }
    swap(pts, store, hi);
    return store;
}

private int dist(int[] p) {
    return p[0] * p[0] + p[1] * p[1];
}

private void swap(int[][] a, int i, int j) {
    int[] t = a[i]; a[i] = a[j]; a[j] = t;
}`,
        },
      ],
      dryRun: '[[3,3],[5,-1],[-2,4]], k=2 → dist 18, 26, 20 → heap {18} {26,18} {26,18,20} size 3 > 2 → 26 bahar → ans [[3,3],[-2,4]]',
      interview: 'Distance from the origin only needs x² + y², no square root, since it preserves the order. I keep a max-heap of size k keyed by that distance: the root is the farthest of the current k, so when the heap exceeds k I poll it. That gives O(n log k) time and O(k) space. If the interviewer wants average linear time, quickselect on distance partitions until index k − 1 is fixed, then the first k points are the answer.',
      problem: {
        statement: '2D plane pe <b>points</b> diye hain jahan <code>points[i] = [xᵢ, yᵢ]</code>, aur integer <b>k</b>. Origin (0, 0) ke <b>k sabse paas</b> wale points return karo. Distance = Euclidean <code>√(x² + y²)</code>. Answer kisi bhi order me de sakte ho (unique guarantee hai).',
        examples: [
          { input: 'points = [[1,3],[-2,2]], k = 1', output: '[[-2,2]]', explain: '(1,3) ka distance² = 10, (−2,2) ka = 8 → 8 chhota → [[-2,2]].', viz: { points: '[[1,3],[-2,2]]', k: '1' } },
          { input: 'points = [[3,3],[5,-1],[-2,4]], k = 2', output: '[[3,3],[-2,4]]', explain: 'distance²: 18, 26, 20 → sabse chhote do: 18 (3,3) aur 20 (−2,4). [[-2,4],[3,3]] bhi sahi.', viz: { points: '[[3,3],[5,-1],[-2,4]]', k: '2' } },
        ],
        constraints: ['1 ≤ k ≤ points.length ≤ 10⁴', '−10⁴ ≤ xᵢ, yᵢ ≤ 10⁴'],
      },
    },

    295: {
      oneLine: 'Two heaps: low = max-heap (chhota half), high = min-heap (bada half); size low = high ya +1; median tops se.',
      pattern: 'Two Heaps (Design)',
      approaches: [
        {
          level: 'Brute', idea: 'addNum me list me daalo. findMedian pe list sort karo aur beech ka (ya beech ke do ka average) return.',
          time: 'add O(1), findMedian O(n log n)', space: 'O(n)',
          code: `class MedianFinder {
    private final List<Integer> list = new ArrayList<>();

    public MedianFinder() {
    }

    public void addNum(int num) {
        list.add(num);
    }

    public double findMedian() {
        Collections.sort(list);
        int n = list.size();
        if (n % 2 == 1) return list.get(n / 2);
        return (list.get(n / 2 - 1) + list.get(n / 2)) / 2.0;
    }
}`,
        },
        {
          level: 'Better', idea: 'List hamesha sorted rakho: binary search se insertion point, wahan add (shift O(n)). Median O(1) index se.',
          time: 'add O(n), findMedian O(1)', space: 'O(n)',
          code: `class MedianFinder {
    private final List<Integer> list = new ArrayList<>(); // sorted

    public MedianFinder() {
    }

    public void addNum(int num) {
        int i = Collections.binarySearch(list, num);
        if (i < 0) i = -(i + 1);   // insertion point
        list.add(i, num);
    }

    public double findMedian() {
        int n = list.size();
        if (n % 2 == 1) return list.get(n / 2);
        return (list.get(n / 2 - 1) + list.get(n / 2)) / 2.0;
    }
}`,
        },
        {
          level: 'Optimal', idea: 'Numbers ko do half me baanto: low (max-heap) me chhote, high (min-heap) me bade. Har add ke baad low.size() == high.size() ya ek zyada. Median = low ka top ya dono tops ka average.',
          time: 'add O(log n), findMedian O(1)', space: 'O(n)',
          code: `class MedianFinder {
    private final PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder()); // max-heap: chhota half
    private final PriorityQueue<Integer> high = new PriorityQueue<>();                          // min-heap: bada half

    public MedianFinder() {
    }

    public void addNum(int num) {
        low.offer(num);              // pehle low me
        high.offer(low.poll());      // low ka sabse bada → high (order sahi rahe)
        if (high.size() > low.size()) {
            low.offer(high.poll());  // balance: low me hamesha >= high
        }
    }

    public double findMedian() {
        if (low.size() > high.size()) return low.peek();
        return (low.peek() + high.peek()) / 2.0;
    }
}`,
        },
      ],
      dryRun: 'add 1 → low [1] · add 2 → low [1], high [2] · median (1+2)/2 = 1.5 · add 3 → low [2,1], high [3] · median 2.0',
      interview: 'I split the numbers into two halves: a max-heap for the smaller half and a min-heap for the larger half, keeping the max-heap equal in size or one larger. To add, I push into the max-heap, move its top to the min-heap so ordering holds, and if the min-heap becomes larger I move its top back. The median is then the max-heap top, or the average of both tops. Add is O(log n), findMedian is O(1).',
      problem: {
        statement: 'Ek class <b>MedianFinder</b> design karo jo data stream ka <b>median</b> nikaale. Median = sorted list ka beech wala; agar size even hai toh beech ke do ka average. <code>MedianFinder()</code> — khaali object. <code>void addNum(int num)</code> — num stream me daalo. <code>double findMedian()</code> — ab tak ka median (10⁻⁵ tak accurate).',
        examples: [
          { input: '["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]\n[[],[1],[2],[],[3],[]]', output: '[null,null,null,1.5,null,2.0]', explain: '[1,2] → (1+2)/2 = 1.5. Fir [1,2,3] → beech wala 2.0.', viz: { ops: '["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]', args: '[[],[1],[2],[],[3],[]]' } },
          { input: '["MedianFinder","addNum","findMedian","addNum","findMedian","addNum","addNum","findMedian"]\n[[],[5],[],[15],[],[1],[3],[]]', output: '[null,null,5.0,null,10.0,null,null,4.0]', explain: '[5] → 5.0. [5,15] → 10.0. [1,3,5,15] → (3+5)/2 = 4.0.', viz: { ops: '["MedianFinder","addNum","findMedian","addNum","findMedian","addNum","addNum","findMedian"]', args: '[[],[5],[],[15],[],[1],[3],[]]' } },
        ],
        constraints: ['−10⁵ ≤ num ≤ 10⁵', 'findMedian se pehle kam se kam ek element hoga', 'addNum + findMedian milake zyada se zyada 5 × 10⁴ calls', 'Follow-up: agar saare numbers [0, 100] me hon toh? 99% [0, 100] me hon toh?'],
      },
    },
  },

  // ---------------- DAILY PLAN (14 din = 2 weeks, sirf course ke 6 questions) ----------------
  days: [
    {
      day: 1, week: 1, dow: 'Mon', type: 'learn', title: 'Heap Basics + Max-heap (PriorityQueue)',
      theory: ['Complete binary tree + heap property', 'Min-heap vs max-heap', 'PriorityQueue: offer / poll / peek', 'Collections.reverseOrder()'],
      qs: [1046],
      interview: {
        q: 'What is a heap and what are its time complexities?',
        a: 'A heap is a complete binary tree where every parent is smaller than its children in a min-heap, or larger in a max-heap, so the root is always the minimum or maximum. Because the tree is complete, it is stored compactly in an array, with children of index i at 2i + 1 and 2i + 2. Peeking the root is O(1), while insert and remove-top are O(log n) because they walk one root-to-leaf path. Building a heap from n elements is O(n). In Java I use PriorityQueue, which is a min-heap by default.',
      },
    },
    {
      day: 2, week: 1, dow: 'Tue', type: 'learn', title: 'Min-heap of size k (Design)',
      theory: ['Kth largest → MIN-heap of size k', 'offer → size > k → poll', 'Design class: state = heap', 'O(log k) per add'],
      qs: [703],
      interview: {
        q: 'Why does a min-heap give the kth largest element?',
        a: 'If I keep only the k largest elements seen so far, the kth largest is the smallest among them. A min-heap of size k exposes exactly that smallest one at its root. Whenever a new element arrives, I offer it and, if the heap grows to k + 1, I poll the root, discarding the element that can no longer be in the top k. Each operation costs O(log k), and memory is O(k), which also works for an unbounded stream where sorting is impossible.',
      },
    },
    {
      day: 3, week: 1, dow: 'Wed', type: 'learn', title: 'Heap Internals: Sift Up / Sift Down (khud ka heap)',
      theory: ['Array me heap: parent (i−1)/2, child 2i+1, 2i+2', 'push = sift up', 'pop = last ko root pe + sift down', 'Heapify O(n) kyun'],
      qs: [1046, 703],
      interview: {
        q: 'How do insertion and deletion work inside a binary heap?',
        a: 'For insertion, I place the new element at the end of the array, which is the next free leaf, and sift it up: while it is better than its parent at index (i − 1) / 2, I swap them. For removing the top, I save the root, move the last element to index 0, shrink the size, and sift it down: I swap it with its better child until neither child is better. Both walk a single path of height log n, so they are O(log n). Building a heap bottom-up with sift down from n/2 − 1 to 0 is O(n) because most nodes are near the bottom.',
      },
    },
    {
      day: 4, week: 1, dow: 'Thu', type: 'learn', title: 'Kth Largest: Sort vs Heap',
      theory: ['Sort → nums[n − k]', 'Size-k min-heap → O(n log k)', 'k chhota vs k ≈ n', 'Stream vs fixed array'],
      qs: [215],
      interview: {
        q: 'Sorting versus a heap for kth largest: how do you choose?',
        a: 'Sorting is simplest at O(n log n) time and works well if I need many order statistics at once. A size-k min-heap is O(n log k) time and O(k) space, so it wins when k is much smaller than n, and it is the only option for streaming input because it never needs all the data at once. If k is close to n, I can flip it and keep a max-heap of size n − k + 1. And if I need average linear time on a fixed array, quickselect is O(n) on average.',
      },
    },
    {
      day: 5, week: 1, dow: 'Fri', type: 'learn', title: 'Quickselect (Partition) — LC 215 ka doosra approach',
      theory: ['Partition: pivot apni final jagah', '3-way partition (< | == | >)', 'Sirf ek side me jao → avg O(n)', 'Worst O(n²), random pivot'],
      qs: [215, 703],
      interview: {
        q: 'Explain quickselect and its complexity.',
        a: 'Quickselect uses the quicksort partition step: after partitioning around a pivot, the pivot sits at its final sorted position. If that position is my target index, I am done; otherwise I continue only in the side that contains the target, discarding the other side. On average each step halves the range, so the work is n + n/2 + n/4 and so on, which is O(n). The worst case is O(n²) when the pivot is always extreme, so I pick a random or middle pivot and use three-way partitioning to handle duplicates.',
      },
    },
    {
      day: 6, week: 1, dow: 'Sat', type: 'revision', title: 'Revision — Week 1 (Heap)',
      theory: ['Bina solution dekhe re-solve (min 3)', 'Max-heap vs min-heap kab', 'Sift up / down zubaani', 'Timer: Easy 15 min, Medium 25 min'],
      qs: [1046, 703, 215, 230],
      interview: {
        q: 'Heap versus BST: when would you use each?',
        a: 'A heap only guarantees that the root is the minimum or maximum, which makes it ideal when I repeatedly need the best element: peek is O(1) and insert or remove-top are O(log n), with a compact array layout. A balanced BST such as TreeMap keeps everything in sorted order, so it supports searching any key, finding predecessors or successors, and removing arbitrary elements in O(log n), at the cost of more memory. If I only need the top, I use a heap; if I need ordered queries or arbitrary deletes, I use a TreeMap or TreeSet.',
      },
    },
    {
      day: 7, week: 1, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest',
      theory: ['30 min: Tum interviews Sohvi (LC 703 bina dekhe)', '30 min: Sohvi interviews Tum (LC 215 bina dekhe)', '30 min: Weekly contest discussion', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [703, 215],
      interview: {
        q: 'How do you handle a design question like a class with add and query methods?',
        a: 'I first clarify the operations, their expected frequency and the constraints, because that decides which operation should be fast. Then I choose the state the class must hold — for kth largest, only the top k elements in a min-heap. I state the complexity of each method, write the constructor and methods cleanly with private fields, and walk through the sample operation sequence line by line. Finally I discuss edge cases like an empty initial array and follow-ups like concurrency.',
      },
    },
    {
      day: 8, week: 2, dow: 'Mon', type: 'learn', title: 'Top K Frequent: HashMap + Heap',
      theory: ['Frequency map (Phase 1 pattern)', 'PriorityQueue<int[]> + comparator', 'Min-heap of size k on count', 'Map.Entry iterate'],
      qs: [347],
      interview: {
        q: 'How do you write a comparator for a PriorityQueue of arrays in Java?',
        a: 'Arrays have no natural ordering, so I pass a comparator to the constructor, for example a lambda (a, b) -> Integer.compare(a[1], b[1]) to order by the second element ascending, which makes a min-heap by that field. For a max-heap I swap the arguments. I prefer Integer.compare over subtraction because a − b can overflow for large or negative values. For multiple keys, Comparator.comparingInt with thenComparingInt keeps it readable.',
      },
    },
    {
      day: 9, week: 2, dow: 'Tue', type: 'learn', title: 'Bucket Sort — LC 347 ka O(n) approach',
      theory: ['Frequency ≤ n → bucket index', 'bucket[f] = List of numbers', 'Upar se neeche k utha lo', 'Heap vs bucket trade-off'],
      qs: [347, 215],
      interview: {
        q: 'When can you beat O(n log n) for a top-k problem?',
        a: 'When the key I am ranking by has a small bounded range. In Top K Frequent, every frequency is between 1 and n, so I can bucket numbers by frequency in an array of lists and scan from the highest bucket down, collecting k numbers in O(n) total. The same idea works whenever values are bounded, like counting sort. Otherwise a size-k heap at O(n log k) or quickselect at average O(n) are the usual choices.',
      },
    },
    {
      day: 10, week: 2, dow: 'Wed', type: 'learn', title: 'K Closest Points: Max-heap of size k',
      theory: ['Distance² (sqrt nahi)', 'K smallest → MAX-heap of size k', 'int[] comparator (b vs a)', 'Quickselect bhi possible'],
      qs: [973],
      interview: {
        q: 'Why use a max-heap to find the k smallest items?',
        a: 'To keep the k smallest seen so far, I need fast access to the worst of them, the largest, because that is the one to evict when a better item arrives. A max-heap of size k puts exactly that element at the root. Each new item is offered, and if the size exceeds k I poll the root. This is O(n log k) time and O(k) space. It mirrors the kth largest pattern, where a min-heap of size k is used.',
      },
    },
    {
      day: 11, week: 2, dow: 'Thu', type: 'learn', title: 'Two Heaps: Median from Data Stream',
      theory: ['low = max-heap, high = min-heap', 'Invariant: low.size() = high.size() ya +1', 'add: low → high → balance', 'Median O(1)'],
      qs: [295],
      interview: {
        q: 'Explain the two-heaps technique for a running median.',
        a: 'I maintain a max-heap holding the smaller half of the numbers and a min-heap holding the larger half, so every element in the max-heap is at most every element in the min-heap, and the max-heap has the same size or one more. Adding pushes into the max-heap, moves its top to the min-heap, and moves one back if the min-heap got bigger. The median is the max-heap root for an odd count, or the average of both roots. Each add is O(log n) and each median query is O(1).',
      },
    },
    {
      day: 12, week: 2, dow: 'Fri', type: 'learn', title: 'Catch-up — LC 973 Quickselect + LC 295 Follow-ups',
      theory: ['973: Lomuto partition on distance', 'Heap vs quickselect kab', '295 follow-up: values [0,100] → counting', 'Bina dekhe dono code'],
      qs: [973, 295],
      interview: {
        q: 'Heap or quickselect for k closest points?',
        a: 'Quickselect is average O(n) and O(1) extra space, but it needs all points in memory, mutates the input, and has an O(n²) worst case. A size-k max-heap is O(n log k) with O(k) space, gives a guaranteed bound, does not modify the input, and works on a stream of points. In an interview I implement the heap first because it is short and safe, then mention quickselect as the optimization if the input is a fixed array and average time matters.',
      },
    },
    {
      day: 13, week: 2, dow: 'Sat', type: 'revision', title: 'Revision — Week 2 (Top K + Two Heaps)',
      theory: ['Bina solution dekhe re-solve (min 3)', 'Last Minute tab ka "Signal → Pattern"', 'Comparator bina galti', 'Week 1 me jo galat hua woh dobara'],
      qs: [347, 973, 295, 1046],
      interview: {
        q: 'How does Java PriorityQueue work internally?',
        a: 'PriorityQueue is a binary heap stored in a resizable Object array, a min-heap by natural ordering or by the comparator I pass. offer appends the element and sifts it up; poll takes index 0, moves the last element to the root and sifts it down, both O(log n). peek is O(1). remove of an arbitrary object and contains are O(n) because they search linearly. Iteration and toString follow the internal array order, not sorted order. It does not allow nulls and is not thread-safe; PriorityBlockingQueue is the concurrent version.',
      },
    },
    {
      day: 14, week: 2, dow: 'Sun', type: 'mock', title: 'Mock Interview + Contest + Phase Test',
      theory: ['30 min: Tum interviews Sohvi (LC 1046 bina dekhe)', '30 min: Sohvi interviews Tum (LC 295 bina dekhe)', '30 min: Contest discussion', 'Phase test: Last Minute tab ki saari one-liners bolo'],
      qs: [1046, 295],
      interview: {
        q: 'Top K problems: what are your options and trade-offs?',
        a: 'There are four standard options. Full sort is O(n log n) and simplest. A size-k heap is O(n log k) time and O(k) space, and works on streams. Quickselect is average O(n) with O(1) space, but mutates input and has an O(n²) worst case. Bucket or counting sort is O(n) when the ranking key has a small bounded range, like frequencies. I usually present the heap, then mention quickselect or buckets depending on constraints.',
      },
    },
  ],

  // ---------------- LAST MINUTE ----------------
  lastMinute: {
    triggers: [
      ['Kth largest / top k largest', 'MIN-heap of size k (peek = answer)'],
      ['K smallest / k closest', 'MAX-heap of size k'],
      ['Stream me kth / design add()', 'Heap as class state (LC 703)'],
      ['Har baar sabse bade do uthao', 'Max-heap simulation (LC 1046)'],
      ['Running median', 'Two heaps: max-heap low + min-heap high'],
      ['Top k frequent', 'HashMap + size-k heap, ya bucket[freq] O(n)'],
      ['Kth + "average O(n)"', 'Quickselect (3-way partition)'],
      ['"PriorityQueue ke bina"', 'int[] heap: sift up / sift down'],
      ['Distance compare', 'x² + y² (sqrt nahi)'],
    ],
    edge: [
      'k = 1 aur k = n',
      'Duplicates (kth largest distinct nahi hai)',
      'Negative numbers (comparator me a − b overflow)',
      'Empty heap pe poll()/peek() → null → unboxing NPE',
      '703: nums khaali ho sakta hai (k − 1 elements bhi)',
      '295: even count → average, 2.0 (double) return',
    ],
    mistakes: [
      'Kth largest ke liye max-heap me sab daal ke k baar poll (O(n + k log n), kaam karta hai par size-k min-heap expected)',
      'Comparator ulta: max-heap chahiye tha, default min-heap bana diya',
      '(a, b) -> b - a with Integer.MIN_VALUE → overflow',
      'PriorityQueue ko print/for-each karke sorted samajhna (andar ka array order hai)',
      'pq.remove(obj) ko O(log n) samajhna (O(n) hai)',
      '295 me (low.peek() + high.peek()) / 2 → integer division! 2.0 se divide karo',
    ],
  },
};
