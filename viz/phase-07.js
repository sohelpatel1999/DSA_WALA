// Phase 7 — Trees visualizers. Tree input = LeetCode level-order JSON ('[3,9,20,null,null,15,7]').
// Tree view node ids = level-order array index; tree badle (invert) toh har step pe dobara serialize hota hai.
(function () {
  const { buildTree } = VIZ.util;
  const MAXS = 560;
  const N = n => (n ? 'TreeNode(val=' + n.val + ')' : 'null');
  const V = n => (n ? String(n.val) : 'null');
  const mk = arr => (buildTree(Array.isArray(arr) ? arr : [])[0] || null);
  const L = a => '[' + a.join(', ') + ']';

  // Tree → LeetCode level-order array + (node.id → index) map
  function ser(root) {
    const out = [], idx = {};
    if (!root) return { arr: out, idx };
    const q = [root];
    while (q.length) {
      const n = q.shift();
      if (n) { idx[n.id] = out.length; out.push(n.val); q.push(n.left, n.right); } else out.push(null);
    }
    while (out.length && out[out.length - 1] === null) out.pop();
    return { arr: out, idx };
  }
  const serStr = root => '[' + ser(root).arr.map(x => (x === null ? 'null' : x)).join(',') + ']';
  // hl: {node.id: cls}, ptr: [[node, label]]
  function tv(label, root, hl, ptr) {
    const { arr, idx } = ser(root), h = {};
    Object.keys(hl || {}).forEach(id => { if (idx[id] !== undefined) h[idx[id]] = hl[id]; });
    const p = (ptr || []).filter(x => x[0] && idx[x[0].id] !== undefined).map(x => ({ id: idx[x[0].id], label: x[1] }));
    return { type: 'tree', label, nodes: arr, hl: h, ptr: p };
  }
  function findVal(root, v) {
    if (!root) return null;
    if (root.val === v) return root;
    return findVal(root.left, v) || findVal(root.right, v);
  }
  function Calls() {
    const fr = [];
    return {
      push(method, args, vars) { const f = { method, args, line: 1, vars: vars || {} }; fr.push(f); return f; },
      pop() { fr.pop(); },
      snap(line) {
        if (fr.length) fr[fr.length - 1].line = line;
        return fr.slice().reverse().map(f => ({ method: f.method, args: f.args, line: f.line, vars: Object.assign({}, f.vars) }));
      },
    };
  }
  function Rec() {
    const steps = [];
    return { steps, add(st, force) { if (force || steps.length < MAXS) steps.push(st); } };
  }
  const withCur = (H, n, cls) => Object.assign({}, H, n ? { [n.id]: cls || 'cur' } : {});
  const qItems = arr => arr.map(V);

  // ---------------- 104 Maximum Depth ----------------
  function md104rec({ root }) {
    const R = mk(root), { steps, add } = Rec(), cs = Calls(), H = {}, P = new Map();
    let cur = null;
    const ptrs = () => [...P.entries()].concat(cur ? [[cur, 'root']] : []);
    const st = (line, note) => add({ line, note, views: [tv('tree', R, withCur(H, cur), ptrs())], frames: cs.snap(line) });
    function go(n) {
      const f = cs.push('maxDepth', 'root=' + V(n), { root: N(n) });
      const prev = cur; cur = n;
      if (!n) { st(2, 'root == null → base case: khaali tree ki depth 0, return 0'); cs.pop(); cur = prev; return 0; }
      H[n.id] = 'win';
      st(2, 'root = ' + n.val + ', null nahi → aage badho');
      st(3, 'Pehle left subtree ki depth: maxDepth(' + V(n.left) + ') call');
      const l = go(n.left); cur = n; f.vars.left = String(l);
      st(3, 'left = ' + l + ' wapas aaya (node ' + n.val + ' ka left subtree)');
      st(4, 'Ab right subtree: maxDepth(' + V(n.right) + ') call');
      const r = go(n.right); cur = n; f.vars.right = String(r);
      st(4, 'right = ' + r + ' wapas aaya');
      const d = 1 + Math.max(l, r);
      H[n.id] = 'done'; P.set(n, 'd=' + d);
      st(5, 'return 1 + max(' + l + ', ' + r + ') = ' + d + ' → node ' + n.val + ' ki depth ' + d);
      cs.pop(); cur = prev; return d;
    }
    const ans = go(R);
    add({ line: R ? 5 : 2, note: 'Saari calls khatam. Tree ki max depth = ' + ans, views: [tv('tree', R, H, [...P.entries()])], vars: { result: String(ans) }, ret: String(ans) }, true);
    return steps;
  }
  function md104bfs({ root }) {
    const R = mk(root), { steps, add } = Rec(), H = {};
    let q = [], depth = 0, size = '-', i = '-', node = null;
    const st = (line, note, extra) => add(Object.assign({ line, note,
      views: [tv('tree', R, withCur(H, node), node ? [[node, 'node']] : []), { type: 'queue', label: 'Queue q', items: qItems(q) }],
      vars: { root: N(R), q: 'LinkedList ' + L(qItems(q)), depth: String(depth), size: String(size), i: String(i), node: N(node) } }, extra || {}));
    if (!R) { st(2, 'root == null → return 0', { ret: '0' }); return steps; }
    st(2, 'root null nahi');
    st(3, 'q = new LinkedList<>() — BFS ke liye queue');
    q.push(R); H[R.id] = 'win';
    st(4, 'q.offer(root) → queue me ' + R.val);
    st(5, 'depth = 0');
    while (q.length) {
      st(6, 'q khaali nahi → ek naya level shuru');
      size = q.length;
      st(7, 'size = q.size() = ' + size + ' → is level me ' + size + ' node(s)');
      depth++;
      st(8, 'depth++ → ' + depth);
      for (i = 0; i < size; i++) {
        st(9, 'i = ' + i + ' < size (' + size + ')');
        node = q.shift(); H[node.id] = 'done';
        st(10, 'node = q.poll() → ' + node.val);
        if (node.left) { q.push(node.left); H[node.left.id] = 'win'; }
        st(11, node.left ? 'left child ' + node.left.val + ' queue me (agla level)' : 'left child null → kuch nahi');
        if (node.right) { q.push(node.right); H[node.right.id] = 'win'; }
        st(12, node.right ? 'right child ' + node.right.val + ' queue me' : 'right child null → kuch nahi');
      }
      node = null; i = '-';
    }
    st(15, 'Queue khaali → saare levels gin liye. return depth = ' + depth, { ret: String(depth) });
    return steps;
  }
  function md104stack({ root }) {
    const R = mk(root), { steps, add } = Rec(), H = {};
    let nodes = [], depths = [], best = 0, node = null, d = '-';
    const st = (line, note, extra) => add(Object.assign({ line, note,
      views: [tv('tree', R, withCur(H, node), node ? [[node, 'd=' + d]] : []),
        { type: 'stack', label: 'Stack nodes', items: qItems(nodes) }, { type: 'stack', label: 'Stack depths', items: depths.slice() }],
      vars: { root: N(R), nodes: 'ArrayDeque ' + L(qItems(nodes).reverse()), depths: 'ArrayDeque ' + L(depths.slice().reverse()), best: String(best), node: N(node), d: String(d) } }, extra || {}));
    if (!R) { st(2, 'root == null → return 0', { ret: '0' }); return steps; }
    st(2, 'root null nahi');
    st(3, 'nodes stack bana (node rakhega)');
    st(4, 'depths stack bana (us node ki depth rakhega — dono saath push/pop)');
    nodes.push(R); H[R.id] = 'win';
    st(5, 'nodes.push(root = ' + R.val + ')');
    depths.push(1);
    st(6, 'depths.push(1) → root ki depth 1');
    st(7, 'best = 0');
    while (nodes.length) {
      st(8, 'stack khaali nahi');
      node = nodes.pop(); H[node.id] = 'done';
      st(9, 'node = nodes.pop() → ' + node.val + ' (top se)');
      d = depths.pop();
      st(10, 'd = depths.pop() → ' + d);
      best = Math.max(best, d);
      st(11, 'best = max(best, ' + d + ') = ' + best);
      if (node.right) { nodes.push(node.right); depths.push(d + 1); H[node.right.id] = 'win'; }
      st(12, node.right ? 'right child ' + node.right.val + ' push (depth ' + (d + 1) + ') — pehle right, taaki left upar rahe' : 'right child null');
      if (node.left) { nodes.push(node.left); depths.push(d + 1); H[node.left.id] = 'win'; }
      st(13, node.left ? 'left child ' + node.left.val + ' push (depth ' + (d + 1) + ') → agla pop yahi hoga (preorder)' : 'left child null');
    }
    node = null; d = '-';
    st(15, 'Stack khaali → return best = ' + best, { ret: String(best) });
    return steps;
  }
  VIZ.defs[104] = {
    title: 'Maximum Depth (Recursive DFS)', label: 'Recursive', ap: 0,
    inputs: [{ key: 'root', label: 'root (level order)', type: 'json', def: '[3,9,20,null,null,15,7]' }],
    run: md104rec,
    variants: [
      { label: 'BFS (queue)', title: 'Maximum Depth (BFS level count)', ap: 1, run: md104bfs },
      { label: 'Iterative (stack)', title: 'Maximum Depth (Iterative DFS stack)', ap: 2, run: md104stack },
    ],
  };

  // ---------------- 100 Same Tree ----------------
  function same100rec({ p, q }) {
    const A = mk(p), B = mk(q), { steps, add } = Rec(), cs = Calls(), HA = {}, HB = {};
    let ca = null, cb = null;
    const st = (line, note) => add({ line, note,
      views: [tv('tree p', A, withCur(HA, ca), ca ? [[ca, 'p']] : []), tv('tree q', B, withCur(HB, cb), cb ? [[cb, 'q']] : [])], frames: cs.snap(line) });
    function go(a, b) {
      cs.push('isSameTree', 'p=' + V(a) + ', q=' + V(b), { p: N(a), q: N(b) });
      const pa = ca, pb = cb; ca = a; cb = b;
      const back = r => { cs.pop(); ca = pa; cb = pb; return r; };
      if (!a && !b) { st(2, 'p aur q dono null → is jagah dono khaali, same → return true'); return back(true); }
      st(2, 'Dono null nahi');
      if (!a || !b) {
        if (a) HA[a.id] = 'skip'; if (b) HB[b.id] = 'skip';
        st(3, 'Ek null hai, doosra nahi (' + V(a) + ' vs ' + V(b) + ') → shape alag → return false'); return back(false);
      }
      st(3, 'Dono exist karte hain');
      if (a.val !== b.val) { HA[a.id] = 'skip'; HB[b.id] = 'skip'; st(4, 'Value alag: ' + a.val + ' ≠ ' + b.val + ' → return false'); return back(false); }
      HA[a.id] = 'win'; HB[b.id] = 'win';
      st(4, 'Value same: ' + a.val + ' == ' + b.val + ' ✓');
      st(5, 'Left pair check: isSameTree(' + V(a.left) + ', ' + V(b.left) + ')');
      const l = go(a.left, b.left);
      if (!l) { st(5, 'Left pair false aaya → && short-circuit, right check hi nahi hoga → return false'); return back(false); }
      st(5, 'Left pair true ✓ → ab right pair: isSameTree(' + V(a.right) + ', ' + V(b.right) + ')');
      const r = go(a.right, b.right);
      if (r) { HA[a.id] = 'done'; HB[b.id] = 'done'; }
      st(5, 'Right pair ' + r + ' → return ' + r + ' (node ' + a.val + ' ka poora subtree ' + (r ? 'same' : 'alag') + ')');
      return back(r);
    }
    const ans = go(A, B);
    add({ line: 5, note: 'Final answer: ' + ans, views: [tv('tree p', A, HA), tv('tree q', B, HB)], vars: { result: String(ans) }, ret: String(ans) }, true);
    return steps;
  }
  function same100iter({ p, q }) {
    const A = mk(p), B = mk(q), { steps, add } = Rec(), HA = {}, HB = {};
    let queue = [], a = null, b = null, pair = null;
    const pstr = x => '(' + V(x[0]) + ',' + V(x[1]) + ')';
    const st = (line, note, extra) => add(Object.assign({ line, note,
      views: [tv('tree p', A, withCur(HA, a), a ? [[a, 'a']] : []), tv('tree q', B, withCur(HB, b), b ? [[b, 'b']] : []), { type: 'queue', label: 'Queue of pairs (a, b)', items: queue.map(pstr) }],
      vars: { queue: 'LinkedList ' + L(queue.map(pstr)), pair: pair ? 'TreeNode[2] ' + pstr(pair) : 'null', a: N(a), b: N(b) } }, extra || {}));
    st(2, 'queue = new LinkedList<>() — har element ek pair {p-node, q-node}');
    queue.push([A, B]);
    st(3, 'queue.offer({p, q}) → roots ka pair');
    while (queue.length) {
      st(4, 'queue khaali nahi');
      pair = queue.shift();
      st(5, 'pair = queue.poll() → ' + pstr(pair));
      a = pair[0]; b = pair[1];
      st(6, 'a = ' + V(a) + ', b = ' + V(b));
      if (!a && !b) { st(7, 'Dono null → is position pe dono khaali, continue'); continue; }
      if (!a || !b || a.val !== b.val) {
        if (a) HA[a.id] = 'skip'; if (b) HB[b.id] = 'skip';
        st(8, (!a || !b ? 'Ek null hai' : 'Value alag ' + a.val + ' ≠ ' + b.val) + ' → return false', { ret: 'false' }); return steps;
      }
      HA[a.id] = 'done'; HB[b.id] = 'done';
      st(8, 'Dono exist aur value same (' + a.val + ') ✓');
      queue.push([a.left, b.left]);
      st(9, 'offer (a.left, b.left) = ' + pstr([a.left, b.left]));
      queue.push([a.right, b.right]);
      st(10, 'offer (a.right, b.right) = ' + pstr([a.right, b.right]));
    }
    a = b = pair = null;
    st(12, 'Queue khaali, koi mismatch nahi → return true', { ret: 'true' });
    return steps;
  }
  VIZ.defs[100] = {
    title: 'Same Tree (Recursive)', label: 'Recursive', ap: 1,
    inputs: [{ key: 'p', label: 'p (level order)', type: 'json', def: '[1,2,3]' }, { key: 'q', label: 'q (level order)', type: 'json', def: '[1,2,3]' }],
    run: same100rec,
    variants: [{ label: 'Iterative (queue)', title: 'Same Tree (Queue of pairs)', ap: 2, run: same100iter }],
  };

  // ---------------- 226 Invert Binary Tree ----------------
  function inv226rec({ root }) {
    const R = mk(root), { steps, add } = Rec(), cs = Calls(), H = {};
    let cur = null;
    const st = (line, note) => add({ line, note, views: [tv('tree (live)', R, withCur(H, cur), cur ? [[cur, 'root']] : [])], frames: cs.snap(line) });
    function go(n) {
      const f = cs.push('invertTree', 'root=' + V(n), { root: N(n) });
      const prev = cur; cur = n;
      if (!n) { st(2, 'root == null → return null'); cs.pop(); cur = prev; return null; }
      H[n.id] = 'win';
      st(2, 'root = ' + n.val + ' → pehle dono subtrees invert karenge');
      st(3, 'invertTree(root.left = ' + V(n.left) + ')');
      const l = go(n.left); cur = n; f.vars.left = N(l);
      st(3, 'left = ' + V(l) + ' (left subtree ab inverted hai)');
      st(4, 'invertTree(root.right = ' + V(n.right) + ')');
      const r = go(n.right); cur = n; f.vars.right = N(r);
      st(4, 'right = ' + V(r) + ' (right subtree inverted)');
      n.left = r; H[n.id] = 'new';
      st(5, 'root.left = right (' + V(r) + ') — tree upar live badla');
      n.right = l;
      st(6, 'root.right = left (' + V(l) + ') → node ' + n.val + ' ke children swap ho gaye');
      H[n.id] = 'done';
      st(7, 'return root (' + n.val + ')');
      cs.pop(); cur = prev; return n;
    }
    const ans = go(R);
    add({ line: R ? 7 : 2, note: 'Inverted tree = ' + serStr(ans), views: [tv('tree (inverted)', ans, H)], vars: { result: serStr(ans) }, ret: serStr(ans) }, true);
    return steps;
  }
  function inv226iter({ root }) {
    const R = mk(root), { steps, add } = Rec(), H = {};
    let q = [], node = null, tmp = null;
    const st = (line, note, extra) => add(Object.assign({ line, note,
      views: [tv('tree (live)', R, withCur(H, node), node ? [[node, 'node']] : []), { type: 'queue', label: 'Queue q', items: qItems(q) }],
      vars: { root: N(R), q: 'LinkedList ' + L(qItems(q)), node: N(node), tmp: N(tmp) } }, extra || {}));
    if (!R) { st(2, 'root == null → return null', { ret: '[]' }); return steps; }
    st(2, 'root null nahi');
    st(3, 'q = new LinkedList<>()');
    q.push(R); H[R.id] = 'win';
    st(4, 'q.offer(root = ' + R.val + ')');
    while (q.length) {
      st(5, 'q khaali nahi');
      node = q.shift(); tmp = null;
      st(6, 'node = q.poll() → ' + node.val);
      tmp = node.left;
      st(7, 'tmp = node.left = ' + V(tmp));
      node.left = node.right; H[node.id] = 'new';
      st(8, 'node.left = node.right (' + V(node.left) + ')');
      node.right = tmp;
      st(9, 'node.right = tmp (' + V(tmp) + ') → ' + node.val + ' ke children swap');
      H[node.id] = 'done';
      if (node.left) { q.push(node.left); H[node.left.id] = 'win'; }
      st(10, node.left ? 'node.left (' + node.left.val + ') queue me' : 'node.left null');
      if (node.right) { q.push(node.right); H[node.right.id] = 'win'; }
      st(11, node.right ? 'node.right (' + node.right.val + ') queue me' : 'node.right null');
    }
    node = tmp = null;
    st(13, 'Queue khaali → return root = ' + serStr(R), { ret: serStr(R) });
    return steps;
  }
  VIZ.defs[226] = {
    title: 'Invert Binary Tree (Recursive)', label: 'Recursive', ap: 0,
    inputs: [{ key: 'root', label: 'root (level order)', type: 'json', def: '[4,2,7,1,3,6,9]' }],
    run: inv226rec,
    variants: [{ label: 'Iterative (BFS)', title: 'Invert Binary Tree (BFS queue)', ap: 1, run: inv226iter }],
  };

  // ---------------- 101 Symmetric Tree ----------------
  function sym101rec({ root }) {
    const R = mk(root), { steps, add } = Rec(), cs = Calls(), H = {};
    let ca = null, cb = null;
    const st = (line, note) => {
      const h = Object.assign({}, H); if (ca) h[ca.id] = 'cur'; if (cb) h[cb.id] = 'cur';
      add({ line, note, views: [tv('tree', R, h, [ca ? [ca, 'a'] : [null], cb ? [cb, 'b'] : [null]])], frames: cs.snap(line) });
    };
    cs.push('isSymmetric', 'root=' + V(R), { root: N(R) });
    if (!R) { st(2, 'root == null → khaali tree symmetric hai'); add({ line: 2, note: 'return true', views: [tv('tree', R)], vars: { result: 'true' }, ret: 'true' }, true); return steps; }
    H[R.id] = 'done';
    st(2, 'root = ' + R.val + ' (null nahi)');
    st(3, 'Left aur right subtree mirror hain? isMirror(' + V(R.left) + ', ' + V(R.right) + ')');
    function go(a, b) {
      cs.push('isMirror', 'a=' + V(a) + ', b=' + V(b), { a: N(a), b: N(b) });
      const pa = ca, pb = cb; ca = a; cb = b;
      const back = r => { cs.pop(); ca = pa; cb = pb; return r; };
      if (!a && !b) { st(7, 'a aur b dono null → mirror ✓ return true'); return back(true); }
      st(7, 'Dono null nahi');
      if (!a || !b) { if (a) H[a.id] = 'skip'; if (b) H[b.id] = 'skip'; st(8, 'Sirf ek null (' + V(a) + ', ' + V(b) + ') → mirror nahi, return false'); return back(false); }
      st(8, 'Dono exist');
      if (a.val !== b.val) { H[a.id] = 'skip'; H[b.id] = 'skip'; st(9, a.val + ' ≠ ' + b.val + ' → return false'); return back(false); }
      st(9, 'Value same: ' + a.val + ' == ' + b.val + ' ✓');
      st(10, 'Outer pair: isMirror(a.left = ' + V(a.left) + ', b.right = ' + V(b.right) + ')');
      const o = go(a.left, b.right);
      if (!o) { st(10, 'Outer pair false → short-circuit, return false'); return back(false); }
      st(10, 'Outer ✓ → inner pair: isMirror(a.right = ' + V(a.right) + ', b.left = ' + V(b.left) + ')');
      const i = go(a.right, b.left);
      if (i) { H[a.id] = 'done'; H[b.id] = 'done'; }
      st(10, 'Inner ' + i + ' → return ' + i);
      return back(i);
    }
    const ans = go(R.left, R.right);
    st(3, 'isMirror ne ' + ans + ' diya → return ' + ans);
    add({ line: 3, note: 'Final: ' + ans, views: [tv('tree', R, H)], vars: { result: String(ans) }, ret: String(ans) }, true);
    return steps;
  }
  function sym101iter({ root }) {
    const R = mk(root), { steps, add } = Rec(), H = {};
    let q = [], a = null, b = null;
    const st = (line, note, extra) => {
      const h = Object.assign({}, H); if (a) h[a.id] = 'cur'; if (b) h[b.id] = 'cur';
      add(Object.assign({ line, note, views: [tv('tree', R, h, [a ? [a, 'a'] : [null], b ? [b, 'b'] : [null]]), { type: 'queue', label: 'Queue q (pairs me)', items: qItems(q) }],
        vars: { root: N(R), q: 'LinkedList ' + L(qItems(q)), a: N(a), b: N(b) } }, extra || {}));
    };
    if (!R) { st(2, 'root == null → return true', { ret: 'true' }); return steps; }
    H[R.id] = 'done';
    st(2, 'root null nahi');
    st(3, 'q = new LinkedList<>() — null bhi daal sakte hain');
    q.push(R.left);
    st(4, 'q.offer(root.left = ' + V(R.left) + ')');
    q.push(R.right);
    st(5, 'q.offer(root.right = ' + V(R.right) + ') → pehla pair taiyaar');
    while (q.length) {
      a = b = null;
      st(6, 'q khaali nahi');
      a = q.shift(); b = q.shift();
      st(7, 'a = poll() = ' + V(a) + ', b = poll() = ' + V(b));
      if (!a && !b) { st(8, 'Dono null → continue'); continue; }
      if (!a || !b || a.val !== b.val) {
        if (a) H[a.id] = 'skip'; if (b) H[b.id] = 'skip';
        st(9, (!a || !b ? 'Ek null' : a.val + ' ≠ ' + b.val) + ' → return false', { ret: 'false' }); return steps;
      }
      H[a.id] = 'done'; H[b.id] = 'done';
      st(9, 'Value same (' + a.val + ') ✓');
      q.push(a.left); st(10, 'offer a.left = ' + V(a.left) + ' (outer pair ka pehla)');
      q.push(b.right); st(11, 'offer b.right = ' + V(b.right) + ' (outer pair ka doosra)');
      q.push(a.right); st(12, 'offer a.right = ' + V(a.right) + ' (inner pair)');
      q.push(b.left); st(13, 'offer b.left = ' + V(b.left));
    }
    a = b = null;
    st(15, 'Queue khaali, har pair mirror tha → return true', { ret: 'true' });
    return steps;
  }
  VIZ.defs[101] = {
    title: 'Symmetric Tree (Recursive mirror)', label: 'Recursive', ap: 0,
    inputs: [{ key: 'root', label: 'root (level order)', type: 'json', def: '[1,2,2,3,4,4,3]' }],
    run: sym101rec,
    variants: [{ label: 'Iterative (queue)', title: 'Symmetric Tree (Queue pairs)', ap: 1, run: sym101iter }],
  };

  // ---------------- 102 Level Order ----------------
  const LL = res => '[' + res.map(l => '[' + l.join(',') + ']').join(',') + ']';
  function lo102bfs({ root }) {
    const R = mk(root), { steps, add } = Rec(), H = {};
    let res = [], q = [], size = '-', level = null, i = '-', node = null;
    const st = (line, note, extra) => add(Object.assign({ line, note,
      views: [tv('tree', R, withCur(H, node), node ? [[node, 'node']] : []), { type: 'queue', label: 'Queue q', items: qItems(q) }, { type: 'text', label: 'res', value: LL(res) }],
      vars: { res: 'ArrayList ' + LL(res), q: 'LinkedList ' + L(qItems(q)), size: String(size), level: level ? 'ArrayList ' + L(level) : 'null', i: String(i), node: N(node) } }, extra || {}));
    st(2, 'res = new ArrayList<>() — har level ki list isme jaayegi');
    if (!R) { st(3, 'root == null → return [] (khaali)', { ret: '[]' }); return steps; }
    st(3, 'root null nahi');
    st(4, 'q = new LinkedList<>()');
    q.push(R); H[R.id] = 'win';
    st(5, 'q.offer(root = ' + R.val + ')');
    while (q.length) {
      st(6, 'q me ' + q.length + ' node(s) → ye sab ek hi level ke hain');
      size = q.length;
      st(7, 'size = q.size() = ' + size + ' (loop se PEHLE save kiya)');
      level = [];
      st(8, 'level = new ArrayList<>()');
      for (i = 0; i < size; i++) {
        st(9, 'i = ' + i + ' < ' + size);
        node = q.shift(); H[node.id] = 'done';
        st(10, 'node = q.poll() → ' + node.val);
        level.push(node.val);
        st(11, 'level.add(' + node.val + ') → ' + L(level));
        if (node.left) { q.push(node.left); H[node.left.id] = 'win'; }
        st(12, node.left ? 'left ' + node.left.val + ' → queue (agle level ke liye)' : 'left null');
        if (node.right) { q.push(node.right); H[node.right.id] = 'win'; }
        st(13, node.right ? 'right ' + node.right.val + ' → queue' : 'right null');
      }
      node = null; i = '-';
      res.push(level);
      st(15, 'res.add(level) → ' + LL(res));
    }
    st(17, 'Queue khaali → return ' + LL(res), { ret: LL(res) });
    return steps;
  }
  function lo102dfs({ root }) {
    const R = mk(root), { steps, add } = Rec(), cs = Calls(), H = {};
    let res = [], cur = null;
    const st = (line, note) => add({ line, note, views: [tv('tree', R, withCur(H, cur), cur ? [[cur, 'node']] : []), { type: 'text', label: 'res', value: LL(res) }], frames: cs.snap(line) });
    const top = cs.push('levelOrder', 'root=' + V(R), { root: N(R), res: 'ArrayList []' });
    st(2, 'res = new ArrayList<>()');
    st(3, 'dfs(root, 0, res) — depth 0 se start');
    function go(n, d) {
      const f = cs.push('dfs', 'node=' + V(n) + ', depth=' + d, { node: N(n), depth: String(d), res: 'ArrayList ' + LL(res) });
      const prev = cur; cur = n;
      if (!n) { st(8, 'node == null → return'); cs.pop(); cur = prev; return; }
      H[n.id] = 'win';
      st(8, 'node = ' + n.val + ', depth = ' + d);
      if (d === res.length) { res.push([]); f.vars.res = 'ArrayList ' + LL(res); st(9, 'depth (' + d + ') == res.size() → is depth pe pehli baar → naya level list add'); }
      else st(9, 'depth ' + d + ' ki list pehle se hai (res.size() = ' + res.length + ')');
      res[d].push(n.val); f.vars.res = 'ArrayList ' + LL(res); H[n.id] = 'done';
      st(10, 'res.get(' + d + ').add(' + n.val + ') → ' + LL(res));
      st(11, 'dfs(node.left = ' + V(n.left) + ', ' + (d + 1) + ')');
      go(n.left, d + 1); cur = n; f.vars.res = 'ArrayList ' + LL(res);
      st(12, 'dfs(node.right = ' + V(n.right) + ', ' + (d + 1) + ')');
      go(n.right, d + 1); cur = n; f.vars.res = 'ArrayList ' + LL(res);
      cs.pop(); cur = prev;
    }
    go(R, 0);
    top.vars.res = 'ArrayList ' + LL(res);
    st(4, 'return res = ' + LL(res));
    add({ line: 4, note: 'Final: ' + LL(res), views: [tv('tree', R, H), { type: 'text', label: 'res', value: LL(res) }], vars: { res: LL(res) }, ret: LL(res) }, true);
    return steps;
  }
  VIZ.defs[102] = {
    title: 'Level Order Traversal (BFS)', label: 'BFS (queue)', ap: 1,
    inputs: [{ key: 'root', label: 'root (level order)', type: 'json', def: '[3,9,20,null,null,15,7]' }],
    run: lo102bfs,
    variants: [{ label: 'DFS (depth)', title: 'Level Order Traversal (DFS + depth)', ap: 0, run: lo102dfs }],
  };

  // ---------------- 199 Right Side View ----------------
  function rv199bfs({ root }) {
    const R = mk(root), { steps, add } = Rec(), H = {};
    let res = [], q = [], size = '-', i = '-', node = null;
    const st = (line, note, extra) => add(Object.assign({ line, note,
      views: [tv('tree', R, withCur(H, node), node ? [[node, 'node']] : []), { type: 'queue', label: 'Queue q', items: qItems(q) }, { type: 'array', label: 'res', vals: res.slice() }],
      vars: { res: 'ArrayList ' + L(res), q: 'LinkedList ' + L(qItems(q)), size: String(size), i: String(i), node: N(node) } }, extra || {}));
    st(2, 'res = new ArrayList<>()');
    if (!R) { st(3, 'root == null → return []', { ret: '[]' }); return steps; }
    st(3, 'root null nahi');
    st(4, 'q = new LinkedList<>()');
    q.push(R); H[R.id] = 'win';
    st(5, 'q.offer(root = ' + R.val + ')');
    while (q.length) {
      st(6, 'Naya level');
      size = q.length;
      st(7, 'size = ' + size);
      for (i = 0; i < size; i++) {
        st(8, 'i = ' + i + ' < ' + size);
        node = q.shift(); H[node.id] = 'done';
        st(9, 'node = q.poll() → ' + node.val);
        if (i === size - 1) { res.push(node.val); H[node.id] = 'found'; st(10, 'i == size − 1 → level ka LAST node = right se dikhta hai → res.add(' + node.val + ')'); }
        else st(10, 'i (' + i + ') ≠ size − 1 (' + (size - 1) + ') → ye node right view me chhup jaata hai');
        if (node.left) { q.push(node.left); H[node.left.id] = 'win'; }
        st(11, node.left ? 'left ' + node.left.val + ' → queue' : 'left null');
        if (node.right) { q.push(node.right); H[node.right.id] = 'win'; }
        st(12, node.right ? 'right ' + node.right.val + ' → queue' : 'right null');
      }
      node = null; i = '-';
    }
    st(15, 'return ' + L(res), { ret: '[' + res.join(',') + ']' });
    return steps;
  }
  function rv199dfs({ root }) {
    const R = mk(root), { steps, add } = Rec(), cs = Calls(), H = {};
    let res = [], cur = null;
    const st = (line, note) => add({ line, note, views: [tv('tree', R, withCur(H, cur), cur ? [[cur, 'node']] : []), { type: 'array', label: 'res', vals: res.slice() }], frames: cs.snap(line) });
    const top = cs.push('rightSideView', 'root=' + V(R), { root: N(R), res: 'ArrayList []' });
    st(2, 'res = new ArrayList<>()');
    st(3, 'dfs(root, 0, res) — right child PEHLE jayenge');
    function go(n, d) {
      const f = cs.push('dfs', 'node=' + V(n) + ', depth=' + d, { node: N(n), depth: String(d), res: 'ArrayList ' + L(res) });
      const prev = cur; cur = n;
      if (!n) { st(8, 'node == null → return'); cs.pop(); cur = prev; return; }
      if (!H[n.id]) H[n.id] = 'done';
      st(8, 'node = ' + n.val + ', depth = ' + d);
      if (d === res.length) { res.push(n.val); H[n.id] = 'found'; f.vars.res = 'ArrayList ' + L(res); st(9, 'depth ' + d + ' == res.size() → is depth pe pehla node (right-first) → res.add(' + n.val + ')'); }
      else st(9, 'depth ' + d + ' ka node pehle mil chuka (res.size() = ' + res.length + ') → skip');
      st(10, 'dfs(node.right = ' + V(n.right) + ', ' + (d + 1) + ') — right pehle');
      go(n.right, d + 1); cur = n; f.vars.res = 'ArrayList ' + L(res);
      st(11, 'dfs(node.left = ' + V(n.left) + ', ' + (d + 1) + ')');
      go(n.left, d + 1); cur = n; f.vars.res = 'ArrayList ' + L(res);
      cs.pop(); cur = prev;
    }
    go(R, 0);
    top.vars.res = 'ArrayList ' + L(res);
    st(4, 'return res = ' + L(res));
    add({ line: 4, note: 'Final: ' + L(res), views: [tv('tree', R, H), { type: 'array', label: 'res', vals: res.slice() }], vars: { res: L(res) }, ret: '[' + res.join(',') + ']' }, true);
    return steps;
  }
  VIZ.defs[199] = {
    title: 'Right Side View (BFS)', label: 'BFS (queue)', ap: 0,
    inputs: [{ key: 'root', label: 'root (level order)', type: 'json', def: '[1,2,3,null,5,null,4]' }],
    run: rv199bfs,
    variants: [{ label: 'DFS (right-first)', title: 'Right Side View (DFS right-first)', ap: 1, run: rv199dfs }],
  };

  // ---------------- 543 Diameter ----------------
  function dia543({ root }) {
    const R = mk(root), { steps, add } = Rec(), cs = Calls(), H = {}, P = new Map();
    let best = 0, cur = null, bestAt = null;
    const st = (line, note) => {
      cs.snap(line);
      add({ line, note, views: [tv('tree', R, Object.assign(withCur(H, cur), bestAt && bestAt !== cur ? { [bestAt.id]: 'found' } : {}), [...P.entries()].concat(cur ? [[cur, 'node']] : []))], frames: cs.snap(line).map(f => Object.assign(f, { vars: Object.assign({}, f.vars, { 'this.best': String(best) }) })) });
    };
    const top = cs.push('diameterOfBinaryTree', 'root=' + V(R), { root: N(R) });
    st(4, 'best = 0 (field reset — LeetCode same object reuse kar sakta hai)');
    st(5, 'height(root) call — ye height return karega aur raaste me best update');
    function go(n) {
      const f = cs.push('height', 'node=' + V(n), { node: N(n) });
      const prev = cur; cur = n;
      if (!n) { st(10, 'node == null → height 0'); cs.pop(); cur = prev; return 0; }
      H[n.id] = 'win';
      st(10, 'node = ' + n.val);
      st(11, 'left = height(' + V(n.left) + ')');
      const l = go(n.left); cur = n; f.vars.left = String(l);
      st(11, 'left = ' + l);
      st(12, 'right = height(' + V(n.right) + ')');
      const r = go(n.right); cur = n; f.vars.right = String(r);
      st(12, 'right = ' + r);
      const old = best;
      best = Math.max(best, l + r);
      if (best > old) bestAt = n;
      st(13, 'Node ' + n.val + ' se guzarne wala path = left + right = ' + l + ' + ' + r + ' = ' + (l + r) + ' edges → best = max(' + old + ', ' + (l + r) + ') = ' + best);
      const h = 1 + Math.max(l, r);
      H[n.id] = 'done'; P.set(n, 'h=' + h);
      st(14, 'return 1 + max(' + l + ', ' + r + ') = ' + h + ' (parent ko height)');
      cs.pop(); cur = prev; return h;
    }
    go(R);
    top.vars.root = N(R);
    st(6, 'return best = ' + best);
    add({ line: 6, note: 'Diameter = ' + best + ' edges' + (bestAt ? ' (sabse lamba path node ' + bestAt.val + ' se guzarta hai)' : ''), views: [tv('tree', R, Object.assign({}, H, bestAt ? { [bestAt.id]: 'found' } : {}), [...P.entries()])], vars: { best: String(best) }, ret: String(best) }, true);
    return steps;
  }
  VIZ.defs[543] = {
    title: 'Diameter of Binary Tree (height + global best)', label: 'Optimal', ap: 1,
    inputs: [{ key: 'root', label: 'root (level order)', type: 'json', def: '[1,2,3,4,5]' }],
    run: dia543,
  };

  // ---------------- 236 LCA ----------------
  const chk236 = ({ root, p, q }) => {
    const R = mk(root);
    if (!findVal(R, p) || !findVal(R, q)) return 'p aur q dono tree me hone chahiye.';
    if (p === q) return 'p aur q alag hone chahiye.';
    return '';
  };
  function lca236({ root, p, q }) {
    const R = mk(root), PN = findVal(R, p), QN = findVal(R, q), { steps, add } = Rec(), cs = Calls(), H = {}, RET = new Map();
    let cur = null;
    const ptrs = () => [[PN, 'p'], [QN, 'q']].concat([...RET.entries()]).concat(cur ? [[cur, 'root']] : []);
    const st = (line, note) => add({ line, note, views: [tv('tree', R, withCur(H, cur), ptrs())], frames: cs.snap(line) });
    function go(n) {
      const f = cs.push('lowestCommonAncestor', 'root=' + V(n), { root: N(n), p: N(PN), q: N(QN) });
      const prev = cur; cur = n;
      const back = r => { cs.pop(); cur = prev; return r; };
      if (!n) { st(2, 'root == null → return null (yahan kuch nahi mila)'); return back(null); }
      if (n === PN || n === QN) { H[n.id] = 'found'; RET.set(n, 'ret=' + n.val); st(2, 'root == ' + (n === PN ? 'p' : 'q') + ' (' + n.val + ') → yahin ruk jao, return root. Neeche dekhne ki zaroorat nahi'); return back(n); }
      H[n.id] = 'win';
      st(2, 'root = ' + n.val + ' — na null, na p, na q');
      st(3, 'left = lowestCommonAncestor(' + V(n.left) + ', p, q)');
      const l = go(n.left); cur = n; f.vars.left = N(l);
      st(3, 'left = ' + V(l));
      st(4, 'right = lowestCommonAncestor(' + V(n.right) + ', p, q)');
      const r = go(n.right); cur = n; f.vars.right = N(r);
      st(4, 'right = ' + V(r));
      if (l && r) { H[n.id] = 'found'; RET.set(n, 'LCA'); st(5, 'left aur right DONO non-null → p aur q alag sides me → node ' + n.val + ' hi LCA, return root'); return back(n); }
      st(5, 'Dono non-null nahi');
      const res = l || r;
      H[n.id] = 'done';
      if (res) RET.set(n, 'ret=' + res.val);
      st(6, res ? 'Sirf ek side se ' + res.val + ' mila → wahi upar bhejo' : 'Dono null → is subtree me p/q nahi → return null');
      return back(res);
    }
    const ans = go(R);
    add({ line: 6, note: 'LCA(' + p + ', ' + q + ') = ' + V(ans), views: [tv('tree', R, Object.assign({}, H, ans ? { [ans.id]: 'found' } : {}), [[PN, 'p'], [QN, 'q'], [ans, 'LCA']])], vars: { result: N(ans) }, ret: V(ans) }, true);
    return steps;
  }
  function lca236brute({ root, p, q }) {
    const R = mk(root), PN = findVal(R, p), QN = findVal(R, q), { steps, add } = Rec(), cs = Calls();
    let path = [], pathP = null, pathQ = null, cur = null, H = {};
    const pv = a => L(a.map(V));
    const st = (line, note, extra) => add(Object.assign({ line, note,
      views: [tv('tree', R, withCur(H, cur), [[PN, 'p'], [QN, 'q']].concat(cur ? [[cur, 'node']] : [])), { type: 'array', label: 'path (abhi ban raha)', vals: path.map(V) },
        { type: 'array', label: 'pathP', vals: (pathP || []).map(V) }, { type: 'array', label: 'pathQ', vals: (pathQ || []).map(V) }],
      frames: cs.snap(line) }, extra || {}));
    const top = cs.push('lowestCommonAncestor', 'root=' + V(R), { root: N(R), p: N(PN), q: N(QN) });
    st(2, 'pathP aur pathQ — root se p aur q tak ke raaste');
    function fp(n, t) {
      cs.push('findPath', 'node=' + V(n) + ', target=' + t.val, { node: N(n), target: N(t), path: 'ArrayList ' + pv(path) });
      const prev = cur; cur = n;
      const back = r => { cs.pop(); cur = prev; return r; };
      if (!n) { st(14, 'node null → yahan target nahi, return false'); return back(false); }
      path.push(n); H[n.id] = 'win';
      st(15, 'path.add(' + n.val + ') → ' + pv(path));
      if (n === t) { H[n.id] = 'found'; st(16, 'node == target (' + t.val + ') → mil gaya! return true'); return back(true); }
      st(16, n.val + ' target nahi → children me dhundo');
      st(17, 'findPath(left = ' + V(n.left) + ') || findPath(right = ' + V(n.right) + ')');
      if (fp(n.left, t) || fp(n.right, t)) { cur = n; st(17, 'Neeche target mila → true upar bhejo (path me ' + n.val + ' rehta hai)'); return back(true); }
      cur = n;
      path.pop(); H[n.id] = 'skip';
      st(18, 'Is node ke neeche target nahi → backtrack: path.remove(' + n.val + ') → ' + pv(path));
      st(19, 'return false');
      return back(false);
    }
    st(3, 'findPath(root, p = ' + p + ', pathP)');
    path = []; H = {}; fp(R, PN); pathP = path.slice(); top.vars.pathP = 'ArrayList ' + pv(pathP); path = [];
    cur = null; H = {};
    st(3, 'pathP = ' + pv(pathP));
    st(4, 'findPath(root, q = ' + q + ', pathQ)');
    fp(R, QN); pathQ = path.slice(); top.vars.pathQ = 'ArrayList ' + pv(pathQ); path = [];
    cur = null; H = {};
    st(4, 'pathQ = ' + pv(pathQ));
    let lca = null;
    top.vars.lca = 'null';
    st(5, 'lca = null');
    for (let i = 0; i < pathP.length && i < pathQ.length; i++) {
      top.vars.i = String(i);
      st(6, 'i = ' + i + ': pathP[i] = ' + pathP[i].val + ', pathQ[i] = ' + pathQ[i].val);
      if (pathP[i] !== pathQ[i]) { st(7, 'Alag node → raaste yahan se alag hue → break'); break; }
      st(7, 'Same node ✓');
      lca = pathP[i]; top.vars.lca = N(lca); H[lca.id] = 'found';
      st(8, 'lca = ' + lca.val + ' (abhi tak ka last common)');
    }
    delete top.vars.i;
    add({ line: 10, note: 'return lca = ' + V(lca), views: [tv('tree', R, lca ? { [lca.id]: 'found' } : {}, [[PN, 'p'], [QN, 'q'], [lca, 'LCA']]), { type: 'array', label: 'pathP', vals: pathP.map(V) }, { type: 'array', label: 'pathQ', vals: pathQ.map(V) }], frames: cs.snap(10), ret: V(lca) }, true);
    return steps;
  }
  VIZ.defs[236] = {
    title: 'Lowest Common Ancestor (Recursive)', label: 'Optimal', ap: 2,
    inputs: [{ key: 'root', label: 'root (level order, unique values)', type: 'json', def: '[3,5,1,6,2,0,8,null,null,7,4]' }, { key: 'p', label: 'p (value)', type: 'num', def: '5' }, { key: 'q', label: 'q (value)', type: 'num', def: '1' }],
    check: chk236,
    run: lca236,
    variants: [{ label: 'Brute (paths)', title: 'LCA (Root-to-node paths)', ap: 0, run: lca236brute }],
  };

  // ---------------- 230 Kth Smallest ----------------
  function ks230iter({ root, k }) {
    const R = mk(root), { steps, add } = Rec(), H = {};
    let stack = [], cur = R, kk = k, order = [];
    const st = (line, note, extra) => add(Object.assign({ line, note,
      views: [tv('tree', R, withCur(H, cur), cur ? [[cur, 'cur']] : []), { type: 'stack', label: 'Stack', items: qItems(stack) }, { type: 'array', label: 'pop order (sorted)', vals: order.slice() }],
      vars: { stack: 'ArrayDeque ' + L(qItems(stack).reverse()), cur: N(cur), k: String(kk) } }, extra || {}));
    st(2, 'stack = new ArrayDeque<>()');
    st(3, 'cur = root (' + V(R) + ')');
    while (cur || stack.length) {
      st(4, 'cur != null ya stack khaali nahi → loop');
      while (cur) {
        st(5, 'cur (' + cur.val + ') != null → aur left jao');
        stack.push(cur); H[cur.id] = 'win';
        st(6, 'stack.push(' + cur.val + ')');
        cur = cur.left;
        st(7, 'cur = cur.left = ' + V(cur));
      }
      cur = stack.pop(); H[cur.id] = 'done'; order.push(cur.val);
      st(9, 'cur = stack.pop() → ' + cur.val + ' (abhi tak ka agla sabse chhota)');
      kk--;
      st(10, 'k-- → ' + kk);
      if (kk === 0) { H[cur.id] = 'found'; st(11, 'k == 0 → ' + cur.val + ' hi k-th smallest! return', { ret: String(cur.val) }); return steps; }
      st(11, 'k = ' + kk + ' ≠ 0 → aage');
      cur = cur.right;
      st(12, 'cur = cur.right = ' + V(cur));
    }
    st(14, 'k > nodes → return -1', { ret: '-1' });
    return steps;
  }
  function ks230brute({ root, k }) {
    const R = mk(root), { steps, add } = Rec(), cs = Calls(), H = {};
    let vals = [], cur = null;
    const st = (line, note) => add({ line, note, views: [tv('tree', R, withCur(H, cur), cur ? [[cur, 'node']] : []), { type: 'array', label: 'vals (inorder)', vals: vals.slice() }], frames: cs.snap(line) });
    const top = cs.push('kthSmallest', 'root=' + V(R) + ', k=' + k, { root: N(R), k: String(k), vals: 'ArrayList []' });
    st(2, 'vals = new ArrayList<>()');
    st(3, 'inorder(root, vals) → BST ka inorder sorted deta hai');
    function go(n) {
      const f = cs.push('inorder', 'node=' + V(n), { node: N(n), vals: 'ArrayList ' + L(vals) });
      const prev = cur; cur = n;
      if (!n) { st(8, 'node null → return'); cs.pop(); cur = prev; return; }
      H[n.id] = 'win';
      st(8, 'node = ' + n.val + ' → pehle poora left');
      st(9, 'inorder(left = ' + V(n.left) + ')');
      go(n.left); cur = n;
      vals.push(n.val); f.vars.vals = 'ArrayList ' + L(vals); H[n.id] = 'done';
      st(10, 'Left khatam → vals.add(' + n.val + ') → ' + L(vals));
      st(11, 'inorder(right = ' + V(n.right) + ')');
      go(n.right); cur = n; f.vars.vals = 'ArrayList ' + L(vals);
      cs.pop(); cur = prev;
    }
    go(R);
    top.vars.vals = 'ArrayList ' + L(vals);
    const ans = vals[k - 1];
    const node = (function f(n) { return !n ? null : n.val === ans ? n : f(n.left) || f(n.right); })(R);
    if (node) H[node.id] = 'found';
    add({ line: 4, note: 'vals sorted = ' + L(vals) + ' → vals.get(' + (k - 1) + ') = ' + ans, views: [tv('tree', R, H, node ? [[node, 'k-th']] : []), { type: 'array', label: 'vals (inorder)', vals: vals.slice(), hl: { [k - 1]: 'found' }, ptr: [{ i: k - 1, label: 'k−1' }] }], frames: cs.snap(4), ret: String(ans) }, true);
    return steps;
  }
  VIZ.defs[230] = {
    title: 'Kth Smallest in BST (Iterative inorder)', label: 'Iterative (stack)', ap: 1,
    inputs: [{ key: 'root', label: 'root (BST, level order)', type: 'json', def: '[5,3,6,2,4,null,null,1]' }, { key: 'k', label: 'k', type: 'num', def: '3' }],
    run: ks230iter,
    variants: [{ label: 'Brute (inorder list)', title: 'Kth Smallest (Recursive inorder → list)', ap: 0, run: ks230brute }],
  };

  // ---------------- 98 Validate BST ----------------
  const B = x => (x === -Infinity ? 'Long.MIN_VALUE' : x === Infinity ? 'Long.MAX_VALUE' : String(x));
  const Bs = x => (x === -Infinity ? '−∞' : x === Infinity ? '+∞' : String(x));
  function vb98({ root }) {
    const R = mk(root), { steps, add } = Rec(), cs = Calls(), H = {}, P = new Map();
    let cur = null;
    const st = (line, note) => add({ line, note, views: [tv('tree', R, withCur(H, cur), [...P.entries()])], frames: cs.snap(line) });
    cs.push('isValidBST', 'root=' + V(R), { root: N(R) });
    st(2, 'valid(root, Long.MIN_VALUE, Long.MAX_VALUE) — root ke liye koi limit nahi');
    function go(n, lo, hi) {
      cs.push('valid', 'node=' + V(n) + ', low=' + Bs(lo) + ', high=' + Bs(hi), { node: N(n), low: B(lo), high: B(hi) });
      const prev = cur; cur = n;
      const back = r => { cs.pop(); cur = prev; return r; };
      if (!n) { st(6, 'node null → khaali subtree valid, return true'); return back(true); }
      P.set(n, '(' + Bs(lo) + ', ' + Bs(hi) + ')');
      st(6, 'node = ' + n.val + ', allowed range (' + Bs(lo) + ', ' + Bs(hi) + ')');
      if (n.val <= lo || n.val >= hi) { H[n.id] = 'skip'; st(7, n.val + ' range (' + Bs(lo) + ', ' + Bs(hi) + ') ke BAHAR → return false'); return back(false); }
      H[n.id] = 'win';
      st(7, Bs(lo) + ' < ' + n.val + ' < ' + Bs(hi) + ' ✓');
      st(8, 'Left: valid(' + V(n.left) + ', ' + Bs(lo) + ', ' + n.val + ') — left me sab ' + n.val + ' se chhote');
      const l = go(n.left, lo, n.val);
      if (!l) { st(8, 'Left false → short-circuit, return false'); return back(false); }
      st(8, 'Left ✓ → Right: valid(' + V(n.right) + ', ' + n.val + ', ' + Bs(hi) + ') — right me sab ' + n.val + ' se bade');
      const r = go(n.right, n.val, hi);
      if (r) H[n.id] = 'done';
      st(8, 'Right ' + r + ' → return ' + r);
      return back(r);
    }
    const ans = go(R, -Infinity, Infinity);
    st(2, 'return ' + ans);
    add({ line: 2, note: 'Final: ' + ans, views: [tv('tree', R, H, [...P.entries()])], vars: { result: String(ans) }, ret: String(ans) }, true);
    return steps;
  }
  function vb98iter({ root }) {
    const R = mk(root), { steps, add } = Rec(), H = {};
    let stack = [], cur = R, prev = null;
    const st = (line, note, extra) => add(Object.assign({ line, note,
      views: [tv('tree', R, withCur(H, cur), cur ? [[cur, 'cur']] : []), { type: 'stack', label: 'Stack', items: qItems(stack) }],
      vars: { stack: 'ArrayDeque ' + L(qItems(stack).reverse()), cur: N(cur), prev: prev === null ? 'null' : 'Integer ' + prev } }, extra || {}));
    st(2, 'stack = new ArrayDeque<>()');
    st(3, 'cur = root');
    st(4, 'prev = null (abhi tak koi value nahi dekhi)');
    while (cur || stack.length) {
      st(5, 'loop');
      while (cur) {
        st(6, 'cur (' + cur.val + ') != null → left jao');
        stack.push(cur); H[cur.id] = 'win';
        st(7, 'push(' + cur.val + ')');
        cur = cur.left;
        st(8, 'cur = cur.left = ' + V(cur));
      }
      cur = stack.pop();
      st(10, 'cur = pop() → ' + cur.val + ' (inorder me agla)');
      if (prev !== null && cur.val <= prev) { H[cur.id] = 'skip'; st(11, cur.val + ' ≤ prev (' + prev + ') → inorder sorted nahi → return false', { ret: 'false' }); return steps; }
      H[cur.id] = 'done';
      st(11, prev === null ? 'prev null → pehla element, theek' : cur.val + ' > prev (' + prev + ') ✓');
      prev = cur.val;
      st(12, 'prev = ' + prev);
      cur = cur.right;
      st(13, 'cur = cur.right = ' + V(cur));
    }
    st(15, 'Poora inorder strictly increasing → return true', { ret: 'true' });
    return steps;
  }
  VIZ.defs[98] = {
    title: 'Validate BST (Range bounds)', label: 'Optimal (range)', ap: 1,
    inputs: [{ key: 'root', label: 'root (level order)', type: 'json', def: '[5,4,6,null,null,3,7]' }],
    run: vb98,
    variants: [{ label: 'Iterative inorder', title: 'Validate BST (Iterative inorder + prev)', ap: 2, run: vb98iter }],
  };
})();
