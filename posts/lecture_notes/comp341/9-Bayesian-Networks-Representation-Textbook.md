---
title: "9 - Bayesian Networks: Representation"
date: "2026-05-10"
description: "A comprehensive, textbook-style guide to Bayesian Networks, covering graph semantics, conditional probability tables, construction, and d-separation for conditional independence."
---

# Bayesian Networks: Representation

As we have seen in the study of probability, representing the full joint distribution of a complex environment is computationally intractable. For $n$ variables with a maximum domain size of $d$, the size of the joint distribution table scales as $O(d^n)$. This exponential growth makes it too big to store, too hard for human experts to specify, and too difficult to learn empirically from data.

To solve this, we use **Bayesian Networks** (also known as Bayes' nets, belief networks, or causal networks). A Bayesian Network is a powerful technique for describing complex joint distributions using simple, local distributions based on conditional independence.

By describing how variables interact locally, we can chain these interactions together to model global, indirect interactions across an entire system.

---

## 1. Probabilistic Models

A probabilistic model is fundamentally a joint distribution over a set of variables $P(X_1, X_2, \dots, X_n)$. 
Models describe how a portion of the world works. However, it is crucial to remember that all models are simplifications:
- They may not account for every single variable in the real world.
- They may not perfectly account for all minor interactions between variables.
- As statistician George E. P. Box famously said: *"All models are wrong; but some are useful."*

What do intelligent agents do with probabilistic models? They use them to reason about unknown variables given some observed evidence, calculating posterior probabilities $P(X_q \mid x_{e1}, \dots, x_{ek})$.
Common tasks include:
- **Diagnostic Reasoning (Explanation)**: Reasoning from effects back to causes (e.g., observing a symptom to diagnose a disease).
- **Causal Reasoning (Prediction)**: Reasoning from causes to effects (e.g., predicting that it will rain based on low barometric pressure).
- **Value of Information**: Deciding which additional variables to observe to most effectively reduce uncertainty.

---

## 2. Bayesian Network Semantics

A Bayesian Network is represented formally as a **Directed Acyclic Graph (DAG)** accompanied by a set of conditional probability tables.

### 2.1 Nodes and Arcs
- **Nodes**: Each node represents a random variable in the domain. Nodes can be assigned (observed evidence) or unassigned (unobserved).
- **Arcs (Edges)**: Directed arrows between nodes indicate interactions. Specifically, an arc from node $A$ to node $B$ ($A \to B$) indicates that $A$ has a "direct influence" on $B$. Formally, the topology of these arcs encodes the **conditional independence** assumptions of the model.

### 2.2 Conditional Probability Tables (CPTs)
Every node $X_i$ in the network has an associated conditional probability distribution, given its parents in the graph: 
$$ P(X_i \mid Parents(X_i)) $$

This distribution is typically represented as a Conditional Probability Table (CPT), which quantifies the effect the parents have on the node. A Bayesian Network can be viewed as a description of a noisy, causal process where parents "cause" their children to take on certain values probabilistically.

**Summary**: 
$$ \text{Bayes Net} = \text{Graph Topology (DAG)} + \text{Local CPTs} $$

### 2.3 Example: The Medical Report

Consider a network modeling a student named Mehmet:
- **Variables**: `Weather`, `Sickness`, `Exam`, `Concert`, `MedicalReport`, `Sleepy`, `Boredom`.

**Interactions**:
1. If the `Weather` is bad, Mehmet is more likely to get a `Sickness`. `Weather` also influences whether he attends the `Concert`.
2. `Sickness`, `Exam`, and `Concert` all directly influence the likelihood of getting a `MedicalReport`.
3. Attending the `Concert` or studying for the `Exam` directly makes Mehmet `Sleepy` the next day.
4. `Sickness` and missing the `Concert` directly influence his `Boredom`.

In a Bayesian Network, we represent this by drawing directed arcs from causes to their direct effects. For example, arrows point from `Weather` to `Sickness`, and from `Sickness` to `MedicalReport`.

---

## 3. Probabilities in Bayesian Networks

A Bayesian Network implicitly encodes the full joint probability distribution of its variables. It does this by taking the product of all the local conditional distributions.

To get the probability of any full assignment of variables (an atomic event), you simply multiply the conditional probabilities for each node given its parents:

$$ P(X_1, X_2, \dots, X_n) = \prod_{i=1}^{n} P(X_i \mid Parents(X_i)) $$

### 3.1 Example: The House Alarm
Consider Judea Pearl's classic House Alarm network:
- **Burglar (B)** and **Earthquake (E)** can both cause the **Alarm (A)** to go off.
- The Alarm going off can cause neighbors **John (J)** and **Mary (M)** to call you at work.

The graph topology is: 
$B \to A \leftarrow E$
$J \leftarrow A \to M$

To calculate the probability of a specific full event—for example, a burglary occurs, no earthquake, the alarm rings, John calls, but Mary does not call—we use the formula:
$$ P(+b, -e, +a, +j, -m) = P(+b) \times P(-e) \times P(+a \mid +b, -e) \times P(+j \mid +a) \times P(-m \mid +a) $$

By looking up these specific values in the local CPTs and multiplying them, we obtain the full joint probability without ever having to construct or store the massive full joint distribution table.

---

## 4. Constructing a Bayesian Network

How do we build a valid Bayesian Network from scratch? We use the Chain Rule of probability.

1. **Choose an ordering** of the variables: $X_1, X_2, \dots, X_n$.
2. **For $i = 1$ to $n$**:
   - Add $X_i$ to the network.
   - Select a minimal set of parents from the already added variables $X_1, \dots, X_{i-1}$ such that the conditional independence property holds:
     $$ P(X_i \mid Parents(X_i)) = P(X_i \mid X_1, X_2, \dots, X_{i-1}) $$

Because of the mathematical properties of the Chain Rule, this construction process mathematically guarantees that the network accurately represents the joint distribution.

### 4.1 The Importance of Ordering and Causality
**Ordering matters immensely.** 

While any ordering of variables can technically produce a mathematically valid Bayesian Network (as long as the CPTs are correct), a poor ordering will result in a highly dense graph where nodes have many parents.

**Rule of Thumb**: Always build the network by ordering variables from **causes to effects**. 
When Bayesian Networks reflect true causal patterns:
- The graph is much simpler (nodes have fewer parents).
- It is much easier for humans to understand and think about.
- The local conditional probabilities are much easier to elicit from domain experts.

Topology encodes conditional independence, *not* strict causality. However, causal structures naturally yield the sparsest and most efficient networks.

---

## 5. Size and Efficiency of a Bayes Net

The primary advantage of Bayesian Networks is their compactness. 

Consider a domain with $n$ variables, where the largest domain size of any variable is $d$.
- **Full Joint Distribution Table**: Requires $O(d^n)$ parameters. The space grows exponentially with every new variable.
- **Bayesian Network**: If we construct a network where each node has at most $k$ parents, the size of each CPT is bounded by $O(d^{k+1})$. The total size of the network is $O(n \cdot d^{k+1})$.

If the graph is sparse ($k \ll n$), the reduction is staggering: the space requirement shifts from exponential to **linear** in the number of variables.

For the House Alarm example (5 boolean variables):
- Full joint distribution: $2^5 - 1 = 31$ independent parameters.
- Bayes Net CPTs: $P(B)$ requires 1 parameter, $P(E)$ requires 1, $P(A \mid B, E)$ requires 4, $P(J \mid A)$ requires 2, $P(M \mid A)$ requires 2. Total = $1 + 1 + 4 + 2 + 2 = 10$ parameters.

---

## 6. Independence in a Bayesian Network (D-Separation)

A key task when working with Bayesian Networks is determining whether two variables are conditionally independent given a set of observed evidence variables. We do this by analyzing the graph topology using an algorithm called **d-separation** (direction-dependent separation).

We ask: Are variables $X$ and $Y$ conditionally independent given evidence variables $Z$?
- They are conditionally independent if $X$ and $Y$ are **d-separated** by $Z$.
- We consider all underlying *undirected* paths between $X$ and $Y$. If *every* path between them is "blocked" (inactive) by the evidence $Z$, then $X$ and $Y$ are independent. If even a single path is "active", independence is not guaranteed.

To determine if a path is active or inactive, we must look at every consecutive triple of nodes along the path. There are three canonical configurations (triples):

### 6.1 Causal Chain (A $\to$ B $\to$ C)
In a causal chain, influence flows from cause to effect. 
- **Example**: `Low Pressure` $\to$ `Rain` $\to$ `Traffic`.
- **Unobserved B**: If $B$ (Rain) is unobserved, the path is **active**. Knowing there is low pressure increases the chance of rain, which increases the chance of traffic. $A$ influences $C$.
- **Observed B**: If we *observe* $B$ (we know for a fact it is raining), the path becomes **inactive** (blocked). Knowing about the low pressure gives us no additional information about the traffic. $A \perp C \mid B$.

### 6.2 Common Cause (A $\leftarrow$ B $\to$ C)
A single cause has multiple effects.
- **Example**: `Projector Breaks` $\leftarrow$ `Power Outage` $\to$ `Lights Go Out`.
- **Unobserved B**: If the common cause $B$ is unobserved, the path is **active**. If the projector breaks, it makes a power outage more likely, which in turn makes it more likely the lights are out. $A$ and $C$ are dependent.
- **Observed B**: If we *observe* $B$ (we know there is a power outage), the path becomes **inactive** (blocked). The broken projector and the dark lights are now independent events. $A \perp C \mid B$.

### 6.3 Common Effect / V-Structure (A $\to$ B $\leftarrow$ C)
Two independent causes share a common effect. This is the trickiest case.
- **Example**: `Rain` $\to$ `Traffic` $\leftarrow$ `Ballgame`.
- **Unobserved B**: If the common effect $B$ (and all of its descendants) is unobserved, the path is **inactive** (blocked) by default. Knowing it is raining tells us absolutely nothing about whether there is a ballgame. $A \perp C$.
- **Observed B**: If we *observe* the common effect $B$ (or any of its descendants), the path becomes **active**! If we know there is heavy traffic, the rain and the ballgame are put into *competition* as explanations. If we look out the window and see it is raining, the ballgame becomes *less likely* as the explanation for the traffic. This phenomenon is called **explaining away**. Seeing the effect "activates" the influence between the otherwise independent causes.

### D-Separation Recipe
To check if $X \perp Y \mid Z$:
1. Shade all nodes in the evidence set $Z$.
2. Trace all undirected paths between $X$ and $Y$.
3. A path is active if *every* triple along it is active according to the rules above.
4. If all paths are blocked (contain at least one inactive triple), $X$ and $Y$ are d-separated (conditionally independent).

---

## 7. The Markov Blanket

A powerful concept derived from d-separation is the **Markov Blanket**. 

For any node $X$ in a Bayesian Network, its Markov Blanket consists of:
1. Its parents
2. Its children
3. Its children's other parents

**Property**: A node $X$ is conditionally independent of *every other node in the entire network* given its Markov Blanket. Once you observe the variables in a node's Markov Blanket, observing any other node gives you no additional information about $X$.

---

## Summary

- **Bayesian Networks** provide a natural, graph-based representation for conditional independence.
- By combining **Topology (DAG)** and local **Conditional Probability Tables (CPTs)**, they provide a highly compact representation of the full joint probability distribution.
- Networks constructed using causal orderings are sparse and highly efficient, bringing memory requirements from exponential down to linear.
- We can deduce guaranteed conditional independencies strictly from the graph structure using the **d-separation** algorithm, analyzing Causal Chains, Common Causes, and Common Effects (v-structures).
