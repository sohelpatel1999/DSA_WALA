# WEEK 7 – STACK & QUEUE FOUNDATIONS (Day 43–49) — user's syllabus (2026-11-22)

SDE-2 Backend Preparation. Objective: Stack aur Queue ke fundamentals se implementation, pattern recognition aur interview-level problem solving.
5 concepts: 1) Stack – LIFO 2) Parentheses Matching – Stack Pattern 3) Queue – FIFO 4) Stack using Queue – Data Structure Simulation 5) Min Stack – Auxiliary Data Structure.
Sohvi: fundamentals, visualization, dry run, Easy implementation. Tum: DS implementation from scratch, complexity, edge cases, optimal solutions, interview follow-ups.

Session 9:00–10:30 PM: 9:00–9:10 previous day revision · 9:10–9:30 theory + concepts · 9:30–9:50 patterns + visualization · 9:50–10:05 dry run · 10:05–10:25 individual coding · 10:25–10:30 complexity + homework.

## DAY 43 – STACK BASICS (Foundation 1: LIFO)
Objectives: stack kya hai, real-world use, LIFO, push/pop/peek, top pointer/index, overflow/underflow, array implementation, complexity.
- Module 1: LIFO — plates example (Plate 1..4 rakhi, pehle Plate 4 niklegi).
- Module 2 terminology (diagram TOP → 5,4,3,2): Top = last inserted; Push insert; Pop remove top; Peek see top; isEmpty; isFull (fixed capacity); Size.
- Module 3 operations trace: [] → push10 → push20 → push30 → pop (30 out) → peek = 20 (peek remove nahi karta).
- Module 4 array stack (Java):
```
class MyStack {
    private int[] arr; private int top; private int capacity;
    MyStack(int size) { arr = new int[size]; capacity = size; top = -1; }
    void push(int value) { if (top == capacity - 1) throw new RuntimeException("Stack Overflow"); arr[++top] = value; }
    int pop() { if (top == -1) throw new RuntimeException("Stack Underflow"); return arr[top--]; }
    int peek() { if (top == -1) throw new RuntimeException("Stack is Empty"); return arr[top]; }
    boolean isEmpty() { return top == -1; }
    int size() { return top + 1; }
}
```
- Module 5 complexity: push/pop/peek/isEmpty/size O(1); fixed array space O(capacity); dynamic array push amortized O(1).
- Module 6 overflow (capacity 3, push 40 → overflow) vs underflow (pop on empty).
- Sohvi: LIFO explain, push/pop/peek identify, 5 ops dry run, array stack code samjho; LC 20 statement read (solve Day 44).
- Tum: array stack with push, pop, peek, isEmpty, size, isFull, display; same ops with java.util.Stack; ArrayDeque as alternative. Interview Qs: Stack kya hai? LIFO vs FIFO? Push/Pop O(1) kyun? Overflow/Underflow? Stack thread-safe? Array vs Linked List implementation?
- Homework: Sohvi 10 ops dry run; Tum stack blank editor me bina notes, empty/full cases test.

## DAY 44 – VALID PARENTHESES (Pattern 2: Matching Pairs using Stack) — LC 20
Objectives: matching problem, opening vs closing, stack kyun, pair identify, wrong order detect, empty stack condition, valid vs invalid, O(n).
- Valid: (), {}, [], ({[]}). Invalid: (], ([)], (((. Counting enough nahi — ([)] counts equal, order galat.
- Why stack: last opened pehle close → LIFO. ({[]}): ( { [ open, ] } ) close.
- Algorithm 9 steps: empty stack; har char; opening → push; closing → stack empty? → invalid; top match? → pop; else invalid; end me stack empty hona chahiye.
- Matching table ) ↔ (, } ↔ {, ] ↔ [. Dry run "{[]}": { push, [ push, ] match pop, } match pop → valid.
- Java (Stack<Character>, opening push, else empty check, peek, match → pop else false, return stack.isEmpty()). Production: ArrayDeque<Character>.
- Complexity O(n) time, O(n) space (worst: sab opening).
- Edge cases: () true; ()[]{} true; {[]} true; (] false; ([)] false; ((( false; ))) false; "" true.
- Sohvi: steps 1–5, line-by-line explain. Tum: without hints; Stack vs ArrayDeque; switch matching; why counting fails; why isEmpty before peek; follow-ups: O(1) extra space possible? why O(n) stack for arbitrary nesting? parser me validation?
- Homework: Sohvi 10 valid/invalid examples manually; Tum LC20 with ArrayDeque + har condition explain.

## DAY 45 – QUEUE BASICS (Foundation 3: FIFO) — LC 232 statement (Sohvi), LC 622 (Tum, recommended)
Objectives: queue kya, FIFO, front/rear, enqueue/dequeue, array queue, linear queue limitation, circular queue intro, queue vs stack.
- Ticket counter example. Terminology: Front first, Rear last, Enqueue at rear, Dequeue from front, Peek front, isEmpty, Size.
- Trace: [] → enq10 → enq20 → enq30 → deq (10) → peek 20.
- Linear array queue (front = 0, rear = -1; enqueue arr[++rear] with overflow check rear == capacity-1; dequeue arr[front++] with underflow front > rear; peek; isEmpty front > rear).
- Limitation: freed positions reuse nahi hoti → circular queue: rear = (rear + 1) % capacity, front similarly.
- Stack vs Queue table (LIFO/FIFO, top vs rear/front, push/pop vs enqueue/dequeue, undo vs task scheduling).
- Complexity: enqueue/dequeue/peek/isEmpty O(1) (circular array or linked list).
- Sohvi: FIFO, front/rear, enqueue/dequeue dry run, stack vs queue; LC 232 statement read.
- Tum: array queue (enqueue, dequeue, peek, isEmpty, size) + circular queue; LC 622 Design Circular Queue. Follow-ups: linear queue limitation; circular queue space reuse; front/rear purpose; queue using linked list; queue vs deque.
- Homework: Sohvi 10 queue ops dry run; Tum linear + circular queue, full/empty conditions explain.

## DAY 46 – STACK USING QUEUES (Pattern 4: Data Structure Simulation) — LC 225
- Two queues (costly push): new → q2, q1 sab q2 me, swap. Trace push1, push2 → q1 = [2, 1]; pop → 2.
- Complexity two queues costly push: push O(n), pop/top/empty O(1).
- One queue: offer x, rotate size-1 times. Trace [1,2] push3 → [1,2,3] → [2,3,1] → [3,1,2].
- Java one-queue MyStack (Queue<Integer> = new LinkedList; push offer + rotate; pop poll; top peek; empty isEmpty).
- Comparison: two queues costly push O(n)/O(1)/O(1); one queue costly push same; two queues costly pop O(1)/O(n)/O(n).
- Sohvi: statement, queue vs stack, one-queue rotation dry run, predict push1 push2 push3 pop.
- Tum: two queues, one queue, costly push, costly pop. Interview: why rotate? one queue possible? which op optimizing? complexity each? why "simulation"?
- Homework: Sohvi LC225 dry run; Tum one + two queue implementations blank editor + trade-off.

## DAY 47 – MIN STACK (Pattern 5: Auxiliary Data Structure) — LC 155
- Problem: stack 3,8,2,5 → min 2; push1 → min 1; pop → min 2. Har baar traverse inefficient.
- Brute: normal stack + getMin traverse O(n) (push/pop/top O(1)).
- Auxiliary min stack table: push3 (3 | 3), push8 (8,3 | 3), push2 (2,8,3 | 2,3), push5 (5,2,8,3 | 2,3), pop (2,8,3 | 2,3), pop (8,3 | 3). Equal minimum bhi push karo (duplicates).
- Java LC 155 two stacks: push → stack.push; if minStack empty || val <= minStack.peek() → minStack.push; pop → removed == minStack.peek() → minStack.pop; top; getMin.
- Complexity all O(1), extra O(n). Edge: push2 push2 push3 pop getMin → 2; `<=` important (with `<` duplicate pop breaks).
- Optimized alternative: single stack with encoded values (advanced; pehle two-stack master karo).
- Sohvi: min change, auxiliary purpose, dry run, duplicate case (conceptual). Tum: brute, two-stack optimal, duplicates, empty conditions per API, single-stack encoded follow-up. Interview: why getMin O(1)? why auxiliary? duplicates? one stack? space?
- Homework: Sohvi 10-op dry run; Tum getMin O(1) explain + LC155 without notes.

## DAY 48 – STACK & QUEUE REVISION (Saturday)
- Master table: Stack LIFO push/pop; Valid Parentheses matching push/pop; Queue FIFO enqueue/dequeue; Stack using Queue simulation rotation; Min Stack auxiliary.
- Sohvi: LC20 independently; LC232 understand (two stacks costly push + costly pop) — note LC232 ≠ array queue; LC225 one-queue rotation.
- Tum: independently implement stack (array), queue (array), circular queue, stack using one queue, stack using two queues, min stack.
- Complexity table incl. Queue using Stacks enqueue amortized O(1), Stack using Queue push O(n).
- Pattern recognition test (6): last inserted remove → Stack; first inserted → Queue; bracket matching → Stack; O(1) min → Min Stack; stack via queue → rotation; queue via stack → two stacks.
- Homework: Sohvi LC20 + LC225/LC232 dry runs explain; Tum all six implementations without notes.

## DAY 49 – MOCK INTERVIEW (Sunday) — Week 7 assessment
- Sohvi mock 30 min (stack, valid parentheses, queue, stack using queue, min stack, complexity) — Qs: stack? LIFO? push vs pop? queue? FIFO? parentheses me stack kyun? min stack example.
- Tum mock 45–60 min random from: LC 20 (E), 225 (E), 232 (E), 155 (M), 622 (M). For each: requirements, DS selection, brute, optimal, code, time, space, edge cases.
- Advanced follow-ups: Stack vs ArrayDeque, Stack vs Queue, stack overflow, recursion me stack, monotonic stack kya; circular queue kyun, queue vs deque, queue using two stacks amortized, BFS me queue kyun; min stack O(1), duplicates, single-stack encoding.
- Scorecard /100: concepts 15, pattern recognition 20, implementation 25, complexity 15, edge cases 15, communication 10. 90+ strong; 75–89 revise weak; 60–74 more coding; <60 repeat week.

## Final checklist (10): stack fundamentals + array impl (both) · LC20 (both) · queue fundamentals + array impl (both) · circular queue impl (Tum) · LC225 (both) · LC232 (Sohvi concept, Tum impl) · LC155 (Tum) · complexity + edge cases (both) · independent coding revision (both) · mock (both).
Outcome — Sohvi: stack vs queue, push/pop/enqueue/dequeue, LC20 independently, LC225/232 simulation concepts. Tum: stack & queue from scratch, circular queue, LC20/225/232/155, auxiliary DS trade-offs.
