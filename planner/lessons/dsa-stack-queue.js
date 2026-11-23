// Planner lessons — Stack & Queue: q1 Valid Parentheses (LC 20)
// Format: dsa-arrays-two-pointers.js jaisa. Stack view = K.ST (items bottom → top).
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const K = window.PLAN_KIT;

  // =====================================================================
  // q1 — Valid Parentheses (LC 20)
  // =====================================================================
  const Q1 = [
    `public boolean isValid(String s) {
    String prev = "";
    while (!s.equals(prev)) {
        prev = s;
        s = s.replace("()", "").replace("[]", "").replace("{}", "");
    }
    return s.isEmpty();
}`,
    `public boolean isValid(String s) {
    Map<Character, Character> pair = Map.of(')', '(', ']', '[', '}', '{');
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);
        } else {
            if (stack.isEmpty()) return false;
            char top = stack.pop();
            if (top != pair.get(c)) return false;
        }
    }
    return stack.isEmpty();
}`,
  ];
  const PAIR = { ')': '(', ']': '[', '}': '{' };
  const q = v => (v === '' ? '""' : '"' + v + '"');
  const bracketCheck = ({ s }) => (!s.length ? 's khaali nahi ho sakta (length ≥ 1).' : !/^[()[\]{}]+$/.test(s) ? 's me sirf ( ) [ ] { } hone chahiye.' : s.length > 12 ? 'Max 12 characters rakho (visualizer chhota rakhna hai).' : '');

  L.q1 = {
    kind: 'dsa', title: 'Valid Parentheses', topic: 'Stack & Queue', diff: 'E', lc: 20,
    url: 'https://leetcode.com/problems/valid-parentheses/',
    pattern: 'Stack (last opened, first closed)',
    oneLine: 'Opening bracket → push. Closing → stack khaali ya top ka jodi nahi → false; warna pop. End me stack khaali → true.',
    goal: 'Check karo ki brackets ki string sahi tarah khuli aur band hui hai. Asli seekh: <b>stack = LIFO</b> — jo bracket <b>sabse last</b> khula, wahi <b>sabse pehle</b> band hona chahiye. Ye "last pending kaam" yaad rakhne wala pattern stack ka sabse classic use hai.',
    problem: {
      statement: 'Given a string <code>s</code> containing just the characters <code>\'(\'</code>, <code>\')\'</code>, <code>\'{\'</code>, <code>\'}\'</code>, <code>\'[\'</code> and <code>\']\'</code>, determine if the input string is valid.<br><br>An input string is valid if:<ol><li>Open brackets must be closed by the same type of brackets.</li><li>Open brackets must be closed in the correct order.</li><li>Every close bracket has a corresponding open bracket of the same type.</li></ol>',
      examples: [
        { input: 's = "()"', output: 'true', explain: 'Ek jodi, sahi band.', viz: { s: '()' } },
        { input: 's = "()[]{}"', output: 'true', explain: 'Teen alag jodiyan, har ek turant band.', viz: { s: '()[]{}' } },
        { input: 's = "(]"', output: 'false', explain: '( khula par ] se band kiya — type alag.', viz: { s: '(]' } },
        { input: 's = "([])"', output: 'true', explain: 'Nested: [ ] andar band hua, phir ( ).', viz: { s: '([])' } },
        { input: 's = "([)]"', output: 'false', explain: 'Order galat: [ last khula tha, par ) pehle aa gaya.', viz: { s: '([)]' } },
        { input: 's = "(()"', output: 'false', explain: 'Apna example: sab closing match hue, par end me ek ( bacha → stack khaali nahi → false.', viz: { s: '(()' } },
        { input: 's = "]"', output: 'false', explain: 'Apna example: closing aaya jab stack khaali tha — koi opening hi nahi.', viz: { s: ']' } },
      ],
      constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\'.'],
    },
    approaches: [
      { level: 'Brute', idea: 'Sahi string me kahin na kahin ek <b>khaali jodi</b> ("()", "[]" ya "{}") zaroor hogi. Unhe baar-baar <code>replace</code> se hatao jab tak string badalna band na ho. Khaali bachi → valid.', time: 'O(n²)', space: 'O(n)', code: Q1[0] },
      { level: 'Optimal', idea: 'Stack of open brackets (ArrayDeque). Opening → push. Closing → stack khaali ya pop kiya hua top iska jodi nahi → false. End me stack khaali hona chahiye.', time: 'O(n)', space: 'O(n)', code: Q1[1] },
    ],
    viz: {
      title: 'Valid Parentheses — stack of open brackets',
      inputs: [{ key: 's', label: 's', def: '([])', type: 'str' }],
      check: bracketCheck,
      run({ s }) {
        const chars = s.split(''), stack = [], done = {};
        let i, c, top;
        const V = () => Object.assign({ s: q(s), stack: '[' + stack.join(', ') + '] (top = right)' }, c !== undefined ? { c: "'" + c + "'" } : {}, top !== undefined ? { top: "'" + top + "'" } : {});
        const views = o => [K.A('s', chars, Object.assign({}, done, o.hl || {}), i !== undefined && i < chars.length ? [{ i, label: 'c' }] : []), K.ST('stack (open brackets)', stack, o.sh || {}), K.X('pair (closing → opening)', ") → (   ] → [   } → {")];
        const { st, steps } = K.tracer(Q1[1], o => ({ views: views(o), vars: V() }));
        st('public boolean isValid', `Method call: s = ${q(s)}`);
        st('Map<Character, Character> pair', 'pair map: har closing ka opening jodidaar — ) → (, ] → [, } → {');
        st('Deque<Character> stack', 'Khaali stack (ArrayDeque) — khule hue brackets yahan rahenge');
        for (i = 0; i < chars.length; i++) {
          c = chars[i]; top = undefined;
          st('for (char c : s.toCharArray())', `c = s[${i}] = '${c}'`, { hl: { [i]: 'cur' } });
          if (c === '(' || c === '[' || c === '{') {
            st("if (c == '('", `'${c}' opening hai`, { hl: { [i]: 'cur' } });
            stack.push(c);
            done[i] = 'done';
            st('stack.push(c)', `push '${c}' → ab ye "sabse last khula" bracket hai`, { hl: { [i]: 'done' }, sh: { [stack.length - 1]: 'new' } });
          } else {
            st("if (c == '('", `'${c}' closing hai → jodidaar '${PAIR[c]}' top pe hona chahiye`, { hl: { [i]: 'cur' } });
            if (!stack.length) { st('if (stack.isEmpty()) return false', `Stack khaali! '${c}' ko band karne ke liye koi opening nahi → return false`, { hl: { [i]: 'skip' }, ret: 'false' }); return steps; }
            st('if (stack.isEmpty()) return false', `Stack khaali nahi (top = '${stack[stack.length - 1]}')`, { hl: { [i]: 'cur' }, sh: { [stack.length - 1]: 'cur' } });
            top = stack.pop();
            st('char top = stack.pop()', `pop → top = '${top}'`, { hl: { [i]: 'cur' } });
            if (top !== PAIR[c]) { st('if (top != pair.get(c)) return false', `pair.get('${c}') = '${PAIR[c]}' ≠ top '${top}' → galat type / order → return false`, { hl: { [i]: 'skip' }, ret: 'false' }); return steps; }
            done[i] = 'found';
            st('if (top != pair.get(c)) return false', `pair.get('${c}') = '${PAIR[c]}' == top ✓ → jodi band hui`, { hl: { [i]: 'found' } });
          }
        }
        c = undefined; top = undefined;
        st('for (char c : s.toCharArray())', 'Saare characters ho gaye → loop khatam');
        st('return stack.isEmpty()', stack.length ? `Stack me ${stack.length} bracket(s) abhi bhi khule: [${stack.join(', ')}] → return false` : 'Stack khaali — har bracket band hua → return true', { sh: Object.fromEntries(stack.map((_, k) => [k, 'skip'])), ret: String(stack.length === 0) });
        return steps;
      },
      variants: [
        {
          ap: 0, label: 'Replace pairs',
          run({ s }) {
            let cur = s, prev, pass = 0;
            const V = () => Object.assign({ s: q(cur) }, prev !== undefined ? { prev: q(prev) } : {});
            const { st, steps } = K.tracer(Q1[0], () => ({ views: [K.X('s', q(cur)), K.X('prev', prev === undefined ? '(abhi nahi)' : q(prev)), K.X('pass', pass)], vars: V() }));
            st('public boolean isValid', `Method call: s = ${q(s)}`);
            prev = '';
            st('String prev', 'prev = "" — pichle pass ki string (shuru me kuch nahi)');
            while (true) {
              if (cur === prev) { st('while (!s.equals(prev))', `s ${q(cur)} == prev → is pass me kuch nahi hata → ruko`); break; }
              st('while (!s.equals(prev))', `s ${q(cur)} ≠ prev ${q(prev)} → ek aur pass`);
              prev = cur;
              st('prev = s', `prev = ${q(prev)}`);
              const a = cur.split('()').join(''), b = a.split('[]').join(''), d = b.split('{}').join('');
              cur = d; pass++;
              st('s = s.replace', `Pass ${pass}: "()" hatao → ${q(a)}, "[]" hatao → ${q(b)}, "{}" hatao → ${q(d)}`);
            }
            st('return s.isEmpty()', cur === '' ? 'Sab jodiyan hat gayi, string khaali → return true' : `${q(cur)} bacha — iske jodi nahi bante → return false`, { ret: String(cur === '') });
            return steps;
          },
        },
      ],
    },
    parts: [
      { title: '🧩 Concept — Stack: Last In, First Out', blocks: [
        { p: '<b>Stack</b> = plates ka dher: jo plate <b>sabse baad me</b> rakhi, wahi <b>sabse pehle</b> uthti hai (LIFO). Teen kaam: <code>push</code> (upar rakho), <code>pop</code> (upar wali nikaalo), <code>peek</code> (upar wali dekho). Teeno O(1).' },
        { table: { head: ['Java', 'Kaam', 'Note'], rows: [
          ['<code>Deque&lt;Character&gt; st = new ArrayDeque&lt;&gt;();</code>', 'stack banao', 'recommended — <code>Stack</code> class purani hai (synchronized, Vector based)'],
          ['<code>st.push(x)</code>', 'top pe daalo', 'O(1)'],
          ['<code>st.pop()</code>', 'top nikaalo + return', 'khaali pe <b>NoSuchElementException</b> → pehle <code>isEmpty()</code>'],
          ['<code>st.peek()</code>', 'top dekho (nikaale bina)', 'khaali pe <code>null</code>'],
          ['<code>st.isEmpty()</code>', 'khaali hai?', 'O(1)'],
        ] } },
        { pre: `s = "( [ ] )"
'('  push   stack: (
'['  push   stack: ( [        ← [ sabse last khula
']'  pop [  stack: (          ← ] ne sabse last khule ko band kiya ✓
')'  pop (  stack: (khaali)   ✓ → true` },
        { tip: '<b>Kab stack socho?</b> Jab "sabse recent pending cheez" se match karna ho: brackets, undo, function calls (Day 6 ka call stack yahi tha!), next greater element, expression evaluation.' },
      ] },
      { title: '📄 Problem — LC 20 Valid Parentheses', blocks: [{ problem: 1 }] },
      { title: '🤔 Thinking — Brute → Optimal', blocks: [
        { h: '1. Brute — jodiyan replace karte raho' },
        { p: 'Observation: valid string me kam se kam ek <b>adjacent jodi</b> ("()", "[]", "{}") hoti hai (sabse andar wali). Use hatao — baaki string bhi valid rehti hai. Toh loop: teeno jodiyan <code>replace</code> se hatao, jab tak string badalna band na ho. Khaali bachi → true. Har pass O(n), aur worst case <code>"((((…))))"</code> me har pass sirf <b>ek</b> jodi hatati hai → n/2 passes → <b>O(n²)</b>. Har replace nayi string → O(n) space.' },
        { h: 'Better?' },
        { p: 'Alag Better nahi hai — counter (open/close ginna) sirf ek type ke bracket pe chalta hai, teen types aur order ke liye galat hai (<code>"([)]"</code> pe counts barabar par invalid). Seedha Optimal.' },
        { h: '2. Optimal — stack' },
        { p: 'Brute me hum "sabse andar wali jodi" dhoondh rahe the — wo hamesha <b>sabse last khula bracket</b> + uske turant baad ka closing hai. "Sabse last khula" yaad rakhne ka kaam = stack. Opening → push; closing → top uska jodidaar ho toh pop, warna false; end me stack khaali → true. <b>O(n) time, O(n) space.</b>' },
      ] },
      { title: '⚖️ Brute → Optimal — code', blocks: [{ compare: 1 }] },
      { title: '🔍 Dry run — s = "([)]" aur "([])" (Optimal)', blocks: [
        { table: { head: ['c', 'Type', 'Stack (pehle)', 'Action', 'Stack (baad)'], rows: [
          ['(', 'open', '[ ]', 'push', '[ ( ]'],
          ['[', 'open', '[ ( ]', 'push', '[ (, [ ]'],
          [')', 'close', '[ (, [ ]', 'pop → [ ; pair.get(\')\') = ( ≠ [', '<b>return false</b>'],
        ] } },
        { p: '<b>s = "([])"</b>' },
        { table: { head: ['c', 'Type', 'Stack (pehle)', 'Action', 'Stack (baad)'], rows: [
          ['(', 'open', '[ ]', 'push', '[ ( ]'],
          ['[', 'open', '[ ( ]', 'push', '[ (, [ ]'],
          [']', 'close', '[ (, [ ]', 'pop [ == pair.get(\']\') ✓', '[ ( ]'],
          [')', 'close', '[ ( ]', 'pop ( == pair.get(\')\') ✓', '[ ]'],
          ['end', '', '[ ]', 'stack khaali', '<b>return true</b>'],
        ] } },
      ] },
      { title: '💻 Java code — har line ka purpose (Optimal)', blocks: [
        { code: Q1[1] },
        { lines: [
          ["Map<Character, Character> pair = Map.of(')', '(', ...);", 'Closing → uska opening. Teen if-else ki jagah ek lookup.'],
          ['Deque<Character> stack = new ArrayDeque<>();', 'Stack ke liye ArrayDeque (Stack class nahi).'],
          ['for (char c : s.toCharArray())', 'Har character ek baar.'],
          ["if (c == '(' || c == '[' || c == '{')", 'Opening bracket?'],
          ['stack.push(c);', 'Khula — baad me band karna hai, yaad rakho.'],
          ['if (stack.isEmpty()) return false;', 'Closing aaya par koi khula bracket nahi (jaise "]" ya "())"). Ye check na ho toh pop() exception deta.'],
          ['char top = stack.pop();', 'Sabse last khula bracket — isi ko band hona chahiye.'],
          ['if (top != pair.get(c)) return false;', 'Type match nahi → galat. (<code>char</code> vs <code>Character</code> → unboxing se value compare hota hai.)'],
          ['return stack.isEmpty();', 'Kuch khula reh gaya (jaise "(()") → false.'],
        ] },
      ] },
      { title: '▶ Visualizer — Brute aur Optimal line by line', blocks: [
        { viz: 0 },
        { tip: 'Teeno false cases dekho: <code>(]</code> (type mismatch), <code>]</code> (stack khaali), <code>(()</code> (end me bacha). Brute tab me <code>((()))</code> try karo — har pass sirf ek jodi hatati hai, isliye O(n²).' },
      ] },
      { title: '🧪 Edge cases + ❌ Common mistakes', blocks: [
        { h: 'Edge cases' },
        { list: [
          'Odd length (<code>"(()"</code>) → kabhi valid nahi; chaaho toh shuru me <code>if (s.length() % 2 == 1) return false;</code>.',
          'Sirf closing se shuru (<code>"]"</code>, <code>")("</code>) → pehle hi closing pe stack khaali → false.',
          'Sirf opening (<code>"((("</code>) → loop me koi false nahi, par end me stack khaali nahi → false.',
          'Lambi nested string (10⁴) → stack approach theek; brute ~n²/2 kaam.',
        ] },
        { h: 'Common mistakes' },
        { list: [
          'End me <code>return true</code> likh dena → <code>"(("</code> pe galat true.',
          'pop se pehle <code>isEmpty()</code> check na karna → NoSuchElementException.',
          'Teen alag counters rakhna → order check nahi hota, <code>"([)]"</code> pe galat true.',
          '<code>stack.pop() != pair.get(c)</code> dono <code>Character</code> → reference compare! (128 se chhote chars cached hain isliye chal jaata hai, par aadat galat.) Ek side <code>char</code> rakho.',
        ] },
      ] },
      { title: '⏱ Complexity', blocks: [
        { table: { head: ['Approach', 'Time', 'Space', 'Kyun'], rows: [
          ['Brute (replace pairs)', 'O(n²)', 'O(n)', 'har pass O(n), worst case n/2 passes; har replace nayi string'],
          ['Optimal (stack)', 'O(n)', 'O(n)', 'har char ek push/pop O(1); worst case saare opening stack me'],
        ] } },
      ] },
      { title: '🎤 Interview — 8 short questions', blocks: [
        { qa: [
          ['Why is a stack the right data structure?', 'The most recently opened bracket must be closed first, which is exactly last-in-first-out.'],
          ['Why not just count opening and closing brackets?', 'Counts ignore order and type; "([)]" has balanced counts but is invalid.'],
          ['What are the three ways the string can be invalid?', 'A closing bracket with an empty stack, a closing bracket that does not match the top, or unmatched openings left at the end.'],
          ['Why ArrayDeque instead of Stack?', 'Stack is a legacy synchronized class built on Vector; ArrayDeque is faster and is the recommended stack in Java.'],
          ['What is the time and space complexity?', 'O(n) time, one push or pop per character, and O(n) space in the worst case when all characters are openings.'],
          ['Can you exit early for some inputs?', 'Yes, an odd-length string can never be valid, so we can return false immediately.'],
          ['How would you solve it with O(1) space?', 'With only one bracket type a simple counter works; with three types and nesting order you need the stack.'],
          ['Where else is this pattern used?', 'Expression evaluation, undo operations, HTML tag matching, and the call stack itself.'],
        ] },
        { say: [
          ['Aise bolo — approach (30 sec)', 'I scan the string once with a stack of open brackets. When I see an opening bracket I push it. When I see a closing bracket, the stack must not be empty and the popped top must be its matching opening bracket, which I look up in a small map; otherwise the string is invalid. At the end the stack must be empty so that nothing is left open. That is O(n) time and O(n) space. A brute force that keeps removing adjacent pairs with replace also works but is O(n squared).'],
        ] },
      ] },
      { title: '✍️ Self-test — bina dekhe', blocks: [
        { qa: [
          ['s = "{[]}" — stack ki states?', '<code>{</code> → <code>{ [</code> → <code>{</code> → khaali → <b>true</b>.'],
          ['s = "(()" — kaunsi line false deti hai?', 'Loop me koi nahi — last line <code>return stack.isEmpty()</code> (stack me ek <code>(</code> bacha) → <b>false</b>.'],
          ['Brute ko <code>"((()))"</code> pe kitne passes lagenge (badalne wale)?', '<b>3</b> passes jo kuch hataate hain (har baar sirf beech ki "()": "(())" → "()" → ""), phir ek aur pass jisme kuch nahi badla → loop ruka.'],
          ['<code>isEmpty()</code> check hata diya toh <code>"]"</code> pe kya?', '<code>pop()</code> khaali ArrayDeque pe → <b>NoSuchElementException</b>.'],
        ] },
        { olist: ['Stack code 4 min me bina dekhe likho.', 'Teeno invalid cases ka ek-ek example zor se bolo.'] },
      ] },
    ],
    checks: [
      'Bata sakta hoon stack (LIFO) yahan kyun fit hota hai',
      'Teeno invalid cases (khaali stack, mismatch, end me bacha) pakad sakta hoon',
      'ArrayDeque push / pop / isEmpty use karke 4 min me code likh sakta hoon',
      'Brute (replace) O(n²) kyun hai — samjha sakta hoon',
    ],
    memory: 'Open → push. Close → khaali ya top ka jodi nahi → false, warna pop. End → stack khaali?',
    tests: [
      { run: 'System.out.print(o.isValid("()"));', out: 'true' },
      { run: 'System.out.print(o.isValid("()[]{}"));', out: 'true' },
      { run: 'System.out.print(o.isValid("(]"));', out: 'false' },
      { run: 'System.out.print(o.isValid("([])"));', out: 'true' },
      { run: 'System.out.print(o.isValid("([)]"));', out: 'false' },
      { run: 'System.out.print(o.isValid("(()"));', out: 'false' },
      { run: 'System.out.print(o.isValid("]"));', out: 'false' },
      { run: 'System.out.print(o.isValid("{[()()]}"));', out: 'true' },
    ],
  };
})();
