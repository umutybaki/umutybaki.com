---
title: "11 - Bayesian Networks: Approximate Inference"
date: "2026-05-10"
description: "A comprehensive, textbook-style guide to approximate inference in Bayesian Networks using sampling methods: Prior, Rejection, Likelihood Weighting, and Gibbs Sampling."
---

# 11 - Bayesian Networks: Approximate Inference

Exact inference in Bayesian Networks—even when highly optimized with algorithms like Variable Elimination—is proven to be **NP-complete**. For massive, highly connected real-world networks with thousands of variables, exact calculation requires too much time and memory.

To solve this, we trade a small amount of accuracy for a massive increase in speed using **Approximate Inference**. 

The core idea of approximate inference is to estimate the posterior probability by **sampling** from the Bayesian Network. By simulating how the network generates data, drawing $N$ samples, and calculating frequencies, we can approximate the true probability distribution. As $N$ approaches infinity, the approximated probability converges to the true probability.

---

## 1. The Basics of Sampling

To understand sampling in Bayesian Networks, we must briefly review how to draw a sample from a known discrete distribution using a random number generator.

### Probability Mass Function (PMF) vs Cumulative Distribution Function (CDF)
For a discrete random variable $X$:
- The **PMF**, $f_X(x) = P(X = x)$, represents the probability that $X$ is exactly equal to some value $x$. These probabilities must sum to 1.
- The **CDF**, $F_X(x) = P(X < x)$, represents the probability that $X$ takes a value strictly less than $x$. (Note: while CDFs can also be defined as $\le$, this distinction does not mathematically matter for continuous mapping).

### How to Sample from a Known Distribution
1. **Define the intervals**: Using the CDF, associate every possible outcome in the PMF with an interval in the continuous range $[0, 1)$. The size of the interval must exactly equal the probability of that outcome.
   - Example: If $P(\text{red}) = 0.6, P(\text{blue}) = 0.3, P(\text{green}) = 0.1$, the intervals are:
     - red: $[0, 0.6)$
     - blue: $[0.6, 0.9)$
     - green: $[0.9, 1.0)$
2. **Draw a random number**: Generate a random uniform float $u \in [0, 1)$.
3. **Map the number to the outcome**: Find which interval $u$ falls into. If $u = 0.83$, it falls in $[0.6, 0.9)$, so the sampled outcome is "blue".

If we repeat this process $N$ times and count the frequencies of the outcomes (e.g., how many times "blue" appeared divided by $N$), the relative frequencies will converge to the true probabilities $P(X)$ as $N \to \infty$.

---

## 2. Sampling Algorithms for Bayesian Networks

There are four primary sampling algorithms used for inference in Bayesian Networks, each improving upon the flaws of the last.

### 2.1 Prior Sampling
**Goal**: Sample from the full joint distribution of the network, $P(X_1, \dots, X_n)$, with no evidence provided.

**Procedure**:
1. Order the variables topologically (from causes to effects). This ensures that when we visit a variable, we have already sampled values for all of its parents.
2. For $i = 1$ to $n$:
   - Look up the sampled values of $Parents(X_i)$.
   - Sample $x_i$ from the local conditional distribution $P(X_i \mid Parents(X_i))$.
3. Return the full sample $(x_1, \dots, x_n)$.

**Properties**:
This process generates samples with probability exactly equal to the network's true joint probability. If we want to estimate the marginal probability of a variable, say $P(W=\text{true})$, we simply run Prior Sampling $N$ times, count the number of samples where $W=\text{true}$, and divide by $N$.

### 2.2 Rejection Sampling
**Goal**: Estimate a conditional (posterior) probability $P(Q \mid e)$, where $e$ is a set of observed evidence.

**Procedure**:
Rejection sampling is the simplest way to handle evidence.
1. Generate a full sample $(x_1, \dots, x_n)$ using the standard Prior Sampling method.
2. Check if the generated sample is consistent with the observed evidence $e$. 
   - If it **matches** the evidence, keep it.
   - If it **violates** the evidence, completely reject and discard the sample.
3. Once $N$ valid samples are collected, calculate the probability of the query $Q$ by counting frequencies among the *kept* samples.

**The Flaw**:
Rejection sampling is consistent (correct in the limit), but it is incredibly **inefficient**. If the observed evidence is very rare (e.g., $P(\text{Burglary}) = 0.001$), you might have to generate and throw away thousands of samples just to get a single valid one. The evidence is not guiding the sampling process; we are just blindly sampling and hoping we get lucky.

### 2.3 Likelihood Weighting
**Goal**: Estimate $P(Q \mid e)$ without throwing away samples, by forcing the evidence variables to take their observed values.

**Procedure**:
To prevent wasting samples, we **fix** the evidence variables to their known values. However, if we simply force variables to take specific values, our generated distribution will be mathematically incorrect. We must correct for this by associating a **weight** $w$ with every generated sample.

1. Initialize weight $w = 1.0$.
2. For $i = 1$ to $n$ (in topological order):
   - If $X_i$ is an **evidence variable** (with observed value $e_i$):
     - Force $x_i = e_i$.
     - Multiply the weight by the probability of this evidence given its parents: $w = w \times P(x_i \mid Parents(X_i))$.
   - If $X_i$ is a **non-evidence variable**:
     - Sample $x_i$ randomly from $P(X_i \mid Parents(X_i))$.
3. Return the sample $(x_1, \dots, x_n)$ along with its weight $w$.

To calculate the final probability $P(Q \mid e)$, instead of counting raw samples, we sum the *weights* of the samples where $Q=q$, and divide by the total sum of all weights.

**The Flaw**:
Likelihood weighting is much better than rejection sampling because every sample is kept. However, it still has a flaw: **evidence only influences downstream variables**. 
When sampling a cause (upstream), the algorithm doesn't "know" about the fixed evidence (downstream). It blindly samples the cause based on its prior, and then harshly penalizes the sample's weight later when it hits the fixed downstream evidence. In very large networks with downstream evidence, most samples will end up with infinitesimally small weights, meaning we need an enormous number of samples to get a reliable estimate.

### 2.4 Gibbs Sampling (MCMC)
**Goal**: Estimate $P(Q \mid e)$ efficiently by allowing evidence to influence both upstream and downstream variables.

**Procedure**:
Gibbs Sampling is a specific type of **Markov Chain Monte Carlo (MCMC)** method. Instead of generating each sample from scratch starting from the top of the network, we maintain a single, full instantiation of the network and iteratively mutate it.

1. **Initialize**: Start with an arbitrary, completely full instantiation of the network $(x_1, \dots, x_n)$ that is consistent with the evidence variables. (Keep the evidence fixed).
2. **Repeat for a long time**:
   - Randomly pick a single **non-evidence** variable $X_i$.
   - **Resample** the value of $X_i$ conditioned on the current values of *every other variable in the network*.
   - Because of conditional independence, we don't actually need to look at every variable. We only need to resample $X_i$ conditioned on its **Markov Blanket** (its parents, its children, and its children's other parents):
     $$ x_i = \text{sample}(P(X_i \mid \text{MarkovBlanket}(X_i))) $$
   - Save the newly mutated network state as the next sample.

**Properties**:
Because we resample based on the Markov Blanket, the evidence directly and immediately influences the sampling of *both* upstream causes and downstream effects. 

In the limit of infinite resampling steps, the sequence of network states generated by Gibbs Sampling converges perfectly to the true posterior distribution $P(Q \mid e)$. In practice, because early samples are heavily biased by the random initialization state, we usually discard an initial batch of samples (a period known as "burn-in") before we start keeping track of the frequencies.

---

## Summary

- **Exact Inference** is NP-complete; for massive real-world networks, we must use approximate sampling methods.
- **Prior Sampling**: Generates samples from the full joint distribution without evidence by sampling topologically from causes to effects.
- **Rejection Sampling**: Drops/rejects any prior samples that conflict with observed evidence. Highly inefficient for rare evidence.
- **Likelihood Weighting**: Fixes evidence variables and weights the resulting sample by the probability of that evidence. Much more efficient, but evidence fails to guide the sampling of upstream causes.
- **Gibbs Sampling (MCMC)**: Maintains a single full network state and iteratively resamples individual non-evidence variables based on their Markov Blankets. This allows evidence to flow seamlessly upstream and downstream, making it the most robust sampling technique for complex networks.
