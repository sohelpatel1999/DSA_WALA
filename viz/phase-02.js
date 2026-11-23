// Phase 2 — Two Pointers visualizers (v2 views schema).
// Line numbers = questions[n].approaches[ap].code ki lines (line 1 = method signature).
(function () {
  const { recorder, range, fmt } = VIZ.util;
  const D = VIZ.defs;
  const intArr = a => `int[${a.length}] ${fmt(a)}`;
  const charArr = a => `char[${a.length}] [${a.join(', ')}]`;
  const shown = c => (c === ' ' ? '␣' : c);
  const jstr = s => `"${s}"`;
  const P = (l, r, extra) => {
    const p = [];
    if (l !== undefined && l !== null) p.push({ i: l, label: 'l' });
    if (r !== undefined && r !== null) p.push({ i: r, label: 'r' });
    return p.concat(extra || []);
  };

  // ---------------- 344 Reverse String ----------------
  D[344] = {
    title: 'Reverse String (Opposite pointers)', label: 'Two pointers', ap: 2,
    inputs: [{ key: 's', label: 's (characters)', def: 'hello', type: 'str' }],
    run({ s: str }) {
      const a = str.split('');
      const n = a.length;
      let l = 0, r = n - 1;
      const done = () => Object.assign(range(0, l - 1, 'done'), range(r + 1, n - 1, 'done'));
      const view = (hl, ptr) => [{ type: 'array', label: 's', vals: a.map(shown), hl: hl || {}, ptr: ptr || [] }];
      const { steps, s } = recorder(() => ({}));
      const V = extra => Object.assign({ s: charArr(a), l: String(l), r: String(r) }, extra || {});
      s(2, `l = 0, r = ${n - 1} — dono kinaron pe`, { vars: V(), views: view({}, P(l, r)) });
      while (l < r) {
        s(3, `${l} < ${r} ✓ → swap karna hai`, { vars: V(), views: view(Object.assign(done(), { [l]: 'cur', [r]: 'cur' }), P(l, r)) });
        const tmp = a[l];
        s(4, `tmp = s[${l}] = '${tmp}'`, { vars: V({ tmp: `'${tmp}'` }), views: view(Object.assign(done(), { [l]: 'cur', [r]: 'cur' }), P(l, r)) });
        a[l] = a[r];
        s(5, `s[${l}] = s[${r}] = '${a[r]}'`, { vars: V({ tmp: `'${tmp}'` }), views: view(Object.assign(done(), { [l]: 'new', [r]: 'cur' }), P(l, r)) });
        a[r] = tmp;
        s(6, `s[${r}] = tmp = '${tmp}' → swap complete`, { vars: V({ tmp: `'${tmp}'` }), views: view(Object.assign(done(), { [l]: 'new', [r]: 'new' }), P(l, r)) });
        l++;
        s(7, `l++ → ${l}`, { vars: V({ tmp: `'${tmp}'` }), views: view(done(), P(l, r)) });
        r--;
        s(8, `r-- → ${r}`, { vars: V({ tmp: `'${tmp}'` }), views: view(done(), P(l, r)) });
      }
      s(3, `${l} < ${r} ✗ → pointers mil gaye/cross ho gaye, loop khatam`, { vars: V(), views: view(done(), P(l, r)) });
      s(10, `s ab ulta hai: ${fmt(a)} (void method — s hi answer hai)`, { vars: V(), views: view(range(0, n - 1, 'found')), ret: fmt(a) });
      return steps;
    },
  };

  // ---------------- 125 Valid Palindrome ----------------
  D[125] = {
    title: 'Valid Palindrome (Opposite pointers + skip)', label: 'Two pointers', ap: 1,
    inputs: [{ key: 's', label: 's', def: 'race a car', type: 'str' }],
    run({ s: str }) {
      const a = str.split(''), n = a.length;
      const ok = c => /[A-Za-z0-9]/.test(c);
      let l = 0, r = n - 1;
      const matched = new Set(), skipped = new Set();
      const hl = extra => {
        const o = {};
        skipped.forEach(i => { o[i] = 'skip'; });
        matched.forEach(i => { o[i] = 'done'; });
        return Object.assign(o, extra || {});
      };
      const view = (h, ptr) => [
        { type: 'array', label: 's (chars, ␣ = space)', vals: a.map(shown), hl: h || {}, ptr: ptr || [] },
        { type: 'text', label: 'compare', value: l < n && r >= 0 && l <= r ? `'${shown(a[l])}' vs '${shown(a[r])}'  →  '${a[l].toLowerCase()}' vs '${a[r].toLowerCase()}'` : '—' },
      ];
      const { steps, s } = recorder(() => ({}));
      const V = extra => Object.assign({ s: jstr(str), l: String(l), r: String(r) }, extra || {});
      s(2, `l = 0, r = ${n - 1}`, { vars: V(), views: view(hl(), P(l, r)) });
      while (l < r) {
        s(3, `${l} < ${r} ✓`, { vars: V(), views: view(hl({ [l]: 'cur', [r]: 'cur' }), P(l, r)) });
        while (l < r && !ok(a[l])) {
          skipped.add(l);
          s(4, `s[${l}] = '${shown(a[l])}' letter/digit nahi → l++`, { vars: V(), views: view(hl({ [l]: 'skip' }), P(l, r)) });
          l++;
        }
        while (l < r && !ok(a[r])) {
          skipped.add(r);
          s(5, `s[${r}] = '${shown(a[r])}' letter/digit nahi → r--`, { vars: V(), views: view(hl({ [r]: 'skip' }), P(l, r)) });
          r--;
        }
        const cl = a[l].toLowerCase(), cr = a[r].toLowerCase();
        if (cl !== cr) {
          s(6, `toLowerCase: '${cl}' != '${cr}' → mismatch!`, { vars: V(), views: view(hl({ [l]: 'cur', [r]: 'cur' }), P(l, r)) });
          s(7, 'return false — palindrome nahi', { vars: V(), views: view(hl({ [l]: 'cur', [r]: 'cur' }), P(l, r)), ret: 'false' });
          return steps;
        }
        s(6, `toLowerCase: '${cl}' == '${cr}' ✓`, { vars: V(), views: view(hl({ [l]: 'found', [r]: 'found' }), P(l, r)) });
        matched.add(l); matched.add(r);
        l++;
        s(9, `l++ → ${l}`, { vars: V(), views: view(hl(), P(l, r)) });
        r--;
        s(10, `r-- → ${r}`, { vars: V(), views: view(hl(), P(l, r)) });
      }
      s(3, `${l} < ${r} ✗ → loop khatam, koi mismatch nahi`, { vars: V(), views: view(hl(), P(l, r)) });
      s(12, 'return true — palindrome hai', { vars: V(), views: view(hl(), P(l, r)), ret: 'true' });
      return steps;
    },
  };

  // ---------------- 283 Move Zeroes ----------------
  D[283] = {
    title: 'Move Zeroes (Read i / Write k)', label: 'Swap (one pass)', ap: 2,
    inputs: [{ key: 'nums', label: 'nums', def: '0, 1, 0, 3, 12' }],
    run({ nums }) {
      const a = nums.slice(), n = a.length;
      let k = 0;
      const view = (h, ptr) => [{ type: 'array', label: 'nums', vals: a.slice(), hl: h || {}, ptr: ptr || [] }];
      const ptrs = i => [{ i: k, label: 'k' }].concat(i !== undefined && i < n ? [{ i, label: 'i' }] : []);
      const { steps, s } = recorder(() => ({}));
      const V = extra => Object.assign({ nums: intArr(a), k: String(k) }, extra || {});
      s(2, 'k = 0 — agla non-zero yahan aayega', { vars: V(), views: view({}, ptrs()) });
      for (let i = 0; i < n; i++) {
        const base = range(0, k - 1, 'done');
        s(3, `i = ${i}`, { vars: V({ i: String(i) }), views: view(Object.assign({}, base, { [i]: 'cur' }), ptrs(i)) });
        if (a[i] !== 0) {
          s(4, `nums[${i}] = ${a[i]} != 0 ✓ → isse k = ${k} pe bhejo`, { vars: V({ i: String(i) }), views: view(Object.assign({}, base, { [i]: 'cur', [k]: 'win' }), ptrs(i)) });
          const tmp = a[k];
          s(5, `tmp = nums[${k}] = ${tmp}`, { vars: V({ i: String(i), tmp: String(tmp) }), views: view(Object.assign({}, base, { [i]: 'cur', [k]: 'win' }), ptrs(i)) });
          a[k] = a[i]; a[i] = tmp;
          s(7, i === k ? `swap(${k}, ${i}) — same index, kuch nahi badla` : `swap: nums[${k}] = ${a[k]}, nums[${i}] = ${a[i]}`, { vars: V({ i: String(i), tmp: String(tmp) }), views: view(Object.assign({}, base, { [k]: 'new', [i]: 'new' }), ptrs(i)) });
          k++;
          s(8, `k++ → ${k}`, { vars: V({ i: String(i), tmp: String(tmp) }), views: view(range(0, k - 1, 'done'), ptrs(i)) });
        } else {
          s(4, `nums[${i}] = 0 → skip (i aage, k wahin)`, { vars: V({ i: String(i) }), views: view(Object.assign({}, base, { [i]: 'skip' }), ptrs(i)) });
        }
      }
      s(3, `i = ${n} → loop khatam`, { vars: V(), views: view(range(0, k - 1, 'done'), ptrs()) });
      s(11, `Done: ${fmt(a)} — pehle ${k} non-zero, baaki 0`, { vars: V(), views: view(range(0, n - 1, 'found')), ret: fmt(a) });
      return steps;
    },
  };

  // ---------------- 167 Two Sum II ----------------
  D[167] = {
    title: 'Two Sum II (Sorted, opposite pointers)', label: 'Two pointers', ap: 2,
    inputs: [{ key: 'numbers', label: 'numbers (sorted)', def: '2, 7, 11, 15' }, { key: 'target', label: 'target', def: '9', type: 'num' }],
    run({ numbers, target }) {
      const n = numbers.length;
      let l = 0, r = n - 1;
      const rej = new Set();
      const hl = extra => { const o = {}; rej.forEach(i => { o[i] = 'skip'; }); return Object.assign(o, extra || {}); };
      const view = (h, ptr) => [{ type: 'array', label: 'numbers', vals: numbers, hl: h || {}, ptr: ptr || [] }];
      const { steps, s } = recorder(() => ({}));
      const V = extra => Object.assign({ numbers: intArr(numbers), target: String(target), l: String(l), r: String(r) }, extra || {});
      s(2, `l = 0, r = ${n - 1}`, { vars: V(), views: view(hl(), P(l, r)) });
      while (l < r) {
        s(3, `${l} < ${r} ✓`, { vars: V(), views: view(hl({ [l]: 'cur', [r]: 'cur' }), P(l, r)) });
        const sum = numbers[l] + numbers[r];
        s(4, `sum = ${numbers[l]} + ${numbers[r]} = ${sum}`, { vars: V({ sum: String(sum) }), views: view(hl({ [l]: 'cur', [r]: 'cur' }), P(l, r)) });
        if (sum === target) {
          const ans = `[${l + 1}, ${r + 1}]`;
          s(5, `sum == target ✓ → return ${ans} (1-indexed)`, { vars: V({ sum: String(sum) }), views: view(hl({ [l]: 'found', [r]: 'found' }), P(l, r)), ret: ans });
          return steps;
        }
        s(5, `${sum} != ${target}`, { vars: V({ sum: String(sum) }), views: view(hl({ [l]: 'cur', [r]: 'cur' }), P(l, r)) });
        if (sum < target) {
          rej.add(l); l++;
          s(6, `${sum} < ${target} → chhota hai, bada number chahiye → l++ (${numbers[l - 1]} kisi pair me kaam ka nahi)`, { vars: V({ sum: String(sum) }), views: view(hl(), P(l, r)) });
        } else {
          rej.add(r); r--;
          s(7, `${sum} > ${target} → bada hai → r-- (${numbers[r + 1]} kisi pair me kaam ka nahi)`, { vars: V({ sum: String(sum) }), views: view(hl(), P(l, r)) });
        }
      }
      s(9, 'Pair nahi mila → return [-1, -1]', { vars: V(), views: view(hl()), ret: '[-1, -1]' });
      return steps;
    },
  };

  // ---------------- 15 3Sum ----------------
  D[15] = {
    title: '3Sum (Sort + fix i + two pointers)', label: 'Sort + two pointers', ap: 2,
    inputs: [{ key: 'nums', label: 'nums', def: '-1, 0, 1, 2, -1, -4' }],
    run({ nums }) {
      const a = nums.slice().sort((x, y) => x - y), n = a.length;
      const res = [];
      const resStr = () => '[' + res.map(t => fmt(t)).join(', ') + ']';
      let i = -1, l = null, r = null;
      const view = (h, ptr) => [
        { type: 'array', label: 'nums (sorted)', vals: a, hl: h || {}, ptr: ptr || [] },
        { type: 'text', label: 'res', value: resStr() },
      ];
      const ptrs = () => (i >= 0 && i < n ? [{ i, label: 'i' }] : []).concat(l !== null && l < n ? [{ i: l, label: 'l' }] : []).concat(r !== null && r >= 0 ? [{ i: r, label: 'r' }] : []);
      const { steps, s } = recorder(() => ({}));
      const V = extra => {
        const o = { nums: intArr(a), res: `ArrayList size=${res.length} ${resStr()}` };
        if (i >= 0) o.i = String(i);
        if (l !== null) { o.l = String(l); o.r = String(r); }
        return Object.assign(o, extra || {});
      };
      s(2, `Arrays.sort → ${fmt(a)} (duplicates ab paas-paas)`, { vars: V(), views: view() });
      s(3, 'res = new ArrayList<>()', { vars: V(), views: view() });
      for (i = 0; i < n - 2; i++) {
        l = null; r = null;
        s(4, `i = ${i}, nums[i] = ${a[i]} (fix kiya)`, { vars: V(), views: view({ [i]: 'cur' }, ptrs()) });
        if (i > 0 && a[i] === a[i - 1]) {
          s(5, `nums[${i}] == nums[${i - 1}] (${a[i]}) → same first number, continue`, { vars: V(), views: view({ [i]: 'skip', [i - 1]: 'done' }, ptrs()) });
          continue;
        }
        if (a[i] > 0) {
          s(6, `nums[${i}] = ${a[i]} > 0 → aage sab positive, sum 0 ho hi nahi sakta → break`, { vars: V(), views: view(range(i, n - 1, 'skip'), ptrs()) });
          break;
        }
        l = i + 1; r = n - 1;
        s(7, `l = ${l}, r = ${r} — ab nums[i+1..] pe two-sum, target = ${-a[i]}`, { vars: V(), views: view(Object.assign(range(l, r, 'win'), { [i]: 'cur' }), ptrs()) });
        while (l < r) {
          s(8, `${l} < ${r} ✓`, { vars: V(), views: view(Object.assign(range(l, r, 'win'), { [i]: 'cur' }), ptrs()) });
          const sum = a[i] + a[l] + a[r];
          const sv = { sum: String(sum) };
          s(9, `sum = ${a[i]} + ${a[l]} + ${a[r]} = ${sum}`, { vars: V(sv), views: view({ [i]: 'cur', [l]: 'cur', [r]: 'cur' }, ptrs()) });
          if (sum < 0) {
            l++;
            s(10, `${sum} < 0 → bada chahiye → l++ → ${l}`, { vars: V(sv), views: view(Object.assign(range(l, r, 'win'), { [i]: 'cur' }), ptrs()) });
          } else if (sum > 0) {
            r--;
            s(11, `${sum} > 0 → chhota chahiye → r-- → ${r}`, { vars: V(sv), views: view(Object.assign(range(l, r, 'win'), { [i]: 'cur' }), ptrs()) });
          } else {
            res.push([a[i], a[l], a[r]]);
            s(13, `sum == 0 ✓ → res.add([${a[i]}, ${a[l]}, ${a[r]}])`, { vars: V(sv), views: view({ [i]: 'found', [l]: 'found', [r]: 'found' }, ptrs()) });
            l++;
            s(14, `l++ → ${l}`, { vars: V(sv), views: view({ [i]: 'cur' }, ptrs()) });
            r--;
            s(15, `r-- → ${r}`, { vars: V(sv), views: view({ [i]: 'cur' }, ptrs()) });
            while (l < r && a[l] === a[l - 1]) {
              l++;
              s(16, `nums[${l - 1}] == nums[${l - 2}] (${a[l - 1]}) → duplicate, l++ → ${l}`, { vars: V(sv), views: view({ [i]: 'cur', [l - 1]: 'skip' }, ptrs()) });
            }
            while (l < r && a[r] === a[r + 1]) {
              r--;
              s(17, `nums[${r + 1}] == nums[${r + 2}] (${a[r + 1]}) → duplicate, r-- → ${r}`, { vars: V(sv), views: view({ [i]: 'cur', [r + 1]: 'skip' }, ptrs()) });
            }
          }
        }
        s(8, `${l} < ${r} ✗ → is i ke liye khatam`, { vars: V(), views: view({ [i]: 'done' }, ptrs()) });
      }
      l = null; r = null;
      const ans = resStr();
      s(21, `return ${ans}`, { vars: V(), views: view({}), ret: ans });
      return steps;
    },
  };

  // ---------------- 11 Container With Most Water ----------------
  D[11] = {
    title: 'Container With Most Water (Move shorter wall)', label: 'Two pointers', ap: 1,
    inputs: [{ key: 'height', label: 'height', def: '1, 8, 6, 2, 5, 4, 8, 3, 7' }],
    run({ height }) {
      const n = height.length;
      let l = 0, r = n - 1, best = 0, bl = -1, br = -1;
      const view = (h, ptr, note) => [
        { type: 'array', label: 'height', vals: height, hl: h || {}, ptr: ptr || [] },
        { type: 'text', label: 'area', value: note || '—' },
      ];
      const { steps, s } = recorder(() => ({}));
      const V = extra => Object.assign({ height: intArr(height), l: String(l), r: String(r), best: String(best) }, extra || {});
      s(2, `l = 0, r = ${n - 1}, best = 0 — sabse chaudi width se start`, { vars: V(), views: view({}, P(l, r)) });
      while (l < r) {
        const win = range(l, r, 'win');
        s(3, `${l} < ${r} ✓`, { vars: V(), views: view(Object.assign({}, win, { [l]: 'cur', [r]: 'cur' }), P(l, r)) });
        const h = Math.min(height[l], height[r]);
        s(4, `h = min(${height[l]}, ${height[r]}) = ${h}`, { vars: V({ h: String(h) }), views: view(Object.assign({}, win, { [l]: 'cur', [r]: 'cur' }), P(l, r)) });
        const area = h * (r - l), up = area > best;
        if (up) { best = area; bl = l; br = r; }
        s(5, `area = ${h} × (${r} − ${l}) = ${area}${up ? ' → naya best!' : ` (best ${best} hi rahega)`}`, { vars: V({ h: String(h) }), views: view(Object.assign({}, win, { [l]: up ? 'found' : 'cur', [r]: up ? 'found' : 'cur' }), P(l, r), `${h} × ${r - l} = ${area}   |   best = ${best}`) });
        if (height[l] < height[r]) {
          l++;
          s(6, `height[${l - 1}] (${height[l - 1]}) < height[${r}] (${height[r]}) → chhoti wall left → l++`, { vars: V({ h: String(h) }), views: view(Object.assign(range(l, r, 'win'), { [l - 1]: 'skip' }), P(l, r), `best = ${best}`) });
        } else {
          r--;
          s(7, `height[${r + 1}] (${height[r + 1]}) ≤ height[${l}] (${height[l]}) wali taraf chhoti/barabar → r--`, { vars: V({ h: String(h) }), views: view(Object.assign(range(l, r, 'win'), { [r + 1]: 'skip' }), P(l, r), `best = ${best}`) });
        }
      }
      s(3, `${l} < ${r} ✗ → loop khatam`, { vars: V(), views: view({}, P(l, r), `best = ${best}`) });
      s(9, `return ${best}${bl >= 0 ? ` (lines ${bl} aur ${br})` : ''}`, { vars: V(), views: view(bl >= 0 ? { [bl]: 'found', [br]: 'found' } : {}, [], `best = ${best}`), ret: String(best) });
      return steps;
    },
  };

  // ---------------- 42 Trapping Rain Water ----------------
  D[42] = {
    title: 'Trapping Rain Water (Two pointers, O(1) space)', label: 'Two pointers (O(1))', ap: 2,
    inputs: [{ key: 'height', label: 'height', def: '0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1' }],
    run({ height }) {
      const n = height.length;
      let l = 0, r = n - 1, leftMax = 0, rightMax = 0, water = 0;
      const wat = Array(n).fill('');
      const view = (h, ptr) => [
        { type: 'array', label: 'height', vals: height, hl: h || {}, ptr: ptr || [] },
        { type: 'array', label: 'paani (index pe)', vals: wat.slice(), hl: {} },
      ];
      const doneHl = extra => Object.assign(range(0, l - 1, 'done'), range(r + 1, n - 1, 'done'), extra || {});
      const { steps, s } = recorder(() => ({}));
      const V = extra => Object.assign({ height: intArr(height), l: String(l), r: String(r), leftMax: String(leftMax), rightMax: String(rightMax), water: String(water) }, extra || {});
      s(2, `l = 0, r = ${n - 1}`, { vars: V(), views: view({}, P(l, r)) });
      s(3, 'leftMax = 0, rightMax = 0, water = 0', { vars: V(), views: view({}, P(l, r)) });
      while (l < r) {
        s(4, `${l} < ${r} ✓`, { vars: V(), views: view(doneHl({ [l]: 'cur', [r]: 'cur' }), P(l, r)) });
        if (height[l] < height[r]) {
          s(5, `height[${l}] (${height[l]}) < height[${r}] (${height[r]}) → right me kam se kam ${height[r]} ki wall hai → left side process karo`, { vars: V(), views: view(doneHl({ [l]: 'cur', [r]: 'win' }), P(l, r)) });
          leftMax = Math.max(leftMax, height[l]);
          s(6, `leftMax = max(…, ${height[l]}) = ${leftMax}`, { vars: V(), views: view(doneHl({ [l]: 'cur' }), P(l, r)) });
          const add = leftMax - height[l];
          water += add; wat[l] = add;
          s(7, `water += ${leftMax} − ${height[l]} = ${add} → water = ${water}`, { vars: V(), views: view(doneHl({ [l]: add ? 'found' : 'cur' }), P(l, r)) });
          l++;
          s(8, `l++ → ${l}`, { vars: V(), views: view(doneHl(), P(l, r)) });
        } else {
          s(9, `height[${l}] (${height[l]}) ≥ height[${r}] (${height[r]}) → left me kam se kam ${height[l]} ki wall hai → right side process karo`, { vars: V(), views: view(doneHl({ [r]: 'cur', [l]: 'win' }), P(l, r)) });
          rightMax = Math.max(rightMax, height[r]);
          s(10, `rightMax = max(…, ${height[r]}) = ${rightMax}`, { vars: V(), views: view(doneHl({ [r]: 'cur' }), P(l, r)) });
          const add = rightMax - height[r];
          water += add; wat[r] = add;
          s(11, `water += ${rightMax} − ${height[r]} = ${add} → water = ${water}`, { vars: V(), views: view(doneHl({ [r]: add ? 'found' : 'cur' }), P(l, r)) });
          r--;
          s(12, `r-- → ${r}`, { vars: V(), views: view(doneHl(), P(l, r)) });
        }
      }
      s(4, `${l} < ${r} ✗ → loop khatam (index ${l} sabse oonchi wall — uspe paani nahi)`, { vars: V(), views: view(doneHl(), P(l, r)) });
      s(15, `return ${water}`, { vars: V(), views: view(range(0, n - 1, 'done')), ret: String(water) });
      return steps;
    },
    variants: [{
      label: 'Prefix / suffix max (O(n) space)', title: 'Trapping Rain Water (leftMax[] + rightMax[])', ap: 1,
      run({ height }) {
        const n = height.length;
        const L = Array(n).fill(0), R = Array(n).fill(0), wat = Array(n).fill('');
        let water = 0;
        const view = (hh, hL, hR, ptr) => [
          { type: 'array', label: 'height', vals: height, hl: hh || {}, ptr: ptr || [] },
          { type: 'array', label: 'leftMax', vals: L.slice(), hl: hL || {} },
          { type: 'array', label: 'rightMax', vals: R.slice(), hl: hR || {} },
          { type: 'array', label: 'paani', vals: wat.slice(), hl: {} },
        ];
        const { steps, s } = recorder(() => ({}));
        const V = extra => Object.assign({ height: intArr(height), n: String(n), leftMax: intArr(L), rightMax: intArr(R) }, extra || {});
        s(2, `n = ${n}`, { vars: { height: intArr(height), n: String(n) }, views: view() });
        s(3, 'leftMax, rightMax = new int[n] (sab 0)', { vars: V(), views: view() });
        L[0] = height[0];
        s(4, `leftMax[0] = height[0] = ${L[0]}`, { vars: V(), views: view({ 0: 'cur' }, { 0: 'new' }) });
        for (let i = 1; i < n; i++) {
          L[i] = Math.max(L[i - 1], height[i]);
          s(5, `leftMax[${i}] = max(leftMax[${i - 1}] ${L[i - 1]}, height[${i}] ${height[i]}) = ${L[i]}`, { vars: V({ i: String(i) }), views: view({ [i]: 'cur' }, { [i]: 'new' }, {}, [{ i, label: 'i' }]) });
        }
        R[n - 1] = height[n - 1];
        s(6, `rightMax[${n - 1}] = height[${n - 1}] = ${R[n - 1]}`, { vars: V(), views: view({ [n - 1]: 'cur' }, {}, { [n - 1]: 'new' }) });
        for (let i = n - 2; i >= 0; i--) {
          R[i] = Math.max(R[i + 1], height[i]);
          s(7, `rightMax[${i}] = max(rightMax[${i + 1}] ${R[i + 1]}, height[${i}] ${height[i]}) = ${R[i]}`, { vars: V({ i: String(i) }), views: view({ [i]: 'cur' }, {}, { [i]: 'new' }, [{ i, label: 'i' }]) });
        }
        s(8, 'water = 0', { vars: V({ water: String(water) }), views: view() });
        for (let i = 0; i < n; i++) {
          const add = Math.min(L[i], R[i]) - height[i];
          water += add; wat[i] = add;
          s(9, `i = ${i}: min(${L[i]}, ${R[i]}) − ${height[i]} = ${add} → water = ${water}`, { vars: V({ water: String(water), i: String(i) }), views: view({ [i]: add ? 'found' : 'cur' }, { [i]: 'cur' }, { [i]: 'cur' }, [{ i, label: 'i' }]) });
        }
        s(10, `return ${water}`, { vars: V({ water: String(water) }), views: view(range(0, n - 1, 'done')), ret: String(water) });
        return steps;
      },
    }],
  };
})();
