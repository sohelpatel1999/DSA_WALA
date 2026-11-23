// Planner lessons — SQL theory (c13 SQL for interviews)
// Theory format: concept Hinglish me → har planner interview question ka English answer (qa) → query + result → traps → self-test.
// NOTE: validator SQL nahi chala sakta (database classpath pe NAHI). Isliye har query + uska exact result table `pre` me hai
//       (MySQL 8 / PostgreSQL syntax). Do runnable Java snippets in-memory list pe wahi joins / ranks / Nth highest nikal ke
//       result tables ko cross-check karte hain.
// snippets: validate-lessons.js --java inhe compile + run karke output match karta hai.
(function () {
  const L = (window.PLAN_LESSONS = window.PLAN_LESSONS || {});

  // ======================= c13 — Java cross-check snippets =======================
  const JOINS = `record Emp(int id, String name, int salary, Integer deptId, Integer managerId) {}
record Dept(int id, String name) {}

public class Main {
    static final List<Emp> EMP = List.of(
        new Emp(1, "Asha", 90000, 1, null), new Emp(2, "Ravi", 75000, 1, 1),
        new Emp(3, "Neha", 75000, 2, 1), new Emp(4, "Karan", 60000, 2, 3),
        new Emp(5, "Meera", 50000, null, 3), new Emp(6, "Arjun", 60000, 1, 2));
    static final List<Dept> DEPT = List.of(new Dept(1, "Engineering"), new Dept(2, "Sales"), new Dept(3, "HR"));

    static String deptName(Integer id) {
        for (Dept d : DEPT) if (id != null && d.id() == id) return d.name();
        return "NULL";
    }

    public static void main(String[] args) {
        System.out.println("INNER JOIN:");                     // sirf matching pairs
        for (Emp e : EMP) for (Dept d : DEPT)
            if (e.deptId() != null && e.deptId() == d.id()) System.out.println("  " + e.name() + " | " + d.name());

        System.out.println("LEFT JOIN (employees left):");     // har employee, match nahi toh NULL
        for (Emp e : EMP) System.out.println("  " + e.name() + " | " + deptName(e.deptId()));

        System.out.println("RIGHT JOIN (departments right):"); // har department
        for (Dept d : DEPT) {
            boolean any = false;
            for (Emp e : EMP) if (e.deptId() != null && e.deptId() == d.id()) { System.out.println("  " + e.name() + " | " + d.name()); any = true; }
            if (!any) System.out.println("  NULL | " + d.name());
        }

        System.out.println("SELF JOIN (employee | manager):");
        Map<Integer, String> byId = new TreeMap<>();
        for (Emp e : EMP) byId.put(e.id(), e.name());
        for (Emp e : EMP) System.out.println("  " + e.name() + " | " + (e.managerId() == null ? "NULL" : byId.get(e.managerId())));
    }
}`;

  const RANKS = `record Emp(int id, String name, int salary, Integer deptId) {}

public class Main {
    static final List<Emp> EMP = List.of(
        new Emp(1, "Asha", 90000, 1), new Emp(2, "Ravi", 75000, 1), new Emp(3, "Neha", 75000, 2),
        new Emp(4, "Karan", 60000, 2), new Emp(5, "Meera", 50000, null), new Emp(6, "Arjun", 60000, 1));

    static String nthHighest(int n) {                         // = DISTINCT ... ORDER BY DESC LIMIT 1 OFFSET n-1
        List<Integer> distinct = EMP.stream().map(Emp::salary).distinct().sorted(Comparator.reverseOrder()).toList();
        return n <= distinct.size() ? String.valueOf(distinct.get(n - 1)) : "NULL";
    }

    public static void main(String[] args) {
        StringJoiner nth = new StringJoiner(", ");
        for (int n = 1; n <= 5; n++) nth.add("N=" + n + " -> " + nthHighest(n));
        System.out.println(nth);
        List<Emp> noDistinct = EMP.stream().sorted((a, b) -> b.salary() - a.salary()).toList();
        System.out.println("without DISTINCT, OFFSET 2 -> " + noDistinct.get(2).salary() + " (wrong for N=3)");

        // ROW_NUMBER / RANK / DENSE_RANK OVER (ORDER BY salary DESC), ROW_NUMBER tie-break by id
        List<Emp> sorted = EMP.stream().sorted(Comparator.comparingInt(Emp::salary).reversed()
            .thenComparingInt(Emp::id)).toList();
        System.out.println("name   salary rn rnk drnk");
        int rank = 0, dense = 0, prev = -1;
        for (int i = 0; i < sorted.size(); i++) {
            Emp e = sorted.get(i);
            if (e.salary() != prev) { rank = i + 1; dense++; prev = e.salary(); }
            System.out.printf("%-6s %d  %d  %d   %d%n", e.name(), e.salary(), i + 1, rank, dense);
        }

        // SUM(salary) OVER (ORDER BY id) — running total
        long run = 0;
        StringBuilder sb = new StringBuilder("running total by id:");
        for (Emp e : EMP) { run += e.salary(); sb.append(' ').append(e.id()).append('=').append(run); }
        System.out.println(sb);

        // SUM(salary) OVER (ORDER BY salary) — default RANGE frame: ties (peers) ek saath judte hain
        StringBuilder rg = new StringBuilder("RANGE frame by salary:");
        for (Emp e : EMP.stream().sorted(Comparator.comparingInt(Emp::salary).thenComparingInt(Emp::id)).toList()) {
            int total = EMP.stream().filter(x -> x.salary() <= e.salary()).mapToInt(Emp::salary).sum();
            rg.append(' ').append(e.name()).append('=').append(total);
        }
        System.out.println(rg);

        // WHERE salary > 55000 GROUP BY dept_id HAVING COUNT(*) >= 3
        Map<Integer, int[]> g = new TreeMap<>();                  // dept -> {count, sum}
        for (Emp e : EMP) if (e.salary() > 55000 && e.deptId() != null) {
            int[] a = g.computeIfAbsent(e.deptId(), k -> new int[2]);
            a[0]++; a[1] += e.salary();
        }
        g.forEach((d, a) -> System.out.println("dept " + d + ": cnt=" + a[0] + " total=" + a[1] + (a[0] >= 3 ? " (HAVING keeps)" : " (HAVING drops)")));

        // duplicates: keep smallest id per email (ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) = 1)
        String[] emails = { "a@x.com", "b@x.com", "a@x.com", "c@x.com", "b@x.com", "a@x.com" };
        Map<String, Integer> firstId = new LinkedHashMap<>();
        List<Integer> delete = new ArrayList<>();
        for (int i = 0; i < emails.length; i++) {
            if (firstId.putIfAbsent(emails[i], i + 1) != null) delete.add(i + 1);
        }
        System.out.println("delete ids " + delete + ", keep " + firstId);
    }
}`;

  const JOINS_OUT = `INNER JOIN:
  Asha | Engineering
  Ravi | Engineering
  Neha | Sales
  Karan | Sales
  Arjun | Engineering
LEFT JOIN (employees left):
  Asha | Engineering
  Ravi | Engineering
  Neha | Sales
  Karan | Sales
  Meera | NULL
  Arjun | Engineering
RIGHT JOIN (departments right):
  Asha | Engineering
  Ravi | Engineering
  Arjun | Engineering
  Neha | Sales
  Karan | Sales
  NULL | HR
SELF JOIN (employee | manager):
  Asha | NULL
  Ravi | Asha
  Neha | Asha
  Karan | Neha
  Meera | Neha
  Arjun | Ravi`;

  const RANKS_OUT = `N=1 -> 90000, N=2 -> 75000, N=3 -> 60000, N=4 -> 50000, N=5 -> NULL
without DISTINCT, OFFSET 2 -> 75000 (wrong for N=3)
name   salary rn rnk drnk
Asha   90000  1  1   1
Ravi   75000  2  2   2
Neha   75000  3  2   2
Karan  60000  4  4   3
Arjun  60000  5  4   3
Meera  50000  6  6   4
running total by id: 1=90000 2=165000 3=240000 4=300000 5=350000 6=410000
RANGE frame by salary: Meera=50000 Karan=170000 Arjun=170000 Ravi=320000 Neha=320000 Asha=410000
dept 1: cnt=3 total=225000 (HAVING keeps)
dept 2: cnt=2 total=135000 (HAVING drops)
delete ids [3, 5, 6], keep {a@x.com=1, b@x.com=2, c@x.com=4}`;

  // ======================= sample data =======================
  const SAMPLE = `-- Sample data (MySQL 8 aur PostgreSQL dono me chalega) — poore lesson me yahi tables

CREATE TABLE departments (id INT PRIMARY KEY, name VARCHAR(50));
CREATE TABLE employees (
    id INT PRIMARY KEY, name VARCHAR(50), salary INT,
    dept_id INT REFERENCES departments(id), manager_id INT
);
INSERT INTO departments VALUES (1, 'Engineering'), (2, 'Sales'), (3, 'HR');
INSERT INTO employees VALUES
    (1, 'Asha',  90000, 1,    NULL),
    (2, 'Ravi',  75000, 1,    1),
    (3, 'Neha',  75000, 2,    1),
    (4, 'Karan', 60000, 2,    3),
    (5, 'Meera', 50000, NULL, 3),
    (6, 'Arjun', 60000, 1,    2);

employees                                            departments
 id | name  | salary | dept_id | manager_id           id | name
----+-------+--------+---------+------------         ----+-------------
  1 | Asha  |  90000 |       1 |       NULL            1 | Engineering
  2 | Ravi  |  75000 |       1 |          1            2 | Sales
  3 | Neha  |  75000 |       2 |          1            3 | HR      <- koi employee nahi
  4 | Karan |  60000 |       2 |          3
  5 | Meera |  50000 |    NULL |          3   <- koi department nahi
  6 | Arjun |  60000 |       1 |          2

Distinct salaries (high -> low): 90000, 75000, 60000, 50000   (75000 aur 60000 do-do baar)`;

  // =================================================================
  L.c13 = {
    kind: 'th', title: 'SQL for interviews', topic: 'Java',
    goal: 'Backend interview ka SQL round: <b>joins</b> (inner / left / right / full / self), <b>Nth highest salary</b> teen tareeke se, <b>WHERE vs HAVING</b> + GROUP BY rules, <b>window functions</b> (ROW_NUMBER, RANK, DENSE_RANK, running total), <b>indexes</b> (B-tree, composite order, kab use nahi hota) aur <b>duplicates delete</b> — har query ek hi sample data pe, exact result table ke saath (MySQL 8 / PostgreSQL), aur planner ke <b>6 interview questions</b> ka English answer.',
    oneLine: 'JOIN = rows jodo (LEFT = left ki saari rows); Nth highest = DISTINCT + LIMIT/OFFSET ya DENSE_RANK; WHERE rows filter karta hai, HAVING groups; window function rows collapse nahi karta; index leftmost prefix se chalta hai aur column pe function lagaya toh nahi chalta.',
    parts: [
      { title: '🗃️ Sample data — ye tables yaad rakho', blocks: [
        { p: 'Poore lesson me ek hi chhota dataset hai, jisme jaan-boojh ke <b>edge cases</b> daale hain: Meera ka koi department nahi (<code>dept_id = NULL</code>), HR department me koi employee nahi, aur salaries me <b>ties</b> hain (75000 ×2, 60000 ×2) — yahi cheezein LEFT/RIGHT JOIN aur RANK vs DENSE_RANK ka farak dikhati hain. Queries khud MySQL / PostgreSQL me chala ke result match karo.' },
        { pre: SAMPLE },
        { p: 'SQL yahan run nahi ho sakta, isliye lesson ke end me do <b>Java snippets</b> hain jo yahi data in-memory list me rakh ke joins, Nth highest aur ranks nikalte hain — result tables unse cross-check kiye gaye hain. c11 (JPA) me jo <code>@Query</code> likhoge, uske neeche yahi SQL chalta hai.' },
      ] },
      { title: '🔗 Concept — Joins: inner, left, right, full, self', blocks: [
        { table: { head: ['Join', 'Kya deta hai', 'Hamare data me'], rows: [
          ['<b>INNER JOIN</b> (ya sirf JOIN)', 'Sirf wo pairs jo ON condition match karein', '5 rows — Meera (no dept) aur HR (no employee) gayab'],
          ['<b>LEFT JOIN</b>', 'Left table ki <b>saari</b> rows; match nahi toh right side NULL', '6 rows — Meera | NULL'],
          ['<b>RIGHT JOIN</b>', 'Right table ki saari rows; match nahi toh left side NULL', '6 rows — NULL | HR'],
          ['<b>FULL OUTER JOIN</b>', 'Dono taraf ki saari rows', '7 rows. <b>MySQL me FULL JOIN nahi hai</b> — LEFT UNION RIGHT se banao'],
          ['<b>SELF JOIN</b>', 'Table ko khud se jodo (do aliases) — hierarchy, pairs', 'Employee → manager naam'],
          ['CROSS JOIN', 'Har row × har row (cartesian)', '6 × 3 = 18 rows'],
        ] } },
        { pre: `-- INNER JOIN: sirf matching
SELECT e.name, d.name AS dept
FROM employees e
JOIN departments d ON d.id = e.dept_id
ORDER BY e.id;

 name  | dept
-------+-------------
 Asha  | Engineering
 Ravi  | Engineering
 Neha  | Sales
 Karan | Sales
 Arjun | Engineering
(5 rows)

-- LEFT JOIN: har employee
SELECT e.name, d.name AS dept
FROM employees e
LEFT JOIN departments d ON d.id = e.dept_id
ORDER BY e.id;

 name  | dept
-------+-------------
 Asha  | Engineering
 Ravi  | Engineering
 Neha  | Sales
 Karan | Sales
 Meera | NULL
 Arjun | Engineering
(6 rows)

-- RIGHT JOIN: har department
SELECT e.name, d.name AS dept
FROM employees e
RIGHT JOIN departments d ON d.id = e.dept_id
ORDER BY d.id, e.id;

 name  | dept
-------+-------------
 Asha  | Engineering
 Ravi  | Engineering
 Arjun | Engineering
 Neha  | Sales
 Karan | Sales
 NULL  | HR
(6 rows)` },
        { pre: `-- FULL OUTER JOIN (PostgreSQL)
SELECT e.name, d.name AS dept
FROM employees e
FULL OUTER JOIN departments d ON d.id = e.dept_id
ORDER BY e.id, d.id;          -- PostgreSQL: ASC me NULL last → HR row end me

 name  | dept
-------+-------------
 Asha  | Engineering
 Ravi  | Engineering
 Neha  | Sales
 Karan | Sales
 Meera | NULL
 Arjun | Engineering
 NULL  | HR
(7 rows)

-- MySQL (FULL JOIN support nahi): LEFT + sirf unmatched RIGHT rows
SELECT e.name, d.name AS dept
FROM employees e LEFT JOIN departments d ON d.id = e.dept_id
UNION ALL
SELECT e.name, d.name
FROM employees e RIGHT JOIN departments d ON d.id = e.dept_id
WHERE e.id IS NULL;           -- same 7 rows (ORDER BY lagao toh order fix)

-- SELF JOIN: employee aur uska manager
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id
ORDER BY e.id;

 employee | manager
----------+---------
 Asha     | NULL
 Ravi     | Asha
 Neha     | Asha
 Karan    | Neha
 Meera    | Neha
 Arjun    | Ravi
(6 rows)       -- INNER JOIN likhte toh Asha (top boss) gayab: 5 rows` },
        { list: [
          '<b>LEFT JOIN + WHERE trap</b>: <code>LEFT JOIN departments d ... WHERE d.name = \'Sales\'</code> → NULL rows WHERE me fail → effectively INNER JOIN ban gaya. Right table pe filter chahiye toh <b>ON me</b> daalo: <code>LEFT JOIN departments d ON d.id = e.dept_id AND d.name = \'Sales\'</code>.',
          '<b>Anti-join</b> ("jinka match nahi"): <code>LEFT JOIN ... WHERE d.id IS NULL</code> ya <code>NOT EXISTS</code>. Departments bina employee ke → HR. <code>NOT IN</code> se bacho jab subquery me NULL ho sakta hai — <code>x NOT IN (1, NULL)</code> kabhi true nahi hota, result khaali.',
          'One-to-many join pe rows <b>multiply</b> hoti hain — join ke baad <code>SUM</code> lagaya toh double counting. c11 ka N+1 / fetch join bhi isi se juda hai.',
        ] },
      ] },
      { title: '🥈 Nth highest salary — subquery, LIMIT/OFFSET, DENSE_RANK', blocks: [
        { p: 'Classic sawaal (LeetCode 176 / 177 jaisa). Hamare data me distinct salaries: 90000, 75000, 60000, 50000 → <b>2nd = 75000, 3rd = 60000</b>, 5th exist nahi karta (NULL). Ties ki wajah se <b>DISTINCT bhoolna</b> sabse common galti hai.' },
        { pre: `-- WAY 1a: 2nd highest — MAX of everything below MAX
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

 second_highest
----------------
          75000

-- WAY 1b: Nth (N = 3) — correlated subquery: "exactly N-1 distinct salaries mujhse zyada"
SELECT DISTINCT e1.salary
FROM employees e1
WHERE 3 - 1 = (SELECT COUNT(DISTINCT e2.salary)
               FROM employees e2
               WHERE e2.salary > e1.salary);

 salary
--------
  60000          -- O(n^2): har row ke liye subquery

-- WAY 2: DISTINCT + ORDER BY + LIMIT/OFFSET (OFFSET = N - 1)
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;

 salary
--------
  60000

-- DISTINCT bhool gaye toh: 90000, 75000, 75000, ... → OFFSET 2 = 75000  (GALAT)
-- PostgreSQL / SQL standard: ... OFFSET 2 ROWS FETCH NEXT 1 ROW ONLY

-- WAY 3: DENSE_RANK (ties ko same rank, gaps nahi)
SELECT DISTINCT salary
FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) ranked                      -- derived table ka alias zaroori (MySQL; PostgreSQL 16 se pehle bhi)
WHERE rnk = 3;

 salary
--------
  60000` },
        { pre: `-- N exist na kare toh NULL chahiye (LeetCode style) — query ko scalar subquery me lapeto
SELECT (SELECT DISTINCT salary FROM employees
        ORDER BY salary DESC LIMIT 1 OFFSET 4) AS fifth_highest;

 fifth_highest
---------------
          NULL      -- bina wrapper ke: 0 rows

-- Har department ka 2nd highest: PARTITION BY
SELECT dept_id, salary
FROM (
    SELECT dept_id, salary,
           DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
    FROM employees
    WHERE dept_id IS NOT NULL
) t
WHERE rnk = 2
ORDER BY dept_id;

 dept_id | salary
---------+--------
       1 |  75000
       2 |  60000` },
        { table: { head: ['Tareeka', 'Plus', 'Minus'], rows: [
          ['Correlated subquery', 'Har SQL version me chalta hai', 'O(n²); N badalne pe query badlo'],
          ['DISTINCT + LIMIT/OFFSET', 'Simple, index (salary) ho toh fast', 'MySQL me <code>LIMIT</code> me expression (<code>N-1</code>) nahi — function me pehle <code>SET N = N - 1</code>; DISTINCT zaroori'],
          ['<b>DENSE_RANK()</b>', 'Ties sahi, <b>per group</b> (PARTITION BY) aasaan — interview me best', 'MySQL 8+ / PostgreSQL chahiye (window functions)'],
        ] } },
        { tip: 'Interviewer poochega: "RANK kyun nahi?" — RANK ties ke baad <b>gap</b> chhodta hai (1, 2, 2, <b>4</b>), toh "rank = 3" kisi row ko milega hi nahi. DENSE_RANK (1, 2, 2, 3) me milega. Java se karna ho toh c4 ka stream: <code>distinct().sorted(reverseOrder()).skip(n-1).findFirst()</code>.' },
      ] },
      { title: '🧮 WHERE vs HAVING; GROUP BY rules', blocks: [
        { p: '<b>WHERE</b> group banne se <b>pehle</b> individual rows filter karta hai — aggregates (<code>COUNT</code>, <code>SUM</code>) yahan use nahi kar sakte. <b>HAVING</b> group banne ke <b>baad</b> groups filter karta hai — aggregates yahin lagte hain. Rule of thumb: jo filter row pe lag sakta hai wo WHERE me daalo (kam rows group hongi → fast).' },
        { pre: `Logical execution order (likhte alag order me hain, chalta aise hai):
FROM / JOIN  ->  WHERE  ->  GROUP BY  ->  HAVING  ->  SELECT  ->  DISTINCT  ->  ORDER BY  ->  LIMIT/OFFSET
(isiliye WHERE me SELECT ka alias nahi chalta, ORDER BY me chalta hai)` },
        { pre: `-- GROUP BY without filter
SELECT dept_id, COUNT(*) AS cnt, SUM(salary) AS total
FROM employees
GROUP BY dept_id
ORDER BY dept_id;

 dept_id | cnt | total
---------+-----+--------
       1 |   3 | 225000
       2 |   2 | 135000
    NULL |   1 |  50000     -- NULLs ek group banate hain. PostgreSQL: NULL last; MySQL: NULL pehle (ASC)

-- WHERE (rows) + HAVING (groups)
SELECT dept_id, COUNT(*) AS cnt, SUM(salary) AS total
FROM employees
WHERE salary > 55000            -- Meera (50000) yahin hat gayi → NULL group bana hi nahi
GROUP BY dept_id                -- groups: dept 1 → 3 rows / 225000, dept 2 → 2 rows / 135000
HAVING COUNT(*) >= 3            -- dept 2 drop
ORDER BY dept_id;

 dept_id | cnt | total
---------+-----+--------
       1 |   3 | 225000` },
        { pre: `-- GALAT 1: aggregate WHERE me
SELECT dept_id FROM employees WHERE COUNT(*) > 1 GROUP BY dept_id;
-- ERROR: aggregate functions are not allowed in WHERE   (MySQL: Invalid use of group function)

-- GALAT 2: non-aggregated column jo GROUP BY me nahi
SELECT dept_id, name, COUNT(*) FROM employees GROUP BY dept_id;
-- PostgreSQL: ERROR: column "employees.name" must appear in the GROUP BY clause or be used in an aggregate function
-- MySQL 5.7+: ERROR 1055 (ONLY_FULL_GROUP_BY default ON). Purane MySQL me koi bhi random name aa jaata tha!

-- SAHI: duplicate emails (HAVING ka classic use)
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;` },
        { list: [
          '<b>GROUP BY rule</b>: SELECT ka har column ya toh GROUP BY me ho, ya aggregate ke andar. (PostgreSQL ek exception deta hai: GROUP BY me primary key ho toh us table ke baaki columns allowed — functional dependency.)',
          '<code>COUNT(*)</code> saari rows ginta hai, <code>COUNT(col)</code> sirf non-NULL, <code>COUNT(DISTINCT col)</code> unique non-NULL. <code>COUNT(dept_id)</code> hamare data me 5, <code>COUNT(*)</code> 6.',
          'HAVING me SELECT alias (<code>HAVING cnt &gt;= 3</code>): MySQL allow karta hai, PostgreSQL nahi — portable likhna ho toh aggregate dobara likho.',
          'HAVING bina GROUP BY ke bhi chal sakta hai (poori table ek group) — rare.',
        ] },
      ] },
      { title: '🪟 Window functions — ROW_NUMBER, RANK, DENSE_RANK, running total', blocks: [
        { p: '<code>GROUP BY</code> rows ko <b>collapse</b> karke ek row per group deta hai. <b>Window function</b> (<code>... OVER (PARTITION BY ... ORDER BY ...)</code>) har row ko rehne deta hai aur uske saath ek calculated column jodta hai — "har employee + uska rank", "har order + ab tak ka total". <code>PARTITION BY</code> = group (reset point), <code>ORDER BY</code> = window ke andar order. MySQL 8.0+ aur PostgreSQL me available.' },
        { table: { head: ['Function', 'Ties (75000, 75000) pe', 'Sequence'], rows: [
          ['<b>ROW_NUMBER()</b>', 'Alag numbers (kaun pehle — undefined, tie-breaker do)', '1, 2, 3, 4, 5, 6'],
          ['<b>RANK()</b>', 'Same rank, phir <b>gap</b>', '1, 2, 2, 4, 4, 6'],
          ['<b>DENSE_RANK()</b>', 'Same rank, <b>no gap</b>', '1, 2, 2, 3, 3, 4'],
          ['LAG / LEAD', 'Pichhli / agli row ki value', 'Month-on-month diff'],
          ['SUM / AVG / COUNT OVER', 'Running / moving aggregates', 'Running total'],
        ] } },
        { pre: `SELECT name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC, id) AS rn,     -- id = tie-breaker, deterministic
       RANK()       OVER (ORDER BY salary DESC)     AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC)     AS drnk
FROM employees
ORDER BY salary DESC, id;

 name  | salary | rn | rnk | drnk
-------+--------+----+-----+------
 Asha  |  90000 |  1 |   1 |    1
 Ravi  |  75000 |  2 |   2 |    2
 Neha  |  75000 |  3 |   2 |    2
 Karan |  60000 |  4 |   4 |    3
 Arjun |  60000 |  5 |   4 |    3
 Meera |  50000 |  6 |   6 |    4

-- Running total
SELECT id, name, salary,
       SUM(salary) OVER (ORDER BY id) AS running_total
FROM employees
ORDER BY id;

 id | name  | salary | running_total
----+-------+--------+---------------
  1 | Asha  |  90000 |         90000
  2 | Ravi  |  75000 |        165000
  3 | Neha  |  75000 |        240000
  4 | Karan |  60000 |        300000
  5 | Meera |  50000 |        350000
  6 | Arjun |  60000 |        410000` },
        { pre: `-- Top earner per department (top-N per group = ROW_NUMBER + PARTITION BY)
SELECT dept_id, name, salary
FROM (
    SELECT dept_id, name, salary,
           ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn
    FROM employees
    WHERE dept_id IS NOT NULL
) t
WHERE rn = 1                  -- window function WHERE me direct nahi lagta → subquery / CTE
ORDER BY dept_id;

 dept_id | name | salary
---------+------+--------
       1 | Asha |  90000
       2 | Neha |  75000

-- Frame trap: ORDER BY me ties ho aur frame na likho → default RANGE frame, peers ek saath judte hain
SELECT name, salary, SUM(salary) OVER (ORDER BY salary) AS total FROM employees;
--   Meera 50000 → 50000,  Karan / Arjun 60000 → 170000, 170000,  Ravi / Neha 75000 → 320000, 320000,  Asha → 410000
-- Row-by-row chahiye: SUM(salary) OVER (ORDER BY salary, id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` },
        { tip: 'Window function <b>WHERE / GROUP BY ke baad</b> chalta hai (SELECT step me), isliye <code>WHERE ROW_NUMBER() ... = 1</code> error deta hai — subquery ya CTE (<code>WITH ranked AS (...) SELECT ... WHERE rn = 1</code>) me lapeto. Top-N per group (har category ke top 3 products) interviews me bahut aata hai.' },
      ] },
      { title: '🌲 Indexes — B-tree, composite column order, index kab use nahi hota', blocks: [
        { p: '<b>Index</b> = column values ka alag sorted structure jo row tak pointer rakhta hai — kitaab ke peeche ka index. Bina index <code>WHERE email = ?</code> poori table scan (O(n)); <b>B-tree (B+tree)</b> index me O(log n). B+tree balanced hai, keys sorted, leaf nodes aapas me linked → <b>equality, range (<code>&gt;</code>, <code>BETWEEN</code>), prefix <code>LIKE \'abc%\'</code>, ORDER BY</b> sab me kaam aata hai. Hash index sirf equality. Cost: har INSERT / UPDATE / DELETE ko index bhi update karna padta → <b>writes slow</b>, extra disk.' },
        { list: [
          '<b>Clustered</b> (MySQL InnoDB): table ki rows khud primary key order me B+tree leaves me. <b>Secondary index</b> leaf me PK rakhta hai → index se PK, phir PK se row (double lookup). PostgreSQL me table heap alag, saare indexes secondary.',
          '<b>Covering index</b>: query ke saare columns index me hi hain → table touch hi nahi (MySQL EXPLAIN: "Using index", PostgreSQL: Index Only Scan).',
          '<b>Composite index</b> <code>(dept_id, salary)</code> phone directory jaisa hai — pehle surname, phir naam se sorted. Surname ke bina sirf naam se dhoondhna? Directory kaam nahi aati. Isko <b>leftmost prefix rule</b> kehte hain.',
        ] },
        { pre: `CREATE INDEX idx_emp_dept_salary ON employees (dept_id, salary);

EXPLAIN SELECT name FROM employees WHERE dept_id = 1 AND salary > 60000;
-- MySQL: dekho type (ALL = full scan, ref / range = index), key (kaunsa index), rows (estimate), Extra
-- PostgreSQL: Seq Scan vs Index Scan / Bitmap Index Scan / Index Only Scan
-- (6 rows ki table pe optimizer full scan hi chunega — index ka fayda badi tables pe dikhta hai)` },
        { table: { head: ['Query (index: (dept_id, salary))', 'Index use?', 'Kyun'], rows: [
          ['<code>WHERE dept_id = 1</code>', '<b>Haan</b>', 'Leftmost column'],
          ['<code>WHERE dept_id = 1 AND salary &gt; 60000</code>', '<b>Haan</b>, dono columns', 'Equality pehle, range baad — ideal'],
          ['<code>WHERE salary &gt; 60000 AND dept_id = 1</code>', '<b>Haan</b>', 'WHERE me likhne ka order matter nahi karta, index ka order karta hai'],
          ['<code>WHERE dept_id = 1 ORDER BY salary</code>', '<b>Haan</b>, sort bhi bacha', 'dept_id fix hai toh salary already sorted'],
          ['<code>WHERE salary &gt; 60000</code>', 'Usually <b>nahi</b>', 'Leading column missing (MySQL 8 skip-scan kabhi kabhi; warna full scan)'],
          ['<code>WHERE dept_id &gt; 0 AND salary = 60000</code>', 'Sirf dept_id part', 'Range column ke baad wale columns seek ke liye use nahi hote'],
        ] } },
        { table: { head: ['Index kab use NAHI hota', 'Example', 'Fix'], rows: [
          ['Column pe <b>function / arithmetic</b>', '<code>WHERE YEAR(created_at) = 2024</code>, <code>LOWER(email) = ?</code>, <code>salary * 12 &gt; ?</code>', 'Range likho (<code>created_at &gt;= \'2024-01-01\' AND created_at &lt; \'2025-01-01\'</code>) ya expression / functional index'],
          ['<b>Leading wildcard</b>', '<code>LIKE \'%kumar\'</code>', 'Full-text search / reverse column; <code>LIKE \'kumar%\'</code> chalta hai'],
          ['<b>Implicit type conversion</b>', '<code>phone</code> VARCHAR, <code>WHERE phone = 9876543210</code> (number)', 'Same type pass karo: <code>\'9876543210\'</code>'],
          ['Composite ka leading column skip', '<code>(dept_id, salary)</code> pe sirf <code>salary</code>', 'Column order query pattern ke hisaab se, ya alag index'],
          ['<b>Low selectivity</b> / bada result', '<code>WHERE status = \'ACTIVE\'</code> (90% rows), chhoti table', 'Optimizer full scan ko sasta maanta hai — sahi decision'],
          ['<code>OR</code> alag columns pe, <code>!=</code>, <code>NOT IN</code>', '<code>WHERE dept_id = 1 OR salary &gt; 80000</code>', 'UNION / index merge; query rewrite'],
          ['Stale statistics', 'Bulk load ke baad galat plan', '<code>ANALYZE TABLE</code> (MySQL) / <code>ANALYZE</code> (PostgreSQL)'],
        ] } },
        { tip: 'Composite index ka column order: <b>equality wale columns pehle</b> (zyada selective pehle), <b>range column last</b>, aur ORDER BY wala column range ki jagah. Ek <code>(a, b)</code> index <code>(a)</code> wale queries bhi serve karta hai — alag <code>(a)</code> index redundant hai.' },
      ] },
      { title: '🧹 Duplicate rows dhoondho aur ek chhod ke sab delete karo', blocks: [
        { pre: `CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(100));
INSERT INTO users VALUES (1, 'a@x.com'), (2, 'b@x.com'), (3, 'a@x.com'),
                         (4, 'c@x.com'), (5, 'b@x.com'), (6, 'a@x.com');

-- 1. Duplicates dhoondho
SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY email;

 email   | cnt
---------+-----
 a@x.com |   3
 b@x.com |   2

-- 2. Kaun si rows jayengi? (har email ki sabse chhoti id rakhni hai)
SELECT id, email, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
FROM users
ORDER BY email, id;

 id | email   | rn
----+---------+----
  1 | a@x.com |  1   <- keep
  3 | a@x.com |  2   <- delete
  6 | a@x.com |  3   <- delete
  2 | b@x.com |  1   <- keep
  5 | b@x.com |  2   <- delete
  4 | c@x.com |  1   <- keep` },
        { pre: `-- 3a. PostgreSQL: CTE + ROW_NUMBER
WITH ranked AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
    FROM users
)
DELETE FROM users
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);
-- DELETE 3

-- 3b. MySQL 8 (PostgreSQL me bhi chalta hai): derived table me lapeto
--     (seedha "DELETE FROM users WHERE id IN (SELECT ... FROM users ...)" → MySQL ERROR 1093:
--      You can't specify target table 'users' for update in FROM clause)
DELETE FROM users
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
        FROM users
    ) t
    WHERE rn > 1
);
-- Query OK, 3 rows affected

-- 3c. MySQL self-join DELETE (MySQL 5.x me bhi, window functions ke bina)
DELETE u1
FROM users u1
JOIN users u2 ON u1.email = u2.email AND u1.id > u2.id;    -- jiske paas chhoti id wala twin hai, wo jaye
-- Query OK, 3 rows affected

-- PostgreSQL me self-join wala form:
DELETE FROM users u1 USING users u2 WHERE u1.email = u2.email AND u1.id > u2.id;

-- Result (teeno tareekon ke baad):
 id | email
----+---------
  1 | a@x.com
  2 | b@x.com
  4 | c@x.com

-- 4. Dobara na ho:
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);` },
        { list: [
          'Self-join me id 6 ke do "chhote twins" hain (1 aur 3) — join do baar match karega par row ek hi baar delete hoti hai; "3 rows affected".',
          '<code>DELETE FROM users WHERE id NOT IN (SELECT MIN(id) FROM users GROUP BY email)</code> bhi sahi idea hai; MySQL me 1093 se bachne ke liye inner query ko <code>(SELECT * FROM (...) AS keep_ids)</code> me lapetna padta hai.',
          'Badi table pe pehle <b>SELECT se verify</b>, phir transaction me DELETE (c12): galti hui toh ROLLBACK. Lakhon rows ho toh batches me delete karo (lock aur undo log chhota rahe).',
          'Koi unique id hi nahi (poori row duplicate)? PostgreSQL me hidden <code>ctid</code> se, MySQL me <code>CREATE TABLE t2 AS SELECT DISTINCT * FROM t</code> karke swap.',
        ] },
      ] },
      { title: '☕ Java cross-check — result tables sahi hain?', blocks: [
        { p: 'Ye do snippets wahi sample data Java list me rakh ke same logic chalate hain (c3 ke collections, c4 ke streams). Output upar ke SQL result tables se match karta hai — practice ke liye ye bhi "SQL ko Java me likho" type interview sawaal hai.' },
        { code: JOINS },
        { pre: 'Output:\n' + JOINS_OUT },
        { code: RANKS },
        { pre: 'Output:\n' + RANKS_OUT },
      ] },
      { title: '🎤 Interview — planner ke 6 questions (English answers)', blocks: [
        { tip: 'Answers me <b>employees / departments / users</b> wale examples sirf template hain — interview se pehle inhe <b>apne project</b> ki tables se badal lo (kaunsi query slow thi, kaunsa index lagaya, kaunsa window function report me use kiya). SQL round me query <b>bol ke likho</b>: pehle expected output batao, phir query.' },
        { qa: [
          ['Inner, left, right, full and self joins, each with an example.', 'Take employees and departments. An inner join returns only matching pairs, so an employee without a department and a department without employees both disappear — in my sample that is five rows. A left join keeps every employee and fills the department columns with NULL when there is no match, so the employee with no department shows NULL. A right join is the mirror: every department, so HR with no employees appears with a NULL employee. A full outer join keeps unmatched rows from both sides; PostgreSQL supports it, while in MySQL I emulate it with a left join UNION ALL the right join rows where the left side is NULL. A self join joins a table to itself with two aliases, for example <code>employees e LEFT JOIN employees m ON m.id = e.manager_id</code> to show each employee with their manager\'s name. One common trap: filtering the right table in WHERE after a left join turns it into an inner join; that condition belongs in ON.'],
          ['Nth highest salary three ways: subquery, LIMIT/OFFSET, DENSE_RANK().', 'First, with a subquery: for the second highest, <code>SELECT MAX(salary) FROM employees WHERE salary &lt; (SELECT MAX(salary) FROM employees)</code>; for a general N, a correlated subquery that keeps the salary for which exactly N minus one distinct salaries are higher — correct but quadratic. Second, <code>SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET N-1</code>; DISTINCT is essential because duplicate salaries would otherwise shift the offset, and I wrap it in a scalar subquery to return NULL when N does not exist. Third, the cleanest: compute <code>DENSE_RANK() OVER (ORDER BY salary DESC)</code> in a derived table and filter <code>rnk = N</code>. DENSE_RANK gives ties the same rank without gaps, unlike RANK, and with PARTITION BY it gives the Nth highest per department.'],
          ['WHERE vs HAVING; GROUP BY rules.', 'WHERE filters individual rows before grouping, so it cannot use aggregate functions. HAVING filters groups after GROUP BY, so it is where conditions like <code>COUNT(*) &gt; 1</code> go. The logical order is FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT, which is also why a SELECT alias cannot be used in WHERE. For performance I put every row-level condition in WHERE so fewer rows are grouped. The GROUP BY rule is that every selected column must either be in the GROUP BY or inside an aggregate; PostgreSQL enforces it, and MySQL enforces it by default through ONLY_FULL_GROUP_BY, while old MySQL silently returned an arbitrary value. NULLs form their own group, and <code>COUNT(column)</code> ignores NULLs while <code>COUNT(*)</code> does not.'],
          ['Window functions: ROW_NUMBER, RANK, DENSE_RANK, running totals.', 'A window function computes a value across a set of related rows but, unlike GROUP BY, keeps every row. The OVER clause defines the window: PARTITION BY splits rows into groups and ORDER BY orders them inside each group. ROW_NUMBER gives unique sequential numbers, so I add a tie-breaker to make it deterministic. RANK gives ties the same rank and then skips — one, two, two, four — while DENSE_RANK does not skip — one, two, two, three. A running total is <code>SUM(amount) OVER (ORDER BY date)</code>; when the ORDER BY has ties I specify <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>, because the default RANGE frame adds all tied rows together. A common use is top N per group: ROW_NUMBER partitioned by category in a subquery or CTE, then filter <code>rn &lt;= N</code>, since window functions cannot be used directly in WHERE.'],
          ['Indexes: B-tree, composite index column order, when an index is not used.', 'A B-tree, really a B+ tree, keeps keys sorted in a balanced tree with linked leaves, so lookups are logarithmic and it supports equality, ranges, prefix LIKE and ORDER BY. The cost is slower writes and extra storage, because every insert or update must maintain each index. A composite index on (dept_id, salary) is sorted by dept_id first and then salary, so it follows the leftmost prefix rule: it helps queries on dept_id, or dept_id and salary, but usually not on salary alone. I put equality columns first and the range or sort column last. An index is typically not used when the column is wrapped in a function or arithmetic, like <code>YEAR(created_at)</code>, with a leading wildcard LIKE, with an implicit type conversion such as comparing a varchar to a number, when the leading column is missing, or when the condition matches a large part of the table so a full scan is cheaper. I confirm with EXPLAIN.'],
          ['Find duplicate rows and delete all but one.', 'To find them I group by the columns that define a duplicate and keep groups with <code>HAVING COUNT(*) &gt; 1</code>. To delete all but one, I number the rows in each group with <code>ROW_NUMBER() OVER (PARTITION BY email ORDER BY id)</code> and delete those with a row number greater than one, which keeps the smallest id. In PostgreSQL I write that as a CTE followed by DELETE; in MySQL the subquery must be wrapped in a derived table, otherwise MySQL raises error 1093 for selecting from the table being deleted. The classic MySQL alternative is a self-join delete: <code>DELETE u1 FROM users u1 JOIN users u2 ON u1.email = u2.email AND u1.id &gt; u2.id</code>. I verify with a SELECT first, run the delete in a transaction, and then add a unique constraint so duplicates cannot come back.'],
        ] },
        { say: [
          ['Aise bolo — SQL apne project se (45 sec)', 'In my project most queries go through Spring Data JPA, but I write native SQL for reports. For example, our monthly report needed the top three products per category, so I used ROW_NUMBER partitioned by category in a CTE and filtered on the row number. We also had a slow search on orders by customer and date; EXPLAIN showed a full table scan, so I added a composite index on customer ID and created date, with the equality column first, and rewrote a condition that wrapped the date column in a function. Query time dropped from seconds to milliseconds.'],
        ] },
      ] },
      { title: '❌ Common traps', blocks: [
        { list: [
          'Nth highest me <b>DISTINCT</b> bhoolna — ties ki wajah se galat salary (hamare data me 3rd highest 75000 aa jaata).',
          'RANK use karke "rank = 3" dhoondhna — ties ke baad gap; DENSE_RANK chahiye.',
          'LEFT JOIN ke baad right table pe WHERE filter — INNER JOIN ban jaata hai; condition ON me daalo.',
          '<code>NOT IN (subquery)</code> jisme NULL ho — result hamesha khaali; <code>NOT EXISTS</code> use karo.',
          'Aggregate WHERE me likhna — HAVING me jaata hai.',
          'SELECT me non-aggregated column jo GROUP BY me nahi — error (ya purane MySQL me random value).',
          '<code>= NULL</code> likhna — hamesha unknown; <code>IS NULL</code> likho.',
          'Window function WHERE me direct — subquery / CTE chahiye.',
          'Indexed column pe function (<code>DATE(created_at) = ...</code>) — index skip; range likho.',
          'Composite index <code>(a, b)</code> banake sirf <code>b</code> pe query karna aur fast expect karna.',
          'MySQL me same table se select karke delete (error 1093) — derived table ya self-join.',
          'FULL OUTER JOIN MySQL me likhna — supported nahi.',
        ] },
      ] },
      { title: '✍️ Self-test — output predict karo', blocks: [
        { qa: [
          ['Sample data pe <code>SELECT COUNT(*), COUNT(dept_id), COUNT(DISTINCT salary) FROM employees;</code>', '<b>6, 5, 4</b> — COUNT(column) NULL (Meera) skip karta hai; distinct salaries 90000, 75000, 60000, 50000.'],
          ['<code>SELECT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 2;</code> (DISTINCT nahi)', '<b>75000</b> — sorted list 90000, 75000, 75000, ... ka teesra element. Sahi 3rd highest (60000) ke liye DISTINCT chahiye.'],
          ['Karan (60000) ka <code>RANK()</code> aur <code>DENSE_RANK()</code> (ORDER BY salary DESC)?', 'RANK = <b>4</b> (upar 3 log: 90000 aur do 75000), DENSE_RANK = <b>3</b>.'],
          ['<code>employees e LEFT JOIN departments d ON d.id = e.dept_id WHERE d.name IS NULL</code> — kaun aayega?', '<b>Meera</b> — jiska department match nahi hua (anti-join).'],
          ['Index <code>(dept_id, salary)</code>. <code>WHERE salary = 60000</code> aur <code>WHERE dept_id = 2 AND salary = 60000</code> — kaun index se chalega?', 'Doosri (leftmost prefix poora). Pehli me leading column missing → usually full scan.'],
        ] },
      ] },
    ],
    checks: [
      'Paanchon joins sample data pe result ke saath bol sakta hoon, aur MySQL me FULL JOIN emulate kar sakta hoon',
      'Nth highest salary teen tareeke se (DISTINCT ka reason + DENSE_RANK) bina dekhe likh sakta hoon',
      'WHERE vs HAVING, execution order, GROUP BY rule aur ROW_NUMBER / RANK / DENSE_RANK / running total clear hain',
      'Composite index ka leftmost prefix rule, index skip hone ke 5 reasons, aur duplicate delete (CTE + MySQL self-join) likh sakta hoon',
    ],
    memory: 'INNER = match, LEFT/RIGHT = ek side poori, FULL = dono (MySQL: LEFT UNION ALL RIGHT-unmatched), SELF = do aliases; Nth = DISTINCT + OFFSET N-1 ya DENSE_RANK = N; FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT; window rows collapse nahi karta, RANK gap / DENSE_RANK no gap; index leftmost prefix, equality pehle range last, function = no index; dup delete = ROW_NUMBER > 1 (MySQL: derived table / self-join), phir UNIQUE.',
    snippets: [
      { code: JOINS, out: JOINS_OUT },
      { code: RANKS, out: RANKS_OUT },
    ],
  };
})();
