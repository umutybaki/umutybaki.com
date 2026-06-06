---
title: "11 - Bayesian Networks: Approximate Inference"
date: "2026-04-27"
description: "Course: COMP341 – Introduction to AI, Koç University"
---

# 11 - Bayesian Networks: Approximate Inference

**Course**: COMP341 – Introduction to AI, Koç University  
**Instructor**: Asst. Prof. Barış Akgün  
**Topic**: Why exact inference fails at scale, and how sampling-based approximate methods let us still get useful answers.



## 1 Why We Need Approximate Inference

### The Problem with Exact Methods

In previous lectures you learned two exact inference algorithms for Bayesian Networks:

- **Enumeration**: Sum over all possible assignments of hidden variables. Time complexity is exponential in the number of variables - O(2^n) for binary variables.
- **Variable Elimination**: Smarter than enumeration by eliminating variables one by one and caching intermediate factors. Still worst-case exponential.

**Key fact**: Exact inference in Bayesian Networks is NP-complete in general. This is not a flaw in our algorithms - it is an inherent property of the problem. There is no polynomial-time algorithm for exact BN inference unless P = NP.

### What This Means Practically

Suppose you have a medical diagnosis network with 50 binary variables. Exact enumeration would require evaluating up to 2^50 ≈ 10^15 combinations. Even at a billion operations per second, that is over 10 days of computation. Real-world BNs for spam filtering, speech recognition, or protein folding can have thousands of variables.

### The TradeOff

Approximate inference gives up the guarantee of an exact answer in exchange for:
- Dramatically faster computation
- Controllable trade-off: more samples gives more accuracy but takes longer
- Practical answers for large networks where exact methods are infeasible

The fundamental idea is **sampling**: instead of computing the exact probability by summing over all configurations, we draw random samples from the distribution and estimate probabilities from those samples. This is the same idea behind opinion polls - you do not ask every voter, you ask a representative sample.


## 2 The Core Idea Sampling

### What Does Sampling from a Distribution Mean

A probability distribution tells you how likely each outcome is. "Sampling" means generating a random outcome according to those probabilities. If P(Cloudy = true) = 0.5, then roughly half your samples should have Cloudy = true.

### Why Does Sampling Work

By the **Law of Large Numbers**, if you draw N independent samples from a distribution P, the fraction of samples where X = x converges to P(X = x) as N approaches infinity. So:

```text
P(X = x) ≈ (number of samples where X = x) / (total samples)
```

The approximation gets better as N grows. The error decreases roughly as 1/sqrt(N).

### Three Things We Do With Sampling in BNs

1. Draw N samples from the BN's sampling distribution S
2. Count occurrences of the events we care about
3. Normalize to get approximate probability estimates
4. Prove consistency: Show that S converges to the true distribution P as N approaches infinity


## 3 Primer on Discrete Distributions and Sampling

Before getting into BN-specific algorithms, you need to understand how to sample from a single discrete distribution.

### Probability Mass Function PMF

The PMF gives the probability of a discrete random variable taking exactly a given value:

```
f_X(x) = P(X = x)
```

All probabilities must sum to 1: sum_x f_X(x) = 1.

**Example**: A color variable C with:

| C     | P(C) |
| :---: | ---: |
| red   | 0.6  |
| green | 0.1  |
| blue  | 0.3  |

### Cumulative Distribution Function CDF

The CDF gives the probability that X takes a value less than x:

```
F_X(x) = P(X < x)
```

Useful identity: P(a <= X < b) = F_X(b) - F_X(a)

For our color example:

| C     | P(C) | CDF | Interval   |
| :---: | ---: | ---: | :--- |
| red   | 0.6  | 0.6 | [0, 0.6)   |
| green | 0.1  | 0.7 | [0.6, 0.7) |
| blue  | 0.3  | 1.0 | [0.7, 1.0) |

### How to Sample from a Known Discrete Distribution

**Algorithm**:
1. Draw a random number u uniformly from [0, 1)
2. Find which interval u falls into - that interval's outcome is your sample

**Example**: If u = 0.83, it falls in [0.7, 1.0), so the sample is "blue".

**Intuition**: You are partitioning the [0,1] line into segments whose sizes exactly match the probabilities. A uniform random point lands in each segment with the right frequency.

**Convergence example** from the lecture:
- After 10 samples: P(r)=0.7, P(b)=0.2, P(g)=0.1  (noisy)
- After 100 samples: P(r)=0.62, P(b)=0.27, P(g)=0.11  (better)
- After 1000 samples: P(r)=0.603, P(b)=0.297, P(g)=0.1  (close to truth)

### Python Implementation

```python
from random import random

def cumsum(f):
    total = 0
    for x in f:
        total += x
        yield total

def getVal(u, cs):
    for i in range(0, len(cs)):
        if u < cs[i]:
            return i

probs = [0.6, 0.3, 0.1]  # must sum to 1
numIter = 1000
cs = list(cumsum(probs))
counts = [0] * len(probs)

for i in range(0, numIter):
    u = random()           # Step 1: uniform sample
    t = getVal(u, cs)      # Step 2: convert to outcome
    counts[t] += 1

print([num / float(numIter) for num in counts])
# Approximate [0.6, 0.3, 0.1] with noise decreasing as numIter grows
```


## 4 Bayesian Network Recap

### Structure

A BN is a directed acyclic graph (DAG) where:
- **Nodes** = random variables
- **Edges** = direct probabilistic influences (parent to child)
- **Each node** stores a Conditional Probability Table (CPT): P(X_i | Parents(X_i))

### Joint Distribution

The full joint probability is a product of local conditionals:

```
P(X_1, X_2, ..., X_n) = product_{i=1}^{n} P(X_i | Parents(X_i))
```

### Canonical Example Weather and Wet Grass

We use this throughout the lecture. The variables are:
- **C** = Cloudy (no parents)
- **S** = Sprinkler (parent: C)
- **R** = Rain (parent: C)
- **W** = WetGrass (parents: S, R)

CPTs:

```typescript
P(+c) = 0.5,  P(-c) = 0.5

P(+s | +c) = 0.1,   P(-s | +c) = 0.9
P(+s | -c) = 0.5,   P(-s | -c) = 0.5

P(+r | +c) = 0.8,   P(-r | +c) = 0.2
P(+r | -c) = 0.2,   P(-r | -c) = 0.8

P(+w | +s, +r) = 0.99,   P(-w | +s, +r) = 0.01
P(+w | +s, -r) = 0.90,   P(-w | +s, -r) = 0.10
P(+w | -s, +r) = 0.90,   P(-w | -s, +r) = 0.10
P(+w | -s, -r) = 0.01,   P(-w | -s, -r) = 0.99
```

### Inference Tasks

Given a BN, inference means computing useful quantities:
- **Posterior probability**: P(Q | E=e) - probability of query given evidence
- **Most likely explanation**: argmax_q P(Q=q | E=e) - most probable explanation of evidence

Exact inference is NP-complete for general BNs, which motivates all the sampling methods below.


## 5 Prior Sampling

### What Is It

Prior sampling generates complete assignments to all variables by sampling each variable in topological order (parents before children), using the CPTs. There is no evidence conditioning at this stage - we simply sample from the prior distribution.

**Why topological order?** Because to sample X_i from P(X_i | Parents(X_i)), you need the parent values already fixed. Topological order guarantees all parents come before children.

### Algorithm for Prior Sampling

```text
function PRIOR-SAMPLE(BN):
    for i = 1 to n (in topological order):
        x_i = sample from P(X_i | Parents(X_i))  // using parent values already sampled
    return (x_1, x_2, ..., x_n)
```

### Worked Example Weather Network

One run through the algorithm:
1. Sample C: draw u ~ Uniform[0,1). Say u=0.3, which is in [0, 0.5), so C = +c
2. Sample S given C=+c: P(+s|+c)=0.1. Say u=0.7, so S = -s
3. Sample R given C=+c: P(+r|+c)=0.8. Say u=0.2, so R = +r
4. Sample W given S=-s, R=+r: P(+w|-s,+r)=0.90. Say u=0.5, so W = +w

Resulting sample: (+c, -s, +r, +w)

After many such runs, you might get:
```text
+c, -s, +r, +w
+c, +s, +r, +w
-c, +s, +r, -w
+c, -s, +r, +w
-c, -s, -r, +w
```

### Why Is Prior Sampling Consistent

The probability that prior sampling generates a particular complete assignment (x_1, ..., x_n) is:

```
S_PS(x_1, ..., x_n) = product_{i=1}^{n} P(x_i | Parents(x_i)) = P(x_1, ..., x_n)
```

This is exactly the BN's joint distribution! So the sampling distribution equals the true joint. In the limit of infinitely many samples, the fraction of samples matching any event converges to the true probability of that event.

Mathematically:
```text
P_approx(x_1, ..., x_n) = N(x_1, ..., x_n) / N_total  -->  P(x_1, ..., x_n)
```

### What Can You Estimate

From N prior samples, you can estimate any marginal or joint probability:
- P(W=+w): count samples with +w, divide by N
- P(C=+c, W=+w): count samples with both, divide by N
- P(C | +w): among samples with +w, look at the distribution of C

### Limitation

Prior sampling cannot efficiently handle conditional queries when evidence is unlikely. This leads to rejection sampling.


## 6 Rejection Sampling

### The Idea

If you want P(Q | e), you still run prior sampling, but you discard (reject) any sample that contradicts the evidence e. The remaining samples are distributed according to P(Q | e).

**Intuition**: Imagine you want to estimate the average height of left-handed people. You randomly sample people (prior sampling), and just ignore anyone who is not left-handed (rejection). Among the kept samples, you compute the average height.

### Algorithm for Rejection Sampling

```text
function REJECTION-SAMPLING(BN, evidence E):
    for i = 1 to n (topological order):
        x_i = sample from P(X_i | Parents(X_i))
        if x_i contradicts evidence E:
            return NULL   // reject this entire sample
    return (x_1, ..., x_n)   // accepted sample
```

Run this many times; collect all non-NULL returns. Among those, count outcomes of Q.

### Example

Evidence: E = {S = +s}. From 5 prior samples:
```text
+c, -s, +r, +w  <- REJECT (s does not match evidence +s)
+c, +s, +r, +w  <- KEEP
-c, +s, +r, -w  <- KEEP
+c, -s, +r, +w  <- REJECT
-c, -s, -r, +w  <- REJECT
```

From 2 kept samples, estimate P(C | +s):
- +c appears 1 time, -c appears 1 time -> P(+c|+s) ≈ 0.5, P(-c|+s) ≈ 0.5

### Why Is Rejection Sampling Consistent

Among the kept samples, the distribution is proportional to P(x, e) (the joint of query and evidence variables). When normalized, this gives P(x | e). So rejection sampling is correct in the limit.

### The Fatal Flaw Rare Evidence

**Problem**: If the evidence is unlikely, almost all samples get rejected, and you waste enormous computation.

**Classic example from the lecture**: Suppose you have a Burglary -> Alarm network where:
- P(+b) = 0.01 (burglaries are rare)
- P(+a | -b) = 0.05 (false alarms are also rare)

If you condition on evidence +a (alarm is on), only a tiny fraction of prior samples will have alarm = true. With P(+a) ≈ P(+a|+b)·P(+b) + P(+a|-b)·P(-b) = 0.8·0.01 + 0.05·0.99 ≈ 0.058, you keep about 1 in 17 samples. Most computation is wasted.

The deeper issue: **evidence does not guide the sampling**. You sample freely without regard for what you know, then throw most results away.


## 7 Likelihood Weighting

### Core Insight

Instead of sampling evidence variables and rejecting mismatches, **fix** the evidence variables to their observed values and only sample the non-evidence variables. This ensures every sample is consistent with the evidence.

But there is a catch: by forcing evidence variables, you are no longer sampling from the true distribution. You have biased the sampling. To correct for this bias, you assign each sample a **weight** that equals the probability of the evidence given the current sample's configuration.

### Intuition via Analogy

Imagine you are estimating the average age in a city, but your survey was conducted only at universities (biased towards young people). One fix: ask "what is the probability that this person would have been in my survey given their age?" and up-weight older respondents who are underrepresented. Likelihood weighting does exactly this - it corrects for the bias introduced by fixing evidence.

### Algorithm for Likelihood Weighting

```text
function LIKELIHOOD-WEIGHTING-SAMPLE(BN, evidence E):
    w = 1.0   // initialize weight
    for i = 1 to n (topological order):
        if X_i is an evidence variable:
            X_i = x_i   // force to observed value
            w = w * P(X_i = x_i | Parents(X_i))   // accumulate weight
        else:
            x_i = sample from P(X_i | Parents(X_i))   // sample freely
    return (x_1, ..., x_n), w
```

Run many times. To estimate P(Q | e):
```text
P(Q = q | e) ≈ (sum of weights for samples where Q = q) / (total sum of all weights)
```

### Why Does the Weight Correct the Bias

When we fix evidence variables instead of sampling them, we change the sampling distribution. Specifically, a sample with evidence fixed has sampling probability:

```
S_LW(z, e) = product_{Z_i not in evidence} P(z_i | Parents(z_i))
```

(The evidence variables contribute 1 since they are always fixed to their value.)

But the true distribution we want samples from is:

```
P(z, e) = S_LW(z, e) * product_{E_i in evidence} P(e_i | Parents(e_i))
        = S_LW(z, e) * w(z, e)
```

So weighting each sample by w = product P(e_i | Parents(e_i)) exactly compensates for the bias. The weighted sampling distribution equals the true joint, making it consistent.

### Worked Example

Evidence: +c (Cloudy = true), +w (WetGrass = true). Query: P(+r | +c, +w).

Sample generation (C and W are evidence, S and R are free):
- C is forced to +c -> weight gets multiplied by P(+c) = 0.5
- S is sampled: say S = -s (from P(S|+c))
- R is sampled: say R = +r (from P(R|+c))
- W is forced to +w -> weight gets multiplied by P(+w | -s, +r) = 0.9

Total weight for this sample: 0.5 × 0.9 = 0.45. Sample: (+c, -s, +r, +w) with weight 0.45.

After 20 samples with evidence (+c, +w), the lecture shows sample counts:
- 4 samples of (+c, +s, +r, +w): each weighted 0.5 × 0.99 = 0.495
- 15 samples of (+c, -s, +r, +w): each weighted 0.5 × 0.90 = 0.45
- 1 sample of (+c, -s, -r, +w): weighted 0.5 × 0.01 = 0.005
- 0 samples of (+c, +s, -r, +w)

```text
P(+r | +c, +w) = [4×0.495 + 15×0.45] / [4×0.495 + 15×0.45 + 1×0.005]
               = [1.98 + 6.75] / [1.98 + 6.75 + 0.005]
               = 8.73 / 8.735
               ≈ 0.999
```

Exact answer is 0.9758. The approximation is off because 20 samples is too few. More samples converge to the true value.

### Limitation Upstream Evidence Is Not Used

Likelihood weighting is better than rejection sampling, but it has a structural flaw.

Consider the weather network where W is evidence. W affects S and R (its parents), which affect C (their parent). But in likelihood weighting, C is sampled from its prior P(C) - the evidence +w never "flows upward" to influence how C is sampled.

**Example**: If grass is wet (+w), that makes it more likely it rained (+r) and was cloudy (+c). But likelihood weighting samples C from P(C) = 0.5, ignoring this upstream implication. The weights will correct for this in the limit, but samples will be "off," requiring more samples to converge.

This motivates a method where **every variable** gets sampled while conditioning on evidence - leading to Gibbs sampling.


## 8 Gibbs Sampling and MCMC

### The Big Picture Markov Chain Monte Carlo MCMC

**Monte Carlo methods** is just a name for algorithms that use random sampling to solve computational problems. The name comes from the Monte Carlo casino in Monaco - random like gambling.

**Markov Chain Monte Carlo (MCMC)** is a specific class of Monte Carlo methods that works by constructing a **Markov chain** whose stationary distribution is the target distribution P(Q | e). You simulate the chain by making small random changes to the current state, and after enough steps ("burn-in"), the chain has "forgotten" its starting point and each step gives you a sample from the target distribution.

**Why does this help?** Unlike prior or rejection sampling, MCMC methods do not waste effort on the wrong parts of the distribution. The chain naturally spends more time in high-probability regions.

### Gibbs Sampling The Algorithm

Gibbs sampling is the most commonly used MCMC method for BNs. The key idea:

1. **Initialize**: Start with a complete assignment to all variables, consistent with the evidence (evidence variables are fixed throughout).
2. **Iterate**: Repeatedly pick one non-evidence variable X_i at random, and **resample it** from its conditional distribution given all other variables' current values.
3. **Collect samples**: After a burn-in period, each state of the chain is a sample.

```typescript
function GIBBS-SAMPLE(BN, evidence E, N_samples):
    initialize x = random assignment consistent with E
    // burn-in: run many steps without collecting
    for t = 1 to burn_in:
        X_i = pick random non-evidence variable
        x_i = sample from P(X_i | Markov blanket of X_i)
    
    samples = []
    for t = 1 to N_samples:
        X_i = pick random non-evidence variable
        x_i = sample from P(X_i | Markov blanket of X_i)
        samples.append(copy of x)
    
    return samples
```

Count occurrences of query values in samples; normalize to get probabilities (no weights needed).

### The Markov Blanket What All Other Variables Really Means

When resampling X_i given all other variables, many conditional independence properties mean that most variables are irrelevant. Specifically, X_i is **conditionally independent** of all variables outside its **Markov blanket** given the values inside it.

**Markov blanket of X_i** = Parents(X_i) union Children(X_i) union {Parents of Children of X_i}

**Example**: In the weather network, the Markov blanket of S is:
- Parents of S: {C}
- Children of S: {W}
- Parents of W (other than S): {R}
- Markov blanket(S) = {C, W, R}

So to resample S, you only need to look at CPTs involving S - namely P(S|C) and P(W|S,R):

```typescript
P(S | C, R, W) ∝ P(S | C) × P(W | S, R)
```

**Intuition for the formula**: By Bayes' rule and the chain rule:
```text
P(S | C=+c, R=+r, W=-w) ∝ P(S | C=+c) × P(W=-w | S, R=+r)
```

You compute the unnormalized probabilities for S=+s and S=-s, then normalize to get a valid distribution, then sample from it.

### Computing the Resampling Distribution Detailed Example

Sample from P(S | +c, +r, -w):

```text
P(S = +s | +c, +r, -w) ∝ P(+s | +c) × P(-w | +s, +r)
                        = 0.1 × 0.01
                        = 0.001

P(S = -s | +c, +r, -w) ∝ P(-s | +c) × P(-w | -s, +r)
                        = 0.9 × 0.10
                        = 0.09
```

Normalize: total = 0.001 + 0.09 = 0.091

```text
P(+s | +c, +r, -w) = 0.001 / 0.091 ≈ 0.011
P(-s | +c, +r, -w) = 0.09  / 0.091 ≈ 0.989
```

So when grass is not wet and it is raining, the sprinkler is almost certainly off. This makes intuitive sense - if it is raining, the rain explains the wet grass, not the sprinkler.

### Gibbs Sampling Solves the Upstream Problem

In Gibbs sampling, C conditions on W's value through the Markov blanket of C (which includes its children S and R, whose children include W). So evidence at W does influence how C gets resampled - both upstream and downstream variables feel the evidence.

### StepbyStep Example PS r

**Evidence**: R = +r (fixed throughout)
**Query**: P(S)

**Step 1**: Fix evidence. R = +r always.

**Step 2**: Initialize other variables randomly. Say C = +c, S = +s, W = +w.

**Step 3**: Iterate. Choose a non-evidence variable, resample it.

- **Iteration 1**: Choose C. Resample from P(C | S=+s, R=+r, W=+w).
  - Markov blanket of C = {S, R} (children of C)
  - P(C | S, R) ∝ P(C) × P(S|C) × P(R|C)
  - For +c: 0.5 × 0.1 × 0.8 = 0.04
  - For -c: 0.5 × 0.5 × 0.2 = 0.05
  - Normalize: P(+c) = 0.04/0.09 ≈ 0.44, P(-c) = 0.56
  - Sample: say new C = -c

- **Iteration 2**: Choose W. Resample from P(W | S=+s, R=+r).
  - P(+w|+s,+r) = 0.99, P(-w|+s,+r) = 0.01
  - Sample: say W = +w (almost certain)

- **Iteration 3**: Choose S. Resample from P(S | C=-c, R=+r, W=+w).
  - P(+s|-c,+r,+w) ∝ P(+s|-c) × P(+w|+s,+r) = 0.5 × 0.99 = 0.495
  - P(-s|-c,+r,+w) ∝ P(-s|-c) × P(+w|-s,+r) = 0.5 × 0.90 = 0.45
  - Normalize: P(+s) ≈ 0.495/0.945 ≈ 0.524, P(-s) ≈ 0.476
  - Sample: say S = +s (with probability about 0.52)

After many iterations (discarding the first several hundred as burn-in), you collect the values of S and estimate P(S | +r).

### Why Does Gibbs Sampling Converge

This is the deep theoretical result. Gibbs sampling defines a Markov chain over the space of all complete assignments. The transitions of this chain satisfy **detailed balance** with respect to P(X | e) - meaning the chain is "in equilibrium" precisely when it is sampling from the target distribution. This guarantees that in the limit, the stationary distribution of the chain is exactly P(X | e).

**Practical considerations**:
1. **Burn-in**: The first batch of samples, generated before the chain reaches stationarity, are thrown away. Typical burn-in is hundreds to thousands of steps.
2. **Mixing time**: How long before the chain "forgets" its start? Depends on the problem structure. Slow mixing (chain gets stuck) is a practical challenge.
3. **Convergence diagnostics**: Running multiple chains from different starts and checking they converge to the same distribution.

### Gibbs vs MetropolisHastings

Gibbs sampling is actually a special case of the more general **Metropolis-Hastings (MH)** algorithm. In MH, you propose a new state (not necessarily by sampling from the exact conditional) and accept or reject it with a carefully chosen probability. When you propose from the exact conditional (as Gibbs does), the acceptance probability is always 1 - so Gibbs sampling never rejects proposals.


## 9 Worked Numerical Examples

### Example 1 Prior and Rejection Sampling

**20 samples** from the weather network (from the lecture slides):

```text
-c, -r, +s, +w    +c, -r, -s, -w    +c, +r, -s, +w    -c, -r, -s, -w    -c, -r, +s, +w
+c, +r, -s, +w    -c, +r, -s, +w    -c, -r, +s, +w    -c, -r, +s, +w    -c, -r, -s, -w
+c, +r, -s, +w    -c, -r, -s, -w    +c, +r, -s, +w    +c, +r, -s, +w    -c, +r, +s, +w
... (20 total)
```

**Prior Sampling - Estimating P(+c, +w)**: (exact = 0.3735)
- Count samples with +c AND +w: 6 samples out of 20
- N(+c, +w) / N_total = 6 / 20 = **0.30**

**Rejection Sampling - Estimating P(R | +c, +w)**:
- Keep only samples with (+c, +w): 6 samples
- Among those 6, all have +r: count of +r = 6, count of -r = 0
- P(+r | +c, +w) ≈ 6/6 = **1.0** (exact = 0.9758)

This is a lucky result with few samples. The true value is 0.9758.

### Example 2 Likelihood Weighting for PR c w

Evidence: C = +c, W = +w. Run 20 samples.

Summary of sample counts and weights:

| Sample type      | Count | Weight per sample                        | Total weight |
| :--- | ---: | :--- | ---: |
| (+c, +s, +r, +w) | 4     | P(+c) × P(+w\|+s,+r) = 0.5 × 0.99 = 0.495 | 1.98         |
| (+c, -s, +r, +w) | 15    | P(+c) × P(+w\|-s,+r) = 0.5 × 0.90 = 0.45  | 6.75         |
| (+c, -s, -r, +w) | 1     | P(+c) × P(+w\|-s,-r) = 0.5 × 0.01 = 0.005 | 0.005        |
| (+c, +s, -r, +w) | 0     | -                                         | 0            |

**P(+r | +c, +w)**:
```text
= (weight for +r samples) / (total weight)
= (1.98 + 6.75) / (1.98 + 6.75 + 0.005)
= 8.73 / 8.735
≈ 0.999
```

Exact answer: **0.9758**. Off with only 20 samples, but converges with more.

**P(+s | +c, +w)**:
```text
= (weight for +s samples) / (total weight)
= 1.98 / 8.735
≈ 0.227
```

Exact answer: **0.1304**. Again off with 20 samples. The lecture notes that "20 samples is not enough for this problem."


## 10 Method Comparison and When to Use Each

| Method              | Evidence Handled? | Consistency | Key Limitation                               | Best For                                     |
| :--- | :--- | :---: | :--- | :--- |
| Prior Sampling      | No                | Yes         | Cannot condition on evidence directly        | Estimating priors, quick exploration         |
| Rejection Sampling  | Yes (discard)     | Yes         | Rejects most samples when evidence is rare   | Simple queries, when evidence is common      |
| Likelihood Weighting| Yes (fix+weight)  | Yes         | Upstream variables unaffected by evidence    | Most practical cases; better than rejection  |
| Gibbs Sampling      | Yes (fix+resample)| Yes         | Requires burn-in, slow mixing possible       | Large networks, complex evidence patterns    |

### Detailed Comparison

**Prior Sampling**:
- Use when: No conditioning required, just want to explore the joint distribution
- Pros: Simple, fast, trivially correct
- Cons: Useless when you have evidence

**Rejection Sampling**:
- Use when: Evidence is relatively common (not rare)
- Pros: Simple modification of prior sampling, correct in the limit
- Cons: If P(evidence) is small, almost all samples are rejected. With 1% likely evidence, you need roughly 100x more samples than without evidence.

**Likelihood Weighting**:
- Use when: Evidence is rare AND evidence variables have few parents (so weights are not too extreme)
- Pros: Never wastes a sample on wrong evidence; faster convergence than rejection sampling
- Cons: Upstream variables are still sampled from their priors. If evidence propagates upward significantly, weights can become very skewed (many near-zero weights, a few very large ones). This means effective sample size is low.

**Gibbs Sampling**:
- Use when: Complex evidence patterns, upstream effects matter, or large networks
- Pros: Both upstream and downstream variables condition on evidence. Uses the Markov blanket efficiently. No weight degeneration.
- Cons: Requires burn-in period. Can be slow to mix if the distribution has multiple isolated modes. Harder to implement than rejection sampling.

### The Effective Sample Size Problem

A key issue with likelihood weighting is **weight degeneracy**: if a few samples have giant weights and most have near-zero weights, then effectively you have far fewer independent samples than you think. Gibbs sampling avoids this because all samples have equal weight (just counts). The lecture mentions: "Sum of weights over all samples is indicative of how many 'effective' samples were obtained, so we want large weights."


## 11 Applications of MCMC in Practice

MCMC methods are among the most broadly used algorithms in science and engineering:

**Inference in Probabilistic Models**:
- Bayesian Networks (as covered here)
- Topic models (Latent Dirichlet Allocation for text analysis)
- Probabilistic graphical models in general

**Computer Vision**:
- Modeling texture distributions
- Image segmentation and object recognition with uncertainty
- Generative models (diffusion models use similar ideas)

**Robotics**:
- Particle filters (a variant of importance sampling) for robot localization - sample possible robot positions, weight by sensor readings
- Motion planning under uncertainty

**Machine Learning**:
- Bayesian deep learning: sampling from posterior over neural network weights
- Training large language models uses ideas from stochastic gradient methods, which are analogous to MCMC

**Computational Science**:
- Weather prediction (stochastic atmosphere models)
- Statistical physics (simulating particle systems at thermal equilibrium)
- Computational biology (protein folding, phylogenetics)
- Approximate counting and volume computation
- Combinatorial optimization (simulated annealing is a related technique)


## Summary

### The Full Picture

1. **Exact inference** (enumeration, variable elimination) is NP-complete for general BNs. For large networks, it is computationally infeasible.

2. **Approximate inference** trades exact answers for speed. More samples gives better accuracy.

3. **The fundamental trick**: Draw random samples from (or related to) the target distribution, count occurrences, normalize.

4. **Prior Sampling**: Sample all variables in topological order from their CPTs. Simple and correct, but cannot handle conditioning on evidence directly.

5. **Rejection Sampling**: Run prior sampling, discard samples inconsistent with evidence. Correct but inefficient when evidence is rare.

6. **Likelihood Weighting**: Fix evidence variables, sample non-evidence variables, weight each sample by the probability of the evidence given the sample. Correct and more efficient, but upstream variables are still sampled from their priors.

7. **Gibbs Sampling**: Maintain a complete assignment, repeatedly resample one non-evidence variable at a time conditioned on all others (using the Markov blanket). Both upstream and downstream variables respond to evidence. A special case of MCMC. Requires burn-in but is the most powerful method covered here.

### Key Formulas

| Quantity                           | Formula                                                                |
| :--- | :--- |
| Prior Sampling probability         | S_PS(x) = P(x) (exact match to joint)                                 |
| Likelihood weight                  | w = product_{E_i in evidence} P(e_i given Parents(E_i))               |
| LW probability estimate            | P(Q=q given e) ≈ (sum of w_s for samples s where Q(s)=q) / (sum of all w_s) |
| Gibbs resampling distribution      | x_i ~ P(X_i given MarkovBlanket(X_i))                                 |
| Markov blanket                     | MB(X_i) = Parents(X_i) + Children(X_i) + Parents of Children(X_i)    |

### Convergence Guarantee

All four methods are **consistent** - with infinite samples, they converge to the exact answer. The differences are:
- How many samples you need in practice for a given accuracy
- How well each method handles rare evidence
- Whether upstream variables properly respond to downstream evidence
