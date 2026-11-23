// Phase 1 (Arrays) — Brute / Better tabs, LINE-BY-LINE debugger (v2, 2026-11-08).
// Har executable line ek step: method entry → har statement → har loop check → return. VARIABLES me saare locals.
// Final `ret` base (Optimal) visualizer se — format hamesha same.
(function () {
  const { recorder, fmt, MAX_STEPS } = VIZ.util;
  const Q = n => window.PHASE_CONTENT['arrays'].questions[n];
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
  // ---- views + Java-style value strings ----
  const A = (label, vals, hl, ptr) => ({ type: 'array', label, vals: vals.map(v => (v === null || v === undefined ? '' : v)), hl: hl || {}, ptr: ptr || [] });
  const M = (label, m, hl) => { const o = {}; m.forEach((v, k) => { o[k] = v; }); return { type: 'map', label, entries: o, hl }; };
  const S = (label, items, hl) => ({ type: 'set', label, items: [...items], hl });
  const iA = a => 'int[' + a.length + '] [' + a.map(v => (v === null || v === undefined ? 0 : v)).join(', ') + ']';
  const mS = (m, kind) => (kind || 'HashMap') + ' size=' + m.size + ' {' + [...m].map(([k, v]) => k + '=' + v).join(', ') + '}';
  const sS = (s, kind) => (kind || 'HashSet') + ' size=' + s.size + ' [' + [...s].join(', ') + ']';
  const rng = (a, b, cls, base) => { const o = Object.assign({}, base); for (let i = a; i <= b; i++) if (!o[i]) o[i] = cls; return o; };
  // tracer: render(o) → {views, vars}; st(snip|line, note, o); end(...) → steps (ret ke saath, MAX cap safe)
  function tracer(n, ap, render) {
    const ln = L(n, ap), rec = recorder(() => ({}));
    const st = (snip, note, o) => {
      o = o || {};
      const r = render(o);
      rec.s(typeof snip === 'number' ? snip : ln(snip), note, Object.assign({ views: r.views, vars: r.vars }, o.frames ? { frames: o.frames } : {}, o.ret !== undefined ? { ret: o.ret } : {}));
    };
    const end = (snip, note, ret, o) => { if (rec.steps.length >= MAX_STEPS) rec.steps.length = MAX_STEPS - 1; st(snip, note, Object.assign({}, o, { ret })); return rec.steps; };
    return { st, end, ln, steps: rec.steps };
  }

  // ================= LC 1920 — Brute (extra array) =================
  add(1920, [{
    label: 'Extra array', title: 'Build Array from Permutation (Brute: extra array)', ap: 0,
    run({ nums }) {
      let n, ans = null, i;
      const T = tracer(1920, 0, o => ({
        views: [A('nums', nums, o.hl, o.ptr), A('ans', ans || [], o.ahl)],
        vars: Object.assign({ nums: iA(nums) }, n !== undefined ? { n } : {}, ans ? { ans: iA(ans) } : {}, i !== undefined ? { i } : {}),
      }));
      T.st('public int[] buildArray', 'Method call — nums = ' + fmt(nums));
      n = nums.length; T.st('int n = nums.length', 'n = ' + n);
      ans = new Array(n).fill(0); T.st('int[] ans = new int[n]', 'ans = new int[' + n + '] — sab 0 (O(n) extra space)');
      for (i = 0; ; i++) {
        const go = i < n;
        T.st('for (int i = 0', 'i = ' + i + ' < ' + n + ' ? ' + (go ? 'haan' : 'nahi → loop khatam'), { hl: go ? { [i]: 'cur' } : {}, ptr: go ? [{ i, label: 'i' }] : [] });
        if (!go) break;
        ans[i] = nums[nums[i]];
        T.st('ans[i] = nums[nums[i]]', 'nums[' + i + '] = ' + nums[i] + ' → nums[' + nums[i] + '] = ' + ans[i] + ' → ans[' + i + '] = ' + ans[i], { hl: { [i]: 'cur', [nums[i]]: 'win' }, ptr: [{ i, label: 'i' }, { i: nums[i], label: 'nums[i]' }], ahl: { [i]: 'new' } });
      }
      return T.end('return ans', 'return ' + fmt(ans), finalRet(1920, { nums }), { ahl: rng(0, n - 1, 'found') });
    },
  }]);

  // ================= LC 1480 — Brute (har i pe 0..i dobara) =================
  add(1480, [{
    label: 'Har baar dobara jodo', title: 'Running Sum (Brute: O(n²))', ap: 0,
    run({ nums }) {
      let n, ans = null, i, j, sum;
      const T = tracer(1480, 0, o => ({
        views: [A('nums', nums, o.hl, o.ptr), A('ans', ans || [], o.ahl)],
        vars: Object.assign({ nums: iA(nums) }, n !== undefined ? { n } : {}, ans ? { ans: iA(ans) } : {}, i !== undefined ? { i } : {}, sum !== undefined ? { sum } : {}, j !== undefined ? { j } : {}),
      }));
      T.st('public int[] runningSum', 'Method call — nums = ' + fmt(nums));
      n = nums.length; T.st('int n = nums.length', 'n = ' + n);
      ans = new Array(n).fill(0); T.st('int[] ans = new int[n]', 'ans = new int[' + n + ']');
      for (i = 0; ; i++) {
        j = undefined; sum = undefined;
        const go = i < n;
        T.st('for (int i = 0', 'i = ' + i + ' < ' + n + ' ? ' + (go ? 'haan' : 'nahi → loop khatam'), { hl: go ? { [i]: 'cur' } : {}, ptr: go ? [{ i, label: 'i' }] : [] });
        if (!go) break;
        sum = 0; T.st('int sum = 0', 'sum = 0 — 0..' + i + ' ka total shuru se', { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] });
        for (j = 0; j <= i; j++) {
          sum += nums[j];
          T.st('for (int j = 0', 'j = ' + j + ': sum += nums[' + j + '] (' + nums[j] + ') → ' + sum, { hl: rng(0, j, 'win', { [i]: 'cur' }), ptr: [{ i, label: 'i' }, { i: j, label: 'j' }] });
        }
        j = undefined;
        ans[i] = sum; T.st('ans[i] = sum', 'ans[' + i + '] = ' + sum + ' — pichla kaam dobara hua (isliye O(n²))', { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }], ahl: { [i]: 'new' } });
      }
      return T.end('return ans', 'return ' + fmt(ans), finalRet(1480, { nums }), { ahl: rng(0, n - 1, 'found') });
    },
  }]);

  // ================= LC 217 — Brute (har pair) + Better (sort) =================
  add(217, [{
    label: 'Har pair', title: 'Contains Duplicate (Brute: har pair)', ap: 0,
    run({ nums }) {
      let i, j;
      const n = nums.length;
      const T = tracer(217, 0, o => ({ views: [A('nums', nums, o.hl, o.ptr)], vars: Object.assign({ nums: iA(nums) }, i !== undefined ? { i } : {}, j !== undefined ? { j } : {}) }));
      const P = () => [i !== undefined && i < n ? { i, label: 'i' } : null, j !== undefined && j < n ? { i: j, label: 'j' } : null].filter(Boolean);
      T.st('public boolean containsDuplicate', 'Method call — nums = ' + fmt(nums));
      for (i = 0; ; i++) {
        j = undefined;
        const go = i < n;
        T.st('for (int i = 0', 'i = ' + i + ' < ' + n + ' ? ' + (go ? 'haan' : 'nahi'), { hl: go ? { [i]: 'cur' } : {}, ptr: P() });
        if (!go) break;
        for (j = i + 1; ; j++) {
          const gj = j < n;
          T.st('for (int j = i + 1', 'j = ' + j + ' < ' + n + ' ? ' + (gj ? 'haan' : 'nahi → agla i'), { hl: Object.assign({ [i]: 'cur' }, gj ? { [j]: 'win' } : {}), ptr: P() });
          if (!gj) break;
          const eq = nums[i] === nums[j];
          if (eq) return T.end('if (nums[i] == nums[j])', 'nums[' + i + '] = ' + nums[i] + ' == nums[' + j + '] = ' + nums[j] + ' → return true', finalRet(217, { nums }), { hl: { [i]: 'found', [j]: 'found' }, ptr: P() });
          T.st('if (nums[i] == nums[j])', nums[i] + ' ≠ ' + nums[j], { hl: { [i]: 'cur', [j]: 'win' }, ptr: P() });
        }
      }
      i = undefined; j = undefined;
      return T.end('return false', 'Saare pairs alag → return false', finalRet(217, { nums }));
    },
  }, {
    label: 'Sort', title: 'Contains Duplicate (Better: sort + padosi)', ap: 1,
    run({ nums }) {
      let a = nums.slice(), i, sorted = false;
      const T = tracer(217, 1, o => ({ views: [A(sorted ? 'nums (sorted)' : 'nums', a, o.hl, o.ptr)], vars: Object.assign({ nums: iA(a) }, i !== undefined ? { i } : {}) }));
      T.st('public boolean containsDuplicate', 'Method call — nums = ' + fmt(nums));
      a = a.sort((x, y) => x - y); sorted = true;
      T.st('Arrays.sort(nums)', 'Sort → ' + fmt(a) + ' — duplicates ab saath-saath (O(n log n))');
      for (i = 1; ; i++) {
        const go = i < a.length;
        T.st('for (int i = 1', 'i = ' + i + ' < ' + a.length + ' ? ' + (go ? 'haan' : 'nahi'), { hl: go ? { [i]: 'cur', [i - 1]: 'win' } : {}, ptr: go ? [{ i, label: 'i' }] : [] });
        if (!go) break;
        if (a[i] === a[i - 1]) return T.end('if (nums[i] == nums[i - 1])', 'nums[' + i + '] = ' + a[i] + ' == nums[' + (i - 1) + '] → return true', finalRet(217, { nums }), { hl: { [i]: 'found', [i - 1]: 'found' }, ptr: [{ i, label: 'i' }] });
        T.st('if (nums[i] == nums[i - 1])', a[i] + ' ≠ ' + a[i - 1], { hl: { [i]: 'cur', [i - 1]: 'win' }, ptr: [{ i, label: 'i' }] });
      }
      i = undefined;
      return T.end('return false', 'Koi padosi barabar nahi → return false', finalRet(217, { nums }));
    },
  }]);

  // ================= LC 1 — Brute (har pair) + Better (sort + two pointers) =================
  add(1, [{
    label: 'Har pair', title: 'Two Sum (Brute: har pair)', ap: 0,
    run({ nums, target }) {
      let i, j;
      const n = nums.length;
      const T = tracer(1, 0, o => ({ views: [A('nums', nums, o.hl, o.ptr)], vars: Object.assign({ nums: iA(nums), target }, i !== undefined ? { i } : {}, j !== undefined ? { j } : {}) }));
      const P = () => [i !== undefined && i < n ? { i, label: 'i' } : null, j !== undefined && j < n ? { i: j, label: 'j' } : null].filter(Boolean);
      T.st('public int[] twoSum', 'Method call — nums = ' + fmt(nums) + ', target = ' + target);
      for (i = 0; ; i++) {
        j = undefined;
        const go = i < n;
        T.st('for (int i = 0', 'i = ' + i + ' < ' + n + ' ? ' + (go ? 'haan' : 'nahi'), { hl: go ? { [i]: 'cur' } : {}, ptr: P() });
        if (!go) break;
        for (j = i + 1; ; j++) {
          const gj = j < n;
          T.st('for (int j = i + 1', 'j = ' + j + ' < ' + n + ' ? ' + (gj ? 'haan' : 'nahi → agla i'), { hl: Object.assign({ [i]: 'cur' }, gj ? { [j]: 'win' } : {}), ptr: P() });
          if (!gj) break;
          const sum = nums[i] + nums[j];
          if (sum === target) return T.end('if (nums[i] + nums[j] == target)', nums[i] + ' + ' + nums[j] + ' = ' + sum + ' == ' + target + ' → return [' + i + ', ' + j + ']', finalRet(1, { nums, target }), { hl: { [i]: 'found', [j]: 'found' }, ptr: P() });
          T.st('if (nums[i] + nums[j] == target)', nums[i] + ' + ' + nums[j] + ' = ' + sum + ' ≠ ' + target, { hl: { [i]: 'cur', [j]: 'win' }, ptr: P() });
        }
      }
      i = undefined;
      return T.end('return new int[]{-1, -1}', 'Koi pair nahi', finalRet(1, { nums, target }));
    },
  }, {
    label: 'Sort + 2 pointers', title: 'Two Sum (Better: sort + two pointers)', ap: 1,
    run({ nums, target }) {
      let n, arr = null, l, r, sum, i;
      const T = tracer(1, 1, o => ({
        views: arr ? [A('nums', nums), A('arr[][0] value', arr.map(x => x[0]), o.hl, o.ptr), A('arr[][1] index', arr.map(x => x[1]), o.hl)] : [A('nums', nums)],
        vars: Object.assign({ nums: iA(nums), target }, n !== undefined ? { n } : {}, arr ? { arr: 'int[' + arr.length + '][2] ' + arr.map(x => '{' + x[0] + ',' + x[1] + '}').join(' ') } : {}, i !== undefined ? { i } : {}, l !== undefined ? { l, r } : {}, sum !== undefined ? { sum } : {}),
      }));
      T.st('public int[] twoSum', 'Method call — nums = ' + fmt(nums) + ', target = ' + target);
      n = nums.length; T.st('int n = nums.length', 'n = ' + n);
      arr = nums.map(() => [0, 0]); T.st('int[][] arr = new int[n][2]', '{value, originalIndex} pairs ke liye jagah');
      for (i = 0; i < n; i++) { arr[i] = [nums[i], i]; T.st('for (int i = 0; i < n; i++) arr[i]', 'arr[' + i + '] = {' + nums[i] + ', ' + i + '}', { hl: { [i]: 'new' } }); }
      i = undefined;
      arr.sort((a, b) => a[0] - b[0]); T.st('Arrays.sort(arr', 'Value se sort (original index saath) → O(n log n)');
      l = 0; r = n - 1; T.st('int l = 0, r = n - 1', 'l = 0, r = ' + r, { hl: { [l]: 'cur', [r]: 'win' }, ptr: [{ i: l, label: 'l' }, { i: r, label: 'r' }] });
      while (true) {
        const go = l < r;
        T.st('while (l < r)', 'l = ' + l + ' < r = ' + r + ' ? ' + (go ? 'haan' : 'nahi'), { hl: go ? { [l]: 'cur', [r]: 'win' } : {}, ptr: [{ i: l, label: 'l' }, { i: r, label: 'r' }] });
        if (!go) break;
        sum = arr[l][0] + arr[r][0];
        T.st('int sum = arr[l][0] + arr[r][0]', 'sum = ' + arr[l][0] + ' + ' + arr[r][0] + ' = ' + sum, { hl: { [l]: 'cur', [r]: 'win' }, ptr: [{ i: l, label: 'l' }, { i: r, label: 'r' }] });
        if (sum === target) return T.end('if (sum == target)', sum + ' == ' + target + ' → original indices [' + arr[l][1] + ', ' + arr[r][1] + ']', finalRet(1, { nums, target }), { hl: { [l]: 'found', [r]: 'found' }, ptr: [{ i: l, label: 'l' }, { i: r, label: 'r' }] });
        T.st('if (sum == target)', sum + ' ≠ ' + target, { hl: { [l]: 'cur', [r]: 'win' }, ptr: [{ i: l, label: 'l' }, { i: r, label: 'r' }] });
        if (sum < target) { l++; T.st('if (sum < target) l++', sum + ' < ' + target + ' → bada chahiye → l++ = ' + l, { hl: { [l]: 'new' }, ptr: [{ i: l, label: 'l' }, { i: r, label: 'r' }] }); }
        else {
          T.st('if (sum < target) l++', sum + ' < ' + target + ' ? nahi → else', { hl: { [l]: 'cur', [r]: 'win' }, ptr: [{ i: l, label: 'l' }, { i: r, label: 'r' }] });
          r--; T.st('else r--', sum + ' > ' + target + ' → chhota chahiye → r-- = ' + r, { hl: { [r]: 'new' }, ptr: [{ i: l, label: 'l' }, { i: r, label: 'r' }] });
        }
      }
      return T.end('return new int[]{-1, -1}', 'Koi pair nahi', finalRet(1, { nums, target }));
    },
  }]);

  // ================= LC 53 — Brute (O(n³)) + Better (O(n²)) =================
  add(53, [{
    label: 'Har subarray', title: 'Maximum Subarray (Brute: O(n³))', ap: 0,
    run({ nums }) {
      let n, max, i, j, k, sum;
      const T = tracer(53, 0, o => ({ views: [A('nums', nums, o.hl, o.ptr)], vars: Object.assign({ nums: iA(nums) }, n !== undefined ? { n, max: max === -Infinity ? 'MIN_VALUE' : max } : {}, i !== undefined ? { i } : {}, j !== undefined ? { j } : {}, sum !== undefined ? { sum } : {}, k !== undefined ? { k } : {}) }));
      const P = () => [i !== undefined ? { i, label: 'i' } : null, j !== undefined ? { i: j, label: 'j' } : null, k !== undefined ? { i: k, label: 'k' } : null].filter(x => x && x.i < nums.length);
      T.st('public int maxSubArray', 'Method call — nums = ' + fmt(nums));
      n = nums.length; max = -Infinity; T.st('int n = nums.length, max', 'n = ' + n + ', max = MIN_VALUE');
      for (i = 0; ; i++) {
        j = undefined;
        if (i >= n) { T.st('for (int i = 0', 'i = ' + i + ' → loop khatam'); break; }
        T.st('for (int i = 0', 'i = ' + i + ' — yahan se shuru hone wale saare subarrays', { hl: { [i]: 'cur' }, ptr: P() });
        for (j = i; j < n; j++) {
          T.st('for (int j = i', 'j = ' + j + ' → subarray [' + i + '..' + j + ']', { hl: rng(i, j, 'win'), ptr: P() });
          sum = 0; T.st('int sum = 0', 'sum = 0 — ye subarray fresh joda jaayega', { hl: rng(i, j, 'win'), ptr: P() });
          for (k = i; k <= j; k++) { sum += nums[k]; T.st('for (int k = i', 'k = ' + k + ': sum += ' + nums[k] + ' → ' + sum, { hl: rng(i, k, 'cur', rng(i, j, 'win')), ptr: P() }); }
          k = undefined;
          const better = sum > max; max = Math.max(max, sum);
          T.st('max = Math.max(max, sum)', 'max = max(…, ' + sum + ') = ' + max + (better ? ' (naya max!)' : ''), { hl: rng(i, j, better ? 'found' : 'win'), ptr: P() });
          sum = undefined;
        }
      }
      i = undefined;
      return T.end('return max', 'return ' + max, finalRet(53, { nums }));
    },
  }, {
    label: 'Running sum', title: 'Maximum Subarray (Better: running sum, O(n²))', ap: 1,
    run({ nums }) {
      let n, max, i, j, sum;
      const T = tracer(53, 1, o => ({ views: [A('nums', nums, o.hl, o.ptr)], vars: Object.assign({ nums: iA(nums) }, n !== undefined ? { n, max: max === -Infinity ? 'MIN_VALUE' : max } : {}, i !== undefined ? { i } : {}, sum !== undefined ? { sum } : {}, j !== undefined ? { j } : {}) }));
      const P = () => [i !== undefined ? { i, label: 'i' } : null, j !== undefined ? { i: j, label: 'j' } : null].filter(x => x && x.i < nums.length);
      T.st('public int maxSubArray', 'Method call — nums = ' + fmt(nums));
      n = nums.length; max = -Infinity; T.st('int n = nums.length, max', 'n = ' + n + ', max = MIN_VALUE');
      for (i = 0; ; i++) {
        j = undefined; sum = undefined;
        if (i >= n) { T.st('for (int i = 0', 'i = ' + i + ' → loop khatam'); break; }
        T.st('for (int i = 0', 'i = ' + i, { hl: { [i]: 'cur' }, ptr: P() });
        sum = 0; T.st('int sum = 0', 'sum = 0', { hl: { [i]: 'cur' }, ptr: P() });
        for (j = i; j < n; j++) {
          T.st('for (int j = i', 'j = ' + j, { hl: rng(i, j, 'win'), ptr: P() });
          sum += nums[j]; T.st('sum += nums[j]', 'sum += ' + nums[j] + ' → ' + sum + ' (pichla sum reuse — teesra loop nahi)', { hl: rng(i, j, 'win', { [j]: 'cur' }), ptr: P() });
          const better = sum > max; max = Math.max(max, sum);
          T.st('max = Math.max(max, sum)', 'max = ' + max + (better ? ' (naya max!)' : ''), { hl: rng(i, j, better ? 'found' : 'win'), ptr: P() });
        }
      }
      i = undefined; sum = undefined;
      return T.end('return max', 'return ' + max, finalRet(53, { nums }));
    },
  }]);

  // ================= LC 26 — Brute (TreeSet) =================
  add(26, [{
    label: 'TreeSet', title: 'Remove Duplicates (Brute: TreeSet)', ap: 0,
    run({ nums }) {
      const a = nums.slice();
      let set = null, k, x;
      const sorted = () => [...set].sort((p, q) => p - q);
      const T = tracer(26, 0, o => ({
        views: [A('nums', a, o.hl, o.ptr)].concat(set ? [S('TreeSet set', sorted(), o.shl)] : []),
        vars: Object.assign({ nums: iA(a) }, set ? { set: 'TreeSet size=' + set.size + ' [' + sorted().join(', ') + ']' } : {}, x !== undefined ? { x } : {}, k !== undefined ? { k } : {}),
      }));
      T.st('public int removeDuplicates', 'Method call — nums = ' + fmt(nums));
      set = new Set(); T.st('Set<Integer> set = new TreeSet<>()', 'TreeSet — sorted + unique');
      for (let i = 0; i < a.length; i++) { x = a[i]; const was = set.has(x); set.add(x); T.st('for (int x : nums) set.add(x)', 'set.add(' + x + ')' + (was ? ' → pehle se hai (duplicate ignore)' : ''), { hl: { [i]: was ? 'skip' : 'cur' }, ptr: [{ i, label: 'x' }], shl: x }); }
      x = undefined;
      k = 0; T.st('int k = 0', 'k = 0 — ab set ki values aage likhenge');
      sorted().forEach(v => { x = v; a[k] = v; T.st('for (int x : set) nums[k++] = x', 'nums[' + k + '] = ' + v + ', k++', { hl: rng(0, k - 1, 'done', { [k]: 'new' }), ptr: [{ i: k, label: 'k' }], shl: v }); k++; });
      x = undefined;
      return T.end('return k', 'return ' + k + ' — O(n) extra set (Optimal me nahi)', finalRet(26, { nums }), { hl: rng(0, k - 1, 'found') });
    },
  }]);

  // ================= LC 238 — Brute + Better (3 arrays) =================
  add(238, [{
    label: 'Har i pe sab multiply', title: 'Product Except Self (Brute: O(n²))', ap: 0,
    run({ nums }) {
      let n, ans = null, i, j, p;
      const T = tracer(238, 0, o => ({ views: [A('nums', nums, o.hl, o.ptr), A('ans', ans || [], o.ahl)], vars: Object.assign({ nums: iA(nums) }, n !== undefined ? { n } : {}, ans ? { ans: iA(ans) } : {}, i !== undefined ? { i } : {}, p !== undefined ? { p } : {}, j !== undefined ? { j } : {}) }));
      const P = () => [i !== undefined && i < nums.length ? { i, label: 'i' } : null, j !== undefined && j < nums.length ? { i: j, label: 'j' } : null].filter(Boolean);
      T.st('public int[] productExceptSelf', 'Method call — nums = ' + fmt(nums));
      n = nums.length; T.st('int n = nums.length', 'n = ' + n);
      ans = new Array(n).fill(0); T.st('int[] ans = new int[n]', 'ans = new int[' + n + ']');
      for (i = 0; ; i++) {
        j = undefined; p = undefined;
        if (i >= n) { T.st('for (int i = 0', 'i = ' + i + ' → loop khatam'); break; }
        T.st('for (int i = 0', 'i = ' + i, { hl: { [i]: 'cur' }, ptr: P() });
        p = 1; T.st('int p = 1', 'p = 1', { hl: { [i]: 'cur' }, ptr: P() });
        for (j = 0; j < n; j++) {
          T.st('for (int j = 0', 'j = ' + j, { hl: { [i]: 'cur', [j]: 'win' }, ptr: P() });
          if (j !== i) { p *= nums[j]; T.st('if (j != i) p *= nums[j]', 'j ≠ i → p *= ' + nums[j] + ' → ' + p, { hl: { [i]: 'cur', [j]: 'win' }, ptr: P() }); }
          else T.st('if (j != i) p *= nums[j]', 'j == i → skip (khud ko nahi)', { hl: { [i]: 'cur', [j]: 'skip' }, ptr: P() });
        }
        j = undefined;
        ans[i] = p; T.st('ans[i] = p', 'ans[' + i + '] = ' + p, { hl: { [i]: 'cur' }, ptr: P(), ahl: { [i]: 'new' } });
      }
      i = undefined; p = undefined;
      return T.end('return ans', 'return ' + fmt(ans), finalRet(238, { nums }), { ahl: rng(0, n - 1, 'found') });
    },
  }, {
    label: 'left[] + right[]', title: 'Product Except Self (Better: left[] × right[])', ap: 1,
    run({ nums }) {
      let n, left = null, right = null, ans = null, i;
      const T = tracer(238, 1, o => ({
        views: [A('nums', nums, o.hl, o.ptr)].concat(left ? [A('left', left, o.lh), A('right', right, o.rh), A('ans', ans, o.ah)] : []),
        vars: Object.assign({ nums: iA(nums) }, n !== undefined ? { n } : {}, left ? { left: iA(left), right: iA(right), ans: iA(ans) } : {}, i !== undefined ? { i } : {}),
      }));
      T.st('public int[] productExceptSelf', 'Method call — nums = ' + fmt(nums));
      n = nums.length; T.st('int n = nums.length', 'n = ' + n);
      left = new Array(n).fill(0); right = new Array(n).fill(0); ans = new Array(n).fill(0);
      T.st('int[] left = new int[n]', 'teen naye arrays (O(n) extra)');
      left[0] = 1; T.st('left[0] = 1', 'left[0] = 1 (index 0 ke left me kuch nahi)', { lh: { 0: 'new' } });
      for (i = 1; i < n; i++) { left[i] = left[i - 1] * nums[i - 1]; T.st('for (int i = 1; i < n; i++) left[i]', 'left[' + i + '] = left[' + (i - 1) + '] × nums[' + (i - 1) + '] = ' + left[i], { hl: { [i - 1]: 'win' }, ptr: [{ i, label: 'i' }], lh: { [i]: 'new' } }); }
      i = undefined;
      right[n - 1] = 1; T.st('right[n - 1] = 1', 'right[' + (n - 1) + '] = 1 (aakhri ke right me kuch nahi)', { rh: { [n - 1]: 'new' } });
      for (i = n - 2; i >= 0; i--) { right[i] = right[i + 1] * nums[i + 1]; T.st('for (int i = n - 2; i >= 0; i--) right[i]', 'right[' + i + '] = right[' + (i + 1) + '] × nums[' + (i + 1) + '] = ' + right[i], { hl: { [i + 1]: 'win' }, ptr: [{ i, label: 'i' }], rh: { [i]: 'new' } }); }
      i = undefined;
      for (i = 0; i < n; i++) { ans[i] = left[i] * right[i]; T.st('for (int i = 0; i < n; i++) ans[i]', 'ans[' + i + '] = ' + left[i] + ' × ' + right[i] + ' = ' + ans[i], { ptr: [{ i, label: 'i' }], lh: { [i]: 'cur' }, rh: { [i]: 'cur' }, ah: { [i]: 'new' } }); }
      i = undefined;
      return T.end('return ans', 'return ' + fmt(ans) + ' — 2 extra arrays (Optimal me nahi)', finalRet(238, { nums }), { ah: rng(0, n - 1, 'found') });
    },
  }]);

  // ================= LC 560 — Brute (O(n³)) + Better (O(n²)) =================
  add(560, [{
    label: 'Har subarray', title: 'Subarray Sum Equals K (Brute: O(n³))', ap: 0,
    run({ nums, k }) {
      let n, count, i, j, x, sum;
      const T = tracer(560, 0, o => ({ views: [A('nums', nums, o.hl, o.ptr)], vars: Object.assign({ nums: iA(nums), k }, n !== undefined ? { n, count } : {}, i !== undefined ? { i } : {}, j !== undefined ? { j } : {}, sum !== undefined ? { sum } : {}, x !== undefined ? { x } : {}) }));
      const P = () => [i !== undefined ? { i, label: 'i' } : null, j !== undefined ? { i: j, label: 'j' } : null, x !== undefined ? { i: x, label: 'x' } : null].filter(q => q && q.i < nums.length);
      T.st('public int subarraySum', 'Method call — nums = ' + fmt(nums) + ', k = ' + k);
      n = nums.length; count = 0; T.st('int n = nums.length, count = 0', 'n = ' + n + ', count = 0');
      for (i = 0; ; i++) {
        j = undefined;
        if (i >= n) { T.st('for (int i = 0', 'i = ' + i + ' → loop khatam'); break; }
        T.st('for (int i = 0', 'i = ' + i, { hl: { [i]: 'cur' }, ptr: P() });
        for (j = i; j < n; j++) {
          T.st('for (int j = i', 'j = ' + j + ' → subarray [' + i + '..' + j + ']', { hl: rng(i, j, 'win'), ptr: P() });
          sum = 0; T.st('int sum = 0', 'sum = 0', { hl: rng(i, j, 'win'), ptr: P() });
          for (x = i; x <= j; x++) { sum += nums[x]; T.st('for (int x = i', 'x = ' + x + ': sum += ' + nums[x] + ' → ' + sum, { hl: rng(i, x, 'cur', rng(i, j, 'win')), ptr: P() }); }
          x = undefined;
          const hit = sum === k; if (hit) count++;
          T.st('if (sum == k) count++', 'sum = ' + sum + (hit ? ' == k → count = ' + count : ' ≠ ' + k), { hl: rng(i, j, hit ? 'found' : 'win'), ptr: P() });
          sum = undefined;
        }
      }
      i = undefined;
      return T.end('return count', 'return ' + count, finalRet(560, { nums, k }));
    },
  }, {
    label: 'Running sum', title: 'Subarray Sum Equals K (Better: running sum, O(n²))', ap: 1,
    run({ nums, k }) {
      let count, i, j, sum;
      const n = nums.length;
      const T = tracer(560, 1, o => ({ views: [A('nums', nums, o.hl, o.ptr)], vars: Object.assign({ nums: iA(nums), k }, count !== undefined ? { count } : {}, i !== undefined ? { i } : {}, sum !== undefined ? { sum } : {}, j !== undefined ? { j } : {}) }));
      const P = () => [i !== undefined ? { i, label: 'i' } : null, j !== undefined ? { i: j, label: 'j' } : null].filter(q => q && q.i < n);
      T.st('public int subarraySum', 'Method call — nums = ' + fmt(nums) + ', k = ' + k);
      count = 0; T.st('int count = 0', 'count = 0');
      for (i = 0; ; i++) {
        j = undefined; sum = undefined;
        if (i >= n) { T.st('for (int i = 0', 'i = ' + i + ' → loop khatam'); break; }
        T.st('for (int i = 0', 'i = ' + i, { hl: { [i]: 'cur' }, ptr: P() });
        sum = 0; T.st('int sum = 0', 'sum = 0', { hl: { [i]: 'cur' }, ptr: P() });
        for (j = i; j < n; j++) {
          T.st('for (int j = i', 'j = ' + j, { hl: rng(i, j, 'win'), ptr: P() });
          sum += nums[j]; T.st('sum += nums[j]', 'sum += ' + nums[j] + ' → ' + sum, { hl: rng(i, j, 'win', { [j]: 'cur' }), ptr: P() });
          const hit = sum === k; if (hit) count++;
          T.st('if (sum == k) count++', 'sum = ' + sum + (hit ? ' == k → count = ' + count : ' ≠ ' + k), { hl: rng(i, j, hit ? 'found' : 'win'), ptr: P() });
        }
      }
      i = undefined; sum = undefined;
      return T.end('return count', 'return ' + count, finalRet(560, { nums, k }));
    },
  }]);

  // ================= LC 525 — Brute + Optimal (first[] array) =================
  add(525, [{
    label: 'Har subarray gino', title: 'Contiguous Array (Brute: O(n²))', ap: 0,
    run({ nums }) {
      let n, max, i, j, zeros, ones;
      const T = tracer(525, 0, o => ({ views: [A('nums', nums, o.hl, o.ptr)], vars: Object.assign({ nums: iA(nums) }, n !== undefined ? { n, max } : {}, i !== undefined ? { i } : {}, zeros !== undefined ? { zeros, ones } : {}, j !== undefined ? { j } : {}) }));
      const P = () => [i !== undefined ? { i, label: 'i' } : null, j !== undefined ? { i: j, label: 'j' } : null].filter(q => q && q.i < nums.length);
      T.st('public int findMaxLength', 'Method call — nums = ' + fmt(nums));
      n = nums.length; max = 0; T.st('int n = nums.length, max = 0', 'n = ' + n + ', max = 0');
      for (i = 0; ; i++) {
        j = undefined; zeros = undefined;
        if (i >= n) { T.st('for (int i = 0', 'i = ' + i + ' → loop khatam'); break; }
        T.st('for (int i = 0', 'i = ' + i, { hl: { [i]: 'cur' }, ptr: P() });
        zeros = 0; ones = 0; T.st('int zeros = 0, ones = 0', 'zeros = 0, ones = 0', { hl: { [i]: 'cur' }, ptr: P() });
        for (j = i; j < n; j++) {
          T.st('for (int j = i', 'j = ' + j, { hl: rng(i, j, 'win'), ptr: P() });
          if (nums[j] === 0) zeros++; else ones++;
          T.st('if (nums[j] == 0) zeros++', 'nums[' + j + '] = ' + nums[j] + ' → zeros = ' + zeros + ', ones = ' + ones, { hl: rng(i, j, 'win', { [j]: 'cur' }), ptr: P() });
          const eq = zeros === ones, better = eq && j - i + 1 > max;
          if (better) max = j - i + 1;
          T.st('if (zeros == ones)', eq ? 'barabar → length ' + (j - i + 1) + (better ? ' → max = ' + max : '') : zeros + ' ≠ ' + ones, { hl: rng(i, j, eq ? 'found' : 'win'), ptr: P() });
        }
      }
      i = undefined; zeros = undefined;
      return T.end('return max', 'return ' + max, finalRet(525, { nums }));
    },
  }, {
    label: 'Array (HashMap ki jagah)', title: 'Contiguous Array (Optimal: first[] array, offset n)', ap: 2,
    run({ nums }) {
      let n, first = null, bal, max, i;
      const T = tracer(525, 2, o => ({
        views: [A('nums', nums, o.hl, o.ptr)].concat(first ? [A('first[bal+n]', first.map(x => (x === -2 ? '' : x)), o.fh)] : []),
        vars: Object.assign({ nums: iA(nums) }, n !== undefined ? { n } : {}, first ? { first: 'int[' + first.length + '] [' + first.join(', ') + ']' } : {}, bal !== undefined ? { bal, max } : {}, i !== undefined ? { i } : {}),
      }));
      T.st('public int findMaxLength', 'Method call — nums = ' + fmt(nums));
      n = nums.length; T.st('int n = nums.length', 'n = ' + n);
      first = new Array(2 * n + 1).fill(0); T.st('int[] first = new int[2 * n + 1]', 'balance −' + n + '..' + n + ' → index 0..' + 2 * n + ' (bal + n)');
      first.fill(-2); T.st('Arrays.fill(first, -2)', 'sab −2 = abhi tak nahi dekha');
      first[n] = -1; T.st('first[n] = -1', 'balance 0 → "index −1" (khaali prefix)', { fh: { [n]: 'new' } });
      bal = 0; max = 0; T.st('int bal = 0, max = 0', 'bal = 0, max = 0');
      for (i = 0; ; i++) {
        if (i >= n) { T.st('for (int i = 0', 'i = ' + i + ' → loop khatam'); break; }
        T.st('for (int i = 0', 'i = ' + i, { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] });
        bal += nums[i] === 1 ? 1 : -1;
        T.st('bal += nums[i] == 1 ? 1 : -1', 'nums[' + i + '] = ' + nums[i] + ' → bal = ' + bal + ' (index ' + (bal + n) + ')', { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }], fh: { [bal + n]: 'cur' } });
        const at = bal + n;
        if (first[at] !== -2) {
          const len = i - first[at]; max = Math.max(max, len);
          T.st('if (first[bal + n] != -2)', 'bal ' + bal + ' pehle index ' + first[at] + ' pe → length ' + len + ' → max = ' + max, { hl: rng(first[at] + 1, i, 'found'), ptr: [{ i, label: 'i' }], fh: { [at]: 'found' } });
        } else {
          T.st('if (first[bal + n] != -2)', 'bal ' + bal + ' pehli baar', { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }], fh: { [at]: 'cur' } });
          first[at] = i; T.st('else first[bal + n] = i', 'first[' + at + '] = ' + i, { hl: { [i]: 'cur' }, ptr: [{ i, label: 'i' }], fh: { [at]: 'new' } });
        }
      }
      i = undefined;
      return T.end('return max', 'return ' + max, finalRet(525, { nums }));
    },
  }]);

  // ================= LC 41 — Brute + Better (HashSet) =================
  add(41, [{
    label: 'Har x ke liye scan', title: 'First Missing Positive (Brute: O(n²))', ap: 0,
    run({ nums }) {
      let n, x, found, vi;
      const T = tracer(41, 0, o => ({ views: [A('nums', nums, o.hl, o.ptr)], vars: Object.assign({ nums: iA(nums) }, n !== undefined ? { n } : {}, x !== undefined ? { x } : {}, found !== undefined ? { found } : {}, vi !== undefined ? { v: nums[vi] } : {}) }));
      T.st('public int firstMissingPositive', 'Method call — nums = ' + fmt(nums));
      n = nums.length; T.st('int n = nums.length', 'n = ' + n);
      for (x = 1; ; x++) {
        found = undefined; vi = undefined;
        if (x > n + 1) { T.st('for (int x = 1', 'x = ' + x + ' > n + 1 → loop khatam'); break; }
        T.st('for (int x = 1', 'x = ' + x + ' — kya ye array me hai?');
        found = false; T.st('boolean found = false', 'found = false');
        for (vi = 0; vi < n; vi++) {
          T.st('for (int v : nums)', 'v = nums[' + vi + '] = ' + nums[vi], { hl: { [vi]: 'cur' }, ptr: [{ i: vi, label: 'v' }] });
          if (nums[vi] === x) { found = true; T.st('if (v == x) { found = true; break; }', nums[vi] + ' == ' + x + ' → found = true, break', { hl: { [vi]: 'found' }, ptr: [{ i: vi, label: 'v' }] }); break; }
          T.st('if (v == x) { found = true; break; }', nums[vi] + ' ≠ ' + x, { hl: { [vi]: 'skip' }, ptr: [{ i: vi, label: 'v' }] });
        }
        vi = undefined;
        if (!found) return T.end('if (!found) return x', x + ' poore array me nahi → return ' + x, finalRet(41, { nums }));
        T.st('if (!found) return x', x + ' mil gaya → agla x');
      }
      return T.end('return n + 1', 'return ' + (n + 1), finalRet(41, { nums }));
    },
  }, {
    label: 'HashSet', title: 'First Missing Positive (Better: HashSet)', ap: 1,
    run({ nums }) {
      let set = null, x;
      const T = tracer(41, 1, o => ({ views: [A('nums', nums, o.hl, o.ptr)].concat(set ? [S('HashSet set', set, o.shl)] : []), vars: Object.assign({ nums: iA(nums) }, set ? { set: sS(set) } : {}, x !== undefined ? { x } : {}) }));
      T.st('public int firstMissingPositive', 'Method call — nums = ' + fmt(nums));
      set = new Set(); T.st('Set<Integer> set = new HashSet<>()', 'Khaali HashSet (O(n) extra space)');
      nums.forEach((v, i) => { x = v; set.add(v); T.st('for (int x : nums) set.add(x)', 'set.add(' + v + ')', { hl: { [i]: 'cur' }, ptr: [{ i, label: 'x' }], shl: v }); });
      for (x = 1; ; x++) {
        if (x > nums.length + 1) { T.st('for (int x = 1', 'x = ' + x + ' → loop khatam'); break; }
        T.st('for (int x = 1', 'x = ' + x, { shl: x });
        if (!set.has(x)) return T.end('if (!set.contains(x)) return x', 'set.contains(' + x + ') = false → return ' + x, finalRet(41, { nums }), { shl: x });
        T.st('if (!set.contains(x)) return x', 'set.contains(' + x + ') = true → agla', { shl: x });
      }
      return T.end('return nums.length + 1', 'return ' + (nums.length + 1), finalRet(41, { nums }));
    },
  }]);

  // ================= LC 128 — Brute (linear search helper) + Better (sort) =================
  add(128, [{
    label: 'Linear search', title: 'Longest Consecutive (Brute: har x se linear search)', ap: 0,
    run({ nums }) {
      let best, x, xi, len;
      const T = tracer(128, 0, o => ({ views: [A('nums', nums, o.hl, o.ptr)], vars: Object.assign({ nums: iA(nums) }, best !== undefined ? { best } : {}, x !== undefined ? { x } : {}, len !== undefined ? { len } : {}) }));
      const frames = (t, scanI, line) => [{ method: 'contains', args: 'a, t=' + t, vars: Object.assign({ a: iA(nums), t }, scanI !== undefined ? { v: nums[scanI] } : {}) }, { method: 'longestConsecutive', args: 'nums', line: T.ln('while (contains(nums, x + len))'), vars: { nums: iA(nums), best, x, len } }];
      T.st('public int longestConsecutive', 'Method call — nums = ' + fmt(nums));
      best = 0; T.st('int best = 0', 'best = 0');
      for (xi = 0; xi < nums.length; xi++) {
        x = nums[xi]; len = undefined;
        T.st('for (int x : nums)', 'x = ' + x, { hl: { [xi]: 'cur' }, ptr: [{ i: xi, label: 'x' }] });
        len = 1; T.st('int len = 1', 'len = 1', { hl: { [xi]: 'cur' }, ptr: [{ i: xi, label: 'x' }] });
        while (true) {
          const t = x + len, at = nums.indexOf(t);
          T.st('while (contains(nums, x + len))', 'contains(nums, ' + t + ') call…', { hl: { [xi]: 'cur' }, ptr: [{ i: xi, label: 'x' }] });
          const upto = at >= 0 ? at : nums.length - 1;
          T.st('for (int v : a) if (v == t) return true', 'contains: ' + (at >= 0 ? t + ' index ' + at + ' pe mila (' + (at + 1) + ' elements scan) → true' : 'poora array scan, ' + t + ' nahi'), { hl: rng(0, upto, 'win', at >= 0 ? { [at]: 'found' } : {}), frames: frames(t, upto, 0) });
          if (at < 0) { T.st('return false;', 'contains → false', { frames: frames(t) }); break; }
          len++; T.st('while (contains(nums, x + len)) len++', 'true → len = ' + len, { hl: { [xi]: 'cur', [at]: 'found' }, ptr: [{ i: xi, label: 'x' }] });
        }
        const nb = Math.max(best, len);
        T.st('best = Math.max(best, len)', 'best = max(' + best + ', ' + len + ') = ' + nb, { hl: { [xi]: nb > best ? 'found' : 'cur' }, ptr: [{ i: xi, label: 'x' }] });
        best = nb;
      }
      x = undefined; len = undefined;
      return T.end('return best', 'return ' + best, finalRet(128, { nums }));
    },
  }, {
    label: 'Sort', title: 'Longest Consecutive (Better: sort)', ap: 1,
    run({ nums }) {
      let a = nums.slice(), best, cur, i, sorted = false;
      const T = tracer(128, 1, o => ({ views: [A(sorted ? 'nums (sorted)' : 'nums', a, o.hl, o.ptr)], vars: Object.assign({ nums: iA(a) }, best !== undefined ? { best, cur } : {}, i !== undefined ? { i } : {}) }));
      T.st('public int longestConsecutive', 'Method call — nums = ' + fmt(nums));
      if (!a.length) return T.end('if (nums.length == 0) return 0', 'Khaali array → 0', finalRet(128, { nums }));
      T.st('if (nums.length == 0) return 0', 'length ' + a.length + ' → aage');
      a = a.sort((x, y) => x - y); sorted = true; T.st('Arrays.sort(nums)', 'Sort → ' + fmt(a));
      best = 1; cur = 1; T.st('int best = 1, cur = 1', 'best = 1, cur = 1');
      for (i = 1; ; i++) {
        if (i >= a.length) { T.st('for (int i = 1', 'i = ' + i + ' → loop khatam'); break; }
        const P = { hl: { [i]: 'cur', [i - 1]: 'win' }, ptr: [{ i, label: 'i' }] };
        T.st('for (int i = 1', 'i = ' + i, P);
        if (a[i] === a[i - 1]) { T.st('if (nums[i] == nums[i - 1]) continue', a[i] + ' == ' + a[i - 1] + ' → duplicate, continue', P); continue; }
        T.st('if (nums[i] == nums[i - 1]) continue', 'duplicate nahi', P);
        if (a[i] === a[i - 1] + 1) { cur++; T.st('if (nums[i] == nums[i - 1] + 1) cur++', a[i] + ' = ' + a[i - 1] + ' + 1 → cur = ' + cur, P); }
        else { T.st('if (nums[i] == nums[i - 1] + 1) cur++', a[i] + ' ≠ ' + a[i - 1] + ' + 1', P); cur = 1; T.st('else cur = 1', 'cur = 1 (naya run)', P); }
        best = Math.max(best, cur); T.st('best = Math.max(best, cur)', 'best = ' + best, P);
      }
      i = undefined;
      return T.end('return best', 'return ' + best + ' (sort ki wajah se O(n log n))', finalRet(128, { nums }));
    },
  }]);

  // ================= LC 169 — Brute + Better (HashMap) =================
  add(169, [{
    label: 'Har x gino', title: 'Majority Element (Brute: O(n²))', ap: 0,
    run({ nums }) {
      let n, x, xi, cnt, yi;
      const T = tracer(169, 0, o => ({ views: [A('nums', nums, o.hl, o.ptr)], vars: Object.assign({ nums: iA(nums) }, n !== undefined ? { n, 'n / 2': Math.floor(n / 2) } : {}, x !== undefined ? { x } : {}, cnt !== undefined ? { cnt } : {}, yi !== undefined ? { y: nums[yi] } : {}) }));
      T.st('public int majorityElement', 'Method call — nums = ' + fmt(nums));
      n = nums.length; T.st('int n = nums.length', 'n = ' + n + ' → majority ko ' + Math.floor(n / 2) + ' se zyada chahiye');
      for (xi = 0; xi < n; xi++) {
        x = nums[xi]; cnt = undefined; yi = undefined;
        T.st('for (int x : nums)', 'x = ' + x, { hl: { [xi]: 'cur' }, ptr: [{ i: xi, label: 'x' }] });
        cnt = 0; T.st('int cnt = 0', 'cnt = 0', { hl: { [xi]: 'cur' }, ptr: [{ i: xi, label: 'x' }] });
        const seen = {};
        for (yi = 0; yi < n; yi++) {
          if (nums[yi] === x) { cnt++; seen[yi] = 'found'; }
          T.st('for (int y : nums) if (y == x) cnt++', 'y = ' + nums[yi] + (nums[yi] === x ? ' == ' + x + ' → cnt = ' + cnt : ' ≠ ' + x), { hl: Object.assign({}, seen, { [xi]: 'cur', [yi]: nums[yi] === x ? 'found' : 'win' }), ptr: [{ i: xi, label: 'x' }, { i: yi, label: 'y' }] });
        }
        yi = undefined;
        if (cnt > Math.floor(n / 2)) return T.end('if (cnt > n / 2) return x', cnt + ' > ' + Math.floor(n / 2) + ' → return ' + x, finalRet(169, { nums }), { hl: seen });
        T.st('if (cnt > n / 2) return x', cnt + ' ≤ ' + Math.floor(n / 2) + ' → agla x', { hl: { [xi]: 'skip' } });
      }
      return T.end('return -1', 'return −1', finalRet(169, { nums }));
    },
  }, {
    label: 'HashMap', title: 'Majority Element (Better: HashMap count)', ap: 1,
    run({ nums }) {
      let freq = null, x, xi, c;
      const half = Math.floor(nums.length / 2), done = {};
      const T = tracer(169, 1, o => ({ views: [A('nums', nums, Object.assign({}, done, o.hl), o.ptr)].concat(freq ? [M('HashMap freq', freq, o.mh)] : []), vars: Object.assign({ nums: iA(nums), 'nums.length / 2': half }, freq ? { freq: mS(freq) } : {}, x !== undefined ? { x } : {}, c !== undefined ? { c } : {}) }));
      T.st('public int majorityElement', 'Method call — nums = ' + fmt(nums) + ' (majority = ' + half + ' se zyada baar)');
      freq = new Map(); T.st('Map<Integer, Integer> freq = new HashMap<>()', 'Khaali HashMap (value → count)');
      for (xi = 0; xi < nums.length; xi++) {
        x = nums[xi]; c = undefined;
        T.st('for (int x : nums)', 'x = nums[' + xi + '] = ' + x, { hl: { [xi]: 'cur' }, ptr: [{ i: xi, label: 'x' }], mh: x });
        c = (freq.get(x) || 0) + 1;
        T.st('int c = freq.getOrDefault(x, 0) + 1', 'freq.getOrDefault(' + x + ', 0) = ' + (c - 1) + ' → c = ' + c, { hl: { [xi]: 'cur' }, ptr: [{ i: xi, label: 'x' }], mh: x });
        if (c > half) return T.end('if (c > nums.length / 2) return x', 'c = ' + c + ' > ' + half + ' → return ' + x, finalRet(169, { nums }), { hl: { [xi]: 'found' }, ptr: [{ i: xi, label: 'x' }], mh: x });
        T.st('if (c > nums.length / 2) return x', 'c = ' + c + ' ≤ ' + half + ' → abhi majority pakka nahi', { hl: { [xi]: 'cur' }, ptr: [{ i: xi, label: 'x' }], mh: x });
        freq.set(x, c); done[xi] = 'done';
        T.st('freq.put(x, c)', 'freq.put(' + x + ', ' + c + ')', { hl: { [xi]: 'new' }, ptr: [{ i: xi, label: 'x' }], mh: x });
      }
      x = undefined; c = undefined;
      return T.end('return -1', 'return −1', finalRet(169, { nums }));
    },
  }]);

  // ================= LC 1295 — Brute (String) =================
  add(1295, [{
    label: 'String length', title: 'Even Number of Digits (Brute: String)', ap: 0,
    run({ nums }) {
      let count, x, xi;
      const hl = {};
      const T = tracer(1295, 0, o => ({ views: [A('nums', nums, Object.assign({}, hl, o.hl), o.ptr)], vars: Object.assign({ nums: iA(nums) }, count !== undefined ? { count } : {}, x !== undefined ? { x } : {}) }));
      T.st('public int findNumbers', 'Method call — nums = ' + fmt(nums));
      count = 0; T.st('int count = 0', 'count = 0');
      for (xi = 0; xi < nums.length; xi++) {
        x = nums[xi];
        T.st('for (int x : nums)', 'x = ' + x, { hl: { [xi]: 'cur' }, ptr: [{ i: xi, label: 'x' }] });
        const len = String(x).length, ev = len % 2 === 0;
        if (ev) count++;
        hl[xi] = ev ? 'found' : 'skip';
        T.st('if (String.valueOf(x).length() % 2 == 0) count++', 'String.valueOf(' + x + ') = "' + x + '" → length ' + len + ' → ' + (ev ? 'even → count = ' + count : 'odd') + ' (naya String object)', { ptr: [{ i: xi, label: 'x' }] });
      }
      x = undefined;
      return T.end('return count', 'return ' + count, finalRet(1295, { nums }));
    },
  }]);

  // ================= LC 303 — Brute (har query loop) =================
  add(303, [{
    label: 'Har query loop', title: 'Range Sum Query (Brute: har query O(n))', ap: 0,
    run({ nums, queries }) {
      let stored = null, inQ = false, l, r, sum, i;
      const T = tracer(303, 0, o => ({ views: [A('nums', nums, o.hl, o.ptr)], vars: {} }));
      const fr = () => [inQ
        ? { method: 'sumRange', args: 'left, right', vars: Object.assign({ 'this.nums': iA(nums), left: l, right: r }, sum !== undefined ? { sum } : {}, i !== undefined ? { i } : {}) }
        : { method: 'NumArray', args: 'nums', vars: Object.assign({ nums: iA(nums) }, stored ? { 'this.nums': iA(stored) } : {}) }];
      T.st('public NumArray(int[] nums)', 'Constructor call — nums = ' + fmt(nums), { frames: fr() });
      stored = nums; T.st('this.nums = nums', 'Sirf array save — koi tayyari nahi', { frames: fr() });
      inQ = true;
      queries.forEach(([ql, qr]) => {
        l = ql; r = qr; sum = undefined; i = undefined;
        T.st('public int sumRange', 'sumRange(' + l + ', ' + r + ') call', { hl: rng(l, r, 'win'), frames: fr() });
        sum = 0; T.st('int sum = 0', 'sum = 0', { hl: rng(l, r, 'win'), frames: fr() });
        for (i = l; i <= r; i++) { sum += nums[i]; T.st('for (int i = left; i <= right; i++) sum += nums[i]', 'i = ' + i + ': sum += ' + nums[i] + ' → ' + sum, { hl: rng(l, i, 'cur', rng(l, r, 'win')), ptr: [{ i, label: 'i' }], frames: fr() }); }
        i = undefined;
        T.st('return sum', 'sumRange(' + l + ', ' + r + ') = ' + sum + ' — ' + (r - l + 1) + ' elements dobara jode', { hl: rng(l, r, 'found'), frames: fr() });
      });
      return T.end('return sum', 'Saare outputs: [null, …]', finalRet(303, { nums, queries }), { frames: fr() });
    },
  }]);

  // ================= LC 268 — Brute (sort) =================
  add(268, [{
    label: 'Sort', title: 'Missing Number (Brute: sort)', ap: 0,
    run({ nums }) {
      let a = nums.slice(), i, sorted = false;
      const T = tracer(268, 0, o => ({ views: [A(sorted ? 'nums (sorted)' : 'nums', a, o.hl, o.ptr)], vars: Object.assign({ nums: iA(a) }, i !== undefined ? { i } : {}) }));
      T.st('public int missingNumber', 'Method call — nums = ' + fmt(nums));
      a = a.sort((x, y) => x - y); sorted = true; T.st('Arrays.sort(nums)', 'Sort → ' + fmt(a) + ' — ab nums[i] == i hona chahiye');
      for (i = 0; ; i++) {
        if (i >= a.length) { T.st('for (int i = 0', 'i = ' + i + ' → loop khatam'); break; }
        T.st('for (int i = 0', 'i = ' + i, { hl: rng(0, i - 1, 'done', { [i]: 'cur' }), ptr: [{ i, label: 'i' }] });
        if (a[i] !== i) return T.end('if (nums[i] != i) return i', 'nums[' + i + '] = ' + a[i] + ' ≠ ' + i + ' → ' + i + ' missing', finalRet(268, { nums }), { hl: rng(0, i - 1, 'done', { [i]: 'found' }), ptr: [{ i, label: 'i' }] });
        T.st('if (nums[i] != i) return i', 'nums[' + i + '] = ' + i + ' ✓', { hl: rng(0, i, 'done'), ptr: [{ i, label: 'i' }] });
      }
      i = undefined;
      return T.end('return nums.length', 'Sab jagah sahi → ' + a.length + ' missing', finalRet(268, { nums }));
    },
  }]);
})();
