window.PHASE_CONTENT = window.PHASE_CONTENT || {};

window.PHASE_CONTENT['arrays'] = {
  intro: 'Array = DSA ki neev. 70% interview questions kisi na kisi form me array pe based hote hain. Pehle memory samjho, fir operations, fir patterns.',

  // ---------------- FUNDAMENTALS ----------------
  fundamentals: [
    {
      h: 'Array kya hai?',
      body: `<p>Array ek <b>fixed-size</b> container hai jisme <b>same type</b> ke elements <b>continuous memory</b> me line se rakhe hote hain.</p>
<p>Continuous memory ki wajah se koi bhi index <b>O(1)</b> me mil jaata hai: <code>address(i) = base + i × size</code>. Neeche diagram dekho.</p>`,
      memoryDemo: true,
    },
    {
      h: 'Java me Array vs ArrayList',
      body: `<table class="tbl"><thead><tr><th></th><th>int[] (Array)</th><th>ArrayList&lt;Integer&gt;</th></tr></thead><tbody>
<tr><td>Size</td><td>Fixed (create karte waqt)</td><td>Dynamic (khud badhta hai)</td></tr>
<tr><td>Type</td><td>Primitives bhi (int, char)</td><td>Sirf objects (Integer — autoboxing)</td></tr>
<tr><td>Length</td><td><code>arr.length</code></td><td><code>list.size()</code></td></tr>
<tr><td>Access</td><td><code>arr[i]</code></td><td><code>list.get(i)</code></td></tr>
<tr><td>Speed</td><td>Fast (no boxing)</td><td>Thoda slow</td></tr>
</tbody></table>
<p class="tip">Interview me jab size pata ho → <code>int[]</code>. Jab result ka size pata na ho → <code>List&lt;Integer&gt;</code>.</p>`,
    },
    {
      h: 'Yaad rakhne wali baatein',
      body: `<ul>
<li>Index <b>0</b> se start, last index <b>n − 1</b>. <code>arr[n]</code> → <code>ArrayIndexOutOfBoundsException</code>.</li>
<li><code>new int[n]</code> me sab values default <b>0</b> hoti hain (boolean → false, Object → null).</li>
<li>Java me array <b>reference</b> se pass hota hai — function ke andar change kiya toh original bhi badlega.</li>
<li><b>Subarray</b> = continuous hissa (e.g. [2,3] in [1,2,3,4]). <b>Subsequence</b> = order same, continuous zaroori nahi ([1,3]). <b>Subset</b> = koi bhi combination.</li>
<li>n elements ke <b>n(n+1)/2 subarrays</b> hote hain → isliye brute force O(n²) / O(n³) aata hai.</li>
</ul>`,
    },
    {
      h: 'Java Cheat Sheet (Arrays + Hashing)',
      code: `int[] arr = new int[5];                 // [0,0,0,0,0]
int[] a = {3, 1, 2};
Arrays.sort(a);                         // [1,2,3]  O(n log n)
Arrays.fill(arr, -1);                   // sab -1
System.out.println(Arrays.toString(a)); // debug print
int[] copy = Arrays.copyOf(a, a.length);
int[] part = Arrays.copyOfRange(a, 1, 3); // index 1..2

// HashMap — frequency / value->index
Map<Integer, Integer> map = new HashMap<>();
map.put(x, map.getOrDefault(x, 0) + 1);
map.containsKey(x);   map.get(x);

// HashSet — seen / unique
Set<Integer> set = new HashSet<>();
set.add(x);           // false return karega agar pehle se hai
set.contains(x);

// Safe max/min
int max = Integer.MIN_VALUE, min = Integer.MAX_VALUE;
long big = (long) a * b;  // overflow se bachne ke liye`,
    },
  ],

  // ---------------- OPERATIONS ----------------
  operations: [
    { op: 'Access arr[i]', time: 'O(1)', note: 'Direct address calculation', code: 'int x = arr[i];' },
    { op: 'Update arr[i]', time: 'O(1)', note: 'Direct overwrite', code: 'arr[i] = 10;' },
    { op: 'Traverse', time: 'O(n)', note: 'Har element ek baar', code: 'for (int i = 0; i < arr.length; i++) { /* arr[i] */ }\nfor (int x : arr) { /* x */ }' },
    { op: 'Search (unsorted)', time: 'O(n)', note: 'Linear search', code: 'for (int i = 0; i < n; i++)\n    if (arr[i] == target) return i;\nreturn -1;' },
    { op: 'Search (sorted)', time: 'O(log n)', note: 'Binary search (Phase 6)', code: 'int idx = Arrays.binarySearch(arr, target);' },
    { op: 'Insert at end', time: 'O(1)*', note: 'ArrayList amortized O(1); int[] me jagah honi chahiye', code: 'list.add(x);' },
    { op: 'Insert at index k', time: 'O(n)', note: 'k ke baad sabko right shift karna padta hai', code: 'for (int i = n; i > k; i--) arr[i] = arr[i - 1];\narr[k] = x;  // n++ (capacity honi chahiye)' },
    { op: 'Delete at index k', time: 'O(n)', note: 'k ke baad sabko left shift', code: 'for (int i = k; i < n - 1; i++) arr[i] = arr[i + 1];\n// n--' },
    { op: 'Reverse', time: 'O(n)', note: 'Two pointers swap', code: 'int l = 0, r = n - 1;\nwhile (l < r) {\n    int t = arr[l]; arr[l] = arr[r]; arr[r] = t;\n    l++; r--;\n}' },
    { op: 'Sort', time: 'O(n log n)', note: 'Primitives → Dual-Pivot QuickSort', code: 'Arrays.sort(arr);' },
    { op: 'Max / Min', time: 'O(n)', note: 'Ek pass', code: 'int max = arr[0];\nfor (int x : arr) max = Math.max(max, x);' },
  ],

  // ---------------- PATTERNS ----------------
  patterns: [
    {
      name: 'Prefix Sum',
      signal: '"Subarray ka sum", "range sum", "sum equals k"',
      idea: 'prefix[i] = arr[0..i] ka sum. Fir sum(l..r) = prefix[r] − prefix[l−1] → O(1).',
      code: `int[] pre = new int[n];
pre[0] = arr[0];
for (int i = 1; i < n; i++) pre[i] = pre[i - 1] + arr[i];
// sum(l..r) = pre[r] - (l > 0 ? pre[l - 1] : 0)`,
      qs: [1480, 238, 560, 525],
    },
    {
      name: 'Hashing (Seen / Frequency)',
      signal: '"Duplicate", "pair with sum", "count of", "pehle dekha hai?"',
      idea: 'HashSet/HashMap me pichli values daalte jao → O(1) lookup. O(n²) → O(n).',
      code: `Map<Integer, Integer> freq = new HashMap<>();
for (int x : arr) freq.put(x, freq.getOrDefault(x, 0) + 1);`,
      qs: [217, 1, 128, 169],
    },
    {
      name: 'Prefix Sum + HashMap',
      signal: '"Number of subarrays with sum k", negatives allowed',
      idea: 'Agar prefix − k pehle aaya hai, toh beech ka subarray ka sum = k. map.put(0, 1) mat bhoolna!',
      code: `Map<Integer, Integer> m = new HashMap<>();
m.put(0, 1);
int sum = 0, cnt = 0;
for (int x : arr) {
    sum += x;
    cnt += m.getOrDefault(sum - k, 0);
    m.put(sum, m.getOrDefault(sum, 0) + 1);
}`,
      qs: [560, 525],
    },
    {
      name: "Kadane's Algorithm",
      signal: '"Maximum subarray sum"',
      idea: 'Har index pe socho: purane subarray ko extend karu ya yahin se naya start? cur = max(x, cur + x).',
      code: `int cur = 0, best = Integer.MIN_VALUE;
for (int x : arr) {
    cur = Math.max(x, cur + x);
    best = Math.max(best, cur);
}`,
      qs: [53],
    },
    {
      name: 'In-place / Two Pointer Write',
      signal: '"Without extra space", "in-place", "sorted array me duplicates"',
      idea: 'Ek pointer read karta hai (i), ek likhta hai (k). Valid element mila toh arr[k++] = arr[i].',
      code: `int k = 0;
for (int i = 0; i < n; i++) {
    if (valid(arr[i])) arr[k++] = arr[i];
}
return k;`,
      qs: [26, 1920],
    },
    {
      name: 'Index as Hash (Cyclic Sort)',
      signal: '"Numbers 1..n ke range me", "missing / duplicate", O(1) space',
      idea: 'Value x ko index x−1 pe bhejo. Fir jo index galat hai wahi answer.',
      code: `for (int i = 0; i < n; i++)
    while (arr[i] > 0 && arr[i] <= n && arr[arr[i] - 1] != arr[i])
        swap(arr, i, arr[i] - 1);`,
      qs: [41],
    },
    {
      name: 'Boyer-Moore Voting',
      signal: '"Majority element (> n/2)" O(1) space',
      idea: 'Candidate rakho; same mila +1, alag mila −1; count 0 hua toh naya candidate.',
      code: `int cand = 0, count = 0;
for (int x : arr) {
    if (count == 0) cand = x;
    count += (x == cand) ? 1 : -1;
}`,
      qs: [169],
    },
  ],


  // ---------------- QUESTIONS ----------------
  questions: {
    1920: {
      oneLine: 'ans[i] = nums[nums[i]] — direct indexing; O(1) space ke liye ek index me 2 values encode karo.',
      pattern: 'Traversal / In-place encoding',
      approaches: [
        {
          level: 'Brute', idea: 'Naya array banao aur seedha formula lagao.',
          time: 'O(n)', space: 'O(n)',
          code: `public int[] buildArray(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    for (int i = 0; i < n; i++) {
        ans[i] = nums[nums[i]];
    }
    return ans;
}`,
        },
        {
          level: 'Optimal', idea: 'Values 0..n−1 hain. nums[i] = old + n × new store karo. old = nums[i] % n, new = nums[i] / n. Extra array nahi chahiye.',
          time: 'O(n)', space: 'O(1)',
          code: `public int[] buildArray(int[] nums) {
    int n = nums.length;
    // har index pe do value: old = nums[i] % n, new = nums[i] / n
    for (int i = 0; i < n; i++) {
        nums[i] = nums[i] + n * (nums[nums[i]] % n);
    }
    for (int i = 0; i < n; i++) {
        nums[i] = nums[i] / n;
    }
    return nums;
}`,
        },
      ],
      dryRun: 'nums = [0,2,1,5,3,4] → ans[1] = nums[nums[1]] = nums[2] = 1 … → [0,1,2,4,5,3]',
      interview: 'Straightforward O(n) with an extra array. For O(1) space, since every value is below n, I store both old and new values in one cell as old + n·new and decode with % and /.',
    },
    1480: {
      oneLine: 'Running sum: nums[i] += nums[i−1] — prefix sum ki pehli seedhi.',
      pattern: 'Prefix Sum',
      approaches: [
        {
          level: 'Brute', idea: 'Har i ke liye 0..i tak dobara sum karo.',
          time: 'O(n²)', space: 'O(n)',
          code: `public int[] runningSum(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = 0; j <= i; j++) sum += nums[j];
        ans[i] = sum;
    }
    return ans;
}`,
        },
        {
          level: 'Optimal', idea: 'Pichla sum already pata hai → bas current add karo. In-place.',
          time: 'O(n)', space: 'O(1)',
          code: `public int[] runningSum(int[] nums) {
    for (int i = 1; i < nums.length; i++) {
        nums[i] += nums[i - 1];
    }
    return nums;
}`,
        },
      ],
      dryRun: '[1,2,3,4] → [1, 1+2=3, 3+3=6, 6+4=10]',
      interview: 'Each running sum equals the previous running sum plus the current element, so a single pass updating in place gives O(n) time and O(1) extra space.',
    },
    217: {
      oneLine: 'HashSet me daalte jao; add() false de toh duplicate mil gaya.',
      pattern: 'Hashing',
      approaches: [
        {
          level: 'Brute', idea: 'Har pair (i, j) compare karo.',
          time: 'O(n²)', space: 'O(1)',
          code: `public boolean containsDuplicate(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] == nums[j]) return true;
        }
    }
    return false;
}`,
        },
        {
          level: 'Better', idea: 'Sort karo → duplicates paas-paas aa jayenge.',
          time: 'O(n log n)', space: 'O(1) (sort ke alawa)',
          code: `public boolean containsDuplicate(int[] nums) {
    Arrays.sort(nums);
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] == nums[i - 1]) return true;
    }
    return false;
}`,
        },
        {
          level: 'Optimal', idea: 'HashSet → O(1) lookup.',
          time: 'O(n)', space: 'O(n)',
          code: `public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
        if (!seen.add(x)) return true;
    }
    return false;
}`,
        },
      ],
      dryRun: '[1,2,3,1] → set {1}, {1,2}, {1,2,3}, add(1) false → true',
      interview: 'Brute force compares all pairs in O(n²). Sorting brings duplicates together in O(n log n). The optimal uses a HashSet for O(n) time, trading O(n) space.',
    },
    1: {
      oneLine: 'HashMap(value→index): har x pe check karo target−x pehle dekha kya.',
      pattern: 'Hashing',
      approaches: [
        {
          level: 'Brute', idea: 'Har pair try karo.',
          time: 'O(n²)', space: 'O(1)',
          code: `public int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) return new int[]{i, j};
        }
    }
    return new int[]{-1, -1};
}`,
        },
        {
          level: 'Better', idea: '(value, index) pairs sort karo, fir two pointers (l, r). Original index yaad rakhna padta hai.',
          time: 'O(n log n)', space: 'O(n)',
          code: `public int[] twoSum(int[] nums, int target) {
    int n = nums.length;
    int[][] arr = new int[n][2]; // {value, originalIndex}
    for (int i = 0; i < n; i++) arr[i] = new int[]{nums[i], i};
    Arrays.sort(arr, (a, b) -> Integer.compare(a[0], b[0]));
    int l = 0, r = n - 1;
    while (l < r) {
        int sum = arr[l][0] + arr[r][0];
        if (sum == target) return new int[]{arr[l][1], arr[r][1]};
        if (sum < target) l++;
        else r--;
    }
    return new int[]{-1, -1};
}`,
        },
        {
          level: 'Optimal', idea: 'One pass HashMap. Pehle check, fir put (taaki same element do baar na use ho).',
          time: 'O(n)', space: 'O(n)',
          code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>(); // value -> index
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (map.containsKey(need)) return new int[]{map.get(need), i};
        map.put(nums[i], i);
    }
    return new int[]{-1, -1};
}`,
        },
      ],
      dryRun: '[2,7,11,15], t=9 → i=0: need 7 nahi, put(2,0). i=1: need 2 mila → [0,1]',
      interview: 'For each element I need its complement target − x. Storing seen values with their index in a HashMap lets me find the complement in O(1), giving one pass, O(n) time and O(n) space.',
    },
    53: {
      oneLine: "Kadane: cur = max(x, cur+x), best = max(best, cur).",
      pattern: "Kadane's Algorithm",
      approaches: [
        {
          level: 'Brute', idea: 'Har (i, j) subarray ka sum fresh calculate karo.',
          time: 'O(n³)', space: 'O(1)',
          code: `public int maxSubArray(int[] nums) {
    int n = nums.length, max = Integer.MIN_VALUE;
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int sum = 0;
            for (int k = i; k <= j; k++) sum += nums[k];
            max = Math.max(max, sum);
        }
    }
    return max;
}`,
        },
        {
          level: 'Better', idea: 'j badhate waqt sum me bas nums[j] add karo — teesra loop hatao.',
          time: 'O(n²)', space: 'O(1)',
          code: `public int maxSubArray(int[] nums) {
    int n = nums.length, max = Integer.MIN_VALUE;
    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = i; j < n; j++) {
            sum += nums[j];
            max = Math.max(max, sum);
        }
    }
    return max;
}`,
        },
        {
          level: 'Optimal', idea: 'Negative sum ko aage le jaana nuksaan hai → chhod do aur yahin se naya start.',
          time: 'O(n)', space: 'O(1)',
          code: `public int maxSubArray(int[] nums) {
    int cur = 0, best = Integer.MIN_VALUE;
    for (int x : nums) {
        cur = Math.max(x, cur + x);
        best = Math.max(best, cur);
    }
    return best;
}`,
        },
      ],
      dryRun: '[-2,1,-3,4,-1,2,1,-5,4] → cur: -2,1,-2,4,3,5,6,1,5 → best = 6 ([4,-1,2,1])',
      interview: "At every index I decide whether to extend the previous subarray or start fresh: cur = max(x, cur + x). Tracking the best cur gives Kadane's O(n) time, O(1) space. Initialize best with MIN_VALUE so all-negative arrays work.",
    },
    26: {
      oneLine: 'Two pointers: k = unique ki next jagah; nums[i] != nums[k−1] toh likho.',
      pattern: 'In-place Two Pointer',
      approaches: [
        {
          level: 'Brute', idea: 'TreeSet me daalo (sorted + unique), wapas array me copy.',
          time: 'O(n log n)', space: 'O(n)',
          code: `public int removeDuplicates(int[] nums) {
    Set<Integer> set = new TreeSet<>();
    for (int x : nums) set.add(x);
    int k = 0;
    for (int x : set) nums[k++] = x;
    return k;
}`,
        },
        {
          level: 'Optimal', idea: 'Array sorted hai → duplicate hamesha pichle unique ke barabar hoga. Read pointer i, write pointer k.',
          time: 'O(n)', space: 'O(1)',
          code: `public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int k = 1; // next position for unique
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] != nums[k - 1]) {
            nums[k] = nums[i];
            k++;
        }
    }
    return k;
}`,
        },
      ],
      dryRun: '[0,0,1,1,1,2,2] → k=1; i=2 (1≠0) write → [0,1,…] k=2; i=5 (2≠1) → [0,1,2,…] k=3',
      interview: 'Since the array is sorted, duplicates are adjacent. I keep a write pointer k for the next unique slot and copy nums[i] only when it differs from nums[k−1]. O(n) time, O(1) space.',
    },
    238: {
      oneLine: 'ans[i] = (left product) × (right product); left ans me, right ek variable me.',
      pattern: 'Prefix / Suffix Product',
      approaches: [
        {
          level: 'Brute', idea: 'Har i ke liye baaki sab multiply karo.',
          time: 'O(n²)', space: 'O(1)',
          code: `public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    for (int i = 0; i < n; i++) {
        int p = 1;
        for (int j = 0; j < n; j++) {
            if (j != i) p *= nums[j];
        }
        ans[i] = p;
    }
    return ans;
}`,
        },
        {
          level: 'Better', idea: 'left[i] = i se pehle ka product, right[i] = i ke baad ka product. ans = left × right. (Division allowed nahi + zero ka issue.)',
          time: 'O(n)', space: 'O(n)',
          code: `public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] left = new int[n], right = new int[n], ans = new int[n];
    left[0] = 1;
    for (int i = 1; i < n; i++) left[i] = left[i - 1] * nums[i - 1];
    right[n - 1] = 1;
    for (int i = n - 2; i >= 0; i--) right[i] = right[i + 1] * nums[i + 1];
    for (int i = 0; i < n; i++) ans[i] = left[i] * right[i];
    return ans;
}`,
        },
        {
          level: 'Optimal', idea: 'left product seedha ans me likho, right product ek variable "suffix" me chalao.',
          time: 'O(n)', space: 'O(1) extra',
          code: `public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    ans[0] = 1;
    for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        ans[i] *= suffix;
        suffix *= nums[i];
    }
    return ans;
}`,
        },
      ],
      dryRun: '[1,2,3,4] → left: [1,1,2,6]; right pass suffix 1,4,12,24 → [24,12,8,6]',
      interview: 'Without division, each answer is the product of everything to the left times everything to the right. I store left products in the output, then sweep from the right with a running suffix. O(n) time, O(1) extra space.',
    },
    560: {
      oneLine: 'Prefix sum + HashMap(prefix→count); count += map[sum−k]; map.put(0,1).',
      pattern: 'Prefix Sum + HashMap',
      approaches: [
        {
          level: 'Brute', idea: 'Har subarray ka sum fresh nikalo.',
          time: 'O(n³)', space: 'O(1)',
          code: `public int subarraySum(int[] nums, int k) {
    int n = nums.length, count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int sum = 0;
            for (int x = i; x <= j; x++) sum += nums[x];
            if (sum == k) count++;
        }
    }
    return count;
}`,
        },
        {
          level: 'Better', idea: 'i fix karke j badhate waqt running sum.',
          time: 'O(n²)', space: 'O(1)',
          code: `public int subarraySum(int[] nums, int k) {
    int count = 0;
    for (int i = 0; i < nums.length; i++) {
        int sum = 0;
        for (int j = i; j < nums.length; j++) {
            sum += nums[j];
            if (sum == k) count++;
        }
    }
    return count;
}`,
        },
        {
          level: 'Optimal', idea: 'sum(i..j) = pre[j] − pre[i−1] = k ⇒ pre[i−1] = pre[j] − k. Pichle prefix sums ki frequency map me. Negatives hain isliye sliding window kaam nahi karega.',
          time: 'O(n)', space: 'O(n)',
          code: `public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>(); // prefixSum -> kitni baar aaya
    freq.put(0, 1);   // empty prefix (subarray index 0 se start ho)
    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;
        count += freq.getOrDefault(sum - k, 0);
        freq.put(sum, freq.getOrDefault(sum, 0) + 1);
    }
    return count;
}`,
        },
      ],
      dryRun: '[1,1,1], k=2 → sums 1,2,3. sum=2: map[0]=1 → count 1. sum=3: map[1]=1 → count 2',
      interview: 'A subarray ending at j sums to k iff some earlier prefix equals prefix[j] − k. I keep a HashMap of prefix-sum frequencies, seeded with {0:1}, for O(n) time. Sliding window fails here because of negative numbers.',
    },
    525: {
      oneLine: '0 → −1 bana do; ab "sum = 0 wala longest subarray" → balance ka first index map me.',
      pattern: 'Prefix Sum + HashMap',
      approaches: [
        {
          level: 'Brute', idea: 'Har subarray me zeros aur ones count karo.',
          time: 'O(n²)', space: 'O(1)',
          code: `public int findMaxLength(int[] nums) {
    int n = nums.length, max = 0;
    for (int i = 0; i < n; i++) {
        int zeros = 0, ones = 0;
        for (int j = i; j < n; j++) {
            if (nums[j] == 0) zeros++; else ones++;
            if (zeros == ones) max = Math.max(max, j - i + 1);
        }
    }
    return max;
}`,
        },
        {
          level: 'Better', idea: 'balance = (#1 − #0). Same balance do baar aaya ⇒ beech me equal 0/1. Pehla index map me rakho (longest ke liye).',
          time: 'O(n)', space: 'O(n)',
          code: `public int findMaxLength(int[] nums) {
    Map<Integer, Integer> first = new HashMap<>(); // balance -> pehli baar kis index pe
    first.put(0, -1);
    int bal = 0, max = 0;
    for (int i = 0; i < nums.length; i++) {
        bal += nums[i] == 1 ? 1 : -1;
        if (first.containsKey(bal)) max = Math.max(max, i - first.get(bal));
        else first.put(bal, i);
    }
    return max;
}`,
        },
        {
          level: 'Optimal', idea: 'Balance range −n..n hai → HashMap ki jagah size 2n+1 ka array (fast, no hashing).',
          time: 'O(n)', space: 'O(n)',
          code: `public int findMaxLength(int[] nums) {
    int n = nums.length;
    int[] first = new int[2 * n + 1];
    Arrays.fill(first, -2); // -2 = abhi tak nahi dekha
    first[n] = -1;          // balance 0 ko index n pe shift kiya
    int bal = 0, max = 0;
    for (int i = 0; i < n; i++) {
        bal += nums[i] == 1 ? 1 : -1;
        if (first[bal + n] != -2) max = Math.max(max, i - first[bal + n]);
        else first[bal + n] = i;
    }
    return max;
}`,
        },
      ],
      dryRun: '[0,1,0] → bal −1,0,−1. i=1: bal 0 first −1 → len 2. i=2: bal −1 first 0 → len 2',
      interview: 'Treat 0 as −1; then equal zeros and ones means a zero-sum subarray. Two equal prefix balances bound such a subarray, so I store the first index of each balance. O(n) time and space.',
    },
    41: {
      oneLine: 'Cyclic sort: value x ko index x−1 pe bhejo; pehla galat index + 1 = answer.',
      pattern: 'Index as Hash',
      approaches: [
        {
          level: 'Brute', idea: '1, 2, 3 … har number ke liye poora array scan karo.',
          time: 'O(n²)', space: 'O(1)',
          code: `public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int x = 1; x <= n + 1; x++) {
        boolean found = false;
        for (int v : nums) {
            if (v == x) { found = true; break; }
        }
        if (!found) return x;
    }
    return n + 1;
}`,
        },
        {
          level: 'Better', idea: 'Sab HashSet me daalo, 1 se check karo. Answer hamesha 1..n+1 me hota hai.',
          time: 'O(n)', space: 'O(n)',
          code: `public int firstMissingPositive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int x : nums) set.add(x);
    for (int x = 1; x <= nums.length + 1; x++) {
        if (!set.contains(x)) return x;
    }
    return nums.length + 1;
}`,
        },
        {
          level: 'Optimal', idea: 'Array ko hi hash bana do: x (1..n) ko index x−1 pe swap karo. Fir jahan nums[i] != i+1, answer i+1.',
          time: 'O(n)', space: 'O(1)',
          code: `public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        // nums[i] ko uski sahi jagah (index nums[i]-1) pe bhejo
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            int j = nums[i] - 1;
            int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
        }
    }
    for (int i = 0; i < n; i++) {
        if (nums[i] != i + 1) return i + 1;
    }
    return n + 1;
}`,
        },
      ],
      dryRun: '[3,4,-1,1] → swaps → [1,-1,3,4] → index 1 pe −1 ≠ 2 → answer 2',
      interview: 'The answer must lie in 1..n+1. I use the array itself as a hash: place each value x in [1,n] at index x−1 via swaps — each swap fixes one element so it is O(n) total — then the first index i with nums[i] ≠ i+1 gives i+1. O(1) extra space.',
    },
    128: {
      oneLine: 'HashSet; sirf wahan se count karo jahan x−1 set me nahi (sequence ka start).',
      pattern: 'Hashing',
      approaches: [
        {
          level: 'Brute', idea: 'Har x se x+1, x+2… linear search se dhundo.',
          time: 'O(n³) worst', space: 'O(1)',
          code: `public int longestConsecutive(int[] nums) {
    int best = 0;
    for (int x : nums) {
        int len = 1;
        while (contains(nums, x + len)) len++;
        best = Math.max(best, len);
    }
    return best;
}

private boolean contains(int[] a, int t) {
    for (int v : a) if (v == t) return true;
    return false;
}`,
        },
        {
          level: 'Better', idea: 'Sort karo, consecutive count karo (duplicates skip).',
          time: 'O(n log n)', space: 'O(1)',
          code: `public int longestConsecutive(int[] nums) {
    if (nums.length == 0) return 0;
    Arrays.sort(nums);
    int best = 1, cur = 1;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] == nums[i - 1]) continue;       // duplicate skip
        if (nums[i] == nums[i - 1] + 1) cur++;
        else cur = 1;
        best = Math.max(best, cur);
    }
    return best;
}`,
        },
        {
          level: 'Optimal', idea: 'HashSet. Har element sirf ek baar "while" me aata hai kyunki hum sirf start se count karte hain.',
          time: 'O(n)', space: 'O(n)',
          code: `public int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int x : nums) set.add(x);
    int best = 0;
    for (int x : set) {
        if (!set.contains(x - 1)) {          // sirf sequence ke start se count karo
            int len = 1;
            while (set.contains(x + len)) len++;
            best = Math.max(best, len);
        }
    }
    return best;
}`,
        },
      ],
      dryRun: '[100,4,200,1,3,2] → starts: 100 (len1), 200 (len1), 1 → 1,2,3,4 (len4) → 4',
      interview: 'I put all numbers in a HashSet and only start counting from numbers whose predecessor is absent. Each number is visited a constant number of times, so it is O(n) despite the nested while.',
    },
    169: {
      oneLine: 'Boyer-Moore: count 0 → naya candidate; same +1, alag −1.',
      pattern: 'Boyer-Moore Voting',
      approaches: [
        {
          level: 'Brute', idea: 'Har element ka count nikalo.',
          time: 'O(n²)', space: 'O(1)',
          code: `public int majorityElement(int[] nums) {
    int n = nums.length;
    for (int x : nums) {
        int cnt = 0;
        for (int y : nums) if (y == x) cnt++;
        if (cnt > n / 2) return x;
    }
    return -1;
}`,
        },
        {
          level: 'Better', idea: 'HashMap frequency (ya sort karke nums[n/2]).',
          time: 'O(n)', space: 'O(n)',
          code: `public int majorityElement(int[] nums) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) {
        int c = freq.getOrDefault(x, 0) + 1;
        if (c > nums.length / 2) return x;
        freq.put(x, c);
    }
    return -1;
}`,
        },
        {
          level: 'Optimal', idea: 'Majority > n/2 hai → baaki sab milke bhi use cancel nahi kar sakte.',
          time: 'O(n)', space: 'O(1)',
          code: `public int majorityElement(int[] nums) {
    int cand = 0, count = 0;
    for (int x : nums) {
        if (count == 0) cand = x;
        count += (x == cand) ? 1 : -1;
    }
    return cand;
}`,
        },
      ],
      dryRun: '[2,2,1,1,1,2,2] → cand 2(1),2(2),(1),(0),cand 1(1),(0),cand 2(1),2(2) → 2',
      interview: 'Boyer-Moore voting: pair off each majority vote against a different element. Because the majority appears more than n/2 times, it survives as the candidate. O(n) time, O(1) space.',
    },
    1295: {
      oneLine: 'Har number ke digits gino (/10 se); even digits wale count karo.',
      pattern: 'Traversal + Count',
      approaches: [
        {
          level: 'Brute', idea: 'Har number ko String me badlo aur length dekho — even ho toh count++.',
          time: 'O(n·d)', space: 'O(d) (har String)',
          code: `public int findNumbers(int[] nums) {
    int count = 0;
    for (int x : nums) {
        if (String.valueOf(x).length() % 2 == 0) count++;
    }
    return count;
}`,
        },
        {
          level: 'Optimal', idea: 'Bina String banaye: x ko 10 se divide karte jao, har division = 1 digit. Even digits → count++.',
          time: 'O(n·d)', space: 'O(1)',
          code: `public int findNumbers(int[] nums) {
    int count = 0;
    for (int x : nums) {
        int digits = 0;
        while (x > 0) {
            digits++;
            x /= 10;
        }
        if (digits % 2 == 0) count++;
    }
    return count;
}`,
        },
      ],
      dryRun: '[12,345,2,6,7896] → digits 2,3,1,1,4 → even: 12, 7896 → 2',
      interview: 'I traverse the array once and, for each number, count its digits by repeatedly dividing by ten. If the digit count is even I increment the answer. Each number has at most d digits, so it is O(n·d) time, effectively O(n) because d is at most 6 here, and O(1) extra space. Converting to a String also works but creates an object per element.',
    },
    303: {
      oneLine: 'Constructor me prefix[i+1] = prefix[i] + nums[i]; har query prefix[r+1] − prefix[l] → O(1).',
      pattern: 'Prefix Sum (Range Query)',
      approaches: [
        {
          level: 'Brute', idea: 'nums store karo; har sumRange pe left..right loop chala ke sum karo. Q queries → O(Q·n).',
          time: 'O(n) per query', space: 'O(1) extra',
          code: `class NumArray {
    private int[] nums;

    public NumArray(int[] nums) {
        this.nums = nums;
    }

    public int sumRange(int left, int right) {
        int sum = 0;
        for (int i = left; i <= right; i++) sum += nums[i];
        return sum;
    }
}`,
        },
        {
          level: 'Optimal', idea: 'Ek baar prefix array (size n+1, prefix[0] = 0) banao. sum(left..right) = prefix[right+1] − prefix[left] — L = 0 ka special case nahi.',
          time: 'O(n) build, O(1) per query', space: 'O(n)',
          code: `class NumArray {
    private int[] prefix;

    public NumArray(int[] nums) {
        prefix = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }

    public int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
}`,
        },
      ],
      dryRun: 'nums = [-2,0,3,-5,2,-1] → prefix = [0,-2,-2,1,-4,-2,-3]; sumRange(0,2) = prefix[3] − prefix[0] = 1; (2,5) = −3 − (−2) = −1; (0,5) = −3',
      interview: 'Because the array never changes and there can be many queries, I precompute a prefix array of size n + 1 where prefix[i + 1] = prefix[i] + nums[i]. Then the sum from left to right is prefix[right + 1] − prefix[left], which is O(1) per query after an O(n) build, using O(n) space. The extra leading zero removes the special case when left is 0.',
    },
    268: {
      oneLine: '0..n me se ek missing: XOR (sab index ^ sab value ^ n) ya sum formula n(n+1)/2 − sum.',
      pattern: 'Math / XOR (Missing Number)',
      approaches: [
        {
          level: 'Brute', idea: 'Sort karo; jahan nums[i] != i wahi missing (koi nahi toh n).',
          time: 'O(n log n)', space: 'O(1) (sort ke alawa)',
          code: `public int missingNumber(int[] nums) {
    Arrays.sort(nums);
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != i) return i;
    }
    return nums.length;
}`,
        },
        {
          level: 'Better', idea: '0..n ka expected sum n(n+1)/2; usme se actual sum ghatao = missing.',
          time: 'O(n)', space: 'O(1)',
          code: `public int missingNumber(int[] nums) {
    int n = nums.length;
    int expected = n * (n + 1) / 2;
    int actual = 0;
    for (int x : nums) actual += x;
    return expected - actual;
}`,
        },
        {
          level: 'Optimal', idea: 'XOR: a ^ a = 0, a ^ 0 = a. Saare indices 0..n aur saari values XOR karo — jo jode me nahi woh missing bachta hai. Overflow ka dar nahi.',
          time: 'O(n)', space: 'O(1)',
          code: `public int missingNumber(int[] nums) {
    int n = nums.length;
    int xor = n;
    for (int i = 0; i < n; i++) {
        xor ^= i ^ nums[i];
    }
    return xor;
}`,
        },
      ],
      dryRun: '[3,0,1], n = 3: xor = 3 → ^0^3 = 0 → ^1^0 = 1 → ^2^1 = 2 → return 2',
      interview: 'The numbers are 0 to n with exactly one missing. With the sum formula, the expected total is n(n + 1) / 2, and subtracting the actual sum gives the missing value in O(n) time and O(1) space. I prefer XOR because it cannot overflow: XOR all indices 0 to n with all values; every number that is present cancels with its index, since a ^ a = 0, and only the missing number remains.',
    },
  },

  // ---------------- DAILY PLAN (14 din = 2 weeks, course ke 15 questions) ----------------
  // Mon–Fri: 1 topic, dono same questions — qs[0] = MUST, qs[1] (agar hai) = PUSH (time ho toh).
  // Sat: revision (3–4). Sun: mock + contest.
  days: [
    {
      day: 1, week: 1, dow: 'Mon', type: 'learn', title: 'Introduction to Arrays — Memory, Index, Complexity',
      theory: ['Continuous memory, fixed size', 'Zero-based index → O(1) access', 'Search / insert / delete O(n)', 'print, max, min, sum, average'],
      qs: [1920, 26],
      interview: {
        q: 'Why is array access O(1) but insertion in the middle O(n)?',
        a: 'An array stores its elements in one continuous block of memory, and every element has the same size. So the address of index i is simply base address plus i times the element size, which is one calculation, O(1), no matter how big the array is. Inserting in the middle is different: to keep the elements continuous, every element after that position has to shift one place to the right, and in the worst case that is all n elements, so O(n). Deleting from the middle shifts elements left for the same reason.',
      },
    },
    {
      day: 2, week: 1, dow: 'Tue', type: 'learn', title: 'Traversal Mastery — Count, Search, Compare, Second Largest',
      theory: ['Har element ek baar = O(n)', 'Count / search / replace / compare / transform', 'Second largest ek pass me', 'Running sum = pichla + current'],
      qs: [1480, 1295],
      interview: {
        q: 'How do you find the second largest element in one pass?',
        a: 'I keep two variables, largest and second, both starting at the smallest possible value. For every element, if it is greater than largest, the old largest becomes second and the element becomes largest. Otherwise, if it is greater than second and not equal to largest, it becomes second. One pass, O(n) time, O(1) space. I also clarify with the interviewer what to return if all elements are equal, because then a distinct second largest does not exist.',
      },
    },
    {
      day: 3, week: 1, dow: 'Wed', type: 'learn', title: 'Hashing — Frequency Map, Duplicates, Majority',
      theory: ['Nested loop O(n²) → HashSet/HashMap O(n)', 'Frequency: getOrDefault(x, 0) + 1', 'Duplicate = "pehle dekha?"', 'Majority: count > n/2'],
      qs: [217, 169],
      interview: {
        q: 'How does a HashMap give O(1) lookups, and what is the trade-off?',
        a: 'A HashMap computes the hash code of the key and uses it to pick a bucket in an internal array, so finding a key is usually one bucket lookup, which is O(1) on average. If many keys collide in one bucket, lookups slow down, and in Java 8 and later a crowded bucket is turned into a balanced tree, so the worst case is O(log n). The trade-off is extra memory: I trade O(n) space to bring an O(n²) nested-loop solution down to O(n) time.',
      },
    },
    {
      day: 4, week: 1, dow: 'Thu', type: 'learn', title: 'HashMap Pattern — "Seen Before?" (Two Sum)',
      theory: ['Brute: har pair O(n²)', 'need = target − nums[i]', 'Pehle lookup, phir insert', 'value → index map'],
      qs: [1],
      interview: {
        q: 'Walk me through the optimal Two Sum solution.',
        a: 'For each element I ask whether its complement, target minus the element, has already appeared. I keep a HashMap from value to index. At index i, I compute need = target − nums[i]; if need is in the map, I return its stored index and i. Otherwise I put nums[i] with index i into the map. I look up before inserting so that an element is never paired with itself. One pass, O(n) time and O(n) space, compared with O(n²) for checking every pair.',
      },
    },
    {
      day: 5, week: 1, dow: 'Fri', type: 'learn', title: 'Prefix Sum — Running Sum, Prefix Array, Range Query',
      theory: ['prefix[i] = prefix[i−1] + arr[i]', 'sum(L..R) = prefix[R] − prefix[L−1]', 'Size n+1 trick (L = 0)', 'Build O(n), query O(1)'],
      qs: [303],
      interview: {
        q: 'What is a prefix sum and when do you use it?',
        a: 'A prefix sum array stores, at each position, the total of all elements before it. Building it takes one O(n) pass, and after that any range sum is the difference of two prefix values, O(1) per query. I use it when the array does not change and there are many range-sum queries. I usually make it size n + 1 with prefix[0] = 0, so the sum from L to R is prefix[R + 1] − prefix[L], with no special case for L = 0.',
      },
    },
    {
      day: 6, week: 1, dow: 'Sat', type: 'learn', title: 'Prefix Applications — Repeated Queries + prefix − k',
      theory: ['Repeated range query: O(n) vs O(1)', 'HashMap + Prefix', 'prefix − k = pehle dekha?', 'freq.put(0, 1) kyun'],
      qs: [560],
      interview: {
        q: 'How do you count subarrays with sum k in O(n)?',
        a: 'A subarray from j + 1 to i has sum k exactly when prefix[i] − prefix[j] = k, that is, when an earlier prefix equals prefix[i] − k. So while I scan, I keep a running sum and a HashMap counting how many times each prefix sum has appeared. At each index I add the count of sum − k to the answer, then record the current sum. I start the map with 0 mapped to 1 so subarrays starting at index 0 are counted. This works with negative numbers, unlike a sliding window, and runs in O(n) time with O(n) space.',
      },
    },
    {
      day: 7, week: 1, dow: 'Sun', type: 'mock', title: 'Revision + Interview Practice + Mini Mock + Contest',
      theory: ['Theory quiz bina notes', 'Whiteboard dry run (bina IDE)', 'Brute → Better → Optimal bolna', 'Week 1 deliverables'],
      qs: [1920, 1480, 217, 1, 169, 303, 560],
      interview: {
        q: 'How do you explain a solution in an interview?',
        a: 'I restate the problem and confirm inputs, outputs and edge cases. Then I give the brute-force approach with its time and space complexity, explain what work is being repeated, and show how a better idea, such as a HashMap or a prefix sum, removes that repetition. I walk through the optimal approach on a small example, state its complexity, code it while narrating, and finish by testing an edge case. Finally I say why the approach is correct, not just what it does.',
      },
    },
    {
      day: 8, week: 2, dow: 'Mon', type: 'learn', title: "Kadane's Algorithm — Maximum Subarray",
      theory: ['cur = max(x, cur + x)', 'best = max(best, cur)', 'Local vs global answer', 'Reset kab: pichla sum bojh ho'],
      qs: [53],
      interview: {
        q: "Explain Kadane's algorithm.",
        a: 'I scan the array once and keep two values: the best sum of a subarray that ends at the current index, and the best sum seen anywhere. At each element I decide whether to extend the previous subarray or start fresh here: current = max(x, current + x). If the previous running sum is negative, it can only hurt, so starting fresh is better. Then best = max(best, current). That is O(n) time and O(1) space, compared with O(n²) for checking every start and end.',
      },
    },
    {
      day: 9, week: 2, dow: 'Tue', type: 'learn', title: 'Product Except Self — Prefix × Suffix Product',
      theory: ['Left product (prefix)', 'Right product (suffix)', 'ans[i] = left[i] × right[i]', 'Division nahi (0 ka case)'],
      qs: [238],
      interview: {
        q: 'How do you compute product of array except self without division?',
        a: 'The product of everything except index i is the product of all elements to its left times the product of all elements to its right. I first fill the answer array with left products in one pass from the left, then walk from the right with a running suffix product and multiply it in. That is O(n) time and O(1) extra space apart from the output. I avoid division because a zero in the input would break it, and the problem also forbids it.',
      },
    },
    {
      day: 10, week: 2, dow: 'Wed', type: 'learn', title: 'Missing Number Pattern — XOR / Sum + Index Placement',
      theory: ['Value v ki jagah index v − 1', 'Missing Number: sum formula / XOR', 'Cyclic placement (swap)', 'O(n) time, O(1) space'],
      qs: [268, 41],
      interview: {
        q: 'How do you find the first missing positive in O(n) time and O(1) space?',
        a: 'The answer must be between 1 and n + 1, so I use the array itself as a hash table: value v belongs at index v − 1. I walk the array and keep swapping each value in the range 1 to n into its correct position, skipping duplicates and values outside the range. Every swap puts at least one value in its final place, so there are at most n swaps in total, which keeps it O(n). Then the first index i where nums[i] is not i + 1 gives the answer i + 1, and if all are correct the answer is n + 1.',
      },
    },
    {
      day: 11, week: 2, dow: 'Thu', type: 'learn', title: 'Longest Consecutive Sequence — HashSet Sequence Pattern',
      theory: ['Brute / Sort / HashSet', 'Start sirf jab x − 1 set me nahi', 'Duplicates skip (set)', 'Har element ek baar → O(n)'],
      qs: [128],
      interview: {
        q: 'Why is the HashSet solution for longest consecutive sequence O(n)?',
        a: 'I put all numbers in a hash set. Then I only start counting from a number x if x − 1 is not in the set, which means x is the first element of its sequence. From there I count x + 1, x + 2 and so on. Because each sequence is counted only from its start, every number is visited by the inner loop at most once overall. So the total work is O(n), plus O(n) space for the set, which beats sorting at O(n log n).',
      },
    },
    {
      day: 12, week: 2, dow: 'Fri', type: 'learn', title: 'Prefix + HashMap — Equal 0s and 1s (Contiguous Array)',
      theory: ['0 → −1 conversion', 'Balance (prefix sum)', 'Same balance dobara = balanced subarray', 'Pehla index store (longest)'],
      qs: [525],
      interview: {
        q: 'Why does a repeated prefix sum mean a balanced subarray?',
        a: 'I treat every 0 as −1 and every 1 as +1, and keep a running balance. If the balance at index j equals the balance at an earlier index i, then the elements between them added up to zero, which means they contain the same number of zeros and ones. To get the longest such subarray, I store only the first index where each balance appears, starting with balance 0 at index −1, and at every index compare the current index with that first occurrence. O(n) time, O(n) space.',
      },
    },
    {
      day: 13, week: 2, dow: 'Sat', type: 'revision', title: 'Mixed Pattern Recognition — Pattern pehchano, phir re-solve',
      theory: ['Title se pattern guess', 'Prefix / Kadane / HashMap / Traversal', 'Product / Cyclic / HashSet', 'Bolte hue solve'],
      qs: [1, 217, 53, 238, 41, 128],
      interview: {
        q: 'How do you identify the right pattern for an array problem?',
        a: 'I look for clues in the question. Maximum contiguous sum suggests Kadane. Product of everything except the current element suggests prefix and suffix products. Numbers in the range 1 to n with something missing suggests index placement. Longest run of consecutive values suggests a hash set started at sequence heads. Subarray sums equal to k, or equal counts of two kinds, suggest prefix sums with a hash map. Then I confirm with the expected complexity, usually O(n).',
      },
    },
    {
      day: 14, week: 2, dow: 'Sun', type: 'mock', title: 'Mock Interview — Week 2 (Sohvi 30 min, Tum 45 min) + Contest',
      theory: ['Sohvi: LC 1480, 217', 'Tum: LC 560, 238, 525 — 11-step order', 'Pattern pehle bolo', 'LeetCode Weekly Contest — Sunday 8:00 AM IST'],
      qs: [1480, 217, 560, 238, 525],
      interview: {
        q: 'Walk me through how you answer a coding interview question.',
        a: 'I clarify the problem and edge cases, then name the pattern I think applies and why. I describe the brute-force approach with its complexity, a better approach if there is one, and then the optimal approach with its time and space complexity. I mention edge cases, walk through one example by hand, write the code while explaining each step, and finally dry run the code on that example to check it.',
      },
    },
  ],

  // ---------------- LAST MINUTE ----------------
  lastMinute: {
    triggers: [
      ['Range / subarray sum', 'Prefix Sum'],
      ['Count subarrays with sum = k (negatives bhi)', 'Prefix Sum + HashMap (put(0,1))'],
      ['Pair with sum / complement', 'HashMap (value → index)'],
      ['Duplicate / seen before', 'HashSet'],
      ['Max subarray sum', "Kadane"],
      ['Sorted array, in-place remove', 'Read / write two pointers'],
      ['Values in 1..n, missing/duplicate, O(1) space', 'Cyclic sort (index as hash)'],
      ['Majority > n/2', 'Boyer-Moore'],
      ['Product / sum of all except self', 'Prefix × Suffix'],
      ['Equal 0s and 1s', '0 → −1, balance + first-index map'],
    ],
    edge: [
      'Empty array / 1 element',
      'All negative (Kadane → best = MIN_VALUE se start)',
      'Duplicates (Two Sum me same index do baar nahi)',
      'Integer overflow → long use karo',
      'k = 0 / target = 0',
    ],
    mistakes: [
      'map.put(0, 1) bhoolna (Subarray Sum K)',
      'Two Sum me pehle put fir check → same element khud se pair ho jaata hai',
      'Loop me i <= n → ArrayIndexOutOfBounds',
      'Sliding window lagana jab negatives ho (galat!)',
      'Integer ko == se compare karna (−128..127 ke bahar fail) → .equals()',
    ],
  },
};
