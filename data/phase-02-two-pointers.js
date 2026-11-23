window.PHASE_CONTENT = window.PHASE_CONTENT || {};

window.PHASE_CONTENT['two-pointers'] = {
  intro: 'Two Pointers = ek array/string pe do index ek saath chalao taaki O(n²) wala "har pair check karo" O(n) ban jaaye. Do flavour: opposite direction (dono kinaron se andar) aur same direction (read / write, slow / fast).',

  // ---------------- FUNDAMENTALS ----------------
  fundamentals: [
    {
      h: 'Two Pointers kya hai?',
      body: `<p>Two pointers koi data structure nahi, ek <b>technique</b> hai: array ya string pe <b>do index variables</b> (jaise <code>l</code> aur <code>r</code>) rakho aur har step pe kam se kam ek ko aage badhao.</p>
<p>Har step pe ek pointer <b>hamesha aage</b> badhta hai aur wapas nahi aata → total moves ≤ n → <b>O(n)</b>. Brute force me har pair (i, j) check hota hai → O(n²). Two pointers ka kamaal: hum <b>proof</b> ke saath kuch pairs ko bina check kiye "reject" kar dete hain.</p>
<pre>
Opposite direction (sorted / palindrome / container):
  index:  0   1   2   3   4   5
  arr  : [1,  2,  4,  6,  8,  9]
          ^l                  ^r      l++ ya r-- → beech me milte hain (l &lt; r)

Same direction (read / write):
  arr  : [0,  1,  0,  3, 12]
          ^k  ^i                       i har step aage, k sirf "keep" pe aage
</pre>`,
    },
    {
      h: 'Kab lagta hai? (Signals)',
      body: `<table class="tbl"><thead><tr><th>Question me ye dikhe</th><th>Flavour</th><th>Course example</th></tr></thead><tbody>
<tr><td>Palindrome / reverse / dono kinaron se compare</td><td>Opposite</td><td>LC 125, LC 344</td></tr>
<tr><td><b>Sorted</b> array + pair ka sum = target</td><td>Opposite</td><td>LC 167, LC 15</td></tr>
<tr><td>Do lines/walls ke beech area, "max water"</td><td>Opposite (greedy: chhoti wall move)</td><td>LC 11, LC 42</td></tr>
<tr><td>In-place remove / move / compact, order same rakho</td><td>Same direction (read i, write k)</td><td>LC 283 (aur Phase 1 ka LC 26)</td></tr>
</tbody></table>
<p class="tip">Sorted nahi hai aur index chahiye? → HashMap (LC 1). Sorted hai ya sort kar sakte ho? → Two pointers, O(1) space.</p>`,
    },
    {
      h: 'Kyun kaam karta hai? (Elimination proof)',
      body: `<p>Sorted array me <code>sum = a[l] + a[r]</code>:</p>
<ul>
<li><code>sum &lt; target</code> → <code>a[l]</code> ko kisi bhi r' ≤ r ke saath jodo, sum aur chhota hi hoga. Matlab <b>a[l] kisi pair me kaam ka nahi</b> → <code>l++</code>.</li>
<li><code>sum &gt; target</code> → <code>a[r]</code> kisi bhi l' ≥ l ke saath bada hi hoga → <code>r--</code>.</li>
</ul>
<p>Har move ek poori row/column ke pairs ko ek saath reject karta hai — isliye n² pairs me se sirf n check karke bhi answer miss nahi hota.</p>
<p>Container (LC 11) me: chhoti wall wale pointer ko rakh ke r ko andar laao toh width ghategi aur height ≤ chhoti wall rahegi → area kabhi badhega nahi. Isliye <b>chhoti wall move</b>.</p>`,
    },
    {
      h: 'Java Cheat Sheet (Strings + Two Pointers)',
      code: `// String → char access
char c = s.charAt(i);                   // O(1)
int n = s.length();                     // String: length()  |  array: length
char[] arr = s.toCharArray();           // modify karna ho toh
String back = new String(arr);

// Character helpers
Character.isLetterOrDigit(c);           // a-z, A-Z, 0-9
Character.toLowerCase(c);
Character.isLetter(c);  Character.isDigit(c);

// StringBuilder (String immutable hai!)
StringBuilder sb = new StringBuilder();
sb.append(c);  sb.reverse();  sb.toString();

// Swap (Java me swap function nahi hota)
int tmp = a[i]; a[i] = a[j]; a[j] = tmp;

// Sort + list of triplets (3Sum)
Arrays.sort(nums);
List<List<Integer>> res = new ArrayList<>();
res.add(Arrays.asList(a, b, c));

// Template: opposite direction
int l = 0, r = n - 1;
while (l < r) { /* compare, fir l++ ya r-- */ }`,
    },
    {
      h: 'Yaad rakhne wali baatein',
      body: `<ul>
<li>Loop condition <code>l &lt; r</code> (same element do baar nahi). Palindrome me <code>l == r</code> beech ka char hai — check zaroori nahi.</li>
<li>Inner skip loops me bhi <code>l &lt; r</code> lagao, warna index bahar chala jaayega (LC 125).</li>
<li>Duplicates (LC 15): sort ke baad <b>same value skip</b> karo — i ke liye bhi aur l/r ke liye bhi.</li>
<li>String Java me <b>immutable</b> hai — in-place sirf <code>char[]</code> pe hota hai (LC 344).</li>
<li>Area/sum me overflow socho: LC 11 me max 10⁴ × 10⁵ = 10⁹ → int me fit, lekin border pe hai.</li>
</ul>`,
    },
  ],

  // ---------------- OPERATIONS ----------------
  operations: [
    { op: 'Swap two indices', time: 'O(1)', note: 'Temp variable se', code: 'int tmp = a[i];\na[i] = a[j];\na[j] = tmp;' },
    { op: 'Reverse in place', time: 'O(n)', note: 'Opposite pointers, n/2 swaps', code: 'int l = 0, r = n - 1;\nwhile (l < r) {\n    char t = s[l]; s[l] = s[r]; s[r] = t;\n    l++; r--;\n}' },
    { op: 'Palindrome check', time: 'O(n)', note: 'Dono kinaron se compare', code: 'int l = 0, r = s.length() - 1;\nwhile (l < r) {\n    if (s.charAt(l) != s.charAt(r)) return false;\n    l++; r--;\n}\nreturn true;' },
    { op: 'Pair sum in sorted array', time: 'O(n)', note: 'sum chhota → l++, bada → r--', code: 'while (l < r) {\n    int sum = a[l] + a[r];\n    if (sum == t) return new int[]{l, r};\n    if (sum < t) l++; else r--;\n}' },
    { op: 'Compact (keep valid, order same)', time: 'O(n)', note: 'Read i, write k', code: 'int k = 0;\nfor (int i = 0; i < n; i++)\n    if (keep(a[i])) a[k++] = a[i];' },
    { op: 'Skip duplicates after sort', time: 'O(1) amortized', note: '3Sum me same triplet dobara na aaye', code: 'while (l < r && a[l] == a[l - 1]) l++;' },
    { op: 'Sort first', time: 'O(n log n)', note: 'Two pointers ke liye array sorted chahiye', code: 'Arrays.sort(nums);' },
  ],

  // ---------------- PATTERNS ----------------
  patterns: [
    {
      name: 'Opposite Direction (Converging)',
      signal: '"Palindrome", "reverse", "sorted array me pair", dono kinaron ka comparison',
      idea: 'l = 0, r = n−1 se start. Har step pe ek pointer andar aata hai. Jab l ≥ r, kaam khatam. O(n), O(1).',
      code: `int l = 0, r = n - 1;
while (l < r) {
    // a[l], a[r] compare / swap
    if (/* left wala kaam ka nahi */) l++;
    else r--;
}`,
      qs: [344, 125, 167],
    },
    {
      name: 'Sort + Fix one + Two Pointers',
      signal: '"Triplets with sum 0", "unique combinations", k-sum',
      idea: 'Sort karo. Ek element i fix karo, baaki do ke liye i+1..n−1 pe opposite two pointers. Duplicates skip. O(n²).',
      code: `Arrays.sort(a);
for (int i = 0; i < n - 2; i++) {
    if (i > 0 && a[i] == a[i - 1]) continue;
    int l = i + 1, r = n - 1;
    while (l < r) { /* 2-sum on sorted */ }
}`,
      qs: [15],
    },
    {
      name: 'Greedy Shrink (Move the smaller side)',
      signal: '"Max area / water between walls", height array',
      idea: 'Jo side chhoti hai wahi bottleneck hai → usi ko andar le jao. Doosri side ko move karne se kabhi fayda nahi.',
      code: `while (l < r) {
    // answer update using min(h[l], h[r])
    if (h[l] < h[r]) l++;
    else r--;
}`,
      qs: [11, 42],
    },
    {
      name: 'Same Direction (Read / Write)',
      signal: '"In-place", "move zeroes", "remove", "relative order same rakho"',
      idea: 'i har element padhta hai; k sirf tab aage jab element rakhna hai. Pehle k positions = answer.',
      code: `int k = 0;
for (int i = 0; i < n; i++) {
    if (keep(a[i])) {
        swap(a, k, i);   // ya a[k] = a[i]
        k++;
    }
}`,
      qs: [283, 26],
    },
  ],

  // ---------------- QUESTIONS ----------------
  questions: {
    125: {
      oneLine: 'l, r dono kinaron se; non-alphanumeric skip; lowercase compare; mismatch → false.',
      pattern: 'Opposite Direction',
      approaches: [
        {
          level: 'Brute', idea: 'Sirf letters/digits ko lowercase karke naye StringBuilder me daalo, fir uska reverse compare karo.',
          time: 'O(n)', space: 'O(n)',
          code: `public boolean isPalindrome(String s) {
    StringBuilder sb = new StringBuilder();
    for (char c : s.toCharArray()) {
        if (Character.isLetterOrDigit(c)) sb.append(Character.toLowerCase(c));
    }
    String clean = sb.toString();
    String rev = sb.reverse().toString();
    return clean.equals(rev);
}`,
        },
        {
          level: 'Optimal', idea: 'Nayi string mat banao. l aur r dono kinaron se andar aao, faltu chars skip karo, lowercase karke compare karo.',
          time: 'O(n)', space: 'O(1)',
          code: `public boolean isPalindrome(String s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
        while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
        if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) {
            return false;
        }
        l++;
        r--;
    }
    return true;
}`,
        },
      ],
      dryRun: '"race a car" → (r,r) ✓ (a,a) ✓ (c,c) ✓ (e,a) ✗ → false',
      interview: 'I use two pointers from both ends, skipping characters that are not letters or digits and comparing the rest case-insensitively. Any mismatch means false; if the pointers meet, it is a palindrome. O(n) time and O(1) space, versus O(n) space if I first build a cleaned string.',
      problem: {
        statement: 'String <b>s</b> diya hai. Saare uppercase ko lowercase karo aur jo character letter ya digit nahi hai (space, comma, colon…) use hata do. Bachi hui string agar aage se aur peeche se <b>same</b> padhi jaaye toh <code>true</code>, warna <code>false</code>.',
        examples: [
          { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explain: 'Saaf karne ke baad "amanaplanacanalpanama" — ulta bhi same.', viz: { s: 'A man, a plan, a canal: Panama' } },
          { input: 's = "race a car"', output: 'false', explain: '"raceacar" ulta "racaecar" — same nahi.', viz: { s: 'race a car' } },
          { input: 's = " "', output: 'true', explain: 'Saaf karne ke baad empty string "" bachti hai — empty palindrome hai.', viz: { s: ' ' } },
        ],
        constraints: ['1 ≤ s.length ≤ 2 × 10⁵', 's me sirf printable ASCII characters'],
      },
    },
    344: {
      oneLine: 'l = 0, r = n−1; swap(s[l], s[r]); l++, r-- jab tak l < r.',
      pattern: 'Opposite Direction',
      approaches: [
        {
          level: 'Brute', idea: 'Naya array banao, ulta copy karo, fir wapas s me copy karo. (Question O(1) space maangta hai — isliye ye sirf samajhne ke liye.)',
          time: 'O(n)', space: 'O(n)',
          code: `public void reverseString(char[] s) {
    int n = s.length;
    char[] copy = new char[n];
    for (int i = 0; i < n; i++) {
        copy[i] = s[n - 1 - i];
    }
    for (int i = 0; i < n; i++) {
        s[i] = copy[i];
    }
}`,
        },
        {
          level: 'Recursive', idea: 'swap(l, r) karo aur baaki andar wala hissa (l+1, r−1) recursion ko de do. Kaam karta hai lekin O(n) call stack.',
          time: 'O(n)', space: 'O(n) stack',
          code: `public void reverseString(char[] s) {
    helper(s, 0, s.length - 1);
}

private void helper(char[] s, int l, int r) {
    if (l >= r) return;
    char tmp = s[l];
    s[l] = s[r];
    s[r] = tmp;
    helper(s, l + 1, r - 1);
}`,
        },
        {
          level: 'Optimal', idea: 'Two pointers: dono kinaron ke chars swap karo aur andar aao. n/2 swaps, koi extra array nahi.',
          time: 'O(n)', space: 'O(1)',
          code: `public void reverseString(char[] s) {
    int l = 0, r = s.length - 1;
    while (l < r) {
        char tmp = s[l];
        s[l] = s[r];
        s[r] = tmp;
        l++;
        r--;
    }
}`,
        },
      ],
      dryRun: '[h,e,l,l,o] → swap(0,4) [o,e,l,l,h] → swap(1,3) [o,l,l,e,h] → l=2=r stop',
      interview: 'I place one pointer at each end, swap the two characters, and move both pointers inward until they meet. That is n/2 swaps, O(n) time and O(1) extra space. A recursive version works too but uses O(n) stack space.',
      problem: {
        statement: 'Ek string <b>char array</b> <code>s</code> ke roop me di hai. Use <b>ulta (reverse)</b> karo — <b>in-place</b>, yaani O(1) extra memory. Kuch return nahi karna, <code>s</code> ko hi badalna hai.',
        examples: [
          { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explain: 'Pehla ↔ aakhri, doosra ↔ second-last; beech wala "l" apni jagah.', viz: { s: 'hello' } },
          { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', explain: 'Even length → 3 swaps, sab ulta.', viz: { s: 'Hannah' } },
        ],
        constraints: ['1 ≤ s.length ≤ 10⁵', 's[i] printable ASCII character', 'O(1) extra memory'],
      },
    },
    283: {
      oneLine: 'k = next non-zero ki jagah; nums[i] != 0 → swap(nums[k], nums[i]), k++.',
      pattern: 'Same Direction (Read / Write)',
      approaches: [
        {
          level: 'Brute', idea: 'Naya array: pehle saare non-zero order me, baaki 0. Fir wapas copy.',
          time: 'O(n)', space: 'O(n)',
          code: `public void moveZeroes(int[] nums) {
    int n = nums.length;
    int[] tmp = new int[n];
    int idx = 0;
    for (int x : nums) {
        if (x != 0) tmp[idx++] = x;
    }
    for (int i = 0; i < n; i++) {
        nums[i] = tmp[i];
    }
}`,
        },
        {
          level: 'Better', idea: 'In-place do pass: pehle saare non-zero ko k pe likho (LC 26 jaisa), fir k se end tak 0 bhar do.',
          time: 'O(n)', space: 'O(1)',
          code: `public void moveZeroes(int[] nums) {
    int k = 0;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) nums[k++] = nums[i];
    }
    while (k < nums.length) {
        nums[k++] = 0;
    }
}`,
        },
        {
          level: 'Optimal', idea: 'Ek hi pass: non-zero mila toh nums[k] se swap karo. 0 apne aap peeche khisakte jaate hain. Writes kam (sirf swaps).',
          time: 'O(n)', space: 'O(1)',
          code: `public void moveZeroes(int[] nums) {
    int k = 0; // next non-zero ki jagah
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            int tmp = nums[k];
            nums[k] = nums[i];
            nums[i] = tmp;
            k++;
        }
    }
}`,
        },
      ],
      dryRun: '[0,1,0,3,12] → i=1 swap(0,1) [1,0,0,3,12] k=1 → i=3 swap(1,3) [1,3,0,0,12] k=2 → i=4 swap(2,4) [1,3,12,0,0]',
      interview: 'I keep a write pointer k for the next non-zero slot and scan with i. Whenever nums[i] is non-zero I swap it with nums[k] and advance k, so non-zeros keep their relative order and zeros drift to the end. One pass, O(n) time, O(1) space.',
      problem: {
        statement: 'Integer array <b>nums</b> me saare <b>0</b> ko end me bhejo, aur non-zero elements ka <b>relative order same</b> rakho. <b>In-place</b> karna hai — copy array nahi banana.',
        examples: [
          { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]', explain: 'Non-zero 1, 3, 12 usi order me aage; dono 0 peeche.', viz: { nums: '0, 1, 0, 3, 12' } },
          { input: 'nums = [0]', output: '[0]', explain: 'Sirf ek 0 — kuch nahi badalta.', viz: { nums: '0' } },
          { input: 'nums = [4,2,0,0,7]', output: '[4,2,7,0,0]', explain: '4, 2 pehle se sahi jagah; 7 aage aata hai.', viz: { nums: '4, 2, 0, 0, 7' } },
        ],
        constraints: ['1 ≤ nums.length ≤ 10⁴', '−2³¹ ≤ nums[i] ≤ 2³¹ − 1', 'Follow-up: total operations kam se kam karo'],
      },
    },
    15: {
      oneLine: 'Sort; i fix; i+1..n−1 pe two pointers sum 0 dhundo; i, l, r teeno pe duplicates skip.',
      pattern: 'Sort + Fix + Two Pointers',
      approaches: [
        {
          level: 'Brute', idea: 'Teen nested loops, har triplet check. Duplicate triplets hatane ke liye sorted triplet ko Set me daalo.',
          time: 'O(n³)', space: 'O(k) answers',
          code: `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    Set<List<Integer>> set = new HashSet<>();
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                if (nums[i] + nums[j] + nums[k] == 0) {
                    set.add(Arrays.asList(nums[i], nums[j], nums[k]));
                }
            }
        }
    }
    return new ArrayList<>(set);
}`,
        },
        {
          level: 'Better', idea: 'i fix karo; baaki ke liye Two Sum (HashSet) — third = −(nums[i] + nums[j]) pehle dekha kya? Duplicates ke liye Set.',
          time: 'O(n²)', space: 'O(n)',
          code: `public List<List<Integer>> threeSum(int[] nums) {
    Set<List<Integer>> res = new HashSet<>();
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        Set<Integer> seen = new HashSet<>();
        for (int j = i + 1; j < n; j++) {
            int third = -(nums[i] + nums[j]);
            if (seen.contains(third)) {
                List<Integer> t = Arrays.asList(nums[i], nums[j], third);
                Collections.sort(t);
                res.add(t);
            }
            seen.add(nums[j]);
        }
    }
    return new ArrayList<>(res);
}`,
        },
        {
          level: 'Optimal', idea: 'Sort karo. Har i ke liye sorted hisse pe opposite two pointers (LC 167 jaisa). Duplicates sort ki wajah se paas-paas → skip karke Set ki zaroorat khatam.',
          time: 'O(n²)', space: 'O(1) extra (sort ke alawa)',
          code: `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue; // same first number skip
        if (nums[i] > 0) break;                          // sab positive → sum 0 nahi
        int l = i + 1, r = nums.length - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum < 0) l++;
            else if (sum > 0) r--;
            else {
                res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                l++;
                r--;
                while (l < r && nums[l] == nums[l - 1]) l++; // duplicate skip
                while (l < r && nums[r] == nums[r + 1]) r--;
            }
        }
    }
    return res;
}`,
        },
      ],
      dryRun: '[-1,0,1,2,-1,-4] → sorted [-4,-1,-1,0,1,2]; i=0 (−4) koi nahi; i=1 (−1): (−1,−1,2) ✓, (−1,0,1) ✓; i=2 duplicate skip; i=3 (0): 0+1+2 > 0 → [[−1,−1,2],[−1,0,1]]',
      interview: 'I sort the array, fix the first element, and solve two-sum on the remaining sorted suffix with two pointers. Sorting also puts duplicates next to each other, so I skip equal values for the fixed element and after each match, which avoids a HashSet. O(n²) time and O(1) extra space besides sorting.',
      problem: {
        statement: 'Integer array <b>nums</b> me saare <b>unique triplets</b> <code>[nums[i], nums[j], nums[k]]</code> dhundo jahan i, j, k alag indices hon aur <code>nums[i] + nums[j] + nums[k] == 0</code>. Answer me <b>same triplet do baar</b> nahi aana chahiye (order matter nahi karta).',
        examples: [
          { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explain: '(−1)+(−1)+2 = 0 aur (−1)+0+1 = 0. Do alag −1 hone se (−1,0,1) do baar banta, lekin ek hi baar likhna hai.', viz: { nums: '-1, 0, 1, 2, -1, -4' } },
          { input: 'nums = [0,1,1]', output: '[]', explain: 'Koi triplet ka sum 0 nahi.', viz: { nums: '0, 1, 1' } },
          { input: 'nums = [0,0,0]', output: '[[0,0,0]]', explain: 'Sirf ek triplet, sum 0.', viz: { nums: '0, 0, 0' } },
        ],
        constraints: ['3 ≤ nums.length ≤ 3000', '−10⁵ ≤ nums[i] ≤ 10⁵'],
      },
    },
    167: {
      oneLine: 'Sorted hai → l, r; sum < target → l++, sum > target → r--; answer 1-indexed.',
      pattern: 'Opposite Direction',
      approaches: [
        {
          level: 'Brute', idea: 'Har pair (i, j) try karo.',
          time: 'O(n²)', space: 'O(1)',
          code: `public int[] twoSum(int[] numbers, int target) {
    int n = numbers.length;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (numbers[i] + numbers[j] == target) return new int[]{i + 1, j + 1};
        }
    }
    return new int[]{-1, -1};
}`,
        },
        {
          level: 'Better', idea: 'Har i ke liye complement (target − numbers[i]) ko i+1..n−1 me binary search karo — array sorted hai.',
          time: 'O(n log n)', space: 'O(1)',
          code: `public int[] twoSum(int[] numbers, int target) {
    int n = numbers.length;
    for (int i = 0; i < n; i++) {
        int need = target - numbers[i];
        int lo = i + 1, hi = n - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (numbers[mid] == need) return new int[]{i + 1, mid + 1};
            if (numbers[mid] < need) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return new int[]{-1, -1};
}`,
        },
        {
          level: 'Optimal', idea: 'l = 0, r = n−1. Sum chhota → bada chahiye → l++. Sum bada → r--. Har step ek element permanently reject.',
          time: 'O(n)', space: 'O(1)',
          code: `public int[] twoSum(int[] numbers, int target) {
    int l = 0, r = numbers.length - 1;
    while (l < r) {
        int sum = numbers[l] + numbers[r];
        if (sum == target) return new int[]{l + 1, r + 1};
        if (sum < target) l++;
        else r--;
    }
    return new int[]{-1, -1};
}`,
        },
      ],
      dryRun: '[2,7,11,15], t=9 → (0,3) 17 > 9 r-- → (0,2) 13 r-- → (0,1) 9 ✓ → [1,2]',
      interview: 'Because the array is sorted, I start with pointers at both ends. If the sum is too small, the left element cannot pair with anything, so I move left; if too large, I move right. Each step eliminates one element, so it is O(n) time and O(1) space — better than the HashMap version, which needs O(n) space.',
      problem: {
        statement: '<b>1-indexed</b>, <b>non-decreasing sorted</b> array <b>numbers</b> aur <b>target</b> diya hai. Do alag positions <code>index1 &lt; index2</code> dhundo jinka sum target ho, aur <code>[index1, index2]</code> (1-indexed) return karo. Exactly ek answer hai. Sirf <b>O(1) extra space</b> use karna hai.',
        examples: [
          { input: 'numbers = [2,7,11,15], target = 9', output: '[1,2]', explain: '2 + 7 = 9 → positions 1 aur 2.', viz: { numbers: '2, 7, 11, 15', target: '9' } },
          { input: 'numbers = [2,3,4], target = 6', output: '[1,3]', explain: '2 + 4 = 6.', viz: { numbers: '2, 3, 4', target: '6' } },
          { input: 'numbers = [-1,0], target = -1', output: '[1,2]', explain: '−1 + 0 = −1.', viz: { numbers: '-1, 0', target: '-1' } },
        ],
        constraints: ['2 ≤ numbers.length ≤ 3 × 10⁴', '−1000 ≤ numbers[i] ≤ 1000', 'numbers non-decreasing sorted', '−1000 ≤ target ≤ 1000', 'Exactly ek solution', 'O(1) extra space'],
      },
    },
    11: {
      oneLine: 'l, r kinaron se; area = min(h[l], h[r]) × (r − l); chhoti wall wala pointer andar.',
      pattern: 'Container (Shrink Shorter Wall)',
      approaches: [
        {
          level: 'Brute', idea: 'Har pair of lines (i, j) ka area nikalo, max rakho.',
          time: 'O(n²)', space: 'O(1)',
          code: `public int maxArea(int[] height) {
    int n = height.length, best = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int area = Math.min(height[i], height[j]) * (j - i);
            best = Math.max(best, area);
        }
    }
    return best;
}`,
        },
        {
          level: 'Optimal', idea: 'Sabse chaudi width se start. Area chhoti wall se limited hai; badi wall ko andar laane se area kabhi nahi badhega → chhoti wall move karo.',
          time: 'O(n)', space: 'O(1)',
          code: `public int maxArea(int[] height) {
    int l = 0, r = height.length - 1, best = 0;
    while (l < r) {
        int h = Math.min(height[l], height[r]);
        best = Math.max(best, h * (r - l));
        if (height[l] < height[r]) l++;
        else r--;
    }
    return best;
}`,
        },
      ],
      dryRun: '[1,8,6,2,5,4,8,3,7] → (0,8) 1×8=8 → l++ → (1,8) 7×7=49 → r-- … → best 49',
      interview: 'Start with the widest container. The area is limited by the shorter wall, so moving the taller wall inward can only shrink the width without raising the height bound. Therefore I always move the shorter side, compute the area at each step, and keep the max. O(n) time, O(1) space.',
      problem: {
        statement: 'Array <b>height</b> me har index i pe ek khadi line hai jiski unchai <code>height[i]</code> hai. Koi bhi <b>do lines</b> chuno jo x-axis ke saath milke ek container banayein. Container me jitna <b>maximum paani</b> aa sakta hai woh return karo. (Container tilt nahi kar sakte → paani = chhoti line × beech ki doori.)',
        examples: [
          { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explain: 'Index 1 (8) aur index 8 (7): min(8,7) × (8 − 1) = 7 × 7 = 49.', viz: { height: '1, 8, 6, 2, 5, 4, 8, 3, 7' } },
          { input: 'height = [1,1]', output: '1', explain: 'min(1,1) × 1 = 1.', viz: { height: '1, 1' } },
          { input: 'height = [4,3,2,1,4]', output: '16', explain: 'Dono kinare 4 → 4 × 4 = 16.', viz: { height: '4, 3, 2, 1, 4' } },
        ],
        constraints: ['2 ≤ n ≤ 10⁵', '0 ≤ height[i] ≤ 10⁴'],
      },
    },
    42: {
      oneLine: 'water[i] = min(maxLeft, maxRight) − h[i]; two pointers: chhoti side ka max final hai → wahi process karo.',
      pattern: 'Water Trapping (Two Pointers)',
      approaches: [
        {
          level: 'Brute', idea: 'Har index i ke liye left me max aur right me max scan karo. Paani = min(leftMax, rightMax) − h[i].',
          time: 'O(n²)', space: 'O(1)',
          code: `public int trap(int[] height) {
    int n = height.length, water = 0;
    for (int i = 0; i < n; i++) {
        int leftMax = 0, rightMax = 0;
        for (int j = 0; j <= i; j++) leftMax = Math.max(leftMax, height[j]);
        for (int j = i; j < n; j++) rightMax = Math.max(rightMax, height[j]);
        water += Math.min(leftMax, rightMax) - height[i];
    }
    return water;
}`,
        },
        {
          level: 'Better', idea: 'leftMax[] aur rightMax[] pehle se bana lo (prefix max / suffix max — Phase 1 ke LC 238 jaisa idea). Fir ek pass me paani jodo.',
          time: 'O(n)', space: 'O(n)',
          code: `public int trap(int[] height) {
    int n = height.length;
    int[] leftMax = new int[n], rightMax = new int[n];
    leftMax[0] = height[0];
    for (int i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], height[i]);
    rightMax[n - 1] = height[n - 1];
    for (int i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], height[i]);
    int water = 0;
    for (int i = 0; i < n; i++) water += Math.min(leftMax[i], rightMax[i]) - height[i];
    return water;
}`,
        },
        {
          level: 'Optimal', idea: 'Agar height[l] < height[r], toh l ke right me kam se kam height[r] jitni wall hai → l ka paani sirf leftMax decide karega. Isliye chhoti side process karo aur andar aao. Arrays ki zaroorat nahi.',
          time: 'O(n)', space: 'O(1)',
          code: `public int trap(int[] height) {
    int l = 0, r = height.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (l < r) {
        if (height[l] < height[r]) {
            leftMax = Math.max(leftMax, height[l]);
            water += leftMax - height[l];
            l++;
        } else {
            rightMax = Math.max(rightMax, height[r]);
            water += rightMax - height[r];
            r--;
        }
    }
    return water;
}`,
        },
      ],
      dryRun: '[4,2,0,3,2,5] → h[l] < 5 hamesha → leftMax 4: +0, +2, +4, +1, +2 → 9',
      interview: 'Water above index i is min(max to the left, max to the right) minus its height. Precomputing prefix and suffix maxima gives O(n) time and O(n) space. To get O(1) space I use two pointers: if height[l] is smaller than height[r], the right side is guaranteed to have a wall at least that tall, so the water at l depends only on leftMax. I process the smaller side and move it inward.',
      problem: {
        statement: '<b>n</b> non-negative integers ek elevation map hain — har bar ki width 1 aur unchai <code>height[i]</code>. Baarish ke baad bars ke beech kitna <b>paani ruk</b> sakta hai, woh total return karo.',
        examples: [
          { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explain: 'Index 2 pe 1, index 4 pe 1, index 5 pe 2, index 6 pe 1, index 9 pe 1 → total 6 units.', viz: { height: '0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1' } },
          { input: 'height = [4,2,0,3,2,5]', output: '9', explain: 'Left wall 4, right wall 5 → level 4 tak paani: 2 + 4 + 1 + 2 = 9.', viz: { height: '4, 2, 0, 3, 2, 5' } },
        ],
        constraints: ['n == height.length', '1 ≤ n ≤ 2 × 10⁴', '0 ≤ height[i] ≤ 10⁵'],
      },
    },
  },

  // ---------------- DAILY PLAN (Week 3 = 7 din, sirf course ke 7 questions) ----------------
  // Mon–Fri: qs[0] = MUST (aasaan), qs[1] = PUSH (mushkil). Sat: revision (3–4). Sun: mock + contest.
  days: [
    {
      "day": 1,
      "week": 1,
      "dow": "Mon",
      "type": "learn",
      "title": "Two Pointers Intro — Opposite Direction (Reverse + Palindrome)",
      "theory": [
        "Two pointers kya hai, O(n²) → O(n) kaise",
        "Opposite: l = 0, r = n−1, while (l < r)",
        "\"racecar\" dry run",
        "Sohvi: LC 344 · Tum: LC 125"
      ],
      "qs": [
        344,
        125
      ],
      "interview": {
        "q": "What is the two-pointer technique and why is it O(n)?",
        "a": "Two pointers means keeping two indices into the same array or string and moving them by a rule instead of checking every pair. Each pointer only moves in one direction and never comes back, so together they make at most n moves. That gives O(n) time with O(1) extra space. The key is having a reason why moving a pointer safely discards candidates."
      }
    },
    {
      "day": 2,
      "week": 1,
      "dow": "Tue",
      "type": "learn",
      "title": "Opposite Direction — Sorted Pair Sum",
      "theory": [
        "sum < target → l++, sum > target → r--",
        "Kyun safe hai (elimination)",
        "HashMap vs Two Pointers table",
        "Sohvi: LC 344 dobara · Tum: LC 167"
      ],
      "qs": [
        167
      ],
      "interview": {
        "q": "Two Sum with a HashMap vs two pointers — which would you choose?",
        "a": "If the array is unsorted and I need original indices, a HashMap gives one pass in O(n) time and O(n) space. If the array is sorted, two pointers give O(n) time with O(1) space, which is strictly better. Every step discards one element that cannot be in any answer, so the scan is correct."
      }
    },
    {
      "day": 3,
      "week": 1,
      "dow": "Wed",
      "type": "learn",
      "title": "Same Direction — Read / Write Pointers",
      "theory": [
        "slow (write) + fast (read), dono aage",
        "Dry run: 1 1 2 2 3 aur 0 1 0 3 12",
        "Relative order kaise bachta hai",
        "Sohvi: LC 283 · Tum: LC 26 dobara"
      ],
      "qs": [
        283
      ],
      "interview": {
        "q": "Opposite-direction vs same-direction two pointers — when do you use each?",
        "a": "Opposite pointers start at both ends and move inward; I use them for palindromes, reversing, and pair sums on sorted data. Same-direction pointers both move left to right: a read pointer scans everything and a write pointer marks where the next kept element goes. I use them for in-place filtering like removing duplicates or moving zeroes, because they keep relative order in one pass with O(1) space."
      }
    },
    {
      "day": 4,
      "week": 1,
      "dow": "Thu",
      "type": "learn",
      "title": "Container Pattern — Container With Most Water",
      "theory": [
        "Area = min(h[l], h[r]) × (r − l)",
        "Chhoti wall hi kyun move (proof)",
        "Brute O(n²) → O(n)",
        "Sohvi: observe · Tum: LC 11"
      ],
      "qs": [
        11
      ],
      "interview": {
        "q": "Why do you move the shorter wall in Container With Most Water?",
        "a": "The area is the shorter wall times the width. If I move the taller wall inward, the width shrinks and the height is still capped by the same shorter wall, so the area can never increase. Moving the shorter wall is the only move that could find a taller bound. Each step discards a line that cannot be in a better answer, so the greedy scan is correct in O(n) time and O(1) space."
      }
    },
    {
      "day": 5,
      "week": 1,
      "dow": "Fri",
      "type": "learn",
      "title": "3Sum — Sort + Fix + Two Pointers",
      "theory": [
        "Sort, ek number fix, baaki pe two pointers",
        "Duplicate skip (i aur l/r dono pe)",
        "Brute O(n³) → HashSet O(n²) → Sort O(n²)",
        "Sohvi: observe · Tum: LC 15"
      ],
      "qs": [
        15
      ],
      "interview": {
        "q": "How do you handle duplicates in 3Sum without a HashSet?",
        "a": "I sort first so equal values sit next to each other. For the fixed element I skip index i when nums[i] equals nums[i − 1]. After recording a triplet I move both pointers inward and keep moving them past equal values. Each unique triplet is then added exactly once, with no extra memory beyond the output."
      }
    },
    {
      "day": 6,
      "week": 1,
      "dow": "Sat",
      "type": "learn",
      "title": "Water Trapping — Trapping Rain Water (3 approaches)",
      "theory": [
        "water[i] = min(leftMax, rightMax) − h[i]",
        "Brute O(n²) → prefix/suffix O(n) → two pointers O(1)",
        "Table: Left / Right / LeftMax / RightMax / Water",
        "Tum: LC 42"
      ],
      "qs": [
        42
      ],
      "interview": {
        "q": "How do you reduce space from O(n) to O(1) in Trapping Rain Water?",
        "a": "The O(n) solution stores the max height to the left and right of every index, but at each index only the smaller bound matters. With two pointers, if height[l] is less than height[r], there is a wall at least height[r] on the right, so water at l depends only on leftMax. I add leftMax minus height[l] and move l; otherwise I do the mirror on the right. Two running maxima replace both arrays."
      }
    },
    {
      "day": 7,
      "week": 1,
      "dow": "Sun",
      "type": "mock",
      "title": "Revision + Mock — Pattern ID + Interview Order",
      "theory": [
        "Title se pattern pehchano (5 patterns)",
        "Sohvi: 125, 344, 283 bina dekhe",
        "Tum: 15, 11, 42 — 10-step interview order",
        "Week 3 Pattern Sheet + Boss"
      ],
      "qs": [
        125,
        344,
        283,
        15,
        11,
        42
      ],
      "interview": {
        "q": "How do you prove a greedy two-pointer move is correct?",
        "a": "I show that the pointer I move cannot be part of any better answer with the remaining candidates. In a sorted pair sum, if the sum is too small, the left element paired with anything left gives an even smaller sum, so it is safe to drop. In the container problem, the shorter wall caps every narrower container it could form, so it can be dropped. Once every move only discards useless candidates, scanning until the pointers meet covers every answer that matters."
      }
    }
  ],

  // ---------------- LAST MINUTE ----------------
  lastMinute: {
    triggers: [
      ['Palindrome / reverse', 'Opposite pointers (l, r) — swap / compare'],
      ['Sorted array + pair sum', 'Opposite pointers: sum < t → l++, else r--'],
      ['Triplets sum 0 / unique', 'Sort + fix i + two pointers + skip duplicates'],
      ['Max area between two lines', 'Opposite pointers, move the shorter wall'],
      ['Trapped water', 'min(leftMax, rightMax) − h[i]; two pointers O(1)'],
      ['In-place move / remove, order same', 'Same direction: read i, write k'],
      ['Unsorted + index chahiye', 'HashMap (two pointers nahi)'],
    ],
    edge: [
      'Empty / 1 element / sirf spaces (LC 125 → true)',
      'Sab elements same (3Sum [0,0,0], Move Zeroes all zeros)',
      'Negative numbers (LC 167 [-1,0])',
      'Even vs odd length (reverse me beech wala)',
      'Strictly increasing / decreasing heights (rain water 0)',
    ],
    mistakes: [
      'Inner skip loop me l < r guard bhoolna → StringIndexOutOfBounds',
      'LC 167 me 0-indexed return karna (answer 1-indexed hai)',
      '3Sum me duplicates skip na karna → same triplet do baar',
      'Container me badi wall move karna',
      'Character.toLowerCase bhool ke "A" != "a" maan lena',
      'String ko in-place modify karne ki koshish (immutable hai)',
    ],
  },
};
