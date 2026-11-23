// Planner lessons — Java theory (c1 Java OOP essentials, …)
// Theory format: concept Hinglish me → har planner interview question ka English answer (qa) → code + output → traps → self-test.
// snippets: validate-lessons.js --java inhe compile + run karke output match karta hai.
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});

  // ---------------- code examples (sab compile + run checked) ----------------
  const PILLARS = `abstract class Payment {                 // Abstraction: "pay karna hai" — kaise, wo child decide karega
    private final double amount;          // Encapsulation: bahar se direct change nahi
    Payment(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("amount > 0 chahiye");
        this.amount = amount;
    }
    double getAmount() { return amount; }
    abstract String pay();                // har child ka apna tareeka
}

class UpiPayment extends Payment {        // Inheritance: Payment ka sab kuch mila
    private final String vpa;
    UpiPayment(double amount, String vpa) { super(amount); this.vpa = vpa; }
    @Override String pay() { return "UPI " + getAmount() + " to " + vpa; }
}

class CardPayment extends Payment {
    CardPayment(double amount) { super(amount); }
    @Override String pay() { return "Card " + getAmount(); }
}

public class Main {
    public static void main(String[] args) {
        List<Payment> list = List.of(new UpiPayment(500, "shop@upi"), new CardPayment(250));
        for (Payment p : list) System.out.println(p.pay());   // Polymorphism: same call, alag kaam
    }
}`;

  const IFACE = `interface Notifier {
    void send(String msg);                          // abstract — implement karna hi padega

    default void sendAll(List<String> msgs) {       // Java 8: default — sab classes ko free mil jaata hai
        for (String m : msgs) send(prefix() + m);
    }
    static Notifier console() {                     // Java 8: static — factory / utility
        return m -> System.out.println(m);
    }
    private String prefix() { return "[N] "; }      // Java 9: private — default methods ka shared helper
}

abstract class BaseRepo {                           // abstract class: state + constructor + common code
    protected int calls = 0;
    final String find(int id) { calls++; return load(id); }   // template: flow fix, step child ka
    protected abstract String load(int id);
}

class UserRepo extends BaseRepo {
    protected String load(int id) { return "user-" + id; }
}

public class Main {
    public static void main(String[] args) {
        Notifier n = Notifier.console();
        n.sendAll(List.of("hi", "bye"));
        UserRepo r = new UserRepo();
        System.out.println(r.find(7) + " calls=" + r.calls);
    }
}`;

  const OVER = `class Parent {
    static String who() { return "Parent.who"; }   // static: class ka, object ka nahi
    String me() { return "Parent.me"; }
    private String secret() { return "Parent.secret"; }
    String callSecret() { return secret(); }
}

class Child extends Parent {
    static String who() { return "Child.who"; }    // ye override NAHI — method hiding
    @Override String me() { return "Child.me"; }   // asli override (runtime pe decide)
    String secret() { return "Child.secret"; }     // naya method — Parent ka private dikhta hi nahi
}

class Calc {
    int add(int a, int b) { return a + b; }        // overloading: same naam, alag parameters
    double add(double a, double b) { return a + b; }
    int add(int a, int b, int c) { return a + b + c; }
}

public class Main {
    public static void main(String[] args) {
        Parent p = new Child();
        System.out.println(Parent.who());   // static: reference type dekha jaata hai
        System.out.println(p.me());         // override: object type (Child)
        System.out.println(p.callSecret()); // private: override hota hi nahi
        Calc c = new Calc();
        System.out.println(c.add(2, 3) + " " + c.add(2.5, 1.5) + " " + c.add(1, 2, 3));
    }
}`;

  const FINAL = `final class Money {                       // final class: koi extend nahi kar sakta (String, Integer jaise)
    private final long paise;              // final field: constructor me ek baar set
    Money(long paise) { this.paise = paise; }
    Money plus(Money o) { return new Money(paise + o.paise); }   // change = naya object
    long paise() { return paise; }
}

public class Main {
    public static void main(String[] args) {
        final List<String> names = new ArrayList<>();
        names.add("Sohel");          // allowed: reference final hai, object nahi
        // names = new ArrayList<>(); // compile error: final reference dobara assign nahi
        Money a = new Money(100), b = a.plus(new Money(50));
        System.out.println(names + " " + a.paise() + " " + b.paise());
    }
}`;

  const COMPOSE = `interface Engine { String start(); }
class PetrolEngine implements Engine { public String start() { return "petrol vroom"; } }
class ElectricEngine implements Engine { public String start() { return "electric hum"; } }

class Car {                                // Car HAS-A Engine (composition)
    private final Engine engine;
    Car(Engine engine) { this.engine = engine; }   // runtime pe koi bhi engine — inject
    String drive() { return "Car: " + engine.start(); }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Car(new PetrolEngine()).drive());
        System.out.println(new Car(new ElectricEngine()).drive());
    }
}`;

  const PASS = `public class Main {
    static class Dog {
        String name;
        Dog(String name) { this.name = name; }
    }
    static void rename(Dog d) { d.name = "Max"; }        // copy of reference → same object badla
    static void replace(Dog d) { d = new Dog("Rocky"); } // sirf local copy ne naya object pakda
    static void bump(int x) { x = x + 1; }               // primitive: value ki copy

    public static void main(String[] args) {
        Dog dog = new Dog("Tommy");
        rename(dog);
        System.out.println(dog.name);
        replace(dog);
        System.out.println(dog.name);
        int n = 5;
        bump(n);
        System.out.println(n);
    }
}`;

  L.c1 = {
    kind: 'th', title: 'Java OOP essentials', topic: 'Java',
    goal: 'OOP ke 4 pillars, abstract class vs interface, overloading vs overriding, <code>final</code>, composition vs inheritance aur pass-by-value — har ek ko <b>code ke saath</b> samjho aur planner ke <b>6 interview questions</b> ka 30–60 sec ka English answer ready rakho.',
    oneLine: 'OOP = data + behaviour ek jagah; interviewer definition nahi, apne project ka example aur trade-off sunna chahta hai.',
    parts: [
      { title: '🧩 Concept — OOP ke 4 pillars (ek example se)', blocks: [
        { p: 'Ek hi example pe chaaron pillars samjho: <b>payments</b> (UPI, Card). Interview me bhi apne project ka aisa hi example do — "Encapsulation means data hiding" jaisi ratti hui line nahi.' },
        { table: { head: ['Pillar', 'Ek line me', 'Example me kahan'], rows: [
          ['<b>Encapsulation</b>', 'Data private, access sirf methods se — rules ek jagah enforce', '<code>private final double amount</code> + constructor me check'],
          ['<b>Abstraction</b>', 'Kya karna hai dikhao, kaise karna hai chhupao', '<code>abstract String pay()</code> — caller ko UPI ki details nahi chahiye'],
          ['<b>Inheritance</b>', 'IS-A relation — parent ka code reuse', '<code>UpiPayment extends Payment</code>'],
          ['<b>Polymorphism</b>', 'Same call, object ke hisaab se alag kaam', '<code>p.pay()</code> loop me — runtime pe sahi class ka method'],
        ] } },
        { code: PILLARS },
        { pre: `Output:
UPI 500.0 to shop@upi
Card 250.0` },
        { tip: 'Polymorphism 2 type: <b>compile-time</b> (overloading — compiler parameters dekh ke chunta hai) aur <b>runtime</b> (overriding — JVM object ka asli type dekh ke chunta hai, "dynamic dispatch").' },
      ] },
      { title: '🧱 Abstract class vs Interface (default, static, private methods)', blocks: [
        { table: { head: ['', 'Abstract class', 'Interface'], rows: [
          ['State (fields)', 'Haan — instance fields, constructor', 'Sirf <code>public static final</code> constants'],
          ['Multiple', 'Ek hi class extend kar sakte ho', 'Kitne bhi implement kar sakte ho'],
          ['Methods', 'abstract + concrete, koi bhi access modifier', 'abstract + <b>default</b> (8) + <b>static</b> (8) + <b>private</b> (9)'],
          ['Relation', 'IS-A, family ka common code', 'CAN-DO — capability / contract'],
          ['Kab', 'Related classes ka shared state / template flow', 'Alag-alag classes ko ek contract dena, loose coupling, lambdas'],
        ] } },
        { code: IFACE },
        { pre: `Output:
[N] hi
[N] bye
user-7 calls=1` },
        { list: [
          '<b>default</b>: interface me naya method add karo bina purane implementations tode (isi liye Java 8 me aaya — <code>List.forEach</code>).',
          '<b>static</b>: interface se related utility / factory — <code>Notifier.console()</code>, <code>List.of()</code>.',
          '<b>private</b>: do default methods ka common code — bahar nahi dikhta.',
          'Do interfaces me same default method → class ko <b>override karna padega</b> (diamond problem ka Java solution), chahe to <code>A.super.m()</code> call karo.',
        ] },
      ] },
      { title: '🔁 Overloading vs Overriding (static / private ka trap)', blocks: [
        { table: { head: ['', 'Overloading', 'Overriding'], rows: [
          ['Kya', 'Same naam, <b>alag parameters</b>, same class (ya child)', 'Child me parent ka <b>same signature</b> wala method'],
          ['Kab decide', 'Compile time', 'Runtime (object ka type)'],
          ['Return type', 'Kuch bhi', 'Same ya subtype (covariant)'],
          ['Access', 'Kuch bhi', 'Kam restrictive ho sakta hai, zyada nahi'],
          ['Exceptions', 'Kuch bhi', 'Naye / bade checked exceptions nahi'],
        ] } },
        { code: OVER },
        { pre: `Output:
Parent.who
Child.me
Parent.secret
5 4.0 6` },
        { p: '<b>static</b> method override nahi hota — child me same static method = <b>hiding</b>; reference type se decide hota hai. <b>private</b> method child ko dikhta hi nahi, toh override ka sawaal hi nahi — child me same naam = bilkul naya method. <code>@Override</code> lagaoge toh dono case me compile error milega — isliye <code>@Override</code> hamesha lagao.' },
      ] },
      { title: '🔒 final — variable, method, class', blocks: [
        { table: { head: ['Kahan', 'Matlab', 'Example'], rows: [
          ['Variable / field', 'Ek baar assign. Object reference final = reference nahi badlega, <b>object ke andar badal sakta hai</b>', '<code>final List&lt;String&gt; names</code> — <code>add()</code> allowed'],
          ['Method', 'Override nahi ho sakta (template flow fix)', '<code>final String find(int id)</code> upar BaseRepo me'],
          ['Class', 'Extend nahi ho sakti — immutability / security', '<code>String</code>, <code>Integer</code>, upar <code>Money</code>'],
        ] } },
        { code: FINAL },
        { pre: `Output:
[Sohel] 100 150` },
        { tip: '<code>final</code> ≠ immutable. Immutable class = final class + private final fields + setters nahi + mutable fields ki defensive copy. (Ye c2 me detail me aayega.) Lambda / inner class me local variable <b>effectively final</b> hona chahiye.' },
      ] },
      { title: '🧩 Composition vs Inheritance', blocks: [
        { p: '<b>Inheritance (IS-A)</b>: <code>UpiPayment extends Payment</code>. <b>Composition (HAS-A)</b>: <code>Car</code> ke andar ek <code>Engine</code> field. "Favor composition over inheritance" kyun?' },
        { list: [
          'Inheritance <b>tight coupling</b> hai — parent badla toh saare children toot sakte hain ("fragile base class").',
          'Java me sirf <b>ek</b> class extend kar sakte ho; composition me kitne bhi parts.',
          'Composition me behaviour <b>runtime pe badal</b> sakte ho (constructor me alag Engine inject) — Strategy pattern, Spring DI isi pe chalta hai.',
          'Inheritance tab, jab sach me IS-A ho aur parent ka poora contract child pe sahi baithe (Liskov). Warna <code>Stack extends Vector</code> jaisi galti — Stack ko Vector ke saare methods mil gaye.',
        ] },
        { code: COMPOSE },
        { pre: `Output:
Car: petrol vroom
Car: electric hum` },
      ] },
      { title: '📦 Pass-by-value — object example se proof', blocks: [
        { p: 'Java <b>hamesha pass-by-value</b> hai. Object ke case me jo value copy hoti hai wo <b>reference (address)</b> hai. Isliye: copy ke through object badloge → asli object badlega; copy ko naya object de doge → caller ka variable nahi badlega.' },
        { code: PASS },
        { pre: `Output:
Max
Max
5` },
        { pre: `main:    dog ──┐
                ├──► Dog{name="Tommy"}   (heap)
rename:  d  ───┘      d.name = "Max" → wahi object badla

replace: d  ──► Dog{name="Rocky"}  (naya object, sirf local d ne pakda)
main:    dog ──► Dog{name="Max"}   (caller ka reference same)` },
      ] },
      { title: '🎤 Interview — planner ke 6 questions (English answers)', blocks: [
        { tip: 'Answers me <b>payments</b> wala example sirf template hai — interview se pehle ise <b>apne asli project</b> ke classes / module se badal lo. Interviewer follow-up wahi se puchega.' },
        { qa: [
          ['Explain the four OOP pillars using an example from your own project.', 'In a payments module I had an abstract <code>Payment</code> class. <b>Encapsulation</b>: the amount is a private final field validated in the constructor, so no one can create an invalid payment. <b>Abstraction</b>: callers only call <code>pay()</code> and do not know how UPI or card works. <b>Inheritance</b>: <code>UpiPayment</code> and <code>CardPayment</code> extend <code>Payment</code> and reuse the validation. <b>Polymorphism</b>: the service loops over a <code>List&lt;Payment&gt;</code> and calls <code>pay()</code>; the JVM picks the right implementation at runtime, so adding a new payment type needs no change in the service.'],
          ['Abstract class vs interface (with default, static and private methods): when do you use each?', 'An abstract class can hold state, constructors and protected helpers, and a class can extend only one. I use it for a family of closely related classes that share state or a fixed template flow. An interface defines a capability; a class can implement many, so I use it for contracts and loose coupling, for example a <code>Notifier</code> injected by Spring. Since Java 8 interfaces have default methods to add behaviour without breaking implementers, and static methods for factories; Java 9 added private methods to share code between default methods. Interfaces still cannot hold instance state.'],
          ['Overloading vs overriding. Can you override a static or private method?', 'Overloading is the same method name with different parameters, resolved at compile time. Overriding is a subclass providing the same signature, resolved at runtime by the object type. Static methods cannot be overridden: a static method with the same signature in the child hides the parent one, and the call is chosen by the reference type. Private methods are not visible to the child, so a same-named method in the child is a new method. Adding <code>@Override</code> in either case gives a compile error.'],
          ['What does final mean on a variable, a method and a class?', 'A final variable can be assigned only once; for a reference it means the reference cannot point elsewhere, but the object itself can still change. A final method cannot be overridden, which protects a template flow. A final class cannot be extended, like <code>String</code>, which helps immutability and security. Note that final alone does not make an object immutable.'],
          ['Composition vs inheritance: why is composition usually preferred?', 'Inheritance creates tight coupling: changes in the base class can break subclasses, and Java allows only one parent. Composition means a class holds other objects and delegates to them, so parts can be swapped at runtime and tested in isolation — that is how strategy pattern and dependency injection work. I use inheritance only for a true is-a relation where the subclass can fully replace the parent (Liskov), otherwise composition.'],
          ['Is Java pass-by-value or pass-by-reference? Prove it with an object example.', 'Java is always pass-by-value. For objects the value passed is a copy of the reference. If a method does <code>d.name = "Max"</code>, the caller sees the change because both copies point to the same object. But if the method does <code>d = new Dog("Rocky")</code>, only the local copy points to the new object and the caller still sees the old one. With true pass-by-reference, the caller\'s variable would have changed.'],
        ] },
        { say: [
          ['Aise bolo — OOP apne project se (45 sec)', 'In my current project we process different payment types. I modelled an abstract Payment class with a private, validated amount — that is encapsulation. Each type, like UPI or card, extends it and implements pay — inheritance and abstraction. The service just iterates over a list of Payment objects and calls pay, and the right implementation runs at runtime — that is polymorphism. Because of this, adding a new payment type meant adding one class and no changes to the service.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          '"Java objects ke liye pass-by-reference hai" — galat. Reference ki <b>copy</b> pass hoti hai.',
          '"final object immutable hota hai" — galat. Sirf reference fix hota hai.',
          'Static method ko "override" bolna — wo hiding hai; reference type se call decide hota hai.',
          'Interface me fields = instance state samajhna — wo <code>public static final</code> constants hote hain.',
          'Sirf return type badal ke overloading — compile error.',
          'Har jagah inheritance — "code reuse" ke liye extends karna, jabki relation HAS-A hai.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['<code>Parent p = new Child(); p.me();</code> — me() override hai. Output?', '<b>Child.me</b> — override runtime pe object type se.'],
          ['Wahi p, par <code>who()</code> static hai aur <code>p.who()</code> likha. Output?', '<b>Parent.who</b> — static ke liye reference type (Parent) dekha jaata hai.'],
          ['<code>void f(List&lt;Integer&gt; l) { l = new ArrayList&lt;&gt;(); l.add(1); }</code> — caller ki list badlegi?', '<b>Nahi</b>. l ko naya object diya, uske baad ka add usi naye object pe hua.'],
          ['<code>final int[] a = {1}; a[0] = 5;</code> compile hoga?', '<b>Haan</b>. Array reference final hai, uske elements nahi.'],
          ['Do interfaces A, B dono me <code>default void hi()</code>; <code>class C implements A, B {}</code>?', '<b>Compile error</b> — C ko <code>hi()</code> override karna padega (chahe to <code>A.super.hi()</code>).'],
        ] },
      ] },
    ],
    checks: [
      '4 pillars apne project ke example se 45 sec me bol sakta hoon',
      'Abstract class vs interface + default / static / private methods ka use bata sakta hoon',
      'Static / private override kyun nahi hota — output example ke saath',
      'Pass-by-value ka Dog example bina dekhe likh sakta hoon',
    ],
    memory: 'Pillars = apna example; interface = CAN-DO, abstract = IS-A + state; static hide hota hai, override nahi; Java hamesha pass-by-value.',
    snippets: [
      { code: PILLARS, out: 'UPI 500.0 to shop@upi\nCard 250.0' },
      { code: IFACE, out: '[N] hi\n[N] bye\nuser-7 calls=1' },
      { code: OVER, out: 'Parent.who\nChild.me\nParent.secret\n5 4.0 6' },
      { code: FINAL, out: '[Sohel] 100 150' },
      { code: COMPOSE, out: 'Car: petrol vroom\nCar: electric hum' },
      { code: PASS, out: 'Max\nMax\n5' },
    ],
  };
})();
