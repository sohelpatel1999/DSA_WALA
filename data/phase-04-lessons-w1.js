// Phase 4 (Linked List) — Week 5 lessons (local days 1–7 = global days 29–35). Day 1 (phase-01) wala format.
// Week 5 = LINKED LIST FOUNDATIONS (Sohel ka diya hua syllabus, 2026-11-07).
// Daily session 9:00–10:30 PM: 20 min theory · 20 min visualization + dry run · 20 min coding together · 30 min individual practice.
(function () {
  const P = window.PHASE_CONTENT['linked-list'];
  P.lessons = P.lessons || {};
  const ap = (n, i) => P.questions[n].approaches[i].code;
  const sol = (n, i) => 'class Solution {\n' + ap(n, i).split('\n').map(l => '    ' + l).join('\n') + '\n}';
  // Part 0 ka ek revision question
  const rev = o => [
    { h: o.h },
    { p: o.p },
    { pre: o.ex },
    { p: '<b>Pattern:</b> ' + o.pat },
    { olist: o.steps },
    { code: o.code },
    { tip: '<b>Memory hook:</b> ' + o.hook },
  ];
  // Roz ka session split (9:00–10:30 PM)
  const session = (theory, viz, coding, practice) => ({ table: { head: ['Time', 'Slot', 'Aaj kya'], rows: [
    ['9:00–9:20', 'Theory', theory],
    ['9:20–9:40', 'Visualization + dry run', viz],
    ['9:40–10:00', 'Coding together', coding],
    ['10:00–10:30', 'Individual LeetCode / practice', practice],
  ] } });
  const RULE = 'Daily rule: <b>Sohvi</b> pehle brute force / simple pointer logic samjhegi. <b>Tum</b> brute force se optimal tak jaoge. Topic same, difficulty alag.';

  const MY_LIST = `class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

class MyLinkedList {
    Node head;
    Node tail;
    int size;

    void insertAtHead(int val) {
        Node node = new Node(val);
        node.next = head;
        head = node;
        if (tail == null) tail = node;
        size++;
    }

    void insertAtTail(int val) {
        Node node = new Node(val);
        if (head == null) {
            head = node;
            tail = node;
        } else {
            tail.next = node;
            tail = node;
        }
        size++;
    }

    boolean deleteByValue(int val) {
        if (head == null) return false;
        if (head.data == val) {
            head = head.next;
            if (head == null) tail = null;
            size--;
            return true;
        }
        Node prev = head;
        while (prev.next != null && prev.next.data != val) {
            prev = prev.next;
        }
        if (prev.next == null) return false;
        if (prev.next == tail) tail = prev;
        prev.next = prev.next.next;
        size--;
        return true;
    }

    boolean search(int val) {
        Node current = head;
        while (current != null) {
            if (current.data == val) return true;
            current = current.next;
        }
        return false;
    }

    int length() {
        return size;
    }

    void printList() {
        Node current = head;
        StringBuilder sb = new StringBuilder();
        while (current != null) {
            sb.append(current.data).append(" -> ");
            current = current.next;
        }
        sb.append("null");
        System.out.println(sb);
    }
}`;

  Object.assign(P.lessons, {
    // =====================================================================
    // DAY 29
    1: {
      title: 'Introduction to Linked List — Node + Traversal',
      goal: '<b>Sohvi:</b> Linked List ka basic structure — <code>head</code>, <code>next</code>, <code>null</code> — bina confusion. <b>Tum:</b> Singly Linked List <b>scratch se implement</b> (Java ki built-in <code>LinkedList</code> nahi). Aaj <b>koi LeetCode nahi</b> — sirf foundation.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision (Sliding Window, Week 4) + Aaj ka session',
          blocks: [
            { p: RULE },
            session('Module 1–3: Linked List kya hai, memory layout, Array vs LL', 'Memory table + dry run <code>10 → 20 → 30 → 40</code>', 'Module 4: Node, traverse, count, search, insert head/tail', 'Sohvi: Node + 3 nodes + print/count · Tum: poori MyLinkedList class'),
            { p: 'Naya week shuru karne se pehle pichle hafte ke 3 sawaal — 10 minute me zubaani + paper pe.' },
            ...rev({
              h: 'LC 643 — Maximum Average Subarray I',
              p: 'Size k ki window ka maximum average nikalo.',
              ex: 'nums = [1,12,-5,-6,50,3], k = 4\nwindows: [1,12,-5,-6]=2, [12,-5,-6,50]=51, [-5,-6,50,3]=42\nmax sum = 51 → 51 / 4 = 12.75',
              pat: 'Fixed sliding window',
              steps: ['Pehle k elements ka sum.', 'Window slide: naya add, purana (i − k) minus.', 'best sum track karo, end me / k.'],
              code: `public double findMaxAverage(int[] nums, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += nums[i];
    int best = sum;
    for (int i = k; i < nums.length; i++) {
        sum += nums[i] - nums[i - k];
        best = Math.max(best, sum);
    }
    return (double) best / k;
}`,
              hook: 'Fixed window = ek aaya, ek gaya. Divide sirf end me.',
            }),
            ...rev({
              h: 'LC 3 — Longest Substring Without Repeating Characters',
              p: 'Bina repeat wale characters ka sabse lamba substring.',
              ex: 's = "abcabcbb" → "abc" → 3',
              pat: 'Variable window + HashMap (char → last index)',
              steps: ['right badhao, char ka last index dekho.', 'Agar woh window ke andar (≥ left) hai → left = last + 1.', 'last index update, best = max(best, right − left + 1).'],
              code: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> last = new HashMap<>();
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (last.containsKey(c) && last.get(c) >= left) left = last.get(c) + 1;
        last.put(c, right);
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
              hook: 'Repeat mila → left ko repeat ke aage kood do.',
            }),
            ...rev({
              h: 'LC 1004 — Max Consecutive Ones III',
              p: 'Zyada se zyada k zeros ko 1 bana sakte ho — sabse lamba 1s ka subarray.',
              ex: 'nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2 → 6\n(index 5..10 me 2 zeros flip)',
              pat: 'Variable window (zeros ≤ k)',
              steps: ['right pe 0 aaya → zeros++.', 'zeros > k → left se shrink jab tak valid.', 'best = max window.'],
              code: `public int longestOnes(int[] nums, int k) {
    int left = 0, zeros = 0, best = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] == 0) zeros++;
        while (zeros > k) {
            if (nums[left] == 0) zeros--;
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
              hook: 'Window ke andar zeros ≤ k — tootey toh left se sudharo.',
            }),
          ],
        },
        {
          title: 'Part 1 — Module 1: What is a Linked List? (15 min)',
          blocks: [
            { p: 'Array me boxes ek line me (continuous memory) hote hain. <b>Linked List</b> me har box — jise <b>node</b> kehte hain — memory me kahin bhi ho sakta hai. Har node ke paas do cheezein hoti hain: apna <b>data</b> aur <b>agle node ka reference/address</b> (<code>next</code>).' },
            { pre: `Head
  |
  v
[10 | next] → [20 | next] → [30 | null]` },
            { table: { head: ['Shabd', 'Matlab'], rows: [
              ['<b>Node</b>', 'Ek box: <code>data</code> + <code>next</code>'],
              ['<b>Data</b>', 'Jo value store hai (10, 20, 30)'],
              ['<b>Next pointer</b>', 'Agle node ka reference. Isi se nodes jude rehte hain'],
              ['<b>Head</b>', 'Pehle node ka reference — list ka darwaza'],
              ['<b>Tail</b>', 'Aakhri node (jiska <code>next = null</code>)'],
              ['<b>Null</b>', 'Koi node nahi — list yahan khatam'],
              ['<b>Dynamic memory</b>', 'Node <code>new Node(..)</code> se runtime pe banta hai; size pehle se fix nahi'],
            ] } },
            { p: '<b>Kyun chahiye?</b> Array ka size fixed hota hai aur beech/shuru me insert karne pe saare elements shift karne padte hain. Linked List me naya node banao aur 1–2 <code>next</code> badal do — shifting nahi.' },
            { tip: 'Ek line yaad rakho: <b>"Nodes continuous memory me nahi hote — next se jude hote hain."</b>' },
          ],
        },
        {
          title: 'Part 2 — Module 2: Node and Memory Layout (10 min)',
          blocks: [
            { pre: `Head = 100

Address     Data     Next
100         10       205
205         20       350
350         30       null` },
            { list: [
              '<b>Head</b> me pehle node ka reference (address 100) hai.',
              '<b>next</b> ek node ko doosre se jodta hai: 100 → 205 → 350.',
              '<b>null</b> matlab list khatam (350 ke baad koi nahi).',
              'Addresses 100, 205, 350 — <b>continuous nahi</b>. Isliye <code>list[2]</code> jaisa direct access nahi.',
              '<b>Head kho diya = poori list kho di.</b> Agar <code>head = head.next</code> kar diya aur pehle node ka reference kahin nahi rakha, toh 10 wala node kabhi wapas nahi milega (garbage collector hata dega).',
            ] },
            { code: `class Node {
    int data;      // value
    Node next;     // agle node ka reference (shuru me null)
    Node(int data) { this.data = data; }
}

Node a = new Node(10);
Node b = new Node(20);
Node c = new Node(30);
a.next = b;        // 10 → 20
b.next = c;        // 20 → 30   (c.next already null)
Node head = a;     // head = pehla node` },
            { tip: 'LeetCode me yahi class <code>ListNode</code> naam se milti hai (<code>val</code>, <code>next</code>). Aaj hum apni <code>Node</code> bana rahe hain taaki structure khud samjho.' },
          ],
        },
        {
          title: 'Part 3 — Module 3: Array vs Linked List (10 min)',
          blocks: [
            { table: { head: ['Operation', 'Array', 'Singly Linked List'], rows: [
              ['Access by index', 'O(1)', 'O(n)'],
              ['Search', 'O(n)', 'O(n)'],
              ['Insert at head', 'O(n) (sab shift)', 'O(1)'],
              ['Delete head', 'O(n) (sab shift)', 'O(1)'],
              ['Insert after known node', 'O(n) shifting', 'O(1)'],
              ['Extra memory', 'Low', 'Har node ke saath ek pointer'],
            ] } },
            { tip: '<b>Important:</b> Linked List me insertion O(1) <b>tabhi</b> hai jab position/node pehle se pata ho. Woh position <b>dhoondhne</b> me O(n) lag sakta hai. Interview me ye line zaroor bolo.' },
            { p: '<b>Kab kya?</b> Index se baar-baar padhna hai → Array. Shuru/beech me baar-baar jodna/hatana hai (jaise LRU cache, undo history) → Linked List.' },
          ],
        },
        {
          title: 'Part 4 — Module 4: Basic Operations (20 min)',
          blocks: [
            { p: 'Har operation ka core idea ek hi hai — <b>traversal</b>: <code>current</code> ko head se shuru karo aur <code>current = current.next</code> se null tak chalo.' },
            { code: `// 1–2. Node + list banana
Node head = new Node(10);
head.next = new Node(20);
head.next.next = new Node(30);
head.next.next.next = new Node(40);

// 3–4. Traverse + print
static void printList(Node head) {
    Node current = head;
    while (current != null) {
        System.out.print(current.data + " -> ");
        current = current.next;
    }
    System.out.println("null");
}

// 5. Count nodes
static int countNodes(Node head) {
    int count = 0;
    Node current = head;
    while (current != null) {
        count++;
        current = current.next;
    }
    return count;
}

// 6. Search
static boolean search(Node head, int target) {
    Node current = head;
    while (current != null) {
        if (current.data == target) return true;
        current = current.next;
    }
    return false;
}

// 7. Insert at beginning — naya node hi naya head
static Node insertAtHead(Node head, int val) {
    Node node = new Node(val);
    node.next = head;
    return node;
}

// 8. Insert at end — last node tak chalo
static Node insertAtTail(Node head, int val) {
    Node node = new Node(val);
    if (head == null) return node;
    Node current = head;
    while (current.next != null) current = current.next;
    current.next = node;
    return head;
}` },
            { lines: [
              ['Node current = head;', 'head ko kabhi move mat karo — copy (current) chalao.'],
              ['while (current != null)', 'null aaya = list khatam. Har node ek baar process.'],
              ['current = current.next;', 'Agle node pe jao. Ye bhool gaye → infinite loop.'],
              ['node.next = head;', 'Insert at head: naya node purane head ki taraf point kare.'],
              ['return node;', 'Ab naya node hi head hai — caller ko naya head lautao.'],
              ['while (current.next != null)', 'Insert at tail: last node pe rukna hai (null pe nahi), taaki uska next set kar sako.'],
              ['current.next = node;', 'Last node ab naye node se juda; naya node.next pehle se null.'],
            ] },
          ],
        },
        {
          title: 'Part 5 — Dry Run Together: 10 → 20 → 30 → 40 → null',
          blocks: [
            { p: '<b>Task 1–2: Print + Count</b>' },
            { table: { head: ['Step', 'current', 'Print', 'count'], rows: [
              ['start', '10', '—', '0'],
              ['1', '10 → 20', '10', '1'],
              ['2', '20 → 30', '20', '2'],
              ['3', '30 → 40', '30', '3'],
              ['4', '40 → null', '40', '4'],
              ['stop', 'null', '"null"', '<b>4</b>'],
            ] } },
            { p: '<b>Task 3: Find 30</b>' },
            { table: { head: ['current.data', '== 30?', 'Action'], rows: [
              ['10', 'Nahi', 'aage'],
              ['20', 'Nahi', 'aage'],
              ['30', '<b>Haan</b>', 'return true (40 tak gaye hi nahi)'],
            ] } },
            { p: '<b>Task 4: Insert 5 at head</b> · <b>Task 5: Insert 50 at tail</b>' },
            { pre: `Insert 5 at head:
  node(5).next = head(10)        5 → 10 → 20 → 30 → 40 → null
  head = node(5)                 O(1) — sirf 2 kaam

Insert 50 at tail:
  current: 5 → 10 → 20 → 30 → 40   (40.next == null → ruk)
  40.next = node(50)             5 → 10 → 20 → 30 → 40 → 50 → null
  O(n) — tail tak chalna pada (tail pointer rakho toh O(1))` },
          ],
        },
        {
          title: 'Part 6 — Visualize: traversal + count line-by-line',
          blocks: [
            { p: 'Aaj ka koi LeetCode nahi, lekin traversal ko chalte hue dekhna zaroori hai. Neeche wale visualizer ka <b>"Count + Walk (traversal)"</b> tab ka <b>pehla loop</b> bilkul aaj ka <code>countNodes()</code> hai: <code>cur</code> head se null tak, har node pe <code>count++</code>.' },
            { list: [
              '<b>cur</b> label har step me ek node aage jaata hai — VARIABLES me <code>count</code> badhta dikhega.',
              '<code>cur == null</code> aate hi loop khatam — yahi "list ka end" hai.',
              'Doosra loop (mid) abhi ignore karo — woh Day 32 (Middle Node) me kaam aayega.',
            ] },
            { viz: 876, ex: 0, variant: 1 },
          ],
        },
        {
          title: 'Part 7 — Tum (SDE-2): Singly Linked List from scratch',
          blocks: [
            { p: 'Java ki <code>java.util.LinkedList</code> use <b>nahi</b> karni. <code>head</code>, <code>tail</code> aur <code>size</code> teeno maintain karo — tail se insertAtTail O(1), size se length() O(1).' },
            { code: MY_LIST },
            { lines: [
              ['Node head; Node tail; int size;', 'tail rakhne se tail insert O(1); size rakhne se length O(1).'],
              ['node.next = head; head = node;', 'insertAtHead: pehle naya node purane head se jodo, phir head badlo (ulta kiya toh list kho jaayegi).'],
              ['if (tail == null) tail = node;', 'Khaali list me pehla node hi tail bhi hai.'],
              ['tail.next = node; tail = node;', 'insertAtTail: purana tail naye se juda, tail aage badha.'],
              ['if (head.data == val) { head = head.next; ... }', 'deleteByValue: head delete special case — head aage; list khaali hui toh tail = null.'],
              ['while (prev.next != null && prev.next.data != val)', 'Delete ke liye target ke <b>pichle</b> node pe rukna hai (prev.next = target).'],
              ['if (prev.next == tail) tail = prev;', 'Tail delete ho raha hai toh tail ko peeche lao — ye bug sabse common hai.'],
              ['prev.next = prev.next.next;', 'Target ko bypass kar do — ab woh unreachable hai.'],
              ['sb.append(current.data).append(" -> ");', 'printList: "10 -> 20 -> null" format.'],
            ] },
            { pre: `Test (maine chala ke check kiya):
insertAtTail 10,20,30,40   → 10 -> 20 -> 30 -> 40 -> null
search(30)=true, search(99)=false
insertAtHead 5, insertAtTail 50 → 5 -> 10 -> 20 -> 30 -> 40 -> 50 -> null, length 6
deleteByValue(5)  → 10 -> 20 -> 30 -> 40 -> 50 -> null
deleteByValue(50) then insertAtTail 60 → ... 40 -> 60 -> null   (tail sahi update hua)
deleteByValue(99) → false` },
          ],
        },
        {
          title: 'Part 8 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Kya hona chahiye', 'Galti kahan hoti hai'], rows: [
              ['Empty list (head = null)', 'print → "null", count 0, search false, delete false', '<code>head.data</code> pe NullPointerException'],
              ['Ek node', 'Woh hi head aur tail; delete ke baad dono null', 'Tail null karna bhool gaye'],
              ['Head delete', '<code>head = head.next</code>', 'Normal loop se head delete nahi hota'],
              ['Tail delete', 'tail = prev', 'tail purane (deleted) node pe atka reh gaya'],
              ['Value nahi mili', 'delete → false, list same', 'prev.next null pe <code>.next</code> → NPE'],
              ['Duplicate values', 'Pehla match delete', '—'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Complexity',
          blocks: [
            { table: { head: ['Operation', 'Time', 'Space', 'Note'], rows: [
              ['printList / countNodes', 'O(n)', 'O(1)', 'Har node ek baar'],
              ['search', 'O(n)', 'O(1)', 'Worst case end tak'],
              ['insertAtHead', 'O(1)', 'O(1)', 'Sirf 2 assignments'],
              ['insertAtTail (bina tail)', 'O(n)', 'O(1)', 'Last tak chalna'],
              ['insertAtTail (tail pointer)', 'O(1)', 'O(1)', 'MyLinkedList me'],
              ['deleteByValue', 'O(n)', 'O(1)', 'Dhoondhna O(n), hatana O(1)'],
              ['length (size field)', 'O(1)', 'O(1)', 'Count maintain kiya'],
            ] } },
          ],
        },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Node me kya-kya store hota hai?', 'Data aur agle node ka reference (<code>next</code>).'],
              ['Last node ka <code>next</code> kya hota hai?', '<code>null</code> — list ka end.'],
              ['Linked list me i-th element O(1) me kyun nahi?', 'Nodes continuous memory me nahi; address calculate nahi ho sakta — head se i steps chalna padta hai.'],
              ['Head kho diya toh kya hoga?', 'Poori list unreachable — wapas nahi milegi. Isliye traversal me <code>current</code> chalate hain, head nahi.'],
              ['Insert at head O(1) kyun hai?', 'Naya node banao, uska next = head, head = naya node. Koi shifting nahi.'],
              ['"Linked list insert O(1) hai" — kab galat hai?', 'Jab position pehle se pata nahi — dhoondhne me O(n) lagta hai.'],
              ['Tail pointer rakhne ka fayda aur risk?', 'Fayda: tail insert O(1). Risk: delete/empty hone pe tail update bhoole toh galat node pe point karega.'],
              ['Traversal loop me <code>current = current.next</code> bhool gaye toh?', 'current kabhi null nahi hoga → infinite loop.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['What is a linked list?', 'A linked list is a sequence of nodes where each node stores a value and a reference to the next node. The head points to the first node, and the last node points to null. Because the nodes are not stored contiguously, there is no constant-time indexing; to reach the i-th node I have to walk from the head. In return, inserting or removing a node at the head, or after a node I already hold, is O(1) because I only update references.'],
              ['Array vs Linked List', 'An array gives O(1) access by index and is cache friendly, but inserting or deleting at the front or middle needs shifting, which is O(n). A singly linked list gives O(1) insertion and deletion at the head or after a known node, but access and search are O(n), and every node pays extra memory for the pointer. One caveat: insertion is only O(1) when I already know the position; finding it can still cost O(n).'],
              ['Walk me through your linked list implementation', 'I keep a head, a tail and a size. insertAtHead creates a node, points it to the old head and moves head. insertAtTail links the old tail to the new node, so it is O(1). deleteByValue handles the head separately, otherwise it stops at the node before the target and bypasses it, and if the removed node was the tail I move the tail back. Search and print are simple traversals from head until null.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohvi session (Beginner practice — No LeetCode today)',
          blocks: [
            { olist: [
              '<code>Node</code> class likho (<code>data</code>, <code>next</code>, constructor).',
              '3 nodes banao: 10, 20, 30.',
              'Unhe jodo: <code>a.next = b; b.next = c;</code>',
              'Print list: <code>10 -> 20 -> 30 -> null</code> (while loop se, head move kiye bina).',
              'Count nodes → 3.',
              'Paper pe har node ka box + arrow banao aur bolo: "head yahan, next yahan, null yahan".',
            ] },
            { tip: 'Goal: <code>head</code>, <code>next</code>, <code>null</code> me koi confusion nahi. Code chhota hai — samajh badi honi chahiye.' },
          ],
        },
        {
          title: 'Part 13 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Singly Linked List scratch se: <code>insertAtHead()</code>, <code>insertAtTail()</code>, <code>deleteByValue()</code>, <code>search()</code>, <code>length()</code>, <code>printList()</code>. <code>java.util.LinkedList</code> nahi.',
              '<b>Task B:</b> Part 7 ke test calls apne <code>main()</code> me chalao — especially tail delete ke baad insertAtTail.',
              '<b>Task C:</b> Har method ka time complexity bolo; "insert O(1) kab hai" wali line zaroor.',
              '<b>Task D:</b> Bonus soch: <code>tail</code> na rakho toh kaun sa method O(n) ho jaayega? (insertAtTail)',
            ] },
          ],
        },
        {
          title: 'Part 14 — Homework',
          blocks: [
            { list: [
              '<b>Sohvi:</b> 5 alag length (1, 2, 3, 4, 5 nodes) ki linked lists draw karo aur har ek ke pointers explain karo — head kahan, har next kahan, null kahan.',
              '<b>Tum:</b> Poori basic Linked List class <b>bina notes dekhe</b> dobara likho.',
              'Kal (Day 30): Pointers kaise move hote hain + reverse ka basic. LC 206 problem padh lo.',
            ] },
          ],
        },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>5 → 10 → null</code> me head kya, tail kya?', 'head = 5 wala node, tail = 10 wala node (next null).'],
              ['Insert 1 at head of <code>5 → 10</code>?', '<code>1 → 5 → 10 → null</code>'],
              ['Empty list pe countNodes?', '0 — loop ek baar bhi nahi chala.'],
              ['Delete head ka ek line?', '<code>head = head.next;</code>'],
              ['Traversal loop ki condition?', '<code>while (current != null)</code>'],
            ] },
          ],
        },
      ],
      checks: [
        'Node / head / next / null / tail ka diagram bina dekhe bana sakta/sakti hu',
        'Memory layout table (address, data, next) samjha',
        'Array vs Linked List table zubaani',
        'Traversal, count, search bina dekhe likhe',
        'Sohvi: 3 nodes jod ke print + count kiya',
        'Tum: MyLinkedList ke 6 methods scratch se, tests pass',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Head = darwaza, next = raasta, null = deewar. Head ko kabhi mat chalao — current chalao.',
    },

    // =====================================================================
    // DAY 30
    2: {
      title: 'Traversal and Reverse Basics — Pointer Manipulation',
      goal: 'Samajhna ki pointers <b>kaise move</b> hote hain aur <code>next</code> references badalne se list <b>reverse</b> kaise hoti hai. Pehli baar <b>LC 206</b> — iterative (prev / current / next).',
      main: 206,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('Module 1: Traversal pattern · Module 2: Pointer manipulation', 'Module 3: Three-pointer dry run <code>10 → 20 → 30</code>', 'LC 206 iterative saath me', 'Sohvi: har iteration draw · Tum: edge cases + complexity'),
            ...rev({
              h: 'Kal ka: Linked List traversal + count (no LC)',
              p: 'Head se null tak chalo, har node pe kaam karo.',
              ex: '10 → 20 → 30 → 40 → null   → count = 4',
              pat: 'Traversal',
              steps: ['current = head.', 'current != null tak: process, current = current.next.', 'head ko move mat karo.'],
              code: `int countNodes(Node head) {
    int count = 0;
    Node current = head;
    while (current != null) {
        count++;
        current = current.next;
    }
    return count;
}`,
              hook: 'current chalao, head nahi. null = stop.',
            }),
            ...rev({
              h: 'LC 1456 — Maximum Number of Vowels in a Substring of Given Length',
              p: 'Length k ke kisi bhi substring me max vowels.',
              ex: 's = "abciiidef", k = 3 → "iii" → 3',
              pat: 'Fixed sliding window (count)',
              steps: ['Naya char vowel → count++.', 'i ≥ k pe bahar jaane wala char vowel → count−−.', 'best = max(best, count).'],
              code: `public int maxVowels(String s, int k) {
    String v = "aeiou";
    int count = 0, best = 0;
    for (int i = 0; i < s.length(); i++) {
        if (v.indexOf(s.charAt(i)) >= 0) count++;
        if (i >= k && v.indexOf(s.charAt(i - k)) >= 0) count--;
        best = Math.max(best, count);
    }
    return best;
}`,
              hook: 'Window me sirf count chalao — pura substring dobara mat gino.',
            }),
            ...rev({
              h: 'LC 11 — Container With Most Water',
              p: 'Do lines chuno jinke beech sabse zyada paani aaye.',
              ex: 'height = [1,8,6,2,5,4,8,3,7] → lines 8 (i=1) aur 7 (i=8): min(8,7) × 7 = 49',
              pat: 'Two pointers (opposite direction)',
              steps: ['l = 0, r = n − 1.', 'area = min(h[l], h[r]) × (r − l).', 'Chhoti line wala pointer andar — badi ko rakhne se hi area badh sakta hai.'],
              code: `public int maxArea(int[] height) {
    int l = 0, r = height.length - 1, best = 0;
    while (l < r) {
        best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
        if (height[l] < height[r]) l++;
        else r--;
    }
    return best;
}`,
              hook: 'Chhoti deewar hi paani rokti hai — usi ko aage badhao.',
            }),
          ],
        },
        {
          title: 'Part 1 — Module 1: Traversal Pattern (15 min)',
          blocks: [
            { code: `Node current = head;

while (current != null) {
    // process current.data
    current = current.next;
}` },
            { table: { head: ['Sawaal', 'Jawab'], rows: [
              ['<code>head</code> se kyun shuru?', 'List ka sirf pehla node hi seedha pata hai. Baaki tak pahunchne ka ek hi raasta — next follow karo.'],
              ['<code>null</code> pe kyun rukna?', 'Last node ka next null hai. null ke baad koi node nahi; <code>null.data</code> = NullPointerException.'],
              ['<code>current.next</code> se kyun move?', 'Wahi agle node ka reference hai. <code>current++</code> jaisa kuch nahi hota (index nahi hai).'],
              ['<code>current</code> update bhool gaye toh?', 'current hamesha head pe → condition kabhi false nahi → <b>infinite loop</b>.'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Module 2: Pointer Manipulation (15 min)',
          blocks: [
            { list: [
              '<b>Reference vs value:</b> <code>current</code> ek reference hai (node ka pata). <code>current.data</code> value hai. <code>current = x</code> sirf hamara pointer badalta hai; <code>current.next = x</code> <b>list ka link</b> badalta hai.',
              '<b>next update:</b> <code>a.next = c</code> karte hi a → b wala link toot jaata hai.',
              '<b>Losing references:</b> Agar b ka reference kahin aur nahi rakha, toh b (aur uske aage sab) kho gaye.',
              '<b>Next save karna kyun zaroori:</b> Link todne se pehle <code>Node next = current.next</code> — "aage ka raasta" yaad rakho.',
            ] },
            { pre: `Before:   10 → 20 → 30 → null
Goal:     30 → 20 → 10 → null

Galat tareeka (next save nahi kiya):
  current = 10
  current.next = null        10 → null
  current = current.next     current = null   ← 20 aur 30 kho gaye!` },
          ],
        },
        {
          title: 'Part 3 — Module 3: Three-Pointer Introduction (20 min)',
          blocks: [
            { table: { head: ['Pointer', 'Kaam', 'Shuru me'], rows: [
              ['<code>prev</code>', 'Ulti ho chuki list ka head', '<code>null</code> (purana head naya tail banega, uska next null)'],
              ['<code>current</code>', 'Jis node ka link abhi ulta karna hai', '<code>head</code>'],
              ['<code>next</code>', 'Aage ki list ka backup', '<code>current.next</code>'],
            ] } },
            { pre: `prev = null
current = 10
next = 20` },
            { olist: [
              '<b>Save</b> <code>current.next</code> → <code>next = current.next</code>',
              '<b>Reverse</b> <code>current.next</code> → <code>current.next = prev</code>',
              '<b>Move</b> <code>prev</code> → <code>prev = current</code>',
              '<b>Move</b> <code>current</code> → <code>current = next</code>',
            ] },
            { tip: '<b>Order kyun zaroori?</b> Step 2 se pehle step 1 nahi kiya → aage ki list kho jaayegi. Step 3 aur 4 ulte kiye → prev ko galat (agla) node mil jaayega. Yaad rakho: <b>S-R-P-C</b> (Save, Reverse, Prev, Current).' },
          ],
        },
        { title: 'Part 4 — Aaj ka problem: LC 206 Reverse Linked List', blocks: [{ problem: 206 }] },
        {
          title: 'Part 5 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute (values copy):</b> Saari values ek <code>ArrayList</code> me daalo, phir list ko dobara chalo aur values ulte order me likh do. Kaam karta hai, lekin O(n) extra space, aur interviewer kahega "links badlo, values nahi".' },
            { p: '<b>Observation:</b> Har node ka arrow ulta karna hai: <code>10 → 20</code> ko <code>10 ← 20</code>. Ek node ka arrow ulta karne ke liye pichla node chahiye (<code>prev</code>), aur aage jaane ke liye agla node pehle save karna padega (<code>next</code>).' },
            { p: '<b>Optimal (3 pointers, in-place):</b> S-R-P-C loop jab tak <code>current != null</code>. End me <code>prev</code> = naya head.' },
          ],
        },
        {
          title: 'Part 6 — Dry run: 10 → 20 → 30',
          blocks: [
            { table: { head: ['Iteration', 'next (save)', 'current.next = prev', 'prev', 'current', 'Ulti list (prev se)'], rows: [
              ['start', '—', '—', 'null', '10', 'null'],
              ['1', '20', '10 → null', '10', '20', '10 → null'],
              ['2', '30', '20 → 10', '20', '30', '20 → 10 → null'],
              ['3', 'null', '30 → 20', '30', 'null', '30 → 20 → 10 → null'],
            ] } },
            { p: 'current = null → loop band. <b>return prev</b> = 30 → <code>30 → 20 → 10 → null</code>.' },
            { tip: 'Original links kyun badle? Kyunki humne <b>nodes nahi banaye</b> — wahi nodes hain, sirf unke arrows ulte hue. Isliye purana <code>head</code> (10) ab tail hai.' },
          ],
        },
        {
          title: 'Part 7 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — values copy</b>' },
            { code: sol(206, 0) },
            { p: '<b>Optimal — iterative 3 pointers</b>' },
            { code: sol(206, 1) },
            { lines: [
              ['ListNode prev = null;', 'Ulti list abhi khaali; purane head ka next null banega.'],
              ['ListNode current = head;', 'Pehle node se shuru.'],
              ['while (current != null)', 'Har node ka arrow ek baar ulta.'],
              ['ListNode next = current.next;', '<b>S</b>ave — aage ki list ka backup.'],
              ['current.next = prev;', '<b>R</b>everse — arrow peeche.'],
              ['prev = current;', '<b>P</b>rev aage — ulti list ka naya head.'],
              ['current = next;', '<b>C</b>urrent aage — saved node pe.'],
              ['return prev;', 'current null hai; prev naya head. (head return kiya toh sirf 1 node milega!)'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Visualize: pointer movement dekho',
          blocks: [
            { list: [
              'Har step me <b>prev / current / next</b> labels dekho.',
              '"reversed part" aur "baaki list" text dekho — reversed badhta hai, baaki ghatta hai.',
              'Example 3 (empty list) bhi chala ke dekho — loop chalta hi nahi, prev = null return.',
            ] },
            { viz: 206, ex: 0, variant: 0 },
          ],
        },
        {
          title: 'Part 9 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun chalta hai'], rows: [
              ['<code>[]</code> (empty)', '<code>[]</code>', 'current = null → loop nahi → prev = null'],
              ['<code>[1]</code>', '<code>[1]</code>', '1 iteration: 1.next = null, prev = 1'],
              ['<code>[1,2]</code>', '<code>[2,1]</code>', '2 iterations; 1.next = null, 2.next = 1'],
            ] } },
          ],
        },
        {
          title: 'Part 10 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Extra space'], rows: [
              ['Brute (values copy)', 'O(n)', 'O(n) ArrayList'],
              ['Iterative 3 pointers', 'O(n)', 'O(1) — sirf 3 references'],
            ] } },
          ],
        },
        {
          title: 'Part 11 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['prev null se kyun shuru?', 'Purana head naya tail banega; tail ka next null hona chahiye.'],
              ['next save kyun?', 'current.next = prev karte hi aage ka link toot jaata hai; save nahi kiya toh baaki list kho jaayegi.'],
              ['Loop ke baad kya return?', '<code>prev</code> — current null hai.'],
              ['<code>head</code> return kiya toh?', 'Purana head ab tail hai → sirf ek node ki list milegi.'],
              ['S-R-P-C me P aur C ulte kiye toh?', 'current = next pehle → prev = current galat (agla) node ban jaata hai; list toot jaati hai.'],
              ['Naye nodes banaye?', 'Nahi — wahi nodes, sirf links ulte. Isliye O(1) space.'],
              ['Brute approach me kya galat hai?', 'Kaam karta hai par O(n) extra space aur values badalta hai, links nahi.'],
              ['Edge cases?', 'Empty, 1 node, 2 nodes.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach (Brute → Optimal)', 'A simple approach copies all values into an array list and writes them back in reverse, which is O(n) time and O(n) space. A better way is to reverse the links in place. I keep prev, starting at null, and current, starting at head. In each step I save current.next, point current.next to prev, then move prev and current forward. When current becomes null, prev is the new head. That is O(n) time and O(1) extra space.'],
              ['Why does the order of steps matter?', 'The moment I overwrite current.next, I lose the only reference to the rest of the list, so I must save it first. And I must move prev before current, because prev has to become the node I just reversed, not the next one.'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohvi session',
          blocks: [
            { olist: [
              'LC 206 ki pointer movement visualizer me trace karo (Part 8).',
              'Iterative approach khud attempt karo — atko toh S-R-P-C yaad karo.',
              '<b>Har iteration draw karo</b> (10 → 20 → 30): prev, current, next ke boxes.',
              'Apne shabdon me likho: "original links kyun badal gaye?"',
            ] },
          ],
        },
        {
          title: 'Part 14 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 206 iteratively solve karo aur submit (Accepted).',
              '<b>Task B:</b> Teeno pointers ka role 30 sec me explain karo (record karo).',
              '<b>Task C:</b> O(n) time aur O(1) extra space ka reason bolo.',
              '<b>Task D:</b> Edge cases khud chalao: empty list, ek node, do nodes.',
            ] },
          ],
        },
        {
          title: 'Part 15 — Homework',
          blocks: [
            { list: [
              '<b>Dono:</b> Reversal algorithm pehle <b>plain English</b> me likho (code se pehle). Example: "Jab tak current hai: aage wala yaad rakho, current ka arrow peeche karo, prev aage, current aage. End me prev naya head."',
              'Kal (Day 31): iterative revision + <b>recursive reversal</b>.',
            ] },
          ],
        },
        {
          title: 'Part 16 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[1,2,3]</code> reverse?', '<code>[3,2,1]</code>'],
              ['4-step order?', 'Save next → Reverse link → Move prev → Move current.'],
              ['Iteration 1 ke baad (10→20→30) prev aur current?', 'prev = 10, current = 20.'],
              ['Traversal me current update bhoole toh?', 'Infinite loop.'],
              ['Iterative reverse ka space?', 'O(1).'],
            ] },
          ],
        },
      ],
      checks: [
        'Traversal ke 4 sawaal (head, null, next, update) ke jawab de sakta/sakti hu',
        'Reference vs value ka farak samjha',
        'S-R-P-C order zubaani yaad aur kyun',
        '10 → 20 → 30 ka har iteration draw kiya',
        'LC 206 iterative submit (Accepted)',
        'Edge cases: empty, 1, 2 nodes check kiye',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Save → Reverse → Prev → Current. Loop ke baad prev hi naya head.',
    },

    // =====================================================================
    // DAY 31
    3: {
      title: 'Reverse Linked List Mastery — Iterative + Recursive',
      goal: 'Iterative reversal <b>master</b> karna (pointer table bina dekhe) aur <b>recursive reversal</b> call stack ke saath samajhna — ratna nahi.',
      main: 206,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('Module 1: Iterative revision · Module 3: Recursion idea', 'Module 2: <code>1 → 2 → 3 → 4</code> table + har update ke baad list', 'Iterative + recursive dono saath me', 'Sohvi: LC 206 re-solve · Tum: dono implementations + comparison'),
            ...rev({
              h: 'LC 206 — Reverse Linked List (kal ka, iterative)',
              p: 'List ko ulta karo, links badal ke.',
              ex: '1 → 2 → 3 → null   →   3 → 2 → 1 → null',
              pat: 'Three pointers (prev / current / next)',
              steps: ['prev = null, current = head.', 'Save next, reverse link, move prev, move current.', 'return prev.'],
              code: ap(206, 1),
              hook: 'S-R-P-C. Naya head = prev.',
            }),
            ...rev({
              h: 'LC 209 — Minimum Size Subarray Sum',
              p: 'Sabse chhota continuous subarray jiska sum ≥ target. Nahi mila toh 0.',
              ex: 'nums = [2,3,1,2,4,3], target = 7\nwindow [4,3] → sum 7, length 2 → answer 2',
              pat: 'Variable sliding window (shrink while valid)',
              steps: ['right badhao, sum += nums[right].', 'Jab tak sum ≥ target: best = min(best, window length), phir left se nikaalo.', 'End me best (MAX_VALUE raha toh 0).'],
              code: `public int minSubArrayLen(int target, int[] nums) {
    int left = 0, sum = 0, best = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            best = Math.min(best, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }
    return best == Integer.MAX_VALUE ? 0 : best;
}`,
              hook: 'Valid hote hi sikodo — minimum chahiye.',
            }),
            ...rev({
              h: 'LC 424 — Longest Repeating Character Replacement',
              p: 'Max k characters badal ke sabse lamba same-letter substring.',
              ex: 's = "AABAB", k = 1\n"AABA" → B ko A banao → 4 same → answer 4',
              pat: 'Variable window — valid jab windowSize − maxFreq ≤ k',
              steps: ['right ka freq++, maxFreq update.', 'windowSize − maxFreq > k → left se shrink.', 'best = max(best, windowSize).'],
              code: `public int characterReplacement(String s, int k) {
    int[] freq = new int[26];
    int left = 0, maxFreq = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        maxFreq = Math.max(maxFreq, ++freq[s.charAt(right) - 'A']);
        while ((right - left + 1) - maxFreq > k) {
            freq[s.charAt(left) - 'A']--;
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
              hook: 'Window − sabse common letter = kitne badalne padenge. ≤ k toh theek.',
            }),
          ],
        },
        {
          title: 'Part 1 — Module 1: Iterative Reversal Revision (15 min)',
          blocks: [
            { pre: `prev = null
current = head

while current != null:
    next = current.next
    current.next = prev
    prev = current
    current = next

return prev` },
            { tip: '<b>Important:</b> Naya head <code>prev</code> hai, original <code>head</code> nahi. Original head ab <b>tail</b> hai (uska next null).' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 206 Reverse Linked List (dobara, gehraai se)', blocks: [{ problem: 206 }] },
        {
          title: 'Part 3 — Thinking: Iterative vs Recursive',
          blocks: [
            { p: '<b>Iterative:</b> Aage badhte hue har link ulta karo. 3 pointers, O(1) space.' },
            { p: '<b>Recursive soch:</b> "Agar <code>head.next</code> se aage ki list koi aur ulta kar de, toh mujhe sirf ek kaam karna hai — <code>head</code> ko us ulti list ke end me jodna." Wo "koi aur" = recursive call.' },
            { olist: [
              '<b>Base case:</b> list khaali ya ek node → wahi return (ulti karne ko kuch nahi).',
              '<b>Recursive call:</b> <code>newHead = reverseList(head.next)</code> — baaki list ulti, newHead = last node.',
              '<b>Unwinding (lautte waqt):</b> <code>head.next</code> abhi bhi purana agla node hai — jo ab ulti list ka tail hai. Usko head ki taraf mod do: <code>head.next.next = head</code>, aur <code>head.next = null</code>.',
            ] },
          ],
        },
        {
          title: 'Part 4 — Module 2: Dry Run — 1 → 2 → 3 → 4 (20 min)',
          blocks: [
            { table: { head: ['Step', 'Prev', 'Current', 'Next'], rows: [
              ['Initial', 'null', '1', '—'],
              ['1', '1', '2', '3'],
              ['2', '2', '3', '4'],
              ['3', '3', '4', 'null'],
              ['4', '4', 'null', '—'],
            ] } },
            { p: '(Har row = us iteration ke <b>baad</b> ki state; Next = agle iteration ka saved node.)' },
            { p: '<b>Har pointer update ke baad list:</b>' },
            { pre: `Initial:  null    1 → 2 → 3 → 4 → null
Step 1:   null ← 1     2 → 3 → 4 → null      prev=1, current=2
Step 2:   null ← 1 ← 2     3 → 4 → null      prev=2, current=3
Step 3:   null ← 1 ← 2 ← 3     4 → null      prev=3, current=4
Step 4:   null ← 1 ← 2 ← 3 ← 4               prev=4, current=null → return 4` },
          ],
        },
        {
          title: 'Part 5 — Module 3: Recursive Reversal + call stack (20 min)',
          blocks: [
            { pre: `1 → 2 → 3 → null

reverseList(1)
  reverseList(2)
    reverseList(3)        3.next == null → BASE CASE → return 3
  [lautte waqt, head = 2]  2.next = 3  →  3.next = 2 ; 2.next = null
                           list: 3 → 2 → null        return 3
[lautte waqt, head = 1]    1.next = 2  →  2.next = 1 ; 1.next = null
                           list: 3 → 2 → 1 → null    return 3` },
            { table: { head: ['Call stack frame', 'head', 'newHead (return)', 'Lautte waqt kaam'], rows: [
              ['reverseList(3)', '3', '3 (base case)', '—'],
              ['reverseList(2)', '2', '3', '3.next = 2; 2.next = null'],
              ['reverseList(1)', '1', '3', '2.next = 1; 1.next = null'],
            ] } },
            { tip: 'Recursion ratna nahi — <b>call stack draw karo</b>. Neeche jaate waqt kuch nahi badalta; saare links <b>lautte waqt</b> (unwinding) ulte hote hain. newHead har frame me same (last node) rehta hai.' },
          ],
        },
        {
          title: 'Part 6 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Iterative</b>' },
            { code: sol(206, 1) },
            { p: '<b>Recursive</b>' },
            { code: sol(206, 2) },
            { lines: [
              ['if (head == null || head.next == null)', 'Base case: 0 ya 1 node — already ulti.'],
              ['return head;', 'Ye last node hi poori ulti list ka naya head banega.'],
              ['ListNode newHead = reverseList(head.next);', 'Baaki list ulti karwao; newHead = last node (har level pe same).'],
              ['head.next.next = head;', 'Mera agla node (ab ulti list ka tail) ab mujhe point kare.'],
              ['head.next = null;', 'Mera purana forward link todo — warna 1 ⇄ 2 cycle.'],
              ['return newHead;', 'Naya head upar tak pass karo.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Visualize: iterative aur recursive dono',
          blocks: [
            { p: 'Pehla visualizer iterative, doosra recursive — recursive me <b>call stack</b> panel dekho: pehle frames upar chadte hain, phir lautte waqt links ulte hote hain.' },
            { viz: 206, ex: 0, variant: 0 },
            { viz: 206, ex: 0, variant: 1 },
          ],
        },
        {
          title: 'Part 8 — Edge cases',
          blocks: [
            { table: { head: ['Case', 'Iterative', 'Recursive'], rows: [
              ['<code>[]</code>', 'prev = null return', 'Base case: head == null → null'],
              ['<code>[1]</code>', '1 iteration', 'Base case: head.next == null → 1'],
              ['<code>[1,2]</code>', '<code>[2,1]</code>', '1 frame unwind: 2.next = 1, 1.next = null'],
              ['Bahut lambi list (10^5)', 'Theek', 'StackOverflowError ka risk (Java me tail-call optimization nahi)'],
            ] } },
            { tip: '<code>head.next = null</code> bhool gaye → 1 aur 2 ek doosre ko point karenge → cycle → print karte waqt infinite loop.' },
          ],
        },
        {
          title: 'Part 9 — Complexity: compare',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Extra Space'], rows: [
              ['Iterative', 'O(n)', 'O(1)'],
              ['Recursive', 'O(n)', 'O(n) call stack'],
            ] } },
            { p: 'Production me <b>iterative</b>. Recursive tab dikhao jab interviewer "recursively bhi kar sakte ho?" pooche.' },
          ],
        },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Iterative me naya head kaun?', '<code>prev</code>.'],
              ['Recursive ka base case?', '<code>head == null || head.next == null</code> → return head.'],
              ['<code>head.next.next = head</code> ka matlab?', 'Mera agla node ab mujhe point kare (arrow ulta).'],
              ['<code>head.next = null</code> kyun?', 'Purana forward link todne ke liye; warna 2-node cycle.'],
              ['Recursive ka space O(n) kyun?', 'Har node ke liye ek stack frame.'],
              ['Lambi list pe recursive ka risk?', 'StackOverflowError.'],
              ['newHead har frame me kya hota hai?', 'Same — original last node.'],
              ['Production me kaunsa aur kyun?', 'Iterative — O(1) space, stack overflow ka risk nahi.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Recursive reversal explain karo', 'The base case is an empty list or a single node, which is already reversed. Otherwise I recursively reverse everything after head; that call returns the new head, which is the original last node. When the call returns, head.next still points to the old second node, which is now the tail of the reversed part, so I set head.next.next = head to attach head after it, and head.next = null to cut the old forward link. Then I return the same new head. It is O(n) time and O(n) space for the call stack.'],
              ['Iterative vs Recursive', 'Both visit every node once, so both are O(n) time. The iterative version uses three pointers and O(1) extra space. The recursive version uses one stack frame per node, so O(n) space, and in Java a very long list can cause a StackOverflowError. I would ship the iterative one, but I like the recursive one for showing how the links are fixed while the calls unwind.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohvi session',
          blocks: [
            { olist: [
              'LC 206 <b>re-solve</b> — pehle bina notes attempt.',
              'Iterative approach apne shabdon me explain karo (S-R-P-C).',
              '1 → 2 → 3 → 4 ka table (Part 4) khud bharo.',
              'Recursion <b>conceptually</b> samjho: "pehle end tak jao, lautte waqt arrow ulta" — code yaad karna zaroori nahi.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Iterative reversal implement + submit.',
              '<b>Task B:</b> Recursive reversal implement + submit.',
              '<b>Task C:</b> Comparison table (time, extra space, risk) zubaani bolo.',
              '<b>Task D:</b> <code>[1,2,3]</code> ka recursive call stack paper pe draw karo — har frame ka head aur unwinding ka kaam.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Homework',
          blocks: [
            { list: [
              '<b>Tum:</b> Dono implementations <b>memory se</b> likho.',
              '<b>Sohvi:</b> Three-pointer pattern ek drawing se explain karo (har step ka box diagram).',
              'Kal (Day 32): Fast &amp; Slow pointers — LC 876 problem padh lo.',
            ] },
          ],
        },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>1 → 2 → 3 → 4</code>: step 2 ke baad prev, current?', 'prev = 2, current = 3.'],
              ['Recursive ki 2 unwinding lines?', '<code>head.next.next = head; head.next = null;</code>'],
              ['Recursive extra space?', 'O(n) call stack.'],
              ['Iterative extra space?', 'O(1).'],
              ['Naya head iterative me?', 'prev.'],
            ] },
          ],
        },
      ],
      checks: [
        'Iterative pseudocode bina dekhe likha',
        '1 → 2 → 3 → 4 ka Prev/Current/Next table khud bhara',
        'Recursive call stack draw kiya (base case + unwinding)',
        'Sohvi: LC 206 re-solve (iterative)',
        'Tum: iterative + recursive dono Accepted',
        'Iterative vs Recursive comparison zubaani',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Iterative: aage badhte hue ulta. Recursive: end tak jao, lautte hue ulta — head.next.next = head; head.next = null.',
    },

    // =====================================================================
    // DAY 32
    4: {
      title: 'Fast & Slow Pointer Pattern — Middle Node',
      goal: 'Seekhna ki do pointers <b>alag speed</b> se kaise chalte hain (slow 1, fast 2) aur isse <b>LC 876</b> — middle node — ek pass me kaise milta hai. Cycle detection ka intuition (full Week 6 me).',
      main: 876,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('Module 1: Fast/slow theory + applications', 'Module 2: odd/even middle table · Module 3: cycle intuition', 'LC 876 slow/fast saath me', 'Sohvi: odd/even dry run + code · Tum: two-pass vs one-pass compare'),
            ...rev({
              h: 'LC 206 — Reverse Linked List (kal ka, recursive)',
              p: 'List ulti karo — recursion se.',
              ex: '1 → 2 → 3 → null   →   3 → 2 → 1 → null',
              pat: 'Recursion: base case + unwinding',
              steps: ['0/1 node → return head.', 'newHead = reverseList(head.next).', 'head.next.next = head; head.next = null; return newHead.'],
              code: ap(206, 2),
              hook: 'End tak jao, lautte hue arrow ulta.',
            }),
            ...rev({
              h: 'LC 167 — Two Sum II (sorted array)',
              p: 'Sorted array me do numbers jinka sum target ho — 1-indexed positions.',
              ex: 'numbers = [2,7,11,15], target = 9 → [1,2]',
              pat: 'Two pointers (opposite)',
              steps: ['l = 0, r = n − 1.', 'sum == target → return; sum < target → l++; warna r−−.'],
              code: `public int[] twoSum(int[] numbers, int target) {
    int l = 0, r = numbers.length - 1;
    while (l < r) {
        int sum = numbers[l] + numbers[r];
        if (sum == target) return new int[]{l + 1, r + 1};
        if (sum < target) l++;
        else r--;
    }
    return new int[]{-1, -1};
}`,
              hook: 'Sorted = do sire se. Chhota sum → left badhao. (Aaj bhi do pointers — par same direction, alag speed.)',
            }),
            ...rev({
              h: 'LC 1 — Two Sum',
              p: 'Unsorted array me do indices jinka sum target.',
              ex: 'nums = [2,7,11,15], target = 9 → [0,1]',
              pat: 'HashMap (value → index)',
              steps: ['need = target − nums[i].', 'map me need hai → answer.', 'Warna put(nums[i], i).'],
              code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (map.containsKey(need)) return new int[]{map.get(need), i};
        map.put(nums[i], i);
    }
    return new int[]{-1, -1};
}`,
              hook: 'Pehle check, phir put.',
            }),
          ],
        },
        {
          title: 'Part 1 — Module 1: Fast and Slow Pointer Theory (20 min)',
          blocks: [
            { pre: `slow = head
fast = head

Movement (har iteration):
slow = slow.next          // 1 step
fast = fast.next.next     // 2 steps` },
            { p: 'Fast hamesha slow se <b>double</b> distance chalta hai. Jab fast end pe pahunchta hai, slow ne <b>aadha</b> raasta tay kiya hota hai.' },
            { table: { head: ['Application', 'Idea', 'Kab'], rows: [
              ['Find middle node', 'Fast end pe → slow beech me', 'Aaj — LC 876'],
              ['Detect cycle', 'Loop me fast ghoom ke slow ko pakad leta hai', 'Week 6 — LC 141'],
              ['Cycle starting point', 'Meet ke baad ek pointer head pe, dono 1-1 step', 'Week 6 — LC 142'],
              ['Midpoint for splitting', 'List ko do halves me todna', 'Week 6 — LC 143'],
            ] } },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 876 Middle of the Linked List', blocks: [{ problem: 876 }] },
        {
          title: 'Part 3 — Thinking: Brute (two-pass) → Optimal (one-pass)',
          blocks: [
            { p: '<b>Brute (count + walk):</b> Pehla pass — nodes gino (<code>count</code>). Doosra pass — head se <code>count / 2</code> steps chalo. Even me <code>count / 2</code> seedha second middle deta hai (6 / 2 = 3 steps → 4th node).' },
            { p: '<b>Kya improve ho sakta hai?</b> List do baar chal rahe hain. Agar ek pointer double speed se chale, toh pehle wala pointer ek hi pass me middle pe hoga — count karne ki zaroorat nahi.' },
            { olist: [
              '<code>slow = head, fast = head</code>.',
              'Jab tak <code>fast != null &amp;&amp; fast.next != null</code>: slow 1 step, fast 2 step.',
              'Loop ruka → <code>return slow</code>.',
            ] },
            { tip: 'Condition ka order: pehle <code>fast != null</code>, phir <code>fast.next != null</code>. Java ka <code>&amp;&amp;</code> short-circuit karta hai — pehla false toh doosra check hi nahi hota → koi NullPointerException nahi.' },
          ],
        },
        {
          title: 'Part 4 — Module 2: Middle Node Logic — dry run (15 min)',
          blocks: [
            { p: '<b>Odd:</b> <code>1 → 2 → 3 → 4 → 5 → null</code>' },
            { table: { head: ['Iteration', 'Slow', 'Fast', 'Loop chalega?'], rows: [
              ['Start', '1', '1', '1 aur 1.next (2) non-null → haan'],
              ['1', '2', '3', '3 aur 4 → haan'],
              ['2', '3', '5', '5.next = null → <b>nahi</b>'],
            ] } },
            { p: 'Fast end (5) pe → slow = <b>3</b> = middle → output <code>[3,4,5]</code>.' },
            { p: '<b>Even:</b> <code>1 → 2 → 3 → 4 → null</code>' },
            { table: { head: ['Iteration', 'Slow', 'Fast', 'Loop chalega?'], rows: [
              ['Start', '1', '1', 'haan'],
              ['1', '2', '3', '3 aur 4 → haan'],
              ['2', '3', 'null', 'fast == null → <b>nahi</b>'],
            ] } },
            { p: 'Is loop condition ke saath slow <b>second middle</b> (3) return karta hai → <code>[3,4]</code>. LeetCode bhi yahi maangta hai.' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — two-pass (count + walk)</b>' },
            { code: sol(876, 0) },
            { p: '<b>Optimal — slow / fast (one pass)</b>' },
            { code: sol(876, 1) },
            { lines: [
              ['ListNode slow = head, fast = head;', 'Dono start pe (constraint: kam se kam 1 node).'],
              ['while (fast != null && fast.next != null)', 'Even me fast null pe rukta hai, odd me last node pe (fast.next null).'],
              ['slow = slow.next;', 'Slow 1 step.'],
              ['fast = fast.next.next;', 'Fast 2 step — loop condition guarantee deti hai ki fast.next null nahi.'],
              ['return slow;', 'Fast ne poori list, slow ne aadhi → middle.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize: slow/fast vs count + walk',
          blocks: [
            { list: [
              '<b>Slow / Fast</b> tab: <b>slow</b> aur <b>fast</b> labels — fast ek baar me 2 node koodta hai.',
              'Example 2 (6 nodes) me fast <code>null</code> chip ban jaata hai — tab loop rukta hai.',
              '<b>Count + Walk</b> tab: do loops — pehle poori list ginti, phir aadhi chalna. Steps compare karo.',
            ] },
            { viz: 876, ex: 0, variant: 0 },
            { viz: 876, ex: 1, variant: 1 },
          ],
        },
        {
          title: 'Part 7 — Module 3: Cycle Detection Intuition (10 min)',
          blocks: [
            { pre: `1 → 2 → 3 → 4 → 5
          ↑         |
          └─────────┘      (5.next = 3)  → ye cycle hai` },
            { list: [
              '<b>Cycle kya hai?</b> Kisi node ka <code>next</code> wapas kisi pichle node ko point kare.',
              '<b>Normal traversal kabhi khatam kyun nahi hota?</b> <code>null</code> kabhi aata hi nahi — <code>while (current != null)</code> hamesha true.',
              '<b>Fast aur slow kyun milte hain?</b> Gol track pe do runners — tez wala ek chakkar lagaa ke peeche se aa ke dheere wale ko pakad leta hai. Har step pe gap 1 kam hota hai, isliye kood ke aage nahi nikal sakta.',
            ] },
            { tip: 'Full cycle detection (LC 141, LC 142) <b>Week 6</b> me. Aaj sirf intuition.' },
          ],
        },
        {
          title: 'Part 8 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[1]</code>', '<code>[1]</code>', 'fast.next = null → loop nahi chala, slow = head'],
              ['<code>[1,2]</code>', '<code>[2]</code>', 'Even → second middle; 1 step ke baad fast = null'],
              ['<code>[1,2,3]</code>', '<code>[2,3]</code>', 'Odd → exact middle'],
              ['<code>[1..6]</code>', '<code>[4,5,6]</code>', 'Second middle'],
            ] } },
            { p: '<b>First middle</b> chahiye (Week 6 me list split karte waqt): condition <code>fast.next != null &amp;&amp; fast.next.next != null</code>.' },
          ],
        },
        {
          title: 'Part 9 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space', 'Passes'], rows: [
              ['Two-pass (count + walk)', 'O(n)', 'O(1)', '~1.5 pass'],
              ['Slow / Fast', 'O(n)', 'O(1)', '1 pass'],
            ] } },
            { p: '<b>O(n) kyun?</b> Fast ~n/2 iterations me end pe pahunchta hai; har iteration O(1) kaam → O(n). Dono O(n) hain — fark sirf passes ka hai; interviewer "one pass" bole tab slow/fast.' },
          ],
        },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Slow/fast ki speed?', 'Slow 1 step, fast 2 step.'],
              ['Loop condition?', '<code>fast != null &amp;&amp; fast.next != null</code>'],
              ['Condition ka order ulta likha toh?', 'fast null ho toh <code>fast.next</code> pe NullPointerException.'],
              ['Even length me kaunsa middle?', 'Second middle.'],
              ['First middle kaise?', '<code>fast.next != null &amp;&amp; fast.next.next != null</code>'],
              ['Brute me middle index?', '<code>count / 2</code> (0-based).'],
              ['Slow/fast ke aur kya use?', 'Cycle detect, cycle start, list split karna.'],
              ['Cycle me normal traversal kyun atakta hai?', 'null kabhi nahi aata → infinite loop.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach (Brute → Optimal)', 'A simple way is two passes: count the nodes, then walk count / 2 steps from head, which gives the second middle for even lengths. To do it in one pass, I use slow and fast pointers starting at head. Slow moves one step and fast moves two. When fast cannot move two more steps, slow has covered exactly half the list. The condition fast != null && fast.next != null handles both odd and even lengths. It is O(n) time and O(1) space.'],
              ['Why is it O(n) if fast jumps two nodes?', 'Fast reaches the end after about n / 2 iterations, and each iteration does constant work, so the total is O(n). It is still linear; the gain over the two-pass version is one pass instead of one and a half, and no counter.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohvi session',
          blocks: [
            { olist: [
              'LC 876 — <b>odd aur even dono</b> length ka dry run table banao.',
              'Fast/slow pointers implement karo aur submit.',
              'Loop condition apne shabdon me explain karo: "fast null pe ya last node pe ruk jaata hai".',
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 876 implement — <b>pehle nodes gine bina</b> (slow/fast). Submit.',
              '<b>Task B:</b> Algorithm O(n) kyun hai — explain karo.',
              '<b>Task C:</b> Two-pass counting approach se compare karo (passes, code length, kab kaunsa).',
              '<b>Task D:</b> First-middle version likho aur <code>[1,2,3,4]</code> pe dry run (answer 2).',
            ] },
          ],
        },
        {
          title: 'Part 14 — Homework',
          blocks: [
            { list: [
              '<b>Dono:</b> Length <b>1 se 6</b> tak ki lists ke liye fast/slow movement draw karo. Neeche apna answer check karo.',
              'Kal (Day 33): Merge Two Sorted Lists — dummy node.',
            ] },
            { qa: [
              ['Lengths 1–6 me slow kahan rukta hai? (check karo)', '1 → 1 · 2 → 2 · 3 → 2 · 4 → 3 · 5 → 3 · 6 → 4 (hamesha <code>n / 2 + 1</code>-th node).'],
            ] },
          ],
        },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[1,2,3,4]</code> ka middle (LC 876)?', '3 → <code>[3,4]</code>.'],
              ['<code>[1,2,3,4,5,6,7]</code> ka middle?', '4.'],
              ['Fast ek iteration me kitne node?', '2.'],
              ['Two-pass vs one-pass complexity?', 'Dono O(n) time, O(1) space.'],
              ['Cycle wali list me <code>while (cur != null)</code>?', 'Kabhi khatam nahi hoga.'],
            ] },
          ],
        },
      ],
      checks: [
        'Slow/fast movement aur 4 applications bata sakta/sakti hu',
        'Odd aur even dono ka dry-run table banaya',
        'LC 876 slow/fast submit (Accepted)',
        'Tum: two-pass vs one-pass compare kiya',
        'Cycle intuition (gol track) samjha',
        'Lengths 1–6 ka homework drawing',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Fast do kadam, slow ek kadam — fast end pe, slow beech me.',
    },

    // =====================================================================
    // DAY 33
    5: {
      title: 'Merge Two Sorted Linked Lists — Dummy Node',
      goal: 'Do sorted lists ko <b>pointer manipulation</b> se jodna (naye nodes banaye bina) aur <b>dummy node</b> pattern samajhna — LC 21.',
      main: 21,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('Module 1: Merge pattern · Module 2: Dummy node kyun', 'Module 3: <code>[1,2,4] + [1,3,4]</code> dry run (list1, list2, tail)', 'LC 21 iterative saath me', 'Sohvi: guidance ke saath solve · Tum: bina hints + complexity'),
            ...rev({
              h: 'LC 876 — Middle of the Linked List (kal ka)',
              p: 'Middle node return karo (even me second).',
              ex: '1→2→3→4→5 → 3     1→2→3→4→5→6 → 4',
              pat: 'Slow / fast',
              steps: ['slow = fast = head.', 'fast != null && fast.next != null tak: slow 1, fast 2.', 'return slow.'],
              code: ap(876, 1),
              hook: 'Fast do kadam, slow ek — fast end pe, slow beech me.',
            }),
            ...rev({
              h: 'LC 217 — Contains Duplicate',
              p: 'Koi value do baar aayi?',
              ex: '[1,2,3,1] → true',
              pat: 'HashSet (seen)',
              steps: ['Har x ko set me add.', 'add() false de → pehle dekha tha → true.'],
              code: `public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
        if (!seen.add(x)) return true;
    }
    return false;
}`,
              hook: '"Pehle dekha?" = HashSet.',
            }),
            ...rev({
              h: 'LC 283 — Move Zeroes',
              p: 'Saare 0 end me, baaki ka order same, in-place.',
              ex: '[0,1,0,3,12] → [1,3,12,0,0]',
              pat: 'Read / write pointers (same direction)',
              steps: ['k = next non-zero ki jagah.', 'nums[i] != 0 → swap(i, k), k++.'],
              code: `public void moveZeroes(int[] nums) {
    int k = 0;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            int t = nums[k]; nums[k] = nums[i]; nums[i] = t;
            k++;
        }
    }
}`,
              hook: 'Non-zero ko aage bhejo, zero khud peeche chale jaate hain. (Aaj bhi "write" pointer = tail.)',
            }),
          ],
        },
        {
          title: 'Part 1 — Module 1: Merge Pattern (20 min)',
          blocks: [
            { pre: `List 1: 1 → 3 → 5
List 2: 2 → 4 → 6

Output: 1 → 2 → 3 → 4 → 5 → 6` },
            { olist: [
              '<b>Compare</b> dono lists ke current nodes.',
              '<b>Select</b> chhota node — result ke end me jodo.',
              '<b>Move</b> usi list ka pointer aage.',
              'Ek list khatam → <b>bachi hui list seedha attach</b> (woh already sorted hai).',
            ] },
            { tip: 'Ye wahi merge hai jo merge sort me arrays ke saath karte ho — bas yahan naye nodes nahi banate, existing nodes ke <code>next</code> jodte hain.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 21 Merge Two Sorted Lists', blocks: [{ problem: 21 }] },
        {
          title: 'Part 3 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute:</b> Dono lists ki saari values ek ArrayList me, sort, phir naye nodes bana ke list. O((m+n) log(m+n)) time, O(m+n) space — aur sorted hone ka fayda hi nahi uthaya.' },
            { p: '<b>Observation:</b> Dono lists already sorted hain → result ka agla node hamesha dono heads me se <b>chhota</b> hoga. Ek comparison me ek node final.' },
            { p: '<b>Optimal:</b> Dummy node + <code>tail</code>. Har step chhota node <code>tail.next</code> pe jodo. O(m + n) time, O(1) extra space.' },
            { p: '<b>Recursive version (Tum ke liye bonus):</b> chhota head chuno, uska next = baaki dono ka merge. O(m + n) stack space.' },
          ],
        },
        {
          title: 'Part 4 — Module 2: Dummy Node Pattern (15 min)',
          blocks: [
            { table: { head: ['Bina dummy', 'Dummy ke saath'], rows: [
              ['Pehla node special: dono me se chhota head banao', 'Pehla node bhi baaki jaisa: <code>tail.next = node</code>'],
              ['Empty list ka alag if-check', 'Loop chalta hi nahi; <code>tail.next = bachi list</code>'],
              ['Zyada if-else, zyada bugs', 'Ek hi rule har node ke liye'],
            ] } },
            { pre: `dummy → ?
tail = dummy

Har chuna hua node:  tail.next = node;  tail = tail.next;

Return:  dummy.next      (dummy khud answer ka hissa nahi)` },
          ],
        },
        {
          title: 'Part 5 — Module 3: Dry Run — [1,2,4] + [1,3,4] (15 min)',
          blocks: [
            { table: { head: ['Step', 'list1 (pehle)', 'list2 (pehle)', 'Compare', 'Selected node (= naya tail)', 'Pointer move', 'Result (dummy.next se)'], rows: [
              ['start', '1', '1', '—', '— (tail = dummy)', '—', '—'],
              ['1', '1', '1', '1 ≤ 1', '1ᴬ', 'list1 → 2', '1'],
              ['2', '2', '1', '2 &gt; 1', '1ᴮ', 'list2 → 3', '1 → 1'],
              ['3', '2', '3', '2 ≤ 3', '2ᴬ', 'list1 → 4', '1 → 1 → 2'],
              ['4', '4', '3', '4 &gt; 3', '3ᴮ', 'list2 → 4', '1 → 1 → 2 → 3'],
              ['5', '4', '4', '4 ≤ 4', '4ᴬ', 'list1 → null', '1 → 1 → 2 → 3 → 4'],
              ['end', 'null', '4', 'list1 khatam → loop band', '<code>tail.next = list2</code> (4ᴮ)', '—', '1 → 1 → 2 → 3 → 4 → 4'],
            ] } },
            { p: '(ᴬ = list1 ka node, ᴮ = list2 ka node. Barabar values pe <code>&lt;=</code> se list1 pehle — stable.)' },
            { tip: '<b>Bachi list seedha kyun attach?</b> Woh already sorted hai aur uske saare values ab tak chune gaye sabse bade node se ≥ hain. Ek-ek karke jodne ki zaroorat nahi — ek <code>tail.next = list2</code> kaafi.' },
          ],
        },
        {
          title: 'Part 6 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Optimal — iterative + dummy</b>' },
            { code: sol(21, 1) },
            { lines: [
              ['ListNode dummy = new ListNode(0);', 'Nakli shuruaat — head ka special case khatam.'],
              ['ListNode tail = dummy;', 'Result ka last node; yahin naye nodes judte hain.'],
              ['while (list1 != null && list2 != null)', 'Dono me node bache hain tab tak compare.'],
              ['if (list1.val <= list2.val)', 'Chhota (ya barabar) list1 me → wahi chuno.'],
              ['tail.next = list1; list1 = list1.next;', 'Node jodo, us list ka pointer aage.'],
              ['tail = tail.next;', 'tail naye last node pe.'],
              ['tail.next = (list1 != null) ? list1 : list2;', 'Bachi hui list ek baar me attach.'],
              ['return dummy.next;', 'Asli head — dummy ke baad wala node.'],
            ] },
            { p: '<b>Recursive (Tum — bonus)</b>' },
            { code: sol(21, 2) },
          ],
        },
        {
          title: 'Part 7 — Visualize',
          blocks: [
            { list: ['<b>list1</b>, <b>list2</b>, <b>tail</b> labels dekho — har step ek node result me judta hai.', 'Last step me bachi list ek saath judti hai.', 'Example 3 (<code>[] + [0]</code>) — loop chalta hi nahi.'] },
            { viz: 21, ex: 0 },
          ],
        },
        {
          title: 'Part 7b — ⌨️ Typing practice: Brute → Optimal',
          blocks: [
            { p: 'TypingClub jaisa test: code <b>bina dekhe yaad</b> hone ke liye haath se type karo. Indent apne aap aata hai, line ke end pe <b>Enter</b>. Galat key → laal, sahi key dabane tak cursor wahin. Gray <code>// …</code> sirf samajhne ke liye hai — use type nahi karna. Declarations ka warm-up (dummy, tail, ArrayList, Collections.sort): <a href="#/linked-list/fundamentals/warmup">Fundamentals → Warm-up</a>.' },
            { typing: { q: 21, items: [
              { label: '1 · Brute', ap: 0, notes: [
                'method signature',
                'saari values ki list',
                'list1 ki values daalo',
                'list2 ki values daalo',
                'sort — O((n+m) log(n+m))',
                'dummy + tail ek saath',
                'har value ke liye',
                'naya node jodo',
                'tail aage',
                '',
                'asli head',
                '',
              ] },
              { label: '2 · Optimal', ap: 1, notes: [
                'method signature',
                'dummy node',
                'tail = result ka last',
                'jab tak dono me node hai',
                'list1 chhota (ya barabar — stable)',
                'list1 ka node jodo',
                'list1 aage',
                'warna list2',
                'list2 ka node jodo',
                'list2 aage',
                '',
                'tail aage',
                '',
                'bachi list ek saath attach',
                'asli head',
                '',
              ] },
            ] } },
          ],
        },
        {
          title: 'Part 8 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>[] + []</code>', '<code>[]</code>', 'Loop nahi; tail.next = null; dummy.next = null'],
              ['<code>[] + [0]</code>', '<code>[0]</code>', 'Seedha list2 attach'],
              ['<code>[1,2,3] + [4,5]</code>', '<code>[1..5]</code>', 'list1 pehle khatam, [4,5] ek baar me attach'],
              ['Duplicate values', 'Dono rehte hain', '<code>&lt;=</code> se list1 pehle'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Auxiliary space'], rows: [
              ['Brute (collect + sort)', 'O((n+m) log(n+m))', 'O(n+m)'],
              ['Iterative + dummy', 'O(n + m)', 'O(1) — sirf dummy + tail'],
              ['Recursive', 'O(n + m)', 'O(n + m) call stack'],
            ] } },
            { p: '<b>O(n + m) kyun?</b> Har comparison ek node ko final jagah pe bhejta hai; total n + m nodes. <b>O(1) auxiliary kyun?</b> Naye nodes nahi banaye — existing nodes ke links joda.' },
          ],
        },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Dummy node kyun?', 'Pehle node ka special case khatam; empty list bhi automatically handle.'],
              ['Return kya?', '<code>dummy.next</code>.'],
              ['Loop ke baad kya?', 'Bachi list <code>tail.next</code> pe attach.'],
              ['Bachi list ek-ek karke kyun nahi?', 'Already sorted aur sab bade — ek link kaafi.'],
              ['<code>&lt;</code> ki jagah <code>&lt;=</code> kyun?', 'Barabar values me list1 pehle — stable merge (dono chalte hain).'],
              ['Naye nodes banaye?', 'Nahi (sirf dummy) — O(1) auxiliary space.'],
              ['Time?', 'O(n + m).'],
              ['Recursive ka base case?', 'Koi list null → doosri return.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach', 'Both lists are sorted, so the next node of the answer is always the smaller of the two current heads. I create a dummy node and a tail pointer. While both lists are non-empty, I attach the smaller node to tail.next, advance that list, and move tail. When one list runs out, I attach the rest of the other list in one step, because it is already sorted. I return dummy.next. That is O(n + m) time and O(1) auxiliary space, since I only relink existing nodes.'],
              ['Why a dummy node?', 'Without it, choosing the first node of the result is a special case and I need extra checks for empty lists. With a dummy, every node, including the first, is attached the same way through tail.next, and at the end I simply return dummy.next.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohvi session',
          blocks: [
            { olist: [
              'Dummy node ka diagram banao: <code>dummy → ?</code>, <code>tail = dummy</code>.',
              'LC 21 guidance ke saath solve karo (Part 5 ka table follow karke).',
              'Explain karo: "remaining list ko directly attach kyun kar sakte hain?"',
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 21 <b>bina hints</b> solve + submit.',
              '<b>Task B:</b> O(n + m) time explain karo.',
              '<b>Task C:</b> Iterative merging ka O(1) auxiliary space explain karo (aur recursive ka O(n + m) kyun).',
              '<b>Task D (bonus):</b> Recursive version likho.',
            ] },
          ],
        },
        {
          title: 'Part 14 — Homework',
          blocks: [
            { list: [
              '<b>Dono:</b> Do lists paper pe <b>manually merge</b> karo — <code>[1,3,5] + [2,4,6]</code> aur <code>[5] + [1,2,3]</code>. Har step me tail kahan hai likho.',
              'Kal (Day 34, Saturday): Pattern revision — 206, 876, 21 re-solve.',
            ] },
          ],
        },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[1,3,5] + [2,4,6]</code>?', '<code>[1,2,3,4,5,6]</code>'],
              ['<code>[5] + [1,2,3]</code> me loop kitni baar?', '3 baar (1, 2, 3 list2 se), phir [5] attach.'],
              ['Dummy ke saath return?', '<code>dummy.next</code>'],
              ['Iterative auxiliary space?', 'O(1).'],
              ['Bachi list attach ki line?', '<code>tail.next = (list1 != null) ? list1 : list2;</code>'],
            ] },
          ],
        },
      ],
      checks: [
        'Merge pattern ke 4 steps bata sakta/sakti hu',
        'Dummy node kyun — bina dummy vs dummy farak',
        '[1,2,4] + [1,3,4] ka list1/list2/tail table khud bhara',
        'LC 21 submit (Accepted)',
        'Tum: O(n + m) time aur O(1) auxiliary space explain kiya',
        'Paper pe 2 manual merges kiye',
        '8 interview sawaal bina dekhe',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Dummy se shuru, chhota jodo, bacha hua seedha jodo, dummy.next lautao.',
    },

    // =====================================================================
    // DAY 34 (Saturday)
    6: {
      title: 'Linked List Pattern Revision — Reverse, Middle, Merge',
      goal: 'Bina topic bataye <b>sahi pattern pehchanna</b>. 206, 876, 21 re-solve — pehle khud attempt, phir notes.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan',
          blocks: [
            { p: RULE },
            session('Module 1: Pattern recognition table', 'Module 2: Dry run challenge (bina code)', 'LC 206 → 876 → 21 re-solve', 'Tum: har question ke 5 points · Sohvi: har question attempt'),
            { list: ['Rule 1: pehle paper pe nodes + pointers draw, phir code.', 'Rule 2: code ke baad edge cases (null, 1 node, 2 nodes) zubaani.', 'Rule 3: atak gaye toh sirf Memory hook dekho, code nahi.'] },
          ],
        },
        {
          title: 'Part 1 — Module 1: Pattern Recognition (20 min)',
          blocks: [
            { table: { head: ['Problem Type', 'Pattern', 'Signal / keyword'], rows: [
              ['Reverse a list', 'Three pointers', '"reverse", "ulta order"'],
              ['Find middle', 'Fast &amp; Slow', '"middle", "half", "split into two"'],
              ['Merge sorted lists', 'Dummy Node', '"merge", "naya list banao", head badal sakta hai'],
              ['Print / count nodes', 'Traversal', '"print", "count", "search"'],
              ['Detect cycle', 'Fast &amp; Slow', '"cycle", "loop" (Week 6)'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Module 2: Dry Run Challenge (20 min) — bina code',
          blocks: [
            { olist: [
              'Reverse <code>1 → 2 → 3 → 4</code> (prev/current/next har step).',
              'Middle of <code>1 → 2 → 3 → 4 → 5</code> (slow/fast har step).',
              'Merge <code>1 → 3 → 5</code> and <code>2 → 4 → 6</code> (list1/list2/tail har step).',
            ] },
            { qa: [
              ['Challenge 1 ka answer?', 'prev: null → 1 → 2 → 3 → 4; current: 1 → 2 → 3 → 4 → null. Result <code>4 → 3 → 2 → 1 → null</code>.'],
              ['Challenge 2 ka answer?', '(slow, fast): (1,1) → (2,3) → (3,5); 5.next null → stop. Middle = 3.'],
              ['Challenge 3 ka answer?', 'Chune gaye: 1ᴬ, 2ᴮ, 3ᴬ, 4ᴮ, 5ᴬ → list1 khatam → 6 attach. Result <code>1 → 2 → 3 → 4 → 5 → 6</code>.'],
            ] },
          ],
        },
        {
          title: 'Part 3 — Re-solve: LC 206 Reverse Linked List',
          blocks: [
            { p: '<b>Pattern:</b> three pointers. Iterative O(1), recursive O(n) stack.' },
            { pre: 'null ← 1 ← 2 ← 3 ← 4   (prev = 4 → return)' },
            { code: ap(206, 1) },
            { code: ap(206, 2) },
            { tip: 'Memory hook: S-R-P-C. Recursive — end tak jao, lautte hue ulta.' },
            { viz: 206, ex: 0 },
          ],
        },
        {
          title: 'Part 4 — Re-solve: LC 876 Middle of the Linked List',
          blocks: [
            { p: '<b>Pattern:</b> slow / fast. Even me second middle.' },
            { pre: '1 → 2 → 3 → 4 → 5 → 6     slow: 1,2,3,4   fast: 1,3,5,null → 4' },
            { code: ap(876, 1) },
            { tip: 'Memory hook: fast do kadam, slow ek — fast end pe, slow beech me.' },
          ],
        },
        {
          title: 'Part 5 — Re-solve: LC 21 Merge Two Sorted Lists',
          blocks: [
            { p: '<b>Pattern:</b> dummy + tail.' },
            { pre: '[1,2,4] + [1,3,4] → 1ᴬ 1ᴮ 2 3 4ᴬ | bacha [4] → [1,1,2,3,4,4]' },
            { code: ap(21, 1) },
            { tip: 'Memory hook: dummy se shuru, chhota jodo, bacha hua seedha jodo.' },
          ],
        },
        {
          title: 'Part 6 — Tum: har question ke 5 points',
          blocks: [
            { table: { head: ['', 'LC 206', 'LC 876', 'LC 21'], rows: [
              ['Pattern', 'Three pointers', 'Fast &amp; slow', 'Dummy node'],
              ['Brute force', 'Values ArrayList me, ulta likho — O(n) space', 'Count, phir count/2 chalo — 2 pass', 'Saari values collect + sort — O((n+m) log)'],
              ['Optimal', 'prev/current/next in-place', 'Slow 1, fast 2 — 1 pass', 'Dummy + tail, chhota jodo'],
              ['Pointer movement', 'Save → Reverse → Prev → Current', 'slow = slow.next; fast = fast.next.next', 'tail.next = chhota; us list aage; tail aage'],
              ['Complexity', 'O(n) / O(1) (recursive O(n) stack)', 'O(n) / O(1)', 'O(n + m) / O(1)'],
            ] } },
          ],
        },
        {
          title: 'Part 7 — Interview mix',
          blocks: [
            { qa: [
              ['Reverse me <code>next</code> save na kiya toh?', 'Aage ki list ka reference kho jaayega.'],
              ['Middle aur cycle dono me loop condition same kyun?', 'Dono me fast 2 step chalta hai — fast aur fast.next null nahi hone chahiye.'],
              ['Merge me dummy na ho toh?', 'Pehla node special case + empty lists ke alag checks.'],
              ['Recursive reverse ka risk?', 'O(n) stack — lambi list pe StackOverflowError.'],
              ['"Count nodes" kaunsa pattern?', 'Simple traversal — head se null tak.'],
              ['Kaunse 3 edge cases har LL problem me?', 'Empty, 1 node, 2 nodes.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — 1-minute answers: aise bolo',
          blocks: [
            { say: [
              ['Reverse', 'Three pointers: prev starts at null, current at head. Save next, point current back to prev, advance prev and current. When current is null, prev is the new head. O(n) time, O(1) space.'],
              ['Middle', 'Slow moves one step and fast two. When fast cannot move two more, slow is at the middle; for even length it is the second middle. One pass, O(1) space.'],
              ['Merge', 'Dummy node plus tail. Attach the smaller front node, advance that list, and attach the leftover list at the end. O(n + m) time, O(1) auxiliary space.'],
            ] },
          ],
        },
        {
          title: 'Part 9 — Sohvi session',
          blocks: [
            { olist: [
              'Re-solve: <b>LC 206</b>, <b>LC 876</b>, <b>LC 21</b>.',
              'Har ek ko notes dekhne se <b>pehle attempt</b> karo (15 min timer).',
              'Dry run challenge (Part 2) khud karo, phir answers kholo.',
              'Jo atka — uska Memory hook 3 baar likho.',
            ] },
          ],
        },
        {
          title: 'Part 10 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 206, 876, 21 re-solve (timer: 10 / 10 / 15 min).',
              '<b>Task B:</b> Har ek ke liye bolo: pattern, brute force, optimal, pointer movement, complexity (Part 6 table bina dekhe).',
              '<b>Task C:</b> LC 206 recursive bhi memory se.',
            ] },
          ],
        },
        {
          title: 'Part 11 — Homework: one-page Linked List pattern sheet',
          blocks: [
            { pre: `LINKED LIST PATTERN SHEET (apne haath se)
-----------------------------------------
Traversal      : current = head; while (current != null) ... current = current.next
Reverse        : prev=null, cur=head | S-R-P-C | return prev
Middle         : slow=fast=head | while (fast != null && fast.next != null) | return slow
Merge          : dummy, tail | chhota jodo | tail.next = bachi | return dummy.next
Edge cases     : empty, 1 node, 2 nodes, head change
Common bugs    : next save nahi, fast.next.next pe NPE, head return (prev chahiye)` },
            { list: ['Kal (Day 35, Sunday): Mock interview — 206, 876, 21 (bina hints).'] },
          ],
        },
        {
          title: 'Part 12 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[1,2,3]</code> reverse?', '<code>[3,2,1]</code>'],
              ['<code>[1,2,3,4]</code> middle?', '3'],
              ['<code>[] + [0]</code> merge?', '<code>[0]</code>'],
              ['"Find middle" ka pattern?', 'Fast &amp; slow.'],
              ['"Merge sorted" ka pattern?', 'Dummy node.'],
            ] },
          ],
        },
      ],
      checks: [
        'Pattern recognition table bina dekhe',
        'Dry run challenge ke 3 traces bina code',
        'LC 206 re-solve (pehle attempt, phir notes)',
        'LC 876 re-solve',
        'LC 21 re-solve',
        'Tum: har question ke 5 points zubaani',
        'One-page pattern sheet banayi',
      ],
      memory: 'Ulta = 3 pointers, beech = fast/slow, jodna = dummy, ginna = traversal.',
    },

    // =====================================================================
    // DAY 35 (Sunday)
    7: {
      title: 'Linked List Mock Interview — 206, 876, 21 + Contest',
      goal: 'Asli interview jaisa: <b>Sohvi — 30 min</b> (3 questions), <b>Tum — 45–60 min</b> (3 questions, bina hints, 9-step format). Phir LeetCode Weekly Contest discussion.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Mock format',
          blocks: [
            { table: { head: ['Kaun', 'Time', 'Questions', 'Rules'], rows: [
              ['Sohvi (Tum interviewer)', '30 min', 'LC 206, 876, 21', 'Minimal hints; bolke soche'],
              ['Tum (Sohvi interviewer)', '45–60 min', 'LC 206, 876, 21', 'Bina hints, 9-step format'],
              ['Dono', '30 min', 'Contest discussion', 'Sunday 8:00 AM IST ka LeetCode Weekly Contest'],
            ] } },
          ],
        },
        {
          title: 'Part 1 — Sohvi Q1: LC 206 Reverse Linked List',
          blocks: [
            { problem: 206 },
            { list: ['Linked list structure explain karo (node, head, next, null).', 'List reverse karo.', 'Dry run.', 'Complexity explain karo.'] },
            { olist: ['Hint 1: "Ek node ka arrow ulta karne ke liye kya chahiye?"', 'Hint 2: "Arrow ulta karne se pehle kya yaad rakhna padega?"', 'Hint 3: "Loop ke baad naya head kaun?"'] },
          ],
        },
        {
          title: 'Part 2 — Sohvi Q2: LC 876 Middle of the Linked List',
          blocks: [
            { problem: 876 },
            { list: ['Middle node dhoondo.', 'Fast/slow pointers explain karo.', 'Odd aur even dono length handle karo.'] },
            { olist: ['Hint 1: "Kitne nodes hain pata ho toh?"', 'Hint 2: "Ek pass me — do log race karein, ek double speed…"', 'Hint 3: "Fast kab ruke taaki NPE na aaye?"'] },
          ],
        },
        {
          title: 'Part 3 — Sohvi Q3: LC 21 Merge Two Sorted Lists',
          blocks: [
            { problem: 21 },
            { list: ['Merging explain karo.', 'Dummy node use karo.', 'Dry run.'] },
            { olist: ['Hint 1: "Result ka pehla node kaun ho sakta hai?"', 'Hint 2: "Head ka special case hatane ke liye ek nakli node?"', 'Hint 3: "Ek list khatam — doosri ka kya?"'] },
            { table: { head: ['Evaluation (Sohvi)', 'Kya dekhna hai', 'Score (1–4)'], rows: [
              ['Pointer movement', 'Sahi order, koi link nahi khoya', ''],
              ['Explanation', 'Bolke socha, diagram banaya', ''],
              ['Edge cases', 'Empty, 1 node, odd/even', ''],
              ['Coding', 'Minimal hints ke saath code', ''],
            ] } },
          ],
        },
        {
          title: 'Part 4 — Tum: 9-step format (har question ke liye)',
          blocks: [
            { olist: [
              '<b>Clarify</b> input/output (empty list? even me kaunsa middle? sorted non-decreasing?).',
              '<b>Identify</b> the pattern.',
              '<b>Explain</b> brute force.',
              '<b>Derive</b> optimal approach.',
              '<b>Explain</b> pointer movement.',
              '<b>Analyze</b> time and space.',
              '<b>Discuss</b> edge cases.',
              '<b>Code</b> from scratch.',
              '<b>Dry run</b> the code.',
            ] },
            { table: { head: ['Question', 'Pattern', 'Brute', 'Optimal', 'Follow-up jo Sohvi pooche'], rows: [
              ['LC 206', 'Three pointers', 'Values copy — O(n) space', 'In-place, O(1)', 'Recursively karo + space?'],
              ['LC 876', 'Fast &amp; slow', 'Count + walk', 'One pass', 'First middle chahiye toh?'],
              ['LC 21', 'Dummy node', 'Collect + sort', 'O(n + m), O(1)', 'Recursive version + space?'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Tum: follow-up sawaal (Sohvi poochegi)',
          blocks: [
            { qa: [
              ['206: recursive ka space aur risk?', 'O(n) stack; lambi list pe StackOverflowError.'],
              ['206: <code>head.next = null</code> bhool gaye toh?', '1 ⇄ 2 cycle.'],
              ['876: first middle kaise?', '<code>fast.next != null &amp;&amp; fast.next.next != null</code>'],
              ['876: O(n) kyun jabki fast 2 step?', '~n/2 iterations, har ek O(1).'],
              ['21: <code>&lt;=</code> kyun?', 'Stable — barabar values me list1 pehle.'],
              ['21: auxiliary space O(1) kyun?', 'Sirf existing nodes relink; naya sirf dummy.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — LeetCode Weekly Contest plan + discussion template',
          blocks: [
            { list: ['Sunday 8:00 AM IST — dono join karo (90 min). Target: Q1 + Q2.', 'Contest ke baad: har solved question ka pattern naam do.', 'Jo nahi hua: editorial padho, kal 20 min upsolve.'] },
            { table: { head: ['Question', 'Pattern', 'Time liya', 'Galti', 'Seekh'], rows: [
              ['Q1', '', '', '', ''],
              ['Q2', '', '', '', ''],
              ['Q3', '', '', '', ''],
            ] } },
          ],
        },
        {
          title: 'Part 7 — Aise bolo',
          blocks: [
            { say: [
              ['Mock opening', 'Let me restate the problem: given the head of a singly linked list, I need to reverse it and return the new head. Can the list be empty? And should I reverse the links in place rather than create new nodes? Great. Let me draw a small example first.'],
              ['Mock closing', 'To summarize, this runs in O(n) time with O(1) extra space. I tested it on an empty list, a single node and two nodes. If you want, I can also show the recursive version, which is shorter but uses O(n) stack space.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohvi session',
          blocks: [
            { olist: ['Mock me teeno questions bolke socho — chup mat raho.', 'Interviewer ban ke Tum se 206, 876, 21 poocho; follow-ups (Part 5) zaroor.', 'Contest Q1 try karo (30 min).'] },
          ],
        },
        {
          title: 'Part 9 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: ['<b>Task A:</b> Teeno questions bina hints, 9-step format, 45–60 min total.', '<b>Task B:</b> Har question ke baad khud ka score: clarify, pattern, code, test, communication.', '<b>Task C:</b> Contest Q1–Q3 attempt; Q3 upsolve kal.'] },
          ],
        },
        {
          title: 'Part 10 — Week 5 summary + Expected outcome',
          blocks: [
            { table: { head: ['Problem', 'Sohvi', 'Tum'], rows: [
              ['206 Reverse Linked List', 'Solve', 'Iterative + Recursive'],
              ['876 Middle of the Linked List', 'Solve', 'Solve'],
              ['21 Merge Two Sorted Lists', 'Solve', 'Solve'],
            ] } },
            { p: '<b>Tumhare additional implementation exercises:</b> insert at head/tail, delete node by value, search, count nodes, reverse list, find middle, merge sorted lists.' },
            { table: { head: ['Sohvi — Week 5 ke baad', 'Tum — Week 5 ke baad'], rows: [
              ['Node, head, next, null samajh', 'Linked List scratch se implement'],
              ['Linked list traverse + manipulate', 'Three-pointer reversal master'],
              ['Reversal, middle, merge confidence se', 'Fast/slow pointer mechanics'],
              ['—', 'Dummy nodes effectively'],
              ['—', 'Core LL patterns interview depth pe explain'],
            ] } },
            { tip: '<b>Important:</b> Week 5 foundation hai. Cycle detection, reorder list, reverse-k-group me jaldi mat karo jab tak pointer manipulation pakka na ho — woh sab isi week ke concepts pe tike hain.' },
          ],
        },
        {
          title: 'Part 11 — Homework + self-test',
          blocks: [
            { list: ['Rubric me jo 1–2 score mila, us cheez ko kal practice.', 'Week 6 preview: cycle detection (LC 141, LC 142), LC 19, LC 143, LC 25.'] },
            { qa: [
              ['Mock me sabse pehla kaam?', 'Clarify — input, output, edge cases.'],
              ['LC 876 even me kaunsa middle?', 'Second.'],
              ['LC 206 iterative return?', 'prev.'],
              ['LC 21 return?', 'dummy.next.'],
              ['Interviewer chup, tum atke — kya karo?', 'Brute bolo, chhota example haath se chalao, hint maango.'],
            ] },
          ],
        },
      ],
      checks: [
        'Sohvi: 3 questions mock complete (rubric bhara)',
        'Tum: 3 questions bina hints, 9-step format',
        'Follow-up sawaal ke jawab diye',
        'Weekly Contest attempt kiya',
        'Contest discussion table bhara',
        'Week 5 expected outcome checklist dekhi',
      ],
      memory: 'Interview me chup = fail. Clarify, pattern, brute, optimal, draw, code, test.',
    },
  });
})();
