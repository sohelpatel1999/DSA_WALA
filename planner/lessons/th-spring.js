// Planner lessons — Spring theory (c8 Spring core: IoC, DI and beans)
// Theory format: concept Hinglish me → har planner interview question ka English answer (qa) → code + output → traps → self-test.
// NOTE: validator plain javac chalata hai (Spring classpath pe NAHI). Isliye har runnable `code` block plain Java me
//       concept simulate karta hai (mini container), aur asli Spring annotations `pre` blocks me dikhaye gaye hain.
// snippets: validate-lessons.js --java inhe compile + run karke output match karta hai.
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});

  // ======================= c8 — code examples (plain Java) =======================
  const DI = `interface PaymentGateway { String charge(int amount); }
class RealGateway implements PaymentGateway { public String charge(int amount) { return "real charged " + amount; } }
class FakeGateway implements PaymentGateway { public String charge(int amount) { return "fake charged " + amount; } }

class OrderService {                                     // constructor injection
    private final PaymentGateway gateway;                // final: immutable, hamesha set
    OrderService(PaymentGateway gateway) { this.gateway = Objects.requireNonNull(gateway); }
    String placeOrder(int amount) { return "order ok, " + gateway.charge(amount); }
}

class LegacyOrderService {                               // field injection jaisa (@Autowired field)
    PaymentGateway gateway;                              // final nahi; container baad me reflection se set karta
    String placeOrder(int amount) { return "order ok, " + gateway.charge(amount); }
}

class MiniContainer {                                    // IoC: object banana + wire karna container ka kaam
    private final Map<Class<?>, Object> beans = new LinkedHashMap<>();
    <T> void register(Class<T> type, T bean) { beans.put(type, bean); }
    <T> T getBean(Class<T> type) { return type.cast(beans.get(type)); }
}

public class Main {
    public static void main(String[] args) {
        MiniContainer ctx = new MiniContainer();
        ctx.register(PaymentGateway.class, new RealGateway());
        ctx.register(OrderService.class, new OrderService(ctx.getBean(PaymentGateway.class)));   // container ne wire kiya
        System.out.println(ctx.getBean(OrderService.class).placeOrder(500));

        System.out.println(new OrderService(new FakeGateway()).placeOrder(10));   // unit test: container ki zaroorat nahi
        try {
            new LegacyOrderService().placeOrder(10);                              // test me field set karna bhool gaye
        } catch (NullPointerException e) {
            System.out.println("field injection without container: NPE");
        }
        try {
            new OrderService(null);
        } catch (NullPointerException e) {
            System.out.println("constructor injection: fails fast at creation");
        }
    }
}`;

  const SCOPE = `import java.util.function.*;

class Cart {                                              // prototype bean: har user ka apna cart
    static int created = 0;
    final int id = ++created;
}

class MiniContainer {
    private final Map<String, Supplier<Object>> defs = new LinkedHashMap<>();
    private final Set<String> prototypes = new HashSet<>();
    private final Map<String, Object> singletons = new HashMap<>();
    void singleton(String name, Supplier<Object> def) { defs.put(name, def); }
    void prototype(String name, Supplier<Object> def) { defs.put(name, def); prototypes.add(name); }
    Object getBean(String name) {
        if (prototypes.contains(name)) return defs.get(name).get();   // prototype: har baar naya
        Object bean = singletons.get(name);                           // singleton: ek baar bana, cache
        if (bean == null) {
            bean = defs.get(name).get();
            singletons.put(name, bean);
        }
        return bean;
    }
}

class CheckoutWrong {                                     // singleton me prototype seedha inject
    private final Cart cart;
    CheckoutWrong(Cart cart) { this.cart = cart; }
    int cartId() { return cart.id; }
}

class CheckoutRight {                                     // ObjectProvider<Cart> / @Lookup jaisa
    private final Supplier<Cart> carts;
    CheckoutRight(Supplier<Cart> carts) { this.carts = carts; }
    int cartId() { return carts.get().id; }               // har call pe container se naya maango
}

public class Main {
    public static void main(String[] args) {
        MiniContainer ctx = new MiniContainer();
        ctx.prototype("cart", Cart::new);
        ctx.singleton("wrong", () -> new CheckoutWrong((Cart) ctx.getBean("cart")));
        ctx.singleton("right", () -> new CheckoutRight(() -> (Cart) ctx.getBean("cart")));

        System.out.println("singleton same object: " + (ctx.getBean("wrong") == ctx.getBean("wrong")));
        CheckoutWrong w = (CheckoutWrong) ctx.getBean("wrong");
        System.out.println("prototype injected once: cart " + w.cartId() + ", cart " + w.cartId());
        CheckoutRight r = (CheckoutRight) ctx.getBean("right");
        System.out.println("provider per call:      cart " + r.cartId() + ", cart " + r.cartId());
        System.out.println("carts created = " + Cart.created);
    }
}`;

  const LIFE = `import java.util.function.*;

interface BeanPostProcessor {                             // Spring ka hook: HAR bean ke init ke aage-peeche
    default Object before(Object bean, String name) { return bean; }
    default Object after(Object bean, String name) { return bean; }
}

interface Lifecycle {                                     // @PostConstruct / @PreDestroy ka stand-in
    void postConstruct();
    void preDestroy();
}

class CacheService implements Lifecycle {
    private final String repo;
    private final Map<String, String> cache = new TreeMap<>();
    CacheService(String repo) {
        this.repo = repo;
        System.out.println("1. constructor + dependency: " + repo);
    }
    public void postConstruct() {                         // dependencies ready → ab warm-up safe
        cache.put("country", "IN");
        System.out.println("3. @PostConstruct: cache warmed " + cache);
    }
    public void preDestroy() {
        cache.clear();
        System.out.println("6. @PreDestroy: cache cleared");
    }
    String get(String key) { return cache.get(key); }
}

class TimingBpp implements BeanPostProcessor {
    public Object before(Object bean, String name) {
        System.out.println("2. BPP before-init: " + name);
        return bean;
    }
    public Object after(Object bean, String name) {
        System.out.println("4. BPP after-init: " + name + " (AOP proxy yahin wrap hota)");
        return bean;                                      // yahan proxy return kar sakte the
    }
}

class MiniContext {
    private final List<BeanPostProcessor> bpps = new ArrayList<>();
    private final Deque<Lifecycle> created = new ArrayDeque<>();
    void addBpp(BeanPostProcessor p) { bpps.add(p); }
    Object createBean(String name, Supplier<Object> ctor) {
        Object bean = ctor.get();                                       // instantiate + inject
        for (BeanPostProcessor p : bpps) bean = p.before(bean, name);
        if (bean instanceof Lifecycle l) {                              // init callback
            l.postConstruct();
            created.push(l);
        }
        for (BeanPostProcessor p : bpps) bean = p.after(bean, name);
        return bean;
    }
    void close() { while (!created.isEmpty()) created.pop().preDestroy(); }   // reverse order me destroy
}

public class Main {
    public static void main(String[] args) {
        MiniContext ctx = new MiniContext();
        ctx.addBpp(new TimingBpp());
        CacheService cache = (CacheService) ctx.createBean("cacheService", () -> new CacheService("countryRepo"));
        System.out.println("5. ready, get(country) = " + cache.get("country"));
        ctx.close();
    }
}`;

  const PROXY = `class DataSource {
    static int created = 0;
    final int id = ++created;
}

class AppConfig {                                         // @Configuration(proxyBeanMethods = false) — "lite" mode
    DataSource dataSource() { return new DataSource(); }
    String userRepo() { return "userRepo->ds" + dataSource().id; }     // inter-bean method call
    String orderRepo() { return "orderRepo->ds" + dataSource().id; }
}

class AppConfigCglibProxy extends AppConfig {             // proxyBeanMethods = true (default): Spring ka CGLIB subclass
    private final Map<String, Object> singletons = new HashMap<>();
    @Override DataSource dataSource() {                   // @Bean method intercept → container se singleton
        Object ds = singletons.get("dataSource");
        if (ds == null) {
            ds = super.dataSource();
            singletons.put("dataSource", ds);
        }
        return (DataSource) ds;
    }
}

public class Main {
    public static void main(String[] args) {
        AppConfig lite = new AppConfig();
        System.out.println("proxyBeanMethods=false: " + lite.userRepo() + ", " + lite.orderRepo());
        AppConfig full = new AppConfigCglibProxy();
        System.out.println("proxyBeanMethods=true:  " + full.userRepo() + ", " + full.orderRepo());
        System.out.println("DataSource objects created = " + DataSource.created);
    }
}`;

  const QUAL = `interface Notifier { String send(String msg); }
class EmailNotifier implements Notifier { public String send(String m) { return "email: " + m; } }
class SmsNotifier implements Notifier { public String send(String m) { return "sms: " + m; } }

class Candidate {
    final String name;
    final Notifier bean;
    final boolean primary;
    Candidate(String name, Notifier bean, boolean primary) { this.name = name; this.bean = bean; this.primary = primary; }
}

class MiniContainer {
    private final List<Candidate> beans = new ArrayList<>();
    void register(String name, Notifier bean, boolean primary) { beans.add(new Candidate(name, bean, primary)); }
    Notifier resolve(String qualifier) {                              // null = sirf type se inject
        if (qualifier != null) {                                      // 1. @Qualifier sabse pehle
            for (Candidate c : beans) if (c.name.equals(qualifier)) return c.bean;
            throw new IllegalStateException("NoSuchBeanDefinitionException: " + qualifier);
        }
        if (beans.size() == 1) return beans.get(0).bean;              // 2. ek hi candidate
        List<Candidate> primaries = beans.stream().filter(c -> c.primary).toList();
        if (primaries.size() == 1) return primaries.get(0).bean;      // 3. @Primary default
        List<String> names = beans.stream().map(c -> c.name).toList();
        throw new IllegalStateException("NoUniqueBeanDefinitionException: expected single matching bean but found "
            + names.size() + ": " + String.join(",", names));
    }
}

public class Main {
    public static void main(String[] args) {
        MiniContainer noPrimary = new MiniContainer();
        noPrimary.register("emailNotifier", new EmailNotifier(), false);
        noPrimary.register("smsNotifier", new SmsNotifier(), false);
        try {
            noPrimary.resolve(null);
        } catch (IllegalStateException e) {
            System.out.println(e.getMessage());
        }
        System.out.println(noPrimary.resolve("smsNotifier").send("otp 1234"));

        MiniContainer withPrimary = new MiniContainer();
        withPrimary.register("emailNotifier", new EmailNotifier(), true);   // @Primary
        withPrimary.register("smsNotifier", new SmsNotifier(), false);
        System.out.println(withPrimary.resolve(null).send("welcome"));
        System.out.println(withPrimary.resolve("smsNotifier").send("otp 5678"));   // @Qualifier > @Primary
    }
}`;

  const CYCLE = `class CA { final CB b; CA(CB b) { this.b = b; } }       // constructor injection: A needs B
class CB { final CA a; CB(CA a) { this.a = a; } }       //                        B needs A
class SA { SB b; }                                      // field / setter injection
class SB { SA a; }

class ConstructorContainer {
    private final Map<String, Object> singletons = new HashMap<>();
    private final Set<String> inCreation = new LinkedHashSet<>();
    Object getBean(String name) {
        Object done = singletons.get(name);
        if (done != null) return done;
        if (!inCreation.add(name))                                    // dobara aaya jab abhi ban hi raha tha
            throw new IllegalStateException("BeanCurrentlyInCreationException: "
                + String.join(" -> ", inCreation) + " -> " + name);
        Object bean = name.equals("a") ? new CA((CB) getBean("b")) : new CB((CA) getBean("a"));
        inCreation.remove(name);
        singletons.put(name, bean);
        return bean;
    }
}

class SetterContainer {
    private final Map<String, Object> singletons = new HashMap<>();   // fully ready beans (singletonObjects)
    private final Map<String, Object> early = new HashMap<>();        // half-ready (earlySingletonObjects / factories)
    Object getBean(String name) {
        if (singletons.containsKey(name)) return singletons.get(name);
        if (early.containsKey(name)) return early.get(name);          // cycle: adhoora object de do
        Object bean = name.equals("a") ? new SA() : new SB();         // 1. instantiate (no-arg)
        early.put(name, bean);                                        // 2. early reference expose
        if (bean instanceof SA sa) sa.b = (SB) getBean("b");         // 3. populate dependencies
        else ((SB) bean).a = (SA) getBean("a");
        early.remove(name);
        singletons.put(name, bean);
        return bean;
    }
}

public class Main {
    public static void main(String[] args) {
        try {
            new ConstructorContainer().getBean("a");
        } catch (IllegalStateException e) {
            System.out.println("constructor injection: " + e.getMessage());
        }
        SA a = (SA) new SetterContainer().getBean("a");
        System.out.println("setter/field injection: early reference, a.b.a == a: " + (a.b.a == a));
    }
}`;

  // =================================================================
  L.c8 = {
    kind: 'th', title: 'Spring core: IoC, DI and beans', topic: 'Spring',
    goal: 'IoC / DI aur injection types, bean scopes (prototype-in-singleton trap), bean lifecycle + BeanPostProcessor, <code>@Component</code> vs <code>@Bean</code> vs <code>@Configuration</code> (proxyBeanMethods), <code>@Qualifier</code> vs <code>@Primary</code> aur circular dependencies — har concept <b>plain Java mini-container + output</b> se samjho, asli Spring code bhi dekho, aur planner ke <b>6 interview questions</b> ka 30–60 sec English answer ready rakho.',
    oneLine: 'Spring container objects banata aur jodta hai (IoC); tum constructor me dependencies maango (DI); bean default singleton hai isliye stateless / thread-safe rakho; ek type ke do beans → @Qualifier ya @Primary; cycle = design smell.',
    parts: [
      { title: '🧩 Concept — IoC aur DI (constructor vs setter vs field injection)', blocks: [
        { p: '<b>IoC (Inversion of Control)</b>: object khud apni dependencies <code>new</code> karke nahi banata — control ulta ho gaya, ab <b>container</b> (Spring ka <code>ApplicationContext</code>) objects banata hai, unki life manage karta hai aur unhe jodta hai. <b>DI (Dependency Injection)</b> IoC ka tareeka hai: dependency bahar se di jaati hai (constructor / setter / field se).' },
        { p: 'c1 ka <b>composition</b> yaad karo: <code>Car(Engine engine)</code> — Car ko nahi pata kaunsa engine. Bas ye wahi idea hai, farak itna ki <code>new Car(new PetrolEngine())</code> ab Spring likhta hai. Interface pe depend karo (<code>PaymentGateway</code>), implementation config decide kare → test me Fake de do.' },
        { table: { head: ['', 'Constructor', 'Setter', 'Field (@Autowired on field)'], rows: [
          ['Final fields / immutable', '<b>Haan</b>', 'Nahi', 'Nahi'],
          ['Required dependency guarantee', 'Haan — object bina deps ke banta hi nahi', 'Nahi — set karna bhool sakte ho', 'Nahi'],
          ['Unit test bina Spring', 'Seedha <code>new Service(fake)</code>', 'Setter call karo', 'Reflection / Spring chahiye'],
          ['Hidden deps / bloat dikhna', 'Constructor me 7 params → class bahut kuch kar rahi hai (SRP smell) — dikh jaata hai', 'Chhup jaata hai', 'Chhup jaata hai'],
          ['Kab use', '<b>Default — required deps</b>', 'Optional / baad me badalne wali deps', 'Avoid (sirf tests / legacy)'],
        ] } },
        { code: DI },
        { pre: `Output:
order ok, real charged 500
order ok, fake charged 10
field injection without container: NPE
constructor injection: fails fast at creation` },
        { p: 'Asli Spring me yahi cheez aisi dikhti hai (Spring 4.3+ me <b>single constructor</b> pe <code>@Autowired</code> likhna zaroori nahi):' },
        { pre: `@Service
public class OrderService {
    private final PaymentGateway gateway;          // final + constructor = recommended

    public OrderService(PaymentGateway gateway) {  // single constructor → Spring isi se inject karta hai
        this.gateway = gateway;
    }
}

// Lombok ke saath: @RequiredArgsConstructor → final fields ka constructor generate

// Avoid:
@Service
public class LegacyOrderService {
    @Autowired private PaymentGateway gateway;     // field injection: final nahi, test me null
}` },
        { tip: 'Spring team khud <b>constructor injection</b> recommend karti hai: mandatory deps ke liye constructor, optional ke liye setter. Field injection ka sabse bada nuksaan: class ko Spring ke bina test karna mushkil, aur deps chhup jaati hain.' },
      ] },
      { title: '🫘 Bean scopes — aur prototype ko singleton me inject kiya toh?', blocks: [
        { table: { head: ['Scope', 'Kitne objects', 'Kab'], rows: [
          ['<b>singleton</b> (default)', 'Container me <b>ek</b> (per ApplicationContext, JVM-wide nahi)', 'Stateless services, repositories, clients'],
          ['<b>prototype</b>', 'Har <code>getBean()</code> / injection pe <b>naya</b>', 'Stateful, short-lived objects (builder, per-task state)'],
          ['<b>request</b>', 'Har HTTP request ka ek (web)', 'Request context, per-request data'],
          ['<b>session</b>', 'Har HTTP session ka ek (web)', 'User session data (cart)'],
          ['<b>application</b>', 'ServletContext ka ek (web)', 'Rare'],
          ['<b>websocket</b>', 'Har WebSocket session ka ek', 'Rare'],
        ] } },
        { p: '<b>Trap</b>: singleton sirf <b>ek baar</b> banta hai, toh uski dependencies bhi sirf ek baar inject hoti hain. Prototype bean usme inject kiya → wahi ek prototype object hamesha ke liye fix ho gaya — "prototype" ka matlab hi khatam. Fix: jab chahiye tab container se <b>naya maango</b> — <code>ObjectProvider&lt;T&gt;.getObject()</code>, <code>@Lookup</code> method, ya <b>scoped proxy</b>.' },
        { code: SCOPE },
        { pre: `Output:
singleton same object: true
prototype injected once: cart 1, cart 1
provider per call:      cart 2, cart 3
carts created = 3` },
        { pre: `@Component
@Scope("prototype")                         // ya ConfigurableBeanFactory.SCOPE_PROTOTYPE
public class Cart { ... }

@Service
public class CheckoutService {
    private final ObjectProvider<Cart> carts;     // fix 1: provider inject karo, object nahi
    public CheckoutService(ObjectProvider<Cart> carts) { this.carts = carts; }
    public void checkout() {
        Cart cart = carts.getObject();            // har call pe naya prototype
    }
}

@Component
public abstract class CheckoutService2 {
    @Lookup                                       // fix 2: Spring CGLIB se ye method override karta hai
    protected abstract Cart newCart();
}

@Component
@Scope(value = "prototype", proxyMode = ScopedProxyMode.TARGET_CLASS)   // fix 3: scoped proxy
public class Cart { ... }                         // dhyan: proxy pe HAR method call naya Cart deta hai` },
        { tip: 'c7 se connect: singleton bean <b>saare request threads me shared</b> hai. Isliye uske andar mutable instance state (counter, user data, <code>SimpleDateFormat</code>) mat rakho — stateless rakho, ya thread-safe types (<code>AtomicInteger</code>, <code>ConcurrentHashMap</code>) use karo. Request / session scoped bean ko singleton me inject karna ho toh bhi proxy chahiye (Spring web me <code>proxyMode</code>).' },
      ] },
      { title: '♻️ Bean lifecycle — @PostConstruct, @PreDestroy, BeanPostProcessor', blocks: [
        { olist: [
          '<b>Instantiate</b> — constructor (constructor injection yahin).',
          '<b>Populate</b> — setter / field injection.',
          '<b>Aware callbacks</b> — <code>BeanNameAware</code>, <code>ApplicationContextAware</code> (agar implement kiya).',
          '<b>BeanPostProcessor.postProcessBeforeInitialization</b> — har BPP ke liye. <code>@PostConstruct</code> asal me isi step me <code>CommonAnnotationBeanPostProcessor</code> call karta hai.',
          '<b>Init</b> — <code>@PostConstruct</code> → <code>InitializingBean.afterPropertiesSet()</code> → <code>@Bean(initMethod = ...)</code>.',
          '<b>BeanPostProcessor.postProcessAfterInitialization</b> — yahan <b>AOP proxies</b> bante hain (<code>@Transactional</code>, <code>@Async</code>, <code>@Cacheable</code>). Jo object yahan se return hua, wahi context me jaata hai.',
          '<b>Ready</b> — use hota hai.',
          '<b>Shutdown</b> (context close) — <code>@PreDestroy</code> → <code>DisposableBean.destroy()</code> → <code>destroyMethod</code>.',
        ] },
        { code: LIFE },
        { pre: `Output:
1. constructor + dependency: countryRepo
2. BPP before-init: cacheService
3. @PostConstruct: cache warmed {country=IN}
4. BPP after-init: cacheService (AOP proxy yahin wrap hota)
5. ready, get(country) = IN
6. @PreDestroy: cache cleared` },
        { pre: `import jakarta.annotation.PostConstruct;        // Spring Boot 3 / Spring 6: jakarta.*  (Boot 2: javax.annotation.*)
import jakarta.annotation.PreDestroy;

@Service
public class CountryCache {
    private final CountryRepo repo;
    private final Map<String, String> cache = new ConcurrentHashMap<>();
    public CountryCache(CountryRepo repo) { this.repo = repo; }

    @PostConstruct void warmUp() { repo.findAll().forEach(c -> cache.put(c.code(), c.name())); }
    @PreDestroy   void cleanup() { cache.clear(); }
}

@Component
public class TimingPostProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        return bean;   // yahan Proxy / wrapper return karke behaviour add kar sakte ho (Spring AOP yahi karta hai)
    }
}` },
        { list: [
          '<b>@PostConstruct kyun, constructor kyun nahi?</b> Field / setter injection constructor ke <b>baad</b> hota hai; aur constructor me heavy kaam (DB call) karna testing bigaadta hai. PostConstruct tab chalta hai jab saari deps ready hain.',
          '<b>Prototype</b> beans ke liye container <b>destroy callbacks nahi</b> chalata — banane ke baad wo tumhari responsibility hai.',
          '<b>BeanPostProcessor</b> container-level extension point hai — ek BPP <b>har bean</b> pe chalta hai. <code>BeanFactoryPostProcessor</code> alag cheez hai: wo beans banne se <b>pehle</b> bean <i>definitions</i> (metadata) badalta hai (jaise property placeholders).',
        ] },
      ] },
      { title: '🏗️ @Component vs @Bean vs @Configuration (proxyBeanMethods)', blocks: [
        { table: { head: ['', '@Component (@Service, @Repository, @Controller)', '@Bean', '@Configuration'], rows: [
          ['Kahan lagta hai', 'Class pe', '<b>Method</b> pe (config class ke andar)', 'Class pe (khud bhi @Component hai)'],
          ['Kaise register', 'Component scan class dhoondh ke bean banata hai', 'Method ka return value bean ban jaata hai', 'Isme @Bean methods rakhte hain'],
          ['Kab use', 'Apni classes jinka source tumhare paas hai', '<b>Third-party</b> classes (ObjectMapper, RestTemplate, DataSource) ya custom creation logic', 'Beans ki wiring / setup ek jagah'],
          ['Control', 'Kam — Spring constructor call karta hai', 'Poora — tum <code>new</code> karke configure karo', '—'],
        ] } },
        { p: '<b>proxyBeanMethods</b> (Spring 5.2+, default <code>true</code>): <code>@Configuration</code> class ka Spring ek <b>CGLIB subclass</b> banata hai. Ek @Bean method doosre ko call kare (<code>userRepo()</code> ke andar <code>dataSource()</code>) toh proxy call intercept karke <b>container wala singleton</b> deta hai. <code>proxyBeanMethods = false</code> ("lite" mode, ya @Bean ko @Component class me rakhna) → plain Java call → <b>har call pe naya object</b>. Lite mode fast startup deta hai (Spring Boot ki auto-configurations yahi use karti hain), par tab inter-bean call mat karo — dependency ko method parameter se maango.' },
        { code: PROXY },
        { pre: `Output:
proxyBeanMethods=false: userRepo->ds1, orderRepo->ds2
proxyBeanMethods=true:  userRepo->ds3, orderRepo->ds3
DataSource objects created = 3` },
        { pre: `@Configuration                        // = @Configuration(proxyBeanMethods = true)
public class AppConfig {
    @Bean
    public DataSource dataSource() { return new HikariDataSource(); }

    @Bean
    public UserRepo userRepo() { return new UserRepo(dataSource()); }     // proxy → wahi singleton DataSource
}

@Configuration(proxyBeanMethods = false)   // lite: no CGLIB, fast startup
public class LiteConfig {
    @Bean
    public ObjectMapper objectMapper() { return new ObjectMapper(); }

    @Bean
    public UserRepo userRepo(DataSource dataSource) {   // dependency PARAMETER se — safe in lite mode
        return new UserRepo(dataSource);
    }
}` },
        { tip: 'CGLIB subclass banata hai, isliye full-mode <code>@Configuration</code> class aur uske <code>@Bean</code> methods <b>final / private nahi</b> ho sakte.' },
      ] },
      { title: '🎯 Ek type ke do beans — @Qualifier vs @Primary', blocks: [
        { p: '<code>Notifier</code> ke do beans hain (<code>emailNotifier</code>, <code>smsNotifier</code>) aur kisi ne <code>Notifier</code> maanga → Spring confuse → startup pe <code>NoUniqueBeanDefinitionException</code>. Do solutions:' },
        { table: { head: ['', '@Primary', '@Qualifier'], rows: [
          ['Kahan lagta hai', 'Bean ki <b>definition</b> pe (provider side)', '<b>Injection point</b> pe (consumer side), aur optionally bean pe naam'],
          ['Matlab', '"Koi specific na maange toh ye default"', '"Mujhe exactly ye wala chahiye"'],
          ['Priority', 'Kam', '<b>Zyada</b> — Qualifier hamesha Primary ko override karta hai'],
          ['Kab', 'Ek clear default hai (90% jagah email)', 'Kuch jagah alag bean chahiye (OTP ke liye sms)'],
        ] } },
        { code: QUAL },
        { pre: `Output:
NoUniqueBeanDefinitionException: expected single matching bean but found 2: emailNotifier,smsNotifier
sms: otp 1234
email: welcome
sms: otp 5678` },
        { pre: `@Component
@Primary
public class EmailNotifier implements Notifier { ... }      // bean name: "emailNotifier"

@Component
public class SmsNotifier implements Notifier { ... }        // bean name: "smsNotifier"

@Service
public class OtpService {
    private final Notifier notifier;
    public OtpService(@Qualifier("smsNotifier") Notifier notifier) {   // Qualifier > Primary
        this.notifier = notifier;
    }
}

@Service
public class BroadcastService {
    private final List<Notifier> all;                      // saare Notifier beans chahiye toh List / Map<String, Notifier>
    public BroadcastService(List<Notifier> all) { this.all = all; }
}` },
        { tip: 'Fallback bhi hai: na Primary na Qualifier, par parameter / field ka naam bean name se match kare (<code>Notifier smsNotifier</code>) toh Spring usi ko le leta hai. Is pe bharosa mat karo — rename pe toot jaata hai; explicit <code>@Qualifier</code> likho.' },
      ] },
      { title: '🔄 Circular dependencies — Spring kaise handle karta hai, Boot kyun mana karta hai', blocks: [
        { p: 'A ko B chahiye, B ko A chahiye. <b>Constructor injection</b> me ye <b>impossible</b> hai: A banane ke liye pehle B chahiye, B ke liye pehle A — Spring "currently in creation" set me dekh ke <code>BeanCurrentlyInCreationException</code> deta hai. <b>Setter / field injection</b> (singleton beans) me Spring ise suljha sakta hai: A ko <b>pehle instantiate</b> karo (no-arg), uska <b>early reference</b> cache me rakho, phir B banao aur B ko wo adhoora A de do, phir A ki filling poori karo. Isko <b>three-level cache</b> kehte hain: <code>singletonObjects</code> (ready), <code>earlySingletonObjects</code> (adhoore), <code>singletonFactories</code> (early reference banane wali factory — taaki AOP proxy chahiye toh early reference bhi proxy ho).' },
        { code: CYCLE },
        { pre: `Output:
constructor injection: BeanCurrentlyInCreationException: a -> b -> a
setter/field injection: early reference, a.b.a == a: true` },
        { p: '<b>Spring Boot 2.6+</b> me <code>spring.main.allow-circular-references</code> default <b>false</b> hai — yaani setter/field cycle bhi startup pe fail: "The dependencies of some of the beans in the application context form a cycle". Kyun? Cycle ek <b>design smell</b> hai (do classes ek doosre ke andar ghusi hui, responsibilities saaf nahi), early reference ek <b>half-initialized object</b> expose karta hai (PostConstruct se pehle use ho sakta hai), aur proxy ke saath subtle bugs aate hain. Prototype beans ki cycle Spring kabhi resolve nahi karta.' },
        { pre: `# application.properties — sirf temporary escape hatch, fix nahi
spring.main.allow-circular-references=true

// Behtar fixes:
// 1. Design: common logic teesri class me nikalo (A -> C <- B), ya events (ApplicationEventPublisher) se decouple
// 2. Ek side lazy: proxy inject hota hai, asli bean pehli call pe resolve
@Service
public class A {
    private final B b;
    public A(@Lazy B b) { this.b = b; }
}` },
      ] },
      { title: '🎤 Interview — planner ke 6 questions (English answers)', blocks: [
        { tip: 'Answers me <b>order / payment / notifier</b> wale examples sirf template hain — interview se pehle inhe <b>apne asli project</b> ke services, config classes aur beans se badal lo. Interviewer follow-up wahi se puchega ("aapke project me kaunsa bean prototype tha?").' },
        { qa: [
          ['What are IoC and DI? Constructor vs setter vs field injection: which do you use and why?', 'Inversion of Control means my classes do not create or look up their dependencies; the Spring container creates the objects, manages their lifecycle and wires them together. Dependency Injection is how that is done: the dependency is passed in from outside, through a constructor, a setter or a field. I use <b>constructor injection</b> by default: the fields can be final, the object can never exist without its required dependencies, I can unit test it with a plain <code>new OrderService(fakeGateway)</code> without Spring, and a constructor with too many parameters makes a design smell visible. Since Spring 4.3 a single constructor does not even need <code>@Autowired</code>. I use setter injection only for optional dependencies, and I avoid field injection because it hides dependencies, prevents final fields and makes testing harder.'],
          ['Bean scopes. What happens when you inject a prototype bean into a singleton?', 'The default scope is singleton: one instance per application context. Prototype creates a new instance every time the bean is requested. Web applications also have request, session, application and websocket scopes. If I inject a prototype into a singleton, the singleton is created only once, so the injection happens only once and the singleton keeps the same prototype instance forever — effectively it becomes a singleton too. To get a fresh instance each time I inject an <code>ObjectProvider&lt;T&gt;</code> and call <code>getObject()</code>, use a <code>@Lookup</code> method, or use a scoped proxy. Related point: since a singleton is shared by all request threads, it must be stateless or thread-safe.'],
          ['Bean lifecycle: @PostConstruct, @PreDestroy, BeanPostProcessor.', 'Spring first instantiates the bean, then injects dependencies, calls any Aware callbacks, then runs every BeanPostProcessor\'s <code>postProcessBeforeInitialization</code>, then the init callbacks — <code>@PostConstruct</code>, <code>afterPropertiesSet</code>, and a custom init method — and then <code>postProcessAfterInitialization</code>. On shutdown it calls <code>@PreDestroy</code>, <code>DisposableBean.destroy</code> and a custom destroy method. I use <code>@PostConstruct</code> for work that needs all dependencies, like warming a cache, and <code>@PreDestroy</code> to release resources. A BeanPostProcessor is a hook that runs for every bean; the after-initialization step is where Spring AOP wraps beans in proxies for <code>@Transactional</code> or <code>@Async</code>. Note that destroy callbacks are not called for prototype beans.'],
          ['@Component vs @Bean vs @Configuration (and proxyBeanMethods).', '<code>@Component</code> and its stereotypes go on my own classes, which component scanning detects and instantiates. <code>@Bean</code> goes on a method whose return value becomes a bean; I use it for third-party classes I cannot annotate, such as an ObjectMapper or a DataSource, or when creation needs custom logic. <code>@Configuration</code> marks a class that holds <code>@Bean</code> methods. With the default <code>proxyBeanMethods = true</code>, Spring creates a CGLIB subclass of the configuration class, so when one bean method calls another, the call is intercepted and returns the existing singleton instead of creating a new object. With <code>proxyBeanMethods = false</code>, the lite mode, there is no proxy and startup is faster — Spring Boot auto-configurations use it — but then I must pass dependencies as method parameters instead of calling other bean methods.'],
          ['Two beans of the same type: @Qualifier vs @Primary.', 'If two beans implement the same type and I inject by type, Spring fails at startup with <code>NoUniqueBeanDefinitionException</code>. <code>@Primary</code> goes on one bean definition and marks it as the default when nobody asks for a specific one. <code>@Qualifier("smsNotifier")</code> goes on the injection point and selects an exact bean by name. Qualifier always wins over Primary. In practice I mark the common implementation as Primary and use a Qualifier in the few places that need the other one. If I need all implementations, for example to build a strategy registry, I inject a <code>List</code> or a <code>Map&lt;String, Notifier&gt;</code>.'],
          ['Circular dependencies: how Spring handles them and why Boot rejects them by default.', 'With constructor injection a cycle cannot be resolved: to build A you need B and to build B you need A, so Spring throws <code>BeanCurrentlyInCreationException</code>. With setter or field injection between singletons, Spring can resolve it using its three-level cache: it instantiates A, exposes an early reference to the half-built A, creates B with that reference, then finishes A. Since Spring Boot 2.6, <code>spring.main.allow-circular-references</code> is false by default, so the application fails at startup even for setter cycles. The reason is that a cycle is usually a design smell, and the early reference exposes a partially initialized object, which can cause subtle bugs, especially with proxies. I fix it by extracting the shared logic into a third bean or decoupling with events; <code>@Lazy</code> on one constructor parameter or re-enabling the property are only temporary workarounds.'],
        ] },
        { say: [
          ['Aise bolo — DI apne project se (45 sec)', 'In our service every class gets its dependencies through the constructor, and the fields are final. For example, the order service depends on a PaymentGateway interface, not on a concrete client. Spring wires the real implementation in production, and in unit tests I just pass a fake into the constructor, without starting a Spring context. All our services are singletons, so we keep them stateless. Where we had two implementations of the same interface, we marked the common one as @Primary and used @Qualifier in the one place that needed the other.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          '"IoC aur DI same cheez hai" — DI, IoC ko implement karne ka <b>ek tareeka</b> hai (doosra: service locator).',
          'Field injection ko default banana — final nahi, test me NPE, deps chhupi rehti hain.',
          'Singleton bean me request / user data instance field me rakhna — saare threads share karte hain (race condition).',
          'Prototype ko singleton me seedha inject karke sochna ki har baar naya milega — ek hi milega.',
          '"Singleton scope = JVM me ek object" — nahi, <b>ek container</b> me ek; do contexts → do objects.',
          'Prototype bean ke <code>@PreDestroy</code> pe bharosa karna — container call hi nahi karta.',
          '<code>proxyBeanMethods = false</code> me ek @Bean method se doosra call karna — har call naya object.',
          'Same class ke andar <code>this.method()</code> se <code>@Transactional</code> method call karna — proxy bypass ho jaata hai (BPP ne proxy bahar se wrap kiya tha).',
          'Circular dependency ko <code>allow-circular-references=true</code> se "fix" karna — design theek karo.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['Singleton <code>ReportService</code> me prototype <code>Report</code> constructor se inject hua. 3 requests ne <code>service.report()</code> call kiya. Kitne Report objects bane?', '<b>1</b> — singleton ek baar bana, injection ek baar hua. Har baar naya chahiye toh <code>ObjectProvider&lt;Report&gt;.getObject()</code>.'],
          ['<code>@Configuration</code> (default) me <code>userRepo()</code> aur <code>orderRepo()</code> dono <code>dataSource()</code> call karte hain. Kitne DataSource?', '<b>1</b> — CGLIB proxy call intercept karke singleton deta hai. <code>proxyBeanMethods = false</code> hota toh <b>3</b> — container ka apna dataSource bean + do direct calls ke do naye.'],
          ['<code>EmailNotifier</code> pe <code>@Primary</code>, injection point pe <code>@Qualifier("smsNotifier")</code>. Kaun inject hoga?', '<b>smsNotifier</b> — Qualifier hamesha Primary ko override karta hai.'],
          ['Spring Boot 3 app, A aur B ek doosre ko <b>field injection</b> se use karte hain, koi property set nahi. Kya hoga?', 'Startup <b>fail</b> — Boot 2.6+ me <code>spring.main.allow-circular-references=false</code> default; "beans form a cycle" error.'],
          ['Ek bean ka order: <code>@PostConstruct</code>, constructor, <code>postProcessAfterInitialization</code>, field injection. Sahi sequence?', '<b>constructor → field injection → @PostConstruct → postProcessAfterInitialization</b>.'],
        ] },
      ] },
    ],
    checks: [
      'IoC vs DI aur constructor injection kyun — 45 sec me apne project ke example se bol sakta hoon',
      'Prototype-in-singleton problem aur 3 fixes (ObjectProvider, @Lookup, scoped proxy) samjha sakta hoon',
      'Bean lifecycle ka order + BeanPostProcessor me AOP proxy kahan banta hai bata sakta hoon',
      'proxyBeanMethods, @Qualifier vs @Primary aur Boot 2.6+ circular reference rule clear hai',
    ],
    memory: 'Container banata + jodta (IoC), constructor se maango (DI, final); singleton = per context, stateless rakho; prototype-in-singleton = ek hi object → ObjectProvider; BPP after-init = proxy; @Configuration CGLIB = inter-bean call singleton; Qualifier > Primary; cycle = smell, Boot 2.6+ reject.',
    snippets: [
      { code: DI, out: 'order ok, real charged 500\norder ok, fake charged 10\nfield injection without container: NPE\nconstructor injection: fails fast at creation' },
      { code: SCOPE, out: 'singleton same object: true\nprototype injected once: cart 1, cart 1\nprovider per call:      cart 2, cart 3\ncarts created = 3' },
      { code: LIFE, out: '1. constructor + dependency: countryRepo\n2. BPP before-init: cacheService\n3. @PostConstruct: cache warmed {country=IN}\n4. BPP after-init: cacheService (AOP proxy yahin wrap hota)\n5. ready, get(country) = IN\n6. @PreDestroy: cache cleared' },
      { code: PROXY, out: 'proxyBeanMethods=false: userRepo->ds1, orderRepo->ds2\nproxyBeanMethods=true:  userRepo->ds3, orderRepo->ds3\nDataSource objects created = 3' },
      { code: QUAL, out: 'NoUniqueBeanDefinitionException: expected single matching bean but found 2: emailNotifier,smsNotifier\nsms: otp 1234\nemail: welcome\nsms: otp 5678' },
      { code: CYCLE, out: 'constructor injection: BeanCurrentlyInCreationException: a -> b -> a\nsetter/field injection: early reference, a.b.a == a: true' },
    ],
  };
})();
