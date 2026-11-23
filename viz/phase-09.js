// Phase 9 — Backtracking visualizers. Har recursion call = CALL STACK me ek frame (top upar).
// Line numbers code se marker text dhundh ke nikalte hain (liner) — code badle toh bhi sahi line.
(function () {
  const ID = 'backtracking';
  const LIMIT = 590;

  const codeOf = (n, ap) => window.PHASE_CONTENT[ID].questions[n].approaches[ap].code;
  function liner(n, ap) {
    const lines = codeOf(n, ap).split('\n');
    return (m, nth) => {
      let c = 0;
      for (let i = 0; i < lines.length; i++) {
        const hit = m instanceof RegExp ? m.test(lines[i]) : lines[i].includes(m);
        if (hit && ++c === (nth || 1)) return i + 1;
      }
      throw new Error('line marker nahi mila: ' + m);
    };
  }

  const fl = a => '[' + a.join(', ') + ']';
  const fll = res => '[' + res.map(fl).join(', ') + ']';
  const alist = a => `ArrayList size=${a.length} ${fl(a)}`;
  const rlist = res => `ArrayList size=${res.length} ${res.length > 8 ? fll(res.slice(0, 8)).slice(0, -1) + ', …]' : fll(res)}`;
  const iarr = a => `int[${a.length}] ${fl(a)}`;
  const cmp = (a, b) => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] !== b[i]) return typeof a[i] === 'number' ? a[i] - b[i] : (a[i] < b[i] ? -1 : 1);
    }
    return a.length - b.length;
  };
  // order-insensitive canonical answer (sorted) — example.ret isi format me
  const canon = res => '[' + res.map(r => r.slice()).sort(cmp).map(r => '[' + r.join(',') + ']').join(',') + ']';
  const hlRange = (a, b, cls, base) => { const o = Object.assign({}, base); for (let i = a; i <= b; i++) if (!o[i]) o[i] = cls; return o; };

  // Tracer: frames (bottom → top) + steps. viewsFn(v) har step ka Visual banata hai.
  function tracer(viewsFn, sharedFn) {
    const steps = [], st = [];
    const frames = () => st.slice().reverse().map(f => ({
      method: f.method, args: f.args, line: f.line,
      vars: typeof f.loc === 'function' ? f.loc() : Object.assign({}, f.loc, sharedFn ? sharedFn() : {}),
    }));
    const make = (line, note, v, ret) => {
      if (st.length) st[st.length - 1].line = line;
      const o = { line, note, views: viewsFn(v || {}), frames: frames() };
      if (ret !== undefined) o.ret = ret;
      return o;
    };
    return {
      steps,
      s(line, note, v) { if (steps.length < LIMIT) steps.push(make(line, note, v)); else if (st.length) st[st.length - 1].line = line; },
      finish(line, note, v, ret) {
        steps.push(make(line, (steps.length >= LIMIT ? '(lambe input pe beech ke steps chhode) ' : '') + note, v, ret));
        return steps;
      },
      push(method, args, loc, tag) { st.push({ method, args, loc, tag, line: 0 }); },
      pop() { st.pop(); },
      top() { return st[st.length - 1]; },
      depth() { return st.length; },
      chain() { return st.filter(f => f.tag !== undefined).map(f => f.tag).join('  →  ') || '—'; },
    };
  }

  const resView = (res, isNew, label) => ({ type: 'stack', label: `${label || 'res'} (${res.length} answers)`, items: res.map(fl), hl: isNew ? { [res.length - 1]: 'found' } : {} });
  const pathView = (path, isNew, label) => ({ type: 'array', label: label || 'path', vals: path.slice(), hl: isNew && path.length ? { [path.length - 1]: 'new' } : {} });
  const chainView = T => ({ type: 'text', label: 'recursion (call chain: har frame ka path)', value: T.chain() });

  // =====================================================================
  // LC 46 — Permutations
  // =====================================================================
  function perm46Used({ nums }) {
    const Ln = liner(46, 1), n = nums.length, used = Array(n).fill(false), path = [], res = [];
    const T = tracer(v => [
      { type: 'array', label: 'nums', vals: nums, hl: Object.assign(used.reduce((o, u, i) => { if (u) o[i] = 'done'; return o; }, {}), v.i !== undefined ? { [v.i]: v.icls || 'cur' } : {}), ptr: v.i !== undefined ? [{ i: v.i, label: 'i' }] : [] },
      { type: 'array', label: 'used[]', vals: used.map(u => (u ? 'T' : 'F')), hl: used.reduce((o, u, i) => { if (u) o[i] = 'win'; return o; }, {}) },
      pathView(path, v.pathNew),
      chainView(T),
      resView(res, v.resNew),
    ], () => ({ nums: iarr(nums), used: `boolean[${n}] ${fl(used)}`, path: alist(path), res: rlist(res) }));
    T.push('permute', `nums=${fl(nums)}`, () => ({ nums: iarr(nums), res: rlist(res) }));
    T.s(Ln('List<List<Integer>> res = new'), 'res = new ArrayList<>() — saare permutations yahan jayenge');
    T.s(Ln('backtrack(nums, new boolean'), `backtrack(nums, used = [${used.map(() => 'F').join(', ')}], path = [], res) → naya frame push`);
    const bt = () => {
      T.push('backtrack', `path=${fl(path)}`, {}, fl(path));
      const f = T.top();
      const leaf = path.length === n;
      T.s(Ln('if (path.size() == nums.length)'), `path.size() = ${path.length}${leaf ? ` == ${n} → LEAF, ek permutation ready` : ` < ${n} → abhi aur choose karna hai`}`);
      if (leaf) {
        res.push(path.slice());
        T.s(Ln('res.add(new ArrayList<>(path));'), `res.add(copy of ${fl(path)}) → answer #${res.length}`, { resNew: true });
        T.s(Ln('return;'), 'return → ye frame pop, parent ke loop pe wapas');
        T.pop();
        return;
      }
      for (let i = 0; i < n; i++) {
        f.loc.i = String(i);
        T.s(Ln('for (int i = 0;'), `i = ${i} → nums[${i}] = ${nums[i]}`, { i });
        if (used[i]) { T.s(Ln('if (used[i]) continue;'), `used[${i}] = true (${nums[i]} pehle se path me) → continue`, { i, icls: 'skip' }); continue; }
        used[i] = true;
        T.s(Ln('used[i] = true;'), `CHOOSE: used[${i}] = true`, { i });
        path.push(nums[i]);
        T.s(Ln('path.add(nums[i]);'), `path.add(${nums[i]}) → path = ${fl(path)}`, { i, pathNew: true });
        T.s(Ln('backtrack(nums, used, path, res);'), `EXPLORE: backtrack() call → depth ${T.depth()} (naya frame upar)`, { i });
        bt();
        const x = path.pop();
        T.s(Ln('path.remove(path.size() - 1);'), `child frame pop hua, wapas aaye. UNCHOOSE: ${x} hataya → path = ${fl(path)}`, { i });
        used[i] = false;
        T.s(Ln('used[i] = false;'), `used[${i}] = false — ${nums[i]} ab agli branches ke liye free`, { i });
      }
      T.pop();
    };
    bt();
    return T.finish(Ln('return res;'), `Saare frames khatam. return res — ${res.length} permutations (${n}! = ${res.length})`, {}, canon(res));
  }

  function perm46Swap({ nums }) {
    const Ln = liner(46, 2), a = nums.slice(), n = a.length, res = [];
    const T = tracer(v => [
      { type: 'array', label: 'nums (in-place)', vals: a.slice(), hl: Object.assign(hlRange(0, (v.start === undefined ? 0 : v.start) - 1, 'done'), v.start !== undefined && v.start < n ? { [v.start]: 'cur' } : {}, v.i !== undefined && v.i !== v.start ? { [v.i]: v.icls || 'win' } : {}), ptr: [].concat(v.start !== undefined && v.start < n ? [{ i: v.start, label: 'start' }] : [], v.i !== undefined ? [{ i: v.i, label: 'i' }] : []) },
      chainView(T),
      resView(res, v.resNew),
    ], () => ({ nums: iarr(a), res: rlist(res) }));
    T.push('permute', `nums=${fl(nums)}`, () => ({ nums: iarr(a), res: rlist(res) }));
    T.s(Ln('List<List<Integer>> res = new'), 'res = new ArrayList<>()');
    T.s(Ln('backtrack(nums, 0, res);'), 'backtrack(nums, start = 0, res) → frame push. Sawaal: position 0 pe kaun baithega?');
    const bt = start => {
      T.push('backtrack', `start=${start}`, { start: String(start) }, `start=${start} ${fl(a)}`);
      const f = T.top();
      T.s(Ln('if (start == nums.length)'), start === n ? `start = ${n} == n → saari positions fix → LEAF` : `start = ${start} < ${n} → position ${start} ke liye choices: index ${start}..${n - 1}`, { start });
      if (start === n) {
        T.s(Ln('List<Integer> perm = new'), 'perm = new ArrayList<>()', { start });
        res.push(a.slice());
        T.s(Ln('for (int x : nums) perm.add(x);'), `nums copy karo → perm = ${fl(a)}`, { start });
        T.s(Ln('res.add(perm);'), `res.add(${fl(a)}) → answer #${res.length}`, { start, resNew: true });
        T.s(Ln('return;'), 'return → frame pop', { start });
        T.pop();
        return;
      }
      for (let i = start; i < n; i++) {
        f.loc.i = String(i);
        T.s(Ln('for (int i = start;'), `i = ${i}: nums[${i}] = ${a[i]} ko position ${start} pe laana hai`, { start, i });
        [a[start], a[i]] = [a[i], a[start]];
        T.s(Ln('swap(nums, start, i);', 1), `CHOOSE: swap(${start}, ${i}) → ${fl(a)}${i === start ? ' (same index, kuch nahi badla)' : ''}`, { start, i, icls: 'new' });
        T.s(Ln('backtrack(nums, start + 1, res);'), `EXPLORE: backtrack(start = ${start + 1}) → depth ${T.depth()}`, { start, i });
        bt(start + 1);
        [a[start], a[i]] = [a[i], a[start]];
        T.s(Ln('swap(nums, start, i);', 2), `UNCHOOSE: swap(${start}, ${i}) wapas → ${fl(a)}`, { start, i });
      }
      T.pop();
    };
    bt(0);
    return T.finish(Ln('return res;'), `return res — ${res.length} permutations (order used[] wale se thoda alag, set same)`, {}, canon(res));
  }

  VIZ.defs[46] = {
    title: 'Permutations (Backtracking, used[])', label: 'used[] + path', ap: 1,
    inputs: [{ key: 'nums', label: 'nums (distinct, 1–4 rakho)', def: '1, 2, 3' }],
    check: ({ nums }) => (nums.length >= 1 && nums.length <= 5 && new Set(nums).size === nums.length ? '' : '1 se 5 distinct numbers daalo.'),
    run: perm46Used,
    variants: [{ label: 'Swap in-place', title: 'Permutations (Swap in-place)', ap: 2, run: perm46Swap }],
  };

  // =====================================================================
  // LC 78 — Subsets
  // =====================================================================
  function sub78Bt({ nums }) {
    const Ln = liner(78, 2), n = nums.length, path = [], res = [];
    const T = tracer(v => [
      { type: 'array', label: 'nums', vals: nums, hl: Object.assign(v.start !== undefined ? hlRange(v.start, n - 1, 'win') : {}, v.i !== undefined ? { [v.i]: 'cur' } : {}), ptr: [].concat(v.start !== undefined && v.start < n ? [{ i: v.start, label: 'start' }] : [], v.i !== undefined ? [{ i: v.i, label: 'i' }] : []) },
      pathView(path, v.pathNew),
      chainView(T),
      resView(res, v.resNew),
    ], () => ({ nums: iarr(nums), path: alist(path), res: rlist(res) }));
    T.push('subsets', `nums=${fl(nums)}`, () => ({ nums: iarr(nums), res: rlist(res) }));
    T.s(Ln('List<List<Integer>> res = new'), 'res = new ArrayList<>()');
    T.s(Ln('backtrack(nums, 0, new ArrayList'), 'backtrack(start = 0, path = []) → root frame push');
    const bt = start => {
      T.push('backtrack', `start=${start}, path=${fl(path)}`, { start: String(start) }, fl(path));
      const f = T.top();
      res.push(path.slice());
      T.s(Ln('res.add(new ArrayList<>(path));'), `Har node ek subset → res.add(${fl(path)}) (#${res.length})`, { start, resNew: true });
      for (let i = start; i < n; i++) {
        f.loc.i = String(i);
        T.s(Ln('for (int i = start;'), `i = ${i} (start = ${start}) → nums[${i}] = ${nums[i]}`, { start, i });
        path.push(nums[i]);
        T.s(Ln('path.add(nums[i]);'), `CHOOSE: path.add(${nums[i]}) → ${fl(path)}`, { start, i, pathNew: true });
        T.s(Ln('backtrack(nums, i + 1, path, res);'), `EXPLORE: backtrack(start = ${i + 1}) — peeche ke elements dobara nahi`, { start, i });
        bt(i + 1);
        const x = path.pop();
        T.s(Ln('path.remove(path.size() - 1);'), `wapas aaye. UNCHOOSE: ${x} hataya → ${fl(path)}`, { start, i });
      }
      delete f.loc.i;
      T.s(Ln('for (int i = start;'), start >= n ? `start = ${start} = n → loop chala hi nahi, frame khatam` : `loop khatam (i = ${n}) → frame pop`, { start });
      T.pop();
    };
    bt(0);
    return T.finish(Ln('return res;'), `return res — ${res.length} subsets (2^${n} = ${1 << n})`, {}, canon(res));
  }

  function sub78Iter({ nums }) {
    const Ln = liner(78, 0), res = [];
    let xi = -1;
    const T = tracer(v => [
      { type: 'array', label: 'nums', vals: nums, hl: xi >= 0 ? Object.assign(hlRange(0, xi - 1, 'done'), { [xi]: 'cur' }) : {}, ptr: xi >= 0 ? [{ i: xi, label: 'x' }] : [] },
      { type: 'stack', label: `res (${res.length} subsets)`, items: res.map(fl), hl: Object.assign(v.src !== undefined ? { [v.src]: 'cur' } : {}, v.isNew ? { [res.length - 1]: 'found' } : {}) },
    ]);
    T.push('subsets', `nums=${fl(nums)}`, () => Object.assign({ nums: iarr(nums), res: rlist(res) }, T.extra || {}));
    T.s(Ln('List<List<Integer>> res = new'), 'res = new ArrayList<>()');
    res.push([]);
    T.s(Ln('res.add(new ArrayList<>());'), 'res.add([]) — empty subset se shuru', { isNew: true });
    nums.forEach((x, k) => {
      xi = k;
      const size = res.length;
      T.extra = { x: String(x) };
      T.s(Ln('for (int x : nums)'), `x = ${x}: abhi tak ke har subset me ${x} jodke naya subset banega`);
      T.extra = { x: String(x), size: String(size) };
      T.s(Ln('int size = res.size();'), `size = ${size} → sirf purane ${size} subsets pe chalo (naye pe nahi)`);
      for (let i = 0; i < size; i++) {
        T.extra = { x: String(x), size: String(size), i: String(i) };
        const s = res[i].concat([x]);
        T.s(Ln('List<Integer> s = new ArrayList<>(res.get(i));'), `s = copy of res[${i}] = ${fl(res[i])}`, { src: i });
        res.push(s);
        T.extra.s = alist(s);
        T.s(Ln('res.add(s);'), `s.add(${x}) → ${fl(s)}, res.add → total ${res.length}`, { src: i, isNew: true });
      }
    });
    T.extra = {};
    return T.finish(Ln('return res;'), `return res — har element ne subsets double kiye: ${res.length}`, {}, canon(res));
  }

  function sub78Mask({ nums }) {
    const Ln = liner(78, 1), n = nums.length, res = [];
    let mask = -1, cur = [];
    const bits = () => nums.map((_, i) => (mask >= 0 && (mask >> i) & 1 ? 1 : 0));
    const T = tracer(v => [
      { type: 'array', label: `mask = ${mask < 0 ? '-' : mask} (bit i)`, vals: bits(), hl: Object.assign(bits().reduce((o, b, i) => { if (b) o[i] = 'win'; return o; }, {}), v.i !== undefined ? { [v.i]: 'cur' } : {}), ptr: v.i !== undefined ? [{ i: v.i, label: 'i' }] : [] },
      { type: 'array', label: 'nums', vals: nums, hl: bits().reduce((o, b, i) => { if (b && (v.i === undefined || i <= v.i)) o[i] = 'found'; return o; }, {}) },
      pathView(cur, v.sNew, 's'),
      resView(res, v.resNew),
    ]);
    const loc = {};
    T.push('subsets', `nums=${fl(nums)}`, () => Object.assign({ nums: iarr(nums), n: String(n), res: rlist(res) }, loc));
    T.s(Ln('int n = nums.length;'), `n = ${n} → 2^${n} = ${1 << n} masks`);
    T.s(Ln('List<List<Integer>> res = new'), 'res = new ArrayList<>()');
    for (mask = 0; mask < (1 << n); mask++) {
      cur = [];
      loc.mask = `${mask} (binary ${mask.toString(2).padStart(n, '0')})`; delete loc.i; loc.s = alist(cur);
      T.s(Ln('for (int mask = 0;'), `mask = ${mask} = ${mask.toString(2).padStart(n, '0')}₂ (right-most bit = index 0)`);
      for (let i = 0; i < n; i++) {
        loc.i = String(i);
        const on = (mask >> i) & 1;
        if (on) cur.push(nums[i]);
        loc.s = alist(cur);
        T.s(Ln('if ((mask & (1 << i)) != 0)'), on ? `bit ${i} = 1 → s.add(nums[${i}] = ${nums[i]}) → ${fl(cur)}` : `bit ${i} = 0 → nums[${i}] skip`, { i, sNew: !!on });
      }
      delete loc.i;
      res.push(cur.slice());
      T.s(Ln('res.add(s);'), `res.add(${fl(cur)}) → #${res.length}`, { resNew: true });
    }
    mask = (1 << n) - 1;
    return T.finish(Ln('return res;'), `return res — ${res.length} subsets`, {}, canon(res));
  }

  VIZ.defs[78] = {
    title: 'Subsets (Backtracking)', label: 'Backtracking', ap: 2,
    inputs: [{ key: 'nums', label: 'nums (unique, 1–4 rakho)', def: '1, 2, 3' }],
    check: ({ nums }) => (nums.length >= 1 && nums.length <= 6 && new Set(nums).size === nums.length ? '' : '1 se 6 unique numbers daalo.'),
    run: sub78Bt,
    variants: [
      { label: 'Iterative', title: 'Subsets (Iterative cascading)', ap: 0, run: sub78Iter },
      { label: 'Bitmask', title: 'Subsets (Bitmask)', ap: 1, run: sub78Mask },
    ],
  };

  // =====================================================================
  // LC 39 / LC 40 — Combination Sum (for-loop + break), Brute (pick / not-pick)
  // =====================================================================
  function comboLoop(lc, { candidates, target }) {
    const ap = 1, Ln = liner(lc, ap), c = candidates.slice().sort((x, y) => x - y), n = c.length, path = [], res = [];
    const reuse = lc === 39, meth = reuse ? 'combinationSum' : 'combinationSum2';
    const T = tracer(v => [
      { type: 'array', label: 'c (sorted candidates)', vals: c, hl: Object.assign(v.start !== undefined ? hlRange(v.start, n - 1, 'win') : {}, v.i !== undefined ? { [v.i]: v.icls || 'cur' } : {}, v.brk !== undefined ? hlRange(v.brk, n - 1, 'skip') : {}), ptr: [].concat(v.start !== undefined && v.start < n ? [{ i: v.start, label: 'start' }] : [], v.i !== undefined ? [{ i: v.i, label: 'i' }] : []) },
      pathView(path, v.pathNew),
      { type: 'text', label: 'remain = target − sum(path)', value: v.remain !== undefined ? `remain = ${v.remain}` : `target = ${target}` },
      chainView(T),
      resView(res, v.resNew),
    ], () => ({ c: iarr(c), path: alist(path), res: rlist(res) }));
    T.push(meth, `target=${target}`, () => ({ candidates: iarr(c), target: String(target), res: rlist(res) }));
    T.s(Ln('Arrays.sort(candidates);'), `sort → ${fl(c)} — break pruning${reuse ? '' : ' aur duplicate skip'} ke liye zaroori`);
    T.s(Ln('List<List<Integer>> res = new'), 'res = new ArrayList<>()');
    T.s(Ln('backtrack(candidates, 0, target'), `backtrack(start = 0, remain = ${target}) → root frame`);
    const bt = (start, remain) => {
      T.push('backtrack', `start=${start}, remain=${remain}`, { start: String(start), remain: String(remain) }, `${fl(path)} r=${remain}`);
      const f = T.top(), V = x => Object.assign({ start, remain }, x);
      T.s(Ln('if (remain == 0)'), remain === 0 ? 'remain == 0 → sum exactly target!' : `remain = ${remain} ≠ 0 → aage choose karo`, V());
      if (remain === 0) {
        res.push(path.slice());
        T.s(Ln('res.add(new ArrayList<>(path));'), `res.add(${fl(path)}) → answer #${res.length}`, V({ resNew: true }));
        T.s(Ln('return;'), 'return → frame pop', V());
        T.pop();
        return;
      }
      for (let i = start; i < n; i++) {
        f.loc.i = String(i);
        T.s(Ln('for (int i = start;'), `i = ${i} → c[${i}] = ${c[i]}`, V({ i }));
        if (!reuse && i > start && c[i] === c[i - 1]) {
          T.s(Ln('if (i > start && c[i] == c[i - 1]) continue;'), `i = ${i} > start = ${start} aur c[${i}] == c[${i - 1}] = ${c[i]} → SAME LEVEL duplicate → skip (warna same combination dobara)`, V({ i, icls: 'skip' }));
          continue;
        }
        if (c[i] > remain) {
          T.s(Ln('if (c[i] > remain) break;'), `${c[i]} > remain ${remain} → BREAK (sorted hai, aage sab ${c[i]} se bade) — prune`, V({ brk: i }));
          break;
        }
        path.push(c[i]);
        T.s(Ln('path.add(c[i]);'), `${c[i]} ≤ ${remain} ✓ CHOOSE: path = ${fl(path)}`, V({ i, pathNew: true }));
        const nxt = reuse ? i : i + 1;
        T.s(Ln(reuse ? 'backtrack(c, i, remain - c[i]' : 'backtrack(c, i + 1, remain - c[i]'), `EXPLORE: backtrack(start = ${nxt}, remain = ${remain - c[i]})${reuse ? ' — i hi pass kiya: same number dobara le sakte hain' : ' — i+1: har element ek baar'}`, V({ i }));
        bt(nxt, remain - c[i]);
        const x = path.pop();
        T.s(Ln('path.remove(path.size() - 1);'), `wapas aaye. UNCHOOSE: ${x} hataya → ${fl(path)}`, V({ i }));
      }
      T.pop();
    };
    bt(0, target);
    return T.finish(Ln('return res;'), `return res — ${res.length} combination(s): ${fll(res)}`, {}, canon(res));
  }

  function comboPick(lc, { candidates, target }) {
    const ap = 0, Ln = liner(lc, ap), reuse = lc === 39;
    const c = reuse ? candidates.slice() : candidates.slice().sort((x, y) => x - y), n = c.length, path = [], res = [], seen = new Set();
    const meth = reuse ? 'combinationSum' : 'combinationSum2', store = reuse ? 'res' : 'set';
    const T = tracer(v => [
      { type: 'array', label: reuse ? 'c (candidates)' : 'c (sorted)', vals: c, hl: v.i !== undefined && v.i < n ? { [v.i]: 'cur' } : {}, ptr: v.i !== undefined && v.i < n ? [{ i: v.i, label: 'i' }] : [] },
      pathView(path, v.pathNew),
      { type: 'text', label: 'remain', value: v.remain !== undefined ? `remain = ${v.remain}` : `target = ${target}` },
      chainView(T),
      resView(res, v.resNew, store),
    ], () => ({ c: iarr(c), path: alist(path), [store]: (reuse ? '' : 'HashSet ') + rlist(res).replace('ArrayList ', '') }));
    T.push(meth, `target=${target}`, () => ({ candidates: iarr(c), target: String(target), [store]: rlist(res) }));
    if (!reuse) T.s(Ln('Arrays.sort(candidates);'), `sort → ${fl(c)} (taaki duplicate combinations same List bane)`);
    T.s(Ln(reuse ? 'List<List<Integer>> res = new' : 'Set<List<Integer>> set = new'), reuse ? 'res = new ArrayList<>()' : 'set = new HashSet<>() — duplicates yahi hatayega');
    T.s(Ln(reuse ? 'dfs(candidates, 0, target' : 'dfs(candidates, 0, target'), `dfs(i = 0, remain = ${target}) → root frame`);
    const dfs = (i, remain) => {
      T.push('dfs', `i=${i}, remain=${remain}`, { i: String(i), remain: String(remain) }, `${fl(path)} i=${i}`);
      const V = x => Object.assign({ i, remain }, x);
      if (remain === 0) {
        const key = path.join(',');
        const dup = seen.has(key);
        if (!dup) { seen.add(key); res.push(path.slice()); }
        T.s(Ln(reuse ? 'res.add(new ArrayList<>(path));' : 'set.add(new ArrayList<>(path));'), `remain == 0 → ${store}.add(${fl(path)})${dup ? ' — set me pehle se hai, ignore (duplicate!)' : ` → #${res.length}`}`, V({ resNew: !dup }));
        T.pop();
        return;
      }
      if (i === n || remain < 0) {
        T.s(Ln('if (i == c.length || remain < 0) return;'), remain < 0 ? `remain = ${remain} < 0 → dead end, return` : `i = ${n} == c.length → candidates khatam, return`, V());
        T.pop();
        return;
      }
      path.push(c[i]);
      T.s(Ln('path.add(c[i]);'), `PICK c[${i}] = ${c[i]} → path = ${fl(path)}`, V({ pathNew: true }));
      T.s(Ln(reuse ? 'dfs(c, i, remain - c[i]' : 'dfs(c, i + 1, remain - c[i]'), `dfs(i = ${reuse ? i : i + 1}, remain = ${remain - c[i]})`, V());
      dfs(reuse ? i : i + 1, remain - c[i]);
      const x = path.pop();
      T.s(Ln('path.remove(path.size() - 1);'), `UNPICK ${x} → ${fl(path)}`, V());
      T.s(Ln(reuse ? 'dfs(c, i + 1, remain, path, res);' : 'dfs(c, i + 1, remain, path, set);'), `SKIP c[${i}] = ${c[i]} → dfs(i = ${i + 1}, remain = ${remain})`, V());
      dfs(i + 1, remain);
      T.pop();
    };
    dfs(0, target);
    return T.finish(Ln(reuse ? 'return res;' : 'return new ArrayList<>(set);'), `return — ${res.length} combination(s). (Brute me tree bada: pick/skip har index pe)`, {}, canon(res));
  }

  const comboInputs = def => [{ key: 'candidates', label: 'candidates', def }, { key: 'target', label: 'target', def: def === '2, 3, 6, 7' ? '7' : '8', type: 'num' }];
  const comboCheck = ({ candidates, target }) => (candidates.length >= 1 && candidates.length <= 10 && candidates.every(x => x >= 1) && target >= 1 && target <= 30 ? '' : 'candidates: 1–10 positive numbers, target 1–30.');

  VIZ.defs[39] = {
    title: 'Combination Sum (sort + for-loop + break)', label: 'For-loop + prune', ap: 1,
    inputs: comboInputs('2, 3, 6, 7'),
    check: comboCheck,
    run: inp => comboLoop(39, inp),
    variants: [{ label: 'Brute: pick / not-pick', title: 'Combination Sum (pick / not-pick)', ap: 0, run: inp => comboPick(39, inp) }],
  };

  VIZ.defs[40] = {
    title: 'Combination Sum II (sort + skip duplicates + break)', label: 'Skip duplicates', ap: 1,
    inputs: [{ key: 'candidates', label: 'candidates', def: '10, 1, 2, 7, 6, 1, 5' }, { key: 'target', label: 'target', def: '8', type: 'num' }],
    check: comboCheck,
    run: inp => comboLoop(40, inp),
    variants: [{ label: 'Brute: pick / skip + Set', title: 'Combination Sum II (pick / skip + HashSet)', ap: 0, run: inp => comboPick(40, inp) }],
  };

  // =====================================================================
  // LC 90 — Subsets II
  // =====================================================================
  function sub90Bt({ nums }) {
    const Ln = liner(90, 1), a = nums.slice().sort((x, y) => x - y), n = a.length, path = [], res = [];
    const T = tracer(v => [
      { type: 'array', label: 'nums (sorted)', vals: a, hl: Object.assign(v.start !== undefined ? hlRange(v.start, n - 1, 'win') : {}, v.i !== undefined ? { [v.i]: v.icls || 'cur' } : {}), ptr: [].concat(v.start !== undefined && v.start < n ? [{ i: v.start, label: 'start' }] : [], v.i !== undefined ? [{ i: v.i, label: 'i' }] : []) },
      pathView(path, v.pathNew),
      chainView(T),
      resView(res, v.resNew),
    ], () => ({ nums: iarr(a), path: alist(path), res: rlist(res) }));
    T.push('subsetsWithDup', `nums=${fl(nums)}`, () => ({ nums: iarr(a), res: rlist(res) }));
    T.s(Ln('Arrays.sort(nums);'), `sort → ${fl(a)} — same values paas-paas, tabhi skip check kaam karega`);
    T.s(Ln('List<List<Integer>> res = new'), 'res = new ArrayList<>()');
    T.s(Ln('backtrack(nums, 0, new ArrayList'), 'backtrack(start = 0, path = []) → root frame');
    const bt = start => {
      T.push('backtrack', `start=${start}, path=${fl(path)}`, { start: String(start) }, fl(path));
      const f = T.top();
      res.push(path.slice());
      T.s(Ln('res.add(new ArrayList<>(path));'), `Har node ek subset → res.add(${fl(path)}) (#${res.length})`, { start, resNew: true });
      for (let i = start; i < n; i++) {
        f.loc.i = String(i);
        T.s(Ln('for (int i = start;'), `i = ${i} (start = ${start}) → nums[${i}] = ${a[i]}`, { start, i });
        if (i > start && a[i] === a[i - 1]) {
          T.s(Ln('if (i > start && nums[i] == nums[i - 1]) continue;'), `i = ${i} > start = ${start} aur nums[${i}] == nums[${i - 1}] = ${a[i]} → same level pe same value → SKIP (ye subtree pehle ban chuka)`, { start, i, icls: 'skip' });
          continue;
        }
        path.push(a[i]);
        T.s(Ln('path.add(nums[i]);'), `CHOOSE: path.add(${a[i]}) → ${fl(path)}${i > start ? '' : i > 0 && a[i] === a[i - 1] ? ' (i == start: level ka pehla choice, duplicate value bhi allowed)' : ''}`, { start, i, pathNew: true });
        T.s(Ln('backtrack(nums, i + 1, path, res);'), `EXPLORE: backtrack(start = ${i + 1})`, { start, i });
        bt(i + 1);
        const x = path.pop();
        T.s(Ln('path.remove(path.size() - 1);'), `wapas aaye. UNCHOOSE: ${x} hataya → ${fl(path)}`, { start, i });
      }
      T.pop();
    };
    bt(0);
    return T.finish(Ln('return res;'), `return res — ${res.length} unique subsets`, {}, canon(res));
  }

  function sub90Brute({ nums }) {
    const Ln = liner(90, 0), a = nums.slice().sort((x, y) => x - y), n = a.length, res = [], seen = new Set();
    let mask = -1, cur = [];
    const bits = () => a.map((_, i) => (mask >= 0 && (mask >> i) & 1 ? 1 : 0));
    const loc = {};
    const T = tracer(v => [
      { type: 'array', label: `nums (sorted) · mask = ${mask < 0 ? '-' : mask.toString(2).padStart(n, '0')}`, vals: a, hl: bits().reduce((o, b, i) => { if (b) o[i] = 'found'; return o; }, {}) },
      pathView(cur, false, 's'),
      { type: 'stack', label: `set (${res.length} unique)`, items: res.map(fl), hl: v.resNew ? { [res.length - 1]: 'found' } : v.dupAt !== undefined ? { [v.dupAt]: 'skip' } : {} },
    ]);
    T.push('subsetsWithDup', `nums=${fl(nums)}`, () => Object.assign({ nums: iarr(a), n: String(n), set: `HashSet size=${res.length}` }, loc));
    T.s(Ln('Arrays.sort(nums);'), `sort → ${fl(a)} — taaki [2,1] aur [1,2] jaise same subset same List bane`);
    T.s(Ln('Set<List<Integer>> set = new'), 'set = new HashSet<>()');
    for (mask = 0; mask < (1 << n); mask++) {
      cur = a.filter((_, i) => (mask >> i) & 1);
      loc.mask = String(mask); loc.s = alist(cur);
      T.s(Ln('for (int mask = 0;'), `mask = ${mask.toString(2).padStart(n, '0')}₂ → s = ${fl(cur)}`);
      const key = cur.join(','), dup = seen.has(key);
      if (!dup) { seen.add(key); res.push(cur.slice()); }
      T.s(Ln('set.add(s);'), dup ? `set.add(${fl(cur)}) → false, pehle se hai (duplicate ignore)` : `set.add(${fl(cur)}) → naya (#${res.length})`, dup ? { dupAt: res.findIndex(r => r.join(',') === key) } : { resNew: true });
    }
    return T.finish(Ln('return new ArrayList<>(set);'), `return — ${res.length} unique (${1 << n} me se)`, {}, canon(res));
  }

  VIZ.defs[90] = {
    title: 'Subsets II (sort + skip duplicates)', label: 'Sort + skip', ap: 1,
    inputs: [{ key: 'nums', label: 'nums (duplicates allowed, 1–5)', def: '1, 2, 2' }],
    check: ({ nums }) => (nums.length >= 1 && nums.length <= 6 ? '' : '1 se 6 numbers daalo.'),
    run: sub90Bt,
    variants: [{ label: 'Brute: bitmask + Set', title: 'Subsets II (bitmask + HashSet)', ap: 0, run: sub90Brute }],
  };

  // =====================================================================
  // LC 131 — Palindrome Partitioning
  // =====================================================================
  function part131(useDp, { s }) {
    const ap = useDp ? 1 : 0, Ln = liner(131, ap), n = s.length, path = [], res = [], ch = s.split('');
    const isPal = (l, r) => { while (l < r) { if (s[l++] !== s[r--]) return false; } return true; };
    const pal = ch.map(() => ch.map(() => ''));
    const T = tracer(v => {
      const out = [
        { type: 'array', label: 's', vals: ch, hl: Object.assign(v.start !== undefined ? hlRange(0, v.start - 1, 'done') : {}, v.end !== undefined ? hlRange(v.start, v.end, v.bad ? 'skip' : 'cur') : {}), ptr: [].concat(v.start !== undefined && v.start < n ? [{ i: v.start, label: 'start' }] : [], v.end !== undefined ? [{ i: v.end, label: 'end' }] : []) },
      ];
      if (useDp) out.push({ type: 'table', label: 'pal[i][j] (s[i..j] palindrome?)', rows: pal, rowLabels: ch.map((_, i) => 'i=' + i), colLabels: ch.map((x, j) => `j=${j} ${x}`), hl: v.cell ? { [v.cell]: v.cellCls || 'cur' } : {} });
      out.push(pathView(path, v.pathNew), chainView(T), { type: 'stack', label: `res (${res.length} partitions)`, items: res.map(r => fl(r.map(x => '"' + x + '"'))), hl: v.resNew ? { [res.length - 1]: 'found' } : {} });
      return out;
    }, () => ({ s: `"${s}"`, path: alist(path.map(x => '"' + x + '"')), res: rlist(res.map(r => r.map(x => '"' + x + '"'))) }));
    const mainLoc = {};
    T.push('partition', `s="${s}"`, () => Object.assign({ s: `"${s}"` }, mainLoc, { res: rlist(res) }));
    if (useDp) {
      mainLoc.n = String(n);
      T.s(Ln('boolean[][] pal = new'), `pal = new boolean[${n}][${n}] — pehle saare palindromes table me`);
      for (let i = n - 1; i >= 0; i--) {
        for (let j = i; j < n; j++) {
          const val = s[i] === s[j] && (j - i < 2 || pal[i + 1][j - 1] === 'T');
          pal[i][j] = val ? 'T' : 'F';
          mainLoc.i = String(i); mainLoc.j = String(j);
          T.s(Ln('pal[i][j] = s.charAt(i)'), `pal[${i}][${j}]: s[${i}]='${s[i]}' ${s[i] === s[j] ? '==' : '≠'} s[${j}]='${s[j]}'${s[i] === s[j] ? (j - i < 2 ? ', length ≤ 2' : `, andar pal[${i + 1}][${j - 1}] = ${pal[i + 1][j - 1]}`) : ''} → ${val ? 'true' : 'false'}`, { cell: `${i},${j}`, cellCls: val ? 'found' : 'skip' });
        }
      }
      delete mainLoc.i; delete mainLoc.j;
    }
    T.s(Ln('List<List<String>> res = new'), 'res = new ArrayList<>()');
    T.s(Ln(useDp ? 'backtrack(s, 0, pal, new' : 'backtrack(s, 0, new'), 'backtrack(start = 0, path = []) → root frame');
    const bt = start => {
      T.push('backtrack', `start=${start}`, { start: String(start) }, fl(path.map(x => '"' + x + '"')));
      const f = T.top();
      T.s(Ln('if (start == s.length())'), start === n ? `start = ${n} == length → poori string cut ho gayi` : `start = ${start} < ${n} → yahan se piece choose karo`, { start });
      if (start === n) {
        res.push(path.slice());
        T.s(Ln('res.add(new ArrayList<>(path));'), `res.add(${fl(path.map(x => '"' + x + '"'))}) → partition #${res.length}`, { start, resNew: true });
        T.s(Ln('return;'), 'return → frame pop', { start });
        T.pop();
        return;
      }
      for (let end = start; end < n; end++) {
        f.loc.end = String(end);
        const piece = s.slice(start, end + 1);
        T.s(Ln('for (int end = start;'), `end = ${end} → piece s[${start}..${end}] = "${piece}"`, { start, end });
        const ok = isPal(start, end);
        if (useDp) {
          T.s(Ln('if (!pal[start][end]) continue;'), ok ? `pal[${start}][${end}] = true → "${piece}" palindrome ✓ (O(1) lookup)` : `pal[${start}][${end}] = false → "${piece}" palindrome nahi → continue`, { start, end, bad: !ok, cell: `${start},${end}`, cellCls: ok ? 'found' : 'skip' });
          if (!ok) continue;
        } else {
          T.s(Ln('if (!isPal(s, start, end)) continue;'), `isPal(s, ${start}, ${end}) call → naya frame`, { start, end });
          T.push('isPal', `l=${start}, r=${end}`, { l: String(start), r: String(end) });
          if (ok) T.s(Ln(/^\s*return true;/), `"${piece}" ulta bhi "${piece.split('').reverse().join('')}" → return true`, { start, end });
          else {
            let l = start, r = end; while (s[l] === s[r]) { l++; r--; }
            T.top().loc = { l: String(l), r: String(r) };
            T.s(Ln('if (s.charAt(l++) != s.charAt(r--)) return false;'), `s[${l}]='${s[l]}' ≠ s[${r}]='${s[r]}' → return false`, { start, end, bad: true });
          }
          T.pop();
          if (!ok) { T.s(Ln('if (!isPal(s, start, end)) continue;'), `"${piece}" palindrome nahi → continue (yahan cut nahi — prune)`, { start, end, bad: true }); continue; }
        }
        path.push(piece);
        T.s(Ln('path.add(s.substring(start, end + 1));'), `CHOOSE: path.add("${piece}") → ${fl(path.map(x => '"' + x + '"'))}`, { start, end, pathNew: true });
        T.s(Ln(useDp ? 'backtrack(s, end + 1, pal, path, res);' : 'backtrack(s, end + 1, path, res);'), `EXPLORE: backtrack(start = ${end + 1}) — baaki string "${s.slice(end + 1)}"`, { start, end });
        bt(end + 1);
        const x = path.pop();
        T.s(Ln('path.remove(path.size() - 1);'), `wapas aaye. UNCHOOSE: "${x}" hataya`, { start, end });
      }
      T.pop();
    };
    bt(0);
    return T.finish(Ln('return res;'), `return res — ${res.length} partition(s)`, {}, canon(res));
  }

  VIZ.defs[131] = {
    title: 'Palindrome Partitioning (Backtracking)', label: 'isPal har baar', ap: 0,
    inputs: [{ key: 's', label: 's (lowercase, max 6 rakho)', def: 'aab', type: 'str' }],
    check: ({ s }) => (/^[a-z]{1,7}$/.test(s) ? '' : '1–7 lowercase letters daalo.'),
    run: inp => part131(false, inp),
    variants: [{ label: 'DP table', title: 'Palindrome Partitioning (DP table + Backtracking)', ap: 1, run: inp => part131(true, inp) }],
  };

  // =====================================================================
  // LC 79 — Word Search (grid DFS backtracking)
  // =====================================================================
  function word79(inPlace, { board, word }) {
    const ap = inPlace ? 1 : 0, Ln = liner(79, ap);
    const g = board.map(r => r.map(String)), m = g.length, n = g[0].length, L = word.length;
    const vis = g.map(r => r.map(() => false)), trail = [];
    let foundTrail = null, R = -1, C = -1;
    const dirName = ['neeche (r+1)', 'upar (r−1)', 'right (c+1)', 'left (c−1)'];
    const T = tracer(v => {
      const hl = {};
      trail.forEach(([r, c]) => { hl[r + ',' + c] = 'win'; });
      if (v.cur) hl[v.cur.join(',')] = v.cls || 'cur';
      if (v.final && foundTrail) foundTrail.forEach(([r, c]) => { hl[r + ',' + c] = 'found'; });
      const out = [
        { type: 'grid', label: inPlace ? "board (# = abhi path me)" : 'board (neela = visited / path)', cells: g.map(r => r.slice()), hl },
        { type: 'array', label: 'word', vals: word.split(''), hl: v.k !== undefined ? hlRange(0, v.k - 1, 'done', v.k < L ? { [v.k]: 'cur' } : {}) : {}, ptr: v.k !== undefined && v.k < L ? [{ i: v.k, label: 'k' }] : [] },
        { type: 'text', label: 'current path (cells)', value: (v.final && foundTrail ? foundTrail : trail).map(([r, c]) => `(${r},${c}) ${board[r][c]}`).join(' → ') || '—' },
      ];
      if (v.freq) out.push({ type: 'map', label: 'freq (board − word letters)', entries: v.freq, hl: v.fhl });
      return out;
    }, () => (inPlace ? { word: `"${word}"` } : { word: `"${word}"`, visited: `boolean[${m}][${n}] (${trail.length} true)` }));
    const mainLoc = () => Object.assign({ word: `"${word}"`, m: String(m), n: String(n) }, R >= 0 ? { r: String(R), c: String(C) } : {});
    T.push('exist', `word="${word}"`, mainLoc);
    T.s(Ln('int m = board.length'), `m = ${m}, n = ${n}`);
    if (inPlace) {
      const freq = {};
      g.forEach(row => row.forEach(x => { freq[x] = (freq[x] || 0) + 1; }));
      const show = () => { const o = {}; [...new Set(word.split(''))].forEach(x => { o[x] = freq[x] || 0; }); return o; };
      T.s(Ln('for (char[] row : board)'), 'Board ke har letter ka count → freq[]', { freq: show() });
      for (const x of word) {
        freq[x] = (freq[x] || 0) - 1;
        if (freq[x] < 0) {
          return T.finish(Ln('if (--freq[ch] < 0) return false;'), `'${x}' word me board se zyada baar chahiye → DFS ke bina hi return false (prune!)`, { freq: show(), fhl: x }, 'false');
        }
        T.s(Ln('if (--freq[ch] < 0) return false;'), `'${x}': freq → ${freq[x]} (≥ 0, theek)`, { freq: show(), fhl: x });
      }
    } else {
      T.s(Ln('boolean[][] visited = new'), `visited = new boolean[${m}][${n}] — sab false`);
    }
    const dfs = (k, r, c) => {
      T.push('dfs', `k=${k}, r=${r}, c=${c}`, { k: String(k), r: String(r), c: String(c) });
      const inb = r >= 0 && c >= 0 && r < m && c < n;
      if (k === L) {
        foundTrail = trail.slice();
        T.s(Ln('if (k == word.length()) return true;'), `k = ${k} == word.length() → saare letters mil gaye → return true`, { k });
        T.pop(); return true;
      }
      if (!inb) {
        T.s(Ln('if (r < 0 || c < 0'), `(${r}, ${c}) grid ke bahar → return false`, { k });
        T.pop(); return false;
      }
      if (inPlace) {
        if (g[r][c] !== word[k]) {
          T.s(Ln('if (board[r][c] != word.charAt(k)) return false;'), g[r][c] === '#' ? `(${r},${c}) = '#' → is path me already use ho chuka → false` : `board[${r}][${c}] = '${g[r][c]}' ≠ word[${k}] = '${word[k]}' → false`, { k, cur: [r, c], cls: 'skip' });
          T.pop(); return false;
        }
        T.top().loc.saved = `'${g[r][c]}'`;
        T.s(Ln('char saved = board[r][c];'), `'${g[r][c]}' == word[${k}] ✓ → saved = '${g[r][c]}'`, { k, cur: [r, c] });
        g[r][c] = '#'; trail.push([r, c]);
        T.s(Ln("board[r][c] = '#';"), `CHOOSE: board[${r}][${c}] = '#' (visited mark, extra matrix nahi)`, { k: k + 1, cur: [r, c] });
        const ds = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (let d = 0; d < 4; d++) {
          T.top().loc.d = `{${ds[d][0]}, ${ds[d][1]}}`;
          T.s(Ln('if (dfs(board, word, k + 1, r + d[0]'), `${dirName[d]}: dfs(k = ${k + 1}, ${r + ds[d][0]}, ${c + ds[d][1]})`, { k: k + 1, cur: [r, c] });
          if (dfs(k + 1, r + ds[d][0], c + ds[d][1])) {
            g[r][c] = T.top().loc.saved.replace(/'/g, ''); trail.pop();
            T.s(Ln('board[r][c] = saved;', 1), `true mila! return se pehle restore: board[${r}][${c}] = '${g[r][c]}'`, { k: k + 1, cur: [r, c], cls: 'found' });
            T.s(Ln(/^\s*return true;/), 'return true → upar tak true jaayega', { k: k + 1 });
            T.pop(); return true;
          }
        }
        g[r][c] = T.top().loc.saved.replace(/'/g, ''); trail.pop();
        T.s(Ln('board[r][c] = saved;', 2), `4 directions fail. UNCHOOSE: board[${r}][${c}] = '${g[r][c]}' wapas`, { k, cur: [r, c], cls: 'skip' });
        T.s(Ln(/^\s*return false;/, 2), 'return false → parent agli direction try karega', { k });
        T.pop(); return false;
      }
      if (vis[r][c] || g[r][c] !== word[k]) {
        T.s(Ln('if (visited[r][c] ||'), vis[r][c] ? `(${r},${c}) already visited (is path me) → false` : `board[${r}][${c}] = '${g[r][c]}' ≠ word[${k}] = '${word[k]}' → false`, { k, cur: [r, c], cls: 'skip' });
        T.pop(); return false;
      }
      vis[r][c] = true; trail.push([r, c]);
      T.s(Ln('visited[r][c] = true;'), `'${g[r][c]}' == word[${k}] ✓ → CHOOSE: visited[${r}][${c}] = true`, { k: k + 1, cur: [r, c] });
      const ds = [[1, 0, 'boolean found = dfs('], [-1, 0, '|| dfs(board, word, k + 1, r - 1'], [0, 1, '|| dfs(board, word, k + 1, r, c + 1'], [0, -1, '|| dfs(board, word, k + 1, r, c - 1']];
      let found = false;
      for (let d = 0; d < 4; d++) {
        T.s(Ln(ds[d][2]), `${dirName[d]}: dfs(k = ${k + 1}, ${r + ds[d][0]}, ${c + ds[d][1]})`, { k: k + 1, cur: [r, c] });
        if (dfs(k + 1, r + ds[d][0], c + ds[d][1])) { found = true; break; }
      }
      T.top().loc.found = String(found);
      vis[r][c] = false; trail.pop();
      T.s(Ln('visited[r][c] = false;'), `${found ? 'found = true (|| ne baaki directions skip ki). ' : '4 directions fail. '}UNCHOOSE: visited[${r}][${c}] = false`, { k, cur: [r, c], cls: found ? 'found' : 'skip' });
      T.s(Ln('return found;'), `return ${found}`, { k });
      T.pop(); return found;
    };
    for (R = 0; R < m; R++) {
      for (C = 0; C < n; C++) {
        T.s(Ln(inPlace ? 'if (dfs(board, word, 0, r, c)) return true;' : 'if (dfs(board, word, 0, r, c, visited)) return true;'), `Start cell (${R},${C}) = '${g[R][C]}' → dfs(k = 0)`, { k: 0, cur: [R, C] });
        if (dfs(0, R, C)) {
          return T.finish(Ln(inPlace ? 'if (dfs(board, word, 0, r, c)) return true;' : 'if (dfs(board, word, 0, r, c, visited)) return true;'), `"${word}" mil gaya → return true`, { k: L, final: true }, 'true');
        }
      }
    }
    R = -1;
    return T.finish(Ln(/^\s*return false;/, 1), `Kisi bhi start cell se "${word}" nahi bana → return false`, { k: 0 }, 'false');
  }

  const wordCheck = ({ board, word }) => (Array.isArray(board) && board.length && board.length <= 6 && board.every(r => Array.isArray(r) && r.length === board[0].length && r.length <= 6) && word.length >= 1 && word.length <= 15 ? '' : 'board: 1–6 rows, har row same length (max 6); word 1–15 letters.');

  VIZ.defs[79] = {
    title: 'Word Search (DFS + visited[][])', label: 'visited[][]', ap: 0,
    inputs: [
      { key: 'board', label: 'board (JSON 2D chars)', def: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]', type: 'json' },
      { key: 'word', label: 'word', def: 'ABCCED', type: 'str' },
    ],
    check: wordCheck,
    run: inp => word79(false, inp),
    variants: [{ label: "In-place '#' + freq prune", title: "Word Search (in-place '#' + frequency prune)", ap: 1, run: inp => word79(true, inp) }],
  };
})();
