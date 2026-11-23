// Phase 4 (Linked List) — Daily Quiz: har din 5 MCQ + explanation (local Day 1–14 = global Day 29–42).
// Format: [sawaal, [4 options], sahi option ka index (0–3), explanation]
(function () {
  const P = window.PHASE_CONTENT['linked-list'];
  const Z = {
    1: [
      ['Last node ka next kya hota hai?', ['head', 'null', 'khud', 'pichla node'], 1, 'null = list yahan khatam.'],
      ['Linked list me i-th element tak pahunchna?', ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], 2, 'Nodes continuous nahi — head se i steps chalna padta hai.'],
      ['insertAtHead ka sahi order?', ['head = node; node.next = head', 'node.next = head; head = node', 'head.next = node', 'node = head'], 1, 'Pehle naye node ko purane head se jodo, phir head badlo — warna list kho jaayegi.'],
      ['Traversal me current = current.next bhool gaye toh?', ['List ulti ho jaayegi', 'Infinite loop', 'NullPointerException', 'Kuch nahi'], 1, 'current hamesha head pe rahega, condition kabhi false nahi hogi.'],
      ['Tail pointer wali list me tail node delete kiya — kya update zaroori?', ['head', 'tail = prev', 'size = 0', 'Kuch nahi'], 1, 'Warna tail deleted node pe atka rahega aur agla insertAtTail galat jagah judega.'],
    ],
    2: [
      ['Iterative reverse me prev kis se shuru?', ['head', 'null', 'head.next', 'tail'], 1, 'Purana head naya tail banega — uska next null hona chahiye.'],
      ['S-R-P-C ka pehla step?', ['current.next = prev', 'next = current.next (save)', 'prev = current', 'current = next'], 1, 'Link todne se pehle aage ka raasta save karo.'],
      ['Loop ke baad kya return karte hain?', ['head', 'prev', 'current', 'next'], 1, 'current null ho chuka; prev naya head hai.'],
      ['10 → 20 → 30: iteration 1 ke baad prev, current?', ['null, 10', '10, 20', '20, 30', '10, 30'], 1, '10.next = null, prev = 10, current = 20.'],
      ['Iterative reverse ka extra space?', ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], 1, 'Sirf 3 pointers — naye nodes nahi bane.'],
    ],
    3: [
      ['Recursive reverse ka base case?', ['head == null', 'head == null || head.next == null', 'head.next == null', 'size == 0'], 1, '0 ya 1 node — already ulti list.'],
      ['Unwinding me head.next = null bhool gaye toh?', ['Kuch nahi', '1 ⇄ 2 cycle ban jaati hai', 'NullPointerException', 'List khaali ho jaati hai'], 1, 'Purana forward link reh jaata hai → do nodes ek doosre ko point karte hain.'],
      ['Recursive reverse ka space?', ['O(1)', 'O(n) call stack', 'O(log n)', 'O(n²)'], 1, 'Har node ke liye ek stack frame.'],
      ['1 → 2 → 3 → 4 iterative: step 2 ke baad prev, current?', ['1, 2', '2, 3', '3, 4', '2, 4'], 1, 'Step 1: prev 1, current 2. Step 2: prev 2, current 3.'],
      ['newHead har recursive frame me kya hota hai?', ['Us frame ka head', 'Original last node (har jagah same)', 'null', 'Pichla node'], 1, 'Base case se aaya last node hi upar tak pass hota hai.'],
    ],
    4: [
      ['[1, 2, 3, 4] (LC 876) ka middle?', ['2', '3', '4', '1'], 1, 'Even length → second middle.'],
      ['Slow/fast loop ki sahi condition?', ['fast != null', 'fast.next != null && fast != null', 'fast != null && fast.next != null', 'slow != fast'], 2, 'Order important: pehle fast != null — short-circuit se NPE nahi aata.'],
      ['[1..7] ka middle?', ['3', '4', '5', '6'], 1, 'Odd length → exact middle 4.'],
      ['First middle chahiye toh condition?', ['fast != null && fast.next != null', 'fast.next != null && fast.next.next != null', 'slow.next != null', 'fast == null'], 1, 'Fast ko ek step pehle rok do — LC 143 me yahi chahiye.'],
      ['Slow/fast O(n) kyun jabki fast 2 step chalta hai?', ['Asal me O(1) hai', '~n/2 iterations, har ek O(1)', 'O(log n) hai', 'Recursion ki wajah se'], 1, 'Linear hi hai — fark bas ek pass ka.'],
    ],
    5: [
      ['[1, 3, 5] + [2, 4, 6] merge?', ['[1,2,3,4,5,6]', '[1,3,5,2,4,6]', '[2,4,6,1,3,5]', '[6,5,4,3,2,1]'], 0, 'Har step chhota front node.'],
      ['Dummy node ke saath kya return karte hain?', ['dummy', 'dummy.next', 'tail', 'list1'], 1, 'Dummy nakli shuruaat hai — asli head uske baad.'],
      ['Loop ke baad bachi list ka kya karte hain?', ['Ek-ek karke jodo', 'tail.next = bachi list (ek baar)', 'Sort karo', 'Chhod do'], 1, 'Woh already sorted hai aur sab bade — ek link kaafi.'],
      ['Iterative merge ka auxiliary space?', ['O(n + m)', 'O(1)', 'O(log n)', 'O(n)'], 1, 'Existing nodes relink — naya sirf dummy.'],
      ['<= ki jagah < likha toh [1] + [1] pe?', ['Answer galat', 'Answer sahi, bas list2 ka 1 pehle aayega', 'Crash', 'Infinite loop'], 1, 'Merge sahi rehta hai; sirf stable order (list1 pehle) badal jaata hai.'],
    ],
    6: [
      ['"Reverse a list" — pattern?', ['Fast & slow', 'Three pointers', 'Dummy node', 'HashSet'], 1, 'prev / current / next.'],
      ['"Find middle" — pattern?', ['Fast & slow', 'Dummy node', 'Three pointers', 'Traversal'], 0, 'Fast end pe → slow beech me.'],
      ['"Merge sorted lists" — pattern?', ['Fast & slow', 'Dummy node + tail', 'Sirf recursion', 'HashMap'], 1, 'Head ka special case khatam.'],
      ['[1, 2, 3] reverse?', ['[1,2,3]', '[3,2,1]', '[2,1,3]', '[3,1,2]'], 1, 'Links ulte → 3 → 2 → 1.'],
      ['Har linked list problem ke 3 edge cases?', ['Empty, 1 node, 2 nodes', 'Sorted, unsorted, negative', 'Cycle, no cycle, tail', 'Head, tail, middle'], 0, 'Inhi pe zyada bugs aate hain.'],
    ],
    7: [
      ['LC 206 iterative kya return karta hai?', ['head', 'prev', 'current', 'null'], 1, 'Loop ke baad prev naya head.'],
      ['LC 876 even length me kaunsa middle?', ['First middle', 'Second middle', 'null', 'Last node'], 1, '[1,2,3,4] → 3.'],
      ['LC 21 (iterative) ka auxiliary space?', ['O(1)', 'O(n + m)', 'O(n)', 'O(log n)'], 0, 'Sirf dummy + tail.'],
      ['Mock interview me sabse pehla kaam?', ['Code', 'Clarify', 'Complexity', 'Dry run'], 1, 'Input, output, edge cases pakke karo.'],
      ['Production me reverse — recursive ya iterative?', ['Recursive', 'Iterative (O(1) space, stack overflow nahi)', 'Dono same', 'Koi nahi'], 1, 'Java me lambi list pe recursive StackOverflowError de sakta hai.'],
    ],
    8: [
      ['1→2→3→4→5, 5.next = 3: slow/fast collision kahan?', ['3', '4', '5', '2'], 1, '(1,1) (2,3) (3,5) (4,4) → node 4.'],
      ['HashSet approach ka space?', ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], 1, 'Har visited node store hota hai.'],
      ['Fast aur slow ek doosre ko miss kyun nahi karte?', ['Luck se', 'Relative speed 1 — gap har step 1 ghatta hai', 'Fast 3 step chalta hai', 'HashSet ki wajah se'], 1, 'Gap 1-1 ghatta hai, 0 kood ke nahi nikal sakta.'],
      ['slow == fast me kya compare hota hai?', ['Values', 'Node references', 'Indices', 'next pointers'], 1, 'Values compare kiye toh duplicate values galat "cycle" bata dengi.'],
      ['Self-loop [1], pos 0 (LC 141) ka answer?', ['false', 'true', 'null', 'Error'], 1, 'slow = 1, fast = 1.next.next = 1 → milte hain.'],
    ],
    9: [
      ['Cycle length L = ?', ['a + b', 'b + c', 'a + c', 'a + b + c'], 1, 'Start → meeting (b) + meeting → start (c).'],
      ['Floyd ki final equation?', ['a = b', 'a = (k − 1)L + c', 'a = kL + b', 'b = c'], 1, 'Head se start ki doori = meeting se start ki doori + poore chakkar.'],
      ['[3, 2, 0, −4], pos 1: meeting point aur cycle start?', ['−4 aur 2', '0 aur 3', '2 aur −4', '−4 aur 3'], 0, 'Phase 1 meet −4 pe; Phase 2: 3→2, −4→2 → start 2.'],
      ['Phase 2 me dono pointers ki speed?', ['1 aur 2', 'Dono 1', 'Dono 2', '2 aur 1'], 1, 'Math 1-1 step pe based hai.'],
      ['Cycle head se shuru ho (a = 0) toh Phase 2 ka loop?', ['n baar', 'Ek baar bhi nahi — meeting point hi head', 'Infinite', '2 baar'], 1, 'slow = head aur fast already head pe → seedha return.'],
    ],
    10: [
      ['[1,2,3,4,5], n = 2 (LC 19) output?', ['[1,2,3,5]', '[1,2,4,5]', '[1,2,3,4]', '[2,3,4,5]'], 0, 'End se 2nd = node 4 hata.'],
      ['Fast ko dummy se kitne steps aage bhejte hain?', ['n − 1', 'n', 'n + 1', '2n'], 2, 'Taaki fast null pe ho tab slow target se ek pehle ho.'],
      ['Dummy node kyun?', ['Speed', 'Head delete ka case bhi normal ho jaaye', 'Cycle detect', 'Memory'], 1, 'Head ka bhi ek previous node mil jaata hai.'],
      ['[1], n = 1 output?', ['[1]', '[]', 'Error', '[0]'], 1, 'Dummy ki wajah se list khaali ho jaati hai, crash nahi.'],
      ['dummy.next ki jagah head return kiya — kab galat?', ['Kabhi nahi', 'Jab head hi delete hua', 'Jab n = 1', 'Hamesha'], 1, 'Deleted head lautega.'],
    ],
    11: [
      ['[1,2,3,4,5] reorder?', ['[1,5,2,4,3]', '[5,4,3,2,1]', '[1,2,5,4,3]', '[1,3,5,2,4]'], 0, 'L0, Ln, L1, Ln−1, …'],
      ['Second half reverse kyun karte hain?', ['Speed', 'End ke nodes ulte order me chahiye, singly list peeche nahi jaati', 'Sorting', 'Memory'], 1, 'Reverse ke baad back half aage se chal sakti hai.'],
      ['slow.next = null bhool gaye toh?', ['Kuch nahi', 'Cycle ban sakti hai', 'NullPointerException', 'List khaali'], 1, 'First half second half se juda reh jaata hai.'],
      ['[1..6] reorder?', ['[1,6,2,5,3,4]', '[1,2,3,6,5,4]', '[6,1,5,2,4,3]', '[1,4,2,5,3,6]'], 0, 'First [1,2,3], reversed second [6,5,4] → weave.'],
      ['Middle (first half ka end) ki condition?', ['fast != null && fast.next != null', 'fast.next != null && fast.next.next != null', 'slow != null', 'fast == null'], 1, 'First middle — taaki first half ≥ second half.'],
    ],
    12: [
      ['[1..5], k = 3?', ['[3,2,1,5,4]', '[3,2,1,4,5]', '[1,2,3,4,5]', '[5,4,3,2,1]'], 1, 'Adhoora group (4, 5) waisa hi.'],
      ['Group reverse me prev kis se shuru?', ['null', 'groupNext', 'groupPrev', 'kth'], 1, 'Reversed group apne aap agle group se jud jaata hai.'],
      ['Group jodne ke baad groupPrev kahan jaata hai?', ['kth', 'Purana first node (ab group ka end)', 'groupNext', 'dummy'], 1, 'Agle round ke liye pichle group ka end.'],
      ['[1..7], k = 3?', ['[3,2,1,6,5,4,7]', '[3,2,1,7,6,5,4]', '[7,6,5,4,3,2,1]', '[1,2,3,4,5,6,7]'], 0, 'Do poore group ulte, 7 akela.'],
      ['Iterative version ka extra space?', ['O(n)', 'O(1)', 'O(n/k)', 'O(k)'], 1, 'Sirf kuch pointers (recursive me O(n/k) stack).'],
    ],
    13: [
      ['"Loop hai ya nahi?" — pattern?', ['Gap technique', 'Fast & slow', 'Dummy', 'Group reversal'], 1, 'Floyd.'],
      ['"End se nth delete" — pattern?', ['Gap technique + dummy', 'Fast & slow', 'Sorting', 'Recursion'], 0, 'Fast n+1 aage, phir saath.'],
      ['"First aur last alternate" — pattern?', ['Kadane', 'Middle + reverse + merge', 'HashSet', 'Gap'], 1, 'LC 143.'],
      ['[1,2,3,4,5], n = 5 (LC 19)?', ['[2,3,4,5]', '[1,2,3,4]', '[]', '[1,2,3,5]'], 0, 'n = length → head delete.'],
      ['Self-loop [1], pos 0 pe LC 142?', ['null', 'Node 1', 'Error', 'Node 0'], 1, 'Cycle head se — head hi start.'],
    ],
    14: [
      ['Floyd me collision guaranteed kyun?', ['Luck', 'Cycle me relative speed 1 — gap 0 tak ghatta hai', 'Fast tez hai', 'HashSet'], 1, 'Gap 1-1 karke ghatta hai.'],
      ['LC 25 me bacha group k se chhota ho toh?', ['Reverse karo', 'Waisa hi rehta hai', 'Delete karo', 'Error'], 1, 'kth null mila → break.'],
      ['Reorder O(1) extra space me kaise?', ['ArrayList', 'Middle → split → reverse → merge', 'Stack', 'Recursion'], 1, 'Sab in-place.'],
      ['Scorecard 75–89 ka matlab?', ['Fail', 'Zyadatar interview-ready, weak areas revise', 'Perfect', 'Week repeat karo'], 1, '90+ strong, 60 se kam pe repeat.'],
      ['Linked list access O(n) kyun?', ['Sorted nahi hoti', 'Nodes continuous nahi — next follow karna padta hai', 'HashMap', 'Recursion'], 1, 'Address calculate nahi ho sakta.'],
    ],
  };
  Object.keys(Z).forEach(d => {
    if (P.lessons && P.lessons[d]) P.lessons[d].quiz = Z[d].map(([q, opts, ans, why]) => ({ q, opts, ans, why }));
  });
})();
