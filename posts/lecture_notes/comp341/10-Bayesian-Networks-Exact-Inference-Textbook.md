---
title: "10 - Bayesian Networks: Exact Inference"
date: "2026-05-10"
description: "A comprehensive, textbook-style guide to exact inference in Bayesian Networks, detailing inference by enumeration, factors, and the Variable Elimination algorithm."
---

# 10 - Bayesian Networks: Exact Inference

Once we have constructed a Bayesian Network that represents the probabilistic model of our domain, the primary task is to use it to answer questions. This process is called **Probabilistic Inference**. 

Inference involves calculating a useful quantity—usually a conditional probability—from a joint probability distribution, given some observed evidence. For example, given Judea Pearl's classic Alarm Network: *If Mary calls me to tell me that my house alarm is ringing, how likely is it that there is a burglar?*

There are two primary types of exact queries we ask:
1. **Posterior Probability**: $P(Q \mid E_1=e_1, \dots, E_k=e_k)$ — What is the probability distribution of a query variable $Q$ given the evidence?
2. **Most Likely Explanation (Maximum a Posteriori)**: $\text{argmax}_q P(Q=q \mid E_1=e_1, \dots, E_k=e_k)$ — What is the single most likely state of the query variables given the evidence?

### Probabilistic Inference Methods
The main algorithms used for inference in Bayesian Networks fall into two categories:
- **Exact Inference**: Algorithms that calculate the exact mathematical probabilities.
  - *Inference by Enumeration* (Exponential complexity)
  - *Variable Elimination* (Worst-case exponential complexity, but often much better in practice)
- **Approximate Inference**: Algorithms that estimate probabilities (e.g., Sampling methods like Markov Chain Monte Carlo).

It is important to note that **Exact Inference in Bayesian Networks is generally NP-Hard**.

---

## 1. Inference by Enumeration

Inference by Enumeration is the most fundamental, brute-force way to perform exact inference. 

Let our domain consist of:
- **Evidence variables** $E$ with observed values $e$.
- A **Query variable** $Q$.
- **Hidden variables** $H$ (everything else).

The algorithm proceeds in three steps:
1. **Join**: Multiply together all the relevant conditional probability tables (CPTs) from the Bayesian Network to form the full joint distribution, but only select the entries consistent with the observed evidence $e$.
2. **Marginalize**: Sum out all the Hidden variables $H$ to get the joint distribution of just the Query and the Evidence: $P(Q, e) = \sum_h P(Q, e, h)$.
3. **Normalize**: Divide the resulting table by the sum of its entries to obtain the conditional probability $P(Q \mid e) = \alpha P(Q, e)$.

### The Problem with Enumeration
Consider the Alarm Network (Variables: $B, E, A, J, M$). To calculate $P(B \mid +j, +m)$:
$$ P(B \mid +j, +m) = \alpha \sum_{e} \sum_{a} P(B) P(e) P(a \mid B, e) P(+j \mid a) P(+m \mid a) $$

While straightforward to write, enumeration is incredibly slow. Because you join up the *entire* joint distribution before you sum out any hidden variables, you generate massive intermediate tables. If you have $n$ variables with domain size $d$, you are creating a table of size $O(d^n)$.

---

## 2. Factors and Pointwise Products

To improve upon enumeration, we need a mathematical abstraction. We introduce the concept of **Factors**.

A factor is a multi-dimensional array (a table) that stores non-negative numbers. It represents a "slice" or a "piece" of a probability distribution.
- $P(A)$ is a factor over $A$, let's call it $f_1(A)$.
- $P(B \mid A)$ is a factor over $A$ and $B$, let's call it $f_2(A, B)$.
- An initial local CPT in a Bayes Net is just a factor.

If we assign a value to a variable (e.g., we observe evidence), we "select" a slice of the array. The assigned variable is no longer a missing dimension; the factor shrinks.

### Pointwise Product
The fundamental operation on factors is the **pointwise product** (or "multiplying the tables").
If we have $f_1(X, Y)$ and $f_2(Y, Z)$, their pointwise product yields a new factor $f_3(X, Y, Z)$:
$$ f_1(x_i, y_j) \times f_2(y_j, z_k) = f_3(x_i, y_j, z_k) $$

---

## 3. Variable Elimination

Why is inference by enumeration so slow? Because we wait until the very end to sum out the hidden variables.

The core idea behind the **Variable Elimination (VE)** algorithm is to *interleave* joining and marginalizing. We sum out (eliminate) hidden variables as early as mathematically possible, which shrinks the intermediate factors and saves enormous amounts of computational time and space.

### The Two Basic Operations

1. **Join Factors**: Take all factors that mention a specific variable, and multiply them together using the pointwise product. This creates a single, larger new factor.
2. **Eliminate (Marginalize)**: Take a factor, and sum out a hidden variable. This is a projection operation that shrinks the factor to a smaller one, completely removing the hidden variable from the network.

*Note: In mathematics, this is simply exploiting the distributive property: $xy + xz = x(y+z)$. By summing $y+z$ early, we avoid doing multiple multiplications.*

### The Variable Elimination Algorithm

**Setup**: Start with the initial factors, which are the local CPTs of the Bayesian Network. If you have observed evidence (e.g., $R = +r$), immediately instantiate that evidence in the factors. The initial factor $P(T \mid R)$ simply becomes $P(T \mid +r)$.

**Execution**:
While there are still hidden variables (variables that are neither the Query nor the Evidence):
1. **Pick** a hidden variable $H$.
2. **Join** all factors that mention $H$.
3. **Eliminate** (sum out) $H$ from the resulting joined factor.

**Finish**:
Once all hidden variables are eliminated, you will be left with one or more factors that only mention the Query variable $Q$.
1. **Join** all remaining factors.
2. **Normalize** the resulting table to sum to 1. This gives exactly $P(Q \mid e)$.

---

## 4. Complexity and Variable Ordering

In Variable Elimination, you must pick hidden variables to eliminate one by one. The algorithm works correctly *no matter what order you choose to eliminate the hidden variables*. 

However, the computational and space complexity of the algorithm is entirely determined by the **largest factor** generated during the process. The size of a factor is the number of entries in its table (e.g., a factor over $k$ binary variables has $2^k$ entries).

**The elimination ordering can drastically affect the size of the largest factor.**

### Example of Ordering Impact
Consider a network structured like a star: A single hidden central node $Z$, which points to query nodes $X_1 \dots X_{n-1}$, which in turn point to evidence nodes $Y_1 \dots Y_{n-1}$. 
We want to query $P(X_n \mid y_1, \dots, y_n)$.

- **Ordering 1 (Bad)**: If we eliminate $Z$ *first*, we must join *all* factors mentioning $Z$. Since $Z$ connects to every $X_i$, we create a massive factor over $Z, X_1, X_2, \dots, X_n$. Summing out $Z$ leaves a factor over $n$ variables, requiring a table of size **$2^n$**.
- **Ordering 2 (Good)**: If we eliminate $X_1$ through $X_{n-1}$ first, and save $Z$ for last, we only ever join small factors. For example, to eliminate $X_1$, we join $P(X_1 \mid Z)$ and $P(y_1 \mid X_1)$ and sum out $X_1$, leaving a small factor strictly over $Z$. The maximum factor generated at any point only has 2 variables (size **$2^2$**).

Does there always exist an ordering that results only in small factors? **No.** For highly connected, complex networks, exact inference remains NP-Hard, and large factors are unavoidable. However, choosing a smart elimination ordering (often using greedy heuristics like "eliminate the variable that results in the smallest new factor") makes Exact Inference vastly superior to basic Enumeration in practice.

---

## Summary

- **Inference by Enumeration** is a mathematically correct but highly inefficient brute-force algorithm that joins the entire joint distribution before summing out hidden variables.
- **Factors** are multi-dimensional arrays representing slices of probability distributions.
- **Variable Elimination** interleaves the joining of factors and the marginalization (elimination) of hidden variables. By summing out variables as early as possible, it avoids building massive intermediate tables.
- The **elimination ordering** critically determines the maximum factor size generated during VE. While optimal ordering can reduce complexity from exponential to linear in certain networks, Exact Inference remains NP-Hard in the worst case.
