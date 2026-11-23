// Planner lessons ke liye chhote helpers (browser + tools/validate-lessons.js dono me load hota hai).
// Visualizer step format = dsa-visual ka "views" format: { line, note, views: [...], vars: {...}, ret? }
(function () {
  const MAX = 600;
  const iA = a => '[' + a.map(v => (v === null || v === undefined ? '_' : v)).join(', ') + ']';
  const rng = (a, b, cls, base) => { const o = Object.assign({}, base); for (let i = a; i <= b; i++) if (!o[i]) o[i] = cls; return o; };
  const A = (label, vals, hl, ptr) => ({ type: 'array', label, vals: vals.map(v => (v === null || v === undefined ? '' : v)), hl: hl || {}, ptr: ptr || [] });
  const M = (label, m, hl) => { const o = {}; (m instanceof Map ? m : new Map(Object.entries(m))).forEach((v, k) => { o[k] = v; }); return { type: 'map', label, entries: o, hl }; };
  const S = (label, items, hl) => ({ type: 'set', label, items: [...items], hl });
  const X = (label, value) => ({ type: 'text', label, value: String(value) });
  // Linked list: nodes = [{id, val, next: id|null}] (dikhane ke order me), ptr = [{id, label}] (jaise head / prev / curr)
  const LL = (label, nodes, hl, ptr) => ({ type: 'list', label, nodes: nodes.map(n => ({ id: n.id, val: n.val, next: n.next === undefined ? null : n.next })), hl: hl || {}, ptr: ptr || [] });
  // Stack: items bottom → top (last = top) · Queue: items front → back
  const ST = (label, items, hl) => ({ type: 'stack', label, items: [...items], hl: hl || {} });
  const Q = (label, items, hl) => ({ type: 'queue', label, items: [...items], hl: hl || {} });
  // Java jaisa string: 1 -> 2 -> 3 -> null
  const llStr = (nodes, headId) => { const by = {}; nodes.forEach(n => { by[n.id] = n; }); const out = []; let c = headId, guard = 0; while (c !== null && c !== undefined && by[c] && guard++ < 100) { out.push(by[c].val); c = by[c].next; } return out.join(' -> ') + (out.length ? ' -> null' : 'null'); };
  const mapStr = (m, kind) => (kind || 'HashMap') + ' size=' + m.size + ' {' + [...m].map(([k, v]) => k + '=' + v).join(', ') + '}';
  const setStr = (s, kind) => (kind || 'HashSet') + ' size=' + s.size + ' [' + [...s].join(', ') + ']';

  // code me snippet wali line dhoondo. snip = 'text' | ['text', k] (k-th occurrence) | number
  function finder(code) {
    const lines = code.split('\n');
    return snip => {
      if (typeof snip === 'number') return snip;
      let s = snip, k = 1;
      if (Array.isArray(snip)) { s = snip[0]; k = snip[1]; }
      for (let i = 0; i < lines.length; i++) if (lines[i].includes(s) && --k === 0) return i + 1;
      throw new Error('line nahi mili: ' + JSON.stringify(snip));
    };
  }
  // tracer(code, render) → { st(snip, note, o), steps }. render(o) → { views, vars } har step pe current state se.
  function tracer(code, render) {
    const find = finder(code), steps = [];
    const st = (snip, note, o) => {
      if (steps.length >= MAX) return;
      const r = render(o || {});
      steps.push(Object.assign({ line: find(snip), note }, r, o && o.ret !== undefined ? { ret: o.ret } : {}));
    };
    return { st, steps };
  }
  // Recursion ke liye call stack: push(method, args, locFn) / pop() / frames() → engine ka CALL STACK + 🌳 call tree.
  // render me { views, vars: <top frame ke vars>, frames: cs.frames() } lautao. locFn() = us frame ke current locals.
  function callStack() {
    const st = [];
    return {
      push(method, args, loc) { st.push({ method, args: String(args), loc: loc || (() => ({})) }); },
      pop() { st.pop(); },
      depth() { return st.length; },
      top() { return st[st.length - 1]; },
      frames(line) {
        if (st.length && line) st[st.length - 1].line = line;
        return st.slice().reverse().map(f => ({ method: f.method, args: f.args, line: f.line || 0, vars: f.loc() }));
      },
    };
  }
  window.PLAN_KIT = { MAX, iA, rng, A, M, S, X, LL, ST, Q, llStr, mapStr, setStr, finder, tracer, callStack };
})();
