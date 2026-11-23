// Phase 1 (Arrays) — extra visualizers: LC 1295, LC 303 (Week 1 rewrite, 2026-11-07).
// Line numbers code se snippet dhoondh ke nikalte hain (code badle toh bhi sahi line highlight ho).
(function () {
  const { recorder, range, fmt } = VIZ.util;
  const Q = n => window.PHASE_CONTENT['arrays'].questions[n];
  // L(n, ap)(snippet, k) → snippet ki k-th occurrence wali 1-based line
  const L = (n, ap) => {
    const code = Q(n).approaches[ap].code.split('\n');
    return (snip, k) => {
      let c = k || 1;
      for (let i = 0; i < code.length; i++) if (code[i].includes(snip) && --c === 0) return i + 1;
      throw new Error('line nahi mili: ' + snip);
    };
  };

  // ================= LC 1295 =================
  VIZ.defs[1295] = {
    title: 'Find Numbers with Even Number of Digits (digit count /10)',
    ap: 1,
    inputs: [{ key: 'nums', label: 'nums (sab ≥ 1)', def: '12, 345, 2, 6, 7896' }],
    check: ({ nums }) => nums.every(v => v >= 1 && Number.isInteger(v)) ? '' : 'Har number ≥ 1 (positive integer) hona chahiye.',
    run({ nums }) {
      const ln = L(1295, 1);
      let count = 0;
      const evenHl = {};
      const { steps, s } = recorder(() => ({ arr: nums }));
      s(ln('int count = 0'), 'count = 0', { vars: { count } });
      nums.forEach((orig, i) => {
        let x = orig, digits = 0;
        const hl = () => Object.assign({}, evenHl, { [i]: 'cur' });
        s(ln('for (int x : nums)'), `x = nums[${i}] = ${orig}`, { vars: { count, x }, ptr: [{ i, label: 'x' }], hl: hl() });
        s(ln('int digits = 0'), 'digits = 0', { vars: { count, x, digits }, ptr: [{ i, label: 'x' }], hl: hl() });
        while (x > 0) {
          s(ln('while (x > 0)'), `x = ${x} > 0 → ek digit aur`, { vars: { count, x, digits }, ptr: [{ i, label: 'x' }], hl: hl() });
          digits++;
          s(ln('digits++'), `digits = ${digits}`, { vars: { count, x, digits }, ptr: [{ i, label: 'x' }], hl: hl() });
          const old = x;
          x = Math.floor(x / 10);
          s(ln('x /= 10'), `x = ${old} / 10 = ${x} (last digit hata)`, { vars: { count, x, digits }, ptr: [{ i, label: 'x' }], hl: hl() });
        }
        s(ln('while (x > 0)'), 'x = 0 → loop khatam', { vars: { count, x, digits }, ptr: [{ i, label: 'x' }], hl: hl() });
        if (digits % 2 === 0) {
          count++;
          evenHl[i] = 'found';
          s(ln('if (digits % 2 == 0)'), `${orig} ke ${digits} digits → even → count = ${count}`, { vars: { count, x, digits }, ptr: [{ i, label: 'x' }], hl: Object.assign({}, evenHl) });
        } else {
          evenHl[i] = 'skip';
          s(ln('if (digits % 2 == 0)'), `${orig} ke ${digits} digits → odd → skip`, { vars: { count, x, digits }, ptr: [{ i, label: 'x' }], hl: Object.assign({}, evenHl) });
        }
      });
      s(ln('return count'), `return ${count}`, { vars: { count }, hl: Object.assign({}, evenHl), ret: String(count) });
      return steps;
    },
  };

  // ================= LC 268 =================
  const check268 = ({ nums }) => {
    const n = nums.length, seen = new Set(nums);
    return nums.every(v => Number.isInteger(v) && v >= 0 && v <= n) && seen.size === n ? '' : 'n alag numbers chahiye, har ek 0..n ke beech.';
  };
  const bin = v => (v >>> 0).toString(2).slice(-6).padStart(4, '0');
  VIZ.defs[268] = {
    title: 'Missing Number (XOR)', label: 'XOR',
    ap: 2,
    inputs: [{ key: 'nums', label: 'nums (0..n, ek missing)', def: '3, 0, 1' }],
    check: check268,
    run({ nums }) {
      const ln = L(268, 2), n = nums.length;
      let xor = n;
      const done = {};
      const { steps, s } = recorder(() => ({ arr: nums }));
      s(ln('int n = nums.length'), `n = ${n} (range 0..${n})`, { vars: { n } });
      s(ln('int xor = n'), `xor = n = ${n} (binary ${bin(xor)}) — index loop sirf 0..n−1 tak jaata hai, isliye n pehle hi daal diya`, { vars: { n, xor } });
      for (let i = 0; i < n; i++) {
        s(ln('for (int i = 0'), `i = ${i}`, { vars: { n, i, xor }, ptr: [{ i, label: 'i' }], hl: Object.assign({}, done, { [i]: 'cur' }) });
        const before = xor;
        xor = xor ^ i ^ nums[i];
        done[i] = 'done';
        s(ln('xor ^= i ^ nums[i]'), `xor = ${before} ^ ${i} ^ ${nums[i]} = ${xor} (binary ${bin(xor)}) — jo number index aur value dono me hai, woh cancel (a ^ a = 0)`, { vars: { n, i, xor }, ptr: [{ i, label: 'i' }], hl: Object.assign({}, done, { [i]: 'new' }) });
      }
      s(ln('return xor'), `return ${xor} — sirf missing number bina jode ke bacha`, { vars: { n, xor }, ret: String(xor) });
      return steps;
    },
    variants: [{
      label: 'Sum formula', title: 'Missing Number (Sum formula)', ap: 1,
      run({ nums }) {
        const ln = L(268, 1), n = nums.length, expected = n * (n + 1) / 2;
        let actual = 0;
        const done = {};
        const { steps, s } = recorder(() => ({ arr: nums }));
        s(ln('int n = nums.length'), `n = ${n}`, { vars: { n } });
        s(ln('int expected'), `expected = ${n} × ${n + 1} / 2 = ${expected} (0..${n} ka sum)`, { vars: { n, expected } });
        s(ln('int actual = 0'), 'actual = 0', { vars: { n, expected, actual } });
        nums.forEach((x, i) => {
          actual += x;
          done[i] = 'done';
          s(ln('for (int x : nums)'), `actual += ${x} → ${actual}`, { vars: { n, expected, actual, x }, ptr: [{ i, label: 'x' }], hl: Object.assign({}, done, { [i]: 'new' }) });
        });
        s(ln('return expected - actual'), `return ${expected} − ${actual} = ${expected - actual}`, { vars: { n, expected, actual }, ret: String(expected - actual) });
        return steps;
      },
    }],
  };

  // ================= LC 303 =================
  VIZ.defs[303] = {
    title: 'Range Sum Query — Immutable (prefix size n+1)',
    ap: 1,
    inputs: [
      { key: 'nums', label: 'nums', def: '-2, 0, 3, -5, 2, -1' },
      { key: 'queries', label: 'queries [[left,right], …]', type: 'json', def: '[[0,2],[2,5],[0,5]]' },
    ],
    check: ({ nums, queries }) => Array.isArray(queries) && queries.every(q => Array.isArray(q) && q.length === 2 && q[0] >= 0 && q[0] <= q[1] && q[1] < nums.length) ? '' : 'Har query [left, right] ho, 0 ≤ left ≤ right < nums.length.',
    run({ nums, queries }) {
      const ln = L(303, 1), n = nums.length;
      const prefix = new Array(n + 1).fill('');
      const out = ['null'];
      const rec = recorder(() => ({ arr: nums, row2: { label: 'prefix (size n+1)', vals: prefix.slice(), hl: {} } })), steps = rec.steps;
      // Call stack me sahi method dikhao: constructor (NumArray) vs sumRange
      let inQuery = false;
      const s = (line, note, extra) => {
        const e = extra || {};
        const vars = Object.assign({ nums: 'int[' + n + '] ' + fmt(nums), prefix: 'int[' + (n + 1) + '] [' + prefix.join(', ') + ']' }, e.vars || {});
        rec.s(line, note, Object.assign({}, e, { frames: [{ method: inQuery ? 'sumRange' : 'NumArray', args: inQuery ? 'left, right' : 'nums', vars }] }));
      };
      prefix[0] = 0;
      s(ln('prefix = new int[nums.length + 1]'), `prefix = new int[${n + 1}] — prefix[0] = 0 (khaali prefix ka sum)`, { vars: { n }, row2: { label: 'prefix (size n+1)', vals: prefix.slice(), hl: { 0: 'new' } } });
      for (let i = 0; i < n; i++) {
        s(ln('for (int i = 0'), `i = ${i}`, { vars: { i }, ptr: [{ i, label: 'i' }], hl: { [i]: 'cur' }, row2: { label: 'prefix (size n+1)', vals: prefix.slice(), hl: { [i]: 'cur' } } });
        prefix[i + 1] = prefix[i] + nums[i];
        s(ln('prefix[i + 1] = prefix[i] + nums[i]'), `prefix[${i + 1}] = prefix[${i}] (${prefix[i]}) + nums[${i}] (${nums[i]}) = ${prefix[i + 1]}`, { vars: { i }, ptr: [{ i, label: 'i' }], hl: { [i]: 'cur' }, row2: { label: 'prefix (size n+1)', vals: prefix.slice(), hl: { [i]: 'cur', [i + 1]: 'new' } } });
      }
      inQuery = true;
      queries.forEach(([l, r]) => {
        const ans = prefix[r + 1] - prefix[l];
        out.push(String(ans));
        s(ln('public int sumRange'), `sumRange(${l}, ${r}) call`, { vars: { left: l, right: r }, hl: range(l, r, 'cur'), row2: { label: 'prefix (size n+1)', vals: prefix.slice(), hl: {} } });
        s(ln('return prefix[right + 1] - prefix[left]'), `prefix[${r + 1}] − prefix[${l}] = ${prefix[r + 1]} − (${prefix[l]}) = ${ans}  (nums[${l}..${r}] ka sum, O(1))`,
          { vars: { left: l, right: r, result: ans }, hl: range(l, r, 'found'), row2: { label: 'prefix (size n+1)', vals: prefix.slice(), hl: { [r + 1]: 'win', [l]: 'skip' } } });
      });
      s(ln('return prefix[right + 1] - prefix[left]'), `Saare outputs: ${fmt(out)} (constructor → null)`, { vars: {}, row2: { label: 'prefix (size n+1)', vals: prefix.slice(), hl: {} }, ret: fmt(out) });
      return steps;
    },
  };
})();
