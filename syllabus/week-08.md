# WEEK 8 – MONOTONIC STACK (Day 50–56) — user's syllabus (2026-11-23)

Advanced stack patterns, interview-focused; mainly Tum's SDE-2 prep, Sohvi builds pattern recognition (no Hard problems forced).
Focus: monotonic behaviour maintain karke O(n). 5 concepts: monotonic increasing stack, monotonic decreasing stack, next greater element, waiting/distance (Daily Temperatures), previous smaller + next smaller (Largest Rectangle). Day 54 pattern recognition, Day 55 revision, Day 56 mock.
Session: 9:00–9:10 previous pattern recall · 9:10–9:30 theory + modules · 9:30–9:50 pattern + visualization · 9:50–10:10 dry run · 10:10–10:25 coding · 10:25–10:30 complexity + Pattern Journal.

## DAY 50 – MONOTONIC STACK INTRODUCTION (Tum: LC 496)
Objectives: normal vs monotonic stack; increasing; decreasing; why maintain order; why pop; NGE kya; PSE kya; values vs indices.
- Normal stack: push 5,2,8,1 → top 1,8,2,5 (no order). Monotonic = stack that maintains monotonic (increasing/decreasing) order.
- Increasing (bottom→top increasing, e.g. [1,2,4,7,9]): new element se pehle larger pop. [2,4,7] + 5 → pop 7 (7>5), 4<5 stop, push → [2,4,5].
- Decreasing (e.g. [10,8,6,4,2]): [10,8,6,4] + 5 → pop 4 → push → [10,8,6,5].
- Why: brute nested loops O(n²) for next greater of 2,1,3,4,2; monotonic: each element push ≤1, pop ≤1 → O(n).
- Pattern table: next greater/smaller, previous greater/smaller, waiting for warmer day, histogram area, blocked by taller, nearest larger/smaller → monotonic stack.
- Values vs indices: values when direct comparison enough; indices for distance, previous/next position, width, duplicates, arr[index]. Rule: array problems me indices safer.
- Dry run decreasing stack 4,3,2,1 (no pops); then 5 arrives → pop 1,2,3,4, push 5 → stack [5].
- Sohvi (no mandatory LC): normal vs monotonic, increasing vs decreasing, 5 examples classify, why pop, where indices needed.
- Tum: LC 496 — statement, brute, monotonic approach, why indices/values, dry run, implement; pattern learning not speed.
- Homework: Sohvi 3 examples of increasing/decreasing stacks draw; Tum LC496 + Pattern Journal.

## DAY 51 – NEXT GREATER ELEMENT (LC 496)
Objectives: NGE concept, brute, monotonic approach, right-side traversal, pop condition, stack stores unresolved, HashMap + stack, LC496 independently.
- NGE = right side ka pehla strictly greater. [4,1,2,5,3] → [5,2,5,-1,-1] (adjacent nahi, pehla greater).
- Brute nextGreater(int[] arr): result[i] = -1; inner j from i+1, first arr[j] > arr[i] → result, break. O(n²) time, O(1) aux (output O(n)).
- Why stack (2,1,3): 2 unresolved, 1 unresolved, 3 resolves 1 then 2 → [3,3,-1].
- Why pop: arr[i] > arr[stack.peek()] → current resolves top; pop + assign; continue.
- Generic template (indices): result filled -1; for i: while (!stack.isEmpty() && arr[i] > arr[stack.peek()]) result[stack.pop()] = arr[i]; push i.
- LC 496: nums1 = [4,1,2], nums2 = [1,3,4,2] → [-1,3,-1]. 6A: process nums2, NGE map, lookup. Map 1→3, 3→4, 4→-1, 2→-1.
- 6B code: Map<Integer,Integer> map; Stack<Integer> stack; for num in nums2: while (!stack.isEmpty() && num > stack.peek()) map.put(stack.pop(), num); push num; then leftover → -1; result[i] = map.get(nums1[i]). O(n + m) time, O(n) space.
- Sohvi: NGE manually 5 arrays, brute, why pop, LC496 dry run, unresolved elements. Tum: re-solve: brute, stack + HashMap, unresolved explain, each element push/pop at most once, complexity.
- Homework: Sohvi 5 NGE examples; Tum LC496 without notes + Journal.

## DAY 52 – DAILY TEMPERATURES (LC 739)
Objectives: waiting problems, NGE connection, index difference, why values alone insufficient, stack of indices, dry run with multiple unresolved days, LC739 optimal.
- [73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]. Answer can be distance, not value.
- Brute: for i, for j>i first warmer → j - i; else 0. O(n²), output O(n).
- Clues: future event wait, next larger, distance to next larger, unresolved → NGE with distance.
- Store indices (answer j - i). Mini: [2,1,3] → 3 at idx 2 resolves idx1 then idx0 → [2,1,0].
- Full dry run table (i, temp, stack before, action): 0 push0; 1 resolve0 push1; 2 resolve1 push2; 3 push3; 4 push4; 5 resolve4,3 push5; 6 resolve5,2 push6; 7 push7 → [1,1,4,2,1,1,0,0].
- Code: Stack<Integer>; for i: while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) { int previousIndex = stack.pop(); result[previousIndex] = i - previousIndex; } push i. O(n) time/space.
- Why O(n): each index push ≤1, pop ≤1 → amortized analysis.
- Sohvi: statement, NGE connection, distance vs value, dry run 5 temps, code understand (no mandatory coding). Tum: brute, monotonic, indices, waiting distance, amortized O(n). Follow-ups: why indices? why remaining not filled explicitly? why default 0? connection with LC496?
- Homework: Sohvi 3 arrays waiting days; Tum LC739 without notes + Journal.

## DAY 53 – LARGEST RECTANGLE IN HISTOGRAM (LC 84, Hard) — boundaries before code
Objectives: histogram, area, brute, PSE, NSE, width, monotonic increasing stack, why indices, equal heights.
- [2,1,5,6,2,3], width 1 each, Area = Height × Width; e.g. 5 × 2 = 10.
- Brute: har bar = min height; expand left/right till smaller; width; area; max. O(n²).
- PSE = left nearest strictly smaller (h5 idx2 → idx1; h6 idx3 → idx2). NSE = right nearest strictly smaller (h5 idx2 → idx4).
- Width = NSE − PSE − 1 (PSE = -1 / NSE = n if none). h5: 4 − 1 − 1 = 2 → 10.
- Table: idx0 h2 PSE-1 NSE1 w1 a2; idx1 h1 -1 6 w6 a6; idx2 h5 1 4 w2 a10; idx3 h6 2 4 w1 a6; idx4 h2 1 6 w4 a8; idx5 h3 4 6 w1 a3 → max 10.
- Increasing stack of indices: smaller height resolves right boundary for waiting larger bars. [2,1,5,6]: push0; h1 pops idx0 (right boundary idx1), push1; push2; push3.
- One-pass: area when popped; PSE = stack.peek() after pop (or -1), NSE = i; width i − PSE − 1; area heights[top] × width.
- Code (USE THIS corrected version): for (i = 0; i <= n; i++) { currentHeight = (i == n) ? 0 : heights[i]; while (!stack.isEmpty() && heights[stack.peek()] > currentHeight) { heightIndex = pop; height; previousSmaller = empty ? -1 : peek; width = i − previousSmaller − 1; maxArea = max(maxArea, height * width); } if (i < n) stack.push(i); } (the user noted the earlier draft wrongly pushed the sentinel index n). O(n)/O(n).
- Equal heights [2,2,2]: `>` keeps equals until smaller/sentinel — valid for max with this width formula; separate PSE/NSE arrays must use >= vs > consistently.
- Sohvi (LC84 coding not mandatory): histogram, height/width, area, PSE, NSE, 3 small histograms manually. Tum sequence: histogram, brute, PSE, NSE, width, monotonic stack, one-pass, duplicates, complexity. Follow-ups: why indices? why width i − previousSmaller − 1? why sentinel 0? why stack increasing? two arrays PSE/NSE? why one-pass works?
- Homework: Sohvi 3 histograms; Tum LC84 both separate PSE/NSE arrays and one-pass.

## DAY 54 – PATTERN RECOGNITION (concept day, little coding)
- Identify: Stack / Queue / Monotonic Stack / HashMap / Two Pointers / Sliding Window / Linked List.
- Stack vs Queue clues: last-in-first-out → stack; FIFO → queue; nested brackets → stack; BFS → queue; undo → stack; task scheduling → queue; recursion simulation → stack.
- Normal vs monotonic clues: reverse order, matching brackets → stack; next/previous greater/smaller, nearest larger/smaller, waiting for greater, histogram, remove by comparison → monotonic stack.
- 20 identification questions: 1 valid brackets Stack · 2 undo Stack · 3 reverse string Stack · 4 next greater Monotonic · 5 next smaller Monotonic · 6 next warmer day Monotonic · 7 histogram Monotonic · 8 BFS Queue · 9 FIFO processing Queue · 10 stack using queue Simulation · 11 queue using stacks Simulation · 12 current min in stack Auxiliary Stack · 13 sliding window maximum Monotonic Deque · 14 cycle in linked list Fast & Slow · 15 middle of linked list Fast & Slow · 16 merge sorted lists Dummy Node · 17 longest substring without repetition Sliding Window · 18 Two Sum HashMap · 19 range sum queries Prefix Sum · 20 container with most water Two Pointers.
- Exercises: clue → DS → why → brute → optimal → complexity. Ex1 next larger on right: brute O(n²), monotonic O(n). Ex2 sliding window max size k: brute O(nk), monotonic deque O(n). Ex3 nested brackets: stack O(n).
- Sohvi: all 20 identify, 10 verbally, revise LC20/232/225. Tum: Pattern Journal for all 20 (clue, brute, optimal, complexity, common mistake). Homework: both journal 20 min + classify 10 more without coding.

## DAY 55 – STACK & QUEUE REVISION (Saturday) — re-solve LC 496, 739, 84, 155; Sohvi LC 20, 232, 225
- Pattern sheet: 496 next greater (values + HashMap) · 739 next greater distance (indices) · 84 previous + next smaller (indices) · circular next greater (indices) · stock span / previous greater (prices or indices) · 155 track minimum (auxiliary stack). (circular NGE and stock span are not course problems — mention only as pattern names, no LC numbers)
- Re-solve 496 (brute, monotonic, HashMap, implement, edge cases; 15 min) · 739 (waiting pattern, why indices, why current resolves earlier, implement, amortized; 20 min) · 84 (paper first on [2,1,5,6,2,3]: PSE, NSE, width, area; then implement; 30–40 min, no forced cutoff) · 155 (test push5 push3 push3 push7 getMin pop getMin pop getMin; duplicates; 15 min).
- Sohvi: LC20 independently; LC232 + LC225 dry run / explain simulation.
- Revision test (10): increasing vs decreasing; why NGE uses stack; why indices in Daily Temperatures; PSE; NSE; why width i − previousSmaller − 1; why Min Stack O(1); why stack using queue possible; why queue using stack possible; amortized O(n) meaning.
- Homework: Sohvi LC20 re-solve + explain 3 stack/queue problems; Tum 496/739/84/155 without notes + Journal.

## DAY 56 – MOCK INTERVIEW (Sunday) — Week 8 assessment
- Evaluation: pattern recognition, brute thinking, optimal, pointer/index tracking, code, complexity, edge cases, communication.
- Sohvi mock 30–40 min: A theory (LIFO, FIFO, stack ops, queue ops, stack vs queue) 10 min; B LC20 independently 15–20 min; C simulation LC232 + LC225, dry run push1 push2 push3 pop top; enqueue1 enqueue2 dequeue peek.
- Tum mock 60–75 min random: 496 (E), 739 (M), 84 (H), 155 (M).
- Mandatory framework: 1 understand (input, output, constraints, edge) · 2 brute (complexity, bottleneck) · 3 pattern (why stack, why monotonic, why indices, why auxiliary) · 4 optimal (explain before coding) · 5 dry run (input, stack, index, pop cond, push cond, output) · 6 code · 7 complexity (why O(n) with nested loops) · 8 edge cases — 496: no greater, first greater, last, single · 739: strictly increasing, strictly decreasing, equal temps, single day · 84: single bar, all equal, increasing, decreasing, zero heights, empty · 155: duplicate min, pop min, push new min, min restored.
- Scorecard /100: pattern recognition 20, brute 10, optimal 20, implementation 20, complexity 10, edge cases 10, communication 10. 90+ strong; 75–89 revise weak; 60–74 more implementation; <60 repeat days. Internal benchmarks only.

## PATTERN JOURNAL (maintain from Week 5)
Columns: Problem, Pattern, Recognition clue, Mistake, Re-solve. Examples: LC206 pointer reversal (forgot to save next, +3d) · LC141 fast & slow (loop condition, +7d) · LC496 monotonic (wrong pop condition, +3d) · LC739 monotonic (stored values not indices, +7d) · LC84 monotonic (width formula, +7d) · LC155 auxiliary stack (duplicate min, +3d).
Template fields: problem, LC number, date, difficulty, pattern, recognition clues, brute, optimal, why it works, dry run, time, space, mistakes, what I failed to recognize, edge cases, re-solve dates (+1/+3/+7/+14), solved without notes?

## OUTCOME AFTER 8 WEEKS
Sohvi: arrays basics, HashMap/HashSet, prefix basics, two pointers basics, fixed + basic variable window, linked list node/traversal/reversal/middle, stack push/pop/matching, queue FIFO + implementation concepts, beginner pattern recognition, ~25–30 LeetCode attempts; goal = understanding + independent Easy.
Tum: arrays + hashing, prefix + HashMap, two pointers both directions, sliding window fixed + variable, linked list pointers, fast & slow, dummy node, stack implementation + problems, queue implementation + simulation, monotonic stack (NGE, NSE, waiting), histogram PSE/NSE + width, ~50–60 quality LeetCode. Real benchmark = recognize, derive, implement, explain trade-offs, solve unseen variations.
