// Planner lessons — Spring theory (c9 Spring Boot internals, c10 REST APIs, c11 Spring Data JPA + Hibernate)
// Theory format: concept Hinglish me → har planner interview question ka English answer (qa) → code + output → traps → self-test.
// NOTE: validator plain javac chalata hai (Spring / JPA / servlet jars classpath pe NAHI). Isliye har runnable `code` block
//       plain Java me concept simulate karta hai, aur asli Spring / JPA code (annotations, application.yml, SQL logs) `pre` blocks me hai.
// snippets: validate-lessons.js --java inhe compile + run karke output match karta hai.
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});
  const out = s => 'Output:\n' + s;

  // ======================= c9 — code examples (plain Java) =======================
  const META = `import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME) @Target(ElementType.TYPE) @interface Configuration {}
@Retention(RetentionPolicy.RUNTIME) @Target(ElementType.TYPE) @Configuration @interface SpringBootConfiguration {}
@Retention(RetentionPolicy.RUNTIME) @Target(ElementType.TYPE) @interface EnableAutoConfiguration {}
@Retention(RetentionPolicy.RUNTIME) @Target(ElementType.TYPE) @interface ComponentScan {}

@Retention(RetentionPolicy.RUNTIME) @Target(ElementType.TYPE)
@SpringBootConfiguration @EnableAutoConfiguration @ComponentScan     // composed (meta) annotation
@interface SpringBootApplication {}

@SpringBootApplication
class ShopApplication {}

public class Main {
    // Spring ka MergedAnnotations jaisa: annotation ke andar ki annotations bhi (recursively) dekho
    static boolean has(Class<?> type, Class<? extends Annotation> wanted, Set<Class<?>> seen) {
        for (Annotation a : type.getAnnotations()) {
            Class<? extends Annotation> t = a.annotationType();
            if (t == wanted) return true;
            if (t.getName().startsWith("java.lang.annotation")) continue;     // @Retention / @Target skip
            if (seen.add(t) && has(t, wanted, seen)) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        Class<?> app = ShopApplication.class;
        System.out.println("@SpringBootApplication present: " + app.isAnnotationPresent(SpringBootApplication.class));
        System.out.println("  -> @SpringBootConfiguration: " + has(app, SpringBootConfiguration.class, new HashSet<>()));
        System.out.println("  -> @Configuration (meta of meta): " + has(app, Configuration.class, new HashSet<>()));
        System.out.println("  -> @EnableAutoConfiguration: " + has(app, EnableAutoConfiguration.class, new HashSet<>()));
        System.out.println("  -> @ComponentScan: " + has(app, ComponentScan.class, new HashSet<>()));

        String basePackage = "com.shop";                                   // main class ka package
        List<String> classes = List.of("com.shop.order.OrderService", "com.audit.AuditListener", "com.shop.web.OrderController");
        List<String> picked = new ArrayList<>(), skipped = new ArrayList<>();
        for (String c : classes) (c.startsWith(basePackage + ".") ? picked : skipped).add(c);
        System.out.println("component scan from " + basePackage + " picks: " + picked);
        System.out.println("outside base package, NOT scanned: " + skipped);
    }
}`;
  const META_OUT = `@SpringBootApplication present: true
  -> @SpringBootConfiguration: true
  -> @Configuration (meta of meta): true
  -> @EnableAutoConfiguration: true
  -> @ComponentScan: true
component scan from com.shop picks: [com.shop.order.OrderService, com.shop.web.OrderController]
outside base package, NOT scanned: [com.audit.AuditListener]`;

  const AUTO = `class Ctx {
    final Set<String> classpath;
    final Map<String, String> props;
    final Set<String> excluded;
    final Map<String, String> beans = new LinkedHashMap<>();        // bean type -> kisne banaya
    Ctx(Set<String> classpath, Map<String, String> props, Set<String> excluded) {
        this.classpath = classpath; this.props = props; this.excluded = excluded;
    }
}

interface Condition { String check(Ctx c); }                        // null = match, warna reason

class Conditions {
    static Condition onClass(String cls) {
        return c -> c.classpath.contains(cls) ? null : "@ConditionalOnClass did not find " + cls;
    }
    static Condition onMissingBean(String type) {
        return c -> c.beans.containsKey(type) ? "@ConditionalOnMissingBean found " + type + " (" + c.beans.get(type) + ")" : null;
    }
    static Condition onProperty(String key, String having) {
        return c -> {
            String v = c.props.get(key);
            if (v == null) return "@ConditionalOnProperty " + key + " missing";
            return v.equals(having) ? null : "@ConditionalOnProperty " + key + "=" + v;
        };
    }
}

class AutoConfig {
    final String name, beanType;
    final List<Condition> conditions;
    AutoConfig(String name, String beanType, Condition... cs) { this.name = name; this.beanType = beanType; this.conditions = List.of(cs); }
}

public class Main {
    // AutoConfiguration.imports file ki lines (order bhi wahi)
    static final List<AutoConfig> IMPORTS = List.of(
        new AutoConfig("DataSourceAutoConfiguration", "DataSource",
            Conditions.onClass("HikariDataSource"), Conditions.onMissingBean("DataSource")),
        new AutoConfig("JacksonAutoConfiguration", "ObjectMapper",
            Conditions.onClass("ObjectMapper"), Conditions.onMissingBean("ObjectMapper")),
        new AutoConfig("RedisAutoConfiguration", "RedisTemplate",
            Conditions.onClass("RedisOperations"), Conditions.onMissingBean("RedisTemplate")),
        new AutoConfig("FeatureFlagsAutoConfiguration", "FeatureFlags",
            Conditions.onProperty("app.flags.enabled", "true")));

    static void run(String title, Ctx ctx) {
        System.out.println("== " + title);
        for (AutoConfig ac : IMPORTS) {                             // user beans PEHLE register ho chuke (deferred import)
            if (ctx.excluded.contains(ac.name)) { System.out.println("  EXCLUDED  " + ac.name); continue; }
            String fail = null;
            for (Condition cond : ac.conditions) {
                fail = cond.check(ctx);
                if (fail != null) break;
            }
            if (fail == null) {
                ctx.beans.put(ac.beanType, ac.name);
                System.out.println("  MATCH     " + ac.name + " -> bean " + ac.beanType);
            } else {
                System.out.println("  NO MATCH  " + ac.name + ": " + fail);
            }
        }
    }

    public static void main(String[] args) {
        Set<String> cp = Set.of("HikariDataSource", "ObjectMapper");            // starter-web + starter-data-jpa
        run("1: starter-web + starter-data-jpa, no user beans", new Ctx(cp, Map.of(), Set.of()));

        Ctx ctx2 = new Ctx(cp, Map.of("app.flags.enabled", "true"), Set.of("DataSourceAutoConfiguration"));
        ctx2.beans.put("ObjectMapper", "user AppConfig");                       // user ka apna @Bean
        run("2: user ObjectMapper bean, flag on, DataSource excluded", ctx2);
    }
}`;
  const AUTO_OUT = `== 1: starter-web + starter-data-jpa, no user beans
  MATCH     DataSourceAutoConfiguration -> bean DataSource
  MATCH     JacksonAutoConfiguration -> bean ObjectMapper
  NO MATCH  RedisAutoConfiguration: @ConditionalOnClass did not find RedisOperations
  NO MATCH  FeatureFlagsAutoConfiguration: @ConditionalOnProperty app.flags.enabled missing
== 2: user ObjectMapper bean, flag on, DataSource excluded
  EXCLUDED  DataSourceAutoConfiguration
  NO MATCH  JacksonAutoConfiguration: @ConditionalOnMissingBean found ObjectMapper (user AppConfig)
  NO MATCH  RedisAutoConfiguration: @ConditionalOnClass did not find RedisOperations
  MATCH     FeatureFlagsAutoConfiguration -> bean FeatureFlags`;

  const PROPS = `record PaymentProps(int timeoutMs, int retries) {}                // @ConfigurationProperties("app.payment")

class Source {
    final String name;
    final Map<String, String> values;
    final boolean env;
    Source(String name, Map<String, String> values, boolean env) { this.name = name; this.values = values; this.env = env; }
    String get(String key) {                                          // OS env: relaxed binding
        String k = env ? key.replace('.', '_').replace("-", "").toUpperCase() : key;
        return values.get(k);
    }
}

class Environment {
    final List<Source> sources = new ArrayList<>();                    // index 0 = sabse zyada priority
    String winner(String key) {
        for (Source s : sources) {
            String v = s.get(key);
            if (v != null) return key + " = " + v + "   <- " + s.name;
        }
        return key + " = (not set)";
    }
    String value(String key, String def) {
        for (Source s : sources) {
            String v = s.get(key);
            if (v != null) return v;
        }
        return def;
    }
}

public class Main {
    public static void main(String[] args) {
        String activeProfile = "prod";
        Environment env = new Environment();
        env.sources.add(new Source("command line arg", Map.of("server.port", "9090"), false));
        env.sources.add(new Source("JVM system property -D", Map.of("app.payment.retries", "5"), false));
        env.sources.add(new Source("OS env var SPRING_DATASOURCE_URL", Map.of("SPRING_DATASOURCE_URL", "jdbc:postgresql://prod-db/shop"), true));
        if (activeProfile.equals("prod"))
            env.sources.add(new Source("application-prod.yml", Map.of("app.payment.timeout-ms", "2000",
                "spring.datasource.url", "jdbc:postgresql://replica/shop"), false));
        env.sources.add(new Source("application.yml", Map.of("server.port", "8080", "spring.datasource.url", "jdbc:h2:mem:shop",
            "app.payment.timeout-ms", "5000", "app.payment.retries", "3"), false));

        System.out.println("active profile: " + activeProfile);
        for (String key : List.of("server.port", "spring.datasource.url", "app.payment.timeout-ms", "app.payment.retries", "app.beta.enabled"))
            System.out.println(env.winner(key));
        System.out.println("@Value with default -> app.beta.enabled = " + env.value("app.beta.enabled", "false"));

        PaymentProps p = new PaymentProps(Integer.parseInt(env.value("app.payment.timeout-ms", "1000")),
                                          Integer.parseInt(env.value("app.payment.retries", "0")));
        System.out.println("@ConfigurationProperties(app.payment) -> " + p);
    }
}`;
  const PROPS_OUT = `active profile: prod
server.port = 9090   <- command line arg
spring.datasource.url = jdbc:postgresql://prod-db/shop   <- OS env var SPRING_DATASOURCE_URL
app.payment.timeout-ms = 2000   <- application-prod.yml
app.payment.retries = 5   <- JVM system property -D
app.beta.enabled = (not set)
@Value with default -> app.beta.enabled = false
@ConfigurationProperties(app.payment) -> PaymentProps[timeoutMs=2000, retries=5]`;

  const ACT = `class Actuator {
    final Set<String> include, exclude;
    Actuator(String include, String exclude) {
        this.include = new LinkedHashSet<>(List.of(include.split(",")));
        this.exclude = exclude.isEmpty() ? Set.of() : new LinkedHashSet<>(List.of(exclude.split(",")));
    }
    boolean exposed(String id) {                                      // exclude hamesha include pe jeetta
        return !exclude.contains(id) && (include.contains("*") || include.contains(id));
    }
    String handle(String id, String role) {                           // role null = anonymous
        if (!exposed(id)) return "404 (not exposed over HTTP)";
        boolean open = id.equals("health") || id.equals("info");      // security config: sirf ye public
        if (!open && role == null) return "401 (login required)";
        if (!open && !role.equals("ACTUATOR")) return "403 (needs ACTUATOR role)";
        if (id.equals("health"))                                      // show-details: when-authorized
            return role == null ? "200 {status:UP}" : "200 {status:UP, components:{db:UP, diskSpace:UP}}";
        return "200 " + id + " data";
    }
}

public class Main {
    static void call(Actuator a, String id, String role) {
        System.out.println("GET /actuator/" + id + " as " + (role == null ? "anonymous" : role) + " -> " + a.handle(id, role));
    }

    public static void main(String[] args) {
        System.out.println("-- Boot 3 default: exposure.include=health");
        Actuator def = new Actuator("health", "");
        call(def, "health", null);
        call(def, "metrics", "ACTUATOR");

        System.out.println("-- prod: include=health,info,metrics,prometheus  exclude=env");
        Actuator prod = new Actuator("health,info,metrics,prometheus", "env");
        call(prod, "health", null);
        call(prod, "health", "ACTUATOR");
        call(prod, "prometheus", null);
        call(prod, "prometheus", "USER");
        call(prod, "prometheus", "ACTUATOR");
        call(prod, "env", "ACTUATOR");
        call(prod, "heapdump", "ACTUATOR");
    }
}`;
  const ACT_OUT = `-- Boot 3 default: exposure.include=health
GET /actuator/health as anonymous -> 200 {status:UP}
GET /actuator/metrics as ACTUATOR -> 404 (not exposed over HTTP)
-- prod: include=health,info,metrics,prometheus  exclude=env
GET /actuator/health as anonymous -> 200 {status:UP}
GET /actuator/health as ACTUATOR -> 200 {status:UP, components:{db:UP, diskSpace:UP}}
GET /actuator/prometheus as anonymous -> 401 (login required)
GET /actuator/prometheus as USER -> 403 (needs ACTUATOR role)
GET /actuator/prometheus as ACTUATOR -> 200 prometheus data
GET /actuator/env as ACTUATOR -> 404 (not exposed over HTTP)
GET /actuator/heapdump as ACTUATOR -> 404 (not exposed over HTTP)`;

  const BOOT = `public class Main {
    // ServletWebServerFactoryConfiguration: Tomcat, Jetty, Undertow — isi order me, har ek
    // @ConditionalOnClass(server classes) + @ConditionalOnMissingBean(ServletWebServerFactory)
    static String chooseServer(Set<String> classpath) {
        for (String server : List.of("Tomcat", "Jetty", "Undertow"))
            if (classpath.contains(server)) return server;                  // pehla match jeetta, baaki back off
        return "none";
    }

    static void run(String title, Set<String> classpath, boolean verbose) {
        String server = chooseServer(classpath);
        if (!verbose) { System.out.println("== " + title + " -> embedded server: " + server); return; }
        System.out.println("== " + title);
        String type = classpath.contains("DispatcherServlet") ? "SERVLET" : "NONE";
        System.out.println("1. SpringApplication.run: deduce web app type from classpath -> " + type);
        System.out.println("2. prepare Environment: property sources + active profiles");
        System.out.println("3. create ApplicationContext (servlet web server context), print banner");
        System.out.println("4. load bean definitions: component scan + AutoConfiguration.imports (conditions)");
        System.out.println("5. refresh: BeanFactoryPostProcessors -> onRefresh creates " + server + " via ServletWebServerFactory -> singletons");
        System.out.println("6. web server starts listening: " + server + " on port 8080");
        System.out.println("7. ApplicationStartedEvent -> CommandLineRunner / ApplicationRunner -> ApplicationReadyEvent");
    }

    public static void main(String[] args) {
        run("starter-web (default)", Set.of("DispatcherServlet", "Tomcat"), true);
        run("starter-web excluding starter-tomcat + starter-jetty", Set.of("DispatcherServlet", "Jetty"), false);
        run("starter-jetty added but Tomcat NOT excluded", Set.of("DispatcherServlet", "Tomcat", "Jetty"), false);
    }
}`;
  const BOOT_OUT = `== starter-web (default)
1. SpringApplication.run: deduce web app type from classpath -> SERVLET
2. prepare Environment: property sources + active profiles
3. create ApplicationContext (servlet web server context), print banner
4. load bean definitions: component scan + AutoConfiguration.imports (conditions)
5. refresh: BeanFactoryPostProcessors -> onRefresh creates Tomcat via ServletWebServerFactory -> singletons
6. web server starts listening: Tomcat on port 8080
7. ApplicationStartedEvent -> CommandLineRunner / ApplicationRunner -> ApplicationReadyEvent
== starter-web excluding starter-tomcat + starter-jetty -> embedded server: Jetty
== starter-jetty added but Tomcat NOT excluded -> embedded server: Tomcat`;

  // ======================= c10 — code examples (plain Java) =======================
  const REST = `class Order {
    final long id;
    String item, status = "CREATED";
    int qty;
    Order(long id, String item, int qty) { this.id = id; this.item = item; this.qty = qty; }
    public String toString() { return "{id:" + id + ", item:" + item + ", qty:" + qty + ", status:" + status + "}"; }
}

class Response {
    final int status;
    final String body;
    Response(int status, String body) { this.status = status; this.body = body; }
    public String toString() { return status + " " + body; }
}

class OrderController {                                              // @RestController @RequestMapping("/orders")
    private final Map<Long, Order> db = new TreeMap<>();
    private long seq = 0;

    Response handle(String method, String path, Map<String, String> body) {
        String[] seg = path.split("/");                               // "", "orders", "{id}"
        if (seg.length == 2) {                                        // collection: /orders
            if (method.equals("POST")) return create(body);
            if (method.equals("GET")) return new Response(200, db.values().toString());
            return new Response(405, "Method Not Allowed");
        }
        long id = Long.parseLong(seg[2]);                             // item: /orders/{id}
        Order o = db.get(id);
        if (o == null) return new Response(404, "order " + id + " not found");
        return switch (method) {
            case "GET" -> new Response(200, o.toString());
            case "PUT" -> replace(o, body);
            case "PATCH" -> { o.status = body.get("status"); yield new Response(200, o.toString()); }
            case "DELETE" -> { db.remove(id); yield new Response(204, "(no body)"); }
            default -> new Response(405, "Method Not Allowed");
        };
    }
    private Response create(Map<String, String> body) {
        int qty = Integer.parseInt(body.get("qty"));
        if (qty <= 0) return new Response(400, "qty must be > 0");
        Order o = new Order(++seq, body.get("item"), qty);
        db.put(o.id, o);
        return new Response(201, "Location: /orders/" + o.id + " " + o);
    }
    private Response replace(Order o, Map<String, String> body) {
        if (o.status.equals("CANCELLED")) return new Response(409, "order " + o.id + " is CANCELLED");
        o.item = body.get("item");
        o.qty = Integer.parseInt(body.get("qty"));
        return new Response(200, o.toString());
    }
}

public class Main {
    static final OrderController api = new OrderController();
    static void call(String method, String path, Map<String, String> body) {
        System.out.println(method + " " + path + " -> " + api.handle(method, path, body));
    }

    public static void main(String[] args) {
        call("POST", "/orders", Map.of("item", "book", "qty", "2"));
        call("POST", "/orders", Map.of("item", "pen", "qty", "0"));
        call("GET", "/orders/1", Map.of());
        call("PUT", "/orders/1", Map.of("item", "book", "qty", "3"));
        call("PATCH", "/orders/1", Map.of("status", "CANCELLED"));
        call("PUT", "/orders/1", Map.of("item", "book", "qty", "5"));
        call("GET", "/orders/42", Map.of());
        call("DELETE", "/orders", Map.of());
        call("DELETE", "/orders/1", Map.of());
        call("DELETE", "/orders/1", Map.of());
        call("GET", "/orders", Map.of());
    }
}`;
  const REST_OUT = `POST /orders -> 201 Location: /orders/1 {id:1, item:book, qty:2, status:CREATED}
POST /orders -> 400 qty must be > 0
GET /orders/1 -> 200 {id:1, item:book, qty:2, status:CREATED}
PUT /orders/1 -> 200 {id:1, item:book, qty:3, status:CREATED}
PATCH /orders/1 -> 200 {id:1, item:book, qty:3, status:CANCELLED}
PUT /orders/1 -> 409 order 1 is CANCELLED
GET /orders/42 -> 404 order 42 not found
DELETE /orders -> 405 Method Not Allowed
DELETE /orders/1 -> 204 (no body)
DELETE /orders/1 -> 404 order 1 not found
GET /orders -> 200 []`;

  const BIND = `record CreateOrder(String item, int qty) {}

class MiniDispatcher {
    static Map<String, String> matchPath(String template, String path) {   // @PathVariable
        String[] t = template.split("/"), p = path.split("/");
        if (t.length != p.length) return null;
        Map<String, String> vars = new LinkedHashMap<>();
        for (int i = 0; i < t.length; i++) {
            if (t[i].startsWith("{")) vars.put(t[i].substring(1, t[i].length() - 1), p[i]);
            else if (!t[i].equals(p[i])) return null;
        }
        return vars;
    }
    static Map<String, String> query(String q) {                            // ?a=1&b=2
        Map<String, String> m = new LinkedHashMap<>();
        for (String kv : q.split("&")) {
            String[] x = kv.split("=");
            m.put(x[0], x[1]);
        }
        return m;
    }
    static String param(Map<String, String> q, String name, String defaultValue) {   // @RequestParam (required = true by default)
        String v = q.get(name);
        if (v != null) return v;
        if (defaultValue != null) return defaultValue;
        throw new IllegalArgumentException("400 Bad Request: Required request parameter '" + name + "' is not present");
    }
    static CreateOrder readBody(String body) {                              // @RequestBody: Jackson ka kaam
        Map<String, String> m = new HashMap<>();
        for (String kv : body.split(",")) {
            String[] x = kv.split(":");
            m.put(x[0].trim(), x[1].trim());
        }
        return new CreateOrder(m.get("item"), Integer.parseInt(m.get("qty")));
    }
}

public class Main {
    public static void main(String[] args) {
        String[] url = "/users/7/orders?status=PAID&page=1".split("[?]");
        Map<String, String> vars = MiniDispatcher.matchPath("/users/{userId}/orders", url[0]);
        Map<String, String> q = MiniDispatcher.query(url[1]);
        System.out.println("@PathVariable userId = " + vars.get("userId"));
        System.out.println("@RequestParam status = " + MiniDispatcher.param(q, "status", null));
        System.out.println("@RequestParam page = " + MiniDispatcher.param(q, "page", null));
        System.out.println("@RequestParam(defaultValue=20) size = " + MiniDispatcher.param(q, "size", "20"));
        try {
            MiniDispatcher.param(q, "currency", null);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
        System.out.println("@RequestBody -> " + MiniDispatcher.readBody("item: book, qty: 2"));

        String view = "orderList";                                           // @Controller method return value
        System.out.println("@Controller returns view name -> ViewResolver -> templates/" + view + ".html");
        System.out.println("@RestController returns object -> HttpMessageConverter (Jackson) -> JSON body");
    }
}`;
  const BIND_OUT = `@PathVariable userId = 7
@RequestParam status = PAID
@RequestParam page = 1
@RequestParam(defaultValue=20) size = 20
400 Bad Request: Required request parameter 'currency' is not present
@RequestBody -> CreateOrder[item=book, qty=2]
@Controller returns view name -> ViewResolver -> templates/orderList.html
@RestController returns object -> HttpMessageConverter (Jackson) -> JSON body`;

  const ADVICE = `import java.util.function.*;

class BusinessException extends RuntimeException { BusinessException(String m) { super(m); } }
class OrderNotFoundException extends BusinessException { OrderNotFoundException(long id) { super("Order " + id + " not found"); } }
class OutOfStockException extends BusinessException {
    final String sku;
    OutOfStockException(String sku, int left) { super("Only " + left + " left for " + sku); this.sku = sku; }
}
class CouponExpiredException extends BusinessException { CouponExpiredException(String c) { super("Coupon " + c + " expired"); } }

class GlobalExceptionHandler {                                         // @RestControllerAdvice
    private final Map<Class<?>, Function<Exception, Map<String, Object>>> handlers = new LinkedHashMap<>();

    static Map<String, Object> problem(int status, String title, String detail) {   // ProblemDetail (RFC 9457)
        Map<String, Object> pd = new LinkedHashMap<>();
        pd.put("type", "about:blank");
        pd.put("title", title);
        pd.put("status", status);
        pd.put("detail", detail);
        return pd;
    }

    GlobalExceptionHandler() {                                         // har entry = ek @ExceptionHandler method
        handlers.put(OrderNotFoundException.class, ex -> problem(404, "Not Found", ex.getMessage()));
        handlers.put(OutOfStockException.class, ex -> {
            Map<String, Object> pd = problem(409, "Out of stock", ex.getMessage());
            pd.put("type", "https://api.example.com/problems/out-of-stock");
            pd.put("sku", ((OutOfStockException) ex).sku);                   // setProperty: extra field
            return pd;
        });
        handlers.put(BusinessException.class, ex -> problem(422, "Business rule violated", ex.getMessage()));
        handlers.put(Exception.class, ex -> problem(500, "Internal Server Error", "Unexpected error, ref E-1001"));  // stack trace sirf log me
    }

    Map<String, Object> handle(Exception ex, String path) {
        for (Class<?> c = ex.getClass(); c != null; c = c.getSuperclass()) {   // sabse specific handler jeetta
            Function<Exception, Map<String, Object>> h = handlers.get(c);
            if (h != null) {
                Map<String, Object> pd = h.apply(ex);
                pd.put("instance", path);
                return pd;
            }
        }
        throw new IllegalStateException("unreachable");
    }
}

public class Main {
    static final GlobalExceptionHandler advice = new GlobalExceptionHandler();

    static void call(String request, Supplier<String> controller) {
        String path = request.substring(request.indexOf(' ') + 1);
        try {
            System.out.println(request + " -> 200 " + controller.get());
        } catch (Exception ex) {                                           // DispatcherServlet -> advice
            Map<String, Object> pd = advice.handle(ex, path);
            System.out.println(request + " -> " + pd.get("status") + " application/problem+json " + pd);
        }
    }

    public static void main(String[] args) {
        call("GET /orders/1", () -> "{id:1}");
        call("GET /orders/42", () -> { throw new OrderNotFoundException(42); });
        call("POST /orders", () -> { throw new OutOfStockException("BOOK-1", 1); });
        call("POST /orders/7/coupon", () -> { throw new CouponExpiredException("SAVE10"); });
        call("GET /orders/boom", () -> { throw new IllegalStateException("NPE deep inside, db password=..."); });
    }
}`;
  const ADVICE_OUT = `GET /orders/1 -> 200 {id:1}
GET /orders/42 -> 404 application/problem+json {type=about:blank, title=Not Found, status=404, detail=Order 42 not found, instance=/orders/42}
POST /orders -> 409 application/problem+json {type=https://api.example.com/problems/out-of-stock, title=Out of stock, status=409, detail=Only 1 left for BOOK-1, sku=BOOK-1, instance=/orders}
POST /orders/7/coupon -> 422 application/problem+json {type=about:blank, title=Business rule violated, status=422, detail=Coupon SAVE10 expired, instance=/orders/7/coupon}
GET /orders/boom -> 500 application/problem+json {type=about:blank, title=Internal Server Error, status=500, detail=Unexpected error, ref E-1001, instance=/orders/boom}`;

  const VALID = `import java.lang.annotation.*;
import java.lang.reflect.*;

@Retention(RetentionPolicy.RUNTIME) @Target(ElementType.FIELD) @interface NotBlank { String message() default "must not be blank"; }
@Retention(RetentionPolicy.RUNTIME) @Target(ElementType.FIELD) @interface Min { long value(); }

interface ConstraintValidator<T> { boolean isValid(T value); }
@Retention(RetentionPolicy.RUNTIME) @Target(ElementType.ANNOTATION_TYPE)
@interface Constraint { Class<? extends ConstraintValidator<?>> validatedBy(); }

// custom constraint = annotation + validator class
@Retention(RetentionPolicy.RUNTIME) @Target(ElementType.FIELD)
@Constraint(validatedBy = CurrencyValidator.class)
@interface ValidCurrency { String message() default "unsupported currency"; }

class CurrencyValidator implements ConstraintValidator<String> {
    private static final Set<String> ALLOWED = Set.of("INR", "USD", "EUR");
    public boolean isValid(String v) { return v == null || ALLOWED.contains(v); }   // null check @NotNull ka kaam
}

class CreateOrderRequest {
    @NotBlank String item;
    @Min(1) int qty;
    @ValidCurrency String currency;
    CreateOrderRequest(String item, int qty, String currency) { this.item = item; this.qty = qty; this.currency = currency; }
    public String toString() { return "{item=" + item + ", qty=" + qty + ", currency=" + currency + "}"; }
}

class MiniValidator {                                                  // Hibernate Validator jaisa
    static Map<String, String> validate(Object bean) throws Exception {
        Map<String, String> errors = new TreeMap<>();                   // sorted: deterministic
        for (Field f : bean.getClass().getDeclaredFields()) {
            f.setAccessible(true);
            Object v = f.get(bean);
            NotBlank nb = f.getAnnotation(NotBlank.class);
            if (nb != null && (v == null || v.toString().isBlank())) errors.put(f.getName(), nb.message());
            Min min = f.getAnnotation(Min.class);
            if (min != null && ((Number) v).longValue() < min.value())
                errors.put(f.getName(), "must be greater than or equal to " + min.value());
            for (Annotation a : f.getAnnotations()) {                   // custom constraints
                Constraint c = a.annotationType().getAnnotation(Constraint.class);
                if (c == null) continue;
                @SuppressWarnings("unchecked")
                ConstraintValidator<Object> cv = (ConstraintValidator<Object>) c.validatedBy().getDeclaredConstructor().newInstance();
                if (!cv.isValid(v)) errors.put(f.getName(), (String) a.annotationType().getMethod("message").invoke(a));
            }
        }
        return errors;
    }
}

public class Main {
    static void post(CreateOrderRequest req) throws Exception {        // @PostMapping create(@Valid @RequestBody ...)
        Map<String, String> errors = MiniValidator.validate(req);
        if (errors.isEmpty()) System.out.println("POST /orders " + req + " -> 201 Created");
        else System.out.println("POST /orders " + req + " -> 400 {title=Bad Request, detail=Validation failed, errors=" + errors + "}");
    }

    public static void main(String[] args) throws Exception {
        post(new CreateOrderRequest("book", 2, "INR"));
        post(new CreateOrderRequest(" ", 0, "BTC"));
    }
}`;
  const VALID_OUT = `POST /orders {item=book, qty=2, currency=INR} -> 201 Created
POST /orders {item= , qty=0, currency=BTC} -> 400 {title=Bad Request, detail=Validation failed, errors={currency=unsupported currency, item=must not be blank, qty=must be greater than or equal to 1}}`;

  const CHAIN = `class OrderService {
    String find(String id) {
        if (id.equals("0")) throw new IllegalStateException("db down");
        return "order " + id;
    }
}

class OrderServiceAopProxy extends OrderService {                      // @Around("execution(* OrderService.*(..))")
    @Override String find(String id) {
        System.out.println("        AOP @Around before OrderService.find(" + id + ")");
        try {
            String r = super.find(id);
            System.out.println("        AOP @Around after -> " + r);
            return r;
        } catch (RuntimeException e) {
            System.out.println("        AOP @AfterThrowing: " + e.getMessage());
            throw e;
        }
    }
}

class AuthInterceptor {                                                // HandlerInterceptor
    boolean preHandle(String token) {
        boolean ok = token != null;
        System.out.println("    Interceptor preHandle: token " + (ok ? "ok" : "missing -> return false, 401"));
        return ok;
    }
    void postHandle() { System.out.println("    Interceptor postHandle (REST: body already written)"); }
    void afterCompletion() { System.out.println("    Interceptor afterCompletion (always: cleanup, metrics)"); }
}

class DispatcherServlet {
    final AuthInterceptor interceptor = new AuthInterceptor();
    final OrderService service = new OrderServiceAopProxy();          // controller ko proxy inject hota hai
    void service(String id, String token) {
        if (!interceptor.preHandle(token)) return;                    // controller kabhi call nahi hua
        try {
            System.out.println("      Controller.getOrder(" + id + ")");
            String body = service.find(id);
            interceptor.postHandle();
            System.out.println("    response 200: " + body);
        } catch (RuntimeException e) {
            System.out.println("    @ControllerAdvice -> 500 problem+json (postHandle skipped)");
        }
        interceptor.afterCompletion();
    }
}

class LoggingFilter {                                                  // servlet Filter (OncePerRequestFilter)
    void doFilter(String id, String token, DispatcherServlet next) {
        System.out.println("  Filter before (request id, CORS, Spring Security filters)");
        try {
            next.service(id, token);
        } finally {
            System.out.println("  Filter after (log status + time)");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        LoggingFilter filter = new LoggingFilter();
        DispatcherServlet ds = new DispatcherServlet();
        System.out.println("== GET /orders/7 with token");
        filter.doFilter("7", "jwt", ds);
        System.out.println("== GET /orders/7 without token");
        filter.doFilter("7", null, ds);
        System.out.println("== GET /orders/0 (service throws)");
        filter.doFilter("0", "jwt", ds);
    }
}`;
  const CHAIN_OUT = `== GET /orders/7 with token
  Filter before (request id, CORS, Spring Security filters)
    Interceptor preHandle: token ok
      Controller.getOrder(7)
        AOP @Around before OrderService.find(7)
        AOP @Around after -> order 7
    Interceptor postHandle (REST: body already written)
    response 200: order 7
    Interceptor afterCompletion (always: cleanup, metrics)
  Filter after (log status + time)
== GET /orders/7 without token
  Filter before (request id, CORS, Spring Security filters)
    Interceptor preHandle: token missing -> return false, 401
  Filter after (log status + time)
== GET /orders/0 (service throws)
  Filter before (request id, CORS, Spring Security filters)
    Interceptor preHandle: token ok
      Controller.getOrder(0)
        AOP @Around before OrderService.find(0)
        AOP @AfterThrowing: db down
    @ControllerAdvice -> 500 problem+json (postHandle skipped)
    Interceptor afterCompletion (always: cleanup, metrics)
  Filter after (log status + time)`;

  const IDEM = `class PaymentApi {
    private final Map<String, String> responses = new HashMap<>();     // key -> saved response (DB / Redis, TTL 24h)
    private final Map<String, String> requests = new HashMap<>();      // key -> request fingerprint
    int charges = 0;

    String post(String idempotencyKey, String body) {
        if (idempotencyKey != null && responses.containsKey(idempotencyKey)) {
            if (!requests.get(idempotencyKey).equals(body)) return "422 key " + idempotencyKey + " reused with a different body";
            return responses.get(idempotencyKey) + " [replayed, NOT charged again]";
        }
        charges++;                                                     // asli side effect
        String resp = "201 payment p" + charges;
        if (idempotencyKey != null) {
            responses.put(idempotencyKey, resp);
            requests.put(idempotencyKey, body);
        }
        return resp + " (charged)";
    }
}

public class Main {
    public static void main(String[] args) {
        PaymentApi api = new PaymentApi();
        System.out.println("-- POST /payments without Idempotency-Key, client retries after timeout");
        System.out.println(api.post(null, "amount=500"));
        System.out.println(api.post(null, "amount=500"));
        System.out.println("-- POST /payments with Idempotency-Key: k-777");
        System.out.println(api.post("k-777", "amount=500"));
        System.out.println(api.post("k-777", "amount=500"));
        System.out.println(api.post("k-777", "amount=900"));
        System.out.println("total charges = " + api.charges);

        System.out.println("-- PUT /orders/5 {status:PAID} twice");
        Map<Integer, String> orders = new TreeMap<>();
        orders.put(5, "PAID");
        System.out.println("after 1st PUT: " + orders);
        orders.put(5, "PAID");
        System.out.println("after 2nd PUT: " + orders + "  (same state = idempotent)");
    }
}`;
  const IDEM_OUT = `-- POST /payments without Idempotency-Key, client retries after timeout
201 payment p1 (charged)
201 payment p2 (charged)
-- POST /payments with Idempotency-Key: k-777
201 payment p3 (charged)
201 payment p3 [replayed, NOT charged again]
422 key k-777 reused with a different body
total charges = 3
-- PUT /orders/5 {status:PAID} twice
after 1st PUT: {5=PAID}
after 2nd PUT: {5=PAID}  (same state = idempotent)`;

  const PAGE = `record Order(int id, String customer, int amount) {}
record Sort(String property, boolean desc) {}
record Pageable(int page, int size, Sort sort) {}                      // ?page=0&size=3&sort=amount,desc
record Page<T>(List<T> content, int number, int size, long totalElements) {
    int totalPages() { return (int) ((totalElements + size - 1) / size); }
    boolean hasNext() { return number + 1 < totalPages(); }
}

class OrderRepository {                                                // Spring Data: findAll(Pageable)
    private final List<Order> table = List.of(new Order(1, "a", 500), new Order(2, "b", 200), new Order(3, "c", 900),
        new Order(4, "d", 200), new Order(5, "e", 700), new Order(6, "f", 100), new Order(7, "g", 900));

    Page<Order> findAll(Pageable p) {
        Comparator<Order> cmp = p.sort().property().equals("amount") ? Comparator.comparingInt(Order::amount) : Comparator.comparingInt(Order::id);
        if (p.sort().desc()) cmp = cmp.reversed();
        cmp = cmp.thenComparingInt(Order::id);                         // tie-breaker: stable pages
        List<Order> sorted = table.stream().sorted(cmp).toList();
        int from = p.page() * p.size();
        System.out.println("  SQL: select * from orders order by " + p.sort().property() + (p.sort().desc() ? " desc" : " asc")
            + ", id limit " + p.size() + " offset " + from);
        List<Order> content = sorted.subList(Math.min(from, sorted.size()), Math.min(from + p.size(), sorted.size()));
        return new Page<>(content, p.page(), p.size(), table.size());   // Page = extra count(*) query
    }
}

public class Main {
    public static void main(String[] args) {
        OrderRepository repo = new OrderRepository();
        Sort byAmountDesc = new Sort("amount", true);
        for (int page : new int[]{0, 2, 5}) {
            Page<Order> res = repo.findAll(new Pageable(page, 3, byAmountDesc));
            System.out.println("page " + res.number() + " -> ids " + res.content().stream().map(Order::id).toList()
                + ", totalElements=" + res.totalElements() + ", totalPages=" + res.totalPages() + ", hasNext=" + res.hasNext());
        }
    }
}`;
  const PAGE_OUT = `  SQL: select * from orders order by amount desc, id limit 3 offset 0
page 0 -> ids [3, 7, 5], totalElements=7, totalPages=3, hasNext=true
  SQL: select * from orders order by amount desc, id limit 3 offset 6
page 2 -> ids [6], totalElements=7, totalPages=3, hasNext=false
  SQL: select * from orders order by amount desc, id limit 3 offset 15
page 5 -> ids [], totalElements=7, totalPages=3, hasNext=false`;

  // ======================= c11 — code examples (plain Java) =======================
  const OWN = `class Order {                                                        // @OneToMany(mappedBy = "order", cascade = ALL) — INVERSE side
    final long id;
    final List<Item> items = new ArrayList<>();
    Order(long id) { this.id = id; }
    void addItem(Item i) { items.add(i); i.order = this; }               // helper: dono sides sync
}

class Item {                                                         // @ManyToOne @JoinColumn(name = "order_id") — OWNING side
    final String sku;
    Order order;
    Item(String sku) { this.sku = sku; }
}

class FakeHibernate {
    static void persist(Order o) {                                   // cascade: order ke saath items bhi
        System.out.println("  insert into orders (id) values (" + o.id + ")");
        for (Item i : o.items) insert(i);
    }
    static void insert(Item i) {                                     // FK sirf OWNING side (item.order) se likhi jaati hai
        System.out.println("  insert into items (sku, order_id) values ('" + i.sku + "', " + (i.order == null ? "null" : i.order.id) + ")");
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("== only inverse side set: order.items.add(item)");
        Order o1 = new Order(1);
        o1.items.add(new Item("book"));
        FakeHibernate.persist(o1);

        System.out.println("== helper addItem sets both sides");
        Order o2 = new Order(2);
        o2.addItem(new Item("pen"));
        FakeHibernate.persist(o2);

        System.out.println("== only owning side set: item.order = order");
        Order o3 = new Order(3);
        Item lamp = new Item("lamp");
        lamp.order = o3;
        FakeHibernate.persist(o3);
        FakeHibernate.insert(lamp);
        System.out.println("  DB correct, but in-memory o3.items.size() = " + o3.items.size() + " (stale until reload)");
    }
}`;
  const OWN_OUT = `== only inverse side set: order.items.add(item)
  insert into orders (id) values (1)
  insert into items (sku, order_id) values ('book', null)
== helper addItem sets both sides
  insert into orders (id) values (2)
  insert into items (sku, order_id) values ('pen', 2)
== only owning side set: item.order = order
  insert into orders (id) values (3)
  insert into items (sku, order_id) values ('lamp', 3)
  DB correct, but in-memory o3.items.size() = 0 (stale until reload)`;

  const LAZY = `import java.util.function.*;

class LazyInitializationException extends RuntimeException { LazyInitializationException(String m) { super(m); } }

class Session { boolean open = true; int queries = 0; }

class LazyList<T> extends AbstractList<T> {                            // Hibernate PersistentBag jaisa proxy
    private final Session session;
    private final String role;
    private final Supplier<List<T>> loader;
    private List<T> data;
    LazyList(Session session, String role, Supplier<List<T>> loader) { this.session = session; this.role = role; this.loader = loader; }
    private void init() {
        if (data != null) return;
        if (!session.open) throw new LazyInitializationException("failed to lazily initialize a collection of role: "
            + role + ": could not initialize proxy - no Session");
        session.queries++;
        System.out.println("    SQL: select * from items where order_id=1   (lazy, on first access)");
        data = loader.get();
    }
    public T get(int i) { init(); return data.get(i); }
    public int size() { init(); return data.size(); }
}

class Order {
    final long id;
    final List<String> items;
    Order(long id, List<String> items) { this.id = id; this.items = items; }
}

public class Main {
    static Order findById(Session s) {                                 // repository.findById(1)
        s.queries++;
        System.out.println("    SQL: select * from orders where id=1");
        return new Order(1, new LazyList<>(s, "Order.items", () -> List.of("book", "pen")));
    }

    public static void main(String[] args) {
        System.out.println("== 1. items touched inside @Transactional service");
        Session s1 = new Session();
        Order a = findById(s1);
        System.out.println("    items = " + a.items.size() + ", queries = " + s1.queries);

        System.out.println("== 2. open-in-view=false: controller touches items after tx closed");
        Session s2 = new Session();
        Order b = findById(s2);
        s2.open = false;                                               // service method khatam -> session closed
        try {
            b.items.size();
        } catch (LazyInitializationException e) {
            System.out.println("    LazyInitializationException: " + e.getMessage());
        }

        System.out.println("== 3. open-in-view=true (Boot default): session open till response written");
        Session s3 = new Session();
        Order c = findById(s3);
        System.out.println("    (service returned, JSON serialization touches items)");
        System.out.println("    items = " + c.items.size() + " -> works, but SQL ran from the web layer");

        System.out.println("== 4. fix: fetch join / DTO inside the service");
        Session s4 = new Session();
        s4.queries++;
        System.out.println("    SQL: select o.*, i.* from orders o left join items i on i.order_id=o.id where o.id=1");
        Order d = new Order(1, List.of("book", "pen"));
        s4.open = false;
        System.out.println("    items = " + d.items.size() + " after session closed, queries = " + s4.queries);
    }
}`;
  const LAZY_OUT = `== 1. items touched inside @Transactional service
    SQL: select * from orders where id=1
    SQL: select * from items where order_id=1   (lazy, on first access)
    items = 2, queries = 2
== 2. open-in-view=false: controller touches items after tx closed
    SQL: select * from orders where id=1
    LazyInitializationException: failed to lazily initialize a collection of role: Order.items: could not initialize proxy - no Session
== 3. open-in-view=true (Boot default): session open till response written
    SQL: select * from orders where id=1
    (service returned, JSON serialization touches items)
    SQL: select * from items where order_id=1   (lazy, on first access)
    items = 2 -> works, but SQL ran from the web layer
== 4. fix: fetch join / DTO inside the service
    SQL: select o.*, i.* from orders o left join items i on i.order_id=o.id where o.id=1
    items = 2 after session closed, queries = 1`;

  const N1 = `class QueryLog {
    final List<String> sql = new ArrayList<>();
    void run(String q) { sql.add(q); }
    void print(String title) {
        System.out.println(title + ": " + sql.size() + (sql.size() == 1 ? " query" : " queries"));
        for (String q : sql) System.out.println("  " + q);
    }
}

public class Main {
    static final Map<Integer, List<String>> ITEMS = new TreeMap<>(Map.of(
        1, List.of("book", "pen"), 2, List.of("mug"), 3, List.of("lamp", "bag"), 4, List.of("cup")));
    static final String JOIN = "select o.*, i.* from orders o left join items i on i.order_id=o.id";

    public static void main(String[] args) {
        QueryLog lazy = new QueryLog();                                // for (Order o : findAll()) o.getItems().size()
        lazy.run("select * from orders");
        int total = 0;
        for (int id : ITEMS.keySet()) {
            lazy.run("select * from items where order_id=" + id);        // har order pe ek extra query
            total += ITEMS.get(id).size();
        }
        lazy.print("lazy loop (N+1, N=" + ITEMS.size() + ")");

        QueryLog fetchJoin = new QueryLog();                           // @Query("select o from Order o left join fetch o.items")
        fetchJoin.run(JOIN);
        fetchJoin.print("1) JPQL join fetch");

        QueryLog graph = new QueryLog();                               // @EntityGraph(attributePaths = items)
        graph.run(JOIN);
        graph.print("2) @EntityGraph");

        QueryLog batch = new QueryLog();                               // @BatchSize(size = 3) / default_batch_fetch_size
        batch.run("select * from orders");
        List<Integer> ids = new ArrayList<>(ITEMS.keySet());
        for (int i = 0; i < ids.size(); i += 3)
            batch.run("select * from items where order_id in " + ids.subList(i, Math.min(i + 3, ids.size())));
        batch.print("3) batch fetching, size 3");

        System.out.println("same data every time: total items = " + total);
    }
}`;
  const N1_OUT = `lazy loop (N+1, N=4): 5 queries
  select * from orders
  select * from items where order_id=1
  select * from items where order_id=2
  select * from items where order_id=3
  select * from items where order_id=4
1) JPQL join fetch: 1 query
  select o.*, i.* from orders o left join items i on i.order_id=o.id
2) @EntityGraph: 1 query
  select o.*, i.* from orders o left join items i on i.order_id=o.id
3) batch fetching, size 3: 3 queries
  select * from orders
  select * from items where order_id in [1, 2, 3]
  select * from items where order_id in [4]
same data every time: total items = 6`;

  const STATES = `class Product {
    Long id;
    String name;
    int price;
    Product(Long id, String name, int price) { this.id = id; this.name = name; this.price = price; }
    String row() { return id + ", " + name + ", " + price; }
}

class MiniEntityManager {
    final Map<Long, String> db;                                        // table: id -> row
    private final Map<Long, Product> context = new LinkedHashMap<>();  // persistence context (1st-level cache)
    private final Map<Long, String> snapshot = new HashMap<>();        // load ke time ki copy -> dirty checking
    private final Set<Long> newOnes = new HashSet<>(), removed = new HashSet<>();
    private long seq = 0;
    MiniEntityManager(Map<Long, String> db) { this.db = db; }

    String state(Product p) {
        if (p.id == null) return "TRANSIENT";
        if (context.get(p.id) != p) return "DETACHED";
        return removed.contains(p.id) ? "REMOVED" : "MANAGED";
    }
    void persist(Product p) {
        if (p.id != null) throw new IllegalStateException("PersistentObjectException: detached entity passed to persist: Product#" + p.id);
        p.id = ++seq;
        context.put(p.id, p);
        newOnes.add(p.id);
    }
    Product find(long id) {
        Product p = context.get(id);
        if (p != null) { System.out.println("   find(" + id + "): from persistence context, no SQL"); return p; }
        System.out.println("   SQL: select * from product where id=" + id);
        String[] r = db.get(id).split(", ");
        p = new Product(id, r[1], Integer.parseInt(r[2]));
        context.put(id, p);
        snapshot.put(id, p.row());
        return p;
    }
    Product merge(Product detached) {
        Product managed = find(detached.id);                           // context me nahi -> select
        managed.name = detached.name;                                  // state COPY hoti hai
        managed.price = detached.price;
        return managed;                                                // naya managed object; argument detached hi rehta
    }
    void remove(Product p) {
        if (!state(p).equals("MANAGED")) throw new IllegalArgumentException("Removing a detached instance Product#" + p.id);
        removed.add(p.id);
    }
    void flush() {
        int writes = 0;
        for (Product p : context.values()) {
            if (removed.contains(p.id)) { db.remove(p.id); System.out.println("   SQL: delete from product where id=" + p.id); writes++; }
            else if (newOnes.contains(p.id)) { db.put(p.id, p.row()); System.out.println("   SQL: insert into product values (" + p.row() + ")"); writes++; }
            else if (!p.row().equals(snapshot.get(p.id))) {
                db.put(p.id, p.row());
                System.out.println("   SQL: update product set name='" + p.name + "', price=" + p.price + " where id=" + p.id);
                writes++;
            }
            snapshot.put(p.id, p.row());
        }
        context.keySet().removeAll(removed);
        newOnes.clear();
        removed.clear();
        if (writes == 0) System.out.println("   flush: nothing to write");
    }
    void clear() { context.clear(); snapshot.clear(); newOnes.clear(); removed.clear(); }
}

public class Main {
    public static void main(String[] args) {
        Map<Long, String> db = new TreeMap<>();
        MiniEntityManager em = new MiniEntityManager(db);
        Product p = new Product(null, "pen", 10);
        System.out.println("1. new Product -> " + em.state(p));
        em.persist(p);
        System.out.println("2. persist -> " + em.state(p) + " (insert waits for flush/commit)");
        em.flush();
        p.price = 12;
        System.out.println("3. only a setter, no save() call:");
        em.flush();
        System.out.println("4. find(1) again:");
        Product again = em.find(1);
        System.out.println("   same object as p: " + (again == p));
        em.clear();
        p.price = 15;
        System.out.println("5. clear() -> p is " + em.state(p) + ", set price 15:");
        em.flush();
        try {
            em.persist(p);
        } catch (IllegalStateException e) {
            System.out.println("6. persist(detached) -> " + e.getMessage());
        }
        System.out.println("7. merge(detached):");
        Product m = em.merge(p);
        System.out.println("   returned same object? " + (m == p) + " | m " + em.state(m) + ", p " + em.state(p));
        em.flush();
        em.remove(m);
        System.out.println("8. remove(m) -> " + em.state(m));
        em.flush();
        try {
            em.remove(p);
        } catch (IllegalArgumentException e) {
            System.out.println("9. remove(detached) -> " + e.getMessage());
        }
        System.out.println("db = " + db);
    }
}`;
  const STATES_OUT = `1. new Product -> TRANSIENT
2. persist -> MANAGED (insert waits for flush/commit)
   SQL: insert into product values (1, pen, 10)
3. only a setter, no save() call:
   SQL: update product set name='pen', price=12 where id=1
4. find(1) again:
   find(1): from persistence context, no SQL
   same object as p: true
5. clear() -> p is DETACHED, set price 15:
   flush: nothing to write
6. persist(detached) -> PersistentObjectException: detached entity passed to persist: Product#1
7. merge(detached):
   SQL: select * from product where id=1
   returned same object? false | m MANAGED, p DETACHED
   SQL: update product set name='pen', price=15 where id=1
8. remove(m) -> REMOVED
   SQL: delete from product where id=1
9. remove(detached) -> Removing a detached instance Product#1
db = {}`;

  const LOCK = `class AccountRow {                                                   // table row
    int balance = 1000, version = 0;
    int update(int newBalance, int expectedVersion) {                 // update account set balance=?, version=version+1
        if (expectedVersion != version) return 0;                     //   where id=1 and version=?
        balance = newBalance;
        version++;
        return 1;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("-- no @Version: lost update");
        AccountRow r0 = new AccountRow();
        int alice0 = r0.balance, bob0 = r0.balance;
        r0.balance = alice0 - 300;                                     // alice saves
        r0.balance = bob0 - 500;                                       // bob saves stale value on top
        System.out.println("alice -300, bob -500, final balance = " + r0.balance + " (expected 200, alice's write lost)");

        System.out.println("-- optimistic: @Version");
        AccountRow r = new AccountRow();
        int aBal = r.balance, aVer = r.version, bBal = r.balance, bVer = r.version;
        System.out.println("alice + bob read balance=" + aBal + " v" + aVer);
        int rows = r.update(aBal - 300, aVer);
        System.out.println("alice: where version=" + aVer + " -> " + rows + " row, now " + r.balance + " v" + r.version);
        rows = r.update(bBal - 500, bVer);
        System.out.println("bob:   where version=" + bVer + " -> " + rows + " rows -> ObjectOptimisticLockingFailureException");
        bBal = r.balance; bVer = r.version;                            // retry: fresh read
        rows = r.update(bBal - 500, bVer);
        System.out.println("bob retry: read " + bBal + " v" + bVer + " -> " + rows + " row, now " + r.balance + " v" + r.version);

        System.out.println("-- pessimistic: select ... for update");
        AccountRow p = new AccountRow();
        String lockOwner = "alice";
        System.out.println("alice: select ... for update -> row locked by " + lockOwner);
        System.out.println("bob:   select ... for update -> BLOCKED, waits for " + lockOwner + " to commit");
        p.balance -= 300;
        lockOwner = "bob";
        System.out.println("alice: commit balance=" + p.balance + ", lock passes to " + lockOwner);
        p.balance -= 500;
        System.out.println("bob:   reads fresh " + (p.balance + 500) + ", commit balance=" + p.balance);
    }
}`;
  const LOCK_OUT = `-- no @Version: lost update
alice -300, bob -500, final balance = 500 (expected 200, alice's write lost)
-- optimistic: @Version
alice + bob read balance=1000 v0
alice: where version=0 -> 1 row, now 700 v1
bob:   where version=0 -> 0 rows -> ObjectOptimisticLockingFailureException
bob retry: read 700 v1 -> 1 row, now 200 v2
-- pessimistic: select ... for update
alice: select ... for update -> row locked by alice
bob:   select ... for update -> BLOCKED, waits for alice to commit
alice: commit balance=700, lock passes to bob
bob:   reads fresh 700, commit balance=200`;

  const DERIVED = `class DerivedQuery {                                                // Spring Data method-name parser (bahut simplified)
    static final Set<String> PROPS = Set.of("id", "status", "amount", "createdAt", "customerId", "note");

    static String prop(String p) {
        String name = Character.toLowerCase(p.charAt(0)) + p.substring(1);
        if (!PROPS.contains(name))
            throw new IllegalArgumentException("PropertyReferenceException: No property '" + name + "' found for type 'Order'");
        return "o." + name;
    }
    static String cut(String s, int n) { return s.substring(0, s.length() - n); }

    static String toJpql(String method) {
        int by = method.indexOf("By");
        String subject = method.substring(0, by), rest = method.substring(by + 2), order = "", limit = "";
        int ob = rest.indexOf("OrderBy");
        if (ob >= 0) {
            String o = rest.substring(ob + 7);
            boolean desc = o.endsWith("Desc");
            String p = desc ? cut(o, 4) : o.endsWith("Asc") ? cut(o, 3) : o;
            order = " order by " + prop(p) + (desc ? " desc" : " asc");
            rest = rest.substring(0, ob);
        }
        if (subject.startsWith("findTop")) limit = "  [maxResults=" + subject.substring(7) + "]";
        List<String> where = new ArrayList<>();
        int param = 1;
        for (String part : rest.split("And")) {
            if (part.endsWith("GreaterThan")) where.add(prop(cut(part, 11)) + " > ?" + param++);
            else if (part.endsWith("LessThan")) where.add(prop(cut(part, 8)) + " < ?" + param++);
            else if (part.endsWith("Between")) where.add(prop(cut(part, 7)) + " between ?" + param++ + " and ?" + param++);
            else if (part.endsWith("Containing")) where.add(prop(cut(part, 10)) + " like ?" + param++ + " (bound as %value%)");
            else if (part.endsWith("IsNull")) where.add(prop(cut(part, 6)) + " is null");
            else where.add(prop(part) + " = ?" + param++);
        }
        String select = subject.startsWith("count") ? "select count(o)" : "select o";
        return select + " from Order o where " + String.join(" and ", where) + order + limit;
    }
}

public class Main {
    public static void main(String[] args) {
        String[] methods = {
            "findByStatus",
            "findByStatusAndAmountGreaterThanOrderByCreatedAtDesc",
            "countByStatus",
            "findTop3ByCustomerIdOrderByAmountDesc",
            "findByCreatedAtBetween",
            "findByNoteContaining",
            "findByStatsu"
        };
        for (String m : methods) {
            System.out.println(m);
            try {
                System.out.println("  -> " + DerivedQuery.toJpql(m));
            } catch (IllegalArgumentException e) {
                System.out.println("  -> app startup FAILS: " + e.getMessage());
            }
        }
    }
}`;
  const DERIVED_OUT = `findByStatus
  -> select o from Order o where o.status = ?1
findByStatusAndAmountGreaterThanOrderByCreatedAtDesc
  -> select o from Order o where o.status = ?1 and o.amount > ?2 order by o.createdAt desc
countByStatus
  -> select count(o) from Order o where o.status = ?1
findTop3ByCustomerIdOrderByAmountDesc
  -> select o from Order o where o.customerId = ?1 order by o.amount desc  [maxResults=3]
findByCreatedAtBetween
  -> select o from Order o where o.createdAt between ?1 and ?2
findByNoteContaining
  -> select o from Order o where o.note like ?1 (bound as %value%)
findByStatsu
  -> app startup FAILS: PropertyReferenceException: No property 'statsu' found for type 'Order'`;

  // =================================================================
  L.c9 = {
    kind: 'th', title: 'Spring Boot internals and configuration', topic: 'Spring',
    goal: '<code>@SpringBootApplication</code> ke andar kya hai, auto-configuration kaise decide karta hai ki kaunsa bean banana hai (<code>@Conditional*</code> + <code>AutoConfiguration.imports</code>), starters + exclude, profiles + property precedence + <code>@ConfigurationProperties</code>, Actuator production me safely, aur embedded server + startup flow — sab <b>plain Java simulation + output</b> se, asli Boot code <code>pre</code> me, aur planner ke <b>6 interview questions</b> ke 30–60 sec English answers.',
    oneLine: 'Boot = c8 ka Spring container + opinions: @SpringBootApplication (config + auto-config + scan), auto-config = classpath / properties / existing beans dekh ke conditional @Bean, tumhara bean hamesha jeetta (@ConditionalOnMissingBean), properties ka clear priority order, aur ek embedded server jo jar ke andar hi chalta hai.',
    parts: [
      { title: '🧩 Concept — @SpringBootApplication = 3 annotations ka combo', blocks: [
        { p: 'Kal (c8) humne dekha: Spring container beans banata hai, <code>@Configuration</code> + <code>@Bean</code> se wiring hoti hai, <code>@Component</code> scan se classes milti hain. <b>Spring Boot</b> uske upar ek layer hai: wo khud hi bahut saare <code>@Configuration</code> classes (auto-configurations) laata hai jo tumhare classpath ke hisaab se DataSource, ObjectMapper, Tomcat, Jackson converters waghera bana deti hain. Entry point hai <code>@SpringBootApplication</code>.' },
        { table: { head: ['Andar ki annotation', 'Kya karti hai'], rows: [
          ['<code>@SpringBootConfiguration</code>', 'Asal me <code>@Configuration</code> hi hai (meta-annotated) — main class me <code>@Bean</code> methods likh sakte ho; tests (<code>@SpringBootTest</code>) isi ko dhoondhte hain.'],
          ['<code>@EnableAutoConfiguration</code>', 'Auto-configuration on: <code>AutoConfigurationImportSelector</code> saare jars se <code>AutoConfiguration.imports</code> padh ke conditional configs load karta hai.'],
          ['<code>@ComponentScan</code>', 'Main class ke <b>package aur sub-packages</b> scan — <code>@Component</code>, <code>@Service</code>, <code>@Repository</code>, <code>@RestController</code>, <code>@Configuration</code>. Bahar ke package wali class nahi milegi.'],
        ] } },
        { p: 'Ye ek <b>composed (meta) annotation</b> hai — Java annotation ke upar annotations. Spring <code>MergedAnnotations</code> se recursively dekhta hai, isliye <code>@Configuration</code> (do level neeche) bhi "present" maana jaata hai. Plain Java reflection se same idea:' },
        { code: META },
        { pre: out(META_OUT) },
        { pre: `package com.shop;                                   // base package — isliye main class ROOT package me rakho

@SpringBootApplication(
    exclude = DataSourceAutoConfiguration.class,    // ek auto-config band
    scanBasePackages = {"com.shop", "com.audit"}    // default package ke bahar bhi scan karna ho toh
)
public class ShopApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShopApplication.class, args);
    }
}

// Lagbhag barabar:
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = CUSTOM, classes = TypeExcludeFilter.class),
                                  @Filter(type = CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public class ShopApplication { ... }` },
        { tip: 'Classic bug: <code>com.audit.AuditListener</code> pe <code>@Component</code> hai par bean bana hi nahi → kyunki main class <code>com.shop</code> me hai. Fix: package structure theek karo ya <code>scanBasePackages</code>.' },
      ] },
      { title: '⚙️ Auto-configuration — @Conditional + AutoConfiguration.imports', blocks: [
        { olist: [
          '<code>@EnableAutoConfiguration</code> → <code>AutoConfigurationImportSelector</code> (ek <b>DeferredImportSelector</b> — matlab tumhari apni <code>@Configuration</code> classes <b>pehle</b> process hoti hain).',
          'Ye har jar ki <code>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</code> file padhta hai (Boot <b>2.7</b> me aayi; Boot <b>3.0</b> se auto-configs ke liye <code>spring.factories</code> support hata diya gaya). File me har line ek auto-config class ka naam.',
          'Har auto-config class <code>@AutoConfiguration</code> hai (proxyBeanMethods = false — c8 wala lite mode) aur uspe / uske <code>@Bean</code> methods pe <b>conditions</b> lagi hain.',
          'Conditions pass → beans register; fail → poori class ya woh bean skip ("back off").',
          '<code>--debug</code> / <code>debug=true</code> → startup pe <b>CONDITIONS EVALUATION REPORT</b> (positive / negative matches). Actuator me <code>/actuator/conditions</code>.',
        ] },
        { table: { head: ['Condition', 'Kab match'], rows: [
          ['<code>@ConditionalOnClass</code> / <code>OnMissingClass</code>', 'Koi class classpath pe hai / nahi (jaise <code>HikariDataSource</code>) — starter add kiya toh feature on'],
          ['<code>@ConditionalOnMissingBean</code>', 'Us type ka bean <b>pehle se nahi</b> hai — isi wajah se <b>tumhara bean jeetta</b> hai'],
          ['<code>@ConditionalOnBean</code>', 'Koi bean pehle se hai (jaise DataSource hai toh JdbcTemplate)'],
          ['<code>@ConditionalOnProperty</code>', 'Property ki value match (<code>havingValue</code>, <code>matchIfMissing</code>) — feature flags'],
          ['<code>@ConditionalOnWebApplication</code>', 'Servlet / reactive web app hai'],
          ['<code>@ConditionalOnResource</code>, <code>OnExpression</code>, <code>OnSingleCandidate</code>', 'File hai, SpEL true, ek hi candidate bean'],
        ] } },
        { code: AUTO },
        { pre: out(AUTO_OUT) },
        { pre: `// Boot ki apni auto-config ka simplified roop
@AutoConfiguration(before = SqlInitializationAutoConfiguration.class)
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration { ... }

// Apni custom auto-config (company ka shared library / starter)
@AutoConfiguration
@ConditionalOnClass(AuditClient.class)
@EnableConfigurationProperties(AuditProperties.class)
public class AuditAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean                              // app khud AuditClient de toh ye back off
    @ConditionalOnProperty(prefix = "audit", name = "enabled", havingValue = "true", matchIfMissing = true)
    public AuditClient auditClient(AuditProperties props) {
        return new AuditClient(props.getUrl());
    }
}

# src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
com.acme.audit.AuditAutoConfiguration` },
        { tip: 'Interview line: "Auto-configuration is just conditional @Configuration classes; my own beans are registered first, and most auto-config beans are @ConditionalOnMissingBean, so I can override any default by declaring my own bean."' },
      ] },
      { title: '📦 Starters aur auto-config exclude karna', blocks: [
        { p: '<b>Starter</b> = ek <b>dependency descriptor</b>: ek pom jisme (lagbhag) koi code nahi, bas sahi versions wali dependencies ka bundle + related autoconfigure module. <code>spring-boot-starter-web</code> laata hai Spring MVC + Jackson + <code>spring-boot-starter-tomcat</code>. Versions <b>spring-boot-dependencies BOM</b> (parent / dependency management) manage karta hai — tum version nahi likhte.' },
        { table: { head: ['Starter', 'Kya laata hai'], rows: [
          ['<code>spring-boot-starter-web</code>', 'Spring MVC, Jackson, embedded Tomcat'],
          ['<code>spring-boot-starter-data-jpa</code>', 'Hibernate, Spring Data JPA, HikariCP, JDBC'],
          ['<code>spring-boot-starter-validation</code>', 'Hibernate Validator (Bean Validation) — Boot 2.3 se web starter me nahi aata'],
          ['<code>spring-boot-starter-actuator</code>', 'Health, metrics (Micrometer), endpoints'],
          ['<code>spring-boot-starter-test</code>', 'JUnit 5, Mockito, AssertJ, Spring Test'],
        ] } },
        { p: '<b>Exclude ke 3 tareeke</b>: (1) annotation me <code>exclude</code> (class) ya <code>excludeName</code> (string, jab class classpath pe na ho), (2) property <code>spring.autoconfigure.exclude</code>, (3) test slices / <code>@ImportAutoConfiguration</code>. Upar wale AUTO demo ka scenario 2 dekho — excluded config ki conditions check hi nahi hui.' },
        { pre: `@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class, SecurityAutoConfiguration.class })
public class ShopApplication { }

# application.yml
spring:
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration

# Custom starter naming convention
#   acme-audit-spring-boot-starter      (spring-boot-* prefix sirf official starters ke liye)
#   acme-audit-spring-boot-autoconfigure` },
        { tip: 'Exclude se pehle socho: aksar zarurat sirf <b>apna bean declare</b> karne ki hoti hai (ConditionalOnMissingBean back off kar dega) ya ek property set karne ki.' },
      ] },
      { title: '🗂️ Profiles, property precedence, @ConfigurationProperties vs @Value', blocks: [
        { p: '<b>Profile</b> = environment ka naam (dev / test / prod). <code>spring.profiles.active=prod</code> → <code>application.yml</code> ke saath <code>application-prod.yml</code> bhi load, aur profile-specific values jeetti hain. Beans pe <code>@Profile("prod")</code> → sirf us profile me bean. Ek hi yml me multiple documents (<code>---</code>) + <code>spring.config.activate.on-profile</code> (Boot 2.4+).' },
        { table: { head: ['Priority (upar = jeetta)', 'Source'], rows: [
          ['1', 'Command-line args <code>--server.port=9090</code> (tests me <code>@TestPropertySource</code> / test properties isse bhi upar)'],
          ['2', '<code>SPRING_APPLICATION_JSON</code>'],
          ['3', 'Java system properties <code>-Dserver.port=9090</code>'],
          ['4', 'OS environment variables <code>SERVER_PORT=9090</code> (relaxed binding: <code>.</code> → <code>_</code>, uppercase, dash hatao)'],
          ['5', 'Profile-specific config: <code>application-prod.yml</code> (jar ke bahar wali &gt; jar ke andar wali)'],
          ['6', '<code>application.yml</code> / <code>.properties</code> (bahar &gt; andar)'],
          ['7', '<code>@PropertySource</code> classes, phir <code>SpringApplication.setDefaultProperties</code>'],
        ] } },
        { code: PROPS },
        { pre: out(PROPS_OUT) },
        { table: { head: ['', '@ConfigurationProperties', '@Value'], rows: [
          ['Kya bind', 'Poora group (prefix) ek typed object / record me', 'Ek single value'],
          ['Relaxed binding', '<b>Haan</b> — <code>timeout-ms</code>, <code>timeoutMs</code>, <code>APP_PAYMENT_TIMEOUTMS</code> sab chalta', 'Limited'],
          ['Validation', '<code>@Validated</code> + <code>@NotNull</code>, <code>@Min</code> — startup pe fail fast', 'Nahi (manually)'],
          ['SpEL', 'Nahi', '<b>Haan</b> <code>#{...}</code>'],
          ['IDE autocomplete / metadata', 'Haan (<code>spring-boot-configuration-processor</code>)', 'Nahi'],
          ['Kab', 'Config groups: payment client, retry, feature settings', 'Ek-do quick values, default ke saath'],
        ] } },
        { pre: `# application.yml
app:
  payment:
    timeout-ms: 5000
    retries: 3
---
spring:
  config:
    activate:
      on-profile: prod
app:
  payment:
    timeout-ms: 2000

@ConfigurationProperties(prefix = "app.payment")
@Validated
public record PaymentProperties(@Min(100) int timeoutMs, @Min(0) int retries) { }   // Boot 3: single constructor binding

@SpringBootApplication
@ConfigurationPropertiesScan                     // ya @EnableConfigurationProperties(PaymentProperties.class)
public class ShopApplication { }

@Service
public class PaymentClient {
    public PaymentClient(PaymentProperties props,
                         @Value("\${app.beta.enabled:false}") boolean beta) { ... }   // @Value + default
}

# Run: java -jar shop.jar --spring.profiles.active=prod --server.port=9090
#      SPRING_DATASOURCE_URL=jdbc:postgresql://prod-db/shop java -jar shop.jar` },
        { tip: 'Secrets (DB password, API keys) yml me commit mat karo — env vars / secret manager (Vault, cloud secrets) se do; env var precedence me yml se upar hai, isliye ye naturally override karta hai.' },
      ] },
      { title: '🩺 Actuator — production me kya expose karna aur kaise secure', blocks: [
        { p: 'Actuator production-ready endpoints deta hai. Boot 3 me default sirf <b><code>health</code></b> HTTP pe exposed hai (JMX alag). <code>shutdown</code> default disabled hai. Expose karna = <code>management.endpoints.web.exposure.include</code>; <code>exclude</code> hamesha jeetta hai.' },
        { table: { head: ['Endpoint', 'Production me?', 'Kyun'], rows: [
          ['<code>health</code> (+ <code>/health/liveness</code>, <code>/health/readiness</code>)', '<b>Haan</b> — load balancer / Kubernetes probes', 'Details sirf authorized ko (<code>show-details: when-authorized</code>)'],
          ['<code>info</code>', 'Haan', 'Version, git commit — debugging'],
          ['<code>metrics</code>, <code>prometheus</code>', 'Haan, <b>protected</b> ya internal port', 'Monitoring (Micrometer → Prometheus / Grafana)'],
          ['<code>loggers</code>', 'Shayad, sirf admin', 'POST se runtime log level badal sakte ho — powerful, isliye secure'],
          ['<code>env</code>, <code>configprops</code>', '<b>Nahi</b> (ya strict admin only)', 'Config / secrets leak (Boot 3 values default mask karta hai, phir bhi risky)'],
          ['<code>heapdump</code>, <code>threaddump</code>, <code>beans</code>, <code>mappings</code>', '<b>Nahi</b>', 'Heap dump me passwords / tokens / user data ho sakta hai; internals leak'],
          ['<code>shutdown</code>', '<b>Kabhi nahi</b>', 'Ek POST se app band'],
        ] } },
        { code: ACT },
        { pre: out(ACT_OUT) },
        { pre: `# application-prod.yml
management:
  server:
    port: 8081                         # actuator alag port pe -> sirf internal network / k8s
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
        exclude: env
  endpoint:
    health:
      show-details: when-authorized
      probes:
        enabled: true                  # /actuator/health/liveness, /readiness

@Bean
SecurityFilterChain actuatorSecurity(HttpSecurity http) throws Exception {
    http.securityMatcher(EndpointRequest.toAnyEndpoint())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(EndpointRequest.to(HealthEndpoint.class, InfoEndpoint.class)).permitAll()
            .anyRequest().hasRole("ACTUATOR"))
        .httpBasic(Customizer.withDefaults());
    return http.build();
}` },
      ] },
      { title: '🚀 Embedded server (Tomcat → Jetty) aur startup flow', blocks: [
        { p: 'Boot app ek <b>executable fat jar</b> hai jisme server (Tomcat default) andar embedded hai — <code>java -jar app.jar</code> aur chal gaya, alag server install / WAR deploy nahi. Server choose karna bhi <b>auto-config</b> hai: Tomcat, Jetty, Undertow ke factory configs <code>@ConditionalOnClass</code> + <code>@ConditionalOnMissingBean(ServletWebServerFactory)</code> ke saath hain, Tomcat pehle check hota hai. Isliye Jetty chahiye toh <b>Tomcat starter exclude</b> karna zaroori hai, warna Tomcat hi jeetega.' },
        { code: BOOT },
        { pre: out(BOOT_OUT) },
        { pre: `<!-- Maven -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
  <exclusions>
    <exclusion>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-tomcat</artifactId>
    </exclusion>
  </exclusions>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>

// Gradle
implementation('org.springframework.boot:spring-boot-starter-web') {
    exclude group: 'org.springframework.boot', module: 'spring-boot-starter-tomcat'
}
implementation 'org.springframework.boot:spring-boot-starter-jetty'

# server tuning (kisi bhi server pe)
server.port=8080
server.shutdown=graceful` },
        { olist: [
          '<code>SpringApplication.run()</code> → web application type deduce (SERVLET / REACTIVE / NONE) classpath se.',
          'Environment prepare: property sources, active profiles, <code>application.yml</code> load.',
          'Banner print, sahi <code>ApplicationContext</code> create.',
          'Bean definitions load: main class → component scan → auto-config imports (conditions evaluate).',
          '<code>refresh()</code>: BeanFactoryPostProcessors → <code>onRefresh()</code> me embedded web server create → saare non-lazy singletons bante hain (c8 lifecycle, BPP, proxies).',
          'Web server port pe start → <code>ApplicationStartedEvent</code> → <code>CommandLineRunner</code> / <code>ApplicationRunner</code> → <code>ApplicationReadyEvent</code> (ab traffic lo).',
        ] },
      ] },
      { title: '🎤 Interview — planner ke 6 questions (English answers)', blocks: [
        { tip: 'Ye answers <b>shop / order / payment</b> wale generic examples use karte hain — interview se pehle inhe <b>apne asli project</b> ki cheezon se badlo: kaunse starters the, kaunsi auto-config exclude ki, kaunse profiles, Actuator kaise secure kiya. Follow-up wahi se aata hai.' },
        { qa: [
          ['What does @SpringBootApplication do?', 'It is a convenience annotation that combines three annotations. <code>@SpringBootConfiguration</code>, which is a specialised <code>@Configuration</code>, so the main class can declare beans and tests can find it. <code>@EnableAutoConfiguration</code>, which imports the auto-configuration classes listed by all jars on the classpath and applies them conditionally. And <code>@ComponentScan</code>, which scans the package of the main class and all its sub-packages for components. That is why the main class should sit in the root package. It also lets me exclude auto-configurations with <code>exclude</code> or <code>excludeName</code>, and change the scan with <code>scanBasePackages</code>.'],
          ['How does auto-configuration work (@Conditional annotations, AutoConfiguration.imports)?', '<code>@EnableAutoConfiguration</code> uses <code>AutoConfigurationImportSelector</code>, a deferred import selector, so my own configuration is processed first. It reads <code>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</code> from every jar — this file replaced <code>spring.factories</code> for auto-configuration in Boot 2.7 and 3.0. Each listed class is an <code>@AutoConfiguration</code> guarded by conditions such as <code>@ConditionalOnClass</code>, <code>@ConditionalOnMissingBean</code>, <code>@ConditionalOnProperty</code> and <code>@ConditionalOnWebApplication</code>. If Hikari is on the classpath and I have not defined a DataSource, Boot creates one from <code>spring.datasource.*</code>. Because most beans are <code>@ConditionalOnMissingBean</code>, declaring my own bean overrides the default. To see the decisions I run with <code>--debug</code> and read the conditions evaluation report.'],
          ['What is a starter? How do you exclude an auto-configuration?', 'A starter is a dependency descriptor: a small artifact with no real code that pulls in a tested set of dependencies for one capability, plus the related auto-configuration. For example <code>spring-boot-starter-web</code> brings Spring MVC, Jackson and embedded Tomcat, and the versions come from the Spring Boot BOM. To exclude an auto-configuration I use <code>@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)</code>, <code>excludeName</code> with the class name as a string, or the <code>spring.autoconfigure.exclude</code> property. Often an exclude is not even needed, because defining my own bean makes the auto-configured one back off.'],
          ['Profiles and property precedence; @ConfigurationProperties vs @Value.', 'Profiles group environment-specific configuration: with <code>spring.profiles.active=prod</code>, Boot loads <code>application-prod.yml</code> on top of <code>application.yml</code>, and beans marked <code>@Profile("prod")</code> are created. For precedence, the main rule is that external sources beat packaged ones: command-line arguments win over Java system properties, which win over OS environment variables, which win over profile-specific files, which win over the default <code>application.yml</code>. So in production I override values with environment variables or arguments without rebuilding. <code>@ConfigurationProperties</code> binds a whole prefix into a typed object or record, with relaxed binding, validation through <code>@Validated</code> and IDE metadata, so I use it for groups of settings. <code>@Value</code> injects a single value, supports SpEL and defaults, and I keep it for one-off values.'],
          ['Which Actuator endpoints would you expose in production, and how do you secure them?', 'In Boot 3 only <code>health</code> is exposed over HTTP by default. In production I expose <code>health</code> with liveness and readiness probes for Kubernetes, <code>info</code> for the build version, and <code>metrics</code> or <code>prometheus</code> for monitoring. I do not expose <code>env</code>, <code>configprops</code>, <code>heapdump</code>, <code>threaddump</code>, <code>beans</code> or <code>shutdown</code>, because they can leak secrets and internals or affect the running app. To secure them I move management to a separate port reachable only from the internal network, add a Spring Security filter chain that permits only health and info and requires an admin role for the rest, and set health <code>show-details</code> to <code>when-authorized</code>.'],
          ['Embedded server: how to switch Tomcat to Jetty; the startup flow at a high level.', 'Boot packages the server inside an executable jar, and choosing it is itself auto-configuration: there are factory configurations for Tomcat, Jetty and Undertow, each conditional on its classes and on no other web server factory bean, and Tomcat is checked first. So to switch, I exclude <code>spring-boot-starter-tomcat</code> from the web starter and add <code>spring-boot-starter-jetty</code>; if I forget the exclusion, Tomcat still wins. Startup at a high level: <code>SpringApplication.run</code> deduces the application type from the classpath, prepares the Environment with property sources and profiles, creates the application context, loads bean definitions through component scanning and auto-configuration, and refreshes the context. During refresh the embedded server is created and the singletons are instantiated, then the server starts, the runners execute, and the ApplicationReadyEvent is published.'],
        ] },
        { say: [
          ['Aise bolo — auto-config apne project se (45 sec)', 'In our service we just added the web, data JPA, validation and actuator starters, and Spring Boot configured Tomcat, Jackson, a Hikari DataSource and the JPA EntityManager from our properties. When we needed a custom ObjectMapper with our date format, we simply declared our own bean, and the Jackson auto-configuration backed off because of ConditionalOnMissingBean. Environment differences live in profile files, and secrets come from environment variables, which override the yml. In production only health, info and prometheus are exposed, on a separate management port, and the rest are protected.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          'Main class ko sub-package me rakhna (<code>com.shop.app</code>) → <code>com.shop.order</code> ke beans scan hi nahi hote.',
          '"Auto-config magic hai" bolna — nahi, ye bas <b>conditional @Configuration classes</b> hain; <code>--debug</code> report se sab dikhta hai.',
          'Boot 3 me custom auto-config ko <code>spring.factories</code> me register karna — ab <code>AutoConfiguration.imports</code> chahiye.',
          'Jetty starter add kiya par Tomcat exclude nahi kiya → Tomcat hi chalega.',
          '<code>exposure.include=*</code> production me — heapdump / env bhi public ho jaate hain.',
          'Secrets <code>application.yml</code> me commit karna; env var / secret manager use karo.',
          '<code>@Value</code> se 15 related properties inject karna — <code>@ConfigurationProperties</code> record banao, validate karo.',
          'Profile-specific file ka naam galat (<code>application.prod.yml</code>) — sahi hai <code>application-prod.yml</code>.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['<code>application.yml</code> me <code>server.port=8080</code>, env var <code>SERVER_PORT=7070</code>, run kiya <code>java -jar app.jar --server.port=9090</code>. Port?', '<b>9090</b> — command-line args sabse upar, phir env var (7070), phir yml.'],
          ['Tumne apna <code>ObjectMapper</code> @Bean banaya. <code>JacksonAutoConfiguration</code> ka ObjectMapper bhi banega?', '<b>Nahi</b> — uska bean <code>@ConditionalOnMissingBean</code> hai; tumhara pehle register hua, auto-config back off.'],
          ['Boot 3 app, sirf <code>spring-boot-starter-actuator</code> add kiya, koi property nahi. <code>GET /actuator/metrics</code>?', '<b>404</b> — default sirf <code>health</code> HTTP pe exposed hai.'],
          ['<code>pom.xml</code> me starter-web + starter-jetty dono, koi exclusion nahi. Kaunsa server?', '<b>Tomcat</b> — Tomcat factory pehle match hoti hai, phir baaki <code>@ConditionalOnMissingBean</code> se back off.'],
          ['Main class <code>com.shop</code> me, ek <code>@Service</code> <code>com.audit</code> me. Bean banega?', '<b>Nahi</b> — component scan sirf <code>com.shop</code> aur sub-packages; <code>scanBasePackages</code> ya package move karo.'],
        ] },
      ] },
    ],
    checks: [
      '@SpringBootApplication ke 3 parts aur component scan ka base-package rule bata sakta hoon',
      'Auto-configuration ka flow (AutoConfiguration.imports → conditions → back off) 45 sec me samjha sakta hoon',
      'Property precedence order + @ConfigurationProperties vs @Value clear hai',
      'Production Actuator exposure + security aur Tomcat → Jetty switch + startup flow bol sakta hoon',
    ],
    memory: '@SpringBootApplication = Configuration + AutoConfiguration + ComponentScan(main package se neeche); auto-config = AutoConfiguration.imports ki conditional @Configuration, user bean pehle → OnMissingBean back off; exclude = annotation / property; precedence: args > -D > env > profile yml > yml; group = @ConfigurationProperties; Actuator: health/info/prometheus, alag port + security; Jetty = Tomcat starter exclude.',
    snippets: [
      { code: META, out: META_OUT },
      { code: AUTO, out: AUTO_OUT },
      { code: PROPS, out: PROPS_OUT },
      { code: ACT, out: ACT_OUT },
      { code: BOOT, out: BOOT_OUT },
    ],
  };

  // =================================================================
  L.c10 = {
    kind: 'th', title: 'REST APIs in Spring', topic: 'Spring',
    goal: 'Order resource ke REST endpoints (methods, URLs, status codes), <code>@RequestParam</code> / <code>@PathVariable</code> / <code>@RequestBody</code>, <code>@ControllerAdvice</code> + <code>ProblemDetail</code>, <code>@Valid</code> + custom validator, filter vs interceptor vs AOP order, idempotency keys aur <code>Pageable</code> — har cheez <b>plain Java mini-dispatcher + output</b> se, asli Spring MVC code <code>pre</code> me, aur planner ke <b>7 interview questions</b> ke English answers.',
    oneLine: 'URL = noun (resource), HTTP method = verb, status code = result; errors ek jagah (@RestControllerAdvice → ProblemDetail), input @Valid se gate pe check, request filter → interceptor → controller → AOP proxy → service se guzarti hai, aur payment jaise POST ko idempotency key se safe banao.',
    parts: [
      { title: '🧩 Concept — Order resource ke REST endpoints aur status codes', blocks: [
        { p: 'c9 me Boot ne Tomcat + Spring MVC (<code>DispatcherServlet</code>) + Jackson auto-configure kiya. Ab us pe API banate hain. REST ka core: <b>URL resource ko naam deta hai (plural noun)</b>, <b>HTTP method action batata hai</b>, <b>status code result</b>. Verbs URL me nahi (<code>/createOrder</code> galat).' },
        { table: { head: ['Action', 'Method + URL', 'Success', 'Common errors'], rows: [
          ['Create', '<code>POST /orders</code>', '<b>201 Created</b> + <code>Location: /orders/1</code> + body', '400 invalid body, 409 duplicate, 422 business rule'],
          ['Get one', '<code>GET /orders/{id}</code>', '200', '404 not found'],
          ['List / search', '<code>GET /orders?status=PAID&amp;page=0&amp;size=20</code>', '200 (empty list bhi 200, 404 nahi)', '400 bad filter'],
          ['Replace', '<code>PUT /orders/{id}</code>', '200 (ya 204)', '404, 409 state conflict, 412 ETag mismatch'],
          ['Partial update / state change', '<code>PATCH /orders/{id}</code> ya <code>POST /orders/{id}/cancel</code>', '200', '409 (already shipped)'],
          ['Delete', '<code>DELETE /orders/{id}</code>', '<b>204 No Content</b>', '404'],
          ['Child resource', '<code>GET /orders/{id}/items</code>, <code>/customers/{id}/orders</code>', '200', '404'],
        ] } },
        { p: 'Baaki codes: <b>401</b> (login nahi / token invalid) vs <b>403</b> (login hai par permission nahi), <b>405</b> (method allowed nahi), <b>415</b> (galat Content-Type), <b>429</b> (rate limit), <b>500</b> (hamari galti), <b>503</b> (dependency down). Versioning: <code>/api/v1/orders</code> ya header.' },
        { code: REST },
        { pre: out(REST_OUT) },
        { pre: `@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final OrderService service;
    public OrderController(OrderService service) { this.service = service; }      // c8: constructor injection

    @PostMapping
    public ResponseEntity<OrderDto> create(@Valid @RequestBody CreateOrderRequest req) {
        OrderDto created = service.create(req);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);                  // 201 + Location
    }

    @GetMapping("/{id}")
    public OrderDto get(@PathVariable long id) { return service.get(id); }        // 200; not found -> exception -> 404

    @PutMapping("/{id}")
    public OrderDto replace(@PathVariable long id, @Valid @RequestBody UpdateOrderRequest req) { return service.replace(id, req); }

    @PostMapping("/{id}/cancel")
    public OrderDto cancel(@PathVariable long id) { return service.cancel(id); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)                                        // 204
    public void delete(@PathVariable long id) { service.delete(id); }
}` },
        { tip: 'Entity seedha return mat karo — <b>DTO</b> (record) do: internal fields / lazy relations (c11) leak nahi honge aur API contract DB schema se decouple rahega.' },
      ] },
      { title: '🔗 @RequestParam vs @PathVariable vs @RequestBody; @RestController vs @Controller', blocks: [
        { table: { head: ['', '@PathVariable', '@RequestParam', '@RequestBody'], rows: [
          ['Kahan se', 'URL path segment <code>/orders/<b>42</b></code>', 'Query string <code>?status=PAID</code> (ya form field)', 'HTTP body (JSON) — <code>HttpMessageConverter</code> / Jackson se object'],
          ['Use', 'Resource ki <b>identity</b>', '<b>Filter, sort, page</b>, optional options', 'Create / update ka <b>payload</b>'],
          ['Default', 'Required', 'Required (<code>required=false</code> / <code>defaultValue</code>)', 'Required; ek method me sirf ek'],
          ['Missing pe', 'URL match hi nahi → 404', '400 (MissingServletRequestParameterException)', '400 (HttpMessageNotReadableException)'],
        ] } },
        { p: '<code>@RestController</code> = <code>@Controller</code> + <code>@ResponseBody</code> har method pe: return value seedha body me (JSON). Plain <code>@Controller</code> me return value <b>view name</b> maana jaata hai → ViewResolver (Thymeleaf template) — server-side HTML pages ke liye.' },
        { code: BIND },
        { pre: out(BIND_OUT) },
        { pre: `@GetMapping("/users/{userId}/orders")
public Page<OrderDto> list(@PathVariable long userId,
                           @RequestParam OrderStatus status,                       // required
                           @RequestParam(defaultValue = "20") int size,
                           @RequestParam(required = false) String currency,       // null allowed
                           @RequestHeader("X-Request-Id") String requestId) { ... }

@Controller                                   // HTML pages
public class OrderPageController {
    @GetMapping("/orders")
    public String list(Model model) {
        model.addAttribute("orders", service.findAll());
        return "orderList";                   // -> templates/orderList.html
    }
}` },
      ] },
      { title: '🚨 Global error handling — @ControllerAdvice + ProblemDetail', blocks: [
        { p: 'Har controller me try-catch mat likho. Service domain exceptions throw kare (<code>OrderNotFoundException</code>), aur ek <code>@RestControllerAdvice</code> class me <code>@ExceptionHandler</code> methods unhe HTTP response me badlein. Sabse <b>specific</b> exception type ka handler jeetta hai (class hierarchy me sabse nazdeek). <b>ProblemDetail</b> (Spring 6 / Boot 3) RFC 9457 (pehle RFC 7807) ka standard error format hai: <code>type, title, status, detail, instance</code> + custom properties, content type <code>application/problem+json</code>.' },
        { code: ADVICE },
        { pre: out(ADVICE_OUT) },
        { pre: `@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {   // Spring MVC ke built-in exceptions bhi ProblemDetail me

    @ExceptionHandler(OrderNotFoundException.class)
    public ProblemDetail notFound(OrderNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(OutOfStockException.class)
    public ProblemDetail outOfStock(OutOfStockException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        pd.setTitle("Out of stock");
        pd.setType(URI.create("https://api.example.com/problems/out-of-stock"));
        pd.setProperty("sku", ex.getSku());
        return pd;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail unexpected(Exception ex) {
        log.error("Unhandled error", ex);                       // stack trace sirf logs me, client ko nahi
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error");
    }
}

# application.yml — MVC ke apne errors (400, 405, 415...) bhi ProblemDetail format me
spring.mvc.problemdetails.enabled: true` },
        { tip: '500 response me exception message / stack trace kabhi client ko mat bhejo (security leak). Correlation / trace id do taaki logs me dhoondh sako.' },
      ] },
      { title: '✅ Bean Validation — @Valid aur custom validator', blocks: [
        { p: 'DTO fields pe constraints (<code>@NotBlank</code>, <code>@NotNull</code>, <code>@Min</code>, <code>@Size</code>, <code>@Email</code>, <code>@Pattern</code>, <code>@Future</code>) lagao, controller parameter pe <code>@Valid</code>. Fail → <code>MethodArgumentNotValidException</code> → <b>400</b> (advice me field-wise errors bana do). Nested objects ke liye nested field pe bhi <code>@Valid</code>. Starter: <code>spring-boot-starter-validation</code> (Hibernate Validator).' },
        { p: '<b>Custom validator</b> = (1) annotation jispe <code>@Constraint(validatedBy = X.class)</code> aur zaroori attributes <code>message</code>, <code>groups</code>, <code>payload</code>; (2) class <code>X implements ConstraintValidator&lt;Annotation, Type&gt;</code> ka <code>isValid</code>. Null ko valid maano — null check <code>@NotNull</code> ka kaam hai. Demo me reflection se wahi kiya:' },
        { code: VALID },
        { pre: out(VALID_OUT) },
        { pre: `public record CreateOrderRequest(
        @NotBlank String item,
        @Min(1) int qty,
        @NotNull @ValidCurrency String currency,
        @Valid @NotNull AddressDto shippingAddress) { }          // nested validation

@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CurrencyValidator.class)
public @interface ValidCurrency {
    String message() default "unsupported currency";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class CurrencyValidator implements ConstraintValidator<ValidCurrency, String> {
    private static final Set<String> ALLOWED = Set.of("INR", "USD", "EUR");
    @Override
    public boolean isValid(String value, ConstraintValidatorContext ctx) {
        return value == null || ALLOWED.contains(value);
    }
}

@PostMapping
public ResponseEntity<OrderDto> create(@Valid @RequestBody CreateOrderRequest req) { ... }

// Advice me:
@ExceptionHandler(MethodArgumentNotValidException.class)
public ProblemDetail invalid(MethodArgumentNotValidException ex) {
    ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed");
    Map<String, String> errors = new TreeMap<>();
    ex.getBindingResult().getFieldErrors().forEach(fe -> errors.put(fe.getField(), fe.getDefaultMessage()));
    pd.setProperty("errors", errors);
    return pd;
}` },
        { tip: '<code>@PathVariable</code> / <code>@RequestParam</code> pe constraints (jaise <code>@Min(1) long id</code>): Spring 6.1+ me built-in method validation hai (<code>HandlerMethodValidationException</code>); purane versions me controller class pe <code>@Validated</code> chahiye tha aur error <code>ConstraintViolationException</code> aata tha. Cross-field rules (start &lt; end) ke liye class-level custom constraint.' },
      ] },
      { title: '🧅 Filters vs interceptors vs AOP — request me kaun kab chalta hai', blocks: [
        { table: { head: ['', 'Filter', 'HandlerInterceptor', 'AOP (@Aspect)'], rows: [
          ['Level', 'Servlet container — <code>DispatcherServlet</code> se <b>pehle / baad</b>', 'Spring MVC ke andar — handler (controller) ke aage-peeche', 'Kisi bhi <b>Spring bean</b> ke method ke around (proxy, c8 BPP)'],
          ['Kya dikhta hai', 'Raw <code>HttpServletRequest/Response</code>; kaunsa controller pata nahi', 'Request + <b>kaunsa handler method</b> chalega', 'Method args / return / exception; HTTP ka pata nahi'],
          ['Hooks', '<code>doFilter</code> (chain.doFilter ke pehle / baad)', '<code>preHandle</code> (false → stop), <code>postHandle</code>, <code>afterCompletion</code>', '<code>@Before</code>, <code>@After</code>, <code>@AfterThrowing</code>, <code>@Around</code>'],
          ['Typical use', 'Security (Spring Security filter chain), CORS, request id / MDC, logging, compression', 'Auth checks per handler, locale, API rate limit, audit', '<code>@Transactional</code>, <code>@Cacheable</code>, timing, retry — non-web layers bhi'],
          ['Register', '<code>@Component</code> <code>OncePerRequestFilter</code> / <code>FilterRegistrationBean</code>', '<code>WebMvcConfigurer.addInterceptors</code>', '<code>@Aspect</code> + <code>@Component</code>'],
        ] } },
        { code: CHAIN },
        { pre: out(CHAIN_OUT) },
        { pre: `@Component
public class RequestIdFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        MDC.put("requestId", UUID.randomUUID().toString());
        try { chain.doFilter(req, res); } finally { MDC.clear(); }
    }
}

public class AuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        if (req.getHeader("Authorization") == null) { res.setStatus(401); return false; }
        return true;
    }
}

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AuthInterceptor()).addPathPatterns("/api/**");
    }
}

@Aspect
@Component
public class TimingAspect {
    @Around("execution(* com.shop.service..*(..))")
    public Object time(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.nanoTime();
        try { return pjp.proceed(); }
        finally { log.info("{} took {} us", pjp.getSignature(), (System.nanoTime() - start) / 1000); }
    }
}` },
        { tip: '<code>@RestController</code> me <code>postHandle</code> tak response body already likh chuki hoti hai — header badalna ho toh <code>ResponseBodyAdvice</code> ya filter use karo. Exception <code>@ControllerAdvice</code> ne handle kar li toh bhi <code>afterCompletion</code> chalta hai.' },
      ] },
      { title: '🔁 Idempotency — PUT vs POST, idempotency keys (payments)', blocks: [
        { p: '<b>Idempotent</b> = same request N baar bhejo, server ki state utni hi badle jitni ek baar me (response alag ho sakta hai, jaise doosra DELETE 404). <b>GET, PUT, DELETE</b> idempotent hain (GET safe bhi). <b>POST</b> nahi — har POST naya order / naya charge. PATCH guarantee nahi (<code>qty += 1</code> type). Problem: network timeout pe client retry karta hai → POST /payments do baar → <b>double charge</b>.' },
        { p: '<b>Idempotency key</b>: client har logical operation ke liye unique key (UUID) <code>Idempotency-Key</code> header me bhejta hai, retry pe <b>wahi key</b>. Server: key + request fingerprint + response store karo (DB unique constraint / Redis, TTL jaise 24h). Same key + same body → saved response replay, charge nahi. Same key + alag body → <b>422</b>. Same key abhi process ho rahi (concurrent) → <b>409</b>.' },
        { code: IDEM },
        { pre: out(IDEM_OUT) },
        { pre: `@PostMapping("/payments")
public ResponseEntity<PaymentDto> pay(@RequestHeader("Idempotency-Key") String key,
                                      @Valid @RequestBody PaymentRequest req) {
    return idempotencyService.execute(key, req, () -> paymentService.charge(req));
}

// IdempotencyService (sketch)
//  1. INSERT INTO idempotency_keys(key, request_hash, status) VALUES (?, ?, 'IN_PROGRESS')
//     -> unique violation? row padho:
//          IN_PROGRESS            -> 409 Conflict (retry later)
//          hash different        -> 422 key reused with different payload
//          COMPLETED             -> stored status + body replay
//  2. charge karo (provider ko bhi apni idempotency key bhejo)
//  3. UPDATE ... SET status='COMPLETED', response_code=?, response_body=?   (same DB transaction jahan possible)
//  4. TTL / cleanup job: 24h baad purani keys delete` },
        { tip: 'Server side bhi defence rakho: natural unique constraint (jaise <code>order_id</code> pe ek hi successful payment). Key sirf client ke retries ko cover karti hai.' },
      ] },
      { title: '📄 Pagination aur sorting — Pageable', blocks: [
        { p: 'Spring Data web support query params ko <code>Pageable</code> me bind karta hai: <code>?page=0&amp;size=20&amp;sort=createdAt,desc&amp;sort=id</code> (page <b>zero-based</b>). Repository <code>findAll(Pageable)</code> / <code>findByStatus(status, pageable)</code> → <b>Page</b> (content + totalElements + totalPages — iske liye extra <code>count(*)</code> query) ya <b>Slice</b> (sirf hasNext, count query nahi — infinite scroll ke liye sasta).' },
        { code: PAGE },
        { pre: out(PAGE_OUT) },
        { pre: `@GetMapping
public PagedModel<OrderDto> list(@RequestParam(required = false) OrderStatus status,
                                 @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
    return new PagedModel<>(service.list(status, pageable));     // stable JSON shape (Spring Data 3.3+)
}

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    Slice<Order> findByCustomerId(long customerId, Pageable pageable);
}

# limits
spring.data.web.pageable.max-page-size=100      # client size=100000 na maang sake

-- Hibernate SQL (PostgreSQL)
select ... from orders o where o.status=? order by o.created_at desc, o.id offset ? rows fetch first ? rows only
select count(o.id) from orders o where o.status=?` },
        { list: [
          '<b>Sort whitelist</b> karo — client koi bhi property sort pe na bheje (unindexed column → slow query).',
          '<b>Tie-breaker</b> (<code>id</code>) add karo, warna same value wale rows pages ke beech jump / repeat karte hain.',
          'Deep pages (<code>offset 1000000</code>) slow hain — DB ko utni rows skip karni padti hain. Bade data pe <b>keyset / cursor pagination</b> (<code>where id &lt; :lastId order by id desc limit 20</code>; Spring Data me <code>ScrollPosition</code> / <code>Window</code>).',
        ] },
      ] },
      { title: '🎤 Interview — planner ke 7 questions (English answers)', blocks: [
        { tip: 'Answers me <b>Order / payment</b> resource sirf template hai — interview se pehle apne asli project ke resources, error format, validation rules aur idempotency approach se badlo. "Aapke payment API me retry kaise handle hota tha?" jaisa follow-up pakka aayega.' },
        { qa: [
          ['Design REST endpoints for an Order resource: methods, URLs, status codes.', 'I model orders as a plural noun resource under a versioned base path, <code>/api/v1/orders</code>. <code>POST /orders</code> creates an order and returns 201 Created with a Location header and the body. <code>GET /orders/{id}</code> returns 200 or 404. <code>GET /orders</code> lists with filters, sorting and pagination as query parameters, and an empty result is still 200. <code>PUT /orders/{id}</code> replaces the order, <code>PATCH</code> does a partial update, and a state change like cancel can be <code>POST /orders/{id}/cancel</code>; these return 200, or 409 if the state does not allow it. <code>DELETE /orders/{id}</code> returns 204. Invalid input is 400, unauthenticated 401, forbidden 403, a business rule violation 409 or 422, and server errors 500. I return DTOs, never entities, and errors as ProblemDetail.'],
          ['@RequestParam vs @PathVariable vs @RequestBody; @RestController vs @Controller.', '<code>@PathVariable</code> binds a segment of the URL path and identifies the resource, as in <code>/orders/42</code>. <code>@RequestParam</code> binds query string or form parameters, which I use for filtering, sorting and paging; it is required by default, and I can set <code>required = false</code> or a <code>defaultValue</code>. <code>@RequestBody</code> deserialises the request body, usually JSON through Jackson, into an object, and I combine it with <code>@Valid</code>. <code>@RestController</code> is <code>@Controller</code> plus <code>@ResponseBody</code>, so return values are written directly to the response body. A plain <code>@Controller</code> returns view names that a ViewResolver renders as HTML, for example with Thymeleaf.'],
          ['Global error handling with @ControllerAdvice and ProblemDetail.', 'Services throw meaningful domain exceptions, and one <code>@RestControllerAdvice</code> class translates them into HTTP responses with <code>@ExceptionHandler</code> methods, so controllers have no try-catch blocks and every endpoint returns the same error format. Spring picks the handler for the most specific exception type. Since Spring 6 I return <code>ProblemDetail</code>, the RFC 9457 format with type, title, status, detail and instance, plus custom properties such as field errors or an error code, served as <code>application/problem+json</code>. Extending <code>ResponseEntityExceptionHandler</code> or enabling <code>spring.mvc.problemdetails.enabled</code> gives the same format for framework errors like 405 or 415. A final handler for <code>Exception</code> logs the stack trace and returns a generic 500 without internal details.'],
          ['Bean Validation with @Valid; writing a custom validator.', 'I put constraints such as <code>@NotBlank</code>, <code>@NotNull</code>, <code>@Min</code>, <code>@Size</code> and <code>@Email</code> on the request DTO fields and annotate the controller parameter with <code>@Valid</code>. If validation fails, Spring throws <code>MethodArgumentNotValidException</code> before my method runs, and my advice turns it into a 400 ProblemDetail with field errors. Nested objects need <code>@Valid</code> on the nested field. For a custom rule I create an annotation meta-annotated with <code>@Constraint(validatedBy = ...)</code>, with the required <code>message</code>, <code>groups</code> and <code>payload</code> attributes, and a class implementing <code>ConstraintValidator</code> whose <code>isValid</code> method holds the logic. It should treat null as valid and leave null checks to <code>@NotNull</code>. Cross-field rules use a class-level constraint.'],
          ['Filters vs interceptors vs AOP: where each runs in a request.', 'A filter is a servlet component that runs in the container before and after the DispatcherServlet. It sees the raw request and response but not which controller will run, so it suits cross-cutting web concerns like security, where Spring Security is itself a filter chain, CORS, request ids and logging. A HandlerInterceptor runs inside Spring MVC around the selected handler: <code>preHandle</code> can stop the request by returning false, <code>postHandle</code> runs after the handler, and <code>afterCompletion</code> always runs at the end. AOP works on any Spring bean through proxies, around method calls, independent of HTTP; that is how <code>@Transactional</code> and <code>@Cacheable</code> work. So the order is filter, interceptor preHandle, controller, aspects around the service, then back out through the interceptor and the filter.'],
          ['Idempotency: PUT vs POST, and idempotency keys for payment APIs.', 'An operation is idempotent if repeating it leaves the server in the same state as doing it once. GET, PUT and DELETE are idempotent: PUT sends the full new state, so sending it twice changes nothing more. POST is not: each call can create a new order or a new charge. That matters because clients retry after timeouts, and a retried payment must not charge twice. So the client sends a unique <code>Idempotency-Key</code> header per logical payment and reuses it on retries. The server stores the key with a hash of the request and the response, for example in a table with a unique constraint or in Redis with a TTL. A repeat with the same key and body returns the stored response without charging, the same key with a different body gets 422, and a request still in progress gets 409.'],
          ['Pagination and sorting with Pageable.', 'Spring Data binds query parameters like <code>page=0&amp;size=20&amp;sort=createdAt,desc</code> into a <code>Pageable</code>; the page index is zero-based. I pass it to repository methods such as <code>findByStatus(status, pageable)</code>, which add order by and limit and offset to the query. Returning a <code>Page</code> also runs a count query to give total elements and total pages; a <code>Slice</code> skips the count and only knows whether there is a next page, which is cheaper for infinite scroll. I set defaults with <code>@PageableDefault</code>, cap the page size, whitelist sortable fields, add a unique tie-breaker like id for stable ordering, and return a DTO page. For very deep pages, offset gets slow, so I switch to keyset or cursor pagination.'],
        ] },
        { say: [
          ['Aise bolo — order API apne project se (45 sec)', 'In our order service the API follows standard REST conventions: POST on the orders collection returns 201 with a Location header, GET returns DTOs, and state changes like cancel are explicit sub-resources that return 409 when the state does not allow them. Request DTOs are validated with Bean Validation, including a custom currency constraint, and one RestControllerAdvice converts every exception into a ProblemDetail, so clients always see the same error shape. For the payment endpoint, clients send an Idempotency-Key, and we store the key with the response, so a retry after a timeout never charges the customer twice.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          'URL me verbs: <code>/getOrder</code>, <code>/createOrder</code> — method hi verb hai.',
          'Har error pe 200 + <code>{"success": false}</code>, ya har error 500 — sahi status code do.',
          'Create pe 200 aur Location header nahi — <b>201 + Location</b>.',
          'JPA entity seedha JSON me return — lazy loading exception / infinite recursion / internal fields leak (c11). DTO use karo.',
          '<code>@Valid</code> lagana bhool gaye → constraints chalte hi nahi; ya validation starter dependency missing.',
          '500 response me stack trace / exception message bhejna.',
          '"POST bhi idempotent bana sakte ho bina kuch kiye" — nahi, key / natural unique constraint chahiye.',
          'Pagination bina max size aur bina tie-breaker sort — slow queries aur duplicate / missing rows.',
          'Filter me <code>chain.doFilter</code> call karna bhool gaye → request wahin ruk gayi.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['<code>DELETE /orders/1</code> pehli baar 204, doosri baar 404. Kya DELETE ab bhi idempotent hai?', '<b>Haan</b> — idempotency server <b>state</b> ke baare me hai; dono ke baad order exist nahi karta. Response code alag hona chalta hai.'],
          ['Advice me handlers: <code>BusinessException</code> → 422, <code>Exception</code> → 500. <code>CouponExpiredException extends BusinessException</code> throw hua. Status?', '<b>422</b> — class hierarchy me sabse nazdeek handler (<code>BusinessException</code>).'],
          ['Request: auth interceptor <code>preHandle</code> false return karta hai. Controller, <code>postHandle</code>, filter ka "after" part — kaun chalega?', 'Controller aur postHandle <b>nahi</b>; filter ka after part <b>chalega</b> (chain.doFilter return ho gaya).'],
          ['7 orders, <code>?page=2&amp;size=3</code>. Kitne items aur <code>hasNext</code>?', '<b>1 item</b> (index 6), totalPages = 3, <code>hasNext=false</code>.'],
          ['<code>@RequestParam String status</code> (koi default nahi), request <code>GET /orders</code> bina status. Response?', '<b>400 Bad Request</b> — @RequestParam default required hai (MissingServletRequestParameterException).'],
        ] },
      ] },
    ],
    checks: [
      'Order resource ke endpoints + sahi status codes (201 + Location, 204, 404, 409, 422) bol sakta hoon',
      '@ControllerAdvice + ProblemDetail aur @Valid + custom ConstraintValidator likh sakta hoon',
      'Filter → interceptor → controller → AOP order aur har ka use-case bata sakta hoon',
      'Idempotency key ka flow (store, replay, 422, 409) aur Page vs Slice + keyset pagination samjha sakta hoon',
    ],
    memory: 'URL = noun, method = verb, status = result (POST 201+Location, DELETE 204); PathVariable = identity, RequestParam = filter/page, RequestBody = payload; RestController = Controller + ResponseBody; errors → @RestControllerAdvice → ProblemDetail; @Valid → 400, custom = @Constraint + ConstraintValidator; filter > interceptor > controller > AOP; POST + Idempotency-Key; Pageable zero-based, Page = count query, Slice nahi.',
    snippets: [
      { code: REST, out: REST_OUT },
      { code: BIND, out: BIND_OUT },
      { code: ADVICE, out: ADVICE_OUT },
      { code: VALID, out: VALID_OUT },
      { code: CHAIN, out: CHAIN_OUT },
      { code: IDEM, out: IDEM_OUT },
      { code: PAGE, out: PAGE_OUT },
    ],
  };

  // =================================================================
  L.c11 = {
    kind: 'th', title: 'Spring Data JPA and Hibernate', topic: 'Spring',
    goal: 'JPA vs Hibernate vs Spring Data JPA, relationship mappings + owning side / <code>mappedBy</code>, lazy vs eager + <code>LazyInitializationException</code> + open-in-view, N+1 aur uske 3 fixes, entity states + persist vs merge, optimistic vs pessimistic locking, derived queries / <code>@Query</code> / projections — har concept <b>fake query log wali plain Java simulation + output</b> se, asli JPA code + SQL logs <code>pre</code> me, aur planner ke <b>7 interview questions</b> ke English answers.',
    oneLine: 'JPA = spec, Hibernate = implementation, Spring Data = repository interfaces upar se; FK owning side (@ManyToOne) likhta hai; collections lazy rakho aur jo chahiye wo fetch join / @EntityGraph se ek query me lao (N+1 se bacho); managed entity ka setter hi update hai (dirty checking); concurrent updates ke liye @Version.',
    parts: [
      { title: '🧩 Concept — JPA vs Hibernate vs Spring Data JPA', blocks: [
        { p: 'c10 me controller → service → <b>repository</b> layer thi. Ab repository ke neeche kya hota hai. Teen layers hain, aur interview me inko mix karna common galti hai:' },
        { table: { head: ['', 'JPA (Jakarta Persistence)', 'Hibernate', 'Spring Data JPA'], rows: [
          ['Kya hai', '<b>Specification</b> — interfaces + annotations (<code>jakarta.persistence.*</code>)', 'JPA ka <b>implementation</b> (ORM provider) + extra features', 'JPA ke upar <b>abstraction</b> — repository interfaces'],
          ['Examples', '<code>@Entity</code>, <code>EntityManager</code>, JPQL, <code>@OneToMany</code>', 'Session, dirty checking, <code>@BatchSize</code>, HQL, 2nd-level cache', '<code>JpaRepository</code>, derived queries, <code>@Query</code>, <code>Pageable</code>'],
          ['Code kaun likhta', 'Koi nahi (sirf contract)', 'Hibernate team', 'Tum sirf interface; Spring runtime pe proxy implementation banata hai'],
          ['Alternatives', '—', 'EclipseLink', 'Spring Data JDBC, MongoDB...'],
        ] } },
        { p: 'Boot 3 = Jakarta EE 9+ namespace (<code>jakarta.persistence</code>, pehle <code>javax.persistence</code>) aur Hibernate 6. <code>spring-boot-starter-data-jpa</code> (c9) DataSource (Hikari), <code>EntityManagerFactory</code>, transaction manager aur repositories sab auto-configure karta hai.' },
        { pre: `@Entity
@Table(name = "orders")
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String status;
    @Version private Long version;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> items = new ArrayList<>();
}

public interface OrderRepository extends JpaRepository<Order, Long> {   // implementation Spring banata hai
    List<Order> findByStatus(String status);
}

// Neeche ye sab ho raha hai (plain JPA):
// EntityManager em = ...;  em.persist(order);  em.find(Order.class, 1L);  em.createQuery("select o from Order o", Order.class)
// Aur EntityManager asal me Hibernate ka Session hai: em.unwrap(Session.class)` },
      ] },
      { title: '🔗 Relationship mappings — owning side aur mappedBy', blocks: [
        { table: { head: ['Mapping', 'Example', 'Default fetch', 'DB me'], rows: [
          ['<code>@ManyToOne</code>', 'Item → Order', '<b>EAGER</b> (JPA default)', 'items.order_id FK — <b>owning side</b>'],
          ['<code>@OneToMany(mappedBy)</code>', 'Order → List&lt;Item&gt;', 'LAZY', 'Koi column nahi — inverse side'],
          ['<code>@OneToOne</code>', 'User ↔ Profile', '<b>EAGER</b>', 'FK jis table me, wahi owning'],
          ['<code>@ManyToMany</code>', 'Student ↔ Course', 'LAZY', 'Join table (student_course); jo side <code>mappedBy</code> nahi likhti wo owning'],
        ] } },
        { p: '<b>Owning side</b> = jis entity ki table me <b>foreign key</b> hai. Hibernate relationship ko DB me likhte waqt <b>sirf owning side</b> dekhta hai. Inverse side pe <code>mappedBy = "order"</code> likhte ho = "ye relationship <code>Item.order</code> field already map kar raha hai, mere liye alag column / join table mat banao". Bidirectional relation me dono sides Java me sync rakhna tumhari zimmedari — <b>helper method</b> (<code>addItem</code>) banao.' },
        { code: OWN },
        { pre: out(OWN_OUT) },
        { pre: `@Entity
public class Order {
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)   // inverse side
    private List<Item> items = new ArrayList<>();

    public void addItem(Item item) { items.add(item); item.setOrder(this); }          // dono sides
    public void removeItem(Item item) { items.remove(item); item.setOrder(null); }
}

@Entity
public class Item {
    @ManyToOne(fetch = FetchType.LAZY)              // default EAGER -> LAZY karna best practice
    @JoinColumn(name = "order_id")                  // owning side: FK column
    private Order order;
}

// mappedBy bhool gaye -> unidirectional @OneToMany -> Hibernate extra join table "orders_items" banata hai
//                     + extra inserts/updates. Isliye mappedBy likho.` },
        { tip: 'Bidirectional entities me <code>toString</code> / <code>equals</code> / <code>hashCode</code> me relation fields mat daalo (Lombok <code>@Data</code> trap) — infinite recursion / StackOverflowError aur accidental lazy loading. Jackson ke saath bhi wahi problem → DTO return karo (c10).' },
      ] },
      { title: '💤 Lazy vs eager, LazyInitializationException, open-in-view', blocks: [
        { p: '<b>LAZY</b>: related data tab load jab pehli baar access ho — Hibernate field me ek <b>proxy</b> / <code>PersistentBag</code> rakhta hai. <b>EAGER</b>: parent ke saath hamesha load (join ya extra select) — chahe zarurat ho ya na ho. Best practice: <b>sab LAZY</b> (ManyToOne / OneToOne ko explicitly <code>fetch = LAZY</code>), aur jahan chahiye query level pe fetch karo. EAGER baad me query se band nahi hota, aur EAGER collections bhi N+1 la sakti hain.' },
        { p: '<b>LazyInitializationException</b>: lazy proxy ko <b>persistence context (session) band hone ke baad</b> touch kiya — jaise service ka transaction khatam, phir controller / Jackson ne <code>order.getItems()</code> chhua. <b>Open Session in View (OSIV)</b>: Spring Boot me <code>spring.jpa.open-in-view</code> default <b>true</b> hai — EntityManager poori web request tak open rehta hai, isliye ye exception nahi aata, par startup pe WARN aata hai: <i>"spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering..."</i>. Nuksaan: queries web layer se chhupi hui chalti hain (N+1 dikhta nahi), aur DB connection request se zyada der tak bandh sakta hai → load pe pool exhaust.' },
        { code: LAZY },
        { pre: out(LAZY_OUT) },
        { pre: `# application.yml — production services me aksar
spring:
  jpa:
    open-in-view: false          # explicitly set karo (warning bhi chali jaati hai)

// Fix: service ke andar (transaction me) jo chahiye wo fetch karke DTO banao
@Transactional(readOnly = true)                      // c12 me detail
public OrderDto get(long id) {
    Order o = repo.findWithItemsById(id).orElseThrow(() -> new OrderNotFoundException(id));
    return OrderDto.from(o);                         // items yahin, session open hai
}

// Startup log (open-in-view not set):
// WARN JpaBaseConfiguration$JpaWebConfiguration : spring.jpa.open-in-view is enabled by default.
//   Therefore, database queries may be performed during view rendering. Explicitly configure
//   spring.jpa.open-in-view to disable this warning` },
        { tip: '<code>Hibernate.initialize(order.getItems())</code> ya <code>size()</code> call karke "fix" karna kaam karta hai par wahi N+1 queries chupke se laata hai — query-level fetch behtar.' },
      ] },
      { title: '🐢 N+1 problem — fetch join, @EntityGraph, batch size', blocks: [
        { p: '<b>N+1</b>: 1 query parents ke liye (<code>findAll()</code> → N orders), phir loop me har parent ki lazy collection touch → <b>N extra queries</b>. 100 orders = 101 queries. Local pe fast, production me latency + DB load. Pakadne ke liye: <code>spring.jpa.show-sql</code> / <code>logging.level.org.hibernate.SQL=debug</code>, Hibernate statistics, ya tests me query count assert.' },
        { code: N1 },
        { pre: out(N1_OUT) },
        { table: { head: ['Fix', 'Kaise', 'Queries', 'Dhyan'], rows: [
          ['1. <b>JOIN FETCH</b> (JPQL)', '<code>select o from Order o left join fetch o.items</code>', '1', 'Collection fetch + pagination → Hibernate memory me paginate karta hai (warning HHH90003004); do <code>List</code> collections ek saath fetch → <code>MultipleBagFetchException</code>'],
          ['2. <b>@EntityGraph</b>', 'Repository method pe <code>@EntityGraph(attributePaths = "items")</code>', '1', 'Derived methods ke saath bhi chalta hai, query string nahi badalni padti; same join caveats'],
          ['3. <b>Batch fetching</b>', '<code>@BatchSize(size = 50)</code> ya <code>hibernate.default_batch_fetch_size</code>', '1 + ⌈N / size⌉', 'Pagination safe; queries thodi zyada par predictable — global setting accha default'],
          ['Bonus: DTO projection', '<code>select new ...Dto(o.id, count(i))</code>', '1', 'Sirf chahiye wale columns — read-only screens ke liye best'],
        ] } },
        { pre: `public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("select o from Order o left join fetch o.items where o.status = :status")   // fix 1
    List<Order> findWithItemsByStatus(@Param("status") String status);

    @EntityGraph(attributePaths = "items")                                            // fix 2
    List<Order> findByStatus(String status);

    @EntityGraph(attributePaths = "items")
    Optional<Order> findWithItemsById(Long id);
}

@Entity
public class Order {
    @OneToMany(mappedBy = "order")
    @BatchSize(size = 50)                                                             // fix 3 (per collection)
    private List<Item> items;
}

# fix 3 (global)
spring.jpa.properties.hibernate.default_batch_fetch_size=50

-- SQL log, lazy loop (N+1):
select o1_0.id,o1_0.status from orders o1_0
select i1_0.order_id,i1_0.id,i1_0.sku from items i1_0 where i1_0.order_id=?     -- x N
-- with batch size:
select i1_0.order_id,i1_0.id,i1_0.sku from items i1_0 where i1_0.order_id in (?,?,?, ...)   -- dialect pe depend` },
        { tip: 'Hibernate 6 me <code>join fetch</code> se aane wale duplicate parent rows automatically de-duplicate hote hain (Hibernate 5 me <code>distinct</code> likhna padta tha).' },
      ] },
      { title: '🔄 Entity states — transient, managed, detached, removed; persist vs merge', blocks: [
        { table: { head: ['State', 'Matlab', 'Kaise pahunche'], rows: [
          ['<b>Transient</b> (new)', '<code>new Product()</code> — persistence context ko pata nahi, DB me nahi', 'Constructor'],
          ['<b>Managed</b> (persistent)', 'Persistence context track kar raha hai; <b>changes flush pe automatically UPDATE</b> (dirty checking)', '<code>persist()</code>, <code>find()</code>, query result, <code>merge()</code> ka return'],
          ['<b>Detached</b>', 'DB me row hai par context band / clear — changes track nahi hote', 'Transaction / EntityManager close, <code>detach()</code>, <code>clear()</code>, serialize ho ke aaya object'],
          ['<b>Removed</b>', 'Delete ke liye marked; flush / commit pe DELETE', '<code>remove(managed)</code>'],
        ] } },
        { p: '<b>persist(entity)</b>: transient → managed, <b>wahi object</b> managed ho jaata hai; insert flush / commit pe (IDENTITY id ho toh turant). Detached pe persist → exception. <b>merge(entity)</b>: detached (ya transient) ki <b>state copy</b> karke ek <b>managed copy return</b> karta hai (zarurat ho toh pehle SELECT); jo object pass kiya wo detached hi rehta hai — aage returned object use karo. Spring Data <code>save()</code>: entity "new" hai (id null, ya <code>@Version</code> wrapper null) → <code>persist</code>, warna → <code>merge</code>.' },
        { code: STATES },
        { pre: out(STATES_OUT) },
        { pre: `@Transactional
public void rename(long id, String name) {
    Product p = repo.findById(id).orElseThrow();   // managed
    p.setName(name);                               // bas itna — commit pe dirty checking UPDATE karega
    // repo.save(p) zaroori NAHI (managed entity pe save() sirf merge no-op jaisa)
}

// Detached object (jaise request se bana) update karna:
Product merged = entityManager.merge(detachedProduct);   // merged = managed copy
merged.setPrice(20);                                     // ye track hoga
detachedProduct.setPrice(30);                            // ye NAHI

// SQL log
Hibernate: select p1_0.id,p1_0.name,p1_0.price from product p1_0 where p1_0.id=?
Hibernate: update product set name=?,price=? where id=?` },
      ] },
      { title: '🔒 Optimistic (@Version) vs pessimistic locking', blocks: [
        { p: '<b>Lost update</b>: do users ne same row padhi, dono ne update kiya → baad wale ne pehle wale ka change overwrite kar diya. Do solutions:' },
        { table: { head: ['', 'Optimistic (@Version)', 'Pessimistic (@Lock)'], rows: [
          ['Idea', 'Lock nahi; update ke time check — "maine jo version padha tha, kya abhi bhi wahi hai?"', 'Padhte waqt hi row lock (<code>SELECT ... FOR UPDATE</code>) — doosre wait karte hain'],
          ['SQL', '<code>update ... set version=version+1 where id=? and version=?</code> → 0 rows = conflict', '<code>select ... for update</code> (PESSIMISTIC_WRITE)'],
          ['Conflict pe', '<code>OptimisticLockException</code> → Spring <code>ObjectOptimisticLockingFailureException</code> → retry / 409 to client', 'Doosra transaction <b>block</b>; timeout / deadlock possible'],
          ['Best for', 'Conflicts <b>rare</b>, read-heavy, web apps, long user think-time', 'Conflicts <b>frequent</b>, short critical section (inventory decrement, wallet balance)'],
          ['Cost', 'Sasta; retry logic chahiye', 'Locks hold → throughput kam; transaction short rakho'],
        ] } },
        { code: LOCK },
        { pre: out(LOCK_OUT) },
        { pre: `@Entity
public class Account {
    @Id private Long id;
    private int balance;
    @Version private Long version;       // Hibernate khud increment + check karta hai
}

// SQL (optimistic):
// update account set balance=?, version=? where id=? and version=?    -> 0 rows => OptimisticLockException

public interface AccountRepository extends JpaRepository<Account, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)                                   // select ... for update
    @QueryHints(@QueryHint(name = "jakarta.persistence.lock.timeout", value = "3000"))
    @Query("select a from Account a where a.id = :id")
    Optional<Account> findForUpdate(@Param("id") long id);
}

@Retryable(retryFor = ObjectOptimisticLockingFailureException.class, maxAttempts = 3)   // spring-retry
@Transactional
public void withdraw(long id, int amount) { ... }` },
        { tip: 'REST se connect (c10): client ko version <b>ETag</b> me do, update pe <code>If-Match</code> header → mismatch pe <b>412 Precondition Failed</b>. Ye optimistic locking ko API tak le jaata hai.' },
      ] },
      { title: '🔎 Derived query methods, @Query, projections', blocks: [
        { p: '<b>Derived queries</b>: Spring Data method ke naam ko parse karke JPQL banata hai — <code>find…By</code>, <code>count…By</code>, <code>exists…By</code>, <code>delete…By</code> + properties + keywords (<code>And</code>, <code>Or</code>, <code>GreaterThan</code>, <code>Between</code>, <code>Containing</code>, <code>In</code>, <code>IsNull</code>, <code>OrderBy…Desc</code>, <code>Top3</code> / <code>First</code>). Galat property naam → <b>app startup pe fail</b> (accha hai — runtime pe nahi). Naam bahut lamba ho jaaye → <code>@Query</code>.' },
        { code: DERIVED },
        { pre: out(DERIVED_OUT) },
        { table: { head: ['Projection', 'Kaise', 'Kab'], rows: [
          ['Interface (closed)', '<code>interface OrderSummary { Long getId(); String getStatus(); }</code> → return type', 'Kuch columns, simple read; sirf wahi columns select'],
          ['Class / record DTO', '<code>record OrderDto(Long id, String status)</code> — derived method ya <code>select new com.shop.OrderDto(o.id, o.status)</code>', 'API responses, aggregates'],
          ['Dynamic', '<code>&lt;T&gt; List&lt;T&gt; findByStatus(String s, Class&lt;T&gt; type)</code>', 'Same query, alag shapes'],
        ] } },
        { pre: `public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStatusAndAmountGreaterThanOrderByCreatedAtDesc(String status, BigDecimal min);
    long countByStatus(String status);
    boolean existsByCustomerIdAndStatus(Long customerId, String status);
    List<Order> findTop3ByCustomerIdOrderByAmountDesc(Long customerId);

    @Query("select o from Order o where o.customer.email = :email and o.createdAt >= :from")     // JPQL (entity names)
    List<Order> recentByEmail(@Param("email") String email, @Param("from") Instant from);

    @Query(value = "select * from orders where status = :status limit 10", nativeQuery = true)   // native SQL
    List<Order> topNative(@Param("status") String status);

    @Modifying                                                       // UPDATE / DELETE query
    @Transactional
    @Query("update Order o set o.status = 'EXPIRED' where o.createdAt < :cutoff and o.status = 'PENDING'")
    int expireOld(@Param("cutoff") Instant cutoff);

    List<OrderSummary> findByCustomerId(Long customerId);            // interface projection

    @Query("select new com.shop.dto.OrderDto(o.id, o.status, o.amount) from Order o where o.status = :s")
    List<OrderDto> dtoByStatus(@Param("s") String s);                // DTO projection

    <T> List<T> findByStatus(String status, Class<T> type);          // dynamic projection
}

interface OrderSummary { Long getId(); String getStatus(); }` },
        { tip: '<code>@Modifying</code> query persistence context ko bypass karti hai — already loaded entities stale ho sakti hain; <code>@Modifying(clearAutomatically = true)</code> ya baad me refresh. Transactions aur <code>@Transactional</code> ki poori kahani agle lesson <b>c12</b> me.' },
      ] },
      { title: '🎤 Interview — planner ke 7 questions (English answers)', blocks: [
        { tip: 'Ye answers <b>Order / Item / Account</b> entities use karte hain — interview se pehle apne project ki asli entities, koi N+1 jo tumne pakda tha, aur locking ka koi real case daal do. "Aapne N+1 kaise detect kiya?" pakka puchenge.' },
        { qa: [
          ['JPA vs Hibernate vs Spring Data JPA.', 'JPA, now Jakarta Persistence, is a specification: a set of interfaces and annotations like <code>@Entity</code>, <code>EntityManager</code> and JPQL, with no implementation. Hibernate is the most widely used implementation of JPA; it does the actual ORM work, like SQL generation, dirty checking and caching, and adds its own features such as <code>@BatchSize</code>. Spring Data JPA is an abstraction on top of JPA: I write repository interfaces extending <code>JpaRepository</code>, and Spring generates the implementation at runtime, including CRUD methods, derived queries from method names, <code>@Query</code>, paging and projections. Under the hood it still calls the EntityManager, which is backed by Hibernate in a Spring Boot application.'],
          ['Relationship mappings; owning side and mappedBy.', 'JPA has <code>@OneToOne</code>, <code>@OneToMany</code>, <code>@ManyToOne</code> and <code>@ManyToMany</code>, and they can be unidirectional or bidirectional. The owning side is the side whose table holds the foreign key, which for one-to-many is the <code>@ManyToOne</code> side with <code>@JoinColumn</code>. Hibernate only looks at the owning side when writing the relationship to the database. On the inverse side I put <code>mappedBy</code> with the name of the owning field, which tells Hibernate the relationship is already mapped, so it does not create a join table or extra updates. If I only add an item to <code>order.items</code> without setting <code>item.order</code>, the foreign key is saved as null, so I use helper methods like <code>addItem</code> that keep both sides in sync.'],
          ['Lazy vs eager loading; LazyInitializationException; open-in-view.', 'Lazy loading fetches an association only when it is first accessed, through a proxy; eager loading fetches it together with the parent every time. JPA defaults are eager for <code>@ManyToOne</code> and <code>@OneToOne</code> and lazy for collections, and I make everything lazy and fetch what each use case needs in the query. <code>LazyInitializationException</code> happens when code touches a lazy proxy after the persistence context is closed, for example in a controller or during JSON serialisation after the service transaction ended. Spring Boot enables open-in-view by default, which keeps the EntityManager open for the whole web request so the exception does not occur, and it logs a warning at startup. I disable it, because it hides queries in the web layer, encourages N+1 and can hold database connections longer, and instead fetch data and map to DTOs inside the service.'],
          ['The N+1 problem and three ways to fix it (fetch join, @EntityGraph, batch size).', 'N+1 happens when one query loads N parent entities and then accessing a lazy association on each one triggers one more query per parent, so 100 orders cause 101 queries. I detect it with SQL logging, Hibernate statistics or query-count assertions in tests. The first fix is a JPQL <code>join fetch</code>, which loads parents and children in one query. The second is <code>@EntityGraph(attributePaths = "items")</code> on a repository method, which gives the same single join without writing JPQL and works with derived queries. The third is batch fetching with <code>@BatchSize</code> or <code>hibernate.default_batch_fetch_size</code>, which loads the children for many parents with an IN query, so N plus one becomes one plus N divided by the batch size. Join fetching a collection does not combine well with pagination, so for paged queries I prefer batch fetching or a DTO projection.'],
          ['Entity states (transient, managed, detached, removed); persist vs merge.', 'A transient entity is a new object the persistence context does not know about. A managed entity is tracked by the persistence context, and any change to it is written automatically at flush through dirty checking, so I do not need to call save. A detached entity has a database row but is no longer tracked, for example after the transaction ends. A removed entity is scheduled for deletion at flush. <code>persist</code> makes a transient object managed, and the same instance becomes managed. <code>merge</code> copies the state of a detached object onto a managed instance, loading it if necessary, and returns that managed copy, while the argument stays detached. Spring Data <code>save</code> calls persist for new entities, decided by a null id or version, and merge otherwise.'],
          ['Optimistic (@Version) vs pessimistic locking.', 'Both prevent lost updates. Optimistic locking adds a <code>@Version</code> column; Hibernate updates with <code>where id = ? and version = ?</code> and increments the version. If another transaction changed the row first, zero rows are updated and an <code>OptimisticLockException</code> is thrown, which Spring translates to <code>ObjectOptimisticLockingFailureException</code>; I retry or return 409. It holds no locks, so it suits read-heavy systems where conflicts are rare. Pessimistic locking, with <code>@Lock(PESSIMISTIC_WRITE)</code>, issues <code>select ... for update</code>, so other transactions wait until mine commits. It suits short, highly contended updates like decrementing stock or a wallet balance, but it reduces throughput and can cause lock timeouts or deadlocks, so I keep those transactions short and set a lock timeout.'],
          ['Derived query methods, @Query, projections.', 'Derived query methods let Spring Data build the query from the method name, for example <code>findByStatusAndAmountGreaterThanOrderByCreatedAtDesc</code>, using keywords like And, Or, Between, Containing, In, Top and OrderBy. Names are checked at startup, so a wrong property fails fast. When the name gets too long, or I need joins, aggregates or fetch joins, I use <code>@Query</code> with JPQL, or with <code>nativeQuery = true</code> for database-specific SQL, and <code>@Modifying</code> for bulk updates and deletes. Projections return only what I need instead of full entities: interface-based projections with getters, class or record DTOs through constructor expressions, and dynamic projections where the caller passes the return type. They select fewer columns, avoid lazy loading issues and fit read-only API responses.'],
        ] },
        { say: [
          ['Aise bolo — N+1 apne project se (45 sec)', 'In one of our listing endpoints the response time grew with the page size. With SQL logging enabled we saw one query for the orders and then one query per order for its items, a classic N+1 caused by a lazy collection being touched while mapping to DTOs. Because the endpoint was paginated, we did not use a join fetch on the collection; we enabled Hibernate batch fetching with a size of fifty, so a page needed only two or three queries. We also turned off open-in-view so this kind of hidden query in the web layer would fail fast in tests instead of reaching production.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          '"Spring Data JPA ek ORM hai" — nahi, ORM Hibernate hai; Spring Data uske upar repository abstraction hai.',
          'Bidirectional relation me sirf inverse side (<code>order.getItems().add()</code>) set karna → FK null.',
          '<code>@ManyToOne</code> ko default EAGER chhod dena — har item load pe order bhi.',
          'open-in-view default true pe chhodna aur sochna ki lazy loading "theek chal rahi hai".',
          'Collection <code>join fetch</code> + <code>Pageable</code> → memory me pagination (HHH90003004 warning), ya do bags → MultipleBagFetchException.',
          'Managed entity pe setter ke baad bhi <code>save()</code> call karna zaroori samajhna; ya ulta — detached entity ko modify karke sochna ki save ho jaayega.',
          '<code>merge()</code> ke baad purane (argument wale) object ko modify karte rehna — returned object managed hai.',
          'Entities seedha JSON me serialize — lazy exception / infinite recursion.',
          '<code>@Version</code> laga diya par <code>ObjectOptimisticLockingFailureException</code> handle nahi kiya → client ko 500.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['50 orders <code>findAll()</code>, loop me har <code>order.getItems().size()</code>, items LAZY, koi fix nahi. Kitni queries?', '<b>51</b> (1 + N). <code>default_batch_fetch_size=25</code> ho toh <b>3</b> (1 + 50/25).'],
          ['<code>order.getItems().add(item)</code> kiya, <code>item.setOrder(order)</code> nahi, cascade ALL. <code>items.order_id</code> kya hoga?', '<b>null</b> — FK sirf owning side (<code>Item.order</code>) se likhi jaati hai.'],
          ['<code>@Transactional</code> method me <code>Product p = repo.findById(1).get(); p.setPrice(99);</code> — <code>save()</code> nahi. Commit pe?', '<b>UPDATE chalega</b> — p managed hai, dirty checking.'],
          ['<code>Product m = em.merge(detached); detached.setPrice(5);</code> commit. DB me price 5?', '<b>Nahi</b> — sirf <code>m</code> managed hai; <code>detached</code> abhi bhi detached.'],
          ['Do users ne v3 padha; A ne save kiya (v4). B save karta hai. Kya hoga?', 'B ka update <code>where version=3</code> → 0 rows → <b>ObjectOptimisticLockingFailureException</b> (retry / 409).'],
        ] },
      ] },
    ],
    checks: [
      'JPA vs Hibernate vs Spring Data aur owning side / mappedBy 45 sec me samjha sakta hoon',
      'LazyInitializationException ki wajah + open-in-view kyun band karte hain bata sakta hoon',
      'N+1 detect karna + 3 fixes (join fetch, @EntityGraph, batch size) aur pagination caveat bol sakta hoon',
      'Entity states, persist vs merge, aur @Version vs PESSIMISTIC_WRITE ka trade-off clear hai',
    ],
    memory: 'JPA = spec, Hibernate = impl, Spring Data = repo interfaces; FK wali side owning, inverse pe mappedBy, helper se dono sides sync; sab LAZY, query me fetch; session band + lazy touch = LazyInitializationException, OSIV default true (warning) → band karo; N+1 → join fetch / @EntityGraph / batch size; managed = dirty checking, merge copy return karta hai; @Version = optimistic, FOR UPDATE = pessimistic; next: c12 @Transactional.',
    snippets: [
      { code: OWN, out: OWN_OUT },
      { code: LAZY, out: LAZY_OUT },
      { code: N1, out: N1_OUT },
      { code: STATES, out: STATES_OUT },
      { code: LOCK, out: LOCK_OUT },
      { code: DERIVED, out: DERIVED_OUT },
    ],
  };
})();
