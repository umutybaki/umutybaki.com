---
title: "Lecture 2 Agents COMP341"
date: "2026-02-23"
description: "> Course: COMP341 - Introduction to Artificial Intelligence"
---

# Lecture 2 Agents COMP341

> **Course**: COMP341 - Introduction to Artificial Intelligence  
> **Institution**: Koç University  
> **Instructor**: Asst. Prof. Barış Akgün  
> **Topic**: What is an Agent? How do we design, classify, and program intelligent agents?



## 1 What Is an Agent

An **agent** is anything that:
1. **Perceives** its environment through **sensors**
2. **Acts** upon its environment through **actuators**

This is intentionally broad. A thermostat is an agent. A chess-playing program is an agent. A self-driving car is an agent. Even a human is an agent in this framework.

```text
                 ┌─────────────────────────────────┐
                 │          ENVIRONMENT             │
                 │                                  │
  ┌──────────────┤           ──────►                │
  │   AGENT      │  Sensors  Percepts               │
  │              │                                  │
  │    ┌──────┐  │                                  │
  │    │  π   │  │  Actions  Actuators              │
  │    └──────┘  │           ◄──────                │
  └──────────────┤                                  │
                 └─────────────────────────────────┘
```

**Key terms:**
- **Percept**: A single piece of sensory input at one moment in time (e.g., a camera frame, a temperature reading).
- **Percept history**: The complete sequence of all percepts the agent has ever received: `[s₀, s₁, s₂, ..., sₜ]`.
- **Action**: Something the agent does to affect the environment (e.g., turn left, pick up object, send message).
- **Policy (π)**: The agent's "brain" - a function that maps percept histories to actions.

Formally:
```text
π : H → A
```
where H is the space of all possible histories and A is the set of possible actions.

**Intuition**: Think of an agent as a decision-making loop running forever:

```python
def agent_loop(agent, environment):
    percept_history = []
    while True:
        percept = environment.sense()          # read sensors
        percept_history.append(percept)
        action = agent.policy(percept_history) # decide
        environment.execute(action)            # act
```


## 2 The Rational Agent

The central thesis of AI as defined by this course:

> **AI is the science of making agents that act rationally.**

### What does rational mean

A **rational agent** is one that acts to **maximize its expected utility**.

- **Utility**: A numerical measure of how "good" an outcome is for the agent. Think of it like a score - higher is better.
- **Expected**: Because the future is uncertain, we cannot guarantee the best outcome; we try to maximize the *expected* (average) value over all possible outcomes.

### Is perfect rationality achievable

No - and this is an important nuance. Consider:
- The agent may not have complete information about the world.
- The agent has limited computational resources.
- The environment may be non-deterministic (random).

The goal in practice is **bounded rationality**: doing the best you can given the information and time available. This is a deep philosophical question - the course cites it as a "read" topic, but the key takeaway is that maximizing expected utility is our working definition of rational behavior.

**Analogy**: A chess grandmaster cannot compute every possible game tree (there are more positions than atoms in the universe), but they use heuristics, pattern recognition, and lookahead to play extremely well. They are boundedly rational.


## 3 Formulating an AI Problem PEAS

Before you can build an agent, you need to formally describe the problem. The **PEAS** framework provides this structure:

| Letter | Stands For | Question to Answer |
| :---: | :--- | :--- |
| **P** | Performance Measure / Utility | How do we measure success? What score are we maximizing? |
| **E** | Environment | What world does the agent live in? |
| **A** | Actuators | What actions can the agent take? |
| **S** | Sensors / Percepts | What can the agent perceive? |

### Example A Vacuum Cleaning Robot

| PEAS Component | Details |
| :--- | :--- |
| **Performance** | % of floor clean; time taken; energy used |
| **Environment** | Rooms (A and B), may be dirty or clean |
| **Actuators** | Move left/right, Suck dirt |
| **Sensors** | Current location, whether current cell is dirty |

### Example PacMan Agent

| PEAS Component | Details |
| :--- | :--- |
| **Performance** | Score (eating dots = +10, eating ghost = +200, dying = -500) |
| **Environment** | Maze grid with walls, food dots, power capsules, ghosts |
| **Actuators** | Move North, South, East, West, Stop |
| **Sensors** | Pacman location, ghost locations + scaredness duration, food positions, score |

**Why does PEAS matter?** Because AI is only as good as the problem formulation. A poorly defined utility function leads to unexpected and potentially harmful behavior - this is the famous "reward hacking" problem in modern AI.


## 4 The Environment and State

### The Environment

The environment is everything outside the agent that the agent interacts with. A crucial insight from the lecture:

> **The agent is in the environment and is *part* of it.**

This means the agent's actions change the environment, which in turn produces new percepts, which influence future actions - a feedback loop.

### Representing the Environment Abstraction

You cannot include every detail of the real world in your agent's model. You must **abstract** - keep only the details that matter for the task.

**Example: Finding a path from A to B in Istanbul**
- Do the roads matter? **YES** - the route depends on them.
- Does the temperature/humidity matter? **NO** - for a navigation task, irrelevant.
- Do the buildings matter? **NO** - unless you are routing through or around them.

The **state** is an abstracted description of the environment that contains only the relevant information.

### Environment Properties Taxonomy

When classifying environments, we use the following dimensions:

#### 1. Fully Observable vs. Partially Observable
- **Fully observable**: The agent's sensors give it access to the complete state of the environment at each point in time. Example: chess (you can see the whole board).
- **Partially observable**: The agent cannot see everything. Example: poker (you do not see opponents' cards), driving (you cannot see around corners).

#### 2. Deterministic vs. Stochastic
- **Deterministic**: The next state of the environment is completely determined by the current state and the agent's action. No randomness.
- **Stochastic**: There is uncertainty - the same action in the same state can lead to different outcomes. Example: rolling dice, weather.

#### 3. Episodic vs. Sequential
- **Episodic**: Each action/decision is independent. The agent perceives, acts, and the episode ends. Past actions do not affect future ones. Example: classifying an image.
- **Sequential**: Current decisions affect future ones. The agent must think ahead. Example: chess, driving.

#### 4. Static vs. Dynamic
- **Static**: The environment does not change while the agent is thinking. Example: crossword puzzle.
- **Dynamic**: The environment changes while the agent deliberates. Example: driving - other cars keep moving even when you are thinking.
- **Semidynamic**: The environment itself does not change, but the agent's performance score does (e.g., timed chess).

#### 5. Discrete vs. Continuous
- **Discrete**: Finite number of distinct states and actions. Example: chess.
- **Continuous**: States and actions are real-valued. Example: robot arm angles, driving speed.

#### 6. Single-Agent vs. Multi-Agent
- **Single-agent**: Only one agent acting. Example: solving a maze.
- **Multi-agent**: Multiple agents, possibly cooperative or competitive. Example: chess (competitive), multi-robot warehouse (cooperative).


## 5 Why Is AI Hard The Mathematical View

The lecture formalizes the challenge with this notation:

```text
π : H → A
H = [S₀, S₁, ..., Sₜ]     (percept/state history up to time t)
Goal: max E[U]              (maximize expected utility)
```

The problem is one of **combinatorial explosion**:

- Let `|S|` = number of possible states, `|A|` = number of possible actions.
- A lookup table mapping every state to an action has size `|S| × |A|`.
- A history-to-action mapping has size `|S|^(t+1) × |A|` - it grows **exponentially** with time.

For any non-trivial problem, this is completely intractable. Consider:
- Chess has roughly 10^43 legal positions.
- The observable universe has roughly 10^80 atoms.
- A table enumerating all chess positions would be physically impossible to store.

**This is why AI is hard**: the space of possible histories and actions is astronomically large. The whole field of AI is essentially about finding smart ways to represent and compute the policy π without enumerating everything explicitly.


## 6 How to Program a Policy

There are several broad approaches to implementing a policy:

| Approach | Description | Examples |
| :--- | :--- | :--- |
| **Look-up table** | Store every (state, action) pair explicitly | Tiny toy problems only |
| **Rules** | Hand-coded IF-THEN rules | Expert systems, simple reflex agents |
| **Functions** | Parameterized functions (e.g., neural nets) | Deep learning, function approximation |
| **Goals** | Search for action sequences that achieve a goal | Planning, search algorithms |

The rest of the lecture explores these through concrete **agent architectures**.


## 7 Agent Types Overview

The lecture organizes agent types along two axes:

```
REFLEX AGENTS                    PLANNING AGENTS
(react to current state)         (think about future states)
        |                                 |
        v                                 v
Simple Reflex              Goal-Based Agent
Model-Based Reflex         Utility-Based Agent
```

**The core distinction:**
- **Reflex agents**: Map the current state (or state history) directly to an action. Ask: *"What is the world like NOW?"*
- **Planning agents**: Consider what the world would be like after various sequences of actions. Ask: *"What would the world be like IF I did X, then Y?"*


## 8 Simple Reflex Agents

### Concept of Simple Reflex Agents

A simple reflex agent selects actions based solely on the **current percept**, ignoring history. It uses **condition-action rules** (sometimes called "if-then" rules or "stimulus-response" rules).

```typescript
Current Percept → [Rule Matching] → Action
```

```text
+---------------+
|   Sensors     |
+-------+-------+
        | current percept
        v
+---------------------+
|  Condition-Action   |
|  Rules              |
|  IF dirty THEN Suck |
|  IF clean THEN Move |
+-------+-------------+
        | action
        v
+---------------+
|  Actuators    |
+---------------+
```

### Example Vacuum World

**State**: `<location, status>` where location in {A, B} and status in {dirty, clean}

**Actions**: `{Move, Suck}`

Two equivalent formulations of the same policy:

**As a lookup table:**

| State | Action |
| :--- | :---: |
| (A, clean) | Move |
| (A, dirty) | Suck |
| (B, clean) | Move |
| (B, dirty) | Suck |

**As an if-then rule:**

```python
def simple_reflex_vacuum(location, status):
    if status == "dirty":
        return "Suck"
    else:
        return "Move"
```

Both encode the same policy. The rule form is more compact and generalizes better.

### When to Use Simple Reflex Agents

- When the environment is **fully observable** (the current percept tells you everything you need).
- When the task is **episodic** or **memoryless**.
- When the state space is small enough to enumerate rules.

### Limitations

- Cannot handle partial observability (no memory of past states).
- Cannot reason about consequences of actions.
- Rules must be hand-coded - brittle in complex environments.

**Real-world analogies**: A smoke detector (if smoke detected → sound alarm), a simple thermostat (if temperature < setpoint → heat on).


## 9 ModelBased Reflex Agents

### Motivation for ModelBased Reflex Agents

What if the agent **cannot perceive everything**? For example:
- A robot navigating a maze can only see nearby walls, not the entire maze.
- Pac-Man cannot "see through walls" to know where ghosts are behind them.

In these cases, the agent needs an **internal model** of the world - a representation of the parts of the environment it cannot directly see.

### How ModelBased Reflex Agents Works

A model-based reflex agent maintains an **internal state** (also called a **belief state**) that is updated using:
1. **How the world evolves** on its own (e.g., ghosts move randomly).
2. **How the agent's actions affect the world** (e.g., moving north moves Pac-Man one cell up).

The state update function is often written as:
```
s(t+1) = T(s(t), a)
```
where T is the **transition model** (or world model).

```text
+------------------------------------------+
|               AGENT                      |
|                                          |
|  Sensors -> percept                      |
|      |                                   |
|      v                                   |
|  +------------------+                    |
|  |  Internal State  | <- world model     |
|  |  (belief state)  |   T(s, a) = s'     |
|  +--------+---------+                    |
|           | current internal state       |
|           v                              |
|  +------------------+                    |
|  |  Condition-Action|                    |
|  |  Rules           |                    |
|  +--------+---------+                    |
|           | action                       |
|           v                              |
|        Actuators                         |
+------------------------------------------+
```

### Example PacMan as a ModelBased Agent

**Internal state** tracks:
- Maze layout (food, power capsules, empty space, walls) - static
- Ghost locations and how long ghosts remain scared - **dynamic**
- Pac-Man's own location
- Current score

**World model** answers: *"If I move North from state s, what is the new state?"*

```python
def transition(state, action):
    new_state = state.copy()
    # Move Pac-Man
    new_pos = move(state.pacman_pos, action)
    if not state.is_wall(new_pos):
        new_state.pacman_pos = new_pos
    # Update food
    if new_pos in new_state.food:
        new_state.food.remove(new_pos)
        new_state.score += 10
    # Update ghosts (simple model: assume they stay put for now)
    return new_state
```

**Selecting the next action** using the model:
1. For each possible action a in {North, South, East, West, Stop}:
  - Simulate: `s_next = T(s_current, a)`
  - Evaluate: `score = evaluate(s_next)`
2. Choose the action with the highest score.

```python
def model_based_reflex_policy(current_state, world_model, eval_fn):
    best_action = None
    best_score = float('-inf')
    for action in ACTIONS:
        next_state = world_model(current_state, action)
        score = eval_fn(next_state)
        if score > best_score:
            best_score = score
            best_action = action
    return best_action
```

This is a **one-step lookahead** - we look one step into the future. Planning agents look many steps ahead.

### Key Point

A model-based reflex agent is especially powerful when:
- The environment is **partially observable** (the internal state fills in the gaps).
- The dynamics are known or can be estimated.

The critical insight is that even if the agent can only see a limited window, it can **maintain a belief about the full state** using the model.


## 10 GoalBased Agents Planning

### Concept of GoalBased Agents Planning

A goal-based agent does not just react to the current state - it **plans** a sequence of actions to reach a desired **goal state**.

```text
Current State → [Search/Planning] → Sequence of Actions → Goal State
```

The agent asks: *"What sequence of actions will get me from where I am now to where I want to be?"*

**Key requirement**: The agent **must have a world model** (a transition function T) because it needs to simulate future states without actually executing the actions. Without a model, you cannot plan.

### Example GPS Navigation

- **Current state**: At location A (e.g., Koç University campus).
- **Goal state**: At location B (e.g., Istanbul Airport).
- **World model**: Road network - what roads connect which locations.
- **Actions**: Drive along a specific road segment.
- **Planning**: Find a path (sequence of roads) from A to B.

The GPS does not just react to where you are - it plans ahead, considering future turns, traffic, and distances.

### GoalBased vs Reflex The Key Difference

| Aspect | Reflex Agent | Goal-Based Agent |
| :--- | :--- | :--- |
| Horizon | Current moment | Future states |
| Question | "What is the world like NOW?" | "What would the world be like IF I did this?" |
| Flexibility | Rigid rules | Can adapt to new goals |
| Requires model? | No (simple) / Yes (model-based) | Always yes |
| Example | Thermostat | GPS, chess player |

**Limitation of goal-based agents**: Having multiple goals of different importance is hard to handle. Should you take the fastest route or the most scenic? "Reach the destination" does not differentiate between options.


## 11 UtilityBased Agents

### Motivation for UtilityBased Agents

Goal-based agents only care about **whether** a goal is achieved - binary. But in the real world, some ways of achieving a goal are better than others:

- Both routes get you from A to B, but one is faster.
- Both chess moves result in a win, but one is more efficient.

A **utility-based agent** uses a **utility function** U(s) that assigns a numerical value to each state, allowing it to compare not just goal vs. non-goal, but **degrees of goodness**.

```text
Goal-Based:    Did I reach the goal? (Yes/No)
Utility-Based: How good is this outcome on a scale? (Numerical)
```

### How UtilityBased Agents Works

The agent tries to find the action (or sequence of actions) that leads to states with **maximum expected utility**:

```text
argmax_a  E[ U(T(s, a)) ]
```

In words: choose the action a such that the expected utility of the resulting state is highest.

### Example Navigation with Preferences

```
Goal-based GPS:    Find ANY path from Koç University to the Airport.

Utility-based GPS: Find the path that minimizes travel time AND
                   maximizes comfort (avoids highways if preferred)
                   AND minimizes fuel cost.
```

The utility function might be:
```python
U(route) = -0.5 * travel_time - 0.3 * distance - 0.2 * highway_penalty
```

The weights (0.5, 0.3, 0.2) encode the designer's preferences.

### The Reflex vs Planning Distinction Revisited

The lecture draws this clean contrast:

```text
REFLEX:   π maps (current state) → action
          "How is the environment RIGHT NOW?"
          Uses: lookup tables, if-then rules,
                control laws (e.g., PID controllers u = k*e + k_d * de/dt)

PLANNING: π maps (current state + simulated futures) → action
          "How WOULD the environment be if I took action X?"
          Uses: search algorithms, planning, optimization
```


## 12 State Evaluation and Feature Functions

When a model-based or planning agent needs to evaluate a state (to decide which action is best), it uses an **evaluation function** J(x).

### Linear FeatureBased Evaluation

A common and interpretable form is the **weighted linear combination of features**:

```
J(x) = w1*f1(x) + w2*f2(x) + ... + wn*fn(x) = sum_i( wi * fi(x) )
```

Where:
- **x** is the current state.
- **fi(x)** is the i-th feature extracted from state x - a real-valued quantity describing some aspect of x.
- **wi** is the weight (importance) of feature i.

### Example PacMan Evaluation Function

Features that might describe how "good" a Pac-Man state is:

| Feature fi(x) | Why it matters | Weight sign |
| :--- | :--- | :--- |
| Score change (delta score) | Direct measure of progress | + (positive is good) |
| Distance to nearest food dot | Closer food = better | - (smaller distance = higher utility, so negate) |
| Distance to nearest power capsule | Useful if ghosts are nearby | +/- |
| Distance to nearest ghost | Far from danger = better | + (larger distance = safer) |
| Whether ghost is edible + duration | Edible ghost = opportunity | + |

```python
def evaluate_pacman_state(state, weights):
    features = [
        delta_score(state),
        -nearest_food_distance(state),    # negate: closer is better
        +nearest_ghost_distance(state),   # positive: farther is safer
        edible_ghost_bonus(state),
    ]
    return sum(w * f for w, f in zip(weights, features))
```

### How are weights set

- **Hand-tuned**: A human designer manually adjusts weights based on domain knowledge and trial-and-error.
- **Learned**: Machine learning algorithms can optimize weights automatically (this connects to later course material).

### Distances How to Compute

A natural question arises: how do you compute distances (e.g., to nearest food, to nearest ghost) in a maze?

- **Euclidean distance**: Straight-line `sqrt((x1-x2)^2 + (y1-y2)^2)` - fast to compute but ignores walls.
- **Manhattan distance**: `|x1-x2| + |y1-y2|` - better approximation on grids, still ignores walls.
- **Maze distance (BFS/shortest path)**: Actual shortest path through the maze - most accurate but more expensive to compute.

The trade-off: accuracy vs. computational cost. A cheap but inaccurate distance estimate might mislead the agent; an accurate estimate costs more computation.


## 13 Learning Agents

### The Question

All the agents described so far - reflex, model-based, goal-based, utility-based - need to be **designed** by a human. But where do the rules, weights, and models come from?

- **Engineered**: Human experts hand-code the rules and parameters (traditional AI/expert systems).
- **Learned**: The agent learns from experience - by interacting with the environment and observing outcomes.
- **Mixed**: A combination - the structure is engineered but parameters are learned.

### Learning Agent Architecture

A learning agent has four conceptual components:

```typescript
+----------------------------------------------+
|                LEARNING AGENT                |
|                                              |
|  +--------------+    +--------------------+  |
|  | Learning     |<---| Critic             |  |
|  | Element      |    | (evaluates perf    |  |
|  +------+-------+    |  against standard) |  |
|         | updates    +--------------------+  |
|         v                                    |
|  +--------------+                            |
|  | Performance  |<--- Percepts (sensors)     |
|  | Element      |---> Actions (actuators)    |
|  | (policy pi)  |                            |
|  +------+-------+                            |
|         |                                    |
|  +------v-------+                            |
|  | Problem      | <- Suggests new            |
|  | Generator    |    experiences to explore  |
|  +--------------+                            |
+----------------------------------------------+
```

- **Performance element**: The actual policy that selects actions (what we have been calling π).
- **Critic**: Observes the agent's behavior and provides feedback (e.g., "that was a good move" / "you died - bad").
- **Learning element**: Uses the critic's feedback to improve the performance element.
- **Problem generator**: Suggests exploratory actions - sometimes doing something suboptimal now to gather information that improves future behavior (exploration vs. exploitation trade-off).

### Why This Matters

The learning agent architecture is foundational to modern AI:
- **Supervised learning**: Human provides labeled examples; critic evaluates on held-out data.
- **Reinforcement learning**: Environment provides rewards; critic is the reward signal.
- **Unsupervised learning**: No explicit critic; learning element finds structure in data.

The key insight is that **learning and acting are coupled**: the agent's behavior generates experience, which is used to improve future behavior. This is the essence of AI as a self-improving system.


## 14 Summary and Mental Map

### The Agent Hierarchy

```text
AGENTS
├── Reflex (react to current state)
│   ├── Simple Reflex
│   │   ├── IF-THEN rules on current percept only
│   │   ├── No memory, no world model
│   │   └── Example: Vacuum cleaner, thermostat
│   │
│   └── Model-Based Reflex
│       ├── Maintains internal belief state
│       ├── Has world model T(s,a) = s'
│       ├── Evaluates ONE-step future states
│       └── Example: Pac-Man with one-step lookahead
│
└── Planning (reason about future states)
    ├── Goal-Based
    │   ├── Searches for action sequences that reach a goal
    │   ├── Requires world model
    │   └── Example: GPS navigation, BFS/DFS search
    │
    └── Utility-Based
        ├── Like goal-based but optimizes quality
        ├── Uses utility function U(s) to rank states numerically
        ├── Handles trade-offs between competing objectives
        └── Example: GPS with time/comfort/cost trade-offs

ALL AGENTS CAN BE:
├── Engineered (hand-coded rules/weights)
├── Learned (machine learning)
└── Mixed (engineered structure + learned parameters)
```

### Key Equations to Remember

| Concept | Formula | Meaning |
| :--- | :--- | :--- |
| Policy | `π : H → A` | Maps history to action |
| History | `H = [S₀, S₁, ..., Sₜ]` | Sequence of past states |
| Rationality | `max E[U]` | Maximize expected utility |
| Transition | `s(t+1) = T(s(t), a)` | World model / dynamics |
| Evaluation | `J(x) = Σ wᵢ·fᵢ(x)` | Weighted feature sum |

### Quick Reference Choosing an Agent Type

| Problem Characteristics | Recommended Agent Type |
| :--- | :--- |
| Fully observable, simple rules suffice | Simple Reflex |
| Partially observable, no long-term planning needed | Model-Based Reflex |
| Need to reach a specific goal state | Goal-Based (Planning) |
| Need to optimize quality among multiple competing objectives | Utility-Based |
| Rules/parameters unknown, can learn from experience | Learning Agent |

### The Grand Challenge Restated

AI is hard because:
1. The state space `|S|` is exponentially large.
2. The history space `|H|` is even larger (exponential in time t).
3. Computing the optimal policy π exactly is intractable for most real problems.

**Everything in this course is a technique for dealing with this fundamental intractability** - through search, approximation, learning, or clever representation.


*Notes compiled from COMP341 Lecture 2 slides. For deeper reading, refer to Russell and Norvig "Artificial Intelligence: A Modern Approach", Chapter 2.*
