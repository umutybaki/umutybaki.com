---
title: "Lecture 6 Constraint Satisfaction Problems CSPs COMP341"
date: "2026-03-23"
description: "Course: COMP341 Intro to AI, Koç University"
---

# Lecture 6 Constraint Satisfaction Problems CSPs COMP341

**Course**: COMP341 Intro to AI, Koç University  
**Instructor**: Asst. Prof. Barış Akgün



## 1 Context and Motivation

### Where We Are Coming From

The course has so far covered two major families of search:

- **Classical Search** (uninformed BFS/DFS, informed A*): The solution is a *path* from an initial state to a goal state. The goal test is some arbitrary boolean function, and states are black boxes - you just know whether you're at the goal or not.
- **Local Search** (hill climbing, simulated annealing, genetic algorithms): The solution is a *state* itself, not a path. You don't care how you got there; you only care about the quality of the current state.

Both of these treat the problem structure as opaque. You hand the algorithm a successor function and a goal test, and the algorithm explores blindly (or with some heuristic guidance). This is fine for many problems, but it throws away an enormous amount of structure that many real-world problems have.

**CSPs are different**: They have *explicit structure* - variables, domains, and constraints - that we can reason about directly. This structure allows us to build general-purpose algorithms that are much more powerful than standard black-box search.


## 2 What is a CSP

### Formal Definition

A **Constraint Satisfaction Problem** consists of three components:

1. **Variables**: A set of variables X_1, X_2, ..., X_n. Each variable represents something we need to determine, like the color of a region on a map or the position of a queen on a chessboard.

2. **Domains**: Each variable X_i has a domain D_i, which is the set of possible values it can take. For example, D_i = {red, green, blue} for a map-coloring problem.

3. **Constraints**: A set of constraints, each specifying allowable combinations of values for some subset of variables. For example: "WA and NT cannot have the same color" is a constraint over the variables WA and NT.

### What Does a Solution Look Like

A **complete assignment** assigns a value to every variable. A complete assignment is a **solution** if it satisfies all constraints (no constraint is violated). A **partial assignment** assigns values to only some of the variables.

A **legal assignment** is one that does not violate any constraint (it may still be partial).

### Why is This Better Than Standard Search

In standard search:
- The state is a "black box" - the algorithm knows nothing about what's inside it.
- The goal test is an arbitrary boolean function.
- The heuristic is an arbitrary function that maps states to numbers.

In a CSP:
- The state is defined by a structured object: variables and their current assigned values.
- The goal test is a structured set of constraints.
- This structure allows us to build **general-purpose heuristics** that work across many different CSPs without problem-specific engineering.

**Analogy**: Imagine debugging a program. If you know nothing about the program's internals, you have to try every possible input. But if you know the program checks variables against conditions, you can reason about which inputs will pass which checks - that's the power of CSP structure.


## 3 CSP Examples

### 31 Map Coloring

**Problem**: Color a map such that no two adjacent regions have the same color.

**Australian Map Example:**
- **Variables**: WA (Western Australia), NT (Northern Territory), Q (Queensland), NSW (New South Wales), V (Victoria), SA (South Australia), T (Tasmania)
- **Domain** for each variable: {red, green, blue}
- **Constraints**: Any two neighboring regions must have different colors.
  - Implicit form: WA != NT
  - Explicit form: (WA, NT) in {(red, green), (red, blue), (green, red), (green, blue), (blue, red), (blue, green)}

**A valid solution**: {WA=red, NT=green, Q=red, NSW=green, V=red, SA=blue, T=green}

Notice that SA (South Australia) is surrounded by WA, NT, Q, NSW, and V - it touches the most regions, so it's the most constrained variable.

### 32 NQueens

**Problem**: Place N queens on an N×N chessboard such that no two queens attack each other (no two queens share the same row, column, or diagonal).

**Formulation**:
- **Variables**: Q_k for k = 1, ..., N - the row position of the queen in column k.
- **Domain**: {1, 2, ..., N} - which row the queen in column k is placed in.
- **Constraints**:
  - Q_i != Q_j for i != j (same row constraint)
  - |Q_i - Q_j| != |i - j| for i != j (same diagonal constraint)

By fixing one queen per column, we've already encoded the "no same column" constraint.

### 33 Carpool RealLife Example

Ahmet, Elif, Mehmet, and Zeynep want to carpool to Bolu in two cars.
- **Variables**: A (Ahmet), E (Elif), M (Mehmet), Z (Zeynep)
- **Domains**: {C1, C2} (two cars)
- **Constraints**:
  - A = C1 (Ahmet owns and drives car 1)
  - Z = C2 (Zeynep owns and drives car 2)
  - A != E (Ahmet and Elif do not like each other)
  - M = Z (Mehmet wants to be in Zeynep's car)
- **Solution**: A=C1, E=C2, M=C2, Z=C2

### 34 Sudoku

**Variables**: Each open (unfilled) square on the grid.
**Domain**: {1, 2, ..., 9}
**Constraints**:
- 9-way alldiff for each row
- 9-way alldiff for each column
- 9-way alldiff for each 3x3 region

This can be expressed as pairwise inequality constraints or as higher-order `alldiff` constraints.

### 35 Constraint Graph

A **constraint graph** is a visual and data-structural representation of a CSP:
- **Nodes** = variables
- **Edges (arcs)** = binary constraints between variables

A **binary CSP** is one where every constraint involves at most two variables. Map coloring is naturally binary. Sudoku can be encoded as binary (many pairwise != constraints) or with higher-order `alldiff` constraints.

### 36 Cryptarithmetic

Problems like SEND + MORE = MONEY, where each letter is a different digit. Variables are the digits assigned to each letter; constraints enforce that the arithmetic is correct and that all letters have distinct values. These constraints are **higher-order** - they involve more than two variables simultaneously.


## 4 Varieties of CSPs

### Discrete Variables

- **Finite domains**: Each variable has a finite set of possible values. With n variables and domain size d, there are O(d^n) complete assignments. Examples: map coloring, Sudoku, Boolean satisfiability (SAT - NP-complete).
- **Infinite domains**: Variables range over infinite sets like integers or strings. Example: job scheduling, where variables are start/end times. You need constraint *languages* like Job1 + 5 < Job2. Linear constraints are solvable; nonlinear constraints are undecidable in general.

### Continuous Variables

Variables are real-valued. Example: scheduling Hubble Space Telescope observations, where time windows are continuous intervals. **Linear Programming** (e.g., the Simplex method) can solve linear CSPs with continuous variables in polynomial time.


## 5 Varieties of Constraints

### Unary Constraints

Involve a single variable. Equivalent to simply reducing that variable's domain before search begins.
Example: SA != green - just remove green from SA's domain upfront.

### Binary Constraints

Involve exactly two variables.
Example: SA != WA - the most common type; captured as edges in the constraint graph.

### HigherOrder Constraints

Involve three or more variables.
Example: Cryptarithmetic column constraints that relate multiple digit variables. `alldiff(X1, X2, ..., Xk)` is a global constraint - it says all variables must have different values.

### Soft Constraints Preferences

Hard constraints must be satisfied. **Soft constraints** assign a *cost* to each assignment; the goal is to find an assignment minimizing total cost. This gives **constrained optimization problems**. Local search methods can handle these - define the evaluation function to count soft-constraint violations and minimize it.


## 6 Solving CSPs Search Formulation

### Mapping CSP to a Search Problem

Every CSP can be formulated as a standard search problem:

- **Initial State**: The empty assignment {} - no variable has been assigned yet.
- **Successor Function**: Choose an unassigned variable and assign it one of its domain values (consistent with current constraints).
- **Goal Test**: All variables are assigned and all constraints are satisfied.
- **Path Cost**: Not relevant - we only care about the final assignment, not how we got there.

### Complexity

With n variables each having domain size d:
- At depth l in the search tree, there are (n - l) * d possible branches.
- Total number of leaves: n! * d^n (much worse than d^n!).

Why n! * d^n instead of d^n? Because at each level we're also choosing *which* variable to assign. If we fix the variable ordering ahead of time, we get down to d^n leaves. This is **Idea 1** of backtracking search.


## 7 Backtracking Search

### Core Ideas

Backtracking search improves on naive DFS with two key ideas:

**Idea 1 - One variable at a time**:
Variable assignments are **commutative**. Assigning WA=red then NT=green is the same as NT=green then WA=red. So we fix an ordering and assign one variable per level. This reduces the branching factor from (n-l)*d to just d at each level.

**Idea 2 - Check constraints as you go**:
Only consider values that are **consistent** with all current assignments. Don't explore branches that are already known to violate a constraint. This is called an "incremental goal test."

Backtracking search = DFS + fixed variable ordering + constraint checking at each step.

### Pseudocode

```text
function BACKTRACKING-SEARCH(csp):
    return BACKTRACK({}, csp)

function BACKTRACK(assignment, csp):
    if assignment is complete:
        return assignment                        # Success!

    var = SELECT-UNASSIGNED-VARIABLE(csp)        # Pick which variable to assign next

    for each value in ORDER-DOMAIN-VALUES(var, assignment, csp):
        if value is consistent with assignment:
            add {var = value} to assignment
            inferences = INFERENCE(csp, var, value)   # Propagate constraints (FC or AC-3)
            if inferences != failure:
                add inferences to assignment
                result = BACKTRACK(assignment, csp)
                if result != failure:
                    return result
            remove {var = value} and inferences from assignment

    return failure                               # No value worked - backtrack!
```

**Key points**:
- The function only keeps **one representation** of state in memory (the current partial assignment), not the entire path. This is memory efficient.
- Every solution appears at depth n (all n variables assigned).
- When we return `failure`, the calling frame tries the next value - this is the "backtracking" part.
- The algorithm can solve n-queens for n up to about 25 without heuristics.

### How Backtracking Actually Works

Start with an empty assignment. Pick a variable (say WA). Try a value (red). Add WA=red to the assignment. Pick the next variable (say NT). Try red - but WA=red and WA is adjacent to NT, so NT=red is inconsistent. Try green - consistent. Add NT=green. Continue until either all variables are assigned (solution found) or we reach a state where no value is consistent (backtrack: undo the most recent assignment and try the next value).


## 8 Ordering Heuristics

These heuristics improve which variable we pick next and which value we try first, without changing the theoretical worst-case complexity but dramatically improving average-case performance.

### 81 Variable Ordering Minimum Remaining Values MRV

**Idea**: Among all unassigned variables, choose the one with the **fewest legal values remaining** in its domain.

**Intuition**: If a variable already has only 1 legal value, it's going to be assigned that value regardless - we might as well do it now. If a variable has 0 legal values, we detect failure immediately. This is sometimes called "fail-first" - we want to discover that we're on a dead-end branch as early as possible.

**Why min rather than max?**
If we pick the variable with the *most* remaining values, we're likely picking an easy variable with many options - but we're not making progress on the hard parts of the problem. By picking the most constrained variable, we flush out failures early, pruning large swaths of the search tree before wasting time on them.

Also known as the **most constrained variable** heuristic.

**Example**: In map coloring, after assigning WA=red and NT=green, SA has very few remaining values (it's adjacent to many already-assigned variables). MRV would pick SA next.

### 82 Degree Heuristic DH

**Used as a tie-breaker when multiple variables tie on MRV.**

**Idea**: Among variables with the same number of remaining values, pick the one that is **most constrained with respect to unassigned variables** - i.e., the one with the most constraints connecting it to other not-yet-assigned variables.

**Intuition**: Assigning a highly connected variable affects the most other variables' domains. Doing this early lets us propagate the most information.

**Example**: At the start of map coloring, all variables have full domains {R, G, B}, so MRV doesn't help distinguish them. SA is adjacent to the most other regions (5 neighbors), so DH picks SA first.

### 83 Value Ordering Least Constraining Value LCV

**Idea**: When assigning a value to the chosen variable, pick the value that **rules out the fewest choices** for neighboring unassigned variables.

**Intuition**: For picking *variables*, we want to fail fast (pick the most constrained). But for picking *values*, we want to *succeed* - we want to keep as many options open as possible for the remaining variables. By choosing the value that eliminates the least from neighbors' domains, we give ourselves the best chance of completing the assignment.

**Why opposite philosophy from MRV?**
- Variable selection: Fail fast - surface problems immediately.
- Value selection: Succeed carefully - keep as many options alive as possible.

**Note**: LCV requires some computation (checking how many values each choice rules out in neighboring variables), but this investment typically pays off by avoiding backtracking.

**Example**: If SA can be red, green, or blue, and choosing blue leaves NT, Q, NSW, and V with 2 options each while choosing red leaves them with fewer options, LCV would prefer blue.

### 84 Combined Effect

Combining MRV + DH for variable ordering and LCV for value ordering can make **1000-queens feasible** - a problem that would take astronomical time with naive backtracking.

**Important caveat**: These heuristics do not change the theoretical worst-case complexity (it's still exponential). But they dramatically improve average-case performance on real problems.

### 85 Worked Example from the slides

Map coloring with WA, NT, Q, NSW, V, SA, T. Initial domains all {R, G, B}.

| Step | MRV selection | DH tie-break | LCV value choice | Assignment |
| ---: | :--- | :--- | :--- | :--- |
| 1    | All same (3 values) | SA has 5 neighbors | Same choices | SA = Red |
| 2    | All have 2 except T | NT, Q, NSW each have 2 constraints left | Same | NT = Green |
| 3    | WA, Q have 1 value left | Q has 1 neighbor constraint | Only Blue | Q = Blue |
| 4    | WA, NSW have 1 value | NSW has 1 remaining | Only Green | NSW = Green |
| 5    | WA, V have 1 value | Same degree (0) | Only Blue | WA = Blue |
| 6    | V has 1 value | - | Only Blue | V = Blue |
| 7    | T has 3 values | - | R, G, or B | T = Red |

Note: We didn't need to backtrack at all in this example!


## 9 Filtering Detecting Failures Early

Ordering heuristics help choose *which* variable to assign and *which* value to try. Filtering goes further: it **proactively removes values from domains** that cannot possibly lead to a solution, given current assignments.

### 91 Forward Checking FC

**Idea**: When you assign a value to variable X, look at all unassigned variables that share a constraint with X, and **remove any values from their domains that would violate the constraint**.

**Backtrack immediately** when any variable's domain becomes empty.

**Example** (map coloring step by step):
1. Assign WA = red. Remove red from NT's domain and SA's domain. NT = {G, B}, SA = {G, B}.
2. Assign Q = green. Remove green from NT's domain (Q adj NT) and SA's domain (Q adj SA). NT = {B}, SA = {B}.
3. SA has only {B} left. MRV picks SA next.
4. Assign SA = blue. Remove blue from NT, NSW, V. NT = {} - empty domain! Backtrack.

Wait - in this case, after assigning WA=red and Q=green, we get NT = {B} and SA = {B}. But NT and SA are adjacent! Both would have to be blue, which violates NT != SA. Forward checking detects this only when it *tries* to assign NT or SA, not proactively.

**Limitation**: Forward checking only looks at direct neighbors of the just-assigned variable. It misses interactions *between* unassigned variables.

### 92 The Problem FC Misses

After WA=red (assigned) and Q=green (assigned), with forward checking having run:
- NT's domain: {blue} (green was removed because NT adj WA? No - NT adj WA means NT can't be red. NT adj Q means NT can't be green. So NT = {blue}.)
- SA's domain: {blue} (SA adj WA means no red; SA adj Q means no green. So SA = {blue}.)

NT and SA are adjacent to each other and both have only {blue} left. This is a guaranteed failure - there's no way to assign NT and SA without violating NT != SA. But forward checking hasn't detected this yet, because it only checked what WA and Q affect, not the interaction between NT and SA themselves.

We need **constraint propagation** - checking constraints not just from assigned to unassigned, but also between unassigned variables.


## 10 Arc Consistency and the AC3 Algorithm

### 101 What is an Arc

In the constraint graph, an **arc** is a directed edge from variable X to variable Y, written X -> Y. For each binary constraint between X and Y, there are two arcs: X -> Y and Y -> X.

### 102 Arc Consistency Definition

An arc X -> Y is **arc consistent** if and only if:
For every value x in the domain of X, there exists **at least one** value y in the domain of Y such that (x, y) satisfies the constraint between X and Y.

**In plain English**: Every value in X's domain has some compatible partner in Y's domain.

**What to do when it's not consistent**: Remove the values from X's domain that have no compatible partner in Y's domain. We always delete from the **tail** (X, the source of the arc).

**Why delete from the tail?** The arc X -> Y says "X needs a partner in Y." If some value of X has no partner in Y, that value of X can never be part of any solution - remove it from X's domain.

### 103 Example of a Single Arc

Suppose X = SA, Y = NT. Constraint: SA != NT. Currently SA = {R, G, B}, NT = {B}.

Check arc SA -> NT:
- SA = R: Is there any value for NT that satisfies SA != NT? NT has {B}. R != B, so yes, B works.
- SA = G: Is there any value for NT that satisfies SA != NT? NT has {B}. G != B, so yes, B works.
- SA = B: Is there any value for NT that satisfies SA != NT? NT has {B}. B == B, so no compatible value!

Remove B from SA's domain. SA is now {R, G}.

### 104 Enforcing Arc Consistency Across the Whole CSP

A CSP is **arc consistent** if every arc in it is consistent.

Key insight: if removing a value from X's domain makes an arc Z -> X potentially inconsistent (because some value of Z was depending on the removed value of X as its partner), we need to recheck Z -> X.

**When X's domain shrinks, all arcs pointing INTO X (arcs of the form Z -> X) need to be rechecked.**

This cascading process is formalized in the **AC-3 algorithm**.

### 105 The AC3 Algorithm

```text
function AC-3(csp):
    queue = all arcs in the CSP            # Initialize with every directed arc (both directions per constraint)

    while queue is not empty:
        (Xi, Xj) = REMOVE-FIRST(queue)     # Take an arc off the queue

        if REVISE(csp, Xi, Xj):            # Try to enforce consistency of arc Xi -> Xj
            if domain of Xi is now empty:
                return false               # FAILURE: no consistent assignment possible!
            for each Xk in NEIGHBORS(Xi) - {Xj}:
                add (Xk, Xi) to queue      # Xi's domain shrank; neighbors pointing to Xi need rechecking

    return true                            # All arcs consistent; no domain went empty


function REVISE(csp, Xi, Xj):
    revised = false
    for each x in domain of Xi:
        if no value y in domain of Xj satisfies constraint(Xi, Xj):
            delete x from domain of Xi     # Remove value with no support
            revised = true
    return revised                         # Returns true iff something was deleted
```

**Step-by-step walkthrough**:

1. Initialize the queue with all directed arcs. For each binary constraint between X and Y, add both (X, Y) and (Y, X).
2. Pop an arc (Xi, Xj) from the queue.
3. Call REVISE(csp, Xi, Xj): for each value x in Xi's domain, check if there exists any value y in Xj's domain satisfying the constraint. If not, delete x from Xi's domain.
4. If REVISE deleted anything from Xi's domain:
  - If Xi's domain is now empty: return false (failure - there's no value Xi can take that satisfies all constraints with its neighbors).
  - Otherwise: for every neighbor Xk of Xi (except Xj), add the arc (Xk, Xi) back to the queue. Why? Because Xk's values may have been relying on the deleted values of Xi - those arcs may no longer be consistent.
5. If REVISE deleted nothing, just continue.
6. Repeat until the queue is empty. If no domain ever went empty, return true.

### 106 Detailed Example Map Coloring

Setup: WA = red (assigned). All others have domain {R, G, B}. Run AC-3.

First, FC-style: for all arcs (X, WA) where X is adjacent to WA:
- Arc (NT, WA): NT must satisfy NT != WA=red. Red has no partner (WA's only value is red, and NT != WA). Remove red from NT's domain. NT = {G, B}.
- Arc (SA, WA): Similarly, remove red from SA. SA = {G, B}.

Now SA's domain changed. Recheck all arcs pointing into SA (except WA):
- Arc (NT, SA): For NT=G, is there y in SA={G,B} with NT != SA? y=B works. OK.
- Arc (NT, SA): For NT=B, is there y in SA={G,B} with NT != SA? y=G works. OK.
- No deletions. Continue.

Now queue Q=green (assigned). Recheck neighbors of Q:
- Arc (NT, Q): Remove green from NT (NT adj Q, and Q=green). NT = {B}.
- Arc (SA, Q): Remove green from SA. SA = {B}.

NT's domain changed! Recheck arcs pointing into NT:
- Arc (SA, NT): SA = {B}. For SA=B, is there y in NT={B} with SA != NT? y=B violates SA != NT. No valid y! Remove B from SA. SA = {}.

SA's domain is now empty! Return false - we've detected failure before making any more assignments.

This is the failure that forward checking missed: NT and SA would both have to be blue, but they're adjacent.

### 107 AC3 Complexity

- **Time complexity**: O(n^2 * d^3), where n is the number of variables and d is the maximum domain size.
  - There are at most O(n^2) arcs (for a complete constraint graph).
  - Each arc can be re-added to the queue at most d times (each time a value is deleted from a domain, at most once per value).
  - REVISE takes O(d^2) time.
  - Total: O(n^2 * d^3). Also written O(e * d^3) where e is the number of arcs.
- **AC-4** achieves O(n^2 * d^2) worst-case, but is slower on average because of higher constant factors.
- **Important limitation**: AC-3 detects many failures early, but not all. Detecting *all* possible future inconsistencies is NP-hard.

### 108 Forward Checking vs Arc Consistency

| Property | Forward Checking | Arc Consistency (AC-3) |
| :--- | :--- | :--- |
| Scope | Checks arcs from just-assigned variable to its neighbors | Checks all arcs, propagates changes recursively |
| Detection power | Misses failures between unassigned variables | Catches more failures earlier |
| Computation cost | Cheap per assignment | More expensive per assignment |
| Does it subsume FC? | No | Yes - AC entails FC |
| Practical advice | Use with MRV for cheap gains | Often worth the overhead |

Forward checking is essentially arc consistency restricted to arcs pointing away from the just-assigned variable. AC-3 generalizes this: after any domain change, it rechecks all arcs that could be affected, not just the ones touching the most recently assigned variable.

**FC is a single pass; AC-3 iterates to fixpoint.**

**In practice**: AC-3 is usually worth the extra cost - it prunes the search tree enough to compensate. FC is faster per step but may require more backtracks overall.


## 11 Local Search for CSPs MinConflicts

### 111 The Idea

Instead of building up an assignment step by step (as backtracking does), local search for CSPs starts with a **complete assignment** (all variables assigned, possibly violating some constraints) and then tries to **repair violations** by reassigning variables.

This is the "Local Search Formulation" for CSPs: the state is always a complete assignment, and we move between complete assignments by changing one variable's value at a time.

### 112 The MinConflicts Algorithm

```typescript
function MIN-CONFLICTS(csp, max_steps):
    current = a random complete assignment for csp    # All variables have values; may violate constraints

    for i = 1 to max_steps:
        if current is a solution:
            return current                            # All constraints satisfied!

        var = randomly chosen conflicted variable     # Pick a variable involved in at least one violated constraint
        value = argmin_v CONFLICTS(var, v, current, csp)  # Value minimizing number of conflicts
        set var = value in current                    # Make the move

    return failure                                    # Gave up after max_steps
```

**Key details**:
- A **conflicted variable** is one that participates in at least one violated constraint.
- We pick a conflicted variable *randomly* (not deterministically) - this helps escape plateaus.
- We pick the value that minimizes the number of constraint violations (ties broken randomly).
- If we can't find a solution in `max_steps`, we give up (or restart with a new random assignment).

### 113 Example 4Queens

State: 4 queens, one per column, each assigned a row (1-4). There are 4^4 = 256 possible states.

- Start with all queens in row 1: obvious conflicts.
- Pick a conflicted queen (column 1). Try rows 1, 2, 3, 4. Count attacks for each. Say row 2 gives fewest attacks. Assign Q1 = 2.
- Pick another conflicted queen. Try all rows. Assign the best.
- Continue until no conflicts (solution found) or max_steps reached.

### 114 Performance

Given a random initial state, min-conflicts can solve the **N-queens problem in almost constant time** for arbitrarily large N - even N = 10,000,000! This is remarkable. Naive backtracking would take exponential time for large N.

**Why does it work so well?** The N-queens problem (and many other CSPs) has a search landscape with very few local minima for large N. Most random starting points lead to a solution within a small number of steps.

**Phase Transition Phenomenon**: For randomly generated CSPs, there exists a critical constraint ratio (number of constraints divided by number of variables) where problems transition from "almost always easy" to "almost always hard" back to "almost always easy." Near this transition point, problems are extremely hard for any algorithm - not just min-conflicts. This mirrors phase transitions in physics (e.g., water freezing).

### 115 When to Use MinConflicts vs Backtracking

| | Backtracking | Min-Conflicts |
| :--- | :--- | :--- |
| Approach | Builds up partial assignment; backtracks on failure | Starts with full assignment; repairs violations |
| Memory | O(n) | O(n) |
| Completeness | Complete (will find solution if one exists, given enough time) | Incomplete (may miss solutions, may give up) |
| Good for | Provably finding solutions; highly constrained problems | Large problems where solutions are dense; scheduling |
| Weakness | Can thrash in deep search trees | Can get stuck in local minima/plateaus |
| With restarts | N/A | Very effective in practice |


## 12 Summary and Big Picture

### The CSP Framework

A CSP is defined by:
- Variables X_1, ..., X_n
- Domains D_1, ..., D_n  
- Constraints C specifying allowable value combinations

The **structure** of CSPs - knowing variables, domains, and constraints explicitly - is what makes general-purpose heuristics possible and separates CSP algorithms from standard search.

### Solving CSPs Two Approaches

**Approach 1 - Search (Backtracking)**:
Build up a partial assignment, check constraints as you go, backtrack when stuck.
Improved by:
- Ordering heuristics (MRV, DH, LCV)
- Filtering (forward checking, arc consistency)

**Approach 2 - Local Search (Min-Conflicts)**:
Start with a complete (possibly illegal) assignment and iteratively fix violations.

### The Three Pillars of Improving Backtracking

| Pillar | Technique | What It Does |
| :--- | :--- | :--- |
| Variable Ordering | MRV | Choose variable with fewest remaining values - fail fast |
| Variable Ordering (tie-break) | Degree Heuristic (DH) | Choose variable with most constraints on remaining variables |
| Value Ordering | LCV | Choose value that rules out fewest options for neighbors - keep options open |
| Filtering (weak) | Forward Checking | Propagate constraints from assigned variable to its unassigned neighbors |
| Filtering (strong) | Arc Consistency / AC-3 | Enforce consistency on all arcs; re-propagate when any domain shrinks |
| Structure | Decomposition | Identify independent subproblems and solve separately (skipped in Spring 2025) |

### Key Intuitions to Carry Forward

1. **CSPs have structure; exploit it.** Standard search treats state as a black box. CSPs expose the internal structure (variables, domains, constraints), enabling smarter algorithms that are impossible with black-box search.

2. **Fail fast for variables, succeed for values.** When choosing the next variable, pick the one most likely to fail - this discovers dead ends early (MRV). When choosing a value, pick the one most likely to leave options open for other variables (LCV). These seem contradictory but are complementary.

3. **Arc consistency propagates information transitively.** Removing a value from X's domain can invalidate previously-consistent arcs pointing into X. AC-3 handles this by rechecking neighbors when a domain shrinks, cascading the implications.

4. **Filtering and ordering complement each other perfectly.** FC shrinks domains; MRV uses those shrunken domains to pick the next variable. They amplify each other.

5. **Local search is often shockingly effective.** Min-conflicts solves N-queens with N=10,000,000 in near-constant time. Its weakness is incompleteness - it may miss solutions - but with restarts it's highly practical.

6. **Phase transitions are real.** Near the critical constraint ratio, CSPs become extremely hard. This is a fundamental property of the problem landscape, not a weakness of any particular algorithm.


## Appendix Algorithm Reference

### Backtracking Search

```text
BACKTRACKING-SEARCH(csp):
    return BACKTRACK({}, csp)

BACKTRACK(assignment, csp):
    if complete(assignment): return assignment
    var = SELECT-UNASSIGNED-VARIABLE(csp)          # Use MRV + DH
    for value in ORDER-DOMAIN-VALUES(var, assignment, csp):    # Use LCV
        if consistent(value, assignment):
            assignment[var] = value
            inferences = INFERENCE(csp, var, value)             # FC or AC-3
            if inferences != failure:
                assignment += inferences
                result = BACKTRACK(assignment, csp)
                if result != failure: return result
            remove var from assignment; remove inferences
    return failure
```

### AC3

```
AC-3(csp):
    queue = all arcs in csp
    while queue not empty:
        (Xi, Xj) = queue.pop()
        if REVISE(csp, Xi, Xj):
            if domain(Xi) is empty: return false     # Failure
            for Xk in neighbors(Xi) - {Xj}:
                queue.add((Xk, Xi))                 # Recheck arcs into Xi
    return true

REVISE(csp, Xi, Xj):
    revised = false
    for x in domain(Xi):
        if no y in domain(Xj) satisfies constraint(Xi, Xj):
            remove x from domain(Xi)
            revised = true
    return revised
```

### MinConflicts

```typescript
MIN-CONFLICTS(csp, max_steps):
    current = random complete assignment
    for i in range(max_steps):
        if is_solution(current): return current
        var = random conflicted variable
        value = argmin_v CONFLICTS(var, v, current, csp)
        current[var] = value
    return failure                # Can restart with new random assignment
```


*End of COMP341 Lecture 6 Notes - Constraint Satisfaction Problems*
