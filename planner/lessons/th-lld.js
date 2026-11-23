// Planner lessons — LLD rounds (lp1 Parking Lot)
// Theory format: concept Hinglish me → har planner interview question ka English answer (qa) → code + output → traps → self-test.
// snippets: validate-lessons.js --java inhe compile + run karke output match karta hai.
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});

  // ======================= lp1 — code examples =======================
  const STRATEGY = `enum Size { SMALL, MEDIUM, LARGE }

class Spot {
    final String id;
    final Size size;
    Spot(String id, Size size) { this.id = id; this.size = size; }
}

interface AllocationStrategy { Optional<Spot> pick(List<Spot> free, Size need); }

class NearestFirst implements AllocationStrategy {        // list floor-order me hai — pehla jo fit ho
    public Optional<Spot> pick(List<Spot> free, Size need) {
        return free.stream().filter(s -> s.size.compareTo(need) >= 0).findFirst();
    }
}

class BestFit implements AllocationStrategy {             // sabse chhota fitting spot — bade spots trucks ke liye bachao
    public Optional<Spot> pick(List<Spot> free, Size need) {
        return free.stream().filter(s -> s.size.compareTo(need) >= 0)
            .min(Comparator.comparing((Spot s) -> s.size));
    }
}

interface PricingStrategy { long fee(long minutes); }

class Hourly implements PricingStrategy {                 // har shuru hua ghanta, minimum 1
    private final long rate;
    Hourly(long rate) { this.rate = rate; }
    public long fee(long minutes) { return Math.max(1, (minutes + 59) / 60) * rate; }
}

class FlatDaily implements PricingStrategy {              // har shuru hua din = 300
    public long fee(long minutes) { return Math.max(1, (minutes + 1439) / 1440) * 300; }
}

class ParkingService {                                    // context: strategies constructor se inject (c8 ka DI)
    private final AllocationStrategy alloc;
    private final PricingStrategy pricing;
    ParkingService(AllocationStrategy alloc, PricingStrategy pricing) { this.alloc = alloc; this.pricing = pricing; }
    String quote(List<Spot> free, Size need, long minutes) {
        String spot = alloc.pick(free, need).map(s -> s.id).orElse("FULL");
        return need + " -> " + spot + ", fee for " + minutes + " min = " + pricing.fee(minutes);
    }
}

public class Main {
    public static void main(String[] args) {
        List<Spot> free = List.of(new Spot("F0-L1", Size.LARGE), new Spot("F0-S1", Size.SMALL), new Spot("F1-M1", Size.MEDIUM));
        ParkingService simple = new ParkingService(new NearestFirst(), new Hourly(50));
        ParkingService smart = new ParkingService(new BestFit(), new FlatDaily());
        System.out.println("nearest+hourly: " + simple.quote(free, Size.SMALL, 130));
        System.out.println("bestfit+daily:  " + smart.quote(free, Size.SMALL, 130));
        System.out.println("nearest+hourly: " + simple.quote(free, Size.MEDIUM, 30));
        System.out.println("bestfit+daily:  " + smart.quote(free, Size.MEDIUM, 1500));
        System.out.println("bestfit+daily:  " + smart.quote(List.of(new Spot("F0-S1", Size.SMALL)), Size.LARGE, 10));
    }
}`;

  const CONC = `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

class Spot {
    final String id;
    private final AtomicBoolean free = new AtomicBoolean(true);
    Spot(String id) { this.id = id; }
    boolean tryOccupy() { return free.compareAndSet(true, false); }   // check + set ek atomic step
    void release() { free.set(true); }
}

public class Main {
    public static void main(String[] args) throws Exception {
        // 1) Do cars, ek spot, dono ek saath try karti hain
        Spot spot = new Spot("F0-M1");
        AtomicInteger wins = new AtomicInteger();
        CountDownLatch go = new CountDownLatch(1);
        List<Thread> cars = new ArrayList<>();
        for (String plate : List.of("KA-01", "MH-02")) {
            Thread t = new Thread(() -> {
                try { go.await(); } catch (InterruptedException e) { return; }   // dono ready → ek saath chhodo
                if (spot.tryOccupy()) wins.incrementAndGet();
            });
            cars.add(t);
            t.start();
        }
        go.countDown();
        for (Thread t : cars) t.join();
        System.out.println("2 cars, 1 spot -> successful claims = " + wins.get());

        // 2) 20 cars, 5 spots: spotId -> plate map me putIfAbsent = atomic claim
        ConcurrentHashMap<String, String> spotToCar = new ConcurrentHashMap<>();
        List<String> spotIds = List.of("S1", "S2", "S3", "S4", "S5");
        ExecutorService pool = Executors.newFixedThreadPool(8);
        AtomicInteger rejected = new AtomicInteger();
        for (int i = 1; i <= 20; i++) {
            String plate = "CAR-" + i;
            pool.submit(() -> {
                for (String s : spotIds) if (spotToCar.putIfAbsent(s, plate) == null) return;   // mila → done
                rejected.incrementAndGet();                                                  // sab bhare
            });
        }
        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);
        System.out.println("20 cars, 5 spots -> parked = " + spotToCar.size() + ", rejected = " + rejected.get());
        System.out.println("any car parked twice? " + (new HashSet<>(spotToCar.values()).size() != spotToCar.size()));
    }
}`;

  const LOT_IMPORTS = `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
`;

  const LOT_CORE = `enum VehicleType { BIKE, CAR, TRUCK }
enum SpotSize { SMALL, MEDIUM, LARGE }

class Vehicle {
    final String plate;
    final VehicleType type;
    Vehicle(String plate, VehicleType type) { this.plate = plate; this.type = type; }
    SpotSize needs() {
        return switch (type) {
            case BIKE -> SpotSize.SMALL;
            case CAR -> SpotSize.MEDIUM;
            case TRUCK -> SpotSize.LARGE;
        };
    }
}

class ParkingSpot {
    final String id;
    final SpotSize size;
    private final AtomicBoolean free = new AtomicBoolean(true);
    ParkingSpot(String id, SpotSize size) { this.id = id; this.size = size; }
    boolean canFit(Vehicle v) { return size.compareTo(v.needs()) >= 0; }
    boolean isFree() { return free.get(); }
    boolean tryOccupy() { return free.compareAndSet(true, false); }
    void release() { free.set(true); }
    String label() { return id + "(" + size + ")"; }
}

class Floor {
    final int no;
    final List<ParkingSpot> spots;
    Floor(int no, List<ParkingSpot> spots) { this.no = no; this.spots = spots; }
}

class Ticket {
    final String id;
    final Vehicle vehicle;
    final ParkingSpot spot;
    final long inMin;
    Ticket(String id, Vehicle vehicle, ParkingSpot spot, long inMin) {
        this.id = id; this.vehicle = vehicle; this.spot = spot; this.inMin = inMin;
    }
    @Override public String toString() { return id + " " + vehicle.plate + " -> " + spot.label(); }
}

interface SpotAllocationStrategy { List<ParkingSpot> candidates(List<Floor> floors, Vehicle v); }

class BestFitStrategy implements SpotAllocationStrategy {
    public List<ParkingSpot> candidates(List<Floor> floors, Vehicle v) {
        List<ParkingSpot> out = new ArrayList<>();
        for (Floor f : floors)
            for (ParkingSpot s : f.spots)
                if (s.isFree() && s.canFit(v)) out.add(s);
        out.sort(Comparator.comparingInt(s -> s.size.ordinal()));   // stable: same size → neeche wala floor pehle
        return out;
    }
}

interface PricingStrategy { long fee(Ticket t, long outMin); }

class HourlyPricing implements PricingStrategy {
    private final Map<VehicleType, Long> perHour =
        new EnumMap<>(Map.of(VehicleType.BIKE, 20L, VehicleType.CAR, 50L, VehicleType.TRUCK, 100L));
    public long fee(Ticket t, long outMin) {
        long hours = Math.max(1, (outMin - t.inMin + 59) / 60);
        return hours * perHour.get(t.vehicle.type);
    }
}

class ParkingLot {
    private final List<Floor> floors;
    private final SpotAllocationStrategy allocation;
    private final PricingStrategy pricing;
    private final Map<String, Ticket> active = new ConcurrentHashMap<>();
    private final AtomicInteger seq = new AtomicInteger();

    ParkingLot(List<Floor> floors, SpotAllocationStrategy allocation, PricingStrategy pricing) {
        this.floors = floors; this.allocation = allocation; this.pricing = pricing;
    }

    Ticket park(Vehicle v, long nowMin) {
        for (ParkingSpot s : allocation.candidates(floors, v))
            if (s.tryOccupy()) {                                    // race haara → agla candidate
                Ticket t = new Ticket("T" + seq.incrementAndGet(), v, s, nowMin);
                active.put(t.id, t);
                return t;
            }
        throw new IllegalStateException("lot full for " + v.type);
    }

    long unpark(String ticketId, long nowMin) {
        Ticket t = active.remove(ticketId);                         // atomic: ek ticket ek hi baar
        if (t == null) throw new IllegalArgumentException("invalid ticket " + ticketId);
        long fee = pricing.fee(t, nowMin);                          // payment yahan (PaymentProcessor inject kar sakte ho)
        t.spot.release();
        return fee;
    }

    long freeSpots() { return floors.stream().flatMap(f -> f.spots.stream()).filter(ParkingSpot::isFree).count(); }
}
`;

  const LOT_MAIN = `
public class Main {
    public static void main(String[] args) {
        List<Floor> floors = List.of(
            new Floor(0, List.of(new ParkingSpot("F0-S1", SpotSize.SMALL), new ParkingSpot("F0-M1", SpotSize.MEDIUM))),
            new Floor(1, List.of(new ParkingSpot("F1-M1", SpotSize.MEDIUM), new ParkingSpot("F1-L1", SpotSize.LARGE))));
        ParkingLot lot = new ParkingLot(floors, new BestFitStrategy(), new HourlyPricing());

        Ticket t1 = lot.park(new Vehicle("KA-01", VehicleType.CAR), 0);
        Ticket t2 = lot.park(new Vehicle("KA-02", VehicleType.BIKE), 10);
        Ticket t3 = lot.park(new Vehicle("KA-03", VehicleType.TRUCK), 20);
        Ticket t4 = lot.park(new Vehicle("KA-04", VehicleType.CAR), 30);
        for (Ticket t : List.of(t1, t2, t3, t4)) System.out.println(t);
        try {
            lot.park(new Vehicle("KA-05", VehicleType.CAR), 40);
        } catch (IllegalStateException e) {
            System.out.println(e.getMessage());
        }
        System.out.println(t1.id + " fee = " + lot.unpark(t1.id, 130) + ", free spots = " + lot.freeSpots());
        System.out.println(lot.park(new Vehicle("KA-05", VehicleType.CAR), 140));
        try {
            lot.unpark(t1.id, 150);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}`;

  const LOT = LOT_IMPORTS + '\n' + LOT_CORE + LOT_MAIN;

  const EV_CLASSES = `// ======== EV extension: sirf NAYI classes — ParkingLot / BestFitStrategy / HourlyPricing untouched ========
class ElectricVehicle extends Vehicle {
    final int kwhNeeded;
    ElectricVehicle(String plate, int kwhNeeded) { super(plate, VehicleType.CAR); this.kwhNeeded = kwhNeeded; }
}

class EvSpot extends ParkingSpot {                                  // charger wala spot
    final int kw;
    EvSpot(String id, int kw) { super(id, SpotSize.MEDIUM); this.kw = kw; }
    @Override boolean canFit(Vehicle v) { return v instanceof ElectricVehicle && super.canFit(v); }   // sirf EV
    @Override String label() { return id + "(EV " + kw + "kW)"; }
}

class EvFirstStrategy implements SpotAllocationStrategy {           // Decorator: base ke candidates, EV ke liye charger pehle
    private final SpotAllocationStrategy base;
    EvFirstStrategy(SpotAllocationStrategy base) { this.base = base; }
    public List<ParkingSpot> candidates(List<Floor> floors, Vehicle v) {
        List<ParkingSpot> all = new ArrayList<>(base.candidates(floors, v));
        if (v instanceof ElectricVehicle) all.sort(Comparator.comparingInt(s -> s instanceof EvSpot ? 0 : 1));
        return all;
    }
}

class ChargingPricing implements PricingStrategy {                  // Decorator: parking fee + charging fee
    private final PricingStrategy base;
    private final long perKwh;
    ChargingPricing(PricingStrategy base, long perKwh) { this.base = base; this.perKwh = perKwh; }
    public long fee(Ticket t, long outMin) {
        long fee = base.fee(t, outMin);
        if (t.spot instanceof EvSpot ev && t.vehicle instanceof ElectricVehicle car) {
            long kwh = Math.min(car.kwhNeeded, ev.kw * (outMin - t.inMin) / 60);   // charger ki speed ka limit
            fee += kwh * perKwh;
        }
        return fee;
    }
}

// ======== core (upar wala, bilkul same) ========
`;

  const EV_MAIN = `
public class Main {
    public static void main(String[] args) {
        List<Floor> floors = List.of(
            new Floor(0, List.of(new ParkingSpot("F0-M1", SpotSize.MEDIUM), new EvSpot("F0-E1", 7))),
            new Floor(1, List.of(new ParkingSpot("F1-M1", SpotSize.MEDIUM))));
        ParkingLot lot = new ParkingLot(floors,
            new EvFirstStrategy(new BestFitStrategy()),
            new ChargingPricing(new HourlyPricing(), 15));

        Ticket a = lot.park(new Vehicle("KA-01", VehicleType.CAR), 0);      // normal car: EV spot allowed nahi
        Ticket b = lot.park(new ElectricVehicle("EV-01", 30), 0);           // EV: charger spot pehle
        Ticket c = lot.park(new ElectricVehicle("EV-02", 30), 0);           // charger busy → normal spot fallback
        for (Ticket t : List.of(a, b, c)) System.out.println(t);
        System.out.println(a.id + " fee = " + lot.unpark(a.id, 60));
        System.out.println(b.id + " fee = " + lot.unpark(b.id, 120) + " (parking 100 + 14 kWh x 15)");
        System.out.println(c.id + " fee = " + lot.unpark(c.id, 120) + " (no charger, parking only)");
    }
}`;

  const EV = LOT_IMPORTS + '\n' + EV_CLASSES + LOT_CORE + EV_MAIN;

  // =================================================================
  L.lp1 = {
    kind: 'th', title: 'LLD: Parking Lot', topic: 'LLD',
    goal: 'Sunday LLD round: Parking Lot ko interview ki tarah design karo — <b>requirements clarify</b>, entities + <b>class diagram</b>, allocation aur pricing ke liye <b>Strategy pattern</b>, do cars ek spot pe <b>concurrency</b>, 60 minute me <b>core code</b> aur phir <b>EV charging</b> extension bina core badle. Har piece runnable Java + output, aur planner ke <b>5 questions</b> ka English answer.',
    oneLine: 'Pehle requirements, phir nouns → classes, jo badalta hai (allocation, pricing) wo Strategy, spot claim atomic (compareAndSet), aur naya feature = nayi class, purana code untouched (Open/Closed).',
    parts: [
      { title: '📋 Requirements — pehle 5 minute sirf sawaal (checklist)', blocks: [
        { p: 'LLD round me sabse badi galti: seedha code likhna. Pehle <b>scope fix</b> karo — interviewer jaan-boojh ke problem vague deta hai. Ye checklist bolo, assumptions likho, phir design.' },
        { table: { head: ['Area', 'Kya poochna hai', 'Hamara assumption (is lesson me)'], rows: [
          ['<b>Floors</b>', 'Kitne floors? Har floor pe kitne spots? Multiple entry / exit gates?', 'N floors, har floor pe mixed spots; multiple gates → concurrency'],
          ['<b>Vehicle types</b>', 'Bike, car, truck? EV? Handicapped?', 'BIKE, CAR, TRUCK; EV baad me extension'],
          ['<b>Spot sizes</b>', 'Kaunsa vehicle kis spot me? Chhoti gaadi bade spot me chalegi?', 'SMALL / MEDIUM / LARGE; vehicle apne size ya bade spot me'],
          ['<b>Tickets</b>', 'Entry pe ticket? Lost ticket? Ek gaadi do baar?', 'Entry pe ticket (id, vehicle, spot, entry time); exit pe ticket se unpark'],
          ['<b>Payment / pricing</b>', 'Hourly? Vehicle type pe rate? Flat daily? Cash / card / UPI?', 'Hourly per vehicle type, har shuru hua ghanta; pricing pluggable'],
          ['<b>Allocation</b>', 'Nearest to gate? Lowest floor? Best fit?', 'Best fit (sabse chhota fitting spot), pluggable'],
          ['<b>Display / admin</b>', 'Free spots board? Admin spots add / remove?', 'Free spot count; admin out of scope'],
          ['<b>Non-functional</b>', 'Concurrent entries? Persistence? Scale?', 'Thread-safe in-memory; DB out of scope'],
        ] } },
        { tip: 'Requirements ko <b>functional</b> (park, unpark, fee, availability) aur <b>non-functional</b> (thread-safety, extensibility) me baant ke bolo. Fir clearly bolo: "Out of scope: reservations, admin UI, persistence." Interviewer ko dikhta hai ki tum scope control kar sakte ho.' },
      ] },
      { title: '🧱 Entities + relationships — class diagram', blocks: [
        { p: 'Trick: requirement me se <b>nouns = classes</b>, <b>verbs = methods</b>. Nouns: parking lot, floor, spot, vehicle, ticket, payment. Verbs: park, unpark, calculate fee, find spot. Jo cheez <b>badal sakti hai</b> (spot dhoondhne ka tareeka, rate) usko interface ke peeche rakho.' },
        { pre: `                    ┌──────────────────────────────┐
                    │ ParkingLot                   │
                    │ - floors: List<Floor>        │
                    │ - active: Map<id, Ticket>    │──uses──► «interface» SpotAllocationStrategy
                    │ + park(Vehicle, now): Ticket │              ▲ BestFitStrategy, NearestFirst, EvFirstStrategy
                    │ + unpark(ticketId, now): fee │──uses──► «interface» PricingStrategy
                    └──────────────┬───────────────┘              ▲ HourlyPricing, FlatDaily, ChargingPricing
                                   │ 1..*  (composition)
                             ┌─────▼─────┐
                             │ Floor     │
                             │ - no      │
                             └─────┬─────┘
                                   │ 1..*  (composition)
                         ┌─────────▼──────────┐          ┌────────────────────┐
                         │ ParkingSpot        │◄─────────│ Ticket             │
                         │ - id, size         │  1    1  │ - id, inMin        │
                         │ - free: AtomicBool │          │ - vehicle, spot    │──► Vehicle
                         │ + canFit(v)        │          └────────────────────┘    - plate, type
                         │ + tryOccupy()      │                                     + needs(): SpotSize
                         └─────────▲──────────┘                                        ▲
                                   │ extends                                           │ extends
                               EvSpot (kw)                                     ElectricVehicle (kwhNeeded)

  enum VehicleType { BIKE, CAR, TRUCK }     enum SpotSize { SMALL, MEDIUM, LARGE }` },
        { table: { head: ['Relation', 'Kahan', 'Kyun'], rows: [
          ['<b>Composition</b> (owns, lifecycle saath)', 'ParkingLot ◆ Floor ◆ ParkingSpot', 'Lot ke bina floor / spot ka matlab nahi'],
          ['<b>Association</b>', 'Ticket → Vehicle, Ticket → ParkingSpot', 'Ticket sirf refer karta hai; vehicle chala jaata hai, spot rehta hai'],
          ['<b>Dependency (uses, interface)</b>', 'ParkingLot → SpotAllocationStrategy / PricingStrategy', 'Strategy constructor se inject — swap karo bina lot badle (c8 DI)'],
          ['<b>Inheritance</b> (sirf jahan true IS-A)', 'EvSpot extends ParkingSpot, ElectricVehicle extends Vehicle', 'EV spot sach me ek spot hai; behaviour thoda alag (canFit)'],
        ] } },
        { tip: 'c1 ka rule yahan apply hota hai: <b>composition over inheritance</b>. Vehicle types ke liye 3 subclasses (Bike / Car / Truck) bana sakte the, par unme behaviour alag nahi — sirf data. Isliye <code>enum VehicleType</code> + <code>needs()</code> kaafi hai. Subclass tab, jab behaviour alag ho (EvSpot.canFit).' },
      ] },
      { title: '🎯 Strategy pattern — spot allocation aur pricing', blocks: [
        { p: '<b>Strategy</b> = ek kaam ke kai algorithms, har ek apni class me, common interface ke peeche; context (ParkingService / ParkingLot) bas interface ko call karta hai. Naya algorithm = nayi class, context untouched (<b>Open/Closed</b>). Spring me ye strategies beans hoti hain aur <code>Map&lt;String, PricingStrategy&gt;</code> inject karke config / request se choose karte ho (c8).' },
        { table: { head: ['Strategy', 'Options', 'Trade-off'], rows: [
          ['<b>Allocation</b>', 'NearestFirst (gate ke paas / lowest floor), BestFit (sabse chhota fitting), FloorBalanced', 'Nearest = customer happy, par bike LARGE spot kha sakti hai; BestFit = capacity bachti hai'],
          ['<b>Pricing</b>', 'Hourly (per vehicle type), FlatDaily, Weekend / peak, EV charging add-on', 'Business rule badalte rehte hain → if-else ki jagah strategy'],
        ] } },
        { code: STRATEGY },
        { pre: `Output:
nearest+hourly: SMALL -> F0-L1, fee for 130 min = 150
bestfit+daily:  SMALL -> F0-S1, fee for 130 min = 300
nearest+hourly: MEDIUM -> F0-L1, fee for 30 min = 50
bestfit+daily:  MEDIUM -> F1-M1, fee for 1500 min = 600
bestfit+daily:  LARGE -> FULL, fee for 10 min = 300` },
        { p: 'Dekho: NearestFirst ne <b>bike ke liye LARGE spot</b> de diya (F0-L1) — truck aayega toh jagah nahi. BestFit ne SMALL diya. Same <code>ParkingService</code> class, sirf constructor me alag strategy. Fast lookup chahiye (hazaaron spots) toh har size ke liye ek free-spot queue / <code>TreeSet</code> rakho, linear scan nahi — interview me ye optimisation bol do.' },
      ] },
      { title: '🔒 Concurrency — do cars, ek spot', blocks: [
        { p: 'Multiple entry gates = multiple threads. Bug: <b>check-then-act</b> — gate 1 ne dekha "F0-M1 free", gate 2 ne bhi dekha "free", dono ne occupy kiya → do tickets ek spot pe. (c7 ka race condition.) Fix: "free hai?" aur "occupy karo" ko <b>ek atomic step</b> banao.' },
        { table: { head: ['Approach', 'Kaise', 'Trade-off'], rows: [
          ['<code>synchronized park()</code>', 'Poora park method ek lock', 'Simple aur sahi, par saare gates serialize — throughput kam'],
          ['<b>Per-spot CAS</b> (<code>AtomicBoolean.compareAndSet</code>)', 'Har spot apna atomic flag; haare toh agla candidate', 'Lock-free, high concurrency — <b>default choice</b>'],
          ['<code>ConcurrentHashMap.putIfAbsent(spotId, ticket)</code>', 'Map hi ownership ka source of truth', 'Atomic, simple; spot object me state nahi'],
          ['Per-floor / per-size lock (<code>ReentrantLock</code>)', 'Lock striping', 'Free-spot queue ke saath achha'],
          ['DB me', '<code>UPDATE spot SET free=false WHERE id=? AND free=true</code> (1 row updated = jeet), ya optimistic version column', 'Multi-server deployment me yahi chahiye'],
        ] } },
        { code: CONC },
        { pre: `Output:
2 cars, 1 spot -> successful claims = 1
20 cars, 5 spots -> parked = 5, rejected = 15
any car parked twice? false` },
        { tip: 'Kaun si car jeeti wo har run me alag ho sakta hai (thread scheduling) — isliye demo <b>sirf count</b> print karta hai, jo hamesha 1 hai. Interview me bhi yahi guarantee bolo: "exactly one wins; loser retries next candidate or gets lot-full". <code>unpark</code> me bhi <code>active.remove(ticketId)</code> atomic hai — ek ticket do baar pay nahi hoga.' },
      ] },
      { title: '⏱️ 60-minute core code — ParkingLot (park, unpark, fee)', blocks: [
        { p: 'Interview time plan: <b>5 min</b> requirements → <b>10 min</b> entities + diagram → <b>30 min</b> core code → <b>10 min</b> concurrency + extension → <b>5 min</b> test walk-through. Core me sirf ye: enums, Vehicle, ParkingSpot, Floor, Ticket, 2 strategy interfaces + 1 implementation each, ParkingLot. Getters / builders / DB skip karo — interviewer ko design chahiye, boilerplate nahi.' },
        { code: LOT },
        { pre: `Output:
T1 KA-01 -> F0-M1(MEDIUM)
T2 KA-02 -> F0-S1(SMALL)
T3 KA-03 -> F1-L1(LARGE)
T4 KA-04 -> F1-M1(MEDIUM)
lot full for CAR
T1 fee = 150, free spots = 1
T5 KA-05 -> F0-M1(MEDIUM)
invalid ticket T1` },
        { list: [
          '<b>Strategy returns candidates</b> (list), sirf ek spot nahi — kyunki concurrency me pehla candidate haar sakta hai; tab ParkingLot agla try karta hai.',
          'T1 130 min ruka → 3 shuru hue ghante × 50 = <b>150</b>. Spot release hua → KA-05 ko wahi F0-M1 mila.',
          'Same ticket dobara → <code>invalid ticket</code> (double payment / double release se bachao).',
          '<code>Clock</code> ki jagah minutes pass kiye — test deterministic. Real code me <code>java.time.Clock</code> inject karo.',
        ] },
      ] },
      { title: '⚡ Extension — EV charging spots (core code untouched)', blocks: [
        { p: 'Follow-up: "Ab EV charging spots add karo, charging ka alag paisa." Achha design yahan dikhta hai — <b>ParkingLot, BestFitStrategy, HourlyPricing me ek line nahi badli</b>. Sirf nayi classes:' },
        { table: { head: ['Nayi class', 'Pattern', 'Kaam'], rows: [
          ['<code>ElectricVehicle extends Vehicle</code>', 'Inheritance (true IS-A)', 'kwhNeeded rakhta hai'],
          ['<code>EvSpot extends ParkingSpot</code>', 'Override <code>canFit</code>', 'Charger spot sirf EV ke liye; normal car ko mana'],
          ['<code>EvFirstStrategy</code>', '<b>Decorator</b> over allocation strategy', 'Base ke candidates, EV ke liye charger spots aage'],
          ['<code>ChargingPricing</code>', '<b>Decorator</b> over pricing strategy', 'Base parking fee + min(kwhNeeded, kW × hours) × rate'],
        ] } },
        { code: EV },
        { pre: `Output:
T1 KA-01 -> F0-M1(MEDIUM)
T2 EV-01 -> F0-E1(EV 7kW)
T3 EV-02 -> F1-M1(MEDIUM)
T1 fee = 50
T2 fee = 310 (parking 100 + 14 kWh x 15)
T3 fee = 100 (no charger, parking only)` },
        { tip: 'Ye <b>Open/Closed principle</b> ka live demo hai: extension ke liye open, modification ke liye closed. Agar tumhara core <code>switch (spotType)</code> se bhara hota, toh EV ke liye har switch chhedna padta.' },
      ] },
      { title: '🎤 Interview — planner ke 5 questions (English answers)', blocks: [
        { tip: 'LLD round me answers <b>bol ke + draw karke</b> dene hote hain. Neeche ke answers template hain — practice me khud whiteboard / paper pe diagram banao aur 60 min ka timer lagao. Agar tumhare project me koi allocation / pricing jaisa pluggable rule tha, uska example bhi jod do.' },
        { qa: [
          ['Requirements: floors, vehicle types, spot sizes, tickets, payment.', 'Before designing I would clarify scope. Floors: how many, and are there multiple entry and exit gates, because that means concurrent requests. Vehicle types: bike, car and truck, and whether EVs or handicapped spots are needed. Spot sizes: small, medium and large, and whether a smaller vehicle may use a bigger spot — I assume yes. Tickets: a ticket is issued at entry with vehicle, spot and entry time, and it is required at exit; I would ask about lost tickets. Payment: hourly pricing per vehicle type, rounded up to the started hour, paid at exit by card, cash or UPI, and pricing rules should be easy to change. Non-functional: thread-safe in memory; reservations, admin UI and persistence are out of scope unless asked.'],
          ['Identify entities and relationships; draw the class diagram.', 'From the nouns I get ParkingLot, Floor, ParkingSpot, Vehicle, Ticket and Payment, plus two enums, VehicleType and SpotSize. ParkingLot is composed of Floors and each Floor is composed of ParkingSpots. A Ticket is associated with one Vehicle and one ParkingSpot and stores the entry time. ParkingLot keeps a map of active tickets and depends on two interfaces, SpotAllocationStrategy and PricingStrategy, which are injected through the constructor. I keep vehicle types as an enum rather than subclasses, because they differ only in data, and I use inheritance only where behaviour really differs, such as an EV spot overriding canFit. The public API is just park(vehicle) returning a ticket and unpark(ticketId) returning the fee.'],
          ['Spot allocation strategy and pricing strategy (Strategy pattern).', 'Both rules change independently of the core, so I put each behind an interface. SpotAllocationStrategy returns an ordered list of candidate spots for a vehicle; implementations can be nearest-to-gate, lowest floor, or best fit, which picks the smallest spot that fits so large spots stay free for trucks. PricingStrategy computes the fee from the ticket and exit time; implementations are hourly per vehicle type, flat daily, or peak pricing. ParkingLot only talks to the interfaces, so adding a new rule means adding a class, not editing the lot — that is the Open/Closed principle. In Spring each strategy would be a bean, and I could inject a Map of strategies and choose one from configuration. For scale I would keep a free-spot queue per size instead of scanning all spots.'],
          ['Concurrency: two cars grabbing the same spot.', 'With several gates, two threads can both see a spot as free and both occupy it — a check-then-act race. I make the claim atomic per spot: each spot has an <code>AtomicBoolean</code>, and <code>tryOccupy</code> does <code>compareAndSet(true, false)</code>. Exactly one thread succeeds; the loser simply tries the next candidate from the strategy, or gets a lot-full response. This is lock-free, so gates do not block each other. Alternatives are a synchronized park method, which is simple but serializes all gates, or <code>ConcurrentHashMap.putIfAbsent</code> keyed by spot id. Unpark uses <code>active.remove(ticketId)</code>, which is atomic, so a ticket cannot be paid twice. If the lot runs on several servers, the same idea moves to the database: a conditional update where free is true, or optimistic locking with a version column.'],
          ['Code the core classes in 60 minutes, then extend for EV charging spots.', 'I would spend about five minutes on requirements, ten on the class diagram, thirty on core code — the enums, Vehicle, ParkingSpot with an atomic free flag, Floor, Ticket, the two strategy interfaces with one implementation each, and ParkingLot with park and unpark — and the rest on concurrency, the extension and a quick walk-through with sample inputs. For EV charging I would not touch ParkingLot. I add an ElectricVehicle that knows how many kilowatt-hours it needs, an EvSpot that extends ParkingSpot with a charger power and only accepts electric vehicles, an EvFirstStrategy decorator that puts charger spots first for EVs, and a ChargingPricing decorator that adds the energy charged, limited by charger speed and time, times a per-kWh rate. If no charger is free, the EV falls back to a normal spot and pays parking only.'],
        ] },
        { say: [
          ['Aise bolo — 45 sec walkthrough opener', 'Let me first confirm the scope. I will assume a multi-floor lot with several gates, three vehicle types — bike, car and truck — and three spot sizes, where a vehicle can use its own size or bigger. At entry we issue a ticket, and at exit we compute an hourly fee per vehicle type. My core classes will be ParkingLot, Floor, ParkingSpot, Vehicle and Ticket. The two things most likely to change, how we pick a spot and how we price, will be strategies injected into the lot. Because gates run in parallel, claiming a spot will be an atomic compare-and-set. Then I will show how EV charging fits in without changing the core.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          'Requirements pooche bina seedha classes likhna — interviewer isi pe pehla negative point deta hai.',
          'Har vehicle type ke liye subclass (Bike / Car / Truck) jinme behaviour same hai — enum kaafi hai.',
          'Allocation / pricing ko <code>if-else</code> / <code>switch</code> se ParkingLot ke andar likhna — extension pe core chhedna padega.',
          '<code>if (spot.isFree()) spot.occupy();</code> — check-then-act race; atomic CAS / lock chahiye.',
          'Poore lot pe ek global lock aur fir "scalable" bolna — throughput ka trade-off khud batao.',
          'Unpark me ticket validate na karna — same ticket do baar, spot do baar release.',
          'Fee calculation me rounding / minimum charge ignore karna (130 min = 3 ghante, 2 nahi).',
          'Getters, setters, DB layer me 20 minute kharch karna — core flow adhoora reh jaata hai.',
          'EV extension ke liye ParkingLot ka code badalna — decorator / nayi strategy se karo.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['Free spots order me: <code>F0-L1 (LARGE), F0-S1 (SMALL)</code>. Bike aayi. NearestFirst aur BestFit kya denge?', 'NearestFirst → <b>F0-L1</b> (pehla jo fit ho), BestFit → <b>F0-S1</b> (sabse chhota fitting).'],
          ['Hourly 50 per hour, har shuru hua ghanta, minimum 1. Car 61 minute ruki. Fee?', '<b>100</b> — (61 + 59) / 60 = 2 ghante × 50.'],
          ['Do threads ek hi <code>AtomicBoolean(true)</code> pe <code>compareAndSet(true, false)</code> chalate hain. Kitne true return karenge?', '<b>Exactly 1</b> — doosre ke liye value already false hai.'],
          ['EV 7 kW charger pe 60 minute ruka, use 30 kWh chahiye, rate 15 per kWh, parking 50/hour. Fee?', '<b>155</b> — parking 50 + min(30, 7 × 60 / 60 = 7) × 15 = 105.'],
          ['Normal petrol car aayi, sirf ek <code>EvSpot</code> free hai. Kya hoga?', '<b>lot full for CAR</b> — <code>EvSpot.canFit</code> sirf ElectricVehicle ko allow karta hai, toh candidates khaali.'],
        ] },
      ] },
    ],
    checks: [
      'Parking Lot ki requirements checklist (floors, vehicles, spots, ticket, payment, non-functional) 2 min me bol sakta hoon',
      'Class diagram (composition / association / strategy interfaces) bina dekhe bana sakta hoon',
      'Spot claim race aur CAS / putIfAbsent / synchronized ke trade-offs samjha sakta hoon',
      'Core ParkingLot 30–40 min me likh sakta hoon aur EV extension decorator se, core badle bina',
    ],
    memory: 'Requirements → nouns = classes → jo badle wo Strategy (allocation, pricing) → spot claim = AtomicBoolean.compareAndSet, loser next candidate → unpark = map.remove (ek ticket ek baar) → naya feature = nayi class / decorator (OCP).',
    snippets: [
      { code: STRATEGY, out: 'nearest+hourly: SMALL -> F0-L1, fee for 130 min = 150\nbestfit+daily:  SMALL -> F0-S1, fee for 130 min = 300\nnearest+hourly: MEDIUM -> F0-L1, fee for 30 min = 50\nbestfit+daily:  MEDIUM -> F1-M1, fee for 1500 min = 600\nbestfit+daily:  LARGE -> FULL, fee for 10 min = 300' },
      { code: CONC, out: '2 cars, 1 spot -> successful claims = 1\n20 cars, 5 spots -> parked = 5, rejected = 15\nany car parked twice? false' },
      { code: LOT, out: 'T1 KA-01 -> F0-M1(MEDIUM)\nT2 KA-02 -> F0-S1(SMALL)\nT3 KA-03 -> F1-L1(LARGE)\nT4 KA-04 -> F1-M1(MEDIUM)\nlot full for CAR\nT1 fee = 150, free spots = 1\nT5 KA-05 -> F0-M1(MEDIUM)\ninvalid ticket T1' },
      { code: EV, out: 'T1 KA-01 -> F0-M1(MEDIUM)\nT2 EV-01 -> F0-E1(EV 7kW)\nT3 EV-02 -> F1-M1(MEDIUM)\nT1 fee = 50\nT2 fee = 310 (parking 100 + 14 kWh x 15)\nT3 fee = 100 (no charger, parking only)' },
    ],
  };
})();
