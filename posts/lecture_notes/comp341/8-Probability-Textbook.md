---
title: "8 - Probability and Uncertainty"
date: "2026-05-10"
description: "A comprehensive, textbook-style guide to representing and quantifying uncertainty using probability, covering random variables, inference by enumeration, Bayes' rule, and conditional independence."
---

# Probability: Representing and Quantifying Uncertainty

The real world is an uncertain place. In classical, deterministic planning, we often assume that an agent operates in an environment where it knows exactly what the state of the world is and what the outcomes of its actions will be. However, in realistic scenarios, an agent must make decisions based on incomplete or noisy information. This chapter introduces the foundations of probabilistic reasoning, providing the mathematical framework necessary to represent, quantify, and manage uncertainty in artificial intelligence.

## 1. The Nature of Uncertainty

Why is the real world uncertain? The uncertainty an intelligent agent faces stems from several fundamental sources:

- **Partial Observability**: The agent cannot see the entire state of the world. For example, a driver experiences the "fog of war" in traffic, a poker player cannot see their opponents' hands, and a doctor cannot see directly inside a patient's body.
- **Noisy Sensors**: Even what the agent *can* observe is subject to error. GPS systems have margin of error, cameras are unreliable in low light, and sonar readings can be distorted.
- **Uncertain Action Outcomes**: An agent's actions may not always succeed as intended. A car might suffer a flat tire or experience wheel slip; an object a robot attempts to lift might be too heavy.
- **Unexpected Events**: Unforeseen occurrences—such as a sudden car accident, an earthquake, or a meteor strike—can abruptly change the state of the world.
- **Inherent Stochasticity**: At a fundamental physical level (e.g., quantum mechanics), the universe contains inherent randomness that can affect both sensors and actuators.
- **Complexity of Modeling**: Predicting complex systems, like the stock market or city-wide traffic patterns, is exceptionally difficult because it involves the behavior of countless other agents and unexpected events.

To solve problems and make rational decisions in such an environment, we need a robust way to represent and quantify this uncertainty.

### 1.1 The General Probabilistic Situation

In a typical probabilistic scenario, the world consists of various variables. We can categorize them based on the agent's knowledge:

- **Observed Variables (Evidence)**: The variables whose values the agent currently knows. These are often derived from sensor readings or observed symptoms.
- **Unobserved Variables**: The variables the agent needs to reason about but cannot directly see, such as the exact location of a hidden object or the specific disease a patient has contracted.
- **Model**: The knowledge the agent possesses about how the known (evidence) variables relate to the unknown variables.

Probabilistic reasoning provides a formal framework for managing the agent's beliefs given its model and the evidence it has collected.

### 1.2 The Failure of Pure Logic

Consider the action $A_t$: "leave for the airport $t$ minutes before the flight." We want to evaluate the statement, "Will $A_t$ get me there on time?"

If we try to evaluate this using pure TRUE/FALSE propositional logic, we run into severe limitations. We cannot realistically list every possible condition that might affect the outcome, nor can we deduce the absolute truth value for sure.

If we make a strict assertion, such as "Leaving 25 minutes early will get me there on time," we risk falsehood—a traffic jam or flat tire would invalidate the statement. Conversely, if we try to make a mathematically sound logical statement, we end up with something too weak or overly complex for practical decision-making: "Leaving 25 minutes early will get me there on time *if* there is no accident on the bridge, *and* it doesn't rain, *and* my tires remain intact..." (This is known as the *qualification problem*). We might logically state, "Leaving 1440 minutes (24 hours) early will get me there on time," but this leads to highly undesirable behavior, such as camping overnight at the airport.

Instead of making absolute logical assertions, we use probability to summarize uncertainty. Probabilities represent the *degree of belief* an agent has that a given statement is true.

- $P(A_{25} \text{ gets me there on time} \mid \text{no reported accidents}) = 0.06$

Crucially, this probability changes as the agent receives new information (evidence). If the agent learns it is 5:00 AM, the roads are likely clearer:

- $P(A_{25} \text{ gets me there on time} \mid \text{no reported accidents, 5 AM}) = 0.15$

In this context, probability statements are not absolute assertions about the universe, but rather assertions about the *knowledge state* of the agent.

### 1.3 Decision Making Under Uncertainty

Once we can quantify uncertainty, how do we make decisions? Suppose you must choose an action based on the following probabilities of catching your flight:

- $P(A_{25} \text{ gets me there}) = 0.04$
- $P(A_{90} \text{ gets me there}) = 0.70$
- $P(A_{120} \text{ gets me there}) = 0.95$
- $P(A_{1440} \text{ gets me there}) = 0.9999$

The best choice depends on your personal preferences regarding the risk of missing the flight versus the annoyance of spending hours waiting in the terminal. These preferences are formalized using **Utility Theory**.

A utility function maps a state (or an outcome) to a real number, representing its desirability. For instance, the utility of waiting $t$ minutes might be modeled as $U(t) = \exp(-t/500)$.

Combining probability theory (what is likely to happen) with utility theory (what we want to happen) yields **Decision Theory**:

$$ \text{Decision Theory} = \text{Probability Theory} + \text{Utility Theory} $$

By maximizing expected utility, an agent can make optimal, rational decisions even when the outcomes are uncertain.

---

## 2. Fundamentals of Probability

### 2.1 Random Variables and Sample Spaces

A **random variable** represents some aspect of the world about which the agent is uncertain. We typically denote random variables with capitalized letters.

Examples:
- $Cavity$: Does the patient have a tooth cavity?
- $Weather$: What is the weather like today?
- $A$: How long will it take to drive to the airport?
- $D$: The result of a dice roll.

Every random variable has a **domain**, which is the set of all its possible values (similar to the domain of a variable in Constraint Satisfaction Problems). The domain of a random variable is also referred to as the **sample space**, often denoted by $\Omega$.

- Domain of $Cavity$: $\{\text{true}, \text{false}\}$
- Domain of $Weather$: $\{\text{sunny}, \text{rain}, \text{cloudy}, \text{snow}\}$
- Domain of $A$: $[0, \infty)$
- Domain of $D$: $\{1, 2, 3, 4, 5, 6\}$

Values of random variables are typically written in lowercase letters (e.g., $sunny$, $hot$).

### 2.2 Atomic Events and Probability Models

Let the set $\Omega$ be the sample space (e.g., the 6 possible rolls of a die).
Let $\omega \in \Omega$ be a **sample point**, also known as an **atomic event** or a **possible world** (e.g., a roll of 3).

A **probability space** (or probability model) pairs the sample space with an assignment $P(D = \omega)$ for every possible world $\omega \in \Omega$. If all elements are uniquely named, we often use the shorthand $P(\omega)$ instead of $P(D = \omega)$.

An **event** $E$ is simply any subset of the sample space $\Omega$. The probability of an event is the sum of the probabilities of all atomic events it contains:

$$ P(E) = \sum_{\omega \in E} P(\omega) $$

For example, the event of "rolling a 3 or a 6" has a probability equal to $P(3) + P(6)$. The **event space**, denoted $\mathcal{F}$, is the power set of $\Omega$ (the set of all possible events/subsets).

A simple intuitive notion of probability $P(E)$ is the fraction of all possible worlds where the event $E$ is true, weighted by the likelihood of those worlds.

### 2.3 The Axioms of Probability

All of probability theory rests on three fundamental axioms formulated by Andrey Kolmogorov:

1. **Non-negativity**: The probability of any event is a non-negative real number.
   $$ P(E) \in \mathbb{R}, P(E) \ge 0 \quad \text{for all } E \in \mathcal{F} $$
2. **Certainty of the Sample Space**: The probability of the entire sample space is exactly 1.
   $$ P(\Omega) = 1 $$
3. **Additivity of Mutually Exclusive Events**: If a sequence of events $E_1, E_2, \dots$ are mutually exclusive (i.e., they are disjoint sets, meaning no two events can happen simultaneously), the probability of their union is the sum of their individual probabilities.
   $$ P\left(\bigcup_{i=1}^{\infty} E_i\right) = \sum_{i=1}^{\infty} P(E_i) $$

From these three axioms, several important theorems immediately follow:

- **Sum of all worlds**: The sum of probabilities of all atomic events in the sample space is exactly 1. $\sum_{\omega \in \Omega} P(\omega) = 1$
- **Boundedness**: Every probability falls within the closed interval [0, 1]. $0 \le P(E) \le 1$
- **Subsets**: If event A implies event B (i.e., $A \subseteq B$), then $P(A) \le P(B)$.
- **Empty Set**: The probability of the impossible event (the empty set $\emptyset$) is 0. $P(\emptyset) = 0$.
- **Complement**: The probability of an event not happening is 1 minus the probability of it happening. $P(A^c) = 1 - P(A)$.
- **Inclusion-Exclusion Principle**: For any two events A and B, the probability of A OR B is the sum of their individual probabilities minus the probability of their intersection. $P(A \cup B) = P(A) + P(B) - P(A \cap B)$.

---

## 3. Probability Distributions

### 3.1 Prior Probability Distributions

A **prior probability** (or unconditional probability) reflects an agent's belief about a variable *prior* to the arrival of any new evidence.

We can define a probability distribution by associating a probability with every possible value in a random variable's domain. For a discrete variable, this is often represented as a table, where the values must sum up to 1.

| Weather (W) | Probability $P(W)$ |
|:---|---:|
| sun | 0.6 |
| rain | 0.1 |
| fog | 0.3 |
| meteor | 0.0 |

| Temperature (T) | Probability $P(T)$ |
|:---|---:|
| hot | 0.5 |
| cold | 0.5 |

### 3.2 Continuous Variables

Probability distributions are not limited to discrete variables. For continuous variables (like temperature in degrees, or time in seconds), we express the distribution using a parameterized function known as a **Probability Density Function (PDF)**, denoted as $f(x)$. The total area under the PDF curve must integrate to 1.

Examples include the Uniform density function:
$$ f(x) = U[18, 26](x) $$
(A uniform distribution between 18 and 26)

And the Gaussian (Normal) density function:
$$ f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}} $$
Where $\mu$ is the mean and $\sigma^2$ is the variance.

### 3.3 Joint Probability Distributions

A **joint probability distribution** over a set of random variables specifies a probability for every possible combination of assignments (every atomic event) to those variables.

For variables $T$ (Temperature) and $W$ (Weather):

| T | W | Probability $P(T, W)$ |
|:---|:---|---:|
| hot | sun | 0.4 |
| hot | rain | 0.1 |
| cold | sun | 0.2 |
| cold | rain | 0.3 |

A full joint distribution is incredibly powerful: **every question about a domain can be answered by the joint distribution** because every event is simply a sum of sample points (rows in the table).

However, the joint distribution suffers from the curse of dimensionality. For $n$ boolean variables, the joint distribution table requires $2^n$ entries. For $n$ variables each with domain size $d$, the size of the table is $O(d^n)$. For all but the smallest, most trivial domains, it is entirely impractical to write out or store the full joint distribution.

### 3.4 Marginal Distributions

We can extract the distribution of a single variable (or a smaller subset of variables) from a joint distribution through a process called **marginalization** (or summing out).

To find the marginal distribution of a variable, we collapse the rows of the joint distribution by summing the probabilities of all combinations where that variable takes a specific value.

For example, to find $P(T)$ from $P(T, W)$:
- $P(T=\text{hot}) = P(\text{hot}, \text{sun}) + P(\text{hot}, \text{rain}) = 0.4 + 0.1 = 0.5$
- $P(T=\text{cold}) = P(\text{cold}, \text{sun}) + P(\text{cold}, \text{rain}) = 0.2 + 0.3 = 0.5$

---

## 4. Conditional Probability

**Conditional probability** (or posterior probability) represents an agent's degree of belief after new evidence has been observed.

For example, $P(\text{cavity} \mid \text{toothache}) = 0.8$ means "given that toothache is all I know, the probability of a cavity is 0.8."
It is crucial to understand that this does **not** mean "if a toothache is present, there is unconditionally an 80% chance of a cavity." It is strictly an assessment based on current evidence.

If new, overriding evidence arrives, the probability may change to reflect certainty:
$P(\text{cavity} \mid \text{toothache, cavity}) = 1$

Conversely, new evidence may be completely irrelevant to the query, allowing us to simplify our expressions:
$P(\text{cavity} \mid \text{toothache, sunny}) = P(\text{cavity} \mid \text{toothache}) = 0.8$
This ability to ignore irrelevant information, sanctioned by domain knowledge, is crucial for efficient inference.

### 4.1 Definition of Conditional Probability

Mathematically, the conditional probability of event $a$ given event $b$ (where $P(b) \neq 0$) is defined as:

$$ P(a \mid b) = \frac{P(a, b)}{P(b)} $$

This represents the probability of both $a$ and $b$ occurring, divided by the probability of the evidence $b$ occurring.

### 4.2 Conditional Distributions

Just as we have joint distributions, we can have **conditional distributions**: probability distributions over some variables given fixed values of other evidence variables.

Given the joint distribution $P(T, W)$, we might want the conditional distribution $P(W \mid T=\text{cold})$:
- $P(W=\text{sun} \mid T=\text{cold}) = \frac{P(\text{cold}, \text{sun})}{P(T=\text{cold})} = \frac{0.2}{0.5} = 0.4$
- $P(W=\text{rain} \mid T=\text{cold}) = \frac{P(\text{cold}, \text{rain})}{P(T=\text{cold})} = \frac{0.3}{0.5} = 0.6$

### 4.3 The Normalization Trick

A common and highly practical way to compute conditional distributions from a joint distribution is the **Normalization Trick**. It avoids having to separately calculate the marginal probability $P(b)$ used in the denominator.

Suppose we want to find the distribution $P(W \mid T=\text{cold})$:
1. **Select**: Identify all rows in the joint distribution that match the evidence ($T=\text{cold}$).
   - (cold, sun) $\to$ 0.2
   - (cold, rain) $\to$ 0.3
2. **Normalize**: Sum the selected probabilities to find a normalization constant (here, $0.2 + 0.3 = 0.5$). Divide each selected probability by this constant so the new values sum to 1.
   - $P(W=\text{sun} \mid T=\text{cold}) = 0.2 / 0.5 = 0.4$
   - $P(W=\text{rain} \mid T=\text{cold}) = 0.3 / 0.5 = 0.6$

This works mathematically because the sum of the selected probabilities is exactly the probability of the evidence, $P(T=\text{cold})$. We often denote this normalization constant as $\alpha$, allowing us to write:
$$ P(W \mid T=\text{cold}) = \alpha \langle 0.2, 0.3 \rangle = \langle 0.4, 0.6 \rangle $$

---

## 5. Rules of Probability and Inference

### 5.1 The Product Rule and Chain Rule

By rearranging the definition of conditional probability, we obtain the **Product Rule**, which allows us to compute joint probabilities from conditional ones:

$$ P(a, b) = P(a \mid b) P(b) $$
$$ \text{and equivalently } P(a, b) = P(b \mid a) P(a) $$

The Product Rule can be applied sequentially to express any full joint distribution as an incremental product of conditional distributions. This is known as the **Chain Rule**:

$$ P(X_1, X_2, \dots, X_n) = P(X_1) P(X_2 \mid X_1) P(X_3 \mid X_1, X_2) \dots P(X_n \mid X_1, \dots, X_{n-1}) $$
$$ P(X_1, X_2, \dots, X_n) = \prod_{i=1}^n P(X_i \mid X_1, \dots, X_{i-1}) $$

### 5.2 Bayes' Rule

Because the joint probability $P(a, b)$ can be written in two ways using the Product Rule:
$$ P(a \mid b) P(b) = P(b \mid a) P(a) $$

We can divide by $P(b)$ to obtain **Bayes' Rule** (or Bayes' Theorem):

$$ P(a \mid b) = \frac{P(b \mid a) P(a)}{P(b)} $$

Bayes' Rule is arguably the most important formula in AI and machine learning. It is useful because it allows us to build one conditional probability from its reverse. Very often in real-world modeling, one direction is easy to estimate (e.g., the causal probability that a disease causes a symptom), while the reverse direction is exactly what we want to query (the diagnostic probability of the disease given the symptom).

**Example: Inference with Bayes' Rule**
Let $M$ be meningitis and $S$ be a stiff neck.
- Prior probability of meningitis: $P(M) = \frac{1}{50000}$
- Prior probability of a stiff neck: $P(S) = \frac{1}{20}$
- Causal probability (if you have meningitis, probability of stiff neck): $P(S \mid M) = 0.8$

We want the diagnostic probability: If a patient has a stiff neck, what is the probability they have meningitis?
$$ P(M \mid S) = \frac{P(S \mid M) P(M)}{P(S)} = \frac{0.8 \times \frac{1}{50000}}{\frac{1}{20}} = 0.00032 $$

Note that the posterior probability of meningitis is still very small because the prior probability of the disease is extremely low compared to the prior probability of getting a stiff neck.

### 5.3 Inference by Enumeration

**Probabilistic Inference** is the task of using a probabilistic model and evidence to reason about specific query variables.

We formally define the sets of variables:
- **$X$**: All random variables in the domain $\{X_1, X_2, \dots, X_n\}$.
- **$E$**: Evidence variables $\{E_1, \dots, E_k\}$ whose values are observed as $e$.
- **$Q$**: The Query variable (for simplicity, we assume a single query variable, though the method scales to multiple).
- **$H$**: Hidden variables, which are all variables in $X$ that are neither evidence nor query variables.

The goal of inference is to compute the conditional distribution $P(Q \mid E = e)$.

The most direct algorithm is **Inference by Enumeration**:
1. **Select**: Take the full joint distribution and select all entries (rows) that are consistent with the observed evidence $E = e$.
2. **Marginalize**: Sum out all the Hidden variables $H$ to obtain the joint distribution of just the Query and the Evidence: $P(Q, E=e)$.
3. **Normalize**: Divide the resulting table by the sum of its entries (which is $P(e)$) to yield the conditional distribution $P(Q \mid E=e)$.

Mathematically, this looks like:
$$ P(Q \mid e) = \alpha \sum_{h} P(Q, e, h) $$
Where the sum over $h$ iterates through all possible combinations of assignments to the hidden variables $H$.

**The Problem with Enumeration**
While theoretically sound, Inference by Enumeration is completely intractable for real-world problems.
- **Worst-case Time Complexity**: $O(d^n)$ where $d$ is the domain size and $n$ is the total number of variables.
- **Worst-case Space Complexity**: $O(d^n)$ just to store the joint probability distribution table in memory.

To handle non-trivial domains, we must find a way to reduce the size of the joint distribution representation.

---

## 6. Independence and Conditional Independence

To defeat the exponential blowup of the joint distribution, we utilize structural properties of the domain: specifically, independence.

### 6.1 Absolute Independence

Two variables $X$ and $Y$ are **independent** if the occurrence of one does not affect the probability of the other. Mathematically, this is true if and only if:
$$ P(X, Y) = P(X) P(Y) $$

Equivalently, this implies:
- $P(X \mid Y) = P(X)$
- $P(Y \mid X) = P(Y)$

Independence is extremely powerful. If we have $n$ independent fair coin flips, instead of a joint distribution requiring $O(2^n)$ entries, we can represent it entirely with $n$ individual distributions, reducing the complexity to $O(n)$.

Unfortunately, absolute independence is very rare in the real world. In a domain like dentistry, hundreds of variables (diet, genetics, brushing habits, cavities, toothaches) interact, and very few are strictly independent of one another. Assuming absolute independence where it doesn't exist leads to highly inaccurate models.

### 6.2 Conditional Independence

While absolute independence is rare, **conditional independence** is our most basic and robust tool for organizing knowledge about uncertain environments.

Two variables $X$ and $Y$ are conditionally independent given a third variable $Z$ if and only if:
$$ P(X, Y \mid Z) = P(X \mid Z) P(Y \mid Z) $$

Equivalently:
- $P(X \mid Y, Z) = P(X \mid Z)$
- $P(Y \mid X, Z) = P(Y \mid Z)$

**Example: Dentistry**
Consider the variables *Toothache*, *Cavity*, and *Catch* (whether a dentist's steel probe catches in the tooth).
Are *Toothache* and *Catch* absolutely independent? No. If the probe catches, it's more likely you have a cavity, which makes it more likely you have a toothache.

However, if you *already know* the patient has a cavity ($Cavity = \text{true}$), then knowing they have a toothache provides no additional information about whether the probe will catch. The physical state of the tooth (the cavity) completely separates the two symptoms.
Therefore, *Catch* is conditionally independent of *Toothache* given *Cavity*:
$$ P(\text{Catch} \mid \text{Toothache}, \text{Cavity}) = P(\text{Catch} \mid \text{Cavity}) $$

Using the Chain Rule, we can rewrite the joint distribution:
$$ P(\text{Toothache}, \text{Catch}, \text{Cavity}) $$
$$ = P(\text{Toothache} \mid \text{Catch}, \text{Cavity}) P(\text{Catch} \mid \text{Cavity}) P(\text{Cavity}) $$
$$ = P(\text{Toothache} \mid \text{Cavity}) P(\text{Catch} \mid \text{Cavity}) P(\text{Cavity}) $$

By exploiting this conditional independence, we factored a joint distribution requiring $2^3 - 1 = 7$ independent numbers into three smaller tables requiring $2 + 2 + 1 = 5$ independent numbers.
In large systems, the use of conditional independence can reduce the size of the representation from exponential $O(d^n)$ to linear $O(n)$.

### 6.3 The Naïve Bayes Model

A common and highly practical application of conditional independence is the **Naïve Bayes Model**. It assumes that all "effects" (symptoms, features) are conditionally independent of each other *given* the "cause" (the disease, the class).

$$ P(\text{Cause}, \text{Effect}_1, \dots, \text{Effect}_n) = P(\text{Cause}) \prod_{i=1}^n P(\text{Effect}_i \mid \text{Cause}) $$

Under this assumption, the total number of parameters required to define the joint distribution scales linearly with the number of effects $n$, making it exceptionally fast and efficient for many real-world classification tasks, even if the assumption of perfect conditional independence is slightly "naïve."

---

## Summary

1. **Probability** provides a mathematically rigorous formalism for managing uncertain knowledge and beliefs.
2. The **Joint Probability Distribution** specifies the probability of every possible atomic event in a domain.
3. **Inference** queries can theoretically be answered by summing (marginalizing) over atomic events consistent with observed evidence, then applying Bayes' Rule or the Normalization Trick.
4. Because the full joint distribution grows exponentially, we must exploit **Conditional Independence** to factor the joint distribution into smaller, manageable conditional probability tables. This makes realistic inference algorithms mathematically tractable.
