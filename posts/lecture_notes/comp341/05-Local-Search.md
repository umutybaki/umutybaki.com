---
title: "05 - Local Search"
date: "2026-03-16"
description: "Course: COMP341 Intro to AI, Koç University"
---

# 05 - Local Search

**Course**: COMP341 Intro to AI, Koç University  
**Instructor**: Asst. Prof. Barış Akgün



## 1 Recap Classical Search vs Local Search

Before diving in, let's clearly understand where we are coming from.

### Classical Search what you already know

In previous lectures, search was framed as: *"find a path from a start state to a goal state."*

- **Uninformed search**: BFS, DFS, Uniform Cost Search (UCS) - explore without domain knowledge
- **Informed search**: Greedy Best-First, A* - use a **heuristic** h(n) to estimate cost from a state to the goal
- The **solution** is the sequence of actions (the path), not just the final state
- Memory grows as you explore more of the space (BFS stores the frontier, A* stores the visited set)

**Heuristics reminder**: A heuristic h(n) answers "how promising is state n?" It estimates the remaining cost to goal. For A* to be correct:
- **Admissible**: h(n) never overestimates the true cost
- **Consistent** (monotone): h(n) ≤ cost(n, n') + h(n') for any successor n'

Heuristics are designed by relaxing problem constraints (e.g., in 8-puzzle, allow any tile to move anywhere → Manhattan distance becomes a valid heuristic).


## 2 What is Local Search

### The Core Insight

For many real-world problems, **you don't care how you got to the solution - you only care about the solution itself**.

Example: Suppose you are scheduling 100 workers across 50 shifts. You don't need to know the sequence of edits that led to the schedule - you just need a valid, good schedule. The path is irrelevant.

**Local Search** reframes the problem:
- **Solution = goal state itself** (not a path)
- You start at some state, and iteratively move to neighboring states
- The goal is to reach a state with good quality (high score / low cost)

### Formulation of What is Local Search

| Component | Classical Search | Local Search |
| :--- | :--- | :--- |
| What we track | Full path from start to current | Only current state |
| What we return | Sequence of actions (path) | The best state found |
| Memory | O(b^d) in worst case | O(1) - constant! |
| Completeness | Yes (BFS/A*) | Usually No |
| Optimality | Yes (UCS/A*) | Usually No |

### Local Search Formulation Components

1. **Current State**: Where are we right now?
2. **Successor / Transition Function**: What states can we move to from here?
3. **Evaluation Function**: How good is a given state? (higher = better, or lower = better - depends on framing)

The algorithm then simply: *move to a better neighboring state, repeat*.

### Applications

Local search is used in enormously practical settings:
- **IC (Integrated Circuit) design**: Place components on a chip to minimize wire length
- **Factory floor layout**: Arrange machines to minimize movement
- **Scheduling**: Assign tasks/workers to time slots
- **Routing (TSP)**: Find a short path visiting all cities
- **Portfolio Management**: Choose asset allocations to maximize return/risk ratio
- **Network optimization**: Configure routers, bandwidth allocation

What do all these have in common? They are **optimization problems** - you want to find a configuration that maximizes or minimizes some objective, and the path to that configuration doesn't matter.


## 3 The State Space Landscape

This is one of the most important concepts in local search. It gives you a mental model for why these algorithms work or fail.

### What is It

Imagine plotting every possible state along the x-axis (or x-y plane for 2D). For each state, plot its evaluation function value on the vertical (z) axis. The result is a **landscape** of hills and valleys.

```typescript
Evaluation
   ^
   |        /\
   |       /  \      /\
   |      /    \    /  \
   |  /\ /      \  /    \
   | /  X        \/      \___
   |/   ^                ^
   +----+----------------+----> States
        local max        global max
```

Key features of this landscape:
- **Global maximum**: The best possible state - the absolute peak
- **Local maximum**: A state that is better than all its immediate neighbors, but NOT the global best. This is the villain of local search.
- **Plateau / Shoulder**: A flat region where many states have the same evaluation. Hard to navigate - you don't know which direction leads uphill.
- **Ridge**: A narrow peak that runs in one direction. Moving perpendicular to the ridge goes downhill; moving along the ridge is flat. Hard for simple hill climbing to navigate.
- **Valley** (in minimization problems): The mirror of a local maximum

### Why Does This Matter

Local search algorithms are essentially trying to climb this landscape to find the highest peak. The challenge: **you can't see the whole landscape**. You can only see your current location and your immediate neighbors. You're climbing in heavy fog.

This metaphor is explicitly used in the lecture - "Hill-Climbing (in Heavy Fog with Amnesia)".


## 4 Hill Climbing

### The Idea

Hill climbing is the simplest local search algorithm. At every step:
1. Look at all neighbors of the current state
2. Move to the neighbor with the highest evaluation value
3. If no neighbor is better, stop - you're at a local maximum

It is "greedy" in the sense that it always moves in the direction of the steepest immediate improvement, with no consideration for the long term.

### Pseudocode of Hill Climbing

```text
function HILL-CLIMBING(problem):
    current = MAKE-NODE(problem.INITIAL-STATE)
    
    loop forever:
        neighbor = highest-valued successor of current
        
        if neighbor.VALUE <= current.VALUE:
            return current.STATE   // No improvement possible, return current
        
        current = neighbor         // Move to better neighbor
```

Notice:
- We keep only the **current state** - constant memory
- We move **only if** the neighbor is strictly better (`<= current.VALUE` causes termination)
- No backtracking, no memory of visited states

### Example NQueens Problem

The N-Queens problem is a classic benchmark for local search. Place N queens on an N×N chessboard so that no two queens attack each other (no shared row, column, or diagonal).

**Local search formulation**:
- **State**: A placement of N queens, one per column (so state = [row_1, row_2, ..., row_N], where row_i is the row of the queen in column i)
- **Successor Function**: Move any single queen to a different row in its column. For N=8, each queen has 7 possible moves → 8×7 = 56 successors per state.
- **Evaluation Function**: Number of attacking pairs (we want to **minimize** this, so we "hill climb" on the negation, or equivalently, "valley descent")

**Why this formulation works**: Starting from a random placement, we greedily move whichever queen reduces attacks the most. Empirically, this solves 8-queens almost instantly - but it can get stuck.

For the 8-Queens example shown in the lecture: with evaluation = 17 (total attacks counted along lines), the algorithm would look for the successor that minimizes this count.

### Hill Climbing Properties

| Property | Value | Explanation |
| :--- | :--- | :--- |
| Complete | **No** | Can get stuck at local maxima forever |
| Optimal | **No** | Local max ≠ global max |
| Time Complexity | O(d) where d = path length | Could be infinite if stuck in a cycle |
| Space Complexity | **O(1)** - constant | Only stores current state |

The space efficiency is the big win here. For problems with enormous state spaces, this is crucial.


## 5 Problems with Hill Climbing

Hill climbing has three fundamental failure modes, all visible in the state space landscape:

### 1 Local Maxima the most critical problem

A **local maximum** is a state that is better than all its neighbors, but worse than some other state elsewhere in the landscape. Hill climbing terminates here and declares victory - wrongly.

```typescript
Evaluation
   |          /\         <- GLOBAL max (we want to reach here)
   |         /  \
   |   /\   /    \
   |  /  \ /      \
   | /    X        \     <- LOCAL max (hill climbing stops here)
   |/                \
   +--------------------> States
```

Once you're at a local max, every neighbor is worse, so the algorithm stops. There is no way out without willingness to move downhill.

### 2 Plateaus flat regions

A **plateau** is a region where many states have the same evaluation value. When all neighbors have equal value:
- The algorithm can't distinguish which direction leads uphill
- It might wander randomly, or
- It might loop forever (visiting the same states repeatedly)

A **shoulder** is a plateau on the side of a hill - if you walk across it, you'll eventually go uphill. A **flat local maximum** is a plateau surrounded by downhill on all sides - there's no way out.

### 3 Ridges

A **ridge** is a sequence of local maxima that forms a narrow crest. From any point on the ridge:
- Moving forward along the ridge: same or slightly better value
- Moving perpendicular to the ridge: downhill

Simple hill climbing can't navigate along a ridge because each step along the ridge looks no better than staying put (or looks downhill from any individual move). You need to combine multiple moves simultaneously to traverse a ridge.

### Reality Check

In practice, for problems like 8-queens with N=100:
- Random restart hill climbing solves it in roughly O(N) restarts
- Each restart is fast (converges quickly)
- So overall it's quite practical

But for harder optimization problems with many interacting variables, local maxima are everywhere and simple HC fails.


## 6 Variants of Hill Climbing

### Dealing with Plateaus

**Random Walk Among Equal-Value States**: Instead of stopping when you find no strictly better neighbor, also allow moves to equally-valued neighbors (randomly chosen). This lets you "walk across" a plateau shoulder.

**Move Thresholding**: Allow moves to equal-value states but track if you've been to the same state before. If you revisit, stop (avoids infinite loops on flat local maxima).

### Dealing with Local Maxima

**Random Restart Hill Climbing**:
- Run hill climbing to completion (reaches a local max)
- Start over from a randomly chosen new initial state
- Repeat until a goal is found (or time limit)
- Return the best solution found across all restarts

This is **probabilistically complete**: given enough restarts, you'll eventually start near the global max and find it. However, it can be extremely slow if the global maximum is rare.

### Memory Variants

**Stochastic Hill Climbing**: Instead of always picking the best neighbor, randomly choose from neighbors that are better than the current state (weighted by how much better they are). This adds some exploration.

**First-Choice Stochastic Hill Climbing**: Generate successors one at a time (randomly), and take the first one that's better. Useful when the branching factor is huge - you don't want to enumerate all 10,000 neighbors before picking one.

### Summary of HC Variants

| Variant | Key Idea | Best For |
| :--- | :--- | :--- |
| Steepest Ascent HC | Always best neighbor | Simple, fast convergence |
| Stochastic HC | Random uphill neighbor | Avoids always-same local max |
| First-Choice HC | First uphill neighbor | High branching factor |
| Random Restart HC | Restart from random state | When local maxima are common |


## 7 Simulated Annealing

### Motivation for Simulated Annealing

Hill climbing never moves downhill. That's its fatal flaw - once trapped in a local max, it's stuck forever (without restarts). What if we occasionally allowed downhill moves?

But we can't allow random downhill moves all the time - that would be a random walk with no progress. We need a principled way to:
1. Sometimes accept downhill moves (to escape local maxima)
2. Over time, accept fewer and fewer downhill moves (so we eventually converge)

This is the idea of **Simulated Annealing**.

### Physical Analogy Annealing in Metallurgy

"Annealing" is a physical process: you heat a metal (giving atoms high energy to move around freely), then gradually cool it. As it cools, atoms settle into a low-energy crystalline structure - ideally the globally optimal structure.

At high temperature: atoms move randomly (lots of energy → lots of movement, even "uphill")  
At low temperature: atoms settle into stable positions (little energy → only downhill moves)

We simulate this process in our search algorithm.

### The Key Formula

When we consider a move to a worse state (ΔE < 0, where ΔE = next.VALUE - current.VALUE):

**Probability of accepting the bad move** = e^(ΔE / T)

Where:
- ΔE = change in evaluation (negative for worse moves)
- T = current "temperature" (starts high, decreases over time)

Intuition:
- If T is large (early in search): e^(ΔE/T) ≈ e^(small negative) ≈ close to 1 → almost always accept bad moves
- If T is small (late in search): e^(ΔE/T) = e^(large negative) ≈ 0 → almost never accept bad moves
- If ΔE is very negative (very bad move): probability is lower than for a slightly bad move → worse moves are less likely

### Pseudocode of Simulated Annealing

```text
function SIMULATED-ANNEALING(problem, schedule):
    // schedule: a function mapping time t → temperature T
    current = MAKE-NODE(problem.INITIAL-STATE)
    t = 0
    
    loop forever:
        T = schedule(t)           // Get current temperature
        t = t + 1
        
        if T == 0:
            return current        // Fully cooled, return what we have
        
        next = randomly selected successor of current
        ΔE = next.VALUE - current.VALUE
        
        if ΔE > 0:
            current = next        // Better state: always accept
        else:
            with probability e^(ΔE/T):
                current = next    // Worse state: accept with some probability
```

Important differences from hill climbing:
- We pick a **random** successor, not the best one
- We accept bad moves probabilistically
- The temperature T controls how "wild" we are

### Temperature Schedules

The temperature schedule T(t) determines how quickly the algorithm "cools down". Common schedules:

**Logarithmic cooling** (theoretically optimal but slow):
```text
T(t) = d / log(t),   d > 0, t > 1
```
Cools very slowly. If used, SA is guaranteed to find the global optimum (probabilistically complete and globally optimal).

**Geometric cooling** (most common in practice):
```text
T(t) = α × T(t-1),   0 < α < 1
```
Example: α = 0.99 means temperature decreases by 1% each step. Fast and practical.

**Linear cooling**:
```
T(t) = T(t-1) - k,   k > 0
```
Simple but can cool too fast (bad quality) or too slow (wasteful).

### Key Theoretical Result

**If T is decreased slowly enough** (specifically, at most logarithmically), Simulated Annealing is both:
- **Probabilistically complete**: will find a solution if one exists
- **Globally optimal**: the solution found will be the global optimum

In practice, we often use faster cooling (geometric) and accept "good enough" solutions.

### When to Use SA

SA shines when:
- The landscape has many local optima
- You need a good (not necessarily perfect) solution
- You have a reasonable evaluation function
- Time allows the cooling schedule to run

SA is used in VLSI design, protein folding, scheduling, and many optimization problems.


## 8 Local Beam Search

### Motivation for Local Beam Search

Hill climbing keeps track of just 1 current state. What if we tracked k states simultaneously? That's the idea of Local Beam Search.

### How It Works

```text
function LOCAL-BEAM-SEARCH(problem, k):
    Initialize k states randomly (the "beam")
    
    loop:
        Generate ALL successors of ALL k states
        Select the top-k states from this combined pool
        
        If any state in top-k is a goal: return it
        Replace beam with new top-k states
```

Step by step:
1. Start with k random states (the initial "beam")
2. For each of the k states, generate all successors
3. From this pool of k × branching_factor candidates, keep only the best k
4. Repeat

### Why Its Not Just k Independent Hill Climbers

This is a critical point the lecture emphasizes.

In k **independent** hill climbers:
- Each search is isolated
- If search #1 finds a great region, searches #2–k don't benefit

In **Local Beam Search**:
- All k searches share information
- If some searches are doing well, they effectively "recruit" computational effort from other searches
- Searches that lead to poor regions are abandoned; their slots go to promising regions

Analogy: k explorers looking for gold. In independent searches, each explorer stays in their own area. In beam search, explorers that find gold veins call the others to join them.

### Problem Lack of Diversity

After a few iterations, all k states often converge to the same local hill. The beam "clusters" and you lose the benefit of multiple starting points.

### Fix Stochastic Beam Search

Instead of always taking the top-k successors, choose k successors **randomly but biased toward better ones**. Better states are more likely to be selected, but worse states have a non-zero chance.

This maintains diversity in the beam, preventing premature convergence.

**This is the bridge to Genetic Algorithms.**


## 9 Genetic Algorithms

### The Big Picture

Genetic Algorithms (GAs) = Stochastic Beam Search + generate new states from **pairs** of existing states (instead of just mutating single states).

The idea is inspired by biological evolution:
- A **population** of candidate solutions exists
- Fitter individuals are more likely to **reproduce**
- Reproduction combines parts of two parents (**crossover**)
- Random **mutations** introduce new genetic material
- Over generations, the population evolves toward better solutions

### Formulation of Genetic Algorithms

| GA Term | Search Meaning |
| :--- | :--- |
| Individual | A candidate solution (a state) |
| Population | The current set of k states (the beam) |
| Chromosome | The encoding of a state (string of symbols) |
| Gene | One element of the state encoding |
| Fitness function | The evaluation function |
| Selection | Choosing which individuals reproduce |
| Crossover | Combining two parent states to make offspring |
| Mutation | Random small change to an offspring |
| Generation | One iteration of the algorithm |

**Key formulation requirement**: States must be encoded as **finite strings over some alphabet** (often binary: 0s and 1s, or integers).

### The GA Process Step by Step

**Step 1: Initialization**
```text
Create k individuals with randomly assigned genes
```
Example for 8-queens: an individual might be [3, 7, 2, 8, 6, 4, 1, 5] where the i-th number is the row of the queen in column i.

**Step 2: Evaluate Fitness**
```text
For each individual in the population:
    fitness[i] = evaluate(individual[i])
```
Higher fitness = better individual. For 8-queens, fitness could be (28 - number_of_attacks), where 28 = C(8,2) is the maximum possible non-attacking pairs.

**Step 3: Selection**
```
Select pairs of parents, weighted by fitness
```
Individuals with higher fitness are more likely to be selected. This is like "survival of the fittest" - better solutions produce more offspring.

Common selection methods:
- **Roulette wheel**: probability proportional to fitness / total_fitness
- **Tournament selection**: pick 2 random individuals, the better one wins

**Step 4: Crossover**
```text
For each selected pair (parent1, parent2):
    crossover_point = random integer in [1, length-1]
    child1 = parent1[0..crossover_point] + parent2[crossover_point+1..]
    child2 = parent2[0..crossover_point] + parent1[crossover_point+1..]
```

Example with binary strings of length 8:
```
parent1 = 1 1 0 0 | 1 1 0 1
parent2 = 0 1 1 1 | 0 0 1 0
           crossover point = 4

child1  = 1 1 0 0 | 0 0 1 0   (first half of parent1 + second half of parent2)
child2  = 0 1 1 1 | 1 1 0 1   (first half of parent2 + second half of parent1)
```

**Step 5: Mutation**
```text
For each child:
    For each gene with small probability p_mutation:
        Randomly change that gene
```

Example: If p_mutation = 0.01, each bit has 1% chance of flipping.

Mutation prevents the population from converging too fast and losing genetic diversity. Without mutation, the only variation comes from crossover - and if the whole population converges to similar chromosomes, crossover won't help.

**Full Algorithm**:
```typescript
function GENETIC-ALGORITHM(problem, k, p_mutation, max_generations):
    population = [random_individual() for _ in range(k)]
    
    for generation in range(max_generations):
        fitness_scores = [fitness(ind) for ind in population]
        
        if max(fitness_scores) >= goal_fitness:
            return population[argmax(fitness_scores)]
        
        new_population = []
        while len(new_population) < k:
            parent1 = select(population, fitness_scores)
            parent2 = select(population, fitness_scores)
            child1, child2 = crossover(parent1, parent2)
            child1 = mutate(child1, p_mutation)
            child2 = mutate(child2, p_mutation)
            new_population.extend([child1, child2])
        
        population = new_population[:k]
    
    return best_individual(population, fitness_scores)
```

### Example 8Queens as Genetic Algorithm

**State encoding**: [r1, r2, r3, r4, r5, r6, r7, r8] where ri ∈ {1,...,8}

**Fitness function**: 28 - (number of attacking pairs)  
Maximum fitness = 28 (no attacks), goal is fitness = 28

**Crossover**: Random crossover point in positions 1–7  
**Mutation**: With small probability, change any ri to a random value 1–8

GAs have been successfully applied to 8-queens, and empirically find solutions efficiently.

### Brainstorming Simple GA Problems

**Problem 1: Evolve a binary string of length n containing only 1s**
- State: binary string of length n, e.g., "01101100"
- Fitness: count of 1s (max = n)
- Crossover: mix any two strings; offspring will have some 1s from each parent
- Mutation: flip random bits

**Problem 2: Evolve a symmetric binary string**
- State: binary string of length n
- Fitness: number of matching symmetric positions - count how many i satisfy s[i] == s[n-1-i]
- Crossover: mix strings; need to be careful about how symmetry is encoded

### When Do Genetic Algorithms Work Well

GAs work best when:
1. The solution can be encoded as a fixed-length string
2. Good solutions share common "building blocks" (substrings that independently contribute to fitness) - this is the **Schema Theorem** intuition
3. There's no efficient gradient-based method available
4. The landscape is highly multimodal (many local optima)

GAs work poorly when:
- The encoding doesn't capture problem structure well
- Crossover disrupts good partial solutions (epistasis)
- The fitness landscape is deceptive (building blocks mislead the algorithm)


## 10 Gradient Descent Ascent

### Motivation for Gradient Descent Ascent

All the algorithms so far are **derivative-free**: they treat the evaluation function as a black box and only compare values. But what if the evaluation function is differentiable? We can use calculus to find the direction of steepest ascent/descent analytically.

### The Setting

- State x is **continuous** and **multivariate**: x = (x₁, x₂, ..., xₙ) ∈ ℝⁿ
- Objective function f(x) is **differentiable** around x
- Goal: find x that maximizes (gradient ascent) or minimizes (gradient descent) f(x)

### The Gradient

The **gradient** of f at x is the vector of partial derivatives:

∇f(x) = (∂f/∂x₁, ∂f/∂x₂, ..., ∂f/∂xₙ)

**Interpretation**: The gradient points in the direction of steepest increase of f. Its magnitude tells you how steep the landscape is.

- ∇f points uphill
- -∇f points downhill

### Update Rule

**Gradient Descent** (minimize f):
```text
x(t+1) = x(t) - α × ∇f(x(t))
```

**Gradient Ascent** (maximize f):
```text
x(t+1) = x(t) + α × ∇f(x(t))
```

Where α (alpha) is the **learning rate** or **step size**: how far we move in the gradient direction each step.

### Full Algorithm

```text
function GRADIENT-DESCENT(f, x_initial, α, tolerance):
    x = x_initial
    
    while True:
        grad = compute_gradient(f, x)       // ∂f/∂xᵢ for each i
        x_new = x - α * grad
        
        if |x_new - x| < tolerance:         // Converged
            return x_new
        
        x = x_new
```

**Stopping Conditions**:
- Maximum number of iterations reached
- |x(t+1) - x(t)| < small threshold (steps become tiny)
- |∇f(x)| < small threshold (near a critical point)

### Extensions

**Newton-Raphson**: Uses second-order derivatives (the Hessian matrix) for faster convergence:
```text
x(t+1) = x(t) - H⁻¹(x) × ∇f(x)
```
Where H is the Hessian (matrix of second derivatives). More accurate direction but expensive to compute.

**Momentum**: Adds a velocity term that accumulates gradient history, helping navigate ravines and oscillations:
```text
v(t+1) = β × v(t) + α × ∇f(x(t))
x(t+1) = x(t) - v(t+1)
```

**Adaptive step size**: Methods like AdaGrad, RMSProp, Adam adjust α automatically per dimension.

### Computing the Gradient

Two options:
1. **Analytically**: Derive ∂f/∂xᵢ by hand (or with a computer algebra system). Exact but requires a closed-form f.
2. **Numerically**: Finite differences:
   ```text
   ∂f/∂xᵢ ≈ [f(x + ε×eᵢ) - f(x)] / ε
   ```
   where eᵢ is the unit vector in direction i and ε is small. Works for any f but slow for high dimensions.

### Properties

| Property | Value |
| :--- | :--- |
| Works in | Any number of dimensions (even infinite!) |
| Requires | Differentiable f |
| Completeness | No (can get stuck at local minima) |
| Optimality | No (unless f is convex) |
| Implementation | Very simple for the base version |

**Note**: In infinite-dimensional spaces (like function spaces in functional analysis), the concept of gradient generalizes to the functional derivative - the same algorithm applies.

### Why Is This Critically Important

Gradient descent is the **core algorithm behind neural network training**. When you train a neural network:
- x is the vector of all network weights (millions of parameters)
- f(x) is the loss function (how wrong the network's predictions are)
- We run gradient descent on -f(x) (minimizing loss)
- The gradient is computed efficiently using **backpropagation**

This algorithm is at the heart of modern AI/ML.


## 11 Online Search

### Offline vs Online

| Type | Planning | Execution |
| :--- | :--- | :--- |
| Offline | Plan fully in advance | Execute the plan |
| Online | Plan and execute simultaneously | Interleave search with action |

**Offline search** (everything we've done so far): Model the world, find a path, execute it. Works when you have a perfect model.

**Online search**: You take actions in the world and discover the result as you go. The search is happening in real-time.

### Why Online Search

1. **Dynamic environments**: The world changes too fast to plan ahead (e.g., robot navigation in a crowded hall)
2. **Non-deterministic environments**: Actions don't have predictable outcomes; deal with what happens rather than planning for every possibility
3. **Hard to model**: You don't have a good model of the world to run search on

### Online Search Formulation

Instead of a full transition model, you only have:
- **Actions(s)**: What actions are available in state s
- **c(s, a, s')**: Cost of action a from state s leading to state s'
- **Goal-test(s)**: Is s a goal?

Critical difference: **You don't know s' in advance!** You only discover the outcome after you take the action.

### Challenges

- **Irreversible actions**: If you go down a hallway and it's a dead end, you can't undo it
- **Dead ends**: States from which no goal is reachable
- **Safety**: Is it safe to explore? (A robot can't "try" driving off a cliff)

### Which Algorithms Work Online

| Algorithm | Works Online? | Reason |
| :--- | :---: | :--- |
| Hill Climbing | Yes | Only needs local information |
| Most local search methods | Yes | Same reason |
| A* | No | Needs to "jump" around the state space, which isn't physical |

### Learning RealTime A LRTA

A clever adaptation that brings A* ideas to online search:
- Follow f(n) = g(n) + h(n) locally (like A*, but only for nearby states)
- **Learn**: Update h(s) with experience. If you keep getting stuck, your heuristic was wrong - update it.
- With learning, the algorithm can escape local minima over time by recognizing them and adjusting estimates

This is based on:  
> Richard E. Korf, "Real-time heuristic search," *Artificial Intelligence*, 1990


## 12 Beyond Classical Search

This section briefly introduces problems that go beyond the classical search framework. These topics are explored more deeply in later lectures.

### NonDeterministic Actions

In classical search, every action has exactly one outcome. What if actions have multiple possible outcomes?

Example: Robot tries to grasp an object - it might succeed or fail.

Solution: **Contingency plans** - plan for multiple outcomes. Instead of a sequence of actions, the plan is a tree:
```
IF grasp succeeds THEN move to table
ELSE IF grasp fails THEN try again / call for help
```

### Partial Observability

In classical search, the agent knows its exact state at all times. What if sensors are imperfect?

Example: A robot can't tell which room it's in from sensor readings alone.

Solution: **Belief states** - instead of reasoning about one state, reason about a set of possible states the agent might be in. The agent maintains a probability distribution over states.

These problems are significantly more complex but crucial for real-world AI systems. They are covered in full later in the course (and are beyond the scope of this lecture).


## 13 Big Picture Summary

### Local Search Algorithms at a Glance

| Algorithm | Key Idea | Completeness | Optimality | Space |
| :--- | :--- | :--- | :--- | :---: |
| Hill Climbing | Always move to best neighbor | No | No | O(1) |
| HC w/ Random Restart | Restart from random state | Prob. complete | No | O(1) |
| Simulated Annealing | Sometimes accept bad moves | Prob. complete (slow schedule) | Prob. optimal | O(1) |
| Local Beam Search | Track k states, keep best k | No (can cluster) | No | O(k) |
| Stochastic Beam Search | Random selection biased to good | No | No | O(k) |
| Genetic Algorithm | Evolve population with crossover | No | No | O(k) |
| Gradient Descent | Follow gradient | No (local optima) | No (unless convex) | O(1) |

### Key Takeaways

1. **Local search trades completeness for memory efficiency** - constant memory algorithms that work on huge problems

2. **The fundamental tension**: exploitation (moving toward better states) vs exploration (escaping local optima). Every algorithm in this lecture is a different strategy for balancing this tension.

3. **Temperature/probability controls exploration**: SA's temperature schedule and GA's mutation rate both control how much "randomness" / exploration is injected into the search.

4. **No free lunch**: No single algorithm dominates all problems. The right choice depends on the structure of your problem's landscape.

5. **Gradient descent is king for differentiable problems**: If your objective is differentiable, gradient descent (and its variants) is almost always the best choice - it's the engine of modern machine learning.

6. **These algorithms are "derivative-free" except gradient descent**: HC, SA, GA, beam search all treat f as a black box. This makes them universally applicable but potentially slower.

### The Design Question

When you encounter an optimization problem, ask:
1. Can I encode the state as a vector of numbers or symbols? → Local search applicable
2. Is my objective function differentiable? → Use gradient descent
3. Are there many local optima? → Use SA or GA (they escape local optima)
4. Is my evaluation function expensive to compute? → Use HC (fewer evaluations per step)
5. Can I represent the state as a fixed-length string with meaningful crossover? → Consider GA

### Connection to the Rest of AI

Local search connects to many other areas:
- **Machine learning**: Training = optimization = gradient descent on a loss function
- **Reinforcement learning**: Policy optimization uses gradient methods (policy gradient)
- **Operations research**: TSP, scheduling use SA and GA variants heavily
- **Evolutionary computation**: GAs are the foundation of a whole field studying evolution-inspired algorithms (including Genetic Programming, Evolution Strategies, Differential Evolution)


*Notes prepared for COMP341 Intro to AI, Koç University*  
*Lecture 5: Local Search*
