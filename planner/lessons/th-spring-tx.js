// Planner lessons — Spring theory (c12 Transactions with @Transactional)
// Theory format: concept Hinglish me → har planner interview question ka English answer (qa) → code + output → traps → self-test.
// NOTE: validator plain javac chalata hai (Spring / database classpath pe NAHI). Isliye har runnable `code` block plain Java me
//       concept simulate karta hai (JDK dynamic proxy, mini transaction manager, MVCC sim, outbox sim), aur asli Spring code `pre` blocks me hai.
// snippets: validate-lessons.js --java inhe compile + run karke output match karta hai.
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});

  // ======================= c12 — code examples (plain Java) =======================
  const PROXY = `import java.lang.annotation.*;
import java.lang.reflect.*;

@Retention(RetentionPolicy.RUNTIME)
@interface Tx {}                                          // apna @Transactional (Spring classpath pe nahi)

interface OrderService {
    void placeOrder(String item);
    void placeAll(List<String> items);
}

class OrderServiceImpl implements OrderService {
    @Tx public void placeOrder(String item) {
        System.out.println("  insert order " + item);
        if (item.equals("bad")) throw new IllegalStateException("out of stock");
    }
    public void placeAll(List<String> items) {            // @Tx nahi
        for (String item : items) placeOrder(item);       // this.placeOrder() — proxy nahi, seedha object
    }
}

class TxInterceptor implements InvocationHandler {        // Spring ka TransactionInterceptor jaisa
    private final Object target;
    TxInterceptor(Object target) { this.target = target; }
    public Object invoke(Object proxy, Method m, Object[] args) throws Throwable {
        Method impl = target.getClass().getMethod(m.getName(), m.getParameterTypes());
        if (!impl.isAnnotationPresent(Tx.class)) {
            System.out.println("(no tx) " + m.getName());
            return m.invoke(target, args);
        }
        System.out.println("BEGIN " + m.getName());
        try {
            Object result = m.invoke(target, args);       // asli object ka method
            System.out.println("COMMIT " + m.getName());
            return result;
        } catch (InvocationTargetException e) {
            System.out.println("ROLLBACK " + m.getName() + " (" + e.getCause().getMessage() + ")");
            throw e.getCause();
        }
    }
}

public class Main {
    public static void main(String[] args) {
        OrderService target = new OrderServiceImpl();
        OrderService proxy = (OrderService) Proxy.newProxyInstance(
            OrderService.class.getClassLoader(), new Class<?>[] { OrderService.class }, new TxInterceptor(target));
        System.out.println("bean is a proxy: " + Proxy.isProxyClass(proxy.getClass()));

        System.out.println("1) controller -> proxy.placeOrder");
        proxy.placeOrder("book");

        System.out.println("2) failing call through proxy");
        try {
            proxy.placeOrder("bad");
        } catch (IllegalStateException e) {
            System.out.println("caller got: " + e.getMessage());
        }

        System.out.println("3) self-invocation: proxy.placeAll -> this.placeOrder");
        proxy.placeAll(List.of("pen", "ink"));
    }
}`;

  const PROP = `class Tx {
    final int id;
    final List<String> writes = new ArrayList<>();
    boolean rollbackOnly;
    Tx(int id) { this.id = id; }
}

class TxManager {                                          // PlatformTransactionManager ka chhota version
    private final Deque<Tx> stack = new ArrayDeque<>();    // Spring me ye ThreadLocal hota hai (current thread ka tx)
    private int seq = 0;
    final List<String> db = new ArrayList<>();             // committed rows

    void write(String row) { stack.peek().writes.add(row); }

    void required(String method, Runnable body) {
        Tx cur = stack.peek();
        if (cur == null) { runInNewTx(method, body); return; }
        System.out.println(method + ": REQUIRED -> joins tx" + cur.id);
        try {
            body.run();
        } catch (RuntimeException e) {
            cur.rollbackOnly = true;                       // participant fail → poora tx rollback-only
            System.out.println(method + ": failed, tx" + cur.id + " marked rollback-only");
            throw e;
        }
    }

    void requiresNew(String method, Runnable body) {
        Tx outer = stack.peek();
        if (outer != null) System.out.println(method + ": REQUIRES_NEW -> suspend tx" + outer.id);
        try {
            runInNewTx(method, body);
        } finally {
            if (outer != null) System.out.println(method + ": resume tx" + outer.id);
        }
    }

    void nested(String method, Runnable body) {
        Tx cur = stack.peek();
        int savepoint = cur.writes.size();
        System.out.println(method + ": NESTED -> savepoint in tx" + cur.id);
        try {
            body.run();
        } catch (RuntimeException e) {
            cur.writes.subList(savepoint, cur.writes.size()).clear();
            System.out.println(method + ": rollback to savepoint, tx" + cur.id + " still alive");
            throw e;
        }
    }

    private void runInNewTx(String method, Runnable body) {
        Tx tx = new Tx(++seq);
        stack.push(tx);
        System.out.println(method + ": BEGIN tx" + tx.id);
        try {
            body.run();
        } catch (RuntimeException e) {
            stack.pop();
            System.out.println(method + ": ROLLBACK tx" + tx.id + " " + tx.writes);
            throw e;
        }
        stack.pop();
        if (tx.rollbackOnly) {
            System.out.println(method + ": ROLLBACK tx" + tx.id + " " + tx.writes + " (was rollback-only)");
            throw new IllegalStateException("UnexpectedRollbackException");
        }
        db.addAll(tx.writes);
        System.out.println(method + ": COMMIT tx" + tx.id + " " + tx.writes);
    }
}

public class Main {
    static void run(String title, TxManager tm, Runnable r) {
        System.out.println("--- " + title);
        try {
            r.run();
        } catch (RuntimeException e) {
            System.out.println("caller got " + e.getMessage());
        }
        System.out.println("db = " + tm.db);
    }

    public static void main(String[] args) {
        TxManager a = new TxManager();
        run("A: audit REQUIRES_NEW, then order fails", a, () -> a.required("placeOrder", () -> {
            a.write("order#1");
            a.requiresNew("audit", () -> a.write("audit#1"));
            throw new RuntimeException("payment declined");
        }));

        TxManager b = new TxManager();
        run("B: loyalty REQUIRED fails, caller catches", b, () -> b.required("placeOrder", () -> {
            b.write("order#2");
            try {
                b.required("addPoints", () -> { b.write("points#2"); throw new RuntimeException("loyalty down"); });
            } catch (RuntimeException e) {
                System.out.println("placeOrder: caught '" + e.getMessage() + "', continuing");
            }
        }));

        TxManager c = new TxManager();
        run("C: loyalty NESTED fails, caller catches", c, () -> c.required("placeOrder", () -> {
            c.write("order#3");
            try {
                c.nested("addPoints", () -> { c.write("points#3"); throw new RuntimeException("loyalty down"); });
            } catch (RuntimeException e) {
                System.out.println("placeOrder: caught '" + e.getMessage() + "', continuing");
            }
        }));
    }
}`;

  const ISO = `enum Level { READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ }

class Row {                                                // ek row ki committed versions (MVCC jaisa)
    final TreeMap<Integer, Integer> versions = new TreeMap<>();   // commitTime -> value
    Integer uncommitted;                                   // kisi doosre tx ka abhi-commit-nahi-hua write
}

class Db {
    int clock = 0;
    final Row balance = new Row();
    final TreeMap<Integer, Integer> orderRows = new TreeMap<>();  // orderId -> commitTime (phantom demo)
    Db() { balance.versions.put(0, 100); orderRows.put(1, 0); orderRows.put(2, 0); }

    int read(Level lvl, int snapshot) {
        if (lvl == Level.READ_UNCOMMITTED && balance.uncommitted != null) return balance.uncommitted;
        if (lvl == Level.REPEATABLE_READ) return balance.versions.floorEntry(snapshot).getValue();
        return balance.versions.lastEntry().getValue();    // READ_COMMITTED: latest committed
    }
    long countOrders(Level lvl, int snapshot) {
        return orderRows.values().stream().filter(t -> lvl != Level.REPEATABLE_READ || t <= snapshot).count();
    }
}

public class Main {
    public static void main(String[] args) {
        for (Level lvl : Level.values()) {
            Db db = new Db();
            int snap = db.clock;                           // T1 shuru: snapshot time

            db.balance.uncommitted = 50;                   // T2: UPDATE balance = 50 (commit nahi)
            int dirty = db.read(lvl, snap);                // T1 read #1
            db.balance.uncommitted = null;                 // T2: ROLLBACK

            int first = db.read(lvl, snap);                // T1 read #2
            db.balance.versions.put(++db.clock, 70);       // T2: UPDATE balance = 70; COMMIT
            int second = db.read(lvl, snap);               // T1 read #3

            long before = db.countOrders(lvl, snap);       // T1: SELECT COUNT(*) FROM orders
            db.orderRows.put(3, ++db.clock);               // T2: INSERT order 3; COMMIT
            long after = db.countOrders(lvl, snap);        // T1: same COUNT again

            System.out.printf("%-16s dirty=%-3s (%d)  reread=%-3s (%d->%d)  phantom=%-3s (%d->%d)%n", lvl,
                dirty == 50 ? "YES" : "no", dirty,
                first != second ? "YES" : "no", first, second,
                before != after ? "YES" : "no", before, after);
        }
    }
}`;

  const ROLLBACK = `import java.io.IOException;

interface TxBody { void run() throws Exception; }

class TxAttribute {                                        // @Transactional(rollbackFor = ..., noRollbackFor = ...)
    final List<Class<?>> rollbackFor;
    final List<Class<?>> noRollbackFor;
    TxAttribute(List<Class<?>> rollbackFor, List<Class<?>> noRollbackFor) {
        this.rollbackFor = rollbackFor;
        this.noRollbackFor = noRollbackFor;
    }
    static int depth(Class<?> ex, Class<?> rule) {         // ex se rule tak kitni superclass seedhi
        int d = 0;
        for (Class<?> c = ex; c != null; c = c.getSuperclass(), d++) if (c == rule) return d;
        return -1;
    }
    boolean rollbackOn(Throwable ex) {
        int best = Integer.MAX_VALUE;
        Boolean decision = null;                           // sabse closest (specific) rule jeetta hai
        for (Class<?> r : rollbackFor) {
            int d = depth(ex.getClass(), r);
            if (d >= 0 && d < best) { best = d; decision = true; }
        }
        for (Class<?> r : noRollbackFor) {
            int d = depth(ex.getClass(), r);
            if (d >= 0 && d < best) { best = d; decision = false; }
        }
        if (decision != null) return decision;
        return ex instanceof RuntimeException || ex instanceof Error;   // default rule
    }
}

public class Main {
    static void call(String label, TxAttribute attr, TxBody body) {
        try {
            body.run();
            System.out.println(label + " -> COMMIT");
        } catch (Exception e) {
            String what = attr.rollbackOn(e) ? "ROLLBACK" : "COMMIT";
            System.out.println(label + " -> " + what + " (" + e.getClass().getSimpleName() + " thrown)");
        }
    }

    public static void main(String[] args) {
        TxAttribute plain = new TxAttribute(List.of(), List.of());
        TxAttribute rbException = new TxAttribute(List.of(Exception.class), List.of());
        TxAttribute noRbIllegalArg = new TxAttribute(List.of(), List.of(IllegalArgumentException.class));

        call("1. unchecked, default        ", plain, () -> { throw new IllegalStateException("stock"); });
        call("2. checked, default          ", plain, () -> { throw new IOException("file"); });
        call("3. checked, rollbackFor=Exception", rbException, () -> { throw new IOException("file"); });
        call("4. noRollbackFor=IllegalArg  ", noRbIllegalArg, () -> { throw new IllegalArgumentException("bad"); });
        call("5. swallowed inside method   ", plain, () -> {
            try { throw new IllegalStateException("stock"); } catch (IllegalStateException e) { /* log only */ }
        });
    }
}`;

  const VISIBILITY = `class TxContext { static boolean active = false; }        // TransactionSynchronizationManager jaisa flag

class PaymentService {
    public void pay() { System.out.println("  pay:    tx active = " + TxContext.active); }
    void refund() { System.out.println("  refund: tx active = " + TxContext.active); }        // package-private
    public final void settle() { System.out.println("  settle: tx active = " + TxContext.active); }   // final
    private void audit() { System.out.println("  audit:  tx active = " + TxContext.active); }   // private
    public void payWithAudit() { audit(); }               // private method sirf andar se call ho sakta
}

class PaymentServiceCglibProxy extends PaymentService {  // Spring CGLIB jaisa: subclass + override
    private void inTx(String method, Runnable body) {
        System.out.println("BEGIN " + method);
        TxContext.active = true;
        try { body.run(); } finally { TxContext.active = false; }
        System.out.println("COMMIT " + method);
    }
    @Override public void pay() { inTx("pay", super::pay); }
    @Override void refund() { inTx("refund", super::refund); }   // Spring 6+: class proxy pe package-private OK
    // settle(): final → override ho hi nahi sakta → proxy chupchaap skip
    // audit():  private → subclass ko dikhta hi nahi
}

public class Main {
    public static void main(String[] args) {
        PaymentService bean = new PaymentServiceCglibProxy();
        bean.pay();
        bean.refund();
        bean.settle();
        bean.payWithAudit();                              // payWithAudit pe @Transactional nahi → audit bhi bina tx
    }
}`;

  const OUTBOX = `class OutboxEvent {
    final int id;
    final String type;
    final String orderId;
    boolean sent;
    OutboxEvent(int id, String type, String orderId) { this.id = id; this.type = type; this.orderId = orderId; }
    public String toString() { return "#" + id + " " + type + "(" + orderId + ")"; }
}

class OrderService {                                       // order DB: orders + outbox table, EK local transaction
    final Map<String, String> orders = new TreeMap<>();
    final List<OutboxEvent> outbox = new ArrayList<>();
    private int seq = 0;

    void placeOrder(String orderId) {                      // @Transactional: dono insert ya koi nahi
        orders.put(orderId, "PENDING");
        outbox.add(new OutboxEvent(++seq, "OrderCreated", orderId));
        System.out.println("order-svc: COMMIT order " + orderId + " + outbox " + outbox.get(outbox.size() - 1));
    }
    void onPaymentResult(String orderId, boolean ok) {     // saga: success → confirm, fail → compensate
        orders.put(orderId, ok ? "CONFIRMED" : "CANCELLED");
        System.out.println("order-svc: " + orderId + " -> " + orders.get(orderId));
    }
}

class Relay {                                              // outbox poller (ya Debezium CDC)
    void poll(OrderService svc, List<OutboxEvent> broker, boolean crashBeforeMarkSent) {
        for (OutboxEvent e : svc.outbox) {
            if (e.sent) continue;
            broker.add(e);
            System.out.println("relay: published " + e);
            if (crashBeforeMarkSent) { System.out.println("relay: CRASH before marking sent"); return; }
            e.sent = true;
        }
    }
}

class PaymentService {                                     // consumer: idempotent (processed ids yaad)
    private final Set<Integer> processed = new HashSet<>();
    private final Set<String> failingOrders;
    PaymentService(Set<String> failingOrders) { this.failingOrders = failingOrders; }

    void consume(List<OutboxEvent> broker, OrderService orderSvc) {
        for (OutboxEvent e : broker) {
            if (!processed.add(e.id)) { System.out.println("payment-svc: duplicate " + e + " ignored"); continue; }
            boolean ok = !failingOrders.contains(e.orderId);
            System.out.println("payment-svc: charge " + e.orderId + (ok ? " OK" : " FAILED"));
            orderSvc.onPaymentResult(e.orderId, ok);       // PaymentSucceeded / PaymentFailed event
        }
        broker.clear();
    }
}

public class Main {
    public static void main(String[] args) {
        OrderService orders = new OrderService();
        Relay relay = new Relay();
        PaymentService payments = new PaymentService(Set.of("O2"));
        List<OutboxEvent> broker = new ArrayList<>();

        orders.placeOrder("O1");
        relay.poll(orders, broker, true);                  // publish hua, par sent=true save nahi hua
        relay.poll(orders, broker, false);                 // restart: wahi event dobara (at-least-once)
        payments.consume(broker, orders);

        orders.placeOrder("O2");
        relay.poll(orders, broker, false);
        payments.consume(broker, orders);
        System.out.println("final orders = " + orders.orders);
    }
}`;

  const PROXY_OUT = `bean is a proxy: true
1) controller -> proxy.placeOrder
BEGIN placeOrder
  insert order book
COMMIT placeOrder
2) failing call through proxy
BEGIN placeOrder
  insert order bad
ROLLBACK placeOrder (out of stock)
caller got: out of stock
3) self-invocation: proxy.placeAll -> this.placeOrder
(no tx) placeAll
  insert order pen
  insert order ink`;

  const PROP_OUT = `--- A: audit REQUIRES_NEW, then order fails
placeOrder: BEGIN tx1
audit: REQUIRES_NEW -> suspend tx1
audit: BEGIN tx2
audit: COMMIT tx2 [audit#1]
audit: resume tx1
placeOrder: ROLLBACK tx1 [order#1]
caller got payment declined
db = [audit#1]
--- B: loyalty REQUIRED fails, caller catches
placeOrder: BEGIN tx1
addPoints: REQUIRED -> joins tx1
addPoints: failed, tx1 marked rollback-only
placeOrder: caught 'loyalty down', continuing
placeOrder: ROLLBACK tx1 [order#2, points#2] (was rollback-only)
caller got UnexpectedRollbackException
db = []
--- C: loyalty NESTED fails, caller catches
placeOrder: BEGIN tx1
addPoints: NESTED -> savepoint in tx1
addPoints: rollback to savepoint, tx1 still alive
placeOrder: caught 'loyalty down', continuing
placeOrder: COMMIT tx1 [order#3]
db = [order#3]`;

  const ISO_OUT = `READ_UNCOMMITTED dirty=YES (50)  reread=YES (100->70)  phantom=YES (2->3)
READ_COMMITTED   dirty=no  (100)  reread=YES (100->70)  phantom=YES (2->3)
REPEATABLE_READ  dirty=no  (100)  reread=no  (100->100)  phantom=no  (2->2)`;

  const ROLLBACK_OUT = `1. unchecked, default         -> ROLLBACK (IllegalStateException thrown)
2. checked, default           -> COMMIT (IOException thrown)
3. checked, rollbackFor=Exception -> ROLLBACK (IOException thrown)
4. noRollbackFor=IllegalArg   -> COMMIT (IllegalArgumentException thrown)
5. swallowed inside method    -> COMMIT`;

  const VISIBILITY_OUT = `BEGIN pay
  pay:    tx active = true
COMMIT pay
BEGIN refund
  refund: tx active = true
COMMIT refund
  settle: tx active = false
  audit:  tx active = false`;

  const OUTBOX_OUT = `order-svc: COMMIT order O1 + outbox #1 OrderCreated(O1)
relay: published #1 OrderCreated(O1)
relay: CRASH before marking sent
relay: published #1 OrderCreated(O1)
payment-svc: charge O1 OK
order-svc: O1 -> CONFIRMED
payment-svc: duplicate #1 OrderCreated(O1) ignored
order-svc: COMMIT order O2 + outbox #2 OrderCreated(O2)
relay: published #2 OrderCreated(O2)
payment-svc: charge O2 FAILED
order-svc: O2 -> CANCELLED
final orders = {O1=CONFIRMED, O2=CANCELLED}`;

  // =================================================================
  L.c12 = {
    kind: 'th', title: 'Transactions with @Transactional', topic: 'Spring',
    goal: '<code>@Transactional</code> andar se kaise kaam karta hai (<b>AOP proxy</b>, self-invocation trap), <b>propagation</b> (REQUIRED / REQUIRES_NEW / NESTED + UnexpectedRollbackException), <b>isolation levels</b> aur anomalies, <b>rollback rules</b> (checked vs unchecked, rollbackFor), <code>readOnly</code> + private / final methods, aur services ke beech <b>distributed transaction ki jagah saga + outbox</b> — har concept plain Java simulation + output se, asli Spring code bhi, aur planner ke <b>6 interview questions</b> ka 30–60 sec English answer.',
    oneLine: '@Transactional = proxy jo method ke aage BEGIN aur peeche COMMIT/ROLLBACK lagata hai; proxy ke bahar se call aaye tabhi kaam karta hai (this.method() = no tx); default rollback sirf RuntimeException/Error pe; services ke beech 2PC nahi, local tx + outbox + saga.',
    parts: [
      { title: '🧩 Concept — @Transactional proxy kaise kaam karta hai (aur self-invocation kyun skip hota hai)', blocks: [
        { p: 'c11 me JPA dekha — <code>save()</code>, dirty checking, flush. Par "kab commit, kab rollback" ye decide karta hai <b>transaction manager</b>, aur <code>@Transactional</code> uska declarative switch hai. c8 me padha tha: <b>BeanPostProcessor ke after-init step</b> me Spring bean ko <b>proxy</b> me wrap karta hai. Context me tumhari class ka object nahi, <b>proxy</b> rakha jaata hai. Controller jab <code>orderService.placeOrder()</code> call karta hai toh call pehle proxy pe aati hai → <code>TransactionInterceptor</code> transaction <b>begin</b> karta hai (connection lo, <code>autoCommit=false</code>, ThreadLocal me bind) → asli method → success pe <b>commit</b>, exception pe rule dekh ke <b>rollback</b>.' },
        { p: '<b>Self-invocation</b>: asli object ke andar <code>placeAll()</code> ne <code>placeOrder()</code> call kiya — ye <code>this.placeOrder()</code> hai, aur <code>this</code> = asli object, proxy nahi. Interceptor beech me aaya hi nahi → <b>koi transaction nahi</b> (ya jo bahar ka tha wahi, naye attributes ignore). Proxy sirf <b>bahar se aane wali</b> calls pakadta hai.' },
        { table: { head: ['', 'JDK dynamic proxy', 'CGLIB (class-based) proxy'], rows: [
          ['Kaise banta', '<code>java.lang.reflect.Proxy</code> — interface implement karta hai', 'Runtime pe tumhari class ka <b>subclass</b>, methods override'],
          ['Kab', 'Bean interface implement kare aur <code>proxyTargetClass=false</code>', '<b>Spring Boot default</b> (<code>spring.aop.proxy-target-class=true</code>), ya interface na ho'],
          ['Kya intercept hota', 'Sirf interface ke methods', 'Override ho sakne wale methods (final / private nahi)'],
          ['Self-invocation', 'Bypass', 'Bypass — dono me <code>this</code> asli object hai'],
        ] } },
        { p: 'Neeche apna mini <code>@Tx</code> + JDK proxy hai — bilkul Spring jaisa: interceptor annotation dekhta hai, BEGIN / COMMIT / ROLLBACK print karta hai.' },
        { code: PROXY },
        { pre: 'Output:\n' + PROXY_OUT },
        { p: 'Case 3 dekho: <code>placeAll</code> pe annotation nahi → "(no tx)". Andar <code>placeOrder</code> do baar chala par <b>BEGIN ek baar bhi nahi</b> — kyunki wo call proxy se nahi, <code>this</code> se gayi. Real app me ye matlab: "pen" insert ho gaya, "ink" fail hua toh pen <b>rollback nahi hoga</b> (auto-commit).' },
        { pre: `@Service
public class OrderService {
    private final OrderRepository repo;
    private final OrderService self;                     // fix 2: apna proxy inject (sirf zaroorat ho tab)

    public OrderService(OrderRepository repo, @Lazy OrderService self) {
        this.repo = repo;
        this.self = self;
    }

    public void placeAll(List<String> items) {
        for (String item : items) placeOrder(item);      // BUG: this.placeOrder() → @Transactional ignore
        for (String item : items) self.placeOrder(item); // proxy se call → har item apne tx me
    }

    @Transactional
    public void placeOrder(String item) { repo.save(new Order(item)); }
}

// fix 1 (best): transactional method ko ALAG bean me rakho (OrderWriter.placeOrder), OrderService use inject kare
// fix 3: programmatic — TransactionTemplate
@Service
public class BatchService {
    private final TransactionTemplate tx;
    public BatchService(PlatformTransactionManager tm) { this.tx = new TransactionTemplate(tm); }
    public void importAll(List<String> items) {
        for (String item : items) tx.executeWithoutResult(status -> repo.save(new Order(item)));
    }
}` },
        { tip: 'Spring Boot me <code>@EnableTransactionManagement</code> likhna zaroori nahi — auto-configuration karta hai. Debug karna ho toh <code>logging.level.org.springframework.transaction.interceptor=TRACE</code> → har "Getting transaction for [...]" / "Completing transaction" log dikhega. Bina log ke tum maan rahe ho ki tx hai — bahut log galat nikalte hain.' },
      ] },
      { title: '🔀 Propagation — REQUIRED vs REQUIRES_NEW vs NESTED', blocks: [
        { p: '<b>Propagation</b> ye batata hai: jab ek transactional method doosre transactional method ko (proxy ke through!) call kare, toh doosra <b>purane tx me join</b> kare, <b>naya</b> khole, ya kuch aur.' },
        { table: { head: ['Propagation', 'Tx already hai', 'Tx nahi hai', 'Real use'], rows: [
          ['<b>REQUIRED</b> (default)', '<b>Join</b> — same tx, same connection', 'Naya kholo', '95% service methods'],
          ['<b>REQUIRES_NEW</b>', 'Outer ko <b>suspend</b>, bilkul naya tx (naya connection); independent commit / rollback', 'Naya kholo', 'Audit log / failure record jo order rollback hone pe bhi bache'],
          ['<b>NESTED</b>', 'Same tx ke andar <b>savepoint</b>; inner fail → sirf savepoint tak rollback', 'REQUIRED jaisa', 'Optional step (loyalty points) — fail ho toh bhi order chale'],
          ['SUPPORTS', 'Join', 'Bina tx chalao', 'Read helpers'],
          ['NOT_SUPPORTED', 'Suspend, bina tx chalao', 'Bina tx', 'Lamba non-DB kaam'],
          ['MANDATORY', 'Join', '<b>Exception</b>', 'Guard: "mujhe hamesha tx ke andar bulao"'],
          ['NEVER', '<b>Exception</b>', 'Bina tx', 'Rare'],
        ] } },
        { p: 'Teen scenarios simulate karte hain. <b>B dhyan se dekho</b> — ye sabse popular interview trap hai: inner REQUIRED method fail hua, outer ne exception <b>catch</b> kar liya aur aage badh gaya, phir bhi commit pe <b>UnexpectedRollbackException</b>. Kyun? Inner aur outer <b>ek hi physical transaction</b> share karte hain; inner ke interceptor ne exception dekhte hi poore tx ko <b>rollback-only</b> mark kar diya. Catch karne se wo mark nahi hatta.' },
        { code: PROP },
        { pre: 'Output:\n' + PROP_OUT },
        { pre: `@Service
public class OrderService {
    private final AuditService audit;
    private final LoyaltyService loyalty;

    @Transactional                                         // REQUIRED
    public void placeOrder(Order o) {
        orderRepo.save(o);
        audit.record("ORDER_ATTEMPT", o.getId());          // REQUIRES_NEW → order fail ho toh bhi audit bachega
        try {
            loyalty.addPoints(o);                          // NESTED → fail ho toh sirf points ka kaam rollback
        } catch (LoyaltyException e) {
            log.warn("points skipped", e);
        }
    }
}

@Service
public class AuditService {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String type, Long id) { auditRepo.save(new AuditEntry(type, id)); }
}

@Service
public class LoyaltyService {
    @Transactional(propagation = Propagation.NESTED)       // JDBC savepoint chahiye
    public void addPoints(Order o) { ... }
}` },
        { list: [
          '<b>REQUIRES_NEW = doosra DB connection</b>. Outer ka connection suspend hai par pool se chhoota nahi. Pool 10 ka hai aur 10 requests ek saath REQUIRES_NEW tak pahunchi → sab naya connection maang rahe, koi free nahi → <b>pool deadlock</b>. Aur inner tx outer ki uncommitted rows nahi dekh sakta (alag tx) — same row update kiya toh lock wait / deadlock.',
          '<b>NESTED</b> JDBC savepoints pe chalta hai — <code>DataSourceTransactionManager</code> (JdbcTemplate) me supported. <code>JpaTransactionManager</code> me <code>nestedTransactionAllowed</code> default false hai (savepoint sirf JDBC connection pe lagta, Hibernate ke cached entities pe nahi) — JPA ke saath NESTED pe bharosa mat karo.',
          'Propagation tabhi lagta hai jab call <b>proxy ke through</b> ho — same class ke andar <code>this.audit()</code> pe REQUIRES_NEW <b>ignore</b> (pichhla part).',
        ] },
      ] },
      { title: '🔒 Isolation levels — dirty, non-repeatable, phantom reads', blocks: [
        { p: '<b>Isolation</b> = ek transaction doosre ke <b>beech ke</b> (adhoore / naye) changes kitna dekh sakta hai. Jitni strict isolation, utne kam anomalies, par utni zyada locking / aborts → kam throughput.' },
        { table: { head: ['Anomaly', 'Kya hota hai (T1 padh raha, T2 likh raha)'], rows: [
          ['<b>Dirty read</b>', 'T1 ne T2 ka <b>uncommitted</b> data padha; T2 rollback ho gaya → T1 ne aisa data dekha jo kabhi exist hi nahi kiya'],
          ['<b>Non-repeatable read</b>', 'T1 ne row padhi (100), T2 ne update + commit kiya (70), T1 ne <b>wahi row</b> dobara padhi → value badal gayi'],
          ['<b>Phantom read</b>', 'T1 ne <code>WHERE</code> se rows gini (2), T2 ne nayi matching row insert + commit ki, T1 ne same query chalayi → 3 rows (nayi "phantom" row)'],
        ] } },
        { table: { head: ['Level', 'Dirty', 'Non-repeatable', 'Phantom', 'Default kahan'], rows: [
          ['READ_UNCOMMITTED', 'Possible', 'Possible', 'Possible', '— (PostgreSQL ise READ COMMITTED treat karta hai)'],
          ['<b>READ_COMMITTED</b>', 'Prevented', 'Possible', 'Possible', '<b>PostgreSQL, Oracle, SQL Server</b>'],
          ['<b>REPEATABLE_READ</b>', 'Prevented', 'Prevented', 'Possible (SQL standard)*', '<b>MySQL InnoDB</b>'],
          ['SERIALIZABLE', 'Prevented', 'Prevented', 'Prevented', '— (sabse slow; PostgreSQL me serialization failure → retry)'],
        ] } },
        { p: '* SQL standard REPEATABLE READ me phantoms allowed hain, par <b>MVCC databases</b> me ye snapshot se ruk jaate hain: PostgreSQL REPEATABLE READ poore tx ke liye ek snapshot use karta hai (phantom nahi dikhta); MySQL InnoDB ke plain (consistent) reads bhi snapshot se padhte hain, aur locking reads (<code>SELECT ... FOR UPDATE</code>) <b>next-key / gap locks</b> se phantom insert rokte hain. Neeche ka simulation MVCC jaisa hai — har level pe teeno anomalies try karta hai:' },
        { code: ISO },
        { pre: 'Output:\n' + ISO_OUT },
        { pre: `@Transactional(isolation = Isolation.READ_COMMITTED)      // DEFAULT = jo DB ka default hai
public Report monthlyReport() { ... }

@Transactional(isolation = Isolation.REPEATABLE_READ)      // ek tx me do baar padha, same chahiye (consistent report)
public void reconcile() { ... }

// Lost update (do log same row padh ke overwrite karein) isolation se nahi, LOCKING se rokte hain (c11):
@Entity class Account { @Version private long version; }  // optimistic — commit pe OptimisticLockException
@Lock(LockModeType.PESSIMISTIC_WRITE)                       // pessimistic — SELECT ... FOR UPDATE
Optional<Account> findById(Long id);` },
        { tip: 'Isolation (aur timeout, readOnly) sirf tab apply hota hai jab <b>naya</b> transaction shuru ho. REQUIRED se join karne wale inner method pe <code>isolation = SERIALIZABLE</code> likha toh wo chupchaap ignore hota hai — outer ka level chalta hai.' },
      ] },
      { title: '↩️ Rollback rules — checked vs unchecked, rollbackFor', blocks: [
        { p: 'Spring ka <b>default</b>: <code>RuntimeException</code> ya <code>Error</code> → <b>rollback</b>. <b>Checked exception</b> (<code>IOException</code>, custom <code>extends Exception</code>) → <b>commit</b>! Logic ye tha ki checked exception ek "expected business outcome" hai jise caller handle karega (EJB convention se aaya). Interview me sabse zyada log yahin phaste hain.' },
        { table: { head: ['Situation', 'Result'], rows: [
          ['<code>throw new IllegalStateException()</code> (unchecked)', '<b>ROLLBACK</b>'],
          ['<code>throw new IOException()</code> (checked), default', '<b>COMMIT</b> — data save ho gaya, caller ko exception mila'],
          ['Checked + <code>rollbackFor = Exception.class</code>', '<b>ROLLBACK</b>'],
          ['Unchecked + <code>noRollbackFor = X.class</code>', 'COMMIT'],
          ['Exception method ke <b>andar</b> catch karke log kiya', 'COMMIT — proxy ko exception dikha hi nahi'],
          ['Rules me conflict', 'Exception class ke sabse <b>nazdeek</b> (most specific) rule jeetta hai'],
        ] } },
        { code: ROLLBACK },
        { pre: 'Output:\n' + ROLLBACK_OUT },
        { pre: `@Transactional(rollbackFor = Exception.class)             // checked pe bhi rollback — team convention
public void importFile(Path p) throws IOException { ... }

@Transactional(noRollbackFor = DuplicateEmailException.class)
public void register(User u) { ... }

@Transactional
public void transfer(...) {
    try {
        ...
    } catch (InsufficientFundsException e) {
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();   // catch kiya, phir bhi rollback
        throw new TransferFailed(e);   // ya simply rethrow as unchecked
    }
}

// Spring Framework 6.2+: global switch
@EnableTransactionManagement(rollbackOn = RollbackOn.ALL_EXCEPTIONS)` },
        { tip: 'Best practice: business exceptions ko <b>unchecked</b> rakho (<code>extends RuntimeException</code>) — default rule hi sahi kaam karega. Checked exceptions use karne pade toh class / team level pe <code>rollbackFor = Exception.class</code>.' },
      ] },
      { title: '📖 readOnly = true, aur private / final methods', blocks: [
        { table: { head: ['Layer', '<code>readOnly = true</code> kya badalta hai'], rows: [
          ['Hibernate / JPA', 'Session read-only + <code>FlushMode.MANUAL</code> → <b>dirty checking nahi</b>, entities ke snapshots nahi rakhe jaate → kam memory, fast. Galti se entity badli toh bhi flush / UPDATE nahi hoga'],
          ['JDBC', '<code>Connection.setReadOnly(true)</code> — driver ko hint; PostgreSQL me <code>SET TRANSACTION READ ONLY</code> → write karne pe DB error'],
          ['Routing', '<code>AbstractRoutingDataSource</code> + <code>TransactionSynchronizationManager.isCurrentTransactionReadOnly()</code> se <b>read replica</b> pe bhejna'],
          ['Kya nahi', 'Security guarantee nahi; join karne wala inner method pe lagaya toh ignore (sirf naye tx pe); bina DB wale method pe koi fayda nahi'],
        ] } },
        { p: '<b>Private methods</b>: proxy ya toh interface implement karta hai ya subclass banata hai — <b>private method override ho hi nahi sakta</b>, aur private method ko koi bahar se call bhi nahi kar sakta (jo hamesha self-invocation hai). Isliye private pe <code>@Transactional</code> <b>kaam nahi karta</b> (aur Spring koi error bhi nahi deta). <b>final</b> methods bhi CGLIB override nahi kar sakta → silently no tx. Spring 6.0+ me class-based proxies pe <b>protected aur package-private</b> methods supported hain; interface-based (JDK) proxy pe sirf interface ke public methods. Private pe bhi chahiye toh sirf <b>AspectJ weaving</b> (<code>mode = AdviceMode.ASPECTJ</code>).' },
        { code: VISIBILITY },
        { pre: 'Output:\n' + VISIBILITY_OUT },
        { pre: `@Service
@Transactional(readOnly = true)                  // class level default: saare methods read-only
public class ProductService {

    public Page<Product> search(String q, Pageable p) { ... }   // read-only tx

    @Transactional                               // method level override: write tx
    public Product create(ProductRequest r) { ... }

    @Transactional
    private void helper() { ... }                // KAAM NAHI KARTA — private, proxy pakad nahi sakta

    @Transactional
    public final void settle() { ... }           // KAAM NAHI KARTA — CGLIB final override nahi kar sakta
}` },
        { tip: 'Real CGLIB me final method ka ek aur nuksaan: wo <b>proxy object</b> pe chalta hai jiske fields inject hi nahi hue → andar <code>repo.save()</code> pe <b>NullPointerException</b>. "Repository null kyun hai?" — final method check karo.' },
      ] },
      { title: '🌐 Services ke beech transaction — 2PC kyun nahi, saga + outbox', blocks: [
        { p: '<code>@Transactional</code> <b>ek database, ek service</b> ke andar hi atomic hai. Order service (orders DB) aur payment service (payments DB) ko ek saath commit karna ho toh classic jawab hai <b>2PC / XA</b> (JTA transaction manager: prepare phase → sab "yes" → commit phase). Microservices me isse bachte hain:' },
        { list: [
          '<b>Blocking + coordinator SPOF</b>: prepare ke baad coordinator crash → participants locks pakad ke "in-doubt" khade rehte hain.',
          '<b>Latency aur throughput</b>: har tx me extra network round trips, locks zyada der tak.',
          '<b>Availability</b>: koi ek service / DB down → poora operation fail (CAP: hum availability chahte hain).',
          '<b>Support nahi</b>: Kafka, most NoSQL stores, HTTP APIs XA participate nahi karte. Har service ka apna DB (database-per-service) bhi isi ke against hai.',
        ] },
        { table: { head: ['Pattern', 'Idea', 'Dhyan rakho'], rows: [
          ['<b>Saga</b>', 'Bade operation ko <b>local transactions ki chain</b> me todo; har step event publish kare. Koi step fail → pichhle steps ke <b>compensating actions</b> (refund, cancel order)', 'Eventual consistency; compensation idempotent ho; beech ki states (PENDING) dikhti hain'],
          ['Choreography', 'Har service events sunke khud next step karti hai', 'Simple, par flow kahin ek jagah dikhta nahi'],
          ['Orchestration', 'Ek orchestrator (state machine) har step ko command bhejta hai', 'Flow clear, orchestrator ek extra component'],
          ['<b>Transactional outbox</b>', 'Business row + event row <b>same local tx</b> me (outbox table). Relay (poller / Debezium CDC) outbox padh ke broker pe publish karta hai', '"DB me save hua par event gaya nahi" (dual write) problem khatam; delivery <b>at-least-once</b> → consumer <b>idempotent</b>'],
        ] } },
        { p: 'Simulation: order + outbox ek tx me; relay publish karke "sent" mark karne se pehle crash → restart pe wahi event dobara; payment service <b>event id</b> yaad rakhti hai toh duplicate ignore. O2 ka payment fail → saga ka <b>compensation</b>: order CANCELLED.' },
        { code: OUTBOX },
        { pre: 'Output:\n' + OUTBOX_OUT },
        { pre: `@Transactional
public Order placeOrder(OrderRequest r) {
    Order o = orderRepo.save(new Order(r, Status.PENDING));
    outboxRepo.save(new OutboxEvent("OrderCreated", o.getId(), toJson(o)));   // SAME tx — dono ya koi nahi
    return o;
}

// BAD: dual write — commit ho gaya par send fail (ya send ho gaya par tx rollback)
@Transactional
public Order placeOrderBad(OrderRequest r) {
    Order o = orderRepo.save(...);
    kafkaTemplate.send("orders", toJson(o));     // DB tx ka hissa nahi
    return o;
}

// Side effect commit ke BAAD chahiye (email, cache evict) — same service ke andar:
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void onOrderCreated(OrderCreated e) { emailClient.send(...); }` },
        { tip: 'Ye topic sd7 (Distributed transactions and consistency) aur c21 (Kafka) me aur deep jayega. Abhi interview line yaad rakho: <b>"Local transaction per service, outbox for reliable events, saga with compensations for the business flow, idempotent consumers."</b>' },
      ] },
      { title: '🎤 Interview — planner ke 6 questions (English answers)', blocks: [
        { tip: 'Answers me <b>order / audit / loyalty / payment</b> wale examples sirf template hain — interview se pehle inhe <b>apne asli project</b> ke flows se badal lo (kaunsa method REQUIRES_NEW tha, kahan self-invocation bug mila, services ke beech consistency kaise sambhali). Interviewer follow-up wahi se puchega.' },
        { qa: [
          ['How does @Transactional work? Why does self-invocation skip the transaction?', 'Spring wraps the bean in an AOP proxy during bean post-processing — a CGLIB subclass by default in Spring Boot, or a JDK dynamic proxy for interfaces — and puts the proxy in the context. When a caller invokes a transactional method, the call reaches the proxy first; the <code>TransactionInterceptor</code> asks the transaction manager to begin or join a transaction, binds the connection to the current thread, calls the real method, and then commits, or rolls back according to the rollback rules. Self-invocation means one method calls another method of the same object through <code>this</code>. <code>this</code> is the target object, not the proxy, so the interceptor never runs and the annotation on the inner method is ignored. The fixes are to move the method into a separate bean, inject the bean\'s own proxy lazily, use <code>TransactionTemplate</code>, or use AspectJ weaving.'],
          ['Propagation: REQUIRED vs REQUIRES_NEW vs NESTED, with a real example.', '<code>REQUIRED</code>, the default, joins the existing transaction or starts one if there is none, so all the work commits or rolls back together. A trap: if an inner REQUIRED method throws, the shared transaction is marked rollback-only, and even if the caller catches the exception, the commit fails with <code>UnexpectedRollbackException</code>. <code>REQUIRES_NEW</code> suspends the outer transaction and runs in a completely independent one on a separate connection. I use it for an audit or failure log that must survive even when the order transaction rolls back; the cost is an extra connection per call, which can exhaust the pool. <code>NESTED</code> runs inside the same transaction but sets a JDBC savepoint, so if the inner part fails only the work after the savepoint is undone — for example optional loyalty points while the order itself still commits. If the outer rolls back, the nested work rolls back too. NESTED needs savepoint support, which DataSourceTransactionManager has, but not JPA by default.'],
          ['Isolation levels and the anomalies they prevent (dirty, non-repeatable, phantom reads).', 'A dirty read is reading another transaction\'s uncommitted data. A non-repeatable read is reading the same row twice and getting different values because another transaction committed an update in between. A phantom read is running the same range query twice and getting new rows because another transaction inserted and committed. READ UNCOMMITTED allows all three. READ COMMITTED prevents dirty reads; it is the default in PostgreSQL, Oracle and SQL Server. REPEATABLE READ also prevents non-repeatable reads; it is the MySQL InnoDB default, and in MVCC databases the snapshot usually hides phantoms as well. SERIALIZABLE prevents all three but costs the most locking or retries. In Spring I set it with <code>@Transactional(isolation = ...)</code>, and it only applies when a new transaction starts. Lost updates I handle with optimistic locking using <code>@Version</code>, or a pessimistic lock.'],
          ['Rollback rules: checked vs unchecked exceptions; rollbackFor.', 'By default Spring rolls back only on unchecked exceptions — <code>RuntimeException</code> and <code>Error</code>. A checked exception commits the transaction, even though the caller receives the exception, which surprises many people. To change that I use <code>rollbackFor = Exception.class</code>, or a specific checked type, and <code>noRollbackFor</code> for the opposite case; the most specific matching rule wins. Also, if I catch an exception inside the transactional method and do not rethrow it, the proxy never sees it and the transaction commits; in that case I rethrow or call <code>setRollbackOnly()</code>. In practice I make business exceptions unchecked so the default rule is correct.'],
          ['What does readOnly = true change? Does @Transactional work on private methods?', '<code>readOnly = true</code> is an optimization hint. With Hibernate, Spring sets the session to read-only and flush mode to manual, so there is no dirty checking and no snapshot copies of loaded entities, which saves memory and CPU; accidental changes are not flushed. It also calls <code>setReadOnly</code> on the JDBC connection, which some databases enforce — PostgreSQL rejects writes — and a routing data source can use the flag to send the query to a read replica. It is not a security feature, and it is ignored on a method that joins an existing transaction. On private methods, no: the proxy cannot override or intercept a private method, and private methods are only ever called through <code>this</code>, so the annotation is silently ignored. The same is true for final methods with CGLIB. Since Spring 6, protected and package-private methods work with class-based proxies; for private methods you would need AspectJ weaving.'],
          ['Why avoid distributed transactions across services, and what do you use instead?', 'Two-phase commit across services couples them tightly: participants hold locks while waiting for the coordinator, a coordinator failure leaves transactions in doubt, every operation pays extra round trips, and one unavailable service blocks the whole flow. Many technologies, like Kafka, most NoSQL stores and HTTP APIs, cannot take part in XA at all. Instead each service commits its own local transaction, and we coordinate with a saga: a sequence of local steps driven by events or an orchestrator, where a failure triggers compensating actions such as refunding a payment or cancelling the order. To publish events reliably I use the transactional outbox: the business row and an outbox row are written in the same local transaction, and a relay or CDC tool publishes the outbox to the broker. Delivery is at least once, so consumers are idempotent, for example by storing processed event IDs.'],
        ] },
        { say: [
          ['Aise bolo — @Transactional apne project se (45 sec)', 'In our order service, the service methods are annotated with @Transactional and use the default REQUIRED propagation, so saving the order and its items happens in one database transaction. Our business exceptions extend RuntimeException, so they roll back automatically. We once had a bug where a batch method called a transactional method on the same class, so no transaction was applied; we fixed it by moving that method into a separate bean. Audit records use REQUIRES_NEW so they survive a rollback. Across services we do not use distributed transactions; we write an outbox row in the same transaction and publish it to Kafka, and consumers are idempotent.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          'Same class ke andar <code>this.method()</code> se transactional method call karna — proxy bypass, koi tx nahi.',
          'Checked exception throw karke rollback expect karna — default me <b>commit</b> hota hai; <code>rollbackFor</code> lagao.',
          'Transactional method ke andar exception catch karke sirf log karna — commit ho jaata hai.',
          'Inner REQUIRED method ka exception catch karke sochna ki outer commit hoga — <code>UnexpectedRollbackException</code>.',
          '<code>@Transactional</code> private / final method pe — silently ignore.',
          'REQUIRES_NEW har jagah — har call ek extra connection; load pe pool exhaust / deadlock.',
          'JPA ke saath NESTED pe bharosa — savepoint Hibernate ke persistence context ko rollback nahi karta.',
          'Transaction ke andar HTTP call / Kafka send / lamba kaam — connection aur locks der tak pakde rehte hain; aur dual-write problem.',
          'Inner joined method pe isolation / readOnly / timeout set karna — sirf naye tx pe lagta hai.',
          'Services ke beech consistency ke liye 2PC suggest karna bina trade-offs ke — saga + outbox bolo.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['<code>@Transactional</code> method <code>save()</code> ne row insert ki, phir <code>throw new Exception("x")</code> (checked). Row DB me rahegi?', '<b>Haan</b> — checked exception pe default <b>commit</b>. Rollback chahiye toh <code>rollbackFor = Exception.class</code>.'],
          ['<code>placeOrder()</code> (REQUIRED) ne <code>audit()</code> (REQUIRES_NEW, alag bean) call kiya, phir <code>placeOrder</code> ne RuntimeException throw kiya. DB me kya bacha?', 'Sirf <b>audit row</b> — audit ka tx alag commit ho chuka tha; order rollback.'],
          ['Upar wala hi, par <code>audit()</code> <b>same class</b> me hai (<code>this.audit()</code>). Ab?', '<b>Kuch nahi</b> — self-invocation, REQUIRES_NEW ignore; audit outer tx ka hissa bana aur saath me rollback ho gaya.'],
          ['Outer REQUIRED ne inner REQUIRED (alag bean) ka RuntimeException catch kiya aur return kiya. Kya hoga?', 'Commit ke waqt <b>UnexpectedRollbackException</b> — shared tx rollback-only mark ho chuka tha; kuch save nahi hua.'],
          ['MySQL InnoDB default isolation, T1 ne balance padha (100), T2 ne 70 karke commit kiya, T1 ne dobara padha (plain SELECT). Value?', '<b>100</b> — REPEATABLE READ snapshot. PostgreSQL default (READ COMMITTED) pe <b>70</b> aata.'],
        ] },
      ] },
    ],
    checks: [
      '@Transactional proxy flow (BEGIN → method → COMMIT/ROLLBACK) aur self-invocation ke 3 fixes bol sakta hoon',
      'REQUIRED vs REQUIRES_NEW vs NESTED + UnexpectedRollbackException wala trap example ke saath samjha sakta hoon',
      'Teen anomalies, 4 isolation levels aur MySQL / PostgreSQL defaults yaad hain',
      'Checked vs unchecked rollback rule, readOnly ka asar, private/final methods, aur saga + outbox 45 sec me bol sakta hoon',
    ],
    memory: 'Proxy BEGIN/COMMIT lagata hai, this.method() = no tx; REQUIRED join (inner fail = rollback-only), REQUIRES_NEW alag tx + alag connection, NESTED savepoint; dirty/non-repeatable/phantom → RC/RR/SERIALIZABLE (PG=RC, MySQL=RR); rollback default sirf unchecked, checked = commit → rollbackFor; readOnly = no dirty checking; private/final = ignore; services ke beech 2PC nahi → local tx + outbox + saga + idempotent consumer.',
    snippets: [
      { code: PROXY, out: PROXY_OUT },
      { code: PROP, out: PROP_OUT },
      { code: ISO, out: ISO_OUT },
      { code: ROLLBACK, out: ROLLBACK_OUT },
      { code: VISIBILITY, out: VISIBILITY_OUT },
      { code: OUTBOX, out: OUTBOX_OUT },
    ],
  };
})();
