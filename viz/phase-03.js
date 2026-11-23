// Phase 3 — Sliding Window visualizers (v2 views schema).
// Line numbers = questions[n].approaches[ap].code ki lines (line 1 = method signature).
(function () {
  const { recorder, range, fmt } = VIZ.util;
  const D = VIZ.defs;
  const intArr = a => `int[${a.length}] ${fmt(a)}`;
  const jstr = s => `"${s}"`;
  const jdouble = x => (Number.isInteger(x) ? x.toFixed(1) : String(x));
  const MAXI = 2147483647;
  const showMax = v => (v === Infinity ? String(MAXI) : String(v));
  // window highlight: [l..r] = win, extra = {i: cls}
  const winHl = (l, r, extra) => Object.assign(range(l, r, 'win'), extra || {});
  const chars = s => s.split('');

  // ---------------- 643 Maximum Average Subarray I ----------------
  D[643] = {
    title: 'Maximum Average Subarray I (Fixed window)', label: 'Fixed window',
    inputs: [{ key: 'nums', label: 'nums', def: '1, 12, -5, -6, 50, 3' }, { key: 'k', label: 'k', def: '4', type: 'num' }],
    check: ({ nums, k }) => (k >= 1 && k <= nums.length ? '' : '1 ≤ k ≤ nums.length hona chahiye.'),
    run({ nums, k }) {
      const n = nums.length;
      let sum = 0, best = 0, bestL = 0;
      const view = (hl, ptr) => [{ type: 'array', label: 'nums', vals: nums, hl: hl || {}, ptr: ptr || [] }];
      const { steps, s } = recorder(() => ({}));
      const V = extra => Object.assign({ nums: intArr(nums), k: String(k), sum: String(sum) }, extra || {});
      s(2, 'sum = 0 — window ka running sum', { vars: V(), views: view() });
      for (let i = 0; i < k; i++) {
        sum += nums[i];
        s(3, `Pehli window: sum += nums[${i}] (${nums[i]}) → ${sum}`, { vars: V({ i: String(i) }), views: view(winHl(0, i, { [i]: 'new' }), [{ i, label: 'i' }]) });
      }
      best = sum;
      s(4, `best = ${best} (pehli window [0..${k - 1}] ka sum)`, { vars: V({ best: String(best) }), views: view(winHl(0, k - 1)) });
      for (let i = k; i < n; i++) {
        s(5, `i = ${i} → window ab [${i - k + 1}..${i}] banegi`, { vars: V({ best: String(best), i: String(i) }), views: view(winHl(i - k, i - 1, { [i]: 'cur' }), [{ i: i - k, label: 'i - k' }, { i, label: 'i' }]) });
        const old = sum;
        sum += nums[i] - nums[i - k];
        s(6, `sum += nums[${i}] (${nums[i]}) − nums[${i - k}] (${nums[i - k]}) → ${old} → ${sum}`, { vars: V({ best: String(best), i: String(i) }), views: view(winHl(i - k + 1, i, { [i]: 'new', [i - k]: 'skip' }), [{ i: i - k, label: 'i - k (gaya)' }, { i, label: 'i (aaya)' }]) });
        const up = sum > best;
        if (up) { best = sum; bestL = i - k + 1; }
        s(7, up ? `best = max(…, ${sum}) → naya best ${best}` : `best = ${best} (${sum} chhota hai, no change)`, { vars: V({ best: String(best), i: String(i) }), views: view(winHl(i - k + 1, i, up ? range(i - k + 1, i, 'found') : {}), [{ i, label: 'i' }]) });
      }
      const ans = best / k;
      s(9, `return (double) ${best} / ${k} = ${jdouble(ans)}`, { vars: V({ best: String(best) }), views: view(range(bestL, bestL + k - 1, 'found')), ret: jdouble(ans) });
      return steps;
    },
  };

  // ---------------- 1456 Maximum Number of Vowels ----------------
  D[1456] = {
    title: 'Max Vowels in Substring of Length k (Fixed window)', label: 'Fixed window',
    inputs: [{ key: 's', label: 's', def: 'abciiidef', type: 'str' }, { key: 'k', label: 'k', def: '3', type: 'num' }],
    check: ({ s, k }) => (k >= 1 && k <= s.length ? '' : '1 ≤ k ≤ s.length hona chahiye.'),
    run({ s: str, k }) {
      const isV = c => 'aeiou'.includes(c);
      let count = 0, best = 0, bestL = 0;
      const view = (hl, ptr, l, r) => {
        const v = [{ type: 'array', label: 's (chars)', vals: chars(str), hl: hl || {}, ptr: ptr || [] }];
        if (l !== undefined) v.push({ type: 'text', label: 'window', value: `"${str.slice(l, r + 1)}"  (vowels = ${count})` });
        return v;
      };
      const { steps, s } = recorder(() => ({}));
      const V = extra => Object.assign({ s: jstr(str), k: String(k), count: String(count) }, extra || {});
      s(2, 'count = 0 — window me kitne vowels', { vars: V(), views: view() });
      for (let i = 0; i < k; i++) {
        s(3, `Pehli window, i = ${i}`, { vars: V({ i: String(i) }), views: view(winHl(0, i - 1, { [i]: 'cur' }), [{ i, label: 'i' }]) });
        const v = isV(str[i]);
        if (v) count++;
        s(4, v ? `'${str[i]}' vowel hai → count = ${count}` : `'${str[i]}' vowel nahi`, { vars: V({ i: String(i) }), views: view(winHl(0, i, { [i]: v ? 'found' : 'cur' }), [{ i, label: 'i' }], 0, i) });
      }
      best = count;
      s(6, `best = ${best}`, { vars: V({ best: String(best) }), views: view(winHl(0, k - 1), [], 0, k - 1) });
      for (let i = k; i < str.length; i++) {
        const P = [{ i: i - k, label: 'i - k' }, { i, label: 'i' }];
        s(7, `i = ${i} → '${str[i]}' aayega, '${str[i - k]}' jaayega`, { vars: V({ best: String(best), i: String(i) }), views: view(winHl(i - k, i - 1, { [i]: 'cur' }), P, i - k, i - 1) });
        const vin = isV(str[i]);
        if (vin) count++;
        s(8, vin ? `aane wala '${str[i]}' vowel → count++ = ${count}` : `aane wala '${str[i]}' vowel nahi`, { vars: V({ best: String(best), i: String(i) }), views: view(winHl(i - k, i, { [i]: 'new' }), P) });
        const vout = isV(str[i - k]);
        if (vout) count--;
        s(9, vout ? `jaane wala '${str[i - k]}' vowel tha → count-- = ${count}` : `jaane wala '${str[i - k]}' vowel nahi tha`, { vars: V({ best: String(best), i: String(i) }), views: view(winHl(i - k + 1, i, { [i - k]: 'skip' }), P, i - k + 1, i) });
        const up = count > best;
        if (up) { best = count; bestL = i - k + 1; }
        s(10, up ? `best update → ${best}` : `best = ${best}`, { vars: V({ best: String(best), i: String(i) }), views: view(winHl(i - k + 1, i, up ? range(i - k + 1, i, 'found') : {}), [{ i, label: 'i' }], i - k + 1, i) });
      }
      s(12, `return ${best}`, { vars: V({ best: String(best) }), views: view(range(bestL, bestL + k - 1, 'found')), ret: String(best) });
      return steps;
    },
  };

  // ---------------- 3 Longest Substring Without Repeating ----------------
  function run3Map(str) {
    const last = new Map();
    let left = 0, best = 0;
    const lastObj = () => { const o = {}; last.forEach((v, k) => { o[`'${k}'`] = v; }); return o; };
    const lastStr = () => `HashMap size=${last.size} {${[...last].map(([k, v]) => `${k}=${v}`).join(', ')}}`;
    const view = (hl, ptr, hk, r) => {
      const v = [{ type: 'array', label: 's (chars)', vals: chars(str), hl: hl || {}, ptr: ptr || [] },
        { type: 'map', label: 'HashMap last (char → last index)', entries: lastObj(), hl: hk !== undefined ? `'${hk}'` : undefined }];
      if (r !== undefined) v.push({ type: 'text', label: 'window', value: `"${str.slice(left, r + 1)}"  len = ${r - left + 1}` });
      return v;
    };
    const { steps, s } = recorder(() => ({}));
    const V = extra => Object.assign({ s: jstr(str), last: lastStr(), left: String(left), best: String(best) }, extra || {});
    s(2, 'last = new HashMap<>() — har char ka last index', { vars: { s: jstr(str), last: lastStr() }, views: view() });
    s(3, 'left = 0, best = 0', { vars: V(), views: view() });
    for (let right = 0; right < str.length; right++) {
      const P = () => [{ i: left, label: 'left' }, { i: right, label: 'right' }];
      s(4, `right = ${right}`, { vars: V({ right: String(right) }), views: view(winHl(left, right - 1, { [right]: 'cur' }), P()) });
      const c = str[right];
      s(5, `c = '${c}'`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right - 1, { [right]: 'cur' }), P(), c) });
      if (last.has(c) && last.get(c) >= left) {
        const j = last.get(c);
        s(6, `'${c}' last index ${j} pe tha aur ${j} ≥ left (${left}) → window me duplicate!`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right - 1, { [j]: 'skip', [right]: 'cur' }), P(), c) });
        left = j + 1;
        s(7, `left = ${j} + 1 = ${left} (seedha jump)`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right, { [right]: 'cur' }), P(), c) });
      } else {
        s(6, last.has(c) ? `'${c}' last index ${last.get(c)} < left (${left}) → window ke bahar, ignore` : `'${c}' pehli baar → koi duplicate nahi`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right - 1, { [right]: 'cur' }), P(), c) });
      }
      last.set(c, right);
      s(9, `last.put('${c}', ${right})`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right, { [right]: 'new' }), P(), c) });
      const up = right - left + 1 > best;
      best = Math.max(best, right - left + 1);
      s(10, `len = ${right} − ${left} + 1 = ${right - left + 1} → best = ${best}${up ? ' (update)' : ''}`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right, up ? range(left, right, 'found') : {}), P(), undefined, right) });
    }
    s(12, `return ${best}`, { vars: V(), views: view(), ret: String(best) });
    return steps;
  }
  function run3Set(str) {
    const win = new Set();
    let left = 0, best = 0;
    const setStr = () => `HashSet size=${win.size} [${[...win].join(', ')}]`;
    const view = (hl, ptr, hk) => [{ type: 'array', label: 's (chars)', vals: chars(str), hl: hl || {}, ptr: ptr || [] },
      { type: 'set', label: 'HashSet window', items: [...win].map(x => `'${x}'`), hl: hk !== undefined ? `'${hk}'` : undefined }];
    const { steps, s } = recorder(() => ({}));
    const V = extra => Object.assign({ s: jstr(str), window: setStr(), left: String(left), best: String(best) }, extra || {});
    s(2, 'window = new HashSet<>() — window ke chars', { vars: { s: jstr(str), window: setStr() }, views: view() });
    s(3, 'left = 0, best = 0', { vars: V(), views: view() });
    for (let right = 0; right < str.length; right++) {
      const P = () => [{ i: left, label: 'left' }, { i: right, label: 'right' }];
      s(4, `right = ${right}`, { vars: V({ right: String(right) }), views: view(winHl(left, right - 1, { [right]: 'cur' }), P()) });
      const c = str[right];
      s(5, `c = '${c}'`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right - 1, { [right]: 'cur' }), P(), c) });
      while (win.has(c) && steps.length < 590) {
        s(6, `window.contains('${c}') → true, shrink karo`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right - 1, { [left]: 'skip', [right]: 'cur' }), P(), c) });
        const d = str[left];
        win.delete(d);
        s(7, `window.remove('${d}')`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left + 1, right - 1, { [left]: 'skip', [right]: 'cur' }), P()) });
        left++;
        s(8, `left++ → ${left}`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right - 1, { [right]: 'cur' }), P()) });
      }
      s(6, `window.contains('${c}') → false`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right - 1, { [right]: 'cur' }), P()) });
      win.add(c);
      s(10, `window.add('${c}')`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right, { [right]: 'new' }), P(), c) });
      const up = right - left + 1 > best;
      best = Math.max(best, right - left + 1);
      s(11, `len = ${right - left + 1} → best = ${best}${up ? ' (update)' : ''}`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right, up ? range(left, right, 'found') : {}), P()) });
    }
    s(13, `return ${best}`, { vars: V(), views: view(), ret: String(best) });
    return steps;
  }
  D[3] = {
    title: 'Longest Substring Without Repeating (HashMap last index)', label: 'HashMap (Optimal)', ap: 2,
    inputs: [{ key: 's', label: 's', def: 'abcabcbb', type: 'str' }],
    run({ s }) { return run3Map(s); },
    variants: [{ label: 'HashSet (Better)', title: 'Longest Substring Without Repeating (HashSet window)', ap: 1, run({ s }) { return run3Set(s); } }],
  };

  // ---------------- 424 Longest Repeating Character Replacement ----------------
  D[424] = {
    title: 'Longest Repeating Character Replacement', label: 'Window + count[26]',
    inputs: [{ key: 's', label: 's (uppercase)', def: 'AABABBA', type: 'str' }, { key: 'k', label: 'k', def: '1', type: 'num' }],
    check: ({ s }) => (/^[A-Z]*$/.test(s) ? '' : 's me sirf uppercase A–Z daalo.'),
    run({ s: str, k }) {
      const count = Array(26).fill(0);
      let left = 0, maxFreq = 0, best = 0;
      const ent = () => { const o = {}; count.forEach((v, i) => { if (v) o[String.fromCharCode(65 + i)] = v; }); return o; };
      const cntStr = () => `int[26] {${Object.entries(ent()).map(([a, b]) => `${a}=${b}`).join(', ')}}`;
      const view = (hl, ptr, hk, r) => {
        const v = [{ type: 'array', label: 's (chars)', vals: chars(str), hl: hl || {}, ptr: ptr || [] },
          { type: 'map', label: 'count (sirf non-zero)', entries: ent(), hl: hk }];
        if (r !== undefined) v.push({ type: 'text', label: 'window', value: `"${str.slice(left, r + 1)}"  len ${r - left + 1} − maxFreq ${maxFreq} = ${r - left + 1 - maxFreq} replacements` });
        return v;
      };
      const { steps, s } = recorder(() => ({}));
      const V = extra => Object.assign({ s: jstr(str), k: String(k), count: cntStr(), left: String(left), maxFreq: String(maxFreq), best: String(best) }, extra || {});
      s(2, 'count = new int[26] — window me har letter ki frequency', { vars: { s: jstr(str), k: String(k), count: cntStr() }, views: view() });
      s(3, 'left = 0, maxFreq = 0, best = 0', { vars: V(), views: view() });
      for (let right = 0; right < str.length; right++) {
        const P = () => [{ i: left, label: 'left' }, { i: right, label: 'right' }];
        s(4, `right = ${right}`, { vars: V({ right: String(right) }), views: view(winHl(left, right - 1, { [right]: 'cur' }), P()) });
        const ch = str[right], c = ch.charCodeAt(0) - 65;
        s(5, `c = '${ch}' − 'A' = ${c}`, { vars: V({ right: String(right), c: String(c) }), views: view(winHl(left, right - 1, { [right]: 'cur' }), P()) });
        count[c]++;
        s(6, `count['${ch}']++ → ${count[c]}`, { vars: V({ right: String(right), c: String(c) }), views: view(winHl(left, right, { [right]: 'new' }), P(), ch) });
        maxFreq = Math.max(maxFreq, count[c]);
        s(7, `maxFreq = ${maxFreq}`, { vars: V({ right: String(right), c: String(c) }), views: view(winHl(left, right), P(), ch, right) });
        while (right - left + 1 - maxFreq > k) {
          const d = str[left];
          s(8, `${right - left + 1} − ${maxFreq} = ${right - left + 1 - maxFreq} > k (${k}) → window invalid, shrink`, { vars: V({ right: String(right), c: String(c) }), views: view(winHl(left, right, { [left]: 'skip' }), P(), d, right) });
          count[d.charCodeAt(0) - 65]--;
          s(9, `count['${d}']-- → ${count[d.charCodeAt(0) - 65]}`, { vars: V({ right: String(right), c: String(c) }), views: view(winHl(left + 1, right, { [left]: 'skip' }), P(), d) });
          left++;
          s(10, `left++ → ${left}`, { vars: V({ right: String(right), c: String(c) }), views: view(winHl(left, right), P(), undefined, right) });
        }
        const up = right - left + 1 > best;
        best = Math.max(best, right - left + 1);
        s(12, `window valid (${right - left + 1 - maxFreq} ≤ ${k}) → best = ${best}${up ? ' (update)' : ''}`, { vars: V({ right: String(right), c: String(c) }), views: view(winHl(left, right, up ? range(left, right, 'found') : {}), P(), undefined, right) });
      }
      s(14, `return ${best}`, { vars: V(), views: view(), ret: String(best) });
      return steps;
    },
  };

  // ---------------- 1004 Max Consecutive Ones III ----------------
  D[1004] = {
    title: 'Max Consecutive Ones III (window me ≤ k zeros)', label: 'Variable window',
    inputs: [{ key: 'nums', label: 'nums (0 / 1)', def: '1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0' }, { key: 'k', label: 'k', def: '2', type: 'num' }],
    check: ({ nums }) => (nums.every(v => v === 0 || v === 1) ? '' : 'Sirf 0 aur 1 daalo.'),
    run({ nums, k }) {
      let left = 0, zeros = 0, best = 0, bl = 0, br = -1;
      const view = (hl, ptr) => [{ type: 'array', label: 'nums', vals: nums, hl: hl || {}, ptr: ptr || [] }];
      const { steps, s } = recorder(() => ({}));
      const V = extra => Object.assign({ nums: intArr(nums), k: String(k), left: String(left), zeros: String(zeros), best: String(best) }, extra || {});
      s(2, 'left = 0, zeros = 0, best = 0', { vars: V(), views: view() });
      for (let right = 0; right < nums.length; right++) {
        const P = () => [{ i: left, label: 'left' }, { i: right, label: 'right' }];
        s(3, `right = ${right}`, { vars: V({ right: String(right) }), views: view(winHl(left, right - 1, { [right]: 'cur' }), P()) });
        if (nums[right] === 0) { zeros++; s(4, `nums[${right}] = 0 → zeros = ${zeros}`, { vars: V({ right: String(right) }), views: view(winHl(left, right, { [right]: 'new' }), P()) }); }
        else s(4, `nums[${right}] = 1 → zeros same (${zeros})`, { vars: V({ right: String(right) }), views: view(winHl(left, right), P()) });
        while (zeros > k) {
          s(5, `zeros (${zeros}) > k (${k}) → window invalid, shrink`, { vars: V({ right: String(right) }), views: view(winHl(left, right, { [left]: 'skip' }), P()) });
          if (nums[left] === 0) zeros--;
          s(6, nums[left] === 0 ? `nums[${left}] = 0 bahar → zeros = ${zeros}` : `nums[${left}] = 1 bahar (zeros same)`, { vars: V({ right: String(right) }), views: view(winHl(left + 1, right, { [left]: 'skip' }), P()) });
          left++;
          s(7, `left++ → ${left}`, { vars: V({ right: String(right) }), views: view(winHl(left, right), P()) });
        }
        const up = right - left + 1 > best;
        if (up) { best = right - left + 1; bl = left; br = right; }
        s(9, `len = ${right - left + 1} → best = ${best}${up ? ' (update)' : ''}`, { vars: V({ right: String(right) }), views: view(winHl(left, right, up ? range(left, right, 'found') : {}), P()) });
      }
      s(11, `return ${best}`, { vars: V(), views: view(br >= 0 ? range(bl, br, 'found') : {}), ret: String(best) });
      return steps;
    },
  };

  // ---------------- 209 Minimum Size Subarray Sum ----------------
  D[209] = {
    title: 'Minimum Size Subarray Sum (Shortest window)', label: 'Variable window',
    inputs: [{ key: 'target', label: 'target', def: '7', type: 'num' }, { key: 'nums', label: 'nums (positive)', def: '2, 3, 1, 2, 4, 3' }],
    check: ({ nums }) => (nums.every(v => v > 0) ? '' : 'Sab numbers positive hone chahiye (warna window kaam nahi karti).'),
    run({ target, nums }) {
      let left = 0, sum = 0, best = Infinity, bl = 0, br = -1;
      const view = (hl, ptr) => [{ type: 'array', label: 'nums', vals: nums, hl: hl || {}, ptr: ptr || [] }];
      const { steps, s } = recorder(() => ({}));
      const V = extra => Object.assign({ target: String(target), nums: intArr(nums), left: String(left), sum: String(sum), best: showMax(best) }, extra || {});
      s(2, 'left = 0, sum = 0, best = Integer.MAX_VALUE (abhi koi window nahi mili)', { vars: V(), views: view() });
      for (let right = 0; right < nums.length; right++) {
        const P = () => [{ i: left, label: 'left' }, { i: right, label: 'right' }];
        s(3, `right = ${right}`, { vars: V({ right: String(right) }), views: view(winHl(left, right - 1, { [right]: 'cur' }), P()) });
        sum += nums[right];
        s(4, `sum += ${nums[right]} → ${sum}`, { vars: V({ right: String(right) }), views: view(winHl(left, right, { [right]: 'new' }), P()) });
        while (sum >= target) {
          s(5, `sum (${sum}) ≥ target (${target}) → window [${left}..${right}] valid`, { vars: V({ right: String(right) }), views: view(winHl(left, right), P()) });
          const up = right - left + 1 < best;
          if (up) { best = right - left + 1; bl = left; br = right; }
          s(6, `len = ${right - left + 1} → best = ${best}${up ? ' (chhota mila!)' : ''}`, { vars: V({ right: String(right) }), views: view(winHl(left, right, up ? range(left, right, 'found') : {}), P()) });
          sum -= nums[left];
          s(7, `sum −= nums[${left}] (${nums[left]}) → ${sum}`, { vars: V({ right: String(right) }), views: view(winHl(left + 1, right, { [left]: 'skip' }), P()) });
          left++;
          s(8, `left++ → ${left} (aur chhota try karo)`, { vars: V({ right: String(right) }), views: view(winHl(left, right), P()) });
        }
        s(5, `sum (${sum}) < target (${target}) → right badhao`, { vars: V({ right: String(right) }), views: view(winHl(left, right), P()) });
      }
      const ans = best === Infinity ? 0 : best;
      s(11, best === Infinity ? 'best abhi bhi MAX_VALUE → koi window nahi → return 0' : `return ${ans}`, { vars: V(), views: view(br >= 0 ? range(bl, br, 'found') : {}), ret: String(ans) });
      return steps;
    },
  };

  // ---------------- 76 Minimum Window Substring ----------------
  D[76] = {
    title: 'Minimum Window Substring (need[128] + missing)', label: 'need[] + missing',
    inputs: [{ key: 's', label: 's', def: 'ADOBECODEBANC', type: 'str' }, { key: 't', label: 't', def: 'ABC', type: 'str' }],
    run({ s: str, t }) {
      const need = {};
      for (const c of t) need[c] = (need[c] || 0) + 1;
      const tset = Object.keys(need);
      let left = 0, missing = t.length, bestLen = Infinity, bestStart = 0;
      const ent = () => { const o = {}; Object.keys(need).forEach(c => { if (need[c] !== 0 || tset.includes(c)) o[`'${c}'`] = need[c]; }); return o; };
      const needStr = () => `int[128] {${Object.keys(need).filter(c => need[c] !== 0 || tset.includes(c)).map(c => `${c}=${need[c]}`).join(', ')}}`;
      const view = (hl, ptr, hk, r) => {
        const v = [{ type: 'array', label: 's (chars)', vals: chars(str), hl: hl || {}, ptr: ptr || [] },
          { type: 'map', label: 'need[] (>0 = abhi chahiye, <0 = extra)', entries: ent(), hl: hk !== undefined ? `'${hk}'` : undefined },
          { type: 'text', label: 'missing / best', value: `missing = ${missing}   best = ${bestLen === Infinity ? '(abhi nahi)' : '"' + str.substr(bestStart, bestLen) + '"'}` }];
        if (r !== undefined) v.push({ type: 'text', label: 'window', value: `"${str.slice(left, r + 1)}"` });
        return v;
      };
      const { steps, s } = recorder(() => ({}));
      const V = extra => Object.assign({ s: jstr(str), t: jstr(t), need: needStr(), left: String(left), missing: String(missing), bestLen: showMax(bestLen), bestStart: String(bestStart) }, extra || {});
      s(2, 'need = new int[128] (sab 0)', { vars: { s: jstr(str), t: jstr(t), need: 'int[128] {}' }, views: [{ type: 'array', label: 's (chars)', vals: chars(str) }] });
      s(3, `t ke har char ka need++ → ${needStr()}`, { vars: { s: jstr(str), t: jstr(t), need: needStr() }, views: view() });
      s(4, `left = 0, missing = t.length() = ${t.length}`, { vars: V(), views: view() });
      s(5, 'bestLen = MAX_VALUE, bestStart = 0', { vars: V(), views: view() });
      for (let right = 0; right < str.length; right++) {
        const P = () => [{ i: left, label: 'left' }, { i: right, label: 'right' }];
        s(6, `right = ${right}`, { vars: V({ right: String(right) }), views: view(winHl(left, right - 1, { [right]: 'cur' }), P()) });
        const c = str[right];
        s(7, `c = '${c}'`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right - 1, { [right]: 'cur' }), P(), c) });
        const was = need[c] || 0;
        if (was > 0) missing--;
        s(8, was > 0 ? `need['${c}'] = ${was} > 0 → ye char chahiye tha → missing = ${missing}` : `need['${c}'] = ${was} → zaroori nahi (ya extra)`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right, { [right]: was > 0 ? 'found' : 'new' }), P(), c) });
        need[c] = was - 1;
        s(9, `need['${c}']-- → ${need[c]}`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right, { [right]: 'new' }), P(), c, right) });
        while (missing === 0 && steps.length < 590) {
          s(10, `missing == 0 → window "${str.slice(left, right + 1)}" me t ke saare chars hain`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right), P(), undefined, right) });
          if (right - left + 1 < bestLen) {
            bestLen = right - left + 1; bestStart = left;
            s(13, `len ${bestLen} chhota hai → bestLen = ${bestLen}, bestStart = ${bestStart}`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right, range(left, right, 'found')), P(), undefined, right) });
          } else {
            s(11, `len ${right - left + 1} ≥ bestLen ${bestLen} → best same`, { vars: V({ right: String(right), c: `'${c}'` }), views: view(winHl(left, right), P(), undefined, right) });
          }
          const d = str[left];
          s(15, `d = s.charAt(left) = '${d}' — ab ise bahar nikalenge`, { vars: V({ right: String(right), c: `'${c}'`, d: `'${d}'` }), views: view(winHl(left, right, { [left]: 'skip' }), P(), d) });
          need[d] = (need[d] || 0) + 1;
          s(16, `need['${d}']++ → ${need[d]}`, { vars: V({ right: String(right), c: `'${c}'`, d: `'${d}'` }), views: view(winHl(left + 1, right, { [left]: 'skip' }), P(), d) });
          if (need[d] > 0) missing++;
          s(17, need[d] > 0 ? `need['${d}'] > 0 → zaroori char gaya → missing = ${missing}` : `need['${d}'] = ${need[d]} ≤ 0 → extra copy thi, window abhi bhi valid`, { vars: V({ right: String(right), c: `'${c}'`, d: `'${d}'` }), views: view(winHl(left + 1, right, { [left]: 'skip' }), P(), d) });
          left++;
          s(18, `left++ → ${left}`, { vars: V({ right: String(right), c: `'${c}'`, d: `'${d}'` }), views: view(winHl(left, right), P(), undefined, right) });
        }
      }
      const ans = bestLen === Infinity ? '' : str.substr(bestStart, bestLen);
      s(21, bestLen === Infinity ? 'bestLen abhi bhi MAX_VALUE → return ""' : `return s.substring(${bestStart}, ${bestStart + bestLen}) = "${ans}"`, { vars: V(), views: view(bestLen === Infinity ? {} : range(bestStart, bestStart + bestLen - 1, 'found')), ret: `"${ans}"` });
      return steps;
    },
  };
})();
