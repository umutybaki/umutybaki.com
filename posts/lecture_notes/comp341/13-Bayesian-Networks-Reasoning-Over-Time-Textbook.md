---
title: "13 - Bayesian Networks: Reasoning Over Time"
date: "2026-05-10"
description: "A comprehensive, textbook-style guide to Reasoning Over Time, detailing Markov Chains, Hidden Markov Models (HMMs), and the Forward Algorithm for Filtering."
---

# Bayesian Networks: Reasoning Over Time

Up until now, our Bayesian Networks have represented static snapshots of the world. However, many real-world environments are dynamic. The state of the world changes, and we often receive a sequence of observations over time. 

To track a moving robot, recognize spoken speech, analyze financial markets, or diagnose an evolving disease, we must introduce time and sequencing into our models. The fundamental approach to this is using **Markov Models** and their more powerful extension, **Hidden Markov Models (HMMs)**.

---

## 1. Markov Models (Markov Chains)

A Markov Model is essentially a chain-structured Bayesian Network. It models a system as a sequence of states: $X_1, X_2, X_3, \dots, X_t$.

### The Markov Assumption
To prevent the model from growing infinitely complex, we make the **First-Order Markov Assumption**: 
*The conditional probability of the next state depends exclusively on the current state.*

$$ P(X_{t+1} \mid X_t, X_{t-1}, \dots, X_1) = P(X_{t+1} \mid X_t) $$

In plain English: **The future is independent of the past given the present.** Everything you need to know about the history of the system is encapsulated in the current state.

*(Note: We can also define Higher-Order Markov Models where the next state depends on the last $k$ states, but standard models are first-order).*

### Defining a Markov Chain
A discrete-time, discrete-state Markov Chain is fully defined by:
1. **Initial State Probabilities (Prior)**: $P(X_1)$, the probability distribution of the starting state.
2. **Transition Probabilities (Dynamics)**: $P(X_{t+1} \mid X_t)$, how the state evolves over one time step. 
   - We typically make a **Stationarity Assumption**: the transition probabilities do not change over time. The rules of physics/dynamics remain constant.

The joint distribution of an entire sequence is simply the product of the prior and the chained transitions:
$$ P(X_1, X_2, \dots, X_T) = P(X_1) \prod_{t=2}^{T} P(X_t \mid X_{t-1}) $$

### Passage of Time and Stationary Distributions
If we know the initial distribution $P(X_1)$, we can simulate forward to find the distribution at time $t$ using the **Mini-Forward Algorithm**:
$$ P(X_t) = \sum_{x_{t-1}} P(X_t \mid x_{t-1}) P(x_{t-1}) $$

What happens if we simulate a Markov Chain far into the future without ever observing the real world? **Uncertainty accumulates**. Eventually, we have no idea what the exact state is. For most chains, the distribution eventually stabilizes into a **Stationary Distribution**—a steady state where $P(X_{t+1}) = P(X_t)$, entirely independent of the initial starting state $P(X_1)$.

---

## 2. Hidden Markov Models (HMMs)

Markov Chains are not very useful for AI agents because an agent's uncertainty simply grows to infinity without new information. Furthermore, agents rarely have the luxury of directly observing the true state $X$ of the world. Instead, they receive noisy measurements or effects, $E$.

A **Hidden Markov Model (HMM)** solves this. It consists of an underlying, unobservable Markov Chain over states $X$, accompanied by observable emissions (or effects) $E$ at each time step.

### Defining an HMM
An HMM is defined by three components:
1. **Prior Probabilities**: $P(X_1)$
2. **Transition Model**: $P(X_{t+1} \mid X_t)$
3. **Emission Model**: $P(E_t \mid X_t)$ — The probability of receiving observation $E_t$ given that the true underlying state is $X_t$.

### Conditional Independence in HMMs
HMMs have two crucial independence properties:
1. **Markov Hidden Process**: The future state depends on the past strictly via the present state.
2. **Sensor Independence**: The current observation/emission $E_t$ is conditionally independent of *everything else* (past states, future states, past observations) given the current state $X_t$.

The joint distribution is:
$$ P(X_{1:T}, E_{1:T}) = P(X_1)P(E_1 \mid X_1) \prod_{t=2}^{T} P(X_t \mid X_{t-1})P(E_t \mid X_t) $$

### Examples of HMMs
- **Speech Recognition**: $X$ = Specific words/phonemes, $E$ = Acoustic audio signals.
- **Robot Localization**: $X$ = True coordinates on a map, $E$ = Noisy laser rangefinder readings.

---

## 3. Filtering and The Forward Algorithm

The most common task performed on an HMM is **Filtering** (or Monitoring). Filtering is the task of tracking the **Belief State** $B_t(X)$ over time. 
The Belief State is the posterior distribution of the current state, given *all* evidence observed up to the current time:
$$ B_t(X) = P(X_t \mid e_1, \dots, e_t) $$

As time progresses, our agent operates in a continuous two-step loop:
1. **Elapse Time (Passage of Time)**
2. **Observe (Incorporate Evidence)**

### Step 1: Passage of Time (1-Step State Evolution)
As one unit of time passes (before we take a new measurement), the state of the world changes according to the transition dynamics. Because time passes, our uncertainty *increases*.

We calculate the intermediate belief $B'_{t+1}(X)$, representing our prediction for time $t+1$ based only on evidence up to time $t$:
$$ B'_{t+1}(X_{t+1}) = P(X_{t+1} \mid e_{1:t}) = \sum_{x_t} P(X_{t+1} \mid x_t) B_t(x_t) $$

*Conceptually: We take our old belief, and push it forward through the transition matrix.*

### Step 2: Observation (1-Step Emission)
Now, we receive a new piece of evidence $e_{t+1}$ from our sensors. This new information allows us to *decrease* our uncertainty.

We update our intermediate prediction by reweighting it with the likelihood of the new observation, using Bayes' Rule. 
$$ B_{t+1}(X_{t+1}) = P(X_{t+1} \mid e_{1:t+1}) = \alpha P(e_{t+1} \mid X_{t+1}) B'_{t+1}(X_{t+1}) $$

*Conceptually: We take our prediction, multiply it by the emission probability of what we just saw, and normalize the table to sum to 1. States where the observation is highly unlikely are suppressed; states where the observation is expected are boosted.*

### The Forward Algorithm
The **Forward Algorithm** simply chains these two operations together simultaneously in an online fashion. At every time step, it takes the previous belief, projects it forward through the transitions, multiplies it by the new emission likelihoods, and normalizes it.

$$ P(X_t \mid e_{1:t}) = \alpha P(e_t \mid X_t) \sum_{x_{t-1}} P(X_t \mid x_{t-1}) P(x_{t-1} \mid e_{1:t-1}) $$

By running this loop indefinitely, an agent can maintain a highly accurate, constantly updating belief about its location, the spoken word, or the state of the world, strictly by maintaining a single probability distribution array in memory.

---

## Summary

- **Markov Chains** represent sequences of states over time using transition probabilities, bounded by the Markov Assumption (future independent of past given present).
- In a pure Markov Chain without observations, uncertainty accumulates until the system reaches a **stationary distribution**.
- **Hidden Markov Models (HMMs)** augment Markov Chains with an **Emission Model**, acknowledging that the true state is hidden and only noisy sensor readings are available.
- **Filtering** is the process of tracking the agent's Belief State.
- **The Forward Algorithm** performs filtering via a continuous two-step process: **Elapsing time** (which increases uncertainty by pushing the belief through transition dynamics) and **Observing** (which decreases uncertainty by reweighting the belief according to the emission likelihoods).
