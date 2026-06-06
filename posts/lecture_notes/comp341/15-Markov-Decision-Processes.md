---
title: "15 - Markov Decision Processes"
date: "2026-05-25"
description: "Course: COMP341 - Introduction to Artificial Intelligence, Koç University"
---

# 15 - Markov Decision Processes

**Course**: COMP341 - Introduction to Artificial Intelligence, Koç University  
**Topic**: Making Sequential Decisions under Action Uncertainty



## 1 Motivation Why Not Just Search

In previous lectures we studied classical search (BFS, DFS, A*) where the world is **deterministic**: you choose "go North" and you go North. But many real-world problems are fundamentally **stochastic** - the outcome of your action is uncertain.

### The Grid World Our Running Example

Imagine a small grid (say 3x4) where an agent lives. There are walls, a goal square (reward +1), and a trap square (reward -1). The agent moves around and wants to reach the goal.

Here is the key twist: **actions are noisy**.
- If you choose action **North**, 80% of the time you actually move North.
- 10% of the time you drift West.
- 10% of the time you drift East.
- If the intended direction has a wall, you stay put.

This is called a **stochastic action model** (also called noisy movement).

### Why Not Standard Search

- **Deterministic search** assumes a fixed outcome for each action - invalid here.
- **Expectimax with replanning**: You could run expectimax at every step, but this is computationally expensive, visits the same states repeatedly, and faces an infinite search tree if there is no guaranteed termination.

The key insight: we need a **policy** - a complete mapping from every state to the best action in that state - computed once, so the agent can act immediately without re-planning. Markov Decision Processes give us exactly this framework.


## 2 From Search to Sequential Decisions

Recall the framework for rational agents:

> A rational agent chooses actions that **maximize its expected utility** given its knowledge.

For sequential decision-making:
- The agent receives **rewards** as feedback from the environment.
- The agent's utility is defined by a **reward function**.
- The goal is to **maximize expected cumulative rewards over time**.

Examples:
- Playing chess: reward +1 for winning, -1 for losing (at the end).
- Vacuuming a room: +1 for each piece of dirt picked up.
- Self-driving taxi: +1 for each passenger successfully delivered.

Decision Networks (covered earlier) handled **single or temporally unrelated decisions**. MDPs handle **sequential decisions** - each action affects the next state, and you make many decisions in sequence.


## 3 Markov Chains A Quick Recap

Before MDPs, recall **Markov Chains**. A Markov Chain has:
- A set of **states** (e.g., {rain, sun}).
- A **transition model**: probabilities of moving from one state to another.
- An **initial distribution** over states.

Example:
```
        0.9 (stay sunny)
sun  <──────────────── sun
sun  ────────────────> rain   (probability 0.1)
rain ────────────────> sun    (probability 0.3)
rain <──────────────── rain   (probability 0.7)
```

In a Markov Chain, you have **no control** - the chain just evolves probabilistically.

Now imagine you **invented a weather machine** that lets you influence the weather. You have actions (e.g., "push toward sunny"), but they cost energy (negative reward). You want to keep it sunny (positive reward). You must make **decisions** at each step.

That is exactly an MDP: a Markov Chain where you also choose actions, and you care about accumulated rewards.


## 4 Markov Decision Processes The Formal Definition

An MDP is defined by the tuple **(S, A, T, R, gamma)** (plus a start state):

| Component | Symbol | Meaning |
| :--- | :--- | :--- |
| States | S | A finite set of all possible states the agent can be in |
| Actions | A | A finite set of all possible actions the agent can take |
| Transition Function | T(s, a, s') = P(s' given s, a) | Probability of landing in state s' after taking action a in state s |
| Reward Function | R(s, a, s') | Reward received for transitioning from s via a to s' |
| Discount Factor | gamma in [0, 1] | How much we discount future rewards relative to immediate ones |

Additionally:
- A **start state** (or distribution over start states).
- Optionally, **terminal states** where the episode ends.

### Variations on the Reward Function

You will see R written several ways in different textbooks - they are all equivalent simplifications:
- **R(s, a, s')**: Most general - reward depends on current state, action taken, and next state.
- **R(s, a)**: Reward depends only on current state and action (not the outcome).
- **R(s)**: Reward depends only on the state you are in (simplest).
- **R(s')**: Reward depends only on the state you land in.

All formulations can represent the same problems, just with different bookkeeping.

### The MDP Search Tree

Think of an MDP as projecting an **expectimax-like tree**:

```text
          s          <- current state
         / \
        a1   a2      <- agent chooses action (MAX node)
       /       \
    (s,a1)    (s,a2) <- "q-state": committed to action but haven't seen outcome
     / \        ...
  s'1  s'2          <- nature chooses next state (CHANCE node)
                       probability T(s,a,s'), reward R(s,a,s') received here
```

The **q-state (s, a)** represents the situation after committing to action a from state s but before the stochastic outcome is determined. This is why Q-values are sometimes called "q-state values."


## 5 The Markov Property in MDPs

Why "Markov"? Because of the **Markov Property**:

> The future is independent of the past, given the present state.

Formally, for the transition probabilities:

```
P(S_{t+1} = s' | S_t = s_t, A_t = a_t, S_{t-1} = s_{t-1}, ..., S_0 = s_0)
    = P(S_{t+1} = s' | S_t = s_t, A_t = a_t)
```

In plain English: **it does not matter how you got to state s** - what matters for predicting the next state is only the current state s and the current action a.

This is a strong but often realistic assumption. It is analogous to classical search where the successor function only depends on the current node, not the history of how you reached it.

**Why does this matter?** Without the Markov property, you would need to remember the entire history of states and actions to make a decision. With it, you only need to know where you are right now. This makes the problem tractable.


## 6 Policies What to Do at Every State

In deterministic search, the solution is a **plan**: a sequence of actions from start to goal. Plans are fragile in stochastic environments - if you drift West when you meant to go North, your pre-planned sequence is now wrong.

In MDPs, the solution is a **policy**.

### Definition Policy

A **policy** pi is a function:
```text
pi: S -> A
```
It assigns an action to **every state** in the state space.

A **deterministic policy** says: "In state s, always take action a."  
A **stochastic policy** says: "In state s, take action a with probability p."

### Optimal Policy

An **optimal policy** pi* maximizes the expected cumulative (discounted) reward when followed from any state.

This is much richer than a plan - it tells the agent what to do even in states it never expected to reach. The agent becomes a **reflex agent**: given the current state, look up the policy table and execute the action.

### How the Living Reward Changes the Optimal Policy

The structure of the optimal policy changes dramatically with the living reward R(s):

- **R(s) = -0.01** (small negative living reward): Agent prefers to reach the goal quickly but does not take excessive risks. It navigates toward the goal along safe paths.
- **R(s) = -0.03** (more negative): Agent is more willing to risk the trap to reach the goal faster. Some states near the trap start pointing directly toward the goal.
- **R(s) = -0.4** (strongly negative): The agent is so penalized for existing that it prefers to fall into the trap rather than take long safe paths.
- **R(s) = -2.0** (extremely negative): The agent immediately jumps into the nearest terminal state, even the trap.

This shows that reward function design is critical - small changes lead to qualitatively different behaviors.


## 7 Utility Rewards and the Solution Horizon

### Utility of a Sequence of States

As the agent moves through the world, it accumulates a sequence of states: s0, s1, s2, ...  
At each step it receives a reward. What is the **total utility** of this path?

Several options:
1. **Sum of rewards**: U = r0 + r1 + r2 + ... - problematic for infinite sequences (might diverge).
2. **Average reward**: U = (1/n)(r0 + r1 + ... + rn) - loses temporal structure.
3. **Discounted sum**: U = r0 + gamma*r1 + gamma^2*r2 + ... - the standard choice.

### Finite vs Infinite Horizon

**Finite horizon**: The agent must solve the problem in a fixed number of steps T.
- Policies become **non-stationary**: what to do depends on how many steps remain.
- Like depth-limited search.

**Infinite horizon**: No step limit.
- Policies are **stationary**: the optimal action depends only on the current state, not on time.
- Much nicer mathematically - the same policy works forever.
- Requires discounting (gamma < 1) to keep total rewards finite.

The distinction matters: with an infinite horizon, pi*(s) is the same function regardless of when you evaluate it. This is the standard MDP setting.


## 8 Discounting Why Future Rewards Are Worth Less

### The Discount Factor gamma in 0 1

The **discounted utility** of a reward sequence is:

```
U([r0, r1, r2, r3, ...]) = r0 + gamma*r1 + gamma^2*r2 + gamma^3*r3 + ...
```

Each step into the future multiplies the reward by another factor of gamma.

### Intuition Why Discount

**Economic analogy**: $100 today is worth more than $100 a year from now (time value of money). You can invest today's $100 and have more tomorrow. Similarly, rewards now are more certain and more valuable than speculative future rewards.

**Uncertainty**: The further into the future, the more uncertain the outcome. Discounting reflects this uncertainty.

**Convergence**: For gamma < 1, even infinite reward sequences have finite total utility:

```text
sum_{t=0}^{infinity} gamma^t * R_max = R_max / (1 - gamma)
```

This is a convergent geometric series. Without gamma < 1, infinite-horizon MDPs might have infinite utility, making comparison of policies impossible.

### Example

With gamma = 0.5 and rewards [1, 2, 3]:
```
U([1, 2, 3]) = 1*1 + 0.5*2 + 0.25*3 = 1 + 1 + 0.75 = 2.75
U([3, 2, 1]) = 1*3 + 0.5*2 + 0.25*1 = 3 + 1 + 0.25 = 4.25
```
U([3, 2, 1]) > U([1, 2, 3]) - getting bigger rewards sooner is better!

### Effect of gamma on Behavior

- **gamma close to 0**: Agent is myopic - only cares about immediate reward. Very short-sighted.
- **gamma close to 1**: Agent is far-sighted - weighs distant future rewards almost as much as immediate ones.
- **gamma = 1**: Agent treats all future rewards equally (only valid with finite horizon or absorbing states).

**Small gamma = shorter effective horizon**: The agent "sees" only a few steps ahead. This also means solutions with few steps are preferred over longer routes, even if the longer route gets a slightly higher total reward.

### Dealing with Infinite Sequences Summary

Three solutions to prevent infinite total utility:
1. **Finite horizon**: Terminate after T steps.
2. **Discounting** (gamma < 1): Geometric decay bounds the sum.
3. **Absorbing states**: Every policy is guaranteed to eventually reach a terminal state.


## 9 Optimal Quantities V Q pi

These three functions are the core of MDP solution theory.

### Vs The Optimal State Value

```
V*(s) = expected total discounted reward starting from state s
         and acting optimally thereafter
```

Intuition: V*(s) answers "How good is it to be in state s, assuming I play perfectly from here on?"

- States near the goal have high V*.
- States near traps have low (possibly negative) V*.
- Terminal states have V* = R(terminal).

Note: **V*(s) is a long-term quantity, not just the immediate reward**. Being adjacent to the goal is valuable because you can reach it quickly. Being in a corner far from the goal is less valuable.

### Qs a The Optimal QValue ActionValue

```
Q*(s, a) = expected total discounted reward starting from state s,
            taking action a first,
            then acting optimally thereafter
```

Intuition: Q*(s, a) answers "How good is it to be in state s and commit to action a, assuming I play optimally after that?"

Q-values capture the value of a specific (state, action) pair, not just the state. They are useful because the optimal action at s is simply:

```text
pi*(s) = argmax_a Q*(s, a)
```

Once you have Q-values, policy extraction is trivial - just pick the action with the highest Q-value at each state.

### pis The Optimal Policy

```
pi*(s) = the optimal action to take in state s
```

This is what we ultimately want. Once computed, the agent just follows this lookup table.

### Relationship Between V Q pi

These three quantities are tightly linked:

```text
V*(s) = max_a Q*(s, a)
           ^--- best Q-value over all actions

Q*(s, a) = sum_{s'} P(s'|s,a) * [R(s,a,s') + gamma * V*(s')]
              ^--- weighted sum of (immediate reward + discounted future value)

pi*(s) = argmax_a Q*(s, a)
       = argmax_a sum_{s'} P(s'|s,a) * [R(s,a,s') + gamma * V*(s')]
```

So: V* is defined in terms of Q*, and Q* is defined in terms of V*. This circularity is exactly what the Bellman equations capture.


## 10 The Bellman Equations

The Bellman equations are the heart of MDP theory. They express the recursive structure of the optimal value function.

### The Bellman Optimality Equation for V

```text
V*(s) = max_a sum_{s'} P(s'|s,a) * [R(s,a,s') + gamma * V*(s')]
```

Read this as:

> "The value of state s is the best action's expected [immediate reward plus discounted value of the next state]."

Or even more simply:

> **Value = immediate reward + discounted future value**

### Deriving It Intuitively

Suppose you are at state s. You can take any action a. For each action:
- You land in state s' with probability P(s'|s,a).
- You immediately get reward R(s,a,s').
- Then you find yourself in state s', which (by definition of V*) is worth V*(s') if played optimally.
- The future value is discounted by gamma because it is one step away.

So the expected value of action a from state s is:
```
Q*(s,a) = sum_{s'} P(s'|s,a) * [R(s,a,s') + gamma * V*(s')]
```

And since you pick the best action:
```text
V*(s) = max_a Q*(s,a)
```

Combining: the full Bellman equation is:
```text
V*(s) = max_a sum_{s'} P(s'|s,a) * [R(s,a,s') + gamma * V*(s')]
```

### Mathematical Derivation via Trajectories

Consider an infinite trajectory sigma = (s0, s1, s2, ...) obtained by following policy pi.

The utility of this trajectory is:
```
U(sigma) = r0 + gamma*r1 + gamma^2*r2 + ...
         = r0 + gamma * U(sigma')
```
where sigma' = (s1, s2, ...) is the "tail" trajectory.

The expected utility of starting in s0 under policy pi is:
```
V^pi(s0) = E[U(sigma)]
          = sum_{s'} P(s'|s0, pi(s0)) * [R(s0, pi(s0), s') + gamma * V^pi(s')]
```

This is the Bellman equation for a **fixed policy** pi. For the **optimal** policy, we replace the fixed action pi(s) with a max over all actions a.

### Why Is This Useful

The Bellman equation is **recursive**: V*(s) is defined in terms of V*(s') for neighboring states. If we knew V* for all neighbors, we could compute V*(s).

This suggests an iterative algorithm: start with arbitrary values, then repeatedly apply the Bellman update until convergence. That algorithm is **Value Iteration**.

### Policy Bellman Equation for a Fixed Policy pi

If we have a **fixed** policy pi (not necessarily optimal):

```
V^pi(s) = sum_{s'} P(s'|s,pi(s)) * [R(s,pi(s),s') + gamma * V^pi(s')]
```

Note: no **max** here - the action is fixed by pi. This is simpler (linear in V^pi) and is used in Policy Evaluation.


## 11 Value Iteration

Value Iteration is the most direct algorithm for computing V*. It iteratively applies the Bellman update until the values converge.

### Algorithm

```text
Algorithm: VALUE ITERATION

Initialize: V_0(s) = 0 for all states s

Repeat until convergence:
    For each state s in S:
        V_{k+1}(s) = max_a sum_{s'} P(s'|s,a) * [R(s,a,s') + gamma * V_k(s')]

Return: V* ~ V_k  (after convergence)
         pi*(s) = argmax_a sum_{s'} P(s'|s,a) * [R(s,a,s') + gamma * V*(s')]
```

### Pseudocode Pythonstyle

```python
def value_iteration(states, actions, transition, reward, gamma, epsilon=1e-6):
    # Initialize all values to 0
    V = {s: 0.0 for s in states}
    
    while True:
        V_new = {}
        delta = 0  # Track max change for convergence check
        
        for s in states:
            # Compute the best Q-value over all actions
            q_values = []
            for a in actions:
                # Expected value of taking action a from state s
                q = sum(
                    transition(s, a, s_prime) * (reward(s, a, s_prime) + gamma * V[s_prime])
                    for s_prime in states
                )
                q_values.append(q)
            
            V_new[s] = max(q_values)
            delta = max(delta, abs(V_new[s] - V[s]))
        
        V = V_new
        
        # Convergence check
        if delta < epsilon * (1 - gamma) / gamma:
            break
    
    return V

def policy_extraction(states, actions, transition, reward, gamma, V):
    policy = {}
    for s in states:
        best_action = max(
            actions,
            key=lambda a: sum(
                transition(s, a, s_prime) * (reward(s, a, s_prime) + gamma * V[s_prime])
                for s_prime in states
            )
        )
        policy[s] = best_action
    return policy
```

### Convergence

**Theorem**: V_k(s) converges to V*(s) as k -> infinity, for all states s.

The convergence criterion used in practice:
```
Stop when: max_s |V_{k+1}(s) - V_k(s)| < epsilon * (1 - gamma) / gamma
```

This guarantees the policy is within epsilon of optimal.

**Intuition for convergence**: Each Bellman update is a contraction mapping (with factor gamma). By the Banach fixed-point theorem, repeated application converges to the unique fixed point V*.

### Complexity

Each iteration of value iteration requires:
- For each state s (|S| states)
- For each action a (|A| actions)
- Sum over all next states s' (|S| states)

So one iteration costs **O(|S|^2 * |A|)**.

### Key Observation Policy Converges Before Values

In practice, the optimal **policy** converges much faster than the **values**. The values might still be changing slightly (say, in the 4th decimal place), but the argmax action at each state stabilizes early. This observation motivates Policy Iteration.


## 12 Worked Example Value Iteration on a Grid World

Let us trace through one step of value iteration on a small 2x2 grid world from the lecture.

### Setup

```text
Grid layout:
  +--------+--------+
  | s(1,1) | s(1,2) |   Row 1
  +--------+--------+
  | s(2,1) | s(2,2) |   Row 2
  +--------+--------+

Rewards:
  R(s11) = -0.04   R(s12) = -0.04
  R(s21) = -0.04   R(s22) = +1.0  <- TERMINAL STATE

Transition model:
  Intended direction: 80% success
  Perpendicular (left of intended): 10%
  Perpendicular (right of intended): 10%
  Hitting a wall: agent stays put

Discount: gamma = 0.5

Initial values (given):
  V0(s11) = 0.1,  V0(s12) = 0.1
  V0(s21) = 0.1,  V0(s22) = 1.0  <- terminal, value fixed
```

We use the simplified Bellman update where R is defined per state:
```text
V_{t+1}(s) = R(s) + gamma * max_a sum_{s'} P(s'|s,a) * V_t(s')
```

### Computing V1s21 BottomLeft State

State s21 has s11 above it and s22 to its right. Below and to the left are walls.

Action **UP** from s21 (intended: go up to s11):
```typescript
  80% -> s11 (up, success) ... wait, UP from row 2 goes to row 1 = s11
  But looking at the lecture: 80% -> s22?
```

Note: In the lecture's coordinate system, s22 is the terminal. The layout has s22 as the top-right or a position directly accessible. Looking at the lecture slide calculation carefully:

For action UP from s21:
```text
  P(s11 | s21, UP) = 0.1   (drift left)
  P(s21 | s21, UP) = 0.1   (drift right -> wall -> stay)
  P(s22 | s21, UP) = 0.8   (UP intended -> s22, the terminal)

Expected value for UP:
  = 0.1 * V0(s11) + 0.1 * V0(s21) + 0.8 * V0(s22)
  = 0.1 * 0.1     + 0.1 * 0.1     + 0.8 * 1.0
  = 0.01 + 0.01 + 0.80
  = 0.82
```

Action **DOWN** from s21:
```
  Wall is below: mostly stays at s21
  = 0.1 * 0.1 + 0.9 * 0.1 + 0.0 * 1.0 = 0.1
```

Action **LEFT** from s21:
```
  Wall to the left: stays put mostly
  = 0.8 * 0.1 + 0.1 * 0.1 + 0.1 * 1.0 = 0.19
```

Action **RIGHT** from s21:
```
  = 0.0 * 0.1 + 0.9 * 0.1 + 0.1 * 1.0 = 0.19
```

Best action is **UP** (expected value 0.82):
```
V1(s21) = R(s21) + gamma * max(0.82, 0.1, 0.19, 0.19)
         = -0.04 + 0.5 * 0.82
         = -0.04 + 0.41
         = 0.37
```

### Computing V1s11 TopLeft State

State s11 is in the corner. Walls are above and to its left. Its neighbors are s12 (right) and s21 (below).

Due to the symmetric corner position, all actions produce similar expected values because the agent mostly bounces between the 0.1-valued states:

For all actions from s11:
```
Expected value ~= 0.1 (all neighboring states have V0 = 0.1)

V1(s11) = R(s11) + gamma * max(0.1, ...)
         = -0.04 + 0.5 * 0.1
         = -0.04 + 0.05
         = 0.01
```

### Computing V1s12 TopRight State

State s12 is adjacent to the terminal s22 (below it or to the right, depending on the grid layout).

Action **RIGHT** from s12 (toward the terminal s22):
```text
  80% -> s22 (terminal, value 1.0)
  10% -> drift one way
  10% -> drift other way

Expected value for RIGHT ~= 0.8 * 1.0 + small contributions = 0.82
```

```
V1(s12) = R(s12) + gamma * 0.82
         = -0.04 + 0.5 * 0.82
         = -0.04 + 0.41
         = 0.37
```

### Summary of Value Propagation

```text
Initial V0:         After step 1 (V1):   After step 5 (V5):
  0.1  | 0.1           0.01  | 0.37        0.12  | 0.376
  -----+------        -------+------       ------+-------
  0.1  | 1.0           0.37  | 1.0         0.376 | 1.0
```

**Key observation**: Values **propagate outward** from the terminal state. States adjacent to the terminal improve first; faraway states take many iterations to absorb the terminal's influence.

This is analogous to how light spreads from a source - the closest regions brighten first, then the signal gradually reaches farther regions.


## 13 Policy Extraction Value Function to Policy

Once we have V* (or a good approximation), we extract the optimal policy using **greedy policy extraction**:

```text
pi*(s) = argmax_a sum_{s'} P(s'|s,a) * [R(s,a,s') + gamma * V*(s')]
```

This is called **one-step lookahead**: for each action, compute the expected immediate reward plus the discounted value of the next state, then pick the best action.

### Worked Example Policy Extraction

From the lecture, with gamma = 0.99 and R(s) = -0.01 (small living penalty).

Given the following converged values in a grid:
```
  0.90  0.93  0.95  | +1.0   (terminal)
  0.88  ----  0.79  | -1.0   (trap)
  0.85  0.83  0.81  | 0.13
```

Consider the state with value 0.88 (row 2, leftmost column). Its neighbors in the grid:
- Above: 0.90
- Below: 0.85
- Right: wall (blocked cell)
- Left: wall (edge)

Actually following the lecture's UP calculation for a specific middle state:

For action **UP**:
```
  0.8 * 0.95 + 0.1 * 0.79 + 0.1 * (-1.0) = 0.76 + 0.079 - 0.1 = 0.739
```

For action **LEFT** (toward 0.79's neighbor):
```
  0.8 * 0.79 + 0.1 * 0.81 + 0.1 * 0.95 = 0.632 + 0.081 + 0.095 = 0.808
```

The best action is **LEFT** (0.808 > 0.739). The policy arrow at this state points LEFT - the agent moves away from the trap risk even though UP appears to go toward higher-value states.

### Why Not Just Pick the HighestValue Neighbor

You might think: "Just move toward the highest-valued neighbor." But because actions are stochastic, you must account for the probability of drifting. Moving toward a valuable state might risk drifting into a trap. The full expectation calculation handles this properly.

This is why states near the trap in the grid world have policies pointing away from it - the 10% drift risk toward -1.0 outweighs the benefit of moving toward +1.0.


## 14 Policy Iteration

Value Iteration has an inefficiency: the **max** in the Bellman update is recomputed at every state every iteration, but the policy (the argmax action) often stabilizes long before the values do.

**Policy Iteration** exploits this by alternating between two phases:
1. **Policy Evaluation**: Given current policy pi, compute V^pi exactly or approximately.
2. **Policy Improvement**: Given V^pi, extract a better policy using greedy policy extraction.

Repeat until the policy does not change.

### Phase 1 Policy Evaluation

Given a fixed policy pi, compute its value function V^pi:

```typescript
V^pi(s) = sum_{s'} P(s'|s,pi(s)) * [R(s,pi(s),s') + gamma * V^pi(s')]
```

Note: no **max** - the action is fixed by pi. This makes the equations linear in V^pi.

Two methods:

**Method 1: Iterative Policy Evaluation**
```text
Initialize V^pi_0(s) = 0 for all s

Repeat until convergence:
    For each state s:
        V^pi_{t+1}(s) = sum_{s'} P(s'|s,pi(s)) * [R(s,pi(s),s') + gamma * V^pi_t(s')]
```
Cost: O(|S|^2) per iteration (only one action per state, not |A|).

**Method 2: Linear System Solution**
The Bellman equations for a fixed policy form a **linear system**:

```
V^pi(s) - gamma * sum_{s'} P(s'|s,pi(s)) * V^pi(s') = sum_{s'} P(s'|s,pi(s)) * R(s,pi(s),s')
```

In matrix form: (I - gamma*P) * V = R  
Solve: V = (I - gamma*P)^{-1} * R

Cost: O(|S|^3) for matrix inversion - expensive for large S, but gives an exact solution.

### Phase 2 Policy Improvement

Given V^pi_t, extract a new policy:
```text
pi_{t+1}(s) = argmax_a sum_{s'} P(s'|s,a) * [R(s,a,s') + gamma * V^pi_t(s')]
```

This is identical to policy extraction from value iteration. The new policy is **guaranteed to be at least as good** as the old one (Policy Improvement Theorem).

### Full Policy Iteration Algorithm

```text
Algorithm: POLICY ITERATION

Initialize: pi_0 (random, or all same action, or from V_0 = 0)

Repeat:
    1. EVALUATION:
       Solve V^{pi_t}(s) = sum_{s'} P(s'|s,pi_t(s)) * [R(s,pi_t(s),s') + gamma * V^{pi_t}(s')]
       (iteratively or via linear system)
    
    2. IMPROVEMENT:
       pi_{t+1}(s) = argmax_a sum_{s'} P(s'|s,a) * [R(s,a,s') + gamma * V^{pi_t}(s')]
    
    3. If pi_{t+1} == pi_t: STOP

Return: pi* = pi_t,  V* = V^{pi_t}
```

### Intuition for Why Policy Iteration Converges Faster

Consider the space of all possible policies. With |S| states and |A| actions, there are |A|^|S| possible deterministic policies - a huge number. Policy Iteration directly jumps between policies, always improving. Value Iteration implicitly does the same thing but takes small numerical steps.

Each policy improvement step is guaranteed to find a strictly better policy (or confirm optimality), so the algorithm terminates in at most |A|^|S| steps. In practice, it terminates in far fewer.


## 15 Value Iteration vs Policy Iteration Comparison

Both algorithms solve for the optimal policy and optimal value function. Here is how they differ:

| Aspect | Value Iteration | Policy Iteration |
|---|---|---|
| Core Update | Bellman update with max over all actions | Alternating evaluation + improvement |
| Per-Iteration Cost | O(|S|^2 * |A|) | Eval: O(|S|^2) or O(|S|^3); Improve: O(|S|^2 * |A|) |
| Number of Iterations | More (values converge slowly) | Fewer (policy converges faster) |
| Implicit Policy | Yes (argmax of V implicitly defines it) | Explicit policy tracked at all times |
| Practical Speed | Good for small problems | Often faster in practice |
| Implementation | Simpler | Slightly more complex |

**Key insight**: Both are **dynamic programming** algorithms computing the same thing. They differ only in whether we plug in a fixed policy or max over actions in the Bellman update.

### Both Are Bellman Update Variants

The deep similarity:
- **Value Iteration**: `V_{k+1}(s) = max_a Q(s,a)` - take the max over all actions.
- **Policy Evaluation**: `V^pi_{k+1}(s) = Q(s,pi(s))` - plug in the fixed action.
- **Policy Improvement**: `pi_{t+1}(s) = argmax_a Q(s,a)` - same as value iteration's implicit step.

The only algorithmic difference is whether you plug in a fixed action or take the max.


## 16 Summary and Big Picture

### The MDP Framework

An MDP models sequential decision-making under uncertainty:
- **S**: What states exist?
- **A**: What actions are available?
- **T**: How do actions affect the world? (stochastic)
- **R**: What feedback do we get?
- **gamma**: How much do we care about future vs. present?

### The Solution Optimal Policy

We want pi*: a mapping from every state to the optimal action.

The tool to find pi* is the **Bellman optimality equations** - recursive equations linking the value of a state to the values of neighboring states.

### Three Core Algorithms

| Goal | Algorithm |
| :--- | :--- |
| Compute V* (optimal values) | Value Iteration or Policy Iteration |
| Compute V^pi (values for a fixed policy pi) | Policy Evaluation |
| Extract pi from V | Policy Extraction (greedy one-step lookahead) |

All three are variations of Bellman updates - they differ only in whether a fixed action or max is applied.

### The Bellman Equations Full Summary

```text
# Optimal value function (Bellman Optimality Equation):
V*(s) = max_a sum_{s'} T(s,a,s') * [R(s,a,s') + gamma * V*(s')]

# Optimal Q-function:
Q*(s,a) = sum_{s'} T(s,a,s') * [R(s,a,s') + gamma * V*(s')]

# Relationship:
V*(s) = max_a Q*(s,a)

# Optimal policy:
pi*(s) = argmax_a Q*(s,a)

# Policy value function (for fixed pi):
V^pi(s) = sum_{s'} T(s,pi(s),s') * [R(s,pi(s),s') + gamma * V^pi(s')]

# Value Iteration update:
V_{k+1}(s) = max_a sum_{s'} T(s,a,s') * [R(s,a,s') + gamma * V_k(s')]

# Policy Evaluation update:
V^pi_{k+1}(s) = sum_{s'} T(s,pi(s),s') * [R(s,pi(s),s') + gamma * V^pi_k(s')]

# Policy Extraction:
pi*(s) = argmax_a sum_{s'} T(s,a,s') * [R(s,a,s') + gamma * V*(s')]
```

### Common Pitfalls and Misconceptions

**"Value Iteration runs BFS on the MDP"**: False. Value iteration sweeps over all states in every iteration and handles cycles and stochastic transitions - BFS does neither.

**"The optimal policy always moves toward the highest-value neighbor"**: False. Because actions are stochastic, the full expectation must be computed. Drifting into a trap changes the calculation dramatically.

**"Policy Iteration always outperforms Value Iteration"**: Depends on the problem. Policy Iteration takes fewer outer iterations but each iteration is more expensive (especially with the linear system solve). For large state spaces, iterative policy evaluation is usually preferred.

**"gamma = 1 is always fine"**: Only if terminal states are guaranteed to be reached. Without them, infinite-horizon MDPs with gamma = 1 have infinite utility, making comparison of policies impossible.

### Beyond This Lecture What Comes Next

- **Reinforcement Learning**: What if we do not know T and R? We learn them (or the policy directly) from experience through trial and error.
- **Asynchronous Value Iteration**: Update states selectively (prioritized sweeping) for efficiency.
- **POMDPs (Partially Observable MDPs)**: The agent cannot directly observe the state - only gets noisy observations. Uses Bayesian filtering over possible states.
- **Policy Search**: Directly optimize a parameterized policy pi_theta using gradient methods - useful when the state/action spaces are enormous (robotics, game-playing).
- **Inverse RL**: Given observed optimal behavior from a demonstrator, recover the reward function that explains the behavior.
- **Demonstration-Seeded Policy Iteration**: Observe a human solving the MDP, use their actions as an initial policy for Policy Iteration, which may not cover the entire state space but gives a strong starting point.


## Quick Reference Card

```text
MDP = (S, A, T, R, gamma)
  S: states
  A: actions
  T(s,a,s') = P(s'|s,a): transition probabilities
  R(s,a,s'): reward function
  gamma in [0,1]: discount factor

Bellman Optimality:
  V*(s) = max_a sum_{s'} T(s,a,s')[R(s,a,s') + gamma*V*(s')]
  Q*(s,a) = sum_{s'} T(s,a,s')[R(s,a,s') + gamma*V*(s')]
  pi*(s) = argmax_a Q*(s,a)

Value Iteration:
  V_0(s) = 0
  V_{k+1}(s) = max_a sum_{s'} T(s,a,s')[R(s,a,s') + gamma*V_k(s')]
  Complexity: O(|S|^2 * |A|) per iteration
  Converges when: max_s |V_{k+1}(s) - V_k(s)| < epsilon*(1-gamma)/gamma

Policy Iteration:
  1. Evaluate: V^pi(s) = sum_{s'} T(s,pi(s),s')[R + gamma*V^pi(s')]
  2. Improve: pi'(s) = argmax_a sum_{s'} T(s,a,s')[R + gamma*V^pi(s')]
  3. Repeat until pi' = pi

Policy Extraction (from V):
  pi*(s) = argmax_a sum_{s'} T(s,a,s')[R(s,a,s') + gamma*V*(s')]

Discount factor intuition:
  gamma = 0: only immediate reward matters (myopic)
  gamma = 1: all future rewards matter equally (far-sighted, needs terminal states)
  gamma in (0,1): geometric discounting, infinite series converges to R_max/(1-gamma)
```
