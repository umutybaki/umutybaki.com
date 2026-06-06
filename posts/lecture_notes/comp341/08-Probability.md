---
title: "Lecture 8 Probability COMP341"
date: "2026-04-06"
description: "Koç University | Intro to Artificial Intelligence | Asst. Prof. Barış Akgün"
---

# Lecture 8 Probability COMP341
**Koç University | Intro to Artificial Intelligence | Asst. Prof. Barış Akgün**



## 1 Why Uncertainty Motivation

### The Real World Is Messy

Up to this point in COMP341, the agents we designed (search, CSPs, adversarial search) assumed that the agent always knew exactly what was happening in the world. But real environments are not like that.

Consider a concrete example from the slides: **"Should I leave for the airport t minutes before my flight?"**

If you try to model this with pure TRUE/FALSE logic, you have two bad options:

- **Option A (Risky):** Assert "Leaving 25 minutes early will get me there on time." This is a lie - it might not be true.
- **Option B (Weak):** Assert "Leaving 25 minutes early will get me there on time IF there's no accident on the bridge AND it doesn't rain AND my tires stay intact AND there's no construction AND ..." This is technically more honest but practically useless. You can never list *all* conditions. (This is called the **qualification problem** in AI.)

The slide gives a funny illustration: you'd have to leave 1440 minutes (24 hours!) early to be *logically certain* of arriving on time.

### Sources of Uncertainty

The lecture categorizes uncertainty into six types:

| Source | Meaning | Example |
| :--- | :--- | :--- |
| Partial observability | You can't see the whole state of the world | Traffic jams you haven't encountered yet; opponents' cards in poker |
| Noisy sensors | Your measurements are imperfect | GPS has +/-5m error; a thermometer drifts |
| Uncertain action outcomes | Your actions don't always have the effect you expect | You command "turn left" but slip on ice |
| Unexpected events | The world does things you didn't model | A sudden accident, an earthquake |
| Inherent stochasticity | Some things are genuinely random (quantum level) | Radioactive decay |
| Complexity of modelling | The world is too complex to fully model | Predicting stock prices |

**The solution:** instead of binary TRUE/FALSE, use **probability** to summarize our uncertainty. Probability gives us a *degree of belief* in a statement.

### Epistemic vs Objective Probability

This is subtle but important: in this course, **probability is treated as an agent's belief state**, not a claim about objective reality.

When we write P(A_25 | no reported accidents) = 0.06, we mean: *given the agent's knowledge that there are no reported accidents, it believes there is a 6% chance that leaving 25 minutes early will get it to the airport on time.* This is sometimes called the **Bayesian** or **subjective** interpretation of probability.

The cool thing: new evidence *updates* the probability.
- P(A_25 | no reported accidents) = 0.06
- P(A_25 | no reported accidents, it is 5AM) = 0.15 (5AM has less traffic, so the probability goes up)


## 2 Random Variables and Sample Spaces

### What Is a Random Variable

A **random variable** is a quantity about the world that we are uncertain about. Think of it as a question we have about the world, with a set of possible answers.

| Variable | Question | Possible Values (Domain) |
| :--- | :--- | :--- |
| Cavity | Do I have a cavity? | {true, false} |
| Weather | What is the weather like? | {sunny, rain, cloudy, snow} |
| A (airport time) | How long to drive to airport? | [0, infinity) - any non-negative real |
| D (dice roll) | What did the die land on? | {1, 2, 3, 4, 5, 6} |

The set of all possible values a random variable can take is called its **domain** (or **sample space** when talking about a single experiment).

### Formal Notation

The lecture introduces formal notation:

- **Omega (capital):** The **sample space** - the set of all possible outcomes. Example: for a 6-sided die, Omega = {1, 2, 3, 4, 5, 6}.
- **omega (lowercase):** A single **sample point** (also called a *possible world* or *atomic event*) - one specific outcome. Example: omega = 3 (the die landed on 3).
- **A probability model** assigns a probability P(omega) to every omega in Omega.
- **An event A** is any *subset* of Omega. The probability of event A is the sum of probabilities of all sample points in A.
  - Example: A = "rolling a 3 or a 6" = {3, 6}. P(A) = P(3) + P(6) = 1/6 + 1/6 = 1/3.
- **F (the event space):** The **power set** of Omega - i.e., the set of *all possible subsets* of Omega (all possible events).

**Shorthand:** When every value in the domain is unique, we write P(omega) instead of P(D = omega).


## 3 Probability Axioms

All of probability theory is built on three foundational axioms (the **Kolmogorov axioms**):

### Axiom 1 NonNegativity

```
P(E) is a real number, P(E) >= 0, for all E in F
```

Every event has a probability that is a non-negative real number. Probabilities cannot be negative.

### Axiom 2 Normalization

```
P(Omega) = 1
```

The probability of *something* happening is 1. The total probability across all possible outcomes is exactly 1.

### Axiom 3 Additivity for Mutually Exclusive Events

```typescript
P(E_1 union E_2 union ...) = P(E_1) + P(E_2) + ...
where the events E_i are mutually exclusive (disjoint - they can't both happen at once)
```

If two events cannot happen at the same time, the probability of "either one happening" is the sum of their individual probabilities.

### Consequences

From these three axioms, we can derive important results:

1. **Probabilities sum to 1:** The sum of P(omega) for all omega in Omega = 1
2. **Probabilities are bounded:** 0 <= P(E) <= 1
3. **Monotonicity:** If A is a subset of B, then P(A) <= P(B)
4. **Empty set:** P(empty set) = 0
5. **Complement rule:** P(A^c) = 1 - P(A)
6. **Union rule (inclusion-exclusion):** P(A union B) = P(A) + P(B) - P(A intersect B)

**Why subtract P(A intersect B) in rule 6?** Because if A and B overlap, the overlap region gets counted twice if you just add P(A) + P(B). Subtracting P(A intersect B) corrects for the double counting.

**Intuitive Example of Complement Rule:** If there's a 30% chance of rain today, there's a 70% chance of no rain. P(rain) = 0.3 → P(no rain) = 1 - 0.3 = 0.7.


## 4 Probability Distributions Discrete and Continuous

### Discrete Distributions

A **probability distribution** assigns a probability to each value in a variable's domain. It is like a lookup table.

For a discrete variable, this is just a table:

**Temperature T:**
| T | P |
| :---: | ---: |
| hot | 0.5 |
| cold | 0.5 |

**Weather W:**
| W | P |
| :---: | ---: |
| sun | 0.6 |
| rain | 0.1 |
| fog | 0.3 |
| meteor | 0.0 |

Note: all probabilities in a table must **sum to 1**.

These are called **prior** (or **unconditional**) probabilities - the agent's beliefs *before* observing any new evidence.

### Continuous Distributions

For continuous random variables (like "how long until the bus arrives?"), you can't list every possible value - there are infinitely many.

Instead, we use a **probability density function (PDF)** - a function f(x) that is always non-negative and integrates to 1:

```text
integral from -inf to +inf of f(x) dx = 1
```

The probability that the variable falls in some interval [a, b] is:

```text
P(a <= X <= b) = integral from a to b of f(x) dx
```

**Two common examples:**

**Uniform distribution U(18, 26):** Every value between 18 and 26 is equally likely. The PDF is flat: f(x) = 1/8 for x in [18, 26], and 0 elsewhere.

**Gaussian (Normal) distribution:** The famous "bell curve." The PDF is:

```text
f(x) = (1 / sqrt(2 * pi * sigma^2)) * exp( -(x - mu)^2 / (2 * sigma^2) )
```

where mu is the mean (center) and sigma is the standard deviation (spread). Most values cluster near mu.


## 5 Joint Probability Distributions

### What Is a Joint Distribution

So far we have talked about single variables. But in AI, we almost always care about *multiple* variables and their relationships.

A **joint probability distribution** over a set of random variables assigns a probability to every possible combination of values.

**Example: Temperature (T) and Weather (W)**

| T | W | P |
| :---: | :---: | ---: |
| hot | sun | 0.4 |
| hot | rain | 0.1 |
| cold | sun | 0.2 |
| cold | rain | 0.3 |

All four entries sum to 1.0.

### Why Is the Joint Distribution So Powerful

The lecture states: **"Every question about a domain can be answered by the joint distribution, because every event is a sum of sample points."**

This is a profound statement. If you have the full joint distribution over all variables, you can answer *any* probabilistic query by summing the appropriate rows. It is the ultimate model of your world.

### The Curse of Dimensionality

Unfortunately, joint distributions grow exponentially. If you have n variables each with domain size d, the table has d^n entries.

- 2 binary variables: 2^2 = 4 entries
- 10 binary variables: 2^10 = 1,024 entries
- 30 binary variables: 2^30 = ~1,000,000,000 entries

This is why we need independence and conditional independence - they let us compress the representation.

### Worked Exercise Joint Probabilities

Given:
| X | Y | P |
| :---: | :---: | ---: |
| +x | +y | 0.2 |
| +x | -y | 0.3 |
| -x | +y | 0.4 |
| -x | -y | 0.1 |

**Q1: P(+x, +y)?** Just look it up: **0.2**

**Q2: P(+x)?** Sum all rows where X = +x:
P(+x) = P(+x, +y) + P(+x, -y) = 0.2 + 0.3 = **0.5**

**Q3: P(-y OR +x)?** Use inclusion-exclusion:
- P(-y) = P(+x, -y) + P(-x, -y) = 0.3 + 0.1 = 0.4
- P(+x) = 0.5
- P(-y AND +x) = P(+x, -y) = 0.3
- P(-y OR +x) = 0.4 + 0.5 - 0.3 = **0.6**


## 6 Marginal Distributions Marginalization

### What Is Marginalization

Given a joint distribution over multiple variables, a **marginal distribution** is the distribution over a *subset* of those variables, obtained by summing out the others.

**Intuition:** You "collapse" the table along one dimension by adding up the probabilities.

**Example:** Starting from the joint distribution over T and W:

| T | W | P |
| :---: | :---: | ---: |
| hot | sun | 0.4 |
| hot | rain | 0.1 |
| cold | sun | 0.2 |
| cold | rain | 0.3 |

**Marginal of T** (sum over W):

| T | P |
| :---: | :--- |
| hot | 0.4 + 0.1 = 0.5 |
| cold | 0.2 + 0.3 = 0.5 |

**Marginal of W** (sum over T):

| W | P |
| :---: | :--- |
| sun | 0.4 + 0.2 = 0.6 |
| rain | 0.1 + 0.3 = 0.4 |

### The Marginalization Formula

```text
P(X) = sum over all y of P(X, Y=y)
```

In words: to get the marginal probability of X, sum the joint probability over all possible values of Y. This is also called **"summing out"** Y.


## 7 Conditional Probability

### Intuition for Conditional Probability

A **conditional probability** P(A | B) is the probability of A given that we *know* B is true. It represents our *updated* belief after receiving evidence.

**Example from the lecture:**
- P(cavity | toothache) = 0.8

This means: given that the patient *has* a toothache, there is an 80% probability they have a cavity.

This is called the **posterior** (or **posterior probability**) - our belief *after* observing evidence.

### The Definition

```
P(a | b) = P(a, b) / P(b)     (when P(b) != 0)
```

**Intuition behind the formula:**
- P(a, b) is the probability of both a and b being true.
- P(b) is the probability of b being true.
- Dividing "both true" by "b is true" gives us: among all the worlds where b is true, what fraction also have a true?

**Visual intuition:** Think of all possible worlds. When we condition on b, we *zoom in* to only those worlds where b is true. Then P(a | b) is the fraction of *those* worlds where a is also true.

### Worked Example for Conditional Probability

Using the T, W joint table:

| T | W | P |
| :---: | :---: | ---: |
| hot | sun | 0.4 |
| hot | rain | 0.1 |
| cold | sun | 0.2 |
| cold | rain | 0.3 |

**Q: P(W = sun | T = hot)?**
- P(W = sun, T = hot) = 0.4
- P(T = hot) = 0.4 + 0.1 = 0.5
- P(W = sun | T = hot) = 0.4 / 0.5 = **0.8**

**Q: P(W = rain | T = cold)?**
- P(W = rain, T = cold) = 0.3
- P(T = cold) = 0.2 + 0.3 = 0.5
- P(W = rain | T = cold) = 0.3 / 0.5 = **0.6**

### Worked Exercise Using X Y Table

| X | Y | P |
| :---: | :---: | ---: |
| +x | +y | 0.2 |
| +x | -y | 0.3 |
| -x | +y | 0.4 |
| -x | -y | 0.1 |

**Q1: P(+x | +y)?**
- P(+y) = 0.2 + 0.4 = 0.6
- P(+x | +y) = 0.2 / 0.6 = **1/3 ≈ 0.333**

**Q2: P(-x | +y)?**
- P(-x | +y) = 0.4 / 0.6 = **2/3 ≈ 0.667**
- Note: P(+x | +y) + P(-x | +y) = 1/3 + 2/3 = 1. Check!

**Q3: P(-y | +x)?**
- P(+x) = 0.2 + 0.3 = 0.5
- P(-y | +x) = 0.3 / 0.5 = **0.6**

### Conditional Distributions

A **conditional distribution** is a full probability distribution over one variable, given a fixed value for another. It is a "slice" of the joint table, normalized to sum to 1.

**P(W | T = hot):**
| W | P |
| :---: | ---: |
| sun | 0.8 |
| rain | 0.2 |

**P(W | T = cold):**
| W | P |
| :---: | ---: |
| sun | 0.4 |
| rain | 0.6 |

These must each sum to 1 within the fixed condition.


## 8 The Normalization Trick

### The Problem

Computing a conditional distribution P(X | evidence) requires:
1. Finding all joint entries that match the evidence.
2. Dividing by P(evidence).

But computing P(evidence) separately is sometimes inconvenient.

### The Trick

Instead of dividing by P(evidence) explicitly, you can:
1. **Select** all rows in the joint table that match the evidence.
2. **Normalize** the selected rows (divide each by their sum, so they add up to 1).

**Why does this work?** Because the sum of the selected rows equals P(evidence). When you normalize, you are dividing by exactly that sum - which is the same as dividing by P(evidence). The constant you divide by is often written as alpha or with a bar notation.

### Worked Example for The Normalization Trick

**Q: P(W | T = cold) from:**
| T | W | P |
| :---: | :---: | ---: |
| hot | sun | 0.4 |
| hot | rain | 0.1 |
| cold | sun | 0.2 |
| cold | rain | 0.3 |

Step 1 - Select rows with T = cold:
| T | W | P |
| :---: | :---: | ---: |
| cold | sun | 0.2 |
| cold | rain | 0.3 |

Step 2 - Sum of selected rows = 0.2 + 0.3 = 0.5 = P(T = cold)

Step 3 - Normalize:
- P(W = sun | T = cold) = 0.2 / 0.5 = **0.4**
- P(W = rain | T = cold) = 0.3 / 0.5 = **0.6**

### Exercise PX Y y

| X | Y | P |
| :---: | :---: | ---: |
| +x | +y | 0.2 |
| +x | -y | 0.3 |
| -x | +y | 0.4 |
| -x | -y | 0.1 |

Step 1 - Select rows with Y = -y: (+x, -y): 0.3 and (-x, -y): 0.1
Step 2 - Sum = 0.3 + 0.1 = 0.4 = P(Y = -y)
Step 3 - Normalize:
- P(+x | -y) = 0.3 / 0.4 = **0.75**
- P(-x | -y) = 0.1 / 0.4 = **0.25**


## 9 Probabilistic Inference and Inference by Enumeration

### The Probabilistic Inference Framework

Real AI problems involve reasoning about unknown things from known things. The lecture formalizes this as:

- **All variables:** X = {X_1, X_2, ..., X_n}
- **Evidence variables E:** Variables we have observed (e.g., sensor readings, symptoms). Their values are given to us.
- **Query variable Q:** The variable we care about and want to compute a distribution over.
- **Hidden variables H:** All remaining variables - not observed, not directly queried. We will marginalize over them.
- **Model:** The full joint distribution P(X_1, X_2, ..., X_n)
- **Goal (Inference):** Compute P(Q | E_1 = e_1, E_2 = e_2, ..., E_k = e_k)

### Inference by Enumeration

The most straightforward approach: use the joint distribution directly.

**Algorithm:**
1. **Select** all rows in the joint table consistent with the observed evidence.
2. **Marginalize (sum out)** the hidden variables H from the selected rows.
3. **Normalize** the result.

**Compact formula:**
```text
P(Q | e_1, ..., e_k) = alpha * sum over h of P(Q, e_1, ..., e_k, h)
```

where alpha is the normalization constant, and the sum is over all combinations of values of the hidden variables h.

### Worked Example 3Variable Table

| S | T | W | P |
| :---: | :---: | :---: | ---: |
| summer | hot | sun | 0.30 |
| summer | hot | rain | 0.05 |
| summer | cold | sun | 0.10 |
| summer | cold | rain | 0.05 |
| winter | hot | sun | 0.10 |
| winter | hot | rain | 0.05 |
| winter | cold | sun | 0.15 |
| winter | cold | rain | 0.20 |

**Q1: P(W)?** (No evidence, no query condition - just marginal)
- Evidence: none. Hidden: S, T. Query: W.
- Select: all 8 rows.
- Sum out S and T:
  - P(W = sun) = 0.30 + 0.10 + 0.10 + 0.15 = 0.65
  - P(W = rain) = 0.05 + 0.05 + 0.05 + 0.20 = 0.35
- Normalize: already sums to 1.0. Result: P(sun) = 0.65, P(rain) = 0.35.

**Q2: P(W | S = winter)?**
- Evidence: S = winter. Hidden: T. Query: W.
- Step 1 - Select rows with S = winter:

| S | T | W | P |
| :---: | :---: | :---: | ---: |
| winter | hot | sun | 0.10 |
| winter | hot | rain | 0.05 |
| winter | cold | sun | 0.15 |
| winter | cold | rain | 0.20 |

- Step 2 - Sum out T:
  - P_unnormalized(W = sun) = 0.10 + 0.15 = 0.25
  - P_unnormalized(W = rain) = 0.05 + 0.20 = 0.25
- Step 3 - Normalize: sum = 0.50, so:
  - P(W = sun | S = winter) = 0.25 / 0.50 = **0.5**
  - P(W = rain | S = winter) = 0.25 / 0.50 = **0.5**

**Q3: P(W | S = winter, T = hot)?**
- Evidence: S = winter, T = hot. Hidden: none. Query: W.
- Select rows with S = winter AND T = hot:
  - (winter, hot, sun): 0.10
  - (winter, hot, rain): 0.05
- No hidden variables to sum out.
- Normalize: sum = 0.15, so:
  - P(W = sun | S = winter, T = hot) = 0.10 / 0.15 = **2/3**
  - P(W = rain | S = winter, T = hot) = 0.05 / 0.15 = **1/3**

### Complexity Problem

This approach is simple but **expensive**:
- **Time complexity:** O(d^n) in the worst case - you have to scan the entire joint table.
- **Space complexity:** O(d^n) - you have to store the entire joint table.

For even modestly sized problems (30+ binary variables), this is completely infeasible. We need smarter representations - that is why independence matters so much.


## 10 The Product Rule and Chain Rule

### The Product Rule

The definition of conditional probability can be rearranged:

```
P(a | b) = P(a, b) / P(b)
```

Multiply both sides by P(b):

```
P(a, b) = P(a | b) * P(b)
```

This is the **product rule**. It lets you *build* a joint distribution from a marginal and a conditional.

Equivalently: P(a, b) = P(b | a) * P(a)

**Example:** Suppose you know:
- P(W = sun) = 0.8, P(W = rain) = 0.2 (marginal distribution over weather)
- P(D = wet | W = sun) = 0.1, P(D = dry | W = sun) = 0.9
- P(D = wet | W = rain) = 0.7, P(D = dry | W = rain) = 0.3

Then the joint distribution is:
| D | W | P(joint) = P(D|W) * P(W) |
|---|---|---|
| wet | sun | 0.1 * 0.8 = **0.08** |
| dry | sun | 0.9 * 0.8 = **0.72** |
| wet | rain | 0.7 * 0.2 = **0.14** |
| dry | rain | 0.3 * 0.2 = **0.06** |

Check: 0.08 + 0.72 + 0.14 + 0.06 = 1.0. Correct.

### The Chain Rule

The product rule applies to two variables. What about three or more? The **chain rule** is just the product rule applied repeatedly:

```
P(X_1, X_2, ..., X_n) = P(X_1) * P(X_2 | X_1) * P(X_3 | X_1, X_2) * ... * P(X_n | X_1, ..., X_{n-1})
```

**Example with three variables:**
```
P(A, B, C) = P(A) * P(B | A) * P(C | A, B)
```

This is always *exactly true* - it is a mathematical identity, not an approximation. It holds for any ordering of variables. The chain rule is the foundation of **Bayesian networks**.


## 11 Bayes Rule

### Derivation

We know from the product rule that a joint probability can be factored two ways:

```
P(a, b) = P(a | b) * P(b) = P(b | a) * P(a)
```

Setting the two right-hand sides equal and dividing by P(b):

```
P(a | b) = P(b | a) * P(a) / P(b)
```

This is **Bayes' Rule** (also called Bayes' Theorem). It is one of the most important formulas in AI and machine learning.

### Terminology

In the context of Bayes' rule, we give each term a name:

| Term | Name | Meaning |
| :--- | :--- | :--- |
| P(a \| b) | Posterior | Probability of a *after* seeing evidence b |
| P(b \| a) | Likelihood | How likely is evidence b if a is true? |
| P(a) | Prior | Probability of a *before* seeing any evidence |
| P(b) | Marginal likelihood / Evidence | Total probability of observing b |

### Why Is This Useful

Often in AI, we know things in one direction but want to reason in the other direction.

**Classic pattern: Diagnostic reasoning**

- We know P(symptom | disease) - the likelihood of a symptom given a disease. Medical textbooks describe this.
- We want P(disease | symptom) - the probability of disease given a symptom. This is what a doctor needs.

Bayes' rule lets us flip the direction.

### Worked Example Meningitis

The lecture gives this example:
- P(stiff neck | meningitis) = 0.7 - if you have meningitis, 70% chance you will have a stiff neck.
- P(meningitis) = 0.000001 - meningitis is rare (1 in a million).
- P(stiff neck) = 0.01 - stiff necks are common (1% of people).

What is P(meningitis | stiff neck)?

```
P(M | S) = P(S | M) * P(M) / P(S)
         = 0.7 * 0.000001 / 0.01
         = 0.0000007 / 0.01
         = 0.00007
```

So having a stiff neck gives you only a **0.007% chance** of meningitis - still very small! But it is 70x higher than the base rate of 0.001%.

**Key insight:** The posterior (0.00007) is still small because the *prior* is extremely small (0.000001). Even a strong symptom can't overcome a very rare base rate. This is why the lecture says "Note: posterior probability of meningitis still very small."

**But:** "Note: you should still get stiff necks checked out!" Why? Because the *consequences* of missing meningitis are severe. Expected utility (recall: decision theory = probability + utility) matters.

### Another Example Wet Road

Given:
- P(W = sun) = 0.8, P(W = rain) = 0.2
- P(D = wet | W = sun) = 0.1, P(D = dry | W = sun) = 0.9
- P(D = wet | W = rain) = 0.6, P(D = dry | W = rain) = 0.4

**Q: P(W | D = dry)?**

Using Bayes' rule (normalization trick):
- P(W = sun, D = dry) = P(D = dry | W = sun) * P(W = sun) = 0.9 * 0.8 = 0.72
- P(W = rain, D = dry) = P(D = dry | W = rain) * P(W = rain) = 0.4 * 0.2 = 0.08
- Sum (normalization constant) = 0.72 + 0.08 = 0.80

Result:
- P(W = sun | D = dry) = 0.72 / 0.80 = **0.9**
- P(W = rain | D = dry) = 0.08 / 0.80 = **0.1**

Intuitively: dry roads strongly suggest it is sunny.

### Bayes Rule with Normalization Constant

We often write:
```
P(a | b) = alpha * P(b | a) * P(a)
```

where alpha = 1/P(b) is the normalization constant we compute at the end to make the distribution sum to 1.


## 12 Independence

### Definition

Two variables X and Y are **independent** if:

```
P(X, Y) = P(X) * P(Y)
```

Equivalently, knowing Y tells you nothing about X:

```
P(X | Y) = P(X)
```

And equivalently:

```
P(Y | X) = P(Y)
```

### Intuition for Independence

Independence means the variables have no relationship to each other. Knowing the value of one gives you zero information about the value of the other.

**Example that IS independent:** A fair coin flip and the roll of a fair die. Knowing the die shows 4 tells you nothing about whether the coin shows heads.

**Example that is NOT independent:** Temperature and Weather. Knowing it is hot increases the probability of sun.

### Spotting Independence from a Table

How can you check if two variables are independent given a joint distribution? Check if the joint equals the product of the marginals.

The lecture shows two tables:

**Table 1 (NOT independent):**
| T | W | P |
| :---: | :---: | ---: |
| hot | sun | 0.4 |
| hot | rain | 0.1 |
| cold | sun | 0.2 |
| cold | rain | 0.3 |

Marginals: P(hot) = 0.5, P(cold) = 0.5, P(sun) = 0.6, P(rain) = 0.4.

Check: P(hot) * P(sun) = 0.5 * 0.6 = 0.30, but P(hot, sun) = 0.4. These are not equal. **Not independent.**

**Table 2 (Independent):**
| T | W | P |
| :---: | :---: | ---: |
| hot | sun | 0.3 |
| hot | rain | 0.2 |
| cold | sun | 0.3 |
| cold | rain | 0.2 |

Marginals: P(hot) = 0.5, P(cold) = 0.5, P(sun) = 0.6, P(rain) = 0.4.

Check: P(hot) * P(sun) = 0.5 * 0.6 = 0.30 = P(hot, sun). All entries match. **Independent.**

### Why Independence Is Powerful

**Example:** n fair, independent coin flips. Each flip is Bernoulli with P(H) = 0.5.

- Without independence: 2^n entries in the joint table.
- With independence: P(flip_1, flip_2, ..., flip_n) = P(flip_1) * P(flip_2) * ... * P(flip_n). Only n parameters needed!

This reduces storage from O(2^n) to O(n) - exponential compression!

### Absolute Independence Is Rare

Most real-world variables have *some* relationship. The Weather and Cavity example: these two variables are plausibly independent (whether it rains doesn't affect your teeth directly), but Weather, Traffic, and Cavity together? Traffic and Weather are definitely related.

Absolute independence, while powerful, is a strong assumption. We need something more flexible - **conditional independence**.


## 13 Conditional Independence

### The Core Idea

**Conditional independence** is one of the most important concepts in probabilistic AI. It says: two variables might be *correlated* in general, but become *independent* once we know a third variable.

**Formal definition:** X and Y are conditionally independent given Z if:

```
P(X | Y, Z) = P(X | Z)
```

Equivalently:
```
P(Y | X, Z) = P(Y | Z)
```

Equivalently (the joint factorizes):
```
P(X, Y | Z) = P(X | Z) * P(Y | Z)
```

### The Toothache Cavity Catch Example

The lecture uses dentistry to build intuition. Three variables:
- **Cavity:** Whether you have a cavity
- **Toothache:** Whether your tooth hurts
- **Catch:** Whether the dentist's probe "catches" on your tooth

**The key insight:** Both toothache and catch are caused by cavity. Once you know whether you have a cavity, the toothache gives you no additional information about whether the probe will catch - and vice versa.

Formally:
```
P(catch | toothache, cavity) = P(catch | cavity)
```

This holds whether cavity is true or false:
- P(catch | toothache, cavity) = P(catch | cavity)
- P(catch | toothache, not-cavity) = P(catch | not-cavity)

So: **Catch is conditionally independent of Toothache given Cavity.**

### Why Does This Compress the Representation

Without any independence assumptions, the full joint P(Toothache, Catch, Cavity) over three binary variables has 2^3 - 1 = **7 independent numbers**.

Using conditional independence and the chain rule:

```
P(Toothache, Catch, Cavity)
  = P(Toothache | Catch, Cavity) * P(Catch, Cavity)
  = P(Toothache | Catch, Cavity) * P(Catch | Cavity) * P(Cavity)
  = P(Toothache | Cavity) * P(Catch | Cavity) * P(Cavity)    [using cond. independence]
```

Number of parameters needed:
- P(Toothache | Cavity): 2 values (P(T|cav), P(T|not-cav)) -> 2 numbers
- P(Catch | Cavity): 2 values -> 2 numbers
- P(Cavity): 1 number

Total: **5 independent numbers** instead of 7. Modest saving here, but scales dramatically for larger networks.

**The key result:** In most cases, the use of conditional independence reduces the size of the representation of the joint distribution from **exponential in n to linear in n**. This is what makes Bayesian networks tractable.

### Analogy Why Conditional Independence Makes Sense

Think of a hidden variable (like Cavity) as the **common cause** of several observable effects (Toothache, Catch). Once you know the cause, the effects become independent of each other. They are only correlated because they share a common cause - once that cause is known, the correlation disappears.

Another example: Rain causes both "wet grass" and "wet car hood." Knowing the grass is wet makes the car hood probably wet too (correlated). But if you know it *rained* (the cause), knowing about the grass does not tell you anything more about the car:

```
P(wet car | rain, wet grass) = P(wet car | rain)
```

### Unconditional vs Conditional Independence

The lecture makes an important observation:

- **Unconditional (absolute) independence** is very rare in practice. Most variables have at least some indirect relationship.
- **Conditional independence** is our most basic and robust form of knowledge about uncertain environments.

This is why Bayesian networks (coming up next) are so useful - they explicitly encode which variables are conditionally independent given which other variables.


## 14 Naive Bayes A Special Case

### The Setup

The **Naive Bayes model** is an extremely useful and important model in machine learning. It assumes that all "effects" are conditionally independent given the "cause."

Formally, given a single cause variable C and n effect variables E_1, E_2, ..., E_n:

```text
P(C, E_1, E_2, ..., E_n) = P(C) * product over i of P(E_i | C)
```

### Bayes Rule Applied to Naive Bayes

This lets us compute the probability of the cause given all effects:

```typescript
P(C | E_1, E_2, ..., E_n) = alpha * P(C) * product over i of P(E_i | C)
```

where alpha is the normalization constant.

**Worked out in the lecture:**
```
P(Cavity | toothache AND catch)
  = alpha * P(toothache AND catch | Cavity) * P(Cavity)
  = alpha * P(toothache | Cavity) * P(catch | Cavity) * P(Cavity)
```

The second step uses the conditional independence assumption.

### Why Naive

The assumption that all effects are *unconditionally independent given the cause* is a strong ("naive") assumption. In practice, symptoms are often correlated even given the diagnosis. But despite the simplicity of the assumption, Naive Bayes works surprisingly well in many domains (spam filtering, medical diagnosis, text classification).

### Parameter Count

With n effects each taking 2 values, and a binary cause:
- P(Cause): 1 parameter
- P(E_i | Cause): 2 parameters per effect * n effects = 2n parameters
- **Total: 2n + 1 parameters** - linear in n!

Compare to the full joint table which would have 2^(n+1) entries - exponential in n.


## 15 Summary of All Probability Rules

### Quick Reference

**Conditional Probability:**
```
P(a | b) = P(a, b) / P(b)
```

**Product Rule:**
```
P(a, b) = P(a | b) * P(b) = P(b | a) * P(a)
```

**Chain Rule:**
```text
P(X_1, X_2, ..., X_n) = product over i of P(X_i | X_1, ..., X_{i-1})
```

**Bayes' Rule:**
```
P(a | b) = P(b | a) * P(a) / P(b)
```

**Marginalization:**
```text
P(X) = sum over all y of P(X, Y=y)
```

**Independence (X independent of Y):**
```
P(X, Y) = P(X) * P(Y)  iff  P(X | Y) = P(X)
```

**Conditional Independence (X independent of Y given Z):**
```
P(X, Y | Z) = P(X | Z) * P(Y | Z)  iff  P(X | Y, Z) = P(X | Z)
```

**Naive Bayes:**
```text
P(C, E_1, ..., E_n) = P(C) * product over i of P(E_i | C)
```

### The Big Picture

This lecture establishes the probabilistic foundations needed for the rest of the course:

1. **Joint distributions** are the gold standard - they can answer any query - but are exponentially large.
2. **Inference by enumeration** (select, marginalize, normalize) is the conceptually simple but computationally expensive approach.
3. **Product, chain, and Bayes' rules** give us algebraic tools to manipulate probability expressions.
4. **Independence** compresses representations exponentially when variables truly have no relationship.
5. **Conditional independence** is the practical powerhouse - most variables in a domain have conditional independence structure that can be exploited.
6. **Naive Bayes** is the simplest and most common pattern: a single cause variable with conditionally independent effects.

These concepts directly motivate **Bayesian Networks** - the next major topic - which provide a graphical language for encoding conditional independence structure in a compact, interpretable way.


*Notes compiled from COMP341 Lecture 8 slides (Asst. Prof. Barış Akgün, Koç University).*
