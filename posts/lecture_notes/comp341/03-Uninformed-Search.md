---
title: "Lecture 3 Uninformed Search COMP341"
date: "2026-03-02"
description: "Course: COMP341 Introduction to AI, Koç University"
---

# Lecture 3 Uninformed Search COMP341

**Course**: COMP341 Introduction to AI, Koç University  
**Instructor**: Asst. Prof. Barış Akgün  
**Topic**: Search problem formulation, search trees vs. state space graphs, BFS, DFS, UCS, Depth-Limited DFS, Iterative Deepening Search, Graph Search



## 1 Recap and Motivation

Before this lecture, we covered:

- **AI working definition**: building agents that act rationally.
- **Agents**: entities that perceive their environment and take actions.
- **Rationality**: maximizing expected performance according to a performance measure.
- **Agent types**:
  - **Reflex agents**: choose actions based purely on the current percept (or a small history of percepts). They react, they do not plan ahead. Example: a thermostat.
  - **Planning agents**: think about the *future consequences* of actions before acting. They maintain a model of how the world works and reason about sequences of actions.

The key distinction:
- Reflex: *"What action do I take right now given what I see?"*
- Planning: *"What sequence of actions, starting from now, leads to my goal?"*

**This lecture is about planning agents and how they search for action sequences.** Search is the foundational algorithmic technique that planning agents use.


## 2 Data Structures for Search Detour

Before we can search efficiently, we need the right data structures. The lecture reviews the fundamental ones from CS, now framed in the context of AI.

### Why do data structures matter for AI

AI problems are hard. To make search tractable, we need to organize information (states, costs, plans) in ways that allow fast access and modification.

What kinds of data might an AI agent need to store?
- Sensory information from the environment
- The current state of the world
- A *collection* of states (when planning multiple possible futures)
- Information about which states are good or bad

### Arrays

A sequenced collection of variables accessed by integer index. Random access in O(1). Elements can be integers, floats, strings, or even other arrays. Used heavily in representing state vectors.

### Stacks

A collection with **last-in first-out (LIFO)** access order - think of a Pez dispenser or a stack of plates.

- **Push**: insert an element on top
- **Pop**: remove and return the element on top

Stacks are the natural data structure for **Depth First Search**.

### Queues

A collection with **first-in first-out (FIFO)** access order - think of a line at a checkout counter.

- **Push**: insert an element at the back
- **Pop**: remove and return the element from the front

Queues are the natural data structure for **Breadth First Search**.

### Priority Queues

A collection where each element has an associated *priority* (a numeric value), and **Pop always returns the element with the lowest priority value** (minimum-priority-out).

Stacks and simple queues are special cases:
- A stack is a priority queue where the most-recently-inserted element has the lowest priority.
- A FIFO queue is a priority queue where the least-recently-inserted element has the highest priority (they are popped in insertion order).

Priority queues are the natural data structure for **Uniform Cost Search**.

### Trees

An abstraction of a hierarchical structure. Each element is a **node** (or vertex). Connections between nodes are **edges**. Every node has at most one parent; the root has no parent. Trees encode hierarchy naturally - for example, a company org chart where the company has Sales, Manufacturing, and R&D as children, and Sales has US and International as children.

### Graphs

A generalization of trees: a set of nodes/vertices and edges, where edges can form cycles. Trees are directed acyclic graphs with a single root. Graphs encode arbitrary relationships - roads between cities, links between web pages, adjacency in a grid.

### Mazes as Graphs

The bridge to search: Pacman navigating a labyrinth can be modeled as a graph where each grid cell is a node and edges connect cells that are adjacent (4-connectivity: up, down, left, right). Finding a path to the food = finding a path in this graph.

**Important subtlety from the lecture**: *Finding a path in a Pacman labyrinth is a different problem from the full Pacman game.* Why? Because the full game also involves avoiding ghosts (a dynamic, adversarial component), eating pellets (which changes the state), and scoring. The "maze navigation" subproblem ignores all of that and only asks "how do I get from A to B?"


## 3 Search Problems and Planning Agents

**Search** in the AI sense means: carefully look through a space of possible states to find one that satisfies your criteria (goal), using actions, returning a sequence of actions as the solution.

Key aspects of AI search:
1. We look for a **state** satisfying some criteria (the goal test), within a **state space**.
2. We use **actions** to move between states.
3. The solution is a **sequence of actions** (a plan), not just a single answer.
4. Search is **offline** - the agent reasons about hypothetical futures using a **transition model** rather than actually trying actions in the real world. This is crucial: it is safe to explore bad paths in simulation.
5. Actions may have **costs**.


## 4 Problem Formulation

"We need to formulate our problem to solve it." - slide 5

Before running any search algorithm, you must specify the problem formally. A search problem has six components:

| Component | Formal Notation | Description |
| :--- | :--- | :--- |
| State Space | S | The set of all possible states the world can be in |
| Action Space | A | The set of all actions available to the agent |
| Transition Model | T: S x A -> S | Given a state and an action, what state results? Also called the Successor Function |
| Action Cost | d: S x A -> R | The scalar cost of taking action a in state s |
| Start State | s0 | The state the agent begins in |
| Goal Test | g: S -> {true, false} | A function that says whether a given state is a goal |

**Solution**: A sequence of actions that transforms s0 into a state where g(s) = true.

**Solution Cost**: The sum of costs of each action along the solution path: J(sigma) = sum of d(si, ai).

### Assumptions we make for now

- **Fully Observable**: The agent knows the complete current state.
- **Static**: The environment does not change while the agent is thinking.
- **Discrete**: Both state space and action space are finite (or countably infinite).
- **Deterministic**: Actions have predictable, single outcomes - no randomness.

These assumptions make the problem tractable for the algorithms in this lecture. Later lectures relax these assumptions.

### Example 1 Simple Vacuum Cleaner Robot

Imagine a two-room world with a vacuum cleaner robot.

- **State**: `<location, status>` where location in {A, B} and status in {dirty, clean}^2 - 4 possible states total.
- **Actions**: {Move (Left/Right), Suck, NoOp}
- **Transitions**: Actions always succeed.
- **Costs**: NoOp = 0, Move Left/Right = 1, Suck = 2
- **Start State**: Robot in room A, both rooms dirty
- **Goal Test**: Both rooms are clean

With 4 states and 3 actions, this is small enough to reason about by hand. The optimal solution minimizes total cost.

### Example 2 Romania Road Trip Arad to Bucharest

A classic AI problem: navigate from Arad to Bucharest via Romanian roads.

- **State Space**: Cities (Arad, Sibiu, Fagaras, Bucharest, ...)
- **Action Space**: Drive to an adjacent city
- **Transition Model**: Moving to the adjacent city you chose
- **Cost**: Distance (km) between cities
- **Start State**: Arad
- **Goal Test**: Current city == Bucharest

This is a graph search problem. The state space is a graph where nodes are cities and edges are roads with associated distances.

### Example 3 The Curse of Scale Chess and Go

- **Chess**: The state of a chessboard needs only 32 bytes. But the upper bound on state space size is 2^155. Storing all states would require astronomically more memory than exists on Earth.
- **Go (19x19)**: State space is approximately 2^565 - larger than the number of atoms in the visible universe.

**Lesson**: You cannot enumerate all states or pre-compute all solutions. You need smart, lazy search that explores only as much as needed.


## 5 State Space Graphs vs Search Trees

This distinction is one of the most important conceptual points in the lecture.

### State Space Graph

- **Nodes** represent states. Each state appears **exactly once**.
- **Arcs** represent transitions/actions.
- **Goal states** are a set of nodes.
- For most real problems, you *cannot build this entire graph* - it is too large. But you can still search it lazily.

### Search Tree

- The **root** is the start state.
- **Children** of a node correspond to states reachable by applying one action.
- Each node in the search tree represents an **entire path** from the root to that node - it encodes the plan needed to reach that state.
- **The same state can appear multiple times** in the search tree (if there are multiple paths to it).
- You also cannot build the entire tree for most problems - but you can explore it node by node.

### The Key Relationship

> Each node in the search tree is an entire *path* in the state space graph.

When you expand node X in the search tree, you are asking: "Starting from the path that leads to X, what states can I reach by taking one more action?"

### Why does the same state appear multiple times in the search tree

Because there may be multiple paths to the same state. Example: in the Romania problem, you might reach Sibiu via Arad->Sibiu (direct) or via Arad->Zerind->Oradea->Sibiu (longer). Both paths create nodes in the search tree with state = Sibiu.

### Extreme Case

Consider a 4-state cycle graph: S -> a -> G, S -> b -> a. The search tree can be infinitely large because you can keep looping: S -> a -> (back to S via b) -> a -> ... The tree never terminates without cycle detection.

### Construction on Demand

We construct both the state space graph and search tree on demand - lazily expanding only the nodes we choose to explore. This is the core insight of tree search algorithms.


## 6 General Tree Search Algorithm

All uninformed search algorithms share the same skeleton. The only difference is **how they pick the next node to expand from the frontier**.

### What is the Frontier

The **frontier** (also called the *fringe* or *open list*) is a data structure containing the **leaf nodes of the search tree that have been discovered but not yet expanded**. It is initialized with just the start state.

```text
function GENERAL-TREE-SEARCH(problem):
    initialize frontier with {start state of problem}
    
    loop:
        if frontier is empty:
            return FAILURE          # no solution exists
        
        node = remove_chosen_leaf(frontier)   # HOW we choose = the algorithm
        
        if goal_test(node.state):
            return SOLUTION(node)   # trace back to root for action sequence
        
        for each successor of node:
            add successor to frontier
```

**The way we remove a leaf from the frontier determines which algorithm we are running:**
- Remove the **deepest** node -> Depth First Search (LIFO stack)
- Remove the **shallowest** node -> Breadth First Search (FIFO queue)
- Remove the **lowest-cost** node -> Uniform Cost Search (priority queue by cumulative cost)


## 7 Properties of Search Algorithms

Before studying individual algorithms, we need a vocabulary for evaluating them.

### Completeness

**A search algorithm is complete if it is guaranteed to find a solution whenever one exists.**

If no solution exists and the algorithm halts and says "no solution," that is also correct behavior. The danger is infinite loops (e.g., going back and forth between two states forever).

### Optimality

**A search algorithm is optimal if it always finds the least-cost (or shortest) solution.**

A complete algorithm may find *a* solution but not *the best* one. Optimality is a stronger guarantee.

### Time Complexity

The number of nodes generated (expanded + added to frontier) to find the solution. Measured in terms of:
- **b**: branching factor - the maximum number of successors of any node. In a binary tree, b = 2. In chess, b is approximately 35.
- **d**: depth of the shallowest goal (the solution depth)
- **m**: maximum depth of the tree (can be infinite if cycles exist)

### Space Complexity

The maximum number of nodes held in memory at any point - primarily the size of the frontier (and optionally an explored set).

### Tree Structure Reference

```
Depth 0:  1 node          (root)
Depth 1:  b nodes
Depth 2:  b^2 nodes
...
Depth m:  b^m nodes
Total:    b^(m+1) nodes (roughly)
```


## 8 Depth First Search DFS

### Core Idea of Depth First Search DFS

**Always expand the deepest unexplored node first.** Go as deep as possible before backtracking.

**Analogy**: Exploring a cave system by always following the leftmost unexplored tunnel until you hit a dead end, then backtracking to the last junction and trying the next tunnel.

### Implementation of Depth First Search DFS

The frontier is a **LIFO stack**. When you expand a node and add its children, the most recently added children are explored first - which means the deepest ones get explored before backtracking.

### Pseudocode of Depth First Search DFS

```text
function DFS(problem):
    frontier = Stack()
    frontier.push(start_node)
    
    while frontier is not empty:
        node = frontier.pop()          # deepest available node
        
        if goal_test(node.state):
            return solution(node)
        
        for child in expand(node):     # add in reverse order so leftmost is on top
            frontier.push(child)
    
    return FAILURE
```

### DFS Example Trace

Given tree: A is root; A has children B, C; B has children D, E; C has children F, G; D has children H, I.

```text
Frontier (stack): [A]
Pop A -> expand -> push C then B (B on top so B is explored first)
Frontier: [C, B]
Pop B -> expand -> push E then D (D on top)
Frontier: [C, E, D]
Pop D -> expand -> push I then H
Frontier: [C, E, I, H]
Pop H -> leaf node
Frontier: [C, E, I]
Pop I -> leaf node
Frontier: [C, E]
Pop E -> leaf node
Frontier: [C]
Pop C -> expand -> push G then F
... continues until all nodes explored or goal found
```

The key behavior: DFS fully explores the subtree rooted at B (all the way down to H, I) before ever touching C.

### DFS Properties

| Property | Value | Explanation |
| :--- | :--- | :--- |
| **Complete** | No (tree) / Yes (graph, finite) | Without cycle detection, DFS can loop forever on cyclic graphs |
| **Optimal** | No | DFS finds the first solution it stumbles upon, which may not be the cheapest |
| **Time Complexity** | O(b^m) | In the worst case, must explore the entire tree of depth m |
| **Space Complexity** | O(bm) | Only keeps the current path (depth m, b siblings at each level) in memory |

**The space advantage of DFS is crucial.** BFS needs to keep all nodes at the current frontier depth - that is b^d nodes. DFS only needs to remember the current path plus the siblings at each level: O(bm). For large search spaces, this can be the difference between feasibility and running out of memory.

**Why is DFS not optimal?** DFS might find a solution at depth 10 when the optimal solution is at depth 2, just because the depth-10 branch was explored first.

**Why is DFS not complete in tree search?** If there is a cycle (A->B->A->B->...), DFS on the tree version never detects it - it just creates more and more nodes and will run forever.


## 9 Breadth First Search BFS

### Core Idea of Breadth First Search BFS

**Always expand the shallowest unexplored node first.** Explore all nodes at depth 0, then depth 1, then depth 2, etc.

**Analogy**: Spreading out from a starting point like ripples on water - all nodes at distance 1 are explored before any node at distance 2.

### Implementation of Breadth First Search BFS

The frontier is a **FIFO queue**. Nodes are explored in the order they were added - so shallower nodes (added first) are explored before deeper nodes (added later).

### Pseudocode of Breadth First Search BFS

```text
function BFS(problem):
    frontier = Queue()
    frontier.enqueue(start_node)
    
    while frontier is not empty:
        node = frontier.dequeue()      # shallowest available node
        
        if goal_test(node.state):
            return solution(node)
        
        for child in expand(node):
            frontier.enqueue(child)    # added to back, explored after current level
    
    return FAILURE
```

### BFS Example Trace

Same tree: A->children {B,C}, B->children {D,E}, C->children {F,G}, D->children {H,I}:

```text
Frontier (queue): [A]
Dequeue A -> expand -> enqueue B, C
Frontier: [B, C]
Dequeue B -> expand -> enqueue D, E
Frontier: [C, D, E]
Dequeue C -> expand -> enqueue F, G
Frontier: [D, E, F, G]
Dequeue D -> expand -> enqueue H, I
Frontier: [E, F, G, H, I]
Dequeue E -> leaf
Frontier: [F, G, H, I]
... and so on
```

BFS explores all nodes at depth 1 (B, C) before any at depth 2 (D, E, F, G).

### BFS Properties

| Property | Value | Explanation |
| :--- | :--- | :--- |
| **Complete** | Yes (if b is finite) | BFS will eventually reach every node at every depth |
| **Optimal** | Yes, if all action costs are equal | If all actions cost 1, the first goal found is the shallowest = cheapest |
| **Time Complexity** | O(b^d) | Must expand all nodes at depths 0 through d |
| **Space Complexity** | O(b^d) | The frontier at depth d has b^d nodes - all held in memory simultaneously |

**The critical weakness of BFS is memory.** If b = 10 and d = 6, the frontier holds 10^6 = 1,000,000 nodes. At d = 12, it is 10^12 nodes - terabytes of RAM. Space kills BFS before time does.

**Why is BFS optimal for equal costs?** Because it finds the shallowest goal first. If all actions cost the same, the shortest path (fewest actions) equals the minimum cost path. But if actions have different costs (e.g., some actions cost 1, others cost 100), BFS might find a 2-action path costing 200 before it finds a 5-action path costing 5.

### Vacuum Cleaner Comparison DFS vs BFS

From the lecture's worked example (robot in dirty room A):

- **DFS solution**: Move -> Suck -> Move -> Suck (4 actions)
- **BFS solution**: Suck -> Move -> Suck (3 actions)
- **DFS expanded 4 states** to find its solution
- **BFS expanded 7 states** to find its solution

BFS found a shorter solution but had to explore more states. DFS found a solution quickly but it was suboptimal.


## 10 DepthLimited DFS

### The Problem with Plain DFS

Plain DFS on a tree with cycles or infinite depth will run forever. The simplest fix: **impose a depth limit**.

### Core Idea of DepthLimited DFS

Run DFS but refuse to expand any node beyond a chosen depth limit L. Treat nodes at depth L as though they have no children (even if they do).

This gives DFS the completeness property for trees of finite depth <= L.

### Pseudocode of DepthLimited DFS

```text
function DEPTH_LIMITED_DFS(problem, limit):
    return DLS_RECURSIVE(start_node, problem, limit)

function DLS_RECURSIVE(node, problem, limit):
    if goal_test(node.state):
        return solution(node)
    
    if limit == 0:
        return CUTOFF         # hit the depth limit, do not expand
    
    cutoff_occurred = False
    
    for child in expand(node):
        result = DLS_RECURSIVE(child, problem, limit - 1)
        if result == CUTOFF:
            cutoff_occurred = True
        elif result != FAILURE:
            return result     # found a solution
    
    if cutoff_occurred:
        return CUTOFF
    else:
        return FAILURE
```

The recursive version is natural: decrement the limit at each recursive call, stopping when limit = 0.

### Properties

- **Complete**: Only if the solution depth d <= L. If you set L too small, you miss the solution.
- **Optimal**: No - inherits DFS's suboptimality.
- **Time**: O(b^L)
- **Space**: O(bL) - the linear memory advantage of DFS, now bounded.

**The catch**: What limit do you set? If you set L too small, you miss solutions. If you set it too large, you waste time. And usually you do not know d in advance. Iterative Deepening solves this problem.


## 11 Iterative Deepening Search IDS

### Motivation Getting the Best of Both Worlds

- **DFS** has great space complexity O(bm) but is not complete and not optimal.
- **BFS** is complete and optimal (equal costs) but has terrible space complexity O(b^d).

Can we have completeness + optimality + good space complexity? Yes - via **Iterative Deepening Search**.

### Core Idea of Iterative Deepening Search IDS

Run Depth-Limited DFS repeatedly, starting with limit 0 and increasing by 1 each time. When the limit equals the depth of the shallowest goal d, that DLS run will find it.

```text
function ITERATIVE_DEEPENING_SEARCH(problem):
    for limit = 0, 1, 2, 3, ...:
        result = DEPTH_LIMITED_DFS(problem, limit)
        if result != CUTOFF:
            return result
```

### IDS Trace Finding G with limits 0 1 2

Using the tree A->children {B,C}, B->children {D,E}, C->children {F,G}:

**Limit = 0**:  
Start at A. A is not G. A is at depth 0 = limit, do not expand. CUTOFF.

**Limit = 1**:  
Start at A. Not goal. Expand A -> visit B, C.  
- B: Not goal. Depth = 1 = limit. CUTOFF.  
- C: Not goal. Depth = 1 = limit. CUTOFF.  
Result: CUTOFF.

**Limit = 2**:  
Start at A. Not goal. Expand.  
- B: Not goal. Expand -> D, E.  
  - D: Not goal. Depth = 2 = limit. CUTOFF.  
  - E: Not goal. Depth = 2 = limit. CUTOFF.  
- C: Not goal. Expand -> F, G.  
  - F: Not goal. Depth = 2 = limit. CUTOFF.  
  - G: **GOAL FOUND!** Return solution A -> C -> G.

### Isnt ReExpanding Wasteful

The obvious concern: IDS re-expands nodes from shallower levels on every new iteration. Level 0's root is expanded d+1 times. Level 1 nodes are expanded d times. Etc.

**The answer**: No, because most of the work happens at the deepest level anyway.

### IDS Time Complexity Proof

The total nodes expanded across all iterations:

```
Iteration 0:  1 node (just root)
Iteration 1:  1 + b
Iteration 2:  1 + b + b^2
...
Iteration s:  1 + b + b^2 + ... + b^s
```

Summing these up: (s+1)*1 + s*b + (s-1)*b^2 + ... + 1*b^s

Factor out b^s:

    b^s * (1 + 2*b^(-1) + 3*b^(-2) + ...) = b^s * (1 - b^(-1))^(-2) = b^s * c

where c = b^2/(b-1)^2 is a constant for fixed b. This is **O(b^s)** - same asymptotic complexity as BFS!

For b = 10, d = 5: BFS expands roughly 111,111 nodes. IDS expands roughly 123,456 - only about 11% more due to repetition. For b = 2, the overhead is higher but still a constant factor.

**The overhead of re-expansion is a small constant factor, not an asymptotic penalty.**

### IDS Properties

| Property | Value |
| :--- | :--- |
| **Complete** | Yes |
| **Optimal** | Yes, if all action costs are equal |
| **Time Complexity** | O(b^s) - same as BFS |
| **Space Complexity** | O(b*s) - same as DFS |

IDS is the **preferred uninformed search algorithm** for most problems: it has BFS's completeness and optimality (for equal costs) but DFS's space efficiency.


## 12 CostAware Search Uniform Cost Search UCS

### Motivation

BFS and IDS find the *shallowest* solution. If all actions cost the same, this is also the cheapest. But what if action costs vary?

**Example**: To get from Arad to Bucharest, there are many paths. The 2-hop path might be longer in kilometers than a 5-hop path. BFS would find the 2-hop path; UCS finds the cheapest one regardless of number of hops.

### Core Idea of CostAware Search Uniform Cost Search UCS

**Expand the node with the lowest cumulative path cost g(node) first.** Use a priority queue ordered by g.

This is essentially Dijkstra's algorithm applied to search trees.

### Path Cost Notation

For a path sigma = (s0, a0), (s1, a1), ..., sn:

```text
J(sigma) = sum over i of d(si, ai)    # sum of action costs along the path
```

We write g(s) for the path cost from start to the current state s.

### Pseudocode of CostAware Search Uniform Cost Search UCS

```text
function UNIFORM_COST_SEARCH(problem):
    frontier = PriorityQueue()          # keyed by g(node)
    frontier.push(start_node, priority=0)
    
    while frontier is not empty:
        node = frontier.pop_min()       # lowest g(node)
        
        if goal_test(node.state):
            return solution(node)
        
        for child in expand(node):
            g_child = node.g + cost(node, child)
            frontier.push(child, priority=g_child)
    
    return FAILURE
```

### UCS Example Trace

Tree with edge costs: A->B costs 5, A->C costs 3, B->D costs 1, B->E costs 6, C->F costs 8, C->G costs 4, D->H costs 2, D->I costs 12.

```typescript
Frontier: {A: g=0}
Pop A (g=0) -> expand -> push B(g=5), C(g=3)
Frontier: {C:3, B:5}
Pop C (g=3) -> expand -> push F(g=11), G(g=7)
Frontier: {B:5, G:7, F:11}
Pop B (g=5) -> expand -> push D(g=6), E(g=11)
Frontier: {D:6, G:7, F:11, E:11}
Pop D (g=6) -> expand -> push H(g=8), I(g=18)
Frontier: {G:7, H:8, F:11, E:11, I:18}
Pop G (g=7) -> if G is goal, return solution at cost 7!
```

UCS found G at cumulative cost 7 (path A->C->G). BFS would have found G at the same depth but would not guarantee minimum cost if edge costs varied.

### UCS Properties

| Property | Value | Explanation |
| :--- | :--- | :--- |
| **Complete** | Yes | Guaranteed to find solution if costs >= epsilon > 0 |
| **Optimal** | Yes | Expands in order of increasing g, so first goal found is cheapest |
| **Time Complexity** | O(b^(C*/epsilon)) | C* = optimal cost, epsilon = minimum edge cost |
| **Space Complexity** | O(b^(C*/epsilon)) | Same, frontier can grow large |

**Why O(b^(C*/epsilon))?** The effective depth of the search is how many "tiers" of cost exist between 0 and C*. If the minimum action cost is epsilon and the optimal solution costs C*, then the solution is at effective depth C*/epsilon. UCS explores all nodes at lower cost, so time and space are exponential in this effective depth.

**UCS is still "uninformed"** - the costs are part of the problem definition, not a heuristic estimate. It uses only g(n) (cost so far), not any estimate of remaining cost. We call this uninformed because it has no heuristic knowledge about which states are geometrically closer to the goal.

**Relation to BFS**: If all action costs are equal (= 1), then g(n) = depth(n), and UCS reduces exactly to BFS. The priority queue degenerates into a FIFO queue.


## 13 Graph Search Avoiding Revisits

### The Problem with Tree Search

In tree search, the same state can appear multiple times because we never track which states we have already visited. This leads to:

1. **Redundant computation**: Exploring the same state multiple times via different paths.
2. **Infinite loops**: In cyclic state spaces, tree search can cycle forever.

**Example from the lecture**: A simple 4-node graph S->a->G, S->b->a. The search tree is infinite because you can keep traversing the cycle S->a->b->S->a->b->...

### Graph Search Using an Explored Set

Add a **closed list** (explored set) to the algorithm. Before expanding a node, check if its state has already been explored.

```typescript
function GENERAL-GRAPH-SEARCH(problem):
    frontier = appropriate_data_structure()
    frontier.add(start_node)
    explored = empty_set()
    
    loop:
        if frontier is empty:
            return FAILURE
        
        node = frontier.remove_chosen()
        
        if node.state is in explored:
            continue                        # skip: already processed this state
        
        if goal_test(node.state):
            return solution(node)
        
        explored.add(node.state)
        
        for child in expand(node):
            if child.state not in explored:  # optional: avoids pointless adds
                frontier.add(child)
    
    return FAILURE
```

All tree search algorithms can be converted to their graph version this way.

### Memory Cost of Graph Search

The explored set can grow to the size of the entire state space - exponential in the number of state variables. For BFS and UCS, this is acceptable because they already have exponential frontier sizes. For DFS:

- **Tree DFS**: Space = O(bm) - polynomial/linear in depth
- **Graph DFS**: Space = O(b^m) - exponential (the explored set can hold all states)

This is a significant regression for DFS. In practice, for large problems with DFS, programmers often accept the risk of revisiting states rather than storing the entire explored set.

### Graph Search and IDDFS A Critical Warning

**Graph search version of ID-DFS is NOT optimal.** Here is the counterexample from the lecture:

```
Graph:
    A
   / \
  B   C
   \ /
    G
```

With equal edge costs, optimal path to G costs 2 (A->B->G or A->C->G).

When IDS with graph search runs at limit=2:
- It might mark B as "explored" during the search.
- When the search tries to reach G via A->B->G, if B is already in the explored set from a prior path, it skips B->G.
- It may then find G via A->C->G - which is still optimal in this example - but in more complex cases, the graph search explored set can prevent finding the optimal path.

The root cause: ID-DFS intentionally re-explores nodes across iterations (that is how it achieves O(bs) space). The explored set confuses this: a node marked "explored" in a shallow-limit iteration might need to be revisited in a deeper iteration via a different path, but graph search blocks that re-exploration.

**Practical rule**: Use ID-DFS in tree search mode (no explored set) when you need bounded space and optimality. Use graph search for BFS/UCS where memory is already exponential and cycle-avoidance is critical.


## 14 The One Queue Unifying View

A beautiful insight from the lecture: **all these search algorithms are the same algorithm with different frontier strategies.**

Conceptually, all frontiers are priority queues with different priority functions:

| Algorithm | Priority Function | Data Structure Used |
| :---: | :--- | :--- |
| BFS | Depth (shallowest first) | FIFO Queue |
| DFS | Negative depth (deepest first) | LIFO Stack |
| UCS | g(n) = cumulative path cost | Min-Heap Priority Queue |
| DLS | Depth with cutoff | LIFO Stack with depth tracking |
| IDS | Repeated DLS with increasing limit | LIFO Stack |

You could write a single `search(problem, frontier_type)` function and pass different frontier objects. DFS and BFS just avoid the log(n) overhead of a true priority queue by using specialized structures (stacks and queues), but conceptually they are priority queues.


## 15 Algorithm Comparison Table

| Algorithm | Complete? | Optimal? | Time | Space | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DFS** (tree) | No | No | O(b^m) | O(bm) | Fails on cycles; great space |
| **DFS** (graph) | Yes (finite) | No | O(b^m) | O(b^m) | Explored set kills space advantage |
| **BFS** | Yes | Yes (equal costs) | O(b^d) | O(b^d) | Memory is the killer |
| **Depth-Limited DFS** | Yes if L >= d | No | O(b^L) | O(bL) | Need to know d to set L |
| **IDS** (tree) | Yes | Yes (equal costs) | O(b^d) | O(bd) | Best of BFS + DFS |
| **IDS** (graph) | Yes | **No** | O(b^d) | O(b^d) | Not optimal; use tree version |
| **UCS** | Yes | Yes (non-neg costs) | O(b^(C*/e)) | O(b^(C*/e)) | Generalizes BFS to varying costs |

**Variables**:
- b = branching factor
- d = depth of shallowest solution
- m = maximum depth (can be infinite)
- L = depth limit (Depth-Limited DFS)
- C* = optimal solution cost
- e = minimum action cost (epsilon)

**Important caveats** (from the lecture summary slide):
- BFS optimality only holds for uniform (equal) costs.
- UCS optimality holds for non-negative costs.
- IDS optimality only holds for uniform costs and **tree search version**.
- Space complexities in the table are for tree search versions (they ignore the explored set).
- Branching factors are assumed finite.
- For completeness, graphs are assumed either finite or containing a goal at finite depth.


## 16 Key Takeaways

### Why Uninformed

These algorithms are called **uninformed** (or **blind**) because they have no information about how far the current state is from the goal beyond what is in the problem definition (the state, cost, and transitions). They cannot estimate "is state A or state B closer to the goal?"

The next lecture introduces **informed** (heuristic) search - algorithms like A* that use a heuristic function h(n) to estimate the remaining distance to the goal, dramatically improving efficiency.

### Search and Models

A crucial philosophical point from the lecture: **search operates over models of the world, not the world itself.** The agent does not try actions out in the real environment and observe what happens - it simulates future states using the transition model.

Consequence: **Your search is only as good as your model.** If the transition model is wrong (e.g., your map shows a road that is actually closed), the plan you find may be invalid. Model accuracy is a critical bottleneck in real-world AI.

### Choosing an Algorithm in Practice

1. **If memory is tight and paths are long**: Use IDS (tree version). It gives BFS-quality solutions with DFS-level memory.
2. **If costs vary across actions**: Use UCS - it handles non-uniform costs correctly.
3. **If the problem is small**: BFS or DFS both work fine.
4. **If you need cycle detection and memory allows**: Use graph search versions of BFS/UCS.
5. **Never** use graph search with ID-DFS if you need optimality guarantees.

### Summary of the Frontier Metaphor

The frontier is the boundary between "explored" (fully searched) and "unknown" territory. The algorithm always picks one frontier state to explore next. Different pick strategies yield different search behaviors. The art of search algorithm design is choosing the right frontier strategy for your problem's characteristics.


*Notes compiled from COMP341 Lecture 3 slides by Asst. Prof. Barış Akgün, Koç University.*
