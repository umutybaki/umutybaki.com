---
title: "16 - Reinforcement Learning"
date: "2026-06-01"
description: "> Course: COMP341 Intro to AI, Koç University"
---

# 16 - Reinforcement Learning

> **Course**: COMP341 Intro to AI, Koç University  
> **Instructor**: Asst. Prof. Barış Akgün  
> **Prerequisites assumed**: MDPs, Value Iteration, Policy Iteration, Bellman equations



## 1 The Bridge from MDPs to RL

### What you already know

In MDPs you have a fully specified model: states S, actions A, transition probabilities T(s,a,s'), a reward function R(s,a,s'), and a discount factor γ. You run **Value Iteration** or **Policy Iteration** completely offline - you sit at your desk, crunch numbers, and hand the agent a polished optimal policy π* before it ever touches the real world.

This is powerful, but it assumes you already know T and R perfectly. In the real world, that assumption often fails catastrophically:

- A spider robot walking on icy ground: the physics are too complicated to model accurately.
- Showing ads to maximize long-term profit: you don't know the exact reward landscape.
- A robot arm learning to grasp novel objects: every new object changes the dynamics.

**Reinforcement Learning (RL)** is what you do when you can no longer afford to pre-compute everything offline. The agent is dropped into an unknown environment and must learn T and/or R by actually taking actions and observing what happens.

### The key distinction offline vs online

| Offline (MDP) | Online (RL) |
| :--- | :--- |
| Full model T and R known | T and/or R unknown |
| Compute policy before acting | Learn while acting |
| No risk to agent during planning | Agent may fail and get bad rewards |
| Value Iteration / Policy Iteration | TD Learning, Q-Learning, Policy Gradient |

The MDP framework itself doesn't change. The agent still has states, actions, rewards, and transitions. But now it must *discover* these from experience rather than having them handed over.


## 2 Why Reinforcement Learning

### Biological inspiration

Animals are not born knowing physics. A baby doesn't understand gravity - it learns by falling. A teenager whose body grows suddenly becomes clumsy and has to re-learn motor control. When an athlete is injured, they re-learn how to move their recovered body.

This trial-and-error process, guided by reward signals like pain (negative) and pleasure/food (positive), is exactly RL. Animals are hardwired to *recognize* certain signals as rewards (pain is bad, food is good). The agent must recognize the reward too - it's just another sensor input, but a special one.

### Practical necessity

Even when you could in principle build a model, RL gives you an alternative:
- **Simulation-based learning**: run RL inside a simulator (the model is computed implicitly by the simulator, not written down explicitly).
- **Offline data reuse**: RL algorithms can be adapted to work on datasets of past experience (offline RL / batch RL).
- **Partial knowledge**: often you know the transition model but not the reward (or vice versa). RL methods can exploit partial knowledge.


## 3 ModelBased vs ModelFree Learning

There are two fundamentally different approaches to learning in an unknown MDP.

### 31 ModelBased Learning

**Idea**: First, *learn* an approximate MDP model from experience. Then, *solve* that learned model using existing methods (Value Iteration, Policy Iteration, etc.).

**Step 1 - Learn the model empirically:**
- Every time you take action a in state s and land in state s', increment a counter C(s,a,s').
- Estimate: P̂(s'|s,a) = C(s,a,s') / Σ_{s''} C(s,a,s'')
- Record the reward R(s,a,s') when you observe it.

**Step 2 - Solve the learned MDP:**
- Treat your estimates T̂ and R̂ as if they were the true model.
- Run Value Iteration or Policy Iteration to get a policy.

**Example from the lecture:**

After observing several episodes in a grid world:
- B → C appeared twice with action east → T(B,east,C) ≈ 1.00
- C → D appeared 3 times, C → A appeared once with action east → T(C,east,D) = 0.75, T(C,east,A) = 0.25

This is like the classic "expected age" analogy: if you don't know P(Age), just collect samples and compute the empirical average. Eventually, sample frequencies converge to the true probabilities.

**Pros**: Once the model is good, you get the full power of optimal planning.  
**Cons**: Building an accurate model requires many samples. In high-dimensional state spaces (e.g., pixel-level game states), learning the full transition model is intractable.

### 32 ModelFree Learning

**Idea**: Skip learning the transition model entirely. Learn the *value function* or *Q-function* directly from sampled transitions.

Why is this possible? Because all we ultimately care about is the *policy* (which action to take), not the model. If we can estimate Q(s,a) well enough, we can act optimally without ever learning T or R explicitly.

The key insight - from the expected-age analogy - is that samples appear with the right frequencies. If going left from state s leads to a +10 reward 70% of the time, and you sample enough transitions, your running average will converge to the correct expected value.

**Pros**: No need to represent or store a transition model. Scales better in state-rich environments.  
**Cons**: Slower to converge; harder to incorporate prior knowledge about the physics.


## 4 Passive Reinforcement Learning

### What is passive RL

Passive RL is a *simpler subproblem*: you are given a fixed policy π (you don't choose actions), and your only job is to figure out how good that policy is - i.e., compute the value function V^π(s) for all states.

Think of it as a student following a teacher's instructions blindly and just recording how things turn out.

- You **know**: the fixed policy π(s)
- You **don't know**: T(s,a,s'), R(s,a,s')
- Your **goal**: learn V^π(s) for all s

### 41 Direct Utility Estimation Direct Evaluation

The simplest idea: just run the policy for many episodes. For each state s you visit, write down the sum of discounted future rewards from that point onward (the return G_t). Average these returns across all visits to s.

**Concretely:**
```typescript
For each episode:
    Run policy π from start to terminal state
    For each state s visited at time t:
        Compute return G_t = r_t + γ*r_{t+1} + γ²*r_{t+2} + ...
        Add G_t to a list for state s
After many episodes:
    V(s) = average of all recorded returns for s
```

**Example from lecture (γ=1):**

Grid: A, B, C, D, E. Terminal states give +10 or -10.

After 4 episodes the averages work out to approximately:
- V(B) = +8, V(C) = +4, V(D) = +10, V(E) = -2, V(A) = -10

**Why it eventually works**: By the law of large numbers, if you run enough episodes, each state's average return converges to the true expected value under π.

**The fatal flaw**: Direct evaluation ignores the *structure* of the MDP. States are connected - B and E both transition to C under this policy, so their values are not independent. Yet direct evaluation learns them completely separately, wasting information.

If B always leads to C (which has high value), then V(B) should reflect that immediately. But direct evaluation might take 100 episodes to figure out V(B) while simultaneously taking 100 episodes to figure out V(E), even though both could be inferred quickly from V(C) and the one-step reward.

### 42 Temporal Difference TD Learning

TD learning fixes the problem above by using the *Bellman structure*: the value of a state equals the immediate reward plus the discounted value of the next state.

**Key idea**: Every time you take a step (s → s' with reward r), you have a *sample* of what V(s) should be:

```text
sample = r + γ * V(s')
```

This is a noisy estimate of V(s). You incorporate it into a running average using a learning rate α:

```text
V(s) ← (1 - α) * V(s) + α * sample
V(s) ← V(s) + α * [sample - V(s)]
V(s) ← V(s) + α * [r + γ*V(s') - V(s)]
```

The term `r + γ*V(s') - V(s)` is called the **TD error** (or temporal difference error). It measures how much your current estimate V(s) differs from the one-step lookahead estimate.

**Why "temporal difference"?** Because you're taking the *difference* between a value estimate at time t (V(s)) and a value estimate at time t+1 (r + γ*V(s')). The signal propagates backward in time through these differences.

**Pseudocode: TD(0) Policy Evaluation**
```text
Initialize V(s) = 0 for all s (or small random values)
Set learning rate α (e.g., 0.1, decayed over time)

for each episode:
    s = start state
    while s is not terminal:
        a = π(s)                        # follow fixed policy
        r, s' = execute(a)              # take action, observe reward and next state
        V(s) ← V(s) + α * (r + γ*V(s') - V(s))   # TD update
        s = s'
```

**Example from lecture (γ=1, α=0.5):**

Initial: V(B)=0, V(C)=0, V(D)=0

Transition 1: B → C with reward -2
- sample = -2 + 1*V(C) = -2 + 0 = -2
- V(B) ← 0 + 0.5*(-2 - 0) = -1

Transition 2: C → D with reward -2
- sample = -2 + 1*V(D) = -2 + 0 = -2
- V(C) ← 0 + 0.5*(-2 - 0) = -1

As more transitions are observed and V(D) gets updated toward +8 (from reaching the +10 terminal), that information will *propagate back* through V(C) and then V(B) automatically. This is more efficient than direct evaluation.

**Learning rate requirements**: α must be decayed over time for convergence (e.g., α_t = 1/t). Too fast a decay and learning stops prematurely; too slow and the estimates oscillate. A common practical choice is to use a small fixed α (like 0.01) for a fixed number of iterations and not worry about formal convergence guarantees.


## 5 From Values to QValues

### The modelfree action selection problem

Suppose you've learned V^π(s) for all s using TD learning. Can you now improve the policy? In the MDP setting, you extract a policy by:

```text
π*(s) = argmax_a Σ_{s'} P(s'|s,a) * [R(s,a,s') + γ*V*(s')]
```

But this requires T(s,a,s') and R(s,a,s') - which you don't have in model-free RL! You're stuck. You know *how good* each state is, but you don't know *which action gets you there*.

**The fix: learn Q-values directly.**

Recall the definition:
```text
Q*(s,a) = Σ_{s'} P(s'|s,a) * [R(s,a,s') + γ * max_{a'} Q*(s',a')]
```

Q*(s,a) is the expected discounted return when you take action a in state s and then follow the optimal policy thereafter. Once you have Q*, policy extraction is trivial and model-free:

```text
π*(s) = argmax_a Q*(s,a)
```

No knowledge of T or R needed - just look up which action has the highest Q-value at each state.

### Qvalue iteration the offline version

Just like Value Iteration iterates the Bellman equation for V, you can iterate the Bellman equation for Q:

```text
Q_{k+1}(s,a) = Σ_{s'} P(s'|s,a) * [R(s,a,s') + γ * max_{a'} Q_k(s',a')]
```

Start with Q_0(s,a) = 0 everywhere. This converges to Q* in the limit, but again requires T and R.

**The model-free twist**: replace the sum over s' with a sample average.


## 6 Active Reinforcement Learning and QLearning

### Active RL the full problem

In passive RL you followed a fixed policy. Now you get to *choose* actions yourself, and the goal is to find the *optimal* policy. You're fully in the dark:

- Unknown T(s,a,s')
- Unknown R(s,a,s')
- You choose actions, observe (s, a, r, s') transitions
- Goal: learn π* (equivalently, learn Q*)

### QLearning

Q-Learning is the canonical model-free active RL algorithm. It approximates Q-value iteration using sample transitions.

**The update rule:**

Each time you observe transition (s, a, r, s'):

```text
sample = r + γ * max_{a'} Q(s', a')      # one-step lookahead estimate
Q(s,a) ← Q(s,a) + α * (sample - Q(s,a)) # running average update
```

Equivalently:
```text
Q(s,a) ← (1-α) * Q(s,a) + α * [r + γ * max_{a'} Q(s', a')]
```

**Intuition**: The `sample` is a noisy estimate of what Q(s,a) *should* be, based on this one experience. `max_{a'} Q(s', a')` is your current best guess at how much future reward you can get from s'. You take a small step α toward this new estimate and stay mostly with your old estimate.

**Why max over a'?** Because Q* satisfies the Bellman optimality equation, which involves a max. We're approximating that max sample-by-sample.

### QLearning Pseudocode

```python
function Q_Learning():
    # Initialize Q-table (can be a dictionary or 2D array)
    Q[s, a] = 0   for all s, a  (small random values except terminals = 0)
    
    for each episode:
        s = initial_state()
        
        while s is not terminal:
            a = select_action(s, Q)          # e.g., ε-greedy
            r, s' = execute_action(s, a)     # take action, observe result
            
            y = r + γ * max_{a'} Q[s', a']  # target (0 if s' is terminal)
            Q[s, a] ← Q[s, a] + α * (y - Q[s, a])  # update
            
            s = s'
    
    # Not shown: decay ε and α over time
    return Q
```

### Worked example Grid World

Consider a 1D grid: S1 - S2 - S3 - S4(terminal, reward=+10)

Actions: Left, Right. Reward -1 per step. γ=0.9, α=0.5.

Initial Q-table (all zeros):

| State | Q(s, Left) | Q(s, Right) |
| :---: | ---: | ---: |
| S1    | 0         | 0          |
| S2    | 0         | 0          |
| S3    | 0         | 0          |

**Episode 1**: Agent follows ε-greedy, say it takes Right from S3.
- s=S3, a=Right, r=-1, s'=S4 (terminal)
- y = -1 + 0.9 * 0 = -1  (max Q(S4,·) = 0 since terminal)
- Q(S3, Right) ← 0 + 0.5*(-1 - 0) = **-0.5**

**Episode 1 continued**: Earlier the agent was at S2, took Right.
- s=S2, a=Right, r=-1, s'=S3
- y = -1 + 0.9 * max(Q(S3,Left), Q(S3,Right)) = -1 + 0.9*max(0, -0.5) = -1 + 0 = -1
- Q(S2, Right) ← 0 + 0.5*(-1 - 0) = **-0.5**

But wait - the agent reached S4 with reward +10 somewhere too. Let's say in a later step when S4 is reached, the reward +10 is incorporated. Over many episodes, Q(S3, Right) will climb toward the discounted +10 signal and Q(S2, Right) will follow suit.

This backward propagation of reward is the essence of Q-learning. Initially only states adjacent to terminal states learn their values; gradually the reward signal propagates further back.

### QLearning is OffPolicy

One of the most important properties of Q-learning is that it is **off-policy**: the policy used to *collect data* (the behavior policy, typically ε-greedy) can be completely different from the policy being *learned* (the target policy, which is greedy w.r.t. Q).

The target update always uses `max_{a'} Q(s', a')`, which corresponds to the greedy (optimal) policy - regardless of what action the agent actually took next.

**Consequence**: Q-learning converges to Q* even if the agent is exploring randomly, as long as every (s,a) pair is visited infinitely often in the limit. This is a remarkable theoretical guarantee.

**Proof sketch (informal)**: The update rule is a stochastic approximation to the Bellman optimality operator. Under standard learning rate conditions (Σα = ∞, Σα² < ∞) and sufficient exploration, stochastic approximation theory guarantees convergence.


## 7 Exploration vs Exploitation

### The core dilemma

If the agent always chooses the action it *currently* believes is best (pure exploitation), it may never discover better actions. It gets stuck exploiting a locally good but globally suboptimal policy.

If the agent always explores randomly, it never actually uses the knowledge it accumulates.

**The dilemma**: you need to explore to gather better information, but you also need to exploit what you know to get reward. Every action is either exploration (spending reward to gather information) or exploitation (cashing in accumulated knowledge).

Real-world analogy: Do you go to your favorite restaurant (exploitation) or try a new place (exploration)? If you only exploit, you might miss the best restaurant in town. If you only explore, you never enjoy your favorites.

### Method 1 greedy

The simplest approach. At each step:

```text
With probability ε: choose a uniformly random action     # exploration
With probability 1-ε: choose argmax_a Q(s,a)             # exploitation
```

This yields the formal "soft" policy:

```text
π(a|s) = (1 - ε + ε/m)  if a = argmax_a Q(s,a)
π(a|s) = ε/m             for all other actions
```

where m is the number of actions.

**Problems with fixed ε**: The agent keeps exploring at the same rate even after learning a good policy. Late in training, 10% random actions might be actively destructive (imagine a robot in a dangerous environment).

**Solution**: Decay ε over time. Start high (e.g., ε=1.0 for pure exploration early on) and anneal toward 0 (pure exploitation once the agent has learned enough). A common schedule: ε_t = 1/t or ε_t = ε_0 * decay^t.

### Method 2 Softmax Boltzmann exploration

Instead of a hard binary choice (random vs. greedy), sample actions proportionally to their Q-values:

```text
P(a | s) = exp(Q(s,a) / τ) / Σ_{a'} exp(Q(s,a') / τ)
```

Where τ (temperature) controls the randomness:
- τ → ∞: uniform random (all actions equally likely)
- τ → 0: greedy (only the best action is chosen)
- Intermediate τ: better actions are more likely but not certain

**Advantage over ε-greedy**: The agent preferentially explores actions that look *promising*, not just any random action. If Q(s,Left)=5 and Q(s,Right)=1, softmax will explore Right occasionally but much less often than Left.

**Disadvantage**: Requires tuning τ and a decay schedule.

### Method 3 Exploration Functions

A smarter approach: actively prefer states that have been visited fewer times. Define an "optimistic" bonus that gets added to the Q-value estimate:

```typescript
f(u, n) = u + k/n        # simple bonus (u=value estimate, n=visit count, k=constant)
```

or:
```text
f(u, n) = R_max   if n < N_e    # act as if reward is maximum for rarely visited states
f(u, n) = u        otherwise
```

**Modified Q-value update:**
```text
Q(s,a) ← Q(s,a) + α * [R(s,a,s') + γ * max_{a'} f(Q(s',a'), N(s',a')) - Q(s,a)]
```

**Intuition**: The agent acts as if unvisited states are very rewarding. This forces it to explore unknown territory. As N(s,a) grows, the bonus shrinks and the agent relies more on the true Q-estimates.

**Key advantage**: The exploration bonus propagates backwards. A state that *leads* to unexplored states also gets a bonus, so the agent actively seeks paths to unknown territory.

### Regret

Even with a good exploration strategy, the agent makes mistakes early on. **Regret** measures the total cost of these mistakes: the cumulative difference between optimal rewards and actual rewards received during learning.

```text
Regret = Σ_t [V*(s_t) - V_actual(s_t)]
```

Both ε-greedy and exploration functions converge to the optimal policy, but ε-greedy typically has higher regret because it explores randomly rather than intelligently. For advanced treatment, see **Multi-Armed Bandits** and **UCB (Upper Confidence Bounds)**.


## 8 Approximate QLearning

### The scaling problem

Tabular Q-learning stores one number Q(s,a) per state-action pair. This works fine for small discrete state spaces (like our 4-state grid world). But in any realistic problem:

- Chess: ~10^47 states
- Go: ~10^170 states
- Atari games: millions of possible pixel configurations
- Continuous robot state spaces: uncountably infinite

Storing a table is impossible. And even if you could, you'd never visit most states during training - so the Q-values would remain at their initial values.

### FeatureBased Representation

**Key insight**: Many different states share relevant structure. Two Pacman game states where Pacman is 3 cells from a ghost are similar, even if every pellet configuration is different.

**Solution**: Describe each state s with a *feature vector* f(s) = [f₁(s), f₂(s), ..., f_n(s)].

Example features for Pacman:
- f₁(s) = distance to closest ghost
- f₂(s) = distance to closest pellet
- f₃(s) = number of remaining pellets
- f₄(s) = 1 if Pacman is in a tunnel, 0 otherwise
- f₅(s) = 1/(distance to nearest dot)²

You can also featurize state-action pairs f(s,a) directly (e.g., "this action moves closer to food").

### Linear QFunction Approximation

Approximate Q with a linear combination of features:

```
Q_w(s,a) = w₁*f₁(s,a) + w₂*f₂(s,a) + ... + wₙ*fₙ(s,a) = w · f(s,a)
```

Now you only need to learn n weights (the vector w), not one value per (s,a) pair. If n=10 features, you need 10 numbers regardless of how many states exist.

**Advantage**: Generalizes across states. If you learn that "being close to a ghost is bad" (negative weight for f₁), this knowledge applies to *every* state where you are close to a ghost - even ones you've never visited.

**Disadvantage**: The linear form may be too simple to capture complex value landscapes. Also, states that share features but differ in important ways will get the same Q-estimate.

### Approximate QLearning Update

The Q-learning update for linear function approximation is derived from online least squares (gradient descent on the squared TD error):

```text
Error = [r + γ * max_{a'} Q_w(s',a')] - Q_w(s,a)   # TD error
w_i ← w_i + α * Error * f_i(s,a)    for each weight i
```

In vector form: `w ← w + α * Error * f(s,a)`

**Intuition**:
- If something unexpectedly good happened (Error > 0): increase weights for features that were active in (s,a). This makes similar situations look more appealing in the future.
- If something unexpectedly bad happened (Error < 0): decrease weights for active features. Disprefer all states that "look like" this one.

### Approximate QLearning Pseudocode

```python
function Q_Learning_LinearFunctionApprox():
    w = random_small_vector()    # weight vector, length = number of features
    
    for each episode:
        s = initial_state()
        
        while s is not terminal:
            a = select_action(s, w)               # ε-greedy using Q_w(s,·)
            r, s' = execute_action(s, a)
            
            y = r + γ * max_{a'} Q_w(s', a')     # target (0 if s' is terminal)
            error = y - Q_w(s, a)                  # TD error
            
            w ← w + α * error * f(s, a)           # gradient step (vector update)
            
            s = s'
    
    return w
```

This is essentially stochastic gradient descent on the mean squared TD error.

### Deep QNetworks DQN Brief Overview

The natural extension of linear approximation is to replace the linear function w · f(s,a) with a **neural network** Q_θ(s,a) parameterized by weights θ.

The update is the same in principle:
```typescript
θ ← θ + α * Error * ∇_θ Q_θ(s,a)
```

But training neural networks with TD learning is notoriously unstable. The 2015 DeepMind DQN paper (which learned to play Atari games from raw pixels at superhuman level) introduced several stabilization tricks:

1. **Experience replay**: Store transitions in a replay buffer. Sample random mini-batches to break temporal correlations between consecutive updates.
2. **Target network**: Maintain a separate "frozen" copy of the network for computing the target `y = r + γ * max_{a'} Q_target(s',a')`. Update the target network periodically (not every step).

These are not on the exam slides, but they explain why deep RL works in practice.


## 9 Policy Search

### The mismatch between value accuracy and policy quality

A subtle but important observation: you don't need perfectly accurate Q-values to have a good policy. What you need is the *correct ordering* of Q-values at each state.

Example: Suppose Q*(s, Left)=100 and Q*(s, Right)=1. Your learned values might be Q(s, Left)=7 and Q(s, Right)=0.3. The absolute values are wrong by a factor of ~14, but the policy `argmax_a Q(s,a) = Left` is correct.

Conversely, Q-learning might learn Q(s, Left)=5 and Q(s, Right)=6 (wrong ordering!), giving the wrong action even though the values are "close" in absolute terms.

### Policy Search Direct Policy Optimization

Instead of learning Q and deriving a policy from it, **policy search** directly optimizes the policy parameters.

**Idea**: Parameterize the policy as π_θ(a|s) (e.g., a neural network or a linear function of features). Define the objective as expected total reward J(θ). Hill-climb in θ-space:

```text
θ ← θ + α * ∇_θ J(θ)
```

This is **Policy Gradient**, the foundation of modern RL algorithms like REINFORCE, PPO, and A3C.

**In the lecture's context**: Start with a Q-learning solution (which gives a reasonably good policy), then fine-tune the feature weights by hill-climbing on actual reward rather than Q-value accuracy.

**Why it matters**: Feature-based value functions that produce good decisions often aren't good approximators of V* or Q*. The "good enough for a policy" criterion is weaker than "accurately approximates the true value function."


## 10 Summary and Big Picture

### The complete RL taxonomy from this lecture

```text
Unknown MDP
├── Model-Based
│   ├── Passive (fixed policy): Adaptive Dynamic Programming
│   │   ├── Learn T̂, R̂ empirically
│   │   └── Run policy evaluation on learned model
│   └── Active (choose actions): ADP + policy extraction
│       ├── Learn model, solve for policy
│       └── Problem: greedy exploitation of learned model → suboptimal
│
└── Model-Free
    ├── Passive (fixed policy): TD Learning
    │   ├── Learn V^π directly from transitions
    │   └── No model needed; exploits Bellman structure
    └── Active (choose actions): Q-Learning
        ├── Learn Q* directly from transitions
        ├── Off-policy: behavior policy ≠ target policy
        └── ε-greedy or softmax for exploration
```

### Key equations to know

**TD(0) update (passive, value learning)**:
```text
V(s) ← V(s) + α * [r + γ*V(s') - V(s)]
```

**Q-Learning update (active, Q-value learning)**:
```text
Q(s,a) ← Q(s,a) + α * [r + γ*max_{a'} Q(s',a') - Q(s,a)]
```

**Approximate Q-Learning update (linear function approx)**:
```text
w ← w + α * [r + γ*max_{a'} Q_w(s',a') - Q_w(s,a)] * f(s,a)
```

### Critical properties of QLearning

1. **Convergence**: Q-learning converges to Q* given sufficient exploration and a decaying learning rate satisfying Σα = ∞ and Σα² < ∞.
2. **Off-policy**: The learning update is independent of the behavior policy; any policy that ensures exploration works.
3. **Sample inefficiency**: Tabular Q-learning can require enormous numbers of samples for large state spaces.
4. **No model needed**: Never needs T or R explicitly.

### Exploration strategies ranked by sophistication

| Method | Idea | Regret |
| :--- | :--- | :--- |
| Random (ε-greedy, fixed ε) | Explore uniformly | High |
| ε-greedy with decay | Less random over time | Medium |
| Softmax | Prefer promising unknowns | Medium |
| Exploration functions | Actively seek unvisited states | Low |
| UCB / Thompson sampling | Statistically principled | Optimal (Multi-Armed Bandits) |

### ModelBased vs ModelFree When to use which

There is no universally correct answer. From the lecture:

- If a reliable model already exists (or can be learned quickly): model-based is preferable. You can leverage decades of optimal planning research.
- If the state space is huge (pixels, continuous sensors) or the model is unreliable: model-free methods (especially deep RL) are often the only option.
- In practice, modern RL systems often *mix* both: use a neural network Q-function (model-free) with some model-based rollout planning on top.

### Looking forward beyond this course

Topics you'd encounter in an advanced RL course:
- **SARSA**: An *on-policy* alternative to Q-learning. The update uses the actual next action taken (a'), not the greedy action. Converges to a safe policy rather than the optimal policy when used with ε-greedy.
  ```text
  Q(s,a) ← Q(s,a) + α * [r + γ*Q(s',a') - Q(s,a)]    # a' was actually taken
  ```
- **Policy Gradient (REINFORCE)**: Directly optimize the policy by gradient ascent on expected reward.
- **Actor-Critic methods**: Combine a policy (actor) with a value function (critic) to reduce variance in policy gradient estimates.
- **Multi-Armed Bandits**: The exploration-exploitation problem in its purest form (no state transitions).
- **Model-Based Deep RL**: Learn a neural network model of the environment and plan using it (e.g., AlphaZero uses MCTS + a learned model).


*Notes compiled from COMP341 Lecture 16 slides. All pseudocode and examples are original teaching elaborations.*
