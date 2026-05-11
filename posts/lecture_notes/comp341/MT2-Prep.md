---
title: "Midterm 2 Prep - Self-Contained Study Guide"
date: "2026-05-11"
description: "Complete study guide for COMP341 MT2 covering probability, Bayesian Networks (representation, exact + approximate inference), HMMs, and Decision Networks. Includes concept explanations, solution recipes, and worked example questions modeled on past exams."
---

# Midterm 2 Prep - Self-Contained Study Guide

This document is designed so you can study **only from this file**. It contains:

1. The minimum theory you need to recall
2. Solution recipes for the recurring exam patterns
3. Common traps and pitfalls
4. **Worked example questions** with full solutions for every major pattern

Built backward from 5 past exams (Fall 2023, Spring 2024, Fall 2024, Spring 2025, Fall 2025).


## Pattern Frequency Across 5 Past Exams

| Pattern | Frequency | Typical points |
| :--- | :---: | ---: |
| T/F warmup | 5/5 | 16–24 |
| D-separation on a 6–10 node BN | 5/5 | 10–16 |
| Variable Elimination (with ordering) | 5/5 | 10–17 |
| Likelihood Weighting weight computation | 5/5 | 4–8 |
| Decision Network - MEU + VPI | 5/5 | 12–18 |
| HMM Forward Algorithm (filter) | 3/5 | 14–22 |
| Markov Blanket identification | 3/5 | 3–6 |
| Bayes' Rule / normalization | 5/5 | 6–10 |
| Rejection sampling reasoning | 2/5 | 4–8 |
| Gibbs sampling step | 1/5 | 4–8 |
| Viterbi (most-likely path) | 2/5 | 4–8 |

> **Note on particle filtering**: appears in 2025 exams, but is NOT in your 6 textbook chapters. Per the constraint that the exam only covers material from those chapters, treat it as out-of-scope.


## Part I - Core Theory

### 1. Probability Foundations

#### 1.1 Random variables and distributions

A **random variable** X has a **domain** (set of possible values). For discrete variables:

- **Prior (marginal) probability** P(X) - distribution before any evidence.
- **Joint distribution** P(X, Y) - probability of every combination of assignments.
- **Conditional distribution** P(X | Y) - distribution of X given a fixed value of Y.

All probabilities are in [0, 1]. All entries of a distribution must sum to 1 (or integrate to 1 for continuous).

#### 1.2 The three axioms (Kolmogorov)

1. **Non-negativity**: P(E) ≥ 0
2. **Unit measure**: P(Ω) = 1
3. **Additivity**: For mutually exclusive events, P(A ∪ B) = P(A) + P(B)

Derived rules:

- **Complement**: P(¬A) = 1 − P(A)
- **Inclusion-exclusion**: P(A ∪ B) = P(A) + P(B) − P(A ∩ B)
- **Subsets**: if A ⊆ B then P(A) ≤ P(B)

#### 1.3 Joint, marginal, conditional

- **Marginalization (summing out)**:

$$P(X) = \sum_{y} P(X, Y=y)$$

- **Conditional probability** (definition):

$$P(A | B) = \frac{P(A, B)}{P(B)}$$

- **Product rule**:

$$P(A, B) = P(A | B) P(B) = P(B | A) P(A)$$

- **Chain rule**:

$$P(X_1, X_2, \dots, X_n) = \prod_{i=1}^{n} P(X_i | X_1, \dots, X_{i-1})$$

#### 1.4 Bayes' Rule

$$P(A | B) = \frac{P(B | A) P(A)}{P(B)}$$

Used to flip a conditional. Often P(B|A) is "causal/easy to estimate" and P(A|B) is the "diagnostic" answer you want.

#### 1.5 Normalization trick

If you want P(X | e) and you know P(X, e) for every value of X, you don't have to compute P(e) separately. Just compute the numerator P(X=x, e) for each x and divide by the sum:

$$P(X | e) = \alpha \langle P(x_1, e), P(x_2, e), \dots \rangle, \quad \alpha = \frac{1}{\sum_x P(x, e)}$$

#### 1.6 Independence and conditional independence

- **Absolute independence**: X ⊥ Y iff P(X, Y) = P(X) P(Y), equivalently P(X | Y) = P(X).
- **Conditional independence**: X ⊥ Y | Z iff P(X, Y | Z) = P(X | Z) P(Y | Z), equivalently P(X | Y, Z) = P(X | Z).

Absolute independence is rare; conditional independence is the workhorse of probabilistic AI.

#### 1.7 Naïve Bayes

Assumes all "effects" are conditionally independent given the "cause":

$$P(C, E_1, \dots, E_n) = P(C) \prod_{i=1}^n P(E_i | C)$$

Parameter count is linear in n, not exponential.


### 2. Bayesian Networks - Representation

#### 2.1 Definition

A **Bayesian Network** is:

- A **Directed Acyclic Graph (DAG)** where nodes are random variables.
- A set of **Conditional Probability Tables (CPTs)** P(X | Parents(X)) attached to each node.

The DAG encodes **conditional independence assumptions**, not necessarily causality (though causal orderings produce the sparsest networks).

#### 2.2 The joint factorization

A BN compactly represents the full joint:

$$P(X_1, \dots, X_n) = \prod_{i=1}^n P(X_i | \text{Parents}(X_i))$$

To compute the probability of any full assignment, multiply the CPT entries.

#### 2.3 Parameter counting

A CPT P(X | parents) where X has domain size $d_X$ and parents combined have $\prod d_{p}$ values:

- Total entries: $d_X \cdot \prod d_p$
- **Independent parameters** (free numbers): $(d_X - 1) \cdot \prod d_p$

For booleans (domain 2):

- P(X) → 1 independent param
- P(X | A) → 2 independent params
- P(X | A, B) → 4 independent params

Full joint over n booleans = $2^n - 1$ independent params.

#### 2.4 Constructing a Bayes Net (chain rule construction)

1. Pick an ordering of variables.
2. For each $X_i$, find the **minimal** subset of already-added variables that makes:

$$P(X_i | \text{Parents}(X_i)) = P(X_i | X_1, \dots, X_{i-1})$$

3. Those are its parents.

Causal orderings (causes before effects) yield sparse, intuitive graphs. Any ordering works mathematically, but bad orderings give dense graphs with huge CPTs.

#### 2.5 D-separation - checking conditional independence

To check X ⊥ Y | Z (where Z is the set of observed variables):

1. Find every undirected path between X and Y.
2. Classify each consecutive triple along the path as one of three types.
3. A path is **active** iff *every* triple is active.
4. X ⊥ Y | Z iff *every* path is blocked.

**The three triples:**

**(a) Causal Chain: A → B → C**

- B **unobserved** → active
- B **observed** → blocked

**(b) Common Cause: A ← B → C**

- B **unobserved** → active
- B **observed** → blocked

**(c) V-Structure / Common Effect: A → B ← C** *(the tricky one)*

- B **unobserved AND no descendant of B observed** → **BLOCKED**
- B **observed** OR **any descendant of B observed** → **ACTIVE** (explaining away)

#### 2.6 Markov Blanket

The **Markov Blanket** of node X consists of:

1. Parents of X
2. Children of X
3. **Co-parents** (other parents of X's children)

**Property**: Given its Markov Blanket, X is independent of every other node in the network.

This is the key fact used in Gibbs sampling.


### 3. Exact Inference

#### 3.1 Inference by Enumeration

Given Query Q, Evidence E = e, Hidden H:

$$P(Q | e) = \alpha \sum_h P(Q, e, h)$$

**Algorithm:**

1. Select all joint-table entries consistent with e.
2. Sum out hidden variables H.
3. Normalize.

Complexity: $O(d^n)$ time and space. Intractable for non-trivial networks.

#### 3.2 Factors

A **factor** is a multi-dimensional table over a subset of variables.

- Each BN CPT is an initial factor.
- Setting evidence "slices" a factor (removes a dimension).

**Pointwise product**: $f_1(X, Y) \cdot f_2(Y, Z) = f_3(X, Y, Z)$ where each entry is the product of matching entries.

**Summing out**: $\sum_Y f(X, Y) = f'(X)$ - removes a dimension.

#### 3.3 Variable Elimination (VE)

Interleaves joining and marginalizing to keep factors small.

**Algorithm:**

1. Start with all CPTs as factors. Instantiate evidence.
2. While hidden variables remain:
  - Pick a hidden variable H.
  - **Join** all factors that mention H.
  - **Sum out** H from the joined factor.
3. Join remaining factors.
4. Normalize.

**Complexity is determined by the largest intermediate factor produced.** Ordering matters.

#### 3.4 Ordering rules of thumb

- Eliminate variables that produce the smallest new factor first.
- For a "star" network (hub connected to many leaves), eliminate the leaves first; save the hub for last.
- **Irrelevant-variable shortcut**: if summing out H gives a factor of all 1s (because H is a leaf with no evidence below it), drop H's factor entirely.

Exact inference is NP-hard in general - but good ordering can make it tractable for sparse networks.


### 4. Approximate Inference (Sampling)

#### 4.1 Prior Sampling

No evidence. Topological order, sample each variable from its CPT given already-sampled parents. Frequencies converge to the joint.

#### 4.2 Rejection Sampling

For P(Q | e):

1. Generate prior samples.
2. **Reject** any sample that disagrees with evidence.
3. Estimate P(Q | e) from kept samples.

**Flaw**: highly wasteful when evidence is rare.

#### 4.3 Likelihood Weighting (LW)

Force evidence variables to their observed values, weight by the probability of that forcing.

**Algorithm (one sample):**

1. Initialize w = 1.
2. For each variable in topological order:
  - If **evidence**: set to its observed value, multiply $w \mathrel{\*}= P(e_i | \text{Parents}(E_i))$.
  - If **non-evidence**: sample from its CPT given parents.
3. Return (sample, w).

**Weight formula**:

$$w = \prod_{e_i \in E} P(e_i | \text{Parents}(E_i))$$

**Estimating P(Q | e)** from N weighted samples:

$$P(Q = q | e) \approx \frac{\sum_{i : Q_i = q} w_i}{\sum_i w_i}$$

**Flaw**: evidence only influences downstream sampling; upstream variables sampled blindly.

#### 4.4 Gibbs Sampling (MCMC)

Maintain one full state; iteratively resample one variable at a time.

**Algorithm:**

1. Initialize a full assignment consistent with evidence (evidence fixed).
2. Repeat many times:
  - Pick a non-evidence variable $X_i$.
  - Resample $X_i$ from $P(X_i | \text{everything else}) = P(X_i | \text{MarkovBlanket}(X_i))$.
3. After burn-in, collect samples for estimation.

**Computing the Gibbs distribution**:

$$P(X_i | \text{MB}) \propto P(X_i | \text{parents}) \cdot \prod_{c \in \text{children}(X_i)} P(c | \text{parents}(c))$$

**Strength**: evidence flows both upstream and downstream because every variable is conditioned on its neighborhood.

#### 4.5 Comparison table

| Method | Handles evidence | Wastes samples | Evidence guides sampling |
| :--- | :---: | :---: | :--- |
| Prior | No | - | - |
| Rejection | Yes | Yes (heavily) | No |
| LW | Yes | No | Downstream only |
| Gibbs | Yes | No | Both directions |


### 5. Reasoning Over Time - HMMs

#### 5.1 Markov chains

A sequence of states $X_1, X_2, \dots$ with the **First-Order Markov Assumption**:

$$P(X_{t+1} | X_t, X_{t-1}, \dots, X_1) = P(X_{t+1} | X_t)$$

"The future is independent of the past given the present."

Defined by:

- Prior $P(X_1)$
- Transition model $P(X_{t+1} | X_t)$ (usually stationary - same over time)

Joint: $P(X_{1:T}) = P(X_1) \prod_{t=2}^T P(X_t | X_{t-1})$

**Stationary distribution**: as $t \to \infty$, $P(X_t)$ stabilizes (for most chains), independent of $P(X_1)$.

#### 5.2 Hidden Markov Models

States $X_t$ are hidden; we observe **emissions** $E_t$.

Defined by:

1. Prior $P(X_1)$
2. Transition model $P(X_{t+1} | X_t)$
3. Emission model $P(E_t | X_t)$ (state → emission, NOT the reverse)

Independence properties:

- $X_{t+1} \perp X_{1:t-1} | X_t$ (Markov property on states)
- $E_t \perp \text{everything} | X_t$ (sensor independence)

Joint:

$$P(X_{1:T}, E_{1:T}) = P(X_1) P(E_1 | X_1) \prod_{t=2}^T P(X_t | X_{t-1}) P(E_t | X_t)$$

#### 5.3 Filtering - the Forward Algorithm

**Belief state**: $B_t(X) = P(X_t | e_{1:t})$

Two-step recursion:

**Step 1: Elapse time (uncertainty UP)**

$$B'_{t+1}(X_{t+1}) = \sum_{x_t} P(X_{t+1} | x_t)\, B_t(x_t)$$

**Step 2: Observe (uncertainty DOWN)**

$$B_{t+1}(X_{t+1}) = \alpha\, P(e_{t+1} | X_{t+1})\, B'_{t+1}(X_{t+1})$$

Then normalize.

**Initialization (t=1)**: $B_0(X) = P(X_1)$. If $E_1$ is observed, immediately apply the observation step.

**Missing observations**: do consecutive elapse-time steps without observation.

#### 5.4 Viterbi (most-likely path)

Same recursion but replace $\sum$ with $\max$:

$$m_{t+1}(X_{t+1}) = P(e_{t+1} | X_{t+1}) \max_{x_t} P(X_{t+1} | x_t) m_t(x_t)$$

Track argmax pointers to reconstruct the path.

**Forward + argmax ≠ Viterbi**: forward gives the most-likely state at each time independently; Viterbi gives the most-likely *full path*.


### 6. Decision Networks

#### 6.1 Three node types

- **Chance (oval)** - random variable with CPT.
- **Action (rectangle)** - agent's choice. Cannot have parents. Behaves as observed evidence once selected.
- **Utility (diamond)** - real-valued payoff. Depends on chance + action parents via a utility table.

#### 6.2 Maximum Expected Utility (MEU)

A rational agent chooses the action maximizing expected utility.

For each action a:

$$EU(a | e) = \sum_y P(y | e, a) \cdot U(y, a)$$

where Y ranges over the utility node's chance-parent values.

$$\text{MEU}(e) = \max_a EU(a | e)$$

#### 6.3 Human utilities - risk attitudes

- **Risk-averse**: prefer guaranteed $\$400$ over a 50/50 of $\$0$/$\$1000$ (EMV = $500). Concave utility curve. Basis of insurance.
- **Risk-prone**: prefer gambles when in debt. Convex region of utility curve.
- **Allais Paradox**: humans sometimes violate strict rationality based on phrasing.

#### 6.4 Value of Perfect Information (VPI)

How much should you pay to learn variable E' before acting?

$$\text{VPI}(E' | e) = \left[ \sum_{e'} P(e' | e)\, \text{MEU}(e, e') \right] - \text{MEU}(e)$$

**Properties:**

- **Non-negative**: information cannot hurt MEU (you can always ignore it).
- **Non-additive**: VPI(E1, E2) ≠ VPI(E1) + VPI(E2) in general.
- **Order-independent**: total value doesn't depend on the order you collect variables.
- **VPI = 0 iff the optimal action is the same** for every value E' could take.


## Part II - High-Yield Solution Recipes

### Recipe A - Bayes' Rule problem

**Setup**: Given $P(X)$ and $P(Y | X)$ for each value of X; asked for $P(X | Y = y)$.

**Steps:**

1. Compute the joint for every X: $P(X=x, Y=y) = P(Y=y | X=x) P(X=x)$.
2. Sum across X to get the marginal $P(Y=y)$.
3. Divide: $P(X=x | Y=y) = P(X=x, Y=y) / P(Y=y)$.

Or just use the normalization trick - compute numerators, then divide by their sum.

### Recipe B - D-separation question

For each query "X ⊥ Y | Z?":

1. Shade nodes in Z.
2. Draw every undirected path between X and Y.
3. For each path: identify every triple, classify it.
4. Path active iff every triple is active. Independent iff every path blocked.

**Always check**: are any colliders along the path? Are their *descendants* in Z?

### Recipe C - Variable Elimination

1. **List all CPTs** as factors. Instantiate evidence.
2. **Identify irrelevant variables** (leaves whose factors sum to 1 with no evidence below) - drop them.
3. **Pick elimination order**: at each step, join factors mentioning the chosen variable, then sum it out. Prefer eliminations that produce small factors.
4. **Continue** until only the query remains.
5. **Normalize**.

Show every factor: name it, list its scope, show its values.

### Recipe D - Likelihood Weighting weight

Given evidence E, a sample $(x_1, \dots, x_n)$ where $x_i = e_i$ for $i \in E$:

$$w = \prod_{i \in E} P(x_i | \text{parents}(X_i) \text{ in sample})$$

**Only evidence variables contribute to the weight.** Non-evidence variables were sampled, not forced.

### Recipe E - Gibbs sampling step

To resample $X_i$ given the current state:

1. Identify Markov Blanket: parents + children + co-parents.
2. Compute $P(X_i = v | \text{MB})$ for each value v:

$$P(X_i = v | \text{MB}) \propto P(X_i = v | \text{parents}) \cdot \prod_{c \in \text{children}} P(c | \text{parents}(c))$$

(where parents(c) uses the current state including $X_i = v$).

3. Normalize, sample.

### Recipe F - Forward Algorithm filter

Maintain a vector $B(X)$ over the state domain.

For each new observation $e_t$:

1. **Elapse**: $B'(X) = \sum_{x'} P(X | x') B(x')$
2. **Observe**: multiply each entry of $B'$ by $P(e_t | X)$
3. **Normalize** so entries sum to 1.

For missing observations: do step 1 twice (or k times) before doing 2 and 3.

### Recipe G - Decision Network: MEU

Without evidence:

1. For each action a:
  - Compute $P(y | a)$ for utility-parent y (often just P(y) marginal).
  - $EU(a) = \sum_y P(y | a) U(y, a)$.
2. MEU = max over a. Best action = argmax.

With evidence e: replace $P(y | a)$ with $P(y | a, e)$ (run inference first).

### Recipe H - VPI

To compute VPI(E' | e):

1. Compute baseline MEU(e). Note the optimal action $a^*$.
2. For each value e' of E':
  - Compute $P(e' | e)$.
  - Compute MEU(e, e') - re-run MEU as if you knew $E' = e'$. The optimal action may differ from $a^*$.
3. Weighted sum: $\sum_{e'} P(e' | e) \cdot \text{MEU}(e, e')$.
4. VPI = (weighted sum) − MEU(e).


## Part III - The T/F Warmup Trap List

Every exam opens with 8–16 T/F. The same misconceptions are tested repeatedly. Memorize:

**Probability:**

- "P(B | A) entries sum to 1 across the whole table." **FALSE** - they sum to 1 *per value of A* (per row).
- "If A and B are independent, P(A∩B) = 0." **FALSE** - that's *disjoint*. Independence: P(A∩B) = P(A)P(B).

**BN Representation:**

- "BN topology encodes causality." **FALSE** - it encodes conditional independence; causal orderings just produce sparser graphs.
- "A Bayes Net can represent any joint distribution." **TRUE** (with sufficient edges).
- "A Bayes Net topology can have cycles." **FALSE** - it's a DAG.
- "Observing additional variables can change conditional independence relations." **TRUE** (explaining away).

**Exact Inference:**

- "VE worst-case complexity is better than inference by enumeration." **FALSE in worst case** (NP-hard); but typically much better.
- "VE complexity depends on elimination ordering." **TRUE** - determined by largest factor.

**Sampling:**

- "Gibbs sampling rejects samples that disagree with evidence." **FALSE** - Gibbs never rejects.
- "Likelihood weighting uses weights; Gibbs uses weights too." **FALSE** - Gibbs does not use weights.
- "In LW, evidence affects how parents are sampled." **FALSE** - only the weight catches this.

**HMMs:**

- "Emission probabilities are P(X | E)." **FALSE** - they're P(E | X).
- "Forward algorithm + argmax at each step gives the most-likely path." **FALSE** - that's not Viterbi.
- "Markov chains include observations." **FALSE** - pure Markov chains have only states.

**Decision Networks:**

- "VPI can be negative." **FALSE** - VPI ≥ 0 always.
- "VPI = 0 means the variable is useless." **Refined**: VPI = 0 iff the optimal action doesn't change for any value of the variable.
- "Action nodes can have chance parents." **FALSE** - action nodes have no parents.
- "Action nodes can be parents of chance / utility nodes." **TRUE**.


## Part IV - Worked Example Questions

These are modeled directly on patterns seen across the 5 past exams. Try each one yourself first, then check the solution.


### Example 1 - Bayes' Rule (Medical Diagnostic)

**Question.** A rare disease D affects 1 in 1000 people. A test T is 99% sensitive (P(T=+ | D=+) = 0.99) and 95% specific (P(T=− | D=−) = 0.95). A patient tests positive. What is P(D=+ | T=+)?

**Solution.**

Priors:

- P(D=+) = 0.001, P(D=−) = 0.999
- P(T=+ | D=+) = 0.99
- P(T=+ | D=−) = 1 − 0.95 = 0.05

Marginal P(T=+):

$$P(T=+) = P(T=+ | D=+) P(D=+) + P(T=+ | D=−) P(D=−)$$
$$= (0.99)(0.001) + (0.05)(0.999) = 0.00099 + 0.04995 = 0.05094$$

Bayes' Rule:

$$P(D=+ | T=+) = \frac{(0.99)(0.001)}{0.05094} \approx 0.0194$$

**About 1.94%.** A surprising answer - the prior is so low that even a positive test leaves the posterior small. This is the **base rate fallacy** trap.


### Example 2 - D-Separation

**Question.** Consider the Bayes Net with structure:

- A → C
- B → C
- C → D
- C → E
- D → F
- E → F

For each query, state whether the independence holds:

(a) A ⊥ B  
(b) A ⊥ B | C  
(c) A ⊥ B | F  
(d) D ⊥ E  
(e) D ⊥ E | C  
(f) D ⊥ E | F  
(g) D ⊥ E | C, F

**Solution.**

```text
A   B
 \ /
  C
 / \
D   E
 \ /
  F
```

(a) **A ⊥ B?** Only path: A → C ← B (v-structure at C). C not observed, no descendants observed. **Blocked → YES, independent.**

(b) **A ⊥ B | C?** Same path, C now observed. V-structure activates. **Path active → NO, dependent.** (Explaining away.)

(c) **A ⊥ B | F?** Path A → C ← B. F is a descendant of C (via D or E). Observing F unblocks the v-structure at C. **Path active → NO, dependent.**

(d) **D ⊥ E?** Paths:

- D ← C → E (common cause at C, C unobserved → **active**)
- D → F ← E (v-structure at F, F unobserved → blocked)

One active path → **NO, dependent.**

(e) **D ⊥ E | C?**

- D ← C → E: C observed → blocked
- D → F ← E: F unobserved, no descendants → blocked

All paths blocked → **YES, independent.**

(f) **D ⊥ E | F?**

- D ← C → E: C unobserved → active
- D → F ← E: F observed → active

Both active → **NO, dependent.**

(g) **D ⊥ E | C, F?**

- D ← C → E: C observed → blocked
- D → F ← E: F observed → v-structure active

One active path → **NO, dependent.**

**Lesson**: a descendant observation can unblock a v-structure even when the collider itself is not observed.


### Example 3 - Markov Blanket

**Question.** Consider this BN:

- A → C, A → D
- B → D, B → E
- C → F
- D → F, D → G
- E → G

(a) What is the Markov Blanket of D?  
(b) Given the MB of D, name one node NOT in the MB and confirm that D is conditionally independent of it.

**Solution.**

(a) Markov Blanket of D:

- **Parents** of D: A, B
- **Children** of D: F, G
- **Co-parents** (other parents of D's children):
  - Parents of F other than D: C
  - Parents of G other than D: E

MB(D) = {A, B, C, E, F, G}.

(b) The only node not in MB(D) is the network's other variables - in this case all nodes besides D are in MB(D). If the network had, say, an isolated node Z that connected to A only via paths that go through MB(D), then D ⊥ Z | MB(D).

**Lesson**: always include co-parents (parents of children). This is the most-missed piece.


### Example 4 - Variable Elimination

**Question.** Bayes Net:

- A → B
- A → C
- B → D
- C → D
- D → E

CPTs (booleans, abbreviated):

- P(+a) = 0.5
- P(+b | +a) = 0.7, P(+b | −a) = 0.2
- P(+c | +a) = 0.8, P(+c | −a) = 0.4
- P(+d | +b, +c) = 0.95, P(+d | +b, −c) = 0.5, P(+d | −b, +c) = 0.4, P(+d | −b, −c) = 0.05
- P(+e | +d) = 0.9, P(+e | −d) = 0.1

Compute P(A | +e) using Variable Elimination. Show your factors and pick a smart ordering.

**Solution.**

Query: A. Evidence: E = +e. Hidden: B, C, D.

Initial factors (after instantiating E = +e):

- $f_1(A) = P(A)$
- $f_2(A, B) = P(B | A)$
- $f_3(A, C) = P(C | A)$
- $f_4(B, C, D) = P(D | B, C)$
- $f_5(D) = P(+e | D)$

**Pick ordering**: eliminate D first (it's the only variable connecting to evidence), then B, then C.

**Eliminate D.** Factors mentioning D: $f_4(B, C, D)$ and $f_5(D)$. Join:

$$f_6(B, C, D) = f_4(B, C, D) \cdot f_5(D)$$

| B | C | D | $f_6$ |
| :---: | :---: | :---: | ---: |
| + | + | + | 0.95 × 0.9 = 0.855 |
| + | + | − | 0.05 × 0.1 = 0.005 |
| + | − | + | 0.5 × 0.9 = 0.45 |
| + | − | − | 0.5 × 0.1 = 0.05 |
| − | + | + | 0.4 × 0.9 = 0.36 |
| − | + | − | 0.6 × 0.1 = 0.06 |
| − | − | + | 0.05 × 0.9 = 0.045 |
| − | − | − | 0.95 × 0.1 = 0.095 |

Sum out D:

$$f_7(B, C) = \sum_D f_6(B, C, D)$$

| B | C | $f_7$ |
| :---: | :---: | ---: |
| + | + | 0.860 |
| + | − | 0.500 |
| − | + | 0.420 |
| − | − | 0.140 |

**Eliminate B.** Factors mentioning B: $f_2(A, B)$ and $f_7(B, C)$. Join:

$$f_8(A, B, C) = f_2(A, B) \cdot f_7(B, C)$$

(8 rows; compute for each combination.)

Sum out B:

$$f_9(A, C) = \sum_B f_8(A, B, C)$$

For each (A, C), entry is $P(+b | A) f_7(+b, C) + P(−b | A) f_7(−b, C)$:

- $f_9(+a, +c) = 0.7 \times 0.860 + 0.3 \times 0.420 = 0.602 + 0.126 = 0.728$
- $f_9(+a, −c) = 0.7 \times 0.500 + 0.3 \times 0.140 = 0.350 + 0.042 = 0.392$
- $f_9(−a, +c) = 0.2 \times 0.860 + 0.8 \times 0.420 = 0.172 + 0.336 = 0.508$
- $f_9(−a, −c) = 0.2 \times 0.500 + 0.8 \times 0.140 = 0.100 + 0.112 = 0.212$

**Eliminate C.** Factors mentioning C: $f_3(A, C)$ and $f_9(A, C)$. Join and sum out:

$$f_{10}(A) = \sum_C P(C | A) f_9(A, C)$$

- $f_{10}(+a) = 0.8 \times 0.728 + 0.2 \times 0.392 = 0.5824 + 0.0784 = 0.6608$
- $f_{10}(−a) = 0.4 \times 0.508 + 0.6 \times 0.212 = 0.2032 + 0.1272 = 0.3304$

**Join remaining factors** and **normalize**:

$$P(A, +e) \propto f_1(A) \cdot f_{10}(A)$$

- P(+a, +e) ∝ 0.5 × 0.6608 = 0.3304
- P(−a, +e) ∝ 0.5 × 0.3304 = 0.1652

Sum = 0.4956. Normalize:

- **P(+a | +e) = 0.3304 / 0.4956 ≈ 0.6667**
- **P(−a | +e) = 0.1652 / 0.4956 ≈ 0.3333**

**Note on ordering**: if we had eliminated A first, we would have joined $f_1, f_2, f_3$ into a factor over (A, B, C) of size 8 - same as B-first. But for larger networks the difference is huge. The principle: eliminate variables whose joined factor is small.


### Example 5 - Likelihood Weighting

**Question.** Same network as Example 4 (A → B, A → C, B → D, C → D, D → E). Evidence: B = +b, E = +e.

For each of the following samples, compute the weight.

| Sample # | A | B | C | D | E |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | +a | +b | +c | +d | +e |
| 2 | +a | +b | −c | +d | +e |
| 3 | −a | +b | +c | −d | +e |

Then use the weighted sample method to estimate P(A | +b, +e).

**Solution.**

Evidence: B and E. The weight is the product of CPTs of evidence variables given their (sampled or evidence) parents:

$$w = P(B | A) \cdot P(E | D)$$

**Sample 1**: A=+a, B=+b, D=+d → $w_1 = P(+b | +a) \cdot P(+e | +d) = 0.7 \times 0.9 = 0.63$

**Sample 2**: A=+a, B=+b, D=+d → $w_2 = 0.7 \times 0.9 = 0.63$

**Sample 3**: A=−a, B=+b, D=−d → $w_3 = P(+b | −a) \cdot P(+e | −d) = 0.2 \times 0.1 = 0.02$

To estimate P(A | +b, +e):

- Weight for A = +a: $w_1 + w_2 = 1.26$
- Weight for A = −a: $w_3 = 0.02$
- Normalize: P(+a | +b, +e) ≈ 1.26 / 1.28 ≈ 0.984; P(−a | +b, +e) ≈ 0.016

**Common trap caught**: only B and E (the evidence) appear in the weight product. C and D do NOT, even though they were sampled.


### Example 6 - Gibbs Sampling Step

**Question.** Same network (A → B, A → C, B → D, C → D, D → E). Current state: A=+a, B=+b, C=−c, D=+d, E=+e (E is evidence, fixed).

We resample variable C. Compute $P(C | \text{rest})$ using the Markov Blanket.

**Solution.**

Markov Blanket of C:

- Parents: A
- Children: D
- Co-parents (other parents of D): B

So $P(C | \text{rest}) = P(C | A=+a, B=+b, D=+d)$.

Using the Bayes ball / Markov property:

$$P(C | A, B, D) \propto P(C | A) \cdot P(D | B, C)$$

(Notice the second factor uses C - that's the relevant probability of the child given its parents.)

Compute for each value of C:

- $P(+c | +a) \cdot P(+d | +b, +c) = 0.8 \times 0.95 = 0.76$
- $P(−c | +a) \cdot P(+d | +b, −c) = 0.2 \times 0.5 = 0.10$

Normalize:

- **P(+c | rest) = 0.76 / 0.86 ≈ 0.884**
- **P(−c | rest) = 0.10 / 0.86 ≈ 0.116**

Sample from this distribution.

**Lesson**: Gibbs needs *only* the Markov Blanket, not the full network. This makes each step cheap.


### Example 7 - HMM Forward Algorithm (Filtering)

**Question.** HMM with two states $X \in \{a, b\}$ and emissions $E \in \{a, b\}$.

- Prior: P(X_1 = a) = 0.6, P(X_1 = b) = 0.4
- Transitions: P(X_{t+1} = a | X_t = a) = 0.7, P(X_{t+1} = a | X_t = b) = 0.3
- Emissions: P(E = a | X = a) = 0.8, P(E = a | X = b) = 0.2

You observe $E_1 = a, E_2 = b$. Compute $P(X_2 | E_1 = a, E_2 = b)$.

**Solution.**

**Step 0: Initial belief incorporating $E_1$**

Start with prior: $B_0(X) = \langle 0.6, 0.4 \rangle$.

Apply observation $E_1 = a$:

$$B_1(X) \propto P(E_1 = a | X) \cdot B_0(X)$$

- $B_1(a) \propto 0.8 \times 0.6 = 0.48$
- $B_1(b) \propto 0.2 \times 0.4 = 0.08$

Sum = 0.56. Normalize:

- $B_1(a) = 0.48 / 0.56 ≈ 0.857$
- $B_1(b) = 0.08 / 0.56 ≈ 0.143$

**Step 1: Elapse time to t = 2**

$$B'_2(X_2) = \sum_{x_1} P(X_2 | x_1) B_1(x_1)$$

- $B'_2(a) = P(a|a) B_1(a) + P(a|b) B_1(b) = 0.7 \times 0.857 + 0.3 \times 0.143 = 0.600 + 0.043 = 0.643$
- $B'_2(b) = P(b|a) B_1(a) + P(b|b) B_1(b) = 0.3 \times 0.857 + 0.7 \times 0.143 = 0.257 + 0.100 = 0.357$

(Sanity check: 0.643 + 0.357 = 1.0 ✓)

**Step 2: Observe $E_2 = b$**

$$B_2(X_2) \propto P(E_2 = b | X_2) \cdot B'_2(X_2)$$

- $B_2(a) \propto P(b | a) \times 0.643 = 0.2 \times 0.643 = 0.1286$
- $B_2(b) \propto P(b | b) \times 0.357 = 0.8 \times 0.357 = 0.2856$

Sum = 0.4142. Normalize:

- **$P(X_2 = a | E_1=a, E_2=b) ≈ 0.310$**
- **$P(X_2 = b | E_1=a, E_2=b) ≈ 0.690$**

**Lesson**: elapse-then-observe-then-normalize. Sanity-check that elapse preserves the sum (no normalization needed) but observe does not (needs normalization).


### Example 8 - Decision Network MEU and VPI

**Question.** A geologist is deciding whether to drill at a site. Hidden variable Oil ∈ {+o, −o} with P(+o) = 0.4. Action Drill ∈ {+d, −d}.

Utility table:

| Oil | Drill | U |
| :---: | :---: | ---: |
| +o | +d | 100 |
| −o | +d | −50 |
| +o | −d | 0 |
| −o | −d | 0 |

A consultant offers a survey S ∈ {+s, −s} (predicts oil). Survey accuracy:

- P(+s | +o) = 0.8
- P(+s | −o) = 0.2

(a) Compute MEU without the survey, and the optimal action.  
(b) Compute VPI(S). What is the max the consultant should charge?

**Solution.**

**(a) MEU without evidence.**

- EU(+d) = 0.4 × 100 + 0.6 × (−50) = 40 − 30 = **10**
- EU(−d) = 0.4 × 0 + 0.6 × 0 = **0**

MEU() = max(10, 0) = **10**. Optimal: drill.

**(b) VPI(S).**

First compute P(S) by marginalizing:

- P(+s) = P(+s | +o) P(+o) + P(+s | −o) P(−o) = 0.8 × 0.4 + 0.2 × 0.6 = 0.32 + 0.12 = **0.44**
- P(−s) = 1 − 0.44 = **0.56**

Compute P(Oil | S) via Bayes' Rule + normalization:

**Given S = +s:**

- P(+o, +s) = 0.8 × 0.4 = 0.32
- P(−o, +s) = 0.2 × 0.6 = 0.12
- Normalize: P(+o | +s) = 0.32 / 0.44 ≈ **0.727**, P(−o | +s) ≈ **0.273**

**Given S = −s:**

- P(+o, −s) = 0.2 × 0.4 = 0.08
- P(−o, −s) = 0.8 × 0.6 = 0.48
- Normalize: P(+o | −s) = 0.08 / 0.56 ≈ **0.143**, P(−o | −s) ≈ **0.857**

**MEU(S = +s):**

- EU(+d | +s) = 0.727 × 100 + 0.273 × (−50) = 72.7 − 13.65 = **59.05**
- EU(−d | +s) = 0
- MEU(+s) = **59.05**, optimal: drill.

**MEU(S = −s):**

- EU(+d | −s) = 0.143 × 100 + 0.857 × (−50) = 14.3 − 42.85 = **−28.55**
- EU(−d | −s) = 0
- MEU(−s) = **0**, optimal: don't drill.

**Expected MEU with the survey:**

$$\sum_s P(s) \cdot \text{MEU}(s) = 0.44 \times 59.05 + 0.56 \times 0 = 25.98$$

**VPI(S) = 25.98 − 10 = 15.98.**

The consultant should be paid **no more than about $15.98**.

**Lesson**: VPI > 0 here because the survey would change the optimal action (drill if +s, don't drill if −s). If the optimal action were the same in both cases, VPI would be 0.


### Example 9 - VPI = 0 Reasoning

**Question.** In a different setup, the optimal action is "drill" whether the survey returns +s or −s. What is VPI(S)?

**Solution.** Without computing anything: **VPI(S) = 0.**

Why? VPI measures the *gain in MEU* from learning the variable. If the optimal action is identical regardless of S's value, then learning S doesn't change what you do, and the expected utility is the same. Information you don't act on has zero value.

**General rule**: VPI(E') = 0 iff for every value e' of E', the argmax_a EU(a | e') is the same. (Equivalently, $\text{MEU}(e, e') = \text{MEU}(e)$ for all e'.)


### Example 10 - Constructing a Bayes Net + Parameter Count

**Question.** You have variables: Weather (W, 4 values), Traffic (T, boolean), Accident (A, boolean), LateForWork (L, boolean). Causality:

- Weather influences Traffic.
- Weather and Traffic both influence Accident.
- Traffic and Accident both influence LateForWork.

(a) Draw the Bayes Net.  
(b) Write the factored joint.  
(c) Count the total independent parameters needed.

**Solution.**

(a) Edges: W → T, W → A, T → A, T → L, A → L.

(b) Factored joint:

$$P(W, T, A, L) = P(W) \cdot P(T | W) \cdot P(A | W, T) \cdot P(L | T, A)$$

(c) Independent parameter count:

- P(W): 4 values, sum to 1 → **3 params**
- P(T | W): for each of 4 W values, T is boolean → 4 × (2−1) = **4 params**
- P(A | W, T): 4 × 2 = 8 parent combos, A boolean → 8 × 1 = **8 params**
- P(L | T, A): 2 × 2 = 4 parent combos, L boolean → 4 × 1 = **4 params**

**Total = 3 + 4 + 8 + 4 = 19 params.**

Compare to full joint over (W, T, A, L): 4 × 2 × 2 × 2 = 32 entries, so 31 independent params. The BN saves only modestly here because the structure is dense, but in larger sparse networks the savings are exponential.


### Example 11 - Identifying Irrelevant Variables in VE

**Question.** BN: A → B → C → D. Compute P(A | +b). What can you ignore?

**Solution.**

Query: A. Evidence: B = +b. Hidden: C, D.

The factors mentioning C and D are P(C | B) and P(D | C). After instantiating B = +b, P(C | +b) is a distribution over C alone. Summing it out:

$$\sum_C P(C | +b) = 1$$

And the D factor sums to 1 over D for each C. So C and D contribute factors of 1 - they're **irrelevant** to the query.

What remains: $P(A, +b) = P(A) P(+b | A)$. Apply Bayes' Rule directly.

**Lesson**: hidden variables that are leaves *below* all evidence and the query can be dropped without computation. This shortcut appeared on multiple past exams.


### Example 12 - Multi-step HMM with a Missing Observation

**Question.** Same HMM as Example 7. Now you observe $E_1 = a$, $E_2$ is missing, and $E_3 = a$. Compute $P(X_3 | E_1=a, E_3=a)$.

**Solution.**

Start: $B_0(X) = \langle 0.6, 0.4 \rangle$.

**Observe $E_1 = a$** (as in Example 7):

$B_1(a) = 0.857, B_1(b) = 0.143$.

**Elapse to t = 2 (no observation):**

- $B_2(a) = 0.7 \times 0.857 + 0.3 \times 0.143 = 0.643$
- $B_2(b) = 0.3 \times 0.857 + 0.7 \times 0.143 = 0.357$

**Elapse to t = 3 (still no E_2):**

- $B'_3(a) = 0.7 \times 0.643 + 0.3 \times 0.357 = 0.450 + 0.107 = 0.557$
- $B'_3(b) = 0.3 \times 0.643 + 0.7 \times 0.357 = 0.193 + 0.250 = 0.443$

**Observe $E_3 = a$:**

- $B_3(a) \propto 0.8 \times 0.557 = 0.446$
- $B_3(b) \propto 0.2 \times 0.443 = 0.0886$

Normalize (sum = 0.5346):

- **$P(X_3 = a | E_1=a, E_3=a) \approx 0.834$**
- **$P(X_3 = b | E_1=a, E_3=a) \approx 0.166$**

**Lesson**: a missing observation just means an extra elapse-time step (no observation update). Stack as many elapse steps as needed before the next observation arrives.


### Example 13 - Joint Probability from a Bayes Net

**Question.** For Pearl's classic Alarm Network (B → A ← E, A → J, A → M), compute $P(+b, −e, +a, +j, −m)$ given:

- P(+b) = 0.001
- P(+e) = 0.002
- P(+a | +b, +e) = 0.95, P(+a | +b, −e) = 0.94, P(+a | −b, +e) = 0.29, P(+a | −b, −e) = 0.001
- P(+j | +a) = 0.9, P(+j | −a) = 0.05
- P(+m | +a) = 0.7, P(+m | −a) = 0.01

**Solution.**

By the BN joint factorization:

$$P(+b, −e, +a, +j, −m) = P(+b) \cdot P(−e) \cdot P(+a | +b, −e) \cdot P(+j | +a) \cdot P(−m | +a)$$

Plug in:

$$= 0.001 \times 0.998 \times 0.94 \times 0.9 \times 0.3$$

(0.998 = 1 − 0.002; 0.3 = 1 − 0.7)

$$= 0.001 \times 0.998 \times 0.94 \times 0.9 \times 0.3 \approx 0.000253$$

**Lesson**: a full atomic-event probability is just the product of CPT entries. No inference needed - this is the easy version of "compute a joint."


## Part V - Exam-Day Checklist

### Before opening the booklet (60 seconds)

- Recall: VPI ≥ 0, VPI = 0 iff optimal action unchanged.
- Recall: v-structure blocked unless collider OR its descendant observed.
- Recall: Forward + argmax ≠ Viterbi.
- Recall: Gibbs doesn't reject, doesn't use weights.
- Recall: Markov Blanket = parents + children + co-parents (don't forget co-parents).
- Recall: emissions are P(E | X), not P(X | E).

### For every numerical answer

- Did I normalize?
- Did I include co-parents in the Markov Blanket?
- Did I weight VPI sum by P(Y | e), not P(Y)?
- Did I use ONLY evidence-variable CPTs in the LW weight?
- Did I pick the smallest factor in VE ordering?

### For d-separation questions

- Did I draw every undirected path?
- Did I check each triple type along each path?
- Did I check whether descendants of colliders are observed?
- Multiple paths: any single active path breaks independence.

### For HMM filtering

- Did I elapse time BEFORE observing?
- Did I normalize after the observation step?
- Missing observations: multiple elapse-time steps in a row before the next observe.

### Time budget

Typical exam: 6 questions in ~90 minutes. Allocate ~12–15 minutes per question. **T/F should take ≤ 8 minutes total.** Don't spend more than 5 minutes stuck on a sub-step - partial credit on VE and Decision Networks is generous if you show factors / EUs.


## Part VI - Quick Reference Formulas

**Bayes' Rule:**

$$P(a | b) = \frac{P(b | a) P(a)}{P(b)}$$

**Product rule:**

$$P(a, b) = P(a | b) P(b)$$

**Chain rule:**

$$P(X_{1:n}) = \prod_{i=1}^n P(X_i | X_{1:i-1})$$

**Bayes Net joint:**

$$P(X_{1:n}) = \prod_{i=1}^n P(X_i | \text{Parents}(X_i))$$

**Inference by enumeration:**

$$P(Q | e) = \alpha \sum_h P(Q, e, h)$$

**LW weight:**

$$w = \prod_{e_i \in E} P(e_i | \text{Parents}(E_i))$$

**Gibbs full-conditional:**

$$P(X_i | \text{MB}) \propto P(X_i | \text{Parents}(X_i)) \prod_{c \in \text{children}(X_i)} P(c | \text{Parents}(c))$$

**Forward elapse:**

$$B'_{t+1}(X) = \sum_{x_t} P(X | x_t) B_t(x_t)$$

**Forward observe:**

$$B_{t+1}(X) = \alpha\, P(e_{t+1} | X)\, B'_{t+1}(X)$$

**Viterbi:**

$$m_{t+1}(X) = P(e_{t+1} | X) \max_{x_t} P(X | x_t) m_t(x_t)$$

**Expected utility:**

$$EU(a | e) = \sum_y P(y | e, a) U(y, a)$$

**MEU:**

$$\text{MEU}(e) = \max_a EU(a | e)$$

**VPI:**

$$\text{VPI}(E' | e) = \left[\sum_{e'} P(e' | e)\, \text{MEU}(e, e')\right] - \text{MEU}(e)$$


## Part VII - Final Drill Order (Last 24 Hours)

If you only have one day left, in priority order:

1. **D-separation** - work through every triple type until you can do it in your sleep, especially v-structures with observed descendants. (~30 min)
2. **Likelihood weighting weights** - drill 5 different evidence configurations until you instinctively know weight = product over evidence-variable CPTs. (~20 min)
3. **Variable Elimination on a 5-node net** - full pipeline once, paying attention to ordering choice. (~40 min)
4. **Decision Network VPI** - work Example 8 from scratch without looking. (~30 min)
5. **HMM Forward Algorithm** - work Example 7 and Example 12 from scratch. (~30 min)
6. **Markov Blanket + Gibbs step** - Example 6. (~20 min)
7. **T/F warmup list** - read through Part III out loud. (~15 min)

Total: ~3 hours of focused drill, covering ~80% of the exam's point value.

Good luck.