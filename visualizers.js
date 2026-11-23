// Code-trace visualizers. Har visualizer ek LeetCode question ke Java code ko line-by-line chalata hai.
// defs[lc].run(input) steps deta hai. Ek step:
// { line, note, arr, hl: {index: cls}, ptr: [{i, label}], row2: {label, vals, hl},
//   vars: {local: value}, map: {k: v} | set: [..], heapHl, ret }
// `line` = PHASE_CONTENT me us question ke code (approach `ap`, default Optimal) ki line number (1-based).
// Code badlo toh line numbers bhi yahan update karo.
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const parseArr = s => String(s).split(/[\s,]+/).filter(Boolean).map(Number).filter(n => !isNaN(n));
  const range = (a, b, cls, base) => { const o = Object.assign({}, base); for (let i = a; i <= b; i++) if (!o[i]) o[i] = cls; return o; };
  const mapObj = m => { const o = {}; m.forEach((v, k) => { o[k] = v; }); return o; };
  const fmt = a => '[' + a.join(', ') + ']';
  const MAX_STEPS = 600;

  // recorder: s(line, note, extra) → snapshot push karta hai
  function recorder(base) {
    const steps = [];
    const s = (line, note, extra) => { if (steps.length < MAX_STEPS) steps.push(Object.assign({ line, note }, base(), extra)); };
    return { steps, s };
  }

  const defs = {};

  defs[1920] = {
    title: 'Build Array from Permutation',
    inputs: [{ key: 'nums', label: 'nums (0..n−1 ka permutation)', def: '0, 2, 1, 5, 3, 4' }],
    check: ({ nums }) => [...nums].sort((a, b) => a - b).every((v, i) => v === i) ? '' : 'nums 0..n−1 ka permutation hona chahiye (har number ek baar).',
    run({ nums }) {
      const a = nums.slice(), n = a.length;
      const { steps, s } = recorder(() => ({ arr: a.slice() }));
      s(2, `n = ${n}`, { vars: { n } });
      for (let i = 0; i < n; i++) {
        s(4, `i = ${i}`, { vars: { n, i }, ptr: [{ i, label: 'i' }], hl: { [i]: 'cur' } });
        const j = a[i], oldj = a[j] % n, before = a[i];
        a[i] = before + n * oldj;
        s(5, `nums[nums[${i}]] % n = nums[${j}] % ${n} = ${oldj} (purani value). nums[${i}] = ${before} + ${n}×${oldj} = ${a[i]}`,
          { vars: { n, i }, ptr: [{ i, label: 'i' }, { i: j, label: 'nums[i]' }], hl: { [i]: 'new', [j]: 'win' } });
      }
      s(7, 'Ab har cell = old + n×new. Dusra loop: /n karke sirf new value rakho.', { vars: { n } });
      for (let i = 0; i < n; i++) {
        const b = a[i];
        a[i] = Math.floor(b / n);
        s(8, `nums[${i}] = ${b} / ${n} = ${a[i]}`, { vars: { n, i }, ptr: [{ i, label: 'i' }], hl: range(0, i - 1, 'done', { [i]: 'new' }) });
      }
      s(10, `return ${fmt(a)}`, { vars: { n }, hl: range(0, n - 1, 'found'), ret: fmt(a) });
      return steps;
    },
  };

  defs[1480] = {
    title: 'Running Sum (Prefix Sum, in-place)',
    inputs: [{ key: 'nums', label: 'nums', def: '3, 1, 4, 1, 5, 9' }],
    run({ nums }) {
      const a = nums.slice();
      const { steps, s } = recorder(() => ({ arr: a.slice() }));
      s(1, 'Method call: nums ka reference stack frame me, asli array heap me.');
      for (let i = 1; i < a.length; i++) {
        s(2, `i = ${i}, ${i} < ${a.length} ✓`, { vars: { i }, ptr: [{ i, label: 'i' }], hl: range(0, i - 1, 'done', { [i]: 'cur' }) });
        const old = a[i];
        a[i] += a[i - 1];
        s(3, `nums[${i}] = ${old} + nums[${i - 1}] (${a[i - 1]}) = ${a[i]}`, { vars: { i }, ptr: [{ i, label: 'i' }], hl: range(0, i - 1, 'done', { [i]: 'new' }) });
      }
      s(2, `i = ${Math.max(a.length, 1)} → condition false, loop khatam`, {});
      s(5, `return ${fmt(a)} — ab sum(l..r) = nums[r] − nums[l−1]`, { hl: range(0, a.length - 1, 'found'), ret: fmt(a) });
      return steps;
    },
  };

  defs[217] = {
    title: 'Contains Duplicate (HashSet)',
    inputs: [{ key: 'nums', label: 'nums', def: '4, 1, 3, 2, 3, 5' }],
    run({ nums }) {
      const seen = new Set();
      const { steps, s } = recorder(() => ({ arr: nums, set: [...seen], heapLabel: 'HashSet seen' }));
      s(2, 'seen = new HashSet<>() — object heap me bana');
      for (let i = 0; i < nums.length; i++) {
        const x = nums[i];
        s(3, `x = nums[${i}] = ${x}`, { vars: { x }, ptr: [{ i, label: 'x' }], hl: { [i]: 'cur' } });
        if (seen.has(x)) {
          s(4, `seen.add(${x}) → false (pehle se hai!) → return true`, { vars: { x }, ptr: [{ i, label: 'x' }], hl: { [nums.indexOf(x)]: 'found', [i]: 'found' }, heapHl: x, ret: 'true' });
          return steps;
        }
        seen.add(x);
        s(4, `seen.add(${x}) → true (naya element)`, { vars: { x }, ptr: [{ i, label: 'x' }], hl: { [i]: 'cur' }, heapHl: x });
      }
      s(6, 'Loop khatam, koi duplicate nahi → return false', { ret: 'false' });
      return steps;
    },
  };

  defs[1] = {
    title: 'Two Sum (HashMap)',
    inputs: [{ key: 'nums', label: 'nums', def: '2, 7, 11, 15' }, { key: 'target', label: 'target', def: '9', num: true }],
    run({ nums, target }) {
      const m = new Map();
      const { steps, s } = recorder(() => ({ arr: nums, map: mapObj(m), heapLabel: 'HashMap map (value → index)' }));
      s(2, 'map = new HashMap<>() — value → index', { vars: { target } });
      for (let i = 0; i < nums.length; i++) {
        const x = nums[i], need = target - x;
        s(3, `i = ${i}`, { vars: { target, i }, ptr: [{ i, label: 'i' }], hl: { [i]: 'cur' } });
        s(4, `need = ${target} − ${x} = ${need}`, { vars: { target, i, need }, ptr: [{ i, label: 'i' }], hl: { [i]: 'cur' } });
        if (m.has(need)) {
          const j = m.get(need);
          s(5, `map.containsKey(${need}) → true! return [${j}, ${i}]`, { vars: { target, i, need }, ptr: [{ i: j, label: 'map.get(need)' }, { i, label: 'i' }], hl: { [j]: 'found', [i]: 'found' }, heapHl: need, ret: `[${j}, ${i}]` });
          return steps;
        }
        s(5, `map.containsKey(${need}) → false`, { vars: { target, i, need }, ptr: [{ i, label: 'i' }], hl: { [i]: 'cur' } });
        m.set(x, i);
        s(6, `map.put(${x}, ${i})`, { vars: { target, i, need }, ptr: [{ i, label: 'i' }], hl: { [i]: 'cur' }, heapHl: x });
      }
      s(8, 'Koi pair nahi → return [-1, -1]', { vars: { target }, ret: '[-1, -1]' });
      return steps;
    },
  };

  defs[53] = {
    title: "Maximum Subarray (Kadane's)",
    inputs: [{ key: 'nums', label: 'nums', def: '-2, 1, -3, 4, -1, 2, 1, -5, 4' }],
    run({ nums }) {
      let cur = 0, best = -Infinity, start = 0, bs = 0, be = -1;
      const B = () => (best === -Infinity ? '-2147483648' : best);
      const { steps, s } = recorder(() => ({ arr: nums }));
      s(2, 'cur = 0, best = Integer.MIN_VALUE (taaki all-negative bhi chale)', { vars: { cur, best: B() } });
      nums.forEach((x, i) => {
        const win = { ptr: [{ i: start, label: 'start' }, { i, label: 'x' }] };
        s(3, `x = nums[${i}] = ${x}`, Object.assign({ vars: { cur, best: B(), x }, hl: range(start, i - 1, 'win', { [i]: 'cur' }) }, win));
        const ext = cur + x;
        let note;
        if (x > ext) { note = `max(${x}, ${cur}+${x}=${ext}) = ${x} → pichla cur negative tha, naya start`; cur = x; start = i; }
        else { note = `max(${x}, ${cur}+${x}=${ext}) = ${ext} → extend`; cur = ext; }
        s(4, note, { vars: { cur, best: B(), x }, ptr: [{ i: start, label: 'start' }, { i, label: 'x' }], hl: range(start, i, 'win', { [i]: 'cur' }) });
        const up = cur > best;
        if (up) { best = cur; bs = start; be = i; }
        s(5, up ? `best = max(…, ${cur}) → best update = ${best}` : `best = ${best} (no change)`, { vars: { cur, best: B(), x }, ptr: [{ i: start, label: 'start' }, { i, label: 'x' }], hl: range(start, i, 'win', { [i]: 'cur' }) });
      });
      s(7, `return ${B()} (subarray index ${bs}..${be})`, { vars: { cur, best: B() }, hl: be >= 0 ? range(bs, be, 'found') : {}, ret: String(B()) });
      return steps;
    },
  };

  defs[26] = {
    title: 'Remove Duplicates (Read / Write pointers)',
    inputs: [{ key: 'nums', label: 'nums (sorted)', def: '0, 0, 1, 1, 1, 2, 2, 3, 3, 4' }],
    run({ nums }) {
      const a = nums.slice();
      const { steps, s } = recorder(() => ({ arr: a.slice() }));
      if (!a.length) { s(2, 'Empty → return 0', { ret: '0' }); return steps; }
      s(2, `length = ${a.length} ≠ 0, aage badho`);
      let k = 1;
      s(3, 'k = 1 → index 0 hamesha unique, next write position 1', { vars: { k }, hl: { 0: 'done' }, ptr: [{ i: 1, label: 'k' }] });
      for (let i = 1; i < a.length; i++) {
        const base = { ptr: [{ i, label: 'i' }, { i: k, label: 'k' }] };
        s(4, `i = ${i}`, Object.assign({ vars: { k, i }, hl: range(0, k - 1, 'done', { [i]: 'cur' }) }, base));
        if (a[i] !== a[k - 1]) {
          s(5, `nums[${i}] (${a[i]}) != nums[k−1] (${a[k - 1]}) → true, naya unique`, Object.assign({ vars: { k, i }, hl: range(0, k - 1, 'done', { [i]: 'cur' }) }, base));
          a[k] = a[i];
          s(6, `nums[${k}] = ${a[i]}`, Object.assign({ vars: { k, i }, hl: range(0, k - 1, 'done', { [k]: 'new', [i]: 'cur' }) }, base));
          k++;
          s(7, `k++ → ${k}`, { vars: { k, i }, ptr: [{ i, label: 'i' }, { i: k, label: 'k' }], hl: range(0, k - 1, 'done') });
        } else {
          s(5, `nums[${i}] (${a[i]}) == nums[k−1] → duplicate, skip`, Object.assign({ vars: { k, i }, hl: range(0, k - 1, 'done', { [i]: 'skip' }) }, base));
        }
      }
      s(10, `return ${k} — pehle ${k} elements unique`, { vars: { k }, hl: range(0, k - 1, 'found'), ret: String(k) });
      return steps;
    },
  };

  defs[238] = {
    title: 'Product of Array Except Self',
    inputs: [{ key: 'nums', label: 'nums', def: '1, 2, 3, 4' }],
    run({ nums }) {
      const n = nums.length, ans = Array(n).fill(0);
      const { steps, s } = recorder(() => ({ arr: nums }));
      const R = hl => ({ label: 'ans', vals: ans.slice(), hl });
      s(2, `n = ${n}`, { vars: { n } });
      s(3, 'ans = new int[n] — heap me, sab 0', { vars: { n }, row2: R() });
      ans[0] = 1;
      s(4, 'ans[0] = 1 (index 0 ke left me kuch nahi)', { vars: { n }, row2: R({ 0: 'new' }) });
      for (let i = 1; i < n; i++) {
        ans[i] = ans[i - 1] * nums[i - 1];
        s(5, `ans[${i}] = ans[${i - 1}] × nums[${i - 1}] = ${ans[i - 1]} × ${nums[i - 1]} = ${ans[i]} (left product)`, { vars: { n, i }, ptr: [{ i, label: 'i' }], hl: range(0, i - 1, 'win'), row2: R({ [i]: 'new' }) });
      }
      let suffix = 1;
      s(6, 'suffix = 1 — ab right se left chalenge', { vars: { n, suffix }, row2: R() });
      for (let i = n - 1; i >= 0; i--) {
        s(7, `i = ${i}`, { vars: { n, suffix, i }, ptr: [{ i, label: 'i' }], hl: range(i + 1, n - 1, 'win', { [i]: 'cur' }), row2: R() });
        const left = ans[i];
        ans[i] = left * suffix;
        s(8, `ans[${i}] = ${left} (left) × ${suffix} (suffix) = ${ans[i]}`, { vars: { n, suffix, i }, ptr: [{ i, label: 'i' }], hl: range(i + 1, n - 1, 'win', { [i]: 'cur' }), row2: R({ [i]: 'new' }) });
        suffix *= nums[i];
        s(9, `suffix *= ${nums[i]} → ${suffix}`, { vars: { n, suffix, i }, ptr: [{ i, label: 'i' }], hl: range(i, n - 1, 'win'), row2: R() });
      }
      s(11, `return ${fmt(ans)}`, { vars: { n, suffix }, row2: R(range(0, n - 1, 'found')), ret: fmt(ans) });
      return steps;
    },
  };

  defs[560] = {
    title: 'Subarray Sum Equals K (Prefix + HashMap)',
    inputs: [{ key: 'nums', label: 'nums', def: '1, 2, 3, -2, 2, 1' }, { key: 'k', label: 'k', def: '3', num: true }],
    run({ nums, k }) {
      const m = new Map();
      let sum = 0, count = 0;
      const { steps, s } = recorder(() => ({ arr: nums, map: mapObj(m), heapLabel: 'HashMap freq (prefixSum → count)' }));
      s(2, 'freq = new HashMap<>()', { vars: { k } });
      m.set(0, 1);
      s(3, 'freq.put(0, 1) — empty prefix, taaki index 0 se start hone wale subarray bhi gine jaayein', { vars: { k }, heapHl: 0 });
      s(4, 'sum = 0, count = 0', { vars: { k, sum, count } });
      nums.forEach((x, i) => {
        s(5, `x = nums[${i}] = ${x}`, { vars: { k, sum, count, x }, ptr: [{ i, label: 'x' }], hl: { [i]: 'cur' } });
        sum += x;
        s(6, `sum = ${sum}`, { vars: { k, sum, count, x }, ptr: [{ i, label: 'x' }], hl: { [i]: 'cur' } });
        const need = sum - k, got = m.get(need) || 0;
        count += got;
        s(7, `freq.get(sum − k = ${need}) = ${got}${got ? ` → ${got} subarray(s) index ${i} pe khatam` : ''} → count = ${count}`, { vars: { k, sum, count, x }, ptr: [{ i, label: 'x' }], hl: { [i]: got ? 'found' : 'cur' }, heapHl: need });
        m.set(sum, (m.get(sum) || 0) + 1);
        s(8, `freq[${sum}]++ → ${m.get(sum)}`, { vars: { k, sum, count, x }, ptr: [{ i, label: 'x' }], hl: { [i]: 'cur' }, heapHl: sum });
      });
      s(10, `return ${count}`, { vars: { k, sum, count }, ret: String(count) });
      return steps;
    },
  };

  defs[525] = {
    title: 'Contiguous Array (balance + first index)', ap: 1,
    inputs: [{ key: 'nums', label: 'nums (sirf 0 / 1)', def: '0, 0, 1, 0, 1, 1, 0' }],
    check: ({ nums }) => nums.every(v => v === 0 || v === 1) ? '' : 'Sirf 0 aur 1 daalo.',
    run({ nums }) {
      const m = new Map();
      let bal = 0, max = 0, bestL = -1, bestR = -1;
      const { steps, s } = recorder(() => ({ arr: nums, map: mapObj(m), heapLabel: 'HashMap first (balance → pehla index)' }));
      s(2, 'first = new HashMap<>()');
      m.set(0, -1);
      s(3, 'first.put(0, -1) — balance 0 "index −1" pe (shuru se pehle)', { heapHl: 0 });
      s(4, 'bal = 0, max = 0', { vars: { bal, max } });
      for (let i = 0; i < nums.length; i++) {
        const keep = bestR >= 0 ? range(bestL, bestR, 'done') : {};
        s(5, `i = ${i}`, { vars: { bal, max, i }, ptr: [{ i, label: 'i' }], hl: Object.assign({}, keep, { [i]: 'cur' }) });
        bal += nums[i] === 1 ? 1 : -1;
        s(6, `nums[${i}] = ${nums[i]} → bal ${nums[i] === 1 ? '+1' : '−1'} = ${bal}`, { vars: { bal, max, i }, ptr: [{ i, label: 'i' }], hl: Object.assign({}, keep, { [i]: 'cur' }) });
        if (m.has(bal)) {
          const f = m.get(bal), len = i - f;
          const up = len > max;
          if (up) { max = len; bestL = f + 1; bestR = i; }
          s(7, `balance ${bal} pehle index ${f} pe tha → index ${f + 1}..${i} me 0 aur 1 barabar, len = ${len}${up ? ' → max update' : ''}`, { vars: { bal, max, i }, ptr: [{ i, label: 'i' }], hl: range(f + 1, i, 'win'), heapHl: bal });
        } else {
          m.set(bal, i);
          s(8, `balance ${bal} pehli baar → first.put(${bal}, ${i})`, { vars: { bal, max, i }, ptr: [{ i, label: 'i' }], hl: Object.assign({}, keep, { [i]: 'cur' }), heapHl: bal });
        }
      }
      s(10, `return ${max}`, { vars: { bal, max }, hl: bestR >= 0 ? range(bestL, bestR, 'found') : {}, ret: String(max) });
      return steps;
    },
  };

  defs[41] = {
    title: 'First Missing Positive (Cyclic Sort)',
    inputs: [{ key: 'nums', label: 'nums', def: '3, 4, -1, 1' }],
    run({ nums }) {
      const a = nums.slice(), n = a.length;
      const placed = () => a.reduce((o, v, i) => { if (v === i + 1) o[i] = 'done'; return o; }, {});
      const { steps, s } = recorder(() => ({ arr: a.slice() }));
      s(2, `n = ${n} → answer 1..${n + 1} ke beech hi hoga`, { vars: { n } });
      for (let i = 0; i < n; i++) {
        s(3, `i = ${i}`, { vars: { n, i }, ptr: [{ i, label: 'i' }], hl: Object.assign(placed(), { [i]: 'cur' }) });
        for (;;) {
          const v = a[i];
          const ok = v > 0 && v <= n && a[v - 1] !== v;
          let why;
          if (v <= 0 || v > n) why = `nums[${i}] = ${v} → range 1..${n} ke bahar, ignore`;
          else if (!ok) why = `nums[${i}] = ${v} → index ${v - 1} pe already ${v} hai, theek`;
          else why = `nums[${i}] = ${v} → iski jagah index ${v - 1} hai (wahan ${a[v - 1]}) → swap karna hai`;
          s(5, why, { vars: { n, i }, ptr: v > 0 && v <= n ? [{ i, label: 'i' }, { i: v - 1, label: 'j' }] : [{ i, label: 'i' }], hl: Object.assign(placed(), { [i]: 'cur' }) });
          if (!ok || steps.length >= MAX_STEPS) break;
          const j = v - 1;
          s(6, `j = ${j}`, { vars: { n, i, j }, ptr: [{ i, label: 'i' }, { i: j, label: 'j' }], hl: Object.assign(placed(), { [i]: 'cur', [j]: 'win' }) });
          const t = a[i]; a[i] = a[j]; a[j] = t;
          s(7, `swap → ${a[j]} apni jagah (index ${j}) pahunch gaya`, { vars: { n, i, j }, ptr: [{ i, label: 'i' }, { i: j, label: 'j' }], hl: Object.assign(placed(), { [i]: 'new' }) });
        }
      }
      for (let i = 0; i < n; i++) {
        s(10, `i = ${i}`, { vars: { n, i }, ptr: [{ i, label: 'i' }], hl: Object.assign(placed(), { [i]: 'cur' }) });
        if (a[i] !== i + 1) {
          s(11, `nums[${i}] = ${a[i]} ≠ ${i + 1} → return ${i + 1}`, { vars: { n, i }, ptr: [{ i, label: 'i' }], hl: Object.assign(placed(), { [i]: 'found' }), ret: String(i + 1) });
          return steps;
        }
        s(11, `nums[${i}] = ${i + 1} ✓`, { vars: { n, i }, ptr: [{ i, label: 'i' }], hl: placed() });
      }
      s(13, `1..${n} sab mile → return ${n + 1}`, { vars: { n }, hl: placed(), ret: String(n + 1) });
      return steps;
    },
  };

  defs[128] = {
    title: 'Longest Consecutive Sequence (HashSet)',
    inputs: [{ key: 'nums', label: 'nums', def: '100, 4, 200, 1, 3, 2' }],
    run({ nums }) {
      const set = new Set();
      let best = 0;
      const vals = (lo, hi) => nums.reduce((o, v, i) => { if (v >= lo && v <= hi) o[i] = 'win'; return o; }, {});
      const at = x => nums.reduce((o, v, i) => { if (v === x) o[i] = 'cur'; return o; }, {});
      const { steps, s } = recorder(() => ({ arr: nums, set: [...set], heapLabel: 'HashSet set' }));
      s(2, 'set = new HashSet<>()');
      nums.forEach(x => set.add(x));
      s(3, `Saare numbers set me daale (duplicates hat gaye): {${[...set].join(', ')}}`);
      s(4, 'best = 0', { vars: { best } });
      for (const x of set) {
        s(5, `x = ${x}`, { vars: { best, x }, hl: at(x), heapHl: x });
        if (set.has(x - 1)) {
          s(6, `set.contains(${x - 1}) → true → ${x} kisi sequence ke beech me hai, skip`, { vars: { best, x }, hl: at(x), heapHl: x - 1 });
          continue;
        }
        s(6, `${x - 1} set me nahi → ${x} sequence ka START hai`, { vars: { best, x }, hl: at(x), heapHl: x });
        let len = 1;
        s(7, 'len = 1', { vars: { best, x, len }, hl: vals(x, x) });
        while (set.has(x + len) && steps.length < MAX_STEPS) {
          len++;
          s(8, `set.contains(${x + len - 1}) ✓ → len = ${len}`, { vars: { best, x, len }, hl: vals(x, x + len - 1), heapHl: x + len - 1 });
        }
        s(8, `set.contains(${x + len}) ✗ → while khatam`, { vars: { best, x, len }, hl: vals(x, x + len - 1) });
        best = Math.max(best, len);
        s(9, `best = ${best}`, { vars: { best, x, len }, hl: vals(x, x + len - 1) });
      }
      s(12, `return ${best}`, { vars: { best }, ret: String(best) });
      return steps;
    },
  };

  defs[169] = {
    title: 'Majority Element (Boyer-Moore Voting)',
    inputs: [{ key: 'nums', label: 'nums', def: '2, 2, 1, 1, 1, 2, 2' }],
    run({ nums }) {
      let cand = 0, count = 0;
      const { steps, s } = recorder(() => ({ arr: nums }));
      s(2, 'cand = 0, count = 0', { vars: { cand, count } });
      nums.forEach((x, i) => {
        s(3, `x = nums[${i}] = ${x}`, { vars: { cand, count, x }, ptr: [{ i, label: 'x' }], hl: { [i]: 'cur' } });
        if (count === 0) { cand = x; s(4, `count == 0 → cand = ${x}`, { vars: { cand, count, x }, ptr: [{ i, label: 'x' }], hl: { [i]: 'new' } }); }
        else s(4, `count = ${count} ≠ 0 → cand same (${cand})`, { vars: { cand, count, x }, ptr: [{ i, label: 'x' }], hl: { [i]: 'cur' } });
        count += x === cand ? 1 : -1;
        s(5, x === cand ? `${x} == cand → count +1 = ${count}` : `${x} ≠ cand (${cand}) → cancel, count −1 = ${count}`, { vars: { cand, count, x }, ptr: [{ i, label: 'x' }], hl: { [i]: x === cand ? 'found' : 'skip' } });
      });
      s(7, `return ${cand}`, { vars: { cand, count }, hl: nums.reduce((o, v, i) => { if (v === cand) o[i] = 'found'; return o; }, {}), ret: String(cand) });
      return steps;
    },
  };

  // ---------- Rendering ----------
  function rowHtml(vals, hl, ptrs, label) {
    hl = hl || {}; ptrs = ptrs || [];
    const cells = vals.map((v, i) => {
      const lab = ptrs.filter(p => p.i === i).map(p => p.label).join(', ');
      const k = esc(String(label) + ':' + i);
      return `<div class="vcell ${hl[i] || ''}" data-k="a:${k}"><div class="vbox">${v === '' || v === undefined || v === null ? '&nbsp;' : esc(v)}</div><div class="vidx">${i}</div><div class="vptr" data-k="p:${k}">${lab ? '▲ ' + esc(lab) : '&nbsp;'}</div></div>`;
    }).join('');
    return `<div class="vrow-wrap"><div class="vrow-label">${esc(label)}</div><div class="vrow">${cells}</div></div>`;
  }

  // Linked list: nodes [{id, val, next: id|null}] screen order me; ptr [{id, label}]; hl {id: cls}
  function listHtml(v) {
    const nodes = v.nodes || [], hl = v.hl || {}, ptr = v.ptr || [];
    const byId = {}; nodes.forEach(n => { byId[n.id] = n; });
    let h = '';
    nodes.forEach((n, i) => {
      const lab = ptr.filter(p => p.id === n.id).map(p => p.label).join(', ');
      const nx = n.next === null || n.next === undefined ? 'null' : (byId[n.next] ? byId[n.next].val : '?');
      const k = esc(String(v.label || 'list') + ':' + n.id);
      h += `<div class="lnode ${hl[n.id] || ''}" data-k="n:${k}"><div class="vptr top" data-k="np:${k}">${lab ? esc(lab) + ' ▼' : '&nbsp;'}</div><div class="vbox">${esc(n.val)}</div><div class="lnext" data-k="nx:${k}">next: ${esc(nx)}</div></div>`;
      const b = nodes[i + 1];
      if (b) {
        const fwd = n.next === b.id, back = b.next === n.id;
        h += `<div class="larrow ${fwd || back ? '' : 'none'}" data-k="ar:${esc(String(v.label || 'list') + ':' + n.id + '-' + b.id)}">${fwd && back ? '⇄' : fwd ? '→' : back ? '←' : '·'}</div>`;
      }
    });
    const last = nodes[nodes.length - 1];
    if (!nodes.length || (last && (last.next === null || last.next === undefined))) h += `${nodes.length ? '<div class="larrow">→</div>' : ''}<div class="lnull">null</div>`;
    const free = (v.free || []).map(p => `<span class="chip">${esc(p.label)} = ${esc(p.val)}</span>`).join('');
    return `<div class="vrow-wrap"><div class="vrow-label">${esc(v.label || 'list')}</div><div><div class="lrow">${h}</div>${free ? `<div class="vvars">${free}</div>` : ''}</div></div>`;
  }

  // Stack: items bottom → top. Queue: front → back.
  function stackHtml(v) {
    const items = v.items || [], hl = v.hl || {};
    const cells = items.map((x, i) => `<div class="sitem ${hl[i] || ''}" data-k="s:${esc(String(v.label || 'stack') + ':' + i)}">${esc(x)}${i === items.length - 1 ? '<span class="stop">← top</span>' : ''}</div>`).reverse().join('');
    return `<div class="vrow-wrap"><div class="vrow-label">${esc(v.label || 'stack')}</div><div class="stackbox">${cells || '<div class="muted small">empty</div>'}</div></div>`;
  }
  function queueHtml(v) {
    const items = v.items || [], hl = v.hl || {};
    const cells = items.map((x, i) => `<div class="vcell ${hl[i] || ''}" data-k="q:${esc(String(v.label || 'queue') + ':' + i)}"><div class="vbox">${esc(x)}</div><div class="vptr">${i === 0 ? 'front' : i === items.length - 1 ? 'back' : '&nbsp;'}</div></div>`).join('');
    return `<div class="vrow-wrap"><div class="vrow-label">${esc(v.label || 'queue')}</div><div class="vrow">${cells || '<span class="muted small">empty</span>'}</div></div>`;
  }

  // Grid / matrix: cells[r][c]; hl {"r,c": cls}
  function gridHtml(v) {
    const hl = v.hl || {};
    const rows = (v.cells || []).map((row, r) => `<tr><th>${r}</th>${row.map((x, c) => `<td class="${hl[r + ',' + c] || ''}" data-k="g:${esc(String(v.label || 'grid') + ':' + r + ',' + c)}">${esc(x)}</td>`).join('')}</tr>`).join('');
    const head = v.cells && v.cells[0] ? `<tr><th></th>${v.cells[0].map((_, c) => `<th>${c}</th>`).join('')}</tr>` : '';
    return `<div class="vrow-wrap"><div class="vrow-label">${esc(v.label || 'grid')}</div><table class="vgrid">${head}${rows}</table></div>`;
  }

  // DP table: rows[r][c], rowLabels, colLabels, hl {"r,c": cls}
  function tableHtml(v) {
    const hl = v.hl || {}, rl = v.rowLabels || [], cl = v.colLabels || [];
    const head = cl.length ? `<tr><th></th>${cl.map(x => `<th>${esc(x)}</th>`).join('')}</tr>` : '';
    const rows = (v.rows || []).map((row, r) => `<tr><th>${esc(rl[r] !== undefined ? rl[r] : r)}</th>${row.map((x, c) => `<td class="${hl[r + ',' + c] || ''}" data-k="d:${esc(String(v.label || 'dp') + ':' + r + ',' + c)}">${x === null || x === undefined ? '' : esc(x)}</td>`).join('')}</tr>`).join('');
    return `<div class="vrow-wrap"><div class="vrow-label">${esc(v.label || 'dp')}</div><table class="vgrid dp">${head}${rows}</table></div>`;
  }

  // Tree: nodes = LeetCode level-order array (null = khaali); node id = array index. hl {id: cls}, ptr [{id, label}]
  function buildTree(arr) {
    const nodes = [];
    if (!arr || !arr.length || arr[0] === null || arr[0] === undefined) return nodes;
    const root = { id: 0, val: arr[0], left: null, right: null };
    nodes.push(root);
    const q = [root];
    let i = 1;
    while (q.length && i < arr.length) {
      const cur = q.shift();
      if (i < arr.length && arr[i] !== null && arr[i] !== undefined) { cur.left = { id: i, val: arr[i], left: null, right: null }; nodes.push(cur.left); q.push(cur.left); }
      i++;
      if (i < arr.length && arr[i] !== null && arr[i] !== undefined) { cur.right = { id: i, val: arr[i], left: null, right: null }; nodes.push(cur.right); q.push(cur.right); }
      i++;
    }
    return nodes;
  }
  function treeHtml(v) {
    const nodes = buildTree(v.nodes), hl = v.hl || {}, ptr = v.ptr || [];
    if (!nodes.length) return `<div class="vrow-wrap"><div class="vrow-label">${esc(v.label || 'tree')}</div><div class="lnull">null</div></div>`;
    let x = 0, maxD = 0;
    const pos = {};
    (function walk(n, d) { if (!n) return; walk(n.left, d + 1); pos[n.id] = { x: x++, d }; maxD = Math.max(maxD, d); walk(n.right, d + 1); })(nodes[0], 0);
    const W = 46, H = 62, R = 17, w = Math.max(x, 1) * W + 20, h = (maxD + 1) * H + 24;
    const cx = id => pos[id].x * W + W / 2 + 10, cy = id => pos[id].d * H + 30;
    let edges = '', circles = '';
    nodes.forEach(n => {
      [n.left, n.right].forEach(ch => { if (ch) edges += `<line x1="${cx(n.id)}" y1="${cy(n.id)}" x2="${cx(ch.id)}" y2="${cy(ch.id)}" class="tedge ${hl['e' + ch.id] || ''}"/>`; });
      const lab = ptr.filter(p => p.id === n.id).map(p => p.label).join(', ');
      circles += `<g class="tnode ${hl[n.id] || ''}" data-k="t:${esc(String(v.label || 'tree') + ':' + n.id)}"><circle cx="${cx(n.id)}" cy="${cy(n.id)}" r="${R}"/><text x="${cx(n.id)}" y="${cy(n.id) + 5}">${esc(n.val)}</text>${lab ? `<text class="tlab" x="${cx(n.id)}" y="${cy(n.id) - R - 5}">${esc(lab)}</text>` : ''}</g>`;
    });
    return `<div class="vrow-wrap"><div class="vrow-label">${esc(v.label || 'tree')}</div><svg class="vtree" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${edges}${circles}</svg></div>`;
  }

  // Graph: nodes [{id, label}], edges [[a, b]], directed; hl {id: cls}, ehl {"a-b": cls}
  function graphHtml(v) {
    const nodes = v.nodes || [], n = nodes.length, hl = v.hl || {}, ehl = v.ehl || {};
    const S = Math.max(200, n * 38), c = S / 2, rad = S / 2 - 26, pos = {};
    nodes.forEach((nd, i) => { const a = (2 * Math.PI * i) / Math.max(n, 1) - Math.PI / 2; pos[nd.id] = [c + rad * Math.cos(a), c + rad * Math.sin(a)]; });
    let e = '';
    (v.edges || []).forEach(([a, b]) => {
      if (!pos[a] || !pos[b]) return;
      const [x1, y1] = pos[a], [x2, y2] = pos[b], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
      const ex = x2 - (dx / L) * 18, ey = y2 - (dy / L) * 18;
      e += `<line x1="${x1}" y1="${y1}" x2="${ex}" y2="${ey}" class="tedge ${ehl[a + '-' + b] || ''}" ${v.directed ? 'marker-end="url(#arr)"' : ''}/>`;
    });
    const circles = nodes.map(nd => `<g class="tnode ${hl[nd.id] || ''}" data-k="gr:${esc(String(v.label || 'graph') + ':' + nd.id)}"><circle cx="${pos[nd.id][0]}" cy="${pos[nd.id][1]}" r="16"/><text x="${pos[nd.id][0]}" y="${pos[nd.id][1] + 5}">${esc(nd.label !== undefined ? nd.label : nd.id)}</text></g>`).join('');
    return `<div class="vrow-wrap"><div class="vrow-label">${esc(v.label || 'graph')}</div><svg class="vtree" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}"><defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="tarrow"/></marker></defs>${e}${circles}</svg></div>`;
  }

  function mapHtml(v) {
    const items = v.type === 'set'
      ? (v.items || []).map(x => `<span class="mapent ${String(x) === String(v.hl) ? 'hit' : ''}" data-k="m:${esc(String(v.label || 'set') + ':' + x)}">${esc(x)}</span>`)
      : Object.entries(v.entries || {}).map(([k, x]) => `<span class="mapent ${String(k) === String(v.hl) ? 'hit' : ''}" data-k="m:${esc(String(v.label || 'map') + ':' + k)}">${esc(k)} → ${esc(x)}</span>`);
    return `<div class="vrow-wrap"><div class="vrow-label">${esc(v.label || v.type)}</div><div class="vmap-body">${items.length ? items.join('') : '<span class="muted">{ }</span>'}</div></div>`;
  }

  function viewHtml(v) {
    switch (v.type) {
      case 'array': return rowHtml(v.vals || [], v.hl, v.ptr, v.label || '');
      case 'list': return listHtml(v);
      case 'stack': return stackHtml(v);
      case 'queue': return queueHtml(v);
      case 'grid': return gridHtml(v);
      case 'table': return tableHtml(v);
      case 'tree': return treeHtml(v);
      case 'graph': return graphHtml(v);
      case 'map': case 'set': return mapHtml(v);
      case 'text': return `<div class="vrow-wrap"><div class="vrow-label">${esc(v.label || '')}</div><div class="vtext" data-k="x:${esc(v.label || '')}">${esc(v.value)}</div></div>`;
      default: return '';
    }
  }

  // Phase 1 (purane) steps: arr / row2 / map / set fields
  function heapHtml(st) {
    if (st.views) return st.views.map(viewHtml).join('');
    let h = rowHtml(st.arr || [], st.hl, st.ptr, 'nums');
    if (st.row2) h += rowHtml(st.row2.vals, st.row2.hl, [], st.row2.label);
    const hl = st.heapHl === undefined ? undefined : st.heapHl;
    if (st.map) h += mapHtml({ type: 'map', label: (st.heapLabel || 'HashMap map').split(' ').slice(0, 2).join(' '), entries: st.map, hl });
    if (st.set) h += mapHtml({ type: 'set', label: (st.heapLabel || 'HashSet set').split(' ').slice(0, 2).join(' '), items: st.set, hl });
    return h;
  }

  // VS Code debugger jaisa "VARIABLES" list: [name, value]
  function varRows(st, params) {
    if (st.views || st.frames) {
      const vars = st.frames && st.frames.length ? (st.frames[0].vars || {}) : (st.vars || {});
      const rows = Object.entries(vars).map(([k, v]) => [k, String(v)]);
      // Visual me jo array / map / set dikh raha hai par VARIABLES me nahi — woh bhi dikhao (debugger poora lage)
      const have = new Set(rows.map(r => r[0]));
      (st.views || []).forEach(v => {
        // "HashMap freq" → freq, "nums (sorted)" → nums, "first[bal+n]" → first
        const toks = String(v.label || '').replace(/\(.*?\)/g, '').trim().split(/\s+/);
        const raw = /^(HashMap|HashSet|TreeSet|TreeMap|Map|Set|ArrayList|List|Deque|ArrayDeque|Queue|Stack|PriorityQueue)$/.test(toks[0]) && toks[1] ? toks[1] : toks[0];
        const name = String(raw || '').replace(/\[.*$/, '').replace(/[^\w.]/g, '');
        if (!name || have.has(name) || /^(cycle|gap|reversed|baaki|recursion|res|result|call)$/.test(name)) return;
        if (v.type === 'array') rows.push([name, 'int[' + (v.vals || []).length + '] [' + (v.vals || []).map(x => (x === '' || x === null || x === undefined ? '·' : x)).join(', ') + ']']);
        else if (v.type === 'map') { const e = Object.entries(v.entries || {}); rows.push([name, 'HashMap size=' + e.length + ' {' + e.map(([a, b]) => a + '=' + b).join(', ') + '}']); }
        else if (v.type === 'set') rows.push([name, 'HashSet size=' + (v.items || []).length + ' [' + (v.items || []).join(', ') + ']']);
        else return;
        have.add(name);
      });
      return rows;
    }
    const rows = [['nums', `int[${(st.arr || []).length}] [${(st.arr || []).join(', ')}]`]];
    Object.entries(params).forEach(([k, v]) => rows.push([k, String(v)]));
    if (st.map) {
      const name = (st.heapLabel || '').split(' ')[1] || 'map', ent = Object.entries(st.map);
      rows.push([name, `HashMap size=${ent.length} {${ent.map(([k, v]) => `${k}=${v}`).join(', ')}}`]);
    }
    if (st.set) rows.push([(st.heapLabel || '').split(' ')[1] || 'set', `HashSet size=${st.set.length} [${st.set.join(', ')}]`]);
    if (st.row2) rows.push([st.row2.label, `int[${st.row2.vals.length}] [${st.row2.vals.join(', ')}]`]);
    Object.entries(st.vars || {}).forEach(([k, v]) => { if (!(k in params)) rows.push([k, String(v)]); });
    return rows;
  }

  function debugHtml(st, prev, method, params) {
    const rows = varRows(st, params);
    const sameFrame = prev && (!st.frames || !prev.frames || (prev.frames.length === st.frames.length));
    const before = {};
    if (prev && sameFrame) varRows(prev, params).forEach(([k, v]) => { before[k] = v; });
    const line = (k, v, cls) => `<div class="dv ${cls || ''}"><span class="dv-k">${esc(k)}</span><span class="dv-c">:</span> <span class="dv-v">${esc(v)}</span></div>`;
    const frames = st.frames && st.frames.length
      ? st.frames.map((f, i) => `<div class="cs ${i === 0 ? 'top' : ''}"><span>${esc(f.method || method)}${f.args ? `(${esc(f.args)})` : ''}</span><span class="muted">Solution.java : ${i === 0 ? (st.line || '–') : (f.line || '–')}</span></div>`).join('')
      : `<div class="cs top"><span>${esc(method)}</span><span class="muted">Solution.java : ${st.line || '–'}</span></div>`;
    return `<div class="dbg">
      <div class="dbg-sec">▾ VARIABLES</div>
      <div class="dbg-grp">▾ Local${st.frames && st.frames.length > 1 ? ` <span class="muted">(top frame)</span>` : ''}</div>
      ${st.ret !== undefined ? line('⮐ return', st.ret, 'ret') : ''}
      ${rows.map(([k, v]) => line(k, v, prev && sameFrame && before[k] !== v ? 'changed' : '')).join('')}
      <div class="dbg-sec">▾ CALL STACK${st.frames && st.frames.length > 1 ? ` <span class="muted">(${st.frames.length} frames)</span>` : ''}</div>
      ${frames}
      <div class="cs"><span>main</span><span class="muted">Main.java</span></div>
    </div>`;
  }

  function questionFor(lc) {
    const all = window.PHASE_CONTENT || {};
    for (const k in all) { const q = all[k].questions && all[k].questions[lc]; if (q) return q; }
    return null;
  }

  function codeHtml(code) {
    return code.split('\n').map((ln, i) => {
      let html = esc(ln);
      if (window.hljs) { try { html = window.hljs.highlight(ln, { language: 'java', ignoreIllegals: true }).value; } catch (e) { /* plain */ } }
      return `<div class="cl" data-ln="${i + 1}"><span class="arrow"></span><span class="ln">${i + 1}</span><code>${html || ' '}</code></div>`;
    }).join('');
  }

  // input field parse: type 'arr' (default numbers) | 'num' | 'str' | 'json'
  function parseInput(inp, raw) {
    const t = inp.type || (inp.num ? 'num' : 'arr');
    if (t === 'num') return Number(raw);
    if (t === 'str') return String(raw);
    if (t === 'json') return JSON.parse(raw);
    return parseArr(raw);
  }


  // ================= Recursion Call Tree =================
  // steps[].frames (top-first) se call tree banao: har call = node, parent = jisne call kiya.
  const prettyVal = v => String(v).replace(/(?:ListNode|TreeNode)\(val=(-?\d+)\)/g, '$1');
  function retFromStep(st, code) {
    if (!st) return null;
    if (st.ret !== undefined) return prettyVal(st.ret);
    // "return newHead = ListNode(val=5) (…)" → 5 · "return 1 + max(0, 0) = 1" → 1 · "return 3 — …" → 3
    const m = /\breturn\s+(.+?)(?:\s+[—→]|\.\s|\.$|$)/i.exec(st.note || '');
    if (m) {
      let v = m[1].trim();
      const eq = v.lastIndexOf(' = ');
      if (eq >= 0) v = v.slice(eq + 3).trim();
      v = prettyVal(v.replace(/\s+\(.*$/, '').trim());
      if (v && v.length <= 24) return v;
    }
    const ln = (code || '').split('\n')[(st.line || 0) - 1] || '';
    return /\breturn\b/.test(ln) ? '✓' : null;
  }
  function buildCallTree(steps, code) {
    const nodes = [], per = [];
    let stack = [], maxDepth = 0;
    const sig = fr => (fr.method || '') + '(' + (fr.args || '') + ')';
    steps.forEach((st, k) => {
      if (st.frames && st.frames.length) {
        const cur = st.frames.slice().reverse();      // bottom → top
        maxDepth = Math.max(maxDepth, cur.length);
        let c = 0;
        while (c < stack.length && c < cur.length && nodes[stack[c]].sig === sig(cur[c])) c++;
        for (let j = stack.length - 1; j >= c; j--) {   // jo frames hate = return ho gaye
          const nd = nodes[stack[j]];
          nd.end = k;
          if (j === stack.length - 1) nd.ret = retFromStep(steps[k - 1], code);
        }
        stack = stack.slice(0, c);
        for (let j = c; j < cur.length; j++) {
          const id = nodes.length;
          nodes.push({ id, sig: sig(cur[j]), method: cur[j].method || '', args: cur[j].args || '', parent: stack.length ? stack[stack.length - 1] : -1, start: k, end: Infinity, ret: null });
          stack.push(id);
        }
      }
      per.push(stack.slice());
    });
    const last = steps[steps.length - 1];
    if (stack.length === 1 && last && last.ret !== undefined) { nodes[stack[0]].ret = prettyVal(last.ret); nodes[stack[0]].end = steps.length - 1; }
    if (maxDepth < 2) return null;
    // jo method sabse zyada call hua (recursive wala) uska naam chhupao — sirf args; baaki ke saath naam
    const cnt = {}; nodes.forEach(n => { cnt[n.method] = (cnt[n.method] || 0) + 1; });
    const main = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
    nodes.forEach(n => {
      const a = n.args.length > 18 ? n.args.slice(0, 17) + '…' : n.args;
      n.label = n.method === main ? '(' + a + ')' : n.method + '(' + a + ')';
    });
    return { nodes, per, method: main };
  }
  function callTreeHtml(ct, idx, fitW) {
    const vis = ct.nodes.filter(n => n.start <= idx);
    if (!vis.length) return '<span class="muted small">Abhi koi call nahi hui.</span>';
    const live = ct.per[idx] || [], top = live[live.length - 1];
    const kids = {}; vis.forEach(n => { (kids[n.parent] = kids[n.parent] || []).push(n); });
    const retW = Math.max(0, ...vis.filter(n => n.end <= idx && n.ret !== null && n.ret !== undefined).map(n => String(n.ret).length * 7 + 22));
    const NW = Math.max(64, ...vis.map(n => n.label.length * 7 + 18)), GX = Math.max(12, retW), H = 56, pos = {};
    let leaf = 0, maxD = 0;
    (function place(pid, d) {
      (kids[pid] || []).forEach(n => {
        maxD = Math.max(maxD, d);
        if (kids[n.id] && kids[n.id].length) {
          place(n.id, d + 1);
          const xs = kids[n.id].map(c => pos[c.id].x);
          pos[n.id] = { x: (Math.min(...xs) + Math.max(...xs)) / 2, d };
        } else pos[n.id] = { x: leaf++ * (NW + GX) + NW / 2 + 6, d };
      });
    })(-1, 0);
    const W = Math.max(leaf * (NW + GX) + 12, NW + 20) + 70, Ht = (maxD + 1) * H + 26;
    const cy = d => d * H + 22;
    let edges = '', boxes = '';
    vis.forEach(n => {
      const p = pos[n.id], x = p.x, y = cy(p.d);
      const state = n.end <= idx ? 'done' : n.id === top ? 'active' : live.includes(n.id) ? 'wait' : 'done';
      if (n.parent >= 0 && pos[n.parent]) edges += `<line x1="${pos[n.parent].x}" y1="${cy(pos[n.parent].d) + 14}" x2="${x}" y2="${y - 14}" class="ct-edge ${state}"/>`;
      const fresh = n.start === idx ? ' ct-new' : n.end === idx ? ' ct-ret' : '';
      boxes += `<g class="ct-node ${state}${fresh}"><rect x="${x - NW / 2}" y="${y - 14}" width="${NW}" height="28" rx="8"/><text x="${x}" y="${y + 5}">${esc(n.label)}</text>` +
        (state === 'done' && n.ret !== null && n.ret !== undefined ? `<text class="ct-retv" x="${x + NW / 2 + 5}" y="${y + 4}">↩ ${esc(n.ret)}</text>` : '') +
        (state === 'active' ? `<text class="ct-here" x="${x}" y="${y - 19}">▼ abhi yahan</text>` : '') + '</g>';
    });
    // bada tree panel me fit karne ke liye thoda chhota (min 60%) — baaki scroll
    const sc = fitW && W > fitW ? Math.max(0.6, fitW / W) : 1;
    return `<svg class="ct-svg" data-sc="${sc}" width="${Math.round(W * sc)}" height="${Math.round(Ht * sc)}" viewBox="0 0 ${W} ${Ht}">${edges}${boxes}</svg>`;
  }

  // defs[lc] = def; def.variants = [def2, …] (jaise Iterative / Recursive) — upar tabs aate hain
  function mount(el, lc, exIdx, variantIdx) {
    if (el._vizStop) el._vizStop();  // isi element pe pichla visualizer chal raha ho toh rok do
    let timer = null;
    const base = defs[lc];
    if (!base) { el.innerHTML = '<p class="muted">Visualizer nahi mila.</p>'; return; }
    const all = [base].concat(base.variants || []);
    const vi = Math.min(Number(variantIdx) || 0, all.length - 1);
    const def = Object.assign({}, base, all[vi]);
    if (!def.inputs) def.inputs = base.inputs;
    const q0 = questionFor(lc);
    const appr = q0 ? q0.approaches[def.ap === undefined ? q0.approaches.length - 1 : def.ap] : { code: def.code || '', level: '' };
    const code = def.code || appr.code, level = appr.level;
    const exs = (q0 && q0.problem && q0.problem.examples) || [];
    const ex0 = exs[Number(exIdx) || 0];
    // ---- Brute → Better → Optimal tabs (level ke order me; data-variant original index hi) ----
    function levelOf(d) {
      if (!q0) return '';
      const i = d.ap !== undefined ? d.ap : base.ap !== undefined ? base.ap : q0.approaches.length - 1;
      return (q0.approaches[i] || {}).level || '';
    }
    function variantTabs() {
      const rank = lv => (/^brute/i.test(lv) ? 0 : /^better/i.test(lv) ? 1 : /^optimal/i.test(lv) ? 2 : 3);
      const items = all.map((d, i) => ({ d, i, lv: levelOf(d) })).sort((a, b) => rank(a.lv) - rank(b.lv) || a.i - b.i);
      const lvls = q0 ? q0.approaches.map(a => a.level) : [];
      const noBetter = lvls.some(l => /^brute/i.test(l)) && lvls.some(l => /^optimal/i.test(l)) && !lvls.some(l => /^better/i.test(l));
      if (all.length < 2 && !noBetter) return '';
      const btn = ({ d, i, lv }) => {
        const short = lv.split(' (')[0];
        const lab = d.label && d.label !== short ? d.label : '';
        return '<button type="button" class="btn small lvl-tab lvl-' + esc(short.split(' ')[0]) + ' ' + (i === vi ? 'primary' : '') + '" data-variant="' + i + '">' + (short ? '<b>' + esc(short) + '</b>' : '') + (lab ? (short ? ' · ' : '') + esc(lab) : '') + '</button>';
      };
      return '<div class="viz-ex">' + items.map(btn).join('<span class="lvl-arrow">→</span>') +
        (noBetter ? '<span class="muted small lvl-note">Better: is problem me alag approach nahi — Brute ke baad seedha Optimal</span>' : '') + '</div>';
    }
    const method = def.method || (code.match(/public\s+[\w<>\[\], ]+\s+(\w+)\s*\(/) || code.match(/(\w+)\s*\(/) || [, 'solve'])[1];
    el.innerHTML = `
      <div class="viz">
        <div class="viz-head"><h3>${esc(def.title)}</h3><span class="muted">LC ${esc(lc)} · ${esc(level)} code</span>
          <span class="viz-tools"><button type="button" class="btn small" data-t="input" title="Apna input daalo">✎ Input</button><button type="button" class="btn small" data-t="tree" title="Recursion ka call tree" hidden>🌳 Call tree</button><button type="button" class="btn small" data-t="quiz" title="Har step se pehle guess karo">🎯 Quiz</button><button type="button" class="btn small" data-t="full" title="Poori screen pe (Esc = band)">⛶ Full screen</button></span></div>
        <div class="viz-pickrow">${variantTabs()}
        ${exs.length ? `<div class="viz-ex">${exs.map((e, i) => `<button type="button" class="btn small ${e === ex0 ? 'primary' : ''}" data-ex="${i}">Example ${i + 1}</button>`).join('')}<span class="muted small">ya neeche apna input daalo</span></div>` : ''}</div>
        <form class="viz-inputs">
          ${def.inputs.map(inp => `<label>${esc(inp.label)}<input name="${inp.key}" value="${esc(ex0 && ex0.viz && ex0.viz[inp.key] !== undefined ? ex0.viz[inp.key] : inp.def)}" ${inp.num || inp.type === 'num' ? 'class="short"' : ''}></label>`).join('')}
          <button type="submit" class="btn">Run</button>
        </form>
        <div class="viz-main">
        <div class="viz-heap"><div class="panel-title">Visual</div><div class="viz-arrays"></div>
          <div class="viz-calltree" hidden><div class="panel-title">🌳 Call tree — kaun kisko call kar raha hai <span class="ct-legend"><i class="active"></i>abhi chal raha <i class="wait"></i>wait kar raha (stack pe) <i class="done"></i>return ho gaya</span></div><div class="ct-body"></div></div></div>
        <div class="viz-bar">
          <div class="viz-controls">
            <button class="btn" data-a="first" title="Shuru se">⏮</button>
            <button class="btn" data-a="prev" title="Peeche (←)">◀ Back</button>
            <button class="btn primary" data-a="play">▶ Play</button>
            <button class="btn" data-a="next" title="Aage (→)">Next ▶</button>
            <span class="viz-count muted"></span>
            <div class="viz-prog"><div></div></div>
            <label class="muted speed">Speed <input type="range" min="200" max="2000" step="100" value="900" data-a="speed"></label>
          </div>
          <div class="vquiz" hidden></div>
          <div class="vnote"></div>
          <div class="vchanges"></div>
        </div>
        <div class="viz-grid">
          <div class="codepane">${codeHtml(code)}</div>
          <div class="viz-side"><div class="viz-stack"></div></div>
        </div>
        </div>
      </div>`;
    const q = sel => el.querySelector(sel);
    const playBtn = q('[data-a="play"]'), speed = q('[data-a="speed"]');
    let steps = [], idx = 0, params = {}, scalarIn = {};

    // ---- Values strip: inputs (k, target, n…) + chhote scalar variables — Visual me hamesha ----
    const BIG = /^(int|long|char|boolean|double|String|Integer)\[|^(HashMap|HashSet|TreeMap|ArrayList|List|Deque|ArrayDeque|Queue|Stack|PriorityQueue|LinkedList|Map|Set)\b|^(ListNode|TreeNode|Node)\(/;
    function valuesHtml(st) {
      const vals = Object.assign({}, scalarIn);
      varRows(st, params).forEach(([k, v]) => {
        v = String(v);
        if (!BIG.test(v) && v.length <= 22 && !/^\[.*\]$/.test(v)) vals[k] = v;
      });
      const keys = Object.keys(vals);
      if (!keys.length) return '';
      return '<div class="vrow-wrap vvals-wrap"><div class="vrow-label">values</div><div class="vvals-row">' +
        keys.map(k => '<span class="vval ' + (k in scalarIn ? 'inp' : '') + '" data-k="val:' + esc(k) + '"><b>' + esc(k) + '</b> = ' + esc(vals[k]) + '</span>').join('') +
        '</div></div>';
    }
    let ctree = null, ctOn = true;
    // ---- Quiz mode state ----
    let quizOn = false, score = 0, asked = 0, pending = false;
    const codeLines = code.split('\n');
    const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    function quizReset() { score = 0; asked = 0; pending = false; const b = q('.vquiz'); if (b) { b.hidden = !quizOn; b.innerHTML = quizOn ? '<span class="muted">🎯 Quiz on — <b>Next</b> dabao, pehle guess karo.</span>' : ''; } }
    function quizScore() { return `<span class="qscore">Score ${score} / ${asked}</span>`; }
    function makeQuestion() {
      const cur = steps[idx], nx = steps[idx + 1];
      // 1) variable kya banega?
      const ch = [];
      const sameFrame = !nx.frames || !cur.frames || nx.frames.length === cur.frames.length;
      if (sameFrame) {
        const old = {}; varRows(cur, params).forEach(([k, v]) => { old[k] = v; });
        varRows(nx, params).forEach(([k, v]) => { if (old[k] !== v && String(v).length <= 24) ch.push([k, old[k], v]); });
      }
      if (ch.length && Math.random() < 0.6) {
        const [k, a, b] = ch[Math.floor(Math.random() * ch.length)];
        const pool = new Set();
        if (a !== undefined && a !== b) pool.add(a);
        [cur, nx].forEach(st => varRows(st, params).forEach(([, v]) => { v = String(v); if (v !== b && v.length <= 24) pool.add(v); }));
        const others = shuffle([...pool]).slice(0, 2);
        const nb = Number(b);   // number ho toh ±1 wala option, taaki hamesha 3 choices hon
        if (b !== '' && !isNaN(nb)) [nb + 1, nb - 1, nb + 2].forEach(c => { if (others.length < 2 && String(c) !== b && !others.includes(String(c))) others.push(String(c)); });
        if (others.length) return { text: `Agle step ke baad <b>${esc(k)}</b> ki value kya hogi?`, opts: shuffle([b, ...others]), ans: b };
      }
      // 2) agli line kaunsi?
      if (!nx.line) return null;
      const valid = codeLines.map((t, i) => i + 1).filter(n => n !== nx.line && /[A-Za-z0-9]/.test(codeLines[n - 1] || ''));
      const near = shuffle(valid.filter(n => Math.abs(n - nx.line) <= 4)).concat(shuffle(valid));
      const ds = [...new Set(near)].slice(0, 2);
      const lab = n => `line ${n}: ${(codeLines[n - 1] || '').trim().slice(0, 46)}`;
      return { text: 'Agli <b>kaunsi line</b> chalegi?', opts: shuffle([nx.line, ...ds]).map(lab), ans: lab(nx.line) };
    }
    function quizNext() {
      if (pending || idx >= steps.length - 1) return;
      const qn = makeQuestion();
      if (!qn) { idx++; show(); return; }
      pending = true;
      const box = q('.vquiz');
      box.hidden = false;
      box.innerHTML = `<div class="qtext">❓ ${qn.text} ${quizScore()}</div><div class="qopts">${qn.opts.map((o, i) => `<button type="button" class="btn qopt" data-qi="${i}">${esc(o)}</button>`).join('')}</div>`;
      box.querySelectorAll('[data-qi]').forEach(b => b.addEventListener('click', () => {
        const pick = qn.opts[Number(b.dataset.qi)], ok = pick === qn.ans;
        asked++; if (ok) score++;
        if (ok && window.GAME) window.GAME.vizCorrect();
        pending = false;
        idx++; show();
        el.focus({ preventScroll: true });   // button hat gaya — keyboard (→) phir se chale
        box.innerHTML = `<div class="qtext ${ok ? 'qok' : 'qbad'}">${ok ? '✅ Sahi!' : '❌ Galat — sahi jawab: <b>' + esc(qn.ans) + '</b>'} ${quizScore()} <span class="muted small">· Next dabao agle sawaal ke liye</span></div>`;
      }));
    }
    function build() {
      const f = q('.viz-inputs'), input = {};
      let err = '';
      def.inputs.forEach(inp => {
        try { input[inp.key] = parseInput(inp, f.elements[inp.key].value); } catch (e) { err = `${inp.label}: input format galat hai`; }
      });
      params = {};
      def.inputs.forEach(inp => { if (inp.num || inp.type === 'num') params[inp.key] = input[inp.key]; });
      scalarIn = {};
      def.inputs.forEach(inp => {
        const t = inp.type || (inp.num ? 'num' : 'arr');
        if (t === 'num') scalarIn[inp.key] = String(input[inp.key]);
        if (t === 'str') scalarIn[inp.key] = '"' + input[inp.key] + '"';
      });
      if (!err && def.check) err = def.check(input);
      try { steps = err ? [{ line: 0, note: '⚠ ' + err, arr: [] }] : def.run(input); }
      catch (e) { steps = [{ line: 0, note: '⚠ Is input pe visualizer nahi chala: ' + e.message, arr: [] }]; }
      if (!steps.length) steps = [{ line: 0, note: 'Koi step nahi', arr: [] }];
      ctree = buildCallTree(steps, code);
      q('[data-t="tree"]').hidden = !ctree;
      q('[data-t="tree"]').classList.toggle('primary', !!ctree && ctOn);
      quizReset();
      idx = 0; lastIdx = -1; stop(); show();
    }
    let lastIdx = -1;
    const anim = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    // node / cell ki sirf apni value compare karo (label / next alag keys hain); animation classes ignore
    const txt = x => { const b = x.querySelector(':scope > .vbox'); return (b || x).textContent; };
    const cls = x => (x.getAttribute('class') || '').replace(/\bv-[a-z]+\b/g, '').replace(/\s+/g, ' ').trim();
    function snap(root) { const m = new Map(); root.querySelectorAll('[data-k]').forEach(x => m.set(x.dataset.k, { t: txt(x), c: cls(x) })); return m; }
    function show() {
      const st = steps[idx], prevSt = idx > 0 ? steps[idx - 1] : null;
      const box = q('.viz-arrays'), before = snap(box), step1 = Math.abs(idx - lastIdx) === 1;
      box.innerHTML = valuesHtml(st) + heapHtml(st);
      if (anim && step1 && before.size) {
        box.querySelectorAll('[data-k]').forEach(x => {
          const p = before.get(x.dataset.k), t = txt(x), c = cls(x);
          const isPtr = x.classList.contains('vptr');
          if (!p) x.classList.add('v-enter');
          else if (p.t !== t) x.classList.add(isPtr ? (t.trim() ? 'v-ptr' : 'v-gone') : 'v-chg');
          else if (p.c !== c) x.classList.add('v-hl');
        });
      }
      q('.viz-stack').innerHTML = debugHtml(st, prevSt, method, params);
      const nt = q('.vnote');
      nt.innerHTML = `<span class="lnbadge">line ${st.line || '–'}</span> ${esc(st.note || '')}`;
      if (anim) { nt.classList.remove('v-in'); void nt.offsetWidth; nt.classList.add('v-in'); }
      // "Is step me kya badla" chips — VARIABLES ka diff
      const ch = [];
      if (prevSt && idx - lastIdx === 1) {
        const sameFrame = !st.frames || !prevSt.frames || prevSt.frames.length === st.frames.length;
        if (sameFrame) {
          const old = {}; varRows(prevSt, params).forEach(([k, v]) => { old[k] = v; });
          varRows(st, params).forEach(([k, v]) => { if (old[k] !== v) ch.push([k, old[k], v]); });
        } else ch.push(['call stack', (prevSt.frames || []).length + ' frames', (st.frames || []).length + ' frames']);
      }
      const short = x => { x = x === undefined ? '—' : String(x); return x.length > 28 ? x.slice(0, 26) + '…' : x; };
      q('.vchanges').innerHTML = ch.length ? '<span class="muted small">Badla:</span> ' + ch.slice(0, 6).map(([k, a, b]) => `<span class="vchip"><b>${esc(k)}</b> ${a === undefined ? '' : esc(short(a)) + ' → '}<span>${esc(short(b))}</span></span>`).join('') : '';
      lastIdx = idx;
      const ctBox = q('.viz-calltree');
      if (ctree && ctOn) {
        ctBox.hidden = false;
        const body = q('.ct-body');
        body.innerHTML = callTreeHtml(ctree, idx, body.clientWidth - 8);
        const act = body.querySelector('.ct-node.active rect'), svg = body.querySelector('svg');
        if (act && act.getBBox) {
          const b0 = act.getBBox(), k = Number(svg && svg.dataset.sc) || 1;
          const bx = { x: b0.x * k, y: b0.y * k, width: b0.width * k, height: b0.height * k };
          if (bx.x < body.scrollLeft || bx.x + bx.width > body.scrollLeft + body.clientWidth) body.scrollLeft = Math.max(0, bx.x - body.clientWidth / 2); if (bx.y < body.scrollTop || bx.y + bx.height > body.scrollTop + body.clientHeight) body.scrollTop = Math.max(0, bx.y - body.clientHeight / 2); }
      } else ctBox.hidden = true;
      const pr = q('.viz-prog > div'); if (pr) pr.style.width = (steps.length > 1 ? (idx / (steps.length - 1)) * 100 : 100) + '%';
      el.querySelectorAll('.cl').forEach(c => c.classList.toggle('on', Number(c.dataset.ln) === st.line));
      const on = q('.cl.on'), pane = q('.codepane');
      if (on && pane) {
        const top = on.offsetTop - pane.offsetTop;
        if (top < pane.scrollTop || top > pane.scrollTop + pane.clientHeight - 30) pane.scrollTop = top - 40;
      }
      q('.viz-count').textContent = `Step ${idx + 1} / ${steps.length}`;
    }
    function stop() { clearInterval(timer); timer = null; playBtn.textContent = '▶ Play'; }
    el._vizStop = stop;
    function play() {
      if (idx >= steps.length - 1) idx = 0;
      playBtn.textContent = '⏸ Pause';
      timer = setInterval(() => {
        if (!document.body.contains(el)) return stop();
        if (idx < steps.length - 1) { idx++; show(); } else stop();
      }, 2200 - Number(speed.value));
    }

    const vizEl = q('.viz');
    el.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.t === 'input') vizEl.classList.toggle('show-input');
      if (b.dataset.t === 'tree') { ctOn = !ctOn; b.classList.toggle('primary', ctOn); show(); }
      if (b.dataset.t === 'quiz') { quizOn = !quizOn; b.classList.toggle('primary', quizOn); stop(); quizReset(); }
      if (b.dataset.t === 'full') {
        const on = !vizEl.classList.contains('full');
        vizEl.classList.toggle('full', on);
        document.body.classList.toggle('viz-full-open', on);
        b.textContent = on ? '✕ Band karo' : '⛶ Full screen';
        el.focus();
      }
    }));
    q('.viz-inputs').addEventListener('submit', e => { e.preventDefault(); el.querySelectorAll('[data-ex]').forEach(b => b.classList.remove('primary')); build(); });
    el.querySelectorAll('[data-ex]').forEach(b => b.addEventListener('click', () => {
      const ex = exs[Number(b.dataset.ex)], f = q('.viz-inputs');
      def.inputs.forEach(inp => { if (ex.viz && ex.viz[inp.key] !== undefined) f.elements[inp.key].value = ex.viz[inp.key]; });
      el.querySelectorAll('[data-ex]').forEach(x => x.classList.toggle('primary', x === b));
      build();
    }));
    el.querySelectorAll('[data-variant]').forEach(b => b.addEventListener('click', () => mount(el, lc, exIdx, b.dataset.variant)));
    q('.viz-controls').addEventListener('click', e => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      const act = a.dataset.a;
      if (act === 'first' || act === 'prev') { pending = false; if (quizOn) q('.vquiz').innerHTML = quizScore(); }
      if (act === 'first') { stop(); idx = 0; show(); }
      if (act === 'prev') { stop(); idx = Math.max(0, idx - 1); show(); }
      if (act === 'next') { stop(); if (quizOn) quizNext(); else { idx = Math.min(steps.length - 1, idx + 1); show(); } }
      if (act === 'play') { timer ? stop() : play(); }
    });
    speed.addEventListener('input', () => { if (timer) { stop(); play(); } });
    el.onkeydown = e => {
      if (e.key === 'Escape' && vizEl.classList.contains('full')) { q('[data-t="full"]').click(); return; }
      if (e.target.tagName === 'INPUT') return;
      if (e.key === ' ') { e.preventDefault(); timer ? stop() : play(); return; }
      if (e.key === 'ArrowRight') { stop(); if (quizOn) quizNext(); else { idx = Math.min(steps.length - 1, idx + 1); show(); } }
      if (e.key === 'ArrowLeft') { stop(); idx = Math.max(0, idx - 1); show(); }
    };
    el.tabIndex = 0;
    el.addEventListener('mousedown', e => { if (!e.target.closest('input')) setTimeout(() => { if (!el.contains(document.activeElement) || document.activeElement.tagName !== 'INPUT') el.focus({ preventScroll: true }); }, 0); });
    build();
  }

  // Doosri files (viz/phase-XX.js) yahan se helpers use karke VIZ.defs[lc] = {...} add karti hain
  window.VIZ = { defs, mount, util: { esc, parseArr, range, mapObj, fmt, recorder, buildTree, viewHtml, MAX_STEPS } };
})();
