// Phase 5 (Stack + Queue) — Brute / Better / extra tabs, LINE-BY-LINE debugger (Week 7 + Week 8, 2026-11-23).
// Har executable line ek step; design problems me CALL STACK = method frames, VARIABLES = fields + locals.
// Helpers (tracer / designTracer / formatters) viz/phase-05.js ke VIZ.p5 se.
(function () {
  const { tracer, designTracer, dq, qs, ia, SV, QV, AV, tHl } = VIZ.p5;
  const add = (n, list) => { const d = VIZ.defs[n]; if (d) d.variants = (d.variants || []).concat(list); };

  // ================= LC 20 — Brute (pairs replace karte raho) =================
  add(20, [{
    label: 'Replace pairs', title: 'Valid Parentheses (Brute: "()", "[]", "{}" hatate raho)', ap: 0,
    run({ s }) {
      s = String(s).replace(/\s+/g, '');
      const orig = s;
      let prev;
      const tr = tracer(20, 0, o => ({
        views: [AV('s', s.length ? s.split('') : ['(empty)'], o.ah), AV('prev', prev === undefined ? ['–'] : prev.length ? prev.split('') : ['(empty)'])],
        vars: Object.assign({ s: '"' + s + '"' }, prev !== undefined ? { prev: '"' + prev + '"' } : {}),
      }));
      tr.st('public boolean isValid', 'Method call — s = "' + orig + '"');
      prev = ''; tr.st('String prev = ""', 'prev = "" — pichle pass ki string (shuru me khaali)');
      for (let g = 0; g < 100; g++) {
        if (s === prev) { tr.st('while (!s.equals(prev))', 's == prev → is pass me kuch nahi hata → loop band'); break; }
        tr.st('while (!s.equals(prev))', '"' + s + '" ≠ "' + prev + '" → ek aur pass');
        prev = s; tr.st('prev = s;', 'prev = "' + prev + '"');
        s = s.split('()').join('').split('[]').join('').split('{}').join('');
        tr.st('s = s.replace(', 'Teeno pairs hata diye → s = "' + s + '" (har replace O(n) — isliye total O(n²))', { ah: {} });
      }
      return tr.end('return s.isEmpty()', s === '' ? 'Sab pairs hat gaye, string khaali → return true' : '"' + s + '" bacha → return false', String(s === ''));
    },
  }]);

  // ================= LC 232 — Brute (har push pe st → tmp → st) =================
  add(232, [{
    label: 'Costly push', title: 'Queue using Stacks (Brute: har push pe sab ulta-pulta, push O(n))', ap: 0,
    run(inp) {
      let st = null, tmp = null;
      const T = designTracer(232, 0, {
        fields: () => ({ st: st ? dq(st) : 'null', tmp: tmp ? dq(tmp) : 'null' }),
        views: o => [SV('st (top = queue ka front)', st || [], o.hs), SV('tmp (helper)', tmp || [], o.ht)],
      });
      return T.go(inp, (op, a) => {
        if (op === 'MyQueue') return T.call('MyQueue', '', {}, () => {
          T.st('public MyQueue()', 'new MyQueue() — constructor');
          st = []; T.st('private Deque<Integer> st', 'st = khaali (isme top = queue front rakhenge)');
          tmp = []; T.st('private Deque<Integer> tmp', 'tmp = khaali helper');
        });
        if (op === 'push') return T.call('push', 'x=' + a[0], { x: String(a[0]) }, () => {
          const x = a[0];
          T.st('public void push(int x)', 'push(' + x + ') — naya element st ke sabse NEECHE jaana chahiye');
          while (st.length) { const v = st.pop(); tmp.push(v); T.st('while (!st.isEmpty())', 'st khaali nahi → ' + v + ' ko tmp me', { ht: tHl(tmp, 'new') }); }
          T.st('while (!st.isEmpty())', 'st khaali → ab ' + x + ' neeche rakh sakte hain');
          st.push(x); T.st('st.push(x)', 'st.push(' + x + ') — queue ka back (sabse neeche)', { hs: tHl(st, 'new') });
          while (tmp.length) { const v = tmp.pop(); st.push(v); T.st('while (!tmp.isEmpty())', 'tmp se ' + v + ' wapas st me', { hs: tHl(st, 'cur') }); }
          T.st('while (!tmp.isEmpty())', 'tmp khaali → order wapas: st ka top = front (' + st[st.length - 1] + ')', { hs: tHl(st, 'found') });
        });
        if (op === 'pop') return T.call('pop', '', {}, () => {
          T.st('public int pop()', 'pop()');
          const r = st.pop(); T.st('return st.pop()', 'return ' + r + ' (top = front) — O(1)');
          return r;
        });
        if (op === 'peek') return T.call('peek', '', {}, () => {
          T.st('public int peek()', 'peek()');
          const r = st[st.length - 1]; T.st('return st.peek()', 'return ' + r, { hs: tHl(st, 'found') });
          return r;
        });
        if (op === 'empty') return T.call('empty', '', {}, () => {
          T.st('public boolean empty()', 'empty()');
          T.st('return st.isEmpty()', 'return ' + !st.length);
          return !st.length;
        });
        return undefined;
      });
    },
  }]);

  // ================= LC 225 — Brute (two queues, costly pop) + Better (two queues, costly push) =================
  add(225, [{
    label: 'Two queues, costly pop', title: 'Stack using Two Queues (Brute: pop/top O(n))', ap: 0,
    run(inp) {
      let q1 = null, q2 = null;
      const T = designTracer(225, 0, {
        fields: () => ({ q1: q1 ? qs(q1, 'ArrayDeque') : 'null', q2: q2 ? qs(q2, 'ArrayDeque') : 'null' }),
        views: o => [QV('q1 (main)', q1 || [], o.h1), QV('q2 (helper)', q2 || [], o.h2)],
      });
      const push = x => T.call('push', 'x=' + x, { x: String(x) }, () => {
        T.st('public void push(int x)', 'push(' + x + ')');
        q1.push(x); T.st('q1.offer(x)', 'q1.offer(' + x + ') — O(1)', { h1: { [q1.length - 1]: 'new' } });
      });
      const pop = () => T.call('pop', '', {}, L => {
        T.st('public int pop()', 'pop() — top = q1 ka LAST element');
        while (q1.length > 1) { const v = q1.shift(); q2.push(v); T.st('while (q1.size() > 1)', 'q1 size > 1 → ' + v + ' ko q2 me bhejo', { h2: { [q2.length - 1]: 'new' } }); }
        T.st('while (q1.size() > 1)', 'q1 me sirf 1 bacha → wahi top hai', { h1: { 0: 'found' } });
        const t = q1.shift(); L.top = String(t);
        T.st('int top = q1.poll()', 'top = ' + t);
        const tt = q1; L.t = qs(tt, 'ArrayDeque');
        T.st('Queue<Integer> t = q1', 't = q1 (khaali queue ka reference)');
        q1 = q2; T.st('q1 = q2;', 'q1 = q2 → baaki elements wapas "q1" naam se');
        q2 = tt; delete L.t; T.st('q2 = t;', 'q2 = khaali queue — swap complete (O(1), sirf references)');
        T.st(T.ln('return top;', 1), 'return ' + t);
        return t;
      });
      return T.go(inp, (op, a) => {
        if (op === 'MyStack') return T.call('MyStack', '', {}, () => {
          T.st('public MyStack()', 'new MyStack() — constructor');
          q1 = []; T.st('private Queue<Integer> q1', 'q1 = khaali (main)');
          q2 = []; T.st('private Queue<Integer> q2', 'q2 = khaali (helper)');
        });
        if (op === 'push') return push(a[0]);
        if (op === 'pop') return pop();
        if (op === 'top') return T.call('top', '', {}, L => {
          T.st('public int top()', 'top() — pop karke wapas push (O(n))');
          T.st('int top = pop()', 'pop() call…');
          const t = pop(); L.top = String(t);
          T.st('int top = pop()', '…pop() ne ' + t + ' diya → top = ' + t);
          T.st('push(top)', 'push(' + t + ') — wapas daalo taaki stack same rahe');
          push(t);
          T.st(T.ln('return top;', 2), 'return ' + t);
          return t;
        });
        if (op === 'empty') return T.call('empty', '', {}, () => {
          T.st('public boolean empty()', 'empty()');
          T.st('return q1.isEmpty()', 'return ' + !q1.length);
          return !q1.length;
        });
        return undefined;
      });
    },
  }, {
    label: 'Two queues, costly push', title: 'Stack using Two Queues (Better: push O(n), pop/top O(1))', ap: 1,
    run(inp) {
      let q1 = null, q2 = null;
      const T = designTracer(225, 1, {
        fields: () => ({ q1: q1 ? qs(q1) : 'null', q2: q2 ? qs(q2) : 'null' }),
        views: o => [QV('q1 (front = stack ka top)', q1 || [], o.h1), QV('q2 (helper)', q2 || [], o.h2)],
      });
      return T.go(inp, (op, a) => {
        if (op === 'MyStack') return T.call('MyStack', '', {}, () => {
          T.st('public MyStack()', 'new MyStack() — constructor');
          q1 = []; T.st('private Queue<Integer> q1', 'q1 = khaali (main)');
          q2 = []; T.st('private Queue<Integer> q2', 'q2 = khaali (helper)');
        });
        if (op === 'push') return T.call('push', 'x=' + a[0], { x: String(a[0]) }, L => {
          const x = a[0];
          T.st('public void push(int x)', 'push(' + x + ')');
          q2.push(x); T.st('q2.offer(x)', 'Naya ' + x + ' khaali q2 me — sabse aage', { h2: { 0: 'new' } });
          while (q1.length) {
            T.st('while (!q1.isEmpty())', 'q1 khaali nahi → uska front q2 me bhejo');
            const v = q1.shift(); q2.push(v);
            T.st('q2.offer(q1.poll())', v + ' → q2 (' + x + ' ke peeche)', { h2: { [q2.length - 1]: 'cur' } });
          }
          T.st('while (!q1.isEmpty())', 'q1 khaali → ab swap');
          const tt = q1; L.temp = qs(tt);
          T.st('Queue<Integer> temp = q1', 'temp = q1 (khaali)');
          q1 = q2; T.st('q1 = q2;', 'q1 = q2 → front = ' + x + ' = stack ka top', { h1: { 0: 'found' } });
          q2 = tt; delete L.temp; T.st('q2 = temp;', 'q2 = khaali — agle push ke liye ready');
        });
        if (op === 'pop') return T.call('pop', '', {}, () => {
          T.st('public int pop()', 'pop()');
          const r = q1.shift(); T.st('return q1.poll()', 'poll() = ' + r + ' — O(1)');
          return r;
        });
        if (op === 'top') return T.call('top', '', {}, () => {
          T.st('public int top()', 'top()');
          T.st('return q1.peek()', 'peek() = ' + q1[0] + ' — O(1)', { h1: { 0: 'found' } });
          return q1[0];
        });
        if (op === 'empty') return T.call('empty', '', {}, () => {
          T.st('public boolean empty()', 'empty()');
          T.st('return q1.isEmpty()', 'return ' + !q1.length);
          return !q1.length;
        });
        return undefined;
      });
    },
  }]);

  // ================= LC 155 — Brute (getMin traverse) + Better ({val, min} pairs) =================
  add(155, [{
    label: 'Traverse getMin', title: 'Min Stack (Brute: getMin har baar poora stack scan, O(n))', ap: 0,
    run(inp) {
      let st = null;
      const T = designTracer(155, 0, {
        fields: () => ({ st: st ? dq(st) : 'null' }),
        views: o => [SV('st', st || [], o.hs)],
      });
      return T.go(inp, (op, a) => {
        if (op === 'MinStack') return T.call('MinStack', '', {}, () => {
          T.st('public MinStack()', 'new MinStack() — constructor');
          st = []; T.st('private Deque<Integer> st', 'st = khaali');
        });
        if (op === 'push') return T.call('push', 'val=' + a[0], { val: String(a[0]) }, () => {
          T.st('public void push(int val)', 'push(' + a[0] + ')');
          st.push(a[0]); T.st('st.push(val)', 'st.push(' + a[0] + ')', { hs: tHl(st, 'new') });
        });
        if (op === 'pop') return T.call('pop', '', {}, () => {
          T.st('public void pop()', 'pop()');
          const r = st.pop(); T.st('st.pop()', r + ' nikla');
        });
        if (op === 'top') return T.call('top', '', {}, () => {
          T.st('public int top()', 'top()');
          T.st('return st.peek()', 'return ' + st[st.length - 1], { hs: tHl(st, 'found') });
          return st[st.length - 1];
        });
        if (op === 'getMin') return T.call('getMin', '', {}, L => {
          T.st('public int getMin()', 'getMin() — poora stack dekhna padega');
          let min = 2147483647; L.min = String(min);
          T.st('int min = Integer.MAX_VALUE', 'min = Integer.MAX_VALUE');
          for (let j = st.length - 1; j >= 0; j--) {   // ArrayDeque: top se bottom
            const x = st[j]; min = Math.min(min, x); L.x = String(x); L.min = String(min);
            T.st('for (int x : st)', 'x = ' + x + ' → min = ' + min, { hs: { [j]: 'cur' } });
          }
          delete L.x;
          T.st('for (int x : st)', 'Saare ' + st.length + ' elements dekhe → loop khatam (O(n))');
          T.st('return min;', 'return ' + min);
          return min;
        });
        return undefined;
      });
    },
  }, {
    label: '{val, min} pairs', title: 'Min Stack (Better: har entry ke saath us level tak ka min)', ap: 1,
    run(inp) {
      let st = null;
      const pr = p => '{' + p[0] + ', ' + p[1] + '}';
      const T = designTracer(155, 1, {
        fields: () => ({ st: st ? 'ArrayDeque size=' + st.length + ' [' + st.slice().reverse().map(pr).join(', ') + ']' : 'null' }),
        views: o => [SV('st ({val, min so far})', (st || []).map(pr), o.hs)],
      });
      return T.go(inp, (op, a) => {
        if (op === 'MinStack') return T.call('MinStack', '', {}, () => {
          T.st('public MinStack()', 'new MinStack() — constructor');
          st = []; T.st('private Deque<int[]> st', 'st = khaali (har entry = int[2] {val, min})');
        });
        if (op === 'push') return T.call('push', 'val=' + a[0], { val: String(a[0]) }, L => {
          const v = a[0];
          T.st('public void push(int val)', 'push(' + v + ')');
          const min = st.length ? Math.min(v, st[st.length - 1][1]) : v; L.min = String(min);
          T.st('int min = st.isEmpty()', st.length ? 'min = Math.min(' + v + ', top ka min ' + st[st.length - 1][1] + ') = ' + min : 'Stack khaali → min = ' + v, { hs: tHl(st, 'cur') });
          st.push([v, min]); T.st('st.push(new int[]{val, min})', 'push {' + v + ', ' + min + '}', { hs: tHl(st, 'new') });
        });
        if (op === 'pop') return T.call('pop', '', {}, () => {
          T.st('public void pop()', 'pop()');
          const r = st.pop(); T.st('st.pop();', pr(r) + ' nikla — neeche wale ka min apne aap sahi');
        });
        if (op === 'top') return T.call('top', '', {}, () => {
          T.st('public int top()', 'top()');
          T.st('return st.peek()[0]', 'return top ka val = ' + st[st.length - 1][0], { hs: tHl(st, 'found') });
          return st[st.length - 1][0];
        });
        if (op === 'getMin') return T.call('getMin', '', {}, () => {
          T.st('public int getMin()', 'getMin()');
          T.st('return st.peek()[1]', 'return top ka min = ' + st[st.length - 1][1] + ' — O(1)', { hs: tHl(st, 'found') });
          return st[st.length - 1][1];
        });
        return undefined;
      });
    },
  }]);

  // ================= LC 622 — Brute (linear array, deQueue pe shift) =================
  add(622, [{
    label: 'Shift on deQueue', title: 'Design Circular Queue (Brute: index 0 se shuru, deQueue pe shift O(n))', ap: 0,
    run(inp) {
      let arr = null, size = 0;
      const live = () => { const h = {}; for (let j = 0; j < size; j++) h[j] = 'win'; return h; };
      const T = designTracer(622, 0, {
        fields: () => ({ arr: arr ? ia(arr) : 'null', size: String(size) }),
        views: o => [AV('arr (0..size−1 = asli elements)', arr || [], Object.assign(arr ? live() : {}, o.ha || {}), arr && size ? [{ i: 0, label: 'front' }, { i: size - 1, label: 'rear' }] : [])],
      });
      const isEmpty = () => T.call('isEmpty', '', {}, () => {
        T.st('public boolean isEmpty()', 'isEmpty()');
        T.st('return size == 0', 'size = ' + size + ' → return ' + (size === 0));
        return size === 0;
      });
      const isFull = () => T.call('isFull', '', {}, () => {
        T.st('public boolean isFull()', 'isFull()');
        T.st('return size == arr.length', size + ' == ' + arr.length + ' → return ' + (size === arr.length));
        return size === arr.length;
      });
      return T.go(inp, (op, a) => {
        if (op === 'MyCircularQueue') return T.call('MyCircularQueue', 'k=' + a[0], { k: String(a[0]) }, () => {
          T.st('public MyCircularQueue(int k)', 'new MyCircularQueue(' + a[0] + ')');
          arr = new Array(a[0]).fill(0); T.st('arr = new int[k];', 'int[' + a[0] + '] — saare 0');
          size = 0; T.st('size = 0;', 'size = 0 → khaali');
        });
        if (op === 'enQueue') return T.call('enQueue', 'value=' + a[0], { value: String(a[0]) }, () => {
          T.st('public boolean enQueue(int value)', 'enQueue(' + a[0] + ')');
          T.st('if (isFull()) return false;', 'Pehle check: isFull()?');
          if (isFull()) { T.st('if (isFull()) return false;', 'Full → return false'); return false; }
          T.st('if (isFull()) return false;', 'Full nahi → aage');
          arr[size] = a[0]; T.st('arr[size] = value', 'arr[' + size + '] = ' + a[0], { ha: { [size]: 'new' } });
          size++; T.st('size++', 'size = ' + size);
          T.st(T.ln('return true;', 1), 'return true');
          return true;
        });
        if (op === 'deQueue') return T.call('deQueue', '', {}, L => {
          T.st('public boolean deQueue()', 'deQueue()');
          T.st('if (isEmpty()) return false;', 'Pehle check: isEmpty()?');
          if (isEmpty()) { T.st('if (isEmpty()) return false;', 'Khaali → return false'); return false; }
          T.st('if (isEmpty()) return false;', 'Khaali nahi → arr[0] hatana hai, baaki sab left shift', { ha: { 0: 'skip' } });
          for (let i = 1; ; i++) {
            L.i = String(i);
            if (!(i < size)) { T.st('for (int i = 1; i < size; i++)', 'i = ' + i + ' < size ' + size + '? Nahi → shift khatam (' + (size - 1) + ' moves = O(n))'); break; }
            T.st('for (int i = 1; i < size; i++)', 'i = ' + i + ' < ' + size + ' → shift');
            arr[i - 1] = arr[i]; T.st('arr[i - 1] = arr[i]', 'arr[' + (i - 1) + '] = arr[' + i + '] = ' + arr[i], { ha: { [i - 1]: 'new', [i]: 'cur' } });
          }
          delete L.i;
          size--; T.st('size--', 'size = ' + size + ' (arr[' + size + '] ki purani value ab garbage hai)');
          T.st(T.ln('return true;', 2), 'return true');
          return true;
        });
        if (op === 'Front') return T.call('Front', '', {}, () => {
          T.st('public int Front()', 'Front()');
          T.st('return isEmpty() ? -1 : arr[0]', 'isEmpty()?');
          const e = isEmpty();
          T.st('return isEmpty() ? -1 : arr[0]', e ? 'Khaali → return -1' : 'return arr[0] = ' + arr[0], e ? {} : { ha: { 0: 'found' } });
          return e ? -1 : arr[0];
        });
        if (op === 'Rear') return T.call('Rear', '', {}, () => {
          T.st('public int Rear()', 'Rear()');
          T.st('return isEmpty() ? -1 : arr[size - 1]', 'isEmpty()?');
          const e = isEmpty();
          T.st('return isEmpty() ? -1 : arr[size - 1]', e ? 'Khaali → return -1' : 'return arr[' + (size - 1) + '] = ' + arr[size - 1], e ? {} : { ha: { [size - 1]: 'found' } });
          return e ? -1 : arr[size - 1];
        });
        if (op === 'isEmpty') return isEmpty();
        if (op === 'isFull') return isFull();
        return undefined;
      });
    },
  }]);

  // =====================================================================
  // WEEK 8 — Monotonic Stack tabs
  // =====================================================================
  const { fmtA, IA } = VIZ.p5;
  const rangeHl = (a, b, cls) => { const r = {}; for (let x = a; x <= b; x++) r[x] = cls; return r; };

  // ================= LC 739 — Brute (har din aage scan) + Optimal (right → left) =================
  add(739, [{
    label: 'Scan forward', title: 'Daily Temperatures (Brute: har din ke liye aage scan, O(n²))', ap: 0,
    run({ temperatures }) {
      const t = temperatures.slice(), n = t.length;
      let result = null, i, j;
      const tr = tracer(739, 0, o => ({
        views: [AV('temperatures', t, Object.assign({}, i !== undefined && i < n ? { [i]: 'cur' } : {}, j !== undefined && j < n ? { [j]: 'win' } : {}, o.th || {}), [].concat(i !== undefined && i < n ? [{ i, label: 'i' }] : [], j !== undefined && j < n ? [{ i: j, label: 'j' }] : []))]
          .concat(result ? [AV('result', result, o.rh)] : []),
        vars: Object.assign({ n: String(n) }, result ? { result: IA(result) } : {}, i !== undefined ? { i: String(i) } : {}, j !== undefined ? { j: String(j) } : {}),
      }));
      tr.st('public int[] dailyTemperatures', 'Method call — ' + n + ' din');
      tr.st('int n = temperatures.length', 'n = ' + n);
      result = new Array(n).fill(0); tr.st('int[] result = new int[n]', 'result = sab 0');
      for (i = 0; ; i++) {
        j = undefined;
        if (i >= n) { tr.st('for (int i = 0; i < n; i++)', 'i = ' + n + ' → loop khatam'); break; }
        tr.st('for (int i = 0; i < n; i++)', 'i = ' + i + ' (temp ' + t[i] + ') — iske baad pehla garam din dhundo');
        for (j = i + 1; ; j++) {
          if (j >= n) { tr.st('for (int j = i + 1; j < n; j++)', 'j = ' + j + ' → aage koi garam din nahi → result[' + i + '] = 0 hi'); break; }
          tr.st('for (int j = i + 1; j < n; j++)', 'j = ' + j);
          const ok = t[j] > t[i];
          tr.st('if (temperatures[j] > temperatures[i])', t[j] + ' > ' + t[i] + '? ' + (ok ? 'Haan' : 'Nahi'), { th: { [j]: ok ? 'found' : 'skip' } });
          if (ok) {
            result[i] = j - i; tr.st('result[i] = j - i', 'result[' + i + '] = ' + j + ' − ' + i + ' = ' + (j - i), { rh: { [i]: 'new' } });
            tr.st('break;', 'break — pehla garam din mil gaya');
            break;
          }
        }
      }
      i = j = undefined;
      return tr.end('return result', 'return ' + fmtA(result), fmtA(result));
    },
  }, {
    label: 'Right → left', title: 'Daily Temperatures (Monotonic Stack, right → left: future candidates)', ap: 1,
    run({ temperatures }) {
      const t = temperatures.slice(), n = t.length, stk = [];
      let result = null, i;
      const tr = tracer(739, 1, o => ({
        views: [
          AV('temperatures', t, i !== undefined && i >= 0 ? { [i]: 'cur' } : {}, i !== undefined && i >= 0 ? [{ i, label: 'i' }] : []),
          SV('stack (index : temp) — future candidates', stk.map(x => x + ' : ' + t[x]), o.sh),
        ].concat(result ? [AV('result', result, o.rh)] : []),
        vars: Object.assign({ n: String(n) }, result ? { result: IA(result), stack: dq(stk) } : {}, i !== undefined ? { i: String(i) } : {}),
      }));
      tr.st('public int[] dailyTemperatures', 'Method call');
      tr.st('int n = temperatures.length', 'n = ' + n);
      result = new Array(n).fill(0); tr.st('int[] result = new int[n]', 'result = sab 0');
      tr.st('Deque<Integer> stack', 'Khaali stack — aage (future) ke candidate din');
      for (i = n - 1; ; i--) {
        if (i < 0) { tr.st('for (int i = n - 1; i >= 0; i--)', 'i = −1 → loop khatam'); break; }
        tr.st('for (int i = n - 1; i >= 0; i--)', 'i = ' + i + ' (temp ' + t[i] + ')');
        while (stk.length && t[stk[stk.length - 1]] <= t[i]) {
          const v = stk.pop();
          tr.st('while (!stack.isEmpty() && temperatures[stack.peek()] <=', t[v] + ' <= ' + t[i] + ' → din ' + v + ' kabhi kisi ka answer nahi banega → pop', { sh: tHl(stk, 'cur') });
        }
        tr.st('while (!stack.isEmpty() && temperatures[stack.peek()] <=', stk.length ? 'top ' + t[stk[stk.length - 1]] + ' > ' + t[i] + ' → ruko (ye answer hai)' : 'Stack khaali → ruko', { sh: tHl(stk, 'found') });
        result[i] = stk.length ? stk[stk.length - 1] - i : 0;
        tr.st('result[i] = stack.isEmpty() ? 0 : stack.peek() - i', stk.length ? 'result[' + i + '] = ' + stk[stk.length - 1] + ' − ' + i + ' = ' + result[i] : 'Koi garam din nahi → 0', { rh: { [i]: 'new' } });
        stk.push(i);
        tr.st('stack.push(i)', 'push ' + i + ' — peeche wale dino ke liye candidate', { sh: tHl(stk, 'new') });
      }
      i = undefined;
      return tr.end('return result', 'return ' + fmtA(result), fmtA(result));
    },
  }]);

  // ================= LC 496 — Brute (position dhundo + right scan) =================
  add(496, [{
    label: 'Find + scan', title: 'Next Greater Element I (Brute: har x ke liye nums2 me dhundo + right scan)', ap: 0,
    run({ nums1, nums2 }) {
      let ans = null, i, j, k;
      const tr = tracer(496, 0, o => ({
        views: [
          AV('nums1', nums1, i !== undefined && i < nums1.length ? { [i]: 'cur' } : {}, i !== undefined && i < nums1.length ? [{ i, label: 'i' }] : []),
          AV('nums2', nums2, Object.assign({}, j !== undefined ? { [j]: 'cur' } : {}, k !== undefined && k < nums2.length ? { [k]: 'win' } : {}, o.nh || {}), [].concat(j !== undefined ? [{ i: j, label: 'j' }] : [], k !== undefined && k < nums2.length ? [{ i: k, label: 'k' }] : [])),
        ].concat(ans ? [AV('ans', ans, o.ah)] : []),
        vars: Object.assign({}, ans ? { ans: IA(ans) } : {}, i !== undefined ? { i: String(i) } : {}, j !== undefined ? { j: String(j) } : {}, k !== undefined ? { k: String(k) } : {}),
      }));
      tr.st('public int[] nextGreaterElement', 'Method call — nums1 = ' + fmtA(nums1) + ', nums2 = ' + fmtA(nums2));
      ans = new Array(nums1.length).fill(0); tr.st('int[] ans = new int[nums1.length]', 'ans banaya');
      for (i = 0; ; i++) {
        j = k = undefined;
        if (i >= nums1.length) { tr.st('for (int i = 0; i < nums1.length; i++)', 'i = ' + i + ' → loop khatam'); break; }
        tr.st('for (int i = 0; i < nums1.length; i++)', 'i = ' + i + ', x = ' + nums1[i]);
        ans[i] = -1; tr.st('ans[i] = -1', 'Default −1 (mila nahi toh yahi)', { ah: { [i]: 'new' } });
        j = 0; tr.st('int j = 0', 'j = 0 — ab nums2 me ' + nums1[i] + ' ki position dhundo');
        while (nums2[j] !== nums1[i]) { tr.st('while (nums2[j] != nums1[i]) j++', 'nums2[' + j + '] = ' + nums2[j] + ' ≠ ' + nums1[i] + ' → j++'); j++; }
        tr.st('while (nums2[j] != nums1[i]) j++', 'nums2[' + j + '] = ' + nums1[i] + ' mil gaya → ruko', { nh: { [j]: 'found' } });
        for (k = j + 1; ; k++) {
          if (k >= nums2.length) { tr.st('for (int k = j + 1; k < nums2.length; k++)', 'k = ' + k + ' → right me koi bada nahi → −1 hi'); break; }
          tr.st('for (int k = j + 1; k < nums2.length; k++)', 'k = ' + k);
          const ok = nums2[k] > nums1[i];
          tr.st('if (nums2[k] > nums1[i])', nums2[k] + ' > ' + nums1[i] + '? ' + (ok ? 'Haan' : 'Nahi'), { nh: { [k]: ok ? 'found' : 'skip' } });
          if (ok) {
            ans[i] = nums2[k]; tr.st('ans[i] = nums2[k]', 'ans[' + i + '] = ' + nums2[k], { ah: { [i]: 'new' } });
            tr.st('break;', 'break — pehla bada mil gaya');
            break;
          }
        }
      }
      i = j = k = undefined;
      return tr.end('return ans', 'return ' + fmtA(ans), fmtA(ans));
    },
  }]);

  // ================= LC 84 — Brute (expand left/right) + Better (PSE / NSE arrays) =================
  add(84, [{
    label: 'Expand each bar', title: 'Largest Rectangle (Brute: har bar ko height maan ke left/right failao, O(n²))', ap: 0,
    run({ heights }) {
      const h = heights.slice(), n = h.length;
      let maxArea = 0, i, left, right;
      const tr = tracer(84, 0, o => ({
        views: [
          AV('heights', h, Object.assign({}, left !== undefined ? rangeHl(left, right, 'win') : {}, i !== undefined && i < n ? { [i]: 'cur' } : {}, o.hh || {}), [].concat(i !== undefined && i < n ? [{ i, label: 'i' }] : [], left !== undefined ? [{ i: left, label: 'L' }, { i: right, label: 'R' }] : [])),
          { type: 'text', label: 'maxArea', value: String(maxArea) },
        ],
        vars: Object.assign({ n: String(n), maxArea: String(maxArea) }, i !== undefined ? { i: String(i) } : {}, left !== undefined ? { left: String(left), right: String(right) } : {}),
      }));
      tr.st('public int largestRectangleArea', 'Method call — heights = ' + fmtA(h));
      tr.st('int n = heights.length, maxArea = 0', 'n = ' + n + ', maxArea = 0');
      for (i = 0; ; i++) {
        left = right = undefined;
        if (i >= n) { tr.st('for (int i = 0; i < n; i++)', 'i = ' + n + ' → loop khatam'); break; }
        tr.st('for (int i = 0; i < n; i++)', 'i = ' + i + ' — height ' + h[i] + ' ko rectangle ki height maano');
        left = i; right = i; tr.st('int left = i, right = i', 'left = right = ' + i);
        while (left > 0 && h[left - 1] >= h[i]) { left--; tr.st('while (left > 0 && heights[left - 1] >= heights[i]) left--', 'heights[' + left + '] = ' + h[left] + ' >= ' + h[i] + ' → left = ' + left); }
        tr.st('while (left > 0 && heights[left - 1] >= heights[i]) left--', left > 0 ? 'heights[' + (left - 1) + '] = ' + h[left - 1] + ' < ' + h[i] + ' → left ruka (' + left + ')' : 'left = 0 → aur left nahi');
        while (right < n - 1 && h[right + 1] >= h[i]) { right++; tr.st('while (right < n - 1 && heights[right + 1] >= heights[i]) right++', 'heights[' + right + '] = ' + h[right] + ' >= ' + h[i] + ' → right = ' + right); }
        tr.st('while (right < n - 1 && heights[right + 1] >= heights[i]) right++', right < n - 1 ? 'heights[' + (right + 1) + '] = ' + h[right + 1] + ' < ' + h[i] + ' → right ruka (' + right + ')' : 'right = n − 1 → aur right nahi');
        const area = h[i] * (right - left + 1), was = maxArea; maxArea = Math.max(maxArea, area);
        tr.st('maxArea = Math.max(maxArea, heights[i] * (right - left + 1))', 'area = ' + h[i] + ' × ' + (right - left + 1) + ' = ' + area + (area > was ? ' → naya maxArea' : ''), { hh: rangeHl(left, right, area > was ? 'found' : 'win') });
      }
      i = left = right = undefined;
      return tr.end('return maxArea', 'return ' + maxArea, String(maxArea));
    },
  }, {
    label: 'PSE / NSE arrays', title: 'Largest Rectangle (Better: pse[] + nse[] do passes, phir area)', ap: 1,
    run({ heights }) {
      const h = heights.slice(), n = h.length, stk = [];
      let pse = null, nse = null, i, maxArea, made = false;
      const tr = tracer(84, 1, o => ({
        views: [
          AV('heights', h, Object.assign({}, i !== undefined && i >= 0 && i < n ? { [i]: 'cur' } : {}, o.hh || {}), i !== undefined && i >= 0 && i < n ? [{ i, label: 'i' }] : []),
          SV('stack (index : height)', stk.map(x => x + ' : ' + h[x]), o.sh),
        ].concat(pse ? [AV('pse (previous smaller index)', pse, o.ph), AV('nse (next smaller index)', nse, o.qh)] : [], maxArea !== undefined ? [{ type: 'text', label: 'maxArea', value: String(maxArea) }] : []),
        vars: Object.assign({ n: String(n) }, pse ? { pse: IA(pse), nse: IA(nse) } : {}, made ? { stack: dq(stk) } : {}, i !== undefined ? { i: String(i) } : {}, maxArea !== undefined ? { maxArea: String(maxArea) } : {}),
      }));
      const W1 = tr.ln('while (!stack.isEmpty() && heights[stack.peek()] >= heights[i]) stack.pop()', 1);
      const W2 = tr.ln('while (!stack.isEmpty() && heights[stack.peek()] >= heights[i]) stack.pop()', 2);
      const P1 = tr.ln('stack.push(i);', 1), P2 = tr.ln('stack.push(i);', 2);
      const F1 = tr.ln('for (int i = 0; i < n; i++)', 1), F3 = tr.ln('for (int i = 0; i < n; i++)', 2);
      tr.st('public int largestRectangleArea', 'Method call — heights = ' + fmtA(h));
      tr.st('int n = heights.length;', 'n = ' + n);
      pse = new Array(n).fill(0); nse = new Array(n).fill(0); tr.st('int[] pse = new int[n], nse = new int[n]', 'pse[] aur nse[] — har bar ki left / right boundary');
      made = true; tr.st('Deque<Integer> stack', 'Khaali stack');
      const pass = (forward) => {
        const W = forward ? W1 : W2, P = forward ? P1 : P2, arr = forward ? pse : nse, def = forward ? -1 : n, key = forward ? 'ph' : 'qh';
        for (i = forward ? 0 : n - 1; ; i += forward ? 1 : -1) {
          if (forward ? i >= n : i < 0) { tr.st(forward ? F1 : 'for (int i = n - 1; i >= 0; i--)', (forward ? 'Pass 1 (PSE)' : 'Pass 2 (NSE)') + ' khatam'); break; }
          tr.st(forward ? F1 : 'for (int i = n - 1; i >= 0; i--)', (forward ? 'Pass 1 (left → right, PSE): ' : 'Pass 2 (right → left, NSE): ') + 'i = ' + i + ', height ' + h[i]);
          while (stk.length && h[stk[stk.length - 1]] >= h[i]) { const v = stk.pop(); tr.st(W, 'height ' + h[v] + ' >= ' + h[i] + ' → index ' + v + ' boundary nahi ban sakta → pop', { sh: tHl(stk, 'cur') }); }
          tr.st(W, stk.length ? 'top height ' + h[stk[stk.length - 1]] + ' < ' + h[i] + ' → ruko' : 'Stack khaali → ruko', { sh: tHl(stk, 'found') });
          arr[i] = stk.length ? stk[stk.length - 1] : def;
          tr.st(forward ? 'pse[i] = stack.isEmpty()' : 'nse[i] = stack.isEmpty()', (forward ? 'pse[' : 'nse[') + i + '] = ' + arr[i] + (stk.length ? '' : forward ? ' (left me koi chhota nahi)' : ' (right me koi chhota nahi → n)'), { [key]: { [i]: 'new' } });
          stk.push(i); tr.st(P, 'push ' + i, { sh: tHl(stk, 'new') });
        }
      };
      pass(true);
      stk.length = 0; i = undefined; tr.st('stack.clear()', 'stack.clear() — doosre pass ke liye');
      pass(false);
      i = undefined;
      maxArea = 0; tr.st('int maxArea = 0', 'Ab har bar ka area: heights[i] × (nse[i] − pse[i] − 1)');
      for (i = 0; ; i++) {
        if (i >= n) { tr.st(F3, 'i = ' + n + ' → loop khatam'); break; }
        tr.st(F3, 'i = ' + i);
        const w = nse[i] - pse[i] - 1, area = h[i] * w, was = maxArea; maxArea = Math.max(maxArea, area);
        tr.st('maxArea = Math.max(maxArea, heights[i] * (nse[i] - pse[i] - 1))', h[i] + ' × (' + nse[i] + ' − (' + pse[i] + ') − 1) = ' + h[i] + ' × ' + w + ' = ' + area + (area > was ? ' → naya maxArea' : ''), { hh: rangeHl(pse[i] + 1, nse[i] - 1, area > was ? 'found' : 'win'), ph: { [i]: 'cur' }, qh: { [i]: 'cur' } });
      }
      i = undefined;
      return tr.end('return maxArea', 'return ' + maxArea, String(maxArea));
    },
  }]);
})();
