// Phase 1: har question ka problem statement (apne shabdon me), LeetCode-style examples aur constraints.
// examples[].viz = visualizer ke input fields (visualizer me "Example N" button isi se chalta hai).
(function () {
  const P = {
    1920: {
      statement: 'Ek array <b>nums</b> diya hai jo 0 se n−1 tak ka permutation hai (har number ek hi baar). Ek naya array <b>ans</b> banao jahan <code>ans[i] = nums[nums[i]]</code>.',
      examples: [
        { input: 'nums = [0,2,1,5,3,4]', output: '[0,1,2,4,5,3]', explain: 'ans[0] = nums[nums[0]] = nums[0] = 0, ans[1] = nums[nums[1]] = nums[2] = 1, ans[3] = nums[5] = 4 …', viz: { nums: '0, 2, 1, 5, 3, 4' } },
        { input: 'nums = [5,0,1,2,3,4]', output: '[4,5,0,1,2,3]', explain: 'ans[0] = nums[5] = 4, ans[1] = nums[0] = 5, ans[2] = nums[1] = 0 …', viz: { nums: '5, 0, 1, 2, 3, 4' } },
      ],
      constraints: ['1 ≤ nums.length ≤ 1000', '0 ≤ nums[i] < nums.length', 'Saare elements distinct', 'Follow-up: O(1) extra space me karo'],
    },
    1480: {
      statement: 'Array <b>nums</b> ka running sum return karo, jahan <code>runningSum[i] = nums[0] + nums[1] + … + nums[i]</code>.',
      examples: [
        { input: 'nums = [1,2,3,4]', output: '[1,3,6,10]', explain: '1, 1+2, 1+2+3, 1+2+3+4', viz: { nums: '1, 2, 3, 4' } },
        { input: 'nums = [1,1,1,1,1]', output: '[1,2,3,4,5]', explain: 'Har step pe 1 add hota hai.', viz: { nums: '1, 1, 1, 1, 1' } },
        { input: 'nums = [3,1,2,10,1]', output: '[3,4,6,16,17]', explain: '3, 3+1, 4+2, 6+10, 16+1', viz: { nums: '3, 1, 2, 10, 1' } },
      ],
      constraints: ['1 ≤ nums.length ≤ 1000', '−10⁶ ≤ nums[i] ≤ 10⁶'],
    },
    217: {
      statement: 'Integer array <b>nums</b> diya hai. Agar koi value <b>kam se kam do baar</b> aati hai toh <code>true</code>, warna (sab distinct) <code>false</code> return karo.',
      examples: [
        { input: 'nums = [1,2,3,1]', output: 'true', explain: '1 index 0 aur 3 dono pe hai.', viz: { nums: '1, 2, 3, 1' } },
        { input: 'nums = [1,2,3,4]', output: 'false', explain: 'Saare elements alag hain.', viz: { nums: '1, 2, 3, 4' } },
        { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true', explain: '1, 3, 4, 2 sab repeat hote hain.', viz: { nums: '1, 1, 1, 3, 3, 4, 3, 2, 4, 2' } },
      ],
      constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    },
    1: {
      statement: 'Array <b>nums</b> aur ek <b>target</b> diya hai. Do <b>alag indices</b> return karo jinke elements ka sum target ho. Exactly ek answer hota hai, aur same element do baar use nahi kar sakte. Indices kisi bhi order me de sakte ho.',
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explain: 'nums[0] + nums[1] = 2 + 7 = 9', viz: { nums: '2, 7, 11, 15', target: '9' } },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explain: '2 + 4 = 6 (index 0 wala 3 khud se pair nahi ho sakta)', viz: { nums: '3, 2, 4', target: '6' } },
        { input: 'nums = [3,3], target = 6', output: '[0,1]', explain: 'Same value, lekin alag indices.', viz: { nums: '3, 3', target: '6' } },
      ],
      constraints: ['2 ≤ nums.length ≤ 10⁴', '−10⁹ ≤ nums[i], target ≤ 10⁹', 'Sirf ek valid answer exist karta hai', 'Follow-up: O(n²) se kam me karo'],
    },
    53: {
      statement: 'Array <b>nums</b> me woh <b>subarray</b> (continuous, kam se kam 1 element) dhundo jiska sum sabse bada ho, aur woh sum return karo.',
      examples: [
        { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explain: 'Subarray [4,-1,2,1] ka sum 6 hai, isse bada koi nahi.', viz: { nums: '-2, 1, -3, 4, -1, 2, 1, -5, 4' } },
        { input: 'nums = [1]', output: '1', explain: 'Sirf ek element.', viz: { nums: '1' } },
        { input: 'nums = [5,4,-1,7,8]', output: '23', explain: 'Poora array hi best hai: 5+4−1+7+8 = 23', viz: { nums: '5, 4, -1, 7, 8' } },
      ],
      constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁴ ≤ nums[i] ≤ 10⁴', 'Follow-up: divide & conquer approach bhi try karo'],
    },
    26: {
      statement: '<b>Sorted</b> (non-decreasing) array <b>nums</b> me se duplicates <b>in-place</b> hatao taaki har value ek hi baar aaye, order same rahe. Unique elements ki ginti <b>k</b> return karo — nums ke pehle k elements me unique values honi chahiye, baaki kuch bhi ho.',
      examples: [
        { input: 'nums = [1,1,2]', output: '2, nums = [1,2,_]', ret: '2', explain: 'Pehle 2 elements 1 aur 2 hain; uske baad kya hai, matter nahi karta.', viz: { nums: '1, 1, 2' } },
        { input: 'nums = [0,0,1,1,1,2,2,3,3,4]', output: '5, nums = [0,1,2,3,4,_,_,_,_,_]', ret: '5', explain: 'Unique values 0,1,2,3,4 → k = 5', viz: { nums: '0, 0, 1, 1, 1, 2, 2, 3, 3, 4' } },
      ],
      constraints: ['1 ≤ nums.length ≤ 3 × 10⁴', '−100 ≤ nums[i] ≤ 100', 'nums non-decreasing order me sorted hai', 'Extra array nahi — O(1) extra space'],
    },
    238: {
      statement: 'Array <b>nums</b> diya hai. Array <b>answer</b> return karo jahan <code>answer[i]</code> = nums ke <b>baaki sab elements</b> (nums[i] ko chhod ke) ka product. <b>Division use nahi</b> karna, aur O(n) time chahiye.',
      examples: [
        { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explain: 'answer[0] = 2×3×4 = 24, answer[1] = 1×3×4 = 12, answer[2] = 1×2×4 = 8, answer[3] = 1×2×3 = 6', viz: { nums: '1, 2, 3, 4' } },
        { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]', explain: 'Index 2 pe 0 hai, isliye baaki sab answers 0; answer[2] = −1×1×−3×3 = 9', viz: { nums: '-1, 1, 0, -3, 3' } },
      ],
      constraints: ['2 ≤ nums.length ≤ 10⁵', '−30 ≤ nums[i] ≤ 30', 'Har prefix/suffix product 32-bit int me fit hota hai', 'Follow-up: O(1) extra space (output array count nahi hota)'],
    },
    560: {
      statement: 'Array <b>nums</b> aur integer <b>k</b> diya hai. Kitne <b>subarrays</b> (continuous, non-empty) ka sum exactly k hai — woh count return karo.',
      examples: [
        { input: 'nums = [1,1,1], k = 2', output: '2', explain: '[1,1] (index 0..1) aur [1,1] (index 1..2)', viz: { nums: '1, 1, 1', k: '2' } },
        { input: 'nums = [1,2,3], k = 3', output: '2', explain: '[1,2] aur [3]', viz: { nums: '1, 2, 3', k: '3' } },
      ],
      constraints: ['1 ≤ nums.length ≤ 2 × 10⁴', '−1000 ≤ nums[i] ≤ 1000 (negatives bhi!)', '−10⁷ ≤ k ≤ 10⁷'],
    },
    525: {
      statement: 'Binary array <b>nums</b> (sirf 0 aur 1) diya hai. Sabse lamba <b>subarray</b> dhundo jisme <b>0 aur 1 barabar</b> sankhya me hon, aur uski length return karo.',
      examples: [
        { input: 'nums = [0,1]', output: '2', explain: '[0,1] me ek 0 aur ek 1.', viz: { nums: '0, 1' } },
        { input: 'nums = [0,1,0]', output: '2', explain: '[0,1] ya [1,0] — dono length 2.', viz: { nums: '0, 1, 0' } },
        { input: 'nums = [0,1,1,1,1,1,0,0,0]', output: '6', explain: '[1,1,1,0,0,0] me teen 1 aur teen 0.', viz: { nums: '0, 1, 1, 1, 1, 1, 0, 0, 0' } },
      ],
      constraints: ['1 ≤ nums.length ≤ 10⁵', 'nums[i] sirf 0 ya 1'],
    },
    41: {
      statement: 'Unsorted array <b>nums</b> me <b>sabse chhota positive integer</b> dhundo jo array me <b>nahi</b> hai. <b>O(n) time</b> aur <b>O(1) extra space</b> chahiye.',
      examples: [
        { input: 'nums = [1,2,0]', output: '3', explain: '1 aur 2 hain, 3 nahi hai.', viz: { nums: '1, 2, 0' } },
        { input: 'nums = [3,4,-1,1]', output: '2', explain: '1 hai lekin 2 nahi hai.', viz: { nums: '3, 4, -1, 1' } },
        { input: 'nums = [7,8,9,11,12]', output: '1', explain: '1 hi missing hai.', viz: { nums: '7, 8, 9, 11, 12' } },
      ],
      constraints: ['1 ≤ nums.length ≤ 10⁵', '−2³¹ ≤ nums[i] ≤ 2³¹ − 1', 'O(n) time, O(1) auxiliary space'],
    },
    128: {
      statement: 'Unsorted array <b>nums</b> me sabse lambi <b>consecutive numbers ki sequence</b> (jaise 1,2,3,4) ki length return karo. Elements array me kisi bhi order me ho sakte hain. <b>O(n)</b> me karna hai.',
      examples: [
        { input: 'nums = [100,4,200,1,3,2]', output: '4', explain: 'Sequence 1,2,3,4 → length 4', viz: { nums: '100, 4, 200, 1, 3, 2' } },
        { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9', explain: '0 se 8 tak sab hain → 9 (0 do baar hai, ek hi baar gina jaayega)', viz: { nums: '0, 3, 7, 2, 5, 8, 4, 6, 0, 1' } },
      ],
      constraints: ['0 ≤ nums.length ≤ 10⁵', '−10⁹ ≤ nums[i] ≤ 10⁹', 'O(n) time'],
    },
    169: {
      statement: 'Array <b>nums</b> (size n) ka <b>majority element</b> return karo — woh element jo <b>n/2 se zyada</b> baar aata hai. Majority element hamesha exist karta hai.',
      examples: [
        { input: 'nums = [3,2,3]', output: '3', explain: '3 do baar aaya, n/2 = 1.5 se zyada.', viz: { nums: '3, 2, 3' } },
        { input: 'nums = [2,2,1,1,1,2,2]', output: '2', explain: '2 chaar baar aaya, n/2 = 3.5 se zyada.', viz: { nums: '2, 2, 1, 1, 1, 2, 2' } },
      ],
      constraints: ['1 ≤ n ≤ 5 × 10⁴', '−10⁹ ≤ nums[i] ≤ 10⁹', 'Follow-up: O(n) time aur O(1) space'],
    },
    1295: {
      statement: 'Integer array <b>nums</b> diya hai. Kitne numbers me <b>even number of digits</b> hain — woh count return karo.',
      examples: [
        { input: 'nums = [12,345,2,6,7896]', output: '2', explain: '12 (2 digits) aur 7896 (4 digits) even hain; 345 (3), 2 (1), 6 (1) odd.', viz: { nums: '12, 345, 2, 6, 7896' } },
        { input: 'nums = [555,901,482,1771]', output: '1', explain: 'Sirf 1771 me 4 digits hain; baaki sab 3 digits.', viz: { nums: '555, 901, 482, 1771' } },
      ],
      constraints: ['1 ≤ nums.length ≤ 500', '1 ≤ nums[i] ≤ 10⁵'],
    },
    303: {
      statement: 'Integer array <b>nums</b> diya hai. Class <code>NumArray</code> banao: constructor <code>NumArray(int[] nums)</code>, aur <code>sumRange(left, right)</code> jo index <b>left se right tak (dono shamil)</b> ka sum return kare. Array kabhi badalta nahi, lekin sumRange <b>bahut baar</b> call hoga.',
      examples: [
        { input: '["NumArray","sumRange","sumRange","sumRange"]\n[[[-2,0,3,-5,2,-1]],[0,2],[2,5],[0,5]]', output: '[null, 1, -1, -3]', explain: 'sumRange(0,2) = −2+0+3 = 1; (2,5) = 3−5+2−1 = −1; (0,5) = −3. Constructor kuch return nahi karta → null.', viz: { nums: '-2, 0, 3, -5, 2, -1', queries: '[[0,2],[2,5],[0,5]]' } },
        { input: '["NumArray","sumRange","sumRange","sumRange"]\n[[[1,2,3,4,5]],[0,2],[1,3],[2,4]]', output: '[null, 6, 9, 12]', explain: '1+2+3 = 6, 2+3+4 = 9, 3+4+5 = 12.', viz: { nums: '1, 2, 3, 4, 5', queries: '[[0,2],[1,3],[2,4]]' } },
      ],
      constraints: ['1 ≤ nums.length ≤ 10⁴', '−10⁵ ≤ nums[i] ≤ 10⁵', '0 ≤ left ≤ right < nums.length', 'sumRange zyada se zyada 10⁴ baar call hoga'],
    },
    268: {
      statement: 'Array <b>nums</b> me <b>n</b> alag-alag numbers hain jo range <code>[0, n]</code> se liye gaye hain. Is range ka <b>ek number missing</b> hai — use return karo.',
      examples: [
        { input: 'nums = [3,0,1]', output: '2', explain: 'n = 3, range 0..3; 2 nahi hai.', viz: { nums: '3, 0, 1' } },
        { input: 'nums = [0,1]', output: '2', explain: 'n = 2, range 0..2; 2 missing.', viz: { nums: '0, 1' } },
        { input: 'nums = [9,6,4,2,3,5,7,0,1]', output: '8', explain: 'n = 9, range 0..9; 8 missing.', viz: { nums: '9, 6, 4, 2, 3, 5, 7, 0, 1' } },
      ],
      constraints: ['n == nums.length', '1 ≤ n ≤ 10⁴', '0 ≤ nums[i] ≤ n', 'Saare numbers unique', 'Follow-up: O(1) extra space aur O(n) time'],
    },
  };
  const Q = window.PHASE_CONTENT['arrays'].questions;
  Object.keys(P).forEach(n => { if (Q[n]) Q[n].problem = P[n]; });
})();
