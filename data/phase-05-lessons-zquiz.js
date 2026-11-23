// Phase 5 (Stack + Queue) — Daily Quiz: har din 5 MCQ + explanation (local Day 1–14 = global Day 43–56).
// Format: [sawaal, [4 options], sahi option ka index (0–3), explanation]
(function () {
  const P = window.PHASE_CONTENT['stack-queue'];
  const Z = {
    1: [
      ['push 10, push 20, push 30, pop, peek — peek kya dega?', ['10', '20', '30', 'Error'], 1, 'pop ne 30 nikala; ab top 20. Peek remove nahi karta.'],
      ['Array stack me khaali stack ka top index?', ['0', '−1', 'capacity', 'null'], 1, 'Koi position filled nahi → −1. Isliye size = top + 1.'],
      ['Overflow condition (array stack)?', ['top == −1', 'top == capacity', 'top == capacity − 1', 'top > capacity'], 2, 'Last index (capacity − 1) bhar chuka → aur push nahi.'],
      ['push me arr[top++] = value likha (top = −1 se shuru). Kya hoga?', ['Sahi chalega', 'arr[−1] pe likhega → ArrayIndexOutOfBounds', 'Value skip hogi', 'Stack ulta ho jaayega'], 1, 'Post-increment pehle purana top (−1) use karta hai. Sahi: arr[++top].'],
      ['Java me stack ke liye recommended?', ['java.util.Stack', 'ArrayDeque', 'Vector', 'LinkedList hi'], 1, 'Stack legacy + synchronized; ArrayDeque fast aur sirf LIFO API.'],
    ],
    2: [
      ['"([)]" ka output?', ['true', 'false', 'Error', 'Depends'], 1, ') aaya tab top [ hai — order galat.'],
      ['Sirf brackets count karna kyun kaafi nahi?', ['Slow hai', 'Order nahi pakadta', 'Memory zyada', 'Kaafi hai'], 1, '"([)]" me counts barabar par order galat.'],
      ['Closing aaya aur stack khaali — kya karo?', ['Ignore', 'push karo', 'return false', 'return true'], 2, 'Closing ka koi opening pending nahi.'],
      ['"(((" kis condition se false hota hai?', ['Closing pe empty check', 'Mismatch check', 'End me stack.isEmpty() false', 'Length check'], 2, 'Loop me koi closing nahi aaya; end me 3 openings bache.'],
      ['Optimal ka time / space?', ['O(n) / O(1)', 'O(n) / O(n)', 'O(n²) / O(n)', 'O(log n) / O(n)'], 1, 'Har char ek baar; worst case sab openings stack me.'],
    ],
    3: [
      ['enqueue 10, 20, 30, dequeue, peek — peek?', ['10', '20', '30', 'Error'], 1, 'FIFO: 10 gaya, front ab 20.'],
      ['Linear array queue ki main problem?', ['Dequeue O(n)', 'Dequeue ke baad khaali jagah reuse nahi hoti', 'Peek galat', 'FIFO toot jaata hai'], 1, 'front aage badhta hai, peeche ki jagah waste → false overflow.'],
      ['LC 622 (k = 3, front = 1, count = 2) — enQueue kis index pe?', ['3', '2', '0', '1'], 2, '(1 + 2) % 3 = 0 → wrap-around.'],
      ['LC 622 Optimal me full condition?', ['front == rear', 'count == capacity', 'rear == capacity − 1', 'front == 0'], 1, 'count se empty (0) aur full (capacity) saaf alag.'],
      ['LC 232 me out stack me transfer kab?', ['Har push pe', 'Har pop pe', 'Sirf jab out khaali ho (pop/peek pe)', 'Kabhi nahi'], 2, 'Lazy transfer → har element max ek baar move → amortized O(1).'],
    ],
    4: [
      ['One queue [1, 2] me push(3) ke baad queue?', ['[1, 2, 3]', '[3, 1, 2]', '[2, 3, 1]', '[3, 2, 1]'], 1, 'offer → [1,2,3], phir 2 rotations → [3,1,2].'],
      ['push ke baad kitni rotations?', ['size', 'size − 1', '1', 'size / 2'], 1, 'Naye element ko chhod ke sab peeche bhejne hain.'],
      ['Two queues costly-pop (Brute) me top() ki complexity?', ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], 2, 'top() = pop() (O(n) shift) + push.'],
      ['One-queue Optimal me pop()?', ['queue.poll() — O(1)', 'Rotation — O(n)', 'Do queues chahiye', 'peek + remove last'], 0, 'Front pehle se newest hai.'],
      ['push 1, push 2, push 3, pop — output?', ['1', '2', '3', 'Error'], 2, 'Stack behaviour: last in, first out.'],
    ],
    5: [
      ['push −2, 0, −3 ke baad getMin?', ['−2', '0', '−3', '−5'], 2, 'Sabse chhota −3.'],
      ['minStack me push condition?', ['val < minStack.peek()', 'minStack.isEmpty() || val <= minStack.peek()', 'val > minStack.peek()', 'Har baar push'], 1, '≤ — duplicate minimums bhi record.'],
      ['push 2, push 2 ke saath < use kiya, phir pop — getMin?', ['2', 'Galat / crash (minStack khaali)', '0', 'Integer.MAX_VALUE'], 1, 'minStack me sirf ek 2 tha; pehla pop use hata deta hai jabki stack me 2 bacha hai.'],
      ['Brute (traverse) me getMin ki complexity?', ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], 2, 'Har call pe poora stack scan.'],
      ['Integer a, b; a == b kab galat ho sakta hai?', ['Kabhi nahi', '−128..127 ke bahar values pe', 'Sirf negative pe', 'Sirf 0 pe'], 1, 'Integer cache sirf −128..127; bahar reference compare false. Isliye int removed.'],
    ],
    6: [
      ['"First inserted element remove karna hai" — kaunsa DS?', ['Stack', 'Queue', 'Min Stack', 'Heap'], 1, 'FIFO = queue.'],
      ['"Queue implement karo stacks se" — pattern?', ['Rotation', 'Two stacks (in / out)', 'Circular array', 'Auxiliary min'], 1, 'Do baar ulta = seedha.'],
      ['LC 232 Optimal ka pop complexity?', ['O(n) hamesha', 'Amortized O(1)', 'O(log n)', 'O(1) worst case'], 1, 'Kabhi-kabhi O(n) transfer, average O(1).'],
      ['Stack using one queue — push / pop?', ['O(1) / O(1)', 'O(n) / O(1)', 'O(1) / O(n)', 'O(n) / O(n)'], 1, 'Push pe rotation, pop sirf poll.'],
      ['Circular queue me "empty" kaise pehchanoge (count wala design)?', ['front == rear', 'count == 0', 'rear == −1 hamesha', 'arr[front] == 0'], 1, 'Value 0 bhi valid ho sakti hai; count hi bharosemand.'],
    ],
    7: [
      ['Mock me sabse pehla step?', ['Code likhna', 'Clarify requirements', 'Complexity bolna', 'Edge cases'], 1, 'Operations, empty calls, constraints pehle confirm.'],
      ['LC 622 Rear() formula (front + count)?', ['arr[front + count]', 'arr[(front + count − 1) % k]', 'arr[count − 1]', 'arr[(front − 1) % k]'], 1, 'Last element front se count − 1 aage, modulo ke saath.'],
      ['BFS me queue kyun?', ['Fast hai', 'Pehle discover hua node pehle process (level order)', 'Recursion bachane ke liye', 'Sorting ke liye'], 1, 'FIFO = level by level.'],
      ['Monotonic stack kya hai?', ['Sirf ek type ke elements', 'Elements sorted order (inc/dec) me rakhe jaate hain', 'Fixed size stack', 'Thread-safe stack'], 1, 'Next greater / smaller ke liye — Week 8.'],
      ['Scorecard 60–74 ka matlab?', ['Strong', 'Weak areas revise', 'Aur coding practice chahiye', 'Week repeat'], 2, '90+ strong, 75–89 revise, 60–74 practice, < 60 repeat.'],
    ],
    // ---- Week 8 (local Day 8–14 = global Day 50–56) ----
    8: [
      ['Increasing stack [2, 4, 7] me 5 push karne ke baad?', ['[2, 4, 7, 5]', '[2, 4, 5]', '[5]', '[2, 5]'], 1, '7 > 5 pop, 4 < 5 ruko, push 5.'],
      ['Decreasing stack [10, 8, 6, 4] me 5 push karne ke baad?', ['[10, 8, 6, 5]', '[10, 8, 6, 4, 5]', '[10, 5]', '[5]'], 0, '4 < 5 pop, 6 > 5 ruko, push 5.'],
      ['Next greater ke liye kaunsa monotonic stack?', ['Increasing', 'Decreasing', 'Koi bhi', 'Queue'], 1, 'Bada aaya → chhote pop (unka next greater yahi).'],
      ['Monotonic stack while-inside-for ke bawajood O(n) kyun?', ['Stack chhota rehta hai', 'Har element ek push, max ek pop', 'Input sorted hota hai', 'Ye O(n log n) hai'], 1, 'Total pops ≤ n — amortized.'],
      ['Distance / width chahiye toh stack me kya rakho?', ['Values', 'Indices', 'Booleans', 'Kuch nahi'], 1, 'Index se position bhi milti hai aur value bhi.'],
    ],
    9: [
      ['[4, 1, 2, 5, 3] ka NGE?', ['[5, 2, 5, −1, −1]', '[1, 2, 5, 3, −1]', '[5, 5, 5, −1, −1]', '[−1, 2, 5, −1, −1]'], 0, '4 ka pehla bada 5 (1, 2 chhote), 1 ka 2, 2 ka 5.'],
      ['NGE stack me kaun rehta hai?', ['Resolved elements', 'Un-resolved elements (answer abhi nahi mila)', 'Sirf maximum', 'Sab elements'], 1, 'Naya element unhe resolve karta hai.'],
      ['Pop condition (next greater)?', ['arr[i] < top', 'arr[i] > top (strictly)', 'arr[i] == top', 'Hamesha pop'], 1, 'Strictly greater hi next greater.'],
      ['LC 496 me leftover elements ka answer?', ['0', '−1', 'Khud ki value', 'Last element'], 1, 'Right me koi bada nahi mila.'],
      ['LC 496 stack + HashMap ka time?', ['O(m · n)', 'O(n + m)', 'O(n log n)', 'O(n²)'], 1, 'nums2 ek pass + nums1 lookups.'],
    ],
    10: [
      ['[73, 74, 75, 71, 69, 72, 76, 73] → ?', ['[1, 1, 4, 2, 1, 1, 0, 0]', '[1, 1, 4, 2, 1, 1, 1, 0]', '[1, 1, 1, 2, 1, 1, 0, 0]', '[74, 75, 76, 72, 72, 76, 0, 0]'], 0, 'Answer distance hai, value nahi.'],
      ['Daily Temperatures me indices kyun?', ['Fast hai', 'Answer distance (i − previousIndex) hai', 'Values duplicate nahi hote', 'Memory kam'], 1, 'Value se position nahi milti.'],
      ['Bache hue din (stack me) ka answer?', ['−1', '0 (default)', 'n', 'Last index'], 1, 'int[] default 0 — explicit fill ki zarurat nahi.'],
      ['Equal temperatures [50, 50, 50] → ?', ['[1, 1, 0]', '[0, 0, 0]', '[2, 1, 0]', '[1, 0, 0]'], 1, 'Strictly warmer chahiye — > use karo.'],
      ['i = 5 (72) pe kaunse din resolve hote hain?', ['Sirf 4', '4 aur 3', '4, 3, 2', 'Koi nahi'], 1, '72 > 69 (din 4) aur 72 > 71 (din 3); 75 (din 2) bada hai.'],
    ],
    11: [
      ['[2, 1, 5, 6, 2, 3] ka largest rectangle?', ['10', '12', '8', '6'], 0, 'Height 5 × width 2.'],
      ['Width formula (one pass)?', ['i − previousSmaller', 'i − previousSmaller − 1', 'i − previousSmaller + 1', 'nse + pse'], 1, 'Bar PSE+1 se i−1 tak fail sakta hai.'],
      ['PSE na mile toh kya maante hain?', ['0', '−1', 'n', 'i'], 1, 'Left me koi chhota nahi → boundary −1.'],
      ['One-pass me sentinel index n kyun push nahi karte?', ['Speed', 'Woh asli bar nahi — heights[n] out of bounds', 'Stack full ho jaayega', 'Width galat aayegi'], 1, 'User ka corrected code: if (i < n) stack.push(i).'],
      ['LC 84 me kaunsa stack?', ['Decreasing', 'Increasing (indices)', 'Normal', 'Queue'], 1, 'Chhota height aaya → bade bars ka right boundary mil gaya.'],
    ],
    12: [
      ['"Next warmer day" — pattern?', ['Queue', 'Monotonic stack', 'Two pointers', 'HashMap'], 1, 'Waiting for greater = next greater.'],
      ['"BFS / level order" — DS?', ['Stack', 'Queue', 'Monotonic stack', 'Heap'], 1, 'FIFO = level by level.'],
      ['"Sliding window maximum" — pattern?', ['Monotonic deque', 'Min stack', 'Prefix sum', 'Fast & slow'], 0, 'Dono ends se hatana padta hai — deque.'],
      ['"Current minimum in a stack" — pattern?', ['Monotonic stack', 'Auxiliary stack', 'Queue', 'Two pointers'], 1, 'LC 155.'],
      ['"Undo feature" — DS?', ['Queue', 'Stack', 'HashMap', 'Deque'], 1, 'Last action pehle undo — LIFO.'],
    ],
    13: [
      ['LC 496 stack me kya store karta hai?', ['Indices', 'Values (+ HashMap)', 'Distances', 'Booleans'], 1, 'Values distinct, distance nahi chahiye.'],
      ['Min stack: push 5, 3, 3, 7, pop, pop → getMin?', ['5', '3', '7', 'Error'], 1, 'Doosra 3 abhi bhi hai — ≤ ki wajah se minStack me bhi.'],
      ['"Stock span" kis pattern ka example hai?', ['Next greater', 'Previous greater (monotonic stack)', 'Sliding window', 'Two pointers'], 1, 'Peeche ka nearest bada dhundhna.'],
      ['Amortized O(n) ka matlab?', ['Har step O(1)', 'Poore run ka total kaam O(n)', 'Average case', 'Best case'], 1, 'Kuch steps mehnge, total linear.'],
      ['LC 84 PSE/NSE arrays version ka space?', ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], 1, 'Do arrays + stack.'],
    ],
    14: [
      ['8-step framework ka step 2?', ['Code', 'Brute force + bottleneck', 'Edge cases', 'Dry run'], 1, 'Understand → brute → pattern → optimal → dry run → code → complexity → edge cases.'],
      ['LC 84 [5, 4, 3, 2, 1] → ?', ['5', '9', '15', '6'], 1, 'Height 3 × width 3 = 9.'],
      ['LC 739 strictly decreasing temps → ?', ['Sab 1', 'Sab 0', 'n, n−1, …', '−1'], 1, 'Koi garam din nahi.'],
      ['LC 155 "min restored" kab hota hai?', ['Har push pe', 'Jab removed == minStack top pe minStack pop', 'getMin pe', 'Kabhi nahi'], 1, 'Pichla min top pe aa jaata hai.'],
      ['Scorecard me sabse zyada weight (Week 8)?', ['Communication', 'Pattern recognition / Optimal / Implementation (20 each)', 'Edge cases', 'Brute'], 1, 'Pattern 20, optimal 20, implementation 20.'],
    ],
  };
  Object.keys(Z).forEach(d => {
    if (P.lessons && P.lessons[d]) P.lessons[d].quiz = Z[d].map(([q, opts, ans, why]) => ({ q, opts, ans, why }));
  });
})();
