// Phase 1 (Arrays) — Daily Quiz: har din 5 MCQ + explanation (Day 1–14). Lessons ke BAAD load hota hai (naam "zquiz").
// Format: [sawaal, [4 options], sahi option ka index (0–3), explanation]
(function () {
  const P = window.PHASE_CONTENT['arrays'];
  const Z = {
    1: [
      ['int[] a = new int[5] — last valid index kya hai?', ['5', '4', '6', '0'], 1, 'Zero-based indexing: indices 0..n−1, toh 4. a[5] pe ArrayIndexOutOfBoundsException.'],
      ['Base address 2000, int = 4 bytes — a[3] ka address?', ['2003', '2012', '2016', '2004'], 1, '2000 + 3 × 4 = 2012. Ek calculation — isliye access O(1).'],
      ['Array ke beech (index 1) pe insert ka time?', ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], 2, 'Index 1 ke baad ke saare elements ek jagah right shift karne padte hain.'],
      ['findMax me max = 0 se shuru kiya, input [−3, −1, −2]. Output kya aayega?', ['−1', '0', '−3', 'Exception'], 1, 'Koi element 0 se bada nahi, toh galat 0 bacha rehta hai. Isliye max = arr[0] se shuru karo.'],
      ['LC 26: nums = [0,0,1,1,1,2,2,3,3,4] — k kya return hoga?', ['10', '4', '5', '6'], 2, 'Unique values 0, 1, 2, 3, 4 = 5. Woh pehle 5 positions me likhe jaate hain.'],
    ],
    2: [
      ['Traversal ki time complexity?', ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], 2, 'Har element exactly ek baar visit hota hai.'],
      ['[3, 1, 2, 10, 1] ka running sum?', ['[3,4,6,16,17]', '[3,1,2,10,1]', '[3,4,7,17,18]', '[17,14,13,11,1]'], 0, '3, 3+1, 4+2, 6+10, 16+1 — pichla total + aaj ka.'],
      ['countOdd me if (arr[i] % 2 == 1) likha. Input [−3, 5]. Kitne gine jaayenge?', ['0', '1', '2', 'Error'], 1, 'Java me −3 % 2 = −1, isliye −3 miss ho jaata hai. Sahi check: % 2 != 0.'],
      ['[10, 7, 10, 3] ka second largest (distinct)?', ['10', '7', '3', '−∞'], 1, 'Largest 10; doosra 10 duplicate hai isliye skip — distinct second largest 7.'],
      ['LC 1295: [12, 345, 2, 6, 7896] me even digits wale kitne?', ['1', '2', '3', '4'], 1, '12 (2 digits) aur 7896 (4 digits). Baaki sab odd digits.'],
    ],
    3: [
      ['Duplicate dhoondhne ka nested loop kitna time leta hai?', ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], 2, 'Har pair (i, j) compare hota hai — n(n−1)/2 comparisons.'],
      ['[1, 2, 2, 3, 1, 2] me 2 ki frequency?', ['1', '2', '3', '4'], 2, 'Index 1, 2 aur 5 pe — 3 baar.'],
      ['HashSet ka add(x) false kab deta hai?', ['Set khaali ho', 'x pehle se set me ho', 'x negative ho', 'Set full ho'], 1, 'Isi se LC 217 me duplicate pakadte hain: if (!seen.add(x)) return true.'],
      ['freq.put(x, freq.get(x) + 1) — x pehli baar aaya toh?', ['0 se shuru', 'NullPointerException', '1 ho jaayega', 'Kuch nahi'], 1, 'get(x) null deta hai aur null + 1 pe NPE. Isliye getOrDefault(x, 0) + 1.'],
      ['Boyer-Moore [2,2,1,1,1,2,2] pe final candidate?', ['1', '2', '0', '−1'], 1, 'Majority (2, 4 baar) cancel hone ke baad bhi bachta hai.'],
    ],
    4: [
      ['Two Sum me partner ka formula?', ['need = nums[i] − target', 'need = target − nums[i]', 'need = target + nums[i]', 'need = target / 2'], 1, 'Jo number current ke saath target banaye: target − nums[i].'],
      ['[3, 2, 4], target 6 — answer?', ['[0,0]', '[0,2]', '[1,2]', '[0,1]'], 2, '2 + 4 = 6 → index 1, 2. Index 0 wala 3 khud se pair nahi ho sakta.'],
      ['Pehle map.put(nums[i], i), phir lookup kiya — [3,2,4], 6 pe kya milega?', ['[1,2]', '[0,0] (galat)', '[-1,-1]', 'Exception'], 1, 'i = 0 pe need 3 map me khud mil jaata hai → khud se pair. Isliye pehle lookup, phir put.'],
      ['Map me key aur value kya rakhte hain?', ['index → value', 'value → index', 'value → count', 'sum → index'], 1, 'Answer me index chahiye, isliye value se uska index.'],
      ['HashMap wale Two Sum ka time / space?', ['O(n²) / O(1)', 'O(n log n) / O(1)', 'O(n) / O(n)', 'O(n) / O(1)'], 2, 'Ek pass, har lookup O(1) average; map me n entries tak.'],
    ],
    5: [
      ['[2, 4, 6, 8] ka prefix array?', ['[2,6,12,20]', '[2,4,6,8]', '[20,18,14,8]', '[0,2,6,12]'], 0, 'Har index pe ab tak ka total: 2, 2+4, 6+6, 12+8.'],
      ['Inclusive prefix me sum(L..R), L > 0?', ['prefix[R] − prefix[L]', 'prefix[R] − prefix[L−1]', 'prefix[R+1] − prefix[L]', 'prefix[L] − prefix[R]'], 1, '0..R ke total me se 0..L−1 ka hissa ghatao.'],
      ['Size n+1 prefix (prefix[0] = 0) me sum(L..R)?', ['prefix[R] − prefix[L]', 'prefix[R+1] − prefix[L]', 'prefix[R+1] − prefix[L+1]', 'prefix[R] − prefix[L−1]'], 1, 'Aage ke extra 0 ki wajah se L = 0 ka special case nahi lagta.'],
      ['LC 303 me prefix kab banate hain?', ['Har sumRange me', 'Constructor me ek baar', 'Kabhi nahi', 'Har query ke baad'], 1, 'Array badalta nahi — ek baar O(n) build, phir har query O(1).'],
      ['[1, 2, 3, 4, 5] me sum(1..3)?', ['6', '9', '10', '12'], 1, '2 + 3 + 4 = 9 (prefix[3] − prefix[0] = 10 − 1).'],
    ],
    6: [
      ['Subarray (j+1..i) ka sum prefix se?', ['prefix[i] + prefix[j]', 'prefix[i] − prefix[j]', 'prefix[j] − prefix[i]', 'prefix[i] × prefix[j]'], 1, 'i tak ka total minus j tak ka total.'],
      ['LC 560 me map shuru me kya hota hai?', ['{}', '{0: 1}', '{0: −1}', '{k: 1}'], 1, 'Khaali prefix (sum 0) ek baar — taaki index 0 se shuru hone wale subarray gine jaayein.'],
      ['[1, 1, 1], k = 2 — answer?', ['1', '2', '3', '0'], 1, '[1,1] index 0–1 aur index 1–2 → 2 subarrays.'],
      ['LC 560 me sliding window kyun nahi chalta?', ['Slow hai', 'Negative numbers ho sakte hain', 'HashMap nahi lagta', 'k bada ho sakta hai'], 1, 'Negatives se window ka sum monotonic nahi rehta — kab shrink karein pata nahi chalta.'],
      ['n = 10⁵, Q = 10⁵ range queries. Bina prefix kitna kaam?', ['~10⁵', '~2×10⁵', '~10¹⁰', '~10⁷'], 2, 'Har query O(n) → Q × n = 10¹⁰ (TLE). Prefix se sirf n + Q.'],
    ],
    7: [
      ['Array access O(1) kyun hai?', ['Array sorted hota hai', 'Continuous memory + address formula', 'HashMap use hota hai', 'Cache me hota hai'], 1, 'address = base + i × size — ek hi calculation.'],
      ['"Kitni baar aaya?" ke liye tool?', ['Prefix sum', 'HashMap frequency', 'Two pointers', 'Sorting'], 1, 'map.put(x, map.getOrDefault(x, 0) + 1).'],
      ['Two Sum me two pointers bina sort ke kab chalega?', ['Hamesha', 'Jab array already sorted ho', 'Kabhi nahi', 'Jab negatives na hon'], 1, 'Two pointers ko sorted order chahiye (left badhao = sum badhe).'],
      ['[3, 1, 2, 4] ka prefix aur sum(1..3)?', ['[3,4,6,10], 7', '[3,4,6,10], 10', '[3,1,2,4], 7', '[3,4,6,10], 6'], 0, '10 − 3 = 7 (1 + 2 + 4).'],
      ['Interview me sabse pehla step?', ['Code likhna', 'Clarify — input, output, edge cases', 'Optimal batana', 'Complexity bolna'], 1, 'Pehle problem pakki karo, phir brute → better → optimal.'],
    ],
    8: [
      ['Kadane me current sum ka update?', ['cur = cur + x', 'cur = max(x, cur + x)', 'cur = max(cur, x)', 'cur = x'], 1, 'Ya pichla subarray extend karo ya yahin se naya shuru — jo bada ho.'],
      ['[−2, 1, −3, 4, −1, 2, 1, −5, 4] ka answer?', ['4', '5', '6', '7'], 2, '[4, −1, 2, 1] = 6.'],
      ['Saare negative [−3, −1, −2] pe best ko 0 se shuru kiya toh?', ['−1', '0 (galat)', '−3', '−6'], 1, 'Koi sum 0 se bada nahi → galat 0. best ko MIN_VALUE se shuru karo.'],
      ['Running sum reset kab hota hai?', ['Jab x negative ho', 'Jab pichla running sum negative ho', 'Har 2 step pe', 'Jab best badle'], 1, 'Negative prefix sirf bojh hai: cur + x < x.'],
      ['Better (running sum) vs Kadane — time?', ['O(n²) vs O(n)', 'O(n³) vs O(n²)', 'O(n) vs O(1)', 'O(n log n) vs O(n)'], 0, 'Har start se running sum O(n²); Kadane ek pass O(n).'],
    ],
    9: [
      ['[1, 2, 3, 4] ka product except self?', ['[24,12,8,6]', '[1,2,6,24]', '[24,12,4,1]', '[10,10,10,10]'], 0, 'Left × Right: 1×24, 1×12, 2×4, 6×1.'],
      ['left[0] kya hota hai?', ['0', '1', 'nums[0]', 'nums[1]'], 1, 'Index 0 ke left me kuch nahi — multiply ka identity 1.'],
      ['Division kyun nahi karte?', ['Slow hai', '0 hone pe toot jaata hai (aur problem mana karta hai)', 'Integer overflow', 'Negative numbers'], 1, 'total / nums[i] — nums[i] = 0 pe divide by zero.'],
      ['[2, 3, 4, 5] ka right (suffix) array?', ['[60,20,5,1]', '[1,2,6,24]', '[120,60,20,5]', '[60,40,30,24]'], 0, 'right[3] = 1, right[2] = 5, right[1] = 20, right[0] = 60.'],
      ['Optimal version ka extra space (output chhod ke)?', ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], 1, 'Left products ans me, right ek suffix variable me.'],
    ],
    10: [
      ['[3, 0, 1] me missing number (LC 268)?', ['0', '1', '2', '4'], 2, 'n = 3, range 0..3 me 2 nahi hai.'],
      ['5 ^ 5 ^ 7 = ?', ['0', '5', '7', '17'], 2, 'a ^ a = 0, phir 0 ^ 7 = 7.'],
      ['LC 41 me value v (1..n) ki sahi jagah?', ['index v', 'index v − 1', 'index n − v', 'index 0'], 1, '1 → index 0, 2 → index 1, …'],
      ['[3, 4, −1, 1] (LC 41) ka answer?', ['1', '2', '3', '5'], 1, 'Placement ke baad [1, −1, 3, 4] → index 1 pe 2 nahi.'],
      ['LC 41 O(n) kyun jabki while loop andar hai?', ['Array sorted hai', 'Total swaps ≤ n', 'HashSet ki wajah se', 'Binary search'], 1, 'Har swap ek value ko final jagah pahunchata hai — poore algorithm me n se zyada swaps nahi.'],
    ],
    11: [
      ['[100, 4, 200, 1, 3, 2] ka answer?', ['3', '4', '5', '6'], 1, '1, 2, 3, 4 → length 4.'],
      ['Sequence ka start kab maante hain?', ['x + 1 set me ho', 'x − 1 set me na ho', 'x sabse chhota ho', 'x even ho'], 1, 'Pichla number nahi hai → yahi shuruaat.'],
      ['Start check hata diya toh worst time?', ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], 2, 'Har number se ginti → beech wale numbers baar-baar gine jaate hain.'],
      ['Sort approach ka time?', ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], 1, 'Sorting O(n log n) — problem O(n) maangta hai, isliye HashSet.'],
      ['[1, 2, 0, 1] ka answer?', ['2', '3', '4', '1'], 1, '0, 1, 2 — duplicate 1 ko set ne hata diya.'],
    ],
    12: [
      ['LC 525 me 0 ko kya maante hain?', ['1', '−1', '0 hi', '2'], 1, 'Taaki "0 aur 1 barabar" = "sum 0" ho jaaye.'],
      ['[0, 1, 0] ka balance (prefix)?', ['−1, 0, −1', '0, 1, 0', '1, 0, 1', '−1, −2, −3'], 0, '−1, −1+1 = 0, 0−1 = −1.'],
      ['Map shuru me kya hota hai?', ['{0: 1}', '{0: −1}', '{}', '{−1: 0}'], 1, 'Balance 0 "index −1" pe — shuru se balanced subarray ke liye.'],
      ['Same balance index 2 aur 7 pe — subarray length?', ['4', '5', '6', '9'], 1, '7 − 2 = 5 (index 3..7).'],
      ['Map me sirf pehli baar kyun daalte hain (update nahi)?', ['Space bachane', 'Longest chahiye — purana index rakho', 'Error aata hai', 'Fast hota hai'], 1, 'Jitna purana index, utna lamba subarray.'],
    ],
    13: [
      ['"Maximum contiguous sum" — pattern?', ['Prefix + HashMap', 'Kadane', 'HashSet', 'Two pointers'], 1, 'Extend ya reset — local aur global max.'],
      ['"Product except self, no division" — pattern?', ['Kadane', 'Prefix × Suffix product', 'Sorting', 'HashMap'], 1, 'Mere left wale sab × mere right wale sab.'],
      ['"Numbers 1..n, smallest missing positive, O(1) space" — pattern?', ['HashSet', 'Cyclic placement', 'Prefix sum', 'Binary search'], 1, 'Value v ko index v − 1 pe bhejo; pehli galat jagah = answer.'],
      ['"Longest consecutive, O(n)" — pattern?', ['Sorting', 'HashSet sequence (start se gino)', 'Kadane', 'Prefix'], 1, 'x − 1 set me nahi → start; wahan se aage gino.'],
      ['"Equal number of 0 and 1" — pattern?', ['Kadane', 'Prefix + HashMap (balance)', 'Two pointers', 'XOR'], 1, '0 → −1; same balance dobara = balanced subarray.'],
    ],
    14: [
      ['LC 560 ka map kis se shuru?', ['{0: 1}', '{0: −1}', '{}', '{k: 0}'], 0, 'Count chahiye — khaali prefix 1 baar.'],
      ['LC 525 ka map kis se shuru?', ['{0: 1}', '{0: −1}', '{}', '{1: 0}'], 1, 'Length chahiye — balance 0 index −1 pe.'],
      ['LC 1480 kyun kaam karta hai?', ['Sorting ki wajah se', 'nums[i−1] me pehle se 0..i−1 ka total hai', 'HashMap ki wajah se', 'Recursion'], 1, 'Bas nums[i] jodna hai — pichla kaam dobara nahi.'],
      ['11-step answer me pattern kab bolte hain?', ['Code ke baad', 'Clarify ke turant baad (step 2)', 'Bilkul end me', 'Kabhi nahi'], 1, 'Pehle problem clarify, phir pattern ka naam — tab brute/better/optimal.'],
      ['LC 238: [−1, 1, 0, −3, 3] ka answer?', ['[0,0,9,0,0]', '[0,0,0,0,0]', '[9,9,0,9,9]', 'Error'], 0, 'Sirf zero wale index ka answer non-zero: (−1)(1)(−3)(3) = 9.'],
    ],
  };
  Object.keys(Z).forEach(d => {
    if (P.lessons && P.lessons[d]) P.lessons[d].quiz = Z[d].map(([q, opts, ans, why]) => ({ q, opts, ans, why }));
  });
})();
