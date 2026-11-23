// Phase 5 — Stack + Queue visualizers (Week 7 + Week 8, strict LINE-BY-LINE debugger, 2026-11-23).
// Line numbers = PHASE_CONTENT['stack-queue'].questions[n].approaches[ap].code (snippet se dhoondhte hain).
// Design problems (232, 225, 155, 622): input = LeetCode style ops + args (JSON), output = results array string.
(function () {
  const MAXS = (VIZ.util.MAX_STEPS || 600) - 5;

  // =====================================================================
  // WEEK 7 (strict) — LINE-BY-LINE debugger (2026-11-23). Har executable line ek step.
  // Design problems: fixed ops + args sequence; CALL STACK me method frames (nested call jaise
  // top() → pop(), enQueue() → isFull() bhi), VARIABLES = fields + us frame ke locals.
  // Shared helpers VIZ.p5 pe — viz/phase-05x.js (Brute / Better tabs) bhi yahi use karta hai.
  // =====================================================================
  const Q5 = n => window.PHASE_CONTENT['stack-queue'].questions[n];
  const lineFinder = (n, ap) => {
    const code = Q5(n).approaches[ap].code.split('\n');
    return (snip, k) => {
      let c = k || 1;
      for (let i = 0; i < code.length; i++) if (code[i].includes(snip) && --c === 0) return i + 1;
      throw new Error('LC ' + n + ' ap' + ap + ' line nahi mili: ' + snip);
    };
  };
  const dq = a => 'ArrayDeque size=' + a.length + ' [' + a.slice().reverse().join(', ') + ']';      // stack: Java toString top first
  const qs = (a, kind) => (kind || 'LinkedList') + ' size=' + a.length + ' [' + a.join(', ') + ']'; // queue: front first
  const ia = a => 'int[' + a.length + '] [' + a.join(', ') + ']';
  const SV = (label, items, hl) => ({ type: 'stack', label, items: items.slice(), hl: hl || {} });
  const QV = (label, items, hl) => ({ type: 'queue', label, items: items.slice(), hl: hl || {} });
  const AV = (label, vals, hl, ptr) => ({ type: 'array', label, vals: vals.slice(), hl: hl || {}, ptr: ptr || [] });
  const tHl = (a, cls) => (a && a.length ? { [a.length - 1]: cls } : {});
  const opsInputs = (ops, args) => [
    { key: 'ops', label: 'operations (JSON)', type: 'json', def: ops },
    { key: 'args', label: 'arguments (JSON)', type: 'json', def: args },
  ];

  // Method tracer (LC 20 jaise): render(o) → { views, vars }
  function tracer(n, ap, render) {
    const ln = lineFinder(n, ap), steps = [];
    const st = (snip, note, o) => {
      o = o || {};
      if (steps.length >= MAXS) return;
      const r = render(o);
      steps.push(Object.assign({ line: typeof snip === 'number' ? snip : ln(snip), note, views: r.views, vars: r.vars }, o.ret !== undefined ? { ret: o.ret } : {}));
    };
    const end = (snip, note, ret, o) => { if (steps.length >= MAXS) steps.length = MAXS - 1; st(snip, note, Object.assign({}, o, { ret })); return steps; };
    return { st, end, ln, steps };
  }

  // Class tracer: cfg.fields() → {field: value string}, cfg.views(o) → [views]
  function designTracer(n, ap, cfg) {
    const ln = lineFinder(n, ap), steps = [], stack = [], res = [];
    let ops = [], args = [], k = -1;
    const callName = i => (i === 0 ? 'new ' + ops[0] : ops[i]) + '(' + (args[i] || []).join(', ') + ')';
    const snap = (line, note, o) => {
      o = o || {};
      if (steps.length >= MAXS) return;
      const fv = cfg.fields();
      const frames = stack.slice().reverse().map((f, i) => Object.assign({ method: f.method, args: f.args, vars: Object.assign({}, fv, f.locals) }, i ? { line: f.line } : {}));
      const views = [AV('calls (LeetCode sequence)', ops.map((x, i) => callName(i)), k >= 0 ? { [k]: 'cur' } : {})]
        .concat(cfg.views(o), [AV('output (har call ka return)', res, res.length ? { [res.length - 1]: 'new' } : {})]);
      const step = { line, note, views, frames };
      if (!frames.length) step.vars = Object.assign(fv, { output: '[' + res.join(',') + ']' });
      if (o.ret !== undefined) step.ret = o.ret;
      steps.push(step);
    };
    const st = (snip, note, o) => { const line = typeof snip === 'number' ? snip : ln(snip); if (stack.length) stack[stack.length - 1].line = line; snap(line, note, o); };
    const call = (method, argStr, locals, fn) => {
      stack.push({ method, args: argStr, locals: locals || {}, line: 0 });
      try { return fn(stack[stack.length - 1].locals); } finally { stack.pop(); }
    };
    const go = (inp, impl) => {
      ops = inp.ops || []; args = inp.args || [];
      ops.forEach((op, i) => { k = i; const r = impl(op, args[i] || [], i); res.push(r === undefined || r === null ? 'null' : String(r)); });
      if (steps.length >= MAXS) steps.length = MAXS - 1;
      const out = '[' + res.join(',') + ']';
      snap(steps.length ? steps[steps.length - 1].line : 1, 'Saare calls khatam — output = ' + out, { ret: out });
      return steps;
    };
    return { st, call, go, ln, steps };
  }
  VIZ.p5 = { Q5, lineFinder, tracer, designTracer, dq, qs, ia, SV, QV, AV, tHl, opsInputs, MAXS };

  // =====================================================================
  // LC 20 — Valid Parentheses (Optimal: stack)
  // =====================================================================
  VIZ.defs[20] = {
    title: 'Valid Parentheses (Stack: push opening, closing pe peek + match)', label: 'Stack', ap: 1,
    inputs: [{ key: 's', label: 's (sirf ()[]{})', type: 'str', def: '{[()]}' }],
    run({ s }) {
      s = String(s).replace(/\s+/g, '');
      const chars = s.split(''), stk = [];
      let i = -1, ch, top, made = false;
      const tr = tracer(20, 1, o => ({
        views: [
          AV('s', chars.length ? chars : ['(empty)'], o.ah || (i >= 0 && i < chars.length ? { [i]: 'cur' } : {}), i >= 0 && i < chars.length ? [{ i, label: 'ch' }] : []),
          SV('stack (pending openings)', stk, o.sh),
        ],
        vars: Object.assign({ s: '"' + s + '"' }, made ? { stack: dq(stk) } : {}, ch !== undefined ? { ch: "'" + ch + "'" } : {}, top !== undefined ? { top: "'" + top + "'" } : {}),
      }));
      const pair = { ')': '(', '}': '{', ']': '[' };
      tr.st('public boolean isValid', 'Method call — s = "' + s + '"');
      made = true; tr.st('Deque<Character> stack', 'Khaali stack — isme abhi tak band na hue opening brackets rahenge');
      for (i = 0; i < chars.length; i++) {
        ch = chars[i]; top = undefined;
        tr.st('for (char ch', "ch = '" + ch + "' (index " + i + ')');
        const open = ch === '(' || ch === '{' || ch === '[';
        tr.st("if (ch == '('", open ? "'" + ch + "' opening hai → push" : "'" + ch + "' closing hai → else");
        if (open) {
          stk.push(ch);
          tr.st('stack.push(ch)', "push '" + ch + "' — iska closing baad me aana chahiye", { sh: tHl(stk, 'new') });
          continue;
        }
        if (!stk.length) return tr.end('if (stack.isEmpty())', 'Stack khaali — closing ka koi opening nahi → return false', 'false');
        tr.st('if (stack.isEmpty())', 'Stack khaali nahi → top dekho');
        top = stk[stk.length - 1];
        tr.st('char top = stack.peek()', "peek → top = '" + top + "' (sabse recent unmatched opening; remove nahi kiya)", { sh: tHl(stk, 'cur') });
        if (pair[ch] !== top) return tr.end('return false;', "'" + ch + "' ko '" + pair[ch] + "' chahiye tha, top '" + top + "' hai → mismatch → return false", 'false', { sh: tHl(stk, 'skip') });
        tr.st("if ((ch == ')'", "'" + top + ch + "' match ✓ → pop", { sh: tHl(stk, 'found') });
        stk.pop();
        tr.st('stack.pop()', "pop '" + top + "' — ye pair complete", { ah: { [i]: 'found' } });
      }
      ch = undefined; top = undefined;
      tr.st('for (char ch', 'Saare characters ho gaye → loop khatam');
      const ok = stk.length === 0;
      return tr.end('return stack.isEmpty()', ok ? 'Stack khaali → har opening band hua → return true' : 'Stack me ' + stk.length + ' opening bache (kabhi band nahi hue) → return false', String(ok));
    },
  };

  // =====================================================================
  // LC 232 — Implement Queue using Stacks (Optimal: in/out, amortized)
  // =====================================================================
  function run232opt(inp) {
    let inS = null, outS = null;
    const T = designTracer(232, 1, {
      fields: () => ({ in: inS ? dq(inS) : 'null', out: outS ? dq(outS) : 'null' }),
      views: o => [SV('in (push yahan)', inS || [], o.hi), SV('out (pop/peek yahan se)', outS || [], o.ho), QV('logical queue (front → back)', (outS || []).slice().reverse().concat(inS || []))],
    });
    const peek = () => T.call('peek', '', {}, () => {
      T.st('public int peek()', 'peek() — front element chahiye');
      if (!outS.length) {
        T.st('if (out.isEmpty())', 'out khaali hai → in ke saare elements out me transfer');
        while (inS.length) {
          const x = inS.pop(); outS.push(x);
          T.st('while (!in.isEmpty())', 'in khaali nahi → in.pop() = ' + x + ' → out.push(' + x + ') (order ulta ho raha hai)', { ho: tHl(outS, 'new') });
        }
        T.st('while (!in.isEmpty())', 'in khaali → transfer complete. Sabse purana element ab out ke top pe', { ho: tHl(outS, 'found') });
      } else T.st('if (out.isEmpty())', 'out khaali nahi (top = ' + outS[outS.length - 1] + ') → transfer NAHI — yahi amortized trick hai', { ho: tHl(outS, 'cur') });
      const r = outS[outS.length - 1];
      T.st('return out.peek()', 'return out.peek() = ' + r, { ho: tHl(outS, 'found') });
      return r;
    });
    return T.go(inp, (op, a) => {
      if (op === 'MyQueue') return T.call('MyQueue', '', {}, () => {
        T.st('public MyQueue()', 'new MyQueue() — constructor (fields initialize honge)');
        inS = []; T.st('private Deque<Integer> in', 'in = khaali stack (push yahan)');
        outS = []; T.st('private Deque<Integer> out', 'out = khaali stack (pop/peek yahan se)');
      });
      if (op === 'push') return T.call('push', 'x=' + a[0], { x: String(a[0]) }, () => {
        T.st('public void push(int x)', 'push(' + a[0] + ')');
        inS.push(a[0]); T.st('in.push(x)', 'in.push(' + a[0] + ') — O(1), koi transfer nahi', { hi: tHl(inS, 'new') });
      });
      if (op === 'pop') return T.call('pop', '', {}, () => {
        T.st('public int pop()', 'pop() — front nikaalna hai');
        T.st('peek();', 'Pehle peek() call — taaki out me front aa jaaye');
        peek();
        const r = outS.pop();
        T.st('return out.pop()', 'return out.pop() = ' + r + ' (queue ka front gaya)');
        return r;
      });
      if (op === 'peek') return peek();
      if (op === 'empty') return T.call('empty', '', {}, () => {
        T.st('public boolean empty()', 'empty()');
        const r = !inS.length && !outS.length;
        T.st('return in.isEmpty() && out.isEmpty()', 'Dono stacks dekho → return ' + r);
        return r;
      });
      return undefined;
    });
  }
  VIZ.defs[232] = {
    title: 'Queue using Stacks (in / out, amortized O(1))', label: 'in / out', ap: 1, method: 'MyQueue',
    inputs: opsInputs('["MyQueue","push","push","peek","pop","empty"]', '[[],[1],[2],[],[],[]]'),
    run: run232opt,
  };

  // =====================================================================
  // LC 225 — Implement Stack using Queues (Optimal: one queue, rotate on push)
  // =====================================================================
  function run225one(inp) {
    let q = null;
    const T = designTracer(225, 2, {
      fields: () => ({ queue: q ? qs(q) : 'null' }),
      views: o => [QV('queue (front = stack ka top)', q || [], o.hq)],
    });
    return T.go(inp, (op, a) => {
      if (op === 'MyStack') return T.call('MyStack', '', {}, () => {
        T.st('public MyStack()', 'new MyStack() — constructor');
        q = []; T.st('private Queue<Integer> queue', 'queue = new LinkedList<>() — sirf EK queue');
      });
      if (op === 'push') return T.call('push', 'x=' + a[0], { x: String(a[0]) }, L => {
        const x = a[0];
        T.st('public void push(int x)', 'push(' + x + ')');
        q.push(x); T.st('queue.offer(x)', 'offer(' + x + ') → abhi ' + x + ' back me hai (stack ke hisaab se galat jagah)', { hq: { [q.length - 1]: 'new' } });
        const size = q.length; L.size = String(size);
        T.st('int size = queue.size()', 'size = ' + size + ' → ' + (size - 1) + ' baar rotate karna hai');
        for (let i = 0; ; i++) {
          L.i = String(i);
          if (!(i < size - 1)) { T.st('for (int i = 0; i < size - 1; i++)', 'i = ' + i + ' < ' + (size - 1) + '? Nahi → rotation khatam. ' + x + ' front pe = stack ka top', { hq: { 0: 'found' } }); break; }
          T.st('for (int i = 0; i < size - 1; i++)', 'i = ' + i + ' < ' + (size - 1) + ' → rotate');
          const f = q.shift(); q.push(f);
          T.st('queue.offer(queue.poll())', 'front ' + f + ' poll karke back me offer → ' + JSON.stringify(q), { hq: { [q.length - 1]: 'cur' } });
        }
        delete L.i;
      });
      if (op === 'pop') return T.call('pop', '', {}, () => {
        T.st('public int pop()', 'pop()');
        const r = q.shift();
        T.st('return queue.poll()', 'poll() = ' + r + ' — front hi stack ka top tha. O(1)');
        return r;
      });
      if (op === 'top') return T.call('top', '', {}, () => {
        T.st('public int top()', 'top()');
        T.st('return queue.peek()', 'peek() = ' + q[0] + ' (remove nahi)', { hq: { 0: 'found' } });
        return q[0];
      });
      if (op === 'empty') return T.call('empty', '', {}, () => {
        T.st('public boolean empty()', 'empty()');
        T.st('return queue.isEmpty()', 'return ' + !q.length);
        return !q.length;
      });
      return undefined;
    });
  }
  VIZ.defs[225] = {
    title: 'Stack using One Queue (offer + rotate size − 1)', label: 'One queue', ap: 2, method: 'MyStack',
    inputs: opsInputs('["MyStack","push","push","top","pop","empty"]', '[[],[1],[2],[],[],[]]'),
    run: run225one,
  };

  // =====================================================================
  // LC 155 — Min Stack (Optimal: stack + minStack)
  // =====================================================================
  function run155two(inp) {
    let stk = null, mn = null;
    const T = designTracer(155, 2, {
      fields: () => ({ stack: stk ? dq(stk) : 'null', minStack: mn ? dq(mn) : 'null' }),
      views: o => [SV('stack', stk || [], o.hs), SV('minStack (top = current min)', mn || [], o.hm)],
    });
    return T.go(inp, (op, a) => {
      if (op === 'MinStack') return T.call('MinStack', '', {}, () => {
        T.st('public MinStack()', 'new MinStack() — constructor');
        stk = []; T.st('private Deque<Integer> stack', 'stack = khaali (saare values)');
        mn = []; T.st('private Deque<Integer> minStack', 'minStack = khaali (sirf minimums)');
      });
      if (op === 'push') return T.call('push', 'val=' + a[0], { val: String(a[0]) }, () => {
        const v = a[0];
        T.st('public void push(int val)', 'push(' + v + ')');
        stk.push(v); T.st('stack.push(val)', 'stack.push(' + v + ')', { hs: tHl(stk, 'new') });
        const go = !mn.length || v <= mn[mn.length - 1];
        T.st('if (minStack.isEmpty() || val <= minStack.peek())', mn.length ? v + ' <= current min ' + mn[mn.length - 1] + '? ' + (go ? 'Haan (≤ — duplicates bhi)' : 'Nahi → minStack same') : 'minStack khaali → ' + v + ' hi pehla min', { hm: tHl(mn, 'cur') });
        if (go) { mn.push(v); T.st('minStack.push(val)', 'minStack.push(' + v + ') → naya min = ' + v, { hm: tHl(mn, 'new') }); }
      });
      if (op === 'pop') return T.call('pop', '', {}, L => {
        T.st('public void pop()', 'pop()');
        const r = stk.pop(); L.removed = String(r);
        T.st('int removed = stack.pop()', 'removed = ' + r);
        const eq = r === mn[mn.length - 1];
        T.st('if (removed == minStack.peek())', r + ' == min top ' + mn[mn.length - 1] + '? ' + (eq ? 'Haan → min bhi gaya' : 'Nahi → min same'), { hm: tHl(mn, eq ? 'skip' : 'cur') });
        if (eq) { mn.pop(); T.st('minStack.pop()', 'minStack.pop() → pichla min wapas: ' + (mn.length ? mn[mn.length - 1] : '(khaali)'), { hm: tHl(mn, 'found') }); }
      });
      if (op === 'top') return T.call('top', '', {}, () => {
        T.st('public int top()', 'top()');
        const r = stk[stk.length - 1];
        T.st('return stack.peek()', 'return ' + r, { hs: tHl(stk, 'found') });
        return r;
      });
      if (op === 'getMin') return T.call('getMin', '', {}, () => {
        T.st('public int getMin()', 'getMin()');
        const r = mn[mn.length - 1];
        T.st('return minStack.peek()', 'minStack ka top = ' + r + ' — O(1), koi traverse nahi', { hm: tHl(mn, 'found') });
        return r;
      });
      return undefined;
    });
  }
  VIZ.defs[155] = {
    title: 'Min Stack (stack + auxiliary minStack)', label: 'Two stacks', ap: 2, method: 'MinStack',
    inputs: opsInputs('["MinStack","push","push","push","getMin","pop","top","getMin"]', '[[],[-2],[0],[-3],[],[],[],[]]'),
    run: run155two,
  };

  // =====================================================================
  // LC 622 — Design Circular Queue (Optimal: front + count, modulo)
  // =====================================================================
  function run622opt(inp) {
    let arr = null, front = 0, count = 0, capacity = 0;
    const live = () => { const h = {}; for (let j = 0; j < count; j++) h[(front + j) % capacity] = 'win'; return h; };
    const T = designTracer(622, 1, {
      fields: () => ({ arr: arr ? ia(arr) : 'null', front: String(front), count: String(count), capacity: String(capacity) }),
      views: o => [AV('arr (circular — window = asli elements)', arr || [], Object.assign(arr ? live() : {}, o.ha || {}),
        arr && arr.length ? [{ i: front, label: 'front' }].concat(count ? [{ i: (front + count - 1) % capacity, label: 'rear' }] : []) : [])],
    });
    const isEmpty = () => T.call('isEmpty', '', {}, () => {
      T.st('public boolean isEmpty()', 'isEmpty()');
      T.st('return count == 0', 'count = ' + count + ' → return ' + (count === 0));
      return count === 0;
    });
    const isFull = () => T.call('isFull', '', {}, () => {
      T.st('public boolean isFull()', 'isFull()');
      T.st('return count == capacity', count + ' == ' + capacity + ' → return ' + (count === capacity));
      return count === capacity;
    });
    return T.go(inp, (op, a) => {
      if (op === 'MyCircularQueue') return T.call('MyCircularQueue', 'k=' + a[0], { k: String(a[0]) }, () => {
        T.st('public MyCircularQueue(int k)', 'new MyCircularQueue(' + a[0] + ')');
        capacity = a[0]; T.st('capacity = k;', 'capacity = ' + capacity);
        arr = new Array(capacity).fill(0); T.st('arr = new int[k];', 'int[' + capacity + '] — saare 0');
        front = 0; T.st('front = 0;', 'front = 0 (pehla element yahan hoga)');
        count = 0; T.st('count = 0;', 'count = 0 → khaali');
      });
      if (op === 'enQueue') return T.call('enQueue', 'value=' + a[0], { value: String(a[0]) }, L => {
        T.st('public boolean enQueue(int value)', 'enQueue(' + a[0] + ')');
        T.st('if (isFull()) return false;', 'Pehle check: isFull()?');
        if (isFull()) { T.st('if (isFull()) return false;', 'Full hai → jagah nahi → return false'); return false; }
        T.st('if (isFull()) return false;', 'Full nahi → aage');
        const rear = (front + count) % capacity; L.rear = String(rear);
        T.st('int rear = (front + count) % capacity', 'rear = (' + front + ' + ' + count + ') % ' + capacity + ' = ' + rear + (front + count >= capacity ? ' ← wrap-around! shuru ki khaali jagah reuse' : ''), { ha: { [rear]: 'cur' } });
        arr[rear] = a[0]; T.st('arr[rear] = value', 'arr[' + rear + '] = ' + a[0], { ha: { [rear]: 'new' } });
        count++; T.st('count++', 'count = ' + count);
        T.st('return true;', 'return true');
        return true;
      });
      if (op === 'deQueue') return T.call('deQueue', '', {}, () => {
        T.st('public boolean deQueue()', 'deQueue()');
        T.st('if (isEmpty()) return false;', 'Pehle check: isEmpty()?');
        if (isEmpty()) { T.st('if (isEmpty()) return false;', 'Khaali hai → kuch hatane ko nahi → return false'); return false; }
        T.st('if (isEmpty()) return false;', 'Khaali nahi → aage', { ha: { [front]: 'skip' } });
        const old = front; front = (front + 1) % capacity;
        T.st('front = (front + 1) % capacity', 'front = (' + old + ' + 1) % ' + capacity + ' = ' + front + ' — arr[' + old + '] ab "khaali" (shift nahi kiya!)');
        count--; T.st('count--', 'count = ' + count);
        T.st('return true;', 'return true', {});
        return true;
      });
      if (op === 'Front') return T.call('Front', '', {}, () => {
        T.st('public int Front()', 'Front()');
        T.st('if (isEmpty()) return -1;', 'isEmpty()?');
        if (isEmpty()) { T.st('if (isEmpty()) return -1;', 'Khaali → return -1'); return -1; }
        T.st('if (isEmpty()) return -1;', 'Khaali nahi');
        T.st('return arr[front]', 'return arr[' + front + '] = ' + arr[front], { ha: { [front]: 'found' } });
        return arr[front];
      });
      if (op === 'Rear') return T.call('Rear', '', {}, () => {
        T.st('public int Rear()', 'Rear()');
        T.st(T.ln('if (isEmpty()) return -1;', 2), 'isEmpty()?');
        if (isEmpty()) { T.st(T.ln('if (isEmpty()) return -1;', 2), 'Khaali → return -1'); return -1; }
        T.st(T.ln('if (isEmpty()) return -1;', 2), 'Khaali nahi');
        const r = (front + count - 1) % capacity;
        T.st('return arr[(front + count - 1) % capacity]', 'index = (' + front + ' + ' + count + ' − 1) % ' + capacity + ' = ' + r + ' → return ' + arr[r], { ha: { [r]: 'found' } });
        return arr[r];
      });
      if (op === 'isEmpty') return isEmpty();
      if (op === 'isFull') return isFull();
      return undefined;
    });
  }
  VIZ.defs[622] = {
    title: 'Design Circular Queue (front + count, % capacity)', label: 'Circular array', ap: 1, method: 'MyCircularQueue',
    inputs: opsInputs('["MyCircularQueue","enQueue","enQueue","enQueue","enQueue","Rear","isFull","deQueue","enQueue","Rear"]', '[[3],[1],[2],[3],[4],[],[],[],[4],[]]'),
    run: run622opt,
  };

  // =====================================================================
  // WEEK 8 (strict) — Monotonic Stack: LC 496, 739, 84 (Optimal = base; Brute / Better / R→L tabs phase-05x.js me)
  // =====================================================================
  const fmtA = a => '[' + a.join(',') + ']';
  const IA = a => 'int[' + a.length + '] [' + a.join(', ') + ']';
  const mapS = m => 'HashMap size=' + Object.keys(m).length + ' {' + Object.entries(m).map(([k, v]) => k + '=' + v).join(', ') + '}';
  VIZ.p5.fmtA = fmtA; VIZ.p5.IA = IA; VIZ.p5.mapS = mapS;

  // ---------- LC 739 — Optimal (left → right, un-resolved indices) ----------
  VIZ.defs[739] = {
    title: 'Daily Temperatures (Monotonic Stack of indices, left → right)', label: 'Left → right', ap: 2,
    inputs: [{ key: 'temperatures', label: 'temperatures', def: '73, 74, 75, 71, 69, 72, 76, 73' }],
    run({ temperatures }) {
      const t = temperatures.slice(), n = t.length, stk = [];
      let result = null, i, prev;
      const tr = tracer(739, 2, o => ({
        views: [
          AV('temperatures', t, Object.assign(i !== undefined && i < n ? { [i]: 'cur' } : {}, o.th || {}), i !== undefined && i < n ? [{ i, label: 'i' }] : []),
          SV('stack (index : temp) — un-resolved days', stk.map(x => x + ' : ' + t[x]), o.sh),
        ].concat(result ? [AV('result', result, o.rh)] : []),
        vars: Object.assign({ n: String(n) }, result ? { result: IA(result) } : {}, result ? { stack: dq(stk) } : {}, i !== undefined ? { i: String(i) } : {}, prev !== undefined ? { previousIndex: String(prev) } : {}),
      }));
      tr.st('public int[] dailyTemperatures', 'Method call — ' + n + ' din');
      tr.st('int n = temperatures.length', 'n = ' + n);
      result = new Array(n).fill(0); tr.st('int[] result = new int[n]', 'result = sab 0 (jinka garam din nahi milega unka default 0)');
      tr.st('Deque<Integer> stack', 'Khaali stack — un-resolved din ke INDICES (distance chahiye, value nahi)');
      for (i = 0; ; i++) {
        prev = undefined;
        if (i >= n) { tr.st('for (int i = 0; i < n; i++)', 'i = ' + n + ' → loop khatam. Stack me bache din (' + (stk.join(', ') || 'koi nahi') + ') ka answer 0 hi rahega'); break; }
        tr.st('for (int i = 0; i < n; i++)', 'i = ' + i + ', temperature = ' + t[i]);
        for (;;) {
          const ok = stk.length && t[i] > t[stk[stk.length - 1]];
          tr.st('while (!stack.isEmpty() && temperatures[i] >', stk.length ? t[i] + ' > ' + t[stk[stk.length - 1]] + ' (din ' + stk[stk.length - 1] + ')? ' + (ok ? 'Haan → aaj uska garam din hai' : 'Nahi → ruko') : 'Stack khaali → kuch resolve nahi', { sh: tHl(stk, ok ? 'found' : 'cur') });
          if (!ok) break;
          prev = stk.pop();
          tr.st('int previousIndex = stack.pop()', 'previousIndex = ' + prev + ' (temp ' + t[prev] + ') resolve hua', { th: { [prev]: 'found' } });
          result[prev] = i - prev;
          tr.st('result[previousIndex] = i - previousIndex', 'result[' + prev + '] = ' + i + ' − ' + prev + ' = ' + (i - prev), { rh: { [prev]: 'new' } });
        }
        prev = undefined;
        stk.push(i);
        tr.st('stack.push(i)', 'push ' + i + ' — din ' + i + ' ab garam din ka wait karega', { sh: tHl(stk, 'new') });
      }
      i = undefined;
      return tr.end('return result', 'return ' + fmtA(result), fmtA(result), { rh: Object.fromEntries(result.map((_, k) => [k, 'done'])) });
    },
  };

  // ---------- LC 496 — Optimal (stack of values + HashMap) ----------
  VIZ.defs[496] = {
    title: 'Next Greater Element I (decreasing stack + HashMap)', label: 'Stack + HashMap', ap: 1,
    inputs: [{ key: 'nums1', label: 'nums1', def: '4, 1, 2' }, { key: 'nums2', label: 'nums2', def: '1, 3, 4, 2' }],
    run({ nums1, nums2 }) {
      const stk = [], map = {};
      let k, num, result = null, i, mapOn = false, stOn = false;
      const tr = tracer(496, 1, o => ({
        views: [
          AV('nums2', nums2, k !== undefined && k < nums2.length ? { [k]: 'cur' } : {}, k !== undefined && k < nums2.length ? [{ i: k, label: 'num' }] : []),
          SV('stack (un-resolved values)', stk, o.sh),
          { type: 'map', label: 'HashMap map (value → next greater)', entries: Object.assign({}, map), hl: o.mh },
          AV('nums1', nums1, i !== undefined && i < nums1.length ? { [i]: 'cur' } : {}, i !== undefined && i < nums1.length ? [{ i, label: 'i' }] : []),
        ].concat(result ? [AV('result', result, o.rh)] : []),
        vars: Object.assign({}, mapOn ? { map: mapS(map) } : {}, stOn ? { stack: dq(stk) } : {}, num !== undefined ? { num: String(num) } : {}, result ? { result: IA(result) } : {}, i !== undefined ? { i: String(i) } : {}),
      }));
      tr.st('public int[] nextGreaterElement', 'Method call — nums1 = ' + fmtA(nums1) + ', nums2 = ' + fmtA(nums2));
      mapOn = true; tr.st('Map<Integer, Integer> map', 'Khaali map: value → uska next greater (nums2 me)');
      stOn = true; tr.st('Deque<Integer> stack', 'Khaali stack — jinka next greater abhi nahi mila');
      for (k = 0; ; k++) {
        if (k >= nums2.length) { num = undefined; tr.st('for (int num : nums2)', 'nums2 khatam → loop band'); break; }
        num = nums2[k];
        tr.st('for (int num : nums2)', 'num = ' + num);
        for (;;) {
          const ok = stk.length && num > stk[stk.length - 1];
          tr.st('while (!stack.isEmpty() && num > stack.peek())', stk.length ? num + ' > top ' + stk[stk.length - 1] + '? ' + (ok ? 'Haan → ' + num + ' hi uska next greater' : 'Nahi → ruko') : 'Stack khaali', { sh: tHl(stk, ok ? 'found' : 'cur') });
          if (!ok) break;
          const v = stk.pop(); map[v] = num;
          tr.st('map.put(stack.pop(), num)', 'pop ' + v + ' → map.put(' + v + ', ' + num + ')', { mh: String(v) });
        }
        stk.push(num);
        tr.st('stack.push(num)', 'push ' + num + ' — iska next greater aage milega (shayad)', { sh: tHl(stk, 'new') });
      }
      k = undefined;
      for (;;) {
        tr.st('while (!stack.isEmpty()) {', stk.length ? 'Stack me ' + stk.length + ' bache — inke right me koi bada nahi' : 'Stack khaali → leftover khatam');
        if (!stk.length) break;
        const v = stk.pop(); map[v] = -1;
        tr.st('map.put(stack.pop(), -1)', 'map.put(' + v + ', −1)', { mh: String(v) });
      }
      result = new Array(nums1.length).fill(0);
      tr.st('int[] result = new int[nums1.length]', 'result banaya — ab sirf lookup');
      for (i = 0; ; i++) {
        if (i >= nums1.length) { tr.st('for (int i = 0; i < nums1.length; i++)', 'i = ' + i + ' → loop khatam'); break; }
        tr.st('for (int i = 0; i < nums1.length; i++)', 'i = ' + i + ', nums1[i] = ' + nums1[i]);
        result[i] = map[nums1[i]];
        tr.st('result[i] = map.get(nums1[i])', 'map.get(' + nums1[i] + ') = ' + result[i] + ' — O(1)', { mh: String(nums1[i]), rh: { [i]: 'new' } });
      }
      i = undefined;
      return tr.end('return result', 'return ' + fmtA(result), fmtA(result));
    },
  };

  // ---------- LC 84 — Optimal (one pass, increasing stack, sentinel NOT pushed) ----------
  VIZ.defs[84] = {
    title: 'Largest Rectangle in Histogram (one pass, increasing stack of indices)', label: 'One pass', ap: 2,
    inputs: [{ key: 'heights', label: 'heights', def: '2, 1, 5, 6, 2, 3' }],
    run({ heights }) {
      const h = heights.slice(), n = h.length, stk = [];
      let maxArea = 0, i, cur, hi, ht, ps, w, made = false;
      const tr = tracer(84, 2, o => ({
        views: [
          AV('heights', h, Object.assign({}, i !== undefined && i < n ? { [i]: 'cur' } : {}, o.hh || {}), [].concat(i !== undefined && i < n ? [{ i, label: 'i' }] : [], ps !== undefined && ps >= 0 ? [{ i: ps, label: 'PSE' }] : [])),
          SV('stack (index : height) — increasing', stk.map(x => x + ' : ' + h[x]), o.sh),
          { type: 'text', label: 'maxArea', value: String(maxArea) },
        ],
        vars: Object.assign({ n: String(n), maxArea: String(maxArea) }, made ? { stack: dq(stk) } : {}, i !== undefined ? { i: String(i) } : {}, cur !== undefined ? { currentHeight: String(cur) } : {},
          hi !== undefined ? { heightIndex: String(hi) } : {}, ht !== undefined ? { height: String(ht) } : {}, ps !== undefined ? { previousSmaller: String(ps) } : {}, w !== undefined ? { width: String(w) } : {}),
      }));
      const range = (a, b, cls) => { const r = {}; for (let x = a; x <= b; x++) r[x] = cls; return r; };
      tr.st('public int largestRectangleArea', 'Method call — heights = ' + fmtA(h));
      tr.st('int n = heights.length, maxArea = 0', 'n = ' + n + ', maxArea = 0');
      made = true; tr.st('Deque<Integer> stack', 'Khaali stack — indices, heights bottom → top increasing');
      for (i = 0; ; i++) {
        hi = ht = ps = w = cur = undefined;
        if (i > n) { tr.st('for (int i = 0; i <= n; i++)', 'i = ' + i + ' > n → loop khatam'); break; }
        tr.st('for (int i = 0; i <= n; i++)', i < n ? 'i = ' + i : 'i = n = ' + n + ' → sentinel round (bache bars ka area)');
        cur = i === n ? 0 : h[i];
        tr.st('int currentHeight = (i == n)', i === n ? 'i == n → currentHeight = 0 (sentinel: sabse chhota, sab pop karwayega)' : 'currentHeight = heights[' + i + '] = ' + cur);
        for (;;) {
          const ok = stk.length && h[stk[stk.length - 1]] > cur;
          tr.st('while (!stack.isEmpty() && heights[stack.peek()] > currentHeight)', stk.length ? 'top height ' + h[stk[stk.length - 1]] + ' > ' + cur + '? ' + (ok ? 'Haan → top bar ka right boundary (NSE) = i = ' + i : 'Nahi → increasing order theek') : 'Stack khaali', { sh: tHl(stk, ok ? 'skip' : 'cur') });
          if (!ok) break;
          hi = stk.pop(); ht = h[hi]; ps = undefined; w = undefined;
          tr.st('int heightIndex = stack.pop()', 'heightIndex = ' + hi, { hh: { [hi]: 'skip' } });
          tr.st('int height = heights[heightIndex]', 'height = ' + ht + ' (ye bar rectangle ka shortest bar)', { hh: { [hi]: 'skip' } });
          ps = stk.length ? stk[stk.length - 1] : -1;
          tr.st('int previousSmaller = stack.isEmpty()', stk.length ? 'Naya top ' + ps + ' (height ' + h[ps] + ') = PSE (left ka pehla chhota)' : 'Stack khaali → PSE = −1 (left me koi chhota nahi)', { hh: { [hi]: 'skip' } });
          w = i - ps - 1;
          tr.st('int width = i - previousSmaller - 1', 'width = ' + i + ' − (' + ps + ') − 1 = ' + w + ' (index ' + (ps + 1) + '..' + (i - 1) + ')', { hh: range(ps + 1, i - 1, 'win') });
          const area = ht * w; const was = maxArea; maxArea = Math.max(maxArea, area);
          tr.st('maxArea = Math.max(maxArea, height * width)', 'area = ' + ht + ' × ' + w + ' = ' + area + (area > was ? ' → naya maxArea' : ' (maxArea ' + was + ' hi)'), { hh: range(ps + 1, i - 1, area > was ? 'found' : 'win') });
        }
        hi = ht = ps = w = undefined;
        if (i < n) { stk.push(i); tr.st('if (i < n) stack.push(i)', 'i < n → push ' + i + ' (height ' + h[i] + ')', { sh: tHl(stk, 'new') }); }
        else tr.st('if (i < n) stack.push(i)', 'i == n → sentinel index push NAHI (stack ab khaali)');
      }
      i = undefined; cur = undefined;
      return tr.end('return maxArea', 'return ' + maxArea, String(maxArea));
    },
  };

})();
