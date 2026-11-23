// Planner lessons — Hashing part 2 (h2 Valid Anagram, h3 Top K Frequent Elements)
// Format: dsa-arrays-two-pointers.js jaisa. Viz steps: lesson-kit.js tracer (har line = ek step, VARIABLES me saare locals).
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  const q = s => '"' + s + '"';
  const sortedStr = a => K.iA(a.slice().sort((x, y) => x - y));
  // Java HashMap<Integer, ?> ka iteration order (bucket index = (h ^ h>>>16) & (cap-1), bucket ke andar insertion order)
  const javaOrder = keys => {
    let cap = 16;
    while (keys.length > cap * 0.75) cap *= 2;
    const ix = k => ((k | 0) ^ ((k | 0) >>> 16)) & (cap - 1);
    return keys.map((k, i) => [k, i]).sort((a, b) => ix(a[0]) - ix(b[0]) || a[1] - b[1]).map(p => p[0]);
  };

  // =====================================================================
  // h2 — Valid Anagram (LC 242)
  // =====================================================================
  const H2 = [
    `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    char[] a = s.toCharArray();
    char[] b = t.toCharArray();
    Arrays.sort(a);
    Arrays.sort(b);
    return Arrays.equals(a, b);
}`,
    `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    Map<Character, Integer> count = new HashMap<>(); // char -> kitni baar
    for (char c : s.toCharArray()) count.put(c, count.getOrDefault(c, 0) + 1);
    for (char c : t.toCharArray()) {
        if (count.getOrDefault(c, 0) == 0) return false;
        count.put(c, count.get(c) - 1);
    }
    return true;
}`,
    `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] count = new int[26]; // index 0 = 'a' ... 25 = 'z'
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;
        count[t.charAt(i) - 'a']--;
    }
    for (int c : count) {
        if (c != 0) return false;
    }
    return true;
}`,
  ];
  const anaInputs = [{ key: 's', label: 's', def: 'anagram', type: 'str' }, { key: 't', label: 't', def: 'nagaram', type: 'str' }];
  const chars = s => s.split('');
  const lenStep = (st, s, t, extra) => {
    if (s.length !== t.length) { st('if (s.length() != t.length())', `s.length() = ${s.length} != t.length() = ${t.length} → length hi alag, anagram ho hi nahi sakta → return false`, Object.assign({ ret: 'false' }, extra)); return true; }
    st('if (s.length() != t.length())', `s.length() = ${s.length} == t.length() = ${t.length} → aage badho`, extra);
    return false;
  };

  L.h2 = {
    kind: 'dsa', title: 'Valid Anagram', topic: 'Hashing', diff: 'E', lc: 242,
    url: 'https://leetcode.com/problems/valid-anagram/',
    pattern: 'Frequency counting (int[26] / HashMap)',
    oneLine: 'Anagram = same letters, same ginti. int[26]: s ke char pe ++, t ke char pe −−; end me sab 0 → true.',
    goal: 'Check karo ki <code>t</code>, <code>s</code> ke hi letters ko re-arrange karke bana hai ya nahi. Asli seekh: <b>frequency counting</b> — Two Sum (a1) aur Contains Duplicate (h1) me HashMap/HashSet se "dekha kya?" pucha tha, aaj puchenge <b>"kitni baar dekha?"</b>. Aur jab keys sirf a–z ho, toh HashMap ki jagah <b>int[26]</b> kaafi hai.',
    problem: {
      statement: 'Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an <b>anagram</b> of <code>s</code>, and <code>false</code> otherwise.<br><br>An <b>anagram</b> is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.<br><br><b>Follow up:</b> What if the inputs contain Unicode characters? How would you adapt your solution to such a case?',
      examples: [
        { input: 's = "anagram", t = "nagaram"', output: 'true', explain: 'Dono me a×3, n×1, g×1, r×1, m×1 — same letters, same ginti.', viz: { s: 'anagram', t: 'nagaram' } },
        { input: 's = "rat", t = "car"', output: 'false', explain: 's me "t" hai, t me "c" — letters alag.', viz: { s: 'rat', t: 'car' } },
        { input: 's = "ab", t = "abc"', output: 'false', explain: 'Apna example (LeetCode ka nahi): length alag → pehli line pe hi false.', viz: { s: 'ab', t: 'abc' } },
        { input: 's = "aacc", t = "ccac"', output: 'false', explain: 'Apna example: letters same (a, c) par ginti alag — a×2 vs a×1, c×2 vs c×3. HashMap approach me "c" ka count 0 ho jaata hai aur teesra "c" aate hi false.', viz: { s: 'aacc', t: 'ccac' } },
      ],
      constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
    },
    approaches: [
      { level: 'Brute', idea: 'Dono strings ke char arrays sort karo. Anagram hain toh sort ke baad bilkul same dikhenge.', time: 'O(n log n)', space: 'O(n)', code: H2[0] },
      { level: 'Better', idea: 'HashMap&lt;Character, Integer&gt; me s ke chars gino, t ke chars pe ghatao; koi count 0 se neeche jaane wala ho → false. <b>Kisi bhi character</b> (Unicode, digits, capital) pe chalta hai — follow-up ka jawab.', time: 'O(n)', space: 'O(k) (k = distinct chars)', code: H2[1] },
      { level: 'Optimal', idea: 'Sirf lowercase a–z (constraint) → 26 size ka int array hi HashMap hai: index = <code>ch − \'a\'</code>. s pe ++, t pe −− ek hi loop me; end me sab 0 → anagram. Hashing ka overhead zero.', time: 'O(n)', space: 'O(1) (fixed 26)', code: H2[2] },
    ],
    viz: {
      title: 'Valid Anagram — int[26] count (+ for s, − for t)',
      inputs: anaInputs,
      check: ({ s, t }) => (/^[a-z]+$/.test(s) && /^[a-z]+$/.test(t) ? '' : 's aur t me sirf lowercase a–z letters (kam se kam 1).'),
      run({ s, t }) {
        const cnt = Array(26).fill(0), n = s.length;
        let on = false, i, c, j;
        const L26 = x => String.fromCharCode(97 + x);
        const nz = () => { const m = new Map(); cnt.forEach((v, x) => { if (v) m.set(L26(x), v); }); return m; };
        const V = () => {
          const v = { s: q(s), t: q(t) };
          if (on) v.count = 'int[26] non-zero {' + [...nz()].map(([a, b]) => a + '=' + b).join(', ') + '}';
          if (i !== undefined) v.i = i;
          if (c !== undefined) v.c = c;
          return v;
        };
        const views = o => {
          const out = [K.A('s', chars(s), o.sh, o.ptr), K.A('t', chars(t), o.th, o.ptr)];
          if (on) out.push(K.M('count[] — sirf non-zero (letter → count)', nz(), o.mh));
          return out;
        };
        const { st, steps } = K.tracer(H2[2], o => ({ views: views(o), vars: V() }));
        st('public boolean isAnagram', `Method call: s = ${q(s)}, t = ${q(t)}`);
        if (lenStep(st, s, t)) return steps;
        on = true;
        st('int[] count = new int[26]', 'count = new int[26] — sab 0. Index 0 = a, 1 = b, … 25 = z.');
        for (i = 0; ; i++) {
          if (!(i < n)) { st('for (int i = 0', `i = ${i}: ${i} < ${n} ✗ → saare chars gin liye`); break; }
          const P = { sh: { [i]: 'cur' }, th: { [i]: 'cur' }, ptr: [{ i, label: 'i' }] };
          st('for (int i = 0', `i = ${i}: ${i} < ${n} ✓`, P);
          const a = s[i], b = t[i];
          cnt[a.charCodeAt(0) - 97]++;
          st("count[s.charAt(i) - 'a']++", `s[${i}] = '${a}' → count['${a}']++ → ${cnt[a.charCodeAt(0) - 97]}`, Object.assign({ mh: a }, P));
          cnt[b.charCodeAt(0) - 97]--;
          st("count[t.charAt(i) - 'a']--", `t[${i}] = '${b}' → count['${b}']-- → ${cnt[b.charCodeAt(0) - 97]}`, Object.assign({ mh: b }, P));
        }
        i = undefined;
        for (j = 0; j < 26; j++) {
          c = cnt[j];
          st('for (int c : count)', `count[${j}] ('${L26(j)}') → c = ${c}`, { mh: L26(j) });
          if (c !== 0) { st('if (c != 0) return false', `c = ${c} ≠ 0 → '${L26(j)}' ki ginti s aur t me alag → return false`, { mh: L26(j), ret: 'false' }); return steps; }
          st('if (c != 0) return false', `c = 0 ✓ — '${L26(j)}' balanced`, { mh: L26(j) });
        }
        c = undefined;
        st('for (int c : count)', 'Saare 26 counts dekh liye → loop khatam');
        st('return true', 'Har letter ka count 0 → same letters, same ginti → return true', { ret: 'true' });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Sort + compare',
          run({ s, t }) {
            let a, b;
            const V = () => Object.assign({ s: q(s), t: q(t) }, a ? { a: K.iA(a) } : {}, b ? { b: K.iA(b) } : {});
            const views = o => {
              const out = [K.A('s', chars(s)), K.A('t', chars(t))];
              if (a) out.push(K.A('char[] a', a, o.ah));
              if (b) out.push(K.A('char[] b', b, o.bh));
              return out;
            };
            const { st, steps } = K.tracer(H2[0], o => ({ views: views(o), vars: V() }));
            st('public boolean isAnagram', `Method call: s = ${q(s)}, t = ${q(t)}`);
            if (lenStep(st, s, t)) return steps;
            a = chars(s);
            st('char[] a = s.toCharArray()', `a = ${K.iA(a)} — String immutable hai, sort ke liye char[] chahiye`);
            b = chars(t);
            st('char[] b = t.toCharArray()', `b = ${K.iA(b)}`);
            const a0 = K.iA(a);
            a.sort();
            st('Arrays.sort(a)', `Arrays.sort(a): ${a0} → ${K.iA(a)}`, { ah: K.rng(0, a.length - 1, 'done') });
            const b0 = K.iA(b);
            b.sort();
            st('Arrays.sort(b)', `Arrays.sort(b): ${b0} → ${K.iA(b)}`, { ah: K.rng(0, a.length - 1, 'done'), bh: K.rng(0, b.length - 1, 'done') });
            const diff = a.findIndex((x, k) => x !== b[k]);
            const eq = diff < 0;
            const hl = eq ? K.rng(0, a.length - 1, 'found') : { [diff]: 'skip' };
            st('return Arrays.equals(a, b)', eq ? 'Har position pe same char → Arrays.equals = true → return true' : `Index ${diff} pe '${a[diff]}' ≠ '${b[diff]}' → Arrays.equals = false → return false`, { ah: hl, bh: hl, ret: String(eq) });
            return steps;
          },
        },
        {
          ap: 1, label: 'HashMap (any char)',
          run({ s, t }) {
            const count = new Map();
            let on = false, c;
            const V = () => Object.assign({ s: q(s), t: q(t) }, on ? { count: K.mapStr(count) } : {}, c !== undefined ? { c: "'" + c + "'" } : {});
            const views = o => {
              const out = [K.A('s', chars(s), o.sh), K.A('t', chars(t), o.th)];
              if (on) out.push(K.M('HashMap count (char → kitni baar)', count, o.mh));
              return out;
            };
            const { st, steps } = K.tracer(H2[1], o => ({ views: views(o), vars: V() }));
            st('public boolean isAnagram', `Method call: s = ${q(s)}, t = ${q(t)}`);
            if (lenStep(st, s, t)) return steps;
            on = true;
            st('Map<Character, Integer> count', 'Khaali HashMap — key = char, value = s me kitni baar aaya.');
            chars(s).forEach((ch, k) => {
              c = ch;
              count.set(ch, (count.get(ch) || 0) + 1);
              st('for (char c : s.toCharArray())', `c = '${ch}' → count.put('${ch}', ${count.get(ch) - 1} + 1) → ${count.get(ch)}`, { sh: { [k]: 'cur' }, mh: ch });
            });
            const tc = chars(t);
            for (let k = 0; k < tc.length; k++) {
              c = tc[k];
              const P = { th: Object.assign(K.rng(0, k - 1, 'done'), { [k]: 'cur' }), mh: c };
              st('for (char c : t.toCharArray())', `c = '${c}'`, P);
              const have = count.get(c) || 0;
              if (have === 0) { st('if (count.getOrDefault(c, 0) == 0)', `count.getOrDefault('${c}', 0) = 0 → t me '${c}' s se zyada baar hai → return false`, { th: { [k]: 'skip' }, mh: c, ret: 'false' }); return steps; }
              st('if (count.getOrDefault(c, 0) == 0)', `count('${c}') = ${have} > 0 ✓ — s me abhi '${c}' bacha hai`, P);
              count.set(c, have - 1);
              st('count.put(c, count.get(c) - 1)', `count.put('${c}', ${have} − 1) → ${have - 1}`, P);
            }
            c = undefined;
            st('for (char c : t.toCharArray())', 't ke saare chars match ho gaye → loop khatam');
            st('return true', 'Length same aur t ka har char s se "kharid" liya → return true', { ret: 'true' });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Frequency counting: "kitni baar dekha?"', blocks: [
        { p: 'Two Sum (a1) me HashMap se pucha "ye value pehle dekhi?" Contains Duplicate (h1) me HashSet se "duplicate hai?" Aaj ek kadam aage: <b>"har cheez kitni baar aayi?"</b> — iske liye <code>map.put(x, map.getOrDefault(x, 0) + 1)</code>. Ye line DSA me sabse zyada likhi jaane wali line hai.' },
        { p: '<b>Anagram ka matlab:</b> dono strings me <b>same letters, same ginti</b> — order ka koi matlab nahi. "listen" ↔ "silent" ✓, "aab" ↔ "abb" ✗ (letters same, ginti alag).' },
        { table: { head: ['Keys kaisi hain?', 'Counter kya lo', 'Kyun'], rows: [
          ['Sirf lowercase a–z', '<code>int[26]</code>, index = <code>ch − \'a\'</code>', 'Fixed size, hashing nahi, sabse fast'],
          ['ASCII (256 chars)', '<code>int[256]</code>, index = <code>ch</code>', 'Phir bhi fixed size'],
          ['Kuch bhi (Unicode, numbers)', '<code>HashMap&lt;K, Integer&gt;</code>', 'Keys pehle se pata nahi'],
        ] } },
        { tip: '<b>Char → index trick:</b> <code>\'c\' − \'a\'</code> = 99 − 97 = <b>2</b>. Java me char ek chhota number hai, isliye minus seedha chalta hai.' },
      ] },
      { title: '📄 Problem — LC 242 Valid Anagram', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — sort karke compare' },
        { p: 'Anagram ho toh dono ke letters sort karne pe bilkul same string banegi: "anagram" → "aaagmnr", "nagaram" → "aaagmnr". Toh <code>toCharArray</code> → <code>Arrays.sort</code> → <code>Arrays.equals</code>. <b>O(n log n)</b> time, O(n) space (char arrays ki copy).' },
        { h: '2. Better — HashMap counting (kisi bhi character ke liye)' },
        { p: 'Sort sirf "same ginti?" check karne ke liye kar rahe the — wo seedha gin lo. s ke har char ka count HashMap me ++, phir t ke har char pe −−; agar t ka koi char aaye jiska count already 0 hai → false. <b>O(n)</b> time. Ye <b>Unicode / capital / digits</b> sab pe chalta hai — follow-up ka yahi jawab.' },
        { h: '3. Optimal — int[26] (sirf a–z)' },
        { p: 'Constraint kehta hai sirf lowercase English letters. Toh keys sirf 26 → HashMap ki jagah <code>int[26]</code>: koi hashing nahi, koi boxing (Character/Integer objects) nahi. Ek hi loop me <code>count[s[i]]++</code> aur <code>count[t[i]]−−</code> (length same hai na). End me sab 0 → anagram. <b>O(n)</b> time, <b>O(1)</b> space.' },
        { tip: '<b>Better vs Optimal ka asli farak:</b> Big-O dono O(n), par int[26] fixed 26 slots + no hashing → practically kaafi tez aur O(1) space. HashMap tab chahiye jab characters pehle se pata na ho.' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — s = "anagram", t = "nagaram" (Optimal)', blocks: [
        { table: { head: ['i', 's[i] (++)', 't[i] (−−)', 'count (non-zero) baad me'], rows: [
          ['0', 'a', 'n', '{a=1, n=−1}'],
          ['1', 'n', 'a', '{ } (a=0, n=0)'],
          ['2', 'a', 'g', '{a=1, g=−1}'],
          ['3', 'g', 'a', '{ }'],
          ['4', 'r', 'r', '{ }'],
          ['5', 'a', 'a', '{ }'],
          ['6', 'm', 'm', '{ }'],
        ] } },
        { p: 'Doosra loop: 26 ke 26 counts 0 → <b>return true</b>.' },
        { p: '<b>Example 2:</b> s = "rat", t = "car"' },
        { table: { head: ['i', 's[i] (++)', 't[i] (−−)', 'count (non-zero) baad me'], rows: [
          ['0', 'r', 'c', '{c=−1, r=1}'],
          ['1', 'a', 'a', '{c=−1, r=1}'],
          ['2', 't', 'r', '{c=−1, t=1}'],
        ] } },
        { p: 'Doosra loop: a = 0, b = 0, <b>c = −1 ≠ 0 → return false</b>.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: H2[2] },
        { lines: [
          ['if (s.length() != t.length()) return false;', 'Length alag → anagram impossible. Ye check hone ke baad hi ek loop me dono strings chala sakte hain.'],
          ['int[] count = new int[26];', '26 letters ke counters, sab 0. Ye hi "HashMap" hai — key = index.'],
          ['for (int i = 0; i < s.length(); i++)', 'Ek hi loop — length same hai isliye i dono strings pe valid.'],
          ["count[s.charAt(i) - 'a']++;", 's ka letter = +1 (de raha hai).'],
          ["count[t.charAt(i) - 'a']--;", 't ka letter = −1 (le raha hai).'],
          ['for (int c : count)', 'Saare 26 counters check.'],
          ['if (c != 0) return false;', 'Kisi letter ka hisaab barabar nahi → anagram nahi.'],
          ['return true;', 'Sab balanced → anagram.'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute (sort) → Better (HashMap) → Optimal (int[26])</b>. Example 4 (<code>aacc</code> / <code>ccac</code>) HashMap tab me dekho — count 0 hote hi false. ✎ Input se apna try karo, jaise <code>listen</code> / <code>silent</code>.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Length alag <code>"ab"</code> / <code>"abc"</code> → seedha false (pehli line).',
          'Same letters, alag ginti <code>"aacc"</code> / <code>"ccac"</code> → false. Sirf "letters same hain?" (HashSet) check karna galat hota.',
          'Single char <code>"a"</code> / <code>"a"</code> → true; <code>"a"</code> / <code>"b"</code> → false.',
          'Same string <code>"abc"</code> / <code>"abc"</code> → true (khud ka anagram).',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Length check bhool jana → Optimal me <code>t.charAt(i)</code> pe StringIndexOutOfBounds, ya "ab" / "abc" pe galat true.',
          'HashSet use karna — ginti nahi rakhta, "aab" / "abb" ko true bol dega.',
          '<code>count[s.charAt(i)]</code> likhna (− \'a\' bhool gaye) → index 97+ → ArrayIndexOutOfBounds.',
          'Capital letters / Unicode aaye toh int[26] todega — wahan HashMap (Better) lo.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (sort)', 'O(n log n)', 'O(n)', 'do char[] copies + sort'],
          ['Better (HashMap)', 'O(n)', 'O(k)', 'har put/get O(1) avg; k = distinct chars'],
          ['Optimal (int[26])', 'O(n)', 'O(1)', 'ek pass + 26 fixed checks; array size input pe depend nahi'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why do you check the lengths first?', 'Strings of different length can never be anagrams, and equal length lets me walk both strings with a single index in one loop.'],
          ['Why an int[26] instead of a HashMap?', 'The input is only lowercase English letters, so a fixed array of 26 counters works as a perfect hash: no hashing, no boxing, O(1) space.'],
          ['What if the input contains Unicode characters?', 'Use a HashMap from character to count. For characters outside the BMP, iterate over code points (s.codePoints()) instead of chars, because one such character uses two Java chars.'],
          ['Why one array with ++ and -- instead of two arrays?', 'One array uses half the memory and the final check is simply "is every count zero?" instead of comparing two arrays.'],
          ['Can you stop early instead of checking at the end?', 'Yes. Count s first, then for each char of t decrement and return false as soon as a count goes below zero. With equal lengths that is enough to prove the answer.'],
          ['What is the space cost of the sorting approach in Java?', 'toCharArray creates two O(n) copies, and Arrays.sort on a char array uses a quicksort variant with O(log n) stack. So O(n) extra overall.'],
          ['How does this help with Group Anagrams (LC 49)?', 'Use the sorted string or the 26-count signature as a HashMap key; all anagrams map to the same key and form one group.'],
          ['What are the time and space complexities?', 'Sorting is O(n log n) time; the counting solutions are O(n) time. Space is O(1) for the int[26] version and O(k) for the HashMap version.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'Two strings are anagrams if they have the same characters with the same counts. A simple way is to sort both and compare, which is O(n log n). Better is to count: since the input is only lowercase letters, I use an int array of size 26. If the lengths differ I return false. Otherwise, in one loop I increment the count for each character of s and decrement it for each character of t. If every count is zero at the end, they are anagrams. That is O(n) time and O(1) space.'],
          ['Aise bolo — follow-up (Unicode)', 'If the input can contain any Unicode character, the fixed array no longer works, so I switch to a HashMap from character to count. The logic stays the same: add for s, subtract for t, and fail if a count would go below zero. Time is still O(n), and space becomes O(k) for k distinct characters.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['s = "listen", t = "silent" — Optimal ke loop ke baad count array kaisa hoga?', 'Saare 26 counters <b>0</b> → return <b>true</b>.'],
          ['HashSet se "dono me same letters hain?" check kiya toh s = "aab", t = "abb" pe kya galat hoga?', 'Dono ka set {a, b} → true bol dega, jabki ginti alag hai → sahi jawab <b>false</b>. Isliye count chahiye, sirf presence nahi.'],
          ['<code>\'z\' − \'a\'</code> kitna hai aur count array ka size 26 kyun?', '<b>25</b>. Index 0..25 = 26 letters.'],
        ] },
        { olist: ['Optimal code 3 min me bina dekhe likho.', 'Better (HashMap) version bhi likho aur bolo kab wo chahiye (Unicode).'] },
      ] },
    ],
    checks: [
      'Sort vs HashMap vs int[26] — teeno ka idea aur complexity bol sakta hoon',
      'Bata sakta hoon kab int[26] kaafi hai aur kab HashMap chahiye (Unicode follow-up)',
      'Length check kyun pehle — samjha',
      'int[26] code 3 min me bina dekhe likh sakta hoon',
    ],
    memory: 'Same letters, same ginti: s pe ++, t pe −−, end me sab 0. a–z → int[26]; kuch bhi → HashMap.',
    tests: [
      { run: 'System.out.print(o.isAnagram("anagram", "nagaram"));', out: 'true' },
      { run: 'System.out.print(o.isAnagram("rat", "car"));', out: 'false' },
      { run: 'System.out.print(o.isAnagram("ab", "abc"));', out: 'false' },
      { run: 'System.out.print(o.isAnagram("aacc", "ccac"));', out: 'false' },
      { run: 'System.out.print(o.isAnagram("listen", "silent"));', out: 'true' },
      { run: 'System.out.print(o.isAnagram("a", "a"));', out: 'true' },
    ],
  };

  // =====================================================================
  // h3 — Top K Frequent Elements (LC 347)
  // =====================================================================
  const H3 = [
    `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>(); // number -> kitni baar
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
    List<Integer> keys = new ArrayList<>(freq.keySet());
    keys.sort((a, b) -> freq.get(b) - freq.get(a)); // zyada frequency pehle
    int[] ans = new int[k];
    for (int i = 0; i < k; i++) ans[i] = keys.get(i);
    return ans;
}`,
    `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>(); // number -> kitni baar
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
    PriorityQueue<Integer> heap = new PriorityQueue<>((a, b) -> freq.get(a) - freq.get(b)); // min-heap by freq
    for (int key : freq.keySet()) {
        heap.offer(key);
        if (heap.size() > k) heap.poll(); // sabse kam frequent bahar
    }
    int[] ans = new int[k];
    for (int i = k - 1; i >= 0; i--) ans[i] = heap.poll();
    return ans;
}`,
    `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>(); // number -> kitni baar
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
    List<Integer>[] bucket = new List[nums.length + 1]; // bucket[f] = jin numbers ki frequency f
    for (int key : freq.keySet()) {
        int f = freq.get(key);
        if (bucket[f] == null) bucket[f] = new ArrayList<>();
        bucket[f].add(key);
    }
    int[] ans = new int[k];
    int idx = 0;
    for (int f = nums.length; f >= 1 && idx < k; f--) {
        if (bucket[f] == null) continue;
        for (int x : bucket[f]) {
            if (idx == k) break;
            ans[idx++] = x;
        }
    }
    return ans;
}`,
  ];
  const topKInputs = [{ key: 'nums', label: 'nums', def: '1, 1, 1, 2, 2, 3' }, { key: 'k', label: 'k', def: '2', num: true }];
  const topKCheck = ({ nums, k }) => {
    if (!nums.length) return 'nums khaali nahi ho sakta.';
    const f = new Map();
    nums.forEach(x => f.set(x, (f.get(x) || 0) + 1));
    if (!(Number.isInteger(k) && k >= 1 && k <= f.size)) return `k 1 se ${f.size} (unique numbers) ke beech hona chahiye.`;
    const c = [...f.values()].sort((a, b) => b - a);
    if (k < c.length && c[k - 1] === c[k]) return 'Answer unique nahi (k-th aur (k+1)-th ki frequency barabar) — LeetCode guarantee karta hai ki answer unique ho.';
    return '';
  };
  // teeno approaches ki pehli 3 lines same: method call + freq map + counting loop
  function countSteps(st, nums, k, freq, setX) {
    st('public int[] topKFrequent', `Method call: nums = ${K.iA(nums)}, k = ${k}`);
    st('Map<Integer, Integer> freq', 'Khaali HashMap — key = number, value = kitni baar aaya (h2 wala frequency counting).');
    nums.forEach((x, i) => {
      setX(x);
      freq.set(x, (freq.get(x) || 0) + 1);
      st('for (int x : nums) freq.put', `x = ${x} → freq.put(${x}, ${freq.get(x) - 1} + 1) → ${freq.get(x)}`, { nh: { [i]: 'cur' }, mh: x });
    });
    setX(undefined);
  }
  const fmtF = (freq, v) => v + ' ×' + freq.get(v);

  L.h3 = {
    kind: 'dsa', title: 'Top K Frequent Elements', topic: 'Hashing', diff: 'M', lc: 347,
    url: 'https://leetcode.com/problems/top-k-frequent-elements/',
    pattern: 'Frequency map + Heap (size k) / Bucket sort',
    oneLine: 'Pehle HashMap se frequency (h2 jaisa). Phir bucket[f] = frequency f wale numbers; f = n se neeche chalo, k utha lo → O(n).',
    goal: 'Array me se <b>k sabse zyada baar aane wale</b> numbers return karo. Asli seekh: h2 ka <b>frequency map</b> + "top k" nikalne ke do naye tools — <b>min-heap of size k</b> (O(n log k)) aur <b>bucket sort by frequency</b> (O(n)), kyunki frequency kabhi n se zyada nahi hoti.',
    problem: {
      statement: 'Given an integer array <code>nums</code> and an integer <code>k</code>, return <i>the</i> <code>k</code> <i>most frequent elements</i>. You may return the answer in <b>any order</b>.<br><br><b>Follow up:</b> Your algorithm\'s time complexity must be better than <code>O(n log n)</code>, where n is the array\'s size.',
      examples: [
        { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]', explain: '1 teen baar, 2 do baar, 3 ek baar → top 2 = 1 aur 2.', viz: { nums: '1, 1, 1, 2, 2, 3', k: '2' } },
        { input: 'nums = [1], k = 1', output: '[1]', explain: 'Ek hi element.', viz: { nums: '1', k: '1' } },
        { input: 'nums = [1,2,1,2,1,2,3,1,3,2], k = 2', output: '[1,2]', explain: '1 → 4 baar, 2 → 4 baar, 3 → 2 baar → top 2 = 1 aur 2.', viz: { nums: '1, 2, 1, 2, 1, 2, 3, 1, 3, 2', k: '2' } },
        { input: 'nums = [4,4,-1,4,-1,7], k = 2', output: '[4,-1]', ret: '[-1, 4]', explain: 'Apna example: 4 → 3 baar, −1 → 2 baar, 7 → 1 baar. Negative number bhi normal key hai. Heap tab me poll hota dikhega. (Order koi bhi chalega — visualizer sorted result dikhata hai: [-1, 4].)', viz: { nums: '4, 4, -1, 4, -1, 7', k: '2' } },
      ],
      constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, the number of unique elements in the array].', 'It is guaranteed that the answer is unique.'],
    },
    approaches: [
      { level: 'Brute', idea: 'HashMap se frequency. Saari unique keys ki list banao, frequency ke ulte (descending) order me sort karo, pehli k le lo.', time: 'O(n log n)', space: 'O(n)', code: H3[0] },
      { level: 'Better', idea: 'Frequency map ke baad <b>min-heap</b> (frequency se) jisme max k numbers rakho. Size k se upar gaya → top (sabse kam frequent) poll. End me heap me k sabse frequent bache.', time: 'O(n log k)', space: 'O(n)', code: H3[1] },
      { level: 'Optimal', idea: 'Frequency 1..n ke beech hi hoti hai → <b>bucket[f]</b> = jin numbers ki frequency f. f = n se 1 tak neeche chalo aur k numbers utha lo. Koi sort / heap nahi.', time: 'O(n)', space: 'O(n)', code: H3[2] },
    ],
    viz: {
      title: 'Top K Frequent — HashMap + bucket sort',
      inputs: topKInputs,
      check: topKCheck,
      run({ nums, k }) {
        const n = nums.length, freq = new Map();
        let x, bucket = null, key, f, ans = null, idx, fi, xi;
        const bStr = () => bucket.map((b, i) => (b ? i + ':[' + b.join(',') + ']' : null)).filter(Boolean).join(' ');
        const V = () => {
          const v = { nums: K.iA(nums), k, freq: K.mapStr(freq) };
          if (x !== undefined) v.x = x;
          if (bucket) v.bucket = 'List[' + (n + 1) + '] non-null {' + bStr() + '}';
          if (key !== undefined) v.key = key;
          if (f !== undefined) v.f = f;
          if (ans) v.ans = K.iA(ans);
          if (idx !== undefined) v.idx = idx;
          if (xi !== undefined) v.x = xi;
          return v;
        };
        const views = o => {
          const out = [K.A('nums', nums, o.nh), K.M('HashMap freq (number → count)', freq, o.mh)];
          if (bucket) out.push(K.A('bucket[f] (index = frequency)', bucket.map(b => (b ? '[' + b.join(',') + ']' : '')), o.bh, o.bp));
          if (ans) out.push(K.A('ans', ans, o.ah, o.ap));
          return out;
        };
        const { st, steps } = K.tracer(H3[2], o => ({ views: views(o), vars: V() }));
        countSteps(st, nums, k, freq, v => { x = v; });
        bucket = Array(n + 1).fill(null);
        st('List<Integer>[] bucket', `bucket = new List[${n + 1}] — index 0..${n}, kyunki frequency max n = ${n} ho sakti hai. Sab null.`);
        const keys = javaOrder([...freq.keys()]);
        for (const kk of keys) {
          key = kk; f = undefined;
          st('for (int key : freq.keySet())', `key = ${key} (HashMap ke keySet order me)`, { mh: key });
          f = freq.get(key);
          st('int f = freq.get(key)', `f = freq.get(${key}) = ${f}`, { mh: key, bh: { [f]: 'cur' } });
          const was = bucket[f] === null;
          if (was) bucket[f] = [];
          st('if (bucket[f] == null) bucket[f]', was ? `bucket[${f}] null tha → new ArrayList` : `bucket[${f}] me pehle se list hai`, { mh: key, bh: { [f]: 'cur' } });
          bucket[f].push(key);
          st('bucket[f].add(key)', `bucket[${f}].add(${key}) → [${bucket[f].join(', ')}]`, { mh: key, bh: { [f]: 'new' } });
        }
        key = undefined; f = undefined;
        st('for (int key : freq.keySet())', 'Saari keys bucket me daal di → loop khatam');
        ans = Array(k).fill(0);
        st('int[] ans = new int[k]', `ans = new int[${k}]`);
        idx = 0;
        st('int idx = 0', 'idx = 0 — ans me agla khaali slot');
        const AP = () => ({ ah: K.rng(0, idx - 1, 'done'), ap: idx < k ? [{ i: idx, label: 'idx' }] : [] });
        for (fi = n; ; fi--) {
          f = fi;
          const ok = fi >= 1 && idx < k;
          if (!ok) { st('for (int f = nums.length', `f = ${fi}: ${fi >= 1 ? `idx (${idx}) < k (${k}) ✗ → k numbers mil gaye` : 'f >= 1 ✗'} → loop khatam`, AP()); break; }
          st('for (int f = nums.length', `f = ${fi}: f >= 1 ✓, idx (${idx}) < k (${k}) ✓`, Object.assign({ bh: { [fi]: 'cur' }, bp: [{ i: fi, label: 'f' }] }, AP()));
          if (bucket[fi] === null) { st('if (bucket[f] == null) continue', `bucket[${fi}] null — kisi ki frequency ${fi} nahi → continue`, Object.assign({ bh: { [fi]: 'skip' }, bp: [{ i: fi, label: 'f' }] }, AP())); continue; }
          st('if (bucket[f] == null) continue', `bucket[${fi}] = [${bucket[fi].join(', ')}] → inke numbers uthao`, Object.assign({ bh: { [fi]: 'cur' }, bp: [{ i: fi, label: 'f' }] }, AP()));
          let broke = false;
          for (const v of bucket[fi]) {
            xi = v;
            const P = () => Object.assign({ bh: { [fi]: 'cur' }, bp: [{ i: fi, label: 'f' }], mh: v }, AP());
            st('for (int x : bucket[f])', `x = ${v} (frequency ${fi})`, P());
            if (idx === k) { st('if (idx == k) break', `idx == k (${k}) → ans bhar gaya → break`, P()); broke = true; break; }
            st('if (idx == k) break', `idx (${idx}) != k (${k}) → jagah hai`, P());
            ans[idx] = v; idx++;
            st('ans[idx++] = x', `ans[${idx - 1}] = ${v}, idx → ${idx}`, Object.assign(P(), { ah: Object.assign(K.rng(0, idx - 2, 'done'), { [idx - 1]: 'new' }) }));
          }
          xi = undefined;
          if (!broke) st('for (int x : bucket[f])', `bucket[${fi}] ke saare numbers ho gaye → inner loop khatam`, Object.assign({ bh: { [fi]: 'done' } }, AP()));
        }
        f = undefined;
        st('return ans', `return ${K.iA(ans)} (order koi bhi chalega; check ke liye sorted: ${sortedStr(ans)})`, { ah: K.rng(0, k - 1, 'found'), ret: sortedStr(ans) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Sort by frequency',
          run({ nums, k }) {
            const freq = new Map();
            let x, keys = null, ans = null, i;
            const V = () => {
              const v = { nums: K.iA(nums), k, freq: K.mapStr(freq) };
              if (x !== undefined) v.x = x;
              if (keys) v.keys = K.iA(keys);
              if (ans) v.ans = K.iA(ans);
              if (i !== undefined) v.i = i;
              return v;
            };
            const views = o => {
              const out = [K.A('nums', nums, o.nh), K.M('HashMap freq (number → count)', freq, o.mh)];
              if (keys) out.push(K.A('keys (number ×freq)', keys.map(v => fmtF(freq, v)), o.kh, o.kp));
              if (ans) out.push(K.A('ans', ans, o.ah));
              return out;
            };
            const { st, steps } = K.tracer(H3[0], o => ({ views: views(o), vars: V() }));
            countSteps(st, nums, k, freq, v => { x = v; });
            keys = javaOrder([...freq.keys()]);
            st('List<Integer> keys', `keys = ${K.iA(keys)} — saare unique numbers (HashMap ke keySet order me)`);
            const before = K.iA(keys);
            keys.sort((a, b) => freq.get(b) - freq.get(a));
            st('keys.sort', `Frequency ke descending order me sort: ${before} → ${K.iA(keys)}`, { kh: K.rng(0, k - 1, 'win') });
            ans = Array(k).fill(0);
            st('int[] ans = new int[k]', `ans = new int[${k}]`, { kh: K.rng(0, k - 1, 'win') });
            for (i = 0; ; i++) {
              if (!(i < k)) { st('for (int i = 0; i < k; i++)', `i = ${i}: ${i} < ${k} ✗ → k numbers le liye`, { ah: K.rng(0, k - 1, 'done') }); break; }
              ans[i] = keys[i];
              st('for (int i = 0; i < k; i++)', `i = ${i}: ${i} < ${k} ✓ → ans[${i}] = keys.get(${i}) = ${keys[i]}`, { kh: { [i]: 'cur' }, kp: [{ i, label: 'i' }], ah: Object.assign(K.rng(0, i - 1, 'done'), { [i]: 'new' }) });
            }
            i = undefined;
            st('return ans', `return ${K.iA(ans)} (order koi bhi chalega; check ke liye sorted: ${sortedStr(ans)})`, { ah: K.rng(0, k - 1, 'found'), ret: sortedStr(ans) });
            return steps;
          },
        },
        {
          ap: 1, label: 'Min-heap (size k)',
          run({ nums, k }) {
            const freq = new Map();
            let x, heap = null, key, ans = null, i;
            const cmp = (a, b) => freq.get(a) - freq.get(b);
            // java.util.PriorityQueue jaisa binary heap (siftUp / siftDown)
            const offer = v => { let c = heap.length; heap.push(v); while (c > 0) { const p = (c - 1) >>> 1; if (cmp(v, heap[p]) >= 0) break; heap[c] = heap[p]; c = p; } heap[c] = v; };
            const poll = () => {
              const top = heap[0], last = heap.pop();
              if (heap.length) {
                let c = 0; const size = heap.length, half = size >>> 1;
                while (c < half) { let ch = 2 * c + 1; const r = ch + 1; if (r < size && cmp(heap[ch], heap[r]) > 0) ch = r; if (cmp(last, heap[ch]) <= 0) break; heap[c] = heap[ch]; c = ch; }
                heap[c] = last;
              }
              return top;
            };
            const V = () => {
              const v = { nums: K.iA(nums), k, freq: K.mapStr(freq) };
              if (x !== undefined) v.x = x;
              if (heap) v.heap = 'PriorityQueue size=' + heap.length + ' ' + K.iA(heap);
              if (key !== undefined) v.key = key;
              if (ans) v.ans = K.iA(ans);
              if (i !== undefined) v.i = i;
              return v;
            };
            const views = o => {
              const out = [K.A('nums', nums, o.nh), K.M('HashMap freq (number → count)', freq, o.mh)];
              if (heap) out.push(K.A('min-heap (array form; index 0 = top = sabse kam freq)', heap.map(v => fmtF(freq, v)), o.hh));
              if (o.out !== undefined) out.push(K.X('poll() ne nikala', o.out));
              if (ans) out.push(K.A('ans', ans, o.ah));
              return out;
            };
            const { st, steps } = K.tracer(H3[1], o => ({ views: views(o), vars: V() }));
            countSteps(st, nums, k, freq, v => { x = v; });
            heap = [];
            st('PriorityQueue<Integer> heap', 'Khaali min-heap — comparator frequency se, isliye sabse kam frequent number top pe.');
            for (const kk of javaOrder([...freq.keys()])) {
              key = kk;
              st('for (int key : freq.keySet())', `key = ${key} (freq ${freq.get(key)})`, { mh: key });
              offer(key);
              st('heap.offer(key)', `heap.offer(${key}) → size ${heap.length}, top = ${fmtF(freq, heap[0])}`, { mh: key, hh: { [heap.indexOf(key)]: 'new' } });
              if (heap.length > k) {
                const out = poll();
                st('if (heap.size() > k) heap.poll()', `size ${heap.length + 1} > k (${k}) → poll() → ${fmtF(freq, out)} bahar (sabse kam frequent)`, { mh: key, out: fmtF(freq, out) });
              } else {
                st('if (heap.size() > k) heap.poll()', `size ${heap.length} <= k (${k}) → abhi kuch nahi nikalna`, { mh: key });
              }
            }
            key = undefined;
            st('for (int key : freq.keySet())', `Saari keys ho gayi → heap me ${k} sabse frequent bache: ${K.iA(heap)}`);
            ans = Array(k).fill(0);
            st('int[] ans = new int[k]', `ans = new int[${k}]`);
            for (i = k - 1; ; i--) {
              if (!(i >= 0)) { st('for (int i = k - 1', `i = ${i}: ${i} >= 0 ✗ → heap khaali, ans bhar gaya`, { ah: K.rng(0, k - 1, 'done') }); break; }
              const out = poll();
              ans[i] = out;
              st('for (int i = k - 1', `i = ${i} ✓ → heap.poll() = ${fmtF(freq, out)} → ans[${i}] = ${out} (peeche se bharo, taaki sabse frequent aage aaye)`, { ah: Object.assign(K.rng(i + 1, k - 1, 'done'), { [i]: 'new' }), out: fmtF(freq, out) });
            }
            i = undefined;
            st('return ans', `return ${K.iA(ans)} (order koi bhi chalega; check ke liye sorted: ${sortedStr(ans)})`, { ah: K.rng(0, k - 1, 'found'), ret: sortedStr(ans) });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Frequency map + "top k" nikalna', blocks: [
        { p: 'Step 1 hamesha wahi jo h2 (Valid Anagram) me kiya: <code>freq.put(x, freq.getOrDefault(x, 0) + 1)</code>. Yahan numbers −10⁴..10⁴ hain, isliye int[26] jaisa chhota array nahi — <b>HashMap</b>.' },
        { p: 'Step 2 naya hai: map me se <b>k sabse badi frequency</b> wale keys chahiye. Teen tareeke:' },
        { table: { head: ['Tool', 'Idea', 'Cost'], rows: [
          ['Sort', 'Keys ko frequency se sort, pehli k', 'O(m log m), m = unique'],
          ['<b>Min-heap of size k</b>', 'Heap me max k rakho; zyada ho toh sabse chhota (top) nikal do', 'O(m log k)'],
          ['<b>Bucket sort</b>', 'Frequency 1..n hi ho sakti hai → array index = frequency', 'O(n)'],
        ] } },
        { pre: `PriorityQueue (min-heap):  top = sabse chhota
  offer(x)  → O(log size)      poll() → top nikalo, O(log size)
  size k pe rokna → heap me hamesha "ab tak ke k sabse bade" bachte hain` },
        { tip: '<b>Top k LARGEST ke liye MIN-heap</b> (ulta lagta hai!). Kyunki hume sabse chhote ko <b>nikalna</b> hai jab k se zyada ho jaye — aur min-heap ka top wahi hai.' },
      ] },
      { title: '📄 Problem — LC 347 Top K Frequent Elements', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Better → Optimal', blocks: [
        { h: '1. Brute — count + sort' },
        { p: 'HashMap se frequency (O(n)). Unique keys ki list banao aur frequency ke descending order me sort karo, pehli k return. Sort = <b>O(n log n)</b> worst case (sab unique). Follow-up kehta hai isse better chahiye.' },
        { h: '2. Better — count + min-heap of size k' },
        { p: 'Saari keys sort karne ki zaroorat nahi — sirf top k chahiye. Har key ko min-heap (frequency se) me daalo; size k se zyada hua toh <code>poll()</code> — sabse kam frequent nikal jaata hai. End me heap me bilkul k sabse frequent. Har offer/poll O(log k) → <b>O(n log k)</b>. k chhota ho toh kaafi tez.' },
        { h: '3. Optimal — count + bucket sort' },
        { p: 'Observation: kisi number ki frequency <b>1 se n</b> ke beech hi ho sakti hai. Toh <code>bucket[f]</code> = list of numbers jinki frequency f. Ab f = n se neeche chalo — pehle sabse frequent milenge — aur k numbers utha lo. Sort ya heap kuch nahi, sab linear → <b>O(n)</b> time, O(n) space.' },
        { tip: 'Teeno me pehle 2 line (HashMap counting) same hain — farak sirf "top k kaise nikale" me hai. Interview me ye bolna clear signal deta hai.' },
      ] },
      { title: '⚖️ Brute → Better → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — nums = [1, 1, 1, 2, 2, 3], k = 2', blocks: [
        { p: '<b>Counting:</b> freq = {1=3, 2=2, 3=1}' },
        { p: '<b>Optimal (bucket):</b> bucket[3] = [1], bucket[2] = [2], bucket[1] = [3]' },
        { table: { head: ['f', 'bucket[f]', 'Action', 'ans', 'idx'], rows: [
          ['6, 5, 4', 'null', 'continue', '[0, 0]', '0'],
          ['3', '[1]', 'ans[0] = 1', '[1, 0]', '1'],
          ['2', '[2]', 'ans[1] = 2', '[1, 2]', '2'],
          ['1', '—', 'idx (2) &lt; k (2) ✗ → stop', '<b>[1, 2]</b>', '2'],
        ] } },
        { p: '<b>Better (min-heap, k = 2):</b>' },
        { table: { head: ['key (freq)', 'offer ke baad heap', 'size > k?', 'heap baad me'], rows: [
          ['1 (3)', '[1×3]', 'No', '[1×3]'],
          ['2 (2)', '[2×2, 1×3]', 'No', '[2×2, 1×3]'],
          ['3 (1)', '[3×1, 1×3, 2×2]', '<b>Yes</b> → poll 3', '[2×2, 1×3]'],
        ] } },
        { p: 'Phir i = 1: poll → 2, i = 0: poll → 1 → ans = <b>[1, 2]</b>.' },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: H3[2] },
        { lines: [
          ['for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);', 'h2 wala frequency counting — har number kitni baar.'],
          ['List<Integer>[] bucket = new List[nums.length + 1];', 'Index = frequency. Size n + 1 kyunki frequency n tak ho sakti hai (sab same number).'],
          ['int f = freq.get(key);', 'Is number ki frequency = bucket ka index.'],
          ['if (bucket[f] == null) bucket[f] = new ArrayList<>();', 'List lazily banao — zyada tar buckets khaali rehte hain.'],
          ['bucket[f].add(key);', 'Number ko uski frequency wale bucket me daalo.'],
          ['for (int f = nums.length; f >= 1 && idx < k; f--)', 'Sabse badi frequency se neeche; k mil gaye toh ruk jao.'],
          ['if (bucket[f] == null) continue;', 'Is frequency ka koi number nahi.'],
          ['if (idx == k) break;', 'Safety: ek bucket me zarurat se zyada numbers ho toh. (Unique answer guarantee me ye kabhi true nahi hota.)'],
          ['ans[idx++] = x;', 'Number answer me, idx aage.'],
        ] },
      ] },
      { title: '▶ Visualizer — teeno approaches line by line', blocks: [
        { viz: 0 },
        { tip: 'Tabs: <b>Brute (sort) → Better (min-heap) → Optimal (bucket)</b>. Example 4 me heap tab dekho — <code>7 ×1</code> poll hoke bahar jaata hai. Keys ka order Java HashMap jaisa dikhaya hai (−1 pehle aata hai). Result ka order approach ke hisaab se alag ho sakta hai — LeetCode koi bhi order accept karta hai, isliye final ret sorted dikhaya.' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Ek element <code>[1]</code>, k = 1 → <code>[1]</code>.',
          'Sab same <code>[5,5,5]</code>, k = 1 → frequency 3 = n → isi liye bucket size <b>n + 1</b>.',
          'k = unique count <code>[1,2,3]</code>, k = 3 → saare numbers (koi bhi order).',
          'Negative numbers <code>[4,4,-1,4,-1,7]</code> → HashMap me normal key; bucket index frequency hai, value nahi — negative se farak nahi.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'Bucket array size <code>nums.length</code> rakhna → sab same number pe <code>bucket[n]</code> ArrayIndexOutOfBounds.',
          'Top k largest ke liye <b>max-heap</b> me sab daal dena → O(n log n) ho gaya, heap ka fayda gaya. Min-heap of size k lo.',
          'Heap comparator me value compare karna (<code>a - b</code>) frequency ki jagah.',
          'Bucket ko number se index karna (<code>bucket[x]</code>) — index frequency hai.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (sort)', 'O(n log n)', 'O(n)', 'counting O(n) + m unique keys ka sort O(m log m), m ≤ n'],
          ['Better (min-heap k)', 'O(n log k)', 'O(n)', 'har key ka offer/poll O(log k); map O(n), heap O(k)'],
          ['Optimal (bucket)', 'O(n)', 'O(n)', 'counting + buckets bharna + n se 1 tak ek scan'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why is plain sorting not good enough here?', 'Sorting all unique keys costs O(n log n), and the follow-up asks for better. We only need the top k, not a full order.'],
          ['Why a min-heap and not a max-heap?', 'With a min-heap capped at size k, the least frequent of the current candidates sits on top, so I can drop it in O(log k). A max-heap would need all n keys inside: O(n log n).'],
          ['Why is bucket sort O(n)?', 'A frequency is always between 1 and n, so I can use it as an array index. Filling the buckets and scanning from n down to 1 are both linear.'],
          ['When would you prefer the heap over buckets?', 'When the data is a stream or very large and k is small: the heap needs only O(k) extra memory beyond the counts and can update as elements arrive.'],
          ['Is there another O(n) average approach?', 'Quickselect on the unique keys by frequency gives O(n) on average but O(n squared) in the worst case.'],
          ['What if two elements have the same frequency at the boundary?', 'The problem guarantees a unique answer. Otherwise I would need a tie-break rule, for example the smaller number first, added to the comparator.'],
          ['What is the space complexity?', 'O(n) for the frequency map in all approaches; buckets add O(n), the heap adds O(k).'],
          ['How does Top K Frequent Words (LC 692) differ?', 'The answer must be sorted by frequency and then alphabetically, so the heap comparator also compares the words, reversed for the min-heap.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'First I count frequencies with a HashMap in O(n). A simple solution sorts the keys by frequency, which is O(n log n). Better is a min-heap of size k ordered by frequency: whenever it grows beyond k I remove the least frequent, giving O(n log k). The optimal solution uses the fact that a frequency is at most n: I put each number into bucket[frequency], then walk from n down to 1 collecting numbers until I have k. That is O(n) time and O(n) space.'],
          ['Aise bolo — trade-off', 'Bucket sort is the fastest for a fixed array. If the numbers came as a stream or memory for the result side mattered, I would choose the size-k min-heap because it keeps only k candidates and supports updates.'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['nums = [5, 5, 6, 7, 7, 7], k = 1 — bucket array ka state aur answer?', 'freq {5=2, 6=1, 7=3} → bucket[1] = [6], bucket[2] = [5], bucket[3] = [7]. f = 6 se neeche: f = 3 pe 7 mila → <b>[7]</b>.'],
          ['Bucket array ka size <code>nums.length</code> rakha toh <code>[9, 9]</code>, k = 1 pe kya hoga?', 'freq(9) = 2 → <code>bucket[2]</code> chahiye par size 2 me index 0..1 → <b>ArrayIndexOutOfBoundsException</b>. Isliye n + 1.'],
          ['Min-heap of size k me heap ke top pe kaun hota hai?', 'Abhi tak ke top-k candidates me se <b>sabse kam frequent</b> — agla naya bada aaya toh yahi bahar jaayega.'],
        ] },
        { olist: ['Bucket sort wala code 6 min me bina dekhe likho.', 'Heap wala version bhi likho aur bolo kab heap better hai (stream, chhota k).'] },
      ] },
    ],
    checks: [
      'Sort → Heap → Bucket teeno ka idea aur complexity bol sakta hoon',
      'Samjha sakta hoon kyun top k LARGEST ke liye MIN-heap of size k',
      'Bata sakta hoon kyun bucket size n + 1 aur kyun ye O(n) hai',
      'Bucket sort code 6 min me bina dekhe likh sakta hoon',
    ],
    memory: 'Pehle gino (HashMap). Phir bucket[freq] me daalo, freq = n se neeche chalo, k utha lo. Heap chahiye toh MIN-heap of size k.',
    tests: [
      { run: 'int[] r = o.topKFrequent(new int[]{1,1,1,2,2,3}, 2); Arrays.sort(r); System.out.print(Arrays.toString(r));', out: '[1, 2]' },
      { run: 'int[] r = o.topKFrequent(new int[]{1}, 1); Arrays.sort(r); System.out.print(Arrays.toString(r));', out: '[1]' },
      { run: 'int[] r = o.topKFrequent(new int[]{1,2,1,2,1,2,3,1,3,2}, 2); Arrays.sort(r); System.out.print(Arrays.toString(r));', out: '[1, 2]' },
      { run: 'int[] r = o.topKFrequent(new int[]{4,4,-1,4,-1,7}, 2); Arrays.sort(r); System.out.print(Arrays.toString(r));', out: '[-1, 4]' },
      { run: 'int[] r = o.topKFrequent(new int[]{5,5,5}, 1); Arrays.sort(r); System.out.print(Arrays.toString(r));', out: '[5]' },
      { run: 'int[] r = o.topKFrequent(new int[]{1,2,3}, 3); Arrays.sort(r); System.out.print(Arrays.toString(r));', out: '[1, 2, 3]' },
    ],
  };
})();
