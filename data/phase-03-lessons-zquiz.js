// Phase 3 (Sliding Window) — Daily Quiz: har din 5 MCQ + explanation (Day 22–28). Lessons ke BAAD load hota hai (naam "zquiz").
// Format: [sawaal, [4 options], sahi option ka index (0–3), explanation]
(function () {
  const P = window.PHASE_CONTENT['sliding-window'];
  const Z = {
    1: [
      ['Window kya hota hai?', ['Koi bhi elements ka set', 'Continuous subarray / substring', 'Sorted hissa', 'Sirf pehle k elements'], 1, 'Beech se tod nahi sakte — continuous.'],
      ['[2,5,1,8,2,9], k = 3 ka max window sum?', ['14', '19', '11', '16'], 1, '[8,2,9] = 19.'],
      ['Fixed window slide ka formula?', ['sum = sum + nums[i]', 'sum += nums[i] − nums[i − k]', 'sum −= nums[i]', 'sum = nums[i] × k'], 1, 'Naya andar, purana (i − k) bahar.'],
      ['Brute har window ka sum dobara — time?', ['O(n)', 'O(n·k)', 'O(k)', 'O(log n)'], 1, 'n windows × k kaam.'],
      ['LC 643 me best = 0 se shuru karna kyun galat?', ['Slow hai', 'Saare sums negative ho sakte', 'k = 0 pe crash', 'Galat nahi'], 1, 'Pehli window ke sum se shuru karo.'],
    ],
    2: [
      ['"abciiidef", k = 3 — max vowels?', ['2', '3', '4', '1'], 1, '"iii" me 3.'],
      ['Window slide pe count kaise badle?', ['Har baar dobara gino', 'Aane wala vowel +1, jaane wala vowel −1', 'Sirf +1', 'Sirf −1'], 1, 'O(1) update.'],
      ['Jaane wale char ka index?', ['i − 1', 'i − k', 'i + k', 'k'], 1, 'Window [i − k + 1 .. i] — bahar i − k.'],
      ['Fixed window ki pehchaan?', ['Longest', 'Exactly k / size k', 'At most k distinct', 'Without repeating'], 1, 'Size fixed di ho.'],
      ['LC 1456 early exit?', ['best == 0', 'best == k', 'count < 0', 'Nahi hota'], 1, 'k se zyada vowels ho hi nahi sakte.'],
    ],
    3: [
      ['"abcabcbb" ka answer?', ['2', '3', '4', '8'], 1, '"abc".'],
      ['Variable window me left kab hilta?', ['Har step', 'Condition toote tab', 'Kabhi nahi', 'Sirf end me'], 1, 'Shrink sirf invalid pe.'],
      ['"abba" me last.get(c) >= left check kyun?', ['Speed', 'Purana index window ke bahar ho toh left peeche na jaaye', 'Null se bachne', 'Zaroori nahi'], 1, 'b pe left = 2; a ka last = 0 ignore.'],
      ['HashSet window approach O(n) kyun, jab andar while hai?', ['Galat — O(n²)', 'left total max n baar badhta (amortized)', 'Set sorted hai', 'Binary search'], 1, 'Har char ek baar andar, ek baar bahar.'],
      ['Variable window ka clue NAHI hai?', ['Longest', 'At most', 'Exactly k size', 'Without repeating'], 2, 'Exactly k = fixed window.'],
    ],
    4: [
      ['[2,3,1,2,4,3], target 7 — answer?', ['3', '2', '4', '1'], 1, '[4,3].'],
      ['Shortest problem me answer kab update?', ['Shrink ke baad', 'Har valid window pe, shrink se pehle', 'End me ek baar', 'Har expand pe'], 1, 'Valid rahe tab tak record + shrink.'],
      ['LC 209 trick kis shart pe chalti?', ['Sorted array', 'Saare numbers positive', 'Unique numbers', 'k diya ho'], 1, 'Shrink se sum sirf ghate.'],
      ['LC 209 Better approach?', ['HashMap', 'Prefix sum + binary search O(n log n)', 'Sort', 'Stack'], 1, 'pre sorted (positive) → binary search.'],
      ['Kabhi valid window na mile toh return?', ['−1', '0', 'n', 'MAX_VALUE'], 1, 'best == MAX → 0.'],
    ],
    5: [
      ['LC 424 validity?', ['len ≤ k', 'len − maxFreq ≤ k', 'maxFreq ≥ k', 'len − k ≤ maxFreq − 1'], 1, 'Baaki chars badalne padenge.'],
      ['"AABABBA", k = 1 — answer?', ['3', '4', '5', '7'], 1, '"AABA" ya "ABBA" — 4.'],
      ['maxFreq kyun matter karta?', ['Sort ke liye', 'Sabse zyada wala rakho, baaki replace — kam badlav', 'Space kam', 'Matter nahi'], 1, 'Replacements = len − maxFreq.'],
      ['count array ka size?', ['128', '26', 'n', 'k'], 1, 'Sirf uppercase A–Z.'],
      ['Shrink pe maxFreq dobara compute na karna — asar?', ['Answer galat', 'Answer sahi rehta (best sirf bade maxFreq pe badhta)', 'Crash', 'O(n²)'], 1, 'Stale maxFreq safe hai.'],
    ],
    6: [
      ['"ADOBECODEBANC", t = "ABC"?', ['"ADOBEC"', '"BANC"', '"CODEBA"', '""'], 1, 'Sabse chhoti: BANC (4).'],
      ['Optimal me missing shuru me?', ['0', 't.length()', 's.length()', '128'], 1, 'Itne chars abhi chahiye.'],
      ['need[c] negative ka matlab?', ['Error', 'Window me c ki extra copy', 'c t me nahi', 'Window invalid'], 1, 'Zaroorat se zyada.'],
      ['Window valid kab?', ['missing > 0', 'missing == 0', 'left == right', 'need sab 0'], 1, 'Saare zaroori chars aa gaye.'],
      ['s = "a", t = "aa"?', ['"a"', '""', '"aa"', 'Error'], 1, 'Do a chahiye — mumkin nahi.'],
    ],
    7: [
      ['"Maximum Average Subarray" — window?', ['Fixed', 'Variable longest', 'Variable shortest', 'Frequency'], 0, 'Size k diya.'],
      ['"Minimum Size Subarray Sum" — window?', ['Fixed', 'Variable (shortest)', 'Variable (longest)', 'Two pointers opposite'], 1, '"minimum" + "≥ target".'],
      ['Longest problem me answer kab update?', ['Shrink se pehle', 'Shrink ke baad (window valid)', 'Sirf end me', 'Har expand se pehle'], 1, 'Invalid window answer nahi.'],
      ['LC 424 kis pattern me?', ['Fixed', 'Frequency Window', 'Prefix Sum', 'Opposite Direction'], 1, 'Character frequency + replace.'],
      ['Sliding window O(n) kyun?', ['Sort', 'left aur right dono max n baar, sirf aage', 'HashMap O(1)', 'Binary search'], 1, 'Har element ek baar andar, ek baar bahar.'],
    ],
  };
  Object.keys(Z).forEach(d => {
    if (P.lessons && P.lessons[d]) P.lessons[d].quiz = Z[d].map(([q, opts, ans, why]) => ({ q, opts, ans, why }));
  });
})();
