// Phase 4 (Linked List) — Brute tabs, LINE-BY-LINE debugger (v2, 2026-11-08).
// Har executable line ek step; VARIABLES me saare locals (lists, pointers, sets). Final `ret` base (Optimal) viz se.
(function () {
  const { recorder, fmt, MAX_STEPS } = VIZ.util;
  const Q = n => window.PHASE_CONTENT['linked-list'].questions[n];
  const L = (n, ap) => {
    const code = Q(n).approaches[ap].code.split('\n');
    return (snip, k) => {
      let c = k || 1;
      for (let i = 0; i < code.length; i++) if (code[i].includes(snip) && --c === 0) return i + 1;
      throw new Error('LC ' + n + ' ap' + ap + ' line nahi mili: ' + snip);
    };
  };
  const add = (n, list) => { const d = VIZ.defs[n]; if (d) d.variants = (d.variants || []).concat(list); };
  const finalRet = (n, inp) => { const st = VIZ.defs[n].run(JSON.parse(JSON.stringify(inp))); return st[st.length - 1].ret; };
  function tracer(n, ap, render) {
    const ln = L(n, ap), rec = recorder(() => ({}));
    const st = (snip, note, o) => { o = o || {}; const r = render(o); rec.s(typeof snip === 'number' ? snip : ln(snip), note, Object.assign({ views: r.views, vars: r.vars }, o.ret !== undefined ? { ret: o.ret } : {})); };
    const end = (snip, note, ret, o) => { if (rec.steps.length >= MAX_STEPS) rec.steps.length = MAX_STEPS - 1; st(snip, note, Object.assign({}, o, { ret })); return rec.steps; };
    return { st, end, ln };
  }

  // ---- list helpers ----
  const mk = (vals, pre, pos) => {
    const N = {}, ids = vals.map((v, i) => pre + i);
    vals.forEach((v, i) => { N[pre + i] = { id: pre + i, val: v, next: i + 1 < vals.length ? pre + (i + 1) : null }; });
    if (pos !== undefined && pos >= 0 && pos < ids.length) N[ids[ids.length - 1]].next = ids[pos];
    return { N, ids };
  };
  const LV = (N, order, label, ptrs, hl) => {
    const ptr = [], free = [];
    Object.entries(ptrs || {}).forEach(([lab, id]) => { if (id === undefined) return; if (id === null) free.push({ label: lab, val: 'null' }); else ptr.push({ id, label: lab }); });
    return { type: 'list', label, nodes: order.map(id => ({ id, val: N[id].val, next: N[id].next })), hl: hl || {}, ptr, free };
  };
  const A = (label, vals, hl, ptr) => ({ type: 'array', label, vals, hl: hl || {}, ptr: ptr || [] });
  const S = (label, items, hl) => ({ type: 'set', label, items, hl });
  const T = (label, value) => ({ type: 'text', label, value: String(value) });
  const nm = (N, id) => (id === null || id === undefined ? 'null' : 'ListNode(val=' + N[id].val + ')');
  const follow = (N, start) => { const out = [], seen = new Set(); let c = start; while (c !== null && c !== undefined && !seen.has(c)) { out.push(c); seen.add(c); c = N[c].next; } return out; };
  const chain = (N, start) => { const f = follow(N, start); return (f.map(id => N[id].val).join(' → ') || 'null') + (f.length && N[f[f.length - 1]].next !== null ? ' → (cycle)' : ' → null'); };
  const listS = a => 'ArrayList size=' + a.length + ' [' + a.join(', ') + ']';
  const cycText = (N, ids, pos) => T('cycle', pos >= 0 && pos < ids.length ? 'tail (' + N[ids[ids.length - 1]].val + ').next → index ' + pos : 'nahi (tail.next = null)');
  const opt = (k, v) => (v === undefined ? {} : { [k]: v });

  // ================= LC 206 — Brute (values copy) =================
  add(206, [{
    label: 'Values copy', title: 'Reverse Linked List (Brute: values ulte likho)', ap: 0,
    run({ head }) {
      const { N, ids } = mk(head, 'n');
      let vals = null, node, cur, i;
      const H = ids.length ? ids[0] : null;
      const tr = tracer(206, 0, o => ({
        views: [LV(N, ids, 'list', Object.assign({ head: H }, opt('node', node), opt('cur', cur)), o.hl)].concat(vals ? [A('vals', vals.slice(), o.ah, i !== undefined && i >= 0 ? [{ i, label: 'i' }] : [])] : []),
        vars: Object.assign({ head: nm(N, H) }, vals ? { vals: listS(vals) } : {}, node !== undefined ? { node: nm(N, node) } : {}, cur !== undefined ? { cur: nm(N, cur) } : {}, i !== undefined ? { i } : {}),
      }));
      tr.st('public ListNode reverseList', 'Method call — head = ' + chain(N, H));
      vals = []; tr.st('List<Integer> vals = new ArrayList<>()', 'Khaali list (O(n) extra space)');
      for (node = H; ; node = N[node].next) {
        tr.st('for (ListNode node = head', 'node = ' + nm(N, node) + (node === null ? ' → loop khatam' : ''), { hl: node ? { [node]: 'cur' } : {} });
        if (node === null) break;
        vals.push(N[node].val); tr.st('vals.add(node.val)', 'vals.add(' + N[node].val + ')', { hl: { [node]: 'cur' }, ah: { [vals.length - 1]: 'new' } });
      }
      node = undefined;
      cur = H; tr.st('ListNode cur = head', 'cur = head — ab values ulte order me likhenge', { hl: cur ? { [cur]: 'cur' } : {} });
      for (i = vals.length - 1; ; i--) {
        tr.st('for (int i = vals.size() - 1', 'i = ' + i + (i < 0 ? ' → loop khatam' : ''), { hl: cur ? { [cur]: 'cur' } : {}, ah: i >= 0 ? { [i]: 'win' } : {} });
        if (i < 0) break;
        N[cur].val = vals[i]; tr.st('cur.val = vals.get(i)', 'cur.val = vals[' + i + '] = ' + vals[i] + ' — links wahi, sirf value badli', { hl: { [cur]: 'new' }, ah: { [i]: 'win' } });
        cur = N[cur].next; tr.st('cur = cur.next', 'cur → ' + nm(N, cur), { hl: cur ? { [cur]: 'cur' } : {} });
      }
      i = undefined;
      return tr.end('return head', 'return head → ' + chain(N, H), finalRet(206, { head }));
    },
  }]);

  // ================= LC 21 — Brute (collect + sort + naye nodes) =================
  add(21, [{
    label: 'Collect + sort', title: 'Merge Two Sorted Lists (Brute: values sort karke nayi list)', ap: 0,
    run({ list1, list2 }) {
      const a = mk(list1, 'a'), b = mk(list2, 'b'), R = { d: { id: 'd', val: 'D', next: null } };
      let vals = null, c, tail, v, rids = ['d'];
      const h1 = a.ids.length ? a.ids[0] : null, h2 = b.ids.length ? b.ids[0] : null;
      const tr = tracer(21, 0, o => ({
        views: [LV(a.N, a.ids, 'list1', opt('c', c && c[0] === 'a' ? c : undefined), o.h1), LV(b.N, b.ids, 'list2', opt('c', c && c[0] === 'b' ? c : undefined), o.h2)]
          .concat(vals ? [A('vals', vals.slice(), o.ah)] : []).concat(tail !== undefined ? [LV(R, rids, 'result (dummy →)', { dummy: 'd', tail }, o.rh)] : []),
        vars: Object.assign({ list1: chain(a.N, h1), list2: chain(b.N, h2) }, vals ? { vals: listS(vals) } : {}, v !== undefined ? { v } : {}, tail !== undefined ? { tail: tail === 'd' ? 'dummy' : 'ListNode(val=' + R[tail].val + ')' } : {}),
      }));
      tr.st('public ListNode mergeTwoLists', 'Method call — list1 = ' + chain(a.N, h1) + ', list2 = ' + chain(b.N, h2));
      vals = []; tr.st('List<Integer> vals = new ArrayList<>()', 'Khaali list');
      for (c = h1; c !== null; c = a.N[c].next) { vals.push(a.N[c].val); tr.st('for (ListNode c = list1', 'list1 se ' + a.N[c].val, { h1: { [c]: 'cur' }, ah: { [vals.length - 1]: 'new' } }); }
      for (c = h2; c !== null; c = b.N[c].next) { vals.push(b.N[c].val); tr.st('for (ListNode c = list2', 'list2 se ' + b.N[c].val, { h2: { [c]: 'cur' }, ah: { [vals.length - 1]: 'new' } }); }
      c = undefined;
      vals.sort((x, y) => x - y); tr.st('Collections.sort(vals)', 'Sort → [' + vals.join(', ') + '] — O((m+n) log(m+n)); lists already sorted thi, fayda nahi uthaya');
      tail = 'd'; tr.st('ListNode dummy = new ListNode(0), tail = dummy', 'dummy + tail — naye nodes yahan judenge');
      vals.forEach((x, i) => {
        v = x; tr.st('for (int v : vals)', 'v = ' + x, { ah: { [i]: 'cur' } });
        const id = 'r' + i; R[id] = { id, val: x, next: null }; R[tail].next = id; rids.push(id);
        tr.st('tail.next = new ListNode(v)', 'naya node ' + x + ' (extra memory)', { ah: { [i]: 'cur' }, rh: { [id]: 'new' } });
        tail = id; tr.st('tail = tail.next', 'tail → ' + x, { ah: { [i]: 'cur' }, rh: { [id]: 'cur' } });
      });
      v = undefined;
      return tr.end('return dummy.next', 'return [' + vals.join(', ') + '] — O(m+n) extra nodes', finalRet(21, { list1, list2 }));
    },
  }]);

  // ================= LC 141 / 142 — Brute (HashSet of nodes) =================
  const hashCycle = (n, title, retNode) => ({
    label: 'HashSet', title, ap: 0,
    run({ head, pos }) {
      const { N, ids } = mk(head, 'n', pos), seen = [];
      let cur, setOn = false;
      const tag = id => '#' + ids.indexOf(id) + '(' + N[id].val + ')';
      const tr = tracer(n, 0, o => ({
        views: [LV(N, ids, 'list', opt('cur', cur), o.hl), cycText(N, ids, pos)].concat(setOn ? [S('HashSet seen (node refs)', seen.slice(), o.sh)] : []),
        vars: Object.assign({ head: nm(N, ids.length ? ids[0] : null) }, setOn ? { seen: 'HashSet size=' + seen.length + ' [' + seen.join(', ') + ']' } : {}, cur !== undefined ? { cur: nm(N, cur) } : {}),
      }));
      tr.st(retNode ? 'public ListNode detectCycle' : 'public boolean hasCycle', 'Method call — head = ' + chain(N, ids.length ? ids[0] : null));
      setOn = true; tr.st('Set<ListNode> seen = new HashSet<>()', 'Khaali HashSet — node REFERENCES rakhenge (values nahi)');
      cur = ids.length ? ids[0] : null; tr.st('ListNode cur = head', 'cur = head', { hl: cur ? { [cur]: 'cur' } : {} });
      for (let g = 0; g < 200; g++) {
        tr.st('while (cur != null)', 'cur = ' + nm(N, cur) + (cur === null ? ' → loop khatam' : ' → andar'), { hl: cur ? { [cur]: 'cur' } : {} });
        if (cur === null) break;
        if (seen.includes(tag(cur))) return tr.end('if (!seen.add(cur))', 'seen.add(' + tag(cur) + ') = false → ye node pehle dekha! ' + (retNode ? 'return ' + nm(N, cur) + ' (cycle start)' : 'return true'), finalRet(n, { head, pos }), { hl: { [cur]: 'found' }, sh: tag(cur) });
        seen.push(tag(cur));
        tr.st('if (!seen.add(cur))', 'seen.add(' + tag(cur) + ') = true → naya node', { hl: { [cur]: 'cur' }, sh: tag(cur) });
        cur = N[cur].next; tr.st('cur = cur.next', 'cur → ' + (cur === null ? 'null' : tag(cur)), { hl: cur ? { [cur]: 'cur' } : {} });
      }
      return tr.end(retNode ? 'return null' : 'return false', 'null aa gaya → cycle nahi (O(n) extra space)', finalRet(n, { head, pos }));
    },
  });
  add(141, [hashCycle(141, 'Linked List Cycle (Brute: HashSet of nodes)', false)]);
  add(142, [hashCycle(142, 'Linked List Cycle II (Brute: HashSet — pehla repeat = start)', true)]);

  // ================= LC 19 — Brute (two pass) =================
  add(19, [{
    label: 'Two pass (length)', title: 'Remove Nth From End (Brute: length − n)', ap: 0,
    run({ head, n }) {
      const { N, ids } = mk(head, 'n');
      let len, cur, dummy = false, prev, i;
      const order = () => (dummy ? ['d'] : []).concat(ids.filter(id => follow(N, dummy ? 'd' : ids[0]).includes(id) || !dummy));
      const tr = tracer(19, 0, o => ({
        views: [LV(N, dummy ? order() : ids, dummy ? 'dummy → list' : 'list', Object.assign(opt('cur', cur), opt('prev', prev)), o.hl)],
        vars: Object.assign({ head: nm(N, ids.length ? ids[0] : null), n }, len !== undefined ? { len } : {}, cur !== undefined ? { cur: nm(N, cur) } : {}, dummy ? { dummy: 'ListNode(0) → head' } : {}, prev !== undefined ? { prev: prev === 'd' ? 'dummy' : nm(N, prev) } : {}, i !== undefined ? { i, 'len − n': len - n } : {}),
      }));
      tr.st('public ListNode removeNthFromEnd', 'Method call — head = ' + chain(N, ids[0]) + ', n = ' + n);
      len = 0; tr.st('int len = 0', 'len = 0 — Pass 1: length gino');
      for (cur = ids[0]; cur !== null; cur = N[cur].next) { len++; tr.st('for (ListNode cur = head', 'cur = ' + N[cur].val + ' → len = ' + len, { hl: { [cur]: 'cur' } }); }
      cur = undefined;
      N.d = { id: 'd', val: 'D', next: ids[0] }; dummy = true;
      tr.st('ListNode dummy = new ListNode(0, head)', 'dummy → head (head delete case ke liye)');
      prev = 'd'; tr.st('ListNode prev = dummy', 'Pass 2: prev = dummy; len − n = ' + (len - n) + ' steps', { hl: { d: 'cur' } });
      for (i = 0; ; i++) {
        tr.st('for (int i = 0; i < len - n', 'i = ' + i + ' < ' + (len - n) + ' ? ' + (i < len - n ? 'haan' : 'nahi → ruk jao'), { hl: { [prev]: 'cur' } });
        if (i >= len - n) break;
        prev = N[prev].next; tr.st('prev = prev.next', 'prev → ' + N[prev].val, { hl: { [prev]: 'cur' } });
      }
      i = undefined;
      const target = N[prev].next;
      N[prev].next = N[target].next;
      tr.st('prev.next = prev.next.next', 'Node ' + N[target].val + ' bypass → ' + chain(N, N.d.next), { hl: { [prev]: 'found' } });
      return tr.end('return dummy.next', 'return dummy.next → ' + chain(N, N.d.next), finalRet(19, { head, n }));
    },
  }]);

  // ================= LC 143 — Brute (nodes ArrayList) =================
  add(143, [{
    label: 'ArrayList of nodes', title: 'Reorder List (Brute: nodes ArrayList + do pointers)', ap: 0,
    run({ head }) {
      const { N, ids } = mk(head, 'n');
      let nodes = null, cur, i, j;
      const H = ids[0];
      const view = o => {
        const f = follow(N, H), order = f.concat(ids.filter(id => !f.includes(id)));
        const ptr = [i !== undefined ? { i, label: 'i' } : null, j !== undefined ? { i: j, label: 'j' } : null].filter(Boolean);
        return [LV(N, order, 'list (head se)', opt('cur', cur), o.hl)].concat(nodes ? [A('nodes (ArrayList)', nodes.map(id => N[id].val), o.ah, ptr)] : []);
      };
      const tr = tracer(143, 0, o => ({ views: view(o), vars: Object.assign({ head: nm(N, H) }, nodes ? { nodes: 'ArrayList<ListNode> size=' + nodes.length } : {}, cur !== undefined ? { cur: nm(N, cur) } : {}, i !== undefined ? { i, j } : {}) }));
      tr.st('public void reorderList', 'Method call — head = ' + chain(N, H));
      nodes = []; tr.st('List<ListNode> nodes = new ArrayList<>()', 'Khaali list (O(n) extra space)');
      for (cur = H; cur !== null; cur = N[cur].next) { nodes.push(cur); tr.st('for (ListNode cur = head', 'nodes.add(' + N[cur].val + ')', { hl: { [cur]: 'cur' }, ah: { [nodes.length - 1]: 'new' } }); }
      cur = undefined;
      i = 0; j = nodes.length - 1; tr.st('int i = 0, j = nodes.size() - 1', 'i = 0, j = ' + j);
      while (true) {
        tr.st('while (i < j)', 'i = ' + i + ' < j = ' + j + ' ? ' + (i < j ? 'haan' : 'nahi'), { ah: { [i]: 'cur', [j]: 'win' } });
        if (i >= j) break;
        N[nodes[i]].next = nodes[j];
        tr.st('nodes.get(i).next = nodes.get(j)', N[nodes[i]].val + '.next = ' + N[nodes[j]].val + ' (aage se → peeche se)', { hl: { [nodes[i]]: 'cur', [nodes[j]]: 'new' }, ah: { [i]: 'cur', [j]: 'win' } });
        i++; tr.st('i++', 'i = ' + i, { ah: { [i]: 'cur', [j]: 'win' } });
        if (i === j) { tr.st('if (i == j) break', 'i == j → break', { ah: { [i]: 'found' } }); break; }
        tr.st('if (i == j) break', 'i ≠ j → aage', { ah: { [i]: 'cur', [j]: 'win' } });
        N[nodes[j]].next = nodes[i];
        tr.st('nodes.get(j).next = nodes.get(i)', N[nodes[j]].val + '.next = ' + N[nodes[i]].val + ' (peeche se → agla aage wala)', { hl: { [nodes[j]]: 'cur', [nodes[i]]: 'new' }, ah: { [i]: 'win', [j]: 'cur' } });
        j--; tr.st('j--', 'j = ' + j, { ah: { [i]: 'cur', [j]: 'win' } });
      }
      N[nodes[i]].next = null;
      return tr.end('nodes.get(i).next = null', N[nodes[i]].val + '.next = null (cycle na bane) → ' + chain(N, H), finalRet(143, { head }), { hl: { [nodes[i]]: 'found' } });
    },
  }]);

  // ================= LC 25 — Brute (values list) =================
  add(25, [{
    label: 'Values reverse', title: 'Reverse Nodes in k-Group (Brute: values list me reverse)', ap: 0,
    run({ head, k }) {
      const { N, ids } = mk(head, 'n');
      let vals = null, c, s, v;
      const tr = tracer(25, 0, o => ({
        views: [LV(N, ids, 'list', opt('c', c), o.hl)].concat(vals ? [A('vals', vals.slice(), o.ah)] : []),
        vars: Object.assign({ head: nm(N, ids[0]), k }, vals ? { vals: listS(vals) } : {}, c !== undefined ? { c: nm(N, c) } : {}, s !== undefined ? { s } : {}, v !== undefined ? { v } : {}),
      }));
      tr.st('public ListNode reverseKGroup', 'Method call — head = ' + chain(N, ids[0]) + ', k = ' + k);
      vals = []; tr.st('List<Integer> vals = new ArrayList<>()', 'Khaali list');
      for (c = ids[0]; c !== null; c = N[c].next) { vals.push(N[c].val); tr.st('for (ListNode c = head', 'vals.add(' + N[c].val + ')', { hl: { [c]: 'cur' }, ah: { [vals.length - 1]: 'new' } }); }
      c = undefined;
      for (s = 0; ; s += k) {
        const go = s + k <= vals.length;
        tr.st('for (int s = 0; s + k <= vals.size()', 's = ' + s + ': ' + (s + k) + ' ≤ ' + vals.length + ' ? ' + (go ? 'haan — poora group' : 'nahi → bache ' + (vals.length - s) + ' waise hi'));
        if (!go) break;
        const part = vals.slice(s, s + k).reverse(); part.forEach((x, t) => { vals[s + t] = x; });
        const hl = {}; for (let t = s; t < s + k; t++) hl[t] = 'new';
        tr.st('Collections.reverse(vals.subList(s, s + k))', 'vals[' + s + '..' + (s + k - 1) + '] ulta → [' + part.join(', ') + ']', { ah: hl });
      }
      s = undefined;
      c = ids[0]; tr.st(tr.ln('ListNode c = head', 2), 'c = head — ab values wapas nodes me', { hl: { [c]: 'cur' } });
      vals.forEach((x, i) => {
        v = x; tr.st('for (int v : vals)', 'v = ' + x, { hl: { [c]: 'cur' }, ah: { [i]: 'cur' } });
        N[c].val = x; tr.st('c.val = v', 'node ki value = ' + x + ' (links nahi badle)', { hl: { [c]: 'new' }, ah: { [i]: 'cur' } });
        c = N[c].next; tr.st('c = c.next;', 'c → ' + nm(N, c), { hl: c ? { [c]: 'cur' } : {} });
      });
      v = undefined; c = undefined;
      return tr.end('return head', 'return ' + chain(N, ids[0]) + ' — O(n) extra space, values badli', finalRet(25, { head, k }));
    },
  }]);
})();
