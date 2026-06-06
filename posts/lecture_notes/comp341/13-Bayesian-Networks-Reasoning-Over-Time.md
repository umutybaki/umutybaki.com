---
title: "13 - Bayesian Networks: Reasoning Over Time"
date: "2026-05-11"
description: "Course: COMP341 Introduction to Artificial Intelligence, Koç University"
---

# 13 - Bayesian Networks: Reasoning Over Time

**Course**: COMP341 Introduction to Artificial Intelligence, Koç University  
**Instructor**: Asst. Prof. Barış Akgün  
**Topic**: Markov Models, Hidden Markov Models, Filtering, Particle Filtering, Viterbi Algorithm, Dynamic Bayes Nets



## 1 Why Reason Over Time

So far in this course, we have used Bayesian Networks to represent uncertainty at a single point in time - you observe some evidence, you query some hidden variable, done. But the real world is *dynamic*. Consider:

- A robot moving through a building. Where is it *right now*? Where will it be in 5 seconds?
- A patient in an ICU. What is their health state *trending toward*?
- A voice assistant processing your speech. What *word* did you just say?
- A financial model predicting a stock price tomorrow based on everything it has seen.

In all these cases, we have a **sequence of observations** and we want to infer something about a **sequence of hidden states**. The observations arrive one at a time, and crucially, the underlying state changes over time too.

**Applications include:**
- Speech recognition (acoustic signals → words)
- Robot localization (sensor readings → position on map)
- Medical monitoring (vitals over time → patient status)
- Financial market analysis (price series → hidden market state)
- Activity recognition (sensor stream → "walking", "sitting", etc.)
- Gene sequence alignment (DNA sequence → functional regions)
- Cryptanalysis (ciphertext sequence → plaintext)

The core challenge: **how do we model time, and how do we do inference efficiently as new data streams in?**


## 2 Markov Models

A **Markov model** is a chain-structured Bayesian Network. Instead of a general DAG, the variables are laid out in a line:

```text
X_1 → X_2 → X_3 → X_4 → ...
```

Each node `X_t` represents the **state** of the world at time step `t`. The arrow from `X_{t-1}` to `X_t` encodes the transition probability.

### Key Parameters

**Transition Probabilities (Dynamics):** `P(X_t | X_{t-1})`  
This tells you: "Given I was in state `s` at time `t-1`, what is the probability I am now in state `s'` at time `t`?"

**Initial State Probabilities (Prior):** `P(X_1)`  
This tells you the probability distribution over all possible starting states.

**Stationarity assumption:** The transition probabilities `P(X_t | X_{t-1})` are the *same* for all time steps. The "rules of the game" do not change. This is a simplifying assumption but holds in most practical models (weather patterns are roughly the same rules year-round, a robot's kinematics do not change over time).

### Intuition

Think of the state as the "full description of the world" at one moment. If you know the current state perfectly, you can compute the distribution over future states without needing the history. This is the core idea behind the Markov assumption.


## 3 The Markov Property

The **Markov Property** says: the future is conditionally independent of the past, given the present.

Mathematically:
```
P(X_{t+1} | X_t, X_{t-1}, ..., X_1) = P(X_{t+1} | X_t)
```

**Intuition with an analogy:** Think of a chess game. To decide the best next move, all you need to know is the current board position - the history of how we got here does not matter for evaluating future outcomes. The current board position is a *sufficient statistic* for the future.

Another analogy: think of the memory-less property of a coin flip. The coin does not "remember" it landed heads five times in a row. The next flip depends only on its current state (fair coin, biased coin), not the history.

### Extended Controlled Markov Systems

If a robot can take actions (control inputs), the Markov assumption extends to:
```typescript
P(X_{t+1} | X_t, U_t)
```
where `U_t` is the control input at time `t`. Next state depends on current state AND current action, but nothing further back.

### HigherOrder Markov Models

A **second-order** Markov model lets the next state depend on the last TWO states:
```typescript
P(X_t | X_{t-1}, X_{t-2})
```

A **k-th order** model:
```
P(X_t | X_{t-1}, X_{t-2}, ..., X_{t-k})
```

The trick is you can always convert a higher-order Markov model back to a first-order one by redefining the state as a window: `X_bar_{t-1} = [X_{t-1}, X_{t-2}, ..., X_{t-k}]`, giving `P(X_t | X_bar_{t-1})`.


## 4 Markov Chains Formal Structure

A **Markov Chain** is a Markov model where all states are **directly observable**. It is a discrete-state, discrete-time random dynamical system.

### Properties
- Finite number of states N (e.g., states `{a, b, c}`)
- State transitions are random (stochastic)
- The next state depends only on the current state (Markov assumption)
- States are directly observed at each time step

### The Transition Matrix

The transition probabilities are conveniently stored in a matrix `T`:

```
T_ij = P(X_{t+1} = s_i | X_t = s_j)
```

Note the indexing: `T_ij` is the probability of *going to* state `s_i` *from* state `s_j`. The columns represent "current state", the rows represent "next state". Each **column** must sum to 1 (since from any given state, you must go somewhere).

**Example: Weather Chain**

States: `{sun, rain}`

```
         Current State
         sun    rain
next sun  0.9    0.3
next rain 0.1    0.7
```

Interpretation: If it is sunny today, there is a 90% chance of sun tomorrow and 10% chance of rain. If it is raining today, there is a 30% chance of sun tomorrow and 70% chance of rain.

### Joint Distribution of Markov Chains Formal Structure

For a chain of T time steps:
```
P(X_1, X_2, ..., X_T) = P(X_1) * P(X_2|X_1) * P(X_3|X_2) * ... * P(X_T|X_{T-1})
                       = P(X_1) * prod_{t=2}^{T} P(X_t | X_{t-1})
```

This follows directly from the BN chain rule plus the Markov conditional independence structure.


## 5 The MiniForward Algorithm

### The Question of The MiniForward Algorithm

Given:
- The initial distribution `P(X_1)` (known)
- The transition probabilities `P(X_t | X_{t-1})`

**What is the marginal distribution `P(X_t)` at some future time `t`?**

### Derivation

We want `P(X_t)`. We marginalize out `X_{t-1}`:

```
P(X_t) = sum_{x_{t-1}} P(X_t, X_{t-1})
        = sum_{x_{t-1}} P(X_t | X_{t-1}) * P(X_{t-1})
```

This is a **recurrence**: to compute the distribution at time `t`, you need the distribution at time `t-1`. So you run it forward from `t=1`:

```
P(X_2) = sum_{x_1} P(X_2 | x_1) * P(x_1)
P(X_3) = sum_{x_2} P(X_3 | x_2) * P(x_2)
...
P(X_t) = sum_{x_{t-1}} P(X_t | x_{t-1}) * P(X_{t-1})
```

### Pseudocode

```text
function MiniForward(P_X1, T_matrix, target_time):
    P_current = P_X1
    for t = 2 to target_time:
        P_next = []
        for each state s_i:
            P_next[s_i] = sum_{s_j} T[s_i][s_j] * P_current[s_j]
        P_current = P_next
    return P_current
```

### Linear Algebra View

In matrix form, the forward step is simply:
```
P_t = T * P_{t-1}
```

And therefore:
```
P_t = T^{t-1} * P_1
```

The state distribution at time `t` is obtained by multiplying the transition matrix `(t-1)` times by the initial distribution vector.

### Weather Example Walkthrough

Start with `P(X_1 = sun) = 1.0`, `P(X_1 = rain) = 0.0`.

**After 1 step:**
```text
P(X_2 = sun) = P(sun|sun)*P(sun) + P(sun|rain)*P(rain)
             = 0.9 * 1.0 + 0.3 * 0.0
             = 0.9

P(X_2 = rain) = 0.1 * 1.0 + 0.7 * 0.0 = 0.1
```

**After 2 steps:**
```
P(X_3 = sun) = 0.9 * 0.9 + 0.3 * 0.1 = 0.81 + 0.03 = 0.84
P(X_3 = rain) = 0.1 * 0.9 + 0.7 * 0.1 = 0.09 + 0.07 = 0.16
```

### Ghost Localization Example

In the Pacman ghost-tracking example:
- States are grid positions `(i, j)` on a map
- A ghost at position `(3,3)` can move to any of its 4 neighbors or stay, each with probability `1/5`
- A corner or boundary cell may have fewer neighbors, so probabilities redistribute

After the ghost starts at `(3,3)` with probability 1.0:
- At T=1: probability is concentrated at `(3,3)` and its 4 neighbors, each with probability `0.2`
- At T=2: probability spreads further; `(3,3)` gets re-occupied from all its neighbors
- At T=3: distribution is even more spread out

The key calculation for `P(X_3 = (3,3))`:
```text
P(X_3=(3,3)) = P(X_3=(3,3)|X_2=(3,3)) * P(X_2=(3,3))
             + P(X_3=(3,3)|X_2=(3,2)) * P(X_2=(3,2))
             + P(X_3=(3,3)|X_2=(2,3)) * P(X_2=(2,3))
             + P(X_3=(3,3)|X_2=(4,3)) * P(X_2=(4,3))
             + P(X_3=(3,3)|X_2=(3,4)) * P(X_2=(3,4))
             = 0.2*0.2 + 0.2*0.2 + 0.2*0.2 + 0.2*0.2 + 0.2*0.2
             = 0.2
```

Each of the 5 neighbors (including self) contributes 0.2*0.2 = 0.04, and 5 * 0.04 = 0.20.

Similarly, `P(X_3=(3,4))` receives contributions only from `(3,4)` itself and its neighbor `(3,3)`:
```typescript
P(X_3=(3,4)) = P(3,4|3,4)*P(X_2=(3,4)) + P(3,4|3,3)*P(X_2=(3,3)) + ...
             = 0.2*0.2 + 0.2*0.2 + 0 + 0 + 0
             = 0.08
```


## 6 Stationary Distributions

### What Happens LongTerm

If you run the mini-forward algorithm long enough (t → infinity), what happens?

**Uncertainty accumulates.** With each time step and no observations, your belief about the current state spreads out further and further. Eventually, for most chains, the distribution converges to a **stationary distribution** regardless of where you started.

### Stationary Distribution Defined

A distribution `pi` is **stationary** (also called the steady-state distribution) if it is unchanged by one step of the transition:
```
pi = T * pi
```

Equivalently, `pi` is an eigenvector of `T` with eigenvalue 1.

**Key insight**: For most chains (specifically ergodic chains - those that are irreducible and aperiodic), the stationary distribution:
1. **Exists and is unique**
2. The chain converges to it **regardless of starting state**
3. Represents where you spend most time in the long run

**Weather example**: You can solve `pi = T * pi` for the weather chain:
```typescript
pi(sun) = 0.9 * pi(sun) + 0.3 * pi(rain)
pi(rain) = 0.1 * pi(sun) + 0.7 * pi(rain)
pi(sun) + pi(rain) = 1

Solution: pi(sun) = 0.75, pi(rain) = 0.25
```

Verification: `0.9 * 0.75 + 0.3 * 0.25 = 0.675 + 0.075 = 0.75`. Correct.

**Practical implication**: After many time steps without observations, you essentially know nothing more than the stationary distribution - you have lost all your information. This is why **observations are crucial** for maintaining useful beliefs.

For the Pacman ghost example, the stationary distribution is NOT uniform because corner and edge tiles have fewer neighbors (and therefore fewer ways to enter them). Interior tiles that are reachable from many directions accumulate more probability mass.


## 7 Hidden Markov Models HMMs

### Motivation We Cannot Always See the State

A pure Markov chain assumes states are directly observable. But in reality:
- You cannot directly observe a robot's exact position - you get noisy sensor readings
- You cannot see the weather directly through a wall - you see whether someone has an umbrella
- You cannot see which word was spoken - you receive an acoustic waveform

We need to extend Markov chains to handle **partial, noisy observations**.

### HMM Structure

A Hidden Markov Model adds **emission variables** (observations/evidence) `E_t` at each time step:

```text
X_1 → X_2 → X_3 → X_4   (hidden state chain)
 |     |     |     |
 v     v     v     v
E_1   E_2   E_3   E_4    (observations/emissions)
```

Each observation `E_t` depends only on the current hidden state `X_t`. The states themselves are **hidden** - you never observe them directly.

### Three Components of an HMM

**1. Initial Distribution:** `P(X_1)`  
The prior probability over states at time 1.

**2. Transition Model:** `P(X_t | X_{t-1})`  
Stored as matrix A: `A_ij = P(X_{t+1} = s_i | X_t = s_j)`  
How the hidden state evolves over time.

**3. Emission Model:** `P(E_t | X_t)`  
Stored as matrix E: `E_kj = P(E_t = e_k | X_t = s_j)`  
How observations are generated from the hidden state. Also called the sensor model or observation model.

### Conditional Independence Properties

Two crucial conditional independence facts:

1. **Markov hidden process**: `P(X_{t+1} | X_t, X_{t-1}, ..., X_1) = P(X_{t+1} | X_t)` - the usual Markov property on the hidden states

2. **Emission independence**: `P(E_t | X_1, ..., X_T, E_1, ..., E_{t-1}, E_{t+1}, ...) = P(E_t | X_t)` - each emission depends only on its own time step's hidden state, nothing else

### Joint Distribution of Hidden Markov Models HMMs

```
P(X_1, E_1, X_2, E_2, ..., X_T, E_T)
= P(X_1) * P(E_1|X_1) * prod_{t=2}^{T} [P(X_t|X_{t-1}) * P(E_t|X_t)]
```

### Weather HMM Example

**Hidden states**: `X_t in {rain, sun}` (you cannot directly see the weather outside)  
**Observations**: `E_t in {umbrella, no umbrella}` (you observe whether your colleague brought an umbrella)

**Transition model:**
```
P(R_{t+1}=rain | R_t=rain) = 0.7   P(R_{t+1}=sun  | R_t=rain) = 0.3
P(R_{t+1}=rain | R_t=sun)  = 0.1   P(R_{t+1}=sun  | R_t=sun)  = 0.9
```

**Emission model:**
```
P(U=umbrella | R=rain) = 0.9   P(U=no umbrella | R=rain) = 0.1
P(U=umbrella | R=sun)  = 0.2   P(U=no umbrella | R=sun)  = 0.8
```

**Intuition**: If it is raining, people almost always bring umbrellas. If it is sunny, most people do not bother, but some do anyway.

### RealWorld HMM Examples

| Application | Hidden States | Observations |
| :--- | :--- | :--- |
| Speech recognition | Word positions (tens of thousands) | Acoustic signal (continuous) |
| Machine translation | Translation options | Source language words |
| Robot tracking | Grid positions (continuous map) | Range/sonar readings |
| Medical monitoring | Patient health state | Vital signs, lab values |


## 8 Inference Tasks in HMMs

Given an HMM, there are four main things you might want to compute:

### 1 Filtering Monitoring
**Question:** What is the current state distribution given all evidence so far?
```
P(X_t | e_1, e_2, ..., e_t) = P(X_t | e_{1:t})
```
**Use case:** Real-time robot tracking - "Where is the robot *right now*?"  
**Algorithm:** Forward Algorithm

### 2 Prediction
**Question:** What will the state be at some future time, given evidence so far?
```
P(X_{t+k} | e_{1:t})   (where k > 0, looking into the future)
```
**Use case:** Robot path planning - "Where will the robot be in 3 seconds?"  
**Method:** Run filtering to get `P(X_t | e_{1:t})`, then run the mini-forward algorithm forward k steps.

### 3 Smoothing
**Question:** What was the state at some *past* time, given ALL evidence (including future)?
```
P(X_k | e_{1:t})   (where k < t, looking back)
```
**Use case:** Re-analyzing medical sensor data - "What was the patient's true state 2 hours ago, given everything we know now?"  
**Algorithm:** Forward-Backward Algorithm

### 4 Most Likely Explanation Decoding
**Question:** What is the single most likely sequence of hidden states that produced the observed evidence?
```text
argmax_{x_{1:t}} P(x_{1:t} | e_{1:t})
```
**Use case:** Speech recognition - "What is the most likely word sequence given this acoustic signal?"  
**Algorithm:** Viterbi Algorithm

### 5 Likelihood of a Sequence
**Question:** What is the probability of observing exactly this sequence of evidence?
```
P(e_{1:t}) = sum_X P(e_{1:t} | X) * P(X)
```
**Use case:** Model selection - "Is this HMM a better fit for my data than that other HMM?"  
**Method:** Can be computed using a by-product of the forward algorithm.


## 9 Filtering The Forward Algorithm

### The Belief State

Define the **belief state** at time `t` as:
```
B_t(X) = P(X_t | e_1, e_2, ..., e_t)
```

This is a full probability distribution over all possible states at time `t`, conditioned on all evidence seen so far. It compactly summarizes everything the agent knows about the current state.

Also define the **predicted belief** (after time passage but before new observation):
```
B'_t(X) = P(X_t | e_{1:t-1})
```

### Two Update Operations

The forward algorithm alternates between two update operations:

#### Operation 1: Passage of Time (Predict)

Given `B_t(X) = P(X_t | e_{1:t})`, compute the **prior** for the next time step before seeing new evidence:
```
B'_{t+1}(X) = P(X_{t+1} | e_{1:t})
             = sum_{x_t} P(X_{t+1} | x_t) * B_t(x_t)
```

**Intuition:** You "push" your current beliefs forward through the transition model. If you think the robot is probably in room A, and it usually moves to room B, then your prediction for the next step has more weight on room B. Uncertainty increases because the transition is probabilistic.

#### Operation 2: Observation Update (Condition)

Given the prediction `B'_{t+1}(X)` and new evidence `e_{t+1}`, update to get the new belief:
```text
B_{t+1}(X) = P(X_{t+1} | e_{1:t+1})
           ∝ P(e_{t+1} | X_{t+1}) * B'_{t+1}(X_{t+1})
```

The `∝` means "proportional to" - we multiply by the likelihood of the new observation given each state, then normalize (divide by the total so probabilities sum to 1).

**Intuition:** You "reweight" your prediction by how likely the new observation would be from each state. States consistent with the observation get upweighted; states inconsistent with it get downweighted. Uncertainty decreases (you have new information).

### Derivation of the Observation Update

Starting from the definition and using Bayes' rule:
```text
P(X_{t+1} | e_{t+1}, e_{1:t})
= alpha * P(e_{t+1} | X_{t+1}, e_{1:t}) * P(X_{t+1} | e_{1:t})    [Bayes' rule]
= alpha * P(e_{t+1} | X_{t+1}) * B'_{t+1}(X_{t+1})                 [emission independence]
```

where `alpha = 1 / P(e_{t+1} | e_{1:t})` is the normalizing constant.

### Combined Forward Algorithm

```
B_{t+1}(X_{t+1}) = alpha * P(e_{t+1} | X_{t+1}) * sum_{x_t} P(X_{t+1} | x_t) * B_t(x_t)
```

This one equation does both operations at once:
- `sum_{x_t} P(X_{t+1} | x_t) * B_t(x_t)` - passage of time
- `P(e_{t+1} | X_{t+1}) * ...` - observation update
- `alpha * ...` - normalization

### Pseudocode for Forward Algorithm

```text
function Forward(initial_dist, transition, emission, observations):
    B = initial_dist          # B[s] = P(X_1 = s)
    
    for each time step t = 1 to T:
        # Observation update
        for each state s:
            B[s] = emission[s][observations[t]] * B[s]
        normalize(B)          # divide by sum so B sums to 1
        
        # Passage of time (if not last step)
        if t < T:
            B_new = {}
            for each state s_new:
                B_new[s_new] = sum_{s_old} transition[s_new][s_old] * B[s_old]
            B = B_new
    
    return B   # This is P(X_T | e_{1:T})
```


## 10 Worked Example Weather HMM Filtering

**Setup:**
- `P(rain_1) = 0.5, P(sun_1) = 0.5` (uniform prior)
- Transitions and emissions as defined in the Weather HMM above
- Observations: day 1 = umbrella (`+u`), day 2 = umbrella (`+u`)

### Step 0 Initialize Belief

```
B_1(rain) = 0.5
B_1(sun)  = 0.5
```

### Step 1 Observe e1 umbrella

Apply observation update (multiply by likelihood, renormalize):
```
B_1'(rain) proportional to P(+u | rain) * B_1(rain) = 0.9 * 0.5 = 0.45
B_1'(sun)  proportional to P(+u | sun)  * B_1(sun)  = 0.2 * 0.5 = 0.10

Sum = 0.55
B_1(rain) = 0.45 / 0.55 = 0.818
B_1(sun)  = 0.10 / 0.55 = 0.182
```

Makes sense: seeing an umbrella makes rain more likely.

### Step 2 Elapse Time Predict Day 2

Apply transition model:
```text
B'_2(rain) = P(rain|rain)*B_1(rain) + P(rain|sun)*B_1(sun)
           = 0.7 * 0.818 + 0.3 * 0.182
           = 0.573 + 0.055 = 0.627

B'_2(sun)  = P(sun|rain)*B_1(rain) + P(sun|sun)*B_1(sun)
           = 0.3 * 0.818 + 0.7 * 0.182
           = 0.245 + 0.127 = 0.373
```

Note that 0.627 + 0.373 = 1.0, so no renormalization needed after the time step.

### Step 3 Observe e2 umbrella

Apply observation update:
```
B_2'(rain) proportional to P(+u | rain) * B'_2(rain) = 0.9 * 0.627 = 0.5643
B_2'(sun)  proportional to P(+u | sun)  * B'_2(sun)  = 0.2 * 0.373 = 0.0746

Sum = 0.639
B_2(rain) = 0.5643 / 0.639 = 0.883
B_2(sun)  = 0.0746 / 0.639 = 0.117
```

After two consecutive days of umbrella sightings, we are now about 88% confident it is raining. Intuitive!

### Summary of the Run

| Time | Event | P(rain) | P(sun) |
| :--- | :--- | ---: | ---: |
| t=1 before obs | Prior | 0.50 | 0.50 |
| t=1 after obs (+u) | Updated | 0.818 | 0.182 |
| t=2 before obs | Predicted | 0.627 | 0.373 |
| t=2 after obs (+u) | Updated | 0.883 | 0.117 |


## 11 Robot Localization with HMMs

This is one of the most important practical applications. A robot has a map but does not know where it is.

**State:** `X_t` = position on the grid (tile `(i, j)`)  
**Observation:** `E_t` = readings from 4 directional sensors (is there a wall to the North? South? East? West?)

**Sensor model:** The robot can read which directions have walls, with at most 1 mistake per reading. So if there is a wall to the North and the robot is at a certain tile, it will correctly report "wall North" almost always but might miss it occasionally, or falsely report a wall in another direction.

**Motion model:** The robot usually executes its intended move, but with small probability it fails to move (stays in place).

### Why Multiple Time Steps Help

At t=0, the robot could be anywhere - the belief is uniform over all tiles.

After one reading (t=1): some tiles are now impossible (completely inconsistent with reading). Others are highly probable (perfectly consistent). Others have lighter probability (consistent with exactly one mistake). Several clusters remain.

After two readings (t=2): movement eliminates more tiles. Only tiles reachable from the previous likely set, AND consistent with the new reading, survive.

After 5+ readings: the robot has typically localized itself to a single tile or a small cluster.

**Key insight:** The HMM lets the robot *accumulate evidence over time*. Even if a single sensor reading is ambiguous (many tiles could have given that reading), multiple consistent readings together pin down the location.


## 12 Approximate Filtering Particle Filters

### Why Approximate

The exact forward algorithm requires storing and updating a full distribution `B_t(X)` over all states. Problems arise when:
- The state space is huge (e.g., continuous positions in a large building - infinitely many states)
- Even just storing the distribution is infeasible
- Computing `sum_{x_{t-1}} P(X_t | x_{t-1}) * B_{t-1}(x_{t-1})` takes `O(|X|^2)` time

**Solution:** Represent the distribution approximately using a set of **particles** (samples).

### Core Idea

Instead of tracking `P(X=s)` for every state `s`, track a list of `N` particles (samples from the distribution). Each particle is a possible state value. The fraction of particles in state `s` approximates `P(X=s)`.

**Example with 10 particles:**
```text
Particles: [(3,3), (2,3), (3,3), (3,2), (3,3), (3,2), (2,1), (3,3), (3,3), (2,1)]

Approximate distribution:
P((3,3)) ≈ 5/10 = 0.5
P((2,3)) ≈ 1/10 = 0.1
P((3,2)) ≈ 2/10 = 0.2
P((2,1)) ≈ 2/10 = 0.2
All other positions: P ≈ 0
```

More particles = better approximation. This is like using a larger sample in statistics.

### The ThreeStep Particle Filter Cycle

For each time step:

#### Step 1: Elapse Time (Sample Next State)

For each particle `x_t^(i)`, sample a new particle from the transition model:
```
x_{t+1}^(i) ~ P(X_{t+1} | X_t = x_t^(i))
```

You draw randomly from the transition distribution. Particles move around the state space according to the dynamics. If most particles are near `(3,3)` and the ghost tends to move right, most new particles will be near `(4,3)`.

**This is equivalent to prior sampling** - the empirical distribution of the particles after this step approximates `P(X_{t+1} | e_{1:t})`.

#### Step 2: Weight by Observation

Do NOT sample the observation - it is fixed! Instead, assign each particle a weight equal to the likelihood of the observed evidence:
```
w^(i) = P(e_{t+1} | X_{t+1} = x_{t+1}^(i))
```

Particles in states that are consistent with the observation get high weight. Particles in states inconsistent with the observation get low weight (close to 0).

At this point, the particles are a **weighted sample** from the updated distribution. The weights do not sum to 1 in general - they sum to an approximation of `P(e_{t+1})`.

**This is equivalent to likelihood weighting** - a technique for approximate inference in BNs.

#### Step 3: Resample

To go back to an unweighted representation, resample `N` new particles from the weighted distribution:

1. Normalize weights: divide each `w^(i)` by `sum_j w^(j)`
2. Build a cumulative distribution over the particles
3. Draw `N` uniform random numbers in `[0, 1]` and map each to a particle via the cumulative distribution
4. These `N` drawn particles (with repetition allowed) are the new unweighted particle set

Particles with high weight get copied many times; particles with low weight often disappear entirely.

### Pseudocode for Particle Filter

```text
function ParticleFilter(N, initial_dist, transition, emission, observations):
    # Initialize
    particles = [sample from initial_dist for _ in range(N)]
    
    for each time step t:
        # Step 1: Elapse time
        new_particles = []
        for each particle p in particles:
            p_new = sample from transition(· | p)
            new_particles.append(p_new)
        particles = new_particles
        
        # Step 2: Weight by observation
        weights = []
        for each particle p in particles:
            w = emission(observations[t] | p)
            weights.append(w)
        
        # Step 3: Resample
        normalize(weights)
        particles = resample_with_replacement(particles, weights, N)
    
    return particles  # Approximate P(X_T | e_{1:T})
```

### Detailed Resampling Procedure

```text
function resample(particles, weights, N):
    # Step 1: Normalize
    total = sum(weights)
    normalized = [w / total for w in weights]
    
    # Step 2: Cumulative sum (CDF)
    cumsum = [0.0] * len(normalized)
    cumsum[0] = normalized[0]
    for i in range(1, len(normalized)):
        cumsum[i] = cumsum[i-1] + normalized[i]
    
    # Step 3: Sample N particles
    new_particles = []
    for _ in range(N):
        u = random_uniform(0, 1)
        idx = 0
        while cumsum[idx] < u:
            idx += 1
        new_particles.append(particles[idx])
    
    return new_particles
```

**Worked resampling example** (from slides):

| Particle | Weight | Normalized | Range |
| :---: | ---: | ---: | :--- |
| (3,3) | 0.1 | 0.02 | [0.00, 0.02) |
| (2,1) | 0.9 | 0.18 | [0.02, 0.20) |
| (2,1) | 0.9 | 0.18 | [0.20, 0.38) |
| (3,1) | 0.4 | 0.08 | [0.38, 0.46) |
| (3,2) | 0.3 | 0.06 | [0.46, 0.52) |
| (2,2) | 0.4 | 0.08 | [0.52, 0.60) |
| (1,1) | 0.4 | 0.08 | [0.60, 0.68) |
| (3,1) | 0.4 | 0.08 | [0.68, 0.76) |
| (2,1) | 0.9 | 0.18 | [0.76, 0.94) |
| (3,2) | 0.3 | 0.06 | [0.94, 1.00) |

Sum of weights = 5.0. A uniform draw of 0.21 lands in `[0.20, 0.38)` → particle `(2,1)` is selected.

### Sample Impoverishment

A known problem with particle filters: after resampling, you can lose **diversity**. If one particle happens to have extremely high weight, all `N` new particles might become copies of that one. You then have no diversity to represent uncertainty about the state.

**Workarounds:**
- Use more particles (increases computational cost)
- Use regularization (add small random noise to resampled particles)
- Use alternative resampling strategies (stratified resampling, systematic resampling)
- Use Rao-Blackwellized particle filters (analytically marginalize out some variables)

### Practical Note Robot Localization

In practice, robot localization (e.g., the "Monte Carlo Localization" algorithm used in autonomous robots and self-driving cars) is exactly a particle filter:
- State space = continuous 2D position + orientation `(x, y, theta)`
- Cannot store exact `B_t(X)` because state space is continuous
- Particles represent `N` candidate poses
- Sensor model uses LIDAR/sonar range readings
- Motion model uses wheel encoder odometry


## 13 Most Likely Explanation Viterbi Algorithm

### The Query

Filtering gives you the marginal at each time: `P(X_t | e_{1:t})`. But sometimes you want the **single most probable entire path**:
```text
argmax_{x_1, x_2, ..., x_t} P(x_1, x_2, ..., x_t | e_1, ..., e_t)
```

This is a different question from filtering. The most likely state at each time step individually (from filtering) might not combine into the most likely path because there is a consistency requirement across time.

**Analogy:** If you are decoding a GPS path, you do not want the most likely location at each second independently - you want the most likely *trajectory* that is consistent with motion constraints.

**Example application:** Speech recognition. You do not just want the most likely phoneme at each time independently - you want the most likely sequence of phonemes/words that explains the entire utterance. Word boundaries and grammar impose sequential constraints.

### State Trellis

Visualize the computation as a **trellis**:
- Rows = states (e.g., `{rain, sun}`)
- Columns = time steps (t=1, t=2, t=3, ...)
- Each node `(state, time)` is connected to all nodes in the adjacent time steps via arcs weighted by transition probabilities

```text
     t=1    t=2    t=3    t=4
sun  o------o------o------o
      \    / \    / \    /
       \  /   \  /   \  /
        \/     \/     \/
        /\     /\     /\
       /  \   /  \   /  \
      /    \ /    \ /    \
rain o------o------o------o
```

Each node also has a local weight from the emission model: `P(e_t | state_t)`.

Each path through the trellis has a probability equal to:
- Initial probability `P(x_1)`
- Times all transition probabilities along the path
- Times all emission probabilities at each node

**Forward algorithm** computes the SUM of probabilities over all paths reaching each node → marginal filtering.  
**Viterbi algorithm** computes the MAX probability over all paths reaching each node → best path.

### Viterbi Recursion

Define `m_t(s)` = the probability of the **most probable path** ending in state `s` at time `t`:

**Base case (t=1):**
```
m_1(s) = P(X_1 = s) * P(e_1 | X_1 = s)
```

**Recursion (t > 1):**
```
m_t(s) = P(e_t | s) * max_{s'} [P(X_t = s | X_{t-1} = s') * m_{t-1}(s')]
```

Also store the backpointer to recover the actual path:
```text
bp_t(s) = argmax_{s'} [P(X_t = s | X_{t-1} = s') * m_{t-1}(s')]
```

### Recovering the Path Backtracking

After computing all `m_T(s)` values, find the best final state:
```text
s*_T = argmax_s m_T(s)
```

Then trace back using the stored backpointers:
```
s*_t = bp_{t+1}(s*_{t+1})   for t = T-1, T-2, ..., 1
```

### Pseudocode for Viterbi

```text
function Viterbi(initial_dist, transition, emission, observations):
    T = length(observations)
    N = number of states
    
    # Initialize
    m   = table of size N x T    # m[s][t] = max prob of any path ending in s at t
    bp  = table of size N x T    # bp[s][t] = best previous state
    
    for each state s:
        m[s][1]  = initial_dist[s] * emission[s][observations[1]]
        bp[s][1] = None
    
    # Fill forward
    for t = 2 to T:
        for each state s (destination):
            best_prob  = -infinity
            best_state = None
            for each state s_prev (source):
                candidate = transition[s][s_prev] * m[s_prev][t-1]
                if candidate > best_prob:
                    best_prob  = candidate
                    best_state = s_prev
            m[s][t]  = emission[s][observations[t]] * best_prob
            bp[s][t] = best_state
    
    # Find best final state
    best_final = argmax_s m[s][T]
    
    # Trace back
    path = [best_final]
    current = best_final
    for t = T downto 2:
        current = bp[current][t]
        path.prepend(current)
    
    return path
```

### Viterbi vs Forward The Key Difference

The two algorithms are structurally identical - only the aggregation operation differs:

```
Forward:  f_t(s) = P(e_t|s) * SUM_{s'} [P(X_t=s | s') * f_{t-1}(s')]
Viterbi:  m_t(s) = P(e_t|s) * MAX_{s'} [P(X_t=s | s') * m_{t-1}(s')]
```

Replace `SUM` with `MAX` and add backpointer tracking. Both run in `O(T * N^2)` time.

**Forward** asks: "What is the total probability mass of all paths reaching state s at time t, given observations so far?"  
**Viterbi** asks: "What is the probability of the single best path reaching state s at time t, given observations so far?"

### Worked Viterbi Example Ghost Tracking

Given `P(X_1 = (3,3)) = 1.0`, `e_2 = (2,4)`, `e_3 = (2,3)`:

**t=1:** `m_1((3,3)) = P(X_1=(3,3)) * P(e_1=(3,3)|X_1=(3,3)) = 1.0 * 1.0 = 1.0`. All other `m_1 = 0`.

**t=2:** For state `(1,1)`:
```
m_2((1,1)) = P(e_2=(2,4) | (1,1)) * max_{s'} [P((1,1)|s') * m_1(s')]
           = P((2,4)|(1,1)) * [P((1,1)|(3,3)) * 1.0]
           = 0 * ... = 0    (ghost at (1,1) cannot produce sonar reading at (2,4))
```

For state `(3,3)`:
```
m_2((3,3)) = P(e_2=(2,4) | (3,3)) * max_{s'} [P((3,3)|s') * m_1(s')]
           = (1/16) * P((3,3)|(3,3)) * 1.0
           = (1/16) * 0.2 = 1/80
```

For state `(2,3)`:
```
m_2((2,3)) = P(e_2=(2,4) | (2,3)) * P((2,3)|(3,3)) * 1.0
           = (3/32) * 0.2 = 3/160
```

And similarly for `(3,4)`:
```
m_2((3,4)) = P(e_2=(2,4) | (3,4)) * P((3,4)|(3,3)) * 1.0
           = (3/32) * 0.2 = 3/160
```

The state with the highest `m_2` becomes the most likely state at t=2. The backpointers at t=2 all point back to `(3,3)` since that was the only state with non-zero probability at t=1.

**t=3:** Continue the recursion with `e_3 = (2,3)`. The best path will be reconstructed by following backpointers from the best state at t=3.


## 14 Smoothing ForwardBackward Algorithm Overview

### The Question of Smoothing ForwardBackward Algorithm Overview

Filtering gives `P(X_t | e_{1:t})` - the belief at time `t` using only past + current evidence.  
Smoothing gives `P(X_k | e_{1:T})` - the belief at past time `k < T` using ALL evidence including future observations.

**Analogy:** You are analyzing recorded video of a robot. After the fact, with all information available (the complete recording), you want to estimate where the robot was at each frame. You can use "future" frames because you have them all recorded. This gives a more accurate estimate than filtering could have produced in real time.

### When to Use

- **Online/real-time processing:** Use filtering (only past evidence available)
- **Offline/batch processing:** Use smoothing (all evidence available)

Medical diagnosis from recorded patient data, analyzing a completed sports game, reviewing a robot's path after the mission - all benefit from smoothing.

### The ForwardBackward Algorithm

Factor the smoothing query:
```text
P(X_k | e_{1:T}) ∝ P(X_k, e_{1:T})
                  = P(X_k, e_{1:k}, e_{k+1:T})
                  = P(e_{k+1:T} | X_k) * P(X_k | e_{1:k}) * P(e_{1:k})
                  ∝ P(e_{k+1:T} | X_k) * P(X_k | e_{1:k})
```

- `P(X_k | e_{1:k})` = the **forward variable** alpha_k(s) - computed exactly by the forward algorithm
- `P(e_{k+1:T} | X_k)` = the **backward variable** beta_k(s) - what is the probability of seeing all future observations given the current state?

**Backward variable recursion (running backward from T to 1):**
```
beta_T(s) = 1   (base case: no future observations)
beta_t(s) = sum_{s'} P(X_{t+1}=s' | X_t=s) * P(e_{t+1} | s') * beta_{t+1}(s')
```

**Smoothed estimate:**
```text
P(X_k = s | e_{1:T}) ∝ alpha_k(s) * beta_k(s)
```

Normalize to get the final probability.

**Time complexity:** `O(T * N^2)` - one forward pass plus one backward pass, each linear in T and quadratic in N.


## 15 Dynamic Bayes Nets DBNs

### Motivation HMMs Track One Variable

HMMs track a single hidden state `X_t` at each time step. But in practice:
- A robot has both position `(x,y)` AND orientation `theta` - two interacting state variables
- A multi-agent scenario has many interacting agents
- A weather model might have temperature, pressure, and humidity all interacting

We need to track **multiple variables** simultaneously, where they may have complex interdependencies between each other AND across time.

### DBN Structure

A **Dynamic Bayes Net (DBN)** repeats a fixed Bayes network structure at each time step. Variables at time `t` can depend on variables from time `t-1`.

```typescript
t=1              t=2              t=3
G_a_1  →  G_a_2  →  G_a_3
  \          \          \
G_b_1  →  G_b_2  →  G_b_3
  |           |           |
E_a_1       E_a_2       E_a_3
E_b_1       E_b_2       E_b_3
```

Here `G_a` and `G_b` are two interacting hidden variables (e.g., positions of two ghosts), and `E_a`, `E_b` are their respective observations. The structure within each time slice and the cross-time connections are fixed and repeated.

### HMMs as Special Cases

An HMM is just a DBN with a single hidden variable per time slice and no intra-slice dependencies. DBNs are strictly more general.

### Exact Inference in DBNs

Variable elimination (the standard BN inference technique) applies directly:

1. **Unroll** the network for `T` time steps - create the full BN with all variables for all time steps
2. **Eliminate** variables in an efficient order to compute `P(X_T | e_{1:T})`

**Online (incremental) update:** To process a stream without the model growing indefinitely:
- At each time step, eliminate all variables from the previous time slice
- Only keep factors involving the current time slice
- This prevents memory and computation from growing with T

**Challenge:** The factor sizes can grow because variables from one time slice become correlated when computing the marginal over the next slice. This is the "interface" problem in DBNs. For rich DBN structures, exact inference can still be exponential in the number of state variables.

### DBN Particle Filters

Particle filters extend naturally to DBNs:

- Each **particle** is a complete assignment of all hidden variables at time `t`:  
  Example particle: `{G_a = (3,3), G_b = (5,3)}`
  
- **Initialize:** Generate prior samples for all hidden variables from `P(X_1)`

- **Elapse time:** For each particle, sample next values for ALL hidden variables jointly from the transition model
  ```
  Example successor: {G_a = (2,3), G_b = (6,3)}
  ```
  
- **Weight:** Multiply the weights from ALL emission models:
  ```typescript
  w = P(E_a | G_a) * P(E_b | G_b)
  ```

- **Resample:** Select particles (tuples of values) in proportion to their weights

The key advantage: this scales much better than exact inference in DBNs when the state space is large and continuous. Each particle represents one complete "hypothesis" about the full state of the world.


## 16 Summary and Cheatsheet

### Models Overview

| Model | States | Observations | Use When |
| :--- | :--- | :--- | :--- |
| Markov Chain | Directly observable | None | States visible; track dynamics over time |
| HMM | Hidden | Noisy/partial | States hidden; single state variable |
| DBN | Hidden | Noisy/partial | States hidden; multiple interacting variables |

### HMM Parameters

| Parameter | Symbol | Meaning |
| :--- | :--- | :--- |
| Initial distribution | `P(X_1)` | Prior over starting state |
| Transition model | `P(X_t given X_{t-1})` | How hidden state evolves |
| Emission model | `P(E_t given X_t)` | How observations are generated |

### Inference Tasks Summary

| Task | Query | Algorithm | Time | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| Filtering | `P(X_t given e_{1:t})` | Forward | O(T*N^2) | Real-time tracking |
| Prediction | `P(X_{t+k} given e_{1:t})` | Forward + Mini-Forward | O((T+k)*N^2) | Future planning |
| Smoothing | `P(X_k given e_{1:T})` | Forward-Backward | O(T*N^2) | Offline reanalysis |
| Most Likely Path | `argmax P(x_{1:t} given e_{1:t})` | Viterbi | O(T*N^2) | Decoding sequences |

### Key Equations at a Glance

**Belief state:** `B_t(X) = P(X_t | e_{1:t})`

**Passage of time (predict):**  
`B'_{t+1}(X) = sum_{x_t} P(X_{t+1} | x_t) * B_t(x_t)`

**Observation update:**  
`B_{t+1}(X) = alpha * P(e_{t+1} | X_{t+1}) * B'_{t+1}(X_{t+1})`

**Combined Forward step:**  
`B_{t+1}(X) = alpha * P(e_{t+1} | X) * sum_{x'} P(X | x') * B_t(x')`

**Viterbi base:** `m_1(s) = P(X_1=s) * P(e_1|s)`  
**Viterbi step:** `m_t(s) = P(e_t|s) * max_{s'} [P(s|s') * m_{t-1}(s')]`

**Matrix forward:** `P_t = T^{t-1} * P_1`

### Particle Filter in Three Steps

```text
1. Initialize: N particles sampled from P(X_1)
2. For each time step:
   a. Elapse:   For each particle p_i, draw p_i' ~ P(X_t+1 | p_i)
   b. Weight:   w_i = P(e_t+1 | p_i')
   c. Resample: Draw N new particles proportional to {w_i}
```

### Conceptual Analogies

- **Belief state** - your current "best guess distribution" about where things are
- **Passage of time** - predicting the future makes you less certain (uncertainty grows)
- **Observation update** - getting new evidence makes you more certain (uncertainty shrinks)
- **Stationary distribution** - if you stop observing long enough, you converge here regardless of where you started
- **Particle filter** - instead of computing a probability for every possible state, you maintain a swarm of candidate states
- **Viterbi** - instead of asking "what state am I probably in right now?", asking "what story (full sequence) best explains everything I've seen?"

### Important Distinctions to Remember

**Filtering vs. Smoothing:**
- Filtering: uses evidence up to current time only → causal, works online, slightly less accurate
- Smoothing: uses all evidence including future → non-causal, requires full sequence, more accurate

**Forward Algorithm vs. Viterbi:**
- Forward: SUM over all paths → gives marginal `P(X_t | e_{1:t})` at each step
- Viterbi: MAX over all paths → gives most probable full sequence `argmax P(x_{1:t} | e_{1:t})`
- Structurally identical - just replace sum with max, and add backpointer tracking

**Exact vs. Particle Filter:**
- Exact: O(|X|^2) per step, precise, infeasible for large/continuous state spaces
- Particle: O(N) per step (N = number of particles), approximate but scales to huge state spaces


*Notes compiled from COMP341 Lecture 13 slides. Koç University, Spring semester.*
