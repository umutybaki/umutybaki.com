---
title: "Final Exam Study Guide"
date: "2026-06-06"
description: "Based on: 17 lecture notes + 5 past finals (Fall 2023, Spring 2024, Fall 2024, Spring 2025, Fall 2025)"
---

# Final Exam Study Guide

> **Based on:** 17 lecture notes + 5 past finals (Fall 2023, Spring 2024, Fall 2024, Spring 2025, Fall 2025)
> **Exam format:** ~9–10 questions, 100 pts, 135–160 min, closed book


## Recurring Topic Frequency from past finals

| Topic | Exams | Points Weight |
| :--- | :---: | :--- |
| True/False | 5/5 | 6–12 pts |
| Search (BFS/DFS/UCS/Greedy/A*) | 5/5 | 9–12 pts |
| Machine Learning | 5/5 | 10–12 pts |
| Bayesian Networks (exact/approx inference) | 5/5 | 10–16 pts |
| HMMs & Particle Filtering | 5/5 | 8–15 pts |
| MDPs (value/policy iteration) | 5/5 | 9–15 pts |
| Q-Learning / RL | 5/5 | 8–14 pts |
| CSP / AC3 | 4/5 | 6–9 pts |
| Adversarial Search / Minimax | 3/5 | 4–12 pts |
| Approximate Q-Learning | 3/5 | 9–14 pts |
| Local Search | 2/5 | 4–8 pts |
| VPI / Decision Networks | 2/5 | 5–10 pts |


## Study Order highest return first

1. MDPs + Value/Policy Iteration
2. Q-Learning + Approximate Q-Learning
3. Bayesian Networks (exact + Gibbs)
4. HMMs + Particle Filtering
5. Search (BFS, DFS, UCS, A*)
6. Machine Learning
7. CSP + AC3
8. Adversarial Search
9. Local Search / Genetic Algorithms
10. Decision Networks + VPI


## 1 Search Algorithms

### Problem Formulation
- **State:** snapshot of the world
- **Initial state, goal test, actions, transition model, path cost**
- **State space graph** vs **search tree** - same state can appear multiple times in the tree

### Algorithm Comparison

| Algorithm | Frontier | Complete | Optimal | Time | Space |
| :---: | :--- | :--- | :--- | :--- | :--- |
| DFS | Stack (LIFO) | No (tree) / Yes (graph, finite) | No | O(b^m) | O(bm) |
| BFS | Queue (FIFO) | Yes | Yes (unit cost) | O(b^d) | O(b^d) |
| UCS | Priority Queue (g cost) | Yes | Yes | O(b^(C*/ε)) | O(b^(C*/ε)) |
| Greedy | Priority Queue (h) | No | No | O(b^m) | O(b^m) |
| A* | Priority Queue (f = g+h) | Yes | Yes (admissible h) | - | - |

**Key formulas:**
- f(n) = g(n) + h(n)
- Admissible: h(n) ≤ h*(n) for all n (never overestimates)
- Consistent: h(n) ≤ cost(n,n') + h(n') - needed for graph search optimality

**Exam tips:**
- Always trace pop order, not push order
- Add neighbors alphabetically; break ties alphabetically
- BFS finds shortest path in terms of steps; UCS finds cheapest cost path
- A* with consistent heuristic → graph search is optimal


## 2 CSP AC3

### Backtracking Heuristics
- **MRV (Minimum Remaining Values):** pick variable with fewest legal values
- **Degree Heuristic:** pick variable with most constraints on remaining variables
- **LCV (Least Constraining Value):** pick value that rules out fewest neighbor values

### AC3 Algorithm
For each arc (Xi → Xj): remove values from Xi's domain that have no consistent value in Xj.
If Xi's domain changes, add all arcs (Xk → Xi) back to the queue.

**Exam tip:** Do one arc at a time. When a domain shrinks, re-queue all arcs pointing INTO that variable.


## 3 Local Search

### Hill Climbing
- Move to best neighbor; stop at local max
- Problems: local maxima, plateaus, ridges
- Fixes: random restarts, sideways moves, simulated annealing

### Simulated Annealing
- Accept worse states with probability e^(ΔE/T)
- T decreases over time (cooling schedule)
- **Guaranteed to find global optimum** if T decreases slowly enough

### Genetic Algorithms
- Population of candidates → fitness → selection → crossover → mutation
- Works well when good solutions can be combined

**Exam tip:** The professor favors simulated annealing for continuous optimization with local maxima risk; genetic algorithms when solutions can be meaningfully combined.


## 4 Adversarial Search

### Minimax
- MAX player maximizes; MIN player minimizes
- Value propagates from leaves up the tree
- O(b^m) time, O(bm) space

### AlphaBeta Pruning
- α = best MAX value found so far on path from root
- β = best MIN value found so far on path from root
- Prune when α ≥ β
- Best case (perfect ordering): O(b^(m/2))

### Expectiminimax
- Add chance nodes with expected values: Σ P(outcome) × V(outcome)
- Used for stochastic games

**Exam tip:** Alpha-beta questions often ask you to cross out pruned branches AND give the condition on some variable for pruning to happen.


## 5 Probability

### Key Rules
- **Product rule:** P(A, B) = P(A|B) P(B)
- **Bayes rule:** P(A|B) = P(B|A) P(A) / P(B)
- **Marginalization:** P(A) = Σ_B P(A, B)
- **Normalization trick:** P(A|e) ∝ P(A, e) - compute unnormalized, then divide by sum

### Independence
- A ⊥ B iff P(A,B) = P(A)P(B)
- A ⊥ B | C iff P(A,B|C) = P(A|C)P(B|C)


## 6 Bayesian Networks

### Core Equation
P(X1, ..., Xn) = Π P(Xi | Parents(Xi))

### DSeparation independence from graph structure
Three canonical structures:

| Structure | Independent? (without evidence) | Independent? (with middle node observed) |
| :--- | :--- | :--- |
| Causal Chain A→B→C | A⊥C given B? **YES** | A⊥C? **NO** |
| Common Cause A←B→C | A⊥C given B? **YES** | A⊥C? **NO** |
| Common Effect A→B←C (V-structure) | A⊥C? **YES** | A⊥C given B? **NO** (activates!) |

**Key rule:** Observing a collider (or its descendant) OPENS the path. Observing a non-collider BLOCKS the path.

### Exact Inference Variable Elimination VE
1. Instantiate evidence (fix observed values in CPTs)
2. Choose elimination order (eliminate hidden variables one at a time)
3. For each hidden variable: **join** all factors containing it → **sum out** the variable
4. Multiply remaining factors, normalize

**Choosing elimination order:** Prefer to eliminate variables that create the smallest intermediate factors.

**Exam pattern:** Write out initial factors, state hidden variables, describe join + sum-out steps, then normalize.

### Approximate Inference Sampling

| Method | How | Limitation |
| :--- | :--- | :--- |
| Prior sampling | Sample following BN order | Wastes samples when evidence is rare |
| Rejection sampling | Prior sample, reject if doesn't match evidence | Very inefficient for rare evidence |
| Likelihood weighting | Fix evidence, weight by P(evidence \| parents) | Doesn't propagate upstream evidence |
| Gibbs sampling | Fix evidence, resample one variable at a time from its Markov blanket | May mix slowly |

**Gibbs sampling formula:**
P(Xi | all others) ∝ P(Xi | Parents(Xi)) × Π P(Xj | Parents(Xj)) for each Xj that has Xi as parent

**Exam tip for Gibbs:** The Markov blanket is Xi's parents, children, and children's other parents. The proportional expression simplifies by canceling everything not involving Xi.


## 7 Decision Networks Influence Diagrams

### MEU Maximum Expected Utility
MEU = max_a Σ_outcomes P(outcome | a) × U(outcome)

### VPI Value of Perfect Information
VPI(E) = MEU(after observing E) − MEU(before)

Formally: VPI(Ej) = [Σ_ej P(ej) × MEU(Ej = ej)] − MEU(∅)

**Key properties:**
- VPI ≥ 0 always (information never hurts)
- VPI = 0 if the evidence is already known, irrelevant, or doesn't change the best action
- VPI is NOT additive in general

**Exam tip:** For VPI, compute MEU for each possible evidence value, weight by P(evidence), compare to current MEU.


## 8 HMMs Reasoning Over Time

### HMM Parameters
- **Prior:** P(X0)
- **Transition model:** P(Xt | Xt-1)
- **Emission model:** P(Et | Xt)

### Forward Algorithm Filtering
Goal: P(Xt | e1:t)

Two steps per time step:
1. **Predict (time elapse):** P(Xt+1) = Σ_xt P(Xt+1 | Xt) P(Xt | e1:t)
2. **Update (observe):** P(Xt+1 | e1:t+1) ∝ P(et+1 | Xt+1) × P(Xt+1)

Then normalize.

### Particle Filtering Approximate
Three steps per cycle:
1. **Elapse time:** for each particle, sample next state from transition model
2. **Weight:** weight each particle by P(observation | state)
3. **Resample:** draw N new particles with probability proportional to weights

**Exam tip for resampling:** Normalize weights → cumulative distribution → use uniform samples to pick particles.

### Viterbi Algorithm Most Likely Path
- Like forward algorithm but use **max** instead of sum for time elapse
- Track argmax (backpointer) at each step
- **Backtrack from final state** - do NOT take argmax at each step going forward

Key difference vs. forward: Viterbi uses m_t+1(x') = max_x [P(x'|x) × P(et+1|x') × m_t(x)]


## 9 MDPs

### Formal Definition
(S, A, T, R, γ)  - States, Actions, Transition model, Reward, Discount

### Bellman Equations MDPs

**Optimal value:**
V*(s) = max_a Σ_s' T(s,a,s') [R(s,a,s') + γV*(s')]

**Optimal Q-value:**
Q*(s,a) = Σ_s' T(s,a,s') [R(s,a,s') + γV*(s')]

**Optimal policy:**
π*(s) = argmax_a Q*(s,a) = argmax_a Σ_s' T(s,a,s') [R(s,a,s') + γV*(s')]

**Policy value (fixed π):**
V^π(s) = Σ_s' T(s,π(s),s') [R(s,π(s),s') + γV^π(s')]

### Value Iteration
Vk+1(s) = max_a Σ_s' T(s,a,s') [R(s,a,s') + γVk(s')]

Repeat until convergence. **Policy converges before values.**

### Policy Iteration
1. **Policy Evaluation:** solve V^π (linear system or iterate) given fixed π
2. **Policy Improvement:** π'(s) = argmax_a Q(s,a) using V^π
3. Repeat until π doesn't change

**Exam tip:** Policy iteration converges faster in practice. Value iteration is simpler to apply step-by-step.

### Discounting
- γ close to 1: far-future rewards matter
- γ close to 0: greedy (only immediate reward matters)
- Finite sums guaranteed when γ < 1


## 10 Reinforcement Learning

### Passive RL policy given learn values

**Direct Evaluation (Monte Carlo):**
- Run episodes, average total discounted return from each (s,a) visit
- Slow to converge; doesn't use Bellman structure

**TD Learning:**
V(s) ← V(s) + α [r + γV(s') − V(s)]
- Online, uses one step at a time
- Bootstraps from current value estimates

### Active RL learn values AND policy

**Q-Learning (off-policy):**
Q(s,a) ← Q(s,a) + α [r + γ max_a' Q(s',a') − Q(s,a)]

- Off-policy: learns optimal Q regardless of exploration policy
- Converges to Q* with enough exploration and decreasing α

### Approximate QLearning Reinforcement Learning
When state space is too large:

Q̂(s,a,w) = w^T f(s,a)   (linear function approximation)

Update rule:
w ← w + α [r + γ max_a' Q̂(s',a',w) − Q̂(s,a,w)] f(s,a)

**Exam tip (common pattern):** Given transitions (s,a,r) → (s',a',r') → ..., apply updates one step at a time. After each update, recalculate max_a' Q̂(s',a') with the NEW weights.

### Exploration Strategies
- ε-greedy: with prob ε explore randomly, else exploit
- Softmax/Boltzmann: sample proportional to exp(Q/T)
- Exploration functions: add bonus for under-explored states


## 11 Machine Learning

### Problem Setup
- **Supervised learning:** labeled (X, y) pairs → learn f: X → y
- Classification: y is discrete. Regression: y is continuous.

### Overfitting Underfitting
- **Underfitting (high bias):** model too simple - fix with more complex model, better features
- **Overfitting (high variance):** model memorizes training data - fix with regularization, more data, simpler model, cross-validation
- **Bias-variance tradeoff:** as complexity ↑, bias ↓ but variance ↑

### Handling Overfitting
- **Regularization:** L2 (Ridge) penalizes large weights; L1 (Lasso) induces sparsity
- **Cross-validation:** k-fold CV to select hyperparameters
- **More data** always helps
- **Feature engineering** can reduce the need for complex models

### Key Algorithms

**k-Nearest Neighbors (kNN):**
- Non-parametric; stores all training data
- k is the key hyperparameter (select via CV)
- High k → smoother, less overfit

**Linear Regression:** minimize Σ(y - w^T x)^2. Add L2 term for Ridge.

**Logistic Regression:** P(y=1|x) = σ(w^T x); minimize log-loss. Good for linear decision boundaries.

**Naive Bayes:**
- P(y|x) ∝ P(y) Π P(xi|y)
- Assumes features are conditionally independent given class
- Need Laplace smoothing to avoid zero probabilities
- Works well even when independence assumption is violated

### Model Selection
- Always use train/validation/test split
- Hyperparameters selected on validation set; final evaluation on test set (once!)
- Never use test set for model selection

### Generative vs Discriminative
- Generative (NB): model P(x,y); slower with more data but works with less data
- Discriminative (Logistic Reg): model P(y|x) directly; better with more data


## 12 TrueFalse Recurring Themes

These have appeared repeatedly:

| Statement | Answer |
| :--- | :--- |
| Solving an MDP results in a reflex agent | **TRUE** (policy maps state → action directly) |
| Policy converges before values in value iteration | **TRUE** |
| Values are never calculated in policy iteration | **FALSE** (policy evaluation computes values) |
| Transition model NOT needed for TD-Learning | **FALSE** (you don't need it upfront, but Q-values implicitly learn it... however, to EXTRACT a policy from V*, you DO need T) |
| Transition model needed to extract policy from V* | **TRUE** (need T to find argmax_a Σ T(s,a,s')[R+γV*(s')]) |
| Approximate Q-learning helps with generalization | **TRUE** |
| Direct policy evaluation not applicable without terminal states | **TRUE** (can't average returns without episode ends) |
| Training accuracy in classification can be 100% | **TRUE** (just memorize training data) |
| Direct model parameters calculated to reduce overfitting | **FALSE** (they minimize training loss, not overfitting) |
| MDP is used to model problems with noisy observations | **FALSE** (that's HMM/POMDP; MDP assumes full observability) |


## 13 Key Equations Cheatsheet

### Search
f(n) = g(n) + h(n)  ←  A* evaluation function

### Probability
P(A|B) = P(B|A)P(A) / P(B)   ← Bayes Rule
P(A) = Σ_B P(A,B)              ← Marginalization

### Bayesian Network
P(X1..Xn) = Π P(Xi|Parents(Xi))

### HMM Filtering
B_{t+1}(x') ∝ P(e_{t+1}|x') Σ_x P(x'|x) B_t(x)

### Bellman Equations Key Equations Cheatsheet
V*(s) = max_a Σ T(s,a,s')[R(s,a,s') + γV*(s')]
Q*(s,a) = Σ T(s,a,s')[R(s,a,s') + γV*(s')]
π*(s) = argmax_a Q*(s,a)

### TD QLearning Updates
V(s) ← V(s) + α[r + γV(s') - V(s)]
Q(s,a) ← Q(s,a) + α[r + γ max_a' Q(s',a') - Q(s,a)]

### Approximate QLearning Key Equations Cheatsheet
w ← w + α[r + γ max_a' Q̂(s',a') - Q̂(s,a)] · f(s,a)

### VPI
VPI(E) = Σ_e P(e) MEU(E=e) - MEU(∅)


## 14 Exam Strategy

**For search questions:**
- Trace explicitly: what's on the frontier at each step, what gets popped
- Use graph search (mark visited) unless told otherwise

**For BN/inference questions:**
- Write out initial factors first
- Choose elimination order that minimizes largest intermediate factor
- For Gibbs: condition only on Markov blanket, cancel common terms

**For MDP/RL questions:**
- Check whether reward is on leaving state vs entering state (it varies per exam!)
- Show Bellman update arithmetic step by step
- Policy extraction: argmax_a of Q values, not just highest V neighbor

**For ML questions:**
- The answer is almost always: use cross-validation + the right regularization method for the model
- Feature engineering is the fix when both over/underfitting handling fail

**For particle filter questions:**
- Elapse time: sample next state from T(s'|s) for each particle
- Observation step: weight by P(e|s), then normalize, then resample using cumulative distribution
