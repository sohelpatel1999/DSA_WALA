// Phase 2 (Two Pointers) — SAARE approaches ke LINE-BY-LINE debugger tabs (Week 3 rewrite, 2026-11-08).
// Purane base defs (viz/phase-02.js) ko replace karta hai: har question = Optimal (base) + Brute / Better / Recursive variants.
// Final `ret` purane base visualizer se liya jaata hai (output format same rahe).
(function () {
  const { recorder, fmt, MAX_STEPS } = VIZ.util;
  const QS = [344, 125, 167, 283, 11, 15, 42];
  const Q = n => window.PHASE_CONTENT['two-pointers'].questions[n];
  const OLD = {}; QS.forEach(n => { if (VIZ.defs[n]) OLD[n] = { run: VIZ.defs[n].run, inputs: VIZ.defs[n].inputs }; });
  const finalRet = (n, inp) => { const st = OLD[n].run(JSON.parse(JSON.stringify(inp))); return st[st.length - 1].ret; };
  const L = (n, ap) => {
    const code = Q(n).approaches[ap].code.split('\n');
    const f = (snip, k) => {
      let c = k || 1;
      for (let i = 0; i < code.length; i++) if (code[i].includes(snip) && --c === 0) return i + 1;
      throw new Error('LC ' + n + ' ap' + ap + ' line nahi mili: ' + snip);
    };
    f.last = code.length;
    return f;
  };
  function tracer(n, ap, render) {
    const ln = L(n, ap), rec = recorder(() => ({}));
    const st = (snip, note, o) => {
      o = o || {};
      const r = render(o);
      rec.s(typeof snip === 'number' ? snip : ln(snip, o.k), note, Object.assign({ views: r.views, vars: r.vars }, o.frames ? { frames: o.frames } : {}, o.ret !== undefined ? { ret: o.ret } : {}));
    };
    const end = (snip, note, ret, o) => { if (rec.steps.length >= MAX_STEPS) rec.steps.length = MAX_STEPS - 1; st(snip, note, Object.assign({}, o, { ret })); return rec.steps; };
    return { st, end, ln };
  }
  const A = (label, vals, hl, ptr) => ({ type: 'array', label, vals: vals.map(v => (v === null || v === undefined ? '' : v)), hl: hl || {}, ptr: ptr || [] });
  const S = (label, items, hl) => ({ type: 'set', label, items: [...items], hl });
  const iA = a => 'int[' + a.length + '] [' + a.map(v => (v === null || v === undefined ? 0 : v)).join(', ') + ']';
  const cA = a => 'char[' + a.length + '] [' + a.join(', ') + ']';
  const rng = (a, b, cls, base) => { const o = Object.assign({}, base); for (let i = a; i <= b; i++) if (!o[i]) o[i] = cls; return o; };
  const P = (...pairs) => pairs.filter(p => p && p.i !== undefined && p.i !== null && p.i >= 0).map(p => ({ i: p.i, label: p.label }));
  const def = (n, base, variants) => { VIZ.defs[n] = Object.assign({ inputs: OLD[n].inputs }, base, { variants }); };

  // =====================================================================
  // LC 344 — Reverse String
  // =====================================================================
  const r344opt = {
    title: 'Reverse String (Optimal: opposite pointers)', label: 'Two pointers', ap: 2,
    run({ s }) {
      const a = s.split(''); let l, r, tmp;
      const T = tracer(344, 2, o => ({ views: [A('s', a, o.hl, P({ i: l, label: 'l' }, { i: r, label: 'r' }))], vars: Object.assign({ s: cA(a) }, l !== undefined ? { l, r } : {}, tmp !== undefined ? { tmp: "'" + tmp + "'" } : {}) }));
      T.st('public void reverseString', 'Method call — s = ' + cA(a));
      l = 0; r = a.length - 1; T.st('int l = 0, r = s.length - 1', 'l = 0, r = ' + r, { hl: { [l]: 'cur', [r]: 'win' } });
      while (true) {
        const go = l < r;
        T.st('while (l < r)', 'l = ' + l + ' < r = ' + r + ' ? ' + (go ? 'haan' : 'nahi → pointers mil gaye / cross'), { hl: go ? { [l]: 'cur', [r]: 'win' } : {} });
        if (!go) break;
        tmp = a[l]; T.st('char tmp = s[l]', "tmp = s[" + l + "] = '" + tmp + "'", { hl: { [l]: 'cur', [r]: 'win' } });
        a[l] = a[r]; T.st('s[l] = s[r]', "s[" + l + "] = s[" + r + "] = '" + a[r] + "'", { hl: { [l]: 'new', [r]: 'win' } });
        a[r] = tmp; T.st('s[r] = tmp', "s[" + r + "] = tmp = '" + tmp + "'", { hl: { [l]: 'new', [r]: 'new' } });
        tmp = undefined;
        l++; T.st('l++;', 'l → ' + l, { hl: {} });
        r--; T.st('r--;', 'r → ' + r, { hl: {} });
      }
      return T.end(T.ln.last, 'Method khatam — s = ' + cA(a) + ' (in-place, O(1) space)', finalRet(344, { s }), { hl: rng(0, a.length - 1, 'found') });
    },
  };
  def(344, r344opt, [{
    label: 'Copy array', title: 'Reverse String (Brute: copy array)', ap: 0,
    run({ s }) {
      const a = s.split(''); let n, copy = null, i;
      const T = tracer(344, 0, o => ({ views: [A('s', a, o.hl, o.ptr)].concat(copy ? [A('copy', copy, o.ch)] : []), vars: Object.assign({ s: cA(a) }, n !== undefined ? { n } : {}, copy ? { copy: cA(copy.map(x => x || '·')) } : {}, i !== undefined ? { i } : {}) }));
      T.st('public void reverseString', 'Method call — s = ' + cA(a));
      n = a.length; T.st('int n = s.length', 'n = ' + n);
      copy = new Array(n).fill(''); T.st('char[] copy = new char[n]', 'copy = new char[' + n + '] (O(n) extra)');
      for (i = 0; ; i++) {
        T.st(T.ln('for (int i = 0; i < n; i++)', 1), 'i = ' + i + ' < ' + n + ' ? ' + (i < n ? 'haan' : 'nahi'), { hl: i < n ? { [n - 1 - i]: 'win' } : {} });
        if (i >= n) break;
        copy[i] = a[n - 1 - i]; T.st('copy[i] = s[n - 1 - i]', "copy[" + i + "] = s[" + (n - 1 - i) + "] = '" + copy[i] + "'", { hl: { [n - 1 - i]: 'win' }, ptr: [{ i: n - 1 - i, label: 'n−1−i' }], ch: { [i]: 'new' } });
      }
      for (i = 0; ; i++) {
        T.st(T.ln('for (int i = 0; i < n; i++)', 2), 'i = ' + i + ' < ' + n + ' ? ' + (i < n ? 'haan' : 'nahi'), { ch: i < n ? { [i]: 'cur' } : {} });
        if (i >= n) break;
        a[i] = copy[i]; T.st('s[i] = copy[i]', "s[" + i + "] = '" + a[i] + "'", { hl: { [i]: 'new' }, ptr: [{ i, label: 'i' }], ch: { [i]: 'cur' } });
      }
      i = undefined;
      return T.end(T.ln.last, 'Method khatam — s = ' + cA(a) + ' (extra copy array laga)', finalRet(344, { s }), { hl: rng(0, n - 1, 'found') });
    },
  }, {
    label: 'Recursion', title: 'Reverse String (Recursive helper)', ap: 1,
    run({ s }) {
      const a = s.split(''), stack = [];
      const T = tracer(344, 1, o => ({ views: [A('s', a, o.hl, o.ptr)], vars: {} }));
      const frames = () => stack.slice().reverse().map(f => ({ method: 'helper', args: 'l=' + f.l + ', r=' + f.r, line: T.ln('helper(s, l + 1, r - 1)'), vars: Object.assign({ s: cA(a), l: f.l, r: f.r }, f.tmp !== undefined ? { tmp: "'" + f.tmp + "'" } : {}) }))
        .concat([{ method: 'reverseString', args: 's', line: T.ln('helper(s, 0, s.length - 1)'), vars: { s: cA(a) } }]);
      T.st('public void reverseString', 'Method call — s = ' + cA(a), { frames: [{ method: 'reverseString', args: 's', vars: { s: cA(a) } }] });
      T.st('helper(s, 0, s.length - 1)', 'helper(s, 0, ' + (a.length - 1) + ') call', { frames: [{ method: 'reverseString', args: 's', vars: { s: cA(a) } }] });
      function helper(l, r) {
        const f = { l, r }; stack.push(f);
        const o = (hl) => ({ hl, ptr: P({ i: l, label: 'l' }, { i: r, label: 'r' }), frames: frames() });
        if (l >= r) { T.st('if (l >= r) return', 'l = ' + l + ' ≥ r = ' + r + ' → base case, return', o({})); stack.pop(); return; }
        T.st('if (l >= r) return', 'l = ' + l + ' < r = ' + r + ' → swap karo', o({ [l]: 'cur', [r]: 'win' }));
        f.tmp = a[l]; T.st('char tmp = s[l]', "tmp = '" + f.tmp + "'", o({ [l]: 'cur', [r]: 'win' }));
        a[l] = a[r]; T.st('s[l] = s[r]', "s[" + l + "] = '" + a[l] + "'", o({ [l]: 'new', [r]: 'win' }));
        a[r] = f.tmp; T.st('s[r] = tmp', "s[" + r + "] = '" + a[r] + "'", o({ [l]: 'new', [r]: 'new' }));
        T.st('helper(s, l + 1, r - 1)', 'helper(' + (l + 1) + ', ' + (r - 1) + ') call — stack badhega (O(n) space)', o({}));
        helper(l + 1, r - 1);
        stack.pop();
      }
      helper(0, a.length - 1);
      return T.end(3, 'Saare calls laut aaye — s = ' + cA(a), finalRet(344, { s }), { hl: rng(0, a.length - 1, 'found'), frames: [{ method: 'reverseString', args: 's', vars: { s: cA(a) } }] });
    },
  }]);

  // =====================================================================
  // LC 125 — Valid Palindrome
  // =====================================================================
  const isAN = c => /[a-z0-9]/i.test(c);
  def(125, {
    title: 'Valid Palindrome (Optimal: opposite pointers + skip)', label: 'Two pointers', ap: 1,
    run({ s }) {
      const a = s.split(''); let l, r;
      const T = tracer(125, 1, o => ({ views: [A('s', a.map(c => (c === ' ' ? '␣' : c)), o.hl, P({ i: l, label: 'l' }, { i: r, label: 'r' }))], vars: Object.assign({ s: '"' + s + '"' }, l !== undefined ? { l, r } : {}) }));
      const done = {};
      const H = x => Object.assign({}, done, x);
      T.st('public boolean isPalindrome', 'Method call — s = "' + s + '"');
      l = 0; r = a.length - 1; T.st('int l = 0, r = s.length() - 1', 'l = 0, r = ' + r, { hl: H({ [l]: 'cur', [r]: 'win' }) });
      while (true) {
        const go = l < r;
        T.st('while (l < r) {', 'l = ' + l + ' < r = ' + r + ' ? ' + (go ? 'haan' : 'nahi → poora check ho gaya'), { hl: H(go ? { [l]: 'cur', [r]: 'win' } : {}) });
        if (!go) break;
        while (true) {
          const sk = l < r && !isAN(a[l]);
          T.st('while (l < r && !Character.isLetterOrDigit(s.charAt(l)))', "s[" + l + "] = '" + a[l] + "' " + (sk ? '→ letter/digit nahi → skip, l++' : '→ theek hai, ruko'), { hl: H({ [l]: sk ? 'skip' : 'cur', [r]: 'win' }) });
          if (!sk) break; done[l] = 'skip'; l++;
        }
        while (true) {
          const sk = l < r && !isAN(a[r]);
          T.st('while (l < r && !Character.isLetterOrDigit(s.charAt(r)))', "s[" + r + "] = '" + a[r] + "' " + (sk ? '→ skip, r--' : '→ theek hai, ruko'), { hl: H({ [l]: 'cur', [r]: sk ? 'skip' : 'win' }) });
          if (!sk) break; done[r] = 'skip'; r--;
        }
        const x = a[l].toLowerCase(), y = a[r].toLowerCase();
        if (x !== y) {
          T.st('if (Character.toLowerCase(s.charAt(l))', "'" + x + "' ≠ '" + y + "' → palindrome nahi", { hl: H({ [l]: 'skip', [r]: 'skip' }) });
          return T.end('return false;', 'return false', finalRet(125, { s }), { hl: H({ [l]: 'skip', [r]: 'skip' }) });
        }
        T.st('if (Character.toLowerCase(s.charAt(l))', "'" + x + "' == '" + y + "' (case ignore) → aage", { hl: H({ [l]: 'found', [r]: 'found' }) });
        done[l] = 'found'; done[r] = 'found';
        l++; T.st('l++;', 'l → ' + l, { k: 2, hl: H({}) });
        r--; T.st('r--;', 'r → ' + r, { k: 2, hl: H({}) });
      }
      return T.end('return true', 'Saare pairs match → return true', finalRet(125, { s }), { hl: H({}) });
    },
  }, [{
    label: 'Clean + reverse', title: 'Valid Palindrome (Brute: clean string + reverse)', ap: 0,
    run({ s }) {
      const a = s.split(''); let sb = null, c, ci, clean, rev;
      const T = tracer(125, 0, o => ({ views: [A('s', a.map(x => (x === ' ' ? '␣' : x)), o.hl, o.ptr)].concat(sb ? [A('sb', sb.split(''), o.bh)] : []), vars: Object.assign({ s: '"' + s + '"' }, sb !== null ? { sb: '"' + sb + '"' } : {}, c !== undefined ? { c: "'" + c + "'" } : {}, clean !== undefined ? { clean: '"' + clean + '"' } : {}, rev !== undefined ? { rev: '"' + rev + '"' } : {}) }));
      T.st('public boolean isPalindrome', 'Method call — s = "' + s + '"');
      sb = ''; T.st('StringBuilder sb = new StringBuilder()', 'Khaali StringBuilder (O(n) extra)');
      for (ci = 0; ci < a.length; ci++) {
        c = a[ci];
        T.st('for (char c : s.toCharArray())', "c = '" + c + "'", { hl: { [ci]: 'cur' }, ptr: [{ i: ci, label: 'c' }] });
        if (isAN(c)) { sb += c.toLowerCase(); T.st('if (Character.isLetterOrDigit(c)) sb.append', "letter/digit → sb.append('" + c.toLowerCase() + "')", { hl: { [ci]: 'found' }, ptr: [{ i: ci, label: 'c' }], bh: { [sb.length - 1]: 'new' } }); }
        else T.st('if (Character.isLetterOrDigit(c)) sb.append', "'" + c + "' skip", { hl: { [ci]: 'skip' }, ptr: [{ i: ci, label: 'c' }] });
      }
      c = undefined;
      clean = sb; T.st('String clean = sb.toString()', 'clean = "' + clean + '"');
      rev = sb.split('').reverse().join(''); sb = rev; T.st('String rev = sb.reverse().toString()', 'rev = "' + rev + '" (sb bhi ulta ho gaya)');
      return T.end('return clean.equals(rev)', '"' + clean + '" ' + (clean === rev ? '==' : '≠') + ' "' + rev + '" → ' + (clean === rev), finalRet(125, { s }));
    },
  }]);

  // =====================================================================
  // LC 167 — Two Sum II
  // =====================================================================
  def(167, {
    title: 'Two Sum II (Optimal: opposite pointers)', label: 'Two pointers', ap: 2,
    run({ numbers, target }) {
      let l, r, sum;
      const T = tracer(167, 2, o => ({ views: [A('numbers', numbers, o.hl, P({ i: l, label: 'l' }, { i: r, label: 'r' }))], vars: Object.assign({ numbers: iA(numbers), target }, l !== undefined ? { l, r } : {}, sum !== undefined ? { sum } : {}) }));
      T.st('public int[] twoSum', 'Method call — numbers = ' + fmt(numbers) + ', target = ' + target);
      l = 0; r = numbers.length - 1; T.st('int l = 0, r = numbers.length - 1', 'l = 0, r = ' + r, { hl: { [l]: 'cur', [r]: 'win' } });
      while (true) {
        const go = l < r;
        T.st('while (l < r)', 'l = ' + l + ' < r = ' + r + ' ? ' + (go ? 'haan' : 'nahi'), { hl: go ? { [l]: 'cur', [r]: 'win' } : {} });
        if (!go) break;
        sum = numbers[l] + numbers[r]; T.st('int sum = numbers[l] + numbers[r]', 'sum = ' + numbers[l] + ' + ' + numbers[r] + ' = ' + sum, { hl: { [l]: 'cur', [r]: 'win' } });
        if (sum === target) return T.end('if (sum == target) return', sum + ' == ' + target + ' → return [' + (l + 1) + ', ' + (r + 1) + '] (1-indexed)', finalRet(167, { numbers, target }), { hl: { [l]: 'found', [r]: 'found' } });
        T.st('if (sum == target) return', sum + ' ≠ ' + target, { hl: { [l]: 'cur', [r]: 'win' } });
        if (sum < target) { l++; T.st('if (sum < target) l++', sum + ' < ' + target + ' → sum badhana hai → l++ = ' + l, { hl: { [l]: 'new' } }); }
        else { T.st('if (sum < target) l++', sum + ' < ' + target + ' ? nahi → else', { hl: { [l]: 'cur', [r]: 'win' } }); r--; T.st('else r--', sum + ' > ' + target + ' → sum ghatana hai → r-- = ' + r, { hl: { [r]: 'new' } }); }
      }
      return T.end('return new int[]{-1, -1}', 'Pair nahi', finalRet(167, { numbers, target }));
    },
  }, [{
    label: 'Har pair', title: 'Two Sum II (Brute: har pair)', ap: 0,
    run({ numbers, target }) {
      let n, i, j;
      const T = tracer(167, 0, o => ({ views: [A('numbers', numbers, o.hl, P({ i, label: 'i' }, { i: j, label: 'j' }).filter(p => p.i < numbers.length))], vars: Object.assign({ numbers: iA(numbers), target }, n !== undefined ? { n } : {}, i !== undefined ? { i } : {}, j !== undefined ? { j } : {}) }));
      T.st('public int[] twoSum', 'Method call — numbers = ' + fmt(numbers) + ', target = ' + target);
      n = numbers.length; T.st('int n = numbers.length', 'n = ' + n);
      for (i = 0; ; i++) {
        j = undefined;
        T.st('for (int i = 0', 'i = ' + i + ' < ' + n + ' ? ' + (i < n ? 'haan' : 'nahi'), { hl: i < n ? { [i]: 'cur' } : {} });
        if (i >= n) break;
        for (j = i + 1; ; j++) {
          T.st('for (int j = i + 1', 'j = ' + j + ' < ' + n + ' ? ' + (j < n ? 'haan' : 'nahi → agla i'), { hl: Object.assign({ [i]: 'cur' }, j < n ? { [j]: 'win' } : {}) });
          if (j >= n) break;
          const sum = numbers[i] + numbers[j];
          if (sum === target) return T.end('if (numbers[i] + numbers[j] == target) return', numbers[i] + ' + ' + numbers[j] + ' = ' + target + ' → [' + (i + 1) + ', ' + (j + 1) + ']', finalRet(167, { numbers, target }), { hl: { [i]: 'found', [j]: 'found' } });
          T.st('if (numbers[i] + numbers[j] == target) return', numbers[i] + ' + ' + numbers[j] + ' = ' + sum + ' ≠ ' + target, { hl: { [i]: 'cur', [j]: 'win' } });
        }
      }
      return T.end('return new int[]{-1, -1}', 'Pair nahi', finalRet(167, { numbers, target }));
    },
  }, {
    label: 'Binary search', title: 'Two Sum II (Better: har i ke liye binary search)', ap: 1,
    run({ numbers, target }) {
      let n, i, need, lo, hi, mid;
      const T = tracer(167, 1, o => ({ views: [A('numbers', numbers, o.hl, P({ i, label: 'i' }, { i: lo, label: 'lo' }, { i: mid, label: 'mid' }, { i: hi, label: 'hi' }).filter(p => p.i < numbers.length))], vars: Object.assign({ numbers: iA(numbers), target }, n !== undefined ? { n } : {}, i !== undefined ? { i } : {}, need !== undefined ? { need } : {}, lo !== undefined ? { lo, hi } : {}, mid !== undefined ? { mid } : {}) }));
      T.st('public int[] twoSum', 'Method call — numbers = ' + fmt(numbers) + ', target = ' + target);
      n = numbers.length; T.st('int n = numbers.length', 'n = ' + n);
      for (i = 0; ; i++) {
        need = undefined; lo = undefined; mid = undefined;
        T.st('for (int i = 0', 'i = ' + i + ' < ' + n + ' ? ' + (i < n ? 'haan' : 'nahi'), { hl: i < n ? { [i]: 'cur' } : {} });
        if (i >= n) break;
        need = target - numbers[i]; T.st('int need = target - numbers[i]', 'need = ' + target + ' − ' + numbers[i] + ' = ' + need, { hl: { [i]: 'cur' } });
        lo = i + 1; hi = n - 1; T.st('int lo = i + 1, hi = n - 1', 'search range [' + lo + '..' + hi + ']', { hl: rng(lo, hi, 'win', { [i]: 'cur' }) });
        while (true) {
          const go = lo <= hi;
          T.st('while (lo <= hi)', 'lo = ' + lo + ' ≤ hi = ' + hi + ' ? ' + (go ? 'haan' : 'nahi → is i ke liye nahi mila'), { hl: Object.assign({ [i]: 'cur' }, go ? rng(lo, hi, 'win') : {}) });
          if (!go) break;
          mid = lo + Math.floor((hi - lo) / 2); T.st('int mid = lo + (hi - lo) / 2', 'mid = ' + mid + ' (numbers[mid] = ' + numbers[mid] + ')', { hl: rng(lo, hi, 'win', { [i]: 'cur', [mid]: 'cur' }) });
          if (numbers[mid] === need) return T.end('if (numbers[mid] == need) return', numbers[mid] + ' == need → [' + (i + 1) + ', ' + (mid + 1) + ']', finalRet(167, { numbers, target }), { hl: { [i]: 'found', [mid]: 'found' } });
          T.st('if (numbers[mid] == need) return', numbers[mid] + ' ≠ ' + need, { hl: rng(lo, hi, 'win', { [i]: 'cur', [mid]: 'skip' }) });
          if (numbers[mid] < need) { lo = mid + 1; T.st('if (numbers[mid] < need) lo = mid + 1', numbers[mid] + ' < ' + need + ' → right half: lo = ' + lo, { hl: { [i]: 'cur' } }); }
          else { T.st('if (numbers[mid] < need) lo = mid + 1', numbers[mid] + ' < ' + need + ' ? nahi → else', { hl: { [i]: 'cur' } }); hi = mid - 1; T.st('else hi = mid - 1', 'left half: hi = ' + hi, { hl: { [i]: 'cur' } }); }
        }
      }
      return T.end('return new int[]{-1, -1}', 'Pair nahi', finalRet(167, { numbers, target }));
    },
  }]);

  // =====================================================================
  // LC 283 — Move Zeroes
  // =====================================================================
  def(283, {
    title: 'Move Zeroes (Optimal: read i / write k swap)', label: 'Swap (one pass)', ap: 2,
    run({ nums }) {
      const a = nums.slice(); let k, i, tmp;
      const T = tracer(283, 2, o => ({ views: [A('nums', a, Object.assign(k !== undefined ? rng(0, k - 1, 'done') : {}, o.hl), P({ i, label: 'i (read)' }, { i: k, label: 'k (write)' }).filter(p => p.i < a.length))], vars: Object.assign({ nums: iA(a) }, k !== undefined ? { k } : {}, i !== undefined ? { i } : {}, tmp !== undefined ? { tmp } : {}) }));
      T.st('public void moveZeroes', 'Method call — nums = ' + fmt(a));
      k = 0; T.st('int k = 0', 'k = 0 — agla non-zero yahan likhenge');
      for (i = 0; ; i++) {
        T.st('for (int i = 0', 'i = ' + i + ' < ' + a.length + ' ? ' + (i < a.length ? 'haan' : 'nahi'), { hl: i < a.length ? { [i]: 'cur' } : {} });
        if (i >= a.length) break;
        if (a[i] === 0) { T.st('if (nums[i] != 0)', 'nums[' + i + '] = 0 → skip (k wahi)', { hl: { [i]: 'skip' } }); continue; }
        T.st('if (nums[i] != 0)', 'nums[' + i + '] = ' + a[i] + ' ≠ 0 → swap(k, i)', { hl: { [i]: 'cur', [k]: 'win' } });
        tmp = a[k]; T.st('int tmp = nums[k]', 'tmp = nums[' + k + '] = ' + tmp, { hl: { [i]: 'cur', [k]: 'win' } });
        a[k] = a[i]; T.st('nums[k] = nums[i]', 'nums[' + k + '] = ' + a[k], { hl: { [k]: 'new', [i]: 'cur' } });
        a[i] = tmp; T.st('nums[i] = tmp', 'nums[' + i + '] = ' + tmp + (i === k ? ' (same index)' : ''), { hl: { [k]: 'new', [i]: 'new' } });
        tmp = undefined;
        k++; T.st('k++;', 'k → ' + k);
      }
      i = undefined;
      return T.end(T.ln.last, 'Method khatam — ' + fmt(a) + ' (order same, zeros end me)', finalRet(283, { nums }));
    },
  }, [{
    label: 'Temp array', title: 'Move Zeroes (Brute: temp array)', ap: 0,
    run({ nums }) {
      const a = nums.slice(); let n, tmp = null, idx, x, xi, i;
      const T = tracer(283, 0, o => ({ views: [A('nums', a, o.hl, o.ptr)].concat(tmp ? [A('tmp', tmp, o.th)] : []), vars: Object.assign({ nums: iA(a) }, n !== undefined ? { n } : {}, tmp ? { tmp: iA(tmp) } : {}, idx !== undefined ? { idx } : {}, x !== undefined ? { x } : {}, i !== undefined ? { i } : {}) }));
      T.st('public void moveZeroes', 'Method call — nums = ' + fmt(a));
      n = a.length; T.st('int n = nums.length', 'n = ' + n);
      tmp = new Array(n).fill(0); T.st('int[] tmp = new int[n]', 'tmp = new int[' + n + '] (O(n) extra, sab 0)');
      idx = 0; T.st('int idx = 0', 'idx = 0');
      for (xi = 0; xi < n; xi++) {
        x = a[xi]; T.st('for (int x : nums)', 'x = ' + x, { hl: { [xi]: 'cur' }, ptr: [{ i: xi, label: 'x' }] });
        if (x !== 0) { tmp[idx] = x; idx++; T.st('if (x != 0) tmp[idx++] = x', x + ' ≠ 0 → tmp[' + (idx - 1) + '] = ' + x, { hl: { [xi]: 'found' }, ptr: [{ i: xi, label: 'x' }], th: { [idx - 1]: 'new' } }); }
        else T.st('if (x != 0) tmp[idx++] = x', '0 → skip', { hl: { [xi]: 'skip' }, ptr: [{ i: xi, label: 'x' }] });
      }
      x = undefined;
      for (i = 0; ; i++) {
        T.st('for (int i = 0; i < n; i++)', 'i = ' + i + ' < ' + n + ' ? ' + (i < n ? 'haan' : 'nahi'), { th: i < n ? { [i]: 'cur' } : {} });
        if (i >= n) break;
        a[i] = tmp[i]; T.st('nums[i] = tmp[i]', 'nums[' + i + '] = ' + a[i], { hl: { [i]: 'new' }, ptr: [{ i, label: 'i' }], th: { [i]: 'cur' } });
      }
      i = undefined;
      return T.end(T.ln.last, 'Method khatam — ' + fmt(a), finalRet(283, { nums }));
    },
  }, {
    label: 'Compact + fill', title: 'Move Zeroes (Better: compact, phir zeros bharo)', ap: 1,
    run({ nums }) {
      const a = nums.slice(); let k, i;
      const T = tracer(283, 1, o => ({ views: [A('nums', a, o.hl, P({ i, label: 'i' }, { i: k, label: 'k' }).filter(p => p.i < a.length))], vars: Object.assign({ nums: iA(a) }, k !== undefined ? { k } : {}, i !== undefined ? { i } : {}) }));
      T.st('public void moveZeroes', 'Method call — nums = ' + fmt(a));
      k = 0; T.st('int k = 0', 'k = 0');
      for (i = 0; ; i++) {
        T.st('for (int i = 0', 'i = ' + i + ' < ' + a.length + ' ? ' + (i < a.length ? 'haan' : 'nahi'), { hl: i < a.length ? { [i]: 'cur' } : {} });
        if (i >= a.length) break;
        if (a[i] !== 0) { a[k] = a[i]; k++; T.st('if (nums[i] != 0) nums[k++] = nums[i]', 'nums[' + (k - 1) + '] = ' + a[k - 1] + ', k = ' + k, { hl: { [k - 1]: 'new', [i]: 'cur' } }); }
        else T.st('if (nums[i] != 0) nums[k++] = nums[i]', '0 → skip', { hl: { [i]: 'skip' } });
      }
      i = undefined;
      while (true) {
        T.st('while (k < nums.length)', 'k = ' + k + ' < ' + a.length + ' ? ' + (k < a.length ? 'haan → 0 bharo' : 'nahi'), { hl: k < a.length ? { [k]: 'cur' } : {} });
        if (k >= a.length) break;
        a[k] = 0; k++; T.st('nums[k++] = 0', 'nums[' + (k - 1) + '] = 0', { hl: { [k - 1]: 'new' } });
      }
      return T.end(T.ln.last, 'Method khatam — ' + fmt(a) + ' (do pass)', finalRet(283, { nums }));
    },
  }]);

  // =====================================================================
  // LC 11 — Container With Most Water
  // =====================================================================
  def(11, {
    title: 'Container With Most Water (Optimal: move shorter wall)', label: 'Two pointers', ap: 1,
    run({ height }) {
      let l, r, best, h;
      const T = tracer(11, 1, o => ({ views: [A('height', height, o.hl, P({ i: l, label: 'l' }, { i: r, label: 'r' }))], vars: Object.assign({ height: iA(height) }, l !== undefined ? { l, r, best } : {}, h !== undefined ? { h } : {}) }));
      T.st('public int maxArea', 'Method call — height = ' + fmt(height));
      l = 0; r = height.length - 1; best = 0; T.st('int l = 0, r = height.length - 1, best = 0', 'l = 0, r = ' + r + ', best = 0', { hl: { [l]: 'cur', [r]: 'win' } });
      while (true) {
        const go = l < r;
        T.st('while (l < r)', 'l = ' + l + ' < r = ' + r + ' ? ' + (go ? 'haan' : 'nahi'), { hl: go ? rng(l, r, 'win', { [l]: 'cur', [r]: 'cur' }) : {} });
        if (!go) break;
        h = Math.min(height[l], height[r]); T.st('int h = Math.min(height[l], height[r])', 'h = min(' + height[l] + ', ' + height[r] + ') = ' + h + ' (chhoti deewar hi paani rokti hai)', { hl: { [l]: 'cur', [r]: 'cur' } });
        const area = h * (r - l), nb = Math.max(best, area);
        T.st('best = Math.max(best, h * (r - l))', 'area = ' + h + ' × ' + (r - l) + ' = ' + area + ' → best = ' + nb, { hl: rng(l, r, area > best ? 'found' : 'win') });
        best = nb;
        if (height[l] < height[r]) { l++; T.st('if (height[l] < height[r]) l++', 'left chhoti → l++ = ' + l + ' (shayad lambi deewar mile)', { hl: { [l]: 'new' } }); }
        else { T.st('if (height[l] < height[r]) l++', height[l] + ' < ' + height[r] + ' ? nahi → else', { hl: { [l]: 'cur', [r]: 'cur' } }); r--; T.st('else r--', 'right chhoti/barabar → r-- = ' + r, { hl: { [r]: 'new' } }); }
      }
      h = undefined;
      return T.end('return best', 'return ' + best, finalRet(11, { height }));
    },
  }, [{
    label: 'Har pair', title: 'Container With Most Water (Brute: har pair)', ap: 0,
    run({ height }) {
      let n, best, i, j, area;
      const T = tracer(11, 0, o => ({ views: [A('height', height, o.hl, P({ i, label: 'i' }, { i: j, label: 'j' }).filter(p => p.i < height.length))], vars: Object.assign({ height: iA(height) }, n !== undefined ? { n, best } : {}, i !== undefined ? { i } : {}, j !== undefined ? { j } : {}, area !== undefined ? { area } : {}) }));
      T.st('public int maxArea', 'Method call — height = ' + fmt(height));
      n = height.length; best = 0; T.st('int n = height.length, best = 0', 'n = ' + n + ', best = 0');
      for (i = 0; ; i++) {
        j = undefined; area = undefined;
        T.st('for (int i = 0', 'i = ' + i + ' < ' + n + ' ? ' + (i < n ? 'haan' : 'nahi'), { hl: i < n ? { [i]: 'cur' } : {} });
        if (i >= n) break;
        for (j = i + 1; ; j++) {
          T.st('for (int j = i + 1', 'j = ' + j + ' < ' + n + ' ? ' + (j < n ? 'haan' : 'nahi'), { hl: Object.assign({ [i]: 'cur' }, j < n ? { [j]: 'win' } : {}) });
          if (j >= n) break;
          area = Math.min(height[i], height[j]) * (j - i); T.st('int area = Math.min(height[i], height[j]) * (j - i)', 'area = min(' + height[i] + ', ' + height[j] + ') × ' + (j - i) + ' = ' + area, { hl: { [i]: 'cur', [j]: 'win' } });
          const nb = Math.max(best, area); T.st('best = Math.max(best, area)', 'best = ' + nb + (nb > best ? ' (naya max!)' : ''), { hl: { [i]: nb > best ? 'found' : 'cur', [j]: nb > best ? 'found' : 'win' } }); best = nb;
        }
      }
      i = undefined; area = undefined;
      return T.end('return best', 'return ' + best + ' (O(n²) pairs)', finalRet(11, { height }));
    },
  }]);

  // =====================================================================
  // LC 15 — 3Sum
  // =====================================================================
  const tri = t => '[' + t.join(',') + ']';
  def(15, {
    title: '3Sum (Optimal: sort + fix i + two pointers)', label: 'Sort + two pointers', ap: 2,
    run({ nums }) {
      let a = nums.slice(), sorted = false, res = null, i, l, r, sum;
      const T = tracer(15, 2, o => ({ views: [A(sorted ? 'nums (sorted)' : 'nums', a, o.hl, P({ i, label: 'i' }, { i: l, label: 'l' }, { i: r, label: 'r' }).filter(p => p.i < a.length))].concat(res ? [{ type: 'text', label: 'res', value: '[' + res.map(tri).join(', ') + ']' }] : []), vars: Object.assign({ nums: iA(a) }, res ? { res: 'List size=' + res.length + ' [' + res.map(tri).join(', ') + ']' } : {}, i !== undefined ? { i } : {}, l !== undefined ? { l, r } : {}, sum !== undefined ? { sum } : {}) }));
      T.st('public List<List<Integer>> threeSum', 'Method call — nums = ' + fmt(nums));
      a.sort((x, y) => x - y); sorted = true; T.st('Arrays.sort(nums)', 'Sort → ' + fmt(a) + ' (two pointers + duplicate skip ke liye zaroori)');
      res = []; T.st('List<List<Integer>> res = new ArrayList<>()', 'res = []');
      for (i = 0; ; i++) {
        l = undefined; sum = undefined;
        const go = i < a.length - 2;
        T.st('for (int i = 0; i < nums.length - 2', 'i = ' + i + ' < ' + (a.length - 2) + ' ? ' + (go ? 'haan' : 'nahi'), { hl: go ? { [i]: 'cur' } : {} });
        if (!go) break;
        if (i > 0 && a[i] === a[i - 1]) { T.st('if (i > 0 && nums[i] == nums[i - 1]) continue', 'nums[' + i + '] = ' + a[i] + ' pichle jaisa → skip (duplicate triplets na banein)', { hl: { [i]: 'skip', [i - 1]: 'win' } }); continue; }
        T.st('if (i > 0 && nums[i] == nums[i - 1]) continue', 'duplicate nahi', { hl: { [i]: 'cur' } });
        if (a[i] > 0) { T.st('if (nums[i] > 0) break', 'nums[i] = ' + a[i] + ' > 0 → aage sab positive, sum 0 ho hi nahi sakta → break', { hl: { [i]: 'skip' } }); break; }
        T.st('if (nums[i] > 0) break', 'nums[i] = ' + a[i] + ' ≤ 0 → aage', { hl: { [i]: 'cur' } });
        l = i + 1; r = a.length - 1; T.st('int l = i + 1, r = nums.length - 1', 'fix ' + a[i] + '; l = ' + l + ', r = ' + r, { hl: { [i]: 'cur', [l]: 'win', [r]: 'win' } });
        while (true) {
          const g = l < r;
          T.st('while (l < r)', 'l = ' + l + ' < r = ' + r + ' ? ' + (g ? 'haan' : 'nahi → agla i'), { hl: Object.assign({ [i]: 'cur' }, g ? { [l]: 'win', [r]: 'win' } : {}) });
          if (!g) break;
          sum = a[i] + a[l] + a[r]; T.st('int sum = nums[i] + nums[l] + nums[r]', 'sum = ' + a[i] + ' + ' + a[l] + ' + ' + a[r] + ' = ' + sum, { hl: { [i]: 'cur', [l]: 'win', [r]: 'win' } });
          if (sum < 0) { l++; T.st('if (sum < 0) l++', sum + ' < 0 → bada chahiye → l++ = ' + l, { hl: { [i]: 'cur', [l]: 'new' } }); continue; }
          T.st('if (sum < 0) l++', sum + ' < 0 ? nahi', { hl: { [i]: 'cur', [l]: 'win', [r]: 'win' } });
          if (sum > 0) { r--; T.st('else if (sum > 0) r--', sum + ' > 0 → chhota chahiye → r-- = ' + r, { hl: { [i]: 'cur', [r]: 'new' } }); continue; }
          T.st('else if (sum > 0) r--', 'sum == 0 → triplet mila!', { hl: { [i]: 'found', [l]: 'found', [r]: 'found' } });
          res.push([a[i], a[l], a[r]]); T.st('res.add(Arrays.asList(nums[i], nums[l], nums[r]))', 'res.add(' + tri([a[i], a[l], a[r]]) + ')', { hl: { [i]: 'found', [l]: 'found', [r]: 'found' } });
          l++; T.st('l++;', 'l → ' + l, { k: 2, hl: { [i]: 'cur' } });
          r--; T.st('r--;', 'r → ' + r, { k: 2, hl: { [i]: 'cur' } });
          while (true) { const d = l < r && a[l] === a[l - 1]; T.st('while (l < r && nums[l] == nums[l - 1]) l++', d ? 'nums[l] = ' + a[l] + ' duplicate → l++' : 'l pe duplicate nahi', { hl: { [i]: 'cur', [l]: d ? 'skip' : 'win' } }); if (!d) break; l++; }
          while (true) { const d = l < r && a[r] === a[r + 1]; T.st('while (l < r && nums[r] == nums[r + 1]) r--', d ? 'nums[r] = ' + a[r] + ' duplicate → r--' : 'r pe duplicate nahi', { hl: { [i]: 'cur', [r]: d ? 'skip' : 'win' } }); if (!d) break; r--; }
        }
      }
      i = undefined; l = undefined; sum = undefined;
      return T.end('return res', 'return [' + res.map(tri).join(', ') + ']', finalRet(15, { nums }));
    },
  }, [{
    label: '3 loops', title: '3Sum (Brute: teen loops + Set)', ap: 0,
    run({ nums }) {
      let a = nums.slice(), sorted = false, set = null, n, i, j, k;
      const key = t => tri(t);
      const T = tracer(15, 0, o => ({ views: [A(sorted ? 'nums (sorted)' : 'nums', a, o.hl, P({ i, label: 'i' }, { i: j, label: 'j' }, { i: k, label: 'k' }).filter(p => p.i < a.length))].concat(set ? [S('HashSet set', set, o.sh)] : []), vars: Object.assign({ nums: iA(a) }, set ? { set: 'HashSet size=' + set.size } : {}, n !== undefined ? { n } : {}, i !== undefined ? { i } : {}, j !== undefined ? { j } : {}, k !== undefined ? { k } : {}) }));
      T.st('public List<List<Integer>> threeSum', 'Method call — nums = ' + fmt(nums));
      a.sort((x, y) => x - y); sorted = true; T.st('Arrays.sort(nums)', 'Sort → ' + fmt(a) + ' (triplet sorted rahe, Set duplicate pakde)');
      set = new Set(); T.st('Set<List<Integer>> set = new HashSet<>()', 'Khaali Set');
      n = a.length; T.st('int n = nums.length', 'n = ' + n);
      for (i = 0; ; i++) {
        j = undefined; k = undefined;
        T.st('for (int i = 0', 'i = ' + i + (i < n ? '' : ' → loop khatam'), { hl: i < n ? { [i]: 'cur' } : {} });
        if (i >= n) break;
        for (j = i + 1; ; j++) {
          k = undefined;
          T.st('for (int j = i + 1', 'j = ' + j + (j < n ? '' : ' → agla i'), { hl: Object.assign({ [i]: 'cur' }, j < n ? { [j]: 'win' } : {}) });
          if (j >= n) break;
          for (k = j + 1; ; k++) {
            T.st('for (int k = j + 1', 'k = ' + k + (k < n ? '' : ' → agla j'), { hl: Object.assign({ [i]: 'cur', [j]: 'win' }, k < n ? { [k]: 'win' } : {}) });
            if (k >= n) break;
            const s3 = a[i] + a[j] + a[k];
            T.st('if (nums[i] + nums[j] + nums[k] == 0)', a[i] + ' + ' + a[j] + ' + ' + a[k] + ' = ' + s3 + (s3 === 0 ? ' == 0!' : ''), { hl: { [i]: s3 === 0 ? 'found' : 'cur', [j]: s3 === 0 ? 'found' : 'win', [k]: s3 === 0 ? 'found' : 'win' } });
            if (s3 === 0) { const t = key([a[i], a[j], a[k]]), had = set.has(t); set.add(t); T.st('set.add(Arrays.asList(nums[i], nums[j], nums[k]))', 'set.add(' + t + ')' + (had ? ' → pehle se hai (duplicate ignore)' : ''), { hl: { [i]: 'found', [j]: 'found', [k]: 'found' }, sh: t }); }
          }
        }
      }
      i = undefined;
      return T.end('return new ArrayList<>(set)', 'return [' + [...set].join(', ') + '] (O(n³))', finalRet(15, { nums }));
    },
  }, {
    label: 'HashSet per i', title: '3Sum (Better: har i ke liye HashSet)', ap: 1,
    run({ nums }) {
      const a = nums; let res = null, n, i, seen = null, j, third;
      const T = tracer(15, 1, o => ({ views: [A('nums', a, o.hl, P({ i, label: 'i' }, { i: j, label: 'j' }).filter(p => p.i < a.length))].concat(seen ? [S('HashSet seen', seen, o.sh)] : []).concat(res ? [S('Set res', res)] : []), vars: Object.assign({ nums: iA(a) }, res ? { res: 'HashSet size=' + res.size + ' [' + [...res].join(', ') + ']' } : {}, n !== undefined ? { n } : {}, i !== undefined ? { i } : {}, seen ? { seen: 'HashSet [' + [...seen].join(', ') + ']' } : {}, j !== undefined ? { j } : {}, third !== undefined ? { third } : {}) }));
      T.st('public List<List<Integer>> threeSum', 'Method call — nums = ' + fmt(nums) + ' (sort nahi)');
      res = new Set(); T.st('Set<List<Integer>> res = new HashSet<>()', 'res = Set (duplicate triplets ke liye)');
      n = a.length; T.st('int n = nums.length', 'n = ' + n);
      for (i = 0; ; i++) {
        seen = null; j = undefined; third = undefined;
        T.st('for (int i = 0', 'i = ' + i + (i < n ? '' : ' → loop khatam'), { hl: i < n ? { [i]: 'cur' } : {} });
        if (i >= n) break;
        seen = new Set(); T.st('Set<Integer> seen = new HashSet<>()', 'naya seen (is i ke liye)', { hl: { [i]: 'cur' } });
        for (j = i + 1; ; j++) {
          third = undefined;
          T.st('for (int j = i + 1', 'j = ' + j + (j < n ? '' : ' → agla i'), { hl: Object.assign({ [i]: 'cur' }, j < n ? { [j]: 'win' } : {}) });
          if (j >= n) break;
          third = -(a[i] + a[j]); T.st('int third = -(nums[i] + nums[j])', 'third = −(' + a[i] + ' + ' + a[j] + ') = ' + third, { hl: { [i]: 'cur', [j]: 'win' }, sh: third });
          if (seen.has(third)) {
            T.st('if (seen.contains(third))', third + ' seen me hai → triplet!', { hl: { [i]: 'found', [j]: 'found' }, sh: third });
            const t = [a[i], a[j], third];
            T.st('List<Integer> t = Arrays.asList(nums[i], nums[j], third)', 't = ' + tri(t), { hl: { [i]: 'found', [j]: 'found' } });
            t.sort((x, y) => x - y); T.st('Collections.sort(t)', 'sort → ' + tri(t) + ' (taaki same triplet ek jaisa dikhe)', { hl: { [i]: 'found', [j]: 'found' } });
            const had = res.has(tri(t)); res.add(tri(t)); T.st('res.add(t)', 'res.add(' + tri(t) + ')' + (had ? ' → pehle se hai' : ''), { hl: { [i]: 'found', [j]: 'found' } });
          } else T.st('if (seen.contains(third))', third + ' seen me nahi', { hl: { [i]: 'cur', [j]: 'win' }, sh: third });
          seen.add(a[j]); T.st('seen.add(nums[j])', 'seen.add(' + a[j] + ')', { hl: { [i]: 'cur', [j]: 'win' }, sh: a[j] });
        }
      }
      i = undefined; seen = null;
      return T.end('return new ArrayList<>(res)', 'return [' + [...res].join(', ') + '] (O(n²) time, O(n) space)', finalRet(15, { nums }));
    },
  }]);

  // =====================================================================
  // LC 42 — Trapping Rain Water
  // =====================================================================
  def(42, {
    title: 'Trapping Rain Water (Optimal: two pointers, O(1) space)', label: 'Two pointers (O(1))', ap: 2,
    run({ height }) {
      let l, r, leftMax, rightMax, water;
      const wat = height.map(() => '');
      const T = tracer(42, 2, o => ({ views: [A('height', height, o.hl, P({ i: l, label: 'l' }, { i: r, label: 'r' })), A('water[i]', wat, o.wh)], vars: Object.assign({ height: iA(height) }, l !== undefined ? { l, r } : {}, leftMax !== undefined ? { leftMax, rightMax, water } : {}) }));
      T.st('public int trap', 'Method call — height = ' + fmt(height));
      l = 0; r = height.length - 1; T.st('int l = 0, r = height.length - 1', 'l = 0, r = ' + r, { hl: { [l]: 'cur', [r]: 'win' } });
      leftMax = 0; rightMax = 0; water = 0; T.st('int leftMax = 0, rightMax = 0, water = 0', 'leftMax = rightMax = water = 0');
      while (true) {
        const go = l < r;
        T.st('while (l < r)', 'l = ' + l + ' < r = ' + r + ' ? ' + (go ? 'haan' : 'nahi'), { hl: go ? { [l]: 'cur', [r]: 'win' } : {} });
        if (!go) break;
        if (height[l] < height[r]) {
          T.st('if (height[l] < height[r])', height[l] + ' < ' + height[r] + ' → left side limiting hai (right pe badi deewar pakki)', { hl: { [l]: 'cur', [r]: 'win' } });
          leftMax = Math.max(leftMax, height[l]); T.st('leftMax = Math.max(leftMax, height[l])', 'leftMax = ' + leftMax, { hl: { [l]: 'cur' } });
          const w = leftMax - height[l]; water += w; wat[l] = w; T.st('water += leftMax - height[l]', 'index ' + l + ' pe ' + leftMax + ' − ' + height[l] + ' = ' + w + ' → water = ' + water, { hl: { [l]: w ? 'found' : 'cur' }, wh: { [l]: 'new' } });
          l++; T.st('l++;', 'l → ' + l);
        } else {
          T.st('if (height[l] < height[r])', height[l] + ' < ' + height[r] + ' ? nahi → right side limiting', { hl: { [l]: 'cur', [r]: 'win' } });
          rightMax = Math.max(rightMax, height[r]); T.st('rightMax = Math.max(rightMax, height[r])', 'rightMax = ' + rightMax, { hl: { [r]: 'cur' } });
          const w = rightMax - height[r]; water += w; wat[r] = w; T.st('water += rightMax - height[r]', 'index ' + r + ' pe ' + rightMax + ' − ' + height[r] + ' = ' + w + ' → water = ' + water, { hl: { [r]: w ? 'found' : 'cur' }, wh: { [r]: 'new' } });
          r--; T.st('r--;', 'r → ' + r);
        }
      }
      return T.end('return water', 'return ' + water, finalRet(42, { height }));
    },
  }, [{
    label: 'Har index left/right max', title: 'Trapping Rain Water (Brute: O(n²))', ap: 0,
    run({ height }) {
      let n, water, i, j, leftMax, rightMax;
      const wat = height.map(() => '');
      const T = tracer(42, 0, o => ({ views: [A('height', height, o.hl, P({ i, label: 'i' }, { i: j, label: 'j' }).filter(p => p.i < height.length)), A('water[i]', wat, o.wh)], vars: Object.assign({ height: iA(height) }, n !== undefined ? { n, water } : {}, i !== undefined ? { i } : {}, leftMax !== undefined ? { leftMax, rightMax } : {}, j !== undefined ? { j } : {}) }));
      T.st('public int trap', 'Method call — height = ' + fmt(height));
      n = height.length; water = 0; T.st('int n = height.length, water = 0', 'n = ' + n + ', water = 0');
      for (i = 0; ; i++) {
        j = undefined; leftMax = undefined;
        T.st('for (int i = 0; i < n; i++) {', 'i = ' + i + (i < n ? '' : ' → loop khatam'), { hl: i < n ? { [i]: 'cur' } : {} });
        if (i >= n) break;
        leftMax = 0; rightMax = 0; T.st('int leftMax = 0, rightMax = 0', 'leftMax = rightMax = 0', { hl: { [i]: 'cur' } });
        for (j = 0; j <= i; j++) { leftMax = Math.max(leftMax, height[j]); T.st('for (int j = 0; j <= i; j++) leftMax', 'j = ' + j + ': leftMax = ' + leftMax, { hl: rng(0, j, 'win', { [i]: 'cur' }) }); }
        for (j = i; j < n; j++) { rightMax = Math.max(rightMax, height[j]); T.st('for (int j = i; j < n; j++) rightMax', 'j = ' + j + ': rightMax = ' + rightMax, { hl: rng(i, j, 'win', { [i]: 'cur' }) }); }
        j = undefined;
        const w = Math.min(leftMax, rightMax) - height[i]; water += w; wat[i] = w;
        T.st('water += Math.min(leftMax, rightMax) - height[i]', 'min(' + leftMax + ', ' + rightMax + ') − ' + height[i] + ' = ' + w + ' → water = ' + water, { hl: { [i]: w ? 'found' : 'cur' }, wh: { [i]: 'new' } });
      }
      i = undefined; leftMax = undefined;
      return T.end('return water', 'return ' + water + ' (har index pe dono taraf dobara scan — O(n²))', finalRet(42, { height }));
    },
  }, {
    label: 'Prefix / suffix max', title: 'Trapping Rain Water (Better: leftMax[] + rightMax[])', ap: 1,
    run({ height }) {
      let n, lm = null, rm = null, water, i;
      const T = tracer(42, 1, o => ({ views: [A('height', height, o.hl, i !== undefined && i >= 0 && i < height.length ? [{ i, label: 'i' }] : [])].concat(lm ? [A('leftMax', lm, o.lh), A('rightMax', rm, o.rh)] : []), vars: Object.assign({ height: iA(height) }, n !== undefined ? { n } : {}, lm ? { leftMax: iA(lm), rightMax: iA(rm) } : {}, water !== undefined ? { water } : {}, i !== undefined ? { i } : {}) }));
      T.st('public int trap', 'Method call — height = ' + fmt(height));
      n = height.length; T.st('int n = height.length', 'n = ' + n);
      lm = new Array(n).fill(0); rm = new Array(n).fill(0); T.st('int[] leftMax = new int[n]', 'do arrays (O(n) extra)');
      lm[0] = height[0]; T.st('leftMax[0] = height[0]', 'leftMax[0] = ' + lm[0], { lh: { 0: 'new' } });
      for (i = 1; i < n; i++) { lm[i] = Math.max(lm[i - 1], height[i]); T.st('for (int i = 1; i < n; i++) leftMax[i]', 'leftMax[' + i + '] = max(' + lm[i - 1] + ', ' + height[i] + ') = ' + lm[i], { hl: { [i]: 'cur' }, lh: { [i]: 'new' } }); }
      rm[n - 1] = height[n - 1]; T.st('rightMax[n - 1] = height[n - 1]', 'rightMax[' + (n - 1) + '] = ' + rm[n - 1], { rh: { [n - 1]: 'new' } });
      for (i = n - 2; i >= 0; i--) { rm[i] = Math.max(rm[i + 1], height[i]); T.st('for (int i = n - 2; i >= 0; i--) rightMax[i]', 'rightMax[' + i + '] = ' + rm[i], { hl: { [i]: 'cur' }, rh: { [i]: 'new' } }); }
      water = 0; i = undefined; T.st('int water = 0', 'water = 0');
      for (i = 0; i < n; i++) { const w = Math.min(lm[i], rm[i]) - height[i]; water += w; T.st('for (int i = 0; i < n; i++) water +=', 'i = ' + i + ': min(' + lm[i] + ', ' + rm[i] + ') − ' + height[i] + ' = ' + w + ' → water = ' + water, { hl: { [i]: w ? 'found' : 'cur' }, lh: { [i]: 'cur' }, rh: { [i]: 'cur' } }); }
      i = undefined;
      return T.end('return water', 'return ' + water, finalRet(42, { height }));
    },
  }]);
})();
