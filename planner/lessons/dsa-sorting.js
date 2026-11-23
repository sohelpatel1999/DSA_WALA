// Planner lessons — Sorting (s1 Merge Sort, s2 Quick Sort)
// Format: dsa-arrays-two-pointers.js jaisa. Recursive tabs K.callStack() use karte hain → CALL STACK panel + 🌳 call tree.
// "Algorithm implement karo" wale problems: Brute = simple O(n²) sort (comparison baseline), phir asli algorithm.
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  // =====================================================================
  // s1 — Merge Sort (GfG)
  // =====================================================================
  const S1 = [
    `public void mergeSort(int[] arr, int l, int r) {
    // Problem merge sort maangta hai — ye sirf O(n²) baseline (insertion sort) hai
    for (int i = l + 1; i <= r; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= l && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    `public void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int mid = l + (r - l) / 2;
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    merge(arr, l, mid, r);
}

private void merge(int[] arr, int l, int mid, int r) {
    int[] temp = new int[r - l + 1];
    int i = l, j = mid + 1, k = 0;
    while (i <= mid && j <= r) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else temp[k++] = arr[j++];
    }
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= r) temp[k++] = arr[j++];
    for (int p = 0; p < temp.length; p++) arr[l + p] = temp[p];
}`,
  ];

  L.s1 = {
    kind: 'dsa', title: 'Merge Sort', topic: 'Sorting', diff: 'M',
    url: 'https://www.geeksforgeeks.org/problems/merge-sort/1',
    pattern: 'Divide & conquer (todo → sort → merge)',
    oneLine: 'Aadha-aadha todo jab tak ek element na bache, phir do sorted halves ko do pointers se merge karo. O(n log n) hamesha.',
    goal: 'Array ko <b>merge sort</b> se sort karo. Asli seekh: <b>divide &amp; conquer</b> — Day 6 ki recursion + g1 (Kadane) ka Better wala "mid pe todo" idea. Kaam do hisson me: <b>todna</b> (free, sirf mid nikalo) aur <b>jodna</b> (merge, O(n) two pointers). Yahi merge aage s3 Count Inversions ki neev hai.',
    problem: {
      statement: 'Given an array <code>arr[]</code>, its starting position <code>l</code> and its ending position <code>r</code>. Sort the array using the <b>merge sort</b> algorithm.<br><br>Implement <code>void mergeSort(int arr[], int l, int r)</code> — the array is sorted in place (driver code calls it with <code>l = 0</code>, <code>r = n - 1</code> and prints the array).',
      examples: [
        { input: 'arr = [4, 1, 3, 9, 7]', output: '[1, 3, 4, 7, 9]', explain: 'After sorting the array becomes 1 3 4 7 9.', viz: { arr: '4, 1, 3, 9, 7' } },
        { input: 'arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]', output: '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]', explain: 'After sorting the array becomes 1 2 3 4 5 6 7 8 9 10. (Visualizer ke liye bada hai — chhote examples pe chalao.)' },
        { input: 'arr = [1, 3, 2]', output: '[1, 2, 3]', explain: 'After sorting the array becomes 1 2 3.', viz: { arr: '1, 3, 2' } },
        { input: 'arr = [3, 1, 3, 2, 1]', output: '[1, 1, 2, 3, 3]', explain: 'Apna example: duplicates. Merge me <code>&lt;=</code> ki wajah se barabar values me left wala pehle jaata hai → merge sort <b>stable</b> hai.', viz: { arr: '3, 1, 3, 2, 1' } },
      ],
      constraints: ['1 <= arr.size() <= 10^5', '1 <= arr[i] <= 10^5'],
    },
    approaches: [
      { level: 'Brute', idea: 'Problem saaf merge sort maangta hai — ye sirf comparison baseline hai: <b>insertion sort</b>. arr[l..i-1] sorted rakho, arr[i] (key) ko peeche shift karte hue sahi jagah daalo.', time: 'O(n²) (sorted input pe O(n))', space: 'O(1)', code: S1[0] },
      { level: 'Optimal', idea: '<b>Merge sort</b>: mid pe todo, dono halves recursively sort karo, phir <code>merge</code> me do pointers (i left half, j right half) se chhota wala temp me daalo, bache hue copy karo, temp wapas arr[l..r] me. T(n) = 2T(n/2) + O(n).', time: 'O(n log n) (best/avg/worst)', space: 'O(n) temp + O(log n) stack', code: S1[1] },
    ],
    viz: {
      title: 'Merge Sort — todo, sort karo, merge karo',
      inputs: [{ key: 'arr', label: 'arr', def: '4, 1, 3, 9, 7' }],
      run({ arr }) {
        const a = arr.slice(), n = a.length, code = S1[1], find = K.finder(code), cs = K.callStack(), fs = [];
        const loc = F => {
          const v = { arr: K.iA(a), l: F.l };
          if (F.kind === 'merge') v.mid = F.mid;
          v.r = F.r;
          if (F.kind === 'ms' && F.mid !== undefined) v.mid = F.mid;
          if (F.temp) v.temp = K.iA(F.temp);
          ['i', 'j', 'k', 'p'].forEach(key => { if (F[key] !== undefined) v[key] = F[key]; });
          return v;
        };
        const { st, steps } = K.tracer(code, o => {
          const F = fs[fs.length - 1];
          const hl = Object.assign(F ? K.rng(F.l, F.r, 'win') : {}, o.hl || {});
          const ptr = [];
          if (F && F.kind === 'merge') {
            if (F.i !== undefined && F.i <= F.mid) ptr.push({ i: F.i, label: 'i' });
            if (F.j !== undefined && F.j <= F.r) ptr.push({ i: F.j, label: 'j' });
          } else if (F && F.mid !== undefined) ptr.push({ i: F.mid, label: 'mid' });
          const views = [K.A('arr', a, hl, ptr)];
          if (F && F.temp) views.push(K.A('temp', F.temp, o.th || {}, F.k !== undefined && F.k < F.temp.length ? [{ i: F.k, label: 'k' }] : []));
          const frames = cs.frames(o.ln);
          return { views, vars: frames[0].vars, frames };
        });
        const S = (snip, note, o) => st(snip, note, Object.assign({ ln: find(snip) }, o || {}));
        const ALL = () => K.rng(0, n - 1, 'found');

        const merge = (l, mid, r) => {
          const F = { kind: 'merge', l, mid, r };
          fs.push(F);
          cs.push('merge', `arr, l=${l}, mid=${mid}, r=${r}`, () => loc(F));
          S('private void merge', `merge: left ${K.iA(a.slice(l, mid + 1))} (l..mid) + right ${K.iA(a.slice(mid + 1, r + 1))} (mid+1..r) — dono sorted hain`);
          F.temp = new Array(r - l + 1).fill(null);
          S('int[] temp', `temp = new int[${r - l + 1}] — merged result yahan banega (_ = abhi khaali)`);
          F.i = l; F.j = mid + 1; F.k = 0;
          S('int i = l, j', `i = ${l} (left ka start), j = ${mid + 1} (right ka start), k = 0 (temp me likhne ki jagah)`);
          while (true) {
            if (!(F.i <= mid && F.j <= r)) {
              S('while (i <= mid && j <= r)', F.i > mid ? `i = ${F.i} > mid (${mid}) → left half khatam` : `j = ${F.j} > r (${r}) → right half khatam`);
              break;
            }
            S('while (i <= mid && j <= r)', `i = ${F.i} ≤ ${mid}, j = ${F.j} ≤ ${r} ✓ → arr[${F.i}] = ${a[F.i]} vs arr[${F.j}] = ${a[F.j]}`, { hl: { [F.i]: 'cur', [F.j]: 'cur' } });
            const x = a[F.i], y = a[F.j];
            if (x <= y) {
              const at = F.k, from = F.i;
              F.temp[F.k++] = a[F.i++];
              S('if (arr[i] <= arr[j])', `${x} <= ${y} ✓ → temp[${at}] = arr[${from}] = ${x} (left se)${x === y ? ' — barabar pe left pehle = stable' : ''}; i → ${F.i}, k → ${F.k}`, { hl: { [from]: 'done' }, th: { [at]: 'new' } });
            } else {
              S('if (arr[i] <= arr[j])', `${x} <= ${y} ✗ → right wala chhota hai`, { hl: { [F.i]: 'cur', [F.j]: 'cur' } });
              const at = F.k, from = F.j;
              F.temp[F.k++] = a[F.j++];
              S('else temp[k++]', `temp[${at}] = arr[${from}] = ${y} (right se); j → ${F.j}, k → ${F.k}`, { hl: { [from]: 'done' }, th: { [at]: 'new' } });
            }
          }
          while (true) {
            if (!(F.i <= mid)) { S('while (i <= mid) temp', `i = ${F.i} > mid (${mid}) → left me kuch nahi bacha`); break; }
            const at = F.k, v = a[F.i];
            F.temp[F.k++] = a[F.i++];
            S('while (i <= mid) temp', `left me bacha: temp[${at}] = ${v} (seedha copy, ye sab bade hain)`, { th: { [at]: 'new' } });
          }
          while (true) {
            if (!(F.j <= r)) { S('while (j <= r) temp', `j = ${F.j} > r (${r}) → right me kuch nahi bacha. temp = ${K.iA(F.temp)}`); break; }
            const at = F.k, v = a[F.j];
            F.temp[F.k++] = a[F.j++];
            S('while (j <= r) temp', `right me bacha: temp[${at}] = ${v}`, { th: { [at]: 'new' } });
          }
          F.i = undefined; F.j = undefined;
          for (F.p = 0; ; F.p++) {
            if (!(F.p < F.temp.length)) { S('for (int p = 0', `p = ${F.p} → copy done: arr[${l}..${r}] = ${K.iA(a.slice(l, r + 1))} sorted`, { hl: K.rng(l, r, 'found') }); break; }
            a[l + F.p] = F.temp[F.p];
            S('for (int p = 0', `arr[${l + F.p}] = temp[${F.p}] = ${F.temp[F.p]}`, { hl: { [l + F.p]: 'new' }, th: { [F.p]: 'cur' } });
          }
          fs.pop(); cs.pop();
        };

        const ms = (l, r, top) => {
          const F = { kind: 'ms', l, r };
          fs.push(F);
          cs.push('mergeSort', `arr, l=${l}, r=${r}`, () => loc(F));
          S('public void mergeSort', `mergeSort(l = ${l}, r = ${r}) — range ${K.iA(a.slice(l, r + 1))}`);
          const done = () => { fs.pop(); cs.pop(); };
          if (l >= r) {
            S('if (l >= r) return', l === r ? `l == r → ek element [${a[l]}] already sorted → return` : 'l > r → khaali range → return', top ? { hl: ALL(), ret: K.iA(a) } : { hl: { [l]: 'found' } });
            return done();
          }
          S('if (l >= r) return', `l (${l}) < r (${r}) → ${r - l + 1} elements, todna padega`);
          F.mid = l + Math.floor((r - l) / 2);
          S('int mid = l', `mid = ${l} + (${r} - ${l}) / 2 = ${F.mid}`);
          S('mergeSort(arr, l, mid)', `Left half sort karo: mergeSort(${l}, ${F.mid}) → ${K.iA(a.slice(l, F.mid + 1))}`, { hl: K.rng(l, F.mid, 'cur') });
          ms(l, F.mid);
          S('mergeSort(arr, mid + 1, r)', `Left half sorted = ${K.iA(a.slice(l, F.mid + 1))}. Ab right: mergeSort(${F.mid + 1}, ${r}) → ${K.iA(a.slice(F.mid + 1, r + 1))}`, { hl: K.rng(F.mid + 1, r, 'cur') });
          ms(F.mid + 1, r);
          S('merge(arr, l, mid, r)', `Dono halves sorted: ${K.iA(a.slice(l, F.mid + 1))} + ${K.iA(a.slice(F.mid + 1, r + 1))} → merge(${l}, ${F.mid}, ${r})`);
          merge(l, F.mid, r);
          S('merge(arr, l, mid, r)', top ? `Merge done → poora array sorted: ${K.iA(a)}` : `Wapas aaye: arr[${l}..${r}] = ${K.iA(a.slice(l, r + 1))} sorted → caller pe wapas`, top ? { hl: ALL(), ret: K.iA(a) } : { hl: K.rng(l, r, 'found') });
          done();
        };
        ms(0, n - 1, true);
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Insertion sort (baseline)',
          run({ arr }) {
            const a = arr.slice(), n = a.length, l = 0, r = n - 1;
            let i, key, j;
            const V = () => Object.assign({ arr: K.iA(a), l, r }, i !== undefined ? { i } : {}, key !== undefined ? { key } : {}, j !== undefined ? { j } : {});
            const { st, steps } = K.tracer(S1[0], o => ({ views: [K.A('arr', a, o.hl, o.ptr)], vars: V() }));
            const P = extra => {
              const hl = Object.assign(K.rng(0, i - 1, 'done'), extra || {});
              const ptr = [{ i, label: 'i' }];
              if (j !== undefined && j >= 0) ptr.push({ i: j, label: 'j' });
              return { hl, ptr };
            };
            st('public void mergeSort', `Method call: arr = ${K.iA(a)}, l = 0, r = ${r} (Brute baseline: insertion sort)`);
            for (i = l + 1; ; i++) {
              if (!(i <= r)) { key = undefined; j = undefined; st('for (int i = l + 1', `i = ${i} > r (${r}) → saare elements apni jagah → sorted ${K.iA(a)}`, { hl: K.rng(0, n - 1, 'found'), ret: K.iA(a) }); break; }
              key = undefined; j = undefined;
              st('for (int i = l + 1', `i = ${i} ≤ ${r} ✓ — arr[0..${i - 1}] sorted hai, ab arr[${i}] = ${a[i]} ko sahi jagah daalna hai`, P({ [i]: 'cur' }));
              key = a[i];
              st('int key = arr[i]', `key = arr[${i}] = ${key} (utha liya, iski jagah khaali samjho)`, P({ [i]: 'cur' }));
              j = i - 1;
              st('int j = i - 1', `j = ${j} — sorted hisse ka last element`, P({ [i]: 'cur' }));
              while (true) {
                const go = j >= l && a[j] > key;
                st('while (j >= l && arr[j] > key)', go ? `arr[${j}] = ${a[j]} > key ${key} ✓ → ise ek kadam right shift karo` : j < l ? `j = ${j} < l → shuru tak pahunch gaye, ruko` : `arr[${j}] = ${a[j]} ≤ key ${key} → ruko, key ki jagah mil gayi`, P(j >= 0 ? { [j]: 'cur' } : {}));
                if (!go) break;
                a[j + 1] = a[j];
                st('arr[j + 1] = arr[j]', `arr[${j + 1}] = arr[${j}] = ${a[j]} (shift)`, P({ [j + 1]: 'new' }));
                j--;
                st('j--', `j-- → ${j}`, P());
              }
              a[j + 1] = key;
              st('arr[j + 1] = key', `arr[${j + 1}] = key = ${key} → arr[0..${i}] = ${K.iA(a.slice(0, i + 1))} sorted`, P({ [j + 1]: 'new' }));
            }
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Divide & conquer: todo, sort karo, jodo', blocks: [
        { p: 'Day 6 ki recursion yaad karo: problem ko <b>chhote same problem</b> me todo, base case pe ruko. Merge sort me: "n elements sort karo" = "n/2 sort karo" + "n/2 sort karo" + <b>jodo</b>. Base case: 0 ya 1 element — already sorted. g1 (Kadane) ka Better bhi yahi tha — mid pe todo, dono taraf recursion, beech me O(n) combine.' },
        { pre: `                [4, 1, 3, 9, 7]
              /                 \\
        [4, 1, 3]              [9, 7]          ← todna (sirf mid nikalo)
        /       \\              /    \\
     [4, 1]     [3]          [9]    [7]
     /    \\
   [4]    [1]                                  ← base case: 1 element
     \\    /
     [1, 4]     [3]          [7, 9]            ← merge (two pointers)
         \\      /               |
        [1, 3, 4]            [7, 9]
              \\                 /
                [1, 3, 4, 7, 9]` },
        { p: '<b>Merge kaise?</b> Do sorted lists ke pehle elements me se jo chhota hai wo pakka poore result ka sabse chhota hai → temp me daalo, us list ka pointer aage. Ek list khatam hui toh doosri ka bacha hissa seedha copy. Har element ek baar → O(m).' },
        { p: '<b>Kitna kaam?</b> Har level pe saare n elements ek baar merge hote hain = O(n). Levels = log₂ n (har baar aadha). Total <b>O(n log n)</b> — input jaisa bhi ho (sorted, reverse, random).' },
        { tip: '<b>Stable</b>: merge me <code>arr[i] &lt;= arr[j]</code> (barabar pe left pehle) → barabar values ka original order bachta hai. <code>&lt;</code> likha toh stability toot jaati hai. Java ka <code>Arrays.sort(Object[])</code> / <code>Collections.sort</code> (TimSort) isi wajah se merge-based hai.' },
      ] },
      { title: '📄 Problem — Merge Sort (GfG)', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — koi bhi simple O(n²) sort (baseline)' },
        { p: 'Problem saaf <b>merge sort</b> maangta hai, toh asli answer wahi hai. Par interview me baseline bolna accha hai: <b>insertion sort</b> — left ka hissa sorted rakho, naye element (key) ko peeche shift karke sahi jagah daalo. <b>O(n²)</b> worst (reverse sorted), sorted pe O(n), O(1) space. n = 10⁵ pe 5×10⁹ — TLE.' },
        { h: 'Better?' },
        { p: 'Yahan genuine Better nahi hai — O(n²) aur O(n log n) ke beech koi alag idea is problem ka answer nahi (problem algorithm fix kar deta hai). Brute ke baad seedha Optimal.' },
        { h: '2. Optimal — merge sort' },
        { p: 'Insertion sort me ek element ko jagah dene ke liye O(n) shifting hoti hai. Merge sort kaam ko aadha-aadha karta hai: do sorted halves ko jodna sirf O(n) hai. Recurrence <b>T(n) = 2T(n/2) + O(n) = O(n log n)</b>. Keemat: merge ke liye <b>O(n) extra</b> temp array (in-place nahi).' },
        { tip: 'mid = <code>l + (r - l) / 2</code> likho, <code>(l + r) / 2</code> nahi — bade indices pe overflow se bachta hai (Binary search wali habit).' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — arr = [4, 1, 3, 9, 7] (Optimal)', blocks: [
        { table: { head: ['Call', 'mid', 'Left sorted', 'Right sorted', 'merge → arr[l..r]'], rows: [
          ['mergeSort(0, 1)', '0', '[4]', '[1]', '[1, 4]'],
          ['mergeSort(0, 2)', '1', '[1, 4]', '[3]', '[1, 3, 4]'],
          ['mergeSort(3, 4)', '3', '[9]', '[7]', '[7, 9]'],
          ['mergeSort(0, 4)', '2', '[1, 3, 4]', '[7, 9]', '<b>[1, 3, 4, 7, 9]</b>'],
        ] } },
        { p: 'Aakhri merge detail me: i → [1,3,4], j → [7,9]. 1 &lt; 7 → 1; 3 &lt; 7 → 3; 4 &lt; 7 → 4; left khatam → bache [7, 9] copy. temp = [1,3,4,7,9] → arr me wapas.' },
        { p: 'Order of calls (call tree me dekho): pehle <b>poora left subtree</b> khatam hota hai (0..2), phir right (3..4), phir root ka merge. Recursion = DFS.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: S1[1] },
        { lines: [
          ['if (l >= r) return;', 'Base case: 0 ya 1 element — already sorted.'],
          ['int mid = l + (r - l) / 2;', 'Beech ka index (overflow-safe).'],
          ['mergeSort(arr, l, mid);', 'Left half arr[l..mid] sort (recursion pe bharosa).'],
          ['mergeSort(arr, mid + 1, r);', 'Right half arr[mid+1..r] sort.'],
          ['merge(arr, l, mid, r);', 'Do sorted halves ko ek sorted range me jodo.'],
          ['int[] temp = new int[r - l + 1];', 'Merged result ke liye jagah — yahi O(n) extra space hai.'],
          ['int i = l, j = mid + 1, k = 0;', 'i left half pe, j right half pe, k temp me likhne ki jagah.'],
          ['while (i <= mid && j <= r)', 'Dono halves me element bache hain tab tak compare.'],
          ['if (arr[i] <= arr[j]) temp[k++] = arr[i++];', 'Left chhota ya barabar → left wala lo. <code>&lt;=</code> = stable.'],
          ['else temp[k++] = arr[j++];', 'Right chhota → right wala lo.'],
          ['while (i <= mid) temp[k++] = arr[i++];', 'Left me bacha hissa (sab bade) seedha copy.'],
          ['while (j <= r) temp[k++] = arr[j++];', 'Right me bacha hissa copy. (Do me se ek hi loop chalega.)'],
          ['for (int p = 0; p < temp.length; p++) arr[l + p] = temp[p];', 'temp wapas arr[l..r] me — offset <code>l + p</code>, sirf p nahi!'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute (insertion sort) → Optimal (merge sort)</b>. Merge sort tab me CALL STACK aur 🌳 call tree dekho — har node pe l, r ka range. temp array alag dikhega. Apna input: <code>5, 2, 4, 6, 1, 3</code>.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Ek element <code>[5]</code> → pehli call hi base case.',
          'Already sorted / reverse sorted → dono O(n log n) (merge sort input se farq nahi padta).',
          'Duplicates <code>[3, 1, 3, 2, 1]</code> → <code>&lt;=</code> se stable result.',
          'Sab same <code>[2, 2, 2]</code> → har merge me left pehle, koi problem nahi.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Copy back me <code>arr[p] = temp[p]</code> — offset <code>l</code> bhool gaye → galat jagah overwrite.',
          'Bache hue elements wale do <code>while</code> loops bhool jaana → kuch elements gayab.',
          'Base case <code>l == r</code> likha aur kabhi l &gt; r call ho gaya → infinite recursion. <code>l &gt;= r</code> safe hai.',
          'Right half <code>mid</code> se shuru karna (<code>mergeSort(arr, mid, r)</code>) → 2 elements pe infinite recursion.',
          'Har merge me <code>new int[n]</code> (poore size ka) → O(n log n) memory waste; sirf <code>r - l + 1</code> chahiye.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (insertion sort)', 'O(n²) worst / O(n) best', 'O(1)', 'har element peeche tak shift ho sakta hai'],
          ['Optimal (merge sort)', 'O(n log n) hamesha', 'O(n) + O(log n) stack', 'log n levels × O(n) merge per level; temp array'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['What is the time complexity of merge sort and why?', 'O(n log n) in every case. The array is halved log n times, and each level merges all n elements once, so n work per level times log n levels.'],
          ['What is the space complexity?', 'O(n) for the temporary array used in merging, plus O(log n) for the recursion stack. It is not in-place for arrays.'],
          ['Is merge sort stable? How do you ensure it?', 'Yes. In merge, when two elements are equal I take from the left half first, using less-than-or-equal. That keeps the original order of equal elements.'],
          ['Why compute mid as l + (r - l) / 2?', 'It avoids integer overflow when l and r are large, which (l + r) / 2 can cause.'],
          ['When would you prefer merge sort over quick sort?', 'When I need stability or a guaranteed O(n log n) worst case, and for linked lists or external sorting of huge files, where merging is sequential and cheap.'],
          ['How do you merge sort a linked list?', 'Find the middle with slow and fast pointers, split, sort both halves recursively, and merge two sorted lists by relinking nodes. That needs no extra array, only O(log n) stack.'],
          ['What does Java use internally?', 'Arrays.sort on objects and Collections.sort use TimSort, a stable merge-based hybrid with insertion sort for small runs. Primitive arrays use dual-pivot quicksort.'],
          ['What other problems use the merge step?', 'Counting inversions, reverse pairs, count of smaller numbers after self, and merging k sorted lists. While merging, you can count how many left elements are greater than a right element.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Merge sort is divide and conquer. If the range has zero or one element, it is already sorted. Otherwise I split at the middle, recursively sort the left and right halves, and then merge them. The merge uses two pointers, one on each sorted half, always copying the smaller element into a temporary array, then copying the leftovers and writing the result back. Each level does O(n) work and there are log n levels, so it is O(n log n) in all cases, with O(n) extra space. Taking from the left on ties keeps it stable.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['[5, 2, 4, 6, 1, 3] — sabse aakhri merge me kaunse do halves aate hain?', 'mid = 2 → left [2, 4, 5], right [1, 3, 6] → <b>[1, 2, 3, 4, 5, 6]</b>.'],
          ['Merge me <code>&lt;=</code> ki jagah <code>&lt;</code> likh diya — sort galat hoga?', 'Nahi, sort sahi rahega, par <b>stability</b> chali jaayegi (barabar me right wala pehle).'],
          ['n = 8 ke liye recursion tree ki depth aur kitni mergeSort calls?', 'Depth log₂8 = <b>3</b> levels of splitting; calls = 2n − 1 = <b>15</b>.'],
          ['Merge sort sorted input pe insertion sort se tez hai?', 'Nahi — sorted pe insertion sort <b>O(n)</b>, merge sort phir bhi O(n log n). Isliye TimSort chhote/sorted runs ke liye insertion sort use karta hai.'],
        ] },
        { olist: ['mergeSort + merge 5 min me bina dekhe likho.', 'Dry run table [5, 2, 4, 6, 1, 3] ka khud banao.', 'Stability ka reason 20 sec me English me bolo.'] },
      ] },
    ],
    checks: [
      'Brute (insertion) aur merge sort — dono ka idea + complexity bol sakta hoon',
      'Merge ka two-pointer logic aur bache hue elements wale loops samjha sakta hoon',
      'O(n log n) kyun aur O(n) space kahan se — recursion tree se bata sakta hoon',
      'mergeSort + merge 5 min me bina dekhe likh sakta hoon',
    ],
    memory: 'l >= r → return; mid; sort(l, mid); sort(mid+1, r); merge: i, j, k → chhota temp me (<= stable), bache copy, temp → arr[l + p].',
    tests: [
      { run: 'int[] a = {4,1,3,9,7}; o.mergeSort(a, 0, a.length - 1); System.out.print(Arrays.toString(a));', out: '[1, 3, 4, 7, 9]' },
      { run: 'int[] a = {10,9,8,7,6,5,4,3,2,1}; o.mergeSort(a, 0, a.length - 1); System.out.print(Arrays.toString(a));', out: '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]' },
      { run: 'int[] a = {1,3,2}; o.mergeSort(a, 0, a.length - 1); System.out.print(Arrays.toString(a));', out: '[1, 2, 3]' },
      { run: 'int[] a = {3,1,3,2,1}; o.mergeSort(a, 0, a.length - 1); System.out.print(Arrays.toString(a));', out: '[1, 1, 2, 3, 3]' },
      { run: 'int[] a = {5}; o.mergeSort(a, 0, a.length - 1); System.out.print(Arrays.toString(a));', out: '[5]' },
      { run: 'int[] a = {5,2,4,6,1,3}; o.mergeSort(a, 0, a.length - 1); System.out.print(Arrays.toString(a));', out: '[1, 2, 3, 4, 5, 6]' },
    ],
  };

  // =====================================================================
  // s2 — Quick Sort (Code360)
  // =====================================================================
  const S2 = [
    `public void quickSort(int[] arr, int low, int high) {
    // Problem quick sort maangta hai — ye sirf O(n²) baseline (bubble sort) hai
    for (int i = low; i < high; i++) {
        boolean swapped = false;
        for (int j = low; j < high - (i - low); j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    `public void quickSort(int[] arr, int low, int high) {
    List<Integer> list = new ArrayList<>();
    for (int i = low; i <= high; i++) list.add(arr[i]);
    List<Integer> sorted = sortList(list);
    for (int i = low; i <= high; i++) arr[i] = sorted.get(i - low);
}

private List<Integer> sortList(List<Integer> list) {
    if (list.size() <= 1) return list;
    int pivot = list.get(list.size() - 1);
    List<Integer> left = new ArrayList<>(), right = new ArrayList<>();
    for (int i = 0; i < list.size() - 1; i++) {
        if (list.get(i) < pivot) left.add(list.get(i));
        else right.add(list.get(i));
    }
    List<Integer> result = new ArrayList<>(sortList(left));
    result.add(pivot);
    result.addAll(sortList(right));
    return result;
}`,
    `public void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int p = partition(arr, low, high);
        quickSort(arr, low, p - 1);
        quickSort(arr, p + 1, high);
    }
}

private int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1; // arr[low..i] = pivot se chhote
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return i + 1;
}

private void swap(int[] arr, int a, int b) {
    int t = arr[a];
    arr[a] = arr[b];
    arr[b] = t;
}`,
  ];

  L.s2 = {
    kind: 'dsa', title: 'Quick Sort', topic: 'Sorting', diff: 'M',
    url: 'https://www.naukri.com/code360/problems/quick-sort_983625',
    pattern: 'Divide & conquer (partition around pivot)',
    oneLine: 'Pivot chuno, partition karo (chhote left, bade right) — pivot apni final jagah pe. Phir dono taraf recursion. Avg O(n log n), in-place.',
    goal: 'Array ko <b>quick sort</b> se sort karo. Asli seekh: <b>partition</b> — wahi idea jo a3 (Segregate 0s/1s) aur a4 (Sort Colors) me tha: ek pass me "chhote" ek taraf, "bade" doosri taraf. Merge sort (s1) me kaam <b>jodne</b> me tha; quick sort me kaam <b>todne</b> (partition) me hai, jodna free.',
    problem: {
      statement: 'You are given an array of integers. You need to sort the array in ascending order using the <b>quick sort</b> algorithm.<br><br>Quick sort is a divide-and-conquer algorithm: pick a <b>pivot</b> element, partition the array so that all elements smaller than the pivot come before it and all greater elements come after it, then recursively sort the two parts.<br><br>Implement <code>void quickSort(int[] arr, int low, int high)</code> — sort in place; it is called with <code>low = 0</code>, <code>high = n - 1</code>.',
      examples: [
        { input: 'arr = [4, 2, 5, 1, 3]', output: '[1, 2, 3, 4, 5]', explain: 'Pivot 3 (last) → partition [2, 1] | 3 | [4, 5]; dono hisse recursively sort → 1 2 3 4 5.', viz: { arr: '4, 2, 5, 1, 3' } },
        { input: 'arr = [1, 2, 3, 4, 5]', output: '[1, 2, 3, 4, 5]', explain: 'Apna example: already sorted. Last-element pivot har baar sabse bada → ek taraf n−1, doosri taraf 0 → <b>worst case O(n²)</b>. (Bubble sort yahan ek pass me ruk jaata hai.)', viz: { arr: '1, 2, 3, 4, 5' } },
        { input: 'arr = [3, 6, 2, 3, 1]', output: '[1, 2, 3, 3, 6]', explain: 'Apna example: duplicates. Pivot 1 → sab bade, p = 0 → [1, 6, 2, 3, 3]; phir pivot 3 → [2] | 3 | [3, 6]. Doosra 3 (≥ pivot) right me gaya — quick sort barabar values ka order guarantee nahi karta.', viz: { arr: '3, 6, 2, 3, 1' } },
      ],
      constraints: ['1 <= N <= 10^5 (typical)', '-10^9 <= arr[i] <= 10^9'],
    },
    approaches: [
      { level: 'Brute', idea: 'Problem quick sort maangta hai — ye sirf comparison baseline hai: <b>bubble sort</b>. Har pass me padosiyon ko compare karke bada aage dhakelo; ek pass me koi swap nahi toh sorted → ruk jao.', time: 'O(n²) (sorted pe O(n))', space: 'O(1)', code: S2[0] },
      { level: 'Better', idea: 'Quick sort ka idea, par <b>naye lists</b> bana ke: pivot = last, baaki ko <code>left</code> (&lt; pivot) aur <code>right</code> (≥ pivot) lists me daalo, dono recursively sort, <code>left + pivot + right</code> jodo. Samajhne me aasaan, par har level pe O(n) nayi memory (in-place nahi).', time: 'O(n log n) avg, O(n²) worst', space: 'O(n) extra per level (O(n log n) total avg, O(n²) worst)', code: S2[1] },
      { level: 'Optimal', idea: '<b>In-place quick sort</b> (Lomuto partition): pivot = arr[high], <code>i</code> = "chhote" hisse ka end. j se scan: arr[j] &lt; pivot → i++, swap(i, j). End me pivot ko i+1 pe swap — wo apni final jagah pe. Phir (low, p−1) aur (p+1, high) pe recursion.', time: 'O(n log n) avg, O(n²) worst', space: 'O(log n) stack avg (O(n) worst)', code: S2[2] },
    ],
    viz: {
      title: 'Quick Sort — Lomuto partition (in-place)',
      inputs: [{ key: 'arr', label: 'arr', def: '4, 2, 5, 1, 3' }],
      run({ arr }) {
        const a = arr.slice(), n = a.length, code = S2[2], find = K.finder(code), cs = K.callStack(), fs = [], fixed = new Set();
        const loc = F => {
          const v = { arr: K.iA(a) };
          if (F.kind === 'swap') { v.a = F.a; v.b = F.b; if (F.t !== undefined) v.t = F.t; return v; }
          v.low = F.low; v.high = F.high;
          ['p', 'pivot', 'i', 'j'].forEach(key => { if (F[key] !== undefined) v[key] = F[key]; });
          return v;
        };
        const { st, steps } = K.tracer(code, o => {
          let R = null, P = null;
          for (let q = fs.length - 1; q >= 0; q--) { if (!R && fs[q].kind !== 'swap') R = fs[q]; if (!P && fs[q].kind === 'part') P = fs[q]; }
          let hl = {};
          fixed.forEach(x => { hl[x] = 'found'; });
          const ptr = [];
          if (P && P === R) {
            if (P.i !== undefined && P.i >= P.low) hl = K.rng(P.low, P.i, 'done', hl);
            if (P.i !== undefined && P.i >= P.low) ptr.push({ i: P.i, label: 'i' });
            if (P.j !== undefined && P.j < P.high) ptr.push({ i: P.j, label: 'j' });
            ptr.push({ i: P.high, label: 'pivot' });
          }
          if (R && R.low <= R.high) hl = K.rng(R.low, R.high, 'win', hl);
          Object.assign(hl, o.hl || {});
          const frames = cs.frames(o.ln);
          return { views: [K.A('arr', a, hl, ptr)], vars: frames[0].vars, frames };
        });
        const S = (snip, note, o) => st(snip, note, Object.assign({ ln: find(snip) }, o || {}));
        const ALL = () => K.rng(0, n - 1, 'found');

        const swap = (x, y) => {
          const F = { kind: 'swap', a: x, b: y };
          fs.push(F);
          cs.push('swap', `arr, a=${x}, b=${y}`, () => loc(F));
          S('private void swap', x === y ? `swap(${x}, ${y}) — same index, khud se swap (koi badlaav nahi)` : `swap(${x}, ${y}): arr[${x}] = ${a[x]} ↔ arr[${y}] = ${a[y]}`, { hl: { [x]: 'cur', [y]: 'cur' } });
          F.t = a[x];
          S('int t = arr[a]', `t = arr[${x}] = ${F.t}`, { hl: { [x]: 'cur', [y]: 'cur' } });
          a[x] = a[y];
          S('arr[a] = arr[b]', `arr[${x}] = arr[${y}] = ${a[x]}`, { hl: { [x]: 'new', [y]: 'cur' } });
          a[y] = F.t;
          S('arr[b] = t', `arr[${y}] = t = ${F.t} → ${K.iA(a)}`, { hl: { [x]: 'new', [y]: 'new' } });
          fs.pop(); cs.pop();
        };

        const part = (low, high) => {
          const F = { kind: 'part', low, high };
          fs.push(F);
          cs.push('partition', `arr, low=${low}, high=${high}`, () => loc(F));
          S('private int partition', `partition(${low}, ${high}) — range ${K.iA(a.slice(low, high + 1))}`);
          F.pivot = a[high];
          S('int pivot = arr[high]', `pivot = arr[${high}] = ${F.pivot} (last element)`);
          F.i = low - 1;
          S('int i = low - 1', `i = ${F.i} — "pivot se chhote" hissa abhi khaali`);
          for (F.j = low; ; F.j++) {
            if (!(F.j < high)) { S('for (int j = low', `j = ${F.j} == high → scan khatam. Chhote: arr[${low}..${F.i}] = ${K.iA(a.slice(low, F.i + 1))}`); break; }
            S('for (int j = low', `j = ${F.j} < ${high} ✓ — arr[${F.j}] = ${a[F.j]}`, { hl: { [F.j]: 'cur' } });
            if (a[F.j] < F.pivot) {
              S('if (arr[j] < pivot)', `${a[F.j]} < pivot ${F.pivot} ✓ → chhote hisse me daalo`, { hl: { [F.j]: 'cur' } });
              F.i++;
              S('i++', `i++ → ${F.i} (chhota hissa ek bada hua)`);
              S('swap(arr, i, j)', `swap(arr, ${F.i}, ${F.j}) — arr[${F.j}] = ${a[F.j]} ko chhote hisse ke end pe lao`, { hl: { [F.i]: 'cur', [F.j]: 'cur' } });
              swap(F.i, F.j);
            } else {
              S('if (arr[j] < pivot)', `${a[F.j]} ≥ pivot ${F.pivot} → bada hai, yahin rehne do`, { hl: { [F.j]: 'skip' } });
            }
          }
          const p = F.i + 1;
          S('swap(arr, i + 1, high)', `Pivot ${F.pivot} ko index i + 1 = ${p} pe lao (chhote ke turant baad)`, { hl: { [p]: 'cur', [high]: 'cur' } });
          swap(p, high);
          fixed.add(p);
          S('return i + 1', `return ${p} — left ${K.iA(a.slice(low, p))} < ${a[p]} ≤ right ${K.iA(a.slice(p + 1, high + 1))}`, { hl: { [p]: 'found' } });
          fs.pop(); cs.pop();
          return p;
        };

        const qs = (low, high, top) => {
          const F = { kind: 'qs', low, high };
          fs.push(F);
          cs.push('quickSort', `arr, low=${low}, high=${high}`, () => loc(F));
          S('public void quickSort', `quickSort(low = ${low}, high = ${high}) — range ${K.iA(a.slice(low, high + 1))}`);
          const done = () => { fs.pop(); cs.pop(); };
          if (!(low < high)) {
            if (low === high) fixed.add(low);
            S('if (low < high)', `low (${low}) < high (${high}) ✗ → ${low === high ? '1 element' : 'khaali range'}, already sorted → return`, top ? { hl: ALL(), ret: K.iA(a) } : {});
            return done();
          }
          S('if (low < high)', `low (${low}) < high (${high}) ✓ → partition karo`);
          S('int p = partition', `partition(arr, ${low}, ${high}) call — pivot = arr[${high}] = ${a[high]}`);
          F.p = part(low, high);
          S('int p = partition', `Wapas aaye: p = ${F.p} — pivot ${a[F.p]} apni final jagah pe`, { hl: { [F.p]: 'found' } });
          S('quickSort(arr, low, p - 1)', `Left part sort karo: quickSort(${low}, ${F.p - 1}) → ${K.iA(a.slice(low, F.p))}`, { hl: F.p - 1 >= low ? K.rng(low, F.p - 1, 'cur') : {} });
          qs(low, F.p - 1);
          S('quickSort(arr, p + 1, high)', `Right part sort karo: quickSort(${F.p + 1}, ${high}) → ${K.iA(a.slice(F.p + 1, high + 1))}`, { hl: F.p + 1 <= high ? K.rng(F.p + 1, high, 'cur') : {} });
          qs(F.p + 1, high);
          S('quickSort(arr, p + 1, high)', top ? `Dono parts sorted → poora array sorted: ${K.iA(a)}` : `Wapas aaye: arr[${low}..${high}] = ${K.iA(a.slice(low, high + 1))} sorted → caller pe wapas`, top ? { hl: ALL(), ret: K.iA(a) } : {});
          done();
        };
        qs(0, n - 1, true);
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Bubble sort (baseline)',
          run({ arr }) {
            const a = arr.slice(), n = a.length, low = 0, high = n - 1;
            let i, swapped, j, temp, lim = n;
            const V = () => Object.assign({ arr: K.iA(a), low, high }, i !== undefined ? { i } : {}, swapped !== undefined ? { swapped } : {}, j !== undefined ? { j } : {}, temp !== undefined ? { temp } : {});
            const { st, steps } = K.tracer(S2[0], o => ({ views: [K.A('arr', a, o.hl, o.ptr)], vars: V() }));
            const H = extra => Object.assign(K.rng(lim, n - 1, 'done'), extra || {});
            const PT = () => (j !== undefined && j < n - 1 ? [{ i: j, label: 'j' }, { i: j + 1, label: 'j+1' }] : []);
            st('public void quickSort', `Method call: arr = ${K.iA(a)}, low = 0, high = ${high} (Brute baseline: bubble sort)`);
            for (i = low; ; i++) {
              if (!(i < high)) { j = undefined; st('for (int i = low', `i = ${i} == high → saare passes ho gaye → sorted ${K.iA(a)}`, { hl: K.rng(0, n - 1, 'found'), ret: K.iA(a) }); break; }
              swapped = undefined; j = undefined;
              st('for (int i = low', `Pass i = ${i}: ${i} < ${high} ✓`, { hl: H() });
              swapped = false;
              st('boolean swapped = false', 'swapped = false — is pass me abhi koi swap nahi', { hl: H() });
              const end = high - (i - low);
              for (j = low; ; j++) {
                if (!(j < end)) { lim = end; st('for (int j = low', `j = ${j} == ${end} → pass khatam, arr[${end}] = ${a[end]} apni final jagah pe (sabse bada bubble up)`, { hl: H({ [end]: 'found' }) }); break; }
                st('for (int j = low', `j = ${j} < ${end} ✓ — compare arr[${j}] = ${a[j]}, arr[${j + 1}] = ${a[j + 1]}`, { hl: H({ [j]: 'cur', [j + 1]: 'cur' }), ptr: PT() });
                if (a[j] > a[j + 1]) {
                  st('if (arr[j] > arr[j + 1])', `${a[j]} > ${a[j + 1]} ✓ → galat order, swap`, { hl: H({ [j]: 'cur', [j + 1]: 'cur' }), ptr: PT() });
                  temp = a[j];
                  st('int temp = arr[j]', `temp = ${temp}`, { hl: H({ [j]: 'cur', [j + 1]: 'cur' }), ptr: PT() });
                  a[j] = a[j + 1];
                  st('arr[j] = arr[j + 1]', `arr[${j}] = ${a[j]}`, { hl: H({ [j]: 'new', [j + 1]: 'cur' }), ptr: PT() });
                  a[j + 1] = temp;
                  st('arr[j + 1] = temp', `arr[${j + 1}] = ${temp} → ${K.iA(a)}`, { hl: H({ [j]: 'new', [j + 1]: 'new' }), ptr: PT() });
                  temp = undefined;
                  swapped = true;
                  st('swapped = true', 'swapped = true — is pass me kuch badla', { hl: H(), ptr: PT() });
                } else {
                  st('if (arr[j] > arr[j + 1])', `${a[j]} > ${a[j + 1]} ✗ → order sahi`, { hl: H({ [j]: 'skip', [j + 1]: 'skip' }), ptr: PT() });
                }
              }
              j = undefined;
              if (!swapped) { st('if (!swapped) break', `swapped = false → poore pass me koi swap nahi → already sorted → break: ${K.iA(a)}`, { hl: K.rng(0, n - 1, 'found'), ret: K.iA(a) }); break; }
              st('if (!swapped) break', 'swapped = true → abhi sorted pakka nahi → agla pass', { hl: H() });
            }
            return steps;
          },
        },
        {
          ap: 1, label: 'Naye lists (not in-place)',
          run({ arr }) {
            const a = arr.slice(), n = a.length, low = 0, high = n - 1, code = S2[1], find = K.finder(code), cs = K.callStack(), fs = [];
            const T = { kind: 'top' };
            const loc = F => {
              if (F.kind === 'top') {
                const v = { arr: K.iA(a), low, high };
                if (F.list) v.list = K.iA(F.list);
                if (F.sorted) v.sorted = K.iA(F.sorted);
                if (F.i !== undefined) v.i = F.i;
                return v;
              }
              const v = { list: K.iA(F.list) };
              if (F.pivot !== undefined) v.pivot = F.pivot;
              if (F.left) { v.left = K.iA(F.left); v.right = K.iA(F.right); }
              if (F.i !== undefined) v.i = F.i;
              if (F.result) v.result = K.iA(F.result);
              return v;
            };
            const { st, steps } = K.tracer(code, o => {
              const F = fs[fs.length - 1];
              const views = [K.A('arr', a, o.hl || {}, o.ptr || [])];
              if (F && F.kind === 'sl') {
                if (F.list.length) views.push(K.A('list (is call ka)', F.list, o.lh || {}, F.i !== undefined && F.i < F.list.length ? [{ i: F.i, label: 'i' }] : []));
                if (F.left) views.push(K.X('left | pivot | right', `${K.iA(F.left)} | ${F.pivot} | ${K.iA(F.right)}`));
                if (F.result) views.push(K.X('result', K.iA(F.result)));
              }
              const frames = cs.frames(o.ln);
              return { views, vars: frames[0].vars, frames };
            });
            const S = (snip, note, o) => st(snip, note, Object.assign({ ln: find(snip) }, o || {}));

            const sl = list => {
              const F = { kind: 'sl', list };
              fs.push(F);
              cs.push('sortList', `list=${K.iA(list)}`, () => loc(F));
              S('private List<Integer> sortList', `sortList(${K.iA(list)})`);
              if (list.length <= 1) {
                S('if (list.size() <= 1) return list', `size ${list.length} ≤ 1 → already sorted → return ${K.iA(list)}`);
                fs.pop(); cs.pop();
                return list;
              }
              S('if (list.size() <= 1) return list', `size ${list.length} > 1 → partition karna padega`);
              F.pivot = list[list.length - 1];
              S('int pivot = list.get', `pivot = last = ${F.pivot}`, { lh: { [list.length - 1]: 'found' } });
              F.left = []; F.right = [];
              S('List<Integer> left = new ArrayList', 'left = [], right = [] — naye lists (yahi extra memory hai)', { lh: { [list.length - 1]: 'found' } });
              for (F.i = 0; ; F.i++) {
                if (!(F.i < list.length - 1)) { S('for (int i = 0; i < list.size() - 1', `i = ${F.i} → pivot ke alawa sab baant diye: left = ${K.iA(F.left)}, right = ${K.iA(F.right)}`, { lh: { [list.length - 1]: 'found' } }); break; }
                S('for (int i = 0; i < list.size() - 1', `i = ${F.i}: list.get(${F.i}) = ${list[F.i]}`, { lh: { [F.i]: 'cur', [list.length - 1]: 'found' } });
                const x = list[F.i];
                if (x < F.pivot) {
                  F.left.push(x);
                  S('if (list.get(i) < pivot) left.add', `${x} < ${F.pivot} ✓ → left = ${K.iA(F.left)}`, { lh: { [F.i]: 'new', [list.length - 1]: 'found' } });
                } else {
                  S('if (list.get(i) < pivot) left.add', `${x} < ${F.pivot} ✗`, { lh: { [F.i]: 'skip', [list.length - 1]: 'found' } });
                  F.right.push(x);
                  S('else right.add', `${x} ≥ ${F.pivot} → right = ${K.iA(F.right)}`, { lh: { [F.i]: 'new', [list.length - 1]: 'found' } });
                }
              }
              F.i = undefined;
              S('List<Integer> result = new ArrayList<>(sortList(left))', `left ${K.iA(F.left)} ko recursively sort karo`);
              const sL = sl(F.left.slice());
              F.result = sL.slice();
              S('List<Integer> result = new ArrayList<>(sortList(left))', `Wapas aaye: result = sorted left = ${K.iA(F.result)}`);
              F.result.push(F.pivot);
              S('result.add(pivot)', `pivot ${F.pivot} jodo → result = ${K.iA(F.result)}`);
              S('result.addAll(sortList(right))', `right ${K.iA(F.right)} ko recursively sort karo`);
              const sR = sl(F.right.slice());
              F.result.push(...sR);
              S('result.addAll(sortList(right))', `Wapas aaye: sorted right ${K.iA(sR)} jodo → result = ${K.iA(F.result)}`);
              S('return result', `return ${K.iA(F.result)}`);
              fs.pop(); cs.pop();
              return F.result;
            };

            fs.push(T);
            cs.push('quickSort', `arr, low=0, high=${high}`, () => loc(T));
            S('public void quickSort', `Method call: arr = ${K.iA(a)}, low = 0, high = ${high} (Better: naye lists wala quick sort)`);
            T.list = [];
            S('List<Integer> list = new ArrayList', 'list = [] — range ko list me copy karenge');
            for (T.i = low; ; T.i++) {
              if (!(T.i <= high)) { S(['for (int i = low', 1], `i = ${T.i} > high → copy done: list = ${K.iA(T.list)}`); break; }
              T.list.push(a[T.i]);
              S(['for (int i = low', 1], `list.add(arr[${T.i}] = ${a[T.i]}) → ${K.iA(T.list)}`, { hl: { [T.i]: 'cur' } });
            }
            T.i = undefined;
            S('List<Integer> sorted = sortList(list)', `sortList(${K.iA(T.list)}) call`);
            T.sorted = sl(T.list.slice());
            S('List<Integer> sorted = sortList(list)', `Wapas aaye: sorted = ${K.iA(T.sorted)}`);
            for (T.i = low; ; T.i++) {
              if (!(T.i <= high)) { T.i = undefined; S(['for (int i = low', 2], `copy back done → arr = ${K.iA(a)}`, { hl: K.rng(0, n - 1, 'found'), ret: K.iA(a) }); break; }
              a[T.i] = T.sorted[T.i - low];
              S(['for (int i = low', 2], `arr[${T.i}] = sorted.get(${T.i - low}) = ${a[T.i]}`, { hl: Object.assign(K.rng(0, T.i - 1, 'done'), { [T.i]: 'new' }) });
            }
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Partition: pivot ko uski final jagah pe bhejo', blocks: [
        { p: 'a3 (Segregate 0s/1s) me ek pass me "0" left aur "1" right kiya tha; a4 (Sort Colors) me 3 hisse. Quick sort me rule hai: <b>pivot se chhote left, baaki right</b>. Partition ke baad pivot <b>apni final sorted jagah</b> pe hai — usse dobara chhoona nahi. Phir left aur right ko alag-alag same tareeke se sort karo.' },
        { pre: `Lomuto partition — pivot = arr[high]
[ chhote (< pivot) | bade (>= pivot) | ? ? ? ? | pivot ]
  low ........ i     i+1 ...... j-1   j ...      high

arr[j] < pivot → i++, swap(i, j)   (chhote hisse ko ek bada karo)
arr[j] >= pivot → kuch nahi, j++
end: swap(i+1, high) → pivot beech me, return i+1` },
        { p: '<b>Merge sort (s1) se farq:</b> merge sort me todna free (mid) aur jodna mehnat (merge). Quick sort me todna mehnat (partition) aur jodna free — partition ke baad dono hisse apni jagah pe hain, kuch merge nahi karna. Isliye <b>in-place</b>, extra array nahi.' },
        { p: '<b>Pivot choice = sab kuch.</b> Pivot har baar beech ka nikla → do barabar hisse → log n levels → O(n log n). Pivot har baar sabse bada/chhota (jaise sorted array + last pivot) → n−1 aur 0 → n levels → <b>O(n²)</b>. Fix: <b>random pivot</b> (random index ko high se swap karke phir Lomuto) ya median-of-three — expected O(n log n) kisi bhi input pe.' },
        { tip: '<b>Stable nahi hai</b>: long-distance swaps barabar values ka order badal dete hain. Java: <code>Arrays.sort(int[])</code> = <b>dual-pivot quicksort</b> (primitives — stability ka matlab nahi, fast + in-place); <code>Arrays.sort(Object[])</code> / <code>Collections.sort</code> = <b>TimSort</b> (stable, merge-based).' },
      ] },
      { title: '📄 Problem — Quick Sort (Code360)', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — koi bhi simple O(n²) sort (baseline)' },
        { p: 'Problem saaf <b>quick sort</b> maangta hai. Baseline: <b>bubble sort</b> — padosi galat order me ho toh swap; har pass ke baad sabse bada end pe pahunch jaata hai; kisi pass me swap nahi hua toh ruk jao. <b>O(n²)</b>, O(1).' },
        { h: '2. Better — quick sort, naye lists ke saath' },
        { p: 'Asli quick sort idea: pivot (last) lo, baaki elements ko <code>left</code> (&lt; pivot) aur <code>right</code> (≥ pivot) <b>naye lists</b> me daalo, dono recursively sort karo, <code>left + [pivot] + right</code>. Avg <b>O(n log n)</b> — par har level pe O(n) nayi memory aur copying. Interview me idea samjhane ke liye best, code ke liye nahi.' },
        { h: '3. Optimal — in-place quick sort (Lomuto partition)' },
        { p: 'Naye lists ki zaroorat nahi: a3/a4 jaisa two-pointer partition array ke andar hi chhote-bade alag kar deta hai. <code>i</code> = chhote hisse ka end, <code>j</code> = scanner. Avg <b>O(n log n)</b> time, sirf <b>O(log n)</b> recursion stack. Worst O(n²) (bura pivot) — random pivot se practically avoid.' },
        { tip: '<b>Hoare partition</b> (do pointers dono end se, a3 jaisa) Lomuto se ~3× kam swaps karta hai aur duplicates pe behtar hai, par pivot final jagah pe guarantee nahi hota — recursion (low, p) aur (p+1, high) pe hoti hai. Interview me Lomuto likhna aasaan, Hoare ka naam + farq bata do.' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — arr = [4, 2, 5, 1, 3] (Optimal)', blocks: [
        { table: { head: ['Call', 'pivot', 'j / arr[j]', 'Action', 'arr baad me'], rows: [
          ['partition(0, 4)', '3', 'j=0: 4', '4 ≥ 3 → skip', '[4, 2, 5, 1, 3]'],
          ['', '', 'j=1: 2', '2 < 3 → i=0, swap(0,1)', '[2, 4, 5, 1, 3]'],
          ['', '', 'j=2: 5', 'skip', '[2, 4, 5, 1, 3]'],
          ['', '', 'j=3: 1', '1 < 3 → i=1, swap(1,3)', '[2, 1, 5, 4, 3]'],
          ['', '', 'end', 'swap(2, 4), p = 2', '[2, 1, <b>3</b>, 4, 5]'],
          ['partition(0, 1)', '1', 'j=0: 2', 'skip; swap(0, 1), p = 0', '[<b>1</b>, 2, 3, 4, 5]'],
          ['partition(3, 4)', '5', 'j=3: 4', '4 < 5 → i=3, swap(3,3); swap(4,4), p = 4', '[1, 2, 3, 4, <b>5</b>]'],
        ] } },
        { p: 'Baaki calls (0,−1), (1,1), (3,3), (5,4) base case → return. Final <b>[1, 2, 3, 4, 5]</b>.' },
        { p: '<b>Example 2 (sorted [1,2,3,4,5])</b>: pivot 5 → sab chhote, p = 4; pivot 4 → p = 3; ... har call sirf 1 element kam karti hai → 4 + 3 + 2 + 1 comparisons, recursion depth n → <b>O(n²)</b> worst case live dekho visualizer me.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: S2[2] },
        { lines: [
          ['if (low < high)', '2+ elements ho tabhi kaam; 0/1 element already sorted.'],
          ['int p = partition(arr, low, high);', 'Pivot ko final jagah pe bhejo, uska index lo.'],
          ['quickSort(arr, low, p - 1);', 'Pivot ke left wale (sab chhote) sort.'],
          ['quickSort(arr, p + 1, high);', 'Pivot ke right wale (sab ≥ pivot) sort. p khud dobara nahi.'],
          ['int pivot = arr[high];', 'Lomuto: last element pivot. (Random pivot: pehle random index ko high se swap.)'],
          ['int i = low - 1;', 'arr[low..i] = pivot se chhote. Shuru me khaali.'],
          ['for (int j = low; j < high; j++)', 'high (pivot) ko chhod ke sab scan.'],
          ['if (arr[j] < pivot) { i++; swap(arr, i, j); }', 'Chhota mila → chhote hisse ko ek bada karo aur use wahan lao.'],
          ['swap(arr, i + 1, high);', 'Pivot ko chhote hisse ke turant baad rakho — final jagah.'],
          ['return i + 1;', 'Pivot ka index.'],
          ['swap(int[] arr, int a, int b)', 'Teen line ka classic swap (temp variable).'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute (bubble) → Better (naye lists) → Optimal (in-place Lomuto)</b>. Optimal tab me CALL STACK + 🌳 call tree (low, high) dekho; green = pivot apni final jagah pe. Example 2 (sorted) pe call tree ek lambi tedhi line ban jaata hai — wahi O(n²) worst case. Apna input: <code>5, 1, 4, 2, 3</code>.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Ek element / khaali range → <code>low &lt; high</code> false, turant return.',
          'Already sorted ya reverse sorted + last pivot → O(n²) aur recursion depth n (bade n pe StackOverflowError ka risk) → random pivot.',
          'Sab same <code>[2, 2, 2, 2]</code> → Lomuto me bhi O(n²) (har baar ek taraf sab). Fix: 3-way partition (Dutch flag, a4!) — &lt;, =, &gt; pivot.',
          'Negative numbers / bade values → comparison only, koi farq nahi.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Recursion me pivot ko shaamil karna: <code>quickSort(arr, low, p)</code> (Lomuto ke saath) → infinite recursion ho sakta hai.',
          '<code>i = low</code> se shuru (low − 1 nahi) → pehla swap galat jagah.',
          'Loop <code>j &lt;= high</code> tak → pivot khud se compare hota hai, end swap gadbad.',
          'End me <code>swap(i, high)</code> likhna (<code>i + 1</code> nahi) → pivot chhote hisse ke andar chala jaata hai.',
          'Quick sort ko stable bolna — nahi hai.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (bubble sort)', 'O(n²) / O(n) sorted pe', 'O(1)', 'har pass O(n), n passes; early break'],
          ['Better (naye lists)', 'O(n log n) avg, O(n²) worst', 'O(n) per level (O(n log n) avg total)', 'har call nayi left/right lists banata hai'],
          ['Optimal (in-place Lomuto)', 'O(n log n) avg, O(n²) worst', 'O(log n) stack avg, O(n) worst', 'partition O(n) per level; depth log n (accha pivot) ya n (bura pivot)'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['What is the time complexity of quick sort?', 'Average O(n log n): partition is O(n) per level and a reasonable pivot gives about log n levels. Worst case O(n squared) when the pivot is always the smallest or largest element.'],
          ['When does the worst case happen and how do you avoid it?', 'With a fixed first or last pivot on sorted or reverse-sorted input, or many duplicates. A random pivot or median-of-three makes O(n log n) the expected case for any input; three-way partitioning handles duplicates.'],
          ['What is the space complexity?', 'It sorts in place, so the only extra space is the recursion stack: O(log n) on average, O(n) in the worst case. Recursing into the smaller part first and looping on the larger keeps it O(log n).'],
          ['Is quick sort stable?', 'No. Partition swaps elements across long distances, which can change the relative order of equal elements.'],
          ['Lomuto vs Hoare partition?', 'Lomuto uses the last element as pivot and one scanning pointer; it is simpler and puts the pivot in its final place. Hoare uses two pointers from both ends, does fewer swaps and handles duplicates better, but the pivot does not necessarily end at the returned index.'],
          ['Why is quick sort often faster than merge sort in practice?', 'It works in place with sequential memory access, so it is cache friendly and has small constants, and it avoids allocating a temporary array.'],
          ['What does Java use for Arrays.sort?', 'For primitive arrays, a dual-pivot quicksort, since stability does not matter for primitives. For objects and Collections.sort, TimSort, which is stable.'],
          ['How does partition help find the k-th smallest element?', 'Quickselect: after partition the pivot is at its final index; recurse only into the side that contains k. That is O(n) on average.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Quick sort is divide and conquer built on partitioning. I pick the last element as the pivot and scan the range with a pointer j, keeping an index i for the end of the smaller-than-pivot region. Whenever arr[j] is smaller than the pivot, I increment i and swap. At the end I swap the pivot into position i plus one, which is its final sorted place, and recurse on the left and right parts. Average time is O(n log n), worst case O(n squared) for bad pivots like sorted input, which a random pivot avoids. It is in place with O(log n) stack on average, but not stable.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['[5, 1, 4, 2, 3] — pehle partition ke baad array aur p?', 'pivot 3: 1 &lt; 3 → swap(0,1) → [1,5,4,2,3]; 2 &lt; 3 → swap(1,3) → [1,2,4,5,3]; end swap(2,4) → <b>[1, 2, 3, 5, 4]</b>, p = <b>2</b>.'],
          ['[1, 2, 3, 4, 5, 6] pe last-pivot quick sort ki recursion depth?', '<b>6</b> levels (har baar sirf pivot alag hota hai) → O(n²) comparisons = 15.'],
          ['Better (naye lists) aur Optimal ka time same hai — phir Optimal kyun?', 'Memory: Better har level pe O(n) nayi lists banata hai; Optimal in-place, sirf O(log n) stack. Copying bhi bachti hai.'],
          ['Sab duplicates [2,2,2,2] pe Lomuto kaisa chalega, fix kya?', 'O(n²) — har baar ek taraf sab. Fix: <b>3-way partition</b> (a4 Dutch flag) — = pivot wale beech me, unpe recursion nahi.'],
        ] },
        { olist: ['quickSort + partition + swap 5 min me bina dekhe likho.', 'Dry run [4, 2, 5, 1, 3] ka partition table khud banao.', 'Merge sort vs quick sort (time, space, stability, Java use) 30 sec me English me bolo.'] },
      ] },
    ],
    checks: [
      'Brute, Better (naye lists) aur in-place quick sort — teeno ka idea + complexity bol sakta hoon',
      'Lomuto partition ke invariants (low..i chhote, i+1..j−1 bade) samjha sakta hoon',
      'Worst case kab aur random pivot / 3-way partition se fix bata sakta hoon',
      'quickSort + partition 5 min me bina dekhe likh sakta hoon',
    ],
    memory: 'pivot = arr[high]; i = low − 1; j: arr[j] < pivot → i++, swap(i, j); swap(i+1, high); return i+1. Recurse (low, p−1), (p+1, high).',
    tests: [
      { run: 'int[] a = {4,2,5,1,3}; o.quickSort(a, 0, a.length - 1); System.out.print(Arrays.toString(a));', out: '[1, 2, 3, 4, 5]' },
      { run: 'int[] a = {1,2,3,4,5}; o.quickSort(a, 0, a.length - 1); System.out.print(Arrays.toString(a));', out: '[1, 2, 3, 4, 5]' },
      { run: 'int[] a = {3,6,2,3,1}; o.quickSort(a, 0, a.length - 1); System.out.print(Arrays.toString(a));', out: '[1, 2, 3, 3, 6]' },
      { run: 'int[] a = {7}; o.quickSort(a, 0, a.length - 1); System.out.print(Arrays.toString(a));', out: '[7]' },
      { run: 'int[] a = {-5,10,0,-5,3}; o.quickSort(a, 0, a.length - 1); System.out.print(Arrays.toString(a));', out: '[-5, -5, 0, 3, 10]' },
      { run: 'int[] a = {5,4,3,2,1,0}; o.quickSort(a, 0, a.length - 1); System.out.print(Arrays.toString(a));', out: '[0, 1, 2, 3, 4, 5]' },
      { run: 'int[] a = {2,2,2,2}; o.quickSort(a, 0, a.length - 1); System.out.print(Arrays.toString(a));', out: '[2, 2, 2, 2]' },
    ],
  };
})();
