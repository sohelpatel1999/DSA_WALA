// Planner lessons — Linked List basics (Day 12): l1 Insertion (at end), l2 Count Nodes, l3 Search, l4 Delete Node (LC 237)
// Format: dsa-arrays-two-pointers.js jaisa. Linked list view = K.LL (stable node ids), recursion tabs = K.callStack().
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  // ---- shared helpers ----
  // vals → nodes [{id, val, next}] with id = index (stable), head = id 0
  const mkNodes = vals => vals.map((v, i) => ({ id: i, val: v, next: i + 1 < vals.length ? i + 1 : null }));
  const nodeName = (nodes, id) => (id === null || id === undefined ? 'null' : 'Node(' + nodes[id].val + ')');
  // ptrs: [{id, label}] — id null wale pointers "label = null" chip ban jaate hain
  const listView = (label, nodes, hl, ptrs) => {
    const on = ptrs.filter(p => p.id !== null && p.id !== undefined), off = ptrs.filter(p => p.id === null);
    const v = K.LL(label, nodes, hl || {}, on);
    if (off.length) v.free = off.map(p => ({ label: p.label, val: 'null' }));
    return v;
  };
  const listInput = def => ({ key: 'head', label: 'head (list values, khaali = null)', def });
  const sizeCheck = max => ({ head }) => (head.length <= max ? '' : `List me max ${max} nodes rakho (visualizer chhota rakhna hai).`);
  // recursion tracer: frames (top-first) + top frame ke vars; S(snip) top frame ki line bhi set karta hai
  const recT = (code, views) => {
    const cs = K.callStack(), find = K.finder(code);
    const t = K.tracer(code, o => {
      const fr = cs.frames(o.ln);
      return { views: views(o), vars: fr.length ? fr[0].vars : { stack: 'khaali' }, frames: fr };
    });
    const S = (snip, note, o) => t.st(snip, note, Object.assign({ ln: find(snip) }, o || {}));
    return { cs, S, steps: t.steps };
  };

  // =====================================================================
  // l1 — Linked List Insertion (at end) (GfG)
  // =====================================================================
  const L1 = [
    `public ListNode insertAtEnd(ListNode head, int x) {
    if (head == null) return new ListNode(x);
    head.next = insertAtEnd(head.next, x);
    return head;
}`,
    `public ListNode insertAtEnd(ListNode head, int x) {
    ListNode node = new ListNode(x);
    if (head == null) return node;
    ListNode curr = head;
    while (curr.next != null) {
        curr = curr.next;
    }
    curr.next = node;
    return head;
}`,
  ];
  const L1_HEAD = `// Insert at BEGINNING — O(1): koi traversal nahi
public ListNode insertAtBeginning(ListNode head, int x) {
    ListNode node = new ListNode(x);
    node.next = head;   // naya node purane head ko point kare
    return node;        // naya node hi ab head hai
}`;
  const L1_TAIL = `// Agar list class HAMARI hai: tail pointer rakho → har insertAtEnd O(1)
class MyList {
    ListNode head, tail;
    void insertAtEnd(int x) {
        ListNode node = new ListNode(x);
        if (head == null) { head = tail = node; return; }
        tail.next = node;   // purana tail → naya node
        tail = node;        // tail aage khisko
    }
}`;

  L.l1 = {
    kind: 'dsa', title: 'Linked List Insertion', topic: 'Linked List', diff: 'T',
    url: 'https://www.geeksforgeeks.org/problems/linked-list-insertion-1587115620/0',
    pattern: 'Linked list traversal (tail tak chalo)',
    oneLine: 'Naya node banao; list khaali → wahi head. Warna curr ko tab tak aage badhao jab tak curr.next != null, phir curr.next = node.',
    goal: 'Singly linked list ke <b>end me</b> value <code>x</code> wala naya node jodo aur head return karo. Asli seekh: <b>linked list kya hai</b> — node, reference (<code>next</code>), head, null, traversal — aur array se farak: head pe insert <b>O(1)</b>, par index / tail tak pahunchna <b>O(n)</b>.',
    problem: {
      statement: 'Given the <code>head</code> of a singly linked list and an integer <code>x</code>, insert a new node with value <code>x</code> at the <b>end</b> of the linked list and return the <b>head</b> of the modified list. (If the list is empty, the new node becomes the head.)',
      examples: [
        { input: 'LinkedList: 1->2->3->4->5, x = 6', output: '1->2->3->4->5->6', ret: '1 -> 2 -> 3 -> 4 -> 5 -> 6 -> null', explain: 'We inserted 6 at the end of the linked list.', viz: { head: '1, 2, 3, 4, 5', x: '6' } },
        { input: 'LinkedList: 5->4, x = 1', output: '5->4->1', ret: '5 -> 4 -> 1 -> null', explain: 'We inserted 1 at the end of the linked list.', viz: { head: '5, 4', x: '1' } },
        { input: 'LinkedList: (empty), x = 7', output: '7', ret: '7 -> null', explain: 'Apna example: head = null. Naya node hi head ban jaata hai — <code>if (head == null)</code> wali line yahin chalti hai.', viz: { head: '', x: '7' } },
      ],
      constraints: ['0 <= number of nodes <= 10^5', '1 <= node.data, x <= 10^5'],
    },
    approaches: [
      { level: 'Brute', idea: 'Recursion: "is node ke baad wali list ke end me x jodo, aur result ko head.next bana do". Base case: head == null → naya node hi nayi list hai. Simple, par har node ke liye ek stack frame.', time: 'O(n)', space: 'O(n) (recursion stack)', code: L1[0] },
      { level: 'Optimal', idea: 'Iterative: <code>curr</code> ko head se tab tak aage badhao jab tak <code>curr.next != null</code> (yaani curr = tail). Phir <code>curr.next = node</code>. Sirf ek extra pointer.', time: 'O(n)', space: 'O(1)', code: L1[1] },
    ],
    viz: {
      title: 'Insert at end — iterative (curr ko tail tak chalao)',
      inputs: [listInput('1, 2, 3, 4, 5'), { key: 'x', label: 'x', def: '6', num: true }],
      check: sizeCheck(6),
      run({ head, x }) {
        const nodes = mkNodes(head), headId = nodes.length ? 0 : null, N = id => nodeName(nodes, id);
        let node, curr;
        const V = () => Object.assign({ head: N(headId), x }, node !== undefined ? { node: N(node) } : {}, curr !== undefined ? { curr: N(curr) } : {});
        const P = () => [{ id: headId, label: 'head' }].concat(curr !== undefined ? [{ id: curr, label: 'curr' }] : [], node !== undefined ? [{ id: node, label: 'node' }] : []);
        const { st, steps } = K.tracer(L1[1], o => ({ views: [listView('list', nodes, o.hl, P()), K.X('head se padho', K.llStr(nodes, o.rid !== undefined ? o.rid : headId))], vars: V() }));
        st('public ListNode insertAtEnd', `Method call: head = ${K.llStr(nodes, headId)}, x = ${x}`);
        node = nodes.length;
        nodes.push({ id: node, val: x, next: null });
        st('ListNode node = new ListNode(x)', `Naya node bana: Node(${x}), abhi node.next = null — list se juda nahi hai`, { hl: { [node]: 'new' } });
        if (headId === null) {
          st('if (head == null) return node', `head == null → list khaali thi → naya node hi head. return Node(${x})`, { hl: { [node]: 'found' }, rid: node, ret: K.llStr(nodes, node) });
          return steps;
        }
        st('if (head == null) return node', `head = ${N(headId)} null nahi → tail dhoondhna padega`, { hl: { [node]: 'new' } });
        curr = headId;
        st('ListNode curr = head', `curr = head = ${N(curr)} — head ko mat hilao, curr se chalo`, { hl: { [curr]: 'cur', [node]: 'new' } });
        while (true) {
          const nx = nodes[curr].next;
          if (nx === null) { st('while (curr.next != null)', `curr.next = null ✗ → ${N(curr)} hi tail hai, ruko`, { hl: { [curr]: 'found', [node]: 'new' } }); break; }
          st('while (curr.next != null)', `curr.next = ${N(nx)} ≠ null ✓ → ${N(curr)} tail nahi`, { hl: { [curr]: 'cur', [node]: 'new' } });
          curr = nx;
          st('curr = curr.next', `curr = curr.next → ${N(curr)}`, { hl: { [curr]: 'cur', [node]: 'new' } });
        }
        nodes[curr].next = node;
        st('curr.next = node', `tail.next = node → ${N(curr)} ab Node(${x}) ko point karta hai`, { hl: { [curr]: 'done', [node]: 'found' } });
        st('return head', `return head = ${N(headId)} — head badla hi nahi`, { hl: { [node]: 'found' }, ret: K.llStr(nodes, headId) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Recursive',
          run({ head, x }) {
            const nodes = mkNodes(head), N = id => nodeName(nodes, id), hs = [];
            const { cs, S, steps } = recT(L1[0], o => {
              const top = hs.length ? hs[hs.length - 1] : null;
              return [listView('list', nodes, o.hl, [{ id: hs.length ? hs[0] : null, label: 'head (call 1)' }].concat(hs.length > 1 ? [{ id: top, label: 'head (is call ka)' }] : [])), K.X('head se padho', K.llStr(nodes, o.rid !== undefined ? o.rid : nodes.length && head.length ? 0 : null))];
            });
            const rec = (hid, depth) => {
              const F = { hid };
              hs.push(hid);
              cs.push('insertAtEnd', `head=${N(hid)}, x=${x}`, () => ({ head: N(F.hid), x }));
              S('public ListNode insertAtEnd', depth === 0 ? `Method call: head = ${K.llStr(nodes, hid)}, x = ${x}` : `Call #${depth + 1}: head = ${N(hid)} (baaki list ${K.llStr(nodes, hid)})`, hid !== null ? { hl: { [hid]: 'cur' } } : {});
              if (hid === null) {
                const id = nodes.length;
                nodes.push({ id, val: x, next: null });
                S('if (head == null) return new ListNode(x)', `head == null → list ka end aa gaya! Naya Node(${x}) banao aur return karo`, Object.assign({ hl: { [id]: 'new' } }, depth === 0 ? { rid: id, ret: K.llStr(nodes, id) } : {}));
                hs.pop(); cs.pop();
                return id;
              }
              S('if (head == null) return new ListNode(x)', `head = ${N(hid)} null nahi → aage wali list pe kaam do`, { hl: { [hid]: 'cur' } });
              const nx = nodes[hid].next;
              S('head.next = insertAtEnd', `insertAtEnd(head.next = ${N(nx)}, ${x}) — recursive call (stack frame +1)`, { hl: { [hid]: 'cur' } });
              const r = rec(nx, depth + 1);
              nodes[hid].next = r;
              S('head.next = insertAtEnd', `Wapas aaye: head.next = ${N(r)}${nx === null ? ' — yahi naya link bana!' : ' — same node, link waisa hi'}`, { hl: { [hid]: 'done', [r]: nx === null ? 'new' : 'done' } });
              S('return head', depth === 0 ? `return head = ${N(hid)} — poori list wapas` : `return ${N(hid)} → caller ko (frame pop)`, Object.assign({ hl: { [hid]: 'done' } }, depth === 0 ? { ret: K.llStr(nodes, hid) } : {}));
              hs.pop(); cs.pop();
              return hid;
            };
            rec(nodes.length ? 0 : null, 0);
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Linked list: node, reference, head, null', blocks: [
        { p: 'Ab tak array padha — elements memory me <b>ek ke baad ek, continuous</b>. Linked list me har element ek alag <b>object (node)</b> hai jo heap me kahin bhi ho sakta hai. Har node ke paas do cheez: <code>val</code> (data) aur <code>next</code> (agle node ka <b>reference</b> — Java me pointer jaisa, address yaad rakhta hai).' },
        { code: `class ListNode {          // LeetCode wala node
    int val;              // data
    ListNode next;        // agle node ka reference (nahi hai toh null)
    ListNode(int val) { this.val = val; }
}` },
        { pre: `head
 ▼
[1 | •]──►[2 | •]──►[3 | •]──► null
 val next

head  = pehle node ka reference (list ka "darwaza")
null  = list khatam (last node ka next = null) · head == null → list khaali` },
        { p: '<b>Traversal</b> = head se shuru karke <code>next</code> pakadte-pakadte chalna: <code>for (ListNode curr = head; curr != null; curr = curr.next)</code>. Index nahi hota — 4th element chahiye toh 3 baar <code>next</code> karna padega. Aur <b>head ko kabhi mat hilao</b> — usko aage badhaya toh pehle wale nodes ka reference kho gaya (list ka shuru gaya). Isliye ek alag <code>curr</code> chalate hain.' },
        { table: { head: ['Operation', 'Array', 'Linked list', 'Kyun'], rows: [
          ['i-th element padho', 'O(1)', 'O(n)', 'array: address = base + i × size; list: head se i baar next'],
          ['Shuru me insert', 'O(n)', '<b>O(1)</b>', 'array: sab ek-ek khiskao; list: node.next = head, head = node'],
          ['End me insert', 'O(1) amortized (ArrayList)', 'O(n) — ya O(1) agar tail pointer ho', 'list ko tail tak chalna padta hai'],
          ['Beech me insert/delete (node mil chuka ho)', 'O(n)', 'O(1)', 'sirf 1–2 reference badalne hain'],
          ['Memory', 'continuous, cache friendly', 'har node + ek reference extra', 'list ke nodes bikhre hue'],
        ] } },
        { h: 'Insert at beginning — O(1)' },
        { code: L1_HEAD },
        { h: 'Dummy node — head badalne ka darr khatam' },
        { p: 'Jab head khud badal sakta hai (khaali list, pehla node delete, merge) toh ek nakli node <code>dummy</code> banao jiska <code>next = head</code>. Ab har asli node ka ek "pichla" node hai, special case nahi. End me <code>return dummy.next</code>. Is lesson ke tests ka <code>LL.of(...)</code> helper bhi aise hi list banata hai: <code>dummy</code> + <code>tail</code>.' },
        { code: `ListNode dummy = new ListNode(0), tail = dummy;
for (int v : new int[]{1, 2, 3}) { tail.next = new ListNode(v); tail = tail.next; }
ListNode head = dummy.next;   // 1 -> 2 -> 3 -> null` },
        { tip: '<b>Day 12 ka mantra:</b> (1) head ko mat hilao, <code>curr</code> chalao. (2) <code>curr.next</code> use karne se pehle soch lo <code>curr</code> null toh nahi. (3) Reference badalne ka <b>order</b> matter karta hai — pehle naya link, phir purana todo.' },
      ] },
      { title: '📄 Problem — GfG Linked List Insertion (at end)', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { p: 'Ek baat pehle saaf: <b>signature me sirf head milta hai</b>, tail nahi. Toh end tak pahunchne ke liye <b>har baar n nodes chalna hi padega → O(n) time</b> dono approaches me. Farak sirf space ka hai.' },
        { h: '1. Brute — recursion' },
        { p: 'Socho: "head ke baad wali list ke end me x jod do, jo nayi list mile use <code>head.next</code> bana do, aur head return karo". Base case: <code>head == null</code> → khaali list ke end me x jodna = sirf naya node. Code 3 line ka, par har node ek stack frame → <b>O(n) space</b>. 10⁵ nodes pe StackOverflowError ka risk.' },
        { h: 'Better?' },
        { p: 'Alag Better nahi hai — idea ek hi hai (tail tak jao), bas recursion ko loop banana hai. Seedha Optimal.' },
        { h: '2. Optimal — iterative traversal' },
        { p: 'Naya node banao. List khaali → wahi head. Warna <code>curr = head</code> se chalo jab tak <code>curr.next != null</code>; loop rukte hi curr = tail. <code>curr.next = node</code>, return head. <b>O(n) time, O(1) space.</b>' },
        { h: 'Follow-up — O(1) insert kab?' },
        { p: 'Agar list ki class <b>hamare haath</b> me ho (jaise Java ka <code>LinkedList</code>), toh <b>tail pointer</b> saath rakho — har insert O(1). Ye is GfG signature (sirf head) pe possible nahi, isliye ise approach nahi, follow-up maana hai:' },
        { code: L1_TAIL },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — 1 → 2 → 3 → 4 → 5, x = 6 (Optimal)', blocks: [
        { table: { head: ['Step', 'curr', 'curr.next', 'curr.next != null?', 'Action'], rows: [
          ['start', '—', '—', '—', 'node = Node(6); head null nahi'],
          ['1', 'Node(1)', 'Node(2)', 'Yes', 'curr = Node(2)'],
          ['2', 'Node(2)', 'Node(3)', 'Yes', 'curr = Node(3)'],
          ['3', 'Node(3)', 'Node(4)', 'Yes', 'curr = Node(4)'],
          ['4', 'Node(4)', 'Node(5)', 'Yes', 'curr = Node(5)'],
          ['5', 'Node(5)', 'null', '<b>No</b>', 'loop khatam → curr = tail'],
          ['end', 'Node(5)', '→ Node(6)', '—', 'curr.next = node, return head'],
        ] } },
        { p: 'Result: <code>1 -> 2 -> 3 -> 4 -> 5 -> 6 -> null</code>. Khaali list (head = null) pe loop tak pahunchte hi nahi — seedha <code>return node</code>.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: L1[1] },
        { lines: [
          ['ListNode node = new ListNode(x);', 'Naya node; abhi next = null — ye hi naya tail banega.'],
          ['if (head == null) return node;', 'Khaali list: naya node hi poori list hai. Ye check na ho toh neeche curr.next pe NullPointerException.'],
          ['ListNode curr = head;', 'Alag pointer — head ko hilaya toh return kya karoge?'],
          ['while (curr.next != null)', '<code>curr != null</code> nahi! Hume tail pe <b>rukna</b> hai (jiska next null), uske aage nahi nikalna.'],
          ['curr = curr.next;', 'Ek node aage.'],
          ['curr.next = node;', 'Tail ko naye node se jodo.'],
          ['return head;', 'Head same hai (sirf khaali list me badalta, wo upar handle ho gaya).'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Recursive tab me <b>CALL STACK</b> dekho: har node pe ek frame, aur wapas aate waqt <code>head.next = ...</code> set hota hai. Khaali list try karo: head box khaali chhodo.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Khaali list (head = null) → naya node hi head; return node.',
          'Ek node <code>5</code>, x = 9 → loop ek baar bhi andar nahi jaata (5.next = null) → <code>5 -> 9 -> null</code>.',
          'Duplicate values (x pehle se list me hai) → koi farak nahi, naya node judta hai.',
          'Bahut lambi list (10⁵) → recursive version StackOverflow de sakta hai; iterative safe.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>while (curr != null)</code> likh dena → loop ke baad curr = null, phir <code>curr.next = node</code> → NullPointerException.',
          'head ko hi aage badha dena (<code>head = head.next</code>) → list ka shuru kho gaya.',
          'Khaali list ka check bhool jaana.',
          'Return na karna / naya head return karna — GfG ko original head chahiye.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (recursive)', 'O(n)', 'O(n)', 'har node pe ek call; n frames stack pe'],
          ['Optimal (iterative)', 'O(n)', 'O(1)', 'ek pass tail tak; sirf curr + node'],
          ['Follow-up: tail pointer', 'O(1) per insert', 'O(1)', 'tail pehle se pata hai (apni list class chahiye)'],
          ['Insert at beginning', 'O(1)', 'O(1)', 'sirf node.next = head'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['What is a singly linked list?', 'A chain of nodes where each node stores a value and a reference to the next node; the last node points to null and we keep a reference to the first node, the head.'],
          ['Why is inserting at the end O(n) here?', 'We only have the head, so we must walk through every node to find the tail before linking the new node.'],
          ['How can insertion at the end become O(1)?', 'Maintain a tail reference in the list class; then we just set tail.next = node and move tail, without traversal.'],
          ['Why do you loop on curr.next != null and not curr != null?', 'We need to stop at the last node so we can change its next; looping until curr is null would walk past the tail.'],
          ['What happens if the list is empty?', 'The new node becomes the head, so we return it directly; without that check curr.next would throw a NullPointerException.'],
          ['Array vs linked list — when would you choose a linked list?', 'When we insert or delete at the front or at known positions often and do not need random access by index.'],
          ['What is a dummy node?', 'A fake node placed before the head so the head behaves like every other node; we return dummy.next at the end and avoid special cases.'],
          ['Recursive vs iterative here?', 'Both are O(n) time, but recursion uses O(n) stack space and can overflow on long lists, so the iterative version is preferred.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'I create the new node first. If the head is null, the list is empty and the new node is the answer. Otherwise I take a separate pointer curr starting at the head and move it while curr.next is not null, so it stops at the tail. Then I link tail.next to the new node and return the original head. It is O(n) time because we must reach the tail, and O(1) extra space. If we owned the list class, keeping a tail pointer would make every insert O(1).'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['head = 3 → 8, x = 1 — loop kitni baar andar jaayega?', '<b>1 baar</b>: curr = 3 (next = 8 ✓) → curr = 8; phir 8.next = null ✗. Result <code>3 -> 8 -> 1 -> null</code>.'],
          ['Insert at beginning ke liye <code>head.next = node</code> likh diya — kya hoga?', 'Galat: naya node doosri jagah chala gaya aur purana <code>head.next</code> wala hissa kho gaya. Sahi: <code>node.next = head; return node;</code>'],
          ['Array me shuru me insert O(n) kyun, list me O(1) kyun?', 'Array me saare elements ek jagah khiskaane padte hain; list me sirf ek reference (<code>node.next = head</code>) set karna hai.'],
          ['Dummy node kab kaam aata hai?', 'Jab head khud badal sakta hai (khaali list, pehla node delete, merge) — dummy.next return karo, special case nahi.'],
        ] },
        { olist: ['Optimal code 3 min me bina dekhe likho.', 'Insert at beginning aur tail-pointer wala MyList bhi kaagaz pe likho.'] },
      ] },
    ],
    checks: [
      'Node, head, next, null aur traversal apne words me samjha sakta hoon',
      'Array vs linked list table (index O(n), head insert O(1)) bol sakta hoon',
      'Bata sakta hoon kyun <code>curr.next != null</code> pe loop rukta hai',
      'Insert at end + insert at beginning dono 3 min me bina dekhe likh sakta hoon',
    ],
    memory: 'Head mat hilao, curr chalao; curr.next == null = tail; tail.next = node. Shuru me insert: node.next = head.',
    tests: [
      { run: 'System.out.print(LL.str(o.insertAtEnd(LL.of(1,2,3,4,5), 6)));', out: '1 -> 2 -> 3 -> 4 -> 5 -> 6 -> null' },
      { run: 'System.out.print(LL.str(o.insertAtEnd(LL.of(5,4), 1)));', out: '5 -> 4 -> 1 -> null' },
      { run: 'System.out.print(LL.str(o.insertAtEnd(null, 7)));', out: '7 -> null' },
      { run: 'System.out.print(LL.str(o.insertAtEnd(LL.of(5), 9)));', out: '5 -> 9 -> null' },
      { run: 'ListNode h = LL.of(1,2); ListNode r = o.insertAtEnd(h, 3); System.out.print((r == h) + " " + LL.str(r));', out: 'true 1 -> 2 -> 3 -> null' },
    ],
  };

  // =====================================================================
  // l2 — Count Nodes of Linked List (GfG)
  // =====================================================================
  const L2 = [
    `public int getCount(ListNode head) {
    if (head == null) return 0;
    return 1 + getCount(head.next);
}`,
    `public int getCount(ListNode head) {
    int count = 0;
    ListNode curr = head;
    while (curr != null) {
        count++;
        curr = curr.next;
    }
    return count;
}`,
  ];

  L.l2 = {
    kind: 'dsa', title: 'Count Nodes of Linked List', topic: 'Linked List', diff: 'T',
    url: 'https://www.geeksforgeeks.org/problems/count-nodes-of-linked-list/0',
    pattern: 'Linked list traversal (curr != null)',
    oneLine: 'count = 0, curr = head; jab tak curr != null: count++, curr = curr.next. Return count.',
    goal: 'Linked list me kitne nodes hain, gino. Asli seekh: <b>standard traversal loop</b> <code>while (curr != null)</code> — l1 me hum tail pe <i>ruke</i> the (<code>curr.next != null</code>), yahan har node <i>visit</i> karna hai, isliye null tak jaate hain.',
    problem: {
      statement: 'Given a singly linked list, count the number of nodes in it. Complete the function <code>getCount()</code>, which takes the <code>head</code> reference of the linked list and returns the count of nodes in the linked list.',
      examples: [
        { input: 'LinkedList: 1->2->3->4->5', output: '5', explain: 'Count of nodes in the linked list is 5, which is its length.', viz: { head: '1, 2, 3, 4, 5' } },
        { input: 'LinkedList: 2->4->6->7->5->1->0', output: '7', explain: 'Count of nodes in the linked list is 7. Hence, the output is 7.' },
        { input: 'LinkedList: (empty)', output: '0', explain: 'Apna example: head = null → loop ek baar bhi nahi chalta, answer 0. Recursive me seedha base case.', viz: { head: '' } },
      ],
      constraints: ['1 <= number of nodes <= 10^5', '1 <= node.data <= 10^3'],
    },
    approaches: [
      { level: 'Brute', idea: 'Recursion: count(list) = 1 + count(baaki list); khaali list = 0. Seedha definition, par har node ka ek stack frame.', time: 'O(n)', space: 'O(n) (recursion stack)', code: L2[0] },
      { level: 'Optimal', idea: 'Iterative loop: curr ko head se null tak chalao, har node pe count++. Sirf do variables.', time: 'O(n)', space: 'O(1)', code: L2[1] },
    ],
    viz: {
      title: 'Count nodes — iterative (curr null tak)',
      inputs: [listInput('1, 2, 3, 4, 5')],
      check: sizeCheck(6),
      run({ head }) {
        const nodes = mkNodes(head), headId = nodes.length ? 0 : null, N = id => nodeName(nodes, id);
        let count, curr;
        const seen = {};
        const V = () => Object.assign({ head: N(headId) }, count !== undefined ? { count } : {}, curr !== undefined ? { curr: N(curr) } : {});
        const { st, steps } = K.tracer(L2[1], o => ({ views: [listView('list', nodes, Object.assign({}, seen, o.hl || {}), [{ id: headId, label: 'head' }].concat(curr !== undefined ? [{ id: curr, label: 'curr' }] : []))], vars: V() }));
        st('public int getCount', `Method call: head = ${K.llStr(nodes, headId)}`);
        count = 0;
        st('int count = 0', 'count = 0 — abhi koi node nahi gina');
        curr = headId;
        st('ListNode curr = head', `curr = head = ${N(curr)}`, curr !== null ? { hl: { [curr]: 'cur' } } : {});
        while (true) {
          if (curr === null) { st('while (curr != null)', `curr = null ✗ → list khatam`); break; }
          st('while (curr != null)', `curr = ${N(curr)} ≠ null ✓`, { hl: { [curr]: 'cur' } });
          count++;
          seen[curr] = 'done';
          st('count++', `${N(curr)} gina → count = ${count}`, { hl: { [curr]: 'done' } });
          curr = nodes[curr].next;
          st('curr = curr.next', `curr = curr.next → ${N(curr)}`, curr !== null ? { hl: { [curr]: 'cur' } } : {});
        }
        st('return count', `return count = ${count}`, { ret: String(count) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Recursive',
          run({ head }) {
            const nodes = mkNodes(head), N = id => nodeName(nodes, id), hs = [], seen = {};
            const { cs, S, steps } = recT(L2[0], o => [listView('list', nodes, Object.assign({}, seen, o.hl || {}), [{ id: nodes.length ? 0 : null, label: 'head (call 1)' }].concat(hs.length > 1 ? [{ id: hs[hs.length - 1], label: 'head (is call ka)' }] : []))]);
            const rec = (hid, depth) => {
              const F = { hid };
              hs.push(hid);
              cs.push('getCount', `head=${N(hid)}`, () => Object.assign({ head: N(F.hid) }, F.r !== undefined ? { 'getCount(head.next)': F.r } : {}));
              S('public int getCount', depth === 0 ? `Method call: head = ${K.llStr(nodes, hid)}` : `Call #${depth + 1}: head = ${N(hid)}`, hid !== null ? { hl: { [hid]: 'cur' } } : {});
              if (hid === null) {
                S('if (head == null) return 0', 'head == null → khaali list → return 0 (base case)', depth === 0 ? { ret: '0' } : {});
                hs.pop(); cs.pop();
                return 0;
              }
              S('if (head == null) return 0', `head = ${N(hid)} null nahi`, { hl: { [hid]: 'cur' } });
              S('return 1 + getCount', `1 + getCount(${N(nodes[hid].next)}) — pehle baaki list gino (call)`, { hl: { [hid]: 'cur' } });
              F.r = rec(nodes[hid].next, depth + 1);
              seen[hid] = 'done';
              S('return 1 + getCount', `Wapas aaye: 1 + ${F.r} = ${F.r + 1} → return${depth === 0 ? '' : ' (frame pop)'}`, Object.assign({ hl: { [hid]: 'done' } }, depth === 0 ? { ret: String(F.r + 1) } : {}));
              hs.pop(); cs.pop();
              return F.r + 1;
            };
            rec(nodes.length ? 0 : null, 0);
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Traversal loop: curr != null vs curr.next != null', blocks: [
        { p: 'Linked list ka sabse basic template — har node ek baar visit karo:' },
        { code: `ListNode curr = head;
while (curr != null) {
    // curr.val ke saath kaam
    curr = curr.next;
}` },
        { table: { head: ['Condition', 'Loop kahan rukta hai', 'Kab use karo'], rows: [
          ['<code>curr != null</code>', 'last node ke <b>baad</b> (curr = null)', 'har node visit karna: count, search, sum, print'],
          ['<code>curr.next != null</code>', 'last node <b>pe</b> (curr = tail)', 'tail chahiye: insert at end (l1), tail ka next badalna'],
        ] } },
        { tip: 'Array me length pata hoti hai (<code>arr.length</code>). Linked list me <b>length store nahi hoti</b> — ginne ke liye poori list chalni padti hai → O(n). Isliye Java ka <code>LinkedList</code> class ek alag <code>size</code> field rakhta hai.' },
      ] },
      { title: '📄 Problem — GfG Count Nodes of Linked List', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { p: 'Har node ko ek baar dekhna hi padega (length kahin store nahi hai) → <b>dono approaches O(n) time</b>. Farak sirf extra space ka.' },
        { h: '1. Brute — recursion' },
        { p: 'Definition hi recursive hai: <code>count(null) = 0</code>, <code>count(head) = 1 + count(head.next)</code>. Day 6 ki recursion wali soch (r4 Length of String jaisa). Par n frames stack pe → <b>O(n) space</b>, lambi list pe StackOverflow risk.' },
        { h: 'Better?' },
        { p: 'Alag Better nahi — wahi traversal, bas loop se. Seedha Optimal.' },
        { h: '2. Optimal — iterative loop' },
        { p: '<code>count = 0</code>, <code>curr = head</code>; jab tak curr null nahi: count++, curr aage. <b>O(n) time, O(1) space.</b>' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — 1 → 2 → 3 → 4 → 5 (Optimal)', blocks: [
        { table: { head: ['curr', 'curr != null?', 'count (baad me)'], rows: [
          ['Node(1)', 'Yes', '1'],
          ['Node(2)', 'Yes', '2'],
          ['Node(3)', 'Yes', '3'],
          ['Node(4)', 'Yes', '4'],
          ['Node(5)', 'Yes', '5'],
          ['null', '<b>No</b>', 'return <b>5</b>'],
        ] } },
        { p: '<b>Recursive</b>: getCount(1) = 1 + getCount(2) = … = 1 + 1 + 1 + 1 + 1 + getCount(null) = 5 + 0 = 5. Stack pe ek saath 6 frames.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: L2[1] },
        { lines: [
          ['int count = 0;', 'Khaali list ka answer bhi yahi 0 hai — alag check nahi chahiye.'],
          ['ListNode curr = head;', 'head ko safe rakho, curr chalao.'],
          ['while (curr != null)', 'Har node (last bhi) visit hona chahiye, isliye null tak.'],
          ['count++;', 'Ye node gina.'],
          ['curr = curr.next;', 'Aage badho — ye bhoole toh infinite loop.'],
          ['return count;', 'Kitne nodes visit hue.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Recursive tab me dekho: count <b>wapas aate waqt</b> banta hai (1 + 0, 1 + 1, …). Iterative me <b>jaate waqt</b>.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'head = null → 0 (GfG constraint me n ≥ 1, par code phir bhi sahi hai).',
          'Ek node → 1.',
          '10⁵ nodes → iterative theek; recursive ka stack bahut gehra.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>curr = curr.next</code> bhool jaana → infinite loop.',
          '<code>while (curr.next != null)</code> likhna → last node nahi ginta (aur khaali list pe NPE).',
          'head ko hi aage badhana — is problem me chal jaata hai, par aadat galat; baad me list chahiye hogi.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (recursive)', 'O(n)', 'O(n)', 'har node ek call; n + 1 frames'],
          ['Optimal (iterative)', 'O(n)', 'O(1)', 'ek pass, sirf count + curr'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['What is the time complexity and why?', 'O(n): the length is not stored, so we have to visit every node once.'],
          ['Why curr != null and not curr.next != null?', 'We must count the last node too; curr.next != null would stop at the tail without counting it and would crash on an empty list.'],
          ['Recursive vs iterative?', 'Both are O(n) time; recursion uses O(n) call-stack space and can overflow for long lists, iteration uses O(1).'],
          ['How does Java\'s LinkedList return size() in O(1)?', 'It keeps a size field that is updated on every add and remove.'],
          ['What if the list has a cycle?', 'This loop never ends. We would first detect the cycle with Floyd\'s slow and fast pointers.'],
          ['Should we move head itself?', 'Better not: use a separate pointer so the caller\'s head reference and the list start stay usable.'],
          ['How would you find the middle node?', 'Either count first and walk n/2 steps, or use slow and fast pointers in one pass.'],
          ['What is the base case of the recursive version?', 'An empty list (head == null) has 0 nodes.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'A linked list does not store its length, so I traverse it. I keep a counter starting at zero and a pointer curr starting at the head. While curr is not null, I increment the counter and move curr to curr.next. When curr becomes null I return the counter. That is O(n) time and O(1) space. A recursive version, one plus the count of the rest, also works but uses O(n) stack space.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['Loop condition <code>curr.next != null</code> kar diya — 1 → 2 → 3 pe kya aayega?', '<b>2</b> — last node gina hi nahi. Aur head = null pe NullPointerException.'],
          ['Recursive version me 4 nodes ke liye max kitne frames ek saath stack pe?', '<b>5</b> — 4 nodes + ek getCount(null) base case.'],
          ['<code>curr = curr.next</code> hata do toh?', 'Infinite loop — curr hamesha head pe, count badhta rahega.'],
        ] },
        { olist: ['Iterative code 2 min me bina dekhe likho.', 'Traversal template (<code>while (curr != null)</code>) yaad karo — kal tak har LL problem me aayega.'] },
      ] },
    ],
    checks: [
      '<code>curr != null</code> vs <code>curr.next != null</code> ka farak bata sakta hoon',
      'Recursive aur iterative dono likh sakta hoon aur space ka farak samjha sakta hoon',
      'Samjha sakta hoon kyun length ginna O(n) hai',
      '30 sec ka English answer bol sakta hoon',
    ],
    memory: 'curr = head; while (curr != null) { count++; curr = curr.next; } — null tak chalo, har node gino.',
    tests: [
      { run: 'System.out.print(o.getCount(LL.of(1,2,3,4,5)));', out: '5' },
      { run: 'System.out.print(o.getCount(LL.of(2,4,6,7,5,1,0)));', out: '7' },
      { run: 'System.out.print(o.getCount(null));', out: '0' },
      { run: 'System.out.print(o.getCount(LL.of(9)));', out: '1' },
    ],
  };

  // =====================================================================
  // l3 — Search in Linked List (GfG)
  // =====================================================================
  const L3 = [
    `public boolean searchKey(ListNode head, int key) {
    if (head == null) return false;
    if (head.val == key) return true;
    return searchKey(head.next, key);
}`,
    `public boolean searchKey(ListNode head, int key) {
    ListNode curr = head;
    while (curr != null) {
        if (curr.val == key) return true;
        curr = curr.next;
    }
    return false;
}`,
  ];

  L.l3 = {
    kind: 'dsa', title: 'Search in Linked List', topic: 'Linked List', diff: 'T',
    url: 'https://www.geeksforgeeks.org/problems/search-in-linked-list-1664434326/1',
    pattern: 'Linked list traversal (linear search)',
    oneLine: 'curr = head; jab tak curr != null: curr.val == key → true; curr aage. Loop khatam → false.',
    goal: 'Batao <code>key</code> linked list me hai ya nahi. Asli seekh: wahi traversal (l2) + <b>early return</b> — mil gaya toh turant ruko. Array jaisa binary search yahan nahi chalta, kyunki beech ka node O(1) me nahi milta.',
    problem: {
      statement: 'Given a linked list of <code>n</code> nodes and a <code>key</code>, the task is to check if the key is present in the linked list or not. Return <code>true</code> if the key is present, else <code>false</code>.',
      examples: [
        { input: 'n = 4, key = 3, LinkedList: 1->2->3->4', output: 'true', explain: '3 is present in the linked list, so the function returns true.', viz: { head: '1, 2, 3, 4', key: '3' } },
        { input: 'n = 5, key = 5, LinkedList: 10->20->30->40->50', output: 'false', explain: '5 is not present in the linked list, so the function returns false.', viz: { head: '10, 20, 30, 40, 50', key: '5' } },
      ],
      constraints: ['1 <= n <= 10^5', '1 <= key <= 10^5'],
    },
    approaches: [
      { level: 'Brute', idea: 'Recursion: khaali list → false; head.val == key → true; warna baaki list me dhoondho.', time: 'O(n)', space: 'O(n) (recursion stack)', code: L3[0] },
      { level: 'Optimal', idea: 'Iterative linear search: curr ko null tak chalao, match pe turant true. Sirf ek pointer.', time: 'O(n)', space: 'O(1)', code: L3[1] },
    ],
    viz: {
      title: 'Search — iterative linear search',
      inputs: [listInput('1, 2, 3, 4'), { key: 'key', label: 'key', def: '3', num: true }],
      check: sizeCheck(6),
      run({ head, key }) {
        const nodes = mkNodes(head), headId = nodes.length ? 0 : null, N = id => nodeName(nodes, id), seen = {};
        let curr;
        const V = () => Object.assign({ head: N(headId), key }, curr !== undefined ? { curr: N(curr) } : {});
        const { st, steps } = K.tracer(L3[1], o => ({ views: [listView('list', nodes, Object.assign({}, seen, o.hl || {}), [{ id: headId, label: 'head' }].concat(curr !== undefined ? [{ id: curr, label: 'curr' }] : []))], vars: V() }));
        st('public boolean searchKey', `Method call: head = ${K.llStr(nodes, headId)}, key = ${key}`);
        curr = headId;
        st('ListNode curr = head', `curr = head = ${N(curr)}`, curr !== null ? { hl: { [curr]: 'cur' } } : {});
        while (true) {
          if (curr === null) { st('while (curr != null)', 'curr = null ✗ → poori list dekh li'); break; }
          st('while (curr != null)', `curr = ${N(curr)} ≠ null ✓`, { hl: { [curr]: 'cur' } });
          if (nodes[curr].val === key) { st('if (curr.val == key) return true', `${nodes[curr].val} == ${key} ✓ → mil gaya! return true`, { hl: { [curr]: 'found' }, ret: 'true' }); return steps; }
          st('if (curr.val == key) return true', `${nodes[curr].val} ≠ ${key}`, { hl: { [curr]: 'skip' } });
          seen[curr] = 'skip';
          curr = nodes[curr].next;
          st('curr = curr.next', `curr = curr.next → ${N(curr)}`, curr !== null ? { hl: { [curr]: 'cur' } } : {});
        }
        st('return false', `${key} list me nahi hai → return false`, { ret: 'false' });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Recursive',
          run({ head, key }) {
            const nodes = mkNodes(head), N = id => nodeName(nodes, id), hs = [], seen = {};
            const { cs, S, steps } = recT(L3[0], o => [listView('list', nodes, Object.assign({}, seen, o.hl || {}), [{ id: nodes.length ? 0 : null, label: 'head (call 1)' }].concat(hs.length > 1 ? [{ id: hs[hs.length - 1], label: 'head (is call ka)' }] : []))]);
            const rec = (hid, depth) => {
              const F = { hid }, R = (v, o) => Object.assign(o || {}, depth === 0 ? { ret: String(v) } : {});
              hs.push(hid);
              cs.push('searchKey', `head=${N(hid)}, key=${key}`, () => ({ head: N(F.hid), key }));
              S('public boolean searchKey', depth === 0 ? `Method call: head = ${K.llStr(nodes, hid)}, key = ${key}` : `Call #${depth + 1}: head = ${N(hid)}`, hid !== null ? { hl: { [hid]: 'cur' } } : {});
              let res;
              if (hid === null) {
                S('if (head == null) return false', 'head == null → list khatam, key nahi mili → return false', R(false));
                res = false;
              } else {
                S('if (head == null) return false', `head = ${N(hid)} null nahi`, { hl: { [hid]: 'cur' } });
                if (nodes[hid].val === key) {
                  S('if (head.val == key) return true', `${nodes[hid].val} == ${key} ✓ → return true`, R(true, { hl: { [hid]: 'found' } }));
                  res = true;
                } else {
                  S('if (head.val == key) return true', `${nodes[hid].val} ≠ ${key} → baaki list me dhoondho`, { hl: { [hid]: 'skip' } });
                  seen[hid] = 'skip';
                  S('return searchKey(head.next', `searchKey(${N(nodes[hid].next)}, ${key}) — call`, { hl: { [hid]: 'skip' } });
                  res = rec(nodes[hid].next, depth + 1);
                  S('return searchKey(head.next', `Wapas aaya: ${res} → wahi aage return${depth === 0 ? '' : ' (frame pop)'}`, R(res, { hl: { [hid]: 'skip' } }));
                }
              }
              hs.pop(); cs.pop();
              return res;
            };
            rec(nodes.length ? 0 : null, 0);
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Linear search on a linked list', blocks: [
        { p: 'Ye wahi l2 wala traversal hai, bas har node pe ek sawaal: <i>"kya yahi key hai?"</i> Haan → turant <code>return true</code> (aage dekhne ki zaroorat nahi). Loop poora chal gaya → <code>false</code>.' },
        { table: { head: ['', 'Sorted array', 'Sorted linked list'], rows: [
          ['Binary search', 'O(log n) — <code>arr[mid]</code> O(1)', 'kaam ka nahi — mid tak pahunchna hi O(n)'],
          ['Linear search', 'O(n)', 'O(n) — yahi best'],
        ] } },
        { tip: 'Isliye linked list pe search hamesha <b>O(n)</b>. Fast search chahiye toh HashSet (O(1)) ya balanced tree / skip list (O(log n)).' },
      ] },
      { title: '📄 Problem — GfG Search in Linked List', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { p: 'Worst case (key nahi hai ya last me hai) har node dekhna padega → <b>dono approaches O(n) time</b>. Farak space ka.' },
        { h: '1. Brute — recursion' },
        { p: 'Teen cases: list khaali → false; pehla node hi key → true; warna <code>searchKey(head.next, key)</code>. Saaf code, par har node ek frame → <b>O(n) space</b>.' },
        { h: 'Better?' },
        { p: 'Alag Better nahi — list unsorted hai aur random access nahi, toh linear search hi best. Seedha Optimal.' },
        { h: '2. Optimal — iterative' },
        { p: '<code>curr</code> se chalo, match pe return true, loop khatam → false. <b>O(n) time, O(1) space.</b>' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — 1 → 2 → 3 → 4, key = 3 (Optimal)', blocks: [
        { table: { head: ['curr', 'curr != null?', 'curr.val == 3?', 'Action'], rows: [
          ['Node(1)', 'Yes', 'No', 'curr = Node(2)'],
          ['Node(2)', 'Yes', 'No', 'curr = Node(3)'],
          ['Node(3)', 'Yes', '<b>Yes</b>', 'return <b>true</b>'],
        ] } },
        { p: '<b>Example 2</b> (key = 5): 10, 20, 30, 40, 50 sab check → curr = null → <b>false</b>. Ye worst case hai: n comparisons.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: L3[1] },
        { lines: [
          ['ListNode curr = head;', 'Traversal pointer.'],
          ['while (curr != null)', 'Har node dekhna hai, last bhi.'],
          ['if (curr.val == key) return true;', 'Early exit — mil gaya toh baaki list dekhne ka fayda nahi.'],
          ['curr = curr.next;', 'Aage badho.'],
          ['return false;', 'Poori list dekh li, key nahi mili.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Example 2 (key = 5) chalao — poori list scan hoti hai. Recursive tab me <code>false</code> base case se upar tak pass hota dikhega.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Key pehle node pe → 1 comparison, best case O(1).',
          'Key last node pe ya nahi hai → n comparisons.',
          'Duplicate keys → pehla match milte hi true.',
          'head = null → false (dono versions handle karte hain).',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Loop ke andar <code>else return false</code> likh dena → sirf pehla node check hota hai.',
          '<code>curr = curr.next</code> bhoolna → infinite loop.',
          'Recursive me <code>return</code> bhoolna (<code>searchKey(head.next, key);</code> bina return) → compile error / galat answer.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (recursive)', 'O(n)', 'O(n)', 'worst case n calls stack pe'],
          ['Optimal (iterative)', 'O(n)', 'O(1)', 'ek pass, early exit; sirf curr'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['What is the time complexity?', 'O(n) in the worst case, when the key is at the end or absent; O(1) in the best case when it is at the head.'],
          ['Can we use binary search if the list is sorted?', 'Not efficiently: reaching the middle node costs O(n), so binary search gives no benefit on a plain linked list.'],
          ['Why return immediately on a match?', 'We only need to know whether the key exists, so scanning the rest is wasted work.'],
          ['What is a common bug in this loop?', 'Writing else return false inside the loop, which stops after checking only the first node.'],
          ['Recursive vs iterative?', 'Same O(n) time; recursion uses O(n) stack space, iteration uses O(1), so iteration is preferred.'],
          ['How would you return the index instead?', 'Keep a counter that increases with each step and return it on a match, or -1 if the loop ends.'],
          ['How could searches be faster if we search many times?', 'Store the values in a HashSet for O(1) average lookups, at O(n) extra space.'],
          ['What if the list has a cycle and the key is absent?', 'The loop would never end; we would need cycle detection or a visited set.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'This is a linear search. I walk the list with a pointer curr starting at the head. At each node I compare its value with the key and return true immediately if they match; otherwise I move to the next node. If the loop reaches null, the key is not present and I return false. It is O(n) time and O(1) space. Binary search does not help on a linked list because reaching the middle is already O(n).'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['10 → 20 → 30, key = 20 — kitne comparisons?', '<b>2</b> (10 ≠ 20, 20 == 20 → true).'],
          ['Loop me <code>if (curr.val == key) return true; else return false;</code> — 1 → 2 → 3, key = 3?', '<b>false</b> — galat! Pehle hi node pe else chal gaya.'],
          ['Index return karna ho toh kya badlega?', '<code>int idx = 0;</code> har step pe <code>idx++</code>, match pe <code>return idx</code>, end me <code>return -1</code>.'],
        ] },
        { olist: ['Iterative + recursive dono 3 min me likho.', 'Batao binary search linked list pe kyun bekaar hai — 1 line me.'] },
      ] },
    ],
    checks: [
      'Traversal + early return wala search likh sakta hoon',
      'Samjha sakta hoon binary search linked list pe kyun nahi chalta',
      'Recursive vs iterative space ka farak bata sakta hoon',
      '30 sec ka English answer bol sakta hoon',
    ],
    memory: 'Chalo aur pucho: curr.val == key → true; null tak pahunch gaye → false.',
    tests: [
      { run: 'System.out.print(o.searchKey(LL.of(1,2,3,4), 3));', out: 'true' },
      { run: 'System.out.print(o.searchKey(LL.of(10,20,30,40,50), 5));', out: 'false' },
      { run: 'System.out.print(o.searchKey(LL.of(7), 7));', out: 'true' },
      { run: 'System.out.print(o.searchKey(null, 1));', out: 'false' },
      { run: 'System.out.print(o.searchKey(LL.of(1,2,3), 3));', out: 'true' },
    ],
  };

  // =====================================================================
  // l4 — Delete Node in a Linked List (LC 237)
  // =====================================================================
  const L4 = [
    `public void deleteNode(ListNode node) {
    ListNode curr = node;
    while (curr.next.next != null) {
        curr.val = curr.next.val;
        curr = curr.next;
    }
    curr.val = curr.next.val;
    curr.next = null;
}`,
    `public void deleteNode(ListNode node) {
    node.val = node.next.val;
    node.next = node.next.next;
}`,
  ];
  const l4Check = ({ head, node }) => {
    if (head.length < 2 || head.length > 6) return 'List me 2 se 6 nodes rakho.';
    if (new Set(head).size !== head.length) return 'Values unique honi chahiye (LeetCode constraint).';
    const i = head.indexOf(node);
    if (i < 0) return 'node ki value list me honi chahiye.';
    if (i === head.length - 1) return 'node tail nahi ho sakta (LeetCode guarantee).';
    return '';
  };

  L.l4 = {
    kind: 'dsa', title: 'Delete Node in a Linked List', topic: 'Linked List', diff: 'E', lc: 237,
    url: 'https://leetcode.com/problems/delete-node-in-a-linked-list/',
    pattern: 'Value copy + bypass (in-place trick)',
    oneLine: 'Pichla node milta hi nahi — toh agle node ki value apne me copy karo aur agle node ko bypass: node.val = node.next.val; node.next = node.next.next.',
    goal: 'Sirf <b>delete hone wala node</b> diya hai, head nahi. Usse list se "hatao". Asli seekh: normal delete me <b>pichle node</b> ka <code>next</code> badalte hain — yahan pichla node pahunch me hi nahi, toh trick: <b>khud agla node ban jao</b> (value copy) aur agle ko hatao. Isliye "node tail nahi hai" wali guarantee zaroori hai.',
    problem: {
      statement: 'There is a singly-linked list <code>head</code> and we want to delete a node <code>node</code> in it. You are given the node to be deleted <code>node</code>. You will <b>not be given access</b> to the first node of <code>head</code>.<br><br>All the values of the linked list are <b>unique</b>, and it is guaranteed that the given node <code>node</code> is not the last node in the linked list.<br><br>Delete the given node. Note that by deleting the node, we do not mean removing it from memory. We mean:<ul><li>The value of the given node should not exist in the linked list.</li><li>The number of nodes in the linked list should decrease by one.</li><li>All the values before <code>node</code> should be in the same order.</li><li>All the values after <code>node</code> should be in the same order.</li></ul><b>Custom testing:</b> For the input, you should provide the entire linked list <code>head</code> and the node to be given <code>node</code>. <code>node</code> should not be the last node of the list and should be an actual node in the list. We will build the linked list and pass the node to your function. The output will be the entire list after calling your function.',
      examples: [
        { input: 'head = [4,5,1,9], node = 5', output: '[4,1,9]', ret: '4 -> 1 -> 9 -> null', explain: 'You are given the second node with value 5, the linked list should become 4 -> 1 -> 9 after calling your function.', viz: { head: '4, 5, 1, 9', node: '5' } },
        { input: 'head = [4,5,1,9], node = 1', output: '[4,5,9]', ret: '4 -> 5 -> 9 -> null', explain: 'You are given the third node with value 1, the linked list should become 4 -> 5 -> 9 after calling your function.', viz: { head: '4, 5, 1, 9', node: '1' } },
        { input: 'head = [1,2,3,4,5], node = 2', output: '[1,3,4,5]', ret: '1 -> 3 -> 4 -> 5 -> null', explain: 'Apna example: Brute me teen values ek-ek karke left khiskti dikhengi; Optimal sirf 2 lines.', viz: { head: '1, 2, 3, 4, 5', node: '2' } },
      ],
      constraints: ['The number of the nodes in the given list is in the range [2, 1000].', '-1000 <= Node.val <= 1000', 'The value of each node in the list is unique.', 'The node to be deleted is in the list and is not a tail node.'],
    },
    approaches: [
      { level: 'Brute', idea: 'Node ke baad wali saari values ek-ek step left khiskao (<code>curr.val = curr.next.val</code>), aur aakhri node (purana tail) ko kaat do — second-last ka <code>next = null</code>. Kaam karta hai, par baaki poori list chalni padti hai.', time: 'O(n)', space: 'O(1)', code: L4[0] },
      { level: 'Optimal', idea: 'Sirf agla node chahiye: uski value apne me copy karo, phir use bypass karo (<code>node.next = node.next.next</code>). Ab "node" wali value list me nahi, aur ek node kam.', time: 'O(1)', space: 'O(1)', code: L4[1] },
    ],
    viz: {
      title: 'Delete Node — copy next value + bypass',
      inputs: [{ key: 'head', label: 'head (poori list — sirf dikhane ke liye)', def: '4, 5, 1, 9' }, { key: 'node', label: 'node (delete karna hai — value)', def: '5', num: true }],
      check: l4Check,
      run({ head, node }) {
        const nodes = mkNodes(head), nid = head.indexOf(node), N = id => nodeName(nodes, id);
        const nx = nodes[nid].next;
        let gone = false;
        const V = () => ({ node: N(nid), 'node.next': N(nodes[nid].next) });
        const P = () => [{ id: 0, label: 'head (hume nahi mila)' }, { id: nid, label: 'node' }].concat(gone ? [{ id: nx, label: 'bypassed' }] : [{ id: nx, label: 'node.next' }]);
        const { st, steps } = K.tracer(L4[1], o => ({ views: [listView('list', nodes, o.hl, P()), K.X('head se padho', K.llStr(nodes, 0))], vars: V() }));
        st('public void deleteNode', `Method call: sirf node = ${N(nid)} mila. Pichla node (${nid > 0 ? N(nid - 1) : 'koi nahi'}) tak pahunch nahi sakte — next sirf aage jaata hai`, { hl: { [nid]: 'cur' } });
        const old = nodes[nid].val;
        nodes[nid].val = nodes[nx].val;
        st('node.val = node.next.val', `node.val = ${nodes[nx].val} (pehle ${old} tha) — ab ${old} list me kahin nahi, par ${nodes[nx].val} do baar hai`, { hl: { [nid]: 'new', [nx]: 'skip' } });
        nodes[nid].next = nodes[nx].next;
        gone = true;
        st('node.next = node.next.next', `node.next = ${N(nodes[nid].next)} — duplicate wala agla node bypass, list me ek node kam`, { hl: { [nid]: 'found', [nx]: 'skip' }, ret: K.llStr(nodes, 0) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Shift values left',
          run({ head, node }) {
            const nodes = mkNodes(head), nid = head.indexOf(node), N = id => nodeName(nodes, id), shifted = {};
            let curr, dropped;
            const V = () => Object.assign({ node: N(nid) }, curr !== undefined ? { curr: N(curr), 'curr.next': N(nodes[curr].next) } : {});
            const P = () => [{ id: 0, label: 'head (hume nahi mila)' }, { id: nid, label: 'node' }].concat(curr !== undefined ? [{ id: curr, label: 'curr' }] : [], dropped !== undefined ? [{ id: dropped, label: 'kat gaya' }] : []);
            const { st, steps } = K.tracer(L4[0], o => ({ views: [listView('list', nodes, Object.assign({}, shifted, o.hl || {}), P()), K.X('head se padho', K.llStr(nodes, 0))], vars: V() }));
            st('public void deleteNode', `Method call: node = ${N(nid)} — iske baad ki saari values ek step left khiskayenge`, { hl: { [nid]: 'cur' } });
            curr = nid;
            st('ListNode curr = node', `curr = node = ${N(curr)}`, { hl: { [curr]: 'cur' } });
            while (true) {
              const a = nodes[curr].next, b = nodes[a].next;
              if (b === null) { st('while (curr.next.next != null)', `curr.next.next = null ✗ → ${N(a)} aakhri node hai, loop ruko`, { hl: { [curr]: 'cur', [a]: 'skip' } }); break; }
              st('while (curr.next.next != null)', `curr.next.next = ${N(b)} ≠ null ✓`, { hl: { [curr]: 'cur' } });
              const old = nodes[curr].val;
              nodes[curr].val = nodes[a].val;
              shifted[curr] = 'done';
              st(['curr.val = curr.next.val', 1], `curr.val = ${nodes[a].val} (pehle ${old}) — value left khiski`, { hl: { [curr]: 'new' } });
              curr = a;
              st('curr = curr.next', `curr = ${N(curr)}`, { hl: { [curr]: 'cur' } });
            }
            const a = nodes[curr].next, old = nodes[curr].val;
            nodes[curr].val = nodes[a].val;
            shifted[curr] = 'done';
            st(['curr.val = curr.next.val', 2], `Aakhri shift: curr.val = ${nodes[a].val} (pehle ${old})`, { hl: { [curr]: 'new', [a]: 'skip' } });
            nodes[curr].next = null;
            dropped = a;
            st('curr.next = null', `curr.next = null — purana tail (${N(a)}) kaat diya, list me ek node kam`, { hl: { [a]: 'skip' }, ret: K.llStr(nodes, 0) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Normal delete vs "sirf node mila" delete', blocks: [
        { p: '<b>Normal delete</b> (head mila ho): node X hataane ke liye uske <b>pichle</b> node <code>prev</code> ka next badlo — <code>prev.next = X.next</code>. Ab X tak koi reference nahi → Java GC use saaf kar dega.' },
        { pre: `Normal:   prev ──► X ──► Y        prev.next = X.next
          prev ─────────► Y        (X bypass)` },
        { p: 'Is problem me <b>head nahi diya</b>, sirf X. Singly linked list me <code>next</code> sirf <b>aage</b> jaata hai — X se pichle node tak jaane ka koi raasta nahi. Toh <code>prev.next</code> badal hi nahi sakte.' },
        { pre: `Trick:    4 ──► [5] ──► 1 ──► 9          node = 5
copy:     4 ──► [1] ──► 1 ──► 9          node.val = node.next.val
bypass:   4 ──► [1] ───────► 9           node.next = node.next.next
                     (purana "1" node ab bekaar → GC)` },
        { tip: '<b>Asal me delete "5 wala object" nahi hua — "agla object" hua.</b> Value-wise list sahi hai: 5 gayab, ek node kam, order same. Isliye LeetCode ne bola "deleting doesn\'t mean removing from memory".' },
        { p: '<b>"Not the tail" guarantee kyun?</b> Tail ka <code>next = null</code> hai — copy karne ke liye agla node hi nahi. Tail ko hataane ke liye pichle node ka <code>next = null</code> karna padta, jo hum pahunch nahi sakte. Isliye ye problem tail pe solvable hi nahi.' },
      ] },
      { title: '📄 Problem — LC 237 Delete Node in a Linked List', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — saari values left khiskao' },
        { p: 'Array me delete kaise karte? Baad ke elements ek-ek left. Wahi yahan: <code>curr = node</code> se, jab tak <code>curr.next.next != null</code> (curr second-last nahi): <code>curr.val = curr.next.val</code>, aage badho. Phir aakhri shift aur second-last ka <code>next = null</code> (purana tail kata). Node ke baad k nodes → <b>O(k) = O(n) time</b>, O(1) space.' },
        { h: 'Better?' },
        { p: 'Alag Better nahi. Brute ko dhyaan se dekho: <b>sirf pehla shift</b> zaroori tha — "5" pehle hi shift me gayab ho gaya. Baaki shifts sirf isliye the ki ek node kam karna tha… jo seedha agla node bypass karke bhi ho jaata hai.' },
        { h: '2. Optimal — copy + bypass' },
        { p: '<code>node.val = node.next.val</code> (ab node "agla node" ban gaya), <code>node.next = node.next.next</code> (duplicate wala agla node hata diya). <b>O(1) time, O(1) space.</b>' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — head = [4, 5, 1, 9], node = 5', blocks: [
        { p: '<b>Optimal</b>' },
        { table: { head: ['Step', 'Line', 'List (head se)'], rows: [
          ['start', '—', '4 → <b>5</b> → 1 → 9'],
          ['1', 'node.val = node.next.val (1)', '4 → <b>1</b> → 1 → 9'],
          ['2', 'node.next = node.next.next (9)', '4 → <b>1</b> → 9'],
        ] } },
        { p: '<b>Brute</b> (same input)' },
        { table: { head: ['curr', 'curr.next.next', 'Action', 'List'], rows: [
          ['Node(5)', 'Node(9) ≠ null', 'curr.val = 1, curr aage', '4 → 1 → 1 → 9'],
          ['Node(1)', 'null', 'loop ruka', ''],
          ['Node(1)', '—', 'curr.val = 9; curr.next = null', '4 → 1 → 9'],
        ] } },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: L4[1] },
        { lines: [
          ['public void deleteNode(ListNode node)', 'Head nahi milta — sirf ye node. void: list in-place badalti hai.'],
          ['node.val = node.next.val;', 'Agle node ki value apne me — ab delete hone wali value list me kahin nahi. (node.next null nahi hai — guarantee.)'],
          ['node.next = node.next.next;', 'Agla node (jiski copy le li) bypass. node.next.next null ho sakta hai — tab node naya tail ban jaata hai, theek hai.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Apna example <code>1, 2, 3, 4, 5</code> + node <code>2</code> chalao: Brute me 3 shifts + tail kaatna, Optimal me bas 2 lines. "head (hume nahi mila)" label yaad dilata hai ki code head use nahi karta.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'node = second-last (jaise [4,5,1,9] me 1) → <code>node.next.next = null</code> → node naya tail. Sahi.',
          'node = head ([4,5,1,9] me 4) → wahi trick, head object same rehta hai par value 5 ho jaati hai → [5,1,9].',
          'node = tail → problem me allowed nahi; <code>node.next.val</code> pe NullPointerException.',
          'Sirf 2 nodes [1,2], node = 1 → [2].',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>node = node.next;</code> likh dena — sirf local variable badla, list wahi ki wahi.',
          '<code>node = null;</code> — same problem, caller ki list pe asar nahi.',
          'Pehle <code>node.next = node.next.next</code> phir value copy → galat node ki value copy ho gayi (order matter karta hai).',
          'Interview me ye na batana ki ye trick tail pe kaam nahi karti aur "object" asal me delete nahi hota.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (shift values)', 'O(n)', 'O(1)', 'node ke baad ke saare nodes chalne padte'],
          ['Optimal (copy + bypass)', 'O(1)', 'O(1)', 'sirf 2 assignments'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why can\'t we delete the node the usual way?', 'The usual way changes prev.next, but we are not given the head and a singly linked list has no back pointer, so the previous node is unreachable.'],
          ['What does your solution actually do?', 'It copies the next node\'s value into the given node and unlinks the next node, so the value disappears and the list shrinks by one.'],
          ['Why must the node not be the tail?', 'The tail has no next node to copy from, and removing it would require setting the previous node\'s next to null, which we cannot reach.'],
          ['What is the complexity?', 'O(1) time and O(1) space — two assignments.'],
          ['Is the original node object removed from memory?', 'No. The given object stays; the next object becomes unreachable and is garbage collected.'],
          ['When could this trick be a problem in real code?', 'If other code holds references to the nodes, their identity and values change unexpectedly; also it fails for the tail.'],
          ['Why does node = node.next not work?', 'It only reassigns the local parameter; Java passes references by value, so the caller\'s list is unchanged.'],
          ['How would you delete a node by value if you had the head?', 'Use a dummy node before the head, walk with prev until prev.next has the value, then set prev.next = prev.next.next; that is LC 203.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Normally I would delete a node by changing the previous node\'s next pointer, but here I only get the node itself and cannot go backwards. So instead of removing this node, I make it become its successor: I copy the next node\'s value into it and then link it to the node after next. The value to delete is gone and the list has one node fewer. It is O(1) time and space, and it relies on the guarantee that the node is not the tail.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['[10, 20, 30, 40], node = 10 — result?', '<b>[20, 30, 40]</b>. Head object wahi, value 20 ho gayi, purana 20 wala node bypass.'],
          ['Do lines ka order ulta kar do toh [4,5,1,9], node = 5 pe kya hoga?', 'Pehle <code>node.next = 9</code>, phir <code>node.val = 9</code> → <b>[4, 9]</b> — 1 bhi gayab. Galat.'],
          ['node tail ho toh kya hoga?', '<code>node.next</code> null → <code>node.next.val</code> pe NullPointerException.'],
        ] },
        { olist: ['Dono lines bina dekhe likho aur "not the tail" kyun — 1 line me bolo.', 'Normal delete (prev.next = curr.next) bhi kaagaz pe draw karo — kal ke problems me chahiye.'] },
      ] },
    ],
    checks: [
      'Samjha sakta hoon pichla node kyun nahi mil sakta',
      'Copy + bypass trick aur lines ka order bata sakta hoon',
      '"Node tail nahi hai" guarantee kyun zaroori hai — bol sakta hoon',
      'Brute (shift) vs Optimal ka complexity farak bata sakta hoon',
    ],
    memory: 'Pichla nahi milta → agla ban jao: node.val = node.next.val; node.next = node.next.next. Tail pe nahi chalta.',
    tests: [
      { run: 'ListNode h = LL.of(4,5,1,9); o.deleteNode(LL.node(h, 1)); System.out.print(LL.str(h));', out: '4 -> 1 -> 9 -> null' },
      { run: 'ListNode h = LL.of(4,5,1,9); o.deleteNode(LL.node(h, 2)); System.out.print(LL.str(h));', out: '4 -> 5 -> 9 -> null' },
      { run: 'ListNode h = LL.of(1,2,3,4,5); o.deleteNode(LL.node(h, 1)); System.out.print(LL.str(h));', out: '1 -> 3 -> 4 -> 5 -> null' },
      { run: 'ListNode h = LL.of(10,20,30,40); o.deleteNode(LL.node(h, 0)); System.out.print(LL.str(h));', out: '20 -> 30 -> 40 -> null' },
      { run: 'ListNode h = LL.of(1,2); o.deleteNode(LL.node(h, 0)); System.out.print(LL.str(h));', out: '2 -> null' },
    ],
  };
})();
