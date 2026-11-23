// Phase 6 — Binary Search visualizers. Array view: lo / mid / hi pointers, phenka hua half = 'skip'.
// Answer-space questions (69, 875, 1011, 410): answer range array (ya text agar range badi ho) + feasibility check.
(function () {
  const { range } = VIZ.util;
  const PID = 'binary-search';
  const LIMIT = 590;

  // line number code ke text se nikalo (code badla toh viz khud adjust ho jaata hai)
  const cache = {};
  function L(n, ap, frag, nth) {
    const key = n + '|' + ap + '|' + frag + '|' + (nth || 1);
    if (cache[key]) return cache[key];
    const code = window.PHASE_CONTENT[PID].questions[n].approaches[ap].code.split('\n');
    let seen = 0;
    for (let i = 0; i < code.length; i++) {
      if (code[i].includes(frag) && ++seen === (nth || 1)) { cache[key] = i + 1; return i + 1; }
    }
    throw new Error('line not found: ' + frag);
  }

  // steps recorder: last (ret) step hamesha push hota hai
  function rec() {
    const steps = [];
    const s = (line, note, o) => {
      const st = Object.assign({ line, note }, o);
      if (steps.length < LIMIT || st.ret !== undefined) steps.push(st);
    };
    return { steps, s };
  }

  const arrStr = a => 'int[' + a.length + '] [' + a.join(', ') + ']';

  // nums ka view: [lo, hi] ke bahar = skip, andar = win, mid = cur
  function bsView(vals, lo, hi, mid, opt) {
    opt = opt || {};
    const hl = {};
    vals.forEach((_, i) => { hl[i] = (i < lo || i > hi) ? 'skip' : 'win'; });
    if (mid !== undefined && mid !== null && mid >= 0) hl[mid] = 'cur';
    Object.assign(hl, opt.hl || {});
    const ptr = [];
    if (lo !== null && lo !== undefined && lo >= 0 && lo < vals.length) ptr.push({ i: lo, label: 'lo' });
    if (mid !== undefined && mid !== null && mid >= 0) ptr.push({ i: mid, label: 'mid' });
    if (hi !== null && hi !== undefined && hi >= 0 && hi < vals.length) ptr.push({ i: hi, label: 'hi' });
    return { type: 'array', label: opt.label || 'nums', vals, hl, ptr };
  }

  // answer range ka view (candidate values). Range badi ho toh text.
  function ansView(lo0, hi0, lo, hi, mid, label, found) {
    if (hi0 - lo0 > 60) {
      return { type: 'text', label, value: '[' + lo0 + ' … ' + hi0 + '] — abhi bacha: [' + lo + ', ' + hi + ']' + (mid !== null && mid !== undefined ? ', mid = ' + mid : '') };
    }
    const vals = [], hl = {}, ptr = [];
    for (let v = lo0; v <= hi0; v++) {
      const i = v - lo0;
      vals.push(v);
      hl[i] = (v < lo || v > hi) ? 'skip' : 'win';
      if (v === mid) hl[i] = 'cur';
      if (found !== undefined && v === found) hl[i] = 'found';
      if (v === lo) ptr.push({ i, label: 'lo' });
      if (v === mid) ptr.push({ i, label: 'mid' });
      if (v === hi) ptr.push({ i, label: 'hi' });
    }
    return { type: 'array', label: label + ' (candidate values)', vals, hl, ptr };
  }

  // ---------------- LC 704 ----------------
  VIZ.defs[704] = {
    title: 'Binary Search (Iterative)', label: 'Iterative', ap: 1,
    inputs: [{ key: 'nums', label: 'nums (sorted, unique)', def: '-1, 0, 3, 5, 9, 12' }, { key: 'target', label: 'target', def: '9', type: 'num' }],
    run({ nums, target }) {
      const { steps, s } = rec(), n = nums.length, A = arrStr(nums);
      let lo = 0, hi = n - 1;
      const V = (mid, hl) => [bsView(nums, lo, hi, mid, { hl })];
      s(L(704, 1, 'int lo = 0'), 'lo = 0, hi = ' + (n - 1) + ' → poora array search space hai.', { views: V(), vars: { nums: A, target: String(target), lo: String(lo), hi: String(hi) } });
      while (true) {
        const ok = lo <= hi;
        s(L(704, 1, 'while (lo <= hi)'), 'lo (' + lo + ') <= hi (' + hi + ') ? ' + (ok ? 'true → search space bacha hai' : 'false → search space khaali'), { views: V(), vars: { nums: A, target: String(target), lo: String(lo), hi: String(hi) } });
        if (!ok) break;
        const mid = lo + Math.floor((hi - lo) / 2);
        const vars = { nums: A, target: String(target), lo: String(lo), hi: String(hi), mid: String(mid) };
        s(L(704, 1, 'int mid'), 'mid = ' + lo + ' + (' + hi + ' − ' + lo + ') / 2 = ' + mid + ', nums[mid] = ' + nums[mid], { views: V(mid), vars });
        if (nums[mid] === target) {
          s(L(704, 1, 'return mid'), 'nums[' + mid + '] = ' + nums[mid] + ' == target → return ' + mid, { views: V(mid, { [mid]: 'found' }), vars, ret: String(mid) });
          return steps;
        }
        s(L(704, 1, 'if (nums[mid] == target)'), nums[mid] + ' != ' + target, { views: V(mid), vars });
        if (nums[mid] < target) {
          lo = mid + 1;
          s(L(704, 1, 'lo = mid + 1'), nums[mid] + ' < ' + target + ' → target right me. Left half (… ' + mid + ') phenko, lo = ' + lo, { views: V(), vars: Object.assign({}, vars, { lo: String(lo) }) });
        } else {
          hi = mid - 1;
          s(L(704, 1, 'hi = mid - 1'), nums[mid] + ' > ' + target + ' → target left me. Right half (' + mid + ' …) phenko, hi = ' + hi, { views: V(), vars: Object.assign({}, vars, { hi: String(hi) }) });
        }
      }
      s(L(704, 1, 'return -1'), 'lo > hi → target nahi mila → return -1', { views: V(), vars: { nums: A, target: String(target), lo: String(lo), hi: String(hi) }, ret: '-1' });
      return steps;
    },
    variants: [{
      label: 'Recursive', title: 'Binary Search (Recursive)', ap: 2,
      run({ nums, target }) {
        const { steps, s } = rec(), n = nums.length, A = arrStr(nums);
        const stack = [];
        const fr = top => stack.slice().reverse().map((f, i) => ({ method: f.method, args: f.args, line: f.line, vars: i === 0 ? Object.assign({}, f.vars, top || {}) : f.vars }));
        stack.push({ method: 'search', args: 'target=' + target, line: 2, vars: { nums: A, target: String(target) } });
        s(L(704, 2, 'return bs('), 'search() → bs(nums, target, 0, ' + (n - 1) + ') call', { views: [bsView(nums, 0, n - 1)], frames: fr() });
        function bs(lo, hi) {
          stack.push({ method: 'bs', args: 'lo=' + lo + ', hi=' + hi, line: 6, vars: { target: String(target), lo: String(lo), hi: String(hi) } });
          const V = (mid, hl) => [bsView(nums, lo, hi, mid, { hl })];
          if (lo > hi) {
            s(L(704, 2, 'if (lo > hi)'), 'Base case: lo (' + lo + ') > hi (' + hi + ') → return -1', { views: V(), frames: fr() });
            stack.pop();
            return -1;
          }
          s(L(704, 2, 'if (lo > hi)'), 'lo (' + lo + ') <= hi (' + hi + ') → base case nahi', { views: V(), frames: fr() });
          const mid = lo + Math.floor((hi - lo) / 2);
          s(L(704, 2, 'int mid'), 'mid = ' + mid + ', nums[mid] = ' + nums[mid], { views: V(mid), frames: fr({ mid: String(mid) }) });
          let r;
          if (nums[mid] === target) {
            s(L(704, 2, 'if (nums[mid] == target)'), 'Match! return ' + mid, { views: V(mid, { [mid]: 'found' }), frames: fr({ mid: String(mid) }) });
            r = mid;
          } else if (nums[mid] < target) {
            s(L(704, 2, 'return bs(nums, target, mid + 1'), nums[mid] + ' < ' + target + ' → right half: bs(' + (mid + 1) + ', ' + hi + ') call', { views: V(mid), frames: fr({ mid: String(mid) }) });
            stack[stack.length - 1].vars.mid = String(mid);
            stack[stack.length - 1].line = L(704, 2, 'return bs(nums, target, mid + 1');
            r = bs(mid + 1, hi);
          } else {
            s(L(704, 2, 'return bs(nums, target, lo'), nums[mid] + ' > ' + target + ' → left half: bs(' + lo + ', ' + (mid - 1) + ') call', { views: V(mid), frames: fr({ mid: String(mid) }) });
            stack[stack.length - 1].vars.mid = String(mid);
            stack[stack.length - 1].line = L(704, 2, 'return bs(nums, target, lo');
            r = bs(lo, mid - 1);
          }
          stack.pop();
          return r;
        }
        const r = bs(0, n - 1);
        s(L(704, 2, 'return bs('), 'Saare frames return ho gaye → search() returns ' + r, { views: [bsView(nums, r, r, r >= 0 ? r : null, { hl: r >= 0 ? { [r]: 'found' } : {} })], frames: fr(), ret: String(r) });
        return steps;
      },
    }],
  };

  // ---------------- LC 35 ----------------
  VIZ.defs[35] = {
    title: 'Search Insert Position (Lower Bound)', ap: 1,
    inputs: [{ key: 'nums', label: 'nums (sorted, distinct)', def: '1, 3, 5, 6' }, { key: 'target', label: 'target', def: '2', type: 'num' }],
    run({ nums, target }) {
      const { steps, s } = rec(), n = nums.length, A = arrStr(nums);
      const vals = nums.concat(['']); // index n = "end me insert" slot
      let lo = 0, hi = n;
      const V = (mid, hl) => {
        const v = bsView(vals, lo, hi, mid, { hl, label: 'nums (+ slot n)' });
        if (hi === n && lo <= n) { v.hl[n] = v.hl[n] === 'skip' ? 'skip' : 'win'; }
        return [v, { type: 'text', label: 'condition nums[i] >= target', value: nums.map(x => (x >= target ? 'T' : 'F')).join(' ') + '   (pehla T = answer)' }];
      };
      const vb = () => ({ nums: A, target: String(target), lo: String(lo), hi: String(hi) });
      s(L(35, 1, 'int lo = 0'), 'lo = 0, hi = n = ' + n + ' (hi = n kyunki end me insert bhi possible hai)', { views: V(), vars: vb() });
      while (true) {
        const ok = lo < hi;
        s(L(35, 1, 'while (lo < hi)'), 'lo (' + lo + ') < hi (' + hi + ') ? ' + ok, { views: V(), vars: vb() });
        if (!ok) break;
        const mid = lo + Math.floor((hi - lo) / 2);
        s(L(35, 1, 'int mid'), 'mid = ' + mid + ', nums[mid] = ' + nums[mid], { views: V(mid), vars: Object.assign(vb(), { mid: String(mid) }) });
        if (nums[mid] < target) {
          lo = mid + 1;
          s(L(35, 1, 'lo = mid + 1'), nums[mid] + ' < ' + target + ' → mid F hai, answer right me. lo = ' + lo, { views: V(), vars: Object.assign(vb(), { mid: String(mid) }) });
        } else {
          hi = mid;
          s(L(35, 1, 'hi = mid'), nums[mid] + ' >= ' + target + ' → mid T hai, mid khud answer ho sakta hai. hi = mid = ' + hi, { views: V(), vars: Object.assign(vb(), { mid: String(mid) }) });
        }
      }
      s(L(35, 1, 'return lo'), 'lo == hi == ' + lo + ' → insert position ' + lo, { views: V(null, { [lo]: 'found' }), vars: vb(), ret: String(lo) });
      return steps;
    },
  };

  // ---------------- LC 69 ----------------
  VIZ.defs[69] = {
    title: 'Sqrt(x) — Binary Search on Answer', ap: 1,
    inputs: [{ key: 'x', label: 'x', def: '8', type: 'num' }],
    run({ x }) {
      const { steps, s } = rec();
      let lo = 0, hi = x, ans = 0;
      const V = (mid, extra) => [ansView(0, x, lo, hi, mid, 'answer range 0..x'), { type: 'text', label: 'check', value: extra || ('ans = ' + ans + ' (ab tak ka best)') }];
      const vb = () => ({ x: String(x), lo: String(lo), hi: String(hi), ans: String(ans) });
      s(L(69, 1, 'int lo = 0'), 'Answer 0..x me hai: lo = 0, hi = ' + x + ', ans = 0', { views: V(), vars: vb() });
      while (true) {
        const ok = lo <= hi;
        s(L(69, 1, 'while (lo <= hi)'), 'lo (' + lo + ') <= hi (' + hi + ') ? ' + ok, { views: V(), vars: vb() });
        if (!ok) break;
        const mid = lo + Math.floor((hi - lo) / 2), sq = mid * mid;
        const vm = () => Object.assign(vb(), { mid: String(mid) });
        s(L(69, 1, 'int mid'), 'mid = ' + mid, { views: V(mid), vars: vm() });
        const fits = sq <= x;
        s(L(69, 1, '(long) mid * mid'), '(long) ' + mid + ' × ' + mid + ' = ' + sq + (fits ? ' <= ' : ' > ') + x + ' → ' + fits, { views: V(mid, mid + '² = ' + sq + (fits ? ' <= ' : ' > ') + x), vars: vm() });
        if (fits) {
          ans = mid;
          s(L(69, 1, 'ans = mid'), 'mid valid candidate → ans = ' + ans, { views: V(mid), vars: vm() });
          lo = mid + 1;
          s(L(69, 1, 'lo = mid + 1'), 'Shayad aur bada bhi chale → lo = ' + lo, { views: V(), vars: vm() });
        } else {
          hi = mid - 1;
          s(L(69, 1, 'hi = mid - 1'), 'Bahut bada → hi = ' + hi, { views: V(), vars: vm() });
        }
      }
      const fv = ansView(0, x, lo, hi, null, 'answer range 0..x', ans);
      s(L(69, 1, 'return ans'), 'lo > hi → return ans = ' + ans, { views: [fv], vars: vb(), ret: String(ans) });
      return steps;
    },
  };

  // ---------------- LC 153 ----------------
  VIZ.defs[153] = {
    title: 'Find Minimum in Rotated Sorted Array', ap: 1,
    inputs: [{ key: 'nums', label: 'nums (rotated sorted, unique)', def: '4, 5, 6, 7, 0, 1, 2' }],
    run({ nums }) {
      const { steps, s } = rec(), n = nums.length, A = arrStr(nums);
      let lo = 0, hi = n - 1;
      const V = (mid, hl) => [bsView(nums, lo, hi, mid, { hl })];
      const vb = () => ({ nums: A, lo: String(lo), hi: String(hi) });
      s(L(153, 1, 'int lo = 0'), 'lo = 0, hi = ' + (n - 1), { views: V(), vars: vb() });
      while (true) {
        const ok = lo < hi;
        s(L(153, 1, 'while (lo < hi)'), 'lo (' + lo + ') < hi (' + hi + ') ? ' + ok, { views: V(), vars: vb() });
        if (!ok) break;
        const mid = lo + Math.floor((hi - lo) / 2);
        s(L(153, 1, 'int mid'), 'mid = ' + mid + ', nums[mid] = ' + nums[mid] + ', nums[hi] = ' + nums[hi], { views: V(mid, { [hi]: 'new' }), vars: Object.assign(vb(), { mid: String(mid) }) });
        if (nums[mid] > nums[hi]) {
          lo = mid + 1;
          s(L(153, 1, 'lo = mid + 1'), nums[mid] + ' > ' + nums[hi] + ' → drop mid ke right me hai, min right me. lo = ' + lo, { views: V(), vars: Object.assign(vb(), { mid: String(mid) }) });
        } else {
          hi = mid;
          s(L(153, 1, 'hi = mid'), nums[mid] + ' <= ' + nums[hi] + ' → mid..hi sorted, min mid ya left me. hi = ' + hi, { views: V(), vars: Object.assign(vb(), { mid: String(mid) }) });
        }
      }
      s(L(153, 1, 'return nums[lo]'), 'lo == hi == ' + lo + ' → minimum = nums[' + lo + '] = ' + nums[lo], { views: V(null, { [lo]: 'found' }), vars: vb(), ret: String(nums[lo]) });
      return steps;
    },
  };

  // ---------------- LC 33 ----------------
  VIZ.defs[33] = {
    title: 'Search in Rotated Sorted Array (One Pass)', label: 'One pass', ap: 2,
    inputs: [{ key: 'nums', label: 'nums (rotated sorted, unique)', def: '4, 5, 6, 7, 0, 1, 2' }, { key: 'target', label: 'target', def: '0', type: 'num' }],
    run({ nums, target }) {
      const { steps, s } = rec(), n = nums.length, A = arrStr(nums);
      let lo = 0, hi = n - 1;
      const V = (mid, hl, sortedA, sortedB) => {
        const v = bsView(nums, lo, hi, mid, { hl });
        if (sortedA !== undefined) for (let i = sortedA; i <= sortedB; i++) if (v.hl[i] === 'win') v.hl[i] = 'done';
        return [v];
      };
      const vb = () => ({ nums: A, target: String(target), lo: String(lo), hi: String(hi) });
      s(L(33, 2, 'int lo = 0'), 'lo = 0, hi = ' + (n - 1), { views: V(), vars: vb() });
      while (true) {
        const ok = lo <= hi;
        s(L(33, 2, 'while (lo <= hi)'), 'lo (' + lo + ') <= hi (' + hi + ') ? ' + ok, { views: V(), vars: vb() });
        if (!ok) break;
        const mid = lo + Math.floor((hi - lo) / 2);
        const vm = () => Object.assign(vb(), { mid: String(mid) });
        s(L(33, 2, 'int mid'), 'mid = ' + mid + ', nums[mid] = ' + nums[mid], { views: V(mid), vars: vm() });
        if (nums[mid] === target) {
          s(L(33, 2, 'return mid'), 'nums[mid] == target → return ' + mid, { views: V(mid, { [mid]: 'found' }), vars: vm(), ret: String(mid) });
          return steps;
        }
        if (nums[lo] <= nums[mid]) {
          s(L(33, 2, 'if (nums[lo] <= nums[mid])'), 'nums[lo] (' + nums[lo] + ') <= nums[mid] (' + nums[mid] + ') → LEFT half [' + lo + '..' + mid + '] sorted hai (green)', { views: V(mid, {}, lo, mid - 1), vars: vm() });
          if (target >= nums[lo] && target < nums[mid]) {
            hi = mid - 1;
            s(L(33, 2, 'hi = mid - 1', 1), target + ' range [' + nums[lo] + ', ' + nums[mid] + ') me hai → left jao, hi = ' + hi, { views: V(), vars: vm() });
          } else {
            const a = nums[lo], b = nums[mid];
            lo = mid + 1;
            s(L(33, 2, 'else lo = mid + 1'), target + ' range [' + a + ', ' + b + ') me nahi → right jao, lo = ' + lo, { views: V(), vars: vm() });
          }
        } else {
          s(L(33, 2, '} else {'), 'nums[lo] (' + nums[lo] + ') > nums[mid] (' + nums[mid] + ') → RIGHT half [' + mid + '..' + hi + '] sorted hai (green)', { views: V(mid, {}, mid + 1, hi), vars: vm() });
          if (target > nums[mid] && target <= nums[hi]) {
            lo = mid + 1;
            s(L(33, 2, 'lo = mid + 1', 2), target + ' range (' + nums[mid] + ', ' + nums[hi] + '] me hai → right jao, lo = ' + lo, { views: V(), vars: vm() });
          } else {
            hi = mid - 1;
            s(L(33, 2, 'else hi = mid - 1'), target + ' right sorted range me nahi → left jao, hi = ' + hi, { views: V(), vars: vm() });
          }
        }
      }
      s(L(33, 2, 'return -1'), 'lo > hi → target nahi mila → return -1', { views: V(), vars: vb(), ret: '-1' });
      return steps;
    },
    variants: [{
      label: 'Pivot + BS', title: 'Search in Rotated Array (Pivot + Binary Search)', ap: 1,
      run({ nums, target }) {
        const { steps, s } = rec(), n = nums.length, A = arrStr(nums);
        let lo = 0, hi = n - 1, pivot = null;
        const V = (mid, hl) => {
          const v = [bsView(nums, lo, hi, mid, { hl })];
          if (pivot !== null) v.push({ type: 'text', label: 'pivot (min index)', value: 'pivot = ' + pivot + ' → sorted parts: [0..' + (pivot - 1) + '] aur [' + pivot + '..' + (n - 1) + ']' });
          return v;
        };
        const vb = () => Object.assign({ nums: A, target: String(target), n: String(n), lo: String(lo), hi: String(hi) }, pivot !== null ? { pivot: String(pivot) } : {});
        s(L(33, 1, 'int n = nums.length'), 'Phase 1: pivot (minimum ka index) dhundo — LC 153 wala loop', { views: V(), vars: vb() });
        while (lo < hi) {
          const mid = lo + Math.floor((hi - lo) / 2);
          s(L(33, 1, 'int mid', 1), 'mid = ' + mid + ': nums[mid] = ' + nums[mid] + ' vs nums[hi] = ' + nums[hi], { views: V(mid), vars: Object.assign(vb(), { mid: String(mid) }) });
          if (nums[mid] > nums[hi]) { lo = mid + 1; s(L(33, 1, 'if (nums[mid] > nums[hi]) lo'), 'bada → lo = ' + lo, { views: V(), vars: vb() }); }
          else { hi = mid; s(L(33, 1, 'else hi = mid'), 'chhota/barabar → hi = ' + hi, { views: V(), vars: vb() }); }
        }
        pivot = lo;
        s(L(33, 1, 'int pivot = lo'), 'pivot = ' + pivot + ' (nums[pivot] = ' + nums[pivot] + ' = minimum)', { views: V(null, { [pivot]: 'new' }), vars: vb() });
        if (target >= nums[pivot] && target <= nums[n - 1]) {
          lo = pivot; hi = n - 1;
          s(L(33, 1, 'lo = pivot; hi = n - 1'), target + ' range [' + nums[pivot] + ', ' + nums[n - 1] + '] me → right part [' + lo + '..' + hi + '] me search', { views: V(), vars: vb() });
        } else {
          lo = 0; hi = pivot - 1;
          s(L(33, 1, 'lo = 0; hi = pivot - 1'), target + ' right part me nahi → left part [0..' + hi + '] me search', { views: V(), vars: vb() });
        }
        while (lo <= hi) {
          const mid = lo + Math.floor((hi - lo) / 2);
          s(L(33, 1, 'int mid', 2), 'Phase 2 (normal BS): mid = ' + mid + ', nums[mid] = ' + nums[mid], { views: V(mid), vars: Object.assign(vb(), { mid: String(mid) }) });
          if (nums[mid] === target) {
            s(L(33, 1, 'return mid'), 'Match → return ' + mid, { views: V(mid, { [mid]: 'found' }), vars: Object.assign(vb(), { mid: String(mid) }), ret: String(mid) });
            return steps;
          }
          if (nums[mid] < target) { lo = mid + 1; s(L(33, 1, 'if (nums[mid] < target) lo'), nums[mid] + ' < ' + target + ' → lo = ' + lo, { views: V(), vars: vb() }); }
          else { hi = mid - 1; s(L(33, 1, 'else hi = mid - 1'), nums[mid] + ' > ' + target + ' → hi = ' + hi, { views: V(), vars: vb() }); }
        }
        s(L(33, 1, 'return -1'), 'Nahi mila → return -1', { views: V(), vars: vb(), ret: '-1' });
        return steps;
      },
    }],
  };

  // ---------------- answer-space helper (875 / 1011 / 410) ----------------
  // cfg: { n, ap, arr, arrName, lo0, hi0, rangeLabel, mainName, checkName, checkArgs(mid), check(mid, push) }
  function answerSearch(cfg, steps, s, mainFrame) {
    let lo = cfg.lo0, hi = cfg.hi0;
    const RV = (mid, found) => ansView(cfg.lo0, cfg.hi0, lo, hi, mid, cfg.rangeLabel, found);
    const vb = extra => Object.assign({}, cfg.baseVars, { lo: String(lo), hi: String(hi) }, extra || {});
    while (true) {
      const ok = lo < hi;
      s(L(cfg.n, cfg.ap, 'while (lo < hi)'), 'lo (' + lo + ') < hi (' + hi + ') ? ' + ok, { views: [RV(), cfg.arrView()], vars: vb() });
      if (!ok) break;
      const mid = lo + Math.floor((hi - lo) / 2);
      s(L(cfg.n, cfg.ap, 'int mid'), 'mid = ' + lo + ' + (' + hi + ' − ' + lo + ') / 2 = ' + mid + ' → kya ' + cfg.what + ' = ' + mid + ' se kaam ho jaayega?', { views: [RV(mid), cfg.arrView()], vars: vb({ mid: String(mid) }) });
      const callLine = L(cfg.n, cfg.ap, cfg.checkName + '(');
      const res = cfg.check(mid, (line, note, arrView, cvars, textVal) => {
        s(line, note, {
          views: [RV(mid), arrView, { type: 'text', label: cfg.checkName + '(' + mid + ')', value: textVal }],
          frames: [{ method: cfg.checkName, args: cfg.checkArgs(mid), line, vars: cvars }, { method: cfg.mainName, args: '', line: callLine, vars: vb({ mid: String(mid) }) }],
        });
      });
      if (res.ok) {
        hi = mid;
        s(L(cfg.n, cfg.ap, 'hi = mid'), res.msg + ' → feasible ✓. Shayad chhota bhi chale: hi = mid = ' + hi + ' (right part phenka)', { views: [RV(), cfg.arrView()], vars: vb({ mid: String(mid) }) });
      } else {
        lo = mid + 1;
        s(L(cfg.n, cfg.ap, 'else lo = mid + 1'), res.msg + ' → feasible ✗. Bada chahiye: lo = mid + 1 = ' + lo + ' (left part phenka)', { views: [RV(), cfg.arrView()], vars: vb({ mid: String(mid) }) });
      }
    }
    s(L(cfg.n, cfg.ap, 'return lo'), 'lo == hi == ' + lo + ' → minimum feasible ' + cfg.what + ' = ' + lo, { views: [RV(null, lo), cfg.arrView()], vars: vb(), ret: String(lo) });
    void mainFrame;
    return steps;
  }

  // ---------------- LC 875 ----------------
  VIZ.defs[875] = {
    title: 'Koko Eating Bananas (Binary Search on Answer)', ap: 1,
    inputs: [{ key: 'piles', label: 'piles', def: '3, 6, 7, 11' }, { key: 'h', label: 'h (hours)', def: '8', type: 'num' }],
    run({ piles, h }) {
      const { steps, s } = rec(), A = arrStr(piles), n = piles.length;
      const pv = (hl, ptr) => ({ type: 'array', label: 'piles', vals: piles, hl: hl || {}, ptr: ptr || [] });
      let hi = 0;
      s(L(875, 1, 'int lo = 1'), 'Speed kam se kam 1. hi = max(piles) nikalna hai.', { views: [pv()], vars: { piles: A, h: String(h), lo: '1', hi: '0' } });
      piles.forEach((p, i) => { hi = Math.max(hi, p); });
      const mi = piles.indexOf(hi);
      s(L(875, 1, 'hi = Math.max'), 'hi = max(piles) = ' + hi + ' (isse zyada speed ka koi fayda nahi — har pile 1 ghanta)', { views: [pv({ [mi]: 'found' }, [{ i: mi, label: 'max' }])], vars: { piles: A, h: String(h), lo: '1', hi: String(hi) } });
      return answerSearch({
        n: 875, ap: 1, lo0: 1, hi0: hi, rangeLabel: 'speed k', what: 'speed k', mainName: 'minEatingSpeed', checkName: 'canFinish',
        baseVars: { piles: A, h: String(h) }, arrView: () => pv(),
        checkArgs: k => 'h=' + h + ', k=' + k,
        check(k, push) {
          let hours = 0;
          const detail = n <= 15;
          if (detail) push(L(875, 1, 'long hours = 0'), 'canFinish(k = ' + k + '): hours = 0', pv(), { piles: A, h: String(h), k: String(k), hours: '0' }, 'hours = 0');
          piles.forEach((p, i) => {
            const t = Math.floor((p - 1) / k) + 1;
            hours += t;
            if (detail) push(L(875, 1, 'hours += (p - 1) / k + 1'), 'pile ' + p + ' → ceil(' + p + '/' + k + ') = ' + t + ' ghante. hours = ' + hours, pv(range(0, i - 1, 'done', { [i]: 'cur' }), [{ i, label: 'p' }]), { piles: A, h: String(h), k: String(k), p: String(p), hours: String(hours) }, 'hours = ' + hours + ' (limit h = ' + h + ')');
          });
          const ok = hours <= h;
          push(L(875, 1, 'return hours <= h'), 'total hours = ' + hours + (ok ? ' <= ' : ' > ') + h + ' → return ' + ok, pv(range(0, n - 1, ok ? 'found' : 'skip')), { piles: A, h: String(h), k: String(k), hours: String(hours) }, 'hours = ' + hours + (ok ? ' <= ' : ' > ') + h + ' → ' + ok);
          return { ok, msg: 'k = ' + k + ': ' + hours + ' ghante' };
        },
      }, steps, s);
    },
  };

  // greedy partition check (1011 / 410 dono me same): view me har group alag colour
  function greedyCheck(n, ap, arr, cap, limit, push, names) {
    let need = 1, load = 0, start = 0;
    const A = arrStr(arr), detail = arr.length <= 15;
    const groups = [];
    const view = (i, hlCur) => {
      const hl = {};
      groups.forEach(([a, b]) => { for (let j = a; j <= b; j++) hl[j] = 'done'; });
      for (let j = start; j < i; j++) hl[j] = 'win';
      if (hlCur !== undefined) hl[i] = hlCur;
      return { type: 'array', label: names.arr + ' (done = pichle ' + names.unit + ', win = current ' + names.unit + ')', vals: arr, hl, ptr: i < arr.length ? [{ i, label: names.x }] : [] };
    };
    const cv = extra => Object.assign({ [names.arr]: A, cap: String(cap), [names.count]: String(need), [names.load]: String(load) }, extra || {});
    const txt = () => groups.concat([[start, -1]]).map(([a, b]) => '[' + arr.slice(a, b === -1 ? undefined : b + 1).join(',') + ']').join(' ') + '  → ' + names.count + ' = ' + need;
    if (detail) push(L(n, ap, 'int ' + names.count + ' = 1'), names.checkName + '(cap = ' + cap + '): ' + names.count + ' = 1, ' + names.load + ' = 0', view(0), cv(), txt());
    arr.forEach((w, i) => {
      if (load + w > cap) {
        if (detail) push(L(n, ap, 'if (' + names.load + ' + ' + names.x + ' > cap)'), names.load + ' ' + load + ' + ' + w + ' = ' + (load + w) + ' > ' + cap + ' → naya ' + names.unit, view(i, 'skip'), cv({ [names.x]: String(w) }), txt());
        groups.push([start, i - 1]); start = i; need++; load = 0;
        if (detail) push(L(n, ap, names.count + '++'), names.count + '++ → ' + need + ', ' + names.load + ' = 0', view(i, 'cur'), cv({ [names.x]: String(w) }), txt());
      }
      load += w;
      if (detail) push(L(n, ap, names.load + ' += ' + names.x), names.x + ' = ' + w + ' current ' + names.unit + ' me → ' + names.load + ' = ' + load, view(i + 1), cv({ [names.x]: String(w) }), txt());
    });
    groups.push([start, arr.length - 1]); start = arr.length;
    const ok = need <= limit;
    push(L(n, ap, names.retFrag), names.count + ' = ' + need + (ok ? ' <= ' : ' > ') + limit + ' → ' + (names.retBool ? 'return ' + ok : 'return ' + need), view(arr.length), cv(), txt().replace(/ \[\]/, '') + (ok ? ' <= ' : ' > ') + limit);
    return { ok, need };
  }

  // ---------------- LC 1011 ----------------
  VIZ.defs[1011] = {
    title: 'Ship Within D Days (Binary Search on Answer)', ap: 1,
    inputs: [{ key: 'weights', label: 'weights', def: '3, 2, 2, 4, 1, 4' }, { key: 'days', label: 'days', def: '3', type: 'num' }],
    run({ weights, days }) {
      const { steps, s } = rec(), A = arrStr(weights);
      const wv = () => ({ type: 'array', label: 'weights', vals: weights, hl: {}, ptr: [] });
      let lo = 0, hi = 0;
      s(L(1011, 1, 'int lo = 0, hi = 0'), 'lo = max weight, hi = total weight nikalenge', { views: [wv()], vars: { weights: A, days: String(days), lo: '0', hi: '0' } });
      weights.forEach(w => { lo = Math.max(lo, w); hi += w; });
      s(L(1011, 1, 'hi += w'), 'lo = max = ' + lo + ' (sabse bhaari package toh jaana hi hai), hi = sum = ' + hi + ' (ek din me sab)', { views: [wv()], vars: { weights: A, days: String(days), lo: String(lo), hi: String(hi) } });
      return answerSearch({
        n: 1011, ap: 1, lo0: lo, hi0: hi, rangeLabel: 'capacity', what: 'capacity', mainName: 'shipWithinDays', checkName: 'daysNeeded',
        baseVars: { weights: A, days: String(days) }, arrView: wv,
        checkArgs: c => 'cap=' + c,
        check(cap, push) {
          const r = greedyCheck(1011, 1, weights, cap, days, push, { arr: 'weights', x: 'w', count: 'need', load: 'load', unit: 'din', checkName: 'daysNeeded', retFrag: 'return need', retBool: false });
          return { ok: r.ok, msg: 'cap = ' + cap + ': ' + r.need + ' din (limit ' + days + ')' };
        },
      }, steps, s);
    },
  };

  // ---------------- LC 410 ----------------
  VIZ.defs[410] = {
    title: 'Split Array Largest Sum (Binary Search on Answer)', label: 'Binary Search', ap: 2,
    inputs: [{ key: 'nums', label: 'nums', def: '7, 2, 5, 10, 8' }, { key: 'k', label: 'k (parts)', def: '2', type: 'num' }],
    run({ nums, k }) {
      const { steps, s } = rec(), A = arrStr(nums);
      const nv = () => ({ type: 'array', label: 'nums', vals: nums, hl: {}, ptr: [] });
      let lo = 0, hi = 0;
      s(L(410, 2, 'int lo = 0, hi = 0'), 'Largest sum kam se kam max element, zyada se zyada total sum', { views: [nv()], vars: { nums: A, k: String(k), lo: '0', hi: '0' } });
      nums.forEach(x => { lo = Math.max(lo, x); hi += x; });
      s(L(410, 2, 'hi += x'), 'lo = max = ' + lo + ' (k = n case), hi = sum = ' + hi + ' (k = 1 case)', { views: [nv()], vars: { nums: A, k: String(k), lo: String(lo), hi: String(hi) } });
      return answerSearch({
        n: 410, ap: 2, lo0: lo, hi0: hi, rangeLabel: 'largest sum cap', what: 'largest sum', mainName: 'splitArray', checkName: 'canSplit',
        baseVars: { nums: A, k: String(k) }, arrView: nv,
        checkArgs: c => 'k=' + k + ', cap=' + c,
        check(cap, push) {
          const r = greedyCheck(410, 2, nums, cap, k, push, { arr: 'nums', x: 'x', count: 'parts', load: 'sum', unit: 'part', checkName: 'canSplit', retFrag: 'return parts <= k', retBool: true });
          return { ok: r.ok, msg: 'cap = ' + cap + ': ' + r.need + ' parts (limit k = ' + k + ')' };
        },
      }, steps, s);
    },
    variants: [{
      label: 'DP', title: 'Split Array Largest Sum (DP table)', ap: 1,
      run({ nums, k }) {
        const { steps, s } = rec(), n = nums.length, A = arrStr(nums), INF = '∞';
        const pre = [0];
        nums.forEach((x, i) => pre.push(pre[i] + x));
        const dp = [];
        for (let i = 0; i <= n; i++) dp.push(Array(k + 1).fill(Infinity));
        const tv = hl => ({ type: 'table', label: 'dp[i][j] = pehle i elements, j parts → min largest sum', rows: dp.map(r => r.map(v => (v === Infinity ? INF : v))), rowLabels: dp.map((_, i) => 'i=' + i), colLabels: dp[0].map((_, j) => 'j=' + j), hl: hl || {} });
        const pv = () => ({ type: 'array', label: 'pre (prefix sums)', vals: pre, hl: {}, ptr: [] });
        s(L(410, 1, 'pre[i + 1] = pre[i] + nums[i]'), 'Prefix sums: pre = [' + pre.join(', ') + '] → sum(p..i−1) = pre[i] − pre[p]', { views: [{ type: 'array', label: 'nums', vals: nums }, pv()], vars: { nums: A, k: String(k), n: String(n) } });
        dp[0][0] = 0;
        s(L(410, 1, 'dp[0][0] = 0'), 'Sab ∞, sirf dp[0][0] = 0 (0 elements, 0 parts)', { views: [tv({ '0,0': 'new' }), pv()], vars: { nums: A, k: String(k), n: String(n) } });
        for (let i = 1; i <= n; i++) {
          for (let j = 1; j <= Math.min(i, k); j++) {
            let best = Infinity, bp = -1;
            for (let p = j - 1; p < i; p++) {
              if (dp[p][j - 1] === Infinity) continue;
              const cand = Math.max(dp[p][j - 1], pre[i] - pre[p]);
              if (cand < best) { best = cand; bp = p; }
            }
            dp[i][j] = best;
            const hl = { [i + ',' + j]: 'new' };
            if (bp >= 0) hl[bp + ',' + (j - 1)] = 'win';
            s(L(410, 1, 'dp[i][j] = Math.min'), 'dp[' + i + '][' + j + '] = ' + best + ' — best last part = nums[' + bp + '..' + (i - 1) + '] (sum ' + (pre[i] - pre[bp]) + '), pehle ' + bp + ' elements ' + (j - 1) + ' parts me = ' + dp[bp][j - 1], { views: [tv(hl), pv()], vars: { nums: A, k: String(k), n: String(n), i: String(i), j: String(j), 'dp[i][j]': String(best) } });
          }
        }
        s(L(410, 1, 'return (int) dp[n][k]'), 'Answer = dp[' + n + '][' + k + '] = ' + dp[n][k], { views: [tv({ [n + ',' + k]: 'found' }), pv()], vars: { nums: A, k: String(k), n: String(n) }, ret: String(dp[n][k]) });
        return steps;
      },
    }],
  };
})();
