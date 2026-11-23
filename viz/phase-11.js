// Phase 11 — Dynamic Programming visualizers. DP table cell-by-cell bharta hai:
// 'win' = jo cells padhe ja rahe hain, 'new' = jo cell abhi likha, 'found' = answer.
(function () {
  const { recorder } = VIZ.util;
  const arrStr = (type, a) => `${type}[${a.length}] [${a.join(', ')}]`;
  const cols = n => Array.from({ length: n }, (_, i) => String(i));
  // 1D dp ko single-row table ki tarah
  const row1 = (label, vals, hl, colLabels, rowLabel) => {
    const h = {};
    Object.keys(hl || {}).forEach(k => { h['0,' + k] = hl[k]; });
    return { type: 'table', label, rows: [vals.map(v => (v === null || v === undefined ? '' : String(v)))], rowLabels: [rowLabel || 'dp'], colLabels: colLabels || cols(vals.length), hl: h };
  };
  const allHl = (n, cls) => { const o = {}; for (let i = 0; i < n; i++) o[i] = cls; return o; };

  // ================= LC 70 Climbing Stairs =================
  VIZ.defs[70] = {
    title: 'Climbing Stairs (Tabulation)', label: 'Tabulation',
    ap: 2,
    inputs: [{ key: 'n', label: 'n (steps)', type: 'num', def: '5' }],
    check: ({ n }) => (n >= 1 && n <= 45 ? '' : 'n 1..45 ke beech rakho.'),
    run({ n }) {
      const dp = Array(n + 1).fill(0);
      const { steps, s } = recorder(() => ({}));
      const V = hl => [row1('dp[i] = step i tak ke tarike', dp, hl, cols(n + 1).map(x => 'i=' + x))];
      const vars = extra => Object.assign({ n: String(n), dp: arrStr('int', dp) }, extra || {});
      s(2, `dp = new int[${n + 1}] — index 0..${n}, sab 0`, { views: V(), vars: vars() });
      dp[0] = 1;
      s(3, 'dp[0] = 1 — ground pe khade rehne ka 1 tarika (kuch mat karo)', { views: V({ 0: 'new' }), vars: vars() });
      dp[1] = 1;
      s(4, 'dp[1] = 1 — step 1 tak sirf ek tarika (1)', { views: V({ 1: 'new' }), vars: vars() });
      for (let i = 2; i <= n; i++) {
        s(5, `i = ${i}, ${i} <= ${n} ✓`, { views: V({ [i - 1]: 'win', [i - 2]: 'win' }), vars: vars({ i: String(i) }) });
        dp[i] = dp[i - 1] + dp[i - 2];
        s(6, `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]} (last jump 1 ya 2)`, { views: V({ [i - 1]: 'win', [i - 2]: 'win', [i]: 'new' }), vars: vars({ i: String(i) }) });
      }
      s(8, `return dp[${n}] = ${dp[n]}`, { views: V({ [n]: 'found' }), vars: vars(), ret: String(dp[n]) });
      return steps;
    },
    variants: [
      {
        label: 'Memoization', title: 'Climbing Stairs (Memoization — recursion + memo)', ap: 1,
        run({ n }) {
          const memo = Array(n + 1).fill(0);
          const stack = [];
          const { steps, s } = recorder(() => ({}));
          const V = hl => [row1('memo[n] (0 = abhi compute nahi hua)', memo, hl, cols(n + 1).map(x => 'n=' + x), 'memo')];
          const frames = () => stack.slice().reverse().map(f => ({ method: f.m, args: f.args, line: f.line, vars: f.vars() }));
          s(2, `memo = new int[${n + 1}]`, { views: V(), frames: [{ method: 'climbStairs', args: 'n=' + n, line: 2, vars: { n: String(n), memo: arrStr('int', memo) } }] });
          stack.push({ m: 'climbStairs', args: 'n=' + n, line: 3, vars: () => ({ n: String(n), memo: arrStr('int', memo) }) });
          function ways(k) {
            const fr = { m: 'ways', args: 'n=' + k, line: 7, vars: () => ({ n: String(k), memo: arrStr('int', memo) }) };
            stack.push(fr);
            if (k <= 1) {
              s(7, `ways(${k}): base case n <= 1 → return 1`, { views: V(), frames: frames() });
              stack.pop(); return 1;
            }
            if (memo[k] !== 0) {
              fr.line = 8;
              s(8, `ways(${k}): memo[${k}] = ${memo[k]} already hai → seedha return (poori branch bachi!)`, { views: V({ [k]: 'win' }), frames: frames() });
              stack.pop(); return memo[k];
            }
            fr.line = 9;
            s(9, `ways(${k}): memo me nahi → ways(${k - 1}) + ways(${k - 2}) call karo`, { views: V({ [k]: 'cur' }), frames: frames() });
            const a = ways(k - 1);
            const b = ways(k - 2);
            memo[k] = a + b;
            fr.line = 10;
            s(10, `ways(${k}) = ${a} + ${b} = ${memo[k]} → memo[${k}] me save`, { views: V({ [k]: 'new' }), frames: frames() });
            stack.pop(); return memo[k];
          }
          const r = ways(n);
          stack.length = 0;
          s(3, `return ${r} — har n sirf ek baar compute hua`, { views: V({ [n]: 'found' }), frames: [{ method: 'climbStairs', args: 'n=' + n, line: 3, vars: { n: String(n), memo: arrStr('int', memo) } }], ret: String(r) });
          return steps;
        },
      },
      {
        label: 'Space O(1)', title: 'Climbing Stairs (2 variables)', ap: 3,
        run({ n }) {
          let prev2 = 1, prev1 = 1;
          const seen = [1, 1];
          const { steps, s } = recorder(() => ({}));
          const V = hl => [row1('dp values (sirf last 2 yaad rakhte hain)', seen.slice(), hl, cols(seen.length).map(x => 'i=' + x))];
          s(2, 'prev2 = dp[0] = 1, prev1 = dp[1] = 1', { views: V({ 0: 'win', 1: 'win' }), vars: { n: String(n), prev2: '1', prev1: '1' } });
          for (let i = 2; i <= n; i++) {
            s(3, `i = ${i}`, { views: V({ [i - 1]: 'win', [i - 2]: 'win' }), vars: { n: String(n), prev2: String(prev2), prev1: String(prev1), i: String(i) } });
            const cur = prev1 + prev2;
            seen.push(cur);
            s(4, `cur = prev1 + prev2 = ${prev1} + ${prev2} = ${cur}`, { views: V({ [i - 1]: 'win', [i - 2]: 'win', [i]: 'new' }), vars: { n: String(n), prev2: String(prev2), prev1: String(prev1), i: String(i), cur: String(cur) } });
            prev2 = prev1;
            s(5, `prev2 = ${prev2} (window aage khiska)`, { views: V({ [i - 1]: 'win', [i]: 'new' }), vars: { n: String(n), prev2: String(prev2), prev1: String(prev1), i: String(i), cur: String(cur) } });
            prev1 = cur;
            s(6, `prev1 = ${prev1}`, { views: V({ [i - 1]: 'win', [i]: 'win' }), vars: { n: String(n), prev2: String(prev2), prev1: String(prev1), i: String(i), cur: String(cur) } });
          }
          s(8, `return prev1 = ${prev1}`, { views: V({ [n]: 'found' }), vars: { n: String(n), prev2: String(prev2), prev1: String(prev1) }, ret: String(prev1) });
          return steps;
        },
      },
    ],
  };

  // ================= LC 746 Min Cost Climbing Stairs =================
  VIZ.defs[746] = {
    title: 'Min Cost Climbing Stairs (Tabulation)', label: 'Tabulation',
    ap: 2,
    inputs: [{ key: 'cost', label: 'cost', def: '10, 15, 20' }],
    check: ({ cost }) => (cost.length >= 2 ? '' : 'cost me kam se kam 2 values.'),
    run({ cost }) {
      const n = cost.length, dp = Array(n + 1).fill(0);
      const { steps, s } = recorder(() => ({}));
      const V = (hl, chl) => [
        { type: 'array', label: 'cost', vals: cost.concat(['top']), hl: chl || {} },
        row1('dp[i] = step i tak min cost', dp, hl, cols(n + 1).map(x => (Number(x) === n ? 'top' : 'i=' + x))),
      ];
      const vars = extra => Object.assign({ cost: arrStr('int', cost), n: String(n), dp: arrStr('int', dp) }, extra || {});
      s(2, `n = ${n} → top = index ${n}`, { views: V(), vars: { cost: arrStr('int', cost), n: String(n) } });
      s(3, `dp = new int[${n + 1}]`, { views: V(), vars: vars() });
      s(4, 'dp[0] = 0 — step 0 se free start', { views: V({ 0: 'new' }), vars: vars() });
      s(5, 'dp[1] = 0 — step 1 se bhi free start', { views: V({ 1: 'new' }), vars: vars() });
      for (let i = 2; i <= n; i++) {
        s(6, `i = ${i}`, { views: V({ [i - 1]: 'win', [i - 2]: 'win' }), vars: vars({ i: String(i) }) });
        const a = dp[i - 1] + cost[i - 1], b = dp[i - 2] + cost[i - 2];
        dp[i] = Math.min(a, b);
        s(7, `dp[${i}] = min(dp[${i - 1}] + cost[${i - 1}], dp[${i - 2}] + cost[${i - 2}]) = min(${dp[i - 1]}+${cost[i - 1]}, ${dp[i - 2]}+${cost[i - 2]}) = min(${a}, ${b}) = ${dp[i]}`,
          { views: V({ [i - 1]: 'win', [i - 2]: 'win', [i]: 'new' }, { [i - 1]: 'win', [i - 2]: 'win' }), vars: vars({ i: String(i) }) });
      }
      s(9, `return dp[${n}] = ${dp[n]} (top tak min cost)`, { views: V({ [n]: 'found' }), vars: vars(), ret: String(dp[n]) });
      return steps;
    },
    variants: [
      {
        label: 'Space O(1)', title: 'Min Cost Climbing Stairs (2 variables)', ap: 3,
        run({ cost }) {
          const n = cost.length;
          let prev2 = 0, prev1 = 0;
          const seen = [0, 0];
          const { steps, s } = recorder(() => ({}));
          const V = hl => [{ type: 'array', label: 'cost', vals: cost }, row1('dp values (sirf last 2 yaad)', seen.slice(), hl, cols(seen.length).map(x => (Number(x) === n ? 'top' : 'i=' + x)))];
          const vars = extra => Object.assign({ cost: arrStr('int', cost), prev2: String(prev2), prev1: String(prev1) }, extra || {});
          s(2, 'prev2 = dp[0] = 0, prev1 = dp[1] = 0', { views: V({ 0: 'win', 1: 'win' }), vars: vars() });
          for (let i = 2; i <= n; i++) {
            s(3, `i = ${i}`, { views: V({ [i - 1]: 'win', [i - 2]: 'win' }), vars: vars({ i: String(i) }) });
            const cur = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]);
            seen.push(cur);
            s(4, `cur = min(${prev1}+${cost[i - 1]}, ${prev2}+${cost[i - 2]}) = ${cur}`, { views: V({ [i - 1]: 'win', [i - 2]: 'win', [i]: 'new' }), vars: vars({ i: String(i), cur: String(cur) }) });
            prev2 = prev1;
            s(5, `prev2 = ${prev2}`, { views: V({ [i - 1]: 'win', [i]: 'new' }), vars: vars({ i: String(i), cur: String(cur) }) });
            prev1 = cur;
            s(6, `prev1 = ${prev1}`, { views: V({ [i - 1]: 'win', [i]: 'win' }), vars: vars({ i: String(i), cur: String(cur) }) });
          }
          s(8, `return prev1 = ${prev1}`, { views: V({ [n]: 'found' }), vars: vars(), ret: String(prev1) });
          return steps;
        },
      },
    ],
  };

  // ================= LC 198 House Robber =================
  VIZ.defs[198] = {
    title: 'House Robber (Tabulation)', label: 'Tabulation',
    ap: 2,
    inputs: [{ key: 'nums', label: 'nums (har ghar ka paisa)', def: '2, 7, 9, 3, 1' }],
    check: ({ nums }) => (nums.length >= 1 ? '' : 'Kam se kam 1 ghar.'),
    run({ nums }) {
      const n = nums.length, dp = Array(n + 1).fill(0);
      const { steps, s } = recorder(() => ({}));
      const V = (hl, nhl) => [
        { type: 'array', label: 'nums (ghar)', vals: nums, hl: nhl || {} },
        row1('dp[i] = pehle i ghar se max', dp, hl, cols(n + 1).map(x => 'i=' + x)),
      ];
      const vars = extra => Object.assign({ nums: arrStr('int', nums), n: String(n), dp: arrStr('int', dp) }, extra || {});
      s(2, `n = ${n}`, { views: V(), vars: { nums: arrStr('int', nums), n: String(n) } });
      s(3, `dp = new int[${n + 1}]`, { views: V(), vars: vars() });
      s(4, 'dp[0] = 0 — koi ghar nahi toh 0', { views: V({ 0: 'new' }), vars: vars() });
      dp[1] = nums[0];
      s(5, `dp[1] = nums[0] = ${nums[0]} — sirf pehla ghar`, { views: V({ 1: 'new' }, { 0: 'found' }), vars: vars() });
      for (let i = 2; i <= n; i++) {
        s(6, `i = ${i} → ghar index ${i - 1} (value ${nums[i - 1]}) ka faisla`, { views: V({}, { [i - 1]: 'cur' }), vars: vars({ i: String(i) }) });
        const skip = dp[i - 1];
        s(7, `skip = dp[${i - 1}] = ${skip} (ye ghar chhoda)`, { views: V({ [i - 1]: 'win' }, { [i - 1]: 'skip' }), vars: vars({ i: String(i), skip: String(skip) }) });
        const take = dp[i - 2] + nums[i - 1];
        s(8, `take = dp[${i - 2}] + nums[${i - 1}] = ${dp[i - 2]} + ${nums[i - 1]} = ${take} (loota → pichla ghar nahi)`, { views: V({ [i - 2]: 'win' }, { [i - 1]: 'cur', [i - 2]: 'skip' }), vars: vars({ i: String(i), skip: String(skip), take: String(take) }) });
        dp[i] = Math.max(skip, take);
        s(9, `dp[${i}] = max(${skip}, ${take}) = ${dp[i]} → ${take > skip ? 'loota' : 'chhoda'}`, { views: V({ [i - 1]: 'win', [i - 2]: 'win', [i]: 'new' }, { [i - 1]: take > skip ? 'found' : 'skip' }), vars: vars({ i: String(i), skip: String(skip), take: String(take) }) });
      }
      s(11, `return dp[${n}] = ${dp[n]}`, { views: V({ [n]: 'found' }), vars: vars(), ret: String(dp[n]) });
      return steps;
    },
    variants: [
      {
        label: 'Space O(1)', title: 'House Robber (2 variables)', ap: 3,
        run({ nums }) {
          let prev2 = 0, prev1 = 0;
          const seen = [0];
          const { steps, s } = recorder(() => ({}));
          const V = (hl, nhl) => [{ type: 'array', label: 'nums', vals: nums, hl: nhl || {} }, row1('dp values (sirf last 2 yaad)', seen.slice(), hl, cols(seen.length).map(x => 'i=' + x))];
          const vars = extra => Object.assign({ prev2: String(prev2), prev1: String(prev1) }, extra || {});
          s(2, 'prev2 = 0, prev1 = 0', { views: V(), vars: vars() });
          nums.forEach((x, k) => {
            const i = k + 1;
            s(3, `x = nums[${k}] = ${x}`, { views: V({ [i - 1]: 'win', [i - 2]: 'win' }, { [k]: 'cur' }), vars: vars({ x: String(x) }) });
            const cur = Math.max(prev1, prev2 + x);
            seen.push(cur);
            s(4, `cur = max(prev1 = ${prev1}, prev2 + x = ${prev2} + ${x}) = ${cur}`, { views: V({ [i - 1]: 'win', [i - 2]: 'win', [i]: 'new' }, { [k]: 'cur' }), vars: vars({ x: String(x), cur: String(cur) }) });
            prev2 = prev1;
            s(5, `prev2 = ${prev2}`, { views: V({ [i - 1]: 'win', [i]: 'new' }, { [k]: 'cur' }), vars: vars({ x: String(x), cur: String(cur) }) });
            prev1 = cur;
            s(6, `prev1 = ${prev1}`, { views: V({ [i - 1]: 'win', [i]: 'win' }, { [k]: 'cur' }), vars: vars({ x: String(x), cur: String(cur) }) });
          });
          s(8, `return prev1 = ${prev1}`, { views: V({ [nums.length]: 'found' }), vars: vars(), ret: String(prev1) });
          return steps;
        },
      },
    ],
  };

  // ================= LC 322 Coin Change =================
  VIZ.defs[322] = {
    title: 'Coin Change (Tabulation, min coins)', label: 'Tabulation',
    ap: 2,
    inputs: [{ key: 'coins', label: 'coins', def: '1, 2, 5' }, { key: 'amount', label: 'amount', type: 'num', def: '11' }],
    check: ({ coins, amount }) => (coins.length && coins.every(c => c > 0) && amount >= 0 && amount <= 60 ? '' : 'coins positive, amount 0..60 rakho (visualizer ke liye).'),
    run({ coins, amount }) {
      const INF = amount + 1, dp = Array(amount + 1).fill(INF);
      const { steps, s } = recorder(() => ({}));
      const show = () => dp.map(v => (v === INF ? '∞' : v));
      const V = (hl, chl) => [
        { type: 'array', label: 'coins', vals: coins, hl: chl || {} },
        row1(`dp[a] = amount a ke min coins (∞ = ${INF})`, show(), hl, cols(amount + 1).map(x => 'a=' + x)),
      ];
      const vars = extra => Object.assign({ coins: arrStr('int', coins), amount: String(amount), dp: arrStr('int', dp) }, extra || {});
      s(2, `dp = new int[${amount + 1}]`, { views: V(), vars: vars() });
      s(3, `Arrays.fill(dp, ${INF}) — ${INF} = "infinity" (itne coins kabhi nahi lagenge)`, { views: V(allHl(amount + 1, 'skip')), vars: vars() });
      dp[0] = 0;
      s(4, 'dp[0] = 0 — amount 0 ke liye 0 coins', { views: V({ 0: 'new' }), vars: vars() });
      for (let a = 1; a <= amount; a++) {
        s(5, `a = ${a}`, { views: V({ [a]: 'cur' }), vars: vars({ a: String(a) }) });
        coins.forEach((c, ci) => {
          s(6, `c = ${c}`, { views: V({ [a]: 'cur' }, { [ci]: 'cur' }), vars: vars({ a: String(a), c: String(c) }) });
          if (c <= a) {
            const old = dp[a], cand = dp[a - c] + 1;
            dp[a] = Math.min(dp[a], cand);
            const sh = v => (v >= INF ? '∞' : v);
            s(8, `dp[${a}] = min(dp[${a}] = ${sh(old)}, dp[${a - c}] + 1 = ${sh(dp[a - c])} + 1) = ${sh(dp[a])}${dp[a] < old ? ' ✓ better' : ''}`,
              { views: V({ [a - c]: 'win', [a]: 'new' }, { [ci]: 'cur' }), vars: vars({ a: String(a), c: String(c) }) });
          } else {
            s(7, `c = ${c} > a = ${a} → ye coin use nahi ho sakta`, { views: V({ [a]: 'cur' }, { [ci]: 'skip' }), vars: vars({ a: String(a), c: String(c) }) });
          }
        });
      }
      const r = dp[amount] > amount ? -1 : dp[amount];
      s(12, dp[amount] > amount ? `dp[${amount}] = ∞ (> amount) → return -1` : `dp[${amount}] = ${dp[amount]} → return ${r}`, { views: V({ [amount]: 'found' }), vars: vars(), ret: String(r) });
      return steps;
    },
  };

  // ================= LC 300 Longest Increasing Subsequence =================
  VIZ.defs[300] = {
    title: 'LIS (Tabulation O(n²))', label: 'DP O(n²)',
    ap: 2,
    inputs: [{ key: 'nums', label: 'nums', def: '10, 9, 2, 5, 3, 7, 101, 18' }],
    check: ({ nums }) => (nums.length >= 1 && nums.length <= 14 ? '' : '1..14 numbers daalo (visualizer ke liye).'),
    run({ nums }) {
      const n = nums.length, dp = Array(n).fill(0);
      let best = 1;
      const { steps, s } = recorder(() => ({}));
      const V = hl => {
        const h = {};
        Object.keys(hl || {}).forEach(k => { h[k] = hl[k]; });
        return [{ type: 'table', label: 'nums + dp[i] (i pe khatam LIS)', rows: [nums.map(String), dp.map(v => (v ? String(v) : ''))], rowLabels: ['nums', 'dp'], colLabels: cols(n).map(x => 'i=' + x), hl: h }];
      };
      const vars = extra => Object.assign({ n: String(n), best: String(best), dp: arrStr('int', dp) }, extra || {});
      s(2, `n = ${n}, best = 1`, { views: V(), vars: { n: String(n), best: String(best) } });
      s(3, `dp = new int[${n}]`, { views: V(), vars: vars() });
      for (let i = 0; i < n; i++) {
        s(4, `i = ${i} (nums[${i}] = ${nums[i]})`, { views: V({ ['0,' + i]: 'cur' }), vars: vars({ i: String(i) }) });
        dp[i] = 1;
        s(5, `dp[${i}] = 1 — akela ${nums[i]} bhi ek LIS hai`, { views: V({ ['0,' + i]: 'cur', ['1,' + i]: 'new' }), vars: vars({ i: String(i) }) });
        for (let j = 0; j < i; j++) {
          if (nums[j] < nums[i]) {
            const old = dp[i];
            dp[i] = Math.max(dp[i], dp[j] + 1);
            s(8, `nums[${j}] = ${nums[j]} < ${nums[i]} ✓ → dp[${i}] = max(${old}, dp[${j}] + 1 = ${dp[j] + 1}) = ${dp[i]}`, { views: V({ ['0,' + i]: 'cur', ['0,' + j]: 'win', ['1,' + j]: 'win', ['1,' + i]: 'new' }), vars: vars({ i: String(i), j: String(j) }) });
          } else {
            s(7, `nums[${j}] = ${nums[j]} ≥ ${nums[i]} → ${nums[i]} isse extend nahi kar sakta`, { views: V({ ['0,' + i]: 'cur', ['0,' + j]: 'skip' }), vars: vars({ i: String(i), j: String(j) }) });
          }
        }
        best = Math.max(best, dp[i]);
        s(11, `best = max(best, dp[${i}] = ${dp[i]}) = ${best}`, { views: V({ ['1,' + i]: 'done' }), vars: vars({ i: String(i) }) });
      }
      const h = {};
      dp.forEach((v, i) => { if (v === best) h['1,' + i] = 'found'; });
      s(13, `return best = ${best} (max of dp, dp[n−1] nahi!)`, { views: V(h), vars: vars(), ret: String(best) });
      return steps;
    },
    variants: [
      {
        label: 'Binary Search O(n log n)', title: 'LIS (tails + binary search)', ap: 3,
        check: ({ nums }) => (nums.length >= 1 && nums.length <= 30 ? '' : '1..30 numbers daalo.'),
        run({ nums }) {
          const tails = Array(nums.length).fill(0);
          let size = 0;
          const { steps, s } = recorder(() => ({}));
          const V = (hl, nhl, ptr) => [
            { type: 'array', label: 'nums', vals: nums, hl: nhl || {} },
            { type: 'array', label: `tails (sirf pehle size = ${size} valid)`, vals: tails.map((v, i) => (i < size ? v : '')), hl: hl || {}, ptr: ptr || [] },
          ];
          const vars = extra => Object.assign({ tails: arrStr('int', tails), size: String(size) }, extra || {});
          s(2, `tails = new int[${nums.length}]`, { views: V(), vars: { tails: arrStr('int', tails) } });
          s(3, 'size = 0', { views: V(), vars: vars() });
          nums.forEach((x, k) => {
            s(4, `x = nums[${k}] = ${x}`, { views: V({}, { [k]: 'cur' }), vars: vars({ x: String(x) }) });
            let lo = 0, hi = size;
            s(5, `lo = 0, hi = size = ${size} — tails[0..${size - 1}] me pehla ≥ ${x} dhundo`, { views: V({}, { [k]: 'cur' }, [{ i: lo, label: 'lo' }, { i: hi, label: 'hi' }]), vars: vars({ x: String(x), lo: String(lo), hi: String(hi) }) });
            while (lo < hi) {
              const mid = Math.floor((lo + hi) / 2);
              s(7, `mid = (${lo} + ${hi}) / 2 = ${mid}, tails[mid] = ${tails[mid]}`, { views: V({ [mid]: 'win' }, { [k]: 'cur' }, [{ i: lo, label: 'lo' }, { i: mid, label: 'mid' }, { i: hi, label: 'hi' }]), vars: vars({ x: String(x), lo: String(lo), hi: String(hi), mid: String(mid) }) });
              if (tails[mid] < x) { lo = mid + 1; s(8, `${tails[mid]} < ${x} → lo = ${lo}`, { views: V({ [mid]: 'skip' }, { [k]: 'cur' }, [{ i: lo, label: 'lo' }, { i: hi, label: 'hi' }]), vars: vars({ x: String(x), lo: String(lo), hi: String(hi), mid: String(mid) }) }); }
              else { hi = mid; s(9, `${tails[mid]} ≥ ${x} → hi = ${hi}`, { views: V({ [mid]: 'win' }, { [k]: 'cur' }, [{ i: lo, label: 'lo' }, { i: hi, label: 'hi' }]), vars: vars({ x: String(x), lo: String(lo), hi: String(hi), mid: String(mid) }) }); }
            }
            const old = lo < size ? tails[lo] : null;
            tails[lo] = x;
            s(11, old === null ? `tails[${lo}] = ${x} (end me — naya length)` : `tails[${lo}] = ${x} (${old} ko replace: chhota tail future ke liye better)`, { views: V({ [lo]: 'new' }, { [k]: 'cur' }), vars: vars({ x: String(x), lo: String(lo), hi: String(hi) }) });
            if (lo === size) {
              size++;
              s(12, `lo == size → size++ = ${size}`, { views: V({ [lo]: 'new' }, { [k]: 'cur' }), vars: vars({ x: String(x), lo: String(lo), hi: String(hi) }) });
            }
          });
          s(14, `return size = ${size}`, { views: V(allHl(size, 'found')), vars: vars(), ret: String(size) });
          return steps;
        },
      },
    ],
  };

  // ================= LC 1143 Longest Common Subsequence =================
  VIZ.defs[1143] = {
    title: 'Longest Common Subsequence (2D Tabulation)', label: '2D Tabulation',
    ap: 2,
    inputs: [{ key: 'text1', label: 'text1', type: 'str', def: 'abcde' }, { key: 'text2', label: 'text2', type: 'str', def: 'ace' }],
    check: ({ text1, text2 }) => (text1.length >= 1 && text2.length >= 1 && text1.length * text2.length <= 120 ? '' : 'Dono non-empty, aur length1 × length2 ≤ 120 rakho.'),
    run({ text1, text2 }) {
      const m = text1.length, n = text2.length;
      const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
      const { steps, s } = recorder(() => ({}));
      const V = hl => [{ type: 'table', label: 'dp[i][j] (rows = text1, cols = text2)', rows: dp.map(r => r.map(String)), rowLabels: ['""'].concat(text1.split('').map((c, i) => `${i + 1}:${c}`)), colLabels: ['""'].concat(text2.split('').map((c, j) => `${j + 1}:${c}`)), hl: hl || {} }];
      const vars = extra => Object.assign({ text1: `"${text1}"`, text2: `"${text2}"`, m: String(m), n: String(n) }, extra || {});
      s(2, `m = ${m}, n = ${n}`, { views: V(), vars: vars() });
      const zero = {};
      for (let j = 0; j <= n; j++) zero['0,' + j] = 'done';
      for (let i = 0; i <= m; i++) zero[i + ',0'] = 'done';
      s(3, `dp = new int[${m + 1}][${n + 1}] — row 0 aur col 0 = empty string = 0`, { views: V(zero), vars: vars({ dp: `int[${m + 1}][${n + 1}]` }) });
      for (let i = 1; i <= m; i++) {
        s(4, `i = ${i} → text1[${i - 1}] = '${text1[i - 1]}'`, { views: V(), vars: vars({ i: String(i) }) });
        for (let j = 1; j <= n; j++) {
          const a = text1[i - 1], b = text2[j - 1];
          const v = extra => vars(Object.assign({ i: String(i), j: String(j), 'text1.charAt(i-1)': `'${a}'`, 'text2.charAt(j-1)': `'${b}'` }, extra || {}));
          if (a === b) {
            s(6, `'${a}' == '${b}' ✓ match`, { views: V({ [(i - 1) + ',' + (j - 1)]: 'win', [i + ',' + j]: 'cur' }), vars: v() });
            dp[i][j] = dp[i - 1][j - 1] + 1;
            s(7, `dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]} (diagonal + 1)`, { views: V({ [(i - 1) + ',' + (j - 1)]: 'win', [i + ',' + j]: 'new' }), vars: v() });
          } else {
            s(6, `'${a}' != '${b}' → mismatch`, { views: V({ [i + ',' + j]: 'cur' }), vars: v() });
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            s(9, `dp[${i}][${j}] = max(upar ${dp[i - 1][j]}, left ${dp[i][j - 1]}) = ${dp[i][j]}`, { views: V({ [(i - 1) + ',' + j]: 'win', [i + ',' + (j - 1)]: 'win', [i + ',' + j]: 'new' }), vars: v() });
          }
        }
      }
      s(13, `return dp[${m}][${n}] = ${dp[m][n]}`, { views: V({ [m + ',' + n]: 'found' }), vars: vars(), ret: String(dp[m][n]) });
      return steps;
    },
    variants: [
      {
        label: 'Space O(n)', title: 'LCS (2 rows: prev + cur)', ap: 3,
        run({ text1, text2 }) {
          const m = text1.length, n = text2.length;
          let prev = Array(n + 1).fill(0), cur = Array(n + 1).fill(0);
          const { steps, s } = recorder(() => ({}));
          const colL = ['""'].concat(text2.split('').map((c, j) => `${j + 1}:${c}`));
          const V = (hl, i) => [{ type: 'table', label: `prev = row ${i === undefined ? 0 : i - 1}, cur = row ${i === undefined ? '?' : i}`, rows: [prev.map(String), cur.map(String)], rowLabels: ['prev', 'cur'], colLabels: colL, hl: hl || {} }];
          const vars = extra => Object.assign({ m: String(m), n: String(n), prev: arrStr('int', prev), cur: arrStr('int', cur) }, extra || {});
          s(2, `m = ${m}, n = ${n}`, { views: V(), vars: { m: String(m), n: String(n) } });
          s(3, `prev, cur = new int[${n + 1}] — sirf 2 rows`, { views: V(), vars: vars() });
          for (let i = 1; i <= m; i++) {
            s(4, `i = ${i} → text1[${i - 1}] = '${text1[i - 1]}'`, { views: V({}, i), vars: vars({ i: String(i) }) });
            for (let j = 1; j <= n; j++) {
              const a = text1[i - 1], b = text2[j - 1];
              if (a === b) {
                cur[j] = prev[j - 1] + 1;
                s(6, `'${a}' == '${b}' → cur[${j}] = prev[${j - 1}] + 1 = ${cur[j]}`, { views: V({ ['0,' + (j - 1)]: 'win', ['1,' + j]: 'new' }, i), vars: vars({ i: String(i), j: String(j) }) });
              } else {
                cur[j] = Math.max(prev[j], cur[j - 1]);
                s(7, `'${a}' != '${b}' → cur[${j}] = max(prev[${j}] = ${prev[j]}, cur[${j - 1}] = ${cur[j - 1]}) = ${cur[j]}`, { views: V({ ['0,' + j]: 'win', ['1,' + (j - 1)]: 'win', ['1,' + j]: 'new' }, i), vars: vars({ i: String(i), j: String(j) }) });
              }
            }
            const t = prev; prev = cur; cur = t;
            s(9, `swap → prev = row ${i} ban gaya (cur me purana data, overwrite hoga)`, { views: V({ '0,0': 'done' }, i + 1), vars: vars({ i: String(i) }) });
          }
          s(11, `return prev[${n}] = ${prev[n]}`, { views: V({ ['0,' + n]: 'found' }, m + 1), vars: vars(), ret: String(prev[n]) });
          return steps;
        },
      },
    ],
  };

  // ================= LC 518 Coin Change II =================
  VIZ.defs[518] = {
    title: 'Coin Change II (1D, coin loop bahar)', label: '1D',
    ap: 3,
    inputs: [{ key: 'amount', label: 'amount', type: 'num', def: '5' }, { key: 'coins', label: 'coins', def: '1, 2, 5' }],
    check: ({ coins, amount }) => (coins.length && coins.every(c => c > 0) && amount >= 0 && amount <= 40 ? '' : 'coins positive, amount 0..40 rakho (visualizer ke liye).'),
    run({ amount, coins }) {
      const dp = Array(amount + 1).fill(0);
      const { steps, s } = recorder(() => ({}));
      const V = (hl, chl) => [
        { type: 'array', label: 'coins', vals: coins, hl: chl || {} },
        row1('dp[a] = amount a banane ke tarike', dp, hl, cols(amount + 1).map(x => 'a=' + x)),
      ];
      const vars = extra => Object.assign({ amount: String(amount), coins: arrStr('int', coins), dp: arrStr('int', dp) }, extra || {});
      s(2, `dp = new int[${amount + 1}]`, { views: V(), vars: vars() });
      dp[0] = 1;
      s(3, 'dp[0] = 1 — amount 0: koi coin mat lo = 1 tarika', { views: V({ 0: 'new' }), vars: vars() });
      coins.forEach((c, ci) => {
        s(4, `c = ${c} — ab sirf coins[0..${ci}] use karke tarike gine jaayenge`, { views: V({}, { [ci]: 'cur' }), vars: vars({ c: String(c) }) });
        for (let a = c; a <= amount; a++) {
          const old = dp[a];
          dp[a] += dp[a - c];
          s(6, `dp[${a}] += dp[${a} − ${c}] → ${old} + ${dp[a - c]} = ${dp[a]}`, { views: V({ [a - c]: 'win', [a]: 'new' }, { [ci]: 'cur' }), vars: vars({ c: String(c), a: String(a) }) });
        }
        if (c > amount) s(5, `c = ${c} > amount → inner loop nahi chala`, { views: V({}, { [ci]: 'skip' }), vars: vars({ c: String(c) }) });
      });
      s(9, `return dp[${amount}] = ${dp[amount]}`, { views: V({ [amount]: 'found' }), vars: vars(), ret: String(dp[amount]) });
      return steps;
    },
    variants: [
      {
        label: '2D table', title: 'Coin Change II (2D dp[i][a])', ap: 2,
        run({ amount, coins }) {
          const n = coins.length;
          const dp = Array.from({ length: n + 1 }, () => Array(amount + 1).fill(0));
          const { steps, s } = recorder(() => ({}));
          const V = hl => [{ type: 'table', label: 'dp[i][a] = pehle i coins se amount a', rows: dp.map(r => r.map(String)), rowLabels: ['0 coins'].concat(coins.map((c, i) => `i=${i + 1} (+${c})`)), colLabels: cols(amount + 1).map(x => 'a=' + x), hl: hl || {} }];
          const vars = extra => Object.assign({ amount: String(amount), coins: arrStr('int', coins), n: String(n) }, extra || {});
          s(2, `n = ${n}`, { views: V(), vars: vars() });
          s(3, `dp = new int[${n + 1}][${amount + 1}]`, { views: V(), vars: vars() });
          const col0 = {};
          for (let i = 0; i <= n; i++) { dp[i][0] = 1; col0[i + ',0'] = 'new'; }
          s(4, 'Har row me dp[i][0] = 1 (amount 0 = kuch mat lo)', { views: V(col0), vars: vars() });
          for (let i = 1; i <= n; i++) {
            const c = coins[i - 1];
            s(5, `i = ${i} → coin ${c} bhi allowed`, { views: V(), vars: vars({ i: String(i) }) });
            for (let a = 1; a <= amount; a++) {
              dp[i][a] = dp[i - 1][a];
              s(7, `dp[${i}][${a}] = dp[${i - 1}][${a}] = ${dp[i][a]} (coin ${c} nahi liya)`, { views: V({ [(i - 1) + ',' + a]: 'win', [i + ',' + a]: 'new' }), vars: vars({ i: String(i), a: String(a) }) });
              if (c <= a) {
                dp[i][a] += dp[i][a - c];
                s(8, `+ dp[${i}][${a - c}] = ${dp[i][a - c]} (coin ${c} liya, same row) → ${dp[i][a]}`, { views: V({ [i + ',' + (a - c)]: 'win', [(i - 1) + ',' + a]: 'win', [i + ',' + a]: 'new' }), vars: vars({ i: String(i), a: String(a) }) });
              }
            }
          }
          s(11, `return dp[${n}][${amount}] = ${dp[n][amount]}`, { views: V({ [n + ',' + amount]: 'found' }), vars: vars(), ret: String(dp[n][amount]) });
          return steps;
        },
      },
    ],
  };

  // ================= LC 139 Word Break =================
  const cutText = (s, j, i) => `${s.slice(0, j)} [${s.slice(j, i)}] ${s.slice(i)}`.trim();
  VIZ.defs[139] = {
    title: 'Word Break (Tabulation)', label: 'Tabulation',
    ap: 2,
    inputs: [{ key: 's', label: 's', type: 'str', def: 'leetcode' }, { key: 'wordDict', label: 'wordDict (JSON list)', type: 'json', def: '["leet","code"]' }],
    check: ({ s, wordDict }) => (s.length >= 1 && s.length <= 20 && Array.isArray(wordDict) ? '' : 's 1..20 chars aur wordDict JSON list ho.'),
    run({ s: str, wordDict }) {
      const dict = new Set(wordDict), n = str.length, dp = Array(n + 1).fill(false);
      const { steps, s } = recorder(() => ({}));
      const V = (hl, text, sethl) => [
        { type: 'text', label: 's (cut dekho: [j..i) )', value: text || str },
        row1('dp[i] = pehle i chars toot sakte?', dp.map(b => (b ? 'T' : 'F')), hl, cols(n + 1).map(x => 'i=' + x)),
        { type: 'set', label: 'HashSet dict', items: [...dict], hl: sethl },
      ];
      const vars = extra => Object.assign({ s: `"${str}"`, n: String(n), dp: `boolean[${n + 1}] [${dp.join(', ')}]` }, extra || {});
      s(2, `dict = HashSet {${[...dict].join(', ')}} — O(1) lookup`, { views: V(), vars: { s: `"${str}"` } });
      s(3, `n = ${n}`, { views: V(), vars: { s: `"${str}"`, n: String(n) } });
      s(4, `dp = new boolean[${n + 1}] — sab false`, { views: V(), vars: vars() });
      dp[0] = true;
      s(5, 'dp[0] = true — empty prefix hamesha valid', { views: V({ 0: 'new' }), vars: vars() });
      for (let i = 1; i <= n; i++) {
        s(6, `i = ${i} → prefix "${str.slice(0, i)}"`, { views: V({ [i]: 'cur' }), vars: vars({ i: String(i) }) });
        for (let j = 0; j < i; j++) {
          const w = str.slice(j, i);
          if (!dp[j]) {
            s(8, `j = ${j}: dp[${j}] = false → yahan cut bekaar`, { views: V({ [j]: 'skip', [i]: 'cur' }, cutText(str, j, i)), vars: vars({ i: String(i), j: String(j) }) });
            continue;
          }
          const ok = dict.has(w);
          s(8, `j = ${j}: dp[${j}] = true, s.substring(${j}, ${i}) = "${w}" → ${ok ? 'dict me hai ✓' : 'dict me nahi'}`, { views: V({ [j]: 'win', [i]: 'cur' }, cutText(str, j, i), ok ? w : undefined), vars: vars({ i: String(i), j: String(j) }) });
          if (ok) {
            dp[i] = true;
            s(9, `dp[${i}] = true ("${str.slice(0, j)}" + "${w}")`, { views: V({ [j]: 'win', [i]: 'new' }, cutText(str, j, i), w), vars: vars({ i: String(i), j: String(j) }) });
            s(10, 'break — ek valid cut kaafi hai', { views: V({ [i]: 'new' }, cutText(str, j, i)), vars: vars({ i: String(i), j: String(j) }) });
            break;
          }
        }
      }
      s(14, `return dp[${n}] = ${dp[n]}`, { views: V({ [n]: 'found' }), vars: vars(), ret: String(dp[n]) });
      return steps;
    },
    variants: [
      {
        label: 'Memoization', title: 'Word Break (recursion + Boolean[] memo)', ap: 1,
        run({ s: str, wordDict }) {
          const dict = new Set(wordDict), n = str.length, memo = Array(n).fill(null);
          const stack = [];
          const { steps, s } = recorder(() => ({}));
          const show = () => memo.map(v => (v === null ? 'null' : v ? 'T' : 'F'));
          const V = (hl, text) => [
            { type: 'text', label: 's', value: text || str },
            row1('memo[start] (null = abhi nahi pata)', show(), hl, cols(n).map(x => 'start=' + x), 'memo'),
          ];
          const frames = () => stack.slice().reverse().map(f => ({ method: f.m, args: f.args, line: f.line, vars: f.vars() }));
          function rec(start) {
            const fr = { m: 'canBreak', args: 'start=' + start, line: 6, vars: () => ({ start: String(start), memo: `Boolean[${n}] [${show().join(', ')}]` }) };
            stack.push(fr);
            if (start === n) {
              s(6, `start == ${n} → poori string toot gayi → true`, { views: V(), frames: frames() });
              stack.pop(); return true;
            }
            if (memo[start] !== null) {
              fr.line = 7;
              s(7, `memo[${start}] = ${memo[start]} already pata → seedha return`, { views: V({ [start]: 'win' }), frames: frames() });
              stack.pop(); return memo[start];
            }
            for (let end = start + 1; end <= n; end++) {
              const w = str.slice(start, end);
              fr.line = 9;
              const ok = dict.has(w);
              s(9, `canBreak(${start}): "${w}" ${ok ? 'dict me hai → baaki string check karo' : 'dict me nahi'}`, { views: V({ [start]: 'cur' }, cutText(str, start, end)), frames: frames() });
              if (ok && rec(end)) {
                memo[start] = true; fr.line = 10;
                s(10, `memo[${start}] = true → return true`, { views: V({ [start]: 'new' }), frames: frames() });
                stack.pop(); return true;
              }
              if (steps.length > 560) break;
            }
            memo[start] = false; fr.line = 13;
            s(13, `start = ${start} se koi split nahi → memo[${start}] = false`, { views: V({ [start]: 'new' }), frames: frames() });
            stack.pop(); return false;
          }
          stack.push({ m: 'wordBreak', args: `s="${str}"`, line: 2, vars: () => ({ s: `"${str}"` }) });
          const r = rec(0);
          stack.length = 0;
          s(2, `return ${r}`, { views: V(), frames: [{ method: 'wordBreak', args: `s="${str}"`, line: 2, vars: { s: `"${str}"` } }], ret: String(r) });
          return steps;
        },
      },
    ],
  };
})();
