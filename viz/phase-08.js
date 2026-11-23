// Phase 8 (Heap) visualizers. Heap ko java.util.PriorityQueue jaisa hi simulate karte hain
// (siftUp: parent se strictly better ho tabhi swap; siftDown: right child tabhi jab strictly better) —
// isliye andar ka array order Java ke pq.toString() jaisa hi rehta hai. Har step pe heap 2 roop me: tree + array.
(function () {
  const { esc } = VIZ.util;
  const MAX = VIZ.util.MAX_STEPS || 600;
  void esc;

  // ---- code line lookup (markers) — code badle toh bhi line sahi rahe ----
  const codeOf = (n, ap) => window.PHASE_CONTENT.heap.questions[n].approaches[ap].code;
  function liner(n, ap) {
    let lines = null;
    return (marker, nth) => {
      if (!lines) lines = codeOf(n, ap).split('\n');
      let seen = 0;
      for (let i = 0; i < lines.length; i++) if (lines[i].includes(marker) && seen++ === (nth || 0)) return i + 1;
      throw new Error(`LC ${n} code me "${marker}" nahi mila`);
    };
  }

  // ---- java.util.PriorityQueue jaisa binary heap ----
  class JHeap {
    constructor(cmp) { this.a = []; this.cmp = cmp; }
    get size() { return this.a.length; }
    peek() { return this.a[0]; }
    // cb(type, i, j): 'put' k | 'up' p k (swap ke baad, element ab p pe) | 'stay' k p
    offer(x, cb) {
      const a = this.a;
      let k = a.length;
      a.push(x);
      if (cb) cb('put', k);
      while (k > 0) {
        const p = (k - 1) >>> 1;
        if (this.cmp(a[k], a[p]) >= 0) { if (cb) cb('stay', k, p); return; }
        const t = a[k]; a[k] = a[p]; a[p] = t;
        if (cb) cb('up', p, k);
        k = p;
      }
      if (cb) cb('top', 0);
    }
    // cb: 'root' 0 | 'down' k c (swap ke baad, element ab c pe) | 'stayd' k c | 'leaf' k | 'empty'
    poll(cb) {
      const a = this.a, top = a[0], last = a.pop();
      if (!a.length) { if (cb) cb('empty'); return top; }
      a[0] = last;
      if (cb) cb('root', 0);
      let k = 0;
      const n = a.length, half = n >>> 1;
      while (k < half) {
        let c = 2 * k + 1;
        const r = c + 1;
        if (r < n && this.cmp(a[c], a[r]) > 0) c = r;
        if (this.cmp(a[k], a[c]) <= 0) { if (cb) cb('stayd', k, c); return top; }
        const t = a[k]; a[k] = a[c]; a[c] = t;
        if (cb) cb('down', k, c);
        k = c;
      }
      if (cb) cb('leaf', k);
      return top;
    }
  }

  // sift ke har chhote kadam ka note + highlight. word = "better" ka matlab (chhota / bada / kam count / door)
  function siftNote(type, i, j, a, f, word) {
    switch (type) {
      case 'put': return [`${f(a[i])} ko index ${i} pe rakha (array ka end = tree ka next khaali slot). Ab sift up.`, { [i]: 'new' }];
      case 'up': return [`${f(a[i])} apne parent se ${word} tha → swap (index ${j} → ${i}). Sift up jaari.`, { [i]: 'new', [j]: 'cur', ['e' + j]: 'cur' }];
      case 'stay': return [`Parent ${f(a[j])} (index ${j}) se ${f(a[i])} ${word} nahi → sift up ruk gaya.`, { [i]: 'done', [j]: 'win' }];
      case 'top': return [`${f(a[0])} root (index 0) tak pahunch gaya → naya top.`, { 0: 'new' }];
      case 'root': return [`Last element ${f(a[0])} ko root (index 0) pe rakha. Ab sift down.`, { 0: 'new' }];
      case 'down': return [`Child ${f(a[i])} zyada ${word} tha → swap (index ${i} ↔ ${j}). Sift down jaari.`, { [j]: 'new', [i]: 'cur', ['e' + j]: 'cur' }];
      case 'stayd': return [`${word} child ${f(a[j])} (index ${j}) bhi ${f(a[i])} se zyada ${word} nahi → sift down ruk gaya.`, { [i]: 'done', [j]: 'win' }];
      case 'leaf': return [`${f(a[i])} leaf (index ${i}) pe pahunch gaya → sift down khatam.`, { [i]: 'done' }];
      case 'empty': return ['Heap ab khaali.', {}];
      default: return ['', {}];
    }
  }

  const pqStr = (h, f) => `PriorityQueue size=${h.size} [${h.a.map(f).join(', ')}]`;
  const arrStr = a => `int[${a.length}] [${a.join(', ')}]`;
  const jd = x => (Number.isInteger(x) ? x.toFixed(1) : String(x));   // Java double print
  function heapViews(h, name, f, hl, tf) {
    hl = hl || {};
    const ahl = {};
    Object.keys(hl).forEach(k => { if (!/^e/.test(k)) ahl[k] = hl[k]; });
    return [
      { type: 'tree', label: `${name} — tree`, nodes: h.a.map(tf || f), hl },
      { type: 'array', label: `${name} — array (andar ka order)`, vals: h.a.map(f), hl: ahl },
    ];
  }

  // Java HashMap iteration order (Integer keys): bucket = (h ^ h>>>16) & (cap−1), resize pe lo/hi split
  function javaHashOrder(keys) {
    let cap = 16, tab = Array.from({ length: cap }, () => []), size = 0;
    const idx = (x, c) => ((x ^ (x >>> 16)) & (c - 1));
    keys.forEach(x => {
      const b = tab[idx(x, cap)];
      if (b.includes(x)) return;
      b.push(x);
      if (++size > cap * 0.75) {
        const old = tab, oc = cap;
        cap *= 2; tab = Array.from({ length: cap }, () => []);
        old.forEach((bk, j) => bk.forEach(y => tab[(y & oc) ? j + oc : j].push(y)));
      }
    });
    return tab.flat();
  }

  // ================= LC 1046 — Last Stone Weight (max-heap) =================
  VIZ.defs[1046] = {
    title: 'Last Stone Weight (Max-heap)', label: 'PriorityQueue', ap: 1,
    inputs: [{ key: 'stones', label: 'stones', def: '2, 7, 4, 1, 8, 1' }],
    run({ stones }) {
      const L = liner(1046, 1), steps = [];
      const h = new JHeap((a, b) => b - a), f = v => v;
      let cur = -1, y, x;
      const vars = extra => Object.assign({ stones: arrStr(stones), pq: pqStr(h, f) }, extra || {});
      const snap = (line, note, hl, extra, ret) => {
        if (steps.length >= MAX) return;
        const st = { line, note, views: [{ type: 'array', label: 'stones', vals: stones, hl: cur >= 0 ? { [cur]: 'cur' } : {} }].concat(heapViews(h, 'pq (max-heap)', f, hl)), vars: vars(extra) };
        if (ret !== undefined) st.ret = ret;
        steps.push(st);
      };
      const cb = (line, extra) => (t, i, j) => { const [n, hl] = siftNote(t, i, j, h.a, f, 'bada'); snap(line, n, hl, extra); };
      snap(L('new PriorityQueue'), 'pq = new PriorityQueue<>(Collections.reverseOrder()) — khaali MAX-heap (bada top pe).');
      stones.forEach((s, i) => {
        cur = i;
        snap(L('for (int s'), `s = stones[${i}] = ${s} → pq.offer(${s})`, {}, { s });
        h.offer(s, cb(L('for (int s'), { s }));
      });
      cur = -1;
      while (h.size > 1 && steps.length < MAX) {
        snap(L('while (pq.size()'), `pq.size() = ${h.size} > 1 → ek aur takkar`, {});
        snap(L('int y = pq.poll()'), `poll(): root ${h.peek()} = sabse bhaari nikalega`, { 0: 'found' });
        y = h.poll(cb(L('int y = pq.poll()'), { y: '?' }));
        snap(L('int y = pq.poll()'), `y = ${y}`, {}, { y });
        snap(L('int x = pq.poll()'), `poll(): root ${h.peek()} = doosra sabse bhaari`, { 0: 'found' }, { y });
        x = h.poll(cb(L('int x = pq.poll()'), { y }));
        snap(L('int x = pq.poll()'), `x = ${x}`, {}, { y, x });
        if (y !== x) {
          snap(L('if (y != x)'), `${y} != ${x} → bacha hua stone ${y} − ${x} = ${y - x} wapas offer`, {}, { y, x });
          h.offer(y - x, cb(L('if (y != x)'), { y, x }));
        } else snap(L('if (y != x)'), `${y} == ${x} → dono stones khatam, kuch wapas nahi`, {}, { y, x });
      }
      snap(L('while (pq.size()'), `pq.size() = ${h.size} → loop khatam`, h.size ? { 0: 'found' } : {});
      const ans = h.size ? h.peek() : 0;
      snap(L('return pq.isEmpty()'), h.size ? `Ek stone bacha → return pq.peek() = ${ans}` : 'Koi stone nahi bacha → return 0', h.size ? { 0: 'found' } : {}, {}, String(ans));
      return steps;
    },
    variants: [{
      label: 'Own Heap (sift up / down)', title: 'Last Stone Weight (khud ka int[] max-heap)', ap: 2,
      run({ stones }) {
        const L = liner(1046, 2), steps = [];
        const heap = Array(stones.length).fill(0);
        let size = 0, y, x;
        const mainVars = extra => Object.assign({ stones: arrStr(stones), heap: arrStr(heap), size }, extra || {});
        const snap = (line, note, hl, frames, ret) => {
          if (steps.length >= MAX) return;
          const tree = heap.slice(0, size), vhl = {};
          for (let i = size; i < heap.length; i++) vhl[i] = 'skip';
          Object.keys(hl || {}).forEach(k => { if (!/^e/.test(k)) vhl[k] = hl[k]; });
          const st = { line, note, views: [
            { type: 'tree', label: `heap — tree (sirf index 0..size−1 = 0..${size - 1})`, nodes: tree, hl: hl || {} },
            { type: 'array', label: `heap — int[] (size = ${size}, grey = khaali)`, vals: heap.slice(), hl: vhl },
          ], frames };
          if (ret !== undefined) st.ret = ret;
          steps.push(st);
        };
        const top = (line, extra) => [{ method: 'lastStoneWeight', args: `stones=[${stones.join(',')}]`, line, vars: mainVars(extra) }];
        function push(val, callLine, extra) {
          const fr = vv => [{ method: 'push', args: `size=${size}, val=${val}`, vars: Object.assign({ h: arrStr(heap), size, val }, vv) }].concat(top(callLine, extra));
          let i = size;
          snap(L('int i = size;'), `i = size = ${i} (pehla khaali slot)`, {}, fr({ i }));
          heap[i] = val; size++;   // tree me dikhane ke liye size abhi badha diya
          snap(L('h[i] = val;'), `h[${i}] = ${val} — tree ke last slot pe`, { [i]: 'new' }, fr({ i }));
          size--;
          while (i > 0 && steps.length < MAX) {
            const p = (i - 1) >> 1;
            size++;
            if (!(heap[p] < heap[i])) { snap(L('while (i > 0'), `parent h[${p}] = ${heap[p]} ≥ ${heap[i]} → ruk jao`, { [i]: 'done', [p]: 'win' }, fr({ i })); size--; break; }
            snap(L('while (i > 0'), `parent h[${p}] = ${heap[p]} < h[${i}] = ${heap[i]} → upar chadhna hai`, { [i]: 'cur', [p]: 'win' }, fr({ i }));
            snap(L('int p = (i - 1) / 2;'), `p = (${i} − 1) / 2 = ${p}`, { [i]: 'cur', [p]: 'win' }, fr({ i, p }));
            const t = heap[p]; heap[p] = heap[i]; heap[i] = t;
            snap(L('int t = h[p]'), `swap h[${p}] ↔ h[${i}] → ${heap[p]} upar gaya`, { [p]: 'new', [i]: 'cur', ['e' + i]: 'cur' }, fr({ i, p }));
            i = p;
            snap(L('i = p;'), `i = ${i}`, { [i]: 'new' }, fr({ i }));
            size--;
          }
          if (i === 0) { size++; snap(L('while (i > 0'), 'i = 0 → root pe pahunch gaye, loop khatam', { 0: 'new' }, fr({ i })); size--; }
          size++;
          snap(L('return size + 1;'), `return size + 1 = ${size}`, {}, [{ method: 'push', args: `val=${val}`, vars: { h: arrStr(heap), size: size - 1, val } }].concat(top(callLine, extra)));
        }
        function pop(callLine, extra) {
          const fr = vv => [{ method: 'pop', args: `size=${size + 1}`, vars: Object.assign({ h: arrStr(heap), size }, vv) }].concat(top(callLine, extra));
          size--;
          snap(L('size--;'), `size-- → ${size} (root hatne wala hai)`, {}, fr({}));
          heap[0] = heap[size];
          snap(L('h[0] = h[size];'), `h[0] = h[${size}] = ${heap[0]} — last element root pe`, { 0: 'new' }, fr({}));
          let i = 0;
          snap(L('int i = 0;'), 'i = 0', { 0: 'cur' }, fr({ i }));
          while (steps.length < MAX) {
            const l = 2 * i + 1, r = 2 * i + 2;
            let big = i;
            if (l < size && heap[l] > heap[big]) big = l;
            if (r < size && heap[r] > heap[big]) big = r;
            snap(L('if (r < size'), `l = ${l}, r = ${r} → ${big === i ? 'koi child bada nahi' : `sabse bada child h[${big}] = ${heap[big]}`}`, Object.assign({ [i]: 'cur' }, l < size ? { [l]: 'win' } : {}, r < size ? { [r]: 'win' } : {}, big !== i ? { [big]: 'found' } : {}), fr({ i, l, r, big }));
            if (big === i) { snap(L('if (big == i) break;'), `big == i → ${heap[i]} sahi jagah, break`, { [i]: 'done' }, fr({ i, l, r, big })); break; }
            const t = heap[big]; heap[big] = heap[i]; heap[i] = t;
            snap(L('int t = h[big]'), `swap h[${i}] ↔ h[${big}] → ${heap[i]} upar, ${heap[big]} neeche`, { [i]: 'new', [big]: 'cur', ['e' + big]: 'cur' }, fr({ i, l, r, big }));
            i = big;
          }
          snap(L('return size;'), `return size = ${size}`, {}, [{ method: 'pop', args: '', vars: { h: arrStr(heap), size } }].concat(top(callLine, extra)));
        }
        snap(L('int[] heap = new int'), `heap = new int[${stones.length}] — khud ka array, size = 0`, {}, top(L('int[] heap = new int')));
        stones.forEach(s => {
          snap(L('for (int s'), `s = ${s} → push(heap, ${size}, ${s})`, {}, top(L('for (int s'), { s }));
          push(s, L('for (int s'), { s });
        });
        while (size > 1 && steps.length < MAX) {
          snap(L('while (size > 1)'), `size = ${size} > 1 → takkar`, {}, top(L('while (size > 1)')));
          y = heap[0];
          snap(L('int y = heap[0];'), `y = heap[0] = ${y} (sabse bhaari)`, { 0: 'found' }, top(L('int y = heap[0];'), { y }));
          pop(L('size = pop(heap, size);'), { y });
          x = heap[0];
          snap(L('int x = heap[0];'), `x = heap[0] = ${x} (doosra sabse bhaari)`, { 0: 'found' }, top(L('int x = heap[0];'), { y, x }));
          pop(L('size = pop(heap, size);', 1), { y, x });
          if (y !== x) {
            snap(L('if (y != x)'), `${y} != ${x} → push(${y - x})`, {}, top(L('if (y != x)'), { y, x }));
            push(y - x, L('if (y != x)'), { y, x });
          } else snap(L('if (y != x)'), `${y} == ${x} → dono khatam`, {}, top(L('if (y != x)'), { y, x }));
        }
        const ans = size === 0 ? 0 : heap[0];
        snap(L('return size == 0'), `size = ${size} → return ${ans}`, size ? { 0: 'found' } : {}, top(L('return size == 0')), String(ans));
        return steps;
      },
    }],
  };

  // ================= LC 703 — Kth Largest in a Stream (design, min-heap size k) =================
  VIZ.defs[703] = {
    title: 'Kth Largest Element in a Stream (Min-heap of size k)', ap: 2, method: 'add',
    inputs: [
      { key: 'ops', label: 'operations (JSON)', type: 'json', def: '["KthLargest","add","add","add","add","add"]' },
      { key: 'args', label: 'arguments (JSON)', type: 'json', def: '[[3,[4,5,8,2]],[3],[5],[10],[9],[4]]' },
    ],
    run({ ops, args }) {
      const L = liner(703, 2), steps = [];
      const h = new JHeap((a, b) => a - b), f = v => v;
      const out = [];
      let K = 0, ctor = null, opText = '';
      const snap = (line, note, hl, frames, ret) => {
        if (steps.length >= MAX) return;
        const st = { line, note, views: [{ type: 'text', label: 'operation', value: opText }].concat(heapViews(h, `pq (min-heap, k = ${K})`, f, hl), [{ type: 'array', label: 'output', vals: out.map(v => (v === null ? 'null' : v)) }]), frames };
        if (ret !== undefined) st.ret = ret;
        steps.push(st);
      };
      const fields = () => ({ 'this.k': K, pq: pqStr(h, f) });
      function add(val, outer) {
        const fr = () => [{ method: 'add', args: `val=${val}`, vars: Object.assign({ val }, fields()) }].concat(outer ? [outer()] : []);
        const cb = line => (t, i, j) => { const [n, hl] = siftNote(t, i, j, h.a, f, 'chhota'); snap(line, n, hl, fr()); };
        snap(L('pq.offer(val);'), `pq.offer(${val})`, {}, fr());
        h.offer(val, cb(L('pq.offer(val);')));
        if (h.size > K) {
          snap(L('if (pq.size() > k)'), `size ${h.size} > k = ${K} → poll(): sabse chhota ${h.peek()} ab top-${K} me nahi`, { 0: 'skip' }, fr());
          h.poll(cb(L('if (pq.size() > k)')));
        } else snap(L('if (pq.size() > k)'), `size ${h.size} ≤ k = ${K} → kuch nahi hatana`, {}, fr());
        snap(L('return pq.peek();'), `return pq.peek() = ${h.peek()} (k bade numbers me sabse chhota)`, { 0: 'found' }, fr());
        return h.peek();
      }
      ops.forEach((op, oi) => {
        const a = args[oi] || [];
        if (op === 'KthLargest') {
          const k = a[0], nums = a[1] || [];
          opText = `new KthLargest(${k}, [${nums.join(', ')}])`;
          ctor = xv => ({ method: 'KthLargest', args: `k=${k}, nums=[${nums.join(',')}]`, line: L('for (int x : nums)'), vars: Object.assign({ k, nums: arrStr(nums) }, xv === undefined ? {} : { x: xv }, fields()) });
          snap(L('PriorityQueue<Integer> pq'), 'Field init: pq = new PriorityQueue<>() — khaali MIN-heap', {}, [{ method: 'KthLargest', args: `k=${k}, nums=[${nums.join(',')}]`, vars: Object.assign({ k, nums: arrStr(nums) }, fields()) }]);
          K = k;
          snap(L('this.k = k;'), `this.k = ${k}`, {}, [{ method: 'KthLargest', args: `k=${k}`, vars: Object.assign({ k, nums: arrStr(nums) }, fields()) }]);
          nums.forEach(x => {
            snap(L('for (int x : nums)'), `x = ${x} → add(${x}) (return value ignore)`, {}, [ctor(x)]);
            add(x, () => ctor(x));
          });
          out.push(null);
          snap(L('for (int x : nums)'), 'Constructor khatam → output null', {}, [ctor()]);
        } else if (op === 'add') {
          opText = `add(${a[0]})`;
          out.push(add(a[0], null));
        }
      });
      const last = steps[steps.length - 1];
      const ret = '[' + out.map(v => (v === null ? 'null' : v)).join(', ') + ']';
      snap(last ? last.line : 1, `Saare operations ka output: ${ret}`, {}, last ? last.frames : [], ret);
      return steps;
    },
  };

  // ================= LC 215 — Kth Largest in Array =================
  VIZ.defs[215] = {
    title: 'Kth Largest Element (Min-heap of size k)', label: 'Min-heap', ap: 1,
    inputs: [{ key: 'nums', label: 'nums', def: '3, 2, 1, 5, 6, 4' }, { key: 'k', label: 'k', def: '2', type: 'num' }],
    run({ nums, k }) {
      const L = liner(215, 1), steps = [];
      const h = new JHeap((a, b) => a - b), f = v => v;
      let cur = -1;
      const snap = (line, note, hl, extra, ret) => {
        if (steps.length >= MAX) return;
        const st = { line, note, views: [{ type: 'array', label: 'nums', vals: nums, hl: cur >= 0 ? { [cur]: 'cur' } : {}, ptr: cur >= 0 ? [{ i: cur, label: 'x' }] : [] }].concat(heapViews(h, `pq (min-heap, size ≤ k = ${k})`, f, hl)), vars: Object.assign({ nums: arrStr(nums), k, pq: pqStr(h, f) }, extra || {}) };
        if (ret !== undefined) st.ret = ret;
        steps.push(st);
      };
      const cb = (line, ex) => (t, i, j) => { const [n, hl] = siftNote(t, i, j, h.a, f, 'chhota'); snap(line, n, hl, ex); };
      snap(L('PriorityQueue<Integer> pq'), 'pq = new PriorityQueue<>() — MIN-heap. Isme sirf k sabse bade rakhenge.');
      nums.forEach((x, i) => {
        cur = i;
        snap(L('for (int x : nums)'), `x = nums[${i}] = ${x}`, {}, { x });
        snap(L('pq.offer(x);'), `pq.offer(${x})`, {}, { x });
        h.offer(x, cb(L('pq.offer(x);'), { x }));
        if (h.size > k) {
          snap(L('if (pq.size() > k)'), `size ${h.size} > k → poll(): ${h.peek()} sabse chhota, top-${k} me nahi aa sakta`, { 0: 'skip' }, { x });
          h.poll(cb(L('if (pq.size() > k)'), { x }));
        } else snap(L('if (pq.size() > k)'), `size ${h.size} ≤ k = ${k} → rakh lo`, {}, { x });
      });
      cur = -1;
      snap(L('return pq.peek();'), `Heap me ab ${k} sabse bade: [${h.a.slice().sort((a, b) => a - b).join(', ')}]. Top = ${h.peek()} = kth largest`, { 0: 'found' }, {}, String(h.peek()));
      return steps;
    },
    variants: [{
      label: 'Quickselect', title: 'Kth Largest Element (Quickselect, 3-way partition)', ap: 2,
      run({ nums, k }) {
        const L = liner(215, 2), steps = [], a = nums.slice(), n = a.length;
        const target = n - k;
        let lo = 0, hi = n - 1, lt = -1, i = -1, gt = -1, pivot = null;
        const snap = (line, note, extra, ret) => {
          if (steps.length >= MAX) return;
          const hl = {};
          for (let j = 0; j < n; j++) {
            if (j < lo || j > hi) hl[j] = 'skip';
            else if (pivot === null) hl[j] = 'win';
            else if (j < lt) hl[j] = 'done';
            else if (j < i) hl[j] = 'new';
            else if (j > gt) hl[j] = 'win';
          }
          if (i >= lo && i <= gt && pivot !== null) hl[i] = 'cur';
          const ptr = [{ i: lo, label: 'lo' }, { i: hi, label: 'hi' }, { i: target, label: 'target' }];
          if (pivot !== null) ptr.push({ i: lt, label: 'lt' }, { i, label: 'i' }, { i: gt, label: 'gt' });
          const st = { line, note, views: [
            { type: 'array', label: 'nums', vals: a.slice(), hl, ptr: ptr.filter(p => p.i >= 0 && p.i < n) },
            { type: 'text', label: 'colors', value: 'green = < pivot · new = == pivot · win = > pivot (ya abhi unseen) · grey = range ke bahar' },
          ], vars: Object.assign({ nums: arrStr(a), k, target, lo, hi }, pivot !== null ? { pivot, lt, i, gt } : {}, extra || {}) };
          if (ret !== undefined) st.ret = ret;
          steps.push(st);
        };
        const sw = (x, y) => { const t = a[x]; a[x] = a[y]; a[y] = t; };
        snap(L('int target ='), `target = ${n} − ${k} = ${target} (ascending sorted me ye index = kth largest)`);
        snap(L('int lo = 0, hi'), `lo = 0, hi = ${n - 1}`);
        while (lo < hi && steps.length < MAX) {
          pivot = null;
          snap(L('while (lo < hi)'), `lo = ${lo} < hi = ${hi} → partition karo`);
          pivot = a[lo + ((hi - lo) >> 1)];
          lt = lo; i = lo; gt = hi;
          snap(L('int pivot ='), `pivot = nums[${lo + ((hi - lo) >> 1)}] = ${pivot} (beech wala)`);
          snap(L('int lt = lo, i = lo, gt = hi;'), `lt = ${lt}, i = ${i}, gt = ${gt}`);
          while (i <= gt && steps.length < MAX) {
            if (a[i] < pivot) { sw(lt, i); snap(L('if (nums[i] < pivot)'), `nums[${i}] < ${pivot} → swap(lt=${lt}, i=${i}), lt++, i++`); lt++; i++; }
            else if (a[i] > pivot) { const v = a[i]; sw(i, gt); snap(L('else if (nums[i] > pivot)'), `${v} > ${pivot} → swap(i=${i}, gt=${gt}) → right side, gt--`); gt--; }
            else { snap(L('else i++;'), `nums[${i}] == ${pivot} → beech me hi rehne do, i++`); i++; }
          }
          snap(L('while (i <= gt)'), `i = ${i} > gt = ${gt} → partition done: [${lo}..${lt - 1}] < ${pivot}, [${lt}..${gt}] == ${pivot}, [${gt + 1}..${hi}] > ${pivot}`);
          if (target < lt) { hi = lt - 1; snap(L('if (target < lt)'), `target ${target} < lt ${lt} → left part me jao, hi = ${hi}`); }
          else if (target > gt) { lo = gt + 1; snap(L('else if (target > gt)'), `target ${target} > gt ${gt} → right part me jao, lo = ${lo}`); }
          else { snap(L('else return pivot;'), `target ${target} [${lt}..${gt}] me hai → return pivot = ${pivot}`, {}, String(pivot)); return steps; }
        }
        pivot = null;
        snap(L('return nums[lo];'), `lo == hi = ${lo} → return nums[${lo}] = ${a[lo]}`, {}, String(a[lo]));
        return steps;
      },
    }],
  };

  // ================= LC 347 — Top K Frequent =================
  VIZ.defs[347] = {
    title: 'Top K Frequent Elements (HashMap + Min-heap of size k)', label: 'Min-heap', ap: 1,
    inputs: [{ key: 'nums', label: 'nums', def: '1, 1, 1, 2, 2, 3' }, { key: 'k', label: 'k', def: '2', type: 'num' }],
    run({ nums, k }) {
      const L = liner(347, 1), steps = [];
      const cnt = new Map(), order = javaHashOrder(nums);
      nums.forEach(x => cnt.set(x, (cnt.get(x) || 0) + 1));
      const freqObj = {}, freqStr = () => `HashMap size=${order.length} {${order.map(x => `${x}=${cnt.get(x)}`).join(', ')}}`;
      order.forEach(x => { freqObj[x] = cnt.get(x); });
      const h = new JHeap((a, b) => a[1] - b[1]);
      const f = e => `{${e[0]},${e[1]}}`, tf = e => `${e[0]}:${e[1]}`;
      let ans = null, mhl;
      const snap = (line, note, hl, extra, ret) => {
        if (steps.length >= MAX) return;
        const vs = [{ type: 'array', label: 'nums', vals: nums }, { type: 'map', label: 'freq (HashMap num → count)', entries: freqObj, hl: mhl }].concat(heapViews(h, `pq (min-heap by count, size ≤ k = ${k}) · node = num:count`, f, hl, tf));
        if (ans) vs.push({ type: 'array', label: 'ans', vals: ans.slice() });
        const st = { line, note, views: vs, vars: Object.assign({ nums: arrStr(nums), k, freq: freqStr(), pq: `PriorityQueue size=${h.size} [${h.a.map(f).join(', ')}]` }, ans ? { ans: arrStr(ans) } : {}, extra || {}) };
        if (ret !== undefined) st.ret = ret;
        steps.push(st);
      };
      const cb = (line, ex) => (t, i, j) => { const [n, hl] = siftNote(t, i, j, h.a, tf, 'kam count wala'); snap(line, n, hl, ex); };
      snap(L('for (int x : nums) freq.put'), `Frequency count: ${order.map(x => `${x}→${cnt.get(x)}`).join(', ')} (HashMap ka iteration order yahi hai)`);
      snap(L('PriorityQueue<int[]> pq'), 'pq = min-heap of {num, count}, comparator a[1] vs b[1] → sabse kam count top pe');
      order.forEach(key => {
        const e = [key, cnt.get(key)];
        mhl = key;
        snap(L('for (Map.Entry'), `e = ${key}=${e[1]}`, {}, { e: `${key}=${e[1]}` });
        h.offer(e, cb(L('pq.offer(new int[]'), { e: `${key}=${e[1]}` }));
        if (h.size > k) {
          snap(L('if (pq.size() > k)'), `size ${h.size} > k → poll(): ${tf(h.peek())} sabse kam frequent → bahar`, { 0: 'skip' }, { e: `${key}=${e[1]}` });
          h.poll(cb(L('if (pq.size() > k)'), { e: `${key}=${e[1]}` }));
        } else snap(L('if (pq.size() > k)'), `size ${h.size} ≤ k = ${k} → rakh lo`, {}, { e: `${key}=${e[1]}` });
      });
      mhl = undefined;
      ans = Array(k).fill(0);
      snap(L('int[] ans = new int[k];'), `ans = new int[${k}]. Heap me ab top-${k} frequent hain.`);
      for (let i = k - 1; i >= 0; i--) {
        snap(L('for (int i = k - 1'), `i = ${i}: poll() → ${tf(h.peek())} (bache hue me sabse kam frequent → peeche rakho)`, { 0: 'found' }, { i });
        ans[i] = h.poll(cb(L('for (int i = k - 1'), { i }))[0];
        snap(L('for (int i = k - 1'), `ans[${i}] = ${ans[i]}`, {}, { i });
      }
      snap(L('return ans;'), `return [${ans.join(', ')}]`, {}, {}, `[${ans.join(', ')}]`);
      return steps;
    },
    variants: [{
      label: 'Bucket sort', title: 'Top K Frequent (Bucket sort, O(n))', ap: 2,
      run({ nums, k }) {
        const L = liner(347, 2), steps = [], n = nums.length;
        const cnt = new Map(), order = javaHashOrder(nums);
        nums.forEach(x => cnt.set(x, (cnt.get(x) || 0) + 1));
        const freqStr = `HashMap size=${order.length} {${order.map(x => `${x}=${cnt.get(x)}`).join(', ')}}`;
        const bucket = Array(n + 1).fill(null);
        let ans = null, idx = 0;
        const bStr = () => `List[${n + 1}] [${bucket.map(b => (b ? '[' + b.join(', ') + ']' : 'null')).join(', ')}]`;
        const snap = (line, note, bhl, extra, ret) => {
          if (steps.length >= MAX) return;
          const vs = [{ type: 'array', label: 'nums', vals: nums }, { type: 'array', label: 'bucket[f] (index = frequency)', vals: bucket.map(b => (b ? '[' + b.join(',') + ']' : '·')), hl: bhl || {} }];
          if (ans) vs.push({ type: 'array', label: 'ans', vals: ans.slice(), hl: idx > 0 ? { [idx - 1]: 'new' } : {} });
          const st = { line, note, views: vs, vars: Object.assign({ nums: arrStr(nums), k, freq: freqStr, bucket: bStr() }, ans ? { ans: arrStr(ans), idx } : {}, extra || {}) };
          if (ret !== undefined) st.ret = ret;
          steps.push(st);
        };
        snap(L('for (int x : nums) freq.put'), `Frequency: ${order.map(x => `${x}→${cnt.get(x)}`).join(', ')}`);
        snap(L('List<Integer>[] bucket'), `bucket = new List[${n + 1}] — frequency 0..${n} ke liye ek-ek dabba`);
        order.forEach(key => {
          const f = cnt.get(key);
          snap(L('int f = freq.get(key);'), `key = ${key}, f = ${f}`, { [f]: 'cur' }, { key, f });
          if (!bucket[f]) { bucket[f] = []; snap(L('if (bucket[f] == null)'), `bucket[${f}] null tha → new ArrayList`, { [f]: 'new' }, { key, f }); }
          bucket[f].push(key);
          snap(L('bucket[f].add(key);'), `bucket[${f}].add(${key})`, { [f]: 'new' }, { key, f });
        });
        ans = Array(k).fill(0);
        snap(L('int[] ans = new int[k];'), `ans = new int[${k}], idx = 0. Ab sabse badi frequency (${n}) se neeche chalo.`);
        for (let f = n; f >= 1 && idx < k && steps.length < MAX; f--) {
          if (!bucket[f]) { snap(L('if (bucket[f] == null) continue;'), `f = ${f}: bucket khaali → continue`, { [f]: 'skip' }, { f }); continue; }
          for (const x of bucket[f]) {
            if (idx === k) { snap(L('if (idx == k) break;'), `idx == k → break`, { [f]: 'cur' }, { f, x }); break; }
            ans[idx++] = x;
            snap(L('ans[idx++] = x;'), `f = ${f}: ans[${idx - 1}] = ${x}`, { [f]: 'found' }, { f, x });
          }
        }
        snap(L('return ans;'), `return [${ans.join(', ')}]`, {}, {}, `[${ans.join(', ')}]`);
        return steps;
      },
    }],
  };

  // ================= LC 973 — K Closest Points =================
  VIZ.defs[973] = {
    title: 'K Closest Points to Origin (Max-heap of size k)', ap: 1,
    inputs: [{ key: 'points', label: 'points (JSON)', type: 'json', def: '[[3,3],[5,-1],[-2,4]]' }, { key: 'k', label: 'k', def: '2', type: 'num' }],
    run({ points, k }) {
      const L = liner(973, 1), steps = [];
      const d = p => p[0] * p[0] + p[1] * p[1];
      const h = new JHeap((a, b) => d(b) - d(a));
      const f = p => `[${p[0]},${p[1]}] d=${d(p)}`, tf = p => d(p);
      const ps = p => `int[2] [${p[0]}, ${p[1]}]`;
      let cur = -1, ans = null;
      const snap = (line, note, hl, extra, ret) => {
        if (steps.length >= MAX) return;
        const vs = [{ type: 'array', label: 'points  (d = x² + y²)', vals: points.map(p => `[${p[0]},${p[1]}] d=${d(p)}`), hl: cur >= 0 ? { [cur]: 'cur' } : {} }].concat(heapViews(h, `pq (MAX-heap by d, size ≤ k = ${k}) · tree node = d`, f, hl, tf));
        if (ans) vs.push({ type: 'array', label: 'ans', vals: ans.map(p => (p ? `[${p[0]},${p[1]}]` : 'null')) });
        const st = { line, note, views: vs, vars: Object.assign({ k, pq: `PriorityQueue size=${h.size} [${h.a.map(p => `[${p[0]}, ${p[1]}]`).join(', ')}]` }, ans ? { ans: `int[${k}][] [${ans.map(p => (p ? `[${p[0]}, ${p[1]}]` : 'null')).join(', ')}]` } : {}, extra || {}) };
        if (ret !== undefined) st.ret = ret;
        steps.push(st);
      };
      const cb = (line, ex) => (t, i, j) => { const [n, hl] = siftNote(t, i, j, h.a, p => `d=${d(p)}`, 'door'); snap(line, n, hl, ex); };
      snap(L('PriorityQueue<int[]> pq'), 'pq = MAX-heap (comparator dist(b) vs dist(a)) → sabse DOOR wala top pe');
      points.forEach((p, i) => {
        cur = i;
        snap(L('for (int[] p : points)'), `p = [${p[0]}, ${p[1]}], dist = ${p[0]}² + ${p[1]}² = ${d(p)}`, {}, { p: ps(p) });
        h.offer(p, cb(L('pq.offer(p);'), { p: ps(p) }));
        if (h.size > k) {
          const far = h.peek();
          snap(L('if (pq.size() > k)'), `size ${h.size} > k → poll(): [${far[0]},${far[1]}] (d=${d(far)}) sabse door → bahar`, { 0: 'skip' }, { p: ps(p) });
          h.poll(cb(L('if (pq.size() > k)'), { p: ps(p) }));
        } else snap(L('if (pq.size() > k)'), `size ${h.size} ≤ k = ${k} → rakh lo`, {}, { p: ps(p) });
      });
      cur = -1;
      ans = Array(k).fill(null);
      snap(L('int[][] ans = new int[k][];'), `ans = new int[${k}][]. Heap me ab ${k} closest points hain.`);
      for (let i = k - 1; i >= 0; i--) {
        snap(L('for (int i = k - 1'), `i = ${i}: poll() → sabse door wala (bache hue me) → ans ke end me`, { 0: 'found' }, { i });
        ans[i] = h.poll(cb(L('for (int i = k - 1'), { i }));
      }
      const r = `[${ans.map(p => `[${p[0]}, ${p[1]}]`).join(', ')}]`;
      snap(L('return ans;'), `return ${r} (closest pehle)`, {}, {}, r);
      return steps;
    },
  };

  // ================= LC 295 — Find Median from Data Stream (two heaps) =================
  VIZ.defs[295] = {
    title: 'Find Median from Data Stream (Two Heaps)', ap: 2, method: 'addNum',
    inputs: [
      { key: 'ops', label: 'operations (JSON)', type: 'json', def: '["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]' },
      { key: 'args', label: 'arguments (JSON)', type: 'json', def: '[[],[1],[2],[],[3],[]]' },
    ],
    run({ ops, args }) {
      const L = liner(295, 2), steps = [];
      const low = new JHeap((a, b) => b - a), high = new JHeap((a, b) => a - b), f = v => v;
      const out = [];
      let opText = '';
      const snap = (line, note, hlLow, hlHigh, frames, ret) => {
        if (steps.length >= MAX) return;
        const st = { line, note, views: [{ type: 'text', label: 'operation', value: opText }]
          .concat(heapViews(low, 'low (MAX-heap: chhota half)', f, hlLow), heapViews(high, 'high (MIN-heap: bada half)', f, hlHigh),
            [{ type: 'array', label: 'output', vals: out.slice() }]), frames };
        if (ret !== undefined) st.ret = ret;
        steps.push(st);
      };
      const fields = () => ({ low: pqStr(low, f), high: pqStr(high, f) });
      ops.forEach((op, oi) => {
        const a = args[oi] || [];
        if (op === 'MedianFinder') {
          opText = 'new MedianFinder()';
          snap(L('private final PriorityQueue<Integer> low'), 'Field init: low = max-heap (chhote numbers), high = min-heap (bade numbers)', {}, {}, [{ method: 'MedianFinder', args: '', vars: fields() }]);
          snap(L('public MedianFinder()'), 'Constructor — kuch extra nahi', {}, {}, [{ method: 'MedianFinder', args: '', vars: fields() }]);
          out.push('null');
        } else if (op === 'addNum') {
          const num = a[0];
          opText = `addNum(${num})`;
          const fr = () => [{ method: 'addNum', args: `num=${num}`, vars: Object.assign({ num }, fields()) }];
          const cbL = line => (t, i, j) => { const [n, hl] = siftNote(t, i, j, low.a, f, 'bada'); snap(line, 'low: ' + n, hl, {}, fr()); };
          const cbH = line => (t, i, j) => { const [n, hl] = siftNote(t, i, j, high.a, f, 'chhota'); snap(line, 'high: ' + n, {}, hl, fr()); };
          snap(L('low.offer(num);'), `low.offer(${num}) — naya number pehle chhote half (max-heap) me`, {}, {}, fr());
          low.offer(num, cbL(L('low.offer(num);')));
          const m = low.peek();
          snap(L('high.offer(low.poll());'), `low.poll() → ${m} (low ka sabse bada) → high me bhejo, taaki low ≤ high order bana rahe`, { 0: 'found' }, {}, fr());
          low.poll(cbL(L('high.offer(low.poll());')));
          high.offer(m, cbH(L('high.offer(low.poll());')));
          if (high.size > low.size) {
            snap(L('if (high.size() > low.size())'), `high.size() ${high.size} > low.size() ${low.size} → balance: high ka top ${high.peek()} wapas low me`, {}, { 0: 'found' }, fr());
            const t = high.poll(cbH(L('low.offer(high.poll());')));
            low.offer(t, cbL(L('low.offer(high.poll());')));
            snap(L('low.offer(high.poll());'), `Ab low = ${low.size}, high = ${high.size} ✓`, { 0: 'done' }, high.size ? { 0: 'done' } : {}, fr());
          } else snap(L('if (high.size() > low.size())'), `high.size() ${high.size} ≤ low.size() ${low.size} → balanced ✓`, low.size ? { 0: 'done' } : {}, high.size ? { 0: 'done' } : {}, fr());
          out.push('null');
        } else if (op === 'findMedian') {
          opText = 'findMedian()';
          const fr = () => [{ method: 'findMedian', args: '', vars: fields() }];
          if (low.size > high.size) {
            const v = jd(low.peek());
            snap(L('if (low.size() > high.size()) return'), `Odd count (low ${low.size} > high ${high.size}) → median = low.peek() = ${v}`, { 0: 'found' }, {}, fr());
            out.push(v);
          } else {
            snap(L('if (low.size() > high.size()) return'), `Sizes barabar (${low.size} = ${high.size}) → even count`, {}, {}, fr());
            const v = jd((low.peek() + high.peek()) / 2);
            snap(L('return (low.peek() + high.peek())'), `median = (${low.peek()} + ${high.peek()}) / 2.0 = ${v}`, { 0: 'found' }, { 0: 'found' }, fr());
            out.push(v);
          }
        }
      });
      const last = steps[steps.length - 1];
      const ret = '[' + out.join(', ') + ']';
      snap(last ? last.line : 1, `Saare operations ka output: ${ret}`, {}, {}, last ? last.frames : [], ret);
      return steps;
    },
  };
})();
