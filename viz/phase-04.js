// Phase 4 — Linked List visualizers. `list` view (nodes + next pointers) + recursion `frames`.
// Line numbers code se snippet dhoondh ke nikalte hain (code badle toh bhi sahi line highlight ho).
(function () {
  const { recorder } = VIZ.util;
  const Q = n => window.PHASE_CONTENT['linked-list'].questions[n];
  // L(n, ap)(snippet, k) → snippet ki k-th occurrence wali 1-based line
  const L = (n, ap) => {
    const code = Q(n).approaches[ap].code.split('\n');
    return (snip, k) => {
      let c = k || 1;
      for (let i = 0; i < code.length; i++) if (code[i].includes(snip) && --c === 0) return i + 1;
      throw new Error('line nahi mili: ' + snip);
    };
  };

  // ---- list helpers ----
  // N = { id: {id, val, next} }
  const mk = (vals, pre) => {
    const N = {}, ids = vals.map((v, i) => pre + i);
    vals.forEach((v, i) => { N[pre + i] = { id: pre + i, val: v, next: i + 1 < vals.length ? pre + (i + 1) : null }; });
    return { N, ids };
  };
  const nm = (N, id) => (id === null || id === undefined ? 'null' : `ListNode(val=${N[id].val})`);
  const follow = (N, start, stop) => {
    const out = [], seen = new Set();
    let c = start;
    while (c !== null && c !== undefined && !seen.has(c)) { out.push(c); seen.add(c); if (c === stop) break; c = N[c].next; }
    return out;
  };
  const lstr = (N, start) => '[' + follow(N, start).map(id => N[id].val).join(', ') + ']';
  // P({prev: id|null, ...}) → { ptr, free } — null pointers chip me dikhte hain
  const P = obj => {
    const ptr = [], free = [];
    Object.entries(obj).forEach(([label, id]) => {
      if (id === undefined) return;
      if (id === null) free.push({ label, val: 'null' });
      else ptr.push({ id, label });
    });
    return { ptr, free };
  };
  const lv = (N, order, label, ptrs, hl, extraFree) => {
    const p = P(ptrs || {});
    return { type: 'list', label, nodes: order.map(id => ({ id, val: N[id].val, next: N[id].next })), hl: hl || {}, ptr: p.ptr, free: p.free.concat(extraFree || []) };
  };
  const vars = (N, obj) => { const o = {}; Object.entries(obj).forEach(([k, v]) => { if (v !== undefined) o[k] = typeof v === 'object' && v && v.raw !== undefined ? v.raw : nm(N, v); }); return o; };
  const raw = v => ({ raw: String(v) });

  // ================= LC 206 =================
  VIZ.defs[206] = {
    title: 'Reverse Linked List (Iterative)', label: 'Iterative',
    ap: 1,
    inputs: [{ key: 'head', label: 'head (list values)', def: '1, 2, 3, 4' }],
    run({ head }) {
      const ln = L(206, 1), { N, ids } = mk(head, 'n');
      let prev = null, current, next;
      const view = (hl) => {
        const ptrs = { prev, current, next };
        const v = [lv(N, ids, 'nodes (screen order) — arrows = next', ptrs, hl)];
        if (current !== undefined) {
          v.push({ type: 'text', label: 'reversed part (prev se)', value: prev === null ? 'null' : follow(N, prev).map(id => N[id].val).join(' → ') + ' → null' });
          v.push({ type: 'text', label: 'baaki list (current se)', value: current === null ? 'null' : follow(N, current).map(id => N[id].val).join(' → ') + ' → null' });
        }
        return v;
      };
      const { steps, s } = recorder(() => ({}));
      const st = (line, note, hl) => s(line, note, { views: view(hl), vars: vars(N, { head: ids.length ? ids[0] : null, prev, current, next }) });
      st(ln('ListNode prev = null'), 'prev = null — purana head naya tail banega, uske aage null hona chahiye.');
      current = ids.length ? ids[0] : null;
      st(ln('ListNode current = head'), `current = head = ${nm(N, current)}.`, current !== null ? { [current]: 'cur' } : {});
      const done = {};
      while (true) {
        if (current === null) { st(ln('while (current != null)'), 'current == null → loop khatam. Saare links ulte ho chuke.', Object.assign({}, done)); break; }
        st(ln('while (current != null)'), `current = ${N[current].val} ≠ null → loop chalao.`, Object.assign({}, done, { [current]: 'cur' }));
        next = N[current].next;
        st(ln('ListNode next = current.next'), `Step 1 — next save: next = ${nm(N, next)}. Ab link todne pe bhi baaki list nahi khoyegi.`, Object.assign({}, done, { [current]: 'cur' }, next !== null ? { [next]: 'win' } : {}));
        N[current].next = prev;
        st(ln('current.next = prev'), `Step 2 — reverse: ${N[current].val}.next = ${prev === null ? 'null' : N[prev].val}. Link ulta ho gaya.`, Object.assign({}, done, { [current]: 'new' }));
        done[current] = 'done';
        prev = current;
        st(ln('prev = current'), `Step 3 — prev = current = ${N[prev].val}. Reversed part ka head ab ${N[prev].val}.`, Object.assign({}, done));
        current = next;
        st(ln('current = next'), `Step 4 — current = next = ${nm(N, current)}.`, Object.assign({}, done, current !== null ? { [current]: 'cur' } : {}));
        next = undefined;
      }
      const hl = {}; ids.forEach(id => { hl[id] = 'found'; });
      s(ln('return prev'), `return prev = ${nm(N, prev)} → ${lstr(N, prev)}`, { views: view(hl), vars: vars(N, { head: ids.length ? ids[0] : null, prev, current }), ret: lstr(N, prev) });
      return steps;
    },
    variants: [{
      label: 'Recursive', title: 'Reverse Linked List (Recursive)', ap: 2,
      run({ head }) {
        const ln = L(206, 2), { N, ids } = mk(head, 'n');
        const stack = [];
        const { steps, s } = recorder(() => ({}));
        const WAIT = ln('ListNode newHead = reverseList(head.next)');
        const snap = (line, note, extra) => {
          const top = stack[stack.length - 1];
          const frames = stack.slice().reverse().map((f, i) => ({
            method: 'reverseList', args: 'head=' + (f.h === null ? 'null' : N[f.h].val), line: i === 0 ? line : WAIT,
            vars: vars(N, { head: f.h, newHead: f.nh }),
          }));
          const hl = {};
          stack.forEach(f => { if (f.h !== null) hl[f.h] = 'win'; });
          if (top && top.h !== null) hl[top.h] = 'cur';
          (extra && extra.hl ? Object.keys(extra.hl) : []).forEach(k => { hl[k] = extra.hl[k]; });
          const views = [lv(N, ids, 'nodes (screen order)', { head: top ? top.h : undefined, newHead: top ? top.nh : undefined }, hl),
            { type: 'stack', label: 'call stack (bottom → top)', items: stack.map(f => 'reverseList(' + (f.h === null ? 'null' : N[f.h].val) + ')'), hl: { [stack.length - 1]: 'cur' } }];
          s(line, note, Object.assign({ views, frames }, extra && extra.ret !== undefined ? { ret: extra.ret } : {}));
        };
        function go(h) {
          const fr = { h, nh: undefined };
          stack.push(fr);
          snap(ln('if (head == null || head.next == null)'), `reverseList(${h === null ? 'null' : N[h].val}) call hua. Base case check: ${h === null ? 'head == null' : (N[h].next === null ? 'head.next == null (last node)' : 'aur head.next dono non-null')}.`);
          if (h === null || N[h].next === null) {
            snap(ln('return head;'), `Base case → return ${nm(N, h)}. Yahi naya head hai — ab stack unwind hoga.`);
            stack.pop();
            return h;
          }
          snap(WAIT, `Pehle baaki list (${N[N[h].next].val} se) reverse karwao → reverseList(${N[N[h].next].val}) call. Ye frame yahin ruk ke wait karega.`);
          const nh = go(N[h].next);
          fr.nh = nh;
          snap(WAIT, `Call lauta: newHead = ${nm(N, nh)}. Ab frame head=${N[h].val} pe link fix karna hai.`);
          const nx = N[h].next;
          N[nx].next = h;
          snap(ln('head.next.next = head'), `head.next.next = head → ${N[nx].val}.next = ${N[h].val} (link ulta). Abhi ${N[h].val} ⇄ ${N[nx].val} dono taraf jude hain!`, { hl: { [nx]: 'new' } });
          N[h].next = null;
          snap(ln('head.next = null'), `head.next = null → ${N[h].val}.next = null. Cycle toot gayi; ${N[h].val} ab tail hai.`, { hl: { [h]: 'new' } });
          snap(ln('return newHead'), `return newHead = ${nm(N, nh)} (har level same newHead upar bhejta hai).`);
          stack.pop();
          return nh;
        }
        const res = go(ids.length ? ids[0] : null);
        steps[steps.length - 1].ret = lstr(N, res);
        steps[steps.length - 1].note += ` Final: ${lstr(N, res)}`;
        return steps;
      },
    }],
  };

  // ================= LC 876 =================
  VIZ.defs[876] = {
    title: 'Middle of the Linked List (Slow / Fast)', label: 'Slow / Fast',
    ap: 1,
    variants: [{
      label: 'Count + Walk (traversal)', title: 'Middle of the Linked List (Two-pass: count + walk)', ap: 0,
      run({ head }) {
        const ln = L(876, 0), { N, ids } = mk(head, 'n');
        const { steps, s } = recorder(() => ({}));
        let count = 0, cur, mid, i;
        const hl = () => { const o = {}; if (cur !== undefined && cur !== null) o[cur] = 'cur'; if (mid !== undefined && mid !== null) o[mid] = 'win'; return o; };
        const st = (line, note, extra) => s(line, note, Object.assign({
          views: [lv(N, ids, 'list', { head: ids.length ? ids[0] : null, cur, mid }, hl())],
          vars: vars(N, { head: ids.length ? ids[0] : null, count: raw(count), cur, i: i === undefined ? undefined : raw(i), mid }),
        }, extra));
        st(ln('int count = 0'), 'Pass 1 shuru: count = 0.');
        cur = ids.length ? ids[0] : null;
        while (true) {
          st(ln('for (ListNode cur = head'), cur === null ? 'cur == null → list khatam, pass 1 done.' : `cur = ${N[cur].val} (null nahi) → andar jao.`);
          if (cur === null) break;
          count++;
          st(ln('count++'), `count = ${count}`);
          cur = N[cur].next;
          if (count > 200) break;
        }
        cur = undefined;
        mid = ids.length ? ids[0] : null;
        st(ln('ListNode mid = head'), `Pass 2: count / 2 = ${Math.floor(count / 2)} steps chalna hai. mid = head.`);
        for (i = 0; ; i++) {
          const ok = i < Math.floor(count / 2);
          st(ln('for (int i = 0'), ok ? `i = ${i} < ${Math.floor(count / 2)} → ek step aur.` : `i = ${i} == ${Math.floor(count / 2)} → ruk jao.`);
          if (!ok) break;
          mid = N[mid].next;
          st(ln('mid = mid.next'), `mid → ${N[mid].val}`);
        }
        s(ln('return mid'), `return mid = ${nm(N, mid)} → ${lstr(N, mid)}`, {
          views: [lv(N, ids, 'list', { mid }, follow(N, mid).reduce((o, id) => { o[id] = 'found'; return o; }, {}))],
          vars: vars(N, { count: raw(count), mid }), ret: lstr(N, mid),
        });
        return steps;
      },
    }],
    inputs: [{ key: 'head', label: 'head (list values)', def: '1, 2, 3, 4, 5' }],
    run({ head }) {
      const ln = L(876, 1), { N, ids } = mk(head, 'n');
      let slow = ids.length ? ids[0] : null, fast = slow;
      const { steps, s } = recorder(() => ({}));
      const st = (line, note, extra) => s(line, note, Object.assign({
        views: [lv(N, ids, 'list', { slow, fast }, Object.assign({}, slow !== null ? { [slow]: 'cur' } : {}, fast !== null && fast !== slow ? { [fast]: 'win' } : {}))],
        vars: vars(N, { head: ids[0] === undefined ? null : ids[0], slow, fast }),
      }, extra));
      st(ln('ListNode slow = head'), 'slow aur fast dono head pe.');
      let it = 0;
      while (true) {
        const ok = fast !== null && N[fast].next !== null;
        st(ln('while (fast != null'), ok ? `fast = ${N[fast].val}, fast.next = ${N[N[fast].next].val} → dono non-null, chalo.` : `fast ${fast === null ? '== null' : '.next == null'} → ruk jao.`);
        if (!ok) break;
        slow = N[slow].next;
        st(ln('slow = slow.next'), `slow 1 step → ${N[slow].val}`);
        fast = N[N[fast].next].next;
        st(ln('fast = fast.next.next'), `fast 2 step → ${fast === null ? 'null (end ke bahar)' : N[fast].val}`);
        if (++it > 200) break;
      }
      s(ln('return slow'), `return slow = ${nm(N, slow)} → ${lstr(N, slow)}`, {
        views: [lv(N, ids, 'list', { slow, fast }, follow(N, slow).reduce((o, id) => { o[id] = 'found'; return o; }, {}))],
        vars: vars(N, { slow, fast }), ret: lstr(N, slow),
      });
      return steps;
    },
  };

  // ================= LC 21 =================
  VIZ.defs[21] = {
    title: 'Merge Two Sorted Lists (Iterative, Dummy)', label: 'Iterative',
    ap: 1,
    inputs: [{ key: 'list1', label: 'list1 (sorted)', def: '1, 2, 4' }, { key: 'list2', label: 'list2 (sorted)', def: '1, 3, 4' }],
    run({ list1, list2 }) {
      const ln = L(21, 1), A = mk(list1, 'a'), B = mk(list2, 'b'), N = Object.assign({}, A.N, B.N);
      N.d = { id: 'd', val: 0, next: null };
      let l1 = A.ids.length ? A.ids[0] : null, l2 = B.ids.length ? B.ids[0] : null, dummy, tail;
      const { steps, s } = recorder(() => ({}));
      const view = (full) => {
        const v = [];
        if (dummy !== undefined) v.push(lv(N, full ? follow(N, 'd') : follow(N, 'd', tail), full ? 'merged (dummy se poori)' : 'merged so far (dummy → tail)', { dummy: 'd', tail }, full ? follow(N, 'd').reduce((o, id) => { if (id !== 'd') o[id] = 'found'; return o; }, { d: 'skip' }) : { d: 'skip', [tail]: 'new' }));
        if (!full) {
          v.push(lv(N, follow(N, l1), 'list1 (bacha hua)', { list1: l1 }, l1 !== null ? { [l1]: 'cur' } : {}));
          v.push(lv(N, follow(N, l2), 'list2 (bacha hua)', { list2: l2 }, l2 !== null ? { [l2]: 'cur' } : {}));
        }
        return v;
      };
      const st = (line, note, extra) => s(line, note, Object.assign({ views: view(false), vars: vars(N, { list1: l1, list2: l2, dummy: dummy === undefined ? undefined : 'd', tail }) }, extra));
      dummy = 'd';
      st(ln('ListNode dummy = new ListNode(0)'), 'dummy = nakli node (val 0). Merged list iske peeche banegi.');
      tail = 'd';
      st(ln('ListNode tail = dummy'), 'tail = dummy. tail hamesha merged list ka last node.');
      while (true) {
        const ok = l1 !== null && l2 !== null;
        st(ln('while (list1 != null && list2 != null)'), ok ? `list1 = ${N[l1].val}, list2 = ${N[l2].val} → dono bache hain.` : 'Ek list khatam → loop band.');
        if (!ok) break;
        if (N[l1].val <= N[l2].val) {
          st(ln('if (list1.val <= list2.val)'), `${N[l1].val} <= ${N[l2].val} ✓ → list1 ka node jodna hai.`);
          N[tail].next = l1;
          st(ln('tail.next = list1'), `tail.next = ${N[l1].val} (list1 ka node).`);
          l1 = N[l1].next;
          st(ln('list1 = list1.next'), `list1 aage → ${nm(N, l1)}`);
        } else {
          st(ln('if (list1.val <= list2.val)'), `${N[l1].val} > ${N[l2].val} → list2 ka node jodna hai.`);
          N[tail].next = l2;
          st(ln('tail.next = list2'), `tail.next = ${N[l2].val} (list2 ka node).`);
          l2 = N[l2].next;
          st(ln('list2 = list2.next'), `list2 aage → ${nm(N, l2)}`);
        }
        tail = N[tail].next;
        st(ln('tail = tail.next'), `tail aage → ${N[tail].val}`);
      }
      const rest = l1 !== null ? l1 : l2;
      N[tail].next = rest;
      s(ln('tail.next = (list1 != null)'), `Bachi list (${rest === null ? 'null' : lstr(N, rest)}) seedha tail ke peeche jod di — loop ki zaroorat nahi.`, { views: view(true), vars: vars(N, { list1: l1, list2: l2, dummy: 'd', tail }) });
      s(ln('return dummy.next'), `return dummy.next → ${lstr(N, N.d.next)}`, { views: view(true), vars: vars(N, { dummy: 'd', tail }), ret: lstr(N, N.d.next) });
      return steps;
    },
    variants: [{
      label: 'Recursive', title: 'Merge Two Sorted Lists (Recursive)', ap: 2,
      run({ list1, list2 }) {
        const ln = L(21, 2), A = mk(list1, 'a'), B = mk(list2, 'b'), N = Object.assign({}, A.N, B.N);
        const stack = [];
        const { steps, s } = recorder(() => ({}));
        const lab = id => (id === null ? 'null' : N[id].val);
        const snap = (line, note, extra) => {
          const top = stack[stack.length - 1] || {};
          const frames = stack.slice().reverse().map((f, i) => ({
            method: 'mergeTwoLists', args: `list1=${lab(f.a)}, list2=${lab(f.b)}`, line: i === 0 ? line : f.wait,
            vars: vars(N, { list1: f.a, list2: f.b }),
          }));
          const hl = {};
          if (top.a !== null && top.a !== undefined) hl[top.a] = 'cur';
          if (top.b !== null && top.b !== undefined) hl[top.b] = 'cur';
          const views = [
            lv(N, A.ids, 'list1 nodes (original order)', { list1: top.a }, hl),
            lv(N, B.ids, 'list2 nodes (original order)', { list2: top.b }, hl),
          ];
          if (extra && extra.res !== undefined) views.push({ type: 'text', label: 'is frame ka result', value: extra.res === null ? 'null' : follow(N, extra.res).map(id => N[id].val).join(' → ') + ' → null' });
          s(line, note, Object.assign({ views, frames }, extra && extra.ret !== undefined ? { ret: extra.ret } : {}));
        };
        function go(a, b) {
          const fr = { a, b, wait: 0 };
          stack.push(fr);
          snap(ln('if (list1 == null) return list2'), `mergeTwoLists(${lab(a)}, ${lab(b)}) call. list1 ${a === null ? '== null' : '≠ null'}.`);
          if (a === null) { snap(ln('if (list1 == null) return list2'), `list1 null → return list2 (${lab(b)}).`, { res: b }); stack.pop(); return b; }
          snap(ln('if (list2 == null) return list1'), `list2 ${b === null ? '== null → return list1 (' + lab(a) + ').' : '≠ null.'}`, b === null ? { res: a } : undefined);
          if (b === null) { stack.pop(); return a; }
          snap(ln('if (list1.val <= list2.val)'), `${N[a].val} <= ${N[b].val} ? ${N[a].val <= N[b].val ? 'haan → list1 ka node head banega' : 'nahi → list2 ka node head banega'}.`);
          if (N[a].val <= N[b].val) {
            fr.wait = ln('list1.next = mergeTwoLists(list1.next, list2)');
            snap(fr.wait, `list1.next = mergeTwoLists(${lab(N[a].next)}, ${lab(b)}) — baaki ka merge recursion karega.`);
            const r = go(N[a].next, b);
            N[a].next = r;
            snap(fr.wait, `Call lauta → ${N[a].val}.next = ${lab(r)}.`, { res: a });
            snap(ln('return list1;', 2), `return list1 (${N[a].val}).`, { res: a });
            stack.pop(); return a;
          }
          fr.wait = ln('list2.next = mergeTwoLists(list1, list2.next)');
          snap(fr.wait, `list2.next = mergeTwoLists(${lab(a)}, ${lab(N[b].next)}) — baaki ka merge recursion karega.`);
          const r = go(a, N[b].next);
          N[b].next = r;
          snap(fr.wait, `Call lauta → ${N[b].val}.next = ${lab(r)}.`, { res: b });
          snap(ln('return list2;', 2), `return list2 (${N[b].val}).`, { res: b });
          stack.pop(); return b;
        }
        const res = go(A.ids.length ? A.ids[0] : null, B.ids.length ? B.ids[0] : null);
        steps[steps.length - 1].ret = lstr(N, res);
        steps[steps.length - 1].note += ` Final: ${lstr(N, res)}`;
        return steps;
      },
    }],
  };

  // cycle helper: tail.next = node at pos
  const mkCycle = (vals, pos) => {
    const r = mk(vals, 'n');
    if (pos >= 0 && pos < r.ids.length) r.N[r.ids[r.ids.length - 1]].next = r.ids[pos];
    return r;
  };
  const cycText = (N, ids, pos) => ({ type: 'text', label: 'cycle', value: pos >= 0 && pos < ids.length ? `tail (${N[ids[ids.length - 1]].val}).next → index ${pos} (val ${N[ids[pos]].val})` : 'nahi (tail.next = null)' });

  // ================= LC 141 =================
  VIZ.defs[141] = {
    title: "Linked List Cycle (Floyd's Tortoise & Hare)",
    ap: 1,
    inputs: [{ key: 'head', label: 'head (list values)', def: '3, 2, 0, -4' }, { key: 'pos', label: 'pos (−1 = no cycle)', type: 'num', def: '1' }],
    run({ head, pos }) {
      const ln = L(141, 1), { N, ids } = mkCycle(head, pos);
      let slow = ids.length ? ids[0] : null, fast = slow;
      const { steps, s } = recorder(() => ({}));
      const st = (line, note, extra, hlx) => s(line, note, Object.assign({
        views: [lv(N, ids, 'list (last node ka next label dekho)', { slow, fast }, hlx || Object.assign({}, slow !== null ? { [slow]: 'cur' } : {}, fast !== null && fast !== slow ? { [fast]: 'win' } : {})), cycText(N, ids, pos)],
        vars: vars(N, { head: ids.length ? ids[0] : null, slow, fast }),
      }, extra));
      st(ln('ListNode slow = head'), 'slow = fast = head.');
      let it = 0;
      while (it++ < 250) {
        const ok = fast !== null && N[fast].next !== null;
        st(ln('while (fast != null'), ok ? 'fast aur fast.next non-null → chalo.' : `fast ${fast === null ? '== null' : '.next == null'} → end mil gaya, cycle nahi.`);
        if (!ok) break;
        slow = N[slow].next;
        st(ln('slow = slow.next'), `slow 1 step → ${N[slow].val}`);
        fast = N[N[fast].next].next;
        st(ln('fast = fast.next.next'), `fast 2 step → ${fast === null ? 'null' : N[fast].val}`);
        if (slow === fast) {
          st(ln('if (slow == fast)'), `slow == fast (same node ${N[slow].val}) → cycle hai! return true`, { ret: 'true' }, { [slow]: 'found' });
          return steps;
        }
        st(ln('if (slow == fast)'), 'slow ≠ fast (alag nodes) → aage.');
      }
      st(ln('return false'), 'return false — list null pe khatam hui.', { ret: 'false' });
      return steps;
    },
  };

  // ================= LC 142 =================
  VIZ.defs[142] = {
    title: 'Linked List Cycle II (Floyd Phase 1 + 2)',
    ap: 1,
    inputs: [{ key: 'head', label: 'head (list values)', def: '3, 2, 0, -4' }, { key: 'pos', label: 'pos (−1 = no cycle)', type: 'num', def: '1' }],
    run({ head, pos }) {
      const ln = L(142, 1), { N, ids } = mkCycle(head, pos);
      let slow = ids.length ? ids[0] : null, fast = slow, phase2 = false;
      const { steps, s } = recorder(() => ({}));
      const st = (line, note, extra, hlx) => {
        const hl = hlx || {};
        if (!hlx) { if (fast !== null) hl[fast] = phase2 ? 'new' : 'win'; if (slow !== null) hl[slow] = 'cur'; }
        s(line, note, Object.assign({
          views: [lv(N, ids, phase2 ? 'Phase 2: slow head se, fast meeting point se — dono 1 step' : 'Phase 1: slow 1 step, fast 2 step', { slow, fast }, hl), cycText(N, ids, pos)],
          vars: vars(N, { head: ids.length ? ids[0] : null, slow, fast }),
        }, extra));
      };
      st(ln('ListNode slow = head'), 'Phase 1: slow = fast = head.');
      let it = 0, met = false;
      while (it++ < 250) {
        const ok = fast !== null && N[fast].next !== null;
        st(ln('while (fast != null'), ok ? 'fast aur fast.next non-null → chalo.' : 'fast end pe pahuncha → loop band.');
        if (!ok) break;
        slow = N[slow].next;
        st(ln('slow = slow.next', 1), 'slow 1 step → ' + N[slow].val);
        fast = N[N[fast].next].next;
        st(ln('fast = fast.next.next'), 'fast 2 step → ' + (fast === null ? 'null' : N[fast].val));
        if (slow === fast) { met = true; st(ln('if (slow == fast) break'), 'Meet at node ' + N[slow].val + ' (meeting point)! Cycle confirm → break.'); break; }
        st(ln('if (slow == fast) break'), 'slow ≠ fast → aage.');
      }
      if (!met) {
        st(ln('if (fast == null'), 'fast ya fast.next null → cycle nahi.');
        st(ln('return null'), 'return null.', { ret: 'null' });
        return steps;
      }
      st(ln('if (fast == null'), 'fast null nahi → cycle hai. Ab Phase 2.');
      phase2 = true;
      slow = ids[0];
      st(ln('slow = head;'), 'slow ko head (' + N[slow].val + ') pe reset. fast meeting point (' + N[fast].val + ') pe hi rahega.');
      let j = 0;
      while (j++ < 250) {
        if (slow === fast) { st(ln('while (slow != fast)'), 'slow == fast (' + N[slow].val + ') → yahi cycle ka start hai.'); break; }
        st(ln('while (slow != fast)'), 'slow (' + N[slow].val + ') ≠ fast (' + N[fast].val + ') → dono 1 step.');
        slow = N[slow].next;
        st(ln('slow = slow.next', 2), 'slow → ' + N[slow].val);
        fast = N[fast].next;
        st(ln('fast = fast.next;'), 'fast → ' + N[fast].val);
      }
      st(ln('return slow'), 'return slow = ' + nm(N, slow) + ' (index ' + ids.indexOf(slow) + ')', { ret: nm(N, slow) }, { [slow]: 'found' });
      return steps;
    },
  };

  // ================= LC 19 =================
  VIZ.defs[19] = {
    title: 'Remove Nth Node From End (Dummy + Gap)',
    ap: 1,
    inputs: [{ key: 'head', label: 'head (list values)', def: '1, 2, 3, 4, 5' }, { key: 'n', label: 'n', type: 'num', def: '2' }],
    check: ({ head, n }) => (n >= 1 && n <= head.length ? '' : '1 ≤ n ≤ list length hona chahiye.'),
    run({ head, n }) {
      const ln = L(19, 1), { N, ids } = mk(head, 'n');
      N.d = { id: 'd', val: 0, next: ids.length ? ids[0] : null };
      const order = ['d'].concat(ids);
      let fast, slow, i;
      const { steps, s } = recorder(() => ({}));
      const st = (line, note, extra, hlx) => {
        const hl = hlx || { d: 'skip' };
        if (!hlx) { if (slow !== undefined && slow !== null) hl[slow] = 'cur'; if (fast !== undefined && fast !== null) hl[fast] = 'win'; }
        s(line, note, Object.assign({
          views: [lv(N, order, 'dummy → list', { dummy: 'd', slow, fast }, hl), { type: 'text', label: 'gap (fast − slow)', value: fast === undefined || slow === undefined ? '—' : String((fast === null ? order.length : order.indexOf(fast)) - order.indexOf(slow)) }],
          vars: Object.assign(vars(N, { head: ids[0], dummy: 'd', fast, slow }), { n: String(n) }, i !== undefined ? { i: String(i) } : {}),
        }, extra));
      };
      st(ln('ListNode dummy = new ListNode(0, head)'), 'dummy → head. Agar head hi delete hua toh bhi dummy.next sahi rahega.');
      fast = 'd'; slow = 'd';
      st(ln('ListNode fast = dummy, slow = dummy'), 'fast = slow = dummy.');
      for (i = 0; i <= n; i++) {
        st(ln('for (int i = 0; i <= n; i++)'), `i = ${i} <= n = ${n} → fast ko aage badhao (total n+1 = ${n + 1} step).`);
        fast = N[fast].next;
        st(ln('fast = fast.next;', 1), `fast → ${fast === null ? 'null' : N[fast].val}`);
      }
      st(ln('for (int i = 0; i <= n; i++)'), `i = ${i} > n → gap ban gaya (${n + 1}).`);
      i = undefined;
      while (true) {
        st(ln('while (fast != null)'), fast !== null ? `fast = ${N[fast].val} ≠ null → dono saath chalo.` : 'fast == null → slow target ke theek pehle hai.');
        if (fast === null) break;
        fast = N[fast].next;
        st(ln('fast = fast.next;', 2), `fast → ${fast === null ? 'null' : N[fast].val}`);
        slow = N[slow].next;
        st(ln('slow = slow.next'), `slow → ${N[slow].val}`);
      }
      const del = N[slow].next;
      N[slow].next = N[del].next;
      st(ln('slow.next = slow.next.next'), `slow.next = slow.next.next → node ${N[del].val} skip ho gaya (end se ${n}-th).`, undefined, { d: 'skip', [slow]: 'cur', [del]: 'skip' });
      const hl = { d: 'skip', [del]: 'skip' };
      follow(N, N.d.next).forEach(id => { hl[id] = 'found'; });
      st(ln('return dummy.next'), `return dummy.next → ${lstr(N, N.d.next)}`, { ret: lstr(N, N.d.next) }, hl);
      return steps;
    },
  };

  // ================= LC 143 =================
  VIZ.defs[143] = {
    title: 'Reorder List (Middle → Reverse → Weave)',
    ap: 1,
    inputs: [{ key: 'head', label: 'head (list values)', def: '1, 2, 3, 4, 5' }],
    run({ head }) {
      const ln = L(143, 1), { N, ids } = mk(head, 'n');
      const h0 = ids.length ? ids[0] : null;
      let slow, fast, second, prev, next, first, n1, n2;
      const { steps, s } = recorder(() => ({}));
      const chainTxt = id => (id === null || id === undefined ? 'null' : follow(N, id).map(x => N[x].val).join(' → ') + ' → null');
      const st = (line, note, extra, hl) => {
        const views = [lv(N, ids, 'nodes (original screen order)', { slow, fast, second, prev, next, first, n1, n2 }, hl || {})];
        views.push({ type: 'text', label: 'head se chain', value: chainTxt(h0) });
        if (prev !== undefined || second !== undefined) views.push({ type: 'text', label: first === undefined ? 'second half (prev se, reversed)' : 'second se chain', value: chainTxt(first === undefined ? prev : second) });
        s(line, note, Object.assign({ views, vars: vars(N, { head: h0, slow, fast, second, prev, next, first, n1, n2 }) }, extra));
      };
      st(ln('if (head == null || head.next == null)'), h0 === null || N[h0].next === null ? '0/1 node → kuch nahi karna, return.' : '2+ nodes → aage badho.');
      if (h0 === null || N[h0].next === null) { steps[steps.length - 1].ret = lstr(N, h0); return steps; }
      slow = h0; fast = h0;
      st(ln('ListNode slow = head, fast = head'), 'Step 1 — middle: slow = fast = head.', undefined, { [h0]: 'cur' });
      while (true) {
        const ok = N[fast].next !== null && N[N[fast].next].next !== null;
        st(ln('while (fast.next != null && fast.next.next != null)'), ok ? 'fast 2 step aage ja sakta hai → chalo.' : `Ruk jao → slow = ${N[slow].val} first half ka last node (first middle).`, undefined, { [slow]: 'cur', [fast]: 'win' });
        if (!ok) break;
        slow = N[slow].next;
        st(ln('slow = slow.next'), `slow → ${N[slow].val}`, undefined, { [slow]: 'cur', [fast]: 'win' });
        fast = N[N[fast].next].next;
        st(ln('fast = fast.next.next'), `fast → ${N[fast].val}`, undefined, { [slow]: 'cur', [fast]: 'win' });
      }
      fast = undefined;
      second = N[slow].next;
      st(ln('ListNode second = slow.next'), `Step 2 — second = slow.next = ${N[second].val} (second half yahan se).`, undefined, { [slow]: 'cur', [second]: 'win' });
      N[slow].next = null;
      st(ln('slow.next = null'), `slow.next = null → list do tukde: [${follow(N, h0).map(x => N[x].val).join(', ')}] aur [${follow(N, second).map(x => N[x].val).join(', ')}].`, undefined, { [slow]: 'new' });
      prev = null;
      st(ln('ListNode prev = null'), 'Second half reverse (LC 206 wala loop): prev = null.');
      while (true) {
        st(ln('while (second != null)'), second !== null ? `second = ${N[second].val} → reverse step.` : 'second == null → second half reverse ho gaya.', undefined, second !== null ? { [second]: 'cur' } : {});
        if (second === null) break;
        next = N[second].next;
        st(ln('ListNode next = second.next'), `next = ${nm(N, next)} (save).`, undefined, Object.assign({ [second]: 'cur' }, next !== null ? { [next]: 'win' } : {}));
        N[second].next = prev;
        st(ln('second.next = prev'), `${N[second].val}.next = ${prev === null ? 'null' : N[prev].val}.`, undefined, { [second]: 'new' });
        prev = second;
        st(ln('prev = second'), `prev = ${N[prev].val}`);
        second = next;
        st(ln('second = next;'), `second = ${nm(N, second)}`);
        next = undefined;
      }
      first = h0;
      st(ln('ListNode first = head'), `Step 3 — weave: first = head (${N[first].val}).`, undefined, { [first]: 'cur' });
      second = prev;
      st(ln('second = prev'), `second = prev = ${N[second].val} (reversed second half ka head).`, undefined, { [first]: 'cur', [second]: 'win' });
      prev = undefined;
      while (true) {
        st(ln('while (second != null)', 2), second !== null ? `second = ${N[second].val} → ek jodi weave karo.` : 'second == null → weave complete.', undefined, Object.assign({}, first ? { [first]: 'cur' } : {}, second !== null ? { [second]: 'win' } : {}));
        if (second === null) break;
        n1 = N[first].next; n2 = N[second].next;
        st(ln('ListNode n1 = first.next, n2 = second.next'), `Save: n1 = ${nm(N, n1)}, n2 = ${nm(N, n2)}.`, undefined, { [first]: 'cur', [second]: 'win' });
        N[first].next = second;
        st(ln('first.next = second'), `${N[first].val}.next = ${N[second].val}`, undefined, { [first]: 'new' });
        N[second].next = n1;
        st(ln('second.next = n1'), `${N[second].val}.next = ${n1 === null ? 'null' : N[n1].val}`, undefined, { [second]: 'new' });
        first = n1;
        st(ln('first = n1'), `first = ${nm(N, first)}`);
        second = n2;
        st(ln('second = n2'), `second = ${nm(N, second)}`);
        n1 = undefined; n2 = undefined;
      }
      const hl = {}; ids.forEach(id => { hl[id] = 'found'; });
      st(Q(143).approaches[1].code.split(String.fromCharCode(10)).length,`Done (void). head se list: ${lstr(N, h0)}`, { ret: lstr(N, h0) }, hl);
      return steps;
    },
  };

  // ================= LC 25 =================
  VIZ.defs[25] = {
    title: 'Reverse Nodes in k-Group (Iterative, Dummy)', label: 'Iterative',
    ap: 1,
    inputs: [{ key: 'head', label: 'head (list values)', def: '1, 2, 3, 4, 5' }, { key: 'k', label: 'k', type: 'num', def: '2' }],
    check: ({ head, k }) => (k >= 1 ? '' : 'k ≥ 1 hona chahiye.'),
    run({ head, k }) {
      const ln = L(25, 1), { N, ids } = mk(head, 'n');
      N.d = { id: 'd', val: 0, next: ids.length ? ids[0] : null };
      const order = ['d'].concat(ids);
      let groupPrev, kth, i, groupNext, prev, cur, next, first;
      const { steps, s } = recorder(() => ({}));
      const st = (line, note, extra, hl) => s(line, note, Object.assign({
        views: [lv(N, order, 'dummy + nodes (screen order)', { dummy: 'd', groupPrev, kth, groupNext, prev, cur, next, first }, Object.assign({ d: 'skip' }, hl || {})),
          { type: 'text', label: 'dummy se chain', value: follow(N, 'd').slice(1).map(x => N[x].val).join(' → ') + ' → …' }],
        vars: Object.assign(vars(N, { dummy: 'd', groupPrev, kth, groupNext, prev, cur, next, first }), { k: String(k) }, i !== undefined ? { i: String(i) } : {}),
      }, extra));
      st(ln('ListNode dummy = new ListNode(0, head)'), 'dummy → head.');
      groupPrev = 'd';
      st(ln('ListNode groupPrev = dummy'), 'groupPrev = dummy (har group ke theek pehle wala node).');
      let guard = 0;
      while (guard++ < 100) {
        st(ln('while (true)'), 'Naya group try karo.', undefined, { [groupPrev]: 'cur' });
        kth = groupPrev;
        st(ln('ListNode kth = groupPrev'), 'kth = groupPrev; ab k step chalo.');
        for (i = 0; ; i++) {
          const go = i < k && kth !== null;
          st(ln('for (int i = 0; i < k && kth != null'), `i = ${i} < k = ${k} aur kth != null ? ${go ? 'haan' : 'nahi → loop khatam'}`, undefined, kth !== null ? { [kth]: 'win' } : {});
          if (!go) break;
          kth = N[kth].next;
          st(ln('kth = kth.next'), `i = ${i}: kth → ${nm(N, kth)}`, undefined, kth !== null ? { [kth]: 'win' } : {});
        }
        i = undefined;
        if (kth === null) { st(ln('if (kth == null) break'), `k = ${k} nodes nahi bache → break (bache hue waise hi).`); break; }
        st(ln('if (kth == null) break'), `kth = ${N[kth].val} → poora group mila.`, undefined, { [kth]: 'win' });
        groupNext = N[kth].next;
        st(ln('ListNode groupNext = kth.next'), `groupNext = ${nm(N, groupNext)} (group ke baad wala).`);
        prev = groupNext; cur = N[groupPrev].next;
        st(ln('ListNode prev = groupNext, cur = groupPrev.next'), `prev = groupNext (${groupNext === null ? 'null' : N[groupNext].val}) se start — reversed group ka tail khud aage juda rahega. cur = ${N[cur].val}.`, undefined, { [cur]: 'cur' });
        while (true) {
          st(ln('while (cur != groupNext)'), cur !== groupNext ? `cur = ${N[cur].val} ≠ groupNext → reverse step.` : 'cur == groupNext → group reverse complete.', undefined, cur !== groupNext && cur !== null ? { [cur]: 'cur' } : {});
          if (cur === groupNext) break;
          next = N[cur].next;
          st(ln('ListNode next = cur.next'), `next = ${nm(N, next)}`, undefined, { [cur]: 'cur' });
          N[cur].next = prev;
          st(ln('cur.next = prev'), `${N[cur].val}.next = ${prev === null ? 'null' : N[prev].val}`, undefined, { [cur]: 'new' });
          prev = cur;
          st(ln('prev = cur'), `prev = ${N[prev].val}`);
          cur = next;
          st(ln('cur = next'), `cur = ${nm(N, cur)}`);
          next = undefined;
        }
        first = N[groupPrev].next;
        st(ln('ListNode first = groupPrev.next'), `first = ${N[first].val} (purana pehla node = ab group ka tail).`, undefined, { [first]: 'win' });
        N[groupPrev].next = kth;
        st(ln('groupPrev.next = kth'), `groupPrev.next = kth (${N[kth].val}) → group ab ulta juda.`, undefined, { [kth]: 'new' });
        groupPrev = first;
        st(ln('groupPrev = first'), `groupPrev = first (${N[first].val}) — agla group iske baad.`, undefined, { [first]: 'cur' });
        kth = undefined; groupNext = undefined; prev = undefined; cur = undefined; first = undefined;
      }
      const hl = {}; ids.forEach(id => { hl[id] = 'found'; });
      st(ln('return dummy.next'), `return dummy.next → ${lstr(N, N.d.next)}`, { ret: lstr(N, N.d.next) }, hl);
      return steps;
    },
    variants: [{
      label: 'Recursive', title: 'Reverse Nodes in k-Group (Recursive)', ap: 2,
      run({ head, k }) {
        const ln = L(25, 2), { N, ids } = mk(head, 'n');
        const stack = [];
        const WAIT = ln('ListNode rest = reverseKGroup(cur, k)');
        const { steps, s } = recorder(() => ({}));
        const lab = id => (id === null || id === undefined ? 'null' : N[id].val);
        const snap = (line, note, extra) => {
          const top = stack[stack.length - 1];
          const frames = stack.slice().reverse().map((f, j) => ({
            method: 'reverseKGroup', args: `head=${lab(f.head)}, k=${k}`, line: j === 0 ? line : WAIT,
            vars: Object.assign(vars(N, { head: f.head, cur: f.cur, rest: f.rest, prev: f.prev, node: f.node, next: f.next }), f.count !== undefined ? { count: String(f.count) } : {}, f.i !== undefined ? { i: String(f.i) } : {}, { k: String(k) }),
          }));
          const hl = {};
          if (top) { if (top.node !== undefined && top.node !== null) hl[top.node] = 'cur'; else if (top.head !== null) hl[top.head] = 'cur'; }
          const views = [lv(N, ids, 'nodes (screen order)', top ? { head: top.head, cur: top.cur, rest: top.rest, prev: top.prev, node: top.node } : {}, hl),
            { type: 'stack', label: 'call stack (bottom → top)', items: stack.map(f => `reverseKGroup(${lab(f.head)})`), hl: { [stack.length - 1]: 'cur' } }];
          s(line, note, Object.assign({ views, frames }, extra));
        };
        function go(h) {
          const f = { head: h };
          stack.push(f);
          f.cur = h;
          snap(ln('ListNode cur = head'), `reverseKGroup(${lab(h)}) call. cur = head.`);
          f.count = 0;
          snap(ln('int count = 0'), 'count = 0. Pehle check: k nodes hain?');
          while (true) {
            const ok = f.cur !== null && f.count < k;
            snap(ln('while (cur != null && count < k)'), `cur = ${lab(f.cur)}, count = ${f.count} < ${k} ? ${ok ? 'haan' : 'nahi → loop khatam'}`);
            if (!ok) break;
            f.cur = N[f.cur].next;
            snap(ln('cur = cur.next'), `cur → ${lab(f.cur)}`);
            f.count++;
            snap(ln('count++'), `count = ${f.count}`);
          }
          if (f.count < k) {
            snap(ln('if (count < k) return head'), `count ${f.count} < k ${k} → group adhoora, return head (${lab(h)}) — waise hi chhodo.`);
            stack.pop(); return h;
          }
          snap(ln('if (count < k) return head'), `count = k = ${k} → poora group. cur (${lab(f.cur)}) = agle group ka head.`);
          snap(WAIT, `rest = reverseKGroup(${lab(f.cur)}, ${k}) — pehle baaki list solve karwao.`);
          const rest = go(f.cur);
          f.rest = rest;
          snap(WAIT, `Call lauta: rest = ${lab(rest)} (baaki list ka naya head).`);
          f.prev = rest; f.node = h;
          snap(ln('ListNode prev = rest, node = head'), `prev = rest (${lab(rest)}), node = head (${lab(h)}). Ab apne k nodes reverse.`);
          for (f.i = 0; ; f.i++) {
            snap(ln('for (int i = 0; i < k; i++)'), `i = ${f.i} < ${k} ? ${f.i < k ? 'haan' : 'nahi → group ulta ho gaya'}`);
            if (f.i >= k) break;
            f.next = N[f.node].next;
            snap(ln('ListNode next = node.next'), `i = ${f.i}: next = ${lab(f.next)}`);
            N[f.node].next = f.prev;
            snap(ln('node.next = prev'), `${N[f.node].val}.next = ${lab(f.prev)}`);
            f.prev = f.node;
            snap(ln('prev = node'), `prev = ${lab(f.prev)}`);
            f.node = f.next;
            snap(ln('node = next'), `node = ${lab(f.node)}`);
          }
          f.i = undefined; f.next = undefined;
          snap(ln('return prev'), `return prev = ${lab(f.prev)} (is group ka naya head).`);
          stack.pop(); return f.prev;
        }
        const res = go(ids.length ? ids[0] : null);
        steps[steps.length - 1].ret = lstr(N, res);
        steps[steps.length - 1].note += ` Final: ${lstr(N, res)}`;
        return steps;
      },
    }],
  };
})();
