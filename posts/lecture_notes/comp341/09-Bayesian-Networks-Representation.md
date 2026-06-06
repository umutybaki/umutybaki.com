---
title: "09 - Bayesian Networks: Representation"
date: "2026-04-13"
description: "Course: COMP 341 Intro to AI - Koç University"
---

# 09 - Bayesian Networks: Representation

**Course**: COMP 341 Intro to AI - Koç University
**Instructor**: Asst. Prof. Barış Akgün



## 1 Why Probabilistic Models

### The Role of Models

When we build an AI agent that must reason about the world, we need a way to represent uncertainty. The world is noisy - sensors fail, outcomes are stochastic, and we never have complete information. A **probabilistic model** is our tool for encoding what we know and what we are uncertain about.

Key design philosophy:
> "All models are wrong; but some are useful." - George E. P. Box

This means: do not aim for a perfect representation of reality. Aim for a model that is *useful enough* to support good reasoning and decision-making.

### What agents do with probabilistic models

An agent uses a probabilistic model to perform **inference**: answering questions about unknown variables given observed evidence.

There are several flavors of reasoning:

| Type | Direction | Example |
| :--- | :--- | :--- |
| **Diagnostic** (explanation) | Effect → Cause | Mehmet has a medical report. Was he sick? |
| **Causal** (prediction) | Cause → Effect | There is an exam tomorrow. Will Mehmet be sleepy? |
| **Value of information** | Any | Should I check the weather before deciding to go to a concert? |

Formally, we want to compute **posterior probabilities**:

$$P(X_q \mid x_{e_1}, x_{e_2}, \ldots, x_{e_k})$$

where $X_q$ is the **query variable** (what we want to know) and $x_{e_1}, \ldots, x_{e_k}$ are the **evidence** (what we have observed).


## 2 The Problem with Full Joint Distributions

### What is a Joint Distribution

A joint distribution over variables $X_1, X_2, \ldots, X_n$ specifies a probability for **every possible combination** of values. If each variable is binary (true/false), there are $2^n$ combinations to enumerate.

For example, with 5 binary variables (Burglar, Earthquake, Alarm, JohnCalls, MaryCalls):
- Full joint table has $2^5 - 1 = 31$ independent numbers.

More generally, for $n$ variables each with domain size $d$:

$$\text{Size of full joint} = O(d^n)$$

This is **exponential in the number of variables**. For real-world problems with dozens or hundreds of variables, this is completely intractable.

### Two Concrete Problems

1. **Too large to store**: With 50 binary variables, you need $2^{50} \approx 10^{15}$ entries - more than a petabyte of memory just to store the table.

2. **Too hard to specify**: Even if you could store it, how would you fill in all those probabilities? You cannot run enough experiments to estimate $10^{15}$ values. Domain experts cannot specify them by hand either.

### The Solution Exploit Conditional Independence

The key insight is that most variables do not directly influence each other. In any real domain, variable $X_i$ typically only has a handful of **direct causes**. If we encode *only* the local, direct relationships, we can:
- Store vastly fewer numbers
- Make the structure interpretable and expert-specifiable
- Learn from data efficiently

**Bayesian Networks** are the formal framework for doing exactly this.


## 3 What Is a Bayesian Network

A **Bayesian Network** (also called a Bayes net, belief network, or probabilistic graphical model) is a compact representation of a joint probability distribution using a directed graph plus a set of local conditional probability tables.

**Informal definition**: A BN is a directed acyclic graph (DAG) where:
- Each **node** represents a random variable.
- Each **edge** $A \to B$ encodes that $A$ directly influences $B$.
- Each node stores the probability of its own value given the values of its **parents** (the nodes with edges pointing into it).

The magic: the whole joint distribution over all variables can be **reconstructed** from just these local tables, using a simple product formula.

### Intuition A Network of Local Influences

Think about how a doctor reasons. They do not memorize every possible combination of symptoms, diseases, and test results. Instead, they know local relationships:
- Pneumonia causes fever.
- Fever causes sweating.
- Smoking causes lung cancer.
- Lung cancer causes a positive X-ray.

Each piece of knowledge is local and manageable. The doctor chains these local facts together to reason about complex scenarios. A Bayesian Network formalizes this kind of reasoning.


## 4 BN Semantics Nodes Arcs CPTs

### Nodes

Each node in a Bayesian Network represents a random variable. The variable can have any domain: binary (yes/no), discrete (sunny/rainy/cloudy), or continuous (though we mostly deal with discrete domains here).

A node can be:
- **Observed** (assigned/evidence): we know its value.
- **Unobserved** (latent/hidden): we do not know its value and want to reason about it.

### Arcs Directed Edges

An arc $A \to B$ says: "A is a **direct parent** of B." Semantically:
- A has a direct influence on B.
- More formally: the arc encodes a conditional independence structure.

**Important**: The graph must be a **DAG** (Directed Acyclic Graph) - no directed cycles allowed. This ensures that the chain rule factorization is valid and well-defined.

### Conditional Probability Tables CPTs

Every node $X_i$ in the network is associated with a **Conditional Probability Table (CPT)**:

$$P(X_i \mid \text{Parents}(X_i))$$

This table specifies the probability of every value of $X_i$ for every possible combination of values of its parents.

**Example**: If $X_i$ is binary and has two binary parents, the CPT has $2^2 = 4$ rows, each containing the probability $P(X_i = \text{true} \mid \text{parent combination})$.

If a node has **no parents** (a root node), its CPT is just a prior probability distribution $P(X_i)$.

**Summary formula**:

$$\text{Bayes Net} = \text{Graph Topology (DAG)} + \text{CPTs}$$


## 5 The Core Formula Joint as Product of Conditionals

### The Main Equation

Given a Bayesian Network over variables $X_1, X_2, \ldots, X_n$, the joint distribution factorizes as:

$$\boxed{P(X_1, X_2, \ldots, X_n) = \prod_{i=1}^{n} P(X_i \mid \text{Parents}(X_i))}$$

This is called the **Bayesian Network factorization**. To find the probability of any complete assignment of all variables, just multiply the appropriate entry from each node's CPT.

### Why Does This Work

This comes from the **chain rule of probability**, applied cleverly:

$$P(X_1, X_2, \ldots, X_n) = \prod_{i=1}^{n} P(X_i \mid X_1, X_2, \ldots, X_{i-1})$$

In most cases, $X_i$ does not depend on *all* of its predecessors - only on its direct parents. So:

$$P(X_i \mid X_1, \ldots, X_{i-1}) = P(X_i \mid \text{Parents}(X_i))$$

This equality holds by **conditional independence** - specifically, the independence assumptions encoded by the BN structure.

### Example Cavity Network

Suppose we have: Cavity causes Toothache and Catch; Sunny weather is independent.

$$P(\text{+cavity, +catch, -toothache, sunny})$$
$$= P(\text{+cavity}) \times P(\text{-toothache} \mid \text{+cavity}) \times P(\text{+catch} \mid \text{+cavity}) \times P(\text{sunny})$$

You simply look up each factor in the appropriate CPT and multiply.


## 6 Worked Examples

### Example 1 Coin Flips Fully Independent

$$X_1 \quad X_2 \quad \cdots \quad X_n$$

Each coin is independent of all others. CPT for each:

| Outcome | Probability |
| :---: | ---: |
| H | 0.5 |
| T | 0.5 |

$$P(H, T, T, H, T, H) = 0.5^6 = 0.015625$$

**Key insight**: If variables are absolutely independent (no causal relationships), the BN has **no arcs at all**. The factorization still works - it is just a product of marginal probabilities.


### Example 2 Rain Causes Traffic

```text
R (Rain)
+r: 0.25
-r: 0.75

T (Traffic | Rain)
+r, +t: 0.75    -r, +t: 0.50
+r, -t: 0.25    -r, -t: 0.50
```

The edge $R \to T$ captures the causal relationship. The joint is:

$$P(T, R) = P(T \mid R) \cdot P(R)$$

**Query**: What is $P(-t, +r)$?

$$P(-t, +r) = P(-t \mid +r) \cdot P(+r) = 0.25 \times 0.25 = 0.0625$$


### Example 3 The House Alarm Network

This is the classic BN example from the lecture.

**Scenario**: "I'm at work. My neighbor John calls to say my alarm is ringing, but Mary does not call. Sometimes alarms are triggered by minor earthquakes. Is there a burglar?"

**Variables**: Burglary (B), Earthquake (E), Alarm (A), JohnCalls (J), MaryCalls (M)

**Network structure**:

```
     B           E
      \         /
       \       /
         Alarm
        /     \
   John        Mary
   Calls       Calls
```

**CPTs**:

| B | P(B) |     | E | P(E) |
| :---: | ---: | :--- | :---: | ---: |
| +b | 0.001 |   | +e | 0.002 |
| -b | 0.999 |   | -e | 0.998 |

| B | E | P(+A \| B, E) |
| :---: | :---: | ---: |
| +b | +e | 0.95 |
| +b | -e | 0.94 |
| -b | +e | 0.29 |
| -b | -e | 0.001 |

| A | P(+J \| A) |     | A | P(+M \| A) |
| :---: | ---: | :--- | :---: | ---: |
| +a | 0.90 |          | +a | 0.70 |
| -a | 0.05 |          | -a | 0.01 |

**Total numbers needed**: 2 + 2 + 4 + 2 + 2 = **12 numbers** (instead of $2^5 - 1 = 31$ for the full joint).

**Joint factorization**:

$$P(B, E, A, J, M) = P(B) \cdot P(E) \cdot P(A \mid B, E) \cdot P(J \mid A) \cdot P(M \mid A)$$

**Example calculation**: $P(+b, -e, +a, +j, -m)$

$$= P(+b) \cdot P(-e) \cdot P(+a \mid +b, -e) \cdot P(+j \mid +a) \cdot P(-m \mid +a)$$
$$= 0.001 \times 0.998 \times 0.94 \times 0.90 \times 0.30 \approx 0.000252$$


### Example 4 Mehmets Day Running Course Example

The lecture uses a relatable story involving a student named Mehmet:

**Variables**: Exam, Concert, Sickness, Weather, MedicalReport, Sleepy, Boredom

**Causal logic**:
- Sick OR Exam OR Concert → likely MedicalReport
- Bad Weather → Sick; Bad Weather also affects Concert
- Sick OR missed Concert → Boredom
- Exam OR Concert → Sleepy (next day)

**Diagnostic reasoning example**: Given that Mehmet has a medical report, what caused it?
- Possible explanations: bad weather, exam pressure, sickness
- BN lets us compute the posterior probability of each explanation given the evidence.


## 7 Constructing a Bayesian Network

### The Algorithm

To build a valid BN, follow this procedure:

1. **Choose an ordering** of variables: $X_1, X_2, \ldots, X_n$.
2. **For each variable** $X_i$ (in order):
  - Add node $X_i$ to the graph.
  - Choose **parents** from $\{X_1, \ldots, X_{i-1}\}$ (only earlier variables!) such that:
$$P(X_i \mid \text{Parents}(X_i)) = P(X_i \mid X_1, X_2, \ldots, X_{i-1})$$
- Equivalently: pick the **minimal** set of earlier variables that makes $X_i$ conditionally independent of all other earlier variables.

### Why This Guarantees Validity

By construction:

$$P(X_1, \ldots, X_n) = \prod_{i=1}^{n} P(X_i \mid X_1, \ldots, X_{i-1}) = \prod_{i=1}^{n} P(X_i \mid \text{Parents}(X_i))$$

The first equality is the chain rule. The second uses conditional independence encoded by the chosen parents.

### Why Ordering Matters

Different orderings can produce very different BN structures. Consider the ordering M, J, A, B, E for the alarm network:

- $P(J \mid M) = P(J)$? **No** - John and Mary are correlated (both caused by Alarm). So $M$ must be a parent of $J$ in this ordering.
- $P(A \mid J, M) = P(A \mid J)$? **No** - $A$ needs both $J$ and $M$ as parents.
- $P(B \mid A, J, M) = P(B \mid A)$? **Yes** - once Alarm is known, John's and Mary's calls add nothing about Burglar.
- $P(E \mid B, A, J, M) = P(E \mid A, B)$? **Yes**.

The causal ordering (B, E, A, J, M) gives a simpler network with fewer arcs.

**Rule of thumb**: Causal orderings (causes before effects) generally produce simpler graphs. This matches domain expert intuitions and makes the model easier to specify.


## 8 Size Comparison Full Joint vs Bayes Net

| Representation | Size |
| :--- | :--- |
| Full joint distribution | $O(d^n)$ |
| Bayes Net (max $k$ parents per node) | $O(n \cdot d^{k+1})$ |

When $k \ll n$ (each node has few parents), this is an **exponential-to-linear** improvement.

### Concrete Example Alarm Network

- $n = 5$ variables, all binary ($d = 2$)
- Full joint: $2^5 - 1 = 31$ numbers
- Bayes Net: $1 + 1 + 4 + 2 + 2 = 10$ numbers

For $n = 30$ binary variables with at most 3 parents:
- Full joint: $2^{30} \approx 10^9$ numbers
- Bayes Net: roughly $30 \times 2^4 = 480$ numbers


## 9 Causality vs Topology

### Do BN Edges Always Represent Causality

**No.** The edges encode **conditional independence**, not necessarily causality. Multiple different DAG structures can represent the same joint distribution.

For Rain–Traffic:
- $R \to T$ (Rain causes Traffic) - valid.
- $T \to R$ (Traffic causes Rain) - also a valid BN encoding the **same** joint $P(R, T)$.

Both are mathematically equivalent.

### Why Causal Structure Is Preferred

When the BN reflects true causal relationships:
- Nodes have **fewer parents** (only true direct causes).
- The model is easier to **understand and explain**.
- Easier to **elicit from domain experts** ("what directly causes this?").
- Easier to reason about **interventions** (what happens if I force a variable to a particular value?).

**Practical advice**: Always try to draw arrows in the causal direction. Your network will be simpler and more interpretable.


## 10 Conditional Independence in a BN

### The Central Question

Given a Bayesian Network, are two nodes $X$ and $Z$ independent, possibly given some observed evidence?

This is non-trivial because influence can flow through the graph in complex ways. The answer depends entirely on the **graph topology** and **which nodes are observed**.

### Why Simple Reachability Is Not Enough

A naive approach: "if there is a path from $X$ to $Z$ not going through an observed node, they are dependent." This almost works but breaks for colliders (common effects). The correct approach requires checking each triple along the path.


## 11 The Three Canonical Structures

All complex independence reasoning in BNs reduces to three simple building blocks.

### Structure 1 Causal Chain

```text
X --> Y --> Z
```

**Real-world example**: Low Pressure → Rain → Traffic

| Query | Answer | Intuition |
| :--- | :--- | :--- |
| $X \perp Z$? (no evidence) | **No** | $X$ influences $Z$ via $Y$ |
| $X \perp Z \mid Y$? | **Yes** | Once rain is known, pressure adds nothing for traffic |

**Proof that $X \perp Z \mid Y$**:

$$P(Z \mid X, Y) = \frac{P(X, Y, Z)}{P(X, Y)} = \frac{P(X) P(Y \mid X) P(Z \mid Y)}{P(X) P(Y \mid X)} = P(Z \mid Y)$$

**Key phrase**: Observing the middle node $Y$ **blocks** the chain. Evidence along the chain does not flow past an observed variable.


### Structure 2 Common Cause Fork

```
     Y
    / \
   X   Z
```

**Real-world example**: Weather → Both Roof Drip and Traffic

| Query | Answer | Intuition |
| :--- | :--- | :--- |
| $X \perp Z$? (no evidence) | **No** | Knowing $X$ reveals $Y$, which tells you about $Z$ |
| $X \perp Z \mid Y$? | **Yes** | Once the common cause is known, effects are independent |

**Proof that $X \perp Z \mid Y$**:

$$P(Z \mid X, Y) = \frac{P(Y) P(X \mid Y) P(Z \mid Y)}{P(X, Y)} = \frac{P(X, Y) P(Z \mid Y)}{P(X, Y)} = P(Z \mid Y)$$

**Key phrase**: Observing the common cause $Y$ **blocks** the fork. Knowing the cause screens off the correlation between effects.

**Analogy**: Two siblings have blue eyes because of shared genetics. Once you know the parents' genotypes, the siblings' eye colors are independent of each other.


### Structure 3 Common Effect VStructure Collider

```text
X --> Y <-- Z
```

**Real-world example**: Burglar → Alarm ← Earthquake

| Query | Answer | Intuition |
| :--- | :--- | :--- |
| $X \perp Z$? (no evidence) | **Yes** | Separate independent causes |
| $X \perp Z \mid Y$? | **No** | Observing the effect creates competition |

**Why $X \perp Z$ (no evidence)**:

$$P(X, Z) = \sum_y P(X, Y=y, Z) = \sum_y P(X) P(Z) P(Y=y \mid X, Z) = P(X) P(Z)$$

**Why observing $Y$ creates dependence** - called **explaining away** or **Berkson's paradox**:

Suppose the alarm went off (Y = true). If you learn there was an earthquake ($X$ = true), then the need for a burglar to explain the alarm decreases - the earthquake "explains away" the alarm. Knowing the effect creates a dependency between its independent causes.

$$P(Z \mid X, Y) = \frac{P(Z) P(Y \mid Z, X)}{P(Y \mid X)} \neq P(Z \mid Y) \text{ in general}$$

**Key phrase**: Observing the collider $Y$ (or any of its descendants) **opens** the path - the opposite of chains and forks!


### Summary Table of the Three Structures

| Structure | $X \perp Z$? | $X \perp Z \mid Y$? | Effect of observing $Y$ |
| :--- | :--- | :--- | :--- |
| Chain $X \to Y \to Z$ | No | **Yes** | Blocks path |
| Fork $X \leftarrow Y \to Z$ | No | **Yes** | Blocks path |
| Collider $X \to Y \leftarrow Z$ | **Yes** | No | Opens path |

**Critical insight**: For chains and forks, observing the middle node **blocks** information flow. For colliders (v-structures), observing the middle node **opens** information flow. This is the counter-intuitive reversal that makes BN reasoning non-trivial.


## 12 DSeparation The General Algorithm

### Motivation

Real BNs have complex topologies with multiple interleaved paths. We need a systematic way to determine whether any two nodes $X$ and $Y$ are conditionally independent given a set of evidence nodes $Z$.

The algorithm is called **d-separation** (directional separation). It is the foundation of all independence reasoning in Bayesian Networks.

### The DSeparation Algorithm

**Step 1**: Shade all **evidence nodes** (those in the set $Z$).

**Step 2**: Enumerate all **undirected paths** between $X$ and $Y$.

**Step 3**: For each path, check every consecutive triple of nodes along the path:

| Triple type | When is it ACTIVE? | When is it INACTIVE (blocked)? |
| :--- | :--- | :--- |
| Chain: $A \to B \to C$ | $B$ is **unobserved** | $B$ is observed (shaded) |
| Fork: $A \leftarrow B \to C$ | $B$ is **unobserved** | $B$ is observed (shaded) |
| Collider: $A \to B \leftarrow C$ | $B$ or a descendant of $B$ is **observed** | $B$ and all its descendants are unobserved |

A **path is active** if and only if **every triple on the path is active**.

A **path is blocked** if at least one triple on the path is inactive.

**Step 4**: Conclusion:
- If **at least one active path** exists: $X$ and $Y$ are **NOT d-separated** → independence is **not guaranteed**.
- If **all paths are blocked**: $X$ and $Y$ **ARE d-separated** given $Z$ → they are **conditionally independent**.

### Active and Inactive Triples Cheat Sheet

```text
ACTIVE (info flows):
  A --> B --> C    (chain, B unobserved)
  A <-- B --> C    (fork, B unobserved)
  A --> B <-- C    (collider, B or descendant observed)

INACTIVE (info blocked):
  A --> [B] --> C  (chain, B observed)
  A <-- [B] --> C  (fork, B observed)
  A --> B <-- C    (collider, B and all descendants unobserved)
  (where [B] = B is observed/shaded)
```

### Worked Example 1 Rain Network

```text
R (Rain) --> T (Traffic) <-- B (Bad Weather)
                |
               T' (Traffic Tomorrow)
```

**Query**: $R \perp B$ (no evidence)?
- Only path: $R \to T \leftarrow B$
- Triple at $T$: collider, $T$ unobserved → **inactive**.
- All paths blocked → **$R \perp B$: YES**.

**Query**: $R \perp B \mid T$ (given Traffic observed)?
- Path: $R \to T \leftarrow B$
- Triple at $T$: collider, $T$ **observed** → **active**.
- Active path exists → **$R \perp B \mid T$: NO**.

Explanation: Observing traffic activates the collider. Now rain and bad weather are in competition as explanations for the traffic - they become correlated.

### Worked Example 2 Extended Network with L

```text
L --> R --> T <-- B
            |
           T'
```

**Query**: $L \perp B \mid T$?
- Path: $L \to R \to T \leftarrow B$
- Triple at $R$: chain, $R$ unobserved → active.
- Triple at $T$: collider, $T$ **observed** → active.
- The full path is active → **$L \perp B \mid T$: NO**.

**Query**: $L \perp B$ (no evidence)?
- Triple at $T$: collider, $T$ unobserved → inactive.
- Path is blocked → **$L \perp B$: YES**.

### A Common Pitfall

A naive reachability algorithm - "block paths at shaded nodes" - works for chains and forks but **fails for colliders**. Without observation, a collider is a **blocker**. With observation, a collider becomes an **opener**. This is the opposite of the other structures, and forgetting this is a common source of errors.


## 13 The Markov Blanket

### Definition

The **Markov Blanket** of a node $X$ is the minimal set of nodes that, when observed, makes $X$ conditionally independent of **all other nodes** in the network.

$$\text{Markov Blanket}(X) = \text{Parents}(X) \cup \text{Children}(X) \cup \text{Co-parents of children}(X)$$

where "co-parents of children" means: other parents of $X$'s children (excluding $X$ itself).

**Formal property**:

$$X \perp \text{(All variables outside MB)} \mid \text{Markov Blanket}(X)$$

### Why This Exact Set

Each component plays a role:

- **Parents of $X$**: directly determine $X$. Without knowing them, $X$ is not independent of the rest of the graph.
- **Children of $X$**: $X$ directly influences them; observing a child provides information about $X$.
- **Co-parents (other parents of children)**: because of the collider (explaining-away) effect. Once a child $C$ is observed, $X$ becomes correlated with $C$'s other parents. Including those co-parents in the blanket removes this dependency.

### Visual Intuition

```text
        P1    P2        <- Parents of X
          \  /
           X            <- The node
          / \
        C1   C2         <- Children of X
       / \
     CP1  CP2           <- Co-parents: other parents of C1
```

Markov Blanket of $X$ = {P1, P2, C1, C2, CP1, CP2}

Once all these are observed, knowing the value of any other node in the network gives you no additional information about $X$.

### Practical Importance

The Markov blanket concept is central to:
- **Gibbs sampling**: sample each variable conditioned only on its Markov blanket.
- **Feature selection in ML**: the Markov blanket of a target variable contains the optimal minimal feature set for prediction.
- **Local BN learning**: when learning structure from data, only search within Markov blankets.


## 14 Summary and Key Takeaways

### What Is a Bayesian Network

A BN is a compact, interpretable representation of a joint probability distribution. It has two components:

1. **A DAG**: nodes are variables, edges encode direct influence and conditional independence structure.
2. **CPTs**: each node stores $P(X_i \mid \text{Parents}(X_i))$.

### The Core Equation

$$P(X_1, X_2, \ldots, X_n) = \prod_{i=1}^{n} P(X_i \mid \text{Parents}(X_i))$$

This compresses an exponentially large table into a linear number of local tables.

### Size Win

| | Full Joint | Bayes Net (max $k$ parents) |
| :--- | :--- | :--- |
| Size | $O(d^n)$ | $O(n \cdot d^{k+1})$ |
| Alarm net ($n=5, d=2$) | 31 entries | 10 entries |

### Reading Independence from the Graph DSeparation

To check $X \perp Y \mid Z$:
1. Shade evidence nodes $Z$.
2. For every undirected path between $X$ and $Y$, check all triples.
3. Chain/Fork triple: blocked when middle node is **observed**.
4. Collider triple: blocked when middle node and all its descendants are **unobserved** (active when middle node or descendant is observed).
5. All paths blocked → $X$ and $Y$ are d-separated → **independent**.

### The Three Canonical Structures Summary

```text
Chain:    X --> Y --> Z
  No obs Y:   X and Z DEPENDENT
  Obs Y:      X and Z INDEPENDENT   (Y blocks)

Fork:     X <-- Y --> Z
  No obs Y:   X and Z DEPENDENT
  Obs Y:      X and Z INDEPENDENT   (Y blocks)

Collider: X --> Y <-- Z
  No obs Y:   X and Z INDEPENDENT   (Y blocks by default)
  Obs Y:      X and Z DEPENDENT     (Y opens -- explaining away)
```

### Markov Blanket

The minimal set of nodes that screens a variable from the rest:

$$\text{MB}(X) = \text{Parents}(X) + \text{Children}(X) + \text{Co-parents of children}(X)$$

### Tips for Exam and Practice

1. **Draw the BN before computing anything** - the graph structure determines all independence relationships.
2. **Colliders are counter-intuitive**: not observed = blocked; observed = opened.
3. **Always check descendants** for collider activation - not just the collider node itself.
4. **Causal direction preferred**: fewer arcs, more interpretable, easier to specify.
5. **Every CPT row must sum to 1**: use this as a sanity check.
6. **The Markov blanket includes co-parents** - a common oversight is forgetting to include the other parents of $X$'s children.


## Appendix Quick Reference Tables

### Notation

| Symbol | Meaning |
| :--- | :--- |
| $P(X_i \mid \text{Pa}(X_i))$ | CPT for node $X_i$ given its parents |
| $X \perp Y$ | $X$ and $Y$ are marginally independent |
| $X \perp Y \mid Z$ | $X$ and $Y$ are conditionally independent given $Z$ |
| DAG | Directed Acyclic Graph |
| CPT | Conditional Probability Table |
| MB$(X)$ | Markov Blanket of $X$ |

### DSeparation Triple Rules

| Triple | Active when | Blocked when |
| :--- | :--- | :--- |
| $A \to B \to C$ | $B$ unobserved | $B$ observed |
| $A \leftarrow B \to C$ | $B$ unobserved | $B$ observed |
| $A \to B \leftarrow C$ | $B$ or descendant observed | $B$ and all descendants unobserved |

### Three Structures Independence Table

| Structure | $X \perp Z$ (marginal) | $X \perp Z \mid Y$ (conditional) |
| :--- | :--- | :--- |
| Causal Chain $X \to Y \to Z$ | No | **Yes** |
| Common Cause $X \leftarrow Y \to Z$ | No | **Yes** |
| Common Effect $X \to Y \leftarrow Z$ | **Yes** | No |
