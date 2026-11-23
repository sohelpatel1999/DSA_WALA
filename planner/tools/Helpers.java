// validate-lessons.js --java har DSA approach ke saath ye bhi compile karta hai (LeetCode jaisi ListNode / TreeNode + test helpers).
import java.util.*;

class ListNode {
    int val; ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class TreeNode {
    int val; TreeNode left, right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
}

// Tests me: LL.of(1, 2, 3) → list · LL.str(head) → "1 -> 2 -> 3 -> null" · LL.cycle(new int[]{3,2,0,-4}, 1) → tail.next = node[1]
class LL {
    static ListNode of(int... a) {
        ListNode dummy = new ListNode(0), t = dummy;
        for (int x : a) { t.next = new ListNode(x); t = t.next; }
        return dummy.next;
    }
    static String str(ListNode h) {
        StringBuilder sb = new StringBuilder();
        int guard = 0;
        for (ListNode c = h; c != null && guard < 1000; c = c.next, guard++) sb.append(c.val).append(" -> ");
        return sb.append("null").toString();
    }
    static ListNode cycle(int[] a, int pos) {
        ListNode head = of(a);
        if (pos < 0 || head == null) return head;
        ListNode tail = head, target = null;
        for (int i = 0; tail.next != null || i == 0; i++) {
            if (i == pos) target = tail;
            if (tail.next == null) break;
            tail = tail.next;
        }
        if (target == null && pos == a.length - 1) target = tail;
        tail.next = target;
        return head;
    }
    static ListNode node(ListNode head, int index) {
        ListNode c = head;
        for (int i = 0; i < index; i++) c = c.next;
        return c;
    }
}
