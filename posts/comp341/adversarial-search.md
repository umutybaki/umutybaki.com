---
title: "Adversarial Search — Comprehensive Study Notes"
date: "2026-04-14"
description: "Self-contained notes on adversarial search covering minimax, alpha-beta pruning, and game-tree search for COMP 341 AI."
---

# Adversarial Search — Comprehensive Study Notes

> **Course:** COMP 341 — Introduction to Artificial Intelligence (Asst. Prof. Barış Akgün, Koç University)
>
> These notes are written to be **self-contained**: you should be able to learn every concept from scratch just by reading them.

---


## 1. Why Adversarial Search?

Up to this point in the course, you've studied search algorithms where a single agent tries to find a path from a start state to a goal state. Think of a robot navigating a maze — nobody is actively trying to stop it. The maze is just sitting there, and the robot explores it.

But what happens when there's an **opponent**? Imagine you're playing chess. You can't just plan a sequence of moves and execute them, because after every move you make, your opponent gets to respond — and they're trying to make you *lose*. This fundamentally changes the nature of the problem.

In regular search, a solution is a **path** — a sequence of actions from start to goal. In adversarial search, a solution is a **strategy** — a plan that specifies what move you should make for *every possible* move your opponent might make. You need to think ahead not just about your own moves, but about how your opponent will react to them.

There's also a practical constraint: **time limits**. In most games, you can't afford to search the entire game tree (it's astronomically large for games like chess). So you need to be smart about it — pruning branches that don't matter and approximating the value of positions you can't fully explore.

This section of the course focuses on two key ideas: pruning states to enable deeper search (alpha-beta pruning), and approximately evaluating how promising a game state is (evaluation functions). More advanced topics like using machine learning or sample-based search (e.g., Monte Carlo Tree Search) are mentioned in the lecture as being outside the scope of this course but are covered in the RL part.

---

## 2. Types of Games

Games can be classified along two dimensions: whether they are **deterministic** or **stochastic**, and whether they have **perfect** or **imperfect** information.

|                          | **Deterministic**                  | **Stochastic**                          |
|--------------------------|------------------------------------|-----------------------------------------|
| **Perfect information**  | chess, checkers, go, othello       | backgammon, monopoly                    |
| **Imperfect information**| battleship, blind tictactoe, kriegspiel | bridge, poker, scrabble, nuclear war |

**Perfect information** means both players can see the entire state of the game at all times. In chess, you can see every piece on the board. In poker, you can't see your opponent's hand — that's imperfect information.

**Deterministic** means the outcome of an action is entirely determined by the current state and the action taken. In chess, when you move a piece, you know exactly what the board will look like. In backgammon, you roll dice — the outcome involves randomness, making it stochastic.

For most of this lecture, we focus on **turn-taking, 2-player, zero-sum games**. The "zero-sum" part is crucial: it means that one player's gain is exactly the other player's loss. If I win (+1), you lose (−1). If we draw, we both get 0. This is a simplification that lets us represent both players' interests with a single number — one player tries to maximize it, the other tries to minimize it.

The ideas we develop here *can* be expanded to multiplayer competitive games and even general games where agents have independent utilities and cooperation, indifference, or competition are all possible. But the 2-player zero-sum case is the cleanest starting point.

---

## 3. Problem Formulation for Deterministic Games

To apply search techniques to games, we need a formal way to describe them. Here are the components:

**State space** $S$: The set of all possible configurations of the game. In tic-tac-toe, a state is a particular arrangement of X's and O's on the board.

**Initial state** $s_0$: Where the game starts — an empty board in tic-tac-toe, the standard piece arrangement in chess.

**Players** $P = \{1, \ldots, N\}$: The agents that take turns. We'll focus on $N = 2$.

**Actions** $A$: The set of legal moves (plays) a player can make. These may depend on both the current state and which player is moving. In chess, the available moves depend on whose turn it is and where the pieces are.

**Transition Model / Successor Function** $(S \times A) \rightarrow S$: Given a state and an action, this tells you the resulting state. If you move your knight from e4 to f6, this function gives you the new board.

**Terminal Test** $g(s) \rightarrow \{\text{true}, \text{false}\}$: Is the game over? This returns true for checkmates, stalemates, filled tic-tac-toe boards, etc.

**Terminal Utilities** $(s \times p) \rightarrow c$: A scalar value for each terminal state and player. In tic-tac-toe: +1 if player X wins, −1 if player O wins, 0 for a draw.

---

## 4. From Single-Agent to Adversarial Trees

### Single-Agent Trees

When there's only one agent (like Pac-Man in a ghost-free world), you build a search tree where every node represents a state, and the agent picks the branch leading to the best outcome. The **value of a state** $V(s)$ is the best achievable outcome (utility) from that state.

For terminal states, $V(s)$ is simply the known utility. For non-terminal states:

$$V(s) = \max_{s' \in \text{children}(s)} V(s')$$

The agent always picks the child with the highest value. Simple.

### Adversarial Game Trees

Now introduce an opponent — say, a ghost in Pac-Man. The tree now has two kinds of levels: levels where *you* choose (you want to maximize your score) and levels where *your opponent* chooses (they want to minimize your score).

The key insight is that at the opponent's levels, you can't assume they'll make the move that's best for *you*. A rational opponent will make the move that's best for *them* — which, in a zero-sum game, is the move that's worst for you.

This leads us to the concept of **minimax values**:

At states under the **agent's control** (MAX nodes):

$$V(s) = \max_{s' \in \text{successors}(s)} V(s')$$

At states under the **opponent's control** (MIN nodes):

$$V(s') = \min_{s \in \text{successors}(s')} V(s)$$

At **terminal states**, $V(s)$ is simply the known utility.

Think of it this way: you're playing a game against someone who is trying to make your life as difficult as possible. You assume the worst case at every opponent's turn and the best case at every one of your turns.

---

## 5. The Minimax Algorithm

### Intuition & Motivation

The Minimax algorithm is the foundational algorithm for adversarial search. The core idea is beautifully simple: **assume your opponent plays optimally, and choose the move that gives you the best guaranteed outcome under that assumption**.

Why "minimax"? Because one player **max**imizes the game value and the other **min**imizes it. The algorithm computes the optimal strategy by working backwards from terminal states, alternating between maximization (your turns) and minimization (opponent's turns).

### Formal Pseudocode

The algorithm uses three mutually recursive functions:

```
function VALUE(state):
    if state is a terminal state: return the state's utility
    if the next agent is MAX: return MAX-VALUE(state)
    if the next agent is MIN: return MIN-VALUE(state)

function MAX-VALUE(state):
    initialize v = -∞
    for each successor of state:
        v = max(v, VALUE(successor))
    return v

function MIN-VALUE(state):
    initialize v = +∞
    for each successor of state:
        v = min(v, VALUE(successor))
    return v
```

To actually pick the best move (not just its value), we use:

```
function GET-BEST-ACTION(state):
    return argmax over a ∈ Actions(state) of VALUE(S(state, a))
```

where $S(\text{state}, a)$ is the transition function that returns the next state after taking action $a$.

Let's break this down line by line:

`VALUE(state)` is the dispatcher — it checks whether we've reached a terminal state (return the utility), or whether it's MAX's turn or MIN's turn, and calls the appropriate function.

`MAX-VALUE(state)` starts with the worst possible value ($-\infty$) and iterates through all successors. For each successor, it recursively computes its value and keeps track of the maximum. This models the maximizing player choosing the best available move.

`MIN-VALUE(state)` is the mirror image — it starts at $+\infty$ and keeps track of the minimum, modeling the minimizing player choosing the worst outcome for MAX.

### Python Implementation

```python
import math
from typing import Any, Callable, List, Tuple

def minimax_decision(state: Any,
                     actions_fn: Callable[[Any], List[Any]],
                     result_fn: Callable[[Any, Any], Any],
                     terminal_test: Callable[[Any], bool],
                     utility_fn: Callable[[Any], float],
                     is_max_turn: Callable[[Any], bool]) -> Any:
    """
    Returns the best action for the current player using minimax search.

    Args:
        state: Current game state
        actions_fn: Returns list of legal actions from a state
        result_fn: Returns new state after taking action from state
        terminal_test: Returns True if state is terminal
        utility_fn: Returns utility value for terminal states
        is_max_turn: Returns True if it's MAX's turn in the given state

    Returns:
        The best action to take from the current state
    """
    best_action = None
    best_value = -math.inf

    for action in actions_fn(state):
        successor = result_fn(state, action)
        value = minimax_value(successor, actions_fn, result_fn,
                              terminal_test, utility_fn, is_max_turn)
        if value > best_value:
            best_value = value
            best_action = action

    return best_action


def minimax_value(state, actions_fn, result_fn,
                  terminal_test, utility_fn, is_max_turn) -> float:
    """Recursively compute the minimax value of a state."""
    if terminal_test(state):
        return utility_fn(state)

    if is_max_turn(state):
        return max_value(state, actions_fn, result_fn,
                         terminal_test, utility_fn, is_max_turn)
    else:
        return min_value(state, actions_fn, result_fn,
                         terminal_test, utility_fn, is_max_turn)


def max_value(state, actions_fn, result_fn,
              terminal_test, utility_fn, is_max_turn) -> float:
    """Compute value for MAX player — wants to maximize."""
    v = -math.inf
    for action in actions_fn(state):
        successor = result_fn(state, action)
        v = max(v, minimax_value(successor, actions_fn, result_fn,
                                 terminal_test, utility_fn, is_max_turn))
    return v


def min_value(state, actions_fn, result_fn,
              terminal_test, utility_fn, is_max_turn) -> float:
    """Compute value for MIN player — wants to minimize."""
    v = math.inf
    for action in actions_fn(state):
        successor = result_fn(state, action)
        v = min(v, minimax_value(successor, actions_fn, result_fn,
                                 terminal_test, utility_fn, is_max_turn))
    return v


# ---- DEMO: Simple game tree from the lecture slides ----
# Tree: MAX at root A, three children B, C, D (MIN nodes)
# Each MIN node has 3 terminal children
# Terminal values: B->[3,12,8], C->[2,4,6], D->[14,5,2]

def demo_minimax():
    """
    Demonstrates minimax on the lecture's simple example.
    """
    # Encode the tree as a dictionary
    tree = {
        'A': {'children': ['B', 'C', 'D'], 'player': 'MAX'},
        'B': {'children': ['B1', 'B2', 'B3'], 'player': 'MIN'},
        'C': {'children': ['C1', 'C2', 'C3'], 'player': 'MIN'},
        'D': {'children': ['D1', 'D2', 'D3'], 'player': 'MIN'},
        'B1': {'value': 3},  'B2': {'value': 12}, 'B3': {'value': 8},
        'C1': {'value': 2},  'C2': {'value': 4},  'C3': {'value': 6},
        'D1': {'value': 14}, 'D2': {'value': 5},  'D3': {'value': 2},
    }

    def actions(state):
        if 'children' in tree[state]:
            return tree[state]['children']
        return []

    def result(state, action):
        return action  # children are directly the next states

    def terminal(state):
        return 'value' in tree[state]

    def utility(state):
        return tree[state]['value']

    def is_max(state):
        return tree[state].get('player') == 'MAX'

    # Compute minimax values for all nodes
    for node in ['B', 'C', 'D']:
        val = minimax_value(node, actions, result, terminal, utility, is_max)
        print(f"  MIN node {node}: minimax value = {val}")

    root_val = minimax_value('A', actions, result, terminal, utility, is_max)
    print(f"  MAX node A: minimax value = {root_val}")

    best = minimax_decision('A', actions, result, terminal, utility, is_max)
    print(f"  Best action for MAX at A: go to {best}")


if __name__ == "__main__":
    print("=== Minimax Demo (Lecture Example) ===")
    demo_minimax()
    # Expected output:
    #   MIN node B: minimax value = 3
    #   MIN node C: minimax value = 2
    #   MIN node D: minimax value = 2
    #   MAX node A: minimax value = 3
    #   Best action for MAX at A: go to B
```

---

## 6. Minimax Worked Example

Let's trace through the lecture's example step-by-step. The game tree has:

- **Root (A)**: MAX node with 3 actions ($a_1, a_2, a_3$) leading to B, C, D
- **B, C, D**: MIN nodes, each with 3 actions leading to terminal states
- **Terminal values**: B → [3, 12, 8], C → [2, 4, 6], D → [14, 5, 2]

**Step 1: Start at A (MAX).** We call `max-value(A)`, which sets $v = -\infty$. We need to evaluate each child.

**Step 2: Evaluate B (MIN).** We call `min-value(B)`, which sets $v = +\infty$. Then:
- Look at $b_1$ → terminal, value = 3. Now $v = \min(+\infty, 3) = 3$
- Look at $b_2$ → terminal, value = 12. Now $v = \min(3, 12) = 3$
- Look at $b_3$ → terminal, value = 8. Now $v = \min(3, 8) = 3$
- Return 3. (**MIN picks the smallest: 3**)

**Step 3: Back at A.** Now $v = \max(-\infty, 3) = 3$. Move to next child.

**Step 4: Evaluate C (MIN).** Set $v = +\infty$.
- $c_1$ → 2. $v = 2$
- $c_2$ → 4. $v = \min(2, 4) = 2$
- $c_3$ → 6. $v = \min(2, 6) = 2$
- Return 2. (**MIN picks 2**)

**Step 5: Back at A.** $v = \max(3, 2) = 3$. Still 3. Move on.

**Step 6: Evaluate D (MIN).** Set $v = +\infty$.
- $d_1$ → 14. $v = 14$
- $d_2$ → 5. $v = \min(14, 5) = 5$
- $d_3$ → 2. $v = \min(5, 2) = 2$
- Return 2. (**MIN picks 2**)

**Step 7: Back at A.** $v = \max(3, 2) = 3$.

**Result:** The minimax value of A is **3**, and the best action is $a_1$ (going to B).

The key insight: even though B has a terminal state with value 12, MIN won't let MAX reach it. MIN will choose the action leading to value 3. But that's still better than what MAX can guarantee through C (value 2) or D (value 2).

Note that MIN has not actually played yet — we've just *simulated* what a rational MIN would do, and chose $a_1$ based on that simulation. These computed values at intermediate nodes are called the **minimax values**.

---

## 7. Minimax Properties & Analysis

**Completeness:** Yes, minimax is complete *if the game tree is finite*. It will always find a decision. If the game tree is infinite (which can happen with games that allow repeated states), the algorithm won't terminate.

**Optimality:** Yes — *if the opponent plays optimally*. But what if the opponent is not optimal? The lecture asks this interesting question. The answer: minimax is still a good strategy! If the opponent makes mistakes (plays suboptimally), the minimax player will do *even better* than the minimax value predicts. In other words, the minimax value is a **lower bound** on what you'll actually get — you'll always get at least as much as if the opponent were perfect.

Consider this example from the slides: a MAX node with two MIN children, terminal values [10, 10] and [9, 100]. The minimax value of the root is $\max(\min(10,10), \min(9,100)) = \max(10, 9) = 10$. MAX picks the left branch. If the opponent were suboptimal and somehow picked 100 instead of 9 on the right side, MAX would have been better off going right — but minimax didn't account for that because it conservatively assumes the worst.

**Time Complexity:** $O(b^m)$ where $b$ is the branching factor (number of legal moves per state) and $m$ is the maximum depth of the tree. This is the same as DFS, which makes sense — minimax *is* essentially a DFS of the game tree.

**Space Complexity:** $O(bm)$ — again same as DFS, because we only need to keep one path from root to the current node in memory, plus the siblings at each level.

**The problem in practice:** For chess, $b \approx 35$ and $m \approx 100$. That means $35^{100}$ nodes — a number so large it's beyond astronomical. We clearly can't explore the entire tree. This motivates the next two ideas: alpha-beta pruning and depth-limited search.

---

## 8. Alpha-Beta Pruning

### Intuition & Motivation

Most games are far too large to explore every possible continuation. Alpha-beta pruning is a technique that allows us to skip (prune) branches of the game tree that *cannot possibly affect the final decision*, without changing the result at the root.

The core insight is: if you've already found a move that guarantees you a certain value, you don't need to keep looking at alternatives that your opponent can force to be worse.

Think of it like house shopping. You find a house for $300K. The next house's first floor is terrible (worth only $200K), and you haven't even seen the second floor yet. It doesn't matter how nice the second floor is — the house is already worse than the first one. You can skip it.

### The Alpha and Beta Values

Instead of just tracking one minimax value, alpha-beta pruning maintains two values:

- $\alpha$ (**alpha**): The best value that **MAX** can guarantee so far along the current path from root. Initially $-\infty$.
- $\beta$ (**beta**): The best value that **MIN** can guarantee so far along the current path from root. Initially $+\infty$.

These values get updated as the search progresses and are passed down the tree. The pruning rule is:

- At a **MAX node**: if you find a successor with value $\geq \beta$, stop searching (prune). Why? Because MIN already has a better option available elsewhere, so MIN would never let the game reach this node.
- At a **MIN node**: if you find a successor with value $\leq \alpha$, stop searching (prune). Why? Because MAX already has a better option available elsewhere, so MAX would never choose this path.

### Formal Pseudocode

```
function MAX-VALUE(state, α, β):
    initialize v = -∞
    for each successor of state:
        v = max(v, VALUE(successor, α, β))
        if v ≥ β: return v          ← prune!
        α = max(α, v)
    return v

function MIN-VALUE(state, α, β):
    initialize v = +∞
    for each successor of state:
        v = min(v, VALUE(successor, α, β))
        if v ≤ α: return v          ← prune!
        β = min(β, v)
    return v
```

The `VALUE` function dispatches to `MAX-VALUE` or `MIN-VALUE` as before, but now passes $\alpha$ and $\beta$ along. The initial call is `VALUE(root, -∞, +∞)`.

### Python Implementation

```python
import math
from typing import Any, Callable, List, Optional, Tuple


def alpha_beta_decision(state: Any,
                        actions_fn: Callable[[Any], List[Any]],
                        result_fn: Callable[[Any, Any], Any],
                        terminal_test: Callable[[Any], bool],
                        utility_fn: Callable[[Any], float],
                        is_max_turn: Callable[[Any], bool]) -> Any:
    """
    Returns the best action using alpha-beta pruning.
    """
    best_action = None
    alpha = -math.inf
    beta = math.inf
    best_value = -math.inf

    for action in actions_fn(state):
        successor = result_fn(state, action)
        value = ab_value(successor, alpha, beta, actions_fn, result_fn,
                         terminal_test, utility_fn, is_max_turn)
        if value > best_value:
            best_value = value
            best_action = action
        alpha = max(alpha, best_value)

    return best_action


def ab_value(state, alpha, beta, actions_fn, result_fn,
             terminal_test, utility_fn, is_max_turn) -> float:
    """Dispatch to max or min value with alpha-beta bounds."""
    if terminal_test(state):
        return utility_fn(state)
    if is_max_turn(state):
        return ab_max_value(state, alpha, beta, actions_fn, result_fn,
                            terminal_test, utility_fn, is_max_turn)
    else:
        return ab_min_value(state, alpha, beta, actions_fn, result_fn,
                            terminal_test, utility_fn, is_max_turn)


def ab_max_value(state, alpha, beta, actions_fn, result_fn,
                 terminal_test, utility_fn, is_max_turn) -> float:
    """MAX player with alpha-beta pruning."""
    v = -math.inf
    for action in actions_fn(state):
        successor = result_fn(state, action)
        v = max(v, ab_value(successor, alpha, beta, actions_fn, result_fn,
                            terminal_test, utility_fn, is_max_turn))
        if v >= beta:
            return v  # Beta cutoff — MIN won't allow this
        alpha = max(alpha, v)
    return v


def ab_min_value(state, alpha, beta, actions_fn, result_fn,
                 terminal_test, utility_fn, is_max_turn) -> float:
    """MIN player with alpha-beta pruning."""
    v = math.inf
    for action in actions_fn(state):
        successor = result_fn(state, action)
        v = min(v, ab_value(successor, alpha, beta, actions_fn, result_fn,
                            terminal_test, utility_fn, is_max_turn))
        if v <= alpha:
            return v  # Alpha cutoff — MAX won't choose this path
        beta = min(beta, v)
    return v


# ---- DEMO ----
def demo_alpha_beta():
    """Demonstrates alpha-beta on the lecture's example."""
    tree = {
        'A': {'children': ['B', 'C', 'D'], 'player': 'MAX'},
        'B': {'children': ['B1', 'B2', 'B3'], 'player': 'MIN'},
        'C': {'children': ['C1', 'C2', 'C3'], 'player': 'MIN'},
        'D': {'children': ['D1', 'D2', 'D3'], 'player': 'MIN'},
        'B1': {'value': 3},  'B2': {'value': 12}, 'B3': {'value': 8},
        'C1': {'value': 2},  'C2': {'value': 4},  'C3': {'value': 6},
        'D1': {'value': 14}, 'D2': {'value': 5},  'D3': {'value': 2},
    }

    nodes_visited = [0]  # mutable counter

    def actions(s):
        return tree[s].get('children', [])

    def result(s, a):
        return a

    def terminal(s):
        nodes_visited[0] += 1
        return 'value' in tree[s]

    def utility(s):
        return tree[s]['value']

    def is_max(s):
        return tree[s].get('player') == 'MAX'

    best = alpha_beta_decision('A', actions, result, terminal, utility, is_max)
    print(f"  Best action: go to {best}")
    print(f"  Nodes visited: {nodes_visited[0]}")


if __name__ == "__main__":
    print("=== Alpha-Beta Demo ===")
    demo_alpha_beta()
```

---

## 9. Alpha-Beta Worked Example

Let's trace through the same tree: A (MAX) → B, C, D (MIN), terminal values B→[3,12,8], C→[2,4,6], D→[14,5,2].

We annotate each node with an $[\alpha, \beta]$ window.

**Start:** `MAX-VALUE(A, α=-∞, β=+∞)`

**Explore B (MIN), passing $[\alpha=-\infty, \beta=+\infty]$:**
- B starts with $v = +\infty$
- $b_1 = 3$: $v = \min(+\infty, 3) = 3$. Check: $v \leq \alpha$? $3 \leq -\infty$? No. Update $\beta = \min(+\infty, 3) = 3$. Window is now $[-\infty, 3]$.
- $b_2 = 12$: $v = \min(3, 12) = 3$. No pruning. $\beta$ stays 3.
- $b_3 = 8$: $v = \min(3, 8) = 3$. No pruning.
- **B returns 3.** Note: MIN would not choose $b_2=12$ or $b_3=8$ — they're circled in the slides as "min would not choose these."

**Back at A:** $v = \max(-\infty, 3) = 3$. Update $\alpha = \max(-\infty, 3) = 3$. Window is now $[3, +\infty]$.

**Explore C (MIN), passing $[\alpha=3, \beta=+\infty]$:**
- C starts with $v = +\infty$, window $[-\infty, 2]$ after first child
- $c_1 = 2$: $v = \min(+\infty, 2) = 2$. Check: $v \leq \alpha$? $2 \leq 3$? **YES! PRUNE!** Return 2 immediately.
- We never look at $c_2$ or $c_3$!

Why does this work? MAX already knows it can get 3 (via B). C's first child gives 2, and since C is a MIN node, the value can only go *down* from here (MIN might find something even smaller). So C will return at most 2, which is worse than the 3 MAX already has. MAX will never choose C. No point exploring further.

**Back at A:** $v = \max(3, 2) = 3$. $\alpha$ stays 3. Window still $[3, +\infty]$.

**Explore D (MIN), passing $[\alpha=3, \beta=+\infty]$:**
- Same logic applies. $d_1 = 14$, $v = 14$, $\beta = 14$, no prune.
- $d_2 = 5$, $v = 5$, $\beta = 5$, no prune ($5 > 3$).
- $d_3 = 2$, $v = 2$. Check: $v \leq \alpha$? $2 \leq 3$? **YES! PRUNE!** Return 2.

**Back at A:** $v = \max(3, 2) = 3$. Final answer: **minimax value = 3, best action = $a_1$ (go to B).**

**Total savings:** We saved ourselves from looking at 2 nodes ($c_2, c_3$ were pruned at C; and the early return at D saved examining beyond $d_3$). In this small example the savings are modest, but in more complex games, pruning can be enormous.

---

## 10. Alpha-Beta Properties

**Correctness:** Alpha-beta pruning has **no effect** on the minimax value computed for the root. It produces the exact same answer as full minimax. It just does it faster by skipping provably irrelevant subtrees.

**Caveat — Wrong intermediate values:** While the root value is always correct, the values of intermediate nodes might be wrong. This is because some children of internal nodes might get pruned before their true minimax value is computed. The lecture shows an example: with terminal values [3, 8, 2, 1], full minimax gives MIN node 1 a value of 3 and MIN node 2 a value of 1. With alpha-beta, the right MIN node might get value 2 (because node with value 1 gets pruned) — but the root still correctly returns 3.

**Move ordering matters:** The effectiveness of pruning depends heavily on the order in which children are explored. If you happen to explore the *best* moves first, alpha-beta can prune much more aggressively.

**With perfect ordering** (always exploring the best move first):
- Time complexity drops from $O(b^m)$ to $O(b^{m/2})$
- This effectively **doubles the solvable depth** — you can search twice as deep in the same amount of time!
- Intuitively: instead of exploring all $b$ children at each of $m$ levels, you only need to fully explore $\sqrt{b}$ at each level

Even with perfect ordering, full search of big games like chess remains hopeless, but the improvement is still dramatic.

**Metareasoning:** Alpha-beta is a simple example of *metareasoning* — computing about what to compute. Instead of blindly evaluating every node, we reason about which nodes are worth evaluating.

---

## 11. Resource Limits & Depth-Limited Search

### The Problem

Even with alpha-beta pruning, we can't search all the way to terminal states in realistic games. Chess with $b \approx 35$ and $m \approx 100$ means $O(b^{m/2}) = O(35^{50})$ — still impossibly large.

### The Solution: Depth-Limited Search

The idea is simple: instead of searching all the way to the bottom of the tree, we **stop at a certain depth** and use an **evaluation function** to estimate the value of the non-terminal states we've reached.

So instead of using actual terminal utilities at the leaves, we replace them with $\text{Eval}(s)$ — a heuristic estimate of how good the position is.

This means we lose **optimality** — our evaluation function is just an approximation, so we might not find the truly best move. But we can actually play games in real time, which is the whole point.

### Practical Numbers

Say we have 100 seconds per move and can explore 10,000 nodes per second. That's $10^6$ nodes per move. Since $10^6 \approx 35^{8/2} = 35^4$, alpha-beta can search to about depth 8. This is enough for a decent chess program!

### Iterative Deepening

A clever technique is to use **iterative deepening**: first search to depth 1, then depth 2, then depth 3, and so on. If you run out of time, you return the best move found at the deepest completed level. This gives you an **anytime algorithm** — it always has an answer ready, and the answer gets better the more time you give it.

### Depth Matters

A crucial insight: **searching deeper is always better**, even with an imperfect evaluation function. The deeper you search, the less the quality of the evaluation function matters, because you're relying more on actual game tree structure and less on approximation. There's a fundamental tradeoff between the complexity of the evaluation function (how accurate it is) and the complexity of the computation (how deep you can search). Often, a simpler but faster evaluation function that lets you search deeper outperforms a more accurate but slower one.

---

## 12. Evaluation Functions

### What Are They?

An evaluation function $\text{Eval}(s)$ assigns a numerical score to a non-terminal game state, estimating how favorable it is for the MAX player. Ideally, this would be the actual minimax value of the position — but computing that requires searching all the way to terminal states, which is exactly what we're trying to avoid.

### Design Principles

Like heuristics in search, evaluation functions require **domain knowledge**. The most common approach is a **weighted linear combination of features**:

$$\text{Eval}(s) = w_1 f_1(s) + w_2 f_2(s) + \cdots + w_n f_n(s) = \sum_{i} w_i f_i(s)$$

Each $f_i(s)$ extracts some measurable property of the game state, and each $w_i$ is a weight indicating how important that feature is.

### Chess Example

For chess, typical features might include:

- $f_1(s)$ = (number of white queens) − (number of black queens)
- $f_2(s)$ = (white's sum of piece values) − (black's sum of piece values)
- $f_3(s)$ = (quality of white's pawn structure)
- $f_4(s)$ = (king safety)

A position where black has much more material might get $\text{Eval}(s) = -5.6$ (bad for white), while a more balanced position might get $\text{Eval}(s) = 1.2$ (slightly favoring white).

### Do Exact Values Matter?

An important observation from the lecture: the **actual numerical values** of the evaluation function don't matter — only the **relative ordering** does. Consider two trees where the terminal values are [1, 2, 2, 4] vs [1, 20, 20, 400]. In both cases, MAX picks the same action (go right, getting min = 2 or min = 20 respectively). The decision is the same because the ranking of options is preserved.

This means our evaluation function doesn't need to predict exact minimax values; it just needs to correctly rank positions from best to worst.

---

## 13. Stochastic Games & Expectiminimax

### Introducing Randomness

Not all games are deterministic. In games like backgammon, dice rolls introduce randomness. In Pac-Man, ghosts might move randomly. The stochasticity can come from several sources: explicit randomness (dice, card shuffles), unpredictable opponents (random ghosts), or failed actions (a robot's wheels slipping).

### Game Tree Structure with Chance Nodes

In a stochastic game, the game tree has a new type of node: **chance nodes**. The structure alternates like this:

1. **MAX** takes an action
2. **CHANCE** — a random event occurs (e.g., dice roll) with known probabilities
3. **MIN** takes an action
4. **CHANCE** — another random event
5. **MAX** takes an action
6. ... and so on until a terminal state

For backgammon, after MAX chooses a move, MIN rolls the dice (21 possible outcomes with probabilities like 1/36 for doubles, 1/18 for non-doubles), then MIN chooses a move, then MAX rolls the dice, and so on.

### Computing Values

The key question: what should the value of a chance node be? Not the best case (that's MAX's job), not the worst case (that's MIN's job), but the **average case** — the expected value, weighted by the probabilities of each outcome.

$$V(\text{chance node}) = \sum_{i} P(\text{outcome}_i) \times V(\text{child}_i)$$

MAX and MIN nodes keep their normal behavior. This gives us the **Expectiminimax** algorithm.

### Expectiminimax Pseudocode

```
function VALUE(state):
    if terminal: return utility
    if next agent is MAX: return MAX-VALUE(state)
    if next agent is MIN: return MIN-VALUE(state)
    if next agent is CHANCE: return EXP-VALUE(state)

function EXP-VALUE(state):
    initialize v = 0
    for each action a of state:
        p = probability(S(s, a))
        v += p * VALUE(S(s, a))
    return v
```

### Python Implementation

```python
import math
from typing import Any, Callable, Dict, List, Tuple


def expectiminimax_value(state: Any,
                         actions_fn: Callable,
                         result_fn: Callable,
                         terminal_test: Callable,
                         utility_fn: Callable,
                         node_type_fn: Callable,
                         probability_fn: Callable) -> float:
    """
    Compute the expectiminimax value of a state.

    Args:
        state: Current game state
        actions_fn: Returns list of actions/outcomes from state
        result_fn: Returns new state after action
        terminal_test: Returns True if state is terminal
        utility_fn: Returns utility for terminal states
        node_type_fn: Returns 'MAX', 'MIN', or 'CHANCE'
        probability_fn: Returns probability of a chance outcome
    """
    if terminal_test(state):
        return utility_fn(state)

    ntype = node_type_fn(state)

    if ntype == 'MAX':
        v = -math.inf
        for action in actions_fn(state):
            successor = result_fn(state, action)
            v = max(v, expectiminimax_value(
                successor, actions_fn, result_fn,
                terminal_test, utility_fn, node_type_fn, probability_fn))
        return v

    elif ntype == 'MIN':
        v = math.inf
        for action in actions_fn(state):
            successor = result_fn(state, action)
            v = min(v, expectiminimax_value(
                successor, actions_fn, result_fn,
                terminal_test, utility_fn, node_type_fn, probability_fn))
        return v

    else:  # CHANCE
        v = 0.0
        for action in actions_fn(state):
            successor = result_fn(state, action)
            p = probability_fn(state, action)
            v += p * expectiminimax_value(
                successor, actions_fn, result_fn,
                terminal_test, utility_fn, node_type_fn, probability_fn)
        return v


# ---- DEMO: Lecture's expectiminimax example ----
def demo_expectiminimax():
    """
    Tree: MAX -> two CHANCE nodes, each with p=0.5 leading to MIN nodes.
    Left chance:  MIN nodes with terminals [2,4] and [7,4]
    Right chance: MIN nodes with terminals [6,0] and [5,-2]
    """
    tree = {
        'root':   {'type': 'MAX',    'children': ['CL', 'CR']},
        'CL':     {'type': 'CHANCE', 'children': [('ML1', 0.5), ('ML2', 0.5)]},
        'CR':     {'type': 'CHANCE', 'children': [('MR1', 0.5), ('MR2', 0.5)]},
        'ML1':    {'type': 'MIN',    'children': ['T1', 'T2']},
        'ML2':    {'type': 'MIN',    'children': ['T3', 'T4']},
        'MR1':    {'type': 'MIN',    'children': ['T5', 'T6']},
        'MR2':    {'type': 'MIN',    'children': ['T7', 'T8']},
        'T1': {'value': 2},  'T2': {'value': 4},
        'T3': {'value': 7},  'T4': {'value': 4},
        'T5': {'value': 6},  'T6': {'value': 0},
        'T7': {'value': 5},  'T8': {'value': -2},
    }

    def actions(s):
        info = tree[s]
        if 'children' not in info:
            return []
        if info['type'] == 'CHANCE':
            return [c[0] for c in info['children']]
        return info['children']

    def result(s, a):
        return a

    def terminal(s):
        return 'value' in tree[s]

    def utility(s):
        return tree[s]['value']

    def node_type(s):
        return tree[s].get('type', 'MAX')

    def prob(s, a):
        if tree[s]['type'] == 'CHANCE':
            for child, p in tree[s]['children']:
                if child == a:
                    return p
        return 1.0

    # Trace through:
    # MIN nodes: ML1=min(2,4)=2, ML2=min(7,4)=4, MR1=min(6,0)=0, MR2=min(5,-2)=-2
    # CHANCE: CL = 0.5*2 + 0.5*4 = 3, CR = 0.5*0 + 0.5*(-2) = -1
    # MAX: root = max(3, -1) = 3, pick left

    val = expectiminimax_value('root', actions, result, terminal,
                               utility, node_type, prob)
    print(f"  Root expectiminimax value: {val}")
    print(f"  Expected: 3 (MAX picks left branch)")


if __name__ == "__main__":
    print("=== Expectiminimax Demo ===")
    demo_expectiminimax()
```

---

## 14. Expectiminimax Worked Example

Let's trace through the lecture's expectiminimax example step by step.

**Tree structure:** MAX → two CHANCE nodes (left and right). Each CHANCE node has two outcomes with probability 0.5 each, leading to MIN nodes. MIN nodes have two terminal children each.

**Terminal values:**
- Left CHANCE → Left MIN: [2, 4], Right MIN: [7, 4]
- Right CHANCE → Left MIN: [6, 0], Right MIN: [5, −2]

**Step 1: Evaluate MIN nodes (bottom up).**
- Left-Left MIN: $\min(2, 4) = 2$
- Left-Right MIN: $\min(7, 4) = 4$
- Right-Left MIN: $\min(6, 0) = 0$
- Right-Right MIN: $\min(5, -2) = -2$

**Step 2: Evaluate CHANCE nodes.**
- Left CHANCE: $0.5 \times 2 + 0.5 \times 4 = 1 + 2 = 3$
- Right CHANCE: $0.5 \times 0 + 0.5 \times (-2) = 0 + (-1) = -1$

**Step 3: Evaluate MAX (root).**
- $\max(3, -1) = 3$

**Result:** MAX picks the left action with expected value 3.

The chance nodes represent the uncertainty — you don't know which random outcome will occur, but on average, the left branch gives you an expected value of 3, while the right gives −1. A rational player picks left.

---

## 15. Summary & Comparison Table

| Property | Minimax | Alpha-Beta Pruning | Depth-Limited + Eval | Expectiminimax |
|---|---|---|---|---|
| **Game type** | Deterministic, zero-sum | Deterministic, zero-sum | Deterministic, zero-sum | Stochastic, zero-sum |
| **Complete?** | Yes (finite tree) | Yes (finite tree) | No (cuts off early) | Yes (finite tree) |
| **Optimal?** | Yes (vs optimal opponent) | Yes (same as minimax) | No (eval is approximate) | Yes (vs optimal opponent + known probabilities) |
| **Time** | $O(b^m)$ | $O(b^{m/2})$ best case | Depends on depth limit $d$: $O(b^d)$ | $O(b^m \cdot n^m)$ where $n$ = chance outcomes |
| **Space** | $O(bm)$ | $O(bm)$ | $O(bd)$ | $O(bm)$ |
| **Key idea** | Assume optimal opponent, alternate max/min | Skip provably irrelevant branches | Trade optimality for tractability with heuristic eval | Average over random outcomes at chance nodes |
| **Pruning possible?** | No built-in pruning | Yes — that's the whole point | Yes (combine with alpha-beta) | More difficult (values matter, not just ordering) |

### Key Takeaways

The lecture builds a progression of ideas, each solving a limitation of the previous one. We start with minimax, which gives us the theoretically optimal strategy but is too slow for real games. Alpha-beta pruning dramatically reduces the search space without sacrificing correctness at the root. Depth-limited search with evaluation functions makes the algorithm practical by trading optimality for speed. And expectiminimax extends the framework to handle stochastic games with chance elements.

Together, these techniques form the backbone of classical game-playing AI. More modern approaches (like Monte Carlo Tree Search used in AlphaGo, or deep reinforcement learning) build on these foundations — but understanding minimax, alpha-beta, and evaluation functions is essential groundwork.

---

*These notes cover all material from the COMP 341 Adversarial Search lecture (75 slides). Good luck studying!*
