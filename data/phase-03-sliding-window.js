window.PHASE_CONTENT = window.PHASE_CONTENT || {};

window.PHASE_CONTENT['sliding-window'] = {
  intro: 'Sliding Window = continuous subarray / substring pe "khidki" (window) jo aage khisakti hai. Har baar poora dobara calculate karne ki jagah sirf naya element add aur purana element remove — O(n²) se O(n).',

  // ---------------- FUNDAMENTALS ----------------
  fundamentals: [
    {
      h: 'Sliding Window kya hai?',
      body: `<p>Jab question <b>continuous</b> hissa (subarray / substring) pe ho, toh har (i, j) pair check karna O(n²) hota hai. Sliding window me do pointers <b>left</b> aur <b>right</b> ek window banate hain: <code>[left .. right]</code>.</p>
<p>Window aage badhti hai: <b>right</b> naya element andar laata hai, <b>left</b> purana element bahar nikalta hai. Dono pointers sirf <b>aage</b> chalte hain → har element max 2 baar touch hota hai → <b>O(n)</b>.</p>
<pre>nums:   [ 1  12  -5  -6  50   3 ]     k = 4
           └───────────┘              window 1 (sum = 2)
               └───────────┘          window 2: +50, −1  (sum = 51)
                   └───────────┘      window 3: +3, −12  (sum = 42)
Har slide: sum += nums[right] − nums[right − k]   → O(1)</pre>`,
    },
    {
      h: 'Do type: Fixed window vs Variable window',
      body: `<table class="tbl"><thead><tr><th></th><th>Fixed window</th><th>Variable window</th></tr></thead><tbody>
<tr><td>Size</td><td>Hamesha <b>k</b> (question me diya)</td><td>Badhti / ghatti rehti hai</td></tr>
<tr><td>Signal</td><td>"subarray of size k", "length k ka substring"</td><td>"longest / shortest subarray jisme …", "at most k"</td></tr>
<tr><td>Move</td><td>right++ ke saath left++ (gap = k)</td><td>right har step badhta hai; left sirf tab jab window <b>invalid</b> (longest) ya <b>valid</b> (shortest) ho</td></tr>
<tr><td>Course Qs</td><td>643, 1456</td><td>3, 424, 1004 (longest) · 209, 76 (shortest)</td></tr>
</tbody></table>
<p><b>Longest</b> template: right badhao → jab tak window <i>invalid</i> hai left badhao → phir answer update.<br>
<b>Shortest</b> template: right badhao → jab tak window <i>valid</i> hai answer update karo aur left badhao.</p>`,
    },
    {
      h: 'Kab kaam karta hai, kab nahi (bahut important)',
      body: `<ul>
<li>Window ki condition <b>monotonic</b> honi chahiye: window badi karne pe condition ek hi direction me badle. Example: sab numbers positive → window badhao toh sum badhta hi hai.</li>
<li><b>Negative numbers</b> ho toh sum ka window kaam nahi karta (left hatane pe sum badh bhi sakta hai). Tab <b>Prefix Sum + HashMap</b> (Phase 1, LC 560).</li>
<li>Window ki state rakhne ke liye: <b>int sum</b>, <b>count</b>, <b>HashSet</b>, <b>HashMap / int[26] / int[128]</b> frequency.</li>
<li>Window length = <code>right − left + 1</code>. Fixed window me left = <code>right − k + 1</code>.</li>
<li>Har element ek baar andar (right) aur ek baar bahar (left) → nested <code>while</code> hone ke baad bhi total O(n) (amortized).</li>
</ul>`,
    },
    {
      h: 'Java Cheat Sheet (Window state)',
      code: `// Fixed window sum
int sum = 0;
for (int i = 0; i < k; i++) sum += nums[i];
for (int i = k; i < n; i++) sum += nums[i] - nums[i - k];

// String characters
char c = s.charAt(i);
int idx = c - 'a';             // 'a'..'z' -> 0..25
int[] cnt = new int[26];       // lowercase letters
int[] cnt128 = new int[128];   // koi bhi ASCII char: cnt128[c]++

// HashSet / HashMap window
Set<Character> window = new HashSet<>();
Map<Character, Integer> freq = new HashMap<>();
freq.put(c, freq.getOrDefault(c, 0) + 1);
freq.merge(c, 1, Integer::sum);     // same kaam, short

// Answer tracking
int best = 0;                          // longest
int bestMin = Integer.MAX_VALUE;       // shortest -> end me 0 / "" check
String sub = s.substring(start, start + len); // [start, start+len)`,
    },
  ],

  // ---------------- OPERATIONS ----------------
  operations: [
    { op: 'Pehli window banao (size k)', time: 'O(k)', note: 'Shuru ke k elements ka sum / count', code: 'int sum = 0;\nfor (int i = 0; i < k; i++) sum += nums[i];' },
    { op: 'Fixed window slide', time: 'O(1) per step', note: 'Naya andar, purana (i − k) bahar', code: 'sum += nums[i] - nums[i - k];' },
    { op: 'Expand (right++)', time: 'O(1)', note: 'Naya element window state me add', code: 'freq[s.charAt(right) - \'a\']++;' },
    { op: 'Shrink (left++)', time: 'O(1) amortized', note: 'Purana element state se hatao, phir left aage', code: 'freq[s.charAt(left) - \'a\']--;\nleft++;' },
    { op: 'Window length', time: 'O(1)', note: 'Inclusive [left, right]', code: 'int len = right - left + 1;' },
    { op: 'Longest update', time: 'O(1)', note: 'Shrink ke BAAD (window valid hai)', code: 'best = Math.max(best, right - left + 1);' },
    { op: 'Shortest update', time: 'O(1)', note: 'Shrink ke ANDAR (jab tak valid)', code: 'while (valid) {\n    best = Math.min(best, right - left + 1);\n    // remove nums[left]; left++\n}' },
    { op: 'Last seen index jump', time: 'O(1)', note: 'Duplicate mila toh left seedha jump (sirf aage)', code: 'if (last.containsKey(c) && last.get(c) >= left)\n    left = last.get(c) + 1;' },
  ],

  // ---------------- PATTERNS ----------------
  patterns: [
    {
      name: 'Fixed Size Window',
      signal: '"size k ka subarray", "length k ka substring", "har k consecutive"',
      idea: 'Pehli k ka state banao. Phir har i = k..n−1 pe nums[i] add, nums[i−k] remove, answer update.',
      code: `int sum = 0;
for (int i = 0; i < k; i++) sum += nums[i];
int best = sum;
for (int i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    best = Math.max(best, sum);
}`,
      qs: [643, 1456],
    },
    {
      name: 'Variable Window — Longest valid',
      signal: '"longest subarray / substring jisme …", "at most k zeros / replacements", "without repeating"',
      idea: 'right badhao. Jab tak window INVALID hai, left badhao. Phir best = max(best, right − left + 1).',
      code: `int left = 0, best = 0;
for (int right = 0; right < n; right++) {
    // add arr[right] to state
    while (/* window invalid */) {
        // remove arr[left] from state
        left++;
    }
    best = Math.max(best, right - left + 1);
}`,
      qs: [1004, 3, 424],
    },
    {
      name: 'Variable Window — Shortest valid',
      signal: '"minimum length subarray jiska sum ≥ target", "smallest window containing …"',
      idea: 'right badhao. Jab tak window VALID hai: answer min karo, phir left hatao (chhota karne ki koshish).',
      code: `int left = 0, best = Integer.MAX_VALUE;
for (int right = 0; right < n; right++) {
    // add arr[right]
    while (/* window valid */) {
        best = Math.min(best, right - left + 1);
        // remove arr[left]
        left++;
    }
}
return best == Integer.MAX_VALUE ? 0 : best;`,
      qs: [209, 76],
    },
    {
      name: 'Frequency-map Window',
      signal: 'Window me characters ka count matter karta hai: "all chars of t", "most frequent char", "no duplicate"',
      idea: 'int[26] / int[128] / HashMap me window ke chars ka count. Ek extra counter (missing, maxFreq) se O(1) me valid/invalid check.',
      code: `int[] need = new int[128];
for (char c : t.toCharArray()) need[c]++;
int missing = t.length();
// right: if (need[c] > 0) missing--; need[c]--;
// left : need[d]++; if (need[d] > 0) missing++;`,
      qs: [76, 424, 3],
    },
  ],

  // ---------------- QUESTIONS ----------------
  questions: {
    643: {
      oneLine: 'Fixed window k: sum += nums[i] − nums[i−k]; max sum / k.',
      pattern: 'Fixed Window',
      approaches: [
        {
          level: 'Brute', idea: 'Har starting index i se k elements ka sum fresh nikalo.',
          time: 'O(n·k)', space: 'O(1)',
          code: `public double findMaxAverage(int[] nums, int k) {
    double best = -Double.MAX_VALUE;
    for (int i = 0; i + k <= nums.length; i++) {
        int sum = 0;
        for (int j = i; j < i + k; j++) sum += nums[j];
        best = Math.max(best, (double) sum / k);
    }
    return best;
}`,
        },
        {
          level: 'Optimal', idea: 'Agli window pichli se sirf 2 element alag hai: ek aaya (nums[i]), ek gaya (nums[i−k]). Max sum track karo, end me ek hi baar / k.',
          time: 'O(n)', space: 'O(1)',
          code: `public double findMaxAverage(int[] nums, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += nums[i];
    int best = sum;
    for (int i = k; i < nums.length; i++) {
        sum += nums[i] - nums[i - k];
        best = Math.max(best, sum);
    }
    return (double) best / k;
}`,
        },
      ],
      dryRun: '[1,12,-5,-6,50,3], k=4 → sums 2, 51, 42 → best 51 → 51/4 = 12.75',
      interview: 'Every window of size k differs from the previous one by one element entering and one leaving, so I maintain a running sum in O(1) per slide and track the maximum sum. I divide by k only once at the end. O(n) time, O(1) space.',
      problem: {
        statement: 'Integer array <b>nums</b> aur integer <b>k</b> diya hai. Length <b>exactly k</b> ka woh continuous subarray dhundo jiska <b>average sabse zyada</b> ho, aur woh average return karo (10⁻⁵ tak ka error chalega).',
        examples: [
          { input: 'nums = [1,12,-5,-6,50,3], k = 4', output: '12.75000', ret: '12.75', explain: 'Windows: [1,12,-5,-6] sum 2, [12,-5,-6,50] sum 51, [-5,-6,50,3] sum 42. Max sum 51 → 51/4 = 12.75', viz: { nums: '1, 12, -5, -6, 50, 3', k: '4' } },
          { input: 'nums = [5], k = 1', output: '5.00000', ret: '5.0', explain: 'Sirf ek window [5].', viz: { nums: '5', k: '1' } },
        ],
        constraints: ['n == nums.length', '1 ≤ k ≤ n ≤ 10⁵', '−10⁴ ≤ nums[i] ≤ 10⁴'],
      },
    },
    1456: {
      oneLine: 'Fixed window k pe vowel count: aane wala vowel +1, jaane wala vowel −1.',
      pattern: 'Fixed Window',
      approaches: [
        {
          level: 'Brute', idea: 'Har length-k substring me vowels fresh gino.',
          time: 'O(n·k)', space: 'O(1)',
          code: `public int maxVowels(String s, int k) {
    int best = 0;
    for (int i = 0; i + k <= s.length(); i++) {
        int count = 0;
        for (int j = i; j < i + k; j++) {
            if ("aeiou".indexOf(s.charAt(j)) >= 0) count++;
        }
        best = Math.max(best, count);
    }
    return best;
}`,
        },
        {
          level: 'Optimal', idea: 'Pehli window ka count banao. Har slide pe s[i] vowel → +1, s[i−k] vowel → −1. best = max.',
          time: 'O(n)', space: 'O(1)',
          code: `public int maxVowels(String s, int k) {
    int count = 0;
    for (int i = 0; i < k; i++) {
        if (isVowel(s.charAt(i))) count++;
    }
    int best = count;
    for (int i = k; i < s.length(); i++) {
        if (isVowel(s.charAt(i))) count++;
        if (isVowel(s.charAt(i - k))) count--;
        best = Math.max(best, count);
    }
    return best;
}

private boolean isVowel(char c) {
    return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
}`,
        },
      ],
      dryRun: '"abciiidef", k=3 → counts: abc 1, bci 1, cii 2, iii 3, iid 2, ide 2, def 1 → 3',
      interview: 'This is a fixed window of size k. I count vowels in the first window, then slide: add one if the entering character is a vowel and subtract one if the leaving character is a vowel. The maximum count seen is the answer. O(n) time, O(1) space; I can also stop early once the count reaches k.',
      problem: {
        statement: 'String <b>s</b> (lowercase letters) aur integer <b>k</b> diya hai. Length <b>k</b> ke kisi bhi substring me <b>zyada se zyada kitne vowels</b> (a, e, i, o, u) ho sakte hain — woh number return karo.',
        examples: [
          { input: 's = "abciiidef", k = 3', output: '3', explain: 'Substring "iii" me 3 vowels hain.', viz: { s: 'abciiidef', k: '3' } },
          { input: 's = "aeiou", k = 2', output: '2', explain: 'Har length-2 substring me 2 vowels.', viz: { s: 'aeiou', k: '2' } },
          { input: 's = "leetcode", k = 3', output: '2', explain: '"lee", "eet" aur "ode" me 2 vowels.', viz: { s: 'leetcode', k: '3' } },
        ],
        constraints: ['1 ≤ s.length ≤ 10⁵', 's sirf lowercase English letters', '1 ≤ k ≤ s.length'],
      },
    },
    3: {
      oneLine: 'Variable window: duplicate aaya toh left ko us char ke last index + 1 pe jump karao; best = max(right − left + 1).',
      pattern: 'Variable Window (Longest) + HashMap',
      approaches: [
        {
          level: 'Brute', idea: 'Har start i se aage badho, HashSet me daalte jao; duplicate mila toh ruk jao.',
          time: 'O(n²)', space: 'O(min(n, charset))',
          code: `public int lengthOfLongestSubstring(String s) {
    int n = s.length(), best = 0;
    for (int i = 0; i < n; i++) {
        Set<Character> seen = new HashSet<>();
        for (int j = i; j < n; j++) {
            if (!seen.add(s.charAt(j))) break;
            best = Math.max(best, j - i + 1);
        }
    }
    return best;
}`,
        },
        {
          level: 'Better', idea: 'Sliding window + HashSet. Duplicate c aaya toh jab tak c window me hai, left wala char hatao aur left++.',
          time: 'O(n) (har char max 2 baar)', space: 'O(min(n, charset))',
          code: `public int lengthOfLongestSubstring(String s) {
    Set<Character> window = new HashSet<>();
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        while (window.contains(c)) {
            window.remove(s.charAt(left));
            left++;
        }
        window.add(c);
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
        },
        {
          level: 'Optimal', idea: 'HashMap char → last index. Duplicate mila aur woh window ke andar hai (last ≥ left) toh left seedha last + 1 pe jump. Ek-ek karke hatana nahi padta.',
          time: 'O(n)', space: 'O(min(n, charset))',
          code: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> last = new HashMap<>(); // char -> last index
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (last.containsKey(c) && last.get(c) >= left) {
            left = last.get(c) + 1;
        }
        last.put(c, right);
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
        },
      ],
      dryRun: '"abcabcbb" → right 0..2 window "abc" (3); right=3 a dup → left 1; … best = 3',
      interview: 'I keep a window with no repeated characters. Expanding right, if the character was last seen inside the window, I jump left to one past its last index, which I store in a HashMap. The window length right − left + 1 after each step gives the candidate answer. Each index is processed once, so O(n) time and O(charset) space.',
      problem: {
        statement: 'String <b>s</b> diya hai. Sabse lamba <b>substring</b> (continuous) dhundo jisme <b>koi character repeat na ho</b>, aur uski length return karo.',
        examples: [
          { input: 's = "abcabcbb"', output: '3', explain: '"abc" length 3 — isse lamba bina repeat ke nahi.', viz: { s: 'abcabcbb' } },
          { input: 's = "bbbbb"', output: '1', explain: 'Sirf "b".', viz: { s: 'bbbbb' } },
          { input: 's = "pwwkew"', output: '3', explain: '"wke" length 3. "pwke" substring nahi, subsequence hai.', viz: { s: 'pwwkew' } },
        ],
        constraints: ['0 ≤ s.length ≤ 5 × 10⁴', 's me English letters, digits, symbols aur spaces'],
      },
    },
    424: {
      oneLine: 'Window valid jab (len − maxFreq) ≤ k; invalid ho toh left++; best = max len.',
      pattern: 'Frequency Window (Replacement)',
      approaches: [
        {
          level: 'Brute', idea: 'Har start i, har end j: window ka count[26] aur maxFreq. (len − maxFreq) ≤ k ho toh valid.',
          time: 'O(n²)', space: 'O(26)',
          code: `public int characterReplacement(String s, int k) {
    int n = s.length(), best = 0;
    for (int i = 0; i < n; i++) {
        int[] count = new int[26];
        int maxFreq = 0;
        for (int j = i; j < n; j++) {
            maxFreq = Math.max(maxFreq, ++count[s.charAt(j) - 'A']);
            if (j - i + 1 - maxFreq <= k) best = Math.max(best, j - i + 1);
        }
    }
    return best;
}`,
        },
        {
          level: 'Optimal', idea: 'Sliding window + count[26]. Jo char sabse zyada hai use rakho, baaki (len − maxFreq) badlo. Agar badalne wale > k toh left++. maxFreq ko kam karne ki zaroorat nahi — answer sirf tab badhta hai jab maxFreq badhe.',
          time: 'O(n)', space: 'O(26)',
          code: `public int characterReplacement(String s, int k) {
    int[] count = new int[26];
    int left = 0, maxFreq = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        int c = s.charAt(right) - 'A';
        count[c]++;
        maxFreq = Math.max(maxFreq, count[c]);
        while (right - left + 1 - maxFreq > k) {
            count[s.charAt(left) - 'A']--;
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
        },
      ],
      dryRun: '"AABABBA", k=1 → window "AABA" (len 4, maxFreq 3, 4−3=1 ≤ 1) → best 4',
      interview: 'A window can be made uniform if its length minus the count of its most frequent character is at most k. I slide a window with a 26-size count array, shrink from the left when that replacement cost exceeds k, and track the maximum length. maxFreq never needs to decrease because a larger answer requires a larger maxFreq. O(n) time, O(1) space.',
      problem: {
        statement: 'String <b>s</b> (sirf uppercase letters) aur integer <b>k</b> diya hai. Tum kisi bhi character ko kisi aur uppercase letter me badal sakte ho — <b>zyada se zyada k baar</b>. Badalne ke baad <b>same letter wala sabse lamba substring</b> kitna lamba ho sakta hai?',
        examples: [
          { input: 's = "ABAB", k = 2', output: '4', explain: 'Dono A ko B (ya dono B ko A) bana do → "BBBB".', viz: { s: 'ABAB', k: '2' } },
          { input: 's = "AABABBA", k = 1', output: '4', explain: 'Beech wala B → A: "AAAABBA", "AAAA" length 4.', viz: { s: 'AABABBA', k: '1' } },
        ],
        constraints: ['1 ≤ s.length ≤ 10⁵', 's sirf uppercase English letters', '0 ≤ k ≤ s.length'],
      },
    },
    1004: {
      oneLine: 'Longest window jisme zeros ≤ k; zeros > k toh left++.',
      pattern: 'Variable Window (Longest)',
      approaches: [
        {
          level: 'Brute', idea: 'Har start i se aage zeros gino; zeros > k hote hi ruk jao.',
          time: 'O(n²)', space: 'O(1)',
          code: `public int longestOnes(int[] nums, int k) {
    int n = nums.length, best = 0;
    for (int i = 0; i < n; i++) {
        int zeros = 0;
        for (int j = i; j < n; j++) {
            if (nums[j] == 0) zeros++;
            if (zeros > k) break;
            best = Math.max(best, j - i + 1);
        }
    }
    return best;
}`,
        },
        {
          level: 'Optimal', idea: '"k zeros flip kar sakte ho" = "window me zyada se zyada k zeros". right badhao; zeros > k ho toh left aage karo jab tak ek zero bahar na nikle.',
          time: 'O(n)', space: 'O(1)',
          code: `public int longestOnes(int[] nums, int k) {
    int left = 0, zeros = 0, best = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] == 0) zeros++;
        while (zeros > k) {
            if (nums[left] == 0) zeros--;
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
        },
      ],
      dryRun: '[1,1,1,0,0,0,1,1,1,1,0], k=2 → window index 5..10 (zeros 2) → 6',
      interview: 'Flipping at most k zeros is the same as finding the longest window containing at most k zeros. I expand right, count zeros, and while the count exceeds k I move left forward, decrementing when a zero leaves. The best window length is the answer. Both pointers move forward only, so O(n) time and O(1) space.',
      problem: {
        statement: 'Binary array <b>nums</b> (sirf 0 / 1) aur integer <b>k</b> diya hai. Tum <b>zyada se zyada k zeros</b> ko 1 me flip kar sakte ho. Flip ke baad <b>lagataar 1s</b> ka sabse lamba hissa kitna ho sakta hai?',
        examples: [
          { input: 'nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2', output: '6', explain: 'Index 5 aur 10 ke 0 flip → [1,1,1,0,0,1,1,1,1,1,1], index 5..10 = 6 ones.', viz: { nums: '1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0', k: '2' } },
          { input: 'nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3', output: '10', explain: 'Index 2..11 window me 3 zeros (4, 5, 9) → flip karke 10 ones.', viz: { nums: '0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1', k: '3' } },
        ],
        constraints: ['1 ≤ nums.length ≤ 10⁵', 'nums[i] sirf 0 ya 1', '0 ≤ k ≤ nums.length'],
      },
    },
    209: {
      oneLine: 'Shortest window jiska sum ≥ target: valid rahe tab tak min len lo aur left++.',
      pattern: 'Variable Window (Shortest)',
      approaches: [
        {
          level: 'Brute', idea: 'Har start i se sum badhao; sum ≥ target hote hi length lo aur break.',
          time: 'O(n²)', space: 'O(1)',
          code: `public int minSubArrayLen(int target, int[] nums) {
    int n = nums.length, best = Integer.MAX_VALUE;
    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = i; j < n; j++) {
            sum += nums[j];
            if (sum >= target) {
                best = Math.min(best, j - i + 1);
                break;
            }
        }
    }
    return best == Integer.MAX_VALUE ? 0 : best;
}`,
        },
        {
          level: 'Better', idea: 'Prefix sum (sab positive → sorted). Har i ke liye binary search se pehla j jahan pre[j] ≥ pre[i] + target. (Follow-up wala O(n log n).)',
          time: 'O(n log n)', space: 'O(n)',
          code: `public int minSubArrayLen(int target, int[] nums) {
    int n = nums.length, best = Integer.MAX_VALUE;
    long[] pre = new long[n + 1];
    for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + nums[i];
    for (int i = 0; i < n; i++) {
        long need = pre[i] + target;
        int lo = i + 1, hi = n + 1;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (pre[mid] >= need) hi = mid;
            else lo = mid + 1;
        }
        if (lo <= n) best = Math.min(best, lo - i);
    }
    return best == Integer.MAX_VALUE ? 0 : best;
}`,
        },
        {
          level: 'Optimal', idea: 'Sab numbers positive → window badhao toh sum badhta, chhota karo toh ghatta. right se add; jab tak sum ≥ target: min len update, nums[left] hatao, left++.',
          time: 'O(n)', space: 'O(1)',
          code: `public int minSubArrayLen(int target, int[] nums) {
    int left = 0, sum = 0, best = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            best = Math.min(best, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }
    return best == Integer.MAX_VALUE ? 0 : best;
}`,
        },
      ],
      dryRun: 'target 7, [2,3,1,2,4,3] → windows [2,3,1,2] (4), [1,2,4] (3), [2,4,3] (3), [4,3] (2) → 2',
      interview: 'Because all numbers are positive, the window sum grows when I expand and shrinks when I contract. I expand right, and while the sum is at least the target I record the length and shrink from the left to look for a shorter one. Each element enters and leaves once, so O(n) time, O(1) space. If nothing qualifies, return 0.',
      problem: {
        statement: 'Positive integers ka array <b>nums</b> aur ek positive <b>target</b> diya hai. Sabse <b>chhote</b> continuous subarray ki <b>length</b> return karo jiska sum <b>≥ target</b> ho. Agar koi aisa subarray nahi, toh <b>0</b>.',
        examples: [
          { input: 'target = 7, nums = [2,3,1,2,4,3]', output: '2', explain: '[4,3] ka sum 7, length 2 — isse chhota nahi.', viz: { target: '7', nums: '2, 3, 1, 2, 4, 3' } },
          { input: 'target = 4, nums = [1,4,4]', output: '1', explain: '[4] akela hi kaafi.', viz: { target: '4', nums: '1, 4, 4' } },
          { input: 'target = 11, nums = [1,1,1,1,1,1,1,1]', output: '0', explain: 'Poora sum bhi 8 < 11.', viz: { target: '11', nums: '1, 1, 1, 1, 1, 1, 1, 1' } },
        ],
        constraints: ['1 ≤ target ≤ 10⁹', '1 ≤ nums.length ≤ 10⁵', '1 ≤ nums[i] ≤ 10⁴ (sab positive!)', 'Follow-up: O(n) ke baad O(n log n) wala bhi socho'],
      },
    },
    76: {
      oneLine: 'need[128] + missing counter: right se missing ghatao; missing == 0 tak min window lo aur left se shrink.',
      pattern: 'Minimum Window (Frequency)',
      approaches: [
        {
          level: 'Brute', idea: 'Har start i se aage badho, have[] count karo; jab window t ko cover kare (covers check O(128)) toh length lo aur break.',
          time: 'O(n² · 128)', space: 'O(128)',
          code: `public String minWindow(String s, String t) {
    int[] need = new int[128];
    for (char c : t.toCharArray()) need[c]++;
    int bestLen = Integer.MAX_VALUE, bestStart = 0;
    for (int i = 0; i < s.length(); i++) {
        int[] have = new int[128];
        for (int j = i; j < s.length(); j++) {
            have[s.charAt(j)]++;
            if (covers(have, need)) {
                if (j - i + 1 < bestLen) {
                    bestLen = j - i + 1;
                    bestStart = i;
                }
                break;
            }
        }
    }
    return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
}

private boolean covers(int[] have, int[] need) {
    for (int c = 0; c < 128; c++) {
        if (have[c] < need[c]) return false;
    }
    return true;
}`,
        },
        {
          level: 'Better', idea: 'Do HashMap: need (t ke counts) aur window. formed = kitne distinct chars ka count poora hua. formed == required tak shrink.',
          time: 'O(|s| + |t|)', space: 'O(charset)',
          code: `public String minWindow(String s, String t) {
    Map<Character, Integer> need = new HashMap<>();
    for (char c : t.toCharArray()) need.put(c, need.getOrDefault(c, 0) + 1);
    Map<Character, Integer> window = new HashMap<>();
    int required = need.size(), formed = 0, left = 0;
    int bestLen = Integer.MAX_VALUE, bestStart = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        window.put(c, window.getOrDefault(c, 0) + 1);
        if (need.containsKey(c) && window.get(c).intValue() == need.get(c).intValue()) formed++;
        while (formed == required) {
            if (right - left + 1 < bestLen) {
                bestLen = right - left + 1;
                bestStart = left;
            }
            char d = s.charAt(left);
            window.put(d, window.get(d) - 1);
            if (need.containsKey(d) && window.get(d) < need.get(d)) formed--;
            left++;
        }
    }
    return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
}`,
        },
        {
          level: 'Optimal', idea: 'Ek hi int[128] need array: right pe need[c]-- (agar pehle > 0 tha toh missing--). missing == 0 → window valid: min lo, left char wapas need[d]++ (agar > 0 hua toh missing++). Arrays fast, no boxing.',
          time: 'O(|s| + |t|)', space: 'O(128)',
          code: `public String minWindow(String s, String t) {
    int[] need = new int[128];
    for (char c : t.toCharArray()) need[c]++;
    int left = 0, missing = t.length();
    int bestLen = Integer.MAX_VALUE, bestStart = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (need[c] > 0) missing--;
        need[c]--;
        while (missing == 0) {
            if (right - left + 1 < bestLen) {
                bestLen = right - left + 1;
                bestStart = left;
            }
            char d = s.charAt(left);
            need[d]++;
            if (need[d] > 0) missing++;
            left++;
        }
    }
    return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
}`,
        },
      ],
      dryRun: '"ADOBECODEBANC", t="ABC" → pehli valid window "ADOBEC" (6) → … "CODEBA" (6) → "BANC" (4)',
      interview: 'I count the characters of t in a need array and keep a missing counter equal to t.length. Expanding right, a character that is still needed decrements missing. When missing hits zero the window covers t, so I record it and shrink from the left; once a needed character leaves, missing becomes positive and I resume expanding. Each pointer moves at most n times, so O(|s| + |t|) time and O(1) space for the 128-size array.',
      problem: {
        statement: 'Do strings <b>s</b> aur <b>t</b> diye hain. <b>s</b> ka sabse <b>chhota substring</b> return karo jisme <b>t ke saare characters</b> (duplicates ki ginti ke saath) aa jaayein. Agar aisa koi substring nahi, toh <code>""</code> return karo. Answer unique hota hai.',
        examples: [
          { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explain: '"BANC" me A, B, C teeno hain aur isse chhota koi window nahi.', viz: { s: 'ADOBECODEBANC', t: 'ABC' } },
          { input: 's = "a", t = "a"', output: '"a"', explain: 'Poori string hi answer.', viz: { s: 'a', t: 'a' } },
          { input: 's = "a", t = "aa"', output: '""', explain: 't me do "a" chahiye, s me sirf ek → empty string.', viz: { s: 'a', t: 'aa' } },
        ],
        constraints: ['m == s.length, n == t.length', '1 ≤ m, n ≤ 10⁵', 's aur t me uppercase + lowercase English letters', 'Follow-up: O(m + n) me karo'],
      },
    },
  },

  // ---------------- DAILY PLAN (7 din = Week 4) ----------------
  days: [
    {
      "day": 1,
      "week": 1,
      "dow": "Mon",
      "type": "learn",
      "title": "Sliding Window Intro — Fixed Window",
      "theory": [
        "Window = continuous subarray / substring",
        "Nested loop O(n·k) → slide O(n)",
        "Left hatao, right jodo",
        "Sohvi + Tum: LC 643"
      ],
      "qs": [
        643
      ],
      "interview": {
        "q": "What is a sliding window and why is it faster than nested loops?",
        "a": "A sliding window is a contiguous range that I move across the array instead of recomputing every range from scratch. When the window moves one step, I subtract the element that leaves and add the element that enters, so each update is O(1). Every element enters and leaves at most once, which turns an O(n·k) brute force into O(n) time with O(1) extra space."
      }
    },
    {
      "day": 2,
      "week": 1,
      "dow": "Tue",
      "type": "learn",
      "title": "Fixed Window Mastery — Count in Window",
      "theory": [
        "Add new → remove oldest → size same",
        "Count bhi slide hota hai (vowels)",
        "\"abciiidef\" dry run",
        "Sohvi: 643 dobara · Tum: LC 1456"
      ],
      "qs": [
        1456
      ],
      "interview": {
        "q": "How do you recognise a fixed-size sliding window problem?",
        "a": "The problem names an exact window length k and asks for a maximum, minimum, average or count over every contiguous block of that length. I build the first window, then for each step add the incoming element, remove the outgoing one, and update the answer. The window size never changes, so there is no shrinking logic."
      }
    },
    {
      "day": 3,
      "week": 1,
      "dow": "Wed",
      "type": "learn",
      "title": "Variable Window — Longest Without Repeating",
      "theory": [
        "Size badalta hai: expand + shrink",
        "Clues: longest, shortest, at most, without repeating",
        "\"abcabcbb\" — HashSet track",
        "Tum: LC 3"
      ],
      "qs": [
        3
      ],
      "interview": {
        "q": "Why does the left pointer never move backward in Longest Substring Without Repeating Characters?",
        "a": "Once a window from left to right contains a duplicate, any window that starts at or before the earlier copy and ends at right or later also contains that duplicate. So those starting positions can never give a valid longer answer and I can permanently skip them. Both pointers only move forward, giving O(n) time."
      }
    },
    {
      "day": 4,
      "week": 1,
      "dow": "Thu",
      "type": "learn",
      "title": "Expand–Shrink Pattern — Minimum Size Subarray",
      "theory": [
        "Expand → check → invalid ho toh shrink",
        "Shortest: valid hote hi answer update + shrink",
        "\"2 3 1 2 4 3\", target 7 dry run",
        "Tum: LC 209"
      ],
      "qs": [
        209
      ],
      "interview": {
        "q": "Explain the general variable-window template.",
        "a": "I move the right pointer to expand the window and update its state. Then I check a validity condition. For a longest-window problem I shrink from the left while the window is invalid and record the answer once it is valid again. For a shortest-window problem I shrink while it is still valid, recording the answer before each shrink. Each pointer moves at most n times, so it is O(n)."
      }
    },
    {
      "day": 5,
      "week": 1,
      "dow": "Fri",
      "type": "learn",
      "title": "Replacement Pattern — Frequency Window",
      "theory": [
        "Window valid: len − maxFreq ≤ k",
        "count[26] + maxFreq",
        "\"AABABBA\", k = 1 dry run",
        "Tum: LC 424"
      ],
      "qs": [
          424,
          1004
        ],
      "interview": {
        "q": "Why does maxFrequency matter in Longest Repeating Character Replacement?",
        "a": "In any window, the cheapest way to make all characters equal is to keep the most frequent character and replace the rest. So the number of replacements needed is window length minus maxFrequency. If that is more than k, the window is invalid and I shrink from the left. Tracking counts in an array of 26 keeps each step O(1)."
      }
    },
    {
      "day": 6,
      "week": 1,
      "dow": "Sat",
      "type": "learn",
      "title": "Minimum Window Pattern — Minimum Window Substring",
      "theory": [
        "need map + window map + matched",
        "Expand → complete → shrink → update",
        "\"ADOBECODEBANC\", t = \"ABC\"",
        "Tum: LC 76"
      ],
      "qs": [
        76
      ],
      "interview": {
        "q": "How do you solve Minimum Window Substring in linear time?",
        "a": "I count the characters needed from t, then expand the right pointer over s, decrementing a missing counter whenever a needed character arrives. When missing reaches zero the window covers t, so I record it if it is the shortest so far and shrink from the left. When removing a character makes it needed again, the window becomes invalid and I go back to expanding. Each pointer moves at most n times, so it is O(|s| + |t|)."
      }
    },
    {
      "day": 7,
      "week": 1,
      "dow": "Sun",
      "type": "mock",
      "title": "Revision + Mock — Pattern ID + 12-step Order",
      "theory": [
        "Title se: fixed / variable / HashMap / frequency / expand–shrink",
        "Sohvi: 643, 1456 bina notes",
        "Tum: 3, 209, 424, 76 — 12 steps",
        "Sliding Window Pattern Sheet + Boss"
      ],
      "qs": [
        643,
        1456,
        3,
        209,
        424,
        76
      ],
      "interview": {
        "q": "Fixed vs variable sliding window — how do you choose?",
        "a": "If the problem fixes the window length, such as exactly k elements, I use a fixed window: add one, remove one, update. If it asks for the longest or shortest range satisfying a condition, such as at most k changes or sum at least target, I use a variable window that expands with the right pointer and shrinks with the left pointer based on a validity condition. Both run in O(n)."
      }
    }
  ],

  // ---------------- LAST MINUTE ----------------
  lastMinute: {
    triggers: [
      ['Subarray / substring of size k', 'Fixed window (add nums[i], remove nums[i−k])'],
      ['Longest substring without repeating', 'Variable window + HashMap last index'],
      ['Longest with "at most k" zeros / changes', 'Variable window, shrink while invalid'],
      ['Replace k chars to make same', 'len − maxFreq ≤ k, count[26]'],
      ['Minimum length with sum ≥ target (positive)', 'Shortest window, shrink while valid'],
      ['Smallest window containing all of t', 'need[128] + missing counter'],
      ['Subarray sum = k with negatives', 'Sliding window NAHI → Prefix Sum + HashMap'],
    ],
    edge: [
      'Empty string (LC 3 → 0)',
      'k = 0 (koi flip / replacement nahi)',
      'k == n (poora array ek window)',
      'Koi valid window nahi → 0 ya ""',
      't me duplicate chars ("aa")',
      'Average → double division ((double) sum / k)',
    ],
    mistakes: [
      'Longest me answer while ke andar update karna (window invalid ho sakti hai)',
      'LC 3 me last.get(c) ≥ left check bhoolna → left peeche chala jaata hai',
      'Shortest me best = 0 se start karna (MAX_VALUE chahiye)',
      'int / int average → integer division',
      'Negative numbers pe sum window lagana',
      'Window length right − left (+1 bhoolna)',
    ],
  },
};
