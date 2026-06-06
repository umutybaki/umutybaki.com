---
title: "04 - Informed Search"
date: "2026-03-09"
description: "Course: COMP341 - Introduction to Artificial Intelligence, Koç University"
---

# 04 - Informed Search

**Course**: COMP341 - Introduction to Artificial Intelligence, Koç University
**Instructor**: Asst. Prof. Barış Akgün



## 1 Recap The Generic Search Framework

Before jumping into informed search, recall the general search framework from Lecture 3.

The key insight is that **all search algorithms share the same skeleton** - what differs is how we choose which node to expand next.

### Tree Search

```text
function GENERAL-TREE-SEARCH(problem):
    frontier = {initial state of problem}
    loop:
        if frontier is empty:
            return FAILURE
        node = choose a leaf node from frontier (and remove it)
        if node is a goal state:
            return solution
        expand node and add all successors to frontier
```

Key point: In tree search, a **node represents an entire path** from the start to that state. This means we can visit the same state multiple times via different paths, which can cause infinite loops on graphs with cycles.

### Graph Search

```text
function GENERAL-GRAPH-SEARCH(problem):
    frontier = {initial state of problem}
    explored = {}  (empty set)
    loop:
        if frontier is empty:
            return FAILURE
        node = choose a leaf node from frontier (and remove it)
        if node in explored:
            continue  (skip already-expanded states)
        if node is a goal state:
            return solution
        add node to explored
        expand node and add successors to frontier (if not in explored)
```

Key point: In graph search, a **node represents a single state**. We track which states have been fully expanded (the explored set) to avoid processing the same state twice.

### Uninformed Search Algorithms Review

| Algorithm | Data Structure | Key Idea |
| :--- | :--- | :--- |
| DFS | Stack | Go deep first |
| BFS | Queue | Go wide first (level by level) |
| IDDFS | Stack with depth limit | Combine DFS's space with BFS's optimality |
| Uniform Cost Search (UCS) | Priority queue (min cost) | Expand cheapest cumulative cost first |

**Why "uninformed"?** These algorithms treat all states as equally promising. They have no knowledge about which states are actually closer to the goal. UCS, for instance, expands outward in all directions uniformly - like a circular wave expanding from the start, with no sense of where the goal is.


## 2 Why Uninformed Search Falls Short

Consider navigating from city S to city G on a map. Uniform Cost Search will explore cities in all directions from S - including cities that are geographically in the opposite direction from G - until it eventually reaches G.

This is wasteful. A human would look at the map and say "G is to the northeast, so let me focus on paths heading northeast."

That intuition - using knowledge about the problem to focus the search - is precisely what **informed search** is about.


## 3 The Core Idea Heuristics

A **heuristic** (from the Greek word for "to discover") is a function that estimates how close a state is to the goal.

Formally: `h(s)` = estimated cost from state `s` to the nearest goal state.

**Key properties of a heuristic:**
- It is **problem-specific** - you design it based on domain knowledge
- It does not need to be exact - an approximation is fine
- It should be **cheap to compute** (otherwise it defeats the purpose)
- Ideally, it should guide the search toward the goal without misleading it

**Example - Romania road map navigation:**
If you are searching for a path from Arad to Bucharest, a natural heuristic is the straight-line (Euclidean) distance from the current city to Bucharest. This is never larger than the actual road distance, is fast to compute, and clearly guides the search in the right direction.

**Example - 8-puzzle:**
A natural heuristic is the number of tiles that are in the wrong position. A state with many misplaced tiles is (intuitively) further from the goal than a state with only one or two misplaced tiles.

The art of A* search is mostly the art of designing good heuristics.


## 4 Notation and Evaluation Functions

Throughout this lecture, we use the following notation:

| Symbol | Meaning |
| :--- | :--- |
| `g(s)` | **Backward cost**: the total cumulative cost of the path taken to reach state `s` from the start |
| `h(s)` | **Forward cost (heuristic)**: estimated cost from `s` to the nearest goal |
| `f(s)` | **Evaluation function**: used to prioritize nodes in the frontier |
| `h*(s)` | The **true** (optimal) cost from `s` to the nearest goal |

The frontier is always a **priority queue**. The evaluation function `f(s)` determines the priority - the node with the lowest `f(s)` is expanded first.

Different choices of `f(s)` lead to different algorithms:

| Algorithm | `f(s)` |
| :--- | :--- |
| Uniform Cost Search | `g(s)` |
| Greedy Best-First Search | `h(s)` |
| A* Search | `g(s) + h(s)` |


## 5 Greedy BestFirst Search

### The Idea of Greedy BestFirst Search

Greedy Best-First Search says: "Ignore how far I have already traveled. Just always expand the node that looks closest to the goal right now."

This is entirely heuristic-driven:

```
f(s) = h(s)
```

The priority queue is ordered only by `h(s)`. The node with the lowest estimated distance to the goal is always expanded first.

**Intuition**: It is called "greedy" because at each step it makes what looks like the locally best choice - expand the most promising node - without any backtracking or concern for what it cost to reach that node.

**Analogy**: Imagine hiking to a mountain summit. A greedy hiker always walks in the direction that seems most directly uphill right now, without considering whether a detour might actually be faster.

### Pseudocode

```text
function GREEDY-BEST-FIRST-SEARCH(problem, h):
    frontier = priority queue ordered by h(s)
    frontier.push(initial_state, priority=h(initial_state))
    explored = {}

    while frontier is not empty:
        node = frontier.pop()        // node with smallest h
        if is_goal(node):
            return solution
        if node in explored:
            continue
        explored.add(node)
        for each successor of node:
            if successor not in explored:
                frontier.push(successor, priority=h(successor))

    return FAILURE
```

### Properties of Greedy BestFirst Search

**Completeness**: Not guaranteed in the general case. If the search follows a wrong branch that cycles or goes to infinite depth, it will never find the goal. However, if cycles are prevented (using an explored set), it is complete in finite state spaces.

**Optimality**: No. Greedy search does not care about the cost of the path taken, only about estimated distance to the goal. It can easily find a short-looking but actually expensive path.

**Time Complexity**: O(b^m) in the worst case, where b is the branching factor and m is the maximum depth. In the worst case, the heuristic gives no useful information and greedy degenerates like DFS.

**Space Complexity**: O(b^m) - exponential, because we must store the entire frontier.

**In practice**: A good heuristic can make Greedy Best-First extremely fast. It behaves like a "guided DFS" - it dives deep toward the goal, which is efficient but not safe for finding optimal solutions.


## 6 A Search

### The History

A* was originally developed in 1968 by Peter Hart, Nils Nilsson, and Bertram Raphael at the Stanford Research Institute, specifically to solve the path-planning problem for Shakey the Robot - one of the first general-purpose mobile robots.

The algorithm evolved as follows: Dijkstra's shortest path algorithm (a special case of UCS) → A1 (first heuristic version) → A2 (improved, later renamed A*).

### The Core Idea

A* combines the best of both worlds:
- UCS is safe (optimal) but slow (explores in all directions)
- Greedy is fast but unsafe (not optimal)

A* uses: `f(s) = g(s) + h(s)`

This sums:
- **g(s)**: how much it actually cost to get here (the past)
- **h(s)**: how much we estimate it will cost to reach the goal (the future)

Together, `f(s)` is an estimate of the **total cost of the best solution through state s**.

**Intuition**: Think of it this way. You are trying to find the cheapest flight from New York to London with a layover. At each layover city, you consider: "How much have I already spent to get here?" + "What is the cheapest flight from here to London?" The node with the lowest total estimated trip cost gets expanded first.

### Pseudocode Conceptual

```text
function A_STAR(problem, h):
    frontier = priority queue ordered by f(s) = g(s) + h(s)
    frontier.push(initial_state, priority = 0 + h(initial_state))
    explored = {}

    while frontier is not empty:
        node = frontier.pop()        // smallest f = g + h
        if is_goal(node):
            return solution          // only stop when we DEQUEUE the goal
        if node in explored:
            continue
        explored.add(node)
        for each successor of node:
            new_g = g(node) + cost(node, successor)
            if successor not in explored:
                frontier.push(successor, priority = new_g + h(successor))

    return FAILURE
```

### Visual Comparison UCS vs Greedy vs A

```
UCS: expands in concentric circles from start
  (all nodes at cost 1, then cost 2, then cost 3...)
  Direction-blind - huge waste.

Greedy: dives directly toward goal, ignoring cost
  Directionally biased but might take an expensive path.

A*: expands in an "egg shape" elongated toward the goal
  Balances cost incurred (g) with estimated remaining cost (h).
  Fewer wasted expansions than UCS, but still guarantees optimality.
```

The key visual insight: A* explores far fewer nodes than UCS (because it has directional bias from h) but finds optimal paths unlike Greedy (because it considers g).

### StepbyStep Example

Consider the following graph from the lecture:

```text
States: S, a, b, c, d, e, G
Edges (cost):  S→a(1), S→d(3), a→b(1), a→d(1), b→c(1), c→G(1), d→G(1), e→d(3)

Heuristic: h(S)=6, h(a)=5, h(b)=7, h(c)=7, h(d)=1, h(e)=1, h(G)=0
```

A* will use f = g + h:
- Start at S: f(S) = 0 + 6 = 6
- Expand S, generate a (g=1, f=1+5=6) and d (g=3, f=3+1=4)
- Pop d (f=4), expand to G: g=3+1=4, f=4+0=4
- Pop G (f=4): DONE. Optimal cost = 4 via S→d→G.

Meanwhile Greedy would look at h(a)=5 < h(d)=1... wait, h(d)=1 is already lower. Greedy would also find d first. But in the original lecture example, Greedy went the wrong direction first. The point is that Greedy can be fooled; A* cannot (with admissible h).


## 7 When Should A Terminate

This is a subtle but important point.

**Wrong answer**: Stop as soon as the goal state is first added (enqueued) to the frontier.

**Correct answer**: Stop only when the goal state is first removed (dequeued) from the frontier.

### Why Early Termination Fails

When we first enqueue the goal, we may have found it through a suboptimal path. There may still be unexpanded nodes in the frontier with lower f values that could lead to the same goal via a cheaper route.

**Example from the lecture:**

```
     h=2
    A
  2   2
S       G   (h=0)
h=3   2   3
    B
    h=1
```

If we reach G via S→A→G with cost 4, we might think we are done. But S→B→G has cost 5 - worse in this case. However, imagine:

```
           A
         /   \
        2     2
       /       \
      S          G
       \       /
        2     1
         \   /
          B
          h=2
```

If S→A→G has cost 4 (enqueued first) but S→B→G has cost 3 (B still in frontier with f=2+2=4), and B is still in the frontier, then terminating when G is first enqueued misses the cheaper path.

**Rule**: Only return a solution when you pop the goal from the frontier. At that point, the priority queue guarantees that no cheaper path can still be pending, because all pending paths have f ≥ current f(goal).


## 8 Admissibility The Key Property

### What Can Go Wrong

Suppose h overestimates the true cost:

```text
      1       3
S -------A ------G
h(S)=7  h(A)=?  h(G)=0
         5
S ---------------G (direct, actual cost 5)
```

If h(S) = 7 but the actual optimal cost is 5, then f(S) = 0 + 7 = 7. If there is a direct edge S→G with actual cost 5 (so f(G) = 5+0 = 5), A* would pop G with f=5 first and return cost 5, which is fine. But suppose another bad goal G' has f=6. A* would still return S→G first. The problem arises when h overestimates and causes A* to underestimate the quality of a good path relative to a bad path.

More precisely: if h overestimates the true cost for some intermediate node n, then f(n) = g(n) + h(n) becomes inflated, making n look worse than it is. A* might choose to expand a different node (leading to a suboptimal goal) before fully exploring the path through n.

### Definition of Admissibility

A heuristic `h` is **admissible** if it never overestimates the true cost to the goal:

```text
0 <= h(s) <= h*(s)   for all states s
```

where `h*(s)` is the actual optimal cost from `s` to the nearest goal.

Additionally:
- `h(goal) = 0` for any goal state (the cost from a goal to itself is zero)
- `h(s) >= 0` for all states (costs are non-negative)

**An admissible heuristic is optimistic**: it always believes the goal is at least as reachable as it actually is. It never thinks things are harder than they are.

**Why admissibility ensures optimality**: If h never overestimates, then f(s) = g(s) + h(s) never overestimates the true cost of any solution passing through s. This means A* will always prefer to investigate paths that could potentially be optimal, and will never dismiss a path that is actually optimal.

### Examples of Admissible Heuristics

- **Straight-line distance** (Euclidean distance) for map navigation: Roads can only be longer than straight lines, so this never overestimates actual road distance.
- **Number of misplaced tiles** in the 8-puzzle: Each misplaced tile needs at least 1 move to reach its goal position, so the true cost is at least as large as this count.
- **Manhattan distance** in the 8-puzzle: Each tile must travel at least its Manhattan distance worth of moves to reach its goal.
- **h(s) = 0** for all s: Trivially admissible (but useless - reduces A* to UCS).


## 9 Proof of A Optimality Tree Search

This proof is fundamental. Make sure you understand it deeply.

**Setup:**
- Let A be an **optimal goal node** (reached via the minimum cost path)
- Let B be a **suboptimal goal node** (cost to B > cost to A)
- Let h be admissible

**Claim**: A will be dequeued (expanded) before B.

### Proof

Let n be any unexpanded node currently on the **optimal path to A**. Such a node must exist in the frontier because A has not yet been expanded (otherwise we would have already returned A).

**Step 1**: f(n) = g(n) + h(n) by definition.

**Step 2**: Since n is on the optimal path to A, and h is admissible:
- `g(n)` is the cost of the optimal partial path from start to n
- `h(n) <= h*(n)` = remaining true cost from n to A
- Therefore: `f(n) = g(n) + h(n) <= g(n) + h*(n) = cost(A)`

So: `f(n) <= cost(A)`

**Step 3**: Since B is a goal state, h(B) = 0. Therefore:
```
f(B) = g(B) + h(B) = g(B) + 0 = cost(B)
```

**Step 4**: Since B is suboptimal:
```
f(B) = cost(B) > cost(A) >= f(n)
```

So `f(n) < f(B)`.

**Conclusion**: n has higher priority (lower f) than B in the frontier. A* will always expand n before B. By the same argument, every node on the optimal path to A will be expanded before B. Therefore, A* will find A (the optimal goal) before ever expanding B.

**A* tree search is optimal with an admissible heuristic.**

### Intuition Behind the Proof

The proof works because admissibility makes f(s) a lower bound on the optimal solution cost through s. Since A* always pops the node with the lowest f, it will explore nodes along cheap-looking paths first. A suboptimal goal can only get popped when there is nothing better to explore - but admissibility guarantees that the optimal path always looks at least as good as any suboptimal goal.


## 10 Consistency The Stronger Property for Graph Search

### The Problem with Graph Search and Admissibility

In graph search, once a node is added to the explored set, it is never revisited by default. This means if we reach a state via a suboptimal path first and then find a cheaper path later, we might never update our cost estimate - leading to non-optimal results.

### What is Consistency

A heuristic h is **consistent** (also called **monotone**) if for every node n and every successor n' of n via action a:

```text
h(n) <= cost(n, a, n') + h(n')
```

In words: the heuristic estimate at n should not exceed the actual step cost plus the heuristic estimate at n'.

This is essentially the **triangle inequality** applied to heuristics. The estimated distance from n to the goal should not exceed the actual distance from n to n', plus the estimated distance from n' to the goal.

**Visual intuition:**

```text
      n ----actual cost----> n'
      |                      |
    h(n)                   h(n')
      |                      |
      v                      v
     goal <-------- ?------- goal

Consistency: h(n) <= cost(n->n') + h(n')
```

### Key Consequences

1. **f values never decrease along a path**: If n' is a successor of n, then:
   ```
   f(n') = g(n') + h(n')
         = g(n) + cost(n,n') + h(n')    [definition of g(n')]
         >= g(n) + h(n)                  [by consistency: cost(n,n') + h(n') >= h(n)]
         = f(n)
   ```
   So f values are monotonically non-decreasing along any path.

2. **Consistency implies admissibility**: Any consistent heuristic is also admissible (but not vice versa). Proof: by induction along the path to the goal.

3. **A* graph search is optimal if h is consistent**: Because f values are non-decreasing along any path, when we first pop a state from the frontier, we already have its optimal cost. We never need to revisit it.

### Example Consistent vs AdmissibleOnly

From the lecture's example:

```text
State space:
S → A (cost 1), S → C (cost 4)
A → C (cost 1), A → B (cost 3)
B → G (cost 5), C → G (cost 3)

Heuristic: h(S)=4, h(A)=4, h(B)=1, h(C)=2, h(G)=0
```

Check consistency on arc A→C:
```text
h(A) <= cost(A→C) + h(C)
4    <= 1 + 2 = 3  ???
```

This is FALSE. The heuristic is inconsistent (even though it is admissible).

With standard A* graph search, C is first reached via S→C at cost 4. Marked as explored. Later, we find S→A→C at cost 2, but C is already in explored - we skip it. We miss the optimal path to G via C!

**Solution**: When using admissible-but-inconsistent heuristics, allow re-expansion: if we find a cheaper path to an already-explored node, add it back to the frontier.


## 11 A Graph Search Implementation

The full pseudocode for A* graph search that handles admissible (possibly inconsistent) heuristics:

```text
function A_STAR_GRAPH(problem, HEURISTIC):
    node = NODE(state = problem.INITIAL)
    frontier = priority queue ordered by f = g + h
    reached = lookup table {state -> path cost}   // explored set + cost storage

    frontier.ADD(node, priority = 0 + HEURISTIC(node))
    reached.ADD(node, cost = 0)

    while frontier is not empty:
        node = frontier.POP()                     // minimum f = g + h

        if problem.IS_GOAL(node):
            return node                            // return when we DEQUEUE the goal

        for each action in problem.GET_ACTIONS(node):
            child = problem.GET_SUCCESSOR(node, action)
            current_cost = reached[node] + problem.ACTION_COST(node, action, child)

            if child NOT in reached.KEYS
               OR current_cost < reached[child]:
                // New state, or found a cheaper path to a known state
                reached[child] = current_cost
                frontier.ADD(child, priority = current_cost + HEURISTIC(child))

    return FAILURE
```

**Key points:**
1. `reached` serves double duty: it tracks explored states AND their best-known costs.
2. The condition `current_cost < reached[child]` enables re-expansion for inconsistent heuristics - if we find a cheaper path to an already-reached state, we update and re-add it.
3. We return when we **pop** the goal, not when we push it.

**When using consistent heuristics**: The re-addition in point 2 is never triggered, because f values are monotonically non-decreasing, so the first time we pop a state is always via its optimal path. Standard graph search without re-expansion is correct.


## 12 A Properties Summary

| Property | A* Tree Search | A* Graph Search (consistent h) | A* Graph Search (admissible h, re-expansion) |
| :--- | :--- | :--- | :--- |
| **Complete** | Yes (finite branching, positive costs) | Yes | Yes |
| **Optimal** | Yes, if h is admissible | Yes, if h is consistent | Yes |
| **Time Complexity** | O(b^d) worst case, better with good h | O(b^d) worst case | O(b^d) worst case |
| **Space Complexity** | Exponential - all frontier nodes in memory | Exponential | Exponential |

**The critical weakness of A***: Space. A* must keep all frontier nodes in memory (the priority queue can contain nodes from many levels). In practice, we frequently run out of memory before we run out of time.

**Does a better heuristic always help?** It expands fewer nodes, but computing a more complex heuristic takes more time per node. The net effect depends on the trade-off: `total time = (time to compute h per node) * (nodes expanded)`. There is a sweet spot.

### A vs UCS Visually

```
UCS expands in circles - uniform wavefront from start.

A* expands in an elongated ellipse toward the goal -
  directionally biased, but hedges bets to ensure optimality.

The more accurate h is, the more elongated (directed) the
ellipse becomes, and the fewer wasted nodes are expanded.
```


## 13 Heuristic Design Relaxed Problems

### The Big Idea

The most principled way to design admissible heuristics is to solve a **relaxed version** of the original problem.

A **relaxed problem** is one where some constraints are removed. The optimal cost in the relaxed problem is always <= optimal cost in the original problem (because the relaxed problem has strictly more options available - removing constraints can only make things easier or the same). Therefore, the relaxed-problem solution cost is an admissible heuristic for the original problem.

**Formal statement**: If P' is obtained from problem P by removing some constraints, then:
```typescript
cost*(P') <= cost*(P)
```
So `h(s) = cost*(s in P')` is admissible for P.

### Distance Heuristics

Two common distance metrics used as heuristics in grid or map problems:

**Euclidean distance**: `sqrt((x1-x2)^2 + (y1-y2)^2)`
- Admissible when movement is continuous (e.g., road maps)
- Corresponds to the relaxed problem where you can travel in a perfectly straight line
- In a grid with only 4-directional movement, still admissible because road distance >= straight-line distance

**Manhattan distance**: `|x1-x2| + |y1-y2|` (sum of horizontal and vertical distances)
- Admissible for grid problems with only horizontal and vertical movement
- Corresponds to the relaxed problem where tiles can slide through each other
- Never overestimates the actual number of moves needed

### Designing Your Own Heuristic

Ask: "What constraints can I relax to make the problem trivially solvable?"

For example, in the 8-puzzle:
- Original constraint: tiles can only slide into the adjacent blank space
- Relaxation 1: tiles can teleport to any position (ignoring other tiles and the blank) → "number of misplaced tiles"
- Relaxation 2: tiles can slide through each other but still need to move horizontally and vertically → "Manhattan distance"
- Relaxation 3: tiles can move in any direction freely → "Euclidean distance"

Each relaxation removes different constraints, giving different (all admissible) heuristics. The tighter the relaxation (closer to the original problem), the more informative the heuristic.


## 14 The 8Puzzle Case Study in Heuristic Design

### Problem Formulation

The 8-puzzle is a 3x3 grid with 8 numbered tiles and one blank. Tiles can slide into the blank position. The goal is to reach a specific configuration from a given start.

```
Start State:        Goal State:
  7  2  4           1  2  3
  5  _  6           4  5  6
  8  3  1           7  8  _
```

- **State space**: 9! / 2 = 181,440 reachable states (half of all 9! permutations, due to parity)
- **Actions**: Slide blank Up, Down, Left, Right (branching factor roughly 2–4, average ~3)
- **Costs**: Each move has cost 1; we want the minimum number of moves

### Heuristic 1 Number of Misplaced Tiles

Count how many tiles are not in their goal position (exclude the blank).

**Admissibility argument**: Each misplaced tile needs at least 1 move to reach its goal position. The actual number of moves needed is at least as large as the number of misplaced tiles. Therefore this heuristic never overestimates.

**Relaxed problem interpretation**: This corresponds to solving a relaxed puzzle where any tile can be directly teleported to its goal position in one step. Since direct teleportation is always at least as fast as sliding through intermediate positions, the teleport cost is at most the sliding cost.

**Performance comparison (nodes expanded):**

| | 4-step optimal | 8-step optimal | 12-step optimal |
| :--- | ---: | ---: | ---: |
| UCS | 112 | 6,300 | 3,600,000 |
| Misplaced Tiles (A*) | 13 | 39 | 227 |

The improvement is dramatic. A* with this simple heuristic expands roughly 16,000x fewer nodes than UCS for 12-step solutions!

### Heuristic 2 Total Manhattan Distance

For each tile, compute its Manhattan distance to its goal position. Sum over all tiles (excluding blank).

**Admissibility argument**: Each tile can only move horizontally or vertically, one step at a time. No tile can reach its goal in fewer moves than its Manhattan distance - other tiles might block it and force detours, making the actual cost even larger. So this heuristic never overestimates.

**Relaxed problem interpretation**: This corresponds to solving a relaxed puzzle where tiles can slide through each other (ignoring collisions). In this relaxed world, each tile independently takes the shortest path to its goal, and the total cost is the sum of individual distances.

**Example calculation:**
```typescript
Start:           Goal:            Distances:
7  2  4          1  2  3          7: 2+2=4, 2: 0+0=0, 4: 0+1=1
5  _  6          4  5  6          5: 1+0=1, 6: 0+1=1
8  3  1          7  8  _          8: 1+1=2, 3: 1+0=1, 1: 2+2=4
                                  Total = 4+0+1+1+1+2+1+4 = 14
```

Wait, the lecture's example computes h(start)=18 for a different start configuration.

**Performance comparison:**

| | 4-step optimal | 8-step optimal | 12-step optimal |
| :--- | ---: | ---: | ---: |
| Misplaced Tiles | 13 | 39 | 227 |
| Manhattan Distance | 12 | 25 | 73 |

Manhattan distance is strictly better - it expands fewer nodes at every depth. Why? It gives more information. A tile that is 3 squares away from its goal contributes 3 to Manhattan distance but only 1 to misplaced tiles. Manhattan distance "knows more" about how far things need to move.

### Heuristic 3 Actual Cost Perfect Heuristic

What if h(s) = the actual optimal cost to solve the puzzle from state s?

- This is trivially admissible (h = h*)
- A* would expand almost no nodes (only the optimal path)
- But computing the actual optimal cost from a state IS the problem we are trying to solve - it is completely circular

**The fundamental trade-off**: A better heuristic (closer to true cost) leads to fewer nodes expanded, but requires more computation per node to evaluate the heuristic. You want a heuristic that is cheap to compute but tight enough to dramatically reduce node expansions.


## 15 Heuristic Dominance

### Definition

Given two admissible heuristics h_a and h_c, we say **h_a dominates h_c** if:

```
h_a(s) >= h_c(s)   for all states s
```

### Why Dominance Matters

If h_a dominates h_c, then A* using h_a will expand fewer (or equal) nodes compared to A* using h_c.

**Proof intuition**: Consider any node n that A* with h_a would expand. It was expanded because f_a(n) = g(n) + h_a(n) was below the optimal solution cost. Since h_a(n) >= h_c(n), we have f_a(n) >= f_c(n). So if A* with h_a decided to expand n (it was "worth it"), A* with h_c would have an even lower f value for n and would also expand it. Therefore the set of nodes expanded by h_a is a subset of nodes expanded by h_c. More informative heuristic = fewer expansions.

**8-puzzle example**: Manhattan distance dominates misplaced tiles. A tile that is k squares from its goal contributes k to Manhattan distance but only 1 to misplaced tiles. So Manhattan distance >= misplaced tiles for every state. A* with Manhattan distance expands fewer nodes.

### The Heuristic Lattice

All admissible heuristics for a problem form a semi-lattice:

```
h*(s) = true optimal cost (top - most informative, too expensive to compute)
       |
  h_manhattan
       |
  h_misplaced
       |
  h(s) = 0 (bottom - least informative, reduces to UCS)
```

**Key property**: The pointwise maximum of two admissible heuristics is also admissible and dominates both:
```
h_combined(s) = max(h_a(s), h_b(s))
```
This is admissible because both h_a and h_c are below h*, so their max is still below h*.

This gives you a free way to combine multiple admissible heuristics: take their max, get a dominating heuristic with no additional theoretical cost.


## 16 Bidirectional A

### The Idea of Bidirectional A

If we know where the goal is (a single, known goal state), we can run **two simultaneous searches**:
1. **Forward search**: from start toward goal, using normal h
2. **Backward search**: from goal toward start, reversing edge directions, using a "reverse h"

We stop when the two frontiers meet - specifically, when a node is expanded by both searches.

### Why This Helps

Consider a problem with branching factor b and optimal solution depth d. One-directional A*:
```
Nodes expanded ~ O(b^d)
```

Bidirectional A* (each search goes to depth ~d/2):
```
Nodes expanded ~ O(2 * b^(d/2)) = O(b^(d/2))
```

For b=10 and d=10:
- One-directional: ~10^10 nodes
- Bidirectional: ~2 * 10^5 nodes

This is an exponential reduction!

The space complexity is halved in the exponent as well (still exponential overall, but dramatically smaller).

### When To Use It

Bidirectional search requires:
- A known, explicit goal state (not just a goal condition)
- Reversible actions (to search backward)
- Compatible heuristics for both directions


## 17 Complexity A Note on Confusion

Students often wonder: "In Data Structures, I learned that graph traversal is O(V+E) and shortest path is O((V+E) log V). Why is AI search exponential?"

The answer is about how V and E scale with the problem.

### Data Structures vs AI Planning

**In Data Structures**: You are given an explicit graph with V nodes and E edges, already stored in memory. Dijkstra's algorithm runs in O((V+E) log V) in terms of this given graph.

**In AI planning**: You are given a state space defined implicitly - only an initial state and a set of actions are given. The graph is never fully stored; you generate it on the fly as needed. The total number of states (V) and transitions (E) grows exponentially with problem size.

For a problem with branching factor b and maximum solution depth m:
```
V = O(b^m) states in the worst case
E = O(b^(m+1)) transitions
```

Plugging into Dijkstra's formula:
```text
O((V + E) log V) = O((b^m + b^(m+1)) * log(b^m)) = exponential in m
```

**Key takeaway**: The exponential complexity is not a failure of algorithm design. It is a fundamental property of the enormous state spaces that AI planning problems induce. This is why heuristics matter so much - they dramatically prune the effective search space even though the worst case remains exponential.


## 18 Beyond Vanilla A

A* is powerful but has one critical weakness: **exponential memory usage**. The frontier (priority queue) can hold O(b^d) nodes, which exhausts RAM before compute time in many real problems.

### Beam Search Limited Space A

Beam search keeps only the best k nodes in the frontier at any time (the "beam width"). This bounds memory usage to O(k).

- k=1 is pure greedy search
- k=infinity is standard A*
- Real beam search picks k to fit in available memory

**Trade-off**: Sacrifices completeness and optimality for tractable memory use. Widely used in practice (NLP, machine translation, speech recognition).

### IDA Iterative Deepening A

IDA* applies the iterative deepening idea to A*. Instead of depth limits, it uses f-value cutoffs:

```typescript
function IDA_STAR(problem, h):
    threshold = h(initial_state)
    loop:
        result = depth_limited_search(initial_state, threshold)
        if result is FOUND:
            return result
        if result is INFINITY:
            return FAILURE
        threshold = result   // set to minimum f value seen that exceeded threshold
```

Each iteration explores all nodes with `f(s) <= threshold`. When no solution is found, increase threshold to the minimum f value seen that exceeded the current threshold.

**Properties:**
- Space: O(d) - only the current path needs to be stored
- Optimal with admissible h
- Complete
- Time: slightly worse than A* due to re-expansion, but tractable for memory-limited scenarios

IDA* is the go-to algorithm when you have an admissible heuristic but cannot afford A*'s exponential memory.

### Other Variants

| Variant | Key Idea |
| :--- | :--- |
| RBFS (Recursive Best-First Search) | Mimics A* using O(d) memory via recursive backtracking |
| SMA* (Simplified Memory-Bounded A*) | Forgets worst-in-memory leaf when memory is full, re-expands if needed |
| D* (Dynamic A*) | Replans efficiently when environment changes (useful for robotics) |
| Online A* | Replans as the agent moves through a partially known environment |
| Learning heuristics | Train a neural network to predict h(s) from experience |


## Summary Algorithm Selection Guide

When choosing a search algorithm:

| Situation | Algorithm to Use |
| :--- | :--- |
| No heuristic available, need optimality | Uniform Cost Search |
| No heuristic available, just need a path | DFS or BFS |
| Have a heuristic, care only about speed | Greedy Best-First Search |
| Have admissible heuristic, need optimality, enough memory | A* (tree or graph) |
| Have consistent heuristic, graph search | A* graph search (standard) |
| Limited memory | IDA* or RBFS |
| Known explicit goal, reversible actions | Bidirectional A* |


## Key Formulas and Definitions

```text
f(s) = g(s) + h(s)                            // A* evaluation function

Admissibility:   0 <= h(s) <= h*(s)            // never overestimate true cost

Consistency:     h(A) <= cost(A -> B) + h(B)   // triangle inequality on h

Dominance:       h_a dominates h_c if h_a(s) >= h_c(s) for all s

Max combination: h_max(s) = max(h_a(s), h_b(s)) is admissible if h_a, h_b are admissible
```


## SelfTest Questions

1. What makes A* different from Greedy Best-First Search? When would the two give the same result?

2. Why do we only stop A* when we dequeue the goal, not when we first enqueue it? Construct a small example where early stopping gives the wrong answer.

3. A proposed heuristic for the 8-puzzle is: "number of tiles that are directly adjacent (horizontally or vertically) to their goal position." Is this admissible? Is it useful?

4. Is Manhattan distance consistent for the 8-puzzle? Prove it or find a counterexample.

5. If h1 is admissible and h2 is admissible, is `max(h1, h2)` admissible? Is `min(h1, h2)` admissible? Is `h1 + h2` admissible?

6. What does A* degenerate to when h(s) = 0 for all s?

7. What does A* theoretically become (in terms of behavior, not complexity) when h(s) = h*(s) for all s?

8. A heuristic h is consistent. Prove that it must also be admissible.

9. In the proof of A* optimality, we assumed n is an unexpanded node on the optimal path to A. Why must such a node exist?

10. Explain in plain English why the "number of misplaced tiles" heuristic corresponds to a relaxed version of the 8-puzzle. What specific constraint is relaxed?


*End of Lecture 4 Notes - COMP341 Informed Search*
