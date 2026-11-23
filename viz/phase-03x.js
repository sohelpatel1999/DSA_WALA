// Phase 3 (Sliding Window) — SAARE approaches ke LINE-BY-LINE debugger tabs (Week 4 rewrite, 2026-11-08).
// Purane base defs (viz/phase-03.js) ko replace karta hai. Final `ret` purane base visualizer se (format same).
(function () {
  const { recorder, fmt, MAX_STEPS } = VIZ.util;
  const QS = [643, 1456, 3, 209, 424, 76];
  const Q = n => window.PHASE_CONTENT['sliding-window'].questions[n];
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
      if (rec.steps.length >= MAX_STEPS - 1) return;
      const r = render(o);
      rec.s(typeof snip === 'number' ? snip : ln(snip, o.k), note, Object.assign({ views: r.views, vars: r.vars }, o.frames ? { frames: o.frames } : {}, o.ret !== undefined ? { ret: o.ret } : {}));
    };
    const end = (snip, note, ret, o) => {
      if (rec.steps.length >= MAX_STEPS - 1) rec.steps.length = MAX_STEPS - 2;
      const r = render(o || {});
      rec.s(typeof snip === 'number' ? snip : ln(snip), note, { views: r.views, vars: r.vars, ret });
      return rec.steps;
    };
    return { st, end, ln };
  }
  const A = (label, vals, hl, ptr) => ({ type: 'array', label, vals: vals.map(v => (v === null || v === undefined ? '' : v)), hl: hl || {}, ptr: ptr || [] });
  const S = (label, items, hl) => ({ type: 'set', label, items: [...items], hl });
  const M = (label, obj, hl) => ({ type: 'map', label, entries: Object.assign({}, obj), hl });
  const iA = a => 'int[' + a.length + '] [' + a.join(', ') + ']';
  const rng = (a, b, cls, base) => { const o = Object.assign({}, base); for (let i = a; i <= b; i++) if (!o[i]) o[i] = cls; return o; };
  const P = (len, ...pairs) => pairs.filter(p => p && p.i !== undefined && p.i !== null && p.i >= 0 && p.i < len).map(p => ({ i: p.i, label: p.label }));
  const def = (n, base, variants) => { VIZ.defs[n] = Object.assign({ inputs: OLD[n].inputs }, base, { variants }); };
  const MAXI = 2147483647, showMax = v => (v === Infinity ? 'MAX_VALUE' : v);
  const isV = c => 'aeiou'.includes(c);
  const q = c => "'" + c + "'";

  // =====================================================================
  // LC 643 — Maximum Average Subarray I
  // =====================================================================
  def(643, {
    title: 'Max Average Subarray I (Optimal: fixed sliding window)', label: 'Fixed window', ap: 1,
    run({ nums, k }) {
      let sum, i, best, l;
      const T = tracer(643, 1, o => ({ views: [A('nums', nums, o.hl, P(nums.length, { i, label: 'i (add)' }, { i: l, label: 'i−k (remove)' }))], vars: Object.assign({ nums: iA(nums), k }, sum !== undefined ? { sum } : {}, i !== undefined ? { i } : {}, best !== undefined ? { best } : {}) }));
      T.st('public double findMaxAverage', 'Method call — nums = ' + fmt(nums) + ', k = ' + k);
      sum = 0; T.st('int sum = 0', 'sum = 0');
      for (i = 0; i < k; i++) { sum += nums[i]; T.st('for (int i = 0; i < k; i++) sum', 'pehli window: + nums[' + i + '] = ' + nums[i] + ' → sum = ' + sum, { hl: rng(0, i, 'win') }); }
      i = undefined;
      best = sum; T.st('int best = sum', 'best = ' + best + ' (window [0..' + (k - 1) + '])', { hl: rng(0, k - 1, 'found') });
      for (i = k; ; i++) {
        l = undefined;
        T.st('for (int i = k; i < nums.length', 'i = ' + i + ' < ' + nums.length + ' ? ' + (i < nums.length ? 'haan → window slide' : 'nahi'), { hl: i < nums.length ? rng(i - k + 1, i, 'win', { [i]: 'cur', [i - k]: 'skip' }) : {} });
        if (i >= nums.length) break;
        l = i - k;
        sum += nums[i] - nums[l]; T.st('sum += nums[i] - nums[i - k]', '+ ' + nums[i] + ' (naya) − ' + nums[l] + ' (purana) → sum = ' + sum, { hl: rng(i - k + 1, i, 'win', { [i]: 'new', [l]: 'skip' }) });
        const nb = Math.max(best, sum); T.st('best = Math.max(best, sum)', 'best = ' + nb + (nb > best ? ' (naya max!)' : ''), { hl: rng(i - k + 1, i, nb > best ? 'found' : 'win') }); best = nb;
      }
      i = undefined; l = undefined;
      return T.end('return (double) best / k', best + ' / ' + k + ' = ' + (best / k), finalRet(643, { nums, k }));
    },
  }, [{
    label: 'Har window dobara', title: 'Max Average Subarray I (Brute: O(n·k))', ap: 0,
    run({ nums, k }) {
      let best, i, sum, j;
      const T = tracer(643, 0, o => ({ views: [A('nums', nums, o.hl, P(nums.length, { i, label: 'i' }, { i: j, label: 'j' }))], vars: Object.assign({ nums: iA(nums), k }, best !== undefined ? { best: best === -Infinity ? '-MAX_VALUE' : best } : {}, i !== undefined ? { i } : {}, sum !== undefined ? { sum } : {}, j !== undefined ? { j } : {}) }));
      T.st('public double findMaxAverage', 'Method call — nums = ' + fmt(nums) + ', k = ' + k);
      best = -Infinity; T.st('double best = -Double.MAX_VALUE', 'best = sabse chhota double');
      for (i = 0; ; i++) {
        sum = undefined; j = undefined;
        T.st('for (int i = 0; i + k <= nums.length', 'i = ' + i + ': ' + (i + k) + ' ≤ ' + nums.length + ' ? ' + (i + k <= nums.length ? 'haan' : 'nahi'), { hl: i + k <= nums.length ? rng(i, i + k - 1, 'win') : {} });
        if (i + k > nums.length) break;
        sum = 0; T.st('int sum = 0', 'har window ka sum shuru se (yahi slow hai)', { hl: rng(i, i + k - 1, 'win') });
        for (j = i; j < i + k; j++) { sum += nums[j]; T.st('for (int j = i; j < i + k; j++) sum', '+ nums[' + j + '] = ' + nums[j] + ' → sum = ' + sum, { hl: rng(i, i + k - 1, 'win', { [j]: 'cur' }) }); }
        j = undefined;
        const avg = sum / k, nb = Math.max(best, avg);
        T.st('best = Math.max(best, (double) sum / k)', 'avg = ' + avg + ' → best = ' + nb, { hl: rng(i, i + k - 1, nb > best ? 'found' : 'win') }); best = nb;
      }
      i = undefined; sum = undefined;
      return T.end('return best', 'return ' + best, finalRet(643, { nums, k }));
    },
  }]);

  // =====================================================================
  // LC 1456 — Max Vowels in Substring of Given Length
  // =====================================================================
  def(1456, {
    title: 'Max Vowels (Optimal: fixed window + count)', label: 'Fixed window', ap: 1,
    run({ s, k }) {
      const a = s.split(''); let count, i, best;
      const T = tracer(1456, 1, o => ({ views: [A('s', a, o.hl, P(a.length, { i, label: 'i' }, { i: o.out, label: 'i−k' }))], vars: Object.assign({ s: '"' + s + '"', k }, count !== undefined ? { count } : {}, i !== undefined ? { i } : {}, best !== undefined ? { best } : {}) }));
      const V = (idx, why, hl) => { const v = isV(a[idx]); T.st('return c == ', 'isVowel(' + q(a[idx]) + ') → ' + v + ' (' + why + ')', { hl, frames: [{ method: 'isVowel', args: 'c=' + q(a[idx]), vars: { c: q(a[idx]) } }, { method: 'maxVowels', args: 's, k', vars: { s: '"' + s + '"', k, count, i } }] }); return v; };
      T.st('public int maxVowels', 'Method call — s = "' + s + '", k = ' + k);
      count = 0; T.st('int count = 0', 'count = 0');
      for (i = 0; ; i++) {
        T.st('for (int i = 0; i < k; i++)', 'i = ' + i + ' < ' + k + ' ? ' + (i < k ? 'haan' : 'nahi → pehli window ready'), { hl: rng(0, Math.min(i, k) - 1, 'win', i < k ? { [i]: 'cur' } : {}) });
        if (i >= k) break;
        const v = V(i, 'pehli window', rng(0, i, 'win', { [i]: 'cur' }));
        if (v) { count++; T.st('if (isVowel(s.charAt(i))) count++', q(a[i]) + ' vowel → count = ' + count, { k: 1, hl: rng(0, i, 'win', { [i]: 'found' }) }); }
        else T.st('if (isVowel(s.charAt(i))) count++', q(a[i]) + ' vowel nahi', { k: 1, hl: rng(0, i, 'win', { [i]: 'skip' }) });
      }
      best = count; T.st('int best = count', 'best = ' + best, { hl: rng(0, k - 1, 'found') });
      for (i = k; ; i++) {
        T.st('for (int i = k; i < s.length()', 'i = ' + i + ' < ' + a.length + ' ? ' + (i < a.length ? 'haan → slide' : 'nahi'), { hl: i < a.length ? rng(i - k + 1, i, 'win', { [i - k]: 'skip' }) : {} });
        if (i >= a.length) break;
        const H = x => rng(i - k + 1, i, 'win', Object.assign({ [i - k]: 'skip' }, x));
        if (V(i, 'naya char andar', H({ [i]: 'cur' }))) { count++; T.st('if (isVowel(s.charAt(i))) count++', 'naya ' + q(a[i]) + ' vowel → count = ' + count, { k: 2, hl: H({ [i]: 'found' }), out: i - k }); }
        else T.st('if (isVowel(s.charAt(i))) count++', 'naya ' + q(a[i]) + ' vowel nahi', { k: 2, hl: H({ [i]: 'cur' }), out: i - k });
        if (V(i - k, 'purana char bahar', H({ [i - k]: 'skip' }))) { count--; T.st('if (isVowel(s.charAt(i - k))) count--', 'bahar gaya ' + q(a[i - k]) + ' vowel tha → count = ' + count, { hl: H({}), out: i - k }); }
        else T.st('if (isVowel(s.charAt(i - k))) count--', 'bahar gaya ' + q(a[i - k]) + ' vowel nahi tha', { hl: H({}), out: i - k });
        const nb = Math.max(best, count); T.st('best = Math.max(best, count)', 'best = ' + nb + (nb > best ? ' (naya max!)' : ''), { hl: rng(i - k + 1, i, nb > best ? 'found' : 'win') }); best = nb;
      }
      i = undefined;
      return T.end('return best', 'return ' + best, finalRet(1456, { s, k }));
    },
  }, [{
    label: 'Har window gino', title: 'Max Vowels (Brute: O(n·k))', ap: 0,
    run({ s, k }) {
      const a = s.split(''); let best, i, count, j;
      const T = tracer(1456, 0, o => ({ views: [A('s', a, o.hl, P(a.length, { i, label: 'i' }, { i: j, label: 'j' }))], vars: Object.assign({ s: '"' + s + '"', k }, best !== undefined ? { best } : {}, i !== undefined ? { i } : {}, count !== undefined ? { count } : {}, j !== undefined ? { j } : {}) }));
      T.st('public int maxVowels', 'Method call — s = "' + s + '", k = ' + k);
      best = 0; T.st('int best = 0', 'best = 0');
      for (i = 0; ; i++) {
        count = undefined; j = undefined;
        T.st('for (int i = 0; i + k <= s.length()', 'i = ' + i + (i + k <= a.length ? '' : ' → window bahar, loop khatam'), { hl: i + k <= a.length ? rng(i, i + k - 1, 'win') : {} });
        if (i + k > a.length) break;
        count = 0; T.st('int count = 0', 'count = 0 (har window dobara gino)', { hl: rng(i, i + k - 1, 'win') });
        for (j = i; ; j++) {
          T.st('for (int j = i; j < i + k; j++)', 'j = ' + j + (j < i + k ? '' : ' → window gin li'), { hl: rng(i, i + k - 1, 'win', j < i + k ? { [j]: 'cur' } : {}) });
          if (j >= i + k) break;
          if (isV(a[j])) { count++; T.st('if ("aeiou".indexOf', q(a[j]) + ' vowel → count = ' + count, { hl: rng(i, i + k - 1, 'win', { [j]: 'found' }) }); }
          else T.st('if ("aeiou".indexOf', q(a[j]) + ' vowel nahi', { hl: rng(i, i + k - 1, 'win', { [j]: 'skip' }) });
        }
        j = undefined;
        const nb = Math.max(best, count); T.st('best = Math.max(best, count)', 'best = ' + nb, { hl: rng(i, i + k - 1, nb > best ? 'found' : 'win') }); best = nb;
      }
      i = undefined; count = undefined;
      return T.end('return best', 'return ' + best, finalRet(1456, { s, k }));
    },
  }]);

  // =====================================================================
  // LC 3 — Longest Substring Without Repeating Characters
  // =====================================================================
  def(3, {
    title: 'Longest Substring Without Repeating (Optimal: HashMap last index)', label: 'HashMap (jump left)', ap: 2,
    run({ s }) {
      const a = s.split(''); let last = null, left, best, right, c;
      const T = tracer(3, 2, o => ({ views: [A('s', a, o.hl, P(a.length, { i: left, label: 'left' }, { i: right, label: 'right' })), ...(last ? [M('HashMap last (char → index)', last, o.mk)] : [])], vars: Object.assign({ s: '"' + s + '"' }, last ? { last: 'HashMap size=' + Object.keys(last).length } : {}, left !== undefined ? { left, best } : {}, right !== undefined ? { right } : {}, c !== undefined ? { c: q(c) } : {}) }));
      const W = x => (left !== undefined && right !== undefined && right < a.length ? rng(left, right, 'win', x) : x || {});
      T.st('public int lengthOfLongestSubstring', 'Method call — s = "' + s + '"');
      last = {}; T.st('Map<Character, Integer> last', 'Khaali map (char → last index)');
      left = 0; best = 0; T.st('int left = 0, best = 0', 'left = 0, best = 0');
      for (right = 0; ; right++) {
        c = undefined;
        T.st('for (int right = 0', 'right = ' + right + (right < a.length ? '' : ' → string khatam'), { hl: W({}) });
        if (right >= a.length) break;
        c = a[right]; T.st('char c = s.charAt(right)', 'c = ' + q(c), { hl: W({ [right]: 'cur' }), mk: q(c) });
        const has = Object.prototype.hasOwnProperty.call(last, c) && last[c] >= left;
        T.st('if (last.containsKey(c) && last.get(c) >= left)', has ? q(c) + ' window me index ' + last[c] + ' pe hai → repeat!' : (Object.prototype.hasOwnProperty.call(last, c) ? q(c) + ' pehle ' + last[c] + ' pe tha, par window (left = ' + left + ') ke bahar' : q(c) + ' naya'), { hl: W(has ? { [last[c]]: 'skip', [right]: 'cur' } : { [right]: 'cur' }), mk: q(c) });
        if (has) { left = last[c] + 1; T.st('left = last.get(c) + 1', 'left seedha jump → ' + left + ' (shrink, kabhi peeche nahi)', { hl: W({ [right]: 'cur' }), mk: q(c) }); }
        last[c] = right; T.st('last.put(c, right)', 'last[' + q(c) + '] = ' + right, { hl: W({ [right]: 'cur' }), mk: q(c) });
        const len = right - left + 1, nb = Math.max(best, len);
        T.st('best = Math.max(best, right - left + 1)', 'window [' + left + '..' + right + '] len = ' + len + ' → best = ' + nb, { hl: rng(left, right, nb > best ? 'found' : 'win') }); best = nb;
      }
      right = undefined;
      return T.end('return best', 'return ' + best, finalRet(3, { s }));
    },
  }, [{
    label: 'Har start se', title: 'Longest Substring Without Repeating (Brute: O(n²))', ap: 0,
    run({ s }) {
      const a = s.split(''); let n, best, i, seen = null, j;
      const T = tracer(3, 0, o => ({ views: [A('s', a, o.hl, P(a.length, { i, label: 'i' }, { i: j, label: 'j' })), ...(seen ? [S('HashSet seen', seen, o.sk)] : [])], vars: Object.assign({ s: '"' + s + '"' }, n !== undefined ? { n, best } : {}, i !== undefined ? { i } : {}, seen ? { seen: 'HashSet [' + [...seen].join(', ') + ']' } : {}, j !== undefined ? { j } : {}) }));
      T.st('public int lengthOfLongestSubstring', 'Method call — s = "' + s + '"');
      n = a.length; best = 0; T.st('int n = s.length(), best = 0', 'n = ' + n + ', best = 0');
      for (i = 0; ; i++) {
        seen = null; j = undefined;
        T.st('for (int i = 0', 'i = ' + i + (i < n ? '' : ' → khatam'), { hl: i < n ? { [i]: 'cur' } : {} });
        if (i >= n) break;
        seen = new Set(); T.st('Set<Character> seen = new HashSet<>()', 'naya seen (is start ke liye)', { hl: { [i]: 'cur' } });
        for (j = i; ; j++) {
          T.st('for (int j = i; j < n; j++)', 'j = ' + j + (j < n ? '' : ' → string khatam'), { hl: j < n ? rng(i, j, 'win', { [j]: 'cur' }) : rng(i, n - 1, 'win') });
          if (j >= n) break;
          if (seen.has(a[j])) { T.st('if (!seen.add(s.charAt(j))) break', q(a[j]) + ' pehle se → repeat → break', { hl: rng(i, j - 1, 'win', { [j]: 'skip' }), sk: a[j] }); break; }
          seen.add(a[j]); T.st('if (!seen.add(s.charAt(j))) break', q(a[j]) + ' add hua', { hl: rng(i, j, 'win'), sk: a[j] });
          const nb = Math.max(best, j - i + 1); T.st('best = Math.max(best, j - i + 1)', 'len = ' + (j - i + 1) + ' → best = ' + nb, { hl: rng(i, j, nb > best ? 'found' : 'win') }); best = nb;
        }
      }
      i = undefined; seen = null;
      return T.end('return best', 'return ' + best + ' (O(n²))', finalRet(3, { s }));
    },
  }, {
    label: 'HashSet window', title: 'Longest Substring Without Repeating (Better: HashSet expand–shrink)', ap: 1,
    run({ s }) {
      const a = s.split(''); let win = null, left, best, right, c;
      const T = tracer(3, 1, o => ({ views: [A('s', a, o.hl, P(a.length, { i: left, label: 'left' }, { i: right, label: 'right' })), ...(win ? [S('HashSet window', win, o.sk)] : [])], vars: Object.assign({ s: '"' + s + '"' }, win ? { window: 'HashSet [' + [...win].join(', ') + ']' } : {}, left !== undefined ? { left, best } : {}, right !== undefined ? { right } : {}, c !== undefined ? { c: q(c) } : {}) }));
      const W = x => (right !== undefined && right < a.length && left <= right ? rng(left, right, 'win', x) : x || {});
      T.st('public int lengthOfLongestSubstring', 'Method call — s = "' + s + '"');
      win = new Set(); T.st('Set<Character> window = new HashSet<>()', 'Khaali window');
      left = 0; best = 0; T.st('int left = 0, best = 0', 'left = 0, best = 0');
      for (right = 0; ; right++) {
        c = undefined;
        T.st('for (int right = 0', 'right = ' + right + (right < a.length ? ' → expand' : ' → khatam'), { hl: W({}) });
        if (right >= a.length) break;
        c = a[right]; T.st('char c = s.charAt(right)', 'c = ' + q(c), { hl: W({ [right]: 'cur' }), sk: c });
        while (true) {
          const has = win.has(c);
          T.st('while (window.contains(c))', has ? q(c) + ' window me hai → shrink' : q(c) + ' window me nahi → aage', { hl: W({ [right]: has ? 'skip' : 'cur' }), sk: c });
          if (!has) break;
          const d = a[left]; win.delete(d); T.st('window.remove(s.charAt(left))', 'remove ' + q(d), { hl: W({ [left]: 'skip', [right]: 'cur' }), sk: d });
          left++; T.st('left++;', 'left → ' + left, { hl: W({ [right]: 'cur' }) });
        }
        win.add(c); T.st('window.add(c)', 'add ' + q(c), { hl: W({ [right]: 'new' }), sk: c });
        const nb = Math.max(best, right - left + 1); T.st('best = Math.max(best, right - left + 1)', 'len = ' + (right - left + 1) + ' → best = ' + nb, { hl: rng(left, right, nb > best ? 'found' : 'win') }); best = nb;
      }
      right = undefined;
      return T.end('return best', 'return ' + best, finalRet(3, { s }));
    },
  }]);

  // =====================================================================
  // LC 209 — Minimum Size Subarray Sum
  // =====================================================================
  def(209, {
    title: 'Minimum Size Subarray Sum (Optimal: expand–shrink)', label: 'Variable window', ap: 2,
    run({ target, nums }) {
      let left, sum, best, right;
      const T = tracer(209, 2, o => ({ views: [A('nums', nums, o.hl, P(nums.length, { i: left, label: 'left' }, { i: right, label: 'right' }))], vars: Object.assign({ target, nums: iA(nums) }, left !== undefined ? { left, sum, best: showMax(best) } : {}, right !== undefined ? { right } : {}) }));
      const W = x => (right !== undefined && right < nums.length && left <= right ? rng(left, right, 'win', x) : x || {});
      T.st('public int minSubArrayLen', 'Method call — target = ' + target + ', nums = ' + fmt(nums));
      left = 0; sum = 0; best = Infinity; T.st('int left = 0, sum = 0, best = Integer.MAX_VALUE', 'left = 0, sum = 0, best = MAX');
      for (right = 0; ; right++) {
        T.st('for (int right = 0', 'right = ' + right + (right < nums.length ? ' → expand' : ' → khatam'), { hl: W({}) });
        if (right >= nums.length) break;
        sum += nums[right]; T.st('sum += nums[right]', '+ ' + nums[right] + ' → sum = ' + sum, { hl: W({ [right]: 'new' }) });
        while (true) {
          const ok = sum >= target;
          T.st('while (sum >= target)', sum + ' ≥ ' + target + ' ? ' + (ok ? 'haan → valid, shrink karke chhota karo' : 'nahi → aur expand'), { hl: W({}) });
          if (!ok) break;
          const nb = Math.min(best, right - left + 1); T.st('best = Math.min(best, right - left + 1)', 'len = ' + (right - left + 1) + ' → best = ' + nb, { hl: rng(left, right, 'found') }); best = nb;
          sum -= nums[left]; T.st('sum -= nums[left]', '− ' + nums[left] + ' → sum = ' + sum, { hl: W({ [left]: 'skip' }) });
          left++; T.st('left++;', 'left → ' + left, { hl: W({}) });
        }
      }
      right = undefined;
      return T.end('return best == Integer.MAX_VALUE ? 0 : best', 'return ' + (best === Infinity ? 0 : best), finalRet(209, { target, nums }));
    },
  }, [{
    label: 'Har start se', title: 'Minimum Size Subarray Sum (Brute: O(n²))', ap: 0,
    run({ target, nums }) {
      let n, best, i, sum, j;
      const T = tracer(209, 0, o => ({ views: [A('nums', nums, o.hl, P(nums.length, { i, label: 'i' }, { i: j, label: 'j' }))], vars: Object.assign({ target, nums: iA(nums) }, n !== undefined ? { n, best: showMax(best) } : {}, i !== undefined ? { i } : {}, sum !== undefined ? { sum } : {}, j !== undefined ? { j } : {}) }));
      T.st('public int minSubArrayLen', 'Method call — target = ' + target + ', nums = ' + fmt(nums));
      n = nums.length; best = Infinity; T.st('int n = nums.length, best = Integer.MAX_VALUE', 'n = ' + n + ', best = MAX');
      for (i = 0; ; i++) {
        sum = undefined; j = undefined;
        T.st('for (int i = 0', 'i = ' + i + (i < n ? '' : ' → khatam'), { hl: i < n ? { [i]: 'cur' } : {} });
        if (i >= n) break;
        sum = 0; T.st('int sum = 0', 'sum = 0', { hl: { [i]: 'cur' } });
        for (j = i; ; j++) {
          T.st('for (int j = i; j < n; j++)', 'j = ' + j + (j < n ? '' : ' → khatam'), { hl: j < n ? rng(i, j, 'win') : {} });
          if (j >= n) break;
          sum += nums[j]; T.st('sum += nums[j]', 'sum = ' + sum, { hl: rng(i, j, 'win', { [j]: 'new' }) });
          if (sum >= target) {
            T.st('if (sum >= target)', sum + ' ≥ ' + target + ' → valid', { hl: rng(i, j, 'found') });
            best = Math.min(best, j - i + 1); T.st('best = Math.min(best, j - i + 1)', 'best = ' + best, { hl: rng(i, j, 'found') });
            T.st('break;', 'is i ke liye sabse chhota mil gaya → break', { hl: rng(i, j, 'found') });
            break;
          }
          T.st('if (sum >= target)', sum + ' < ' + target, { hl: rng(i, j, 'win') });
        }
      }
      i = undefined; sum = undefined; j = undefined;
      return T.end('return best == Integer.MAX_VALUE ? 0 : best', 'return ' + (best === Infinity ? 0 : best), finalRet(209, { target, nums }));
    },
  }, {
    label: 'Prefix + binary search', title: 'Minimum Size Subarray Sum (Better: prefix sum + binary search)', ap: 1,
    run({ target, nums }) {
      let n, best, pre = null, i, need, lo, hi, mid;
      const T = tracer(209, 1, o => ({ views: [A('nums', nums, o.hl, P(nums.length, { i, label: 'i' })), ...(pre ? [A('pre', pre, o.ph, P(pre.length, { i: lo, label: 'lo' }, { i: mid, label: 'mid' }, { i: hi, label: 'hi' }))] : [])], vars: Object.assign({ target, nums: iA(nums) }, n !== undefined ? { n, best: showMax(best) } : {}, pre ? { pre: 'long[' + pre.length + '] [' + pre.join(', ') + ']' } : {}, i !== undefined ? { i } : {}, need !== undefined ? { need } : {}, lo !== undefined ? { lo, hi } : {}, mid !== undefined ? { mid } : {}) }));
      T.st('public int minSubArrayLen', 'Method call — target = ' + target + ', nums = ' + fmt(nums));
      n = nums.length; best = Infinity; T.st('int n = nums.length, best = Integer.MAX_VALUE', 'n = ' + n + ', best = MAX');
      pre = new Array(n + 1).fill(0); T.st('long[] pre = new long[n + 1]', 'pre[i] = pehle i elements ka sum (O(n) space)');
      for (i = 0; i < n; i++) { pre[i + 1] = pre[i] + nums[i]; T.st('for (int i = 0; i < n; i++) pre[i + 1]', 'pre[' + (i + 1) + '] = ' + pre[i + 1], { hl: { [i]: 'cur' }, ph: { [i + 1]: 'new' } }); }
      for (i = 0; ; i++) {
        need = undefined; lo = undefined; mid = undefined;
        T.st('for (int i = 0; i < n; i++) {', 'i = ' + i + (i < n ? ' (start)' : ' → khatam'), { hl: i < n ? { [i]: 'cur' } : {} });
        if (i >= n) break;
        need = pre[i] + target; T.st('long need = pre[i] + target', 'need = ' + pre[i] + ' + ' + target + ' = ' + need + ' (pre[j] ≥ need wala pehla j dhoondo)', { hl: { [i]: 'cur' }, ph: { [i]: 'cur' } });
        lo = i + 1; hi = n + 1; T.st('int lo = i + 1, hi = n + 1', 'range [' + lo + ', ' + hi + ')', { hl: { [i]: 'cur' } });
        while (true) {
          const go = lo < hi; mid = undefined;
          T.st('while (lo < hi)', 'lo = ' + lo + ' < hi = ' + hi + ' ? ' + (go ? 'haan' : 'nahi → lo = ' + lo), { hl: { [i]: 'cur' } });
          if (!go) break;
          mid = Math.floor((lo + hi) / 2); T.st('int mid = (lo + hi) / 2', 'mid = ' + mid + ', pre[mid] = ' + pre[mid], { hl: { [i]: 'cur' }, ph: { [mid]: 'cur' } });
          if (pre[mid] >= need) { hi = mid; T.st('if (pre[mid] >= need) hi = mid', pre[mid] + ' ≥ ' + need + ' → hi = ' + hi, { hl: { [i]: 'cur' }, ph: { [mid]: 'found' } }); }
          else { T.st('if (pre[mid] >= need) hi = mid', pre[mid] + ' < ' + need + ' → else', { hl: { [i]: 'cur' }, ph: { [mid]: 'skip' } }); lo = mid + 1; T.st('else lo = mid + 1', 'lo = ' + lo, { hl: { [i]: 'cur' } }); }
        }
        mid = undefined;
        if (lo <= n) { best = Math.min(best, lo - i); T.st('if (lo <= n) best = Math.min(best, lo - i)', 'subarray [' + i + '..' + (lo - 1) + '] len ' + (lo - i) + ' → best = ' + best, { hl: rng(i, lo - 1, 'found') }); }
        else T.st('if (lo <= n) best = Math.min(best, lo - i)', 'lo = ' + lo + ' > n → is i se target nahi milta', { hl: { [i]: 'skip' } });
      }
      i = undefined; need = undefined; lo = undefined;
      return T.end('return best == Integer.MAX_VALUE ? 0 : best', 'return ' + (best === Infinity ? 0 : best), finalRet(209, { target, nums }));
    },
  }]);

  // =====================================================================
  // LC 424 — Longest Repeating Character Replacement
  // =====================================================================
  const cnt = c => { const o = {}; Object.keys(c).sort().forEach(x => { if (c[x]) o[q(x)] = c[x]; }); return o; };
  const cA = c => 'int[26] {' + Object.keys(c).sort().filter(x => c[x]).map(x => x + '=' + c[x]).join(', ') + '}';
  def(424, {
    title: 'Longest Repeating Character Replacement (Optimal: window + maxFreq)', label: 'Window + count[26]', ap: 1,
    run({ s, k }) {
      const a = s.split(''); let count = null, left, maxFreq, best, right, c;
      const T = tracer(424, 1, o => ({ views: [A('s', a, o.hl, P(a.length, { i: left, label: 'left' }, { i: right, label: 'right' })), ...(count ? [M('count[] (window me)', cnt(count), o.mk)] : [])], vars: Object.assign({ s: '"' + s + '"', k }, count ? { count: cA(count) } : {}, left !== undefined ? { left, maxFreq, best } : {}, right !== undefined ? { right } : {}, c !== undefined ? { c: q(c) } : {}) }));
      const W = x => (right !== undefined && right < a.length && left <= right ? rng(left, right, 'win', x) : x || {});
      T.st('public int characterReplacement', 'Method call — s = "' + s + '", k = ' + k);
      count = {}; T.st('int[] count = new int[26]', 'count[26] — window me har letter kitni baar');
      left = 0; maxFreq = 0; best = 0; T.st('int left = 0, maxFreq = 0, best = 0', 'left = 0, maxFreq = 0, best = 0');
      for (right = 0; ; right++) {
        c = undefined;
        T.st('for (int right = 0', 'right = ' + right + (right < a.length ? ' → expand' : ' → khatam'), { hl: W({}) });
        if (right >= a.length) break;
        c = a[right]; T.st('int c = s.charAt(right) - \'A\'', 'c = ' + q(c), { hl: W({ [right]: 'cur' }) });
        count[c] = (count[c] || 0) + 1; T.st('count[c]++', 'count[' + q(c) + '] = ' + count[c], { hl: W({ [right]: 'new' }), mk: q(c) });
        maxFreq = Math.max(maxFreq, count[c]); T.st('maxFreq = Math.max(maxFreq, count[c])', 'maxFreq = ' + maxFreq + ' (sabse zyada wala letter rakho, baaki badlo)', { hl: W({}), mk: q(c) });
        while (true) {
          const len = right - left + 1, bad = len - maxFreq > k;
          T.st('while (right - left + 1 - maxFreq > k)', 'badalne padenge = ' + len + ' − ' + maxFreq + ' = ' + (len - maxFreq) + (bad ? ' > ' + k + ' → invalid, shrink' : ' ≤ ' + k + ' → valid'), { hl: W(bad ? { [left]: 'skip' } : {}) });
          if (!bad) break;
          const d = a[left]; count[d]--; T.st('count[s.charAt(left) - \'A\']--', 'count[' + q(d) + '] = ' + count[d], { hl: W({ [left]: 'skip' }), mk: q(d) });
          left++; T.st('left++;', 'left → ' + left, { hl: W({}) });
        }
        const nb = Math.max(best, right - left + 1); T.st('best = Math.max(best, right - left + 1)', 'len = ' + (right - left + 1) + ' → best = ' + nb, { hl: rng(left, right, nb > best ? 'found' : 'win') }); best = nb;
      }
      right = undefined;
      return T.end('return best', 'return ' + best, finalRet(424, { s, k }));
    },
  }, [{
    label: 'Har start se', title: 'Longest Repeating Character Replacement (Brute: O(n²))', ap: 0,
    run({ s, k }) {
      const a = s.split(''); let n, best, i, count = null, maxFreq, j;
      const T = tracer(424, 0, o => ({ views: [A('s', a, o.hl, P(a.length, { i, label: 'i' }, { i: j, label: 'j' })), ...(count ? [M('count[]', cnt(count), o.mk)] : [])], vars: Object.assign({ s: '"' + s + '"', k }, n !== undefined ? { n, best } : {}, i !== undefined ? { i } : {}, count ? { count: cA(count) } : {}, maxFreq !== undefined ? { maxFreq } : {}, j !== undefined ? { j } : {}) }));
      T.st('public int characterReplacement', 'Method call — s = "' + s + '", k = ' + k);
      n = a.length; best = 0; T.st('int n = s.length(), best = 0', 'n = ' + n + ', best = 0');
      for (i = 0; ; i++) {
        count = null; maxFreq = undefined; j = undefined;
        T.st('for (int i = 0', 'i = ' + i + (i < n ? '' : ' → khatam'), { hl: i < n ? { [i]: 'cur' } : {} });
        if (i >= n) break;
        count = {}; T.st('int[] count = new int[26]', 'naya count (is start ke liye)', { hl: { [i]: 'cur' } });
        maxFreq = 0; T.st('int maxFreq = 0', 'maxFreq = 0', { hl: { [i]: 'cur' } });
        for (j = i; ; j++) {
          T.st('for (int j = i; j < n; j++)', 'j = ' + j + (j < n ? '' : ' → khatam'), { hl: j < n ? rng(i, j, 'win') : {} });
          if (j >= n) break;
          count[a[j]] = (count[a[j]] || 0) + 1; maxFreq = Math.max(maxFreq, count[a[j]]);
          T.st('maxFreq = Math.max(maxFreq, ++count', 'count[' + q(a[j]) + '] = ' + count[a[j]] + ', maxFreq = ' + maxFreq, { hl: rng(i, j, 'win', { [j]: 'new' }), mk: q(a[j]) });
          const len = j - i + 1, ok = len - maxFreq <= k, nb = ok ? Math.max(best, len) : best;
          T.st('if (j - i + 1 - maxFreq <= k) best', len + ' − ' + maxFreq + ' = ' + (len - maxFreq) + (ok ? ' ≤ ' + k + ' → valid, best = ' + nb : ' > ' + k + ' → invalid'), { hl: rng(i, j, ok ? 'found' : 'skip') }); best = nb;
        }
      }
      i = undefined; count = null; maxFreq = undefined;
      return T.end('return best', 'return ' + best + ' (O(n²))', finalRet(424, { s, k }));
    },
  }]);

  // =====================================================================
  // LC 76 — Minimum Window Substring
  // =====================================================================
  const res76 = (bl, bs, s) => (bl === Infinity ? '""' : '"' + s.substr(bs, bl) + '"');
  def(76, {
    title: 'Minimum Window Substring (Optimal: need[128] + missing)', label: 'need[] + missing', ap: 2,
    run({ s, t }) {
      const a = s.split(''); let need = null, left, missing, bestLen, bestStart, right, c, d;
      const tset = new Set(t.split(''));
      const nv = () => { const o = {}; Object.keys(need).sort().forEach(x => { if (need[x] !== 0 || tset.has(x)) o[q(x)] = need[x]; }); return o; };
      const T = tracer(76, 2, o => ({ views: [A('s', a, o.hl, P(a.length, { i: left, label: 'left' }, { i: right, label: 'right' })), ...(need ? [M('need[] (+ = abhi chahiye, − = extra)', nv(), o.mk)] : [])], vars: Object.assign({ s: '"' + s + '"', t: '"' + t + '"' }, need ? { need: 'int[128] {' + Object.entries(nv()).map(([x, v]) => x + '=' + v).join(', ') + '}' } : {}, left !== undefined ? { left, missing } : {}, bestLen !== undefined ? { bestLen: showMax(bestLen), bestStart } : {}, right !== undefined ? { right } : {}, c !== undefined ? { c: q(c) } : {}, d !== undefined ? { d: q(d) } : {}) }));
      const W = x => (right !== undefined && right < a.length && left <= right ? rng(left, right, 'win', x) : x || {});
      T.st('public String minWindow', 'Method call — s = "' + s + '", t = "' + t + '"');
      need = {}; T.st('int[] need = new int[128]', 'need[128] = 0');
      t.split('').forEach(x => { need[x] = (need[x] || 0) + 1; T.st('for (char c : t.toCharArray()) need[c]++', 'need[' + q(x) + '] = ' + need[x], { mk: q(x) }); });
      left = 0; missing = t.length; T.st('int left = 0, missing = t.length()', 'missing = ' + missing + ' (itne chars abhi chahiye)');
      bestLen = Infinity; bestStart = 0; T.st('int bestLen = Integer.MAX_VALUE, bestStart = 0', 'bestLen = MAX');
      for (right = 0; ; right++) {
        c = undefined; d = undefined;
        T.st('for (int right = 0', 'right = ' + right + (right < a.length ? ' → expand' : ' → khatam'), { hl: W({}) });
        if (right >= a.length) break;
        c = a[right]; T.st('char c = s.charAt(right)', 'c = ' + q(c), { hl: W({ [right]: 'cur' }), mk: q(c) });
        if ((need[c] || 0) > 0) { missing--; T.st('if (need[c] > 0) missing--', 'need[' + q(c) + '] > 0 → zaroori char → missing = ' + missing, { hl: W({ [right]: 'found' }), mk: q(c) }); }
        else T.st('if (need[c] > 0) missing--', q(c) + ' zaroori nahi / extra', { hl: W({ [right]: 'cur' }), mk: q(c) });
        need[c] = (need[c] || 0) - 1; T.st('need[c]--;', 'need[' + q(c) + '] = ' + need[c], { hl: W({ [right]: 'cur' }), mk: q(c) });
        while (true) {
          const ok = missing === 0;
          T.st('while (missing == 0)', ok ? 'missing = 0 → window valid! ab shrink karke chhota karo' : 'missing = ' + missing + ' → aur expand', { hl: W(ok ? {} : {}) });
          if (!ok) break;
          const len = right - left + 1;
          if (len < bestLen) {
            T.st('if (right - left + 1 < bestLen)', 'len ' + len + ' < ' + showMax(bestLen) + ' → naya best', { hl: rng(left, right, 'found') });
            bestLen = len; T.st('bestLen = right - left + 1', 'bestLen = ' + bestLen, { hl: rng(left, right, 'found') });
            bestStart = left; T.st('bestStart = left', 'bestStart = ' + left + ' → "' + s.substr(left, len) + '"', { hl: rng(left, right, 'found') });
          } else T.st('if (right - left + 1 < bestLen)', 'len ' + len + ' ≥ ' + bestLen + ' → best nahi badla', { hl: W({}) });
          d = a[left]; T.st('char d = s.charAt(left)', 'd = ' + q(d) + ' (bahar jaayega)', { hl: W({ [left]: 'skip' }), mk: q(d) });
          need[d]++; T.st('need[d]++;', 'need[' + q(d) + '] = ' + need[d], { hl: W({ [left]: 'skip' }), mk: q(d) });
          if (need[d] > 0) { missing++; T.st('if (need[d] > 0) missing++', 'zaroori char gaya → missing = ' + missing + ' (window invalid)', { hl: W({ [left]: 'skip' }), mk: q(d) }); }
          else T.st('if (need[d] > 0) missing++', q(d) + ' extra tha → window abhi bhi valid', { hl: W({ [left]: 'skip' }), mk: q(d) });
          left++; T.st('left++;', 'left → ' + left, { hl: W({}) });
          d = undefined;
        }
      }
      right = undefined; c = undefined;
      return T.end('return bestLen == Integer.MAX_VALUE', 'return ' + res76(bestLen, bestStart, s), finalRet(76, { s, t }));
    },
  }, [{
    label: 'Har start se + covers()', title: 'Minimum Window Substring (Brute: O(n² · 128))', ap: 0,
    run({ s, t }) {
      const a = s.split(''); let need = null, bestLen, bestStart, i, have = null, j;
      const obj = m => { const o = {}; Object.keys(m).sort().forEach(x => { if (m[x]) o[q(x)] = m[x]; }); return o; };
      const T = tracer(76, 0, o => ({ views: [A('s', a, o.hl, P(a.length, { i, label: 'i' }, { i: j, label: 'j' })), ...(need ? [M('need[]', obj(need))] : []), ...(have ? [M('have[]', obj(have), o.mk)] : [])], vars: Object.assign({ s: '"' + s + '"', t: '"' + t + '"' }, need ? { need: 'int[128] ' + JSON.stringify(obj(need)) } : {}, bestLen !== undefined ? { bestLen: showMax(bestLen), bestStart } : {}, i !== undefined ? { i } : {}, have ? { have: 'int[128] ' + JSON.stringify(obj(have)) } : {}, j !== undefined ? { j } : {}) }));
      T.st('public String minWindow', 'Method call — s = "' + s + '", t = "' + t + '"');
      need = {}; T.st('int[] need = new int[128]', 'need[128] = 0');
      t.split('').forEach(x => { need[x] = (need[x] || 0) + 1; T.st('for (char c : t.toCharArray()) need[c]++', 'need[' + q(x) + '] = ' + need[x]); });
      bestLen = Infinity; bestStart = 0; T.st('int bestLen = Integer.MAX_VALUE, bestStart = 0', 'bestLen = MAX');
      const covers = () => {
        const fr = [{ method: 'covers', args: 'have, need', vars: { have: 'int[128]', need: 'int[128]' } }, { method: 'minWindow', args: 's, t', vars: { i, j } }];
        T.st('for (int c = 0; c < 128; c++)', 'covers(): har char c (0..127) pe have[c] ≥ need[c]?', { hl: rng(i, j, 'win'), frames: fr });
        const miss = Object.keys(need).sort().find(x => (have[x] || 0) < need[x]);
        if (miss !== undefined) { T.st('if (have[c] < need[c]) return false', q(miss) + ': have ' + (have[miss] || 0) + ' < need ' + need[miss] + ' → false', { hl: rng(i, j, 'win'), frames: fr }); return false; }
        T.st('return true;', 't ke saare chars mil gaye → true', { hl: rng(i, j, 'found'), frames: fr }); return true;
      };
      for (i = 0; ; i++) {
        have = null; j = undefined;
        T.st('for (int i = 0; i < s.length()', 'i = ' + i + (i < a.length ? '' : ' → khatam'), { hl: i < a.length ? { [i]: 'cur' } : {} });
        if (i >= a.length) break;
        have = {}; T.st('int[] have = new int[128]', 'naya have (is start ke liye)', { hl: { [i]: 'cur' } });
        for (j = i; ; j++) {
          T.st('for (int j = i; j < s.length()', 'j = ' + j + (j < a.length ? '' : ' → khatam'), { hl: j < a.length ? rng(i, j, 'win') : {} });
          if (j >= a.length) break;
          have[a[j]] = (have[a[j]] || 0) + 1; T.st('have[s.charAt(j)]++', 'have[' + q(a[j]) + '] = ' + have[a[j]], { hl: rng(i, j, 'win', { [j]: 'new' }), mk: q(a[j]) });
          T.st('if (covers(have, need))', 'covers() call', { hl: rng(i, j, 'win') });
          if (covers()) {
            const len = j - i + 1;
            if (len < bestLen) {
              T.st('if (j - i + 1 < bestLen)', 'len ' + len + ' < ' + showMax(bestLen) + ' → naya best', { hl: rng(i, j, 'found') });
              bestLen = len; T.st('bestLen = j - i + 1', 'bestLen = ' + bestLen, { hl: rng(i, j, 'found') });
              bestStart = i; T.st('bestStart = i', 'bestStart = ' + i + ' → "' + s.substr(i, len) + '"', { hl: rng(i, j, 'found') });
            } else T.st('if (j - i + 1 < bestLen)', 'len ' + len + ' ≥ ' + bestLen, { hl: rng(i, j, 'win') });
            T.st('break;', 'is i ke liye sabse chhoti window mil gayi → break', { hl: rng(i, j, 'found') });
            break;
          }
        }
      }
      i = undefined; have = null; j = undefined;
      return T.end('return bestLen == Integer.MAX_VALUE', 'return ' + res76(bestLen, bestStart, s) + ' (bahut slow)', finalRet(76, { s, t }));
    },
  }, {
    label: 'HashMap + formed', title: 'Minimum Window Substring (Better: need/window HashMap + formed)', ap: 1,
    run({ s, t }) {
      const a = s.split(''); let need = null, win = null, required, formed, left, bestLen, bestStart, right, c, d;
      const obj = m => { const o = {}; Object.keys(m).sort().forEach(x => { if (m[x]) o[q(x)] = m[x]; }); return o; };
      const T = tracer(76, 1, o => ({ views: [A('s', a, o.hl, P(a.length, { i: left, label: 'left' }, { i: right, label: 'right' })), ...(need ? [M('HashMap need', obj(need))] : []), ...(win ? [M('HashMap window', obj(win), o.mk)] : [])], vars: Object.assign({ s: '"' + s + '"', t: '"' + t + '"' }, need ? { need: 'HashMap ' + JSON.stringify(obj(need)) } : {}, win ? { window: 'HashMap ' + JSON.stringify(obj(win)) } : {}, required !== undefined ? { required, formed, left } : {}, bestLen !== undefined ? { bestLen: showMax(bestLen), bestStart } : {}, right !== undefined ? { right } : {}, c !== undefined ? { c: q(c) } : {}, d !== undefined ? { d: q(d) } : {}) }));
      const W = x => (right !== undefined && right < a.length && left <= right ? rng(left, right, 'win', x) : x || {});
      T.st('public String minWindow', 'Method call — s = "' + s + '", t = "' + t + '"');
      need = {}; T.st('Map<Character, Integer> need = new HashMap<>()', 'Khaali need map');
      t.split('').forEach(x => { need[x] = (need[x] || 0) + 1; T.st('for (char c : t.toCharArray()) need.put', 'need[' + q(x) + '] = ' + need[x]); });
      win = {}; T.st('Map<Character, Integer> window = new HashMap<>()', 'Khaali window map');
      required = Object.keys(need).length; formed = 0; left = 0; T.st('int required = need.size(), formed = 0, left = 0', 'required = ' + required + ' (alag chars), formed = 0');
      bestLen = Infinity; bestStart = 0; T.st('int bestLen = Integer.MAX_VALUE, bestStart = 0', 'bestLen = MAX');
      for (right = 0; ; right++) {
        c = undefined; d = undefined;
        T.st('for (int right = 0', 'right = ' + right + (right < a.length ? ' → expand' : ' → khatam'), { hl: W({}) });
        if (right >= a.length) break;
        c = a[right]; T.st('char c = s.charAt(right)', 'c = ' + q(c), { hl: W({ [right]: 'cur' }) });
        win[c] = (win[c] || 0) + 1; T.st('window.put(c, window.getOrDefault(c, 0) + 1)', 'window[' + q(c) + '] = ' + win[c], { hl: W({ [right]: 'new' }), mk: q(c) });
        if (need[c] && win[c] === need[c]) { formed++; T.st('if (need.containsKey(c) && window.get(c).intValue()', q(c) + ' ki zaroorat poori → formed = ' + formed + '/' + required, { hl: W({ [right]: 'found' }), mk: q(c) }); }
        else T.st('if (need.containsKey(c) && window.get(c).intValue()', need[c] ? q(c) + ' count ' + win[c] + ' ≠ need ' + need[c] : q(c) + ' t me nahi', { hl: W({ [right]: 'cur' }), mk: q(c) });
        while (true) {
          const ok = formed === required;
          T.st('while (formed == required)', ok ? 'sab chars poore → valid, shrink' : 'formed ' + formed + '/' + required + ' → expand', { hl: W({}) });
          if (!ok) break;
          const len = right - left + 1;
          if (len < bestLen) {
            T.st('if (right - left + 1 < bestLen)', 'len ' + len + ' → naya best', { hl: rng(left, right, 'found') });
            bestLen = len; T.st('bestLen = right - left + 1', 'bestLen = ' + bestLen, { hl: rng(left, right, 'found') });
            bestStart = left; T.st('bestStart = left', 'bestStart = ' + left + ' → "' + s.substr(left, len) + '"', { hl: rng(left, right, 'found') });
          } else T.st('if (right - left + 1 < bestLen)', 'len ' + len + ' ≥ ' + bestLen, { hl: W({}) });
          d = a[left]; T.st('char d = s.charAt(left)', 'd = ' + q(d), { hl: W({ [left]: 'skip' }) });
          win[d]--; T.st('window.put(d, window.get(d) - 1)', 'window[' + q(d) + '] = ' + win[d], { hl: W({ [left]: 'skip' }), mk: q(d) });
          if (need[d] && win[d] < need[d]) { formed--; T.st('if (need.containsKey(d) && window.get(d) < need.get(d)) formed--', 'zaroori ' + q(d) + ' kam pada → formed = ' + formed, { hl: W({ [left]: 'skip' }), mk: q(d) }); }
          else T.st('if (need.containsKey(d) && window.get(d) < need.get(d)) formed--', q(d) + ' hatane se farak nahi', { hl: W({ [left]: 'skip' }) });
          left++; T.st('left++;', 'left → ' + left, { hl: W({}) });
          d = undefined;
        }
      }
      right = undefined; c = undefined;
      return T.end('return bestLen == Integer.MAX_VALUE', 'return ' + res76(bestLen, bestStart, s), finalRet(76, { s, t }));
    },
  }]);

  // =====================================================================
  // LC 1004 — Max Consecutive Ones III (syllabus me nahi, course me hai) — Brute tab jodo, base wahi
  // =====================================================================
  if (VIZ.defs[1004]) {
    const base1004 = VIZ.defs[1004].run;
    const ret1004 = inp => { const st = base1004(JSON.parse(JSON.stringify(inp))); return st[st.length - 1].ret; };
    VIZ.defs[1004].variants = (VIZ.defs[1004].variants || []).filter(v => v.ap !== 0).concat([{
      label: 'Har start se', title: 'Max Consecutive Ones III (Brute: O(n²))', ap: 0,
      run({ nums, k }) {
        let n, best, i, zeros, j;
        const ln = L(1004, 0), rec = recorder(() => ({}));
        const st = (snip, note, hl) => { if (rec.steps.length < MAX_STEPS - 1) rec.s(ln(snip), note, { views: [A('nums', nums, hl, P(nums.length, { i, label: 'i' }, { i: j, label: 'j' }))], vars: Object.assign({ nums: iA(nums), k }, n !== undefined ? { n, best } : {}, i !== undefined ? { i } : {}, zeros !== undefined ? { zeros } : {}, j !== undefined ? { j } : {}) }); };
        st('public int longestOnes', 'Method call — nums = ' + fmt(nums) + ', k = ' + k, {});
        n = nums.length; best = 0; st('int n = nums.length, best = 0', 'n = ' + n + ', best = 0', {});
        for (i = 0; ; i++) {
          zeros = undefined; j = undefined;
          st('for (int i = 0', 'i = ' + i + (i < n ? '' : ' → khatam'), i < n ? { [i]: 'cur' } : {});
          if (i >= n) break;
          zeros = 0; st('int zeros = 0', 'zeros = 0', { [i]: 'cur' });
          for (j = i; ; j++) {
            st('for (int j = i; j < n; j++)', 'j = ' + j + (j < n ? '' : ' → khatam'), j < n ? rng(i, j, 'win') : {});
            if (j >= n) break;
            if (nums[j] === 0) { zeros++; st('if (nums[j] == 0) zeros++', '0 mila → zeros = ' + zeros, rng(i, j, 'win', { [j]: 'skip' })); }
            else st('if (nums[j] == 0) zeros++', '1 hai', rng(i, j, 'win'));
            if (zeros > k) { st('if (zeros > k) break', zeros + ' > ' + k + ' → break', rng(i, j - 1, 'win', { [j]: 'skip' })); break; }
            st('if (zeros > k) break', zeros + ' ≤ ' + k + ' → valid', rng(i, j, 'win'));
            const nb = Math.max(best, j - i + 1); st('best = Math.max(best, j - i + 1)', 'best = ' + nb, rng(i, j, nb > best ? 'found' : 'win')); best = nb;
          }
        }
        i = undefined; zeros = undefined; j = undefined;
        if (rec.steps.length >= MAX_STEPS - 1) rec.steps.length = MAX_STEPS - 2;
        rec.s(ln('return best'), 'return ' + best + ' (O(n²))', { views: [A('nums', nums, {})], vars: { nums: iA(nums), k, n, best }, ret: ret1004({ nums, k }) });
        return rec.steps;
      },
    }]);
  }
})();
