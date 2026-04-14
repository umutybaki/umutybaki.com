---
title: "Local Search — Comprehensive Study Notes"
date: "2026-04-14"
description: "Self-contained notes on local search algorithms including hill climbing, simulated annealing, and genetic algorithms for COMP 341 AI."
---

# Local Search — Comprehensive Study Notes

> **Course:** COMP 341 — Introduction to AI (Koç University, Asst. Prof. Barış Akgün)
> 
> These notes are written to be **self-contained**: you should be able to learn every concept from scratch just by reading them. Every algorithm includes intuition, formal pseudocode, annotated Python code, and a discussion of where it is used in the real world.

---

## 1. What Is Local Search? (The Big Picture)

### The Core Idea

Imagine you are blindfolded on a hilly terrain and your goal is to reach the highest peak. You can’t see the entire landscape — you can only feel the ground immediately around you. You take a step in whatever direction feels like it goes uphill. That’s local search.

More formally: **local search** algorithms operate by starting at some state and iteratively moving to a **neighboring** state, trying to improve some **evaluation function** (also called an **objective function**). The key insight is:

> **We don’t care about the path we took to get to the solution. We only care about the final state itself.**

This is fundamentally different from algorithms like BFS, DFS, or A*, where the solution *is* the path from start to goal.

### Where Is Local Search Used?

Local search is everywhere in real-world AI and engineering:

- **Integrated circuit design** — placing millions of transistors on a chip to minimize wire length
- **Factory floor layout** — arranging machines to minimize transport time between stations
- **Scheduling** — assigning tasks to time slots (e.g., class timetables, airline crew schedules)
- **Routing** — finding efficient paths for delivery trucks (think Google Maps fleet routing)
- **Portfolio management** — selecting investments to maximize return while minimizing risk
- **Network optimization** — configuring network topologies for maximum throughput
- **Machine learning** — training neural networks (gradient descent is a form of local search!)

In all these cases, you have some configuration (state) and you want to find the **best** configuration, or at least a **good enough** one.

---

## 2. How Local Search Differs from Classical Search

|Feature                  |Classical Search (BFS, A*, etc.)         |Local Search                              |
|:------------------------|:----------------------------------------|:-----------------------------------------|
|**What is the solution?**|A *path* from start to goal              |The *goal state itself*                   |
|**Memory usage**         |Can be very high (stores the search tree)|Typically very low (constant or small)    |
|**Explores**             |Systematically from the start            |Only the neighborhood of the current state|
|**Guarantees**           |Often complete and/or optimal            |Usually neither (with some exceptions)    |
|**Good for**             |Finding how to reach a goal              |Finding the best configuration            |

**Think of it this way:** classical search is like getting turn-by-turn driving directions. Local search is like trying to find the best seat in a crowded stadium — you don’t care how you walked there, you just want the best spot.

---

## 3. Formulating a Local Search Problem

Every local search problem needs three things:

### 3.1 Current State

This is whatever configuration you’re currently looking at. For example, in the N-Queens problem, the current state might be the positions of all queens on the board.

### 3.2 Successor (Transition) Function

This defines **which states you can reach in one step** from the current state — i.e., the “neighbors” of the current state. For N-Queens, a successor might be the board configuration you get by moving one queen within its column to a different row.

### 3.3 Evaluation (Objective) Function

This is a function that tells you **how good** a state is — it assigns a numerical score to each state. We either want to **maximize** it (hill climbing *up*) or **minimize** it (hill climbing *down*, or descent). For N-Queens, the evaluation function might count the number of pairs of queens attacking each other (and we’d want to **minimize** that to zero).

### Key Properties We Care About

- **Complete:** Does the algorithm find a solution if one exists?
- **Optimal:** Does it find the *best* solution?

---

## 4. The State-Space Landscape

Imagine plotting every possible state on the x-axis and the value of the evaluation function on the y-axis. You get a “landscape” — a terrain of hills and valleys.

### Key Features of the Landscape

- **Global maximum:** The highest point in the entire landscape. This is the state with the best evaluation. It’s what we ideally want to find.
- **Local maximum:** A point that is higher than all its immediate neighbors, but NOT the highest point overall. This is a trap — a local search algorithm might think it’s found the best state, but there’s something better elsewhere.
- **Plateau (flat local maximum):** A flat area where all neighboring states have the same value. The algorithm has no idea which way to go — there’s no uphill direction.
- **Shoulder:** A plateau that has an uphill edge. It looks like a plateau locally, but if you keep walking along it, you’ll eventually find an uphill direction. These are tricky because you might give up too early.
- **Current state:** Where you are right now in the search.

Think of the landscape as a mountain range: you want to find the tallest peak (global max), but you might get stuck on a smaller hill (local max) or a flat field (plateau).

---

## 5. Hill-Climbing Search

### 5.1 The Idea

Hill climbing is the simplest local search algorithm. The analogy from the lectures is perfect:

> **“Climbing a hill in heavy fog with amnesia.”**

- **Heavy fog:** You can only see your immediate neighbors — you have no idea what the global landscape looks like.
- **Amnesia:** You have no memory of where you’ve been — you only know your current state.

At each step, you look at all your neighbors, pick the one with the highest value, and move there. If no neighbor is better than you, you stop.

### 5.2 Pseudocode (from the lecture)

```
function HILL-CLIMBING(problem) returns a state that is a local maximum
    current ← MAKE-NODE(problem.INITIAL-STATE)
    loop do
        neighbor ← a highest-valued successor of current
        if neighbor.VALUE ≤ current.VALUE then return current.STATE
        current ← neighbor
```

**Line-by-line breakdown:**

1. Start at the initial state.
2. Enter an infinite loop.
3. Look at ALL successors (neighbors) of the current state, and pick the one with the highest evaluation value.
4. If that best neighbor is **not better** than where you are now (≤), you’re at a local maximum — stop and return the current state.
5. Otherwise, move to that neighbor and repeat.

### 5.3 Python Implementation

```python
import random

def hill_climbing(problem):
    """
    Basic hill-climbing search.

    Args:
        problem: An object with:
            - initial_state: the starting configuration
            - get_successors(state): returns a list of neighboring states
            - evaluate(state): returns a numerical score (higher = better)

    Returns:
        The best state found (a local maximum).
    """
    current = problem.initial_state

    while True:
        # Generate all neighbors of the current state
        neighbors = problem.get_successors(current)

        if not neighbors:
            # No neighbors at all — we're stuck
            return current

        # Find the neighbor with the highest evaluation
        best_neighbor = max(neighbors, key=problem.evaluate)

        # If the best neighbor isn't better than current, we're at a peak
        if problem.evaluate(best_neighbor) <= problem.evaluate(current):
            return current

        # Move to the best neighbor
        current = best_neighbor
```

### 5.4 Concrete Example: 8-Queens Problem

**Problem:** Place 8 queens on an 8×8 chessboard so that no queen attacks another. A queen attacks any piece on the same row, column, or diagonal.

**Local search formulation:**

- **State:** One queen per column. The state is a list of 8 numbers, where `state[i]` = the row of the queen in column `i`. For example, `[1, 5, 8, 6, 3, 7, 2, 4]`.
- **Successor function:** Pick any queen, move it to a different row within its column. That gives you 8 × 7 = 56 possible successors.
- **Evaluation function:** The number of pairs of queens that are attacking each other. We want to **minimize** this (0 means we solved it).

Here’s what hill climbing does on this problem:

```python
import random

def count_attacks(state):
    """
    Count the number of pairs of queens attacking each other.
    Queens are in columns 0..n-1, state[col] = row of queen in that column.
    We don't need to check column attacks because each column has exactly one queen.
    """
    n = len(state)
    attacks = 0
    for i in range(n):
        for j in range(i + 1, n):
            # Same row?
            if state[i] == state[j]:
                attacks += 1
            # Same diagonal? (difference in columns == difference in rows)
            if abs(state[i] - state[j]) == abs(i - j):
                attacks += 1
    return attacks

def get_successors_nqueens(state):
    """Generate all neighbors by moving one queen to a different row."""
    n = len(state)
    successors = []
    for col in range(n):
        for row in range(n):
            if state[col] != row:  # Only if it's a different row
                new_state = list(state)
                new_state[col] = row
                successors.append(tuple(new_state))
    return successors

def hill_climbing_nqueens(n=8):
    """Solve n-queens using hill climbing (steepest descent on attack count)."""
    # Random initial state: one queen per column, random row
    current = tuple(random.randint(0, n - 1) for _ in range(n))
    current_attacks = count_attacks(current)

    while True:
        successors = get_successors_nqueens(current)

        # Find the successor with the FEWEST attacks (we're minimizing)
        best_successor = min(successors, key=count_attacks)
        best_attacks = count_attacks(best_successor)

        # If no improvement, we're stuck at a local minimum
        if best_attacks >= current_attacks:
            return current, current_attacks

        current = best_successor
        current_attacks = best_attacks

# Run it
solution, attacks = hill_climbing_nqueens(8)
print(f"Solution: {solution}")
print(f"Remaining attacks: {attacks}")
if attacks == 0:
    print("Solved!")
else:
    print("Stuck at a local minimum.")
```

The slide showed the 8-queens board with an evaluation of 17 (counting all attacks). Each cell in the grid showed what the evaluation would become if you moved that column’s queen to that row. Hill climbing would pick the move that reduces the number most (e.g., moving to a cell with value 12).

### 5.5 Properties of Hill Climbing

|Property            |Value                                                                                         |
|:-------------------|:---------------------------------------------------------------------------------------------|
|**Complete?**       |**No.** It can get stuck at local maxima, plateaus.                                           |
|**Optimal?**        |**No.** It finds a local maximum, not necessarily the global one.                             |
|**Time Complexity** |O(d) where d is the longest path to a “solution” — could be infinite if it cycles on plateaus.|
|**Space Complexity**|**O(1)** — constant! It only stores the current state.                                        |

### 5.6 The Three Drawbacks

1. **Local Maxima:** The algorithm gets stuck at a point that’s better than all neighbors but not the best overall.
2. **Plateaus:** A flat region where all neighbors have the same value. The algorithm has no gradient to follow.
3. **No Memory:** The algorithm doesn’t remember where it’s been, so it might revisit states or fail to learn from past failures.

### 5.7 How to Mitigate the Drawbacks

**Escaping Plateaus:**

- **Random walk among equal states:** If multiple neighbors have the same value as you, randomly pick one and move there. This can help you cross “shoulders” (flat areas that eventually lead uphill).
- **Move thresholding:** Set a limit on how many sideways moves you’ll make. If you’ve made, say, 100 sideways moves and still haven’t found improvement, give up. This avoids infinite loops on true flat local maxima.

**Avoiding Local Minima:**

- **Random restart:** When you get stuck, start over from a completely random state. Keep doing this until you find a solution. This makes hill climbing **probabilistically complete** (it will find a solution eventually, with probability 1), but it can be slow.

**Adding Memory:**

- **Parallel hill climbing:** Run hill climbing from multiple starting points simultaneously. States that lead to good evaluations “recruit” others — this is the idea behind Local Beam Search (covered next).

### 5.8 Randomized Variants

- **Stochastic Hill Climbing:** Instead of always picking the *best* uphill neighbor, randomly choose among all uphill neighbors. This avoids always going to the same local maximum.
- **First-Choice Stochastic Hill Climbing:** Generate random successors one at a time and pick the first one that’s uphill. Good when there are many successors (so generating all of them is expensive).
- **Random-Restart Hill Climbing:** Run hill climbing, and if it gets stuck, restart from a random state. Repeat until you find a solution.

### 5.9 The Bottom Line on Hill Climbing

Hill climbing is **too greedy**. It always moves uphill, which means it can never escape local maxima on its own. Real problems have tons of local maxima. Adding randomness can give completeness, but it’s inefficient. The key insight from the lectures:

> **So? Combine them! (greediness + randomness)**

This leads us to Simulated Annealing.

---

## 6. Simulated Annealing

### 6.1 The Idea

Simulated Annealing (SA) borrows its name from **metallurgy**, where annealing is the process of heating metal and then slowly cooling it to remove defects and reach a low-energy (stable) state.

The key idea:

> **Sometimes move downhill to escape local maxima.**

Specifically:

- Combine **random walk** (exploring) with **hill climbing** (exploiting).
- Early on, allow lots of random moves (high “temperature”) — explore broadly.
- Over time, gradually **decrease** the randomness (cool down) — focus more on exploitation.
- Eventually, when the temperature reaches 0, behave exactly like hill climbing.

### 6.2 The Temperature Parameter (T)

`T` controls how likely you are to accept a move that makes things **worse**:

- **High T:** You accept bad moves frequently → lots of exploration, can escape local maxima.
- **Low T:** You rarely accept bad moves → mostly greedy, like hill climbing.
- **T = 0:** You never accept bad moves → pure hill climbing. The algorithm stops.

The probability of accepting a bad move is:

$$P(\text{accept bad move}) = e^{\Delta E / T}$$

Where:

- $\Delta E$ = (new value) − (current value). This is **negative** for a bad move.
- $T$ = current temperature (positive number).

When $\Delta E$ is very negative (the move is really bad) or $T$ is very low (temperature is cold), this probability becomes very small. When $T$ is very high, even bad moves have a decent chance of being accepted.

### 6.3 Pseudocode (from the lecture)

```
function SIMULATED-ANNEALING(problem, schedule) returns a solution state
    # schedule: a mapping from time to "temperature"
    current ← MAKE-NODE(problem.INITIAL-STATE)
    for t = 1 to ∞ do
        T ← schedule(t)
        if T = 0 then return current
        next ← a randomly selected successor of current
        ΔE ← next.VALUE – current.VALUE
        if ΔE > 0 then current ← next             # Uphill: always accept
        else current ← next only with probability e^(ΔE/T)  # Downhill: maybe accept
```

**Line-by-line breakdown:**

1. Start at the initial state.
2. At each time step `t`, compute the current temperature from the schedule.
3. If the temperature has reached 0, stop and return whatever state you’re at.
4. Pick a **random** successor (NOT the best one — this is key!).
5. Calculate the change in value: $\Delta E$ = new − current.
6. If $\Delta E > 0$ (the neighbor is better), always move there.
7. If $\Delta E \leq 0$ (the neighbor is worse), move there with probability $e^{\Delta E / T}$.
8. Reduce T over time (the schedule handles this).

### 6.4 Temperature Schedules

The “schedule” determines how fast the temperature decreases. Common choices:

**Logarithmic cooling (slowest, most thorough):**
$$T(t) = \frac{d}{\log(t)}, \quad d > 0, \quad t > 1$$

**Geometric/Exponential cooling (most common in practice):**
$$T(t) = \alpha \cdot T(t-1), \quad 0 < \alpha < 1$$
For example, $\alpha = 0.99$ means the temperature decreases by 1% each step.

**Linear cooling (simplest):**
$$T(t) = T(t-1) - k, \quad k > 0$$

### 6.5 Python Implementation

```python
import random
import math

def simulated_annealing(problem, schedule, max_iterations=100000):
    """
    Simulated Annealing search.

    Args:
        problem: An object with:
            - initial_state: starting configuration
            - get_random_successor(state): returns ONE random neighbor
            - evaluate(state): returns a numerical score (higher = better)
        schedule: A function that takes time step t and returns temperature T.
        max_iterations: safety limit to prevent infinite loops.

    Returns:
        The best state found.
    """
    current = problem.initial_state
    current_value = problem.evaluate(current)

    for t in range(1, max_iterations + 1):
        T = schedule(t)

        # If temperature is 0 (or very close), we're done
        if T <= 0:
            return current

        # Pick a RANDOM neighbor (not the best one!)
        next_state = problem.get_random_successor(current)
        next_value = problem.evaluate(next_state)

        # Calculate the change in evaluation
        delta_e = next_value - current_value

        if delta_e > 0:
            # The neighbor is better — always accept
            current = next_state
            current_value = next_value
        else:
            # The neighbor is worse — accept with probability e^(delta_e / T)
            acceptance_probability = math.exp(delta_e / T)
            if random.random() < acceptance_probability:
                current = next_state
                current_value = next_value

    return current


# Example schedule: geometric cooling
def geometric_schedule(t, initial_temp=100, alpha=0.995):
    """Temperature decreases by factor alpha each step."""
    return initial_temp * (alpha ** t)

# Example schedule: linear cooling
def linear_schedule(t, initial_temp=100, k=0.01):
    """Temperature decreases by k each step."""
    return max(0, initial_temp - k * t)
```

### 6.6 Why Does Simulated Annealing Work?

Early in the search (high T), the algorithm behaves almost like a random walk — it can jump around the state space freely and escape any local maximum. As the temperature drops, it becomes pickier, settling into whatever good region it has found. If the temperature is decreased **slowly enough**, SA is:

> **Probabilistically complete AND globally optimal.**

This is a theoretical guarantee: given infinite time and a slow enough cooling schedule, SA will find the global optimum. In practice, we use finite time and faster schedules, so we get “good enough” solutions.

### 6.7 Intuition: Why Accept Bad Moves?

Think of it like exploring a cave system. If you only go downhill (toward lower ground), you might get stuck in a shallow pit. But if you’re willing to climb back up a bit, you might discover a passage that leads to a much deeper cave. Early on, you’re willing to climb a lot. Later, you settle for where you are.

---

## 7. Local Beam Search

### 7.1 The Idea

Local beam search addresses the “no memory” problem of hill climbing by keeping track of **k states** instead of just one.

> **Keep k states at a time. Generate ALL successors of ALL k states. Pick the best k of the entire batch. Repeat.**

### 7.2 How It Differs from Running k Hill Climbs in Parallel

This is a subtle but important distinction:

- **k parallel hill climbs:** Each search runs independently. They never talk to each other. If one search finds a great region but another is stuck, the stuck one doesn’t benefit.
- **Local beam search:** All k searches **share information**. When you generate all successors and pick the top k, the searches that found good areas “recruit” the others. If one search finds a great state, the other searches’ successors will be abandoned in favor of successors from that great state.

It’s like a group of hikers on a mountain. Instead of each hiking alone, they radio each other their positions. Everyone then converges toward the hiker who found the best spot.

### 7.3 Pseudocode

```
function LOCAL-BEAM-SEARCH(problem, k) returns a state
    states ← k randomly generated initial states
    loop do
        all_successors ← []
        for each state in states:
            all_successors.append(all successors of state)
        
        if any state in all_successors is a goal then return it
        
        states ← the top k states from all_successors (by evaluation value)
```

### 7.4 Python Implementation

```python
import random

def local_beam_search(problem, k=10, max_iterations=1000):
    """
    Local Beam Search.

    Args:
        problem: An object with:
            - generate_random_state(): returns a random state
            - get_successors(state): returns a list of neighbor states
            - evaluate(state): returns a numerical score (higher = better)
            - is_goal(state): returns True if the state is a solution
        k: number of states to keep at each step
        max_iterations: safety limit

    Returns:
        A goal state if found, otherwise the best state seen.
    """
    # Start with k random states
    states = [problem.generate_random_state() for _ in range(k)]

    for _ in range(max_iterations):
        # Check if any current state is a goal
        for state in states:
            if problem.is_goal(state):
                return state

        # Generate ALL successors of ALL k states
        all_successors = []
        for state in states:
            all_successors.extend(problem.get_successors(state))

        if not all_successors:
            break

        # Sort all successors by evaluation and keep the best k
        all_successors.sort(key=problem.evaluate, reverse=True)
        states = all_successors[:k]

    # Return the best state we found
    return max(states, key=problem.evaluate)
```

### 7.5 The Problem with Local Beam Search

> **All k states often end up on the same local hill.**

Because we always pick the top k, the “good” states quickly dominate. If there’s one local maximum that looks better than anything else, all k states will converge there — and we lose the diversity that made beam search useful in the first place.

### 7.6 Stochastic Beam Search

To fix this, instead of always picking the top k successors deterministically, we **randomly** choose k successors, but **biased toward good ones** (higher evaluation = higher probability of being selected).

This preserves diversity: bad successors still have some chance of surviving, which keeps the search spread across the landscape.

> “Natural selection, anyone?” — this directly leads to the idea of Genetic Algorithms.

---

## 8. Genetic Algorithms

### 8.1 The Idea

Genetic Algorithms (GAs) are inspired by **biological evolution**. The core idea is:

> **Stochastic local beam search + generate successors from PAIRS of states (instead of just one).**

In biology, offspring inherit traits from *two* parents. Similarly, in GAs, new states (children) are created by combining parts of two existing states (parents). This is called **crossover**. Additionally, small random changes (**mutations**) are introduced to maintain diversity.

### 8.2 Terminology

|Biology Term|GA Term                      |Meaning                                               |
|:-----------|:----------------------------|:-----------------------------------------------------|
|Individual  |State                        |One candidate solution, encoded as a string of symbols|
|Population  |k states                     |The current set of candidate solutions                |
|Fitness     |Evaluation function          |How good a state is                                   |
|Chromosome  |State encoding               |The string representation of a state                  |
|Gene        |Single position in the string|One element of the encoding                           |
|Crossover   |Reproduction                 |Combining two parents to make children                |
|Mutation    |Random perturbation          |Randomly changing a gene                              |

### 8.3 The GA Pipeline

The algorithm proceeds in generations. Each generation follows these steps:

#### Step 1: Initialization

Start with k randomly generated states (the initial population). Each state is encoded as a string from some finite alphabet (binary, digits, letters, etc.).

**8-Queens Example:** A state like `24748552` means: queen in column 1 is in row 2, queen in column 2 is in row 4, queen in column 3 is in row 7, etc.

#### Step 2: Fitness Evaluation

Compute the fitness of each state. Higher fitness = better solution.

**8-Queens Example with the lecture’s numbers:**

|State   |Fitness|
|:-------|------:|
|24748552|24     |
|32752411|23     |
|24415124|20     |
|32543213|11     |

(Here, fitness = 28 − number_of_attacks. Since there are C(8,2) = 28 possible pairs, a perfect solution has fitness 28.)

#### Step 3: Selection

Select pairs of parents for reproduction. Parents are chosen **proportionally to their fitness** — fitter individuals are more likely to be selected, but even unfit ones have some chance.

**Example from the lecture:** The fitness values 24, 23, 20, 11 sum to 78. The selection probabilities become:

- 24748552: 24/78 = 31%
- 32752411: 23/78 = 29%
- 24415124: 20/78 = 26%
- 32543213: 11/78 = 14%

Notice that 32543213 (the worst) has only 14% chance but is not zero. In the example, this state was “not lucky enough” and was not selected at all.

#### Step 4: Crossover (Reproduction)

For each pair of parents:

1. Randomly choose a **crossover point** (a position in the string).
2. Create two children by swapping everything after the crossover point.

**Example from the lecture:**

- Parent 1: `327|52411` and Parent 2: `247|48552`
- Crossover point after position 3
- Child 1: `327` + `48552` = `32748552`
- Child 2: `247` + `52411` = `24752411`

Each child inherits the “beginning” of one parent and the “end” of the other.

#### Step 5: Mutation

After crossover, each position in the child’s string has a small random chance of being changed to a random value.

**Example from the lecture:**

- `32748552` → `32748**1**52` (position 5 changed from 5 to 1)
- `32752124` → `3**2**252124` (position 2 changed from 7 to 2)

Mutation prevents the population from becoming too uniform (losing diversity).

#### Step 6: Repeat

The children become the new population. Go back to Step 2.

### 8.4 Pseudocode

```
function GENETIC-ALGORITHM(problem, population_size, mutation_rate, max_generations):
    population ← generate population_size random states
    
    for generation = 1 to max_generations:
        # Evaluate fitness
        fitnesses ← [problem.fitness(state) for state in population]
        
        # Check for solution
        if any state has perfect fitness: return it
        
        new_population ← []
        while len(new_population) < population_size:
            # Selection: pick two parents proportional to fitness
            parent1 ← select(population, fitnesses)
            parent2 ← select(population, fitnesses)
            
            # Crossover: combine parents
            child1, child2 ← crossover(parent1, parent2)
            
            # Mutation: randomly alter genes
            child1 ← mutate(child1, mutation_rate)
            child2 ← mutate(child2, mutation_rate)
            
            new_population.append(child1)
            new_population.append(child2)
        
        population ← new_population
    
    return the state with the highest fitness in population
```

### 8.5 Full Python Implementation

```python
import random

def genetic_algorithm(
    fitness_fn,          # function: state → number (higher = better)
    generate_random,     # function: () → random state (as a list)
    alphabet,            # list of possible values for each gene
    state_length,        # length of each state string
    population_size=100,
    mutation_rate=0.02,  # probability of mutating each gene
    max_generations=1000,
    target_fitness=None  # stop early if this fitness is reached
):
    """
    A complete genetic algorithm implementation.

    Returns:
        (best_state, best_fitness, generation_found)
    """
    # ---- Step 1: Initialize population ----
    population = [generate_random() for _ in range(population_size)]

    for gen in range(max_generations):
        # ---- Step 2: Evaluate fitness ----
        fitnesses = [fitness_fn(state) for state in population]

        # Check for solution
        best_idx = fitnesses.index(max(fitnesses))
        best_state = population[best_idx]
        best_fitness = fitnesses[best_idx]

        if target_fitness is not None and best_fitness >= target_fitness:
            return best_state, best_fitness, gen

        # ---- Step 3: Selection (fitness-proportionate / roulette wheel) ----
        # Shift fitnesses to be non-negative (in case some are negative)
        min_fit = min(fitnesses)
        shifted = [f - min_fit + 1 for f in fitnesses]  # +1 to avoid zero
        total = sum(shifted)
        probabilities = [f / total for f in shifted]

        def select():
            """Select one individual proportional to fitness."""
            r = random.random()
            cumulative = 0
            for i, p in enumerate(probabilities):
                cumulative += p
                if r <= cumulative:
                    return population[i]
            return population[-1]  # fallback due to floating point

        # ---- Build next generation ----
        new_population = []
        while len(new_population) < population_size:
            # Select two parents
            parent1 = select()
            parent2 = select()

            # ---- Step 4: Crossover ----
            crossover_point = random.randint(1, state_length - 1)
            child1 = parent1[:crossover_point] + parent2[crossover_point:]
            child2 = parent2[:crossover_point] + parent1[crossover_point:]

            # ---- Step 5: Mutation ----
            def mutate(state):
                state = list(state)  # make mutable copy
                for i in range(len(state)):
                    if random.random() < mutation_rate:
                        state[i] = random.choice(alphabet)
                return state

            child1 = mutate(child1)
            child2 = mutate(child2)

            new_population.append(child1)
            new_population.append(child2)

        population = new_population[:population_size]

    # Return the best from the final generation
    fitnesses = [fitness_fn(state) for state in population]
    best_idx = fitnesses.index(max(fitnesses))
    return population[best_idx], fitnesses[best_idx], max_generations


# ----- Example: 8-Queens with GA -----

def queens_fitness(state):
    """Fitness = 28 - number_of_attacks. Max fitness is 28 (no attacks)."""
    n = len(state)
    attacks = 0
    for i in range(n):
        for j in range(i + 1, n):
            if state[i] == state[j]:               # same row
                attacks += 1
            if abs(state[i] - state[j]) == abs(i - j):  # same diagonal
                attacks += 1
    return 28 - attacks  # 28 = C(8,2), maximum possible non-attacking pairs

def random_queens_state():
    """Generate a random 8-queens state."""
    return [random.randint(1, 8) for _ in range(8)]

solution, fitness, gen = genetic_algorithm(
    fitness_fn=queens_fitness,
    generate_random=random_queens_state,
    alphabet=list(range(1, 9)),  # rows 1 through 8
    state_length=8,
    population_size=200,
    mutation_rate=0.03,
    max_generations=5000,
    target_fitness=28  # 28 means 0 attacks
)

print(f"Solution: {solution}")
print(f"Fitness: {fitness} (28 = perfect)")
print(f"Found at generation: {gen}")
```

### 8.6 GA for the 8-Queens (Crossover Visualization)

From the lecture’s visual: two parent boards are combined at a crossover point (a vertical line splitting the columns). The child inherits the left columns from one parent and the right columns from the other. This is exactly what a crossover point does on the string encoding: `24748552` + `32752411` with crossover after column 3 gives `247|52411` → child `24752411`.

---

## 9. Gradient Descent / Ascent

### 9.1 The Idea

All the methods above are **derivative-free** — they don’t use calculus. They work on discrete state spaces (or treat continuous spaces as if they were discrete).

**Gradient descent/ascent** is for when:

- The state space is **continuous** (real-valued vectors, not discrete configurations).
- The objective function is **differentiable** (you can compute its derivative).

The idea is beautifully simple:

> **Move in the direction where the function increases (ascent) or decreases (descent) the fastest.**

That direction is given by the **gradient** — the vector of partial derivatives.

### 9.2 The Gradient

For a function $f(x)$ where $x = (x_1, x_2, \ldots, x_n)$, the gradient is:

$$\nabla f(x) = \left(\frac{\partial f}{\partial x_1}, \frac{\partial f}{\partial x_2}, \ldots, \frac{\partial f}{\partial x_n}\right)$$

The gradient points in the direction of **steepest ascent**. The negative gradient $-\nabla f(x)$ points toward **steepest descent**.

### 9.3 The Update Rule

**Gradient ascent** (maximizing):
$$x(t+1) = x(t) + \alpha \nabla f(x)$$

**Gradient descent** (minimizing):
$$x(t+1) = x(t) - \alpha \nabla f(x)$$

Where $\alpha$ is the **learning rate** (step size) — a small positive number that controls how big each step is.

### 9.4 Stopping Conditions

You keep iterating until:

- You’ve reached a maximum number of iterations, OR
- The change is very small: $|x(t+1) - x(t)| < \epsilon$ for some tiny $\epsilon$, OR
- The gradient is very small: $|\nabla f(x)| < \epsilon$

### 9.5 Python Implementation

```python
import numpy as np

def gradient_descent(f, grad_f, x0, learning_rate=0.01, max_iters=10000, tol=1e-8):
    """
    Gradient descent to MINIMIZE f(x).

    Args:
        f: the function to minimize. Takes a numpy array, returns a scalar.
        grad_f: the gradient of f. Takes a numpy array, returns a numpy array.
        x0: initial point (numpy array).
        learning_rate: step size (alpha).
        max_iters: maximum iterations.
        tol: stop if the step size is smaller than this.

    Returns:
        x: the point found (approximately a local minimum).
        history: list of (x, f(x)) at each step (for visualization).
    """
    x = np.array(x0, dtype=float)
    history = [(x.copy(), f(x))]

    for i in range(max_iters):
        grad = grad_f(x)

        # Take a step in the NEGATIVE gradient direction (we're minimizing)
        x_new = x - learning_rate * grad

        # Record history
        history.append((x_new.copy(), f(x_new)))

        # Check convergence: did we barely move?
        if np.linalg.norm(x_new - x) < tol:
            print(f"Converged after {i+1} iterations.")
            break

        x = x_new

    return x, history


# ----- Example: Minimize f(x, y) = x^2 + y^2 -----
# The minimum is at (0, 0).

def f(x):
    return x[0]**2 + x[1]**2

def grad_f(x):
    return np.array([2 * x[0], 2 * x[1]])

x_min, history = gradient_descent(f, grad_f, x0=[5.0, 3.0], learning_rate=0.1)
print(f"Minimum found at: {x_min}")
print(f"f(x_min) = {f(x_min)}")


# ----- Example 2: A more interesting function -----
# f(x, y) = (x - 3)^2 + (y + 2)^2 + sin(x) * cos(y)

def f2(x):
    return (x[0] - 3)**2 + (x[1] + 2)**2 + np.sin(x[0]) * np.cos(x[1])

def grad_f2(x):
    df_dx = 2 * (x[0] - 3) + np.cos(x[0]) * np.cos(x[1])
    df_dy = 2 * (x[1] + 2) - np.sin(x[0]) * np.sin(x[1])
    return np.array([df_dx, df_dy])

x_min2, history2 = gradient_descent(f2, grad_f2, x0=[0.0, 0.0], learning_rate=0.05)
print(f"Minimum found at: {x_min2}")
print(f"f(x_min) = {f2(x_min2)}")
```

### 9.6 Properties of Gradient Descent

**Advantages:**

- Very simple to implement.
- Works in **any number of dimensions** — even infinite dimensions (e.g., function spaces in calculus of variations).
- Extremely widely used: it’s the backbone of **deep learning** (training neural networks), logistics optimization, physics simulations, economics, and more.

**Disadvantages:**

- Requires the function to be **differentiable** (or at least approximately so).
- Can get stuck at **local minima** (same problem as hill climbing).
- The choice of learning rate $\alpha$ is critical: too large → overshooting; too small → painfully slow.
- Some landscapes are pathological (e.g., narrow valleys, saddle points).

**Advanced variants mentioned in the lecture:**

- **Newton-Raphson method:** Uses second-order derivatives (the Hessian matrix) for faster convergence.
- **Momentum:** Adaptive step sizes that accumulate velocity, like a ball rolling downhill.

### 9.7 Where Is Gradient Descent Used?

This is **the** optimization algorithm of modern machine learning. Every time you hear about “training a neural network,” gradient descent (or a variant like Adam, SGD, RMSProp) is what’s happening under the hood. It’s also used in robotics (trajectory optimization), physics (energy minimization), finance (portfolio optimization), and countless engineering applications.

---

## 10. Online Search (Brief Overview)

> **Note from the lecture:** This section is NOT in the exams. It’s included for completeness.

### 10.1 Offline vs. Online Search

- **Offline search** (everything we’ve covered so far): You have a complete model of the world. You simulate and reason about it in your head (or computer), then produce a plan, and then execute it.
- **Online search:** You don’t have a model. You **learn about the world by acting in it**. You interleave search and execution — take an action, observe what happens, then decide the next action.

### 10.2 When Do You Need Online Search?

- **Dynamic environments:** Things change too fast to plan ahead.
- **Nondeterministic environments:** Actions don’t always have the same outcome.
- **Hard to model:** The world is too complex for a useful model.

### 10.3 What Works for Online Search?

- **Hill climbing:** Yes! It only needs the current state and its neighbors. Most local search methods work online.
- **Random restart:** No — you can’t teleport back to a random state in a real environment.
- **A*:** No — A* needs to jump around the state space, which you can’t do in the real world.

### 10.4 Learning Real-Time A* (LRTA*)

A variant of A* designed for online search. It follows f(n) locally and **updates its heuristic values** based on experience, so it learns to avoid dead ends and local minima over time.

---

## 11. Beyond Classical Search

The lectures briefly mention that the real world is messier than what classical search assumes:

- **Nondeterministic actions:** An action might lead to different outcomes. Solution: **contingency plans** — plans that branch based on what actually happens.
- **Partial observability:** You can’t see the entire state. Solution: reason about **belief states** — sets of states you might be in.

These topics are beyond the scope of this course but are central to planning under uncertainty (covered in more advanced AI courses).

---

## 12. Summary & Comparison Table

|Algorithm              |Memory|Complete?             |Optimal?              |Moves Downhill?                         |Key Idea                                                |
|:----------------------|:----:|:---------------------|:---------------------|:---------------------------------------|:-------------------------------------------------------|
|**Hill Climbing**      |O(1)  |No                    |No                    |Never                                   |Always pick the best neighbor                           |
|**Stochastic HC**      |O(1)  |No                    |No                    |Never                                   |Randomly pick among uphill neighbors                    |
|**Random Restart HC**  |O(1)  |Probabilistically     |No                    |Never                                   |Restart from random states                              |
|**Simulated Annealing**|O(1)  |Prob. (if slow enough)|Prob. (if slow enough)|Yes (decreasing over time)              |Accept bad moves with decreasing probability            |
|**Local Beam Search**  |O(k)  |No                    |No                    |Never                                   |Keep top k states across all successors                 |
|**Stochastic Beam**    |O(k)  |No                    |No                    |Never                                   |Random selection biased toward good states              |
|**Genetic Algorithm**  |O(k)  |No                    |No                    |Effectively yes (via crossover/mutation)|Evolve a population using selection, crossover, mutation|
|**Gradient Descent**   |O(n)  |No                    |No (local min)        |No (follows gradient)                   |Move in direction of steepest descent                   |

### The Big Takeaways

1. **Local search is for optimization** — when the path doesn’t matter, just the final answer.
2. **The fundamental tension** is between **exploration** (trying new areas) and **exploitation** (improving what you have).
3. **Hill climbing is simple but fragile** — it gets stuck easily.
4. **Simulated annealing adds controlled randomness** — it can escape local optima.
5. **Beam search adds memory** — keeping multiple states provides more coverage.
6. **Genetic algorithms add recombination** — combining good partial solutions from different states.
7. **Gradient descent leverages calculus** — when you can compute derivatives, it’s the tool of choice.
8. **All of these (except SA with perfect schedule) lack completeness and optimality guarantees** in practice. But they work remarkably well on real problems!

---

*These notes cover all material from the COMP 341 Local Search lecture slides (Slides 1–44). Good luck studying!*