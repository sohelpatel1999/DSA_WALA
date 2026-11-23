// Phase 10 — Graphs visualizers. Line numbers = questions[n].approaches[ap].code (1-based).
(function () {
  const LIMIT = 590; // engine max ~600; last step (ret) hamesha add hota hai

  // ---- helpers ----
  function rec() {
    const steps = [];
    return {
      steps,
      s(step) { if (steps.length < LIMIT) steps.push(step); },
      end(step) { if (steps.length >= LIMIT) step.note = '(steps limit — beech ke kuch steps skip) ' + step.note; steps.push(step); },
    };
  }
  const g2s = g => '[' + g.map(r => '[' + r.join(',') + ']').join(',') + ']';
  const gq = g => '[' + g.map(r => '[' + r.map(x => '"' + x + '"').join(',') + ']').join(',') + ']';
  const intGrid = g => 'int[' + g.length + '][' + (g[0] ? g[0].length : 0) + '] ' + g2s(g);
  const charGrid = g => 'char[' + g.length + '][' + (g[0] ? g[0].length : 0) + '] ' + gq(g).replace(/"/g, "'");
  const boolArr = a => 'boolean[' + a.length + '] [' + a.join(', ') + ']';
  const intArr = a => 'int[' + a.length + '] [' + a.join(', ') + ']';
  const dq = items => 'ArrayDeque [' + items.join(', ') + ']';
  const cell = (r, c) => '(' + r + ',' + c + ')';
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const DNAME = ['neeche', 'upar', 'right', 'left'];
  const listOfLists = L => '[' + L.map(x => '[' + x.join(', ') + ']').join(', ') + ']';
  // frames: stack bottom..top → engine ko top first chahiye
  const snapFrames = stack => stack.slice().reverse().map(f => ({ method: f.method, args: f.args, line: f.line, vars: f.vars() }));
  const hlGrid = (marks, extra) => Object.assign({}, marks, extra || {});

  // =====================================================================
  // LC 733 Flood Fill
  // =====================================================================
  VIZ.defs[733] = {
    title: 'Flood Fill (DFS Recursive)', label: 'DFS', ap: 0,
    inputs: [
      { key: 'image', label: 'image (2D json)', type: 'json', def: '[[1,1,1],[1,1,0],[1,0,1]]' },
      { key: 'sr', label: 'sr', type: 'num', def: '1' },
      { key: 'sc', label: 'sc', type: 'num', def: '1' },
      { key: 'color', label: 'color', type: 'num', def: '2' },
    ],
    run({ image, sr, sc, color }) {
      const g = image.map(r => r.slice()), m = g.length, n = g[0].length;
      const R = rec(), marks = {}, stack = [];
      const start = g[sr][sc];
      const main = { method: 'floodFill', args: 'sr=' + sr + ', sc=' + sc + ', color=' + color, line: 2, vars: () => ({ image: intGrid(g), sr: String(sr), sc: String(sc), color: String(color), start: String(start) }) };
      stack.push(main);
      const snap = (line, note, extra) => { stack[stack.length - 1].line = line; R.s({ line, note, views: [{ type: 'grid', label: 'image', cells: g.map(r => r.slice()), hl: hlGrid(marks, extra) }], frames: snapFrames(stack) }); };
      snap(2, 'start = image[' + sr + '][' + sc + '] = ' + start + ' (original color yaad rakho)', { [sr + ',' + sc]: 'cur' });
      if (start === color) {
        snap(3, 'start (' + start + ') == color (' + color + ') → dfs call hi nahi. Warna recolor ke baad bhi cell "start" jaisa dikhega → infinite recursion!', { [sr + ',' + sc]: 'skip' });
      } else {
        snap(3, 'start ' + start + ' ≠ color ' + color + ' → dfs(' + sr + ', ' + sc + ')', { [sr + ',' + sc]: 'cur' });
        const dfs = (r, c, callLine) => {
          const f = { method: 'dfs', args: 'r=' + r + ', c=' + c, line: 8, vars: () => ({ r: String(r), c: String(c), start: String(start), color: String(color), image: intGrid(g) }) };
          stack.push(f);
          if (r < 0 || r >= m || c < 0 || c >= n) { snap(8, cell(r, c) + ' grid ke bahar → return'); stack.pop(); return; }
          snap(8, cell(r, c) + ' grid ke andar ✓', { [r + ',' + c]: 'cur' });
          if (g[r][c] !== start) { snap(9, 'image' + cell(r, c) + ' = ' + g[r][c] + ' ≠ start ' + start + ' → return (alag color ya already recolor)', { [r + ',' + c]: 'skip' }); stack.pop(); return; }
          g[r][c] = color; marks[r + ',' + c] = 'done';
          snap(10, 'image' + cell(r, c) + ' = ' + color + ' (recolor = visited mark)', { [r + ',' + c]: 'new' });
          DIRS.forEach(([dr, dc], k) => {
            snap(11 + k, DNAME[k] + ' jao → dfs(' + (r + dr) + ', ' + (c + dc) + ')', { [r + ',' + c]: 'cur' });
            dfs(r + dr, c + dc);
          });
          snap(15, 'dfs' + cell(r, c) + ' ke chaaron direction ho gaye → wapas caller pe', { [r + ',' + c]: 'cur' });
          stack.pop();
        };
        dfs(sr, sc);
      }
      R.end({ line: 4, note: 'return image = ' + g2s(g), views: [{ type: 'grid', label: 'image', cells: g.map(r => r.slice()), hl: Object.keys(marks).reduce((o, k) => { o[k] = 'found'; return o; }, {}) }], frames: snapFrames([main]), ret: g2s(g) });
      return R.steps;
    },
    variants: [{
      label: 'BFS', title: 'Flood Fill (BFS Queue)', ap: 1,
      run({ image, sr, sc, color }) {
        const g = image.map(r => r.slice()), m = g.length, n = g[0].length;
        const R = rec(), marks = {}, q = [];
        const start = g[sr][sc];
        const views = extra => [{ type: 'grid', label: 'image', cells: g.map(r => r.slice()), hl: hlGrid(marks, extra) }, { type: 'queue', label: 'q (front → back)', items: q.map(([a, b]) => cell(a, b)) }];
        const vars = o => Object.assign({ start: String(start), color: String(color), q: dq(q.map(([a, b]) => '[' + a + ', ' + b + ']')) }, o || {});
        const S = (line, note, extra, v) => R.s({ line, note, views: views(extra), vars: vars(v) });
        S(2, 'start = image[' + sr + '][' + sc + '] = ' + start, { [sr + ',' + sc]: 'cur' });
        if (start === color) {
          R.end({ line: 3, note: 'start == color → kuch karna hi nahi, return image', views: views(), vars: vars(), ret: g2s(g) });
          return R.steps;
        }
        S(3, 'start ≠ color → BFS karenge', {});
        S(4, 'm = ' + m + ', n = ' + n, {}, { m: String(m), n: String(n) });
        S(5, 'dirs = neeche, upar, right, left', {}, { m: String(m), n: String(n) });
        S(6, 'q = new ArrayDeque<>()', {}, { m: String(m), n: String(n) });
        q.push([sr, sc]);
        S(7, 'q.offer(' + cell(sr, sc) + ')', { [sr + ',' + sc]: 'cur' }, { m: String(m), n: String(n) });
        g[sr][sc] = color; marks[sr + ',' + sc] = 'done';
        S(8, 'Push karte hi recolor = visited mark (dobara queue me nahi aayega)', { [sr + ',' + sc]: 'new' }, { m: String(m), n: String(n) });
        while (q.length) {
          S(9, 'q khaali nahi → loop', {}, { m: String(m), n: String(n) });
          const [cr, cc] = q.shift();
          const base = { m: String(m), n: String(n), cur: '[' + cr + ', ' + cc + ']' };
          S(10, 'cur = q.poll() = ' + cell(cr, cc), { [cr + ',' + cc]: 'cur' }, base);
          DIRS.forEach(([dr, dc], k) => {
            const r = cr + dr, c = cc + dc, v = Object.assign({ r: String(r), c: String(c) }, base);
            const out = r < 0 || r >= m || c < 0 || c >= n;
            if (out || g[r][c] !== start) {
              S(13, DNAME[k] + ' ' + cell(r, c) + (out ? ' bahar' : ' = ' + g[r][c] + ' ≠ start') + ' → continue', Object.assign({ [cr + ',' + cc]: 'cur' }, out ? {} : { [r + ',' + c]: 'skip' }), v);
              return;
            }
            g[r][c] = color; marks[r + ',' + c] = 'done';
            S(14, DNAME[k] + ' ' + cell(r, c) + ' = start → recolor ' + color, { [cr + ',' + cc]: 'cur', [r + ',' + c]: 'new' }, v);
            q.push([r, c]);
            S(15, 'q.offer(' + cell(r, c) + ')', { [cr + ',' + cc]: 'cur', [r + ',' + c]: 'new' }, v);
          });
        }
        R.end({ line: 18, note: 'Queue khaali → return image = ' + g2s(g), views: [{ type: 'grid', label: 'image', cells: g.map(r => r.slice()), hl: Object.keys(marks).reduce((o, k) => { o[k] = 'found'; return o; }, {}) }, { type: 'queue', label: 'q', items: [] }], vars: vars({ m: String(m), n: String(n) }), ret: g2s(g) });
        return R.steps;
      },
    }],
  };

  // =====================================================================
  // LC 841 Keys and Rooms
  // =====================================================================
  const roomGraph = (rooms, hl, ehl) => {
    const edges = [], seenE = {};
    rooms.forEach((keys, a) => keys.forEach(b => { const k = a + '-' + b; if (!seenE[k] && a !== b) { seenE[k] = 1; edges.push([a, b]); } }));
    return { type: 'graph', label: 'rooms graph (room → key wala room)', nodes: rooms.map((_, i) => ({ id: i, label: 'R' + i })), edges, directed: true, hl, ehl };
  };
  VIZ.defs[841] = {
    title: 'Keys and Rooms (BFS Queue)', label: 'BFS', ap: 1,
    inputs: [{ key: 'rooms', label: 'rooms (json list of lists)', type: 'json', def: '[[1,3],[3,0,1],[2],[0]]' }],
    run({ rooms }) {
      const n = rooms.length, seen = new Array(n).fill(false), q = [], R = rec();
      let visited = 0;
      const nodeHl = extra => { const o = {}; seen.forEach((s, i) => { if (s) o[i] = 'done'; }); return Object.assign(o, extra || {}); };
      const views = (extra, ehl, ahl) => [roomGraph(rooms, nodeHl(extra), ehl), { type: 'queue', label: 'q (front → back)', items: q.slice() }, { type: 'array', label: 'seen', vals: seen.map(s => (s ? 'T' : 'F')), hl: ahl || {} }];
      const vars = o => Object.assign({ n: String(n), seen: boolArr(seen), q: dq(q), visited: String(visited) }, o || {});
      const S = (line, note, extra, o, ehl, ahl) => R.s({ line, note, views: views(extra, ehl, ahl), vars: vars(o) });
      S(2, 'n = ' + n + ' rooms', {});
      S(3, 'seen = new boolean[' + n + '] (sab false)', {});
      S(4, 'q = new ArrayDeque<>()', {});
      q.push(0);
      S(5, 'q.offer(0) — room 0 khula hua hai', { 0: 'cur' });
      seen[0] = true;
      S(6, 'seen[0] = true (push karte waqt mark)', { 0: 'new' }, {}, {}, { 0: 'new' });
      visited = 1;
      S(7, 'visited = 1', {});
      while (q.length) {
        S(8, 'q khaali nahi → loop', {});
        const room = q.shift();
        S(9, 'room = q.poll() = ' + room + ', keys = [' + rooms[room].join(', ') + ']', { [room]: 'cur' }, { room: String(room) });
        rooms[room].forEach(key => {
          const e = { [room + '-' + key]: 'cur' };
          S(10, 'key = ' + key + ' (room ' + room + ' se mili)', { [room]: 'cur', [key]: seen[key] ? 'skip' : 'win' }, { room: String(room), key: String(key) }, e);
          if (seen[key]) { S(11, 'seen[' + key + '] = true → room ' + key + ' pehle hi khul chuka, skip', { [room]: 'cur', [key]: 'skip' }, { room: String(room), key: String(key) }, e); return; }
          S(11, 'seen[' + key + '] = false → naya room!', { [room]: 'cur', [key]: 'win' }, { room: String(room), key: String(key) }, e);
          seen[key] = true;
          S(12, 'seen[' + key + '] = true', { [room]: 'cur', [key]: 'new' }, { room: String(room), key: String(key) }, e, { [key]: 'new' });
          visited++;
          S(13, 'visited = ' + visited, { [room]: 'cur', [key]: 'new' }, { room: String(room), key: String(key) }, e);
          q.push(key);
          S(14, 'q.offer(' + key + ')', { [room]: 'cur', [key]: 'new' }, { room: String(room), key: String(key) }, e);
        });
      }
      const ok = visited === n;
      const fin = {}; seen.forEach((s, i) => { fin[i] = s ? 'found' : 'skip'; });
      R.end({ line: 18, note: 'Queue khaali. visited (' + visited + ') == n (' + n + ')? → ' + ok + (ok ? '' : ' (jo rooms laal/skip hain unki key kabhi nahi mili)'), views: [roomGraph(rooms, fin, {}), { type: 'queue', label: 'q', items: [] }, { type: 'array', label: 'seen', vals: seen.map(s => (s ? 'T' : 'F')), hl: fin }], vars: vars(), ret: String(ok) });
      return R.steps;
    },
    variants: [{
      label: 'DFS', title: 'Keys and Rooms (DFS Recursive)', ap: 0,
      run({ rooms }) {
        const n = rooms.length, seen = new Array(n).fill(false), R = rec(), stack = [];
        const main = { method: 'canVisitAllRooms', args: 'rooms', line: 2, vars: () => ({ rooms: listOfLists(rooms), seen: boolArr(seen) }) };
        stack.push(main);
        const nodeHl = extra => { const o = {}; seen.forEach((s, i) => { if (s) o[i] = 'done'; }); return Object.assign(o, extra || {}); };
        const snap = (line, note, extra, ehl) => { stack[stack.length - 1].line = line; R.s({ line, note, views: [roomGraph(rooms, nodeHl(extra), ehl), { type: 'array', label: 'seen', vals: seen.map(s => (s ? 'T' : 'F')) }], frames: snapFrames(stack) }); };
        snap(2, 'seen = new boolean[' + n + ']', {});
        snap(3, 'dfs(rooms, 0, seen) — room 0 se shuru', { 0: 'cur' });
        const dfs = room => {
          let key = '-';
          const f = { method: 'dfs', args: 'room=' + room, line: 11, vars: () => ({ room: String(room), key: String(key), seen: boolArr(seen) }) };
          stack.push(f);
          seen[room] = true;
          snap(11, 'seen[' + room + '] = true (room ' + room + ' me ghus gaye)', { [room]: 'new' });
          rooms[room].forEach(k => {
            key = k;
            const e = { [room + '-' + k]: 'cur' };
            snap(12, 'key = ' + k, { [room]: 'cur', [k]: seen[k] ? 'skip' : 'win' }, e);
            if (seen[k]) { snap(13, 'seen[' + k + '] already true → skip', { [room]: 'cur', [k]: 'skip' }, e); return; }
            snap(13, 'seen[' + k + '] false → dfs(' + k + ') (naya frame CALL STACK pe)', { [room]: 'cur', [k]: 'win' }, e);
            dfs(k);
          });
          snap(15, 'room ' + room + ' ki saari keys ho gayi → return (frame pop)', { [room]: 'cur' });
          stack.pop();
        };
        dfs(0);
        let ok = true;
        for (let i = 0; i < n; i++) {
          snap(4, 'check seen[' + i + '] = ' + seen[i], { [i]: seen[i] ? 'found' : 'skip' });
          if (!seen[i]) { ok = false; break; }
        }
        const fin = {}; seen.forEach((s, i) => { fin[i] = s ? 'found' : 'skip'; });
        main.line = ok ? 7 : 5;
        R.end({ line: ok ? 7 : 5, note: ok ? 'Saare rooms visited → return true' : 'Ek room unvisited mila → return false', views: [roomGraph(rooms, fin, {}), { type: 'array', label: 'seen', vals: seen.map(s => (s ? 'T' : 'F')), hl: fin }], frames: snapFrames([main]), ret: String(ok) });
        return R.steps;
      },
    }],
  };

  // =====================================================================
  // LC 200 Number of Islands
  // =====================================================================
  VIZ.defs[200] = {
    title: 'Number of Islands (DFS sink)', label: 'DFS', ap: 0,
    inputs: [{ key: 'grid', label: 'grid (json, "1"/"0" strings)', type: 'json', def: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]' }],
    run({ grid }) {
      const g = grid.map(r => r.map(String)), m = g.length, n = g[0].length;
      const R = rec(), marks = {}, stack = [];
      let count = 0, R0 = 0, C0 = 0;
      const main = { method: 'numIslands', args: 'grid', line: 2, vars: () => ({ m: String(m), n: String(n), count: String(count), r: String(R0), c: String(C0), grid: charGrid(g) }) };
      stack.push(main);
      const snap = (line, note, extra) => { stack[stack.length - 1].line = line; R.s({ line, note, views: [{ type: 'grid', label: 'grid (hara = sink kiya, island #)', cells: g.map(r => r.slice()), hl: hlGrid(marks, extra) }, { type: 'text', label: 'count', value: String(count) }], frames: snapFrames(stack) }); };
      snap(2, 'm = ' + m + ', n = ' + n + ', count = 0', {});
      const dfs = (r, c) => {
        const f = { method: 'dfs', args: 'r=' + r + ', c=' + c, line: 15, vars: () => ({ r: String(r), c: String(c) }) };
        stack.push(f);
        if (r < 0 || r >= m || c < 0 || c >= n) { snap(15, cell(r, c) + ' bahar → return'); stack.pop(); return; }
        if (g[r][c] !== '1') { snap(16, 'grid' + cell(r, c) + " = '" + g[r][c] + "' → paani / already sunk → return", { [r + ',' + c]: 'skip' }); stack.pop(); return; }
        g[r][c] = '0'; marks[r + ',' + c] = 'done';
        snap(17, 'grid' + cell(r, c) + " = '0' (sink = visited). Island #" + count + ' ka hissa', { [r + ',' + c]: 'new' });
        DIRS.forEach(([dr, dc], k) => {
          stack[stack.length - 1].line = 18 + k;
          snap(18 + k, DNAME[k] + ' → dfs(' + (r + dr) + ', ' + (c + dc) + ')', { [r + ',' + c]: 'cur' });
          dfs(r + dr, c + dc);
        });
        stack.pop();
      };
      for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
          R0 = r; C0 = c;
          if (g[r][c] !== '1') { snap(5, 'grid' + cell(r, c) + " = '0' → skip", { [r + ',' + c]: 'cur' }); continue; }
          snap(5, 'grid' + cell(r, c) + " = '1' aur abhi tak sink nahi hua → NAYA island!", { [r + ',' + c]: 'found' });
          count++;
          snap(6, 'count = ' + count, { [r + ',' + c]: 'found' });
          snap(7, 'dfs(' + r + ', ' + c + ') → poora island sink karo', { [r + ',' + c]: 'cur' });
          dfs(r, c);
        }
      }
      R.end({ line: 11, note: 'Poora grid scan ho gaya → return count = ' + count, views: [{ type: 'grid', label: 'grid', cells: g.map(r => r.slice()), hl: Object.keys(marks).reduce((o, k) => { o[k] = 'found'; return o; }, {}) }, { type: 'text', label: 'count', value: String(count) }], frames: snapFrames([main]), ret: String(count) });
      return R.steps;
    },
    variants: [{
      label: 'BFS', title: 'Number of Islands (BFS Queue)', ap: 1,
      run({ grid }) {
        const g = grid.map(r => r.map(String)), m = g.length, n = g[0].length;
        const R = rec(), marks = {};
        let count = 0, q = [];
        const views = extra => [{ type: 'grid', label: 'grid', cells: g.map(r => r.slice()), hl: hlGrid(marks, extra) }, { type: 'queue', label: 'q (front → back)', items: q.map(([a, b]) => cell(a, b)) }, { type: 'text', label: 'count', value: String(count) }];
        const vars = o => Object.assign({ m: String(m), n: String(n), count: String(count), q: dq(q.map(([a, b]) => '[' + a + ', ' + b + ']')) }, o || {});
        const S = (line, note, extra, o) => R.s({ line, note, views: views(extra), vars: vars(o) });
        S(2, 'm = ' + m + ', n = ' + n + ', count = 0', {});
        S(3, 'dirs = neeche, upar, right, left', {});
        for (let r = 0; r < m; r++) {
          for (let c = 0; c < n; c++) {
            const rc = { r: String(r), c: String(c) };
            if (g[r][c] !== '1') { S(6, 'grid' + cell(r, c) + " = '0' → continue", { [r + ',' + c]: 'cur' }, rc); continue; }
            count++;
            S(7, 'Naya island ' + cell(r, c) + ' → count = ' + count, { [r + ',' + c]: 'found' }, rc);
            q = [];
            S(8, 'q = new ArrayDeque<>()', { [r + ',' + c]: 'found' }, rc);
            q.push([r, c]);
            S(9, 'q.offer(' + cell(r, c) + ')', { [r + ',' + c]: 'cur' }, rc);
            g[r][c] = '0'; marks[r + ',' + c] = 'done';
            S(10, "grid" + cell(r, c) + " = '0' — push karte hi mark", { [r + ',' + c]: 'new' }, rc);
            while (q.length) {
              const [cr, cc] = q.shift();
              const base = Object.assign({ cur: '[' + cr + ', ' + cc + ']' }, rc);
              S(12, 'cur = q.poll() = ' + cell(cr, cc), { [cr + ',' + cc]: 'cur' }, base);
              DIRS.forEach(([dr, dc], k) => {
                const nr = cr + dr, nc = cc + dc, v = Object.assign({ nr: String(nr), nc: String(nc) }, base);
                const out = nr < 0 || nr >= m || nc < 0 || nc >= n;
                if (out || g[nr][nc] !== '1') { S(15, DNAME[k] + ' ' + cell(nr, nc) + (out ? ' bahar' : " = '0'") + ' → continue', Object.assign({ [cr + ',' + cc]: 'cur' }, out ? {} : { [nr + ',' + nc]: 'skip' }), v); return; }
                g[nr][nc] = '0'; marks[nr + ',' + nc] = 'done';
                S(16, DNAME[k] + ' ' + cell(nr, nc) + " = '1' → '0' (mark)", { [cr + ',' + cc]: 'cur', [nr + ',' + nc]: 'new' }, v);
                q.push([nr, nc]);
                S(17, 'q.offer(' + cell(nr, nc) + ')', { [cr + ',' + cc]: 'cur', [nr + ',' + nc]: 'new' }, v);
              });
            }
          }
        }
        R.end({ line: 22, note: 'return count = ' + count, views: [{ type: 'grid', label: 'grid', cells: g.map(r => r.slice()), hl: Object.keys(marks).reduce((o, k) => { o[k] = 'found'; return o; }, {}) }, { type: 'queue', label: 'q', items: [] }, { type: 'text', label: 'count', value: String(count) }], vars: vars(), ret: String(count) });
        return R.steps;
      },
    }],
  };

  // =====================================================================
  // LC 994 Rotting Oranges
  // =====================================================================
  const orangeHl = (g, extra) => { const o = {}; g.forEach((row, r) => row.forEach((x, c) => { if (x === 2) o[r + ',' + c] = 'done'; })); return Object.assign(o, extra || {}); };
  VIZ.defs[994] = {
    title: 'Rotting Oranges (Multi-source BFS)', label: 'Multi-source BFS', ap: 1,
    inputs: [{ key: 'grid', label: 'grid (json: 0 khaali, 1 fresh, 2 rotten)', type: 'json', def: '[[2,1,1],[1,1,0],[0,1,1]]' }],
    run({ grid }) {
      const g = grid.map(r => r.slice()), m = g.length, n = g[0].length, R = rec();
      let fresh = 0, minutes = 0, q = [];
      const views = extra => [{ type: 'grid', label: 'grid (hara = rotten)', cells: g.map(r => r.slice()), hl: orangeHl(g, extra) }, { type: 'queue', label: 'q (front → back)', items: q.map(([a, b]) => cell(a, b)) }, { type: 'text', label: 'minutes · fresh', value: 'minutes = ' + minutes + ', fresh = ' + fresh }];
      const vars = o => Object.assign({ m: String(m), n: String(n), fresh: String(fresh), minutes: String(minutes), q: dq(q.map(([a, b]) => '[' + a + ', ' + b + ']')) }, o || {});
      const S = (line, note, extra, o) => R.s({ line, note, views: views(extra), vars: vars(o) });
      S(2, 'm = ' + m + ', n = ' + n + ', fresh = 0', {});
      S(3, 'q = new ArrayDeque<>()', {});
      for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
        if (g[r][c] === 2) { q.push([r, c]); S(6, cell(r, c) + ' rotten → q.offer (source!)', { [r + ',' + c]: 'cur' }, { r: String(r), c: String(c) }); }
        else if (g[r][c] === 1) { fresh++; S(7, cell(r, c) + ' fresh → fresh = ' + fresh, { [r + ',' + c]: 'win' }, { r: String(r), c: String(c) }); }
      }
      S(10, 'Saare rotten ek saath queue me = multi-source. dirs ready', {});
      S(11, 'minutes = 0', {});
      while (q.length && fresh > 0) {
        S(12, 'q.size() = ' + q.length + ' > 0 aur fresh = ' + fresh + ' > 0 → ek aur minute', {});
        const size = q.length;
        S(13, 'size = ' + size + ' (is minute ke rotten)', {}, { size: String(size) });
        for (let i = 0; i < size; i++) {
          const [cr, cc] = q.shift();
          const base = { size: String(size), i: String(i), cur: '[' + cr + ', ' + cc + ']' };
          S(15, 'cur = q.poll() = ' + cell(cr, cc), { [cr + ',' + cc]: 'cur' }, base);
          DIRS.forEach(([dr, dc], k) => {
            const r = cr + dr, c = cc + dc, v = Object.assign({ r: String(r), c: String(c) }, base);
            const out = r < 0 || r >= m || c < 0 || c >= n;
            if (out || g[r][c] !== 1) { S(18, DNAME[k] + ' ' + cell(r, c) + (out ? ' bahar' : ' = ' + g[r][c] + ' (fresh nahi)') + ' → continue', Object.assign({ [cr + ',' + cc]: 'cur' }, out ? {} : { [r + ',' + c]: 'skip' }), v); return; }
            g[r][c] = 2;
            S(19, DNAME[k] + ' ' + cell(r, c) + ' fresh → rotten (2)', { [cr + ',' + cc]: 'cur', [r + ',' + c]: 'new' }, v);
            fresh--;
            S(20, 'fresh = ' + fresh, { [cr + ',' + cc]: 'cur', [r + ',' + c]: 'new' }, v);
            q.push([r, c]);
            S(21, 'q.offer(' + cell(r, c) + ') — agle minute ka source', { [cr + ',' + cc]: 'cur', [r + ',' + c]: 'new' }, v);
          });
        }
        minutes++;
        S(24, 'Level khatam → minutes = ' + minutes, {});
      }
      S(12, q.length ? 'fresh = 0 → loop band (extra minute nahi ginega)' : 'Queue khaali → loop band', {});
      const ans = fresh === 0 ? minutes : -1;
      const fin = {}; g.forEach((row, r) => row.forEach((x, c) => { if (x === 1) fin[r + ',' + c] = 'skip'; else if (x === 2) fin[r + ',' + c] = 'found'; }));
      R.end({ line: 26, note: 'fresh = ' + fresh + (fresh === 0 ? ' → return minutes = ' + minutes : ' → kuch orange kabhi rot nahi honge → return -1'), views: [{ type: 'grid', label: 'grid', cells: g.map(r => r.slice()), hl: fin }, { type: 'queue', label: 'q', items: q.map(([a, b]) => cell(a, b)) }, { type: 'text', label: 'answer', value: String(ans) }], vars: vars(), ret: String(ans) });
      return R.steps;
    },
    variants: [{
      label: 'Brute simulation', title: 'Rotting Oranges (minute-by-minute simulation)', ap: 0,
      run({ grid }) {
        const g = grid.map(r => r.slice()), m = g.length, n = g[0].length, R = rec();
        let minutes = 0, toRot = [];
        const views = extra => [{ type: 'grid', label: 'grid (hara = rotten, peela = toRot list)', cells: g.map(r => r.slice()), hl: orangeHl(g, Object.assign(toRot.reduce((o, [a, b]) => { o[a + ',' + b] = 'win'; return o; }, {}), extra || {})) }, { type: 'text', label: 'minutes', value: String(minutes) }];
        const vars = o => Object.assign({ m: String(m), n: String(n), minutes: String(minutes), toRot: 'ArrayList [' + toRot.map(([a, b]) => '[' + a + ', ' + b + ']').join(', ') + ']' }, o || {});
        const S = (line, note, extra, o) => R.s({ line, note, views: views(extra), vars: vars(o) });
        S(2, 'minutes = 0', {});
        S(3, 'dirs ready', {});
        for (;;) {
          S(4, 'Naya minute (while true)', {});
          toRot = [];
          S(5, 'toRot = new ArrayList<>() — is minute me kaun rot hoga', {});
          for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
            if (g[r][c] !== 1) continue;
            let hit = -1;
            for (let k = 0; k < 4; k++) { const nr = r + DIRS[k][0], nc = c + DIRS[k][1]; if (nr >= 0 && nr < m && nc >= 0 && nc < n && g[nr][nc] === 2) { hit = k; break; } }
            if (hit >= 0) {
              const nr = r + DIRS[hit][0], nc = c + DIRS[hit][1];
              S(11, 'Fresh ' + cell(r, c) + ' ka ' + DNAME[hit] + ' ' + cell(nr, nc) + ' rotten hai', { [r + ',' + c]: 'cur', [nr + ',' + nc]: 'found' }, { r: String(r), c: String(c) });
              toRot.push([r, c]);
              S(12, 'toRot.add(' + cell(r, c) + ') — abhi 2 nahi kiya (warna isi minute me chain ban jaati)', { [r + ',' + c]: 'win' }, { r: String(r), c: String(c) });
            } else {
              S(8, 'Fresh ' + cell(r, c) + ' ke bagal me koi rotten nahi (abhi)', { [r + ',' + c]: 'cur' }, { r: String(r), c: String(c) });
            }
          }
          if (!toRot.length) { S(18, 'toRot khaali → koi badlaav nahi → break', {}); break; }
          S(18, 'toRot me ' + toRot.length + ' oranges', {});
          const was = toRot.slice();
          toRot.forEach(([a, b]) => { g[a][b] = 2; });
          toRot = [];
          S(19, 'Sabko ek saath 2 bana diya: ' + was.map(([a, b]) => cell(a, b)).join(' '), was.reduce((o, [a, b]) => { o[a + ',' + b] = 'new'; return o; }, {}));
          toRot = was;
          minutes++;
          S(20, 'minutes = ' + minutes, {});
          toRot = [];
        }
        let left = null;
        g.forEach((row, r) => row.forEach((x, c) => { if (x === 1 && !left) left = [r, c]; }));
        if (left) {
          R.end({ line: 24, note: cell(left[0], left[1]) + ' abhi bhi fresh → return -1', views: views({ [left[0] + ',' + left[1]]: 'skip' }), vars: vars(), ret: '-1' });
        } else {
          R.end({ line: 27, note: 'Koi fresh nahi bacha → return minutes = ' + minutes, views: views(), vars: vars(), ret: String(minutes) });
        }
        return R.steps;
      },
    }],
  };

  // =====================================================================
  // LC 207 / 210 — Course Schedule (directed graph, Kahn + DFS)
  // =====================================================================
  const courseGraph = (n, edges, hl, ehl, label) => ({ type: 'graph', label: label || 'graph (prerequisite → course)', nodes: Array.from({ length: n }, (_, i) => ({ id: i, label: String(i) })), edges, directed: true, hl, ehl });

  // Kahn runner shared by 207 / 210 (line maps alag)
  function kahn(numCourses, prerequisites, L, withOrder) {
    const n = numCourses, R = rec(), adj = Array.from({ length: n }, () => []), indeg = new Array(n).fill(0), q = [], order = [], taken = new Set();
    const edges = [];
    let k = 0;
    const hlNodes = extra => { const o = {}; for (let i = 0; i < n; i++) if (taken.has(i)) o[i] = 'done'; else if (q.includes(i)) o[i] = 'win'; return Object.assign(o, extra || {}); };
    const views = (extra, ehl, ihl) => {
      const v = [courseGraph(n, edges.slice(), hlNodes(extra), ehl), { type: 'array', label: 'indegree', vals: indeg.slice(), hl: ihl || {} }, { type: 'queue', label: 'q (indegree 0 wale)', items: q.slice() }];
      if (withOrder) v.push({ type: 'array', label: 'order', vals: Array.from({ length: n }, (_, i) => (i < k ? order[i] : '')), hl: k ? { [k - 1]: 'new' } : {} });
      return v;
    };
    const vars = o => {
      const base = { numCourses: String(n), adj: '[' + adj.map(a => '[' + a.join(', ') + ']').join(', ') + ']', indegree: intArr(indeg), q: dq(q) };
      if (withOrder) { base.order = intArr(Array.from({ length: n }, (_, i) => (i < k ? order[i] : 0))); base.k = String(k); } else base.taken = String(k);
      return Object.assign(base, o || {});
    };
    const S = (line, note, extra, o, ehl, ihl) => R.s({ line, note, views: views(extra, ehl, ihl), vars: vars(o) });
    S(L.adj, 'adj = new ArrayList<>() — har course ki list (prerequisite → dependent courses)', {});
    S(L.init, 'for i: adj.add(new ArrayList<>()) × ' + n, {});
    S(L.indeg, 'indegree = new int[' + n + '] — kitne prerequisites baaki', {});
    prerequisites.forEach(([a, b]) => {
      const p = '[' + a + ', ' + b + ']';
      adj[b].push(a); edges.push([b, a]);
      S(L.addEdge, 'p = ' + p + ' → "' + a + ' se pehle ' + b + '" → edge ' + b + ' → ' + a, { [b]: 'cur', [a]: 'cur' }, { p }, { [b + '-' + a]: 'new' });
      indeg[a]++;
      S(L.incr, 'indegree[' + a + ']++ → ' + indeg[a], { [a]: 'cur' }, { p }, {}, { [a]: 'new' });
    });
    S(L.q, 'q = new ArrayDeque<>()', {});
    for (let i = 0; i < n; i++) {
      if (indeg[i] === 0) { q.push(i); S(L.seed, 'indegree[' + i + '] = 0 → q.offer(' + i + ') (koi prerequisite nahi)', { [i]: 'new' }, { i: String(i) }, {}, { [i]: 'found' }); }
      else S(L.seed, 'indegree[' + i + '] = ' + indeg[i] + ' → abhi nahi le sakte', { [i]: 'skip' }, { i: String(i) }, {}, { [i]: 'skip' });
    }
    S(L.kinit, withOrder ? 'order = new int[' + n + '], k = 0' : 'taken = 0', {});
    while (q.length) {
      S(L.loop, 'q = [' + q.join(', ') + '] khaali nahi → loop', {});
      const u = q.shift();
      S(L.poll, 'u = q.poll() = ' + u, { [u]: 'cur' }, { u: String(u) });
      order[k] = u; k++; taken.add(u);
      S(L.take, withOrder ? 'order[' + (k - 1) + '] = ' + u + ', k = ' + k : 'taken = ' + k + ' (course ' + u + ' le liya)', { [u]: 'new' }, { u: String(u) });
      adj[u].forEach(v => {
        S(L.nbr, 'v = ' + v + ' (' + u + ' → ' + v + ': ' + v + ' ko ' + u + ' chahiye tha)', { [u]: 'cur', [v]: 'cur' }, { u: String(u), v: String(v) }, { [u + '-' + v]: 'cur' });
        indeg[v]--;
        if (indeg[v] === 0) { q.push(v); S(L.dec, '--indegree[' + v + '] = 0 → saare prerequisites ho gaye → q.offer(' + v + ')', { [u]: 'cur', [v]: 'new' }, { u: String(u), v: String(v) }, { [u + '-' + v]: 'done' }, { [v]: 'found' }); }
        else S(L.dec, '--indegree[' + v + '] = ' + indeg[v] + ' → abhi bhi ' + indeg[v] + ' baaki', { [u]: 'cur' }, { u: String(u), v: String(v) }, { [u + '-' + v]: 'done' }, { [v]: 'new' });
      });
    }
    const ok = k === n, fin = {};
    for (let i = 0; i < n; i++) fin[i] = taken.has(i) ? 'found' : 'skip';
    const ret = withOrder ? (ok ? '[' + order.join(',') + ']' : '[]') : String(ok);
    const note = ok
      ? (withOrder ? 'k (' + k + ') == numCourses → return order = [' + order.join(', ') + ']' : 'taken (' + k + ') == numCourses (' + n + ') → no cycle → true')
      : (withOrder ? 'k (' + k + ') < ' + n + ' → cycle → return new int[0] = []' : 'taken (' + k + ') < ' + n + ' → laal nodes cycle me phanse hain (indegree kabhi 0 nahi hua) → false');
    R.end({ line: L.ret, note, views: [courseGraph(n, edges.slice(), fin, {}), { type: 'array', label: 'indegree', vals: indeg.slice() }, { type: 'queue', label: 'q', items: [] }].concat(withOrder ? [{ type: 'array', label: 'order', vals: ok ? order.slice() : [], hl: {} }] : []), vars: vars(), ret });
    return R.steps;
  }

  // DFS runner: 207 (adj prereq → course, hasCycle) / 210 (pre: course → prereq, postorder)
  function dfsCourses(numCourses, prerequisites, mode) {
    const n = numCourses, R = rec(), g = Array.from({ length: n }, () => []), state = new Array(n).fill(0), order = [], edges = [], stack = [];
    const is210 = mode === 210;
    const L = is210
      ? { build: 4, init: 5, edge: 6, state: 7, order: 8, idx: 9, loop: 11, retEmpty: 11, ret: 13, mark: 17, nbr: 18, gray: 19, call: 20, done: 22, write: 23, rtrue: 24 }
      : { build: 2, init: 3, edge: 4, state: 5, loop: 7, retFalse: 7, ret: 9, mark: 13, nbr: 14, gray: 15, call: 16, done: 18, rfalse: 19 };
    const name = is210 ? 'pre' : 'adj';
    const glabel = is210 ? 'pre graph (course → uska prerequisite)' : 'graph (prerequisite → course)';
    const COL = ['', 'cur', 'done'];
    const hlNodes = extra => { const o = {}; state.forEach((s, i) => { if (s === 1) o[i] = 'win'; else if (s === 2) o[i] = 'done'; }); return Object.assign(o, extra || {}); };
    const views = (extra, ehl) => {
      const v = [courseGraph(n, edges.slice(), hlNodes(extra), ehl, glabel), { type: 'array', label: 'state (0 white · 1 gray/visiting · 2 black/done)', vals: state.slice(), hl: state.reduce((o, s, i) => { if (s) o[i] = COL[s] === 'cur' ? 'win' : 'done'; return o; }, {}) }];
      if (is210) v.push({ type: 'array', label: 'order', vals: Array.from({ length: n }, (_, i) => (i < order.length ? order[i] : '')), hl: order.length ? { [order.length - 1]: 'new' } : {} });
      return v;
    };
    let mi = '-';
    const main = { method: is210 ? 'findOrder' : 'canFinish', args: 'numCourses=' + n, line: L.build, vars: () => { const o = { numCourses: String(n), [name]: '[' + g.map(a => '[' + a.join(', ') + ']').join(', ') + ']', state: intArr(state), i: String(mi) }; if (is210) { o.order = intArr(Array.from({ length: n }, (_, i) => (i < order.length ? order[i] : 0))); o.idx = String(order.length); } return o; } };
    stack.push(main);
    const snap = (line, note, extra, ehl) => { stack[stack.length - 1].line = line; R.s({ line, note, views: views(extra, ehl), frames: snapFrames(stack) }); };
    snap(L.build, name + ' = new ArrayList<>()', {});
    snap(L.init, 'har course ki khaali list × ' + n, {});
    prerequisites.forEach(([a, b]) => {
      if (is210) { g[a].push(b); edges.push([a, b]); snap(L.edge, '[' + a + ', ' + b + '] → pre[' + a + '].add(' + b + ') — "' + a + ' ko pehle ' + b + ' chahiye"', { [a]: 'cur' }, { [a + '-' + b]: 'new' }); }
      else { g[b].push(a); edges.push([b, a]); snap(L.edge, '[' + a + ', ' + b + '] → adj[' + b + '].add(' + a + ') — edge ' + b + ' → ' + a, { [b]: 'cur' }, { [b + '-' + a]: 'new' }); }
    });
    snap(L.state, 'state = new int[' + n + '] — sab 0 (white)', {});
    if (is210) { snap(L.order, 'order = new int[' + n + ']', {}); snap(L.idx, 'idx = 0', {}); }
    let cyc = false;
    const dfs = u => {
      let v = '-';
      const f = { method: is210 ? 'dfs' : 'hasCycle', args: 'u=' + u, line: L.mark, vars: () => ({ u: String(u), v: String(v), state: intArr(state) }) };
      stack.push(f);
      state[u] = 1;
      snap(L.mark, 'state[' + u + '] = 1 (gray — ' + u + ' abhi recursion stack pe hai)', { [u]: 'cur' });
      for (const x of g[u]) {
        v = x;
        const e = { [u + '-' + x]: 'cur' };
        snap(L.nbr, 'v = ' + x + ', state[' + x + '] = ' + state[x], { [u]: 'cur', [x]: 'cur' }, e);
        if (state[x] === 1) {
          snap(L.gray, 'state[' + x + '] == 1 → gray node dobara mila = BACK EDGE = CYCLE! → return ' + (is210 ? 'false' : 'true'), { [u]: 'cur', [x]: 'skip' }, { [u + '-' + x]: 'skip' });
          stack.pop(); return true;
        }
        if (state[x] === 0) {
          snap(L.call, 'state[' + x + '] == 0 → ' + (is210 ? 'dfs' : 'hasCycle') + '(' + x + ')' + (is210 ? ' — pehle prerequisite ' + x + ' poora karo' : ''), { [u]: 'cur', [x]: 'cur' }, e);
          if (dfs(x)) { stack[stack.length - 1].line = L.call; snap(L.call, 'Andar cycle mila → upar bhi return ' + (is210 ? 'false' : 'true'), { [u]: 'skip' }); stack.pop(); return true; }
        } else snap(L.call, 'state[' + x + '] == 2 (done) → dobara explore nahi, cycle bhi nahi', { [u]: 'cur', [x]: 'done' }, e);
      }
      state[u] = 2;
      snap(L.done, 'state[' + u + '] = 2 (black — ' + u + ' ke saare raaste safe)', { [u]: 'done' });
      if (is210) {
        order.push(u);
        snap(L.write, 'order[' + (order.length - 1) + '] = ' + u + ' (postorder: prerequisites pehle likhe ja chuke)', { [u]: 'new' });
        snap(L.rtrue, 'return true', { [u]: 'done' });
      } else snap(L.rfalse, 'return false (yahan se cycle nahi)', { [u]: 'done' });
      stack.pop();
      return false;
    };
    for (let i = 0; i < n; i++) {
      mi = i;
      if (state[i] !== 0) { snap(L.loop, 'i = ' + i + ': state = ' + state[i] + ' → skip', { [i]: 'done' }); continue; }
      snap(L.loop, 'i = ' + i + ': state 0 → ' + (is210 ? 'dfs' : 'hasCycle') + '(' + i + ')', { [i]: 'cur' });
      if (dfs(i)) { cyc = true; break; }
    }
    const fin = {}; state.forEach((s, i) => { fin[i] = cyc ? (s === 1 ? 'skip' : '') : 'found'; });
    let ret, note, line;
    if (is210) { ret = cyc ? '[]' : '[' + order.join(',') + ']'; line = cyc ? L.retEmpty : L.ret; note = cyc ? 'Cycle → return new int[0] = []' : 'Saare courses done → return order = [' + order.join(', ') + ']'; }
    else { ret = String(!cyc); line = cyc ? L.retFalse : L.ret; note = cyc ? 'Cycle mila → return false (gray nodes = cycle)' : 'Kisi bhi DFS me back edge nahi → return true'; }
    main.line = line;
    R.end({ line, note, views: views(fin, {}), frames: snapFrames([main]), ret });
    return R.steps;
  }

  const courseInputs = [
    { key: 'numCourses', label: 'numCourses', type: 'num', def: '4' },
    { key: 'prerequisites', label: 'prerequisites (json [[a,b],…])', type: 'json', def: '[[1,0],[2,0],[3,1],[3,2]]' },
  ];
  VIZ.defs[207] = {
    title: "Course Schedule (Kahn's BFS)", label: 'Kahn (BFS)', ap: 1,
    inputs: courseInputs,
    run({ numCourses, prerequisites }) {
      return kahn(numCourses, prerequisites, { adj: 2, init: 3, indeg: 4, addEdge: 6, incr: 7, q: 9, seed: 11, kinit: 13, loop: 14, poll: 15, take: 16, nbr: 17, dec: 18, ret: 21 }, false);
    },
    variants: [{
      label: 'DFS 3-color', title: 'Course Schedule (DFS cycle detection)', ap: 0,
      run({ numCourses, prerequisites }) { return dfsCourses(numCourses, prerequisites, 207); },
    }],
  };
  VIZ.defs[210] = {
    title: "Course Schedule II (Kahn's BFS)", label: 'Kahn (BFS)', ap: 1,
    inputs: courseInputs,
    run({ numCourses, prerequisites }) {
      return kahn(numCourses, prerequisites, { adj: 2, init: 3, indeg: 4, addEdge: 6, incr: 7, q: 9, seed: 11, kinit: 14, loop: 15, poll: 16, take: 17, nbr: 18, dec: 19, ret: 22 }, true);
    },
    variants: [{
      label: 'DFS postorder', title: 'Course Schedule II (DFS on prerequisite graph)', ap: 0,
      run({ numCourses, prerequisites }) { return dfsCourses(numCourses, prerequisites, 210); },
    }],
  };

  // =====================================================================
  // LC 417 Pacific Atlantic Water Flow
  // =====================================================================
  const oceanCells = (o, ch) => o.map(row => row.map(x => (x ? ch : '·')));
  const resStr = res => '[' + res.map(([a, b]) => '[' + a + ',' + b + ']').join(',') + ']';
  function paViews(h, pac, atl, extra, which) {
    const hh = {};
    h.forEach((row, r) => row.forEach((_, c) => { if (pac[r][c] && atl[r][c]) hh[r + ',' + c] = 'found'; else if (which === 'pac' && pac[r][c]) hh[r + ',' + c] = 'win'; else if (which === 'atl' && atl[r][c]) hh[r + ',' + c] = 'win'; }));
    const ph = {}, ah = {};
    pac.forEach((row, r) => row.forEach((x, c) => { if (x) ph[r + ',' + c] = 'done'; }));
    atl.forEach((row, r) => row.forEach((x, c) => { if (x) ah[r + ',' + c] = 'done'; }));
    return [
      { type: 'grid', label: 'heights' + (which ? ' (abhi ' + (which === 'pac' ? 'Pacific' : 'Atlantic') + ' fill ho raha)' : ''), cells: h.map(r => r.slice()), hl: Object.assign(hh, extra || {}) },
      { type: 'grid', label: 'pac (Pacific tak pahunch)', cells: oceanCells(pac, 'P'), hl: which === 'pac' ? Object.assign({}, ph, extra || {}) : ph },
      { type: 'grid', label: 'atl (Atlantic tak pahunch)', cells: oceanCells(atl, 'A'), hl: which === 'atl' ? Object.assign({}, ah, extra || {}) : ah },
    ];
  }
  VIZ.defs[417] = {
    title: 'Pacific Atlantic (Reverse DFS from oceans)', label: 'Reverse DFS', ap: 1,
    inputs: [{ key: 'heights', label: 'heights (2D json)', type: 'json', def: '[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]' }],
    run({ heights }) {
      const h = heights, m = h.length, n = h[0].length, R = rec(), stack = [];
      const pac = h.map(r => r.map(() => false)), atl = h.map(r => r.map(() => false));
      let lr = 0, lc = 0;
      const main = { method: 'pacificAtlantic', args: 'heights', line: 2, vars: () => ({ m: String(m), n: String(n), r: String(lr), c: String(lc) }) };
      stack.push(main);
      let which = null;
      const snap = (line, note, extra) => { stack[stack.length - 1].line = line; R.s({ line, note, views: paViews(h, pac, atl, extra, which), frames: snapFrames(stack.length > 12 ? stack.slice(0, 1).concat(stack.slice(-11)) : stack) }); };
      snap(2, 'm = ' + m + ', n = ' + n, {});
      snap(3, 'pac, atl = do boolean grids (sab false)', {});
      const dfs = (r, c, ocean, prev, callLine) => {
        stack[stack.length - 1].line = callLine;
        const nm = ocean === pac ? 'pac' : 'atl';
        const f = { method: 'dfs', args: 'r=' + r + ', c=' + c + ', ' + nm + ', prev=' + (prev === -Infinity ? 'MIN' : prev), line: 22, vars: () => ({ r: String(r), c: String(c), prev: prev === -Infinity ? 'Integer.MIN_VALUE' : String(prev), ocean: nm, 'h[r][c]': r >= 0 && r < m && c >= 0 && c < n ? String(h[r][c]) : 'n/a' }) };
        stack.push(f);
        if (r < 0 || r >= m || c < 0 || c >= n) { snap(22, cell(r, c) + ' bahar → return'); stack.pop(); return; }
        if (ocean[r][c]) { snap(23, cell(r, c) + ' already ' + nm + ' me → return', { [r + ',' + c]: 'skip' }); stack.pop(); return; }
        if (h[r][c] < prev) { snap(23, 'h' + cell(r, c) + ' = ' + h[r][c] + ' < prev ' + prev + ' → paani yahan se upar wale cell me nahi chadh sakta (ulta: neeche nahi beh sakta) → return', { [r + ',' + c]: 'skip' }); stack.pop(); return; }
        ocean[r][c] = true;
        snap(24, nm + cell(r, c) + ' = true (h = ' + h[r][c] + (prev === -Infinity ? ', border cell' : ' ≥ prev ' + prev) + ')', { [r + ',' + c]: 'new' });
        DIRS.forEach(([dr, dc], k) => dfs(r + dr, c + dc, ocean, h[r][c], 25 + k));
        stack.pop();
      };
      for (let r = 0; r < m; r++) {
        lr = r;
        which = 'pac'; dfs(r, 0, pac, -Infinity, 5);
        which = 'atl'; dfs(r, n - 1, atl, -Infinity, 6);
      }
      for (let c = 0; c < n; c++) {
        lc = c;
        which = 'pac'; dfs(0, c, pac, -Infinity, 9);
        which = 'atl'; dfs(m - 1, c, atl, -Infinity, 10);
      }
      which = null;
      const res = [];
      snap(12, 'Dono oceans fill ho gaye. Ab intersection: res = new ArrayList<>()', {});
      for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
        lr = r; lc = c;
        if (pac[r][c] && atl[r][c]) { res.push([r, c]); snap(15, cell(r, c) + ': pac ✓ atl ✓ → res.add([' + r + ', ' + c + '])', { [r + ',' + c]: 'cur' }); }
      }
      R.end({ line: 18, note: 'return ' + resStr(res) + ' (' + res.length + ' cells)', views: paViews(h, pac, atl, {}, null), frames: snapFrames([main]), ret: resStr(res) });
      return R.steps;
    },
    variants: [{
      label: 'Reverse BFS', title: 'Pacific Atlantic (Reverse multi-source BFS)', ap: 2,
      run({ heights }) {
        const h = heights, m = h.length, n = h[0].length, R = rec();
        const pac = h.map(r => r.map(() => false)), atl = h.map(r => r.map(() => false));
        const pq = [], aq = [];
        let which = null;
        const views = (extra) => paViews(h, pac, atl, extra, which).concat([{ type: 'queue', label: 'pq (Pacific queue)', items: pq.map(([a, b]) => cell(a, b)) }, { type: 'queue', label: 'aq (Atlantic queue)', items: aq.map(([a, b]) => cell(a, b)) }]);
        const vars = o => Object.assign({ m: String(m), n: String(n), pq: dq(pq.map(([a, b]) => '[' + a + ', ' + b + ']')), aq: dq(aq.map(([a, b]) => '[' + a + ', ' + b + ']')) }, o || {});
        const S = (line, note, extra, o) => R.s({ line, note, views: views(extra), vars: vars(o) });
        S(2, 'm = ' + m + ', n = ' + n, {});
        S(3, 'pac, atl grids', {});
        S(4, 'pq, aq = do queues (multi-source)', {});
        const mark = (q, ocean, r, c, line) => { if (ocean[r][c]) return; ocean[r][c] = true; q.push([r, c]); S(line, (ocean === pac ? 'Pacific' : 'Atlantic') + ' border ' + cell(r, c) + ' → mark + offer', { [r + ',' + c]: 'new' }); };
        for (let r = 0; r < m; r++) { which = 'pac'; mark(pq, pac, r, 0, 6); which = 'atl'; mark(aq, atl, r, n - 1, 7); }
        for (let c = 0; c < n; c++) { which = 'pac'; mark(pq, pac, 0, c, 10); which = 'atl'; mark(aq, atl, m - 1, c, 11); }
        const bfs = (q, ocean, line) => {
          S(line, 'bfs(' + (ocean === pac ? 'Pacific' : 'Atlantic') + ') — saare border cells ek saath sources', {});
          while (q.length) {
            const [cr, cc] = q.shift();
            const base = { cur: '[' + cr + ', ' + cc + ']' };
            S(34, 'cur = ' + cell(cr, cc) + ' (h = ' + h[cr][cc] + ')', { [cr + ',' + cc]: 'cur' }, base);
            DIRS.forEach(([dr, dc]) => {
              const r = cr + dr, c = cc + dc;
              if (r < 0 || r >= m || c < 0 || c >= n || ocean[r][c]) return;
              if (h[r][c] < h[cr][cc]) { S(38, cell(r, c) + ' h=' + h[r][c] + ' < ' + h[cr][cc] + ' → continue (yahan se paani cur me nahi aata)', { [cr + ',' + cc]: 'cur', [r + ',' + c]: 'skip' }, Object.assign({ r: String(r), c: String(c) }, base)); return; }
              ocean[r][c] = true; q.push([r, c]);
              S(39, cell(r, c) + ' h=' + h[r][c] + ' ≥ ' + h[cr][cc] + ' → mark + offer', { [cr + ',' + cc]: 'cur', [r + ',' + c]: 'new' }, Object.assign({ r: String(r), c: String(c) }, base));
            });
          }
        };
        which = 'pac'; bfs(pq, pac, 13);
        which = 'atl'; bfs(aq, atl, 14);
        which = null;
        const res = [];
        for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (pac[r][c] && atl[r][c]) { res.push([r, c]); S(18, cell(r, c) + ' dono me → res.add', { [r + ',' + c]: 'cur' }, { r: String(r), c: String(c) }); }
        R.end({ line: 21, note: 'return ' + resStr(res), views: views({}), vars: vars(), ret: resStr(res) });
        return R.steps;
      },
    }],
  };
})();
