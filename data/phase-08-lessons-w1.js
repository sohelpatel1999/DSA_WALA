// Phase 8 (Heap) — Week 1 lessons (local days 1–7). Day 1 (Phase 1) wale format me.
(function () {
  const P = window.PHASE_CONTENT['heap'];
  P.lessons = P.lessons || {};
  const Q = P.questions;

  // Tested approach code ko "class Solution { … }" me wrap karo (design classes waise hi)
  const sol = (n, i) => {
    const c = Q[n].approaches[i].code;
    return /^class /.test(c) ? c : 'class Solution {\n' + c.split('\n').map(l => (l ? '    ' + l : l)).join('\n') + '\n}';
  };
  // Cumulative revision card (Part 0)
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
    // ======================= DAY 1 =======================
    1: {
      title: 'Heap Basics + Max-heap (PriorityQueue)',
      goal: 'Heap kya hai (complete binary tree + heap property), array me kaise rehta hai, Java <code>PriorityQueue</code> ko min-heap aur max-heap dono tarah use karna, aur <b>LC 1046 Last Stone Weight</b> ko sort-every-round se max-heap tak le jaana.',
      main: 1046,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision (Trees + Stack)',
          blocks: [
            { p: 'Naya phase shuru karne se pehle pichle phases ke 3 sawaal — 10 min me zubaani + code skeleton. Heap ek <b>tree</b> hai, isliye Phase 7 ka revision sabse kaam ka hai.' },
            ...rq(230, 'Kth Smallest Element in a BST', 'BST me kth sabse chhota value.', 'root = [3,1,4,null,2], k = 1 → 1\ninorder: 1, 2, 3, 4 → 1st = 1', 'Inorder traversal (BST ka inorder = sorted)',
              ['BST ka inorder hamesha sorted aata hai.', 'Iterative inorder: stack me left-left jao.', 'Har pop pe k-- ; k == 0 → wahi answer.'],
              `public int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> st = new ArrayDeque<>();
    TreeNode cur = root;
    while (cur != null || !st.isEmpty()) {
        while (cur != null) { st.push(cur); cur = cur.left; }
        cur = st.pop();
        if (--k == 0) return cur.val;
        cur = cur.right;
    }
    return -1;
}`, 'BST + inorder = sorted list; kth pop = answer. (Heap sorted NAHI hota — fark yaad rakho.)'),
            ...rq(102, 'Binary Tree Level Order Traversal', 'Tree ko level-by-level list me do.', 'root = [3,9,20,null,null,15,7]\n→ [[3],[9,20],[15,7]]', 'BFS with queue (level size)',
              ['Queue me root.', 'Har level: size = q.size(), utne nodes nikaalo.', 'Children queue me daalo.'],
              `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    Queue<TreeNode> q = new ArrayDeque<>();
    if (root != null) q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        res.add(level);
    }
    return res;
}`, 'Level order = heap ka array order! Aaj heap ko isi order me array me rakhenge.'),
            ...rq(155, 'Min Stack', 'Stack jo push/pop/top ke saath getMin bhi O(1) me de.', 'push(-2) push(0) push(-3) getMin → -3, pop, getMin → -2', 'Stack of pairs {val, minSoFar}',
              ['Har entry ke saath us waqt ka min bhi store.', 'getMin = top ka min.', 'pop pe min apne aap purana ho jaata hai.'],
              `class MinStack {
    private final Deque<int[]> st = new ArrayDeque<>();
    public void push(int val) {
        int min = st.isEmpty() ? val : Math.min(val, st.peek()[1]);
        st.push(new int[]{val, min});
    }
    public void pop() { st.pop(); }
    public int top() { return st.peek()[0]; }
    public int getMin() { return st.peek()[1]; }
}`, 'Min Stack sirf min deta hai bina remove kiye; heap min nikal ke agla min bhi deta hai.'),
          ],
        },
        {
          title: 'Part 1 — Concept: Heap = complete binary tree + heap property',
          blocks: [
            { p: '<b>Problem jo heap solve karta hai:</b> baar-baar "abhi sabse bada (ya chhota) kaun hai?" puchna, beech me naye elements aate rahein. Sorted array me insert O(n), unsorted me max dhundna O(n). Heap dono O(log n) me karta hai.' },
            { table: { head: ['Structure', 'Max dekhna', 'Insert', 'Max nikaalna'], rows: [
              ['Unsorted array', 'O(n)', 'O(1)', 'O(n)'],
              ['Sorted array', 'O(1)', 'O(n)', 'O(1) (end se)'],
              ['<b>Heap</b>', '<b>O(1)</b>', '<b>O(log n)</b>', '<b>O(log n)</b>'],
            ] } },
            { p: '<b>Do rules:</b> (1) <b>Complete binary tree</b> — saare levels bhare, last level left se. (2) <b>Heap property</b> — max-heap me har parent ≥ children; min-heap me ≤.' },
            { pre: `Max-heap (stones [2,7,4,1,8,1] daalne ke baad, Java PriorityQueue ka exact order)

            8            index: 0  1  2  3  4  5
          /   \\          array: [8, 7, 4, 1, 2, 1]
         7     4
        / \\   /         parent(i) = (i-1)/2   left = 2i+1   right = 2i+2
       1   2 1` },
            { list: [
              'Root (index 0) = sabse bada. Bas yahi guarantee hai.',
              '7 aur 4 siblings hain — unke beech koi order nahi. 1 (index 3) aur 4 (index 2) — 1 neeche hai par 4 se chhota; heap me "level" se value ka order nahi aata.',
              'Isliye heap <b>sorted nahi</b> hai. <code>System.out.println(pq)</code> → <code>[8, 7, 4, 1, 2, 1]</code>, sorted nahi.',
            ] },
            { p: '<b>Java PriorityQueue</b> default <b>MIN-heap</b> hai. Max-heap ke liye comparator ulta karo:' },
            { code: `PriorityQueue<Integer> min = new PriorityQueue<>();                              // chhota top
PriorityQueue<Integer> max = new PriorityQueue<>(Collections.reverseOrder());    // bada top
PriorityQueue<Integer> max2 = new PriorityQueue<>((a, b) -> Integer.compare(b, a));

max.offer(5);       // O(log n)
max.peek();         // O(1)  — dekho, nikaalo mat
max.poll();         // O(log n) — nikaalo
max.size(); max.isEmpty();` },
            { tip: 'Abhi ke liye itna kaafi: <b>offer = end me daalo + upar chadhao (sift up)</b>, <b>poll = root nikaalo, last ko root pe rakho + neeche dhakelo (sift down)</b>. Day 3 me ye khud likhenge.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 1046 Last Stone Weight', blocks: [{ problem: 1046 }] },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Har round kya chahiye?</b> Do sabse bhaari stones. Fir ek naya stone (farak) wapas aa sakta hai. Matlab: "max nikaalo, max nikaalo, kuch daalo" — baar baar.' },
            { p: '<b>Brute:</b> List rakho. Har round <code>Collections.sort</code>, last do uthao. Sort O(n log n) × n rounds = <b>O(n² log n)</b>. n ≤ 30 hai toh pass ho jaayega, lekin interviewer puchega "behtar?".' },
            { p: '<b>Observation:</b> Har round me poora sort waste hai — humein sirf <b>top 2</b> chahiye. "Repeated max + insert" = <b>max-heap</b> ka signal.' },
            { olist: [
              'Saare stones max-heap me daalo (n × O(log n)).',
              'Jab tak size > 1: <code>y = poll()</code> (sabse bhaari), <code>x = poll()</code> (doosra).',
              'Agar <code>y != x</code> → <code>offer(y − x)</code>. Barabar → dono gaye, kuch nahi daalna.',
              'End: heap khaali → 0, warna <code>peek()</code>.',
            ] },
            { p: 'Har round heap kam se kam 1 se chhota hota hai → max n rounds, har round O(log n) → <b>O(n log n)</b>.' },
            { tip: 'Signal: <b>"har baar sabse bade do uthao"</b> → max-heap simulation.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: stones = [2, 7, 4, 1, 8, 1]',
          blocks: [
            { p: '<b>Heap build</b> (values visualizer/Java se verify kiye — <code>pq.toString()</code> jaisa andar ka order):' },
            { table: { head: ['offer', 'Sift up', 'pq (array order)'], rows: [
              ['2', 'root', '[2]'],
              ['7', '7 > parent 2 → swap', '[7, 2]'],
              ['4', '4 < parent 7 → ruk', '[7, 2, 4]'],
              ['1', '1 < parent 2 → ruk', '[7, 2, 4, 1]'],
              ['8', 'index 4, parent 2 → swap; parent 7 → swap', '[8, 7, 4, 1, 2]'],
              ['1', '1 < parent 4 → ruk', '[8, 7, 4, 1, 2, 1]'],
            ] } },
            { p: '<b>Takkar rounds:</b>' },
            { table: { head: ['Round', 'y = poll()', 'x = poll()', 'y − x', 'pq baad me'], rows: [
              ['1', '8', '7', '1 → offer', '[4, 2, 1, 1, 1]'],
              ['2', '4', '2', '2 → offer', '[2, 1, 1, 1]'],
              ['3', '2', '1', '1 → offer', '[1, 1, 1]'],
              ['4', '1', '1', '0 → kuch nahi', '[1]'],
            ] } },
            { p: 'size = 1 → loop khatam → <code>return pq.peek()</code> = <b>1</b> ✓' },
            { pre: `Round 1 ka pehla poll() andar se:
[8, 7, 4, 1, 2, 1]  root 8 nikla, last (1) root pe → [1, 7, 4, 1, 2]
children 7, 4 → bada 7 → swap      → [7, 1, 4, 1, 2]
index 1 ke children 1, 2 → bada 2 > 1 → swap → [7, 2, 4, 1, 1]` },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — har round sort</b>' },
            { code: sol(1046, 0) },
            { p: '<b>Optimal — max-heap</b>' },
            { code: sol(1046, 1) },
            { lines: [
              ['new PriorityQueue<>(Collections.reverseOrder())', 'Default min-heap ko ulta → max-heap. Root = sabse bhaari stone.'],
              ['for (int s : stones) pq.offer(s);', 'Har stone heap me (sift up). Total O(n log n).'],
              ['while (pq.size() > 1)', 'Takkar ke liye kam se kam 2 stones chahiye.'],
              ['int y = pq.poll();', 'Sabse bhaari. poll() Integer deta hai → int me unbox (size > 1 hai isliye null nahi).'],
              ['int x = pq.poll();', 'Doosra sabse bhaari, y ≥ x guaranteed.'],
              ['if (y != x) pq.offer(y - x);', 'Bacha hua tukda wapas heap me. Barabar → dono khatam.'],
              ['return pq.isEmpty() ? 0 : pq.peek();', 'Koi nahi bacha → 0. peek() empty pe null deta, isliye check.'],
            ] },
            { tip: '<code>Collections.reverseOrder()</code> yaad karo — <code>(a, b) -> b - a</code> yahan chalega (1..1000), par habit <code>Integer.compare(b, a)</code> ki daalo.' },
          ],
        },
        {
          title: 'Part 6 — Visualize: heap tree + array saath-saath',
          blocks: [
            { list: [
              'Upar <b>stones</b> array, neeche <b>pq — tree</b> aur <b>pq — array</b>. Dono same data hain: array ka index = tree ka level-order position.',
              'offer ke time naya element <b>last slot</b> pe aata hai (peela/new), fir edge highlight hoke upar swap hota hai.',
              'poll ke time root nikalta hai, <b>last element root pe</b> aata hai aur neeche jaata hai.',
              'VARIABLES me <code>pq</code> ki string = Java ka <code>pq.toString()</code> — dhyan do sorted nahi hai.',
            ] },
            { viz: 1046, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[1]</code>', '1', 'Loop chalta hi nahi, peek() = 1'],
              ['<code>[3,3]</code>', '0', 'Dono barabar → heap khaali → 0'],
              ['<code>[2,2,2]</code>', '2', '2,2 khatam, ek 2 bacha'],
              ['<code>[1000,1]</code>', '999', 'Farak wapas heap me'],
              ['<code>[10,4,2,10]</code>', '2', '10,10 khatam; 4,2 → 2'],
            ] } },
            { p: 'Galti: <code>int ans = pq.peek();</code> bina empty check → heap khaali ho toh <b>NullPointerException</b> (null ko int me unbox).' },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space', 'Main idea'], rows: [
              ['Brute', 'O(n² log n)', 'O(n)', 'Har round sort'],
              ['Optimal', 'O(n log n)', 'O(n)', 'Max-heap: har round 2 poll + 1 offer'],
            ] } },
            { p: 'Build ke liye <code>new PriorityQueue&lt;&gt;(list)</code> (heapify O(n)) bhi kar sakte ho, par rounds ki wajah se total O(n log n) hi rahega.' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Heap aur sorted array me kya fark hai?', 'Heap sirf root (min/max) guarantee karta hai; baaki partial order. Sorted array poora order rakhta hai par insert O(n) hai, heap me O(log n).'],
              ['Java PriorityQueue default kaunsa heap hai?', 'Min-heap (natural ordering).'],
              ['Max-heap kaise banaoge?', '<code>new PriorityQueue&lt;&gt;(Collections.reverseOrder())</code> ya comparator <code>(a, b) -&gt; Integer.compare(b, a)</code>.'],
              ['offer, poll, peek ki complexity?', 'offer O(log n), poll O(log n), peek O(1).'],
              ['Heap array me index i ke children kahan?', '2i + 1 aur 2i + 2; parent (i − 1) / 2.'],
              ['<code>System.out.println(pq)</code> sorted order deta hai?', 'Nahi — andar ka array order. Sorted chahiye toh poll karte jao.'],
              ['Is problem me loop kitni baar chalega max?', 'Har round size kam se kam 1 kam hota hai → max n − 1 rounds.'],
              ['<code>a - b</code> comparator me kya risk hai?', 'Bade/negative numbers pe int overflow → galat order. <code>Integer.compare</code> safe.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo (Brute → Optimal)', 'Each round needs the two heaviest stones. The brute force keeps a list and sorts it every round, which costs O(n log n) per round and O(n² log n) overall. Since I only ever need the maximum repeatedly, a max-heap fits perfectly: I add every stone, then while more than one stone remains I poll the two largest, and if they differ I offer the difference back. Each round is O(log n) and there are at most n rounds, so the total is O(n log n) time with O(n) space. Finally I return the last stone, or 0 if the heap is empty.'],
              ['Follow-up: "Agar n bahut bada ho aur weights chhote (≤ 1000)?"', 'Since weights are bounded by 1000, I could use a counting array of size 1001 and walk down from the largest weight, smashing counts in place. That gives roughly O(n + W) time, where W is the maximum weight, without any heap.'],
              ['1-minute: What is a heap?', 'A heap is a complete binary tree where every parent is smaller than its children in a min-heap, or larger in a max-heap, so the root is always the minimum or maximum. It is stored in an array, with children of index i at 2i + 1 and 2i + 2. Peek is O(1), insert and remove-top are O(log n), and building from n elements is O(n). Java PriorityQueue is a min-heap by default; I pass Collections.reverseOrder for a max-heap.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Paper pe [2, 7, 4, 1, 8, 1] ko <b>ek-ek karke</b> max-heap tree me daalo — har offer ke baad tree aur array dono likho (Part 4 table se match karo).',
              'Index formulas likho: parent (i−1)/2, left 2i+1, right 2i+2. Index 4 ka parent? (1)',
              'Brute code (sort wala) bina dekhe likho aur submit karo.',
              'Optimal code ko line-by-line padho, fir visualizer me Example 1 chalao.',
              'Apne shabdon me: "max-heap me root hamesha sabse bada kyun?"',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Optimal memory se, 6 minute timer. Bolte hue likho.',
              '<b>Task B:</b> Part 10 ka 1-minute "What is a heap" answer bina dekhe record karo (60–75 sec).',
              '<b>Task C:</b> Follow-up: weights ≤ 1000 → counting array approach ka pseudo-code likho.',
              '<b>Task D:</b> <code>(a, b) -&gt; b - a</code> kab fail hoga — ek example do (e.g. a = Integer.MIN_VALUE).',
              '<b>Extra (optional):</b> 2 SQL questions agar time ho (SQL track Week 12 tak tha).',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 1046 dono approaches se submit (Accepted).',
              'Fundamentals tab: "Heap kya hai" + "Heap = Array" padho.',
              'Kal (Day 2): LC 703 Kth Largest in a Stream — problem pehle padh lo, socho "k bade numbers me sabse chhota" kaise jaldi milega.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Max-heap array [8, 7, 4, 1, 2, 1] me index 1 ke children?', 'Index 3 aur 4 → 1 aur 2.'],
              ['[3, 3] ka answer?', '0'],
              ['Max-heap ka Java constructor?', '<code>new PriorityQueue&lt;&gt;(Collections.reverseOrder())</code>'],
              ['Optimal ki time complexity?', 'O(n log n)'],
              ['Heap sorted hai? Kya guarantee hai?', 'Nahi. Sirf root = max (max-heap) / min (min-heap), aur har parent apne children se better.'],
            ] },
          ],
        },
      ],
      checks: [
        'Heap ke 2 rules (complete tree + heap property) bata sakta/sakti hu',
        'Parent/child index formulas yaad hain',
        'PriorityQueue min-heap aur max-heap dono bana sakta/sakti hu',
        'LC 1046 brute + optimal Accepted',
        'Part 4 ka dry run table khud banaya',
        'Visualizer me tree + array dono badalte dekhe',
        '8 interview sawaal bina dekhe',
        'Final self-test 5/5',
      ],
      memory: 'Heap = complete tree in array; root = champion. Max-heap = reverseOrder. "Har baar sabse bade do" → poll, poll, offer(farak).',
    },

    // ======================= DAY 2 =======================
    2: {
      title: 'Min-heap of size k (Design)',
      goal: '<b>Kth largest → MIN-heap of size k</b> wala ulta-lagne-wala pattern samajhna, aur <b>LC 703 Kth Largest Element in a Stream</b> ko design class ke roop me likhna (field = heap).',
      main: 703,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rq(1046, 'Last Stone Weight (kal)', 'Do sabse bhaari stones takrao, farak wapas.', '[2,7,4,1,8,1] → 8,7→1 · 4,2→2 · 2,1→1 · 1,1→0 → 1', 'Max-heap simulation',
              ['Sab max-heap me.', 'size > 1: y = poll, x = poll.', 'y != x → offer(y − x).', 'Empty → 0, warna peek.'],
              `PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
for (int s : stones) pq.offer(s);
while (pq.size() > 1) {
    int y = pq.poll(), x = pq.poll();
    if (y != x) pq.offer(y - x);
}
return pq.isEmpty() ? 0 : pq.peek();`, 'poll, poll, offer(farak).'),
            ...rq(98, 'Validate Binary Search Tree', 'Check karo tree valid BST hai.', '[5,1,4,null,null,3,6] → false (4 root 5 ke right me, par 4 < 5)', 'DFS with (low, high) range',
              ['Har node ki allowed range (low, high).', 'Left me jao → high = node.val; right → low = node.val.', 'long use karo (Integer.MIN/MAX values).'],
              `public boolean isValidBST(TreeNode root) {
    return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
}
private boolean valid(TreeNode n, long lo, long hi) {
    if (n == null) return true;
    if (n.val <= lo || n.val >= hi) return false;
    return valid(n.left, lo, n.val) && valid(n.right, n.val, hi);
}`, 'BST = range check, sirf parent se compare nahi. Heap property sirf parent-child hai — isliye heap check aasaan.'),
            ...rq(21, 'Merge Two Sorted Lists', 'Do sorted lists ko ek sorted list me jodo.', '[1,2,4] + [1,3,4] → [1,1,2,3,4,4]', 'Dummy node + two pointers',
              ['dummy → tail.', 'Chhota head attach, aage badho.', 'Bacha hua list seedha jod do.'],
              `public ListNode mergeTwoLists(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), t = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { t.next = a; a = a.next; }
        else { t.next = b; b = b.next; }
        t = t.next;
    }
    t.next = (a != null) ? a : b;
    return dummy.next;
}`, 'Dummy + chhota pehle. (Bahut saari lists ho toh min-heap of heads — wahi idea bada version.)'),
          ],
        },
        {
          title: 'Part 1 — Concept: Kth largest ke liye MIN-heap kyun?',
          blocks: [
            { p: 'Socho stream me numbers aa rahe hain aur hamesha 3rd largest chahiye. Saare rakhne ki zaroorat nahi — sirf <b>top 3</b> chahiye. Un 3 me se <b>sabse chhota</b> hi 3rd largest hai.' },
            { pre: `Stream: 4, 5, 8, 2 (k = 3)
Top-3 set: {4, 5, 8}  → inme sabse chhota = 4 = 3rd largest
Naya aaya 10 → {4, 5, 8, 10} → 4 ab top-3 me nahi → hatao → {5, 8, 10} → 3rd largest 5` },
            { p: 'Har baar "top-k me sabse chhota" dekhna aur hatana hai → <b>MIN-heap</b>, size k. Ye ulta lagta hai ("largest ke liye min?") — isliye interview me ye favourite hai.' },
            { table: { head: ['Chahiye', 'Heap', 'Size', 'peek() kya deta hai'], rows: [
              ['Kth <b>largest</b>', 'MIN-heap', 'k', 'k bade me sabse chhota = kth largest'],
              ['Kth <b>smallest</b>', 'MAX-heap', 'k', 'k chhote me sabse bada = kth smallest'],
            ] } },
            { code: `// template — size-k min-heap
pq.offer(x);
if (pq.size() > k) pq.poll();   // k+1 ho gaya → sabse chhota bahar
// pq.peek() = kth largest (jab size == k)` },
            { p: '<b>Design class</b> me heap ek <b>field</b> hai jo calls ke beech zinda rehta hai. Constructor shuruaati nums daalta hai, <code>add()</code> har baar ek daalta hai aur answer deta hai.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 703 Kth Largest Element in a Stream', blocks: [{ problem: 703 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute:</b> Saare numbers ek List me. Har add pe <code>Collections.sort</code>, <code>list.get(size − k)</code>. Har add O(n log n). 10⁴ adds × 10⁴ size × log → bahut slow.' },
            { p: '<b>Better:</b> List ko hamesha sorted rakho. Binary search (Phase 6!) se insertion point O(log n), lekin <code>list.add(i, x)</code> shifting O(n). Har add O(n).' },
            { p: '<b>Optimal:</b> Saare numbers rakhne ki zaroorat hi nahi — jo number top-k se bahar ho gaya woh <b>kabhi wapas</b> top-k me nahi aayega (numbers sirf aate hain, jaate nahi). Toh sirf k numbers min-heap me.' },
            { olist: [
              'Field: <code>k</code> aur <code>PriorityQueue&lt;Integer&gt; pq</code> (min-heap).',
              'Constructor: har num ke liye <code>add(x)</code> call — wahi logic reuse.',
              '<code>add(val)</code>: offer → size &gt; k toh poll → return peek.',
            ] },
            { tip: 'Constructor me nums k se kam bhi ho sakte hain (k − 1 tak). Isliye "size > k toh poll" — kabhi zabardasti size k nahi banate.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: k = 3, nums = [4,5,8,2], fir add 3, 5, 10, 9, 4',
          blocks: [
            { table: { head: ['Call', 'offer ke baad pq', 'size > 3?', 'pq (final)', 'return'], rows: [
              ['ctor add(4)', '[4]', 'no', '[4]', '(ignore)'],
              ['ctor add(5)', '[4, 5]', 'no', '[4, 5]', '(ignore)'],
              ['ctor add(8)', '[4, 5, 8]', 'no', '[4, 5, 8]', '(ignore)'],
              ['ctor add(2)', '[2, 4, 8, 5]', 'yes → poll 2', '[4, 5, 8]', '(ignore)'],
              ['add(3)', '[3, 4, 8, 5]', 'yes → poll 3', '[4, 5, 8]', '<b>4</b>'],
              ['add(5)', '[4, 5, 8, 5]', 'yes → poll 4', '[5, 5, 8]', '<b>5</b>'],
              ['add(10)', '[5, 5, 8, 10]', 'yes → poll 5', '[5, 10, 8]', '<b>5</b>'],
              ['add(9)', '[5, 9, 8, 10]', 'yes → poll 5', '[8, 9, 10]', '<b>8</b>'],
              ['add(4)', '[4, 8, 10, 9]', 'yes → poll 4', '[8, 9, 10]', '<b>8</b>'],
            ] } },
            { p: 'Output: <code>[null, 4, 5, 5, 8, 8]</code> ✓ (pq column = Java ka exact andar ka order.)' },
            { pre: `add(10) andar se:  [5, 5, 8] + 10 at idx 3 → parent idx 1 (5) ≤ 10 → ruk → [5, 5, 8, 10]
poll(): root 5 out, last 10 root pe → [10, 5, 8] → chhota child 5 → swap → [5, 10, 8]` },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — har add pe sort</b>' },
            { code: sol(703, 0) },
            { p: '<b>Better — sorted list + binary search insert</b>' },
            { code: sol(703, 1) },
            { p: '<b>Optimal — min-heap of size k</b>' },
            { code: sol(703, 2) },
            { lines: [
              ['private final int k;', 'Har add() ko k chahiye → field.'],
              ['private final PriorityQueue<Integer> pq = new PriorityQueue<>();', 'Min-heap; calls ke beech state yahi hai.'],
              ['this.k = k;', 'Parameter k ko field me copy (naam same hai isliye this.).'],
              ['for (int x : nums) add(x);', 'Shuruaati numbers ke liye wahi logic reuse — duplicate code nahi.'],
              ['pq.offer(val);', 'Naya number heap me, O(log k).'],
              ['if (pq.size() > k) pq.poll();', 'k+1 ho gaye → sabse chhota top-k me nahi → bahar.'],
              ['return pq.peek();', 'k bade numbers me sabse chhota = kth largest.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize: operation sequence',
          blocks: [
            { list: [
              '<b>operation</b> box me abhi kaunsa call chal raha hai.',
              'CALL STACK me constructor ke andar <code>add()</code> frame dekho — constructor bhi add() hi call karta hai.',
              'Heap kabhi 4 se bada nahi hota (k + 1), aur poll ke baad wapas 3.',
              '<b>output</b> array har add ke baad bharta hai.',
            ] },
            { viz: 703, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Kya hoga', 'Kyun'], rows: [
              ['nums = [], k = 1', 'add(-3) → -3, add(-2) → -2, add(-4) → -2', 'Heap khaali se shuru; size > 1 pe poll'],
              ['nums ke k − 1 elements', 'Pehla add size k bana deta hai', 'Constraint guarantee'],
              ['Duplicates [7,7,7,7,8,3], k=4', '7, 7, 7, 8', 'Duplicates alag gine jaate hain'],
              ['Negative values', 'Normal', 'Min-heap natural order, comparator nahi'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'add()', 'Constructor', 'Space'], rows: [
              ['Brute', 'O(n log n)', 'O(n)', 'O(n)'],
              ['Better', 'O(n)', 'O(n²) worst', 'O(n)'],
              ['Optimal', 'O(log k)', 'O(n log k)', 'O(k)'],
            ] } },
            { p: 'Optimal me memory sirf k — stream kitna bhi lamba ho. Yahi "stream" problems ka main point hai.' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Kth largest ke liye min-heap kyun, max-heap kyun nahi?', 'Min-heap of size k ka root = top-k me sabse chhota = kth largest; aur wahi hatana hota hai. Max-heap me sab rakhna padega aur k baar poll.'],
              ['Heap ka size kabhi k + 1 se zyada hota hai?', 'Nahi — offer ke turant baad poll.'],
              ['Jo number poll hua woh kabhi wapas answer ban sakta hai?', 'Nahi — numbers sirf add hote hain, toh uske upar kam se kam k numbers hamesha rahenge.'],
              ['Constructor me add() reuse karne ka fayda?', 'Ek hi jagah logic, bug ka chance kam.'],
              ['add() ki complexity?', 'O(log k).'],
              ['Agar remove(val) bhi support karna ho?', 'Heap kaam ka nahi (remove O(n)); TreeMap (value → count) ya do structures sochna padega.'],
              ['peek() kab null de sakta hai?', 'Jab heap khaali ho — constraint ke hisaab se add ke baad kabhi nahi.'],
              ['Thread-safe banana ho toh?', 'add() synchronized karo ya PriorityBlockingQueue + lock (offer/poll/peek ek atomic unit hona chahiye).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'The kth largest of a growing stream only depends on the k largest values seen so far, because any value that falls out of the top k can never come back. So I store just those k values in a min-heap: its root is the smallest of the top k, which is exactly the kth largest. In add, I offer the value and, if the heap now has k + 1 elements, poll the root. The constructor simply calls add for each initial number. Each add is O(log k) and memory is O(k).'],
              ['Follow-up: "Agar k bahut bada ho (close to n)?"', 'The heap still works with O(log k) per add, which is fine. If memory is the concern, nothing better exists for an arbitrary stream, because we must remember the top k values. If values are in a small bounded range, I could keep counts in an array or a Fenwick tree and find the kth largest by walking counts.'],
              ['1-minute: Why does a min-heap give the kth largest?', 'If I keep only the k largest elements seen so far, the kth largest is the smallest among them. A min-heap of size k exposes exactly that element at its root. Whenever a new element arrives, I offer it and, if the heap grows to k + 1, I poll the root. Each operation is O(log k) with O(k) memory, and it works for unbounded streams where sorting is impossible.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Paper pe Part 4 table khud banao — har add ke baad heap ke 3 numbers likho.',
              'Ek line me bolo: "k bade numbers me sabse chhota = kth largest".',
              'Brute (sort) code likho aur submit karo — fir dekho kitna slow hai.',
              'Optimal class copy-type karo (memorize zaroori nahi), visualizer Example 2 chalao.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Optimal class memory se, 5 min. Field init, constructor, add — sab.',
              '<b>Task B:</b> Better approach (binarySearch insert) bhi likho — <code>-(i + 1)</code> insertion point ka matlab explain karo.',
              '<b>Task C:</b> Follow-up thread-safety pe 45-second answer.',
              '<b>Task D:</b> Part 10 "Approach" answer bol ke record karo.',
              '<b>Extra (optional):</b> 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'LC 703 Optimal submit (Sohvi: Brute bhi).',
              'Fundamentals tab: "Sift Up, Sift Down, Heapify" padh ke aao — kal khud ka heap likhenge.',
              'Socho: <code>[4, 5, 8]</code> me offer(2) ke baad array kya hoga? (answer: [2, 4, 8, 5])',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Kth largest → kaunsa heap, kitna size?', 'Min-heap, size k.'],
              ['Kth smallest → ?', 'Max-heap, size k.'],
              ['k=2, nums=[], add(1), add(5), add(3) → outputs?', 'add(1) → 1 (sirf ek), add(5) → 1, add(3) → 3.'],
              ['add() complexity?', 'O(log k)'],
              ['Constructor me kya karte hain?', 'this.k = k, fir har num ke liye add(num).'],
            ] },
          ],
        },
      ],
      checks: [
        'Kth largest = min-heap of size k — kyun, explain kar sakta/sakti hu',
        'Part 4 dry run khud banaya',
        'LC 703 Optimal Accepted',
        'Design class ka structure (fields, constructor, method) samjha',
        'Visualizer me constructor ke andar add() frame dekha',
        '8 interview sawaal bina dekhe',
        'Final self-test 5/5',
      ],
      memory: 'Kth LARGEST → MIN-heap size k: offer, size > k → poll, peek = answer.',
    },

    // ======================= DAY 3 =======================
    3: {
      title: 'Heap Internals: Sift Up / Sift Down (khud ka heap)',
      goal: 'PriorityQueue ke andar kya hota hai — <b>array me heap, sift up (push), sift down (pop), heapify O(n)</b> — aur LC 1046 ko <b>bina PriorityQueue</b> khud ke int[] max-heap se solve karna. PUSH: LC 703 dobara bina dekhe.',
      main: 1046,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rq(703, 'Kth Largest in a Stream (kal)', 'Stream me hamesha kth largest.', 'k=3, [4,5,8,2] → add(3)=4, add(5)=5, add(10)=5', 'Min-heap of size k',
              ['Field: k, min-heap.', 'Constructor: har num → add.', 'add: offer, size > k → poll, return peek.'],
              `public int add(int val) {
    pq.offer(val);
    if (pq.size() > k) pq.poll();
    return pq.peek();
}`, 'k bade me sabse chhota = kth largest.'),
            ...rq(104, 'Maximum Depth of Binary Tree', 'Tree ki height (levels).', '[3,9,20,null,null,15,7] → 3', 'DFS: 1 + max(left, right)',
              ['null → 0.', 'Dono side ki depth lo.', '1 + max.'],
              `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`, 'Complete tree (heap) ki height = ⌊log₂ n⌋ → sift up/down O(log n).'),
            ...rq(704, 'Binary Search', 'Sorted array me target ka index.', '[-1,0,3,5,9,12], 9 → 4', 'lo/hi, mid',
              ['lo = 0, hi = n − 1.', 'mid = lo + (hi − lo) / 2.', 'Chhota → lo = mid + 1, bada → hi = mid − 1.'],
              `int lo = 0, hi = nums.length - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
}
return -1;`, 'Har step aadha → log n. Heap me bhi har step ek level → log n.'),
          ],
        },
        {
          title: 'Part 1 — Concept: Sift Up, Sift Down, Heapify',
          blocks: [
            { p: '<b>Array layout</b> (0-indexed): parent <code>(i − 1) / 2</code>, children <code>2i + 1</code>, <code>2i + 2</code>. Complete tree hai isliye array me koi gap nahi.' },
            { h: 'Push (insert) = Sift Up' },
            { olist: ['Naya element <code>h[size]</code> pe rakho (tree ka next khaali slot).', 'Jab tak parent usse chhota hai (max-heap): swap, i = parent.', 'size++.'] },
            { pre: `max-heap [7, 2, 4, 1] me push(8):
[7, 2, 4, 1, 8]   i=4, parent 1 (2) < 8 → swap
[7, 8, 4, 1, 2]   i=1, parent 0 (7) < 8 → swap
[8, 7, 4, 1, 2]   i=0 → stop` },
            { h: 'Pop (remove top) = Sift Down' },
            { olist: ['size--, <code>h[0] = h[size]</code> (last ko root pe).', 'Jab tak koi child bada hai: <b>sabse bade child</b> se swap.', 'Dono child chhote ya leaf → stop.'] },
            { pre: `[8, 7, 4, 1, 2, 1] pop → last (1) root pe → [1, 7, 4, 1, 2]
children 7, 4 → big = 7 → swap → [7, 1, 4, 1, 2]
idx 1 children 1, 2 → big = 2 → swap → [7, 2, 4, 1, 1] ✓` },
            { tip: 'Sift down me <b>bade child</b> se hi swap kyun? Agar chhote child se swap kiya toh woh chhota upar aa jaayega aur bada uska child ban jaayega — property toot jaayegi.' },
            { h: 'Heapify (build) O(n)' },
            { p: 'Ek-ek push = O(n log n). Lekin poora array ho toh last non-leaf <code>n/2 − 1</code> se 0 tak sift down karo — leaves (aadhe nodes) ko kuch nahi karna, unke upar wale sirf 1 level… total ≈ n/4·1 + n/8·2 + … = <b>O(n)</b>.' },
            { code: `for (int i = n / 2 - 1; i >= 0; i--) siftDown(h, n, i);   // O(n)` },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 1046 (bina PriorityQueue)', blocks: [{ problem: 1046 }, { p: 'Interviewer: "Good. Ab PriorityQueue use mat karo — heap khud implement karo."' }] },
        {
          title: 'Part 3 — Thinking: library → khud ka heap',
          blocks: [
            { p: 'Logic same rahega (poll, poll, offer farak). Bas teen helper banane hain jo PriorityQueue karta tha:' },
            { table: { head: ['PriorityQueue', 'Khud ka', 'Kaam'], rows: [
              ['<code>pq.offer(x)</code>', '<code>size = push(heap, size, x)</code>', 'end me rakh ke sift up'],
              ['<code>pq.peek()</code>', '<code>heap[0]</code>', 'root'],
              ['<code>pq.poll()</code>', '<code>y = heap[0]; size = pop(heap, size)</code>', 'last root pe + sift down'],
              ['<code>pq.size()</code>', '<code>size</code>', 'alag variable'],
            ] } },
            { olist: [
              'Array ka size <code>stones.length</code> kaafi hai — har round 2 nikalte, max 1 daalte hain.',
              'Java me int pass-by-value hai, isliye push/pop naya size <b>return</b> karte hain.',
              'pop se pehle <code>heap[0]</code> padh lo — pop ke baad root badal jaata hai.',
            ] },
          ],
        },
        {
          title: 'Part 4 — Dry run: [2, 7, 4, 1, 8, 1] (khud ka heap)',
          blocks: [
            { table: { head: ['Step', 'heap[0..size−1]', 'size'], rows: [
              ['push 2', '[2]', '1'],
              ['push 7 (7 > 2 swap)', '[7, 2]', '2'],
              ['push 4', '[7, 2, 4]', '3'],
              ['push 1', '[7, 2, 4, 1]', '4'],
              ['push 8 (swap ×2)', '[8, 7, 4, 1, 2]', '5'],
              ['push 1', '[8, 7, 4, 1, 2, 1]', '6'],
              ['y = 8, pop', '[7, 2, 4, 1, 1]', '5'],
              ['x = 7, pop', '[4, 2, 1, 1]', '4'],
              ['push 1', '[4, 2, 1, 1, 1]', '5'],
              ['y = 4, x = 2, push 2', '[2, 1, 1, 1]', '4'],
              ['y = 2, x = 1, push 1', '[1, 1, 1]', '3'],
              ['y = 1, x = 1 (barabar)', '[1]', '1'],
            ] } },
            { p: 'return heap[0] = <b>1</b> ✓. Dhyan do: khud ka heap ka array order bilkul PriorityQueue (Day 1 table) jaisa hi aaya — kyunki same tie rules (barabar pe swap nahi, left child pehle).' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { code: sol(1046, 2) },
            { lines: [
              ['int[] heap = new int[stones.length];', 'Heap ka storage. Kabhi n se zyada elements nahi honge.'],
              ['for (int s : stones) size = push(heap, size, s);', 'Build (O(n log n)). Heapify se O(n) bhi kar sakte.'],
              ['int y = heap[0];', 'Root = sabse bhaari; pop se PEHLE padho.'],
              ['h[i] = val;', 'Naya element last slot pe.'],
              ['while (i > 0 && h[(i - 1) / 2] < h[i])', 'Parent chhota hai → max-heap property tooti → upar chadhao.'],
              ['size--; h[0] = h[size];', 'Last element root pe, size ek kam.'],
              ['if (l < size && h[l] > h[big]) big = l;', 'Teeno (i, l, r) me sabse bada dhundo; bounds check zaroori.'],
              ['if (big == i) break;', 'Parent hi sabse bada → sahi jagah.'],
            ] },
            { p: '<b>PUSH — LC 703</b> bina dekhe likho, fir yahan match karo:' },
            { code: sol(703, 2) },
          ],
        },
        {
          title: 'Part 6 — Visualize: push/pop andar se',
          blocks: [
            { list: [
              'Upar tab me <b>Own Heap</b> variant chuno (default yahi khulega).',
              'CALL STACK: <code>push</code>/<code>pop</code> frame upar, <code>lastStoneWeight</code> neeche.',
              'Array view me grey cells = size ke bahar (purana kachra, ignore).',
              'Swap pe tree ki edge highlight hoti hai — wahi path O(log n) hai.',
            ] },
            { viz: 1046, ex: 0, variant: 1 },
            { p: 'PUSH ke liye LC 703 ka visualizer (Example 2, duplicates):' },
            { viz: 703, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Kya dhyan rakhna', 'Result'], rows: [
              ['[1]', 'while chalta hi nahi', '1'],
              ['[3,3]', 'pop se size 0 → return 0', '0'],
              ['pop jab size 1 → 0', 'h[0] = h[0]; loop me l < 0 false → break', 'safe'],
              ['Equal values', '<code>&lt;</code> / <code>&gt;</code> strict → barabar pe swap nahi', 'stable-ish, PQ jaisa order'],
              ['Index formula', '<code>(i − 1) / 2</code> — i = 0 pe −1/2 = 0 (Java truncation) par loop i > 0 se guard', 'safe'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Operation', 'Time', 'Kyun'], rows: [
              ['push', 'O(log n)', 'Ek path upar'],
              ['pop', 'O(log n)', 'Ek path neeche'],
              ['peek', 'O(1)', 'heap[0]'],
              ['Build via n push', 'O(n log n)', ''],
              ['Heapify', 'O(n)', 'Neeche ke nodes ka kaam kam'],
              ['LC 1046 total', 'O(n log n), space O(n)', 'Same as PQ'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Sift up kab rukta hai?', 'Jab root pe pahunch jaaye ya parent already better ho.'],
              ['Pop me last element hi root pe kyun?', 'Taaki tree complete rahe (array me gap na bane); fir sift down se property theek.'],
              ['Sift down me kis child se swap?', 'Better wale (max-heap me bade) se — warna property tootegi.'],
              ['Heapify O(n) kyun, O(n log n) kyun nahi?', 'Aadhe nodes leaves (0 kaam), quarter 1 level, … sum n·Σ h/2^h = O(n).'],
              ['1-indexed heap me formulas?', 'parent i/2, children 2i, 2i+1.'],
              ['Heap sort kaise?', 'Heapify (max-heap), fir baar baar root ko end se swap karke size-- aur sift down. O(n log n), O(1) space, stable nahi.'],
              ['Min-heap banana ho toh kya badlega?', 'Comparisons ulte: parent > child pe swap, sift down me chhota child.'],
              ['Decrease-key kaise?', 'Value badlo, fir sift up (min-heap). Index pata hona chahiye — PQ me ye O(n) search se hota hai.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo (own heap)', 'I implement a max-heap on an int array sized to the input. push places the value at index size and sifts it up while its parent at (i − 1) / 2 is smaller. pop moves the last element to the root, shrinks the size and sifts down by swapping with the larger child until both children are smaller. The algorithm is unchanged: read the root, pop twice, and push the difference if non-zero. Each operation is O(log n), so total O(n log n) time and O(n) space.'],
              ['Follow-up: "Build heap O(n) kaise?"', 'Instead of n inserts, I can copy the array and run sift down from the last internal node, index n / 2 − 1, back to the root. Leaves need no work and nodes higher up are few, so the total work sums to O(n). Java does this when constructing a PriorityQueue from a collection.'],
              ['1-minute: Insertion and deletion inside a heap', 'For insertion, I place the element at the end of the array and sift it up, swapping with its parent while it is better. For removing the top, I move the last element to the root, shrink the size, and sift it down, swapping with the better child until neither child is better. Both walk one root-to-leaf path, so they are O(log n).'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Array [2, 7, 4, 1, 8, 1] ko paper pe ek-ek push karke tree banao — har swap ka arrow banao.',
              'Fir ek pop karo: last ko root pe, bade child se swap. Part 1 ka pre match karo.',
              'Sirf <code>push</code> function khud likhne ki koshish karo (9 lines).',
              'Visualizer Own Heap variant poora dekho.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Poora own-heap solution memory se, 15 min.',
              '<b>Task B:</b> Heapify function (siftDown loop n/2−1 → 0) likho aur O(n) ka proof 60 sec me bolo.',
              '<b>Task C:</b> LC 703 bina dekhe (PUSH), 4 min.',
              '<b>Task D:</b> Heap sort in-place likho (bonus understanding, LeetCode problem nahi).',
              '<b>Extra (optional):</b> 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [
            { list: [
              'Own-heap solution LC 1046 pe submit.',
              'Kal: LC 215 Kth Largest Element in an Array — sort vs heap. Problem padh ke aao.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Index 5 ka parent? Index 2 ke children?', '(5−1)/2 = 2; 5 aur 6.'],
              ['Max-heap [9, 5, 8] me push(10) ke baad?', '[10, 9, 8, 5]'],
              ['[9, 5, 8, 1] pop ke baad?', '[8, 5, 1]'],
              ['Heapify kis index se start?', 'n/2 − 1 (last non-leaf), 0 tak sift down.'],
              ['Heapify ki complexity?', 'O(n)'],
            ] },
          ],
        },
      ],
      checks: [
        'Sift up aur sift down paper pe kar sakta/sakti hu',
        'Own heap push/pop code likha',
        'LC 1046 own-heap Accepted',
        'Heapify O(n) ka reason bata sakta/sakti hu',
        'LC 703 bina dekhe likha (PUSH)',
        'Visualizer me Own Heap variant dekha',
        '8 interview sawaal + self-test',
      ],
      memory: 'Push = end me + sift up. Pop = last root pe + bade child se sift down. Heapify = n/2−1 se 0 tak sift down, O(n).',
    },

    // ======================= DAY 4 =======================
    4: {
      title: 'Kth Largest: Sort vs Heap',
      goal: '<b>LC 215 Kth Largest Element in an Array</b> — sort (O(n log n)) vs size-k min-heap (O(n log k)); kab kaunsa, aur k vs n ka trade-off.',
      main: 215,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rq(1046, 'Last Stone Weight (own heap, kal)', 'Bina PQ ke heap.', 'push 8 into [7,2,4,1] → [8,7,4,1,2]', 'Sift up / sift down',
              ['push: h[size] = val, parent chhota → swap.', 'pop: h[0] = h[--size], bade child se swap.', 'Root pop se pehle padho.'],
              `while (i > 0 && h[(i - 1) / 2] < h[i]) {
    int p = (i - 1) / 2;
    int t = h[p]; h[p] = h[i]; h[i] = t;
    i = p;
}`, 'Upar = parent (i−1)/2, neeche = bada child.'),
            ...rq(703, 'Kth Largest in a Stream', 'Design: add() pe kth largest.', 'k=4, [7,7,7,7,8,3], add 2 → 7, add 10 → 7, add 9 → 7, add 9 → 8', 'Min-heap size k',
              ['offer.', 'size > k → poll.', 'peek.'],
              `pq.offer(val);
if (pq.size() > k) pq.poll();
return pq.peek();`, 'Aaj ka 215 = 703 ka "fixed array" version.'),
            ...rq(1, 'Two Sum', 'Do indices jinka sum target.', '[2,7,11,15], 9 → [0,1]', 'HashMap value → index',
              ['need = target − x.', 'map me need hai → answer.', 'Warna put(x, i).'],
              `Map<Integer, Integer> map = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    if (map.containsKey(target - nums[i])) return new int[]{map.get(target - nums[i]), i};
    map.put(nums[i], i);
}
return new int[]{-1, -1};`, 'Sort se O(n log n), hash se O(n) — aaj bhi yahi sawaal: sort ya smarter structure?'),
          ],
        },
        {
          title: 'Part 1 — Concept: k vs n, aur teen raaste',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space', 'Kab'], rows: [
              ['Sort', 'O(n log n)', 'O(log n)', 'Simple, bahut saare order queries'],
              ['Size-k min-heap', 'O(n log k)', 'O(k)', 'k ≪ n, ya stream'],
              ['Max-heap of all + k poll', 'O(n + k log n)', 'O(n)', 'Heapify O(n) ke saath acha'],
              ['Quickselect (kal)', 'O(n) avg', 'O(1)', 'Fixed array, avg linear'],
            ] } },
            { p: 'Example: n = 10⁶, k = 10 → n log n ≈ 2×10⁷, n log k ≈ 3.3×10⁶. k chhota ho toh heap kaafi tez. Agar k ≈ n, toh ulta socho: kth largest = (n − k + 1)th smallest → max-heap of size n − k + 1.' },
            { tip: 'Template wahi hai jo 703 me tha — fark sirf itna ki input ek baar me aata hai.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 215 Kth Largest Element in an Array', blocks: [{ problem: 215 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better',
          blocks: [
            { p: '<b>Brute:</b> <code>Arrays.sort(nums); return nums[n − k];</code> — ascending me kth largest end se kth, yaani index n − k. 2 lines, O(n log n). Interview me ye bolna zaroori hai, fir "kya behtar ho sakta hai?"' },
            { p: '<b>Better:</b> Poora order nahi chahiye — sirf top k. Min-heap of size k:' },
            { olist: ['Har x: offer.', 'size > k → poll (sabse chhota).', 'End: peek = kth largest.'] },
            { p: '<b>Duplicates:</b> "kth largest, not kth distinct" — [3,2,3,1,2,4,5,5,6], k=4 → 6,5,5,<b>4</b>. Heap me duplicates alag elements hain, toh apne aap sahi.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: [3,2,1,5,6,4], k = 2',
          blocks: [
            { table: { head: ['x', 'offer ke baad', 'size > 2?', 'pq'], rows: [
              ['3', '[3]', 'no', '[3]'],
              ['2', '[2, 3]', 'no', '[2, 3]'],
              ['1', '[1, 3, 2]', 'poll 1', '[2, 3]'],
              ['5', '[2, 3, 5]', 'poll 2', '[3, 5]'],
              ['6', '[3, 5, 6]', 'poll 3', '[5, 6]'],
              ['4', '[4, 6, 5]', 'poll 4', '[5, 6]'],
            ] } },
            { p: 'peek = <b>5</b> ✓. Example 2 (k = 4) ka final heap: <code>[4, 5, 5, 6]</code> → 4 ✓.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — sort</b>' },
            { code: sol(215, 0) },
            { p: '<b>Better — min-heap of size k</b>' },
            { code: sol(215, 1) },
            { lines: [
              ['Arrays.sort(nums); return nums[nums.length - k];', 'Ascending sort; kth largest = end se kth = index n − k.'],
              ['new PriorityQueue<>()', 'Min-heap: top = top-k me sabse chhota.'],
              ['pq.offer(x);', 'Har element ek baar heap me.'],
              ['if (pq.size() > k) pq.poll();', 'Heap kabhi k+1 se bada nahi → har op O(log k).'],
              ['return pq.peek();', 'Kth largest.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['nums me <b>x</b> pointer chalta hai.', 'Heap 3 tak jaata hai, poll se wapas 2.', 'Last step pe heap me exactly k sabse bade hain.'] },
            { viz: 215, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['[1], k=1', '1', 'Single'],
              ['[-1,-1], k=2', '-1', 'Duplicates + negatives'],
              ['[7,7,7,7], k=3', '7', 'Sab barabar'],
              ['k = n', 'minimum', 'Heap me sab, peek = min'],
              ['k = 1', 'maximum', 'Heap size 1'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Sort', 'O(n log n)', 'O(log n)'],
              ['Min-heap size k', 'O(n log k)', 'O(k)'],
            ] } },
            { p: 'Sort input array ko modify karta hai; heap nahi karta — interviewer puch sakta hai "input change kar sakte ho?".' },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Kth largest ka sorted index?', 'Ascending me n − k.'],
              ['Heap approach ki time?', 'O(n log k).'],
              ['k ≈ n ho toh?', 'Max-heap of size n − k + 1 rakho (kth largest = (n−k+1)th smallest).'],
              ['Max-heap me sab daal ke k−1 poll — complexity?', 'Heapify O(n) + k log n.'],
              ['Duplicates count hote hain?', 'Haan — kth largest in sorted order, distinct nahi.'],
              ['Stream ho toh kaunsa?', 'Heap (sort ke liye poora data chahiye).'],
              ['Input modify allowed nahi toh?', 'Heap use karo, ya copy pe sort/quickselect.'],
              ['Kya O(n) possible hai?', 'Haan average me Quickselect; worst-case O(n) median-of-medians se (rarely asked to code).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo', 'The simplest solution sorts the array and returns the element at index n − k, which is O(n log n). Since I only need the top k, I can do better with a min-heap of size k: I offer every element and poll whenever the size exceeds k, so the heap always holds the k largest seen so far and its root is the kth largest. That is O(n log k) time and O(k) extra space, does not modify the input, and works on streams.'],
              ['Follow-up: "k = n/2 ho toh heap ka fayda?"', 'When k is about n/2, O(n log k) is essentially O(n log n), so the heap has no asymptotic advantage over sorting. That is where quickselect shines with average O(n), or I accept sorting for simplicity.'],
              ['1-minute: Sort vs heap', 'Sorting is simplest at O(n log n) and good when I need many order statistics. A size-k min-heap is O(n log k) time and O(k) space, so it wins when k is much smaller than n and is the only option for streaming input. If k is close to n, I flip to a max-heap of size n − k + 1. For average linear time on a fixed array, quickselect is O(n).'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'Brute (sort) 2 lines likho, submit karo.',
              'Part 4 table Example 2 ke liye khud banao (k = 4). Final heap [4, 5, 5, 6] aana chahiye.',
              'Visualizer Example 2 chalao aur apni table se match karo.',
              'Fark samjho: 703 (stream, class) vs 215 (array, method) — same heap idea.',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Sort + heap dono 5 min me.',
              '<b>Task B:</b> k ≈ n wala max-heap of size n − k + 1 version likho aur test karo.',
              '<b>Task C:</b> Kal ke liye: quickselect ka partition step paper pe socho (Phase 2 two pointers yaad karo).',
              '<b>Extra (optional):</b> 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [{ list: ['LC 215 heap version submit.', 'Kal: Quickselect. LC 283 Move Zeroes ka partition idea revise kar lo.'] }],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[3,2,1,5,6,4], k=2 → ?', '5'],
              ['Heap ka final content (k=2)?', '[5, 6]'],
              ['Sort ka formula?', 'nums[n − k]'],
              ['Heap approach space?', 'O(k)'],
              ['Kab heap, kab sort?', 'k ≪ n ya stream → heap; simple/many queries → sort.'],
            ] },
          ],
        },
      ],
      checks: [
        'Sort aur heap dono approaches Accepted',
        'Dry run table khud banaya (dono examples)',
        'k vs n trade-off explain kar sakta/sakti hu',
        'Visualizer dekha',
        '8 interview sawaal + self-test',
        'Duplicates ka matlab samjha (distinct nahi)',
      ],
      memory: 'Sort → nums[n − k]. Heap → min-heap size k, peek. O(n log k).',
    },

    // ======================= DAY 5 =======================
    5: {
      title: 'Quickselect (Partition) — LC 215 ka doosra approach',
      goal: 'Quick sort ke <b>partition</b> se Kth largest average <b>O(n)</b> me — 3-way partition (duplicates safe), "sirf ek side me jao" ka logic, worst case aur pivot choice. PUSH: LC 703 re-solve.',
      main: 215,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision',
          blocks: [
            ...rq(215, 'Kth Largest (heap, kal)', 'Array ka kth largest.', '[3,2,1,5,6,4], k=2 → heap [5,6] → 5', 'Min-heap size k',
              ['offer har x.', 'size > k → poll.', 'peek.'],
              `PriorityQueue<Integer> pq = new PriorityQueue<>();
for (int x : nums) { pq.offer(x); if (pq.size() > k) pq.poll(); }
return pq.peek();`, 'O(n log k). Aaj O(n) avg.'),
            ...rq(283, 'Move Zeroes', 'Zeros end me, baaki order same, in-place.', '[0,1,0,3,12] → [1,3,12,0,0]', 'Partition with write pointer',
              ['k = next non-zero slot.', 'Non-zero mila → swap(k, i), k++.', 'End me zeros apne aap peeche.'],
              `int k = 0;
for (int i = 0; i < nums.length; i++) {
    if (nums[i] != 0) {
        int t = nums[k]; nums[k] = nums[i]; nums[i] = t;
        k++;
    }
}`, 'Ye ek PARTITION hai (non-zero | zero). Quickselect bhi partition hi hai (< pivot | ≥ pivot).'),
          ],
        },
        {
          title: 'Part 1 — Concept: Partition aur 3-way partition',
          blocks: [
            { p: '<b>Partition:</b> pivot chuno; chhote left, bade right. Ab pivot apni <b>final sorted jagah</b> pe hai — poora sort kiye bina!' },
            { p: '<b>Quickselect:</b> Humein sirf index <code>target = n − k</code> chahiye. Partition ke baad target jis side me hai, <b>sirf wahi side</b> aage dekho. Quick sort dono side jaata hai (n log n), quickselect ek side (n + n/2 + n/4 … = 2n = O(n) avg).' },
            { h: '3-way partition (Dutch National Flag)' },
            { pre: `[lo .. lt-1]   < pivot
[lt .. i-1]    == pivot
[i  .. gt]     abhi dekhna hai
[gt+1 .. hi]   > pivot

nums[i] < pivot → swap(lt, i), lt++, i++
nums[i] > pivot → swap(i, gt), gt--     (i mat badhao! naya element aaya hai)
nums[i] == pivot → i++` },
            { p: 'Fir: <code>target &lt; lt</code> → left (hi = lt − 1); <code>target &gt; gt</code> → right (lo = gt + 1); warna target == pivot wale block me → <b>return pivot</b>.' },
            { tip: '3-way kyun? Agar saare elements barabar hain (e.g. 10⁵ ones), 2-way partition har baar sirf 1 element hatayega → O(n²). 3-way me pura "== block" ek baar me fix.' },
            { table: { head: ['Case', 'Time'], rows: [['Average (random/middle pivot)', 'O(n)'], ['Worst (pivot hamesha min/max)', 'O(n²)'], ['Space (iterative)', 'O(1)']] } },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 215 (Quickselect)', blocks: [{ problem: 215 }] },
        {
          title: 'Part 3 — Thinking: Sort → Heap → Quickselect',
          blocks: [
            { p: 'Sort: poora order (zarurat se zyada kaam). Heap: top k ka order maintain (abhi bhi extra). Quickselect: sirf <b>ek index</b> sahi karo.' },
            { olist: [
              '<code>target = n − k</code>, <code>lo = 0, hi = n − 1</code>.',
              'Jab tak lo &lt; hi: pivot = beech wala element, 3-way partition [lo..hi].',
              'target ka block decide karo → range chhota karo ya return.',
              'lo == hi → <code>nums[lo]</code>.',
            ] },
            { tip: 'Production/LeetCode safety: pivot random lo (<code>lo + rand.nextInt(hi − lo + 1)</code>). Humne visualizer ke liye beech wala liya taaki steps deterministic rahein.' },
          ],
        },
        {
          title: 'Part 4 — Dry run: [3,2,1,5,6,4], k = 2 → target = 4',
          blocks: [
            { table: { head: ['Round', 'lo..hi', 'pivot', 'Partition ke baad', 'lt..gt', 'Decision'], rows: [
              ['1', '0..5', 'nums[2] = 1', '[1 | 2,5,6,4,3] (left khaali)', '0..0', 'target 4 > gt 0 → lo = 1'],
              ['2', '1..5', 'nums[3] = 6', '[1 | 2,5,4,3 | 6]', '5..5', 'target 4 < lt 5 → hi = 4'],
              ['3', '1..4', 'nums[2] = 5', '[1 | 2,4,3 | 5 | 6]', '4..4', 'target 4 in [4..4] → return 5'],
            ] } },
            { p: 'Answer <b>5</b> ✓ — 3 rounds, aur har round range chhoti. (Exact swaps visualizer me — har swap ka note.)' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { code: sol(215, 2) },
            { lines: [
              ['int target = nums.length - k;', 'Kth largest = ascending index n − k.'],
              ['int pivot = nums[lo + (hi - lo) / 2];', 'Beech wala pivot (sorted input pe bhi acha). Value copy — swaps se change nahi hogi.'],
              ['int lt = lo, i = lo, gt = hi;', 'Teen regions ke boundaries.'],
              ['if (nums[i] < pivot) swap(nums, lt++, i++);', 'Chhota → left region me, dono aage.'],
              ['else if (nums[i] > pivot) swap(nums, i, gt--);', 'Bada → right end pe; i nahi badhta kyunki gt se aaya element unseen hai.'],
              ['else i++;', 'Barabar → beech me rehne do.'],
              ['if (target < lt) hi = lt - 1;', 'Target chhote wale part me.'],
              ['else if (target > gt) lo = gt + 1;', 'Target bade wale part me.'],
              ['else return pivot;', 'Target == block me → answer pivot.'],
            ] },
            { p: '<b>PUSH — LC 703</b> (re-solve bina dekhe):' },
            { code: sol(703, 2) },
          ],
        },
        {
          title: 'Part 6 — Visualize',
          blocks: [
            { list: ['<b>Quickselect</b> variant: grey = range ke bahar (discard), green = &lt; pivot, new = == pivot.', 'Pointers lt, i, gt, lo, hi, target ek saath dikhte hain.', 'Example 2 (duplicates) bhi chalao — 3-way ka fayda dikhega.'] },
            { viz: 215, ex: 0, variant: 1 },
            { p: 'PUSH: LC 703 Example 1 ek baar aur:' },
            { viz: 703, ex: 0 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Kya hota hai'], rows: [
              ['[1], k=1', 'lo == hi → while skip → nums[0]'],
              ['Sab same (10⁵ × 1)', '3-way: pehle round me poora == block → return. 2-way hota toh O(n²)'],
              ['Sorted input', 'Middle pivot → acha split. First-element pivot hota toh O(n²)'],
              ['Negative numbers', 'Normal compare'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space', 'Input modify?'], rows: [
              ['Sort', 'O(n log n)', 'O(log n)', 'Haan'],
              ['Heap', 'O(n log k)', 'O(k)', 'Nahi'],
              ['Quickselect', 'O(n) avg / O(n²) worst', 'O(1)', 'Haan'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Quickselect quick sort se fast kyun?', 'Sirf ek side recurse/loop karta hai: n + n/2 + … = O(n) avg.'],
              ['Worst case kab?', 'Pivot har baar min/max → n + (n−1) + … = O(n²).'],
              ['Worst case se kaise bachoge?', 'Random pivot; guaranteed O(n) ke liye median-of-medians.'],
              ['3-way partition kyun?', 'Duplicates ek baar me fix; all-equal input O(n²) nahi hota.'],
              ['<code>nums[i] &gt; pivot</code> pe i++ kyun nahi?', 'gt se swap hoke aaya element abhi check nahi hua.'],
              ['Target index kya hai?', 'n − k (ascending).'],
              ['Heap better kab?', 'Stream, input modify nahi kar sakte, ya guaranteed bound chahiye.'],
              ['Recursive vs iterative?', 'Iterative O(1) space; recursive me stack O(log n) avg.'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach explain karo (Quickselect)', 'I want the element that would be at index n − k after sorting. Quickselect partitions the current range around a pivot into less-than, equal and greater-than blocks using a three-way partition. If the target index falls inside the equal block, the pivot is the answer; otherwise I continue only in the side containing the target. Each step discards a large part of the array, so on average the work is n + n/2 + n/4 and so on, which is O(n), with O(1) extra space. The worst case is O(n²), which a random pivot makes extremely unlikely.'],
              ['Follow-up: "Guaranteed O(n)?"', 'Median of medians picks a pivot that is guaranteed to split the array reasonably, giving worst-case O(n), but its constant factors are large, so in practice randomized quickselect or introselect is used.'],
              ['1-minute: Explain quickselect', 'Quickselect uses the quicksort partition step: after partitioning, the pivot sits at its final sorted position. If that is my target, I am done; otherwise I continue only in the side that contains the target. On average this is O(n). The worst case is O(n²), so I choose a random or middle pivot and use three-way partitioning to handle duplicates.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohvi session',
          blocks: [
            { olist: [
              'LC 283 Move Zeroes ko "partition" ki tarah dobara samjho.',
              'Paper pe [3,2,1,5,6,4] ka round 1 partition (pivot 1) karo.',
              'Visualizer Quickselect variant step-by-step dekho — sirf "kis side gaye aur kyun" samjho.',
              'Code memorize zaroori nahi; LC 703 re-solve karo (PUSH).',
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Quickselect memory se, 12 min, random pivot ke saath.',
              '<b>Task B:</b> All-equal 10⁵ array pe 2-way vs 3-way ka difference explain karo.',
              '<b>Task C:</b> "Sort vs heap vs quickselect" 1-minute answer record karo.',
              '<b>Task D:</b> LC 703 bina dekhe, 4 min.',
              '<b>Extra (optional):</b> 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Homework',
          blocks: [{ list: ['LC 215 quickselect submit.', 'Kal Saturday revision: 1046, 703, 215, 230 bina dekhe.', 'Sohel: System Design topic choose kar lo (kal session).'] }],
        },
        {
          title: 'Part 14 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Quickselect avg/worst time?', 'O(n) / O(n²).'],
              ['3-way partition ke 3 regions?', '< pivot, == pivot, > pivot.'],
              ['target < lt toh?', 'hi = lt − 1.'],
              ['Kab return pivot?', 'lt ≤ target ≤ gt.'],
              ['Worst case se bachne ka tarika?', 'Random pivot.'],
            ] },
          ],
        },
      ],
      checks: [
        'Partition (3-way) paper pe kar sakta/sakti hu',
        'Quickselect O(n) avg ka reason bata sakta/sakti hu',
        'LC 215 quickselect Accepted',
        'LC 703 re-solve (PUSH)',
        'Visualizer Quickselect variant dekha',
        'Sort vs heap vs quickselect table yaad',
        '8 interview sawaal + self-test',
      ],
      memory: 'Quickselect: partition (< | == | >), target n−k jis side me sirf wahi; avg O(n).',
    },

    // ======================= DAY 6 (Sat revision) =======================
    6: {
      title: 'Revision — Week 1 (Heap)',
      goal: 'Week 1 ke 3 heap questions + Phase 7 ka LC 230 — <b>bina solution dekhe</b> re-solve, timer ke saath. Sohel: System Design session.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan',
          blocks: [
            { table: { head: ['Question', 'Sohvi timer', 'Sohel timer'], rows: [
              ['LC 1046 Last Stone Weight', '15 min', '6 min (+ own heap 12 min)'],
              ['LC 703 Kth Largest in Stream', '15 min', '5 min'],
              ['LC 215 Kth Largest in Array', '20 min (heap)', '15 min (heap + quickselect)'],
              ['LC 230 Kth Smallest in BST', '15 min', '7 min'],
            ] } },
            { list: ['Rule 1: pehle bolo (pattern + complexity), fir likho.', 'Rule 2: atke toh sirf memory hook dekho, code nahi.', 'Rule 3: har solution ka dry run visualizer se match.'] },
          ],
        },
        {
          title: 'Part 1 — LC 1046 Last Stone Weight',
          blocks: [
            { p: 'Do sabse bhaari takrao, farak wapas. <b>Pattern:</b> max-heap simulation.' },
            { pre: '[2,7,4,1,8,1] → heap [8,7,4,1,2,1]\n8,7 → 1 · 4,2 → 2 · 2,1 → 1 · 1,1 → 0 → [1] → 1' },
            { code: sol(1046, 1) },
            { tip: 'Memory hook: <b>reverseOrder; poll, poll, offer(farak); empty → 0.</b>' },
            { viz: 1046, ex: 2 },
          ],
        },
        {
          title: 'Part 2 — LC 703 Kth Largest Element in a Stream',
          blocks: [
            { p: 'Design class; <b>Pattern:</b> min-heap of size k.' },
            { pre: 'k=3, [4,5,8,2] → heap [4,5,8]; add 3 → 4; add 5 → 5; add 10 → 5; add 9 → 8; add 4 → 8' },
            { code: sol(703, 2) },
            { tip: 'Memory hook: <b>Kth LARGEST → MIN-heap size k.</b>' },
          ],
        },
        {
          title: 'Part 3 — LC 215 Kth Largest Element in an Array',
          blocks: [
            { p: '<b>Pattern:</b> min-heap size k (O(n log k)) ya quickselect (O(n) avg).' },
            { pre: '[3,2,3,1,2,4,5,5,6], k=4 → heap [4,5,5,6] → 4' },
            { code: sol(215, 1) },
            { p: 'Quickselect core:' },
            { code: `while (i <= gt) {
    if (nums[i] < pivot) swap(nums, lt++, i++);
    else if (nums[i] > pivot) swap(nums, i, gt--);
    else i++;
}
if (target < lt) hi = lt - 1;
else if (target > gt) lo = gt + 1;
else return pivot;` },
            { tip: 'Memory hook: <b>target = n − k; ek hi side me jao.</b>' },
          ],
        },
        {
          title: 'Part 4 — LC 230 Kth Smallest Element in a BST (Phase 7)',
          blocks: [
            { p: '<b>Pattern:</b> inorder (sorted) + counter. Heap se compare karo: BST already ordered hai, isliye heap ki zaroorat nahi.' },
            { pre: '[5,3,6,2,4,null,null,1], k=3 → inorder 1,2,3,4,5,6 → 3' },
            { code: `public int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> st = new ArrayDeque<>();
    TreeNode cur = root;
    while (cur != null || !st.isEmpty()) {
        while (cur != null) { st.push(cur); cur = cur.left; }
        cur = st.pop();
        if (--k == 0) return cur.val;
        cur = cur.right;
    }
    return -1;
}` },
            { tip: 'Memory hook: <b>BST inorder = sorted; heap = sirf top sorted.</b> (Heap se bhi kar sakte: max-heap size k, O(n log k) — par inorder O(h + k) better.)' },
          ],
        },
        {
          title: 'Part 5 — Interview mix',
          blocks: [
            { qa: [
              ['Kth largest → kaunsa heap? Kth smallest?', 'Min-heap size k; max-heap size k.'],
              ['PriorityQueue ka default order?', 'Min-heap.'],
              ['Heap sift down me kaunse child se swap?', 'Better (max-heap me bada) child.'],
              ['Heapify complexity?', 'O(n).'],
              ['Quickselect worst case + fix?', 'O(n²); random pivot.'],
              ['230 me heap kyun nahi?', 'BST inorder already sorted deta hai — O(h + k).'],
            ] },
          ],
        },
        {
          title: 'Part 6 — 1-minute answers: aise bolo',
          blocks: [
            { say: [
              ['Heap vs BST', 'A heap only guarantees the root is the min or max, which is ideal for repeatedly taking the best element: O(1) peek and O(log n) insert and remove-top in a compact array. A balanced BST like TreeMap keeps full sorted order, so it supports searching, predecessor and successor queries, and arbitrary deletes in O(log n), at more memory cost. Top only means heap; ordered queries mean TreeMap.'],
              ['Kth largest — all options', 'Sorting gives O(n log n). A size-k min-heap gives O(n log k) and works on streams. Quickselect gives average O(n) with O(1) space but modifies the input and has an O(n²) worst case.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [{ olist: ['1046 aur 703 bina dekhe submit.', '215 heap version.', 'Paper pe ek max-heap me 3 push + 1 pop karo.', '230 inorder dry run.'] }],
        },
        {
          title: 'Part 8 — Sohel session (+ System Design)',
          blocks: [
            { olist: [
              'Saare 4 timer ke andar; 215 dono approaches.',
              '1046 own heap bina dekhe.',
              '<b>System Design session (1/week):</b> "Design a Top-K trending hashtags service" — stream counts (Count-Min Sketch / HashMap), har window me size-k min-heap, sharding + merge of per-shard top-k. 45 min, diagram banao.',
              'SQL optional (track Week 12 tak tha).',
            ] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [{ list: ['Jo question timer me nahi hua, kal subah dobara.', 'Kal mock: Tum → Sohvi LC 703, Sohvi → Tum LC 215.', 'LeetCode Weekly Contest — Sunday 8:00 AM IST.'] }],
        },
        {
          title: 'Part 10 — Final self-test',
          blocks: [
            { qa: [
              ['[9,5,8] max-heap me push(10)?', '[10, 9, 8, 5]'],
              ['k=2, nums=[1], add(0) ka answer?', '0'],
              ['[3,2,1,5,6,4], k=2?', '5'],
              ['Quickselect target index?', 'n − k'],
              ['Own heap pop ke 2 steps?', 'h[0] = h[--size]; bade child se sift down.'],
            ] },
          ],
        },
      ],
      checks: ['4 me se kam se kam 3 timer ke andar', 'Har ek ka dry run match', 'Interview mix 6/6', '1-minute answers bole', 'Sohel: System Design session done', 'Galtiyon ki list banayi'],
      memory: 'Week 1: max-heap simulation, min-heap size k, sift up/down, quickselect.',
    },

    // ======================= DAY 7 (Sun mock) =======================
    7: {
      title: 'Mock Interview + Contest',
      goal: 'Real interview jaisa: <b>Tum → Sohvi: LC 703</b>, <b>Sohvi → Tum: LC 215</b>. Fir LeetCode Weekly Contest discussion.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Mock format',
          blocks: [
            { table: { head: ['Slot', 'Kya', 'Time'], rows: [
              ['1', 'Tum interview lo, Sohvi solve kare (LC 703)', '30 min'],
              ['2', 'Sohvi interview le, Tum solve karo (LC 215)', '30 min'],
              ['3', 'Weekly Contest discussion', '30 min'],
            ] } },
            { list: ['Camera on, notes band.', 'Interviewer sirf hints ladder se help kare.', 'End me rubric pe score + 2 feedback points.'] },
          ],
        },
        {
          title: 'Part 1 — Mock Q1 (Tum → Sohvi): LC 703',
          blocks: [
            { problem: 703 },
            { p: '<b>Kya poochna hai:</b> "Saare numbers rakhne zaroori hain?" · "add() ki complexity?" · "k bada ho toh?" · "nums khaali ho toh?"' },
            { olist: [
              'Hint 1: Kya poora order chahiye ya sirf top k?',
              'Hint 2: Top k me se kaunsa number answer hai?',
              'Hint 3: "Sabse chhota" jaldi chahiye aur hatana bhi hai → kaunsa heap?',
              'Hint 4: size > k → poll.',
            ] },
            { table: { head: ['Area', 'Kya dekhna', 'Score /5'], rows: [
              ['Clarify', 'k, duplicates, empty nums puchha?', ''],
              ['Brute', 'Sort har add — complexity boli?', ''],
              ['Optimal', 'Min-heap size k idea', ''],
              ['Code', 'Fields, constructor, add sahi', ''],
              ['Test', 'Example 1 dry run', ''],
              ['Communication', 'Bolte hue likha?', ''],
            ] } },
            { viz: 703, ex: 1 },
          ],
        },
        {
          title: 'Part 2 — Mock Q2 (Sohvi → Tum): LC 215',
          blocks: [
            { problem: 215 },
            { p: '<b>Sohvi ye puche:</b> "Sort ke bina?" · "O(n) possible?" · "Duplicates?" · "Worst case quickselect?" · "Input modify kar sakte ho?"' },
            { olist: ['Hint 1: Sirf top k chahiye.', 'Hint 2: Min-heap size k.', 'Hint 3: Quick sort ka partition — ek side chhod do.', 'Hint 4: 3-way partition for duplicates.'] },
            { table: { head: ['Area', 'Kya dekhna', 'Score /5'], rows: [
              ['Clarify', 'k range, duplicates, modify allowed?', ''],
              ['Brute', 'Sort n − k', ''],
              ['Optimal', 'Heap + quickselect dono, trade-off', ''],
              ['Code', 'Quickselect bug-free (i++ wala trap)', ''],
              ['Test', 'All-equal, k = 1, k = n', ''],
              ['Communication', 'Complexity clearly', ''],
            ] } },
          ],
        },
        {
          title: 'Part 3 — Interview communication checklist',
          blocks: [{ list: ['Problem apne shabdon me repeat kiya.', 'Example + edge case khud banaya.', 'Brute + complexity pehle.', 'Optimal ka "kyun" bataya (not just "heap use karunga").', 'Code ke baad dry run.', 'Trade-offs (stream, memory, modify input).'] }],
        },
        {
          title: 'Part 4 — LeetCode Weekly Contest (Sunday 8:00 AM IST)',
          blocks: [
            { list: ['Sohvi goal: Q1 solve (exposure). Sohel goal: Q1–Q2 fast, Q3 attempt.', 'Contest ke baad: har question ka pattern pehchano — heap/top-k dikha?'] },
            { table: { head: ['Q', 'Pattern', 'Mera time', 'Galti', 'Seekh'], rows: [['Q1', '', '', '', ''], ['Q2', '', '', '', ''], ['Q3', '', '', '', '']] } },
          ],
        },
        {
          title: 'Part 5 — Interview Q&A',
          blocks: [
            { qa: [
              ['Design question me pehla kadam?', 'Operations + frequency + constraints clarify.'],
              ['703 me state kya hai?', 'k aur size-k min-heap.'],
              ['215 ke 3 approaches?', 'Sort, heap, quickselect.'],
              ['Quickselect me input modify hota hai?', 'Haan — copy chahiye toh O(n) space.'],
              ['Heap toString sorted?', 'Nahi.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Aise bolo',
          blocks: [
            { say: [
              ['Design question approach', 'I first clarify the operations, their frequency and constraints, because that decides which operation must be fast. Then I choose the minimal state the class needs — for kth largest, only the top k elements in a min-heap. I state the complexity of each method, write clean private fields and methods, and walk through the sample sequence. Finally I discuss edge cases and follow-ups like concurrency.'],
              ['Mock feedback dena', 'You clarified the constraints well and reached the heap idea quickly. Next time, state the brute force complexity before optimizing and dry-run one example after coding.'],
            ] },
          ],
        },
        { title: 'Part 7 — Sohvi session', blocks: [{ list: ['Rubric ke 2 weak areas note karo.', 'LC 703 dobara agar mock me atki.'] }] },
        { title: 'Part 8 — Sohel session', blocks: [{ list: ['Quickselect ko 10 min me bug-free.', 'Contest Q2/Q3 upsolve.', 'SQL optional.'] }] },
        { title: 'Part 9 — Homework', blocks: [{ list: ['Week 2 preview: LC 347 Top K Frequent padh lo.', 'Phase 1 frequency map pattern revise.'] }] },
        {
          title: 'Part 10 — Self-test',
          blocks: [
            { qa: [
              ['703 add() complexity?', 'O(log k)'],
              ['215 heap complexity?', 'O(n log k)'],
              ['Quickselect avg?', 'O(n)'],
              ['Max-heap Java?', 'new PriorityQueue<>(Collections.reverseOrder())'],
              ['Contest kab?', 'Sunday 8:00 AM IST'],
            ] },
          ],
        },
      ],
      checks: ['Mock 1 complete + rubric', 'Mock 2 complete + rubric', 'Contest diya', 'Contest discussion table bhari', 'Feedback points likhe'],
      memory: 'Mock: Clarify → Brute → Optimal → Code → Test → Trade-offs.',
    },
  });
})();
