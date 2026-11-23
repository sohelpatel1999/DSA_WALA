// Planner lessons — Linked List part 2 (l5 Reverse Linked List, l6 Merge Two Sorted Lists, l7 Linked List Cycle, l8 Palindrome Linked List)
// Format: planner/LESSON_SPEC.md. Viz: K.LL (stable node ids), recursion tabs K.callStack() frames.
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  // ---------- chhote linked-list helpers (sirf is file ke liye) ----------
  // mk([1,2,3], 'a') → [{id:'a0', val:1, next:'a1'}, ...]  (ids string, stable)
  const mk = (vals, pre) => vals.map((v, i) => ({ id: (pre || '') + i, val: v, next: i + 1 < vals.length ? (pre || '') + (i + 1) : null }));
  const byOf = nodes => { const by = {}; nodes.forEach(n => { by[n.id] = n; }); return by; };
  const nm = (by, id) => (id === null || id === undefined ? 'null' : 'ListNode(val=' + by[id].val + ')');
  const pt = (...pairs) => pairs.filter(p => p[0] !== null && p[0] !== undefined).map(p => ({ id: p[0], label: p[1] }));
  // start se next follow karo (cycle pe ruk jao) → dikhane ke liye nodes ka order
  const chain = (by, start) => { const out = [], seen = new Set(); let c = start; while (c !== null && c !== undefined && !seen.has(c)) { seen.add(c); out.push(by[c]); c = by[c].next; } return out; };
  const sortedCheck = (a, name) => (a.every((v, i) => i === 0 || a[i - 1] <= v) ? '' : name + ' sorted (non-decreasing) hona chahiye.');

  // =====================================================================
  // l5 — Reverse Linked List (LC 206)
  // =====================================================================
  const R5 = [
    `public ListNode reverseList(ListNode head) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (ListNode c = head; c != null; c = c.next) {
        stack.push(c.val);
    }
    for (ListNode c = head; c != null; c = c.next) {
        c.val = stack.pop();
    }
    return head;
}`,
    `public ListNode reverseList(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode newHead = reverseList(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
}`,
    `public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
  ];

  L.l5 = {
    kind: 'dsa', title: 'Reverse Linked List', topic: 'Linked List', diff: 'E', lc: 206,
    url: 'https://leetcode.com/problems/reverse-linked-list/',
    pattern: 'Pointer rewiring (prev / curr / next)',
    oneLine: 'Teen pointer: next save karo, curr.next = prev (link ulta), phir prev aur curr ek kadam aage. Answer = prev.',
    goal: 'Singly linked list ko ulta karo aur naya head return karo. Asli seekh: <b>links ko rewire karna bina list khoye</b> — <code>next</code> pehle save, phir arrow palto. Ye move aage Palindrome (l8), Reverse in k-Group, Reorder List sab me dobara aata hai.',
    problem: {
      statement: 'Given the <code>head</code> of a singly linked list, reverse the list, and return <i>the reversed list</i>.<br><br><b>Follow up:</b> A linked list can be reversed either iteratively or recursively. Could you implement both?',
      examples: [
        { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', ret: '5 -> 4 -> 3 -> 2 -> 1 -> null', explain: 'Har node ka next ulta ho jaata hai; purana tail (5) naya head.', viz: { head: '1, 2, 3, 4, 5' } },
        { input: 'head = [1,2]', output: '[2,1]', ret: '2 -> 1 -> null', explain: '2 ka next 1, 1 ka next null.', viz: { head: '1, 2' } },
        { input: 'head = []', output: '[]', ret: 'null', explain: 'Khaali list ulta karke bhi khaali — return null.', viz: { head: '' } },
      ],
      constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    },
    approaches: [
      { level: 'Brute', idea: 'Saari values stack me push karo, phir list dobara chalo aur har node me <code>stack.pop()</code> likh do. Links same rehte hain, sirf values ulti hoti hain.', time: 'O(n)', space: 'O(n)', code: R5[0] },
      { level: 'Better', idea: 'Recursion: pehle <code>head.next</code> se aage ki list ulta karwao (newHead milega), phir wapas aate hue <code>head.next.next = head</code> aur <code>head.next = null</code>. Values nahi, links ulte hote hain — par call stack O(n).', time: 'O(n)', space: 'O(n) (call stack)', code: R5[1] },
      { level: 'Optimal', idea: 'Iterative prev / curr / next. Har node pe: next save, <code>curr.next = prev</code>, prev = curr, curr = next. Sirf teen pointer.', time: 'O(n)', space: 'O(1)', code: R5[2] },
    ],
    viz: {
      title: 'Reverse Linked List — prev / curr / next (iterative)',
      inputs: [{ key: 'head', label: 'list values (khaali = null)', def: '1, 2, 3, 4, 5' }],
      run({ head }) {
        const nodes = mk(head), by = byOf(nodes), h = nodes.length ? '0' : null, done = {};
        let prev, curr, next;
        const V = () => {
          const v = { head: nm(by, h) };
          if (curr !== undefined) { v.prev = nm(by, prev); v.curr = nm(by, curr); }
          if (next !== undefined) v.next = nm(by, next);
          return v;
        };
        const { st, steps } = K.tracer(R5[2], o => ({ views: [K.LL('list (asli next links)', nodes, Object.assign({}, done, o.hl || {}), pt([h, 'head'], [prev, 'prev'], [curr, 'curr'], [next, 'next']))], vars: V() }));
        st('public ListNode reverseList', `Method call: head = ${K.llStr(nodes, h)}`);
        prev = null; curr = h;
        st('ListNode prev = null', `prev = null (ulti list abhi khaali), curr = head (${nm(by, curr)})`);
        while (true) {
          if (curr === null) { st('while (curr != null)', 'curr = null ✗ → saare links ulte ho gaye, loop khatam'); break; }
          st('while (curr != null)', `curr = ${by[curr].val} ✓ → is node ka link palatna hai`, { hl: { [curr]: 'cur' } });
          next = by[curr].next;
          st('ListNode next = curr.next', `next = ${next === null ? 'null' : by[next].val} — aage ka raasta pehle save, warna link palatte hi kho jayega`, { hl: { [curr]: 'cur' } });
          by[curr].next = prev;
          done[curr] = 'done';
          st('curr.next = prev', `${by[curr].val}.next = ${prev === null ? 'null' : by[prev].val} — arrow ulta!`, { hl: { [curr]: 'new' } });
          prev = curr;
          st('prev = curr;', `prev = ${by[prev].val} — ulti list ka naya head`);
          curr = next;
          st('curr = next;', `curr = ${curr === null ? 'null' : by[curr].val} — saved next pe aage badho`);
          next = undefined;
        }
        st('return prev', `return prev → ${K.llStr(nodes, prev)}`, { hl: K.rng(0, nodes.length - 1, 'found'), ret: K.llStr(nodes, prev) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Stack me values',
          run({ head }) {
            const nodes = mk(head), by = byOf(nodes), h = nodes.length ? '0' : null, stack = [];
            let c;
            const V = () => Object.assign({ head: nm(by, h), stack: '[' + stack.slice().reverse().join(', ') + '] (top pehle)' }, c !== undefined ? { c: nm(by, c) } : {});
            const { st, steps } = K.tracer(R5[0], o => ({ views: [K.LL('list', nodes, o.hl, pt([h, 'head'], [c, 'c'])), K.ST('stack (right = top)', stack, o.sh)], vars: V() }));
            st('public ListNode reverseList', `Method call: head = ${K.llStr(nodes, h)}`);
            st('Deque<Integer> stack', 'Khaali stack — LIFO: jo last push, wo pehle pop. Isse values ulte order me niklengi.');
            for (c = h; ; c = by[c].next) {
              if (c === null) { st(['for (ListNode c = head', 1], 'c = null ✗ → saari values stack me'); break; }
              st(['for (ListNode c = head', 1], `c = ${by[c].val} ✓`, { hl: { [c]: 'cur' } });
              stack.push(by[c].val);
              st('stack.push(c.val)', `push(${by[c].val}) → top = ${by[c].val}`, { hl: { [c]: 'cur' }, sh: { [stack.length - 1]: 'new' } });
            }
            for (c = h; ; c = by[c].next) {
              if (c === null) { st(['for (ListNode c = head', 2], 'c = null ✗ → saari values ulti likh di'); break; }
              st(['for (ListNode c = head', 2], `c = node #${c} (abhi val ${by[c].val}) ✓`, { hl: { [c]: 'cur' } });
              const v = stack.pop();
              by[c].val = v;
              st('c.val = stack.pop()', `pop() = ${v} → is node ki value ${v} (link same, sirf value badli)`, { hl: { [c]: 'new' } });
            }
            c = undefined;
            st('return head', `return head (wahi purana node) → ${K.llStr(nodes, h)}`, { ret: K.llStr(nodes, h) });
            return steps;
          },
        },
        {
          ap: 1, label: 'Recursion',
          run({ head }) {
            const nodes = mk(head), by = byOf(nodes), h0 = nodes.length ? '0' : null, code = R5[1], find = K.finder(code), cs = K.callStack(), fs = [];
            const loc = F => Object.assign({ head: nm(by, F.head) }, F.newHead !== undefined ? { newHead: nm(by, F.newHead) } : {});
            const { st, steps } = K.tracer(code, o => {
              const F = fs[fs.length - 1], frames = cs.frames(o.ln);
              const ptr = F ? pt([F.head, 'head'], [F.newHead, 'newHead']) : [];
              const hl = {}; fs.forEach(f => { if (f.head !== null) hl[f.head] = 'win'; });
              return { views: [K.LL('list (asli next links) — peeli = stack pe pending calls', nodes, Object.assign(hl, o.hl || {}), ptr)], vars: frames[0].vars, frames };
            });
            const S = (snip, note, o) => st(snip, note, Object.assign({ ln: find(snip) }, o || {}));
            const rev = h => {
              const F = { head: h }, top = fs.length === 0;
              fs.push(F);
              cs.push('reverseList', `head=${nm(by, h)}`, () => loc(F));
              const fin = r => { fs.pop(); cs.pop(); return r; };
              const R = r => (top ? { ret: K.llStr(nodes, r) } : {});
              S('public ListNode reverseList', `reverseList(head = ${h === null ? 'null' : by[h].val}) — list yahan se: ${K.llStr(nodes, h)}`);
              if (h === null || by[h].next === null) {
                S('if (head == null', h === null ? 'head == null → khaali list, return null' : `head.next == null → akela node ${by[h].val} khud hi ulti list ka head → return`, Object.assign({ hl: h === null ? {} : { [h]: 'found' } }, R(h)));
                return fin(h);
              }
              S('if (head == null', `head (${by[h].val}) ke aage aur nodes hain → pehle baaki list ulta karwao`, { hl: { [h]: 'cur' } });
              S('ListNode newHead', `call: reverseList(${by[by[h].next].val}) — aage ki list ka kaam recursion pe`, { hl: { [h]: 'cur' } });
              F.newHead = rev(by[h].next);
              S('ListNode newHead', `Wapas aaye: newHead = ${by[F.newHead].val} (aage ki list ulti ho chuki: ${K.llStr(nodes, F.newHead)})`, { hl: { [h]: 'cur' } });
              const nx = by[h].next;
              by[nx].next = h;
              S('head.next.next = head', `head.next (${by[nx].val}).next = ${by[h].val} — agla node ab mujhe point karta hai`, { hl: { [h]: 'cur', [nx]: 'new' } });
              by[h].next = null;
              S('head.next = null', `${by[h].val}.next = null — purana aage wala link toda (warna 2-node cycle)`, { hl: { [h]: 'new' } });
              S('return newHead', `return newHead = ${by[F.newHead].val} → ${K.llStr(nodes, F.newHead)}`, R(F.newHead));
              return fin(F.newHead);
            };
            rev(h0);
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Linked list me "arrow palatna"', blocks: [
        { p: 'Linked list me har node sirf <b>aage wale ka address</b> (<code>next</code>) jaanta hai. Ulta karna = har arrow ki direction palatna: <code>a → b</code> ko <code>a ← b</code>. Dikkat: jaise hi <code>curr.next</code> badla, aage ki list ka raasta kho gaya. Isliye <b>pehle next save, phir palto</b>.' },
        { pre: `Shuru:   null   1 → 2 → 3 → null
         prev  curr

Ek step: next = 2;  1.next = null;  prev = 1;  curr = 2
         null ← 1    2 → 3 → null
                prev curr

End:     null ← 1 ← 2 ← 3      curr = null, prev = 3 = naya head` },
        { tip: 'Ye 4 line ka block (<code>next = curr.next; curr.next = prev; prev = curr; curr = next;</code>) ratt lo — l8 Palindrome me second half ulta karne ke liye yahi copy-paste hoga.' },
      ] },
      { title: '📄 Problem — LC 206 Reverse Linked List', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — values ulti karo (stack)' },
        { p: 'Links chhodo, sirf values: list chalo aur har value stack me push. Phir dobara chalo aur har node me <code>pop()</code> likho — stack LIFO hai toh values ulte order me aati hain. <b>O(n)</b> time, <b>O(n)</b> extra space. Interviewer bolega "nodes ko mat chhedo values ke liye, links ulto" — kyunki asli systems me node ke andar bada data ho sakta hai.' },
        { h: '2. Better — recursion (links ulte, par stack O(n))' },
        { p: 'Socho: <code>reverseList(head.next)</code> baaki list ulta karke uska head (newHead) de deta hai. Ab sirf ek kaam bacha: head ka agla node (jo ab ulti list ka tail hai) mujhe point kare → <code>head.next.next = head</code>, aur mera purana link todo → <code>head.next = null</code>. Base case: khaali ya ek node. <b>O(n)</b> time, par <b>O(n)</b> call stack (5000 nodes tak theek, bahut lambi list pe StackOverflow).' },
        { h: '3. Optimal — iterative prev / curr / next' },
        { p: 'Recursion jo kaam wapas aate hue karta hai, wahi aage jaate hue karo: <code>prev</code> = ulti list ka head, <code>curr</code> = abhi wala node. Har step pe next save, <code>curr.next = prev</code>, dono aage. Loop khatam pe <code>curr = null</code> aur <code>prev</code> = naya head. <b>O(n)</b> time, <b>O(1)</b> space.' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — head = [1, 2, 3] (Optimal)', blocks: [
        { table: { head: ['Step', 'curr', 'next (save)', 'curr.next = prev', 'prev', 'Ulti list (prev se)'], rows: [
          ['start', '1', '—', '—', 'null', 'null'],
          ['1', '1', '2', '1 → null', '1', '1 → null'],
          ['2', '2', '3', '2 → 1', '2', '2 → 1 → null'],
          ['3', '3', 'null', '3 → 2', '3', '3 → 2 → 1 → null'],
          ['end', 'null', '—', '—', '3', 'return <b>3 → 2 → 1 → null</b>'],
        ] } },
        { p: '<b>Recursion (Better) [1, 2, 3]:</b> rev(1) → rev(2) → rev(3) base (3 akela) → wapas rev(2): 3.next = 2, 2.next = null → wapas rev(1): 2.next = 1, 1.next = null → newHead 3 sabse neeche se upar tak return.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: R5[2] },
        { lines: [
          ['ListNode prev = null, curr = head;', 'prev = ulti list (abhi khaali = null). Pehla node ka next null banega — wahi naya tail.'],
          ['while (curr != null)', 'Har node pe ek baar — n iterations.'],
          ['ListNode next = curr.next;', 'Aage ka raasta save. Ye na karo toh agli line ke baad list ka baaki hissa unreachable.'],
          ['curr.next = prev;', 'Asli kaam: arrow ulta.'],
          ['prev = curr;', 'Ulti list ab curr tak badh gayi.'],
          ['curr = next;', 'Saved node pe aage.'],
          ['return prev;', 'Loop ke baad curr null hai; prev purana tail = naya head. (<code>return curr</code> galti hai.)'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute (stack) → Better (recursion, CALL STACK + 🌳 tree) → Optimal</b>. Arrows dekho: <code>←</code> matlab link ulta ho gaya. Apna input: <code>7</code> (ek node) ya <code>1, 1, 2</code>.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Khaali list (<code>head = null</code>) → loop chalega hi nahi → return prev = null.',
          'Ek node <code>[7]</code> → 7.next = null hi rehta hai, return 7.',
          'Do node <code>[1,2]</code> → recursion me <code>head.next = null</code> bhoole toh 1 ⇄ 2 cycle.',
          'Duplicate values <code>[1,1,2]</code> → koi farak nahi, hum nodes palat rahe hain values nahi.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>next</code> save kiye bina <code>curr.next = prev</code> → list ka baaki hissa kho gaya.',
          '<code>return head</code> ya <code>return curr</code> — sahi <code>return prev</code>.',
          'Recursion me <code>head.next = null</code> bhool jana → purana head aur doosra node ek doosre ko point → cycle.',
          'Brute (values swap) ko final answer bolna — interviewer links reverse karwana chahta hai.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (stack of values)', 'O(n)', 'O(n)', 'do pass, stack me n values'],
          ['Better (recursion)', 'O(n)', 'O(n)', 'har node ek call; call stack n deep'],
          ['Optimal (iterative)', 'O(n)', 'O(1)', 'ek pass, sirf teen pointer'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why do you store next before changing curr.next?', 'Once curr.next points back to prev, the only reference to the rest of the list is gone, so I save it first.'],
          ['Why do you return prev and not curr?', 'The loop ends when curr becomes null; prev then points to the old tail, which is the new head.'],
          ['What is the space complexity of the recursive version?', 'O(n) because of the call stack, one frame per node. The iterative version is O(1).'],
          ['Why set head.next = null in the recursive version?', 'Otherwise the old first node still points forward, and with head.next.next = head the last two nodes form a cycle.'],
          ['Is swapping values a valid solution?', 'It passes, but it uses O(n) extra space and does not really reverse the structure; real nodes may hold large data, so we rewire pointers instead.'],
          ['How would you reverse only part of a list, from position left to right (LC 92)?', 'Walk to the node before left, then apply the same prev/curr/next loop for right − left + 1 nodes and reconnect both ends.'],
          ['Where is list reversal reused?', 'Palindrome Linked List, Reorder List, Reverse Nodes in k-Group and Add Two Numbers II all reverse a list or part of it.'],
          ['What happens for an empty list or a single node?', 'The loop runs zero or one time; we return null or the same node, no special case needed.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'I reverse the links in a single pass with three pointers. prev starts as null and curr at the head. For each node I first save curr.next, then point curr.next back to prev, then move prev to curr and curr to the saved next. When curr becomes null, prev is the new head. This is O(n) time and O(1) space. A recursive version also works, but it uses O(n) stack space.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['head = [4, 8] — Optimal ke 2 iterations ke baad prev aur curr kya honge?', 'Iteration 1: prev = 4, curr = 8. Iteration 2: prev = 8, curr = null. Return <b>8 → 4 → null</b>.'],
          ['Optimal me <code>ListNode next = curr.next;</code> line hata do — kya hoga?', 'Pehle hi step pe 1.next = null ho jayega aur curr ko aage le jaane ka raasta nahi bachega — list ka baaki hissa kho jayega.'],
          ['Recursion me head = [1, 2, 3] pe sabse pehle kaunsa link ulta hota hai?', 'Sabse gehri call (head = 2) me: <b>3.next = 2</b>. Recursion wapas aate hue kaam karta hai.'],
        ] },
        { olist: ['Iterative code 3 min me bina dekhe likho.', 'Recursive code bhi likho aur bolo base case kya hai.'] },
      ] },
    ],
    checks: [
      'Stack (values) → Recursion → Iterative ka farak aur space bol sakta hoon',
      'Samjha sakta hoon kyun <b>next pehle save</b> aur kyun <b>return prev</b>',
      'Recursion me <code>head.next = null</code> kyun zaroori — samjha',
      'Iterative code 3 min me bina dekhe likh sakta hoon',
    ],
    memory: 'Save next → ulta karo (curr.next = prev) → prev = curr → curr = next. End me prev hi head.',
    tests: [
      { run: 'System.out.print(LL.str(o.reverseList(LL.of(1,2,3,4,5))));', out: '5 -> 4 -> 3 -> 2 -> 1 -> null' },
      { run: 'System.out.print(LL.str(o.reverseList(LL.of(1,2))));', out: '2 -> 1 -> null' },
      { run: 'System.out.print(LL.str(o.reverseList(LL.of())));', out: 'null' },
      { run: 'System.out.print(LL.str(o.reverseList(LL.of(7))));', out: '7 -> null' },
      { run: 'System.out.print(LL.str(o.reverseList(LL.of(1,1,2))));', out: '2 -> 1 -> 1 -> null' },
    ],
  };

  // =====================================================================
  // l6 — Merge Two Sorted Lists (LC 21)
  // =====================================================================
  const M6 = [
    `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    List<Integer> vals = new ArrayList<>();
    for (ListNode c = list1; c != null; c = c.next) {
        vals.add(c.val);
    }
    for (ListNode c = list2; c != null; c = c.next) {
        vals.add(c.val);
    }
    Collections.sort(vals);
    ListNode dummy = new ListNode(0), tail = dummy;
    for (int v : vals) {
        tail.next = new ListNode(v);
        tail = tail.next;
    }
    return dummy.next;
}`,
    `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    if (list1 == null) return list2;
    if (list2 == null) return list1;
    if (list1.val <= list2.val) {
        list1.next = mergeTwoLists(list1.next, list2);
        return list1;
    }
    list2.next = mergeTwoLists(list1, list2.next);
    return list2;
}`,
    `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    ListNode dummy = new ListNode(-1), tail = dummy;
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
  ];
  const mergeInputs = [{ key: 'list1', label: 'list1 (sorted)', def: '1, 2, 4' }, { key: 'list2', label: 'list2 (sorted)', def: '1, 3, 4' }];
  const mergeCheck = ({ list1, list2 }) => sortedCheck(list1, 'list1') || sortedCheck(list2, 'list2');

  L.l6 = {
    kind: 'dsa', title: 'Merge Two Sorted Lists', topic: 'Linked List', diff: 'E', lc: 21,
    url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    pattern: 'Dummy node + two pointers (merge step)',
    oneLine: 'Dummy node se shuru; dono heads me jo chhota, use tail ke peeche jodo aur us list ko aage badhao. End me bacha hua hissa seedha jod do.',
    goal: 'Do sorted lists ko ek sorted list me jodo — <b>naye nodes banaye bina</b>, sirf links jod ke. Asli seekh: <b>dummy node trick</b> (head ka special case khatam) aur merge sort ka <b>merge step</b>.',
    problem: {
      statement: 'You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>.<br><br>Merge the two lists into one <b>sorted</b> list. The list should be made by splicing together the nodes of the first two lists.<br><br>Return <i>the head of the merged linked list</i>.',
      examples: [
        { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]', ret: '1 -> 1 -> 2 -> 3 -> 4 -> 4 -> null', explain: 'Dono lists ke nodes sorted order me jud gaye.', viz: { list1: '1, 2, 4', list2: '1, 3, 4' } },
        { input: 'list1 = [], list2 = []', output: '[]', ret: 'null', explain: 'Dono khaali → null.', viz: { list1: '', list2: '' } },
        { input: 'list1 = [], list2 = [0]', output: '[0]', ret: '0 -> null', explain: 'Ek khaali hai → doosri list hi answer.', viz: { list1: '', list2: '0' } },
        { input: 'list1 = [2,5], list2 = [1,3]', output: '[1,2,3,5]', ret: '1 -> 2 -> 3 -> 5 -> null', explain: 'Apna example: yahan list2 pehle khatam hoti hai, toh recursion ka <code>list2 == null</code> base case bhi chalega.', viz: { list1: '2, 5', list2: '1, 3' } },
      ],
      constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100', 'Both list1 and list2 are sorted in non-decreasing order.'],
    },
    approaches: [
      { level: 'Brute', idea: 'Dono lists ki saari values ek ArrayList me daalo, sort karo, aur un values se nayi list banao. Sorted hone ka fayda nahi uthaya, naye nodes bhi bane.', time: 'O((n+m) log(n+m))', space: 'O(n+m)', code: M6[0] },
      { level: 'Better', idea: 'Recursion: chhote head wala node answer ka head hai; uska next = baaki dono ka merge (recursive call). Linear time, par har node pe ek call frame.', time: 'O(n+m)', space: 'O(n+m) (call stack)', code: M6[1] },
      { level: 'Optimal', idea: 'Iterative with dummy node: tail ke peeche hamesha chhota head jodo, us list ko aage badhao. Ek list khatam → doosri ka bacha hissa seedha jod do.', time: 'O(n+m)', space: 'O(1)', code: M6[2] },
    ],
    viz: {
      title: 'Merge Two Sorted Lists — dummy + tail (iterative)',
      inputs: mergeInputs,
      check: mergeCheck,
      run({ list1, list2 }) {
        const A = mk(list1, 'a'), B = mk(list2, 'b'), D = { id: 'd', val: -1, next: null }, by = byOf(A.concat(B, [D]));
        let l1 = A.length ? 'a0' : null, l2 = B.length ? 'b0' : null, tail;
        const V = () => {
          const v = { list1: nm(by, l1), list2: nm(by, l2) };
          if (tail !== undefined) { v.dummy = 'ListNode(val=-1)'; v.tail = nm(by, tail); }
          return v;
        };
        const views = o => {
          const out = [];
          if (tail !== undefined) {
            const ch = chain(by, 'd'), hl = {};
            for (const n of ch) { hl[n.id] = 'done'; if (n.id === tail) break; }
            out.push(K.LL('merged: dummy → … (tail tak pakka)', ch, Object.assign(hl, o.hl || {}), pt(['d', 'dummy'], [tail, 'tail'])));
          }
          out.push(K.LL('list1 (bacha hua)', chain(by, l1), o.h1 || {}, pt([l1, 'list1'])));
          out.push(K.LL('list2 (bacha hua)', chain(by, l2), o.h2 || {}, pt([l2, 'list2'])));
          return out;
        };
        const { st, steps } = K.tracer(M6[2], o => ({ views: views(o), vars: V() }));
        st('public ListNode mergeTwoLists', `Method call: list1 = ${K.llStr(A, l1)}, list2 = ${K.llStr(B, l2)}`);
        tail = 'd';
        st('ListNode dummy', 'dummy = nakli node (-1), tail = dummy. Ab "pehla node kaun" ka special case nahi — sab tail ke peeche judega.');
        while (true) {
          if (!(l1 !== null && l2 !== null)) { st('while (list1 != null && list2 != null)', `${l1 === null ? 'list1' : 'list2'} = null ✗ → ek list khatam, loop band`); break; }
          st('while (list1 != null && list2 != null)', `list1 = ${by[l1].val}, list2 = ${by[l2].val} — dono bache hain ✓`, { h1: { [l1]: 'cur' }, h2: { [l2]: 'cur' } });
          if (by[l1].val <= by[l2].val) {
            st('if (list1.val <= list2.val)', `${by[l1].val} <= ${by[l2].val} ✓ → list1 ka node chhota (barabar pe list1 — stable)`, { h1: { [l1]: 'found' }, h2: { [l2]: 'cur' } });
            by[tail].next = l1;
            st('tail.next = list1;', `tail.next = ${by[l1].val} — merged list me joda`, { hl: { [l1]: 'new' } });
            l1 = by[l1].next;
            st('list1 = list1.next', `list1 aage → ${nm(by, l1)}`);
          } else {
            st('if (list1.val <= list2.val)', `${by[l1].val} > ${by[l2].val} → list2 ka node chhota`, { h1: { [l1]: 'cur' }, h2: { [l2]: 'found' } });
            by[tail].next = l2;
            st('tail.next = list2;', `tail.next = ${by[l2].val} — merged list me joda`, { hl: { [l2]: 'new' } });
            l2 = by[l2].next;
            st('list2 = list2.next', `list2 aage → ${nm(by, l2)}`);
          }
          tail = by[tail].next;
          st('tail = tail.next', `tail = ${by[tail].val} — merged list ka naya aakhri node`);
        }
        const rest = l1 !== null ? l1 : l2;
        by[tail].next = rest;
        st('tail.next = (list1', rest === null ? 'Dono khatam → tail.next = null' : `${l1 !== null ? 'list1' : 'list2'} bachi hai (${K.llStr(Object.values(by), rest)}) → poora hissa ek hi link se jod diya`, rest === null ? {} : { hl: { [rest]: 'new' } });
        const ans = D.next;
        st('return dummy.next', `return dummy.next → ${K.llStr(Object.values(by), ans)} (dummy khud answer me nahi)`, { ret: K.llStr(Object.values(by), ans) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Values sort karke nayi list',
          run({ list1, list2 }) {
            const A = mk(list1, 'a'), B = mk(list2, 'b'), byA = byOf(A), byB = byOf(B), vals = [], nn = [];
            const h1 = A.length ? 'a0' : null, h2 = B.length ? 'b0' : null;
            let c, v, tail, dummy = null;
            const byN = () => byOf(nn);
            const V = () => {
              const o = { list1: nm(byA, h1), list2: nm(byB, h2), vals: K.iA(vals) };
              if (c !== undefined) o.c = c === null ? 'null' : 'ListNode(val=' + (byA[c] || byB[c]).val + ')';
              if (dummy) { o.dummy = 'ListNode(val=0)'; o.tail = nm(byN(), tail); }
              if (v !== undefined) o.v = v;
              return o;
            };
            const views = o => {
              const out = [K.LL('list1', A, o.h1 || {}, pt([h1, 'list1'])), K.LL('list2', B, o.h2 || {}, pt([h2, 'list2'])), K.A('vals', vals, o.vh, o.vp)];
              if (dummy) out.push(K.LL('nayi list: dummy → …', chain(byN(), 'd'), o.hl || {}, pt(['d', 'dummy'], [tail, 'tail'])));
              return out;
            };
            const { st, steps } = K.tracer(M6[0], o => ({ views: views(o), vars: V() }));
            st('public ListNode mergeTwoLists', `Method call: list1 = ${K.llStr(A, h1)}, list2 = ${K.llStr(B, h2)}`);
            st('List<Integer> vals', 'Khaali ArrayList — saari values yahan aayengi');
            for (c = h1; ; c = byA[c].next) {
              if (c === null) { st('for (ListNode c = list1', 'c = null ✗ → list1 ki values ho gayi'); break; }
              st('for (ListNode c = list1', `c = ${byA[c].val} ✓`, { h1: { [c]: 'cur' } });
              vals.push(byA[c].val);
              st(['vals.add(c.val)', 1], `vals.add(${byA[c].val}) → ${K.iA(vals)}`, { h1: { [c]: 'cur' }, vh: { [vals.length - 1]: 'new' } });
            }
            for (c = h2; ; c = byB[c].next) {
              if (c === null) { st('for (ListNode c = list2', 'c = null ✗ → list2 ki values bhi ho gayi'); break; }
              st('for (ListNode c = list2', `c = ${byB[c].val} ✓`, { h2: { [c]: 'cur' } });
              vals.push(byB[c].val);
              st(['vals.add(c.val)', 2], `vals.add(${byB[c].val}) → ${K.iA(vals)}`, { h2: { [c]: 'cur' }, vh: { [vals.length - 1]: 'new' } });
            }
            c = undefined;
            vals.sort((x, y) => x - y);
            st('Collections.sort(vals)', `Sort → ${K.iA(vals)} — O(k log k), lists already sorted thi par ye fayda nahi liya`, { vh: K.rng(0, vals.length - 1, 'done') });
            dummy = true; nn.push({ id: 'd', val: 0, next: null }); tail = 'd';
            st('ListNode dummy = new ListNode(0)', 'dummy (0) + tail = dummy — nayi list yahin se banegi');
            for (let k = 0; ; k++) {
              if (k >= vals.length) { v = undefined; st('for (int v : vals)', 'Saari values ho gayi ✗ → loop khatam'); break; }
              v = vals[k];
              st('for (int v : vals)', `v = ${v}`, { vh: { [k]: 'cur' }, vp: [{ i: k, label: 'v' }] });
              const id = 'n' + k;
              nn.push({ id, val: v, next: null }); byN()[tail].next = id;
              st('tail.next = new ListNode(v)', `naya node ${v} banaya aur tail ke peeche joda`, { vh: { [k]: 'cur' }, hl: { [id]: 'new' } });
              tail = id;
              st('tail = tail.next', `tail = ${v}`, { vh: { [k]: 'done' } });
            }
            const by = byN(), ans = by.d.next;
            st('return dummy.next', `return dummy.next → ${K.llStr(nn, ans)}`, { ret: K.llStr(nn, ans) });
            return steps;
          },
        },
        {
          ap: 1, label: 'Recursion',
          run({ list1, list2 }) {
            const A = mk(list1, 'a'), B = mk(list2, 'b'), all = A.concat(B), by = byOf(all), code = M6[1], find = K.finder(code), cs = K.callStack(), fs = [];
            const loc = F => Object.assign({ list1: nm(by, F.l1), list2: nm(by, F.l2) }, F.r !== undefined ? { returned: nm(by, F.r) } : {});
            const { st, steps } = K.tracer(code, o => {
              const F = fs[fs.length - 1], frames = cs.frames(o.ln);
              const views = F ? [
                K.LL('list1 (is call me)', chain(by, F.l1), o.h1 || {}, pt([F.l1, 'list1'])),
                K.LL('list2 (is call me)', chain(by, F.l2), o.h2 || {}, pt([F.l2, 'list2'])),
              ] : [];
              return { views, vars: frames[0].vars, frames };
            });
            const S = (snip, note, o) => st(snip, note, Object.assign({ ln: find(snip) }, o || {}));
            const rec = (l1, l2) => {
              const F = { l1, l2 }, top = fs.length === 0;
              fs.push(F);
              cs.push('mergeTwoLists', `list1=${nm(by, l1)}, list2=${nm(by, l2)}`, () => loc(F));
              const fin = r => { fs.pop(); cs.pop(); return r; };
              const R = r => (top ? { ret: K.llStr(all, r) } : {});
              S('public ListNode mergeTwoLists', `merge(list1 = ${l1 === null ? 'null' : by[l1].val}, list2 = ${l2 === null ? 'null' : by[l2].val})`);
              if (l1 === null) { S('if (list1 == null)', `list1 null → baaki list2 hi answer: ${K.llStr(all, l2)}`, R(l2)); return fin(l2); }
              S('if (list1 == null)', 'list1 null nahi');
              if (l2 === null) { S('if (list2 == null)', `list2 null → baaki list1 hi answer: ${K.llStr(all, l1)}`, R(l1)); return fin(l1); }
              S('if (list2 == null)', 'list2 null nahi');
              if (by[l1].val <= by[l2].val) {
                S('if (list1.val <= list2.val)', `${by[l1].val} <= ${by[l2].val} ✓ → list1 ka node (${by[l1].val}) is hisse ka head`, { h1: { [l1]: 'found' }, h2: { [l2]: 'cur' } });
                S('list1.next = mergeTwoLists', `call: merge(list1.next = ${nm(by, by[l1].next)}, list2 = ${by[l2].val})`, { h1: { [l1]: 'found' } });
                const r = rec(by[l1].next, l2);
                by[l1].next = r; F.r = r;
                S('list1.next = mergeTwoLists', `Wapas aaye: list1.next = ${nm(by, r)} → ${K.llStr(all, l1)}`, { h1: { [l1]: 'new' } });
                S(['return list1;', 2], `return list1 (${by[l1].val}) → ${K.llStr(all, l1)}`, R(l1));
                return fin(l1);
              }
              S('if (list1.val <= list2.val)', `${by[l1].val} > ${by[l2].val} → list2 ka node (${by[l2].val}) is hisse ka head`, { h1: { [l1]: 'cur' }, h2: { [l2]: 'found' } });
              S('list2.next = mergeTwoLists', `call: merge(list1 = ${by[l1].val}, list2.next = ${nm(by, by[l2].next)})`, { h2: { [l2]: 'found' } });
              const r = rec(l1, by[l2].next);
              by[l2].next = r; F.r = r;
              S('list2.next = mergeTwoLists', `Wapas aaye: list2.next = ${nm(by, r)} → ${K.llStr(all, l2)}`, { h2: { [l2]: 'new' } });
              S(['return list2;', 2], `return list2 (${by[l2].val}) → ${K.llStr(all, l2)}`, R(l2));
              return fin(l2);
            };
            rec(A.length ? 'a0' : null, B.length ? 'b0' : null);
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Dummy node + merge step', blocks: [
        { p: '<b>Merge step</b> (merge sort wala): do sorted sequences ke aage wale elements compare karo, chhota uthao, us side ko aage badhao. Har compare pe ek element final jagah pe — total O(n + m).' },
        { p: '<b>Dummy node trick:</b> answer ka pehla node kaun hoga, ye shuru me pata nahi — toh <code>if (head == null) head = node; else tail.next = node;</code> jaisa special case likhna padta. Iske bajay ek nakli node <code>dummy</code> banao, sab kuch <code>tail.next</code> pe jodo, end me <code>dummy.next</code> return karo. Head ka special case gayab.' },
        { pre: `list1: 1 → 2 → 4        list2: 1 → 3 → 4
dummy → 1(l1) → 1(l2) → 2 → 3 → 4(l1) → 4(l2) → null
return dummy.next` },
        { tip: 'Linked list me <b>naye nodes nahi</b> banane — sirf <code>next</code> links jodne hain ("splicing"). Isliye extra space O(1). Ye dummy trick aage Remove Nth Node, Partition List, Add Two Numbers (l9) me bhi kaam aayegi.' },
      ] },
      { title: '📄 Problem — LC 21 Merge Two Sorted Lists', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — values sort karke nayi list' },
        { p: 'Dono lists ki values ArrayList me, <code>Collections.sort</code>, phir nayi list. <b>O((n+m) log(n+m))</b> time, <b>O(n+m)</b> space. Do galti: lists already sorted thi (fayda nahi liya), aur problem nodes ko "splice" karne bolta hai, naye banane nahi.' },
        { h: '2. Better — recursion' },
        { p: 'Dono heads me jo chhota (maan lo list1), wahi answer ka head. Uske baad kya aayega? <code>list1.next</code> aur <code>list2</code> ka merge — wahi problem, chhoti. Toh <code>list1.next = merge(list1.next, list2); return list1;</code>. Base case: koi list null → doosri return. <b>O(n+m)</b> time, par <b>O(n+m)</b> call stack.' },
        { h: '3. Optimal — iterative + dummy' },
        { p: 'Recursion ko loop me badlo: <code>tail</code> merged list ka aakhri node. Har step pe chhota head <code>tail.next</code> pe jodo, us list ko aage, tail aage. Ek list khatam → doosri ka bacha hissa already sorted hai, ek link se jod do. <b>O(n+m)</b> time, <b>O(1)</b> space.' },
        { tip: '<code>&lt;=</code> (na ki <code>&lt;</code>) se barabar values me list1 pehle aata hai — merge <b>stable</b> rehta hai. Merge sort ki stability isi pe tiki hai.' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — list1 = [1, 2, 4], list2 = [1, 3, 4] (Optimal)', blocks: [
        { table: { head: ['Step', 'list1', 'list2', 'Compare', 'Joda', 'Merged (dummy ke baad)'], rows: [
          ['1', '1', '1', '1 <= 1 ✓', '1 (list1)', '1'],
          ['2', '2', '1', '2 > 1', '1 (list2)', '1, 1'],
          ['3', '2', '3', '2 <= 3 ✓', '2', '1, 1, 2'],
          ['4', '4', '3', '4 > 3', '3', '1, 1, 2, 3'],
          ['5', '4', '4', '4 <= 4 ✓', '4 (list1)', '1, 1, 2, 3, 4'],
          ['end', 'null', '4', 'loop band', 'tail.next = list2', '<b>1, 1, 2, 3, 4, 4</b>'],
        ] } },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: M6[2] },
        { lines: [
          ['ListNode dummy = new ListNode(-1), tail = dummy;', 'Nakli head. Value kuch bhi ho, answer me nahi jaayega. tail = merged list ka aakhri node.'],
          ['while (list1 != null && list2 != null)', 'Compare tabhi jab dono me node bache.'],
          ['if (list1.val <= list2.val)', 'Chhota head chuno; <code>&lt;=</code> se stable.'],
          ['tail.next = list1; list1 = list1.next;', 'Node ko merged list me jodo aur list1 ko aage badhao. (else me same list2 ke liye.)'],
          ['tail = tail.next;', 'tail naye jode node pe — warna agla node overwrite hoga.'],
          ['tail.next = (list1 != null) ? list1 : list2;', 'Bacha hua hissa already sorted — poora ek link se. Dono null ho toh null.'],
          ['return dummy.next;', 'Asli head. <code>return dummy</code> galti hai (-1 aa jayega).'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute (sort) → Better (recursion) → Optimal</b>. Optimal me upar wali row <code>dummy</code> se chain hai — green = tail tak pakka hissa. Apna input: list1 <code>5</code>, list2 <code>1, 2, 3</code>.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Dono khaali → loop nahi chalega, tail.next = null, return null.',
          'Ek khaali (<code>[]</code>, <code>[0]</code>) → seedha doosri list.',
          'Ek list poori doosri se chhoti: <code>[1,2,3]</code> + <code>[7,8]</code> → pehle saare list1, phir list2 ek link me.',
          'Duplicates / negatives <code>[-3,0,0]</code> + <code>[-1,0]</code> → <code>-3,-1,0,0,0</code>.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          '<code>tail = tail.next</code> bhool jana → har naya node pichle ko overwrite karta hai.',
          'Loop ke baad bacha hissa jodna bhool jana → answer adhoora.',
          '<code>return dummy</code> likhna (dummy.next chahiye).',
          'Har node ke liye <code>new ListNode</code> banana — kaam karta hai par O(n+m) extra space; problem splicing maangta hai.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (sort values)', 'O((n+m) log(n+m))', 'O(n+m)', 'sort + values list + naye nodes'],
          ['Better (recursion)', 'O(n+m)', 'O(n+m)', 'har node pe ek call frame'],
          ['Optimal (dummy + loop)', 'O(n+m)', 'O(1)', 'har node ek baar, sirf pointers'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why use a dummy node?', 'It removes the special case for the head of the result: every node is attached to tail.next, and at the end I return dummy.next.'],
          ['What happens when one list runs out?', 'The rest of the other list is already sorted, so I attach it with a single pointer assignment.'],
          ['Why <= instead of < in the comparison?', 'With <=, equal values from list1 come first, which keeps the merge stable. Both are correct for this problem.'],
          ['Do you create new nodes?', 'No, I only rewire next pointers of existing nodes, so the extra space is O(1).'],
          ['What is the space complexity of the recursive solution?', 'O(n + m) because each call adds a stack frame; for very long lists it can overflow the stack.'],
          ['How would you merge k sorted lists?', 'Use a min-heap of the current heads (O(N log k)) or merge pairs divide-and-conquer style; this function is the building block.'],
          ['How is this related to merge sort?', 'It is exactly the merge step. Merge sort on a linked list splits it with slow/fast pointers and merges with this function, giving O(n log n) with O(1) extra space for merging.'],
          ['Time complexity?', 'O(n + m): each comparison places one node, and every node is placed once.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'I create a dummy node and a tail pointer. While both lists have nodes, I compare their heads, attach the smaller one to tail.next, and advance that list and the tail. When one list is empty, I attach the remainder of the other, since it is already sorted. I return dummy.next. This splices existing nodes, so it is O(n + m) time and O(1) extra space. A recursive version is shorter but uses O(n + m) stack.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['list1 = [5], list2 = [1, 2, 3] — loop kitni baar chalega aur end me kya joda jayega?', 'Loop <b>3 baar</b> (1, 2, 3 list2 se), phir list2 null → <code>tail.next = list1</code> (5). Answer 1 → 2 → 3 → 5.'],
          ['<code>tail = tail.next</code> hata do toh [1,3] + [2] ka kya hoga?', 'tail hamesha dummy pe → dummy.next baar baar overwrite → end me dummy.next = 3 (bacha hissa) → galat answer <b>3 → null</b>.'],
          ['Recursion me [2,5] + [1,3] ki call chain likho.', 'merge(2,1) → merge(2,3) → merge(5,3) → merge(5,null) → list2 null → return 5. Wapas: 3.next = 5, 2.next = 3, 1.next = 2 → 1 → 2 → 3 → 5.'],
        ] },
        { olist: ['Optimal code 4 min me bina dekhe likho.', 'Recursive version bhi likho aur dono ka space compare karo.'] },
      ] },
    ],
    checks: [
      'Dummy node kyun — apne words me bol sakta hoon',
      'Bacha hua hissa ek link se kyun jud jaata hai — samjha',
      'Recursive aur iterative ka space farak bol sakta hoon',
      'Iterative code 4 min me bina dekhe likh sakta hoon',
    ],
    memory: 'dummy + tail: chhota head tail ke peeche, tail aage. Ek khatam → doosri poori jod do. return dummy.next.',
    tests: [
      { run: 'System.out.print(LL.str(o.mergeTwoLists(LL.of(1,2,4), LL.of(1,3,4))));', out: '1 -> 1 -> 2 -> 3 -> 4 -> 4 -> null' },
      { run: 'System.out.print(LL.str(o.mergeTwoLists(LL.of(), LL.of())));', out: 'null' },
      { run: 'System.out.print(LL.str(o.mergeTwoLists(LL.of(), LL.of(0))));', out: '0 -> null' },
      { run: 'System.out.print(LL.str(o.mergeTwoLists(LL.of(2,5), LL.of(1,3))));', out: '1 -> 2 -> 3 -> 5 -> null' },
      { run: 'System.out.print(LL.str(o.mergeTwoLists(LL.of(5), LL.of(1,2,3))));', out: '1 -> 2 -> 3 -> 5 -> null' },
      { run: 'System.out.print(LL.str(o.mergeTwoLists(LL.of(-3,0,0), LL.of(-1,0))));', out: '-3 -> -1 -> 0 -> 0 -> 0 -> null' },
    ],
  };

  // =====================================================================
  // l7 — Linked List Cycle (LC 141)
  // =====================================================================
  const C7 = [
    `public boolean hasCycle(ListNode head) {
    Set<ListNode> seen = new HashSet<>();
    ListNode curr = head;
    while (curr != null) {
        if (seen.contains(curr)) return true;
        seen.add(curr);
        curr = curr.next;
    }
    return false;
}`,
    `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
  ];
  const cycleInputs = [
    { key: 'head', label: 'list values', def: '3, 2, 0, -4' },
    { key: 'pos', label: 'pos (tail kis index se jude; -1 = no cycle)', def: '1', num: true },
  ];
  const cycleCheck = ({ head, pos }) => (Number.isInteger(pos) && pos >= -1 && pos < head.length ? '' : `pos -1 ya 0..${head.length - 1} hona chahiye.`);
  const cycleBuild = (head, pos) => {
    const nodes = mk(head);
    if (pos >= 0 && nodes.length) nodes[nodes.length - 1].next = String(pos);
    const txt = pos >= 0 && nodes.length ? `tail (${nodes[nodes.length - 1].val}).next → index ${pos} (${nodes[pos].val}) — cycle hai` : 'tail.next = null — cycle nahi';
    return { nodes, by: byOf(nodes), h: nodes.length ? '0' : null, txt };
  };
  const cycStr = (nodes, pos) => (nodes.length ? nodes.map(n => n.val).join(' -> ') + (pos >= 0 ? ` -> (wapas ${nodes[pos].val})` : ' -> null') : 'null');

  L.l7 = {
    kind: 'dsa', title: 'Linked List Cycle', topic: 'Linked List', diff: 'E', lc: 141,
    url: 'https://leetcode.com/problems/linked-list-cycle/',
    pattern: 'Fast & slow pointers (Floyd)',
    oneLine: 'slow 1 kadam, fast 2 kadam. Cycle hai toh fast ek din slow ko pakad lega; nahi toh fast null tak pahunch jayega.',
    goal: 'Batao list me cycle hai ya nahi. Asli seekh: <b>Floyd ka slow/fast pointer</b> — do alag speed ke pointer se O(1) space me cycle pakadna. Yahi trick middle dhoondhne (l8) aur cycle ka start dhoondhne (l10) me aayegi.',
    problem: {
      statement: 'Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it.<br><br>There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer. Internally, <code>pos</code> is used to denote the index of the node that tail\'s <code>next</code> pointer is connected to. <b>Note that <code>pos</code> is not passed as a parameter.</b><br><br>Return <code>true</code> <i>if there is a cycle in the linked list</i>. Otherwise, return <code>false</code>.<br><br><b>Follow up:</b> Can you solve it using <code>O(1)</code> (i.e. constant) memory?',
      examples: [
        { input: 'head = [3,2,0,-4], pos = 1', output: 'true', explain: 'There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).', viz: { head: '3, 2, 0, -4', pos: '1' } },
        { input: 'head = [1,2], pos = 0', output: 'true', explain: 'There is a cycle in the linked list, where the tail connects to the 0th node.', viz: { head: '1, 2', pos: '0' } },
        { input: 'head = [1], pos = -1', output: 'false', explain: 'There is no cycle in the linked list.', viz: { head: '1', pos: '-1' } },
        { input: 'head = [1,2,3,4], pos = -1', output: 'false', explain: 'Apna example: lambi list bina cycle — fast do-do kadam chal ke null pe pahunchta hai.', viz: { head: '1, 2, 3, 4', pos: '-1' } },
      ],
      constraints: ['The number of the nodes in the list is in the range [0, 10^4].', '-10^5 <= Node.val <= 10^5', 'pos is -1 or a valid index in the linked-list.'],
    },
    approaches: [
      { level: 'Brute', idea: 'Har node ko HashSet me daalo (node ka reference, value nahi). Koi node dobara mile → cycle. null tak pahunch gaye → nahi.', time: 'O(n)', space: 'O(n)', code: C7[0] },
      { level: 'Optimal', idea: 'Floyd: slow ek kadam, fast do kadam. Cycle me fast har round gap 1 se kam karta hai → milna pakka. Cycle nahi toh fast null pe.', time: 'O(n)', space: 'O(1)', code: C7[1] },
    ],
    viz: {
      title: 'Linked List Cycle — Floyd slow / fast',
      inputs: cycleInputs,
      check: cycleCheck,
      run({ head, pos }) {
        const { nodes, by, h, txt } = cycleBuild(head, pos);
        let slow, fast;
        const V = () => Object.assign({ head: nm(by, h) }, slow !== undefined ? { slow: nm(by, slow) + (slow !== null ? ' #' + slow : ''), fast: nm(by, fast) + (fast !== null && fast !== undefined ? ' #' + fast : '') } : {});
        const { st, steps } = K.tracer(C7[1], o => ({ views: [K.LL('list (#index) — last node ka next dekho', nodes, o.hl || {}, pt([h, 'head'], [slow, 'slow'], [fast, 'fast'])), K.X('cycle', txt)], vars: V() }));
        st('public boolean hasCycle', `Method call: head = ${cycStr(nodes, pos)}`);
        slow = h; fast = h;
        st('ListNode slow = head, fast = head', `slow = fast = head (${nm(by, h)}) — dono ek hi jagah se race shuru`);
        while (true) {
          const ok = fast !== null && by[fast].next !== null;
          if (!ok) { st('while (fast != null', `${fast === null ? 'fast = null' : `fast.next = null (fast = ${by[fast].val})`} ✗ → list ka end mil gaya, cycle nahi`); break; }
          st('while (fast != null', `fast = ${by[fast].val}, fast.next = ${by[by[fast].next].val} ✓ → fast do kadam chal sakta hai`);
          slow = by[slow].next;
          st('slow = slow.next', `slow 1 kadam → #${slow} (${by[slow].val})`, { hl: { [slow]: 'cur' } });
          const mid = by[fast].next;
          fast = by[mid].next;
          st('fast = fast.next.next', `fast 2 kadam → ${fast === null ? 'null' : `#${fast} (${by[fast].val})`}`, { hl: Object.assign({ [slow]: 'cur' }, fast !== null ? { [fast]: 'win' } : {}) });
          if (slow === fast) { st('if (slow == fast)', `slow aur fast dono #${slow} pe — same node! Cycle pakka → return true`, { hl: { [slow]: 'found' }, ret: 'true' }); return steps; }
          st('if (slow == fast)', `slow #${slow} ≠ fast ${fast === null ? 'null' : '#' + fast} → race jaari`);
        }
        st('return false', 'Fast end tak pahunch gaya → cycle nahi → return false', { ret: 'false' });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'HashSet of nodes',
          run({ head, pos }) {
            const { nodes, by, h, txt } = cycleBuild(head, pos), seen = [];
            let curr;
            const lab = id => `#${id}(${by[id].val})`;
            const V = () => Object.assign({ head: nm(by, h), seen: 'HashSet size=' + seen.length + ' [' + seen.map(lab).join(', ') + ']' }, curr !== undefined ? { curr: nm(by, curr) + (curr !== null ? ' #' + curr : '') } : {});
            const { st, steps } = K.tracer(C7[0], o => ({ views: [K.LL('list (#index)', nodes, o.hl || {}, pt([h, 'head'], [curr, 'curr'])), K.S('seen (node references, value nahi)', seen.map(lab), o.sh), K.X('cycle', txt)], vars: V() }));
            st('public boolean hasCycle', `Method call: head = ${cycStr(nodes, pos)}`);
            st('Set<ListNode> seen', 'Khaali HashSet — dekhe hue nodes (reference) yahan');
            curr = h;
            st('ListNode curr = head', `curr = head (${nm(by, h)})`, { hl: h === null ? {} : { [h]: 'cur' } });
            while (true) {
              if (curr === null) { st('while (curr != null)', 'curr = null ✗ → end mil gaya, cycle nahi'); break; }
              st('while (curr != null)', `curr = #${curr} (${by[curr].val}) ✓`, { hl: { [curr]: 'cur' } });
              if (seen.includes(curr)) { st('if (seen.contains(curr))', `#${curr} pehle dekha hua hai → wapas aa gaye → cycle! return true`, { hl: { [curr]: 'found' }, sh: lab(curr), ret: 'true' }); return steps; }
              st('if (seen.contains(curr))', `#${curr} naya node`, { hl: { [curr]: 'cur' } });
              seen.push(curr);
              st('seen.add(curr)', `seen.add(#${curr})`, { hl: { [curr]: 'done' }, sh: lab(curr) });
              curr = by[curr].next;
              st('curr = curr.next', `curr aage → ${curr === null ? 'null' : `#${curr} (${by[curr].val})`}`, { hl: curr === null ? {} : { [curr]: 'cur' } });
            }
            curr = undefined;
            st('return false', 'Koi node dobara nahi mila → return false', { ret: 'false' });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Tortoise & hare (slow / fast pointers)', blocks: [
        { p: 'Ek circular track pe do runner: ek 1 m/s, doosra 2 m/s. Tez wala kabhi na kabhi dheeme wale ko <b>peeche se pakad leta hai</b>. Seedhi sadak (end hai) pe tez wala bas end tak pahunch jaata hai. Linked list me bhi yahi: <code>slow</code> 1 node, <code>fast</code> 2 node per step.' },
        { pre: `3 → 2 → 0 → -4
    ↑         │
    └─────────┘     (tail.next = index 1)

step  slow  fast
 0     3     3
 1     2     0
 2     0     2
 3    -4    -4   ← mil gaye → cycle` },
        { p: '<b>Milna pakka kyun?</b> Dono cycle me aa gaye toh har step pe fast slow se 1 node aur paas aata hai (2 − 1 = 1). Gap k ho toh k steps me 0 — skip karke aage nikalna possible hi nahi.' },
        { tip: 'Two pointers ka hi bhai hai: a2 me read/write pointer alag kaam karte the, a8 me dono ends se. Yahan dono pointer <b>ek hi direction</b> me par <b>alag speed</b> se. Kal l8 me isi se list ka middle nikaalenge.' },
      ] },
      { title: '📄 Problem — LC 141 Linked List Cycle', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — dekhe hue nodes yaad rakho' },
        { p: 'List chalo; har node <b>HashSet&lt;ListNode&gt;</b> me daalo. Agar koi node pehle se set me hai → hum ghoom ke wapas aaye → cycle. null mila → cycle nahi. Values nahi, <b>node reference</b> store karo — values duplicate ho sakti hain. <b>O(n)</b> time, <b>O(n)</b> space.' },
        { h: 'Better?' },
        { p: 'Yahan genuinely alag Better nahi hai — Brute ke baad seedha Optimal. (Nodes ko "visited" mark karna / list todna input kharab karta hai, isliye wo valid approach nahi.)' },
        { h: '2. Optimal — Floyd slow / fast' },
        { p: 'Set ki zaroorat kyun? Bas pata karna hai ki "loop hai ya nahi". Do pointer, alag speed: loop hai toh fast slow ko pakad lega; loop nahi toh fast null pe pahunchega. Loop condition <code>fast != null && fast.next != null</code> — kyunki fast do kadam chalta hai. <b>O(n)</b> time, <b>O(1)</b> space (follow-up yahi maangta hai).' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — head = [3, 2, 0, -4], pos = 1 (Optimal)', blocks: [
        { table: { head: ['Iteration', 'slow (#)', 'fast (#)', 'slow == fast?'], rows: [
          ['start', '3 (#0)', '3 (#0)', '— (check loop ke andar)'],
          ['1', '2 (#1)', '0 (#2)', 'No'],
          ['2', '0 (#2)', '2 (#1)', 'No'],
          ['3', '-4 (#3)', '-4 (#3)', '<b>Yes → true</b>'],
        ] } },
        { p: '<b>No cycle [1, 2, 3, 4]:</b> iteration 1: slow = 2, fast = 3. Iteration 2: slow = 3, fast = null → loop condition fail → <b>false</b>.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: C7[1] },
        { lines: [
          ['ListNode slow = head, fast = head;', 'Dono head se. (Khaali list: fast null → loop nahi → false.)'],
          ['while (fast != null && fast.next != null)', 'fast ko do kadam chalna hai — dono null-check zaroori, order bhi (pehle fast).'],
          ['slow = slow.next;', 'Kachhua: 1 kadam. slow kabhi null nahi hoga kyunki fast aage hai.'],
          ['fast = fast.next.next;', 'Khargosh: 2 kadam.'],
          ['if (slow == fast) return true;', '<code>==</code> = same node (reference), values nahi. Move ke <b>baad</b> check — start pe dono barabar hote hain.'],
          ['return false;', 'fast ne end dekh liya → cycle nahi.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Do input: <b>values</b> aur <b>pos</b> (tail kis index se jude; -1 = no cycle). Last node ka "next:" dekho — cycle me wo kisi pichle node ki value dikhayega. Apna try karo: <code>1, 2, 3, 4, 5</code> pos <code>2</code>.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Khaali list → fast = null → false.',
          'Ek node, no cycle <code>[1]</code>, pos −1 → fast.next = null → false.',
          'Ek node khud pe cycle <code>[1]</code>, pos 0 → slow = 1, fast = 1 → true.',
          'Poori list ek circle (pos 0) ya sirf aakhri node pe self-loop (pos = n−1) — dono me Floyd milta hai.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Sirf <code>fast.next != null</code> check karna → fast null hone pe NullPointerException.',
          'Move se <b>pehle</b> <code>slow == fast</code> check → start pe hi true (dono head pe).',
          'HashSet me values store karna → <code>[1, 1]</code> bina cycle bhi true aa jayega.',
          '<code>slow.val == fast.val</code> compare karna — duplicate values pe galat; reference <code>==</code> chahiye.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (HashSet)', 'O(n)', 'O(n)', 'har node ek baar, set me n tak references'],
          ['Optimal (Floyd)', 'O(n)', 'O(1)', 'slow cycle me ek chakkar poora karne se pehle pakda jaata hai; sirf do pointer'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why are slow and fast guaranteed to meet if there is a cycle?', 'Once both are inside the cycle, the gap between them shrinks by one node every step, so it must reach zero; fast cannot jump over slow.'],
          ['Why does fast move two steps and not three?', 'Two is the simplest speed that guarantees meeting and keeps the null checks easy; other speeds also work with a cycle but need more checks.'],
          ['Why check both fast and fast.next for null?', 'fast moves two steps, so both fast and fast.next must exist, otherwise we get a NullPointerException.'],
          ['Why store nodes and not values in the HashSet?', 'Values can repeat without a cycle; only the same node reference proves we came back.'],
          ['What is the time complexity of Floyd?', 'O(n): before the cycle slow takes at most n steps, and inside the cycle fast catches it within one loop length.'],
          ['How do you find where the cycle starts (LC 142)?', 'After they meet, move one pointer to head and step both by one; they meet at the cycle start.'],
          ['Can you modify the list to detect a cycle?', 'You could mark nodes, but it changes the input and is not acceptable in most interviews; Floyd keeps the list unchanged.'],
          ['Where else is the slow/fast idea used?', 'Finding the middle of a list, palindrome list, Happy Number and Find the Duplicate Number.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'A simple solution keeps a HashSet of visited nodes and returns true when a node repeats, which is O(n) space. To use O(1) space I use Floyd’s algorithm: slow moves one step and fast moves two. If there is no cycle, fast reaches null and I return false. If there is a cycle, fast gains one node per step on slow inside the loop, so they must meet, and I return true. Time is O(n), space O(1).'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['head = [1, 2], pos = 0 — kitne iterations me milenge?', 'Iteration 1: slow = 2, fast = 1 (2 kadam: 1→2→1). Iteration 2: slow = 1, fast = 1 → <b>2 iterations</b>, true.'],
          ['<code>if (slow == fast)</code> loop ke shuru me (move se pehle) rakh do — kya hoga?', 'Pehle hi iteration me dono head pe → hamesha <b>true</b>, bina cycle wali list pe bhi (agar 2+ nodes).'],
          ['[5, 5, 5] bina cycle — HashSet&lt;Integer&gt; (values) wala galat kya dega?', 'Doosre 5 pe "pehle dekha" → <b>true</b> — galat. Isliye HashSet&lt;ListNode&gt;.'],
        ] },
        { olist: ['Floyd code 2 min me bina dekhe likho.', 'Socho: milne ke baad cycle ki length kaise nikaaloge? (Ek pointer rok ke doosra ghumao.)'] },
      ] },
    ],
    checks: [
      'HashSet (node, value nahi) aur Floyd ka farak bol sakta hoon',
      'Samjha sakta hoon kyun fast slow ko pakadta hi hai',
      'Loop condition <code>fast != null && fast.next != null</code> kyun — samjha',
      'Floyd code 2 min me bina dekhe likh sakta hoon',
    ],
    memory: 'slow 1, fast 2. Mil gaye → cycle. fast/fast.next null → no cycle.',
    tests: [
      { run: 'System.out.print(o.hasCycle(LL.cycle(new int[]{3,2,0,-4}, 1)));', out: 'true' },
      { run: 'System.out.print(o.hasCycle(LL.cycle(new int[]{1,2}, 0)));', out: 'true' },
      { run: 'System.out.print(o.hasCycle(LL.cycle(new int[]{1}, -1)));', out: 'false' },
      { run: 'System.out.print(o.hasCycle(LL.cycle(new int[]{1,2,3,4}, -1)));', out: 'false' },
      { run: 'System.out.print(o.hasCycle(LL.cycle(new int[]{1}, 0)));', out: 'true' },
      { run: 'System.out.print(o.hasCycle(LL.of()));', out: 'false' },
      { run: 'System.out.print(o.hasCycle(LL.cycle(new int[]{5,5,5}, -1)));', out: 'false' },
    ],
  };

  // =====================================================================
  // l8 — Palindrome Linked List (LC 234)
  // =====================================================================
  const P8 = [
    `public boolean isPalindrome(ListNode head) {
    List<Integer> vals = new ArrayList<>();
    for (ListNode c = head; c != null; c = c.next) {
        vals.add(c.val);
    }
    int i = 0, j = vals.size() - 1;
    while (i < j) {
        if (!vals.get(i).equals(vals.get(j))) return false;
        i++;
        j--;
    }
    return true;
}`,
    `public boolean isPalindrome(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    ListNode prev = null, curr = slow;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    ListNode left = head, right = prev;
    while (right != null) {
        if (left.val != right.val) return false;
        left = left.next;
        right = right.next;
    }
    return true;
}`,
  ];

  L.l8 = {
    kind: 'dsa', title: 'Palindrome Linked List', topic: 'Linked List', diff: 'E', lc: 234,
    url: 'https://leetcode.com/problems/palindrome-linked-list/',
    pattern: 'Slow/fast middle + reverse second half',
    oneLine: 'slow/fast se middle, middle se aage ki list ulti (l5), phir head aur ulti half ko saath-saath compare.',
    goal: 'Batao list aage se aur peeche se same padhti hai ya nahi — <b>O(1) extra space</b> me. Asli seekh: do purane tools jodna — <b>l7 ka slow/fast</b> (middle ke liye) + <b>l5 ka reverse</b> (peeche se padhne ke liye).',
    problem: {
      statement: 'Given the <code>head</code> of a singly linked list, return <code>true</code> <i>if it is a palindrome or</i> <code>false</code> <i>otherwise</i>.<br><br><b>Follow up:</b> Could you do it in <code>O(n)</code> time and <code>O(1)</code> space?',
      examples: [
        { input: 'head = [1,2,2,1]', output: 'true', explain: 'Aage se 1 2 2 1, peeche se 1 2 2 1 — same.', viz: { head: '1, 2, 2, 1' } },
        { input: 'head = [1,2]', output: 'false', explain: 'Peeche se 2 1 — alag.', viz: { head: '1, 2' } },
        { input: 'head = [1,2,3,2,1]', output: 'true', explain: 'Apna example (odd length): beech wala 3 dono halves me common — compare me khud se hi milta hai.', viz: { head: '1, 2, 3, 2, 1' } },
      ],
      constraints: ['The number of nodes in the list is in the range [1, 10^5].', '0 <= Node.val <= 9'],
    },
    approaches: [
      { level: 'Brute', idea: 'Values ArrayList me copy karo, phir array pe two pointers (i aage se, j peeche se) compare.', time: 'O(n)', space: 'O(n)', code: P8[0] },
      { level: 'Optimal', idea: 'slow/fast se middle; middle se list ulti (prev/curr/next); phir head aur ulti half ka head ek saath chalao aur values compare.', time: 'O(n)', space: 'O(1)', code: P8[1] },
    ],
    viz: {
      title: 'Palindrome Linked List — middle + reverse half + compare',
      inputs: [{ key: 'head', label: 'list values (kam se kam 1)', def: '1, 2, 2, 1' }],
      check: ({ head }) => (head.length ? '' : 'Kam se kam ek node chahiye (constraint).'),
      run({ head }) {
        const nodes = mk(head), by = byOf(nodes), h = '0', rv = {};
        let slow, fast, prev, curr, next, left, right;
        const V = () => {
          const v = { head: nm(by, h) };
          if (slow !== undefined) { v.slow = nm(by, slow); v.fast = nm(by, fast); }
          if (curr !== undefined) { v.prev = nm(by, prev); v.curr = nm(by, curr); }
          if (next !== undefined) v.next = nm(by, next);
          if (left !== undefined) { v.left = nm(by, left); v.right = nm(by, right); }
          return v;
        };
        const ptr = () => pt([h, 'head'], [slow, 'slow'], [fast, 'fast'], [prev, 'prev'], [curr, 'curr'], [next, 'next'], [left, 'left'], [right, 'right']);
        const { st, steps } = K.tracer(P8[1], o => ({ views: [K.LL('list (asli next links) — green = ulti hui second half', nodes, Object.assign({}, rv, o.hl || {}), ptr())], vars: V() }));
        st('public boolean isPalindrome', `Method call: head = ${K.llStr(nodes, h)}`);
        slow = h; fast = h;
        st('ListNode slow = head, fast = head', 'Phase 1: middle dhoondo — slow 1 kadam, fast 2 kadam');
        while (true) {
          if (!(fast !== null && by[fast].next !== null)) { st('while (fast != null', `${fast === null ? 'fast = null' : 'fast.next = null'} ✗ → slow = ${by[slow].val} (#${slow}) = second half ki shuruaat`, { hl: { [slow]: 'found' } }); break; }
          st('while (fast != null', `fast = ${by[fast].val}, fast.next ✓`);
          slow = by[slow].next;
          st('slow = slow.next', `slow → #${slow} (${by[slow].val})`, { hl: { [slow]: 'cur' } });
          fast = by[by[fast].next].next;
          st('fast = fast.next.next', `fast → ${fast === null ? 'null' : `#${fast} (${by[fast].val})`}`);
        }
        prev = null; curr = slow;
        st('ListNode prev = null, curr = slow', `Phase 2: slow (${by[slow].val}) se aage ki list ulti karo — l5 wala hi code`, { hl: { [curr]: 'cur' } });
        while (true) {
          if (curr === null) { st('while (curr != null)', `curr = null ✗ → second half ulti, uska head prev = ${by[prev].val}`); break; }
          st('while (curr != null)', `curr = ${by[curr].val} ✓`, { hl: { [curr]: 'cur' } });
          next = by[curr].next;
          st('ListNode next = curr.next', `next = ${next === null ? 'null' : by[next].val} (save)`, { hl: { [curr]: 'cur' } });
          by[curr].next = prev; rv[curr] = 'done';
          st('curr.next = prev', `${by[curr].val}.next = ${prev === null ? 'null' : by[prev].val} — link ulta`, { hl: { [curr]: 'new' } });
          prev = curr;
          st('prev = curr;', `prev = ${by[prev].val}`);
          curr = next;
          st('curr = next;', `curr = ${curr === null ? 'null' : by[curr].val}`);
          next = undefined;
        }
        left = h; right = prev;
        st('ListNode left = head, right = prev', `Phase 3: left = head (${by[left].val}), right = ulti half ka head (${by[right].val}) — ab saath-saath compare`, { hl: { [left]: 'cur', [right]: 'cur' } });
        while (true) {
          if (right === null) { st('while (right != null)', 'right = null ✗ → second half poori match ho gayi'); break; }
          st('while (right != null)', `right = ${by[right].val} ✓`, { hl: { [left]: 'cur', [right]: 'cur' } });
          if (by[left].val !== by[right].val) { st('if (left.val != right.val)', `${by[left].val} ≠ ${by[right].val} → palindrome nahi → return false`, { hl: { [left]: 'skip', [right]: 'skip' }, ret: 'false' }); return steps; }
          st('if (left.val != right.val)', `${by[left].val} == ${by[right].val} ✓ match`, { hl: { [left]: 'found', [right]: 'found' } });
          left = by[left].next;
          st('left = left.next', `left → ${nm(by, left)}`);
          right = by[right].next;
          st('right = right.next', `right → ${nm(by, right)}`);
        }
        st('return true', 'Saare pairs match → return true', { ret: 'true' });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'ArrayList + two pointers',
          run({ head }) {
            const nodes = mk(head), by = byOf(nodes), h = '0', vals = [];
            let c, i, j;
            const V = () => {
              const v = { head: nm(by, h), vals: K.iA(vals) };
              if (c !== undefined) v.c = nm(by, c);
              if (i !== undefined) { v.i = i; v.j = j; }
              return v;
            };
            const { st, steps } = K.tracer(P8[0], o => ({ views: [K.LL('list', nodes, o.lh || {}, pt([h, 'head'], [c, 'c'])), K.A('vals', vals, o.hl, i !== undefined ? [{ i, label: 'i' }, { i: j, label: 'j' }] : [])], vars: V() }));
            st('public boolean isPalindrome', `Method call: head = ${K.llStr(nodes, h)}`);
            st('List<Integer> vals', 'Khaali ArrayList — list ki values copy hongi (array me index se dono taraf ja sakte hain)');
            for (c = h; ; c = by[c].next) {
              if (c === null) { st('for (ListNode c = head', 'c = null ✗ → copy ho gaya'); break; }
              st('for (ListNode c = head', `c = ${by[c].val} ✓`, { lh: { [c]: 'cur' } });
              vals.push(by[c].val);
              st('vals.add(c.val)', `vals.add(${by[c].val}) → ${K.iA(vals)}`, { lh: { [c]: 'cur' }, hl: { [vals.length - 1]: 'new' } });
            }
            c = undefined;
            i = 0; j = vals.length - 1;
            st('int i = 0, j', `i = 0, j = ${j}`, { hl: { [i]: 'cur', [j]: 'cur' } });
            while (true) {
              if (!(i < j)) { st('while (i < j)', `i (${i}) < j (${j}) ✗ → beech tak sab match`); break; }
              st('while (i < j)', `i (${i}) < j (${j}) ✓`, { hl: { [i]: 'cur', [j]: 'cur' } });
              if (vals[i] !== vals[j]) { st('if (!vals.get(i)', `vals[${i}] = ${vals[i]} ≠ vals[${j}] = ${vals[j]} → return false`, { hl: { [i]: 'skip', [j]: 'skip' }, ret: 'false' }); return steps; }
              st('if (!vals.get(i)', `vals[${i}] = ${vals[i]} == vals[${j}] = ${vals[j]} ✓`, { hl: { [i]: 'found', [j]: 'found' } });
              i++;
              st('i++;', `i → ${i}`);
              j--;
              st('j--;', `j → ${j}`);
            }
            st('return true', 'Saare pairs match → return true', { ret: 'true' });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Do tools jodo: middle + reverse', blocks: [
        { p: 'Palindrome = aage se padho ya peeche se, same. Array me easy: i aage se, j peeche se. Singly linked list me <b>peeche nahi ja sakte</b>. Trick: list ka <b>second half ulta kar do</b> — ab second half bhi "aage" chal ke peeche wali values deta hai.' },
        { pre: `1 → 2 → 2 → 1          slow/fast → slow = index 2 (second half start)
1 → 2 → 2 → null        reverse(slow): right = 1 → 2 → null
left:  1 → 2 → (2)
right: 1 → 2 → null     compare 1=1, 2=2, right null → true` },
        { p: '<b>Middle kaise?</b> l7 wala slow/fast: fast 2 kadam, slow 1 kadam — fast end pe pahunche toh slow beech me. Even length (4) pe slow = index 2 (second middle), odd (5) pe slow = index 2 (exact beech).' },
        { tip: 'Reverse ka code bilkul <b>l5 Optimal</b> wala hai — sirf <code>curr = slow</code> se shuru. Ek baar likhne ki aadat ho jaaye toh ye problem 3 known blocks ka jod hai.' },
      ] },
      { title: '📄 Problem — LC 234 Palindrome Linked List', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — array me copy' },
        { p: 'List ki values ArrayList me, phir a2/a3 jaisa two-pointer: i = 0, j = end, beech tak compare. <b>O(n)</b> time, <b>O(n)</b> space. Follow-up O(1) space maangta hai.' },
        { h: 'Better?' },
        { p: 'Stack me values daal ke compare karna (ya recursion se peeche se compare) bhi <b>O(n) space</b> hi hai — Brute jaisa idea, isliye alag Better nahi rakha. Seedha Optimal.' },
        { h: '2. Optimal — middle, reverse, compare' },
        { p: '(1) slow/fast se second half ka start. (2) Wahan se list ulti — <code>prev</code> uska naya head. (3) <code>left = head</code>, <code>right = prev</code>; jab tak right null nahi, values compare, dono aage. Koi mismatch → false. <b>O(n)</b> time, <b>O(1)</b> space. Interview me bolo: "chaahe toh second half wapas reverse karke list restore kar sakta hoon" — input modify karna kuch interviewers ko pasand nahi.' },
        { tip: 'Odd length me beech wala node left aur right dono raston pe aata hai — khud se compare hota hai, toh koi special case nahi. Loop <code>right != null</code> pe chalao (right half chhoti ya barabar hai).' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — head = [1, 2, 3, 2, 1] (Optimal)', blocks: [
        { table: { head: ['Phase', 'State', 'Note'], rows: [
          ['1 middle', 'slow 1→2→3, fast 1→3→1(last)', 'fast.next = null → slow = 3 (index 2)'],
          ['2 reverse', '3 → null, 2 → 3, 1 → 2', 'right half = 1 → 2 → 3 → null, prev = 1 (last node)'],
          ['3 compare', 'left 1 vs right 1 ✓', ''],
          ['', 'left 2 vs right 2 ✓', ''],
          ['', 'left 3 vs right 3 ✓ (same node)', 'right = null → loop band'],
          ['end', '', 'return <b>true</b>'],
        ] } },
        { p: '<b>[1, 2]:</b> slow = 2 (index 1); reverse → right = 2; compare 1 vs 2 → <b>false</b>.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: P8[1] },
        { lines: [
          ['ListNode slow = head, fast = head;', 'Phase 1 shuru — l7 jaisa race.'],
          ['while (fast != null && fast.next != null)', 'Fast end pe → slow second half ki shuruaat pe.'],
          ['slow = slow.next; fast = fast.next.next;', '1 aur 2 kadam.'],
          ['ListNode prev = null, curr = slow;', 'Phase 2: slow se reverse (l5 ka code).'],
          ['ListNode next = curr.next; curr.next = prev; prev = curr; curr = next;', 'Save → ulta → aage. End me prev = ulti half ka head (purana tail).'],
          ['ListNode left = head, right = prev;', 'Phase 3: dono taraf se padhne wale pointer.'],
          ['while (right != null)', 'Right half chhoti/barabar hai — uske khatam hone tak compare.'],
          ['if (left.val != right.val) return false;', 'Yahan <code>int</code> compare hai, toh <code>!=</code> safe (Integer objects nahi).'],
          ['left = left.next; right = right.next;', 'Dono ek kadam.'],
          ['return true;', 'Koi mismatch nahi.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Optimal me teen phase dekho: slow/fast race → second half ke arrows <code>←</code> ho jaate hain → left/right compare. Apna input: <code>1, 2, 3, 1</code> (false) ya <code>7</code> (true).' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Ek node <code>[7]</code> → slow = 7, reverse ek node, compare 7 = 7 → true.',
          'Do same <code>[4,4]</code> → true; do alag <code>[1,2]</code> → false.',
          'Odd length <code>[1,2,3,2,1]</code> → beech wala khud se compare, true.',
          'Lagbhag palindrome <code>[1,2,3,1]</code> → doosre pair (2 vs 3) pe false.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Brute me <code>vals.get(i) != vals.get(j)</code> — Integer objects ka reference compare! −128..127 tak cache se chal jaata hai, bade values pe galat. <code>.equals</code> use karo.',
          'Compare loop <code>left != null</code> pe chalana — left half me beech ka node bhi hai aur uska next abhi bhi second half ke purane node pe, faltu/galat compare ho sakta hai. <code>right != null</code> lo.',
          'Reverse me <code>next</code> save karna bhoolna (l5 wali galti).',
          'Middle ke liye pehle length ginna aur phir n/2 chalna — kaam karta hai par 2 pass; slow/fast ek pass.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (ArrayList)', 'O(n)', 'O(n)', 'copy + n/2 compares'],
          ['Optimal (middle + reverse)', 'O(n)', 'O(1)', 'n/2 (middle) + n/2 (reverse) + n/2 (compare); sirf pointers'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['How do you find the middle of the list?', 'With slow and fast pointers: slow moves one step, fast two; when fast reaches the end, slow is at the middle.'],
          ['Why reverse the second half and not the first?', 'We reach the second half naturally after finding the middle, and reversing it lets us walk it from the end towards the middle.'],
          ['How do you handle odd length lists?', 'The middle node ends up in both halves and is compared with itself, so no special case is needed.'],
          ['Why loop while right != null?', 'The reversed second half is never longer than the first half, so it decides when we are done.'],
          ['Does your solution modify the input?', 'Yes, it reverses the second half. If required, I reverse it back after comparing to restore the original list.'],
          ['What is the space complexity of the stack or array approach?', 'O(n), because every value is stored once.'],
          ['Why use equals in the ArrayList version?', 'get returns Integer objects; != compares references and only works by luck for cached values between -128 and 127.'],
          ['Time and space of the optimal solution?', 'O(n) time with three linear passes over parts of the list, and O(1) extra space.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'The easy way copies the values into an array and compares from both ends, but that uses O(n) space. For O(1) space I do three steps. First, slow and fast pointers find the start of the second half. Second, I reverse the second half with the standard prev, curr, next loop. Third, I walk from the head and from the reversed half together and compare values; any mismatch returns false. This is O(n) time and O(1) space, and I can reverse the half back if the input must stay unchanged.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['head = [1, 2, 2, 1] — Phase 1 ke baad slow kis index pe?', '<b>Index 2</b> (doosra 2). Iteration 1: slow = idx 1, fast = idx 2; iteration 2: slow = idx 2, fast = null.'],
          ['[1, 2, 3, 1] — kaunsa compare fail hoga?', 'right half (3, 1) ulti = 1 → 3. Compare 1 = 1 ✓, phir <b>2 vs 3</b> ✗ → false.'],
          ['Brute me <code>vals.get(i) != vals.get(j)</code> likha, list [1000, 1000] — kya output?', '<b>false</b> (galat) — 1000 Integer cache ke bahar, do alag objects → reference alag. <code>.equals</code> se true.'],
        ] },
        { olist: ['Optimal code 6 min me bina dekhe likho (teen blocks).', 'Restore wala step (second half wapas reverse) khud add karke socho.'] },
      ] },
    ],
    checks: [
      'Middle (slow/fast) + reverse + compare — teeno phase bol sakta hoon',
      'Odd length me special case kyun nahi chahiye — samjha',
      'ArrayList version me <code>.equals</code> kyun — samjha',
      'Optimal code 6 min me bina dekhe likh sakta hoon',
    ],
    memory: 'Middle dhoondo (slow/fast) → second half ulta (l5) → left/right saath chalao, mismatch = false.',
    tests: [
      { run: 'System.out.print(o.isPalindrome(LL.of(1,2,2,1)));', out: 'true' },
      { run: 'System.out.print(o.isPalindrome(LL.of(1,2)));', out: 'false' },
      { run: 'System.out.print(o.isPalindrome(LL.of(1,2,3,2,1)));', out: 'true' },
      { run: 'System.out.print(o.isPalindrome(LL.of(7)));', out: 'true' },
      { run: 'System.out.print(o.isPalindrome(LL.of(1,2,3,1)));', out: 'false' },
      { run: 'System.out.print(o.isPalindrome(LL.of(1000,1000)));', out: 'true' },
    ],
  };
})();
