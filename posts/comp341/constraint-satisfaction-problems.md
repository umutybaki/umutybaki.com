---
title: "Constraint Satisfaction Problems — Comprehensive Study Notes"
date: "2026-04-14"
description: "Self-contained notes on CSPs covering backtracking, arc consistency, and constraint propagation for COMP 341 AI."
---

# Constraint Satisfaction Problems (CSPs) — Comprehensive Study Notes

> **Course:** COMP 341 — Introduction to Artificial Intelligence, Asst. Prof. Barış Akgün, Koç University
>
> These notes are written to be **self-contained**: you should be able to learn every concept from scratch just by reading them.

---


## 1. Where CSPs Fit in AI Search

Before we dive into CSPs, let's recall the search paradigms you've already encountered in this course, because understanding where CSPs sit among them will help everything else click.

In **classical search** (uninformed and informed search, like BFS, DFS, A*), the solution to a problem is a *path* from the initial state to a goal state. You care about the sequence of actions that gets you there. Think of navigating from city A to city B — you want the route.

In **local search** (hill climbing, simulated annealing, genetic algorithms), the path doesn't matter at all. You only care about the *final state*. You start with some state and keep improving it by making local modifications. Think of placing queens on a chessboard — you just want a valid configuration, not the story of how you got there.

**CSPs** are something different from both. Like local search, the goal itself is what matters — not the path. But unlike both classical and local search, CSPs have a very *specific structure* to their states and goals. In standard search, a state is essentially a "black box" — it could be anything. The goal test could be any Boolean function you like. CSPs impose structure on these: a state is an *assignment of values to variables*, and the goal is defined by *constraints* between those variables. This structure is a gift. It means we can build **general-purpose algorithms** that work on *any* CSP, rather than needing a custom strategy for every new problem. The structure lets us use smart heuristics that apply broadly.

---

## 2. What Is a Constraint Satisfaction Problem?

Here's the core idea: imagine you have a bunch of decisions to make. Each decision is choosing a value for some variable. But not all combinations of choices are allowed — there are rules (constraints) that restrict which combinations are valid. A CSP asks: *can you find a set of choices that satisfies all the rules simultaneously?*

Formally, a **Constraint Satisfaction Problem** is defined by three things:

**Variables:** A set of variables $X_1, X_2, \ldots, X_n$. Each variable represents a decision you need to make.

**Domains:** Each variable $X_i$ has a domain $D_i$ — the set of possible values it can take. Domains can differ across variables, though they're often the same.

**Constraints:** A set of constraints, each specifying the allowable combinations of values for some subset of variables. The goal test is simply: *do all constraints hold simultaneously?*

An **assignment** is a mapping from variables to values. We say:

- A **complete assignment** is one where every variable has been given a value.
- A **legal (consistent) assignment** is one where no constraint is violated.
- A **solution** to a CSP is an assignment that is both complete and legal — every variable is assigned, and every constraint is satisfied.

Think of it this way: if you're filling out a crossword puzzle, the variables are the blank squares, the domains are the letters A–Z, and the constraints are that each row/column must spell a valid word.

---

## 3. CSP Formulation: Variables, Domains, Constraints

Let's dig deeper into each component.

### Variables and Domains

A state in a CSP is defined by the variables $X_i$ and the values from their domains $D_i$. Visually, imagine a row of boxes:

$$X_1 \leftarrow \{d_1, d_2, \ldots, d_m\}, \quad X_2 \leftarrow \{d_1, d_2, \ldots, d_m\}, \quad \ldots, \quad X_n \leftarrow \{d_1, d_2, \ldots, d_m\}$$

The domains of different variables *can be different*! For instance, one variable might have domain $\{1, 2, 3\}$ while another has domain $\{A, B\}$.

### Constraints

Constraints specify which combinations of values are allowed. They can be expressed in two ways:

**Implicit (intensional):** A rule or formula. For example, $X_i \neq X_j$ means "variables $i$ and $j$ must not be equal." This is compact and intuitive.

**Explicit (extensional):** A list of all allowed tuples. For example, if $X_1, X_2 \in \{red, green, blue\}$ and $X_1 \neq X_2$, the explicit form is:

$$(X_1, X_2) \in \{(\text{red, green}), (\text{red, blue}), (\text{green, red}), (\text{green, blue}), (\text{blue, red}), (\text{blue, green})\}$$

Other common constraint forms include:

$$\sum_{i \in A} X_i = k \quad \text{(a sum constraint)}$$

$$X_i \neq X_j \text{ for } i \neq j, \; i, j \in A \quad \text{(all-different constraint)}$$

The `alldiff` constraint is especially common — it says "all these variables must take different values."

---

## 4. Classic Examples of CSPs

Understanding CSPs becomes much easier when you see them in action. Let's walk through several classic examples.

### 4.1 Map Coloring (Australia)

This is the quintessential CSP example. The task is to color a map of Australia so that no two neighboring regions share the same color.

**Variables:** One variable per region — WA (Western Australia), NT (Northern Territory), Q (Queensland), NSW (New South Wales), V (Victoria), SA (South Australia), T (Tasmania). So seven variables total.

**Domains:** Each variable can be assigned one of three colors: $D_i = \{\text{red, green, blue}\}$.

**Constraints:** Adjacent regions must have different colors. The adjacencies in Australia give us these constraints: $WA \neq NT$, $WA \neq SA$, $NT \neq SA$, $NT \neq Q$, $SA \neq Q$, $SA \neq NSW$, $SA \neq V$, $Q \neq NSW$, $NSW \neq V$.

Notice how South Australia (SA) borders nearly every other mainland region — it appears in 5 of the 9 constraints. This will become important when we discuss heuristics later.

One valid solution is: $\{WA = \text{red}, NT = \text{green}, Q = \text{red}, NSW = \text{green}, V = \text{red}, SA = \text{blue}, T = \text{green}\}$. You can verify that no two adjacent regions share a color.

### 4.2 Real-Life Example: Carpool

This is a fun example from the lecture. Ahmet, Elif, Mehmet, and Zeynep want to carpool to Bolu. There are only 2 cars ($C_1$ and $C_2$).

**Variables:** $A, E, M, Z$ (one per person, representing which car they ride in).

**Domains:** $D_i = \{C_1, C_2\}$ for each person.

**Constraints:**
- The cars belong to Ahmet and Zeynep: $A = C_1$ and $Z = C_2$
- Ahmet and Elif don't like each other: $A \neq E$
- Mehmet has a crush on Zeynep: $M = Z$

A solution: $A = C_1, E = C_2, M = C_2, Z = C_2$. The lecture makes a humorous side note: they should just put Elif in front and Ahmet in back and take one car — but the CSP doesn't model that! This is an important insight: the quality of your CSP solution depends on how well you model the real problem.

### 4.3 N-Queens

Place $N$ queens on an $N \times N$ chessboard so that no two queens threaten each other (no two in the same row, column, or diagonal).

**Variables:** $Q_1, Q_2, \ldots, Q_N$ — one per row. $Q_k$ represents the column position of the queen in row $k$.

**Domains:** $D_k = \{1, 2, \ldots, N\}$.

**Constraints (implicit):** $\forall i, j: \text{non-threatening}(Q_i, Q_j)$. More explicitly, for every pair $i \neq j$:
- $Q_i \neq Q_j$ (not in the same column)
- $|Q_i - Q_j| \neq |i - j|$ (not on the same diagonal)

**Constraints (explicit):** For instance, $(Q_1, Q_2) \in \{(1,3), (1,4), (2,4), (3,1), (4,1), (4,2), \ldots\}$.

By choosing one variable per row, we've already eliminated the "same row" constraint — each queen is in a different row by construction. This is a clever modeling trick.

### 4.4 Cryptarithmetic (TWO + TWO = FOUR)

This is a puzzle where each letter stands for a digit, and the arithmetic must work out.

```
    T W O
  + T W O
  -------
  F O U R
```

**Variables:** $F, T, U, W, R, O$ (the letters) plus auxiliary carry variables $X_1, X_2, X_3$.

**Domains:** $\{0, 1, 2, 3, 4, 5, 6, 7, 8, 9\}$ for each letter.

**Constraints:**
- $\text{alldiff}(F, T, U, W, R, O)$ — each letter maps to a different digit
- Column arithmetic: $O + O = R + 10 \cdot X_1$ (the ones column, with carry $X_1$)
- And similar for each column...

This example is notable because it involves **higher-order constraints** — the column constraints involve three or more variables (the two addend digits plus the carry).

### 4.5 Sudoku

The world's most famous CSP!

**Variables:** Each open (empty) square in the 9×9 grid.

**Domains:** $\{1, 2, \ldots, 9\}$.

**Constraints:** Three types of `alldiff` constraints:
- 9-way alldiff for each row
- 9-way alldiff for each column
- 9-way alldiff for each 3×3 box

Alternatively, these can be decomposed into pairwise inequality constraints (which is useful for binary CSP algorithms).

### 4.6 Other Real-World CSPs

CSPs show up everywhere: assignment problems (who teaches what class), timetabling (which class is offered when and where), hardware configuration, transportation scheduling, factory scheduling, floor planning, and many more. Many of these involve real-valued variables, which we'll discuss next.

---

## 5. Constraint Graphs

A **constraint graph** is a visual representation of the structure of a CSP. For a **binary CSP** (where each constraint involves at most two variables):

- **Nodes** represent variables.
- **Arcs (edges)** connect pairs of variables that share a constraint.

For the Australia map coloring problem, the constraint graph has nodes WA, NT, SA, Q, NSW, V, and T, with edges corresponding to shared borders. SA is the most connected node (it borders nearly every other mainland region), while T (Tasmania) is disconnected from the rest — it has no constraints with any mainland variable.

This graph structure is extremely useful. It tells us which variables interact and which are independent. It also underlies the arc consistency algorithms we'll study later.

For constraints involving more than two variables (like cryptarithmetic), we can use a **constraint hypergraph** or introduce auxiliary nodes. In the cryptarithmetic example, the constraint graph uses small square nodes to represent the column constraints that connect multiple letter variables.

---

## 6. Varieties of CSPs and Constraints

### 6.1 Varieties of Variables

**Discrete variables with finite domains:** This is the most common case. If the domain has size $d$ and there are $n$ variables, there are $O(d^n)$ complete assignments. Even with domains of size 2 (Boolean CSPs), the problem is in general NP-complete (this is the Boolean satisfiability problem, or SAT).

**Discrete variables with infinite domains:** For example, job scheduling where variables are start/end times as integers. You can't enumerate the domain, so you need a **constraint language** — something like "Job1 + 5 < Job2" meaning Job 2 starts at least 5 time units after Job 1. With linear constraints, these are solvable; with nonlinear constraints, they become undecidable.

**Continuous variables:** For example, start/end times for Hubble Telescope observations as real numbers. Linear constraints over continuous variables can be solved in polynomial time using **Linear Programming** methods (like the Simplex method).

### 6.2 Varieties of Constraints

**Unary constraints** involve a single variable. For example, $SA \neq \text{green}$ means "South Australia can't be green." A unary constraint is equivalent to simply removing values from that variable's domain, so they can be handled in preprocessing.

**Binary constraints** involve pairs of variables. For example, $SA \neq WA$. These are the most common and most studied.

**Higher-order constraints** involve 3 or more variables. The column constraints in cryptarithmetic are a good example. These can sometimes be decomposed into binary constraints by introducing auxiliary variables.

**Preferences (soft constraints):** Sometimes you don't just want *any* solution — you want a *good* one. Soft constraints express preferences rather than hard requirements. For example, "red is better than green." These are often modeled as costs, turning the CSP into a **constrained optimization problem**. Methods for these are more involved and out of our scope, but local search can be used (how? — by using the number/severity of constraint violations as an evaluation function).

---

## 7. Solving CSPs as Search Problems

### 7.1 The Standard Search Formulation

We can formulate any CSP as a standard search problem:

- **Initial state:** $\{\}$ (the empty assignment — no variable has been assigned yet)
- **Successor function:** Assign a value (consistent with constraints) to an unassigned variable
- **Goal test:** All variables are assigned and all constraints are satisfied
- **Failure:** No legal assignment possible

Here's the beautiful thing: **this formulation is the same for every CSP.** You don't need to redesign the search for each new problem. Once you model something as a CSP, you can use the same solver.

### 7.2 Key Observations

The path to a solution is irrelevant — we only care about the final assignment. Also, every solution appears at depth $n$ (with $n$ variables), because we need to assign all $n$ variables. This suggests **depth-first search (DFS)** is a natural fit — we don't need BFS's breadth or iterative deepening because we know exactly how deep solutions live.

### 7.3 Complexity of Naive Search

If we apply naive DFS without being smart about it, the branching factor at depth $l$ is $(n - l) \cdot d$ — we can choose any of the remaining $n - l$ variables and assign any of $d$ values. This gives $n! \cdot d^n$ leaves, which is astronomical.

---

## 8. Backtracking Search

**Backtracking search** is the basic uninformed algorithm for solving CSPs, and it's much smarter than naive DFS. It's built on two key ideas:

### Idea 1: One Variable at a Time

Variable assignments are **commutative** — the order doesn't matter. Assigning $WA = \text{red}$ then $NT = \text{green}$ gives the same result as $NT = \text{green}$ then $WA = \text{red}$. So instead of considering all possible orderings (which is what causes the $n!$ factor), we fix an ordering and assign one variable at a time. This eliminates the $n!$ factor from our complexity.

### Idea 2: Check Constraints As You Go

Don't wait until you have a complete assignment to check if constraints are satisfied. Instead, at each step, only consider values that **don't conflict** with the assignments made so far. This is called the **incremental goal test**. If a variable has no legal values left, backtrack immediately — no point continuing down a dead end.

### The Algorithm

```
function BACKTRACKING-SEARCH(csp) returns a solution, or failure
    return BACKTRACK({}, csp)

function BACKTRACK(assignment, csp) returns a solution, or failure
    if assignment is complete then return assignment
    var ← SELECT-UNASSIGNED-VARIABLE(csp)
    for each value in ORDER-DOMAIN-VALUES(var, assignment, csp) do
        if value is consistent with assignment then
            add {var = value} to assignment
            inferences ← INFERENCE(csp, var, value)
            if inferences ≠ failure then
                add inferences to assignment
                result ← BACKTRACK(assignment, csp)
                if result ≠ failure then
                    return result
            remove {var = value} and inferences from assignment
    return failure
```

Let's break this down line by line:

1. If the assignment is complete (all variables assigned), we're done — return it.
2. **SELECT-UNASSIGNED-VARIABLE** picks the next variable to assign. The simplest approach is a fixed order, but smarter strategies exist (we'll cover them next).
3. **ORDER-DOMAIN-VALUES** determines the order to try values for the chosen variable. Again, the simplest approach is some fixed order, but smarter strategies exist.
4. For each value, check if it's **consistent** with the current assignment (doesn't violate any constraint).
5. If consistent, add the assignment and run **INFERENCE** (optional — this is where filtering happens, like forward checking or arc consistency).
6. If inference doesn't detect a failure, recursively try to complete the assignment.
7. If the recursive call fails, **undo** the assignment and inferences (backtrack) and try the next value.
8. If no value works, return failure — this propagates the backtrack up to the previous variable.

An important detail: the algorithm only keeps **a single representation** of the current state. It doesn't copy the entire assignment for each recursive call. It adds and removes assignments in place. This keeps space usage linear in the number of variables.

### Worked Example: Map Coloring

Imagine we color Australia starting with WA. We try WA = red. Then we move to NT. Since NT is adjacent to WA, red is eliminated; we try NT = green (legal). Then we move to Q. Since Q is adjacent to NT, green is eliminated; we try Q = red (legal — Q is not adjacent to WA in our constraint set... wait, actually it is not adjacent to WA). We continue assigning variables one by one. If we hit a dead end where some variable has no legal values, we backtrack to the previous variable and try a different value.

Basic backtracking can solve the N-Queens problem for $n \approx 25$.

---

## 9. Improving Backtracking: Ordering Heuristics

The backtracking algorithm has two key functions we can make smarter: **SELECT-UNASSIGNED-VARIABLE** (which variable to assign next) and **ORDER-DOMAIN-VALUES** (which value to try first). The CSP's structure — variables, domains, and constraints — enables **general-purpose heuristics** that work across all CSPs.

### 9.1 Variable Ordering: Minimum Remaining Values (MRV)

**Idea:** Choose the variable with the **fewest legal values left** in its domain.

Why minimum rather than maximum? The reasoning is "**fail-fast**." If a variable has very few remaining options, it's the most constrained — and if it's going to cause a failure, we want to discover that as soon as possible, before wasting time assigning other variables. If a variable has only 1 value left, we *must* assign that value, so let's do it now. If it has 0 values left, we need to backtrack immediately.

Also known as the **"most constrained variable"** heuristic.

For example, in the Australia map: after assigning WA = red and NT = green, the remaining domains are reduced. SA might only have $\{\text{blue}\}$ left (since it's adjacent to both WA and NT). MRV would pick SA next because it has the fewest remaining values.

### 9.2 Variable Ordering: Degree Heuristic (DH)

**Idea:** As a **tie-breaker** among variables with the same MRV score, choose the variable involved in the **most constraints on remaining (unassigned) variables**.

This makes sense: a variable with many constraints on other unassigned variables will most heavily influence what values those other variables can take. Assigning it early helps prune the search space more aggressively.

In the Australia constraint graph, SA has the highest degree (5 edges to other mainland variables). So if all variables initially have the same number of remaining values (all have 3 colors), the degree heuristic picks SA first.

### 9.3 Value Ordering: Least Constraining Value (LCV)

Once we've chosen *which* variable to assign, we need to decide *which value* to try first.

**Idea:** Choose the value that **rules out the fewest values** in the remaining unassigned variables.

Wait — for variable ordering we wanted to fail *fast*, but for value ordering we want to succeed *first*? Yes! The logic is different. When choosing which variable to assign, we want to identify failures early. But once we've committed to a variable, we want to pick the value most likely to lead to a solution. A value that rules out fewer options for other variables leaves the remaining problem more flexible, increasing the chance we can find a complete solution.

For example, suppose we're assigning Q in the Australia problem, and WA = red, NT = green are already assigned. If we try Q = blue, it only eliminates blue from NSW's domain. But if we try Q = red, it eliminates red from NSW. We'd pick whichever value leaves more options for NSW (and SA, etc.).

**Note:** Computing LCV may require some work (you need to count how many values each option eliminates from neighbors), but the payoff in reduced backtracking is usually worth it.

### 9.4 Putting It All Together

Combining these ordering ideas:
- **Variable selection:** MRV (with Degree Heuristic as tiebreaker)
- **Value selection:** LCV

This combination makes problems like the 1000-Queens feasible! However, it's important to note that **these heuristics don't change the theoretical worst-case bounds** — the problem is still NP-hard. They improve average-case performance dramatically, though.

### 9.5 Worked Example: Backtracking + Heuristics on Australia

Starting with all domains = $\{R, G, B\}$ and tie-breaking variable order: up-down, left-right from the map; tie-breaking value order: $R \to G \to B$.

| Step | MRV | DH | LCV | Assignment |
|------|-----|----|-----|------------|
| 1 | All tied (3 values each) | SA (degree 5) | R (leaves most options) | SA = R |
| 2 | WA, NT, Q, NSW, V (2 values each) | NT (degree 2 to unassigned) | G | WA = G |
| 3 | NT, Q (still 2 each, but check) | NT | B | NT = B |
| 4 | Q has {G} (1 value) | Q | G | Q = G |
| 5 | NSW has {B} (1 value) | NSW | B | NSW = B |
| 6 | V has {G} (1 value) | V | G | V = G |
| 7 | T has {R, G, B} | T | R | T = R |

We didn't even need to backtrack in this example — the heuristics guided us straight to a solution! That's not always the case, but it illustrates how effective smart ordering can be.

---

## 10. Improving Backtracking: Filtering

Ordering heuristics are about being smart when making choices. **Filtering** is about being proactive in **eliminating impossible values** before you even consider them.

The idea: keep track of the domains of all unassigned variables. Whenever you make an assignment, **cross off values** from the domains of neighboring variables that are now impossible. If any variable's domain becomes empty, you know this path is doomed — backtrack immediately, without continuing further.

### 10.1 Forward Checking (FC)

**Forward checking** is the simplest filtering method:

Whenever you assign a value to a variable, look at all the **neighbors** (variables sharing a constraint with the assigned variable). For each neighbor, remove any values from its domain that would violate the constraint with the new assignment.

If any neighbor's domain becomes **empty**, the current assignment can't lead to a solution — backtrack.

**Worked Example:** In the Australia map, we start with all domains = $\{R, G, B\}$.

1. Assign **WA = R**. Forward check: remove R from the domains of WA's neighbors (NT and SA). Now NT = $\{G, B\}$, SA = $\{G, B\}$.
2. Assign **Q = G** (suppose we pick Q next). Forward check: remove G from Q's neighbors (NT, SA, NSW). Now NT = $\{B\}$, SA = $\{B\}$, NSW = $\{R, B\}$.
3. Assign **V = B** (MRV picks a remaining variable). Forward check: remove B from V's neighbors (NSW, SA). Now NSW = $\{R\}$, SA = $\{\}$.

SA's domain is empty! Backtrack. We know Q = G won't work without trying further.

Notice that **forward checking is needed to compute MRV** — you need to know how many values are left in each variable's domain, and forward checking is exactly what tells you. So if you're using MRV, you're already doing forward checking implicitly.

### 10.2 Limitations of Forward Checking

Forward checking only propagates information from **assigned** variables to **unassigned** ones. It doesn't detect inconsistencies *between* unassigned variables.

For example: after assigning WA = R and Q = G, forward checking tells us NT = $\{B\}$ and SA = $\{B\}$. But NT and SA are adjacent — they can't both be blue! Forward checking doesn't catch this because neither NT nor SA is assigned yet. We need something more powerful.

---

## 11. Arc Consistency and the AC-3 Algorithm

### 11.1 What Is Arc Consistency?

Arc consistency is a stronger form of filtering that reasons about constraints *between unassigned variables*, not just between assigned and unassigned ones.

**Definition:** An arc $X_i \to X_j$ is **consistent** if and only if for *every* value $x$ in the domain of $X_i$ (the **tail**), there exists *some* value $y$ in the domain of $X_j$ (the **head**) such that the constraint between $X_i$ and $X_j$ is satisfied.

If we find a value $x$ in $D_i$ that has no compatible value in $D_j$, we **delete $x$ from $D_i$**. Important: **we always delete from the tail**, not the head!

Forward checking is a special case of arc consistency: it enforces consistency only on arcs pointing *to* the newly assigned variable (where the head is the assigned node and the tails are its neighbors).

### 11.2 Worked Example: Arc Consistency on Australia

Let's trace through arc consistency after assigning WA = R and Q = G.

After forward checking: WA = $\{R\}$, NT = $\{B\}$, Q = $\{G\}$, NSW = $\{R, B\}$, V = $\{R, G, B\}$, SA = $\{B\}$.

Now consider arc $\text{SA} \to \text{NSW}$: SA only has $\{B\}$. For SA = B, is there some value in NSW that satisfies $SA \neq NSW$? NSW has $\{R, B\}$. Yes — NSW = R works. So this arc is consistent.

Now consider arc $\text{NSW} \to \text{SA}$: NSW has $\{R, B\}$.
- For NSW = R: is there a value in SA such that $NSW \neq SA$? SA = $\{B\}$, and $R \neq B$, so yes.
- For NSW = B: is there a value in SA such that $NSW \neq SA$? SA = $\{B\}$, and $B = B$, so **no**.

Delete B from NSW's domain. Now NSW = $\{R\}$.

Since NSW lost a value, we need to re-check arcs pointing into NSW. Consider arc $\text{V} \to \text{NSW}$: V has $\{R, G, B\}$.
- For V = R: NSW = $\{R\}$, and $R = R$, so **no compatible value**. Delete R from V.
- For V = G: NSW = $\{R\}$, and $G \neq R$, so yes.
- For V = B: NSW = $\{R\}$, and $B \neq R$, so yes.

Now V = $\{G, B\}$. Since V lost a value, re-check arcs into V.

Consider arc $\text{SA} \to \text{V}$: SA = $\{B\}$.
- For SA = B: V = $\{G, B\}$, and $B = B$, so blue doesn't work. But $B \neq G$, so V = G works.

This arc is still consistent. Eventually, the process stabilizes and we've derived much tighter domains — catching failures that forward checking missed.

### 11.3 The AC-3 Algorithm

AC-3 is the standard algorithm for enforcing arc consistency on a CSP.

```
function AC-3(csp) returns false if inconsistency found, true otherwise
    inputs: csp, a binary CSP with components (X, D, C)
    local variables: queue, a queue of arcs, initially all arcs in csp

    while queue is not empty do
        (Xi, Xj) ← REMOVE-FIRST(queue)
        if REVISE(csp, Xi, Xj) then
            if size of Di = 0 then return false
            for each Xk in Xi.NEIGHBORS - {Xj} do
                add (Xk, Xi) to queue
    return true

function REVISE(csp, Xi, Xj) returns true iff we revise the domain of Xi
    revised ← false
    for each x in Di do
        if no value y in Dj allows (x, y) to satisfy the constraint then
            delete x from Di
            revised ← true
    return revised
```

**How it works, step by step:**

1. Initialize a queue with **all arcs** in the CSP (both directions: if there's a constraint between $X_i$ and $X_j$, add both $(X_i, X_j)$ and $(X_j, X_i)$).
2. Pull an arc $(X_i, X_j)$ off the queue.
3. Call **REVISE**: for each value $x$ in $X_i$'s domain, check if *any* value $y$ in $X_j$'s domain satisfies the constraint. If no such $y$ exists, remove $x$ from $D_i$.
4. If REVISE actually removed something (returned true):
   - If $D_i$ is now empty, the CSP has no solution from the current state — return **false**.
   - Otherwise, add all arcs $(X_k, X_i)$ to the queue for every neighbor $X_k$ of $X_i$ (except $X_j$ itself, since we just processed that pair). We need to re-check these because $X_i$'s domain shrank, which might invalidate values in $X_k$'s domain.
5. If the queue empties without any domain becoming empty, return **true** — the CSP is arc-consistent.

### 11.4 Runtime of AC-3

**$O(n^2 d^3)$** where $n$ is the number of variables and $d$ is the maximum domain size.

Why? There are $O(n^2)$ arcs (at most). Each arc can be added to the queue at most $O(d)$ times (since each re-addition is caused by a domain shrinking, and domains can shrink at most $d$ times total). Checking one arc takes $O(d^2)$ time (for each of $d$ values in $D_i$, check against up to $d$ values in $D_j$). So: $O(n^2) \times O(d) \times O(d^2) = O(n^2 d^3)$.

Alternatively, $n^2$ can be replaced with the number of arcs/constraints if there are far fewer constraints than $n^2$.

A more efficient version called **AC-4** achieves $O(n^2 d^2)$, but in practice AC-3 often outperforms AC-4 on average due to lower overhead.

**Important limitation:** Even though AC-3 can prune domains significantly, **detecting all possible future failures is NP-hard**. Arc consistency is a useful heuristic, not a magic bullet.

### 11.5 Arc Consistency vs. Forward Checking

| Property | Forward Checking | Arc Consistency |
|----------|-----------------|-----------------|
| What it checks | Arcs from neighbors to the just-assigned variable | All arcs in the entire CSP |
| When values are removed | Only from domains of neighbors of the assigned variable | From any variable's domain |
| Failure detection | Can miss some failures (e.g., two unassigned neighbors both forced to same value) | Catches more failures, earlier |
| Speed per assignment | Fast | Slower (especially with many constraints) |
| Relationship | FC ⊂ AC (AC entails FC) | Strictly more powerful |
| Practical value | Pairs well with MRV; very fast | Usually worth the cost; AC-3 is standard |

If you run AC, you don't need to run FC separately — AC already does everything FC does, and more.

---

## 12. Problem Structure

The structure of the constraint graph can sometimes be exploited to speed up solving dramatically.

**Independent subproblems:** If the constraint graph has disconnected components, each component is an independent CSP that can be solved separately. For example, Tasmania has no constraints with the mainland in the Australia map. If a graph of $n$ variables can be decomposed into subproblems of size $c$, the worst-case cost drops from $O(d^n)$ to $O((n/c) \cdot d^c)$.

How dramatic is this? Suppose $n = 80, d = 2, c = 20$:
- Without decomposition: $2^{80} \approx 4$ billion years at 10 million nodes/sec
- With decomposition: $(4)(2^{20}) \approx 0.4$ seconds at 10 million nodes/sec

However, it's rare to find completely disconnected subproblems in practice — most real-world CSPs have well-connected constraint graphs.

> **Note from the lecture:** This topic was **skipped for Spring 2025** and the related slides were removed. It's mentioned here for completeness, but you likely won't be tested on the details of tree decomposition or cutset conditioning.

---

## 13. Local Search for CSPs: Min-Conflicts

In addition to backtracking (which builds a solution from scratch), we can solve CSPs using **local search**. The idea: start with a *complete* assignment (which probably violates some constraints) and iteratively fix violations.

### 13.1 The Min-Conflicts Algorithm

```
function MIN-CONFLICTS(csp, max_steps) returns a solution or failure
    inputs: csp, a constraint satisfaction problem
            max_steps, the number of steps allowed before giving up
    current ← an initial complete assignment for csp
    for i = 1 to max_steps do
        if current is a solution for csp then return current
        var ← a randomly chosen conflicted variable from csp.VARIABLES
        value ← the value v for var that minimizes CONFLICTS(var, v, current, csp)
        set var = value in current
    return failure
```

**How it works:**

1. Start with a **complete assignment** — every variable has a value, but constraints may be violated.
2. At each step, pick a **randomly chosen conflicted variable** (one involved in at least one violated constraint).
3. Reassign that variable to the value that **minimizes the number of conflicts** — that is, the value that violates the fewest constraints with the current assignments of other variables.
4. Repeat until either a solution is found (zero conflicts) or we run out of steps.

### 13.2 Example: 4-Queens with Min-Conflicts

For a 4×4 board with one queen per column:
- **State space:** $4^4 = 256$ states (each queen can be in any of 4 rows)
- **Operators:** Move a queen within its column
- **Goal test:** No attacks ($h = 0$)
- **Evaluation:** $c(n) = $ number of attacking pairs

Starting from a random configuration with $h = 5$ (five attacking pairs), Min-Conflicts picks a conflicted queen and moves it to the row that creates the fewest new conflicts. In just a few steps, it might reach $h = 2$, then $h = 0$ — done!

### 13.3 Performance

Min-Conflicts is remarkably effective in practice:
- Given a random initial state, it can solve **N-Queens in almost constant time** for arbitrarily large $N$ with high probability (e.g., $N = 10{,}000{,}000$!)
- This appears to be true for most randomly-generated CSPs, *except* in a narrow range of the **constraint-to-variable ratio**:

$$R = \frac{\text{number of constraints}}{\text{number of variables}}$$

Near a "**critical ratio**," problems become dramatically harder — this is related to the **phase transition phenomenon** in computational complexity. When $R$ is low, there are many solutions (easy). When $R$ is very high, there are no solutions (easy to detect). But right at the critical ratio, solutions exist but are hard to find.

### 13.4 Python Implementation

```python
import random

def min_conflicts(variables, domains, constraints, max_steps=100000):
    """
    Solve a CSP using the Min-Conflicts local search algorithm.

    Args:
        variables: List of variable names.
        domains: Dict mapping each variable to its list of possible values.
        constraints: List of (var_i, var_j, constraint_func) tuples.
                     constraint_func(val_i, val_j) returns True if satisfied.
        max_steps: Maximum number of iterations before giving up.

    Returns:
        A dict mapping variables to values (a solution), or None if no
        solution was found within max_steps.
    """
    # Step 1: Generate an initial complete (possibly conflicted) assignment
    current = {var: random.choice(domains[var]) for var in variables}

    for step in range(max_steps):
        # Find all conflicted variables
        conflicted = []
        for var in variables:
            for (vi, vj, check) in constraints:
                if vi == var or vj == var:
                    val_i, val_j = current[vi], current[vj]
                    if not check(val_i, val_j):
                        conflicted.append(var)
                        break  # var is conflicted, no need to check more

        if not conflicted:
            return current  # All constraints satisfied!

        # Pick a random conflicted variable
        var = random.choice(conflicted)

        # Try each value and count conflicts for each
        best_val = None
        best_conflicts = float('inf')
        for val in domains[var]:
            count = 0
            for (vi, vj, check) in constraints:
                if vi == var:
                    if not check(val, current[vj]):
                        count += 1
                elif vj == var:
                    if not check(current[vi], val):
                        count += 1
            if count < best_conflicts:
                best_conflicts = count
                best_val = val

        current[var] = best_val

    return None  # Failed to find a solution


# --- Usage Example: 4-Queens ---
if __name__ == "__main__":
    n = 4
    variables = [f"Q{i}" for i in range(n)]  # Q0, Q1, Q2, Q3 (one per column)
    domains = {var: list(range(n)) for var in variables}  # row 0..3

    constraints = []
    for i in range(n):
        for j in range(i + 1, n):
            col_diff = j - i
            # Queens must not be in same row or same diagonal
            def make_check(cd):
                return lambda ri, rj: ri != rj and abs(ri - rj) != cd
            constraints.append((variables[i], variables[j], make_check(col_diff)))

    solution = min_conflicts(variables, domains, constraints)
    if solution:
        print("Solution found:")
        for var in variables:
            print(f"  {var} = row {solution[var]}")
    else:
        print("No solution found within max_steps.")
```

**Sample output:**
```
Solution found:
  Q0 = row 1
  Q1 = row 3
  Q2 = row 0
  Q3 = row 2
```

---

## 14. Summary & Comparison Table

### Core Idea

CSPs are a special kind of search problem where states are partial assignments of values to variables, and the goal test is defined by a set of constraints. This structure enables general-purpose algorithms and heuristics.

### Algorithm Comparison

| Method | Type | Complete? | Handles Structure? | Key Idea |
|--------|------|-----------|-------------------|----------|
| **Naive DFS** | Systematic | Yes (finite domains) | No | Try all assignments; $n! \cdot d^n$ leaves |
| **Backtracking** | Systematic | Yes (finite domains) | Partially | Fix variable ordering + check constraints incrementally; $d^n$ leaves |
| **BT + MRV/DH/LCV** | Systematic | Yes | Yes (ordering) | Smart variable and value ordering; fail-fast + succeed-first |
| **BT + Forward Checking** | Systematic | Yes | Yes (filtering) | Remove inconsistent values from neighbors after each assignment |
| **BT + Arc Consistency (AC-3)** | Systematic | Yes | Yes (filtering) | Propagate constraints across all arcs; catches more failures than FC |
| **Min-Conflicts** | Local Search | No | No | Start with random complete assignment; iteratively fix conflicts |

### Filtering Comparison

| Property | Forward Checking | Arc Consistency (AC-3) |
|----------|-----------------|----------------------|
| Speed per assignment | Fast | $O(n^2 d^3)$ |
| Failure detection | Misses some | Catches more failures, earlier |
| Works with MRV? | Yes (required for MRV) | Yes |
| Relationship | Subset of AC | Strictly more powerful |
| Practical recommendation | Good default | Usually worth the cost |

### Ordering Heuristic Summary

| Heuristic | Decides | Strategy | Intuition |
|-----------|---------|----------|-----------|
| **MRV** | Which *variable* to assign next | Pick variable with fewest remaining values | Fail-fast: detect dead ends early |
| **Degree Heuristic** | Tiebreaker for variable selection | Pick variable with most constraints on unassigned vars | Most influential variable first |
| **LCV** | Which *value* to try first | Pick value that rules out fewest options for neighbors | Succeed-first: maximize flexibility |

### Key Takeaways

CSPs give us powerful general-purpose tools because of their structured formulation. Backtracking search is the baseline solver. Smart ordering (MRV + DH for variables, LCV for values) dramatically speeds up search. Filtering (forward checking and arc consistency) prunes the search space by detecting dead ends early. For very large CSPs, local search with Min-Conflicts can be surprisingly effective, solving millions-of-queens problems in near-constant time, though it struggles at the critical constraint ratio.

---

*These notes cover all material from the COMP 341 Lecture 6 — Constraint Satisfaction Problems by Asst. Prof. Barış Akgün, Koç University. Good luck studying!*
