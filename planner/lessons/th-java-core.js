// Planner lessons — Java core theory (c2 Strings/equality/exceptions, c3 Collections internals, c4 Java 8 functional)
// Theory format: concept Hinglish me → har planner interview question ka English answer (qa) → code + output → traps → self-test.
// snippets: validate-lessons.js --java inhe compile + run karke output match karta hai.
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});

  // ======================= c2 — code examples =======================
  const STRPOOL = `public class Main {
    public static void main(String[] args) {
        String a = "java";                 // literal → String pool
        String b = "java";                 // pool me already hai → same object
        String c = new String("java");     // new → heap pe alag object
        String d = c.intern();             // pool wala reference wapas
        System.out.println((a == b) + " " + (a == c) + " " + (a == d) + " " + a.equals(c));

        String s = "hi";
        s.concat(" there");                // naya String bana aur phenk diya — s nahi badla
        System.out.println(s);
        s = s.concat(" there");            // naya object s ko assign kiya
        System.out.println(s);

        final String x = "ja";             // compile-time constant
        String y = "ja";                   // normal variable
        System.out.println((x + "va" == a) + " " + (y + "va" == a));
    }
}`;

  const BUILDER = `public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();          // mutable, NOT synchronized — default choice
        for (int i = 1; i <= 5; i++) sb.append(i).append(',');
        sb.setLength(sb.length() - 1);                   // last comma hatao
        System.out.println(sb);
        System.out.println(sb.reverse());                // reverse() same object ko badalta hai
        sb.insert(0, "[").append("]");
        System.out.println(sb);

        StringBuffer buf = new StringBuffer("sync");     // har method synchronized (legacy)
        buf.append("ed");
        System.out.println(buf + " " + buf.length());

        String s = "";
        for (int i = 0; i < 3; i++) s += i;              // har += pe naya String — loop me avoid
        System.out.println(s);
    }
}`;

  const EQHASH = `class BadKey {
    final String id;
    BadKey(String id) { this.id = id; }
    @Override public boolean equals(Object o) {          // equals override kiya...
        return o instanceof BadKey && ((BadKey) o).id.equals(id);
    }
    // ...par hashCode() NAHI — contract toota
}

class GoodKey {
    final String id;
    GoodKey(String id) { this.id = id; }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GoodKey)) return false;
        return id.equals(((GoodKey) o).id);
    }
    @Override public int hashCode() { return Objects.hash(id); }   // equals wale fields hi
}

public class Main {
    public static void main(String[] args) {
        Map<BadKey, Integer> bad = new HashMap<>();
        bad.put(new BadKey("u1"), 100);
        System.out.println("bad get: " + bad.get(new BadKey("u1")));   // alag hash → alag bucket

        Map<GoodKey, Integer> good = new HashMap<>();
        good.put(new GoodKey("u1"), 100);
        System.out.println("good get: " + good.get(new GoodKey("u1")));

        Set<BadKey> set = new HashSet<>();
        set.add(new BadKey("x"));
        set.add(new BadKey("x"));
        System.out.println("bad set size: " + set.size());            // "duplicate" bhi ghus gaya
    }
}`;

  const IMMUT = `final class Employee {                                   // 1. final class — koi subclass mutable na bana de
    private final String name;                            // 2. private final fields
    private final List<String> skills;
    private final Date joined;

    Employee(String name, List<String> skills, Date joined) {
        this.name = name;
        this.skills = List.copyOf(skills);                // 3. defensive copy (aur unmodifiable)
        this.joined = new Date(joined.getTime());         //    Date mutable hai → copy
    }
    String getName() { return name; }                     // 4. setters nahi
    List<String> getSkills() { return skills; }           //    already unmodifiable
    Date getJoined() { return new Date(joined.getTime()); }   // 5. getter me bhi copy
    Employee withSkill(String s) {                        // change = naya object
        List<String> next = new ArrayList<>(skills);
        next.add(s);
        return new Employee(name, next, joined);
    }
}

public class Main {
    public static void main(String[] args) {
        List<String> skills = new ArrayList<>(List.of("Java"));
        Date d = new Date(0);
        Employee e = new Employee("Asha", skills, d);
        skills.add("Hacking");                 // caller ne apni list badli
        d.setTime(999999L);                    // caller ne apni Date badli
        e.getJoined().setTime(5L);             // getter wali copy badli
        System.out.println(e.getSkills() + " " + e.getJoined().getTime());
        try {
            e.getSkills().add("X");
        } catch (UnsupportedOperationException ex) {
            System.out.println("cannot modify skills");
        }
        Employee e2 = e.withSkill("Spring");
        System.out.println(e.getSkills() + " -> " + e2.getSkills());
    }
}`;

  const EXC = `class InsufficientBalanceException extends Exception {     // checked: caller ko handle / declare karna padega
    private final long shortBy;
    InsufficientBalanceException(long shortBy) {
        super("short by " + shortBy);
        this.shortBy = shortBy;                                // extra context field
    }
    long getShortBy() { return shortBy; }
}

class Account {
    private long balance = 100;
    void withdraw(long amt) throws InsufficientBalanceException {
        if (amt <= 0) throw new IllegalArgumentException("amount must be > 0");   // unchecked: caller ka bug
        if (amt > balance) throw new InsufficientBalanceException(amt - balance); // business case: recoverable
        balance -= amt;
    }
    void deposit(long amt) {                                   // sirf unchecked — koi throws nahi
        if (amt <= 0) throw new IllegalArgumentException("amount must be > 0");
        balance += amt;
    }
    long balance() { return balance; }
}

public class Main {
    public static void main(String[] args) {
        Account acc = new Account();
        try {
            acc.withdraw(30);
            acc.withdraw(500);
        } catch (InsufficientBalanceException e) {
            System.out.println("Checked: " + e.getMessage() + " (shortBy=" + e.getShortBy() + ")");
        }
        try {
            acc.deposit(-5);                                   // compiler ne force nahi kiya catch karna
        } catch (IllegalArgumentException e) {
            System.out.println("Unchecked: " + e.getMessage());
        } finally {
            System.out.println("balance=" + acc.balance());
        }
    }
}`;

  const TWR = `class Res implements AutoCloseable {                 // try-with-resources ke liye AutoCloseable chahiye
    private final String name;
    private final boolean failOnClose;
    Res(String name, boolean failOnClose) {
        this.name = name;
        this.failOnClose = failOnClose;
        System.out.println("open " + name);
    }
    @Override public void close() {
        System.out.println("close " + name);
        if (failOnClose) throw new IllegalStateException("close failed: " + name);
    }
}

public class Main {
    public static void main(String[] args) {
        try (Res a = new Res("A", false); Res b = new Res("B", true)) {
            System.out.println("using A and B");
            throw new RuntimeException("body failed");
        } catch (RuntimeException e) {                   // close() catch se PEHLE ho chuka hota hai
            System.out.println("caught: " + e.getMessage());
            for (Throwable s : e.getSuppressed()) System.out.println("suppressed: " + s.getMessage());
        }
        try (Res c = new Res("C", true)) {
            System.out.println("using C");
        } catch (IllegalStateException e) {              // body theek, sirf close fail → wahi exception
            System.out.println("caught: " + e.getMessage() + ", suppressed=" + e.getSuppressed().length);
        }
    }
}`;

  // ======================= c3 — code examples =======================
  const HM_INTERNAL = `class CollideKey {
    final int id;
    CollideKey(int id) { this.id = id; }
    @Override public int hashCode() { return 42; }            // sab keys ek hi bucket me (worst case)
    @Override public boolean equals(Object o) {
        return o instanceof CollideKey && ((CollideKey) o).id == id;
    }
}

public class Main {
    static int spread(int h) { return h ^ (h >>> 16); }        // HashMap.hash() jaisa: upper bits neeche mix

    public static void main(String[] args) {
        for (String k : List.of("apple", "banana", "cherry")) {
            int h = spread(k.hashCode());
            System.out.println(k + " -> bucket " + (h & (16 - 1)));   // capacity 16 → index = hash & 15
        }
        Map<CollideKey, String> m = new HashMap<>();
        for (int i = 1; i <= 10; i++) m.put(new CollideKey(i), "v" + i);   // 10 collisions → chain / tree
        System.out.println("size=" + m.size() + " get(7)=" + m.get(new CollideKey(7)));
        m.put(new CollideKey(7), "new7");                          // equals() match → value replace, size same
        System.out.println("size=" + m.size() + " get(7)=" + m.get(new CollideKey(7)));
    }
}`;

  const RESIZE = `public class Main {
    public static void main(String[] args) {
        int cap = 16;
        float lf = 0.75f;                                           // default load factor
        while (cap <= 64) {
            System.out.println("capacity " + cap + " -> resize after " + (int) (cap * lf) + " entries");
            cap <<= 1;                                              // resize = double (power of 2 hi rehta hai)
        }
        int[] hashes = {5, 21, 37, 53};                             // capacity 16 me sab bucket 5
        for (int h : hashes) {
            int oldIdx = h & 15, newIdx = h & 31;
            String move = (h & 16) == 0 ? "stays" : "moves +16";     // sirf ek naya bit decide karta hai
            System.out.println("hash " + h + ": " + oldIdx + " -> " + newIdx + " (" + move + ")");
        }
        int expected = 100;
        int initial = (int) Math.ceil(expected / 0.75);             // pre-size → resize hi na ho
        System.out.println("new HashMap<>(" + initial + ") for " + expected + " entries");
    }
}`;

  const MAPS = `import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Map<String, Integer> hm = new HashMap<>();
        hm.put(null, 1);                                            // HashMap: ek null key allowed
        System.out.println("HashMap null key ok: " + hm.get(null));
        try { new Hashtable<String, Integer>().put(null, 1); }
        catch (NullPointerException e) { System.out.println("Hashtable: NPE on null key"); }
        try { new ConcurrentHashMap<String, Integer>().put("k", null); }
        catch (NullPointerException e) { System.out.println("ConcurrentHashMap: NPE on null value"); }

        ConcurrentHashMap<String, Integer> hits = new ConcurrentHashMap<>();
        ExecutorService pool = Executors.newFixedThreadPool(4);
        for (int t = 0; t < 4; t++)
            pool.submit(() -> { for (int i = 0; i < 1000; i++) hits.merge("page", 1, Integer::sum); });  // atomic
        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);
        System.out.println("CHM merge count = " + hits.get("page"));

        Map<String, Integer> sync = Collections.synchronizedMap(new HashMap<>());
        sync.put("a", 1);
        sync.put("b", 2);
        synchronized (sync) {                                       // iterate karte waqt lock KHUD lena padta hai
            int sum = 0;
            for (int v : sync.values()) sum += v;
            System.out.println("synchronizedMap sum = " + sum);
        }
    }
}`;

  const LISTS = `public class Main {
    public static void main(String[] args) {
        List<Integer> arr = new ArrayList<>(List.of(10, 20, 30, 40));
        System.out.println("ArrayList get(2) = " + arr.get(2));     // O(1) random access
        arr.add(1, 15);                                             // O(n): baaki elements shift
        System.out.println(arr);

        LinkedList<Integer> ll = new LinkedList<>(List.of(10, 20, 30, 40));
        ll.addFirst(5);                                             // O(1) ends pe
        ll.addLast(50);
        System.out.println(ll + " first=" + ll.peekFirst() + " last=" + ll.peekLast());
        ListIterator<Integer> it = ll.listIterator();
        while (it.hasNext()) if (it.next() % 20 == 0) it.remove();  // iterator ki position pe remove O(1)
        System.out.println(ll);

        Deque<Integer> dq = new ArrayDeque<>();                     // queue / stack ke liye usually best
        dq.offerLast(1);
        dq.offerLast(2);
        dq.offerFirst(0);
        System.out.println(dq);
        System.out.println("poll=" + dq.pollFirst() + " now " + dq);
    }
}`;

  const FAILFAST = `import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a", "b", "c"));
        try {
            for (String s : list) if (s.equals("a")) list.remove(s);   // loop ke beech list.remove → modCount badla
        } catch (ConcurrentModificationException e) {
            System.out.println("CME caught (fail-fast), list now " + list);
        }

        List<String> l2 = new ArrayList<>(List.of("a", "b", "c", "d"));
        Iterator<String> it = l2.iterator();
        while (it.hasNext()) if (it.next().equals("b")) it.remove();  // sahi tareeka 1
        System.out.println("iterator.remove: " + l2);
        l2.removeIf(s -> s.equals("c"));                              // sahi tareeka 2 (Java 8)
        System.out.println("removeIf: " + l2);

        List<String> cow = new CopyOnWriteArrayList<>(List.of("x", "y"));
        for (String s : cow) cow.add(s + "!");                         // snapshot pe iterate — no CME
        System.out.println("CopyOnWrite: " + cow);

        Map<String, Integer> chm = new ConcurrentHashMap<>(Map.of("k1", 1));
        for (String k : chm.keySet()) chm.put("k2", 2);                // weakly consistent — no CME
        System.out.println("CHM size: " + chm.size());
    }
}`;

  const TREE = `class Emp implements Comparable<Emp> {
    final String name;
    final int salary;
    Emp(String name, int salary) { this.name = name; this.salary = salary; }
    @Override public int compareTo(Emp o) { return name.compareTo(o.name); }   // natural order: name
    @Override public String toString() { return name + ":" + salary; }
}

public class Main {
    public static void main(String[] args) {
        TreeMap<String, Integer> tm = new TreeMap<>(Map.of("delta", 4, "alpha", 1, "charlie", 3, "bravo", 2));
        System.out.println(tm);                                     // hamesha sorted keys
        System.out.println("first=" + tm.firstKey() + " ceiling(c)=" + tm.ceilingKey("c")
            + " headMap(charlie)=" + tm.headMap("charlie"));

        List<Emp> emps = new ArrayList<>(List.of(new Emp("Ravi", 50), new Emp("Anil", 40),
            new Emp("Meena", 70), new Emp("Zoya", 50)));
        Collections.sort(emps);                                     // Comparable (class ke andar, ek hi order)
        System.out.println(emps);
        emps.sort(Comparator.comparingInt((Emp e) -> e.salary).reversed()
            .thenComparing(e -> e.name));                           // Comparator (bahar se, jitne chaho)
        System.out.println(emps);

        TreeMap<String, Integer> ci = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
        ci.put("Java", 1);
        ci.put("JAVA", 2);                                          // comparator ke liye same key!
        System.out.println(ci);
    }
}`;

  // ======================= c4 — code examples =======================
  const FUNC = `import java.util.function.*;

@FunctionalInterface
interface TaxRule { double apply(double amount); }           // exactly ONE abstract method

public class Main {
    public static void main(String[] args) {
        Predicate<String> isLong = s -> s.length() > 4;          // T -> boolean
        Function<String, Integer> len = String::length;          // T -> R
        Supplier<List<String>> fresh = ArrayList::new;           // () -> T
        Consumer<String> print = s -> System.out.println("hello " + s);   // T -> void
        BiFunction<Integer, Integer, Integer> add = Integer::sum;
        UnaryOperator<String> upper = String::toUpperCase;
        TaxRule gst = amt -> amt * 18 / 100;                     // apna functional interface

        System.out.println(isLong.test("lambda") + " " + isLong.negate().test("lambda"));
        System.out.println(len.andThen(n -> n * 10).apply("java"));
        List<String> l = fresh.get();
        l.add("x");
        System.out.println(l);
        print.accept("streams");
        System.out.println(add.apply(2, 3) + " " + upper.apply("ok") + " " + gst.apply(1000));
    }
}`;

  const LAZY = `import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        Stream<Integer> s = Stream.of(1, 2, 3, 4, 5, 6)
            .filter(n -> { System.out.println("filter " + n); return n % 2 == 0; })   // intermediate
            .map(n -> { System.out.println("map " + n); return n * n; });             // intermediate
        System.out.println("pipeline ready - nothing ran yet");
        Optional<Integer> first = s.findFirst();                // terminal: ab chalega + short-circuit
        System.out.println("result " + first.orElse(-1));

        List<Integer> sorted = Stream.of(3, 1, 2).sorted().collect(Collectors.toList());
        System.out.println(sorted);

        Stream<Integer> used = Stream.of(1, 2);
        used.count();
        try {
            used.count();                                       // stream sirf ek baar consume hota hai
        } catch (IllegalStateException e) {
            System.out.println("stream reuse: IllegalStateException");
        }
    }
}`;

  const GROUP = `import java.util.stream.*;

class Employee {
    private final String name, dept;
    private final int salary;
    Employee(String name, String dept, int salary) { this.name = name; this.dept = dept; this.salary = salary; }
    String getName() { return name; }
    String getDept() { return dept; }
    int getSalary() { return salary; }
}

public class Main {
    public static void main(String[] args) {
        List<List<String>> teams = List.of(List.of("a", "b"), List.of("c"), List.of());
        System.out.println(teams.stream().map(List::size).collect(Collectors.toList()));        // 1 → 1
        System.out.println(teams.stream().flatMap(List::stream).collect(Collectors.toList()));  // 1 → 0..n, flatten

        List<Employee> emps = List.of(
            new Employee("Asha", "Eng", 90), new Employee("Ravi", "Eng", 80),
            new Employee("Neha", "HR", 60), new Employee("Kabir", "Sales", 70),
            new Employee("Isha", "Eng", 85), new Employee("Om", "HR", 65));

        Map<String, Long> countByDept = emps.stream()
            .collect(Collectors.groupingBy(Employee::getDept, TreeMap::new, Collectors.counting()));
        System.out.println(countByDept);

        Map<String, List<String>> namesByDept = emps.stream()
            .collect(Collectors.groupingBy(Employee::getDept, TreeMap::new,
                Collectors.mapping(Employee::getName, Collectors.toList())));
        System.out.println(namesByDept);

        Map<String, Double> avgByDept = emps.stream()
            .collect(Collectors.groupingBy(Employee::getDept, TreeMap::new,
                Collectors.averagingInt(Employee::getSalary)));
        System.out.println(avgByDept);
    }
}`;

  const OPT = `class User {
    final String name;
    private final String email;                             // field Optional NAHI — plain nullable
    User(String name, String email) { this.name = name; this.email = email; }
    Optional<String> getEmail() { return Optional.ofNullable(email); }   // return type pe Optional
}

public class Main {
    static Map<Integer, User> db = Map.of(1, new User("Asha", "asha@mail.com"), 2, new User("Ravi", null));
    static Optional<User> findUser(int id) { return Optional.ofNullable(db.get(id)); }
    static String expensive() { System.out.println("expensive called"); return "y"; }

    public static void main(String[] args) {
        System.out.println(findUser(1).flatMap(User::getEmail).map(String::toUpperCase).orElse("no email"));
        System.out.println(findUser(2).flatMap(User::getEmail).orElse("no email"));
        System.out.println(findUser(3).map(u -> u.name).orElse("unknown user"));
        findUser(1).ifPresent(u -> System.out.println("found " + u.name));
        try {
            findUser(3).get();                              // anti-pattern: bina check get()
        } catch (NoSuchElementException e) {
            System.out.println("get() on empty: NoSuchElementException");
        }
        try {
            findUser(3).orElseThrow(() -> new IllegalArgumentException("user 3 not found"));
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
        String a = Optional.of("x").orElse(expensive());        // value present, phir bhi expensive() chala!
        String b = Optional.of("x").orElseGet(Main::expensive); // lazy — nahi chala
        System.out.println(a + b);
    }
}`;

  const PARALLEL = `import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        long sum = LongStream.rangeClosed(1, 1_000_000).parallel().sum();   // primitive, splittable, stateless — good fit
        System.out.println("parallel sum = " + sum);

        List<Integer> safe = IntStream.range(0, 1000).parallel().boxed()
            .collect(Collectors.toList());                  // collect: per-thread containers merge, order preserved
        System.out.println("collected = " + safe.size() + " first=" + safe.get(0) + " last=" + safe.get(999));

        StringBuilder sb = new StringBuilder();
        IntStream.range(0, 5).parallel().forEachOrdered(sb::append);   // order chahiye → forEachOrdered (parallel ka fayda kam)
        System.out.println("ordered = " + sb);
    }
}`;

  const CODEIT = `import java.util.function.*;
import java.util.stream.*;

public class Main {
    static Optional<Integer> secondHighest(List<Integer> salaries) {
        return salaries.stream()
            .distinct()                                 // 9000, 9000 → ek hi baar
            .sorted(Comparator.reverseOrder())          // bada pehle
            .skip(1)                                    // highest chhodo
            .findFirst();                               // 2nd nahi hai → Optional.empty()
    }

    public static void main(String[] args) {
        String s = "programming";
        Map<Character, Long> freq = s.chars()                       // IntStream of char codes
            .mapToObj(c -> (char) c)                                // Stream<Character>
            .collect(Collectors.groupingBy(Function.identity(), TreeMap::new, Collectors.counting()));
        System.out.println(freq);                                   // sorted by char

        Map<Character, Long> inOrder = s.chars().mapToObj(c -> (char) c)
            .collect(Collectors.groupingBy(Function.identity(), LinkedHashMap::new, Collectors.counting()));
        System.out.println(inOrder);                                // first-appearance order

        System.out.println(secondHighest(List.of(5000, 9000, 7000, 9000)).map(String::valueOf).orElse("no 2nd highest"));
        System.out.println(secondHighest(List.of(4000, 4000)).map(String::valueOf).orElse("no 2nd highest"));
    }
}`;

  // =================================================================
  L.c2 = {
    kind: 'th', title: 'Strings, equality and exceptions', topic: 'Java',
    goal: 'String immutability + pool, String vs StringBuilder vs StringBuffer, <code>equals()</code>/<code>hashCode()</code> contract, immutable class banana, checked vs unchecked exceptions aur try-with-resources — har ek <b>code + output ke saath</b>, aur planner ke <b>6 interview questions</b> ka 30–60 sec English answer.',
    oneLine: 'String immutable hai isliye pool, caching aur thread-safety possible hai; equals override kiya toh hashCode bhi; final ≠ immutable; close() ka exception suppressed ban jaata hai.',
    parts: [
      { title: '🧵 Concept — String immutable kyun + String pool', blocks: [
        { p: 'String ek baar bana toh uska content <b>kabhi nahi badalta</b>. <code>concat</code>, <code>toUpperCase</code>, <code>replace</code> — sab <b>naya String</b> return karte hain. Isi wajah se JVM literals ko ek <b>String pool</b> (heap ke andar, Java 7 se) me share kar sakta hai: <code>"java"</code> do jagah likho, object ek hi.' },
        { table: { head: ['Immutable hone ka fayda', 'Kyun'], rows: [
          ['<b>String pool</b> (memory bachat)', 'Agar koi shared object badal sakta, toh ek jagah ka change sab jagah dikh jaata'],
          ['<b>hashCode cache</b>', 'Content fix hai → hash ek baar compute, field me cache. HashMap key ke liye perfect'],
          ['<b>Security</b>', 'File path, DB URL, class name check hone ke baad koi badal nahi sakta'],
          ['<b>Thread-safe</b>', 'Bina lock ke threads me share karo — koi likh hi nahi sakta'],
        ] } },
        { code: STRPOOL },
        { pre: `Output:
true false true true
hi
hi there
true false` },
        { list: [
          '<code>==</code> reference compare karta hai, <code>equals()</code> content. Strings ke liye hamesha <code>equals()</code>.',
          '<code>new String("java")</code> → heap pe naya object (literal pool me pehle se/bhi). <code>intern()</code> pool wala reference deta hai.',
          '<code>final String x = "ja"</code> compile-time constant hai → <code>x + "va"</code> compiler hi <code>"java"</code> bana deta hai → pool. Non-final <code>y + "va"</code> runtime pe banta hai → naya object.',
          '<b>Java 9 compact strings</b>: andar <code>char[]</code> ki jagah <code>byte[]</code> + coder (LATIN1 / UTF16) — English text me ~half memory.',
        ] },
        { tip: 'c1 me promise tha: <b>final ≠ immutable</b>. String final class hai <i>aur</i> uske andar ka data private + koi mutator nahi — dono milke immutable banate hain. Neeche immutable class wala part yahi detail me hai.' },
      ] },
      { title: '🔧 String vs StringBuilder vs StringBuffer', blocks: [
        { table: { head: ['', 'String', 'StringBuilder', 'StringBuffer'], rows: [
          ['Mutable?', 'Nahi', 'Haan', 'Haan'],
          ['Thread-safe?', 'Haan (immutable)', 'Nahi', 'Haan — har method <code>synchronized</code>'],
          ['Speed', 'Loop me concat slow (har baar naya object)', 'Fastest', 'Lock ka overhead'],
          ['Kab', 'Fixed text, keys, constants', 'Loop me string banana — default', 'Legacy code; asli me shared builder rare hai'],
        ] } },
        { code: BUILDER },
        { pre: `Output:
1,2,3,4,5
5,4,3,2,1
[5,4,3,2,1]
synced 6
012` },
        { tip: 'Ek line ka <code>a + b + c</code> theek hai — compiler optimise karta hai (Java 9+ <code>invokedynamic</code> concat). Problem <b>loop ke andar</b> <code>s += x</code> hai: har iteration naya String + copy → O(n²). Wahan StringBuilder.' },
      ] },
      { title: '⚖️ equals() aur hashCode() contract', blocks: [
        { p: 'Rule simple: <b>agar a.equals(b) true hai toh a.hashCode() == b.hashCode() hona hi chahiye</b>. Ulta zaroori nahi (same hash, alag objects = collision, allowed). equals khud bhi: reflexive, symmetric, transitive, consistent, aur <code>x.equals(null)</code> false.' },
        { p: 'HashMap pehle <b>hashCode se bucket</b> dhoondhta hai, phir us bucket me <b>equals se key</b>. equals override kiya par hashCode nahi → do "equal" objects ka default (identity) hash alag → alag bucket → <code>get()</code> null, Set me duplicates. (c3 me HashMap ke andar ka poora flow aayega.)' },
        { code: EQHASH },
        { pre: `Output:
bad get: null
good get: 100
bad set size: 2` },
        { list: [
          'hashCode me <b>wahi fields</b> use karo jo equals me — <code>Objects.hash(...)</code> ya IDE / Lombok / <code>record</code> (Java 16) se generate.',
          '<b>Mutable key</b> bhi isi contract ko todti hai: key daalne ke baad uska field badla → hash badla → entry "kho" jaati hai. Keys immutable rakho.',
        ] },
      ] },
      { title: '🧊 Immutable class kaise banate hain (List / Date fields ke saath)', blocks: [
        { olist: [
          'Class <code>final</code> (ya private constructor + factory) — subclass mutability na ghusa de.',
          'Saare fields <code>private final</code>.',
          'Setters nahi; "change" chahiye toh <b>naya object</b> return karo (<code>withSkill</code>).',
          'Constructor me mutable input ki <b>defensive copy</b> (<code>List.copyOf</code>, <code>new Date(d.getTime())</code>).',
          'Getter me bhi mutable field ki copy ya unmodifiable view do — internal reference bahar mat jaane do.',
        ] },
        { code: IMMUT },
        { pre: `Output:
[Java] 0
cannot modify skills
[Java] -> [Java, Spring]` },
        { tip: 'Better: <code>Date</code> ki jagah <code>java.time.LocalDate</code> / <code>Instant</code> — wo already immutable hain, copy ki zaroorat hi nahi. <code>record</code> bhi sirf <b>shallow</b> immutable hai — List field ki copy constructor me khud karni padti hai.' },
      ] },
      { title: '🚨 Checked vs unchecked exceptions + custom exception', blocks: [
        { table: { head: ['', 'Checked', 'Unchecked'], rows: [
          ['Hierarchy', '<code>Exception</code> ke neeche (RuntimeException chhod ke)', '<code>RuntimeException</code> aur <code>Error</code>'],
          ['Compiler', 'Catch karo ya <code>throws</code> declare karo — force', 'Kuch force nahi'],
          ['Matlab', 'Expected, recoverable situation (file nahi mili, balance kam)', 'Programming bug (null, bad argument, index out of range)'],
          ['Example', '<code>IOException</code>, <code>SQLException</code>', '<code>NullPointerException</code>, <code>IllegalArgumentException</code>'],
        ] } },
        { code: EXC },
        { pre: `Output:
Checked: short by 430 (shortBy=430)
Unchecked: amount must be > 0
balance=70` },
        { list: [
          '<b>Custom exception kab</b>: jab caller ko ek specific business case alag se handle karna ho (retry, alag HTTP status, user message) aur extra context (<code>shortBy</code>) bhejna ho.',
          'Spring jaise frameworks me zyada-tar custom exceptions <code>RuntimeException</code> extend karte hain, aur ek global handler (<code>@ControllerAdvice</code>) unhe HTTP response me map karta hai.',
          'Wrap karte waqt <b>cause</b> pass karo: <code>new MyException("msg", e)</code> — warna original stack trace kho jaata hai.',
        ] },
      ] },
      { title: '🔒 try-with-resources (aur jab close() bhi throw kare)', blocks: [
        { p: 'Java 7 se: <code>try (Res r = ...)</code> me jo bhi <code>AutoCloseable</code> hai, block khatam hote hi (normal ya exception) uska <code>close()</code> <b>automatically</b> chalta hai — <b>reverse order</b> me, aur <b>catch/finally se pehle</b>. Java 9 se bahar declare kiya effectively-final variable bhi <code>try (r)</code> me de sakte ho.' },
        { code: TWR },
        { pre: `Output:
open A
open B
using A and B
close B
close A
caught: body failed
suppressed: close failed: B
open C
using C
close C
caught: close failed: C, suppressed=0` },
        { tip: 'Body ka exception <b>primary</b> rehta hai; close() ka exception uske andar <code>getSuppressed()</code> me add hota hai — kho nahi jaata. Purane <code>finally { r.close(); }</code> style me close ka exception body wale ko <b>overwrite</b> kar deta tha.' },
      ] },
      { title: '🎤 Interview — planner ke 6 questions (English answers)', blocks: [
        { tip: 'Answers me <b>account / employee</b> wale examples sirf template hain — interview se pehle inhe <b>apne asli project</b> ke classes / exceptions se badal lo.' },
        { qa: [
          ['Why is String immutable, and what is the String pool?', 'String is immutable so it can be safely shared. The String pool is a cache of string literals on the heap (moved there from PermGen in Java 7): when I write <code>"java"</code> twice, both references point to the same pooled object, which saves a lot of memory. Sharing is only safe because nobody can change the object. Immutability also lets String cache its hashCode, which makes it a great HashMap key, it makes strings thread-safe without locks, and it is a security property — a file path or class name cannot be changed after it was validated. <code>new String("x")</code> creates a separate heap object, and <code>intern()</code> returns the pooled one. Since Java 9, compact strings store Latin-1 text in a byte array to halve memory.'],
          ['String vs StringBuilder vs StringBuffer.', 'String is immutable, so every modification creates a new object; concatenating in a loop is O(n squared). StringBuilder is a mutable, non-synchronized buffer — it is what I use to build strings in loops and it is the fastest. StringBuffer has the same API but every method is synchronized, so it is thread-safe but slower; it is mostly legacy, because a builder is almost always local to one method. For a simple one-line <code>a + b + c</code> the compiler already optimises it, so I only switch to StringBuilder inside loops.'],
          ['The equals() and hashCode() contract. What breaks in a HashMap if you violate it?', 'If two objects are equal according to <code>equals()</code>, they must return the same <code>hashCode()</code>; the reverse is not required. equals itself must be reflexive, symmetric, transitive, consistent, and return false for null. HashMap first uses the hash to pick a bucket and then uses equals inside that bucket. If I override equals but not hashCode, two equal keys get different identity hashes and land in different buckets, so <code>get()</code> returns null for a key that is logically present, and a HashSet accepts duplicates. A related bug is a mutable key: if a field used in hashCode changes after insertion, the entry becomes unreachable.'],
          ['How do you make a class immutable (including mutable fields like a List or Date)?', 'Make the class final, make all fields private and final, provide no setters, and return a new object for any change. The important part is mutable fields: in the constructor I make a defensive copy, for example <code>List.copyOf(list)</code> or <code>new Date(date.getTime())</code>, so the caller cannot change my state through their reference. In getters I return an unmodifiable list or a copy of the Date. Even better, I use immutable types such as <code>LocalDate</code> instead of Date. Note that final alone is not enough: a final List reference can still have elements added. Records help, but they are only shallowly immutable.'],
          ['Checked vs unchecked exceptions. When would you create a custom exception?', 'Checked exceptions extend Exception but not RuntimeException, and the compiler forces the caller to catch or declare them; they represent recoverable conditions such as IOException. Unchecked exceptions extend RuntimeException and usually mean a programming error, like NullPointerException or IllegalArgumentException. I create a custom exception when a business case needs distinct handling and extra context — for example an <code>InsufficientBalanceException</code> carrying the shortfall, which a global exception handler maps to a specific HTTP status and message. In modern Spring code I usually make them unchecked to avoid throws clauses everywhere, and I always pass the original cause when wrapping.'],
          ['How does try-with-resources work, and what happens if close() also throws?', 'Since Java 7, any object implementing AutoCloseable can be declared in the try header, and the compiler generates code that closes it automatically when the block exits, normally or with an exception. Multiple resources are closed in reverse order of creation, and this happens before the catch and finally blocks run. If the body throws and close() also throws, the body\'s exception is the one that propagates and the close() exception is attached to it as a suppressed exception, available through <code>getSuppressed()</code>. If only close() throws, that exception propagates normally. This fixes the old finally pattern where an exception from close() would hide the original one.'],
        ] },
        { say: [
          ['Aise bolo — equals / hashCode (45 sec)', 'HashMap finds an entry in two steps: the hashCode picks the bucket, and equals finds the exact key inside the bucket. That is why the contract says equal objects must have equal hash codes. I once saw a cache keyed by a custom object that overrode equals but not hashCode, so every lookup missed and the map kept growing. The fix was to generate both methods from the same fields and make the key immutable, because changing a key field after insertion makes the entry unreachable as well.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          'Strings ko <code>==</code> se compare karna — kabhi "kaam karta" dikhega (pool), kabhi nahi.',
          '<code>s.toUpperCase();</code> likh ke result assign na karna — String badla hi nahi.',
          'equals override, hashCode nahi (ya equals me alag fields, hashCode me alag).',
          '"final field hai toh immutable hai" — final List me <code>add()</code> chalta hai. Defensive copy chahiye.',
          'Getter se internal mutable List / Date seedha return karna.',
          '<code>catch (Exception e) {}</code> — exception nigal jaana; ya wrap karte waqt cause na dena.',
          '<code>finally</code> me <code>return</code> — ye try ka exception bhi nigal jaata hai.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['<code>String a = "hi"; String b = "h" + "i"; System.out.println(a == b);</code>', '<b>true</b> — dono literals constant hain, compiler hi <code>"hi"</code> bana deta hai → same pool object.'],
          ['<code>String a = "hi"; String h = "h"; System.out.println(a == h + "i");</code>', '<b>false</b> — <code>h</code> final nahi, concat runtime pe → naya object. (<code>.equals</code> true hota.)'],
          ['equals override kiya, hashCode nahi. <code>set.add(new P(1)); set.contains(new P(1))</code>?', 'Almost hamesha <b>false</b> — alag identity hash → alag bucket, equals tak baat hi nahi pahunchti.'],
          ['<code>try { return 1; } finally { return 2; }</code> — method kya return karega?', '<b>2</b> — finally ka return try ke return ko override karta hai (isliye finally me return mat likho).'],
          ['try-with-resources me body ne <code>IOException</code> phenka aur close() ne <code>IllegalStateException</code>. catch me kaunsa milega?', '<b>IOException</b> (primary); IllegalStateException uske <code>getSuppressed()</code> me.'],
        ] },
      ] },
    ],
    checks: [
      'String immutable kyun + pool + intern 45 sec me bol sakta hoon',
      'equals/hashCode toda toh HashMap me kya hota hai — code example ke saath',
      'Immutable class ke 5 steps (List + Date defensive copy) bina dekhe likh sakta hoon',
      'try-with-resources ka close order aur suppressed exception samjha sakta hoon',
    ],
    memory: 'String immutable → pool + hash cache + thread-safe; loop me StringBuilder; equal ⇒ same hash; final ≠ immutable (defensive copy); close() ka exception = suppressed.',
    snippets: [
      { code: STRPOOL, out: 'true false true true\nhi\nhi there\ntrue false' },
      { code: BUILDER, out: '1,2,3,4,5\n5,4,3,2,1\n[5,4,3,2,1]\nsynced 6\n012' },
      { code: EQHASH, out: 'bad get: null\ngood get: 100\nbad set size: 2' },
      { code: IMMUT, out: '[Java] 0\ncannot modify skills\n[Java] -> [Java, Spring]' },
      { code: EXC, out: 'Checked: short by 430 (shortBy=430)\nUnchecked: amount must be > 0\nbalance=70' },
      { code: TWR, out: 'open A\nopen B\nusing A and B\nclose B\nclose A\ncaught: body failed\nsuppressed: close failed: B\nopen C\nusing C\nclose C\ncaught: close failed: C, suppressed=0' },
    ],
  };

  // =================================================================
  L.c3 = {
    kind: 'th', title: 'Collections internals', topic: 'Java',
    goal: 'HashMap ke andar kya hota hai (hash, bucket, collision, treeify, resize), HashMap vs Hashtable vs ConcurrentHashMap vs synchronizedMap, ArrayList vs LinkedList, fail-fast vs fail-safe iterators aur TreeMap + Comparable/Comparator — <b>code + output ke saath</b>, aur planner ke <b>6 interview questions</b> ka English answer.',
    oneLine: 'HashMap = array of buckets; hashCode bucket chunta hai, equals key dhoondhta hai; 0.75 pe double hota hai; 8 se zyada collision pe tree.',
    parts: [
      { title: '🗂️ Concept — HashMap internally kaise kaam karta hai', blocks: [
        { p: 'HashMap andar se ek <b>array of buckets</b> (<code>Node[] table</code>) hai. Default capacity <b>16</b>, hamesha power of 2. <code>put(k, v)</code> ka flow (c2 ka equals/hashCode contract yahin kaam aata hai):' },
        { olist: [
          '<code>k.hashCode()</code> lo, phir <b>spread</b>: <code>h ^ (h &gt;&gt;&gt; 16)</code> — upper bits ko neeche mix karo, kyunki index sirf neeche ke bits se banta hai.',
          'Index = <code>hash &amp; (n - 1)</code> (n power of 2 hai isliye ye modulo jaisa, par fast).',
          'Bucket khaali → naya Node. Bhara hai → chain me har node pe pehle hash compare, phir <code>equals()</code>. Match mila → <b>value replace</b>; nahi mila → chain ke <b>end</b> me add (Java 8 tail insert).',
          'Chain ki length <b>8</b> (TREEIFY_THRESHOLD) pahunchi aur table capacity ≥ <b>64</b> (MIN_TREEIFY_CAPACITY) → bucket <b>red-black tree</b> ban jaata hai (lookup O(n) → O(log n)). Capacity 64 se kam hai toh treeify ki jagah <b>resize</b> hota hai.',
          'Resize / remove ke baad tree bucket ≤ <b>6</b> (UNTREEIFY_THRESHOLD) ho gaya → wapas linked list. (8 aur 6 ka gap → baar-baar convert na ho.)',
          'Size &gt; capacity × load factor → <b>resize</b> (double).',
        ] },
        { code: HM_INTERNAL },
        { pre: `Output:
apple -> bucket 1
banana -> bucket 0
cherry -> bucket 1
size=10 get(7)=v7
size=10 get(7)=new7` },
        { pre: `table (n=16)
 [0]  ── banana
 [1]  ── apple → cherry   (collision: alag keys, same bucket → chain)
 [2]  null
 ...
 hashCode()=42 wale 10 keys: sab ek hi bucket me
 [x]  ── K1 → K2 → ... → K8   (8 pe treeify ki koshish; n<64 → pehle resize)` },
        { tip: 'Constant hashCode (42) wala map <b>sahi</b> kaam karta hai (equals ki wajah se) — bas slow: sab ek bucket me. Isliye achha hashCode = kam collisions = O(1) average. Tree bucket me keys agar <code>Comparable</code> hain toh JDK unka compareTo bhi use karta hai ordering ke liye.' },
      ] },
      { title: '📈 Resize, load factor aur 0.75 kyun', blocks: [
        { p: '<b>Load factor</b> = map kitna bhar sakta hai resize se pehle. Threshold = capacity × 0.75 → 16 ke liye <b>12</b>. 13th entry pe table <b>double</b> (32) hota hai aur saari entries naye table me jaati hain — O(n) kaam, isliye kabhi-kabhi ek <code>put</code> slow hota hai (amortized O(1)).' },
        { code: RESIZE },
        { pre: `Output:
capacity 16 -> resize after 12 entries
capacity 32 -> resize after 24 entries
capacity 64 -> resize after 48 entries
hash 5: 5 -> 5 (stays)
hash 21: 5 -> 21 (moves +16)
hash 37: 5 -> 5 (stays)
hash 53: 5 -> 21 (moves +16)
new HashMap<>(134) for 100 entries` },
        { list: [
          'Java 8 resize me hash dobara compute nahi hota: har node ke liye sirf <code>hash &amp; oldCap</code> dekho — 0 → <b>same index</b>, 1 → <b>index + oldCap</b>. Bucket do lists (lo / hi) me split, order preserve.',
          '<b>0.75 kyun</b>: time vs space ka balance. Zyada (1.0) → kam memory par zyada collisions; kam (0.5) → kam collisions par aadha table khaali. JDK javadoc ke hisaab se 0.75 pe random hashes ke saath ek bucket me 8 nodes ki probability lagbhag 0.00000006 hai — treeify rare case hai.',
          'Pata hai kitni entries aayengi → pehle se size do: <code>new HashMap&lt;&gt;((int) Math.ceil(n / 0.75))</code> ya Java 19+ <code>HashMap.newHashMap(n)</code>.',
          'Java 7 me head-insert + concurrent resize se chain me <b>cycle</b> (infinite loop) ban sakti thi. Java 8 tail-insert se wo fix, par HashMap ab bhi thread-safe nahi — data lose ho sakta hai.',
        ] },
      ] },
      { title: '🔐 HashMap vs Hashtable vs ConcurrentHashMap vs synchronizedMap', blocks: [
        { table: { head: ['', 'HashMap', 'Hashtable', 'Collections.synchronizedMap', 'ConcurrentHashMap'], rows: [
          ['Thread-safe', 'Nahi', 'Haan — har method synchronized', 'Haan — wrapper, ek hi lock', 'Haan — fine-grained'],
          ['Locking', '—', 'Poore map pe ek lock', 'Poore map pe ek lock (mutex)', 'Java 8: khaali bucket pe CAS, warna sirf us bucket ke head pe synchronized; reads lock-free'],
          ['null key / value', '1 null key, many null values', 'Nahi (NPE)', 'Backing map jaisa', 'Nahi (NPE) — "absent" vs "null" ka confusion na ho'],
          ['Iteration', 'Fail-fast', 'Fail-fast (Enumeration nahi)', 'Fail-fast, iterate karte waqt <b>khud</b> synchronized block', 'Weakly consistent, no CME'],
          ['Atomic compound ops', 'Nahi', 'Nahi', 'Nahi', '<code>putIfAbsent</code>, <code>compute</code>, <code>merge</code> atomic'],
          ['Kab', 'Single thread / local', 'Legacy — mat use karo', 'Kam contention, kisi bhi Map ko jaldi safe banana', 'Multi-threaded cache / counters — default'],
        ] } },
        { code: MAPS },
        { pre: `Output:
HashMap null key ok: 1
Hashtable: NPE on null key
ConcurrentHashMap: NPE on null value
CHM merge count = 4000
synchronizedMap sum = 3` },
        { tip: '<code>if (!map.containsKey(k)) map.put(k, v);</code> — ConcurrentHashMap pe bhi ye <b>race</b> hai (do alag calls). Atomic chahiye toh <code>putIfAbsent</code> / <code>computeIfAbsent</code> / <code>merge</code>. Java 7 CHM segments (default 16) pe lock karta tha; Java 8 me segments hata diye.' },
      ] },
      { title: '📋 ArrayList vs LinkedList', blocks: [
        { table: { head: ['Operation', 'ArrayList', 'LinkedList'], rows: [
          ['<code>get(i)</code>', '<b>O(1)</b>', 'O(n) — chal ke jaana padta hai'],
          ['add at end', 'Amortized O(1) (full → 1.5x grow + copy)', 'O(1)'],
          ['add / remove at start', 'O(n) shift', '<b>O(1)</b>'],
          ['add / remove in middle', 'O(n) shift', 'O(1) <i>agar</i> iterator wahan hai; dhoondhna O(n)'],
          ['Memory', 'Compact array, cache-friendly', 'Har node pe prev + next + object header — 3-4x zyada'],
        ] } },
        { code: LISTS },
        { pre: `Output:
ArrayList get(2) = 30
[10, 15, 20, 30, 40]
[5, 10, 20, 30, 40, 50] first=5 last=50
[5, 10, 30, 50]
[0, 1, 2]
poll=0 now [1, 2]` },
        { p: 'Real life me LinkedList bahut kam jeetta hai: Big-O me "O(1) insert" dikhta hai, par position tak pahunchna O(n) hai aur pointer-chasing CPU cache ke liye bura hai. Queue / stack / deque chahiye toh <b>ArrayDeque</b> usually fast hai. LinkedList tab: jab already iterator ke saath chalte hue bahut saare beech ke inserts / removes karne hon, ya <code>List</code> + <code>Deque</code> dono interfaces ek hi object me chahiye (aur null elements bhi — ArrayDeque null allow nahi karta).' },
      ] },
      { title: '⚡ Fail-fast vs fail-safe iterators (ConcurrentModificationException)', blocks: [
        { p: 'ArrayList / HashMap me ek counter <code>modCount</code> hota hai — har <b>structural change</b> (add / remove, set nahi) pe badhta hai. Iterator banate waqt <code>expectedModCount</code> save hota hai; har <code>next()</code> pe compare — mismatch → <b>ConcurrentModificationException</b>. Ye single thread me bhi hota hai (for-each ke andar <code>list.remove</code>). Ye "best effort" check hai, guarantee nahi.' },
        { table: { head: ['', 'Fail-fast', 'Fail-safe / weakly consistent'], rows: [
          ['Kaun', 'ArrayList, HashMap, HashSet ke iterators', 'CopyOnWriteArrayList (snapshot), ConcurrentHashMap (weakly consistent)'],
          ['Iterate ke beech change', 'CME', 'No CME; COW purana snapshot dikhata hai, CHM naye changes dikha bhi sakta hai, nahi bhi'],
          ['Cost', 'Kuch nahi', 'COW: har write pe poora array copy — read-heavy lists ke liye hi'],
        ] } },
        { code: FAILFAST },
        { pre: `Output:
CME caught (fail-fast), list now [b, c]
iterator.remove: [a, c, d]
removeIf: [a, d]
CopyOnWrite: [x, y, x!, y!]
CHM size: 2` },
      ] },
      { title: '🌳 TreeMap ordering; Comparable vs Comparator', blocks: [
        { p: '<b>TreeMap</b> = red-black tree → keys hamesha <b>sorted</b>, get / put / remove <b>O(log n)</b>. Navigation methods milte hain: <code>firstKey</code>, <code>floorKey</code>, <code>ceilingKey</code>, <code>headMap</code>, <code>tailMap</code> — range queries, leaderboards, time-slot booking ke liye. Order ya toh key ka <b>Comparable</b> (natural order) ya constructor me diya <b>Comparator</b>.' },
        { table: { head: ['', 'Comparable', 'Comparator'], rows: [
          ['Kahan', 'Class ke andar: <code>compareTo(T o)</code>', 'Bahar alag object: <code>compare(a, b)</code>'],
          ['Kitne order', 'Ek (natural order)', 'Jitne chaho — salary, name, desc...'],
          ['Package', '<code>java.lang</code>', '<code>java.util</code>'],
          ['Example', 'String, Integer, LocalDate', '<code>Comparator.comparing(...).reversed().thenComparing(...)</code>'],
        ] } },
        { code: TREE },
        { pre: `Output:
{alpha=1, bravo=2, charlie=3, delta=4}
first=alpha ceiling(c)=charlie headMap(charlie)={alpha=1, bravo=2}
[Anil:40, Meena:70, Ravi:50, Zoya:50]
[Meena:70, Ravi:50, Zoya:50, Anil:40]
{Java=2}` },
        { tip: 'TreeMap key ki equality <b>compareTo / compare == 0</b> se decide karta hai, equals se nahi. Isliye comparator "consistent with equals" rakho — warna (jaise CASE_INSENSITIVE) do alag keys ek ban jaati hain. Natural ordering me <code>null</code> key → NPE. <code>compare</code> me <code>a - b</code> mat likho (overflow) — <code>Integer.compare(a, b)</code>.' },
      ] },
      { title: '🎤 Interview — planner ke 6 questions (English answers)', blocks: [
        { tip: 'Jahan "in my project" bolna ho (cache, counters, leaderboard), wahan <b>apne asli project</b> ka use-case daalo — ye examples sirf template hain.' },
        { qa: [
          ['How does HashMap work internally: hashing, buckets, collisions, treeification at 8?', 'HashMap is an array of buckets, 16 by default and always a power of two. On put it takes the key\'s hashCode, spreads it with <code>h ^ (h &gt;&gt;&gt; 16)</code> so the high bits matter, and computes the index as <code>hash &amp; (n - 1)</code>. If the bucket is empty it stores a new node; otherwise it walks the bucket comparing hash and then equals — a match replaces the value, else the node is appended at the tail. Different keys in the same bucket are collisions, stored as a linked list. Since Java 8, when one bucket reaches 8 nodes and the table has at least 64 slots, the bucket becomes a red-black tree, so the worst case goes from O(n) to O(log n); below 64 slots it resizes instead, and a tree shrinks back to a list at 6 nodes. That is why a correct and well-distributed hashCode and equals are essential.'],
          ['What happens on resize? What is the load factor and why 0.75?', 'When size exceeds capacity times load factor — 12 for the default 16 — HashMap allocates a table twice as large and moves every entry. In Java 8 it does not recompute indexes from scratch: for each node it checks one bit, <code>hash &amp; oldCapacity</code>; if zero the node stays at the same index, otherwise it moves to index plus old capacity, preserving order. Resize is O(n), so put is amortized O(1); if I know the size up front I pre-size the map. The load factor 0.75 is a trade-off between memory and collisions: higher saves memory but makes chains longer, lower wastes space. With 0.75 and a decent hash, the chance of a bucket reaching 8 entries is tiny, as the JDK documentation notes.'],
          ['HashMap vs Hashtable vs ConcurrentHashMap vs Collections.synchronizedMap.', 'HashMap is not thread-safe, allows one null key and null values, and is the default for single-threaded code. Hashtable is the legacy version where every method is synchronized on the whole table, and it rejects nulls — I would not use it in new code. Collections.synchronizedMap wraps any map with a single lock; it is simple but every operation contends on that lock, and I must synchronize manually while iterating. ConcurrentHashMap is built for concurrency: in Java 8 it uses CAS for empty buckets and locks only the head node of one bucket on writes, reads are lock-free, iterators are weakly consistent and never throw ConcurrentModificationException, and it offers atomic operations like <code>computeIfAbsent</code> and <code>merge</code>. It does not allow null keys or values. For shared caches or counters I use ConcurrentHashMap.'],
          ['ArrayList vs LinkedList: complexities and when you would actually pick LinkedList.', 'ArrayList is backed by an array: get by index is O(1), adding at the end is amortized O(1) with growth by about 1.5 times, and inserting or removing in the middle is O(n) because elements shift. LinkedList is a doubly linked list: get is O(n), adding or removing at either end is O(1), and inserting in the middle is O(1) only once you already hold an iterator at that position. In practice ArrayList wins almost always because it is compact and cache-friendly, while each LinkedList node has extra pointers and causes cache misses. For a queue or stack I prefer ArrayDeque. I would pick LinkedList only when I do many inserts or removals while iterating with a ListIterator, or need a deque that allows null elements.'],
          ['Fail-fast vs fail-safe iterators. What causes ConcurrentModificationException?', 'Fail-fast iterators, like those of ArrayList and HashMap, track a modCount. The iterator remembers the expected count, and if the collection is structurally modified other than through the iterator itself, the next call to <code>next()</code> throws ConcurrentModificationException. This happens even in a single thread, typically by calling <code>list.remove</code> inside a for-each loop; the fix is <code>iterator.remove()</code> or <code>removeIf</code>. Fail-safe, or weakly consistent, iterators come from concurrent collections: CopyOnWriteArrayList iterates over a snapshot, and ConcurrentHashMap iterates over the live structure without throwing, possibly reflecting some concurrent updates. The fail-fast check is best-effort, so it should not be relied on for correctness.'],
          ['TreeMap ordering; Comparable vs Comparator.', 'TreeMap is a red-black tree, so keys are always sorted and get, put and remove are O(log n). It also gives navigation methods like <code>floorKey</code>, <code>ceilingKey</code>, <code>headMap</code> and <code>tailMap</code>, which I would use for range queries such as finding the nearest time slot. The order comes either from the key\'s Comparable implementation — its natural order, defined once inside the class through compareTo — or from a Comparator passed to the constructor, which is external and lets me define many orders, for example by salary descending then by name. One subtlety: TreeMap treats keys as equal when compare returns 0, not when equals is true, so the comparator should be consistent with equals; and with natural ordering a null key throws NullPointerException.'],
        ] },
        { say: [
          ['Aise bolo — HashMap internals (45 sec)', 'A HashMap is an array of buckets. When I put a key, it takes the hashCode, mixes the high bits in, and uses hash and n minus one to pick the bucket. Inside the bucket it compares hashes and then equals, so it either replaces the value or appends a new node. Collisions form a list, and since Java 8 a bucket with eight or more nodes becomes a red-black tree once the table has at least sixty-four slots. When the size passes seventy-five percent of the capacity, the table doubles and each entry either stays or moves by the old capacity. So a good hashCode and equals keep it O(1) on average.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          '"HashMap worst case O(n) hai" — Java 8+ me treeified bucket se O(log n) (agar table ≥ 64).',
          '"Treeify sirf 8 pe hota hai" — capacity 64 se kam ho toh pehle resize hota hai.',
          'ConcurrentHashMap pe <code>containsKey</code> + <code>put</code> ko atomic samajhna — <code>putIfAbsent</code> / <code>compute</code> use karo.',
          'synchronizedMap ko bina <code>synchronized (map)</code> block ke iterate karna.',
          'LinkedList ko "insert fast hai" bol ke default banana — position dhoondhna O(n) hai.',
          'for-each ke andar <code>list.remove()</code> — CME (ya kabhi chupchaap ek element skip).',
          'HashMap key ko insert ke baad mutate karna.',
          'TreeMap me comparator jo equals se consistent nahi — keys merge ho jaati hain.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['<code>new HashMap&lt;&gt;()</code> me 13 entries daali. Kitni baar resize hua aur ab capacity kya hai?', '<b>1 baar</b>, capacity <b>32</b>. Threshold 12 tha; 13th entry ke baad double.'],
          ['<code>List&lt;String&gt; l = new ArrayList&lt;&gt;(List.of("a","b","c")); for (String s : l) if (s.equals("b")) l.remove(s);</code> — CME aayega?', '<b>Nahi!</b> "b" second-last hai: remove ke baad size 2, cursor 2 → <code>hasNext()</code> false, loop khatam bina <code>next()</code> ke. List = [a, c]. "a" remove karte toh CME. (Isliye ispe bharosa mat karo — removeIf use karo.)'],
          ['<code>map.put(null, 1)</code> — HashMap, Hashtable, ConcurrentHashMap me kya hoga?', 'HashMap: chalega (null key bucket 0 me). Hashtable aur ConcurrentHashMap: <b>NullPointerException</b>.'],
          ['<code>TreeMap&lt;String,Integer&gt;</code> me "b", "a", "c" daale. <code>tm.ceilingKey("bb")</code>?', '<b>"c"</b> — "bb" se bada ya barabar sabse chhota key. <code>floorKey("bb")</code> hota "b".'],
          ['10 keys, sabka <code>hashCode()</code> same, equals sahi. <code>map.size()</code> aur <code>get</code> kaam karega?', '<b>Haan</b>, size 10 aur get sahi value — bas sab ek bucket me (slow). Collision galat result nahi deta, sirf performance girata hai.'],
        ] },
      ] },
    ],
    checks: [
      'HashMap put ka poora flow (spread, index, equals, treeify 8/6/64, resize) 60 sec me bol sakta hoon',
      'Resize ka "stays ya +oldCap" rule aur 0.75 ka reason samjha sakta hoon',
      '4 maps ka comparison (locking, nulls, iteration) table bina dekhe bana sakta hoon',
      'CME kyun aata hai aur 2 sahi tareeke (iterator.remove, removeIf) — code likh sakta hoon',
    ],
    memory: 'hash ^ h>>>16, index = hash & (n-1); collision → list, 8 + cap 64 → tree, 6 → list; 0.75 pe double (stay ya +oldCap); CHM = CAS + bucket lock, no nulls; modCount ≠ expected → CME.',
    snippets: [
      { code: HM_INTERNAL, out: 'apple -> bucket 1\nbanana -> bucket 0\ncherry -> bucket 1\nsize=10 get(7)=v7\nsize=10 get(7)=new7' },
      { code: RESIZE, out: 'capacity 16 -> resize after 12 entries\ncapacity 32 -> resize after 24 entries\ncapacity 64 -> resize after 48 entries\nhash 5: 5 -> 5 (stays)\nhash 21: 5 -> 21 (moves +16)\nhash 37: 5 -> 5 (stays)\nhash 53: 5 -> 21 (moves +16)\nnew HashMap<>(134) for 100 entries' },
      { code: MAPS, out: 'HashMap null key ok: 1\nHashtable: NPE on null key\nConcurrentHashMap: NPE on null value\nCHM merge count = 4000\nsynchronizedMap sum = 3' },
      { code: LISTS, out: 'ArrayList get(2) = 30\n[10, 15, 20, 30, 40]\n[5, 10, 20, 30, 40, 50] first=5 last=50\n[5, 10, 30, 50]\n[0, 1, 2]\npoll=0 now [1, 2]' },
      { code: FAILFAST, out: 'CME caught (fail-fast), list now [b, c]\niterator.remove: [a, c, d]\nremoveIf: [a, d]\nCopyOnWrite: [x, y, x!, y!]\nCHM size: 2' },
      { code: TREE, out: '{alpha=1, bravo=2, charlie=3, delta=4}\nfirst=alpha ceiling(c)=charlie headMap(charlie)={alpha=1, bravo=2}\n[Anil:40, Meena:70, Ravi:50, Zoya:50]\n[Meena:70, Ravi:50, Zoya:50, Anil:40]\n{Java=2}' },
    ],
  };

  // =================================================================
  L.c4 = {
    kind: 'th', title: 'Java 8 functional: lambdas, streams, Optional', topic: 'Java',
    goal: 'Functional interfaces + lambdas, stream ke intermediate vs terminal operations aur laziness, map vs flatMap, <code>Collectors.groupingBy</code>, Optional ke sahi / galat use, parallel streams kab nuksaan karte hain — aur 2 classic "code it" questions (char frequency, 2nd highest salary). Planner ke <b>6 interview questions</b> ka English answer.',
    oneLine: 'Lambda = functional interface ka chhota implementation; stream = lazy pipeline jo terminal operation pe hi chalti hai; Optional sirf return type ke liye.',
    parts: [
      { title: 'λ Concept — Functional interface aur lambdas', blocks: [
        { p: '<b>Functional interface</b> = jisme <b>exactly ek abstract method</b> ho (default / static methods kitne bhi, aur <code>equals</code> jaise Object ke methods count nahi hote). Lambda ya method reference usi ek method ka implementation hai. <code>@FunctionalInterface</code> optional hai, par lagao — galti se doosra abstract method add kiya toh compile error.' },
        { table: { head: ['Interface (java.util.function)', 'Method', 'Shape', 'Typical use'], rows: [
          ['<code>Predicate&lt;T&gt;</code>', '<code>test</code>', 'T → boolean', '<code>filter</code>'],
          ['<code>Function&lt;T,R&gt;</code>', '<code>apply</code>', 'T → R', '<code>map</code>'],
          ['<code>Consumer&lt;T&gt;</code>', '<code>accept</code>', 'T → void', '<code>forEach</code>'],
          ['<code>Supplier&lt;T&gt;</code>', '<code>get</code>', '() → T', '<code>orElseGet</code>, factories'],
          ['<code>BiFunction&lt;T,U,R&gt;</code>', '<code>apply</code>', '(T, U) → R', '<code>merge</code>, <code>reduce</code>'],
          ['<code>UnaryOperator&lt;T&gt;</code> / <code>BinaryOperator&lt;T&gt;</code>', '<code>apply</code>', 'T → T / (T, T) → T', '<code>replaceAll</code>, <code>reduce</code>'],
        ] } },
        { code: FUNC },
        { pre: `Output:
true false
40
[x]
hello streams
5 OK 180.0` },
        { list: [
          'Purane functional interfaces bhi hain: <code>Runnable</code>, <code>Callable</code>, <code>Comparator</code>.',
          'Method reference 4 type: static (<code>Integer::sum</code>), kisi object ka (<code>System.out::println</code>), class ka instance method (<code>String::length</code>), constructor (<code>ArrayList::new</code>).',
          'Lambda ke andar local variable <b>effectively final</b> hona chahiye (c1 wala rule).',
          'Primitive versions (<code>IntPredicate</code>, <code>ToIntFunction</code>...) boxing se bachate hain.',
        ] },
      ] },
      { title: '🚰 Intermediate vs terminal operations; lazy evaluation', blocks: [
        { table: { head: ['', 'Intermediate', 'Terminal'], rows: [
          ['Return', 'Naya <code>Stream</code>', 'Result / side-effect (List, count, Optional, void)'],
          ['Chalta kab hai', '<b>Lazy</b> — sirf pipeline record hoti hai', 'Turant — poori pipeline ko trigger karta hai'],
          ['Examples', '<code>filter, map, flatMap, distinct, sorted, peek, limit, skip</code>', '<code>collect, forEach, reduce, count, findFirst, anyMatch, toList (16)</code>'],
          ['Special', 'Stateful: <code>sorted</code>, <code>distinct</code> (sab dekhna padta hai)', 'Short-circuit: <code>findFirst, anyMatch, limit</code> — jaldi ruk jaate hain'],
        ] } },
        { code: LAZY },
        { pre: `Output:
pipeline ready - nothing ran yet
filter 1
filter 2
map 2
result 4
[1, 2, 3]
stream reuse: IllegalStateException` },
        { p: 'Dekho: <b>terminal se pehle kuch print nahi hua</b>. Aur elements <b>ek-ek karke poori pipeline</b> se guzarte hain (filter 1, filter 2, map 2) — pehle sab filter, phir sab map nahi. findFirst ko pehla even mila toh 3, 4, 5, 6 kabhi process hi nahi hue. Yahi <b>lazy evaluation</b> hai: kam kaam, aur infinite streams (<code>Stream.iterate</code> + <code>limit</code>) bhi possible.' },
      ] },
      { title: '🔀 map vs flatMap + Collectors.groupingBy', blocks: [
        { table: { head: ['', 'map', 'flatMap'], rows: [
          ['Function', 'T → R', 'T → Stream&lt;R&gt;'],
          ['Har element se', 'Exactly 1 output', '0..n outputs, sab ek stream me <b>flatten</b>'],
          ['Example', '<code>List::size</code> → [2, 1, 0]', '<code>List::stream</code> → [a, b, c]'],
          ['Optional me', '<code>map</code> → value badlo', '<code>flatMap</code> → jab function khud Optional return kare'],
        ] } },
        { code: GROUP },
        { pre: `Output:
[2, 1, 0]
[a, b, c]
{Eng=3, HR=2, Sales=1}
{Eng=[Asha, Ravi, Isha], HR=[Neha, Om], Sales=[Kabir]}
{Eng=85.0, HR=62.5, Sales=70.0}` },
        { lines: [
          ['groupingBy(Employee::getDept, ...)', 'Classifier — har employee ka key (department)'],
          ['TreeMap::new', 'Map factory — default HashMap hai (order random), TreeMap se sorted, deterministic output'],
          ['Collectors.counting()', 'Downstream collector — har group ka count (Long)'],
          ['mapping(getName, toList())', 'Group ke andar transform + collect — names ki list'],
          ['averagingInt(getSalary)', 'Group ka average (Double). Aur bhi: summingInt, maxBy, partitioningBy'],
        ] },
      ] },
      { title: '📦 Optional — sahi use aur anti-patterns', blocks: [
        { p: '<code>Optional&lt;T&gt;</code> (Java 8) ek box hai jo <b>value ya kuch nahi</b> rakhta. Iska kaam: method ke <b>return type</b> me saaf batana "result ho bhi sakta hai, nahi bhi" — taaki caller null-check bhoole nahi.' },
        { table: { head: ['✅ Achha', '❌ Anti-pattern'], rows: [
          ['Return type: <code>Optional&lt;User&gt; findById(id)</code>', 'Field: <code>private Optional&lt;String&gt; email</code> — Serializable nahi, extra object, getter me Optional banao'],
          ['<code>map / flatMap / filter / orElse / orElseGet / orElseThrow</code> chain', '<code>opt.get()</code> bina check — empty pe <code>NoSuchElementException</code>, null jaisa hi crash'],
          ['<code>ifPresent(...)</code>, Java 9 <code>ifPresentOrElse</code>', '<code>if (opt.isPresent()) opt.get()</code> — null-check hi hai, naye kapdon me'],
          ['<code>orElseGet(() -&gt; expensive())</code> — lazy', '<code>orElse(expensive())</code> — value ho tab bhi expensive() chalta hai'],
          ['Empty collection return karo', '<code>Optional&lt;List&lt;X&gt;&gt;</code>, ya method parameter me Optional'],
          ['<code>Optional.ofNullable(maybeNull)</code>', '<code>Optional.of(null)</code> → NPE; ya Optional variable khud <code>null</code> return karna'],
        ] } },
        { code: OPT },
        { pre: `Output:
ASHA@MAIL.COM
no email
unknown user
found Asha
get() on empty: NoSuchElementException
user 3 not found
expensive called
xx` },
        { tip: 'Spring Data JPA ka <code>findById</code> isi wajah se <code>Optional</code> deta hai: <code>repo.findById(id).orElseThrow(() -&gt; new NotFoundException(id))</code> — ek line me 404. Java 10+ me bina argument <code>orElseThrow()</code> bhi hai (get() ka clear naam).' },
      ] },
      { title: '🐢 Parallel streams kab nuksaan karte hain', blocks: [
        { p: '<code>.parallel()</code> stream ko chunks me tod ke <b>ForkJoinPool.commonPool()</b> (default threads = CPU cores - 1) pe chalata hai, phir results merge karta hai. Ye <b>free speed-up nahi</b> — split + thread coordination + merge ka cost hai.' },
        { table: { head: ['Nuksaan kab', 'Kyun'], rows: [
          ['Chhota data / sasta kaam per element', 'Splitting + merging ka overhead kaam se zyada'],
          ['<code>LinkedList</code>, <code>Stream.iterate</code>, I/O source', 'Achhe se split nahi hote (ArrayList, arrays, <code>IntStream.range</code> achhe hain)'],
          ['Order-dependent ops: <code>findFirst, limit, sorted, forEachOrdered</code>', 'Order maintain karne ke liye threads ko coordinate karna padta hai'],
          ['Shared mutable state / <code>synchronized</code>', 'Race conditions (galat result) ya lock contention (serial se bhi slow)'],
          ['Blocking I/O (DB / HTTP calls) andar', 'Common pool sab parallel streams + CompletableFuture share karte hain — block karoge toh poori app slow'],
          ['Boxing (<code>Stream&lt;Integer&gt;</code> pe sum)', 'Objects + unboxing — <code>IntStream / LongStream</code> use karo'],
          ['Galat <code>reduce</code> identity / non-associative op', 'Result threads ke split pe depend — <code>reduce(10, Integer::sum)</code> parallel me 10 kai baar judta hai'],
        ] } },
        { code: PARALLEL },
        { pre: `Output:
parallel sum = 500000500000
collected = 1000 first=0 last=999
ordered = 01234` },
        { tip: 'Rule of thumb: bada data (lakhs+), CPU-heavy, stateless, splittable source, koi I/O nahi — tab parallel try karo, aur <b>measure</b> karo (JMH). Web server me request threads already parallel hain, wahan parallel stream rarely madad karta hai.' },
      ] },
      { title: '💻 Code it — character frequency + 2nd highest salary', blocks: [
        { code: CODEIT },
        { pre: `Output:
{a=1, g=2, i=1, m=2, n=1, o=1, p=1, r=2}
{p=1, r=2, o=1, g=2, a=1, m=2, i=1, n=1}
7000
no 2nd highest` },
        { lines: [
          ['s.chars()', '<code>IntStream</code> of char codes (int), isliye <code>mapToObj(c -&gt; (char) c)</code> se Character banao'],
          ['groupingBy(identity(), TreeMap::new, counting())', 'Har char hi key; TreeMap = sorted output, LinkedHashMap = pehli baar dikhne ka order'],
          ['distinct()', 'Duplicate salaries hatao — warna [9000, 9000, 7000] me 2nd = 9000 (galat)'],
          ['sorted(Comparator.reverseOrder()).skip(1).findFirst()', 'Descending, highest chhodo, agla lo — nahi hai toh <code>Optional.empty()</code>'],
          ['.map(String::valueOf).orElse(...)', '"No 2nd" case bina null / exception ke handle'],
        ] },
        { tip: 'Employee objects ho toh: <code>emps.stream().map(Employee::getSalary).distinct().sorted(Comparator.reverseOrder()).skip(1).findFirst()</code>. Bahut bada data ho toh sort O(n log n) ki jagah ek pass me top-2 track karna O(n) — interviewer ye follow-up puch sakta hai.' },
      ] },
      { title: '🎤 Interview — planner ke 6 questions (English answers)', blocks: [
        { tip: 'Employee / user examples sirf template hain — jahan "in my project" bolo, wahan <b>apne asli project</b> ka stream use-case (report, grouping, DTO mapping) daalo.' },
        { qa: [
          ['What is a functional interface? Name four from java.util.function.', 'A functional interface has exactly one abstract method; it can still have default and static methods, and methods inherited from Object do not count. Because there is a single abstract method, a lambda or method reference can implement it. The <code>@FunctionalInterface</code> annotation is optional but makes the compiler enforce the rule. From java.util.function: <code>Predicate</code> takes a value and returns a boolean, used in filter; <code>Function</code> maps T to R, used in map; <code>Consumer</code> takes a value and returns nothing, used in forEach; and <code>Supplier</code> takes nothing and returns a value, used in orElseGet. There are also BiFunction, UnaryOperator, BinaryOperator and primitive versions like IntPredicate to avoid boxing. Older ones like Runnable and Comparator are functional interfaces too.'],
          ['Intermediate vs terminal stream operations; what lazy evaluation means.', 'Intermediate operations such as filter, map, flatMap, sorted and distinct return a new stream and do no work by themselves; they only describe the pipeline. A terminal operation such as collect, forEach, reduce, count or findFirst actually runs it and produces a result, after which the stream cannot be reused. Lazy evaluation means elements are pulled through the whole pipeline one at a time only when the terminal operation asks for them. So with a filter, a map and findFirst, processing stops as soon as the first match is found, and the remaining elements are never touched. This also makes infinite streams with limit possible. Stateful operations like sorted are the exception: they must see all elements before passing anything on.'],
          ['map vs flatMap. Group employees by department and count them with Collectors.groupingBy.', 'map applies a one-to-one function, so each element produces exactly one result — for example a list of lists mapped by size gives a list of sizes. flatMap applies a function that returns a stream for each element and flattens all of them into one stream, so a list of lists becomes a single list of elements; on Optional, flatMap is used when the mapper itself returns an Optional. To count employees per department I write <code>employees.stream().collect(Collectors.groupingBy(Employee::getDept, Collectors.counting()))</code>, which returns a <code>Map&lt;String, Long&gt;</code>. If I need sorted keys I pass <code>TreeMap::new</code> as the map factory, and I can swap the downstream collector for mapping, averagingInt or summingInt.'],
          ['Optional: good uses and anti-patterns (Optional fields, get() without a check).', 'Optional was designed as a return type for methods that may not have a result, like <code>findById</code>, so the caller is forced to think about the empty case. Good use is chaining map, flatMap and filter and finishing with orElse, orElseGet or orElseThrow. Anti-patterns: calling <code>get()</code> without checking, which just turns a NullPointerException into a NoSuchElementException; writing <code>isPresent()</code> followed by <code>get()</code>, which is a null check in disguise; using Optional as a field, because it is not Serializable and adds an object per field — keep the field nullable and return Optional from the getter; using it as a method parameter or wrapping collections, where an empty collection is better; and <code>orElse(expensiveCall())</code>, which runs the call even when the value is present — orElseGet is lazy. Also, a method returning Optional must never return null.'],
          ['When do parallel streams hurt performance?', 'Parallel streams split the data and run on the shared ForkJoinPool common pool, which by default has one fewer thread than the number of cores, and then merge the results — that overhead must be paid back. They hurt when the data set is small or the per-element work is cheap; when the source splits badly, like a LinkedList, Stream.iterate or I/O; when the pipeline relies on order, such as findFirst, limit, sorted or forEachOrdered; when lambdas touch shared mutable state, which gives wrong results or lock contention; and when the work does blocking I/O, because it starves the common pool that the rest of the application also uses. Boxed streams add overhead too. I only use parallel for large, CPU-bound, stateless work on arrays or ranges, and I measure before keeping it.'],
          ['Code it: frequency of each character in a string, and the 2nd highest salary, using streams.', 'For character frequency I stream the characters and group them: <code>s.chars().mapToObj(c -&gt; (char) c).collect(Collectors.groupingBy(Function.identity(), LinkedHashMap::new, Collectors.counting()))</code>. That gives a <code>Map&lt;Character, Long&gt;</code>; LinkedHashMap keeps first-appearance order, and TreeMap would sort by character. For "programming" it shows r, g and m with count 2. For the second highest salary: <code>salaries.stream().distinct().sorted(Comparator.reverseOrder()).skip(1).findFirst()</code>. distinct matters, because otherwise two equal top salaries would return the top salary again, and the result is an Optional, so when there is no second distinct salary I handle it with orElse or orElseThrow instead of returning null. If performance matters on huge data, a single pass tracking the top two values is O(n) instead of O(n log n).'],
        ] },
        { say: [
          ['Aise bolo — streams laziness (45 sec)', 'A stream is a pipeline. Intermediate operations like filter and map only describe the work and return a new stream; nothing runs until a terminal operation like collect or findFirst is called. Then elements flow through the whole pipeline one by one, so if I filter, map and call findFirst on a million records, it stops at the first match instead of processing everything. In my project I used groupingBy with counting to build a per-department report in a single pass, and I avoid parallel streams for anything that calls a database, because they share the common fork-join pool.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          'Terminal operation bhool jaana — <code>list.stream().map(...)</code> likh ke sochna kuch chala.',
          'Stream ko do baar use karna — <code>IllegalStateException</code>.',
          'Lambda ke andar bahar ki <code>ArrayList</code> me <code>add</code> (side-effect) — <code>collect</code> use karo, khaas kar parallel me.',
          'groupingBy ka default HashMap — output order random; sorted chahiye toh <code>TreeMap::new</code>.',
          '<code>Collectors.toMap</code> me duplicate key → <code>IllegalStateException</code>; merge function (3rd argument) do.',
          '2nd highest me <code>distinct()</code> bhoolna; ya "nahi hai" case me null / exception.',
          '<code>Optional.get()</code> bina check, Optional fields / parameters, <code>orElse(expensive())</code>.',
          '<code>peek</code> ko logic ke liye use karna — wo debugging ke liye hai, aur kuch terminals pe chalta bhi nahi.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['<code>Stream.of(1,2,3).map(x -&gt; { System.out.println(x); return x; });</code> — kya print hoga?', '<b>Kuch nahi</b> — koi terminal operation nahi, pipeline kabhi chali hi nahi.'],
          ['<code>Stream.of(1,2,3,4).filter(x -&gt; x &gt; 1).map(x -&gt; x * 2).findFirst()</code> — filter kitni baar chala?', '<b>2 baar</b> (1 aur 2). 2 pass hua → map → findFirst ne Optional[4] le liya, 3 aur 4 untouched.'],
          ['<code>Optional.of("a").orElse(log())</code> — <code>log()</code> chalega?', '<b>Haan</b> — orElse ka argument pehle evaluate hota hai. <code>orElseGet(() -&gt; log())</code> me nahi chalta.'],
          ['<code>List.of(5, 5, 3).stream().sorted(Comparator.reverseOrder()).skip(1).findFirst()</code>?', '<b>Optional[5]</b> — distinct nahi lagaya, isliye "2nd highest" galat aaya. Sahi: distinct ke baad Optional[3].'],
          ['<code>Stream.of("a","bb","cc").collect(Collectors.toMap(String::length, s -&gt; s))</code>?', '<b>IllegalStateException</b> (duplicate key 2). Fix: <code>toMap(String::length, s -&gt; s, (x, y) -&gt; x + y)</code>.'],
        ] },
      ] },
    ],
    checks: [
      'Functional interface ki definition + 4 java.util.function interfaces shape ke saath bata sakta hoon',
      'Laziness ka filter/map/findFirst print example samjha sakta hoon',
      'groupingBy + counting aur char frequency / 2nd highest salary bina dekhe likh sakta hoon',
      'Optional ke 3 anti-patterns aur parallel streams ke 4 nuksaan wale cases bol sakta hoon',
    ],
    memory: 'Ek abstract method = functional interface; intermediate lazy, terminal trigger (ek baar); map 1→1, flatMap 1→n flatten; groupingBy(key, TreeMap::new, counting()); Optional sirf return type, get() bina check nahi; parallel = bada + CPU + stateless + no I/O.',
    snippets: [
      { code: FUNC, out: 'true false\n40\n[x]\nhello streams\n5 OK 180.0' },
      { code: LAZY, out: 'pipeline ready - nothing ran yet\nfilter 1\nfilter 2\nmap 2\nresult 4\n[1, 2, 3]\nstream reuse: IllegalStateException' },
      { code: GROUP, out: '[2, 1, 0]\n[a, b, c]\n{Eng=3, HR=2, Sales=1}\n{Eng=[Asha, Ravi, Isha], HR=[Neha, Om], Sales=[Kabir]}\n{Eng=85.0, HR=62.5, Sales=70.0}' },
      { code: OPT, out: 'ASHA@MAIL.COM\nno email\nunknown user\nfound Asha\nget() on empty: NoSuchElementException\nuser 3 not found\nexpensive called\nxx' },
      { code: PARALLEL, out: 'parallel sum = 500000500000\ncollected = 1000 first=0 last=999\nordered = 01234' },
      { code: CODEIT, out: '{a=1, g=2, i=1, m=2, n=1, o=1, p=1, r=2}\n{p=1, r=2, o=1, g=2, a=1, m=2, i=1, n=1}\n7000\nno 2nd highest' },
    ],
  };
})();
