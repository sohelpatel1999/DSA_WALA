// Phase 12 (Revision + Mocks) — Week 1 lessons (local days 1–7 = global days 155–161).
// Sirf Phases 1–11 ke course questions re-solve. Koi naya problem nahi.
(function () {
  const P = window.PHASE_CONTENT['revision'];
  P.lessons = P.lessons || {};

  // Re-solve question ka standard part: problem recap → example → pattern → thinking → key code → edge → memory hook
  function recap(title, q) {
    const blocks = [
      { p: q.problem },
      { pre: q.example },
      { p: '<b>Pattern:</b> ' + q.pattern + ' · <b>Timer:</b> ' + q.timer },
      { h: 'Thinking steps (bolke)' },
      { olist: q.steps },
      { h: 'Key code' },
      { code: q.code },
    ];
    if (q.edge) blocks.push({ table: { head: ['Edge case', 'Kya hona chahiye'], rows: q.edge } });
    blocks.push({ tip: 'Memory hook: <b>' + q.hook + '</b>' });
    return { title: title, blocks: blocks };
  }

  // Mock question ka part: problem → kya poochna hai → hints ladder → rubric → reference code
  function mockQ(title, q) {
    return { title: title, blocks: [
      { p: q.problem },
      { pre: q.example },
      { h: 'Interviewer kya poochega (clarify + follow-ups)' },
      { list: q.ask },
      { h: 'Hints ladder (sirf 3–4 min atakne pe, ek-ek karke)' },
      { olist: q.hints },
      { h: 'Rubric (har row 0–2 marks)' },
      { table: { head: ['Area', 'Kya dekhna hai', 'Marks (0–2)'], rows: q.rubric } },
      { h: 'Reference code (mock ke BAAD hi kholo)' },
      { code: q.code },
      { tip: 'Memory hook: <b>' + q.hook + '</b>' },
    ] };
  }

  const PLAN_TABLE = { table: { head: ['Time', 'Kya', 'Rule'], rows: [
    ['5 min', 'Problem padho + clarify', 'Input, output, constraints, edge cases bolke'],
    ['5 min', 'Brute → Optimal bolo', 'Complexity ke saath — abhi code nahi'],
    ['15–25 min', 'Code (bina dekhe)', 'Easy 15 · Medium 25 · Hard 40'],
    ['5 min', 'Dry run + edge cases', 'Example + 1 edge case haath se'],
    ['Baaki', 'Stretch target', 'Sohvi: 2 Easy + 1 Medium · Tum: 3 Medium + 1 Hard (course list se)'],
  ] } };

  Object.assign(P.lessons, {
    // ======================= DAY 1 =======================
    1: {
      title: 'Re-solve — Arrays + Hashing',
      goal: 'Phase 12 shuru: koi naya topic nahi. Aaj <b>Arrays + Hashing</b> ke do classic questions bina dekhe re-solve — LC 1 (complement HashMap) aur LC 238 (prefix × suffix). Saath me <b>mistake log</b> shuru karna.',
      main: 1,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules)',
          blocks: [
            { p: 'Last 2 weeks ka rule simple hai: <b>yaad se nikaalo, padh ke nahi</b>. Har question pe pehle bolo, phir likho, phir test karo.' },
            PLAN_TABLE,
            { list: [
              'Notes / pichla code band. Sirf blank editor.',
              'Atak gaye? Last Minute tab ka "Signal → Pattern" dekho (solution nahi).',
              '<b>Mistake log</b> banao: date · LC number · galti 1 line me. Ye log Saturday ko padhna hai.',
              'Course target (time ho toh): Sohvi → 2 Easy + 1 Medium, Tum → 3 Medium + 1 Hard.',
            ] },
            { tip: 'Memory hook: <b>Revision = retrieval. Jo bina dekhe nahi nikla, wahi weak spot.</b>' },
          ],
        },
        recap('Part 1 — Re-solve (MUST): LC 1 Two Sum', {
          problem: 'Ek integer array aur ek target diya hai. Do <b>alag indices</b> return karo jinke values ka sum target ho. Exactly ek answer guaranteed hai.',
          example: 'nums = [2, 7, 11, 15], target = 9\n\ni=0: need = 9-2 = 7  → map me nahi → put(2 → 0)\ni=1: need = 9-7 = 2  → map me hai (index 0) → return [0, 1]',
          pattern: 'Hashing — complement lookup',
          timer: 'Easy · 15 min',
          steps: [
            'Brute: har pair (i, j) check → O(n²).',
            'Observation: har x ke liye sirf ye jaanna hai ki <code>target − x</code> pehle aaya kya.',
            'HashMap me value → index store karo. Pehle check, phir put (khud se pair na ho).',
            'Ek pass → O(n) time, O(n) space.',
          ],
          code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (map.containsKey(need)) return new int[]{map.get(need), i};
        map.put(nums[i], i);
    }
    return new int[]{};
}`,
          edge: [
            ['<code>[3, 3]</code>, target 6', '<code>[0, 1]</code> — check pehle, put baad me isliye kaam karta hai'],
            ['Negative numbers', 'Koi fark nahi — HashMap me sab chalta hai'],
            ['<code>[3, 2, 4]</code>, target 6', '<code>[1, 2]</code> — 3 khud se pair nahi hona chahiye'],
          ],
          hook: 'Chahiye kya? target − x. Pehle pucho, phir rakho.',
        }),
        {
          title: 'Part 2 — Re-solve (PUSH): LC 238 Product of Array Except Self',
          blocks: [
            { problem: 238 },
            { p: '<b>Pattern:</b> Prefix × Suffix · <b>Timer:</b> Medium · 25 min · <b>Constraint:</b> division use nahi karna, O(n).' },
            { h: 'Thinking steps (bolke)' },
            { olist: [
              'Brute: har i ke liye baaki sab multiply → O(n²).',
              'ans[i] = (i ke left ka product) × (i ke right ka product).',
              'Pass 1 (left → right): <code>ans[i]</code> me left product rakho.',
              'Pass 2 (right → left): ek variable <code>suffix</code> se multiply karte jao → extra array nahi, O(1) extra space (output chhod ke).',
            ] },
            { pre: 'nums   = [1, 2, 3, 4]\nleft   = [1, 1, 2, 6]      (ans after pass 1)\nsuffix:  i=3 → 1, i=2 → 4, i=1 → 12, i=0 → 24\nans    = [24, 12, 8, 6]' },
            { h: 'Key code' },
            { code: `public int[] productExceptSelf(int[] nums) {
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
}` },
            { p: 'Visualizer (Phase 1 wala) me Example 1 chala ke dono passes match karo:' },
            { viz: 238, ex: 0 },
            { tip: 'Memory hook: <b>Left ka product × Right ka product. Pehle left array me, right ek variable me.</b>' },
          ],
        },
        {
          title: 'Part 3 — Pattern family: Arrays + Hashing ek nazar me',
          blocks: [
            { table: { head: ['Signal', 'Pattern', 'Course questions', 'Key line'], rows: [
              ['Pair with sum (unsorted)', 'Complement HashMap', 'LC 1', '<code>map.containsKey(target - x)</code>'],
              ['Duplicate hai kya', 'HashSet', 'LC 217', '<code>if (!set.add(x)) return true;</code>'],
              ['Subarray sum = k', 'Prefix + HashMap', 'LC 560, LC 525', '<code>cnt.put(0, 1)</code>'],
              ['Except self', 'Prefix × Suffix', 'LC 238', '<code>ans[i] *= suffix</code>'],
              ['Longest consecutive', 'HashSet + start check', 'LC 128', '<code>if (!set.contains(x - 1))</code>'],
              ['Max subarray', 'Kadane', 'LC 53', '<code>cur = max(x, cur + x)</code>'],
            ] } },
            { tip: 'Interview me pattern ka naam bolna = 50% kaam. "This looks like a complement lookup, so a HashMap gives O(n)."' },
          ],
        },
        {
          title: 'Part 4 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['Two Sum me pehle <code>put</code> phir check kiya toh kya bug aayega?', 'Element khud se pair ban sakta hai — e.g. <code>[3, 2, 4]</code>, target 6 pe 3 + 3 = 6 → galat <code>[0, 0]</code>.'],
              ['Two Sum sorted array me ho toh?', 'Two pointers (LC 167) — O(n) time, O(1) space, HashMap ki zaroorat nahi.'],
              ['LC 238 me division kyun nahi?', 'Zero aaye toh divide-by-zero, aur problem explicitly mana karti hai. Prefix × suffix zero ko bhi handle karta hai.'],
              ['LC 238 ka space O(1) kaise bola?', 'Output array count nahi hota; baaki sirf ek <code>suffix</code> variable hai.'],
              ['HashMap ka average aur worst case lookup?', 'Average O(1). Worst O(n) collisions se; Java 8+ me bada bucket tree ban jaata hai → O(log n).'],
              ['Agar Two Sum me saare pairs chahiye (count)?', 'Map me frequency rakho aur har x pe <code>count += freq(target − x)</code> karo, phir x ki freq badhao.'],
            ] },
          ],
        },
        {
          title: 'Part 5 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 1 — approach explain karo', 'The brute force checks every pair in O(n²). Instead, for each number x I only need to know whether target − x appeared earlier. I keep a HashMap from value to index; for each element I first look up the complement and return both indices if it exists, otherwise I store the current value. Checking before inserting prevents pairing an element with itself. It is one pass, O(n) time and O(n) space.'],
              ['LC 238 — approach explain karo', 'The answer at i is the product of everything to the left times everything to the right. In the first pass I fill the output with left products. In the second pass I go from the right, keeping a running suffix product in one variable and multiplying it into the output. No division is needed, so zeros are handled naturally. Time is O(n) and extra space is O(1) apart from the output.'],
              ['Follow-up: "What if the input does not fit in memory?"', 'For Two Sum on a huge stream I would still need some memory for seen values, so I would discuss constraints: if the data can be sorted externally, two pointers over sorted chunks avoids a giant map; if values are bounded, a bitmap or counting array is far smaller than a HashMap.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Sohvi session',
          blocks: [
            { olist: [
              'LC 1 bina dekhe likho. Pehle paper pe map ka table banao (value → index) Example 1 ke liye.',
              'Ek line me bolo: "Mujhe har number ka jodidaar chahiye: target − x".',
              'LC 238 ka sirf <b>left product array</b> haath se banao <code>[1, 2, 3, 4]</code> ke liye. Code optional.',
              'Visualizer me LC 238 Example 1 step-by-step chalao.',
              '<b>Course target (time ho toh):</b> 2 Easy + 1 Medium → LC 217, LC 1480 (Easy) + LC 53 (Medium).',
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 1 + LC 238 dono memory se, 15 min total. Timer lagao.',
              '<b>Task B:</b> LC 238 ka 1-minute answer English me bolo (record karke suno).',
              '<b>Task C:</b> Follow-up: LC 238 me agar exactly ek zero ho, ya do zero ho — output kya hoga? Bina code ke explain karo.',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 560, LC 525, LC 128 + LC 41 (Hard).',
              'SDE-2 switch prep (parallel): 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Homework',
          blocks: [
            { list: [
              'Dono: LC 1 aur LC 238 LeetCode pe dobara submit (Accepted).',
              'Mistake log me aaj ki galtiyan likho (agar koi nahi hui toh "clean" likho).',
              'Kal (Day 2): Two Pointers — LC 125 aur LC 42. Pehle se problem padh lo, code nahi.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>nums = [3, 2, 4], target = 6</code> ka answer?', '<code>[1, 2]</code>'],
              ['<code>[2, 3, 0, 4]</code> ka product except self?', '<code>[0, 0, 24, 0]</code> — sirf zero wale index pe baaki sab ka product.'],
              ['Two Sum ka time / space?', 'O(n) / O(n).'],
              ['LC 238 ke dono passes me kya hota hai?', 'Pass 1: left products ans me. Pass 2: right se suffix variable multiply.'],
              ['"Subarray sum equals k" kis pattern se?', 'Prefix sum + HashMap (put(0, 1) seed ke saath) — LC 560.'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 1 bina dekhe 15 min me Accepted',
        'LC 238 bina dekhe likha (Sohel: must · Sohvi: left product samjha)',
        'Check-before-put kyun, explain kar sakta/sakti hu',
        'Arrays + Hashing pattern table zubaani bol sakta/sakti hu',
        '1-minute answer English me bola',
        'Mistake log shuru kiya',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Two Sum: pehle pucho (target − x), phir rakho. Except self: left × right, right ek variable me.',
    },

    // ======================= DAY 2 =======================
    2: {
      title: 'Re-solve — Two Pointers',
      goal: 'Opposite-direction two pointers ka revision: LC 125 (palindrome, skip non-alphanumeric) aur LC 42 (trapping rain water — leftMax / rightMax). Focus: <b>kaunsa pointer kab move karna hai aur kyun safe hai</b>.',
      main: 125,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules)',
          blocks: [
            PLAN_TABLE,
            { list: [
              'Kal ki mistake log 2 min padho.',
              'Aaj ka rule: code se pehle bolo — "Moving this pointer is safe because…".',
              'Course target (time ho toh): Sohvi → 2 Easy + 1 Medium, Tum → 3 Medium + 1 Hard.',
            ] },
            { tip: 'Memory hook: <b>Two pointers = har step pe ek option hamesha ke liye discard.</b>' },
          ],
        },
        recap('Part 1 — Re-solve (MUST): LC 125 Valid Palindrome', {
          problem: 'Ek string di hai. Sirf letters aur digits dekho (case ignore). Batao ki woh aage se aur peeche se same padhi jaati hai ya nahi.',
          example: 's = "A man, a plan, a canal: Panama"\nclean = "amanaplanacanalpanama" → true\n\ns = "race a car" → "raceacar" → false',
          pattern: 'Two pointers (opposite ends) + skip',
          timer: 'Easy · 15 min',
          steps: [
            'Brute: clean string banao (StringBuilder), reverse karke compare → O(n) space.',
            'Better: l = 0, r = n − 1 rakho; non-alphanumeric ko skip karo.',
            'Lowercase compare; mismatch → false. Milte gaye → true.',
            'O(n) time, O(1) space.',
          ],
          code: `public boolean isPalindrome(String s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
        while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
        if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
        l++;
        r--;
    }
    return true;
}`,
          edge: [
            ['<code>" "</code>', 'true — clean string khaali hai'],
            ['<code>"0P"</code>', 'false — digit aur letter alag'],
            ['<code>".,"</code>', 'true — andar wale while me <code>l &lt; r</code> check zaroori'],
          ],
          hook: 'Kachra skip, chhota karo, dono taraf se milao.',
        }),
        recap('Part 2 — Re-solve (PUSH): LC 42 Trapping Rain Water', {
          problem: 'Har bar ki height di hai (width 1). Baarish ke baad bars ke beech kitna paani rukega, total batao.',
          example: 'height = [0,1,0,2,1,0,1,3,2,1,2,1] → 6\nheight = [4,2,0,3,2,5]             → 9\n\nwater at i = min(maxLeft, maxRight) − height[i]',
          pattern: 'Two pointers + running max (leftMax / rightMax)',
          timer: 'Hard · 40 min',
          steps: [
            'Brute: har i pe left max aur right max dhundo → O(n²).',
            'Better: prefix max aur suffix max arrays → O(n) time, O(n) space.',
            'Optimal: jis side ki max chhoti hai, wahi bottleneck hai — us side ka paani abhi decide ho sakta hai.',
            'height[l] &lt; height[r] → left process karo (leftMax update, water += leftMax − height[l]), warna right.',
          ],
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
          edge: [
            ['<code>[1, 2, 3]</code>', '0 — badhta hua, paani girta hai'],
            ['<code>[3, 0, 3]</code>', '3'],
            ['1 ya 2 bars', '0'],
          ],
          hook: 'Chhoti deewar wali side ka paani pakka — use process karo, aage badho.',
        }),
        {
          title: 'Part 3 — Pattern family: Two Pointers',
          blocks: [
            { table: { head: ['Question', 'Pointers', 'Move rule'], rows: [
              ['LC 125 Valid Palindrome', 'l, r opposite', 'Mismatch → false, warna dono andar'],
              ['LC 344 Reverse String', 'l, r opposite', 'Swap, dono andar'],
              ['LC 167 Two Sum II', 'l, r opposite', 'sum &lt; target → l++, sum &gt; target → r--'],
              ['LC 15 3Sum', 'fix i, phir l, r', 'Sort + skip duplicates'],
              ['LC 11 Container', 'l, r opposite', 'Chhoti height wala move'],
              ['LC 42 Trapping Rain Water', 'l, r + leftMax/rightMax', 'Chhoti side process'],
              ['LC 283 / LC 26', 'read i, write k', 'Keep condition → nums[k++] = nums[i]'],
            ] } },
            { tip: 'LC 11 aur LC 42 dono me "chhoti side move" — par 11 me area max karna hai, 42 me paani jodna hai.' },
          ],
        },
        {
          title: 'Part 4 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['LC 125 me andar wale while me <code>l &lt; r</code> kyun?', 'Warna saare characters non-alphanumeric hon toh l, r cross karke out of bounds ja sakte hain.'],
              ['LC 42 me chhoti side process karna safe kyun hai?', 'Agar height[l] &lt; height[r], toh right side pe kam se kam height[r] jitni deewar hai; l ka paani sirf leftMax pe depend karta hai.'],
              ['LC 42 ka prefix/suffix approach kya hai?', 'leftMax[i], rightMax[i] arrays; water += min(leftMax[i], rightMax[i]) − h[i]. O(n) time, O(n) space.'],
              ['LC 42 ko stack se bhi kar sakte hain?', 'Haan, monotonic decreasing stack — pop pe bounded water calculate. O(n) / O(n).'],
              ['Two pointers kab kaam nahi karta?', 'Jab array unsorted ho aur sort karne se answer (jaise original indices) kho jaaye — tab HashMap.'],
              ['<code>Character.isLetterOrDigit</code> ka alternative?', 'Manual check: <code>(c &gt;= \'a\' &amp;&amp; c &lt;= \'z\') || (c &gt;= \'0\' &amp;&amp; c &lt;= \'9\')</code> lowercase ke baad.'],
            ] },
          ],
        },
        {
          title: 'Part 5 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 125 — approach', 'I use two pointers from both ends. Each pointer skips characters that are not letters or digits, then I compare the two characters in lowercase. A mismatch means it is not a palindrome; otherwise I move both pointers inward. This avoids building a cleaned copy, so it is O(n) time and O(1) extra space.'],
              ['LC 42 — approach', 'Water above a bar is the minimum of the tallest bar on its left and right, minus its own height. With two pointers I keep leftMax and rightMax. Whichever side currently has the smaller height is the bottleneck, so its water level is already determined by its own running max — I add that water and move the pointer inward. One pass, O(n) time and O(1) space.'],
              ['Follow-up: "Prove the two-pointer move is safe in LC 42"', 'If height[l] is smaller than height[r], there is a wall at least height[r] tall on the right, so the right boundary for l is never the limiting factor. The water at l is fully determined by leftMax, and no future step can change it. The same argument applies symmetrically to the right side.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Sohvi session',
          blocks: [
            { olist: [
              'LC 125 bina dekhe likho. Pehle <code>"race a car"</code> pe l, r ki position paper pe track karo.',
              'LC 42: Example 2 <code>[4,2,0,3,2,5]</code> ke bars paper pe draw karo aur har column ka paani gin ke likho (0+2+4+1+2+0 = 9).',
              'LC 42 ka code zaroori nahi — sirf formula yaad karo: <code>min(maxLeft, maxRight) − h</code>.',
              '<b>Course target (time ho toh):</b> 2 Easy + 1 Medium → LC 344, LC 283 (Easy) + LC 1456 (Medium).',
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 42 teeno approach bolo (brute, prefix arrays, two pointers), optimal likho — 20 min.',
              '<b>Task B:</b> LC 42 ka safety proof English me bolo (Part 5 ka 3rd answer) bina dekhe.',
              '<b>Task C:</b> LC 15 ka duplicate-skip logic yaad se likho (i, l, r teeno pe).',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 15, LC 11, LC 167 + LC 42 already Hard (time bache toh LC 76).',
              'SDE-2 switch prep (parallel): 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Homework',
          blocks: [
            { list: [
              'LC 125 + LC 42 dobara submit.',
              'Mistake log update.',
              'Kal (Day 3): Sliding Window — LC 643 aur LC 3.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[4,2,0,3,2,5]</code> me total paani?', '9'],
              ['LC 42 two pointers ka time / space?', 'O(n) / O(1).'],
              ['<code>"0P"</code> palindrome hai?', 'Nahi — <code>\'0\' != \'p\'</code>.'],
              ['Container With Most Water me kaunsa pointer move karte hain?', 'Jiski height chhoti hai — kyunki area usi se limited hai.'],
              ['Sorted array me pair sum kis pattern se?', 'Opposite two pointers (LC 167).'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 125 bina dekhe Accepted',
        'LC 42 ka formula min(maxLeft, maxRight) − h samjha sakta/sakti hu',
        'LC 42 two-pointer code likha (Sohel: must · Sohvi: optional)',
        'Chhoti side move kyun safe hai, bol sakta/sakti hu',
        'Two pointers family table zubaani',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Palindrome: kachra skip, dono taraf milao. Rain water: chhoti side ka paani pakka.',
    },

    // ======================= DAY 3 =======================
    3: {
      title: 'Re-solve — Sliding Window',
      goal: 'Fixed aur variable sliding window dono ka revision: LC 643 (fixed size k) aur LC 3 (longest substring without repeat — last-seen map). Focus: <b>window valid kab hai, left kab move hota hai</b>.',
      main: 643,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules)',
          blocks: [
            PLAN_TABLE,
            { list: [
              'Har window problem me pehle 3 cheezein bolo: window me kya track karna hai, invalid kab hota hai, answer kab update karna hai.',
              'Course target (time ho toh): Sohvi → 2 Easy + 1 Medium, Tum → 3 Medium + 1 Hard.',
            ] },
            { tip: 'Memory hook: <b>Right se khao, invalid ho toh left se ugal do.</b>' },
          ],
        },
        recap('Part 1 — Re-solve (MUST): LC 643 Maximum Average Subarray I', {
          problem: 'Array aur k diya hai. Size k ke continuous subarray ka <b>maximum average</b> nikaalo.',
          example: 'nums = [1, 12, -5, -6, 50, 3], k = 4\n[1,12,-5,-6] = 2\n[12,-5,-6,50] = 51  ← best\n[-5,-6,50,3] = 42\nanswer = 51 / 4 = 12.75',
          pattern: 'Fixed sliding window',
          timer: 'Easy · 15 min',
          steps: [
            'Brute: har start pe k elements jodo → O(n·k).',
            'Pehli window ka sum nikaalo.',
            'Slide: <code>sum += nums[i] − nums[i − k]</code> — ek aaya, ek gaya.',
            'Max sum track karo, end me <code>/ k</code> (double!).',
          ],
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
          edge: [
            ['<code>[5], k = 1</code>', '5.0'],
            ['k = n', 'Sirf ek window — poore array ka average'],
            ['Saare negative', 'best = pehli window se start, 0 se nahi'],
          ],
          hook: 'Ek aaya, ek gaya. Divide sirf end me, double me.',
        }),
        recap('Part 2 — Re-solve (PUSH): LC 3 Longest Substring Without Repeating Characters', {
          problem: 'String di hai. Sabse lambi continuous substring ki length batao jisme koi character repeat na ho.',
          example: 's = "abcabcbb" → 3 ("abc")\ns = "bbbbb"    → 1\ns = "pwwkew"   → 3 ("wke")\ns = "abba"     → 2  ← trap case: left peeche nahi jaana chahiye',
          pattern: 'Variable sliding window + last-seen HashMap',
          timer: 'Medium · 25 min',
          steps: [
            'Brute: har substring check → O(n³).',
            'Window [l, r] me sab unique. Naya char c agar window ke andar pehle dikha → l ko uske last index + 1 pe bhejo.',
            '<code>last.get(c) &gt;= l</code> check zaroori — warna "abba" me l peeche chala jaayega.',
            'Har r pe <code>best = max(best, r − l + 1)</code>. O(n) time.',
          ],
          code: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> last = new HashMap<>();
    int l = 0, best = 0;
    for (int r = 0; r < s.length(); r++) {
        char c = s.charAt(r);
        if (last.containsKey(c) && last.get(c) >= l) l = last.get(c) + 1;
        last.put(c, r);
        best = Math.max(best, r - l + 1);
    }
    return best;
}`,
          edge: [
            ['<code>""</code>', '0'],
            ['<code>" "</code>', '1 — space bhi character hai'],
            ['<code>"abba"</code>', '2 — <code>&gt;= l</code> check ke bina 3 aa jaata (galat)'],
          ],
          hook: 'Repeat mila window ke andar → left ko uske aage kudao, peeche kabhi nahi.',
        }),
        {
          title: 'Part 3 — Pattern family: Sliding Window',
          blocks: [
            { table: { head: ['Question', 'Type', 'Window me kya track', 'Invalid kab'], rows: [
              ['LC 643', 'Fixed k', 'sum', '— (size fixed)'],
              ['LC 1456', 'Fixed k', 'vowel count', '— (size fixed)'],
              ['LC 3', 'Variable (longest)', 'last index map', 'char repeat'],
              ['LC 424', 'Variable (longest)', 'freq[26] + maxFreq', 'len − maxFreq &gt; k'],
              ['LC 1004', 'Variable (longest)', 'zero count', 'zeros &gt; k'],
              ['LC 209', 'Variable (shortest)', 'sum', 'sum &gt;= target → shrink & record'],
              ['LC 76', 'Variable (shortest)', 'need map + formed', 'sab chars cover → shrink & record'],
            ] } },
            { tip: '<b>Longest</b> me invalid hone pe shrink karke answer lo. <b>Shortest</b> me valid rehte hue shrink karte hue answer lo.' },
          ],
        },
        {
          title: 'Part 4 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['LC 643 me <code>return best / k</code> likha toh?', 'Integer division → 12 (12.75 nahi). <code>(double) best / k</code> likho.'],
              ['LC 3 ko int[128] array se kaise karoge?', 'Map ki jagah <code>int[] last = new int[128]</code> (ASCII), -1 se fill; logic same, thoda fast.'],
              ['Sliding window negatives ke saath kyun fail?', 'Shrink karne pe sum badh bhi sakta hai — monotonic property tooti. Prefix sum + map lo (LC 560).'],
              ['Sliding window O(n) kyun hai jab andar while loop hai?', 'l sirf aage badhta hai — total n se zyada move nahi. Har index ek baar add, ek baar remove.'],
              ['LC 3 me <code>HashSet</code> approach?', 'Set me window ke chars; repeat pe <code>while</code> se left remove karte jao. O(n), thoda zyada operations.'],
              ['LC 424 me maxFreq kam kyun nahi karte?', 'Answer sirf tab badhta hai jab maxFreq badhe; stale maxFreq window ko galat chhota nahi karta, result sahi rehta hai.'],
            ] },
          ],
        },
        {
          title: 'Part 5 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 643 — approach', 'This is a fixed-size window. I compute the sum of the first k elements, then slide the window one step at a time, adding the new element and subtracting the one that leaves. I track the maximum sum and divide by k as a double at the end. That is O(n) time and O(1) space instead of O(n·k).'],
              ['LC 3 — approach', 'I maintain a window with no repeated characters and a map from each character to its last index. For each right index, if the character was last seen inside the current window, I move the left boundary just past that position — never backwards. Then I update the best length. Each character is processed once, so it is O(n) time and O(min(n, alphabet)) space.'],
              ['Follow-up: "How would you return the substring itself?"', 'Along with the best length I store the starting index whenever I update the best. At the end I return s.substring(start, start + best). The complexity stays the same.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Sohvi session',
          blocks: [
            { olist: [
              'LC 643 bina dekhe likho. Example ki teeno windows paper pe brackets laga ke dikhao.',
              'LC 3 ke liye <code>"abcabcbb"</code> pe l, r aur best ki table haath se banao.',
              '<code>"abba"</code> pe dekho ki <code>&gt;= l</code> check na ho toh kya galat hota hai.',
              '<b>Course target (time ho toh):</b> 2 Easy + 1 Medium → LC 125, LC 26 (Easy) + LC 1456 (Medium).',
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 3 memory se 10 min me, phir int[128] version bhi.',
              '<b>Task B:</b> LC 76 ka skeleton (need map, formed, shrink loop) bina dekhe likho — 30 min.',
              '<b>Task C:</b> Sliding window vs prefix-sum decision English me 30 sec me bolo.',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 424, LC 1004, LC 209 + LC 76 (Hard).',
              'SDE-2 switch prep (parallel): 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Homework',
          blocks: [
            { list: [
              'LC 643 + LC 3 dobara submit.',
              'Sliding window family table (Part 3) ek baar zubaani bolo.',
              'Kal (Day 4): Binary Search — LC 35 aur LC 875.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>"pwwkew"</code> ka answer?', '3 ("wke").'],
              ['<code>[1,12,-5,-6,50,3], k = 4</code> ka max average?', '12.75'],
              ['Fixed window ka slide formula?', '<code>sum += nums[i] − nums[i − k]</code>'],
              ['LC 3 me left kab move hota hai?', 'Jab current char ka last index ≥ l ho (window ke andar repeat).'],
              ['Negatives ho toh subarray sum = k kaise?', 'Prefix sum + HashMap (LC 560).'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 643 bina dekhe Accepted (double division yaad)',
        'LC 3 bina dekhe likha, "abba" case explain kiya',
        'Longest vs shortest window ka fark bol sakta/sakti hu',
        'Sliding window negatives pe kyun fail, bata sakta/sakti hu',
        'Window family table zubaani',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Fixed: ek aaya ek gaya. Variable: repeat mila → left aage kudao, peeche kabhi nahi.',
    },

    // ======================= DAY 4 =======================
    4: {
      title: 'Re-solve — Binary Search',
      goal: 'Classic binary search (LC 35 — insert position) aur <b>binary search on answer</b> (LC 875 — Koko). Focus: <b>template pick karna</b> (lo &lt;= hi vs lo &lt; hi) aur feasible() monotonic hai ya nahi.',
      main: 35,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules)',
          blocks: [
            PLAN_TABLE,
            { list: [
              'Har binary search se pehle bolo: search space kya hai (index ya answer), aur loop khatam hone pe <code>lo</code> kya represent karta hai.',
              'Course target (time ho toh): Sohvi → 2 Easy + 1 Medium, Tum → 3 Medium + 1 Hard.',
            ] },
            { tip: 'Memory hook: <b>Har step pe aadha search space hamesha ke liye gaya.</b>' },
          ],
        },
        recap('Part 1 — Re-solve (MUST): LC 35 Search Insert Position', {
          problem: 'Sorted distinct array aur target diya hai. Target mile toh uska index, warna woh index jahan insert karne pe array sorted rahe. O(log n).',
          example: 'nums = [1, 3, 5, 6]\ntarget 5 → 2\ntarget 2 → 1\ntarget 7 → 4\n\nLoop khatam → lo = pehla index jahan nums[lo] >= target',
          pattern: 'Binary search (lower bound)',
          timer: 'Easy · 15 min',
          steps: [
            'Brute: linear scan, pehla index jahan nums[i] ≥ target → O(n).',
            'lo = 0, hi = n − 1, <code>while (lo &lt;= hi)</code>.',
            'Mila → return mid. Chhota → lo = mid + 1. Bada → hi = mid − 1.',
            'Loop ke baad <code>lo</code> hi insert position hai.',
          ],
          code: `public int searchInsert(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return lo;
}`,
          edge: [
            ['target sabse chhota', '0'],
            ['target sabse bada', 'n'],
            ['1 element', '0 ya 1'],
          ],
          hook: 'Loop khatam, lo = jahan target baithna chahiye.',
        }),
        recap('Part 2 — Re-solve (PUSH): LC 875 Koko Eating Bananas', {
          problem: 'Piles me bananas hain, h ghante hain. Koko ek ghante me ek hi pile se max k bananas khaati hai. Minimum integer speed k batao jisse sab h ghante me khatam ho jaaye.',
          example: 'piles = [3, 6, 7, 11], h = 8\nk = 4 → hours = 1 + 2 + 2 + 3 = 8 ✓\nk = 3 → hours = 1 + 2 + 3 + 4 = 10 ✗\nanswer = 4',
          pattern: 'Binary search on answer',
          timer: 'Medium · 25 min',
          steps: [
            'Answer range: 1 .. max(piles). Brute: har k try → O(max · n).',
            'Monotonic: agar k kaam karta hai toh k + 1 bhi karega.',
            'mid pe hours = Σ ceil(p / mid). ≤ h → hi = mid (aur chhota try), warna lo = mid + 1.',
            '<code>lo &lt; hi</code> template; end me lo = minimum feasible. O(n log max).',
          ],
          code: `public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = 0;
    for (int p : piles) hi = Math.max(hi, p);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        long hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid;
        if (hours <= h) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
          edge: [
            ['h = piles.length', 'k = max(piles) — har pile ek ghante me'],
            ['Bade piles (10⁹)', '<code>long hours</code> — warna overflow'],
            ['Ek pile', 'ceil(p / h)'],
          ],
          hook: 'Answer pe binary search: kaam kiya → aur kam try, nahi kiya → badhao.',
        }),
        {
          title: 'Part 3 — Pattern family: Binary Search',
          blocks: [
            { table: { head: ['Question', 'Search space', 'Template', 'Decision'], rows: [
              ['LC 704', 'index', 'lo &lt;= hi', '== return'],
              ['LC 35', 'index', 'lo &lt;= hi, return lo', 'lower bound'],
              ['LC 69', 'answer 0..x', 'lo &lt;= hi', 'mid ≤ x / mid'],
              ['LC 33', 'index (rotated)', 'lo &lt;= hi', 'kaunsa half sorted?'],
              ['LC 153', 'index (rotated)', 'lo &lt; hi', 'nums[mid] &gt; nums[hi] → right'],
              ['LC 875', 'speed 1..max', 'lo &lt; hi', 'hours ≤ h → hi = mid'],
              ['LC 1011', 'capacity max..sum', 'lo &lt; hi', 'days ≤ D → hi = mid'],
              ['LC 410', 'largest sum max..sum', 'lo &lt; hi', 'parts ≤ k → hi = mid'],
            ] } },
            { tip: '<code>hi = mid</code> likha toh loop <code>lo &lt; hi</code> hona chahiye. <code>hi = mid − 1</code> likha toh <code>lo &lt;= hi</code>. Mix kiya → infinite loop.' },
          ],
        },
        {
          title: 'Part 4 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['<code>(lo + hi) / 2</code> me kya problem hai?', 'lo + hi int overflow kar sakta hai. <code>lo + (hi − lo) / 2</code> safe hai.'],
              ['Ceil division bina double ke?', '<code>(p + mid − 1) / mid</code>.'],
              ['LC 875 ka hi = max(piles) kyun, sum kyun nahi?', 'Speed max se zyada karne se koi fayda nahi — har pile already 1 ghante me khatam.'],
              ['Binary search on answer ka signal?', '"Minimum / maximum X such that condition possible" + condition monotonic.'],
              ['LC 35 me duplicates hote toh?', 'Lower bound template (first index ≥ target) same kaam karta; == pe return na karke hi = mid − 1 karo.'],
              ['LC 1011 ka lo kya hoga?', 'max(weights) — sabse bhaari package ek din me jaana hi chahiye.'],
            ] },
          ],
        },
        {
          title: 'Part 5 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 35 — approach', 'Since the array is sorted, I binary search. If the middle element equals the target I return its index; if it is smaller I search the right half, otherwise the left half. When the loop ends without a match, lo is exactly the first position whose value is greater than the target, which is the insert position. O(log n) time and O(1) space.'],
              ['LC 875 — approach', 'The answer is a speed between 1 and the largest pile, and feasibility is monotonic: if Koko can finish at speed k she can finish at any higher speed. So I binary search on the speed. For each mid I compute total hours as the sum of ceiling of pile over mid, using a long. If it fits within h I keep mid as a candidate and search lower, otherwise higher. Time is O(n log maxPile).'],
              ['Follow-up: "How do you avoid infinite loops in binary search?"', 'I keep the template consistent. If I set hi = mid, I loop while lo < hi and set lo = mid + 1 in the other branch, so the range always shrinks. If I use lo <= hi, both branches move past mid. I also sanity-check with a two-element range before submitting.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Sohvi session',
          blocks: [
            { olist: [
              'LC 35 bina dekhe likho. Target 2 aur 7 pe lo, hi, mid ki table banao.',
              'LC 875 me k = 3 aur k = 4 ke liye hours haath se calculate karo.',
              'Ek line me bolo: "Answer pe binary search tab lagta hai jab…".',
              '<b>Course target (time ho toh):</b> 2 Easy + 1 Medium → LC 704, LC 69 (Easy) + LC 78 (Medium, backtracking warm-up).',
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 875 memory se 12 min me.',
              '<b>Task B:</b> Same template se LC 1011 aur LC 410 ka sirf <code>feasible()</code> likho — dono 10 min me.',
              '<b>Task C:</b> LC 33 rotated logic bina dekhe, phir LC 153.',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 33, LC 153, LC 1011 + LC 410 (Hard).',
              'SDE-2 switch prep (parallel): 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Homework',
          blocks: [
            { list: [
              'LC 35 + LC 875 dobara submit.',
              'Binary search family table (Part 3) mistake log ke saath padho.',
              'Kal (Day 5): Linked List — LC 206 aur LC 143.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[1,3,5,6]</code>, target 7 → ?', '4'],
              ['<code>piles = [30,11,23,4,20], h = 5</code> → ?', '30'],
              ['Same piles, h = 6 → ?', '23'],
              ['LC 875 ka time?', 'O(n log max(piles)).'],
              ['<code>hi = mid</code> wale template ka loop condition?', '<code>while (lo &lt; hi)</code>'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 35 bina dekhe Accepted, return lo kyun — samjha',
        'LC 875 binary search on answer likha (Sohel: must · Sohvi: hours calculation samjha)',
        'Do templates (lo <= hi vs lo < hi) ka fark bata sakta/sakti hu',
        'Ceil division aur long hours yaad',
        'Binary search family table zubaani',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Sorted ho ya answer monotonic ho → binary search. hi = mid ke saath lo < hi.',
    },

    // ======================= DAY 5 =======================
    5: {
      title: 'Re-solve — Linked List',
      goal: 'Linked list ke do building blocks: LC 206 (reverse — prev/cur/next) aur LC 143 (reorder = middle + reverse + merge). Focus: <b>pointer order</b> — next pehle save, phir link todo.',
      main: 206,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules)',
          blocks: [
            PLAN_TABLE,
            { list: [
              'Linked list = hamesha paper pe boxes aur arrows draw karo, phir code.',
              'Course target (time ho toh): Sohvi → 2 Easy + 1 Medium, Tum → 3 Medium + 1 Hard.',
            ] },
            { tip: 'Memory hook: <b>Link todne se pehle agla pakdo.</b>' },
          ],
        },
        recap('Part 1 — Re-solve (MUST): LC 206 Reverse Linked List', {
          problem: 'Singly linked list ka head diya hai. Poori list ulti karo aur naya head return karo.',
          example: '1 → 2 → 3 → 4 → null\n\nprev=null cur=1 : 1.next = null\nprev=1    cur=2 : 2.next = 1\nprev=2    cur=3 : 3.next = 2\nprev=3    cur=4 : 4.next = 3\nreturn 4 → 3 → 2 → 1 → null',
          pattern: 'Linked list — prev / cur / next',
          timer: 'Easy · 15 min',
          steps: [
            'Brute: values array me daalo, ulte order me naye nodes → O(n) space.',
            'In-place: har node ka arrow ulta karo.',
            'Order: <code>next = cur.next</code> → <code>cur.next = prev</code> → <code>prev = cur</code> → <code>cur = next</code>.',
            'End me prev = naya head. O(n) time, O(1) space. Recursive version O(n) stack.',
          ],
          code: `public ListNode reverseList(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`,
          edge: [
            ['<code>null</code>', 'null'],
            ['1 node', 'wahi node'],
            ['2 nodes', '2 → 1'],
          ],
          hook: 'Agla pakdo, ulta jodo, dono aage.',
        }),
        recap('Part 2 — Re-solve (PUSH): LC 143 Reorder List', {
          problem: 'List L0 → L1 → … → Ln ko in-place aise badlo: L0 → Ln → L1 → Ln−1 → L2 → … (values nahi, nodes badlo).',
          example: '[1,2,3,4]   → [1,4,2,3]\n[1,2,3,4,5] → [1,5,2,4,3]\n\nStep 1 middle:  1 2 3 | 4 5\nStep 2 reverse: 5 4\nStep 3 merge:   1 5 2 4 3',
          pattern: 'Slow-fast (middle) + reverse + merge',
          timer: 'Medium · 25 min',
          steps: [
            'Brute: nodes ArrayList me daalo, i aur j se jodo → O(n) space.',
            'Slow-fast se middle; <code>slow.next = null</code> se do halves.',
            'Second half reverse (LC 206 wala code).',
            'Dono ko alternately jodo: first.next = second, second.next = purana first.next.',
          ],
          code: `public void reorderList(ListNode head) {
    if (head == null || head.next == null) return;
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    ListNode second = slow.next;
    slow.next = null;
    ListNode prev = null;
    while (second != null) {
        ListNode nx = second.next;
        second.next = prev;
        prev = second;
        second = nx;
    }
    ListNode first = head;
    second = prev;
    while (second != null) {
        ListNode t1 = first.next, t2 = second.next;
        first.next = second;
        second.next = t1;
        first = t1;
        second = t2;
    }
}`,
          edge: [
            ['1 ya 2 nodes', 'Kuch nahi badalta'],
            ['Odd length', 'First half me ek node zyada (middle)'],
            ['<code>slow.next = null</code> bhoole', 'Cycle ban jaata hai → infinite loop'],
          ],
          hook: 'Beech se todo, peeche wala ulta, phir zip karo.',
        }),
        {
          title: 'Part 3 — Pattern family: Linked List',
          blocks: [
            { table: { head: ['Question', 'Tool', 'Key line'], rows: [
              ['LC 206 Reverse', 'prev/cur/next', '<code>cur.next = prev</code>'],
              ['LC 876 Middle', 'slow/fast', '<code>while (fast != null &amp;&amp; fast.next != null)</code>'],
              ['LC 21 Merge', 'dummy + tail', '<code>tail.next = (a != null) ? a : b</code>'],
              ['LC 141 Cycle', 'slow/fast', '<code>if (slow == fast) return true</code>'],
              ['LC 142 Cycle start', 'slow/fast + reset', 'meet ke baad ek pointer head pe, dono 1 step'],
              ['LC 19 Nth from end', 'dummy + gap n', 'fast ko n+1 aage, phir dono saath'],
              ['LC 143 Reorder', 'middle + reverse + merge', '<code>slow.next = null</code>'],
              ['LC 25 k-Group', 'count k + reverse + reconnect', 'groupPrev.next = naya head'],
            ] } },
            { tip: 'LC 876 me second middle chahiye (<code>fast != null</code>), LC 143 me first middle (<code>fast.next != null</code>) — condition ka fark yaad rakho.' },
          ],
        },
        {
          title: 'Part 4 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['LC 206 recursive kaise?', '<code>newHead = reverseList(head.next); head.next.next = head; head.next = null; return newHead;</code> — O(n) stack space.'],
              ['Dummy node kab use karte ho?', 'Jab head khud badal sakta hai (merge, remove nth) — edge cases khatam.'],
              ['LC 143 me middle ke liye loop condition kya hai aur kyun?', '<code>fast.next != null &amp;&amp; fast.next.next != null</code> → slow first middle pe rukta hai, first half ≥ second half.'],
              ['Floyd cycle me fast slow ko pakadta kyun hai?', 'Cycle ke andar har step pe gap 1 kam hota hai, toh gap 0 hona hi hai.'],
              ['Linked list vs array — kab kya?', 'List: O(1) insert/delete agar node pata ho, no random access. Array: O(1) access, cache friendly.'],
              ['LC 143 ka time / space?', 'O(n) time, O(1) space (teeno steps in-place).'],
            ] },
          ],
        },
        {
          title: 'Part 5 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 206 — approach', 'I walk the list with two pointers, prev starting at null and cur at head. At each node I first save cur.next, then point cur.next back to prev, and advance both pointers. When cur becomes null, prev is the new head. It is O(n) time and O(1) space; the recursive version is shorter but uses O(n) stack space.'],
              ['LC 143 — approach', 'I break it into three known steps. First, slow and fast pointers find the middle, and I cut the list there. Second, I reverse the second half. Third, I merge the two halves by alternating nodes. Each step is linear and in place, so the total is O(n) time and O(1) extra space.'],
              ['Follow-up: "Can you do Reorder List without modifying the second half?"', 'Without reversing I would need random access to the tail, so I would store nodes in an array or use a stack for the second half. That makes it O(n) extra space; the in-place reverse is the trade-off that keeps space O(1).'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Sohvi session',
          blocks: [
            { olist: [
              'LC 206 bina dekhe likho. Paper pe 4 boxes draw karke har step pe arrows ulte karo.',
              'LC 143 ke teen steps ke naam yaad karo aur <code>[1,2,3,4,5]</code> pe paper pe dikhao.',
              'LC 876 (middle) bhi re-solve karo — LC 143 ka step 1 wahi hai.',
              '<b>Course target (time ho toh):</b> 2 Easy + 1 Medium → LC 876, LC 21 (Easy) + LC 198 (Medium).',
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 143 memory se 15 min me — teeno steps alag helper methods bana ke bhi try karo.',
              '<b>Task B:</b> LC 206 recursive version likho aur call stack bolke explain karo.',
              '<b>Task C:</b> LC 142 cycle start ka math (a = c − b) 1 minute me explain karo.',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 142, LC 19, LC 143 + LC 25 (Hard).',
              'SDE-2 switch prep (parallel): 2 SQL questions.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Homework',
          blocks: [
            { list: [
              'LC 206 + LC 143 dobara submit.',
              'Kal (Day 6, Saturday): Stack revision — LC 20, 739, 155, 84. Mistake log poora padho.',
              'Sohel: Saturday ka System Design topic choose karo.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['Reverse me 4 lines ka order?', 'next = cur.next; cur.next = prev; prev = cur; cur = next;'],
              ['<code>[1,2,3,4]</code> reorder ke baad?', '<code>[1,4,2,3]</code>'],
              ['LC 143 ke 3 steps?', 'Middle dhundo + cut, second half reverse, alternate merge.'],
              ['Reverse ke baad naya head kaunsa variable?', '<code>prev</code>'],
              ['Merge two sorted lists me dummy kyun?', 'Head decide karne ka special case khatam; return dummy.next.'],
            ] },
          ],
        },
      ],
      checks: [
        'LC 206 iterative bina dekhe Accepted',
        'LC 206 recursive samjha',
        'LC 143 teeno steps se likha (Sohel: must · Sohvi: paper pe dikhaya)',
        'Middle ke do loop conditions ka fark bata sakta/sakti hu',
        'Linked list family table zubaani',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Agla pakdo, ulta jodo. Reorder = beech se todo, peeche ulta, zip.',
    },

    // ======================= DAY 6 (SAT) =======================
    6: {
      title: 'Revision — Stack + Monotonic Stack (Week 1 wrap-up)',
      goal: 'Saturday revision: Stack family ke 4 questions — LC 20 (brackets), LC 739 (monotonic), LC 155 (Min Stack design), LC 84 (histogram, Hard). Saath me Week 1 ki mistake log aur Sohel ka System Design session.',
      main: 20,
      parts: [
        {
          title: 'Part 0 — Aaj ka revision plan (timer, rules)',
          blocks: [
            { table: { head: ['Slot', 'Kya', 'Kaun'], rows: [
              ['10 min', 'Week 1 mistake log padho, har galti zubaani bolo', 'Dono'],
              ['15 min', 'LC 20 (Easy)', 'Dono'],
              ['25 min', 'LC 739 (Medium)', 'Dono (Sohvi: brute + idea)'],
              ['20 min', 'LC 155 (design)', 'Dono'],
              ['40 min', 'LC 84 (Hard)', 'Sohel must · Sohvi optional'],
              ['Alag se', 'System Design session (1/week)', 'Sohel'],
            ] } },
            { list: [
              'Min 3 questions bina dekhe, time ho toh 4.',
              'Course target (time ho toh): Sohvi → 2 Easy + 1 Medium, Tum → 3 Medium + 1 Hard.',
            ] },
            { tip: 'Memory hook: <b>Stack = jiska answer abhi nahi mila, woh wait karta hai.</b>' },
          ],
        },
        recap('Part 1 — LC 20 Valid Parentheses', {
          problem: 'String me sirf <code>()[]{}</code> hain. Batao ki brackets sahi order me khulte aur band hote hain ya nahi.',
          example: '"()[]{}" → true\n"(]"     → false\n"([)]"   → false\n"{[]}"   → true',
          pattern: 'Stack (matching)',
          timer: 'Easy · 15 min',
          steps: [
            'Opening aaye → uska expected closing push karo.',
            'Closing aaye → stack khaali ya top match nahi → false.',
            'End me stack khaali hona chahiye.',
          ],
          code: `public boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') st.push(')');
        else if (c == '{') st.push('}');
        else if (c == '[') st.push(']');
        else if (st.isEmpty() || st.pop() != c) return false;
    }
    return st.isEmpty();
}`,
          edge: [['<code>"("</code>', 'false — stack khaali nahi'], ['<code>")"</code>', 'false — khaali stack pe pop'], ['Odd length', 'Seedha false (shortcut)']],
          hook: 'Khulte hi expected band push, band pe match karo.',
        }),
        recap('Part 2 — LC 739 Daily Temperatures', {
          problem: 'Har din ka temperature diya hai. Har din ke liye batao kitne din baad zyada garam din aayega (nahi aaye toh 0).',
          example: 't   = [73,74,75,71,69,72,76,73]\nans = [ 1, 1, 4, 2, 1, 1, 0, 0]\n\ni=5 (72): stack top 69 → pop (ans[4]=1), 71 → pop (ans[3]=2), 75 > 72 ruk',
          pattern: 'Monotonic decreasing stack (indices)',
          timer: 'Medium · 25 min',
          steps: [
            'Brute: har i ke liye aage scan → O(n²).',
            'Stack me un dinon ke index jinka warmer din abhi nahi mila.',
            'Naya temp top se bada → pop, <code>ans[j] = i − j</code>.',
            'Har index ek push, ek pop → O(n).',
          ],
          code: `public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] ans = new int[n];
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && temperatures[i] > temperatures[st.peek()]) {
            int j = st.pop();
            ans[j] = i - j;
        }
        st.push(i);
    }
    return ans;
}`,
          hook: 'Garam din aaya → wait karne waalon ko answer do, pop karo.',
        }),
        recap('Part 3 — LC 155 Min Stack', {
          problem: 'Ek stack design karo jo push, pop, top aur getMin — sab O(1) me kare.',
          example: 'push(-2) push(0) push(-3)\ngetMin() → -3\npop()\ntop()    → 0\ngetMin() → -2',
          pattern: 'Stack design — har entry ke saath us waqt ka min',
          timer: 'Medium · 20 min',
          steps: [
            'Galat idea: ek min variable — pop pe purana min kho jaata hai.',
            'Har push pe pair <code>(val, minSoFar)</code> rakho.',
            'getMin = top ka min. Sab O(1).',
          ],
          code: `class MinStack {
    private Deque<int[]> st = new ArrayDeque<>();

    public void push(int val) {
        int min = st.isEmpty() ? val : Math.min(val, st.peek()[1]);
        st.push(new int[]{val, min});
    }

    public void pop() { st.pop(); }

    public int top() { return st.peek()[0]; }

    public int getMin() { return st.peek()[1]; }
}`,
          hook: 'Har plate pe us waqt ka min likh do.',
        }),
        recap('Part 4 — LC 84 Largest Rectangle in Histogram', {
          problem: 'Bars ki heights di hain (width 1). Histogram me sabse bada rectangle ka area batao.',
          example: 'heights = [2,1,5,6,2,3] → 10 (5 aur 6 pe height 5, width 2)\nheights = [2,4]         → 4',
          pattern: 'Monotonic increasing stack + sentinel',
          timer: 'Hard · 40 min',
          steps: [
            'Brute: har bar ko height maan ke left/right tak failao → O(n²).',
            'Stack me increasing heights ke index. Chhoti bar aaye → top pop, woh height ka rectangle khatam.',
            'Width = i − (naya top) − 1, stack khaali ho toh i.',
            'End me i = n pe height 0 (sentinel) se sab pop. O(n).',
          ],
          code: `public int largestRectangleArea(int[] heights) {
    int n = heights.length, best = 0;
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];
        while (!st.isEmpty() && h < heights[st.peek()]) {
            int height = heights[st.pop()];
            int left = st.isEmpty() ? -1 : st.peek();
            best = Math.max(best, height * (i - left - 1));
        }
        st.push(i);
    }
    return best;
}`,
          hook: 'Chhoti bar aayi → upar wali bar ka rectangle pakka, width = right − left − 1.',
        }),
        {
          title: 'Part 5 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['Java me <code>Stack</code> class kyun nahi?', 'Synchronized (slow) aur Vector pe based. <code>ArrayDeque</code> fast hai.'],
              ['Monotonic stack me values ki jagah indices kyun?', 'Distance / width nikaalne ke liye index chahiye; value index se mil jaati hai.'],
              ['LC 84 me sentinel 0 kyun?', 'Taaki end me bache saare bars pop hokar unka area calculate ho.'],
              ['Min Stack ko do stacks se kaise?', 'Main stack + min stack; min stack pe tab push jab val ≤ current min, pop pe agar same ho toh dono pop.'],
              ['LC 496 Next Greater Element I kaise?', 'nums2 pe monotonic stack chala ke map(value → next greater), phir nums1 ke liye lookup.'],
              ['Queue using stacks (LC 232) amortized O(1) kyun?', 'Har element in-stack se out-stack me sirf ek baar shift hota hai.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 739 — approach', 'I keep a stack of indices whose warmer day has not been found yet, so their temperatures are decreasing from bottom to top. For each new day, while it is warmer than the day on top, that day has found its answer: I pop it and store the difference in indices. Then I push the current day. Each index is pushed and popped at most once, so it is O(n) time and O(n) space.'],
              ['LC 155 — approach', 'Along with each value, I store the minimum of the stack at the moment it was pushed. Push computes the new minimum from the current top in O(1), pop just removes the pair, and getMin reads the top pair’s minimum. Because each entry remembers the minimum below it, popping automatically restores the previous minimum.'],
              ['LC 84 — approach', 'For each bar, the largest rectangle using its height extends until the first shorter bar on each side. A monotonic increasing stack finds both: when a shorter bar arrives, the popped bar’s right boundary is the current index and its left boundary is the new top of the stack. I compute height times width at each pop, and a zero-height sentinel at the end flushes the stack. O(n) time.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: [
              'LC 20 bina dekhe Accepted.',
              'LC 155 class bina dekhe likho — pair wala idea apne shabdon me bolo.',
              'LC 739 ka brute (O(n²)) khud likho, phir stack ki table Example pe haath se banao.',
              'LC 84: sirf Example 1 ka answer 10 kaise aaya, paper pe dikhao.',
              '<b>Course target (time ho toh):</b> 2 Easy + 1 Medium → LC 232, LC 225 (Easy) + LC 46 (Medium).',
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice) + System Design session',
          blocks: [
            { olist: [
              '<b>Task A:</b> LC 739 + LC 84 memory se, 35 min total.',
              '<b>Task B:</b> LC 84 ka "har bar ke liye left/right shorter" wala explanation English me 90 sec me.',
              '<b>Task C:</b> Week 1 mistake log se top 3 galtiyan — un questions ko dobara 10-10 min me.',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 155, LC 739, LC 560 + LC 84 (Hard).',
              '<b>System Design session (1/week):</b> ek classic design (e.g. URL shortener / rate limiter) — requirements, APIs, data model, scaling, 45 min whiteboard.',
            ] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: [
              'Aaj ke 4 questions me jo bina dekhe nahi nikla, kal subah dobara.',
              'Kal (Day 7, Sunday): Full Mock #1 — Tum interviews Sohvi (LC 21), Sohvi interviews Tum (LC 33). Questions ke solutions mat dekhna.',
              'LeetCode Weekly Contest — Sunday 8:00 AM IST, register kar lo.',
            ] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>"([)]"</code> valid hai?', 'Nahi.'],
              ['<code>[30,40,50,60]</code> ka daily temperatures?', '<code>[1,1,1,0]</code>'],
              ['<code>[2,1,5,6,2,3]</code> ka largest rectangle?', '10'],
              ['Monotonic stack O(n) kyun?', 'Har index ek baar push, max ek baar pop.'],
              ['Min Stack ka getMin O(1) kaise?', 'Har entry ke saath us waqt ka min store hai — top ka min padho.'],
            ] },
          ],
        },
      ],
      checks: [
        'Min 3 stack questions bina dekhe Accepted',
        'Monotonic stack ka O(n) argument bol sakta/sakti hu',
        'Min Stack design explain kiya',
        'LC 84 width formula samjha (Sohel: code must)',
        'Week 1 mistake log revise kiya',
        'Sohel: System Design session kiya',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Stack me woh rehte hain jinka answer abhi nahi mila — bada/chhota aaya toh pop karke answer do.',
    },

    // ======================= DAY 7 (SUN) =======================
    7: {
      title: 'Full Mock Interview #1 + Contest',
      goal: 'Pehla full mock: Tum interviews Sohvi on <b>LC 21 Merge Two Sorted Lists</b>, Sohvi interviews Tum on <b>LC 33 Search in Rotated Sorted Array</b>. Phir LeetCode Weekly Contest discussion. Aaj judge hoga <b>communication</b>, sirf code nahi.',
      main: 21,
      parts: [
        {
          title: 'Part 0 — Mock format (30 + 30 + 30 min)',
          blocks: [
            { table: { head: ['Slot', 'Interviewer', 'Candidate', 'Question'], rows: [
              ['0–30 min', 'Tum (Sohel)', 'Sohvi', 'LC 21 (Easy)'],
              ['30–60 min', 'Sohvi', 'Tum (Sohel)', 'LC 33 (Medium)'],
              ['60–90 min', 'Dono', 'Dono', 'Weekly Contest discussion'],
            ] } },
            { list: [
              'Candidate ka camera/screen on, notes band. Interviewer sirf rubric aur hints ladder use kare.',
              'Candidate har step bolke kare: clarify → example → brute → optimal → code → test → complexity.',
              'Har mock ke baad 5 min feedback: 2 achhi baatein, 2 improve karni.',
            ] },
            { tip: 'Memory hook: <b>Mock me chup rehna = fail. Galat bolna bhi chalega, chup nahi.</b>' },
          ],
        },
        mockQ('Part 1 — Mock Q1 (Tum → Sohvi): LC 21 Merge Two Sorted Lists', {
          problem: 'Do sorted linked lists ke heads diye hain. Unhe jod ke ek sorted list banao (existing nodes reuse karo) aur uska head return karo.',
          example: 'list1 = 1 → 2 → 4, list2 = 1 → 3 → 4\nresult = 1 → 1 → 2 → 3 → 4 → 4\n\nlist1 = [], list2 = [0] → [0]',
          ask: [
            'Clarify: "Kya dono khaali ho sakti hain? Duplicates?" (expected: haan, haan)',
            'Naye nodes banaoge ya existing reuse? (expected: reuse)',
            'Follow-up 1: Time / space kya hai? (O(m + n), O(1))',
            'Follow-up 2: Recursive version kaise? Uska space kya? (O(m + n) stack)',
            'Follow-up 3: k sorted lists ho toh? (sirf idea: heap — Phase 8 wala)',
          ],
          hints: [
            'Dono lists ke heads compare karo — jo chhota, woh result me pehle.',
            'Head decide karne ki tension? Ek fake starting node (dummy) bana lo.',
            '<code>tail</code> pointer rakho jo result ke end pe ho.',
            'Ek list khatam → doosri ka bacha hissa seedha jod do.',
          ],
          rubric: [
            ['Clarify', 'Empty lists, duplicates pucha', ''],
            ['Brute', 'Values array me daal ke sort ka idea bola', ''],
            ['Optimal', 'Dummy + tail, compare karke jodna', ''],
            ['Code', 'Null checks sahi, bacha hissa joda', ''],
            ['Test', 'Example + ek list khaali case dry run kiya', ''],
            ['Communication', 'Har step bolke kiya, complexity khud boli', ''],
          ],
          code: `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (list1 != null && list2 != null) {
        if (list1.val <= list2.val) {
            tail.next = list1;
            list1 = list1.next;
        } else {
            tail.next = list2;
            list2 = list2.next;
        }
        tail = tail.next;
    }
    tail.next = (list1 != null) ? list1 : list2;
    return dummy.next;
}`,
          hook: 'Dummy se shuru, chhota jodo, bacha seedha chipka do.',
        }),
        mockQ('Part 2 — Mock Q2 (Sohvi → Tum): LC 33 Search in Rotated Sorted Array', {
          problem: 'Ek sorted array (distinct values) ko kisi unknown index pe rotate kiya gaya hai. Target ka index O(log n) me dhundo, nahi mile toh −1.',
          example: 'nums = [4,5,6,7,0,1,2], target = 0 → 4\nnums = [4,5,6,7,0,1,2], target = 3 → -1\nnums = [1], target = 0 → -1',
          ask: [
            'Clarify: duplicates ho sakte hain? (nahi — distinct)',
            'Brute bolo aur uski complexity (linear scan O(n)).',
            'Follow-up 1: "Kaunsa half sorted hai" kaise decide kiya? <code>nums[lo] &lt;= nums[mid]</code> me = kyun?',
            'Follow-up 2: Pehle pivot (minimum, LC 153) dhundh ke do binary search — trade-off?',
            'Follow-up 3: Duplicates allowed ho toh worst case? (O(n) — lo++ karna padta hai)',
          ],
          hints: [
            'Rotated array ko mid pe todo — ek half hamesha sorted hoga.',
            'Sorted half ka range pata hai: check karo target usme hai ya nahi.',
            'Hai → us half me jao, nahi → doosre half me.',
            'Left half sorted check: <code>nums[lo] &lt;= nums[mid]</code> (= tab jab lo == mid).',
          ],
          rubric: [
            ['Clarify', 'Distinct values, O(log n) requirement confirm kiya', ''],
            ['Brute', 'Linear scan O(n) bola', ''],
            ['Optimal', 'Sorted half identify + range check', ''],
            ['Code', 'Boundary conditions (&lt;=, &lt;) sahi, mid overflow-safe', ''],
            ['Test', 'Target pivot ke dono taraf + not found + 1 element', ''],
            ['Communication', 'Invariant clearly bola, follow-ups confidently', ''],
          ],
          code: `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
          hook: 'Ek half hamesha sorted — target uski range me? wahan jao, warna doosri taraf.',
        }),
        {
          title: 'Part 3 — Interview communication checklist',
          blocks: [
            { table: { head: ['Step', 'Kya bolna hai (English)', 'Galti jo avoid karni hai'], rows: [
              ['1. Restate', '"So I need to… given… return…"', 'Seedha code shuru'],
              ['2. Clarify', '"Can the input be empty? Are there duplicates? What is n?"', 'Assume kar lena'],
              ['3. Example', '"Let me walk through a small example…"', 'Sirf given example'],
              ['4. Brute', '"A brute force would be… O(n²)."', 'Brute skip karna'],
              ['5. Optimal', '"The repeated work is…, so I can use…"', 'Bina explain kiye code'],
              ['6. Code', 'Code likhte hue bolo kya kar rahe ho', '5 min ki khamoshi'],
              ['7. Test', '"Let me dry-run… and check the edge case…"', '"I think it works"'],
              ['8. Complexity', '"Time O(…) because…, space O(…)"', 'Interviewer ke puchne ka wait'],
            ] } },
            { tip: 'Hint mile toh: "That makes sense — so if I…" bol ke hint ko apne words me repeat karo. Ye positive signal hai.' },
          ],
        },
        {
          title: 'Part 4 — LeetCode Weekly Contest plan + discussion template',
          blocks: [
            { list: [
              '<b>Contest:</b> Sunday 8:00 AM IST. Goal — Sohvi: exposure (Q1, Q2 try), Tum: speed (Q1–Q3, Q4 attempt).',
              'Pehle saare 4 problems 5 min padho, phir easiest se shuru.',
              'Wrong answer pe 10 min se zyada mat atko — agla question.',
              'Contest ke baad hi editorial/solutions dekho.',
            ] },
            { h: 'Discussion template (har question ke liye)' },
            { table: { head: ['Question', 'Pattern pehchana?', 'Time laga', 'Kahan atke', 'Course ke kis question jaisa'], rows: [
              ['Q1', '', '', '', ''],
              ['Q2', '', '', '', ''],
              ['Q3', '', '', '', ''],
              ['Q4', '', '', '', ''],
            ] } },
            { tip: 'Contest ka rank nahi, "pattern pehchana ya nahi" track karo. Rank kharab aaye toh bhi participate karna hai.' },
          ],
        },
        {
          title: 'Part 5 — Interview mix: chhote sawaal',
          blocks: [
            { qa: [
              ['LC 21 recursive kaise?', 'Chhote head ko lo, uska next = merge(baaki dono); base: koi null ho toh doosra return.'],
              ['LC 21 me <code>&lt;=</code> ya <code>&lt;</code>?', 'Dono sahi; <code>&lt;=</code> se stable merge (list1 pehle).'],
              ['LC 33 me <code>nums[lo] &lt;= nums[mid]</code> me = kyun?', 'Jab lo == mid (2 elements bache), left half 1 element ka hai — sorted maana jaana chahiye.'],
              ['LC 153 minimum kaise?', '<code>nums[mid] &gt; nums[hi]</code> → min right me (lo = mid + 1), warna hi = mid.'],
              ['Mock me interviewer chup ho toh?', 'Apna plan bolte raho aur pucho "Does this approach sound good before I code?"'],
              ['Code likhne ke baad pehla kaam?', 'Dry run on example, phir edge case — bina pooche.'],
            ] },
          ],
        },
        {
          title: 'Part 6 — Aise bolo (1-minute answers)',
          blocks: [
            { say: [
              ['LC 21 — approach', 'I create a dummy node and a tail pointer. While both lists have nodes, I attach the smaller head to tail and advance that list. When one list runs out, I attach the remainder of the other, since it is already sorted. I return dummy.next. It is O(m + n) time and O(1) extra space because I reuse the existing nodes.'],
              ['LC 33 — approach', 'In a rotated sorted array, splitting at mid always leaves at least one sorted half. I check which half is sorted by comparing nums[lo] with nums[mid]. If the target lies within the sorted half’s range I search there; otherwise I search the other half. Each step discards half the array, so it is O(log n) time and O(1) space.'],
              ['Mock feedback — how to give it', 'I start with what went well, for example clear clarifying questions, then give one or two specific improvements, like stating complexity before being asked or testing an empty input. I tie each point to a moment in the interview so it is actionable.'],
            ] },
          ],
        },
        {
          title: 'Part 7 — Sohvi session',
          blocks: [
            { olist: [
              'Mock ke baad LC 21 dobara khud likho — jo hint liya tha woh bina hint.',
              'Interviewer bante waqt rubric bhar ke Tum ko feedback do (2 + 2 points).',
              'Contest: Q1 zaroor submit karo, Q2 try.',
              'Communication checklist (Part 3) ke 8 steps zubaani yaad karo.',
            ] },
          ],
        },
        {
          title: 'Part 8 — Sohel session (SDE-2 practice)',
          blocks: [
            { olist: [
              '<b>Task A:</b> Mock me jo bhi rubric row 2 se kam aayi, us part ko dobara bolke practice.',
              '<b>Task B:</b> LC 33 ke baad LC 153 aur pivot + two binary search wala approach 15 min me.',
              '<b>Task C:</b> Contest me Q1–Q3 target; har solved question ka time note karo.',
              '<b>Course target (time ho toh):</b> 3 Medium + 1 Hard → LC 153, LC 142, LC 19 + LC 25 (Hard).',
            ] },
          ],
        },
        {
          title: 'Part 9 — Homework',
          blocks: [
            { list: [
              'Mock feedback dono apni mistake log me likho.',
              'Contest discussion template bharo.',
              'Kal (Day 8): Trees DFS — LC 104 aur LC 543.',
            ] },
          ],
        },
        {
          title: 'Part 10 — Final self-test (bina notes)',
          blocks: [
            { qa: [
              ['<code>[4,5,6,7,0,1,2]</code>, target 0 → ?', '4'],
              ['Merge two sorted lists ka time / space?', 'O(m + n) / O(1).'],
              ['Interview ke 8 steps?', 'Restate, clarify, example, brute, optimal, code, test, complexity.'],
              ['Rotated array me kya hamesha sach hai?', 'mid ke ek taraf ka half sorted hota hai.'],
              ['Contest me ek question pe kitna max atakna?', '~10 min, phir next.'],
            ] },
          ],
        },
      ],
      checks: [
        'Mock as candidate diya, notes band rakhe',
        'Mock as interviewer rubric bhara aur feedback diya',
        'LC 21 / LC 33 mock ke baad bina dekhe Accepted',
        'Communication checklist ke 8 steps zubaani',
        'Weekly Contest me participate kiya',
        'Contest discussion template bhara',
        'Final self-test ke 5 sawaal sahi',
      ],
      memory: 'Mock = bolke solve: restate → clarify → brute → optimal → code → test → complexity.',
    },
  });
})();
