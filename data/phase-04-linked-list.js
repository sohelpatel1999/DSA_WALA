window.PHASE_CONTENT = window.PHASE_CONTENT || {};

window.PHASE_CONTENT['linked-list'] = {
  intro: 'Linked List = nodes ki chain, jahan har node agle node ka address (next) rakhta hai. Yahan index nahi, sirf pointers hain — isliye har problem "pointer ko sahi order me badlo" ka khel hai: reverse, middle, cycle, merge.',

  // ---------------- FUNDAMENTALS ----------------
  fundamentals: [
    {
      h: 'Linked List kya hai?',
      body: `<p>Linked List ek <b>dynamic</b> data structure hai jisme har element ek <b>node</b> hota hai. Node ke paas do cheezein hoti hain: <b>val</b> (data) aur <b>next</b> (agle node ka reference / address).</p>
<p>Array ki tarah elements <b>continuous memory me nahi</b> hote — nodes heap me kahin bhi pade ho sakte hain, bas <code>next</code> unhe jodta hai. Isliye <code>list[i]</code> jaisa O(1) access nahi hota; i-th node tak pahunchne ke liye head se <b>chalna</b> padta hai → O(n).</p>
<pre>
  head
   |
   v
 +-----+------+     +-----+------+     +-----+------+
 | val | next | --> | val | next | --> | val | next | --> null
 |  1  |  o---+     |  2  |  o---+     |  3  |  /   |
 +-----+------+     +-----+------+     +-----+------+
  addr 0x10          addr 0x88          addr 0x40   (memory me kahin bhi)
</pre>
<p><b>head</b> = pehle node ka reference. Head kho diya toh poori list kho gayi. Last node ka <code>next = null</code>.</p>`,
    },
    {
      h: 'LeetCode ka ListNode (Java)',
      body: `<p>LeetCode ye class khud deta hai — tumhe sirf method likhna hai. Lekin structure yaad hona chahiye:</p>`,
      code: `public class ListNode {
    int val;          // data
    ListNode next;    // agle node ka reference (null = list khatam)
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

// 1 -> 2 -> 3 banana
ListNode head = new ListNode(1, new ListNode(2, new ListNode(3)));

// Traverse
for (ListNode cur = head; cur != null; cur = cur.next) {
    System.out.print(cur.val + " ");
}`,
    },
    {
      h: 'Array vs Linked List',
      body: `<table class="tbl"><thead><tr><th></th><th>Array</th><th>Linked List</th></tr></thead><tbody>
<tr><td>Memory</td><td>Continuous</td><td>Scattered (next se jude)</td></tr>
<tr><td>Access i-th</td><td>O(1)</td><td>O(n) — chalna padta hai</td></tr>
<tr><td>Insert/Delete (node pata ho)</td><td>O(n) shifting</td><td>O(1) — sirf pointer badlo</td></tr>
<tr><td>Size</td><td>Fixed (int[])</td><td>Dynamic</td></tr>
<tr><td>Extra memory</td><td>Nahi</td><td>Har node pe ek <code>next</code> reference</td></tr>
<tr><td>Cache</td><td>Friendly (line me)</td><td>Kam friendly (jump karta hai)</td></tr>
</tbody></table>
<p class="tip">Java ka <code>LinkedList&lt;E&gt;</code> doubly linked list hai (Deque bhi implement karta hai). Interview me LeetCode ka <code>ListNode</code> (singly) use hota hai.</p>`,
    },
    {
      h: 'Pointer rules — yaad rakhne wali baatein',
      body: `<ul>
<li><b>Pehle save, phir todo:</b> <code>current.next</code> badalne se pehle <code>ListNode next = current.next</code> save karo, warna baaki list kho jaayegi.</li>
<li><b>Null check pehle:</b> <code>fast.next.next</code> likhne se pehle <code>fast != null &amp;&amp; fast.next != null</code> — warna <code>NullPointerException</code>.</li>
<li><b>Dummy node:</b> <code>ListNode dummy = new ListNode(0, head)</code> — jab head khud delete/badal sakta hai (LC 19, LC 21, LC 25). Answer = <code>dummy.next</code>.</li>
<li><b>Slow / Fast:</b> slow 1 step, fast 2 step → middle (LC 876), cycle (LC 141, LC 142).</li>
<li><b>Node compare</b> = reference compare (<code>slow == fast</code>), value compare nahi — do nodes ki val same ho sakti hai.</li>
<li>Recursion me har call ek <b>stack frame</b> leta hai → n nodes = O(n) space. 10⁴–10⁵ nodes pe <code>StackOverflowError</code> ka risk.</li>
</ul>
<pre>
Dummy node:                     Slow / Fast:
dummy -> 1 -> 2 -> 3 -> null    1 -> 2 -> 3 -> 4 -> 5 -> null
  ^                                       s         f      (fast 2x speed)
 tail (yahan se jodte jao)      fast end pe → slow middle pe
</pre>`,
    },
    {
      h: 'Java Cheat Sheet (Linked List)',
      code: `// Length
int len = 0;
for (ListNode c = head; c != null; c = c.next) len++;

// Dummy + tail (nayi list jodna)
ListNode dummy = new ListNode(0), tail = dummy;
tail.next = node; tail = tail.next;
return dummy.next;

// Delete next node of prev
prev.next = prev.next.next;

// Insert x after node
node.next = new ListNode(x, node.next);

// Reverse (4 steps)
ListNode prev = null, cur = head;
while (cur != null) { ListNode nx = cur.next; cur.next = prev; prev = cur; cur = nx; }

// Slow / Fast
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }

// Node identity set (cycle)
Set<ListNode> seen = new HashSet<>();   // reference ke basis pe`,
    },
  ],

  // ---------------- OPERATIONS ----------------
  operations: [
    { op: 'Traverse / print', time: 'O(n)', note: 'Head se null tak chalo', code: 'for (ListNode c = head; c != null; c = c.next) {\n    System.out.print(c.val + " ");\n}' },
    { op: 'Length', time: 'O(n)', note: 'Ek pass, count++', code: 'int len = 0;\nfor (ListNode c = head; c != null; c = c.next) len++;' },
    { op: 'Insert at head', time: 'O(1)', note: 'Naya node purane head ko point kare', code: 'head = new ListNode(x, head);' },
    { op: 'Insert after node', time: 'O(1)', note: 'Pehle naye node ka next set, phir jodo', code: 'node.next = new ListNode(x, node.next);' },
    { op: 'Insert at tail', time: 'O(n) / O(1) with tail ptr', note: 'Tail pointer rakho toh O(1)', code: 'tail.next = new ListNode(x);\ntail = tail.next;' },
    { op: 'Delete next node', time: 'O(1)', note: 'Prev node chahiye — isliye dummy', code: 'prev.next = prev.next.next;' },
    { op: 'Search value', time: 'O(n)', note: 'Linear', code: 'for (ListNode c = head; c != null; c = c.next)\n    if (c.val == target) return c;\nreturn null;' },
    { op: 'Reverse', time: 'O(n)', note: 'prev / current / next (LC 206)', code: 'ListNode prev = null, cur = head;\nwhile (cur != null) {\n    ListNode nx = cur.next;\n    cur.next = prev;\n    prev = cur;\n    cur = nx;\n}\nreturn prev;' },
    { op: 'Middle', time: 'O(n)', note: 'Slow / fast (LC 876)', code: 'ListNode slow = head, fast = head;\nwhile (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n}\nreturn slow;' },
    { op: 'k-th node (0-based)', time: 'O(k)', note: 'Index access nahi — chalna padega', code: 'ListNode c = head;\nfor (int i = 0; i < k && c != null; i++) c = c.next;' },
  ],

  // ---------------- PATTERNS ----------------
  patterns: [
    {
      name: 'Pointer Reversal (prev / current / next)',
      signal: '"Reverse the list", "reverse a part", "reverse in groups", "palindrome-jaisa second half compare"',
      idea: '4 steps ka fixed order: next save → current.next = prev → prev = current → current = next. Loop ke baad prev = naya head.',
      code: `ListNode prev = null, current = head;
while (current != null) {
    ListNode next = current.next;
    current.next = prev;
    prev = current;
    current = next;
}
return prev;`,
      qs: [206, 143, 25],
    },
    {
      name: 'Slow / Fast Pointers (Tortoise & Hare)',
      signal: '"Middle node", "cycle hai?", "cycle kahan shuru", "list ko do halves me todo"',
      idea: 'Slow 1 step, fast 2 step. Fast end pe → slow middle pe. Cycle ho toh fast slow ko andar pakad leta hai.',
      code: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) { /* cycle */ }
}`,
      qs: [876, 141, 142, 143],
    },
    {
      name: 'Dummy Node',
      signal: '"Head badal sakta hai", "nayi list banao/jodo", "head ko delete karna pad sakta hai"',
      idea: 'Head se pehle ek nakli node. Ab head ke liye special case nahi; answer dummy.next.',
      code: `ListNode dummy = new ListNode(0, head);
ListNode tail = dummy;
// ... tail.next = something; tail = tail.next;
return dummy.next;`,
      qs: [21, 19, 25],
    },
    {
      name: 'Gap Two Pointers (n steps aage)',
      signal: '"n-th node from end", ek pass me',
      idea: 'fast ko n+1 step aage bhejo (dummy se), phir dono saath chalao. fast null → slow target ke just pehle.',
      code: `ListNode fast = dummy, slow = dummy;
for (int i = 0; i <= n; i++) fast = fast.next;
while (fast != null) { fast = fast.next; slow = slow.next; }
slow.next = slow.next.next;`,
      qs: [19],
    },
    {
      name: 'Merge (two sorted chains)',
      signal: '"Merge two sorted lists", "do lists ko alternate jodo"',
      idea: 'Dummy + tail. Chhota node tail ke peeche jodo, us list ko aage badhao. End me bachi hui list seedha jod do.',
      code: `while (a != null && b != null) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
}
tail.next = (a != null) ? a : b;`,
      qs: [21, 143],
    },
  ],

  // ---------------- QUESTIONS ----------------
  questions: {
    206: {
      oneLine: 'prev = null, current = head; loop: next save → current.next = prev → prev = current → current = next; return prev.',
      pattern: 'Pointer Reversal',
      approaches: [
        {
          level: 'Brute', idea: 'Saari values ArrayList me daalo, phir list pe dobara chal ke values ulte order me likh do. Kaam karta hai, lekin node data badla (links nahi) aur O(n) extra space.',
          time: 'O(n)', space: 'O(n)',
          code: `public ListNode reverseList(ListNode head) {
    List<Integer> vals = new ArrayList<>();
    for (ListNode node = head; node != null; node = node.next) {
        vals.add(node.val);
    }
    ListNode cur = head;
    for (int i = vals.size() - 1; i >= 0; i--) {
        cur.val = vals.get(i);
        cur = cur.next;
    }
    return head;
}`,
        },
        {
          level: 'Optimal', idea: 'Iterative: har node ka next ulta karo (pichle node ki taraf). Teen pointers: prev (ulti list ka head), current (abhi wala), next (bachi list — kho na jaaye).',
          time: 'O(n)', space: 'O(1)',
          code: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    while (current != null) {
        ListNode next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    return prev;
}`,
        },
        {
          level: 'Recursive', idea: 'Pehle end tak jao (head.next ki list reverse karwao), lautte waqt link ulta karo: head.next.next = head; head.next = null. Base case: null ya single node.',
          time: 'O(n)', space: 'O(n) call stack',
          code: `public ListNode reverseList(ListNode head) {
    if (head == null || head.next == null) {
        return head;
    }
    ListNode newHead = reverseList(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
}`,
        },
      ],
      dryRun: '1→2→3→4: (prev=null,cur=1) → 1→null, prev=1 → 2→1, prev=2 → 3→2, prev=3 → 4→3, prev=4, cur=null → return 4 (4→3→2→1→null)',
      interview: 'I reverse the links in place with three pointers. prev starts at null because the old head becomes the new tail. For each node I first save next, then point current.next to prev, then move prev and current forward. When current becomes null, prev is the new head. O(n) time, O(1) space. The recursive version reverses the rest first and fixes links while unwinding, but uses O(n) stack.',
      problem: {
        statement: 'Singly linked list ka <b>head</b> diya hai. List ko <b>reverse</b> karo (links ulte karo) aur naye head ko return karo.',
        examples: [
          { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explain: 'Har node ka next ab pichle node ko point karta hai; purana tail (5) naya head hai.', viz: { head: '1, 2, 3, 4, 5' } },
          { input: 'head = [1,2]', output: '[2,1]', explain: '1→2 ban gaya 2→1.', viz: { head: '1, 2' } },
          { input: 'head = []', output: '[]', explain: 'Khaali list — reverse bhi khaali (null return).', viz: { head: '' } },
        ],
        constraints: ['Nodes ki sankhya: 0 ≤ n ≤ 5000', '−5000 ≤ Node.val ≤ 5000', 'Follow-up: iterative aur recursive dono tarike se karo'],
      },
    },

    876: {
      oneLine: 'slow 1 step, fast 2 step; fast null ya fast.next null → slow = middle (even me second middle).',
      pattern: 'Slow / Fast Pointers',
      approaches: [
        {
          level: 'Brute', idea: 'Do pass: pehle nodes gino (count), phir head se count/2 step chalo. Even length me count/2 seedha second middle deta hai.',
          time: 'O(n)', space: 'O(1)',
          code: `public ListNode middleNode(ListNode head) {
    int count = 0;
    for (ListNode cur = head; cur != null; cur = cur.next) {
        count++;
    }
    ListNode mid = head;
    for (int i = 0; i < count / 2; i++) {
        mid = mid.next;
    }
    return mid;
}`,
        },
        {
          level: 'Optimal', idea: 'Ek pass: fast double speed se chalta hai. Jab fast end pe pahunchta hai, slow ne aadha raasta tay kiya hota hai.',
          time: 'O(n)', space: 'O(1)',
          code: `public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
        },
      ],
      dryRun: '1→2→3→4→5: (s=1,f=1) → (2,3) → (3,5); f.next=null → return 3. 1..6: (1,1)→(2,3)→(3,5)→(4,null) → return 4',
      interview: 'I use slow and fast pointers starting at head. Slow moves one step and fast moves two. When fast reaches the end, slow has covered half the distance, so it is at the middle. The loop condition fast != null && fast.next != null handles both odd and even lengths, and for even length it returns the second middle as required. One pass, O(n) time, O(1) space.',
      problem: {
        statement: 'Singly linked list ka <b>head</b> diya hai. List ka <b>middle node</b> return karo. Agar do middle hain (even length), toh <b>doosra middle</b> return karo.',
        examples: [
          { input: 'head = [1,2,3,4,5]', output: '[3,4,5]', explain: 'Middle node 3 hai (return node ke baad ki list dikhti hai: 3→4→5).', viz: { head: '1, 2, 3, 4, 5' } },
          { input: 'head = [1,2,3,4,5,6]', output: '[4,5,6]', explain: 'Do middle hain — 3 aur 4. Doosra (4) return karna hai.', viz: { head: '1, 2, 3, 4, 5, 6' } },
        ],
        constraints: ['Nodes: 1 ≤ n ≤ 100', '1 ≤ Node.val ≤ 100'],
      },
    },

    21: {
      oneLine: 'Dummy + tail: chhota node jodo, us list ko aage badhao; end me bachi list seedha tail.next pe.',
      pattern: 'Dummy Node + Merge',
      approaches: [
        {
          level: 'Brute', idea: 'Dono lists ki saari values ek ArrayList me, sort karo, phir naye nodes se list banao. Sorted hone ka fayda nahi uthaya.',
          time: 'O((m+n) log(m+n))', space: 'O(m+n)',
          code: `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    List<Integer> vals = new ArrayList<>();
    for (ListNode c = list1; c != null; c = c.next) vals.add(c.val);
    for (ListNode c = list2; c != null; c = c.next) vals.add(c.val);
    Collections.sort(vals);
    ListNode dummy = new ListNode(0), tail = dummy;
    for (int v : vals) {
        tail.next = new ListNode(v);
        tail = tail.next;
    }
    return dummy.next;
}`,
        },
        {
          level: 'Optimal', idea: 'Iterative merge (merge sort ka merge step). Dummy node se head ka special case khatam. Existing nodes hi jode — naye node nahi banaye.',
          time: 'O(m+n)', space: 'O(1)',
          code: `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    while (list1 != null && list2 != null) {
        if (list1.val <= list2.val) {
            tail.next = list1;
            list1 = list1.next;
        } else {
            tail.next = list2;
            list2 = list2.next;
        }
        tail = tail.next;
    }
    tail.next = (list1 != null) ? list1 : list2;
    return dummy.next;
}`,
        },
        {
          level: 'Recursive', idea: 'Jo head chhota hai woh answer ka head; uska next = baaki dono ka merge (recursion). Base: koi list null → doosri return.',
          time: 'O(m+n)', space: 'O(m+n) call stack',
          code: `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    if (list1 == null) return list2;
    if (list2 == null) return list1;
    if (list1.val <= list2.val) {
        list1.next = mergeTwoLists(list1.next, list2);
        return list1;
    } else {
        list2.next = mergeTwoLists(list1, list2.next);
        return list2;
    }
}`,
        },
      ],
      dryRun: '[1,2,4] + [1,3,4]: 1(l1) → 1(l2) → 2 → 3 → 4(l1) → l1 null → tail.next = [4] → 1,1,2,3,4,4',
      interview: 'Both lists are sorted, so I do the merge step of merge sort. A dummy node gives me a fixed starting point and removes the special case for the head. I keep a tail pointer, always attach the smaller of the two current nodes, and advance that list. When one list runs out, I attach the remainder of the other directly. O(m + n) time and O(1) extra space since I reuse the existing nodes.',
      problem: {
        statement: 'Do <b>sorted</b> linked lists <b>list1</b> aur <b>list2</b> ke heads diye hain. Dono ko jod ke ek <b>sorted list</b> banao — existing nodes ko hi aapas me jodna hai (splice). Merged list ka head return karo.',
        examples: [
          { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]', explain: 'Har step pe dono me se chhota node jodte gaye.', viz: { list1: '1, 2, 4', list2: '1, 3, 4' } },
          { input: 'list1 = [], list2 = []', output: '[]', explain: 'Dono khaali → null.', viz: { list1: '', list2: '' } },
          { input: 'list1 = [], list2 = [0]', output: '[0]', explain: 'Ek khaali hai → doosri list hi answer.', viz: { list1: '', list2: '0' } },
        ],
        constraints: ['Har list me nodes: 0 ≤ n ≤ 50', '−100 ≤ Node.val ≤ 100', 'Dono lists non-decreasing order me sorted hain'],
      },
    },

    141: {
      oneLine: "Floyd: slow 1, fast 2 step; kabhi slow == fast → cycle; fast null tak pahuncha → no cycle.",
      pattern: 'Slow / Fast Pointers (Floyd)',
      approaches: [
        {
          level: 'Brute', idea: 'HashSet me visited nodes (reference) daalo. Koi node dobara mila → cycle. null tak pahunche → no cycle.',
          time: 'O(n)', space: 'O(n)',
          code: `public boolean hasCycle(ListNode head) {
    Set<ListNode> seen = new HashSet<>();
    ListNode cur = head;
    while (cur != null) {
        if (!seen.add(cur)) return true;
        cur = cur.next;
    }
    return false;
}`,
        },
        {
          level: 'Optimal', idea: "Floyd's tortoise & hare: cycle me fast har step pe slow se 1 node ka gap kam karta hai, isliye pakad hi leta hai. Cycle nahi toh fast null tak pahunchega.",
          time: 'O(n)', space: 'O(1)',
          code: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
        },
      ],
      dryRun: '[3,2,0,-4], pos=1 (−4→2): (s=3,f=3) → (2,0) → (0,2) → (−4,−4) slow == fast → true',
      interview: "A HashSet of visited nodes solves it in O(n) time and space. For O(1) space I use Floyd's algorithm: slow moves one step, fast moves two. If there is no cycle, fast reaches null. If there is a cycle, once both are inside it the gap between them shrinks by one every step, so fast must land on slow. I compare node references, not values. O(n) time, O(1) space.",
      problem: {
        statement: 'Linked list ka <b>head</b> diya hai. Batao list me <b>cycle</b> hai ya nahi — yaani koi node aisa hai jahan se next pointers follow karte-karte wapas usi node pe aa jaao. (<code>pos</code> sirf test banane ke liye hai: tail ka next index <code>pos</code> wale node ko point karta hai; <code>pos = −1</code> matlab cycle nahi. Function ko pos nahi milta.)',
        examples: [
          { input: 'head = [3,2,0,-4], pos = 1', output: 'true', explain: 'Tail (−4) wapas index 1 (node 2) se juda hai.', viz: { head: '3, 2, 0, -4', pos: '1' } },
          { input: 'head = [1,2], pos = 0', output: 'true', explain: 'Tail (2) wapas head (1) se juda hai.', viz: { head: '1, 2', pos: '0' } },
          { input: 'head = [1], pos = -1', output: 'false', explain: 'Cycle nahi hai.', viz: { head: '1', pos: '-1' } },
        ],
        constraints: ['Nodes: 0 ≤ n ≤ 10⁴', '−10⁵ ≤ Node.val ≤ 10⁵', 'pos = −1 ya valid index', 'Follow-up: O(1) memory me karo'],
      },
    },

    142: {
      oneLine: 'Floyd meet ke baad ek pointer head pe, dono 1-1 step; jahan mile wahi cycle ka start.',
      pattern: 'Slow / Fast Pointers (Floyd Phase 2)',
      approaches: [
        {
          level: 'Brute', idea: 'HashSet me nodes daalte jao; jo pehla node dobara mile wahi cycle ka entry point hai.',
          time: 'O(n)', space: 'O(n)',
          code: `public ListNode detectCycle(ListNode head) {
    Set<ListNode> seen = new HashSet<>();
    ListNode cur = head;
    while (cur != null) {
        if (!seen.add(cur)) return cur;
        cur = cur.next;
    }
    return null;
}`,
        },
        {
          level: 'Optimal', idea: 'Phase 1: slow/fast meet. Math: head se entry ki doori a, entry se meet ki doori b, cycle length c → a = k·c − b. Isliye slow ko head pe reset karo, fast meeting point pe hi rahe — dono 1-1 step chalo, cycle start pe milenge.',
          time: 'O(n)', space: 'O(1)',
          code: `public ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) break;
    }
    if (fast == null || fast.next == null) return null;
    slow = head;
    while (slow != fast) {
        slow = slow.next;
        fast = fast.next;
    }
    return slow;
}`,
        },
      ],
      dryRun: '[3,2,0,-4], pos=1: meet at −4. slow=head(3), fast=−4 → slow=2, fast=2 → equal → return node 2 (index 1)',
      interview: 'First I detect the cycle with Floyd: slow and fast meet somewhere inside it. Let a be the distance from head to the cycle entry, b from entry to the meeting point, and c the cycle length. Fast travels twice as far as slow, which gives a = k·c − b. So if I reset slow to head and keep fast at the meeting point, moving both one step at a time, they meet exactly at the entry. O(n) time, O(1) space.',
      problem: {
        statement: 'Linked list ka <b>head</b> diya hai. Agar cycle hai toh woh <b>node return karo jahan se cycle shuru hoti hai</b>, warna <code>null</code>. List ko modify nahi karna. (<code>pos</code> sirf test ke liye: tail ka next index pos wale node pe; −1 = no cycle.)',
        examples: [
          { input: 'head = [3,2,0,-4], pos = 1', output: 'tail connects to node index 1', explain: 'Cycle node 2 (index 1) se shuru hoti hai — wahi node return.', viz: { head: '3, 2, 0, -4', pos: '1' }, ret: 'ListNode(val=2)' },
          { input: 'head = [1,2], pos = 0', output: 'tail connects to node index 0', explain: 'Cycle head (1) se shuru.', viz: { head: '1, 2', pos: '0' }, ret: 'ListNode(val=1)' },
          { input: 'head = [1], pos = -1', output: 'no cycle', explain: 'Cycle nahi → null.', viz: { head: '1', pos: '-1' }, ret: 'null' },
        ],
        constraints: ['Nodes: 0 ≤ n ≤ 10⁴', '−10⁵ ≤ Node.val ≤ 10⁵', 'pos = −1 ya valid index', 'Follow-up: O(1) memory me karo'],
      },
    },

    19: {
      oneLine: 'Dummy se fast ko n+1 step aage; dono saath chalo jab tak fast null; slow.next = slow.next.next.',
      pattern: 'Dummy Node + Gap Two Pointers',
      approaches: [
        {
          level: 'Brute', idea: 'Two pass: pehle length L nikalo. End se n-th = start se (L − n)-th (0-based). Dummy se L − n step chalo → target ke pehle wala node; use skip karo.',
          time: 'O(L)', space: 'O(1)',
          code: `public ListNode removeNthFromEnd(ListNode head, int n) {
    int len = 0;
    for (ListNode cur = head; cur != null; cur = cur.next) len++;
    ListNode dummy = new ListNode(0, head);
    ListNode prev = dummy;
    for (int i = 0; i < len - n; i++) {
        prev = prev.next;
    }
    prev.next = prev.next.next;
    return dummy.next;
}`,
        },
        {
          level: 'Optimal', idea: 'One pass: fast aur slow ke beech n+1 ka gap rakho. Jab fast null pe pahunche, slow target ke theek pehle hoga. Dummy head delete wale case ko sambhalta hai.',
          time: 'O(L)', space: 'O(1)',
          code: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    ListNode fast = dummy, slow = dummy;
    for (int i = 0; i <= n; i++) {
        fast = fast.next;
    }
    while (fast != null) {
        fast = fast.next;
        slow = slow.next;
    }
    slow.next = slow.next.next;
    return dummy.next;
}`,
        },
      ],
      dryRun: '[1,2,3,4,5], n=2: fast dummy se 3 step → node 3. Saath chalo: (f=4,s=1) (5,2) (null,3). slow=3 → 3.next = 5 → [1,2,3,5]',
      interview: 'I add a dummy node before head so deleting the head needs no special case. I move fast n + 1 steps ahead of slow, then move both together until fast is null. Because the gap is n + 1, slow stops right before the node to delete, and I unlink it with slow.next = slow.next.next. One pass, O(L) time, O(1) space.',
      problem: {
        statement: 'Linked list ka <b>head</b> aur integer <b>n</b> diya hai. List ke <b>end se n-th node</b> ko hata do aur head return karo.',
        examples: [
          { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]', explain: 'End se 2nd node = 4. Use hata diya.', viz: { head: '1, 2, 3, 4, 5', n: '2' } },
          { input: 'head = [1], n = 1', output: '[]', explain: 'Akela node hi hat gaya → khaali list.', viz: { head: '1', n: '1' } },
          { input: 'head = [1,2], n = 1', output: '[1]', explain: 'End se 1st = 2 hata.', viz: { head: '1, 2', n: '1' } },
        ],
        constraints: ['Nodes: 1 ≤ sz ≤ 30', '0 ≤ Node.val ≤ 100', '1 ≤ n ≤ sz', 'Follow-up: ek hi pass me karo'],
      },
    },

    143: {
      oneLine: 'Teen step: middle dhundo → second half reverse → dono halves alternate jodo (L0, Ln, L1, Ln−1 …).',
      pattern: 'Middle + Reverse + Merge (combo)',
      approaches: [
        {
          level: 'Brute', idea: 'Saare nodes ArrayList me (index access mil gaya). i = 0, j = n−1 se two pointers: nodes[i].next = nodes[j], nodes[j].next = nodes[i+1] … End me last node ka next = null.',
          time: 'O(n)', space: 'O(n)',
          code: `public void reorderList(ListNode head) {
    List<ListNode> nodes = new ArrayList<>();
    for (ListNode cur = head; cur != null; cur = cur.next) nodes.add(cur);
    int i = 0, j = nodes.size() - 1;
    while (i < j) {
        nodes.get(i).next = nodes.get(j);
        i++;
        if (i == j) break;
        nodes.get(j).next = nodes.get(i);
        j--;
    }
    nodes.get(i).next = null;
}`,
        },
        {
          level: 'Optimal', idea: 'O(1) space: (1) slow/fast se first middle, (2) slow.next se second half alag karke reverse (LC 206), (3) first aur reversed second ko ek-ek karke weave (LC 21 jaisa jodna).',
          time: 'O(n)', space: 'O(1)',
          code: `public void reorderList(ListNode head) {
    if (head == null || head.next == null) return;
    // 1) middle dhundo (first middle)
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    // 2) second half ko alag karke reverse karo
    ListNode second = slow.next;
    slow.next = null;
    ListNode prev = null;
    while (second != null) {
        ListNode next = second.next;
        second.next = prev;
        prev = second;
        second = next;
    }
    // 3) dono halves ko alternate jodo
    ListNode first = head;
    second = prev;
    while (second != null) {
        ListNode n1 = first.next, n2 = second.next;
        first.next = second;
        second.next = n1;
        first = n1;
        second = n2;
    }
}`,
        },
      ],
      dryRun: '[1,2,3,4,5]: middle=3 → halves 1→2→3 | 4→5 → reverse 5→4 → weave 1,5,2,4,3',
      interview: 'Reordering means alternating nodes from the front and the back. Instead of storing nodes in a list, I combine three linked-list techniques: find the middle with slow and fast pointers, cut the list there and reverse the second half, then weave the two halves together one node at a time. Each step is O(n) and uses O(1) extra space, and I only change next pointers, never values.',
      problem: {
        statement: 'List <code>L0 → L1 → … → Ln−1 → Ln</code> ko is order me badlo: <code>L0 → Ln → L1 → Ln−1 → L2 → Ln−2 → …</code>. Node ki <b>values change nahi</b> karni — sirf nodes ko re-arrange karo (in-place, kuch return nahi).',
        examples: [
          { input: 'head = [1,2,3,4]', output: '[1,4,2,3]', explain: 'Aage se 1, peeche se 4, aage se 2, peeche se 3.', viz: { head: '1, 2, 3, 4' } },
          { input: 'head = [1,2,3,4,5]', output: '[1,5,2,4,3]', explain: '1, 5, 2, 4, phir beech wala 3.', viz: { head: '1, 2, 3, 4, 5' } },
        ],
        constraints: ['Nodes: 1 ≤ n ≤ 5 × 10⁴', '1 ≤ Node.val ≤ 1000'],
      },
    },

    25: {
      oneLine: 'Dummy + groupPrev: k nodes gino (kam hain toh ruk jao), group reverse karo, groupPrev ko group ke naye tail pe le jao.',
      pattern: 'Pointer Reversal + Dummy Node',
      approaches: [
        {
          level: 'Brute', idea: 'Values ArrayList me, har k ke block ko reverse karo (last adhoora block nahi), phir values wapas nodes me likho. Simple, lekin node values badli (follow-up allow nahi karta) aur O(n) space.',
          time: 'O(n)', space: 'O(n)',
          code: `public ListNode reverseKGroup(ListNode head, int k) {
    List<Integer> vals = new ArrayList<>();
    for (ListNode c = head; c != null; c = c.next) vals.add(c.val);
    for (int s = 0; s + k <= vals.size(); s += k) {
        Collections.reverse(vals.subList(s, s + k));
    }
    ListNode c = head;
    for (int v : vals) {
        c.val = v;
        c = c.next;
    }
    return head;
}`,
        },
        {
          level: 'Optimal', idea: 'Iterative O(1): groupPrev se k-th node dhundo. Group ko reverse karo, prev ko groupNext se shuru karke (taaki reversed group ka tail khud aage juda rahe). Phir groupPrev.next = kth, groupPrev = purana first.',
          time: 'O(n)', space: 'O(1)',
          code: `public ListNode reverseKGroup(ListNode head, int k) {
    ListNode dummy = new ListNode(0, head);
    ListNode groupPrev = dummy;
    while (true) {
        ListNode kth = groupPrev;
        for (int i = 0; i < k && kth != null; i++) {
            kth = kth.next;
        }
        if (kth == null) break;
        ListNode groupNext = kth.next;
        ListNode prev = groupNext, cur = groupPrev.next;
        while (cur != groupNext) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        ListNode first = groupPrev.next;
        groupPrev.next = kth;
        groupPrev = first;
    }
    return dummy.next;
}`,
        },
        {
          level: 'Recursive', idea: 'Pehle k nodes hain ya nahi check karo. Hain toh baaki list ko recursion se reverse karwao (rest), phir apne k nodes ko reverse karke unka tail rest se jodo.',
          time: 'O(n)', space: 'O(n/k) call stack',
          code: `public ListNode reverseKGroup(ListNode head, int k) {
    ListNode cur = head;
    int count = 0;
    while (cur != null && count < k) {
        cur = cur.next;
        count++;
    }
    if (count < k) return head;
    ListNode rest = reverseKGroup(cur, k);
    ListNode prev = rest, node = head;
    for (int i = 0; i < k; i++) {
        ListNode next = node.next;
        node.next = prev;
        prev = node;
        node = next;
    }
    return prev;
}`,
        },
      ],
      dryRun: '[1,2,3,4,5], k=2: group 1-2 → 2→1, group 3-4 → 4→3, group [5] adhoora → chhod do → [2,1,4,3,5]',
      interview: 'I use a dummy node and a groupPrev pointer that sits just before the current group. For each group I first walk k steps to find the k-th node; if there are fewer than k nodes I stop, leaving the tail as it is. Otherwise I reverse the group with the standard prev, current, next loop, starting prev at the node after the group so the reversed tail stays connected. Then I link groupPrev to the new group head and move groupPrev to the old first node. O(n) time, O(1) extra space.',
      problem: {
        statement: 'Linked list ka <b>head</b> aur integer <b>k</b> diya hai. List ke nodes ko <b>k-k ke group me reverse</b> karo. Agar end me k se kam nodes bachte hain toh unhe waise hi chhod do. Sirf nodes (links) badalne hain, values nahi.',
        examples: [
          { input: 'head = [1,2,3,4,5], k = 2', output: '[2,1,4,3,5]', explain: '(1,2) → (2,1), (3,4) → (4,3), 5 akela → same.', viz: { head: '1, 2, 3, 4, 5', k: '2' } },
          { input: 'head = [1,2,3,4,5], k = 3', output: '[3,2,1,4,5]', explain: '(1,2,3) → (3,2,1); 4,5 sirf 2 hain (< 3) → same.', viz: { head: '1, 2, 3, 4, 5', k: '3' } },
        ],
        constraints: ['Nodes: n', '1 ≤ k ≤ n ≤ 5000', '0 ≤ Node.val ≤ 1000', 'Follow-up: O(1) extra memory me karo'],
      },
    },
  },

  // ---------------- DAYS (14) ----------------
  days: [
    {
      day: 1, week: 1, dow: 'Mon', type: 'learn', title: 'Introduction to Linked List — Node + Traversal (No LeetCode)',
      theory: ['Node = data + next', 'head / tail / null', 'Array vs Linked List', 'Traverse, count, search, insert head/tail'],
      qs: [],
      interview: {
        q: 'What is a linked list and when would you use it over an array?',
        a: 'A linked list is a chain of nodes where each node stores its data and a reference to the next node, so the nodes do not need to be contiguous in memory. The head points to the first node and the last node points to null. Unlike an array there is no O(1) indexing; reaching the i-th node takes O(i). Its strength is that inserting or deleting at the head, or after a node I already hold, is O(1) because I only change references instead of shifting elements. I pick it when I need frequent insertions and deletions at known positions, and an array when I need fast indexing and cache-friendly iteration.',
      },
    },
    {
      day: 2, week: 1, dow: 'Tue', type: 'learn', title: 'Traversal + Reverse Basics — Pointer Manipulation',
      theory: ['Traversal: current = current.next', 'Reference vs value', 'next save nahi kiya = list lost', 'prev / current / next intro'],
      qs: [206],
      interview: {
        q: 'How do you reverse a linked list iteratively?',
        a: 'I keep three pointers: prev, which starts at null because the old head becomes the new tail; current, which starts at head; and next, which I use to save the rest of the list. In every iteration I save current.next, point current.next back to prev, move prev to current, and move current to the saved next. When current becomes null, prev is the new head, so I return it. Each node is visited once, so it is O(n) time and O(1) extra space.',
      },
    },
    {
      day: 3, week: 1, dow: 'Wed', type: 'learn', title: 'Reverse Linked List Mastery — Iterative + Recursive',
      theory: ['Iterative revision + pointer table', 'New head = prev', 'Recursive: base case, call, unwinding', 'Iterative O(1) vs Recursive O(n) stack'],
      qs: [206],
      interview: {
        q: 'Iterative or recursive reversal — which would you use in production?',
        a: 'Both are O(n) time, but the iterative version uses O(1) extra space, while the recursive one keeps one stack frame per node, so it is O(n) space. For a very long list the recursive version can throw a StackOverflowError in Java because there is no tail-call optimization. So I would use the iterative version in production. The recursive version is still worth knowing: it reaches the end first, and then fixes each link while the calls return, with head.next.next = head and head.next = null.',
      },
    },
    {
      day: 4, week: 1, dow: 'Thu', type: 'learn', title: 'Fast & Slow Pointer Pattern — Middle Node',
      theory: ['slow 1 step, fast 2 step', 'Condition: fast != null && fast.next != null', 'Even length → second middle', 'Cycle intuition (Week 6 me full)'],
      qs: [876],
      interview: {
        q: 'Explain the fast and slow pointer technique.',
        a: 'I move two pointers through the list at different speeds: slow moves one node per step and fast moves two. Because fast covers twice the distance, when fast reaches the end slow is exactly in the middle, which finds the middle node in one pass with O(1) space. The same idea detects a cycle: if there is a loop, fast keeps going around and eventually lands on slow, while without a loop fast simply reaches null. I always guard the loop with fast != null && fast.next != null so I never dereference null.',
      },
    },
    {
      day: 5, week: 1, dow: 'Fri', type: 'learn', title: 'Merge Two Sorted Lists — Dummy Node',
      theory: ['Compare heads, chhota jodo', 'Dummy + tail pointer', 'Bachi list seedha attach', 'O(n + m) time, O(1) space'],
      qs: [21],
      interview: {
        q: 'Why do we use a dummy node in linked list problems?',
        a: 'A dummy node is a placeholder placed before the real head. Without it, the first node of the result is a special case: I would need extra if-checks to set the head. With a dummy, every node, including the first, is attached the same way through tail.next, so the code is shorter and less error-prone. At the end I return dummy.next. It costs one extra node, which is O(1) space.',
      },
    },
    {
      day: 6, week: 1, dow: 'Sat', type: 'revision', title: 'Linked List Pattern Revision — Reverse, Middle, Merge',
      theory: ['Pattern recognition table', 'Dry run challenge (bina code)', 'Re-solve 206, 876, 21', 'One-page pattern sheet'],
      qs: [206, 876, 21],
      interview: {
        q: 'How do you recognise which linked list pattern to use?',
        a: 'I look at what the problem asks. If the order of nodes must be flipped, I use the three-pointer reversal with prev, current and next. If I need a position relative to the length, like the middle, or I suspect a loop, I use slow and fast pointers. If I am building a new list, for example merging sorted lists, I use a dummy node with a tail pointer so the head is not a special case. Simple printing, counting or searching is just a traversal from head until null.',
      },
    },
    {
      day: 7, week: 1, dow: 'Sun', type: 'mock', title: 'Linked List Mock Interview — 206, 876, 21 + Contest',
      theory: ['Sohvi: 30 min — 3 questions', 'Tum: 45–60 min — 3 questions, 9-step format', 'Pointer movement + edge cases', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [206, 876, 21],
      interview: {
        q: 'How do you explain your approach clearly in an interview?',
        a: 'I first restate the problem and confirm inputs, outputs and edge cases. For linked lists I draw the nodes and pointers, because pointer changes are hard to follow in words alone. I name the pattern, state a simple approach with its complexity, then derive the optimal one and walk through it on a small example, showing how each pointer moves. Only then do I code, narrating each line, and I finish by dry-running an edge case like an empty or single-node list.',
      },
    },
    {
      day: 8, week: 2, dow: 'Mon', type: 'learn', title: 'Cycle Detection — HashSet + Floyd (Fast & Slow)',
      theory: ['Cycle = koi next pichle node pe', 'while (cur != null) kabhi khatam nahi', 'HashSet: O(n) space', 'Floyd: relative speed 1 → collision pakka'],
      qs: [141],
      interview: {
        q: "Why does Floyd's cycle detection always work?",
        a: 'If there is no cycle, fast reaches null and we stop. If there is a cycle, eventually both pointers are inside it. Each iteration slow moves one node and fast moves two, so their relative speed is one node per step: the gap from fast to slow along the cycle shrinks by exactly one each time. Because it decreases one at a time, it must hit zero, which means both land on the same node; fast can never jump over slow. That gives O(n) time and O(1) space, versus O(n) space for a HashSet of visited node references.',
      },
    },
    {
      day: 9, week: 2, dow: 'Tue', type: 'learn', title: 'Find Cycle Start — Floyd Phase 2 + Math',
      theory: ['a, b, c distances; L = b + c', 'a + b = kL → a = (k−1)L + c', 'slow = head, fast meeting point pe', 'Dono 1-1 step → cycle start'],
      qs: [142],
      interview: {
        q: 'Prove why resetting slow to head finds the cycle start.',
        a: 'Let a be the distance from head to the cycle start, b from the cycle start to the meeting point, c from the meeting point back to the start, so the cycle length is L = b + c. At the meeting, slow has walked a + b and fast has walked twice that. The extra a + b that fast walked must be a whole number of loops, so a + b = kL, which gives a = kL − b = (k − 1)L + c. So walking a steps from the head reaches the start, and walking a steps from the meeting point also reaches the start after c steps plus whole loops. That is why I reset slow to head, keep fast at the meeting point, and move both one step until they meet.',
      },
    },
    {
      day: 10, week: 2, dow: 'Wed', type: 'learn', title: 'Remove Nth Node From End — Gap Technique + Dummy',
      theory: ['Two-pass: length − n', 'One-pass: fast n+1 aage (dummy se)', 'Fixed gap → slow target se pehle', 'Dummy = head delete bhi normal'],
      qs: [19],
      interview: {
        q: 'How do you find the n-th node from the end in one pass?',
        a: 'I use two pointers with a fixed gap. Both start at a dummy node placed before the head. I move fast n + 1 steps first, then move both together until fast becomes null. Because the gap stays n + 1, slow stops exactly one node before the target, so I unlink it with slow.next = slow.next.next. The dummy makes deleting the head a normal case, since even the head now has a previous node. It is O(L) time and O(1) space, and I do not need to know the length in advance.',
      },
    },
    {
      day: 11, week: 2, dow: 'Thu', type: 'learn', title: 'Reorder List — Middle + Reverse + Merge',
      theory: ['Middle: first half ka end (slow)', 'Split: slow.next = null', 'Second half reverse', 'Alternate merge (save dono next)'],
      qs: [143],
      interview: {
        q: 'How do you break a hard linked-list problem into known pieces?',
        a: 'I look at what the output needs and map each part to a standard technique. In Reorder List the output alternates nodes from the front and from the back, so I need the back half in reverse order. I find the end of the first half with slow and fast pointers, cut the list there, and reverse the second half. Then I weave the two halves together, saving both next pointers before relinking. Each piece is a pattern I already trust and can test separately, so the full solution is reliable, and it stays O(n) time with O(1) extra space.',
      },
    },
    {
      day: 12, week: 2, dow: 'Fri', type: 'learn', title: 'Reverse Nodes in k-Group (Hard) — Group Reversal',
      theory: ['kth node dhundo; null → stop', 'groupNext save', 'prev = groupNext se reverse', 'groupPrev.next = kth; groupPrev = old start'],
      qs: [25],
      interview: {
        q: 'Walk me through reversing nodes in groups of k.',
        a: 'I add a dummy before head and keep groupPrev, the node just before the current group. I walk k steps from groupPrev to find the k-th node; if I hit null, fewer than k nodes remain and I stop, leaving them unchanged. Otherwise I save groupNext, the node after the group, and reverse the group with prev, curr and next, starting prev at groupNext so the reversed tail is already connected to the rest. Finally groupPrev.next becomes the k-th node, and groupPrev moves to the old first node, which is now the end of this group. Each node is touched a constant number of times: O(n) time, O(1) extra space.',
      },
    },
    {
      day: 13, week: 2, dow: 'Sat', type: 'revision', title: 'Advanced Linked List Revision — 141, 142, 19, 143, 25',
      theory: ['Master pattern table', 'Pointer recognition test', '5 mandatory dry runs', 'Timer: 10/15/15/20/30 min'],
      qs: [141, 142, 19, 143, 25],
      interview: {
        q: 'What are the most common linked list patterns?',
        a: 'I think of five. Fast and slow pointers, for the middle node and for detecting a cycle; Floyd\'s second phase, to find where the cycle starts; the gap technique with a dummy node, to find or remove the n-th node from the end in one pass; in-place reversal with prev, current and next, used for a whole list or for groups of k; and the dummy node for building or deleting without special-casing the head. Harder problems like Reorder List are combinations: middle, reverse, then merge.',
      },
    },
    {
      day: 14, week: 2, dow: 'Sun', type: 'mock', title: 'Linked List Mock Interview — Week 6 Assessment + Contest',
      theory: ['Sohvi: 30 min conceptual + coding', 'Tum: 45–60 min, random order, 10-point explanation', 'Scorecard /100', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [141, 142, 19, 143, 25],
      interview: {
        q: 'How do you reorder a linked list in O(1) extra space?',
        a: 'Instead of copying the nodes into an array, I do it in three in-place steps. First I find the end of the first half with slow and fast pointers and cut the list there by setting slow.next to null. Second, I reverse the second half with three pointers. Third, I merge the two halves alternately: I save first.next and second.next, link first to second and second to the saved first.next, then advance both. Only a few pointers are used, so it is O(n) time and O(1) extra space.',
      },
    },
  ],

  // ---------------- LAST MINUTE ----------------
  lastMinute: {
    triggers: [
      ['Reverse list / reverse part', 'prev / current / next (save next first)'],
      ['Middle node', 'Slow / fast (fast != null && fast.next != null)'],
      ['Cycle hai?', "Floyd: slow == fast"],
      ['Cycle kahan shuru?', 'Meet ke baad slow = head, fast wahin; dono 1-1 step'],
      ['Head badal/delete ho sakta hai', 'Dummy node → return dummy.next'],
      ['Merge sorted lists', 'Dummy + tail, chhota jodo, bacha hua seedha jodo'],
      ['n-th from end, one pass', 'fast ko n+1 aage (dummy se), phir saath'],
      ['L0, Ln, L1, Ln−1 …', 'Middle → reverse second half → weave'],
      ['Reverse in groups of k', 'groupPrev + kth; prev = groupNext se reverse'],
    ],
    edge: [
      'Empty list (head = null)',
      'Single node / two nodes',
      'Head khud delete ho (LC 19: n = length)',
      'Even vs odd length (middle: second vs first middle)',
      'Last group me k se kam nodes (LC 25 — chhod do)',
      'Cycle tail se head tak (pos = 0)',
    ],
    mistakes: [
      'current.next badalne se pehle next save nahi kiya → baaki list kho gayi',
      'fast.next.next bina fast.next null check ke → NullPointerException',
      'Reverse ke baad head return kiya (prev return karna tha)',
      'Recursive reverse me head.next = null bhoola → 1 ⇄ 2 cycle',
      'Cycle me values compare kiye (slow.val == fast.val) — reference compare karo',
      'Reorder me first half ka end (slow.next = null) nahi toda → cycle',
      'LC 19 me dummy nahi → head delete pe crash',
    ],
  },
};
