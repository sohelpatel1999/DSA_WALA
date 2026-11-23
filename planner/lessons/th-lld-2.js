// Planner lessons — LLD rounds (lp2 LRU Cache)
// Theory format: concept Hinglish me → har planner interview question ka English answer (qa) → code + output → traps → self-test.
// NOTE: JUnit classpath pe nahi — "unit tests" ek main() hai jo checks chala ke PASS lines print karta hai; JUnit 5 form `pre` me.
// snippets: validate-lessons.js --java inhe compile + run karke output match karta hai.
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});

  // ======================= lp2 — code examples =======================
  const IMPORTS = `import java.util.concurrent.atomic.*;
import java.util.concurrent.locks.*;
`;

  const CORE = `class LRUCache<K, V> {
    private static final class Node<K, V> {               // doubly linked list ka node
        K key;                                            // key bhi rakho: evict karte waqt map se hatani hai
        V value;
        Node<K, V> prev, next;
        Node(K key, V value) { this.key = key; this.value = value; }
    }

    private final int capacity;
    private final Map<K, Node<K, V>> map = new HashMap<>();   // key -> node, O(1) lookup (c3)
    private final Node<K, V> head = new Node<>(null, null);   // dummy head: head.next = MRU
    private final Node<K, V> tail = new Node<>(null, null);   // dummy tail: tail.prev = LRU

    LRUCache(int capacity) {
        if (capacity <= 0) throw new IllegalArgumentException("capacity must be > 0");
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    V get(K key) {
        Node<K, V> node = map.get(key);
        if (node == null) return null;                    // miss
        moveToFront(node);                                // hit → ab ye most recently used
        return node.value;
    }

    void put(K key, V value) {
        Node<K, V> node = map.get(key);
        if (node != null) {                               // update: value badlo + front pe lao
            node.value = value;
            moveToFront(node);
            return;
        }
        if (map.size() == capacity) {                     // full → LRU (tail.prev) nikalo
            Node<K, V> lru = tail.prev;
            unlink(lru);
            map.remove(lru.key);
        }
        node = new Node<>(key, value);
        addFirst(node);
        map.put(key, node);
    }

    int size() { return map.size(); }

    private void unlink(Node<K, V> n) {                   // O(1): prev aur next ko jodo
        n.prev.next = n.next;
        n.next.prev = n.prev;
    }
    private void addFirst(Node<K, V> n) {                 // head ke turant baad
        n.prev = head;
        n.next = head.next;
        head.next.prev = n;
        head.next = n;
    }
    private void moveToFront(Node<K, V> n) { unlink(n); addFirst(n); }

    List<K> keysMruToLru() {                              // debug / test ke liye
        List<K> keys = new ArrayList<>();
        for (Node<K, V> n = head.next; n != tail; n = n.next) keys.add(n.key);
        return keys;
    }
}
`;

  const BASIC_MAIN = `
public class Main {
    public static void main(String[] args) {
        LRUCache<Integer, Integer> c = new LRUCache<>(2);   // LC 146 ka example
        c.put(1, 1);
        c.put(2, 2);
        System.out.println("put 1, put 2      -> " + c.keysMruToLru());
        System.out.println("get(1) = " + c.get(1) + "        -> " + c.keysMruToLru());
        c.put(3, 3);
        System.out.println("put 3 (evicts 2)  -> " + c.keysMruToLru());
        System.out.println("get(2) = " + c.get(2));
        c.put(4, 4);
        System.out.println("put 4 (evicts 1)  -> " + c.keysMruToLru());
        System.out.println("get(1) = " + c.get(1) + ", get(3) = " + c.get(3) + ", get(4) = " + c.get(4));
        c.put(3, 30);
        System.out.println("put 3=30 (update) -> " + c.keysMruToLru() + ", get(3) = " + c.get(3));

        LRUCache<String, String> pages = new LRUCache<>(2);   // generic: String -> String
        pages.put("/home", "<html>home</html>");
        pages.put("/cart", "<html>cart</html>");
        pages.get("/home");
        pages.put("/pay", "<html>pay</html>");
        System.out.println("String cache       -> " + pages.keysMruToLru());
    }
}`;

  const SAFE = `
class ConcurrentLRUCache<K, V> {                          // thread-safe wrapper: ek lock, saare operations
    private final LRUCache<K, V> cache;
    private final ReentrantLock lock = new ReentrantLock();
    ConcurrentLRUCache(int capacity) { cache = new LRUCache<>(capacity); }

    V get(K key) {                                        // get bhi list badalta hai → lock zaroori
        lock.lock();
        try { return cache.get(key); } finally { lock.unlock(); }
    }
    void put(K key, V value) {
        lock.lock();
        try { cache.put(key, value); } finally { lock.unlock(); }
    }
    int size() {
        lock.lock();
        try { return cache.size(); } finally { lock.unlock(); }
    }
    List<K> keysMruToLru() {
        lock.lock();
        try { return cache.keysMruToLru(); } finally { lock.unlock(); }
    }
}
`;

  const SAFE_MAIN = `
public class Main {
    public static void main(String[] args) throws InterruptedException {
        ConcurrentLRUCache<Integer, Integer> cache = new ConcurrentLRUCache<>(100);
        AtomicInteger hits = new AtomicInteger(), misses = new AtomicInteger();
        List<Thread> threads = new ArrayList<>();
        for (int t = 0; t < 8; t++) {
            final int seed = t;
            Thread th = new Thread(() -> {
                for (int i = 0; i < 10_000; i++) {
                    int key = (seed * 37 + i) % 300;
                    if (cache.get(key) == null) { misses.incrementAndGet(); cache.put(key, i); }
                    else hits.incrementAndGet();
                }
            });
            threads.add(th);
            th.start();
        }
        for (Thread th : threads) th.join();              // sab khatam hone do → output deterministic

        List<Integer> keys = cache.keysMruToLru();
        System.out.println("operations = " + (hits.get() + misses.get()));
        System.out.println("size = " + cache.size() + " (capacity 100)");
        System.out.println("list length == map size: " + (keys.size() == cache.size()));
        System.out.println("no duplicate keys in list: " + (new HashSet<>(keys).size() == keys.size()));
    }
}`;

  const LHM = `class LinkedLRU<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;
    LinkedLRU(int capacity) {
        super(16, 0.75f, true);                           // accessOrder = true: get() entry ko end pe le jaata
        this.capacity = capacity;
    }
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {   // har put ke baad call hota hai
        return size() > capacity;                         // true → eldest (LRU, sabse pehla) hat jaata
    }
}

public class Main {
    public static void main(String[] args) {
        LinkedLRU<Integer, Integer> c = new LinkedLRU<>(2);
        c.put(1, 1);
        c.put(2, 2);
        c.get(1);
        System.out.println("after get(1)        : " + c + "   (iteration = LRU -> MRU)");
        c.put(3, 3);
        System.out.println("put 3 (evicts 2)    : " + c);
        c.containsKey(1);
        c.put(4, 4);
        System.out.println("containsKey(1), put 4: " + c + "   (containsKey ne recency nahi badli)");
        c.getOrDefault(3, -1);
        c.put(5, 5);
        System.out.println("getOrDefault(3), put 5: " + c + "   (getOrDefault access hai)");

        Map<Integer, Integer> insertion = new LinkedHashMap<>();   // default: insertion order
        insertion.put(1, 1); insertion.put(2, 2); insertion.get(1);
        System.out.println("insertion-order map : " + insertion + "   (get ka asar nahi)");

        try {
            for (Integer k : c.keySet()) c.get(k);        // access-order me get = structural modification
        } catch (ConcurrentModificationException e) {
            System.out.println("get() while iterating -> ConcurrentModificationException");
        }

        Map<Integer, Integer> safe = Collections.synchronizedMap(new LinkedLRU<>(2));   // thread-safe (har call pe lock)
        safe.put(7, 7); safe.put(8, 8); safe.get(7); safe.put(9, 9);
        System.out.println("synchronizedMap LRU : " + safe);
    }
}`;

  const TESTS_MAIN = `
class LinkedLRU<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;
    LinkedLRU(int capacity) { super(16, 0.75f, true); this.capacity = capacity; }
    @Override protected boolean removeEldestEntry(Map.Entry<K, V> eldest) { return size() > capacity; }
}

public class Main {
    static int passed = 0;
    static void check(String name, boolean ok) {          // mini assert (JUnit classpath pe nahi)
        if (!ok) throw new AssertionError("FAIL " + name);
        passed++;
        System.out.println("PASS " + name);
    }

    public static void main(String[] args) throws InterruptedException {
        LRUCache<Integer, String> c = new LRUCache<>(2);
        check("get on empty cache returns null", c.get(1) == null);

        c.put(1, "a"); c.put(2, "b"); c.put(3, "c");
        check("evicts least recently used when full", c.get(1) == null && c.size() == 2);

        c = new LRUCache<>(2);
        c.put(1, "a"); c.put(2, "b"); c.get(1); c.put(3, "c");
        check("get refreshes recency", c.get(1).equals("a") && c.get(2) == null);

        c = new LRUCache<>(2);
        c.put(1, "a"); c.put(2, "b"); c.put(1, "A"); c.put(3, "c");
        check("put on existing key updates value and recency", c.get(1).equals("A") && c.get(2) == null && c.size() == 2);

        LRUCache<String, Integer> one = new LRUCache<>(1);
        one.put("x", 1); one.put("y", 2);
        check("capacity 1 keeps only the latest", one.get("x") == null && one.get("y") == 2);

        boolean threw = false;
        try { new LRUCache<Integer, Integer>(0); } catch (IllegalArgumentException e) { threw = true; }
        check("capacity 0 is rejected", threw);

        LinkedLRU<Integer, String> l = new LinkedLRU<>(2);
        l.put(1, "a"); l.put(2, "b"); l.get(1); l.put(3, "c");
        check("LinkedHashMap version behaves the same", l.keySet().equals(new LinkedHashSet<>(List.of(1, 3))));

        ConcurrentLRUCache<Integer, Integer> safe = new ConcurrentLRUCache<>(50);
        Thread[] ts = new Thread[4];
        for (int t = 0; t < ts.length; t++) {
            final int base = t * 1000;
            ts[t] = new Thread(() -> { for (int i = 0; i < 5000; i++) safe.put(base + i % 200, i); });
            ts[t].start();
        }
        for (Thread t : ts) t.join();
        check("concurrent puts never exceed capacity", safe.size() == 50 && safe.keysMruToLru().size() == 50);

        System.out.println(passed + " tests passed");
    }
}`;

  const BASIC = CORE + BASIC_MAIN;
  const CONCURRENT = IMPORTS + CORE + SAFE + SAFE_MAIN;
  const TESTS = IMPORTS + CORE + SAFE + TESTS_MAIN;

  const BASIC_OUT = `put 1, put 2      -> [2, 1]
get(1) = 1        -> [1, 2]
put 3 (evicts 2)  -> [3, 1]
get(2) = null
put 4 (evicts 1)  -> [4, 3]
get(1) = null, get(3) = 3, get(4) = 4
put 3=30 (update) -> [3, 4], get(3) = 30
String cache       -> [/pay, /home]`;

  const CONCURRENT_OUT = `operations = 80000
size = 100 (capacity 100)
list length == map size: true
no duplicate keys in list: true`;

  const LHM_OUT = `after get(1)        : {2=2, 1=1}   (iteration = LRU -> MRU)
put 3 (evicts 2)    : {1=1, 3=3}
containsKey(1), put 4: {3=3, 4=4}   (containsKey ne recency nahi badli)
getOrDefault(3), put 5: {3=3, 5=5}   (getOrDefault access hai)
insertion-order map : {1=1, 2=2}   (get ka asar nahi)
get() while iterating -> ConcurrentModificationException
synchronizedMap LRU : {7=7, 9=9}`;

  const TESTS_OUT = `PASS get on empty cache returns null
PASS evicts least recently used when full
PASS get refreshes recency
PASS put on existing key updates value and recency
PASS capacity 1 keeps only the latest
PASS capacity 0 is rejected
PASS LinkedHashMap version behaves the same
PASS concurrent puts never exceed capacity
8 tests passed`;

  // =================================================================
  L.lp2 = {
    kind: 'th', title: 'LLD: LRU Cache', topic: 'LLD',
    goal: 'Sunday LLD round: LRU Cache ko interview ki tarah design karo — <b>requirements</b>, <b>HashMap + doubly linked list</b> (dummy head/tail) se <b>O(1) get/put</b>, <b>generic</b> <code>LRUCache&lt;K,V&gt;</code>, <b>thread-safe</b> version (lock ke trade-offs, ConcurrentHashMap akela kyun kaafi nahi), <b>LinkedHashMap(accessOrder = true) + removeEldestEntry</b> wala shortcut, aur <b>unit tests</b> — har piece runnable Java + output, aur planner ke <b>4 questions</b> ka English answer.',
    oneLine: 'HashMap key se node O(1) me deta hai, doubly linked list recency order O(1) me sambhalti hai (front = MRU, tail = LRU); get bhi list badalta hai isliye thread-safety ke liye har operation pe lock; production me LinkedHashMap ya Caffeine.',
    parts: [
      { title: '📋 Requirements — pehle 3 minute sirf sawaal', blocks: [
        { p: 'Ye LLD + DSA ka mix hai — LeetCode 146 (x18, aage aayega) yahi hai, par LLD round me interviewer <b>generic, thread-safe, tested</b> class chahta hai. Pehle scope fix karo:' },
        { table: { head: ['Area', 'Kya poochna hai', 'Hamara assumption'], rows: [
          ['<b>API</b>', '<code>get(key)</code>, <code>put(key, value)</code>? <code>remove</code>, <code>size</code>?', 'get, put, size (remove easy extension)'],
          ['<b>Miss</b>', 'Miss pe kya return? -1, null, Optional?', '<code>null</code> (generic); LeetCode adapter -1 deta hai'],
          ['<b>Capacity</b>', 'Fixed entries count? Ya bytes / weight?', 'Fixed count, constructor me; &lt;= 0 → exception'],
          ['<b>Eviction</b>', 'Sirf LRU? LFU / TTL bhi?', 'LRU; policy pluggable rakhne ki baat bolo'],
          ['<b>put existing key</b>', 'Value update + recency refresh?', 'Haan, dono'],
          ['<b>Types</b>', 'Sirf int? Generic?', 'Generic <code>&lt;K, V&gt;</code>; keys ka equals/hashCode sahi ho (c2)'],
          ['<b>Concurrency</b>', 'Multiple threads?', 'Haan → thread-safe version'],
          ['<b>Non-functional</b>', 'O(1) chahiye? Metrics (hit rate)? Eviction listener?', 'O(1) get/put; metrics / listener extension'],
        ] } },
        { tip: 'Bolo: <b>"get and put both in O(1) average time; get also counts as a use."</b> — ye ek line interviewer ko dikhati hai ki tumhe pata hai sabse tricky part kya hai: <b>read bhi state badalta hai</b>.' },
      ] },
      { title: '🧱 Design — HashMap + doubly linked list kyun', blocks: [
        { p: 'Do kaam O(1) me chahiye: (1) key se value dhoondhna, (2) "sabse purana use hua" kaun hai ye jaanna aur kisi bhi entry ko "abhi use hua" mark karna. <b>Akela koi DS dono nahi karta</b>:' },
        { table: { head: ['Structure', 'Lookup', 'Recency update', 'Evict LRU'], rows: [
          ['Sirf HashMap', 'O(1)', 'Order hi nahi', 'O(n) scan (timestamps)'],
          ['Sirf linked list', 'O(n) search', 'O(1) agar node mil jaaye', 'O(1) tail'],
          ['Array + timestamps', 'O(n)', 'O(1)', 'O(n)'],
          ['TreeMap (time → key) + HashMap', 'O(1)', 'O(log n)', 'O(log n)'],
          ['<b>HashMap&lt;K, Node&gt; + doubly linked list</b>', '<b>O(1)</b>', '<b>O(1)</b>', '<b>O(1)</b>'],
        ] } },
        { pre: `   map: key -> Node (seedha node ka reference, c3 ka HashMap)
   ┌─────┬─────┬─────┐
   │  3  │  1  │  4  │
   └──┬──┴──┬──┴──┬──┘
      │     │     └──────────────────────┐
      │     └────────────────┐           │
      ▼                      ▼           ▼
 [HEAD] <-> [3:30] <-> [1:10] <-> [4:40] <-> [TAIL]
 dummy       MRU                    LRU       dummy
            (abhi use hua)    (sabse purana — evict yahi)

 get(1):  map se node(1) → unlink → head ke baad daalo     → [HEAD] 1 3 4 [TAIL]
 put(5):  full → tail.prev (4) unlink + map.remove(4) → 5 ko head ke baad → [HEAD] 5 1 3 [TAIL]` },
        { list: [
          '<b>Doubly kyun?</b> Beech ka node O(1) me nikalne ke liye uska <code>prev</code> chahiye (l4 "Delete Node" yaad karo). Singly list me prev dhoondhne me O(n).',
          '<b>Dummy head / tail kyun?</b> Har node ke dono taraf hamesha koi node hai → <code>unlink</code> / <code>addFirst</code> me <code>null</code> check nahi, empty / single-node edge cases khatam (l5–l8 linked list wale dummy node trick jaisa, Day 13–14).',
          '<b>Node me key kyun?</b> Evict karte waqt list se LRU node milta hai, par usko <b>map se bhi hatana</b> hai — uske liye key chahiye.',
          '<b>Map me value nahi, Node kyun?</b> Map se seedha node mile toh list me usko move karna O(1). (c3: HashMap get average O(1); bucket me collision ho toh tree bin O(log n).)',
        ] },
      ] },
      { title: '💻 Core code — generic LRUCache<K, V>', blocks: [
        { p: 'Interview me yahi likhna hai — ~50 lines. Private helpers <code>unlink</code>, <code>addFirst</code>, <code>moveToFront</code> banao toh <code>get</code> / <code>put</code> 5–6 lines ke rehte hain aur bug kam hote hain. Output me list order <b>MRU → LRU</b> hai.' },
        { code: BASIC },
        { pre: 'Output:\n' + BASIC_OUT },
        { list: [
          'put 1, put 2 → [2, 1]; <code>get(1)</code> ne 1 ko front pe laaya → [1, 2]; <code>put 3</code> full tha → LRU (2) gaya.',
          '<code>put(3, 30)</code> existing key → value update <b>aur</b> front pe — size nahi badha, kuch evict nahi hua.',
          'Generic hai toh String pages bhi: <code>/home</code> recently padha gaya isliye <code>/cart</code> evict hua.',
        ] },
        { pre: `// LeetCode 146 (x18) ka exact signature — upar wali generic class ka adapter
class LRUCacheLC {                       // LeetCode pe class ka naam "LRUCache" hi rakhna
    private final LRUCache<Integer, Integer> cache;
    public LRUCacheLC(int capacity) { cache = new LRUCache<>(capacity); }
    public int get(int key) {
        Integer v = cache.get(key);
        return v == null ? -1 : v;       // miss → -1
    }
    public void put(int key, int value) { cache.put(key, value); }
}` },
        { tip: 'Null values: hamara <code>get</code> miss pe <code>null</code> deta hai, toh agar koi <code>put(k, null)</code> kare toh "miss" aur "null value" me farak nahi pata chalega. Interview me bolo: <b>null values reject karenge</b> (<code>Objects.requireNonNull</code>) ya <code>Optional&lt;V&gt;</code> return karenge — ye design decision dikhata hai.' },
      ] },
      { title: '🔒 Thread-safe banao — kaunsa lock, kyun', blocks: [
        { p: 'Do threads ek saath <code>put</code> karein → dono <code>addFirst</code> me <code>head.next</code> padh ke overwrite → node list se gayab par map me hai, ya size capacity se upar. <b>get bhi write hai</b> (node move karta hai) — isliye <b>har operation</b> ko lock chahiye. c7 ka race condition, c15 ke locks.' },
        { table: { head: ['Approach', 'Kaisa', 'Trade-off'], rows: [
          ['<code>synchronized</code> get/put', 'Har method pe object lock', 'Simple, sahi; saare threads ek line me (contention)'],
          ['<b><code>ReentrantLock</code></b> (hamara)', 'Explicit lock / unlock in finally', 'Same correctness; extra: <code>tryLock(timeout)</code>, fair mode, lock ke conditions — par unlock bhoole toh deadlock'],
          ['<code>ReadWriteLock</code>', 'Readers parallel, writer akela', '<b>Kaam nahi aata</b> — get bhi list badalta hai, toh get ko bhi write lock chahiye'],
          ['<b>Sirf <code>ConcurrentHashMap</code></b>', 'Map thread-safe', '<b>Kaafi nahi</b> — map aur list ka update <b>ek atomic step</b> nahi; list khud unsafe; "size check → evict → insert" compound operation race karta hai'],
          ['Lock striping / segmented LRU', 'Key hash se N chhote LRU, har ek ka apna lock', 'High throughput; par LRU <b>approximate</b> (global order nahi, har segment apna)'],
          ['<b>Caffeine</b> (production)', 'ConcurrentHashMap + buffered access events + W-TinyLFU', 'Library — interview me "real system me ye use karunga" bolo'],
        ] } },
        { code: CONCURRENT },
        { pre: 'Output:\n' + CONCURRENT_OUT },
        { pre: `// synchronized version — interview me isse bhi shuru kar sakte ho (chhota hai)
class SyncLRUCache<K, V> {
    private final LRUCache<K, V> cache;
    SyncLRUCache(int capacity) { cache = new LRUCache<>(capacity); }
    public synchronized V get(K key)            { return cache.get(key); }
    public synchronized void put(K key, V value) { cache.put(key, value); }
}

// GALAT: ConcurrentHashMap + unsynchronized list
class BrokenLRU<K, V> {
    private final ConcurrentHashMap<K, Node<K, V>> map = new ConcurrentHashMap<>();
    V get(K key) {
        Node<K, V> n = map.get(key);   // map safe hai...
        moveToFront(n);                // ...par do threads ek saath list ke pointers badal rahe — corruption
        return n.value;
    }
}` },
        { tip: 'Demo sirf <b>invariants</b> print karta hai (size == capacity, list length == map size, koi duplicate nahi) — kaunsa key bacha wo thread scheduling pe depend karta hai, isliye print nahi kiya. Unsafe version yahi checks kabhi-kabhi fail karega (ya infinite loop / NPE) — non-deterministic, isliye run nahi kiya. Lock-based wrapper ko <b>composition</b> se banaya (core class untouched) — Decorator jaisa.' },
      ] },
      { title: '🔁 LinkedHashMap(accessOrder = true) + removeEldestEntry', blocks: [
        { p: 'Java me ye design <b>pehle se bana hua</b> hai: <code>LinkedHashMap</code> = HashMap + entries ke beech doubly linked list (c3). Constructor <code>LinkedHashMap(initialCapacity, loadFactor, <b>accessOrder</b>)</code> me <code>true</code> do toh har <code>get</code> / <code>put</code> entry ko list ke <b>end</b> pe le jaata hai. <code>removeEldestEntry</code> har insert ke baad call hota hai — <code>true</code> return kiya toh <b>eldest</b> (list ka start = LRU) hat jaata hai. 6 lines me LRU.' },
        { code: LHM },
        { pre: 'Output:\n' + LHM_OUT },
        { table: { head: ['', 'Custom HashMap + DLL', 'LinkedHashMap(accessOrder = true)'], rows: [
          ['Code', '~50 lines', '~6 lines'],
          ['Complexity', 'O(1) get / put', 'O(1) get / put (same idea andar)'],
          ['Iteration order', 'Jaisa chaho (hamara MRU → LRU)', '<b>LRU → MRU</b> (eldest pehle)'],
          ['Control', 'Poora — TTL, eviction listener, weights, metrics, null policy', '<code>removeEldestEntry</code> hook tak; sirf ek eldest per insert'],
          ['Thread-safety', 'Khud lock lagao', '<b>Nahi</b> — <code>Collections.synchronizedMap</code> wrap; iteration pe khud <code>synchronized(map)</code>'],
          ['Gotchas', 'Pointer bugs', 'Iteration ke dauraan <code>get</code> = CME; <code>containsKey</code> recency nahi badalta; <code>getOrDefault</code> badalta hai'],
          ['Interview me', '<b>Yahi expected</b> (LC 146 me bhi)', 'Pehle bolo "production me ye / Caffeine", phir interviewer kahe toh custom likho'],
        ] } },
        { tip: 'Interview line: <b>"I know LinkedHashMap with accessOrder true and removeEldestEntry gives an LRU in a few lines; I would use that or Caffeine in production. Shall I implement the underlying HashMap plus doubly linked list myself?"</b> — almost hamesha jawab hoga "haan, khud likho".' },
      ] },
      { title: '🧪 Unit tests — kya test karna hai', blocks: [
        { p: 'LLD round ke end me 5 min tests ke liye bachao. JUnit yahan classpath pe nahi, isliye ek <code>main</code> hai jo har case check karke <b>PASS</b> print karta hai (fail pe <code>AssertionError</code>). Cases: empty get, eviction, get se recency refresh, update existing key, capacity 1, invalid capacity, LinkedHashMap version same behaviour, concurrent puts.' },
        { code: TESTS },
        { pre: 'Output:\n' + TESTS_OUT },
        { pre: `// JUnit 5 form (real project me: src/test/java, dependency org.junit.jupiter:junit-jupiter)
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class LRUCacheTest {
    private LRUCache<Integer, String> cache;

    @BeforeEach
    void setUp() { cache = new LRUCache<>(2); }

    @Test
    void evictsLeastRecentlyUsedWhenFull() {
        cache.put(1, "a"); cache.put(2, "b"); cache.put(3, "c");
        assertNull(cache.get(1));
        assertEquals(2, cache.size());
    }

    @Test
    void getRefreshesRecency() {
        cache.put(1, "a"); cache.put(2, "b");
        cache.get(1);
        cache.put(3, "c");
        assertEquals("a", cache.get(1));
        assertNull(cache.get(2));
    }

    @Test
    void rejectsNonPositiveCapacity() {
        assertThrows(IllegalArgumentException.class, () -> new LRUCache<Integer, String>(0));
    }

    @Test
    void concurrentPutsKeepInvariants() throws Exception {
        ConcurrentLRUCache<Integer, Integer> safe = new ConcurrentLRUCache<>(50);
        ExecutorService pool = Executors.newFixedThreadPool(4);
        for (int t = 0; t < 4; t++) {
            int base = t * 1000;
            pool.submit(() -> { for (int i = 0; i < 5000; i++) safe.put(base + i % 200, i); });
        }
        pool.shutdown();
        assertTrue(pool.awaitTermination(5, TimeUnit.SECONDS));
        assertEquals(50, safe.size());
    }
}` },
        { tip: 'Test naam <b>behaviour</b> bataye (<code>getRefreshesRecency</code>), implementation nahi. Har test ek cheez check kare aur naya cache le (<code>@BeforeEach</code>) — tests ek doosre pe depend na karein.' },
      ] },
      { title: '🎤 Interview — planner ke 4 questions (English answers)', blocks: [
        { tip: 'LLD round me answers <b>bol ke + diagram bana ke</b> dene hote hain. Neeche ke answers template hain — practice me 45 min ka timer lagao: 3 min requirements, 5 min diagram, 20 min code, 7 min thread-safety + LinkedHashMap comparison, 10 min tests. Agar tumhare project me koi in-memory cache (Caffeine / Guava / Redis) tha, uska example jod do.' },
        { qa: [
          ['Design get/put in O(1) with HashMap + doubly linked list.', 'I combine two structures. A HashMap from key to node gives O(1) lookup. A doubly linked list keeps the nodes in recency order: the node right after a dummy head is the most recently used, and the node right before a dummy tail is the least recently used. On get, I look up the node in the map; on a miss I return null, on a hit I unlink the node and insert it after the head, then return its value. On put, if the key exists I update the value and move the node to the front; otherwise, if the cache is full, I remove the node before the tail from the list and remove its key from the map — that is why each node stores its key — and then insert the new node after the head and put it in the map. Unlinking is O(1) because the list is doubly linked, and the dummy nodes remove all null checks for empty or single-element lists. Both operations are O(1) on average, and space is O(capacity).'],
          ['Make it generic and thread-safe.', 'Generic means <code>LRUCache&lt;K, V&gt;</code> with a <code>Node&lt;K, V&gt;</code> and a <code>Map&lt;K, Node&lt;K, V&gt;&gt;</code>; the only requirement is that keys implement equals and hashCode correctly and are effectively immutable. I would also decide on nulls — reject null values or return Optional — so a miss is unambiguous. For thread safety, the key point is that get also mutates the list, so every operation, including get, must hold the lock; a ReadWriteLock does not help. I wrap the core class with a ReentrantLock, locking and unlocking in finally, or simply use synchronized methods — both are correct; ReentrantLock adds tryLock with timeout and fairness. A ConcurrentHashMap alone is not enough, because updating the map and the list is a compound operation that must be atomic, and the list itself is not thread-safe. For higher throughput I could stripe the cache into segments, each with its own lock, accepting approximate LRU, and in production I would use Caffeine.'],
          ['Compare with LinkedHashMap(accessOrder = true) + removeEldestEntry.', 'LinkedHashMap is exactly a HashMap whose entries are also linked in a doubly linked list. With the three-argument constructor and accessOrder set to true, every get or put moves the entry to the end, and if I override removeEldestEntry to return <code>size() &gt; capacity</code>, the eldest entry — the least recently used — is removed after each insert. That gives the same O(1) behaviour in about six lines and is well tested, so I would prefer it in production for a simple single-threaded cache. The trade-offs: it is not thread-safe, so I would wrap it with <code>Collections.synchronizedMap</code> or use Caffeine; it iterates from least to most recently used; calling get while iterating throws ConcurrentModificationException because access reorders entries; and it offers less control, for example over TTL, weights, metrics or eviction callbacks. In an interview I mention it first and then implement the custom version if asked.'],
          ['Code it fully and write a few unit tests.', 'I would code the generic class with a private static Node, the map, dummy head and tail, a constructor that rejects a non-positive capacity, get and put, and three small private helpers — unlink, addFirst and moveToFront — which keep get and put short and reduce pointer bugs. Then a thread-safe wrapper using a ReentrantLock. For tests I cover: get on an empty cache returns null; inserting beyond capacity evicts the least recently used key; get refreshes recency, so a different key is evicted; put on an existing key updates the value, refreshes recency and does not grow the size; capacity one keeps only the latest entry; capacity zero throws IllegalArgumentException; and a concurrent test where several threads put through the thread-safe version and afterwards the size equals the capacity and the list and map agree. With JUnit 5 these are separate @Test methods with a fresh cache in @BeforeEach.'],
        ] },
        { say: [
          ['Aise bolo — 45 sec walkthrough opener', 'Let me confirm the requirements: a fixed-capacity cache with get and put, where both reads and writes count as a use, and when it is full we evict the least recently used entry. Both operations should be O(1), the class should be generic, and it should be safe for multiple threads. My design is a HashMap from key to node plus a doubly linked list with dummy head and tail; the front is most recently used and the back is least recently used. I will write the core class first, then add thread safety with a lock around every operation, compare it with LinkedHashMap in access order, and finish with tests.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          '<code>get</code> me node ko front pe le jaana bhoolna — tab ye FIFO cache ban jaata hai, LRU nahi.',
          'Existing key pe <code>put</code> karte waqt naya node bana dena — purana node list me reh jaata hai, size galat.',
          'Evict karte waqt sirf list se hatana, <b>map se nahi</b> (ya ulta) — memory leak / ghost entries. Isliye node me key rakho.',
          'Singly linked list use karna — beech ka node O(1) me nahi nikal sakta.',
          'Dummy head / tail ke bina likhna — null checks me bugs (empty list, ek node, head/tail update).',
          'Capacity check <code>put</code> existing key pe bhi kar dena — update pe kuch evict nahi hona chahiye.',
          'Thread-safety ke liye sirf <code>ConcurrentHashMap</code> lagana — list unsafe, compound operation atomic nahi.',
          '<code>ReadWriteLock</code> me get ko read lock dena — get list badalta hai, ye write hai.',
          'LinkedHashMap ka <code>accessOrder</code> false (default) chhod dena — insertion order = FIFO.',
          'Mutable keys (key object hash badal jaaye) — map me entry kho jaati hai (c2 equals/hashCode).',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['Capacity 2: <code>put(1), put(2), get(1), put(3), get(2)</code>. Last get kya deta hai?', '<b>null</b> (LeetCode me -1) — get(1) ne 1 ko recent banaya, toh put(3) pe 2 evict hua.'],
          ['Capacity 2: <code>put(1,1), put(2,2), put(1,10), put(3,3)</code>. Cache me kaun?', '<b>1 aur 3</b> (1 = 10) — put(1,10) ne 1 ko refresh kiya, LRU 2 tha.'],
          ['<code>new LinkedHashMap&lt;&gt;(16, 0.75f, true)</code> me <code>put(1), put(2), get(1)</code> ke baad <code>toString()</code>?', '<b>{2=2, 1=1}</b> — access order me recently accessed end pe.'],
          ['Wahi LinkedLRU (capacity 2), <code>put(1), put(2), containsKey(1), put(3)</code>. Kaun evict?', '<b>1</b> — containsKey access nahi ginta, toh 1 hi eldest tha.'],
          ['Thread-safe version me <code>get</code> ko lock ke bina chhod diya (sirf put locked). Problem?', 'get bhi <code>moveToFront</code> karta hai — do threads ek saath list pointers badalenge → corrupted list / lost nodes. <b>Har operation lock</b> me.'],
        ] },
      ] },
    ],
    checks: [
      'HashMap + doubly linked list design (dummy head/tail, node me key kyun) diagram ke saath 2 min me samjha sakta hoon',
      'Generic LRUCache<K,V> get/put + helpers 20 min me bina bug likh sakta hoon',
      'Thread-safety: get bhi write kyun hai, synchronized vs ReentrantLock vs ReadWriteLock, aur ConcurrentHashMap akela kyun kaafi nahi — bol sakta hoon',
      'LinkedHashMap(accessOrder = true) + removeEldestEntry ka code aur trade-offs, aur 5–6 unit test cases bata sakta hoon',
    ],
    memory: 'Map: key → node (O(1) lookup) + doubly list: head.next = MRU, tail.prev = LRU (O(1) move / evict); dummy nodes = no null checks; node me key (evict pe map.remove); get = moveToFront (read bhi write!) → har op lock; CHM akela nahi; LinkedHashMap(16, 0.75f, true) + removeEldestEntry(size() > cap) = 6 lines, LRU → MRU order, not thread-safe.',
    snippets: [
      { code: BASIC, out: BASIC_OUT },
      { code: CONCURRENT, out: CONCURRENT_OUT },
      { code: LHM, out: LHM_OUT },
      { code: TESTS, out: TESTS_OUT },
    ],
  };
})();
