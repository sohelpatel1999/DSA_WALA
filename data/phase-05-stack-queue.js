window.PHASE_CONTENT = window.PHASE_CONTENT || {};

window.PHASE_CONTENT['stack-queue'] = {
  intro: 'Stack (LIFO) aur Queue (FIFO) — do chhote data structures jo "pichla pending kaam yaad rakho" type problems ko O(n) bana dete hain. Is phase me: stack/queue ko array se khud banana (circular queue bhi), parentheses matching, design problems (ek structure se doosra banana) aur sabse important — <b>Monotonic Stack</b>.',

  // ---------------- FUNDAMENTALS ----------------
  fundamentals: [
    {
      h: 'Stack kya hai? (LIFO)',
      body: `<p>Stack = plates ka dher. Jo plate <b>sabse last</b> me rakhi, wahi <b>sabse pehle</b> uthegi → <b>LIFO</b> (Last In, First Out).</p>
<p>Sirf <b>top</b> pe kaam hota hai: <code>push</code> (upar rakho), <code>pop</code> (upar se nikalo), <code>peek</code> (upar dekho). Teeno <b>O(1)</b>.</p>
<pre>
 push(1) push(2) push(3)        pop() → 3        peek() → 2

   |   |      |   |      | 3 | ← top   |   |            |   |
   |   |      | 2 |      | 2 |         | 2 | ← top      | 2 | ← top
   | 1 |      | 1 |      | 1 |         | 1 |            | 1 |
   +---+      +---+      +---+         +---+            +---+
</pre>
<p><b>Kab use karte hain?</b> Jab "abhi wala element <b>pichle pending</b> element se match / compare" karna ho: brackets, undo, function call stack, next greater element, expression evaluation.</p>`,
    },
    {
      h: 'Queue kya hai? (FIFO)',
      body: `<p>Queue = ticket counter ki line. Jo <b>pehle aaya</b>, woh <b>pehle jayega</b> → <b>FIFO</b> (First In, First Out).</p>
<p>Peeche (<b>back</b>) se <code>offer</code> karte hain, aage (<b>front</b>) se <code>poll</code>. Dono <b>O(1)</b>.</p>
<pre>
 offer(1), offer(2), offer(3):

   front →  [ 1 | 2 | 3 ]  ← back

 poll() → 1:

   front →  [ 2 | 3 ]  ← back
</pre>
<p><b>Kab use karte hain?</b> Order maintain karna ho — BFS (Phase 7/10), task scheduling, sliding window maximum (Deque), stream processing.</p>
<table class="tbl"><thead><tr><th></th><th>Stack</th><th>Queue</th></tr></thead><tbody>
<tr><td>Order</td><td>LIFO</td><td>FIFO</td></tr>
<tr><td>Add</td><td><code>push(x)</code> → top</td><td><code>offer(x)</code> → back</td></tr>
<tr><td>Remove</td><td><code>pop()</code> ← top</td><td><code>poll()</code> ← front</td></tr>
<tr><td>Dekho</td><td><code>peek()</code> = top</td><td><code>peek()</code> = front</td></tr>
<tr><td>Real life</td><td>Undo, browser back, recursion</td><td>Printer queue, BFS, rate limiter</td></tr>
</tbody></table>`,
    },
    {
      h: 'Array se Stack aur Queue (top index, front/rear, circular)',
      body: `<p><b>Array stack:</b> ek <code>int[] arr</code> + <code>top</code> index (shuru me <b>−1</b>). push = <code>arr[++top] = x</code>, pop = <code>arr[top--]</code>. <code>top == capacity − 1</code> → <b>overflow</b>, <code>top == −1</code> → <b>underflow</b>.</p>
<p><b>Linear array queue:</b> <code>front = 0, rear = −1</code>. enqueue = <code>arr[++rear]</code>, dequeue = <code>arr[front++]</code>. Problem: dequeue ke baad aage ki khaali jagah <b>kabhi reuse nahi</b> hoti.</p>
<p><b>Circular queue:</b> index ko <code>% capacity</code> se ghuma do — last ke baad wapas 0. Ye <b>LC 622</b> hai.</p>
<pre>
 capacity 3, 1 2 3 daale, phir ek dequeue:

 linear:    [ x | 2 | 3 ]   rear = 2 = capacity−1 → "full" (jabki index 0 khaali!)
 circular:  [ 4 | 2 | 3 ]   rear = (2 + 1) % 3 = 0 → 4 index 0 pe ✓
              ^rear  ^front
</pre>`,
    },
    {
      h: 'Java API Cheat Sheet (ArrayDeque)',
      code: `// STACK — hamesha ye likho
Deque<Integer> st = new ArrayDeque<>();
st.push(x);          // top pe daalo        O(1)
st.pop();            // top nikalo (empty → NoSuchElementException)
st.peek();           // top dekho (empty → null)
st.isEmpty();  st.size();

// QUEUE
Queue<Integer> q = new ArrayDeque<>();
q.offer(x);          // back me daalo       O(1)
q.poll();            // front nikalo (empty → null)
q.peek();            // front dekho (empty → null)

// DEQUE (dono taraf) — sliding window max, palindrome check
Deque<Integer> dq = new ArrayDeque<>();
dq.offerFirst(x); dq.offerLast(x);
dq.pollFirst();   dq.pollLast();
dq.peekFirst();   dq.peekLast();

// Characters ke liye
Deque<Character> cs = new ArrayDeque<>();

// Pair store karna ho (MinStack)
Deque<int[]> ps = new ArrayDeque<>();
ps.push(new int[]{val, min});`,
    },
    {
      h: 'Stack class kyun nahi? ArrayDeque kyun?',
      body: `<table class="tbl"><thead><tr><th></th><th><code>Stack&lt;Integer&gt;</code> (legacy)</th><th><code>ArrayDeque&lt;Integer&gt;</code></th></tr></thead><tbody>
<tr><td>Parent</td><td><code>Vector</code> extend karta hai (Java 1.0)</td><td><code>Deque</code> interface (Java 6)</td></tr>
<tr><td>Synchronized</td><td>Haan — har call pe lock → slow</td><td>Nahi → fast (single thread me yahi chahiye)</td></tr>
<tr><td>LIFO toot sakta hai?</td><td>Haan — <code>get(i)</code>, <code>add(i, x)</code> Vector se aate hain</td><td>Nahi — sirf ends pe kaam</td></tr>
<tr><td>Iteration order</td><td>Bottom → top</td><td>Top → bottom (push = addFirst)</td></tr>
<tr><td>null allowed</td><td>Haan</td><td>Nahi (NPE) — good, bugs jaldi pakde jaate hain</td></tr>
</tbody></table>
<p>Java docs khud kehte hain: <i>"A more complete and consistent set of LIFO stack operations is provided by the Deque interface… Deque&lt;Integer&gt; stack = new ArrayDeque&lt;Integer&gt;();"</i></p>
<p><b>LinkedList</b> bhi Deque hai, lekin har node alag object (memory zyada, cache-unfriendly). ArrayDeque ek circular array hai → fast.</p>
<p class="tip">Interview line: <b>"I use ArrayDeque as a stack because Stack extends Vector, which is synchronized and exposes index-based methods that break the LIFO abstraction."</b></p>`,
    },
    {
      h: 'Yaad rakhne wali baatein',
      body: `<ul>
<li><code>pop()</code> empty pe → <code>NoSuchElementException</code>. Pehle <code>isEmpty()</code> check karo.</li>
<li><code>peek()</code> empty pe <b>null</b> deta hai → <code>int top = st.peek();</code> pe unboxing → <b>NullPointerException</b>.</li>
<li><code>Integer</code> ko <code>==</code> se compare mat karo (−128..127 ke bahar cache nahi): <code>st.peek() == minSt.peek()</code> galat ho sakta hai → <code>.equals()</code> ya ek side <code>int</code> me lo.</li>
<li><b>Monotonic stack me indices store karo</b>, values nahi — index se value bhi mil jaati hai aur distance / width bhi.</li>
<li>Har element <b>ek baar push, max ek baar pop</b> → nested while ke bawajood total O(n) (amortized).</li>
<li>Recursion = system ka call stack. Har recursive solution ko explicit stack se iterative bana sakte ho.</li>
</ul>`,
    },
  ],

  // ---------------- OPERATIONS ----------------
  operations: [
    { op: 'push (stack)', time: 'O(1)*', note: 'ArrayDeque amortized O(1) (array bhar gaya toh double)', code: 'st.push(x);' },
    { op: 'pop (stack)', time: 'O(1)', note: 'Empty pe exception — pehle check', code: 'if (!st.isEmpty()) {\n    int top = st.pop();\n}' },
    { op: 'peek (stack)', time: 'O(1)', note: 'Empty pe null', code: 'Integer top = st.peek(); // null ho sakta hai' },
    { op: 'offer (queue)', time: 'O(1)*', note: 'Back me add', code: 'q.offer(x);' },
    { op: 'poll (queue)', time: 'O(1)', note: 'Front se nikalo; empty pe null', code: 'Integer front = q.poll();' },
    { op: 'enqueue (circular array)', time: 'O(1)', note: 'Rear index modulo se ghoomta hai (LC 622)', code: 'int rear = (front + count) % capacity;\narr[rear] = value;\ncount++;' },
    { op: 'dequeue (circular array)', time: 'O(1)', note: 'Shift nahi — sirf front aage', code: 'front = (front + 1) % capacity;\ncount--;' },
    { op: 'isEmpty / size', time: 'O(1)', note: 'Har loop condition me', code: 'while (!st.isEmpty()) { ... }' },
    { op: 'Search / contains', time: 'O(n)', note: 'Stack/queue search ke liye nahi bane — zarurat ho toh HashSet saath rakho', code: 'st.contains(x); // O(n)' },
    { op: 'Iterate (top → bottom)', time: 'O(n)', note: 'ArrayDeque iteration top se shuru hota hai', code: 'for (int x : st) { /* top first */ }' },
    { op: 'Reverse stack into another', time: 'O(n)', note: 'Queue via stacks ka core move', code: 'while (!in.isEmpty()) out.push(in.pop());' },
    { op: 'Rotate queue', time: 'O(n)', note: 'Stack via one queue ka core move', code: 'for (int i = 0; i < q.size() - 1; i++)\n    q.offer(q.poll());' },
  ],

  // ---------------- PATTERNS ----------------
  patterns: [
    {
      name: 'Matching / Parentheses',
      signal: '"Valid brackets", "balanced", "nested", opening ka closing se match',
      idea: 'Opening aaye → push. Closing aaye → top ka opening hona chahiye, warna invalid. End me stack empty = valid.',
      code: `Deque<Character> st = new ArrayDeque<>();
for (char c : s.toCharArray()) {
    if (isOpen(c)) st.push(c);
    else if (st.isEmpty() || st.pop() != pairOf(c)) return false;
}
return st.isEmpty();`,
      qs: [20],
    },
    {
      name: 'Monotonic Stack — Next Greater (decreasing stack)',
      signal: '"Next greater / warmer / bada element", "kitne din baad", "agla bada kaun"',
      idea: 'Stack me woh indices rakho jinka answer abhi nahi mila (values top ki taraf decreasing). Naya bada element aaya → jitne chhote hain sabka answer = ye element, pop karo.',
      code: `Deque<Integer> st = new ArrayDeque<>();   // indices
for (int i = 0; i < n; i++) {
    while (!st.isEmpty() && a[i] > a[st.peek()]) {
        int j = st.pop();
        ans[j] = i;            // ya a[i], ya i - j
    }
    st.push(i);
}
// stack me bache = koi next greater nahi (default -1 / 0)`,
      qs: [739, 496],
    },
    {
      name: 'Monotonic Stack — Previous / Next Smaller (increasing stack)',
      signal: '"Largest rectangle", "kitna door tak extend", "har bar ka width", min ke around',
      idea: 'Stack increasing rakho. Chhota element aaya → pop hone wale bar ka right boundary = i, left boundary = naya top. Width = i − left − 1.',
      code: `for (int i = 0; i <= n; i++) {
    int h = (i == n) ? 0 : a[i];          // sentinel
    while (!st.isEmpty() && h < a[st.peek()]) {
        int height = a[st.pop()];
        int left = st.isEmpty() ? -1 : st.peek();
        best = Math.max(best, height * (i - left - 1));
    }
    st.push(i);
}`,
      qs: [84, 42],
    },
    {
      name: 'Design — ek structure se doosra / auxiliary stack',
      signal: '"Implement X using Y", "O(1) getMin", "class design karo"',
      idea: 'Order ulta karna ho → do stacks (in/out, lazy transfer). Order rotate karna ho → queue rotation. Extra info O(1) me chahiye → har state ke saath info store karo (min stack).',
      code: `// Queue via stacks: lazy transfer
public int peek() {
    if (out.isEmpty())
        while (!in.isEmpty()) out.push(in.pop());
    return out.peek();
}
// Min stack: min bhi saath push
if (minSt.isEmpty() || val <= minSt.peek()) minSt.push(val);`,
      qs: [232, 225, 155, 622],
    },
  ],

  // ---------------- QUESTIONS ----------------
  questions: {
    20: {
      oneLine: 'Opening push, closing pe top match karo; end me stack empty = valid.',
      pattern: 'Stack — Matching / Parentheses',
      approaches: [
        {
          level: 'Brute', idea: 'Jab tak string badal rahi hai, "()", "[]", "{}" ke pairs hatate raho. End me string khaali = valid. Har pass O(n), passes O(n) tak.',
          time: 'O(n²)', space: 'O(n)',
          code: `public boolean isValid(String s) {
    String prev = "";
    while (!s.equals(prev)) {
        prev = s;
        s = s.replace("()", "").replace("[]", "").replace("{}", "");
    }
    return s.isEmpty();
}`,
        },
        {
          level: 'Optimal', idea: 'Stack me pending openings. Closing aaya toh: stack khaali → false; top (peek) uska matching opening hai → pop; warna false. End me stack khaali = valid. Closing <b>sabse recent</b> unmatched opening se hi match hona chahiye — yahi LIFO hai.',
          time: 'O(n)', space: 'O(n)',
          code: `public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char ch : s.toCharArray()) {
        if (ch == '(' || ch == '{' || ch == '[') {
            stack.push(ch);
        } else {
            if (stack.isEmpty()) return false;
            char top = stack.peek();
            if ((ch == ')' && top == '(') || (ch == '}' && top == '{') || (ch == ']' && top == '[')) {
                stack.pop();
            } else {
                return false;
            }
        }
    }
    return stack.isEmpty();
}`,
        },
      ],
      dryRun: '"{[]}" → push { → push [ → ] : top [ match → pop → } : top { match → pop → stack empty → true. "([)]" → ) aaya, top = [ → false',
      interview: 'Brackets must close in reverse order of opening, which is exactly LIFO. I push every opening bracket; for a closing bracket the stack top must be its matching opener, otherwise it is invalid. At the end the stack must be empty. O(n) time, O(n) space.',
      problem: {
        statement: 'String <b>s</b> me sirf <code>( ) [ ] { }</code> characters hain. Batao ki string <b>valid</b> hai ya nahi. Valid tab hai jab: (1) har opening bracket <b>same type</b> ke closing se band ho, (2) <b>sahi order</b> me band ho (jo baad me khula woh pehle band), (3) har closing ka koi opening ho.',
        examples: [
          { input: 's = "()"', output: 'true', explain: 'Ek pair, sahi band hua.', viz: { s: '()' } },
          { input: 's = "()[]{}"', output: 'true', explain: 'Teen alag pairs, har ek turant band.', viz: { s: '()[]{}' } },
          { input: 's = "(]"', output: 'false', explain: '( khula tha, lekin ] se band hua — type match nahi.', viz: { s: '(]' } },
          { input: 's = "([)]"', output: 'false', explain: '[ baad me khula, toh pehle band hona chahiye tha — ) pehle aa gaya.', viz: { s: '([)]' } },
          { input: 's = "{[()]}"', output: 'true', explain: 'Nested — andar wala pehle band, bahar wala baad me.', viz: { s: '{[()]}' } },
        ],
        constraints: ['1 ≤ s.length ≤ 10⁴', 's me sirf <code>()[]{}</code> characters hain'],
      },
    },

    232: {
      oneLine: 'Do stacks: in (push ke liye), out (pop/peek ke liye). out khaali ho tabhi in ka sab out me ulta daalo → amortized O(1).',
      pattern: 'Design — Two Stacks (lazy transfer)',
      approaches: [
        {
          level: 'Brute', idea: 'Ek stack hamesha queue order me rakho (top = front). Har push pe: sab tmp me nikaalo, x daalo, sab wapas. Push O(n), baaki O(1).',
          time: 'push O(n), pop/peek O(1)', space: 'O(n)',
          code: `class MyQueue {
    private Deque<Integer> st = new ArrayDeque<>();  // top = queue ka front
    private Deque<Integer> tmp = new ArrayDeque<>();

    public MyQueue() {
    }

    public void push(int x) {
        while (!st.isEmpty()) tmp.push(st.pop());
        st.push(x);
        while (!tmp.isEmpty()) st.push(tmp.pop());
    }

    public int pop() {
        return st.pop();
    }

    public int peek() {
        return st.peek();
    }

    public boolean empty() {
        return st.isEmpty();
    }
}`,
        },
        {
          level: 'Optimal', idea: 'push hamesha <b>in</b> me. pop/peek <b>out</b> se. out khaali ho tabhi in ke saare elements out me transfer (order ulta ho jaata hai = queue order). Har element max 2 baar move hota hai → amortized O(1).',
          time: 'Amortized O(1) har op', space: 'O(n)',
          code: `class MyQueue {
    private Deque<Integer> in = new ArrayDeque<>();
    private Deque<Integer> out = new ArrayDeque<>();

    public MyQueue() {
    }

    public void push(int x) {
        in.push(x);
    }

    public int pop() {
        peek();
        return out.pop();
    }

    public int peek() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());
        }
        return out.peek();
    }

    public boolean empty() {
        return in.isEmpty() && out.isEmpty();
    }
}`,
        },
      ],
      dryRun: 'push 1, push 2 → in=[1,2] (top 2). peek → out khaali → transfer → out=[2,1] (top 1) → 1. pop → 1. empty → false (out me 2).',
      interview: 'A stack reverses order, so two stacks reverse it twice and give FIFO. I push into an input stack, and serve pop and peek from an output stack; only when the output stack is empty do I move everything over. Each element is moved at most once, so every operation is amortized O(1).',
      problem: {
        statement: 'Sirf <b>do stacks</b> use karke ek <b>FIFO queue</b> banao. Class <code>MyQueue</code> me: <code>push(x)</code> — x ko queue ke peeche daalo; <code>pop()</code> — aage wala element nikaal ke return karo; <code>peek()</code> — aage wala element return karo; <code>empty()</code> — queue khaali hai toh true. Sirf standard stack operations allowed: top pe push, top se pop/peek, size, isEmpty. Follow-up: har operation <b>amortized O(1)</b>.',
        examples: [
          { input: '["MyQueue","push","push","peek","pop","empty"]\n[[],[1],[2],[],[],[]]', output: '[null,null,null,1,1,false]', explain: 'Queue: [1] → [1,2]. peek = 1 (front). pop = 1 → [2]. empty = false.', viz: { ops: '["MyQueue","push","push","peek","pop","empty"]', args: '[[],[1],[2],[],[],[]]' } },
          { input: '["MyQueue","push","push","push","pop","push","peek","pop","pop","empty"]\n[[],[1],[2],[3],[],[4],[],[],[],[]]', output: '[null,null,null,null,1,null,2,2,3,false]', explain: '[1,2,3] → pop 1 → [2,3] → push 4 → [2,3,4] → peek 2 → pop 2 → pop 3 → [4] → empty false. Dekho: push 4 in me gaya, out me 2,3 pehle se the — transfer nahi hua.', viz: { ops: '["MyQueue","push","push","push","pop","push","peek","pop","pop","empty"]', args: '[[],[1],[2],[3],[],[4],[],[],[],[]]' } },
        ],
        constraints: ['1 ≤ x ≤ 9', 'Total calls ≤ 100', 'pop aur peek hamesha valid (queue khaali nahi hogi)', 'Follow-up: amortized O(1) per operation'],
      },
    },

    225: {
      oneLine: 'Ek queue: push ke baad pichle (size − 1) elements ko rotate karke peeche bhejo → naya element front pe = stack ka top.',
      pattern: 'Design — Queue rotation',
      approaches: [
        {
          level: 'Brute', idea: 'Do queues, <b>costly pop</b>. push O(1) — q1 me daalo. pop: q1 ke (size − 1) elements q2 me bhejo, last wala = top, nikaalo, fir q1 aur q2 swap. top() = pop karke wapas push — toh pop aur top dono O(n).',
          time: 'push O(1), pop/top O(n)', space: 'O(n)',
          code: `class MyStack {
    private Queue<Integer> q1 = new ArrayDeque<>();
    private Queue<Integer> q2 = new ArrayDeque<>();

    public MyStack() {
    }

    public void push(int x) {
        q1.offer(x);
    }

    public int pop() {
        while (q1.size() > 1) q2.offer(q1.poll());
        int top = q1.poll();
        Queue<Integer> t = q1;
        q1 = q2;
        q2 = t;
        return top;
    }

    public int top() {
        int top = pop();
        push(top);
        return top;
    }

    public boolean empty() {
        return q1.isEmpty();
    }
}`,
        },
        {
          level: 'Better', idea: 'Do queues, <b>costly push</b> (syllabus wala). Naya x khaali q2 me daalo, phir q1 ke saare elements q2 me (x ke peeche), phir q1 ↔ q2 swap. Ab q1 ka front hamesha latest element = stack ka top → pop/top O(1). Brute me pop/top dono O(n) the; yahan sirf push O(n).',
          time: 'push O(n), pop/top O(1)', space: 'O(n) (do queues)',
          code: `class MyStack {
    private Queue<Integer> q1 = new LinkedList<>();
    private Queue<Integer> q2 = new LinkedList<>();

    public MyStack() {
    }

    public void push(int x) {
        q2.offer(x);
        while (!q1.isEmpty()) {
            q2.offer(q1.poll());
        }
        Queue<Integer> temp = q1;
        q1 = q2;
        q2 = temp;
    }

    public int pop() {
        return q1.poll();
    }

    public int top() {
        return q1.peek();
    }

    public boolean empty() {
        return q1.isEmpty();
    }
}`,
        },
        {
          level: 'Optimal', idea: 'Ek hi queue (follow-up). push(x): offer karo, fir pehle ke (size − 1) elements ko poll karke wapas offer — x front pe aa jaata hai. Ab queue ka front = stack ka top, toh pop/top O(1). Better jaisi complexity, lekin doosri queue ki zarurat nahi.',
          time: 'push O(n), pop/top O(1)', space: 'O(n) (sirf ek queue)',
          code: `class MyStack {
    private Queue<Integer> queue = new LinkedList<>();

    public MyStack() {
    }

    public void push(int x) {
        queue.offer(x);
        int size = queue.size();
        for (int i = 0; i < size - 1; i++) {
            queue.offer(queue.poll());
        }
    }

    public int pop() {
        return queue.poll();
    }

    public int top() {
        return queue.peek();
    }

    public boolean empty() {
        return queue.isEmpty();
    }
}`,
        },
      ],
      dryRun: 'One queue: push 1 → [1]. push 2 → [1,2] → rotate 1 → [2,1]. push 3 → [2,1,3] → rotate 2 → [1,3,2] → [3,2,1]. top → 3. pop → 3 → [2,1]. Two queues (costly push): push 1 → q1 [1]; push 2 → q2 [2] → q1 ka 1 q2 me → q2 [2,1] → swap → q1 [2,1].',
      interview: 'A queue keeps insertion order, so to get LIFO I rotate it on every push: after offering x, I poll and re-offer the previous size − 1 elements, which brings x to the front. Then pop and top are just poll and peek. Push is O(n), pop and top are O(1), using a single queue. With two queues I can either make push costly (new element into the empty queue, move everything behind it, swap) or make pop costly; the one-queue version gives the same complexity with less space.',
      problem: {
        statement: 'Sirf <b>queues</b> use karke ek <b>LIFO stack</b> banao. Class <code>MyStack</code> me: <code>push(x)</code> — top pe daalo; <code>pop()</code> — top nikaal ke return; <code>top()</code> — top return; <code>empty()</code> — khaali hai toh true. Sirf standard queue operations allowed: peeche offer, aage se poll/peek, size, isEmpty. Follow-up: <b>sirf ek queue</b> se karo.',
        examples: [
          { input: '["MyStack","push","push","top","pop","empty"]\n[[],[1],[2],[],[],[]]', output: '[null,null,null,2,2,false]', explain: 'Stack: [1] → [1,2]. top = 2 (last pushed). pop = 2 → [1]. empty = false.', viz: { ops: '["MyStack","push","push","top","pop","empty"]', args: '[[],[1],[2],[],[],[]]' } },
          { input: '["MyStack","push","push","push","pop","top","push","pop","pop","pop","empty"]\n[[],[1],[2],[3],[],[],[4],[],[],[],[]]', output: '[null,null,null,null,3,2,null,4,2,1,true]', explain: '[1,2,3] → pop 3 → top 2 → push 4 → pop 4 → pop 2 → pop 1 → empty true.', viz: { ops: '["MyStack","push","push","push","pop","top","push","pop","pop","pop","empty"]', args: '[[],[1],[2],[3],[],[],[4],[],[],[],[]]' } },
        ],
        constraints: ['1 ≤ x ≤ 9', 'Total calls ≤ 100', 'pop aur top hamesha valid', 'Follow-up: sirf ek queue'],
      },
    },

    739: {
      oneLine: 'Waiting problem = next greater with DISTANCE: stack me un-resolved din ke indices; garam din aaya → har thanda din jo pop ho uska answer i − previousIndex.',
      pattern: 'Monotonic Stack — Next Greater',
      approaches: [
        {
          level: 'Brute', idea: 'Har din i ke liye aage scan karo; pehla garam din j mile toh result[i] = j − i, warna 0 (default).',
          time: 'O(n²)', space: 'O(1) extra (output O(n))',
          code: `public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] result = new int[n];
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (temperatures[j] > temperatures[i]) {
                result[i] = j - i;
                break;
            }
        }
    }
    return result;
}`,
        },
        {
          level: 'Optimal (right → left)', idea: 'Peeche se chalo. Stack me "future ke candidates" (indices). Jo current se thande ya barabar hain woh kabhi kisi ke answer nahi banenge → pop. Bacha top = next warmer day → result[i] = top − i. Answer turant milta hai.',
          time: 'O(n)', space: 'O(n)',
          code: `public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] result = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // future ke candidate indices
    for (int i = n - 1; i >= 0; i--) {
        while (!stack.isEmpty() && temperatures[stack.peek()] <= temperatures[i]) stack.pop();
        result[i] = stack.isEmpty() ? 0 : stack.peek() - i;
        stack.push(i);
    }
    return result;
}`,
        },
        {
          level: 'Optimal', idea: 'Aage se chalo (syllabus). Stack me un-resolved din ke <b>indices</b> (temperatures top ki taraf decreasing). Aaj top se garam hai → aaj hi uska answer: previousIndex = pop, result[previousIndex] = i − previousIndex; repeat. Bache hue din ka answer default 0. Har index ek push, max ek pop → amortized O(n).',
          time: 'O(n)', space: 'O(n)',
          code: `public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] result = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // un-resolved day indices
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int previousIndex = stack.pop();
            result[previousIndex] = i - previousIndex;
        }
        stack.push(i);
    }
    return result;
}`,
        },
      ],
      dryRun: '[73,74,75,71,69,72,76,73] → i=1 resolves 0 · i=2 resolves 1 · push 3, 4 · i=5 (72) resolves 4 (ans 1), 3 (ans 2) · i=6 (76) resolves 5 (1), 2 (4) · 6, 7 bache → 0 → [1,1,4,2,1,1,0,0]',
      interview: 'This is a next greater element problem where the answer is a distance, so I store indices, not values. Brute force scans forward from every day, which is O(n squared). Instead I keep a stack of indices of days still waiting for a warmer day; their temperatures decrease from bottom to top. When today is warmer than the top, today resolves that day: I pop it and record i minus that index, and repeat. Days left in the stack never get a warmer day, so they keep the default zero. Each index is pushed and popped at most once, so it is amortized O(n) time and O(n) space.',
      problem: {
        statement: 'Array <b>temperatures</b> me har din ka temperature hai. Har din i ke liye batao ki <b>kitne din baad</b> pehli baar isse <b>zyada garam</b> din aayega. Agar aage koi garam din nahi hai toh <code>0</code>.',
        examples: [
          { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]', explain: 'Din 2 (75) ke baad pehla garam din 6 (76) → 6 − 2 = 4. Din 6 (76) aur 7 (73) ke baad koi garam nahi → 0.', viz: { temperatures: '73, 74, 75, 71, 69, 72, 76, 73' } },
          { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]', explain: 'Har agla din garam hai.', viz: { temperatures: '30, 40, 50, 60' } },
          { input: 'temperatures = [30,60,90]', output: '[1,1,0]', explain: 'Increasing — stack me kabhi ek se zyada element nahi rukta.', viz: { temperatures: '30, 60, 90' } },
        ],
        constraints: ['1 ≤ temperatures.length ≤ 10⁵', '30 ≤ temperatures[i] ≤ 100'],
      },
    },

    496: {
      oneLine: 'nums2 pe decreasing monotonic stack (un-resolved values): bada num aaya → jitne chhote top pe hain sabka next greater = num (HashMap me); bache → −1; nums1 ke liye map lookup.',
      pattern: 'Monotonic Stack — Next Greater + HashMap',
      approaches: [
        {
          level: 'Brute', idea: 'nums1 ke har x ke liye nums2 me x ki position dhundo, fir uske right me pehla bada scan karo. Nahi mila → −1.',
          time: 'O(m · n)', space: 'O(1) extra',
          code: `public int[] nextGreaterElement(int[] nums1, int[] nums2) {
    int[] ans = new int[nums1.length];
    for (int i = 0; i < nums1.length; i++) {
        ans[i] = -1;
        int j = 0;
        while (nums2[j] != nums1[i]) j++;
        for (int k = j + 1; k < nums2.length; k++) {
            if (nums2[k] > nums1[i]) {
                ans[i] = nums2[k];
                break;
            }
        }
    }
    return ans;
}`,
        },
        {
          level: 'Optimal', idea: 'Pehle nums2 ke <b>har</b> element ka next greater ek pass me (syllabus 6A/6B): stack me un-resolved values (decreasing). num &gt; top → top resolve: map.put(pop, num). Phir push num. Loop ke baad bache = koi greater nahi → −1. Values distinct hain isliye value hi key. nums1 ke liye map.get.',
          time: 'O(m + n)', space: 'O(n)',
          code: `public int[] nextGreaterElement(int[] nums1, int[] nums2) {
    Map<Integer, Integer> map = new HashMap<>(); // value -> next greater in nums2
    Deque<Integer> stack = new ArrayDeque<>();   // un-resolved values (decreasing)
    for (int num : nums2) {
        while (!stack.isEmpty() && num > stack.peek()) {
            map.put(stack.pop(), num);
        }
        stack.push(num);
    }
    while (!stack.isEmpty()) {
        map.put(stack.pop(), -1);
    }
    int[] result = new int[nums1.length];
    for (int i = 0; i < nums1.length; i++) {
        result[i] = map.get(nums1[i]);
    }
    return result;
}`,
        },
      ],
      dryRun: 'nums2 = [1,3,4,2]: push 1 → 3 aaya: 1 resolve (1→3), push 3 → 4 aaya: 3 resolve (3→4), push 4 → 2 push. Bache [4, 2] → −1. Map {1=3, 3=4, 4=−1, 2=−1} → nums1 [4,1,2] → [-1,3,-1]',
      interview: 'Brute force finds each nums1 value in nums2 and scans right for the first greater one, which is O(m times n). Instead I compute the next greater element for every value of nums2 in one pass with a decreasing monotonic stack of unresolved values: when a bigger number arrives, it is the answer for every smaller value on top, so I pop them into a HashMap. Whatever remains in the stack has no greater element and maps to minus one. Because the values are distinct, each nums1 query is a map lookup. Every element is pushed and popped at most once, so it is O(m plus n) time and O(n) space.',
      problem: {
        statement: 'Do arrays <b>nums1</b> aur <b>nums2</b> hain — values distinct, aur nums1 ki har value nums2 me hai (nums1 ⊆ nums2). nums1 ke har element x ke liye: nums2 me x jahan hai, uske <b>right</b> me pehla element jo x se <b>bada</b> ho — woh answer, warna <code>-1</code>.',
        examples: [
          { input: 'nums1 = [4,1,2], nums2 = [1,3,4,2]', output: '[-1,3,-1]', explain: '4 ke right me sirf 2 → koi bada nahi → -1. 1 ke right me pehla bada 3. 2 last hai → -1.', viz: { nums1: '4, 1, 2', nums2: '1, 3, 4, 2' } },
          { input: 'nums1 = [2,4], nums2 = [1,2,3,4]', output: '[3,-1]', explain: '2 ka next greater 3. 4 ke right me kuch nahi → -1.', viz: { nums1: '2, 4', nums2: '1, 2, 3, 4' } },
        ],
        constraints: ['1 ≤ nums1.length ≤ nums2.length ≤ 1000', '0 ≤ nums1[i], nums2[i] ≤ 10⁴', 'Saari values distinct; nums1 ki har value nums2 me hai', 'Follow-up: O(nums1.length + nums2.length)'],
      },
    },

    84: {
      oneLine: 'Har bar ko shortest maan ke: left me pehla chhota (PSE) aur right me pehla chhota (NSE) — width = NSE − PSE − 1. Increasing stack of indices ek pass me pop ke waqt dono deta hai.',
      pattern: 'Monotonic Stack — Previous / Next Smaller',
      approaches: [
        {
          level: 'Brute', idea: 'Har bar i ko rectangle ki height maano; left aur right tab tak failao jab tak bars ≥ heights[i] hain. Width = right − left + 1, area = heights[i] × width. Max lo.',
          time: 'O(n²)', space: 'O(1)',
          code: `public int largestRectangleArea(int[] heights) {
    int n = heights.length, maxArea = 0;
    for (int i = 0; i < n; i++) {
        int left = i, right = i;
        while (left > 0 && heights[left - 1] >= heights[i]) left--;
        while (right < n - 1 && heights[right + 1] >= heights[i]) right++;
        maxArea = Math.max(maxArea, heights[i] * (right - left + 1));
    }
    return maxArea;
}`,
        },
        {
          level: 'Better', idea: 'Boundaries pehle (syllabus): do monotonic stack passes se pse[i] (left ka nearest strictly smaller, nahi toh −1) aur nse[i] (right ka nearest strictly smaller, nahi toh n). Area = heights[i] × (nse[i] − pse[i] − 1). O(n), lekin 3 passes + 2 extra arrays.',
          time: 'O(n)', space: 'O(n) (pse + nse + stack)',
          code: `public int largestRectangleArea(int[] heights) {
    int n = heights.length;
    int[] pse = new int[n], nse = new int[n]; // previous / next strictly smaller index
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && heights[stack.peek()] >= heights[i]) stack.pop();
        pse[i] = stack.isEmpty() ? -1 : stack.peek();
        stack.push(i);
    }
    stack.clear();
    for (int i = n - 1; i >= 0; i--) {
        while (!stack.isEmpty() && heights[stack.peek()] >= heights[i]) stack.pop();
        nse[i] = stack.isEmpty() ? n : stack.peek();
        stack.push(i);
    }
    int maxArea = 0;
    for (int i = 0; i < n; i++) {
        maxArea = Math.max(maxArea, heights[i] * (nse[i] - pse[i] - 1));
    }
    return maxArea;
}`,
        },
        {
          level: 'Optimal', idea: 'Ek hi pass, increasing stack of indices (user ka corrected code). Chhota bar i aaya → top bar ka <b>NSE = i</b>; pop ke baad naya top = uska <b>PSE</b> (khaali → −1). width = i − previousSmaller − 1, turant area. i == n pe sentinel height 0 sab pop karwata hai — aur sentinel index <b>push nahi</b> hota (<code>if (i &lt; n)</code>).',
          time: 'O(n)', space: 'O(n)',
          code: `public int largestRectangleArea(int[] heights) {
    int n = heights.length, maxArea = 0;
    Deque<Integer> stack = new ArrayDeque<>(); // indices, heights increasing
    for (int i = 0; i <= n; i++) {
        int currentHeight = (i == n) ? 0 : heights[i];
        while (!stack.isEmpty() && heights[stack.peek()] > currentHeight) {
            int heightIndex = stack.pop();
            int height = heights[heightIndex];
            int previousSmaller = stack.isEmpty() ? -1 : stack.peek();
            int width = i - previousSmaller - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        if (i < n) stack.push(i);
    }
    return maxArea;
}`,
        },
      ],
      dryRun: '[2,1,5,6,2,3] → i=1: pop 0 (h2, w1 → 2) · push 1, 2, 3 · i=4 (h2): pop 3 (h6, prev 2, w1 → 6), pop 2 (h5, prev 1, w2 → 10) · push 4, 5 · i=6 sentinel 0: pop 5 (h3, w1 → 3), pop 4 (h2, prev 1, w4 → 8), pop 1 (h1, prev −1, w6 → 6) → max 10',
      interview: 'The largest rectangle must use some bar as its shortest bar, and it extends until the first strictly smaller bar on each side, so width is next smaller minus previous smaller minus one. I can compute both boundary arrays with two monotonic stack passes, or do it in one pass: I keep a stack of indices with increasing heights, and when a smaller height arrives at i, the popped bar’s next smaller is i and its previous smaller is the new top, or minus one. A sentinel height of zero at i equals n flushes the stack, and I do not push that sentinel index. Each index is pushed and popped once, so it is O(n) time and O(n) space.',
      problem: {
        statement: 'Array <b>heights</b> ek histogram hai — har bar ki width 1. Histogram ke andar ban sakne wale <b>sabse bade rectangle ka area</b> return karo (rectangle continuous bars pe bane, height = un bars ka minimum).',
        examples: [
          { input: 'heights = [2,1,5,6,2,3]', output: '10', explain: 'Bars 5 aur 6 (index 2..3) pe height 5 ka rectangle: 5 × 2 = 10.', viz: { heights: '2, 1, 5, 6, 2, 3' } },
          { input: 'heights = [2,4]', output: '4', explain: 'Ya toh 4 × 1 = 4, ya 2 × 2 = 4.', viz: { heights: '2, 4' } },
          { input: 'heights = [2,1,2]', output: '3', explain: 'Height 1 poori width 3 pe: 1 × 3 = 3 (2 × 1 se bada).', viz: { heights: '2, 1, 2' } },
        ],
        constraints: ['1 ≤ heights.length ≤ 10⁵', '0 ≤ heights[i] ≤ 10⁴'],
      },
    },

    155: {
      oneLine: 'Saath me ek minStack rakho: val ≤ current min ho toh usme bhi push; pop pe agar woh min tha toh minStack se bhi pop.',
      pattern: 'Design — Auxiliary Stack',
      approaches: [
        {
          level: 'Brute', idea: 'Normal stack. getMin pe poora stack scan karo.',
          time: 'getMin O(n), baaki O(1)', space: 'O(n)',
          code: `class MinStack {
    private Deque<Integer> st = new ArrayDeque<>();

    public MinStack() {
    }

    public void push(int val) {
        st.push(val);
    }

    public void pop() {
        st.pop();
    }

    public int top() {
        return st.peek();
    }

    public int getMin() {
        int min = Integer.MAX_VALUE;
        for (int x : st) min = Math.min(min, x);
        return min;
    }
}`,
        },
        {
          level: 'Better', idea: 'Har entry ke saath "is level tak ka min" bhi store karo: {val, min}. Top ka min hi current min hai. Saare ops O(1), lekin har element ke saath extra int.',
          time: 'O(1) har op', space: 'O(2n)',
          code: `class MinStack {
    private Deque<int[]> st = new ArrayDeque<>(); // {val, min so far}

    public MinStack() {
    }

    public void push(int val) {
        int min = st.isEmpty() ? val : Math.min(val, st.peek()[1]);
        st.push(new int[]{val, min});
    }

    public void pop() {
        st.pop();
    }

    public int top() {
        return st.peek()[0];
    }

    public int getMin() {
        return st.peek()[1];
    }
}`,
        },
        {
          level: 'Optimal', idea: 'Do stacks (syllabus wala). minStack me sirf tab push jab val ≤ current min (<b>≤</b> — duplicates ke liye zaroori). pop me agar nikla value (removed) == minStack top, toh minStack se bhi pop. Min kam hi badalta hai toh minStack chhota rehta hai.',
          time: 'O(1) har op', space: 'O(n) worst',
          code: `class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();
    private Deque<Integer> minStack = new ArrayDeque<>(); // top = current min

    public MinStack() {
    }

    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        }
    }

    public void pop() {
        int removed = stack.pop();
        if (removed == minStack.peek()) {
            minStack.pop();
        }
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return minStack.peek();
    }
}`,
        },
      ],
      dryRun: 'push −2 → st[−2], min[−2]; push 0 → min same; push −3 → min[−2,−3]; getMin −3; pop (−3 == min top) → min[−2]; top 0; getMin −2',
      interview: 'Alongside the main stack I keep a min stack whose top is always the current minimum. On push, I also push onto the min stack when the value is less than or equal to the current min — the equality handles duplicates. On pop, if the popped value equals the min stack’s top, I pop that too. Every operation is O(1).',
      problem: {
        statement: 'Ek stack design karo jo <code>push(val)</code>, <code>pop()</code>, <code>top()</code> aur <code>getMin()</code> (stack ka sabse chhota element) — <b>chaaro O(1)</b> me support kare. pop/top/getMin hamesha non-empty stack pe call honge.',
        examples: [
          { input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]', output: '[null,null,null,null,-3,null,0,-2]', explain: 'Stack [−2, 0, −3] → min −3. pop (−3 gaya) → [−2, 0] → top 0, min −2.', viz: { ops: '["MinStack","push","push","push","getMin","pop","top","getMin"]', args: '[[],[-2],[0],[-3],[],[],[],[]]' } },
          { input: '["MinStack","push","push","push","getMin","pop","getMin","pop","getMin"]\n[[],[0],[1],[0],[],[],[],[],[]]', output: '[null,null,null,null,0,null,0,null,0]', explain: 'Min 0 do baar push hua. Ek 0 pop hone ke baad bhi min 0 rehna chahiye — isliye push me <b>≤</b> (sirf &lt; hota toh galat).', viz: { ops: '["MinStack","push","push","push","getMin","pop","getMin","pop","getMin"]', args: '[[],[0],[1],[0],[],[],[],[],[]]' } },
        ],
        constraints: ['−2³¹ ≤ val ≤ 2³¹ − 1', 'pop, top, getMin hamesha non-empty stack pe', 'Total calls ≤ 3 × 10⁴', 'Har operation O(1)'],
      },
    },

    622: {
      oneLine: 'Fixed array + front index + count: rear = (front + count) % k par likho, dequeue pe front = (front + 1) % k — khaali jagah reuse, har op O(1).',
      pattern: 'Design — Circular Array (front + count)',
      approaches: [
        {
          level: 'Brute', idea: 'Linear array jaisa: elements hamesha index 0 se shuru. enQueue = arr[size] pe likho. deQueue = index 0 hatao aur baaki sab ek step left <b>shift</b> karo. Front = arr[0], Rear = arr[size − 1]. Sahi chalta hai, lekin har deQueue O(n).',
          time: 'deQueue O(n), baaki O(1)', space: 'O(k)',
          code: `class MyCircularQueue {
    private int[] arr;
    private int size;

    public MyCircularQueue(int k) {
        arr = new int[k];
        size = 0;
    }

    public boolean enQueue(int value) {
        if (isFull()) return false;
        arr[size] = value;
        size++;
        return true;
    }

    public boolean deQueue() {
        if (isEmpty()) return false;
        for (int i = 1; i < size; i++) {
            arr[i - 1] = arr[i];
        }
        size--;
        return true;
    }

    public int Front() {
        return isEmpty() ? -1 : arr[0];
    }

    public int Rear() {
        return isEmpty() ? -1 : arr[size - 1];
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public boolean isFull() {
        return size == arr.length;
    }
}`,
        },
        {
          level: 'Optimal', idea: 'Shift mat karo — <b>front pointer</b> aage badhao. Array ko gol (circular) maano: index (front + count) % capacity pe naya element, deQueue pe front = (front + 1) % capacity. <b>count</b> se empty (count == 0) aur full (count == capacity) saaf alag pata chalte hain. Rear = arr[(front + count − 1) % capacity]. Sab O(1).',
          time: 'O(1) har op', space: 'O(k)',
          code: `class MyCircularQueue {
    private int[] arr;
    private int front;
    private int count;
    private int capacity;

    public MyCircularQueue(int k) {
        capacity = k;
        arr = new int[k];
        front = 0;
        count = 0;
    }

    public boolean enQueue(int value) {
        if (isFull()) return false;
        int rear = (front + count) % capacity;
        arr[rear] = value;
        count++;
        return true;
    }

    public boolean deQueue() {
        if (isEmpty()) return false;
        front = (front + 1) % capacity;
        count--;
        return true;
    }

    public int Front() {
        if (isEmpty()) return -1;
        return arr[front];
    }

    public int Rear() {
        if (isEmpty()) return -1;
        return arr[(front + count - 1) % capacity];
    }

    public boolean isEmpty() {
        return count == 0;
    }

    public boolean isFull() {
        return count == capacity;
    }
}`,
        },
      ],
      dryRun: 'k = 3: enQueue 1, 2, 3 → arr [1,2,3], front 0, count 3. enQueue 4 → full → false. Rear → arr[2] = 3. deQueue → front 1, count 2. enQueue 4 → rear = (1 + 2) % 3 = 0 → arr [4,2,3] (index 0 reuse!). Rear → arr[(1 + 3 − 1) % 3 = 0] = 4.',
      interview: 'I use a fixed array of size k with a front index and a count. Enqueue writes at (front + count) mod k and increments count; dequeue just moves front forward with modulo and decrements count, so freed slots at the start are reused instead of shifting elements. Front is arr[front], rear is arr[(front + count − 1) mod k], empty is count == 0 and full is count == k. Every operation is O(1) time and the space is O(k). Keeping a count avoids the classic ambiguity where front == rear could mean either empty or full.',
      problem: {
        statement: 'Ek <b>circular queue</b> design karo (fixed capacity k, FIFO, last position ke baad wapas first position se judi hui — "ring buffer"). Class <code>MyCircularQueue</code>: <code>MyCircularQueue(k)</code> — size k; <code>Front()</code> — front element, khaali ho toh <code>-1</code>; <code>Rear()</code> — last element, khaali ho toh <code>-1</code>; <code>enQueue(value)</code> — daalo, success pe <code>true</code> (full ho toh <code>false</code>); <code>deQueue()</code> — front hatao, success pe <code>true</code> (khaali ho toh <code>false</code>); <code>isEmpty()</code>; <code>isFull()</code>. Built-in queue data structure use <b>nahi</b> karna.',
        examples: [
          { input: '["MyCircularQueue","enQueue","enQueue","enQueue","enQueue","Rear","isFull","deQueue","enQueue","Rear"]\n[[3],[1],[2],[3],[4],[],[],[],[4],[]]', output: '[null,true,true,true,false,3,true,true,true,4]', explain: 'k = 3. 1, 2, 3 aa gaye → full, isliye enQueue(4) = false. Rear = 3. deQueue (1 gaya) → jagah khaali → enQueue(4) = true (index 0 pe wrap). Rear = 4.', viz: { ops: '["MyCircularQueue","enQueue","enQueue","enQueue","enQueue","Rear","isFull","deQueue","enQueue","Rear"]', args: '[[3],[1],[2],[3],[4],[],[],[],[4],[]]' } },
          { input: '["MyCircularQueue","enQueue","Front","deQueue","isEmpty","deQueue","Front","Rear"]\n[[2],[5],[],[],[],[],[],[]]', output: '[null,true,5,true,true,false,-1,-1]', explain: 'k = 2. 5 daala → Front 5. deQueue → khaali → isEmpty true. Khaali queue pe deQueue = false, Front = -1, Rear = -1.', viz: { ops: '["MyCircularQueue","enQueue","Front","deQueue","isEmpty","deQueue","Front","Rear"]', args: '[[2],[5],[],[],[],[],[],[]]' } },
        ],
        constraints: ['1 ≤ k ≤ 1000', '0 ≤ value ≤ 1000', 'Total calls ≤ 3000 (enQueue, deQueue, Front, Rear, isEmpty, isFull)', 'Built-in Queue use mat karo'],
      },
    },
  },

  // ---------------- 14-DAY PLAN (Week 7 + Week 8 = user ka syllabus, 2026-11-22 / 23) ----------------
  days: [
    {
      day: 1, week: 1, dow: 'Mon', type: 'learn', title: 'Stack Basics — LIFO + Array Implementation',
      theory: ['LIFO — plates ka dher', 'top / push / pop / peek / isEmpty / isFull / size', 'Array stack: top = −1, arr[++top], arr[top--]', 'Overflow vs Underflow', 'java.util.Stack vs ArrayDeque', 'LC 20 statement padho (kal solve)'],
      qs: [20],
      interview: {
        q: 'What is a stack, and how would you implement one with an array?',
        a: 'A stack is a linear data structure that follows LIFO, last in first out: the element inserted last is removed first, and all work happens at one end called the top. With an array I keep an int array and a top index that starts at minus one. Push checks for overflow when top equals capacity minus one, then writes at plus-plus top; pop checks for underflow when top is minus one, then returns the element at top and decrements it; peek returns the top element without removing it. All of these are O(1) because only the top index changes. In Java production code I would use ArrayDeque rather than the legacy, synchronized Stack class.',
      },
    },
    {
      day: 2, week: 1, dow: 'Tue', type: 'learn', title: 'Valid Parentheses — Matching Pairs using Stack',
      theory: ['Opening push, closing pe top match', 'Counting kaafi nahi — ([)] order galat', 'Closing aaya aur stack khaali → invalid', 'End me stack empty = valid', 'O(n) time, O(n) space'],
      qs: [20],
      interview: {
        q: 'Why is a stack the right data structure for bracket matching?',
        a: 'Brackets must be closed in the reverse order in which they were opened: the most recently opened bracket has to be closed first, which is exactly last in, first out. So I push every opening bracket, and when a closing bracket arrives, the top of the stack must be its matching opener; if the stack is empty or the top does not match, the string is invalid. At the end the stack must be empty, otherwise some brackets were never closed. Simply counting brackets fails for inputs like open-paren, open-square, close-paren, close-square, where the counts match but the order is wrong. It is O(n) time and O(n) space in the worst case of all openings.',
      },
    },
    {
      day: 3, week: 1, dow: 'Wed', type: 'learn', title: 'Queue Basics — FIFO, Array Queue + Circular Queue',
      theory: ['FIFO — ticket counter', 'front / rear, enqueue / dequeue / peek', 'Linear array queue ki limitation', 'Circular queue: (index + 1) % capacity', 'Stack vs Queue', 'Sohvi: LC 232 statement · Tum: LC 622'],
      qs: [232, 622],
      interview: {
        q: 'Why do we need a circular queue instead of a simple array queue?',
        a: 'In a linear array queue, enqueue moves the rear index forward and dequeue moves the front index forward, so the slots before front are never reused. After enough operations the rear reaches the end of the array and the queue reports full even though there is free space at the start. A circular queue treats the array as a ring: indices wrap around with modulo capacity, so freed slots are reused and every operation stays O(1) without shifting elements. I usually track a count as well, so that empty is count equals zero and full is count equals capacity, which avoids the front-equals-rear ambiguity.',
      },
    },
    {
      day: 4, week: 1, dow: 'Thu', type: 'learn', title: 'Stack using Queues — Data Structure Simulation',
      theory: ['Queue (FIFO) se Stack (LIFO) banana', 'Two queues — costly pop vs costly push', 'One queue: offer + (size − 1) rotate', 'Kaunsa operation optimize kar rahe ho', 'Push O(n), pop/top O(1)'],
      qs: [225],
      interview: {
        q: 'How do you implement a stack using only one queue?',
        a: 'A queue gives elements back in insertion order, but a stack needs the newest element first. So on every push I offer the new element and then rotate the queue size minus one times, polling from the front and offering to the back. After the rotation the newest element is at the front, so pop is just poll and top is just peek, both O(1), while push is O(n). With two queues I could instead make pop expensive, but the one-queue version has the same complexity for reads and uses less space. The choice depends on whether pushes or pops dominate the workload.',
      },
    },
    {
      day: 5, week: 1, dow: 'Fri', type: 'learn', title: 'Min Stack — Auxiliary Data Structure',
      theory: ['getMin har baar traverse = O(n)', 'Auxiliary minStack: top = current min', 'Push me ≤ (duplicates)', 'Pop: removed == min top → dono se pop', 'Follow-up: single stack encoding'],
      qs: [155],
      interview: {
        q: 'How does a min stack return the minimum in O(1), and why do you push equal values?',
        a: 'Alongside the main stack I keep an auxiliary min stack whose top is always the current minimum. On push I also push the value onto the min stack if the min stack is empty or the value is less than or equal to its top. On pop, if the removed value equals the min stack top, I pop the min stack too, which restores the previous minimum. Equal values must be pushed because of duplicates: if I push two equal minimums but record only one, popping the first would wrongly remove the minimum while a copy is still in the stack. All operations are O(1), with O(n) extra space in the worst case.',
      },
    },
    {
      day: 6, week: 1, dow: 'Sat', type: 'revision', title: 'Stack & Queue Revision — 20, 232, 225, 155',
      theory: ['Master table: LIFO, matching, FIFO, simulation, auxiliary', 'LC 232 two stacks ≠ array queue', 'Tum: 6 implementations bina notes', 'Pattern recognition test (6)', 'System Design session'],
      qs: [20, 232, 225, 155],
      interview: {
        q: 'How do you implement a queue using two stacks, and why is it amortized O(1)?',
        a: 'I keep an input stack for push and an output stack for pop and peek. Push always goes onto the input stack. For pop or peek, if the output stack is empty I move every element from the input stack to the output stack, which reverses their order so the oldest element ends up on top. Each element is pushed onto the input stack once, moved once and popped once, so a sequence of n operations costs O(n) in total, which is amortized O(1) per operation even though a single transfer can take O(n).',
      },
    },
    {
      day: 7, week: 1, dow: 'Sun', type: 'mock', title: 'Week 7 Mock Interview — Stack & Queue Assessment + Contest',
      theory: ['Sohvi 30 min: stack, LIFO, queue, FIFO, LC 20', 'Tum 45–60 min: random from LC 20 / 225 / 232 / 155 / 622', 'Advanced follow-ups', 'Scorecard /100', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [20, 155],
      interview: {
        q: 'How do you approach a data structure design question like Min Stack or Circular Queue in an interview?',
        a: 'First I clarify the required operations, their expected complexity, and edge cases such as calls on an empty structure or capacity limits. Then I state a simple baseline, for example scanning for the minimum or shifting elements on dequeue, with its cost, and identify the bottleneck operation. Next I choose the supporting structure that removes it, like an auxiliary min stack or a circular array with a front index and count. I write the complete class with fields, constructor and every method, and finally walk through a sequence of calls while showing the internal state, including duplicates, wrap-around, empty and full cases.',
      },
    },
    {
      day: 8, week: 2, dow: 'Mon', type: 'learn', title: 'Monotonic Stack Introduction — Increasing vs Decreasing',
      theory: ['Normal stack vs monotonic stack', 'Increasing: bade pop · Decreasing: chhote pop', 'Pop kyun — har element ek push, max ek pop → O(n)', 'NGE / PSE kya hai', 'Values vs indices', 'Tum: LC 496 · Sohvi: concept only'],
      qs: [496],
      interview: {
        q: 'What is a monotonic stack and why does it give O(n) solutions?',
        a: 'A monotonic stack is a stack whose elements are kept in increasing or decreasing order from bottom to top. Before pushing a new element, I pop every element that would break that order, and the moment an element is popped, the element causing the pop is usually its answer, for example its next greater or next smaller element. It turns nested-loop O(n squared) searches into O(n), because every element is pushed exactly once and popped at most once, so the inner while loop runs at most n times in total. I usually store indices rather than values when I need distances, widths or positions.',
      },
    },
    {
      day: 9, week: 2, dow: 'Tue', type: 'learn', title: 'Next Greater Element — Stack of Unresolved + HashMap',
      theory: ['NGE = right side ka pehla strictly greater', 'Brute nested loop O(n²)', 'Stack = un-resolved elements', 'Pop condition: current > top', 'nums2 pe map, nums1 pe lookup', 'O(n + m)'],
      qs: [496],
      interview: {
        q: 'Walk me through Next Greater Element I.',
        a: 'For each value of nums1 I need the first greater value to its right in nums2. Brute force locates the value and scans right, which is O(m times n). Instead I process nums2 once with a stack of values that are still waiting for a greater element; the stack stays decreasing. When the current number is greater than the top, it is the answer for the top, so I pop and record it in a HashMap, and I repeat until the top is greater. Then I push the current number. Values left in the stack have no greater element, so they map to minus one. Since values are distinct, each nums1 query is a lookup. It is O(m plus n) time and O(n) space.',
      },
    },
    {
      day: 10, week: 2, dow: 'Wed', type: 'learn', title: 'Daily Temperatures — Waiting / Distance Pattern',
      theory: ['Waiting problem = next greater + distance', 'Answer = index difference, isliye indices', 'Current din purane dino ko resolve karta hai', 'Bache din → default 0', 'Amortized O(n)'],
      qs: [739],
      interview: {
        q: 'Why do you store indices instead of temperatures in Daily Temperatures?',
        a: 'The answer for each day is a distance, the number of days until a warmer day, so I need positions. With an index I can read the temperature as temperatures[index] and also compute the distance as i minus index, while a stored temperature value would lose the position and could not handle duplicates. The stack holds indices of days that have not found a warmer day yet, in decreasing temperature order. When today is warmer than the top, I pop it and set result[popped] to i minus popped. Days that stay in the stack keep the default zero, so I do not need to fill them explicitly.',
      },
    },
    {
      day: 11, week: 2, dow: 'Thu', type: 'learn', title: 'Largest Rectangle in Histogram — PSE + NSE + Width',
      theory: ['Area = height × width', 'PSE (left nearest smaller), NSE (right nearest smaller)', 'Width = NSE − PSE − 1', 'Increasing stack of indices', 'One pass + sentinel 0 (sentinel push nahi)', 'Equal heights'],
      qs: [84],
      interview: {
        q: 'Explain the width formula i − previousSmaller − 1 in Largest Rectangle in Histogram.',
        a: 'When I pop a bar from the increasing stack because the current height at index i is smaller, i is the first smaller bar on its right, its next smaller element. After popping, the new top of the stack is the first smaller bar on its left, its previous smaller element, or minus one if the stack is empty. The popped bar can extend over every index strictly between those two boundaries, which is from previousSmaller plus one to i minus one, so the width is i minus previousSmaller minus one. The area is the popped height times that width. A sentinel height of zero at i equals n flushes the remaining bars, and I do not push the sentinel index.',
      },
    },
    {
      day: 12, week: 2, dow: 'Fri', type: 'learn', title: 'Pattern Recognition — Stack, Queue, Monotonic Stack (Concept Day)',
      theory: ['Stack vs Queue clues', 'Normal vs monotonic stack clues', '20 identification questions', 'Clue → DS → why → brute → optimal → complexity', 'Pattern Journal (20 entries)', 'Naya problem nahi — concept day'],
      qs: [],
      interview: {
        q: 'How do you recognize that a problem needs a monotonic stack?',
        a: 'I look for phrases about the nearest element that is greater or smaller on the left or right: next greater, previous smaller, nearest taller building, how many days until a warmer day, or how far a bar can extend in a histogram. In those problems each element is waiting for something that may come later, and a stack can hold all the waiting elements in sorted order. When I see such a clue together with a brute force that uses nested loops, I try a monotonic stack to get O(n). If the question is about matching or undo, a normal stack is enough, and for first in first out processing or level order traversal I use a queue.',
      },
    },
    {
      day: 13, week: 2, dow: 'Sat', type: 'revision', title: 'Stack & Queue Revision — 496, 739, 84, 155 (+ Sohvi 20, 232, 225)',
      theory: ['Pattern sheet: next greater (values / indices), PSE + NSE, auxiliary stack', 'Re-solve 496 → 739 → 84 → 155', 'LC 84 paper pe pehle', 'Revision test (10)', 'System Design session'],
      qs: [496, 739, 84, 155],
      interview: {
        q: 'What does amortized O(n) mean for a monotonic stack with a while loop inside a for loop?',
        a: 'It means I analyse the total work across the whole run instead of the worst case of a single iteration. One iteration of the for loop may pop many elements, but every index is pushed exactly once, so it can be popped at most once overall. Summed over all iterations, the while loop body executes at most n times, and the pushes are another n operations, so the total is O(n) even though a single step can cost more. The same aggregate argument proves the bound for sliding window and two-pointer techniques.',
      },
    },
    {
      day: 14, week: 2, dow: 'Sun', type: 'mock', title: 'Week 8 Mock Interview — Monotonic Stack Assessment + Contest',
      theory: ['Sohvi 30–40 min: theory + LC 20 + simulation dry run', 'Tum 60–75 min: random from LC 496 / 739 / 84 / 155', '8-step framework', 'Scorecard /100', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [20, 84],
      interview: {
        q: 'How do you test a monotonic stack solution?',
        a: 'I test a strictly increasing input and a strictly decreasing input, because one makes every element pop the previous one and the other makes nothing pop until the end. Then I test equal values, since the choice between strict and non-strict comparison decides whether duplicates pop each other. I add a single element and, for histogram problems, zero heights and an answer that spans the whole array. For each case I trace the stack contents, the pop condition and the push after every index out loud, and I confirm that leftover elements receive the default answer.',
      },
    },
  ],

  // ---------------- LAST MINUTE ----------------
  lastMinute: {
    triggers: [
      ['Brackets valid / balanced / nested', 'Stack of openings (match on close)'],
      ['Queue banao stacks se', 'in + out stacks, lazy transfer (amortized O(1))'],
      ['Stack banao queues se', 'Push ke baad size − 1 rotate (ek queue)'],
      ['Fixed size queue / ring buffer / space reuse', 'Circular array: front + count, index % capacity (LC 622)'],
      ['getMin / getMax O(1)', 'Auxiliary min stack (val ≤ min push) ya {val, min} pairs'],
      ['Next greater / warmer / kitne din baad', 'Decreasing monotonic stack of indices'],
      ['Next greater for subset of values (distinct)', 'Monotonic stack + HashMap(value → NGE)'],
      ['Largest rectangle / bar kitna extend', 'Increasing stack, width = i − left − 1, sentinel 0'],
      ['Previous / next smaller for every index', 'Increasing stack (pop while ≥)'],
      ['Recursion avoid karna hai', 'Explicit stack (iterative DFS)'],
      ['Order maintain, level-by-level', 'Queue (BFS — aage ke phases)'],
    ],
    edge: [
      'Empty stack pe pop/peek (closing bracket pehle aaya: ")(")',
      'Sirf openings: "((((" → stack bacha → false',
      'Odd length string → kabhi valid nahi',
      'Duplicates of min (MinStack me ≤)',
      'Strictly increasing / decreasing array (monotonic stack ka best/worst)',
      'Equal heights / temperatures — > vs ≥ ka fark',
      'Histogram me 0 height aur single bar',
    ],
    mistakes: [
      'Stack class use karna (legacy, synchronized) → ArrayDeque',
      'pop() se pehle isEmpty() check bhoolna',
      'End me st.isEmpty() return karna bhoolna (LC 20)',
      'Integer == Integer compare (−128..127 ke bahar fail)',
      'Monotonic stack me values store karna jab distance/width chahiye → indices',
      'Queue via stacks me har pop pe transfer karna (out khaali ho tabhi!)',
      'Histogram me last me bache bars ka area bhoolna → sentinel',
      'MinStack me sirf val < min pe push (duplicates toot jaate hain)',
    ],
  },
};
