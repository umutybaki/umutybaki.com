---
title: "Lecture 7 Adversarial Search COMP341"
date: "2026-03-30"
description: "Course: COMP 341 - Intro to Artificial Intelligence"
---

# Lecture 7 Adversarial Search COMP341

**Course**: COMP 341 - Intro to Artificial Intelligence  
**Instructor**: Asst. Prof. Barış Akgün, Koç University  
**Topic**: Game-playing AI, Minimax, Alpha-Beta Pruning, Expectiminimax, Multi-Agent Games



## 1 Why Games are Different from Search

In the previous parts of the course, we dealt with **single-agent search**: one agent exploring a state space, trying to find a path to a goal. Think of a robot navigating a maze. There is no opponent, no adversary - just you and the environment.

Games change everything. Now there is at least one other agent whose goals directly conflict with yours. This introduces three fundamental complications:

### 11 Unpredictable Opponent

In single-agent search, you control all the moves. Your plan is a **sequence of actions**. In a game, you cannot dictate what your opponent does. Therefore, a plan cannot be a fixed sequence - it must be a **strategy**: a complete specification of what you will do for every possible state you could find yourself in, including all the ways your opponent might have played.

**Analogy**: Imagine giving someone directions through a city. If you are alone, directions are just "turn left, go straight, turn right." But if your adversary can change traffic lights against you, you need to say "if the light is green here, turn left; if it is red, take the highway instead." A strategy covers all contingencies.

### 12 Time Limits You Cannot Search Everything

In real games like chess, the game tree is astronomically large. Chess has a branching factor (number of legal moves per position) of about 35, and games last roughly 100 half-moves (plies). That gives 35^100 ≈ 10^154 possible games - far more than atoms in the observable universe.

You simply cannot search the entire tree. You must:
- **Prune** large portions of the tree that are irrelevant (Alpha-Beta Pruning)
- **Approximate** the value of non-terminal positions using an **evaluation function**

### 13 What We Will Cover and What We Wont

In this lecture:
- **Pruning** for deeper search without extra cost
- **Evaluation functions** to estimate position quality

Not covered here (but mentioned as advanced topics):
- **Machine learning** to improve evaluation accuracy (touched in the RL part of the course)
- **Sample-based search** (e.g., Monte Carlo Tree Search) for very high branching factors


## 2 Types of Games

Games can be classified along two dimensions:

|                        | **Deterministic**        | **Stochastic**              |
| :--- | :--- | :--- |
| **Perfect Information**| Chess, Go, Checkers, Tic-Tac-Toe | Backgammon               |
| **Imperfect Information** | Stratego, Battleship | Poker, Bridge, Scrabble  |

**Deterministic vs. Stochastic**: Does randomness play a role? Chess is deterministic - no dice, no cards. Backgammon has dice rolls. Poker has shuffled cards.

**Perfect vs. Imperfect Information**: Can you see the entire game state? Chess: yes, both players see the full board. Poker: no, you do not see your opponent's cards.

### Focus of This Lecture

We focus on **turn-taking, 2-player, zero-sum** games with **deterministic rules and perfect information**. These are the cleanest and most mathematically tractable.

**Zero-sum** means the gain of one player is exactly the loss of the other. Formally:
- Player 1 wins: utility = +1 for Player 1, -1 for Player 2
- Player 2 wins: utility = -1 for Player 1, +1 for Player 2
- Draw: utility = 0 for both

The key insight: because the sum of utilities is always zero (or constant), we only need **one number** - one player tries to maximize it, the other tries to minimize it. This is why one player is called MAX and the other is called MIN.

### General NonZeroSum Games

The lecture also briefly mentions **general games** where:
- Agents have independent (not necessarily opposite) utilities
- Outcomes could involve cooperation, indifference, competition, or mixtures
- Multi-player extensions are possible (3 or more players, each with their own utility)

We will return to multi-agent utilities at the end of the lecture.


## 3 Formal Problem Formulation for Deterministic Games

Just like we formally defined single-agent search problems (state space, actions, transitions, goal), we need a formal definition for games.

A **deterministic 2-player zero-sum game** is defined by:

| Component | Notation | Description |
| :--- | :--- | :--- |
| State Space | S | All possible game positions |
| Initial State | s0 | Starting position of the game |
| Players | P = {1, ..., N} | The agents playing; we focus on N=2 |
| Actions | A | Legal moves; may depend on the player and the current state |
| Transition Model | (S x A) -> S | Given a state and an action, what is the next state? |
| Terminal Test | g(s) -> {true, false} | Is the game over? |
| Terminal Utilities | (s x p) -> c | What is the numerical value of a terminal state s for player p? |

**Why do we separate terminal utilities from the state space?** Because only at terminal states (end of game) do we have actual outcome values (+1, 0, -1 in chess). Intermediate states get their values computed by the Minimax algorithm - they do not have inherent pre-defined utilities.

**Example - Tic-Tac-Toe**:
- S = all possible board configurations (X's, O's, empty squares)
- s0 = empty board
- P = {X player, O player}
- A = placing X (or O) on any empty square
- Transition = apply the placed symbol to the chosen square
- Terminal Test = 3-in-a-row for either player, or board full
- Terminal Utilities = +1 if X wins, -1 if O wins, 0 for draw (from X's perspective)


## 4 Game Trees and the Value of a State

### 41 SingleAgent Trees Recap

In single-agent search, we build a tree rooted at the start state. Each node is a state, each edge is an action. We want to find a path to a goal state. The values at leaves are known (goal = success, non-goal = failure), and we propagate values upward:

- The value of any state is the **maximum** (or best) value achievable from that state.
- For a single agent that always controls the moves: value(state) = max over all actions of value(successor).

### 42 Adversarial Game Trees

When an opponent is involved, the tree alternates between two types of nodes:
- **MAX nodes**: It is Player 1's (MAX's) turn. MAX picks the action that **maximizes** the value.
- **MIN nodes**: It is Player 2's (MIN's) turn. MIN picks the action that **minimizes** the value (from MAX's perspective).

**Intuition**: MAX wants the outcome as large as possible; MIN wants it as small as possible (because zero-sum means what is good for MAX is bad for MIN).

### 43 The Value of a State Minimax Value

The **minimax value** of a state is recursively defined:

```text
V(s) = utility(s)                           if s is a terminal state
V(s) = max over successors s' of V(s')      if s is a MAX node
V(s) = min over successors s' of V(s')      if s is a MIN node
```

This is an optimal strategy for both players simultaneously: MAX assumes MIN will play the move that minimizes the value, and MIN assumes MAX will play the move that maximizes it.

**Example tree** (from the lecture slides):

```
                MAX:   A  (value = 3)
              / | \
   MIN:   B(3) C(2) D(2)
          /|\   /|\   /|\
         3 12 8  2 4 6 14 5 2
```

Reading this tree:
- B's children have values 3, 12, 8. MIN chooses the minimum: 3.
- C's children have values 2, 4, 6. MIN chooses the minimum: 2.
- D's children have values 14, 5, 2. MIN chooses the minimum: 2.
- A's children (B, C, D) have minimax values 3, 2, 2. MAX chooses the maximum: 3.

So the optimal play is: MAX plays action a1 (going to B), and then MIN will play b1 (the move that gives value 3).


## 5 The Minimax Algorithm

### 51 Pseudocode

The minimax algorithm is a depth-first recursive traversal of the game tree:

```python
def minimax_value(state):
    """Returns the minimax value of the given state."""
    if is_terminal(state):
        return utility(state)
    if is_max_turn(state):
        return max_value(state)
    if is_min_turn(state):
        return min_value(state)

def max_value(state):
    """MAX player's turn: return the maximum value among successors."""
    v = -infinity
    for successor in get_successors(state):
        v = max(v, minimax_value(successor))
    return v

def min_value(state):
    """MIN player's turn: return the minimum value among successors."""
    v = +infinity
    for successor in get_successors(state):
        v = min(v, minimax_value(successor))
    return v

def get_best_action(state):
    """From the root state, return the action that leads to the best minimax value."""
    best_action = None
    best_value = -infinity
    for action in get_actions(state):
        successor = transition(state, action)
        v = minimax_value(successor)
        if v > best_value:
            best_value = v
            best_action = action
    return best_action
```

**Note**: `get_best_action` is only called once at the root. It does one extra level of looping to also track which action achieves the best value (not just what the value is). The recursive calls use `minimax_value` which just returns numbers.

### 52 Traced Example

Using the tree from the slides:

```text
MAX A
+-- a1 --> B (MIN node)
|          +-- b1 --> leaf: 3
|          +-- b2 --> leaf: 12
|          +-- b3 --> leaf: 8
+-- a2 --> C (MIN node)
|          +-- c1 --> leaf: 2
|          +-- c2 --> leaf: 4
|          +-- c3 --> leaf: 6
+-- a3 --> D (MIN node)
           +-- d1 --> leaf: 14
           +-- d2 --> leaf: 5
           +-- d3 --> leaf: 2
```

Step-by-step execution of `get_best_action(A)`:

1. Try action a1 -> call `minimax_value(B)` -> `min_value(B)`
  - `minimax_value(3)` = 3 (terminal)
  - `minimax_value(12)` = 12 (terminal)
  - `minimax_value(8)` = 8 (terminal)
  - `min(3, 12, 8)` = **3**
2. Try action a2 -> call `minimax_value(C)` -> `min_value(C)`
  - `min(2, 4, 6)` = **2**
3. Try action a3 -> call `minimax_value(D)` -> `min_value(D)`
  - `min(14, 5, 2)` = **2**
4. `max(3, 2, 2)` = **3** -> best action is a1

**Critical point from the lecture**: MIN has not actually played yet. We have performed a *forward simulation* - we imagined what MIN would do if we chose a1, a2, or a3, and selected the action that gives us the best result even under optimal opponent play.

### 53 Why Does This Work

Minimax computes the **game-theoretically optimal** result assuming both players play perfectly. There is no deception or exploitation of suboptimal play here - it finds the best guaranteed outcome regardless of what the opponent does (as long as the opponent also plays optimally).

If the opponent plays *sub-optimally*, minimax does at least as well as its value would suggest, and often better. This is proven in slide 34: the diagram shows a case where minimax chose a value of 10 knowing the opponent could force value 10 - if the opponent plays worse than optimal, MAX gets even more.


## 6 Minimax Properties and Complexity

### 61 Completeness

Minimax is **complete** if the game tree is finite. It will always find a value if the game terminates. Most games of interest (Tic-Tac-Toe, Chess, Checkers) have finite game trees, so this holds.

### 62 Optimality

Minimax is **optimal against a perfect player**. If your opponent is rational and plays optimally, minimax guarantees you the best possible outcome.

What if the opponent is not optimal? Minimax still does at least as well - and often does better. This is because minimax assumes a worst case that does not materialize, leaving extra value on the table for you. In the slide example:

```text
    max
   /   \
 min   min
10 10   9 100
```

Minimax would choose the left subtree (guaranteed 10). If the opponent plays incorrectly in the right subtree (choosing 100 instead of 9), you'd get 100 - better than 10!

### 63 Complexity

Minimax is essentially a depth-first search over the game tree:
- **Time**: O(b^m) where b = branching factor, m = maximum depth
- **Space**: O(b*m) - just like DFS, you only need to store the current path

For **Chess**: b ≈ 35, m ≈ 100
- Time ≈ 35^100 ≈ 10^154 - completely intractable!

This is why we need (a) pruning to reduce the number of nodes examined and (b) depth-limited search with evaluation functions to avoid going all the way to terminal states.


## 7 AlphaBeta Pruning

### 71 The Key Insight

Alpha-Beta pruning is an optimization of the Minimax algorithm that **eliminates large branches of the game tree** that cannot possibly affect the final decision at the root. The key insight is:

> If you already know that a branch will never be chosen by a rational player, you do not need to examine it.

Alpha-Beta pruning does not change the result of Minimax - it computes **exactly the same minimax value for the root**. It just does so while looking at fewer nodes.

**However**: Values of intermediate (non-root) nodes may be incorrect after pruning. Only the root's value is guaranteed correct. The lecture explicitly states: "Important: children of the root may have the wrong value."

### 72 Alpha and Beta Values

Two extra parameters thread through the recursion:

- **alpha**: The best value that MAX can guarantee along the current path to the root. Initially -infinity.
  - "The best I (MAX) have found so far on any path I control above this point."
  - As we go deeper, alpha can only **increase** (MAX keeps finding better options).

- **beta**: The best value that MIN can guarantee along the current path to the root. Initially +infinity.
  - "The best MIN has found so far on any path MIN controls above this point."
  - As we go deeper, beta can only **decrease** (MIN keeps finding better options for herself).

**Pruning conditions**:
- In a MIN node: if the value found so far v <= alpha, we can **prune**. Why? Because MAX, who makes a choice higher up in the tree, already has an option worth alpha. This MIN node will return at most v <= alpha, so MAX will never pick this path. No need to evaluate the remaining children.
- In a MAX node: if the value found so far v >= beta, we can **prune**. Why? Because MIN, who makes a choice higher up, already has an option worth beta. This MAX node will return at least v >= beta, so MIN will never pick this path.

**Memory trick**:
- Alpha is updated at MAX nodes (MAX getting a better lower bound on what it can achieve).
- Beta is updated at MIN nodes (MIN getting a better upper bound on what it will allow).
- Prune when: at a MIN node, v <= alpha (MIN found something worse than what MAX already has) OR at a MAX node, v >= beta (MAX found something better than what MIN will allow).

### 73 Pseudocode

```python
def alpha_beta_search(state):
    """Entry point: returns best action for MAX."""
    best_action = None
    best_value = -infinity
    for action in get_actions(state):
        v = min_value(transition(state, action), -infinity, +infinity)
        if v > best_value:
            best_value = v
            best_action = action
    return best_action

def max_value(state, alpha, beta):
    """MAX node: find the maximum value, pruning via beta."""
    if is_terminal(state):
        return utility(state)
    v = -infinity
    for successor in get_successors(state):
        v = max(v, min_value(successor, alpha, beta))
        if v >= beta:
            return v              # PRUNE: MIN will never choose this branch
        alpha = max(alpha, v)     # Update alpha: MAX found a better lower bound
    return v

def min_value(state, alpha, beta):
    """MIN node: find the minimum value, pruning via alpha."""
    if is_terminal(state):
        return utility(state)
    v = +infinity
    for successor in get_successors(state):
        v = min(v, max_value(successor, alpha, beta))
        if v <= alpha:
            return v              # PRUNE: MAX will never choose this branch
        beta = min(beta, v)       # Update beta: MIN found a better upper bound
    return v
```

### 74 Traced Example

Using the same tree: MAX at A, MIN nodes B, C, D, leaf values as before.

```text
Initial call: max_value(A, alpha=-inf, beta=+inf)

  Try a1 -> min_value(B, alpha=-inf, beta=+inf)
    Evaluate b1=3: v=3. v<=alpha? 3<=-inf? No. beta=min(+inf,3)=3.
    Evaluate b2=12: v=min(3,12)=3. v<=alpha? 3<=-inf? No. beta=min(3,3)=3.
    Evaluate b3=8: v=min(3,8)=3. v<=alpha? 3<=-inf? No. Return 3.
  Back at A: v=3. v>=beta? 3>=+inf? No. alpha=max(-inf,3)=3.

  Try a2 -> min_value(C, alpha=3, beta=+inf)
    Evaluate c1=2: v=2. v<=alpha? 2<=3? YES. PRUNE! Return 2.
  Back at A: v=max(3,2)=3. alpha stays 3.

  Try a3 -> min_value(D, alpha=3, beta=+inf)
    Evaluate d1=14: v=14. v<=alpha? 14<=3? No. beta=min(+inf,14)=14.
    Evaluate d2=5: v=min(14,5)=5. v<=alpha? 5<=3? No. beta=min(14,5)=5.
    Evaluate d3=2: v=min(5,2)=2. v<=alpha? 2<=3? YES. PRUNE! Return 2.
  Back at A: v=max(3,2)=3. Final answer: 3, choose action a1.
```

We pruned c2 and c3 (because MIN at C found 2 before exploring all children), saving 2 node evaluations. In deeper, wider trees, savings are enormous.

### 75 Why AlphaBeta is Correct

Alpha-Beta guarantees the **exact same minimax value for the root** as plain Minimax. The pruning is only applied when a branch is **proven irrelevant**:

- When we prune at a MIN node with v <= alpha: the MIN node will return at most v. MAX already has an option worth alpha >= v higher up. So MAX will never choose this path. Whatever values the remaining children of this MIN node have cannot make MAX change its mind.
- Symmetrically for MAX node prunes.

### 76 Complexity with Perfect Ordering

If we always examine the best move first (the move that will cause the most pruning), Alpha-Beta achieves:

- **Time**: O(b^(m/2)) instead of O(b^m)
- This means **doubling the search depth** for the same computational budget!

For Chess with b=35, m=8:
- Minimax: 35^8 ≈ 2.25 x 10^12 nodes
- Alpha-Beta (perfect ordering): 35^4 ≈ 1.5 x 10^6 nodes

In practice, perfect ordering is not achievable (you would need to know which move is best without searching, which defeats the purpose). **Practical implementations use heuristics** like: try captures first, then positional moves; use results from previous shallower searches to order moves.

**Perfect ordering doubles the solvable depth** - this is why Alpha-Beta is such a big deal. With the same time budget, you can search twice as deep, which translates directly to stronger play.

This is described as an example of **metareasoning**: computing about what to compute. You invest a small amount of effort deciding what to search in order to save a lot of effort in the actual search.


## 8 Resource Limits and Evaluation Functions

### 81 The Reality of Game AI

Even with Alpha-Beta pruning, you cannot search a game like Chess to terminal states. The problem is twofold:
- The tree is too deep (games last ~100 moves)
- The branching factor is too high (~35 for Chess)

The engineering solution: **depth-limited search** combined with an **evaluation function**.

Instead of searching all the way to terminal states, you search to a **fixed depth** d, then call an evaluation function on the leaf nodes at that depth as if they were terminal states with those values.

### 82 Practical Calculation

From the lecture: suppose you have 100 seconds per move and can explore 10,000 nodes/second -> 10^6 nodes per move.

With Alpha-Beta and good ordering: O(b^(m/2)), so 10^6 ≈ 35^(m/2) -> m/2 ≈ log_35(10^6) ≈ 4 -> depth ≈ 8.

Searching to depth 8 in Chess with a good evaluation function gives a "decent chess program." Every additional ply of depth makes a significant difference in playing strength.

**Anytime algorithm**: Use **iterative deepening** - search to depth 1, then 2, then 3, etc., until time runs out. If you run out of time mid-search, you always have the result from the previous completed depth. This gives you the deepest result achievable within the time budget.

### 83 Evaluation Functions

An evaluation function `Eval(s)` assigns a numerical score to a non-terminal board state, estimating how favorable the position is for MAX.

**Ideal**: Eval(s) = true minimax value of s. But that would require solving the game, which is exactly what we are trying to avoid!

**In practice**: Use **domain knowledge** to define features of the position that correlate with winning.

**General form - weighted linear combination**:

```
Eval(s) = w1*f1(s) + w2*f2(s) + ... + wn*fn(s)
```

Where each fi(s) is a **feature** of the state, and wi is its **weight** (importance).

**Chess example**:
- f1(s) = (number of white queens - number of black queens) - material balance at queen level
- f2(s) = (total white piece value - total black piece value) - overall material balance
  (Piece values: pawn=1, knight=3, bishop=3, rook=5, queen=9)
- f3(s) = quality of white's pawn structure - doubled pawns, isolated pawns, passed pawns
- f4(s) = king safety - castled king, pawn shield quality

**For deterministic zero-sum games**: only the **relative ordering** of evaluation values matters, not their absolute magnitude. If one position has eval=5 and another has eval=10, all we care about is that the second is better - whether we use 5 and 10 or 100 and 200 does not matter, because MAX always picks the higher-valued option.

This is why you can use arbitrary scales for evaluation functions in deterministic games, as long as the ordering is meaningful.

### 84 Depth Matters Why

A deeper evaluation is better even with an imperfect evaluation function. Why?

Suppose your evaluation function is only 80% accurate. If you evaluate at depth 8, each of those 8 levels "corrects" some of the inaccuracy by using actual game outcomes from 8 steps ahead. The evaluation is used on states that are much closer to terminal states, so errors at those states propagate much less.

**Analogy**: Predicting tomorrow's weather vs. predicting next year's weather. Short-term predictions are more accurate because you are extrapolating less. Similarly, evaluating a position 8 moves before game-end is more accurate than evaluating 30 moves before game-end.

"The deeper in the tree the evaluation function is buried, the less the quality of the evaluation function matters." - Slide 49

This represents a fundamental AI tradeoff: **feature complexity vs. computation**. You can invest in a very sophisticated evaluation function (costly to compute) or in deeper search (more computation but simpler evaluation). In practice, there is an optimal balance.


## 9 Stochastic Games and Expectiminimax

### 91 Why Stochasticity

So far we assumed deterministic games - the outcome of every action is completely known. Many real games involve randomness:
- **Explicit randomness**: Dice rolls (Backgammon), card shuffles (Poker)
- **Unpredictable opponents**: Random ghosts in Pac-Man
- **Noisy actions**: A robot's wheels may slip (the action "move forward 1 step" might actually move 0.9 steps)

**Example**: Backgammon. Each turn, a player rolls two dice, and the dice results constrain which moves are legal. The game tree now has branches we cannot control: the dice.

### 92 Chance Nodes

To handle stochasticity, we add a third type of node to the game tree: **chance nodes**.

The structure becomes:
1. MAX takes an action (MAX node)
2. Dice roll / random event occurs (CHANCE node)
3. MIN takes an action given the dice result (MIN node)
4. Dice roll again (CHANCE node)
5. MAX takes an action...
6. ... and so on until game ends.

A chance node has children for each possible outcome, each with an associated **probability**.

### 93 Expectiminimax

**Expectiminimax** extends Minimax to handle chance nodes.

The value of a chance node is the **expected value** (probability-weighted average) of its children's values:

```typescript
V(s) = utility(s)                                     if s is terminal
V(s) = max over successors s' of V(s')                if s is a MAX node
V(s) = min over successors s' of V(s')                if s is a MIN node
V(s) = sum over outcomes: P(outcome) * V(successor)   if s is a CHANCE node
```

**Pseudocode**:

```python
def expectiminimax_value(state):
    if is_terminal(state):
        return utility(state)
    if is_max_turn(state):
        return max_value(state)
    if is_min_turn(state):
        return min_value(state)
    if is_chance_node(state):
        return exp_value(state)

def max_value(state):
    v = -infinity
    for successor in get_successors(state):
        v = max(v, expectiminimax_value(successor))
    return v

def min_value(state):
    v = +infinity
    for successor in get_successors(state):
        v = min(v, expectiminimax_value(successor))
    return v

def exp_value(state):
    """Chance node: weighted average over all outcomes."""
    v = 0
    for action in get_actions(state):
        successor = transition(state, action)
        p = probability(successor)    # probability of this outcome
        v += p * expectiminimax_value(successor)
    return v
```

**Note**: The probability distribution over outcomes comes from the game model (e.g., for two dice, the probability of each sum is known). The agent does not control these outcomes.

### 94 Can We Prune Expectiminimax

**In general, no.** This is a critical difference from regular Minimax.

In Minimax, if one child of a MIN node has value 2 and we already know MAX has an option worth 3, we can prune all remaining children - they cannot make things better for MAX. The bound is tight.

In Expectiminimax, the value of a chance node depends on the **average** of all its children. If one child has value 3 and there are 20 remaining unexplored children, those 20 children could have any values - including very high ones - which would pull the average up. We cannot know the expected value without examining all children.

**Exception**: If values are bounded (e.g., guaranteed to be in [0, 1]), you can sometimes prune. The lecture slides mention this explicitly: "You can prune if values are bounded (there is a question in a previous exam)."

**Practical consequence**: Stochastic games are much harder to handle computationally.

### 95 Evaluation Functions in Stochastic Games

This is an important subtle point: in deterministic games, only the **ordering** of evaluation values matters. In stochastic games, the **actual numerical values** matter.

Why? Because chance nodes compute a weighted average. If you apply a non-linear transformation to all your evaluation values (like squaring them), the averages change in a way that could alter which action a MAX or MIN node prefers.

**Rule**: Evaluation functions in stochastic settings should be **proportional to the true expected payoff**. A linear rescaling is fine; a nonlinear transformation is not.

### 96 Practical Example Backgammon

Backgammon statistics (from slide 82):
- 21 possible distinct dice rolls (for 2 dice)
- ~20 legal moves per turn
- A single depth-2 search involves: 20 x (21 x 20)^3 ≈ 1.2 x 10^9 nodes!

With so much left to chance, looking many moves ahead is of limited benefit - a bad dice roll can undo careful planning.

**TDGammon (1995)**: An AI that plays Backgammon at world-class level using only depth-2 search + a good evaluation function. The evaluation function was learned through self-play reinforcement learning. This was the first AI program to achieve world-class performance in any major game.

### 97 What Probabilities to Use

In the expectiminimax framework, we need probabilities for outcomes at chance nodes. This could be:
- **Simple distributions**: uniform die roll (each face with probability 1/6)
- **Sophisticated models**: a learned model of how the opponent behaves in any state

Important conceptual point from slide 83: "Having a probabilistic belief about another agent's action does not mean that the agent is flipping any coins!"

A probabilistic model of an opponent is your **belief** about what they will do - your uncertainty about their strategy. The opponent may be perfectly deterministic in their play; you just do not know exactly how they will play, so you model it probabilistically.

### 98 Assumptions vs Reality Pacman Example

The lecture provides experimental results showing what happens when your model of the opponent does not match reality:

| Pacman Strategy | Ghost Type | Wins | Avg. Score |
| :--- | :--- | :---: | ---: |
| Minimax | Adversarial | 5/5 | 483 |
| Minimax | Random | 5/5 | 493 |
| Expectimax | Adversarial | 1/5 | -303 |
| Expectimax | Random | 5/5 | 503 |

Key findings:
- **Minimax is robust**: It works well against both adversarial and random ghosts. Assuming worst-case is safe.
- **Expectimax is brittle**: It performs great against random ghosts (because its model matches reality) but catastrophically against adversarial ghosts (model mismatch). Expectimax-Pacman assumes ghosts are random, so it takes risks that an adversarial ghost can exploit.

Two failure modes:
- **Dangerous Optimism**: Assuming chance (random) when the world is actually adversarial. You take risks that get exploited.
- **Dangerous Pessimism**: Assuming worst-case (adversarial) when the world is actually random or benign. You are overly cautious and miss opportunities.

The right choice of algorithm depends on your model of the environment.


## 10 MultiAgent Utilities

### 101 Beyond ZeroSum

What if the game involves more than two players, or the utilities are not zero-sum?

**Examples**:
- Three-player games: each player has independent utility (not necessarily summing to 0)
- Negotiation games: players may cooperate to achieve mutually beneficial outcomes
- Coalition games: players may form alliances against others dynamically

### 102 Generalization of Minimax

Instead of each state having a single scalar value, each state has a **utility tuple** - one value per player.

For 3 players A, B, C: a terminal state might have utility tuple (7, 1, 2) meaning A gets 7, B gets 1, C gets 2.

The rule becomes: **each player maximizes their own component of the utility tuple**.

This is straightforward and powerful: no special "zero-sum" tricks are needed. Each node's value tuple is determined by:
- Terminal nodes: given directly
- Non-terminal nodes: the tuple value is the tuple of the successor that maximizes the current player's component

### 103 Traced Example

From the slides (leaf values as tuples (A, B, C)):

```
Leaf values: (1,6,6) (7,1,2) (6,1,2) (7,2,1) (5,1,7) (1,5,2) (7,7,1) (5,2,5)
```

Tracing upward (suppose player order from bottom up is C, B, A):

1. At lowest-level nodes, Player C (3rd component) maximizes:
  - (1,6,6) vs (7,1,2): C prefers (1,6,6) since 6 > 2 -> node value (1,6,6)
  - (6,1,2) vs (7,2,1): C prefers (6,1,2) since 2 > 1 -> node value (6,1,2)
  - (5,1,7) vs (1,5,2): C prefers (5,1,7) since 7 > 2 -> node value (5,1,7)
  - (7,7,1) vs (5,2,5): C prefers (5,2,5) since 5 > 1 -> node value (5,2,5)

2. At next level, Player B (2nd component) maximizes:
  - (1,6,6) vs (6,1,2): B prefers (1,6,6) since 6 > 1 -> node value (1,6,6)
  - (5,1,7) vs (5,2,5): B prefers (5,2,5) since 2 > 1 -> node value (5,2,5)

3. At root, Player A (1st component) maximizes:
  - (1,6,6) vs (5,2,5): A prefers (5,2,5) since 5 > 1

**Final outcome**: (5,2,5). Player A gets 5, player B gets 2, player C gets 5.

Note: This may look suboptimal for B (who could have gotten 6 or 7 at some leaves), but B makes the best decision available given what A and C will do in subsequent turns.

### 104 Emergent Cooperation and Competition

In multi-agent utility settings, cooperation and competition can **emerge dynamically** - they are not hard-coded. If two players both benefit from a third player losing, they might temporarily cooperate against that third player. This happens naturally in the utility-maximization framework without any special "cooperation" mechanism.


## 11 Summary and Key Takeaways

### 111 Core Concepts

| Concept | Definition | Key Property |
| :--- | :--- | :--- |
| Zero-sum game | One player's gain = other's loss | Single scalar value; one maximizes, one minimizes |
| Minimax value | Best achievable utility under optimal play | Computed recursively; complete and optimal |
| Alpha | MAX's best guarantee on current path | Only increases as we search deeper |
| Beta | MIN's best guarantee on current path | Only decreases as we search deeper |
| Alpha-Beta Pruning | Skip branches proven irrelevant | Correct for root; intermediate values may be wrong |
| Evaluation function | Heuristic score for non-terminal states | Only ordering matters (deterministic); actual values matter (stochastic) |
| Expectiminimax | Minimax extended with chance nodes | Expected value at chance nodes; cannot generally prune |

### 112 Algorithm Hierarchy

```text
Single-agent DFS/BFS
       |
       v  (add opponent)
Minimax  --  O(b^m)
       |
       v  (add pruning)
Alpha-Beta  --  O(b^(m/2)) with perfect ordering
       |
       v  (add depth limit)
Depth-limited Alpha-Beta + Evaluation Function   <-- practical game AI
       |
       v  (add randomness)
Expectiminimax   <-- for stochastic games
       |
       v  (add multiple players)
Multi-agent utility maximization
```

### 113 The Fundamental Tradeoff

Every game-playing AI faces a tradeoff:
- **Search depth** (more computation -> more accurate game tree values)
- **Evaluation function quality** (more domain knowledge -> better estimates at leaves)

Alpha-Beta pruning extends depth without increasing computation. Better move ordering extends the benefit further. Evaluation functions make depth-limited search practical.

### 114 ExamReady Bullet Points

- Minimax is optimal against an optimal opponent; against a suboptimal opponent it does at least as well and often better.
- Alpha-Beta computes the **exact same root value** as Minimax; only intermediate values can be wrong. In particular, children of the root may have wrong values.
- With perfect move ordering, Alpha-Beta reduces time from O(b^m) to O(b^(m/2)), effectively doubling the searchable depth.
- In stochastic games: chance nodes take **expected value** (probability-weighted average).
- In stochastic games: evaluation functions must be **proportional to true expected payoff** (not just ordinally correct) because nonlinear transformations change the expected values.
- You **cannot generally prune** chance nodes - unexplored children could have extreme values that change the expectation.
- The right model (adversarial vs. random) matters enormously - a model mismatch causes catastrophic failures (as shown in the Pacman experiment).
- Multi-agent games: each state has a **utility tuple**; each player maximizes their own component. Cooperation and competition emerge naturally from utility maximization.
- Iterative deepening gives an **anytime algorithm**: always return the best result found so far, search deeper when time allows.

### 115 Historical Context

- **Minimax** was formalized by John von Neumann in game theory (1928) and adapted for AI by Claude Shannon (1950) in his landmark chess programming paper.
- **Alpha-Beta pruning** was developed independently by multiple researchers in the late 1950s and formalized by Donald Knuth and Ronald Moore in 1975.
- **TDGammon (1995)** by Gerald Tesauro was the first world-class game AI in any major game, combining depth-2 expectiminimax with a neural network evaluation function trained via reinforcement learning.
- **Deep Blue (1997)** defeated world chess champion Garry Kasparov using highly optimized Alpha-Beta search with specialized hardware.
- **AlphaGo (2016)** used Monte Carlo Tree Search combined with deep neural networks - because Go's branching factor (~250) makes Alpha-Beta impractical even with pruning.


*End of Lecture 7 Notes. These notes cover all slides from the lecture deck, supplemented with detailed explanations, intuitions, pseudocode, and examples designed to teach the material from first principles.*
