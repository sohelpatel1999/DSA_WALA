// Phase 2 (Two Pointers) — Daily Quiz: har din 5 MCQ + explanation (Day 15–21). Lessons ke BAAD load hota hai (naam "zquiz").
// Format: [sawaal, [4 options], sahi option ka index (0–3), explanation]
(function () {
  const P = window.PHASE_CONTENT['two-pointers'];
  const Z = {
    1: [
      ['Two pointers se pair-check O(n²) se kitna ho jaata hai?', ['O(n log n)', 'O(n)', 'O(1)', 'O(n²) hi'], 1, 'Har pointer ek direction me max n steps — total O(n).'],
      ['Opposite template ki loop condition?', ['while (l <= r)', 'while (l < r)', 'while (l != n)', 'while (r > 0)'], 1, 'l == r pe dono ek hi element pe — khud se compare/swap ki zaroorat nahi.'],
      ['"hello" palindrome check — pehla compare?', ["'h' vs 'o' → false", "'e' vs 'l'", "'l' vs 'l'", "'h' vs 'h'"], 0, 'l = 0 (h), r = 4 (o) — mismatch, turant false.'],
      ['LC 125 ke inner skip-loop me l < r guard kyun?', ['Speed ke liye', 'Faltu chars ("!!!") pe l bahar na nikle', 'Case ignore ke liye', 'Zaroori nahi'], 1, 'Bina guard ke l string ke bahar chala jaayega.'],
      ['LC 344 recursive approach ka space?', ['O(1)', 'O(log n)', 'O(n) stack', 'O(n²)'], 2, 'n/2 calls stack pe — O(n). Isliye loop wala optimal.'],
    ],
    2: [
      ['LC 167: sum < target. Kya karein?', ['r--', 'l++', 'Dono move', 'return'], 1, 'Bada sum chahiye — sirf left badha ke milega.'],
      ['[2,7,11,15], target 9 — pehla move?', ['l++', 'r-- (2 + 15 = 17 > 9)', 'return [1,2]', 'r++'], 1, '17 > 9 → right chhota karo.'],
      ['Sorted input pe HashMap ke bajaye two pointers kyun?', ['Fast time', 'O(1) space', 'Indices 0-based', 'Duplicates'], 1, 'Dono O(n), par two pointers extra memory nahi leta.'],
      ['LC 167 Better (binary search) ki time?', ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], 1, 'Har i ke liye log n search.'],
      ['LC 167 return format?', ['0-indexed', '1-indexed [l+1, r+1]', 'Values', 'Boolean'], 1, 'Problem 1-indexed indices maangti hai.'],
    ],
    3: [
      ['Same direction me fast aur slow ka kaam?', ['Dono likhte', 'fast padhta, slow likhta', 'slow padhta, fast likhta', 'Dono padhte'], 1, 'Read pointer sab scan karta, write pointer rakhne wale ki jagah.'],
      ['[0,1,0,3,12] Move Zeroes ka result?', ['[1,3,12,0,0]', '[12,3,1,0,0]', '[0,0,1,3,12]', '[1,0,3,0,12]'], 0, 'Non-zero ka order same, zeros end me.'],
      ['LC 26 [1,1,2,2,3] — k?', ['5', '2', '3', '4'], 2, 'Unique: 1, 2, 3.'],
      ['LC 283 Better vs Optimal ka farak?', ['Time', 'Space', 'Better do pass (0 bharo), Optimal ek pass swap', 'Koi nahi'], 2, 'Dono O(n)/O(1); swap ek pass me.'],
      ['LC 26 me nums[i] kis se compare?', ['nums[i + 1]', 'nums[k − 1]', 'nums[0]', 'nums[n − 1]'], 1, 'Pichli likhi unique value.'],
    ],
    4: [
      ['Container area formula?', ['max(h[l], h[r]) × (r − l)', 'min(h[l], h[r]) × (r − l)', 'h[l] + h[r]', '(h[l] + h[r]) × (r − l)'], 1, 'Paani chhoti wall tak hi rukta hai.'],
      ['h[l] = 3, h[r] = 8 — kaun move?', ['r', 'l', 'Dono', 'Koi nahi'], 1, 'Chhoti wall (l) hatao.'],
      ['Badi wall move karne se area kyun nahi badhta?', ['Width badhti hai', 'Width ghatti, height chhoti wall pe capped', 'Height badhti', 'Badhta hai'], 1, 'Isliye greedy safe hai.'],
      ['[1,8,6,2,5,4,8,3,7] ka answer?', ['49', '64', '40', '56'], 0, '8 (index 1) aur 7 (index 8): 7 × 7 = 49.'],
      ['LC 11 ka Better approach?', ['Sort', 'Binary search', 'Nahi hai — brute ke baad seedha two pointers', 'HashMap'], 2, 'Sort se positions (width) bigad jaati hain.'],
    ],
    5: [
      ['3Sum me pehla step?', ['HashMap banao', 'Sort', 'Reverse', 'Prefix sum'], 1, 'Two pointers + duplicate skip dono ke liye.'],
      ['nums[i] > 0 (sorted) pe kya?', ['continue', 'break', 'l++', 'r--'], 1, 'Aage sab positive — sum 0 nahi ho sakta.'],
      ['i pe duplicate skip ki condition?', ['nums[i] == nums[i + 1]', 'i > 0 && nums[i] == nums[i − 1]', 'nums[l] == nums[r]', 'i == 0'], 1, 'Same fixed value se same triplets.'],
      ['3Sum optimal time?', ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'], 2, 'n fixes × O(n) two pointers.'],
      ['[0,0,0,0] ka output?', ['[[0,0,0],[0,0,0]]', '[[0,0,0]]', '[]', '[[0,0,0,0]]'], 1, 'Duplicate skip — ek hi triplet.'],
    ],
    6: [
      ['Index i pe paani?', ['max(LMax, RMax) − h[i]', 'min(LMax, RMax) − h[i]', 'LMax − RMax', 'h[i]'], 1, 'Chhoti badi-wall tak hi paani.'],
      ['[4,2,0,3,2,5] me total paani?', ['7', '9', '10', '6'], 1, '0+2+4+1+2+0 = 9.'],
      ['Prefix/suffix approach ka space?', ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], 1, 'leftMax[] aur rightMax[].'],
      ['Two pointers me h[l] < h[r] — kya process?', ['Right', 'Left (leftMax se)', 'Dono', 'Kuch nahi'], 1, 'Right pe badi wall pakki → leftMax hi limit.'],
      ['Brute O(n²) kyun?', ['Sort', 'Har index pe dono taraf dobara scan', 'Recursion', 'HashMap'], 1, 'n index × n scan.'],
    ],
    7: [
      ['"Sorted array me pair sum" — pattern?', ['Same Direction', 'Opposite Direction', 'Water Trapping', 'Sliding Window'], 1, 'Dono end se andar.'],
      ['"In-place remove, order same" — pattern?', ['Opposite', 'Same Direction (Read / Write)', 'Container', 'Sort + Fix'], 1, 'Read/write pointers.'],
      ['"Unique triplets sum 0" — pattern?', ['Container', 'Sort + Fix + Two Pointers', 'Opposite only', 'HashMap only'], 1, 'Sort, i fix, l/r.'],
      ['Interview me pehla step?', ['Code likhna', 'Problem dohrana + examples/edge cases', 'Optimal bolna', 'Dry run'], 1, '10-step order ka step 1–2.'],
      ['Greedy pointer move ko sahi kaise prove karein?', ['Test cases se', 'Hataya element kisi better answer me nahi ho sakta', 'Time complexity se', 'Prove nahi hota'], 1, 'Elimination argument.'],
    ],
  };
  Object.keys(Z).forEach(d => {
    if (P.lessons && P.lessons[d]) P.lessons[d].quiz = Z[d].map(([q, opts, ans, why]) => ({ q, opts, ans, why }));
  });
})();
