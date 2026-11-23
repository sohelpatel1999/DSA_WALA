// Planner lessons — Java advanced theory (c5 Modern Java 17/21, c6 JVM memory + GC, c7 Multithreading basics)
// Theory format: concept Hinglish me → har planner interview question ka English answer (qa) → code + output → traps → self-test.
// snippets: validate-lessons.js --java inhe compile + run karke output match karta hai.
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});

  // ======================= c5 — code examples =======================
  const RECORD = `record Money(String currency, long paise) {          // header = components → fields + accessors + constructor
    Money {                                               // compact constructor: validation + normalisation
        Objects.requireNonNull(currency, "currency");
        if (paise < 0) throw new IllegalArgumentException("paise must be >= 0");
        currency = currency.toUpperCase();                // parameter badlo → wahi field me jaayega
    }
    static Money inr(long paise) { return new Money("INR", paise); }   // static factory allowed
    Money plus(Money o) { return new Money(currency, paise + o.paise); } // instance method allowed
}

record Team(String name, List<String> members) {
    Team { members = List.copyOf(members); }              // record sirf shallow immutable — List ki copy khud karo
}

public class Main {
    public static void main(String[] args) {
        Money a = new Money("inr", 500);
        Money b = Money.inr(500);
        System.out.println(a);                                             // generated toString
        System.out.println(a.equals(b) + " " + (a.hashCode() == b.hashCode()) + " " + a.paise());
        System.out.println(a.plus(b));
        try {
            new Money("INR", -1);
        } catch (IllegalArgumentException e) {
            System.out.println("rejected: " + e.getMessage());
        }
        List<String> m = new ArrayList<>(List.of("Asha"));
        Team t = new Team("core", m);
        m.add("Ravi");                                                     // caller ki list badli
        System.out.println(t.members());                                   // record pe asar nahi
    }
}`;

  const SEALED = `sealed interface Shape permits Circle, Square, Rect {}   // sirf ye 3 implement kar sakte hain
record Circle(double r) implements Shape {}                      // record implicitly final
record Square(double side) implements Shape {}
record Rect(double w, double h) implements Shape {}

public class Main {
    static double area(Shape s) {
        return switch (s) {                                      // default NAHI — compiler exhaustive check karta hai
            case Circle c -> Math.PI * c.r() * c.r();
            case Square sq -> sq.side() * sq.side();
            case Rect(double w, double h) -> w * h;              // record pattern: seedha components
        };
    }

    public static void main(String[] args) {
        for (Shape s : List.of(new Circle(1), new Square(2), new Rect(2, 3)))
            System.out.println(s + " -> " + Math.round(area(s) * 100) / 100.0);
    }
}`;

  const PATTERNS = `record Point(int x, int y) {}
record Line(Point from, Point to) {}

public class Main {
    static String describe(Object o) {
        return switch (o) {
            case null -> "null aaya";                                   // Java 21: switch me null case
            case Integer i when i > 100 -> "big int " + i;              // guard (when) — specific pehle
            case Integer i -> "int " + i;
            case String s -> "string of length " + s.length();
            case Line(Point(var x1, var y1), Point(int x2, int y2))     // nested record pattern
                -> "line dx=" + (x2 - x1) + " dy=" + (y2 - y1);
            default -> "other " + o.getClass().getSimpleName();
        };
    }

    public static void main(String[] args) {
        Object o = "hello";
        if (o instanceof String s && s.length() > 3)                    // Java 16: test + cast + bind ek saath
            System.out.println("instanceof pattern: " + s.toUpperCase());
        for (Object x : Arrays.asList(7, 500, "java", new Line(new Point(1, 2), new Point(4, 6)), 2.5, null))
            System.out.println(describe(x));
    }
}`;

  const VAR = `public class Main {
    public static void main(String[] args) {
        var names = new ArrayList<String>();                       // type: ArrayList<String> (compile time pe fix)
        names.add("a");
        var byKey = new TreeMap<String, List<Integer>>();          // lamba type ek baar likha
        byKey.computeIfAbsent("k", k -> new ArrayList<>()).add(1);
        for (var e : byKey.entrySet()) System.out.println(e.getKey() + "=" + e.getValue());

        var x = 10;                                                // int
        var big = 10L;                                             // long — literal se type
        var list = new ArrayList<>();                              // PITFALL: diamond + var = ArrayList<Object>
        list.add(1);
        list.add("two");                                           // compile ho gaya — type safety gayi
        System.out.println(names + " " + ((Object) x).getClass().getSimpleName() + " "
            + ((Object) big).getClass().getSimpleName() + " " + list);
        // var y;              // error: initializer chahiye
        // var z = null;       // error: type infer nahi hota
        // var arr = {1, 2};   // error: array initializer ko target type chahiye
        // var f = () -> 1;    // error: lambda ko target type chahiye
    }
}`;

  const SWITCHTB = `enum Day { MON, TUE, WED, THU, FRI, SAT, SUN }

public class Main {
    static int workHours(Day d) {
        return switch (d) {                         // switch expression: value deta hai, no fall-through
            case SAT, SUN -> 0;
            case FRI -> 6;
            default -> {
                int base = 8;
                yield base + (d == Day.MON ? 1 : 0); // block se value bahar: yield
            }
        };
    }

    static String status(int code) {
        return switch (code) {                      // colon style me bhi yield chalta hai
            case 200: yield "OK";
            case 404: yield "Not Found";
            default: yield "Other";
        };
    }

    public static void main(String[] args) {
        for (Day d : List.of(Day.MON, Day.WED, Day.FRI, Day.SUN)) System.out.println(d + " " + workHours(d));
        System.out.println(status(200) + " " + status(404) + " " + status(500));
        String json = """
            {
              "name": "Asha",
              "skills": ["Java", "SQL"]
            }
            """;                                    // closing """ ki position se indentation strip hota hai
        System.out.print(json);
        String sql = """
            SELECT id, name \\
            FROM users WHERE active = true""";      // \\ = line join (newline nahi)
        System.out.println(sql);
    }
}`;

  const JAVA21 = `import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws Exception {
        try (ExecutorService ex = Executors.newVirtualThreadPerTaskExecutor()) {   // Java 21: har task = ek virtual thread
            List<Future<Integer>> fs = new ArrayList<>();
            for (int i = 1; i <= 10_000; i++) {
                int n = i;
                fs.add(ex.submit(() -> { Thread.sleep(10); return n; }));   // blocking call — carrier thread free ho jaata hai
            }
            long sum = 0;
            for (Future<Integer> f : fs) sum += f.get();
            System.out.println("10000 virtual threads, sum = " + sum);
        }
        Thread vt = Thread.ofVirtual().start(() -> {});
        vt.join();
        System.out.println("isVirtual = " + vt.isVirtual());

        List<Integer> list = new ArrayList<>(List.of(1, 2, 3));            // Java 21: SequencedCollection
        System.out.println(list.getFirst() + " " + list.getLast() + " " + list.reversed());
        LinkedHashMap<String, Integer> lhm = new LinkedHashMap<>();        // SequencedMap
        lhm.put("a", 1);
        lhm.put("b", 2);
        System.out.println(lhm.firstEntry() + " " + lhm.lastEntry());
    }
}`;

  // ======================= c6 — code examples =======================
  const MEMAREAS = `class Counter {
    static int instances = 0;            // static field: Class object ke saath HEAP pe (Java 8+); class ka metadata METASPACE me
    int id;                              // instance field: object ke andar, HEAP pe
    Counter() { id = ++instances; }
}

public class Main {
    static int square(int n) {           // naya stack frame: n, r yahin
        int r = n * n;
        return r;                        // return → frame pop, n aur r gaye
    }

    public static void main(String[] args) {
        int local = 5;                   // primitive local: main ke STACK frame me
        Counter c1 = new Counter();      // reference c1: stack; object: heap (Eden)
        Counter c2 = c1;                 // sirf reference copy — same heap object
        Counter c3 = new Counter();
        c2.id = 42;                      // c1 bhi wahi object dekhta hai
        System.out.println(square(local) + " " + c1.id + " " + c3.id + " " + Counter.instances);
        String s1 = "pool", s2 = "pool"; // String pool bhi heap me (Java 7+)
        System.out.println(s1 == s2);
    }
}`;

  const MARKSWEEP = `class Obj {
    final String name;
    final List<Obj> refs = new ArrayList<>();
    Obj(String name) { this.name = name; }
}

public class Main {
    static void mark(Obj o, Set<String> live) {          // GC roots se reachable sab "live"
        if (o == null || !live.add(o.name)) return;
        for (Obj r : o.refs) mark(r, live);
    }

    public static void main(String[] args) {
        Map<String, Obj> heap = new LinkedHashMap<>();
        for (String n : List.of("A", "B", "C", "D", "E")) heap.put(n, new Obj(n));
        heap.get("A").refs.add(heap.get("B"));            // A → B → C
        heap.get("B").refs.add(heap.get("C"));
        heap.get("D").refs.add(heap.get("E"));            // D ⇄ E: cycle, par root se koi raasta nahi
        heap.get("E").refs.add(heap.get("D"));

        List<Obj> roots = List.of(heap.get("A"));         // roots: stack locals, static fields, active threads, JNI refs
        Set<String> live = new TreeSet<>();
        for (Obj r : roots) mark(r, live);                // MARK
        List<String> garbage = new ArrayList<>();
        for (String n : heap.keySet()) if (!live.contains(n)) garbage.add(n);   // SWEEP
        System.out.println("marked live: " + live);
        System.out.println("swept: " + garbage);
    }
}`;

  const LEAK = `class Key {
    int id;                                              // mutable field jo hashCode me use hota hai — khatra
    Key(int id) { this.id = id; }
    @Override public boolean equals(Object o) { return o instanceof Key k && k.id == id; }
    @Override public int hashCode() { return Integer.hashCode(id); }
}

class LruCache<K, V> extends LinkedHashMap<K, V> {      // bounded cache: size limit ke upar eldest hatao
    private final int max;
    LruCache(int max) { super(16, 0.75f, true); this.max = max; }   // true = access order
    @Override protected boolean removeEldestEntry(Map.Entry<K, V> e) { return size() > max; }
}

public class Main {
    static final List<byte[]> CACHE = new ArrayList<>();  // static = GC root → isme jo gaya, kabhi free nahi

    public static void main(String[] args) {
        for (int i = 0; i < 1000; i++) CACHE.add(new byte[1024]);   // add hi add, remove kabhi nahi
        System.out.println("static cache entries: " + CACHE.size());

        Map<Key, String> m = new HashMap<>();
        Key k = new Key(1);
        m.put(k, "session");
        k.id = 2;                                         // put ke baad key badli → entry galat bucket me "kho" gayi
        System.out.println("get(new Key(1)): " + m.get(new Key(1)) + ", get(k): " + m.get(k) + ", size: " + m.size());

        LruCache<Integer, String> lru = new LruCache<>(3);
        for (int i = 1; i <= 5; i++) lru.put(i, "v" + i);
        lru.get(3);                                       // 3 recently used
        lru.put(6, "v6");                                 // limit 3 → least recently used (4) gaya
        System.out.println("bounded LRU: " + lru.keySet());
    }
}`;

  const ERRORS = `public class Main {
    static int depth = 0;
    static void recurse() { depth++; recurse(); }        // base case nahi → har call naya stack frame

    public static void main(String[] args) {
        try {
            recurse();
        } catch (StackOverflowError e) {                 // Error hai, Exception nahi — demo ke liye hi catch
            System.out.println("StackOverflowError caught: no base case");
        }
        System.out.println("depth > 1000: " + (depth > 1000));   // exact depth -Xss aur JIT pe depend — print nahi karte

        try {
            long[] huge = new long[Integer.MAX_VALUE];   // JVM ki array length limit se bada
            System.out.println(huge.length);
        } catch (OutOfMemoryError e) {
            System.out.println("OOM: " + e.getMessage());
        }
        System.out.println("JVM still alive");
    }
}`;

  const LOADERS = `public class Main {
    public static void main(String[] args) throws Exception {
        System.out.println("String loader: " + String.class.getClassLoader());   // null = bootstrap (native, java.base)
        ClassLoader app = Main.class.getClassLoader();                           // classpath wali classes
        System.out.println("Main loader: " + app.getName());
        System.out.println("parent: " + app.getParent().getName());
        System.out.println("grandparent: " + app.getParent().getParent());      // bootstrap = null
        System.out.println("java.sql loader: " + java.sql.Connection.class.getClassLoader().getName());
        System.out.println("platform == parent: " + (ClassLoader.getPlatformClassLoader() == app.getParent()));
        Class<?> viaApp = Class.forName("java.lang.String", false, app);        // app ne parent ko delegate kiya
        System.out.println("delegated to bootstrap: " + (viaApp == String.class));
    }
}`;

  // ======================= c7 — code examples =======================
  const STATES = `public class Main {
    static final Object lock = new Object();
    static boolean ready = false;                          // lock ke andar hi padha / likha jaata hai

    static void waitFor(Thread t, Thread.State s) throws InterruptedException {
        while (t.getState() != s) Thread.sleep(1);         // state aane tak ruko — output deterministic
    }

    public static void main(String[] args) throws Exception {
        Thread t = new Thread(() -> System.out.println("inside run: " + Thread.currentThread().getState()));
        System.out.println("after new: " + t.getState());
        t.start();
        t.join();
        System.out.println("after join: " + t.getState());

        Thread sleeper = new Thread(() -> {
            try { Thread.sleep(10_000); } catch (InterruptedException e) { System.out.println("sleeper interrupted"); }
        });
        sleeper.start();
        waitFor(sleeper, Thread.State.TIMED_WAITING);
        System.out.println("sleeping: " + sleeper.getState());
        sleeper.interrupt();                               // sleep tod do — InterruptedException
        sleeper.join();

        Thread waiter = new Thread(() -> {
            synchronized (lock) {
                try { while (!ready) lock.wait(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            }
        });
        waiter.start();
        waitFor(waiter, Thread.State.WAITING);
        System.out.println("waiting: " + waiter.getState());
        synchronized (lock) { ready = true; lock.notifyAll(); }
        waiter.join();

        Thread blocked;
        synchronized (lock) {                              // main ne lock pakad rakha hai
            blocked = new Thread(() -> { synchronized (lock) { } });
            blocked.start();
            waitFor(blocked, Thread.State.BLOCKED);
            System.out.println("blocked: " + blocked.getState());
        }
        blocked.join();
        System.out.println("finally: " + blocked.getState());
    }
}`;

  const RUNCALL = `import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Runnable r = () -> System.out.println("run() on: " + Thread.currentThread().getName());
        Thread t = new Thread(r, "worker-1");
        t.run();                                          // normal method call — MAIN thread pe chala
        t.start();                                        // naya thread → JVM khud run() call karega
        t.join();
        try {
            t.start();                                    // ek thread do baar start nahi hota
        } catch (IllegalThreadStateException e) {
            System.out.println("start() twice: IllegalThreadStateException");
        }

        ExecutorService pool = Executors.newFixedThreadPool(2);
        Callable<Integer> sumTask = () -> {               // Callable: value return + checked exception allowed
            int s = 0;
            for (int i = 1; i <= 100; i++) s += i;
            return s;
        };
        Future<Integer> f = pool.submit(sumTask);
        System.out.println("Callable result: " + f.get());   // get() result aane tak block

        Callable<Integer> failing = () -> { throw new IllegalStateException("boom"); };
        try {
            pool.submit(failing).get();
        } catch (ExecutionException e) {                  // task ka exception wrap hoke aata hai
            System.out.println("Callable threw: " + e.getCause().getMessage());
        }
        pool.shutdown();
    }
}`;

  const SYNC = `import java.util.concurrent.atomic.*;

class Counter {
    private int count = 0;
    private int blockCount = 0;
    private final Object lock = new Object();             // private lock object — bahar wala isse lock nahi kar sakta

    synchronized void inc() { count++; }                  // poora method, lock = this
    void incBlock() {
        // ... yahan non-critical kaam bina lock ke ...
        synchronized (lock) { blockCount++; }             // sirf critical section locked
    }
    synchronized int get() { return count; }
    int getBlock() { synchronized (lock) { return blockCount; } }

    synchronized String outer() { return "outer > " + inner(); }   // same thread, same lock dobara
    synchronized String inner() { return "inner (reentrant)"; }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Counter c = new Counter();
        AtomicInteger atomic = new AtomicInteger();       // lock-free CAS
        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            Thread t = new Thread(() -> {
                for (int j = 0; j < 10_000; j++) { c.inc(); c.incBlock(); atomic.incrementAndGet(); }
            });
            threads.add(t);
            t.start();
        }
        for (Thread t : threads) t.join();                // sab khatam hone do
        System.out.println("synchronized method: " + c.get());
        System.out.println("synchronized block: " + c.getBlock());
        System.out.println("AtomicInteger: " + atomic.get());
        System.out.println(c.outer());
        synchronized (c) { System.out.println("holdsLock(c) inside block: " + Thread.holdsLock(c)); }
        System.out.println("holdsLock(c) outside: " + Thread.holdsLock(c));
    }
}`;

  const VOLATILE = `public class Main {
    static volatile boolean running = true;               // volatile: har read main memory se, har write turant visible
    static int data = 0;                                   // plain field
    static volatile boolean ready = false;

    public static void main(String[] args) throws Exception {
        Thread worker = new Thread(() -> {
            long spins = 0;
            while (running) spins++;                       // volatile ke bina ye loop kabhi na ruke — possible
            System.out.println("worker saw running=false, stopped");
        });
        worker.start();
        Thread.sleep(50);
        running = false;
        worker.join();

        Thread reader = new Thread(() -> {
            while (!ready) Thread.onSpinWait();            // volatile read
            System.out.println("reader sees data = " + data);   // happens-before: 42 guaranteed
        });
        reader.start();
        data = 42;                                         // 1. plain write
        ready = true;                                      // 2. volatile write — data ko bhi "publish" karta hai
        reader.join();
    }
}`;

  const PRODCONS = `import java.util.concurrent.*;

class BoundedBuffer {
    private final Deque<Integer> q = new ArrayDeque<>();
    private final int cap;
    BoundedBuffer(int cap) { this.cap = cap; }

    synchronized void put(int x) throws InterruptedException {
        while (q.size() == cap) wait();                 // full → lock chhodo aur ruko (while: spurious wakeup)
        q.addLast(x);
        notifyAll();                                     // consumer ko jagao
    }
    synchronized int take() throws InterruptedException {
        while (q.isEmpty()) wait();                      // empty → ruko
        int x = q.removeFirst();
        notifyAll();                                     // producer ko jagao
        return x;
    }
}

public class Main {
    public static void main(String[] args) throws Exception {
        BoundedBuffer buf = new BoundedBuffer(2);
        List<Integer> consumed = new ArrayList<>();      // sirf consumer likhta hai; main join ke baad padhta hai
        Thread producer = new Thread(() -> {
            try { for (int i = 1; i <= 10; i++) buf.put(i); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        Thread consumer = new Thread(() -> {
            try { for (int i = 0; i < 10; i++) consumed.add(buf.take()); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
        System.out.println("wait/notify consumed: " + consumed);

        BlockingQueue<Integer> bq = new ArrayBlockingQueue<>(2);   // production me ye use karo
        int[] sum = {0};
        Thread p2 = new Thread(() -> {
            try { for (int i = 1; i <= 10; i++) bq.put(i); bq.put(-1); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        Thread c2 = new Thread(() -> {
            try { for (int x = bq.take(); x != -1; x = bq.take()) sum[0] += x; } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });                                              // -1 = poison pill → consumer band
        p2.start();
        c2.start();
        p2.join();
        c2.join();
        System.out.println("BlockingQueue sum: " + sum[0]);
    }
}`;

  const DEADLOCK = `import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

class Account {
    final int id;
    int balance;
    final ReentrantLock lock = new ReentrantLock();
    Account(int id, int balance) { this.id = id; this.balance = balance; }
}

public class Main {
    // Fix 1: lock ordering — hamesha chhote id wala lock pehle → circular wait impossible
    static void transferOrdered(Account from, Account to, int amt) {
        Account first = from.id < to.id ? from : to;
        Account second = first == from ? to : from;
        synchronized (first) {
            synchronized (second) {
                from.balance -= amt;
                to.balance += amt;
            }
        }
    }

    // Fix 2: tryLock with timeout — dono na mile toh jo pakda wo chhodo, retry (no hold-and-wait)
    static void transferTry(Account from, Account to, int amt) throws InterruptedException {
        while (true) {
            if (from.lock.tryLock(10, TimeUnit.MILLISECONDS)) {
                try {
                    if (to.lock.tryLock(10, TimeUnit.MILLISECONDS)) {
                        try {
                            from.balance -= amt;
                            to.balance += amt;
                            return;
                        } finally { to.lock.unlock(); }
                    }
                } finally { from.lock.unlock(); }
            }
            Thread.sleep(1);                              // thoda ruk ke retry — livelock kam
        }
    }

    public static void main(String[] args) throws Exception {
        Account a = new Account(1, 1000), b = new Account(2, 1000);
        Thread t1 = new Thread(() -> { for (int i = 0; i < 500; i++) transferOrdered(a, b, 2); });   // A → B
        Thread t2 = new Thread(() -> { for (int i = 0; i < 500; i++) transferOrdered(b, a, 1); });   // B → A (ulti direction)
        t1.start(); t2.start(); t1.join(); t2.join();
        System.out.println("lock ordering: A=" + a.balance + " B=" + b.balance + " total=" + (a.balance + b.balance));

        Account c = new Account(3, 1000), d = new Account(4, 1000);
        Thread t3 = new Thread(() -> { try { for (int i = 0; i < 500; i++) transferTry(c, d, 2); } catch (InterruptedException e) { } });
        Thread t4 = new Thread(() -> { try { for (int i = 0; i < 500; i++) transferTry(d, c, 1); } catch (InterruptedException e) { } });
        t3.start(); t4.start(); t3.join(); t4.join();
        System.out.println("tryLock: C=" + c.balance + " D=" + d.balance + " total=" + (c.balance + d.balance));
    }
}`;

  // =================================================================
  L.c5 = {
    kind: 'th', title: 'Modern Java 17 / 21 features', topic: 'Java',
    goal: 'Records, sealed classes, pattern matching (instanceof, switch, record patterns), <code>var</code>, switch expressions + <code>yield</code>, text blocks aur Java 21 ke virtual threads / sequenced collections — har ek <b>code + output ke saath</b>, aur planner ke <b>6 interview questions</b> ka 30–60 sec English answer.',
    oneLine: 'Modern Java = kam boilerplate + compiler zyada check kare: record data ke liye, sealed + pattern switch closed hierarchy ke liye, virtual threads blocking I/O ke liye.',
    parts: [
      { title: '🧾 Concept — record: kya generate hota hai, validation kaise', blocks: [
        { p: '<b>record</b> (Java 16 final) = data carrier class ek line me. <code>record Money(String currency, long paise)</code> likha toh compiler ye sab bana deta hai — c2 me jo equals/hashCode haath se likha tha, wo yahan free:' },
        { table: { head: ['Generate hota hai', 'Detail'], rows: [
          ['<b>private final fields</b>', 'Har component ka ek — <code>currency</code>, <code>paise</code>'],
          ['<b>Canonical constructor</b>', 'Saare components, same order'],
          ['<b>Accessors</b>', '<code>paise()</code> — <code>getPaise()</code> nahi'],
          ['<b>equals / hashCode</b>', 'Saare components se (c2 ka contract automatically sahi)'],
          ['<b>toString</b>', '<code>Money[currency=INR, paise=500]</code>'],
        ] } },
        { code: RECORD },
        { pre: `Output:
Money[currency=INR, paise=500]
true true 500
Money[currency=INR, paise=1000]
rejected: paise must be >= 0
[Asha]` },
        { list: [
          '<b>Validation</b>: <b>compact constructor</b> <code>Money { ... }</code> — parameters list nahi likhte, fields ka assignment end me automatically hota hai. Yahan check karo, throw karo, ya parameter normalise karo (<code>currency = currency.toUpperCase()</code>).',
          'Record <b>implicitly final</b> hai, <code>java.lang.Record</code> extend karta hai → kisi aur class ko extend nahi kar sakta. Interfaces implement kar sakta hai.',
          'Allowed: static fields / methods, instance methods, nested types, extra constructors (jo canonical ko <code>this(...)</code> call karein). <b>Not allowed</b>: extra instance fields.',
          'Record <b>shallow immutable</b> hai — List component ki <code>List.copyOf</code> khud karo (c2 ka defensive copy rule).',
          'Use: DTOs, API request / response, map keys, value objects, stream ke intermediate results. JPA entity ke liye nahi (entity ko no-arg constructor + mutable fields chahiye).',
        ] },
      ] },
      { title: '🔒 Sealed classes + pattern-matching switch', blocks: [
        { p: '<b>sealed</b> (Java 17) = "sirf ye classes mujhe extend / implement kar sakti hain". <code>permits</code> me list. Har permitted subclass ko batana padta hai: <code>final</code>, <code>sealed</code> ya <code>non-sealed</code> (record already final hai). Fayda: hierarchy <b>closed</b> hai, toh compiler jaanta hai saare cases kaun se hain.' },
        { table: { head: ['', 'Normal interface + instanceof chain', 'sealed + pattern switch'], rows: [
          ['Naya subtype add kiya', 'Code chupchaap default / else me gir jaata hai — bug runtime pe', '<b>Compile error</b> har switch pe jo use handle nahi karta'],
          ['default branch', 'Chahiye', 'Nahi chahiye (exhaustive) — aur nahi likhna hi better'],
          ['Cast', 'Haath se', 'Pattern variable / record pattern se automatic'],
        ] } },
        { code: SEALED },
        { pre: `Output:
Circle[r=1.0] -> 3.14
Square[side=2.0] -> 4.0
Rect[w=2.0, h=3.0] -> 6.0` },
        { tip: 'Ye "algebraic data type" style hai: <code>PaymentResult = Success | Failed | Pending</code> jaise results ko sealed interface + records se model karo, aur switch me handle karo. Kal koi <code>Refunded</code> add kare toh compiler har jagah bata dega. Permitted subclasses same module me (unnamed module me same package me) honi chahiye; same file me ho toh <code>permits</code> chhod bhi sakte ho.' },
      ] },
      { title: '🎯 Pattern matching — instanceof, switch, record patterns', blocks: [
        { table: { head: ['Feature', 'Version', 'Kya karta hai'], rows: [
          ['<code>instanceof</code> pattern', '16', '<code>if (o instanceof String s)</code> — test + cast + variable ek saath. <code>&amp;&amp; s.length() &gt; 3</code> me bhi s usable'],
          ['Pattern switch', '21', '<code>case Integer i -&gt;</code> type pe switch; <code>when</code> guard; <code>case null</code>'],
          ['Record patterns', '21', '<code>case Rect(double w, double h)</code> — record ko todo, nested bhi; <code>var</code> bhi chalta hai'],
          ['Unnamed <code>_</code>', '22', '<code>case Rect(var w, _)</code> — jo component nahi chahiye'],
        ] } },
        { code: PATTERNS },
        { pre: `Output:
instanceof pattern: HELLO
int 7
big int 500
string of length 4
line dx=3 dy=4
other Double
null aaya` },
        { list: [
          '<b>Dominance</b>: specific case pehle — <code>case Integer i when i &gt; 100</code> ko <code>case Integer i</code> ke baad likhoge toh compile error ("dominated").',
          'Pattern switch <b>exhaustive</b> hona chahiye: Object pe <code>default</code> chahiye; sealed type pe saare subtypes kaafi.',
          'Purana switch null pe NPE deta tha; ab <code>case null</code> explicitly handle kar sakte ho (na likho toh ab bhi NPE).',
        ] },
      ] },
      { title: '🔤 var — kahan allowed, kya pitfalls', blocks: [
        { p: '<code>var</code> (Java 10) = <b>local variable type inference</b>. Type compile time pe initializer se fix ho jaata hai — ye dynamic typing <b>nahi</b> hai, baad me alag type assign nahi kar sakte. <code>var</code> keyword nahi, "reserved type name" hai (isliye <code>var</code> naam ka variable purane code me chal jaata hai).' },
        { table: { head: ['✅ Allowed', '❌ Not allowed'], rows: [
          ['Local variable with initializer', 'Fields (instance / static)'],
          ['for-each aur classic for loop variable', 'Method parameters, return type'],
          ['try-with-resources variable', 'Bina initializer, ya <code>= null</code>'],
          ['Lambda parameters (Java 11) — annotations ke liye: <code>(@NonNull var x) -&gt; ...</code>', 'Array initializer <code>{1, 2}</code>, lambda / method ref bina target type'],
          ['', '<code>var a = 1, b = 2;</code> (compound declaration)'],
        ] } },
        { code: VAR },
        { pre: `Output:
k=[1]
[a] Integer Long [1, two]` },
        { list: [
          '<b>Diamond + var</b> = <code>ArrayList&lt;Object&gt;</code> — type safety gayi. <code>new ArrayList&lt;String&gt;()</code> likho.',
          '<b>Readability</b>: <code>var result = service.process(x);</code> — reader ko type pata nahi. Rule: jab right side se type obvious ho (<code>new</code>, literal, factory) tab var.',
          'Literal surprises: <code>var x = 10</code> int hai (long nahi), <code>var c = \'a\'</code> char, <code>var d = 1.0f</code> float.',
          'Interface pe program karna chhoot jaata hai: <code>var list = new ArrayList&lt;String&gt;()</code> ka type <code>ArrayList</code> hai, <code>List</code> nahi.',
        ] },
      ] },
      { title: '🔀 Switch expressions + yield; text blocks', blocks: [
        { table: { head: ['', 'Purana switch statement', 'Switch expression (Java 14)'], rows: [
          ['Value return', 'Nahi — variable me assign karo', 'Haan — <code>int h = switch (d) { ... };</code>'],
          ['Fall-through', 'Haan — <code>break</code> bhoole toh bug', '<code>-&gt;</code> me fall-through nahi'],
          ['Multiple labels', '<code>case A: case B:</code>', '<code>case SAT, SUN -&gt;</code>'],
          ['Exhaustive', 'Nahi', 'Haan — enum ke saare constants ya default, warna compile error'],
          ['Block se value', '—', '<code>yield value;</code>'],
        ] } },
        { code: SWITCHTB },
        { pre: `Output:
MON 9
WED 8
FRI 6
SUN 0
OK Not Found Other
{
  "name": "Asha",
  "skills": ["Java", "SQL"]
}
SELECT id, name FROM users WHERE active = true` },
        { list: [
          '<b>yield</b>: arrow case me <code>{ }</code> block likha toh value <code>yield</code> se nikalti hai (<code>return</code> method se bahar nikal jaata — galat). Colon style switch expression me bhi yield.',
          '<b>Text block</b> (Java 15): <code>"""</code> ke baad <b>newline zaroori</b>. Common indentation strip hota hai (closing <code>"""</code> ki position bhi count hoti hai). Quotes escape nahi karne padte — JSON, SQL, HTML ke liye perfect.',
          'Text block escapes: <code>\\</code> line end pe = newline nahi (line join), <code>\\s</code> = ek space (trailing spaces strip hote hain, unhe bachane ke liye). <code>formatted(...)</code> se values bharo.',
        ] },
      ] },
      { title: '🚀 Java 21 / 25 me kya milta hai — virtual threads + sequenced collections', blocks: [
        { table: { head: ['Version', 'LTS?', 'Main features (interview me ye bolo)'], rows: [
          ['8', 'LTS', 'Lambdas, streams, Optional, java.time (c4)'],
          ['11', 'LTS', '<code>var</code> in lambda, <code>HttpClient</code>, <code>String.isBlank/strip/lines</code>, single-file <code>java Main.java</code>'],
          ['17', 'LTS', 'Records, sealed, instanceof pattern, switch expressions, text blocks, helpful NPE messages'],
          ['21', 'LTS', '<b>Virtual threads</b>, pattern switch, record patterns, <b>sequenced collections</b>, <b>generational ZGC</b>'],
          ['25', 'LTS (Sep 2025)', 'Scoped values, flexible constructor bodies (code before <code>super()</code>), compact source files / instance <code>main</code>, module imports, compact object headers (option), AOT startup improvements; 24 se: virtual threads <code>synchronized</code> pe pin nahi hote, stream gatherers'],
        ] } },
        { code: JAVA21 },
        { pre: `Output:
10000 virtual threads, sum = 50005000
isVirtual = true
1 3 [3, 2, 1]
a=1 b=2` },
        { list: [
          '<b>Virtual thread</b> = JVM ka halka thread (KBs, OS thread nahi). Blocking call (DB, HTTP, sleep) pe wo apne <b>carrier</b> (platform) thread se utar jaata hai → lakhon concurrent requests, simple blocking code ke saath. Spring Boot 3.2+: <code>spring.threads.virtual.enabled=true</code>.',
          'Virtual threads CPU-heavy kaam fast nahi karte — sirf I/O-bound concurrency ke liye. Pool mat banao (har task naya thread), aur ThreadLocal me bhari cheezein mat rakho. (Threads ka base c7 me.)',
          '<b>Sequenced collections</b>: <code>getFirst()</code>, <code>getLast()</code>, <code>reversed()</code> List, Deque, LinkedHashSet / Map pe ek jaisi API.',
          'Free wins bina code badle: naya JIT / GC improvements, generational ZGC (c6), kam memory, security patches — LTS pe rehna support ke liye bhi zaroori.',
        ] },
      ] },
      { title: '🎤 Interview — planner ke 6 questions (English answers)', blocks: [
        { tip: 'Q6 ka answer <b>apne project ke asli Java version</b> se do (pom.xml / build.gradle me <code>java.version</code> / <code>release</code> dekh lo). Neeche "Java 17" sirf template hai. Records / sealed ke examples bhi apne project ke DTO / result types se badal lo.' },
        { qa: [
          ['What does a record generate? Can a record validate its fields?', 'A record is a transparent, shallowly immutable data carrier. From the header, the compiler generates a private final field for each component, a canonical constructor, accessor methods named after the components, and equals, hashCode and toString based on all components. The record is implicitly final, extends java.lang.Record, and cannot declare extra instance fields, but it can implement interfaces and have static members and instance methods. Yes, it can validate: I write a compact constructor, which has no parameter list, and inside it I check arguments, throw IllegalArgumentException, or normalise values, and the fields are assigned automatically at the end. For a List component I also do <code>List.copyOf</code> there, because record immutability is only shallow.'],
          ['Sealed classes and how they pair with pattern-matching switch.', 'A sealed class or interface restricts which classes can extend it, using a permits clause, and each permitted subclass must be final, sealed or non-sealed. That makes the hierarchy closed and known to the compiler. With a pattern-matching switch over a sealed type, the compiler can check exhaustiveness, so I do not need a default branch. If someone later adds a new subtype, every switch that does not handle it fails to compile instead of silently falling into a default at runtime. I use it with records to model results, for example a sealed PaymentResult with Success, Failed and Pending records, and handle them with record patterns in a switch.'],
          ['Pattern matching for instanceof and switch; record patterns.', 'Pattern matching for instanceof, final in Java 16, combines the type test, the cast and a binding variable: <code>if (o instanceof String s &amp;&amp; s.length() &gt; 3)</code>. Java 21 brought patterns to switch: cases can match on type, add a guard with <code>when</code>, and handle <code>case null</code>; more specific cases must come before more general ones, and the switch must be exhaustive. Record patterns, also Java 21, deconstruct a record directly in the case, like <code>case Rect(double w, double h)</code>, and they can be nested, for example a Line made of two Points. Together they replace long instanceof-and-cast chains and visitor boilerplate with readable, compiler-checked code.'],
          ['var: where is it allowed and what are the pitfalls?', 'var, from Java 10, is local variable type inference: the type is fixed at compile time from the initializer, so Java stays statically typed. It is allowed for local variables with an initializer, loop variables, try-with-resources variables, and since Java 11 lambda parameters. It is not allowed for fields, method parameters, return types, variables without an initializer or initialised to null, array initializers, or lambdas without a target type. Pitfalls: combining var with the diamond gives <code>ArrayList&lt;Object&gt;</code>; it can hide the type when the right-hand side is a method call, hurting readability; literals infer primitive types like int instead of long; and the variable gets the concrete type, not the interface. I use it when the type is obvious from the right-hand side.'],
          ['Switch expressions with yield; text blocks.', 'Switch expressions, final in Java 14, return a value, so I can write <code>int hours = switch (day) { ... };</code>. The arrow form has no fall-through, allows multiple labels like <code>case SAT, SUN</code>, and the compiler requires the switch to be exhaustive. When a case needs several statements, I use a block and return the value with <code>yield</code>, not return, which would exit the method. Text blocks, final in Java 15, are multi-line string literals in triple quotes; the incidental indentation is stripped based on the least-indented line and the closing delimiter, and quotes do not need escaping, so they are ideal for JSON, SQL and test fixtures. A backslash at the end of a line joins lines, and <code>\\s</code> keeps a trailing space.'],
          ['Which Java version does your project use, and what would you gain moving to 21 or 25?', 'Our main service runs on Java 17, which is an LTS release, so we already use records for DTOs, text blocks for SQL in tests, and switch expressions. Moving to Java 21, the next LTS, the biggest gain is virtual threads: our request handling is mostly blocking I/O to the database and other services, so with virtual threads, for example by enabling them in Spring Boot 3.2 or later, we could handle much higher concurrency without reactive code. We would also get pattern matching for switch and record patterns, sequenced collections, and generational ZGC for low-latency services, plus free JIT and GC improvements. Java 25, the latest LTS, adds scoped values, flexible constructor bodies, compact object headers and the Java 24 fix that stops virtual threads from pinning on synchronized blocks. The migration plan would be to upgrade build plugins and libraries, run the test suite and a load test, and roll out gradually.'],
        ] },
        { say: [
          ['Aise bolo — modern Java apne project se (45 sec)', 'We are on Java 17, and modern features changed how we write code. Our DTOs are records, so equals, hashCode and toString are generated, and validation sits in the compact constructor. For results that can only be success, failure or pending, we use a sealed interface with records and a switch with record patterns, so if someone adds a new case, the compiler points to every place that must handle it. Upgrading to Java 21 would mainly give us virtual threads, which suit our blocking database and HTTP calls, and generational ZGC for lower pause times.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          'Record accessor ko <code>getPaise()</code> bolna — wo <code>paise()</code> hai.',
          '"Record fully immutable hai" — shallow hai; List / Date component ki copy khud karo.',
          'Record ko JPA entity banana — no-arg constructor aur setters nahi hain.',
          'Sealed type pe pattern switch me <code>default</code> likh dena — exhaustiveness check ka fayda khatam.',
          'Pattern switch me general case pehle, specific (<code>when</code>) baad me — compile error (dominated).',
          '<code>var list = new ArrayList&lt;&gt;()</code> → <code>ArrayList&lt;Object&gt;</code>.',
          'Switch expression block me <code>return</code> likhna — <code>yield</code> chahiye.',
          'Virtual threads ko CPU-heavy kaam ke liye ya pool me daal ke use karna.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['<code>record P(int x) {}</code>; <code>new P(1).equals(new P(1))</code> aur <code>new P(1) == new P(1)</code>?', '<b>true</b> aur <b>false</b> — equals components se generate hota hai, <code>==</code> ab bhi reference compare.'],
          ['<code>record P(int x) { P { if (x &lt; 0) x = 0; } }</code> — <code>new P(-5).x()</code>?', '<b>0</b> — compact constructor me parameter badla, wahi field me assign hua.'],
          ['<code>var a = 5; a = "five";</code> compile hoga?', '<b>Nahi</b> — a ka type int fix ho chuka; var dynamic typing nahi hai.'],
          ['<code>switch (o) { case Object x -&gt; "obj"; case String s -&gt; "str"; }</code>?', '<b>Compile error</b> — <code>case String</code> pehle wale <code>Object</code> case se dominated hai.'],
          ['<code>sealed interface S permits A, B</code>; switch me sirf <code>case A a</code> likha, default nahi. Kya hoga?', '<b>Compile error</b> — switch exhaustive nahi (B handle nahi hua).'],
        ] },
      ] },
    ],
    checks: [
      'Record kya-kya generate karta hai aur compact constructor me validation likh sakta hoon',
      'Sealed + pattern switch ka "naya subtype → compile error" fayda samjha sakta hoon',
      'var ke allowed / not allowed jagah aur 3 pitfalls bol sakta hoon',
      'Apne project ka Java version aur 21 / 25 pe jaane ke gains 45 sec me bol sakta hoon',
    ],
    memory: 'record = fields + constructor + accessors + equals/hashCode/toString, validation compact constructor me; sealed + pattern switch = exhaustive, no default; var = compile-time inference, sirf locals; switch block me yield; 21 = virtual threads + pattern switch + generational ZGC.',
    snippets: [
      { code: RECORD, out: 'Money[currency=INR, paise=500]\ntrue true 500\nMoney[currency=INR, paise=1000]\nrejected: paise must be >= 0\n[Asha]' },
      { code: SEALED, out: 'Circle[r=1.0] -> 3.14\nSquare[side=2.0] -> 4.0\nRect[w=2.0, h=3.0] -> 6.0' },
      { code: PATTERNS, out: 'instanceof pattern: HELLO\nint 7\nbig int 500\nstring of length 4\nline dx=3 dy=4\nother Double\nnull aaya' },
      { code: VAR, out: 'k=[1]\n[a] Integer Long [1, two]' },
      { code: SWITCHTB, out: 'MON 9\nWED 8\nFRI 6\nSUN 0\nOK Not Found Other\n{\n  "name": "Asha",\n  "skills": ["Java", "SQL"]\n}\nSELECT id, name FROM users WHERE active = true' },
      { code: JAVA21, out: '10000 virtual threads, sum = 50005000\nisVirtual = true\n1 3 [3, 2, 1]\na=1 b=2' },
    ],
  };

  // =================================================================
  L.c6 = {
    kind: 'th', title: 'JVM memory and garbage collection', topic: 'Java',
    goal: 'JVM memory areas (heap young/old, stack, metaspace), GC kaise kaam karta hai (roots, mark-sweep-compact, minor vs full GC), G1 vs ZGC, memory leaks + debugging tools, OOM types + StackOverflowError aur class loaders — <b>code + output ke saath</b>, aur planner ke <b>6 interview questions</b> ka English answer.',
    oneLine: 'Objects heap pe, method calls stack pe, class metadata metaspace me; GC roots se jo reachable nahi wo garbage; zyada-tar objects young me hi mar jaate hain.',
    parts: [
      { title: '🧠 Concept — JVM memory areas: kya kahan rehta hai', blocks: [
        { p: 'c1 ke pass-by-value wale Dog example me humne dekha tha: <b>reference stack pe, object heap pe</b>. Ab poora map dekho:' },
        { table: { head: ['Area', 'Kiska', 'Kya rehta hai', 'Error jab bhar jaaye'], rows: [
          ['<b>Heap — Young gen</b> (Eden + Survivor S0/S1)', 'Sab threads ka shared', 'Naye objects (Eden me banenge), thoda jiye toh survivor', 'OOM: Java heap space'],
          ['<b>Heap — Old gen</b>', 'Shared', 'Lambe jeene wale objects (caches, singletons, sessions) — promote hoke aate hain', 'OOM: Java heap space'],
          ['<b>Stack</b>', 'Har thread ka apna', 'Har method call ka frame: local primitives, object <b>references</b>, partial results, return address', 'StackOverflowError'],
          ['<b>Metaspace</b> (Java 8+, PermGen ki jagah)', 'Shared, <b>native</b> memory', 'Class metadata: class structure, method bytecode, constant pool', 'OOM: Metaspace'],
          ['PC register / native method stack', 'Har thread', 'Current instruction; JNI calls', '—'],
          ['Code cache', 'Shared, native', 'JIT compiled native code', 'JIT band ho jaata hai (warning)'],
        ] } },
        { code: MEMAREAS },
        { pre: `Output:
25 42 2 2
true` },
        { pre: `STACK (main thread)              HEAP (shared)
 square: n=5, r=25  (return → pop)  Young / Eden:
 main:   local = 5                    Counter{id=42}  ◄── c1, c2
         c1, c2 ─────────────────►    Counter{id=2}   ◄── c3
         c3 ─────────────────────►    "pool"          ◄── s1, s2  (String pool)
         s1, s2 ─────────────────►    Counter.instances = 2 (static, Class object ke saath)
                                    Old: lambe jeene wale objects (promote hoke)
METASPACE (native): Counter.class, Main.class ka metadata + bytecode` },
        { tip: '<b>Static variables</b> Java 8 se heap pe hain (Class object ke saath), metaspace me nahi — metaspace me sirf class ka <i>metadata</i>. String pool Java 7 se heap pe. Metaspace default unlimited hai (native memory) — <code>-XX:MaxMetaspaceSize</code> se limit lagao. Heap: <code>-Xms</code> / <code>-Xmx</code>, stack per thread: <code>-Xss</code>.' },
      ] },
      { title: '♻️ GC kaise kaam karta hai — roots, mark-sweep-compact, minor vs full', blocks: [
        { p: 'GC ka sawaal: "kaunse objects ab kisi kaam ke nahi?" Jawab: jo <b>GC roots</b> se reachable nahi. Roots = thread stacks ke local variables, static fields, active threads, JNI references, synchronized ke monitors. Java reference counting <b>nahi</b> karta — isliye cycle (D ⇄ E) bhi collect ho jaati hai. Neeche ek chhota mark-sweep simulator:' },
        { code: MARKSWEEP },
        { pre: `Output:
marked live: [A, B, C]
swept: [D, E]` },
        { olist: [
          '<b>Mark</b>: roots se graph traverse, reachable objects mark.',
          '<b>Sweep</b>: unmarked objects ki memory free.',
          '<b>Compact / copy</b>: bache hue objects ek saath shift → fragmentation khatam, nayi allocation sirf pointer bump (fast).',
        ] },
        { p: '<b>Generational hypothesis</b>: zyada-tar objects <b>jaldi mar jaate hain</b> (request ke DTOs, temp strings). Isliye heap do hisson me:' },
        { table: { head: ['', 'Minor GC (young)', 'Major / Full GC'], rows: [
          ['Kab', 'Eden bhar gaya', 'Old gen bhar gaya / promotion fail / metaspace / <code>System.gc()</code>'],
          ['Kya', 'Eden + ek survivor ke live objects doosre survivor me copy; age++; age threshold (max 15) paar → old gen me <b>promote</b>', 'Major: old gen collect. Full: poora heap (young + old, + metaspace class unloading)'],
          ['Speed', 'Fast — sirf live objects copy (wo kam hote hain)', 'Slow — bada area; purane collectors me lamba stop-the-world'],
          ['Frequency', 'Bahut baar', 'Kam — baar-baar ho raha hai = problem (leak / heap chhota)'],
        ] } },
        { tip: '<b>Stop-the-world (STW)</b>: GC ke kuch phases me application threads ruk jaate hain — yahi latency spike hai. Modern GCs (G1, ZGC) zyada kaam app ke saath <b>concurrently</b> karte hain. <code>System.gc()</code> sirf request hai, guarantee nahi — code me mat likho.' },
      ] },
      { title: '⚖️ G1 vs ZGC — trade-offs aur kaise choose karein', blocks: [
        { table: { head: ['', 'G1 (default Java 9+)', 'ZGC (production 15, generational 21)'], rows: [
          ['Design', 'Heap ko equal <b>regions</b> me baanta (Eden / Survivor / Old / Humongous); jin regions me sabse zyada garbage, unhe pehle collect ("Garbage First")', 'Almost sab kaam concurrent — colored pointers + load barriers se objects app chalte-chalte move hote hain'],
          ['Pause', 'Target <code>-XX:MaxGCPauseMillis=200</code> (default), typically tens–hundreds ms', '<b>Sub-millisecond</b>, heap size se independent'],
          ['Throughput', 'Achha balance', 'Thoda kam (barriers ka CPU cost), thodi zyada memory chahiye'],
          ['Heap size', 'Chhota se bada, sab theek', 'Bade heaps (GBs – TBs) me sabse zyada chamakta hai'],
          ['Kab', 'General purpose services, batch, default', 'Latency-sensitive: trading, real-time APIs, bade in-memory caches, strict p99 SLA'],
        ] } },
        { pre: `JVM flags (command line):
-XX:+UseG1GC  -XX:MaxGCPauseMillis=200      # G1 (Java 9+ me default hi hai)
-XX:+UseZGC                                  # Java 23+ me generational by default
-XX:+UseZGC -XX:+ZGenerational               # sirf Java 21-22 me generational ON karne ke liye
-Xms4g -Xmx4g                                # heap fix — resize ka overhead nahi
-Xlog:gc*:file=gc.log                        # GC log — tuning se pehle data
Aur: Parallel GC (throughput, batch jobs), Serial GC (chhoti heap / single core), Shenandoah (low pause, ZGC jaisa)` },
        { list: [
          '<b>Choose kaise</b>: default G1 se shuru karo. Pehle <b>measure</b> karo (GC logs, p99 latency, JFR). Agar GC pauses SLA tod rahe hain aur heap bada hai → ZGC try karo. Throughput hi sab kuch hai (batch) → Parallel GC bhi option.',
          'GC tuning se pehle: kya allocation rate kam ho sakta hai? Leak toh nahi? Heap size sahi hai? Aksar fix code me hota hai, flags me nahi.',
          'Java 21 se generational ZGC (JEP 439) — young / old ko alag collect karke throughput better; 23 me default, 24 me non-generational mode hata diya.',
        ] },
      ] },
      { title: '🕳️ Memory leaks — common causes + kaise debug karein', blocks: [
        { p: 'Java me leak = object <b>reachable</b> hai (koi reference pakde baitha hai) par app ko <b>kabhi zaroorat nahi</b>. GC use free nahi kar sakta. Symptom: har full GC ke baad bhi used heap ka "floor" badhta jaata hai → aakhir me OOM.' },
        { code: LEAK },
        { pre: `Output:
static cache entries: 1000
get(new Key(1)): null, get(k): null, size: 1
bounded LRU: [5, 3, 6]` },
        { table: { head: ['Common cause', 'Fix'], rows: [
          ['Static collections / unbounded cache jo sirf badhti hai', 'Bounded cache (LRU, Caffeine with size / TTL), ya WeakHashMap jahan sahi ho'],
          ['Mutable HashMap key (c3 wala) — entry unreachable par map me', 'Keys immutable (String, record)'],
          ['ThreadLocal thread pool me — <code>remove()</code> nahi kiya', '<code>try { ... } finally { tl.remove(); }</code>'],
          ['Listeners / callbacks register kiye, unregister nahi', 'Unregister / weak listeners'],
          ['Unclosed resources (streams, connections, ResultSet)', 'try-with-resources (c2)'],
          ['Inner (non-static) class / lambda outer object pakde rakhe', 'Static nested class'],
          ['ClassLoader leak (app redeploy pe purani classes metaspace me)', 'Threads / drivers / ThreadLocals cleanup on shutdown'],
        ] } },
        { olist: [
          '<b>Confirm</b>: monitoring me heap after-GC trend, GC logs (<code>-Xlog:gc*</code>), full GCs badh rahe hain?',
          '<b>Heap dump lo</b>: <code>jcmd &lt;pid&gt; GC.heap_dump heap.hprof</code> ya <code>jmap -dump:live,format=b,file=heap.hprof &lt;pid&gt;</code>; production me pehle se <code>-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=...</code>.',
          '<b>Analyse</b>: Eclipse MAT / VisualVM — "dominator tree" me sabse bade retained size wale objects, phir "path to GC roots" se kaun pakde baitha hai.',
          '<b>JFR</b> (Java Flight Recorder): <code>jcmd &lt;pid&gt; JFR.start duration=60s filename=rec.jfr</code> — low overhead, production safe; allocation hotspots, "Old Object Sample" leak candidates; JDK Mission Control me kholo.',
          '<b>VisualVM</b>: live heap graph, sampler, heap dump — local / staging pe quick look.',
          'Do heap dumps (time gap ke saath) compare karo — jo class count badhta ja raha hai wahi suspect.',
        ] },
      ] },
      { title: '💥 OutOfMemoryError ke types + StackOverflowError', blocks: [
        { table: { head: ['Error message', 'Matlab', 'Pehla step'], rows: [
          ['<code>Java heap space</code>', 'Heap me jagah nahi — leak ya genuinely heap chhota', 'Heap dump analyse; leak nahi toh <code>-Xmx</code> badhao'],
          ['<code>GC overhead limit exceeded</code>', 'JVM ~98% time GC me, ~2% se kam heap free ho raha (Parallel GC ka check)', 'Leak jaisa hi — heap dump'],
          ['<code>Metaspace</code>', 'Bahut saari classes — dynamic proxies / bytecode generation, classloader leak on redeploy', 'Class count dekho, <code>MaxMetaspaceSize</code>'],
          ['<code>Requested array size exceeds VM limit</code>', 'Array length JVM ki limit (~<code>Integer.MAX_VALUE</code>) se badi', 'Logic bug — size calculation'],
          ['<code>unable to create native thread</code>', 'OS ne naya thread nahi diya (ulimit / native memory)', 'Thread leak? Pool use karo; virtual threads'],
          ['<code>Direct buffer memory</code>', 'NIO direct buffers (off-heap) khatam — Netty etc.', '<code>-XX:MaxDirectMemorySize</code>, buffer release'],
        ] } },
        { code: ERRORS },
        { pre: `Output:
StackOverflowError caught: no base case
depth > 1000: true
OOM: Requested array size exceeds VM limit
JVM still alive` },
        { list: [
          '<b>StackOverflowError</b>: ek thread ka stack khatam — almost hamesha <b>infinite / bahut gehri recursion</b> (base case missing; ya <code>toString</code> / <code>equals</code> / JPA bidirectional relation jo ek doosre ko call karte rahein). Fix: base case, iterative solution (DSA ki recursion → loop + explicit stack), ya last resort <code>-Xss</code> badhao.',
          'Dono <code>Error</code> hain, <code>Exception</code> nahi — normally catch nahi karte. OOM ke baad JVM ki state bharosemand nahi; production me <code>-XX:+ExitOnOutOfMemoryError</code> + restart + heap dump better.',
        ] },
      ] },
      { title: '📚 Class loaders — bootstrap, platform, application; parent delegation', blocks: [
        { table: { head: ['Loader', 'Kya load karta hai', '<code>getClassLoader()</code>'], rows: [
          ['<b>Bootstrap</b>', 'Core JDK — <code>java.base</code> (<code>java.lang</code>, <code>java.util</code>...). Native code me', '<code>null</code>'],
          ['<b>Platform</b> (Java 9+, pehle "Extension")', 'Baaki JDK modules — <code>java.sql</code>, <code>java.xml.crypto</code>...', '<code>platform</code>'],
          ['<b>Application / System</b>', 'Tumhara classpath / module path — app + libraries (jars)', '<code>app</code>'],
          ['Custom', 'Tomcat per-webapp loader, plugins, hot reload', 'Apna naam'],
        ] } },
        { code: LOADERS },
        { pre: `Output:
String loader: null
Main loader: app
parent: platform
grandparent: null
java.sql loader: platform
platform == parent: true
delegated to bootstrap: true` },
        { p: '<b>Parent delegation</b>: class load karni ho toh loader pehle <b>parent se poochta hai</b> (app → platform → bootstrap). Parent ko nahi mili tabhi khud dhoondhta hai. Teen fayde: (1) <b>security</b> — koi apni jar me nakli <code>java.lang.String</code> daal ke core class replace nahi kar sakta; (2) <b>no duplicates</b> — core class ek hi baar load; (3) consistency.' },
        { list: [
          'Class ki identity = <b>naam + loader</b>. Same class do alag loaders se → JVM ke liye alag types → <code>ClassCastException: X cannot be cast to X</code> (app servers me classic).',
          'Loading ke steps: <b>Loading</b> → <b>Linking</b> (verify, prepare — static fields default values, resolve) → <b>Initialization</b> (static blocks / static field initializers, first active use pe).',
          'Delegation todne wale: Tomcat webapp loader (child-first, taaki har app apni library version use kare), SPI / JDBC ke liye thread context class loader.',
        ] },
      ] },
      { title: '🎤 Interview — planner ke 6 questions (English answers)', blocks: [
        { tip: 'Leak / GC wale answers me <b>apne project ki asli incident</b> (ya staging me dekha issue) daalo — "cache bina limit ke", "ThreadLocal not removed" jaisa. Neeche ke examples sirf template hain.' },
        { qa: [
          ['JVM memory areas: heap (young/old), stack, metaspace. What lives where?', 'The heap is shared by all threads and holds all objects and arrays, including the String pool and static fields since Java 8. It is split into the young generation, made of Eden and two survivor spaces where new objects are allocated, and the old generation for objects that survived several collections, like caches and singletons. Each thread has its own stack, with one frame per method call holding local primitives, object references and return information — so a local reference lives on the stack while the object it points to lives on the heap. Metaspace, which replaced PermGen in Java 8, lives in native memory and stores class metadata such as method bytecode and the runtime constant pool. There are also the code cache for JIT-compiled code and per-thread PC registers.'],
          ['How does GC work? Minor vs major/full GC.', 'The garbage collector finds objects that are no longer reachable from GC roots — thread stacks, static fields, active threads and JNI references — so unreachable cycles are collected too. The classic steps are mark the reachable objects, sweep the rest, and compact or copy survivors to avoid fragmentation. HotSpot collectors are generational because most objects die young. A minor GC collects the young generation when Eden fills: live objects are copied to a survivor space, their age increases, and after a threshold they are promoted to the old generation; it is frequent and fast. A major GC collects the old generation, and a full GC collects the whole heap, usually with longer stop-the-world pauses. Frequent full GCs usually mean a leak or an undersized heap.'],
          ['G1 vs ZGC: trade-offs and how you would choose.', 'G1 is the default since Java 9. It splits the heap into regions, collects the regions with the most garbage first, and aims for a pause-time goal, 200 milliseconds by default, with a good balance of throughput and latency. ZGC does almost all its work concurrently using colored pointers and load barriers, so pauses stay under a millisecond regardless of heap size, even with terabyte heaps; the cost is some throughput and extra memory and CPU for the barriers. Since Java 21 ZGC is generational, which improved its throughput. I start with G1, look at GC logs and p99 latency, and switch to ZGC only when GC pauses break a latency SLA, typically for large heaps or latency-critical services. For pure batch throughput, Parallel GC is also an option.'],
          ['Common causes of memory leaks in Java and how you debug them (heap dump, JFR, VisualVM).', 'A Java leak is an object that is still reachable but never used again. Common causes are static or unbounded caches and collections, mutable HashMap keys, ThreadLocals in thread pools that are never removed, listeners that are never unregistered, unclosed resources, inner classes holding their outer instance, and classloader leaks on redeploy. To debug, I first confirm it in GC logs or monitoring: the heap after each full GC keeps rising. Then I take a heap dump with <code>jcmd GC.heap_dump</code>, or rely on <code>-XX:+HeapDumpOnOutOfMemoryError</code>, and open it in Eclipse MAT or VisualVM, look at the dominator tree for the largest retained sizes and follow the path to GC roots to see who holds the objects. JFR is low overhead and safe in production, and its allocation profiling and old object samples point to leak candidates. VisualVM is handy for a live view of heap usage locally. The fix is usually bounding the cache, removing the ThreadLocal in a finally block, or closing resources.'],
          ['Types of OutOfMemoryError; StackOverflowError.', 'OutOfMemoryError has several flavours, and the message tells you which area ran out. "Java heap space" means the heap is full because of a leak or an undersized heap. "GC overhead limit exceeded" means the JVM spends almost all its time in GC while recovering very little memory. "Metaspace" means too many classes are loaded, often from dynamic proxies or a classloader leak. "Requested array size exceeds VM limit" means an array larger than the JVM can allocate. "Unable to create native thread" means the OS refused a new thread, and "Direct buffer memory" means off-heap NIO buffers are exhausted. StackOverflowError is different: a single thread\'s stack is exhausted, almost always due to infinite or very deep recursion, such as a missing base case or toString methods calling each other. Both are Errors, so I fix the root cause rather than catching them.'],
          ['Class loaders: bootstrap, platform, application; parent delegation.', 'The bootstrap class loader is native and loads the core JDK modules like java.base; for its classes <code>getClassLoader()</code> returns null. The platform class loader, which replaced the extension loader in Java 9, loads other JDK modules such as java.sql. The application or system class loader loads classes from the classpath, meaning our code and libraries. They follow parent delegation: a loader first asks its parent, and only if the parent cannot find the class does it load it itself. That guarantees core classes like java.lang.String are always loaded by bootstrap and cannot be replaced by a malicious jar, and that classes are not loaded twice. A class is identified by its name plus its loader, which is why the same class from two loaders causes a ClassCastException; application servers like Tomcat use child-first loaders per web app on purpose.'],
        ] },
        { say: [
          ['Aise bolo — memory leak debug story (45 sec)', 'In one service, memory kept growing and we saw more and more full GCs before it finally hit OutOfMemoryError. The GC logs showed the heap after each full GC rising, which pointed to a leak, not a small heap. We had HeapDumpOnOutOfMemoryError enabled, so I opened the dump in Eclipse MAT, and the dominator tree showed a static map used as a cache holding millions of entries with no eviction. I replaced it with a bounded cache with a size limit and expiry, and verified with JFR in staging that the old generation stayed flat.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          '"Static variables metaspace / PermGen me rehte hain" — Java 8 se heap pe; metaspace me sirf class metadata.',
          '"Objects stack pe banta hai" — objects heap pe; stack pe sirf references aur primitives (escape analysis optimisation alag baat hai).',
          '"Java me memory leak ho hi nahi sakta, GC hai" — reachable-but-unused objects GC nahi hata sakta.',
          '<code>System.gc()</code> ko fix samajhna — sirf hint hai.',
          '"Cycle hai toh GC nahi karega" — Java reachability dekhta hai, reference count nahi.',
          'GC tuning flags pehle, measurement baad me — pehle logs / JFR.',
          'StackOverflowError ko <code>-Xss</code> badha ke "fix" karna — asli bug recursion hai.',
          'Bootstrap loader ka naam print karne ki koshish — wo <code>null</code> dikhta hai.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['<code>void f() { Dog d = new Dog(); }</code> — f return hone ke baad Dog object kahan hai aur kya hoga?', 'Object <b>heap</b> pe tha; reference <code>d</code> stack frame ke saath gaya → object unreachable → agle GC (zyada-tar minor GC) me collect.'],
          ['A ⇄ B ek doosre ko refer karte hain, par kisi root se reachable nahi. GC collect karega?', '<b>Haan</b> — reachability roots se dekhi jaati hai; cycle se fark nahi padta.'],
          ['<code>System.out.println(Integer.class.getClassLoader());</code>?', '<b>null</b> — <code>java.lang.Integer</code> bootstrap loader se load hoti hai.'],
          ['Recursion me base case missing hai. Kaunsa error, aur heap badhane (<code>-Xmx</code>) se fix hoga?', '<b>StackOverflowError</b>; <b>nahi</b> — wo thread stack ka error hai, heap ka nahi.'],
          ['Har full GC ke baad bhi used heap 1 GB → 1.3 GB → 1.6 GB badh raha hai. Kya shak karoge?', '<b>Memory leak</b> — live set badh raha hai. Heap dump lo, dominator tree + path to GC roots dekho.'],
        ] },
      ] },
    ],
    checks: [
      'Heap (young / old), stack, metaspace me kya rehta hai — diagram bina dekhe bana sakta hoon',
      'GC roots, mark-sweep-compact aur minor vs full GC 45 sec me samjha sakta hoon',
      'G1 vs ZGC ka trade-off aur "kab kaunsa" bol sakta hoon',
      'Leak ke 4 causes + heap dump / MAT / JFR wala debug flow bata sakta hoon',
    ],
    memory: 'Objects heap (Eden → survivor → old), frames stack (per thread), class metadata metaspace (native); GC = roots se reachable live, baaki garbage; minor = young fast, full = poora heap slow; G1 default balance, ZGC sub-ms pause; leak = reachable par bekaar → heap dump + dominator tree; loaders app → platform → bootstrap (null), parent pehle.',
    snippets: [
      { code: MEMAREAS, out: '25 42 2 2\ntrue' },
      { code: MARKSWEEP, out: 'marked live: [A, B, C]\nswept: [D, E]' },
      { code: LEAK, out: 'static cache entries: 1000\nget(new Key(1)): null, get(k): null, size: 1\nbounded LRU: [5, 3, 6]' },
      { code: ERRORS, out: 'StackOverflowError caught: no base case\ndepth > 1000: true\nOOM: Requested array size exceeds VM limit\nJVM still alive' },
      { code: LOADERS, out: 'String loader: null\nMain loader: app\nparent: platform\ngrandparent: null\njava.sql loader: platform\nplatform == parent: true\ndelegated to bootstrap: true' },
    ],
  };

  // =================================================================
  L.c7 = {
    kind: 'th', title: 'Multithreading basics', topic: 'Java',
    goal: 'Process vs thread, thread lifecycle states, Runnable vs Callable, <code>start()</code> vs <code>run()</code>, <code>synchronized</code> + intrinsic lock, <code>volatile</code> + happens-before, wait/notify vs sleep + producer-consumer aur deadlock prevention — <b>code + output ke saath</b>, aur planner ke <b>6 interview questions</b> ka English answer. Aage ke concurrency topics (executors, CompletableFuture, locks) isi base pe banenge.',
    oneLine: 'Threads memory share karte hain — isliye do problems: atomicity (synchronized / atomic) aur visibility (volatile / happens-before); aur locks galat order me liye toh deadlock.',
    parts: [
      { title: '🧵 Concept — process vs thread + thread lifecycle', blocks: [
        { table: { head: ['', 'Process', 'Thread'], rows: [
          ['Kya', 'Chalta hua program — apna address space', 'Process ke andar execution ka ek raasta'],
          ['Memory', 'Alag — ek process doosre ki memory nahi dekh sakta', '<b>Heap share</b> (c6), har thread ka apna <b>stack</b> + PC'],
          ['Banana / switch', 'Mehenga', 'Sasta (virtual threads aur bhi sasta — c5)'],
          ['Communication', 'IPC: sockets, pipes, files', 'Shared objects — fast par race conditions ka khatra'],
          ['Crash', 'Doosre process pe asar nahi', 'Ek thread ka uncaught exception sirf wo thread maarta hai; par shared state corrupt kar sakta hai'],
        ] } },
        { p: '<code>Thread.State</code> enum me <b>6 states</b> hain:' },
        { table: { head: ['State', 'Kab'], rows: [
          ['<b>NEW</b>', '<code>new Thread(...)</code> bana, <code>start()</code> nahi hua'],
          ['<b>RUNNABLE</b>', 'start ho gaya — CPU pe chal raha ya CPU ka wait (Java "ready" aur "running" alag nahi karta; blocking I/O me bhi RUNNABLE dikhta hai)'],
          ['<b>BLOCKED</b>', '<code>synchronized</code> ka monitor lock lene ka wait — koi aur pakde hai'],
          ['<b>WAITING</b>', 'Bina timeout wait: <code>wait()</code>, <code>join()</code>, <code>LockSupport.park()</code>'],
          ['<b>TIMED_WAITING</b>', 'Timeout ke saath: <code>sleep(ms)</code>, <code>wait(ms)</code>, <code>join(ms)</code>'],
          ['<b>TERMINATED</b>', '<code>run()</code> khatam (normally ya exception se)'],
        ] } },
        { code: STATES },
        { pre: `Output:
after new: NEW
inside run: RUNNABLE
after join: TERMINATED
sleeping: TIMED_WAITING
sleeper interrupted
waiting: WAITING
blocked: BLOCKED
finally: TERMINATED` },
        { pre: `NEW ──start()──► RUNNABLE ──run() khatam──► TERMINATED
                    │  ▲
   synchronized ka  │  │ lock mila
   lock busy        ▼  │
                  BLOCKED
                    │  ▲
   wait()/join()    ▼  │ notify()/thread khatam  (wapas lock ke liye BLOCKED ho sakta hai)
                  WAITING
   sleep(ms)/wait(ms) → TIMED_WAITING → time khatam / notify / interrupt → RUNNABLE` },
      ] },
      { title: '🏃 Runnable vs Callable; start() vs run()', blocks: [
        { table: { head: ['', 'Runnable', 'Callable&lt;V&gt;'], rows: [
          ['Method', '<code>void run()</code>', '<code>V call() throws Exception</code>'],
          ['Result', 'Nahi', 'Haan — <code>Future&lt;V&gt;</code> se'],
          ['Checked exception', 'Throw nahi kar sakta (andar hi catch)', 'Kar sakta hai — <code>Future.get()</code> pe <code>ExecutionException</code> me wrap'],
          ['Kahan use', '<code>new Thread(r)</code>, <code>executor.execute(r)</code>, <code>submit(r)</code>', 'Sirf executor: <code>submit(c)</code>, <code>invokeAll</code>'],
          ['Since', 'Java 1.0', 'Java 5 (<code>java.util.concurrent</code>)'],
        ] } },
        { code: RUNCALL },
        { pre: `Output:
run() on: main
run() on: worker-1
start() twice: IllegalThreadStateException
Callable result: 5050
Callable threw: boom` },
        { list: [
          '<code>start()</code> = JVM naya thread banata hai (NEW → RUNNABLE) aur <b>us thread pe</b> <code>run()</code> call karta hai. <code>run()</code> seedha call = normal method call, <b>current thread pe</b> — koi concurrency nahi.',
          'Ek Thread object sirf <b>ek baar</b> start ho sakta hai — dobara <code>IllegalThreadStateException</code>.',
          'Real code me <code>new Thread()</code> kam, <code>ExecutorService</code> zyada — thread reuse, limit, shutdown (aage ke concurrency topics me detail). <code>shutdown()</code> bhoolo mat, warna JVM exit nahi hota.',
        ] },
      ] },
      { title: '🔐 synchronized — method vs block; intrinsic lock', blocks: [
        { p: '<b>Race condition</b>: <code>count++</code> ek step nahi — <b>read → add → write</b>. Do threads ek saath read karein (dono ne 5 padha), dono 6 likhein → ek increment kho gaya. 4 threads × 10,000 increments ka unsafe result 40000 se <b>kam aur har run alag</b> aata hai — isliye wo version yahan run nahi kiya, sirf safe versions:' },
        { table: { head: ['Version', '4 × 10,000 increments ka result'], rows: [
          ['Plain <code>count++</code> (no lock)', 'Unpredictable, usually &lt; 40000 (lost updates)'],
          ['<code>volatile int</code> + <code>count++</code>', 'Phir bhi galat — volatile visibility deta hai, atomicity nahi'],
          ['<code>synchronized</code> method / block', 'Hamesha 40000'],
          ['<code>AtomicInteger.incrementAndGet()</code>', 'Hamesha 40000 (CAS, lock-free)'],
        ] } },
        { code: SYNC },
        { pre: `Output:
synchronized method: 40000
synchronized block: 40000
AtomicInteger: 40000
outer > inner (reentrant)
holdsLock(c) inside block: true
holdsLock(c) outside: false` },
        { table: { head: ['', 'synchronized method', 'synchronized block'], rows: [
          ['Lock kiska', 'Instance method: <code>this</code>; static method: <code>ClassName.class</code>', 'Jo object do: <code>synchronized (lock)</code>'],
          ['Scope', 'Poora method', 'Sirf critical section — kam contention'],
          ['Control', 'Kam — lock public object (this) hai, bahar wala bhi us pe lock kar sakta hai', 'Private final lock object → encapsulated; alag data ke liye alag locks'],
        ] } },
        { list: [
          '<b>Intrinsic lock (monitor)</b>: Java me <b>har object</b> ke saath ek lock hota hai. <code>synchronized</code> enter = lock acquire, exit (normal ya exception) = release — automatic. Ek time pe ek hi thread hold kar sakta hai; baaki <b>BLOCKED</b>.',
          '<b>Reentrant</b>: jis thread ke paas lock hai wo dobara le sakta hai (<code>outer()</code> → <code>inner()</code>) — count badhta hai, deadlock nahi.',
          'synchronized <b>mutual exclusion + visibility</b> dono deta hai: unlock se pehle ke writes, agle lock lene wale ko dikhte hain (happens-before — next part).',
          'Static aur instance synchronized methods <b>alag locks</b> use karte hain (class object vs this) — ek doosre ko block nahi karte.',
        ] },
      ] },
      { title: '👁️ volatile, visibility problem aur happens-before', blocks: [
        { p: '<b>Visibility problem</b>: har CPU core ka apna cache hota hai, aur JIT / CPU instructions <b>reorder</b> kar sakte hain. Ek thread ne <code>running = false</code> likha, par doosra thread apni cached value (true) padhta rahe — loop <b>kabhi na ruke</b>. Ye non-volatile version har baar fail nahi hota (isliye yahan run nahi kiya), par JIT <code>while (running)</code> ko <code>while (true)</code> bana sakta hai.' },
        { code: VOLATILE },
        { pre: `Output:
worker saw running=false, stopped
reader sees data = 42` },
        { table: { head: ['', 'volatile', 'synchronized', 'AtomicInteger'], rows: [
          ['Visibility', '✅', '✅', '✅'],
          ['Atomicity (<code>count++</code>)', '❌', '✅', '✅'],
          ['Blocking', 'Nahi', 'Haan (lock)', 'Nahi (CAS)'],
          ['Use', 'Flags, status, safe publication, double-checked locking', 'Compound actions, multiple variables ek saath', 'Single counter / reference'],
        ] } },
        { p: '<b>Happens-before</b> (Java Memory Model): agar action A happens-before B, toh A ke saare writes B ko <b>dikhne ki guarantee</b> hai. Main rules:' },
        { list: [
          '<b>Program order</b>: ek thread me pehle wala statement baad wale se pehle.',
          '<b>Monitor</b>: kisi lock ka unlock → usi lock ka agla lock.',
          '<b>volatile</b>: volatile write → usi variable ka baad wala read. (Isliye <code>data = 42</code> plain hote hue bhi reader ko dikha — <code>ready = true</code> se pehle likha gaya tha.)',
          '<b>Thread start / join</b>: <code>t.start()</code> se pehle ke writes thread ko dikhte hain; thread ke saare writes <code>t.join()</code> ke baad dikhte hain (isi liye har example me join ke baad result padhte hain).',
          '<b>Transitivity</b>: A hb B aur B hb C → A hb C. Bonus: constructor me <code>final</code> fields properly publish hote hain.',
        ] },
      ] },
      { title: '⏳ wait/notify vs sleep + producer-consumer', blocks: [
        { table: { head: ['', '<code>wait()</code>', '<code>sleep(ms)</code>'], rows: [
          ['Class', '<code>Object</code> (har object ka monitor)', '<code>Thread</code> (static)'],
          ['Lock', '<b>Lock chhod deta hai</b> — doosre thread andar aa sakein', '<b>Lock pakde rakhta hai</b>'],
          ['Kahan call', 'Sirf <code>synchronized</code> ke andar, usi object pe — warna <code>IllegalMonitorStateException</code>', 'Kahin bhi'],
          ['Jagta kab', '<code>notify / notifyAll</code>, timeout, interrupt (ya spurious wakeup)', 'Time poora / interrupt'],
          ['Purpose', 'Threads ke beech coordination (condition ka wait)', 'Bas pause'],
        ] } },
        { code: PRODCONS },
        { pre: `Output:
wait/notify consumed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
BlockingQueue sum: 55` },
        { list: [
          '<b><code>while</code>, <code>if</code> nahi</b>: jaagne ke baad condition dobara check — spurious wakeup, ya kisi aur thread ne pehle item le liya.',
          '<b>notifyAll</b> safer: notify sirf ek random waiter jagata hai — galat type ka (producer ki jagah producer) jaga toh sab atak sakte hain.',
          'Single producer + single consumer + FIFO buffer → items order me hi aate hain. Production code me <code>BlockingQueue</code> (<code>put</code> / <code>take</code> already blocking) — wait/notify sirf interview sketch ke liye. Band karne ke liye <b>poison pill</b> (-1).',
          'Modern alternative: <code>ReentrantLock</code> + do <code>Condition</code> (notFull, notEmpty) — sirf sahi type ke threads jagte hain.',
        ] },
      ] },
      { title: '💀 Deadlock — 4 conditions aur prevention', blocks: [
        { p: '<b>Deadlock scene</b> (ye run nahi karte, describe karte hain): Thread 1 <code>transfer(A, B)</code> — pehle A ka lock liya, ab B chahiye. Thread 2 <code>transfer(B, A)</code> — pehle B ka lock liya, ab A chahiye. Dono ek doosre ka lock chhodne ka wait karte hain — <b>hamesha ke liye</b>, dono BLOCKED. Program hang, CPU 0%.' },
        { table: { head: ['Coffman condition (chaaron chahiye)', 'Matlab', 'Kaise todo'], rows: [
          ['<b>Mutual exclusion</b>', 'Resource ek time pe ek hi thread', 'Lock-free / immutable data, atomic classes'],
          ['<b>Hold and wait</b>', 'Ek lock pakad ke doosre ka wait', 'Saare locks ek saath lo, ya <code>tryLock</code> fail → jo pakda wo chhodo'],
          ['<b>No preemption</b>', 'Lock zabardasti chheena nahi ja sakta', '<code>tryLock(timeout)</code>, <code>lockInterruptibly()</code>'],
          ['<b>Circular wait</b>', 'T1 → T2 → T1 ka cycle', '<b>Lock ordering</b> — sab threads same global order me lock lein (id, hash)'],
        ] } },
        { code: DEADLOCK },
        { pre: `Output:
lock ordering: A=500 B=1500 total=2000
tryLock: C=500 D=1500 total=2000` },
        { list: [
          '<b>Detect</b>: <code>jstack &lt;pid&gt;</code> / <code>jcmd &lt;pid&gt; Thread.print</code> — end me "Found one Java-level deadlock" aur kaun kis lock ka wait kar raha hai. Code me <code>ThreadMXBean.findDeadlockedThreads()</code>.',
          'Aur prevention: lock scope chhota rakho, lock pakad ke bahar ki call (DB, callback) mat karo, nested locks avoid karo, high-level concurrency utilities use karo.',
          '<b>Livelock</b>: threads busy hain par aage nahi badhte (dono baar-baar tryLock fail → chhodo → retry same time pe) — random / thodi backoff se fix. <b>Starvation</b>: ek thread ko kabhi lock nahi milta — fair lock (<code>new ReentrantLock(true)</code>).',
        ] },
      ] },
      { title: '🎤 Interview — planner ke 6 questions (English answers)', blocks: [
        { tip: 'Jahan "in my project" bolna ho (background jobs, parallel API calls, cache refresh, counters), wahan <b>apne asli project</b> ka multithreading use-case daalo. Neeche ke account / buffer examples sirf template hain.' },
        { qa: [
          ['Process vs thread. The thread lifecycle states.', 'A process is a running program with its own address space, so processes are isolated and communicate through IPC such as sockets. A thread is a path of execution inside a process; threads of the same process share the heap but each has its own stack and program counter, so they are cheaper to create and switch, and communicate through shared objects, which is fast but needs synchronization. In Java a thread has six states in Thread.State: NEW after construction, RUNNABLE after start, which covers both running and ready, BLOCKED while waiting for a monitor lock, WAITING for an untimed wait, join or park, TIMED_WAITING for sleep or a wait with a timeout, and TERMINATED when run finishes.'],
          ['Runnable vs Callable. Thread.start() vs run().', 'Runnable has a void <code>run()</code> method that cannot return a value or throw checked exceptions. Callable, added in Java 5, has <code>call()</code>, which returns a value and can throw checked exceptions; it is submitted to an ExecutorService, which returns a Future, and <code>get()</code> blocks for the result and wraps any exception in ExecutionException. <code>start()</code> asks the JVM to create a new thread, which moves from NEW to RUNNABLE and then calls <code>run()</code> on that new thread. Calling <code>run()</code> directly is just a normal method call on the current thread, so nothing runs concurrently. A thread can be started only once; a second <code>start()</code> throws IllegalThreadStateException.'],
          ['synchronized method vs block; what an intrinsic lock is.', 'Every Java object has an intrinsic lock, also called a monitor. Entering a synchronized method or block acquires it, and leaving, normally or through an exception, releases it, so only one thread at a time runs code guarded by the same lock; others become BLOCKED. Intrinsic locks are reentrant, so a thread holding the lock can call another synchronized method on the same object. A synchronized instance method locks on <code>this</code>, and a static one locks on the Class object. A synchronized block lets me choose the lock object and keep the critical section small, which reduces contention; I prefer a private final lock object so outside code cannot lock on it. Besides mutual exclusion, synchronized also guarantees visibility of changes to the next thread that takes the same lock.'],
          ['volatile and the visibility problem; what happens-before means.', 'Because of CPU caches and compiler or CPU reordering, a write by one thread may not be seen by another thread without synchronization — for example a stop flag that another thread keeps reading as true forever. Declaring the field volatile guarantees that every write is visible to subsequent reads and prevents reordering around it. Volatile does not make compound actions atomic, so <code>count++</code> on a volatile field is still a race; for that I use synchronized or AtomicInteger. Happens-before is the Java Memory Model rule: if action A happens-before B, everything A wrote is visible to B. The main rules are program order within a thread, unlocking a monitor before the next lock of the same monitor, a volatile write before subsequent reads of that variable, <code>Thread.start</code> before the thread\'s actions, a thread\'s actions before another thread returns from <code>join</code>, and transitivity.'],
          ['wait/notify vs sleep. Sketch a producer-consumer.', '<code>wait()</code> is defined on Object, must be called while holding that object\'s monitor, releases the lock, and waits until notify, notifyAll, a timeout or an interrupt. <code>sleep()</code> is a static Thread method that just pauses the current thread and keeps any locks it holds. For producer-consumer I use a bounded buffer with synchronized put and take: put waits in a <code>while</code> loop while the buffer is full, adds the item and calls notifyAll; take waits in a while loop while it is empty, removes an item and calls notifyAll. The loop is needed because of spurious wakeups and because another consumer may have taken the item first. In real code I would use a BlockingQueue such as ArrayBlockingQueue, whose put and take already block, and stop the consumer with a poison-pill value.'],
          ['Deadlock: the four conditions and how to prevent it.', 'A deadlock happens when threads wait for each other\'s locks forever, for example one thread locks account A then wants B while another locks B then wants A. It needs all four Coffman conditions: mutual exclusion, hold and wait, no preemption, and circular wait, so preventing any one of them prevents deadlock. The most practical fix is a global lock ordering, for example always locking the account with the smaller id first, which removes circular wait. Another is <code>ReentrantLock.tryLock</code> with a timeout: if I cannot get the second lock, I release the first and retry with a small backoff, which removes hold and wait. I also keep critical sections short and avoid calling external code while holding a lock. To detect one, I take a thread dump with jstack or jcmd, which reports the deadlocked threads and the locks involved.'],
        ] },
        { say: [
          ['Aise bolo — race condition + fix (45 sec)', 'In one service, several worker threads updated a shared counter of processed records with a plain increment, and the totals at the end of the batch were always a bit lower than expected. The reason is that count plus plus is a read, an add and a write, so two threads can read the same value and one update is lost. Making it volatile would not help, because volatile only fixes visibility, not atomicity. I replaced it with an AtomicInteger, and for the part that updated two fields together I used a synchronized block on a private lock. After that the totals matched on every run.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          '<code>t.run()</code> call karke sochna naya thread bana — current thread pe hi chala.',
          '<code>volatile int count; count++</code> ko thread-safe samajhna — atomic nahi hai.',
          '<code>wait()</code> ko <code>if</code> me likhna — <code>while</code> chahiye (spurious wakeup).',
          '<code>wait()</code> / <code>notify()</code> synchronized ke bahar — <code>IllegalMonitorStateException</code>.',
          '"sleep lock chhod deta hai" — nahi, sirf wait chhodta hai.',
          'Alag-alag objects pe synchronized karke sochna shared data safe hai — <b>same lock</b> chahiye.',
          'Join ke bina thread ka result padhna — visibility ki guarantee nahi, aur shayad kaam khatam bhi na hua ho.',
          'Nested locks alag-alag order me — deadlock ka nuskha.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['<code>Thread t = new Thread(() -&gt; System.out.println(Thread.currentThread().getName()), "w"); t.run();</code> — kya print hoga?', '<b>main</b> — run() normal method call hai, current (main) thread pe chala.'],
          ['<code>Thread t = new Thread(...); System.out.println(t.getState());</code>', '<b>NEW</b> — start abhi call nahi hua.'],
          ['Thread synchronized block ke andar <code>Thread.sleep(1000)</code> kar raha hai. Doosra thread usi lock wale block me ja payega?', '<b>Nahi</b> — sleep lock pakde rakhta hai; doosra thread BLOCKED rahega. (wait() hota toh lock chhoot jaata.)'],
          ['<code>synchronized void a()</code> aur <code>static synchronized void b()</code> — do threads ek saath a() aur b() chala sakte hain?', '<b>Haan</b> — a() <code>this</code> pe lock karta hai, b() <code>ClassName.class</code> pe — alag locks.'],
          ['T1: lock A then B. T2: lock A then B (same order). Deadlock possible?', '<b>Nahi</b> — same order me lock = circular wait nahi bana sakta. Ulta order (T2: B then A) me possible.'],
        ] },
      ] },
    ],
    checks: [
      'Process vs thread aur 6 thread states (kab kaunsi) bol sakta hoon',
      'start() vs run() aur Runnable vs Callable code se samjha sakta hoon',
      'synchronized / volatile / AtomicInteger ka farq + happens-before ke 4 rules bata sakta hoon',
      'Producer-consumer (wait/notify) aur lock-ordering deadlock fix bina dekhe likh sakta hoon',
    ],
    memory: '6 states: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED; start = naya thread, run = normal call; synchronized = atomicity + visibility (har object ka monitor, reentrant); volatile = sirf visibility; wait lock chhodta hai, sleep nahi — wait hamesha while me; deadlock = 4 conditions, fix = lock ordering / tryLock.',
    snippets: [
      { code: STATES, out: 'after new: NEW\ninside run: RUNNABLE\nafter join: TERMINATED\nsleeping: TIMED_WAITING\nsleeper interrupted\nwaiting: WAITING\nblocked: BLOCKED\nfinally: TERMINATED' },
      { code: RUNCALL, out: 'run() on: main\nrun() on: worker-1\nstart() twice: IllegalThreadStateException\nCallable result: 5050\nCallable threw: boom' },
      { code: SYNC, out: 'synchronized method: 40000\nsynchronized block: 40000\nAtomicInteger: 40000\nouter > inner (reentrant)\nholdsLock(c) inside block: true\nholdsLock(c) outside: false' },
      { code: VOLATILE, out: 'worker saw running=false, stopped\nreader sees data = 42' },
      { code: PRODCONS, out: 'wait/notify consumed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nBlockingQueue sum: 55' },
      { code: DEADLOCK, out: 'lock ordering: A=500 B=1500 total=2000\ntryLock: C=500 D=1500 total=2000' },
    ],
  };
})();
