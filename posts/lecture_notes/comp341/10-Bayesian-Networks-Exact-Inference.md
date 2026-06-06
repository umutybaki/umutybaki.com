---
title: "Lecture 10 Bayesian Networks Exact Inference COMP341"
date: "2026-04-20"
description: "Course: COMP 341 Intro to AI - Koç University"
---

# Lecture 10 Bayesian Networks Exact Inference COMP341

**Course**: COMP 341 Intro to AI - Koç University  
**Instructor**: Asst. Prof. Barış Akgün  
**Topic**: Exact inference in Bayesian Networks - Inference by Enumeration and Variable Elimination


## 0 Big Picture What Is Inference

You have built a Bayesian Network. You have specified the structure (which variables influence which) and you have filled in all the conditional probability tables (CPTs). Now what? The point of the model is to **answer questions** - and answering questions with probabilities is called **probabilistic inference**.

Concretely, inference means: given some observations (evidence), compute the probability of something you care about (query).

Examples:
- Mary called to say my alarm is ringing. How likely is it that there is actually a burglar? → P(Burglary | Alarm=true, Mary-called=true)
- A student presented a medical report. What is the probability that they are genuinely ill? → P(Ill | Report=true)
- It is raining. What is the probability I will be late for class? → P(Late | Rain=true)

**Formal setup**:
- **Query variable(s)** Q: what you want to know the probability of.
- **Evidence variables** E = e: the observations you have made (fixed values).
- **Hidden variables** H: everything else in the network - neither observed nor queried.

What you want: P(Q | E = e)

This lecture covers two exact methods for doing this computation, plus an analysis of when exact inference is feasible.


## 1 The Running Example The Alarm Network

This classic network has five binary variables:

```
    Burglary (B)     Earthquake (E)
          \               /
           \             /
            v           v
               Alarm (A)
              /         \
             v           v
        John calls (J)  Mary calls (M)
```

The intuition: a burglar or an earthquake can trigger your house alarm. If the alarm goes off, John and Mary (your neighbors) might call you.

**Probability tables (CPTs)**:

P(B): P(+b) = 0.001, P(-b) = 0.999  
P(E): P(+e) = 0.002, P(-e) = 0.998

P(A | B, E):

| B  | E  | P(+a) | P(-a) |
| :---: | :---: | ---: | ---: |
| +b | +e | 0.95  | 0.05  |
| +b | -e | 0.94  | 0.06  |
| -b | +e | 0.29  | 0.71  |
| -b | -e | 0.001 | 0.999 |

P(J | A):

| A  | P(+j) | P(-j) |
| :---: | ---: | ---: |
| +a | 0.9   | 0.1   |
| -a | 0.05  | 0.95  |

P(M | A):

| A  | P(+m) | P(-m) |
| :---: | ---: | ---: |
| +a | 0.7   | 0.3   |
| -a | 0.01  | 0.99  |

This network will be used throughout the lecture.


## 2 The Four Methods Overview

The lecture identifies four inference approaches:

| Method | Exact? | Complexity |
| :--- | :--- | :--- |
| Inference by Enumeration | Yes | Exponential (naive) |
| Variable Elimination | Yes | Worst-case exponential, usually much better |
| Polytree / Junction Tree | Yes | Polynomial for restricted topologies |
| Sampling | No (approximate) | Depends on sample count |

**Key fact**: Exact inference in a general Bayesian network is **NP-hard**. This is not a failure of algorithm design - it is a fundamental computational lower bound. For large, complex networks, approximate inference (sampling) becomes necessary. This lecture focuses on exact methods.


## 3 Inference by Enumeration

### 31 The Core Idea

The joint distribution of all variables in a Bayesian network is the product of all CPTs:

```typescript
P(B, E, A, J, M) = P(B) * P(E) * P(A|B,E) * P(J|A) * P(M|A)
```

If you have the full joint distribution, any query can be answered by:
1. **Select** rows consistent with the evidence.
2. **Sum out** (marginalize) hidden variables to get the joint over query + evidence.
3. **Normalize** to get a conditional probability.

Formally:

```
P(Q | E=e) = alpha * P(Q, E=e) = alpha * sum_h P(Q, E=e, H=h)
```

where alpha is a normalization constant (equals 1/P(E=e), but you compute it by normalizing at the end).

### 32 Worked Example PB j m

**Goal**: What is the probability of a burglary given that both John and Mary called?

**Query**: B  
**Evidence**: J = +j, M = +m  
**Hidden**: E, A

**Step 1**: Write the expression.

```
P(B | +j, +m) = alpha * P(B, +j, +m) = alpha * sum_{e,a} P(B, e, a, +j, +m)
```

**Step 2**: Use the BN factorization to expand each term.

```
= alpha * sum_{e,a} P(B) * P(e) * P(a|B,e) * P(+j|a) * P(+m|a)
```

**Step 3**: Enumerate all combinations of hidden variables (e in {+e,-e}, a in {+a,-a}).

For B = +b, we compute four terms:

| e  | a  | P(+b) | P(e)  | P(a\|+b,e) | P(+j\|a) | P(+m\|a) | Product |
| :---: | :---: | ---: | ---: | ---: | ---: | ---: | :--- |
| +e | +a | 0.001 | 0.002 | 0.95       | 0.9      | 0.7      | ~1.197e-6 |
| -e | +a | 0.001 | 0.998 | 0.94       | 0.9      | 0.7      | ~5.916e-4 |
| +e | -a | 0.001 | 0.002 | 0.05       | 0.05     | 0.01     | tiny |
| -e | -a | 0.001 | 0.998 | 0.06       | 0.05     | 0.01     | tiny |

Sum these four terms for B = +b, then do the same for B = -b.

**Step 4**: Normalize. After computing both P(+b, +j, +m) and P(-b, +j, +m), normalize:

```
P(+b | +j, +m) = P(+b, +j, +m) / [P(+b, +j, +m) + P(-b, +j, +m)]
```

The result is approximately 0.284 - about a 28% chance of burglary if both John and Mary call. The alarm being triggered by an earthquake is the competing explanation.

### 33 Why Enumeration is Slow

For a network with n binary variables, the joint distribution has 2^n rows. Summing over all hidden variables means iterating over all 2^|H| combinations. If you have 50 variables and 30 are hidden, that is 2^30 ≈ 10^9 terms per query. This is completely infeasible for large networks.

The key inefficiency: you construct the **entire joint distribution** before summing out. Most of those entries are wasted computation. The insight behind Variable Elimination is to avoid this.


## 4 Factors The Fundamental Building Block

Before explaining Variable Elimination, we need a clean mathematical object to work with. That object is a **factor**.

### 41 What Is a Factor

A **factor** is simply a function (equivalently, a table) that maps an assignment of some set of variables to a non-negative real number.

Formally: a factor f over variables {X_1, ..., X_k} assigns a number f(x_1, ..., x_k) to each possible combination of values.

Intuition: think of a factor as a generalized probability table. It might be a CPT, a joint distribution, or a partial product of CPTs. Unlike a proper probability distribution, a factor does not need to sum to 1 - it just needs to be a table of numbers over some variables.

**Examples of factors in a Bayesian Network**:

1. **Prior probability** P(A): a factor over {A}. For binary A, it has 2 entries.
2. **Conditional probability** P(B|A): a factor over {A, B}. For binary variables, it has 4 entries.
3. **Selected joint** P(A=+a, B): a factor over {B} only (A is fixed). For binary B, it has 2 entries.
4. **Specified family** P(B=+b | A): a factor over {A} only (B is fixed). For binary A, it has 2 entries - but these two numbers do NOT sum to 1 in general.

The key insight: when you fix (observe) a variable to a specific value, it is "removed" as a dimension from the factor - the table becomes smaller.

### 42 The Types of Factors

**Joint distribution P(X, Y)**:
- Entries P(x, y) for all x, y.
- Sums to 1 over all entries.

**Selected joint P(X=x, Y)** - lowercase x means observed:
- Only the rows where X = x are kept.
- Entries P(x, y) for fixed x, all y.
- Sums to P(x), not 1.

**Single conditional P(Y | X=x)**:
- Entries P(y | x) for fixed x, all y.
- Sums to 1 (it is a valid distribution over Y).

**Family of conditionals P(Y | X)**:
- Entries P(y | x) for all x and y.
- Sums to |domain(X)| (each row sums to 1, there are |X| rows).

**Specified family P(Y=y | X)**:
- Entries P(y | x) for fixed y, all x.
- Does NOT sum to 1. These are just numbers proportional to a likelihood.

The general form: a factor is P(Y_1,...,Y_N | X_1,...,X_M) - a multi-dimensional array. Any variable that has been assigned (instantiated to a specific value) shrinks the table by one dimension.

### 43 The Two Factor Operations

Variable Elimination uses exactly two operations on factors.

#### Operation 1: Factor Product (Pointwise Multiplication / Joining)

Given two factors f1(X1,...,Xn, Y1,...,Yk) and f2(Y1,...,Yk, Z1,...,Zl) that share variables Y1,...,Yk, their **product** is a new factor over the union of all their variables:

```
f1 x f2 = f(X1,...,Xn, Y1,...,Yk, Z1,...,Zl)
```

For each row in the product factor, multiply the entries from both factors where the shared variables (Y) match.

**Analogy**: Think of it like a database join. You join two tables on a common key (the shared variables Y), and multiply the values.

**Example from the Traffic Domain**:

R factor:

| R  | value |
| :---: | ---: |
| +r | 0.1   |
| -r | 0.9   |

T|R factor:

| R  | T  | value |
| :---: | :---: | ---: |
| +r | +t | 0.8   |
| +r | -t | 0.2   |
| -r | +t | 0.1   |
| -r | -t | 0.9   |

Product (join on R):

| R  | T  | value             |
| :---: | :---: | :--- |
| +r | +t | 0.1 x 0.8 = 0.08  |
| +r | -t | 0.1 x 0.2 = 0.02  |
| -r | +t | 0.9 x 0.1 = 0.09  |
| -r | -t | 0.9 x 0.9 = 0.81  |

This is P(R, T) - the joint distribution over R and T.

#### Operation 2: Elimination (Sum-Out / Marginalization)

Given a factor f(X, Y1,...,Yk), **summing out** (eliminating) X produces a smaller factor over just Y1,...,Yk:

```
f_{-X}(Y1,...,Yk) = sum_x f(x, Y1,...,Yk)
```

For each setting of the remaining variables, add up all entries over all values of X.

**Example**: Summing out R from the R,T factor above:

| R  | T  | value |
| :---: | :---: | ---: |
| +r | +t | 0.08  |
| +r | -t | 0.02  |
| -r | +t | 0.09  |
| -r | -t | 0.81  |

Summing out R:

| T  | value              |
| :---: | :--- |
| +t | 0.08 + 0.09 = 0.17 |
| -t | 0.02 + 0.81 = 0.83 |

This is P(T) - the marginal distribution over T.


## 5 Inference by Enumeration as Factor Operations

Now we can restate inference by enumeration in the language of factors. This makes the transition to Variable Elimination clean.

**Algorithm**:
1. Initialize factors: one per CPT node. These are your initial factors.
2. Apply evidence: for any variable with an observed value, restrict all factors containing that variable to only the observed value. This reduces the table dimensions.
3. **Join all factors** (multiply them all together to get the full joint).
4. **Eliminate all hidden variables** (sum out each hidden variable from the joint).
5. Normalize the result.

**Traffic Domain Example** (P(L), no evidence):

Variables: R (rain), T (traffic), L (late).

Initial factors: f(R), f(T|R), f(L|T).

Step 3 - Join all:
- Join f(R) and f(T|R) → f(R,T)
- Join f(R,T) and f(L|T) → f(R,T,L) [the full joint]

The full joint f(R,T,L):

| R  | T  | L  | value                        |
| :---: | :---: | :---: | :--- |
| +r | +t | +l | 0.1 x 0.8 x 0.3 = 0.024     |
| +r | +t | -l | 0.1 x 0.8 x 0.7 = 0.056     |
| +r | -t | +l | 0.1 x 0.2 x 0.1 = 0.002     |
| +r | -t | -l | 0.1 x 0.2 x 0.9 = 0.018     |
| -r | +t | +l | 0.9 x 0.1 x 0.3 = 0.027     |
| -r | +t | -l | 0.9 x 0.1 x 0.7 = 0.063     |
| -r | -t | +l | 0.9 x 0.9 x 0.1 = 0.081     |
| -r | -t | -l | 0.9 x 0.9 x 0.9 = 0.729     |

Step 4 - Eliminate R, then T:

After summing out R:

| T  | L  | value              |
| :---: | :---: | :--- |
| +t | +l | 0.024 + 0.027 = 0.051 |
| +t | -l | 0.056 + 0.063 = 0.119 |
| -t | +l | 0.002 + 0.081 = 0.083 |
| -t | -l | 0.018 + 0.729 = 0.747 |

After summing out T:

| L  | value              |
| :---: | :--- |
| +l | 0.051 + 0.083 = 0.134 |
| -l | 0.119 + 0.747 = 0.866 |

So P(Late=+l) = 0.134 (13.4%). The sum is 1.0 - already normalized, since there was no evidence.

The join-everything-then-eliminate approach is inference by enumeration. Note that we built an 8-row table unnecessarily.


## 6 Variable Elimination VE

### 61 The Core Insight

In enumeration, you build the full joint FIRST, then sum out. But the joint can be astronomically large.

The key insight for Variable Elimination: **you can interleave joining and summing-out**. Instead of waiting until you have the full joint to eliminate a variable, eliminate it as soon as you have all the factors that mention it. This keeps intermediate factors small.

**Algebraic analogy**: Suppose you need to compute (u + v)(w + x)(y + z). Naively expanding gives 8 terms: uwy + uwz + uxy + uxz + vwy + vwz + vxy + vxz. But computing the three factors separately requires only 3 multiplications and 3 additions. Variable Elimination exploits this exact factored structure for probability computations.

The lecture explicitly states this algebraic identity:
```typescript
uwy + uwz + uxy + uxz + vwy + vwz + vxy + vxz = (u+v)(w+x)(y+z)
```
VE computes the right-hand side; enumeration computes the left-hand side.

### 62 VE on the Traffic Domain

**Query**: P(L | +r) - probability of being late given it is raining.

**Evidence**: R = +r  
**Hidden variable**: T

**Initial factors** (after instantiating evidence +r):

- f1: P(R) restricted to R=+r → scalar 0.1
- f2: P(T|R) restricted to R=+r → f(T) = {+t: 0.8, -t: 0.2}
- f3: P(L|T) unchanged = {(+t,+l):0.3, (+t,-l):0.7, (-t,+l):0.1, (-t,-l):0.9}

**Step 1**: Eliminate the hidden variable T.
- Collect all factors mentioning T: f2(T) and f3(L|T).
- Join them: f4(T,L) = f2 x f3

| T  | L  | value           |
| :---: | :---: | :--- |
| +t | +l | 0.8 x 0.3 = 0.24 |
| +t | -l | 0.8 x 0.7 = 0.56 |
| -t | +l | 0.2 x 0.1 = 0.02 |
| -t | -l | 0.2 x 0.9 = 0.18 |

- Sum out T from f4(T,L) → f5(L):

| L  | value              |
| :---: | :--- |
| +l | 0.24 + 0.02 = 0.26 |
| -l | 0.56 + 0.18 = 0.74 |

**Step 2**: Join all remaining factors.
- Remaining: f1 = 0.1 (scalar) and f5(L).
- Result: {(+l): 0.1 x 0.26 = 0.026, (-l): 0.1 x 0.74 = 0.074}

**Step 3**: Normalize.
- Sum = 0.026 + 0.074 = 0.1
- P(+l | +r) = 0.026 / 0.1 = 0.26
- P(-l | +r) = 0.074 / 0.1 = 0.74

**Result**: Given that it is raining, there is a 26% chance of being late for class.

**Largest intermediate factor**: f4(T,L) with 4 rows. Enumeration needed 8 rows. The savings grow exponentially with network size.

### 63 VE on the Alarm Network PB j m

**Query**: B  
**Evidence**: J = +j, M = +m  
**Hidden variables**: A, E

**Initial factors** (after instantiating evidence):
- f_B(B): prior on B - {+b: 0.001, -b: 0.999}
- f_E(E): prior on E - {+e: 0.002, -e: 0.998}
- f_A(A|B,E): full CPT for alarm (4 rows, since B and E are still free)
- f_J(A): P(J=+j|A) = {+a: 0.9, -a: 0.05} (J is observed, so this is a 1D factor)
- f_M(A): P(M=+m|A) = {+a: 0.7, -a: 0.01} (M is observed, so also 1D)

**Round 1 - Eliminate hidden variable A**:

Collect all factors mentioning A: f_A(A|B,E), f_J(A), f_M(A).

Join all three. For each (B, E, A) combination, multiply:

| B  | E  | A  | f_A(a|b,e) | f_J(+j|a) | f_M(+m|a) | Product  |
|----|----|----|----|----|----|------|
| +b | +e | +a | 0.95 | 0.9 | 0.7 | 0.5985 |
| +b | +e | -a | 0.05 | 0.05 | 0.01 | 0.000025 |
| +b | -e | +a | 0.94 | 0.9 | 0.7 | 0.5922 |
| +b | -e | -a | 0.06 | 0.05 | 0.01 | 0.00003 |
| -b | +e | +a | 0.29 | 0.9 | 0.7 | 0.1827 |
| -b | +e | -a | 0.71 | 0.05 | 0.01 | 0.000355 |
| -b | -e | +a | 0.001 | 0.9 | 0.7 | 0.00063 |
| -b | -e | -a | 0.999 | 0.05 | 0.01 | 0.0004995 |

Now sum out A to get f(B, E):

| B  | E  | value                            |
| :---: | :---: | :--- |
| +b | +e | 0.5985 + 0.000025 = 0.598525     |
| +b | -e | 0.5922 + 0.00003 = 0.59223       |
| -b | +e | 0.1827 + 0.000355 = 0.183055     |
| -b | -e | 0.00063 + 0.0004995 = 0.0011295  |

**Round 2 - Eliminate hidden variable E**:

Collect factors mentioning E: f_E(E) and the new f(B,E).

Join: multiply each row of f(B,E) by the corresponding P(E):

| B  | E  | value                              |
| :---: | :---: | :--- |
| +b | +e | 0.598525 x 0.002 = 0.001197        |
| +b | -e | 0.59223 x 0.998 = 0.591047         |
| -b | +e | 0.183055 x 0.002 = 0.000366        |
| -b | -e | 0.0011295 x 0.998 = 0.001127       |

Sum out E to get f(B):

| B  | value                          |
| :---: | :--- |
| +b | 0.001197 + 0.591047 = 0.592244 |
| -b | 0.000366 + 0.001127 = 0.001493 |

**Round 3 - Join remaining factors**:

Multiply f(B) (the factor from eliminating A and E) with f_B(B) (the prior):

| B  | value                            |
| :---: | :--- |
| +b | 0.592244 x 0.001 = 0.000592      |
| -b | 0.001493 x 0.999 = 0.001492      |

**Normalize**:
- Sum = 0.000592 + 0.001492 = 0.002084
- P(+b | +j, +m) = 0.000592 / 0.002084 ≈ 0.284
- P(-b | +j, +m) = 0.001492 / 0.002084 ≈ 0.716

**Interpretation**: If both John and Mary call reporting the alarm, there is about a 28.4% chance of an actual burglary. The relatively low probability makes sense - burglaries are rare (0.1% base rate), and the alarm could have been triggered by an earthquake or a false alarm.

### 64 The General VE Algorithm

```text
VE(Query Q, Evidence E=e, Bayesian Network BN):

  1. Initialize factors: one for each CPT in BN
  2. Instantiate evidence: for each evidence variable Ei=ei,
     restrict every factor involving Ei to only the ei rows
  3. While there exist hidden variables (not Q or evidence):
       a. Pick a hidden variable H
       b. Collect all current factors that mention H
       c. Multiply all those factors together -> big_factor
       d. Sum out H from big_factor -> new_factor (does not mention H)
       e. Replace the collected factors with new_factor
  4. Multiply all remaining factors together
  5. Normalize to get a valid probability distribution over Q
```

This algorithm is correct regardless of which order you eliminate hidden variables, but the order **greatly affects efficiency**.


## 7 Elimination Ordering and Complexity

### 71 Why Ordering Matters

Consider the following network structure: Z is connected to X1, X2, ..., X_{n-1}, and each Xi is connected to Xi+1 in a chain. Suppose we want P(Xn | y1,...,yn) where the y's are the evidence values.

**Ordering 1: Eliminate Z first**

When you eliminate Z, you must join all factors that mention Z. Z is connected to all X nodes, so joining on Z creates a factor over {X1, X2, ..., X_{n-1}, Z}, which has n variables. For binary variables, this factor has 2^n entries. Then every subsequent step also touches large factors.

**Ordering 2: Eliminate X1, X2, ..., X_{n-1} first (left to right), then Z**

Each step eliminates a variable that is only connected to its neighbor in the chain. The factor at each step involves at most 2 variables. The maximum factor size is 4 entries regardless of n.

**Result from the lecture**: Ordering 1 generates a maximum factor of size 2^(n+1) entries, while ordering 2 keeps the maximum factor size at 2^2 = 4 entries. This is an exponential difference in both time and memory.

### 72 The Treewidth Connection

The minimum possible maximum factor size (over all orderings) is determined by a graph-theoretic quantity called the **treewidth** of the network's undirected skeleton. If the treewidth is w, then the best-case maximum factor size is d^(w+1) where d is the domain size.

- Trees (singly-connected networks, polytrees): treewidth = 1. Every factor is at most size d^2. Inference is linear in the number of nodes.
- Grid networks: treewidth = O(sqrt(n)). Inference can be exponential in sqrt(n).
- Complete graphs: treewidth = n-1. Inference is fully exponential.

Finding the optimal elimination ordering is itself NP-hard (equivalent to finding minimum treewidth), so in practice heuristics are used:
- **Min-degree**: always eliminate the variable with fewest connections in the current factor graph.
- **Min-fill**: always eliminate the variable that requires adding fewest new edges (fill edges) to the factor graph.

### 73 Complexity Analysis

The computational cost of VE is dominated by the **largest factor generated** during elimination. If the largest factor has k variables with binary domains, it has 2^k entries, and operations on it cost O(2^k).

For each hidden variable elimination step:
- You join all factors containing that variable.
- The resulting factor's domain is the union of all those factors' variables, minus the variable being eliminated.
- Then you sum out one variable, reducing the factor by one dimension.

The total work is: sum over all elimination steps of (size of the joined factor at that step).

**Key facts**:
- VE is always at least as efficient as inference by enumeration (enumeration is VE with the worst possible ordering - eliminate everything at the end).
- For networks with small treewidth, VE runs in polynomial time.
- For networks with high treewidth (dense, complex networks), VE is exponential and approximate inference is needed.

### 74 When Is Exact Inference Feasible

Exact inference in a general Bayesian network is NP-hard. However, it is efficient for:

1. **Polytrees** (singly-connected networks): Networks where there is at most one undirected path between any two nodes. These admit polynomial-time exact inference via belief propagation (the sum-product algorithm on trees).

2. **Sparse networks with small treewidth**: If you can find an elimination ordering that never generates factors larger than some constant k, inference takes O(n * d^k) time.

3. **Small networks**: Even with NP-hardness in theory, practical networks with 20-50 nodes are often tractable if the structure is not too dense.

For very large or densely-connected networks (e.g., large medical diagnosis systems, full image models), **approximate inference** (sampling methods, variational methods) is needed. That is covered in the next lecture.


## 8 Comparing Enumeration and VE SidebySide

**Traffic domain, P(L | +r)**:

| Step | Enumeration | Variable Elimination |
|------|-------------|----------------------|
| Start | f(R), f(T|R), f(L|T) | f(R restricted to +r), f(T|+r), f(L|T) |
| Join phase | Build f(R,T,L) - 8 rows | Never build full joint |
| Eliminate R | Sum R from 8-row table | Already instantiated (scalar 0.1) |
| Eliminate T | Sum T from 4-row table | Join f(T) and f(L|T) → 4-row f(T,L); sum T → 2-row f(L) |
| Largest factor | 8 rows | 4 rows |
| Answer | Normalize remaining 2-row factor | Normalize 2-row f(L) multiplied by scalar 0.1 |

The savings grow exponentially with network size. In enumeration, the full joint grows as d^n. In VE with a good ordering, you may never need more than d^w entries at once (where w is the treewidth of the network, often much smaller than n).


## 9 Common Pitfalls and Conceptual Questions

**Q: What exactly does "normalization" do?**

After summing over hidden variables, you have an unnormalized factor f(Q, E=e) where the values are proportional to the joint probability P(Q, E=e). Normalization divides each entry by the sum of all entries, converting it into a proper conditional probability P(Q | E=e). The alpha in the formulas is just 1/sum_q f(q, E=e).

**Q: Why does the order of elimination matter for efficiency but not for correctness?**

Regardless of order, you are computing the same sum: sum_H P(Q, E=e, H). The order of summation does not change the result (sums commute). But the order determines which intermediate tables you must compute and store - different orders have wildly different time and space costs.

**Q: Can VE handle multiple query variables?**

Yes. Simply leave all query variables in the factor at the end and do not sum them out. The final step (normalize) gives a joint distribution over all query variables.

**Q: What happens to factors with only evidence-instantiated variables?**

If a CPT's variable is observed (evidence), the factor becomes a scalar (a single number). You still include it in the computation - it contributes to the final normalization. For example, if R=+r is observed, f(R) becomes just 0.1. When multiplied with other factors, it scales them down but does not change their structure.

**Q: Why is a "specified family" factor (e.g., P(B=+b | A)) useful?**

This comes up naturally when you observe a child node: you know the outcome and want to work backwards through the CPT. The values P(B=+b | +a) and P(B=+b | -a) do not sum to 1, but they are valid factor entries. When joined with P(A), they correctly propagate the evidence backward through the network (this is the mechanism behind "explaining away").

**Q: Is VE guaranteed to be faster than enumeration?**

VE is never worse than enumeration (you can always choose an ordering that matches enumeration). In practice, with any non-trivial ordering that eliminates variables before building the full joint, VE is dramatically faster. The gains are especially large when the network has a tree-like structure.


## 10 Full Algorithm Summary

**Variable Elimination - Complete Specification**:

```text
Input:  Bayesian network BN = {X1,...,Xn, CPTs}
        Query variable(s): Q subset of {X1,...,Xn}
        Evidence: E = e (specific observed values)
        
Output: P(Q | E=e)

Algorithm:
1. Build initial factor list F = {CPT for each Xi in BN}

2. Instantiate evidence:
   For each factor f in F that mentions any Ei:
       Replace f with f restricted to Ei=ei
       (This reduces f by one dimension per observed variable)

3. Identify hidden variables H = {X1,...,Xn} \ Q \ {E1,...,Ek}

4. Choose an elimination ordering of H: H1, H2, ..., Hm
   (The order matters for efficiency but not correctness)

5. For i = 1 to m:
       F_Hi = {f in F : Hi appears in f}   # factors mentioning Hi
       F = F \ F_Hi                          # remove them from list
       f_new = product of all factors in F_Hi  # join step
       f_new = sum out Hi from f_new           # eliminate step
       F = F union {f_new}                     # add reduced factor

6. f_result = product of all remaining factors in F

7. Normalize f_result over Q and return P(Q | E=e)
```

**Time complexity**: O(n * d^w) where n = number of variables, d = max domain size, w = width of chosen ordering (max factor size - 1).

**Space complexity**: O(d^w) to store the largest factor.


## 11 Key Takeaways

1. **Probabilistic inference** asks: given observations E=e, what is P(Q | E=e)? This is the central computational problem in Bayesian networks.

2. **Inference by Enumeration** builds the full joint distribution first, then marginalizes. It is correct but exponentially slow. O(d^n) where n is the total number of variables.

3. A **factor** is a generalized probability table - a function from variable assignments to non-negative reals. Factors do not need to sum to 1. They are the fundamental computational unit for inference.

4. **Two factor operations** are all you need:
  - **Factor product (join)**: multiply matching entries; produces a larger factor. Like a database join on shared variables.
  - **Sum-out (eliminate/marginalize)**: sum entries over all values of one variable; produces a smaller factor.

5. **Variable Elimination** interleaves joining and elimination. Pick a hidden variable, join all factors mentioning it, sum it out, repeat. This avoids constructing the full joint and is typically far faster.

6. **Ordering matters**: the order in which you eliminate hidden variables determines the size of intermediate factors. Better orderings keep factors small. Finding the optimal ordering is itself NP-hard, but good heuristics (min-degree, min-fill) exist.

7. **Exact inference is NP-hard in general**. For singly-connected (polytree) networks and networks with small treewidth, polynomial-time exact algorithms exist. For large, complex, densely-connected networks, approximate inference (e.g., MCMC sampling) is used instead.

8. **Practical guidance**: always prefer VE over enumeration. When choosing an elimination order, prefer to eliminate variables that are connected to fewer other variables first. In tree-structured networks, always eliminate leaf nodes first (working inward) for optimal efficiency.


## 12 Worked Review Problems

**Problem 1**: In the simple chain A -> B -> C (from the lecture's simple example), with P(+a)=0.1, P(+b|+a)=0.8, P(+b|-a)=0.1, P(+c|+b)=0.3, P(+c|-b)=0.1, compute P(C=+c) using VE.

Solution:
1. Initial factors: f1(A) = {+a:0.1, -a:0.9}, f2(A,B) = CPT of B given A, f3(B,C) = CPT of C given B.
2. No evidence. Hidden variables: A, B. Query: C.
3. Eliminate A first:
  - Factors mentioning A: f1(A), f2(A,B).
  - Join: f4(A,B) = f1 x f2. For each (A,B): 0.1x0.8=0.08, 0.1x0.2=0.02, 0.9x0.1=0.09, 0.9x0.9=0.81.
  - Sum out A: f5(B) = {+b: 0.08+0.09=0.17, -b: 0.02+0.81=0.83}.
4. Eliminate B next:
  - Factors mentioning B: f5(B), f3(B,C).
  - Join: f6(B,C). For each (B,C): (0.17x0.3=0.051), (0.17x0.7=0.119), (0.83x0.1=0.083), (0.83x0.9=0.747).
  - Sum out B: f7(C) = {+c: 0.051+0.083=0.134, -c: 0.119+0.747=0.866}.
5. Normalize f7(C): sum = 1.0 already. P(C=+c) = 0.134.

**Problem 2**: For the chain X1 -> X2 -> ... -> Xn, what is the maximum factor size when eliminating left-to-right (X1 first, then X2, etc.)?

Solution: At each step i, you eliminate Xi by joining f(Xi) [a 1D factor from the previous step's elimination or the prior] with f(Xi+1|Xi) [a 2D CPT]. The joined factor has 2 variables (Xi, Xi+1) with d^2 = 4 entries for binary variables. You sum out Xi to get a 1D factor f(Xi+1). The maximum factor size is always d^2 = 4 regardless of n. This is optimal.

**Problem 3**: Why is it wrong to simply divide the joint distribution by P(E=e) to get P(Q|E=e) in a Bayesian network?

Answer: It is not wrong - it is correct. P(Q|E=e) = P(Q,E=e)/P(E=e) by definition of conditional probability. The issue is computational: computing P(E=e) requires its own marginalization (summing over all other variables), which is just as expensive as the original inference. The normalization trick in VE avoids this by noting that you can compute P(Q,E=e) for each value of Q, and then normalize by dividing by their sum. You never need to compute P(E=e) explicitly.


*End of Lecture 10 Notes - COMP341 Intro to AI*
