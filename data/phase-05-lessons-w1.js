// Phase 5 (Stack + Queue) — Week 7 lessons (local days 1–7 = global days 43–49). Day 1 (phase-01) wala format.
// Week 7 = STACK & QUEUE FOUNDATIONS (Sohel ka diya hua syllabus: syllabus/week-07.md, 2026-11-22).
// Daily session 9:00–10:30 PM: revision · theory · patterns + visualization · dry run · individual coding · complexity + homework.
(function () {
  const P = window.PHASE_CONTENT['stack-queue'];
  const LL = window.PHASE_CONTENT['linked-list'];
  P.lessons = P.lessons || {};
  const ap = (n, i) => P.questions[n].approaches[i].code;
  const llOpt = n => { const a = LL.questions[n].approaches; return a.filter(x => x.level === 'Optimal').pop().code; };
  // Part 0 ka ek revision question
  const rev = o => [
    { h: o.h },
    { p: o.p },
    { pre: o.ex },
    { p: '<b>Pattern:</b> ' + o.pat },
    { olist: o.steps },
    { code: o.code },
    { tip: '<b>Memory hook:</b> ' + o.hook },
  ];
  // Roz ka session (9:00–10:30 PM) — syllabus wala split
  const session = (rev0, theory, viz, dry, coding, wrap) => ({ table: { head: ['Time', 'Slot', 'Aaj kya'], rows: [
    ['9:00–9:10', 'Previous day revision', rev0],
    ['9:10–9:30', 'Theory + concepts', theory],
    ['9:30–9:50', 'Patterns + visualization', viz],
    ['9:50–10:05', 'Dry run', dry],
    ['10:05–10:25', 'Individual coding', coding],
    ['10:25–10:30', 'Complexity + homework', wrap],
  ] } });
  const RULE = 'Week 7 rule: <b>Sohvi</b> — fundamentals, visualization, dry run, Easy implementation. <b>Tum</b> — data structure scratch se, complexity, edge cases, optimal solution, interview follow-ups. Topic same, depth alag.';
  const SQL = '<b>Extra (SDE-2): 2 SQL questions</b> — LeetCode Database section se 2 questions (JOIN / GROUP BY / window functions), 20 minute timer.';

  // ---- User ke syllabus ka code (compile + run tested) ----
  const J_MYSTACK = `class MyStack {
    private int[] arr;
    private int top;
    private int capacity;

    MyStack(int size) {
        arr = new int[size];
        capacity = size;
        top = -1;
    }

    void push(int value) {
        if (top == capacity - 1) {
            throw new RuntimeException("Stack Overflow");
        }
        arr[++top] = value;
    }

    int pop() {
        if (top == -1) {
            throw new RuntimeException("Stack Underflow");
        }
        return arr[top--];
    }

    int peek() {
        if (top == -1) {
            throw new RuntimeException("Stack is Empty");
        }
        return arr[top];
    }

    boolean isEmpty() {
        return top == -1;
    }

    int size() {
        return top + 1;
    }
}`;
  const J_MYSTACK_EXTRA = `    // Tum ka extension (Task A): isFull + display
    boolean isFull() {
        return top == capacity - 1;
    }

    void display() {
        StringBuilder sb = new StringBuilder("TOP -> ");
        for (int i = top; i >= 0; i--) {
            sb.append(arr[i]).append(' ');
        }
        System.out.println(sb.toString().trim());
    }`;
  const J_BUILTIN = `// Same 5 operations — java.util.Stack (legacy) vs ArrayDeque (recommended)
Stack<Integer> legacy = new Stack<>();
legacy.push(10);
legacy.push(20);
legacy.push(30);
System.out.println(legacy.pop());   // 30
System.out.println(legacy.peek());  // 20
System.out.println(legacy);         // [10, 20]  (bottom -> top)

Deque<Integer> stack = new ArrayDeque<>();
stack.push(10);
stack.push(20);
stack.push(30);
System.out.println(stack.pop());    // 30
System.out.println(stack.peek());   // 20
System.out.println(stack);          // [20, 10]  (top -> bottom)`;
  const J_LC20_STACK = `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
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
}`;
  const J_LC20_SWITCH = `public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char ch : s.toCharArray()) {
        switch (ch) {
            case '(': stack.push(')'); break;
            case '{': stack.push('}'); break;
            case '[': stack.push(']'); break;
            default:
                if (stack.isEmpty() || stack.pop() != ch) return false;
        }
    }
    return stack.isEmpty();
}`;
  const J_ARRAY_QUEUE = `class ArrayQueue {
    private int[] arr;
    private int front;
    private int rear;
    private int capacity;

    ArrayQueue(int size) {
        arr = new int[size];
        capacity = size;
        front = 0;
        rear = -1;
    }

    void enqueue(int value) {
        if (rear == capacity - 1) {
            throw new RuntimeException("Queue Overflow");
        }
        arr[++rear] = value;
    }

    int dequeue() {
        if (front > rear) {
            throw new RuntimeException("Queue Underflow");
        }
        return arr[front++];
    }

    int peek() {
        if (front > rear) {
            throw new RuntimeException("Queue is Empty");
        }
        return arr[front];
    }

    boolean isEmpty() {
        return front > rear;
    }

    int size() {
        return rear - front + 1;
    }
}`;
  const J_CIRCULAR = `class CircularQueue {
    private int[] arr;
    private int front;
    private int rear;
    private int size;
    private int capacity;

    CircularQueue(int capacity) {
        this.capacity = capacity;
        arr = new int[capacity];
        front = 0;
        rear = -1;
        size = 0;
    }

    boolean enqueue(int value) {
        if (isFull()) return false;
        rear = (rear + 1) % capacity;
        arr[rear] = value;
        size++;
        return true;
    }

    int dequeue() {
        if (isEmpty()) throw new RuntimeException("Queue Underflow");
        int value = arr[front];
        front = (front + 1) % capacity;
        size--;
        return value;
    }

    int peek() {
        if (isEmpty()) throw new RuntimeException("Queue is Empty");
        return arr[front];
    }

    boolean isEmpty() {
        return size == 0;
    }

    boolean isFull() {
        return size == capacity;
    }
}`;
  const J_MINSTACK_ENCODED = `class MinStack {
    private Deque<Long> stack = new ArrayDeque<>();
    private long min;

    public void push(int val) {
        if (stack.isEmpty()) {
            stack.push(0L);
            min = val;
        } else {
            stack.push(val - min);      // diff (long — overflow nahi)
            if (val < min) min = val;   // negative diff = "yahan min badla tha"
        }
    }

    public void pop() {
        long diff = stack.pop();
        if (diff < 0) min = min - diff; // purana min wapas
    }

    public int top() {
        long diff = stack.peek();
        return (int) (diff < 0 ? min : min + diff);
    }

    public int getMin() {
        return (int) min;
    }
}`;

  Object.assign(P.lessons, {
    // =====================================================================
    // DAY 43
    1: {
      title: 'Stack Basics — LIFO + Array Implementation',
      goal: '<b>Foundation 1: LIFO.</b> Stack kya hai, real-world use, push / pop / peek, <code>top</code> index, overflow / underflow, aur <b>array se stack scratch se</b>. <b>Sohvi:</b> concept + dry run + code samajhna. <b>Tum:</b> poori class (isFull, display bhi) + <code>java.util.Stack</code> vs <code>ArrayDeque</code>. LC 20 ka statement aaj padho — solve kal (Day 44).',
      main: 20,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision (Linked List, Week 6) + Aaj ka session',
          blocks: [
            { p: RULE },
            session('Week 6 ke 3 sawaal (neeche) — zubaani + paper', 'Module 1–3: LIFO, terminology, operations', 'Stack diagram + LC 20 preview visualizer', 'push 10 → push 20 → push 30 → pop → peek', 'Sohvi: array stack code samjho · Tum: MyStack + isFull + display', 'O(1) kyun + homework'),
            { p: 'Naya phase (Stack + Queue) shuru karne se pehle pichle hafte ke 3 sawaal — 10 minute me.' },
            ...rev({
              h: 'LC 142 — Linked List Cycle II',
              p: 'Cycle hai toh jis node se shuru hota hai woh return karo, warna null.',
              ex: 'head = [3,2,0,-4], pos = 1\nslow/fast -4 pe milte hain → slow = head\ndono 1-1 step: (3,2) → milte hain node 2 pe → return node 2',
              pat: 'Slow / Fast (Floyd Phase 2)',
              steps: ['slow 1 step, fast 2 step — milein toh cycle hai.', 'fast null tak pahunch gaya → cycle nahi → null.', 'slow = head; ab dono 1-1 step — jahan milein wahi cycle start.'],
              code: llOpt(142),
              hook: 'Milne ke baad ek ko ghar (head) bhejo, dono dheere chalo — milan = cycle ka darwaza.',
            }),
            ...rev({
              h: 'LC 19 — Remove Nth Node From End of List',
              p: 'End se n-th node hatao, ek pass me.',
              ex: 'head = [1,2,3,4,5], n = 2\nfast ko n+1 aage, phir dono saath → slow 3 pe → 3.next = 5\nresult [1,2,3,5]',
              pat: 'Dummy Node + Gap Two Pointers',
              steps: ['dummy → head (head bhi delete ho sakta hai).', 'fast ko n + 1 step aage.', 'fast null tak dono chalao; slow.next = slow.next.next.'],
              code: llOpt(19),
              hook: 'Gap n+1 rakho — fast end pe, slow delete wale se ek pehle.',
            }),
            ...rev({
              h: 'LC 143 — Reorder List',
              p: 'L0 → Ln → L1 → Ln−1 … order me in-place.',
              ex: '[1,2,3,4,5] → middle 3 → second half ulta 5 → 4 → merge: 1 5 2 4 3',
              pat: 'Middle + Reverse + Merge (combo)',
              steps: ['Slow/fast se middle.', 'Second half reverse.', 'Dono halves alternate merge.'],
              code: llOpt(143),
              hook: 'Beech dhundo, peeche wala ulta, phir zip.',
            }),
          ],
        },
        {
          title: 'Part 1 — Module 1: Stack kya hai? LIFO (Last In, First Out)',
          blocks: [
            { p: '<b>Stack</b> ek linear data structure hai jisme sirf <b>ek end</b> (top) se insert aur remove hota hai. Jo element <b>sabse last</b> me aaya, wahi <b>sabse pehle</b> niklega — <b>LIFO</b>.' },
            { pre: `Plates ka dher:

  Plate 1 rakhi  → Plate 2 rakhi → Plate 3 rakhi → Plate 4 rakhi

        | Plate 4 |  ← TOP (sabse last rakhi)
        | Plate 3 |
        | Plate 2 |
        | Plate 1 |
        +---------+

  Uthaoge kaunsi?  Plate 4 pehle  (Last In → First Out)` },
            { table: { head: ['Real-world / software use', 'Stack kahan hai'], rows: [
              ['Undo (Ctrl+Z)', 'Har action push; undo = pop (last action pehle)'],
              ['Browser back button', 'Visited pages ka stack'],
              ['Function calls (JVM call stack)', 'Har call ek frame push, return = pop; deep recursion → StackOverflowError'],
              ['Bracket matching / compilers', 'LC 20 — kal'],
              ['Expression evaluation', 'Operators / operands ka stack'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Module 2: Terminology',
          blocks: [
            { pre: `TOP →  | 5 |
       | 4 |
       | 3 |
       | 2 |
       +---+   (bottom)` },
            { table: { head: ['Term', 'Matlab', 'Upar ke diagram me'], rows: [
              ['<b>Top</b>', 'Last inserted element (jahan saara kaam hota hai)', '5'],
              ['<b>Push</b>', 'Top pe naya element daalna', 'push(6) → top 6'],
              ['<b>Pop</b>', 'Top element <b>nikaal ke</b> return karna', 'pop() → 5, top ab 4'],
              ['<b>Peek</b>', 'Top element <b>dekhna</b> (remove nahi)', 'peek() → 5, stack same'],
              ['<b>isEmpty</b>', 'Stack khaali hai?', 'false'],
              ['<b>isFull</b>', 'Fixed capacity bhar gayi? (sirf array stack me)', 'capacity 4 → true'],
              ['<b>Size</b>', 'Kitne elements', '4'],
            ] } },
          ],
        },
        {
          title: 'Part 3 — Module 3: Operations trace',
          blocks: [
            { table: { head: ['Operation', 'Stack (bottom → top)', 'Return', 'Note'], rows: [
              ['start', '[]', '—', 'Khaali'],
              ['push(10)', '[10]', '—', 'top = 10'],
              ['push(20)', '[10, 20]', '—', 'top = 20'],
              ['push(30)', '[10, 20, 30]', '—', 'top = 30'],
              ['pop()', '[10, 20]', '30', '30 nikla (last in, first out)'],
              ['peek()', '[10, 20]', '20', '<b>Peek remove nahi karta</b> — stack wahi'],
            ] } },
            { tip: 'Interview trap: "pop aur peek me fark?" — pop remove + return, peek sirf return. Dono O(1).' },
          ],
        },
        {
          title: 'Part 4 — Module 4: Array se Stack (Java, scratch se)',
          blocks: [
            { p: 'Idea: ek fixed <code>int[] arr</code> aur ek <code>top</code> index jo <b>last filled</b> position batata hai. Khaali stack me koi position filled nahi → <code>top = -1</code>.' },
            { code: J_MYSTACK },
            { lines: [
              ['private int top;', 'Last filled index. −1 = khaali.'],
              ['top = -1;', 'Shuru me kuch nahi bhara.'],
              ['if (top == capacity - 1)', 'Last index bhar chuka → <b>overflow</b> (aur jagah nahi).'],
              ['arr[++top] = value;', '<b>Pehle</b> top badhao, <b>phir</b> likho (pre-increment).'],
              ['if (top == -1)', 'Khaali stack pe pop/peek → <b>underflow</b>.'],
              ['return arr[top--];', '<b>Pehle</b> value lo, <b>phir</b> top ghatao (post-decrement). Array se value delete nahi hoti — bas top ke bahar ho gayi.'],
              ['return arr[top];', 'Peek — top index nahi badla.'],
              ['return top + 1;', 'Index 0..top filled → size = top + 1.'],
            ] },
            { p: '<b>Tum ka extension</b> (class ke andar jodo):' },
            { code: J_MYSTACK_EXTRA },
            { pre: `MyStack s = new MyStack(3);
s.push(10); s.push(20); s.push(30);

  index:   0    1    2
  arr  : [10] [20] [30]      top = 2 = capacity − 1 → isFull() = true
s.pop()  → 30                top = 1   (arr[2] me 30 abhi bhi pada hai, par stack ka hissa nahi)
s.peek() → 20                top = 1` },
          ],
        },
        {
          title: 'Part 5 — Module 5 + 6: Complexity, Overflow vs Underflow',
          blocks: [
            { table: { head: ['Operation', 'Time', 'Kyun'], rows: [
              ['push', 'O(1)', 'Sirf top++ aur ek write'],
              ['pop', 'O(1)', 'Ek read aur top−−'],
              ['peek', 'O(1)', 'Ek read'],
              ['isEmpty / size', 'O(1)', 'top se seedha'],
              ['Space (fixed array)', 'O(capacity)', 'Array pehle se allocate'],
              ['Dynamic array (ArrayDeque / ArrayList) push', 'Amortized O(1)', 'Kabhi-kabhi array double hota hai — average O(1)'],
            ] } },
            { pre: `OVERFLOW (capacity 3):            UNDERFLOW:
  push 10, 20, 30 → [10,20,30]       stack = []
  push 40 → top == capacity−1        pop() → top == −1
          → "Stack Overflow"                 → "Stack Underflow"` },
            { tip: '<b>JVM ka StackOverflowError</b> bhi yahi idea hai — call stack ki fixed memory bhar gayi (infinite / bahut deep recursion).' },
          ],
        },
        {
          title: 'Part 6 — Java me Stack: java.util.Stack vs ArrayDeque',
          blocks: [
            { code: J_BUILTIN },
            { table: { head: ['', '<code>Stack&lt;Integer&gt;</code>', '<code>ArrayDeque&lt;Integer&gt;</code>'], rows: [
              ['Kahan se', 'Java 1.0, <code>Vector</code> extend karta hai', '<code>Deque</code> interface (Java 6)'],
              ['Thread-safe?', 'Haan — synchronized (har call pe lock → slow)', 'Nahi (single thread me yahi chahiye)'],
              ['LIFO toot sakta hai?', 'Haan — <code>get(i)</code>, <code>add(i, x)</code> bhi hain', 'Nahi — sirf ends'],
              ['Print order', 'Bottom → top', 'Top → bottom'],
              ['null', 'Allowed', 'NullPointerException'],
            ] } },
            { tip: 'Interview line: <b>"I use ArrayDeque as a stack; Stack extends Vector, which is synchronized and exposes index-based methods that break LIFO."</b>' },
          ],
        },
        {
          title: 'Part 7 — Aaj ka problem (preview): LC 20 Valid Parentheses',
          blocks: [
            { problem: 20 },
            { p: '<b>Aaj sirf statement padho</b> aur socho: "<code>({[]})</code> me jo bracket <b>sabse last</b> khula, woh <b>sabse pehle</b> band hota hai" — ye LIFO hai, isliye stack. Poora solution kal (Day 44).' },
            { p: '<b>Brute (sneak peek):</b> jab tak ho sake <code>"()"</code>, <code>"[]"</code>, <code>"{}"</code> hatate raho — end me khaali string = valid. O(n²). <b>Optimal:</b> opening push, closing pe top match → pop. O(n).' },
          ],
        },
        {
          title: 'Part 8 — Visualize: stack ko kaam karte dekho (LC 20 preview)',
          blocks: [
            { list: [
              'Right side <b>stack</b> view: har opening bracket <b>push</b> hota hai (top pe naya).',
              'Closing aate hi <b>peek</b> → match → <b>pop</b>. Top hamesha "sabse recent pending" hai.',
              'Example 5 <code>{[()]}</code> chalao — stack 3 tak bharta hai, phir ulte order me khaali hota hai = LIFO.',
            ] },
            { viz: 20, ex: 4 },
          ],
        },
        {
          title: 'Part 9 — Edge cases (array stack)',
          blocks: [
            { table: { head: ['Scenario', 'Kya hoga', 'Handle kaise'], rows: [
              ['Khaali stack pe pop()', 'Underflow', '<code>top == -1</code> check → exception'],
              ['Khaali stack pe peek()', 'Underflow', 'Same check'],
              ['Full stack pe push()', 'Overflow', '<code>top == capacity - 1</code> check'],
              ['capacity 0', 'Har push overflow', 'Constructor me size validate kar sakte ho'],
              ['pop ke baad arr me purani value', 'Padi rehti hai (garbage)', 'Stack ka hissa nahi — top ke bahar. Objects ho toh <code>arr[top] = null</code> (memory leak avoid)'],
              ['ArrayDeque pe pop() khaali', '<code>NoSuchElementException</code>', '<code>isEmpty()</code> pehle; <code>peek()</code> null deta hai'],
            ] } },
          ],
        },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Stack kya hai?', 'Linear DS jisme insert/remove sirf top se — LIFO.'],
              ['LIFO vs FIFO?', 'LIFO (stack): last aaya pehle gaya. FIFO (queue): pehle aaya pehle gaya.'],
              ['Push/Pop O(1) kyun?', 'Sirf top index badalta hai — koi shifting / search nahi.'],
              ['Overflow vs Underflow?', 'Overflow: full stack pe push. Underflow: khaali stack pe pop/peek.'],
              ['Kya <code>java.util.Stack</code> thread-safe hai?', 'Haan (Vector → synchronized), par isliye slow. Single-thread me ArrayDeque; concurrent ke liye <code>ConcurrentLinkedDeque</code>.'],
              ['Array vs Linked List implementation?', 'Array: fast, cache-friendly, fixed capacity (ya resize). Linked list: kabhi full nahi, par har node extra memory (next pointer).'],
              ['<code>arr[++top]</code> aur <code>arr[top++]</code> me fark?', '++top: pehle badhao phir use (top = last filled ke liye sahi). top++: pehle use phir badhao — galat index pe likhega.'],
              ['Peek remove karta hai?', 'Nahi — sirf top value return. Stack same rehta hai.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['What is a stack? (1 minute)', 'A stack is a linear data structure where insertion and deletion happen only at one end, called the top, so it follows last in, first out. The main operations are push, pop and peek, and all of them are O(1) because only the top changes. Typical uses are undo, browser history, bracket matching and the call stack that the JVM uses for method calls.'],
              ['Array implementation', 'I keep an int array, a capacity and a top index that starts at minus one. Push first checks overflow, when top equals capacity minus one, then does arr at plus-plus top equals value. Pop checks underflow, when top is minus one, then returns arr at top minus-minus. Peek returns arr at top. Size is top plus one. Every operation is O(1) and the space is O(capacity).'],
              ['Stack vs ArrayDeque in Java', 'java.util.Stack is a legacy class that extends Vector, so every method is synchronized and it also exposes index-based methods that break the LIFO contract. For a stack in modern Java I use Deque with ArrayDeque: push, pop and peek are amortized O(1), and it is faster because there is no locking.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohvi session',
          blocks: [
            { olist: [
              'LIFO apne shabdon me explain karo (plates example + ek apna example).',
              'Push, pop, peek ko identify karo: 5 operations ka dry run paper pe — <code>push 5, push 8, pop, push 2, peek</code> (answer: pop → 8, peek → 2, stack [5, 2]).',
              'Array stack code (Part 4) line-by-line padho — <code>top = -1</code> aur <code>arr[++top]</code> samjho (memorize zaroori nahi).',
              'LC 20 ka statement padho (Part 7) — kal solve karenge.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Array stack scratch se — push, pop, peek, isEmpty, size, <b>isFull</b>, <b>display</b> (15 min, bina notes).',
              '<b>Task B:</b> Same operations <code>java.util.Stack</code> se, phir <code>ArrayDeque</code> se (Part 6). Print order ka fark note karo.',
              '<b>Task C:</b> Interview Qs zubaani: stack kya? LIFO vs FIFO? push/pop O(1) kyun? overflow/underflow? Stack thread-safe? array vs linked list implementation?',
              '<b>Task D (follow-up):</b> Capacity full hone pe array <b>double</b> karo (dynamic stack) — push amortized O(1) kyun hai, bolo.',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 14 — Homework',
          blocks: [
            { list: [
              '<b>Sohvi:</b> 10 stack operations ka dry run (khud sequence banao) — har step ke baad stack + return value likho.',
              '<b>Tum:</b> Blank editor me bina notes stack implement karo; empty aur full cases test karo (pop on empty, push on full → exception aana chahiye).',
              'Kal (Day 44): LC 20 Valid Parentheses — poora solution.',
            ] },
          ],
        },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['push 1, push 2, push 3, pop, peek → ?', 'pop = 3, peek = 2, stack [1, 2].'],
              ['Khaali array stack me top kitna?', '−1.'],
              ['size() kaise?', 'top + 1.'],
              ['Capacity 3, teen push ke baad push(40)?', 'Overflow.'],
              ['Java me stack ke liye kya use karoge?', '<code>Deque&lt;Integer&gt; st = new ArrayDeque&lt;&gt;();</code>'],
            ] },
          ],
        },
      ],
      checks: [
        'LIFO plates example ke saath explain kar sakta/sakti hu',
        'Terminology table (top, push, pop, peek, isEmpty, isFull, size) bina dekhe',
        'push 10 → push 20 → push 30 → pop → peek trace sahi',
        'Array stack scratch se likha (Tum: isFull + display bhi)',
        'Overflow vs underflow conditions yaad',
        'Stack vs ArrayDeque ka fark bol sakta/sakti hu',
        'LC 20 ka statement padh liya',
      ],
      memory: 'Stack = plates ka dher: top = −1 se shuru, push = arr[++top], pop = arr[top--], sab O(1).',
    },

    // =====================================================================
    // DAY 44
    2: {
      title: 'Valid Parentheses — Matching Pairs using Stack',
      goal: '<b>Pattern 2: Matching Pairs.</b> Opening vs closing, stack kyun, wrong order detect karna, empty stack condition. <b>LC 20</b> — brute (replace) se optimal (stack) tak, O(n). Sohvi: steps 1–5 + line-by-line. Tum: bina hints + follow-ups.',
      main: 20,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('Kal ka MyStack + Week 6 ke 2 sawaal', 'Valid vs invalid, counting kyun fail, stack kyun', 'Matching table + visualizer', '"{[]}" aur "([)]" table', 'Sohvi: steps 1–5 · Tum: bina hints + ArrayDeque + switch', 'O(n) / O(n) + homework'),
            ...rev({
              h: 'Kal ka: Array Stack (no LC)',
              p: 'int[] + top index se stack.',
              ex: 'capacity 3: push 10, 20 → arr [10,20,_], top = 1\npop → 20 (top = 0) · peek → 10',
              pat: 'Stack (LIFO) — array implementation',
              steps: ['top = −1 se shuru.', 'push: overflow check (top == capacity − 1), arr[++top] = x.', 'pop: underflow check (top == −1), return arr[top--].'],
              code: `void push(int value) {
    if (top == capacity - 1) throw new RuntimeException("Stack Overflow");
    arr[++top] = value;
}

int pop() {
    if (top == -1) throw new RuntimeException("Stack Underflow");
    return arr[top--];
}`,
              hook: 'Push me pehle badhao (++top), pop me baad me ghatao (top--).',
            }),
            ...rev({
              h: 'LC 141 — Linked List Cycle',
              p: 'List me cycle hai?',
              ex: '[3,2,0,-4], pos = 1 → slow/fast milte hain → true\n[1], pos = -1 → fast null → false',
              pat: 'Slow / Fast Pointers (Floyd)',
              steps: ['slow = fast = head.', 'fast != null && fast.next != null tak: slow 1, fast 2.', 'slow == fast → true; loop khatam → false.'],
              code: llOpt(141),
              hook: 'Gol track pe tez wala dheere wale ko pakad hi leta hai.',
            }),
            ...rev({
              h: 'LC 25 — Reverse Nodes in k-Group',
              p: 'Har k nodes ka group ulta karo; bache (k se kam) waise hi.',
              ex: '[1,2,3,4,5], k = 2 → [2,1,4,3,5]',
              pat: 'Pointer Reversal + Dummy Node',
              steps: ['dummy → head; groupPrev = dummy.', 'k nodes hain? nahi → stop.', 'Group reverse karo, pichle group se jodo, groupPrev aage.'],
              code: llOpt(25),
              hook: 'Pehle gino (k hain?), phir ulto, phir jodo.',
            }),
          ],
        },
        {
          title: 'Part 1 — Module 1: Matching problem — valid vs invalid',
          blocks: [
            { table: { head: ['Valid', 'Invalid', 'Invalid kyun'], rows: [
              ['<code>()</code>', '<code>(]</code>', 'Type match nahi — ( ko ) chahiye'],
              ['<code>{}</code>', '<code>([)]</code>', 'Order galat — [ baad me khula, pehle band hona chahiye tha'],
              ['<code>[]</code>', '<code>(((</code>', 'Koi band hi nahi hua'],
              ['<code>({[]})</code>', '<code>)))</code>', 'Closing ka koi opening nahi'],
            ] } },
            { p: '<b>Sirf counting kyun kaafi nahi?</b> <code>([)]</code> me 1 "(", 1 ")", 1 "[", 1 "]" — counts barabar, phir bhi invalid. <b>Order</b> matter karta hai, aur order yaad rakhne ke liye stack chahiye.' },
          ],
        },
        {
          title: 'Part 2 — Module 2: Stack kyun? + Algorithm',
          blocks: [
            { pre: `({[]})
open:   (   {   [            ← stack me jaate gaye:  [ { (  (top = [)
close:              ]  }  )  ← jo LAST khula (  [ ), wahi PEHLE band
                              = LIFO  →  STACK` },
            { olist: [
              'Khaali stack banao.',
              'Har character padho.',
              'Opening bracket → <b>push</b>.',
              'Closing bracket → stack <b>khaali</b>? → invalid (return false).',
              'Top dekho (peek).',
              'Top matching opening hai → <b>pop</b>.',
              'Match nahi → invalid.',
              'Saare characters ke baad…',
              'Stack <b>khaali</b> = valid, warna invalid (kuch khule reh gaye).',
            ] },
            { table: { head: ['Closing', 'Matching opening'], rows: [
              ['<code>)</code>', '<code>(</code>'],
              ['<code>}</code>', '<code>{</code>'],
              ['<code>]</code>', '<code>[</code>'],
            ] } },
          ],
        },
        { title: 'Part 3 — Aaj ka problem: LC 20 Valid Parentheses', blocks: [{ problem: 20 }] },
        {
          title: 'Part 4 — Thinking: Brute → Optimal',
          blocks: [
            { p: '<b>Brute (replace pairs):</b> Valid string me koi na koi <b>andar wala</b> pair hamesha <code>"()"</code>, <code>"[]"</code> ya <code>"{}"</code> ke roop me chipka hota hai. Use hatao → jo bacha woh bhi valid hona chahiye. Jab tak string badal rahi hai, hatate raho; end me khaali = valid. Har pass O(n), passes O(n) tak → <b>O(n²)</b>.' },
            { p: '<b>Observation:</b> Har closing ko sirf <b>sabse recent unmatched opening</b> se match hona hai. "Sabse recent" = top of stack.' },
            { p: '<b>Optimal (stack):</b> Opening push; closing pe khaali check → peek → match ho toh pop warna false; end me <code>isEmpty()</code>. Har char ek baar → <b>O(n)</b>.' },
            { p: '<b>Better?</b> Is problem me alag Better approach nahi — brute ke baad seedha stack.' },
          ],
        },
        {
          title: 'Part 5 — Dry run',
          blocks: [
            { p: '<b>"{[]}"</b>' },
            { table: { head: ['Char', 'Action', 'Stack (bottom → top)'], rows: [
              ['{', 'opening → push', '{'],
              ['[', 'opening → push', '{ ['],
              [']', 'top [ match → pop', '{'],
              ['}', 'top { match → pop', '(khaali)'],
              ['end', 'stack khaali', '<b>true</b>'],
            ] } },
            { p: '<b>"([)]"</b>' },
            { table: { head: ['Char', 'Action', 'Stack'], rows: [
              ['(', 'push', '('],
              ['[', 'push', '( ['],
              [')', 'top = [ — ) ko ( chahiye → mismatch', '<b>return false</b>'],
            ] } },
            { p: '<b>"((("</b> → teeno push, loop khatam, stack me 3 → <b>false</b>. <b>")))"</b> → pehla ) aaya, stack khaali → <b>false</b>.' },
            { pre: `Brute "{[()]}":
pass 1: "{[()]}" → "()" hata → "{[]}"   … (same pass me) "[]" hata → "{}" → "{}" hata → ""
pass 2: "" == prev? nahi ("{[()]}" tha) → prev = "" → koi change nahi
pass 3: s == prev → loop band → "" → true` },
          ],
        },
        {
          title: 'Part 6 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — pairs replace</b>' },
            { code: ap(20, 0) },
            { p: '<b>Optimal — stack (ArrayDeque, production)</b>' },
            { code: ap(20, 1) },
            { lines: [
              ['Deque<Character> stack = new ArrayDeque<>();', 'Pending openings. Stack class nahi — ArrayDeque.'],
              ['for (char ch : s.toCharArray())', 'Har character ek baar.'],
              ["if (ch == '(' || ch == '{' || ch == '[')", 'Opening?'],
              ['stack.push(ch);', 'Opening yaad rakho — iska closing baad me aayega.'],
              ['if (stack.isEmpty()) return false;', 'Closing aaya par koi opening pending nahi. <b>peek se pehle</b> — warna khaali pe peek null deta hai aur char me unboxing pe NPE.'],
              ['char top = stack.peek();', 'Sabse recent opening dekho (abhi remove nahi).'],
              ["if ((ch == ')' && top == '(') || …)", 'Pair match?'],
              ['stack.pop();', 'Match → pair complete, opening hatao.'],
              ['return false;', 'Mismatch — galat type ya galat order.'],
              ['return stack.isEmpty();', 'Kuch khula reh gaya toh invalid ("(((" case).'],
            ] },
            { p: '<b>Syllabus wala version — <code>Stack&lt;Character&gt;</code></b> (same logic; interview me ArrayDeque bolo):' },
            { code: J_LC20_STACK },
          ],
        },
        {
          title: 'Part 7 — Visualize: code line-by-line chalao',
          blocks: [
            { list: [
              '<b>Optimal</b> tab: Example 4 <code>([)]</code> — teesre char pe peek = [ aur mismatch → return false.',
              'Example 5 <code>{[()]}</code> — stack ka bharna aur ulta khaali hona.',
              '<b>Brute</b> tab: har pass me string chhoti hoti dekho — passes ginke O(n²) feel karo.',
            ] },
            { viz: 20, ex: 3 },
          ],
        },
        {
          title: 'Part 8 — Edge cases',
          blocks: [
            { table: { head: ['Input', 'Output', 'Kyun'], rows: [
              ['<code>()</code>', 'true', 'Ek pair'],
              ['<code>()[]{}</code>', 'true', 'Teen alag pairs'],
              ['<code>{[]}</code>', 'true', 'Nested'],
              ['<code>(]</code>', 'false', 'Type mismatch'],
              ['<code>([)]</code>', 'false', 'Order galat'],
              ['<code>(((</code>', 'false', 'End me stack non-empty'],
              ['<code>)))</code>', 'false', 'Closing pe stack khaali'],
              ['<code>""</code>', 'true', 'Kuch nahi = balanced (LeetCode me length ≥ 1, par code sahi deta hai)'],
            ] } },
            { tip: 'Shortcut: odd length → kabhi valid nahi (<code>if (s.length() % 2 == 1) return false;</code>) — optional early exit.' },
          ],
        },
        {
          title: 'Part 9 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute (replace pairs)', 'O(n²) — O(n) passes × O(n) replace', 'O(n) nayi strings'],
              ['Optimal (stack)', 'O(n) — har char ek push/pop', 'O(n) worst — sab opening "((((("'],
            ] } },
          ],
        },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Stack kyun, counter kyun nahi?', 'Counter order nahi pakadta — <code>([)]</code> me counts barabar hain par order galat.'],
              ['Sirf ek type ka bracket ho toh?', 'Tab counter kaafi: ( pe +1, ) pe −1, kabhi negative nahi, end me 0 → O(1) space.'],
              ['<code>isEmpty()</code> peek se pehle kyun?', 'Khaali ArrayDeque pe peek() null; <code>char top = null</code> unboxing → NullPointerException. Aur logically: closing ka koi opening nahi = invalid.'],
              ['End me <code>isEmpty()</code> kyun return?', 'Openings bache ho sakte hain ("(((").'],
              ['Stack vs ArrayDeque?', 'Stack legacy + synchronized; ArrayDeque fast, recommended.'],
              ['Switch se matching kaise?', 'Opening pe uska <b>closing</b> push karo; closing aaye toh pop == ch check (neeche Sohel session).'],
              ['Worst-case space kab?', 'Saare opening — sab stack me.'],
              ['Parser / compiler me ye kahan?', 'Syntax validation (brackets, tags), expression parsing, JSON/XML nesting check.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach (Brute → Optimal)', 'A brute force idea is to keep deleting adjacent pairs like "()", "[]" and "{}" until nothing changes; the string is valid if it becomes empty. That can take O(n) passes, so it is O(n squared). The optimal idea uses a stack: brackets must close in reverse order of opening, which is last in, first out. I push every opening bracket; for a closing bracket, if the stack is empty or the top is not the matching opener, I return false, otherwise I pop. At the end the stack must be empty. That is O(n) time and O(n) space.'],
              ['Follow-up: can it be O(1) extra space?', 'With only one bracket type, yes: a counter that must never go negative and must end at zero. With multiple types I need to remember the order of the pending openings, and for arbitrary nesting that is up to n items, so O(n) space is needed in general.'],
              ['Why check empty before peek?', 'A closing bracket with no pending opener is invalid, and in Java peek on an empty ArrayDeque returns null, which would throw a NullPointerException when unboxed into a char. So the empty check is both a correctness and a safety check.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohvi session',
          blocks: [
            { olist: [
              'Algorithm ke steps 1–5 (Part 2) apne shabdon me likho.',
              '"{[]}" aur "([)]" ka dry run table khud banao (Part 5), phir visualizer se match karo.',
              'Optimal code line-by-line explain karo (Part 6 ki <code>lines</code> table dekh ke).',
              'LC 20 khud likho aur submit karo (stuck ho toh sirf algorithm steps dekho).',
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 20 bina hints (8 min timer) — ArrayDeque version.',
              '<b>Task B:</b> <code>switch</code> se matching likho (neeche code se compare karo).',
              '<b>Task C:</b> Explain: counting kyun fail hoti hai; <code>isEmpty()</code> peek se pehle kyun; Stack vs ArrayDeque.',
              '<b>Task D (follow-ups):</b> O(1) extra space possible? Arbitrary nesting ke liye O(n) stack kyun? Parser me validation kaise use hota hai?',
              SQL,
            ] },
            { code: J_LC20_SWITCH },
          ],
        },
        {
          title: 'Part 14 — Homework',
          blocks: [
            { list: [
              '<b>Sohvi:</b> 10 valid/invalid examples khud banao aur manually check karo (stack draw karke).',
              '<b>Tum:</b> LC 20 ArrayDeque se dobara + har condition (empty check, mismatch, final isEmpty) ek line me explain likho.',
              'Kal (Day 45): Queue Basics — FIFO, array queue, circular queue (LC 622), LC 232 statement.',
            ] },
          ],
        },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>"(]"</code>?', 'false'],
              ['<code>"{[()]}"</code>?', 'true'],
              ['<code>"((("</code> kyun false?', 'End me stack non-empty.'],
              ['Closing aaya aur stack khaali?', 'return false.'],
              ['Time / space?', 'O(n) / O(n).'],
            ] },
          ],
        },
      ],
      checks: [
        'Valid vs invalid examples + counting kyun fail — bol sakta/sakti hu',
        '9-step algorithm yaad',
        '"{[]}" aur "([)]" dry run bina dekhe',
        'LC 20 brute + optimal dono samjhe',
        'LC 20 submit (Accepted)',
        'Edge cases ka table (8) check kiya',
        '8 interview sawaal bina dekhe',
      ],
      memory: 'Opening → push. Closing → khaali? false : top match? pop : false. End → isEmpty().',
    },

    // =====================================================================
    // DAY 45
    3: {
      title: 'Queue Basics — FIFO, Array Queue + Circular Queue',
      goal: '<b>Foundation 3: FIFO.</b> Queue kya hai, front / rear, enqueue / dequeue, array queue, <b>linear queue ki limitation</b>, circular queue, stack vs queue. <b>Sohvi:</b> FIFO + dry run + LC 232 ka statement. <b>Tum:</b> array queue + circular queue scratch se + <b>LC 622 Design Circular Queue</b>.',
      main: 622,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('LC 20 + array stack + LC 143', 'Module 1–2: FIFO, terminology, trace', 'Linear vs circular queue diagram + visualizer', 'enqueue 10, 20, 30 → dequeue → peek · LC 622 Example 1', 'Sohvi: queue dry run + LC 232 statement · Tum: ArrayQueue + LC 622', 'O(1) ops + homework'),
            ...rev({
              h: 'LC 20 — Valid Parentheses',
              p: 'Brackets sahi type aur sahi order me band hue?',
              ex: '"([)]" → ( push, [ push, ) aaya → top [ → mismatch → false\n"{[]}" → true',
              pat: 'Stack — Matching / Parentheses',
              steps: ['Opening → push.', 'Closing → khaali? false. Top match? pop, warna false.', 'End → stack.isEmpty().'],
              code: ap(20, 1),
              hook: 'Jo last khula, wahi pehle band — LIFO.',
            }),
            ...rev({
              h: 'Day 43: Array Stack — size + peek (no LC)',
              p: 'top index se peek aur size.',
              ex: 'arr [10,20,30], top = 2 → peek 30, size 3',
              pat: 'Stack (LIFO) — array implementation',
              steps: ['peek: underflow check, return arr[top].', 'size: top + 1.', 'isEmpty: top == −1.'],
              code: `int peek() {
    if (top == -1) throw new RuntimeException("Stack is Empty");
    return arr[top];
}

int size() {
    return top + 1;
}`,
              hook: 'Peek dekhta hai, chhoota nahi.',
            }),
            ...rev({
              h: 'LC 143 — Reorder List',
              p: 'L0 → Ln → L1 → Ln−1 … in-place.',
              ex: '[1,2,3,4] → middle 2 → second half [3,4] ulta [4,3] → merge 1 4 2 3',
              pat: 'Middle + Reverse + Merge (combo)',
              steps: ['Middle (slow/fast).', 'Second half reverse.', 'Alternate merge.'],
              code: llOpt(143),
              hook: 'Teen chhote patterns = ek medium.',
            }),
          ],
        },
        {
          title: 'Part 1 — Module 1: Queue kya hai? FIFO (First In, First Out)',
          blocks: [
            { p: '<b>Queue</b> = line. Jo <b>pehle aaya</b>, wahi <b>pehle jayega</b>. Insert peeche (<b>rear</b>) se, remove aage (<b>front</b>) se.' },
            { pre: `Ticket counter:

  Person A aaya → Person B aaya → Person C aaya

  FRONT →  [ A | B | C ]  ← REAR
  Ticket pehle kise?  A  (First In → First Out)` },
            { table: { head: ['Term', 'Matlab'], rows: [
              ['<b>Front</b>', 'Pehla element (agla nikalne wala)'],
              ['<b>Rear</b>', 'Last element (sabse naya)'],
              ['<b>Enqueue</b>', 'Rear pe insert (Java: <code>offer</code>)'],
              ['<b>Dequeue</b>', 'Front se remove (Java: <code>poll</code>)'],
              ['<b>Peek</b>', 'Front dekho, remove nahi'],
              ['<b>isEmpty / Size</b>', 'Khaali? / kitne'],
            ] } },
            { table: { head: ['Operation', 'Queue (front → rear)', 'Return'], rows: [
              ['start', '[]', '—'],
              ['enqueue(10)', '[10]', '—'],
              ['enqueue(20)', '[10, 20]', '—'],
              ['enqueue(30)', '[10, 20, 30]', '—'],
              ['dequeue()', '[20, 30]', '10'],
              ['peek()', '[20, 30]', '20'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Module 2: Linear Array Queue (Java)',
          blocks: [
            { p: 'Do index: <code>front = 0</code> (agla nikalne wala), <code>rear = -1</code> (last bhara). Enqueue rear badhata hai, dequeue front badhata hai.' },
            { code: J_ARRAY_QUEUE },
            { lines: [
              ['front = 0; rear = -1;', 'Khaali queue: front > rear.'],
              ['if (rear == capacity - 1)', 'Rear last index pe → overflow.'],
              ['arr[++rear] = value;', 'Rear aage, phir likho.'],
              ['if (front > rear)', 'Koi element nahi → underflow.'],
              ['return arr[front++];', 'Front ki value lo, phir front aage.'],
              ['return rear - front + 1;', 'front..rear tak elements.'],
            ] },
          ],
        },
        {
          title: 'Part 3 — Limitation → Circular Queue',
          blocks: [
            { pre: `Linear queue, capacity 3:
enqueue 10, 20, 30   →  [10 | 20 | 30]   front 0, rear 2
dequeue, dequeue     →  [ x |  x | 30]   front 2, rear 2
enqueue 40           →  rear == capacity−1 → "Queue Overflow"!
                        jabki index 0 aur 1 KHAALI hain → space waste

Circular queue: index ko % capacity se ghumao
rear = (rear + 1) % capacity = (2 + 1) % 3 = 0
                     →  [40 |  x | 30]   front 2, rear 0  ✓ jagah reuse
front = (front + 1) % capacity  (dequeue pe bhi same)` },
            { p: '<b>Empty vs full ka confusion:</b> sirf front/rear se pata nahi chalta (dono me pointers "same jagah" lag sakte hain). Isliye ek <b>size / count</b> rakho: <code>size == 0</code> empty, <code>size == capacity</code> full.' },
            { p: '<b>Syllabus wala circular queue (front + rear + size):</b>' },
            { code: J_CIRCULAR },
            { table: { head: ['', 'Stack', 'Queue'], rows: [
              ['Order', 'LIFO', 'FIFO'],
              ['Kahan se kaam', 'Top (ek hi end)', 'Rear pe insert, front se remove'],
              ['Operations', 'push / pop / peek', 'enqueue / dequeue / peek'],
              ['Use', 'Undo, recursion, brackets', 'Task scheduling, BFS, printer queue, buffers'],
              ['Complexity', 'Sab O(1)', 'Sab O(1) (circular array ya linked list)'],
            ] } },
          ],
        },
        { title: 'Part 4 — Aaj ka problem (Tum): LC 622 Design Circular Queue', blocks: [{ problem: 622 }] },
        {
          title: 'Part 5 — Thinking: Brute → Optimal (LC 622)',
          blocks: [
            { p: '<b>Brute (shift on deQueue):</b> elements hamesha index 0 se. enQueue = <code>arr[size++]</code>. deQueue = arr[1..] ko ek step left shift. Front = arr[0], Rear = arr[size − 1]. Sahi hai, par har deQueue <b>O(n)</b>.' },
            { p: '<b>Observation:</b> Shift isliye karna pada kyunki front hamesha 0 pe rakha. Agar <b>front ko hi aage badha do</b>, shift ki zarurat nahi — aur end ke baad wapas 0 pe aa jao (circular).' },
            { p: '<b>Optimal (front + count):</b> <code>rear = (front + count) % capacity</code> pe likho; deQueue = <code>front = (front + 1) % capacity</code>; <code>count</code> se empty/full. Rear element = <code>arr[(front + count − 1) % capacity]</code>. Sab <b>O(1)</b>.' },
            { p: '<b>Better?</b> Alag Better nahi — shift wale brute se seedha circular array.' },
          ],
        },
        {
          title: 'Part 6 — Dry run: LC 622 Example 1 (k = 3)',
          blocks: [
            { table: { head: ['Call', 'arr', 'front', 'count', 'Return', 'Note'], rows: [
              ['MyCircularQueue(3)', '[0, 0, 0]', '0', '0', 'null', ''],
              ['enQueue(1)', '[1, 0, 0]', '0', '1', 'true', 'rear = (0+0)%3 = 0'],
              ['enQueue(2)', '[1, 2, 0]', '0', '2', 'true', 'rear = 1'],
              ['enQueue(3)', '[1, 2, 3]', '0', '3', 'true', 'rear = 2'],
              ['enQueue(4)', '[1, 2, 3]', '0', '3', 'false', 'count == capacity → full'],
              ['Rear()', '[1, 2, 3]', '0', '3', '3', '(0+3−1)%3 = 2'],
              ['isFull()', '[1, 2, 3]', '0', '3', 'true', ''],
              ['deQueue()', '[1, 2, 3]', '1', '2', 'true', 'arr[0] ab "khaali" (value padi hai, count me nahi)'],
              ['enQueue(4)', '[<b>4</b>, 2, 3]', '1', '3', 'true', 'rear = (1+2)%3 = <b>0</b> ← wrap-around'],
              ['Rear()', '[4, 2, 3]', '1', '3', '4', '(1+3−1)%3 = 0'],
            ] } },
            { p: 'Brute me isi sequence pe deQueue ke time <code>[1,2,3] → [2,3,3]</code> (shift), size 2, phir enQueue(4) → <code>[2,3,4]</code>.' },
          ],
        },
        {
          title: 'Part 7 — Complete Java code + har line ka purpose (LC 622)',
          blocks: [
            { p: '<b>Brute — shift on deQueue</b>' },
            { code: ap(622, 0) },
            { p: '<b>Optimal — circular array (front + count)</b>' },
            { code: ap(622, 1) },
            { lines: [
              ['private int front;', 'Front element ka index.'],
              ['private int count;', 'Kitne elements — empty/full isi se.'],
              ['if (isFull()) return false;', 'Full queue me enQueue fail (LeetCode false chahta hai, exception nahi).'],
              ['int rear = (front + count) % capacity;', 'Agla khaali slot — end ke baad wrap.'],
              ['arr[rear] = value;', 'Likho.'],
              ['count++;', 'Ek element badha.'],
              ['front = (front + 1) % capacity;', 'deQueue = sirf front aage, koi shift nahi.'],
              ['count--;', 'Ek kam.'],
              ['return arr[(front + count - 1) % capacity];', 'Last element ka index.'],
              ['return count == capacity;', 'Full ki saaf condition.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohvi ka problem: LC 232 Implement Queue using Stacks (statement + idea)',
          blocks: [
            { problem: 232 },
            { p: '<b>Dhyaan:</b> LC 232 array queue <b>nahi</b> hai — sirf <b>do stacks</b> allowed. Stack order ulta karta hai; do baar ulta = seedha (FIFO).' },
            { p: '<b>Brute (costly push):</b> har push pe st ke saare elements tmp me, x daalo, sab wapas — st ka top hamesha front. push O(n).' },
            { p: '<b>Optimal (in / out, lazy transfer):</b> push → <code>in</code>. pop/peek → <code>out</code> se; out khaali ho <b>tabhi</b> in ka sab out me. Har element max ek baar transfer → <b>amortized O(1)</b>.' },
            { table: { head: ['Call (Example 2)', 'in (bottom → top)', 'out (bottom → top)', 'Return'], rows: [
              ['push 1, 2, 3', '[1, 2, 3]', '[]', 'null ×3'],
              ['pop()', '[]', '[3, 2] (transfer [3,2,1] phir pop 1)', '1'],
              ['push(4)', '[4]', '[3, 2]', 'null'],
              ['peek()', '[4]', '[3, 2]', '2 (transfer nahi — out bhara hai)'],
              ['pop()', '[4]', '[3]', '2'],
              ['pop()', '[4]', '[]', '3'],
              ['empty()', '[4]', '[]', 'false'],
            ] } },
            { code: ap(232, 1) },
            { p: 'Brute version (Day 48 revision me dobara):' },
            { code: ap(232, 0) },
          ],
        },
        {
          title: 'Part 9 — Visualize: circular queue + queue using stacks',
          blocks: [
            { list: [
              'LC 622 <b>Optimal</b>: <code>front</code> / <code>rear</code> pointers aur highlighted window — deQueue ke baad enQueue(4) index 0 pe wrap hota dekho.',
              'LC 622 <b>Brute</b> tab: deQueue me poora shift loop (har element ek step left).',
              'CALL STACK: <code>enQueue → isFull</code> — method ke andar method.',
              'LC 232: <code>in</code> / <code>out</code> stacks; transfer sirf tab jab out khaali.',
            ] },
            { viz: 622, ex: 0 },
            { viz: 232, ex: 1 },
          ],
        },
        {
          title: 'Part 10 — Edge cases',
          blocks: [
            { table: { head: ['Scenario', 'Result', 'Kyun'], rows: [
              ['Khaali queue pe deQueue / Front / Rear', 'false / −1 / −1', 'isEmpty check pehle'],
              ['Full queue pe enQueue', 'false', 'count == capacity'],
              ['k = 1', 'Ek enQueue ke baad full', 'front = rear = 0 hamesha'],
              ['Wrap-around (rear end se 0 pe)', 'Sahi', '% capacity'],
              ['Rear jab front > rear index (wrapped)', '(front + count − 1) % k', 'Modulo hi bachata hai'],
              ['Linear array queue me dequeue ke baad enqueue', 'Galat overflow', 'Isliye circular'],
            ] } },
          ],
        },
        {
          title: 'Part 11 — Complexity',
          blocks: [
            { table: { head: ['Structure', 'enqueue', 'dequeue', 'peek / Front / Rear', 'Space'], rows: [
              ['Linear array queue', 'O(1)', 'O(1) (par space waste)', 'O(1)', 'O(capacity)'],
              ['LC 622 Brute (shift)', 'O(1)', '<b>O(n)</b>', 'O(1)', 'O(k)'],
              ['LC 622 Optimal (circular)', 'O(1)', 'O(1)', 'O(1)', 'O(k)'],
              ['LC 232 Brute (costly push)', 'O(n)', 'O(1)', 'O(1)', 'O(n)'],
              ['LC 232 Optimal (in/out)', 'O(1)', 'Amortized O(1)', 'Amortized O(1)', 'O(n)'],
            ] } },
          ],
        },
        {
          title: 'Part 12 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Linear queue ki limitation?', 'Dequeue ke baad aage ki khaali jagah reuse nahi hoti → rear end pe pahunch ke false overflow.'],
              ['Circular queue space kaise reuse karta hai?', 'Index % capacity — last ke baad wapas 0.'],
              ['front aur rear ka purpose?', 'front = agla nikalne wala, rear = last daala hua; dono O(1) access dete hain.'],
              ['Empty aur full kaise alag pehchano?', 'count rakho (0 / capacity), ya ek slot khaali chhodo ((rear + 1) % k == front = full).'],
              ['Queue linked list se kaise?', 'head = front, tail = rear: enqueue tail pe, dequeue head se — dono O(1), capacity limit nahi.'],
              ['Queue vs Deque?', 'Queue: rear me add, front se remove. Deque: dono ends pe add/remove (ArrayDeque stack aur queue dono ban sakta hai).'],
              ['Java me queue?', '<code>Queue&lt;Integer&gt; q = new ArrayDeque&lt;&gt;();</code> — offer / poll / peek. (LinkedList bhi, par slower.)'],
              ['LC 232 me amortized O(1) kyun?', 'Har element in me ek push, out me ek transfer, ek pop — n ops ka total O(n).'],
            ] },
          ],
        },
        {
          title: 'Part 13 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Design Circular Queue (approach)', 'A simple version keeps elements starting at index zero and shifts everything left on dequeue, which makes dequeue O(n). Instead I keep a fixed array with a front index and a count. Enqueue writes at front plus count modulo k and increments count; dequeue moves front forward modulo k and decrements count. Front is arr at front, rear is arr at front plus count minus one modulo k. Empty is count zero and full is count equal to k. Every operation is O(1) and space is O(k).'],
              ['Why circular?', 'In a linear array queue the indices only move forward, so slots freed by dequeue are never reused and the queue can report full while it has free space. Wrapping indices with modulo turns the array into a ring buffer, which is also how ArrayDeque and many I/O buffers work internally.'],
              ['Queue using two stacks', 'Push goes into an input stack. For pop or peek I read from an output stack, and only when it is empty do I move everything from input to output, which reverses the order so the oldest element is on top. Each element is moved at most once, so all operations are amortized O(1).'],
            ] },
          ],
        },
        {
          title: 'Part 14 — Sohvi session',
          blocks: [
            { olist: [
              'FIFO ticket-counter example apne shabdon me.',
              'front / rear identify karo: <code>enqueue 5, enqueue 7, dequeue, enqueue 9, peek</code> → dequeue 5, peek 7, queue [7, 9].',
              'Stack vs Queue table (Part 3) bina dekhe banao.',
              '<b>LC 232 ka statement padho</b> (Part 8) — "do stacks se queue" ka idea ek line me likho.',
            ] },
          ],
        },
        {
          title: 'Part 15 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> ArrayQueue (enqueue, dequeue, peek, isEmpty, size) scratch se.',
              '<b>Task B:</b> Circular queue (front + rear + size) scratch se — full / empty conditions bolke.',
              '<b>Task C:</b> <b>LC 622</b> submit — pehle Brute (shift), phir Optimal (front + count).',
              '<b>Task D (follow-ups):</b> linear queue limitation; circular queue space reuse; front/rear purpose; queue using linked list; queue vs deque.',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 16 — Homework',
          blocks: [
            { list: [
              '<b>Sohvi:</b> 10 queue operations ka dry run (front → rear har step).',
              '<b>Tum:</b> Linear + circular queue dono implement; full/empty conditions ek paragraph me explain.',
              'Kal (Day 46): LC 225 Implement Stack using Queues — queue se stack.',
            ] },
          ],
        },
        {
          title: 'Part 17 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['enqueue 1, 2, 3, dequeue, peek?', 'dequeue 1, peek 2.'],
              ['Circular rear ka next index?', '(rear + 1) % capacity.'],
              ['LC 622 me full condition?', 'count == capacity.'],
              ['k = 3, front = 1, count = 2 → enQueue kahan likhega?', '(1 + 2) % 3 = 0.'],
              ['LC 232 me transfer kab?', 'Sirf jab out khaali ho (pop/peek pe).'],
            ] },
          ],
        },
      ],
      checks: [
        'FIFO + front/rear/enqueue/dequeue explain kar sakta/sakti hu',
        'enqueue 10 → 20 → 30 → dequeue → peek trace sahi',
        'Linear queue limitation + circular fix samjha',
        'Stack vs Queue table bina dekhe',
        'Tum: ArrayQueue + CircularQueue scratch se, LC 622 submit',
        'Sohvi: LC 232 statement padha, do-stack idea bol sakti hu',
        '8 interview sawaal bina dekhe',
      ],
      memory: 'Queue = line: rear me aao, front se jao. Circular = index % capacity, count se empty/full.',
    },

    // =====================================================================
    // DAY 46
    4: {
      title: 'Stack using Queues — Data Structure Simulation',
      goal: '<b>Pattern 4: Simulation.</b> Ek data structure (queue, FIFO) se doosra (stack, LIFO) banana. <b>LC 225</b>: two queues costly pop (Brute) → two queues costly push (Better) → one queue rotation (Optimal). Kaunsa operation optimize kar rahe ho — ye trade-off bolna.',
      main: 225,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('LC 622, LC 232, LC 20', 'Simulation kya hai, queue vs stack order', 'Two queues + one queue rotation diagrams', 'push1 push2 (two queues) · [1,2] push3 rotation', 'Sohvi: one-queue dry run · Tum: teeno versions', 'Trade-off + homework'),
            ...rev({
              h: 'LC 622 — Design Circular Queue',
              p: 'Fixed size ring buffer — har op O(1).',
              ex: 'k = 3: enQueue 1,2,3 → full · deQueue → front 1 · enQueue 4 → index (1+2)%3 = 0',
              pat: 'Design — Circular Array (front + count)',
              steps: ['enQueue: full? false. arr[(front + count) % k] = v, count++.', 'deQueue: empty? false. front = (front + 1) % k, count−−.', 'Rear = arr[(front + count − 1) % k].'],
              code: ap(622, 1),
              hook: 'Shift mat karo — front ko ghumao.',
            }),
            ...rev({
              h: 'LC 232 — Implement Queue using Stacks',
              p: 'Do stacks se FIFO queue.',
              ex: 'push 1, 2 → in [1,2] · peek → out khaali → transfer → out [2,1] → 1',
              pat: 'Design — Two Stacks (lazy transfer)',
              steps: ['push → in.', 'peek/pop → out khaali ho toh in ka sab out me.', 'out ka top = front.'],
              code: ap(232, 1),
              hook: 'Do baar ulta = seedha. Transfer tabhi jab out khaali.',
            }),
            ...rev({
              h: 'LC 20 — Valid Parentheses',
              p: 'Brackets valid?',
              ex: '"()[]{}" → true · "(]" → false',
              pat: 'Stack — Matching / Parentheses',
              steps: ['Opening push.', 'Closing: empty / mismatch → false, match → pop.', 'End: isEmpty.'],
              code: ap(20, 1),
              hook: 'Pehle khaali check, phir peek.',
            }),
          ],
        },
        {
          title: 'Part 1 — Concept: Simulation — queue se stack kyun mushkil?',
          blocks: [
            { pre: `Push order: 1, 2, 3

Queue (FIFO) nikaalegi:  1, 2, 3     (front se)
Stack (LIFO) chahiye:    3, 2, 1     (newest pehle)

→ Kisi tarah NEWEST element ko queue ke FRONT pe laana hai.` },
            { table: { head: ['Tareeka', 'Idea', 'Costly'], rows: [
              ['Two queues — costly pop (Brute)', 'push seedha q1; pop pe (size−1) elements q2 me, last = top', 'pop, top'],
              ['Two queues — costly push (Better)', 'push: x → khaali q2, q1 ka sab q2 me (x ke peeche), swap', 'push'],
              ['One queue — rotation (Optimal)', 'offer x, phir (size − 1) baar poll → offer', 'push'],
            ] } },
            { p: '"<b>Simulation</b>" = jo operations allowed hain (sirf offer / poll / peek / size / isEmpty) unhi se doosre DS ka behaviour copy karna. Interviewer dekhna chahta hai: tum <b>order</b> aur <b>trade-off</b> samajhte ho.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 225 Implement Stack using Queues', blocks: [{ problem: 225 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute (two queues, costly pop):</b> push O(1) — q1.offer. pop: q1 ke pehle (size − 1) elements q2 me, bacha hua = top → poll, phir q1 ↔ q2 swap. top() = pop + wapas push. pop aur top <b>dono O(n)</b>.' },
            { p: '<b>Better (two queues, costly push):</b> Kaam push pe karo taaki reads sasti ho: x ko khaali q2 me, q1 ke saare q2 me (x ke peeche), swap. Ab q1 ka front hamesha newest → pop / top <b>O(1)</b>, sirf push O(n). Stack me reads (top/pop) aksar zyada hote hain.' },
            { p: '<b>Optimal (one queue):</b> q2 ki zarurat hi nahi — x ko offer karke pehle wale (size − 1) elements ko <b>ghuma</b> do (poll → offer). Same complexity (push O(n), pop/top O(1)), lekin <b>ek hi queue</b> (follow-up).' },
          ],
        },
        {
          title: 'Part 4 — Dry run',
          blocks: [
            { p: '<b>Better — two queues costly push:</b> push 1, push 2, pop' },
            { table: { head: ['Step', 'q1 (front → back)', 'q2', 'Note'], rows: [
              ['push(1): q2.offer(1)', '[]', '[1]', ''],
              ['q1 khaali → swap', '[1]', '[]', ''],
              ['push(2): q2.offer(2)', '[1]', '[2]', 'naya sabse aage'],
              ['q1 ka 1 → q2', '[]', '[2, 1]', ''],
              ['swap', '[2, 1]', '[]', 'front 2 = top'],
              ['pop()', '[1]', '[]', 'return 2'],
            ] } },
            { p: '<b>Optimal — one queue rotation:</b> queue [1, 2] me push(3)' },
            { table: { head: ['Step', 'queue (front → back)'], rows: [
              ['offer(3)', '[1, 2, 3]'],
              ['rotate 1: poll 1 → offer', '[2, 3, 1]'],
              ['rotate 2: poll 2 → offer', '[3, 1, 2]  ← 3 front pe = top ✓'],
            ] } },
            { p: '<b>Predict:</b> push 1, push 2, push 3, pop → <b>3</b> (queue phir [2, 1]).' },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — two queues, costly pop</b>' },
            { code: ap(225, 0) },
            { p: '<b>Better — two queues, costly push (syllabus)</b>' },
            { code: ap(225, 1) },
            { p: '<b>Optimal — one queue rotation (syllabus)</b>' },
            { code: ap(225, 2) },
            { lines: [
              ['private Queue<Integer> queue = new LinkedList<>();', 'Ek hi queue. (ArrayDeque bhi chalega.)'],
              ['queue.offer(x);', 'x abhi back me — stack ke hisaab se galat jagah.'],
              ['int size = queue.size();', 'Size pehle save — loop ke andar size nahi badalta (poll + offer), par saaf rehta hai.'],
              ['for (int i = 0; i < size - 1; i++)', 'x se pehle wale saare elements ghumane hain.'],
              ['queue.offer(queue.poll());', 'Front ko uthake back me — rotation.'],
              ['return queue.poll();', 'Front = newest = top. O(1).'],
              ['return queue.peek();', 'Top dekho. O(1).'],
              ['return queue.isEmpty();', ''],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize: teeno tabs line-by-line',
          blocks: [
            { list: [
              '<b>Brute</b>: <code>top()</code> ke andar <code>pop()</code> aur <code>push()</code> — CALL STACK me 2 frames.',
              '<b>Better</b>: har push pe q1 → q2 shift aur reference swap.',
              '<b>Optimal</b>: offer ke baad rotation — naya element front pe aata dekho.',
              'Example 2 chalao: push 1, 2, 3 → pop 3 → top 2 → push 4 → pops.',
            ] },
            { viz: 225, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Comparison: kaunsa operation optimize kar rahe ho?',
          blocks: [
            { table: { head: ['Approach', 'push', 'pop', 'top', 'Queues'], rows: [
              ['Two queues — costly pop (Brute)', 'O(1)', 'O(n)', 'O(n)', '2'],
              ['Two queues — costly push (Better)', 'O(n)', 'O(1)', 'O(1)', '2'],
              ['One queue — rotation (Optimal)', 'O(n)', 'O(1)', 'O(1)', '1'],
            ] } },
            { tip: 'Push-heavy workload (logging jaisa, kabhi-kabhi pop) → costly-pop version theek. Read-heavy → costly push / one queue. Interview me ye trade-off <b>khud</b> bolo.' },
          ],
        },
        {
          title: 'Part 8 — Edge cases',
          blocks: [
            { table: { head: ['Scenario', 'Result', 'Note'], rows: [
              ['Pehla push (queue khaali)', 'Rotation 0 baar', 'size − 1 = 0'],
              ['pop ke baad empty()', 'true', 'Example 2 ka end'],
              ['top() do baar', 'Same value', 'peek remove nahi karta'],
              ['Brute: top() ke baad state', 'Same', 'pop + wapas push (back me) — order sahi rehta hai kyunki wahi top hai'],
              ['LeetCode guarantee', 'pop/top khaali pe nahi', 'Phir bhi interview me poocho'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'Time', 'Space'], rows: [
              ['Brute', 'push O(1), pop/top O(n)', 'O(n), do queues'],
              ['Better', 'push O(n), pop/top O(1)', 'O(n), do queues'],
              ['Optimal', 'push O(n), pop/top O(1)', 'O(n), ek queue'],
            ] } },
          ],
        },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['Rotate kyun karte ho?', 'Newest element ko front pe laane ke liye — queue sirf front se deti hai.'],
              ['Kitni baar rotate?', 'size − 1 (naye element ko chhod ke sab).'],
              ['One queue possible?', 'Haan — rotation (Optimal).'],
              ['Kaunsa operation optimize kar rahe ho?', 'Rotation / costly push version me pop + top (reads) O(1).'],
              ['Har approach ki complexity?', 'Brute: push O(1), pop/top O(n). Better + Optimal: push O(n), pop/top O(1).'],
              ['Isse "simulation" kyun kehte hain?', 'Sirf queue ke allowed operations se stack ka behaviour copy kar rahe hain.'],
              ['Two-queue swap O(1) kaise?', 'Sirf references badalte hain, elements copy nahi.'],
              ['LC 232 se fark?', '232: stacks se queue (amortized O(1) possible). 225: queues se stack — kisi ek op ko O(n) dena padta hai.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach (Brute → Better → Optimal)', 'With two queues I can keep push O(1) and make pop expensive: move all but the last element to the helper queue, take the last one, and swap. Since reads are usually frequent, a better trade-off is to make push expensive instead: put the new element into the empty helper queue, move everything behind it, and swap, so pop and top are O(1). Finally I do not even need the second queue: after offering x to a single queue I rotate the previous size minus one elements, which brings x to the front. Push is O(n), pop and top are O(1), with one queue.'],
              ['Why is this called simulation?', 'I am only allowed the queue operations offer, poll, peek, size and isEmpty, and I use them to reproduce stack behaviour. The key is to control order: a queue returns the oldest element, so I rearrange the queue on push so that the newest element is always the oldest from the queue’s point of view.'],
              ['Trade-off question', 'Whether push or pop should be O(n) depends on the workload. If the stack is mostly written and rarely read, I would keep push O(1) and pay on pop. If reads dominate, I pay on push. I would state this to the interviewer and ask about the expected call pattern.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohvi session',
          blocks: [
            { olist: [
              'LC 225 statement padho; "queue vs stack" order fark ek example se (push 1, 2, 3).',
              'One-queue rotation ka dry run paper pe: [1, 2] me push 3 (Part 4).',
              'Predict karo: push 1, push 2, push 3, pop → ? (3) — phir visualizer se check.',
              'Optimal code ki 4 methods padho — kaunsi line rotation karti hai, underline karo.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Teeno versions memory se: two queues costly pop, two queues costly push, one queue (har ek 8 min).',
              '<b>Task B:</b> LC 225 one-queue submit.',
              '<b>Task C (interview):</b> rotate kyun? one queue possible? kaunsa op optimize? har op ki complexity? "simulation" kyun?',
              '<b>Task D:</b> Workload ke hisaab se version choose karo — 3 line ka answer record karo.',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 14 — Homework',
          blocks: [
            { list: [
              '<b>Sohvi:</b> LC 225 ka dry run (Example 2) one-queue se — har step queue likho.',
              '<b>Tum:</b> One queue + two queue implementations blank editor me; trade-off ek paragraph.',
              'Kal (Day 47): LC 155 Min Stack — auxiliary data structure.',
            ] },
          ],
        },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['[1, 2] me push 3 ke baad queue (one queue)?', '[3, 1, 2]'],
              ['One-queue version me pop?', 'queue.poll() — O(1).'],
              ['Costly-pop version me top() kaise?', 'pop() karke wapas push().'],
              ['Rotation count?', 'size − 1.'],
              ['Optimal space?', 'O(n), ek queue.'],
            ] },
          ],
        },
      ],
      checks: [
        'Queue se stack banana kyun mushkil — order example se bol sakta/sakti hu',
        'Two queues (costly pop + costly push) aur one queue — teeno samjhe',
        '[1, 2] push 3 rotation dry run bina dekhe',
        'Comparison table (push / pop / top) yaad',
        'LC 225 submit (Accepted)',
        'Trade-off (workload) bol sakta/sakti hu',
        '8 interview sawaal bina dekhe',
      ],
      memory: 'Offer karo, size − 1 baar ghumao — naya front pe = stack ka top.',
    },

    // =====================================================================
    // DAY 47
    5: {
      title: 'Min Stack — Auxiliary Data Structure',
      goal: '<b>Pattern 5: Auxiliary Data Structure.</b> Minimum har push/pop pe badal sakta hai — har baar traverse O(n). Ek <b>extra (auxiliary) stack</b> rakh ke <code>getMin()</code> O(1). <b>LC 155</b>: Brute (traverse) → Better ({val, min} pairs) → Optimal (stack + minStack), duplicates ke liye <b>≤</b>, aur single-stack encoding follow-up.',
      main: 155,
      parts: [
        {
          title: 'Part 0 — Cumulative Revision + Aaj ka session',
          blocks: [
            { p: RULE },
            session('LC 225, LC 622, LC 232', 'Min kaise badalta hai, auxiliary DS', 'stack + minStack side-by-side visualizer', '3, 8, 2, 5 push → pop → pop table + duplicates', 'Sohvi: dry run + duplicate case · Tum: brute + optimal + encoded', 'O(1) / O(n) extra + homework'),
            ...rev({
              h: 'LC 225 — Implement Stack using Queues',
              p: 'Queues se LIFO stack.',
              ex: 'queue [1,2] → push 3 → [1,2,3] → rotate 2 → [3,1,2] → pop 3',
              pat: 'Design — Queue rotation',
              steps: ['offer(x).', 'size − 1 baar poll → offer.', 'pop = poll, top = peek.'],
              code: ap(225, 2),
              hook: 'Offer karo, size − 1 baar ghumao.',
            }),
            ...rev({
              h: 'LC 622 — Design Circular Queue',
              p: 'Ring buffer, O(1) ops.',
              ex: 'k = 2: enQueue 5 → Front 5 · deQueue → empty → Front −1',
              pat: 'Design — Circular Array (front + count)',
              steps: ['rear = (front + count) % k.', 'deQueue: front = (front + 1) % k.', 'count se empty/full.'],
              code: ap(622, 1),
              hook: 'count == 0 khaali, count == k full.',
            }),
            ...rev({
              h: 'LC 232 — Implement Queue using Stacks',
              p: 'Stacks se FIFO.',
              ex: 'push 1,2,3 → pop → transfer out [3,2,1] → 1 · push 4 → in [4] · peek → 2 (transfer nahi)',
              pat: 'Design — Two Stacks (lazy transfer)',
              steps: ['push → in.', 'out khaali? → in ka sab out me.', 'pop/peek out se.'],
              code: ap(232, 1),
              hook: 'Har element max ek baar transfer → amortized O(1).',
            }),
          ],
        },
        {
          title: 'Part 1 — Concept: minimum badalta rehta hai',
          blocks: [
            { pre: `Stack (bottom → top): 3, 8, 2, 5      → min = 2
push(1)            : 3, 8, 2, 5, 1   → min = 1
pop()              : 3, 8, 2, 5      → min = 2   (purana min WAPAS chahiye!)

Har getMin pe poora stack scan = O(n)  ✗
Har level pe "us waqt ka min" yaad rakho = O(1)  ✓  → auxiliary data structure` },
            { p: '<b>Auxiliary DS</b> = main structure ke saath ek helper structure jo extra info (yahan: minimum ka history) O(1) me deta hai. Price: extra memory.' },
          ],
        },
        { title: 'Part 2 — Aaj ka problem: LC 155 Min Stack', blocks: [{ problem: 155 }] },
        {
          title: 'Part 3 — Thinking: Brute → Better → Optimal',
          blocks: [
            { p: '<b>Brute:</b> normal stack; <code>getMin()</code> me poora stack traverse. push/pop/top O(1), <b>getMin O(n)</b> — problem O(1) maangta hai.' },
            { p: '<b>Better ({val, min} pairs):</b> har entry ke saath "is level tak ka min" bhi store: <code>min = min(val, top ka min)</code>. getMin = top ka min. Sab O(1), lekin <b>har</b> element ke saath ek extra int (2n).' },
            { p: '<b>Optimal (stack + minStack):</b> minStack me sirf tab push jab <code>val ≤ current min</code>. pop pe agar <code>removed == minStack.peek()</code> toh minStack se bhi pop. Sab O(1); minStack aksar chhota (sirf naye minimums) — worst case O(n).' },
            { tip: '<b>≤ kyun, &lt; kyun nahi?</b> push 2, push 2: &lt; ke saath minStack me sirf ek 2. Pehla pop (2) minStack ka 2 bhi hata dega — jabki stack me ek 2 abhi bhi hai → getMin galat / crash.' },
          ],
        },
        {
          title: 'Part 4 — Dry run (syllabus table)',
          blocks: [
            { table: { head: ['Operation', 'stack (top first)', 'minStack (top first)', 'getMin'], rows: [
              ['push 3', '3', '3', '3'],
              ['push 8', '8, 3', '3', '3 (8 > 3 → minStack me nahi)'],
              ['push 2', '2, 8, 3', '2, 3', '2'],
              ['push 5', '5, 2, 8, 3', '2, 3', '2'],
              ['pop (5)', '2, 8, 3', '2, 3', '2 (5 ≠ 2 → minStack same)'],
              ['pop (2)', '8, 3', '3', '3 (2 == min top → minStack pop)'],
            ] } },
            { p: '<b>Duplicate case:</b> push 2, push 2, push 3, pop, getMin' },
            { table: { head: ['Op', 'stack', 'minStack (≤)', 'minStack (&lt; — galat)'], rows: [
              ['push 2', '2', '2', '2'],
              ['push 2', '2, 2', '2, 2', '2'],
              ['push 3', '3, 2, 2', '2, 2', '2'],
              ['pop (3)', '2, 2', '2, 2', '2'],
              ['getMin', '', '<b>2</b> ✓', '2 (abhi theek)'],
              ['pop (2)', '2', '2 → getMin 2 ✓', '<b>khaali</b> → getMin crash ✗'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Complete Java code + har line ka purpose',
          blocks: [
            { p: '<b>Brute — getMin traverse</b>' },
            { code: ap(155, 0) },
            { p: '<b>Better — {val, min} pairs</b>' },
            { code: ap(155, 1) },
            { p: '<b>Optimal — stack + minStack (syllabus)</b>' },
            { code: ap(155, 2) },
            { lines: [
              ['private Deque<Integer> minStack', 'Top = current minimum. (Syllabus me Stack&lt;Integer&gt; — interview me ArrayDeque bolo.)'],
              ['stack.push(val);', 'Har value main stack me.'],
              ['if (minStack.isEmpty() || val <= minStack.peek())', 'Pehla element ya naya / barabar min. <b>≤</b> duplicates ke liye.'],
              ['minStack.push(val);', 'Min history me jodo.'],
              ['int removed = stack.pop();', '<b>int</b> me lo — taaki agla compare value se ho (Integer == Integer reference compare karta, −128..127 ke bahar galat).'],
              ['if (removed == minStack.peek())', 'Nikla element current min tha?'],
              ['minStack.pop();', 'Haan → pichla min wapas top pe.'],
              ['return minStack.peek();', 'getMin O(1).'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Visualize: stack + minStack side-by-side',
          blocks: [
            { list: [
              '<b>Optimal</b>: har push pe <code>val <= minStack.peek()</code> check — kab minStack badhta hai, kab nahi.',
              'Example 2 (0, 1, 0) — duplicate min; pehla 0 pop hone ke baad bhi getMin = 0.',
              '<b>Brute</b> tab: getMin me poora stack loop — O(n) dikhega.',
              '<b>Better</b> tab: har entry {val, min} — top ka min hi answer.',
            ] },
            { viz: 155, ex: 1 },
          ],
        },
        {
          title: 'Part 7 — Edge cases',
          blocks: [
            { table: { head: ['Scenario', 'Expected', 'Kya dhyaan'], rows: [
              ['push 2, 2, 3, pop, getMin', '2', '≤ zaroori'],
              ['Integer.MIN_VALUE / MAX_VALUE', 'Sahi', 'Optimal/Better me koi arithmetic nahi; encoded version me long'],
              ['Bade values (1000, 1000) compare', 'Sahi', '<code>int removed</code> — Integer == trap se bacho'],
              ['pop/top/getMin khaali pe', 'LeetCode guarantee: nahi hoga', 'Interview me poocho; production me exception'],
              ['Strictly decreasing pushes (5, 4, 3, 2)', 'minStack = stack size', 'Worst case extra O(n)'],
            ] } },
          ],
        },
        {
          title: 'Part 8 — Complexity',
          blocks: [
            { table: { head: ['Approach', 'push', 'pop', 'top', 'getMin', 'Extra space'], rows: [
              ['Brute', 'O(1)', 'O(1)', 'O(1)', '<b>O(n)</b>', '—'],
              ['Better (pairs)', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'O(n) — har entry pe ek int'],
              ['Optimal (two stacks)', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'O(n) worst, aksar kam'],
              ['Encoded single stack', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'O(1) extra (sirf ek long min)'],
            ] } },
          ],
        },
        {
          title: 'Part 9 — Follow-up (advanced): single stack with encoded values',
          blocks: [
            { p: '<b>Pehle two-stack master karo.</b> Ye follow-up hai: ek hi stack me <code>val − min</code> (difference) store karo. Negative difference ka matlab "yahan min badla tha" — pop pe purana min wapas nikaal lo. <code>long</code> isliye ki <code>val − min</code> int overflow kar sakta hai.' },
            { code: J_MINSTACK_ENCODED },
            { pre: `push 3: stack [0],          min 3
push 1: 1−3 = −2 → [−2, 0], min 1   (negative = min badla)
top():  diff −2 < 0 → top = min = 1
pop():  diff −2 < 0 → min = 1 − (−2) = 3  ✓ purana min wapas` },
          ],
        },
        {
          title: 'Part 10 — Interview Deep Dive: 8 chhote sawaal',
          blocks: [
            { qa: [
              ['getMin O(1) kaise?', 'minStack ka top hamesha current min.'],
              ['Auxiliary stack kyun?', 'Min ka history chahiye — pop ke baad pichla min O(1) me.'],
              ['Duplicates kaise handle?', 'Push me ≤ — barabar min bhi minStack me.'],
              ['Ek stack me ho sakta hai?', 'Haan — {val, min} pairs (Better) ya encoded diff (O(1) extra).'],
              ['Space?', 'O(n) extra worst case (decreasing input).'],
              ['<code>Integer == Integer</code> trap?', 'Reference compare; −128..127 cache ke bahar false. int me unbox karo ya equals.'],
              ['Max stack chahiye toh?', 'Same idea, ≥ ke saath maxStack.'],
              ['Pairs vs two stacks?', 'Pairs simple, har element 2 ints. Two stacks me minStack sirf minimums — aksar kam memory.'],
            ] },
          ],
        },
        {
          title: 'Part 11 — Bade interview answers: aise bolo',
          blocks: [
            { say: [
              ['Approach (Brute → Better → Optimal)', 'The brute force keeps a normal stack and scans it in getMin, which is O(n). A better version stores each value together with the minimum up to that level, so getMin reads the top pair in O(1), at the cost of an extra int per element. The optimal version keeps a second stack only for minimums: on push I also push onto the min stack when the value is less than or equal to its top, and on pop, if the removed value equals the min stack top, I pop it too. All four operations are O(1).'],
              ['Why less than or equal?', 'Because of duplicates. If the minimum 2 is pushed twice but recorded once, popping the first 2 would remove it from the min stack while another 2 is still in the main stack, and getMin would be wrong. Recording equal values keeps the counts in sync.'],
              ['Follow-up: O(1) extra space', 'I can store the difference between the value and the current minimum in a single stack of longs. A negative difference marks a point where the minimum changed, so on pop I restore the previous minimum as min minus diff, and top is either min or min plus diff. I use long to avoid integer overflow.'],
            ] },
          ],
        },
        {
          title: 'Part 12 — Sohvi session',
          blocks: [
            { olist: [
              'Min kaise badalta hai — Part 1 ka example apne shabdon me.',
              'Auxiliary stack ka purpose ek line me likho.',
              'Syllabus wala dry run table (Part 4) khud banao: push 3, 8, 2, 5, pop, pop.',
              'Duplicate case samjho (conceptually): push 2, push 2 — dono minStack me kyun?',
            ] },
          ],
        },
        {
          title: 'Part 13 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Brute (traverse) → Optimal (two stacks) memory se, 10 min.',
              '<b>Task B:</b> Duplicates + har API ki empty condition bolo (pop/top/getMin).',
              '<b>Task C:</b> LC 155 submit (Optimal).',
              '<b>Task D (follow-up):</b> Encoded single stack (Part 9) likho aur 3 ops pe dry run.',
              '<b>Interview:</b> getMin O(1) kyun? auxiliary kyun? duplicates? one stack? space?',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 14 — Homework',
          blocks: [
            { list: [
              '<b>Sohvi:</b> 10-operation dry run (stack + minStack dono columns).',
              '<b>Tum:</b> getMin O(1) ka 1-minute explanation record karo + LC 155 bina notes.',
              'Kal (Day 48, Saturday): Revision — 20, 232, 225, 155 + saari implementations.',
            ] },
          ],
        },
        {
          title: 'Part 15 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['push −2, 0, −3, getMin?', '−3'],
              ['Uske baad pop, getMin?', '−2'],
              ['minStack me push condition?', '<code>minStack.isEmpty() || val <= minStack.peek()</code>'],
              ['&lt; likha toh kaunsa case fail?', 'Duplicate minimum (push 2, push 2, pop → getMin).'],
              ['Har op ki time?', 'O(1).'],
            ] },
          ],
        },
      ],
      checks: [
        'Min kyun badalta hai aur traverse O(n) kyun — samjha',
        'Auxiliary stack ka purpose bol sakta/sakti hu',
        'Syllabus dry run table (3, 8, 2, 5, pop, pop) bina dekhe',
        '≤ vs < duplicate case samjha',
        'LC 155 Optimal submit (Accepted)',
        'Tum: encoded single-stack follow-up likha',
        '8 interview sawaal bina dekhe',
      ],
      memory: 'Saath me minStack: val ≤ min → usme bhi push; removed == min → usse bhi pop.',
    },

    // =====================================================================
    // DAY 48 (Saturday)
    6: {
      title: 'Stack & Queue Revision — 20, 232, 225, 155',
      goal: 'Poore hafte ka revision: <b>Sohvi</b> — LC 20 independently, LC 232 aur LC 225 ka simulation concept. <b>Tum</b> — 6 implementations bina notes (array stack, array queue, circular queue, stack via one queue, stack via two queues, min stack) + pattern recognition test.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan',
          blocks: [
            { p: RULE },
            session('Master table (Part 1) zubaani', 'LC 20 → 232 → 225 → 155 re-solve', 'Visualizer se har design ka state check', 'LC 232 Example 2 + LC 225 rotation paper pe', 'Tum: 6 implementations · Sohvi: LC 20 + 232/225 concept', 'Complexity table + pattern test'),
            { list: ['Rule 1: pehle khud likho (timer), phir notes.', 'Rule 2: design problems me har call ke baad internal state bolo.', 'Rule 3: atke toh sirf Memory hook dekho, code nahi.'] },
          ],
        },
        {
          title: 'Part 1 — Master table: 5 concepts',
          blocks: [
            { table: { head: ['Concept', 'Pattern', 'Main operations', 'Question'], rows: [
              ['Stack', 'LIFO', 'push / pop / peek', 'Array stack (Day 43)'],
              ['Valid Parentheses', 'Matching', 'push opening, peek + pop on closing', 'LC 20'],
              ['Queue', 'FIFO', 'enqueue / dequeue', 'Array + circular queue, LC 622'],
              ['Stack using Queue', 'Simulation', 'offer + rotation', 'LC 225'],
              ['Queue using Stacks', 'Simulation (two stacks)', 'in / out, lazy transfer', 'LC 232'],
              ['Min Stack', 'Auxiliary DS', 'stack + minStack', 'LC 155'],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Re-solve: LC 20 Valid Parentheses',
          blocks: [
            { p: '<b>Pattern:</b> Stack — matching. Opening push; closing → empty? false; top match → pop; warna false; end isEmpty.' },
            { pre: '"([)]" → ( [ push → ) aaya, top [ → false     "{[]}" → true' },
            { code: ap(20, 1) },
            { tip: 'Memory hook: pehle khaali check, phir peek, match pe pop, end me isEmpty.' },
            { viz: 20, ex: 3 },
          ],
        },
        {
          title: 'Part 3 — Re-solve: LC 232 Implement Queue using Stacks',
          blocks: [
            { p: '<b>LC 232 ≠ array queue.</b> Sirf stacks allowed. Do tareeke:' },
            { table: { head: ['Version', 'push', 'pop / peek', 'Idea'], rows: [
              ['Costly push (Brute)', 'O(n)', 'O(1)', 'Har push pe st → tmp, x, tmp → st (st ka top = front)'],
              ['Costly pop, lazy (Optimal)', 'O(1)', 'Amortized O(1)', 'in / out; out khaali ho tabhi transfer'],
            ] } },
            { code: ap(232, 0) },
            { code: ap(232, 1) },
            { tip: 'Memory hook: do baar ulta = seedha; transfer sirf jab out khaali.' },
            { viz: 232, ex: 1, variant: 1 },
          ],
        },
        {
          title: 'Part 4 — Re-solve: LC 225 Implement Stack using Queues',
          blocks: [
            { p: '<b>Pattern:</b> simulation — one-queue rotation (Sohvi), two queues dono tareeke (Tum).' },
            { pre: 'queue [1, 2] → push 3 → [1, 2, 3] → [2, 3, 1] → [3, 1, 2] → pop = 3' },
            { code: ap(225, 2) },
            { code: ap(225, 1) },
            { tip: 'Memory hook: offer karo, size − 1 baar ghumao.' },
            { viz: 225, ex: 0 },
          ],
        },
        {
          title: 'Part 5 — Re-solve: LC 155 Min Stack',
          blocks: [
            { p: '<b>Pattern:</b> auxiliary DS. ≤ duplicates ke liye; removed == min top → dono se pop.' },
            { pre: 'push 3, 8, 2, 5 → minStack (top first) 2, 3 → pop, pop → minStack 3' },
            { code: ap(155, 2) },
            { tip: 'Memory hook: saath me minStack, ≤ pe push, barabar pe pop.' },
            { viz: 155, ex: 0 },
          ],
        },
        {
          title: 'Part 6 — Tum: 6 implementations + complexity table',
          blocks: [
            { olist: [
              'Stack using array (push, pop, peek, isEmpty, size, isFull).',
              'Queue using array (enqueue, dequeue, peek, isEmpty, size).',
              'Circular queue (front + rear + size, ya LC 622 front + count).',
              'Stack using one queue (LC 225 Optimal).',
              'Stack using two queues (costly push + costly pop).',
              'Min stack (LC 155 two stacks).',
            ] },
            { table: { head: ['Operation', 'Complexity'], rows: [
              ['Stack push / pop / peek', 'O(1)'],
              ['Queue enqueue / dequeue / peek (circular)', 'O(1)'],
              ['Valid Parentheses', 'O(n) time, O(n) space'],
              ['Queue using Stacks — push / pop / peek', 'O(1) / amortized O(1)'],
              ['Stack using Queue — push / pop / top', 'O(n) / O(1) / O(1)'],
              ['Min Stack — all ops', 'O(1), extra O(n)'],
            ] } },
          ],
        },
        {
          title: 'Part 7 — Pattern recognition test (6)',
          blocks: [
            { qa: [
              ['"Last inserted element remove karna hai"', 'Stack'],
              ['"First inserted element remove karna hai"', 'Queue'],
              ['"Bracket matching"', 'Stack (matching pattern)'],
              ['"Minimum O(1) me chahiye"', 'Min Stack (auxiliary stack)'],
              ['"Stack implement karo queue se"', 'Rotation (simulation)'],
              ['"Queue implement karo stack se"', 'Two stacks (in / out)'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Interview mix',
          blocks: [
            { qa: [
              ['LC 20 me isEmpty peek se pehle kyun?', 'Khaali pe peek null → NPE; aur closing bina opening = invalid.'],
              ['LC 232 amortized O(1) proof?', 'Har element: 1 push in, 1 transfer, 1 pop — n ops me O(n) total.'],
              ['LC 225 me kaunsa op costly aur kyun?', 'Push (rotation) — taaki pop/top O(1).'],
              ['LC 155 me ≤ kyun?', 'Duplicate minimum.'],
              ['Circular queue me empty vs full?', 'count == 0 / count == capacity.'],
              ['Stack class ki jagah?', 'ArrayDeque.'],
            ] },
          ],
        },
        {
          title: 'Part 9 — 1-minute answers: aise bolo',
          blocks: [
            { say: [
              ['Valid Parentheses', 'Brackets close in reverse order of opening, so I push openings and, for each closing bracket, require a non-empty stack whose top matches, then pop. The string is valid if the stack is empty at the end. O(n) time and space.'],
              ['Queue using stacks', 'Push into an input stack; pop and peek from an output stack, transferring everything from input only when output is empty. Each element moves at most once, so operations are amortized O(1).'],
              ['Stack using queue', 'Offer the new element, then rotate the previous size minus one elements to the back, so the newest is at the front. Push is O(n), pop and top are O(1), with a single queue.'],
              ['Min stack', 'A second stack holds minimums: push when the value is less than or equal to its top, pop when the removed value equals its top. All operations are O(1).'],
            ] },
          ],
        },
        {
          title: 'Part 10 — Sohvi session',
          blocks: [
            { olist: [
              '<b>LC 20 independently</b> solve karo (15 min).',
              'LC 232 samjho: two stacks — costly push aur costly pop (lazy) dono ka idea bolke.',
              'LC 225: one-queue rotation ka dry run (push 1, 2, 3, pop).',
              'Pattern recognition test (Part 7) bina dekhe.',
            ] },
          ],
        },
        {
          title: 'Part 11 — Sohel (Tum) session (SDE-2 practice) + System Design session',
          blocks: [
            { olist: [
              '<b>Task A:</b> Part 6 ki 6 implementations bina notes (har ek 8–10 min).',
              '<b>Task B:</b> LC 20, 232, 225, 155 re-solve (timer 8 / 10 / 10 / 10 min).',
              '<b>Task C:</b> Complexity table zubaani.',
              '<b>System Design session (1/week):</b> "Rate limiter / message queue" — queue (FIFO) kahan aata hai, bounded queue full hone pe kya (reject / block / drop oldest = circular buffer). 30 min whiteboard.',
              SQL,
            ] },
          ],
        },
        {
          title: 'Part 12 — Homework',
          blocks: [
            { list: [
              '<b>Sohvi:</b> LC 20 solve + LC 225 / LC 232 ka dry run explain (paper pe).',
              '<b>Tum:</b> Saari 6 implementations bina notes; jahan atke, us line ko 3 baar likho.',
              'Kal (Day 49, Sunday): Mock interview — 20 / 225 / 232 / 155 / 622 + scorecard.',
            ] },
          ],
        },
        {
          title: 'Part 13 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['"((" valid?', 'false'],
              ['LC 232 Example 1 output?', '[null,null,null,1,1,false]'],
              ['LC 225: [1, 2] push 3 → queue?', '[3, 1, 2]'],
              ['LC 155: push 0, 1, 0, pop, getMin?', '0'],
              ['Circular queue k = 3, front 2, count 1 → next enQueue index?', '(2 + 1) % 3 = 0'],
            ] },
          ],
        },
      ],
      checks: [
        'Master table bina dekhe',
        'LC 20 re-solve (independently)',
        'LC 232 dono versions samjhe (costly push + lazy)',
        'LC 225 rotation dry run + two queues',
        'LC 155 re-solve',
        'Tum: 6 implementations bina notes',
        'Pattern recognition test 6/6',
      ],
      memory: 'LIFO = stack, FIFO = queue, brackets = stack, O(1) min = minStack, stack via queue = rotation, queue via stacks = in/out.',
    },

    // =====================================================================
    // DAY 49 (Sunday)
    7: {
      title: 'Week 7 Mock Interview — Stack & Queue Assessment + Contest',
      goal: 'Week 7 assessment. <b>Sohvi — 30 min</b> (concepts + LC 20). <b>Tum — 45–60 min</b>, random problems from LC 20, 225, 232, 155, 622 — requirements, DS selection, brute, optimal, code, time, space, edge cases. Phir advanced follow-ups, <b>scorecard /100</b>, aur LeetCode Weekly Contest.',
      main: null,
      parts: [
        {
          title: 'Part 0 — Mock format',
          blocks: [
            { table: { head: ['Kaun', 'Time', 'Kya', 'Rules'], rows: [
              ['Sohvi (Tum interviewer)', '30 min', 'Concepts + LC 20 (+ LC 225 concept)', 'Minimal hints; bolke socho'],
              ['Tum (Sohvi interviewer)', '45–60 min', '2–3 random: LC 20 (E), 225 (E), 232 (E), 155 (M), 622 (M)', 'Bina hints, 8-step format'],
              ['Dono', '30 min', 'Contest discussion', 'Sunday 8:00 AM IST ka LeetCode Weekly Contest'],
            ] } },
          ],
        },
        {
          title: 'Part 1 — Sohvi mock (30 min): concepts + LC 20',
          blocks: [
            { list: ['Stack kya hai? LIFO?', 'push vs pop?', 'Queue kya hai? FIFO?', 'Valid Parentheses me stack kyun?', 'Min stack ka example do.', 'Complexity: push/pop/enqueue/dequeue?'] },
            { problem: 20 },
            { olist: ['Hint 1: "Jo bracket last me khula, woh kab band hoga?"', 'Hint 2: "Pending openings kahan rakhogi?"', 'Hint 3: "Closing aaya aur kuch pending nahi — tab?"'] },
            { table: { head: ['Rubric (Sohvi)', 'Kya dekhna hai', 'Score (1–4)'], rows: [
              ['Clarify', 'Input chars, empty string, odd length', ''],
              ['Brute', 'Replace pairs idea', ''],
              ['Optimal', 'Stack + 3 conditions', ''],
              ['Code', 'Khud likha, chhote hints', ''],
              ['Test', '"([)]", "(((", ")))"', ''],
              ['Communication', 'Bolke socha', ''],
            ] } },
          ],
        },
        {
          title: 'Part 2 — Tum mock (45–60 min): 5 problem pool',
          blocks: [
            { p: 'Sohvi random 2–3 chunegi (ya chit nikaalo). Main 2 Qs (din ka plan): <b>LC 20</b> aur <b>LC 155</b>; baaki pool se.' },
            { problem: 155 },
            { problem: 622 },
            { table: { head: ['Question', 'DS selection', 'Brute', 'Optimal', 'Edge cases'], rows: [
              ['LC 20 (E)', 'Stack', 'Replace pairs O(n²)', 'Stack O(n)', '"(((", ")))", "([)]"'],
              ['LC 225 (E)', 'Queue(s)', 'Two queues, pop O(n)', 'One queue rotation, push O(n)', 'Single push, pop to empty'],
              ['LC 232 (E)', 'Two stacks', 'Costly push O(n)', 'in/out amortized O(1)', 'Interleaved push/pop'],
              ['LC 155 (M)', 'Stack + aux', 'Traverse getMin O(n)', 'minStack O(1)', 'Duplicates, INT_MIN'],
              ['LC 622 (M)', 'Array', 'Shift on deQueue O(n)', 'front + count O(1)', 'k = 1, wrap, empty Front/Rear'],
            ] } },
            { olist: [
              '<b>Requirements</b> clarify (empty pe call? capacity? duplicates?).',
              '<b>Data structure</b> selection + kyun.',
              '<b>Brute</b> + complexity.',
              '<b>Optimal</b> + bottleneck kaise hata.',
              '<b>Code</b> (poori class).',
              '<b>Time</b> complexity har op.',
              '<b>Space</b>.',
              '<b>Edge cases</b> + calls ka dry run (state har call ke baad).',
            ] },
          ],
        },
        {
          title: 'Part 3 — Advanced follow-ups (Sohvi poochegi)',
          blocks: [
            { qa: [
              ['Stack vs ArrayDeque?', 'Stack legacy + synchronized + index methods; ArrayDeque fast, LIFO-only API.'],
              ['Stack vs Queue?', 'LIFO vs FIFO; top vs front/rear.'],
              ['Stack overflow kya hai?', 'Fixed stack full pe push; JVM me call stack bhar jaana (deep recursion) → StackOverflowError.'],
              ['Recursion me stack kahan?', 'Har call ek frame (params, locals, return address) push; return pe pop.'],
              ['Monotonic stack kya hai?', 'Stack jiske elements sorted order (increasing/decreasing) me rakhe jaate hain — next greater / smaller ke liye (Week 8: LC 496, LC 739, LC 84).'],
              ['Circular queue kyun?', 'Linear array queue ki khaali jagah reuse — O(1) bina shift.'],
              ['Queue vs Deque?', 'Deque dono ends pe add/remove.'],
              ['Queue using two stacks amortized kyun?', 'Har element max ek transfer.'],
              ['BFS me queue kyun?', 'Level by level — pehle discover hua node pehle process (FIFO).'],
              ['Min stack O(1) + duplicates + single stack?', 'minStack top; ≤ se duplicates; encoded diff ya pairs se single stack.'],
            ] },
          ],
        },
        {
          title: 'Part 4 — Scorecard (/100)',
          blocks: [
            { table: { head: ['Area', 'Max', 'Score'], rows: [
              ['Concepts', '15', ''],
              ['Pattern recognition', '20', ''],
              ['Implementation', '25', ''],
              ['Complexity', '15', ''],
              ['Edge cases', '15', ''],
              ['Communication', '10', ''],
              ['<b>Total</b>', '<b>100</b>', ''],
            ] } },
            { table: { head: ['Score', 'Matlab'], rows: [
              ['90+', 'Strong — Week 8 (monotonic stack) ready'],
              ['75–89', 'Weak areas revise karo'],
              ['60–74', 'Aur coding practice chahiye'],
              ['&lt; 60', 'Week 7 repeat karo'],
            ] } },
          ],
        },
        {
          title: 'Part 5 — Interview communication checklist',
          blocks: [
            { list: [
              'Problem restate + 1–2 clarifying questions.',
              'Chhota example haath se (design problems: calls ka sequence).',
              'Brute pehle — complexity ke saath.',
              'Bottleneck naam do, phir optimal.',
              'Code karte waqt bolte raho; class ke fields pehle.',
              'Code ke baad 2 edge cases trace.',
              'Final: time + space har operation.',
            ] },
          ],
        },
        {
          title: 'Part 6 — LeetCode Weekly Contest plan + discussion template',
          blocks: [
            { list: ['Sunday 8:00 AM IST — dono join (90 min). Target: Q1 + Q2.', 'Contest ke baad: har question ka pattern naam do.', 'Jo nahi hua: editorial padho, kal 20 min upsolve.'] },
            { table: { head: ['Question', 'Pattern', 'Time liya', 'Galti', 'Seekh'], rows: [
              ['Q1', '', '', '', ''],
              ['Q2', '', '', '', ''],
              ['Q3', '', '', '', ''],
            ] } },
          ],
        },
        {
          title: 'Part 7 — Aise bolo',
          blocks: [
            { say: [
              ['Mock opening (design problem)', 'Let me restate: I need to design a class that supports push, pop, top and getMin, all in constant time. Can pop or getMin be called on an empty stack? And can values repeat? Great. Let me first describe a simple version, then improve the slow operation.'],
              ['Mock closing', 'To summarize, every operation runs in O(1) time, and the auxiliary stack uses O(n) extra space in the worst case. I tested duplicates of the minimum and popping back to the previous minimum. If you like, I can also show a single-stack version that stores differences.'],
              ['Circular queue in one minute', 'I use an array of size k with a front index and a count. Enqueue writes at front plus count mod k; dequeue advances front mod k. Count tells empty and full apart. All operations are O(1) and freed slots are reused.'],
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohvi session',
          blocks: [
            { olist: ['Mock me bolke socho — chup mat raho.', 'Interviewer ban ke Tum se 2 problems poocho + Part 3 ke follow-ups.', 'Contest Q1 try karo (30 min).'] },
          ],
        },
        {
          title: 'Part 9 — Sohel (Tum) session (SDE-2 practice)',
          blocks: [
            { olist: ['<b>Task A:</b> 2–3 random problems bina hints, 8-step format.', '<b>Task B:</b> Scorecard khud bharo — 75 se kam area ko kal 30 min.', '<b>Task C:</b> Contest Q1–Q3; Q3 upsolve kal.', SQL] },
          ],
        },
        {
          title: 'Part 10 — Week 7 final checklist + outcome',
          blocks: [
            { table: { head: ['Topic', 'Sohvi', 'Tum'], rows: [
              ['Stack fundamentals + array implementation', '✓', '✓'],
              ['LC 20', '✓', '✓'],
              ['Queue fundamentals + array implementation', '✓', '✓'],
              ['Circular queue implementation (LC 622)', '—', '✓'],
              ['LC 225', '✓', '✓'],
              ['LC 232', 'Concept', 'Implementation'],
              ['LC 155', '—', '✓'],
              ['Complexity + edge cases', '✓', '✓'],
              ['Independent coding revision', '✓', '✓'],
              ['Mock interview', '✓', '✓'],
            ] } },
            { table: { head: ['Sohvi — Week 7 ke baad', 'Tum — Week 7 ke baad'], rows: [
              ['Stack vs queue clearly', 'Stack & queue scratch se'],
              ['push / pop / enqueue / dequeue', 'Circular queue'],
              ['LC 20 independently', 'LC 20 / 225 / 232 / 155 / 622'],
              ['LC 225 / 232 simulation concept', 'Auxiliary DS trade-offs'],
            ] } },
          ],
        },
        {
          title: 'Part 11 — Homework + self-test',
          blocks: [
            { list: ['Scorecard me sabse kam wale area ko kal 30 min.', 'Week 8 preview: Monotonic Stack — LC 496, LC 739, LC 84.'] },
            { qa: [
              ['Mock me pehla kaam?', 'Clarify — operations, empty calls, constraints.'],
              ['LC 622 Rear formula?', 'arr[(front + count − 1) % k].'],
              ['LC 155 pop me kya check?', 'removed == minStack.peek().'],
              ['LC 225 one-queue push complexity?', 'O(n).'],
              ['Interviewer chup, tum atke?', 'Brute bolo, chhota example chalao, hint maango.'],
            ] },
          ],
        },
      ],
      checks: [
        'Sohvi: 30 min mock complete (rubric bhara)',
        'Tum: 2–3 random problems bina hints, 8-step format',
        'Advanced follow-ups ke jawab diye',
        'Scorecard /100 bhara',
        'Weekly Contest attempt + discussion table',
        'Week 7 final checklist dekhi',
      ],
      memory: 'Clarify → DS choose → brute → bottleneck → optimal → code → har call ka state → edge cases.',
    },
  });
})();
